'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { useUserStore } from '@/lib/stores/userStore';
import { useI18n } from '@/lib/i18n';
import Image from 'next/image';
import { Paperclip, Sprout } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
  options?: string[];
}

const initialMessages: Message[] = [
  {
    role: 'bot',
    text: 'onboardingGreeting',
  },
  {
    role: 'bot',
    text: 'onboardingIntro',
  },
  {
    role: 'bot',
    text: 'onboardingQuestion1',
    options: ['onboardingAnswerProblem', 'onboardingAnswerHelping', 'onboardingAnswerCreating', 'onboardingAnswerUnsure'],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserId } = useUserStore();
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [uploads, setUploads] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>(['Curious explorer', 'Empathy-driven', 'Visual thinker']);
  const [userName, setUserName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const onboardingDoneKey = (userId: string) => `user_${userId}_onboardingDone`;

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserId(user.id);
    setUserName(user.name || user.email?.split('@')[0] || 'Student');
    if (typeof window !== 'undefined') {
      // Allow ?reset=true to view onboarding again
      const urlParams = new URLSearchParams(window.location.search);
      const reset = urlParams.get('reset');
      if (reset === 'true') {
        localStorage.removeItem(onboardingDoneKey(user.id));
        return;
      }
      const done = localStorage.getItem(onboardingDoneKey(user.id));
      if (done === 'true') {
        router.push('/dashboard');
      }
    }
  }, [router, setUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const appendMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleOptionClick = (optionKey: string) => {
    appendMessage({ role: 'user', text: optionKey });
    appendMessage({
      role: 'bot',
      text: 'onboardingFollowUp',
    });
    const keyword = optionKey === 'onboardingAnswerProblem'
      ? 'Analytical'
      : optionKey === 'onboardingAnswerHelping'
        ? 'People-first'
        : optionKey === 'onboardingAnswerCreating'
          ? 'Maker mindset'
          : 'Open to explore';
    setKeywords((prev) => Array.from(new Set([...prev, keyword])));
  };

  const handleSend = () => {
    if (!input.trim()) return;
    appendMessage({ role: 'user', text: input.trim() });
    setInput('');
    appendMessage({ role: 'bot', text: 'onboardingThanks' });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const names = files.map((f) => f.name);
    setUploads((prev) => [...prev, ...names]);
    appendMessage({ role: 'bot', text: 'onboardingUploadConfirm' });
  };

  const handleFinish = () => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    localStorage.setItem(onboardingDoneKey(user.id), 'true');
    router.push('/dashboard');
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords((prev) => prev.filter((keyword) => keyword !== keywordToRemove));
  };

  return (
    <div className="fixed inset-0 onboarding-bg overflow-hidden">
      <div className="h-full w-full py-12 px-4 sm:px-8 pt-24 overflow-auto">
        <div
          className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[2fr_1fr] grid-rows-1 pr-4 lg:pr-8 h-full min-h-0"
          style={{ height: 'calc(100vh - 12rem)' }}
        >
          <div
            className="glass-card rounded-3xl p-6 sm:p-8 relative flex flex-col h-full min-h-0"
          >
            <div className="absolute inset-0 pointer-events-none soft-glow" />
            <div className="relative flex-shrink-0 mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-600">{t('onboardingTag')}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                {t('onboardingTitle', { name: userName })} <Sprout className="w-6 h-6 text-green-500" />
              </h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">{t('onboardingSubtitle')}</p>
            </div>
          </div>

          <div className="relative flex-1 min-h-0 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={[
                  'flex',
                  message.role === 'bot' ? 'justify-start' : 'justify-end',
                ].join(' ')}
              >
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-md',
                    message.role === 'bot'
                      ? 'bg-white/95 border-2 border-[#9BCBFF]/40 text-slate-800 rounded-tl-sm'
                      : 'bg-gradient-to-br from-[#E5E0FF] to-[#F4E4FF] border-2 border-[#C7B9FF]/60 text-slate-800 rounded-tr-sm',
                  ].join(' ')}
                >
                  {message.role === 'bot' && (
                    <p className="text-xs font-semibold text-[#9BCBFF] mb-1">Mirae</p>
                  )}
                  <p className="text-sm sm:text-base leading-relaxed">{t(message.text)}</p>
                  {message.options && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.options.map((optionKey) => (
                        <button
                          key={optionKey}
                          onClick={() => handleOptionClick(optionKey)}
                          className="rounded-full px-4 py-2 text-sm bg-gradient-to-r from-[#E5E0FF] to-[#F4E4FF] text-slate-800 font-medium shadow-md hover:-translate-y-0.5 hover:from-[#D4CEFF] hover:to-[#E8D4FF] transition-all"
                        >
                          {t(optionKey)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="relative flex-shrink-0 space-y-3">
            {uploads.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {uploads.map((file) => (
                  <span key={file} className="px-3 py-2 rounded-full bg-white/90 border border-white/70 text-xs text-slate-700 shadow-sm flex items-center gap-2">
                    <Paperclip className="w-3 h-3" />
                    {file}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-white/50 transition"
                  title={t('onboardingUploadCta')}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('onboardingPlaceholder')}
                  className="w-full rounded-full pl-14 pr-4 py-3 bg-white/95 border-2 border-slate-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C7B9FF] focus:border-[#C7B9FF] shadow-sm"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleUpload}
                />
              </div>
              <button
                onClick={handleSend}
                className="soft-button px-6 py-3 rounded-full text-sm sm:text-base font-semibold"
              >
                {t('stage3Send')}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 h-full min-h-0">
          <div className="glass-card rounded-3xl p-5 shadow-lg border border-white/60">
            <p className="text-sm font-semibold text-slate-700 mb-2">{t('onboardingKeywords', { name: userName })}</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((word) => (
                <span
                  key={word}
                  className="px-3 py-2 rounded-full text-sm bg-white/90 border border-white/70 text-slate-800 shadow-sm flex items-center gap-2 group hover:bg-white transition"
                >
                  {word}
                  <button
                    onClick={() => removeKeyword(word)}
                    className="text-slate-400 hover:text-slate-700 transition"
                    aria-label={`Remove ${word}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 shadow-lg border border-white/60 space-y-3">
            <p className="text-sm font-semibold text-slate-700">{t('onboardingNextSteps')}</p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• {t('onboardingNextStep1')}</li>
              <li>• {t('onboardingNextStep2')}</li>
              <li>• {t('onboardingNextStep3')}</li>
            </ul>
            <button
              onClick={handleFinish}
              className="soft-button w-full py-3 rounded-full font-semibold"
            >
              {t('onboardingFinish')}
            </button>
          </div>

          <div className="flex justify-end">
            <Image
              src="/asset/Mirae_Icon1.png"
              alt="Mirae Icon"
              width={600}
              height={600}
              className="object-contain"
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
