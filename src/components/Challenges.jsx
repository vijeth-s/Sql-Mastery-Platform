import { useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Award, CheckCircle2, Eye, Lightbulb,
  Medal, Play, Shield, Sparkles, Star, Target, Trophy, X, Zap,
  ChevronRight
} from "lucide-react";
import { challengeTiers } from "../data/challengesData";
import { executeQuery } from "../services/database";

// ==================== Gamification Constants ====================

const XP_VALUES = { Easy: 10, Normal: 25, Hard: 50 };
const TIER_BONUS_XP = { easy: 100, normal: 150, hard: 250 };
const PERFECT_BONUS_XP = 15;

const LEVELS = [
  { minXp: 0, title: "SQL Apprentice", icon: "🌱" },
  { minXp: 200, title: "Query Cadet", icon: "📊" },
  { minXp: 500, title: "Data Analyst", icon: "📈" },
  { minXp: 1000, title: "SQL Expert", icon: "⚡" },
  { minXp: 2000, title: "Database Master", icon: "👑" },
  { minXp: 3500, title: "Query Legend", icon: "🏆" },
];

const ACHIEVEMENT_DEFS = [
  { id: "first_solve", label: "First Query", desc: "Solve your first challenge", icon: Target },
  { id: "solved_10", label: "SQL Savant", desc: "Solve 10 challenges", icon: Star },
  { id: "solved_25", label: "Query Machine", desc: "Solve 25 challenges", icon: Zap },
  { id: "solved_50", label: "Dedicated Analyst", desc: "Solve 50 challenges", icon: Sparkles },
  { id: "solved_all_easy", label: "Easy Street", desc: "Complete all Easy challenges", icon: Shield },
  { id: "solved_all_normal", label: "Normal Hero", desc: "Complete all Normal challenges", icon: Medal },
  { id: "solved_all_hard", label: "Hard Core", desc: "Complete all Hard challenges", icon: Award },
  { id: "perfect_5", label: "Flawless", desc: "Solve 5 challenges on first try", icon: Trophy },
  { id: "perfect_10", label: "Perfect Score", desc: "Solve 10 challenges on first try", icon: Award },
];

const difficultyStyles = {
  Easy: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  Normal: "border-amber-300/30 bg-amber-400/10 text-amber-200",
  Hard: "border-rose-300/30 bg-rose-400/10 text-rose-200",
};

const tierStyles = {
  easy: {
    icon: "text-emerald-200",
    border: "border-emerald-300/35",
    bg: "bg-emerald-400/10",
    fill: "bg-emerald-400",
    accent: "emerald",
    glow: "shadow-emerald-500/20",
    gradient: "from-emerald-400 to-emerald-300",
  },
  normal: {
    icon: "text-amber-200",
    border: "border-amber-300/35",
    bg: "bg-amber-400/10",
    fill: "bg-amber-400",
    accent: "amber",
    glow: "shadow-amber-500/20",
    gradient: "from-amber-400 to-amber-300",
  },
  hard: {
    icon: "text-rose-200",
    border: "border-rose-300/35",
    bg: "bg-rose-400/10",
    fill: "bg-rose-400",
    accent: "rose",
    glow: "shadow-rose-500/20",
    gradient: "from-rose-400 to-rose-300",
  },
};

// ==================== Storage ====================

const PROGRESS_KEY = "sql-challenges-progress";
const SOLVED_KEY = "sql-challenges-solved";

function emptyProgress() {
  return { xp: 0, achievements: [], perfectSolveIds: [] };
}

function readProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch { /* fall through */ }
  return emptyProgress();
}

function writeProgress(data) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

function readSolvedIds() {
  try {
    return JSON.parse(localStorage.getItem(SOLVED_KEY) || "[]");
  } catch { return []; }
}

function writeSolvedIds(ids) {
  localStorage.setItem(SOLVED_KEY, JSON.stringify(ids));
}

// ================== Helpers ==================

function getLevel(xp) {
  let level = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) level = lvl;
    else break;
  }
  return level;
}

function getNextLevelXp(xp) {
  for (let i = 0; i < LEVELS.length - 1; i++) {
    if (xp >= LEVELS[i].minXp && xp < LEVELS[i + 1].minXp) {
      return LEVELS[i + 1].minXp;
    }
  }
  return null;
}

function getLevelProgress(xp) {
  const current = getLevel(xp);
  const nextMin = getNextLevelXp(xp);
  if (!nextMin) return 1;
  const range = nextMin - current.minXp;
  return range > 0 ? Math.min((xp - current.minXp) / range, 1) : 1;
}

function checkAnswer(userResult, expectedColumns, expectedRows) {
  if (!userResult) return false;
  const colMatch = JSON.stringify(userResult.columns) === JSON.stringify(expectedColumns);
  const sortedUser = [...userResult.values].map((row) => row.map(String)).sort();
  const sortedExpected = expectedRows.map((row) => row.map(String)).sort();
  const rowMatch = JSON.stringify(sortedUser) === JSON.stringify(sortedExpected);
  return colMatch && rowMatch;
}

function computeAchievementStats(solvedIds, perfectCount) {
  const tierSolved = { easy: 0, normal: 0, hard: 0 };
  const idSet = new Set(solvedIds);
  for (const tier of challengeTiers) {
    tierSolved[tier.id] = tier.challenges.filter((c) => idSet.has(c.id)).length;
  }
  return { totalSolved: solvedIds.length, tierSolved, perfectCount };
}

function checkAchievement(def, stats) {
  switch (def.id) {
    case "first_solve": return stats.totalSolved >= 1;
    case "solved_10": return stats.totalSolved >= 10;
    case "solved_25": return stats.totalSolved >= 25;
    case "solved_50": return stats.totalSolved >= 50;
    case "solved_all_easy": return stats.tierSolved.easy >= 25;
    case "solved_all_normal": return stats.tierSolved.normal >= 25;
    case "solved_all_hard": return stats.tierSolved.hard >= 25;
    case "perfect_5": return stats.perfectCount >= 5;
    case "perfect_10": return stats.perfectCount >= 10;
    default: return false;
  }
}

// ==================== Sub-Components ====================

function CircularProgress({ percent, size = 52, strokeWidth = 4, color = "#34d399" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(percent, 1));

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(148, 163, 184, 0.15)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

function PlayerStats({ xp, achievements, solvedIds, allChallenges }) {
  const level = getLevel(xp);
  const progress = getLevelProgress(xp);
  const nextMin = getNextLevelXp(xp);
  const solvedCount = solvedIds.filter((id) => allChallenges.some((c) => c.id === id)).length;
  const totalCount = allChallenges.length;
  const totalPercent = Math.round((solvedCount / totalCount) * 100);
  const earnedIds = new Set(achievements);

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Level & XP */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{level.icon}</span>
            <div>
              <p className="text-sm font-bold text-white">{level.title}</p>
              <p className="text-xs text-slate-400">
                {xp} XP {nextMin !== null ? `/ ${nextMin} XP` : "· Max Level"}
              </p>
            </div>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-violet-400"
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Overall progress */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-black text-white">
            {solvedCount}<span className="text-sm font-normal text-slate-400">/{totalCount}</span>
          </p>
          <p className="text-xs font-semibold text-sky-200">{totalPercent}% Complete</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-3">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Badges</span>
        {ACHIEVEMENT_DEFS.map((def) => {
          const earned = earnedIds.has(def.id);
          const Icon = def.icon;
          return (
            <div
              key={def.id}
              title={`${earned ? "✓ " : ""}${def.label}: ${def.desc}`}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition ${
                earned
                  ? "border-sky-300/30 bg-sky-400/15 text-sky-200 shadow-sm shadow-sky-500/10"
                  : "border-white/5 bg-white/[0.03] text-slate-600 opacity-50"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TierCard({ tier, solvedCount, xpEarned, percent, onSelect }) {
  const style = tierStyles[tier.id];
  const colorMap = { easy: "#34d399", normal: "#fbbf24", hard: "#fb7185" };
  const color = colorMap[tier.id];

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-xl border text-left shadow-lg transition-all hover:shadow-xl ${style.border} ${style.bg} ${style.glow} p-5`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]`} />

      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}>
          <Trophy className={`h-8 w-8 ${style.icon}`} />
        </div>
        <CircularProgress percent={percent} size={56} strokeWidth={4} color={color} />
      </div>

      <div className="mt-4 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-black text-white">{tier.label}</h2>
          <span className="text-xs font-bold text-slate-400">{solvedCount}/{tier.challenges.length}</span>
        </div>
        <p className="mt-1.5 text-sm leading-5 text-slate-400">{tier.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Star className={`h-3.5 w-3.5 ${style.icon}`} />
          <span className="text-slate-300">{xpEarned} XP earned</span>
        </div>
        <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
    </motion.button>
  );
}

function QuestionGrid({ challenges, selectedId, onSelect, solvedSet, attemptCounts, feedbacks }) {
  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-white">Questions</p>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {challenges.length} total
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {challenges.map((challenge, index) => {
          const isSolved = solvedSet.has(challenge.id);
          const hasAttempts = (attemptCounts[challenge.id] || 0) > 0 || feedbacks[challenge.id]?.type === "error";
          const isSelected = selectedId === challenge.id;
          const isPerfect = isSolved && (attemptCounts[challenge.id] || 0) === 0;

          let statusClass, statusIcon;
          if (isSolved) {
            statusClass = "border-emerald-300/40 bg-emerald-400/20 text-emerald-50";
            statusIcon = "✓";
          } else if (hasAttempts) {
            statusClass = "border-rose-300/30 bg-rose-400/15 text-rose-50";
            statusIcon = "✗";
          } else {
            statusClass = "border-white/10 bg-slate-950/55 text-slate-200 hover:border-sky-300/40 hover:bg-sky-400/10";
            statusIcon = null;
          }

          return (
            <button
              key={challenge.id}
              onClick={() => onSelect(challenge.id)}
              title={`${challenge.title}${isSolved ? " (Solved)" : hasAttempts ? " (In progress)" : ""} - ${XP_VALUES[challenge.difficulty] || 10} XP`}
              className={`relative flex aspect-square items-center justify-center rounded-lg border text-sm font-black transition ${
                isSelected ? "ring-2 ring-sky-300/70 ring-offset-2 ring-offset-slate-950" : ""
              } ${statusClass}`}
            >
              {isPerfect && (
                <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-emerald-300 drop-shadow" />
              )}
              {statusIcon || (index + 1)}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/60" /> Solved
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-rose-400/60" /> Attempted
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-emerald-300" /> Perfect
        </span>
        <span className="text-slate-600">
          +{XP_VALUES.Easy}/{XP_VALUES.Normal}/{XP_VALUES.Hard} XP
        </span>
      </div>
    </div>
  );
}

function ExpectedOutput({ challenge }) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/60">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-bold text-white">Expected Output</p>
      </div>
      <div className="max-h-72 overflow-auto scrollbar-thin">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-wide text-sky-200">
            <tr>
              {challenge.expectedColumns.map((column) => (
                <th key={column} className="border-b border-white/10 px-4 py-3 font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {challenge.expectedRows.map((row, rowIndex) => (
              <tr key={`${challenge.id}-${rowIndex}`} className="border-b border-white/5 last:border-0">
                {row.map((cell, cellIndex) => (
                  <td key={`${cellIndex}-${cell}`} className="px-4 py-3 text-slate-200">{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function XpNotification({ xpGained, achievements }) {
  if (xpGained <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-[90]"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="rounded-xl border border-sky-300/20 bg-slate-900 px-5 py-4 shadow-2xl shadow-sky-500/10 backdrop-blur-xl"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-violet-500 shadow-lg">
              <Zap className="h-6 w-6 fill-white text-white" />
            </div>
            <div>
              <p className="text-lg font-black text-white">+{xpGained} XP</p>
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-amber-300" />
                  <span className="font-bold text-white">{ach.label}</span>
                  <span className="text-xs text-slate-400">Unlocked!</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ==================== Main Component ====================

export default function Challenges({ db }) {
  const [selectedTierId, setSelectedTierId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [queries, setQueries] = useState({});
  const [feedback, setFeedback] = useState({});
  const [attempts, setAttempts] = useState({});
  const [revealed, setRevealed] = useState({});
  const [solvedIds, setSolvedIds] = useState(readSolvedIds);
  const [progress, setProgress] = useState(readProgress);
  const [celebrationTier, setCelebrationTier] = useState(null);
  const [xpNotification, setXpNotification] = useState({ xp: 0, achievements: [] });
  const [notifKey, setNotifKey] = useState(0);

  const allChallenges = useMemo(() => challengeTiers.flatMap((tier) => tier.challenges), []);
  const selectedTier = challengeTiers.find((tier) => tier.id === selectedTierId);
  const selectedChallenge = selectedTier?.challenges.find((ch) => ch.id === selectedId) || selectedTier?.challenges[0];
  const selectedIndex = selectedTier?.challenges.findIndex((ch) => ch.id === selectedChallenge?.id) ?? -1;
  const solvedSet = useMemo(() => new Set(solvedIds), [solvedIds]);

  const getTierSolvedCount = useCallback((tier) => {
    return tier.challenges.filter((ch) => solvedSet.has(ch.id)).length;
  }, [solvedSet]);

  const handleSelectTier = (tier) => {
    setSelectedTierId(tier.id);
    setSelectedId(tier.challenges.find((ch) => !solvedSet.has(ch.id))?.id || tier.challenges[0]?.id || "");
  };

  const handleBackToTiers = () => {
    setSelectedTierId("");
    setSelectedId("");
  };

  const handleSelectQuestion = (id) => {
    setSelectedId(id);
  };

  const handleGoToQuestion = (index) => {
    const next = selectedTier?.challenges[index];
    if (next) setSelectedId(next.id);
  };

  const updateQuery = (challengeId, value) => {
    setQueries((prev) => ({ ...prev, [challengeId]: value }));
  };

  const markSolved = useCallback((challenge, isPerfect) => {
    if (solvedSet.has(challenge.id)) return;

    const tier = challengeTiers.find((t) => t.challenges.some((c) => c.id === challenge.id));

    // Compute XP
    const baseXp = XP_VALUES[challenge.difficulty] || 0;
    const perfectBonus = isPerfect ? PERFECT_BONUS_XP : 0;

    // Check tier completion
    const newSolvedIds = [...solvedIds, challenge.id];
    let tierBonus = 0;
    if (tier) {
      const newTierCount = tier.challenges.filter((c) => newSolvedIds.includes(c.id)).length;
      if (newTierCount === tier.challenges.length) {
        tierBonus = TIER_BONUS_XP[tier.id] || 0;
        setTimeout(() => setCelebrationTier(tier), 600);
      }
    }

    const totalXpGain = baseXp + perfectBonus + tierBonus;

    // Persist solved IDs
    writeSolvedIds(newSolvedIds);
    setSolvedIds(newSolvedIds);

    // Compute progress updates
    const perfectIds = [...(progress.perfectSolveIds || [])];
    if (isPerfect && !perfectIds.includes(challenge.id)) {
      perfectIds.push(challenge.id);
    }

    // Check achievements
    const stats = computeAchievementStats(newSolvedIds, perfectIds.length);
    const nextAchievements = [...(progress.achievements || [])];
    const newlyUnlocked = [];
    for (const def of ACHIEVEMENT_DEFS) {
      if (!nextAchievements.includes(def.id) && checkAchievement(def, stats)) {
        nextAchievements.push(def.id);
        newlyUnlocked.push(def);
      }
    }

    const newProgress = {
      ...progress,
      xp: progress.xp + totalXpGain,
      achievements: nextAchievements,
      perfectSolveIds: perfectIds,
    };
    writeProgress(newProgress);
    setProgress(newProgress);

    // Show notification
    setXpNotification({ xp: totalXpGain, achievements: newlyUnlocked });
    setNotifKey((k) => k + 1);
  }, [solvedSet, solvedIds, progress]);

  const handleCheckAnswer = useCallback((challenge) => {
    const query = queries[challenge.id]?.trim();

    if (!query) {
      setFeedback((prev) => ({
        ...prev,
        [challenge.id]: { type: "error", message: "Write a query before checking your answer." },
      }));
      return;
    }

    try {
      const response = executeQuery(db, query);
      const userResult = response.results[0];
      const correct = checkAnswer(userResult, challenge.expectedColumns, challenge.expectedRows);

      if (correct) {
        const isPerfect = !attempts[challenge.id] && !feedback[challenge.id]?.message;
        setFeedback((prev) => ({
          ...prev,
          [challenge.id]: { type: "success", message: "Correct! Challenge solved." },
        }));

        if (!solvedSet.has(challenge.id)) {
          markSolved(challenge, isPerfect);
        }
        return;
      }

      setAttempts((prev) => ({ ...prev, [challenge.id]: (prev[challenge.id] || 0) + 1 }));
      setFeedback((prev) => ({
        ...prev,
        [challenge.id]: { type: "error", message: `Not quite. ${challenge.hint}` },
      }));
    } catch (error) {
      setAttempts((prev) => ({ ...prev, [challenge.id]: (prev[challenge.id] || 0) + 1 }));
      setFeedback((prev) => ({
        ...prev,
        [challenge.id]: { type: "error", message: error instanceof Error ? error.message : "The query could not be checked." },
      }));
    }
  }, [db, queries, attempts, feedback, solvedSet, markSolved]);

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 lg:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Challenge Mode</p>
            <h1 className="mt-1 text-2xl font-bold text-white">
              {selectedTier ? `${selectedTier.label} Questions` : "Choose Your Challenge"}
            </h1>
          </div>
          {selectedTier ? (
            <button
              onClick={handleBackToTiers}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <Trophy className="h-7 w-7 text-amber-200" />
          )}
        </div>

        {/* Player Stats */}
        <PlayerStats
          xp={progress.xp}
          achievements={progress.achievements || []}
          solvedIds={solvedIds}
          allChallenges={allChallenges}
        />

        {/* Tier Selection */}
        {!selectedTier && (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {challengeTiers.map((tier) => {
              const solvedCount = getTierSolvedCount(tier);
              const percent = solvedCount / tier.challenges.length;
              const baseXp = solvedCount * XP_VALUES[tier.challenges[0]?.difficulty || "Easy"];
              const tierComplete = solvedCount === tier.challenges.length;
              const xpEarned = baseXp + (tierComplete ? TIER_BONUS_XP[tier.id] : 0);
              return (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  solvedCount={solvedCount}
                  xpEarned={xpEarned}
                  percent={percent}
                  onSelect={() => handleSelectTier(tier)}
                />
              );
            })}
          </div>
        )}

        {/* Tier Content */}
        {selectedTier && (
          <div className="mt-5 grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
            {/* Left: Question grid */}
            <section className="rounded-xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20">
              <QuestionGrid
                challenges={selectedTier.challenges}
                selectedId={selectedId}
                onSelect={handleSelectQuestion}
                solvedSet={solvedSet}
                attemptCounts={attempts}
                feedbacks={feedback}
              />
            </section>

            {/* Right: Challenge Panel */}
            {selectedChallenge && (
              <section className="rounded-xl border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20">
                <div className="border-b border-white/10 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${difficultyStyles[selectedChallenge.difficulty]}`}>
                          <Zap className="h-3 w-3" />
                          {selectedChallenge.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-sky-300/20 bg-sky-400/10 px-2.5 py-1 text-xs font-bold text-sky-200">
                          <Star className="h-3 w-3" />
                          +{XP_VALUES[selectedChallenge.difficulty] || 10} XP
                          {(attempts[selectedChallenge.id] || 0) === 0 && !solvedSet.has(selectedChallenge.id) && (
                            <span className="text-[10px] text-sky-300/70">+{PERFECT_BONUS_XP} perfect</span>
                          )}
                        </span>
                      </div>
                      <h2 className="mt-3 text-xl font-bold text-white">
                        Question {selectedIndex + 1}: {selectedChallenge.title}
                      </h2>
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{selectedChallenge.description}</p>
                    </div>
                    {solvedSet.has(selectedChallenge.id) && (
                      <div className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200">
                        <CheckCircle2 className="h-4 w-4" />
                        Solved
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 p-5">
                  {/* Navigation */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleGoToQuestion(selectedIndex - 1)}
                      disabled={selectedIndex <= 0}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {selectedIndex + 1} / {selectedTier.challenges.length}
                    </span>
                    <button
                      onClick={() => handleGoToQuestion(selectedIndex + 1)}
                      disabled={selectedIndex >= selectedTier.challenges.length - 1}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>

                  {/* Expected Output */}
                  <ExpectedOutput challenge={selectedChallenge} />

                  {/* SQL Editor */}
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <label className="text-sm font-bold text-white">Your SQL</label>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-400">{attempts[selectedChallenge.id] || 0} failed attempts</span>
                        {solvedSet.has(selectedChallenge.id) && attempts[selectedChallenge.id] === 0 && (
                          <span className="flex items-center gap-1 font-semibold text-emerald-300">
                            <Sparkles className="h-3 w-3" />
                            Perfect!
                          </span>
                        )}
                      </div>
                    </div>
                    <textarea
                      value={queries[selectedChallenge.id] || ""}
                      onChange={(e) => updateQuery(selectedChallenge.id, e.target.value)}
                      spellCheck="false"
                      className="h-40 w-full resize-none rounded-lg border border-white/10 bg-slate-950/70 p-4 font-mono text-sm leading-6 text-sky-50 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-400/20"
                      placeholder="Write your SQL answer here..."
                    />
                  </div>

                  {/* Feedback */}
                  {feedback[selectedChallenge.id] && (
                    <div
                      className={`rounded-lg border p-3 text-sm font-semibold ${
                        feedback[selectedChallenge.id].type === "success"
                          ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
                          : "border-rose-300/30 bg-rose-400/10 text-rose-100"
                      }`}
                    >
                      {feedback[selectedChallenge.id].message}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCheckAnswer(selectedChallenge)}
                      disabled={solvedSet.has(selectedChallenge.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Check Answer
                    </button>
                    <button
                      onClick={() => setRevealed((prev) => ({ ...prev, [selectedChallenge.id]: true }))}
                      disabled={(attempts[selectedChallenge.id] || 0) < 3}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <Eye className="h-4 w-4" />
                      Show Solution
                    </button>
                  </div>

                  {/* Hint */}
                  <div className="rounded-lg border border-violet-300/20 bg-violet-500/10 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                      <Lightbulb className="h-4 w-4" />
                      Hint
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{selectedChallenge.hint}</p>
                  </div>

                  {/* Solution */}
                  {revealed[selectedChallenge.id] && (
                    <div className="rounded-lg border border-sky-300/20 bg-sky-500/10 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Solution</p>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-sky-50">{selectedChallenge.solution}</pre>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* XP Notification */}
      <XpNotification
        key={notifKey}
        xpGained={xpNotification.xp}
        achievements={xpNotification.achievements}
      />

      {/* Celebration Modal */}
      <AnimatePresence>
        {celebrationTier && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full max-w-md overflow-hidden rounded-xl border ${tierStyles[celebrationTier.id].border} bg-slate-950 p-6 text-center shadow-2xl`}
              initial={{ scale: 0.72, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
            >
              <button
                onClick={() => setCelebrationTier(null)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close celebration"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Confetti particles */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.span
                    key={i}
                    className={`absolute h-2 w-2 rounded-full ${tierStyles[celebrationTier.id].fill}`}
                    initial={{ left: "50%", top: "45%", opacity: 1, scale: 0.6 }}
                    animate={{
                      x: Math.cos(i * 0.85) * (100 + i * 6),
                      y: Math.sin(i * 1.3) * (90 + i * 5),
                      opacity: [1, 1, 0],
                      scale: [0.6, 1.4, 0.2],
                    }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.3, delay: i * 0.03 }}
                  />
                ))}
              </div>

              <motion.div
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border ${tierStyles[celebrationTier.id].border} ${tierStyles[celebrationTier.id].bg}`}
                animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <Trophy className={`h-11 w-11 ${tierStyles[celebrationTier.id].icon}`} />
              </motion.div>

              <h2 className="mt-5 text-2xl font-black text-white">Tier Complete!</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                You conquered all 25 {celebrationTier.label} challenges.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm font-bold text-amber-200">
                <Star className="h-4 w-4" />
                +{TIER_BONUS_XP[celebrationTier.id]} XP Bonus
              </div>
              <button
                onClick={() => setCelebrationTier(null)}
                className="mt-5 block w-full rounded-lg bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-2 text-sm font-bold text-white transition hover:scale-[1.02]"
              >
                Continue Practicing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
