import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    
    if (projectId) {
      // Get specific project info
      const projectDir = path.join(process.cwd(), 'public', 'flutter_apps', projectId);
      
      try {
        await fs.access(projectDir);
        return NextResponse.json({
          success: true,
          projectId,
          previewUrl: `/flutter_apps/${projectId}`,
          status: 'available'
        });
      } catch {
        return NextResponse.json({
          success: false,
          error: 'Project not found'
        }, { status: 404 });
      }
    }
    
    // List all projects
    const flutterAppsDir = path.join(process.cwd(), 'public', 'flutter_apps');
    
    try {
      const projects = await fs.readdir(flutterAppsDir);
      const projectList = await Promise.all(
        projects.map(async (project) => {
          const projectPath = path.join(flutterAppsDir, project);
          const stats = await fs.stat(projectPath);
          
          return {
            id: project,
            name: project.split('_')[0],
            createdAt: stats.birthtime,
            previewUrl: `/flutter_apps/${project}`,
            size: stats.size
          };
        })
      );
      
      return NextResponse.json({
        success: true,
        projects: projectList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      });
    } catch {
      return NextResponse.json({
        success: true,
        projects: []
      });
    }
    
  } catch (error) {
    console.error('Error managing Flutter projects:', error);
    return NextResponse.json({
      error: 'Failed to manage projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    
    const projectDir = path.join(process.cwd(), 'public', 'flutter_apps', projectId);
    
    try {
      await fs.rm(projectDir, { recursive: true, force: true });
      return NextResponse.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete project'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}