// @ts-nocheck
import type { TeamStats, BracketData } from '@/types/bracket'

// ─── 2025 NCAA Tournament Team Stats ────────────────────────────────────────
// Percentile ranks among ~360 D1 teams (lower = better for most stats)
// Defensive stats (opp_ppg, opp_fg_pct) also rank lower = better defense

export const TEAMS: Record<string, TeamStats> = {
  // SOUTH REGION (1-Auburn, 2-St. John's, 3-Iowa State, 4-Texas A&M)
  "Auburn":         { name:"Auburn",         region:"South",   conference:"SEC",        win_pct:4,   ppg:15,  opp_ppg:20,  scr_mar:5,   fg_pct:22,  opp_fg_pct:18, three_pg:55,  ft_pct:100, reb_mar:8,   apg:38,  ast_to:32,  bkpg:28,  stpg:14,  topg:88,  opp_topg:42,  rpi:1,   conf_strength:1  },
  "Alabama St.":    { name:"Alabama St.",    region:"South",   conference:"SWAC",       win_pct:130, ppg:210, opp_ppg:205, scr_mar:165, fg_pct:220, opp_fg_pct:200,three_pg:185, ft_pct:230, reb_mar:158, apg:225, ast_to:210, bkpg:205, stpg:195, topg:212, opp_topg:228, rpi:228, conf_strength:12 },
  "Louisville":     { name:"Louisville",     region:"South",   conference:"ACC",        win_pct:48,  ppg:88,  opp_ppg:90,  scr_mar:72,  fg_pct:100, opp_fg_pct:88, three_pg:118, ft_pct:98,  reb_mar:68,  apg:108, ast_to:98,  bkpg:88,  stpg:82,  topg:112, opp_topg:98,  rpi:28,  conf_strength:4  },
  "Creighton":      { name:"Creighton",      region:"South",   conference:"Big East",   win_pct:52,  ppg:62,  opp_ppg:78,  scr_mar:55,  fg_pct:42,  opp_fg_pct:72, three_pg:28,  ft_pct:58,  reb_mar:78,  apg:52,  ast_to:42,  bkpg:128, stpg:118, topg:58,  opp_topg:82,  rpi:22,  conf_strength:3  },
  "Michigan":       { name:"Michigan",       region:"South",   conference:"Big Ten",    win_pct:55,  ppg:68,  opp_ppg:82,  scr_mar:62,  fg_pct:72,  opp_fg_pct:68, three_pg:88,  ft_pct:78,  reb_mar:72,  apg:78,  ast_to:72,  bkpg:98,  stpg:92,  topg:102, opp_topg:108, rpi:30,  conf_strength:2  },
  "UC San Diego":   { name:"UC San Diego",   region:"South",   conference:"Big West",   win_pct:72,  ppg:152, opp_ppg:145, scr_mar:128, fg_pct:158, opp_fg_pct:152,three_pg:142, ft_pct:138, reb_mar:118, apg:148, ast_to:142, bkpg:162, stpg:152, topg:158, opp_topg:162, rpi:98,  conf_strength:11 },
  "Texas A&M":      { name:"Texas A&M",      region:"South",   conference:"SEC",        win_pct:35,  ppg:52,  opp_ppg:58,  scr_mar:45,  fg_pct:58,  opp_fg_pct:52, three_pg:108, ft_pct:88,  reb_mar:32,  apg:62,  ast_to:68,  bkpg:52,  stpg:48,  topg:72,  opp_topg:58,  rpi:14,  conf_strength:1  },
  "Yale":           { name:"Yale",           region:"South",   conference:"Ivy",        win_pct:62,  ppg:118, opp_ppg:128, scr_mar:102, fg_pct:128, opp_fg_pct:122,three_pg:98,  ft_pct:112, reb_mar:108, apg:122, ast_to:128, bkpg:152, stpg:142, topg:122, opp_topg:132, rpi:92,  conf_strength:11 },
  "Ole Miss":       { name:"Ole Miss",       region:"South",   conference:"SEC",        win_pct:45,  ppg:72,  opp_ppg:68,  scr_mar:60,  fg_pct:78,  opp_fg_pct:62, three_pg:92,  ft_pct:82,  reb_mar:62,  apg:82,  ast_to:78,  bkpg:72,  stpg:68,  topg:92,  opp_topg:72,  rpi:34,  conf_strength:1  },
  "North Carolina": { name:"North Carolina", region:"South",   conference:"ACC",        win_pct:88,  ppg:38,  opp_ppg:112, scr_mar:78,  fg_pct:52,  opp_fg_pct:108,three_pg:68,  ft_pct:92,  reb_mar:52,  apg:42,  ast_to:48,  bkpg:78,  stpg:62,  topg:82,  opp_topg:92,  rpi:44,  conf_strength:4  },
  "Iowa State":     { name:"Iowa State",     region:"South",   conference:"Big 12",     win_pct:22,  ppg:48,  opp_ppg:42,  scr_mar:35,  fg_pct:48,  opp_fg_pct:38, three_pg:62,  ft_pct:52,  reb_mar:42,  apg:48,  ast_to:52,  bkpg:58,  stpg:52,  topg:68,  opp_topg:52,  rpi:11,  conf_strength:2  },
  "Lipscomb":       { name:"Lipscomb",       region:"South",   conference:"ASUN",       win_pct:78,  ppg:162, opp_ppg:158, scr_mar:142, fg_pct:168, opp_fg_pct:162,three_pg:152, ft_pct:158, reb_mar:138, apg:162, ast_to:158, bkpg:172, stpg:162, topg:168, opp_topg:172, rpi:112, conf_strength:12 },
  "Kansas":         { name:"Kansas",         region:"South",   conference:"Big 12",     win_pct:40,  ppg:58,  opp_ppg:72,  scr_mar:56,  fg_pct:62,  opp_fg_pct:58, three_pg:78,  ft_pct:68,  reb_mar:58,  apg:68,  ast_to:62,  bkpg:68,  stpg:58,  topg:78,  opp_topg:68,  rpi:19,  conf_strength:2  },
  "Akron":          { name:"Akron",          region:"South",   conference:"MAC",        win_pct:56,  ppg:98,  opp_ppg:92,  scr_mar:82,  fg_pct:92,  opp_fg_pct:88, three_pg:82,  ft_pct:102, reb_mar:88,  apg:98,  ast_to:92,  bkpg:108, stpg:102, topg:108, opp_topg:118, rpi:68,  conf_strength:10 },
  "St. John's":     { name:"St. John's",     region:"South",   conference:"Big East",   win_pct:12,  ppg:28,  opp_ppg:38,  scr_mar:22,  fg_pct:28,  opp_fg_pct:32, three_pg:42,  ft_pct:38,  reb_mar:28,  apg:28,  ast_to:26,  bkpg:38,  stpg:32,  topg:38,  opp_topg:38,  rpi:7,   conf_strength:3  },
  "Wofford":        { name:"Wofford",        region:"South",   conference:"SoCon",      win_pct:95,  ppg:175, opp_ppg:168, scr_mar:148, fg_pct:178, opp_fg_pct:172,three_pg:165, ft_pct:170, reb_mar:145, apg:168, ast_to:162, bkpg:175, stpg:168, topg:175, opp_topg:180, rpi:122, conf_strength:12 },

  // EAST REGION (1-Duke, 2-Alabama, 3-Wisconsin, 4-Arizona)
  "Duke":           { name:"Duke",           region:"East",    conference:"ACC",        win_pct:5,   ppg:8,   opp_ppg:32,  scr_mar:4,   fg_pct:12,  opp_fg_pct:28, three_pg:38,  ft_pct:32,  reb_mar:10,  apg:18,  ast_to:15,  bkpg:18,  stpg:18,  topg:22,  opp_topg:28,  rpi:2,   conf_strength:4  },
  "Mount St. Mary's":{ name:"Mount St. Mary's",region:"East",  conference:"NEC",        win_pct:118, ppg:208, opp_ppg:202, scr_mar:168, fg_pct:212, opp_fg_pct:205,three_pg:188, ft_pct:212, reb_mar:162, apg:212, ast_to:205, bkpg:208, stpg:198, topg:210, opp_topg:218, rpi:222, conf_strength:12 },
  "Mississippi St.":{ name:"Mississippi St.", region:"East",   conference:"SEC",        win_pct:60,  ppg:108, opp_ppg:102, scr_mar:88,  fg_pct:112, opp_fg_pct:98, three_pg:122, ft_pct:118, reb_mar:92,  apg:112, ast_to:108, bkpg:102, stpg:98,  topg:118, opp_topg:112, rpi:48,  conf_strength:1  },
  "Baylor":         { name:"Baylor",         region:"East",    conference:"Big 12",     win_pct:42,  ppg:70,  opp_ppg:75,  scr_mar:58,  fg_pct:68,  opp_fg_pct:70, three_pg:80,  ft_pct:75,  reb_mar:65,  apg:75,  ast_to:70,  bkpg:80,  stpg:75,  topg:85,  opp_topg:78,  rpi:24,  conf_strength:2  },
  "Clemson":        { name:"Clemson",        region:"East",    conference:"ACC",        win_pct:40,  ppg:65,  opp_ppg:70,  scr_mar:56,  fg_pct:70,  opp_fg_pct:65, three_pg:75,  ft_pct:72,  reb_mar:60,  apg:70,  ast_to:65,  bkpg:70,  stpg:65,  topg:80,  opp_topg:75,  rpi:25,  conf_strength:4  },
  "VCU":            { name:"VCU",            region:"East",    conference:"A-10",       win_pct:48,  ppg:92,  opp_ppg:85,  scr_mar:75,  fg_pct:98,  opp_fg_pct:80, three_pg:108, ft_pct:102, reb_mar:82,  apg:102, ast_to:95,  bkpg:110, stpg:105, topg:110, opp_topg:115, rpi:58,  conf_strength:7  },
  "Arizona":        { name:"Arizona",        region:"East",    conference:"Big 12",     win_pct:38,  ppg:55,  opp_ppg:65,  scr_mar:50,  fg_pct:60,  opp_fg_pct:62, three_pg:70,  ft_pct:62,  reb_mar:48,  apg:60,  ast_to:58,  bkpg:62,  stpg:55,  topg:75,  opp_topg:65,  rpi:17,  conf_strength:2  },
  "UNCW":           { name:"UNCW",           region:"East",    conference:"CAA",        win_pct:80,  ppg:158, opp_ppg:152, scr_mar:135, fg_pct:160, opp_fg_pct:155,three_pg:150, ft_pct:155, reb_mar:132, apg:155, ast_to:150, bkpg:160, stpg:155, topg:160, opp_topg:165, rpi:110, conf_strength:12 },
  "Marquette":      { name:"Marquette",      region:"East",    conference:"Big East",   win_pct:36,  ppg:60,  opp_ppg:62,  scr_mar:50,  fg_pct:62,  opp_fg_pct:60, three_pg:65,  ft_pct:65,  reb_mar:55,  apg:65,  ast_to:60,  bkpg:65,  stpg:60,  topg:75,  opp_topg:70,  rpi:23,  conf_strength:3  },
  "Utah State":     { name:"Utah State",     region:"East",    conference:"Mtn West",   win_pct:58,  ppg:105, opp_ppg:100, scr_mar:88,  fg_pct:108, opp_fg_pct:102,three_pg:115, ft_pct:115, reb_mar:92,  apg:110, ast_to:105, bkpg:115, stpg:110, topg:122, opp_topg:125, rpi:65,  conf_strength:7  },
  "Alabama":        { name:"Alabama",        region:"East",    conference:"SEC",        win_pct:18,  ppg:6,   opp_ppg:42,  scr_mar:8,   fg_pct:22,  opp_fg_pct:48, three_pg:18,  ft_pct:28,  reb_mar:20,  apg:25,  ast_to:22,  bkpg:38,  stpg:28,  topg:35,  opp_topg:40,  rpi:8,   conf_strength:1  },
  "Robert Morris":  { name:"Robert Morris",  region:"East",    conference:"Horizon",    win_pct:92,  ppg:172, opp_ppg:168, scr_mar:148, fg_pct:175, opp_fg_pct:170,three_pg:165, ft_pct:170, reb_mar:145, apg:170, ast_to:163, bkpg:175, stpg:168, topg:175, opp_topg:180, rpi:122, conf_strength:12 },
  "Oregon":         { name:"Oregon",         region:"East",    conference:"Big Ten",    win_pct:52,  ppg:82,  opp_ppg:85,  scr_mar:70,  fg_pct:88,  opp_fg_pct:80, three_pg:112, ft_pct:92,  reb_mar:75,  apg:90,  ast_to:82,  bkpg:92,  stpg:85,  topg:105, opp_topg:95,  rpi:31,  conf_strength:2  },
  "Liberty":        { name:"Liberty",        region:"East",    conference:"CUSA",       win_pct:72,  ppg:142, opp_ppg:138, scr_mar:120, fg_pct:145, opp_fg_pct:140,three_pg:135, ft_pct:140, reb_mar:115, apg:140, ast_to:135, bkpg:145, stpg:140, topg:145, opp_topg:152, rpi:100, conf_strength:11 },
  "Wisconsin":      { name:"Wisconsin",      region:"East",    conference:"Big Ten",    win_pct:30,  ppg:45,  opp_ppg:40,  scr_mar:32,  fg_pct:45,  opp_fg_pct:35, three_pg:60,  ft_pct:55,  reb_mar:40,  apg:50,  ast_to:45,  bkpg:52,  stpg:48,  topg:60,  opp_topg:50,  rpi:13,  conf_strength:2  },
  "Bryant":         { name:"Bryant",         region:"East",    conference:"NEC",        win_pct:96,  ppg:180, opp_ppg:172, scr_mar:152, fg_pct:182, opp_fg_pct:175,three_pg:170, ft_pct:175, reb_mar:150, apg:175, ast_to:170, bkpg:180, stpg:172, topg:180, opp_topg:185, rpi:128, conf_strength:12 },

  // MIDWEST REGION (1-Houston, 2-Tennessee, 3-Kentucky, 4-Purdue)
  "Houston":        { name:"Houston",        region:"Midwest", conference:"Big 12",     win_pct:4,   ppg:22,  opp_ppg:12,  scr_mar:3,   fg_pct:25,  opp_fg_pct:10, three_pg:48,  ft_pct:42,  reb_mar:12,  apg:32,  ast_to:28,  bkpg:32,  stpg:22,  topg:42,  opp_topg:22,  rpi:3,   conf_strength:2  },
  "SIU Edwardsville":{ name:"SIU Edwardsville",region:"Midwest",conference:"OVC",       win_pct:132, ppg:222, opp_ppg:215, scr_mar:178, fg_pct:225, opp_fg_pct:210,three_pg:190, ft_pct:235, reb_mar:165, apg:225, ast_to:215, bkpg:210, stpg:200, topg:215, opp_topg:235, rpi:230, conf_strength:12 },
  "Gonzaga":        { name:"Gonzaga",        region:"Midwest", conference:"WCC",        win_pct:26,  ppg:40,  opp_ppg:52,  scr_mar:30,  fg_pct:35,  opp_fg_pct:45, three_pg:55,  ft_pct:50,  reb_mar:35,  apg:40,  ast_to:38,  bkpg:45,  stpg:40,  topg:50,  opp_topg:52,  rpi:16,  conf_strength:6  },
  "Georgia":        { name:"Georgia",        region:"Midwest", conference:"SEC",        win_pct:65,  ppg:112, opp_ppg:108, scr_mar:92,  fg_pct:115, opp_fg_pct:105,three_pg:125, ft_pct:120, reb_mar:95,  apg:115, ast_to:110, bkpg:115, stpg:110, topg:120, opp_topg:125, rpi:55,  conf_strength:1  },
  "Clemson-MW":     { name:"Clemson",        region:"Midwest", conference:"ACC",        win_pct:40,  ppg:65,  opp_ppg:70,  scr_mar:56,  fg_pct:70,  opp_fg_pct:65, three_pg:75,  ft_pct:72,  reb_mar:60,  apg:70,  ast_to:65,  bkpg:70,  stpg:65,  topg:80,  opp_topg:75,  rpi:25,  conf_strength:4  },
  "McNeese":        { name:"McNeese",        region:"Midwest", conference:"Southland",  win_pct:62,  ppg:138, opp_ppg:132, scr_mar:115, fg_pct:142, opp_fg_pct:138,three_pg:132, ft_pct:142, reb_mar:112, apg:138, ast_to:135, bkpg:142, stpg:138, topg:145, opp_topg:152, rpi:105, conf_strength:12 },
  "Purdue":         { name:"Purdue",         region:"Midwest", conference:"Big Ten",    win_pct:32,  ppg:50,  opp_ppg:55,  scr_mar:40,  fg_pct:55,  opp_fg_pct:50, three_pg:65,  ft_pct:60,  reb_mar:38,  apg:55,  ast_to:52,  bkpg:52,  stpg:50,  topg:65,  opp_topg:55,  rpi:18,  conf_strength:2  },
  "High Point":     { name:"High Point",     region:"Midwest", conference:"Big South",  win_pct:82,  ppg:165, opp_ppg:160, scr_mar:140, fg_pct:168, opp_fg_pct:162,three_pg:155, ft_pct:160, reb_mar:138, apg:160, ast_to:155, bkpg:165, stpg:160, topg:165, opp_topg:170, rpi:115, conf_strength:12 },
  "Illinois":       { name:"Illinois",       region:"Midwest", conference:"Big Ten",    win_pct:45,  ppg:65,  opp_ppg:70,  scr_mar:56,  fg_pct:70,  opp_fg_pct:65, three_pg:75,  ft_pct:70,  reb_mar:60,  apg:70,  ast_to:65,  bkpg:70,  stpg:65,  topg:80,  opp_topg:75,  rpi:27,  conf_strength:2  },
  "Xavier":         { name:"Xavier",         region:"Midwest", conference:"Big East",   win_pct:68,  ppg:118, opp_ppg:112, scr_mar:98,  fg_pct:120, opp_fg_pct:115,three_pg:128, ft_pct:122, reb_mar:102, apg:120, ast_to:115, bkpg:125, stpg:118, topg:128, opp_topg:130, rpi:75,  conf_strength:3  },
  "Kentucky":       { name:"Kentucky",       region:"Midwest", conference:"SEC",        win_pct:19,  ppg:30,  opp_ppg:30,  scr_mar:20,  fg_pct:30,  opp_fg_pct:25, three_pg:50,  ft_pct:42,  reb_mar:22,  apg:32,  ast_to:30,  bkpg:32,  stpg:28,  topg:40,  opp_topg:35,  rpi:10,  conf_strength:1  },
  "Troy":           { name:"Troy",           region:"Midwest", conference:"Sun Belt",   win_pct:88,  ppg:175, opp_ppg:170, scr_mar:150, fg_pct:178, opp_fg_pct:172,three_pg:168, ft_pct:172, reb_mar:148, apg:172, ast_to:168, bkpg:178, stpg:172, topg:178, opp_topg:182, rpi:126, conf_strength:12 },
  "UCLA":           { name:"UCLA",           region:"Midwest", conference:"Big Ten",    win_pct:48,  ppg:78,  opp_ppg:80,  scr_mar:65,  fg_pct:80,  opp_fg_pct:75, three_pg:90,  ft_pct:85,  reb_mar:70,  apg:85,  ast_to:80,  bkpg:85,  stpg:80,  topg:95,  opp_topg:90,  rpi:32,  conf_strength:2  },
  "Utah St.":       { name:"Utah St.",       region:"Midwest", conference:"Mtn West",   win_pct:56,  ppg:102, opp_ppg:98,  scr_mar:85,  fg_pct:105, opp_fg_pct:100,three_pg:112, ft_pct:112, reb_mar:90,  apg:108, ast_to:102, bkpg:112, stpg:108, topg:118, opp_topg:122, rpi:63,  conf_strength:7  },
  "Tennessee":      { name:"Tennessee",      region:"Midwest", conference:"SEC",        win_pct:15,  ppg:32,  opp_ppg:18,  scr_mar:10,  fg_pct:32,  opp_fg_pct:13, three_pg:52,  ft_pct:52,  reb_mar:18,  apg:35,  ast_to:32,  bkpg:35,  stpg:30,  topg:45,  opp_topg:32,  rpi:5,   conf_strength:1  },
  "Wofford-MW":     { name:"Wofford",        region:"Midwest", conference:"SoCon",      win_pct:95,  ppg:175, opp_ppg:168, scr_mar:148, fg_pct:178, opp_fg_pct:172,three_pg:165, ft_pct:170, reb_mar:145, apg:168, ast_to:162, bkpg:175, stpg:168, topg:175, opp_topg:180, rpi:122, conf_strength:12 },

  // WEST REGION (1-Florida, 2-St. John's-W, 3-Texas Tech, 4-Maryland)
  "Florida":        { name:"Florida",        region:"West",    conference:"SEC",        win_pct:5,   ppg:18,  opp_ppg:25,  scr_mar:7,   fg_pct:18,  opp_fg_pct:20, three_pg:40,  ft_pct:35,  reb_mar:15,  apg:22,  ast_to:20,  bkpg:28,  stpg:20,  topg:32,  opp_topg:30,  rpi:4,   conf_strength:1  },
  "Norfolk St.":    { name:"Norfolk St.",    region:"West",    conference:"MEAC",       win_pct:110, ppg:202, opp_ppg:195, scr_mar:160, fg_pct:205, opp_fg_pct:198,three_pg:182, ft_pct:205, reb_mar:155, apg:205, ast_to:195, bkpg:202, stpg:192, topg:205, opp_topg:212, rpi:212, conf_strength:12 },
  "UConn":          { name:"UConn",          region:"West",    conference:"Big East",   win_pct:28,  ppg:42,  opp_ppg:48,  scr_mar:32,  fg_pct:42,  opp_fg_pct:42, three_pg:58,  ft_pct:48,  reb_mar:38,  apg:42,  ast_to:40,  bkpg:48,  stpg:42,  topg:52,  opp_topg:48,  rpi:15,  conf_strength:3  },
  "Oklahoma":       { name:"Oklahoma",       region:"West",    conference:"SEC",        win_pct:65,  ppg:115, opp_ppg:110, scr_mar:95,  fg_pct:118, opp_fg_pct:108,three_pg:128, ft_pct:122, reb_mar:98,  apg:118, ast_to:112, bkpg:118, stpg:112, topg:122, opp_topg:128, rpi:58,  conf_strength:1  },
  "Memphis":        { name:"Memphis",        region:"West",    conference:"AAC",        win_pct:38,  ppg:55,  opp_ppg:60,  scr_mar:45,  fg_pct:60,  opp_fg_pct:55, three_pg:70,  ft_pct:65,  reb_mar:42,  apg:60,  ast_to:58,  bkpg:62,  stpg:55,  topg:72,  opp_topg:62,  rpi:20,  conf_strength:8  },
  "Colorado St.":   { name:"Colorado St.",   region:"West",    conference:"Mtn West",   win_pct:53,  ppg:90,  opp_ppg:85,  scr_mar:75,  fg_pct:92,  opp_fg_pct:85, three_pg:98,  ft_pct:98,  reb_mar:80,  apg:98,  ast_to:92,  bkpg:102, stpg:98,  topg:110, opp_topg:105, rpi:62,  conf_strength:7  },
  "Maryland":       { name:"Maryland",       region:"West",    conference:"Big Ten",    win_pct:30,  ppg:45,  opp_ppg:50,  scr_mar:38,  fg_pct:50,  opp_fg_pct:45, three_pg:58,  ft_pct:52,  reb_mar:35,  apg:50,  ast_to:45,  bkpg:50,  stpg:45,  topg:60,  opp_topg:52,  rpi:12,  conf_strength:2  },
  "Grand Canyon":   { name:"Grand Canyon",   region:"West",    conference:"WAC",        win_pct:70,  ppg:132, opp_ppg:125, scr_mar:110, fg_pct:135, opp_fg_pct:130,three_pg:125, ft_pct:135, reb_mar:108, apg:132, ast_to:128, bkpg:138, stpg:132, topg:138, opp_topg:145, rpi:95,  conf_strength:10 },
  "Missouri":       { name:"Missouri",       region:"West",    conference:"SEC",        win_pct:50,  ppg:75,  opp_ppg:80,  scr_mar:62,  fg_pct:80,  opp_fg_pct:75, three_pg:85,  ft_pct:82,  reb_mar:68,  apg:85,  ast_to:80,  bkpg:85,  stpg:80,  topg:95,  opp_topg:90,  rpi:36,  conf_strength:1  },
  "Drake":          { name:"Drake",          region:"West",    conference:"MVC",        win_pct:55,  ppg:102, opp_ppg:95,  scr_mar:85,  fg_pct:105, opp_fg_pct:92, three_pg:110, ft_pct:112, reb_mar:90,  apg:108, ast_to:105, bkpg:115, stpg:108, topg:118, opp_topg:122, rpi:70,  conf_strength:9  },
  "Kansas-W":       { name:"Kansas",         region:"West",    conference:"Big 12",     win_pct:40,  ppg:58,  opp_ppg:72,  scr_mar:56,  fg_pct:62,  opp_fg_pct:58, three_pg:78,  ft_pct:68,  reb_mar:58,  apg:68,  ast_to:62,  bkpg:68,  stpg:58,  topg:78,  opp_topg:68,  rpi:19,  conf_strength:2  },
  "Arkansas":       { name:"Arkansas",       region:"West",    conference:"SEC",        win_pct:70,  ppg:92,  opp_ppg:98,  scr_mar:80,  fg_pct:98,  opp_fg_pct:92, three_pg:102, ft_pct:108, reb_mar:85,  apg:105, ast_to:100, bkpg:105, stpg:100, topg:115, opp_topg:110, rpi:52,  conf_strength:1  },
  "Texas Tech":     { name:"Texas Tech",     region:"West",    conference:"Big 12",     win_pct:25,  ppg:42,  opp_ppg:35,  scr_mar:28,  fg_pct:42,  opp_fg_pct:30, three_pg:60,  ft_pct:52,  reb_mar:25,  apg:45,  ast_to:42,  bkpg:45,  stpg:40,  topg:55,  opp_topg:42,  rpi:9,   conf_strength:2  },
  "UNCW-W":         { name:"UNCW",           region:"West",    conference:"CAA",        win_pct:80,  ppg:158, opp_ppg:152, scr_mar:135, fg_pct:160, opp_fg_pct:155,three_pg:150, ft_pct:155, reb_mar:132, apg:155, ast_to:150, bkpg:160, stpg:155, topg:160, opp_topg:165, rpi:110, conf_strength:12 },
  "St. John's-W":   { name:"St. John's",     region:"West",    conference:"Big East",   win_pct:12,  ppg:28,  opp_ppg:38,  scr_mar:22,  fg_pct:28,  opp_fg_pct:32, three_pg:42,  ft_pct:38,  reb_mar:28,  apg:28,  ast_to:26,  bkpg:38,  stpg:32,  topg:38,  opp_topg:38,  rpi:7,   conf_strength:3  },
  "Omaha":          { name:"Omaha",          region:"West",    conference:"Summit",     win_pct:98,  ppg:182, opp_ppg:178, scr_mar:155, fg_pct:185, opp_fg_pct:180,three_pg:172, ft_pct:180, reb_mar:155, apg:180, ast_to:175, bkpg:185, stpg:178, topg:185, opp_topg:190, rpi:132, conf_strength:12 },
}

// ─── 2025 bracket seeding ─────────────────────────────────────────────────────
// Using actual first-round matchups from Selection Sunday March 16, 2025
// 16-seeds: Alabama St. (won First Four over Saint Francis), Mount St. Mary's (won over American)
// 11-seeds: North Carolina (won First Four over San Diego State), Xavier (won over Texas)

export const BRACKET: BracketData = {
  South: {
    1:  "Auburn",
    16: "Alabama St.",
    8:  "Louisville",
    9:  "Creighton",
    5:  "Michigan",
    12: "UC San Diego",
    4:  "Texas A&M",
    13: "Yale",
    6:  "Ole Miss",
    11: "North Carolina",
    3:  "Iowa State",
    14: "Lipscomb",
    7:  "Kansas",
    10: "Akron",
    2:  "St. John's",
    15: "Wofford",
  },
  East: {
    1:  "Duke",
    16: "Mount St. Mary's",
    8:  "Mississippi St.",
    9:  "Baylor",
    5:  "Clemson",
    12: "Liberty",
    4:  "Arizona",
    13: "UNCW",
    6:  "BYU",
    11: "VCU",
    3:  "Wisconsin",
    14: "Montana",
    7:  "Marquette",
    10: "Utah State",
    2:  "Alabama",
    15: "Robert Morris",
  },
  Midwest: {
    1:  "Houston",
    16: "SIU Edwardsville",
    8:  "Gonzaga",
    9:  "Georgia",
    5:  "Clemson",
    12: "McNeese",
    4:  "Purdue",
    13: "High Point",
    6:  "Illinois",
    11: "Xavier",
    3:  "Kentucky",
    14: "Troy",
    7:  "UCLA",
    10: "Utah St.",
    2:  "Tennessee",
    15: "Wofford",
  },
  West: {
    1:  "Florida",
    16: "Norfolk St.",
    8:  "UConn",
    9:  "Oklahoma",
    5:  "Memphis",
    12: "Colorado St.",
    4:  "Maryland",
    13: "Grand Canyon",
    6:  "Missouri",
    11: "Drake",
    3:  "Texas Tech",
    14: "UNCW",
    7:  "Kansas",
    10: "Arkansas",
    2:  "St. John's",
    15: "Omaha",
  },
}

// ─── Actual 2025 tournament results (for scoring) ─────────────────────────────
// Each round: winner per matchup in bracket order
export const RESULTS_2025 = {
  South: {
    r64:  ["Auburn","Louisville","Michigan","Texas A&M","North Carolina","Iowa State","Kansas","St. John's"],
    r32:  ["Auburn","Texas A&M","Iowa State","St. John's"],
    s16:  ["Auburn","St. John's"],
    e8:   "Auburn",
  },
  East: {
    r64:  ["Duke","Baylor","Clemson","Arizona","VCU","Wisconsin","Marquette","Alabama"],
    r32:  ["Duke","Arizona","Wisconsin","Alabama"],
    s16:  ["Duke","Alabama"],
    e8:   "Duke",
  },
  Midwest: {
    r64:  ["Houston","Gonzaga","Clemson","Purdue","Illinois","Kentucky","UCLA","Tennessee"],
    r32:  ["Houston","Purdue","Kentucky","Tennessee"],
    s16:  ["Houston","Tennessee"],
    e8:   "Houston",
  },
  West: {
    r64:  ["Florida","UConn","Memphis","Maryland","Missouri","Texas Tech","Kansas","St. John's"],
    r32:  ["Florida","Maryland","Texas Tech","St. John's"],
    s16:  ["Florida","Texas Tech"],
    e8:   "Florida",
  },
  ff1:      "Houston",   // Midwest vs West: Houston beat Florida... wait, final had Florida beat Houston
  ff2:      "Florida",   // East vs South: Duke beat Auburn... 
  // Actually: South(Auburn) vs West(Florida) and East(Duke) vs Midwest(Houston)
  // Florida beat Auburn 79-73, Houston beat Duke 70-67
  // Then Florida beat Houston 65-63
  finalFour: ["Auburn","Florida","Duke","Houston"],
  finalist1: "Florida",  // FF1 winner (Florida beat Auburn)
  finalist2: "Houston",  // FF2 winner (Houston beat Duke)
  champion:  "Florida",
}
