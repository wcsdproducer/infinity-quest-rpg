
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { StoryPanel } from '@/components/game/story-panel';
import { CharacterPanel } from '@/components/game/character-panel';
import { DiceRoller } from '@/components/game/dice-roller';
import { CombatTracker } from '@/components/game/combat-tracker';
import type { Character, Message, CommMessage, SessionSummary, EpisodicMemory } from '@/lib/types';
import { getNextStoryPart, resolveDiceRoll } from '@/app/actions';
import {
  getOrCreateGameState,
  loadRecentMessages,
  getLatestSessionSummary,
  saveMessage,
  embedAndSaveMemory,
  retrieveRelevantMemories,
  summarizeAndSaveSession,
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
  const firestore = useFirestore();
  
  // Resolve the first image URL for a location by UUID.
  // Firebase Storage URLs end in ?alt=media&token=... so we check the path segment before '?'
  const getLocationImageUrl = useCallback((locationId?: string): string => {
    if (!locationId || !campaign.locations) return '/fallback-location-unknown.png';
    const loc = campaign.locations.find(l => l.uuid === locationId);

    // If the location is locked, show the exterior/access-restricted fallback
    if (loc?.isLocked) return '/fallback-location-locked.png';

    const firstMedia = loc?.mediaUrls?.find(m => {
      if (!m.url || m.url.startsWith('data:video')) return false;
      const pathPart = m.url.split('?')[0];
      return pathPart.match(/\.(png|jpg|jpeg|webp|gif)$/i) || m.url.includes('firebasestorage.googleapis.com');
    });

    // No uploaded image — show the generic atmospheric exterior until one is added
    return firstMedia?.url ?? '/fallback-location-unknown.png';
  }, [campaign.locations]);
  
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
  // Tracks which locked location UUIDs the player has earned access to this session.
  // Resets on page reload — for true persistence add to character schema in a future pass.
  const [sessionUnlockedLocationIds, setSessionUnlockedLocationIds] = useState<Set<string>>(new Set());
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
    if (!activeLocationIsLocked) return suggestedActions;
    // If the AI is surfacing an "Enter X" action, it means bypass was just granted — show it
    const hasEnterAction = suggestedActions.some(a => a.toLowerCase().startsWith('enter '));
    if (hasEnterAction) return suggestedActions;
    return LOCKED_LOCATION_ACTIONS;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocationIsLocked, suggestedActions]);

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
          const state = await getOrCreateGameState(gameId);
          setSessionId(state.sessionId);
          setSessionCount(state.sessionCount);

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


  // Persist currentLocationId to Firestore so other players see the change in real-time
  const persistLocationToFirestore = useCallback(async (characterId: string, locationId: string) => {
    if (!firestore || !gameId) return;
    try {
      const charRef = doc(firestore, 'games', gameId, 'characters', characterId);
      await updateDoc(charRef, { currentLocationId: locationId, location: campaign.locations?.find(l => l.uuid === locationId)?.name ?? undefined });
    } catch (e) {
      // Non-critical — local state is still correct
      console.warn('Could not persist location to Firestore:', e);
    }
  }, [firestore, gameId, campaign.locations]);

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
    // Detect "Enter [Location Name]" actions — these are direct location transitions,
    // not prompts to send to the AI.
    if (action.toLowerCase().startsWith('enter ')) {
      const targetName = action.slice('enter '.length).trim();
      const targetLoc = campaign.locations?.find(
        l => l.name?.toLowerCase() === targetName.toLowerCase()
      );
      if (targetLoc) {
        // Transition immediately: update character location to the interior
        setCharacter(prev => ({ ...prev, currentLocationId: targetLoc.uuid, location: targetLoc.name ?? prev.location }));
        setLocation(targetLoc.name);
        setMediaOverride(undefined);
        setSuggestedActions(targetLoc.actions ?? []);
        if (gameId && character.id) persistLocationToFirestore(character.id, targetLoc.uuid);
        // Add a narrative message so the log reflects the transition
        const entryMsg: Message = {
          id: `gm-${Date.now()}`,
          sender: 'gm',
          text: `You step inside. ${targetLoc.narrative ?? ''}`.trim(),
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, entryMsg]);
        return;
      }
    }
    // Default: submit as a normal player action
    handlePlayerAction(action);
    // Clear the textarea in case the user had typed something
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

  const isVideo = mediaOverride?.startsWith('data:video') || (mediaOverride && mediaOverride.includes('video%2F'));
  
  // Derive the persistent background from the player's current location
  const locationImageUrl = getLocationImageUrl(character.currentLocationId);
  // AI events can push a mediaOverride; otherwise show the location's image
  const activeImageUrl = !isVideo ? (mediaOverride || locationImageUrl) : undefined;
  const activeVideoUrl = isVideo ? mediaOverride : undefined;

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
