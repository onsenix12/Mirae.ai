# SCOPE+ Revised 24-Hour Development Plan
**Dashboard-Based, Multi-Stage, AI-Powered Career Exploration Platform**

---

## Sprint Goal

Build a **working MVP** with:
- ✅ Authentication & persistent dashboard
- ✅ Stage 0: Initial questionnaire (chatbot)
- ✅ Stage 1: Role Roulette (swipe interface)
- ✅ Stage 2: Course roadmap builder with AI suggestions
- ✅ Stage 3: Basic chatbot skill conversation
- ✅ Stage 4: Tournament bracket (simplified)
- ✅ Stage 5: Text-based storyboard (no AI images for MVP)
- ✅ Final dashboard with recommendations

**MVP Success Criteria:**
- One complete user journey start-to-finish
- Data persistence across stages
- AI chatbot functional in at least 2 stages
- Demo-ready presentation flow

---

## Pre-Sprint Setup (Hour -1 to 0)

### Environment Setup

```bash
# Initialize Next.js project
npx create-next-app@latest scope-plus --typescript --tailwind --app
cd scope-plus

# Install dependencies
npm install zustand
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install openai
npm install framer-motion
npm install lucide-react
npm install react-hook-form zod @hookform/resolvers
npm install sonner # toast notifications
npm install recharts # data visualization

# Dev dependencies
npm install -D @types/node
```

### Supabase Setup

1. Create Supabase project at supabase.com
2. Run database migrations (see schema in blueprint)
3. Enable Auth providers
4. Get API keys

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
```

### Project Structure

```
app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (dashboard)/
│   ├── dashboard/
│   ├── stage0/
│   ├── stage1/
│   ├── stage2/
│   ├── stage3/
│   ├── stage4/
│   └── stage5/
├── api/
│   ├── chat/
│   ├── analyze/
│   └── generate/
├── layout.tsx
└── page.tsx

components/
├── ui/
├── dashboard/
├── stages/
└── shared/

lib/
├── supabase.ts
├── openai.ts
├── stores/
└── utils/
```

---

## Hour-by-Hour Breakdown

---

## **HOUR 0-2: Core Infrastructure & Auth**

### Hour 0-1: Next.js Setup + Supabase Auth

**Tasks:**

**1. Supabase Client Setup (15 min)**

```typescript
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClientComponentClient();

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**2. Auth Pages (30 min)**

```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">SCOPE+</h1>
        <p className="text-gray-600 text-center mb-8">
          진로 탐색 여정을 시작하세요
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          계정이 없나요?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
```

**Similar structure for `/signup`**

**3. Auth Middleware (15 min)**

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect logged-in users from auth pages
  if ((req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/stage0/:path*', '/stage1/:path*', '/stage2/:path*', '/stage3/:path*', '/stage4/:path*', '/stage5/:path*'],
};
```

---

### Hour 1-2: Dashboard Hub + Progress Tracking

**1. User Store (20 min)**

```typescript
// lib/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProgress {
  stage0Complete: boolean;
  stage1Complete: boolean;
  stage2Complete: boolean;
  stage3Complete: boolean;
  stage4Complete: boolean;
  stage5Complete: boolean;
  currentStage: number;
}

interface UserStore {
  userId: string | null;
  progress: UserProgress;
  setUserId: (id: string) => void;
  completeStage: (stage: number) => void;
  setCurrentStage: (stage: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userId: null,
      progress: {
        stage0Complete: false,
        stage1Complete: false,
        stage2Complete: false,
        stage3Complete: false,
        stage4Complete: false,
        stage5Complete: false,
        currentStage: 0,
      },

      setUserId: (id) => set({ userId: id }),

      completeStage: (stage) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [`stage${stage}Complete`]: true,
            currentStage: Math.max(state.progress.currentStage, stage + 1),
          },
        })),

      setCurrentStage: (stage) =>
        set((state) => ({
          progress: { ...state.progress, currentStage: stage },
        })),
    }),
    { name: 'scope-user' }
  )
);
```

**2. Dashboard Page (40 min)**

```typescript
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/lib/stores/userStore';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, Circle } from 'lucide-react';

const stages = [
  { id: 0, name: '자기이해', path: '/stage0', description: '당신에 대해 알아가기' },
  { id: 1, name: 'Role Roulette', path: '/stage1', description: '역할 탐색하기' },
  { id: 2, name: '코스 로드맵', path: '/stage2', description: '과목 설계하기' },
  { id: 3, name: '스킬 번역', path: '/stage3', description: '성장 여정 그리기' },
  { id: 4, name: '토너먼트', path: '/stage4', description: '전문화 좁히기' },
  { id: 5, name: '스토리보드', path: '/stage5', description: '미래 시각화하기' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { progress, userId, setUserId } = useUserStore();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserName(user.email?.split('@')[0] || '학생');
      }
    };
    loadUser();
  }, [setUserId]);

  const getStageStatus = (stageId: number) => {
    if (progress[`stage${stageId}Complete`]) return 'complete';
    if (stageId === progress.currentStage) return 'current';
    if (stageId < progress.currentStage) return 'available';
    return 'locked';
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'current':
        return <Circle className="w-6 h-6 text-blue-600 fill-blue-600" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const totalProgress = Object.values(progress).filter(v => v === true).length / 6 * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            안녕, {userName}! 👋
          </h1>
          <p className="text-gray-600 mb-6">
            당신은 지금 Stage {progress.currentStage}에 있어요
          </p>

          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{Math.round(totalProgress)}% 완료</p>
        </div>

        {/* Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stages.map((stage) => {
            const status = getStageStatus(stage.id);
            const isAccessible = status !== 'locked';

            return (
              <div
                key={stage.id}
                onClick={() => isAccessible && router.push(stage.path)}
                className={`
                  bg-white rounded-xl shadow-lg p-6 transition-all
                  ${isAccessible ? 'cursor-pointer hover:shadow-2xl hover:scale-105' : 'opacity-60 cursor-not-allowed'}
                  ${status === 'current' ? 'ring-4 ring-blue-400' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{stage.name}</h3>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                  {getStageIcon(status)}
                </div>

                {status === 'current' && (
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                    시작하기 →
                  </button>
                )}

                {status === 'complete' && (
                  <p className="text-sm text-green-600 font-medium">✓ 완료됨</p>
                )}

                {status === 'locked' && (
                  <p className="text-sm text-gray-400">🔒 이전 단계를 먼저 완료하세요</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## **HOUR 2-5: Stage 0 (Initial Questionnaire)**

### Hour 2-3: Questionnaire UI

**1. Question Data (15 min)**

```typescript
// lib/data/stage0Questions.ts
export const questions = [
  {
    id: 'q1',
    question: '당신은 어떤 것들을 잘하나요?',
    type: 'multi-select',
    options: [
      { id: 'analytical', label: '분석적 사고', emoji: '🧠' },
      { id: 'creative', label: '창의적 표현', emoji: '🎨' },
      { id: 'empathy', label: '공감 능력', emoji: '❤️' },
      { id: 'organization', label: '체계적 정리', emoji: '📋' },
      { id: 'communication', label: '의사소통', emoji: '💬' },
      { id: 'problem-solving', label: '문제 해결', emoji: '🧩' },
    ],
  },
  {
    id: 'q2',
    question: '어떻게 배우는 것을 선호하나요?',
    type: 'single-select',
    options: [
      { id: 'visual', label: '시각적으로 (그림, 다이어그램)' },
      { id: 'auditory', label: '청각적으로 (강의, 토론)' },
      { id: 'kinesthetic', label: '실습하면서 (프로젝트, 실험)' },
    ],
  },
  {
    id: 'q3',
    question: '지금 무엇에 관심이 있나요?',
    type: 'multi-select',
    options: [
      { id: 'technology', label: '기술/IT', emoji: '💻' },
      { id: 'arts', label: '예술/디자인', emoji: '🎨' },
      { id: 'science', label: '과학/연구', emoji: '🔬' },
      { id: 'social', label: '사회/정책', emoji: '🏛️' },
      { id: 'business', label: '비즈니스/경영', emoji: '📈' },
      { id: 'health', label: '건강/의료', emoji: '🏥' },
    ],
  },
  {
    id: 'q4',
    question: '진로를 생각할 때 가장 걱정되는 것은?',
    type: 'multi-select',
    options: [
      { id: 'family', label: '가족을 실망시킬까 봐' },
      { id: 'wrong-choice', label: '잘못된 선택을 할까 봐' },
      { id: 'competition', label: '경쟁에서 뒤처질까 봐' },
      { id: 'uncertainty', label: '결정을 못 내리는 것 자체가 두려워' },
    ],
  },
  {
    id: 'q5',
    question: '보통 결정을 어떻게 내리나요?',
    type: 'single-select',
    options: [
      { id: 'deliberate', label: '신중하게 오래 고민해요' },
      { id: 'intuitive', label: '직관을 따라요' },
      { id: 'research', label: '철저히 조사해요' },
      { id: 'others', label: '다른 사람에게 조언을 구해요' },
    ],
  },
];
```

**2. Questionnaire Page (45 min)**

```typescript
// app/(dashboard)/stage0/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/userStore';
import { supabase } from '@/lib/supabase';
import { questions } from '@/lib/data/stage0Questions';

export default function Stage0Page() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const router = useRouter();
  const { userId, completeStage } = useUserStore();

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const handleSelect = (optionId: string) => {
    const qId = question.id;

    if (question.type === 'single-select') {
      setAnswers({ ...answers, [qId]: [optionId] });
    } else {
      const current = answers[qId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [qId]: updated });
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    // Extract data from answers
    const strengths = answers['q1'] || [];
    const learningStyle = answers['q2']?.[0] || '';
    const interests = answers['q3'] || [];
    const fears = answers['q4'] || [];
    const decisionStyle = answers['q5']?.[0] || '';

    // Save to database
    await supabase.from('user_profiles').insert({
      user_id: userId,
      strengths,
      learning_style: learningStyle,
      interests,
      fears,
      decision_style: decisionStyle,
      uncertainty_tolerance: 'medium', // default
      completed_at: new Date().toISOString(),
    });

    completeStage(0);
    router.push('/dashboard');
  };

  const canProceed = answers[question.id]?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              질문 {currentQ + 1} / {questions.length}
            </p>
            <p className="text-sm text-gray-600">{Math.round(progress)}%</p>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = answers[question.id]?.includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`
                    w-full p-4 rounded-xl border-2 transition-all text-left
                    ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {option.emoji && <span className="text-2xl">{option.emoji}</span>}
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 disabled:opacity-50"
          >
            ← 이전
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium disabled:opacity-50 hover:bg-purple-700 transition"
          >
            {currentQ === questions.length - 1 ? '완료' : '다음 →'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

### Hour 3-4: Chatbot Follow-up Questions

**1. OpenAI Service (20 min)**

```typescript
// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFollowUp(
  questionContext: string,
  userAnswer: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a supportive career exploration guide for Korean high school students.

Ask 1-2 clarifying follow-up questions based on their answer.
Keep questions open-ended and non-judgmental.
Use conversational Korean (반말).
DO NOT give advice or recommendations.`,
      },
      {
        role: 'user',
        content: `Question: ${questionContext}\nStudent answered: ${userAnswer}\n\nAsk a thoughtful follow-up question.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 150,
  });

  return response.choices[0].message.content || '';
}
```

**2. API Route (15 min)**

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateFollowUp } from '@/lib/openai';

export async function POST(req: NextRequest) {
  const { questionContext, userAnswer } = await req.json();

  try {
    const followUp = await generateFollowUp(questionContext, userAnswer);
    return NextResponse.json({ followUp });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate follow-up' }, { status: 500 });
  }
}
```

**3. Chatbot Component (25 min)**

```typescript
// components/stages/ChatbotFollowUp.tsx
'use client';

import { useState } from 'react';

interface ChatbotFollowUpProps {
  questionContext: string;
  userAnswer: string;
  onComplete: (insights: string) => void;
}

export default function ChatbotFollowUp({
  questionContext,
  userAnswer,
  onComplete,
}: ChatbotFollowUpProps) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionContext, userAnswer: input }),
    });

    const { followUp } = await response.json();

    setMessages((prev) => [...prev, { role: 'assistant', content: followUp }]);
    setLoading(false);
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6 space-y-4">
      <h3 className="font-bold">💬 조금 더 이야기해볼까요?</h3>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] p-3 rounded-lg
                ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-white'}
              `}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="당신의 생각을 자유롭게..."
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          전송
        </button>
      </div>

      <button
        onClick={() => onComplete(messages.map((m) => m.content).join('\n'))}
        className="w-full py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition"
      >
        대화 마치기
      </button>
    </div>
  );
}
```

---

## **HOUR 5-9: Stage 1 (Role Roulette)**

### Hour 5-6: Swipe UI

**1. Role Data (20 min)**

```typescript
// lib/data/roles.ts
export const roles = [
  {
    id: 'ux-designer',
    title: 'UX 디자이너',
    tagline: '사람들이 사랑하는 제품을 만들어요',
    domain: 'creative',
    imageUrl: '/roles/ux-designer.jpg',
    description: '사용자의 경험을 연구하고 디자인해요',
    skills: ['창의성', '공감', '프로토타이핑'],
    relatedFields: ['제품 디자인', 'HCI 연구'],
  },
  // ... 49 more roles
];
```

**2. Swipe Component (40 min)**

```typescript
// components/stages/RoleCard.tsx
'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';

interface RoleCardProps {
  role: any;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
}

export default function RoleCard({ role, onSwipe }: RoleCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    } else if (info.offset.y < -100) {
      onSwipe('up');
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className="absolute w-full h-[500px]"
    >
      <div
        onClick={() => setShowDetails(!showDetails)}
        className="bg-white rounded-3xl shadow-2xl p-8 h-full cursor-pointer"
      >
        {!showDetails ? (
          // Front
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full" />
            <h2 className="text-3xl font-bold text-center">{role.title}</h2>
            <p className="text-gray-600 text-center text-lg">{role.tagline}</p>
            <p className="text-sm text-gray-500">탭해서 자세히 보기</p>
          </div>
        ) : (
          // Back
          <div className="h-full overflow-y-auto space-y-4">
            <h2 className="text-2xl font-bold">{role.title}</h2>
            <p className="text-gray-700">{role.description}</p>

            <div>
              <h3 className="font-bold mb-2">사용하는 스킬:</h3>
              <div className="flex flex-wrap gap-2">
                {role.skills.map((skill: string) => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">관련 분야:</h3>
              <p className="text-gray-600 text-sm">{role.relatedFields.join(', ')}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

**3. Stage 1 Page (40 min - continuing into Hour 6)**

```typescript
// app/(dashboard)/stage1/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/userStore';
import { supabase } from '@/lib/supabase';
import { roles } from '@/lib/data/roles';
import RoleCard from '@/components/stages/RoleCard';
import { Heart, X, Star } from 'lucide-react';

export default function Stage1Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<any[]>([]);
  const router = useRouter();
  const { userId, completeStage } = useUserStore();

  const currentRole = roles[currentIndex];
  const progress = (currentIndex / roles.length) * 100;

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    const swipeData = {
      user_id: userId,
      role_id: currentRole.id,
      swipe_direction: direction,
      swipe_speed: Math.random() * 1000, // Mock for MVP
      card_tap_count: 0,
    };

    await supabase.from('role_swipes').insert(swipeData);
    setSwipes([...swipes, swipeData]);

    if (currentIndex < roles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeStage(1);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <p className="text-center text-gray-600 mb-2">
            {currentIndex + 1} / {roles.length}
          </p>
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-orange-600 h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative h-[500px] mb-8">
          {currentRole && <RoleCard role={currentRole} onSwipe={handleSwipe} />}
        </div>

        {/* Swipe Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
          >
            <X className="w-8 h-8 text-red-600" />
          </button>

          <button
            onClick={() => handleSwipe('up')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
          >
            <Star className="w-8 h-8 text-yellow-600" />
          </button>

          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
          >
            <Heart className="w-8 h-8 text-green-600" />
          </button>
        </div>

        <div className="text-center mt-6 space-y-2 text-sm text-gray-600">
          <p>← 별로 | ⭐ 좋아요! | 흥미로워 →</p>
        </div>
      </div>
    </div>
  );
}
```

---

### Hour 7-9: AI Analysis + Results

**1. Analysis API (30 min)**

```typescript
// app/api/analyze-roles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  // Get all swipes
  const { data: swipes } = await supabase
    .from('role_swipes')
    .select('*')
    .eq('user_id', userId);

  if (!swipes) return NextResponse.json({ error: 'No data' }, { status: 400 });

  // Analyze with AI
  const swipeSummary = swipes
    .map((s) => `${s.role_id}: ${s.swipe_direction}`)
    .join('\n');

  const analysis = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'Analyze role exploration patterns and identify interest clusters. Respond in Korean.',
      },
      {
        role: 'user',
        content: `Student swipe data:\n${swipeSummary}\n\nIdentify 2-3 interest clusters and surprising discoveries.`,
      },
    ],
  });

  const insights = analysis.choices[0].message.content;

  return NextResponse.json({ insights });
}
```

---

## **HOUR 9-13: Stage 2 (Course Roadmap Builder)**

### Hour 9-11: Drag-Drop Interface

```typescript
// app/(dashboard)/stage2/page.tsx
'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/userStore';

const subjects = [
  '수학', '영어', '한국사', '물리학', '화학', '생명과학',
  '경제', '정치와 법', '사회문화', '미술', '음악', '체육',
  '디자인 사고', '사회문제 탐구', '통계', '프로그래밍',
];

export default function Stage2Page() {
  const [available, setAvailable] = useState(subjects);
  const [anchor, setAnchor] = useState<string[]>([]);
  const [signal, setSignal] = useState<string[]>([]);
  const router = useRouter();
  const { completeStage } = useUserStore();

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    // Handle dragging logic between lists
    // ... (implementation details)
  };

  const handleSave = () => {
    // Save to database
    completeStage(2);
    router.push('/dashboard');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">과목 선택 설계</h1>

          <div className="grid grid-cols-3 gap-6">
            {/* Available subjects */}
            <Droppable droppableId="available">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white rounded-xl p-6"
                >
                  <h2 className="font-bold mb-4">과목 목록</h2>
                  {available.map((subject, idx) => (
                    <Draggable key={subject} draggableId={subject} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-100 p-3 rounded-lg mb-2"
                        >
                          {subject}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Anchor bucket */}
            <Droppable droppableId="anchor">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6"
                >
                  <h2 className="font-bold mb-4">⚓ 안전한 선택</h2>
                  {/* ... draggable items */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {/* Signal bucket */}
            <Droppable droppableId="signal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6"
                >
                  <h2 className="font-bold mb-4">🎯 탐색 신호</h2>
                  {/* ... draggable items */}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <button
            onClick={handleSave}
            className="mt-8 px-6 py-3 bg-green-600 text-white rounded-lg mx-auto block"
          >
            저장하기
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}
```

---

*Continues for Stages 3-5 with similar detailed implementations...*

---

## **HOUR 21-24: Integration, Testing & Demo Prep**

### Hour 21-22: End-to-End Testing

- Test full user flow
- Fix critical bugs
- Data persistence verification
- Mobile responsiveness check

### Hour 22-23: Demo Script & Polish

**Demo Narrative (5 minutes):**

1. **Login** (30s): Show authentication
2. **Dashboard** (30s): Overview of 6 stages
3. **Stage 0** (45s): Quick questionnaire walkthrough
4. **Stage 1** (60s): Swipe through 5-6 roles, show reactions
5. **Stage 2** (45s): Drag subjects to buckets
6. **Stage 3** (30s): Brief chatbot conversation
7. **Final Dashboard** (30s): Show completed journey, recommendations

### Hour 23-24: Deployment & Presentation

```bash
# Deploy to Vercel
vercel --prod

# Prepare backup demo video
# Create presentation slides
# Rehearse pitch 3x
```

---

## Emergency Fallbacks

**If Behind Schedule:**

**Priority 1 (Must Have):**
- Auth + Dashboard
- Stage 0 (Questionnaire)
- Stage 1 (Role Roulette)
- Basic AI chatbot in one stage

**Priority 2 (Nice to Have):**
- Stage 2 (Course Builder)
- Stage 3 (Skill conversation)

**Priority 3 (Skip if Needed):**
- Stage 4 (Tournament)
- Stage 5 (Storyboard)

**Minimum Viable Demo:**
Stages 0-1 + Dashboard showing progression = Proof of concept

---

## Success Metrics

✅ One student can complete signup → Stage 0 → Stage 1 → Dashboard
✅ Data persists across page refreshes
✅ AI chatbot responds meaningfully in at least 1 stage
✅ Demo runs smoothly without crashes
✅ Presentation tells compelling story

---

**End of Revised 24-Hour Plan**
