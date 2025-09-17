
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Enable for production safety
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable for production safety
  },
  async headers() {
    return [
      {
        // Cache static assets for performance
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js images
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // No cache for HTML pages in development
        source: '/((?!_next/static|_next/image).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },
  // Allow all dev origins for Replit proxy system
  allowedDevOrigins: [
    'https://d692d3fd-44cc-46fc-a3f1-fb5c04519740-00-g2efxgapcszu.worf.replit.dev',
    'https://*.worf.replit.dev',
    'https://*.riker.replit.dev',
    'https://*.replit.dev',
    'https://*.replit.app', 
    'https://*.replit.com',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://0.0.0.0:5000'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
