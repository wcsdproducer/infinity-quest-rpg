import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { retrieveRelevantMemories } from '@/lib/game-memory';

export const queryLoreTool = ai.defineTool(
  {
    name: 'queryLore',
    description: 'Query episodic memory for past events, character interactions, and campaign lore. Use this to recall specific details the crew has experienced or learned.',
    inputSchema: z.object({
      gameId: z.string().describe('The ID of the current game session'),
      query: z.string().describe('The topic or question to search memory for'),
      topK: z.number().optional().describe('Number of relevant memories to retrieve (default: 5)'),
    }),
  },
  async ({ gameId, query, topK = 5 }) => {
    try {
      const memories = await retrieveRelevantMemories(gameId, query, topK);
      
      if (!memories || memories.length === 0) {
        return { result: "No relevant memories found." };
      }

      return {
        result: "Found relevant memories.",
        memories: memories.map(m => ({
          content: m.content,
          timestamp: new Date(m.timestamp).toISOString(),
          importance: m.importance,
        }))
      };
    } catch (error: any) {
      return { error: `Failed to query lore: ${error.message}` };
    }
  }
);
