
"use client";

import { useState } from "react";
import { ProjectList } from "./components/project-list";
import { ProjectWorkspace } from "./components/project-workspace";
import { CreateProjectDialog } from "./components/create-project-dialog";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  pages: ProjectPage[];
  backend?: 'firebase' | 'supabase' | 'nodejs';
  isBackendConnected: boolean;
}

export interface ProjectPage {
  id: string;
  name: string;
  description: string;
  code: string;
  widgetStructure: string;
  createdAt: Date;
  previewUrl?: string;
}

export default function DashboardPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateProject = (name: string, description: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      pages: [],
      isBackendConnected: false
    };
    setProjects([...projects, newProject]);
    setShowCreateDialog(false);
    setSelectedProject(newProject);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {!selectedProject ? (
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
              Genius APPio Dashboard
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Create and manage your Flutter applications
            </p>
          </div>
          <ProjectList 
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onCreateProject={() => setShowCreateDialog(true)}
          />
          <CreateProjectDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onCreateProject={handleCreateProject}
          />
        </div>
      ) : (
        <ProjectWorkspace
          project={selectedProject}
          onBackToProjects={handleBackToProjects}
          onUpdateProject={updateProject}
        />
      )}
    </div>
  );
}
