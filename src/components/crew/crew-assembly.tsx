
'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoaderCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateCharacterAction, setGameCrew } from '@/app/actions';
import type { Character, Game } from '@/lib/types';
import { CharacterPanel } from '@/components/game/character-panel';
import { CharacterClass } from '@/ai/schemas';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type CrewAssemblyProps = {
    gameId: string;
    onComplete?: () => void;
};

// This function is now a local helper inside the component.
const getCharacterClassesForCrew = (crewSize: number): CharacterClass[] => {
    if (crewSize !== 5) {
        // Fallback for different crew sizes, though we're standardizing on 5
        const classes: CharacterClass[] = ['Android', 'Teamster', 'Marine', 'Scientist'];
        const finalClasses: CharacterClass[] = [];
        for (let i = 0; i < crewSize; i++) {
            finalClasses.push(classes[i % classes.length]);
        }
        return finalClasses;
    }

    // --- Logic for a 5-person crew with exactly 1 Android and at least 1 of each human class ---
    const humanClasses: CharacterClass[] = ['Teamster', 'Marine', 'Scientist'];
    
    // 1. Start with the required set
    const finalClasses: CharacterClass[] = ['Android', 'Teamster', 'Marine', 'Scientist'];
    
    // 2. Add one more random human class to fill the 5th slot
    const randomHumanClass = humanClasses[Math.floor(Math.random() * humanClasses.length)];
    finalClasses.push(randomHumanClass);

    // 3. Shuffle the final list to randomize player assignment order
    for (let i = finalClasses.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalClasses[i], finalClasses[j]] = [finalClasses[j], finalClasses[i]];
    }
    
    return finalClasses;
};


export function CrewAssembly({ gameId, onComplete }: CrewAssemblyProps) {
    const [crew, setCrew] = useState<Character[]>([]);
    const [isGenerating, setIsGenerating] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const gameRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'games', gameId);
    }, [firestore, gameId]);
    const { data: game, isLoading: isLoadingGame } = useDoc<Game>(gameRef);
    
    const charactersRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'games', gameId, 'characters');
    }, [firestore, gameId]);
    const { data: savedCrew, isLoading: isLoadingCrew } = useCollection<Character>(charactersRef);

    const generateAndSaveCrew = useCallback(async () => {
        if (!game || (savedCrew && savedCrew.length > 0)) {
            if (savedCrew && savedCrew.length > 0) {
                setCrew(savedCrew);
                setIsGenerating(false);
            }
            return;
        }

        setIsGenerating(true);
        try {
            const numberOfCharacters = 5;
            const classesToGenerate = getCharacterClassesForCrew(numberOfCharacters);
            
            const characterPromises = classesToGenerate.map(charClass => {
                return generateCharacterAction(charClass);
            });

            const generatedCharacters = await Promise.all(characterPromises);

            const newCrew: Character[] = generatedCharacters.map((char, index) => ({
                ...char,
                // Assign players in order, leave the rest as NPCs (playerId: null)
                playerId: game.players[index] || null,
            }));
            
            setCrew(newCrew);
            setIsGenerating(false);
            
            // Now automatically save the crew
            setIsSaving(true);
            const result = await setGameCrew(gameId, newCrew);
            if (!result.success) {
                toast({
                    variant: 'destructive',
                    title: 'Error Saving Crew',
                    description: result.error || 'Could not save the generated crew.',
                });
            }
            
        } catch (error) {
            console.error("Failed to generate or save crew:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to generate the crew.',
            });
        } finally {
            setIsGenerating(false);
            setIsSaving(false);
        }
    }, [game, savedCrew, gameId, toast]);

    useEffect(() => {
        if (!isLoadingGame && !isLoadingCrew) {
            generateAndSaveCrew();
        }
    }, [isLoadingGame, isLoadingCrew, generateAndSaveCrew]);

    const isLoading = isGenerating || isLoadingGame || isLoadingCrew || isSaving;
    
    const finalCrew = (savedCrew && savedCrew.length > 0) ? savedCrew : crew;

    // Sort crew to show players first
    const sortedCrew = [...finalCrew].sort((a, b) => {
        if (a.playerId && !b.playerId) return -1;
        if (!a.playerId && b.playerId) return 1;
        return 0;
    });

    if (isLoading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center text-white">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">
                    {isGenerating ? 'Assembling Your Crew...' : 'Saving Crew Roster...'}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full text-white flex flex-col">
            {/* Header — always visible */}
            <div className="text-center mb-2 flex-shrink-0">
                <div className="flex items-center justify-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <h2 className="text-xl font-bold font-headline">ASSEMBLE YOUR CREW</h2>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                    Players are assigned to characters in the order they joined the lobby.
                </p>
            </div>
            
            {/* Cards — 80% width, centered, fills remaining height */}
            <div className="h-[80vh] flex items-stretch justify-center gap-4 py-2 mb-4 w-4/5 mx-auto">
                {sortedCrew.map((character) => {
                    const playerIndex = game?.players.findIndex(p => p === character.playerId);
                    const playerNumber = playerIndex !== -1 ? playerIndex + 1 : undefined;
                    
                    return (
                        <div key={character.id} className="flex-1 min-w-0 h-full flex flex-col">
                            <CharacterPanel character={character} playerNumber={playerNumber} />
                        </div>
                    );
                })}
            </div>

            {/* Footer button — always visible */}
            {onComplete && (
                <div className="text-center flex-shrink-0 pt-6">
                    <Button size="lg" onClick={onComplete} disabled={finalCrew.length === 0 || isLoading} className="bg-blue-600 hover:bg-blue-700 h-10 text-base">
                         {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Continue to Campaign Selection
                    </Button>
                </div>
            )}
        </div>
    );
}
