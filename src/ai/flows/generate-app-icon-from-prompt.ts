'use server';
/**
 * @fileOverview Generates an app icon using AI based on the app name and description.
 *
 * - generateAppIcon - A function that generates the app icon.
 * - GenerateAppIconInput - The input type for the generateAppIcon function.
 * - GenerateAppIconOutput - The return type for the generateAppIcon function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppIconInputSchema = z.object({
  appName: z.string().describe('The name of the app.'),
  appDescription: z.string().describe('A description of the app.'),
});
export type GenerateAppIconInput = z.infer<typeof GenerateAppIconInputSchema>;

const GenerateAppIconOutputSchema = z.object({
  iconDataUri: z
    .string()
    .describe(
      'The generated app icon as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'      
    ),
});
export type GenerateAppIconOutput = z.infer<typeof GenerateAppIconOutputSchema>;

export async function generateAppIcon(input: GenerateAppIconInput): Promise<GenerateAppIconOutput> {
  return generateAppIconFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppIconPrompt',
  input: {schema: GenerateAppIconInputSchema},
  output: {schema: GenerateAppIconOutputSchema},
  prompt: `You are an AI that generates app icons based on the app name and description.\n\nApp Name: {{{appName}}}\nApp Description: {{{appDescription}}}\n\nGenerate a visually appealing and relevant icon that represents the app. Return the icon as a data URI.
\nOutput the icon data URI:
`,
});

const generateAppIconFlow = ai.defineFlow(
  {
    name: 'generateAppIconFlow',
    inputSchema: GenerateAppIconInputSchema,
    outputSchema: GenerateAppIconOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate an app icon for an app named ${input.appName} with description ${input.appDescription}`,
    });
    if (!media) {
      throw new Error('No media returned from image generation.');
    }
    return {iconDataUri: media.url};
  }
);
