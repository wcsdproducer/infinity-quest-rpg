
'use client';

import { useState } from 'react';
import { GameView } from '@/app/game-view';
import { StartScreen } from '@/app/start-screen';
import type { Campaign } from '@/lib/types';
import { FirebaseClientProvider } from '@/firebase';
import type { Character } from '@/lib/types';
import { LoaderCircle } from 'lucide-react';
import { generateCharacterAction } from '../actions';

// This page is now dedicated to the SOLO game flow.
function SoloCampaignsPageContent() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleCampaignSelect = async (campaign: Campaign) => {
    setIsGenerating(true);
    try {
      const newCharacter = await generateCharacterAction();
      setCharacter(newCharacter);
      setSelectedCampaign(campaign);
    } catch (error) {
      console.error("Failed to generate solo character:", error);
      // Optionally, show a toast to the user
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (isGenerating) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
            Generating your character...
        </p>
      </div>
    );
  }
  
  if (selectedCampaign && character) {
    return <GameView campaign={selectedCampaign} initialCharacter={character} />;
  }

  // Show StartScreen for solo play.
  return (
     <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-center font-headline text-5xl font-bold text-primary mb-2">
          Select a Campaign
        </h1>
        <p className="text-center text-lg text-muted-foreground mb-8">
          Your mission awaits.
        </p>
        <StartScreen onCampaignSelect={handleCampaignSelect} />
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <FirebaseClientProvider>
      <SoloCampaignsPageContent />
    </FirebaseClientProvider>
  );
}
