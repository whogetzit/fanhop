'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { StatWeights, TournamentResult } from '@/types/bracket'
import { simTournament, getSeed } from '@/lib/simulation'
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
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  // Watch auth state
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

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center gap-5 px-5 h-[50px] border-b-2"
        style={{ background: 'var(--navy2)', borderColor: 'var(--orange)' }}
      >
        <div className="font-barlowc font-bold text-2xl tracking-[3px]" style={{ color: 'var(--ftext)' }}>
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

          {/* Print */}
          <button
  onClick={() => { window.print() }}
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
            className="px-4 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white transition-colors"
            style={{ background: 'var(--orange)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--orange)')}
          >
            Share ↗
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <a
                href={`/u/${user.id}`}
                className="w-8 h-8 rounded-full flex items-center justify-center font-barlowc font-bold text-[13px] text-white"
                style={{ background: 'var(--orange)' }}
                title={user.email ?? 'Profile'}
              >
                {avatarLetter}
              </a>
              <button
                onClick={handleSignOut}
                className="text-[11px] uppercase tracking-[1px]"
                style={{ color: 'var(--dim)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--muted)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--dim)')}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-4 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] border transition-colors"
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
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          weights={weights}
          modelName={modelName}
          user={user}
          onWeightsChange={handleWeightsChange}
          onNameChange={setModelName}
          onNeedAuth={() => setShowAuth(true)}
          onToast={showToast}
        />
        <div id="print-area" className="flex-1 overflow-auto p-3" style={{ scrollbarWidth: 'thin', ['--model-name' as any]: `"${modelName || 'Untitled Bracket'}"` }}>
          <BracketCanvas result={result} />
        </div>
      </div>

      {/* Toast */}
      {shareToast && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full font-barlowc font-semibold text-[13px] tracking-[0.5px] border z-50 pointer-events-none"
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