
'use server';

/**
 * @fileOverview This flow generates creative text for a Mothership RPG character.
 *
 * - generateCharacterCreatives - The main function to generate descriptions.
 */
import { ai } from '@/ai/genkit';
import {
    GenerateCharacterCreativesInputSchema,
    GenerateCharacterCreativesOutputSchema,
    type GenerateCharacterCreativesInput,
    type GenerateCharacterCreativesOutput,
} from '@/ai/schemas';


export async function generateCharacterCreatives(
  input: GenerateCharacterCreativesInput
): Promise<GenerateCharacterCreativesOutput> {
  return generateCharacterCreativesFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateCharacterCreativesPrompt',
  input: { schema: GenerateCharacterCreativesInputSchema },
  output: { schema: GenerateCharacterCreativesOutputSchema },
  prompt: `You are a character concept artist for the Mothership Sci-Fi Horror RPG.
  Your tone is gritty, industrial, and grounded in a "used future" aesthetic like the movie Alien.
  You are generating a concept for a character named {{characterName}} who is a {{characterClass}}.

  Generate the following creative assets for the character:
  1. A short physical description.
  2. A brief backstory.

  The description and backstory should be about {{characterName}}.
  Keep the descriptions concise and evocative. Focus on details that hint at a larger story. Avoid clichés.`,
});

const generateCharacterCreativesFlow = ai.defineFlow(
  {
    name: 'generateCharacterCreativesFlow',
    inputSchema: GenerateCharacterCreativesInputSchema,
    outputSchema: GenerateCharacterCreativesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
