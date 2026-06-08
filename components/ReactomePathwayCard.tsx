"use client";

import { useState } from "react";

type Props = {
  stId: string;
  name: string;
  summary: string | null;
  url: string;
  lang: string;
};

type Component = { name: string; role: string };

export default function ReactomePathwayCard({ stId, name, summary, url, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [components, setComponents] = useState<Component[]>([]);
  const [loadingComponents, setLoadingComponents] = useState(false);
  const isHe = lang === "he";

  const diagramUrl = `https://reactome.org/ContentService/exporter/diagram/${stId}.png`;

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && components.length === 0) {
      setLoadingComponents(true);
      try {
        const res = await fetch("/api/pathway-components", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, summary, lang }),
        });
        const data = await res.json();
        setComponents(data.components ?? []);
      } catch {
        // silent fail — diagram still shows without key components
      } finally {
        setLoadingComponents(false);
      }
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <span className="text-violet-500 text-lg shrink-0 mt-0.5">⬡</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-snug mb-1">
              {name}
            </p>
            <p className="text-xs text-zinc-400 font-mono">{stId}</p>
          </div>
        </div>

        {summary && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3 ps-6">
            {summary}
          </p>
        )}

        <div className="flex items-center gap-2 ps-6">
          <button
            onClick={handleOpen}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/40 transition-colors"
          >
            <span>{open ? "▲" : "▼"}</span>
            {open
              ? (isHe ? "הסתר דיאגרמה" : "Hide Diagram")
              : (isHe ? "הצג דיאגרמה" : "View Diagram")}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-violet-600 transition-colors"
          >
            ↗ {isHe ? "פתח ב-Reactome" : "Open in Reactome"}
          </a>
        </div>
      </div>

      {/* Expanded panel */}
      {open && (
        <div className="border-t border-zinc-100 dark:border-zinc-700">

          {/* Key components */}
          <div className="px-4 py-3 bg-violet-50/50 dark:bg-violet-900/10 border-b border-violet-100 dark:border-violet-900/30">
            <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-2">
              {isHe ? "🔑 מרכיבי מפתח" : "🔑 Key Components"}
            </p>

            {loadingComponents ? (
              <p className="text-xs text-zinc-400 italic">
                {isHe ? "טוען מרכיבים..." : "Loading components…"}
              </p>
            ) : components.length > 0 ? (
              <ul className="space-y-2">
                {components.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-300 text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      <span className="font-semibold text-violet-700 dark:text-violet-300">{c.name}</span>
                      {" — "}
                      {c.role}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Diagram */}
          <div className="bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-400">
                {isHe ? "← גלול לצפייה במסלול המלא →" : "← Scroll to explore the full pathway →"}
              </span>
              <a
                href={diagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-500 hover:text-violet-700 transition-colors"
              >
                {isHe ? "פתח בגודל מלא ↗" : "Full size ↗"}
              </a>
            </div>

            <div className="overflow-x-auto p-3">
              {!imgLoaded && (
                <div className="flex items-center justify-center h-32 text-xs text-zinc-400">
                  {isHe ? "טוען דיאגרמה..." : "Loading diagram…"}
                </div>
              )}
              <img
                src={diagramUrl}
                alt={name}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
                className={`rounded-lg transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 h-0"}`}
                style={{ minWidth: "900px", maxWidth: "none", height: "auto" }}
              />
            </div>

            <p className="text-xs text-zinc-400 text-center pb-2">
              {isHe ? "מקור: Reactome Pathway Database" : "Source: Reactome Pathway Database"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
