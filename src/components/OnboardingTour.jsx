import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const steps = [
  {
    title: "SQL Editor",
    description:
      "Write any SQL query here and press Run Query — the database lives entirely in your browser.",
    target: "editor-shell"
  },
  {
    title: "Database Tables",
    description:
      "These are your 6 live tables. Click any card to see a data preview.",
    target: "tables-preview"
  },
  {
    title: "Lessons",
    description:
      "Head to Beginner, Intermediate, or Advanced to learn SQL concepts with syntax and examples.",
    target: "lessons-nav"
  },
  {
    title: "Challenges",
    description:
      "Test your skills with graded challenges and check your answers instantly.",
    target: "challenges-nav"
  },
  {
    title: "Cheat Sheet",
    description:
      "Quick-reference all key SQL commands in one place.",
    target: "cheatsheet-nav"
  }
];

export default function OnboardingTour({ open, onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const current = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const finish = () => {
    try {
      localStorage.setItem("sql-tour-done", "1");
    } catch { /* ignore */ }
    onClose();
    setStepIndex(0);
  };

  const skip = () => {
    finish();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
          onClick={skip}
        >
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-4 max-w-sm rounded-xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                {stepIndex + 1} of {steps.length}
              </span>
              <button
                onClick={skip}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                title="Skip tour"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-bold text-white">{current.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{current.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={skip}
                className="text-xs font-semibold text-slate-400 underline underline-offset-2 transition hover:text-slate-200"
              >
                Skip tour
              </button>
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      i === stepIndex ? "bg-sky-400" : i < stepIndex ? "bg-sky-400/40" : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="rounded-lg bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02]"
              >
                {isLast ? "Finish" : "Next →"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
