"use client";

import { useSyncExternalStore } from "react";

// Light/dark switch. With no choice saved the site follows the system theme;
// a click saves an explicit choice (read before paint by the layout's script).
const media = () => window.matchMedia("(prefers-color-scheme: dark)");
const isDark = () => {
  const set = document.documentElement.dataset.theme;
  return set ? set === "dark" : media().matches;
};
function subscribe(onChange: () => void) {
  const mq = media();
  mq.addEventListener("change", onChange);
  window.addEventListener("bl-theme", onChange);
  return () => { mq.removeEventListener("change", onChange); window.removeEventListener("bl-theme", onChange); };
}

export default function ThemeToggle({ lang }: { lang: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  function toggle() {
    const next = !isDark();
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("bl-theme", next ? "dark" : "light"); } catch { /* private mode */ }
    window.dispatchEvent(new Event("bl-theme"));
  }

  const he = lang === "he";
  const label = dark ? (he ? "מעבר למצב בהיר" : "Switch to light mode") : (he ? "מעבר למצב כהה" : "Switch to dark mode");
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="w-10 h-10 shrink-0 grid place-items-center rounded-full border border-line bg-surface text-muted hover:text-ink transition-colors"
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
}
