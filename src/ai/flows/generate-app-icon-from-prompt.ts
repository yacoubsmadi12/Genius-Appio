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

const generateAppIconFlow = ai.defineFlow(
  {
    name: 'generateAppIconFlow',
    inputSchema: GenerateAppIconInputSchema,
    outputSchema: GenerateAppIconOutputSchema,
  },
  async input => {
    // Placeholder SVG icon to avoid Imagen API billing error.
    const placeholderIcon = `
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="28" fill="hsl(88, 39%, 48%)"/>
      <path d="M50.4863 33.3429L32 45.9143V71.0572L50.4863 83.6286L68.9726 71.0572V45.9143L50.4863 33.3429Z" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M50.5143 83.6571L50.4857 95" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M69 71.0571L78.2286 64.9143" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 71.0571L22.7714 64.9143" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M68.9726 45.9143L88.4588 33.3429L97.6874 39.4857" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `.trim();
    
    const iconDataUri = `data:image/svg+xml;base64,${btoa(placeholderIcon)}`;
    
    return { iconDataUri: iconDataUri };
  }
);
