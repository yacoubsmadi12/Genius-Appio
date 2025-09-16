
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

  const [steps, setSteps] = useState<{ name: string; status: StepStatus }[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isGenerating && !generationResult) {
      setSteps([
        { name: "Warming up the AI...", status: "in_progress" },
        { name: "Generating code structure", status: "pending" },
        { name: "Writing files", status: "pending" },
        { name: "Packaging your project", status: "pending" },
      ]);
      setIsComplete(false);
    } else if (generationResult) {
      const finalSteps = [
        { name: "AI generation complete", status: "completed" as StepStatus },
        ...generationResult.files.map(file => ({
          name: `Wrote ${file.path}`,
          status: "completed" as StepStatus,
        })),
        { name: "Project packaged", status: "completed" as StepStatus },
      ];
      setSteps(finalSteps);
      setIsComplete(true);
    }
  }, [isGenerating, generationResult]);


  const handleDownload = async () => {
    if (!generationResult) return;

    const zip = new JSZip();
    generationResult.files.forEach(file => {
      zip.file(file.path, file.content);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    
    const element = document.createElement("a");
    element.href = URL.createObjectURL(zipBlob);
    element.download = "GeniusAPPio-Project.zip";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getIcon = (status: StepStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Loader className="h-5 w-5 animate-spin text-primary" />;
      case "pending":
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const handleStartNew = () => {
    onReset();
    setSteps([]);
    setIsComplete(false);
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Generation Progress</CardTitle>
        <CardDescription>Your app's status will appear below.</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px] flex items-center justify-center">
        {!isGenerating && !isComplete ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <FileCode className="h-12 w-12 mb-4" />
            <p>Fill out the form and click "Generate App" to start.</p>
          </div>
        ) : (
          <ul className="space-y-4 w-full">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center gap-4">
                {getIcon(step.status)}
                <span
                  className={cn(
                    "font-medium text-sm",
                    step.status === "pending" && "text-muted-foreground",
                    step.status === "completed" && "text-foreground"
                  )}
                >
                  {step.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {isComplete && (
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-green-600 font-medium">Generation Complete!</p>
          <Button className="w-full" onClick={handleDownload}>
            <FileArchive className="mr-2 h-4 w-4" /> Download Project ZIP
          </Button>
          <Button variant="outline" className="w-full" onClick={handleStartNew}>
            Start New Project
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
