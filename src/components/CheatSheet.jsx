import { Copy, TerminalSquare } from "lucide-react";
import { cheatSheetSections } from "../data/lessonsData";

export default function CheatSheet() {
  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-8 pt-4 lg:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Quick reference</p>
          <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">SQL Cheat Sheet</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Common statements for reading, summarizing, joining, and modifying data in the browser playground.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cheatSheetSections.map((section) => (
            <article key={section.title} className="glass rounded-lg p-4">
              <div className="mb-4 flex items-center gap-2">
                <TerminalSquare className="h-5 w-5 text-violet-300" />
                <h2 className="text-lg font-bold text-white">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map(([label, query]) => (
                  <div key={label} className="rounded-lg border border-white/10 bg-slate-950/55 p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-sky-200">{label}</p>
                      <Copy className="h-4 w-4 text-slate-500" />
                    </div>
                    <code className="block font-mono text-xs leading-5 text-slate-200">{query}</code>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
