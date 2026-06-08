export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/dictionaries";
import type { Locale } from "@/lib/dictionaries";
import Link from "next/link";
import FeedbackActions from "./FeedbackActions";

const TYPE_LABEL: Record<string, { he: string; en: string }> = {
  animation:   { he: "אנימציה",   en: "Animation" },
  description: { he: "תיאור",     en: "Description" },
  diagram:     { he: "דיאגרמה",   en: "Diagram" },
};

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  if (!(await isAdmin())) notFound();

  const isHe = lang === "he";

  const items = await prisma.contentFeedback.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 300,
  });

  const open     = items.filter((i) => i.status === "open");
  const resolved = items.filter((i) => i.status === "resolved");

  function Section({ list, title }: { list: typeof items; title: string }) {
    if (list.length === 0) return null;
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{title}</h2>
        {list.map((item) => {
          const typeLabel = TYPE_LABEL[item.targetType] ?? { he: item.targetType, en: item.targetType };
          const date = new Date(item.createdAt).toLocaleString(isHe ? "he-IL" : "en-US", {
            day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
          });
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4 space-y-2 ${
                item.status === "open"
                  ? "border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20"
                  : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-medium ${
                    item.status === "open"
                      ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                      : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
                  }`}>
                    {item.status === "open" ? (isHe ? "פתוח" : "Open") : (isHe ? "טופל" : "Resolved")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium">
                    {isHe ? typeLabel.he : typeLabel.en}
                  </span>
                  <Link
                    href={`/${lang}/topics/${item.topicSlug}`}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                  >
                    {item.topicSlug}
                  </Link>
                  {item.processSlug && (
                    <Link
                      href={`/${lang}/topics/${item.topicSlug}/${item.processSlug}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
                    >
                      ▶ {item.processSlug.split("-animation-")[0]}
                    </Link>
                  )}
                  <span className="text-zinc-400">{date}</span>
                </div>
                <FeedbackActions id={item.id} status={item.status} lang={lang} />
              </div>
              <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
                {item.comment}
              </p>
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {isHe ? "הערות תוכן" : "Content Feedback"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isHe
              ? `${open.length} פתוחות • ${resolved.length} טופלו`
              : `${open.length} open • ${resolved.length} resolved`}
          </p>
        </div>
        <Link
          href={`/${lang}/admin`}
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          ← {isHe ? "חזרה לאדמין" : "Back to admin"}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-zinc-400 text-sm">{isHe ? "אין הערות עדיין" : "No feedback yet"}</p>
      ) : (
        <>
          <Section list={open} title={isHe ? "פתוחות" : "Open"} />
          <Section list={resolved} title={isHe ? "טופלו" : "Resolved"} />
        </>
      )}
    </div>
  );
}
