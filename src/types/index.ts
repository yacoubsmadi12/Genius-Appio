// Central type definitions for the application

export interface CustomPage {
  name: string;
  description: string;
}

export interface AppConfig {
  appName: string;
  description: string;
  theme: 'light' | 'dark' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  appIcon: File | null;
  features: {
    firebase: boolean;
    supabaseDb: boolean;
    offlineMode: boolean;
  };
  pages: string[];
  customPages: CustomPage[];
}

export interface ProjectPage {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  code?: string;
  pubspecYaml?: string;
  widgetStructure?: string;
  previewUrl?: string;
  screenFilePath?: string;
  className?: string;
  routeName?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  isBackendConnected: boolean;
  appName: string;
  backend: 'firebase' | 'supabase' | 'nodejs' | 'custom' | null;
  pages: ProjectPage[];
  createdAt: Date;
  updatedAt: Date;
  features: {
    firebase: boolean;
    supabaseDb: boolean;
    offlineMode: boolean;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface AppPlan {
  appName: string;
  description: string;
  pages: string[];
  features: string[];
  colors: string[];
  backend: 'firebase' | 'supabase' | 'custom';
}

export interface GeneratedResult {
  code: string;
  pubspecYaml?: string;
  success: boolean;
  message?: string;
}

export type WorkflowStep = 'prompt' | 'planning' | 'flutter-create' | 'database' | 'icon' | 'generating' | 'complete';