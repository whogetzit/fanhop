import type {
  StatWeights, TeamStats, RegionName, BracketData,
  Matchup, RegionResult, TournamentResult,
} from '@/types/bracket'
import { TEAMS, BRACKET } from '@/lib/data/2013'

const MAX_RANK = 350

// ─── Score a single team given current weights ────────────────────────────────

export function scoreTeam(name: string, weights: StatWeights): number {
  const t = TEAMS[name]
  if (!t) return 0
  let score = 0

  for (const [stat, w] of Object.entries(weights) as [keyof StatWeights, number][]) {
    if (!w) continue
    const rank = (t[stat] as number) || MAX_RANK
    // All stats: lower rank number = better performance = higher score
    // (defensive stats like opp_ppg are already ranked so lower rank = better defense)
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
): Matchup {
  const s1 = scoreTeam(team1, weights)
  const s2 = scoreTeam(team2, weights)
  const [winner, loser] = s1 >= s2 ? [team1, team2] : [team2, team1]
  return { team1, team2, seed1, seed2, winner, loser }
}

// ─── Simulate a full region ───────────────────────────────────────────────────

// Standard NCAA bracket pair order: 1v16, 8v9, 5v12, 4v13, 6v11, 3v14, 7v10, 2v15
const R64_PAIRS: [number, number][] = [
  [1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15],
]

// Seed lookup map for a region (teamName → seed)
function makeSeedMap(region: RegionName): Record<string, number> {
  const map: Record<string, number> = {}
  for (const [seed, team] of Object.entries(BRACKET[region])) {
    map[team] = Number(seed)
  }
  return map
}

export function simRegion(regionName: RegionName, weights: StatWeights): RegionResult {
  const seeding = BRACKET[regionName]
  const seedMap = makeSeedMap(regionName)

  // Round of 64
  const r64: Matchup[] = R64_PAIRS.map(([s1, s2]) =>
    simMatchup(seeding[s1], s1, seeding[s2], s2, weights)
  )

  // Round of 32: winners of games (0,1), (2,3), (4,5), (6,7)
  const r32: Matchup[] = [0, 1, 2, 3].map(i => {
    const a = r64[i * 2]
    const b = r64[i * 2 + 1]
    return simMatchup(a.winner, seedMap[a.winner], b.winner, seedMap[b.winner], weights)
  })

  // Sweet 16: winners of r32 (0,1) and (2,3)
  const s16: Matchup[] = [0, 1].map(i => {
    const a = r32[i * 2]
    const b = r32[i * 2 + 1]
    return simMatchup(a.winner, seedMap[a.winner], b.winner, seedMap[b.winner], weights)
  })

  // Elite 8
  const e8 = simMatchup(
    s16[0].winner, seedMap[s16[0].winner],
    s16[1].winner, seedMap[s16[1].winner],
    weights
  )

  return { r64, r32, s16, e8, winner: e8.winner }
}

// ─── Simulate the full tournament ────────────────────────────────────────────

export function simTournament(weights: StatWeights): TournamentResult {
  const regions = (['Midwest', 'West', 'East', 'South'] as RegionName[]).reduce(
    (acc, r) => ({ ...acc, [r]: simRegion(r, weights) }),
    {} as Record<RegionName, RegionResult>
  )

  const seedMap = {
    ...makeSeedMap('Midwest'),
    ...makeSeedMap('West'),
    ...makeSeedMap('East'),
    ...makeSeedMap('South'),
  }

  // Final Four: Midwest vs West, East vs South
  const ff1 = simMatchup(
    regions.Midwest.winner, seedMap[regions.Midwest.winner],
    regions.West.winner,    seedMap[regions.West.winner],
    weights
  )
  const ff2 = simMatchup(
    regions.East.winner,  seedMap[regions.East.winner],
    regions.South.winner, seedMap[regions.South.winner],
    weights
  )

  const championship = simMatchup(
    ff1.winner, seedMap[ff1.winner],
    ff2.winner, seedMap[ff2.winner],
    weights
  )

  return {
    regions,
    ff1:       { winner: ff1.winner, loser: ff1.loser },
    ff2:       { winner: ff2.winner, loser: ff2.loser },
    finalFour: [regions.Midwest.winner, regions.West.winner, regions.East.winner, regions.South.winner],
    champion:  championship.winner,
  }
}

// ─── Seed lookup helper (used by UI) ─────────────────────────────────────────

const GLOBAL_SEED_MAP: Record<string, number> = {}
for (const region of ['Midwest', 'West', 'East', 'South'] as RegionName[]) {
  for (const [seed, team] of Object.entries(BRACKET[region])) {
    GLOBAL_SEED_MAP[team] = Number(seed)
  }
}

export function getSeed(teamName: string): number {
  return GLOBAL_SEED_MAP[teamName] ?? 0
}
