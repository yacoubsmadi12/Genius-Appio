import { GoogleGenAI } from "@google/genai";

// Gemini AI client for page generation
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PageGenerationRequest {
  name: string;
  description: string;
  projectContext?: string;
}

export interface PageGenerationResponse {
  success: boolean;
  code: string;
  widgetStructure: string;
  error?: string;
}

export async function generateFlutterPage(request: PageGenerationRequest): Promise<PageGenerationResponse> {
  try {
    const prompt = `You are an expert Flutter developer. Generate a complete Flutter page/screen based on the following specifications:

**Page Name:** ${request.name}
**Description:** ${request.description}
${request.projectContext ? `**Project Context:** ${request.projectContext}` : ''}

**Requirements:**
1. Generate COMPLETE, FUNCTIONAL Flutter code
2. Use modern Flutter practices (Material 3, proper state management)
3. Include proper imports and class structure
4. Make it visually appealing with proper colors and layout
5. Add realistic UI elements based on the description
6. Use proper Dart naming conventions

**Output Format:**
Provide your response as a JSON object with these fields:
- code: Complete Flutter page code
- widgetStructure: Hierarchical widget structure as text (like a tree)

Generate production-ready code that can be directly used in a Flutter project.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            code: { type: "string" },
            widgetStructure: { type: "string" }
          },
          required: ["code", "widgetStructure"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    
    if (rawJson) {
      const data = JSON.parse(rawJson);
      return {
        success: true,
        code: data.code,
        widgetStructure: data.widgetStructure
      };
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      code: "",
      widgetStructure: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}