import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function QueryResults({ result, error, elapsedMs, rowsChanged }) {
  if (error) {
    return (
      <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-4 text-sm text-rose-100">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" />
          SQL Error
        </div>
        <pre className="mt-3 whitespace-pre-wrap font-mono text-xs leading-5 text-rose-100/90">{error}</pre>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-950/50 p-5 text-sm text-slate-400">
        Results will appear here after you run a query.
      </div>
    );
  }

  const hasRows = result.columns?.length > 0;

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/55">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          Query executed
        </div>
        <div className="flex gap-2 text-xs text-slate-400">
          <span>{elapsedMs} ms</span>
          <span>{rowsChanged} rows changed</span>
        </div>
      </div>
      {hasRows ? (
        <div className="max-h-[28rem] overflow-auto scrollbar-thin">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-950 text-xs uppercase tracking-wide text-sky-200">
              <tr>
                {result.columns.map((column) => (
                  <th key={column} className="border-b border-white/10 px-4 py-3 font-semibold">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.values.map((row, rowIndex) => (
                <tr key={`${row.join("-")}-${rowIndex}`} className="border-b border-white/5 transition hover:bg-white/[0.04]">
                  {row.map((cell, cellIndex) => (
                    <td key={`${cellIndex}-${cell}`} className="px-4 py-3 text-slate-200">{cell === null ? <span className="text-slate-500">NULL</span> : String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-4 text-sm text-slate-300">Statement completed successfully. No tabular rows returned.</p>
      )}
    </div>
  );
}
