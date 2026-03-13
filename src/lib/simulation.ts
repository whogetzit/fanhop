// @ts-nocheck
import type {
  StatWeights, TeamStats, RegionName, BracketData,
  Matchup, RegionResult, TournamentResult,
} from '@/types/bracket'
import { TEAMS as TEAMS_2013, BRACKET as BRACKET_2013 } from '@/lib/data/2013'
import { TEAMS as TEAMS_2025, BRACKET as BRACKET_2025 } from '@/lib/data/2025'
import { TEAMS as TEAMS_2026, BRACKET as BRACKET_2026 } from '@/lib/data/2026'

export type TournamentYear = '2013' | '2025' | '2026'

const MAX_RANK = 350

// ─── Year data (immutable, safe for concurrent serverless requests) ──────────
const YEAR_DATA: Record<TournamentYear, { teams: Record<string, TeamStats>; bracket: BracketData }> = {
  '2013': { teams: TEAMS_2013, bracket: BRACKET_2013 },
  '2025': { teams: TEAMS_2025, bracket: BRACKET_2025 },
  '2026': { teams: TEAMS_2026, bracket: BRACKET_2026 },
}

export const DEFAULT_YEAR: TournamentYear = '2026'
export const DEFAULT_YEAR_NUM = parseInt(DEFAULT_YEAR, 10)

export function getActiveTeams(year: TournamentYear = DEFAULT_YEAR) { return YEAR_DATA[year].teams }
export function getActiveBracket(year: TournamentYear = DEFAULT_YEAR) { return YEAR_DATA[year].bracket }

// ─── Score a single team given current weights ────────────────────────────────

export function scoreTeam(name: string, weights: StatWeights, teams?: Record<string, TeamStats>): number {
  const t = (teams || YEAR_DATA[DEFAULT_YEAR].teams)[name]
  if (!t) return 0
  let score = 0
  for (const [stat, w] of Object.entries(weights) as [keyof StatWeights, number][]) {
    if (!w) continue
    const rank = (t[stat] as number) || MAX_RANK
    const s = (MAX_RANK - rank) / MAX_RANK
    score += s * w
  }
  return score
}

// ─── Simulate a single matchup ────────────────────────────────────────────────

function simMatchup(
  team1: string, seed1: number,
  team2: string, seed2: number,
  weights: StatWeights,
  teams?: Record<string, TeamStats>,
  chaos = false,
): Matchup {
  let winner: string, loser: string

  if (chaos) {
    // In chaos mode: probability of upset scales with seed gap
    // A 1 vs 16 has ~15% upset chance; a 7 vs 10 is nearly 50/50
    const favorite = seed1 <= seed2 ? team1 : team2
    const favSeed   = seed1 <= seed2 ? seed1  : seed2
    const dog       = seed1 <= seed2 ? team2 : team1
    const dogSeed   = seed1 <= seed2 ? seed2  : seed1
    const seedGap   = dogSeed - favSeed  // 0–15
    // Upset probability: ranges from ~48% (gap=1) down to ~8% (gap=15)
    const upsetProb = 0.50 - (seedGap / 15) * 0.42
    const upset     = Math.random() < upsetProb
    ;[winner, loser] = upset ? [dog, favorite] : [favorite, dog]
  } else {
    const s1 = scoreTeam(team1, weights, teams)
    const s2 = scoreTeam(team2, weights, teams)
    // Tiebreak by seed (lower seed = stronger team) so all-zero sliders = chalk bracket
    if (s1 !== s2) {
      [winner, loser] = s1 > s2 ? [team1, team2] : [team2, team1]
    } else {
      [winner, loser] = seed1 <= seed2 ? [team1, team2] : [team2, team1]
    }
  }

  return { team1, team2, seed1, seed2, winner, loser }
}

// ─── Simulate a full region ───────────────────────────────────────────────────

const R64_PAIRS: [number, number][] = [
  [1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15],
]

function makeSeedMap(region: RegionName, bracket?: BracketData): Record<string, number> {
  const map: Record<string, number> = {}
  const b = bracket || YEAR_DATA[DEFAULT_YEAR].bracket
  for (const [seed, team] of Object.entries(b[region])) {
    map[team] = Number(seed)
  }
  return map
}

export function simRegion(regionName: RegionName, weights: StatWeights, bracket?: BracketData, teams?: Record<string, TeamStats>, chaos = false): RegionResult {
  const b = bracket || YEAR_DATA[DEFAULT_YEAR].bracket
  const seeding = b[regionName]
  const seedMap = makeSeedMap(regionName, b)

  const r64: Matchup[] = R64_PAIRS.map(([s1, s2]) =>
    simMatchup(seeding[s1], s1, seeding[s2], s2, weights, teams, chaos)
  )

  const r32: Matchup[] = [0, 1, 2, 3].map(i => {
    const a = r64[i * 2]
    const b2 = r64[i * 2 + 1]
    return simMatchup(a.winner, seedMap[a.winner], b2.winner, seedMap[b2.winner], weights, teams, chaos)
  })

  const s16: Matchup[] = [0, 1].map(i => {
    const a = r32[i * 2]
    const b2 = r32[i * 2 + 1]
    return simMatchup(a.winner, seedMap[a.winner], b2.winner, seedMap[b2.winner], weights, teams, chaos)
  })

  const e8 = simMatchup(
    s16[0].winner, seedMap[s16[0].winner],
    s16[1].winner, seedMap[s16[1].winner],
    weights, teams, chaos
  )

  return { r64, r32, s16, e8, winner: e8.winner }
}

// ─── Simulate the full tournament ────────────────────────────────────────────

export function simTournament(weights: StatWeights, bracket?: BracketData, teams?: Record<string, TeamStats>, chaos = false): TournamentResult {
  const b = bracket || YEAR_DATA[DEFAULT_YEAR].bracket
  const t = teams || YEAR_DATA[DEFAULT_YEAR].teams

  const regions = (['Midwest', 'West', 'East', 'South'] as RegionName[]).reduce(
    (acc, r) => ({ ...acc, [r]: simRegion(r, weights, b, t, chaos) }),
    {} as Record<RegionName, RegionResult>
  )

  const seedMap = {
    ...makeSeedMap('Midwest', b),
    ...makeSeedMap('West', b),
    ...makeSeedMap('East', b),
    ...makeSeedMap('South', b),
  }

  const ff1 = simMatchup(
    regions.Midwest.winner, seedMap[regions.Midwest.winner],
    regions.West.winner,    seedMap[regions.West.winner],
    weights, t, chaos
  )
  const ff2 = simMatchup(
    regions.East.winner,  seedMap[regions.East.winner],
    regions.South.winner, seedMap[regions.South.winner],
    weights, t, chaos
  )

  const championship = simMatchup(
    ff1.winner, seedMap[ff1.winner],
    ff2.winner, seedMap[ff2.winner],
    weights, t, chaos
  )

  return {
    regions,
    ff1:       { winner: ff1.winner, loser: ff1.loser },
    ff2:       { winner: ff2.winner, loser: ff2.loser },
    finalFour: [regions.Midwest.winner, regions.West.winner, regions.East.winner, regions.South.winner],
    champion:  championship.winner,
  }
}

// ─── Seed lookup helper ───────────────────────────────────────────────────────

export function getSeed(teamName: string): number {
  for (const region of ['Midwest', 'West', 'East', 'South'] as RegionName[]) {
    for (const [seed, team] of Object.entries(YEAR_DATA[DEFAULT_YEAR].bracket[region])) {
      if (team === teamName) return Number(seed)
    }
  }
  return 0
}
