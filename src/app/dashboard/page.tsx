
"use client";

import { useState } from "react";
import { GenerationForm } from "./components/generation-form";
import { ProgressSidebar } from "./components/progress-sidebar";
import type { GenerateAppFromPromptOutput } from "@/ai/flows";


export default function DashboardPage() {
  const [generationResult, setGenerationResult] = useState<GenerateAppFromPromptOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerationComplete = (result: GenerateAppFromPromptOutput) => {
    setGenerationResult(result);
    setIsGenerating(false);
  }

  const handleGenerationStart = () => {
    setIsGenerating(true);
    setGenerationResult(null);
  }

  const handleReset = () => {
    setIsGenerating(false);
    setGenerationResult(null);
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Dashboard
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Let's forge your new application.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <GenerationForm 
            isGenerating={isGenerating}
            onGenerationStart={handleGenerationStart}
            onGenerationComplete={handleGenerationComplete} 
          />
        </div>
        <div className="lg:col-span-1">
          <ProgressSidebar 
            isGenerating={isGenerating}
            generationResult={generationResult}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
