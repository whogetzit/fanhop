// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { STAT_KEYS } from '@/types/bracket'
import { rateLimit } from '@/lib/rate-limit'

const MAX_NAME_LEN = 100
const MAX_CHAMPION_LEN = 100

function isValidWeights(w: unknown): w is Record<string, number> {
  if (!w || typeof w !== 'object' || Array.isArray(w)) return false
  const obj = w as Record<string, unknown>
  return STAT_KEYS.every(k => typeof obj[k] === 'number' && obj[k] >= 0 && obj[k] <= 10)
}

const MAX_PAGE_SIZE = 50

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const limit = Math.min(Number(searchParams.get('limit')) || MAX_PAGE_SIZE, MAX_PAGE_SIZE)
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0)

  const { data, error } = await supabase
    .from('models')
    .select('id, name, weights, champion, is_public, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Rate limit: 20 saves per minute per user
  const { limited } = rateLimit(`models:${user.id}`, 20, 60_000)
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { name, weights, champion } = await req.json()
  if (!name || typeof name !== 'string' || name.length > MAX_NAME_LEN)
    return NextResponse.json({ error: 'name must be a string (max 100 chars)' }, { status: 400 })
  if (!isValidWeights(weights))
    return NextResponse.json({ error: 'weights must contain all stat keys with values 0-10' }, { status: 400 })
  if (champion !== undefined && (typeof champion !== 'string' || champion.length > MAX_CHAMPION_LEN))
    return NextResponse.json({ error: 'champion must be a string (max 100 chars)' }, { status: 400 })
  // Atomic upsert — requires UNIQUE(user_id, name) constraint on models table
  const { data, error } = await supabase
    .from('models')
    .upsert(
      { user_id: user.id, name, weights, champion, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,name' }
    )
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}