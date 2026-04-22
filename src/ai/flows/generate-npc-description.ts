'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating NPC descriptions.
 *
 * - generateNpcDescription - A function that generates NPC descriptions based on game context.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateNpcDescriptionInputSchema,
  GenerateNpcDescriptionOutputSchema,
  type GenerateNpcDescriptionInput,
  type GenerateNpcDescriptionOutput,
} from '@/ai/schemas';

export async function generateNpcDescription(
  input: GenerateNpcDescriptionInput
): Promise<GenerateNpcDescriptionOutput> {
  return generateNpcDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNpcDescriptionPrompt',
  input: {schema: GenerateNpcDescriptionInputSchema},
  output: {schema: GenerateNpcDescriptionOutputSchema},
  prompt: `You are the game master for a game of Mothership.

    Based on the following context, generate an NPC description:

    Context: {{{context}}}

    Description:`,
});

const generateNpcDescriptionFlow = ai.defineFlow(
  {
    name: 'generateNpcDescriptionFlow',
    inputSchema: GenerateNpcDescriptionInputSchema,
    outputSchema: GenerateNpcDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
