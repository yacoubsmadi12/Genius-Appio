import { NextRequest, NextResponse } from 'next/server';
import { generatePageFromPrompt } from '@/ai/flows/generate-page-from-prompt';
import { z } from 'zod';

// Input validation schema
const GeneratePageRequestSchema = z.object({
  pageName: z.string().min(1, 'Page name is required'),
  prompt: z.string().min(5, 'Prompt must be at least 5 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = GeneratePageRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { pageName, prompt } = validationResult.data;

    // Sanitize page name - remove special characters and limit length
    const sanitizedPageName = pageName
      .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '') // Allow Arabic, English, numbers, spaces
      .substring(0, 50)
      .trim();

    if (!sanitizedPageName) {
      return NextResponse.json(
        { error: 'Page name contains no valid characters' },
        { status: 400 }
      );
    }

    // Generate page using Gemini AI
    const result = await generatePageFromPrompt({
      pageName: sanitizedPageName,
      prompt: prompt.substring(0, 1000) // Limit prompt length
    });

    // Validate that we have a valid page structure
    if (!result.page || !result.page.widgets || result.page.widgets.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate valid page structure' },
        { status: 500 }
      );
    }

    // Generate secure, unique metadata regardless of AI output
    const pageSlug = sanitizedPageName.toLowerCase().replace(/\s+/g, '');
    const uniqueId = `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const normalizedRoute = `/${pageSlug}`;
    const currentDate = new Date().toISOString().split('T')[0];

    // Override all metadata with server-generated values
    const sanitizedPage = {
      id: uniqueId,
      name: sanitizedPageName,
      route: normalizedRoute,
      createdAt: currentDate,
      type: 'screen' as const,
      widgets: validateAndSanitizeWidgets(result.page.widgets || [])
    };

    // Ensure we have at least one widget
    if (sanitizedPage.widgets.length === 0) {
      sanitizedPage.widgets = [{
        id: 'fallback_widget',
        type: 'text',
        properties: {
          text: 'Empty page - please try generating again',
          fontSize: 16,
          color: '#64748b'
        }
      }];
    }

    return NextResponse.json({ page: sanitizedPage });

  } catch (error) {
    console.error('Error generating page:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate page',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Validate and sanitize widget structure
function validateAndSanitizeWidgets(widgets: any[]): any[] {
  const validTypes = ['container', 'text', 'button', 'image', 'column', 'row'];
  
  return widgets.map((widget, index) => {
    // Ensure valid widget type
    const type = validTypes.includes(widget.type) ? widget.type : 'container';
    
    // Generate safe ID if missing
    const id = widget.id || `widget_${index}_${Math.random().toString(36).substr(2, 6)}`;
    
    // Sanitize properties
    const properties = widget.properties || {};
    const sanitizedProperties: any = {};
    
    // Safe property extraction with defaults
    if (properties.text && typeof properties.text === 'string') {
      sanitizedProperties.text = properties.text.substring(0, 200);
    }
    if (properties.fontSize && typeof properties.fontSize === 'number') {
      sanitizedProperties.fontSize = Math.max(8, Math.min(72, properties.fontSize));
    }
    if (properties.padding && typeof properties.padding === 'number') {
      sanitizedProperties.padding = Math.max(0, Math.min(100, properties.padding));
    }
    if (properties.backgroundColor && typeof properties.backgroundColor === 'string') {
      sanitizedProperties.backgroundColor = properties.backgroundColor.match(/^#[0-9A-Fa-f]{6}$/) 
        ? properties.backgroundColor : '#f3f4f6';
    }
    if (properties.textColor && typeof properties.textColor === 'string') {
      sanitizedProperties.textColor = properties.textColor.match(/^#[0-9A-Fa-f]{6}$/) 
        ? properties.textColor : '#000000';
    }
    if (properties.height && typeof properties.height === 'number') {
      sanitizedProperties.height = Math.max(10, Math.min(800, properties.height));
    }
    if (properties.width && typeof properties.width === 'number') {
      sanitizedProperties.width = Math.max(10, Math.min(800, properties.width));
    }
    if (properties.borderRadius && typeof properties.borderRadius === 'number') {
      sanitizedProperties.borderRadius = Math.max(0, Math.min(100, properties.borderRadius));
    }
    if (properties.fontWeight && typeof properties.fontWeight === 'string') {
      sanitizedProperties.fontWeight = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'].includes(properties.fontWeight) 
        ? properties.fontWeight : 'normal';
    }
    if (properties.alignment && typeof properties.alignment === 'string') {
      sanitizedProperties.alignment = properties.alignment;
    }

    const sanitizedWidget: any = {
      id,
      type,
      properties: sanitizedProperties
    };

    // Recursively sanitize children
    if (widget.children && Array.isArray(widget.children) && widget.children.length > 0) {
      sanitizedWidget.children = validateAndSanitizeWidgets(widget.children);
    }

    return sanitizedWidget;
  });
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}