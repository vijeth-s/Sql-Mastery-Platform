import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

export default function MobileMenu({ navItems, isOpen, onClose, dialect, setDialect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button className="absolute inset-0 bg-black/70" onClick={onClose} aria-label="Close navigation overlay" />
      <aside className="relative h-full w-[min(20rem,86vw)] border-r border-white/10 bg-ink-950 p-4 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-white">SQL Mastery</p>
            <p className="text-xs text-slate-400">Navigation</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4 rounded-lg border border-white/10 bg-slate-950/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">SQL Dialect</p>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="mt-3 w-full rounded-md border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-sky-300/50"
          >
            <option value="sqlite">SQLite</option>
            <option value="postgres">PostgreSQL</option>
            <option value="mysql">MySQL</option>
          </select>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? "nav-link-active" : ""}`}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
