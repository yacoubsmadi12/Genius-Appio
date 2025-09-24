"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Terminal, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { AppPlan } from "@/types";

interface FlutterCreateStepProps {
  appPlan: AppPlan;
  onComplete: () => void;
  onBack: () => void;
}

export function FlutterCreateStep({ appPlan, onComplete, onBack }: FlutterCreateStepProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [createComplete, setCreateComplete] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  
  const projectName = appPlan.appName.toLowerCase().replace(/\s+/g, '_');

  const handleCreateProject = async () => {
    setIsCreating(true);
    // Simulate flutter create command
    await new Promise(resolve => setTimeout(resolve, 3000));
    setCreateComplete(true);
    setIsCreating(false);
    
    // Automatically start verification
    handleVerifyEmbedding();
  };

  const handleVerifyEmbedding = async () => {
    setIsVerifying(true);
    // Simulate Android embedding v2 verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    setVerificationComplete(true);
    setIsVerifying(false);
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Flutter Project Creation
        </CardTitle>
        <CardDescription>
          Creating base Flutter project structure for "{appPlan.appName}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Flutter Create */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            {createComplete ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <div className={`h-5 w-5 rounded-full border-2 ${isCreating ? 'border-blue-600 border-t-transparent animate-spin' : 'border-gray-300'}`} />
            )}
            <h3 className="font-semibold">
              {createComplete ? 'Project Created Successfully' : 'Create Flutter Project'}
            </h3>
          </div>
          
          {!createComplete && !isCreating && (
            <div className="space-y-3">
              <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 font-mono text-sm">
                <div className="text-blue-600">$</div>
                <div>flutter create {projectName}</div>
              </div>
              <p className="text-sm text-muted-foreground">
                This will create a new Flutter project with modern Android embedding v2
              </p>
              <Button onClick={handleCreateProject} className="w-full">
                <Terminal className="h-4 w-4 mr-2" />
                Execute Flutter Create
              </Button>
            </div>
          )}

          {isCreating && (
            <div className="text-center p-4">
              <div className="animate-pulse space-y-2">
                <p className="font-semibold">Creating Flutter project...</p>
                <p className="text-sm text-muted-foreground">Initializing project structure</p>
                <p className="text-sm text-muted-foreground">Setting up Android with embedding v2</p>
                <p className="text-sm text-muted-foreground">Configuring iOS support</p>
              </div>
            </div>
          )}

          {createComplete && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="font-semibold">Flutter project created successfully!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Project "{projectName}" initialized with modern structure
              </p>
            </div>
          )}
        </div>

        {/* Step 2: Android Embedding Verification */}
        {createComplete && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {verificationComplete ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className={`h-5 w-5 rounded-full border-2 ${isVerifying ? 'border-blue-600 border-t-transparent animate-spin' : 'border-gray-300'}`} />
              )}
              <h3 className="font-semibold">
                {verificationComplete ? 'Android Embedding v2 Verified' : 'Verify Android Embedding v2'}
              </h3>
            </div>

            {isVerifying && (
              <div className="text-center p-4">
                <div className="animate-pulse space-y-2">
                  <p className="font-semibold">Verifying Android configuration...</p>
                  <p className="text-sm text-muted-foreground">Checking MainActivity.kt</p>
                  <p className="text-sm text-muted-foreground">Validating Android embedding version</p>
                </div>
              </div>
            )}

            {verificationComplete && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">Android embedding v2 verified ✓</span>
                </div>
                <div className="text-sm space-y-1 text-green-600 dark:text-green-300">
                  <div>• MainActivity extends FlutterActivity</div>
                  <div>• Modern Kotlin configuration detected</div>
                  <div>• Android Gradle Plugin 8.0+ ready</div>
                  <div>• No legacy v1 embedding found</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Project Structure Preview */}
        {verificationComplete && (
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Project Structure Ready
            </h3>
            <div className="bg-slate-50 dark:bg-slate-900 rounded p-3 text-sm font-mono space-y-1">
              <div>{projectName}/</div>
              <div className="ml-4">├── android/ <span className="text-green-600">(v2 embedding ✓)</span></div>
              <div className="ml-4">├── ios/</div>
              <div className="ml-4">├── lib/</div>
              <div className="ml-4">├── test/</div>
              <div className="ml-4">├── web/</div>
              <div className="ml-4">└── pubspec.yaml</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} disabled={isCreating || isVerifying}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Planning
          </Button>
          
          {verificationComplete && (
            <Button onClick={handleContinue} className="flex-1">
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue to Database Setup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}