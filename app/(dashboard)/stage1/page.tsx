'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/userStore';
import { storage } from '@/lib/utils/storage';

// Placeholder roles - will be expanded to 50
const roles = [
  {
    id: 'ux-designer',
    title: 'UX Designer',
    tagline: 'Designs calm, human-centered product experiences.',
    domain: 'creative',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    tagline: 'Finds patterns and stories inside complex data.',
    domain: 'analytical',
  },
];

export default function Stage1Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { userId, completeStage } = useUserStore();

  const currentRole = roles[currentIndex];
  const progress = (currentIndex / roles.length) * 100;

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const swipeData = {
      userId,
      roleId: currentRole.id,
      swipeDirection: direction,
      swipeSpeed: 0,
      cardTapCount: 0,
    };

    // Store swipes in localStorage
    const existingSwipes = storage.get<typeof swipeData[]>('roleSwipes', []) || [];
    existingSwipes.push(swipeData);
    storage.set('roleSwipes', existingSwipes);

    if (currentIndex < roles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeStage(1);
      router.push('/dashboard');
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden px-6 py-10 sm:px-10"
      style={{
        background:
          'linear-gradient(135deg, #9BCBFF 0%, #C7B9FF 25%, #F4A9C8 50%, #FFD1A8 75%, #BEEDE3 100%)',
      }}
    >
      <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-white/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-16 h-40 w-40 rounded-full bg-white/30 blur-2xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 lg:grid lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="space-y-6 text-slate-800">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
            Stage 1
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            Role Roulette
          </div>

          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Explore roles with calm, curious swipes.
            </h1>
            <p className="mt-3 max-w-md text-sm text-slate-600 sm:text-base">
              Follow your gut. You are not choosing a future yet, just noticing what feels
              interesting.
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>
                {currentIndex + 1} / {roles.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-rose-300 to-amber-200 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1">
              Swipe left to pass
            </span>
            <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1">
              Swipe up to save for later
            </span>
            <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1">
              Swipe right to like
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {currentRole && (
            <div className="relative">
              <div
                className="absolute -inset-3 rounded-[36px] bg-white/30 blur-xl"
                style={{ animation: 'float 10s ease-in-out infinite' }}
              />
              <div
                className="relative flex min-h-[460px] flex-col items-center justify-between rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur"
                style={{ animation: 'float 8s ease-in-out infinite' }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="h-28 w-28 rounded-full bg-gradient-to-br from-sky-200 via-violet-200 to-rose-200 shadow-inner"
                    style={{ animation: 'float 6s ease-in-out infinite' }}
                  />
                  <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    {currentRole.domain}
                  </span>
                </div>

                <div className="space-y-3 text-center">
                  <h2 className="text-3xl font-semibold text-slate-800">{currentRole.title}</h2>
                  <p className="text-sm text-slate-600 sm:text-base">{currentRole.tagline}</p>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-rose-100/70" />
                  <div className="h-10 w-10 rounded-full bg-amber-100/70" />
                  <div className="h-10 w-10 rounded-full bg-emerald-100/70" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleSwipe('left')}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/80 text-rose-500 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white"
              aria-label="Pass"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSwipe('up')}
              className="group flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/90 text-amber-500 shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white"
              aria-label="Save for later"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l2.2 4.6 5 .7-3.6 3.5.9 5L12 14.6 7.5 16.8l.9-5L4.8 8.3l5-.7L12 3z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleSwipe('right')}
              className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/80 text-emerald-500 shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white"
              aria-label="Like"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.8 4.6c-1.5-1.5-3.9-1.5-5.4 0L12 8l-3.4-3.4c-1.5-1.5-3.9-1.5-5.4 0-1.5 1.5-1.5 3.9 0 5.4L12 20l8.8-10c1.5-1.5 1.5-3.9 0-5.4z" />
              </svg>
            </button>
          </div>

          <p className="text-center text-xs text-slate-600">
            Tap the buttons or swipe on the card to keep exploring.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
