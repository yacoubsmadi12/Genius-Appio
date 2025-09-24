"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Database, CheckCircle } from "lucide-react";
import type { AppPlan } from "@/types";

interface DatabaseStepProps {
  appPlan: AppPlan;
  onComplete: () => void;
  onBack: () => void;
}

export function DatabaseStep({ appPlan, onComplete, onBack }: DatabaseStepProps) {
  const [selectedDatabase, setSelectedDatabase] = useState<string>(appPlan.backend);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleContinue = () => {
    onComplete();
  };

  const databaseOptions = [
    {
      id: 'firebase',
      name: 'Firebase',
      description: 'Google Firebase database with authentication and storage',
      features: ['User authentication', 'Real-time database', 'File storage', 'Free hosting']
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'PostgreSQL database with automatic API',
      features: ['SQL database', 'Automatic API', 'Advanced authentication', 'Real-time subscriptions']
    },
    {
      id: 'nodejs',
      name: 'Custom Node.js',
      description: 'Custom Node.js server with MongoDB or MySQL',
      features: ['Full control', 'High flexibility', 'Optimized performance', 'Customizable']
    }
  ];

  const selectedOption = databaseOptions.find(opt => opt.id === selectedDatabase);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Selection
        </CardTitle>
        <CardDescription>
          Choose the database type you want to connect to the "{appPlan.appName}" app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <>
            <RadioGroup value={selectedDatabase} onValueChange={setSelectedDatabase}>
              {databaseOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="text-base font-semibold cursor-pointer">
                      {option.name}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {option.features.map((feature, index) => (
                        <span key={index} className="text-xs bg-muted px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            {selectedOption && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-700 dark:text-blue-400 text-center mb-4">
                  Do you want to connect {selectedOption.name} to the app now?
                </p>
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting} 
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Connecting...
                    </>
                  ) : (
                    `Connect ${selectedOption.name}`
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connected Successfully!</h3>
            <p className="text-muted-foreground mb-4">
              {selectedOption?.name} has been connected to the "{appPlan.appName}" app successfully
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-green-700 dark:text-green-400">
                ✅ Database setup complete - we can now continue to select the app icon
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {isConnected && (
            <Button onClick={handleContinue}>
              Continue to Icon Selection
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}