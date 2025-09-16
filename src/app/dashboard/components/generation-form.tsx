
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { generateAppIcon, generateAppFromPrompt, GenerateAppFromPromptOutput } from "@/ai/flows/index";

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
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  appName: z.string().min(3, "App name must be at least 3 characters."),
  appDescription: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  backend: z.enum(["firebase", "supabase", "nodejs"], {
    required_error: "You need to select a backend type.",
  }),
});

type GenerationFormProps = {
  onGenerationStart: () => void;
  onGenerationComplete: (result: GenerateAppFromPromptOutput) => void;
  isGenerating: boolean;
};


export function GenerationForm({ onGenerationStart, onGenerationComplete, isGenerating }: GenerationFormProps) {
  const { toast } = useToast();
  const [iconOption, setIconOption] = useState("generate");
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: "",
      appDescription: "",
      backend: "firebase",
    },
  });

  const handleGenerateIcon = async () => {
    const appName = form.getValues("appName");
    const appDescription = form.getValues("appDescription");

    if (!appName || !appDescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an app name and description first.",
      });
      return;
    }

    setIsGeneratingIcon(true);
    setGeneratedIcon(null);
    try {
      const result = await generateAppIcon({ appName, appDescription });
      setGeneratedIcon(result.iconDataUri);
      toast({
        title: "Icon Generated!",
        description: "A new icon has been created based on your input.",
      });
    } catch (error) {
      console.error("Icon generation failed:", error);
      toast({
        variant: "destructive",
        title: "Icon Generation Failed",
        description: "Could not generate an icon. Please try again.",
      });
    } finally {
      setIsGeneratingIcon(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerationStart();
    toast({
      title: "Generation Started!",
      description: "Your app is being forged. This might take a moment.",
    });
    try {
      const result = await generateAppFromPrompt({ prompt: `App Name: ${values.appName}. Backend: ${values.backend}. Description: ${values.appDescription}` });
      console.log("App generation result:", result);
      onGenerationComplete(result);
      toast({
        title: "Generation Complete!",
        description: "Your app files are ready. Check the progress sidebar.",
      });
    } catch (error) {
       console.error("App generation failed:", error);
       toast({
        variant: "destructive",
        title: "App Generation Failed",
        description: "Could not start app generation. Please try again.",
      });
       // Ensure we reset the generating state on failure
       onGenerationComplete({ files: [] });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">App Details</CardTitle>
        <CardDescription>
          Provide the core details for your new application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="appName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>App Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Awesome App" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be the name of your application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>App Icon</FormLabel>
              <Tabs
                defaultValue="generate"
                className="w-full"
                onValueChange={setIconOption}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="generate">Generate with AI</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="generate" className="mt-4">
                  <div className="flex flex-col items-center gap-4 rounded-lg border p-6">
                    {generatedIcon ? (
                      <Image
                        src={generatedIcon}
                        alt="Generated App Icon"
                        width={80}
                        height={80}
                        className="rounded-xl"
                      />
                    ) : (
                      <div className="h-20 w-20 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                        Icon
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateIcon}
                      disabled={isGeneratingIcon || isGenerating}
                    >
                      {isGeneratingIcon
                        ? "Generating..."
                        : "Generate Icon"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Generate an icon based on your app name and description.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="picture">Picture</Label>
                    <Input id="picture" type="file" disabled={isGenerating}/>
                  </div>
                </TabsContent>
              </Tabs>
            </FormItem>

            <FormField
              control={form.control}
              name="appDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full App Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your app in detail. e.g., 'An app for tracking daily habits. It should have a home page showing habits, a page to add new habits, and a statistics page with charts...'"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be as descriptive as possible. Mention pages, features,
                    colors, and desired functionality.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backend"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Backend Choice</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <Card className="w-full">
                           <CardContent className="p-4 flex items-center gap-4">
                            <RadioGroupItem value="firebase" />
                            <FormLabel className="font-normal">
                              Firebase
                            </FormLabel>
                          </CardContent>
                        </Card>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                         <Card className="w-full">
                           <CardContent className="p-4 flex items-center gap-4">
                            <RadioGroupItem value="supabase" />
                            <FormLabel className="font-normal">
                              Supabase
                            </FormLabel>
                          </CardContent>
                        </Card>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                         <Card className="w-full">
                           <CardContent className="p-4 flex items-center gap-4">
                            <RadioGroupItem value="nodejs" />
                            <FormLabel className="font-normal">
                              Node.js Custom
                            </FormLabel>
                          </CardContent>
                        </Card>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size="lg" className="w-full" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate App"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
