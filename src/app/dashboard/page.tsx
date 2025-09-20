"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  FileText, 
  Smartphone,
  Code2,
  Eye,
  Settings,
  Layers,
  MoreVertical,
  Trash2,
  Copy,
  Edit3,
  Play,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppPage {
  id: string;
  name: string;
  type: "screen" | "component";
  widgets: Widget[];
  route: string;
  createdAt: string;
}

interface Widget {
  id: string;
  type: "container" | "text" | "button" | "image" | "column" | "row";
  properties: Record<string, any>;
  children?: Widget[];
}

interface Project {
  id: string;
  name: string;
  pages: AppPage[];
  createdAt: string;
}

export default function DashboardPage() {
  const [currentProject] = useState<Project>({
    id: "1",
    name: "My Flutter App",
    pages: [
      {
        id: "home",
        name: "HomePage",
        type: "screen",
        route: "/",
        createdAt: "2024-03-15",
        widgets: [
          {
            id: "w1",
            type: "column",
            properties: { padding: 16, alignment: "center" },
            children: [
              {
                id: "w2",
                type: "text",
                properties: { 
                  text: "Welcome to My App",
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#2563eb"
                }
              },
              {
                id: "w3",
                type: "button",
                properties: {
                  text: "Get Started",
                  backgroundColor: "#059669",
                  textColor: "#ffffff",
                  padding: 12
                }
              }
            ]
          }
        ]
      },
      {
        id: "profile",
        name: "ProfilePage",
        type: "screen",
        route: "/profile",
        createdAt: "2024-03-15",
        widgets: [
          {
            id: "w4",
            type: "column",
            properties: { padding: 16 },
            children: [
              {
                id: "w5",
                type: "text",
                properties: {
                  text: "User Profile",
                  fontSize: 20,
                  fontWeight: "bold"
                }
              },
              {
                id: "w6",
                type: "container",
                properties: {
                  height: 200,
                  backgroundColor: "#f3f4f6",
                  borderRadius: 8
                }
              }
            ]
          }
        ]
      },
      {
        id: "settings",
        name: "SettingsPage", 
        type: "screen",
        route: "/settings",
        createdAt: "2024-03-15",
        widgets: [
          {
            id: "w7",
            type: "column",
            properties: { padding: 16 },
            children: [
              {
                id: "w8",
                type: "text",
                properties: {
                  text: "App Settings",
                  fontSize: 20,
                  fontWeight: "bold"
                }
              }
            ]
          }
        ]
      }
    ],
    createdAt: "2024-03-15"
  });

  const [selectedPage, setSelectedPage] = useState<AppPage>(currentProject.pages[0]);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [activeTab, setActiveTab] = useState<"design" | "code">("design");

  const handleAddPage = () => {
    const newPage: AppPage = {
      id: `page_${Date.now()}`,
      name: `NewPage${currentProject.pages.length + 1}`,
      type: "screen",
      route: `/page${currentProject.pages.length + 1}`,
      createdAt: new Date().toISOString().split('T')[0],
      widgets: [
        {
          id: `w_${Date.now()}`,
          type: "column",
          properties: { padding: 16, alignment: "center" },
          children: [
            {
              id: `w_${Date.now() + 1}`,
              type: "text",
              properties: {
                text: "New Page",
                fontSize: 24,
                fontWeight: "bold"
              }
            }
          ]
        }
      ]
    };
    
    currentProject.pages.push(newPage);
    setSelectedPage(newPage);
  };

  const generatePageCode = (page: AppPage): string => {
    const generateWidgetCode = (widget: Widget, indent = 2): string => {
      const spaces = ' '.repeat(indent);
      
      switch (widget.type) {
        case "column":
          const children = widget.children?.map(child => generateWidgetCode(child, indent + 2)).join(',\n') || '';
          return `${spaces}Column(\n${spaces}  children: [\n${children}\n${spaces}  ],\n${spaces})`;
        
        case "text":
          return `${spaces}Text(\n${spaces}  '${widget.properties.text || 'Text'}',\n${spaces}  style: TextStyle(\n${spaces}    fontSize: ${widget.properties.fontSize || 16},\n${spaces}    fontWeight: FontWeight.${widget.properties.fontWeight || 'normal'},\n${spaces}    color: Color(0xFF${widget.properties.color?.replace('#', '') || '000000'}),\n${spaces}  ),\n${spaces})`;
        
        case "button":
          return `${spaces}ElevatedButton(\n${spaces}  onPressed: () {},\n${spaces}  style: ElevatedButton.styleFrom(\n${spaces}    backgroundColor: Color(0xFF${widget.properties.backgroundColor?.replace('#', '') || '2563eb'}),\n${spaces}    padding: EdgeInsets.all(${widget.properties.padding || 8}),\n${spaces}  ),\n${spaces}  child: Text(\n${spaces}    '${widget.properties.text || 'Button'}',\n${spaces}    style: TextStyle(\n${spaces}      color: Color(0xFF${widget.properties.textColor?.replace('#', '') || 'ffffff'}),\n${spaces}    ),\n${spaces}  ),\n${spaces})`;
        
        case "container":
          return `${spaces}Container(\n${spaces}  height: ${widget.properties.height || 100},\n${spaces}  decoration: BoxDecoration(\n${spaces}    color: Color(0xFF${widget.properties.backgroundColor?.replace('#', '') || 'f3f4f6'}),\n${spaces}    borderRadius: BorderRadius.circular(${widget.properties.borderRadius || 0}),\n${spaces}  ),\n${spaces})`;
        
        default:
          return `${spaces}Container()`;
      }
    };

    const widgetsCode = page.widgets.map(widget => generateWidgetCode(widget, 6)).join(',\n');

    return `import 'package:flutter/material.dart';

class ${page.name} extends StatelessWidget {
  const ${page.name}({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${page.name.replace('Page', '')}'),
      ),
      body: SafeArea(
        child: ${widgetsCode}
      ),
    );
  }
}`;
  };

  const renderWidgetPreview = (widget: Widget): React.ReactNode => {
    const handleWidgetClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedWidget(widget);
    };

    const isSelected = selectedWidget?.id === widget.id;
    
    switch (widget.type) {
      case "column":
        return (
          <div 
            key={widget.id}
            className={`flex flex-col items-center space-y-2 p-4 cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={handleWidgetClick}
            style={{ padding: widget.properties.padding || 16 }}
          >
            {widget.children?.map(child => renderWidgetPreview(child))}
          </div>
        );
      
      case "text":
        return (
          <div
            key={widget.id}
            className={`cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={handleWidgetClick}
            style={{
              fontSize: widget.properties.fontSize || 16,
              fontWeight: widget.properties.fontWeight || 'normal',
              color: widget.properties.color || '#000000',
              padding: '4px'
            }}
          >
            {widget.properties.text || 'Text'}
          </div>
        );
      
      case "button":
        return (
          <button
            key={widget.id}
            className={`rounded transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
            }`}
            onClick={handleWidgetClick}
            style={{
              backgroundColor: widget.properties.backgroundColor || '#2563eb',
              color: widget.properties.textColor || '#ffffff',
              padding: widget.properties.padding || 8,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {widget.properties.text || 'Button'}
          </button>
        );
      
      case "container":
        return (
          <div
            key={widget.id}
            className={`cursor-pointer transition-all ${
              isSelected ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
            }`}
            onClick={handleWidgetClick}
            style={{
              height: widget.properties.height || 100,
              backgroundColor: widget.properties.backgroundColor || '#f3f4f6',
              borderRadius: widget.properties.borderRadius || 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#666'
            }}
          >
            Container
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Pages */}
      <div className="w-64 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">{currentProject.name}</h2>
          <p className="text-sm text-muted-foreground">Flutter App Builder</p>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Pages</h3>
            <Button size="sm" onClick={handleAddPage} className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-1">
              {currentProject.pages.map((page) => (
                <div
                  key={page.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPage.id === page.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm font-medium">{page.name}</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="mt-auto p-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Center - Visual Editor */}
      <div className="flex-1 flex flex-col">
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">{selectedPage.name}</h1>
              <Badge variant="outline">{selectedPage.route}</Badge>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "design" | "code")}>
              <TabsList>
                <TabsTrigger value="design">
                  <Eye className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code2 className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex-1 p-6">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="design" className="h-full">
              <div className="h-full flex items-center justify-center">
                <div className="w-80 h-[600px] bg-white border rounded-lg shadow-lg overflow-auto">
                  <div className="h-12 bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-medium">{selectedPage.name.replace('Page', '')}</span>
                  </div>
                  <div 
                    className="flex-1 min-h-0"
                    onClick={() => setSelectedWidget(null)}
                  >
                    {selectedPage.widgets.map(widget => renderWidgetPreview(widget))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="h-full">
              <div className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>{selectedPage.name}.dart</span>
                    </CardTitle>
                    <CardDescription>
                      Generated Flutter code for {selectedPage.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-120px)]">
                    <ScrollArea className="h-full">
                      <pre className="text-sm bg-slate-950 text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
                        {generatePageCode(selectedPage)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-80 border-l bg-card flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Properties</h3>
          <p className="text-sm text-muted-foreground">
            {selectedWidget ? `${selectedWidget.type} properties` : 'Select a widget to edit'}
          </p>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          {selectedWidget ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Widget Type</label>
                <Input value={selectedWidget.type} readOnly className="mt-1" />
              </div>
              
              {selectedWidget.type === "text" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Text</label>
                    <Textarea 
                      value={selectedWidget.properties.text || ''} 
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Font Size</label>
                    <Input 
                      type="number" 
                      value={selectedWidget.properties.fontSize || 16} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <Input 
                      type="color" 
                      value={selectedWidget.properties.color || '#000000'} 
                      className="mt-1 h-10"
                    />
                  </div>
                </>
              )}
              
              {selectedWidget.type === "button" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Button Text</label>
                    <Input 
                      value={selectedWidget.properties.text || ''} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Background Color</label>
                    <Input 
                      type="color" 
                      value={selectedWidget.properties.backgroundColor || '#2563eb'} 
                      className="mt-1 h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Text Color</label>
                    <Input 
                      type="color" 
                      value={selectedWidget.properties.textColor || '#ffffff'} 
                      className="mt-1 h-10"
                    />
                  </div>
                </>
              )}
              
              {selectedWidget.type === "container" && (
                <>
                  <div>
                    <label className="text-sm font-medium">Height</label>
                    <Input 
                      type="number" 
                      value={selectedWidget.properties.height || 100} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Background Color</label>
                    <Input 
                      type="color" 
                      value={selectedWidget.properties.backgroundColor || '#f3f4f6'} 
                      className="mt-1 h-10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Border Radius</label>
                    <Input 
                      type="number" 
                      value={selectedWidget.properties.borderRadius || 0} 
                      className="mt-1"
                    />
                  </div>
                </>
              )}
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Actions</h4>
                <Button variant="outline" size="sm" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Widget
                </Button>
                <Button variant="outline" size="sm" className="w-full text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Widget
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a widget to see its properties</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}