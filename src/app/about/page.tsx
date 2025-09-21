
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Rocket } from 'lucide-react';

const teamMembers = [
  {
    name: 'Eng Yacoub.Smadi',
    role: 'CEO & Founder',
    imageUrl: 'https://i.postimg.cc/cC5wq2B5/Whats-App-Image-2025-03-15-at-12-06-31-AM.jpg',
  },
  {
    name: 'Eng Mohammad.AL-Rawashdah',
    role: 'CTO',
    imageUrl: 'https://i.postimg.cc/mrGMGQ7R/Whats-App-Image-2025-09-12-at-19-03-04.jpg',
  },
  {
    name: 'Eng Rabie Otoum',
    role: 'AI Lab Lead',
    imageUrl: 'https://i.postimg.cc/s29WfvJW/Whats-App-Image-2025-09-12-at-19-21-04.jpg',
  },
];

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-us-team');

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">About Genius APPio</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          We're on a mission to revolutionize app development with the power of artificial intelligence.
        </p>
      </div>

      <Card className="overflow-hidden mb-12">
        {aboutImage && (
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={aboutImage.imageUrl}
              alt={aboutImage.description}
              fill
              className="object-cover"
              data-ai-hint={aboutImage.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
            <Rocket className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Our Mission</h2>
          <p className="mt-2 text-muted-foreground">To empower developers and entrepreneurs to build and launch applications faster by automating the tedious parts of software creation.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Our Vision</h2>
          <p className="mt-2 text-muted-foreground">We envision a future where ideas can be transformed into functional, beautiful apps in minutes, not months, making technology more accessible to everyone.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-headline">Our Team</h2>
          <p className="mt-2 text-muted-foreground">We are a passionate team of engineers, designers, and AI researchers dedicated to pushing the boundaries of what's possible in app development.</p>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-10">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.name} className="text-center overflow-hidden">
              <div className="relative h-64 w-full">
                <Image 
                  src={member.imageUrl} 
                  alt={`Photo of ${member.name}`}
                  fill
                  className="object-contain"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary font-semibold">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <h3 className="text-3xl font-bold text-center font-headline mb-4">The Story Behind Genius APPio</h3>
          <p className="text-muted-foreground leading-relaxed">
            Genius APPio was born from a simple observation: too many great ideas die before they ever become a reality because of the high barriers to software development. The time, cost, and technical expertise required can be prohibitive. We asked ourselves, "What if we could use the recent advancements in generative AI to bridge this gap?"
            <br /><br />
            Our journey began with a small team and a big idea. We spent countless hours training models, designing intuitive user experiences, and building a platform that is both powerful for professional developers and simple for beginners. Today, Genius APPio is the result of that dedication, offering a unique blend of AI-driven code generation, flexible backend options, and fully customizable outputs. We're just getting started, and we're excited to have you join us on this journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
