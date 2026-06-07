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

type ArticleSuggestion = {
  topicSlug: string;
  topicNameHe: string;
  newQuery: string;
  topQuery: string;
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

  // Search state
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

  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<ArticleSuggestion[]>([]);
  const [loadingAiSuggestions, setLoadingAiSuggestions] = useState(false);

  // Upload state
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

    if (append) setLoadingMore(false);
    else {
      setSearching(false);
      // Trigger AI refinement
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
  }

  async function handleSearch() {
    setSearchPage(0);
    await runSearch(0, false);
  }

  async function loadMore() {
    await runSearch(searchPage + 1, true);
  }

  async function loadAiSuggestions() {
    setLoadingAiSuggestions(true);
    setAiSuggestions([]);
    const res = await fetch("/api/admin/suggest-articles");
    if (res.ok) setAiSuggestions((await res.json()).suggestions ?? []);
    setLoadingAiSuggestions(false);
  }

  function applyQuery(q: string, type: "top" | "new") {
    setQuery(q);
    setResultType(type);
    setTab("search");
    // Auto-run after state settles
    setTimeout(async () => {
      setSearchPage(0);
      setSearchResults([]);
      setRefinement(null);
      setSearching(true);
      const sort = type === "new" ? "date" : "relevance";
      const recency = type === "new" ? "3" : "";
      const url =
        `/api/admin/pubmed-search?query=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&page=0&sort=${sort}` +
        (recency ? `&recency=${recency}` : "");
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.articles ?? []);
      setSearchTotal(data.total ?? 0);
      setSearching(false);
    }, 50);
  }

  async function analyzeAndAdd(result: PubMedResult) {
    setAddingId(result.pubmedId);

    const [analysisRes] = await Promise.all([
      fetch("/api/admin/analyze-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title, abstract: result.abstract,
          authors: result.authors, journal: result.journal, year: result.year,
        }),
      }),
    ]);
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

    if (saveRes.ok) {
      await fetchArticles();
    } else {
      const err = await saveRes.json();
      alert(err.error ?? "שגיאה בשמירה");
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadedMeta(null);
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
            return (
              <div key={article.id}
                className={`rounded-xl border p-4 bg-white dark:bg-zinc-800 ${
                  article.hidden ? "border-zinc-200 dark:border-zinc-700 opacity-60"
                    : "border-emerald-200 dark:border-emerald-800"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50 leading-snug">{article.title}</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {authors.slice(0, 3).join(", ")}{authors.length > 3 ? " ..." : ""}
                      {article.journal ? ` • ${article.journal}` : ""}
                      {article.year ? ` • ${article.year}` : ""}
                    </p>
                    {keyFindings.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {keyFindings.slice(0, 2).map((f, i) => (
                          <li key={i} className="text-xs text-zinc-500 dark:text-zinc-400">• {f}</li>
                        ))}
                      </ul>
                    )}
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
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    article.hidden ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
                      : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"}`}>
                    {article.hidden ? "מוסתר" : "מפורסם"}
                  </span>
                  <span className="text-xs text-zinc-400">{article.source === "pubmed" ? "PubMed" : "PDF"}</span>
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
          {/* Search bar */}
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

          {/* New / Top toggle */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => setResultType("top")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                resultType === "top"
                  ? "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 hover:bg-zinc-200"}`}>
              ⭐ מובילים (לפי רלוונטיות וציטוטים)
            </button>
            <button onClick={() => setResultType("new")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                resultType === "new"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 hover:bg-zinc-200"}`}>
              🆕 חדשים (3 שנים אחרונות)
            </button>
          </div>

          {/* AI refinement suggestions */}
          {refining && (
            <p className="text-xs text-zinc-400 mb-3 animate-pulse">🤖 מנתח את החיפוש...</p>
          )}
          {refinement && (
            <div className="mb-5 rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 p-4">
              {refinement.tip && (
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">💡 {refinement.tip}</p>
              )}
              {refinement.refinedQueries.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-zinc-500 mb-2">שאילתות מדויקות יותר:</p>
                  <div className="flex flex-wrap gap-2">
                    {refinement.refinedQueries.map((q) => (
                      <button key={q} onClick={() => applyQuery(q, resultType)}
                        className="text-xs px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        dir="ltr">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {refinement.meshTerms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-2">מונחי MeSH:</p>
                  <div className="flex flex-wrap gap-2">
                    {refinement.meshTerms.map((term) => (
                      <button key={term}
                        onClick={() => applyQuery(`${query} ${term}[MeSH]`, resultType)}
                        className="text-xs px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
                        dir="ltr">
                        {term}[MeSH]
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {searchTotal > 0 && (
            <p className="text-xs text-zinc-400 mb-3">נמצאו {searchTotal.toLocaleString()} מאמרים • מציג {searchResults.length}</p>
          )}
          <div className="space-y-4">
            {searchResults.map((result) => {
              const isAdding = addingId === result.pubmedId;
              const alreadySaved = savedIds.has(result.pubmedId);
              return (
                <div key={result.pubmedId}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm leading-snug flex-1">{result.title}</p>
                    {result.citationCount != null && (
                      <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 font-medium whitespace-nowrap">
                        {result.citationCount.toLocaleString()} ציטוטים
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">
                    {result.authors.slice(0, 3).join(", ")}
                    {result.journal ? ` • ${result.journal}` : ""}
                    {result.year ? ` • ${result.year}` : ""}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-3">{result.abstract}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {alreadySaved ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ כבר קיים</span>
                    ) : (
                      <button onClick={() => analyzeAndAdd(result)} disabled={!!addingId}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">
                        {isAdding ? "מנתח ושומר..." : "נתח והוסף"}
                      </button>
                    )}
                    <a href={result.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-emerald-500 hover:underline">PubMed →</a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load more */}
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
            ה-AI ינתח את הנושאים הקיימים באתר ויציע שאילתות PubMed מותאמות — מאמרים חדשים ומאמרי עוגן מובילים.
          </p>
          {aiSuggestions.length === 0 && !loadingAiSuggestions && (
            <button onClick={loadAiSuggestions}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors">
              🤖 הצע מאמרים לפי נושאי האתר
            </button>
          )}
          {loadingAiSuggestions && (
            <div className="py-10 text-center text-zinc-400 animate-pulse">
              ה-AI מנתח את הנושאים ומייצר שאילתות...
            </div>
          )}
          {aiSuggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {aiSuggestions.length} נושאים — לחץ על שאילתה כדי לחפש מיד
                </p>
                <button onClick={loadAiSuggestions}
                  className="text-xs text-zinc-400 hover:text-zinc-600 underline">רענן</button>
              </div>
              {aiSuggestions.map((s) => (
                <div key={s.topicSlug}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50 mb-3">{s.topicNameHe}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shrink-0">
                        🆕 חדשים
                      </span>
                      <button onClick={() => applyQuery(s.newQuery, "new")}
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline text-right"
                        dir="ltr">
                        {s.newQuery}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shrink-0">
                        ⭐ מובילים
                      </span>
                      <button onClick={() => applyQuery(s.topQuery, "top")}
                        className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 underline text-right"
                        dir="ltr">
                        {s.topQuery}
                      </button>
                    </div>
                  </div>
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
