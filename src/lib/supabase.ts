// @ts-nocheck
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'
import { DEFAULT_YEAR_NUM } from '@/lib/simulation'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhop.com'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null as any
  return createBrowserClient<Database>(url, key)
}

export async function signInWithGoogle() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${APP_URL}/auth/callback` },
  })
}

export async function signInWithMagicLink(email: string) {
  const supabase = createClient()
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${APP_URL}/auth/callback` },
  })
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}

export async function saveModelToCloud(
  name: string,
  weights: Record<string, number>,
  champion: string,
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')

  const { data, error } = await supabase
    .from('models')
    .upsert(
      { user_id: user.id, name, weights, champion, year: DEFAULT_YEAR_NUM, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,name' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function loadModelsFromCloud(year: number = DEFAULT_YEAR_NUM) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('models')
    .select('id, name, champion, weights, updated_at')
    .eq('user_id', user.id)
    .eq('year', year)
    .order('updated_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function deleteModelFromCloud(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('models').delete().eq('id', id)
  if (error) throw error
}
