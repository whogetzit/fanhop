// @ts-nocheck
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DEFAULT_YEAR_NUM } from '@/lib/simulation'
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

  // Try lookup by username first, then fall back to id (profile link uses user.id)
  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    const { data: byId } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.username)
      .single()
    profile = byId
  }

  // If no profile exists but the param looks like a user ID, create a stub profile
  if (!profile) {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser && authUser.id === params.username) {
      // Auto-create a profile for the signed-in user
      const username = authUser.email?.split('@')[0] ?? authUser.id.slice(0, 8)
      const { data: newProfile } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          username,
          display_name: authUser.user_metadata?.full_name ?? username,
        })
        .select('*')
        .single()
      profile = newProfile
    }
  }

  if (!profile) notFound()

  const { data: models } = await supabase
    .from('models')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .eq('year', DEFAULT_YEAR_NUM)
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
      .eq('year', DEFAULT_YEAR_NUM)
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
