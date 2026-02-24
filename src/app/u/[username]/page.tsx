import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'

interface Props { params: { username: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username}'s Brackets`,
    description: `Check out ${params.username}'s March Madness bracket models on FanHop`,
  }
}

export default async function ProfilePage({ params }: Props) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) notFound()

  const { data: models } = await supabase
    .from('models')
    .select('id, name, champion, weights, is_public, like_count, created_at')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  // Get current user to check if viewing own profile
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === profile.id

  // If owner, also fetch private models
  let privateModels = null
  if (isOwner) {
    const { data } = await supabase
      .from('models')
      .select('id, name, champion, weights, is_public, like_count, created_at')
      .eq('user_id', profile.id)
      .eq('is_public', false)
      .order('created_at', { ascending: false })
    privateModels = data
  }

  return (
    <ProfileClient
      profile={profile}
      publicModels={models ?? []}
      privateModels={privateModels ?? []}
      isOwner={isOwner}
    />
  )
}
