const CURRENT_DATE = "23.10.2275";
const EMAILS = [
    {
        id: 'msg_001',
        from: 'Torres, M. (Reclamation)',
        to: 'Caldwell, V. (Overseer)',
        subject: 'Drone Recon Request #442',
        date: '22.10.2275',
        body: 'Vincent,\n\nI am formally requesting authorization for a drone launch again. The "Ghost Signal" from the Capital Wasteland proves there is organized life out there. We are sitting on 200 years of tech while eating algae paste.\n\nThe sensor readings are consistent. That isn\'t random static. It\'s a march. Someone is rebuilding. If we don\'t open the door soon, they will open it for us.\n\n- Michaela'
    },
    {
        id: 'msg_002',
        from: 'Ashford, L. (Preservation)',
        to: 'Council All',
        subject: 'Re: Drone Recon Request',
        date: '22.10.2275',
        body: 'Absolutely not.\n\nHave you forgotten the "Grey Drift"? Our genetic stability is hanging by a thread. Opening the blast door exposes us to pathogens we have no immunity to, let alone the radiation. The sensors indicate spikes in Sector 7. The surface is a graveyard.\n\nOur mandate is to survive until the Great Silence. It is decidedly NOT silent up there.\n\n- Lawrence'
    },
    {
        id: 'msg_003',
        from: 'Volkova, N. (Engineering)',
        to: 'Drake, R. (Security)',
        subject: 'Reactor Vibration ("The Heartbeat")',
        date: '21.10.2275',
        body: 'Roland, tell your guards to stop reporting the "humming" in the lower levels. I know about it. We call it "The Heartbeat."\n\nThe turbine stabilizers are worn. We can\'t manufacture new ones. We are cannibalizing the secondary backup generator to keep the primary running.\n\nUnless you have a spare GE-V7 Turbine in your armory, stop clogging my inbox.\n\n- Natasha'
    },
    {
        id: 'msg_004',
        from: 'Cross, D. (Education)',
        to: 'Caldwell, V. (Overseer)',
        subject: 'Curriculum Update: Pre-War History',
        date: '20.10.2275',
        body: 'Overseer,\n\nThe "Innovator" faction children are asking difficult questions during History class. Specifically about the Resource Wars.\n\nThey want to know why Vault-Tec didn\'t stop the bombs if they knew they were coming. The standard "Corporate Salvation" module isn\'t working on this generation. They are cynical. We might need to revise the G.O.A.T. questions to screen for this kind of dissent earlier.\n\n- Daniel'
    },
    {
        id: 'msg_005',
        from: 'Dr. Morrison (Medical)',
        to: 'Caldwell, V. (Overseer)',
        subject: 'Cryo Pod 089',
        date: '18.10.2275',
        body: 'We have a problem in the freezer.\n\nPod 089 (Executive V.P. S. Calvin). Vital signs are fluctuating. Neural activity suggests he isn\'t in deep sleep anymore. He might be dreaming. Or screaming. It\'s hard to tell with the synaptic decay.\n\nIf we don\'t thaw him soon, we lose him. But if we thaw him, we break the "All or Nothing" protocol. Your call.\n\n- Jim'
    }
];
const FILE_SYSTEM = {
    root: { id: 'root', name: 'MAIN DRIVE', type: 'folder', children: ['mission', 'factions', 'military', 'engineering', 'medical', 'restricted'] },
    mission: { id: 'mission', name: 'MISSION PROFILE', type: 'folder', children: ['project_ark', 'langston_quote', 'timeline'] },
    project_ark: { id: 'project_ark', name: 'PROJECT_ARC_OVERVIEW.TXT', type: 'file', content: 'SUBJECT: A.R.C. (Vault 254)\nCLASSIFICATION: V-TEC EYES ONLY\n\nThe Administrative Reclamation Command is a CONTROL VAULT designed to preserve the corporate hierarchy of Vault-Tec.\n\nLOCATION: Appalachian Mountains, Sector 4\n\nPOPULATION:\n- 120 Executives (Cryo-Stasis)\n- 880 Staff Descendants (Active)\n\nMANDATE:\n1. SURVIVE the nuclear exchange.\n2. MAINTAIN the facility until surface viability.\n3. AWAKEN the Executives (Reclamation Day).\n4. RESTORE corporate governance to the United States.' },
    langston_quote: { id: 'langston_quote', name: 'QUOTE_LANGSTON.LOG', type: 'file', content: '"To Vault-Tec, innovating today, safeguarding tomorrow, and leading a better world after."\n\n- Frederick Langston, Board of Directors\n\n(This quote is mandatory memorization for all Grade 3 Students)' },
    timeline: { id: 'timeline', name: 'HISTORY_LOG.DAT', type: 'file', content: '[2073] Construction of Vault 254 begins.\n[2077.10.23] 09:13 AM: Detection of inbound ICBMs.\n[2077.10.23] 09:47 AM: Vault 254 Sealed.\n[2102] Reclamation Day cancelled by Overseer Caldwell I due to toxicity.\n[2180] "The Deep Tremor" damages Geothermal vents.\n[2275] PRESENT DAY. 198 Years Sealed.' },
    factions: { id: 'factions', name: 'INTERNAL POLITICS', type: 'folder', children: ['faction_summary', 'loyalist_manifesto', 'innovator_demands'] },
    faction_summary: { id: 'faction_summary', name: 'FACTION_INTEL.DOC', type: 'file', content: 'INTERNAL FACTION BREAKDOWN (2275)\n\n1. LOYALISTS (Overseer Caldwell)\n- Goal: Status Quo. Trust the Plan.\n\n2. RECLAMATIONISTS (Michaela Torres)\n- Goal: Open the door NOW. Aggressive expansion.\n\n3. PRESERVATIONISTS (Lawrence Ashford)\n- Goal: Permanent isolation. The surface is death.\n\n4. INNOVATORS (Natasha Volkova)\n- Goal: Adapt tech. Break protocols to fix things.\n\n5. EDUCATORS (Daniel Cross)\n- Goal: Reform education. Question pre-war doctrine.' },
    military: { id: 'military', name: 'SECURITY & DEFENSE', type: 'folder', children: ['roster', 'armory', 'threats'] },
    roster: { id: 'roster', name: 'FORCE_MANIFEST.DB', type: 'file', content: 'COMMANDER: Chief Roland Drake ("The Guards")\n\nACTIVE DUTY: 120 Personnel\n\nASSETS:\n- 100 Protectron Units (Security Config)\n- 100 Mr. Handy Units (Maintenance)\n\nNOTE: We cannot manufacture new robots. Every loss is permanent.' },
    armory: { id: 'armory', name: 'ARMORY_STATUS.TXT', type: 'file', content: 'STOCKPILE:\n- T-45 Power Armor: 20 Suits (Only 10 qualified operators)\n- R91 Assault Rifles: 200 Units\n- 10mm Pistols: 150 Units\n\nCRITICAL WEAKNESS:\n- NO Energy Weapons capability.\n- NO Heavy Weapons capability.\n- Ammo stocks for 5.56mm are depleting.' },
    threats: { id: 'threats', name: 'SURFACE_THREATS.LOG', type: 'file', content: 'SENSOR ANALYSIS:\n\nSEISMIC: Rhythmic marching detected. Mass > 2000kg. Possible Super Mutant Behemoth or Heavy Power Armor battalion.\n\nAUDIO: "Ghost Signal". American patriotic music detected on loop. Origin unknown.\n\nRADIATION: Wind shifts from D.C. Ruins periodically spike Rad levels to lethal.' },
    engineering: { id: 'engineering', name: 'ENGINEERING', type: 'folder', children: ['reactor', 'water_chip', 'maintenance'] },
    reactor: { id: 'reactor', name: 'REACTOR_DIAGNOSTICS.LOG', type: 'file', content: 'SYSTEM: General Atomics Nuclear Generator\nSTATUS: ONLINE (98.4% Efficiency)\nLIFESPAN: Est. 800 Years remaining.\n\nISSUE: Secondary Coolant Pump vibration. Replacement parts unavailable. Fabricating generic patches.' },
    water_chip: { id: 'water_chip', name: 'WATER_PURIFICATION.SYS', type: 'file', content: 'COMPONENT: Water Chip (Model 2077-B)\nSTATUS: FUNCTIONAL\n\nNOTE: This is our last chip. Do not touch it. Do not look at it wrong. If it breaks, we die.' },
    medical: { id: 'medical', name: 'MEDICAL', type: 'folder', children: ['patient_zero', 'supply_list'] },
    patient_zero: { id: 'patient_zero', name: 'GENETIC_DRIFT_STUDY.DOC', type: 'file', content: 'SUBJECT: The "Grey Drift"\n\nWe are seeing immune system depression in Generation 6 children. The genetic bottleneck is real. We need new DNA to prevent a cascade failure within 50 years.\n\nThis supports the Reclamationist argument, though I hate to admit it.\n- Dr. Morrison' },
    restricted: { id: 'restricted', name: 'RESTRICTED AREA', type: 'folder', locked: true, children: ['executive_list', 'wakeup_protocol'] },
    executive_list: { id: 'executive_list', name: 'BOARD_MEMBERS.ENC', type: 'file', content: '*** EYES ONLY ***\n\nCRYO-POD 001: Frederick Langston\nCRYO-POD 002: Leonard Vance (CEO)\nCRYO-POD 120: S. Calvin\n\nTOTAL: 120 Executives.\nSTATUS: Stable (mostly).' },
    wakeup_protocol: { id: 'wakeup_protocol', name: 'RECLAMATION_DAY.EXE', type: 'file', content: 'PROTOCOL 77-RECLAIM\n\n1. Unseal Blast Door.\n2. Deploy Security Perimeter.\n3. Initiate Thaw Cycle (12 Hours).\n\nWARNING: Authorization Code required. Only the Overseer can initiate.' }
};
