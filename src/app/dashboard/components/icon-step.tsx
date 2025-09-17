"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Palette, Upload, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import type { AppPlan } from "../page";

interface IconStepProps {
  appPlan: AppPlan;
  onComplete: () => void;
  onBack: () => void;
}

export function IconStep({ appPlan, onComplete, onBack }: IconStepProps) {
  const [iconOption, setIconOption] = useState<'generate' | 'upload'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const handleGenerateIcon = async () => {
    setIsGenerating(true);
    // محاكاة توليد الأيقونة
    await new Promise(resolve => setTimeout(resolve, 3000));
    setGeneratedIcon("https://picsum.photos/200/200?random=1"); // أيقونة تجريبية
    setIsGenerating(false);
    setIsReady(true);
  };

  const handleUpload = () => {
    // محاكاة رفع الأيقونة
    setIsReady(true);
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          أيقونة التطبيق
        </CardTitle>
        <CardDescription>
          اختر كيف تريد إنشاء أيقونة لتطبيق "{appPlan.appName}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isReady ? (
          <>
            <RadioGroup value={iconOption} onValueChange={(value) => setIconOption(value as 'generate' | 'upload')}>
              <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                <RadioGroupItem value="generate" id="generate" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="generate" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    توليد بالذكاء الاصطناعي
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    سأقوم بإنشاء أيقونة مخصصة بناءً على وصف التطبيق والألوان المختارة
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                <RadioGroupItem value="upload" id="upload" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="upload" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    رفع أيقونة من جهازك
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    ارفع أيقونة جاهزة من جهازك (PNG، JPG، SVG)
                  </p>
                </div>
              </div>
            </RadioGroup>

            {iconOption === 'generate' && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">توليد أيقونة ذكية</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    سأستخدم اسم التطبيق "{appPlan.appName}" ووصفه لإنشاء أيقونة مميزة
                  </p>
                  <Button 
                    onClick={handleGenerateIcon} 
                    disabled={isGenerating} 
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        جاري التوليد...
                      </>
                    ) : (
                      'توليد الأيقونة'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {iconOption === 'upload' && (
              <div className="border-2 border-dashed border-muted-foreground/25 p-6 rounded-lg text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">اختر ملف الأيقونة من جهازك</p>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleUpload}
                  className="max-w-xs mx-auto"
                />
              </div>
            )}

            {isGenerating && (
              <div className="text-center p-8">
                <div className="animate-pulse">
                  <div className="h-24 w-24 bg-muted rounded-xl mx-auto mb-4"></div>
                </div>
                <p className="text-muted-foreground">جاري إنشاء أيقونة مخصصة لتطبيقك...</p>
              </div>
            )}

            {generatedIcon && !isGenerating && (
              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Image 
                  src={generatedIcon} 
                  alt="Generated App Icon" 
                  width={96} 
                  height={96}
                  className="rounded-xl mx-auto mb-4 shadow-lg"
                />
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 dark:text-green-400 font-semibold">
                  تم إنشاء الأيقونة بنجاح!
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">الأيقونة جاهزة!</h3>
            <p className="text-muted-foreground mb-4">
              تم تحضير أيقونة تطبيق "{appPlan.appName}" بنجاح
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-blue-700 dark:text-blue-400">
                🎉 كل شيء جاهز! يمكننا الآن بدء توليد ملفات المشروع
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            السابق
          </Button>
          
          {isReady && (
            <Button onClick={handleContinue} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              ابدأ توليد المشروع! 🚀
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}