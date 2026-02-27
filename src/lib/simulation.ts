// @ts-nocheck
import type {
  StatWeights, TeamStats, RegionName, BracketData,
  Matchup, RegionResult, TournamentResult,
} from '@/types/bracket'
import { TEAMS as TEAMS_2013, BRACKET as BRACKET_2013 } from '@/lib/data/2013'
import { TEAMS as TEAMS_2025, BRACKET as BRACKET_2025 } from '@/lib/data/2025'

export type TournamentYear = '2013' | '2025'

const MAX_RANK = 350

// ─── Active year data (switchable) ───────────────────────────────────────────
let activeTeams: Record<string, TeamStats> = TEAMS_2025
let activeBracket: BracketData = BRACKET_2025

export function setYear(year: TournamentYear) {
  if (year === '2013') {
    activeTeams = TEAMS_2013
    activeBracket = BRACKET_2013
  } else {
    activeTeams = TEAMS_2025
    activeBracket = BRACKET_2025
  }
}

export function getActiveTeams() { return activeTeams }
export function getActiveBracket() { return activeBracket }

// ─── Score a single team given current weights ────────────────────────────────

export function scoreTeam(name: string, weights: StatWeights, teams?: Record<string, TeamStats>): number {
  const t = (teams || activeTeams)[name]
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
): Matchup {
  const s1 = scoreTeam(team1, weights, teams)
  const s2 = scoreTeam(team2, weights, teams)
  // Tiebreak by seed (lower seed = stronger team) so all-zero sliders = chalk bracket
  let winner: string, loser: string
  if (s1 !== s2) {
    [winner, loser] = s1 > s2 ? [team1, team2] : [team2, team1]
  } else {
    [winner, loser] = seed1 <= seed2 ? [team1, team2] : [team2, team1]
  }
  return { team1, team2, seed1, seed2, winner, loser }
}

// ─── Simulate a full region ───────────────────────────────────────────────────

const R64_PAIRS: [number, number][] = [
  [1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15],
]

function makeSeedMap(region: RegionName, bracket?: BracketData): Record<string, number> {
  const map: Record<string, number> = {}
  const b = bracket || activeBracket
  for (const [seed, team] of Object.entries(b[region])) {
    map[team] = Number(seed)
  }
  return map
}

export function simRegion(regionName: RegionName, weights: StatWeights, bracket?: BracketData, teams?: Record<string, TeamStats>): RegionResult {
  const b = bracket || activeBracket
  const seeding = b[regionName]
  const seedMap = makeSeedMap(regionName, b)

  const r64: Matchup[] = R64_PAIRS.map(([s1, s2]) =>
    simMatchup(seeding[s1], s1, seeding[s2], s2, weights, teams)
  )

  const r32: Matchup[] = [0, 1, 2, 3].map(i => {
    const a = r64[i * 2]
    const b2 = r64[i * 2 + 1]
    return simMatchup(a.winner, seedMap[a.winner], b2.winner, seedMap[b2.winner], weights, teams)
  })

  const s16: Matchup[] = [0, 1].map(i => {
    const a = r32[i * 2]
    const b2 = r32[i * 2 + 1]
    return simMatchup(a.winner, seedMap[a.winner], b2.winner, seedMap[b2.winner], weights, teams)
  })

  const e8 = simMatchup(
    s16[0].winner, seedMap[s16[0].winner],
    s16[1].winner, seedMap[s16[1].winner],
    weights, teams
  )

  return { r64, r32, s16, e8, winner: e8.winner }
}

// ─── Simulate the full tournament ────────────────────────────────────────────

export function simTournament(weights: StatWeights, bracket?: BracketData, teams?: Record<string, TeamStats>): TournamentResult {
  const b = bracket || activeBracket
  const t = teams || activeTeams

  const regions = (['Midwest', 'West', 'East', 'South'] as RegionName[]).reduce(
    (acc, r) => ({ ...acc, [r]: simRegion(r, weights, b, t) }),
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
    weights, t
  )
  const ff2 = simMatchup(
    regions.East.winner,  seedMap[regions.East.winner],
    regions.South.winner, seedMap[regions.South.winner],
    weights, t
  )

  const championship = simMatchup(
    ff1.winner, seedMap[ff1.winner],
    ff2.winner, seedMap[ff2.winner],
    weights, t
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
    for (const [seed, team] of Object.entries(activeBracket[region])) {
      if (team === teamName) return Number(seed)
    }
  }
  return 0
}
