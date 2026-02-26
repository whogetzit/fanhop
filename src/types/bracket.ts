// ─── Stat weights (0–10 each) ───────────────────────────────────────────────

export interface StatWeights {
  ppg: number
  fg_pct: number
  three_pg: number
  ft_pct: number
  scr_mar: number
  opp_ppg: number
  opp_fg_pct: number
  bkpg: number
  stpg: number
  reb_mar: number
  apg: number
  ast_to: number
  topg: number
  opp_topg: number
  win_pct: number
  rpi: number
  conf_strength: number
}

export const STAT_KEYS = [
  'ppg', 'fg_pct', 'three_pg', 'ft_pct', 'scr_mar',
  'opp_ppg', 'opp_fg_pct', 'bkpg', 'stpg',
  'reb_mar', 'apg', 'ast_to', 'topg', 'opp_topg',
  'win_pct', 'rpi', 'conf_strength',
] as const satisfies (keyof StatWeights)[]

export const STAT_LABELS: Record<keyof StatWeights, string> = {
  ppg:           'Points/Game',
  fg_pct:        'FG%',
  three_pg:      '3-Pointers/Game',
  ft_pct:        'FT%',
  scr_mar:       'Score Margin',
  opp_ppg:       'Opp PPG',
  opp_fg_pct:    'Opp FG%',
  bkpg:          'Blocks/Game',
  stpg:          'Steals/Game',
  reb_mar:       'Rebound Margin',
  apg:           'Assists/Game',
  ast_to:        'Ast/TO Ratio',
  topg:          'Turnovers/Game',
  opp_topg:      'Force Turnovers',
  win_pct:       'Win %',
  rpi:           'RPI Ranking',
  conf_strength: 'Conf. Strength',
}

export const STAT_GROUPS: { label: string; stats: (keyof StatWeights)[] }[] = [
  { label: 'Offense',    stats: ['ppg', 'fg_pct', 'three_pg', 'ft_pct', 'scr_mar'] },
  { label: 'Defense',    stats: ['opp_ppg', 'opp_fg_pct', 'bkpg', 'stpg'] },
  { label: 'Efficiency', stats: ['reb_mar', 'apg', 'ast_to', 'topg', 'opp_topg'] },
  { label: 'Reputation', stats: ['win_pct', 'rpi', 'conf_strength'] },
]

export const DEFAULT_WEIGHTS: StatWeights = {
  ppg: 5, fg_pct: 5, three_pg: 3, ft_pct: 2, scr_mar: 5,
  opp_ppg: 5, opp_fg_pct: 5, bkpg: 2, stpg: 3,
  reb_mar: 4, apg: 3, ast_to: 4, topg: 3, opp_topg: 3,
  win_pct: 4, rpi: 5, conf_strength: 3,
}

export const PRESETS: Record<string, StatWeights> = {
  balanced: DEFAULT_WEIGHTS,
  offense:  { ppg:9, fg_pct:8, three_pg:7, ft_pct:5, scr_mar:8, opp_ppg:2, opp_fg_pct:2, bkpg:1, stpg:1, reb_mar:3, apg:6, ast_to:6, topg:2, opp_topg:2, win_pct:5, rpi:3, conf_strength:2 },
  defense:  { ppg:2, fg_pct:3, three_pg:1, ft_pct:2, scr_mar:5, opp_ppg:9, opp_fg_pct:9, bkpg:5, stpg:6, reb_mar:5, apg:2, ast_to:3, topg:3, opp_topg:6, win_pct:4, rpi:5, conf_strength:3 },
  chalk:    { ppg:3, fg_pct:3, three_pg:2, ft_pct:2, scr_mar:4, opp_ppg:3, opp_fg_pct:3, bkpg:2, stpg:2, reb_mar:3, apg:2, ast_to:3, topg:2, opp_topg:2, win_pct:3, rpi:10, conf_strength:9 },
  chaos:         { ppg:4, fg_pct:4, three_pg:7, ft_pct:2, scr_mar:3, opp_ppg:4, opp_fg_pct:3, bkpg:3, stpg:7, reb_mar:4, apg:5, ast_to:4, topg:5, opp_topg:5, win_pct:2, rpi:1, conf_strength:1 },
  hindsight2025: { ppg:0, fg_pct:0, three_pg:1, ft_pct:3, scr_mar:6, opp_ppg:7, opp_fg_pct:6, bkpg:9, stpg:10, reb_mar:10, apg:0, ast_to:1, topg:1, opp_topg:0, win_pct:5, rpi:3, conf_strength:8 },
}

export const PRESET_LABELS: Record<string, string> = {
  balanced:      "Balanced",
  offense:       "Offense",
  defense:       "Defense",
  chalk:         "Chalk",
  chaos:         "Chaos",
  hindsight2025: "2025 Hindsight",
}

// ─── Team data ───────────────────────────────────────────────────────────────

export interface TeamStats extends StatWeights {
  name: string
  region: string
  conference: string
}

export type RegionName = 'Midwest' | 'West' | 'East' | 'South'

// seed number → team name
export type RegionSeeding = Record<number, string>

export interface BracketData {
  Midwest: RegionSeeding
  West:    RegionSeeding
  East:    RegionSeeding
  South:   RegionSeeding
}

// ─── Simulation results ──────────────────────────────────────────────────────

export interface Matchup {
  team1:  string
  team2:  string
  seed1:  number
  seed2:  number
  winner: string
  loser:  string
}

export interface RegionResult {
  r64:    Matchup[]
  r32:    Matchup[]
  s16:    Matchup[]
  e8:     Matchup
  winner: string
}

export interface TournamentResult {
  regions:      Record<RegionName, RegionResult>
  ff1:          { winner: string; loser: string }  // Midwest vs West
  ff2:          { winner: string; loser: string }  // East vs South
  finalFour:    string[]
  champion:     string
}

// ─── Saved model ─────────────────────────────────────────────────────────────

export interface SavedModel {
  id:        string
  name:      string
  weights:   StatWeights
  champion:  string
  savedAt:   string
}

// ─── URL-encoded model state ─────────────────────────────────────────────────

export interface ModelState {
  name?:   string
  weights: StatWeights
}
