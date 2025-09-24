"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Palette, Upload, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import type { AppPlan } from "@/types";

interface IconStepProps {
  appPlan: AppPlan;
  onComplete: () => void;
  onBack: () => void;
}

export function IconStep({ appPlan, onComplete, onBack }: IconStepProps) {
  const [iconOption, setIconOption] = useState<'generate' | 'upload'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleGenerateIcon = async () => {
    setIsGenerating(true);
    // Simulate icon generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGeneratedIcon("https://picsum.photos/200/200?random=1"); // Sample icon
    setIsGenerating(false);
    setIsReady(true);
  };

  const handleUpload = () => {
    // Simulate icon upload
    setIsReady(true);
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          App Icon
        </CardTitle>
        <CardDescription>
          Choose how you want to create an icon for the "{appPlan.appName}" app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isReady ? (
          <>
            <RadioGroup value={iconOption} onValueChange={(value) => setIconOption(value as 'generate' | 'upload')}>
              <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                <RadioGroupItem value="generate" id="generate" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="generate" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    I'll create a custom icon based on the app description and selected colors
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                <RadioGroupItem value="upload" id="upload" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="upload" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload an icon from your device
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a ready icon from your device (PNG, JPG, SVG)
                  </p>
                </div>
              </div>
            </RadioGroup>

            {iconOption === 'generate' && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Smart Icon Generation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    I'll use the app name "{appPlan.appName}" and its description to create a unique icon
                  </p>
                  <Button 
                    onClick={handleGenerateIcon} 
                    disabled={isGenerating} 
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      'Generate Icon'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {iconOption === 'upload' && (
              <div className="border-2 border-dashed border-muted-foreground/25 p-6 rounded-lg text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">Choose an icon file from your device</p>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            )}

            {isGenerating && (
              <div className="text-center p-8">
                <div className="animate-pulse">
                  <div className="h-24 w-24 bg-muted rounded-xl mx-auto mb-4"></div>
                </div>
                <p className="text-muted-foreground">Creating custom icon for your app...</p>
              </div>
            )}

            {generatedIcon && !isGenerating && (
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Image 
                  src={generatedIcon} 
                  alt="Generated App Icon" 
                  width={96} 
                  height={96}
                  className="rounded-xl mx-auto mb-4 shadow-lg"
                />
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 dark:text-green-400 font-semibold">
                  Icon created successfully!
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Icon Ready!</h3>
            <p className="text-muted-foreground mb-4">
              "{appPlan.appName}" app icon has been prepared successfully
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-blue-700 dark:text-blue-400">
                🎉 Everything ready! We can now start generating project files
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {isReady && (
            <Button onClick={handleContinue} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              Start Project Generation! 🚀
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}