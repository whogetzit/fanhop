import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProfilePage from '@/components/ProfilePage'

interface Props { params: { userId: string } }

async function getProfile(userId: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )

  const { data: models } = await supabase
    .from('models')
    .select('*')
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('updated_at', { ascending: false })

  const { data: userData } = await supabase.auth.admin.getUserById(userId).catch(() => ({ data: null }))

  return { models: models ?? [], email: userData?.user?.email ?? null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { models, email } = await getProfile(params.userId)
  const name = email?.split('@')[0] ?? 'Anonymous'
  return {
    title: `${name}'s Brackets`,
    description: `${models.length} public bracket model${models.length !== 1 ? 's' : ''} on FanHop`,
  }
}

export default async function Page({ params }: Props) {
  const { models, email } = await getProfile(params.userId)
  if (!models.length) notFound()

  return <ProfilePage models={models} email={email} userId={params.userId} />
}
