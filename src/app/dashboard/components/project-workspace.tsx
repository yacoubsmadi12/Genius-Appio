"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Plus, 
  FileCode, 
  Eye, 
  Download, 
  Play, 
  Settings, 
  Database,
  Smartphone,
  Code,
  Palette
} from "lucide-react";
import type { Project, ProjectPage } from "@/types";
import { PageBuilder } from "./page-builder";
import { BackendConnection } from "./backend-connection";

interface ProjectWorkspaceProps {
  project: Project;
  onBackToProjects: () => void;
  onUpdateProject: (project: Project) => void;
}

export function ProjectWorkspace({ project, onBackToProjects, onUpdateProject }: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("pages");
  const [selectedPage, setSelectedPage] = useState<ProjectPage | null>(null);
  const [showPageBuilder, setShowPageBuilder] = useState(false);
  const [showBackendConnection, setShowBackendConnection] = useState(false);

  const handleCreatePage = () => {
    setSelectedPage(null);
    setShowPageBuilder(true);
  };

  const handleEditPage = (page: ProjectPage) => {
    setSelectedPage(page);
    setShowPageBuilder(true);
  };

  const handlePageSaved = (page: ProjectPage) => {
    const updatedPages = selectedPage 
      ? project.pages.map(p => p.id === page.id ? page : p)
      : [...project.pages, page];
    
    const updatedProject = {
      ...project,
      pages: updatedPages,
      updatedAt: new Date()
    };
    
    onUpdateProject(updatedProject);
    setShowPageBuilder(false);
    setSelectedPage(null);
  };

  const handleBackendConnected = (backend: 'firebase' | 'supabase' | 'nodejs') => {
    const updatedProject = {
      ...project,
      backend,
      isBackendConnected: true,
      updatedAt: new Date()
    };
    
    onUpdateProject(updatedProject);
    setShowBackendConnection(false);
  };

  if (showPageBuilder) {
    return (
      <PageBuilder
        project={project}
        page={selectedPage}
        onSave={handlePageSaved}
        onCancel={() => setShowPageBuilder(false)}
      />
    );
  }

  if (showBackendConnection) {
    return (
      <BackendConnection
        project={project}
        onConnect={handleBackendConnected}
        onCancel={() => setShowBackendConnection(false)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBackToProjects}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
              <div className="h-6 border-l border-border" />
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={project.isBackendConnected ? "default" : "secondary"}>
                {project.isBackendConnected ? "Backend Connected" : "Frontend Only"}
              </Badge>
              {project.isBackendConnected && (
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview App
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pages">
              <Smartphone className="h-4 w-4 mr-2" />
              Pages ({project.pages.length})
            </TabsTrigger>
            <TabsTrigger value="backend">
              <Database className="h-4 w-4 mr-2" />
              Backend
            </TabsTrigger>
            <TabsTrigger value="design">
              <Palette className="h-4 w-4 mr-2" />
              Design
            </TabsTrigger>
            <TabsTrigger value="export">
              <Code className="h-4 w-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">App Pages</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage your Flutter app screens with AI assistance
                  </p>
                </div>
                <Button onClick={handleCreatePage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Page
                </Button>
              </div>

              {project.pages.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Smartphone className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your app by creating your first page with AI
                    </p>
                    <Button onClick={handleCreatePage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Page
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.pages.map((page) => (
                    <Card key={page.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{page.name}</CardTitle>
                          <Badge variant="outline">Screen</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {page.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditPage(page)}>
                            <FileCode className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="backend" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Backend Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your app to a backend service for data storage and authentication
                </p>
              </div>

              {!project.isBackendConnected ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No backend connected</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your app to Firebase, Supabase, or custom Node.js backend
                    </p>
                    <Button onClick={() => setShowBackendConnection(true)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Connect Backend
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Backend Connected
                    </CardTitle>
                    <CardDescription>
                      Your app is connected to {project.backend}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline">
                        <Play className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="design" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Design System</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your app's theme, colors, and overall design
                </p>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Palette className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Design customization coming soon</h3>
                  <p className="text-muted-foreground">
                    Advanced theming and design tools will be available in a future update
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Export & Deploy</h3>
                <p className="text-sm text-muted-foreground">
                  Download your complete Flutter project or deploy to the web
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Download Project</CardTitle>
                    <CardDescription>
                      Get the complete Flutter project as a ZIP file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download ZIP
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Web Preview</CardTitle>
                    <CardDescription>
                      Run your app in the browser for testing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline" disabled={!project.isBackendConnected}>
                      <Play className="h-4 w-4 mr-2" />
                      Launch Preview
                    </Button>
                    {!project.isBackendConnected && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Connect backend first to enable preview
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}