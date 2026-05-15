import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

export default function MobileMenu({ navItems, isOpen, onClose }) {
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
