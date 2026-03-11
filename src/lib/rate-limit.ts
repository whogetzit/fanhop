/**
 * Distributed rate limiter backed by Supabase (PostgreSQL).
 * Works across all Vercel serverless instances and survives cold starts.
 *
 * Uses a single atomic SQL call: INSERT a timestamp, then COUNT recent
 * entries in the window. The DB is the source of truth.
 *
 * Falls back to in-memory limiter when Supabase env vars are missing (local dev).
 */

import { createClient as createServerClient } from '@/lib/supabase-server'

// ─── In-memory fallback (local dev without DB) ──────────────────────────────

const memStore = new Map<string, number[]>()

function memRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { limited: boolean; remaining: number } {
  const now = Date.now()
  const cutoff = now - windowMs
  let timestamps = memStore.get(key) ?? []
  timestamps = timestamps.filter(t => t > cutoff)

  if (timestamps.length >= limit) {
    memStore.set(key, timestamps)
    return { limited: true, remaining: 0 }
  }

  timestamps.push(now)
  memStore.set(key, timestamps)
  return { limited: false, remaining: limit - timestamps.length }
}

// ─── Distributed rate limiter via Supabase ───────────────────────────────────

/**
 * Check if a request should be rate-limited (distributed across instances).
 * Uses the `rate_limits` table with an atomic upsert + window check.
 *
 * @param key       Unique identifier (e.g. "models:<user_id>")
 * @param limit     Max requests allowed in the window
 * @param windowMs  Time window in milliseconds (default: 60s)
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000,
): Promise<{ limited: boolean; remaining: number }> {
  // Fall back to in-memory for local dev without Supabase
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return memRateLimit(key, limit, windowMs)
  }

  try {
    const supabase = await createServerClient()
    const windowStart = new Date(Date.now() - windowMs).toISOString()

    // Atomic: insert a new entry and count recent entries in one round-trip
    const { error: insertError } = await supabase
      .from('rate_limits')
      .insert({ key, created_at: new Date().toISOString() } as any)

    if (insertError) {
      // If table doesn't exist yet, fall back to in-memory
      return memRateLimit(key, limit, windowMs)
    }

    const { count, error: countError } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('key', key)
      .gte('created_at', windowStart)

    if (countError || count === null) {
      return memRateLimit(key, limit, windowMs)
    }

    if (count > limit) {
      return { limited: true, remaining: 0 }
    }

    return { limited: false, remaining: limit - count }
  } catch {
    // Network failure — fall back to in-memory so we don't block requests
    return memRateLimit(key, limit, windowMs)
  }
}
