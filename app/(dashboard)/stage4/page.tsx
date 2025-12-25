'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/stores/userStore';

type Candidate = {
  id: string;
  name: string;
  summary: string;
  details: string[];
  imageUrl: string;
  matchPercent?: number;
  careers?: string[];
  coreCourses?: string[];
  workloadStyle?: string;
  portfolio?: string;
  collaboration?: string;
  pace?: string;
  location?: string;
  scholarships?: string[];
  tuitionRange?: string;
  aidStrength?: string;
  internshipPipeline?: string;
  selectivity?: string;
  campusVibe?: string;
  housing?: string;
  exchange?: string;
};

type MatchSnapshot = {
  phase: 'intro' | 'major' | 'university' | 'result';
  mode: 'major' | 'university';
  roundCandidates: Candidate[];
  nextRoundCandidates: Candidate[];
  matchIndex: number;
  round: number;
  majorWinner: Candidate | null;
  universityWinner: Candidate | null;
};

const MAJOR_CANDIDATES: Candidate[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    summary: 'Build software, systems, and algorithms.',
    imageUrl: 'https://picsum.photos/id/180/800/500',
    matchPercent: 88,
    careers: ['Software engineer', 'Data engineer', 'Product developer'],
    coreCourses: ['Algorithms', 'Databases', 'Systems'],
    workloadStyle: 'Project-heavy with weekly coding labs',
    portfolio: 'Yes - apps, systems, open-source',
    collaboration: 'Mixed - solo coding + team sprints',
    pace: 'Intense',
    details: ['Strong logic fit', 'High demand roles', 'Project driven'],
  },
  {
    id: 'business',
    name: 'Business Administration',
    summary: 'Lead teams, strategy, and operations.',
    imageUrl: 'https://picsum.photos/id/1074/800/500',
    matchPercent: 74,
    careers: ['Strategy analyst', 'Operations manager', 'Marketing lead'],
    coreCourses: ['Accounting', 'Strategy', 'Marketing'],
    workloadStyle: 'Case studies and group presentations',
    portfolio: 'Yes - case decks, market plans',
    collaboration: 'Team-heavy',
    pace: 'Moderate',
    details: ['Leadership focus', 'Broad career paths', 'Practical projects'],
  },
  {
    id: 'design',
    name: 'UX Design',
    summary: 'Design products around human needs.',
    imageUrl: 'https://picsum.photos/id/1060/800/500',
    matchPercent: 91,
    careers: ['UX designer', 'Product designer', 'UX researcher'],
    coreCourses: ['Interaction design', 'User research', 'Prototyping'],
    workloadStyle: 'Studio critiques and iterative projects',
    portfolio: 'Yes - product case studies',
    collaboration: 'Team-heavy',
    pace: 'Moderate to intense',
    details: ['Creative problem solving', 'User research', 'Portfolio friendly'],
  },
  {
    id: 'psych',
    name: 'Psychology',
    summary: 'Understand behavior and motivation.',
    imageUrl: 'https://picsum.photos/id/1027/800/500',
    matchPercent: 69,
    careers: ['Counselor', 'Behavior analyst', 'UX researcher'],
    coreCourses: ['Cognitive psych', 'Statistics', 'Research methods'],
    workloadStyle: 'Reading, labs, and research papers',
    portfolio: 'Optional - research summaries',
    collaboration: 'Balanced',
    pace: 'Moderate',
    details: ['People-focused', 'Research skills', 'Counseling pathways'],
  },
  {
    id: 'biomed',
    name: 'Biomedical Engineering',
    summary: 'Combine medicine and engineering.',
    imageUrl: 'https://picsum.photos/id/1033/800/500',
    matchPercent: 63,
    careers: ['Bioengineer', 'Medical device designer', 'R&D specialist'],
    coreCourses: ['Biomechanics', 'Signals', 'Materials'],
    workloadStyle: 'Lab-heavy with technical projects',
    portfolio: 'Yes - prototypes, lab reports',
    collaboration: 'Team-heavy',
    pace: 'Intense',
    details: ['STEM heavy', 'Lab work', 'Healthcare impact'],
  },
  {
    id: 'media',
    name: 'Media Studies',
    summary: 'Create stories and digital content.',
    imageUrl: 'https://picsum.photos/id/1043/800/500',
    matchPercent: 77,
    careers: ['Content producer', 'Media strategist', 'Film editor'],
    coreCourses: ['Storytelling', 'Digital media', 'Production'],
    workloadStyle: 'Project-driven with critiques',
    portfolio: 'Yes - reels, campaigns',
    collaboration: 'Team-heavy',
    pace: 'Moderate',
    details: ['Storytelling', 'Production skills', 'Creative collaboration'],
  },
  {
    id: 'econ',
    name: 'Economics',
    summary: 'Model markets and decision making.',
    imageUrl: 'https://picsum.photos/id/1050/800/500',
    matchPercent: 71,
    careers: ['Policy analyst', 'Economist', 'Data analyst'],
    coreCourses: ['Microeconomics', 'Econometrics', 'Game theory'],
    workloadStyle: 'Problem sets and analytical papers',
    portfolio: 'Optional - data analyses',
    collaboration: 'Solo leaning',
    pace: 'Moderate',
    details: ['Data analysis', 'Policy impact', 'Quantitative reasoning'],
  },
  {
    id: 'social',
    name: 'Social Entrepreneurship',
    summary: 'Build ventures with social impact.',
    imageUrl: 'https://picsum.photos/id/1015/800/500',
    matchPercent: 84,
    careers: ['Social founder', 'Program manager', 'Impact strategist'],
    coreCourses: ['Impact finance', 'Venture design', 'Policy'],
    workloadStyle: 'Pitching and venture building',
    portfolio: 'Yes - venture plans',
    collaboration: 'Team-heavy',
    pace: 'Moderate',
    details: ['Mission driven', 'Startup mindset', 'Community focus'],
  },
];

const UNIVERSITY_BASE: Candidate[] = [
  {
    id: 'seoul-tech',
    name: 'Seoul Tech University',
    summary: 'Engineering focused campus with industry ties.',
    imageUrl: 'https://picsum.photos/id/1011/800/500',
    location: 'Seoul, South Korea',
    scholarships: ['Merit scholarship', 'STEM excellence grant'],
    tuitionRange: '$$',
    aidStrength: 'Strong merit aid',
    internshipPipeline: 'High - industry partnerships',
    selectivity: 'High',
    campusVibe: 'Urban, fast-paced',
    housing: 'On-campus, limited',
    exchange: 'Asia-Pacific exchanges',
    details: ['Capstone required', 'Urban campus', 'Strong internships'],
  },
  {
    id: 'hanriver',
    name: 'Han River University',
    summary: 'Balanced programs with global exchange.',
    imageUrl: 'https://picsum.photos/id/1018/800/500',
    location: 'Busan, South Korea',
    scholarships: ['Global exchange award', 'Community service scholarship'],
    tuitionRange: '$$',
    aidStrength: 'Balanced',
    internshipPipeline: 'Medium - regional partners',
    selectivity: 'Medium',
    campusVibe: 'Coastal, collaborative',
    housing: 'On-campus, available',
    exchange: 'Global exchange tracks',
    details: ['Exchange options', 'Career coaching', 'Modern facilities'],
  },
  {
    id: 'skyline',
    name: 'Skyline National University',
    summary: 'Research-heavy with competitive admissions.',
    imageUrl: 'https://picsum.photos/id/1020/800/500',
    location: 'Daejeon, South Korea',
    scholarships: ['Research fellowship', 'Graduate pathway stipend'],
    tuitionRange: '$$$',
    aidStrength: 'Research grants available',
    internshipPipeline: 'High - lab placements',
    selectivity: 'Very high',
    campusVibe: 'Research intensive',
    housing: 'On-campus, competitive',
    exchange: 'Research exchange programs',
    details: ['Research labs', 'Top faculty', 'Graduate pathways'],
  },
  {
    id: 'daehan',
    name: 'Daehan Institute',
    summary: 'Hands-on, project-centric curriculum.',
    imageUrl: 'https://picsum.photos/id/1024/800/500',
    location: 'Incheon, South Korea',
    scholarships: ['Portfolio scholarship', 'Mentor-backed award'],
    tuitionRange: '$$',
    aidStrength: 'Portfolio-based aid',
    internshipPipeline: 'Medium - studio partners',
    selectivity: 'Medium',
    campusVibe: 'Studio-driven',
    housing: 'Off-campus focus',
    exchange: 'Design studio exchanges',
    details: ['Studio classes', 'Mentor network', 'Portfolio reviews'],
  },
  {
    id: 'bluebay',
    name: 'Blue Bay University',
    summary: 'Interdisciplinary programs and flexible tracks.',
    imageUrl: 'https://picsum.photos/id/1031/800/500',
    location: 'Gwangju, South Korea',
    scholarships: ['Interdisciplinary grant', 'Innovation challenge award'],
    tuitionRange: '$$',
    aidStrength: 'Innovation grants',
    internshipPipeline: 'Medium',
    selectivity: 'Medium',
    campusVibe: 'Interdisciplinary, open',
    housing: 'On-campus, available',
    exchange: 'Cross-major exchange',
    details: ['Cross-major electives', 'Team projects', 'Open curriculum'],
  },
  {
    id: 'mountain',
    name: 'Mountain Valley College',
    summary: 'Close-knit community with strong support.',
    imageUrl: 'https://picsum.photos/id/1039/800/500',
    location: 'Gangwon, South Korea',
    scholarships: ['Leadership scholarship', 'Community builder grant'],
    tuitionRange: '$',
    aidStrength: 'Strong need-based aid',
    internshipPipeline: 'Low to medium',
    selectivity: 'Low to medium',
    campusVibe: 'Small, supportive',
    housing: 'On-campus, abundant',
    exchange: 'Limited exchange options',
    details: ['Small cohorts', 'Advisor matching', 'Leadership programs'],
  },
  {
    id: 'metro',
    name: 'Metro City University',
    summary: 'Large network with strong alumni reach.',
    imageUrl: 'https://picsum.photos/id/1047/800/500',
    location: 'Seoul, South Korea',
    scholarships: ['Alumni legacy scholarship', 'Industry partner grant'],
    tuitionRange: '$$$',
    aidStrength: 'Merit + partner aid',
    internshipPipeline: 'High - corporate partners',
    selectivity: 'High',
    campusVibe: 'Large, energetic',
    housing: 'On-campus, competitive',
    exchange: 'Global partner network',
    details: ['Alumni mentorship', 'Career fairs', 'City partnerships'],
  },
  {
    id: 'bright',
    name: 'Bright Horizon University',
    summary: 'Global outlook and bilingual tracks.',
    imageUrl: 'https://picsum.photos/id/1056/800/500',
    location: 'Jeju, South Korea',
    scholarships: ['Bilingual excellence award', 'Global traveler stipend'],
    tuitionRange: '$$',
    aidStrength: 'Global scholarships',
    internshipPipeline: 'Medium',
    selectivity: 'Medium',
    campusVibe: 'International, scenic',
    housing: 'On-campus, available',
    exchange: 'Study abroad focus',
    details: ['Bilingual courses', 'International projects', 'Study abroad'],
  },
];

const TOTAL_ROUNDS = 3;

const buildUniversitiesForMajor = (major: Candidate): Candidate[] =>
  UNIVERSITY_BASE.map((university) => ({
    ...university,
    details: [...university.details, `Popular track: ${major.name}`],
  }));

const getMatchReasons = (candidate: Candidate, mode: 'major' | 'university'): string[] => {
  const reasons: string[] = [];

  if (mode === 'major') {
    if (candidate.matchPercent !== undefined) {
      reasons.push(`Strong alignment (${candidate.matchPercent}%)`);
    }
    if (candidate.careers?.length) {
      reasons.push(`Career fit: ${candidate.careers[0]}`);
    }
    if (candidate.coreCourses?.length) {
      reasons.push(`Core course: ${candidate.coreCourses[0]}`);
    }
    if (candidate.workloadStyle) {
      reasons.push(`Workload: ${candidate.workloadStyle}`);
    }
    if (candidate.collaboration) {
      reasons.push(`Collaboration: ${candidate.collaboration}`);
    }
  } else {
    if (candidate.internshipPipeline) {
      reasons.push(`Internships: ${candidate.internshipPipeline}`);
    }
    if (candidate.aidStrength) {
      reasons.push(`Aid strength: ${candidate.aidStrength}`);
    }
    if (candidate.campusVibe) {
      reasons.push(`Campus vibe: ${candidate.campusVibe}`);
    }
    if (candidate.exchange) {
      reasons.push(`Exchange: ${candidate.exchange}`);
    }
    if (candidate.selectivity) {
      reasons.push(`Selectivity: ${candidate.selectivity}`);
    }
  }

  return reasons.slice(0, 3);
};

export default function Stage4Page() {
  const [phase, setPhase] = useState<'intro' | 'major' | 'university' | 'result'>('intro');
  const [mode, setMode] = useState<'major' | 'university'>('major');
  const [roundCandidates, setRoundCandidates] = useState<Candidate[]>([]);
  const [nextRoundCandidates, setNextRoundCandidates] = useState<Candidate[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [majorWinner, setMajorWinner] = useState<Candidate | null>(null);
  const [universityWinner, setUniversityWinner] = useState<Candidate | null>(null);
  const [history, setHistory] = useState<MatchSnapshot[]>([]);
  const router = useRouter();
  const { completeStage } = useUserStore();

  const startMajorTournament = () => {
    setPhase('major');
    setMode('major');
    setRoundCandidates(MAJOR_CANDIDATES);
    setNextRoundCandidates([]);
    setMatchIndex(0);
    setRound(1);
    setHistory([]);
  };

  const startUniversityTournament = (major: Candidate) => {
    setPhase('university');
    setMode('university');
    setRoundCandidates(buildUniversitiesForMajor(major));
    setNextRoundCandidates([]);
    setMatchIndex(0);
    setRound(1);
  };

  const resetTournament = () => {
    setPhase('intro');
    setMode('major');
    setRoundCandidates([]);
    setNextRoundCandidates([]);
    setMatchIndex(0);
    setRound(1);
    setMajorWinner(null);
    setUniversityWinner(null);
    setHistory([]);
  };

  const handlePick = (winner: Candidate) => {
    setHistory((prev) => [
      ...prev,
      {
        phase,
        mode,
        roundCandidates: [...roundCandidates],
        nextRoundCandidates: [...nextRoundCandidates],
        matchIndex,
        round,
        majorWinner,
        universityWinner,
      },
    ]);

    const updatedWinners = [...nextRoundCandidates, winner];
    const totalMatches = roundCandidates.length / 2;
    const roundFinished = matchIndex + 1 >= totalMatches;

    if (!roundFinished) {
      setNextRoundCandidates(updatedWinners);
      setMatchIndex(matchIndex + 1);
      return;
    }

    if (updatedWinners.length === 1) {
      if (mode === 'major') {
        setMajorWinner(updatedWinners[0]);
        startUniversityTournament(updatedWinners[0]);
      } else {
        setUniversityWinner(updatedWinners[0]);
        setPhase('result');
      }
      return;
    }

    setRoundCandidates(updatedWinners);
    setNextRoundCandidates([]);
    setMatchIndex(0);
    setRound(round + 1);
  };

  const handleUndo = () => {
    setHistory((prev) => {
      if (!prev.length) {
        return prev;
      }
      const snapshot = prev[prev.length - 1];
      setPhase(snapshot.phase);
      setMode(snapshot.mode);
      setRoundCandidates(snapshot.roundCandidates);
      setNextRoundCandidates(snapshot.nextRoundCandidates);
      setMatchIndex(snapshot.matchIndex);
      setRound(snapshot.round);
      setMajorWinner(snapshot.majorWinner);
      setUniversityWinner(snapshot.universityWinner);
      return prev.slice(0, -1);
    });
  };

  const handleComplete = () => {
    completeStage(4);
    router.push('/dashboard');
  };

  const currentPair = roundCandidates.slice(matchIndex * 2, matchIndex * 2 + 2);
  const totalMatches = roundCandidates.length ? roundCandidates.length / 2 : 0;

  return (
    <div
      className="min-h-screen p-6 sm:p-10"
      style={{
        background:
          'linear-gradient(135deg, #9BCBFF 0%, #C7B9FF 25%, #F4A9C8 50%, #FFD1A8 75%, #BEEDE3 100%)',
      }}
    >
      <div className="relative max-w-6xl mx-auto">
        <div
          className="pointer-events-none absolute -top-12 -left-10 h-52 w-52 rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #C7B9FF 60%, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #FFFFFF 0%, #F4A9C8 60%, transparent 70%)' }}
        />

        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-white/80">Stage 4</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white drop-shadow">
            Tournament Bracket
          </h1>
        </div>

        {phase === 'intro' && (
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-10 text-center border border-white/60">
            <p className="text-gray-700 mb-6 text-base">
              First, pick the best major. Then compare universities that offer it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
              <div className="border border-white/70 bg-white/70 rounded-2xl p-5 shadow-md">
                <h2 className="text-lg font-semibold mb-2 text-slate-800">Major Tournament</h2>
                <p className="text-sm text-slate-600">
                  8 candidates based on your interests, passions, and courses.
                </p>
              </div>
              <div className="border border-white/70 bg-white/70 rounded-2xl p-5 shadow-md">
                <h2 className="text-lg font-semibold mb-2 text-slate-800">University Tournament</h2>
                <p className="text-sm text-slate-600">
                  8 universities that offer the winning major.
                </p>
              </div>
            </div>
            <button
              onClick={startMajorTournament}
              className="px-6 py-3 rounded-full font-medium text-slate-800 bg-white/90 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 ease-out"
            >
              Start Tournament
            </button>
          </div>
        )}

        {(phase === 'major' || phase === 'university') && currentPair.length === 2 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                  {mode === 'major' ? 'Major Tournament' : 'University Tournament'}
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white drop-shadow">
                  Round {round} of {TOTAL_ROUNDS}
                </h2>
                <p className="text-sm text-white/80">
                  Match {matchIndex + 1} of {totalMatches}
                </p>
              </div>
              <div className="text-sm text-white/80 bg-white/20 border border-white/30 rounded-full px-4 py-1">
                Winners locked in this round: {nextRoundCandidates.length}
              </div>
            </div>

            <div className="text-center text-white/80 text-sm">Pick the winner to advance</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentPair.map((candidate) => (
                <button
                  key={candidate.id}
                  onClick={() => handlePick(candidate)}
                  className="text-left bg-white/85 backdrop-blur rounded-3xl shadow-xl p-6 border border-white/70 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-out"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-800">{candidate.name}</h3>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Pick</span>
                  </div>
                  {mode === 'major' && candidate.matchPercent !== undefined && (
                    <p className="text-sm text-slate-700 font-medium mb-2">
                      Match score: {candidate.matchPercent}%
                    </p>
                  )}
                  {mode === 'major' && candidate.careers && (
                    <p className="text-sm text-slate-600 mb-1">
                      Careers: {candidate.careers.join(', ')}
                    </p>
                  )}
                  {mode === 'major' && candidate.coreCourses && (
                    <p className="text-sm text-slate-600 mb-1">
                      Core courses: {candidate.coreCourses.join(', ')}
                    </p>
                  )}
                  {mode === 'major' && candidate.workloadStyle && (
                    <p className="text-sm text-slate-600 mb-1">
                      Workload: {candidate.workloadStyle}
                    </p>
                  )}
                  {mode === 'major' && candidate.portfolio && (
                    <p className="text-sm text-slate-600 mb-1">
                      Portfolio: {candidate.portfolio}
                    </p>
                  )}
                  {mode === 'major' && candidate.collaboration && (
                    <p className="text-sm text-slate-600 mb-1">
                      Collaboration: {candidate.collaboration}
                    </p>
                  )}
                  {mode === 'major' && candidate.pace && (
                    <p className="text-sm text-slate-600 mb-3">Pace: {candidate.pace}</p>
                  )}
                  {mode === 'university' && candidate.location && (
                    <p className="text-sm text-slate-600 mb-1">Location: {candidate.location}</p>
                  )}
                  {mode === 'university' && candidate.scholarships?.length && (
                    <p className="text-sm text-slate-600 mb-3">
                      Scholarships: {candidate.scholarships.join(', ')}
                    </p>
                  )}
                  {mode === 'university' && (
                    <div className="text-sm text-slate-600 mb-3 space-y-1">
                      {candidate.tuitionRange && <p>Tuition: {candidate.tuitionRange}</p>}
                      {candidate.aidStrength && <p>Financial aid: {candidate.aidStrength}</p>}
                      {candidate.internshipPipeline && (
                        <p>Internships: {candidate.internshipPipeline}</p>
                      )}
                      {candidate.selectivity && <p>Selectivity: {candidate.selectivity}</p>}
                      {candidate.campusVibe && <p>Campus vibe: {candidate.campusVibe}</p>}
                      {candidate.housing && <p>Housing: {candidate.housing}</p>}
                      {candidate.exchange && <p>Exchange: {candidate.exchange}</p>}
                    </div>
                  )}
                  <p className="text-sm text-slate-600 mb-4">{candidate.summary}</p>
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                      Why this matchup
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getMatchReasons(candidate, mode).map((reason) => (
                        <span
                          key={reason}
                          className="text-xs text-slate-700 bg-white/70 border border-white/70 rounded-full px-3 py-1 shadow-sm"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {candidate.details.map((detail) => (
                      <li key={detail}>- {detail}</li>
                    ))}
                  </ul>
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    loading="lazy"
                    className="mt-4 h-36 w-full rounded-2xl object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={resetTournament}
                className="text-sm text-white/80 hover:text-white"
              >
                Restart tournament
              </button>
              <button
                onClick={handleUndo}
                className="text-sm text-white/80 hover:text-white disabled:text-white/40"
                disabled={history.length === 0}
              >
                Undo last pick
              </button>
              {majorWinner && mode === 'university' && (
                <div className="text-sm text-white/90">
                  Current major: <span className="font-semibold">{majorWinner.name}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'result' && majorWinner && universityWinner && (
          <div className="bg-white/85 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-10 text-center space-y-6 border border-white/60">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Final Results</p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">Your winning path</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-white/70 bg-white/70 rounded-2xl p-5 text-left shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Major</p>
                <h3 className="text-lg font-semibold text-slate-800">{majorWinner.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{majorWinner.summary}</p>
              </div>
              <div className="border border-white/70 bg-white/70 rounded-2xl p-5 text-left shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">University</p>
                <h3 className="text-lg font-semibold text-slate-800">{universityWinner.name}</h3>
                <p className="text-sm text-slate-600 mt-2">{universityWinner.summary}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleComplete}
                className="px-6 py-3 rounded-full font-medium text-slate-800 bg-white/90 shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 ease-out"
              >
                Save and return to dashboard
              </button>
              <button
                onClick={resetTournament}
                className="px-6 py-3 rounded-full border border-white/70 text-slate-700 bg-white/70 hover:bg-white/90 shadow-md transition-all duration-300 ease-out"
              >
                Run another tournament
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
