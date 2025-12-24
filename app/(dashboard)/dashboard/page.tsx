'use client';

import { useEffect, useMemo, useState } from 'react';
import { getUser, signOut } from '@/lib/auth';
import { useUserStore } from '@/lib/stores/userStore';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, Circle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { storage } from '@/lib/utils/storage';
import rolesData from '@/lib/data/roles.json';

type RoleLocale = { en: string; ko: string };
type RoleListLocale = { en: string[]; ko: string[] };

interface RoleData {
  id: string;
  title: RoleLocale;
  tagline: RoleLocale;
  domain: RoleLocale;
  roleModels: RoleListLocale;
  companies: RoleListLocale;
  details: RoleLocale;
  resources: RoleListLocale;
}

interface RoleSwipe {
  roleId: string;
  swipeDirection: 'left' | 'right' | 'up';
}

const roles = rolesData as RoleData[];

const stages = [
  { id: 0, nameKey: 'stage0Name', descriptionKey: 'stage0Description', path: '/stage0' },
  { id: 1, nameKey: 'stage1Name', descriptionKey: 'stage1Description', path: '/stage1' },
  { id: 2, nameKey: 'stage2Name', descriptionKey: 'stage2Description', path: '/stage2' },
  { id: 3, nameKey: 'stage3Name', descriptionKey: 'stage3Description', path: '/stage3' },
  { id: 4, nameKey: 'stage4Name', descriptionKey: 'stage4Description', path: '/stage4' },
  { id: 5, nameKey: 'stage5Name', descriptionKey: 'stage5Description', path: '/stage5' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { progress, userId, setUserId, reset } = useUserStore();
  const [userName, setUserName] = useState('');
  const [likedRoleIds, setLikedRoleIds] = useState<string[]>([]);
  const { t, language } = useI18n();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    if (userId !== user.id) {
      setUserId(user.id);
    }

    const displayName = user.name || user.email?.split('@')[0] || t('studentFallback');
    setUserName(displayName);

    if (typeof window !== 'undefined') {
      const onboardingKey = `user_${user.id}_onboardingDone`;
      if (localStorage.getItem(onboardingKey) !== 'true') {
        router.push('/onboarding');
      }
    }
  }, [router, setUserId, t, userId]);

  useEffect(() => {
    const swipes = storage.get<RoleSwipe[]>('roleSwipes', []) ?? [];
    const liked = swipes
      .filter((swipe) => swipe.swipeDirection === 'right')
      .map((swipe) => swipe.roleId);
    setLikedRoleIds(Array.from(new Set(liked)));
  }, []);

  const handleSignOut = () => {
    signOut();
    reset();
    router.push('/login');
    router.refresh();
  };

  const getStageStatus = (stageId: number) => {
    if (progress[`stage${stageId}Complete` as keyof typeof progress]) return 'complete';
    if (stageId === progress.currentStage) return 'current';
    if (stageId < progress.currentStage) return 'available';
    return 'locked';
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-[#73c8a9]" />;
      case 'current':
        return <Circle className="w-6 h-6 text-[#9BCBFF] fill-[#9BCBFF]" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-gray-400" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const completedStages = Object.values(progress).filter(
    (v) => typeof v === 'boolean' && v === true
  ).length;
  const totalProgress = (completedStages / 6) * 100;
  const likedRoles = useMemo(
    () => roles.filter((role) => likedRoleIds.includes(role.id)),
    [likedRoleIds]
  );

  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/asset/Background.png')" }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Logo Header */}
        <div className="flex items-center justify-between">
          <div className="bg-white/80 backdrop-blur-sm border border-white/70 shadow-md rounded-full px-4 py-2">
            <img
              src="/asset/Mirae_Word_Only.png"
              alt="Mirae"
              className="h-10 object-contain"
            />
          </div>
        </div>

        {/* Header */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{t('dashboard')}</p>
                <h1 className="text-3xl font-bold mt-1">
                  {t('greeting')}, {userName}! 👋
                </h1>
                <p className="text-slate-600 mt-1">
                  {t('stagePosition', { stage: progress.currentStage })}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>

        {/* SCOPE+ Journey */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 pointer-events-none" />
          <div className="relative space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {t('progressLabel')}
              </p>
              <div className="px-4 py-2 rounded-full bg-white/80 border border-white/60 text-sm text-slate-700 shadow-sm">
                {Math.round(totalProgress)}%
              </div>
            </div>
            <div className="bg-white/70 border border-white/70 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#9BCBFF] via-[#F4A9C8] to-[#BEEDE3] transition-all duration-500"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>

        {likedRoles.length > 0 && (
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-600">{t('stage1SummaryTag')}</p>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {t('stage1SummaryRolesLikedTitle')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/stage1/summary')}
                  className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-300 ease-out hover:bg-white"
                >
                  {t('stage1SummaryViewAll')}
                </button>
              </div>
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                {likedRoles.map((role) => {
                  const roleTitle = language === 'ko' ? role.title.ko : role.title.en;
                  const roleTagline = language === 'ko' ? role.tagline.ko : role.tagline.en;
                  const roleDomain = language === 'ko' ? role.domain.ko : role.domain.en;
                  return (
                    <div
                      key={role.id}
                      className="w-[240px] flex-shrink-0 snap-start rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          {roleDomain}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-200 via-violet-200 to-rose-200 text-xs font-semibold text-slate-600 shadow-inner">
                          {roleTitle.slice(0, 2)}
                        </div>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-slate-800">
                        {roleTitle}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600">{roleTagline}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
                  glass-card rounded-2xl p-6 floating transition-all
                  ${isAccessible ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                  ${status === 'current' ? 'ring-4 ring-[#C7B9FF]/70' : 'ring-1 ring-white/60'}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800">{t(stage.nameKey)}</h3>
                    <p className="text-sm text-slate-600">{t(stage.descriptionKey)}</p>
                  </div>
                  {getStageIcon(status)}
                </div>

                {status === 'current' && (
                  <button className="soft-button w-full py-2.5 rounded-full font-semibold">
                    {t('start')}
                  </button>
                )}

                {status === 'complete' && (
                  <p className="text-sm text-[#73c8a9] font-semibold">{t('complete')}</p>
                )}

                {status === 'locked' && (
                  <p className="text-sm text-slate-500">{t('locked')}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
