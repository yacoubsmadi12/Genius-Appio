import { NextRequest, NextResponse } from 'next/server';
import { generateAppFromPrompt } from '@/ai/flows';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'App prompt is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.',
          success: false 
        },
        { status: 500 }
      );
    }

    // Generate complete Flutter app using Genkit AI
    const result = await generateAppFromPrompt({ prompt: body.prompt });
    
    if (!result || !result.files || result.files.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate app - no files produced', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      files: result.files,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Complete app generation API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown server error',
        success: false 
      },
      { status: 500 }
    );
  }
}