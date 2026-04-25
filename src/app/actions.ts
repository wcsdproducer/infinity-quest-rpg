
'use server';

import { z } from 'zod';
import { continueAdventure } from '@/ai/flows/continue-adventure';
import { generateCharacterCreatives } from '@/ai/flows/generate-character-creatives';
import {
  type ContinueAdventureInput,
  ContinueAdventureOutputSchema,
  type ContinueAdventureOutput,
  CharacterClass,
} from '@/ai/schemas';
import { getFirestore, serverTimestamp, deleteDoc, writeBatch } from 'firebase/firestore';
import { initializeServerFirebase } from '@/firebase/server-init';
import type { Game, Character, CharacterGenerationResult } from '@/lib/types';
import { setDoc, doc, updateDoc, collection } from 'firebase/firestore';
import { createCharacter } from '@/services/character-generation';


async function handleAdventure(input: ContinueAdventureInput): Promise<{ success: boolean, data: ContinueAdventureOutput | null, error?: string }> {
  try {
    const result = await continueAdventure(input);
    const parsedData = ContinueAdventureOutputSchema.safeParse(result);

    if (!parsedData.success) {
      console.error("AI output validation failed:", parsedData.error);
      throw new Error("Received invalid data structure from AI.");
    }
    
    return { success: true, data: parsedData.data };

  } catch (error: any) {
    console.error("Error in continueAdventure flow:", error);
    
    const isRateLimitError = error.message && error.message.includes('429');

    const recoveryNarrative = isRateLimitError
      ? "The connection to the mothership is overloaded due to high traffic. Stand by... (You've hit the free tier rate limit. Please wait a minute and try again)."
      : "The connection crackles. For a moment, you hear only static, a hollow echo from the void. You should probably repeat your last action.";
      
    // Construct a minimal recovery state that still passes validation
    const recoveryState: ContinueAdventureOutput = {
      narrative: recoveryNarrative,
      rollRequired: false,
      rollType: 'none',
      rollDetails: 'none',
      updatedCrew: input.crew || [input.character], // Return original crew/character
      inCombat: false,
      combatants: [],
      suggestedActions: [
        "Try again",
        "Take a moment to check your gear",
      ],
      rollOutcome: 'none',
    };
    
    return { success: true, data: recoveryState };
  }
}


export async function getNextStoryPart(input: ContinueAdventureInput) {
  return handleAdventure(input);
}

export async function resolveDiceRoll(input: ContinueAdventureInput) {
  return handleAdventure(input);
}

export async function cancelGame(gameId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { firestore } = initializeServerFirebase();
        const gameRef = doc(firestore, 'games', gameId);
        await deleteDoc(gameRef);
        return { success: true };
    } catch (error) {
        console.error("Error cancelling game:", error);
        // It's possible the client error is a permissions issue.
        // We can check error.code if needed.
        return { success: false, error: "Failed to cancel the game lobby." };
    }
}


export async function generateCharacterAction(playerClass?: (typeof CharacterClass)[number]): Promise<CharacterGenerationResult & { playerId: null }> {
    const character = await createCharacter(playerClass);
    try {
      const creatives = await generateCharacterCreatives({
        characterClass: character.class as (typeof CharacterClass)[number],
        characterName: character.name,
      });
      return {
        ...character,
        ...creatives,
        playerId: null,
      };
    } catch (error: any) {
      console.error('Error generating character creatives:', error);
       // Check for a fetch error specifically, which might indicate a network or AI service issue
      if (error.cause && (error.cause as any).code === 'UND_ERR_CONNECT_TIMEOUT' || error.message.includes('fetch')) {
         return {
            ...character,
            description: 'A newly awakened spacer, the details of their past are a blur of cryo-sleep and recycled air. They look like they\'ve seen better days.',
            backstory: 'They signed on for the first outbound ship they could find, looking for a paycheck and a way out. They didn\'t ask too many questions.',
            playerId: null,
        };
      }
      // Return the base character even if AI fails for other reasons
      return {
        ...character,
        description: 'A newly awakened spacer, the details of their past are a blur of cryo-sleep and recycled air. They look like they\'ve seen better days.',
        backstory: 'They signed on for the first outbound ship they could find, looking for a paycheck and a way out. They didn\'t ask too many questions.',
        playerId: null,
      };
    }
}

export async function selectCampaignForGame(gameId: string, campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { firestore } = initializeServerFirebase();
        const gameRef = doc(firestore, 'games', gameId);
        await updateDoc(gameRef, { campaignId });
        return { success: true };
    } catch (error) {
        console.error("Error selecting campaign:", error);
        return { success: false, error: "Failed to select campaign." };
    }
}

export async function setGameCrew(gameId: string, crew: Character[]): Promise<{ success: boolean; error?: string }> {
    try {
        const { firestore } = initializeServerFirebase();
        const batch = writeBatch(firestore);
        
        crew.forEach((character) => {
            const characterRef = doc(firestore, 'games', gameId, 'characters', character.id);
            const plainCharacter = JSON.parse(JSON.stringify(character));
            batch.set(characterRef, plainCharacter);
        });

        await batch.commit();

        return { success: true };
    } catch (error: any) {
        console.error("Error setting game crew:", error);
        return { success: false, error: `Failed to save crew to the game. Reason: ${error.message}` };
    }
}

/**
 * Mark a location as discovered for a game (called when the Warden signals
 * `newlyDiscoveredLocationId` in its response). Persists to the game state doc.
 */
export async function discoverLocationAction(
  gameId: string,
  locationId: string
): Promise<{ success: boolean; locationDiscovery?: Record<string, boolean>; error?: string }> {
  try {
    const { discoverLocation } = await import('@/lib/game-memory');
    const updated = await discoverLocation(gameId, locationId);
    return { success: true, locationDiscovery: updated };
  } catch (error: any) {
    console.error('Error discovering location:', error);
    return { success: false, error: error.message };
  }
}
