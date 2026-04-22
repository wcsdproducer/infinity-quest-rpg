'use server';

/**
 * @fileOverview Summarizes the previous game session for the player.
 *
 * - summarizeSessionLog - A function that summarizes the session log.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizeSessionLogInputSchema,
  SummarizeSessionLogOutputSchema,
  type SummarizeSessionLogInput,
  type SummarizeSessionLogOutput,
} from '@/ai/schemas';

export async function summarizeSessionLog(
  input: SummarizeSessionLogInput
): Promise<SummarizeSessionLogOutput> {
  return summarizeSessionLogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSessionLogPrompt',
  input: {schema: SummarizeSessionLogInputSchema},
  output: {schema: SummarizeSessionLogOutputSchema},
  prompt: `You are an AI Game Master for the Mothership TTRPG.
  Your task is to summarize the provided game session log so that the player can quickly remember what happened.
  The summary should be concise and focus on key events and decisions.

  Session Log: {{{sessionLog}}}
  Summary:`,
});

const summarizeSessionLogFlow = ai.defineFlow(
  {
    name: 'summarizeSessionLogFlow',
    inputSchema: SummarizeSessionLogInputSchema,
    outputSchema: SummarizeSessionLogOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
