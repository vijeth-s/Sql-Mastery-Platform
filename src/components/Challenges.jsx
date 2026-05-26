import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Eye, Lightbulb, Play, Trophy, X } from "lucide-react";
import { challengeTiers } from "../data/challengesData";
import { executeQuery } from "../services/database";

const solvedKey = "sql-challenges-solved";

const difficultyStyles = {
  Easy: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  Normal: "border-amber-300/30 bg-amber-400/10 text-amber-200",
  Hard: "border-rose-300/30 bg-rose-400/10 text-rose-200"
};

const tierStyles = {
  easy: {
    icon: "text-emerald-200",
    border: "border-emerald-300/35",
    bg: "bg-emerald-400/10",
    fill: "bg-emerald-400",
    glow: "shadow-emerald-500/20"
  },
  normal: {
    icon: "text-amber-200",
    border: "border-amber-300/35",
    bg: "bg-amber-400/10",
    fill: "bg-amber-400",
    glow: "shadow-amber-500/20"
  },
  hard: {
    icon: "text-rose-200",
    border: "border-rose-300/35",
    bg: "bg-rose-400/10",
    fill: "bg-rose-400",
    glow: "shadow-rose-500/20"
  }
};

function readSolvedIds() {
  try {
    return JSON.parse(localStorage.getItem(solvedKey) || "[]");
  } catch {
    return [];
  }
}

function writeSolvedIds(ids) {
  localStorage.setItem(solvedKey, JSON.stringify(ids));
}

function checkAnswer(userResult, expectedColumns, expectedRows) {
  if (!userResult) return false;
  const colMatch = JSON.stringify(userResult.columns) === JSON.stringify(expectedColumns);
  const sortedUser = [...userResult.values].map((row) => row.map(String)).sort();
  const sortedExpected = expectedRows.map((row) => row.map(String)).sort();
  const rowMatch = JSON.stringify(sortedUser) === JSON.stringify(sortedExpected);
  return colMatch && rowMatch;
}

export default function Challenges({ db }) {
  const [selectedTierId, setSelectedTierId] = useState("");
  const selectedTier = challengeTiers.find((tier) => tier.id === selectedTierId);
  const [selectedId, setSelectedId] = useState("");
  const [queries, setQueries] = useState({});
  const [feedback, setFeedback] = useState({});
  const [attempts, setAttempts] = useState({});
  const [revealed, setRevealed] = useState({});
  const [solvedIds, setSolvedIds] = useState(readSolvedIds);
  const [celebrationTier, setCelebrationTier] = useState(null);

  const allChallenges = useMemo(() => challengeTiers.flatMap((tier) => tier.challenges), []);
  const selectedChallenge = selectedTier?.challenges.find((challenge) => challenge.id === selectedId) || selectedTier?.challenges[0];
  const selectedIndex = selectedTier?.challenges.findIndex((challenge) => challenge.id === selectedChallenge?.id) ?? -1;
  const solvedSet = useMemo(() => new Set(solvedIds), [solvedIds]);
  const solvedPercent = Math.round((solvedIds.filter((id) => allChallenges.some((challenge) => challenge.id === id)).length / allChallenges.length) * 100);

  const selectTier = (tier) => {
    setSelectedTierId(tier.id);
    setSelectedId(tier.challenges.find((challenge) => !solvedSet.has(challenge.id))?.id || tier.challenges[0].id);
  };

  const backToTiers = () => {
    setSelectedTierId("");
    setSelectedId("");
  };

  const getTierSolvedCount = (tier, ids = solvedIds) => tier.challenges.filter((challenge) => ids.includes(challenge.id)).length;

  const goToQuestion = (index) => {
    const nextChallenge = selectedTier?.challenges[index];
    if (nextChallenge) setSelectedId(nextChallenge.id);
  };

  const getQuestionStatus = (challenge) => {
    if (solvedSet.has(challenge.id)) return "solved";
    if ((attempts[challenge.id] || 0) > 0 || feedback[challenge.id]?.type === "error") return "wrong";
    return "idle";
  };

  const updateQuery = (challengeId, value) => {
    setQueries((current) => ({ ...current, [challengeId]: value }));
  };

  const markSolved = (challenge) => {
    setSolvedIds((current) => {
      if (current.includes(challenge.id)) return current;
      const next = [...current, challenge.id];
      writeSolvedIds(next);
      const tier = challengeTiers.find((item) => item.challenges.some((tierChallenge) => tierChallenge.id === challenge.id));
      if (tier && getTierSolvedCount(tier, current) < tier.challenges.length && getTierSolvedCount(tier, next) === tier.challenges.length) {
        setCelebrationTier(tier);
      }
      return next;
    });
  };

  const handleCheckAnswer = (challenge) => {
    const query = queries[challenge.id]?.trim();

    if (!query) {
      setFeedback((current) => ({
        ...current,
        [challenge.id]: { type: "error", message: "Write a query before checking your answer." }
      }));
      return;
    }

    try {
      const response = executeQuery(db, query);
      const userResult = response.results[0];
      const correct = checkAnswer(userResult, challenge.expectedColumns, challenge.expectedRows);

      if (correct) {
        markSolved(challenge);
        setFeedback((current) => ({
          ...current,
          [challenge.id]: { type: "success", message: "Correct! Challenge solved." }
        }));
        return;
      }

      setAttempts((current) => ({ ...current, [challenge.id]: (current[challenge.id] || 0) + 1 }));
      setFeedback((current) => ({
        ...current,
        [challenge.id]: { type: "error", message: `Not quite. ${challenge.hint}` }
      }));
    } catch (error) {
      setAttempts((current) => ({ ...current, [challenge.id]: (current[challenge.id] || 0) + 1 }));
      setFeedback((current) => ({
        ...current,
        [challenge.id]: { type: "error", message: error instanceof Error ? error.message : "The query could not be checked." }
      }));
    }
  };

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 lg:px-6">
      <div className={`mx-auto grid max-w-7xl gap-4 ${selectedTier ? "xl:grid-cols-[360px_minmax(0,1fr)]" : ""}`}>
        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Challenge Mode</p>
              <h1 className="mt-1 text-2xl font-bold text-white">{selectedTier ? `${selectedTier.label} Questions` : "Choose Your Challenge"}</h1>
            </div>
            {selectedTier ? (
              <button
                onClick={backToTiers}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <Trophy className="h-7 w-7 text-amber-200" />
            )}
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/60 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-white">{solvedIds.filter((id) => allChallenges.some((challenge) => challenge.id === id)).length} / {allChallenges.length} Challenges Solved</span>
              <span className="text-sky-200">{solvedPercent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-sky-400 transition-all" style={{ width: `${solvedPercent}%` }} />
            </div>
          </div>

          {!selectedTier && (
            <div className="mt-5 grid gap-4 md:grid-cols-3">
            {challengeTiers.map((tier) => {
              const solvedCount = getTierSolvedCount(tier);
              const tierPercent = Math.round((solvedCount / tier.challenges.length) * 100);
              const style = tierStyles[tier.id];

              return (
                <button
                  key={tier.id}
                  onClick={() => selectTier(tier)}
                  className={`aspect-square rounded-lg border p-4 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${style.border} ${style.bg} ${style.glow}`}
                >
                  <div className="flex h-full flex-col">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border ${style.border} ${style.bg}`}>
                      <Trophy className={`h-9 w-9 ${style.icon}`} />
                    </div>
                    <div className="mt-4 min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-xl font-black text-white">{tier.label}</h2>
                        <span className="text-xs font-semibold text-slate-300">{solvedCount}/25</span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-slate-300">{tier.description}</p>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className={`h-full rounded-full ${style.fill} transition-all`} style={{ width: `${tierPercent}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
            </div>
          )}

          {selectedTier && (
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-white">Questions</p>
                <p className="text-xs text-slate-400">Choose 1-25</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {selectedTier.challenges.map((challenge, index) => {
                  const status = getQuestionStatus(challenge);
                  const isSelected = selectedId === challenge.id;
                  const statusClass =
                    status === "solved"
                      ? "border-emerald-300/50 bg-emerald-400/25 text-emerald-50"
                      : status === "wrong"
                        ? "border-rose-300/50 bg-rose-400/25 text-rose-50"
                        : "border-white/10 bg-slate-950/55 text-slate-200 hover:border-sky-300/40 hover:bg-sky-400/10";

                  return (
                    <button
                      key={challenge.id}
                      onClick={() => setSelectedId(challenge.id)}
                      title={challenge.title}
                      className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-black transition ${statusClass} ${
                        isSelected ? "ring-2 ring-sky-300/70 ring-offset-2 ring-offset-slate-950" : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {selectedTier && selectedChallenge && (
          <section className="rounded-lg border border-white/10 bg-white/[0.045] shadow-2xl shadow-black/20">
            <div className="border-b border-white/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${difficultyStyles[selectedChallenge.difficulty]}`}>
                    {selectedChallenge.difficulty}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-white">Question {selectedIndex + 1}: {selectedChallenge.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{selectedChallenge.description}</p>
                </div>
                {solvedSet.has(selectedChallenge.id) && (
                  <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    Solved
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => goToQuestion(selectedIndex - 1)}
                  disabled={selectedIndex <= 0}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {selectedIndex + 1} / {selectedTier.challenges.length}
                </span>
                <button
                  onClick={() => goToQuestion(selectedIndex + 1)}
                  disabled={selectedIndex >= selectedTier.challenges.length - 1}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>

              <ExpectedOutput challenge={selectedChallenge} />

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="text-sm font-bold text-white">Your SQL</label>
                  <span className="text-xs text-slate-400">{attempts[selectedChallenge.id] || 0} failed attempts</span>
                </div>
                <textarea
                  value={queries[selectedChallenge.id] || ""}
                  onChange={(event) => updateQuery(selectedChallenge.id, event.target.value)}
                  spellCheck="false"
                  className="h-40 w-full resize-none rounded-lg border border-white/10 bg-slate-950/70 p-4 font-mono text-sm leading-6 text-sky-50 outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="Write your SQL answer here..."
                />
              </div>

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

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCheckAnswer(selectedChallenge)}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Check Answer
                </button>
                <button
                  onClick={() => setRevealed((current) => ({ ...current, [selectedChallenge.id]: true }))}
                  disabled={(attempts[selectedChallenge.id] || 0) < 3}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-sky-300/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Eye className="h-4 w-4" />
                  Show Solution
                </button>
              </div>

              <div className="rounded-lg border border-violet-300/20 bg-violet-500/10 p-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                  <Lightbulb className="h-4 w-4" />
                  Hint
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{selectedChallenge.hint}</p>
              </div>

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

      <AnimatePresence>
        {celebrationTier && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative w-full max-w-md overflow-hidden rounded-lg border ${tierStyles[celebrationTier.id].border} bg-slate-950 p-6 text-center shadow-2xl`}
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

              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 18 }, (_, index) => (
                  <motion.span
                    key={index}
                    className={`absolute h-2 w-2 rounded-full ${tierStyles[celebrationTier.id].fill}`}
                    initial={{ left: "50%", top: "45%", opacity: 1, scale: 0.6 }}
                    animate={{
                      x: Math.cos(index) * (90 + index * 5),
                      y: Math.sin(index * 1.7) * (80 + index * 4),
                      opacity: [1, 1, 0],
                      scale: [0.6, 1.2, 0.2]
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4, delay: index * 0.035 }}
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

              <h2 className="mt-5 text-2xl font-black text-white">Congratulations!</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                You completed all 25 {celebrationTier.label} challenges.
              </p>
              <button
                onClick={() => setCelebrationTier(null)}
                className="mt-5 rounded-lg bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
              >
                Keep Practicing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
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
              <tr key={`${challenge.id}-${rowIndex}`} className="border-b border-white/5">
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
