import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, BarChart2, BookOpen, RefreshCw, Target, Trophy } from "lucide-react";
import { lessonsData } from "../data/lessonsData";
import { challengeTiers } from "../data/challengesData";

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export default function Progress() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  const queriesRun = useMemo(() => {
    try {
      return parseInt(localStorage.getItem("sql-queries-run") || "0", 10);
    } catch {
      return 0;
    }
  }, [refreshKey]);

  const solvedIds = useMemo(() => readJSON("sql-challenges-solved", []), [refreshKey]);
  const totalChallenges = useMemo(
    () => challengeTiers.reduce((sum, t) => sum + t.challenges.length, 0),
    []
  );
  const challengesSolved = solvedIds.length;

  const lessonsRead = useMemo(() => readJSON("sql-lessons-read", []), [refreshKey]);

  const levels = ["beginner", "intermediate", "advanced"];
  const levelLabels = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

  const lessonProgress = useMemo(() => {
    return levels.map((level) => {
      const lessons = lessonsData[level] || [];
      const total = lessons.length;
      const read = lessonsRead.filter((key) => lessons.some((l) => key === l.section + "|" + l.title)).length;
      return { level, label: levelLabels[level], read, total };
    });
  }, [lessonsRead]);

  const handleReset = () => {
    if (window.confirm("Reset all progress stats? This will clear your query count, lessons read, and challenge progress. Challenges solved in storage will not be affected.")) {
      localStorage.removeItem("sql-queries-run");
      localStorage.removeItem("sql-streak-dates");
      localStorage.removeItem("sql-lessons-read");
      refresh();
    }
  };

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Your journey</p>
          <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">Progress Tracker</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">All your activity across queries, lessons, and challenges — stored in your browser.</p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="glass rounded-lg p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Queries Run</p>
              <BarChart2 className="h-5 w-5 text-sky-400" />
            </div>
            <p className="mt-3 text-4xl font-bold text-white">{queriesRun.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-400">total queries executed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-lg p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Challenges</p>
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <p className="mt-3 text-4xl font-bold text-white">{challengesSolved} <span className="text-2xl text-slate-400">/ {totalChallenges}</span></p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(challengesSolved / totalChallenges) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  challengesSolved === totalChallenges
                    ? "bg-emerald-400"
                    : challengesSolved >= totalChallenges / 2
                      ? "bg-amber-400"
                      : "bg-sky-400"
                }`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-lg p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Lessons Read</p>
              <BookOpen className="h-5 w-5 text-violet-400" />
            </div>
            <p className="mt-3 text-4xl font-bold text-white">
              {lessonProgress.reduce((s, l) => s + l.read, 0)}{" "}
              <span className="text-2xl text-slate-400">/ {lessonProgress.reduce((s, l) => s + l.total, 0)}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">across all levels</p>
          </motion.div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {lessonProgress.map((lp) => (
            <div key={lp.level} className="glass rounded-lg p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{lp.label}</p>
                <span className="text-xs text-slate-400">
                  {lp.read} / {lp.total}
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: lp.total > 0 ? `${(lp.read / lp.total) * 100}%` : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className={`h-full rounded-full ${
                    lp.read === lp.total && lp.total > 0
                      ? "bg-emerald-400"
                      : lp.read > lp.total / 2
                        ? "bg-violet-400"
                        : "bg-sky-400"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Stats
          </button>
        </div>
      </div>
    </main>
  );
}
