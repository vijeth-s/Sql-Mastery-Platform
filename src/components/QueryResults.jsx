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
      {hasRows && (
        <div className="px-4 py-3 border-b border-white/10 flex flex-wrap gap-2 bg-slate-950/50">
          <button
            onClick={() => copyToClipboard(toCSV(result))}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
          >
            Copy CSV
          </button>

          <button
            onClick={() => downloadFile(toCSV(result), 'results.csv', 'text/csv')}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
          >
            Download CSV
          </button>

          <button
            onClick={() => copyToClipboard(toMarkdown(result))}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
          >
            Copy Markdown
          </button>
        </div>
      )}
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

function toCSV(result) {
  const columns = result.columns || [];
  const values = result.values || [];
  const header = columns.join(",");
  const rows = values
    .map((row) =>
      row
        .map((v) => {
          const cell = v === null || v === undefined ? "" : String(v).replace(/"/g, '""');
          return '"' + cell + '"';
        })
        .join(",")
    )
    .join("\n");
  return header + (rows ? "\n" + rows : "");
}

function toMarkdown(result) {
  const columns = result.columns || [];
  const values = result.values || [];
  const header = `| ${columns.join(" | ")} |`;
  const separator = `| ${columns.map(() => "---").join(" | ")} |`;
  const rows = values
    .map((row) => `| ${row.map((v) => (v === null || v === undefined ? "" : String(v))).join(" | ")} |`)
    .join("\n");
  return header + "\n" + separator + (rows ? "\n" + rows : "");
}

function copyToClipboard(text) {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).catch(() => {});
}

function downloadFile(content, filename, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
