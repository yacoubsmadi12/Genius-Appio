
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import JSZip from "jszip";
import { 
  Home, 
  FolderOpen, 
  Settings, 
  LogOut, 
  Smartphone, 
  Palette, 
  Upload,
  CheckSquare,
  Layers,
  Loader2,
  Download,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AppConfig {
  description: string;
  theme: 'light' | 'dark' | 'custom';
  primaryColor: string;
  appIcon: File | null;
  features: {
    firebaseAuth: boolean;
    supabaseDb: boolean;
    offlineMode: boolean;
  };
  pages: string[];
}

const availablePages = [
  'Splash Screen',
  'Login',
  'Register', 
  'Home',
  'Profile',
  'Settings',
  'Chat',
  'Notifications',
  'Search',
  'Dashboard',
  'About'
];

const sidebarItems = [
  { icon: Home, label: 'Dashboard', active: true },
  { icon: FolderOpen, label: 'My Projects' },
  { icon: Settings, label: 'Settings' },
  { icon: LogOut, label: 'Logout' }
];

export default function DashboardPage() {
  const [appConfig, setAppConfig] = useState<AppConfig>({
    description: '',
    theme: 'light',
    primaryColor: '#667EEA',
    appIcon: null,
    features: {
      firebaseAuth: false,
      supabaseDb: false,
      offlineMode: false
    },
    pages: ['Splash Screen', 'Home']
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDescriptionChange = (value: string) => {
    setAppConfig(prev => ({ ...prev, description: value }));
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'custom') => {
    setAppConfig(prev => ({ ...prev, theme }));
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAppConfig(prev => ({ ...prev, primaryColor: e.target.value }));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAppConfig(prev => ({ ...prev, appIcon: file }));
  };

  const handleFeatureToggle = (feature: keyof AppConfig['features']) => {
    setAppConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handlePageToggle = (page: string) => {
    setAppConfig(prev => ({
      ...prev,
      pages: prev.pages.includes(page)
        ? prev.pages.filter(p => p !== page)
        : [...prev.pages, page]
    }));
  };

  const buildPrompt = (): string => {
    return `Create a complete, professional Flutter project with the following specifications:

**App Description:** ${appConfig.description}

**Design Requirements:**
- Theme: ${appConfig.theme} theme
- Primary Color: ${appConfig.primaryColor}
- Use Material 3 design system
- Modern, beautiful UI with animations
- Child-friendly and playful design
- Smooth transitions and interactions

**Features to Include:**
${appConfig.features.firebaseAuth ? '- Firebase Authentication (login/register)' : ''}
${appConfig.features.supabaseDb ? '- Supabase Database integration' : ''}
${appConfig.features.offlineMode ? '- Offline mode capability' : ''}

**Pages to Generate:**
${appConfig.pages.map(page => `- ${page} page`).join('\n')}

**Technical Requirements:**
- Complete Flutter project structure with lib/main.dart
- Professional code with proper state management
- Responsive design for all screen sizes
- Smooth animations and transitions
- Material 3 components and styling
- Navigation between pages
- Clean, readable, and maintainable code
- Include pubspec.yaml with all dependencies

Please generate a complete, production-ready Flutter application that matches these specifications with beautiful design and smooth user experience.`;
  };

  const handleDownload = async () => {
    if (!generatedResult || !generatedResult.files) {
      alert('لا توجد ملفات للتحميل');
      return;
    }

    try {
      const zip = new JSZip();
      
      // إضافة كل ملف إلى الـ ZIP
      generatedResult.files.forEach((file: any) => {
        zip.file(file.path, file.content);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // إنشاء رابط التحميل
      const element = document.createElement("a");
      element.href = URL.createObjectURL(zipBlob);
      element.download = `Flutter-Project-${Date.now()}.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      // تنظيف
      URL.revokeObjectURL(element.href);
    } catch (error) {
      console.error("خطأ في إنشاء ملف ZIP:", error);
      alert('حدث خطأ أثناء تحضير التحميل');
    }
  };

  const generateApp = async () => {
    if (!appConfig.description.trim()) {
      setError('Please provide an app description');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const prompt = buildPrompt();
      
      const response = await fetch('/api/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'My Generated App',
          description: prompt,
          projectContext: 'Complete Flutter application generation'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate app');
      }

      const result = await response.json();
      setGeneratedResult(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Genius APPio</span>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  item.active 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">App Builder</h1>
              <p className="text-gray-600">Create your Flutter app with AI</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              AI Powered
            </Badge>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* App Builder Form */}
            <div className="space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    App Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Describe your app in detail. What should it do? Who is it for? What features should it have?"
                    value={appConfig.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                </CardContent>
              </Card>

              {/* Theme & Color */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme & Styling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <Select value={appConfig.theme} onValueChange={handleThemeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light Theme</SelectItem>
                        <SelectItem value="dark">Dark Theme</SelectItem>
                        <SelectItem value="custom">Custom Theme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appConfig.primaryColor}
                        onChange={handleColorChange}
                        className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <span className="font-mono text-sm text-gray-600">
                        {appConfig.primaryColor}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Icon Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    App Icon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    {appConfig.appIcon ? appConfig.appIcon.name : 'Upload App Icon'}
                  </Button>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="firebase"
                      checked={appConfig.features.firebaseAuth}
                      onCheckedChange={() => handleFeatureToggle('firebaseAuth')}
                    />
                    <label htmlFor="firebase" className="text-sm font-medium">
                      Firebase Authentication
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="supabase"
                      checked={appConfig.features.supabaseDb}
                      onCheckedChange={() => handleFeatureToggle('supabaseDb')}
                    />
                    <label htmlFor="supabase" className="text-sm font-medium">
                      Supabase Database
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="offline"
                      checked={appConfig.features.offlineMode}
                      onCheckedChange={() => handleFeatureToggle('offlineMode')}
                    />
                    <label htmlFor="offline" className="text-sm font-medium">
                      Offline Mode
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    Pages to Include
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePages.map((page) => (
                      <div key={page} className="flex items-center space-x-2">
                        <Checkbox
                          id={page}
                          checked={appConfig.pages.includes(page)}
                          onCheckedChange={() => handlePageToggle(page)}
                        />
                        <label htmlFor={page} className="text-sm font-medium">
                          {page}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={generateApp}
                disabled={isGenerating || !appConfig.description.trim()}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your App...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate My App
                  </>
                )}
              </Button>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Generation Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isGenerating && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <p className="text-gray-600">Creating your Flutter app...</p>
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  {generatedResult && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 font-medium">
                          ✓ App generated successfully!
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                          {JSON.stringify(generatedResult, null, 2)}
                        </pre>
                      </div>
                      
                      <Button onClick={handleDownload} className="w-full" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل مشروع Flutter (ZIP)
                      </Button>
                    </div>
                  )}

                  {!isGenerating && !generatedResult && !error && (
                    <div className="text-center py-12 text-gray-500">
                      <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>Fill out the form and click "Generate My App" to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
