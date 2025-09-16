'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a basic mobile app from a natural language prompt.
 *
 * The flow takes a prompt describing the app's features, pages, and design, and returns a structured plan for the application code.
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
  files: z.array(z.object({
    path: z.string().describe('The full path of the file to be created.'),
    content: z.string().describe('The code or content of the file.'),
  })).describe('A list of files to be generated for the app, including their paths and content.'),
});

export type GenerateAppFromPromptOutput = z.infer<typeof GenerateAppFromPromptOutputSchema>;

// Define the main function to trigger the app generation flow
export async function generateAppFromPrompt(input: GenerateAppFromPromptInput): Promise<GenerateAppFromPromptOutput> {
  return generateAppFromPromptFlow(input);
}

// Define the prompt for generating the app
const generateAppPrompt = ai.definePrompt({
  name: 'generateAppPrompt',
  input: {schema: GenerateAppFromPromptInputSchema},
  output: {schema: GenerateAppFromPromptOutputSchema},
  prompt: `You are an AI app generator. Please generate a basic Flutter application based on the following prompt: {{{prompt}}}.

  Your output should be a structured list of files, including their paths and content. Create a simple multi-page Flutter app with a main.dart, a home page, and at least one other page. Ensure navigation is set up between the pages.

  Provide the content for the following files:
  - pubspec.yaml
  - lib/main.dart
  - lib/home_page.dart
  - lib/details_page.dart

  The code should be complete, correct, and ready to be written to files.
  `,
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
    
    // For now, if the output is empty, return a placeholder file structure.
    // This can be removed once the model reliably returns the file list.
    if (!output || !output.files || output.files.length === 0) {
      return {
        files: [
          {
            path: 'pubspec.yaml',
            content: `
name: generated_app
description: A new Flutter project.
publish_to: 'none'
version: 1.0.0+1
environment:
  sdk: '>=3.0.0 <4.0.0'
dependencies:
  flutter:
    sdk: flutter
dev_dependencies:
  flutter_test:
    sdk: flutter
flutter:
  uses-material-design: true
            `.trim(),
          },
          {
            path: 'lib/main.dart',
            content: `
import 'package:flutter/material.dart';
import 'home_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Generated App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomePage(),
    );
  }
}
            `.trim(),
          },
           {
            path: 'lib/home_page.dart',
            content: `
import 'package:flutter/material.dart';
import 'details_page.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'Welcome to your generated app!',
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              child: const Text('Go to Details'),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const DetailsPage()),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
            `.trim(),
          },
          {
            path: 'lib/details_page.dart',
            content: `
import 'package:flutter/material.dart';

class DetailsPage extends StatelessWidget {
  const DetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Details'),
      ),
      body: const Center(
        child: Text('This is the details page.'),
      ),
    );
  }
}
            `.trim(),
          },
        ]
      };
    }
    
    return output!;
  }
);
