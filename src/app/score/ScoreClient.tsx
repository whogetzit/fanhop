// @ts-nocheck
'use client'

import { useState, useCallback } from 'react'
import { DEFAULT_WEIGHTS } from '@/types/bracket'
import { simTournament, scoreBracket2025, RESULTS_2025 } from '@/lib/simulation'
import { TEAMS as TEAMS_2025, BRACKET as BRACKET_2025 } from '@/lib/data/2025'
import { parseModelFromUrl } from '@/lib/encoding'

const ROUND_NAMES = ['R64', 'R32', 'S16', 'E8', 'FF', 'Champ']
const ROUND_MAX = [32, 16, 16, 16, 32, 32]  // max pts per round (4 regions × games × pts)
const REGIONS = ['South', 'East', 'Midwest', 'West'] as const

// Actual 2025 results structured for display
const ACTUAL = RESULTS_2025

export default function ScoreClient() {
  const [urlInput, setUrlInput] = useState('')
  const [result, setResult] = useState<null | { total: number; breakdown: Record<string,number>; champion: string; finalFour: string[]; modelName: string }>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const scoreUrl = useCallback((url: string) => {
    setError('')
    setLoading(true)
    try {
      const model = parseModelFromUrl(url.trim())
      if (!model) throw new Error('Could not read model from URL. Make sure you paste a full FanHop share link.')
      const sim = simTournament(model.weights, BRACKET_2025, TEAMS_2025)
      const { total, breakdown } = scoreBracket2025(sim)
      setResult({ total, breakdown, champion: sim.champion, finalFour: sim.finalFour, modelName: model.name || 'Unnamed Model' })
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    }
    setLoading(false)
  }, [])

  const scoreCurrentWeights = useCallback(() => {
    setError('')
    const sim = simTournament(DEFAULT_WEIGHTS, BRACKET_2025, TEAMS_2025)
    const { total, breakdown } = scoreBracket2025(sim)
    setResult({ total, breakdown, champion: sim.champion, finalFour: sim.finalFour, modelName: 'Balanced (default)' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--navy)', color: 'var(--ftext)' }}>
      {/* Header */}
      <header className="flex-shrink-0 flex items-center gap-5 px-5 h-[50px] border-b-2" style={{ background: 'var(--navy2)', borderColor: 'var(--orange)' }}>
        <a href="/bracket" className="font-barlowc font-bold text-2xl tracking-[3px]" style={{ color: 'var(--ftext)' }}>
          Fan<span style={{ color: 'var(--orange)' }}>Hop</span>
        </a>
        <div className="font-barlowc text-[11px] tracking-[2px] uppercase border-l pl-5" style={{ color: 'var(--muted)', borderColor: 'var(--rule)' }}>
          2025 Bracket Scorer
        </div>
        <div className="ml-auto">
          <a href="/bracket" className="px-4 py-[7px] rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] border" style={{ borderColor: 'var(--dim)', color: 'var(--muted)' }}>
            ← Build Bracket
          </a>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-barlowc font-bold text-3xl tracking-[2px] uppercase mb-2" style={{ color: 'var(--orange)' }}>
            Score Your 2025 Bracket
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            See how your FanHop model would have scored against the real 2025 NCAA Tournament. Florida beat Houston 65–63 to win it all.
          </p>
        </div>

        {/* Actual results callout */}
        <div className="rounded-lg p-4 mb-6 border" style={{ background: 'var(--navy2)', borderColor: 'var(--rule)' }}>
          <div className="font-barlowc font-bold text-[11px] uppercase tracking-[2px] mb-3" style={{ color: 'var(--muted)' }}>Actual 2025 Results</div>
          <div className="flex items-center gap-3 mb-3">
            <span>🏆</span>
            <div>
              <div className="text-[10px] uppercase tracking-[1px]" style={{ color: 'var(--muted)' }}>Champion</div>
              <div className="font-barlowc font-bold text-xl" style={{ color: 'var(--orange)' }}>Florida</div>
            </div>
            <div className="ml-4 text-sm" style={{ color: 'var(--muted)' }}>beat Houston 65–63</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[1px] mb-1" style={{ color: 'var(--muted)' }}>Final Four</div>
            <div className="flex gap-2 flex-wrap">
              {ACTUAL.finalFour.map(t => (
                <span key={t} className="px-2 py-1 rounded font-barlowc font-bold text-sm" style={{ background: 'var(--orange-glow)', color: 'var(--orange)', border: '1px solid var(--orange)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <div className="font-barlowc font-bold text-[11px] uppercase tracking-[2px] mb-2" style={{ color: 'var(--muted)' }}>
            Paste a FanHop Share URL
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://fanhop.com/bracket?m=..."
              className="flex-1 px-3 py-2 rounded font-barlowc text-sm border outline-none"
              style={{ background: 'var(--navy2)', borderColor: 'var(--rule)', color: 'var(--ftext)' }}
              onKeyDown={e => e.key === 'Enter' && urlInput && scoreUrl(urlInput)}
            />
            <button
              onClick={() => urlInput && scoreUrl(urlInput)}
              disabled={!urlInput || loading}
              className="px-4 py-2 rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white"
              style={{ background: urlInput ? 'var(--orange)' : 'var(--dim)' }}
            >
              Score
            </button>
          </div>
          {error && <div className="mt-2 text-sm" style={{ color: '#f87171' }}>{error}</div>}
          <div className="mt-3 text-center">
            <button
              onClick={scoreCurrentWeights}
              className="text-sm underline"
              style={{ color: 'var(--muted)' }}
            >
              Or score the default Balanced model →
            </button>
          </div>
        </div>

        {/* Score result */}
        {result && (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--orange)' }}>
            {/* Score header */}
            <div className="px-5 py-4 border-b" style={{ background: 'var(--navy2)', borderColor: 'var(--rule)' }}>
              <div className="font-barlowc text-[11px] uppercase tracking-[2px] mb-1" style={{ color: 'var(--muted)' }}>{result.modelName}</div>
              <div className="flex items-baseline gap-3">
                <span className="font-barlowc font-bold text-5xl" style={{ color: 'var(--orange)' }}>{result.total}</span>
                <span className="font-barlowc text-xl" style={{ color: 'var(--muted)' }}>/ 192 pts</span>
              </div>
              <div className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
                Percentile: <span style={{ color: 'var(--orange)' }}>{result.total >= 150 ? 'Top 5%' : result.total >= 120 ? 'Top 20%' : result.total >= 100 ? 'Top 40%' : result.total >= 80 ? 'Top 60%' : 'Average'}</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="px-5 py-4">
              <div className="font-barlowc font-bold text-[11px] uppercase tracking-[2px] mb-3" style={{ color: 'var(--muted)' }}>Round Breakdown</div>
              <div className="space-y-2">
                {[
                  { label: 'Round of 64', key: 'r64', max: 32 },
                  { label: 'Round of 32', key: 'r32', max: 16 },
                  { label: 'Sweet 16',    key: 's16', max: 16 },
                  { label: 'Elite Eight', key: 'e8',  max: 16 },
                  { label: 'Final Four',  key: 'ff',  max: 32 },
                  { label: 'Champion',    key: 'champ',max: 32 },
                ].map(({ label, key, max }) => {
                  const pts = result.breakdown[key] || 0
                  const pct = max > 0 ? (pts / max) * 100 : 0
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'var(--muted)' }}>{label}</span>
                        <span style={{ color: pts > 0 ? 'var(--orange)' : 'var(--dim)' }}>{pts}/{max}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--navy)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? '#22c55e' : 'var(--orange)' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Predicted vs actual */}
              <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--rule)' }}>
                <div className="font-barlowc font-bold text-[11px] uppercase tracking-[2px] mb-3" style={{ color: 'var(--muted)' }}>Your Picks vs Reality</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-[1px] mb-1" style={{ color: 'var(--muted)' }}>Your Champion</div>
                    <div className="font-barlowc font-bold" style={{ color: result.champion === 'Florida' ? '#22c55e' : 'var(--ftext)' }}>
                      {result.champion} {result.champion === 'Florida' ? '✓' : '✗'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[1px] mb-1" style={{ color: 'var(--muted)' }}>Actual Champion</div>
                    <div className="font-barlowc font-bold" style={{ color: 'var(--orange)' }}>Florida</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-[1px] mb-2" style={{ color: 'var(--muted)' }}>Your Final Four</div>
                  <div className="flex gap-2 flex-wrap">
                    {result.finalFour.map(t => {
                      const hit = ACTUAL.finalFour.includes(t)
                      return (
                        <span key={t} className="px-2 py-1 rounded font-barlowc font-bold text-sm" style={{
                          background: hit ? 'rgba(34,197,94,0.1)' : 'var(--navy)',
                          color: hit ? '#22c55e' : 'var(--dim)',
                          border: `1px solid ${hit ? '#22c55e' : 'var(--rule)'}`,
                        }}>
                          {t} {hit ? '✓' : '✗'}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 pt-4 border-t text-center" style={{ borderColor: 'var(--rule)' }}>
                <a href="/bracket" className="inline-block px-6 py-3 rounded font-barlowc font-bold text-[13px] uppercase tracking-[1px] text-white" style={{ background: 'var(--orange)' }}>
                  Tweak Your Model →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
