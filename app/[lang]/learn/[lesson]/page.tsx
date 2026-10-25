import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import { parseSvgData } from "@/lib/svg-scene";
import { lessonBySlug, lessonQuizQuestions } from "@/content/lessons";
import { parseBody } from "@/content/lessons/parse";
import LessonFigure from "@/components/lesson/LessonFigure";
import FieldIcon from "@/components/FieldIcon";
import { SceneStill } from "@/components/ProcessAnimation";
import LessonPractice from "@/components/lesson/LessonPractice";
import LessonChat from "@/components/lesson/LessonChat";
import ScopeBadge from "@/components/lesson/ScopeBadge";
import { isolatePrimes } from "@/lib/text";
import { scopeForCourse, sectionScope } from "@/content/course-scope";
import { isAdmin } from "@/lib/supabase/server";
import { lessonReview } from "@/lib/lesson-review";
import LessonReviewPanel from "@/components/admin/LessonReviewPanel";
import LessonProgressTracker from "@/components/lesson/LessonProgressTracker";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[lang]/learn/[lesson]">): Promise<Metadata> {
  const { lesson: slug } = await params;
  const l = lessonBySlug(slug);
  if (!l) return {};
  return { title: l.titleHe, description: l.leadHe, ...(l.status === "draft" ? { robots: { index: false } } : {}) };
}

// Inline code = symbols, genotypes and formulas: isolated, so Hebrew prose keeps its order.
// Direction follows the first letter (Latin/Greek → LTR, Hebrew → RTL): "P(Aa | סגול) = …" and
// "χ² = Σ …" read LTR, "מרחק = ½ × …" reads RTL.
// GFM for tables; single "~" stays literal (the text writes "~90%" for "about 90%").
// Ions, primes and charges ("Na⁺", "5'→3'") are isolated in every text node so RTL prose keeps their order.
type MdNode = { type: string; value?: string; children?: MdNode[] };
const remarkIsolate = () => (tree: MdNode) => {
  const walk = (n: MdNode) => {
    if (n.type === "text" && n.value) n.value = isolatePrimes(n.value);
    n.children?.forEach(walk);
  };
  walk(tree);
};
const GFM = [[remarkGfm, { singleTilde: false }], remarkIsolate] as NonNullable<Parameters<typeof ReactMarkdown>[0]["remarkPlugins"]>;
const md: Components = {
  h2: () => null, // headings are rendered by the section wrapper
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[28rem] border-collapse text-[15px] leading-7">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-surface-2">{children}</thead>,
  th: ({ children }) => <th className="border-b border-line px-3 py-2 text-start font-bold text-ink">{children}</th>,
  td: ({ children }) => <td className="border-b border-line px-3 py-2 align-top text-ink">{children}</td>,
  p: ({ children }) => <p className="my-4 text-[16.5px] leading-8 text-ink">{children}</p>,
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 ps-6 text-[16.5px] leading-8">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 ps-6 text-[16.5px] leading-8">{children}</ol>,
  strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
  code: ({ children }) => {
    const text = String(children);
    return (
      <bdi dir={/^[^A-Za-zͰ-Ͽ֐-׿]*[֐-׿]/.test(text) ? "rtl" : "ltr"} className={`rounded bg-surface-2 px-1.5 py-0.5 text-[0.93em] font-semibold text-brand whitespace-nowrap ${text.length > 18 ? "inline-block max-w-full overflow-x-auto align-middle" : ""}`}>
        {text}
      </bdi>
    );
  },
};

export default async function LessonPage({ params }: PageProps<"/[lang]/learn/[lesson]">) {
  const { lang, lesson: slug } = await params;
  if (!hasLocale(lang)) notFound();
  const lesson = lessonBySlug(slug);
  if (!lesson) notFound();

  const sections = parseBody(lesson.bodyHe);
  const courseScope = scopeForCourse(lesson.course.slug);
  const animSlugs = sections.flatMap((s) => s.segments.flatMap((g) => (g.kind === "animation" ? [g.slug] : [])));
  const procs = animSlugs.length
    ? await prisma.process.findMany({
        where: { slug: { in: animSlugs } },
        select: { slug: true, nameHe: true, descHe: true, topic: { select: { slug: true } }, steps: { orderBy: { order: "asc" }, select: { id: true, order: true, titleHe: true, titleEn: true, descHe: true, descEn: true, svgData: true } } },
      }).catch(() => [])
    : [];
  const quiz = lessonQuizQuestions(lesson);
  const draft = lesson.status === "draft";
  const admin = await isAdmin().catch(() => false);
  const review = admin ? await lessonReview(lesson.slug) : null;

  const toc = [
    { id: "objectives", title: "מטרות היחידה" },
    ...sections.map((s) => ({ id: s.id, title: s.title })),
    { id: "experiment", title: "איך אנחנו יודעים" },
    { id: "traps", title: "מלכודות במבחן" },
    ...(lesson.workedProblems?.length ? [{ id: "worked", title: "תרגילים פתורים" }] : []),
    { id: "practice", title: "תרגול" },
    { id: "ask", title: "שאלה על היחידה" },
    { id: "sources", title: "מקורות" },
  ];

  const box = "rounded-[18px] border border-line bg-surface p-5 sm:p-6";

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16" dir="rtl">
      {draft && (
        <div role="note" className="mt-5 rounded-xl border border-amber/40 bg-amber-tint px-4 py-3 text-sm text-ink">
          <strong className="text-amber">טיוטה — ממתינה לבדיקה.</strong> היחידה עוד לא מקושרת מהקורסים. נכתבה ב-{lesson.review.writtenAt}{lesson.review.aiCheckedBy ? `, נבדקה ע"י ${lesson.review.aiCheckedBy}` : ""}; ממתינה לאישור אנושי.
        </div>
      )}

      {review && (
        <LessonReviewPanel
          lessonSlug={lesson.slug}
          published={!draft}
          sections={toc.filter((t) => t.id !== "ask")}
          initial={{ decision: review.decision, comments: review.comments }}
        />
      )}

      <LessonProgressTracker lessonSlug={lesson.slug} endId="traps" />

      <nav className="mt-6 flex flex-wrap items-center gap-2 text-[13px]" aria-label="מיקום">
        <span className="font-bold text-brand">הטכניון</span>
        <span className="text-muted">/</span>
        <Link href={`/${lang}/courses/${lesson.course.slug}`} className="text-muted hover:text-brand">{lesson.course.nameHe}</Link>
      </nav>

      <header className="mt-3 overflow-hidden rounded-[18px] bg-hero px-6 py-7 text-hero-ink sm:px-8">
        <p className="flex flex-wrap items-center gap-3 text-xs text-hero-muted">
          <FieldIcon topic={lesson.topic} size={22} className="text-hero-muted" />
          <span>{lesson.minutes} דקות קריאה</span>
          <span className="border-s border-hero-muted/40 ps-3">{lesson.questions.length} שאלות ברמת מבחן</span>
        </p>
        <h1 className="mt-3 text-[clamp(28px,4vw,42px)] font-black leading-tight tracking-tight">{isolatePrimes(lesson.titleHe)}</h1>
        <p className="mt-3 max-w-[62ch] text-[16px] leading-8 text-hero-muted">{isolatePrimes(lesson.leadHe)}</p>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Table of contents */}
        <aside className="lg:sticky lg:top-24">
          <details className="rounded-xl border border-line bg-surface p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-bold">תוכן היחידה</summary>
            <ol className="mt-3 space-y-1.5 border-s border-line ps-3 text-sm">
              {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="text-muted hover:text-brand">{t.title}</a></li>)}
            </ol>
          </details>
          <nav aria-label="תוכן היחידה" className="hidden lg:block">
            <p className="text-sm font-bold">תוכן היחידה</p>
            <ol className="mt-3 space-y-1.5 border-s border-line ps-3 text-sm">
              {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="text-muted hover:text-brand">{t.title}</a></li>)}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 max-w-[72ch]">
          <section id="objectives" className={`scroll-mt-24 ${box} bg-tint`}>
            <h2 className="text-lg font-bold">בסוף היחידה תדעו</h2>
            <ul className="mt-3 list-disc space-y-2 ps-5 text-[15px] leading-7">
              {lesson.objectivesHe.map((o) => <li key={o}>{isolatePrimes(o)}</li>)}
            </ul>
          </section>

          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 pt-8">
              <h2 className="text-[24px] font-black leading-snug tracking-tight">{isolatePrimes(s.title)}</h2>
              {courseScope && (() => {
                const e = sectionScope(lesson.course.slug, lesson.slug, s.id);
                return e ? <ScopeBadge entry={e} courseHe={lesson.course.nameHe} fallbackSource={courseScope.defaultSource} /> : null;
              })()}
              {s.segments.map((g, i) => {
                if (g.kind === "md") return <ReactMarkdown key={i} remarkPlugins={GFM} components={md}>{g.text}</ReactMarkdown>;
                if (g.kind === "figure") return <LessonFigure key={i} id={g.id} />;
                const p = procs.find((x) => x.slug === g.slug);
                if (!p) return null;
                const v2 = p.steps.length > 0 && p.steps.every((st) => (parseSvgData(st.svgData).v ?? 1) >= 2);
                return (
                  <Link key={i} href={`/${lang}/topics/${p.topic.slug}/${p.slug}`} className="my-6 flex items-center gap-4 rounded-xl border border-line bg-surface p-4 hover:border-brand">
                    {v2 ? (
                      <span className="w-40 shrink-0 overflow-hidden rounded-lg bg-white"><SceneStill steps={p.steps} step={Math.floor((p.steps.length - 1) / 2)} lang={lang as Locale} label={p.nameHe} /></span>
                    ) : (
                      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-tint text-brand"><FieldIcon topic={p.topic.slug} size={34} /></span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-brand">אנימציה באתר</span>
                      <strong className="block">{p.nameHe}</strong>
                      <span className="mt-0.5 block text-sm text-muted">צפו בתהליך שלב אחר שלב ←</span>
                    </span>
                  </Link>
                );
              })}
            </section>
          ))}

          <section id="experiment" className={`mt-10 scroll-mt-24 ${box} border-amber/40 bg-amber-tint`}>
            <p className="text-xs font-bold text-amber">איך אנחנו יודעים</p>
            <h2 className="mt-1 text-xl font-black">{isolatePrimes(lesson.experiment.titleHe)}</h2>
            <ReactMarkdown remarkPlugins={GFM} components={md}>{lesson.experiment.bodyHe}</ReactMarkdown>
          </section>

          <section id="traps" className={`mt-6 scroll-mt-24 ${box}`}>
            <h2 className="text-xl font-black">מלכודות נפוצות במבחן</h2>
            <ul className="mt-3 space-y-2.5 text-[15px] leading-7">
              {lesson.trapsHe.map((t) => (
                <li key={t} className="flex gap-3"><span aria-hidden className="mt-1 font-black text-amber">!</span><span>{isolatePrimes(t)}</span></li>
              ))}
            </ul>
          </section>

          <section className={`mt-6 ${box}`} aria-labelledby="terms-title">
            <h2 id="terms-title" className="text-xl font-black">מונחים</h2>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {lesson.terms.map((t) => (
                <div key={t.en} className="flex items-baseline justify-between gap-3 border-b border-line py-1.5">
                  <dt className="font-semibold">{isolatePrimes(t.he)}</dt>
                  <dd><bdi dir="ltr" className="text-muted">{t.en}</bdi></dd>
                </div>
              ))}
            </dl>
          </section>

          {lesson.workedProblems?.length ? (
            <section id="worked" className="mt-10 scroll-mt-24">
              <h2 className="text-[24px] font-black">תרגילים פתורים</h2>
              <p className="mt-1 text-sm text-muted">בסגנון התרגול: נסו לפתור לבד, ורק אז פתחו את הפתרון המלא.</p>
              <ol className="mt-4 space-y-4">
                {lesson.workedProblems.map((w, i) => (
                  <li key={w.id} id={`wp-${w.id}`} className={`scroll-mt-24 ${box}`}>
                    <p className="text-xs font-bold text-brand">תרגיל {i + 1}</p>
                    <h3 className="mt-1 text-lg font-black">{isolatePrimes(w.titleHe)}</h3>
                    <ReactMarkdown remarkPlugins={GFM} components={md}>{w.problemHe}</ReactMarkdown>
                    <details className="group mt-2 rounded-xl border border-line bg-surface-2 px-4 py-3">
                      <summary className="cursor-pointer text-sm font-bold text-brand">הצגת הפתרון</summary>
                      <ReactMarkdown remarkPlugins={GFM} components={md}>{w.solutionHe}</ReactMarkdown>
                      <div className="mt-2 rounded-lg bg-tint px-3 py-2 text-sm [&_p]:my-0 [&_p]:text-sm"><ReactMarkdown remarkPlugins={GFM} components={md}>{`**תשובה:** ${w.answerHe}`}</ReactMarkdown></div>
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section id="practice" className="mt-10 scroll-mt-24">
            <h2 className="text-[24px] font-black">תרגול</h2>
            <p className="mt-1 text-sm text-muted">שאלות ברמת מבחן. אחרי כל תשובה מופיע הסבר — גם למה האפשרויות האחרות שגויות.</p>
            <div className="mt-4"><LessonPractice questions={quiz} lang={lang} /></div>
          </section>

          <section id="ask" className="mt-10 scroll-mt-24">
            <h2 className="text-[24px] font-black">שאלה על היחידה</h2>
            <p className="mt-1 text-sm text-muted">מתרגל AI שמכיר את טקסט היחידה. אם משהו לא מופיע כאן, הוא יגיד — ונדע להשלים.</p>
            <div className="mt-4"><LessonChat lessonSlug={lesson.slug} lessonTitle={lesson.titleHe} /></div>
          </section>

          <section id="sources" className="mt-10 scroll-mt-24 border-t border-line pt-6">
            <h2 className="text-lg font-bold">מקורות</h2>
            <ol className="mt-3 list-decimal space-y-2 ps-5 text-sm leading-6 text-muted">
              {lesson.refs.map((r) => <li key={r.text}><bdi dir="ltr">{r.text}</bdi></li>)}
            </ol>
            <p className="mt-5 text-xs text-muted">
              נכתב: {lesson.review.writtenAt}
              {lesson.review.aiCheckedBy && <> · בדיקה עצמאית: {lesson.review.aiCheckedBy}</>}
              {" · "}
              {lesson.review.reviewedBy ? <>אושר ע&quot;י {lesson.review.reviewedBy} ({lesson.review.reviewedAt})</> : "ממתין לאישור אנושי"}
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
