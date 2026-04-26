
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/layout/header';
import { ArrowRight, LoaderCircle, PlusCircle, LogIn, BookOpen } from 'lucide-react';
import { AuthForm } from '@/components/auth/auth-form';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { JoinGameDialog } from '@/components/game/join-game-dialog';
import { useRouter } from 'next/navigation';
import { cancelGame } from './actions';
import { updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { AppSettings, Game, Campaign as CampaignType } from '@/lib/types';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GameLobby } from '@/components/game/multiplayer-lobby';
import { CrewAssembly } from '@/components/crew/crew-assembly';
import { StartScreen } from '@/app/start-screen';
import { cn } from '@/lib/utils';

type AuthTab = 'sign-in' | 'sign-up';
type HostingState = 'idle' | 'hosting-lobby' | 'assembling-crew' | 'selecting-campaign';

// Function to generate a random 12-character alphanumeric code formatted as AAAA-BBBB-CCCC
const generateGameCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generatePart = (length: number) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    return `${generatePart(4)}-${generatePart(4)}-${generatePart(4)}`;
};


export function TitleScreen() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isJoinLobbyOpen, setIsJoinLobbyOpen] = useState(false);
  const [isCreatingLobby, setIsCreatingLobby] = useState(false);
  const [activeLobbyId, setActiveLobbyId] = useState<string | null>(null);
  const [activeAuthTab, setActiveAuthTab] = useState<AuthTab>('sign-up');
  const [hostingState, setHostingState] = useState<HostingState>('idle');


  const router = useRouter();
  const { toast } = useToast();

  const settingsRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'app-settings', 'global');
  }, [firestore]);

  const { data: appSettings } = useDoc<AppSettings>(settingsRef);

  const defaultBackgroundImage = PlaceHolderImages.find(
    (img) => img.id === 'title-screen-background'
  );

  const backgroundImage = appSettings?.titleScreenImageUrl || defaultBackgroundImage?.imageUrl;


  const handleAuthClick = (tab: AuthTab) => {
    setActiveAuthTab(tab);
    setIsAuthModalOpen(true);
  };
  
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };
  
  const handleJoinLobbyClick = () => {
      setIsJoinLobbyOpen(true);
  }

  const handleHostGame = async () => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to host a game.',
      });
      return;
    }

    setIsCreatingLobby(true);
    const gameCode = generateGameCode();
    
    try {
        const gameRef = doc(firestore, 'games', gameCode);
        const creationTime = new Date().toISOString();

        const newGame: Game = {
            id: gameCode,
            hostUid: user.uid,
            players: [user.uid],
            gameCode: gameCode,
            campaignId: null,
            createdAt: creationTime,
        };
        
        await setDoc(gameRef, newGame);
        setActiveLobbyId(newGame.id);
        setHostingState('hosting-lobby');

    } catch (error) {
         console.error("Error creating game:", error);
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to create the game lobby. Please try again.',
        });
    } finally {
        setIsCreatingLobby(false);
    }
  };

  const handleCancelLobby = async (gameId: string) => {
    const result = await cancelGame(gameId);
    if (result.success) {
      setActiveLobbyId(null);
      setHostingState('idle');
      toast({
        title: 'Lobby Cancelled',
        description: 'The game lobby has been removed.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to cancel the lobby.',
      });
    }
  };
  
  const handlePlaySolo = () => {
    router.push('/campaigns');
  };

  const handleCrewAssemblyComplete = () => {
    setHostingState('selecting-campaign');
  }

  const handleCampaignSelect = async (campaign: CampaignType) => {
    if (!activeLobbyId || !firestore) return;
    try {
      const gameRef = doc(firestore, 'games', activeLobbyId);
      await updateDoc(gameRef, { campaignId: campaign.id });
      router.push(`/game/${activeLobbyId}`);
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not start the game. Please try again.',
      });
    }
  };

  const renderContent = () => {
    if (isCreatingLobby) {
        return (
            <div className="flex flex-col items-center gap-4">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg text-white/80">Creating your lobby...</p>
            </div>
        );
    }

    if (user) {
        switch (hostingState) {
            case 'hosting-lobby':
                 if (activeLobbyId) {
                    return (
                        <GameLobby 
                            gameId={activeLobbyId} 
                            onCancel={() => handleCancelLobby(activeLobbyId)} 
                            onStart={() => setHostingState('assembling-crew')}
                        />
                    );
                }
                break;
            case 'assembling-crew':
                 if (activeLobbyId) {
                    return (
                        <CrewAssembly 
                            gameId={activeLobbyId}
                            onComplete={handleCrewAssemblyComplete}
                        />
                    );
                }
                break;
            case 'selecting-campaign':
                return (
                    <Card className="w-full max-w-5xl bg-[#1c1c3c]/50 border-blue-500/50 text-white">
                         <CardHeader className="text-center">
                            <div className="flex items-center justify-center gap-3">
                                <BookOpen className="h-8 w-8 text-blue-400" />
                                <CardTitle className="text-4xl font-bold font-headline">SELECT CAMPAIGN</CardTitle>
                            </div>
                            <CardDescription className="text-lg text-white/80 mt-2">
                                Choose the story your crew will embark on.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <StartScreen 
                                onCampaignSelect={handleCampaignSelect} 
                                hosting={true} 
                            />
                        </CardContent>
                    </Card>
                );
            case 'idle':
            default:
                 return (
                    <div className="w-full max-w-4xl p-6">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold font-headline uppercase">WELCOME TO INFINITY QUEST RPG</h1>
                            <p className="text-lg text-white/80 max-w-xl mx-auto">
                            Host a game or join a crew. AI crew members fill any empty slots.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <Card className="bg-[#1c1c3c]/50 border-blue-500/50 text-left flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <PlusCircle className="h-8 w-8 text-blue-400" />
                                        <CardTitle className="text-2xl font-bold">Host a Game</CardTitle>
                                    </div>
                                    <CardDescription className="text-white/70 pt-2">
                                        Host a new game and invite your friends or play solo.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <p className="text-sm text-white/60 flex-grow">
                                        Generate a unique game code. Play solo or with friends — AI NPCs fill any open crew slots.
                                    </p>
                                    <Button onClick={handleHostGame} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-11">
                                        Host New Game
                                    </Button>
                                </CardContent>
                            </Card>
                            <Card className="bg-[#2c1e4a]/50 border-purple-500/50 text-left flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <LogIn className="h-8 w-8 text-purple-400" />
                                        <CardTitle className="text-2xl font-bold">Join a Game</CardTitle>
                                    </div>
                                    <CardDescription className="text-white/70 pt-2">
                                        Join an existing game with a code.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <p className="text-sm text-white/60 flex-grow">
                                        An adventure is already underway! Enter a code to join their crew.
                                    </p>
                                    <Button onClick={handleJoinLobbyClick} className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold h-11">
                                        Join a Game
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
        }
    }

    // Show landing content while auth loads OR when unauthenticated.
    // Returning null during isUserLoading causes a blank SSR/CDN-cached page.
    if (!user) {
        return (
            <div className="space-y-6">
                <h1 className="font-headline text-5xl font-bold uppercase tracking-wider text-shadow-lg sm:text-6xl md:text-7xl">
                    INFINITY QUEST RPG
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-white/80 md:text-xl">
                    An AI-powered Game Master for the Mothership Sci-Fi Horror RPG. Your next nightmare is just a click away.
                </p>
                {isUserLoading ? (
                    <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-white/60" />
                ) : (
                    <Button size="lg" className="h-12 text-lg" onClick={() => handleAuthClick('sign-up')}>
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>
        );
    }
  }

  const getContainerClass = () => {
    switch(hostingState) {
        case 'hosting-lobby':
            return 'max-w-2xl';
        case 'assembling-crew':
            return 'max-w-full px-8';
        case 'selecting-campaign':
            return 'max-w-5xl';
        default:
            return 'max-w-4xl';
    }
  }
  
  const showHeader = !user || (user && hostingState === 'idle');


  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Title screen background"
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      
      {showHeader && (
        <Header 
          onAuthClick={handleAuthClick}
        />
      )}

      <main className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
        <div className={cn("w-full transition-all duration-300", getContainerClass())}>
            {renderContent()}
        </div>
      </main>

       <AuthForm 
        open={isAuthModalOpen} 
        onOpenChange={setIsAuthModalOpen}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={activeAuthTab}
      />
       <JoinGameDialog 
        open={isJoinLobbyOpen} 
        onOpenChange={setIsJoinLobbyOpen}
      />
    </div>
  );
}
