'use client'

import type { TournamentResult, RegionResult, Matchup, RegionName } from '@/types/bracket'
import { BRACKET } from '@/lib/data/2013'
import { getSeed } from '@/lib/simulation'

interface Props { result: TournamentResult }

// Pixel constants for alignment
const SLOT_H = 23
const GAP = 4
const MU_GAP = 4

export default function BracketCanvas({ result }: Props) {
  const { regions, ff1, ff2, champion, finalFour } = result

  return (
    <div
      className="grid gap-x-[6px]"
      style={{
        gridTemplateColumns: '120px 96px 88px 88px 120px 88px 88px 96px 120px',
        gridTemplateRows: 'auto auto 16px auto',
        minWidth: 860,
        alignItems: 'start',
      }}
    >
      {/* ── Column headers ── */}
      <Rh cls="midwest" col={1}>MIDWEST</Rh>
      <Rh col={2}>R32</Rh>
      <Rh col={3}>S16</Rh>
      <Rh col={4}>E8</Rh>
      <Rh cls="ff" col={5}>FF · CHAMP</Rh>
      <Rh col={6}>E8</Rh>
      <Rh col={7}>S16</Rh>
      <Rh col={8}>R32</Rh>
      <Rh cls="east" col={9}>EAST</Rh>

      {/* ── Top half: Midwest (left) + East (right) ── */}
      <RegionLeft  result={regions.Midwest} regionName="Midwest" col={1} row={2} />
      <RegionLeft  result={regions.Midwest} regionName="Midwest" col={2} row={2} round="r32" />
      <RegionLeft  result={regions.Midwest} regionName="Midwest" col={3} row={2} round="s16" />
      <RegionLeft  result={regions.Midwest} regionName="Midwest" col={4} row={2} round="e8" />

      {/* Center: Final Four + Champion */}
      <div
        className="flex flex-col items-center justify-center gap-1 py-2 px-1"
        style={{ gridColumn: 5, gridRow: '2 / 5' }}
      >
        <div className="font-barlowc text-[9px] uppercase tracking-[2px] mb-1" style={{ color: 'var(--muted)' }}>
          Final Four
        </div>
        <TeamSlot name={ff1.winner} seed={getSeed(ff1.winner)} win cls="final-four" />
        <div className="font-barlowc text-[9px] tracking-[1px]" style={{ color: 'var(--dim)' }}>vs</div>
        <TeamSlot name={ff2.winner} seed={getSeed(ff2.winner)} win cls="final-four" />
        <div className="font-barlowc text-[9px] uppercase tracking-[2px] mt-2 mb-1" style={{ color: 'var(--muted)' }}>
          Champion
        </div>
        <TeamSlot name={champion} seed={getSeed(champion)} win cls="champion" />
        <div className="text-xl mt-1" style={{ filter: 'drop-shadow(0 0 8px rgba(249,106,27,.9))' }}>🏆</div>
      </div>

      <RegionRight result={regions.East}  regionName="East"  col={6} row={2} round="e8" />
      <RegionRight result={regions.East}  regionName="East"  col={7} row={2} round="s16" />
      <RegionRight result={regions.East}  regionName="East"  col={8} row={2} round="r32" />
      <RegionRight result={regions.East}  regionName="East"  col={9} row={2} />

      {/* ── Mid dividers ── */}
      <MidLabel col={1} label="WEST" cls="midwest" />
      {[2,3,4,6,7,8].map(c => <MidDiv key={c} col={c} />)}
      <MidLabel col={9} label="SOUTH" cls="south" right />

      {/* ── Bottom half: West (left) + South (right) ── */}
      <RegionLeft  result={regions.West}  regionName="West"  col={1} row={4} />
      <RegionLeft  result={regions.West}  regionName="West"  col={2} row={4} round="r32" />
      <RegionLeft  result={regions.West}  regionName="West"  col={3} row={4} round="s16" />
      <RegionLeft  result={regions.West}  regionName="West"  col={4} row={4} round="e8" />

      <RegionRight result={regions.South} regionName="South" col={6} row={4} round="e8" />
      <RegionRight result={regions.South} regionName="South" col={7} row={4} round="s16" />
      <RegionRight result={regions.South} regionName="South" col={8} row={4} round="r32" />
      <RegionRight result={regions.South} regionName="South" col={9} row={4} />
    </div>
  )
}

// ─── Column header ────────────────────────────────────────────────────────────

function Rh({ col, cls, children }: { col: number; cls?: string; children: React.ReactNode }) {
  const color = cls === 'midwest' || cls === 'west' ? '#ff8060'
    : cls === 'east' || cls === 'south' ? (cls === 'east' ? '#60d090' : '#c080ff')
    : cls === 'ff' ? 'var(--orange)'
    : 'var(--muted)'
  return (
    <div
      className="font-barlowc font-semibold text-[9px] uppercase tracking-[1.5px] text-center pb-[6px] mb-2 border-b"
      style={{ gridColumn: col, gridRow: 1, color, borderColor: color !== 'var(--muted)' ? color : 'var(--rule)' }}
    >
      {children}
    </div>
  )
}

// ─── Mid-row dividers ─────────────────────────────────────────────────────────

function MidDiv({ col }: { col: number }) {
  return <div style={{ gridColumn: col, gridRow: 3, borderTop: '1px solid var(--rule)' }} />
}

function MidLabel({ col, label, cls, right }: { col: number; label: string; cls: string; right?: boolean }) {
  const color = cls === 'midwest' ? '#ff8060' : '#c080ff'
  return (
    <div
      className="font-barlowc font-semibold text-[9px] uppercase tracking-[2px] border-t pt-1"
      style={{ gridColumn: col, gridRow: 3, color, borderColor: 'var(--rule)', textAlign: right ? 'right' : 'left' }}
    >
      {label}
    </div>
  )
}

// ─── Region columns (left side flows R64→E8 left-to-right) ───────────────────

interface RegionColProps {
  result: RegionResult
  regionName: RegionName
  col: number
  row: number
  round?: 'r32' | 's16' | 'e8'
}

function makeSeedMap(regionName: RegionName): Record<string, number> {
  const m: Record<string, number> = {}
  for (const [s, t] of Object.entries(BRACKET[regionName])) m[t] = Number(s)
  return m
}

const R64_PAIRS: [number, number][] = [[1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15]]

function RegionLeft({ result, regionName, col, row, round }: RegionColProps) {
  const seedMap = makeSeedMap(regionName)

  if (!round) {
    // R64
    return (
      <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
        {R64_PAIRS.map(([s1, s2], i) => {
          const m = result.r64[i]
          return (
            <div key={i}>
              <div className="flex flex-col gap-px mb-1">
                <TeamSlot name={m.team1} seed={s1} win={m.winner === m.team1} />
                <TeamSlot name={m.team2} seed={s2} win={m.winner === m.team2} />
              </div>
              <div style={{ height: MU_GAP }} />
            </div>
          )
        })}
      </div>
    )
  }

  const stride32 = (SLOT_H * 2 + GAP + MU_GAP) * 2
  const stride16 = stride32 * 2
  const offset32 = SLOT_H + GAP / 2
  const offset16 = SLOT_H + GAP / 2 + stride32 / 2 - SLOT_H / 2
  const offsetE8  = offset16 + stride16 / 2 - SLOT_H / 2

  if (round === 'r32') {
    return (
      <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
        <div style={{ height: offset32 }} />
        {result.r32.map((m, i) => (
          <div key={i}>
            <TeamSlot name={m.winner} seed={seedMap[m.winner]} win />
            <div style={{ height: stride32 - SLOT_H - MU_GAP }} />
          </div>
        ))}
      </div>
    )
  }

  if (round === 's16') {
    return (
      <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
        <div style={{ height: offset16 }} />
        {result.s16.map((m, i) => (
          <div key={i}>
            <TeamSlot name={m.winner} seed={seedMap[m.winner]} win />
            <div style={{ height: stride16 - SLOT_H - MU_GAP }} />
          </div>
        ))}
      </div>
    )
  }

  // e8
  return (
    <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
      <div style={{ height: offsetE8 }} />
      <TeamSlot name={result.e8.winner} seed={seedMap[result.e8.winner]} win />
    </div>
  )
}

function RegionRight({ result, regionName, col, row, round }: RegionColProps) {
  const seedMap = makeSeedMap(regionName)

  const stride32 = (SLOT_H * 2 + GAP + MU_GAP) * 2
  const stride16 = stride32 * 2
  const offset32 = SLOT_H + GAP / 2
  const offset16 = SLOT_H + GAP / 2 + stride32 / 2 - SLOT_H / 2
  const offsetE8  = offset16 + stride16 / 2 - SLOT_H / 2

  if (!round) {
    // R64 — rightmost column
    return (
      <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
        {R64_PAIRS.map(([s1, s2], i) => {
          const m = result.r64[i]
          return (
            <div key={i}>
              <div className="flex flex-col gap-px mb-1">
                <TeamSlot name={m.team1} seed={s1} win={m.winner === m.team1} />
                <TeamSlot name={m.team2} seed={s2} win={m.winner === m.team2} />
              </div>
              <div style={{ height: MU_GAP }} />
            </div>
          )
        })}
      </div>
    )
  }

  if (round === 'e8') {
    return (
      <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
        <div style={{ height: offsetE8 }} />
        <TeamSlot name={result.e8.winner} seed={seedMap[result.e8.winner]} win />
      </div>
    )
  }

  if (round === 's16') {
    return (
      <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
        <div style={{ height: offset16 }} />
        {result.s16.map((m, i) => (
          <div key={i}>
            <TeamSlot name={m.winner} seed={seedMap[m.winner]} win />
            <div style={{ height: stride16 - SLOT_H - MU_GAP }} />
          </div>
        ))}
      </div>
    )
  }

  // r32
  return (
    <div className="flex flex-col" style={{ gridColumn: col, gridRow: row }}>
      <div style={{ height: offset32 }} />
      {result.r32.map((m, i) => (
        <div key={i}>
          <TeamSlot name={m.winner} seed={seedMap[m.winner]} win />
          <div style={{ height: stride32 - SLOT_H - MU_GAP }} />
        </div>
      ))}
    </div>
  )
}

// ─── Individual team slot ─────────────────────────────────────────────────────

interface SlotProps { name: string; seed: number; win?: boolean; cls?: string }

function TeamSlot({ name, seed, win = false, cls }: SlotProps) {
  const isChamp     = cls === 'champion'
  const isFinalFour = cls === 'final-four'

  return (
    <div
      className="flex items-center gap-1 px-[5px] rounded text-[10px] overflow-hidden"
      style={{
        minHeight: isChamp ? 32 : isFinalFour ? 28 : SLOT_H,
        border: win ? '1px solid var(--orange2)' : '1px solid transparent',
        background: isChamp
          ? 'linear-gradient(135deg, var(--orange), #d45510)'
          : isFinalFour
          ? 'linear-gradient(135deg, #1a3a5c, #0b2a4a)'
          : win
          ? 'var(--orange)'
          : 'var(--navy3)',
        color: win ? 'white' : 'var(--ftext)',
        fontWeight: win ? 600 : 400,
        fontSize: isChamp ? 12 : isFinalFour ? 11 : 10,
        boxShadow: isChamp
          ? '0 0 16px rgba(249,106,27,.5)'
          : win
          ? '0 0 8px rgba(249,106,27,.3)'
          : undefined,
        animation: isChamp ? 'glow-pulse 2s infinite' : undefined,
      }}
    >
      <span
        className="text-[8px] rounded px-[3px] flex-shrink-0 text-center leading-[1.4]"
        style={{
          minWidth: 14,
          background: 'rgba(0,0,0,.25)',
          color: win ? 'rgba(255,255,255,.7)' : 'var(--dim)',
        }}
      >
        {seed}
      </span>
      <span className="truncate flex-1">{name}</span>
    </div>
  )
}
