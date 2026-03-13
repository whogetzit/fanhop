// @ts-nocheck
import type { TeamStats, BracketData } from '@/types/bracket'

// ─── 2026 NCAA Tournament Team Stats ────────────────────────────────────────
// Percentile ranks among ~360 D1 teams (lower = better for most stats)
// Defensive stats (opp_ppg, opp_fg_pct) also rank lower = better defense

// TODO: Fill in when bracket is released
export const TEAMS: Record<string, TeamStats> = {
}

// TODO: Fill in when bracket is released
export const BRACKET: BracketData = {
  South:   { 1: "", 16: "", 8: "", 9: "", 5: "", 12: "", 4: "", 13: "", 6: "", 11: "", 3: "", 14: "", 7: "", 10: "", 2: "", 15: "" },
  East:    { 1: "", 16: "", 8: "", 9: "", 5: "", 12: "", 4: "", 13: "", 6: "", 11: "", 3: "", 14: "", 7: "", 10: "", 2: "", 15: "" },
  Midwest: { 1: "", 16: "", 8: "", 9: "", 5: "", 12: "", 4: "", 13: "", 6: "", 11: "", 3: "", 14: "", 7: "", 10: "", 2: "", 15: "" },
  West:    { 1: "", 16: "", 8: "", 9: "", 5: "", 12: "", 4: "", 13: "", 6: "", 11: "", 3: "", 14: "", 7: "", 10: "", 2: "", 15: "" },
}
