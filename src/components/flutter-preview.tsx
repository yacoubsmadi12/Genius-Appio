"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Smartphone, X, ExternalLink, Loader, AlertCircle } from "lucide-react";
import type { GenerateAppFromPromptOutput } from "@/ai/flows";

interface FlutterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  generationResult: GenerateAppFromPromptOutput;
  appName: string;
}

export function FlutterPreview({ isOpen, onClose, generationResult, appName }: FlutterPreviewProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Find main.dart content
  const mainDartFile = generationResult.files.find(file => file.path === 'lib/main.dart');
  const mainDartContent = mainDartFile?.content || '';

  // Create DartPad content with the generated main.dart
  const createDartPadContent = () => {
    if (!mainDartContent) {
      return createFallbackFlutterApp();
    }
    
    // Always create a simplified version for DartPad compatibility
    return createFallbackFlutterApp();
  };

  const createFallbackFlutterApp = () => {
    return `
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${appName}',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${appName}'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.flutter_dash, size: 100, color: Colors.blue),
            SizedBox(height: 20),
            Text(
              'مرحباً بك في التطبيق المولد!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Text(
              'تم إنشاء هذا التطبيق بواسطة الذكاء الاصطناعي',
              style: TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('مرحباً من ${appName}!')),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}
    `.trim();
  };

  const dartPadContent = createDartPadContent();

  // Create a simplified mobile-like preview using HTML/CSS
  const createMobilePreview = () => {
    // Extract app name from main.dart content
    const titleMatch = mainDartContent.match(/title:\s*['"]([^'"]+)['"]/);
    const title = titleMatch ? titleMatch[1] : appName;
    
    // Extract theme color from main.dart content
    const colorMatch = mainDartContent.match(/primarySwatch:\s*Colors\.(\w+)/);
    const primaryColor = colorMatch ? colorMatch[1] : 'blue';
    
    // Map Flutter colors to CSS colors
    const colorMap: { [key: string]: string } = {
      blue: '#2196F3',
      red: '#F44336',
      green: '#4CAF50',
      purple: '#9C27B0',
      orange: '#FF9800',
      teal: '#009688',
      indigo: '#3F51B5',
      pink: '#E91E63'
    };
    
    const themeColor = colorMap[primaryColor] || '#2196F3';
    
    // Extract screens from the generated files
    const screenFiles = generationResult.files.filter(file => 
      file.path.includes('screens/') || file.path.includes('screen.dart')
    );
    
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
        {/* Phone status bar */}
        <div className="bg-black text-white text-xs py-1 px-4 flex justify-between items-center">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <div className="w-6 h-2 bg-white rounded-sm"></div>
            <div className="w-4 h-2 bg-white rounded-sm"></div>
          </div>
        </div>
        
        {/* App content */}
        <div className="h-96 bg-gray-50 flex flex-col">
          {/* App bar */}
          <div 
            className="text-white py-4 px-4 shadow-md"
            style={{ backgroundColor: themeColor }}
          >
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          
          {/* Body content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {title}
              </h2>
              <p className="text-gray-600 text-sm">
                تم إنشاء هذا التطبيق باستخدام Flutter
              </p>
              
              {/* Show available screens */}
              <div className="space-y-2 mt-6">
                <p className="text-sm font-medium text-gray-700">الصفحات المتوفرة:</p>
                {screenFiles.length > 0 ? (
                  screenFiles.map((file, index) => {
                    const screenName = file.path.split('/').pop()?.replace('.dart', '') || `Screen ${index + 1}`;
                    return (
                      <div 
                        key={index}
                        className="bg-white rounded-lg p-3 shadow-sm border flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        ></div>
                        <span className="text-sm capitalize">{screenName.replace('_', ' ')}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-lg p-3 shadow-sm border flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <span className="text-sm">الصفحة الرئيسية</span>
                  </div>
                )}
              </div>
              
              {/* Note about preview */}
              <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  💡 هذه معاينة تقريبية للتطبيق. استخدم تبويب "DartPad" لتشغيل الكود فعلياً.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            معاينة التطبيق: {appName}
          </DialogTitle>
          <DialogDescription>
            يمكنك مشاهدة التطبيق المولد في المحاكي أو استعراض الكود
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">المحاكي</TabsTrigger>
            <TabsTrigger value="dartpad">DartPad</TabsTrigger>
            <TabsTrigger value="code">الكود</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader className="h-12 w-12 animate-spin text-primary" />
                <p>جاري تحضير المعاينة...</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {createMobilePreview()}
              </div>
            )}
          </TabsContent>

          <TabsContent value="dartpad" className="flex-1">
            <div className="h-full border rounded-lg overflow-hidden">
              {dartPadContent ? (
                <div className="h-full flex flex-col">
                  <div className="bg-gray-100 p-2 border-b flex items-center justify-between">
                    <span className="text-sm font-medium">Flutter Web - DartPad (مبسط)</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Copy code to clipboard and open DartPad
                          navigator.clipboard.writeText(dartPadContent).then(() => {
                            window.open('https://dartpad.dev/', '_blank');
                          }).catch(() => {
                            // Fallback if clipboard API fails
                            window.open('https://dartpad.dev/', '_blank');
                          });
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        نسخ والفتح في DartPad
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-gray-50">
                    <div className="bg-white border rounded-lg h-full overflow-hidden">
                      <div className="bg-gray-800 text-white p-2">
                        <span className="text-sm font-mono">main.dart (للمعاينة)</span>
                      </div>
                      <ScrollArea className="h-full">
                        <pre className="p-4 text-sm">
                          <code>{dartPadContent}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-800 mb-1">كيفية الاستخدام:</p>
                          <ol className="text-blue-700 space-y-1">
                            <li>1. اضغط "نسخ والفتح في DartPad" أعلاه</li>
                            <li>2. في DartPad، احذف الكود الموجود والصق الكود المنسوخ</li>
                            <li>3. اضغط "Run" لتشغيل المعاينة التفاعلية</li>
                          </ol>
                          <p className="text-blue-600 mt-2 text-xs">
                            💡 هذه نسخة مبسطة. المشروع الكامل متعدد الملفات في ملف ZIP.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <p>لا يمكن إنشاء معاينة DartPad</p>
                    <p className="text-sm text-gray-600">تحقق من ملف main.dart</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1">
            <ScrollArea className="h-full border rounded-lg">
              <div className="p-4">
                <div className="space-y-6">
                  {generationResult.files.map((file, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 border-b">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          <span className="font-mono text-sm">{file.path}</span>
                        </div>
                      </div>
                      <pre className="bg-gray-50 p-4 text-sm overflow-x-auto">
                        <code>{file.content}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {generationResult.files.length} ملف تم إنشاؤه
          </div>
          <Button onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            إغلاق
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}