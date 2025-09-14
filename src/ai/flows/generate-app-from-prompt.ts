'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a basic mobile app from a natural language prompt.
 *
 * The flow takes a prompt describing the app's features, pages, and design, and returns a summary of the generated app.
 * It exports the following:
 * - `generateAppFromPrompt`: The main function to trigger the app generation flow.
 * - `GenerateAppFromPromptInput`: The input type for the `generateAppFromPrompt` function.
 * - `GenerateAppFromPromptOutput`: The output type for the `generateAppFromPrompt` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the generateAppFromPrompt flow
const GenerateAppFromPromptInputSchema = z.object({
  prompt: z.string().describe('A natural language prompt describing the app features, pages, and design.'),
});

export type GenerateAppFromPromptInput = z.infer<typeof GenerateAppFromPromptInputSchema>;

// Define the output schema for the generateAppFromPrompt flow
const GenerateAppFromPromptOutputSchema = z.object({
  summary: z.string().describe('A summary of the generated app, including its main features and pages.'),
});

export type GenerateAppFromPromptOutput = z.infer<typeof GenerateAppFromPromptOutputSchema>;

// Define the main function to trigger the app generation flow
export async function generateAppFromPrompt(input: GenerateAppFromPromptInput): Promise<GenerateAppFromPromptOutput> {
  return generateAppFromPromptFlow(input);
}

// Define the prompt for generating the app summary
const generateAppPrompt = ai.definePrompt({
  name: 'generateAppPrompt',
  input: {schema: GenerateAppFromPromptInputSchema},
  output: {schema: GenerateAppFromPromptOutputSchema},
  prompt: `You are an AI app generator. Please generate a basic mobile app based on the following prompt: {{{prompt}}}. Give me a summary of what you generated, including the main features and pages. Focus on the overall structure of the app, its navigation, and key UI elements. Do not include code. Be succint.`, 
});

// Define the Genkit flow for generating the app from the prompt
const generateAppFromPromptFlow = ai.defineFlow(
  {
    name: 'generateAppFromPromptFlow',
    inputSchema: GenerateAppFromPromptInputSchema,
    outputSchema: GenerateAppFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generateAppPrompt(input);
    return output!;
  }
);
