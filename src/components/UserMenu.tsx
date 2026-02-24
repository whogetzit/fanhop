'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import AuthModal from './AuthModal'

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowMenu(false)
    window.location.reload()
  }

  const username = user?.email?.split('@')[0] ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowAuth(true)}
          className="px-4 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] border transition-colors"
          style={{ borderColor: 'var(--orange)', color: 'var(--orange)', background: 'transparent' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--orange-glow)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          Sign In
        </button>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(v => !v)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg border transition-colors"
        style={{ borderColor: showMenu ? 'var(--orange)' : 'var(--rule)', background: 'var(--navy3)' }}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-6 h-6 rounded-full" />
        ) : (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-barlowc font-bold text-[11px]"
            style={{ background: 'var(--orange)', color: 'white' }}
          >
            {username[0]?.toUpperCase()}
          </div>
        )}
        <span className="font-barlowc text-[12px]" style={{ color: 'var(--ftext)' }}>
          {username}
        </span>
        <span style={{ color: 'var(--muted)', fontSize: 10 }}>▾</span>
      </button>

      {showMenu && (
        <div
          className="absolute right-0 top-full mt-1 w-44 rounded-lg border py-1 z-40"
          style={{ background: 'var(--navy2)', borderColor: 'var(--rule)' }}
        >
          <a
            href={`/u/${username}`}
            className="flex items-center gap-2 px-3 py-2 text-[13px] transition-colors"
            style={{ color: 'var(--ftext)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            👤 My Profile
          </a>
          <a
            href="/bracket"
            className="flex items-center gap-2 px-3 py-2 text-[13px] transition-colors"
            style={{ color: 'var(--ftext)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            🏀 My Brackets
          </a>
          <div className="my-1 border-t" style={{ borderColor: 'var(--rule)' }} />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left transition-colors"
            style={{ color: 'var(--muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff5566')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
