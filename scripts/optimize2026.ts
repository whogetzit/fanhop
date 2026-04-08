/**
 * Optimizer script: finds the slider weights that best predict
 * the actual 2026 NCAA Tournament results.
 *
 * Uses simulated annealing over the 17 weight parameters (0-10 each).
 * Scoring uses standard bracket pool weighting (later rounds worth more).
 *
 * Run: npx tsx scripts/optimize2026.ts
 */

// ─── Inline team data & bracket (avoid Next.js import issues) ──────────────

import { TEAMS, BRACKET, RESULTS_2026 } from '../src/lib/data/2026'

const MAX_RANK = 350

const STAT_KEYS = [
  'ppg', 'fg_pct', 'three_pg', 'ft_pct', 'scr_mar',
  'opp_ppg', 'opp_fg_pct', 'bkpg', 'stpg',
  'reb_mar', 'apg', 'ast_to', 'topg', 'opp_topg',
  'win_pct', 'rpi', 'conf_strength',
] as const

type StatWeights = Record<typeof STAT_KEYS[number], number>

// ─── Score a team ────────────────────────────────────────────────────────────

function scoreTeam(name: string, weights: StatWeights): number {
  const t = TEAMS[name]
  if (!t) return 0
  let score = 0
  for (const stat of STAT_KEYS) {
    const w = weights[stat]
    if (!w) continue
    const rank = (t[stat] as number) || MAX_RANK
    const s = (MAX_RANK - rank) / MAX_RANK
    score += s * w
  }
  return score
}

// ─── Simulate a matchup (deterministic, non-chaos) ──────────────────────────

function pickWinner(team1: string, seed1: number, team2: string, seed2: number, weights: StatWeights): string {
  const s1 = scoreTeam(team1, weights)
  const s2 = scoreTeam(team2, weights)
  if (s1 !== s2) return s1 > s2 ? team1 : team2
  return seed1 <= seed2 ? team1 : team2  // tiebreak: lower seed wins
}

// ─── Simulate region and return bracket picks ───────────────────────────────

const R64_PAIRS: [number, number][] = [
  [1,16],[8,9],[5,12],[4,13],[6,11],[3,14],[7,10],[2,15],
]

interface RegionPicks {
  r64: string[]
  r32: string[]
  s16: string[]
  e8:  string
}

function simRegion(regionName: string, weights: StatWeights): RegionPicks {
  const seeding = BRACKET[regionName as keyof typeof BRACKET]
  const seedMap: Record<string, number> = {}
  for (const [seed, team] of Object.entries(seeding)) {
    seedMap[team] = Number(seed)
  }

  const r64 = R64_PAIRS.map(([s1, s2]) =>
    pickWinner(seeding[s1], s1, seeding[s2], s2, weights)
  )

  const r32 = [0, 1, 2, 3].map(i => {
    const a = r64[i * 2], b = r64[i * 2 + 1]
    return pickWinner(a, seedMap[a], b, seedMap[b], weights)
  })

  const s16 = [0, 1].map(i => {
    const a = r32[i * 2], b = r32[i * 2 + 1]
    return pickWinner(a, seedMap[a], b, seedMap[b], weights)
  })

  const e8 = pickWinner(s16[0], seedMap[s16[0]], s16[1], seedMap[s16[1]], weights)

  return { r64, r32, s16, e8 }
}

// ─── Score a full bracket against actual results ────────────────────────────

// Standard bracket pool scoring: R64=1, R32=2, S16=4, E8=8, FF=16, Champ=32
const ROUND_POINTS = { r64: 1, r32: 2, s16: 4, e8: 8, ff: 16, champ: 32 }

function scoreBracket(weights: StatWeights): number {
  let points = 0
  const regions = ['East', 'West', 'South', 'Midwest'] as const
  const regionResults: Record<string, RegionPicks> = {}

  // Build a global seed map for Final Four matchups
  const seedMap: Record<string, number> = {}
  for (const region of regions) {
    const seeding = BRACKET[region as keyof typeof BRACKET]
    for (const [seed, team] of Object.entries(seeding)) {
      seedMap[team] = Number(seed)
    }
  }

  for (const region of regions) {
    const predicted = simRegion(region, weights)
    regionResults[region] = predicted
    const actual = RESULTS_2026[region]

    // R64 (8 games)
    for (let i = 0; i < 8; i++) {
      if (predicted.r64[i] === actual.r64[i]) points += ROUND_POINTS.r64
    }
    // R32 (4 games)
    for (let i = 0; i < 4; i++) {
      if (predicted.r32[i] === actual.r32[i]) points += ROUND_POINTS.r32
    }
    // S16 (2 games)
    for (let i = 0; i < 2; i++) {
      if (predicted.s16[i] === actual.s16[i]) points += ROUND_POINTS.s16
    }
    // E8 (1 game)
    if (predicted.e8 === actual.e8) points += ROUND_POINTS.e8
  }

  // Final Four
  // Midwest vs West
  const ff1Winner = pickWinner(
    regionResults.Midwest.e8, seedMap[regionResults.Midwest.e8],
    regionResults.West.e8,    seedMap[regionResults.West.e8],
    weights
  )
  // East vs South
  const ff2Winner = pickWinner(
    regionResults.East.e8,  seedMap[regionResults.East.e8],
    regionResults.South.e8, seedMap[regionResults.South.e8],
    weights
  )

  if (ff1Winner === RESULTS_2026.finalist1) points += ROUND_POINTS.ff
  if (ff2Winner === RESULTS_2026.finalist2) points += ROUND_POINTS.ff

  // Championship
  const champion = pickWinner(ff1Winner, seedMap[ff1Winner], ff2Winner, seedMap[ff2Winner], weights)
  if (champion === RESULTS_2026.champion) points += ROUND_POINTS.champ

  return points
}

// ─── Also compute game-by-game accuracy (for reporting) ─────────────────────

function countCorrectGames(weights: StatWeights): { correct: number; total: number; details: string[] } {
  const regions = ['East', 'West', 'South', 'Midwest'] as const
  let correct = 0, total = 0
  const details: string[] = []
  const regionResults: Record<string, RegionPicks> = {}

  const seedMap: Record<string, number> = {}
  for (const region of regions) {
    const seeding = BRACKET[region as keyof typeof BRACKET]
    for (const [seed, team] of Object.entries(seeding)) {
      seedMap[team] = Number(seed)
    }
  }

  for (const region of regions) {
    const predicted = simRegion(region, weights)
    regionResults[region] = predicted
    const actual = RESULTS_2026[region]

    for (let i = 0; i < 8; i++) {
      total++
      const ok = predicted.r64[i] === actual.r64[i]
      if (ok) correct++
      else details.push(`${region} R64[${i}]: predicted ${predicted.r64[i]}, actual ${actual.r64[i]}`)
    }
    for (let i = 0; i < 4; i++) {
      total++
      const ok = predicted.r32[i] === actual.r32[i]
      if (ok) correct++
      else details.push(`${region} R32[${i}]: predicted ${predicted.r32[i]}, actual ${actual.r32[i]}`)
    }
    for (let i = 0; i < 2; i++) {
      total++
      const ok = predicted.s16[i] === actual.s16[i]
      if (ok) correct++
      else details.push(`${region} S16[${i}]: predicted ${predicted.s16[i]}, actual ${actual.s16[i]}`)
    }
    total++
    const ok = predicted.e8 === actual.e8
    if (ok) correct++
    else details.push(`${region} E8: predicted ${predicted.e8}, actual ${actual.e8}`)
  }

  // FF
  const ff1Winner = pickWinner(
    regionResults.Midwest.e8, seedMap[regionResults.Midwest.e8],
    regionResults.West.e8, seedMap[regionResults.West.e8], weights
  )
  const ff2Winner = pickWinner(
    regionResults.East.e8, seedMap[regionResults.East.e8],
    regionResults.South.e8, seedMap[regionResults.South.e8], weights
  )
  total += 2
  if (ff1Winner === RESULTS_2026.finalist1) correct++
  else details.push(`FF1: predicted ${ff1Winner}, actual ${RESULTS_2026.finalist1}`)
  if (ff2Winner === RESULTS_2026.finalist2) correct++
  else details.push(`FF2: predicted ${ff2Winner}, actual ${RESULTS_2026.finalist2}`)

  total++
  const champion = pickWinner(ff1Winner, seedMap[ff1Winner], ff2Winner, seedMap[ff2Winner], weights)
  if (champion === RESULTS_2026.champion) correct++
  else details.push(`Champ: predicted ${champion}, actual ${RESULTS_2026.champion}`)

  return { correct, total, details }
}

// ─── Simulated annealing optimizer ──────────────────────────────────────────

function randomWeights(): StatWeights {
  const w: any = {}
  for (const k of STAT_KEYS) w[k] = Math.floor(Math.random() * 11)
  return w
}

function cloneWeights(w: StatWeights): StatWeights {
  return { ...w }
}

function neighbor(w: StatWeights): StatWeights {
  const n = cloneWeights(w)
  // Tweak 1-3 random stats
  const numTweaks = 1 + Math.floor(Math.random() * 3)
  for (let i = 0; i < numTweaks; i++) {
    const key = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)]
    const delta = Math.random() < 0.5 ? -1 : 1
    n[key] = Math.max(0, Math.min(10, n[key] + delta))
  }
  return n
}

function optimize() {
  const MAX_ITER = 500_000
  const T_START = 10
  const T_END = 0.01
  const NUM_RESTARTS = 20

  let globalBest: StatWeights = randomWeights()
  let globalBestScore = scoreBracket(globalBest)

  console.log('Starting optimization with simulated annealing...')
  console.log(`Max possible bracket score: 192 points`)
  console.log(`Restarts: ${NUM_RESTARTS}, Iterations per restart: ${MAX_ITER}\n`)

  for (let restart = 0; restart < NUM_RESTARTS; restart++) {
    let current = randomWeights()
    let currentScore = scoreBracket(current)
    let best = cloneWeights(current)
    let bestScore = currentScore

    for (let iter = 0; iter < MAX_ITER; iter++) {
      const t = T_START * Math.pow(T_END / T_START, iter / MAX_ITER)
      const candidate = neighbor(current)
      const candidateScore = scoreBracket(candidate)

      if (candidateScore > currentScore || Math.random() < Math.exp((candidateScore - currentScore) / t)) {
        current = candidate
        currentScore = candidateScore
      }

      if (currentScore > bestScore) {
        best = cloneWeights(current)
        bestScore = currentScore
      }
    }

    if (bestScore > globalBestScore) {
      globalBest = cloneWeights(best)
      globalBestScore = bestScore
    }

    console.log(`Restart ${restart + 1}/${NUM_RESTARTS}: best score = ${bestScore} (global best = ${globalBestScore})`)
  }

  return { weights: globalBest, score: globalBestScore }
}

// ─── Main ───────────────────────────────────────────────────────────────────

const { weights, score } = optimize()

console.log('\n══════════════════════════════════════════════════')
console.log(`OPTIMAL WEIGHTS (bracket score: ${score}/192)`)
console.log('══════════════════════════════════════════════════')

// Print as a TypeScript object
const parts = STAT_KEYS.map(k => `${k}:${weights[k]}`)
console.log(`\nhindsight2026: { ${parts.join(', ')} },\n`)

// Print detailed accuracy
const { correct, total, details } = countCorrectGames(weights)
console.log(`Game-by-game accuracy: ${correct}/${total} (${(100 * correct / total).toFixed(1)}%)`)
console.log(`\nMissed predictions:`)
for (const d of details) console.log(`  ✗ ${d}`)

// Also show what the bracket looks like
console.log('\n── Predicted bracket with optimal weights ──')
for (const region of ['East', 'West', 'South', 'Midwest']) {
  const predicted = simRegion(region, weights)
  const actual = RESULTS_2026[region as keyof typeof RESULTS_2026] as any
  console.log(`\n${region}:`)
  console.log(`  R64:  ${predicted.r64.join(', ')}`)
  console.log(`  R32:  ${predicted.r32.join(', ')}`)
  console.log(`  S16:  ${predicted.s16.join(', ')}`)
  console.log(`  E8:   ${predicted.e8}  ${predicted.e8 === actual.e8 ? '✓' : '✗ (actual: ' + actual.e8 + ')'}`)
}

// Final Four
const seedMap: Record<string, number> = {}
for (const region of ['East', 'West', 'South', 'Midwest']) {
  const seeding = BRACKET[region as keyof typeof BRACKET]
  for (const [seed, team] of Object.entries(seeding)) {
    seedMap[team] = Number(seed)
  }
}
const rEast = simRegion('East', weights)
const rWest = simRegion('West', weights)
const rSouth = simRegion('South', weights)
const rMidwest = simRegion('Midwest', weights)

const ff1 = pickWinner(rMidwest.e8, seedMap[rMidwest.e8], rWest.e8, seedMap[rWest.e8], weights)
const ff2 = pickWinner(rEast.e8, seedMap[rEast.e8], rSouth.e8, seedMap[rSouth.e8], weights)
const champ = pickWinner(ff1, seedMap[ff1], ff2, seedMap[ff2], weights)
console.log(`\nFinal Four: ${rMidwest.e8} vs ${rWest.e8} → ${ff1}  ${ff1 === RESULTS_2026.finalist1 ? '✓' : '✗'}`)
console.log(`Final Four: ${rEast.e8} vs ${rSouth.e8} → ${ff2}  ${ff2 === RESULTS_2026.finalist2 ? '✓' : '✗'}`)
console.log(`Champion: ${champ}  ${champ === RESULTS_2026.champion ? '✓' : '✗'}`)
