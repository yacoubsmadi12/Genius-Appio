import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const projectDir = path.join(process.cwd(), 'public', 'flutter_apps', projectId);
    
    try {
      await fs.access(projectDir);
      
      // Check if it's an HTML preview or actual Flutter build
      const indexPath = path.join(projectDir, 'index.html');
      const indexContent = await fs.readFile(indexPath, 'utf8');
      
      const isHtmlPreview = indexContent.includes('معاينة المشروع');
      
      return NextResponse.json({
        success: true,
        projectId,
        previewUrl: `/flutter_apps/${projectId}`,
        status: 'available',
        type: isHtmlPreview ? 'html_preview' : 'flutter_build'
      });
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Error getting project:', error);
    return NextResponse.json({
      error: 'Failed to get project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}