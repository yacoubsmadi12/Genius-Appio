import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// Security: Sanitize project name to prevent path traversal and command injection
function sanitizeProjectName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 50)
    .replace(/^_+|_+$/g, '') || 'flutter_project';
}

export async function POST(request: NextRequest) {
  try {
    const { files, projectName } = await request.json();
    
    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Create project directory with sanitized name
    const sanitizedName = sanitizeProjectName(projectName || 'flutter_project');
    const projectId = `${sanitizedName}_${Date.now()}`;
    const projectDir = path.resolve(process.cwd(), 'temp_projects', projectId);
    
    // Create project directory
    await fs.mkdir(projectDir, { recursive: true });
    
    // Write all files to the project directory with security validation
    const allowedDirectories = ['lib/', 'assets/', 'test/', 'web/', 'android/', 'ios/'];
    const allowedFiles = ['pubspec.yaml', 'README.md', 'analysis_options.yaml', '.gitignore', '.metadata', 'firebase_options.dart'];
    
    for (const file of files) {
      // Security: Validate and normalize file path
      if (path.isAbsolute(file.path)) {
        throw new Error(`Absolute paths not allowed: ${file.path}`);
      }
      
      // Normalize path to prevent traversal attacks
      const normalizedPath = path.normalize(file.path).replace(/^(\.\.[\/\\])+/, '');
      const resolvedPath = path.resolve(projectDir, normalizedPath);
      
      // Ensure the resolved path is within the project directory
      if (!resolvedPath.startsWith(projectDir + path.sep) && resolvedPath !== projectDir) {
        throw new Error(`Path traversal attempt detected: ${file.path}`);
      }
      
      // Validate that the file is in an allowed directory or is an allowed root file
      const isAllowedFile = allowedFiles.includes(normalizedPath) || 
                           allowedDirectories.some(dir => normalizedPath.startsWith(dir));
      
      if (!isAllowedFile) {
        throw new Error(`File not in allowed directory: ${normalizedPath}`);
      }
      
      // Limit file size (5MB max)
      if (file.content.length > 5 * 1024 * 1024) {
        throw new Error(`File too large: ${normalizedPath}`);
      }
      
      const fileDir = path.dirname(resolvedPath);
      
      // Create directory if it doesn't exist (ensure it's also within bounds)
      if (!fileDir.startsWith(projectDir + path.sep) && fileDir !== projectDir) {
        throw new Error(`Invalid directory path: ${fileDir}`);
      }
      
      await fs.mkdir(fileDir, { recursive: true });
      
      // Write file content
      await fs.writeFile(resolvedPath, file.content, 'utf8');
    }

    // Check if Flutter is available and build the project
    try {
      // First, check if we have flutter installed
      await execFileAsync('flutter', ['--version'], { cwd: projectDir });
      
      // Install dependencies
      console.log('Installing Flutter dependencies...');
      await execFileAsync('flutter', ['pub', 'get'], { cwd: projectDir });
      
      // Build for web
      console.log('Building Flutter web...');
      await execFileAsync('flutter', ['build', 'web', '--release'], { cwd: projectDir });
      
      // Copy built files to hosting directory using safe fs operations
      const hostingDir = path.resolve(process.cwd(), 'public', 'flutter_apps', projectId);
      await fs.mkdir(hostingDir, { recursive: true });
      
      const buildWebDir = path.resolve(projectDir, 'build', 'web');
      
      // Safe recursive copy using fs operations instead of shell commands
      await copyDirectory(buildWebDir, hostingDir);
      
      // Clean up temp project safely
      await fs.rm(projectDir, { recursive: true, force: true });
      
      return NextResponse.json({
        success: true,
        projectId,
        previewUrl: `/flutter_apps/${projectId}`,
        message: 'Project built successfully'
      });
      
    } catch (flutterError) {
      console.error('Flutter build error:', flutterError);
      
      // If Flutter is not available, create a simple HTML preview
      const htmlPreview = generateHTMLPreview(files, projectName || 'Flutter App');
      const hostingDir = path.join(process.cwd(), 'public', 'flutter_apps', projectId);
      await fs.mkdir(hostingDir, { recursive: true });
      
      await fs.writeFile(path.join(hostingDir, 'index.html'), htmlPreview);
      
      // Clean up temp project safely
      await fs.rm(projectDir, { recursive: true, force: true }).catch(() => {});
      
      return NextResponse.json({
        success: true,
        projectId,
        previewUrl: `/flutter_apps/${projectId}`,
        message: 'Project preview created (Flutter SDK not available)',
        isHtmlPreview: true
      });
    }
    
  } catch (error) {
    console.error('Build error:', error);
    return NextResponse.json({
      error: 'Failed to build project',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Safe recursive directory copy function
async function copyDirectory(src: string, dest: string) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Copy directory error:', error);
    throw error;
  }
}

function generateHTMLPreview(files: Array<{path: string, content: string}>, appName: string): string {
  // Find main.dart to extract some info
  const mainDartFile = files.find(f => f.path === 'lib/main.dart');
  const pubspecFile = files.find(f => f.path === 'pubspec.yaml');
  
  // Extract colors and theme info from the files
  let primaryColor = '#2196F3';
  let description = 'Flutter app generated by Genius APPio';
  
  if (mainDartFile) {
    const colorMatch = mainDartFile.content.match(/Colors\.(\w+)/);
    if (colorMatch) {
      const colorMap: {[key: string]: string} = {
        'blue': '#2196F3',
        'red': '#F44336',
        'green': '#4CAF50',
        'purple': '#9C27B0',
        'orange': '#FF9800',
        'teal': '#009688'
      };
      primaryColor = colorMap[colorMatch[1]] || '#2196F3';
    }
  }
  
  if (pubspecFile) {
    const descMatch = pubspecFile.content.match(/description:\s*(.+)/);
    if (descMatch) {
      description = descMatch[1].trim();
    }
  }

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .app-container {
            width: 375px;
            height: 667px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
        }
        
        .app-header {
            background: ${primaryColor};
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        }
        
        .app-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: rgba(0,0,0,0.1);
            border-radius: 0 0 10px 10px;
        }
        
        .app-title {
            font-size: 24px;
            font-weight: bold;
            margin-top: 10px;
        }
        
        .app-content {
            padding: 30px 20px;
            text-align: center;
            height: calc(100% - 100px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .flutter-logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
            border-radius: 50%;
            background: ${primaryColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: white;
        }
        
        .app-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .feature-list {
            list-style: none;
            text-align: right;
        }
        
        .feature-list li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            color: #333;
        }
        
        .feature-list li:before {
            content: '✓';
            color: ${primaryColor};
            font-weight: bold;
            margin-left: 10px;
        }
        
        .powered-by {
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
        
        .preview-note {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin: 20px;
            text-align: center;
            font-size: 14px;
            color: #6c757d;
        }
        
        .info-container {
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            max-width: 300px;
        }
        
        .info-title {
            font-size: 18px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 10px;
        }
        
        .code-snippet {
            background: #f8f9fa;
            border-radius: 5px;
            padding: 10px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin-top: 10px;
            border-left: 3px solid ${primaryColor};
        }
    </style>
</head>
<body>
    <div class="info-container">
        <div class="info-title">معاينة المشروع</div>
        <p>هذا عرض أولي للمشروع. لتشغيل التطبيق الكامل، استخدم:</p>
        <div class="code-snippet">
            flutter pub get<br>
            flutter run -d chrome
        </div>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">
            تم إنشاؤه بواسطة Genius APPio
        </p>
    </div>

    <div class="app-container">
        <div class="app-header">
            <div class="app-title">${appName}</div>
        </div>
        
        <div class="app-content">
            <div class="flutter-logo">📱</div>
            <h2 style="color: ${primaryColor}; margin-bottom: 15px;">مرحباً بك في تطبيقك!</h2>
            <p class="app-description">${description}</p>
            
            <ul class="feature-list">
                <li>واجهة مستخدم حديثة</li>
                <li>تصميم متجاوب</li>
                <li>دعم المتصفحات</li>
                <li>أداء عالي</li>
            </ul>
        </div>
        
        <div class="powered-by">
            مدعوم بواسطة Flutter & Genius APPio
        </div>
    </div>
    
    <div class="preview-note">
        💡 هذه معاينة HTML للمشروع. للحصول على التطبيق الكامل، قم بتحميل ملف ZIP وتشغيله باستخدام Flutter SDK.
    </div>
</body>
</html>`;
}