"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, Database, CheckCircle } from "lucide-react";
import type { AppPlan } from "../page";

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
    // محاكاة عملية الاتصال
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
      description: 'قاعدة بيانات Google Firebase مع المصادقة والتخزين',
      features: ['مصادقة المستخدمين', 'قاعدة بيانات في الوقت الفعلي', 'تخزين الملفات', 'استضافة مجانية']
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'قاعدة بيانات PostgreSQL مع API تلقائي',
      features: ['قاعدة بيانات SQL', 'API تلقائي', 'مصادقة متقدمة', 'Real-time subscriptions']
    },
    {
      id: 'nodejs',
      name: 'Node.js مخصص',
      description: 'خادم Node.js مخصص مع MongoDB أو MySQL',
      features: ['تحكم كامل', 'مرونة عالية', 'أداء محسن', 'قابلية التخصيص']
    }
  ];

  const selectedOption = databaseOptions.find(opt => opt.id === selectedDatabase);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          اختيار قاعدة البيانات
        </CardTitle>
        <CardDescription>
          اختر نوع قاعدة البيانات التي تريد ربطها بتطبيق "{appPlan.appName}"
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
                  هل تريد ربط {selectedOption.name} بالتطبيق الآن؟
                </p>
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting} 
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      جاري الربط...
                    </>
                  ) : (
                    `ربط ${selectedOption.name}`
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">تم الربط بنجاح!</h3>
            <p className="text-muted-foreground mb-4">
              تم ربط {selectedOption?.name} بتطبيق "{appPlan.appName}" بنجاح
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-green-700 dark:text-green-400">
                ✅ إعداد قاعدة البيانات مكتمل - يمكننا الآن المتابعة لاختيار أيقونة التطبيق
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            السابق
          </Button>
          
          {isConnected && (
            <Button onClick={handleContinue}>
              متابعة لاختيار الأيقونة
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}