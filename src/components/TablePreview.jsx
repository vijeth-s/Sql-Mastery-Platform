import { useEffect, useState } from "react";
import { Database } from "lucide-react";
import { getTablePreview, getTableCount } from "../services/database";

export default function TablePreview({ db, refreshKey, tableMetadata }) {
  const [activeTable, setActiveTable] = useState(tableMetadata[0]?.name ?? "");
  const [preview, setPreview] = useState({ columns: [], values: [] });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!tableMetadata.length) return;
    if (!tableMetadata.some((table) => table.name === activeTable)) {
      setActiveTable(tableMetadata[0].name);
    }
  }, [tableMetadata, activeTable]);

  useEffect(() => {
    if (!db || !activeTable) return;
    setPreview(getTablePreview(db, activeTable));
    setCount(getTableCount(db, activeTable));
  }, [db, activeTable, refreshKey]);

  const activeDescription = tableMetadata.find((table) => table.name === activeTable)?.description ?? "";

  return (
    <section className="glass rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-violet-300" />
          <h2 className="text-base font-bold text-white">Table preview</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-xs font-semibold text-slate-200">{count} rows</span>
      </div>
      <div className="mb-3">
        <select
          value={activeTable}
          onChange={(event) => setActiveTable(event.target.value)}
          className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 text-sm text-white outline-none"
        >
          {tableMetadata.map((table) => (
            <option key={table.name} value={table.name}>{table.name}</option>
          ))}
        </select>
      </div>
      <p className="mb-4 min-h-[3rem] text-sm leading-6 text-slate-300">{activeDescription}</p>
      <div className="max-h-80 overflow-auto rounded-none border border-white/10 scrollbar-thin">
        <table className="min-w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-950 text-sky-200">
            <tr>{preview.columns.map((column) => <th key={column} className="px-3 py-2 font-semibold">{column}</th>)}</tr>
          </thead>
          <tbody>
            {preview.values.map((row, index) => (
              <tr key={index} className="border-t border-white/5">
                {row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2 text-slate-300">{String(cell)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
