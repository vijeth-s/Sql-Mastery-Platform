import { useEffect, useState } from "react";
import { Database } from "lucide-react";
import { getTablePreview, tableMetadata } from "../services/database";

export default function TablePreview({ db, refreshKey }) {
  const [activeTable, setActiveTable] = useState(tableMetadata[0].name);
  const [preview, setPreview] = useState({ columns: [], values: [] });

  useEffect(() => {
    if (!db) return;
    setPreview(getTablePreview(db, activeTable, 15));
  }, [db, activeTable, refreshKey]);

  return (
    <section className="glass rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2">
        <Database className="h-4 w-4 text-violet-300" />
        <h2 className="text-base font-bold text-white">Table preview</h2>
      </div>
      <select
        value={activeTable}
        onChange={(event) => setActiveTable(event.target.value)}
        className="mb-3 h-10 w-full rounded-lg border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none"
      >
        {tableMetadata.map((table) => <option key={table.name}>{table.name}</option>)}
      </select>
      <div className="max-h-80 overflow-auto rounded-lg border border-white/10 scrollbar-thin">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-950 text-sky-200">
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
