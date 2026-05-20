import { BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function LevelDescriptions() {
  const levels = [
    {
      name: "Beginner",
      icon: BookOpen,
      color: "from-sky-400 to-cyan-300",
      description: "Start here! Learn SQL basics including SELECT, WHERE, ORDER BY, and simple filtering.",
      link: "/beginner"
    },
    {
      name: "Intermediate",
      icon: GraduationCap,
      color: "from-violet-400 to-fuchsia-300",
      description: "Master JOINs, GROUP BY, aggregation functions, and multi-table queries.",
      link: "/intermediate"
    },
    {
      name: "Advanced",
      icon: Sparkles,
      color: "from-emerald-400 to-teal-300",
      description: "Dive deep into window functions, CTEs, subqueries, and advanced optimization.",
      link: "/advanced"
    }
  ];

  return (
    <section className="glass rounded-lg p-4">
      <h2 className="mb-3 text-base font-bold text-white">Learning Paths</h2>
      <div className="space-y-3">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <NavLink
              key={level.name}
              to={level.link}
              className="block rounded-lg border border-white/10 bg-white/[0.055] p-3 transition hover:border-sky-300/30 hover:bg-white/10"
            >
              <div className="flex items-start gap-2">
                <Icon className={`h-4 w-4 shrink-0 mt-1 bg-gradient-to-r ${level.color} bg-clip-text text-transparent`} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white">{level.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{level.description}</p>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </section>
  );
}
