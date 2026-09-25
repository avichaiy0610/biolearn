import { BOOKS, type TopicGuide as Guide } from "@/content/topic-guides";
import { isolatePrimes } from "@/lib/text";

// Learning goals, "what matters for the exam" and textbook references for a topic.
export default function TopicGuide({ guide, lang }: { guide: Guide; lang: string }) {
  const he = lang === "he";
  return (
    <section className="mb-10 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-zinc-800 overflow-hidden" aria-labelledby="guide-title">
      <h2 id="guide-title" className="px-5 py-3 text-lg font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900">
        🧭 {he ? "מדריך לנושא" : "Topic guide"}
      </h2>
      <div className="grid gap-6 p-5 md:grid-cols-2">
        <div>
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">🎯 {he ? "מטרות למידה" : "Learning goals"}</h3>
          <p className="text-xs text-zinc-500 mb-2">{he ? "בסוף הנושא תוכלו:" : "By the end you should be able to:"}</p>
          <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300 list-disc ps-5">
            {guide.goalsHe.map((g) => <li key={g}>{isolatePrimes(g)}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">📝 {he ? "מה חשוב למבחן" : "What matters for the exam"}</h3>
          <ul className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
            {guide.examHe.map((e) => (
              <li key={e} className="flex gap-2">
                <span className="text-amber-500 shrink-0" aria-hidden>★</span>
                <span>{isolatePrimes(e)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-5 pb-5">
        <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 mb-2">📚 {he ? "קריאה בספרי הלימוד" : "Textbook reading"}</h3>
        <ul className="space-y-3">
          {guide.refs.map((r) => {
            const b = BOOKS[r.book];
            return (
              <li key={r.book} className="text-sm">
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  <bdi dir="ltr"><i>{b.title}</i>, {b.edition}</bdi>
                  <span className="text-xs text-zinc-500 ms-2"><bdi dir="ltr">{b.authors}</bdi></span>
                </p>
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {r.chapters.map((c) => (
                    <li key={c.n} className="text-xs px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200">
                      <bdi dir="ltr">Ch. {c.n}: {c.title}</bdi>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
