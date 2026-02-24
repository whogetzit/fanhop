'use client'

import { useState, useCallback, useRef } from 'react'
import type { StatWeights, TournamentResult } from '@/types/bracket'
import { simTournament, getSeed } from '@/lib/simulation'
import { buildShareUrl, encodeModel } from '@/lib/encoding'
import Sidebar from './Sidebar'
import BracketCanvas from './BracketCanvas'
import { BRACKET } from '@/lib/data/2013'
import type { RegionName } from '@/types/bracket'

interface Props {
  initialWeights: StatWeights
  initialName?: string
}

export default function BracketApp({ initialWeights, initialName }: Props) {
  const [weights, setWeights] = useState<StatWeights>(initialWeights)
  const [modelName, setModelName] = useState(initialName ?? '')
  const [result, setResult] = useState<TournamentResult>(() => simTournament(initialWeights))
  const [shareToast, setShareToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const handleWeightsChange = useCallback((next: StatWeights) => {
    setWeights(next)
    setResult(simTournament(next))
  }, [])

  const handleShare = useCallback(() => {
    const url = buildShareUrl({ weights, name: modelName || undefined })
    navigator.clipboard.writeText(url).then(() => {
      clearTimeout(toastTimer.current)
      setShareToast('Link copied!')
      toastTimer.current = setTimeout(() => setShareToast(null), 2500)
    }).catch(() => {
      // Fallback for non-https
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setShareToast('Link copied!')
      toastTimer.current = setTimeout(() => setShareToast(null), 2500)
    })
    // Update URL bar without reload
    const encoded = encodeModel({ weights, name: modelName || undefined })
    window.history.replaceState(null, '', `/bracket?m=${encoded}`)
  }, [weights, modelName])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center gap-5 px-5 h-[50px] border-b-2"
        style={{ background: 'var(--navy2)', borderColor: 'var(--orange)' }}
      >
        <div
          className="font-barlowc font-bold text-2xl tracking-[3px]"
          style={{ color: 'var(--ftext)' }}
        >
          Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
        </div>

        <div
          className="font-barlowc text-[11px] tracking-[2px] uppercase border-l pl-5"
          style={{ color: 'var(--muted)', borderColor: 'var(--rule)' }}
        >
          2013 NCAA Tournament · Model Builder
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Champion pill */}
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1 border text-sm"
            style={{ background: 'var(--orange-glow)', borderColor: 'var(--orange)' }}
          >
            <span>🏆</span>
            <div>
              <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--muted)' }}>Champion</div>
              <div className="font-barlowc font-bold text-[14px] leading-none" style={{ color: 'var(--orange)' }}>
                {result.champion}
              </div>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="px-4 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white transition-colors"
            style={{ background: 'var(--orange)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
          >
            Share ↗
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          weights={weights}
          modelName={modelName}
          onWeightsChange={handleWeightsChange}
          onNameChange={setModelName}
        />

        <div className="flex-1 overflow-auto p-3" style={{ scrollbarWidth: 'thin' }}>
          <BracketCanvas result={result} />
        </div>
      </div>

      {/* Share toast */}
      {shareToast && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full font-barlowc font-semibold text-[13px] tracking-[0.5px] border z-50 pointer-events-none"
          style={{
            background: 'var(--navy2)',
            borderColor: 'var(--orange)',
            color: 'var(--orange2)',
          }}
        >
          {shareToast}
        </div>
      )}
    </div>
  )
}
