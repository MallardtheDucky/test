const LEVELS=[
 {
  "name": "ADMINISTRATION",
  "depth": "-50 M",
  "rooms": [
   {
    "name": "VAULT DOOR",
    "status": "SEALED",
    "head": "Overseer Eyes Only",
    "faction": "Loyalists",
    "desc": "The Great Seal (Model 77-A). Main hydraulic mechanisms verified intact. \n\nExternal sensors indicate lethal radiation levels in the immediate vestibule area (Zone 0). \n\nDefense Protocols: Automated turrets active. Camouflage netting requires replacement.",
    "alert": "DOOR SEALED FOR 198 YEARS",
    "cols": 2,
    "personnel": "0 (Auto)"
   },
   {
    "name": "SECURITY ARMORY",
    "status": "OK",
    "head": "Chief Roland Drake",
    "faction": "The Guards",
    "desc": "Inventory Audit: \n- 20 T-45d Power Armor Suits (10 Operational, 10 for parts)\n- 200 R91 Assault Rifles\n- 150 10mm Pistols\n- 100 Security Batons\n\nCRITICAL: No energy weapon capability. Ballistic ammo conservation is mandatory.",
    "alert": null,
    "cols": 1,
    "personnel": "12"
   },
   {
    "name": "OVERSEER OFFICE",
    "status": "RESTRICTED",
    "head": "Vincent Caldwell",
    "faction": "Loyalists",
    "desc": "Executive command center. Direct uplink to central mainframe. Access to Reclamation Day protocols. Contains \"The Black Book\" (Vault-Tec Executive Summary).",
    "alert": "BIOMETRIC LOCK ENGAGED",
    "cols": 1,
    "personnel": "3"
   }
  ]
 },
 {
  "name": "HABITATION",
  "depth": "-100 M",
  "rooms": [
   {
    "name": "ATRIUM",
    "status": "OK",
    "head": "Public Area",
    "faction": "Neutral",
    "desc": "Central gathering hub (Capacity: 500). LED sky-ceiling currently simulating \"Overcast Afternoon\" to reduce power consumption. Community notice board full of \"Educator\" flyers.",
    "alert": null,
    "cols": 4,
    "personnel": "142"
   },
   {
    "name": "EDUCATION",
    "status": "BUSY",
    "head": "Daniel Cross",
    "faction": "Educators",
    "desc": "Classrooms 1-4. Current Curriculum: \"The Resource Wars: Why We Failed.\" \n\nStudents are undergoing G.O.A.T. prep. Head Instructor Cross has requested revised history holotapes regarding the Enclave.",
    "alert": "REVISIONIST HISTORY DETECTED",
    "cols": 1,
    "personnel": "45"
   },
   {
    "name": "CAFETERIA",
    "status": "OK",
    "head": "Chef Handy Unit",
    "faction": "Neutral",
    "desc": "Serving: Algae Paste (Day 442). Coffee rations exhausted in 2274. \n\nMr. Handy unit \"Chef Pierre\" is requesting oil bath.",
    "alert": null,
    "cols": 1,
    "personnel": "8"
   },
   {
    "name": "QUARTERS A",
    "status": "OK",
    "head": "Housing Manager",
    "faction": "Neutral",
    "desc": "Staff housing block. Capacity 100%. Air filtration requires filter change in Block C.",
    "alert": null,
    "cols": 1,
    "personnel": "320"
   },
   {
    "name": "CLINIC",
    "status": "BUSY",
    "head": "Dr. James Morrison",
    "faction": "Loyalists",
    "desc": "Patient Load High. Tracking \"Grey Drift\" genetic anomalies in Generation 6 children. \n\nStimpak supply synthesis is stable. RadAway stocks: High. \nEquipment: 4 Auto-Docs (3 Operational).",
    "alert": "GENETIC DRIFT WARNING",
    "cols": 1,
    "personnel": "18"
   }
  ]
 },
 {
  "name": "ENGINEERING",
  "depth": "-200 M",
  "rooms": [
   {
    "name": "REACTOR",
    "status": "WARNING",
    "head": "Natasha Volkova",
    "faction": "Innovators",
    "desc": "General Atomics V-Series Nuclear Generator. Output 98.4%. Est. Fuel Lifespan: 800 Years. \n\nISSUE: Secondary Coolant Pump vibration (\"The Heartbeat\") is worsening. Volkova has requested permission to scavenge parts from Level 4.",
    "alert": "VIBRATION DETECTED",
    "cols": 1,
    "personnel": "15"
   },
   {
    "name": "HYDROPONICS",
    "status": "OK",
    "head": "Lawrence Ashford",
    "faction": "Preservationists",
    "desc": "Three-level hydroponic bays. LED growth lights at 85% intensity. \n\nYield is nominal. Ashford reports slight mold growth in Sector 3 due to humidity controls. Producing: Tatoes, Mutfruit, Carrots, Medicinal Herbs.",
    "alert": null,
    "cols": 1,
    "personnel": "60"
   },
   {
    "name": "WATER PURIFICATION",
    "status": "CRITICAL",
    "head": "Auto-Sys",
    "faction": "Neutral",
    "desc": "Water Chip Model 2077-B functioning within parameters. Source: Mountain spring aquifer. \n\nWARNING: This is the LAST functional chip. No backups available. Failure results in total colony dehydration in 4 days.",
    "alert": "SINGLE POINT OF FAILURE",
    "cols": 1,
    "personnel": "2"
   },
   {
    "name": "WORKSHOP",
    "status": "OK",
    "head": "Eng. Team",
    "faction": "Innovators",
    "desc": "Fabricating 10mm rounds and basic tools. \n\nT-45d repair bay active. Robot repair station offline due to lack of fusion pulse regulators. Cannot manufacture new robots.",
    "alert": null,
    "cols": 1,
    "personnel": "22"
   }
  ]
 },
 {
  "name": "RESTRICTED",
  "depth": "-400 M",
  "rooms": [
   {
    "name": "CRYO CONTROL",
    "status": "OK",
    "head": "Dr. Morrison",
    "faction": "Loyalists",
    "desc": "Monitoring station for 120 Executive Pods. Liquid Nitrogen levels holding. Backup generators primed.",
    "alert": null,
    "cols": 2,
    "personnel": "5"
   },
   {
    "name": "PODS 001-119",
    "status": "STABLE",
    "head": "Vault-Tec Execs",
    "faction": "Frozen",
    "desc": "Occupants: Board of Directors & Senior VPs. \nVital signs nominal. Brain wave activity: Delta Sleep. Awakening protocol ready on Overseer command.",
    "alert": null,
    "cols": 1,
    "personnel": "119"
   },
   {
    "name": "POD 089",
    "status": "CRITICAL",
    "head": "S. Calvin (VP)",
    "faction": "Frozen",
    "desc": "Executive V.P. S. Calvin. \n\nWARNING: Neural decay detected. Subject appears to be experiencing \"Freezer Burn\" nightmares. Thaw recommended immediately.",
    "alert": "NEURAL DECAY DETECTED",
    "cols": 1,
    "personnel": "1"
   }
  ]
 }
];
