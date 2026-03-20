// @ts-nocheck
import type { TeamStats, BracketData } from '@/types/bracket'

// ─── 2026 NCAA Tournament Team Stats ────────────────────────────────────────
// Percentile ranks among ~362 D1 teams (lower = better)
// Data sourced from sports-reference.com 2025-26 season stats

export const TEAMS: Record<string, TeamStats> = {
  // EAST REGION (1-Duke, 2-UConn, 3-Michigan St., 4-Kansas)
  "Duke"              : { name:"Duke"              , region:"East"      , conference:"ACC"         , win_pct:2   , ppg:48  , opp_ppg:3   , scr_mar:2   , fg_pct:22  , opp_fg_pct:8   , three_pg:85  , ft_pct:192 , reb_mar:5   , apg:28  , ast_to:29  , bkpg:186 , stpg:74  , topg:87  , opp_topg:134 , rpi:2   , conf_strength:4  },
  "UConn"             : { name:"UConn"             , region:"East"      , conference:"Big East"    , win_pct:7   , ppg:138 , opp_ppg:11  , scr_mar:17  , fg_pct:34  , opp_fg_pct:19  , three_pg:132 , ft_pct:217 , reb_mar:33  , apg:9   , ast_to:25  , bkpg:13  , stpg:157 , topg:150 , opp_topg:144 , rpi:13  , conf_strength:3  },
  "Michigan St."      : { name:"Michigan St."      , region:"East"      , conference:"Big Ten"     , win_pct:28  , ppg:101 , opp_ppg:43  , scr_mar:32  , fg_pct:62  , opp_fg_pct:33  , three_pg:190 , ft_pct:44  , reb_mar:3   , apg:7   , ast_to:31  , bkpg:72  , stpg:335 , topg:184 , opp_topg:325 , rpi:10  , conf_strength:2  },
  "Kansas"            : { name:"Kansas"            , region:"East"      , conference:"Big 12"      , win_pct:52  , ppg:179 , opp_ppg:60  , scr_mar:83  , fg_pct:173 , opp_fg_pct:6   , three_pg:222 , ft_pct:35  , reb_mar:127 , apg:146 , ast_to:107 , bkpg:6   , stpg:312 , topg:102 , opp_topg:340 , rpi:21  , conf_strength:2  },
  "St. John's"        : { name:"St. John's"        , region:"East"      , conference:"Big East"    , win_pct:15  , ppg:58  , opp_ppg:72  , scr_mar:24  , fg_pct:165 , opp_fg_pct:59  , three_pg:270 , ft_pct:181 , reb_mar:63  , apg:49  , ast_to:38  , bkpg:20  , stpg:59  , topg:82  , opp_topg:37  , rpi:15  , conf_strength:3  },
  "Louisville"        : { name:"Louisville"        , region:"East"      , conference:"ACC"         , win_pct:52  , ppg:20  , opp_ppg:131 , scr_mar:16  , fg_pct:68  , opp_fg_pct:71  , three_pg:6   , ft_pct:30  , reb_mar:41  , apg:25  , ast_to:62  , bkpg:181 , stpg:159 , topg:193 , opp_topg:160 , rpi:11  , conf_strength:4  },
  "UCLA"              : { name:"UCLA"              , region:"East"      , conference:"Big Ten"     , win_pct:60  , ppg:130 , opp_ppg:103 , scr_mar:74  , fg_pct:62  , opp_fg_pct:114 , three_pg:159 , ft_pct:35  , reb_mar:245 , apg:46  , ast_to:7   , bkpg:254 , stpg:191 , topg:6   , opp_topg:142 , rpi:29  , conf_strength:2  },
  "Ohio St."          : { name:"Ohio St."          , region:"East"      , conference:"Big Ten"     , win_pct:88  , ppg:85  , opp_ppg:146 , scr_mar:70  , fg_pct:19  , opp_fg_pct:155 , three_pg:153 , ft_pct:20  , reb_mar:133 , apg:137 , ast_to:86  , bkpg:317 , stpg:345 , topg:70  , opp_topg:278 , rpi:27  , conf_strength:2  },
  "TCU"               : { name:"TCU"               , region:"East"      , conference:"Big 12"      , win_pct:69  , ppg:114 , opp_ppg:126 , scr_mar:84  , fg_pct:202 , opp_fg_pct:204 , three_pg:215 , ft_pct:239 , reb_mar:107 , apg:81  , ast_to:72  , bkpg:37  , stpg:82  , topg:131 , opp_topg:35  , rpi:43  , conf_strength:2  },
  "UCF"               : { name:"UCF"               , region:"East"      , conference:"Big 12"      , win_pct:78  , ppg:66  , opp_ppg:304 , scr_mar:172 , fg_pct:92  , opp_fg_pct:261 , three_pg:176 , ft_pct:128 , reb_mar:82  , apg:74  , ast_to:75  , bkpg:231 , stpg:294 , topg:151 , opp_topg:224 , rpi:51  , conf_strength:2  },
  "South Florida"     : { name:"South Florida"     , region:"East"      , conference:"AAC"         , win_pct:35  , ppg:8   , opp_ppg:243 , scr_mar:21  , fg_pct:243 , opp_fg_pct:42  , three_pg:44  , ft_pct:109 , reb_mar:44  , apg:21  , ast_to:40  , bkpg:68  , stpg:13  , topg:151 , opp_topg:26  , rpi:55  , conf_strength:8  },
  "N. Iowa"           : { name:"N. Iowa"           , region:"East"      , conference:"MVC"         , win_pct:77  , ppg:309 , opp_ppg:1   , scr_mar:48  , fg_pct:43  , opp_fg_pct:26  , three_pg:182 , ft_pct:267 , reb_mar:262 , apg:109 , ast_to:30  , bkpg:212 , stpg:203 , topg:15  , opp_topg:157 , rpi:89  , conf_strength:9  },
  "Cal Baptist"       : { name:"Cal Baptist"       , region:"East"      , conference:"WAC"         , win_pct:35  , ppg:245 , opp_ppg:40  , scr_mar:96  , fg_pct:292 , opp_fg_pct:44  , three_pg:316 , ft_pct:217 , reb_mar:13  , apg:358 , ast_to:350 , bkpg:258 , stpg:316 , topg:266 , opp_topg:186 , rpi:130 , conf_strength:10 },
  "N. Dakota St."     : { name:"N. Dakota St."     , region:"East"      , conference:"Summit"      , win_pct:21  , ppg:71  , opp_ppg:66  , scr_mar:26  , fg_pct:77  , opp_fg_pct:150 , three_pg:62  , ft_pct:188 , reb_mar:53  , apg:89  , ast_to:68  , bkpg:263 , stpg:37  , topg:111 , opp_topg:45  , rpi:131 , conf_strength:12 },
  "Furman"            : { name:"Furman"            , region:"East"      , conference:"SoCon"       , win_pct:83  , ppg:159 , opp_ppg:90  , scr_mar:88  , fg_pct:47  , opp_fg_pct:79  , three_pg:98  , ft_pct:293 , reb_mar:31  , apg:80  , ast_to:124 , bkpg:185 , stpg:349 , topg:227 , opp_topg:338 , rpi:198 , conf_strength:12 },
  "Siena"             : { name:"Siena"             , region:"East"      , conference:"MAAC"        , win_pct:60  , ppg:294 , opp_ppg:15  , scr_mar:113 , fg_pct:148 , opp_fg_pct:65  , three_pg:350 , ft_pct:30  , reb_mar:106 , apg:215 , ast_to:131 , bkpg:211 , stpg:273 , topg:64  , opp_topg:248 , rpi:211 , conf_strength:12 },

  // WEST REGION (1-Arizona, 2-Purdue, 3-Gonzaga, 4-Arkansas)
  "Arizona"           : { name:"Arizona"           , region:"West"      , conference:"Big 12"      , win_pct:2   , ppg:14  , opp_ppg:54  , scr_mar:6   , fg_pct:11  , opp_fg_pct:8   , three_pg:336 , ft_pct:147 , reb_mar:6   , apg:28  , ast_to:37  , bkpg:60  , stpg:70  , topg:116 , opp_topg:148 , rpi:3   , conf_strength:2  },
  "Purdue"            : { name:"Purdue"            , region:"West"      , conference:"Big Ten"     , win_pct:31  , ppg:55  , opp_ppg:75  , scr_mar:23  , fg_pct:15  , opp_fg_pct:196 , three_pg:60  , ft_pct:102 , reb_mar:19  , apg:3   , ast_to:1   , bkpg:285 , stpg:303 , topg:11  , opp_topg:293 , rpi:8   , conf_strength:2  },
  "Gonzaga"           : { name:"Gonzaga"           , region:"West"      , conference:"WCC"         , win_pct:5   , ppg:17  , opp_ppg:18  , scr_mar:3   , fg_pct:5   , opp_fg_pct:11  , three_pg:289 , ft_pct:267 , reb_mar:12  , apg:10  , ast_to:4   , bkpg:115 , stpg:30  , topg:29  , opp_topg:22  , rpi:9   , conf_strength:6  },
  "Arkansas"          : { name:"Arkansas"          , region:"West"      , conference:"SEC"         , win_pct:33  , ppg:3   , opp_ppg:335 , scr_mar:39  , fg_pct:13  , opp_fg_pct:255 , three_pg:151 , ft_pct:86  , reb_mar:153 , apg:33  , ast_to:5   , bkpg:15  , stpg:115 , topg:9   , opp_topg:181 , rpi:17  , conf_strength:1  },
  "Wisconsin"         : { name:"Wisconsin"         , region:"West"      , conference:"Big Ten"     , win_pct:48  , ppg:35  , opp_ppg:235 , scr_mar:69  , fg_pct:191 , opp_fg_pct:213 , three_pg:4   , ft_pct:10  , reb_mar:183 , apg:64  , ast_to:10  , bkpg:217 , stpg:293 , topg:8   , opp_topg:312 , rpi:25  , conf_strength:2  },
  "BYU"               : { name:"BYU"               , region:"West"      , conference:"Big 12"      , win_pct:60  , ppg:24  , opp_ppg:226 , scr_mar:49  , fg_pct:43  , opp_fg_pct:180 , three_pg:107 , ft_pct:91  , reb_mar:70  , apg:206 , ast_to:157 , bkpg:42  , stpg:126 , topg:121 , opp_topg:185 , rpi:22  , conf_strength:2  },
  "Miami"             : { name:"Miami"             , region:"West"      , conference:"ACC"         , win_pct:33  , ppg:52  , opp_ppg:107 , scr_mar:30  , fg_pct:12  , opp_fg_pct:196 , three_pg:296 , ft_pct:309 , reb_mar:15  , apg:59  , ast_to:69  , bkpg:171 , stpg:64  , topg:156 , opp_topg:92  , rpi:30  , conf_strength:4  },
  "Villanova"         : { name:"Villanova"         , region:"West"      , conference:"Big East"    , win_pct:35  , ppg:147 , opp_ppg:96  , scr_mar:80  , fg_pct:148 , opp_fg_pct:228 , three_pg:47  , ft_pct:280 , reb_mar:228 , apg:91  , ast_to:45  , bkpg:339 , stpg:109 , topg:49  , opp_topg:102 , rpi:40  , conf_strength:3  },
  "Utah St."          : { name:"Utah St."          , region:"West"      , conference:"Mtn West"    , win_pct:15  , ppg:46  , opp_ppg:83  , scr_mar:19  , fg_pct:15  , opp_fg_pct:71  , three_pg:112 , ft_pct:242 , reb_mar:146 , apg:17  , ast_to:21  , bkpg:254 , stpg:23  , topg:94  , opp_topg:28  , rpi:33  , conf_strength:7  },
  "Missouri"          : { name:"Missouri"          , region:"West"      , conference:"SEC"         , win_pct:93  , ppg:88  , opp_ppg:227 , scr_mar:126 , fg_pct:22  , opp_fg_pct:134 , three_pg:245 , ft_pct:307 , reb_mar:86  , apg:161 , ast_to:232 , bkpg:156 , stpg:178 , topg:270 , opp_topg:207 , rpi:54  , conf_strength:1  },
  "NC State"          : { name:"NC State"          , region:"West"      , conference:"ACC"         , win_pct:109 , ppg:27  , opp_ppg:252 , scr_mar:67  , fg_pct:77  , opp_fg_pct:228 , three_pg:27  , ft_pct:33  , reb_mar:256 , apg:83  , ast_to:16  , bkpg:176 , stpg:47  , topg:14  , opp_topg:90  , rpi:31  , conf_strength:4  },
  "Texas"             : { name:"Texas"             , region:"West"      , conference:"SEC"         , win_pct:100 , ppg:30  , opp_ppg:240 , scr_mar:60  , fg_pct:70  , opp_fg_pct:220 , three_pg:30  , ft_pct:40  , reb_mar:245 , apg:78  , ast_to:20  , bkpg:165 , stpg:50  , topg:18  , opp_topg:85  , rpi:35  , conf_strength:1  },
  "High Point"        : { name:"High Point"        , region:"West"      , conference:"Big South"   , win_pct:6   , ppg:4   , opp_ppg:79  , scr_mar:1   , fg_pct:20  , opp_fg_pct:88  , three_pg:77  , ft_pct:109 , reb_mar:131 , apg:47  , ast_to:12  , bkpg:98  , stpg:1   , topg:17  , opp_topg:3   , rpi:96  , conf_strength:12 },
  "Hawaii"            : { name:"Hawaii"            , region:"West"      , conference:"Big West"    , win_pct:35  , ppg:90  , opp_ppg:67  , scr_mar:38  , fg_pct:136 , opp_fg_pct:37  , three_pg:217 , ft_pct:124 , reb_mar:26  , apg:189 , ast_to:299 , bkpg:74  , stpg:182 , topg:333 , opp_topg:130 , rpi:105 , conf_strength:11 },
  "Kennesaw St."      : { name:"Kennesaw St."      , region:"West"      , conference:"ASUN"        , win_pct:103 , ppg:31  , opp_ppg:238 , scr_mar:62  , fg_pct:212 , opp_fg_pct:26  , three_pg:62  , ft_pct:290 , reb_mar:47  , apg:149 , ast_to:194 , bkpg:12  , stpg:136 , topg:219 , opp_topg:134 , rpi:151 , conf_strength:12 },
  "Queens"            : { name:"Queens"            , region:"West"      , conference:"ASUN"        , win_pct:103 , ppg:19  , opp_ppg:353 , scr_mar:179 , fg_pct:34  , opp_fg_pct:308 , three_pg:28  , ft_pct:131 , reb_mar:270 , apg:67  , ast_to:56  , bkpg:246 , stpg:261 , topg:103 , opp_topg:260 , rpi:199 , conf_strength:12 },
  "LIU"               : { name:"LIU"               , region:"West"      , conference:"NEC"         , win_pct:48  , ppg:230 , opp_ppg:104 , scr_mar:156 , fg_pct:36  , opp_fg_pct:196 , three_pg:329 , ft_pct:346 , reb_mar:142 , apg:196 , ast_to:282 , bkpg:10  , stpg:70  , topg:311 , opp_topg:79  , rpi:221 , conf_strength:12 },

  // SOUTH REGION (1-Florida, 2-Houston, 3-Illinois, 4-Nebraska)
  "Florida"           : { name:"Florida"           , region:"South"     , conference:"SEC"         , win_pct:23  , ppg:12  , opp_ppg:125 , scr_mar:10  , fg_pct:41  , opp_fg_pct:30  , three_pg:222 , ft_pct:234 , reb_mar:1   , apg:37  , ast_to:80  , bkpg:17  , stpg:172 , topg:225 , opp_topg:235 , rpi:4   , conf_strength:1  },
  "Houston"           : { name:"Houston"           , region:"South"     , conference:"Big 12"      , win_pct:15  , ppg:148 , opp_ppg:2   , scr_mar:12  , fg_pct:191 , opp_fg_pct:16  , three_pg:102 , ft_pct:25  , reb_mar:97  , apg:125 , ast_to:14  , bkpg:97  , stpg:79  , topg:1   , opp_topg:45  , rpi:7   , conf_strength:2  },
  "Illinois"          : { name:"Illinois"          , region:"South"     , conference:"Big Ten"     , win_pct:35  , ppg:21  , opp_ppg:68  , scr_mar:11  , fg_pct:107 , opp_fg_pct:33  , three_pg:11  , ft_pct:5   , reb_mar:7   , apg:124 , ast_to:22  , bkpg:30  , stpg:365 , topg:5   , opp_topg:365 , rpi:6   , conf_strength:2  },
  "Nebraska"          : { name:"Nebraska"          , region:"South"     , conference:"Big Ten"     , win_pct:18  , ppg:143 , opp_ppg:22  , scr_mar:27  , fg_pct:98  , opp_fg_pct:21  , three_pg:24  , ft_pct:78  , reb_mar:209 , apg:14  , ast_to:6   , bkpg:306 , stpg:119 , topg:34  , opp_topg:77  , rpi:20  , conf_strength:2  },
  "Vanderbilt"        : { name:"Vanderbilt"        , region:"South"     , conference:"SEC"         , win_pct:23  , ppg:13  , opp_ppg:215 , scr_mar:22  , fg_pct:41  , opp_fg_pct:71  , three_pg:55  , ft_pct:5   , reb_mar:203 , apg:45  , ast_to:15  , bkpg:27  , stpg:40  , topg:24  , opp_topg:82  , rpi:12  , conf_strength:1  },
  "N. Carolina"       : { name:"N. Carolina"       , region:"South"     , conference:"ACC"         , win_pct:35  , ppg:87  , opp_ppg:109 , scr_mar:50  , fg_pct:59  , opp_fg_pct:52  , three_pg:111 , ft_pct:317 , reb_mar:79  , apg:66  , ast_to:23  , bkpg:159 , stpg:321 , topg:28  , opp_topg:351 , rpi:26  , conf_strength:4  },
  "Saint Mary's"      : { name:"Saint Mary's"      , region:"South"     , conference:"WCC"         , win_pct:13  , ppg:116 , opp_ppg:7   , scr_mar:13  , fg_pct:118 , opp_fg_pct:23  , three_pg:148 , ft_pct:1   , reb_mar:4   , apg:92  , ast_to:71  , bkpg:127 , stpg:298 , topg:112 , opp_topg:294 , rpi:32  , conf_strength:6  },
  "Clemson"           : { name:"Clemson"           , region:"South"     , conference:"ACC"         , win_pct:48  , ppg:229 , opp_ppg:28  , scr_mar:61  , fg_pct:173 , opp_fg_pct:56  , three_pg:141 , ft_pct:184 , reb_mar:141 , apg:265 , ast_to:98  , bkpg:268 , stpg:219 , topg:19  , opp_topg:196 , rpi:37  , conf_strength:4  },
  "Iowa"              : { name:"Iowa"              , region:"South"     , conference:"Big Ten"     , win_pct:88  , ppg:193 , opp_ppg:17  , scr_mar:45  , fg_pct:20  , opp_fg_pct:283 , three_pg:159 , ft_pct:28  , reb_mar:178 , apg:96  , ast_to:36  , bkpg:348 , stpg:133 , topg:30  , opp_topg:62  , rpi:28  , conf_strength:2  },
  "Texas A&M"         : { name:"Texas A&M"         , region:"South"     , conference:"SEC"         , win_pct:78  , ppg:9   , opp_ppg:321 , scr_mar:56  , fg_pct:142 , opp_fg_pct:171 , three_pg:15  , ft_pct:138 , reb_mar:228 , apg:12  , ast_to:20  , bkpg:190 , stpg:43  , topg:120 , opp_topg:56  , rpi:38  , conf_strength:1  },
  "VCU"               : { name:"VCU"               , region:"South"     , conference:"A-10"        , win_pct:23  , ppg:53  , opp_ppg:119 , scr_mar:36  , fg_pct:114 , opp_fg_pct:103 , three_pg:74  , ft_pct:124 , reb_mar:109 , apg:158 , ast_to:116 , bkpg:47  , stpg:117 , topg:105 , opp_topg:152 , rpi:53  , conf_strength:7  },
  "McNeese"           : { name:"McNeese"           , region:"South"     , conference:"Southland"   , win_pct:10  , ppg:83  , opp_ppg:24  , scr_mar:14  , fg_pct:77  , opp_fg_pct:26  , three_pg:289 , ft_pct:86  , reb_mar:155 , apg:158 , ast_to:60  , bkpg:50  , stpg:2   , topg:27  , opp_topg:2   , rpi:91  , conf_strength:12 },
  "Troy"              : { name:"Troy"              , region:"South"     , conference:"Sun Belt"    , win_pct:69  , ppg:79  , opp_ppg:156 , scr_mar:68  , fg_pct:199 , opp_fg_pct:114 , three_pg:72  , ft_pct:133 , reb_mar:87  , apg:65  , ast_to:102 , bkpg:171 , stpg:56  , topg:217 , opp_topg:92  , rpi:162 , conf_strength:12 },
  "Penn"              : { name:"Penn"              , region:"South"     , conference:"Ivy"         , win_pct:108 , ppg:177 , opp_ppg:151 , scr_mar:163 , fg_pct:250 , opp_fg_pct:241 , three_pg:172 , ft_pct:309 , reb_mar:200 , apg:180 , ast_to:134 , bkpg:213 , stpg:163 , topg:108 , opp_topg:99  , rpi:165 , conf_strength:11 },
  "Idaho"             : { name:"Idaho"             , region:"South"     , conference:"Big Sky"     , win_pct:115 , ppg:108 , opp_ppg:139 , scr_mar:86  , fg_pct:202 , opp_fg_pct:103 , three_pg:34  , ft_pct:142 , reb_mar:62  , apg:282 , ast_to:204 , bkpg:327 , stpg:267 , topg:93  , opp_topg:263 , rpi:155 , conf_strength:12 },
  "Prairie View"      : { name:"Prairie View"      , region:"South"     , conference:"SWAC"        , win_pct:191 , ppg:103 , opp_ppg:237 , scr_mar:160 , fg_pct:235 , opp_fg_pct:142 , three_pg:321 , ft_pct:67  , reb_mar:328 , apg:317 , ast_to:308 , bkpg:29  , stpg:57  , topg:222 , opp_topg:6   , rpi:313 , conf_strength:12 },

  // MIDWEST REGION (1-Michigan, 2-Iowa St., 3-Virginia, 4-Alabama)
  "Michigan"          : { name:"Michigan"          , region:"Midwest"   , conference:"Big Ten"     , win_pct:4   , ppg:10  , opp_ppg:56  , scr_mar:4   , fg_pct:8   , opp_fg_pct:2   , three_pg:83  , ft_pct:91  , reb_mar:8   , apg:6   , ast_to:44  , bkpg:3   , stpg:270 , topg:248 , opp_topg:211 , rpi:1   , conf_strength:2  },
  "Iowa St."          : { name:"Iowa St."          , region:"Midwest"   , conference:"Big 12"      , win_pct:21  , ppg:54  , opp_ppg:12  , scr_mar:7   , fg_pct:22  , opp_fg_pct:88  , three_pg:88  , ft_pct:342 , reb_mar:56  , apg:22  , ast_to:19  , bkpg:285 , stpg:16  , topg:62  , opp_topg:7   , rpi:5   , conf_strength:2  },
  "Virginia"          : { name:"Virginia"          , region:"Midwest"   , conference:"ACC"         , win_pct:7   , ppg:73  , opp_ppg:44  , scr_mar:18  , fg_pct:107 , opp_fg_pct:11  , three_pg:29  , ft_pct:184 , reb_mar:16  , apg:42  , ast_to:46  , bkpg:1   , stpg:204 , topg:116 , opp_topg:280 , rpi:19  , conf_strength:4  },
  "Alabama"           : { name:"Alabama"           , region:"Midwest"   , conference:"SEC"         , win_pct:44  , ppg:1   , opp_ppg:356 , scr_mar:54  , fg_pct:142 , opp_fg_pct:114 , three_pg:2   , ft_pct:40  , reb_mar:187 , apg:55  , ast_to:24  , bkpg:16  , stpg:205 , topg:35  , opp_topg:342 , rpi:14  , conf_strength:1  },
  "Texas Tech"        : { name:"Texas Tech"        , region:"Midwest"   , conference:"Big 12"      , win_pct:57  , ppg:77  , opp_ppg:141 , scr_mar:59  , fg_pct:85  , opp_fg_pct:155 , three_pg:5   , ft_pct:223 , reb_mar:104 , apg:69  , ast_to:63  , bkpg:110 , stpg:277 , topg:112 , opp_topg:317 , rpi:18  , conf_strength:2  },
  "Tennessee"         : { name:"Tennessee"         , region:"Midwest"   , conference:"SEC"         , win_pct:69  , ppg:95  , opp_ppg:59  , scr_mar:37  , fg_pct:107 , opp_fg_pct:31  , three_pg:305 , ft_pct:280 , reb_mar:2   , apg:31  , ast_to:65  , bkpg:133 , stpg:104 , topg:198 , opp_topg:240 , rpi:16  , conf_strength:1  },
  "Kentucky"          : { name:"Kentucky"          , region:"Midwest"   , conference:"SEC"         , win_pct:103 , ppg:70  , opp_ppg:182 , scr_mar:73  , fg_pct:102 , opp_fg_pct:79  , three_pg:154 , ft_pct:176 , reb_mar:98  , apg:63  , ast_to:47  , bkpg:44  , stpg:132 , topg:83  , opp_topg:243 , rpi:23  , conf_strength:1  },
  "Georgia"           : { name:"Georgia"           , region:"Midwest"   , conference:"SEC"         , win_pct:57  , ppg:5   , opp_ppg:315 , scr_mar:31  , fg_pct:62  , opp_fg_pct:150 , three_pg:41  , ft_pct:63  , reb_mar:186 , apg:112 , ast_to:77  , bkpg:2   , stpg:35  , topg:99  , opp_topg:42  , rpi:24  , conf_strength:1  },
  "Saint Louis"       : { name:"Saint Louis"       , region:"Midwest"   , conference:"A-10"        , win_pct:10  , ppg:11  , opp_ppg:63  , scr_mar:5   , fg_pct:7   , opp_fg_pct:1   , three_pg:10  , ft_pct:102 , reb_mar:14  , apg:10  , ast_to:61  , bkpg:153 , stpg:131 , topg:275 , opp_topg:178 , rpi:34  , conf_strength:7  },
  "Santa Clara"       : { name:"Santa Clara"       , region:"Midwest"   , conference:"WCC"         , win_pct:31  , ppg:38  , opp_ppg:136 , scr_mar:35  , fg_pct:77  , opp_fg_pct:234 , three_pg:29  , ft_pct:140 , reb_mar:116 , apg:34  , ast_to:39  , bkpg:114 , stpg:18  , topg:116 , opp_topg:31  , rpi:42  , conf_strength:6  },
  "SMU"               : { name:"SMU"               , region:"Midwest"   , conference:"ACC"         , win_pct:109 , ppg:23  , opp_ppg:284 , scr_mar:76  , fg_pct:22  , opp_fg_pct:124 , three_pg:122 , ft_pct:124 , reb_mar:85  , apg:30  , ast_to:51  , bkpg:119 , stpg:135 , topg:165 , opp_topg:131 , rpi:34  , conf_strength:4  },
  "Akron"             : { name:"Akron"             , region:"Midwest"   , conference:"MAC"         , win_pct:7   , ppg:7   , opp_ppg:172 , scr_mar:9   , fg_pct:10  , opp_fg_pct:59  , three_pg:9   , ft_pct:63  , reb_mar:46  , apg:8   , ast_to:18  , bkpg:217 , stpg:103 , topg:133 , opp_topg:57  , rpi:82  , conf_strength:10 },
  "Hofstra"           : { name:"Hofstra"           , region:"Midwest"   , conference:"CAA"         , win_pct:48  , ppg:181 , opp_ppg:19  , scr_mar:43  , fg_pct:240 , opp_fg_pct:4   , three_pg:56  , ft_pct:91  , reb_mar:34  , apg:265 , ast_to:187 , bkpg:118 , stpg:341 , topg:94  , opp_topg:312 , rpi:107 , conf_strength:12 },
  "Wright St."        : { name:"Wright St."        , region:"Midwest"   , conference:"Horizon"     , win_pct:60  , ppg:71  , opp_ppg:170 , scr_mar:62  , fg_pct:30  , opp_fg_pct:264 , three_pg:258 , ft_pct:140 , reb_mar:66  , apg:184 , ast_to:173 , bkpg:49  , stpg:113 , topg:162 , opp_topg:148 , rpi:151 , conf_strength:12 },
  "Tennessee St."     : { name:"Tennessee St."     , region:"Midwest"   , conference:"OVC"         , win_pct:44  , ppg:76  , opp_ppg:164 , scr_mar:65  , fg_pct:127 , opp_fg_pct:188 , three_pg:312 , ft_pct:40  , reb_mar:61  , apg:231 , ast_to:262 , bkpg:127 , stpg:7   , topg:257 , opp_topg:19  , rpi:216 , conf_strength:12 },
  "UMBC"              : { name:"UMBC"              , region:"Midwest"   , conference:"America East" , win_pct:35  , ppg:167 , opp_ppg:29  , scr_mar:46  , fg_pct:62  , opp_fg_pct:71  , three_pg:152 , ft_pct:46  , reb_mar:117 , apg:303 , ast_to:142 , bkpg:306 , stpg:337 , topg:25  , opp_topg:301 , rpi:213 , conf_strength:12 },
  "Howard"            : { name:"Howard"            , region:"Midwest"   , conference:"MEAC"        , win_pct:40  , ppg:160 , opp_ppg:35  , scr_mar:50  , fg_pct:58  , opp_fg_pct:65  , three_pg:145 , ft_pct:50  , reb_mar:120 , apg:295 , ast_to:135 , bkpg:298 , stpg:330 , topg:30  , opp_topg:290 , rpi:220 , conf_strength:12 },
  "Miami OH"          : { name:"Miami OH"          , region:"Midwest"   , conference:"MAC"         , win_pct:100 , ppg:28  , opp_ppg:275 , scr_mar:70  , fg_pct:25  , opp_fg_pct:118 , three_pg:115 , ft_pct:118 , reb_mar:80  , apg:35  , ast_to:48  , bkpg:112 , stpg:128 , topg:160 , opp_topg:125 , rpi:38  , conf_strength:10 },

}

// ─── 2026 bracket seeding ─────────────────────────────────────────────────────
// CBS Sports projected bracket for 2026 NCAA Tournament
// First Four winners (played March 18-19, 2026):
// 16-seeds: Howard (beat UMBC), Prairie View (beat Lehigh)
// 11-seeds: Texas (beat NC State), Miami OH (beat SMU)

export const BRACKET: BracketData = {
  East: {
    1:  "Duke",
    16:  "Siena",
    8:  "Ohio St.",
    9:  "TCU",
    5:  "St. John's",
    12:  "N. Iowa",
    4:  "Kansas",
    13:  "Cal Baptist",
    6:  "Louisville",
    11:  "South Florida",
    3:  "Michigan St.",
    14:  "N. Dakota St.",
    7:  "UCLA",
    10:  "UCF",
    2:  "UConn",
    15:  "Furman",
  },
  West: {
    1:  "Arizona",
    16:  "LIU",
    8:  "Villanova",
    9:  "Utah St.",
    5:  "Wisconsin",
    12:  "High Point",
    4:  "Arkansas",
    13:  "Hawaii",
    6:  "BYU",
    11:  "Texas",
    3:  "Gonzaga",
    14:  "Kennesaw St.",
    7:  "Miami",
    10:  "Missouri",
    2:  "Purdue",
    15:  "Queens",
  },
  South: {
    1:  "Florida",
    16:  "Prairie View",
    8:  "Clemson",
    9:  "Iowa",
    5:  "Vanderbilt",
    12:  "McNeese",
    4:  "Nebraska",
    13:  "Troy",
    6:  "N. Carolina",
    11:  "VCU",
    3:  "Illinois",
    14:  "Penn",
    7:  "Saint Mary's",
    10:  "Texas A&M",
    2:  "Houston",
    15:  "Idaho",
  },
  Midwest: {
    1:  "Michigan",
    16:  "Howard",
    8:  "Georgia",
    9:  "Saint Louis",
    5:  "Texas Tech",
    12:  "Akron",
    4:  "Alabama",
    13:  "Hofstra",
    6:  "Tennessee",
    11:  "Miami OH",
    3:  "Virginia",
    14:  "Wright St.",
    7:  "Kentucky",
    10:  "Santa Clara",
    2:  "Iowa St.",
    15:  "Tennessee St.",
  },
}

// ─── 2026 tournament results (for eliminated team strikethrough) ──────────
// Fill in round-by-round as games are played
export const RESULTS_2026 = {
  South: {
    r64:  [] as string[],
    r32:  [] as string[],
    s16:  [] as string[],
    e8:   "",
  },
  East: {
    r64:  [] as string[],
    r32:  [] as string[],
    s16:  [] as string[],
    e8:   "",
  },
  Midwest: {
    r64:  [] as string[],
    r32:  [] as string[],
    s16:  [] as string[],
    e8:   "",
  },
  West: {
    r64:  [] as string[],
    r32:  [] as string[],
    s16:  [] as string[],
    e8:   "",
  },
  finalFour: [] as string[],
  finalist1: "",
  finalist2: "",
  champion:  "",
}
