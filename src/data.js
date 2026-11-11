// State hunting data for TX, NM, OK, AR, LA. Gathered Oct 29, 2026.
// "verify" flags mark figures taken from secondary sources or prior-year tables.
window.HUNT_DATA = {
  TX: {
    name: "Texas", center: [31.2, -99.3], zoom: 6,
    agency: "Texas Parks and Wildlife Department (TPWD)",
    agencyUrl: "https://tpwd.texas.gov/huntwild/hunt/",
    regsUrl: "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/",
    year: "License year Sep 1, 2026 – Aug 31, 2027",
    summary: "About 95% of Texas is private. Public hunting runs mainly through TPWD's Annual Public Hunting (APH) permit, which opens roughly a million acres of WMAs, state parks, national forest and grassland units, and leased private tracts. Drawn hunts add about 5,000 supervised hunts each year.",
    fees: [
      { item: "Hunting license", res: "$25", nonres: "$315", note: "Nonresident General license is the only nonresident license valid for deer, pronghorn or bighorn." },
      { item: "Nonresident 5-day small game / exotic", res: "—", nonres: "$48", note: "Exotics, game birds except turkey, hogs, javelina, squirrel. Not valid for deer." },
      { item: "Youth license (under 17)", res: "$7", nonres: "$7", note: "Exempt from state endorsements." },
      { item: "Senior (65+)", res: "$7", nonres: "—", note: "" },
      { item: "Archery endorsement", res: "$7", nonres: "$7", note: "Needed during archery-only seasons." },
      { item: "Upland game bird endorsement", res: "$7", nonres: "$7", note: "Turkey, quail, pheasant, chachalaca." },
      { item: "Migratory game bird endorsement", res: "$7", nonres: "$7", note: "Dove, ducks, geese, cranes, etc. Plus HIP." },
      { item: "Federal duck stamp", res: "$25+", nonres: "$25+", note: "Waterfowl hunters 16 and older." },
      { item: "Annual Public Hunting (APH) permit", res: "$48", nonres: "$48", note: "Required on TPWD public hunting lands. Must also hold a season hunting license." },
      { item: "Online / phone transaction fee", res: "$5", nonres: "$5", note: "" }
    ],
    rules: [
      "Statewide annual whitetail limit is 5 deer, no more than 3 bucks; county limits are often lower.",
      "Nonresidents hunting deer must buy the $315 General license. The 5-day license does not cover deer.",
      "Every public hunting unit has its own Legal Game box. Many units are archery-only or limited to set dates.",
      "Feral hogs on private property need no license with landowner authorization. On public land you need a license and the APH.",
      "CWD zones carry carcass movement and check-station rules. Check the Outdoor Annual for the county.",
      "2026-27 is the last year TPWD prints the Public Hunting Lands Map Booklet. It moves online after this season."
    ],
    seasons: [
      ["White-tailed deer", "Archery", "252 of 254 counties", "Oct 3 – Nov 6, 2026"],
      ["White-tailed deer", "Youth-only early", "Statewide", "Oct 30 – Nov 1, 2026"],
      ["White-tailed deer", "General", "North zone", "Nov 7, 2026 – Jan 3, 2027"],
      ["White-tailed deer", "General", "South zone", "Nov 7, 2026 – Jan 17, 2027"],
      ["White-tailed deer", "Special late", "North / South", "Jan 4–17 / Jan 18–31, 2027"],
      ["White-tailed deer", "Muzzleloader-only", "90 counties", "Jan 4–17, 2027"],
      ["Mule deer", "Archery", "Panhandle / Trans-Pecos", "Oct 3 – Nov 20 / Nov 26, 2026"],
      ["Mule deer", "General", "Panhandle", "Nov 21 – Dec 6, 2026"],
      ["Mule deer", "General", "Trans-Pecos", "Nov 27 – Dec 13, 2026"],
      ["Pronghorn", "General", "41 counties", "Oct 3–18, 2026"],
      ["Turkey", "Fall", "North / South", "Nov 7 – Jan 3 / Jan 17, 2027"],
      ["Turkey", "Spring", "South", "Mar 20 – May 2, 2027"],
      ["Turkey", "Spring", "North", "Apr 3 – May 16, 2027"],
      ["Turkey", "Spring", "East (one-turkey)", "Apr 22 – May 14, 2027"],
      ["Javelina", "General", "North / South", "Oct 1 – Feb 28 / Sep 1 – Aug 31"],
      ["Dove", "Regular", "North", "Sep 1 – Nov 8 & Dec 18 – Jan 7"],
      ["Dove", "Regular", "Central", "Sep 1 – Oct 25 & Dec 11 – Jan 14"],
      ["Dove", "Regular", "South", "Sep 1 – Oct 25 & Dec 18 – Jan 21"],
      ["Duck", "Regular", "North", "Nov 14–29 & Dec 5 – Jan 31"],
      ["Duck", "Regular", "South", "Nov 7–29 & Dec 12 – Jan 31"],
      ["Duck", "Regular", "High Plains MMU", "Oct 24–25 & Oct 30 – Jan 31"],
      ["Geese (dark)", "Regular", "East / West", "Nov 7 – Jan 31 / Feb 7"],
      ["Light geese", "Regular", "East / West", "Nov 7 – Feb 19 / Feb 7"],
      ["Quail", "Regular", "Statewide", "Nov 1, 2026 – Feb 28, 2027"],
      ["Feral hogs, rabbits", "—", "Statewide", "No closed season"]
    ],
    areasLabel: "TPWD Wildlife Management Areas (54)",
    areas: ["Alabama Creek","Alazan Bayou","Angelina-Neches/Dam B","Atkinson Island","Bannister","Big Lake Bottom","Black Gap","Caddo Lake","Caddo National Grasslands","Candy Cain Abshier","Cedar Creek Islands","Chaparral","Cooper","D.R. Wintermann","Elephant Mountain","Gene Howe","Guadalupe Delta","Gus Engeling","J.D. Murphree","James E. Daughtrey","Justin Hurst","Keechi Creek","Kerr","Las Palomas","Lower Neches","M.O. Neasloney","Mad Island","Mason Mountain","Matador","Matagorda Island","McGillivray and Leona McKie Muse","Moore Plantation","Nannie M. Stringfellow","North Toledo Bend","Old Sabine Bottom","Pat Mayse","Pat Murphy","Paul and Toni Fox Burns","Playa Lakes (Armstrong Unit)","Playa Lakes (Dimmitt Unit)","Playa Lakes (Taylor Lakes Unit)","Powderhorn","Redhead Pond","Richland Creek","Roger R. Fawcett","Sam Houston National Forest","Sierra Diablo","Tawakoni","Teacup Mountain","Tony Houseman/Blue Elbow Swamp","Welder Flats","White Oak Creek","Yoakum Dunes"].map(n => ({ name: n + " WMA" })),
    links: [
      ["2026-27 season dates", "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/2026-2027-hunting-season-dates"],
      ["Hunting licenses", "https://tpwd.texas.gov/regulations/outdoor-annual/licenses/hunting-licenses-and-permits/hunting-licenses"],
      ["Endorsements", "https://tpwd.texas.gov/regulations/outdoor-annual/licenses/hunting-licenses-and-permits/hunting-endorsements"],
      ["APH permit & walk-in hunts", "https://tpwd.texas.gov/huntwild/hunt/public/annual_public_hunting/"],
      ["Public Hunting Lands Map Booklet (PDF)", "https://tpwd.texas.gov/publications/pwdpubs/media/pwd_bk_w7000_0112a.pdf"],
      ["Public hunting interactive map", "https://tpwd.maps.arcgis.com/apps/webappviewer/index.html?id=c9788957300943559f7b49206e8ef153"],
      ["Drawn hunts", "https://tpwd.texas.gov/huntwild/hunt/public/public_hunt_drawing/"],
      ["Seasons by county", "https://tpwd.texas.gov/regulations/outdoor-annual/hunting/seasons/county-listing/"]
    ],
    publicNote: "On TPWD public hunting lands you need the $48 APH permit plus a hunting license. Check the unit's Legal Game box in the map booklet before hunting."
  },

  NM: {
    name: "New Mexico", center: [34.4, -106.1], zoom: 6,
    agency: "New Mexico Department of Wildlife (formerly Game and Fish)",
    agencyUrl: "https://wildlife.dgf.nm.gov/hunting/",
    regsUrl: "https://wildlife.dgf.nm.gov/hunting/applications-and-draw-information/",
    year: "Fees shown are the 2025-26 schedule (latest full table published). Verify 2026-27 amounts.",
    summary: "New Mexico is the public-land state of this group: tens of millions of acres of BLM and national forest, plus State Trust Land open to licensed hunters under an easement. Big game is mostly draw-only by Game Management Unit (GMU). Bear, cougar, turkey, Barbary sheep, ibex and javelina have over-the-counter options.",
    fees: [
      { item: "Game-hunting license", res: "$15", nonres: "$65", note: "Required before applying or buying big game licenses." },
      { item: "Habitat Stamp", res: "$10", nonres: "$10", note: "Required to hunt U.S. Forest Service or BLM land." },
      { item: "Habitat Management & Access Validation (HMAV)", res: "$4", nonres: "$4", note: "Required for hunting, fishing and trapping." },
      { item: "Draw application fee", res: "$7", nonres: "$13", note: "Nonrefundable. Full license fee charged at application; refunded if unsuccessful." },
      { item: "Elk, standard (draw)", res: "$60–90", nonres: "$548", note: "Antlerless elk not issued to nonresidents." },
      { item: "Elk, quality / high demand (draw)", res: "$60–90", nonres: "$773", note: "" },
      { item: "Deer, standard (draw)", res: "$41", nonres: "$283", note: "Private-land-only: $34 / $270 OTC." },
      { item: "Deer, quality (draw)", res: "$41", nonres: "$368", note: "" },
      { item: "Pronghorn (draw)", res: "$60", nonres: "$283", note: "Private-land-only: $53 / $270 OTC." },
      { item: "Oryx (draw)", res: "$160", nonres: "$1,623", note: "" },
      { item: "Ibex", res: "$110", nonres: "$1,623", note: "OTC also available." },
      { item: "Bighorn sheep (draw)", res: "$160 ram", nonres: "$3,173", note: "" },
      { item: "Barbary sheep", res: "$110", nonres: "$373", note: "OTC $103 / $360." },
      { item: "Javelina", res: "$65", nonres: "$178", note: "OTC $58 / $165." },
      { item: "Bear (OTC)", res: "$47", nonres: "$260", note: "" },
      { item: "Cougar (OTC)", res: "$43", nonres: "$290", note: "" },
      { item: "Turkey (OTC)", res: "$25", nonres: "$100", note: "" },
      { item: "4-day temporary game-hunting", res: "—", nonres: "$33", note: "Small game." }
    ],
    rules: [
      "The 2026-27 big game draw closed March 18, 2026. Expect the 2027-28 deadline around mid-March 2027; bear and turkey permit draws close earlier (Feb 11 in 2026).",
      "Draw split: at least 84% of licenses go to residents, 10% to applicants using a registered outfitter, and 6% to nonresidents without an outfitter.",
      "In October 2026 the state Attorney General issued an opinion that the outfitter set-aside violates the NM Constitution. Watch for changes to the 2027 draw.",
      "The Habitat Stamp is required on any USFS or BLM land.",
      "State Trust Land is open to hunters under an easement running Apr 4, 2025 – Mar 31, 2028. Unitized State Trust and BLM parcels inside private ranches are closed and treated as private.",
      "Game taken on public land with a private-land-only license is seized."
    ],
    seasons: [
      ["Elk, deer, pronghorn, oryx, sheep", "Draw", "By GMU", "Sep – Jan, varies by unit and weapon"],
      ["Bear", "OTC", "By bear zone", "Generally Aug – Nov"],
      ["Turkey", "Spring OTC", "Statewide", "Generally mid-April – mid-May"],
      ["Barbary sheep, ibex, javelina", "OTC options", "Specific units", "See Rules & Info"]
    ],
    seasonsNote: "New Mexico sets seasons per hunt code and GMU. Dates above are general windows; use the Rules & Info booklet for the hunt code you draw.",
    areasLabel: "NM Department of Wildlife WMAs",
    areas: [["Bernardo",1675],["Bluebird Mesa",160],["Edward Sargent",20209],["Hammond Tract",80],["Jackson Lake",840],["La Joya",3405],["Marquez / L Bar",70000],["Navajo Dam",3785],["Pine River",34],["Retherford",72],["Rio Chama",13239],["W.A. Humphries",10950],["Water Canyon",2840],["Charette Lakes",1901],["Colin Neblett",33116],["Elliott Barker",5416],["McAllister Lake",623],["Bert Clancy / Pecos River",1967],["Rio de los Pinos",848],["Tres Piedras",3260],["Urraca",13304],["Wagon Mound Lake",850],["Tucumcari Lake",702],["Eagle Nest",1000],["Bear Canyon Lake",75],["Bill Evans",300],["Glenwood Allred",107],["Heart Bar",797],["Lake Roberts",79],["Red Rock",1530],["Socorro-Escondida",94],["Double E Ranch",23000],["River Ranch",1010],["San Simon Cienega",5000],["Sandhills Prairie CA",5285],["Prairie Chicken areas",21621],["W.S. Huey",2880]].map(([n,a]) => ({ name: n + " WMA", acres: a })),
    links: [
      ["Big game & draw information", "https://wildlife.dgf.nm.gov/hunting/applications-and-draw-information/"],
      ["License fees (eRegulations)", "https://www.eregulations.com/newmexico/hunting/hunting-licenses-and-fees"],
      ["State Trust Land hunting access", "https://wildlife.dgf.nm.gov/?p=10961"],
      ["Bosque del Apache NWR hunting", "https://fws.gov/refuge/bosque-del-apache/visit-us/activities/hunting"]
    ],
    publicNote: "On BLM or national forest land you need the $10 Habitat Stamp and $4 HMAV on top of your license. State Trust Land is open under the easement unless posted as unitized."
  },

  OK: {
    name: "Oklahoma", center: [35.5, -97.5], zoom: 7,
    agency: "Oklahoma Department of Wildlife Conservation (ODWC)",
    agencyUrl: "https://www.wildlifedepartment.com/hunting",
    regsUrl: "https://www.wildlifedepartment.com/hunting/regs",
    year: "2026-27 seasons. Fees from a secondary summary; verify with ODWC.",
    summary: "Oklahoma has about 80 WMAs plus national forest, Corps of Engineers lake lands and wildlife refuges. The big ones are in the southeast (Ouachita, Three Rivers, Honobia). Since SB 448 (signed April 30, 2025), nonresidents need written permission and a permit to hunt ODWC WMAs and refuges.",
    fees: [
      { item: "Annual hunting license", res: "$36", nonres: "$209", note: "verify" },
      { item: "Deer license (each: archery, muzzleloader, gun)", res: "$36", nonres: "$501", note: "Per method. verify" },
      { item: "Turkey", res: "$20", nonres: "$40", note: "verify" },
      { item: "Nonresident WMA / refuge permit (SB 448)", res: "—", nonres: "up to $100", note: "Written permission required; lottery when demand is high." }
    ],
    rules: [
      "Nonresidents must schedule and get written permission before hunting ODWC-operated WMAs and refuges, and pay a permit fee of up to $100. A lottery is used where needed. Check ODWC for how to apply this season.",
      "Emergency rule: a two-day waiting period applies to nonresident deer licenses bought while deer season is open.",
      "Elk hunting is mostly in private-land zones with written landowner permission; a new Special Southeast Zone was created for 2026-27.",
      "Each WMA has its own rules (shot types, closed dates, check-in). See Public Hunting Areas Special Regulations."
    ],
    seasons: [
      ["Deer", "Archery", "Statewide", "Oct 1, 2026 – Jan 15, 2027"],
      ["Deer", "Youth gun", "Statewide", "Oct 16–18, 2026"],
      ["Deer", "Muzzleloader", "Statewide", "Oct 24 – Nov 1, 2026"],
      ["Deer", "Gun", "Statewide", "Nov 21 – Dec 6, 2026"],
      ["Deer", "Holiday antlerless", "Open zones", "Dec 18–31, 2026"],
      ["Turkey", "Fall archery", "Statewide", "Oct 1, 2026 – Jan 15, 2027"],
      ["Turkey", "Fall gun", "Open counties", "Oct 31 – Nov 20, 2026"],
      ["Pronghorn", "Archery", "Open area", "Oct 1–14, 2026"]
    ],
    seasonsNote: "Dates from a secondary summary of the 2026-27 regulations. Confirm with ODWC before hunting.",
    areasLabel: "ODWC Wildlife Management Areas and refuges",
    areas: [["Altus-Lugert","Greer, Kiowa",3600],["Arbuckle Springs","Johnston",3869],["Atoka","Atoka",6440],["Bamberger","Adair",301],["Beaver River","Beaver",17700],["Black Kettle","Roger Mills",30710],["Blue River","Johnston",3367],["Broken Bow","McCurtain",5420],["Camp Gruber","Muskogee",null],["Candy Creek","Osage",605],["Canton","Blaine, Dewey, Major",14877],["Cherokee","Cherokee",31360],["Cimarron Bluff","Harper",3430],["Cimarron Hills","Woods",3770],["Cookson","Cherokee, Adair",14725],["Hal and Fern Cooper","Woodward, Harper",16080],["Copan","Washington",7532],["Cross Timbers","Love",10300],["Deep Fork","Creek, Okfuskee",11900],["Drummond Flats","Garfield",4653],["Ellis County","Ellis",4800],["Eufaula","Latimer, McIntosh, Pittsburg, Okmulgee",48614],["Fobb Bottom","Marshall",2205],["Fort Cobb","Caddo",3500],["Fort Gibson","Wagoner, Cherokee",21798],["Fort Supply","Woodward",5418],["Gary Sherrer","Pittsburg",1280],["Grady County","Grady",1036],["Grassy Slough","McCurtain",1016],["Hackberry Flat","Tillman",7120],["Heyburn","Creek",5865],["Hickory Creek","Love",7363],["Honobia","Pushmataha, Le Flore, McCurtain",97758],["Hugo","Choctaw, Pushmataha",19227],["Hulah","Osage",16162],["James Collins","Pittsburg, Latimer",21353],["Kaw","Kay, Osage",16254],["Keystone","Creek, Osage, Pawnee",22393],["Lexington","Cleveland",9512],["Love Valley","Love",7746],["McClellan-Kerr","Wagoner, Muskogee, Haskell, Sequoyah",7905],["McCurtain County Wilderness","McCurtain",14087],["McGee Creek","Atoka",10000],["Mountain Park","Kiowa",5400],["Okmulgee","Okmulgee",10900],["Oologah","Nowata, Rogers",12941],["Optima","Texas",8062],["Osage","Osage",9512],["Ouachita Le Flore Unit","Le Flore",232000],["Ouachita McCurtain Unit","McCurtain",131000],["Ozark Plateau","Adair",2076],["Packsaddle","Ellis",19659],["Pine Creek","Pushmataha, McCurtain",10280],["Pushmataha","Pushmataha",19237],["Red Slough","McCurtain",5814],["Rita Blanca","Cimarron",15575],["Robbers Cave","Latimer",6180],["Salt Plains NWR","Alfalfa",32080],["Sandy Sanders","Greer, Beckham",29766],["Sans Bois","Haskell",7602],["Sequoyah NWR","Sequoyah, Muskogee, Haskell",20800],["Skiatook","Osage",5085],["Spavinaw","Delaware, Mayes",14316],["Stringtown","Atoka",2260],["Tenkiller","Cherokee, Sequoyah",2590],["Texoma Washita Arm","Johnston",13286],["Three Rivers","McCurtain, Pushmataha",203246],["Washita NWR","Custer",8075],["Waurika","Cotton, Stephens",10580],["Wichita Mountains WR","Comanche",59020],["Wister","Le Flore, Latimer",35500],["Yourman","Latimer",2860]].map(([n,c,a]) => ({ name: n.match(/NWR|WR|Wilderness/) ? n : n + " WMA", where: c, acres: a })),
    links: [
      ["ODWC hunting regulations", "https://www.wildlifedepartment.com/hunting/regs"],
      ["Public hunting areas special regulations", "https://wildlifedepartment.com/hunting/regs/public-hunting-areas-special-regulations"],
      ["2024 Public Hunting Area map (PDF)", "https://wildlifedepartment.com/sites/default/files/2024-10/2024%20Public%20Hunting%20Area%20Map.pdf"],
      ["SB 448 coverage (Outdoor Life)", "https://www.outdoorlife.com/conservation/oklahoma-permission-hunt-public-land/"]
    ],
    publicNote: "Nonresidents: ODWC WMAs and refuges require advance written permission and a permit of up to $100 (SB 448). National forest and Corps lands may differ; check the area's rules."
  },

  AR: {
    name: "Arkansas", center: [34.8, -92.4], zoom: 7,
    agency: "Arkansas Game and Fish Commission (AGFC)",
    agencyUrl: "https://www.agfc.com/hunting/",
    regsUrl: "https://www.agfc.com/hunting/deer/deer-seasons-and-limits-by-zone/",
    year: "2026-27 seasons",
    summary: "Arkansas has about 120 WMAs, many overlaid on the Ozark and Ouachita National Forests (White Rock, Piney Creeks, Sylamore, Muddy Creek, Winona), plus big Delta bottomland areas famous for duck hunting. Deer seasons are set by numbered zone.",
    fees: [
      { item: "Resident Sportsman's (RS)", res: "$25", nonres: "—", note: "6 deer, 2 turkey, 1 bear tag." },
      { item: "Resident Combination Sportsman's (CS)", res: "$35.50", nonres: "—", note: "Adds fishing." },
      { item: "Nonresident Annual All Game (NBG)", res: "—", nonres: "$410", note: "Deer + small game, 6 deer tags." },
      { item: "Nonresident 3-day deer", res: "—", nonres: "$225", note: "6 deer tags." },
      { item: "Nonresident 1-day deer", res: "—", nonres: "$100", note: "" },
      { item: "Nonresident annual turkey", res: "—", nonres: "$325", note: "" },
      { item: "Nonresident annual small game", res: "—", nonres: "$110", note: "5-day: $80." },
      { item: "Nonresident bear / elk / alligator permit", res: "—", nonres: "$300 each", note: "" },
      { item: "Waterfowl stamp", res: "$7", nonres: "$50", note: "Plus federal duck stamp ($25 paper / $30 e-stamp) and free HIP." },
      { item: "Nonresident WMA waterfowl permit", res: "—", nonres: "$40 (3-day) / $200 (30-day)", note: "Required on certain WMAs during regular duck season." },
      { item: "Leased Lands Permit", res: "$75", nonres: "$75", note: "Required on AGFC Leased Lands WMAs." },
      { item: "WMA / Lake Conservation permit", res: "$10.50", nonres: "$10.50", note: "Only for people 16+ without an Arkansas hunting or fishing license (from July 1, 2026)." }
    ],
    rules: [
      "Bag limit in most zones is 4 deer, no more than 2 bucks; antlerless limits vary by zone and method.",
      "Many WMAs have their own permit hunts, shorter seasons, or antler restrictions. Check the WMA page before going.",
      "Public elk hunting is by lottery draw in the Buffalo River area.",
      "Chasing or retrieving deer with dogs requires a nonresident dog owner's permit ($100) in addition to the deer license."
    ],
    seasons: [
      ["Deer", "Early buck-only archery", "Statewide", "Aug 29–31, 2026"],
      ["Deer", "Archery", "Statewide", "Sep 26, 2026 – Feb 28, 2027"],
      ["Deer", "Alternative firearms (muzzleloader)", "Zones 1-3, 6-8, 10, 11", "Oct 17–25 & Dec 12–14, 2026"],
      ["Deer", "Modern gun", "Zones 1-3, 6-8, 10, 11", "Nov 14 – Dec 6 & Dec 26–28, 2026"],
      ["Deer", "Modern gun", "Zones 4, 5", "Nov 14–22 & Dec 26–28, 2026"],
      ["Deer", "Modern gun", "Zones 4A, 5A, 14, 15", "Nov 14 – Dec 13 & Dec 26–28, 2026"],
      ["Deer", "Modern gun", "Zones 9, 12, 13", "Nov 14 – Dec 20 & Dec 26–28, 2026"],
      ["Deer", "Modern gun", "Zones 16, 16A, 17", "Nov 14 – Dec 28, 2026"],
      ["Deer", "Youth modern gun", "Statewide", "Nov 7–8, 2026 & Jan 2–3, 2027"],
      ["Duck", "Regular (verify)", "Statewide", "Nov 21–29, Dec 10–23, Dec 26 – Jan 31"],
      ["Turkey", "Spring (verify)", "Zones 1 / 2 / 3", "Apr 19 / Apr 12 / Apr 5, 2027 opens"],
      ["Turkey", "Youth (verify)", "Statewide", "Apr 10–11, 2027"]
    ],
    seasonsNote: "Deer dates are from AGFC. Duck and turkey dates came from a secondary summary; AGFC has corrected published duck dates before, so confirm.",
    areasLabel: "AGFC Wildlife Management Areas",
    areas: [["Bayou Des Arc","White",953],["Bayou Meto","Arkansas, Jefferson",33832],["Beaver Lake","Benton, Carroll, Madison",8007],["Bell Slough","Faulkner",2040],["Beryl Anthony Lower Ouachita","Ashley, Union",7020],["Big Lake","Mississippi",12320],["Big Timber","Clark",45000],["Blue Mountain","Logan",8200],["Buffalo National River","Baxter, Marion, Newton, Searcy",95730],["Camp Robinson","Faulkner, Pulaski",26675],["Caney Creek","Howard, Montgomery, Pike, Polk",85000],["Casey Jones","Ashley, Drew",83832],["Cherokee","Cleburne, Conway, Independence, Logan, Pope, Scott, Stone, Van Buren",62203],["Cut-Off Creek","Drew",9314],["Cypress Bayou","Lonoke, White",2478],["Dardanelle","Franklin, Johnson, Logan, Pope, Yell",42658],["Dave Donaldson Black River","Clay, Greene, Randolph",21150],["DeGray Lake","Clark, Hot Spring",14000],["DeQueen Lake","Sevier",8792],["Dr. Lester Sitzes III Bois D'Arc","Hempstead",13646],["Earl Buss Bayou DeView","Poinsett",4435],["Ed Gordon Point Remove","Conway, Pope",8694],["Fort Chaffee","Crawford, Franklin, Sebastian",66000],["Freddie Black Choctaw Island","Desha",8300],["Galla Creek","Pope",3329],["Gene Rush","Newton, Searcy",17963],["Greers Ferry Lake","Cleburne, Van Buren",9914],["Gum Flats","Howard, Pike",15661],["Harold E. Alexander Spring River","Sharp",13859],["Harris Brake","Perry",3769],["Henry Gray Hurricane Lake","White",17524],["Hobbs State Park CA","Benton, Carroll, Madison",11744],["Holland Bottoms","Lonoke",6190],["Howard County","Howard",26000],["Jim Kress","Cleburne",14527],["Lafayette County","Lafayette",16739],["McIlroy Madison County","Madison",14496],["Mike Freeze Wattensaw","Prairie",19184],["Moro Big Pine","Calhoun",16000],["Mount Magazine","Logan, Yell",120000],["Muddy Creek","Montgomery, Scott, Yell",146206],["Norfork Lake","Baxter",10000],["Ozark Lake","Crawford, Franklin",7834],["Petit Jean River","Yell",15502],["Piney Creeks","Johnson, Newton, Pope",180000],["Poison Springs","Nevada, Ouachita",17604],["Provo","Sevier",11327],["Rex Hancock Black Swamp","Woodruff",7221],["Scott Henderson Gulf Mountain","Van Buren",14000],["Seven Devils","Drew",5032],["Sheffield Nelson Dagmar","Monroe",9720],["Shirey Bay Rainey Brake","Lawrence",10711],["St. Francis National Forest","Lee, Phillips",null],["St. Francis Sunken Lands","Craighead, Greene, Poinsett, Clay",27643],["Sulphur River","Miller",16681],["Sylamore","Baxter, Marion, Searcy, Stone",150000],["Trusten Holder","Arkansas, Desha",8173],["Wedington","Benton, Washington",16000],["White Rock","Crawford, Franklin, Johnson, Madison, Washington",280000],["Winona","Garland, Perry, Saline",160000]].map(([n,c,a]) => ({ name: n + " WMA", where: c, acres: a })),
    areasNote: "Largest and most-hunted areas shown. AGFC lists about 120 WMAs in total, including many small natural areas.",
    links: [
      ["Deer seasons and limits by zone", "https://www.agfc.com/hunting/deer/deer-seasons-and-limits-by-zone/"],
      ["Hunting license descriptions and fees", "https://www.agfc.com/resources/licensing/hunting-license-descriptions-and-fees/"]
    ],
    publicNote: "On Leased Lands WMAs you need a $75 Leased Lands Permit. Nonresident duck hunters on certain WMAs need a 3-day ($40) or 30-day ($200) WMA waterfowl permit."
  },

  LA: {
    name: "Louisiana", center: [31.0, -92.0], zoom: 7,
    agency: "Louisiana Department of Wildlife and Fisheries (LDWF)",
    agencyUrl: "https://www.wlf.louisiana.gov/page/hunting",
    regsUrl: "https://www.wlf.louisiana.gov/page/hunting-licenses-and-permits",
    year: "2026-27 seasons",
    summary: "Louisiana has about 55 WMAs covering well over a million acres, from Kisatchie-area pine uplands (Fort Johnson, Clear Creek, West Bay) to Atchafalaya and coastal marsh. Deer seasons are set by ten numbered deer areas, and several areas allow hunting with dogs.",
    fees: [
      { item: "Basic hunting", res: "$20", nonres: "$200", note: "5-day nonresident: $65." },
      { item: "Deer (big game)", res: "$15", nonres: "$100", note: "5-day nonresident: $35." },
      { item: "Turkey", res: "$12", nonres: "$50", note: "5-day nonresident: $35." },
      { item: "Waterfowl", res: "$12", nonres: "$50", note: "5-day nonresident: $35. Plus federal duck stamp." },
      { item: "Black bear", res: "$25", nonres: "Not offered", note: "" },
      { item: "Sportsman's Paradise", res: "$100", nonres: "$400", note: "Includes WMA access. 5-day nonresident: $120." },
      { item: "WMA Access Permit", res: "$20/yr or $5/5 days", nonres: "$20/yr or $5/5 days", note: "Required to use any LDWF land. Not needed under 18." },
      { item: "WMA camping", res: "$7/night", nonres: "$7/night", note: "Up to five adults." }
    ],
    rules: [
      "A WMA Access Permit and a free Self-Clearing Permit (check in and out) are required for every visit to LDWF land.",
      "Daily limit is one antlered and one antlerless deer where antlerless take is legal. Season limits vary by area (Area 10: 3 deer; Area 4: 4; most others: 6).",
      "CWD zones in northeast Louisiana: whole carcasses cannot leave a zone. Bone out meat or keep quarters without spine or head.",
      "Baiting and feeding are allowed statewide Sep 1, 2026 – Mar 31, 2027, but WMAs have their own rules; most prohibit baiting.",
      "Deer and waterfowl lottery hunts on WMAs require advance applications."
    ],
    seasons: [
      ["Deer", "Archery", "Areas 3, 7, 8, 10", "Sep 19, 2026 – Jan 15, 2027"],
      ["Deer", "Archery", "Areas 1, 2", "Oct 1, 2026 – Jan 31, 2027"],
      ["Deer", "Archery", "Areas 5, 6, 9", "Oct 1 – Feb 15 (bucks only Oct 1–15)"],
      ["Deer", "Primitive firearms", "Areas 3, 7, 8, 10", "Oct 10–16 & Jan 4–10"],
      ["Deer", "Primitive firearms", "Areas 1, 4, 5, 6, 9", "Nov 14–20 & Jan 25–31"],
      ["Deer", "Primitive firearms", "Area 2", "Oct 24–30 & Jan 18–24"],
      ["Deer", "Firearms still-hunt", "Areas 3, 7, 8", "Oct 17 – Nov 29, 2026"],
      ["Deer", "Firearms with dogs", "Areas 3, 7, 8", "Nov 30, 2026 – Jan 3, 2027"],
      ["Deer", "Firearms still-hunt", "Area 10 (no dogs)", "Oct 17, 2026 – Jan 3, 2027"],
      ["Deer", "Firearms still-hunt", "Areas 1, 4", "Nov 21 – Dec 11 & Jan 4–24"],
      ["Deer", "Firearms with dogs", "Areas 1, 4", "Dec 12, 2026 – Jan 3, 2027"],
      ["Deer", "Firearms still-hunt", "Area 2", "Oct 31 – Dec 9, 2026"],
      ["Deer", "Firearms with dogs", "Area 2", "Dec 10, 2026 – Jan 17, 2027"],
      ["Deer", "Firearms", "Area 6", "Still Nov 21 – Dec 11; dogs Dec 12 – Jan 24"],
      ["Deer", "Youth / veteran", "Areas 3, 7, 8, 10", "Sep 26 – Oct 2, 2026"],
      ["Deer", "Youth / veteran", "Areas 1, 4, 5, 6, 9", "Oct 31 – Nov 6, 2026"]
    ],
    seasonsNote: "Deer dates summarized from LDWF's 2026-27 regulations via local reporting. Areas 5 and 9 alternate either-sex and buck-only days; see the pamphlet.",
    areasLabel: "LDWF Wildlife Management Areas",
    areas: [["Acadiana Conservation Corridor","Avoyelles, Evangeline, Rapides, St. Landry",2285],["Alexander State Forest","Rapides",8158],["Atchafalaya Delta","St. Mary",137695],["Attakapas","Iberia, St. Martin, St. Mary",27962],["Bayou Macon","East Carroll",6919],["Bayou Pierre","DeSoto, Red River",2799],["Big Colewa Bayou","West Carroll",1798],["Big Lake","Franklin, Madison, Tensas",19231],["Biloxi","St. Bernard",35644],["Bodcau","Bossier, Webster",33766],["Boeuf","Caldwell, Catahoula",51110],["Buckhorn","Tensas",11121],["Bussey Brake","Morehouse",2600],["Catahoula Lake","La Salle",29440],["Clear Creek","Vernon",52559],["Dewey W. Wills","Catahoula, La Salle, Rapides",63984],["Elm Hall","Assumption",2839],["Esler Field","Rapides, Grant",12500],["Fort Johnson North (incl. Peason Ridge)","Sabine, Natchitoches",74309],["Fort Johnson-Vernon","Vernon",105545],["Grassy Lake","Avoyelles",12983],["J.C. \"Sonny\" Gilbert","Catahoula",7524],["John Franks","Caddo",3664],["Joyce","Tangipahoa",42292],["Little River","Grant, La Salle, Rapides",6045],["Loggy Bayou","Bossier",6558],["Manchac","St. John the Baptist",8328],["Maurepas Swamp","Ascension, Livingston, St. John, St. James, Tangipahoa",112615],["Pass a Loutre","Plaquemines",115000],["Pearl River","St. Tammany",35619],["Pointe-aux-Chenes","Terrebonne, Lafourche",33488],["Pomme de Terre","Avoyelles",6434],["Richard K. Yancey","Concordia",70872],["Russell Sage","Morehouse, Ouachita, Richland",38213],["Sabine","Sabine",7571],["Sabine Island","Calcasieu",8343],["Salvador / Timken","St. Charles",34520],["Sandy Hollow","Tangipahoa",4655],["Sherburne Complex","Pointe Coupee, St. Martin, Iberville",43637],["Soda Lake","Caddo",2500],["Spring Bayou","Avoyelles",12506],["Thistlethwaite","St. Landry",11100],["Tunica Hills","West Feliciana",6503],["West Bay","Allen",59189],["White Lake Wetlands CA","Vermilion",71905]].map(([n,c,a]) => ({ name: n.match(/CA$|Forest/) ? n : n + " WMA", where: c, acres: a })),
    links: [
      ["License and permit fee list", "https://www.wlf.louisiana.gov/page/license-and-permit-fee-list"],
      ["Hunting licenses, permits, tags", "https://www.wlf.louisiana.gov/page/hunting-licenses-and-permits"],
      ["2026-27 hunting regulations pamphlet", "https://www.wlf.louisiana.gov/news/ldwf-releases-202627-hunting-regulation-online-pamphlet"],
      ["WMA lottery hunts", "https://www.wlf.louisiana.gov/news/ldwf-accepting-applications-for-deer-waterfowl-lottery-hunts-on-wmas"],
      ["Federal lands in Louisiana", "https://wlf.louisiana.gov/page/federal-lands"]
    ],
    publicNote: "On LDWF land you need a WMA Access Permit ($20/yr or $5 for 5 days) and must fill out a free self-clearing permit for each visit."
  }
};

// Nonresident "typical deer hunt on public land" cost builder.
window.NR_DEER = {
  TX: { parts: [["General hunting license", 315], ["APH permit (public land)", 48], ["Archery endorsement (if bow)", 7]], note: "Over the counter. No draw." },
  NM: { parts: [["Game-hunting license", 65], ["Habitat Stamp", 10], ["HMAV", 4], ["Application fee", 13], ["Deer license, standard", 283]], note: "Draw only on public land; 2025-26 rates." },
  OK: { parts: [["Annual hunting license", 209], ["Deer license (one method)", 501], ["WMA / refuge permit", 100]], note: "Secondary-source fees; WMA permit up to $100." },
  AR: { parts: [["Annual All Game license (6 deer tags)", 410]], note: "Over the counter. 3-day option $225." },
  LA: { parts: [["Basic hunting", 200], ["Deer", 100], ["WMA Access Permit", 20]], note: "Over the counter. 5-day options cheaper." }
};

// Plain-English hunting and map terms used in the app and the Q&A page.
window.GLOSSARY = [
  ["Saddle", "Terrain", "A low dip in a ridgeline between two higher points. Deer and elk cross ridges through saddles because it takes the least climbing, so trails funnel through them."],
  ["Bench", "Terrain", "A flat shelf partway up a steep hillside. Deer bed and travel on benches because the walking is easy and they can watch downhill."],
  ["Funnel / pinch point", "Terrain", "Any place where terrain, water, cover or a property line squeezes animal movement into a narrow path, such as a strip of timber between two fields."],
  ["Ridge point / finger", "Terrain", "The end of a ridge that sticks out into a valley. Bucks bed on points so they can see below and smell what's behind them; turkeys often roost on them."],
  ["Drainage / draw", "Terrain", "A small valley or creek channel running downhill. Drainages hold thicker cover and water, and animals use them as travel routes. 'Drainage head' is where one starts near the ridge top."],
  ["Bottom", "Terrain", "Low, flat ground along a creek or river. Bottoms usually have the best food and cover, and in the South they're prime for hogs and ducks."],
  ["Edge", "Terrain", "Where two kinds of cover meet, like timber and a field or a clearcut and mature woods. Deer feed and travel along edges."],
  ["North-facing slope", "Terrain", "A hillside that faces north, so it gets less sun. It stays cooler and damper and usually holds thicker cover, which elk and mule deer like in warm weather."],
  ["Slope angle", "Map", "How steep the ground is, in degrees. Under 15° is easy walking; 25–35° is steep; over 35° is very steep and rarely used by deer except to escape."],
  ["Hillshade", "Map", "A shaded-relief layer that makes ridges and valleys stand out as if the sun were shining from the side."],
  ["Thermals", "Hunting", "Air that rises up slopes as the day warms and sinks down them in the evening and early morning. Thermals move your scent even when the wind is calm."],
  ["Scent cone", "Hunting", "The wedge-shaped area downwind of you where animals can smell you. It widens with distance and swings with the wind."],
  ["Approach from downwind", "Hunting", "Walk to your spot from the side the wind is blowing toward, so your scent drifts away from where the animals are."],
  ["Pressure", "Hunting", "How much hunting traffic an area gets. Most hunters stay within about half a mile of a road or trail, so animals farther in see less pressure."],
  ["Rut", "Hunting", "The breeding season, when bucks travel more and are less cautious. In these states it runs roughly from early November (north) into January (south Texas and Louisiana)."],
  ["Rub / scrape", "Hunting", "Signs left by bucks. A rub is bark scraped off a sapling by antlers; a scrape is a patch of pawed bare ground under an overhanging branch."],
  ["Bedding area", "Hunting", "Thick cover where deer lie down during the day, often on benches, points or brushy north slopes."],
  ["Legal shooting light", "Rules", "The hours you can shoot. For most big game in these states it is 30 minutes before sunrise to 30 minutes after sunset; waterfowl usually ends at sunset."],
  ["Bag limit", "Rules", "The most animals you can take, per day or per season."],
  ["Antlerless", "Rules", "Does and young bucks without hard antlers above the hairline. Many zones limit when and how many you can take."],
  ["Archery / primitive / muzzleloader / modern gun", "Rules", "Season types by weapon. Arkansas calls muzzleloader season 'alternative firearms'; Louisiana calls it 'primitive firearms'."],
  ["Still-hunt vs. hunting with dogs", "Rules", "Louisiana splits firearm deer season into still-hunting (no dogs) and dog seasons in some areas."],
  ["Youth season", "Rules", "Special dates reserved for young hunters, usually under 16 or 17, with an adult."],
  ["OTC (over the counter)", "Licenses", "A license or tag you can simply buy, with no lottery."],
  ["Draw", "Licenses", "A lottery for limited licenses. You apply by a deadline, pay up front, and get refunded if you don't draw. New Mexico big game works this way."],
  ["Hunt code", "Licenses", "New Mexico's code for one specific hunt: species, unit, weapon and dates. You apply by hunt code."],
  ["GMU", "Licenses", "Game Management Unit. New Mexico divides the state into numbered units, and each hunt is tied to one or more GMUs."],
  ["Quality / high-demand hunt", "Licenses", "New Mexico hunts with better odds of a big animal and higher nonresident prices."],
  ["Outfitter pool", "Licenses", "In New Mexico, 10% of draw licenses go to hunters applying with a registered outfitter."],
  ["Endorsement", "Licenses", "An add-on to a Texas hunting license for archery, upland birds or migratory birds."],
  ["Habitat Stamp / HMAV", "Licenses", "New Mexico add-ons. The Habitat Stamp is required on Forest Service and BLM land; HMAV (Habitat Management and Access Validation) is required for all hunting."],
  ["HIP", "Licenses", "Harvest Information Program: a free federal registration required to hunt migratory birds like ducks and doves."],
  ["Federal duck stamp", "Licenses", "A federal stamp required for waterfowl hunters 16 and older, about $25."],
  ["MLDP", "Licenses", "Texas Managed Lands Deer Program: a permit system for private ranches under a wildlife plan, with its own tags and longer seasons."],
  ["WMA", "Public land", "Wildlife Management Area: land managed by the state wildlife agency for hunting and conservation. Each WMA has its own rules and sometimes its own permit."],
  ["APH permit", "Public land", "Texas Annual Public Hunting permit, $48. Required to hunt TPWD public hunting lands, along with a hunting license."],
  ["LPU permit", "Public land", "Texas Limited Public Use permit, $12. Gets you onto public hunting lands for fishing, hiking and camping, but not hunting."],
  ["Leased Lands Permit", "Public land", "Arkansas $75 permit to hunt the WMAs AGFC leases from private timber companies."],
  ["WMA Access Permit / self-clearing permit", "Public land", "Louisiana requires a WMA Access Permit ($20/yr or $5 for 5 days) and a free check-in/check-out self-clearing permit on every visit."],
  ["NWR", "Public land", "National Wildlife Refuge, run by the U.S. Fish and Wildlife Service. Refuges set their own hunts and usually require a refuge permit."],
  ["BLM / USFS", "Public land", "Bureau of Land Management and U.S. Forest Service, the federal agencies that run most public land in New Mexico and the national forests in the other states."],
  ["State Trust Land", "Public land", "Land New Mexico holds in trust. It's open to licensed hunters under an easement, except 'unitized' parcels inside private ranches, which are closed."],
  ["Landlocked public land", "Public land", "Public land surrounded by private land with no legal road or trail access. You can't cross private land to reach it without permission."],
  ["MVUM", "Public land", "Motor Vehicle Use Map: the Forest Service map of which roads and trails are open to vehicles, and when."],
  ["PAD-US", "Map", "Protected Areas Database of the United States, the USGS map of public and protected land the app uses for public land boundaries."],
  ["Parcel", "Map", "One piece of property in county tax records, with an owner, acreage and legal description."],
  ["S-T-R", "Map", "Section-Township-Range: the survey grid used for legal land descriptions in Arkansas, Oklahoma and New Mexico."],
  ["CWD", "Rules", "Chronic Wasting Disease, a fatal deer disease. CWD zones have rules on moving carcasses, feeding and mandatory testing."],
  ["Unit / zone", "Rules", "An area the state uses to set seasons and limits. Arkansas uses numbered deer zones, Louisiana numbered deer areas, Texas uses county lines plus management units."]
];
