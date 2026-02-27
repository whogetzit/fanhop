'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { StatWeights, TournamentResult } from '@/types/bracket'
import { PRESET_LABELS } from '@/types/bracket'
import { simTournament } from '@/lib/simulation'
import { buildShareUrl, encodeModel } from '@/lib/encoding'
import { createClient, signOut } from '@/lib/supabase'
import Sidebar from './Sidebar'
import BracketCanvas from './BracketCanvas'
import AuthModal from './AuthModal'
import type { User } from '@supabase/supabase-js'

interface Props {
  initialWeights: StatWeights
  initialName?: string
}

export default function BracketApp({ initialWeights, initialName }: Props) {
  const [weights, setWeights] = useState<StatWeights>(initialWeights)
  const [modelName, setModelName] = useState(initialName ?? '')
  const [result, setResult] = useState<TournamentResult>(() => simTournament(initialWeights))
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>('balanced')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleWeightsChange = useCallback((next: StatWeights) => {
    setWeights(next)
    setResult(simTournament(next))
  }, [])

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current)
    setShareToast(msg)
    toastTimer.current = setTimeout(() => setShareToast(null), 2500)
  }, [])

  const handleShare = useCallback(() => {
    const url = buildShareUrl({ weights, name: modelName || undefined })
    navigator.clipboard.writeText(url).catch(() => {
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    })
    showToast('Link copied!')
    const encoded = encodeModel({ weights, name: modelName || undefined })
    window.history.replaceState(null, '', `/bracket?m=${encoded}`)
  }, [weights, modelName, showToast])

  const handleSignOut = useCallback(async () => {
    await signOut()
    showToast('Signed out')
  }, [showToast])

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? user?.user_metadata?.name?.[0]?.toUpperCase()
  const printName = activePreset
    ? PRESET_LABELS[activePreset] ?? activePreset
    : modelName || 'My Bracket'

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center gap-2 sm:gap-5 px-3 sm:px-5 h-[50px] border-b-2"
        style={{ background: 'var(--navy2)', borderColor: 'var(--orange)' }}
      >
        <div className="font-barlowc font-bold text-2xl tracking-[3px]" style={{ color: 'var(--ftext)' }}>
          Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
        </div>

        <div
          className="font-barlowc text-[11px] tracking-[2px] uppercase border-l pl-3 sm:pl-5 hidden sm:block"
          style={{ color: 'var(--muted)', borderColor: 'var(--rule)' }}
        >
          2025 NCAA Tournament · Model Builder
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Champion pill */}
          <div
            className="flex items-center gap-1 sm:gap-2 rounded-full px-2 sm:px-3 py-1 border"
            style={{ background: 'var(--orange-glow)', borderColor: 'var(--orange)' }}
          >
            <span>🏆</span>
            <div>
              <div className="text-[10px] uppercase tracking-[1px] hidden sm:block" style={{ color: 'var(--muted)' }}>Champion</div>
              <div className="font-barlowc font-bold text-[13px] sm:text-[14px] leading-none" style={{ color: 'var(--orange)' }}>
                {result.champion}
              </div>
            </div>
          </div>

          {/* Print - desktop only */}
          <button
            onClick={() => window.print()}
            className="px-3 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] border transition-colors hidden sm:block"
            style={{ borderColor: 'var(--dim)', color: 'var(--muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dim)'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            🖨 Print
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="px-3 sm:px-4 py-[7px] rounded font-barlowc font-bold text-[12px] sm:text-[13px] uppercase tracking-[1px] text-white transition-colors"
            style={{ background: 'var(--orange)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
          >
            Share ↗
          </button>

          {/* Auth */}
          {user ? (
            <a
              href={`/u/${user.id}`}
              className="w-8 h-8 rounded-full flex items-center justify-center font-barlowc font-bold text-[13px] text-white flex-shrink-0"
              style={{ background: 'var(--orange)' }}
              title={user.email ?? 'Profile'}
            >
              {avatarLetter}
            </a>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-3 sm:px-4 py-[7px] rounded font-barlowc font-bold text-[12px] sm:text-[13px] uppercase tracking-[1px] border transition-colors"
              style={{ borderColor: 'var(--dim)', color: 'var(--muted)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dim)'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar — desktop only */}
        <div className="hidden sm:block flex-shrink-0">
          <Sidebar
            weights={weights}
            modelName={modelName}
            user={user}
            onWeightsChange={handleWeightsChange}
            onNameChange={setModelName}
            onNeedAuth={() => setShowAuth(true)}
            onToast={showToast}
            onPresetChange={setActivePreset}
          />
        </div>

        {/* Bracket canvas */}
        <div
          id="print-area"
          className="flex-1 overflow-auto p-2 sm:p-3"
          style={{ scrollbarWidth: 'thin', ['--model-name' as any]: `"${printName}"` }}
        >
          <BracketCanvas result={result} />
        </div>

        {/* Mobile: floating Model button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="sm:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-5 py-3 rounded-full font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white shadow-lg"
          style={{ background: 'var(--orange)' }}
        >
          ⚙ Model
        </button>

        {/* Mobile: bottom sheet drawer */}
        {drawerOpen && (
          <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setDrawerOpen(false)}
            />
            {/* Sheet */}
            <div
              className="relative flex flex-col rounded-t-2xl overflow-hidden"
              style={{ background: 'var(--navy2)', maxHeight: '85vh', borderTop: '2px solid var(--orange)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ borderColor: 'var(--rule)' }}>
                <div className="font-barlowc font-bold text-base tracking-[2px]" style={{ color: 'var(--orange)' }}>
                  Your Model
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-2xl leading-none w-8 h-8 flex items-center justify-center rounded"
                  style={{ color: 'var(--muted)' }}
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <Sidebar
                  weights={weights}
                  modelName={modelName}
                  user={user}
                  onWeightsChange={handleWeightsChange}
                  onNameChange={setModelName}
                  onNeedAuth={() => { setDrawerOpen(false); setShowAuth(true) }}
                  onToast={(msg) => { setDrawerOpen(false); showToast(msg) }}
                  onPresetChange={setActivePreset}
                  mobile
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {shareToast && (
        <div
          className="fixed bottom-20 sm:bottom-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full font-barlowc font-semibold text-[13px] tracking-[0.5px] border z-50 pointer-events-none"
          style={{ background: 'var(--navy2)', borderColor: 'var(--orange)', color: 'var(--orange2)' }}
        >
          {shareToast}
        </div>
      )}

      {/* Auth modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
