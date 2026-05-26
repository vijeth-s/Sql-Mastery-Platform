import { NavLink } from "react-router-dom";
import { ChevronDown, DatabaseZap, Layers3 } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ navItems }) {
  const [openLessons, setOpenLessons] = useState(true);
  const lessonPaths = ["/beginner", "/intermediate", "/advanced"];
  const secondaryItems = navItems.filter((item) => item.to !== "/" && !lessonPaths.includes(item.to));

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-ink-950/70 p-4 backdrop-blur-xl lg:block">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 shadow-glow">
          <DatabaseZap className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-base font-extrabold text-white">SQL Mastery</p>
          <p className="text-xs text-slate-400">Browser SQLite lab</p>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
          {(() => {
            const Icon = navItems[0].icon;
            return <Icon className="h-4 w-4" />;
          })()}
          SQL Playground
        </NavLink>

        <button
          onClick={() => setOpenLessons((value) => !value)}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          <span className="flex items-center gap-3">
            <Layers3 className="h-4 w-4 text-violet-300" />
            Lessons
          </span>
          <ChevronDown className={`h-4 w-4 transition ${openLessons ? "rotate-180" : ""}`} />
        </button>

        {openLessons && (
          <div className="space-y-1 pl-3">
            {navItems.filter((item) => lessonPaths.includes(item.to)).map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}

        {secondaryItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-lg border border-sky-300/20 bg-sky-400/10 p-4">
        <p className="text-sm font-semibold text-sky-100">Fresh every refresh</p>
        <p className="mt-2 text-xs leading-5 text-slate-300">The SQLite database is in memory, so experiments reset automatically when the page reloads.</p>
      </div>
    </aside>
  );
}
