"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ChevronLeft, Bot, CheckCircle } from "lucide-react";
import type { AppPlan } from "@/types";

interface PlanningStepProps {
  onComplete: (plan: AppPlan) => void;
  onBack: () => void;
}

export function PlanningStep({ onComplete, onBack }: PlanningStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plan, setPlan] = useState<AppPlan | null>(null);

  // Sample plan for demo (in real app, this comes from AI)
  const samplePlan: AppPlan = {
    appName: "AI Story Gen",
    description: "AI-powered story generation application",
    pages: [
      "Home Page",
      "Create New Story Page", 
      "Personal Library Page",
      "Settings Page",
      "Profile Page"
    ],
    features: [
      "AI story generation",
      "Save favorite stories",
      "Share stories",
      "Customize story type",
      "Dark reading mode"
    ],
    colors: ["Dark Blue", "Gold", "White"],
    backend: "firebase"
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setPlan(samplePlan);
    setIsAnalyzing(false);
  };

  const handleConfirm = () => {
    if (plan) {
      onComplete(plan);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Project Planning
        </CardTitle>
        <CardDescription>
          I'll analyze your request and create a detailed plan for the app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!plan && !isAnalyzing && (
          <div className="text-center p-8">
            <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-4">Ready to analyze your request and create an app plan</p>
            <Button onClick={handleAnalyze} size="lg">
              Start Analysis
            </Button>
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center p-8">
            <div className="animate-spin h-16 w-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Analyzing request...</p>
            <p className="text-muted-foreground">Understanding your requirements and creating a detailed plan</p>
          </div>
        )}

        {plan && (
          <div className="space-y-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 dark:text-green-400 font-semibold">Plan created successfully!</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">📱 App Name</h3>
                <p className="text-2xl font-bold text-primary">{plan.appName}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">📝 Description</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">📄 Suggested Pages</h3>
                <div className="flex flex-wrap gap-2">
                  {plan.pages.map((page, index) => (
                    <Badge key={index} variant="secondary">{page}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">⚡ Features</h3>
                <div className="flex flex-wrap gap-2">
                  {plan.features.map((feature, index) => (
                    <Badge key={index} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">🎨 Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {plan.colors.map((color, index) => (
                    <Badge key={index} variant="default">{color}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-blue-700 dark:text-blue-400 text-center">
                Do you approve this plan? We can continue to select the database
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {plan && (
            <Button onClick={handleConfirm}>
              Approve, Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}