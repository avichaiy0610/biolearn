"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProteinTranslate from "./ProteinTranslate";

type SiteItem = { type: string; slug: string; topicSlug?: string; nameEn: string; nameHe: string };

function matchSiteLink(term: string, index: SiteItem[], lang: string): string | null {
  if (!term || term.length < 3) return null;
  const t = term.toLowerCase().trim();
  let best: SiteItem | null = null;
  for (const item of index) {
    const en = item.nameEn.toLowerCase();
    const he = item.nameHe.toLowerCase();
    if (en === t || he === t) { best = item; break; }
    if (!best && (en.includes(t) || t.includes(en) || he.includes(t) || t.includes(he))) {
      if (t.length >= 4 && (en.length >= 4 || he.length >= 4)) best = item;
    }
  }
  if (!best) return null;
  if (best.type === "topic") return `/${lang}/topics/${best.slug}`;
  return `/${lang}/topics/${best.topicSlug}`;
}

type Protein = {
  accession: string;
  id?: string;
  name: string;
  gene: string | null;
  organism: string | null;
  length: number | null;
  fn: string | null;
  locations: string[];
  diseases: string[];
  keywords: string[];
};

type Structure = {
  confidence: number;
  category: string;
  afUrl: string;
};

type Interaction = { name: string; score: number };
type Article = { pubmedId: string; title: string; year: number | null };

const CONFIDENCE_STYLE: Record<string, string> = {
  VERY_HIGH: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  HIGH: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  LOW: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
  VERY_LOW: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const CONFIDENCE_LABEL_HE: Record<string, string> = {
  VERY_HIGH: "ביטחון גבוה מאוד",
  HIGH: "ביטחון גבוה",
  LOW: "ביטחון נמוך",
  VERY_LOW: "ביטחון נמוך מאוד",
};

export default function ProteinDetailContent({
  lang,
  protein,
  structure,
  interactions,
  articles,
}: {
  lang: string;
  protein: Protein;
  structure: Structure | null;
  interactions: Interaction[];
  articles: Article[];
}) {
  const isHe = lang === "he";

  const [siteIndex, setSiteIndex] = useState<SiteItem[]>([]);
  const [autoTranslating, setAutoTranslating] = useState(false);
  const [translated, setTranslated] = useState<{
    name?: string;
    organism?: string;
    fn?: string;
    locations?: string[];
    diseases?: string[];
    keywords?: string[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/site-index")
      .then((r) => r.json())
      .then((d) => setSiteIndex([...(d.topics ?? []), ...(d.subtopics ?? [])]));
  }, []);

  useEffect(() => {
    if (!isHe) return;
    setAutoTranslating(true);
    fetch("/api/translate-protein", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: protein.name,
        organism: protein.organism,
        fn: protein.fn,
        locations: protein.locations,
        diseases: protein.diseases,
        keywords: protein.keywords,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setTranslated(d); })
      .finally(() => setAutoTranslating(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const name = translated?.name ?? protein.name;
  const organism = translated?.organism ?? protein.organism;
  const fn = translated?.fn ?? protein.fn;
  const locations = translated?.locations ?? protein.locations;
  const diseases = translated?.diseases ?? protein.diseases;
  const keywords = translated?.keywords ?? protein.keywords;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir={isHe ? "rtl" : "ltr"}>
      {/* Back */}
      <Link
        href={`/${lang}/proteins`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
      >
        {isHe ? "← חזור לחיפוש" : "← Back to search"}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-4xl mt-1">🧬</span>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-1">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {protein.gene && (
                <span className="font-mono text-sm px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {protein.gene}
                </span>
              )}
              <span className="font-mono text-sm text-zinc-400">{protein.accession}</span>
              {organism && <span className="text-sm text-zinc-400 italic">{organism}</span>}
              {protein.length && <span className="text-sm text-zinc-400">{protein.length} aa</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://www.uniprot.org/uniprotkb/${protein.accession}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
          >
            UniProt ↗
          </a>
          {structure && (
            <a
              href={structure.afUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              AlphaFold ↗
            </a>
          )}
          {protein.gene && (
            <a
              href={`https://www.ncbi.nlm.nih.gov/gene/?term=${protein.gene}[sym]+AND+human[org]`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 transition-colors"
            >
              NCBI Gene ↗
            </a>
          )}

          {/* Translate button — hidden while auto-translate is running to prevent duplicate requests */}
          {!autoTranslating && (
            <ProteinTranslate
              originalData={{
                name: protein.name,
                organism: protein.organism,
                fn: protein.fn,
                locations: protein.locations,
                diseases: protein.diseases,
                keywords: protein.keywords,
              }}
              onTranslated={setTranslated}
              onReset={() => setTranslated(null)}
              isTranslated={!!translated}
            />
          )}
        </div>

        {autoTranslating && (
          <div className="mt-2 text-xs text-zinc-400 flex items-center gap-1">
            <span className="animate-spin inline-block">⏳</span> {isHe ? "מתרגם לעברית..." : "Translating…"}
          </div>
        )}
        {translated && !autoTranslating && !isHe && (
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>✓</span> תוכן מתורגם לעברית
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Function */}
        {fn && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "📋 פונקציה" : "📋 Function"}
            </h2>
            <p
              className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
              dir={translated ? "rtl" : "ltr"}
            >
              {fn}
            </p>
          </section>
        )}

        {/* AlphaFold Structure */}
        {structure && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "🔬 מבנה חלבון (AlphaFold)" : "🔬 Protein Structure (AlphaFold)"}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${CONFIDENCE_STYLE[structure.category] ?? "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"}`}>
                    {isHe ? (CONFIDENCE_LABEL_HE[structure.category] ?? structure.category) : structure.category.replace("_", " ")}
                  </span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{structure.confidence}</span>
                  <span className="text-sm text-zinc-400">/ 100 pLDDT</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-700">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      structure.confidence >= 90 ? "bg-blue-500"
                      : structure.confidence >= 70 ? "bg-green-500"
                      : structure.confidence >= 50 ? "bg-yellow-400"
                      : "bg-red-400"
                    }`}
                    style={{ width: `${structure.confidence}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-1.5">
                  {isHe
                    ? "ציון pLDDT — מדד לביטחון בחיזוי מבנה החלבון. מעל 90 = מבנה מהימן מאוד"
                    : "pLDDT score — confidence in predicted structure. Above 90 = very reliable"}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Subcellular Location */}
        {locations.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "📍 מיקום תת-תאי" : "📍 Subcellular Location"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc, i) => {
                const href = matchSiteLink(loc, siteIndex, lang);
                const cls = "text-sm px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 transition-colors";
                return href ? (
                  <Link key={i} href={href} className={`${cls} hover:bg-violet-100 dark:hover:bg-violet-900/50 hover:border-violet-400 inline-flex items-center gap-1`}>
                    {loc} <span className="text-xs opacity-60">↗</span>
                  </Link>
                ) : (
                  <span key={i} className={cls}>{loc}</span>
                );
              })}
            </div>
          </section>
        )}

        {/* Interactions (STRING) */}
        {interactions.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
              {isHe ? "🔗 אינטראקציות חלבון (STRING)" : "🔗 Protein Interactions (STRING)"}
            </h2>
            <p className="text-xs text-zinc-400 mb-3">
              {isHe ? "חלבונים שמתקשרים עם " : "Proteins that interact with "}{protein.gene ?? protein.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {interactions.map((i) => (
                <a
                  key={i.name}
                  href={`https://string-db.org/network/${i.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-emerald-400 transition-colors"
                >
                  <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">{i.name}</span>
                  <span className={`text-xs ${i.score >= 90 ? "text-green-600 dark:text-green-400" : i.score >= 70 ? "text-yellow-600 dark:text-yellow-400" : "text-zinc-400"}`}>
                    {i.score}%
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Keywords */}
        {keywords.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "🏷️ מילות מפתח" : "🏷️ Keywords"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => {
                const href = matchSiteLink(kw, siteIndex, lang);
                const cls = "text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors";
                return href ? (
                  <Link key={i} href={href} className={`${cls} hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 inline-flex items-center gap-1`}>
                    {kw} <span className="text-xs opacity-60">↗</span>
                  </Link>
                ) : (
                  <span key={i} className={cls}>{kw}</span>
                );
              })}
            </div>
          </section>
        )}

        {/* Diseases */}
        {diseases.length > 0 && (
          <section className="rounded-2xl border border-red-100 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-5">
            <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">
              {isHe ? "🏥 מחלות קשורות" : "🏥 Associated Diseases"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {diseases.map((d, i) => {
                const href = matchSiteLink(d, siteIndex, lang);
                const cls = "text-xs px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 transition-colors";
                return href ? (
                  <Link key={i} href={href} className={`${cls} hover:bg-red-200 dark:hover:bg-red-900/60 inline-flex items-center gap-1`}>
                    {d} <span className="text-xs opacity-60">↗</span>
                  </Link>
                ) : (
                  <span key={i} className={cls}>{d}</span>
                );
              })}
            </div>
          </section>
        )}

        {/* PubMed Reviews */}
        {articles.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "📄 מאמרי סקירה (PubMed)" : "📄 Review Articles (PubMed)"}
            </h2>
            <div className="space-y-2">
              {articles.map((a) => (
                <a
                  key={a.pubmedId}
                  href={`https://pubmed.ncbi.nlm.nih.gov/${a.pubmedId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2">
                      {a.title}
                    </p>
                    {a.year && <p className="text-xs text-zinc-400 mt-0.5">{a.year}</p>}
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-600 text-xs mt-0.5 shrink-0">↗</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
