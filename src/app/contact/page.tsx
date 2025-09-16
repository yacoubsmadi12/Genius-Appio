"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, User, Linkedin } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <path d="M12.031 6.849c-3.14 0-5.698 2.558-5.698 5.698 0 1.413.524 2.735 1.442 3.765l-1.02 3.73H10.1c.97.644 2.13.99 3.37.99h.002c3.14 0 5.698-2.558 5.698-5.698s-2.558-5.698-5.7-5.698zm0 10.372c-1.128 0-2.222-.32-3.142-.916l-.225-.133-2.33.633.64-2.27-.153-.238c-.696-1.08-1.074-2.35-1.074-3.682 0-2.583 2.096-4.68 4.68-4.68 2.583 0 4.68 2.096 4.68 4.68s-2.098 4.68-4.68 4.68zm2.842-3.32c-.156-.08-.92-.455-1.062-.507-.142-.05-.246-.08-.348.08-.102.158-.39.507-.48.608-.09.102-.18.114-.336.033-.157-.082-.66-.242-1.258-.775-.467-.417-.78- .93-.87-1.087-.09-.158-.01-.24.07-.322.07-.07.156-.182.234-.273.08-.09.105-.158.157-.262.052-.103.026-.196-.013-.274-.04-.08-.348-.84-.476-1.146-.128-.308-.26-.266-.36-.27-.097-.004-.207-.004-.318-.004s-.27.04-.413.196c-.143.158-.543.53-.543 1.29 0 .76.556 1.496.632 1.6.078.102 1.09 1.75 2.645 2.34.38.142.68.227.91.29.35.097.66.082.9.05.27-.038.92-.375 1.048-.738.128-.36.128-.67.09-.738-.04-.06-.14-.097-.3-.178z"/>
  </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.524-.18 2.42-1.002 6.57-1.15 7.193-.06.25-.17.33-.28.343-.304.034-.52-.15-.69-.244l-2.16-1.587-1.033.996a.798.798 0 0 1-.33.175.69.69 0 0 1-.48-.232l.34-1.72 1.95-1.765c.09-.08.01-.13-.1-.05l-2.4 1.51-1.004-.314c-.21-.065-.3-.14-.24-.315.04-.12.1-.21.15-.27l.03-.03s4.8-2.205 4.85-2.23z"/>
  </svg>
);


export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Contact Us</CardTitle>
          <CardDescription>Have a question or feedback? We'd love to hear from you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="Your Name" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} className="pl-10" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Textarea placeholder="Tell us what's on your mind..." {...field} className="pl-10 min-h-[120px]" />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or connect with us
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4 text-muted-foreground">
            <Button variant="outline" size="icon" asChild>
              <a href="https://wa.me/962796734144" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Contact on Telegram">
                <TelegramIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
