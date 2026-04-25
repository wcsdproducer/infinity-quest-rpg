import { ai } from '../genkit';
import { GenerateEstablishmentInputSchema, GenerateEstablishmentOutputSchema } from '../schemas';

export const generateEstablishmentFlow = ai.defineFlow(
  {
    name: 'generateEstablishment',
    inputSchema: GenerateEstablishmentInputSchema,
    outputSchema: GenerateEstablishmentOutputSchema,
  },
  async (input) => {
    // 1. Generate textual details of the establishment using Gemini
    const systemPrompt = `You are an AI Warden for the Mothership sci-fi horror RPG. 
You are generating a procedural establishment within the Infinity Quest RPG game world.
The establishment is located in the sector: "${input.sectorName}" (${input.sectorDescription || 'A sprawling, gritty space station sector'}).
It is part of the broader location: "${input.locationName}".
Create a gritty, realistic, atmospheric, and slightly unsettling location fitting the Mothership universe.
Include details about prices, NPCs, and whether the establishment is locked or restricted to players.`;

    const userPrompt = input.establishmentPrompt 
      ? `Generate an establishment based on this idea: ${input.establishmentPrompt}`
      : `Generate a random, interesting establishment that makes sense in this location.`;

    const textResponse = await ai.generate({
      prompt: `${systemPrompt}\n\n${userPrompt}`,
      output: {
        schema: GenerateEstablishmentOutputSchema,
      },
    });

    const generatedEstablishment = textResponse.output;

    if (!generatedEstablishment) {
        throw new Error("Failed to generate establishment details.");
    }

    // 2. Generate a visual representation using Imagen 3
    const imagePrompt = `A cinematic, photorealistic, 16:9 sci-fi concept art of an establishment named "${generatedEstablishment.name}". 
Type: ${generatedEstablishment.type}. 
Description: ${generatedEstablishment.description}. 
Atmosphere: Gritty, dark, industrial, retro-futuristic, Mothership RPG style, highly detailed.`;

    try {
        const imageResponse = await ai.generate({
            model: 'googleai/imagen-3.0-generate-002',
            prompt: imagePrompt,
            output: {
                format: 'media'
            }
        });
        
        const mediaOutput = imageResponse.media;
        if (mediaOutput && mediaOutput.url) {
             generatedEstablishment.imageUrl = mediaOutput.url;
        }

    } catch (e) {
        console.error("Failed to generate image with Imagen 3:", e);
        // Continue without an image if generation fails
    }

    return generatedEstablishment;
  }
);
