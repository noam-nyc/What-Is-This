# What Is This? - AI-Powered Image Analysis Platform

## Overview

What Is This? is an accessibility-first web application designed to help seniors and non-English speakers understand images, products, and documents through simple AI-powered explanations. Users can take photos, upload images, or paste URLs to receive easy-to-understand explanations in their preferred language. The platform uses OpenAI's GPT-4 Vision API for image analysis and includes safety features like safety alerts and content moderation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Updates (October 2025)

### Latest Changes (October 21, 2025 - Domain & Email Configuration)

**Production Domain**
- Secured production domain: **what-is-this.app**
- Support/contact email: **info@what-is-this.app**
- All UI references updated to use new email address

**Image Optimization (Cost Reduction)**
- Client-side image optimization before OpenAI API calls
- Resize to max 1024px, JPEG 85% compression
- Reduces costs by 80-90% (~$0.04 → ~$0.006 per 12MP image)
- Maintains analysis quality while dramatically improving margins

**UX Improvements**
- Fixed registration 404 redirect race condition with 100ms delay
- Smooth authentication state propagation before navigation
- All email addresses consolidated to info@what-is-this.app

### Previous Changes (October 19, 2025 - Final Deployment Prep)

**Language Support Expansion**
- Added 3 new languages: Italian (it), Russian (ru), Hebrew (he)
- Total supported: 11 languages (EN, ES, ZH, FR, DE, IT, PT, RU, HE, JA, KO)
- Right-to-left (RTL) support for Hebrew

**Terms of Service & Legal**
- Comprehensive Terms page with AI-specific disclaimers
- Enhanced liability limitations and "AS IS" warranty disclaimers
- Special safety intent warnings (critical for "Is it safe?" feature)
- Indemnification clauses and acceptable use policies
- Route added: `/terms`

**Deployment Documentation**
- Complete PWA deployment guide (DEPLOYMENT_GUIDE.md)
- Email domain setup instructions (EMAIL_DOMAIN_SETUP.md)
- Beta testing recruitment strategies (BETA_TESTING_GUIDE.md)
- Financial analysis with funding requirements (FINANCIAL_ANALYSIS.md)

### Critical Features Completed (October 19, 2025)
1. **Profitable Pricing Structure** - Adjusted to achieve 30%+ profit margins:
   - Daily: $0.49/day (10 analyses) - 39% margin
   - Weekly: $2.99/week (70 analyses) - 30% margin  
   - Monthly: $12.99/month (300 analyses) - 31% margin
   - Pro: $25.99/month (600 analyses) - 31% margin
   - Annual: $144.99/year (3,650 analyses) - 25% margin
   - All tiers exceed 25% minimum margin requirement based on $0.03 OpenAI cost per analysis

2. **Image Quality Validation** - Client-side checks before OpenAI analysis:
   - File size limits: 1KB minimum, 10MB maximum
   - Minimum resolution: 640x480 pixels
   - Brightness detection: Rejects images with avgBrightness < 20 (too dark)
   - Blur detection: Laplacian variance threshold (rejects blurry photos)
   - Validation integrated into file upload flow with user-friendly error messages
   - URL images show quality check notice (validated during analysis)

3. **AI Confidence Scoring** - All 8 intent prompts return confidence (0-100):
   - OpenAI system prompts updated to include confidence field in JSON response
   - Color-coded display: Green (80-100), Yellow (60-79), Red (0-59)
   - Visual progress bars with descriptive text for seniors
   - Confidence shown prominently in analyze results (always visible)
   - Confidence badge in saved answers header (no expansion required)
   - Full confidence details (progress bar + explanation) when answer expanded

### Previous Features (January 2025)
1. **Language Selection System** - 8-language support (EN, ES, ZH, FR, DE, PT, JA, KO) with backend integration and accessibility-first UI
2. **Privacy Policy** - Comprehensive page covering GDPR, App Store requirements, AI disclaimers, data collection transparency
3. **Account Deletion** - GDPR-compliant with password confirmation, transactional cascade deletion, session cleanup
4. **Saved Answers Workflow** - Full CRUD implementation: view list, expand/collapse details, delete with confirmation, premium-gated access
5. **Daily Usage Indicator** - Real-time usage tracking with backend integration, shows current/daily limit, progress bar, reset time (hidden for free tier)
6. **Help & FAQ Content** - Comprehensive FAQ covering all features, correct pricing, daily limits, accurate language list
7. **Analysis Intent Selection (Refactored Jan 2025)** - Completely redesigned from technical categories to user-friendly plain language questions:
   - **3 FREE Intents**: "What is this?", "Where is it from?", "General Info"
   - **5 PREMIUM Intents**: "How to use it", "How to care for it", "Is it safe?", "How to fix it", "Where to buy one"
   - Free/Premium split with visual badges, subscription gating on frontend and backend
   - All 8 OpenAI system prompts rewritten for 6th-grade reading level (seniors, non-English speakers, non-technical users)
   - Maintained RadioGroup accessibility (ARIA labels, keyboard navigation, screen reader support)
   - Intent badges displayed in analysis results and saved answers

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
- `DATABASE_URL`: PostgreSQL connection string (Neon serverless)
- `SESSION_SECRET`: Secret for session encryption
- `OPENAI_API_KEY`: OpenAI API authentication ($0.03/analysis cost)
- `RESEND_API_KEY`: Resend API for transactional emails (free tier: 3K/month)
- `NODE_ENV`: Environment indicator (development/production)

**Deployment Resources**
- PWA Setup: See `DEPLOYMENT_GUIDE.md`
- Email Configuration: See `EMAIL_DOMAIN_SETUP.md`
- Beta Testing: See `BETA_TESTING_GUIDE.md`
- Funding Analysis: See `FINANCIAL_ANALYSIS.md`

**Financial Overview (Year 1 Bootstrap)**
- Personnel: $92,400/year (founder + VA)
- Technology: $3,600/year (OpenAI dominant variable cost)
- Marketing: $6,600/year (organic-first)
- **Total OpEx**: $111,000/year
- **Break-even**: 1,530 paid users (~3,825 total users)
- **Target Margins**: 25-39% across all paid tiers

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