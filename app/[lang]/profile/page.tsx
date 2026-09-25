export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { progressSummary } from "@/lib/progress-summary";

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

  const scoreList = Object.values(bestScores).sort((a, b) => b.score - a.score);
  const avgScore = scoreList.length > 0
    ? Math.round(scoreList.reduce((sum, s) => sum + s.score, 0) / scoreList.length)
    : null;
  const totalVisited = user.progress.filter((p) => p.visited).length;
  const summary = await progressSummary(user.id);
  const overallPct = summary.totalSubs ? Math.round((summary.totalVisited / summary.totalSubs) * 100) : 0;
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

      {/* Streak + key numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: "🔥", value: summary.streak.current, label: isHe ? "ימים ברצף" : "Day streak" },
          { icon: "📈", value: `${overallPct}%`, label: isHe ? "כיסוי החומר" : "Coverage" },
          { icon: "🏆", value: avgScore !== null ? `${avgScore}%` : "—", label: isHe ? "ממוצע בחנים" : "Avg quiz score" },
          { icon: "🔁", value: summary.dueReviews, label: isHe ? "כרטיסים לחזרה" : "Cards due" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 text-center">
            <div className="text-2xl mb-1" aria-hidden>{s.icon}</div>
            <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{s.value}</div>
            <div className="text-xs text-zinc-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mb-8 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4" aria-labelledby="streak-title">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h2 id="streak-title" className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {isHe ? "14 הימים האחרונים" : "Last 14 days"}
          </h2>
          <span className="text-xs text-zinc-500">
            {isHe ? `הרצף הארוך ביותר: ${summary.streak.longest} ימים` : `Longest streak: ${summary.streak.longest} days`}
            {!summary.studiedToday && summary.streak.current > 0 && (isHe ? " · למדו משהו היום כדי לשמור על הרצף" : " · study today to keep it")}
          </span>
        </div>
        <ol className="flex gap-1.5 justify-between">
          {summary.last14.map((d) => (
            <li key={d.day} title={d.day} aria-label={`${d.day}: ${d.active ? (isHe ? "למדת" : "studied") : (isHe ? "לא למדת" : "no activity")}`}
              className={`h-7 flex-1 rounded-md ${d.active ? "bg-emerald-500" : "bg-zinc-100 dark:bg-zinc-700"}`} />
          ))}
        </ol>
      </section>

      {/* Weak spots */}
      <section className="mb-8" aria-labelledby="weak-title">
        <h2 id="weak-title" className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
          🎯 {isHe ? "נקודות לחיזוק" : "Weak spots"}
        </h2>
        {summary.weakSubtopics.length === 0 && summary.weakTerms.length === 0 ? (
          <p className="text-sm text-zinc-500 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 p-4">
            {user.quizResults.length === 0
              ? (isHe ? "פתרו כמה בחנים ותרגולים — כאן יופיעו הנושאים שכדאי לחזור עליהם." : "Take a few quizzes — subtopics worth revisiting will show up here.")
              : (isHe ? "אין כרגע נקודות חלשות בולטות. יפה!" : "No clear weak spots right now. Nice!")}
          </p>
        ) : (
          <div className="space-y-4">
            {summary.weakSubtopics.length > 0 && (
              <ul className="space-y-2">
                {summary.weakSubtopics.map((w) => (
                  <li key={w.id}>
                    <Link href={`/${lang}/topics/${w.topicSlug}#sub-${w.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 hover:border-red-400 transition-colors">
                      <span className="text-sm font-bold w-12 text-center shrink-0 px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">{w.avg}%</span>
                      <span className="flex-1 min-w-0 text-sm text-zinc-800 dark:text-zinc-200">{isHe ? w.nameHe : w.nameEn}</span>
                      <span className="text-xs text-zinc-500 shrink-0">{isHe ? "לחזור על החומר" : "Revisit"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {summary.weakTerms.length > 0 && (
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{isHe ? "מונחים שנשכחו שוב ושוב:" : "Terms you keep forgetting:"}</p>
                <div className="flex flex-wrap gap-2">
                  {summary.weakTerms.map((t) => (
                    <Link key={t.cardId} href={`/${lang}/review?topic=${t.topicSlug}`}
                      className="text-xs px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                      {t.he} · <bdi dir="ltr">{t.en}</bdi>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {summary.dueReviews > 0 && (
          <Link href={`/${lang}/review`} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">
            🔁 {isHe ? `${summary.dueReviews} כרטיסים מחכים לחזרה` : `${summary.dueReviews} cards due`}
          </Link>
        )}
      </section>

      {/* Coverage per topic (all active topics) */}
      <section className="mb-8" aria-labelledby="coverage-title">
        <h2 id="coverage-title" className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
          📚 {isHe ? "כיסוי החומר לפי נושא" : "Coverage by topic"}
        </h2>
        <p className="text-xs text-zinc-500 mb-4">
          {isHe ? `קראתם ${summary.totalVisited} מתוך ${summary.totalSubs} תתי-נושאים` : `${summary.totalVisited} of ${summary.totalSubs} subtopics read`}
        </p>
        <div className="space-y-2">
          {summary.coverage.map((t) => (
            <Link key={t.slug} href={`/${lang}/topics/${t.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-emerald-400 transition-colors group">
              <span aria-hidden className="text-xl">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{isHe ? t.nameHe : t.nameEn}</span>
                  <span className="text-xs text-zinc-400 shrink-0 ms-2"><bdi dir="ltr">{t.visited}/{t.total}</bdi></span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-700">
                  <div className={`h-1.5 rounded-full ${t.pct === 100 ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
              <span className="text-xs text-zinc-500 shrink-0 font-medium w-10 text-end">{t.pct}%</span>
            </Link>
          ))}
        </div>
      </section>

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
                      {r.correct}/{r.total} · {r.type === "official" ? (isHe ? "מבחן רשמי" : "official") : r.type === "bank" ? (isHe ? "מאגר שאלות" : "bank") : "AI"} ·{" "}
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
