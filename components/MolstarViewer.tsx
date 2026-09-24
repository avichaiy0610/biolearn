"use client";

import { useEffect, useRef, useState } from "react";

// Embedded Mol* 3D viewer. The ~5 MB viewer bundle is loaded from jsDelivr only
// when the section scrolls into view, and one WebGL viewer is shared between
// the AlphaFold model and the experimental (PDB) structure.
const MOLSTAR_VERSION = "5.11.0";
const BASE = `https://cdn.jsdelivr.net/npm/molstar@${MOLSTAR_VERSION}/build/viewer`;

type MolstarViewerInstance = {
  loadAlphaFoldDb(id: string): Promise<void>;
  loadPdb(id: string): Promise<void>;
  plugin: { clear(): Promise<void> };
  dispose(): void;
};
type MolstarGlobal = { Viewer: { create(el: HTMLElement, opts: Record<string, unknown>): Promise<MolstarViewerInstance> } };

let loader: Promise<MolstarGlobal> | null = null;
function loadMolstar(): Promise<MolstarGlobal> {
  if (loader) return loader;
  loader = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${BASE}/molstar.css`;
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = `${BASE}/molstar.js`;
    s.async = true;
    s.onload = () => {
      const m = (window as unknown as { molstar?: MolstarGlobal }).molstar;
      if (m) resolve(m);
      else reject(new Error("molstar global missing"));
    };
    s.onerror = () => { loader = null; reject(new Error("molstar failed to load")); };
    document.head.appendChild(s);
  });
  return loader;
}

export type StructureSource = { key: string; label: string; kind: "afdb" | "pdb"; id: string };

export default function MolstarViewer({ sources, lang }: { sources: StructureSource[]; lang: string }) {
  const he = lang === "he";
  const hostRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<MolstarViewerInstance | null>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(sources[0]?.key);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  // Start loading when the viewer approaches the viewport
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !hostRef.current) return;
    let disposed = false;
    setState("loading");
    loadMolstar()
      .then((molstar) => molstar.Viewer.create(hostRef.current!, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,
        viewportShowExpand: true,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,
        pdbProvider: "rcsb",
      }))
      .then((viewer) => {
        if (disposed) { viewer.dispose(); return; }
        viewerRef.current = viewer;
        setState("ready");
      })
      .catch(() => { if (!disposed) setState("error"); });
    return () => {
      disposed = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [visible]);

  // (Re)load the selected structure
  const sourcesKey = sources.map((s) => `${s.kind}:${s.id}`).join(",");
  useEffect(() => {
    const viewer = viewerRef.current;
    const src = sources.find((s) => s.key === active);
    if (state !== "ready" || !viewer || !src) return;
    (async () => {
      try {
        await viewer.plugin.clear();
        if (src.kind === "afdb") await viewer.loadAlphaFoldDb(src.id);
        else await viewer.loadPdb(src.id);
      } catch {
        setState("error");
      }
    })();
  }, [active, state, sourcesKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {sources.length > 1 && (
        <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700 p-0.5 mb-2 text-xs" role="tablist">
          {sources.map((s) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={s.key === active}
              onClick={() => setActive(s.key)}
              className={`px-3 py-1 rounded-md transition-colors ${s.key === active ? "bg-emerald-600 text-white" : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="relative w-full h-80 md:h-[420px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-black" dir="ltr">
        <div ref={hostRef} className="absolute inset-0" />
        {state !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400 pointer-events-none">
            {state === "error"
              ? (he ? "לא הצלחנו לטעון את המבנה התלת-ממדי." : "Couldn't load the 3D structure.")
              : (he ? "טוען מבנה תלת-ממדי…" : "Loading 3D structure…")}
          </div>
        )}
      </div>
      <p className="text-xs text-zinc-400 mt-1.5">
        {he ? "גררו לסיבוב · גלגלת/צביטה לזום · צפייה עם " : "Drag to rotate · scroll/pinch to zoom · powered by "}<bdi dir="ltr">Mol*</bdi>
      </p>
    </div>
  );
}
