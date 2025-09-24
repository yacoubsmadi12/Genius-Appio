
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import JSZip from "jszip";
import { 
  Home, 
  FolderOpen, 
  Smartphone, 
  Palette, 
  Upload,
  CheckSquare,
  Layers,
  Loader2,
  Download,
  Sparkles,
  Plus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface CustomPage {
  name: string;
  description: string;
}

interface AppConfig {
  appName: string;
  description: string;
  theme: 'light' | 'dark' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  appIcon: File | null;
  features: {
    firebase: boolean;
    supabaseDb: boolean;
    offlineMode: boolean;
  };
  pages: string[];
  customPages: CustomPage[];
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
  { icon: FolderOpen, label: 'My Projects' }
];

export default function DashboardPage() {
  const [appConfig, setAppConfig] = useState<AppConfig>({
    appName: '',
    description: '',
    theme: 'light',
    colors: {
      primary: '#667EEA',
      secondary: '#4F46E5',
      accent: '#06B6D4'
    },
    appIcon: null,
    features: {
      firebase: false,
      supabaseDb: false,
      offlineMode: false
    },
    pages: ['Splash Screen', 'Home'],
    customPages: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{files: Array<{path: string; content: string}>} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDescriptionChange = (value: string) => {
    setAppConfig(prev => ({ ...prev, description: value }));
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'custom') => {
    setAppConfig(prev => ({ ...prev, theme }));
  };

  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    setAppConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
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

  const handleAppNameChange = (value: string) => {
    setAppConfig(prev => ({ ...prev, appName: value }));
  };

  const handleCustomPageAdd = () => {
    const pageName = prompt('Enter page name:');
    const pageDescription = prompt('Describe this page:');
    if (pageName && pageDescription) {
      setAppConfig(prev => ({
        ...prev,
        customPages: [...prev.customPages, { name: pageName, description: pageDescription }]
      }));
    }
  };

  const handleCustomPageRemove = (index: number) => {
    setAppConfig(prev => ({
      ...prev,
      customPages: prev.customPages.filter((_, i) => i !== index)
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

**App Name:** ${appConfig.appName}

**App Description:** ${appConfig.description}

**Design Requirements:**
- Theme: ${appConfig.theme} theme
- Primary Color: ${appConfig.colors.primary}
- Secondary Color: ${appConfig.colors.secondary}  
- Accent Color: ${appConfig.colors.accent}
- Use Material 3 design system
- Modern, beautiful UI with animations
- Child-friendly and playful design
- Smooth transitions and interactions

**App Icon:**
${appConfig.appIcon ? `- Custom app icon provided (${appConfig.appIcon.name}) - integrate into assets/icons/ folder and reference in pubspec.yaml` : '- Generate default app icon and configure properly'}

**Features to Include:**
${appConfig.features.firebase ? '- Complete Firebase integration (authentication, firestore database, storage, analytics - set up all necessary configurations and link properly in the app)' : ''}
${appConfig.features.supabaseDb ? '- Supabase Database integration with proper connection setup' : ''}
${appConfig.features.offlineMode ? '- Offline mode capability with local storage' : ''}

**Standard Pages to Generate:**
${appConfig.pages.map(page => `- ${page} page (create fully functional page with proper navigation)`).join('\n')}

**Custom Pages to Generate:**
${appConfig.customPages.map(page => `- ${page.name} page: ${page.description} (implement this page according to the description with proper UI and functionality)`).join('\n')}

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
    if (!generatedResult || !generatedResult.files || generatedResult.files.length === 0) {
      alert('لا توجد ملفات للتحميل');
      return;
    }

    try {
      const zip = new JSZip();
      
      // إضافة جميع الملفات المولدة بواسطة الذكاء الاصطناعي
      generatedResult.files.forEach(file => {
        zip.file(file.path, file.content);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // إنشاء رابط التحميل
      const element = document.createElement("a");
      element.href = URL.createObjectURL(zipBlob);
      element.download = `${appConfig.appName || 'Flutter'}-Project-${Date.now()}.zip`;
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
      
      const response = await fetch('/api/generate-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate app');
      }

      const result = await response.json();
      
      if (result.success && result.files) {
        setGeneratedResult({ files: result.files });
      } else {
        throw new Error(result.error || 'Failed to generate complete app');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-background/80 backdrop-blur-sm shadow-lg border-r border-border/40">
        <div className="p-6">
          
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
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
        <header className="bg-background/60 backdrop-blur-sm border-b border-border/40 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">App Builder</h1>
              <p className="text-muted-foreground">Create your Flutter app with AI</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              AI Powered
            </Badge>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* App Builder Form */}
            <div className="space-y-6">
              {/* App Name */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    App Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Enter your app name (e.g., My Amazing App)"
                    value={appConfig.appName}
                    onChange={(e) => handleAppNameChange(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

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
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={appConfig.colors.primary}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <span className="font-mono text-sm text-gray-600">
                          {appConfig.colors.primary}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={appConfig.colors.secondary}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <span className="font-mono text-sm text-gray-600">
                          {appConfig.colors.secondary}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Accent Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={appConfig.colors.accent}
                          onChange={(e) => handleColorChange('accent', e.target.value)}
                          className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <span className="font-mono text-sm text-gray-600">
                          {appConfig.colors.accent}
                        </span>
                      </div>
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
                      checked={appConfig.features.firebase}
                      onCheckedChange={() => handleFeatureToggle('firebase')}
                    />
                    <label htmlFor="firebase" className="text-sm font-medium">
                      Firebase (Authentication, Database, Storage)
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
                <CardContent className="space-y-4">
                  {/* Predefined Pages */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Standard Pages</h4>
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
                  </div>
                  
                  <Separator />
                  
                  {/* Custom Pages */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Custom Pages</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCustomPageAdd}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Page
                      </Button>
                    </div>
                    
                    {appConfig.customPages.length > 0 ? (
                      <div className="space-y-2">
                        {appConfig.customPages.map((page, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{page.name}</div>
                              <div className="text-xs text-muted-foreground">{page.description}</div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleCustomPageRemove(index)}
                              className="ml-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No custom pages added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={generateApp}
                disabled={isGenerating || !appConfig.appName.trim() || !appConfig.description.trim()}
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
                          ✅ تم توليد التطبيق بنجاح!
                        </p>
                        <p className="text-green-600 text-sm mt-1">
                          تم إنشاء {generatedResult.files?.length || 0} ملف للمشروع الكامل
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                        <h4 className="font-semibold mb-3 text-gray-800">📁 ملفات المشروع المولدة:</h4>
                        <div className="space-y-2">
                          {generatedResult.files?.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <span className="text-blue-600">📄</span>
                              <span className="font-mono text-gray-700">{file.path}</span>
                              <span className="text-xs text-gray-500">({file.content.length} characters)</span>
                            </div>
                          )) || 'لا توجد ملفات'}
                        </div>
                      </div>
                      
                      <Button onClick={handleDownload} className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        <Download className="w-4 h-4 mr-2" />
                        💾 تحميل مشروع {appConfig.appName || 'Flutter'} الكامل (ZIP)
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
