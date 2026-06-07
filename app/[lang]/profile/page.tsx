export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const session = await auth();
  if (!session?.user?.email) redirect(`/${lang}/auth/login`);

  const isHe = lang === "he";
  const email = session.user.email;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      progress: {
        include: { subtopic: { include: { topic: true } } },
        orderBy: { updatedAt: "desc" },
      },
      quizResults: {
        include: { subtopic: { include: { topic: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect(`/${lang}/auth/login`);

  // Best quiz score per subtopic
  const bestScores: Record<string, { score: number; type: string; topicSlug: string; topicName: string; subtopicName: string }> = {};
  for (const r of user.quizResults) {
    const key = r.subtopicId;
    if (!bestScores[key] || r.score > bestScores[key].score) {
      bestScores[key] = {
        score: r.score,
        type: r.type,
        topicSlug: r.subtopic.topic.slug,
        topicName: isHe ? r.subtopic.topic.nameHe : r.subtopic.topic.nameEn,
        subtopicName: isHe ? r.subtopic.nameHe : r.subtopic.nameEn,
      };
    }
  }

  // Progress per topic
  const topicProgress: Record<string, { slug: string; name: string; visited: number; total: number }> = {};
  for (const p of user.progress) {
    const slug = p.subtopic.topic.slug;
    if (!topicProgress[slug]) {
      topicProgress[slug] = {
        slug,
        name: isHe ? p.subtopic.topic.nameHe : p.subtopic.topic.nameEn,
        visited: 0,
        total: 0,
      };
    }
    if (p.visited) topicProgress[slug].visited++;
  }

  // Get total subtopics per topic for % calculation
  const topicSlugs = Object.keys(topicProgress);
  if (topicSlugs.length > 0) {
    const topics = await prisma.topic.findMany({
      where: { slug: { in: topicSlugs } },
      include: { _count: { select: { subtopics: { where: { hidden: false } } } } },
    });
    for (const t of topics) {
      if (topicProgress[t.slug]) topicProgress[t.slug].total = t._count.subtopics;
    }
  }

  const topicList = Object.values(topicProgress).sort((a, b) => b.visited - a.visited);
  const scoreList = Object.values(bestScores).sort((a, b) => b.score - a.score);
  const avgScore = scoreList.length > 0
    ? Math.round(scoreList.reduce((sum, s) => sum + s.score, 0) / scoreList.length)
    : null;
  const totalVisited = user.progress.filter((p) => p.visited).length;
  const recentQuizzes = user.quizResults.slice(0, 8);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir={isHe ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-3xl font-bold text-emerald-700 dark:text-emerald-300">
          {(user.name ?? email).charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {user.name ?? email.split("@")[0]}
          </h1>
          <p className="text-sm text-zinc-400">{email}</p>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isHe ? "הצטרף" : "Joined"} {new Date(user.createdAt).toLocaleDateString(isHe ? "he-IL" : "en-US")}
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: "📚", value: totalVisited, label: isHe ? "נושאים שנלמדו" : "Subtopics studied" },
          { icon: "❓", value: user.quizResults.length, label: isHe ? "בחנים שהושלמו" : "Quizzes completed" },
          { icon: "🏆", value: avgScore !== null ? `${avgScore}%` : "—", label: isHe ? "ממוצע בחנים" : "Avg quiz score" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</div>
            <div className="text-xs text-zinc-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Topic progress */}
      {topicList.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            {isHe ? "📚 התקדמות לפי נושא" : "📚 Progress by Topic"}
          </h2>
          <div className="space-y-3">
            {topicList.map((t) => {
              const pct = t.total > 0 ? Math.round((t.visited / t.total) * 100) : 0;
              return (
                <Link
                  key={t.slug}
                  href={`/${lang}/topics/${t.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                        {t.name}
                      </span>
                      <span className="text-xs text-zinc-400 shrink-0 ms-2">{t.visited}/{t.total}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700">
                      <div
                        className={`h-1.5 rounded-full transition-all ${pct === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0 font-medium">{pct}%</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Quiz history */}
      {recentQuizzes.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
            {isHe ? "🏆 ציוני בחנים אחרונים" : "🏆 Recent Quiz Scores"}
          </h2>
          <div className="space-y-2">
            {recentQuizzes.map((r) => {
              const subName = isHe ? r.subtopic.nameHe : r.subtopic.nameEn;
              const topicSlug = r.subtopic.topic.slug;
              return (
                <Link
                  key={r.id}
                  href={`/${lang}/topics/${topicSlug}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 transition-colors"
                >
                  <span className={`text-sm font-bold w-12 text-center shrink-0 px-2 py-0.5 rounded-lg ${
                    r.score >= 80 ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : r.score >= 60 ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  }`}>
                    {r.score}%
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 truncate">{subName}</p>
                    <p className="text-xs text-zinc-400">
                      {r.correct}/{r.total} · {r.type === "official" ? (isHe ? "רשמי" : "official") : (isHe ? "AI" : "AI")} ·{" "}
                      {new Date(r.createdAt).toLocaleDateString(isHe ? "he-IL" : "en-US")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {totalVisited === 0 && user.quizResults.length === 0 && (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-4xl mb-4">🌱</p>
          <p className="text-base font-medium mb-2">{isHe ? "התחל ללמוד!" : "Start learning!"}</p>
          <p className="text-sm mb-6">{isHe ? "פתח תת-נושאים וענה על בחנים כדי לראות את ההתקדמות שלך כאן" : "Open subtopics and complete quizzes to see your progress here"}</p>
          <Link href={`/${lang}/topics`} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
            {isHe ? "גלה נושאים" : "Explore Topics"}
          </Link>
        </div>
      )}
    </div>
  );
}
