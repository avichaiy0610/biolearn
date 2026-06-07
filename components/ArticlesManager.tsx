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
};

function parseJson<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; } catch { return fallback; }
}

export default function ArticlesManager() {
  const [tab, setTab] = useState<"list" | "search" | "upload">("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  // PubMed search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PubMedResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  // Upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedMeta, setUploadedMeta] = useState<PubMedResult | null>(null);
  const [analyzingUpload, setAnalyzingUpload] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    const res = await fetch("/api/admin/articles");
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }

  async function searchPubMed() {
    if (!query.trim()) return;
    setSearching(true);
    setSearchResults([]);
    const res = await fetch(`/api/admin/pubmed-search?query=${encodeURIComponent(query)}&limit=10`);
    const data = await res.json();
    setSearchResults(data.articles ?? []);
    setSearching(false);
  }

  async function analyzeAndAdd(article: PubMedResult) {
    setAnalyzingId(article.pubmedId);
    const analysisRes = await fetch("/api/admin/analyze-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title,
        abstract: article.abstract,
        authors: article.authors,
        journal: article.journal,
        year: article.year,
      }),
    });
    const analysis = await analysisRes.json();
    setAnalyzingId(null);

    setAddingId(article.pubmedId);
    const saveRes = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pubmedId: article.pubmedId,
        title: article.title,
        authors: article.authors,
        journal: article.journal,
        year: article.year,
        abstract: article.abstract,
        abstractHe: analysis.abstractHe,
        keyFindings: analysis.keyFindings,
        topicSlugs: analysis.topicSlugs,
        subtopicIds: analysis.subtopicIds,
        url: article.url,
        source: "pubmed",
      }),
    });
    setAddingId(null);

    if (saveRes.ok) {
      await fetchArticles();
      setTab("list");
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
    if (res.ok) {
      setUploadedMeta({ ...data, pubmedId: "", url: "" });
    } else {
      alert(data.error ?? "שגיאה בעיבוד הקובץ");
    }
  }

  async function analyzeAndSaveUpload() {
    if (!uploadedMeta) return;
    setAnalyzingUpload(true);
    const analysisRes = await fetch("/api/admin/analyze-article", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadedMeta),
    });
    const analysis = await analysisRes.json();

    const saveRes = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: uploadedMeta.title,
        authors: uploadedMeta.authors,
        journal: uploadedMeta.journal,
        year: uploadedMeta.year,
        abstract: uploadedMeta.abstract,
        abstractHe: analysis.abstractHe,
        keyFindings: analysis.keyFindings,
        topicSlugs: analysis.topicSlugs,
        subtopicIds: analysis.subtopicIds,
        source: "upload",
      }),
    });
    setAnalyzingUpload(false);

    if (saveRes.ok) {
      setUploadedMeta(null);
      await fetchArticles();
      setTab("list");
    } else {
      const err = await saveRes.json();
      alert(err.error ?? "שגיאה בשמירה");
    }
  }

  async function toggleHidden(article: Article) {
    await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: !article.hidden }),
    });
    await fetchArticles();
  }

  async function deleteArticle(id: string) {
    if (!confirm("למחוק מאמר זה?")) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    await fetchArticles();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">ניהול מאמרים מדעיים</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-700">
        {(["list", "search", "upload"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {t === "list" ? `רשימה (${articles.length})` : t === "search" ? "חיפוש PubMed" : "העלאת PDF"}
          </button>
        ))}
      </div>

      {/* LIST TAB */}
      {tab === "list" && (
        <div className="space-y-4">
          {loading && <p className="text-zinc-400">טוען...</p>}
          {!loading && articles.length === 0 && (
            <p className="text-zinc-400 text-center py-10">אין מאמרים. חפש ב-PubMed או העלה PDF.</p>
          )}
          {articles.map((article) => {
            const authors = parseJson<string[]>(article.authors, []);
            const keyFindings = parseJson<string[]>(article.keyFindings, []);
            return (
              <div
                key={article.id}
                className={`rounded-xl border p-4 ${
                  article.hidden
                    ? "border-zinc-200 dark:border-zinc-700 opacity-60"
                    : "border-emerald-200 dark:border-emerald-800"
                } bg-white dark:bg-zinc-800`}
              >
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
                    <button
                      onClick={() => toggleHidden(article)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                        article.hidden
                          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200"
                          : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200"
                      }`}
                    >
                      {article.hidden ? "פרסם" : "הסתר"}
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="px-3 py-1 text-xs rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors"
                    >
                      מחק
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    article.hidden
                      ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"
                      : "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                  }`}>
                    {article.hidden ? "מוסתר" : "מפורסם"}
                  </span>
                  <span className="text-xs text-zinc-400">{article.source === "pubmed" ? "PubMed" : "PDF"}</span>
                  {article.url && (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline">
                      קישור מקורי
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SEARCH TAB */}
      {tab === "search" && (
        <div>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchPubMed()}
              placeholder="חפש מאמרים בביולוגיה (באנגלית)..."
              className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              dir="ltr"
            />
            <button
              onClick={searchPubMed}
              disabled={searching}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {searching ? "מחפש..." : "חפש"}
            </button>
          </div>

          <div className="space-y-4">
            {searchResults.map((result) => {
              const isAnalyzing = analyzingId === result.pubmedId;
              const isAdding = addingId === result.pubmedId;
              const alreadySaved = articles.some((a) => a.pubmedId === result.pubmedId);
              return (
                <div key={result.pubmedId} className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50 text-sm leading-snug mb-1">{result.title}</p>
                  <p className="text-xs text-zinc-400 mb-2">
                    {result.authors.slice(0, 3).join(", ")} • {result.journal} {result.year && `• ${result.year}`}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-3">{result.abstract}</p>
                  <div className="flex items-center gap-3">
                    {alreadySaved ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">✓ כבר קיים</span>
                    ) : (
                      <button
                        onClick={() => analyzeAndAdd(result)}
                        disabled={isAnalyzing || isAdding}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                      >
                        {isAnalyzing ? "מנתח עם AI..." : isAdding ? "שומר..." : "נתח והוסף"}
                      </button>
                    )}
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline">
                      PubMed →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UPLOAD TAB */}
      {tab === "upload" && (
        <div className="max-w-xl">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            העלה PDF של מאמר מחקרי. המערכת תחלץ את המידע ותנתח עם AI.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full py-10 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm disabled:opacity-50"
          >
            {uploading ? "מחלץ מידע מה-PDF..." : "לחץ להעלאת PDF"}
          </button>

          {uploadedMeta && (
            <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">כותרת</label>
                <input
                  value={uploadedMeta.title}
                  onChange={(e) => setUploadedMeta({ ...uploadedMeta, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Abstract</label>
                <textarea
                  value={uploadedMeta.abstract}
                  onChange={(e) => setUploadedMeta({ ...uploadedMeta, abstract: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  dir="ltr"
                />
              </div>
              <button
                onClick={analyzeAndSaveUpload}
                disabled={analyzingUpload}
                className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {analyzingUpload ? "מנתח עם AI ושומר..." : "נתח עם AI והוסף לאתר"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
