'use client'

import { useState } from 'react'
import { signInWithGoogle, signInWithMagicLink } from '@/lib/supabase'

interface Props {
  onClose: () => void
}

export default function AuthModal({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) { setError(error.message); setLoading(false) }
    // Otherwise page redirects to Google
  }

  async function handleMagicLink() {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await signInWithMagicLink(email.trim())
    setLoading(false)
    if (error) { setError(error.message) }
    else { setSent(true) }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-6 border"
        style={{ background: 'var(--navy2)', borderColor: 'var(--rule)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="font-barlowc font-bold text-xl tracking-[2px]" style={{ color: 'var(--orange)' }}>
              Sign In
            </div>
            <div className="text-[12px] mt-1" style={{ color: 'var(--muted)' }}>
              Save your brackets to the cloud
            </div>
          </div>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: 'var(--dim)' }}>×</button>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">📬</div>
            <div className="font-barlowc font-bold text-lg" style={{ color: 'var(--ftext)' }}>Check your email</div>
            <div className="text-[13px] mt-2" style={{ color: 'var(--muted)' }}>
              We sent a magic link to <span style={{ color: 'var(--orange)' }}>{email}</span>
            </div>
            <div className="text-[11px] mt-3" style={{ color: 'var(--dim)' }}>
              Click the link in the email to sign in — no password needed.
            </div>
          </div>
        ) : (
          <>
            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg border font-semibold text-[14px] mb-4 transition-colors"
              style={{ borderColor: 'var(--dim)', color: 'var(--ftext)', background: 'var(--navy3)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--orange)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--dim)')}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.7 0 6.7 5.5 2.9 13.5l7.8 6C12.4 13.2 17.7 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
                <path fill="#FBBC05" d="M10.7 28.5A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.7-4.5l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.2-6.3z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.2 1.5-5 2.4-8.4 2.4-6.3 0-11.6-3.7-13.3-9l-8.2 6.3C6.7 42.5 14.7 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: 'var(--rule)' }} />
              <span className="text-[11px]" style={{ color: 'var(--dim)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--rule)' }} />
            </div>

            {/* Magic link */}
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
                placeholder="your@email.com"
                className="w-full rounded-lg px-3 py-3 text-[13px] border outline-none"
                style={{ background: 'var(--navy3)', borderColor: 'var(--dim)', color: 'var(--ftext)' }}
                onFocus={e => (e.target.style.borderColor = 'var(--orange)')}
                onBlur={e => (e.target.style.borderColor = 'var(--dim)')}
              />
              <button
                onClick={handleMagicLink}
                disabled={loading || !email.trim()}
                className="w-full py-3 rounded-lg font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white transition-opacity"
                style={{ background: 'var(--orange)', opacity: loading || !email.trim() ? 0.5 : 1 }}
              >
                {loading ? 'Sending…' : 'Send Magic Link'}
              </button>
            </div>

            {error && (
              <div className="mt-3 text-[12px] text-center" style={{ color: '#ff5566' }}>{error}</div>
            )}

            <div className="mt-4 text-[11px] text-center" style={{ color: 'var(--dim)' }}>
              No password needed. We'll email you a link.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
