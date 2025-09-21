"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Square as ButtonIcon, 
  List, 
  Navigation,
  Play,
  Save,
  Download,
  Eye,
  Settings,
  Plus,
  Trash2,
  Edit3
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Types for our visual builder
interface AppComponent {
  id: string;
  type: 'text' | 'button' | 'image' | 'list' | 'input' | 'card';
  props: {
    text?: string;
    color?: string;
    size?: string;
    style?: any;
  };
  children?: AppComponent[];
}

interface AppScreen {
  id: string;
  name: string;
  components: AppComponent[];
  backgroundColor: string;
}

interface FlutterProject {
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  screens: AppScreen[];
  currentScreen: string;
}

export default function VisualBuilderPage() {
  const [project, setProject] = useState<FlutterProject>({
    name: "تطبيقي الجديد",
    description: "تطبيق رائع تم إنشاؤه بواسطة Genius APPio",
    primaryColor: "#2196F3",
    secondaryColor: "#FFC107",
    screens: [
      {
        id: "home",
        name: "الصفحة الرئيسية",
        components: [
          {
            id: "title",
            type: "text",
            props: {
              text: "مرحباً بكم في تطبيقي",
              size: "large",
              color: "#2196F3"
            }
          },
          {
            id: "subtitle",
            type: "text", 
            props: {
              text: "تطبيق مذهل تم إنشاؤه بسهولة",
              size: "medium",
              color: "#666666"
            }
          },
          {
            id: "main-button",
            type: "button",
            props: {
              text: "ابدأ الآن",
              color: "#2196F3"
            }
          }
        ],
        backgroundColor: "#FFFFFF"
      }
    ],
    currentScreen: "home"
  });

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isBuilding, setIsBuilding] = useState(false);

  // Component library for drag and drop
  const componentLibrary = [
    { type: 'text', icon: Type, label: 'نص', color: '#4CAF50' },
    { type: 'button', icon: ButtonIcon, label: 'زر', color: '#2196F3' },
    { type: 'image', icon: Image, label: 'صورة', color: '#FF9800' },
    { type: 'input', icon: Edit3, label: 'حقل إدخال', color: '#9C27B0' },
    { type: 'list', icon: List, label: 'قائمة', color: '#607D8B' },
    { type: 'card', icon: Layout, label: 'بطاقة', color: '#795548' }
  ];

  const getCurrentScreen = () => {
    return project.screens.find(s => s.id === project.currentScreen) || project.screens[0];
  };

  const addComponent = (type: string) => {
    const newComponent: AppComponent = {
      id: `${type}_${Date.now()}`,
      type: type as any,
      props: {
        text: type === 'text' ? 'نص جديد' : type === 'button' ? 'زر جديد' : '',
        color: project.primaryColor,
        size: 'medium'
      }
    };

    const currentScreen = getCurrentScreen();
    const updatedScreens = project.screens.map(screen => 
      screen.id === currentScreen.id 
        ? { ...screen, components: [...screen.components, newComponent] }
        : screen
    );

    setProject({ ...project, screens: updatedScreens });
    setSelectedComponent(newComponent.id);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      addComponent(componentType);
    }
  };

  // Convert project to Flutter files for build system
  const generateFlutterProject = () => {
    const packageName = project.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const mainDart = `
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '${project.name}',
      theme: ThemeData(
        primaryColor: Color(0x${project.primaryColor.substring(1)}),
        colorScheme: ColorScheme.fromSeed(seedColor: Color(0x${project.primaryColor.substring(1)})),
        useMaterial3: true,
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
        title: Text('${project.name}'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Container(
        color: Color(0x${getCurrentScreen().backgroundColor.substring(1)}),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ${getCurrentScreen().components.map(component => {
                switch (component.type) {
                  case 'text':
                    return `Text(
                '${component.props.text || 'نص'}',
                style: TextStyle(
                  fontSize: ${component.props.size === 'large' ? '24' : component.props.size === 'medium' ? '18' : '14'},
                  color: Color(0x${component.props.color?.substring(1) || '000000'}),
                  fontWeight: ${component.props.size === 'large' ? 'FontWeight.bold' : 'FontWeight.normal'},
                ),
              ),`;
                  case 'button':
                    return `Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0x${component.props.color?.substring(1) || '2196F3'}),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text('${component.props.text || 'زر'}'),
                ),
              ),`;
                  case 'input':
                    return `Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: '${component.props.text || 'اكتب هنا...'}',
                    border: const OutlineInputBorder(),
                  ),
                ),
              ),`;
                  default:
                    return `Container(
                height: 50,
                margin: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(child: Text('${component.type}')),
              ),`;
                }
              }).join('\n              ')}
            ],
          ),
        ),
      ),
    );
  }
}
    `.trim();

    const pubspecYaml = `
name: ${packageName}
description: ${project.description}
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

flutter:
  uses-material-design: true
    `.trim();

    return [
      { path: 'lib/main.dart', content: mainDart },
      { path: 'pubspec.yaml', content: pubspecYaml },
      { 
        path: 'README.md', 
        content: `# ${project.name}\n\n${project.description}\n\nتم إنشاؤه بواسطة Genius APPio Visual Builder.\n\n## تشغيل التطبيق\n\n\`\`\`bash\nflutter pub get\nflutter run -d chrome\n\`\`\`\n` 
      }
    ];
  };

  const updateComponent = (componentId: string, newProps: any) => {
    const currentScreen = getCurrentScreen();
    const updatedScreens = project.screens.map(screen => 
      screen.id === currentScreen.id 
        ? {
            ...screen, 
            components: screen.components.map(comp => 
              comp.id === componentId 
                ? { ...comp, props: { ...comp.props, ...newProps } }
                : comp
            )
          }
        : screen
    );

    setProject({ ...project, screens: updatedScreens });
  };

  const deleteComponent = (componentId: string) => {
    const currentScreen = getCurrentScreen();
    const updatedScreens = project.screens.map(screen => 
      screen.id === currentScreen.id 
        ? {
            ...screen, 
            components: screen.components.filter(comp => comp.id !== componentId)
          }
        : screen
    );

    setProject({ ...project, screens: updatedScreens });
    setSelectedComponent(null);
  };

  const buildAndDeploy = async () => {
    setIsBuilding(true);
    
    try {
      const flutterFiles = generateFlutterProject();
      
      const response = await fetch('/api/build-flutter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: flutterFiles,
          projectName: project.name
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Open the built app in a new tab
        window.open(result.previewUrl, '_blank');
      } else {
        alert('فشل في بناء التطبيق: ' + (result.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      console.error('Build error:', error);
      alert('حدث خطأ أثناء بناء التطبيق');
    } finally {
      setIsBuilding(false);
    }
  };

  const renderComponent = (component: AppComponent, isSelected: boolean) => {
    const baseStyle = {
      border: isSelected ? '2px solid #2196F3' : '1px solid transparent',
      padding: '8px',
      margin: '4px 0',
      borderRadius: '4px',
      cursor: 'pointer',
      position: 'relative' as const
    };

    switch (component.type) {
      case 'text':
        return (
          <div
            key={component.id}
            style={{
              ...baseStyle,
              fontSize: component.props.size === 'large' ? '24px' : component.props.size === 'medium' ? '18px' : '14px',
              color: component.props.color,
              fontWeight: component.props.size === 'large' ? 'bold' : 'normal'
            }}
            onClick={() => setSelectedComponent(component.id)}
          >
            {component.props.text}
            {isSelected && (
              <Button 
                size="sm" 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      
      case 'button':
        return (
          <div
            key={component.id}
            style={baseStyle}
            onClick={() => setSelectedComponent(component.id)}
          >
            <Button 
              style={{ 
                backgroundColor: component.props.color,
                borderColor: component.props.color
              }}
              className="w-full"
            >
              {component.props.text}
            </Button>
            {isSelected && (
              <Button 
                size="sm" 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      
      case 'input':
        return (
          <div
            key={component.id}
            style={baseStyle}
            onClick={() => setSelectedComponent(component.id)}
          >
            <Input 
              placeholder={component.props.text || "اكتب هنا..."}
              className="w-full"
            />
            {isSelected && (
              <Button 
                size="sm" 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      
      case 'card':
        return (
          <div
            key={component.id}
            style={baseStyle}
            onClick={() => setSelectedComponent(component.id)}
          >
            <Card>
              <CardContent className="p-4">
                <p>{component.props.text || "محتوى البطاقة"}</p>
              </CardContent>
            </Card>
            {isSelected && (
              <Button 
                size="sm" 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      
      default:
        return (
          <div
            key={component.id}
            style={baseStyle}
            onClick={() => setSelectedComponent(component.id)}
          >
            <div className="p-4 bg-gray-100 rounded">
              {component.type} - {component.props.text}
            </div>
            {isSelected && (
              <Button 
                size="sm" 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteComponent(component.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
    }
  };

  const selectedComponentData = selectedComponent 
    ? getCurrentScreen().components.find(c => c.id === selectedComponent)
    : null;

  return (
    <div className="h-screen flex bg-gray-50" dir="rtl">
      {/* Sidebar - Components Library */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">🎨 منشئ التطبيقات المرئي</h2>
          
          {/* Project Settings */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">⚙️ إعدادات المشروع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">اسم التطبيق</Label>
                <Input 
                  value={project.name}
                  onChange={(e) => setProject({...project, name: e.target.value})}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">اللون الأساسي</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color"
                    value={project.primaryColor}
                    onChange={(e) => setProject({...project, primaryColor: e.target.value})}
                    className="h-8 w-16"
                  />
                  <Input 
                    value={project.primaryColor}
                    onChange={(e) => setProject({...project, primaryColor: e.target.value})}
                    className="h-8 flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Library */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">🧩 مكتبة المكونات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {componentLibrary.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="h-16 flex flex-col gap-1 text-xs cursor-grab active:cursor-grabbing"
                    onClick={() => addComponent(item.type)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.type)}
                    style={{ borderColor: item.color, color: item.color }}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Properties Panel */}
          {selectedComponentData && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">🔧 خصائص المكون</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">النوع</Label>
                  <Badge variant="secondary">{selectedComponentData.type}</Badge>
                </div>
                
                {(selectedComponentData.type === 'text' || selectedComponentData.type === 'button') && (
                  <div>
                    <Label className="text-xs">النص</Label>
                    <Input 
                      value={selectedComponentData.props.text || ''}
                      onChange={(e) => updateComponent(selectedComponent!, { text: e.target.value })}
                      className="h-8"
                    />
                  </div>
                )}
                
                <div>
                  <Label className="text-xs">اللون</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color"
                      value={selectedComponentData.props.color || '#000000'}
                      onChange={(e) => updateComponent(selectedComponent!, { color: e.target.value })}
                      className="h-8 w-16"
                    />
                    <Input 
                      value={selectedComponentData.props.color || '#000000'}
                      onChange={(e) => updateComponent(selectedComponent!, { color: e.target.value })}
                      className="h-8 flex-1"
                    />
                  </div>
                </div>
                
                {selectedComponentData.type === 'text' && (
                  <div>
                    <Label className="text-xs">الحجم</Label>
                    <select 
                      value={selectedComponentData.props.size || 'medium'}
                      onChange={(e) => updateComponent(selectedComponent!, { size: e.target.value })}
                      className="w-full h-8 border rounded px-2"
                    >
                      <option value="small">صغير</option>
                      <option value="medium">متوسط</option>
                      <option value="large">كبير</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">📱 {project.name}</h1>
            <Badge variant="secondary">معاينة مباشرة</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Preview Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                📱
              </Button>
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                🖥️
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button size="sm" variant="outline">
              <Save className="h-4 w-4 mr-1" />
              حفظ
            </Button>
            
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={buildAndDeploy}
              disabled={isBuilding}
            >
              {isBuilding ? (
                <>⏳ جاري البناء...</>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  🚀 انشر الآن
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="max-w-md mx-auto">
            {/* Device Frame */}
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                width: previewMode === 'mobile' ? '375px' : previewMode === 'tablet' ? '768px' : '1024px',
                minHeight: previewMode === 'mobile' ? '667px' : '500px',
                margin: '0 auto'
              }}
            >
              {/* Status Bar */}
              <div className="h-6 bg-black flex items-center justify-center">
                <div className="text-white text-xs">9:41 AM</div>
              </div>
              
              {/* App Header */}
              <div 
                className="h-14 flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: project.primaryColor }}
              >
                {project.name}
              </div>
              
              {/* App Content - Drop Zone */}
              <div 
                className="p-4 min-h-96 relative"
                style={{ backgroundColor: getCurrentScreen().backgroundColor }}
                onClick={() => setSelectedComponent(null)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {getCurrentScreen().components.map(component => 
                  renderComponent(component, selectedComponent === component.id)
                )}
                
                {getCurrentScreen().components.length === 0 && (
                  <div className="text-center text-gray-400 mt-20 border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Plus className="h-12 w-12 mx-auto mb-2" />
                    <p>اسحب مكوناً من الشريط الجانبي لبدء التصميم</p>
                    <p className="text-sm mt-2">أو انقر على أي مكون في الشريط الجانبي</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}