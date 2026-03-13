// @ts-nocheck
'use client'

import { useState } from 'react'
import { buildShareUrl } from '@/lib/encoding'
import { createClient } from '@/lib/supabase'
import type { StatWeights } from '@/types/bracket'

interface Model {
  id: string
  name: string
  champion: string | null
  weights: Record<string, number>
  created_at: string
}

interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  email_opt_in: boolean
  created_at: string
}

interface Props {
  profile: Profile
  publicModels: Model[]
  privateModels: Model[]
  isOwner: boolean
}

export default function ProfileClient({ profile, publicModels, privateModels, isOwner }: Props) {
  const models = [...publicModels, ...privateModels]
  const [toast, setToast] = useState<string | null>(null)
  const [emailOptIn, setEmailOptIn] = useState(profile.email_opt_in ?? false)
  const [saving, setSaving] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  async function handleEmailOptIn(checked: boolean) {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ email_opt_in: checked })
        .eq('id', profile.id)
      if (error) throw error
      setEmailOptIn(checked)
      showToast('Preferences saved!')
    } catch {
      showToast('Failed to save preference')
    } finally {
      setSaving(false)
    }
  }

  function handleShare(model: Model) {
    const url = buildShareUrl({ weights: model.weights as StatWeights, name: model.name })
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link copied!'))
      .catch(() => showToast('Failed to copy link'))
  }

  const initials = (profile.display_name ?? profile.username)[0]?.toUpperCase()

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      {/* Header */}
      <div className="border-b" style={{ background: 'var(--navy2)', borderColor: 'var(--orange)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/bracket" className="font-barlowc font-bold text-2xl tracking-[3px]" style={{ color: 'var(--ftext)' }}>
            Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
          </a>
          <a href="/bracket"
            className="px-4 py-2 rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white"
            style={{ background: 'var(--orange)' }}>
            Build Bracket
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Profile card */}
        <div className="flex items-center gap-5 mb-8">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={`${profile.display_name ?? profile.username}'s avatar`} className="w-16 h-16 rounded-full border-2" style={{ borderColor: 'var(--orange)' }} />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-barlowc font-bold text-2xl border-2"
              style={{ background: 'var(--orange)', color: 'white', borderColor: 'var(--orange)' }}>
              {initials}
            </div>
          )}
          <div>
            <div className="font-barlowc font-bold text-2xl tracking-[1px]" style={{ color: 'var(--ftext)' }}>
              {profile.display_name ?? profile.username}
            </div>
            <div className="text-[13px]" style={{ color: 'var(--muted)' }}>@{profile.username}</div>
            {profile.created_at && (
              <div className="text-[11px] mt-1" style={{ color: 'var(--dim)' }}>
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            )}
            {profile.bio && <div className="text-[13px] mt-1" style={{ color: 'var(--ftext)' }}>{profile.bio}</div>}
          </div>
          <div className="ml-auto text-right">
            <div className="font-barlowc font-bold text-3xl" style={{ color: 'var(--orange)' }}>
              {models.length}
            </div>
            <div className="text-[11px] uppercase tracking-[1px]" style={{ color: 'var(--muted)' }}>
              Saved Brackets
            </div>
          </div>
        </div>

        {/* Email preferences (owner only) */}
        {isOwner && (
          <div className="rounded-xl border p-4 mb-8 flex items-center justify-between"
            style={{ background: 'var(--navy2)', borderColor: 'var(--rule)' }}>
            <label htmlFor="email-opt-in" className="font-barlowc text-[14px] cursor-pointer select-none" style={{ color: 'var(--ftext)' }}>
              📧 Email me product updates &amp; announcements
            </label>
            <button
              id="email-opt-in"
              role="switch"
              aria-checked={emailOptIn}
              disabled={saving}
              onClick={() => handleEmailOptIn(!emailOptIn)}
              className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
              style={{ background: emailOptIn ? 'var(--orange)' : 'var(--dim)', opacity: saving ? 0.5 : 1 }}>
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                style={{ transform: emailOptIn ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </div>
        )}

        {/* Models list */}
        {models.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--dim)' }}>
            <div className="text-4xl mb-3">🏀</div>
            <div className="font-barlowc text-lg">No saved brackets yet</div>
            {isOwner && (
              <a href="/bracket" className="inline-block mt-4 px-5 py-2 rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white"
                style={{ background: 'var(--orange)' }}>
                Build One
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {models.map(model => (
              <div key={model.id}
                className="rounded-xl border p-4 flex items-center gap-4 transition-colors"
                style={{ background: 'var(--navy2)', borderColor: 'var(--rule)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--rule)')}>
                <div className="flex-1 min-w-0">
                  <div className="font-barlowc font-bold text-lg" style={{ color: 'var(--ftext)' }}>
                    {model.name}
                  </div>
                  <div className="text-[12px] flex items-center gap-1 mt-1" style={{ color: 'var(--muted)' }}>
                    <span>🏆</span>
                    <span style={{ color: 'var(--orange2)' }}>{model.champion}</span>
                    <span className="mx-2">·</span>
                    <span>{new Date(model.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleShare(model)}
                    className="px-3 py-1 rounded font-barlowc font-bold text-[12px] uppercase tracking-[1px] text-white"
                    style={{ background: 'var(--orange)' }}>
                    Share ↗
                  </button>
                  <a href={`/bracket?m=${encodeModel(model)}`}
                    className="px-3 py-1 rounded font-barlowc font-bold text-[12px] uppercase tracking-[1px] border"
                    style={{ borderColor: 'var(--dim)', color: 'var(--ftext)' }}>
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full font-barlowc font-semibold text-[13px] border z-50 pointer-events-none"
          style={{ background: 'var(--navy2)', borderColor: 'var(--orange)', color: 'var(--orange2)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

function encodeModel(model: Model): string {
  const url = buildShareUrl({ weights: model.weights as StatWeights, name: model.name }, '')
  return url.replace('/bracket?m=', '')
}
