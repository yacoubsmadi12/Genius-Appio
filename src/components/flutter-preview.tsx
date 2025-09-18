"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Smartphone, X, ExternalLink, Loader, AlertCircle, Play, Pause, RefreshCw } from "lucide-react";
import type { GenerateAppFromPromptOutput } from "@/ai/flows";

interface FlutterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  generationResult: GenerateAppFromPromptOutput;
  appName: string;
}

export function FlutterPreview({ isOpen, onClose, generationResult, appName }: FlutterPreviewProps) {
  const [activeTab, setActiveTab] = useState("simulator");
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isSimulatorLoading, setIsSimulatorLoading] = useState(false);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const simulatorRef = useRef<HTMLDivElement>(null);

  // Find main.dart content
  const mainDartFile = generationResult.files.find(file => file.path === 'lib/main.dart');
  const mainDartContent = mainDartFile?.content || '';

  // Create DartPad content with the generated main.dart
  const createDartPadContent = () => {
    if (!mainDartContent) {
      return createFallbackFlutterApp();
    }
    
    // Try to use the actual generated code, simplified for DartPad
    try {
      // Remove imports that don't work in DartPad and simplify the code
      let simplifiedCode = mainDartContent
        .replace(/import\s+[^;]+;?\n/g, '') // Remove custom imports
        .replace(/package:[^\/]+\/[^'";]+['"]/g, "'package:flutter/material.dart'"); // Fix package imports
      
      // Add necessary imports at the top
      simplifiedCode = `import 'package:flutter/material.dart';\n\n${simplifiedCode}`;
      
      // If the code is too complex, fallback to simple version
      if (simplifiedCode.length > 5000 || simplifiedCode.includes('async') || simplifiedCode.includes('http')) {
        return createFallbackFlutterApp();
      }
      
      return simplifiedCode;
    } catch (error) {
      console.warn('Failed to process generated code for DartPad:', error);
      return createFallbackFlutterApp();
    }
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

  // FlutterSimulator Component - يشغل التطبيق فعلياً
  interface FlutterSimulatorProps {
    files: Array<{path: string; content: string}>;
    appName: string;
    isLoading: boolean;
    isRunning: boolean;
    onStart: () => void;
    onStop: () => void;
    onLoadingChange: (loading: boolean) => void;
  }

  function FlutterSimulator({ files, appName, isLoading, isRunning, onStart, onStop, onLoadingChange }: FlutterSimulatorProps) {
    const [simulatorUrl, setSimulatorUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // تشغيل التطبيق في DartPad الحقيقي
    const runFlutterApp = async () => {
      setIsCreatingProject(true);
      onLoadingChange(true);
      setError('');

      try {
        // إنشاء DartPad Flutter حقيقي
        const mainDartFile = files.find(f => f.path === 'lib/main.dart');
        
        if (!mainDartFile) {
          throw new Error('لم يتم العثور على ملف main.dart');
        }

        // تحضير الكود للتشغيل في DartPad
        const cleanedCode = prepareCodeForDartPad(mainDartFile.content);
        
        // إنشاء embed DartPad حقيقي مع الكود المُولّد
        const dartPadEmbedUrl = createDartPadEmbedUrl(cleanedCode);
        
        setSimulatorUrl(dartPadEmbedUrl);
        onStart();
        
      } catch (err) {
        setError(`فشل في تشغيل المحاكي: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
        console.error('Simulator error:', err);
      } finally {
        setIsCreatingProject(false);
        onLoadingChange(false);
      }
    };

    // تحضير الكود للتشغيل في DartPad الحقيقي
    const prepareCodeForDartPad = (dartContent: string): string => {
      try {
        // إزالة imports غير المدعومة في DartPad وإضافة الأساسية
        let cleanedCode = dartContent
          .replace(/import\s+[^;]+\/[^;]+\.dart['"]\s*;/g, '') // Remove local imports
          .replace(/import\s+['"']package:(?!flutter\/)[^'"]+['"]\s*;/g, ''); // Remove non-flutter packages

        // التأكد من وجود flutter/material import
        if (!cleanedCode.includes("import 'package:flutter/material.dart'")) {
          cleanedCode = "import 'package:flutter/material.dart';\n\n" + cleanedCode;
        }

        // إزالة التعقيدات غير المدعومة
        cleanedCode = cleanedCode
          .replace(/async\s+{/g, '{') // Remove async from simple functions
          .replace(/await\s+/g, '') // Remove await keywords
          .replace(/Future<[^>]*>/g, 'void') // Replace Future types
          .replace(/Stream<[^>]*>/g, 'void'); // Replace Stream types

        return cleanedCode;
      } catch (error) {
        console.warn('Failed to clean code for DartPad, using fallback');
        return createDartPadFallback();
      }
    };

    // إنشاء URL لـ DartPad embed مع الكود
    const createDartPadEmbedUrl = (code: string): string => {
      // ترميز الكود للـ URL
      const encodedCode = encodeURIComponent(code);
      
      // إنشاء URL لـ DartPad embed
      const baseUrl = 'https://dartpad.dev/embed-flutter.html';
      const params = new URLSearchParams({
        id: '',
        theme: 'dark',
        run: 'true',
        split: 'false'
      });

      // استخدام hash للكود (DartPad يقبل الكود في fragment)
      return `${baseUrl}?${params.toString()}#${encodedCode}`;
    };

    const createDartPadFallback = (): string => {
      return `import 'package:flutter/material.dart';

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
              'مرحباً بك في ${appName}!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Text(
              'تم إنشاؤه بالذكاء الاصطناعي',
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
}`;
    };

    // إنشاء Flutter Web app آمن ومحدود (DEPRECATED - استبدل بـ DartPad)
    const createSecureFlutterWeb_DEPRECATED = async (mainDartContent: string, appName: string): Promise<string> => {
      // تحليل محتوى main.dart للحصول على معلومات التطبيق
      const appInfo = parseFlutterApp(mainDartContent);
      
      return `<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${appInfo.title || appName}</title>
    <style>
        body { 
            margin: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f5f5f5;
            direction: ${appInfo.isRtl ? 'rtl' : 'ltr'};
        }
        .app-container { 
            display: flex; 
            flex-direction: column; 
            height: 100vh; 
        }
        .app-bar { 
            background: ${appInfo.primaryColor}; 
            color: white; 
            padding: 16px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: relative;
        }
        .app-bar h1 { 
            margin: 0; 
            font-size: 20px; 
            font-weight: 500; 
        }
        .body-content { 
            flex: 1; 
            background: white; 
            padding: 20px;
            overflow-y: auto;
        }
        .screen-container { 
            max-width: 600px; 
            margin: 0 auto; 
            text-align: center; 
        }
        .flutter-icon { 
            width: 80px; 
            height: 80px; 
            margin: 20px auto; 
            border-radius: 50%; 
            background: ${appInfo.primaryColor}; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-size: 32px; 
        }
        .welcome-text { 
            font-size: 24px; 
            font-weight: bold; 
            color: #333; 
            margin: 20px 0; 
        }
        .subtitle { 
            color: #666; 
            margin-bottom: 30px; 
        }
        .features-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; 
            margin: 30px 0; 
        }
        .feature-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 20px; 
            cursor: pointer; 
            transition: all 0.3s ease; 
        }
        .feature-card:hover { 
            background: ${appInfo.primaryColor}10; 
            border-color: ${appInfo.primaryColor}; 
            transform: translateY(-2px); 
        }
        .feature-icon { 
            font-size: 24px; 
            margin-bottom: 10px; 
        }
        .floating-action-button { 
            position: fixed; 
            bottom: 20px; 
            ${appInfo.isRtl ? 'left' : 'right'}: 20px; 
            width: 56px; 
            height: 56px; 
            border-radius: 50%; 
            background: ${appInfo.primaryColor}; 
            border: none; 
            color: white; 
            font-size: 24px; 
            cursor: pointer; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); 
            transition: all 0.3s ease; 
        }
        .floating-action-button:hover { 
            transform: scale(1.1); 
        }
        .navigation-drawer {
            display: none;
            position: fixed;
            top: 0;
            ${appInfo.isRtl ? 'right' : 'left'}: 0;
            width: 250px;
            height: 100vh;
            background: white;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .snackbar {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #323232;
            color: white;
            padding: 14px 24px;
            border-radius: 4px;
            display: none;
            z-index: 1001;
        }
        .running-indicator {
            position: absolute;
            top: 10px;
            ${appInfo.isRtl ? 'left' : 'right'}: 10px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="app-bar">
            <div class="running-indicator">🟢 يعمل</div>
            <h1>${appInfo.title || appName}</h1>
        </div>
        
        <div class="body-content">
            <div class="screen-container">
                <div class="flutter-icon">🚀</div>
                <div class="welcome-text">
                    مرحباً بك في ${appInfo.title || appName}!
                </div>
                <div class="subtitle">
                    تطبيق Flutter تم إنشاؤه بالذكاء الاصطناعي
                </div>
                
                ${appInfo.screens.length > 0 ? `
                <div class="features-grid">
                    ${appInfo.screens.map(screen => `
                        <div class="feature-card" onclick="navigateToScreen('${screen.name}')">
                            <div class="feature-icon">${screen.icon}</div>
                            <div><strong>${screen.title}</strong></div>
                            <div style="font-size: 14px; color: #666; margin-top: 5px;">
                                ${screen.description}
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : `
                <div class="features-grid">
                    <div class="feature-card" onclick="showSnackbar('تم النقر على الميزة الأولى!')">
                        <div class="feature-icon">🎨</div>
                        <div><strong>تصميم جميل</strong></div>
                        <div style="font-size: 14px; color: #666; margin-top: 5px;">
                            واجهة مستخدم حديثة وسهلة الاستخدام
                        </div>
                    </div>
                    <div class="feature-card" onclick="showSnackbar('تم النقر على الأداء العالي!')">
                        <div class="feature-icon">⚡</div>
                        <div><strong>أداء عالي</strong></div>
                        <div style="font-size: 14px; color: #666; margin-top: 5px;">
                            تطبيق سريع ومحسن للأداء
                        </div>
                    </div>
                    <div class="feature-card" onclick="showSnackbar('تم النقر على سهولة الاستخدام!')">
                        <div class="feature-icon">🎯</div>
                        <div><strong>سهولة الاستخدام</strong></div>
                        <div style="font-size: 14px; color: #666; margin-top: 5px;">
                            تجربة مستخدم بديهية ومريحة
                        </div>
                    </div>
                </div>
                `}
            </div>
        </div>
        
        <button class="floating-action-button" onclick="showSnackbar('مرحباً من ${appInfo.title || appName}!')">
            +
        </button>
        
        <div class="snackbar" id="snackbar"></div>
    </div>

    <script>
        function showSnackbar(message) {
            const snackbar = document.getElementById('snackbar');
            snackbar.textContent = message;
            snackbar.style.display = 'block';
            setTimeout(() => {
                snackbar.style.display = 'none';
            }, 3000);
        }
        
        function navigateToScreen(screenName) {
            showSnackbar(\`الانتقال إلى \${screenName}\`);
            // هنا يمكن إضافة منطق التنقل الحقيقي
        }
        
        // تأثيرات تفاعلية
        document.addEventListener('DOMContentLoaded', function() {
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-2px)';
                    }, 150);
                });
            });
            
            // عرض رسالة ترحيب
            setTimeout(() => {
                showSnackbar('🎉 مرحباً! التطبيق جاهز للاستخدام');
            }, 1000);
        });
    </script>
</body>
</html>`;
    };

    // تحليل محتوى Flutter للحصول على معلومات التطبيق
    const parseFlutterApp = (dartContent: string) => {
      const titleMatch = dartContent.match(/title:\s*['"]([^'"]+)['"]/);
      const colorMatch = dartContent.match(/primarySwatch:\s*Colors\.(\w+)/);
      const isRtl = dartContent.includes('العربية') || dartContent.includes('مرحباً');
      
      const colorMap: { [key: string]: string } = {
        blue: '#2196F3', red: '#F44336', green: '#4CAF50',
        purple: '#9C27B0', orange: '#FF9800', teal: '#009688',
        indigo: '#3F51B5', pink: '#E91E63'
      };
      
      // استخراج الشاشات من ملفات المشروع
      const screens = files
        .filter(f => f.path.includes('screen') || f.path.includes('page'))
        .map((file, index) => ({
          name: file.path.split('/').pop()?.replace('.dart', '') || `Screen${index + 1}`,
          title: file.path.split('/').pop()?.replace('.dart', '').replace('_', ' ') || `الشاشة ${index + 1}`,
          icon: ['🏠', '👤', '⚙️', '📊', '💬', '🔍'][index] || '📄',
          description: `شاشة ${file.path.split('/').pop()?.replace('.dart', '').replace('_', ' ') || 'افتراضية'}`
        }));
      
      return {
        title: titleMatch ? titleMatch[1] : '',
        primaryColor: colorMap[colorMatch?.[1] || 'blue'] || '#2196F3',
        isRtl,
        screens
      };
    };

    const stopSimulator = () => {
      // تنظيف iframe أولاً
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
      
      // تنظيف الـ blob URL لتجنب تسرب الذاكرة
      if (simulatorUrl && simulatorUrl.startsWith('blob:')) {
        URL.revokeObjectURL(simulatorUrl);
      }
      
      setSimulatorUrl('');
      onStop();
    };

    const restartSimulator = async () => {
      stopSimulator();
      await new Promise(resolve => setTimeout(resolve, 1000)); // انتظار ثانية واحدة
      await runFlutterApp();
    };

    // تنظيف تلقائي للذاكرة عند إغلاق المكون
    useEffect(() => {
      return () => {
        if (simulatorUrl && simulatorUrl.startsWith('blob:')) {
          URL.revokeObjectURL(simulatorUrl);
        }
      };
    }, [simulatorUrl]);

    return (
      <div className="h-full flex flex-col">
        {/* شريط التحكم */}
        <div className="flex-shrink-0 bg-gray-900 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isRunning ? `${appName} - يعمل` : 'محاكي Flutter'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isRunning && (
              <Button
                size="sm"
                onClick={runFlutterApp}
                disabled={isCreatingProject}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingProject ? (
                  <Loader className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Play className="h-4 w-4 mr-1" />
                )}
                {isCreatingProject ? 'جاري التحضير...' : 'تشغيل التطبيق'}
              </Button>
            )}
            
            {isRunning && (
              <>
                <Button
                  size="sm"
                  onClick={restartSimulator}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  إعادة تشغيل
                </Button>
                <Button
                  size="sm"
                  onClick={stopSimulator}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-900"
                >
                  <Pause className="h-4 w-4 mr-1" />
                  إيقاف
                </Button>
              </>
            )}
          </div>
        </div>

        {/* منطقة المحاكي */}
        <div className="flex-1 bg-gray-100 relative">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-medium text-red-800 mb-2">خطأ في المحاكي</h3>
                <p className="text-red-600 text-sm mb-4">{error}</p>
                <Button onClick={runFlutterApp} size="sm" variant="outline">
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}
          
          {!isRunning && !error && !isCreatingProject && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Smartphone className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">محاكي DartPad الحقيقي</h3>
                <p className="text-gray-600 text-sm max-w-md">
                  اضغط "تشغيل التطبيق" لتشغيل الكود المُولّد في DartPad الحقيقي مع Flutter Web
                </p>
                <Button onClick={runFlutterApp} className="bg-blue-600 hover:bg-blue-700">
                  <Play className="h-4 w-4 mr-2" />
                  تشغيل التطبيق الآن
                </Button>
              </div>
            </div>
          )}

          {isCreatingProject && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
              <div className="text-center space-y-4">
                <Loader className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                <h3 className="text-lg font-medium text-gray-800">جاري تحضير المحاكي...</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>⚡ تنظيف كود Dart</p>
                  <p>🏗️ تحضير DartPad</p>
                  <p>📱 تشغيل Flutter Web</p>
                </div>
              </div>
            </div>
          )}

          {isRunning && simulatorUrl && (
            <div className="w-full h-full flex items-center justify-center p-4">
              {/* جهاز وهمي يحيط بالتطبيق */}
              <div className="relative">
                {/* إطار الجهاز */}
                <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-6 shadow-2xl">
                  {/* شريط الحالة للجهاز */}
                  <div className="bg-black text-white text-xs py-2 px-4 rounded-t-2xl flex justify-between items-center">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-green-400 rounded-sm"></div>
                      <div className="w-6 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* شاشة التطبيق */}
                  <div className="w-full h-[520px] bg-white rounded-b-2xl overflow-hidden">
                    <iframe
                      ref={iframeRef}
                      src={simulatorUrl}
                      className="w-full h-full border-0"
                      title={`Flutter App - ${appName}`}
                      sandbox="allow-scripts allow-same-origin"
                      referrerPolicy="no-referrer"
                      allow="accelerometer; gyroscope"
                      onLoad={() => {
                        console.log('DartPad Flutter app loaded successfully');
                        setError(''); // إزالة أي أخطاء سابقة
                      }}
                      onError={() => {
                        setError('فشل في تحميل محاكي DartPad');
                      }}
                    />
                  </div>
                </div>

                {/* معلومات التطبيق */}
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 translate-x-full">
                  <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
                    <h4 className="font-medium text-gray-800 mb-2">🚀 DartPad يعمل!</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📱 Flutter Web حقيقي</p>
                      <p>⚡ تشغيل مباشر للكود</p>
                      <p>🎯 تفاعل كامل</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* شريط الحالة السفلي */}
        {isRunning && (
          <div className="flex-shrink-0 bg-gray-50 border-t p-2 text-xs text-gray-600 text-center">
            💡 هذا محاكي حقيقي - يمكنك التفاعل مع التطبيق كما لو كان على جهاز فعلي
          </div>
        )}
      </div>
    );
  }

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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="simulator">محاكي حقيقي</TabsTrigger>
            <TabsTrigger value="preview">معاينة</TabsTrigger>
            <TabsTrigger value="dartpad">DartPad</TabsTrigger>
            <TabsTrigger value="code">الكود</TabsTrigger>
          </TabsList>

          <TabsContent value="simulator" className="flex-1">
            <FlutterSimulator 
              files={generationResult.files}
              appName={appName}
              isLoading={isSimulatorLoading}
              isRunning={isSimulatorRunning}
              onStart={() => setIsSimulatorRunning(true)}
              onStop={() => setIsSimulatorRunning(false)}
              onLoadingChange={setIsSimulatorLoading}
            />
          </TabsContent>

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