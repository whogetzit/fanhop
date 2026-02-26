import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhop.com'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
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
      { user_id: user.id, name, weights, champion, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,name' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function loadModelsFromCloud() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function deleteModelFromCloud(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('models').delete().eq('id', id)
  if (error) throw error
}
