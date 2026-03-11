'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { StatWeights, TournamentResult } from '@/types/bracket'
import { PRESET_LABELS } from '@/types/bracket'
import { simTournament } from '@/lib/simulation'
import { buildShareUrl, encodeModel, encodeBracket } from '@/lib/encoding'
import { createClient, signOut } from '@/lib/supabase'
import Sidebar from './Sidebar'
import BracketCanvas from './BracketCanvas'
import AuthModal from './AuthModal'
import QRCode from './QRCode'
import type { User } from '@supabase/supabase-js'

interface Props {
  initialWeights: StatWeights
  initialName?: string
  initialPreset?: string
  initialResult?: TournamentResult
}

export default function BracketApp({ initialWeights, initialName, initialPreset, initialResult }: Props) {
  const [weights, setWeights] = useState<StatWeights>(initialWeights)
  const [modelName, setModelName] = useState(initialName ?? '')
  const [result, setResult] = useState<TournamentResult>(() => {
    if (initialResult) return initialResult
    return simTournament(initialWeights, undefined, undefined, initialPreset === 'chaos')
  })
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [activePreset, setActivePreset] = useState<string | null>(initialPreset ?? 'balanced')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [bracketScale, setBracketScale] = useState(1)
  const canvasRef = useRef<HTMLDivElement>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Auto-scale bracket to fit mobile viewports
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setBracketScale(w < 860 ? w / 880 : 1)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleWeightsChange = useCallback((next: StatWeights, preset?: string | null) => {
    setWeights(next)
    if (preset !== undefined) setActivePreset(preset)
    setResult(simTournament(next, undefined, undefined, preset === 'chaos'))
  }, [])

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current)
    setShareToast(msg)
    toastTimer.current = setTimeout(() => setShareToast(null), 2500)
  }, [])

  const handleShare = useCallback(() => {
    let url: string
    if (activePreset === 'chaos') {
      const base = typeof window !== 'undefined' ? window.location.origin : ''
      const bracketEncoded = encodeBracket(result)
      url = `${base}/bracket?b=${bracketEncoded}&p=chaos`
    } else {
      const presetParam = activePreset ? `&p=${activePreset}` : ''
      url = buildShareUrl({ weights, name: modelName || undefined }) + presetParam
    }
    navigator.clipboard.writeText(url).catch(() => {
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    })
    showToast('Link copied!')
    window.history.replaceState(null, '', url.replace(window.location.origin, ''))
  }, [weights, modelName, activePreset, result, showToast])

  const handleQR = useCallback(() => {
    const prodBase = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhop.com'
    let url: string
    if (activePreset === 'chaos') {
      url = `${prodBase}/bracket?b=${encodeBracket(result)}&p=chaos`
    } else {
      const presetParam = activePreset ? `&p=${activePreset}` : ''
      url = buildShareUrl({ weights, name: modelName || undefined }, prodBase) + presetParam
    }
    setQrUrl(url)
    setShowQR(true)
  }, [weights, modelName, activePreset, result])

  const handleSignOut = useCallback(async () => {
    await signOut()
    showToast('Signed out')
  }, [showToast])

  const avatarLetter = user?.email?.[0]?.toUpperCase() ?? user?.user_metadata?.name?.[0]?.toUpperCase()
  const printName = activePreset
    ? PRESET_LABELS[activePreset] ?? activePreset
    : modelName || 'My Bracket'

  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true)
    try {
      // Use production URL for QR code so printed PDFs are scannable
      const prodBase = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhop.com'
      let shareUrl: string
      if (activePreset === 'chaos') {
        shareUrl = `${prodBase}/bracket?b=${encodeBracket(result)}&p=chaos`
      } else {
        const presetParam = activePreset ? `&p=${activePreset}` : ''
        shareUrl = buildShareUrl({ weights, name: modelName || undefined }, prodBase) + presetParam
      }
      const { exportBracketPdf } = await import('@/lib/exportPdf')
      await exportBracketPdf(result, printName, shareUrl)
    } catch (err) {
      console.error('PDF export failed:', err)
      showToast('PDF export failed')
    } finally {
      setPdfLoading(false)
    }
  }, [result, printName, weights, modelName, activePreset, showToast])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header
        className="flex-shrink-0 flex items-center gap-2 sm:gap-5 px-3 sm:px-5 h-[50px] border-b-2"
        style={{ background: 'var(--navy2)', borderColor: 'var(--orange)' }}
      >
        <div className="flex flex-col leading-tight">
          <div className="font-barlowc font-bold text-2xl tracking-[3px]" style={{ color: 'var(--ftext)' }}>
            Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
          </div>
          <div className="font-barlowc text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--muted)' }}>
            Madness, Modeled
          </div>
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

          {/* PDF download - desktop only */}
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="px-3 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] border transition-colors hidden sm:block disabled:opacity-50"
            style={{ borderColor: 'var(--dim)', color: 'var(--muted)' }}
            onMouseEnter={e => { if (!pdfLoading) { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)' } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dim)'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            {pdfLoading ? '⏳ Saving…' : '📥 PDF'}
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

          {/* QR */}
          <button
            onClick={handleQR}
            className="px-2 sm:px-3 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] border transition-colors"
            style={{ borderColor: 'var(--dim)', color: 'var(--muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dim)'; e.currentTarget.style.color = 'var(--muted)' }}
            title="Show QR code"
          >
            <span className="sm:hidden">▦</span>
            <span className="hidden sm:inline">▦ QR</span>
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
            activePreset={activePreset}
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
          ref={canvasRef}
          className="flex-1 overflow-auto p-2 sm:p-3"
          style={{ scrollbarWidth: 'thin', ['--model-name' as any]: `"${printName}"` }}
        >
          <div style={bracketScale < 1 ? {
            transform: `scale(${bracketScale})`,
            transformOrigin: 'top left',
            width: `${100 / bracketScale}%`,
          } : undefined}>
            <BracketCanvas result={result} />
          </div>
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
                  activePreset={activePreset}
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
      {/* QR Modal */}
      {showQR && qrUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowQR(false)}
        >
          <div
            className="rounded-2xl p-6 flex flex-col items-center gap-4"
            style={{ background: 'var(--navy2)', border: '2px solid var(--orange)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="font-barlowc font-bold text-lg tracking-[2px] uppercase" style={{ color: 'var(--orange)' }}>
              Scan to open bracket
            </div>
            <QRCode url={qrUrl} size={240} />
            <div className="font-barlowc text-[11px] text-center max-w-[240px] break-all" style={{ color: 'var(--dim)' }}>
              {qrUrl}
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="px-5 py-2 rounded font-barlowc font-bold text-[12px] uppercase tracking-[1px] border"
              style={{ borderColor: 'var(--dim)', color: 'var(--muted)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
