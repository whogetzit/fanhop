/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for single-instance deployments (Vercel serverless resets on cold start,
 * which is acceptable — it means rate limits are per-instance, not global).
 */

interface Entry {
  timestamps: number[]
}

const store = new Map<string, Entry>()

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - windowMs
  store.forEach((entry, key) => {
    entry.timestamps = entry.timestamps.filter(t => t > cutoff)
    if (entry.timestamps.length === 0) store.delete(key)
  })
}

/**
 * Check if a request should be rate-limited.
 * @param key   Unique identifier (e.g. user ID or IP)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds (default: 60s)
 * @returns { limited: boolean, remaining: number }
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number = 60_000,
): { limited: boolean; remaining: number } {
  cleanup(windowMs)

  const now = Date.now()
  const cutoff = now - windowMs
  let entry = store.get(key)

  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter(t => t > cutoff)

  if (entry.timestamps.length >= limit) {
    return { limited: true, remaining: 0 }
  }

  entry.timestamps.push(now)
  return { limited: false, remaining: limit - entry.timestamps.length }
}
