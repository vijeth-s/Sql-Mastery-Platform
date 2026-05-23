import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

function showOverlay(message) {
  let el = document.getElementById("dev-error-overlay");
  if (!el) {
    el = document.createElement("div");
    el.id = "dev-error-overlay";
    Object.assign(el.style, {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      color: "#fff",
      padding: "20px",
      zIndex: 999999,
      overflow: "auto",
      fontFamily: "monospace",
      whiteSpace: "pre-wrap"
    });
    document.body.appendChild(el);
  }
  el.textContent = message;
}

window.addEventListener("error", (e) => {
  const msg = "Error: " + (e.message || e.error?.message) + "\n" + (e.error?.stack || (e.filename ? `${e.filename}:${e.lineno}:${e.colno}` : ""));
  showOverlay(msg);
});

window.addEventListener("unhandledrejection", (e) => {
  const reason = e.reason?.message || String(e.reason);
  showOverlay("Unhandled Rejection: " + reason);
});

const rootEl = document.getElementById("root");
if (!rootEl) {
  showOverlay('No root element found: document.getElementById("root") returned null.');
} else {
  createRoot(rootEl).render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(
        HashRouter,
        null,
        React.createElement(App)
      )
    )
  );
}
