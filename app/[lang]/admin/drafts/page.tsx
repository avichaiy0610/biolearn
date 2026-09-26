export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import ProcessAnimation from "@/components/ProcessAnimation";
import type { Finding, StepLike } from "@/lib/animation-standards";

const dict = { process: { step: "שלב", of: "מתוך", explain: "הסבר", explaining: "מסביר...", previous: "הקודם", next: "הבא", playAnimation: "הפעל אנימציה", pauseAnimation: "עצור אנימציה" } };

// AI animation drafts from the panel. They are not on the public site; each is
// polished to the animation standard, checked visually and then published with
// scripts/animation-drafts.ts (see CLAUDE.md → "Animation drafts workflow").
export default async function DraftsPage({ params, searchParams }: PageProps<"/[lang]/admin/drafts">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const sp = await searchParams;
  const selected = typeof sp.id === "string" ? sp.id : null;

  const drafts = await prisma.processDraft.findMany({ orderBy: { createdAt: "desc" }, take: 50 }).catch(() => []);
  const current = drafts.find((d) => d.id === selected) ?? null;
  const parse = <T,>(s: string | null, fb: T): T => { try { return s ? (JSON.parse(s) as T) : fb; } catch { return fb; } };
  const STATUS: Record<string, string> = { pending: "ממתינה לליטוש", published: "פורסמה", discarded: "נדחתה" };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10" dir="rtl">
      <Link href={`/${lang}/admin`} className="text-sm text-zinc-500 hover:text-emerald-600">→ חזרה לניהול</Link>
      <h1 className="text-2xl font-bold mt-3 mb-2">🎬 טיוטות אנימציה</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
        כל יצירה או בנייה מחדש של אנימציה מהפאנל נשמרת כאן כטיוטה, והאנימציה החיה לא משתנה. טיוטה מתפרסמת רק אחרי ליטוש לסטנדרט
        (מבנים ביולוגיים אמיתיים, סדר שלבים לפי Campbell/Alberts, תוויות בעברית ובאנגלית עם קווי הפניה, מקרא, הערת &quot;סכמטי&quot;, קריאות ב-390px)
        ובדיקה ויזואלית. לליטוש ופרסום בקשו מ-Claude Code: &quot;לטש ופרסם את טיוטת האנימציה&quot;.
      </p>

      {drafts.length === 0 ? (
        <p className="text-zinc-400 py-10 text-center">אין טיוטות.</p>
      ) : (
        <ul className="flex flex-col gap-2 mb-8">
          {drafts.map((d) => {
            const issues = parse<Finding[]>(d.issues, []);
            const errors = issues.filter((f) => f.level === "error").length;
            return (
              <li key={d.id}>
                <Link
                  href={`/${lang}/admin/drafts?id=${d.id}`}
                  className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border px-4 py-3 text-sm transition-colors ${d.id === selected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "border-zinc-200 dark:border-zinc-700 hover:border-emerald-400"}`}
                >
                  <span className="font-semibold">{d.nameHe}</span>
                  <span className="text-zinc-500">{d.targetSlug ? "בנייה מחדש" : "אנימציה חדשה"}</span>
                  <span className={d.status === "pending" ? "text-amber-600" : d.status === "published" ? "text-emerald-600" : "text-zinc-400"}>{STATUS[d.status] ?? d.status}</span>
                  <span className="text-zinc-500">{errors ? `${errors} ליקויים בטיוטה הגולמית` : "ללא ליקויים אוטומטיים"}</span>
                  <span className="ms-auto text-xs text-zinc-400 font-mono" dir="ltr">{d.id}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {current && (() => {
        const steps = parse<StepLike[]>(current.steps, []).map((s, i) => ({ id: String(i), order: i + 1, ...s }));
        const issues = parse<Finding[]>(current.issues, []);
        return (
          <section>
            <h2 className="text-lg font-bold mb-1">תצוגה מקדימה — טיוטה גולמית</h2>
            <p className="text-xs text-zinc-500 mb-3">זו הטיוטה כפי שה-AI יצר אותה, לפני ליטוש. {current.feedback ? `הערות לבנייה מחדש: ${current.feedback}` : ""}</p>
            {issues.length > 0 && (
              <ul className="mb-4 text-xs rounded-xl border border-amber-300/60 bg-amber-50 dark:bg-amber-900/20 p-3 space-y-1" dir="ltr">
                {issues.slice(0, 20).map((f, i) => (
                  <li key={i} className={f.level === "error" ? "text-red-600" : "text-amber-700 dark:text-amber-300"}>
                    {f.level === "error" ? "✗" : "!"} {f.step ? `step ${f.step}: ` : ""}{f.msg}
                  </li>
                ))}
              </ul>
            )}
            <ProcessAnimation steps={steps} lang={lang as Locale} dict={dict} processName={current.nameHe} />
          </section>
        );
      })()}
    </div>
  );
}
