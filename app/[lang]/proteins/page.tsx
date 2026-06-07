"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ProteinResult = {
  accession: string;
  name: string;
  gene: string | null;
  organism: string | null;
  length: number | null;
  id: string | null;
};

const POPULAR = ["insulin", "hemoglobin", "p53", "BRCA1", "albumin", "collagen", "actin", "myosin"];

export default function ProteinsPage() {
  const params = useParams();
  const lang = params.lang as string;
  const isHe = lang === "he";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProteinResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/protein?q=${encodeURIComponent(q)}`);
      setResults(await res.json());
    } catch { setResults([]); }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir={isHe ? "rtl" : "ltr"}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🧬</span>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {isHe ? "מאגר חלבונים" : "Protein Database"}
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {isHe
            ? "חיפוש ב-UniProt Swiss-Prot — מבנה, פונקציה, אינטראקציות ומאמרים"
            : "Search UniProt Swiss-Prot — structure, function, interactions and articles"}
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); search(query); }}
        className="flex gap-2 mb-6"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isHe
            ? "שם חלבון, גן, או מחלה... (לדוגמה: hemoglobin, TP53, insulin)"
            : "Protein name, gene, or disease... (e.g. hemoglobin, TP53)"}
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          dir="ltr"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "⏳" : isHe ? "חפש" : "Search"}
        </button>
      </form>

      {!searched && (
        <div>
          <p className="text-xs text-zinc-400 mb-2">{isHe ? "חיפושים נפוצים:" : "Popular searches:"}</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); search(s); }}
                className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors font-mono"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-3xl mb-3">🔬</p>
          <p className="text-sm">{isHe ? `לא נמצאו חלבונים עבור "${query}"` : `No proteins found for "${query}"`}</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 mb-3">
            {results.length} {isHe ? "תוצאות (UniProt Swiss-Prot, אנושי)" : "results (UniProt Swiss-Prot, human)"}
          </p>
          <div className="space-y-2">
            {results.map((p) => (
              <Link
                key={p.accession}
                href={`/${lang}/proteins/${p.accession}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                      {p.name}
                    </span>
                    {p.gene && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-mono shrink-0">
                        {p.gene}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                    <span>{p.accession}</span>
                    {p.length && <span>{p.length} aa</span>}
                  </div>
                </div>
                <span className="text-zinc-300 dark:text-zinc-600 group-hover:text-emerald-400 shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
