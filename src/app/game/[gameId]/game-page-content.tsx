
'use client';

import { FirebaseClientProvider, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { GameView } from '@/app/game-view';
import { doc, collection } from 'firebase/firestore';
import type { Campaign, Character, Game } from '@/lib/types';
import { LoaderCircle } from 'lucide-react';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemo } from 'react';

export function GamePageContent({ gameId }: { gameId: string }) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    // Fetch the game document
    const gameRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'games', gameId);
    }, [firestore, gameId]);
    const { data: game, isLoading: isGameLoading } = useDoc<Game>(gameRef);

    // Fetch the associated campaign document
    const campaignRef = useMemoFirebase(() => {
        if (!firestore || !game?.campaignId) return null;
        return doc(firestore, 'campaigns', game.campaignId);
    }, [firestore, game?.campaignId]);
    const { data: campaign, isLoading: isCampaignLoading } = useDoc<Campaign>(campaignRef);

    // Fetch the characters in the subcollection
    const charactersRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'games', gameId, 'characters');
    }, [firestore, gameId]);
    const { data: crew, isLoading: isCrewLoading } = useCollection<Character>(charactersRef);

    // Determine the current player's character by matching the user's UID with the character's playerId
    const playerCharacter = useMemo(() => {
        if (!user || !crew) return null;
        return crew.find(c => c.playerId === user.uid) || null;
    }, [user, crew]);

    // Determine the player number
    const playerNumber = useMemo(() => {
        if (!user || !game?.players) return undefined;
        const index = game.players.findIndex(p => p === user.uid);
        return index !== -1 ? index + 1 : undefined;
    }, [user, game?.players]);

    const isLoading = isUserLoading || isGameLoading || isCampaignLoading || isCrewLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg text-muted-foreground">Loading Your Mission...</p>
            </div>
        );
    }
    
    if (!campaign || !playerCharacter) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
                <p className="text-destructive text-lg">Error: Could not load game data.</p>
                <p className="text-muted-foreground mt-2">
                    The campaign may not have been selected or your character is missing.
                </p>
            </div>
        );
    }

    // Pass the current user's ID to the GameView
    return <GameView campaign={campaign} initialCharacter={playerCharacter} crew={crew || []} gameId={gameId} currentUserId={user?.uid} playerNumber={playerNumber} />;
}
