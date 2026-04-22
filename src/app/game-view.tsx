
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { StoryPanel } from '@/components/game/story-panel';
import { CharacterPanel } from '@/components/game/character-panel';
import { DiceRoller } from '@/components/game/dice-roller';
import { CombatTracker } from '@/components/game/combat-tracker';
import type { Character } from '@/lib/types';
import { getNextStoryPart, resolveDiceRoll } from '@/app/actions';
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
  MapPin,
  Users,
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

type GameViewProps = {
  campaign: Campaign;
  initialCharacter: Character; // For solo mode, this is the player's character
  crew?: Character[]; // For multiplayer, the full crew
  gameId?: string; // For multiplayer mode
  currentUserId?: string;
  playerNumber?: number; // Add playerNumber prop
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

export function GameView({ campaign, initialCharacter, crew = [], gameId, currentUserId, playerNumber }: GameViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const getInitialLocation = () => {
    if (campaign.startingLocationId) {
      const startingLoc = campaign.locations?.find(l => l.uuid === campaign.startingLocationId);
      if (startingLoc?.name) {
        return startingLoc.name;
      }
    }
    return 'an unknown location';
  };
  
  const [character, setCharacter] = useState<Character>({
      ...initialCharacter,
      location: getInitialLocation(),
  });

  const [currentCrew, setCurrentCrew] = useState<Character[]>(
      (crew.length > 0 ? crew : [initialCharacter]).map(c => ({
          ...c,
          location: getInitialLocation(),
      }))
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
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(campaign.initialMediaUrl);
  const [isCrewRosterOpen, setIsCrewRosterOpen] = useState(true);

  const gameViewRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const playerInputRef = useRef<HTMLTextAreaElement>(null);

    // Effect for the very first game load
  useEffect(() => {
    const startAdventure = () => {
        setIsLoading(true);

        const initialNarrative = campaign.initialMessage || `Your mission awaits.`;
        
        const initialMessage = getInitialMessage(initialNarrative, initialCharacter.name);

        setMessages([initialMessage]);
        
        // Set suggested actions based on the starting location, if available
        const startingLocation = campaign.locations?.find(l => l.uuid === campaign.startingLocationId);
        if (startingLocation?.actions) {
            setSuggestedActions(startingLocation.actions);
        }

        setIsLoading(false);
    };

    startAdventure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on component mount


  const handleTypewriterFinish = () => {
    setIsTyping(false);
    if (pendingApiResponse) {
      // The full crew state is now in `updatedCrew`.
      if (pendingApiResponse.updatedCrew && pendingApiResponse.updatedCrew.length > 0) {
        const updatedCrew = pendingApiResponse.updatedCrew;
        setCurrentCrew(updatedCrew);

        // Find the active character in the updated crew list.
        const updatedActiveCharacter = updatedCrew.find(c => c.id === character.id);
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
      
      if (pendingApiResponse.location) {
        setLocation(pendingApiResponse.location);
      }
      
      if (pendingApiResponse.mediaUrl) {
        setMediaUrl(pendingApiResponse.mediaUrl);
      }

      setPendingApiResponse(null);
    }
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

    const storyContext = updatedMessages.map((m) => `${m.sender}: ${m.text}`).join('\n');

    const response = await getNextStoryPart({
      playerAction: action,
      storyContext: storyContext,
      character: character,
      crew: currentCrew,
      campaignPrompt: campaign.prompt,
    });

    if (response.success && response.data) {
      handleApiResponse(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
      setMessages((prev) => prev.filter(msg => msg.id !== newPlayerMessage.id));
    }

    setIsLoading(false);
  };
  
  const handleSuggestedActionClick = (action: string) => {
    if (playerInputRef.current) {
      playerInputRef.current.value = action;
      playerInputRef.current.focus();
    }
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

    const storyContext = updatedMessages.map((m) => `${m.sender}: ${m.text}`).join('\n');

    const response = await resolveDiceRoll({
      playerAction: 'Player rolled the dice.',
      storyContext,
      character,
      crew: currentCrew,
      diceRollResult: rollValue,
      campaignPrompt: campaign.prompt,
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
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
      setMessages(prev => prev.slice(0, -1));
      setLastRollResult(null);
    }
    
    setIsLoading(false);
  };

  if (!character) {
      return (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
              <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-lg text-muted-foreground">Loading Character...</p>
          </div>
      )
  }

  const isVideo = mediaUrl?.startsWith('data:video') || (mediaUrl && mediaUrl.includes('video%2F'));

  return (
      <div ref={gameViewRef} className="flex h-screen w-full flex-col bg-background text-foreground">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <main className="relative flex flex-1 flex-col">
                <div className="relative flex-1 overflow-hidden">
                    <MediaPanel imageUrl={!isVideo ? mediaUrl : undefined} videoUrl={isVideo ? mediaUrl : undefined} />
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                         {location && (
                            <div className="rounded-md bg-black/50 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{character.location || location}</span>
                            </div>
                        )}
                        {currentCrew && currentCrew.length > 1 && (
                            <Button variant="outline" size="icon" onClick={() => setIsCrewRosterOpen(!isCrewRosterOpen)}>
                                <Users className="h-5 w-5" />
                                <span className="sr-only">Toggle Crew Roster</span>
                            </Button>
                        )}
                    </div>
                   
                    <CrewRoster 
                      crew={currentCrew} 
                      currentPlayerId={currentUserId}
                      isOpen={isCrewRosterOpen}
                    />
                </div>
                <div className="p-4 flex items-center justify-end">
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
                  isLoading={isLoading || isAwaitingRoll || isTyping} 
                  onSubmit={handlePlayerAction}
                  suggestedActions={suggestedActions}
                  onSuggestedActionClick={handleSuggestedActionClick}
                />
              </div>

            </main>
          </div>
          <aside className="hidden w-80 flex-col border-l border-border bg-background p-4 lg:flex xl:w-96">
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
              <CharacterPanel character={character} activeStat={rollDetails} playerNumber={playerNumber} />
            </div>
            <div className="mt-auto border-t pt-4">
                <GameControls rootRef={gameViewRef} />
            </div>
          </aside>
        </div>
      </div>
  );
}
