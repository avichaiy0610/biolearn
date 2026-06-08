"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ChromosomeDiagram from "./ChromosomeDiagram";

const StaticSVGDiagram = dynamic(() => import("./StaticSVGDiagram"), { ssr: false });

const CHROM_TERMS = new Set([
  "chromosome", "chromosomes", "chromatid", "chromatids",
  "centromere", "telomere", "telomeres", "karyotype",
  "chromatin", "nucleosome", "nucleosomes", "histone", "histones",
  "כרומוזום", "כרומוזומים", "כרומטיד", "כרומטידות",
  "צנטרומר", "טלומר", "טלומרים", "קריוטיפ", "כרומטין",
  "נוקלאוסום", "נוקלאוסומים", "היסטון", "היסטונים",
]);

function isChromosomeTopic(nameEn: string, nameHe: string): boolean {
  const words = (s: string) => s.toLowerCase().split(/[\s,;()\-/]+/);
  return [...words(nameEn), ...words(nameHe)].some(w => CHROM_TERMS.has(w));
}

type Props = {
  nameEn: string;
  nameHe: string;
  contentEn: string;
  contentHe: string;
  topicName: string;
  lang: string;
};

type State = "idle" | "loading" | "shown" | "error";

export default function SubtopicDiagram({ nameEn, nameHe, contentEn, contentHe, topicName, lang }: Props) {
  const [state, setState] = useState<State>("idle");
  const [elements, setElements] = useState<object[]>([]);
  const [error, setError] = useState("");
  const isHe = lang === "he";

  if (isChromosomeTopic(nameEn, nameHe)) {
    return (
      <div className="w-full mt-3">
        <ChromosomeDiagram lang={lang} title={isHe ? nameHe : nameEn} />
      </div>
    );
  }

  async function handleToggle() {
    if (state === "shown") { setState("idle"); return; }
    if (elements.length > 0) { setState("shown"); return; }

    setState("loading");
    try {
      const res = await fetch("/api/diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameEn, nameHe, contentEn, contentHe, topicName, lang }),
      });
      const data = await res.json();
      if (!res.ok || !data.elements?.length) throw new Error(data.error ?? "No diagram returned");
      setElements(data.elements);
      setState("shown");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setState("error");
    }
  }

  const label = isHe
    ? state === "shown" ? "הסתר דיאגרמה" : "הצג דיאגרמה"
    : state === "shown" ? "Hide Diagram" : "Show Diagram";

  return (
    <div className="w-full">
      <button
        onClick={handleToggle}
        disabled={state === "loading"}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-800/40 transition-colors disabled:opacity-60"
      >
        <span>{state === "loading" ? "⏳" : "🔬"}</span>
        {state === "loading" ? (isHe ? "מייצר דיאגרמה..." : "Generating…") : label}
      </button>

      {state === "error" && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}

      {state === "shown" && elements.length > 0 && (
        <div className="mt-3">
          <StaticSVGDiagram
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            elements={elements as any}
            title={isHe ? nameHe : nameEn}
          />
        </div>
      )}
    </div>
  );
}
