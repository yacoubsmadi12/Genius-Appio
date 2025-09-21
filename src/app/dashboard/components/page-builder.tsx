"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  Code, 
  RefreshCw, 
  Save,
  Loader2,
  Smartphone,
  FileCode,
  Palette
} from "lucide-react";
import type { Project, ProjectPage } from "../page";

const formSchema = z.object({
  name: z.string().min(1, "Page name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

interface PageBuilderProps {
  project: Project;
  page: ProjectPage | null; // null for new page, populated for editing
  onSave: (page: ProjectPage) => void;
  onCancel: () => void;
}

export function PageBuilder({ project, page, onSave, onCancel }: PageBuilderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPage, setGeneratedPage] = useState<ProjectPage | null>(page);
  const [activeTab, setActiveTab] = useState("prompt");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: page?.name || "",
      description: page?.description || "",
    },
  });

  const generatePageWithAI = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    try {
      // Call real Gemini API for page generation
      const response = await fetch('/api/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          projectContext: `${project.name}: ${project.description}`
        }),
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate page');
      }

      const newPage: ProjectPage = {
        id: page?.id || Date.now().toString(),
        name: values.name,
        description: values.description,
        createdAt: page?.createdAt || new Date(),
        code: result.code,
        widgetStructure: result.widgetStructure,
        previewUrl: `https://flutter-preview.example.com/${project.id}/${values.name.toLowerCase()}`
      };
      
      setGeneratedPage(newPage);
      setActiveTab("preview");
    } catch (error) {
      console.error('Page generation failed:', error);
      // Fallback to sample code if API fails
      const fallbackPage: ProjectPage = {
        id: page?.id || Date.now().toString(),
        name: values.name,
        description: values.description,
        createdAt: page?.createdAt || new Date(),
        code: generateSampleFlutterCode(values.name, values.description),
        widgetStructure: generateWidgetStructure(values.name),
        previewUrl: `https://flutter-preview.example.com/${project.id}/${values.name.toLowerCase()}`
      };
      
      setGeneratedPage(fallbackPage);
      setActiveTab("preview");
      
      // Show error message to user
      alert(`AI Generation Error: ${error instanceof Error ? error.message : 'Unknown error'}. Using fallback code.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedPage) {
      onSave(generatedPage);
    }
  };

  const handleRegenerate = () => {
    const values = form.getValues();
    generatePageWithAI(values);
  };

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
                <h1 className="text-xl font-bold">
                  {page ? "Edit Page" : "Create New Page"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Build with AI assistance for {project.name}
                </p>
              </div>
            </div>
            
            {generatedPage && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleRegenerate} disabled={isGenerating}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Page
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prompt">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Prompt
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedPage && !isGenerating}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" disabled={!generatedPage}>
              <Code className="h-4 w-4 mr-2" />
              Generated Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Describe Your Page
                </CardTitle>
                <CardDescription>
                  Tell AI what kind of page you want to create. Be specific about the layout, features, and functionality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(generatePageWithAI)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Splash Screen, Login Page, Home Dashboard"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            What should this page be called?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Page Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the page layout, components, colors, functionality, and user interactions. For example: 'A splash screen with app logo, loading animation, gradient background in blue and white colors, with smooth transition to login page after 3 seconds.'"
                              className="resize-none"
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide detailed description for AI to generate the perfect page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating with Gemini AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Page with Gemini AI
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mobile Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Mobile Preview
                  </CardTitle>
                  <CardDescription>
                    How your page will look on mobile devices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                        <p>Gemini AI is generating your page...</p>
                        <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
                      </div>
                    </div>
                  ) : generatedPage ? (
                    <div className="bg-slate-100 rounded-lg p-4 h-96 overflow-auto">
                      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
                        <div className="text-center space-y-4">
                          <div className="w-12 h-12 bg-primary rounded-lg mx-auto"></div>
                          <h2 className="text-lg font-semibold">{generatedPage.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {generatedPage.description}
                          </p>
                          <div className="space-y-2">
                            <div className="h-10 bg-primary rounded-lg"></div>
                            <div className="h-8 bg-muted rounded"></div>
                            <div className="h-8 bg-muted rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                      <p className="text-muted-foreground">Generate a page to see preview</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Widget Structure */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Widget Structure
                  </CardTitle>
                  <CardDescription>
                    Flutter widgets used in this page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedPage ? (
                    <div className="space-y-2">
                      {generatedPage.widgetStructure.split('\n').map((widget, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline">{widget.trim()}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Widget structure will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Generated Dart Code
                </CardTitle>
                <CardDescription>
                  Complete Flutter code for your page
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedPage ? (
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{generatedPage.code}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Generated code will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper functions to generate sample Flutter code and widget structure
function generateSampleFlutterCode(pageName: string, description: string): string {
  const className = pageName.replace(/\s+/g, '') + 'Page';
  
  return `import 'package:flutter/material.dart';

class ${className} extends StatelessWidget {
  const ${className}({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('${pageName}'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.flutter_dash,
              size: 100,
              color: Colors.blue,
            ),
            SizedBox(height: 20),
            Text(
              '${pageName}',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                '${description}',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}`;
}

function generateWidgetStructure(pageName: string): string {
  return `Scaffold
├── AppBar
│   └── Text
└── Center
    └── Column
        ├── Icon
        ├── SizedBox
        ├── Text
        ├── SizedBox
        └── Padding
            └── Text`;
}