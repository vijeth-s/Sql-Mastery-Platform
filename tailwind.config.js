/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "ui-monospace", "monospace"]
      },
      colors: {
        ink: {
          950: "#050713",
          900: "#080d1e",
          800: "#0d1428",
          700: "#131d36"
        },
        neon: {
          blue: "#38bdf8",
          violet: "#8b5cf6",
          cyan: "#22d3ee"
        }
      },
      boxShadow: {
        glow: "0 0 34px rgba(56, 189, 248, 0.22)",
        violet: "0 0 34px rgba(139, 92, 246, 0.22)"
      },
      backgroundImage: {
        "grid-glow": "linear-gradient(rgba(56,189,248,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
