import { motion } from "framer-motion";
import { Table2 } from "lucide-react";

export default function DatabaseCard({ table, count, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-sky-300/35 hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${table.accent}`}>
          <Table2 className="h-5 w-5 text-slate-950" />
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">{count} rows</span>
      </div>
      <h3 className="mt-4 font-mono text-lg font-semibold text-white">{table.name}</h3>
      <p className="mt-1 min-h-10 text-sm leading-5 text-slate-400">{table.description}</p>
    </motion.article>
  );
}
