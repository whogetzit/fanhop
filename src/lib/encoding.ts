import type { ModelState, StatWeights } from '@/types/bracket'
import { DEFAULT_WEIGHTS, STAT_KEYS } from '@/types/bracket'

// ─── v1 encoding: compact binary packing ─────────────────────────────────────
// 17 stats × 4 bits each (values 0–10) = 68 bits packed into 9 bytes → ~12 base64 chars
// Name is appended as UTF-8 after the packed weights.

const WEIGHT_COUNT = STAT_KEYS.length  // 17

function packWeights(w: StatWeights): Uint8Array {
  // Each value is 0–10, fits in 4 bits. Pack pairs into bytes.
  const bytes = new Uint8Array(Math.ceil(WEIGHT_COUNT / 2))
  for (let i = 0; i < WEIGHT_COUNT; i++) {
    const val = Math.max(0, Math.min(10, w[STAT_KEYS[i]]))
    if (i % 2 === 0) {
      bytes[Math.floor(i / 2)] = val << 4
    } else {
      bytes[Math.floor(i / 2)] |= val
    }
  }
  return bytes
}

function unpackWeights(bytes: Uint8Array): StatWeights {
  const w: Partial<StatWeights> = {}
  for (let i = 0; i < WEIGHT_COUNT; i++) {
    const byte = bytes[Math.floor(i / 2)]
    const val = i % 2 === 0 ? (byte >> 4) & 0x0f : byte & 0x0f
    w[STAT_KEYS[i]] = val
  }
  return w as StatWeights
}

// Safe base64url (no +/= chars that need URL encoding)
function toBase64url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function fromBase64url(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - str.length % 4) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function encodeModel(state: ModelState): string {
  const weightBytes = packWeights(state.weights)

  if (!state.name) {
    return toBase64url(weightBytes)
  }

  // Append name as UTF-8 bytes with a 0x00 separator
  const nameBytes = new TextEncoder().encode(state.name)
  const combined = new Uint8Array(weightBytes.length + 1 + nameBytes.length)
  combined.set(weightBytes)
  combined[weightBytes.length] = 0x00  // separator
  combined.set(nameBytes, weightBytes.length + 1)
  return toBase64url(combined)
}

export function decodeModel(param: string): ModelState | null {
  try {
    const bytes = fromBase64url(param)
    const weightByteCount = Math.ceil(WEIGHT_COUNT / 2)  // 9 bytes

    if (bytes.length < weightByteCount) return null

    const weights = unpackWeights(bytes.slice(0, weightByteCount))

    // Check for name separator
    let name: string | undefined
    if (bytes.length > weightByteCount && bytes[weightByteCount] === 0x00) {
      name = new TextDecoder().decode(bytes.slice(weightByteCount + 1))
    }

    return { weights, name }
  } catch {
    return null
  }
}

// Validate decoded weights are in range
export function validateWeights(w: StatWeights): boolean {
  return STAT_KEYS.every(k => {
    const v = w[k]
    return typeof v === 'number' && v >= 0 && v <= 10 && Number.isInteger(v)
  })
}

export function buildShareUrl(state: ModelState, baseUrl?: string): string {
  const base = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const encoded = encodeModel(state)
  return `${base}/bracket?m=${encoded}`
}

export function parseModelFromSearchParams(
  searchParams: URLSearchParams | Record<string, string>
): ModelState | null {
  const m = searchParams instanceof URLSearchParams
    ? searchParams.get('m')
    : searchParams['m']
  if (!m) return null
  const decoded = decodeModel(m)
  if (!decoded || !validateWeights(decoded.weights)) return null
  return decoded
}

export function parseModelFromUrl(url: string): ModelState | null {
  try {
    const u = new URL(url)
    const m = u.searchParams.get('m')
    if (!m) return null
    const decoded = decodeModel(m)
    if (!decoded || !validateWeights(decoded.weights)) return null
    return decoded
  } catch {
    // Try treating input directly as the m= value
    try {
      const decoded = decodeModel(url)
      if (!decoded || !validateWeights(decoded.weights)) return null
      return decoded
    } catch {
      return null
    }
  }
}

// ─── Bracket result encoding ──────────────────────────────────────────────────
// Encodes all 63 game outcomes as 1 bit each (0=team1 wins, 1=team2 wins)
// 63 bits packed into 8 bytes → ~11 base64url chars
// Game order: for each region [Midwest,West,East,South]:
//   8× R64, 4× R32, 2× S16, 1× E8  (15 games × 4 regions = 60)
// Then FF1 (South vs West), FF2 (East vs Midwest), Championship = 3 more = 63 total

import type { TournamentResult, RegionName } from '@/types/bracket'
import { BRACKET } from '@/lib/data/2025'

const REGIONS: RegionName[] = ['Midwest', 'West', 'East', 'South']
const R64_PAIRS_ENC: [number, number][] = [[1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15]]

export function encodeBracket(result: TournamentResult): string {
  const bits: number[] = []

  for (const region of REGIONS) {
    const reg = result.regions[region]
    const b = BRACKET[region]
    // R64 (8 games)
    for (let i = 0; i < 8; i++) {
      const m = reg.r64[i]
      bits.push(m.winner === m.team1 ? 0 : 1)
    }
    // R32 (4 games)
    for (let i = 0; i < 4; i++) {
      const m = reg.r32[i]
      bits.push(m.winner === m.team1 ? 0 : 1)
    }
    // S16 (2 games)
    for (let i = 0; i < 2; i++) {
      const m = reg.s16[i]
      bits.push(m.winner === m.team1 ? 0 : 1)
    }
    // E8 (1 game)
    const e8 = reg.e8
    bits.push(e8.winner === e8.team1 ? 0 : 1)
  }

  // FF1: South vs West winner (ff1)
  bits.push(result.ff1.winner === result.regions.South.winner ? 0 : 1)
  // FF2: East vs Midwest winner (ff2)
  bits.push(result.ff2.winner === result.regions.East.winner ? 0 : 1)
  // Championship: ff1 winner vs ff2 winner
  bits.push(result.champion === result.ff1.winner ? 0 : 1)

  // Pack 63 bits into 8 bytes
  const bytes = new Uint8Array(8)
  for (let i = 0; i < bits.length; i++) {
    if (bits[i]) bytes[Math.floor(i / 8)] |= (1 << (7 - (i % 8)))
  }
  return 'b1:' + toBase64url(bytes)
}

export function decodeBracket(encoded: string): TournamentResult | null {
  try {
    if (!encoded.startsWith('b1:')) return null
    const bytes = fromBase64url(encoded.slice(3))
    if (bytes.length < 8) return null

    const bits: number[] = []
    for (let i = 0; i < 63; i++) {
      bits.push((bytes[Math.floor(i / 8)] >> (7 - (i % 8))) & 1)
    }

    let bitIdx = 0
    const regions: Partial<Record<RegionName, any>> = {}

    for (const region of REGIONS) {
      const b = BRACKET[region]
      const seeds = R64_PAIRS_ENC
      // Reconstruct r64
      const r64 = seeds.map(([s1, s2], i) => {
        const team1 = b[s1], team2 = b[s2]
        const bit = bits[bitIdx++]
        const winner = bit === 0 ? team1 : team2
        const loser  = bit === 0 ? team2 : team1
        return { team1, team2, seed1: s1, seed2: s2, winner, loser }
      })
      // r32
      const r32 = [0,1,2,3].map(i => {
        const team1 = r64[i*2].winner, team2 = r64[i*2+1].winner
        const s1 = r64[i*2].winner === r64[i*2].team1 ? r64[i*2].seed1 : r64[i*2].seed2
        const s2 = r64[i*2+1].winner === r64[i*2+1].team1 ? r64[i*2+1].seed1 : r64[i*2+1].seed2
        const bit = bits[bitIdx++]
        const winner = bit === 0 ? team1 : team2
        return { team1, team2, seed1: s1, seed2: s2, winner, loser: bit === 0 ? team2 : team1 }
      })
      // s16
      const s16 = [0,1].map(i => {
        const team1 = r32[i*2].winner, team2 = r32[i*2+1].winner
        const s1 = r32[i*2].winner === r32[i*2].team1 ? r32[i*2].seed1 : r32[i*2].seed2
        const s2 = r32[i*2+1].winner === r32[i*2+1].team1 ? r32[i*2+1].seed1 : r32[i*2+1].seed2
        const bit = bits[bitIdx++]
        const winner = bit === 0 ? team1 : team2
        return { team1, team2, seed1: s1, seed2: s2, winner, loser: bit === 0 ? team2 : team1 }
      })
      // e8
      const team1 = s16[0].winner, team2 = s16[1].winner
      const s1 = s16[0].winner === s16[0].team1 ? s16[0].seed1 : s16[0].seed2
      const s2 = s16[1].winner === s16[1].team1 ? s16[1].seed1 : s16[1].seed2
      const bit = bits[bitIdx++]
      const e8winner = bit === 0 ? team1 : team2
      const e8 = { team1, team2, seed1: s1, seed2: s2, winner: e8winner, loser: bit === 0 ? team2 : team1 }

      regions[region] = { r64, r32, s16, e8, winner: e8winner }
    }

    const southWinner = regions.South!.winner
    const westWinner  = regions.West!.winner
    const eastWinner  = regions.East!.winner
    const midwestWinner = regions.Midwest!.winner

    const ff1bit = bits[bitIdx++]
    const ff1winner = ff1bit === 0 ? southWinner : westWinner
    const ff2bit = bits[bitIdx++]
    const ff2winner = ff2bit === 0 ? eastWinner : midwestWinner
    const champbit = bits[bitIdx++]
    const champion = champbit === 0 ? ff1winner : ff2winner

    return {
      regions: regions as Record<RegionName, any>,
      ff1: { winner: ff1winner, loser: ff1bit === 0 ? westWinner : southWinner },
      ff2: { winner: ff2winner, loser: ff2bit === 0 ? midwestWinner : eastWinner },
      finalFour: [southWinner, westWinner, eastWinner, midwestWinner],
      champion,
    }
  } catch {
    return null
  }
}
