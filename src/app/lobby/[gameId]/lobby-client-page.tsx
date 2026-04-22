
'use client';

import { useState } from 'react';
import { FirebaseClientProvider, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import type { Game } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Clipboard, ClipboardCheck, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function LobbyContent({ gameId }: { gameId: string }) {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const router = useRouter();

    const [isCopied, setIsCopied] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const gameRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'games', gameId);
    }, [firestore, gameId]);

    const { data: game, isLoading: isGameLoading } = useDoc<Game>(gameRef);

    const handleCopyCode = () => {
        if (!game?.gameCode) return;
        navigator.clipboard.writeText(game.gameCode).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const handleJoinGame = async () => {
        if (!user || !gameRef || !game) return;

        if (game.players.includes(user.uid)) {
            router.push(`/game/${game.id}`);
            return;
        }

        setIsJoining(true);
        try {
            await updateDoc(gameRef, {
                players: arrayUnion(user.uid)
            });
            toast({
                title: 'Joined!',
                description: "You've been added to the game lobby.",
            });
            // The useDoc hook will automatically show the updated player list.
        } catch (error) {
            console.error("Error joining game:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to join the game lobby. It may be full or no longer exist.',
            });
        } finally {
            setIsJoining(false);
        }
    };
    
    const isPlayerInGame = user && game?.players.includes(user.uid);
    const isHost = user?.uid === game?.hostUid;

    const renderLobbyState = () => {
        if (isGameLoading || isUserLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Loading Lobby...</p>
                </div>
            );
        }

        if (!game) {
            return <p className="text-destructive text-lg">Lobby not found.</p>;
        }

        if (game.campaignId) {
             // Game has started, redirect player to the game
             if (isPlayerInGame) {
                router.push(`/game/${game.id}`);
                return (
                     <div className="flex flex-col items-center justify-center h-full">
                        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Game has started, joining now...</p>
                    </div>
                )
            } else {
                 return <p className="text-destructive text-lg">This game has already started and is no longer accepting new players.</p>;
            }
        }

        return (
            <Card className="w-full max-w-2xl bg-[#1c1c3c]/80 border-blue-500/50 text-white backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold font-headline">Game Lobby</CardTitle>
                    <CardDescription className="text-white/70">
                        The host will start the game once all players have joined.
                    </CardDescription>
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

                    {!isPlayerInGame && (
                        <div className="text-center pt-4">
                            <Button size="lg" onClick={handleJoinGame} disabled={isJoining} className="bg-green-600 hover:bg-green-700">
                                {isJoining && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Join Game
                            </Button>
                        </div>
                    )}
                     {isPlayerInGame && !isHost && (
                        <div className="text-center text-white/70 pt-4">
                            Waiting for the host to start the game...
                        </div>
                    )}
                    {isHost && (
                         <div className="text-center text-white/70 pt-4">
                            You are the host. You can start the game from the main menu.
                        </div>
                    )}

                </CardContent>
            </Card>
        );
    };

    return (
        <div className="relative min-h-screen w-full bg-background text-foreground flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                {renderLobbyState()}
            </main>
        </div>
    );
}

export default function LobbyClientPage({ params }: { params: { gameId: string } }) {
  return (
    <FirebaseClientProvider>
      <LobbyContent gameId={params.gameId} />
    </FirebaseClientProvider>
  );
}
