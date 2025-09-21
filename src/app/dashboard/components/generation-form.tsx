
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
    .min(20, "Description must be at least 20 characters long"),
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
      title: "Got it!",
      description: "I'll start analyzing your request and creating the app plan",
    });
    onPlanningStart(values.prompt);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          Tell me about the app you want
        </CardTitle>
        <CardDescription>
          Write a detailed description of the app you want to create - pages, features, colors, and everything you need
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
                  <FormLabel className="text-lg font-semibold">App Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Example: I want to create an app called 'AI Story Generator' with blue and gold colors, containing a home page to display stories, a page to create new stories with AI, a personal library page, and a settings page. I want to connect it to Firebase for authentication and data storage..."
                      className="min-h-[200px] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mt-3">
                      <div className="text-sm">💡 <strong>Tips for best results:</strong></div>
                      <div className="text-sm mt-2 space-y-1">
                        <div>• Mention the app name you want</div>
                        <div>• Specify required pages (home, login, etc.)</div>
                        <div>• Mention important features</div>
                        <div>• Specify preferred colors</div>
                        <div>• Choose database type (Firebase, Supabase, or Node.js)</div>
                      </div>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Analysis & Planning
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
