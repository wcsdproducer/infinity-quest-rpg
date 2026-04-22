
'use client';

import { useState } from 'react';
import type { Game } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Clipboard, ClipboardCheck, ArrowLeft, PlusCircle, Users } from 'lucide-react';
import { useDoc, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';

type GameLobbyProps = {
    gameId: string;
    onCancel: () => void;
    onStart: () => void;
};

export function GameLobby({ gameId, onCancel, onStart }: GameLobbyProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [isCopied, setIsCopied] = useState(false);

    const gameRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'games', gameId);
    }, [firestore, gameId]);

    const { data: game, isLoading: isGameLoading } = useDoc<Game>(gameRef);
    
    if (isGameLoading) {
        return (
             <div className="flex flex-col items-center justify-center h-full">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading Lobby...</p>
            </div>
        )
    }

    if (!game) {
        return (
            <div className="flex flex-col items-center justify-center">
                <p className="text-destructive text-lg">Lobby not found or was cancelled.</p>
                 <Button variant="link" onClick={onCancel}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Menu
                </Button>
            </div>
        )
    }

    const handleCopyCode = () => {
        if (!game.gameCode) return;
        navigator.clipboard.writeText(game.gameCode).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    const isHost = user?.uid === game.hostUid;

    return (
        <Card className="w-full max-w-2xl bg-[#1c1c3c]/50 border-blue-500/50 text-white">
             <CardHeader className="text-left relative">
                <div className="flex items-center gap-3">
                    <PlusCircle className="h-8 w-8 text-blue-400" />
                    <CardTitle className="text-2xl font-bold">Game Lobby</CardTitle>
                </div>
                <CardDescription className="text-white/70 pt-2">
                    Share the code with your friends to have them join your game.
                </CardDescription>
                {isHost && (
                    <Button variant="ghost" size="sm" onClick={onCancel} className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4 rounded-lg border border-blue-500/50 bg-black/30 p-6">
                    <p className="text-lg font-medium text-blue-300">GAME CODE</p>
                    <div className="flex items-center gap-4">
                       <span className="font-mono text-4xl font-bold tracking-widest text-white">{game.gameCode}</span>
                       <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                        {isCopied ? <ClipboardCheck className="text-green-500" /> : <Clipboard />}
                       </Button>
                    </div>
                </div>
                
                <div>
                    <h3 className="mb-4 text-center font-headline text-xl flex items-center justify-center gap-2">
                        <Users className="h-5 w-5" />
                        PLAYERS ({game.players.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {game.players.map((playerId, index) => (
                            <div key={playerId} className="flex items-center gap-3 rounded-md bg-black/20 p-3 border border-white/10">
                                <span className="font-semibold">Player {index + 1}</span>
                                {game.hostUid === playerId && <span className="text-xs text-blue-400 font-bold">(Host)</span>}
                            </div>
                        ))}
                    </div>
                </div>
                
                {isHost && (
                     <div className="flex flex-col items-center pt-4">
                         <Button size="lg" onClick={onStart} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11">
                             Assemble Your Crew
                         </Button>
                         <p className="mt-2 text-xs text-white/60">Only the host can start the game.</p>
                     </div>
                )}
                 {!isHost && (
                    <div className="text-center">
                       <p className="text-white/70">Waiting for the host to start the game...</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

    