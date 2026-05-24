import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, RotateCcw, Wand2, Shuffle, Clock, Star, Trash2, Copy } from "lucide-react";
import QueryResults from "./QueryResults";
import { executeQuery, sampleQuery } from "../services/database";
import { sampleQueryBank } from "../data/sampleQueries";
import { usePlayground } from "../context/PlaygroundContext";

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

export default function SQLPlayground({ db, resetDatabase, onDatabaseChanged }) {
  const { pendingQuery, setPendingQuery } = usePlayground();
  const [query, setQuery] = useState(sampleQuery);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [elapsedMs, setElapsedMs] = useState("0.00");
  const [rowsChanged, setRowsChanged] = useState(0);
  const [visibleSnippets, setVisibleSnippets] = useState(() => pickRandom(sampleQueryBank, 4));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState("history");

  useEffect(() => {
    if (pendingQuery) {
      setQuery(pendingQuery);
      setPendingQuery("");
    }
  }, [pendingQuery, setPendingQuery]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && historyOpen) {
        setHistoryOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [historyOpen]);

  const extractCreatedTableName = (sql) => {
    const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["'`]?([A-Za-z_][A-Za-z0-9_]*)["'`]?/i);
    return match ? match[1] : null;
  };

  const saveToHistory = (query, rowCount) => {
    const history = JSON.parse(localStorage.getItem("sql-query-history") || "[]");
    const entry = {
      id: Date.now(),
      query,
      timestamp: new Date().toISOString(),
      rowCount
    };
    const updated = [entry, ...history].slice(0, 50);
    localStorage.setItem("sql-query-history", JSON.stringify(updated));
  };

  const getHistory = () => JSON.parse(localStorage.getItem("sql-query-history") || "[]");
  const getBookmarks = () => JSON.parse(localStorage.getItem("sql-bookmarks") || "[]");

  const removeFromHistory = (id) => {
    const history = getHistory().filter(h => h.id !== id);
    localStorage.setItem("sql-query-history", JSON.stringify(history));
    setQuery(query); // trigger re-render
  };

  const toggleBookmark = (entry) => {
    const bookmarks = getBookmarks();
    const idx = bookmarks.findIndex(b => b.id === entry.id);
    if (idx !== -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(entry);
    }
    localStorage.setItem("sql-bookmarks", JSON.stringify(bookmarks));
    setQuery(query); // trigger re-render
  };

  const isBookmarked = (id) => getBookmarks().some(b => b.id === id);

  const runQuery = () => {
    try {
      const response = executeQuery(db, query);
      setResult(response.results[0] || { columns: [], values: [] });
      setElapsedMs(response.elapsedMs);
      setRowsChanged(response.rowsChanged);
      setError("");

      saveToHistory(query, response.results[0]?.values?.length || 0);

      const createdTableName = extractCreatedTableName(query);
      if (createdTableName) {
        const description = window.prompt(`Table "${createdTableName}" was created successfully. Enter a short description:`)?.trim();
        onDatabaseChanged({
          createdTableName,
          createdTableDescription: description || `${createdTableName} table.`
        });
        return;
      }

      onDatabaseChanged();
    } catch (err) {
      setError(err.message);
      setResult(null);
    }
  };

  const handleReset = async () => {
    await resetDatabase();
    setResult(null);
    setError("");
    setRowsChanged(0);
    setElapsedMs("0.00");
  };

  const randomizeSnippets = () => {
    setVisibleSnippets((prev) => {
      let next;
      do {
        next = pickRandom(sampleQueryBank, 4);
      } while (JSON.stringify(next) === JSON.stringify(prev));
      return next;
    });
  };

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-lg">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">SQL Playground</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Practice queries in a live SQLite database</h2>
        </div>
        <div className="flex flex-wrap gap-2 self-end justify-end md:self-auto">
          <button onClick={() => setHistoryOpen(!historyOpen)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-300/50 hover:text-white">
            <Clock className="h-4 w-4" />
            History
          </button>
          <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-300/50 hover:text-white">
            <RotateCcw className="h-4 w-4" />
            Reset Database
          </button>
          <button onClick={runQuery} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-400 to-violet-500 px-4 py-2 text-sm font-bold text-white shadow-glow transition hover:scale-[1.02]">
            <Play className="h-4 w-4 fill-white" />
            Run Query
          </button>
        </div>
      </div>

      <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="overflow-hidden rounded-lg border border-white/10 editor-shell">
          <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/70 px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-xs text-slate-400">query.sql</span>
          </div>
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            spellCheck="false"
            className="h-[24rem] w-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-sky-50 outline-none scrollbar-thin selection:bg-sky-400/30"
          />
        </div>

        <aside className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-sm font-semibold text-white">
            <span className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-sky-300" />
              Sample queries
            </span>
            <button
              onClick={randomizeSnippets}
              title="Load random queries"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-300/40 hover:bg-slate-900"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Randomize
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={visibleSnippets.join("||")}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-2"
            >
              {visibleSnippets.map((snippet) => (
                <button
                  key={snippet}
                  onClick={() => setQuery(snippet)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/50 p-3 text-left font-mono text-xs leading-5 text-slate-300 transition hover:border-sky-300/40 hover:bg-sky-400/10 hover:text-sky-100"
                >
                  {snippet}
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
      <div className="border-t border-white/10 p-4">
        <QueryResults result={result} error={error} elapsedMs={elapsedMs} rowsChanged={rowsChanged} />
      </div>

      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setHistoryOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {historyOpen && (
          <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ duration: 0.2 }}
            className="fixed right-0 top-0 z-50 h-screen w-80 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-white/10 shadow-lg overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="text-lg font-bold text-white">Queries</h3>
              <button
                onClick={() => setHistoryOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-1 border-b border-white/10 bg-slate-950/50 p-2">
              <button
                onClick={() => setHistoryTab("history")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  historyTab === "history"
                    ? "bg-slate-700 text-white"
                    : "bg-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                History
              </button>
              <button
                onClick={() => setHistoryTab("bookmarks")}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition flex items-center justify-center gap-1 ${
                  historyTab === "bookmarks"
                    ? "bg-slate-700 text-white"
                    : "bg-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                <Star className="h-3 w-3" />
                Saved
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 p-3">
              {historyTab === "history" && getHistory().length === 0 && (
                <p className="text-xs text-slate-400 p-2 text-center">No queries yet</p>
              )}
              {historyTab === "bookmarks" && getBookmarks().length === 0 && (
                <p className="text-xs text-slate-400 p-2 text-center">No bookmarks yet</p>
              )}

              {historyTab === "history" &&
                getHistory().map((entry) => {
                  const date = new Date(entry.timestamp);
                  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                  const truncated = entry.query.substring(0, 60) + (entry.query.length > 60 ? "…" : "");
                  return (
                    <div key={entry.id} className="rounded-lg border border-white/10 bg-slate-950/60 p-2 text-xs space-y-1.5">
                      <p className="text-slate-300 font-mono leading-4">{truncated}</p>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-slate-500">{formatted}</span>
                        <span className="px-1.5 py-0.5 bg-sky-400/20 text-sky-200 rounded text-xs font-mono">{entry.rowCount} rows</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setQuery(entry.query)}
                          className="flex-1 rounded px-2 py-1 text-xs font-semibold bg-sky-400/20 text-sky-200 hover:bg-sky-400/30 transition"
                          title="Load this query"
                        >
                          <Copy className="h-3 w-3 inline mr-1" />
                          Load
                        </button>
                        <button
                          onClick={() => toggleBookmark(entry)}
                          className={`px-2 py-1 rounded transition ${
                            isBookmarked(entry.id)
                              ? "bg-amber-400/20 text-amber-200 hover:bg-amber-400/30"
                              : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                          }`}
                          title={isBookmarked(entry.id) ? "Remove bookmark" : "Add bookmark"}
                        >
                          <Star className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromHistory(entry.id)}
                          className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition"
                          title="Remove from history"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

              {historyTab === "bookmarks" &&
                getBookmarks().map((entry) => {
                  const date = new Date(entry.timestamp);
                  const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                  const truncated = entry.query.substring(0, 60) + (entry.query.length > 60 ? "…" : "");
                  return (
                    <div key={entry.id} className="rounded-lg border border-white/10 bg-slate-950/60 p-2 text-xs space-y-1.5">
                      <p className="text-slate-300 font-mono leading-4">{truncated}</p>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-slate-500">{formatted}</span>
                        <span className="px-1.5 py-0.5 bg-sky-400/20 text-sky-200 rounded text-xs font-mono">{entry.rowCount} rows</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setQuery(entry.query)}
                          className="flex-1 rounded px-2 py-1 text-xs font-semibold bg-sky-400/20 text-sky-200 hover:bg-sky-400/30 transition"
                          title="Load this query"
                        >
                          <Copy className="h-3 w-3 inline mr-1" />
                          Load
                        </button>
                        <button
                          onClick={() => toggleBookmark(entry)}
                          className="px-2 py-1 rounded bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 transition"
                          title="Remove bookmark"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
