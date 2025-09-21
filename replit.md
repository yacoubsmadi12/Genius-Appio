# Overview

This is a Next.js-based AI-powered app generation platform called "AppForge AI" (branded as "Genius APPio"). The platform allows users to generate complete Flutter applications by providing natural language prompts describing their desired app features, pages, and design. The system leverages Google's Gemini AI through Genkit to interpret user prompts and generate structured Flutter project files that can be downloaded as ZIP archives.

# Recent Updates

## September 17, 2025 - GitHub Import & AI Enhancement
- **GitHub Import Setup**: Successfully imported and configured the project to run in Replit environment
- **AI Generation Enhancement**: Improved AI prompt engineering for better organized Flutter code generation
  - Enhanced prompt to extract app specifications (name, backend, description, pages, features, colors)
  - Added structured data passing for better AI understanding
  - Configured to generate clean, organized Dart code instead of paragraphs
- **Complete Flutter Project Generation**: Implemented full Flutter project skeleton generation
  - Created comprehensive Flutter web project template with all necessary files
  - AI-generated files now overlay on complete project structure instead of partial lib/ folder
  - Generated projects are now complete and runnable with `flutter run -d chrome`
  - Includes all necessary web platform files: index.html, manifest.json, PWA icons, etc.
  - Android and iOS support planned for future implementation when Flutter SDK is available
- **Environment Configuration**: Set up Google AI API integration and Firebase configuration
- **Deployment Ready**: Configured deployment settings for production use
- **Performance**: All components tested and working correctly on port 5000

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
2. System extracts app name and creates complete Flutter web project template including:
   - Web platform folder with index.html, manifest.json, and PWA icons
   - Project metadata and configuration files
   - Test structure and analysis configuration
3. Genkit processes prompt using Gemini AI model to generate:
   - Main application files (main.dart, app.dart)
   - Screen components and navigation
   - Models and services
   - Custom pubspec.yaml with dependencies
4. AI-generated files are merged with complete project template
5. Complete, runnable Flutter project is packaged and made available for download

### Template Files Generated
- **Web Platform**: index.html, manifest.json, PWA icons, web configuration
- **Project Root**: pubspec.yaml, .gitignore, .metadata, analysis_options.yaml
- **Application Code**: lib/main.dart with Material 3 architecture
- **Testing**: Basic widget tests and test configuration

Note: Projects are currently web-optimized. Android and iOS platform support will be added in future versions when Flutter SDK is available in the environment.

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