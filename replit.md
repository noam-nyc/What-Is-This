# What Is This? - AI-Powered Image Analysis Platform

## Overview

What Is This? is an accessibility-first web application designed to help seniors and non-English speakers understand images, products, and documents through simple AI-powered explanations. Users can take photos, upload images, or paste URLs to receive easy-to-understand explanations in their preferred language. The platform uses OpenAI's GPT-4 Vision API for image analysis and includes safety features like safety alerts and content moderation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (January 2025)

### Critical Features Completed
1. **Language Selection System** - 8-language support (EN, ES, ZH, FR, DE, PT, JA, KO) with backend integration and accessibility-first UI
2. **Privacy Policy** - Comprehensive page covering GDPR, App Store requirements, AI disclaimers, data collection transparency
3. **Account Deletion** - GDPR-compliant with password confirmation, transactional cascade deletion, session cleanup
4. **Saved Answers Workflow** - Full CRUD implementation: view list, expand/collapse details, delete with confirmation, premium-gated access
5. **Daily Usage Indicator** - Real-time usage tracking with backend integration, shows current/daily limit, progress bar, reset time (hidden for free tier)
6. **Help & FAQ Content** - Comprehensive FAQ covering all features, correct pricing ($2.99-$99.99), daily limits (10/40/75/75), accurate language list
7. **Analysis Intent Selection** - Core differentiator feature allowing users to specify analysis intent (General Info, How to Use, Maintenance, Fix/Troubleshoot, History, Price/Where to Buy, Safety Check) with custom AI prompts per intent, intent badges in results and saved answers

### Bug Fixes
- Fixed LanguageSelector optimistic updates to properly revert on error
- Wrapped deleteUser in database transaction for atomic cascading deletion
- Fixed savedAnswers component to work with actual schema (JSONB data field)
- Updated analyze.tsx language list to correct 8 languages (removed Arabic/Hindi, added Japanese/Korean)
- DailyUsageIndicator now hidden for free tier users (monthly quota instead of daily)
- Updated tier naming to user-friendly format ("Weekly Plan", "Premium Plan", etc.)
- Fixed frontend/backend mismatch: analyze.tsx now sends imageUrl for URLs and imageBase64 for uploaded files (was sending imageData which backend didn't recognize)
- Fixed intent variable scoping error in server/routes.ts error handler

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching

**UI Component System**
- **Shadcn/ui** components built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Class Variance Authority (CVA)** for managing component variants
- Design follows accessibility-first principles with AAA contrast ratios, large touch targets (minimum 44px), and generous text sizes optimized for seniors

**State Management Strategy**
- Server state managed through TanStack Query with infinite stale time to minimize unnecessary refetches
- Local UI state managed with React hooks (useState, useEffect)
- Session state handled server-side with express-session
- No global state management library needed due to simple data flow

**Key User Flows**
1. **Onboarding**: Terms acceptance → Age verification → Language selection
2. **Analysis**: Input method selection (camera/upload/URL) → Token cost preview → AI analysis → Results display
3. **Monetization**: Free tier (3 analyses/month) → Apple IAP subscriptions with daily limits
4. **Password Reset**: Forgot password → Email with token link → Reset password → Auto-redirect to login

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with ES modules
- **TypeScript** for type safety across the entire stack
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple for persistent authentication

**Database Layer**
- **Neon Postgres** (serverless PostgreSQL) as the primary database
- **Drizzle ORM** for type-safe database queries and schema management
- Schema includes: users, subscriptions, tokenPurchases, savedAnswers, usageLogs
- Database connection pooling via @neondatabase/serverless with WebSocket support

**API Architecture**
- RESTful API design with JSON payloads
- Authentication middleware using session-based auth (no JWT)
- Routes organized by domain: /api/auth, /api/tokens, /api/subscription, /api/saved-answers
- Special handling for Stripe webhooks (raw body parsing for signature verification)

**Business Logic Layers**
1. **Storage Layer** (server/storage.ts): Abstraction over database operations with a clean interface
2. **Route Handlers** (server/routes.ts): Request validation, authentication checks, business logic orchestration
3. **External Service Integration**: Separated concerns for OpenAI and Stripe interactions

### External Dependencies

**AI & Image Analysis**
- **OpenAI GPT-4 Vision API** for image analysis and natural language explanations
- System prompts configured for general analysis (products, documents, food items)
- Token cost calculation with 100% markup over OpenAI pricing ($0.01 input/$0.03 output per 1K tokens)
- Usage tracking for billing and quota management

**Payment Processing (DEPRECATED - Now using Apple IAP)**
- Previously used Stripe - now migrated to Apple In-App Purchases
- Apple IAP receipt validation endpoint: POST /api/iap/validate-receipt
- 4 subscription tiers: Weekly ($2.99), Premium ($5.99), Pro ($12.99), Annual ($99.99)
- Daily analysis limits enforced by tier with UTC midnight reset

**Authentication**
- **bcrypt** for password hashing (cost factor managed in environment)
- Session-based authentication stored in PostgreSQL
- 7-day session expiry with secure cookies (httpOnly, secure in production)

**Database**
- **Neon Database** (serverless PostgreSQL) for data persistence
- Connection string stored in DATABASE_URL environment variable
- WebSocket support for serverless deployment compatibility
- Automatic connection pooling and management

**Development Tools**
- **Replit-specific plugins**: Error modal overlay, cartographer for code navigation, dev banner
- **Drizzle Kit** for database migrations and schema management
- **TSX** for TypeScript execution in development

**Environment Variables Required**
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `OPENAI_API_KEY`: OpenAI API authentication
- `RESEND_API_KEY`: Resend API for transactional emails (password reset)
- `NODE_ENV`: Environment indicator (development/production)

**Email Service**
- **Resend** integration for transactional emails
- Password reset emails with branded HTML templates
- 1-hour token expiry for security
- Anti-enumeration protection (always returns success regardless of email existence)

**Security & Safety Features**
- Age verification system (13+ minimum age, parental consent required for under-18)
- Safety alerts for potentially concerning content (injuries, hazards, safety concerns)
- Content moderation for sensitive material (violence, self-harm, drugs, offensive content)
- Terms and conditions acceptance flow
- AI disclaimer about potential mistakes and limitations
- Rate limiting through token system to prevent abuse

**Deployment Architecture**
- Designed for Replit deployment with serverless database
- Build process: Client (Vite) → dist/public, Server (esbuild) → dist/index.js
- Production mode serves static files from Express after build
- Development mode uses Vite middleware for HMR