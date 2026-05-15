import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lightbulb } from "lucide-react";

export default function LessonPanel({ lessons, searchTerm = "", compact = false }) {
  const [openSection, setOpenSection] = useState("");
  const [openLesson, setOpenLesson] = useState("");
  const filtered = lessons.filter((lesson) => {
    const text = `${lesson.section || ""} ${lesson.title} ${lesson.explanation} ${lesson.syntax} ${lesson.example}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });
  const groupedLessons = compact
    ? [{ section: "", lessons: filtered }]
    : filtered.reduce((groups, lesson) => {
        const section = lesson.section || "Lessons";
        const existing = groups.find((group) => group.section === section);
        if (existing) {
          existing.lessons.push(lesson);
        } else {
          groups.push({ section, lessons: [lesson] });
        }
        return groups;
      }, []);

  return (
    <section className={compact ? "glass rounded-lg p-4" : "grid gap-4"}>
      {compact && <h2 className="mb-3 text-base font-bold text-white">Lesson preview</h2>}
      <div className={compact ? "space-y-3" : "grid gap-4"}>
        {groupedLessons.map((group) => (
          <div key={group.section || "compact"} className={compact ? "space-y-3" : "space-y-3"}>
            {!compact && (
              <button
                onClick={() => {
                  setOpenSection((current) => (current === group.section ? "" : group.section));
                  setOpenLesson("");
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-left transition hover:border-sky-300/40 hover:bg-sky-400/15"
                aria-expanded={openSection === group.section}
              >
                <div>
                  <h2 className="text-base font-bold text-white">{group.section}</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-200">{group.lessons.length} topics</p>
                </div>
                <ChevronDown className={`h-5 w-5 shrink-0 text-sky-200 transition ${openSection === group.section ? "rotate-180" : ""}`} />
              </button>
            )}
            {(compact || openSection === group.section) && group.lessons.map((lesson) => {
              const index = filtered.findIndex((item) => item.title === lesson.title && item.section === lesson.section);
              const lessonId = `${lesson.section || "lesson"}-${lesson.title}`;

              return (
                <motion.article
                  key={lessonId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.015, 0.24) }}
                  className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.055] shadow-xl shadow-black/10 transition hover:border-sky-300/30"
                >
                  <button
                    onClick={() => !compact && setOpenLesson((current) => (current === lessonId ? "" : lessonId))}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-white/[0.04]"
                    aria-expanded={compact || openLesson === lessonId}
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Lesson {index + 1}</p>
                      <h3 className="mt-1 text-lg font-bold text-white">{lesson.title}</h3>
                      {!compact && <p className="mt-1 text-sm text-slate-400">Click to open the full lesson.</p>}
                    </div>
                    {!compact && <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${openLesson === lessonId ? "rotate-180 text-sky-300" : ""}`} />}
                  </button>

                  <AnimatePresence initial={false}>
                    {(!compact && openLesson === lessonId) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 p-4">
                          <p className="text-sm leading-6 text-slate-300">{lesson.explanation}</p>
                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <CodeBlock label="Syntax" value={lesson.syntax} />
                            <CodeBlock label="Example Query" value={lesson.example} />
                            <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Example Output</p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">{lesson.output}</p>
                            </div>
                            <div className="rounded-lg border border-violet-300/20 bg-violet-500/10 p-3">
                              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                                <Lightbulb className="h-4 w-4" />
                                Notes
                              </p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">{lesson.tips}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {compact && (
                    <div className="px-4 pb-4">
                      <p className="text-sm leading-6 text-slate-300">{lesson.explanation}</p>
                      <code className="mt-3 block rounded-md bg-slate-950/70 p-2 font-mono text-xs text-sky-100">{lesson.example}</code>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm text-slate-400">No lessons match your search.</div>}
    </section>
  );
}

function CodeBlock({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">{label}</p>
      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-slate-100">{value}</pre>
    </div>
  );
}
