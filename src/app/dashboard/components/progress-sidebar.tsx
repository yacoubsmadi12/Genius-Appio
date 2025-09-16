
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
import { CheckCircle, Circle, Coffee, FileArchive, Loader, FileCode, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GenerateAppFromPromptOutput } from "@/ai/flows";


type StepStatus = "pending" | "in_progress" | "completed";

type ProgressSidebarProps = {
  isGenerating: boolean;
  generationResult: GenerateAppFromPromptOutput | null;
  onReset: () => void;
};


export function ProgressSidebar({ isGenerating, generationResult, onReset }: ProgressSidebarProps) {

  const [isZipping, setIsZipping] = useState(false);

  const handleDownload = async () => {
    if (!generationResult) return;

    setIsZipping(true);
    const zip = new JSZip();
    generationResult.files.forEach(file => {
      // Important: If the path contains folders, JSZip will create them.
      zip.file(file.path, file.content);
    });

    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      const element = document.createElement("a");
      element.href = URL.createObjectURL(zipBlob);
      element.download = "GeniusAPPio-Project.zip";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Failed to create ZIP file", error);
    } finally {
      setIsZipping(false);
    }
  };
  
  const handleStartNew = () => {
    onReset();
  }

  const isComplete = !isGenerating && generationResult !== null;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Generation Progress</CardTitle>
        <CardDescription>Your app's status will appear below.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px] flex items-center justify-center">
        {isGenerating ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <Loader className="h-12 w-12 mb-4 animate-spin" />
                <p className="font-semibold">Warming up the AI...</p>
                <p className="text-sm">Generating code structure and writing files.</p>
            </div>
        ) : !isComplete ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <FileCode className="h-12 w-12 mb-4" />
            <p>Fill out the form and click "Generate App" to start.</p>
          </div>
        ) : (
          <ul className="space-y-3 w-full h-64 overflow-y-auto pr-2">
            {generationResult.files.map((file, index) => (
              <li key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <FileCode className="h-5 w-5 text-primary flex-shrink-0" />
                <span
                  className="font-mono text-sm text-foreground truncate"
                  title={file.path}
                >
                  {file.path}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {isComplete && (
        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-center text-sm text-green-600 font-medium">
             <CheckCircle className="mr-2 h-4 w-4" />
            <span>Generation Complete!</span>
          </div>
          <Button className="w-full" onClick={handleDownload} disabled={isZipping}>
            {isZipping ? (
                <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    <span>Packaging...</span>
                </>
            ) : (
                <>
                    <FileArchive className="mr-2 h-4 w-4" /> 
                    <span>Download Project ZIP</span>
                </>
            )}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleStartNew}>
            Start New Project
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
