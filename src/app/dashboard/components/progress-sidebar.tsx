"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Circle, Coffee, FileArchive, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const generationSteps = [
  "Creating Flutter project",
  "Generating Pages",
  "Generating Images",
  "Linking navigation",
  "Creating backend skeleton",
  "Building ZIP file",
];

type StepStatus = "pending" | "in_progress" | "completed";

export function ProgressSidebar() {
  const [activeStep, setActiveStep] = useState(-1);
  const [statuses, setStatuses] = useState<StepStatus[]>(
    Array(generationSteps.length).fill("pending")
  );
  const [isComplete, setIsComplete] = useState(false);

  // This useEffect simulates the generation process
  useEffect(() => {
    if (activeStep >= 0 && activeStep < generationSteps.length) {
      const newStatuses = [...statuses];
      if (activeStep > 0) {
        newStatuses[activeStep - 1] = "completed";
      }
      newStatuses[activeStep] = "in_progress";
      setStatuses(newStatuses);

      const timer = setTimeout(() => {
        setActiveStep(activeStep + 1);
      }, 2000); // 2 seconds per step

      return () => clearTimeout(timer);
    } else if (activeStep === generationSteps.length) {
      const newStatuses = [...statuses];
      newStatuses[generationSteps.length - 1] = "completed";
      setStatuses(newStatuses);
      setIsComplete(true);
    }
  }, [activeStep]);

  const startGeneration = () => {
    setActiveStep(0);
    setStatuses(Array(generationSteps.length).fill("pending"));
    setIsComplete(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(["This is a placeholder for your generated project ZIP."], {
      type: "application/zip",
    });
    element.href = URL.createObjectURL(file);
    element.download = "GeniusAPPio-Project.zip";
    document.body.appendChild(element); // Required for this to work in FireFox
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

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Generation Progress</CardTitle>
        <CardDescription>Relax and have a coffee ☕</CardDescription>
      </CardHeader>
      <CardContent>
        {activeStep === -1 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
            <Coffee className="h-12 w-12 mb-4" />
            <p>Your app generation progress will appear here.</p>
            <Button onClick={startGeneration} className="mt-4">
              Simulate Generation
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {generationSteps.map((step, index) => (
              <li key={index} className="flex items-center gap-4">
                {getIcon(statuses[index])}
                <span
                  className={cn(
                    "font-medium",
                    statuses[index] === "pending" && "text-muted-foreground",
                    statuses[index] === "completed" && "line-through"
                  )}
                >
                  {step}
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
          <Button variant="outline" className="w-full" onClick={handleDownload}>
            Download APK (Optional)
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
