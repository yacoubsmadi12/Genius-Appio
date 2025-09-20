
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bot, Database, FileCode, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AnimatedCode } from '@/components/animated-code';
import { Typewriter } from '@/components/typewriter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const features = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'AI App Generation',
    description: 'Describe your app in plain English, and our AI will generate the Flutter code, pages, and navigation for you.',
    image: PlaceHolderImages.find(img => img.id === 'feature-ai-generation'),
  },
  {
    icon: <Database className="h-8 w-8" />,
    title: 'Multi-Backend Support',
    description: 'Choose your preferred backend. We support Firebase, Supabase, and custom Node.js skeletons out of the box.',
    image: PlaceHolderImages.find(img => img.id === 'feature-multi-backend'),
  },
  {
    icon: <FileCode className="h-8 w-8" />,
    title: 'Customizable Flutter Apps',
    description: 'Download the complete Flutter project as a ZIP file. The code is clean, customizable, and ready to deploy.',
    image: PlaceHolderImages.find(img => img.id === 'feature-customizable'),
  },
];

const testimonials = [
  {
    name: 'Sarah L.',
    role: 'Indie Developer',
    avatarUrl: 'https://picsum.photos/seed/sarah/100/100',
    testimonial: 'Genius APPio is a game-changer! I went from a simple idea to a functional app prototype in a single afternoon. The generated code is surprisingly clean and easy to customize.'
  },
  {
    name: 'Mike R.',
    role: 'Startup Founder',
    avatarUrl: 'https://picsum.photos/seed/mike/100/100',
    testimonial: 'As a non-technical founder, this tool allowed me to validate my app idea without hiring an expensive development team. The multi-backend support is a fantastic feature.'
  },
  {
    name: 'Javier C.',
    role: 'UX Designer',
    avatarUrl: 'https://picsum.photos/seed/javier/100/100',
    testimonial: "I love how I can quickly generate a base app and then focus on what I do best: refining the user experience. It's an essential part of my workflow now."
  }
];

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const handleDashboardClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
                  <Typewriter text="Build Your Dream App with the Power of AI" />
                </h1>
                <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground">
                  Welcome to <span className="font-semibold text-foreground">Genius APPio</span>. Describe your app, and we'll generate the code. No-code simplicity, pro-code power.
                </p>
                <div className="mt-6 md:mt-8 flex justify-center">
                  <Button asChild size="lg" variant="ghost" className="font-semibold">
                    <Link href="/signup">
                      Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <AnimatedCode />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Genius APPio?</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge AI with robust development practices to give you a head start on your next project.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-md hover:shadow-xl bg-background/80 backdrop-blur-sm">
                  {feature.image && (
                    <div className="aspect-video overflow-hidden">
                       <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        width={600}
                        height={400}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={feature.image.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader className="flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">What Our Clients Say</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Discover why developers and founders love building with Genius APPio.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col justify-between bg-card/50">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.testimonial}"</p>
                  </CardContent>
                  <CardHeader className="flex-row items-center gap-4 p-6 pt-0">
                    <Avatar>
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold">{testimonial.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-card/50">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Forge Your App?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Join thousands of developers and entrepreneurs building faster with Genius APPio.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/signup">
                  Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
