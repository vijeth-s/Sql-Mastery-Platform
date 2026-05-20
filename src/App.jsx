import { useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Code2, Database, FileCode2, GraduationCap, Menu, Search, Sparkles } from "lucide-react";
import Sidebar from "./components/Sidebar";
import SQLPlayground from "./components/SQLPlayground";
import LessonPanel from "./components/LessonPanel";
import CheatSheet from "./components/CheatSheet";
import DatabaseCard from "./components/DatabaseCard";
import TablePreview from "./components/TablePreview";
import MobileMenu from "./components/MobileMenu";
import { lessonsData } from "./data/lessonsData";
import { createDatabase, getTableCount, tableMetadata } from "./services/database";

const navItems = [
  { to: "/", label: "Playground", icon: Code2 },
  { to: "/beginner", label: "Beginner", icon: BookOpen },
  { to: "/intermediate", label: "Intermediate", icon: GraduationCap },
  { to: "/advanced", label: "Advanced", icon: Sparkles },
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

function LessonsPage({ level, searchTerm, setSearchTerm }) {
  const lessons = lessonsData[level];
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">{level} path</p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">{level[0].toUpperCase() + level.slice(1)} SQL Lessons</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Structured lessons with syntax, examples, sample output, and practical tips.</p>
          </div>
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
        <LessonPanel lessons={lessons} searchTerm={searchTerm} />
      </div>
    </main>
  );
}

function PlaygroundPage({ db, resetDatabase, refreshKey, onDatabaseChanged }) {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (!db) return;
    const nextCounts = Object.fromEntries(tableMetadata.map((table) => [table.name, getTableCount(db, table.name)]));
    setCounts(nextCounts);
  }, [db, refreshKey]);

  return (
    <main className="grid min-w-0 flex-1 grid-cols-1 gap-4 overflow-y-auto px-4 pb-8 pt-4 xl:grid-cols-[minmax(0,1fr)_360px] lg:px-6">
      <div className="space-y-4">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tableMetadata.map((table, index) => (
            <DatabaseCard key={table.name} table={table} count={counts[table.name] ?? 0} index={index} />
          ))}
        </section>
        <SQLPlayground db={db} resetDatabase={resetDatabase} onDatabaseChanged={onDatabaseChanged} />
      </div>
      <aside className="space-y-4">
        <TablePreview db={db} refreshKey={refreshKey} />
        <LessonPanel lessons={[...lessonsData.beginner, ...lessonsData.intermediate].slice(0, 5)} compact />
      </aside>
    </main>
  );
}

export default function App() {
  const [db, setDb] = useState(null);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [startupError, setStartupError] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(readStoredSearch);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();

  const resetDatabase = async () => {
    setIsLoadingDb(true);
    setStartupError("");
    try {
      const nextDb = await createDatabase();
      setDb((previous) => {
        previous?.close();
        return nextDb;
      });
      setRefreshKey((key) => key + 1);
    } catch (error) {
      setStartupError(error instanceof Error ? error.message : "SQLite failed to initialize.");
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    setIsLoadingDb(true);
    setStartupError("");
    resetDatabase();
  }, []);

  useEffect(() => {
    writeStoredSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }, [location.pathname]);

  const currentTitle = useMemo(() => navItems.find((item) => item.to === location.pathname)?.label || "Playground", [location.pathname]);

  return (
    <div className="min-h-screen overflow-hidden bg-grid-glow bg-[length:44px_44px] text-slate-100">
      <div className="flex h-screen">
        <Sidebar navItems={navItems} />
        <MobileMenu navItems={navItems} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-ink-950/80 px-4 py-3 backdrop-blur-xl lg:px-6">
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
              <nav className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-1 xl:flex">
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
            <Routes>
              <Route path="/" element={<PlaygroundPage db={db} resetDatabase={resetDatabase} refreshKey={refreshKey} onDatabaseChanged={() => setRefreshKey((key) => key + 1)} />} />
              <Route path="/beginner" element={<LessonsPage level="beginner" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
              <Route path="/intermediate" element={<LessonsPage level="intermediate" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
              <Route path="/advanced" element={<LessonsPage level="advanced" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
              <Route path="/cheat-sheet" element={<CheatSheet />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}
