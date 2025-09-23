
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
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  // Allow all dev origins for Replit proxy system
  allowedDevOrigins: [
    'https://c590561d-6f14-4402-b6a0-2cb1954ad8b3-00-34m12c0t8tnoi.janeway.replit.dev',
    'https://c9fede8c-65a5-4e21-a9cd-aa838262e025-00-5o0lr1xj2sxh.spock.replit.dev',
    'https://c8715535-2694-4d5b-be62-ea938cd6a8cf-00-3b08leo46cetg.riker.replit.dev',
    'https://db7016c2-bd95-4aa0-9f97-c4ba5ae5234b-00-2yxopmjd3x67h.riker.replit.dev',
    'https://3d2337df-b3cf-404d-8274-580a96c24231-00-2badse7d0ow6.sisko.replit.dev',
    'https://94ace333-ca67-4484-80ee-488a02c66107-00-99yiips2ux7f.spock.replit.dev',
    'https://*.spock.replit.dev',
    'https://*.worf.replit.dev', 
    'https://*.riker.replit.dev',
    'https://*.sisko.replit.dev',
    'https://*.janeway.replit.dev',
    'https://*.replit.dev',
    'https://*.replit.app',
    'https://*.replit.com',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://0.0.0.0:5000',
    'https://127.0.0.1',
    '127.0.0.1'
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
