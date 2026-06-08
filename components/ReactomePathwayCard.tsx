"use client";

import { useState } from "react";

type Props = {
  stId: string;
  name: string;
  summary: string | null;
  url: string;
  lang: string;
};

export default function ReactomePathwayCard({ stId, name, summary, url, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isHe = lang === "he";

  const diagramUrl = `https://reactome.org/ContentService/exporter/diagram/${stId}.png`;

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
      {/* Header row */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-violet-500 text-lg shrink-0">⬡</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 leading-snug mb-1">
              {name}
            </p>
            {summary && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{summary}</p>
            )}
            <p className="text-xs text-zinc-400 font-mono mt-1">{stId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setOpen((v) => !v)}
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
            ↗ Reactome
          </a>
        </div>
      </div>

      {/* Diagram panel */}
      {open && (
        <div className="border-t border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 p-3">
          {!loaded && (
            <div className="flex items-center justify-center h-24 text-xs text-zinc-400">
              {isHe ? "טוען דיאגרמה..." : "Loading diagram…"}
            </div>
          )}
          <img
            src={diagramUrl}
            alt={name}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={`w-full rounded-lg transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0 h-0"}`}
            style={{ imageRendering: "auto" }}
          />
          <p className="text-xs text-zinc-400 text-center mt-2">
            {isHe ? "מקור: Reactome Pathway Database" : "Source: Reactome Pathway Database"}
          </p>
        </div>
      )}
    </div>
  );
}
