import { StationGraph } from '../types';

export const PROSPERO_STATION_GRAPH: StationGraph = {
  sectors: [
    {
      id: 'sector-01-dry-dock',
      number: 1,
      name: 'Dry Dock',
      description: 'The primary gateway for ships. Industrial, loud, and smelling of ozone. Run by Teamsters Local 32819L.',
      atmosphere: 'Sparks fly as the harsh screeching of metal grinding fills the air. Shipbuilders scurry over on scaffolding.',
      pageRef: 10,
      faction: 'Teamsters Local 32819L',
      locationIds: ['loc-arrival', 'loc-clean-room', 'loc-loshes-office', 'loc-repair-bay', 'loc-hangar-bay'],
      sectorConnections: [
        { toSectorId: 'sector-02-stellar-burn', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'A smooth transit ride to the entertainment district.' },
        { toSectorId: 'sector-10-the-choke', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'blocked', blockedReason: 'Quarantined', travelDescription: 'The line to Sector 10 is sealed.' },
        { toSectorId: 'sector-02-stellar-burn', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 10, status: 'open', travelDescription: 'Industrial corridors leading to the neon glow of Stellar Burn.' },
        { toSectorId: 'sector-10-the-choke', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 20, status: 'open', travelDescription: 'The lights flicker as you head towards the quarantined wasteland.' }
      ]
    },
    {
      id: 'sector-02-stellar-burn',
      number: 2,
      name: 'Stellar Burn',
      description: 'Rumors, drinks, and R&R. The station’s entertainment hub, run by the Golyonova II Bratva.',
      atmosphere: 'Dark, smoky, filled with strobing lights and flashing lasers.',
      pageRef: 12,
      faction: 'Golyonova II Bratva',
      locationIds: ['loc-sems-bar', 'loc-heaven', 'loc-the-ecstacy'],
      sectorConnections: [
        { toSectorId: 'sector-03-chop-shop', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit to the medical and cybernetic district.' },
        { toSectorId: 'sector-01-dry-dock', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the ship docks.' },
        { toSectorId: 'sector-03-chop-shop', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 15, status: 'open', travelDescription: 'The music fades as you approach the grime of the Chop Shop.' },
        { toSectorId: 'sector-01-dry-dock', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 10, status: 'open', travelDescription: 'Heading back to the industrial docks.' }
      ]
    },
    {
      id: 'sector-03-chop-shop',
      number: 3,
      name: 'Chop Shop',
      description: 'Cybermod installation and repair by Zhenya and The Babushka.',
      atmosphere: 'Overflowing with trash and grime, barely kept up by its hoarder/cybersurgeon proprietor.',
      pageRef: 14,
      faction: 'The Babushka',
      locationIds: ['loc-chop-shop-entrance', 'loc-recovery-room', 'loc-operating-theaters', 'loc-babushkas-room', 'loc-cybermod-storage', 'loc-sycorax-stash'],
      sectorConnections: [
        { toSectorId: 'sector-04-the-ice-box', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit to the high-end slickware facilities.' },
        { toSectorId: 'sector-02-stellar-burn', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the entertainment hub.' },
        { toSectorId: 'sector-04-the-ice-box', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 15, status: 'open', travelDescription: 'The air turns cold as you approach the Ice Box.' },
        { toSectorId: 'sector-02-stellar-burn', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 10, status: 'open', travelDescription: 'Back to the neon and noise of Stellar Burn.' }
      ]
    },
    {
      id: 'sector-04-the-ice-box',
      number: 4,
      name: 'The Ice Box',
      description: 'Slickware installation and re-sleeving facility.',
      atmosphere: 'Cold, sterile, and silent except for the hum of cryo-units.',
      pageRef: 20,
      faction: 'Independent',
      locationIds: ['loc-slickbays', 'loc-the-stacks', 'loc-nemo-machine'],
      sectorConnections: [
        { toSectorId: 'sector-05-the-farm', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit to the botanical sectors.' },
        { toSectorId: 'sector-03-chop-shop', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the Chop Shop.' },
        { toSectorId: 'sector-05-the-farm', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 10, status: 'open', travelDescription: 'The sterile air is replaced by the humid scent of vegetation.' },
        { toSectorId: 'sector-03-chop-shop', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 15, status: 'open', travelDescription: 'Leaving the cold for the grime of the Chop Shop.' }
      ]
    },
    {
      id: 'sector-05-the-farm',
      number: 5,
      name: 'The Farm',
      description: 'The Dream’s food supply. Run by the Solarian Church.',
      atmosphere: 'Lush greenery under artificial suns. Humid and smelling of wet earth.',
      pageRef: 22,
      faction: 'Solarian Church',
      locationIds: ['loc-farm-processing', 'loc-the-aarnivalkea', 'loc-farm-two'],
      sectorConnections: [
        { toSectorId: 'sector-06-canyonheavy-market', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit to the information market.' },
        { toSectorId: 'sector-04-the-ice-box', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the cryo-vaults.' },
        { toSectorId: 'sector-06-canyonheavy-market', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 15, status: 'open', travelDescription: 'Approaching the zero-g market zone.' },
        { toSectorId: 'sector-04-the-ice-box', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 10, status: 'open', travelDescription: 'Moving back towards the cryo-vaults.' }
      ]
    },
    {
      id: 'sector-06-canyonheavy-market',
      number: 6,
      name: 'CANYONHEAVY.market',
      description: 'Information market run by an elite hacking crew.',
      atmosphere: 'Zero-g hubs, glowing monitors, and tangled data cables.',
      pageRef: 24,
      faction: 'DEKALOG / Angus',
      locationIds: ['loc-the-battlestations', 'loc-angus-office', 'loc-server-farm', 'loc-data-vault'],
      sectorConnections: [
        { toSectorId: 'sector-07-the-court', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit to the judicial sector.' },
        { toSectorId: 'sector-05-the-farm', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the Farm.' },
        { toSectorId: 'sector-07-the-court', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 20, status: 'open', travelDescription: 'Entering the high-security zone of The Court.' },
        { toSectorId: 'sector-05-the-farm', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 15, status: 'open', travelDescription: 'Heading back to the botanical sectors.' }
      ]
    },
    {
      id: 'sector-07-the-court',
      number: 7,
      name: 'The Court',
      description: 'Disputes resolved through brutal arena combat. Run by Brunhildh.',
      atmosphere: 'Tense, authoritarian, and smelling of blood and ozone.',
      pageRef: 26,
      faction: 'The Adjudicators',
      locationIds: ['loc-the-pit', 'loc-the-bench', 'loc-the-holding-cells', 'loc-brunhildhs-quarters'],
      sectorConnections: [
        { toSectorId: 'sector-08-tempest-co-hq', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit to the mercenary headquarters.' },
        { toSectorId: 'sector-06-canyonheavy-market', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the information market.' },
        { toSectorId: 'sector-08-tempest-co-hq', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 15, status: 'open', travelDescription: 'Approaching the fortified mercenary sector.' },
        { toSectorId: 'sector-06-canyonheavy-market', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 20, status: 'open', travelDescription: 'Returning to the digital wild west.' }
      ]
    },
    {
      id: 'sector-08-tempest-co-hq',
      number: 8,
      name: 'Tempest Co. HQ',
      description: 'Powerful mercenary company. Security onboard The Dream.',
      atmosphere: 'Fortified, strict military discipline, polished steel and humming armory.',
      pageRef: 28,
      faction: 'Tempest Mercenary Company',
      locationIds: ['loc-armament-level', 'loc-operations-level', 'loc-cutters-mansion', 'loc-sublevel-c'],
      sectorConnections: [
        { toSectorId: 'sector-09-doptown', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit to the Doptown sector.' },
        { toSectorId: 'sector-07-the-court', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the judicial arena.' },
        { toSectorId: 'sector-09-doptown', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 10, status: 'open', travelDescription: 'The clean corridors give way to rust and decay.' },
        { toSectorId: 'sector-07-the-court', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 15, status: 'open', travelDescription: 'Heading back to the judicial arena.' }
      ]
    },
    {
      id: 'sector-09-doptown',
      number: 9,
      name: 'Doptown',
      description: 'Heavily guarded debtor’s prison for those who can’t pay the O2 tax.',
      atmosphere: 'Suffocating, desperate, and poor. Constant sound of coughing.',
      pageRef: 30,
      faction: 'Tempest (Guards) / Hunglungs (Prisoners)',
      locationIds: ['loc-doptown-main', 'loc-the-airlock', 'loc-the-warrens', 'loc-hollow-core'],
      sectorConnections: [
        { toSectorId: 'sector-10-the-choke', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'blocked', blockedReason: 'Quarantined', travelDescription: 'The transit line is sealed by heavy blast doors.' },
        { toSectorId: 'sector-08-tempest-co-hq', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'open', cost: 10, travelDescription: 'Transit back to the mercenary zone.' },
        { toSectorId: 'sector-10-the-choke', passageName: 'The Breach', type: 'walking', travelMinutes: 15, encounterChance: 30, status: 'open', travelDescription: 'Squeezing through a jagged hole into the wasteland.' },
        { toSectorId: 'sector-08-tempest-co-hq', passageName: 'Service Corridor CCW', type: 'walking', travelMinutes: 15, encounterChance: 10, status: 'open', travelDescription: 'Escaping the slums for the mercenary zone.' }
      ]
    },
    {
      id: 'sector-10-the-choke',
      number: 10,
      name: 'The Choke',
      description: 'Abandoned, quarantined wasteland. Oxygen is scarce.',
      atmosphere: 'Toxic, dark, and filled with mutated biomass.',
      pageRef: 32,
      faction: 'Caliban',
      locationIds: ['loc-the-choke-main', 'loc-the-falls', 'loc-the-sink', 'loc-the-burrows', 'loc-the-heart', 'loc-the-veins'],
      sectorConnections: [
        { toSectorId: 'sector-01-dry-dock', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'blocked', blockedReason: 'Quarantined', travelDescription: 'Transit line is powered down.' },
        { toSectorId: 'sector-09-doptown', passageName: 'Blue Line Transit', type: 'transit', travelMinutes: 5, encounterChance: 5, status: 'blocked', blockedReason: 'Quarantined', travelDescription: 'The gates to Doptown are sealed.' },
        { toSectorId: 'sector-01-dry-dock', passageName: 'Service Corridor CW', type: 'walking', travelMinutes: 15, encounterChance: 25, status: 'open', travelDescription: 'A long, dangerous climb back to the ship docks.' },
        { toSectorId: 'sector-09-doptown', passageName: 'The Breach', type: 'walking', travelMinutes: 15, encounterChance: 30, status: 'open', travelDescription: 'Heading back towards the relative safety of Doptown.' }
      ]
    }
  ],
  locations: [
    // --- SECTOR 01: DRY DOCK ---
    {
      uuid: 'loc-arrival',
      sectorId: 'sector-01-dry-dock',
      name: 'Arrival Pier',
      context: 'The primary docking pier for mid-sized hulls.',
      navigationMediaBase: 'Locations/Sector01/Arrival/',
      destinationIds: ['dest-pier-01', 'dest-customs-kiosk', 'dest-security-checkpoint'],
      connections: [
        { toLocationId: 'loc-clean-room', passageName: 'Decontamination Hall', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'A long, sterile hallway lined with drains.' }
      ]
    },
    {
      uuid: 'loc-clean-room',
      sectorId: 'sector-01-dry-dock',
      name: 'Clean Room',
      context: 'Where crews are strip-searched and disinfected by Q-Teams.',
      navigationMediaBase: 'Locations/Sector01/CleanRoom/',
      destinationIds: ['dest-scanning-booth', 'dest-decon-shower', 'dest-clothing-bin'],
      connections: [
        { toLocationId: 'loc-arrival', passageName: 'Back to Pier', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'Walking back to the docking gangway.' },
        { toLocationId: 'loc-loshes-office', passageName: 'Office Door', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'locked', travelDescription: 'The dockmaster’s grease-stained door.' },
        { toLocationId: 'loc-repair-bay', passageName: 'Service Corridor', type: 'walking', travelMinutes: 5, encounterChance: 5, status: 'open', travelDescription: 'Walking towards the screeching sound of ship repairs.' },
        { toLocationId: 'loc-hangar-bay', passageName: 'Hangar Gate', type: 'walking', travelMinutes: 5, encounterChance: 5, status: 'open', travelDescription: 'Entering the massive ship storage stacks.' }
      ]
    },
    {
      uuid: 'loc-loshes-office',
      sectorId: 'sector-01-dry-dock',
      name: 'Loshe\'s Office',
      context: 'Cramped, greasy office littered with blueprints and Cadre Cola cans.',
      navigationMediaBase: 'Locations/Sector01/LoshesOffice/',
      destinationIds: ['dest-loshes-desk', 'dest-loshes-safe', 'dest-blueprint-table'],
      connections: [
        { toLocationId: 'loc-clean-room', passageName: 'Main Entrance', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Exiting back to the clean room.' }
      ]
    },
    {
      uuid: 'loc-repair-bay',
      sectorId: 'sector-01-dry-dock',
      name: 'Repair Bay',
      context: 'Huge bays where ships are held in scaffolding for overhaul.',
      navigationMediaBase: 'Locations/Sector01/RepairBay/',
      destinationIds: ['dest-scaffolding-rig', 'dest-plasma-cutter-station', 'dest-hull-plate-stack'],
      connections: [
        { toLocationId: 'loc-clean-room', passageName: 'Service Corridor', type: 'walking', travelMinutes: 5, encounterChance: 5, status: 'open', travelDescription: 'Heading back to the decontamination zone.' }
      ]
    },
    {
      uuid: 'loc-hangar-bay',
      sectorId: 'sector-01-dry-dock',
      name: 'Hangar Bay',
      context: 'The "stacks" where ships are stored via crane.',
      navigationMediaBase: 'Locations/Sector01/HangarBay/',
      destinationIds: ['dest-conquer-all', 'dest-crane-controls', 'dest-fuel-pump'],
      connections: [
        { toLocationId: 'loc-clean-room', passageName: 'Hangar Gate', type: 'walking', travelMinutes: 5, encounterChance: 5, status: 'open', travelDescription: 'Leaving the storage stacks.' }
      ]
    },

    // --- SECTOR 02: STELLAR BURN ---
    {
      uuid: 'loc-sems-bar',
      sectorId: 'sector-02-stellar-burn',
      name: 'Sem\'s Bar (Club Level)',
      context: 'The pulsing heart of Stellar Burn.',
      navigationMediaBase: 'Locations/Sector02/SemsBar/',
      destinationIds: ['dest-sems-bar-counter', 'dest-dance-floor', 'dest-sems-booth'],
      connections: [
        { toLocationId: 'loc-heaven', passageName: 'VIP Stairs', type: 'walking', travelMinutes: 1, encounterChance: 0, status: 'locked', travelDescription: 'Ascending to the upper VIP level.' },
        { toLocationId: 'loc-the-ecstacy', passageName: 'Private Lift', type: 'lift', travelMinutes: 1, encounterChance: 0, status: 'locked', travelDescription: 'A smooth lift ride down to the sub-level.' }
      ]
    },
    {
      uuid: 'loc-heaven',
      sectorId: 'sector-02-stellar-burn',
      name: 'Heaven (Upper Level)',
      context: 'VIP booths overlooking the dance floor. Novo territory.',
      navigationMediaBase: 'Locations/Sector02/Heaven/',
      destinationIds: ['dest-heaven-booth', 'dest-heaven-balcony'],
      connections: [
        { toLocationId: 'loc-sems-bar', passageName: 'Stairs', type: 'walking', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Descending back to the main club floor.' }
      ]
    },
    {
      uuid: 'loc-the-ecstacy',
      sectorId: 'sector-02-stellar-burn',
      name: 'The Ecstacy (Lower Level)',
      context: 'Indyl’s opulent and dangerous domain.',
      navigationMediaBase: 'Locations/Sector02/TheEcstacy/',
      destinationIds: ['dest-ecstacy-lounge', 'dest-indyls-office'],
      connections: [
        { toLocationId: 'loc-sems-bar', passageName: 'Lift', type: 'lift', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Returning to the club level.' }
      ]
    },

    // --- SECTOR 03: CHOP SHOP ---
    {
      uuid: 'loc-chop-shop-entrance',
      sectorId: 'sector-03-chop-shop',
      name: 'Chop Shop Entrance',
      context: 'A grime-covered entry to the cybernetic underworld.',
      navigationMediaBase: 'Locations/Sector03/Entrance/',
      destinationIds: ['dest-entrance-junk-pile', 'dest-reception-grille'],
      connections: [
        { toLocationId: 'loc-operating-theaters', passageName: 'Plastic Curtains', type: 'walking', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Passing through heavy, blood-stained plastic.' }
      ]
    },
    {
      uuid: 'loc-operating-theaters',
      sectorId: 'sector-03-chop-shop',
      name: 'Operating Theaters',
      context: 'Where the reaped cybernetics are installed.',
      navigationMediaBase: 'Locations/Sector03/OperatingTheaters/',
      destinationIds: ['dest-operating-table', 'dest-cyber-surgical-rig'],
      connections: [
        { toLocationId: 'loc-chop-shop-entrance', passageName: 'Plastic Curtains', type: 'walking', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Heading back to the entrance.' },
        { toLocationId: 'loc-recovery-room', passageName: 'Heavy Door', type: 'walking', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Stepping into the recovery ward.' },
        { toLocationId: 'loc-babushkas-room', passageName: 'Hoarded Hallway', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'locked', travelDescription: 'Winding through piles of scrap towards Babushka’s quarters.' }
      ]
    },
    {
      uuid: 'loc-recovery-room',
      sectorId: 'sector-03-chop-shop',
      name: 'Recovery Room',
      context: 'A cramped ward for post-op patients.',
      navigationMediaBase: 'Locations/Sector03/RecoveryRoom/',
      destinationIds: ['dest-recovery-bunk', 'dest-monitor-station'],
      connections: [
        { toLocationId: 'loc-operating-theaters', passageName: 'Heavy Door', type: 'walking', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Returning to the surgery area.' }
      ]
    },
    {
      uuid: 'loc-babushkas-room',
      sectorId: 'sector-03-chop-shop',
      name: 'Babushka\'s Room',
      context: 'The personal hoarded sanctum of The Babushka.',
      navigationMediaBase: 'Locations/Sector03/BabushkasRoom/',
      destinationIds: ['dest-babushkas-throne', 'dest-scrap-mountain'],
      connections: [
        { toLocationId: 'loc-operating-theaters', passageName: 'Hallway', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'Heading back to the theaters.' },
        { toLocationId: 'loc-sycorax-stash', passageName: 'Vent Access', type: 'shaft', travelMinutes: 2, encounterChance: 0, status: 'hidden', requiredSkill: 'Engineering', travelDescription: 'A hidden crawlspace behind a heavy chest.' }
      ]
    },
    {
      uuid: 'loc-sycorax-stash',
      sectorId: 'sector-03-chop-shop',
      name: 'Sycorax Stash',
      context: 'Hidden cache of high-end cybernetics.',
      navigationMediaBase: 'Locations/Sector03/SycoraxStash/',
      destinationIds: ['dest-stash-box', 'dest-prototype-rack'],
      connections: [
        { toLocationId: 'loc-babushkas-room', passageName: 'Vent Access', type: 'shaft', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Crawling back to Babushka’s room.' }
      ]
    },

    // --- SECTOR 04: THE ICE BOX ---
    {
      uuid: 'loc-slickbays',
      sectorId: 'sector-04-the-ice-box',
      name: 'Slickbays',
      context: 'Sterile chambers for slickware installation.',
      navigationMediaBase: 'Locations/Sector04/Slickbays/',
      destinationIds: ['dest-slick-pod', 'dest-neuro-terminal'],
      connections: [
        { toLocationId: 'loc-the-stacks', passageName: 'Corridor A1', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Walking through a cold, white corridor.' }
      ]
    },
    {
      uuid: 'loc-the-stacks',
      sectorId: 'sector-04-the-ice-box',
      name: 'The Stacks (Cryo)',
      context: 'Storage for sleeves in cryo-stasis.',
      navigationMediaBase: 'Locations/Sector04/TheStacks/',
      destinationIds: ['dest-cryo-vault', 'dest-sleeving-crane'],
      connections: [
        { toLocationId: 'loc-slickbays', passageName: 'Corridor A1', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Heading back to the slickbays.' },
        { toLocationId: 'loc-nemo-machine', passageName: 'Secure Gate', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'locked', travelDescription: 'Approaching the heavily guarded re-sleeving terminal.' }
      ]
    },
    {
      uuid: 'loc-nemo-machine',
      sectorId: 'sector-04-the-ice-box',
      name: 'Nemo Machine',
      context: 'The advanced interface for soul-transfer.',
      navigationMediaBase: 'Locations/Sector04/NemoMachine/',
      destinationIds: ['dest-nemo-terminal', 'dest-soul-buffer'],
      connections: [
        { toLocationId: 'loc-the-stacks', passageName: 'Secure Gate', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'Exiting back to the cryo-vaults.' }
      ]
    },

    // --- SECTOR 05: THE FARM ---
    {
      uuid: 'loc-farm-processing',
      sectorId: 'sector-05-the-farm',
      name: 'Farm Processing',
      context: 'Industrial hub for nutrient paste production.',
      navigationMediaBase: 'Locations/Sector05/Processing/',
      destinationIds: ['dest-paste-vats', 'dest-bottling-line'],
      connections: [
        { toLocationId: 'loc-the-aarnivalkea', passageName: 'Garden Path', type: 'walking', travelMinutes: 10, encounterChance: 5, status: 'open', travelDescription: 'A pleasant walk through hydroponic rows.' }
      ]
    },
    {
      uuid: 'loc-the-aarnivalkea',
      sectorId: 'sector-05-the-farm',
      name: 'The Aarnivalkea',
      context: 'The Solarian Church\'s botanical sanctuary.',
      navigationMediaBase: 'Locations/Sector05/Aarnivalkea/',
      destinationIds: ['dest-solarian-altar', 'dest-meditation-fountain'],
      connections: [
        { toLocationId: 'loc-farm-processing', passageName: 'Garden Path', type: 'walking', travelMinutes: 10, encounterChance: 5, status: 'open', travelDescription: 'Heading back to processing.' },
        { toLocationId: 'loc-farm-two', passageName: 'Service Lift', type: 'lift', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Taking a lift to the lower growing levels.' }
      ]
    },
    {
      uuid: 'loc-farm-two',
      sectorId: 'sector-05-the-farm',
      name: 'Farm Two',
      context: 'Lower growing level, more rugged and industrial.',
      navigationMediaBase: 'Locations/Sector05/FarmTwo/',
      destinationIds: ['dest-nutrient-shack', 'dest-algae-tank'],
      connections: [
        { toLocationId: 'loc-the-aarnivalkea', passageName: 'Service Lift', type: 'lift', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Returning to the sanctuary level.' }
      ]
    },

    // --- SECTOR 06: CANYONHEAVY.MARKET ---
    {
      uuid: 'loc-the-battlestations',
      sectorId: 'sector-06-canyonheavy-market',
      name: 'The Battlestations',
      context: 'Main hub of DEKALOG activity.',
      navigationMediaBase: 'Locations/Sector06/Battlestations/',
      destinationIds: ['dest-hacking-rig', 'dest-coffee-pot'],
      connections: [
        { toLocationId: 'loc-angus-office', passageName: 'Server Corridor', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'locked', travelDescription: 'A short walk to Angus’ private quarters.' },
        { toLocationId: 'loc-server-farm', passageName: 'Cooling Tunnel', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'Walking through a tunnel of blowing cold air.' }
      ]
    },
    {
      uuid: 'loc-angus-office',
      sectorId: 'sector-06-canyonheavy-market',
      name: 'Angus\' Office',
      context: 'The cluttered, secure den of the lead hacker.',
      navigationMediaBase: 'Locations/Sector06/AngusOffice/',
      destinationIds: ['dest-angus-terminal', 'dest-angus-secret-safe'],
      connections: [
        { toLocationId: 'loc-the-battlestations', passageName: 'Server Corridor', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Exiting back to the main hub.' }
      ]
    },
    {
      uuid: 'loc-server-farm',
      sectorId: 'sector-06-canyonheavy-market',
      name: 'Server Farm',
      context: 'Endless racks of humming processors.',
      navigationMediaBase: 'Locations/Sector06/ServerFarm/',
      destinationIds: ['dest-main-frame', 'dest-cooling-unit'],
      connections: [
        { toLocationId: 'loc-the-battlestations', passageName: 'Cooling Tunnel', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'Returning to the battlestations.' },
        { toLocationId: 'loc-data-vault', passageName: 'Biometric Gate', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'locked', travelDescription: 'Approaching the high-security vault.' }
      ]
    },
    {
      uuid: 'loc-data-vault',
      sectorId: 'sector-06-canyonheavy-market',
      name: 'Data Vault',
      context: 'Physical storage for the station\'s most sensitive secrets.',
      navigationMediaBase: 'Locations/Sector06/DataVault/',
      destinationIds: ['dest-physical-drives', 'dest-gold-disk'],
      connections: [
        { toLocationId: 'loc-server-farm', passageName: 'Biometric Gate', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Exiting the vault.' }
      ]
    },

    // --- SECTOR 07: THE COURT ---
    {
      uuid: 'loc-the-pit',
      sectorId: 'sector-07-the-court',
      name: 'The Pit',
      context: 'The blood-stained arena for dispute resolution.',
      navigationMediaBase: 'Locations/Sector07/ThePit/',
      destinationIds: ['dest-pit-center', 'dest-spectator-rails'],
      connections: [
        { toLocationId: 'loc-the-bench', passageName: 'Judges\' Walk', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'locked', travelDescription: 'Ascending to the adjudication balcony.' },
        { toLocationId: 'loc-the-holding-cells', passageName: 'Security Tunnel', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'The dark tunnel leading to the cells.' }
      ]
    },
    {
      uuid: 'loc-the-bench',
      sectorId: 'sector-07-the-court',
      name: 'The Bench',
      context: 'Where the Adjudicators oversee the Pit.',
      navigationMediaBase: 'Locations/Sector07/TheBench/',
      destinationIds: ['dest-adjudicator-chair', 'dest-gavel-station'],
      connections: [
        { toLocationId: 'loc-the-pit', passageName: 'Judges\' Walk', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Descending back to the arena floor.' },
        { toLocationId: 'loc-brunhildhs-quarters', passageName: 'Private Hall', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'locked', travelDescription: 'A secure passage to Brunhildh’s sanctum.' }
      ]
    },
    {
      uuid: 'loc-the-holding-cells',
      sectorId: 'sector-07-the-court',
      name: 'Holding Cells',
      context: 'Where gladiators and debtors wait for their turn.',
      navigationMediaBase: 'Locations/Sector07/HoldingCells/',
      destinationIds: ['dest-cell-04', 'dest-guard-station'],
      connections: [
        { toLocationId: 'loc-the-pit', passageName: 'Security Tunnel', type: 'walking', travelMinutes: 2, encounterChance: 0, status: 'open', travelDescription: 'Returning to the Pit entrance.' }
      ]
    },
    {
      uuid: 'loc-brunhildhs-quarters',
      sectorId: 'sector-07-the-court',
      name: 'Brunhildh\'s Quarters',
      context: 'Opulent, minimalist living space for the station judge.',
      navigationMediaBase: 'Locations/Sector07/BrunhildhQuarters/',
      destinationIds: ['dest-brunhildh-bed', 'dest-brunhildh-shrine'],
      connections: [
        { toLocationId: 'loc-the-bench', passageName: 'Private Hall', type: 'walking', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'Exiting back to the Bench.' }
      ]
    },

    // --- SECTOR 08: TEMPEST CO. HQ ---
    {
      uuid: 'loc-armament-level',
      sectorId: 'sector-08-tempest-co-hq',
      name: 'Armament Level',
      context: 'The main armory and weapon testing range.',
      navigationMediaBase: 'Locations/Sector08/Armament/',
      destinationIds: ['dest-firing-range', 'dest-gun-rack'],
      connections: [
        { toLocationId: 'loc-operations-level', passageName: 'Command Lift', type: 'lift', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Taking the lift to the operations deck.' }
      ]
    },
    {
      uuid: 'loc-operations-level',
      sectorId: 'sector-08-tempest-co-hq',
      name: 'Operations Level',
      context: 'Strategic command for Tempest operations.',
      navigationMediaBase: 'Locations/Sector08/Operations/',
      destinationIds: ['dest-tactical-map', 'dest-comms-hub'],
      connections: [
        { toLocationId: 'loc-armament-level', passageName: 'Command Lift', type: 'lift', travelMinutes: 1, encounterChance: 0, status: 'open', travelDescription: 'Descending back to the armory.' },
        { toLocationId: 'loc-cutters-mansion', passageName: 'Garden Bridge', type: 'walking', travelMinutes: 10, encounterChance: 0, status: 'locked', travelDescription: 'A pressurized bridge leading to the mansion.' }
      ]
    },
    {
      uuid: 'loc-cutters-mansion',
      sectorId: 'sector-08-tempest-co-hq',
      name: 'Cutter\'s Mansion',
      context: 'The extreme luxury home of the Tempest CEO.',
      navigationMediaBase: 'Locations/Sector08/CuttersMansion/',
      destinationIds: ['dest-cutters-safe', 'dest-art-gallery'],
      connections: [
        { toLocationId: 'loc-operations-level', passageName: 'Garden Bridge', type: 'walking', travelMinutes: 10, encounterChance: 0, status: 'open', travelDescription: 'Returning to HQ.' },
        { toLocationId: 'loc-sublevel-c', passageName: 'Secret Elevator', type: 'lift', travelMinutes: 5, encounterChance: 0, status: 'hidden', travelDescription: 'A hidden elevator descending into the bowels of the station.' }
      ]
    },
    {
      uuid: 'loc-sublevel-c',
      sectorId: 'sector-08-tempest-co-hq',
      name: 'Sublevel C',
      context: 'Confidential research and containment level.',
      navigationMediaBase: 'Locations/Sector08/SublevelC/',
      destinationIds: ['dest-containment-unit', 'dest-specimen-vial'],
      connections: [
        { toLocationId: 'loc-cutters-mansion', passageName: 'Secret Elevator', type: 'lift', travelMinutes: 5, encounterChance: 0, status: 'open', travelDescription: 'Ascending back to the mansion.' }
      ]
    },

    // --- SECTOR 09: DOPTOWN ---
    {
      uuid: 'loc-doptown-main',
      sectorId: 'sector-09-doptown',
      name: 'Doptown Main',
      context: 'The central square of the debtor’s slum.',
      navigationMediaBase: 'Locations/Sector09/Main/',
      destinationIds: ['dest-soup-kitchen', 'dest-public-spigot'],
      connections: [
        { toLocationId: 'loc-the-airlock', passageName: 'Heavy Grate', type: 'walking', travelMinutes: 5, encounterChance: 10, status: 'open', travelDescription: 'Walking towards the main exit gate.' },
        { toLocationId: 'loc-the-warrens', passageName: 'Slum Alley', type: 'walking', travelMinutes: 10, encounterChance: 20, status: 'open', travelDescription: 'Heading into the dense, dark residential shacks.' }
      ]
    },
    {
      uuid: 'loc-the-airlock',
      sectorId: 'sector-09-doptown',
      name: 'The Airlock',
      context: 'The only formal entry/exit for Doptown, heavily guarded.',
      navigationMediaBase: 'Locations/Sector09/Airlock/',
      destinationIds: ['dest-airlock-control', 'dest-guard-pod'],
      connections: [
        { toLocationId: 'loc-doptown-main', passageName: 'Heavy Grate', type: 'walking', travelMinutes: 5, encounterChance: 5, status: 'open', travelDescription: 'Entering the slum.' }
      ]
    },
    {
      uuid: 'loc-the-warrens',
      sectorId: 'sector-09-doptown',
      name: 'The Warrens',
      context: 'Dense, labyrinthine shantytown.',
      navigationMediaBase: 'Locations/Sector09/Warrens/',
      destinationIds: ['dest-makeshift-bunk', 'dest-hidden-still'],
      connections: [
        { toLocationId: 'loc-doptown-main', passageName: 'Slum Alley', type: 'walking', travelMinutes: 10, encounterChance: 10, status: 'open', travelDescription: 'Back to the main square.' },
        { toLocationId: 'loc-hollow-core', passageName: 'Floor Hatch', type: 'shaft', travelMinutes: 2, encounterChance: 5, status: 'hidden', travelDescription: 'A hidden hatch leading into the station structural core.' }
      ]
    },
    {
      uuid: 'loc-hollow-core',
      sectorId: 'sector-09-doptown',
      name: 'Hollow Core',
      context: 'Structural empty spaces used for smuggling.',
      navigationMediaBase: 'Locations/Sector09/HollowCore/',
      destinationIds: ['dest-smugglers-stash', 'dest-gravity-well'],
      connections: [
        { toLocationId: 'loc-the-warrens', passageName: 'Floor Hatch', type: 'shaft', travelMinutes: 2, encounterChance: 5, status: 'open', travelDescription: 'Climbing back up to the Warrens.' }
      ]
    },

    // --- SECTOR 10: THE CHOKE & THE VEINS ---
    {
      uuid: 'loc-the-veins',
      sectorId: 'sector-10-the-choke',
      name: 'The Veins',
      context: 'Hidden maintenance network leading all over the station.',
      navigationMediaBase: 'Locations/Sector10/TheVeins/',
      destinationIds: ['dest-veins-hub', 'dest-junction-box'],
      connections: [
        { toLocationId: 'loc-arrival', passageName: 'Vent to Dry Dock', type: 'shaft', travelMinutes: 60, encounterChance: 30, status: 'hidden', requiredSkill: 'Engineering', travelDescription: 'A narrow, grimey crawl to the ship docks.' },
        { toLocationId: 'loc-sems-bar', passageName: 'Vent to Stellar Burn', type: 'shaft', travelMinutes: 60, encounterChance: 30, status: 'hidden', requiredSkill: 'Engineering', travelDescription: 'Crawling towards the muffled bass of the club.' },
        { toLocationId: 'loc-the-choke-main', passageName: 'Drainage Pipe', type: 'walking', travelMinutes: 30, encounterChance: 40, status: 'open', travelDescription: 'Exiting into the sunken city of The Choke.' }
      ]
    },
    {
      uuid: 'loc-the-choke-main',
      sectorId: 'sector-10-the-choke',
      name: 'The Choke Main',
      context: 'The main abandoned plaza of the Choke.',
      navigationMediaBase: 'Locations/Sector10/Main/',
      destinationIds: ['dest-choke-statue', 'dest-fountain-of-tears'],
      connections: [
        { toLocationId: 'loc-the-falls', passageName: 'The Slippery Climb', type: 'walking', travelMinutes: 120, encounterChance: 50, status: 'open', travelDescription: 'A treacherous climb up the toxic waterfall.' },
        { toLocationId: 'loc-the-veins', passageName: 'Drainage Pipe', type: 'walking', travelMinutes: 30, encounterChance: 20, status: 'open', travelDescription: 'Entering the maintenance network.' }
      ]
    },
    {
      uuid: 'loc-the-falls',
      sectorId: 'sector-10-the-choke',
      name: 'The Falls',
      context: 'A vertical cascades of sewage and coolant.',
      navigationMediaBase: 'Locations/Sector10/TheFalls/',
      destinationIds: ['dest-falls-ledge', 'dest-clogged-grate'],
      connections: [
        { toLocationId: 'loc-the-choke-main', passageName: 'Descent', type: 'walking', travelMinutes: 60, encounterChance: 30, status: 'open', travelDescription: 'Carefully climbing back down to the plaza.' },
        { toLocationId: 'loc-the-sink', passageName: 'Upper Pipe', type: 'walking', travelMinutes: 60, encounterChance: 40, status: 'open', travelDescription: 'Heading deeper into the radioactive zone.' }
      ]
    },
    {
      uuid: 'loc-the-sink',
      sectorId: 'sector-10-the-choke',
      name: 'The Sink',
      context: 'A massive industrial drainage basin.',
      navigationMediaBase: 'Locations/Sector10/TheSink/',
      destinationIds: ['dest-sink-basin', 'dest-rust-island'],
      connections: [
        { toLocationId: 'loc-the-falls', passageName: 'Lower Pipe', type: 'walking', travelMinutes: 60, encounterChance: 40, status: 'open', travelDescription: 'Returning to the toxic falls.' },
        { toLocationId: 'loc-the-burrows', passageName: 'Deep Vein', type: 'walking', travelMinutes: 180, encounterChance: 60, status: 'hidden', travelDescription: 'A long, dark trek into the heart of the infestation.' }
      ]
    },
    {
      uuid: 'loc-the-burrows',
      sectorId: 'sector-10-the-choke',
      name: 'The Burrows',
      context: 'Tight, organic tunnels formed by the infestation.',
      navigationMediaBase: 'Locations/Sector10/Burrows/',
      destinationIds: ['dest-nest-01', 'dest-human-remains'],
      connections: [
        { toLocationId: 'loc-the-sink', passageName: 'Deep Vein', type: 'walking', travelMinutes: 180, encounterChance: 40, status: 'open', travelDescription: 'Heading back towards the sink.' },
        { toLocationId: 'loc-the-heart', passageName: 'Throbbing Tunnel', type: 'walking', travelMinutes: 60, encounterChance: 80, status: 'locked', travelDescription: 'Approaching the pulsating center of the biomass.' }
      ]
    },
    {
      uuid: 'loc-the-heart',
      sectorId: 'sector-10-the-choke',
      name: 'The Heart',
      context: 'The core of the Caliban infestation.',
      navigationMediaBase: 'Locations/Sector10/Heart/',
      destinationIds: ['dest-caliban-core', 'dest-recycled-souls'],
      connections: [
        { toLocationId: 'loc-the-burrows', passageName: 'Throbbing Tunnel', type: 'walking', travelMinutes: 60, encounterChance: 20, status: 'open', travelDescription: 'Leaving the heart of the beast.' }
      ]
    }
  ],
  destinations: [
    // --- SECTOR 01: DRY DOCK ---
    {
      uuid: 'dest-pier-01',
      locationId: 'loc-arrival',
      name: 'Pier 01 Gangway',
      context: 'The main umbilical cord for incoming ships.',
      navigationMediaBase: 'Locations/Sector01/Arrival/Destinations/Pier01/',
      narrative: 'Metal clangs as the gangway seals. Smells of recirculated air and ship exhaust.',
      connections: []
    },
    {
      uuid: 'dest-customs-kiosk',
      locationId: 'loc-arrival',
      name: 'Customs Kiosk',
      context: 'A flicker screen and biometric scanner for new arrivals.',
      navigationMediaBase: 'Locations/Sector01/Arrival/Destinations/CustomsKiosk/',
      narrative: 'The machine beeps impatiently. A mechanical voice demands your manifest.',
      connections: []
    },
    {
      uuid: 'dest-security-checkpoint',
      locationId: 'loc-arrival',
      name: 'Security Checkpoint',
      context: 'A station where Teamster guards lounge and watch monitors.',
      navigationMediaBase: 'Locations/Sector01/Arrival/Destinations/Security/',
      narrative: 'Two guards in dirty coveralls eye you lazily over their Cadre Colas.',
      connections: []
    },
    {
      uuid: 'dest-scanning-booth',
      locationId: 'loc-clean-room',
      name: 'Scanning Booth',
      context: 'A high-intensity X-ray and biological scanner.',
      navigationMediaBase: 'Locations/Sector01/CleanRoom/Destinations/Scanner/',
      narrative: 'The blue light washes over you, huming at a frequency that makes your teeth itch.',
      connections: []
    },
    {
      uuid: 'dest-decon-shower',
      locationId: 'loc-clean-room',
      name: 'Decon Shower',
      context: 'Heavy nozzles that spray chemical disinfectant.',
      navigationMediaBase: 'Locations/Sector01/CleanRoom/Destinations/Shower/',
      narrative: 'Cold, stinging mist blasts you from all sides. It smells of bleach and ozone.',
      connections: []
    },
    {
      uuid: 'dest-clothing-bin',
      locationId: 'loc-clean-room',
      name: 'Clothing Bin',
      context: 'A heavy metal bin for contaminated gear.',
      navigationMediaBase: 'Locations/Sector01/CleanRoom/Destinations/Bin/',
      narrative: 'A pile of discarded, oily jumpsuits sits at the bottom of the bin.',
      connections: []
    },
    {
      uuid: 'dest-loshes-desk',
      locationId: 'loc-loshes-office',
      name: 'Loshe\'s Desk',
      context: 'The center of operations for the Dry Dock.',
      navigationMediaBase: 'Locations/Sector01/LoshesOffice/Destinations/LoshesDesk/',
      narrative: 'A heavy desk piled with manifest printouts and half-empty cola cans.',
      connections: []
    },
    {
      uuid: 'dest-loshes-safe',
      locationId: 'loc-loshes-office',
      name: 'Loshe\'s Private Safe',
      context: 'A heavy, wall-mounted safe with a combination dial.',
      navigationMediaBase: 'Locations/Sector01/LoshesOffice/Destinations/Safe/',
      narrative: 'A sturdy iron box bolted to the deck. Loshe keeps his "special" manifests here.',
      connections: []
    },
    {
      uuid: 'dest-blueprint-table',
      locationId: 'loc-loshes-office',
      name: 'Blueprint Table',
      context: 'A light-table showing messy station schematics.',
      navigationMediaBase: 'Locations/Sector01/LoshesOffice/Destinations/Blueprints/',
      narrative: 'Tattered papers showing the station\'s structural layout, marked with red ink.',
      connections: []
    },
    {
      uuid: 'dest-scaffolding-rig',
      locationId: 'loc-repair-bay',
      name: 'Scaffolding Rig',
      context: 'A moveable structure for reaching the upper hull.',
      navigationMediaBase: 'Locations/Sector01/RepairBay/Destinations/Scaffolding/',
      narrative: 'The metal frame groans as it moves along its ceiling tracks.',
      connections: []
    },
    {
      uuid: 'dest-plasma-cutter-station',
      locationId: 'loc-repair-bay',
      name: 'Plasma Cutter Station',
      context: 'A rack of heavy-duty welding and cutting tools.',
      navigationMediaBase: 'Locations/Sector01/RepairBay/Destinations/CutterStation/',
      narrative: 'Hoses snake across the floor to a set of glowing, high-energy torches.',
      connections: []
    },
    {
      uuid: 'dest-hull-plate-stack',
      locationId: 'loc-repair-bay',
      name: 'Hull Plate Stack',
      context: 'Heaps of raw steel plating for ship repairs.',
      navigationMediaBase: 'Locations/Sector01/RepairBay/Destinations/Plates/',
      narrative: 'Massive slabs of battleship-grade steel, ready to be bolted onto a hull.',
      connections: []
    },
    {
      uuid: 'dest-conquer-all',
      locationId: 'loc-hangar-bay',
      name: 'The Conquer All',
      context: 'Reidmar\'s personal ship, undergoing retrofit.',
      navigationMediaBase: 'Locations/Sector01/HangarBay/Destinations/ConquerAll/',
      narrative: 'A rugged freighter with countless patches. It looks ready for a fight.',
      connections: []
    },
    {
      uuid: 'dest-crane-controls',
      locationId: 'loc-hangar-bay',
      name: 'Crane Controls',
      context: 'A joystick-and-screen terminal for ship handling.',
      navigationMediaBase: 'Locations/Sector01/HangarBay/Destinations/Crane/',
      narrative: 'A greasy terminal used to move multi-ton ships like toys.',
      connections: []
    },
    {
      uuid: 'dest-fuel-pump',
      locationId: 'loc-hangar-bay',
      name: 'Fuel Pump',
      context: 'A heavy-duty nozzle for hydrogen or isotope fuel.',
      navigationMediaBase: 'Locations/Sector01/HangarBay/Destinations/Fuel/',
      narrative: 'The pump vibrates with the pressure of liquid fuel flowing through its veins.',
      connections: []
    },

    // --- SECTOR 02: STELLAR BURN ---
    {
      uuid: 'dest-sems-bar-counter',
      locationId: 'loc-sems-bar',
      name: 'Sem\'s Bar Counter',
      context: 'The main service area of Sem\'s Bar.',
      navigationMediaBase: 'Locations/Sector02/SemsBar/Destinations/Counter/',
      narrative: 'The counter is sticky and the music is loud. Sem is polishing a glass with a dirty rag.',
      connections: []
    },
    {
      uuid: 'dest-dance-floor',
      locationId: 'loc-sems-bar',
      name: 'Dance Floor',
      context: 'A pulsing zone of strobe lights and loud bass.',
      navigationMediaBase: 'Locations/Sector02/SemsBar/Destinations/DanceFloor/',
      narrative: 'Bodies sway in the rhythmic gloom, illuminated by periodic flashes of neon.',
      connections: []
    },
    {
      uuid: 'dest-sems-booth',
      locationId: 'loc-sems-bar',
      name: 'Private Booth',
      context: 'A dark corner booth with synthetic leather seats.',
      navigationMediaBase: 'Locations/Sector02/SemsBar/Destinations/Booth/',
      narrative: 'The smells of stale smoke and expensive spirits linger in the shadows here.',
      connections: []
    },
    {
      uuid: 'dest-heaven-booth',
      locationId: 'loc-heaven',
      name: 'VIP Booth',
      context: 'An elevated seating area for the station\'s elite.',
      navigationMediaBase: 'Locations/Sector02/Heaven/Destinations/VIPBooth/',
      narrative: 'A plush, white leather booth overlooking the chaos of the dance floor below.',
      connections: []
    },
    {
      uuid: 'dest-heaven-balcony',
      locationId: 'loc-heaven',
      name: 'Observation Balcony',
      context: 'A railing looking over the club floor.',
      navigationMediaBase: 'Locations/Sector02/Heaven/Destinations/Balcony/',
      narrative: 'From here, the entire Stellar Burn district looks like a sea of light and noise.',
      connections: []
    },
    {
      uuid: 'dest-ecstacy-lounge',
      locationId: 'loc-the-ecstacy',
      name: 'Lounge Area',
      context: 'Indyl\'s opulent and dangerous domain.',
      navigationMediaBase: 'Locations/Sector02/TheEcstacy/Destinations/Lounge/',
      narrative: 'Expensive silk pillows and golden hookahs decorate this decadent sub-level.',
      connections: []
    },
    {
      uuid: 'dest-indyls-office',
      locationId: 'loc-the-ecstacy',
      name: 'Indyl\'s Sanctum',
      context: 'A private office behind a heavy, carved door.',
      navigationMediaBase: 'Locations/Sector02/TheEcstacy/Destinations/IndylsOffice/',
      narrative: 'The office is silent, smelling of expensive sandalwood and cold power.',
      connections: []
    },

    // --- SECTOR 03: CHOP SHOP ---
    {
      uuid: 'dest-entrance-junk-pile',
      locationId: 'loc-chop-shop-entrance',
      name: 'Junk Pile',
      context: 'A massive heap of discarded and broken cybernetics.',
      navigationMediaBase: 'Locations/Sector03/Entrance/Destinations/JunkPile/',
      narrative: 'Rusted arms, shattered optics, and tangled wires form a jagged metal hill.',
      connections: []
    },
    {
      uuid: 'dest-reception-grille',
      locationId: 'loc-chop-shop-entrance',
      name: 'Reception Grille',
      context: 'A small sliding window for checking in patients.',
      navigationMediaBase: 'Locations/Sector03/Entrance/Destinations/Reception/',
      narrative: 'A dirty piece of plexiglass with a voice box. "Payment up front," a raspy voice croaks.',
      connections: []
    },
    {
      uuid: 'dest-operating-table',
      locationId: 'loc-operating-theaters',
      name: 'Operating Table',
      context: 'A cold, metal table with leather straps.',
      navigationMediaBase: 'Locations/Sector03/OperatingTheaters/Destinations/Table/',
      narrative: 'Dried blood stains the edges of the table. A rusty circular saw hangs nearby.',
      connections: []
    },
    {
      uuid: 'dest-cyber-surgical-rig',
      locationId: 'loc-operating-theaters',
      name: 'Surgical Rig',
      context: 'A set of robotic arms with precise cutting tools.',
      navigationMediaBase: 'Locations/Sector03/OperatingTheaters/Destinations/Rig/',
      narrative: 'The arms twitch occasionally, their sensors searching for fresh flesh to cut.',
      connections: []
    },
    {
      uuid: 'dest-recovery-bunk',
      locationId: 'loc-recovery-room',
      name: 'Recovery Bunk',
      context: 'A dirty mattress with a heart rate monitor.',
      navigationMediaBase: 'Locations/Sector03/RecoveryRoom/Destinations/Bunk/',
      narrative: 'A thin, blood-stained sheet covers a worn-out mattress.',
      connections: []
    },
    {
      uuid: 'dest-monitor-station',
      locationId: 'loc-recovery-room',
      name: 'Monitor Station',
      context: 'A flickering screen showing the vitals of several patients.',
      navigationMediaBase: 'Locations/Sector03/RecoveryRoom/Destinations/Monitor/',
      narrative: 'Green lines jump erratically across the dark screen, tracking fading pulses.',
      connections: []
    },
    {
      uuid: 'dest-babushkas-throne',
      locationId: 'loc-babushkas-room',
      name: 'Babushka\'s Throne',
      context: 'A high-backed chair made of scrap and wires.',
      navigationMediaBase: 'Locations/Sector03/BabushkasRoom/Destinations/Throne/',
      narrative: 'The Babushka sits here, surrounded by her hoard, watching the cameras.',
      connections: []
    },
    {
      uuid: 'dest-scrap-mountain',
      locationId: 'loc-babushkas-room',
      name: 'Scrap Mountain',
      context: 'Piles of high-value salvaged electronics.',
      navigationMediaBase: 'Locations/Sector03/BabushkasRoom/Destinations/Scrap/',
      narrative: 'Rare circuit boards and antique processors are buried under layers of dust.',
      connections: []
    },
    {
      uuid: 'dest-stash-box',
      locationId: 'loc-sycorax-stash',
      name: 'Sycorax Stash Box',
      context: 'A secure, military-grade container.',
      navigationMediaBase: 'Locations/Sector03/SycoraxStash/Destinations/StashBox/',
      narrative: 'A black polymer box with a numeric keypad. It looks untouched by time.',
      connections: []
    },
    {
      uuid: 'dest-prototype-rack',
      locationId: 'loc-sycorax-stash',
      name: 'Prototype Rack',
      context: 'Several glowing tubes containing advanced cybermods.',
      navigationMediaBase: 'Locations/Sector03/SycoraxStash/Destinations/Prototypes/',
      narrative: 'The mods inside pulse with a soft, blue light, waiting for a host.',
      connections: []
    },

    // --- SECTOR 04: THE ICE BOX ---
    {
      uuid: 'dest-slick-pod',
      locationId: 'loc-slickbays',
      name: 'Slickware Pod',
      context: 'A coffin-like unit for neuro-installation.',
      navigationMediaBase: 'Locations/Sector04/Slickbays/Destinations/Pod/',
      narrative: 'The interior is padded and filled with fiber-optic probes.',
      connections: []
    },
    {
      uuid: 'dest-neuro-terminal',
      locationId: 'loc-slickbays',
      name: 'Neuro-Terminal',
      context: 'A high-speed data interface for brain-mapping.',
      navigationMediaBase: 'Locations/Sector04/Slickbays/Destinations/Terminal/',
      narrative: 'Multiple cables hang from the ceiling, tipped with neural-link needles.',
      connections: []
    },
    {
      uuid: 'dest-cryo-vault',
      locationId: 'loc-the-stacks',
      name: 'Cryo Vault',
      context: 'A massive vertical storage for frozen bodies.',
      navigationMediaBase: 'Locations/Sector04/TheStacks/Destinations/Vault/',
      narrative: 'Row after row of frosted glass canisters stretch into the dark.',
      connections: []
    },
    {
      uuid: 'dest-sleeving-crane',
      locationId: 'loc-the-stacks',
      name: 'Sleeving Crane',
      context: 'A robotic arm for retrieving cryo-pods.',
      navigationMediaBase: 'Locations/Sector04/TheStacks/Destinations/Crane/',
      narrative: 'The crane moves silently on magnetic rails, its claws ready to grab a sleeve.',
      connections: []
    },
    {
      uuid: 'dest-nemo-terminal',
      locationId: 'loc-nemo-machine',
      name: 'Nemo Interface',
      context: 'The advanced terminal for the re-sleeving process.',
      navigationMediaBase: 'Locations/Sector04/NemoMachine/Destinations/Interface/',
      narrative: 'A glowing, circular screen that displays complex soul-wave patterns.',
      connections: []
    },
    {
      uuid: 'dest-soul-buffer',
      locationId: 'loc-nemo-machine',
      name: 'Soul Buffer Unit',
      context: 'A high-capacity data core for temporary soul storage.',
      navigationMediaBase: 'Locations/Sector04/NemoMachine/Destinations/Buffer/',
      narrative: 'The unit hums with the energy of a thousand digitized minds.',
      connections: []
    },

    // --- SECTOR 05: THE FARM ---
    {
      uuid: 'dest-paste-vats',
      locationId: 'loc-farm-processing',
      name: 'Nutrient Vats',
      context: 'Huge tanks of bubbling grey paste.',
      navigationMediaBase: 'Locations/Sector05/Processing/Destinations/Vats/',
      narrative: 'The smell is vaguely like wet cardboard and protein.',
      connections: []
    },
    {
      uuid: 'dest-bottling-line',
      locationId: 'loc-farm-processing',
      name: 'Bottling Line',
      context: 'A clattering conveyor belt for nutrient canisters.',
      navigationMediaBase: 'Locations/Sector05/Processing/Destinations/Bottling/',
      narrative: 'Mechanical arms rapidly fill and seal thousands of grey canisters.',
      connections: []
    },
    {
      uuid: 'dest-solarian-altar',
      locationId: 'loc-the-aarnivalkea',
      name: 'Solarian Altar',
      context: 'A crystalline structure under the brightest artificial sun.',
      navigationMediaBase: 'Locations/Sector05/Aarnivalkea/Destinations/Altar/',
      narrative: 'The light here is warm and blinding, a rare comfort on the station.',
      connections: []
    },
    {
      uuid: 'dest-meditation-fountain',
      locationId: 'loc-the-aarnivalkea',
      name: 'Meditation Fountain',
      context: 'A slow trickle of recycled water over smooth stones.',
      navigationMediaBase: 'Locations/Sector05/Aarnivalkea/Destinations/Fountain/',
      narrative: 'The sound of water is a rare luxury in this mechanical wasteland.',
      connections: []
    },
    {
      uuid: 'dest-nutrient-shack',
      locationId: 'loc-farm-two',
      name: 'Nutrient Shack',
      context: 'A small hut for the farm workers.',
      navigationMediaBase: 'Locations/Sector05/FarmTwo/Destinations/Shack/',
      narrative: 'A simple dwelling made of repurposed hull plating and plastic tarps.',
      connections: []
    },
    {
      uuid: 'dest-algae-tank',
      locationId: 'loc-farm-two',
      name: 'Algae Tank',
      context: 'A glowing green pool for oxygen production.',
      navigationMediaBase: 'Locations/Sector05/FarmTwo/Destinations/Algae/',
      narrative: 'The water is thick with bioluminescent green sludge.',
      connections: []
    },

    // --- SECTOR 06: CANYONHEAVY.MARKET ---
    {
      uuid: 'dest-hacking-rig',
      locationId: 'loc-the-battlestations',
      name: 'DEKALOG Rig',
      context: 'A zero-g chair surrounded by holographic screens.',
      navigationMediaBase: 'Locations/Sector06/Battlestations/Destinations/Rig/',
      narrative: 'Streams of data flow past the user in a dizzying neon storm.',
      connections: []
    },
    {
      uuid: 'dest-coffee-pot',
      locationId: 'loc-the-battlestations',
      name: 'Synthesized Coffee Pot',
      context: 'A lone, battered appliance in the corner.',
      navigationMediaBase: 'Locations/Sector06/Battlestations/Destinations/Coffee/',
      narrative: 'It smells of burnt beans and desperation.',
      connections: []
    },
    {
      uuid: 'dest-angus-terminal',
      locationId: 'loc-angus-office',
      name: 'Angus\' Terminal',
      context: 'The main command terminal for the market.',
      navigationMediaBase: 'Locations/Sector06/AngusOffice/Destinations/Terminal/',
      narrative: 'A vintage keyboard and a massive ultra-wide screen showing everything.',
      connections: []
    },
    {
      uuid: 'dest-angus-secret-safe',
      locationId: 'loc-angus-office',
      name: 'Secret Floor Safe',
      context: 'Hidden beneath a loose floor panel.',
      navigationMediaBase: 'Locations/Sector06/AngusOffice/Destinations/Safe/',
      narrative: 'A small, heavy safe containing physical data backups.',
      connections: []
    },
    {
      uuid: 'dest-main-frame',
      locationId: 'loc-server-farm',
      name: 'Core Mainframe',
      context: 'The largest server rack in the farm.',
      navigationMediaBase: 'Locations/Sector06/ServerFarm/Destinations/Mainframe/',
      narrative: 'It thrums with a deep, low-frequency power that vibrates your bones.',
      connections: []
    },
    {
      uuid: 'dest-cooling-unit',
      locationId: 'loc-server-farm',
      name: 'Industrial Cooling Unit',
      context: 'A massive fan assembly for the server racks.',
      navigationMediaBase: 'Locations/Sector06/ServerFarm/Destinations/Cooler/',
      narrative: 'The air here is ice cold and smells of silicon and dust.',
      connections: []
    },
    {
      uuid: 'dest-physical-drives',
      locationId: 'loc-data-vault',
      name: 'Hard Drive Racks',
      context: 'Shelves full of physical storage devices.',
      navigationMediaBase: 'Locations/Sector06/DataVault/Destinations/Drives/',
      narrative: 'Rows of antique mechanical drives and high-end quantum crystals.',
      connections: []
    },
    {
      uuid: 'dest-gold-disk',
      locationId: 'loc-data-vault',
      name: 'The Golden Disk',
      context: 'A legendary physical backup of the station\'s OS.',
      navigationMediaBase: 'Locations/Sector06/DataVault/Destinations/GoldDisk/',
      narrative: 'A single, glowing disk sitting in a velvet-lined case.',
      connections: []
    },

    // --- SECTOR 07: THE COURT ---
    {
      uuid: 'dest-pit-center',
      locationId: 'loc-the-pit',
      name: 'Pit Center',
      context: 'The exact middle of the combat arena.',
      navigationMediaBase: 'Locations/Sector07/ThePit/Destinations/Center/',
      narrative: 'The ground is stained with old blood and scarred by energy weapons.',
      connections: []
    },
    {
      uuid: 'dest-spectator-rails',
      locationId: 'loc-the-pit',
      name: 'Spectator Rails',
      context: 'The fencing that separates the crowd from the fighters.',
      navigationMediaBase: 'Locations/Sector07/ThePit/Destinations/Rails/',
      narrative: 'The metal is dented by desperate hands and flying debris.',
      connections: []
    },
    {
      uuid: 'dest-adjudicator-chair',
      locationId: 'loc-the-bench',
      name: 'Adjudicator\'s Throne',
      context: 'A high chair with a view of the entire Pit.',
      navigationMediaBase: 'Locations/Sector07/TheBench/Destinations/Chair/',
      narrative: 'From here, the judge decides who lives and who dies.',
      connections: []
    },
    {
      uuid: 'dest-gavel-station',
      locationId: 'loc-the-bench',
      name: 'The Gavel Terminal',
      context: 'The button that triggers the pit traps.',
      navigationMediaBase: 'Locations/Sector07/TheBench/Destinations/Gavel/',
      narrative: 'A single, large red button. Its surface is worn from frequent use.',
      connections: []
    },
    {
      uuid: 'dest-cell-04',
      locationId: 'loc-the-holding-cells',
      name: 'Holding Cell 04',
      context: 'A small, bare cell with a magnetic lock.',
      navigationMediaBase: 'Locations/Sector07/HoldingCells/Destinations/Cell04/',
      narrative: 'The walls are covered in scratch marks and desperate pleas.',
      connections: []
    },
    {
      uuid: 'dest-guard-station',
      locationId: 'loc-the-holding-cells',
      name: 'Guard Console',
      context: 'A terminal for monitoring cell integrity.',
      navigationMediaBase: 'Locations/Sector07/HoldingCells/Destinations/GuardConsole/',
      narrative: 'A flickering screen showing the status of each prisoner.',
      connections: []
    },
    {
      uuid: 'dest-brunhildh-bed',
      locationId: 'loc-brunhildhs-quarters',
      name: 'Brunhildh\'s Bed',
      context: 'A minimalist sleeping pod.',
      navigationMediaBase: 'Locations/Sector07/BrunhildhQuarters/Destinations/Bed/',
      narrative: 'A perfectly made, sterile sleeping area.',
      connections: []
    },
    {
      uuid: 'dest-brunhildh-shrine',
      locationId: 'loc-brunhildhs-quarters',
      name: 'Private Shrine',
      context: 'A small altar to an ancient goddess of justice.',
      navigationMediaBase: 'Locations/Sector07/BrunhildhQuarters/Destinations/Shrine/',
      narrative: 'Incense smoke curls around a cold, marble statue.',
      connections: []
    },

    // --- SECTOR 08: TEMPEST CO. HQ ---
    {
      uuid: 'dest-firing-range',
      locationId: 'loc-armament-level',
      name: 'Firing Range',
      context: 'A zone for testing heavy weapons.',
      navigationMediaBase: 'Locations/Sector08/Armament/Destinations/Range/',
      narrative: 'The air is thick with the smell of gunpowder and hot metal.',
      connections: []
    },
    {
      uuid: 'dest-gun-rack',
      locationId: 'loc-armament-level',
      name: 'Main Gun Rack',
      context: 'Rows of pulse rifles and shock batons.',
      navigationMediaBase: 'Locations/Sector08/Armament/Destinations/Rack/',
      narrative: 'Perfectly maintained weapons sit ready for a security deployment.',
      connections: []
    },
    {
      uuid: 'dest-tactical-map',
      locationId: 'loc-operations-level',
      name: 'Station Tactical Map',
      context: 'A 3D hologram of Prospero\'s Dream.',
      navigationMediaBase: 'Locations/Sector08/Operations/Destinations/Map/',
      narrative: 'Glowing red dots show current disturbances across the station.',
      connections: []
    },
    {
      uuid: 'dest-comms-hub',
      locationId: 'loc-operations-level',
      name: 'Command Comms Hub',
      context: 'A battery of long-range communicators.',
      navigationMediaBase: 'Locations/Sector08/Operations/Destinations/Comms/',
      narrative: 'The hub is constantly busy with encrypted mercenary chatter.',
      connections: []
    },
    {
      uuid: 'dest-cutters-safe',
      locationId: 'loc-cutters-mansion',
      name: 'Cutter\'s Private Safe',
      context: 'A heavy, biometric-locked floor safe.',
      navigationMediaBase: 'Locations/Sector08/CuttersMansion/Destinations/Safe/',
      narrative: 'Tucked behind a genuine earth-wood bookshelf. It hums with high-end security.',
      connections: []
    },
    {
      uuid: 'dest-art-gallery',
      locationId: 'loc-cutters-mansion',
      name: 'Private Art Gallery',
      context: 'A collection of stolen Earth artifacts.',
      navigationMediaBase: 'Locations/Sector08/CuttersMansion/Destinations/Art/',
      narrative: 'Real oil paintings and marble busts from a world long lost.',
      connections: []
    },
    {
      uuid: 'dest-containment-unit',
      locationId: 'loc-sublevel-c',
      name: 'Bio-Containment Unit',
      context: 'A reinforced glass cell for experimental specimens.',
      navigationMediaBase: 'Locations/Sector08/SublevelC/Destinations/Containment/',
      narrative: 'Something dark and pulsating is visible behind the thick glass.',
      connections: []
    },
    {
      uuid: 'dest-specimen-vial',
      locationId: 'loc-sublevel-c',
      name: 'Specimen Vial Rack',
      context: 'Rows of glowing green liquid in glass tubes.',
      navigationMediaBase: 'Locations/Sector08/SublevelC/Destinations/Vials/',
      narrative: 'The vials are labeled with cryptic codes and warning symbols.',
      connections: []
    },

    // --- SECTOR 09: DOPTOWN ---
    {
      uuid: 'dest-soup-kitchen',
      locationId: 'loc-doptown-main',
      name: 'Soup Kitchen',
      context: 'A distribution point for low-grade nutrients.',
      navigationMediaBase: 'Locations/Sector09/Main/Destinations/Kitchen/',
      narrative: 'A long line of desperate people waits for a bowl of grey sludge.',
      connections: []
    },
    {
      uuid: 'dest-public-spigot',
      locationId: 'loc-doptown-main',
      name: 'Public Water Spigot',
      context: 'A single, dripping pipe for the whole sector.',
      navigationMediaBase: 'Locations/Sector09/Main/Destinations/Spigot/',
      narrative: 'A group of children fights over a single, rusty cup.',
      connections: []
    },
    {
      uuid: 'dest-airlock-control',
      locationId: 'loc-the-airlock',
      name: 'Airlock Controls',
      context: 'The main terminal for operating the Doptown gates.',
      navigationMediaBase: 'Locations/Sector09/Airlock/Destinations/Control/',
      narrative: 'A heavily reinforced console with several large, physical levers.',
      connections: []
    },
    {
      uuid: 'dest-guard-pod',
      locationId: 'loc-the-airlock',
      name: 'Guard Sentry Pod',
      context: 'A small booth for the Tempest guards.',
      navigationMediaBase: 'Locations/Sector09/Airlock/Destinations/GuardPod/',
      narrative: 'The guard inside is armed with a shock baton and a mean glare.',
      connections: []
    },
    {
      uuid: 'dest-makeshift-bunk',
      locationId: 'loc-the-warrens',
      name: 'Makeshift Bunk',
      context: 'A pile of blankets and scrap metal.',
      navigationMediaBase: 'Locations/Sector09/Warrens/Destinations/Bunk/',
      narrative: 'A tiny, cramped space where someone tries to find rest.',
      connections: []
    },
    {
      uuid: 'dest-hidden-still',
      locationId: 'loc-the-warrens',
      name: 'Hidden Moonshine Still',
      context: 'A set of copper pipes and plastic jugs.',
      navigationMediaBase: 'Locations/Sector09/Warrens/Destinations/Still/',
      narrative: 'The smell of high-proof alcohol is overpowering here.',
      connections: []
    },
    {
      uuid: 'dest-smugglers-stash',
      locationId: 'loc-hollow-core',
      name: 'Smuggler\'s Crate',
      context: 'A hidden container tucked into the structural beams.',
      navigationMediaBase: 'Locations/Sector09/HollowCore/Destinations/Stash/',
      narrative: 'A crate full of contraband O2 canisters and illegal meds.',
      connections: []
    },
    {
      uuid: 'dest-gravity-well',
      locationId: 'loc-hollow-core',
      name: 'Gravity Well Hub',
      context: 'A large, rotating central shaft.',
      navigationMediaBase: 'Locations/Sector09/HollowCore/Destinations/GravityWell/',
      narrative: 'The air here is thick and the gravity feels inconsistent.',
      connections: []
    },

    // --- SECTOR 10: THE CHOKE ---
    {
      uuid: 'dest-veins-hub',
      locationId: 'loc-the-veins',
      name: 'Veins Central Hub',
      context: 'A junction of several maintenance tunnels.',
      navigationMediaBase: 'Locations/Sector10/TheVeins/Destinations/Hub/',
      narrative: 'Steam whistles from a dozen different pipes in this dark chamber.',
      connections: []
    },
    {
      uuid: 'dest-junction-box',
      locationId: 'loc-the-veins',
      name: 'Junction Box 10-A',
      context: 'A heavily corroded electrical panel.',
      navigationMediaBase: 'Locations/Sector10/TheVeins/Destinations/Junction/',
      narrative: 'Sparks fly from a nest of exposed and frayed wires.',
      connections: []
    },
    {
      uuid: 'dest-choke-statue',
      locationId: 'loc-the-choke-main',
      name: 'The Fallen Statue',
      context: 'A large bronze statue toppled in the plaza.',
      navigationMediaBase: 'Locations/Sector10/Main/Destinations/Statue/',
      narrative: 'The statue is covered in thick, pulsating black vines.',
      connections: []
    },
    {
      uuid: 'dest-fountain-of-tears',
      locationId: 'loc-the-choke-main',
      name: 'The Fountain of Tears',
      context: 'A dry, cracked fountain filled with biomass.',
      navigationMediaBase: 'Locations/Sector10/Main/Destinations/Fountain/',
      narrative: 'Something moves deep within the tangled roots at the fountain\'s base.',
      connections: []
    },
    {
      uuid: 'dest-falls-ledge',
      locationId: 'loc-the-falls',
      name: 'Slippery Ledge',
      context: 'A narrow path beside the toxic cascade.',
      navigationMediaBase: 'Locations/Sector10/TheFalls/Destinations/Ledge/',
      narrative: 'The ground is slick with coolant and the air is hard to breathe.',
      connections: []
    },
    {
      uuid: 'dest-clogged-grate',
      locationId: 'loc-the-falls',
      name: 'The Clogged Grate',
      context: 'A massive industrial drain blocked by refuse.',
      navigationMediaBase: 'Locations/Sector10/TheFalls/Destinations/Grate/',
      narrative: 'The water pools here, forming a toxic, glowing lake.',
      connections: []
    },
    {
      uuid: 'dest-sink-basin',
      locationId: 'loc-the-sink',
      name: 'Main Basin',
      context: 'A huge, circular concrete area.',
      navigationMediaBase: 'Locations/Sector10/TheSink/Destinations/Basin/',
      narrative: 'The basin is filled with several feet of dark, stagnant water.',
      connections: []
    },
    {
      uuid: 'dest-rust-island',
      locationId: 'loc-the-sink',
      name: 'Rust Island',
      context: 'A heap of scrap rising above the water.',
      navigationMediaBase: 'Locations/Sector10/TheSink/Destinations/RustIsland/',
      narrative: 'A small island of twisted metal, providing a brief moment of dry ground.',
      connections: []
    },
    {
      uuid: 'dest-nest-01',
      locationId: 'loc-the-burrows',
      name: 'Specimen Nest',
      context: 'A cluster of pulsating organic sacks.',
      navigationMediaBase: 'Locations/Sector10/Burrows/Destinations/Nest/',
      narrative: 'The sacks twitch with the movement of something gestating inside.',
      connections: []
    },
    {
      uuid: 'dest-human-remains',
      locationId: 'loc-the-burrows',
      name: 'Infested Remains',
      context: 'The bones of a station worker, fused into the wall.',
      navigationMediaBase: 'Locations/Sector10/Burrows/Destinations/Remains/',
      narrative: 'The skeleton is partially covered by a thick, translucent film.',
      connections: []
    },
    {
      uuid: 'dest-caliban-core',
      locationId: 'loc-the-heart',
      name: 'The Caliban Core',
      context: 'The main central mass of the infestation.',
      navigationMediaBase: 'Locations/Sector10/Heart/Destinations/Core/',
      narrative: 'A massive, throbbing heart of black flesh and glowing circuits.',
      connections: []
    },
    {
      uuid: 'dest-recycled-souls',
      locationId: 'loc-the-heart',
      name: 'The Soul Processor',
      context: 'A machine partially consumed by the biomass.',
      navigationMediaBase: 'Locations/Sector10/Heart/Destinations/Processor/',
      narrative: 'It emits a low, mournful scream that echoes in your mind.',
      connections: []
    }
  ]
};
