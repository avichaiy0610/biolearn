export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import { isAdmin } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminStatsPage({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  if (!(await isAdmin())) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center text-zinc-400">גישה נדחתה</div>
  );

  const isHe = lang === "he";

  const [
    userCount, topicCount, subtopicCount, hiddenSubtopicCount,
    articleCount, publishedArticleCount, questionCount,
    chatLogCount, suggestionCount,
    topTopics, recentArticles, recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.topic.count(),
    prisma.subtopic.count({ where: { hidden: false } }),
    prisma.subtopic.count({ where: { hidden: true } }),
    prisma.article.count(),
    prisma.article.count({ where: { hidden: false } }),
    prisma.question.count({ where: { approved: true } }),
    prisma.chatLog.count(),
    prisma.contentSuggestion.count({ where: { approved: false, rejected: false } }),
    prisma.chatLog.groupBy({
      by: ["topicName"],
      _count: { topicName: true },
      orderBy: { _count: { topicName: "desc" } },
      take: 8,
    }),
    prisma.article.findMany({
      orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, title: true, year: true, source: true, hidden: true, createdAt: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" }, take: 5,
      select: { id: true, email: true, name: true, createdAt: true },
    }),
  ]);

  const statCards = [
    { label: isHe ? "משתמשים" : "Users", value: userCount, icon: "👤", color: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900" },
    { label: isHe ? "נושאים" : "Topics", value: topicCount, icon: "📚", color: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900" },
    { label: isHe ? "תת-נושאים" : "Subtopics", value: `${subtopicCount} (${hiddenSubtopicCount} ${isHe ? "מוסתרים" : "hidden"})`, icon: "📝", color: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900" },
    { label: isHe ? "מאמרים" : "Articles", value: `${publishedArticleCount}/${articleCount} ${isHe ? "מפורסמים" : "published"}`, icon: "🔬", color: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900" },
    { label: isHe ? "שאלות מאושרות" : "Approved Questions", value: questionCount, icon: "❓", color: "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900" },
    { label: isHe ? "שאילתות צ׳אט" : "Chat Queries", value: chatLogCount, icon: "💬", color: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-900" },
    { label: isHe ? "הצעות ממתינות" : "Pending Suggestions", value: suggestionCount, icon: "🧠", color: suggestionCount > 0 ? "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900" : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" dir={isHe ? "rtl" : "ltr"}>
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/${lang}/admin`} className="text-sm text-zinc-400 hover:text-emerald-600 transition-colors">
          {isHe ? "← ניהול" : "← Admin"}
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600">/</span>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {isHe ? "📊 סטטיסטיקות פלטפורמה" : "📊 Platform Statistics"}
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most asked topics */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
            {isHe ? "💬 נושאים שנשאלו הכי הרבה" : "💬 Most Asked Topics"}
          </h2>
          {topTopics.length === 0 ? (
            <p className="text-sm text-zinc-400">{isHe ? "אין נתונים עדיין" : "No data yet"}</p>
          ) : (
            <div className="space-y-2">
              {topTopics.map((t, i) => (
                <div key={t.topicName} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{t.topicName}</span>
                      <span className="text-xs text-zinc-400 shrink-0 ms-2">{t._count.topicName}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700">
                      <div
                        className="h-1.5 rounded-full bg-emerald-500"
                        style={{ width: `${Math.round((t._count.topicName / (topTopics[0]._count.topicName || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent articles */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
            {isHe ? "🔬 מאמרים אחרונים" : "🔬 Recent Articles"}
          </h2>
          <div className="space-y-2">
            {recentArticles.map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${a.hidden ? "bg-zinc-300 dark:bg-zinc-600" : "bg-emerald-500"}`} />
                <div className="min-w-0">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{a.title}</p>
                  <p className="text-xs text-zinc-400">{a.year ?? "—"} · {a.source}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href={`/${lang}/admin/articles`} className="mt-3 inline-block text-xs text-emerald-600 hover:underline">
            {isHe ? "כל המאמרים ←" : "All articles →"}
          </Link>
        </section>

        {/* Recent users */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
            {isHe ? "👤 משתמשים אחרונים" : "👤 Recent Users"}
          </h2>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-zinc-400">{isHe ? "אין משתמשים עדיין" : "No users yet"}</p>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                    {(u.name ?? u.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{u.name ?? u.email}</p>
                    <p className="text-xs text-zinc-400 truncate">{u.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick links */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
            {isHe ? "⚡ פעולות מהירות" : "⚡ Quick Actions"}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: `/${lang}/admin/content`, label: isHe ? "ניהול תוכן" : "Content", icon: "📚" },
              { href: `/${lang}/admin/articles`, label: isHe ? "מאמרים" : "Articles", icon: "🔬" },
              { href: `/${lang}/admin/questions`, label: isHe ? "שאלות" : "Questions", icon: "❓" },
              { href: `/${lang}/admin/suggestions`, label: isHe ? "הצעות" : "Suggestions", icon: "🧠" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 transition-colors text-sm text-zinc-700 dark:text-zinc-300"
              >
                <span>{l.icon}</span> {l.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
