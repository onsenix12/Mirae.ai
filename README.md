# Mirae.ai
**Dashboard-Based, Multi-Stage, AI-Powered Career Exploration Platform**

---

## Overview

Mirae.ai is a dashboard-based career exploration platform that guides Korean high school students through 6 progressive stages - from initial self-understanding to final course selections. Each stage combines interactive activities (swipe mechanics, drag-drop, tournaments) with chatbot-guided reflection to build toward concrete course recommendations.

**Core Innovation:** Gamified exploration + AI synthesis -> Data-driven course roadmap

---

## Project Structure

This repository contains documentation for the Mirae.ai project. The project structure follows the specifications in `REVISED_24HR_PLAN.md` and `REVISED_APP_BLUEPRINT.md`.

### Documentation Files

```
.
├── README.md                    # This file - project overview
├── REVISED_24HR_PLAN.md         # 24-hour MVP development plan
├── REVISED_APP_BLUEPRINT.md     # Complete product architecture blueprint
├── AGENTS.md                    # Repository guidelines
└── docs/
    ├── PRD.md                   # Product Requirements Document
    ├── PROBLEM.md              # Problem statement and context
    ├── SOLUTION.md             # Solution architecture and design
    └── ONBOARDING.md           # Onboarding flow implementation guide
```

### Application Structure

The application has been implemented with the following structure:

```
app/
├── (auth)/
│   ├── login/              # Login page with Supabase authentication
│   └── signup/              # Signup page with user metadata
├── (dashboard)/
│   ├── dashboard/          # Main dashboard hub with progress tracking
│   ├── stage0/             # Initial Questionnaire with chatbot follow-up
│   ├── stage1/             # Role Roulette (swipe interface)
│   ├── stage2/             # Course Roadmap Builder (drag-drop)
│   ├── stage3/             # Skill Translation with voice/text chat
│   ├── stage4/             # Tournament Bracket (specialization narrowing)
│   ├── stage5/             # Storyboard (future visualization)
│   ├── avatar-lab/         # Avatar customization lab
│   └── collection/         # User collection view
├── onboarding/             # Onboarding flow with document upload
├── api/
│   ├── chat/               # General chatbot API
│   │   ├── route.ts        # Main chat endpoint
│   │   └── general/        # General chat route
│   ├── analyze-roles/      # Role swipe analysis API
│   ├── generate-recommendations/  # AI-powered recommendations
│   ├── generate-feedback/  # Feedback generation
│   ├── journey-report/     # Journey report generation
│   ├── onboarding/         # Onboarding chat API
│   ├── recommend-roles/    # Role recommendation API
│   ├── save-conversation/  # Conversation persistence
│   └── skill-translation/  # Skill translation chat API
├── layout.tsx              # Root layout with metadata
└── page.tsx                # Home page (redirects to dashboard)

lib/
├── auth.ts                 # Authentication utilities
├── openai.ts               # OpenAI service functions
├── supabase.ts            # Supabase client setup
├── ai-recommendations.ts   # AI recommendation generation
├── aiCareerGenerator.ts    # Career generation utilities
├── aiCareerRecommender.ts  # Career recommendation logic
├── userProfile.ts         # User profile management
├── activityLogs.ts        # Activity tracking
├── stores/
│   ├── userStore.ts       # Zustand user state store
│   └── languageStore.ts   # Language preference store
├── hooks/
│   └── useOnboarding.ts   # Onboarding state management
├── data/
│   ├── questionnaire.json # Stage 0 question data
│   ├── roles.json         # Stage 1 role data
│   ├── courses.json       # Course catalog
│   └── courses-descriptions.json
└── types/
    ├── candidate.ts       # Candidate type definitions
    ├── onboarding.types.ts # Onboarding type definitions
    └── skillTranslation.ts # Skill translation types

components/
├── onboarding/            # Complete onboarding flow
│   ├── OnboardingContainer.tsx
│   ├── WelcomePhase.tsx
│   ├── ContextCollectionPhase.tsx
│   ├── DocumentUploadPhase.tsx
│   ├── KeywordReviewPhase.tsx
│   ├── JourneyStartPhase.tsx
│   ├── OnboardingChat.tsx
│   ├── SmartOnboardingChat.tsx
│   └── shared/            # Shared onboarding components
├── chat/                  # Chat interface components
│   ├── FloatingChat.tsx
│   ├── FloatingChatBubble.tsx
│   └── FloatingChatPanel.tsx
├── avatar/                # Avatar customization system
│   ├── AvatarComposer.tsx
│   ├── AvatarCustomizerPanel.tsx
│   ├── avatarRegistry.ts
│   └── avatarTypes.ts
├── AvatarWithAccessories.tsx
├── AccessoryPanel.tsx
├── ActivityCalendar.tsx
├── JourneyReportView.tsx
├── MiraeCharacterEvolution.tsx
└── TopBar.tsx
```

**Status**: Core application structure is implemented with onboarding, authentication, dashboard, and stage pages. Avatar customization and chat interfaces are functional.

---

## The 6-Stage Journey

### Stage 0: Initial Questionnaire
Self-understanding through survey-style question cards with chatbot follow-up.
Question source: `lib/data/questionnaire.json` (MCQ, Slider, Swipe, Tournament).

### Stage 1: Role Roulette
Tinder-style swipe interface to explore 50 career roles and discover interests.

### Stage 2: Course Roadmap Builder
Drag-drop interface to build course selections using Anchor vs Signal framework with AI suggestions.

### Stage 3: Skill Translation
Voice/text chatbot conversation that generates a Growth Character Report mapping courses to skills.

### Stage 4: Tournament Bracket
March Madness-style elimination tournament to narrow down to 2-3 specializations.

### Stage 5: Storyboard
AI-assisted future visualization creating 6-panel storyboards of student's future path.

### Final Dashboard
Synthesizes all stages into actionable course recommendations and next steps.

---

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Zustand (state management)
- React Hook Form + Zod (form validation)
- Recharts (data visualization)
- Lucide React (icons)

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth (authentication)
- Next.js API Routes
- Supabase Storage (for file uploads)

**AI Services:**
- OpenAI GPT-4 Turbo (chatbot, analysis, recommendations)
- OpenAI API (text generation, analysis)
- Speech-to-text capabilities (for voice input)
- AI-powered keyword extraction from documents

**Additional Libraries:**
- @hello-pangea/dnd (drag-and-drop)
- html-to-image (export functionality)
- Sonner (toast notifications)

**Deployment:**
- Vercel (automatic deployments from GitHub)

---

## Development Plan

See `REVISED_24HR_PLAN.md` for the complete 24-hour MVP development plan, including:

- Hour-by-hour breakdown
- Implementation details for each stage
- Database schema
- API routes
- Component specifications

---

## Product Architecture

See `REVISED_APP_BLUEPRINT.md` for the complete product architecture, including:

- Detailed stage specifications
- UI/UX designs
- Data flow
- AI prompt engineering
- Database schema

---

## Documentation

### Core Documentation
- **PRD.md**: Product requirements and goals
- **PROBLEM.md**: Problem statement, constraints, and user needs
- **SOLUTION.md**: Proposed solution details and rationale
- **REVISED_APP_BLUEPRINT.md**: Complete product architecture and stage specifications
- **REVISED_24HR_PLAN.md**: 24-hour MVP development plan with hour-by-hour breakdown

### Implementation Guides
- **ONBOARDING.md**: Onboarding flow implementation guide with technical specifications
- **QUICK_START.md**: Quick setup and installation guide
- **COMPLETE_GUIDE.md**: Comprehensive development guide
- **AGENTS.md**: Repository guidelines and coding standards

### Additional Resources
- **SKILL_TRANSLATION_QUICK_START.md**: Skill translation feature guide
- **MVP_DATA_STORAGE_STRATEGY.md**: Data storage approach

---

## Implementation Status

### ✅ Completed Features
- **Authentication**: Supabase-based user authentication (signup/login)
- **Onboarding Flow**: Multi-phase onboarding with document upload and keyword extraction
- **Dashboard**: Progress tracking, stage navigation, insights overview
- **Stage 0**: Initial questionnaire with chatbot follow-up
- **Stage 1**: Role Roulette with swipe interface
- **Stage 2**: Course Roadmap Builder with drag-drop
- **Stage 3**: Skill Translation with conversational AI
- **Stage 4**: Tournament Bracket for specialization narrowing
- **Stage 5**: Storyboard for future visualization
- **Avatar System**: Character customization and evolution
- **AI Recommendations**: Major and university recommendation engine
- **Chat Interface**: Floating chat with context-aware responses
- **API Routes**: Complete API structure for all features

### 🚧 In Progress / Future Enhancements
- Enhanced voice input capabilities
- Advanced AI image generation for storyboards
- More detailed analytics and insights
- Social features (if needed)
- Mobile app optimization

---

## Key Features

### Core Features
- **Dashboard-centric**: Progress tracking, stage navigation, insights overview
- **Progressive unlock**: Complete one stage to unlock next
- **Multi-modal input**: Swipes, chat, voice, drag-drop, tournament selection
- **AI synthesis**: Each stage produces insights that feed into next stage
- **Actionable outcomes**: Direct translation to course recommendations

### Onboarding System
- **Conversational onboarding**: Multi-phase onboarding flow with document upload
- **Document analysis**: AI-powered keyword extraction from career test results
- **Privacy-first**: No file storage after analysis, optional uploads
- **Context collection**: Year level, course status, and feelings capture

### Avatar & Personalization
- **Avatar customization**: Character evolution and accessory system
- **Visual identity**: Avatar representation throughout the journey
- **Collection system**: Track progress and achievements

### AI-Powered Features
- **Intelligent recommendations**: AI-generated major and university recommendations
- **Role analysis**: Pattern recognition from role exploration
- **Conversational AI**: Context-aware chatbot across multiple stages
- **Skill translation**: Growth Character Report generation

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- OpenAI API key

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-key-here
   ```

   See `QUICK_START.md` for detailed instructions on obtaining these keys.

3. **Set up Supabase database:**
   - Create a new Supabase project
   - Run the database schema (see `REVISED_APP_BLUEPRINT.md` for schema)
   - Enable authentication providers

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   - Navigate to http://localhost:3000
   - Sign up for a new account or log in

### Quick Setup Guide
For detailed setup instructions, see `QUICK_START.md` and `COMPLETE_GUIDE.md`.

---

## Deployment

This project is deployed using **Vercel** with automatic deployments from GitHub.

### Vercel Deployment Setup

1. **Connect Repository to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository (`onsenix12/Mirae.ai`)
   - Vercel will automatically detect Next.js

2. **Configure Environment Variables:**
   
   In your Vercel project settings, add the following environment variables:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ```
   
   - Go to **Settings** → **Environment Variables**
   - Add each variable for **Production**, **Preview**, and **Development** environments
   - Click **Save**

3. **Deploy:**
   - Vercel will automatically deploy on every push to the `master` branch
   - Preview deployments are created for pull requests
   - You can also trigger manual deployments from the Vercel dashboard

4. **Build Configuration:**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

### Important Notes

- **Environment Variables**: Make sure all required environment variables are set in Vercel before deploying
- **OpenAI API Key**: The build will succeed even without `OPENAI_API_KEY` (lazy initialization), but AI features won't work at runtime
- **Automatic Deployments**: Every push to `master` triggers a new production deployment
- **Preview Deployments**: Pull requests automatically get preview deployments for testing

---

## API Endpoints

The application includes the following API routes:

### Chat & Conversation
- `POST /api/chat` - Main chatbot endpoint for general conversations
- `POST /api/chat/general` - General chat route
- `POST /api/onboarding/chat` - Onboarding-specific chat
- `POST /api/skill-translation/chat` - Skill translation conversation
- `POST /api/save-conversation` - Persist conversation history

### Analysis & Recommendations
- `POST /api/analyze-roles` - Analyze role swipe patterns
- `POST /api/generate-recommendations` - Generate AI-powered major/university recommendations
- `POST /api/recommend-roles` - Get role recommendations based on profile
- `POST /api/generate-feedback` - Generate personalized feedback

### Reports & Data
- `POST /api/journey-report` - Generate comprehensive journey report

All API routes use Next.js API Routes and integrate with Supabase for data persistence and OpenAI for AI capabilities.

---

## Repository Guidelines

See `AGENTS.md` for repository guidelines, coding standards, and contribution guidelines.

---

**End of README.md**
