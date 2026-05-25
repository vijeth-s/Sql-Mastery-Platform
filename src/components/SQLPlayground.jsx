import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { sql, SQLite } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { Play, RotateCcw, Wand2, Shuffle, Clock, Star, Trash2, Copy } from "lucide-react";
import QueryResults from "./QueryResults";
import { executeQuery, sampleQuery, tableMetadata } from "../services/database";
import { sampleQueryBank } from "../data/sampleQueries";
import { usePlayground } from "../context/PlaygroundContext";

function pickRandom(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function splitLeadingComments(sqlText) {
  const lines = sqlText.replace(/\r\n/g, "\n").split("\n");
  const comments = [];
  let bodyStart = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === "" && comments.length === 0) {
      bodyStart = index + 1;
      continue;
    }
    if (line.trim().startsWith("--")) {
      comments.push(line.trim());
      bodyStart = index + 1;
      continue;
    }
    break;
  }

  return {
    comments: comments.join("\n"),
    body: lines.slice(bodyStart).join("\n").trim()
  };
}

function formatSqlBody(sqlText) {
  const compactSql = sqlText
    .trim()
    .replace(/\s+/g, " ");

  const createTableMatch = compactSql.match(/^(CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+[^(]+)\((.*)\)\s*;?$/i);
  if (createTableMatch) {
    const [, statementStart, columnList] = createTableMatch;
    const columns = columnList.split(",").map((column) => column.trim()).filter(Boolean);
    return `${statementStart.trim()} (\n${columns.map((column, index) => `${column}${index < columns.length - 1 ? "," : ""}`).join("\n")}\n);`;
  }

  return compactSql
    .replace(/\bWHERE\b/gi, "\nWHERE")
    .replace(/\bGROUP\s+BY\b/gi, "\nGROUP BY")
    .replace(/\bHAVING\b/gi, "\nHAVING")
    .replace(/\bORDER\s+BY\b/gi, "\nORDER BY")
    .replace(/\bLIMIT\b/gi, "\nLIMIT")
    .replace(/\bINNER\s+JOIN\b/gi, "\nINNER JOIN")
    .replace(/\bLEFT\s+JOIN\b/gi, "\nLEFT JOIN")
    .replace(/\bJOIN\b/gi, "\nJOIN")
    .replace(/\bON\b/gi, "\n  ON")
    .replace(/\bSELECT\b/gi, "SELECT\n")
    .replace(/\n+/g, "\n")
    .replace(/;\s*$/, ";");
}

function formatSqlForEditor(sqlText) {
  const { comments, body } = splitLeadingComments(sqlText);
  const formattedBody = body ? formatSqlBody(body) : "";
  return [comments, formattedBody].filter(Boolean).join("\n");
}

const schemaHint = Object.fromEntries(tableMetadata.map((table) => [table.name, []]));

const sqlHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#c084fc", fontWeight: "700" },
  { tag: tags.operatorKeyword, color: "#c084fc", fontWeight: "700" },
  { tag: tags.string, color: "#86efac" },
  { tag: tags.number, color: "#fbbf24" },
  { tag: tags.operator, color: "#fb7185" },
  { tag: tags.comment, color: "#94a3b8", fontStyle: "italic" },
  { tag: tags.variableName, color: "#e0f2fe" },
  { tag: tags.definition(tags.variableName), color: "#38bdf8" },
  { tag: tags.function(tags.variableName), color: "#67e8f9" },
  { tag: tags.punctuation, color: "#cbd5e1" }
]);

export default function SQLPlayground({ db, resetDatabase, onDatabaseChanged }) {
  const { pendingQuery, setPendingQuery } = usePlayground();
  const readStoredList = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  };
  const [query, setQuery] = useState(() => formatSqlForEditor(sampleQuery));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [elapsedMs, setElapsedMs] = useState("0.00");
  const [rowsChanged, setRowsChanged] = useState(0);
  const [visibleSnippets, setVisibleSnippets] = useState(() => pickRandom(sampleQueryBank, 4));
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState("history");
  const [history, setHistory] = useState(() => readStoredList("sql-query-history"));
  const [bookmarks, setBookmarks] = useState(() => readStoredList("sql-bookmarks"));
  const [poppedStarId, setPoppedStarId] = useState(null);
  const [clearingHistory, setClearingHistory] = useState(false);

  const loadQuery = (nextQuery) => {
    const { comments } = splitLeadingComments(query);
    setQuery(formatSqlForEditor([comments, nextQuery].filter(Boolean).join("\n")));
  };

  useEffect(() => {
    if (pendingQuery) {
      loadQuery(pendingQuery);
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
    const entry = {
      id: Date.now(),
      query,
      timestamp: new Date().toISOString(),
      rowCount
    };
    const updated = [entry, ...history].slice(0, 50);
    localStorage.setItem("sql-query-history", JSON.stringify(updated));
    setHistory(updated);
  };

  const removeFromHistory = (id) => {
    const updated = history.filter((entry) => entry.id !== id);
    localStorage.setItem("sql-query-history", JSON.stringify(updated));
    setHistory(updated);
  };

  const toggleBookmark = (entry) => {
    const isSaved = bookmarks.some((item) => item.id === entry.id);
    const updatedBookmarks = isSaved
      ? bookmarks.filter((item) => item.id !== entry.id)
      : [entry, ...bookmarks];

    localStorage.setItem("sql-bookmarks", JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
    setPoppedStarId(entry.id);
    window.setTimeout(() => setPoppedStarId(null), 260);
  };

  const removeFromSaved = (id) => {
    const updated = bookmarks.filter((entry) => entry.id !== id);
    localStorage.setItem("sql-bookmarks", JSON.stringify(updated));
    setBookmarks(updated);
  };

  const clearAllHistory = () => {
    if (window.confirm("Clear all query history? This cannot be undone.")) {
      localStorage.setItem("sql-query-history", JSON.stringify([]));
      setClearingHistory(true);
      window.setTimeout(() => setHistory([]), 0);
    }
  };

  const isBookmarked = (id) => bookmarks.some((entry) => entry.id === id);

  const historyCardExit = {
    opacity: 0,
    x: 360,
    transition: { duration: 0.22, ease: "easeIn" }
  };

  const staggeredHistoryExit = (index) => ({
    opacity: 0,
    x: 360,
    transition: { duration: 0.22, delay: index * 0.15, ease: "easeIn" }
  });

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
          <CodeMirror
            value={query}
            onChange={(value) => setQuery(value)}
            extensions={[sql({ dialect: SQLite, schema: schemaHint, upperCaseKeywords: true }), syntaxHighlighting(sqlHighlightStyle), EditorView.lineWrapping]}
            theme={oneDark}
            className="h-[24rem] overflow-auto rounded-b-lg font-mono text-sm"
            basicSetup={{ lineNumbers: true, bracketMatching: true, autocompletion: true }}
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
                  onClick={() => loadQuery(snippet)}
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
              <div className="flex items-center gap-2">
                {historyTab === "history" && history.length > 0 && (
                  <button
                    onClick={clearAllHistory}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
                    title="Clear all history"
                  >
                    <Trash2 className="h-3 w-3 inline mr-1" />
                    Clear History
                  </button>
                )}
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
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
              {historyTab === "history" && history.length === 0 && !clearingHistory && (
                <p className="text-xs text-slate-400 p-2 text-center">No queries yet</p>
              )}
              {historyTab === "bookmarks" && bookmarks.length === 0 && (
                <p className="text-xs text-slate-400 p-2 text-center">No bookmarks yet</p>
              )}

              <AnimatePresence onExitComplete={() => setClearingHistory(false)}>
                {historyTab === "history" &&
                  history.map((entry, index) => {
                    const saved = isBookmarked(entry.id);
                    const date = new Date(entry.timestamp);
                    const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                    const truncated = entry.query.substring(0, 60) + (entry.query.length > 60 ? "..." : "");
                    return (
                      <motion.div
                        key={entry.id}
                        exit={clearingHistory ? staggeredHistoryExit(index) : historyCardExit}
                        className="rounded-lg border border-white/10 bg-slate-950/60 p-2 text-xs space-y-1.5"
                      >
                        <p className="text-slate-300 font-mono leading-4">{truncated}</p>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-slate-500">{formatted}</span>
                          <span className="px-1.5 py-0.5 bg-sky-400/20 text-sky-200 rounded text-xs font-mono">{entry.rowCount} rows</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => loadQuery(entry.query)}
                            className="flex-1 rounded px-2 py-1 text-xs font-semibold bg-sky-400/20 text-sky-200 hover:bg-sky-400/30 transition"
                            title="Load this query"
                          >
                            <Copy className="h-3 w-3 inline mr-1" />
                            Load
                          </button>
                          <button
                            onClick={() => toggleBookmark(entry)}
                            className={`px-2 py-1 rounded border transition ${
                              saved
                                ? "border-amber-300/25 bg-amber-300/15 text-amber-300 hover:bg-amber-300/25 hover:text-amber-200"
                                : "border-white/10 bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-amber-300"
                            }`}
                            title={saved ? "Remove from saved" : "Add to saved"}
                          >
                            <motion.span
                              className="inline-flex"
                              animate={poppedStarId === entry.id ? { y: [0, -6, 0], scale: [1, 1.3, 1] } : { y: 0, scale: 1 }}
                              transition={{ duration: 0.24, ease: "easeOut" }}
                            >
                              <Star className="h-3 w-3" fill={saved ? "currentColor" : "none"} />
                            </motion.span>
                          </button>
                          <button
                            onClick={() => removeFromHistory(entry.id)}
                            className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition"
                            title="Remove from history"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>

              <AnimatePresence>
                {historyTab === "bookmarks" &&
                  bookmarks.map((entry) => {
                    const date = new Date(entry.timestamp);
                    const formatted = date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                    const truncated = entry.query.substring(0, 60) + (entry.query.length > 60 ? "..." : "");
                    return (
                      <motion.div
                        key={entry.id}
                        exit={historyCardExit}
                        className="rounded-lg border border-white/10 bg-slate-950/60 p-2 text-xs space-y-1.5"
                      >
                        <p className="text-slate-300 font-mono leading-4">{truncated}</p>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-slate-500">{formatted}</span>
                          <span className="px-1.5 py-0.5 bg-sky-400/20 text-sky-200 rounded text-xs font-mono">{entry.rowCount} rows</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => loadQuery(entry.query)}
                            className="flex-1 rounded px-2 py-1 text-xs font-semibold bg-sky-400/20 text-sky-200 hover:bg-sky-400/30 transition"
                            title="Load this query"
                          >
                            <Copy className="h-3 w-3 inline mr-1" />
                            Load
                          </button>
                          <button
                            onClick={() => removeFromSaved(entry.id)}
                            className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition"
                            title="Remove from saved"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
