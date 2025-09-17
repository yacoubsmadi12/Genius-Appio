
"use client";

import { useState } from "react";
import { GenerationForm } from "./components/generation-form";
import { ProgressSidebar } from "./components/progress-sidebar";
import { PlanningStep } from "./components/planning-step";
import { FlutterCreateStep } from "./components/flutter-create-step";
import { DatabaseStep } from "./components/database-step";
import { IconStep } from "./components/icon-step";
import type { GenerateAppFromPromptOutput } from "@/ai/flows";

export type WorkflowStep = 'prompt' | 'planning' | 'flutter-create' | 'database' | 'icon' | 'generating' | 'complete';

export interface AppPlan {
  appName: string;
  description: string;
  pages: string[];
  features: string[];
  colors: string[];
  backend: 'firebase' | 'supabase' | 'nodejs';
}

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('prompt');
  const [appPlan, setAppPlan] = useState<AppPlan | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerateAppFromPromptOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePlanningComplete = (plan: AppPlan) => {
    setAppPlan(plan);
    setCurrentStep('flutter-create');
  }

  const handleFlutterCreateComplete = () => {
    setCurrentStep('database');
  }

  const handleDatabaseComplete = () => {
    setCurrentStep('icon');
  }

  const handleIconComplete = () => {
    setCurrentStep('generating');
    setIsGenerating(true);
  }

  const handleGenerationComplete = (result: GenerateAppFromPromptOutput) => {
    setGenerationResult(result);
    setIsGenerating(false);
    setCurrentStep('complete');
  }

  const handleReset = () => {
    setCurrentStep('prompt');
    setAppPlan(null);
    setGenerationResult(null);
    setIsGenerating(false);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Genius APPio
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Let's build your app intelligently and interactively
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          {currentStep === 'prompt' && (
            <GenerationForm 
              onPlanningStart={(prompt) => setCurrentStep('planning')}
              onReset={handleReset}
            />
          )}
          {currentStep === 'planning' && (
            <PlanningStep 
              onComplete={handlePlanningComplete}
              onBack={() => setCurrentStep('prompt')}
            />
          )}
          {currentStep === 'flutter-create' && appPlan && (
            <FlutterCreateStep 
              appPlan={appPlan}
              onComplete={handleFlutterCreateComplete}
              onBack={() => setCurrentStep('planning')}
            />
          )}
          {currentStep === 'database' && appPlan && (
            <DatabaseStep 
              appPlan={appPlan}
              onComplete={handleDatabaseComplete}
              onBack={() => setCurrentStep('flutter-create')}
            />
          )}
          {currentStep === 'icon' && appPlan && (
            <IconStep 
              appPlan={appPlan}
              onComplete={handleIconComplete}
              onBack={() => setCurrentStep('database')}
            />
          )}
        </div>
        <div className="lg:col-span-1">
          <ProgressSidebar 
            currentStep={currentStep}
            appPlan={appPlan}
            isGenerating={isGenerating}
            generationResult={generationResult}
            onReset={handleReset}
            onGenerationComplete={handleGenerationComplete}
          />
        </div>
      </div>
    </div>
  );
}
