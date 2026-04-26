
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { StoryPanel } from '@/components/game/story-panel';
import { CharacterPanel } from '@/components/game/character-panel';
import { DiceRoller } from '@/components/game/dice-roller';
import { CombatTracker } from '@/components/game/combat-tracker';
import type { Character, Message, CommMessage, SessionSummary, EpisodicMemory } from '@/lib/types';
import { getNextStoryPart, resolveDiceRoll, discoverLocationAction } from '@/app/actions';
import {
  getOrCreateGameState,
  loadRecentMessages,
  getLatestSessionSummary,
  saveMessage,
  embedAndSaveMemory,
  retrieveRelevantMemories,
  summarizeAndSaveSession,
  getLocationDiscovery,
} from '@/lib/game-memory';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  PanelLeft,
  LoaderCircle,
  Users,
  X,
  Radio,
} from 'lucide-react';
import { MediaPanel } from '@/components/game/media-panel';
import { PlayerAction } from '@/components/game/player-action';
import { ContinueAdventureOutput, ContinueAdventureOutputSchema, Combatant } from '@/ai/schemas';
import { z } from 'genkit';
import type { Campaign } from '@/lib/types';
import { RollResultPopup } from '@/components/game/roll-result-popup';
import { cn } from '@/lib/utils';
import { GameControls } from '@/components/game/game-controls';
import { CrewRoster } from '@/components/game/crew-roster';
import { CommPanel } from '@/components/game/comm-panel';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { resolveNavigationMedia, canTraverse, calculateTransitCost } from '@/lib/navigation';

type GameViewProps = {
  campaign: Campaign;
  initialCharacter: Character; // For solo mode, this is the player's character
  crew?: Character[]; // For multiplayer, the full crew
  gameId?: string; // For multiplayer mode
  currentUserId?: string;
  playerNumber?: number;
  playerNumbers?: Record<string, number>; // uid -> player number (P1, P2, …)
};

const getInitialMessage = (narrative: string, characterName: string): Message => ({
    id: 'start',
    sender: 'gm',
    text: narrative.replace('{{characterName}}', characterName),
    timestamp: Date.now(),
});



type RollResult = {
  outcome?: z.infer<typeof ContinueAdventureOutputSchema>['rollOutcome'];
  narrative?: string;
  value?: number;
};

export function GameView({ campaign, initialCharacter, crew = [], gameId, currentUserId, playerNumber, playerNumbers = {} }: GameViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  // Tracks which locked location UUIDs the player has earned access to this session.
  // Resets on page reload — for true persistence add to character schema in a future pass.
  const [sessionUnlockedLocationIds, setSessionUnlockedLocationIds] = useState<Set<string>>(new Set());
  const firestore = useFirestore();
  
  const getLocationMedia = useCallback((locationId?: string, sectorId?: string, destinationId?: string): { url: string, isVideo: boolean } => {
    // 1. Check for Destination-specific media first
    if (destinationId) {
        const dest = campaign.stationGraph?.destinations.find(d => d.uuid === destinationId);
        const media = dest?.mediaUrls?.find(m => m.url);
        if (media) {
            const url = media.url;
            const isVideo = url.startsWith('data:video') || url.includes('video%2F') || url.split('?')[0].match(/\.(mp4|webm|ogg)$/i) !== null;
            return { url, isVideo };
        }
    }

    // 2. Check for Location-specific media
    if (locationId) {
        const locations = campaign.stationGraph?.locations ?? campaign.locations ?? [];
        const loc = locations.find(l => l.uuid === locationId);
        if (loc) {
            if (loc.isLocked && !sessionUnlockedLocationIds.has(locationId)) {
                return { url: '/fallback-location-locked.png', isVideo: false };
            }
            const media = loc.mediaUrls?.find(m => m.url);
            if (media) {
                const url = media.url;
                const isVideo = url.startsWith('data:video') || url.includes('video%2F') || url.split('?')[0].match(/\.(mp4|webm|ogg)$/i) !== null;
                return { url, isVideo };
            }
        }
    }

    // 3. Check for Sector-specific media
    if (sectorId) {
        const sector = campaign.stationGraph?.sectors.find(s => s.id === sectorId);
        const media = sector?.mediaUrls?.find(m => m.url);
        if (media) {
            const url = media.url;
            const isVideo = url.startsWith('data:video') || url.includes('video%2F') || url.split('?')[0].match(/\.(mp4|webm|ogg)$/i) !== null;
            return { url, isVideo };
        }
    }
    
    return { url: '/fallback-location-unknown.png', isVideo: false };
  }, [campaign.locations, campaign.stationGraph, sessionUnlockedLocationIds]);

  
  const getInitialLocation = () => {
    if (campaign.startingLocationId) {
      const startingLoc = campaign.locations?.find(l => l.uuid === campaign.startingLocationId);
      if (startingLoc?.name) {
        return startingLoc.name;
      }
    }
    return 'an unknown location';
  };

  // Resolve a location name from its UUID — used to keep the text label in sync with currentLocationId
  const getLocationNameById = (locationId?: string): string => {
    if (!locationId || !campaign.locations) return 'an unknown location';
    return campaign.locations.find(l => l.uuid === locationId)?.name ?? 'an unknown location';
  };

  const resolvedStartId = initialCharacter.currentLocationId ?? campaign.startingLocationId;
  const [character, setCharacter] = useState<Character>({
      ...initialCharacter,
      currentLocationId: resolvedStartId,
      // Derive the text label from the saved UUID so image + label always agree
      location: resolvedStartId ? getLocationNameById(resolvedStartId) : getInitialLocation(),
  });

  const [currentCrew, setCurrentCrew] = useState<Character[]>(
      (crew.length > 0 ? crew : [initialCharacter]).map(c => {
          const resolvedId = c.currentLocationId ?? campaign.startingLocationId;
          return {
              ...c,
              currentLocationId: resolvedId,
              location: resolvedId ? getLocationNameById(resolvedId) : getInitialLocation(),
          };
      })
  );

  
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAwaitingRoll, setIsAwaitingRoll] = useState(false);
  const [rollDetails, setRollDetails] = useState<string | undefined>(undefined);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [lastRollResult, setLastRollResult] = useState<RollResult | null>(null);
  const [pendingApiResponse, setPendingApiResponse] = useState<ContinueAdventureOutput | null>(null);
  const [showRollResult, setShowRollResult] = useState(false);
  const [inCombat, setInCombat] = useState(false);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [location, setLocation] = useState<string | undefined>(getInitialLocation());
  // Derive media from current location; AI events can override via mediaOverride
  // mediaOverride is only for AI-triggered temporary events; location images are derived from currentLocationId
  const [mediaOverride, setMediaOverride] = useState<string | undefined>(undefined);
  const [isCrewRosterOpen, setIsCrewRosterOpen] = useState(true);

  // ── Memory / Session state ────────────────────────────────────────────────
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionCount, setSessionCount] = useState<number>(1);
  const [lastSessionSummary, setLastSessionSummary] = useState<SessionSummary | null>(null);
  const [relevantMemories, setRelevantMemories] = useState<EpisodicMemory[]>([]);
  // Per-game location discovery map: locationUuid → isKnown
  const [locationDiscovery, setLocationDiscovery] = useState<Record<string, boolean>>({});
  const [currentSectorId, setCurrentSectorId] = useState<string | undefined>(campaign.startingSectorId);
  const [currentDestinationId, setCurrentDestinationId] = useState<string | undefined>(undefined);


  // ── Comm channel state ──────────────────────────────────────────────────
  type CommTarget = { playerId: string; characterName: string; playerLabel: string };
  const [openCommWith, setOpenCommWith] = useState<CommTarget | null>(null);
  const [commMessages, setCommMessages] = useState<Record<string, CommMessage[]>>({});
  const [unreadComms, setUnreadComms] = useState<Record<string, number>>({});
  // Tracks the timestamp of the last message the user saw per conversation
  const lastSeenTimestamps = useRef<Record<string, number>>({});

  // Other human players we can hail (non-NPC, not ourselves)
  const otherPlayers = useMemo<CommTarget[]>(() => {
    const real = currentCrew
      .filter((m) => m.playerId && m.playerId !== currentUserId)
      .map((m) => ({
        playerId: m.playerId!,
        characterName: m.name,
        playerLabel: playerNumbers[m.playerId!] ? `P${playerNumbers[m.playerId!]}` : 'P?',
      }));
    // DEV ONLY: inject a mock player so the comm UI is testable solo
    if (process.env.NODE_ENV === 'development' && real.length === 0) {
      return [{ playerId: '__dev_mock_p2__', characterName: 'Dev Player', playerLabel: 'P2' }];
    }
    return real;
  }, [currentCrew, currentUserId, playerNumbers]);

  // Whether the character's current location is locked — used to gate UI affordances.
  // Checks BOTH the static campaign flag AND whether access was granted this session.
  const activeLocationIsLocked = useMemo(() => {
    if (!character.currentLocationId || !campaign.locations) return false;
    const loc = campaign.locations.find(l => l.uuid === character.currentLocationId);
    if (!loc?.isLocked) return false;
    // If the player earned access this session, treat it as unlocked
    return !sessionUnlockedLocationIds.has(character.currentLocationId);
  }, [character.currentLocationId, campaign.locations, sessionUnlockedLocationIds]);

  // Locked-location guardrail: override whatever the AI suggested with entry-appropriate actions.
  // This is a hard client-side rule so interior actions can never surface while the door is sealed.
  // Exception: if the suggested actions include an "Enter X" action (post-bypass), pass those through.
  const LOCKED_LOCATION_ACTIONS = [
    'Try to bypass the access panel again',
    'Search for another way in',
    'Observe the area from a safe distance',
    'Retreat and regroup',
  ];
  const displayedSuggestedActions = useMemo(() => {
    const locations = campaign.stationGraph?.locations ?? campaign.locations ?? [];
    const sectors = campaign.stationGraph?.sectors ?? [];
    const destinations = campaign.stationGraph?.destinations ?? [];
    
    const currentLocation = locations.find(l => l.uuid === character.currentLocationId);
    const currentSector = sectors.find(s => s.id === currentSectorId);
    const currentDest = destinations.find(d => d.uuid === currentDestinationId);

    // Default actions for a locked location
    if (activeLocationIsLocked) {
        const hasEnterAction = suggestedActions.some(a => a.toLowerCase().startsWith('enter '));
        return hasEnterAction ? suggestedActions : LOCKED_LOCATION_ACTIONS;
    }

    let actions = [...suggestedActions];

    // If we have a station graph, enrich with hierarchy navigation
    if (campaign.stationGraph) {
        // 1. If in a specific destination, offer way back to location
        if (currentDest && currentLocation) {
            const exitLabel = `Return to ${currentLocation.name}`;
            if (!actions.includes(exitLabel)) actions.unshift(exitLabel);
        }
        
        // 2. If in a location, offer destinations within it
        if (currentLocation && !currentDest) {
            const internalDests = destinations.filter(d => d.locationId === currentLocation.uuid);
            internalDests.forEach(d => {
                const label = `Go to ${d.name}`;
                if (!actions.includes(label)) actions.push(label);
            });
        }

        // 3. Offer travel to adjacent sectors if at a location (and not inside a destination)
        if (currentSector && currentLocation && !currentDest) {
            currentSector.sectorConnections.forEach(conn => {
                const targetSector = sectors.find(s => s.id === conn.toSectorId);
                if (targetSector) {
                    const cost = calculateTransitCost(currentSectorId, conn.toSectorId, conn.cost);
                    const label = `Travel to ${targetSector.name} (${conn.passageName})${cost > 0 ? ` (${cost} Cr)` : ''}`;
                    if (!actions.includes(label)) actions.push(label);
                }
            });
        }
    }

    return actions;
  }, [activeLocationIsLocked, suggestedActions, character.currentLocationId, currentSectorId, currentDestinationId, campaign.stationGraph, campaign.locations]);


  // Real-time listener for comm messages
  useEffect(() => {
    if (!firestore || !gameId || !currentUserId) return;
    const commsRef = collection(firestore, 'games', gameId, 'comms');
    const q = query(
      commsRef,
      where('participants', 'array-contains', currentUserId),
      orderBy('timestamp', 'asc')
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const grouped: Record<string, CommMessage[]> = {};
      snapshot.docs.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() } as CommMessage;
        const otherId = data.participants.find((id) => id !== currentUserId) ?? '';
        if (otherId) {
          if (!grouped[otherId]) grouped[otherId] = [];
          grouped[otherId].push(data);
        }
      });
      setCommMessages(grouped);
      // Count unread (messages from others newer than our last-seen timestamp)
      setUnreadComms((prev) => {
        const updated = { ...prev };
        Object.entries(grouped).forEach(([otherId, msgs]) => {
          const lastSeen = lastSeenTimestamps.current[otherId] ?? 0;
          const isOpen = openCommWith?.playerId === otherId;
          if (isOpen) {
            lastSeenTimestamps.current[otherId] = Date.now();
            updated[otherId] = 0;
          } else {
            updated[otherId] = msgs.filter(
              (m) => m.fromPlayerId !== currentUserId && m.timestamp > lastSeen
            ).length;
          }
        });
        return updated;
      });
    }, (error) => {
      // Silently ignore "index still building" — Firestore will retry automatically once ready
      if (error.code === 'failed-precondition') return;
      console.warn('[Comm] Snapshot error:', error.message);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, gameId, currentUserId]);

  const handleOpenComm = useCallback((target: CommTarget) => {
    setOpenCommWith(target);
    lastSeenTimestamps.current[target.playerId] = Date.now();
    setUnreadComms((prev) => ({ ...prev, [target.playerId]: 0 }));
  }, []);

  const sendComm = useCallback(
    async (toPlayerId: string, toCharacterName: string, message: string) => {
      if (!firestore || !gameId || !currentUserId) return;
      const participants = [currentUserId, toPlayerId].sort();
      await addDoc(collection(firestore, 'games', gameId, 'comms'), {
        participants,
        fromPlayerId: currentUserId,
        fromCharacterName: character.name,
        message,
        timestamp: Date.now(),
      });
    },
    [firestore, gameId, currentUserId, character.name]
  );
  const gameViewRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const playerInputRef = useRef<HTMLTextAreaElement>(null);

    // Effect for the very first game load
  useEffect(() => {
    const startAdventure = async () => {
        setIsLoading(true);

        const initialNarrative = campaign.initialMessage || `Your mission awaits.`;
        const initialMessage = getInitialMessage(initialNarrative, initialCharacter.name);

        // ── Seed suggestions from the character's CURRENT location ──────────
        const currentLocId = initialCharacter.currentLocationId ?? campaign.startingLocationId;
        const currentLocation = campaign.locations?.find(l => l.uuid === currentLocId);
        if (currentLocation?.actions) {
            setSuggestedActions(currentLocation.actions);
        }

        if (gameId) {
          // ── Layer 0: get / create the game state doc (new session) ────────
          const allLocationIds = campaign.locations?.map(l => l.uuid) ?? [];
          const state = await getOrCreateGameState(gameId, allLocationIds, campaign.startingLocationId);
          setSessionId(state.sessionId);
          setSessionCount(state.sessionCount);

          // ── Load persistent location discovery state ───────────────────────
          const discovery = await getLocationDiscovery(gameId);
          setLocationDiscovery(discovery);

          // ── Layer 1: load persisted messages ─────────────────────────────
          const persisted = await loadRecentMessages(gameId, 100);
          if (persisted.length > 0) {
            // Restore the conversation — skip the boilerplate intro message
            setMessages(
              persisted.map((m) => ({
                id: m.id,
                sender: m.sender,
                text: m.text,
                timestamp: m.timestamp,
              }))
            );
          } else {
            // First ever session — show the intro message and persist it
            setMessages([initialMessage]);
            // Save the intro message (fire-and-forget)
            saveMessage(gameId, state.sessionId, initialMessage);
          }

          // ── Layer 2: load previous session summary ────────────────────────
          const summary = await getLatestSessionSummary(gameId);
          setLastSessionSummary(summary);

          // ── Layer 3: pre-fetch relevant memories for context ──────────────
          if (state.sessionCount > 1) {
            const queryText = `${campaign.name}: ${initialCharacter.name} at ${currentLocation?.name ?? 'unknown location'}`;
            const memories = await retrieveRelevantMemories(gameId, queryText, 5);
            setRelevantMemories(memories);
          }
        } else {
          // Solo mode without a gameId — in-memory only
          setMessages([initialMessage]);
        }

        setIsLoading(false);
    };

    startAdventure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount


  const persistCharacterUpdate = useCallback(async (characterId: string, updates: Partial<Character>) => {
    if (!firestore || !gameId) return;
    try {
      const charRef = doc(firestore, 'games', gameId, 'characters', characterId);
      // Remove undefined fields and nested objects if needed, but here simple fields work
      await updateDoc(charRef, updates);
    } catch (e) {
      console.warn('Could not persist character update to Firestore:', e);
    }
  }, [firestore, gameId]);

  // Persist currentLocationId to Firestore so other players see the change in real-time
  const persistLocationToFirestore = useCallback(async (characterId: string, locationId: string) => {
    const locName = campaign.locations?.find(l => l.uuid === locationId)?.name ?? undefined;
    await persistCharacterUpdate(characterId, { currentLocationId: locationId, location: locName });
  }, [campaign.locations, persistCharacterUpdate]);

  const handleTypewriterFinish = () => {
    setIsTyping(false);
    if (pendingApiResponse) {
      // The full crew state is now in `updatedCrew`.
      if (pendingApiResponse.updatedCrew && pendingApiResponse.updatedCrew.length > 0) {
        const updatedCrew = pendingApiResponse.updatedCrew as unknown as Character[];

        // Client-side safety guard: other human players control their own movement.
        // Even if the AI incorrectly moves them, we restore their location from the
        // pre-action crew state so only the acting character (and NPC orders) take effect.
        const mergedCrew = updatedCrew.map(updatedMember => {
          const existing = currentCrew.find(
            c => (c.id && c.id === updatedMember.id) || c.name === updatedMember.name
          );
          // Always restore identity fields — AI must never overwrite Firebase UIDs.
          // The Warden prompt previously used combatant id 'player', which bled into
          // character.playerId and caused duplicate React keys across all crew members.
          const withLockedIdentity = existing
            ? { ...updatedMember, id: existing.id ?? updatedMember.id, playerId: existing.playerId }
            : updatedMember;
          const isOtherPlayer = existing?.playerId && existing.playerId !== currentUserId;
          if (isOtherPlayer && existing) {
            // Preserve location — they decide where they go
            return {
              ...withLockedIdentity,
              location: existing.location,
              currentLocationId: existing.currentLocationId,
            };
          }
          return withLockedIdentity;
        });

        setCurrentCrew(mergedCrew);

        // Find the active character in the merged crew list.
        const updatedActiveCharacter = mergedCrew.find(c => c.id === character.id);
        if (updatedActiveCharacter) {
          setCharacter(updatedActiveCharacter);
          setLocation(updatedActiveCharacter.location);
          setCurrentSectorId(updatedActiveCharacter.currentSectorId);
          setCurrentDestinationId(updatedActiveCharacter.currentDestinationId);
        }
      }

      
      if (pendingApiResponse.rollRequired) {
        setSuggestedActions([]);
        setIsAwaitingRoll(true);
        setRollDetails(pendingApiResponse.rollDetails);
      } else {
        if (pendingApiResponse.suggestedActions) {
          setSuggestedActions(pendingApiResponse.suggestedActions);
        }
        setIsAwaitingRoll(false);
        setRollDetails(undefined);
      }
      
      setInCombat(pendingApiResponse.inCombat);
      if (pendingApiResponse.inCombat && pendingApiResponse.combatants) {
        setCombatants(pendingApiResponse.combatants);
      } else {
        setCombatants([]);
      }
      
      // Resolve new location from AI response — find matching campaign location by name
      if (pendingApiResponse.location) {
        const newLocationName = pendingApiResponse.location;
        setLocation(newLocationName);
        
        const matchedLocation = campaign.locations?.find(
          l => l.name?.toLowerCase() === newLocationName.toLowerCase()
        );
        if (matchedLocation) {
          // Update the active character's currentLocationId — the media window
          // derives the image automatically from currentLocationId via getLocationImageUrl
          setCharacter(prev => ({ ...prev, currentLocationId: matchedLocation.uuid, location: newLocationName }));
          // Clear any AI-triggered media override so the location's default image shows
          setMediaOverride(undefined);
          // Persist to Firestore for multiplayer sync
          if (gameId && character.id) {
            persistLocationToFirestore(character.id, matchedLocation.uuid);
          }
        }
      }
      
      // AI-triggered media events override the location background temporarily
      if (pendingApiResponse.mediaUrl) {
        setMediaOverride(pendingApiResponse.mediaUrl);
      }

      // Persist Warden-triggered location discovery (fire-and-forget)
      if (pendingApiResponse.newlyDiscoveredLocationId && gameId) {
        const discoveredId = pendingApiResponse.newlyDiscoveredLocationId;
        discoverLocationAction(gameId, discoveredId).then((result) => {
          if (result.success && result.locationDiscovery) {
            setLocationDiscovery(result.locationDiscovery);
          }
        });
      }

      setPendingApiResponse(null);
    }
  };

  // ── storyContext builder ────────────────────────────────────────────────
  const buildStoryContext = (msgs: Message[]): string => {
    const parts: string[] = [];

    // Prepend the previous session recap so the AI has cross-session continuity
    if (lastSessionSummary) {
      parts.push(
        `[PREVIOUS SESSION RECAP]\n${lastSessionSummary.summary}\nKey events:\n${lastSessionSummary.keyEvents.map((e) => `• ${e}`).join('\n')}\n[END RECAP]`
      );
    }

    // Inject semantically relevant memories
    if (relevantMemories.length > 0) {
      parts.push(
        `[RELEVANT MEMORIES]\n${relevantMemories.map((m) => `• ${m.content}`).join('\n')}\n[END MEMORIES]`
      );
    }

    // Rolling window: last 30 messages to stay within context limits
    const window = msgs.slice(-30);
    parts.push(window.map((m) => `${m.sender}: ${m.text}`).join('\n'));

    return parts.join('\n\n');
  };

  const handleApiResponse = (data: ContinueAdventureOutput) => {
    const newGmMessage: Message = {
      id: `gm-${Date.now()}`,
      sender: 'gm',
      text: data.narrative,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newGmMessage]);
    setPendingApiResponse(data);
    setIsTyping(true);
  };

  const handlePlayerAction = async (action: string) => {
    if (isLoading || isAwaitingRoll || isTyping || !action.trim() || !character) return;

    setIsLoading(true);
    setSuggestedActions([]);
    setLastRollResult(null);
    setRollDetails(undefined);

    const newPlayerMessage: Message = {
      id: `player-${Date.now()}`,
      sender: 'player',
      text: action,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newPlayerMessage];
    setMessages(updatedMessages);

    // Persist player message (fire-and-forget)
    if (gameId && sessionId) {
      saveMessage(gameId, sessionId, newPlayerMessage);
    }

    const storyContext = buildStoryContext(updatedMessages);

    try {
      const response = await getNextStoryPart({
        playerAction: action,
        storyContext: storyContext,
        character: character as any,
        crew: currentCrew as any,
        campaignPrompt: campaign.prompt,
        currentLocationIsLocked: activeLocationIsLocked,
        locationDiscovery,
        currentLocationId: character.currentLocationId,
        currentSectorId: currentSectorId,
        currentDestinationId: currentDestinationId,
      });

      if (response.success && response.data) {
        handleApiResponse(response.data);

        // Persist GM message + embed as memory (fire-and-forget)
        if (gameId && sessionId) {
          const gmMsg = {
            id: `gm-${Date.now()}`,
            sender: 'gm' as const,
            text: response.data.narrative,
            timestamp: Date.now(),
          };
          saveMessage(gameId, sessionId, gmMsg);
          embedAndSaveMemory(gameId, sessionId, response.data.narrative, {
            characterIds: currentCrew.map((c) => c.id).filter(Boolean),
            locationId: character.currentLocationId,
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
        setMessages((prev) => prev.filter(msg => msg.id !== newPlayerMessage.id));
      }
    } catch (e) {
      console.error('[GameView] getNextStoryPart threw:', e);
      toast({
        variant: 'destructive',
        title: 'Connection lost',
        description: 'The Warden lost the signal. Please try again.',
      });
      setMessages((prev) => prev.filter(msg => msg.id !== newPlayerMessage.id));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuggestedActionClick = (action: string) => {
    const graph = campaign.stationGraph;
    if (!graph) {
        // Fallback for legacy campaigns
        if (action.toLowerCase().startsWith('enter ')) {
            const targetName = action.replace(/\s*\(\d+\s*Cr\)$/i, '').slice('enter '.length).trim();
            const targetLoc = campaign.locations?.find(l => l.name?.toLowerCase() === targetName.toLowerCase());
            if (targetLoc) {
                setCharacter(prev => ({ ...prev, currentLocationId: targetLoc.uuid, location: targetLoc.name ?? prev.location }));
                setLocation(targetLoc.name);
                setSuggestedActions(targetLoc.actions ?? []);
                return;
            }
        }
        handlePlayerAction(action);
        return;
    }

    // 1. Handle "Return to [Location]"
    if (action.startsWith('Return to ')) {
        const targetName = action.slice('Return to '.length).trim();
        const targetLoc = graph.locations.find(l => l.name?.toLowerCase() === targetName.toLowerCase());
        if (targetLoc) {
            setCurrentDestinationId(undefined);
            setCharacter(prev => ({ ...prev, currentLocationId: targetLoc.uuid, location: targetLoc.name ?? prev.location }));
            setLocation(targetLoc.name);
            setSuggestedActions(targetLoc.actions ?? []);
            return;
        }
    }

    // 2. Handle "Go to [Destination]"
    if (action.startsWith('Go to ')) {
        const targetName = action.slice('Go to '.length).trim();
        const targetDest = graph.destinations.find(d => d.name?.toLowerCase() === targetName.toLowerCase() && d.locationId === character.currentLocationId);
        if (targetDest) {
            setCurrentDestinationId(targetDest.uuid);
            setLocation(targetDest.name);
            setSuggestedActions(targetDest.actions ?? []);
            return;
        }
    }

    // 3. Handle "Travel to [Sector]"
    if (action.startsWith('Travel to ')) {
        const match = action.match(/Travel to ([^(]+) \(([^)]+)\)/);
        if (match) {
            const targetSectorName = match[1].trim();
            const corridorName = match[2].trim();
            const targetSector = graph.sectors.find(s => s.name?.toLowerCase() === targetSectorName.toLowerCase());
            const currentSector = graph.sectors.find(s => s.id === currentSectorId);
            const connection = currentSector?.sectorConnections.find(c => c.passageName === corridorName);

            if (targetSector && connection) {
                const cost = calculateTransitCost(currentSectorId, targetSector.id, connection.cost);
                if ((character.credits ?? 0) < cost) {
                    toast({ variant: 'destructive', title: 'Insufficient Credits', description: `Travel to ${targetSectorName} costs ${cost} Cr.` });
                    return;
                }

                // Deduct credits
                const newCredits = (character.credits ?? 0) - cost;
                setCharacter(prev => ({ ...prev, credits: newCredits }));
                
                // Move to target sector (defaults to its first location or first arrival point)
                setCurrentSectorId(targetSector.id);
                const firstLocId = targetSector.locationIds[0];
                const firstLoc = graph.locations.find(l => l.uuid === firstLocId);
                
                if (firstLoc) {
                    setCharacter(prev => ({ ...prev, currentLocationId: firstLoc.uuid, location: firstLoc.name ?? prev.location }));
                    setLocation(firstLoc.name);
                    setSuggestedActions(firstLoc.actions ?? []);
                }

                toast({ title: 'Transit Complete', description: `Arrived at ${targetSectorName} via ${corridorName}.` });
                return;
            }
        }
    }

    // 4. Handle "Enter [Location]" (Intra-sector navigation)
    if (action.toLowerCase().startsWith('enter ')) {
      const cleanAction = action.replace(/\s*\(\d+\s*Cr\)$/i, '');
      const targetName = cleanAction.slice('enter '.length).trim();
      
      const locations = graph.locations;
      const currentLoc = locations.find(l => l.uuid === character.currentLocationId);
      const targetLoc = locations.find(l => l.name?.toLowerCase() === targetName.toLowerCase());

      if (targetLoc && currentLoc) {
        const connection = currentLoc.connections?.find(conn => conn.toLocationId === targetLoc.uuid);
        const travelCost = calculateTransitCost(currentLoc.sectorId, targetLoc.sectorId, connection?.cost);

        if (connection) {
          const traversal = canTraverse({ ...connection, cost: travelCost }, character.credits, character.inventory);
          if (!traversal.canPass) {
            toast({ variant: 'destructive', title: 'Access Denied', description: traversal.reason });
            return;
          }
        }

        if (travelCost > 0) {
            const newCredits = (character.credits ?? 0) - travelCost;
            setCharacter(prev => ({ ...prev, credits: newCredits }));
            toast({ title: 'Credits Deducted', description: `Paid ${travelCost} credits for travel to ${targetLoc.name}.` });
        }

        setCharacter(prev => ({ ...prev, currentLocationId: targetLoc.uuid, location: targetLoc.name ?? prev.location }));
        setLocation(targetLoc.name);
        setMediaOverride(undefined);
        setSuggestedActions(targetLoc.actions ?? []);
        return;
      }
    }

    // Default: submit as a normal player action
    handlePlayerAction(action);
    if (playerInputRef.current) playerInputRef.current.value = '';
  };


  const handleDiceRoll = async (rollValue: number) => {
    if (!isAwaitingRoll || isTyping || !character) return;

    setIsLoading(true);
    setIsAwaitingRoll(false);
    setSuggestedActions([]);
    
    const tempRollResult: RollResult = { value: rollValue };
    setLastRollResult(tempRollResult);
    
    setRollDetails(undefined);

    const rollMessage: Message = {
      id: `player-${Date.now()}`,
      sender: 'player',
      text: `(Rolled a ${rollValue})`,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, rollMessage];
    setMessages(updatedMessages);

    // Persist roll message (fire-and-forget)
    if (gameId && sessionId) {
      saveMessage(gameId, sessionId, rollMessage);
    }

    const storyContext = buildStoryContext(updatedMessages);

    try {
      const response = await resolveDiceRoll({
        playerAction: 'Player rolled the dice.',
        storyContext,
        character: character as any,
        crew: currentCrew as any,
        diceRollResult: rollValue,
        campaignPrompt: campaign.prompt,
        currentLocationIsLocked: activeLocationIsLocked,
        locationDiscovery,
        currentLocationId: character.currentLocationId,
        currentSectorId: currentSectorId,
        currentDestinationId: currentDestinationId,
      });

      if (response.success && response.data) {
        const newRollResult = {
          value: rollValue,
          outcome: response.data.rollOutcome,
          narrative: response.data.rollResultNarrative,
        };
        setLastRollResult(newRollResult);
        if (newRollResult.outcome && newRollResult.outcome !== 'none') {
          setShowRollResult(true);
        }
        handleApiResponse(response.data);

        // Persist GM response + embed as memory (fire-and-forget)
        if (gameId && sessionId) {
          const gmMsg = {
            id: `gm-${Date.now()}`,
            sender: 'gm' as const,
            text: response.data.narrative,
            timestamp: Date.now(),
          };
          saveMessage(gameId, sessionId, gmMsg);
          embedAndSaveMemory(gameId, sessionId, response.data.narrative, {
            characterIds: currentCrew.map((c) => c.id).filter(Boolean),
            locationId: character.currentLocationId,
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
        setMessages(prev => prev.slice(0, -1));
        setLastRollResult(null);
      }
    } catch (e) {
      console.error('[GameView] resolveDiceRoll threw:', e);
      toast({
        variant: 'destructive',
        title: 'Connection lost',
        description: 'The Warden lost the signal. Please try again.',
      });
      setMessages(prev => prev.slice(0, -1));
      setLastRollResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!character) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg text-muted-foreground">Loading Character...</p>
          </div>
      )
  }

  const overrideIsVideo = mediaOverride?.startsWith('data:video') || (mediaOverride && mediaOverride.includes('video%2F')) || (mediaOverride && mediaOverride.match(/\.(mp4|webm|ogg)/i) !== null);
  
  // Derive the persistent background from the player's current location
  const locationMedia = getLocationMedia(character.currentLocationId, currentSectorId, currentDestinationId);

  
  // AI events can push a mediaOverride; otherwise show the location's image
  const activeImageUrl = (!mediaOverride && !locationMedia.isVideo) ? locationMedia.url : (!overrideIsVideo && mediaOverride ? mediaOverride : undefined);
  const activeVideoUrl = (mediaOverride && overrideIsVideo) ? mediaOverride : (!mediaOverride && locationMedia.isVideo ? locationMedia.url : undefined);

  // Build a map of crew member locations for the roster
  const crewLocationNames = currentCrew.reduce<Record<string, string>>((acc, c) => {
    if (c.id && c.location) acc[c.id] = c.location;
    return acc;
  }, {});

  return (
      <div ref={gameViewRef} className="flex h-screen w-full flex-col bg-background text-foreground">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <main className="relative flex flex-1 flex-col">
                <div className="relative flex-1 overflow-hidden">
                    <MediaPanel imageUrl={activeImageUrl} videoUrl={activeVideoUrl} />
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                        {currentCrew.filter(m =>
                            !(currentUserId && m.playerId && m.playerId === currentUserId) &&
                            !(character.id && m.id && m.id === character.id)
                          ).length > 0 && (
                            <Button variant="outline" size="icon" onClick={() => setIsCrewRosterOpen(!isCrewRosterOpen)}>
                                <Users className="h-5 w-5" />
                                <span className="sr-only">Toggle Crew Roster</span>
                            </Button>
                        )}
                    </div>
                   
                    <CrewRoster 
                      crew={currentCrew.filter(m => {
                        // Exclude the active player's own character — it's shown in the character panel
                        const isCurrentPlayer = !!(currentUserId && m.playerId && m.playerId === currentUserId);
                        const isSameCharacter = !!(character.id && m.id && m.id === character.id);
                        return !isCurrentPlayer && !isSameCharacter;
                      })}
                      currentPlayerId={currentUserId}
                      playerNumbers={playerNumbers}
                      isOpen={isCrewRosterOpen}
                      locationNames={crewLocationNames}
                    />
                </div>
                <div className="p-4 flex items-center justify-end gap-3">
                    {isAwaitingRoll && !isTyping && (
                        <span className="animate-pulse text-sm font-bold tracking-widest text-yellow-400 uppercase">
                            ⚡ Roll Required
                        </span>
                    )}
                    <DiceRoller 
                        onRoll={handleDiceRoll} 
                        isAwaitingRoll={isAwaitingRoll && !isTyping} 
                    />
                </div>
              
              <RollResultPopup
                show={showRollResult}
                outcome={lastRollResult?.outcome}
                narrative={lastRollResult?.narrative}
                onClose={() => {
                    setShowRollResult(false);
                }}
              />
              <div className="absolute top-4 left-4 z-10 w-[30%]">
                 <h1 className="font-headline text-base font-bold text-white truncate text-shadow-lg mb-2">{campaign.name}</h1>
                <StoryPanel
                    messages={messages}
                    isLoading={isLoading}
                    characterName={character.name}
                    onTypewriterFinished={handleTypewriterFinish}
                />
              </div>
              <div
                className={cn(
                  'absolute top-4 left-4 z-10 w-[30%] transition-opacity duration-500',
                  inCombat ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
              >
                <CombatTracker combatants={combatants} />
              </div>

              <div className="absolute right-4 top-16 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">Toggle Sidebar</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] p-0 flex flex-col">
                      <div className="flex flex-col gap-6 overflow-y-auto p-6">
                        <CharacterPanel character={character} activeStat={rollDetails} playerNumber={playerNumber} />
                      </div>
                      <div className="mt-auto border-t p-4">
                        <GameControls rootRef={gameViewRef} />
                      </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="absolute bottom-4 left-4 w-4/5 z-20">
                <PlayerAction 
                  ref={playerInputRef} 
                  isLoading={isLoading || isTyping} 
                  onSubmit={handlePlayerAction}
                  suggestedActions={displayedSuggestedActions}
                  onSuggestedActionClick={handleSuggestedActionClick}
                  placeholder={isAwaitingRoll ? '🎲 Roll the d100 to continue...' : 'Type your action...'}
                  rightSlot={
                    otherPlayers.length > 0 ? (
                      <>
                        {otherPlayers.map((player) => {
                          const unread = unreadComms[player.playerId] ?? 0;
                          const isOpen = openCommWith?.playerId === player.playerId;
                          return (
                            <div key={player.playerId} className="relative">
                              {/* Floating comm panel — anchored above the button */}
                              {isOpen && (
                                <div className="absolute bottom-full right-0 mb-2 z-50">
                                  <CommPanel
                                    otherCharacterName={player.characterName}
                                    playerLabel={player.playerLabel}
                                    messages={commMessages[player.playerId] ?? []}
                                    currentUserId={currentUserId!}
                                    onSend={(msg) => sendComm(player.playerId, player.characterName, msg)}
                                    onClose={() => setOpenCommWith(null)}
                                  />
                                </div>
                              )}
                              {/* Comm button */}
                              <button
                                onClick={() =>
                                  isOpen ? setOpenCommWith(null) : handleOpenComm(player)
                                }
                                title={`Open comm channel with ${player.characterName} (${player.playerLabel})`}
                                className={cn(
                                  'relative h-8 w-8 rounded-lg border text-[11px] font-bold transition-all',
                                  isOpen
                                    ? 'border-cyan-400/80 bg-cyan-900/60 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                                    : 'border-white/20 bg-black/40 text-white/60 hover:border-cyan-500/50 hover:bg-cyan-950/40 hover:text-cyan-300'
                                )}
                              >
                                {player.playerLabel}
                                {unread > 0 && (
                                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                                    {unread > 9 ? '9+' : unread}
                                  </span>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </>
                    ) : undefined
                  }
                />
              </div>


            </main>
          </div>
          <aside className="hidden w-80 flex-col border-l border-border bg-background p-4 lg:flex xl:w-96">
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
              <CharacterPanel character={character} activeStat={rollDetails} playerNumber={playerNumber} />
              {/* DEV ONLY: Location Discovery Debug Panel */}
              {process.env.NODE_ENV === 'development' && (
                <details className="rounded-lg border border-yellow-500/30 bg-yellow-950/20 p-3 text-xs" open>
                  <summary className="cursor-pointer select-none font-bold tracking-widest text-yellow-400 uppercase mb-2">
                    🗺️ Discovery Debug
                  </summary>
                  <div className="space-y-1 mt-2">
                    {campaign.locations && campaign.locations.length > 0 ? (
                      campaign.locations.map((loc) => {
                        const isKnown = locationDiscovery[loc.uuid] ?? false;
                        return (
                          <div
                            key={loc.uuid}
                            className={cn(
                              'flex items-center justify-between gap-2 rounded px-2 py-1',
                              isKnown ? 'bg-green-950/40' : 'bg-red-950/30'
                            )}
                          >
                            <span className={cn('truncate font-mono', isKnown ? 'text-green-300' : 'text-red-400/70')}>
                              {loc.name}
                            </span>
                            <span className={cn('shrink-0 font-bold', isKnown ? 'text-green-400' : 'text-red-500')}>
                              {isKnown ? '✓ KNOWN' : '✗ HIDDEN'}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-white/40 italic">No locations loaded.</p>
                    )}
                    <p className="mt-2 text-white/30 font-mono">
                      gameId: {gameId ?? 'none'}
                    </p>
                  </div>
                </details>
              )}
            </div>
            <div className="mt-auto border-t pt-4">
                <GameControls
                  rootRef={gameViewRef}
                  onQuit={async () => {
                    if (gameId && sessionId && messages.length > 1) {
                      await summarizeAndSaveSession(
                        gameId,
                        sessionId,
                        sessionCount,
                        messages.map((m) => ({ sender: m.sender, text: m.text, timestamp: m.timestamp }))
                      );
                    }
                  }}
                />
            </div>
          </aside>
        </div>
      </div>
  );
}
