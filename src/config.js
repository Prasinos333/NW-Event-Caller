import path from "path";

export const Default_Lang = "en_2";

export const AUDIO = (lang = 'en_2') => ({
    '10_second countdown': path.resolve('src', 'resources', lang, `war`, '10_second_countdown.mp3'), 
    '15_seconds': path.resolve('src', 'resources', lang, `war`, '15_seconds.mp3'), 
    '20_seconds': path.resolve('src', 'resources', lang, `war`, '20_seconds.mp3'), 
    '30_seconds': path.resolve('src', 'resources', lang, `war`, '30_seconds.mp3'), 
    '40_seconds': path.resolve('src', 'resources', lang, `war`, '40_seconds.mp3'), 
    '50_seconds': path.resolve('src', 'resources', lang, `war`, '50_seconds.mp3'), 
    'War Notice' : path.resolve('src', 'resources', lang, `war`, 'War_notice.mp3'), 
    'War Start' : path.resolve('src', 'resources', lang, `war`, 'War_start.mp3'), 
    'Buy Start': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_start.mp3'), 
    'Buy Warn_15': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_warn_15.mp3'), 
    'Buy Warn_10': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_warn_10.mp3'), 
    'Buy phase end': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_end.mp3'), 
    'R_Skull Warn': path.resolve('src', 'resources', lang, `invasion`, 'Skull_warn_right.mp3'), 
    'M_Skull Warn': path.resolve('src', 'resources', lang, `invasion`, 'Skull_warn_mid.mp3'), 
    'L_Skull Warn': path.resolve('src', 'resources', lang, `invasion`, 'Skull_warn_left.mp3'), 
    'R_Skull': path.resolve('src', 'resources', lang, `invasion`, 'Skull_right.mp3'), 
    'M_Skull' : path.resolve('src', 'resources', lang, `invasion`, 'Skull_mid.mp3'), 
    'L_Skull' : path.resolve('src', 'resources', lang, `invasion`, 'Skull_left.mp3'), 
    'Last Wave' : path.resolve('src', 'resources', lang, `invasion`, 'Last_wave.mp3'), 
    'Invasion Notice' : path.resolve('src', 'resources', lang, `invasion`, 'Invasion_notice.mp3'), 
    'Invasion Start' : path.resolve('src', 'resources', lang, `invasion`, 'Invasion_start.mp3'), 
}); 

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

export const invasionOptions = [
    {
        label: 'Kimberly (EN)',
        description: 'The first voice of the bot',
        value: `en_1`,
    },
    {
        label: 'Rachel (EN)',
        description: 'Provided by JakeL',
        value: `en_2`,
    },
    {
        label: 'Chris (EN)',
        description: 'New and only male voice',
        value: `en_3`,
    },
    {
        label: 'Jake (EN)',
        description: '"We have Jake at home" Jake at home:',
        value: `en_4`,
    }
];

export const warOptions = [
    {
        label: 'Kimberly (EN)',
        description: 'The first voice of the bot',
        value: `en_1`,
    },
    {
        label: 'Rachel (EN)',
        description: 'Provided by JakeL',
        value: `en_2`,
    }
];

export const Respawns = [
    { wave: 0, value: 1780 },   // 29:40
    { wave: 0, value: 1760 },   // 29:20
    { wave: 0, value: 1740 },   // 29:00
    { wave: 0, value: 1720 },   // 28:40
    { wave: 0, value: 1700 },   // 28:20
    { wave: 0, value: 1680 },   // 28:00
    { wave: 0, value: 1660 },   // 27:40
    { wave: 0, value: 1640 },   // 27:20
    { wave: 0, value: 1620 },   // 27:00
    { wave: 0, value: 1600 },   // 26:40
    { wave: 0, value: 1580 },   // 26:20
    { wave: 0, value: 1560 },   // 26:00
    { wave: 0, value: 1540 },   // 25:40
    { wave: 0, value: 1520 },   // 25:20
    { wave: 0, value: 1500 },   // 25:00
    { wave: 0, value: 1490 },   // 24:50
    { wave: 2, value: 1470 },   // 24:30
    { wave: 1, value: 1462 },   // 24:22
    { wave: 2, value: 1442 },   // 24:02
    { wave: 1, value: 1434 },   // 23:54
    { wave: 2, value: 1414 },   // 23:34
    { wave: 1, value: 1406 },   // 23:26
    { wave: 2, value: 1386 },   // 23:06
    { wave: 1, value: 1378 },   // 22:58
    { wave: 2, value: 1358 },   // 22:38
    { wave: 1, value: 1350 },   // 22:30
    { wave: 2, value: 1330 },   // 22:10
    { wave: 1, value: 1322 },   // 22:02
    { wave: 2, value: 1302 },   // 21:42
    { wave: 1, value: 1294 },   // 21:34
    { wave: 2, value: 1274 },   // 21:14
    { wave: 1, value: 1266 },   // 21:06
    { wave: 2, value: 1246 },   // 20:46
    { wave: 1, value: 1238 },   // 20:38
    { wave: 2, value: 1218 },   // 20:18
    { wave: 1, value: 1210 },   // 20:10
    { wave: 2, value: 1190 },   // 19:50
    { wave: 0, value: 1182 },   // 19:42
    { wave: 2, value: 1154 },   // 19:14
    { wave: 1, value: 1146 },   // 19:06
    { wave: 2, value: 1118 },   // 18:38
    { wave: 1, value: 1110 },   // 18:30
    { wave: 2, value: 1082 },   // 18:02
    { wave: 1, value: 1074 },   // 17:54
    { wave: 2, value: 1046 },   // 17:26
    { wave: 1, value: 1038 },   // 17:18
    { wave: 2, value: 1010 },   // 16:50
    { wave: 1, value: 1002 },   // 16:42
    { wave: 2, value: 974 },    // 16:14
    { wave: 1, value: 966 },    // 16:06
    { wave: 2, value: 938 },    // 15:38
    { wave: 1, value: 930 },    // 15:30
    { wave: 2, value: 902 },    // 15:02
    { wave: 1, value: 894 },    // 14:54
    { wave: 2, value: 866 },    // 14:26
    { wave: 0, value: 858 },    // 14:18
    { wave: 2, value: 822 },    // 13:42
    { wave: 1, value: 814 },    // 13:34
    { wave: 2, value: 778 },    // 12:58
    { wave: 1, value: 770 },    // 12:50
    { wave: 2, value: 734 },    // 12:14
    { wave: 1, value: 726 },    // 12:06
    { wave: 2, value: 690 },    // 11:30
    { wave: 1, value: 682 },    // 11:22
    { wave: 2, value: 646 },    // 10:46
    { wave: 1, value: 640 },    // 10:40
    { wave: 2, value: 602 },    // 10:02
    { wave: 1, value: 594 },    // 09:54
    { wave: 2, value: 558 },    // 09:18
    { wave: 0, value: 550 },    // 09:10
    { wave: 0, value: 498 },    // 08:18
    { wave: 0, value: 446 },    // 07:26
    { wave: 0, value: 394 },    // 06:34
    { wave: 0, value: 342 },    // 05:42
    { wave: 0, value: 290 },    // 04:50
    { wave: 0, value: 230 },    // 03:50
    { wave: 0, value: 170 },    // 02:50
    { wave: 0, value: 110 },    // 01:50
    { wave: 0, value: 50 },     // 00:50
];
