// @ts-nocheck
'use client'

import { useState } from 'react'
import { buildShareUrl } from '@/lib/encoding'
import type { StatWeights } from '@/types/bracket'

interface Model {
  id: string
  name: string
  champion: string | null
  weights: Record<string, number>
  created_at: string
}

interface Profile {
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
}

interface Props {
  profile: Profile
  models: Model[]
  isOwner: boolean
}

export default function ProfileClient({ profile, models, isOwner }: Props) {
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  function handleShare(model: Model) {
    const url = buildShareUrl({ weights: model.weights as StatWeights, name: model.name })
    navigator.clipboard.writeText(url).then(() => showToast('Link copied!'))
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
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full border-2" style={{ borderColor: 'var(--orange)' }} />
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
