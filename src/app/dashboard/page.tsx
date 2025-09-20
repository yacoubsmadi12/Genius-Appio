"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Smartphone,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Save
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

const workflowSteps = [
  { id: "prompt", label: "Prompt", icon: FileCode, description: "Describe your app" },
  { id: "planning", label: "Planning", icon: Zap, description: "AI-generated plan" },
  { id: "generation", label: "Generation", icon: Loader2, description: "Generate Flutter code" },
  { id: "database", label: "Database", icon: Database, description: "Choose backend" },
  { id: "navigation", label: "Navigation", icon: Navigation, description: "Connect pages" },
  { id: "preview", label: "Preview", icon: Eye, description: "Test your app" },
  { id: "complete", label: "Complete", icon: CheckCircle, description: "Download & deploy" }
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "E-commerce App", createdAt: "2024-03-15", status: "complete" },
    { id: "2", name: "Social Media Dashboard", createdAt: "2024-03-14", status: "generating" },
    { id: "3", name: "Recipe Finder", createdAt: "2024-03-13", status: "draft" }
  ]);
  
  const [currentProject, setCurrentProject] = useState<Project | null>(projects[0]);
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("prompt");
  const [completedSteps, setCompletedSteps] = useState<Set<WorkflowStep>>(new Set());
  const [appPlan, setAppPlan] = useState<AppPlan | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBackend, setSelectedBackend] = useState<string>("firebase");

  const handleNewProject = async () => {
    try {
      // API call: POST /api/projects
      const newProject: Project = {
        id: Date.now().toString(),
        name: `New Project ${projects.length + 1}`,
        createdAt: new Date().toISOString().split('T')[0],
        status: "draft"
      };
      setProjects([newProject, ...projects]);
      setCurrentProject(newProject);
      setCurrentStep("prompt");
      setCompletedSteps(new Set());
      setAppPlan(null);
      setLogs([]);
      setPrompt("");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleGeneratePlan = async () => {
    if (!currentProject || !prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // API call: POST /api/projects/:id/plan
      
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
        setCompletedSteps(prev => new Set([...prev, "prompt"]));
        setCurrentStep("planning");
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to generate plan:", error);
      setIsGenerating(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!appPlan) return;
    
    setCurrentStep("generation");
    setLogs([]);
    
    // API call: POST /api/projects/:id/pages
    
    // Simulate log generation
    const logMessages = [
      "🚀 Starting Flutter project generation...",
      "📁 Creating project structure",
      "📝 Generating main.dart",
      "🎨 Creating UI components",
      "🔗 Setting up navigation routes",
      "🔧 Configuring dependencies in pubspec.yaml",
      "📱 Setting up platform files",
      "✅ Flutter project generated successfully!"
    ];
    
    logMessages.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === logMessages.length - 1) {
          setCompletedSteps(prev => new Set([...prev, "planning", "generation"]));
          setTimeout(() => setCurrentStep("database"), 1000);
        }
      }, index * 800);
    });
  };

  const handleDatabaseConfig = () => {
    setCompletedSteps(prev => new Set([...prev, "database"]));
    setCurrentStep("navigation");
  };

  const handleNavigationConfig = () => {
    setCompletedSteps(prev => new Set([...prev, "navigation"]));
    setCurrentStep("preview");
  };

  const handleBuildPreview = async () => {
    // API call: POST /api/projects/:id/build
    setCompletedSteps(prev => new Set([...prev, "preview"]));
    setCurrentStep("complete");
  };

  const isStepCompleted = (stepId: WorkflowStep) => completedSteps.has(stepId);
  const isStepCurrent = (stepId: WorkflowStep) => currentStep === stepId;
  const isStepAccessible = (stepId: WorkflowStep) => {
    const stepIndex = workflowSteps.findIndex(step => step.id === stepId);
    const currentIndex = workflowSteps.findIndex(step => step.id === currentStep);
    return stepIndex <= currentIndex;
  };

  const getStepIcon = (step: typeof workflowSteps[0]) => {
    const IconComponent = step.icon;
    if (isStepCompleted(step.id as WorkflowStep)) {
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    }
    if (isStepCurrent(step.id as WorkflowStep)) {
      return <IconComponent className="w-5 h-5 text-emerald-600" />;
    }
    return <IconComponent className="w-5 h-5 text-muted-foreground" />;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "prompt":
        return (
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
                className="min-h-[150px]"
              />
              <div className="flex justify-between">
                <Button variant="outline" disabled>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      Generate Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "planning":
        return (
          <Card>
            <CardHeader>
              <CardTitle>App Plan</CardTitle>
              <CardDescription>
                AI-generated plan based on your description. Review and modify if needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {appPlan && (
                <>
                  <div>
                    <h4 className="font-semibold mb-2">App Name</h4>
                    <Input value={appPlan.appName} readOnly />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Pages ({appPlan.pages.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {appPlan.pages.map((page, index) => (
                        <Badge key={index} variant="secondary">{page}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Features ({appPlan.features.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {appPlan.features.map((feature, index) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Backend</h4>
                    <Badge className="bg-emerald-100 text-emerald-800">{appPlan.backend}</Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("prompt")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleGenerateCode} className="bg-emerald-600 hover:bg-emerald-700">
                      Generate Pages
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );

      case "generation":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Code Generation</CardTitle>
              <CardDescription>
                Generating Flutter code for your app. This may take a few minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded border bg-slate-950 text-green-400 p-4 font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))}
                {logs.length === 0 && (
                  <div className="text-muted-foreground">Waiting for generation to start...</div>
                )}
              </ScrollArea>
              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setCurrentStep("planning")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="outline" disabled={logs.length === 0}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "database":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Choose Backend</CardTitle>
              <CardDescription>
                Select the backend service for your app's data storage and authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedBackend} onValueChange={setSelectedBackend}>
                <SelectTrigger>
                  <SelectValue placeholder="Select backend service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firebase">Firebase - Google's platform</SelectItem>
                  <SelectItem value="supabase">Supabase - Open source alternative</SelectItem>
                  <SelectItem value="nodejs">Node.js - Custom backend</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("generation")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleDatabaseConfig} className="bg-emerald-600 hover:bg-emerald-700">
                  Configure Database
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "navigation":
        return (
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
                <p>Navigation configuration interface</p>
                <p className="text-xs mt-2">Connect pages and bind button actions</p>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("database")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleNavigationConfig} className="bg-emerald-600 hover:bg-emerald-700">
                  Save Navigation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "preview":
        return (
          <Card>
            <CardHeader>
              <CardTitle>App Preview</CardTitle>
              <CardDescription>
                Test your app and see how it looks on different devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full h-[500px] border rounded-lg bg-gray-50 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Smartphone className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">App Preview</p>
                  <p className="text-sm mt-2">iframe: /preview/{currentProject?.id}</p>
                  <p className="text-xs mt-1">Your Flutter app will load here</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("navigation")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save Page
                  </Button>
                  <Button onClick={handleBuildPreview} className="bg-emerald-600 hover:bg-emerald-700">
                    Build Preview
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "complete":
        return (
          <Card>
            <CardHeader>
              <CardTitle>App Complete!</CardTitle>
              <CardDescription>
                Your Flutter app has been generated successfully. Download or deploy it now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>
                <Button variant="outline" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Run App
                </Button>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Project:</strong> {currentProject?.name}</p>
                  <p><strong>Pages:</strong> {appPlan?.pages.length || 0}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Features:</strong> {appPlan?.features.length || 0}</p>
                  <p><strong>Backend:</strong> {appPlan?.backend}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("preview")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Preview
                </Button>
                <Button onClick={handleNewProject} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-[280px] border-r bg-card flex flex-col">
        <div className="p-4">
          {/* New Project Button */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <Button 
                onClick={handleNewProject} 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold px-2">My Projects</h3>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {projects.map((project) => (
                  <Card 
                    key={project.id} 
                    className={`cursor-pointer transition-all ${
                      currentProject?.id === project.id 
                        ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" 
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setCurrentProject(project)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{project.name}</h4>
                          <Badge 
                            variant={project.status === "complete" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {project.createdAt}
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                            <Play className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Right Main Area */}
      <div className="flex-1 flex">
        {/* Workflow Stepper */}
        <div className="w-64 border-r bg-card p-4">
          <h3 className="text-lg font-semibold mb-4">Workflow Steps</h3>
          <div className="space-y-3">
            {workflowSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isStepCurrent(step.id as WorkflowStep)
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                        : isStepCompleted(step.id as WorkflowStep)
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-muted-foreground bg-background"
                    }`}
                  >
                    {getStepIcon(step)}
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div 
                      className={`w-0.5 h-8 mt-1 ${
                        isStepCompleted(step.id as WorkflowStep) 
                          ? "bg-emerald-500" 
                          : "bg-muted"
                      }`} 
                    />
                  )}
                </div>
                <div 
                  className={`flex-1 cursor-pointer ${
                    isStepAccessible(step.id as WorkflowStep) ? "" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => isStepAccessible(step.id as WorkflowStep) && setCurrentStep(step.id as WorkflowStep)}
                >
                  <h4 
                    className={`font-medium text-sm ${
                      isStepCurrent(step.id as WorkflowStep) 
                        ? "text-emerald-600" 
                        : isStepCompleted(step.id as WorkflowStep)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentProject ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{currentProject.name}</h1>
                  <p className="text-muted-foreground">
                    Step {workflowSteps.findIndex(s => s.id === currentStep) + 1} of {workflowSteps.length}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {currentProject.status}
                </Badge>
              </div>
              
              {renderStepContent()}
            </div>
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
    </div>
  );
}