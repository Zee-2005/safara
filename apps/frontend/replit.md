# SaFara Tourist Safety PWA

## Overview

SaFara is a Progressive Web Application (PWA) designed to enhance tourist safety in India. The application provides comprehensive safety features including emergency SOS alerts, geofencing notifications, digital identity verification, multilingual support, and real-time safety guidance. Built as a full-stack TypeScript application, it combines a React-based frontend with an Express.js backend, designed to integrate with government emergency services like ERSS-112.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Built on shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system supporting both light and dark modes
- **State Management**: React hooks with TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Progressive Web App**: Configured with service worker capabilities and offline support
- **Maps Integration**: Leaflet.js for interactive mapping and geofencing features
- **Mobile-First Design**: Responsive design optimized for mobile devices with PWA installation support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API structure with centralized route management
- **Data Validation**: Zod schemas for type-safe request/response validation
- **Development**: Hot reloading with Vite middleware integration
- **Error Handling**: Centralized error handling with structured logging

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless PostgreSQL for cloud database hosting
- **Schema Management**: Drizzle migrations with version control
- **Session Storage**: PostgreSQL-backed session management using connect-pg-simple
- **Development Storage**: In-memory storage implementation for development and testing

### Authentication and Authorization
- **Authentication Method**: Phone number + OTP verification system
- **Guest Mode**: Limited functionality access without full registration
- **Session Management**: Server-side sessions with PostgreSQL storage
- **Identity Verification**: Digital ID creation with Aadhaar integration
- **W3C Standards**: Verifiable Credentials format for tourist ID QR codes

### Safety and Emergency Features
- **SOS Emergency System**: Multi-stage emergency alert system with ERSS-112 escalation
- **Geofencing**: Real-time location monitoring with safety zone alerts
- **Emergency Contacts**: Configurable emergency contact management
- **Medical Information**: Secure storage of critical medical data
- **Safety Check-ins**: Automated and manual safety status updates
- **Audio/Photo Evidence**: Emergency documentation capture and storage

### Internationalization
- **Multi-language Support**: 12 Indian languages including Hindi, Bengali, Telugu, Tamil, etc.
- **Font System**: Inter for Latin scripts and Noto Sans for Indian language scripts
- **Language Selection**: Persistent language preference storage
- **Cultural Adaptation**: UI patterns adapted for diverse Indian user base

## External Dependencies

### Database and Cloud Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database queries and migrations

### UI and Styling Libraries
- **Radix UI**: Headless UI primitives for accessibility and keyboard navigation
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI

### Maps and Location Services
- **Leaflet**: Open-source mapping library for interactive maps
- **Browser Geolocation API**: Native location services integration

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **TanStack Query**: Data fetching and caching library
- **Wouter**: Lightweight client-side routing

### Form Management and Validation
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Government Integration Points
- **ERSS-112**: Emergency Response Support System integration for escalated alerts
- **Aadhaar System**: Identity verification through government ID system
- **Tourism Board APIs**: Integration capabilities for regional tourism data
- **Local Emergency Services**: SMS and notification system integration

### PWA and Mobile Features
- **Web Manifest**: PWA configuration for app-like installation
- **Service Worker**: Offline functionality and background sync capabilities
- **Push Notifications**: Real-time alert delivery system
- **Media Capture**: Camera and microphone access for emergency documentation
- **QR Code Generation**: Dynamic QR code creation for tourist ID verification