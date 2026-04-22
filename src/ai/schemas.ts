
import { z } from 'genkit';

const SkillSchema = z.object({
    name: z.string(),
    level: z.enum(['Trained', 'Expert', 'Master']),
});

const CharacterSchema = z.object({
  id: z.string().describe("The character's unique ID."),
  name: z.string(),
  class: z.string(),
  credits: z.number().describe("The character's current amount of universal credits (currency)."),
  highScore: z.number().optional().describe('The character\'s high score.'),
  description: z.string().optional(),
  backstory: z.string().optional(),
  location: z.string().optional().describe("The character's current physical location."),
  traumaResponse: z.string().describe("The character's class-specific rule for trauma and panic."),
  stats: z.object({
    strength: z.number(),
    speed: z.number(),
    intellect: z.number(),
    combat: z.number(),
  }),
  saves: z.object({
    sanity: z.number(),
    fear: z.number(),
    body: z.number(),
  }),
  modifiers: z.object({
    stats: z.object({
        strength: z.number(),
        speed: z.number(),
        intellect: z.number(),
        combat: z.number(),
    }),
    saves: z.object({
        sanity: z.number(),
        fear: z.number(),
        body: z.number(),
    }),
  }),
  health: z.object({
    current: z.number(),
    max: z.number(),
  }),
  armorPoints: z.number().describe('The amount of damage the character can ignore from most sources.'),
  stress: z.object({
    current: z.number(),
    min: z.number(),
  }),
  wounds: z.object({
    current: z.number(),
    max: z.number(),
  }),
  carryingCapacity: z.object({
    current: z.number(),
    max: z.number(),
  }).describe('The number of items the character is carrying vs. the maximum they can carry.'),
  skills: z.array(SkillSchema),
  inventory: z.array(z.string()),
  playerId: z.string().nullable().optional(),
});
export type Character = z.infer<typeof CharacterSchema>;

const CombatantSchema = z.object({
  id: z.string().describe("A unique identifier for the combatant (e.g., 'scrapper-1', 'player')."),
  name: z.string().describe("The combatant's name."),
  status: z.string().describe("A brief description of the combatant's current condition (e.g., 'Wounded', 'Taking Cover', 'Healthy').")
});
export type Combatant = z.infer<typeof CombatantSchema>;

export const ContinueAdventureInputSchema = z.object({
  storyContext: z.string().describe('The story so far, including the last thing the GM said.'),
  playerAction: z.string().describe("The player's intended action. This may be a description of an action, or the result of a dice roll."),
  character: CharacterSchema.describe("The acting player's current character sheet."),
  crew: z.array(CharacterSchema).optional().describe('The entire crew of characters in the game, including the acting character.'),
  diceRollResult: z.number().optional().describe('The result of a dice roll, if one was requested.'),
  campaignPrompt: z.string().describe('The prompt for the selected campaign.'),
});
export type ContinueAdventureInput = z.infer<typeof ContinueAdventureInputSchema>;

export const ContinueAdventureOutputSchema = z.object({
  narrative: z
    .string()
    .describe('The next part of the story. This should describe the situation and lead into any required rolls.'),
  location: z.string().optional().describe("The active character's current physical location (e.g., 'Docking Bay', 'Silas's Workshop', 'The Rusty Mug')."),
  mediaUrl: z.string().optional().describe("A URL to an image, video, or audio file that should be displayed to the player."),
  rollRequired: z.boolean().describe('Whether a dice roll is required to resolve the action.'),
  rollType: z
    .enum(['stat', 'save', 'none'])
    .describe('The type of roll required: "stat" for a skill/stat check, "save" for a save, or "none".'),
  rollDetails: z
    .string()
    .describe(
      'If a roll is required, specify which stat or save. e.g., "Strength", "Intellect", "Sanity", "Fear". Otherwise, set to "none".'
    ),
  dieToRoll: z.enum(['d10', 'd100', 'd20', 'none']).optional().describe('If a roll is required, specify which die to roll (e-g., "d100", "d10", "d20").'),
  rollModifier: z
    .enum(['advantage', 'disadvantage', 'none', 'standard', 'double'])
    .optional()
    .describe(
      'Legacy field. Do not use. Whether the roll has advantage, disadvantage, or none.'
    ),
  rollOutcome: z
    .enum(['success', 'fail', 'critical_success', 'critical_fail', 'none'])
    .optional()
    .describe('The outcome of the dice roll, if one occurred.'),
  rollResultNarrative: z
    .string()
    .optional()
    .describe('A short narrative description of the roll result, e-g., "Success!" or "Critical Fail!".'),
  updatedCrew: z.array(CharacterSchema).describe(
    'An array containing the updated character sheets for the ENTIRE crew. This must include every character passed in the input `crew` array, with any changes to their health, stress, inventory, or location applied.'
  ),
  inCombat: z.boolean().describe("Set to true if the player is in a combat encounter, otherwise false."),
  combatants: z.array(CombatantSchema).optional().describe("A list of all combatants (player and enemies) if inCombat is true."),
  suggestedActions: z.array(z.string()).optional().describe('A few short, clear, and action-oriented suggested actions for the player.'),
  highScore: z.number().optional().describe('The character\'s updated high score based on gameplay events.'),
});
export type ContinueAdventureOutput = z.infer<typeof ContinueAdventureOutputSchema>;

export const GenerateAdventureHookInputSchema = z.object({
  playerPrompt: z
    .string()
    .describe(
      'A short prompt from the player to inspire the adventure hook, e.g., "a derelict spaceship", "a mining colony", or "a mysterious signal".'
    ),
});
export type GenerateAdventureHookInput = z.infer<typeof GenerateAdventureHookInputSchema>;

export const GenerateAdventureHookOutputSchema = z.object({
  adventureHook: z.string().describe('A creative adventure hook for a Mothership RPG game.'),
});
export type GenerateAdventureHookOutput = z.infer<typeof GenerateAdventureHookOutputSchema>;

export const GenerateNpcDescriptionInputSchema = z.object({
  context: z.string().describe('The game context to use when generating the NPC description.'),
});

export type GenerateNpcDescriptionInput = z.infer<typeof GenerateNpcDescriptionInputSchema>;

export const GenerateNpcDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated NPC description.'),
});

export type GenerateNpcDescriptionOutput = z.infer<typeof GenerateNpcDescriptionOutputSchema>;

export const SummarizeSessionLogInputSchema = z.object({
  sessionLog: z.string().describe('The log of the previous game session.'),
});
export type SummarizeSessionLogInput = z.infer<typeof SummarizeSessionLogInputSchema>;

export const SummarizeSessionLogOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the previous game session.'),
});
export type SummarizeSessionLogOutput = z.infer<typeof SummarizeSessionLogOutputSchema>;


export const CharacterClass = ['Teamster', 'Marine', 'Scientist', 'Android'] as const;
export type CharacterClass = typeof CharacterClass[number];

export const GenerateCharacterCreativesInputSchema = z.object({
    characterClass: z.enum(CharacterClass),
    characterName: z.string().describe("The character's generated name."),
});
export type GenerateCharacterCreativesInput = z.infer<typeof GenerateCharacterCreativesInputSchema>;

export const GenerateCharacterCreativesOutputSchema = z.object({
  description: z.string().describe("A 2-3 sentence physical description of the character, focusing on gritty, lived-in details. What do they look like? What are they wearing? Any distinguishing features?"),
  backstory: z.string().describe("A 2-3 sentence backstory. Give a glimpse into their past. What life did they leave behind? Why are they in space? Keep it concise and evocative of a blue-collar sci-fi world."),
});
export type GenerateCharacterCreativesOutput = z.infer<typeof GenerateCharacterCreativesOutputSchema>;

    
