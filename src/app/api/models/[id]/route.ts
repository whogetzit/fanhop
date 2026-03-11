import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { limited } = await rateLimit(`models:${user.id}`, 20, 60_000)
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const body = await req.json()
  if (typeof body.is_public !== 'boolean')
    return NextResponse.json({ error: 'is_public must be a boolean' }, { status: 400 })
  const { data, error } = await supabase.from('models').update({ is_public: body.is_public, updated_at: new Date().toISOString() } as never).eq('id', params.id).eq('user_id', user.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { limited } = await rateLimit(`models:${user.id}`, 20, 60_000)
  if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  const { error } = await supabase.from('models').delete().eq('id', params.id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deleted: true })
}
