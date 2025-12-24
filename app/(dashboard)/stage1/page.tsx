'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/userStore';
import { useI18n } from '@/lib/i18n';
import { ThumbsDown, Star, Heart } from 'lucide-react';

// Placeholder roles - will be expanded to 50
const roles = [
  {
    id: 'ux-designer',
    title: { ko: 'UX 디자이너', en: 'UX Designer' },
    tagline: { ko: '사람들이 사랑하는 제품을 만들어요', en: 'Build products people love' },
    domain: 'creative',
  },
  {
    id: 'data-scientist',
    title: { ko: '데이터 사이언티스트', en: 'Data Scientist' },
    tagline: { ko: '데이터로 세상을 이해해요', en: 'Understand the world through data' },
    domain: 'analytical',
  },
];

export default function Stage1Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { userId, completeStage } = useUserStore();
  const { language, t } = useI18n();

  const currentRole = roles[currentIndex];
  const progress = (currentIndex / roles.length) * 100;

  const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
    const swipeData = {
      user_id: userId,
      role_id: currentRole.id,
      swipe_direction: direction,
      swipe_speed: 0,
      card_tap_count: 0,
    };

    // Store swipe data in localStorage
    const existingSwipes = JSON.parse(localStorage.getItem(`user_${userId}_swipes`) || '[]');
    localStorage.setItem(`user_${userId}_swipes`, JSON.stringify([...existingSwipes, swipeData]));

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
        <div className="mb-8">
          <p className="text-center text-gray-600 mb-2">
            {currentIndex + 1} / {roles.length}
          </p>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {currentRole && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 h-[500px] flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mb-6" />
            <h2 className="text-3xl font-bold text-center mb-4">
              {currentRole.title[language]}
            </h2>
            <p className="text-gray-600 text-center text-lg">
              {currentRole.tagline[language]}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
          >
            <ThumbsDown className="w-7 h-7 text-slate-500" />
          </button>

          <button
            onClick={() => handleSwipe('up')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
          >
            <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
          </button>

          <button
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
          >
            <Heart className="w-7 h-7 text-red-500 fill-red-500" />
          </button>
        </div>

        <div className="text-center mt-6 space-y-2 text-sm text-gray-600">
          <p>{t('stage1Hint')}</p>
        </div>
      </div>
    </div>
  );
}
