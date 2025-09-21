export interface PageGenerationRequest {
  name: string;
  description: string;
  projectContext?: string;
}

export interface PageGenerationResponse {
  success: boolean;
  code: string;
  pubspecYaml: string;
  widgetStructure: string;
  error?: string;
}

export async function generateFlutterPage(request: PageGenerationRequest): Promise<PageGenerationResponse> {
  try {
    const prompt = `Generate a complete Flutter page in Dart code based on this description. Return both lib/main.dart content and any dependencies inside pubspec.yaml if required.

**Page Name:** ${request.name}
**Description:** ${request.description}
${request.projectContext ? `**Project Context:** ${request.projectContext}` : ''}

**Requirements:**
1. Generate COMPLETE, FUNCTIONAL Flutter code for lib/main.dart
2. Use modern Flutter practices (Material 3, proper state management)
3. Include proper imports and class structure
4. Make it visually appealing with proper colors and layout
5. Add realistic UI elements based on the description
6. Use proper Dart naming conventions
7. Include necessary dependencies in pubspec.yaml

**Output Format:**
Provide your response as a JSON object with these fields:
- code: Complete Flutter lib/main.dart content
- pubspecYaml: Complete pubspec.yaml with dependencies
- widgetStructure: Hierarchical widget structure as text (like a tree)

Generate production-ready code that can be directly used in a Flutter project.`;

    // Use the specific Gemini API endpoint format as requested
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API");
    }

    const rawText = data.candidates[0].content.parts[0].text;
    
    // Try to parse as JSON, fallback to structured parsing if needed
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      // Fallback: extract code and pubspec from text response
      const codeMatch = rawText.match(/```dart([\s\S]*?)```/);
      const pubspecMatch = rawText.match(/```yaml([\s\S]*?)```/) || rawText.match(/```([\s\S]*?)```/);
      
      parsedData = {
        code: codeMatch ? codeMatch[1].trim() : generateFallbackCode(request.name, request.description),
        pubspecYaml: pubspecMatch ? pubspecMatch[1].trim() : generateFallbackPubspec(request.name),
        widgetStructure: generateWidgetStructure(request.name)
      };
    }

    return {
      success: true,
      code: parsedData.code || generateFallbackCode(request.name, request.description),
      pubspecYaml: parsedData.pubspecYaml || generateFallbackPubspec(request.name),
      widgetStructure: parsedData.widgetStructure || generateWidgetStructure(request.name)
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      code: generateFallbackCode(request.name, request.description),
      pubspecYaml: generateFallbackPubspec(request.name),
      widgetStructure: generateWidgetStructure(request.name),
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

// Fallback functions
function generateFallbackCode(pageName: string, description: string): string {
  const className = pageName.replace(/\s+/g, '') + 'Page';
  
  return `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${pageName}',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: ${className}(),
    );
  }
}

class ${className} extends StatelessWidget {
  const ${className}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${pageName}'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.flutter_dash,
              size: 100,
              color: Colors.blue,
            ),
            SizedBox(height: 20),
            Text(
              '${pageName}',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                '${description}',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}`;
}

function generateFallbackPubspec(pageName: string): string {
  return `name: ${pageName.toLowerCase().replace(/\s+/g, '_')}
description: A Flutter application for ${pageName}

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
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;
}

function generateWidgetStructure(pageName: string): string {
  return `MaterialApp
├── Scaffold
│   ├── AppBar
│   │   └── Text
│   └── Center
│       └── Column
│           ├── Icon
│           ├── SizedBox
│           ├── Text
│           ├── SizedBox
│           └── Padding
│               └── Text`;
}