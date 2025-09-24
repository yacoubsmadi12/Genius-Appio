"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Database, 
  CheckCircle, 
  Loader2,
  Settings,
  Zap,
  Server,
  Cloud
} from "lucide-react";
import type { Project } from "@/types";

interface BackendConnectionProps {
  project: Project;
  onConnect: (backend: 'firebase' | 'supabase' | 'nodejs') => void;
  onCancel: () => void;
}

export function BackendConnection({ project, onConnect, onCancel }: BackendConnectionProps) {
  const [selectedBackend, setSelectedBackend] = useState<'firebase' | 'supabase' | 'nodejs'>('firebase');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionStep, setConnectionStep] = useState('');

  const backendOptions = [
    {
      id: 'firebase' as const,
      name: 'Firebase',
      description: 'Google\'s mobile and web application platform',
      icon: <Cloud className="h-6 w-6" />,
      features: [
        'Real-time Database',
        'Authentication',
        'Cloud Storage',
        'Push Notifications',
        'Analytics',
        'Free tier available'
      ],
      pros: 'Easy setup, great for mobile apps, real-time features',
      cons: 'Google dependency, can be expensive at scale'
    },
    {
      id: 'supabase' as const,
      name: 'Supabase',
      description: 'Open-source Firebase alternative with PostgreSQL',
      icon: <Zap className="h-6 w-6" />,
      features: [
        'PostgreSQL Database',
        'Row-level Security',
        'Real-time Subscriptions',
        'Built-in Authentication',
        'Auto-generated APIs',
        'Open Source'
      ],
      pros: 'Open source, SQL database, great developer tools',
      cons: 'Newer platform, smaller ecosystem'
    },
    {
      id: 'nodejs' as const,
      name: 'Custom Node.js',
      description: 'Custom backend with full control and flexibility',
      icon: <Server className="h-6 w-6" />,
      features: [
        'Full Control',
        'Any Database (MongoDB, MySQL, etc.)',
        'Custom API Design',
        'Advanced Security',
        'Scalable Architecture',
        'No Vendor Lock-in'
      ],
      pros: 'Maximum flexibility, no vendor lock-in, full customization',
      cons: 'Requires more setup and maintenance'
    }
  ];

  const selectedOption = backendOptions.find(opt => opt.id === selectedBackend);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionProgress(0);

    const steps = [
      'Initializing backend connection...',
      `Setting up ${selectedOption?.name} configuration...`,
      'Generating authentication modules...',
      'Creating database models...',
      'Connecting Flutter services...',
      'Testing connection...',
      'Finalizing integration...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setConnectionStep(steps[i]);
      setConnectionProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsConnecting(false);
    onConnect(selectedBackend);
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold">Connecting Backend</h1>
                <p className="text-sm text-muted-foreground">
                  Setting up {selectedOption?.name} for {project.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Progress */}
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Setting up your backend</h2>
                <p className="text-muted-foreground mb-6">{connectionStep}</p>
              </div>

              <div className="space-y-4">
                <Progress value={connectionProgress} className="w-full" />
                <p className="text-sm font-medium">{Math.round(connectionProgress)}% Complete</p>
              </div>

              <div className="mt-8">
                <Badge variant="secondary" className="text-sm">
                  {selectedOption?.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
              <div className="h-6 border-l border-border" />
              <div>
                <h1 className="text-xl font-bold">Connect Backend</h1>
                <p className="text-sm text-muted-foreground">
                  Choose a backend service for {project.name}
                </p>
              </div>
            </div>
            
            <Button onClick={handleConnect} size="lg">
              <Database className="h-4 w-4 mr-2" />
              Connect {selectedOption?.name}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Backend Options */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Choose Your Backend</h2>
                <p className="text-muted-foreground">
                  Select the backend service that best fits your app's requirements
                </p>
              </div>

              <RadioGroup 
                value={selectedBackend} 
                onValueChange={(value) => setSelectedBackend(value as 'firebase' | 'supabase' | 'nodejs')}
                className="space-y-4"
              >
                {backendOptions.map((option) => (
                  <div key={option.id} className="relative">
                    <Card className={`cursor-pointer transition-all ${
                      selectedBackend === option.id 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:shadow-md'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <RadioGroupItem 
                            value={option.id} 
                            id={option.id} 
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {option.icon}
                              <Label 
                                htmlFor={option.id} 
                                className="text-lg font-semibold cursor-pointer"
                              >
                                {option.name}
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                              {option.description}
                            </p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                              {option.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>

                            <div className="text-xs space-y-1">
                              <p><span className="font-medium text-green-600">Pros:</span> {option.pros}</p>
                              <p><span className="font-medium text-orange-600">Cons:</span> {option.cons}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Integration Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  What We'll Set Up
                </CardTitle>
                <CardDescription>
                  After connecting {selectedOption?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Authentication service</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Database connection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">API endpoints</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Flutter service integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Security configuration</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Pages that will be enhanced:</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {project.pages.length > 0 ? (
                      project.pages.map((page) => (
                        <div key={page.id} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          {page.name}
                        </div>
                      ))
                    ) : (
                      <p>No pages created yet</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}