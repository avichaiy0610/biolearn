"use client";

import { useState, useEffect, useRef } from "react";

type Article = {
  id: string;
  pubmedId: string | null;
  title: string;
  authors: string;
  journal: string | null;
  year: number | null;
  abstract: string;
  abstractHe: string | null;
  keyFindings: string | null;
  topicSlugs: string | null;
  url: string | null;
  source: string;
  hidden: boolean;
  createdAt: string;
};

type PubMedResult = {
  pubmedId: string;
  title: string;
  authors: string[];
  journal: string;
  year: number | null;
  abstract: string;
  url: string;
  citationCount?: number;
};

type Refinement = {
  refinedQueries: string[];
  meshTerms: string[];
  tip: string;
};

type TopicWithArticles = {
  topicSlug: string;
  topicNameHe: string;
  newQuery: string;
  topQuery: string;
  newArticles: PubMedResult[];
  topArticles: PubMedResult[];
  loading: boolean;
};

function parseJson<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; } catch { return fallback; }
}

const PAGE_SIZE = 10;

export default function ArticlesManager() {
  const [tab, setTab] = useState<"list" | "search" | "upload" | "ai-suggest">("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // Search
  const [query, setQuery] = useState("");
  const [resultType, setResultType] = useState<"top" | "new">("top");
  const [searchResults, setSearchResults] = useState<PubMedResult[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchPage, setSearchPage] = useState(0);
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [refinement, setRefinement] = useState<Refinement | null>(null);
  const [refining, setRefining] = useState(false);

  // AI suggestions
  const [aiTopics, setAiTopics] = useState<TopicWithArticles[]>([]);
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);

  // Re-analyze
  const [reanalyzingId, setReanalyzingId] = useState<string | null>(null);

  // Upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedMeta, setUploadedMeta] = useState<PubMedResult | null>(null);
  const [analyzingUpload, setAnalyzingUpload] = useState(false);

  useEffect(() => { fetchArticles(); }, []);

  async function fetchArticles() {
    setLoading(true);
    const res = await fetch("/api/admin/articles");
    setArticles(await res.json());
    setLoading(false);
  }

  // ── Search ──────────────────────────────────────────────
  async function runSearch(page: number, append: boolean) {
    if (!query.trim()) return;
    if (append) setLoadingMore(true);
    else { setSearching(true); setSearchResults([]); setRefinement(null); }

    const sort = resultType === "new" ? "date" : "relevance";
    const recency = resultType === "new" ? "3" : "";
    const url =
      `/api/admin/pubmed-search?query=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&page=${page}&sort=${sort}` +
      (recency ? `&recency=${recency}` : "");

    const res = await fetch(url);
    const data = await res.json();
    const newResults: PubMedResult[] = data.articles ?? [];

    setSearchResults((prev) => append ? [...prev, ...newResults] : newResults);
    setSearchTotal(data.total ?? 0);
    setSearchPage(page);

    if (append) { setLoadingMore(false); return; }

    setSearching(false);
    if (newResults.length > 0) {
      setRefining(true);
      const rRes = await fetch("/api/admin/refine-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, resultTitles: newResults.map((r) => r.title) }),
      });
      if (rRes.ok) setRefinement(await rRes.json());
      setRefining(false);
    }
  }

  async function handleSearch() {
    setSearchPage(0);
    await runSearch(0, false);
  }

  async function loadMore() {
    await runSearch(searchPage + 1, true);
  }

  function applyQuery(q: string, type: "top" | "new") {
    setQuery(q);
    setResultType(type);
    setTab("search");
    setTimeout(async () => {
      setSearchPage(0); setSearchResults([]); setRefinement(null); setSearching(true);
      const sort = type === "new" ? "date" : "relevance";
      const recency = type === "new" ? "3" : "";
      const url = `/api/admin/pubmed-search?query=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&page=0&sort=${sort}` +
        (recency ? `&recency=${recency}` : "");
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.articles ?? []);
      setSearchTotal(data.total ?? 0);
      setSearching(false);
    }, 50);
  }

  // ── AI Suggestions ───────────────────────────────────────
  async function loadAiSuggestions() {
    setLoadingAiSuggestions(true);
    setAiTopics([]);

    const res = await fetch("/api/admin/suggest-articles");
    if (!res.ok) { setLoadingAiSuggestions(false); return; }
    const { suggestions } = await res.json();

    // Initialize topic cards with empty articles + loading state
    const initial: TopicWithArticles[] = suggestions.map(
      (s: { topicSlug: string; topicNameHe: string; newQuery: string; topQuery: string }) => ({
        ...s, newArticles: [], topArticles: [], loading: true,
      })
    );
    setAiTopics(initial);
    setLoadingAiSuggestions(false);

    // Fetch articles for each topic in parallel
    await Promise.all(
      suggestions.map(
        async (
          s: { topicSlug: string; topicNameHe: string; newQuery: string; topQuery: string },
          i: number
        ) => {
          const [newRes, topRes] = await Promise.all([
            fetch(`/api/admin/pubmed-search?query=${encodeURIComponent(s.newQuery)}&limit=3&sort=date&recency=3`),
            fetch(`/api/admin/pubmed-search?query=${encodeURIComponent(s.topQuery)}&limit=3&sort=relevance`),
          ]);
          const newData = newRes.ok ? await newRes.json() : { articles: [] };
          const topData = topRes.ok ? await topRes.json() : { articles: [] };

          setAiTopics((prev) =>
            prev.map((t, idx) =>
              idx === i
                ? { ...t, newArticles: newData.articles ?? [], topArticles: topData.articles ?? [], loading: false }
                : t
            )
          );
        }
      )
    );
  }

  // ── Add article (analyze + save) ─────────────────────────
  async function analyzeAndAdd(result: PubMedResult) {
    setAddingId(result.pubmedId);
    const analysisRes = await fetch("/api/admin/analyze-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: result.title, abstract: result.abstract,
        authors: result.authors, journal: result.journal, year: result.year,
      }),
    });
    const analysis = analysisRes.ok ? await analysisRes.json() : {};
    const saveRes = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pubmedId: result.pubmedId, title: result.title, authors: result.authors,
        journal: result.journal, year: result.year, abstract: result.abstract,
        abstractHe: analysis.abstractHe, keyFindings: analysis.keyFindings,
        topicSlugs: analysis.topicSlugs, subtopicIds: analysis.subtopicIds,
        url: result.url, source: "pubmed",
      }),
    });
    setAddingId(null);
    if (saveRes.ok) await fetchArticles();
    else alert((await saveRes.json()).error ?? "שגיאה בשמירה");
  }

  // ── Re-analyze existing article ──────────────────────────
  async function reanalyzeArticle(article: Article) {
    setReanalyzingId(article.id);
    const analysisRes = await fetch("/api/admin/analyze-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title, abstract: article.abstract,
        authors: parseJson(article.authors, []),
        journal: article.journal, year: article.year,
      }),
    });
    if (analysisRes.ok) {
      const analysis = await analysisRes.json();
      await fetch(`/api/admin/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          abstractHe: analysis.abstractHe,
          keyFindings: analysis.keyFindings,
          topicSlugs: analysis.topicSlugs,
        }),
      });
      await fetchArticles();
    }
    setReanalyzingId(null);
  }

  // ── Upload ───────────────────────────────────────────────
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadedMeta(null);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/article-upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setUploadedMeta({ ...data, pubmedId: "", url: "" });
    else alert(data.error ?? "שגיאה בעיבוד הקובץ");
  }

  async function analyzeAndSaveUpload() {
    if (!uploadedMeta) return;
    setAnalyzingUpload(true);
    const analysisRes = await fetch("/api/admin/analyze-article", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadedMeta),
    });
    const analysis = analysisRes.ok ? await analysisRes.json() : {};
    const saveRes = await fetch("/api/admin/articles", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: uploadedMeta.title, authors: uploadedMeta.authors,
        journal: uploadedMeta.journal, year: uploadedMeta.year,
        abstract: uploadedMeta.abstract, abstractHe: analysis.abstractHe,
        keyFindings: analysis.keyFindings, topicSlugs: analysis.topicSlugs,
        subtopicIds: analysis.subtopicIds, source: "upload",
      }),
    });
    setAnalyzingUpload(false);
    if (saveRes.ok) { setUploadedMeta(null); await fetchArticles(); setTab("list"); }
    else alert((await saveRes.json()).error ?? "שגיאה בשמירה");
  }

  async function toggleHidden(article: Article) {
    await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: !article.hidden }),
    });
    await fetchArticles();
  }

  async function deleteArticle(id: string) {
    if (!confirm("למחוק מאמר זה?")) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    await fetchArticles();
  }

  const savedIds = new Set(articles.map((a) => a.pubmedId).filter(Boolean));
  const hasMore = searchResults.length < searchTotal;

  // ── Sub-component: PubMed result card ────────────────────
  function ResultCard({ result, label }: { result: PubMedResult; label?: "new" | "top" }) {
    const isAdding = addingId === result.pubmedId;
    const alreadySaved = savedIds.has(result.pubmedId);
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm leading-snug flex-1">
            {result.title}
          </p>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {label === "new" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                🆕 חדש
              </span>
            )}
            {label === "top" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                ⭐ מוביל
              </span>
            )}
            {result.citationCount != null && (
              <span className="text-xs text-zinc-400">{result.citationCount.toLocaleString()} ציטוטים</span>
            )}
          </div>
        </div>
        <p className="text-xs text-zinc-400 mb-2">
          {result.authors.slice(0, 3).join(", ")}
          {result.journal ? ` • ${result.journal}` : ""}
          {result.year ? ` • ${result.year}` : ""}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">{result.abstract}</p>
        <div className="flex items-center gap-3">
          {alreadySaved ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ כבר קיים</span>
          ) : (
            <button onClick={() => analyzeAndAdd(result)} disabled={!!addingId}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {isAdding ? "מנתח ושומר..." : "נתח והוסף"}
            </button>
          )}
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-emerald-500 hover:underline">PubMed →</a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">ניהול מאמרים מדעיים</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-700">
        {(["list", "search", "ai-suggest", "upload"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}>
            {t === "list" ? `רשימה (${articles.length})`
              : t === "search" ? "חיפוש PubMed"
              : t === "ai-suggest" ? "🤖 הצעות AI"
              : "העלאת PDF"}
          </button>
        ))}
      </div>

      {/* ─── LIST ─── */}
      {tab === "list" && (
        <div className="space-y-4">
          {loading && <p className="text-zinc-400">טוען...</p>}
          {!loading && articles.length === 0 && (
            <p className="text-zinc-400 text-center py-10">
              אין מאמרים עדיין. חפש ב-PubMed, קבל הצעות AI, או העלה PDF.
            </p>
          )}
          {articles.map((article) => {
            const authors = parseJson<string[]>(article.authors, []);
            const keyFindings = parseJson<string[]>(article.keyFindings, []);
            const isReanalyzing = reanalyzingId === article.id;
            const missingHebrew = !article.abstractHe;
            return (
              <div key={article.id}
                className={`rounded-xl border p-4 bg-white dark:bg-zinc-800 ${
                  article.hidden
                    ? "border-zinc-200 dark:border-zinc-700 opacity-70"
                    : "border-emerald-200 dark:border-emerald-800"}`}>

                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50 leading-snug mb-1">{article.title}</p>
                    <p className="text-xs text-zinc-400">
                      {authors.slice(0, 3).join(", ")}{authors.length > 3 ? " ..." : ""}
                      {article.journal ? ` • ${article.journal}` : ""}
                      {article.year ? ` • ${article.year}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => toggleHidden(article)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                        article.hidden
                          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                          : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"}`}>
                      {article.hidden ? "פרסם" : "הסתר"}
                    </button>
                    <button onClick={() => deleteArticle(article.id)}
                      className="px-3 py-1 text-xs rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors">
                      מחק
                    </button>
                  </div>
                </div>

                {/* Hebrew abstract + key findings */}
                {article.abstractHe ? (
                  <div className="mb-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 p-3">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">תקציר בעברית</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-4">{article.abstractHe}</p>
                  </div>
                ) : (
                  <div className="mb-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-amber-700 dark:text-amber-400">אין תקציר בעברית — הניתוח לא הסתיים</p>
                    <button onClick={() => reanalyzeArticle(article)} disabled={isReanalyzing}
                      className="shrink-0 px-3 py-1 text-xs rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 hover:bg-amber-200 disabled:opacity-50 transition-colors">
                      {isReanalyzing ? "מנתח..." : "⚡ נתח עם AI"}
                    </button>
                  </div>
                )}

                {keyFindings.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-zinc-400 mb-1">ממצאים מרכזיים</p>
                    <ul className="space-y-1">
                      {keyFindings.map((f, i) => (
                        <li key={i} className="text-xs text-zinc-600 dark:text-zinc-300">• {f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-zinc-100 dark:border-zinc-700">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    article.hidden ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
                      : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"}`}>
                    {article.hidden ? "מוסתר" : "מפורסם"}
                  </span>
                  <span className="text-xs text-zinc-400">{article.source === "pubmed" ? "PubMed" : "PDF"}</span>
                  {!missingHebrew && (
                    <button onClick={() => reanalyzeArticle(article)} disabled={isReanalyzing}
                      className="text-xs text-zinc-400 hover:text-zinc-600 underline disabled:opacity-50">
                      {isReanalyzing ? "מנתח..." : "נתח מחדש"}
                    </button>
                  )}
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-emerald-500 hover:underline">קישור מקורי</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── SEARCH ─── */}
      {tab === "search" && (
        <div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="חפש מאמרים בביולוגיה (באנגלית)..."
              className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              dir="ltr" />
            <button onClick={handleSearch} disabled={searching}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
              {searching ? "מחפש..." : "חפש"}
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {(["top", "new"] as const).map((type) => (
              <button key={type} onClick={() => setResultType(type)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  resultType === type
                    ? type === "top"
                      ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                      : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 hover:bg-zinc-200"}`}>
                {type === "top" ? "⭐ מובילים (רלוונטיות + ציטוטים)" : "🆕 חדשים (3 שנים אחרונות)"}
              </button>
            ))}
          </div>

          {refining && <p className="text-xs text-zinc-400 mb-3 animate-pulse">🤖 מנתח את החיפוש...</p>}
          {refinement && (
            <div className="mb-5 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 p-4">
              {refinement.tip && <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">💡 {refinement.tip}</p>}
              {refinement.refinedQueries.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-zinc-500 mb-2">שאילתות מדויקות יותר:</p>
                  <div className="flex flex-wrap gap-2">
                    {refinement.refinedQueries.map((q) => (
                      <button key={q} onClick={() => applyQuery(q, resultType)}
                        className="text-xs px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        dir="ltr">{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {refinement.meshTerms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-2">מונחי MeSH:</p>
                  <div className="flex flex-wrap gap-2">
                    {refinement.meshTerms.map((term) => (
                      <button key={term} onClick={() => applyQuery(`${query} ${term}[MeSH]`, resultType)}
                        className="text-xs px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
                        dir="ltr">{term}[MeSH]</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {searchTotal > 0 && (
            <p className="text-xs text-zinc-400 mb-3">נמצאו {searchTotal.toLocaleString()} מאמרים • מציג {searchResults.length}</p>
          )}
          <div className="space-y-4">
            {searchResults.map((r) => <ResultCard key={r.pubmedId} result={r} label={resultType} />)}
          </div>
          {hasMore && searchResults.length > 0 && (
            <div className="mt-6 text-center">
              <button onClick={loadMore} disabled={loadingMore}
                className="px-6 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 text-sm text-zinc-600 dark:text-zinc-400 hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-50 transition-colors">
                {loadingMore ? "טוען..." : `טען עוד (${searchTotal - searchResults.length} נותרו)`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── AI SUGGESTIONS ─── */}
      {tab === "ai-suggest" && (
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            ה-AI מנתח את נושאי האתר ומביא עבור כל נושא: 3 מאמרים חדשים ו-3 מאמרים מובילים מ-PubMed — ישירות להוספה.
          </p>
          {aiTopics.length === 0 && !loadingAiSuggestions && (
            <button onClick={loadAiSuggestions}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">
              🤖 הצע מאמרים לפי נושאי האתר
            </button>
          )}
          {loadingAiSuggestions && (
            <div className="py-10 text-center text-zinc-400 animate-pulse">
              ה-AI מייצר שאילתות לכל הנושאים...
            </div>
          )}
          {aiTopics.length > 0 && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <p className="text-sm text-zinc-500">{aiTopics.length} נושאים</p>
                <button onClick={loadAiSuggestions} className="text-xs text-zinc-400 hover:text-zinc-600 underline">רענן</button>
              </div>
              {aiTopics.map((topic) => (
                <div key={topic.topicSlug}>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                    {topic.topicNameHe}
                  </h3>
                  {topic.loading ? (
                    <p className="text-xs text-zinc-400 animate-pulse">מביא מאמרים...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* New articles */}
                      <div>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">🆕 מאמרים חדשים (3 שנים)</p>
                        {topic.newArticles.length === 0
                          ? <p className="text-xs text-zinc-400">לא נמצאו</p>
                          : <div className="space-y-3">
                              {topic.newArticles.map((r) => <ResultCard key={r.pubmedId} result={r} label="new" />)}
                            </div>
                        }
                      </div>
                      {/* Top articles */}
                      <div>
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">⭐ מאמרים מובילים</p>
                        {topic.topArticles.length === 0
                          ? <p className="text-xs text-zinc-400">לא נמצאו</p>
                          : <div className="space-y-3">
                              {topic.topArticles.map((r) => <ResultCard key={r.pubmedId} result={r} label="top" />)}
                            </div>
                        }
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── UPLOAD ─── */}
      {tab === "upload" && (
        <div className="max-w-xl">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            העלה PDF של מאמר מחקרי. המערכת תחלץ את המידע ותנתח עם AI.
          </p>
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full py-10 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm disabled:opacity-50">
            {uploading ? "מחלץ מידע מה-PDF..." : "לחץ להעלאת PDF"}
          </button>
          {uploadedMeta && (
            <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">כותרת</label>
                <input value={uploadedMeta.title}
                  onChange={(e) => setUploadedMeta({ ...uploadedMeta, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  dir="ltr" />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Abstract</label>
                <textarea value={uploadedMeta.abstract}
                  onChange={(e) => setUploadedMeta({ ...uploadedMeta, abstract: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  dir="ltr" />
              </div>
              <button onClick={analyzeAndSaveUpload} disabled={analyzingUpload}
                className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                {analyzingUpload ? "מנתח עם AI ושומר..." : "נתח עם AI והוסף לאתר"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
