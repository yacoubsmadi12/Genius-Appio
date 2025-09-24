
"use client";

import { useState, useEffect } from "react";
import JSZip from "jszip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Circle, Coffee, FileArchive, Loader, FileCode, Bot, Folder, ChevronDown, ChevronRight, Terminal, Eye, Play, ExternalLink, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateAppFromPrompt } from "@/ai/flows";
import type { GenerateAppFromPromptOutput } from "@/ai/flows";
import type { AppPlan } from "@/types";
import type { WorkflowStep } from "../page";

type ProgressSidebarProps = {
  currentStep: WorkflowStep;
  appPlan: AppPlan | null;
  isGenerating: boolean;
  generationResult: GenerateAppFromPromptOutput | null;
  onReset: () => void;
  onGenerationComplete: (result: GenerateAppFromPromptOutput) => void;
};


export function ProgressSidebar({ currentStep, appPlan, isGenerating, generationResult, onReset, onGenerationComplete }: ProgressSidebarProps) {
  const [isZipping, setIsZipping] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['lib']));
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildResult, setBuildResult] = useState<{success: boolean, projectId: string, previewUrl: string, message: string} | null>(null);
  const [buildError, setBuildError] = useState<string | null>(null);

  // Start generation when reaching generation phase
  useEffect(() => {
    if (currentStep === 'generating' && appPlan && !generationResult) {
      handleGeneration();
    }
  }, [currentStep, appPlan]);

  const handleGeneration = async () => {
    if (!appPlan) return;
    
    try {
      const prompt = `
**APP SPECIFICATIONS:**

App Name: "${appPlan.appName}"
Backend Type: ${appPlan.backend}

**DESCRIPTION:**
${appPlan.description}

**REQUIRED PAGES:**
${appPlan.pages.map((page, index) => `${index + 1}. ${page}`).join('\n')}

**REQUIRED FEATURES:**
${appPlan.features.map((feature, index) => `${index + 1}. ${feature}`).join('\n')}

**COLOR SCHEME:**
Primary Colors: ${appPlan.colors.join(', ')}

**ADDITIONAL REQUIREMENTS:**
- Create complete, functional Flutter code for all pages
- Use modern Flutter practices and clean architecture
- Implement proper navigation between screens
- Apply the specified color scheme throughout the app
- Generate organized, readable code with proper imports and structure
- Include realistic UI elements and functionality for each feature
      `.trim();
      
      const result = await generateAppFromPrompt({ prompt });
      onGenerationComplete(result);
    } catch (error) {
      console.error("App generation failed:", error);
      onGenerationComplete({ files: [] });
    }
  };

  const handleDownload = async () => {
    if (!generationResult) return;

    setIsZipping(true);
    const zip = new JSZip();
    generationResult.files.forEach(file => {
      zip.file(file.path, file.content);
    });

    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const element = document.createElement("a");
      element.href = URL.createObjectURL(zipBlob);
      element.download = `${appPlan?.appName || 'GeniusAPPio'}-Project.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Failed to create ZIP file", error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleBuildAndTest = async () => {
    if (!generationResult || !appPlan) return;
    
    setIsBuilding(true);
    setBuildError(null);
    
    try {
      const response = await fetch('/api/build-flutter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: generationResult.files,
          projectName: appPlan.appName
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setBuildResult(result);
      } else {
        setBuildError(result.error || 'فشل في بناء المشروع');
      }
    } catch (error) {
      console.error('Build error:', error);
      setBuildError('حدث خطأ أثناء بناء المشروع');
    } finally {
      setIsBuilding(false);
    }
  };
  
  const handleTestApp = () => {
    if (buildResult) {
      window.open(buildResult.previewUrl, '_blank');
    }
  };

  const toggleFolder = (folder: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folder)) {
      newExpanded.delete(folder);
    } else {
      newExpanded.add(folder);
    }
    setExpandedFolders(newExpanded);
  };

  const projectStructure = [
    { name: 'android/', type: 'folder', description: 'Android files (Gradle, Kotlin/Java)' },
    { name: 'ios/', type: 'folder', description: 'iOS files (Xcode, Swift/ObjC)' },
    { name: 'web/', type: 'folder', description: 'Web support (optional)' },
    { name: 'lib/', type: 'folder', description: 'Core Dart code', children: [
      { name: 'main.dart', type: 'file', description: 'App entry point' },
      { name: 'app.dart', type: 'file', description: 'MaterialApp, routes, theme definition' },
      { name: 'core/', type: 'folder', description: 'Common utilities', children: [
        { name: 'constants/', type: 'folder' },
        { name: 'themes/', type: 'folder' },
        { name: 'utils/', type: 'folder' },
      ]},
      { name: 'models/', type: 'folder', description: 'Data models (User, Settings...)' },
      { name: 'services/', type: 'folder', description: 'Services (API, Firebase, Auth)' },
      { name: 'providers/', type: 'folder', description: 'Riverpod providers' },
      { name: 'screens/', type: 'folder', description: 'App screens (Login, Home, Settings...)' },
      { name: 'widgets/', type: 'folder', description: 'Reusable widgets' },
    ]},
    { name: 'assets/', type: 'folder', description: 'Images / icons / translations / fonts' },
    { name: 'test/', type: 'folder', description: 'Tests (Unit, Widget, Integration)' },
    { name: 'pubspec.yaml', type: 'file', description: 'Project definition + dependencies' },
    { name: 'analysis_options.yaml', type: 'file', description: 'Lint rules' },
    { name: 'README.md', type: 'file', description: 'Project documentation + setup steps' },
  ];

  const isComplete = currentStep === 'complete';

  const renderProjectStructure = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <div key={index} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded">
          {item.type === 'folder' ? (
            <>
              <button
                onClick={() => toggleFolder(item.name)}
                className="p-0 h-auto border-0 bg-transparent"
              >
                {expandedFolders.has(item.name) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <Folder className="h-4 w-4 text-blue-600" />
            </>
          ) : (
            <>
              <div className="w-4" />
              <FileCode className="h-4 w-4 text-gray-600" />
            </>
          )}
          <span className="text-sm font-mono">{item.name}</span>
        </div>
        {item.type === 'folder' && item.children && expandedFolders.has(item.name) && (
          <div className="ml-2">
            {renderProjectStructure(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {currentStep === 'prompt' && '📝 App Description'}
          {currentStep === 'planning' && '🤖 Analysis & Planning'}
          {currentStep === 'flutter-create' && '🛠️ Flutter Project Setup'}
          {currentStep === 'database' && '🗄️ Database'}
          {currentStep === 'icon' && '🎨 App Icon'}
          {currentStep === 'generating' && '⚡ Generating Project'}
          {currentStep === 'complete' && '✅ Complete!'}
        </CardTitle>
        <CardDescription>
          {appPlan ? `Project: ${appPlan.appName}` : 'App building progress'}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[400px]">
        {currentStep === 'prompt' && (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <Bot className="h-16 w-16 mb-4 text-primary" />
            <p className="text-lg font-semibold mb-2">Start your app creation journey</p>
            <p className="text-sm">Write a detailed description of the app you want</p>
          </div>
        )}

        {currentStep === 'flutter-create' && appPlan && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-center mb-2">🛠️ Flutter Project Creation</h3>
              <p className="text-sm text-center text-muted-foreground mb-3">
                Creating base Flutter project with modern Android embedding v2
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-sm">Flutter Create</div>
                    <div className="text-xs text-muted-foreground">Initialize project structure</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-sm">Android Embedding v2</div>
                    <div className="text-xs text-muted-foreground">Modern Android configuration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(currentStep === 'planning' || currentStep === 'database' || currentStep === 'icon') && appPlan && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-center mb-2">🏗️ Project Structure</h3>
              <p className="text-sm text-center text-muted-foreground mb-3">
                This is the planned structure for your Flutter project
              </p>
            </div>
            <div className="border rounded-lg p-3 max-h-80 overflow-y-auto bg-muted/20">
              <div className="font-mono text-sm">
                <div className="flex items-center gap-2 mb-3 font-semibold text-primary">
                  <Folder className="h-4 w-4" />
                  {appPlan.appName.replace(/\s+/g, '_').toLowerCase()}/
                </div>
                {renderProjectStructure(projectStructure)}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'generating' && (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="relative mb-6">
              <Loader className="h-16 w-16 animate-spin text-primary" />
              <Bot className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
            </div>
            <p className="text-lg font-semibold mb-2">🚀 Generating project...</p>
            <p className="text-sm text-muted-foreground">Writing all project files</p>
          </div>
        )}

        {isComplete && generationResult && (
          <div className="space-y-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 dark:text-green-400 font-semibold text-lg">
                🎉 Project created successfully!
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 max-h-60 overflow-y-auto">
              <p className="text-sm font-semibold mb-2">📁 Generated files ({generationResult.files.length}):</p>
              <ul className="space-y-1">
                {generationResult.files.map((file, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs">
                    <FileCode className="h-3 w-3 text-primary" />
                    <span className="font-mono">{file.path}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      {isComplete && (
        <CardFooter className="flex flex-col gap-3">
          {/* Build Status */}
          {buildResult && (
            <div className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                {buildResult.message}
              </div>
            </div>
          )}
          
          {buildError && (
            <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-red-700 dark:text-red-400 text-sm">
                ❌ {buildError}
              </div>
            </div>
          )}
          
          {/* Build and Test Button */}
          {!buildResult && (
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" 
              onClick={handleBuildAndTest} 
              disabled={isBuilding}
            >
              {isBuilding ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  جاري بناء المشروع...
                </>
              ) : (
                <>
                  <Hammer className="mr-2 h-4 w-4" />
                  🚀 بناء واختبار التطبيق
                </>
              )}
            </Button>
          )}
          
          {/* Test Button - only show after successful build */}
          {buildResult && (
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
              onClick={handleTestApp}
            >
              <Play className="mr-2 h-4 w-4" />
              <ExternalLink className="mr-1 h-3 w-3" />
              جرب تطبيقك الآن
            </Button>
          )}
          
          {/* Download ZIP */}
          <Button className="w-full" onClick={handleDownload} disabled={isZipping} variant="outline">
            {isZipping ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                جاري التحضير...
              </>
            ) : (
              <>
                <FileArchive className="mr-2 h-4 w-4" />
                تحميل مشروع ZIP
              </>
            )}
          </Button>
          
          <Button variant="outline" className="w-full" onClick={onReset}>
            إنشاء مشروع جديد
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
