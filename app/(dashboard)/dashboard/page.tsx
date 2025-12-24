'use client';

import { useEffect, useState } from 'react';
import { getUser, signOut } from '@/lib/auth';
import { useUserStore } from '@/lib/stores/userStore';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, Circle, ChevronLeft, ChevronRight, Sprout, Target, Link2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import Image from 'next/image';

const stages = [
  { id: 0, nameKey: 'stage0Name', descriptionKey: 'stage0Description', path: '/stage0', letter: 'S', promptKey: 'journeyPromptStrengths' },
  { id: 1, nameKey: 'stage1Name', descriptionKey: 'stage1Description', path: '/stage1', letter: 'C', promptKey: 'journeyPromptCuriosity' },
  { id: 2, nameKey: 'stage2Name', descriptionKey: 'stage2Description', path: '/stage2', letter: 'O', promptKey: 'journeyPromptOptions' },
  { id: 3, nameKey: 'stage3Name', descriptionKey: 'stage3Description', path: '/stage3', letter: 'P', promptKey: 'journeyPromptProof' },
  { id: 4, nameKey: 'stage4Name', descriptionKey: 'stage4Description', path: '/stage4', letter: 'E', promptKey: 'journeyPromptEvolve' },
  { id: 5, nameKey: 'stage5Name', descriptionKey: 'stage5Description', path: '/stage5', letter: '+', promptKey: 'journeyPromptStoryboard' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { progress, userId, setUserId, reset } = useUserStore();
  const [userName, setUserName] = useState('');
  const { t } = useI18n();

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

  const currentStage = stages.find((stage) => stage.id === progress.currentStage);
  const [viewingStageId, setViewingStageId] = useState(progress.currentStage);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const viewingStage = stages.find((stage) => stage.id === viewingStageId);

  // Update viewing stage when progress changes
  useEffect(() => {
    setViewingStageId(progress.currentStage);
  }, [progress.currentStage]);

  const canNavigateToPrevious = viewingStageId > 0;
  const canNavigateToNext = viewingStageId < stages.length - 1;

  const viewingStageStatus = getStageStatus(viewingStageId);
  const isViewingStageLocked = viewingStageStatus === 'locked';

  const handlePreviousStage = () => {
    if (canNavigateToPrevious) {
      setSlideDirection('right');
      setTimeout(() => {
        setViewingStageId(viewingStageId - 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  const handleNextStage = () => {
    if (canNavigateToNext) {
      setSlideDirection('left');
      setTimeout(() => {
        setViewingStageId(viewingStageId + 1);
        setSlideDirection(null);
      }, 150);
    }
  };

  return (
    <div
      className="h-screen px-6 pt-20 pb-6 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: "url('/asset/Background.png')" }}
    >
      <div className="max-w-6xl mx-auto h-full flex flex-col space-y-4">
        {/* Welcome Header */}
        <div className="text-center space-y-1 flex-shrink-0">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2">
            Hi, welcome back <Sprout className="w-7 h-7 text-green-500" />
          </h1>
          <p className="text-base text-slate-600">
            {t('journeySubtitle')}
          </p>
        </div>

        {/* Journey Map */}
        <div className="relative flex-shrink-0">
          {/* Mirae Character */}
          <div className="absolute -top-4 right-8 z-10">
            <Image
              src="/asset/Mirae_Icon1.png"
              alt="Mirae"
              width={110}
              height={110}
              className="object-contain floating"
            />
          </div>

          {/* Journey Path */}
          <div className="relative py-6 px-6">
            {/* Gradient Path Background */}
            <div className="absolute inset-0 h-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#9BCBFF] via-[#F4A9C8] to-[#BEEDE3] rounded-full opacity-30" />

            {/* Stage Nodes */}
            <div className="relative flex justify-between items-center">
              {stages.map((stage, index) => {
                const status = getStageStatus(stage.id);
                const isCurrent = stage.id === progress.currentStage;
                const isViewing = stage.id === viewingStageId;

                return (
                  <div key={stage.id} className="flex flex-col items-center space-y-1">
                    {/* Stage Circle */}
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md cursor-pointer
                        ${status === 'complete' ? 'bg-gradient-to-br from-[#73c8a9] to-[#56b899] text-white' : ''}
                        ${isCurrent && !isViewing ? 'bg-gradient-to-br from-[#9BCBFF] to-[#7AAFFF] text-white ring-3 ring-white/50 scale-105' : ''}
                        ${isViewing ? 'bg-gradient-to-br from-[#9BCBFF] to-[#7AAFFF] text-white ring-4 ring-[#9BCBFF]/60 scale-110' : ''}
                        ${status === 'locked' ? 'bg-white/60 text-slate-400' : ''}
                        ${status === 'available' && !isCurrent && !isViewing ? 'bg-white/80 text-slate-600 hover:scale-105' : ''}
                      `}
                      onClick={() => {
                        if (status !== 'locked' && (stage.id <= progress.currentStage || status === 'complete')) {
                          setViewingStageId(stage.id);
                        }
                      }}
                    >
                      {stage.letter}
                    </div>

                    {/* Stage Label */}
                    <div className="text-center">
                      <p className={`text-xs font-semibold transition-colors ${isViewing ? 'text-slate-800' : isCurrent ? 'text-slate-700' : 'text-slate-600'}`}>
                        {stage.letter === 'S' ? 'S | Strength' :
                         stage.letter === 'C' ? 'Curiosity' :
                         stage.letter === 'O' ? 'O' :
                         stage.letter === 'P' ? 'P | Proof' :
                         stage.letter === 'E' ? 'E | Evolve' : '+'}
                      </p>
                      {isViewing && (
                        <p className="text-[10px] text-[#9BCBFF] font-medium animate-fade-in">{t('journeyCurrent')}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Stage Card */}
        {viewingStage && (
          <div className="max-w-4xl mx-auto flex-1 min-h-0 relative flex items-center gap-4">
            {/* Left Navigation Button */}
            <button
              onClick={handlePreviousStage}
              disabled={!canNavigateToPrevious}
              className={`p-3 rounded-full transition shadow-md flex-shrink-0 ${
                canNavigateToPrevious
                  ? 'bg-white/70 hover:bg-white cursor-pointer'
                  : 'bg-white/30 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            {/* Main Card Container */}
            <div className="flex-1 h-full flex flex-col gap-3">
              {/* Card */}
              <div className="glass-card rounded-3xl p-8 flex-1 flex flex-col shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none soft-glow rounded-3xl" />

                {/* Locked Overlay */}
                {isViewingStageLocked && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Lock className="w-16 h-16 text-white mx-auto" />
                      <p className="text-xl font-bold text-white">{t('locked')}</p>
                      <p className="text-sm text-white/80">Complete previous stages to unlock</p>
                    </div>
                  </div>
                )}

                <div
                  className={`relative space-y-4 flex-1 flex flex-col transition-all duration-300 ${
                    slideDirection === 'left' ? 'translate-x-[-100%] opacity-0' :
                    slideDirection === 'right' ? 'translate-x-[100%] opacity-0' :
                    'translate-x-0 opacity-100'
                  }`}
                >
                  {/* Stage Header */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9BCBFF] to-[#7AAFFF] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {viewingStage.letter}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {viewingStage.letter} | {t(viewingStage.nameKey)}
                      </h2>
                    </div>
                  </div>

                  {/* Stage Question */}
                  <p className="text-xl text-slate-700 font-medium flex-shrink-0">
                    {t(viewingStage.promptKey)}
                  </p>

                  {/* Subtitle */}
                  <p className="text-base text-slate-600 flex-shrink-0">
                    Let's explore safely. No commitments needed.
                  </p>

                  {/* Activity Options */}
                  <div className="flex-1 grid grid-cols-2 gap-4 py-4">
                    {/* Role Roulette */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition cursor-pointer flex items-center">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB6D9] to-[#FF9EC7] flex items-center justify-center shadow-md flex-shrink-0">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-base">Role Roulette</h3>
                          <p className="text-sm text-slate-600">Spin to preview different roles</p>
                        </div>
                      </div>
                    </div>

                    {/* Decision Chain */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition cursor-pointer flex items-center">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9BCBFF] to-[#7AAFFF] flex items-center justify-center shadow-md flex-shrink-0">
                          <Link2 className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-base">Decision Chain</h3>
                          <p className="text-sm text-slate-600">Play out short, safe scenarios</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => !isViewingStageLocked && router.push(viewingStage.path)}
                    disabled={isViewingStageLocked}
                    className={`w-full max-w-md mx-auto block py-4 rounded-full text-lg font-semibold mt-auto flex-shrink-0 ${
                      isViewingStageLocked
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'soft-button'
                    }`}
                  >
                    Start exploring
                  </button>
                </div>
              </div>

              {/* Progress Dots Below Card */}
              <div className="flex justify-center gap-2">
                {stages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === viewingStageId ? 'bg-[#9BCBFF]' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Navigation Button */}
            <button
              onClick={handleNextStage}
              disabled={!canNavigateToNext}
              className={`p-3 rounded-full transition shadow-md flex-shrink-0 ${
                canNavigateToNext
                  ? 'bg-white/70 hover:bg-white cursor-pointer'
                  : 'bg-white/30 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
