import { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, LineChart as LineChartIcon, PieChart as PieChartIcon, Table2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const chartColors = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#fb7185", "#22d3ee"];

export default function QueryResults({ result, error, elapsedMs, rowsChanged }) {
  const [viewMode, setViewMode] = useState("table");
  const [chartType, setChartType] = useState("bar");
  const [activeIndex, setActiveIndex] = useState(null);
  const [chartNotice, setChartNotice] = useState("");

  useEffect(() => {
    setViewMode("table");
    setChartNotice("");
    setActiveIndex(null);
  }, [result]);

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
  const values = result.values || [];
  const labelColIdx = result.columns.findIndex((_, index) => isLabelColumn(values, index));
  const valueColIdx = result.columns.findIndex((_, index) => isNumericColumn(values, index));
  const isChartable = hasRows && values.length > 0 && labelColIdx !== -1 && valueColIdx !== -1 && labelColIdx !== valueColIdx;
  const chartData = isChartable
    ? values.map((row) => ({
        name: String(row[labelColIdx]),
        value: Number(row[valueColIdx])
      }))
    : [];

  const showChart = () => {
    if (!isChartable) {
      setChartNotice("Chart view needs one label column and one numeric column.");
      return;
    }
    setChartNotice("");
    setViewMode("chart");
  };

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

          {chartNotice && <span className="basis-full text-xs text-amber-200">{chartNotice}</span>}
        </div>
      )}
      {hasRows && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/35 px-4 py-3">
          <div className="inline-flex rounded-md border border-white/10 bg-white/[0.04] p-1">
            <button
              onClick={() => {
                setViewMode("table");
                setChartNotice("");
              }}
              className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "table" ? "bg-sky-400/20 text-sky-100" : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              Table View
            </button>
            <button
              onClick={showChart}
              className={`inline-flex items-center gap-2 rounded px-3 py-1.5 text-xs font-semibold transition ${
                viewMode === "chart" ? "bg-sky-400/20 text-sky-100" : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Chart View
            </button>
          </div>

          {viewMode === "chart" && (
            <div className="flex flex-wrap gap-2">
              <ChartTypeButton active={chartType === "bar"} icon={BarChart3} label="Bar" onClick={() => setChartType("bar")} />
              <ChartTypeButton active={chartType === "line"} icon={LineChartIcon} label="Line" onClick={() => setChartType("line")} />
              <ChartTypeButton active={chartType === "area"} icon={LineChartIcon} label="Area" onClick={() => setChartType("area")} />
              <ChartTypeButton active={chartType === "pie"} icon={PieChartIcon} label="Pie" onClick={() => setChartType("pie")} />
            </div>
          )}
        </div>
      )}
      {hasRows ? (
        viewMode === "chart" && isChartable ? (
          <div className="h-[28rem] p-4">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={chartData} onMouseLeave={() => setActiveIndex(null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} cursor={{ fill: "rgba(56, 189, 248, 0.08)" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={chartColors[index % chartColors.length]}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                        onMouseEnter={() => setActiveIndex(index)}
                        className="transition-opacity duration-150"
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4, fill: "#38bdf8" }} activeDot={{ r: 7, fill: "#a78bfa" }} />
                </LineChart>
              ) : chartType === "area" ? (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} activeDot={{ r: 7, fill: "#a78bfa" }} />
                </AreaChart>
              ) : (
                <PieChart onMouseLeave={() => setActiveIndex(null)}>
                  <Tooltip contentStyle={{ background: "#020617", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={135} paddingAngle={2}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={chartColors[index % chartColors.length]}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.42}
                        onMouseEnter={() => setActiveIndex(index)}
                        className="transition-opacity duration-150"
                      />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
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
        )
      ) : (
        <p className="p-4 text-sm text-slate-300">Statement completed successfully. No tabular rows returned.</p>
      )}
    </div>
  );
}

function ChartTypeButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 ${
        active
          ? "border-sky-300/50 bg-sky-400/20 text-sky-100"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-sky-300/35 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function isNumericColumn(values, colIndex) {
  return values.length > 0 && values.every((row) => row[colIndex] !== null && row[colIndex] !== undefined && !Number.isNaN(Number(row[colIndex])));
}

function isLabelColumn(values, colIndex) {
  return values.length > 0 && values.some((row) => row[colIndex] !== null && row[colIndex] !== undefined && Number.isNaN(Number(row[colIndex])));
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
