import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Bot, Database, FileCode } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

const sliderImages = [
  PlaceHolderImages.find(img => img.id === 'slider-1'),
  PlaceHolderImages.find(img => img.id === 'slider-2'),
  PlaceHolderImages.find(img => img.id === 'slider-3'),
].filter(Boolean) as (typeof PlaceHolderImages[0])[];


export default function Home() {
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section with Carousel Background */}
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
           <Carousel
            opts={{ loop: true }}
            className="absolute inset-0 w-full h-full"
          >
            <CarouselContent style={{ height: "100%" }}>
              {sliderImages.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={image.imageHint}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute inset-0 bg-black/50 z-10" />
            <CarouselPrevious className="absolute left-4 md:left-8 z-20 text-white" />
            <CarouselNext className="absolute right-4 md:right-8 z-20 text-white" />
          </Carousel>

          <div className="container px-4 md:px-6 relative z-20 text-white">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
                Build Your Dream App with the Power of AI
              </h1>
              <p className="mt-4 md:mt-6 text-lg md:text-xl text-neutral-200">
                Welcome to <span className="font-semibold text-white">Genius APPio</span>. Describe your app, and we'll generate the code. No-code simplicity, pro-code power.
              </p>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/signup">
                    Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold bg-transparent text-white border-white hover:bg-white hover:text-black">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-secondary/10">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Genius APPio?</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge AI with robust development practices to give you a head start on your next project.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group flex flex-col overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out shadow-md hover:shadow-xl">
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

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/50">
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
