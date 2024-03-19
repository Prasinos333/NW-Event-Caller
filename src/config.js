import path from "path";

export const Default_Lang = "en_2";

export const AUDIO = (lang = 'en_2') => ({
    '10_second_countdown': path.resolve('src', 'resources', lang, `war`, '10_second_countdown.mp3'), // 10.916s
    '15_seconds': path.resolve('src', 'resources', lang, `war`, '15_seconds.mp3'), // .957s
    '20_seconds': path.resolve('src', 'resources', lang, `war`, '20_seconds.mp3'), // .761s
    '30_seconds': path.resolve('src', 'resources', lang, `war`, '30_seconds.mp3'), // .745s
    '40_seconds': path.resolve('src', 'resources', lang, `war`, '40_seconds.mp3'), // .743s
    '50_seconds': path.resolve('src', 'resources', lang, `war`, '50_seconds.mp3'), // .745s
    'War Notice' : path.resolve('src', 'resources', lang, `war`, 'War_notice.mp3'), // 1.64s
    'War Start' : path.resolve('src', 'resources', lang, `war`, 'War_start.mp3'), // .818s
    'Buy Start': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_start.mp3'), // 2.853s
    'Buy War_15': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_warn_15.mp3'), // 2.443s
    'Buy Warn_10': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_warn_10.mp3'), // 1.991s
    'Buy_phase_end': path.resolve('src', 'resources', lang, `invasion`, 'Buy_phase_end.mp3'), // 1.092s
    'R_Skull Warn': path.resolve('src', 'resources', lang, `invasion`, 'Skull_warn_right.mp3'), // 2.406
    'M_Skull Warn': path.resolve('src', 'resources', lang, `invasion`, 'Skull_warn_mid.mp3'), // 2.288s
    'L_Skull Warn': path.resolve('src', 'resources', lang, `invasion`, 'Skull_warn_left.mp3'), // 2.376s
    'R_Skull': path.resolve('src', 'resources', lang, `invasion`, 'Skull_right.mp3'), // 1.197s
    'M_Skull' : path.resolve('src', 'resources', lang, `invasion`, 'Skull_mid.mp3'), // .971s
    'L_Skull' : path.resolve('src', 'resources', lang, `invasion`, 'Skull_left.mp3'), // 1.128s
    'Last_Wave' : path.resolve('src', 'resources', lang, `invasion`, 'Last_wave.mp3'), // 1.269s
    'Invasion Notice' : path.resolve('src', 'resources', lang, `invasion`, 'Invasion_notice.mp3'), // 2.563s
    'Invasion Start' : path.resolve('src', 'resources', lang, `invasion`, 'Invasion_start.mp3'), // 1.071s
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
    { wave: 0, value: 1779 },   // 29:39
    { wave: 0, value: 1759 },   // 29:19
    { wave: 0, value: 1739 },   // 28:59
    { wave: 0, value: 1719 },   // 28:39
    { wave: 0, value: 1699 },   // 28:19
    { wave: 0, value: 1679 },   // 27:59
    { wave: 0, value: 1659 },   // 27:39
    { wave: 0, value: 1639 },   // 27:19
    { wave: 0, value: 1619 },   // 26:59
    { wave: 0, value: 1599 },   // 26:39
    { wave: 0, value: 1579 },   // 26:19
    { wave: 0, value: 1559 },   // 25:59
    { wave: 0, value: 1539 },   // 25:39
    { wave: 0, value: 1519 },   // 25:19
    { wave: 2, value: 1499 },   // 24:59
    { wave: 1, value: 1491 },   // 24:51
    { wave: 1, value: 1479 },   // 24:39
    { wave: 2, value: 1463 },   // 24:23
    { wave: 1, value: 1455 },   // 24:15
    { wave: 2, value: 1435 },   // 23:55
    { wave: 1, value: 1427 },   // 23:47
    { wave: 1, value: 1415 },   // 23:35  
    { wave: 2, value: 1407 },   // 23:27
    { wave: 1, value: 1399 },   // 23:19
    { wave: 2, value: 1379 },   // 22:59
    { wave: 1, value: 1371 },   // 22:51
    { wave: 2, value: 1351 },   // 22:31
    { wave: 1, value: 1343 },   // 22:23
    { wave: 2, value: 1331 },   // 22:11
    { wave: 1, value: 1323 },   // 22:03
    { wave: 2, value: 1303 },   // 21:43
    { wave: 1, value: 1295 },   // 21:35
    { wave: 2, value: 1275 },   // 21:15
    { wave: 1, value: 1267 },   // 21:07
    { wave: 2, value: 1247 },   // 20:47
    { wave: 1, value: 1238 },   // 20:38
    { wave: 2, value: 1219 },   // 20:19
    { wave: 1, value: 1211 },   // 20:11
    { wave: 2, value: 1191 },   // 19:51
    { wave: 1, value: 1183 },   // 19:43
    { wave: 2, value: 1155 },   // 19:15
    { wave: 1, value: 1147 },   // 19:07
    { wave: 2, value: 1119 },   // 18:39
    { wave: 1, value: 1111 },   // 18:31   
    { wave: 2, value: 1083 },   // 18:03
    { wave: 1, value: 1075 },   // 17:55
    { wave: 2, value: 1047 },   // 17:27
    { wave: 1, value: 1039 },   // 17:19
    { wave: 2, value: 1011 },   // 16:51
    { wave: 1, value: 1003 },   // 16:43
    { wave: 2, value: 975 },    // 16:15
    { wave: 1, value: 967 },    // 16:07
    { wave: 2, value: 939 },    // 15:39
    { wave: 1, value: 931 },    // 15:31
    { wave: 2, value: 903 },    // 15:03
    { wave: 1, value: 895 },    // 14:55
    { wave: 2, value: 867 },    // 14:27
    { wave: 1, value: 859 },    // 14:19
    { wave: 2, value: 823 },    // 13:43
    { wave: 1, value: 815 },    // 13:35
    { wave: 2, value: 779 },    // 12:59
    { wave: 1, value: 771 },    // 12:51
    { wave: 2, value: 735 },    // 12:15
    { wave: 1, value: 727 },    // 12:07
    { wave: 2, value: 691 },    // 11:31
    { wave: 1, value: 683 },    // 11:23
    { wave: 2, value: 647 },    // 10:47
    { wave: 1, value: 639 },    // 10:39       
    { wave: 2, value: 603 },    // 10:03
    { wave: 0, value: 595 },    // 09:55 
    { wave: 0, value: 551 },    // 09:11 
    { wave: 0, value: 499 },    // 08:19 
    { wave: 0, value: 447 },    // 07:27 
    { wave: 0, value: 395 },    // 06:35 
    { wave: 0, value: 343 },    // 05:43 
    { wave: 0, value: 291 },    // 04:51 
    { wave: 0, value: 231 },    // 03:51 
    { wave: 0, value: 171 },    // 02:51 
    { wave: 0, value: 111 },    // 01:51
    { wave: 0, value: 51 },     // 00:51   
];