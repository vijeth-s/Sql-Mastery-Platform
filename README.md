# SQL Mastery Platform

A modern, browser-based SQL learning platform built with React, Vite, Tailwind CSS, and SQL.js. This app provides an interactive SQL playground with sample data, table previews, lessons, and query results to help learners practice SQL in a polished UI.

## 🚀 What this project includes

- Interactive SQL editor with runnable sample queries
- In-browser database powered by `sql.js` and SQLite schema seeds
- Table preview dashboard and query result rendering
- Responsive UI built with React + Tailwind CSS
- Vite development experience for fast local setup

## 📁 Project structure

- `index.html` — main entry HTML page
- `package.json` — dependencies and scripts
- `vite.config.js` — Vite build config
- `tailwind.config.js` / `postcss.config.js` — styling pipeline config
- `src/`
  - `App.jsx` — root app component
  - `index.js` — React entry point
  - `components/` — UI and page components
  - `data/lessonsData.js` — instructional lesson content
  - `services/database.js` — database initialization, sample data, query execution
  - `styles/index.css` — Tailwind and custom styling

## 🧰 Tech stack

- React 18
- Vite
- Tailwind CSS
- sql.js (SQLite in the browser)
- Framer Motion
- React Router DOM
- Lucide React icons

## ▶️ Run locally

### Prerequisites

- Node.js 18+ installed
- npm or yarn available

### Steps

```bash
cd sql-mastery-platform
npm install
npm run dev
```

Then open the local URL shown in the terminal (for example `http://localhost:5173`). The app should load instantly and you can begin using the SQL playground.

### Available commands

- `npm run dev` — start the local development server
- `npm run build` — build the production-ready static site
- `npm run preview` — preview the production build locally

> If you prefer `yarn`, you can use `yarn` for install and `yarn dev` / `yarn build` / `yarn preview`.

## 🧪 How to use the app

1. Open the app in your browser.
2. Use the SQL editor to write or edit SQL queries.
3. Run queries to see results from the in-browser sample database.
4. Explore preview tables and lesson cards to learn SQL concepts.

The app uses `src/services/database.js` to create tables and seed sample data entirely in the browser, so no backend server is required.

## 🤝 Collaboration guidelines

### Working together

- Clone the repository and create a feature branch for each task.
- Keep commits small and focused.
- Use descriptive commit messages.
- Open a pull request for reviews and feedback.
- Reference issue numbers or task descriptions in PRs.

### Recommended workflow

1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b feature/your-feature-name`
4. Make changes and test locally
5. Commit and push the branch
6. Open a pull request for review

### Code style and conventions

- Keep components modular and reusable
- Prefer descriptive prop names and clear state handling
- Keep styling in Tailwind utility classes when possible
- Add comments for non-obvious logic

## ☁️ Deployment

This is a static front-end app and can be deployed to any static hosting service.

### Build for production

```bash
npm run build
```

The optimized build output appears in `dist/`.

### Deploy options

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static file host or CDN

### Quick deployment notes

- For GitHub Pages, set the repo homepage or publish the `dist/` folder.
- For Netlify or Vercel, connect the repo and use `npm run build` as the build command.
- The app is client-side only, so no additional backend setup is required.

## 📌 Notes

- This app uses `sql.js` to simulate a SQL database entirely in the browser.
- Data is seeded from `src/services/database.js` and resets on page reload.
- No production database or server is required for local use.

## 💡 Next improvements

- Add authentication or user progress tracking
- Add more sample lessons and query challenges
- Support saving custom queries in local storage
- Add test coverage for core components

---

If you want help extending this project, feel free to ask for specific changes or new feature ideas.