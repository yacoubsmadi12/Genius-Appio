
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";

const formSchema = z.object({
  prompt: z
    .string()
    .min(20, "الوصف يجب أن يكون 20 حرف على الأقل"),
});

type GenerationFormProps = {
  onPlanningStart: (prompt: string) => void;
  onReset: () => void;
};


export function GenerationForm({ onPlanningStart, onReset }: GenerationFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "ممتاز!",
      description: "سأبدأ بتحليل طلبك وإنشاء خطة التطبيق",
    });
    onPlanningStart(values.prompt);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          أخبرني عن التطبيق الذي تريده
        </CardTitle>
        <CardDescription>
          اكتب وصفاً مفصلاً للتطبيق الذي تريد إنشاؤه - الصفحات، الميزات، الألوان، وكل ما تحتاجه
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">وصف التطبيق</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="مثال: أنا بدي أعمل تطبيق اسمه 'مولد القصص الذكي' ألوانه الأزرق والذهبي، يحتوي على صفحة رئيسية لعرض القصص، صفحة لإنشاء قصة جديدة بالذكاء الاصطناعي، صفحة للمكتبة الشخصية، وصفحة الإعدادات. أريد ربطه بـ Firebase للمصادقة وحفظ البيانات..."
                      className="min-h-[200px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mt-3">
                      <div className="text-sm">💡 <strong>نصائح للحصول على أفضل النتائج:</strong></div>
                      <div className="text-sm mt-2 space-y-1">
                        <div>• اذكر اسم التطبيق الذي تريده</div>
                        <div>• حدد الصفحات المطلوبة (الرئيسية، التسجيل، إلخ)</div>
                        <div>• اذكر الميزات المهمة</div>
                        <div>• حدد الألوان المفضلة</div>
                        <div>• اختر نوع قاعدة البيانات (Firebase، Supabase، أو Node.js)</div>
                      </div>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Sparkles className="h-5 w-5 mr-2" />
              ابدأ التحليل والتخطيط
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
