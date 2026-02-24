import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { parseModelFromSearchParams } from '@/lib/encoding'
import { simTournament } from '@/lib/simulation'
import { DEFAULT_WEIGHTS } from '@/types/bracket'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const model = parseModelFromSearchParams(searchParams)
  const weights = model?.weights ?? DEFAULT_WEIGHTS
  const result = simTournament(weights)
  const name = model?.name ?? 'My Bracket'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0b1f3a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          gap: '24px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', fontSize: '28px', letterSpacing: '4px', color: '#ccd9ea', fontWeight: 700 }}>
          FAN<span style={{ color: '#f96a1b' }}>HOP</span>
        </div>

        {/* Model name */}
        <div style={{ fontSize: '36px', color: '#6b88a8', letterSpacing: '2px', fontWeight: 600 }}>
          {name.toUpperCase()}
        </div>

        {/* Champion */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(249,106,27,0.15)',
            border: '2px solid #f96a1b',
            borderRadius: '16px',
            padding: '24px 48px',
          }}
        >
          <div style={{ fontSize: '20px', color: '#6b88a8', letterSpacing: '3px' }}>
            🏆  CHAMPION
          </div>
          <div style={{ fontSize: '56px', color: '#f96a1b', fontWeight: 800 }}>
            {result.champion}
          </div>
        </div>

        {/* Final Four */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          {result.finalFour.map((team, i) => (
            <div
              key={i}
              style={{
                background: '#112848',
                border: '1px solid #1e3550',
                borderRadius: '8px',
                padding: '10px 18px',
                color: team === result.champion ? '#ff8c47' : '#ccd9ea',
                fontSize: '18px',
                fontWeight: team === result.champion ? 700 : 400,
              }}
            >
              {team}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '30px', right: '48px', fontSize: '18px', color: '#3a5472' }}>
          fanhop.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
