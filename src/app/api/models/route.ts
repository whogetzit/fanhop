import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabase.from('models').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, weights, champion } = await req.json()
  if (!name || !weights) return NextResponse.json({ error: 'name and weights required' }, { status: 400 })
  const { data: existing } = await supabase.from('models').select('id').eq('user_id', user.id).ilike('name', name).single()
  if (existing) {
    const { data, error } = await supabase.from('models').update({ weights, champion, updated_at: new Date().toISOString() } as never).eq('id', existing.id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ...data, updated: true })
  }
  const { data, error } = await supabase.from('models').insert({ user_id: user.id, name, weights, champion } as never).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ...data, updated: false })
}
