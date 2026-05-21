import { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Wand2 } from "lucide-react";
import QueryResults from "./QueryResults";
import { executeQuery, sampleQuery } from "../services/database";

const snippets = [
  "SELECT * FROM students ORDER BY gpa DESC;",
  "SELECT departments.name, COUNT(employees.id) AS team_size FROM departments LEFT JOIN employees ON departments.id = employees.department_id GROUP BY departments.name;",
  "SELECT category, ROUND(AVG(price), 2) AS avg_price FROM products GROUP BY category HAVING avg_price > 50;",
  "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);"
];

export default function SQLPlayground({ db, resetDatabase, onDatabaseChanged }) {
  const [query, setQuery] = useState(sampleQuery);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [elapsedMs, setElapsedMs] = useState("0.00");
  const [rowsChanged, setRowsChanged] = useState(0);

  const extractCreatedTableName = (sql) => {
    const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["'`]?([A-Za-z_][A-Za-z0-9_]*)["'`]?/i);
    return match ? match[1] : null;
  };

  const runQuery = () => {
    try {
      const response = executeQuery(db, query);
      setResult(response.results[0] || { columns: [], values: [] });
      setElapsedMs(response.elapsedMs);
      setRowsChanged(response.rowsChanged);
      setError("");

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

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-lg">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">SQL Playground</p>
          <h2 className="mt-1 text-2xl font-bold text-white">Practice queries in a live SQLite database</h2>
        </div>
        <div className="flex flex-wrap gap-2">
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
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Wand2 className="h-4 w-4 text-sky-300" />
            Sample queries
          </div>
          {snippets.map((snippet) => (
            <button
              key={snippet}
              onClick={() => setQuery(snippet)}
              className="w-full rounded-lg border border-white/10 bg-slate-950/50 p-3 text-left font-mono text-xs leading-5 text-slate-300 transition hover:border-sky-300/40 hover:bg-sky-400/10 hover:text-sky-100"
            >
              {snippet}
            </button>
          ))}
        </aside>
      </div>
      <div className="border-t border-white/10 p-4">
        <QueryResults result={result} error={error} elapsedMs={elapsedMs} rowsChanged={rowsChanged} />
      </div>
    </motion.section>
  );
}
