
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
import {generateFlutterProjectTemplate, validateAndCompleteFlutterProject} from '@/lib/flutter-template';

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
  prompt: `You are an expert Flutter app generator. Your task is to generate a complete, organized Flutter project based on the user's specifications.

  **User Requirements:**
  "{{{prompt}}}"

  **CRITICAL INSTRUCTIONS:**

  1. **EXTRACT INFORMATION FROM PROMPT:**
     - Parse the App Name, Backend type, Description, Pages, Features, and Colors from the prompt
     - Use this information to create a cohesive, well-structured app

  2. **CODE ORGANIZATION REQUIREMENTS:**
     - Write CLEAN, ORGANIZED CODE - not paragraphs of text
     - Use proper Dart syntax with correct imports, class definitions, and structure
     - Follow Flutter best practices and modern patterns
     - Generate COMPLETE, FUNCTIONAL code for each file
     - Use meaningful variable names and proper code formatting

  3. **REQUIRED FILES TO GENERATE:**
     
     **A. pubspec.yaml** - Extract app name from prompt, add relevant dependencies
     **B. lib/main.dart** - App entry point with proper routing
     **C. lib/app.dart** - MaterialApp configuration with theme based on specified colors
     **D. lib/screens/** - Create ALL pages mentioned in the prompt as separate .dart files
     **E. lib/widgets/** - Reusable widgets if needed
     **F. lib/models/** - Data models based on app functionality
     **G. lib/services/** - Backend services based on specified backend type
     **H. lib/core/constants.dart** - App constants and colors
     **I. README.md** - Project documentation

  4. **SPECIFIC REQUIREMENTS:**
     - App Name: Extract from prompt and convert to snake_case for package name
     - Colors: Use the specified colors in theme and UI components
     - Pages: Create complete, functional screens for each page mentioned
     - Features: Implement UI elements and logic for specified features
     - Backend: Add appropriate service files for the specified backend type

  5. **CODE STRUCTURE FOR SCREENS:**
     - Each screen must be a complete StatelessWidget or StatefulWidget
     - Include proper AppBar, body, and navigation
     - Use the app's color scheme consistently
     - Add realistic UI elements and layouts
     - Include proper imports and class definitions

  6. **NO PLACEHOLDER TEXT:**
     - Don't write "// Add your code here" or similar placeholders
     - Generate complete, functional code
     - Use the app description to create meaningful content

  7. **PLATFORM FILES:**
     - A complete Flutter project skeleton will be provided automatically
     - Focus on generating complete Dart code and configuration files only
     - Your generated files will be merged with the complete project structure

  **OUTPUT FORMAT:**
  Generate a JSON object with "files" array containing path and content for each file.
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
    // First, extract app name from the prompt for the project template
    const appNameMatch = input.prompt.match(/App Name:\s*"([^"]+)"/i);
    const appName = appNameMatch ? appNameMatch[1] : "my_awesome_app";
    
    // Generate the complete Flutter project template
    const projectTemplate = generateFlutterProjectTemplate(appName);
    
    const {output} = await generateAppPrompt(input);
    
    if (!output || !output.files || output.files.length === 0) {
      // Fallback to a minimal project structure if the AI fails
      const packageName = appName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      const fallbackFiles = [
        {
          path: 'pubspec.yaml',
          content: `
name: ${packageName}
description: A new Flutter project generated by Genius APPio.
publish_to: 'none' 
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
          `.trim(),
        },
        {
          path: 'lib/main.dart',
          content: `
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${appName}',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${appName}'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.flutter_dash, size: 100, color: Colors.blue),
            SizedBox(height: 20),
            Text(
              'Welcome to ${appName}!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Text(
              'Generated by Genius APPio',
              style: TextStyle(fontSize: 16),
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
          path: 'README.md', 
          content: `# ${appName}

A Flutter application generated by Genius APPio.

## Getting Started

1. Run \`flutter pub get\` to install dependencies
2. Run \`flutter run -d chrome\` to start the app

## Features

- Modern Flutter architecture
- Material Design
- Responsive layout
- Complete web-ready project structure

## Project Structure

This project includes all necessary files for web deployment:
- \`web/\` - Web platform files (index.html, manifest.json, icons)
- \`lib/\` - Main Dart application code
- \`test/\` - Unit and widget tests
- Project configuration files

## Running the App

To run this Flutter web app:
\`\`\`bash
flutter pub get
flutter run -d chrome
\`\`\`

The app is optimized for web deployment and can be built for production using \`flutter build web\`.
          ` 
        },
      ];

      // Merge template files with fallback files
      const mergedFiles = mergeProjectFiles(projectTemplate.files, fallbackFiles);
      
      // Validate and complete the fallback project
      const validatedFiles = validateAndCompleteFlutterProject(mergedFiles, appName);
      
      return { files: validatedFiles };
    }

    // Merge the AI-generated files with the complete project template
    const mergedFiles = mergeProjectFiles(projectTemplate.files, output.files);
    
    // Validate and complete the project to ensure all required files exist
    const validatedFiles = validateAndCompleteFlutterProject(mergedFiles, appName);
    
    return { files: validatedFiles };
  }
);

/**
 * Merges project template files with AI-generated files.
 * AI-generated files will override template files if they have the same path.
 */
function mergeProjectFiles(templateFiles: Array<{path: string; content: string}>, aiFiles: Array<{path: string; content: string}>): Array<{path: string; content: string}> {
  const mergedFiles = [...templateFiles];
  
  // Override template files with AI-generated files
  aiFiles.forEach(aiFile => {
    const existingIndex = mergedFiles.findIndex(file => file.path === aiFile.path);
    if (existingIndex !== -1) {
      // Replace existing file
      mergedFiles[existingIndex] = aiFile;
    } else {
      // Add new file
      mergedFiles.push(aiFile);
    }
  });
  
  return mergedFiles;
}
