'use client';

import dynamic from 'next/dynamic';

const ParticlesComponent = dynamic(() => import('@/components/ui/particles').then(mod => ({ default: mod.ParticlesComponent })), {
  ssr: false,
});

interface ClientParticlesProps {
  className?: string;
}

export function ClientParticles({ className }: ClientParticlesProps) {
  return <ParticlesComponent className={className} />;
}