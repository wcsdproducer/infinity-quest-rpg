import type { Campaign } from './types';
import { getStationGraph } from './extracted-graph';

// This is the seed data for the "A Pound of Flesh" campaign.
export const poundOfFleshCampaignData: Omit<Campaign, 'id'> = {
  name: 'A Pound of Flesh',
  description:
    'A classic survival horror scenario where the crew must salvage a derelict freighter, the Prospero, but soon discover they are not alone. This is the official introductory scenario for the Mothership RPG.',
  imageUrl:
    'https://images.unsplash.com/photo-1581333100258-9034c2895843?q=80&w=2070&auto=format&fit=crop',
  initialMessage:
    "You drift. The cryo-sleep is a cold, dreamless void, but it's ending. Alarms, muffled at first, grow sharp. Red lights flash against your eyelids. Your name is being called. You are a member of the salvage crew of the M.V. Montero. Your mission: rendezvous with and salvage the derelict freighter, the Prospero. The initial scans showed no life signs, but the ship's reactor is still online. A quick job, the dispatcher said. A pound of flesh for a pound of credits. Time to wake up.",
  prompt:
    "You are the Warden for a game of Mothership, running the 'A Pound of Flesh' scenario. The players are the crew of the M.V. Montero, sent to salvage the derelict freighter, The Prospero. The Prospero is not as empty as it seems. It is infested with a deadly xenomorph. Be sure to build suspense, describe the eerie silence of the ship, the strange organic growths, and the sudden, brutal violence of the creature. Key NPCs include the Montero's android, who may have its own directives, and any survivors on the Prospero. The goal is survival, but the odds are slim.",
  status: 'draft',
  startingSectorId: 'sector-01-dry-dock',
  startingLocationId: 'loc-arrival',
  initialMediaUrl: 'https://firebasestorage.googleapis.com/v0/b/infinity-quest-rpg.firebasestorage.app/o/campaigns%2Fa-pound-of-flesh%2FLocations%2Farrival%2FArrival%201.mp4?alt=media&token=9c851639-7e63-4d98-bec7-c22a7a64b7fd',
  stationGraph: getStationGraph(),
};
