// @ts-nocheck
'use client'

import { buildShareUrl } from '@/lib/encoding'
import type { StatWeights } from '@/types/bracket'

interface Model {
  id: string
  name: string
  champion: string | null
  weights: Record<string, number>
  is_public: boolean
  updated_at: string
}

interface Props {
  models: Model[]
  email: string | null
  userId: string
}

export default function ProfilePage({ models, email, userId }: Props) {
  const displayName = email?.split('@')[0] ?? 'Anonymous'

  function copyLink(model: Model) {
    const url = buildShareUrl({ weights: model.weights as StatWeights, name: model.name })
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>
      {/* Header */}
      <div className="border-b-2 px-6 py-4" style={{ background: 'var(--navy2)', borderColor: 'var(--orange)' }}>
        <a href="/bracket" className="font-barlowc font-bold text-2xl tracking-[3px]" style={{ color: 'var(--ftext)' }}>
          Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
        </a>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-barlowc font-bold text-2xl text-white"
            style={{ background: 'var(--orange)' }}
          >
            {displayName[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-barlowc font-bold text-2xl tracking-[1px]" style={{ color: 'var(--ftext)' }}>
              {displayName}
            </div>
            <div className="text-[13px]" style={{ color: 'var(--muted)' }}>
              {models.length} public bracket model{models.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Models grid */}
        <div className="flex flex-col gap-3">
          {models.map(model => (
            <div
              key={model.id}
              className="rounded-xl border p-4 flex items-center justify-between gap-4"
              style={{ background: 'var(--navy2)', borderColor: 'var(--rule)' }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-barlowc font-bold text-[16px] tracking-[0.5px]" style={{ color: 'var(--ftext)' }}>
                  {model.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[13px]">🏆</span>
                  <span className="text-[13px]" style={{ color: 'var(--orange)' }}>{model.champion}</span>
                  <span className="text-[11px]" style={{ color: 'var(--dim)' }}>
                    · {new Date(model.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <a
                  href={`/bracket?m=${encodeURIComponent(buildShareUrl({ weights: model.weights as StatWeights, name: model.name }).split('?m=')[1])}`}
                  className="px-3 py-2 rounded font-barlowc font-bold text-[12px] uppercase tracking-[1px] border transition-colors"
                  style={{ borderColor: 'var(--dim)', color: 'var(--muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dim)'; e.currentTarget.style.color = 'var(--muted)' }}
                >
                  View
                </a>
                <button
                  onClick={() => copyLink(model)}
                  className="px-3 py-2 rounded font-barlowc font-bold text-[12px] uppercase tracking-[1px] text-white"
                  style={{ background: 'var(--orange)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
