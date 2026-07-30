import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, BookOpen, Code2, Copyright, Database, ExternalLink, FileCode2, Github, GraduationCap, HelpCircle, Keyboard, Linkedin, Mail, Menu, Search, Sparkles, Trophy, X } from "lucide-react";
import Sidebar from "./components/Sidebar";
import SQLPlayground from "./components/SQLPlayground";
import LessonPanel from "./components/LessonPanel";
import CheatSheet from "./components/CheatSheet";
import Challenges from "./components/Challenges";
import Progress from "./components/Progress";
import OnboardingTour from "./components/OnboardingTour";
import TablePreview from "./components/TablePreview";
import LevelDescriptions from "./components/LevelDescriptions";
import MobileMenu from "./components/MobileMenu";
import { lessonsData } from "./data/lessonsData";
import { createDatabase, tableMetadata } from "./services/database";
import { PlaygroundProvider, usePlayground } from "./context/PlaygroundContext";

const navItems = [
  { to: "/", label: "Playground", icon: Code2 },
  { to: "/beginner", label: "Beginner", icon: BookOpen },
  { to: "/intermediate", label: "Intermediate", icon: GraduationCap },
  { to: "/advanced", label: "Advanced", icon: Sparkles },
  { to: "/challenges", label: "Challenges", icon: Trophy },
  { to: "/progress", label: "Progress", icon: BarChart2 },
  { to: "/cheat-sheet", label: "Cheat Sheet", icon: FileCode2 }
];

function readStoredSearch() {
  try {
    return window.localStorage.getItem("lesson-search") || "";
  } catch {
    return "";
  }
}

function writeStoredSearch(value) {
  try {
    window.localStorage.setItem("lesson-search", value);
  } catch {
    // Lesson search state still works for the current session if storage is unavailable.
  }
}

function LessonsPage({ level, searchTerm, setSearchTerm, dialect, setDialect }) {
  const lessons = lessonsData[level];
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">{level} path</p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">{level[0].toUpperCase() + level.slice(1)} SQL Lessons</h1>
            <p className="mt-1 max-w-2xl truncate text-sm text-slate-300">Structured lessons with syntax, examples, sample output, and practical tips.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="relative block w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-11 w-full rounded-lg border border-white/10 bg-slate-950/70 pl-10 pr-3 text-sm text-white outline-none transition focus:border-sky-300/60 focus:ring-2 focus:ring-sky-400/20"
                placeholder="Search lessons"
              />
            </label>
          </div>
        </div>
        {dialect !== "sqlite" && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-100">
            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <p><span className="font-semibold text-amber-200">Dialect:</span> <span className="font-mono uppercase">{dialect}</span> syntax shown below — lessons adapt to your selected dialect. Queries always run on SQLite in the playground.</p>
          </div>
        )}
        <LessonPanel lessons={lessons} searchTerm={searchTerm} />
      </div>
    </main>
  );
}

function PlaygroundPage({ db, resetDatabase, refreshKey, onDatabaseChanged, tableMetadata, dialect }) {
  return (
    <main className="grid min-w-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-4 pb-8 pt-4 xl:grid-cols-[minmax(0,1fr)_360px] lg:px-6">
      <div className="space-y-4">
        <SQLPlayground db={db} resetDatabase={resetDatabase} onDatabaseChanged={onDatabaseChanged} />
      </div>
      <aside className="space-y-4">
        <TablePreview db={db} refreshKey={refreshKey} tableMetadata={tableMetadata} />
        <LevelDescriptions />
      </aside>
    </main>
  );
}

const shortcuts = [
  { keys: "Ctrl+Enter / ⌘+Enter", label: "Run current query" },
  { keys: "Ctrl+Shift+R", label: "Reset database" },
  { keys: "Ctrl+H", label: "Toggle history drawer" },
  { keys: "?", label: "Open shortcuts help" }
];

function ShortcutsModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                <Keyboard className="mr-2 inline h-4 w-4 text-sky-300" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3"
                >
                  <span className="text-sm text-slate-300">{s.label}</span>
                  <kbd className="rounded-md border border-white/10 bg-slate-800 px-2.5 py-1 font-mono text-xs text-sky-200 shadow-sm">
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">Shortcuts are active when not typing in a text field.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HelpFloatingButton({ onOpenShortcuts, onOpenTour }) {
  const [open, setOpen] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <div className="fixed bottom-24 right-6 z-[80] sm:bottom-28">
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="shortcuts-btn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: -80 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => setHoveredBtn("shortcuts")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={() => { onOpenShortcuts(); setOpen(false); }}
              className="absolute right-0 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-xl shadow-xl backdrop-blur-xl transition hover:border-sky-300/40 hover:bg-slate-800"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="relative">
                ⌨️
                <AnimatePresence>
                  {hoveredBtn === "shortcuts" && (
                    <motion.div
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 shadow-xl"
                    >
                      Keyboard Shortcuts
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
            <motion.button
              key="tour-btn"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: -80 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onMouseEnter={() => setHoveredBtn("tour")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={() => { onOpenTour(); setOpen(false); }}
              className="absolute bottom-0 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-xl shadow-xl backdrop-blur-xl transition hover:border-violet-300/40 hover:bg-slate-800"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="relative">
                🗺️
                <AnimatePresence>
                  {hoveredBtn === "tour" && (
                    <motion.div
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 shadow-xl"
                    >
                      Take the Tour
                    </motion.div>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-2xl shadow-2xl backdrop-blur-xl transition hover:border-sky-300/40 hover:bg-slate-800"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5 text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="help"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              ❓
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function AppContent() {
  const [db, setDb] = useState(null);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [startupError, setStartupError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(readStoredSearch);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tableMetadataState, setTableMetadataState] = useState(tableMetadata);
  const [tourOpen, setTourOpen] = useState(false);
  const { runQueryRef, toggleHistoryRef, shortcutsModalOpen, setShortcutsModalOpen } = usePlayground();
  const location = useLocation();

  const [dialect, setDialect] = useState(() => {
    try {
      return localStorage.getItem("sql-dialect") || "sqlite";
    } catch {
      return "sqlite";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sql-dialect", dialect);
    } catch { /* ignore */ }
  }, [dialect]);

  const resetDatabase = useCallback(async () => {
    setIsLoadingDb(true);
    setStartupError("");
    try {
      const nextDb = await createDatabase();
      setDb((previous) => {
        previous?.close();
        return nextDb;
      });
      setTableMetadataState(tableMetadata);
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setStartupError(error instanceof Error ? error.message : "SQLite failed to initialize.");
    } finally {
      setIsLoadingDb(false);
    }
  }, []);

  const handleDatabaseChanged = useCallback(({ createdTableName, createdTableDescription } = {}) => {
    setRefreshKey((key) => key + 1);

    if (!createdTableName) return;

    setTableMetadataState((previous) => {
      if (previous.some((table) => table.name === createdTableName)) {
        return previous;
      }

      const accentClasses = [
        "from-sky-400 to-cyan-300",
        "from-violet-400 to-fuchsia-300",
        "from-indigo-400 to-sky-300",
        "from-cyan-300 to-emerald-300",
        "from-blue-400 to-violet-300",
        "from-fuchsia-400 to-sky-300",
        "from-amber-400 to-orange-400",
        "from-emerald-400 to-teal-300"
      ];

      const nextAccent = accentClasses[previous.length % accentClasses.length];
      return [
        ...previous,
        {
          name: createdTableName,
          description: createdTableDescription ?? `${createdTableName} table.`,
          accent: nextAccent
        }
      ];
    });
  }, []);

  useEffect(() => {
    setIsLoadingDb(true);
    setStartupError("");
    resetDatabase();
  }, [resetDatabase]);

  useEffect(() => {
    writeStoredSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    // Check for first visit
    try {
      if (!localStorage.getItem("sql-tour-done")) {
        const timer = setTimeout(() => setTourOpen(true), 800);
        return () => clearTimeout(timer);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Don't trigger shortcuts when typing in inputs/textarea
      const tag = e.target.tagName;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(tag) && e.key !== "Escape") return;

      // Escape: close any open panel
      if (e.key === "Escape") {
        setShortcutsModalOpen(false);
        setTourOpen(false);
        return;
      }

      // Ctrl+Enter / Cmd+Enter: Run query
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runQueryRef.current?.();
        return;
      }

      // Ctrl+Shift+R: Reset database
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        resetDatabase();
        return;
      }

      // Ctrl+H: Toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === "h") {
        e.preventDefault();
        toggleHistoryRef.current?.();
        return;
      }

      // ?: Open shortcuts modal
      if (e.key === "?" && !(e.ctrlKey || e.metaKey)) {
        setShortcutsModalOpen(true);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runQueryRef, toggleHistoryRef, resetDatabase, setShortcutsModalOpen]);

  const currentTitle = useMemo(() => navItems.find((item) => item.to === location.pathname)?.label || "Playground", [location.pathname]);

  const footerLinks = [
    { href: "https://www.linkedin.com/in/vijeth-shetty-334s/", label: "LinkedIn", icon: Linkedin },
    { href: "mailto:vijethshetty334@gmail.com", label: "Email", icon: Mail },
    { href: "https://github.com/vijeth-s/", label: "GitHub", icon: Github },
    { href: "https://github.com/vijeth-s/Sql-Mastery-Platform", label: "Project Repo", icon: ExternalLink }
  ];

  return (
    <>
      <div className="min-h-screen overflow-hidden bg-grid-glow bg-[length:44px_44px] text-slate-100">
        <div className="flex h-screen">
          <Sidebar navItems={navItems} dialect={dialect} setDialect={setDialect} />
          <MobileMenu navItems={navItems} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} dialect={dialect} setDialect={setDialect} />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/80 px-4 py-2 backdrop-blur-xl lg:px-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileOpen(true)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:border-sky-300/40 hover:text-white lg:hidden"
                    aria-label="Open navigation"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">SQL Mastery Platform</p>
                    <h1 className="text-lg font-bold text-white md:text-xl">{currentTitle}</h1>
                  </div>
                </div>
                <div className="hidden items-center gap-1.5 xl:flex">
                  <nav className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? "bg-sky-400/15 text-sky-100" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    ))}
                  </nav>
                  <select
                    value={dialect}
                    onChange={(e) => setDialect(e.target.value)}
                    className="rounded-md border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 outline-none transition focus:border-sky-300/50"
                  >
                    <option value="sqlite">SQLite</option>
                    <option value="postgres">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                  </select>
                </div>
              </div>
            </header>

            {startupError ? (
              <main className="flex flex-1 items-center justify-center p-4">
                <div className="max-w-lg rounded-lg border border-rose-400/30 bg-rose-500/10 p-6 text-center shadow-2xl shadow-black/30">
                  <Database className="mx-auto h-8 w-8 text-rose-200" />
                  <p className="mt-3 text-base font-bold text-white">SQLite could not start</p>
                  <p className="mt-2 text-sm leading-6 text-rose-100/90">{startupError}</p>
                  <button onClick={resetDatabase} className="mt-4 rounded-lg bg-rose-400 px-4 py-2 text-sm font-bold text-slate-950">
                    Retry
                  </button>
                </div>
              </main>
            ) : isLoadingDb ? (
              <div className="flex flex-1 items-center justify-center">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-6 text-center">
                  <Database className="mx-auto h-8 w-8 text-sky-300" />
                  <p className="mt-3 text-sm font-semibold text-white">Booting SQLite WASM</p>
                  <p className="mt-1 text-xs text-slate-400">Seeding fresh sample tables for this session.</p>
                </motion.div>
              </div>
            ) : (
              <>
                <Routes>
                  <Route path="/" element={<PlaygroundPage db={db} resetDatabase={resetDatabase} refreshKey={refreshKey} onDatabaseChanged={handleDatabaseChanged} tableMetadata={tableMetadataState} dialect={dialect} />} />
                  <Route path="/beginner" element={<LessonsPage level="beginner" searchTerm={searchTerm} setSearchTerm={setSearchTerm} dialect={dialect} setDialect={setDialect} />} />
                  <Route path="/intermediate" element={<LessonsPage level="intermediate" searchTerm={searchTerm} setSearchTerm={setSearchTerm} dialect={dialect} setDialect={setDialect} />} />
                  <Route path="/advanced" element={<LessonsPage level="advanced" searchTerm={searchTerm} setSearchTerm={setSearchTerm} dialect={dialect} setDialect={setDialect} />} />
                  <Route path="/challenges" element={<Challenges db={db} />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/cheat-sheet" element={<CheatSheet dialect={dialect} />} />
                </Routes>

                <footer className="mt-auto border-t border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl">
                  <div className="mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-sm text-slate-400">
                      <Copyright className="h-4 w-4" />
                      <span>2026 Vijeth. All rights reserved.</span>
                    </p>

                    <div className="flex items-center gap-2">
                      {footerLinks.map(({ href, label, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-sky-300/40 hover:bg-slate-800 hover:text-white"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="pointer-events-none absolute bottom-full mb-2 hidden whitespace-nowrap rounded-md border border-white/10 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 shadow-lg group-hover:block">
                            {label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </footer>
              </>
            )}
          </div>
        </div>
      </div>
      <ShortcutsModal open={shortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)} />
      <OnboardingTour open={tourOpen} onClose={() => setTourOpen(false)} />
      <HelpFloatingButton
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onOpenTour={() => setTourOpen(true)}
      />
    </>
  );
}


export default function App() {
  return (
    <PlaygroundProvider>
      <AppContent />
    </PlaygroundProvider>
  );
}
