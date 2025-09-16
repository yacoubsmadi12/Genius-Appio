
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/ month',
    description: 'For individuals and hobbyists starting out.',
    features: [
      '1 App generation per month',
      'Basic components',
      'Firebase backend only',
      'Community support',
    ],
    cta: 'Get Started',
    isPopular: false,
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$39.99',
    period: '/ month',
    description: 'For professionals and small teams.',
    features: [
      '2 App generations per month',
      'Advanced components',
      'All backend options',
      'Priority email support',
      'Downloadable ZIP File Project',
    ],
    cta: 'Upgrade to Pro',
    isPopular: true,
    href: 'https://www.paypal.com/ncp/payment/ZEA2UF7FWTUF8',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom needs.',
    features: [
      'Custom component library',
      'On-premise deployment option',
      'Dedicated account manager',
      '24/7 priority support',
    ],
    cta: 'Contact Sales',
    isPopular: false,
    href: '/contact',
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Find the Perfect Plan
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Start for free, then upgrade as you grow. All plans include our core AI features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.isPopular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
            {plan.isPopular && (
              <div className="text-center py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline">{plan.name}</CardTitle>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.isPopular ? 'default' : 'outline'} asChild>
                <Link href={plan.href} target={plan.href.startsWith('http') ? '_blank' : undefined}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
