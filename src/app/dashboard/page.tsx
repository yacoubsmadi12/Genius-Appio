"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Play, 
  Download, 
  Eye, 
  Calendar,
  FileCode,
  Database,
  Navigation,
  CheckCircle,
  Loader2,
  Zap,
  Smartphone
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  status: "draft" | "generating" | "complete";
}

interface AppPlan {
  appName: string;
  description: string;
  pages: string[];
  features: string[];
  backend: "firebase" | "supabase" | "nodejs";
}

type WorkflowStep = "prompt" | "planning" | "generation" | "database" | "navigation" | "preview" | "complete";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "E-commerce App", createdAt: "2024-03-15", status: "complete" },
    { id: "2", name: "Social Media Dashboard", createdAt: "2024-03-14", status: "generating" },
    { id: "3", name: "Recipe Finder", createdAt: "2024-03-13", status: "draft" }
  ]);
  
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("prompt");
  const [appPlan, setAppPlan] = useState<AppPlan | null>(null);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const workflowSteps = [
    { id: "prompt", label: "Prompt", icon: FileCode },
    { id: "planning", label: "Planning", icon: Zap },
    { id: "generation", label: "Generation", icon: Loader2 },
    { id: "database", label: "Database", icon: Database },
    { id: "navigation", label: "Navigation", icon: Navigation },
    { id: "preview", label: "Preview", icon: Eye },
    { id: "complete", label: "Complete", icon: CheckCircle }
  ];

  const handleNewProject = async () => {
    try {
      // API call placeholder: POST /api/projects
      const newProject: Project = {
        id: Date.now().toString(),
        name: "New Project",
        createdAt: new Date().toISOString().split('T')[0],
        status: "draft"
      };
      setProjects([newProject, ...projects]);
      setCurrentProject(newProject);
      setCurrentStep("prompt");
      setAppPlan(null);
      setGenerationLogs([]);
      setPrompt("");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleSubmitPrompt = async () => {
    if (!currentProject || !prompt.trim()) return;
    
    setIsGenerating(true);
    setCurrentStep("planning");
    
    try {
      // API call placeholder: POST /api/projects/:id/pages
      
      // Simulate AI planning
      setTimeout(() => {
        const plan: AppPlan = {
          appName: currentProject.name,
          description: prompt,
          pages: ["Home", "Profile", "Settings", "About"],
          features: ["User Authentication", "Push Notifications", "Offline Support"],
          backend: "firebase"
        };
        setAppPlan(plan);
        setIsGenerating(false);
        setCurrentStep("generation");
      }, 2000);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setIsGenerating(false);
    }
  };

  const handleGenerateApp = () => {
    if (!appPlan) return;
    
    setCurrentStep("generation");
    setGenerationLogs([]);
    
    // Simulate log generation
    const logs = [
      "🚀 Starting Flutter project generation...",
      "📝 Creating main.dart",
      "🎨 Generating UI components",
      "🔗 Setting up navigation",
      "📱 Configuring platform files",
      "✅ Generation complete!"
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setGenerationLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setTimeout(() => setCurrentStep("database"), 1000);
        }
      }, index * 1000);
    });
  };

  const getStepProgress = () => {
    const stepIndex = workflowSteps.findIndex(step => step.id === currentStep);
    return ((stepIndex + 1) / workflowSteps.length) * 100;
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "complete": return "bg-green-500";
      case "generating": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-6">
          <Button onClick={handleNewProject} className="w-full mb-6">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">My Projects</h3>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className={`cursor-pointer transition-colors ${
                      currentProject?.id === project.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setCurrentProject(project)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{project.name}</CardTitle>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {project.createdAt}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Play className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {currentProject ? (
          <>
            {/* Header */}
            <div className="border-b bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{currentProject.name}</h1>
                  <p className="text-muted-foreground">Build your Flutter app step by step</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {currentProject.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(getStepProgress())}%</span>
                </div>
                <Progress value={getStepProgress()} className="h-2" />
              </div>
            </div>

            {/* Workflow Tabs */}
            <div className="flex-1 p-6">
              <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as WorkflowStep)}>
                <TabsList className="grid w-full grid-cols-7">
                  {workflowSteps.map((step) => {
                    const IconComponent = step.icon;
                    return (
                      <TabsTrigger key={step.id} value={step.id} className="text-xs">
                        <IconComponent className="w-3 h-3 mr-1" />
                        {step.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {/* Prompt Step */}
                <TabsContent value="prompt" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Describe Your App</CardTitle>
                      <CardDescription>
                        Tell us what kind of Flutter app you want to build. Be specific about features, pages, and design.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="I want to create a social media app with user profiles, posts, comments, and real-time messaging..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={6}
                      />
                      <Button 
                        onClick={handleSubmitPrompt} 
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Start Analysis & Planning"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Planning Step */}
                <TabsContent value="planning" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>App Plan</CardTitle>
                      <CardDescription>
                        AI-generated plan based on your description. Review and modify if needed.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {appPlan ? (
                        <>
                          <div>
                            <h4 className="font-semibold mb-2">App Name</h4>
                            <Input value={appPlan.appName} readOnly />
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Pages</h4>
                            <div className="flex flex-wrap gap-2">
                              {appPlan.pages.map((page, index) => (
                                <Badge key={index} variant="secondary">{page}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {appPlan.features.map((feature, index) => (
                                <Badge key={index} variant="outline">{feature}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Backend</h4>
                            <Badge>{appPlan.backend}</Badge>
                          </div>
                          
                          <Button onClick={handleGenerateApp} className="w-full">
                            Approve Plan & Generate Code
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                          <span>Generating app plan...</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Generation Step */}
                <TabsContent value="generation" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Code Generation</CardTitle>
                      <CardDescription>
                        Generating Flutter code for your app. This may take a few minutes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64 w-full rounded border bg-black text-green-400 p-4 font-mono text-sm">
                        {generationLogs.map((log, index) => (
                          <div key={index} className="mb-1">{log}</div>
                        ))}
                        {generationLogs.length === 0 && (
                          <div className="text-muted-foreground">Waiting for generation to start...</div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Database Step */}
                <TabsContent value="database" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Choose Backend</CardTitle>
                      <CardDescription>
                        Select the backend service for your app's data storage and authentication.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Select defaultValue="firebase">
                        <SelectTrigger>
                          <SelectValue placeholder="Select backend service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="firebase">Firebase - Google's platform</SelectItem>
                          <SelectItem value="supabase">Supabase - Open source alternative</SelectItem>
                          <SelectItem value="nodejs">Node.js - Custom backend</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => setCurrentStep("navigation")} className="w-full">
                        Configure Database
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Navigation Step */}
                <TabsContent value="navigation" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Navigation & Actions</CardTitle>
                      <CardDescription>
                        Configure how users navigate between pages and what actions buttons perform.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <Navigation className="w-12 h-12 mx-auto mb-4" />
                        <p>Navigation configuration coming soon...</p>
                      </div>
                      <Button onClick={() => setCurrentStep("preview")} className="w-full">
                        Continue to Preview
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Preview Step */}
                <TabsContent value="preview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>App Preview</CardTitle>
                      <CardDescription>
                        See how your app looks and test its functionality.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-[9/16] max-w-sm mx-auto border rounded-lg bg-gray-50 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Smartphone className="w-12 h-12 mx-auto mb-4" />
                          <p>App preview will load here</p>
                          <p className="text-xs mt-2">iframe: /preview/{currentProject.id}</p>
                        </div>
                      </div>
                      <Button onClick={() => setCurrentStep("complete")} className="w-full mt-4">
                        Finalize App
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Complete Step */}
                <TabsContent value="complete" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>App Complete!</CardTitle>
                      <CardDescription>
                        Your Flutter app has been generated successfully. Download or deploy it now.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download ZIP
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Run App
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Project:</strong> {currentProject.name}</p>
                        <p><strong>Pages:</strong> {appPlan?.pages.length || 0}</p>
                        <p><strong>Features:</strong> {appPlan?.features.length || 0}</p>
                        <p><strong>Backend:</strong> {appPlan?.backend}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No Project Selected</h2>
              <p>Create a new project or select an existing one to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}