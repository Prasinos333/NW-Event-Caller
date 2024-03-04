import path from "path";

export const Default_Lang = "en_1";

export const AUDIO = (lang = 'en_1') => ({
    '10_second_countdown': path.resolve('src', 'resources', lang, '10_second_countdown.mp3'), // 10.916s
    '15_seconds': path.resolve('src', 'resources', lang, '15_seconds.mp3'), // .957s
    '20_seconds': path.resolve('src', 'resources', lang, '20_seconds.mp3'), // .761s
    '30_seconds': path.resolve('src', 'resources', lang, '30_seconds.mp3'), // .745s
    '40_seconds': path.resolve('src', 'resources', lang, '40_seconds.mp3'), // .743s
    '50_seconds': path.resolve('src', 'resources', lang, '50_seconds.mp3'), // .745s
    'Buy Start': path.resolve('src', 'resources', lang, 'Buy_phase_start.mp3'), // 2.853s
    'Buy War_15': path.resolve('src', 'resources', lang, 'Buy_phase_warn_15.mp3'), // 2.443s
    'Buy Warn_10': path.resolve('src', 'resources', lang, 'Buy_phase_warn_10.mp3'), // 1.991s
    'Buy_phase_end': path.resolve('src', 'resources', lang, 'Buy_phase_end.mp3'), // 1.092s
    'R_Skull Warn': path.resolve('src', 'resources', lang, 'Skull_warn_right.mp3'), // 2.406
    'M_Skull Warn': path.resolve('src', 'resources', lang, 'Skull_warn_mid.mp3'), // 2.288s
    'L_Skull Warn': path.resolve('src', 'resources', lang, 'Skull_warn_left.mp3'), // 2.376s
    'R_Skull': path.resolve('src', 'resources', lang, 'Skull_right.mp3'), // 1.197s
    'M_Skull' : path.resolve('src', 'resources', lang, 'Skull_mid.mp3'), // .971s
    'L_Skull' : path.resolve('src', 'resources', lang, 'Skull_left.mp3'), // 1.128s
    'Last_Wave' : path.resolve('src', 'resources', lang, 'Last_wave.mp3'), // 1.269s
    'Invasion Notice' : path.resolve('src', 'resources', lang, 'Invasion_notice.mp3'), // 2.563s
    'Invasion Start' : path.resolve('src', 'resources', lang, 'Invasion_start.mp3'), // 1.071s
    'War Notice' : path.resolve('src', 'resources', lang, 'War_notice.mp3'), // 1.64s
    'War Start' : path.resolve('src', 'resources', lang, 'War_notice.mp3') // .818s
}); // TODO - change names to same as timings.

export const InvasionTimings = [ 
    { name: "Buy Start" , value: 1375 },    // 22:55 Buy Phase 1 Start 
    // { name: "Buy Warn" , value: 1346 },     // 22:26 Buy Phase 1 15 Seconds Warn
    { name: "Buy Warn_10" , value: 1341 },     // 22:21 Buy Phase 1 10 Seconds Warn
    // { name: "Buy End" , value: 1335 },      // 22:15 Buy Phase 1 End
    { name: "Buy Start" , value: 1205 },    // 20:05 Buy Phase 2 Start
    // { name: "Buy Warn" , value: 1176 },     // 19:36 Buy Phase 2 15 Seconds Warn
    { name: "Buy Warn_10" , value: 1171 },     // 19:31 Buy Phase 2 10 Seconds Warn
    // { name: "Buy End" , value: 1165 },      // 19:25 Buy Phase 2 End
    { name: "Buy Start" , value: 1035 },    // 17:15 Buy Phase 3 Start
    // { name: "Buy Warn" , value: 1006 },     // 16:46 Buy Phase 3 15 Seconds Warn
    { name: "Buy Warn_10" , value: 1001 },     // 16:41 Buy Phase 3 10 Seconds Warn      
    // { name: "Buy End" , value: 995 },       // 16:30 Buy Phase 3 End
    { name: "Buy Start" , value: 845 },     // 14:05 Buy Phase 4 Start
    // { name: "Buy Warn" , value: 816 },      // 13:36 Buy Phase 4 15 Seconds Warn
    { name: "Buy Warn_10" , value: 811 },      // 13:31 Buy Phase 4 10 Seconds Warn
    // { name: "Buy End" , value: 805 },       // 13:25 Buy Phase 4 End
    { name: "Buy Start" , value: 655 },     // 10:55 Buy Phase 5 Start
    // { name: "Buy Warn" , value: 626 },      // 10:26 Buy Phase 5 15 Seconds Warn
    { name: "Buy Warn_10" , value: 621 },      // 10:21 Buy Phase 5 10 Seconds Warn
    // { name: "Buy End" , value: 615 },       // 10:15 Buy Phase 5 End 
    { name: "M_Skull Warn" , value: 497 },  // 08:17 Skull Mid 15 Seconds Warn
    { name: "M_Skull" , value: 482 },       // 08:02 Skull Mid
    { name: "Buy Start" , value: 465 },     // 07:45 Buy Phase 6 Start
    // { name: "Buy Warn" , value: 436 },      // 07:16 Buy Phase 5 15 Seconds Warn
    { name: "Buy Warn_10" , value: 431 },      // 07:11 Buy Phase 5 10 Seconds Warn
    // { name: "Buy End" , value: 425 },       // 07:05 Buy Phase 6 End
    { name: "M_Skull Warn" , value: 407 },  // 06:47 Skull Mid 15 Second Warn
    { name: "M_Skull" , value: 392 },       // 06:32 Skull Mid
    { name: "L_Skull Warn" , value: 337 },  // 05:37 Skull Left 15 Seconds Warn
    { name: "L_Skull" , value: 322 },       // 05:22 Skull Left
    { name: "Buy Start" , value: 255 },     // 04:15 Buy Phase 7 Start
    // { name: "Buy Warn" , value: 226 },      // 03:46 Buy Phase 7 15 Seconds Warn
    { name: "Buy Warn_10" , value: 221 },      // 03:41 Buy Phase 7 10 Seconds Warn
    // { name: "Buy End" , value: 215 },       // 03:35 Buy Phase 7 End
    { name: "R_Skull Warn" , value: 207 },  // 03:27 Skull Right 15 Seconds Warn
    { name: "R_Skull" , value: 192 },       // 03:12 Skull Right
    { name: "L_Skull Warn" , value: 157 },  // 02:37 Skull Left 15 Seconds Warn 
    { name: "L_Skull" , value: 142 },       // 02:22 Skull Left
    { name: "M_Skull Warn" , value: 87 },   // 01:27 Skull Mid 15 Seconds Warn
    { name: "M_Skull" , value: 72 },        // 01:12 Skull Mid
    { name: "Last Wave" , value: 50}        // 00:50 Last Spawn Wave
];

export const Respawns = [
    1779,   // 29:39
    1759,   // 29:19
    1739,   // 28:59
    1719,   // 28:39
    1699,   // 28:19
    1679,   // 27:59
    1659,   // 27:39
    1639,   // 27:19
    1619,   // 26:59
    1599,   // 26:39
    1579,   // 26:19
    1559,   // 25:59
    1539,   // 25:39
    1519,   // 25:19
    // 1499,    // 24:59
    1491,   // 24:51
    1479,   // 24:39
    // 1463,    // 24:23
    1455,   // 24:15
    // 1435,    // 23:55
    1427,   // 23:47
    1415,   // 23:35
    // 1407,    // 23:27
    1399,   // 23:19
    // 1379,    // 22:59
    1371,   // 22:51
    // 1351,    // 22:31
    1343,   // 22:23
    // 1331,    // 22:11
    1323,   // 22:03
    // 1303,    // 21:43
    1295,   // 21:35
    // 1275,    // 21:15
    1267,   // 21:07
    // 1247,    // 20:47
    1238,   // 20:38
    // 1219,    // 20:19
    1211,   // 20:11
    // 1191,    // 19:51
    1183,   // 19:43
    // 1155,    // 19:15
    1147,   // 19:07
    // 1119,    // 18:39
    1111,   // 18:31
    // 1083,    // 18:03
    1075,   // 17:55
    // 1047,    // 17:27
    1039,   // 17:19
    // 1011,    // 16:51
    1003,   // 16:43
    // 975,     // 16:15
    967,    // 16:07
    // 939,     // 15:39
    931,    // 15:31
    // 903,     // 15:03
    895,    // 14:55
    // 867,     // 14:27
    859,    // 14:19
    // 823,     // 13:43
    815,    // 13:35
    // 779,     // 12:59
    771,    // 12:51
    // 735,     // 12:15
    727,    // 12:07
    // 691,     // 11:31
    683,    // 11:23
    // 647,     // 10:47
    639,    // 10:39
    // 603,     // 10:03
    595,    // 09:55
    551,    // 09:11
    499,    // 08:19
    447,    // 07:27
    395,    // 06:35
    343,    // 05:43
    291,    // 04:51
    231,    // 03:51
    171,    // 02:51
    111,    // 01:51
    51      // 00:51
];