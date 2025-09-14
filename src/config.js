export const DEFAULT_LANG = "en_1";
export const BOT_ICON = "https://cdn.discordapp.com/avatars/1171903368713744454/76e48c1327d01de44155d7ebef87363d.png";
export const REPO_URL = "https://github.com/Prasinos333/NW-Event-Caller";


export const invasionVoices = [
  {
    label: "Rachel (EN)",
    description: "Calm American female",
    value: `en_1`,
  },
  {
    label: "Matilda (EN)",
    description: "Friendly female",
    value: `en_2`,
  },
  {
    label: "Chris (EN)",
    description: "Casual male",
    value: `en_3`,
  },
  {
    label: "Jake (EN)",
    description: '"We have Jake at home" Jake at home:',
    value: `en_4`,
  },
];

export const invasionOptions = [
  {
    label: "Phase",
    description: "Buy Phase Timings",
    value: "phase",
  },
  {
    label: "Skulls",
    description: "Skull Spawn Timings",
    value: "skull",
  },
  {
    label: "Close",
    description: "Close Spawns Timings",
    value: "close",
  },
  {
    label: "Siege",
    description: "Siege Spawn Timings",
    value: "siege",
  },
];

export const invasionTimings = [
  { name: "Invasion_start.mp3", value: 1500 },  // 25:00 Invasion Start
  { name: "Siege_left.mp3", value: 1480 },      // 24:40 Siege Left
  { name: "Siege_mid.mp3", value: 1450 },       // 24:10 Siege Mid
  { name: "Close_all.mp3", value: 1404 },       // 23:20 Close All
  { name: "Close_all.mp3", value: 1384 },       // 23:00 Close All
  { name: "Siege_right.mp3", value: 1380 },     // 23:00 Siege Right
  { name: "Phase_start.mp3", value: 1372 },     // 22:50 Wave 1 Phase Start
  { name: "Phase_warn_10.mp3", value: 1341 },   // 22:20 Wave 1 Phase 10 Sec Warn
  // { name: "Phase_end.mp3" , value: 1331 },   // 22:10 Wave 2
  { name: "Siege_mid.mp3", value: 1310 },       // 21:50 Siege Mid
  { name: "Siege_left.mp3", value: 1270 },      // 21:10 Siege Left
  { name: "Close_all.mp3", value: 1254 },       // 20:50 Close All
  { name: "Close_sides.mp3", value: 1234 },     // 20:30 Close Sides
  { name: "Siege_back.mp3", value: 1230 },      // 20:30 Siege Back
  { name: "Phase_start.mp3", value: 1202 },     // 20:00 Wave 2 Phase Start
  { name: "Phase_warn_10.mp3", value: 1171 },   // 19:30 Wave 2 Phase 10 Sec Warn
  // { name: "Phase_end.mp3" , value: 1161 },   // 19:20 Wave 3
  { name: "Siege_right.mp3", value: 1150 },     // 19:10 Siege Right
  { name: "Siege_left.mp3", value: 1130 },      // 18:50 Siege Left
  { name: "Close_all.mp3", value: 1104 },       // 18:20 Close All
  { name: "Siege_mid.mp3", value: 1100 },       // 18:20 Siege Mid
  { name: "Close_back.mp3", value: 1084 },      // 18:00 Close Back
  { name: "Close_sides.mp3", value: 1064 },     // 17:40 Close Sides
  { name: "Siege_back.mp3", value: 1050 },      // 17:30 Siege Back
  { name: "Phase_start.mp3", value: 1032 },     // 17:10 Wave 3 Phase Start
  { name: "Phase_warn_10.mp3", value: 1001 },   // 16:40 Wave 3 Phase 10 Sec Warn
  // { name: "Phase_end.mp3" , value: 991 },    // 16:30 Wave 4
  { name: "Siege_mid.mp3", value: 980 },        // 16:20 Siege Mid
  { name: "Siege_back.mp3", value: 950 },       // 15:50 Siege Back
  { name: "Close_all.mp3", value: 934 },        // 15:30 Close All
  { name: "Siege_left.mp3", value: 920 },       // 15:20 Siege Left
  { name: "Close_sides.mp3", value: 894 },      // 14:50 Close Sides
  { name: "Siege_right.mp3", value: 880 },      // 14:40 Siege Right
  { name: "Close_all.mp3", value: 874 },        // 14:30 Close All
  { name: "Close_front.mp3", value: 854 },      // 14:10 Close Front
  { name: "Phase_start.mp3", value: 842 },      // 14:00 Wave 4 Phase Start
  { name: "Phase_warn_10.mp3", value: 811 },    // 13:30 Wave 4 Phase 10 Sec Warn
  // { name: "Phase_end.mp3" , value: 801 },    // 13:20 Wave 5
  { name: "Siege_right.mp3", value: 790 },      // 13:10 Siege Right
  { name: "Siege_left.mp3", value: 770 },       // 12:50 Siege Left
  { name: "Siege_back.mp3", value: 740 },       // 12:20 Siege Back
  { name: "Close_all.mp3", value: 724 },        // 12:00 Close All
  { name: "Close_sides.mp3", value: 704 },      // 11:40 Close Sides
  { name: "Siege_mid.mp3", value: 700 },        // 11:40 Siege Mid
  { name: "Siege_back.mp3", value: 660 },       // 11:00 Siege Back
  { name: "Phase_start.mp3", value: 652 },      // 10:50 Wave 5 Phase Start
  { name: "Phase_warn_10.mp3", value: 621 },    // 10:20 Wave 5 10 Sec Warn
  { name: "Close_all.mp3", value: 614 },        // 10:10 Close All
  // { name: "Phase_end.mp3" , value: 611 },    // 10:10 Wave 6
  { name: "Siege_mid.mp3", value: 600 },        // 10:00 Siege Mid
  { name: "Siege_right.mp3", value: 570 },      // 09:30 Siege Right
  { name: "Siege_back.mp3", value: 540 },       // 09:00 Siege Back
  { name: "Siege_left.mp3", value: 520 },       // 08:40 Siege Left
  { name: "Siege_back.mp3", value: 500 },       // 08:20 Siege Back
  { name: "Skull_warn_mid.mp3", value: 491 },   // 08:10 Skull Mid 10 Sec Warn
  { name: "Skull_mid.mp3", value: 480 },        // 08:00 Skull Mid
  { name: "Close_all.mp3", value: 474 },        // 07:50 Close All
  { name: "Phase_start.mp3", value: 462 },      // 07:40 Wave 6 Phase Start
  { name: "Phase_warn_10.mp3", value: 431 },    // 07:10 Wave 6 Phase 10 Sec Warn
  { name: "Close_back.mp3", value: 424 },       // 07:00 Close Back
  // { name: "Phase_end.mp3" , value: 421 },    // 07:00 Wave 7
  { name: "Close_all.mp3", value: 404 },        // 06:40 Close All
  { name: "Skull_warn_mid.mp3", value: 401 },   // 06:40 Skull Mid 10 Sec Warn
  { name: "Siege_right.mp3", value: 399 },      // 06:40 Siege Right
  { name: "Skull_mid.mp3", value: 390 },        // 06:30 Skull Mid
  { name: "Siege_left.mp3", value: 380 },       // 06:20 Siege Left
  { name: "Siege_back.mp3", value: 360 },       // 06:00 Siege Back
  { name: "Siege_back.mp3", value: 350 },       // 05:50 Siege Back
  { name: "Close_all.mp3", value: 344 },        // 05:40 Close All
  { name: "Skull_warn_left.mp3", value: 331 },  // 05:30 Skull Left 10 Sec Warn
  { name: "Siege_mid.mp3", value: 329 },        // 05:30 Siege Mid
  { name: "Skull_left.mp3", value: 320 },       // 05:20 Skull Left
  { name: "Siege_right.mp3", value: 310 },      // 05:10 Siege Right
  { name: "Close_front.mp3", value: 304 },      // 05:00 Close Front
  { name: "Siege_back.mp3", value: 290 },       // 04:50 Siege Back
  { name: "Close_all.mp3", value: 284 },        // 04:40 Close All
  { name: "Siege_back.mp3", value: 280 },       // 04:40 Siege Back
  { name: "Phase_start.mp3", value: 252 },      // 04:10 Wave 7 Phase Start
  { name: "Phase_warn_10.mp3", value: 221 },    // 03:40 Wave 7 Phase 10 Sec Warn
  { name: "Close_all.mp3", value: 214 },        // 03:30 Close All
  // { name: "Phase_end.mp3" , value: 211 },    // 03:30 Wave 8
  { name: "Skull_warn_right.mp3", value: 201 }, // 03:20 Skull Right 10 Sec Warn
  { name: "Siege_left.mp3", value: 199 },       // 03:20 Siege Left
  { name: "Close_all.mp3", value: 194 },        // 03:10 Close All
  { name: "Skull_right.mp3", value: 190 },      // 03:10 Skull Right
  { name: "Siege_mid.mp3", value: 180 },        // 03:00 Siege Mid
  { name: "Siege_back.mp3", value: 170 },       // 02:50 Siege Back
  { name: "Siege_back.mp3", value: 160 },       // 02:40 Siege Back
  { name: "Close_all.mp3", value: 154 },        // 02:30 Close All
  { name: "Skull_warn_left.mp3", value: 151 },  // 02:30 Skull Left 10 Sec Warn
  { name: "Skull_left.mp3", value: 140 },       // 02:20 Skull Left
  { name: "Siege_right.mp3", value: 130 },      // 02:10 Siege Right
  { name: "Siege_mid.mp3", value: 110 },        // 01:50 Siege Mid
  // { name: "Siege_back.mp3" , value: 110 },   // 01:50 Siege Back
  { name: "Siege_back.mp3", value: 100 },       // 01:40 Siege Back
  { name: "Close_all.mp3", value: 94 },         // 01:30 Close All
  { name: "Skull_warn_mid.mp3", value: 81 },    // 01:20 Skull Mid 10 Sec Warn
  { name: "Siege_left.mp3", value: 79 },        // 01:20 Siege Left
  { name: "Close_all.mp3", value: 75 },         // 01:10 Close All
  { name: "Skull_mid.mp3", value: 70 },         // 01:10 Skull Mid
  { name: "Close_all.mp3", value: 54 },         // 00:50 Close All
  { name: "Siege_back.mp3", value: 50 },        // 00:50 Siege Back
  { name: "Last_spawn.mp3", value: 42 },        // 00:40 Last Spawn Wave
];

export const warVoices = [
  {
    label: "Rachel (EN)",
    description: "Calm American female",
    value: `en_1`,
  },
  {
    label: "Matilda (EN)",
    description: "Friendly female",
    value: `en_2`,
  },
  {
    label: "Chris (EN)",
    description: "Casual male",
    value: `en_3`,
  },
];

export const respawns = [
  { wave: 0, value: 1780 }, // 29:40
  { wave: 0, value: 1760 }, // 29:20
  { wave: 0, value: 1740 }, // 29:00
  { wave: 0, value: 1720 }, // 28:40
  { wave: 0, value: 1700 }, // 28:20
  { wave: 0, value: 1680 }, // 28:00
  { wave: 0, value: 1660 }, // 27:40
  { wave: 0, value: 1640 }, // 27:20
  { wave: 0, value: 1620 }, // 27:00
  { wave: 0, value: 1600 }, // 26:40
  { wave: 0, value: 1580 }, // 26:20
  { wave: 0, value: 1560 }, // 26:00
  { wave: 0, value: 1540 }, // 25:40
  { wave: 0, value: 1520 }, // 25:20
  { wave: 0, value: 1500 }, // 25:00
  { wave: 0, value: 1490 }, // 24:50
  { wave: 2, value: 1470 }, // 24:30
  { wave: 1, value: 1462 }, // 24:22
  { wave: 2, value: 1442 }, // 24:02
  { wave: 1, value: 1434 }, // 23:54
  { wave: 2, value: 1414 }, // 23:34
  { wave: 1, value: 1406 }, // 23:26
  { wave: 2, value: 1386 }, // 23:06
  { wave: 1, value: 1378 }, // 22:58
  { wave: 2, value: 1358 }, // 22:38
  { wave: 1, value: 1350 }, // 22:30
  { wave: 2, value: 1330 }, // 22:10
  { wave: 1, value: 1322 }, // 22:02
  { wave: 2, value: 1302 }, // 21:42
  { wave: 1, value: 1294 }, // 21:34
  { wave: 2, value: 1274 }, // 21:14
  { wave: 1, value: 1266 }, // 21:06
  { wave: 2, value: 1246 }, // 20:46
  { wave: 1, value: 1238 }, // 20:38
  { wave: 2, value: 1218 }, // 20:18
  { wave: 1, value: 1210 }, // 20:10
  { wave: 2, value: 1190 }, // 19:50
  { wave: 0, value: 1182 }, // 19:42
  { wave: 2, value: 1154 }, // 19:14
  { wave: 1, value: 1146 }, // 19:06
  { wave: 2, value: 1118 }, // 18:38
  { wave: 1, value: 1110 }, // 18:30
  { wave: 2, value: 1082 }, // 18:02
  { wave: 1, value: 1074 }, // 17:54
  { wave: 2, value: 1046 }, // 17:26
  { wave: 1, value: 1038 }, // 17:18
  { wave: 2, value: 1010 }, // 16:50
  { wave: 1, value: 1002 }, // 16:42
  { wave: 2, value: 974 },  // 16:14
  { wave: 1, value: 966 },  // 16:06
  { wave: 2, value: 938 },  // 15:38
  { wave: 1, value: 930 },  // 15:30
  { wave: 2, value: 902 },  // 15:02
  { wave: 1, value: 894 },  // 14:54
  { wave: 2, value: 866 },  // 14:26
  { wave: 0, value: 858 },  // 14:18
  { wave: 2, value: 822 },  // 13:42
  { wave: 1, value: 814 },  // 13:34
  { wave: 2, value: 778 },  // 12:58
  { wave: 1, value: 770 },  // 12:50
  { wave: 2, value: 734 },  // 12:14
  { wave: 1, value: 726 },  // 12:06
  { wave: 2, value: 690 },  // 11:30
  { wave: 1, value: 682 },  // 11:22
  { wave: 2, value: 646 },  // 10:46
  { wave: 1, value: 640 },  // 10:40
  { wave: 2, value: 602 },  // 10:02
  { wave: 1, value: 594 },  // 09:54
  { wave: 2, value: 558 },  // 09:18
  { wave: 0, value: 550 },  // 09:10
  { wave: 0, value: 498 },  // 08:18
  { wave: 0, value: 446 },  // 07:26
  { wave: 0, value: 394 },  // 06:34
  { wave: 0, value: 342 },  // 05:42
  { wave: 0, value: 290 },  // 04:50
  { wave: 0, value: 230 },  // 03:50
  { wave: 0, value: 170 },  // 02:50
  { wave: 0, value: 110 },  // 01:50
  { wave: 0, value: 50 },   // 00:50
];

export const BAR_CONFIG = {
  barWidth: 25,
  barIconFull: "●",
  barIconEmpty: "○",
};
