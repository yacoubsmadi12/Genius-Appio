"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Folder, Calendar, Settings, Eye, ExternalLink } from "lucide-react";
import type { Project } from "@/types";

interface ProjectListProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  onCreateProject: () => void;
}

export function ProjectList({ projects, onProjectSelect, onCreateProject }: ProjectListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Create New Project Card */}
      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer" onClick={onCreateProject}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
          <p className="text-muted-foreground mb-4">Start building your Flutter app with AI assistance</p>
          <Button size="lg">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </CardContent>
      </Card>

      {/* Existing Projects */}
      {projects.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Badge variant="secondary">{projects.length} project{projects.length !== 1 ? 's' : ''}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                    </div>
                    <Badge variant={project.isBackendConnected ? "default" : "secondary"}>
                      {project.isBackendConnected ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(project.updatedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        {project.pages.length} page{project.pages.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    
                    {project.backend && (
                      <div className="flex items-center gap-2">
                        <Settings className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {project.backend.charAt(0).toUpperCase() + project.backend.slice(1)}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => onProjectSelect(project)}
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                      {project.isBackendConnected && (
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">Create your first Flutter project to get started</p>
          <Button size="lg" onClick={onCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}