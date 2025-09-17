# Overview

This is a Next.js-based AI-powered app generation platform called "AppForge AI" (branded as "Genius APPio"). The platform allows users to generate complete Flutter applications by providing natural language prompts describing their desired app features, pages, and design. The system leverages Google's Gemini AI through Genkit to interpret user prompts and generate structured Flutter project files that can be downloaded as ZIP archives.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15.3.3 with TypeScript and React Server Components
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **UI Components**: Radix UI primitives for accessibility and customization
- **Animations**: Framer Motion for smooth transitions and interactive elements
- **Theme Support**: Dark/light mode toggle with next-themes
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## Backend Architecture
- **AI Integration**: Google Genkit framework with Gemini 2.5 Flash model for prompt processing
- **Authentication**: Firebase Authentication for user management
- **Routing**: Next.js App Router for file-based routing and API routes
- **State Management**: React hooks and context for local state management

## Core Features
- **AI App Generation**: Natural language to Flutter code conversion
- **Icon Generation**: AI-powered app icon creation based on app description
- **Multi-Backend Support**: Options for Firebase, Supabase, or custom Node.js backends
- **Real-time Progress**: Sidebar showing generation status and file structure
- **Bilingual Support**: Arabic and English with RTL/LTR layout support

## Design System
- **Color Scheme**: Olive green primary (#708238), light olive background (#E0E5D0), soft brown accent (#827038)
- **Typography**: PT Sans font family for both headlines and body text
- **Icons**: Lucide React icon library for consistency
- **Particles**: Interactive particle background using tsParticles

## File Generation Flow
1. User submits natural language prompt describing desired app
2. Genkit processes prompt using Gemini AI model
3. System generates complete Flutter project structure including:
   - Main application files (main.dart, app.dart)
   - Screen components and navigation
   - Models and services
   - Asset configuration
   - Platform-specific files (Android/iOS)
4. Generated files are packaged and made available for download

# External Dependencies

## AI Services
- **Google Genkit**: AI orchestration framework for prompt processing
- **Gemini 2.5 Flash**: Google's language model for code generation
- **Firebase Genkit Integration**: Serverless AI function execution

## Authentication & Database
- **Firebase**: User authentication and project configuration storage
- **Firebase Auth**: Email/password authentication with profile management

## UI & Styling
- **shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Primitive components for complex UI patterns
- **Tailwind CSS**: Utility-first styling framework
- **next-themes**: Theme switching functionality

## Development Tools
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting and formatting
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API responses

## Additional Services
- **Particle Effects**: tsParticles for animated background
- **Form Validation**: hookform/resolvers with Zod schemas
- **Animation Library**: Framer Motion for smooth transitions
- **File Processing**: JSZip for creating downloadable project archives