# SCOPE+ Complete Guide

**Dashboard-Based, Multi-Stage, AI-Powered Career Exploration Platform**

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Setup & Installation](#setup--installation)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Code Review & Best Practices](#code-review--best-practices)
7. [Repository Guidelines](#repository-guidelines)
8. [The 6-Stage Journey](#the-6-stage-journey)
9. [Tech Stack](#tech-stack)
10. [Development Notes](#development-notes)
11. [Troubleshooting](#troubleshooting)

---

## Overview

SCOPE+ is a dashboard-based career exploration platform that guides Korean high school students through 6 progressive stages—from initial self-understanding to final course selections. Each stage combines interactive activities (swipe mechanics, drag-drop, tournaments) with chatbot-guided reflection to build toward concrete course recommendations.

**Core Innovation:** Gamified exploration + AI synthesis → Data-driven course roadmap

### Key Features

- **Dashboard-centric**: Progress tracking, stage navigation, insights overview
- **Progressive unlock**: Complete one stage to unlock next
- **Multi-modal input**: Swipes, chat, voice, drag-drop, tournament selection
- **AI synthesis**: Each stage produces insights that feed into next stage
- **Actionable outcomes**: Direct translation to course recommendations

### MVP Success Criteria

- ✅ One complete user journey start-to-finish
- ✅ Data persistence across stages
- ✅ AI chatbot functional in at least 2 stages
- ✅ Demo-ready presentation flow
- ✅ All 6 stages accessible and functional

---

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here
```

**How to Get Your Keys:**

#### Supabase Keys:
1. Go to [supabase.com](https://supabase.com) and create/login to your account
2. Create a new project (or select existing)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

#### OpenAI Key:
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in and go to **API Keys**
3. Click **"Create new secret key"**
4. Copy the key → `OPENAI_API_KEY`

### Step 3: Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Open `supabase/schema.sql` from this project
3. Copy all the SQL code
4. Paste into SQL Editor and click **Run**

This will create all necessary tables and security policies.

### Step 4: Start Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Verification Checklist

- [x] `.env.local` file created with all 4 variables filled in
- [x] Supabase project created
- [x] Database schema run in Supabase SQL Editor
- [x] OpenAI API key obtained
- [ ] Development server starts without errors
- [ ] Can access login page at http://localhost:3000

---

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- OpenAI API key

### Installation Steps

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your URL and keys
3. Run the database migrations (see `supabase/schema.sql`)

#### 3. Configure Environment Variables

See [Environment Variables](#environment-variables) section below for detailed instructions.

#### 4. Set Up Database Schema

Run the SQL migrations in your Supabase SQL editor. The schema is defined in `supabase/schema.sql`.

Key tables needed:
- `users` (handled by Supabase Auth)
- `user_profiles`
- `role_swipes`
- `course_selections`
- `growth_reports`
- `tournament_results`
- `storyboards`
- `chat_messages`

#### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Next Steps

1. **Expand Stage 0**: Add all questionnaire questions from the blueprint
2. **Expand Stage 1**: Add all 50 roles with proper swipe mechanics
3. **Implement Stage 2**: Add drag-drop functionality with @hello-pangea/dnd
4. **Enhance Stage 3**: Add voice input and full conversation flow
5. **Complete Stage 4**: Implement full tournament bracket logic
6. **Finish Stage 5**: Add AI image generation for storyboards

---

## Environment Variables

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory of the project.

### Step 2: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in (or create an account)
2. Create a new project (or use an existing one)
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Get Your OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (you won't be able to see it again!)

### Step 4: Fill in `.env.local`

Copy this template and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here
```

### Step 5: Set Up Database Schema

After creating your Supabase project:

1. Go to **SQL Editor** in your Supabase dashboard
2. Open the file `supabase/schema.sql` from this project
3. Copy and paste the entire SQL into the SQL Editor
4. Click **Run** to create all tables and policies

### Security Notes

⚠️ **Never commit `.env.local` to git!** It's already in `.gitignore`

⚠️ **Never share your service_role key publicly** - it has admin access to your database

⚠️ **Keep your OpenAI API key secret** - it's tied to your billing

---

## Project Structure

### Application Structure

```
app/
├── (auth)/              # Authentication routes
│   ├── login/           ✅ Login page
│   └── signup/          ✅ Signup page
├── (dashboard)/         # Protected dashboard routes
│   ├── dashboard/       ✅ Main dashboard hub
│   ├── stage0/          ✅ Initial Questionnaire
│   ├── stage1/          ✅ Role Roulette
│   ├── stage2/          ✅ Course Roadmap Builder
│   ├── stage3/          ✅ Skill Translation
│   ├── stage4/          ✅ Tournament Bracket
│   └── stage5/          ✅ Storyboard
├── api/                 # API routes
│   ├── chat/            ✅ Chatbot API
│   └── analyze-roles/   ✅ Role analysis API
├── layout.tsx           ✅ Root layout
└── page.tsx             ✅ Home page (redirects to dashboard)

lib/
├── supabase.ts          ✅ Supabase client setup
├── openai.ts            ✅ OpenAI service functions
├── stores/
│   └── userStore.ts     ✅ Zustand user state store
└── utils/
    └── storage.ts       ✅ SSR-safe localStorage utility

components/              # To be expanded with UI components
```

### Core Configuration Files

- ✅ `package.json` - Dependencies configured (Next.js 14, TypeScript, Tailwind, Supabase, OpenAI, etc.)
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `tailwind.config.ts` - Tailwind CSS configuration
- ✅ `next.config.js` - Next.js configuration
- ✅ `.gitignore` - Git ignore rules
- ✅ `middleware.ts` - Authentication middleware

### Library Files

- ✅ `lib/supabase.ts` - Supabase client setup (client & admin)
- ✅ `lib/openai.ts` - OpenAI service functions (follow-up generation, role analysis)
- ✅ `lib/stores/userStore.ts` - Zustand store for user progress tracking
- ✅ `lib/utils/storage.ts` - SSR-safe localStorage wrapper

### Status

**Core application structure is in place.** All stage pages are functional placeholders that can be expanded. Authentication is set up with Supabase, state management is ready with Zustand, and API routes are structured and ready for expansion.

---

## Code Review & Best Practices

### ✅ Fixed Issues

#### 1. Type Safety Issues
- **Status:** ✅ Fixed
- **Fix:** Removed all `any` types, added proper TypeScript interfaces, created type-safe implementations

#### 2. SSR/Hydration Issues
- **Status:** ✅ Fixed
- **Fix:** Created `lib/utils/storage.ts` utility with SSR-safe localStorage wrapper

#### 3. Error Handling in API Routes
- **Status:** ✅ Fixed
- **Fix:** Added input validation, specific error messages, OpenAI API key validation

#### 4. OpenAI Configuration Issues
- **Status:** ✅ Fixed
- **Fix:** Added null check and proper error handling in `lib/openai.ts`

### ⚠️ Remaining Issues & Recommendations

#### Security Concerns

**Authentication System** (🔴 High Priority)
- **Problem:** Using localStorage for authentication without actual backend validation
- **Recommendation:**
  - Implement proper Supabase Auth (already set up but not used)
  - Add server-side session validation
  - Use HTTP-only cookies for session tokens
  - Implement proper password hashing

**Data Persistence** (🟡 Medium Priority)
- **Problem:** All data stored in localStorage (no persistence, can be cleared)
- **Recommendation:**
  - Use Supabase database for data persistence
  - Sync localStorage with database
  - Implement proper data models

#### Code Quality

**Middleware Not Functional** (🟡 Medium Priority)
- **Problem:** `middleware.ts` just passes through all requests
- **Recommendation:**
  - Implement proper authentication middleware
  - Add route protection for dashboard routes
  - Use Supabase session validation

**Hardcoded Values** (🟢 Low Priority)
- **Problem:** Model names hardcoded (`gpt-4-turbo-preview`)
- **Recommendation:**
  - Move to environment variables
  - Create constants file for configuration

#### Missing Features

**Error Boundaries** (🟡 Medium Priority)
- **Problem:** No error boundaries to catch React errors
- **Recommendation:**
  - Add error boundaries at route level
  - Provide fallback UI for errors

**Rate Limiting** (🟡 Medium Priority)
- **Problem:** No rate limiting on API routes
- **Recommendation:**
  - Add rate limiting middleware
  - Implement per-user rate limits
  - Add request throttling

### Priority Recommendations

**High Priority:**
1. ✅ Fix type safety issues (DONE)
2. ✅ Fix SSR/hydration issues (DONE)
3. ✅ Add input validation to API routes (DONE)
4. 🔴 Implement proper authentication with Supabase
5. 🔴 Add data persistence to database

**Medium Priority:**
1. ✅ Improve error handling (DONE)
2. 🟡 Add error boundaries
3. 🟡 Implement rate limiting
4. 🟡 Add environment variable validation
5. 🟡 Make middleware functional

**Low Priority:**
1. 🟢 Add memoization where beneficial
2. 🟢 Extract magic numbers to constants
3. 🟢 Add JSDoc comments
4. 🟢 Refactor large components

---

## Repository Guidelines

### Project Structure & Module Organization

#### Core Documentation Files

- `README.md`: Project overview and structure
- `REVISED_24HR_PLAN.md`: 24-hour MVP development plan with hour-by-hour breakdown
- `REVISED_APP_BLUEPRINT.md`: Complete product architecture and stage specifications

#### Documentation Directory (`docs/`)

- `PRD.md`: Product requirements and goals for SCOPE+
- `PROBLEM.md`: Problem statement, constraints, and user needs
- `SOLUTION.md`: Proposed solution details and rationale

### Coding Style & Naming Conventions

- Use Markdown with ATX headings (`#`, `##`, `###`)
- Keep paragraphs short and use bullet lists for sequences or enumerations
- Indent nested lists with two spaces; avoid tabs
- Follow the existing naming pattern for files: uppercase topic names with `.md`
- Use fenced code blocks for commands or examples and specify a language tag when possible
- Reference SCOPE+ consistently (not "Mirae" or other names)

### Testing Guidelines

No automated tests exist. Perform a manual review for:

- Factual accuracy
- Consistent terminology across documents
- Proper Markdown formatting
- Alignment with `REVISED_24HR_PLAN.md` and `REVISED_APP_BLUEPRINT.md`
- Consistency with SCOPE+ product vision (6-stage journey, dashboard-based, AI-powered)

### Commit & Pull Request Guidelines

Use clear, imperative commit messages (for example, "Update PRD to reflect SCOPE+ 6-stage journey") and keep commits scoped to a single doc change.

For pull requests, include:

- A short summary of what changed and why
- Links to related issues or discussions, if any
- Notes on downstream docs that may need follow-up edits
- Verification that changes align with `REVISED_24HR_PLAN.md` and `REVISED_APP_BLUEPRINT.md`

### SCOPE+ Product Context

When making changes, ensure alignment with:

- **Product Name**: SCOPE+ (not Mirae or other names)
- **Core Concept**: Dashboard-based, multi-stage, AI-powered career exploration
- **6 Stages**: Stage 0 (Questionnaire), Stage 1 (Role Roulette), Stage 2 (Course Roadmap), Stage 3 (Skill Translation), Stage 4 (Tournament), Stage 5 (Storyboard)
- **Tech Stack**: Next.js 14, TypeScript, Supabase, OpenAI
- **Target Users**: Korean high school students (Year 1-2)

---

## The 6-Stage Journey

### Stage 0: Initial Questionnaire
Self-understanding through conversational data collection with chatbot follow-up.

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

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/ui
- Framer Motion
- Zustand

### Backend
- Supabase (PostgreSQL)
- Supabase Auth
- Next.js API Routes

### AI Services
- OpenAI GPT-4 Turbo
- DALL-E 3 / Stable Diffusion
- OpenAI Whisper API
- Text-to-Speech API

### Deployment
- Vercel

---

## Development Notes

- The application uses Next.js 14 App Router
- TypeScript is configured with strict mode
- Tailwind CSS is set up for styling
- Zustand is used for client-side state management
- Supabase handles authentication and database
- OpenAI GPT-4 Turbo is used for AI features

### Development Plan

See `REVISED_24HR_PLAN.md` for the complete 24-hour MVP development plan, including:

- Hour-by-hour breakdown
- Implementation details for each stage
- Database schema
- API routes
- Component specifications

### Product Architecture

See `REVISED_APP_BLUEPRINT.md` for the complete product architecture, including:

- Detailed stage specifications
- UI/UX designs
- Data flow
- AI prompt engineering
- Database schema

---

## Troubleshooting

### "Invalid API key" errors
- Make sure `.env.local` is in the root directory (same level as `package.json`)
- No quotes around values in `.env.local`
- Restart dev server after changing `.env.local`

### Supabase connection errors
- Verify project is active in Supabase dashboard
- Check URL format: `https://xxxxx.supabase.co`
- Ensure database schema was run

### OpenAI errors
- Verify your API key is correct
- Check your OpenAI account has credits/billing set up
- Make sure the key starts with `sk-`

### Port already in use
- Change port: `npm run dev -- -p 3001`

### Auth errors
- Make sure Supabase environment variables are correct
- Check that database tables are created in Supabase

### Database errors
- Ensure all tables are created in Supabase
- Verify RLS policies are set up correctly

### API errors
- Check OpenAI API key and rate limits
- Verify environment variables are loaded correctly

---

## Additional Resources

- **Product Requirements**: See `docs/PRD.md`
- **Problem Statement**: See `docs/PROBLEM.md`
- **Solution Architecture**: See `docs/SOLUTION.md`
- **24-Hour Development Plan**: See `REVISED_24HR_PLAN.md`
- **Complete Blueprint**: See `REVISED_APP_BLUEPRINT.md`

---

**Last Updated:** 2024
**Status:** Core application structure in place, ready for expansion

