import { NextRequest, NextResponse } from 'next/server';
import { generateFlutterPage, type PageGenerationRequest } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    const body: PageGenerationRequest = await request.json();
    
    // Validate request
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Page name and description are required' },
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

    // Generate page using Gemini AI
    const result = await generateFlutterPage(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to generate page', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code: result.code,
      pubspecYaml: result.pubspecYaml,
      widgetStructure: result.widgetStructure,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Page generation API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown server error',
        success: false 
      },
      { status: 500 }
    );
  }
}