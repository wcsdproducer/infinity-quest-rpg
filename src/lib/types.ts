
export type Skill = {
  name: string;
  level: 'Trained' | 'Expert' | 'Master';
}

/** A directional edge between two locations (corridor, hatch, passage, etc.) */
export type LocationConnection = {
  toLocationId: string;
  /** Set if this connection crosses a sector boundary */
  toSectorId?: string;
  passageName: string;             // e.g. "Maintenance Hatch 3A"
  travelDescription: string;       // What the player sees/experiences
  travelMinutes: number;
  encounterChance: number;         // 0–100 %
  encounterTable?: string;         // Which roll table to use
  isBlocked: boolean;
  blockedReason?: string;
  requiredItems?: string[];        // Items needed to pass
};

export type Location = {
  uuid: string;
  /** Parent sector this location belongs to */
  sectorId?: string;
  name?: string;
  context?: string;
  /** Warden-only information not revealed to players */
  wardenNotes?: string;
  actions?: string[];
  narrative?: string;
  mediaUrls?: MediaURL[];
  /** Warden-only: players are unaware this location exists until revealed. */
  isHidden?: boolean;
  /** Warden-only: players know the location exists but cannot enter it. */
  isLocked?: boolean;
  /** NPC IDs present at this location */
  npcs?: string[];
  /** Graph edges to adjacent locations */
  connections?: LocationConnection[];
};

/** A directional edge between two sectors (corridor, transit, etc.) */
export type SectorConnection = {
  toSectorId: string;
  corridorName: string;            // e.g. "Service Corridor B7"
  travelDescription: string;       // Narrated when traversing
  travelMinutes: number;
  encounterChance: number;         // 0–100 %
  encounterTable?: string;
  isBlocked: boolean;
  blockedReason?: string;
};

/** A sector is a named zone of the station containing multiple locations */
export type Sector = {
  id: string;                      // e.g. "sector-01-dry-dock"
  number: number;                  // 1–10 (module number)
  name: string;                    // e.g. "Dry Dock"
  description: string;             // Player-facing description
  wardenNotes?: string;            // Warden-only GM info
  atmosphere: string;              // Tone/feel ("industrial, loud, dangerous")
  pageRef: number;                 // Module page reference
  faction?: string;                // Controlling faction if any
  isHidden?: boolean;
  isLocked?: boolean;
  /** Adjacent sectors the players can travel to */
  sectorConnections: SectorConnection[];
  /** IDs of locations within this sector */
  locationIds: string[];
};

/** Denormalized graph stored on the campaign doc for the Warden to read in one pass */
export type StationGraph = {
  sectors: Sector[];
  locations: Location[];
};

export type Character = {
  id: string; // Optional ID for when reading from Firestore
  playerId: string | null; // UID of the player controlling the character
  name: string;
  class: string;
  credits?: number;
  highScore?: number;
  description?: string;
  backstory?: string;
  location?: string; // Current location name (string, for AI context)
  currentLocationId?: string; // Current location UUID (for image resolution & Firestore sync)
  traumaResponse: string;
  stats: {
    strength: number;
    speed: number;
    intellect: number;
    combat: number;
  };
  saves: {
    sanity: number;
    fear: number;
    body: number;
  };
  modifiers: {
    stats: {
        strength: number;
        speed: number;
        intellect: number;
        combat: number;
    };
    saves: {
        sanity: number;
        fear: number;
        body: number;
    };
  };
  health: {
    current: number;
    max: number;
  };
  armorPoints: number;
  stress: {
    current: number;
    min: number;
  };
  wounds: {
    current: number;
    max: number;
  };
  carryingCapacity: {
    current: number;
    max: number;
  };
  skills: Skill[];
  inventory: string[];
};

export type CharacterGenerationResult = Omit<Character, 'description' | 'backstory' | 'playerId'> & {
    description?: string;
    backstory?: string;
};


export type Message = {
  id: string;
  sender: 'player' | 'gm' | 'system';
  text: string;
  timestamp: number;
};

export type Game = {
    id: string;
    campaignId: string | null;
    hostUid: string;
    players: string[];
    createdAt: string;
    gameCode: string;
};

export type UserProfile = {
  uid: string;
  displayName: string | null;
  email: string | null;
  createdAt: string;
};

export type AppSettings = {
  titleScreenImageUrl?: string;
  titleScreenMusicUrl?: string;
};

export type MediaURL = {
    url: string;
    loop?: boolean;
};

export type EventTrigger = {
    type: 'player-action' | 'game-event';
    value: string;
};

export type MediaItem = {
    uuid: string;
    name?: string;
    context?: string;
    actions?: string[];
    narrative?: string;
    trigger?: EventTrigger;
    mediaUrls?: MediaURL[];
};

export type ActItem = {
    uuid: string;
    name?: string;
    context?: string;
    actions?: string[];
    narrative?: string;
};

export type ShipStat = {
    value: number;
    notes?: string;
};

export type ShipItem = {
    uuid: string;
    name: string;
    class?: string;
    registry?: string;
    condition?: string;
    stats: {
        hull: ShipStat;
        speed: ShipStat;
        armor: ShipStat;
        power: ShipStat;
        crewCapacity: ShipStat;
        cargo: ShipStat;
        stressCap: ShipStat;
    };
    mediaUrls?: MediaURL[];
};

export type Contract = {
    uuid: string;
    title: string;
    description: string;
    reward: string;
    requirements?: string;
};


export type Campaign = {
  id: string;
  name:string;
  description: string;
  startingLocationId?: string;
  /** Starting sector ID (used with stationGraph) */
  startingSectorId?: string;
  imageUrl: string;
  initialMessage: string;
  initialMediaUrl?: string;
  prompt: string;
  status: 'draft' | 'published';
  storageFolderName?: string;
  acts?: ActItem[];
  /** Legacy flat location list — prefer stationGraph for new campaigns */
  locations?: Location[];
  events?: MediaItem[];
  npcs?: MediaItem[];
  ships?: ShipItem[];
  contracts?: Contract[];
  /** Full station navigation graph — sectors + locations with connections */
  stationGraph?: StationGraph;
};

export type CommMessage = {
  id?: string;
  /** Both participant UIDs, sorted — enables array-contains queries for either player. */
  participants: string[];
  fromPlayerId: string;
  fromCharacterName: string;
  message: string;
  timestamp: number;
};


// ── Memory System Types ──────────────────────────────────────────────────────

/** A chat message persisted to Firestore for cross-session recall. */
export type PersistedMessage = {
  id: string;
  sender: 'player' | 'gm' | 'system';
  text: string;
  timestamp: number;
  sessionId: string;
};

/** Top-level state document for a game (`games/{id}/state/current`). */
export type GameState = {
  sessionId: string;
  sessionCount: number;
  lastPlayedAt: number;
  questFlags: Record<string, boolean>;
  /**
   * Per-game location discovery state.
   * Key = location UUID, value = true if players have discovered (isKnown) the location.
   * All locations default to false except the campaign starting location.
   */
  locationDiscovery: Record<string, boolean>;
  /** Current sector the party is in */
  currentSectorId?: string;
  /** Current specific location within the sector */
  currentLocationId?: string;
};

/** Gemini-generated recap stored at the end of each session. */
export type SessionSummary = {
  id?: string;
  sessionId: string;
  sessionNumber: number;
  startedAt: number;
  endedAt?: number;
  summary: string;
  keyEvents: string[];
};

/** An embedding + content pair for semantic memory retrieval. */
export type EpisodicMemory = {
  id?: string;
  content: string;
  embedding: number[];
  importance: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  characterIds: string[];
  locationId?: string;
  sessionId: string;
  timestamp: number;
};
