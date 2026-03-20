// @ts-nocheck
import type { TeamStats, BracketData } from '@/types/bracket'

// ─── 2026 NCAA Tournament Team Stats ────────────────────────────────────────
// Percentile ranks among ~360 D1 teams (lower = better for most stats)
// Defensive stats (opp_ppg, opp_fg_pct) also rank lower = better defense

export const TEAMS: Record<string, TeamStats> = {
  // SOUTH REGION (1-Florida, 2-Houston, 3-Illinois, 4-Nebraska)
  "Florida":           { name:"Florida",           region:"South",   conference:"SEC",        win_pct:3,   ppg:10,  opp_ppg:15,  scr_mar:4,   fg_pct:12,  opp_fg_pct:14, three_pg:35,  ft_pct:30,  reb_mar:10,  apg:20,  ast_to:18,  bkpg:22,  stpg:16,  topg:28,  opp_topg:25,  rpi:2,   conf_strength:1  },
  "Prairie View A&M":  { name:"Prairie View A&M",  region:"South",   conference:"SWAC",       win_pct:125, ppg:215, opp_ppg:210, scr_mar:170, fg_pct:218, opp_fg_pct:205,three_pg:188, ft_pct:225, reb_mar:160, apg:220, ast_to:212, bkpg:210, stpg:198, topg:215, opp_topg:230, rpi:225, conf_strength:12 },
  "Clemson":           { name:"Clemson",           region:"South",   conference:"ACC",        win_pct:50,  ppg:85,  opp_ppg:88,  scr_mar:70,  fg_pct:92,  opp_fg_pct:85, three_pg:110, ft_pct:95,  reb_mar:65,  apg:100, ast_to:95,  bkpg:85,  stpg:80,  topg:108, opp_topg:95,  rpi:30,  conf_strength:4  },
  "Iowa":              { name:"Iowa",              region:"South",   conference:"Big Ten",    win_pct:55,  ppg:32,  opp_ppg:72,  scr_mar:58,  fg_pct:38,  opp_fg_pct:68, three_pg:25,  ft_pct:45,  reb_mar:62,  apg:35,  ast_to:52,  bkpg:90,  stpg:88,  topg:55,  opp_topg:78,  rpi:35,  conf_strength:2  },
  "Vanderbilt":        { name:"Vanderbilt",        region:"South",   conference:"SEC",        win_pct:38,  ppg:55,  opp_ppg:60,  scr_mar:42,  fg_pct:58,  opp_fg_pct:55, three_pg:68,  ft_pct:62,  reb_mar:48,  apg:58,  ast_to:55,  bkpg:60,  stpg:52,  topg:70,  opp_topg:60,  rpi:22,  conf_strength:1  },
  "McNeese":           { name:"McNeese",           region:"South",   conference:"Southland",  win_pct:68,  ppg:140, opp_ppg:135, scr_mar:118, fg_pct:145, opp_fg_pct:140,three_pg:135, ft_pct:145, reb_mar:115, apg:140, ast_to:138, bkpg:145, stpg:140, topg:148, opp_topg:155, rpi:108, conf_strength:12 },
  "Nebraska":          { name:"Nebraska",          region:"South",   conference:"Big Ten",    win_pct:32,  ppg:48,  opp_ppg:52,  scr_mar:38,  fg_pct:50,  opp_fg_pct:48, three_pg:58,  ft_pct:55,  reb_mar:35,  apg:50,  ast_to:48,  bkpg:52,  stpg:48,  topg:62,  opp_topg:55,  rpi:16,  conf_strength:2  },
  "Troy":              { name:"Troy",              region:"South",   conference:"Sun Belt",   win_pct:75,  ppg:150, opp_ppg:145, scr_mar:125, fg_pct:155, opp_fg_pct:148,three_pg:142, ft_pct:150, reb_mar:122, apg:148, ast_to:145, bkpg:155, stpg:148, topg:152, opp_topg:160, rpi:112, conf_strength:12 },
  "North Carolina":    { name:"North Carolina",    region:"South",   conference:"ACC",        win_pct:42,  ppg:38,  opp_ppg:65,  scr_mar:48,  fg_pct:45,  opp_fg_pct:60, three_pg:52,  ft_pct:58,  reb_mar:42,  apg:42,  ast_to:45,  bkpg:55,  stpg:48,  topg:65,  opp_topg:58,  rpi:25,  conf_strength:4  },
  "VCU":               { name:"VCU",               region:"South",   conference:"A-10",       win_pct:62,  ppg:95,  opp_ppg:88,  scr_mar:78,  fg_pct:100, opp_fg_pct:82, three_pg:112, ft_pct:105, reb_mar:85,  apg:105, ast_to:98,  bkpg:112, stpg:108, topg:112, opp_topg:118, rpi:60,  conf_strength:7  },
  "Illinois":          { name:"Illinois",          region:"South",   conference:"Big Ten",    win_pct:20,  ppg:35,  opp_ppg:38,  scr_mar:22,  fg_pct:35,  opp_fg_pct:32, three_pg:48,  ft_pct:42,  reb_mar:28,  apg:38,  ast_to:35,  bkpg:38,  stpg:32,  topg:45,  opp_topg:38,  rpi:10,  conf_strength:2  },
  "Penn":              { name:"Penn",              region:"South",   conference:"Ivy",        win_pct:82,  ppg:165, opp_ppg:158, scr_mar:140, fg_pct:168, opp_fg_pct:162,three_pg:155, ft_pct:162, reb_mar:138, apg:162, ast_to:158, bkpg:168, stpg:162, topg:165, opp_topg:172, rpi:118, conf_strength:11 },
  "Saint Mary's":      { name:"Saint Mary's",      region:"South",   conference:"WCC",        win_pct:45,  ppg:72,  opp_ppg:68,  scr_mar:55,  fg_pct:75,  opp_fg_pct:62, three_pg:82,  ft_pct:78,  reb_mar:58,  apg:78,  ast_to:72,  bkpg:78,  stpg:72,  topg:85,  opp_topg:78,  rpi:28,  conf_strength:6  },
  "Texas A&M":         { name:"Texas A&M",         region:"South",   conference:"SEC",        win_pct:58,  ppg:92,  opp_ppg:85,  scr_mar:75,  fg_pct:95,  opp_fg_pct:80, three_pg:105, ft_pct:100, reb_mar:80,  apg:95,  ast_to:88,  bkpg:98,  stpg:92,  topg:105, opp_topg:110, rpi:52,  conf_strength:1  },
  "Houston":           { name:"Houston",           region:"South",   conference:"Big 12",     win_pct:8,   ppg:22,  opp_ppg:10,  scr_mar:6,   fg_pct:20,  opp_fg_pct:8,  three_pg:42,  ft_pct:38,  reb_mar:12,  apg:28,  ast_to:25,  bkpg:28,  stpg:20,  topg:38,  opp_topg:20,  rpi:5,   conf_strength:2  },
  "Idaho":             { name:"Idaho",             region:"South",   conference:"Big Sky",    win_pct:88,  ppg:172, opp_ppg:168, scr_mar:148, fg_pct:175, opp_fg_pct:170,three_pg:165, ft_pct:172, reb_mar:148, apg:172, ast_to:168, bkpg:178, stpg:172, topg:178, opp_topg:182, rpi:128, conf_strength:12 },

  // EAST REGION (1-Duke, 2-UConn, 3-Michigan State, 4-Kansas)
  "Duke":              { name:"Duke",              region:"East",    conference:"ACC",        win_pct:2,   ppg:5,   opp_ppg:18,  scr_mar:2,   fg_pct:8,   opp_fg_pct:15, three_pg:30,  ft_pct:25,  reb_mar:6,   apg:12,  ast_to:10,  bkpg:15,  stpg:12,  topg:18,  opp_topg:22,  rpi:1,   conf_strength:4  },
  "Siena":             { name:"Siena",             region:"East",    conference:"MAAC",       win_pct:130, ppg:220, opp_ppg:215, scr_mar:175, fg_pct:222, opp_fg_pct:210,three_pg:192, ft_pct:228, reb_mar:165, apg:225, ast_to:218, bkpg:215, stpg:202, topg:220, opp_topg:235, rpi:230, conf_strength:12 },
  "Ohio State":        { name:"Ohio State",        region:"East",    conference:"Big Ten",    win_pct:52,  ppg:82,  opp_ppg:85,  scr_mar:68,  fg_pct:88,  opp_fg_pct:82, three_pg:105, ft_pct:92,  reb_mar:72,  apg:88,  ast_to:82,  bkpg:88,  stpg:82,  topg:100, opp_topg:92,  rpi:32,  conf_strength:2  },
  "TCU":               { name:"TCU",               region:"East",    conference:"Big 12",     win_pct:56,  ppg:88,  opp_ppg:82,  scr_mar:72,  fg_pct:92,  opp_fg_pct:78, three_pg:100, ft_pct:95,  reb_mar:75,  apg:92,  ast_to:85,  bkpg:92,  stpg:85,  topg:102, opp_topg:95,  rpi:38,  conf_strength:2  },
  "St. John's":        { name:"St. John's",        region:"East",    conference:"Big East",   win_pct:35,  ppg:45,  opp_ppg:50,  scr_mar:35,  fg_pct:48,  opp_fg_pct:45, three_pg:55,  ft_pct:50,  reb_mar:38,  apg:48,  ast_to:42,  bkpg:48,  stpg:42,  topg:55,  opp_topg:48,  rpi:18,  conf_strength:3  },
  "Northern Iowa":     { name:"Northern Iowa",     region:"East",    conference:"MVC",        win_pct:72,  ppg:145, opp_ppg:140, scr_mar:122, fg_pct:148, opp_fg_pct:142,three_pg:138, ft_pct:148, reb_mar:118, apg:142, ast_to:140, bkpg:148, stpg:142, topg:150, opp_topg:158, rpi:105, conf_strength:9  },
  "Kansas":            { name:"Kansas",            region:"East",    conference:"Big 12",     win_pct:30,  ppg:42,  opp_ppg:48,  scr_mar:32,  fg_pct:45,  opp_fg_pct:42, three_pg:52,  ft_pct:48,  reb_mar:32,  apg:45,  ast_to:40,  bkpg:45,  stpg:40,  topg:52,  opp_topg:45,  rpi:14,  conf_strength:2  },
  "Cal Baptist":       { name:"Cal Baptist",       region:"East",    conference:"WAC",        win_pct:78,  ppg:155, opp_ppg:150, scr_mar:130, fg_pct:158, opp_fg_pct:152,three_pg:145, ft_pct:155, reb_mar:128, apg:152, ast_to:148, bkpg:158, stpg:152, topg:155, opp_topg:165, rpi:110, conf_strength:10 },
  "Louisville":        { name:"Louisville",        region:"East",    conference:"ACC",        win_pct:40,  ppg:62,  opp_ppg:65,  scr_mar:50,  fg_pct:65,  opp_fg_pct:60, three_pg:72,  ft_pct:68,  reb_mar:52,  apg:65,  ast_to:58,  bkpg:65,  stpg:58,  topg:72,  opp_topg:65,  rpi:24,  conf_strength:4  },
  "South Florida":     { name:"South Florida",     region:"East",    conference:"AAC",        win_pct:65,  ppg:118, opp_ppg:112, scr_mar:98,  fg_pct:122, opp_fg_pct:115,three_pg:128, ft_pct:125, reb_mar:102, apg:122, ast_to:118, bkpg:125, stpg:118, topg:128, opp_topg:132, rpi:72,  conf_strength:8  },
  "Michigan State":    { name:"Michigan State",    region:"East",    conference:"Big Ten",    win_pct:18,  ppg:28,  opp_ppg:30,  scr_mar:18,  fg_pct:30,  opp_fg_pct:25, three_pg:45,  ft_pct:40,  reb_mar:22,  apg:32,  ast_to:28,  bkpg:32,  stpg:28,  topg:40,  opp_topg:32,  rpi:8,   conf_strength:2  },
  "North Dakota State":{ name:"North Dakota State",region:"East",    conference:"Summit",     win_pct:85,  ppg:168, opp_ppg:162, scr_mar:142, fg_pct:170, opp_fg_pct:165,three_pg:158, ft_pct:165, reb_mar:142, apg:165, ast_to:160, bkpg:170, stpg:165, topg:168, opp_topg:175, rpi:120, conf_strength:12 },
  "UCLA":              { name:"UCLA",              region:"East",    conference:"Big Ten",    win_pct:48,  ppg:78,  opp_ppg:80,  scr_mar:62,  fg_pct:80,  opp_fg_pct:75, three_pg:88,  ft_pct:85,  reb_mar:68,  apg:82,  ast_to:78,  bkpg:82,  stpg:78,  topg:92,  opp_topg:88,  rpi:30,  conf_strength:2  },
  "UCF":               { name:"UCF",               region:"East",    conference:"Big 12",     win_pct:60,  ppg:98,  opp_ppg:92,  scr_mar:80,  fg_pct:102, opp_fg_pct:88, three_pg:115, ft_pct:108, reb_mar:85,  apg:102, ast_to:95,  bkpg:105, stpg:98,  topg:110, opp_topg:115, rpi:55,  conf_strength:2  },
  "UConn":             { name:"UConn",             region:"East",    conference:"Big East",   win_pct:12,  ppg:18,  opp_ppg:25,  scr_mar:10,  fg_pct:18,  opp_fg_pct:20, three_pg:38,  ft_pct:35,  reb_mar:15,  apg:22,  ast_to:18,  bkpg:25,  stpg:18,  topg:30,  opp_topg:28,  rpi:6,   conf_strength:3  },
  "Furman":            { name:"Furman",            region:"East",    conference:"SoCon",      win_pct:90,  ppg:175, opp_ppg:170, scr_mar:150, fg_pct:178, opp_fg_pct:172,three_pg:168, ft_pct:175, reb_mar:150, apg:175, ast_to:170, bkpg:180, stpg:175, topg:180, opp_topg:185, rpi:125, conf_strength:12 },

  // MIDWEST REGION (1-Michigan, 2-Iowa State, 3-Virginia, 4-Alabama)
  "Michigan":          { name:"Michigan",          region:"Midwest", conference:"Big Ten",    win_pct:5,   ppg:12,  opp_ppg:20,  scr_mar:5,   fg_pct:15,  opp_fg_pct:18, three_pg:32,  ft_pct:28,  reb_mar:8,   apg:15,  ast_to:12,  bkpg:18,  stpg:14,  topg:22,  opp_topg:18,  rpi:3,   conf_strength:2  },
  "Howard":            { name:"Howard",            region:"Midwest", conference:"MEAC",       win_pct:128, ppg:218, opp_ppg:212, scr_mar:172, fg_pct:220, opp_fg_pct:208,three_pg:190, ft_pct:222, reb_mar:162, apg:218, ast_to:215, bkpg:212, stpg:200, topg:218, opp_topg:232, rpi:228, conf_strength:12 },
  "Georgia":           { name:"Georgia",           region:"Midwest", conference:"SEC",        win_pct:53,  ppg:85,  opp_ppg:82,  scr_mar:70,  fg_pct:90,  opp_fg_pct:78, three_pg:102, ft_pct:95,  reb_mar:72,  apg:90,  ast_to:85,  bkpg:90,  stpg:85,  topg:100, opp_topg:95,  rpi:34,  conf_strength:1  },
  "Saint Louis":       { name:"Saint Louis",       region:"Midwest", conference:"A-10",       win_pct:57,  ppg:90,  opp_ppg:85,  scr_mar:75,  fg_pct:95,  opp_fg_pct:82, three_pg:108, ft_pct:102, reb_mar:78,  apg:95,  ast_to:90,  bkpg:95,  stpg:88,  topg:105, opp_topg:100, rpi:42,  conf_strength:7  },
  "Texas Tech":        { name:"Texas Tech",        region:"Midwest", conference:"Big 12",     win_pct:36,  ppg:52,  opp_ppg:55,  scr_mar:40,  fg_pct:55,  opp_fg_pct:50, three_pg:62,  ft_pct:58,  reb_mar:42,  apg:55,  ast_to:50,  bkpg:55,  stpg:48,  topg:62,  opp_topg:55,  rpi:20,  conf_strength:2  },
  "Akron":             { name:"Akron",             region:"Midwest", conference:"MAC",        win_pct:70,  ppg:142, opp_ppg:138, scr_mar:120, fg_pct:148, opp_fg_pct:140,three_pg:135, ft_pct:142, reb_mar:115, apg:140, ast_to:135, bkpg:142, stpg:138, topg:145, opp_topg:152, rpi:102, conf_strength:10 },
  "Alabama":           { name:"Alabama",           region:"Midwest", conference:"SEC",        win_pct:28,  ppg:38,  opp_ppg:42,  scr_mar:28,  fg_pct:40,  opp_fg_pct:38, three_pg:50,  ft_pct:45,  reb_mar:30,  apg:42,  ast_to:38,  bkpg:42,  stpg:35,  topg:48,  opp_topg:42,  rpi:12,  conf_strength:1  },
  "Hofstra":           { name:"Hofstra",           region:"Midwest", conference:"CAA",        win_pct:76,  ppg:152, opp_ppg:148, scr_mar:128, fg_pct:155, opp_fg_pct:150,three_pg:142, ft_pct:152, reb_mar:125, apg:150, ast_to:145, bkpg:155, stpg:150, topg:152, opp_topg:162, rpi:108, conf_strength:11 },
  "Tennessee":         { name:"Tennessee",         region:"Midwest", conference:"SEC",        win_pct:40,  ppg:58,  opp_ppg:62,  scr_mar:48,  fg_pct:62,  opp_fg_pct:58, three_pg:70,  ft_pct:65,  reb_mar:50,  apg:62,  ast_to:55,  bkpg:62,  stpg:55,  topg:70,  opp_topg:62,  rpi:22,  conf_strength:1  },
  "Miami OH":          { name:"Miami OH",          region:"Midwest", conference:"MAC",        win_pct:15,  ppg:25,  opp_ppg:28,  scr_mar:15,  fg_pct:28,  opp_fg_pct:22, three_pg:18,  ft_pct:22,  reb_mar:20,  apg:28,  ast_to:22,  bkpg:30,  stpg:25,  topg:32,  opp_topg:30,  rpi:45,  conf_strength:10 },
  "Virginia":          { name:"Virginia",          region:"Midwest", conference:"ACC",        win_pct:22,  ppg:32,  opp_ppg:35,  scr_mar:20,  fg_pct:32,  opp_fg_pct:28, three_pg:45,  ft_pct:40,  reb_mar:25,  apg:35,  ast_to:32,  bkpg:35,  stpg:30,  topg:42,  opp_topg:35,  rpi:9,   conf_strength:4  },
  "Wright State":      { name:"Wright State",      region:"Midwest", conference:"Horizon",    win_pct:84,  ppg:165, opp_ppg:160, scr_mar:140, fg_pct:168, opp_fg_pct:162,three_pg:155, ft_pct:162, reb_mar:138, apg:162, ast_to:158, bkpg:168, stpg:162, topg:165, opp_topg:172, rpi:118, conf_strength:12 },
  "Kentucky":          { name:"Kentucky",          region:"Midwest", conference:"SEC",        win_pct:46,  ppg:75,  opp_ppg:78,  scr_mar:60,  fg_pct:78,  opp_fg_pct:72, three_pg:85,  ft_pct:82,  reb_mar:65,  apg:78,  ast_to:72,  bkpg:78,  stpg:72,  topg:88,  opp_topg:82,  rpi:28,  conf_strength:1  },
  "Santa Clara":       { name:"Santa Clara",       region:"Midwest", conference:"WCC",        win_pct:62,  ppg:105, opp_ppg:98,  scr_mar:85,  fg_pct:108, opp_fg_pct:95, three_pg:118, ft_pct:112, reb_mar:88,  apg:108, ast_to:102, bkpg:112, stpg:105, topg:115, opp_topg:120, rpi:65,  conf_strength:6  },
  "Iowa State":        { name:"Iowa State",        region:"Midwest", conference:"Big 12",     win_pct:10,  ppg:20,  opp_ppg:22,  scr_mar:8,   fg_pct:22,  opp_fg_pct:18, three_pg:40,  ft_pct:35,  reb_mar:14,  apg:25,  ast_to:20,  bkpg:25,  stpg:20,  topg:35,  opp_topg:25,  rpi:4,   conf_strength:2  },
  "Tennessee State":   { name:"Tennessee State",   region:"Midwest", conference:"OVC",        win_pct:92,  ppg:178, opp_ppg:172, scr_mar:152, fg_pct:180, opp_fg_pct:175,three_pg:170, ft_pct:178, reb_mar:152, apg:178, ast_to:172, bkpg:182, stpg:178, topg:182, opp_topg:188, rpi:130, conf_strength:12 },

  // WEST REGION (1-Arizona, 2-Purdue, 3-Gonzaga, 4-Arkansas)
  "Arizona":           { name:"Arizona",           region:"West",    conference:"Big 12",     win_pct:4,   ppg:8,   opp_ppg:12,  scr_mar:3,   fg_pct:10,  opp_fg_pct:10, three_pg:28,  ft_pct:22,  reb_mar:5,   apg:10,  ast_to:8,   bkpg:12,  stpg:10,  topg:15,  opp_topg:15,  rpi:2,   conf_strength:2  },
  "LIU":               { name:"LIU",               region:"West",    conference:"NEC",        win_pct:132, ppg:225, opp_ppg:218, scr_mar:178, fg_pct:225, opp_fg_pct:212,three_pg:195, ft_pct:230, reb_mar:168, apg:228, ast_to:220, bkpg:218, stpg:205, topg:222, opp_topg:238, rpi:232, conf_strength:12 },
  "Villanova":         { name:"Villanova",         region:"West",    conference:"Big East",   win_pct:54,  ppg:88,  opp_ppg:85,  scr_mar:72,  fg_pct:90,  opp_fg_pct:82, three_pg:98,  ft_pct:92,  reb_mar:75,  apg:92,  ast_to:88,  bkpg:92,  stpg:85,  topg:100, opp_topg:95,  rpi:35,  conf_strength:3  },
  "Utah State":        { name:"Utah State",        region:"West",    conference:"Mtn West",   win_pct:58,  ppg:92,  opp_ppg:88,  scr_mar:78,  fg_pct:98,  opp_fg_pct:85, three_pg:112, ft_pct:108, reb_mar:82,  apg:98,  ast_to:92,  bkpg:98,  stpg:92,  topg:108, opp_topg:105, rpi:45,  conf_strength:7  },
  "Wisconsin":         { name:"Wisconsin",         region:"West",    conference:"Big Ten",    win_pct:37,  ppg:52,  opp_ppg:55,  scr_mar:40,  fg_pct:55,  opp_fg_pct:48, three_pg:65,  ft_pct:58,  reb_mar:42,  apg:55,  ast_to:50,  bkpg:55,  stpg:48,  topg:62,  opp_topg:55,  rpi:19,  conf_strength:2  },
  "High Point":        { name:"High Point",        region:"West",    conference:"Big South",  win_pct:74,  ppg:148, opp_ppg:142, scr_mar:125, fg_pct:152, opp_fg_pct:145,three_pg:140, ft_pct:148, reb_mar:122, apg:148, ast_to:142, bkpg:152, stpg:145, topg:150, opp_topg:158, rpi:106, conf_strength:12 },
  "Arkansas":          { name:"Arkansas",          region:"West",    conference:"SEC",        win_pct:30,  ppg:40,  opp_ppg:45,  scr_mar:30,  fg_pct:42,  opp_fg_pct:40, three_pg:55,  ft_pct:50,  reb_mar:35,  apg:45,  ast_to:42,  bkpg:48,  stpg:42,  topg:55,  opp_topg:48,  rpi:15,  conf_strength:1  },
  "Hawaii":            { name:"Hawaii",            region:"West",    conference:"Big West",   win_pct:77,  ppg:155, opp_ppg:148, scr_mar:130, fg_pct:158, opp_fg_pct:150,three_pg:145, ft_pct:155, reb_mar:128, apg:155, ast_to:148, bkpg:158, stpg:152, topg:158, opp_topg:165, rpi:112, conf_strength:11 },
  "BYU":               { name:"BYU",               region:"West",    conference:"Big 12",     win_pct:42,  ppg:65,  opp_ppg:68,  scr_mar:52,  fg_pct:68,  opp_fg_pct:62, three_pg:75,  ft_pct:72,  reb_mar:55,  apg:68,  ast_to:62,  bkpg:68,  stpg:62,  topg:78,  opp_topg:72,  rpi:26,  conf_strength:2  },
  "Texas":             { name:"Texas",             region:"West",    conference:"SEC",        win_pct:64,  ppg:110, opp_ppg:105, scr_mar:92,  fg_pct:115, opp_fg_pct:108,three_pg:122, ft_pct:118, reb_mar:95,  apg:115, ast_to:110, bkpg:118, stpg:112, topg:122, opp_topg:125, rpi:68,  conf_strength:1  },
  "Gonzaga":           { name:"Gonzaga",           region:"West",    conference:"WCC",        win_pct:22,  ppg:30,  opp_ppg:35,  scr_mar:20,  fg_pct:32,  opp_fg_pct:30, three_pg:48,  ft_pct:42,  reb_mar:28,  apg:35,  ast_to:32,  bkpg:38,  stpg:32,  topg:42,  opp_topg:38,  rpi:10,  conf_strength:6  },
  "Kennesaw State":    { name:"Kennesaw State",    region:"West",    conference:"CUSA",       win_pct:82,  ppg:162, opp_ppg:158, scr_mar:138, fg_pct:165, opp_fg_pct:160,three_pg:152, ft_pct:160, reb_mar:135, apg:160, ast_to:155, bkpg:165, stpg:158, topg:162, opp_topg:170, rpi:115, conf_strength:11 },
  "Miami FL":          { name:"Miami FL",          region:"West",    conference:"ACC",        win_pct:48,  ppg:78,  opp_ppg:75,  scr_mar:62,  fg_pct:80,  opp_fg_pct:72, three_pg:88,  ft_pct:85,  reb_mar:65,  apg:82,  ast_to:78,  bkpg:82,  stpg:78,  topg:92,  opp_topg:85,  rpi:32,  conf_strength:4  },
  "Missouri":          { name:"Missouri",          region:"West",    conference:"SEC",        win_pct:60,  ppg:100, opp_ppg:95,  scr_mar:82,  fg_pct:105, opp_fg_pct:92, three_pg:118, ft_pct:112, reb_mar:88,  apg:105, ast_to:98,  bkpg:108, stpg:100, topg:112, opp_topg:118, rpi:58,  conf_strength:1  },
  "Purdue":            { name:"Purdue",            region:"West",    conference:"Big Ten",    win_pct:14,  ppg:25,  opp_ppg:28,  scr_mar:12,  fg_pct:25,  opp_fg_pct:22, three_pg:42,  ft_pct:38,  reb_mar:18,  apg:28,  ast_to:25,  bkpg:30,  stpg:25,  topg:35,  opp_topg:30,  rpi:7,   conf_strength:2  },
  "Queens":            { name:"Queens",            region:"West",    conference:"ASUN",       win_pct:88,  ppg:172, opp_ppg:168, scr_mar:148, fg_pct:175, opp_fg_pct:170,three_pg:165, ft_pct:172, reb_mar:148, apg:172, ast_to:168, bkpg:178, stpg:172, topg:178, opp_topg:182, rpi:128, conf_strength:12 },
}

// ─── 2026 bracket seeding ─────────────────────────────────────────────────────
// Using actual first-round matchups from Selection Sunday March 15, 2026
// First Four winners (played March 17-18):
// 16-seeds: Howard (beat UMBC 86-83), Prairie View A&M (beat Lehigh 67-55)
// 11-seeds: Texas (beat NC State 68-66), Miami OH (beat SMU 89-79)

export const BRACKET: BracketData = {
  South: {
    1:  "Florida",
    16: "Prairie View A&M",
    8:  "Clemson",
    9:  "Iowa",
    5:  "Vanderbilt",
    12: "McNeese",
    4:  "Nebraska",
    13: "Troy",
    6:  "North Carolina",
    11: "VCU",
    3:  "Illinois",
    14: "Penn",
    7:  "Saint Mary's",
    10: "Texas A&M",
    2:  "Houston",
    15: "Idaho",
  },
  East: {
    1:  "Duke",
    16: "Siena",
    8:  "Ohio State",
    9:  "TCU",
    5:  "St. John's",
    12: "Northern Iowa",
    4:  "Kansas",
    13: "Cal Baptist",
    6:  "Louisville",
    11: "South Florida",
    3:  "Michigan State",
    14: "North Dakota State",
    7:  "UCLA",
    10: "UCF",
    2:  "UConn",
    15: "Furman",
  },
  Midwest: {
    1:  "Michigan",
    16: "Howard",
    8:  "Georgia",
    9:  "Saint Louis",
    5:  "Texas Tech",
    12: "Akron",
    4:  "Alabama",
    13: "Hofstra",
    6:  "Tennessee",
    11: "Miami OH",
    3:  "Virginia",
    14: "Wright State",
    7:  "Kentucky",
    10: "Santa Clara",
    2:  "Iowa State",
    15: "Tennessee State",
  },
  West: {
    1:  "Arizona",
    16: "LIU",
    8:  "Villanova",
    9:  "Utah State",
    5:  "Wisconsin",
    12: "High Point",
    4:  "Arkansas",
    13: "Hawaii",
    6:  "BYU",
    11: "Texas",
    3:  "Gonzaga",
    14: "Kennesaw State",
    7:  "Miami FL",
    10: "Missouri",
    2:  "Purdue",
    15: "Queens",
  },
}

// ─── 2026 tournament results (for scoring) ──────────────────────────────────
// Tournament starts March 19, 2026 - results TBD
export const RESULTS_2025 = {
  South: {
    r64:  [],
    r32:  [],
    s16:  [],
    e8:   "",
  },
  East: {
    r64:  [],
    r32:  [],
    s16:  [],
    e8:   "",
  },
  Midwest: {
    r64:  [],
    r32:  [],
    s16:  [],
    e8:   "",
  },
  West: {
    r64:  [],
    r32:  [],
    s16:  [],
    e8:   "",
  },
  finalFour: [],
  finalist1: "",
  finalist2: "",
  champion:  "",
}
