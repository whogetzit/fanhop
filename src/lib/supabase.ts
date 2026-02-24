import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// ─── Browser client (use in Client Components) ────────────────────────────────
// Call this inside components/hooks, not at module level

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signInWithGitHub() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  })
}

export async function signInWithGoogle() {
  const supabase = createClient()
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
  })
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}
