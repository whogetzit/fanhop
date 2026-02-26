// @ts-nocheck
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProfileClient from './ProfileClient'

interface Props { params: { username: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username}'s Brackets — FanHop`,
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

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === profile.id

  // Only the owner can see their saved brackets
  const models = isOwner
    ? (await supabase
        .from('models')
        .select('id, name, champion, weights, created_at')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
      ).data ?? []
    : []

  return (
    <ProfileClient
      profile={profile}
      models={models}
      isOwner={isOwner}
    />
  )
}
