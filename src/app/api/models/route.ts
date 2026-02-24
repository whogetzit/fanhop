import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, weights, champion } = body

  if (!name || !weights) {
    return NextResponse.json({ error: 'name and weights required' }, { status: 400 })
  }

  // Upsert by name — update if exists, insert if not
  const { data: existing } = await supabase
    .from('models')
    .select('id')
    .eq('user_id', user.id)
    .ilike('name', name)
    .single()

  let result
  if (existing) {
    const { data, error } = await supabase
      .from('models')
      .update({ weights, champion, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = { ...data, updated: true }
  } else {
    const { data, error } = await supabase
      .from('models')
      .insert({ user_id: user.id, name, weights, champion })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = { ...data, updated: false }
  }

  return NextResponse.json(result)
}
