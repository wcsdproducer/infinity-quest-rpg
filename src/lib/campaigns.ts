import type { Campaign } from './types';
import { PROSPERO_STATION_GRAPH } from './game/prospero-graph';

// This is the seed data for the "A Pound of Flesh" campaign.
export const poundOfFleshCampaignData: Omit<Campaign, 'id'> = {
  name: 'A Pound of Flesh',
  description:
    'A classic survival horror scenario where the crew must navigate the decaying space station Prospero’s Dream, caught between corporate greed, criminal syndicates, and a cybernetic plague.',
  imageUrl:
    'https://images.unsplash.com/photo-1581333100258-9034c2895843?q=80&w=2070&auto=format&fit=crop',
  initialMessage:
    "You disembark from your ship at Sector 01: Dry Dock. The air is thick with the smell of ozone and recycled oxygen. Your O2 credstick hums in your pocket, a constant reminder that every breath has a price. Ahead, the station stretches out in a massive ring, divided into ten sectors, each a world of its own. Where to first?",
  prompt:
    "You are the AI Warden for Prospero's Dream. Use the provided stationGraph to guide players. Respect connection states (locked/hidden). If a player travels, describe the journey based on the connection type (walking, transit, lift, shaft). Enforce O2 taxes and transit costs.",
  status: 'draft',
  startingSectorId: 'sector-01-dry-dock',
  startingLocationId: 'loc-arrival',
  initialMediaUrl: 'https://firebasestorage.googleapis.com/v0/b/infinity-quest-rpg.firebasestorage.app/o/campaigns%2Fa-pound-of-flesh%2FLocations%2FDry%20Dock%2Farrival%2FArrival%201.mp4?alt=media',
  stationGraph: PROSPERO_STATION_GRAPH,
};

