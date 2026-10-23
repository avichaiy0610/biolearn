export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale, type Locale } from "@/lib/dictionaries";
import { homeData } from "@/lib/home-data";
import { planUnitCount } from "@/content/course-plans";
import { GENERAL_UNIVERSITY } from "@/content/universities";
import { GLOSSARY } from "@/content/glossary";
import FieldIcon from "@/components/FieldIcon";
import TrackPicker from "@/components/TrackPicker";
import PendingHint from "@/components/PendingHint";
import { SceneStill } from "@/components/ProcessAnimation";

const FLASHCARD_COUNT = Object.values(GLOSSARY).reduce((n, terms) => n + terms.length, 0);
const YEAR_HE: Record<number, string> = { 1: "שנה א'", 2: "שנה ב'", 3: "שנה ג'", 4: "שנה ד'" };
const SEM_HE = { A: "סמסטר א'", B: "סמסטר ב'" };

function Arrow() {
  return <span aria-hidden className="inline-block rtl:rotate-180">→</span>;
}

export default async function HomePage({ params, searchParams }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const he = lang === "he";
  const course = (await searchParams).course;
  const d = await homeData(lang, Array.isArray(course) ? course[0] : course);
  const { uni, term, open, resume } = d;
  const isGeneral = uni.slug === GENERAL_UNIVERSITY;
  const firstVisit = isGeneral && !term.chosen;
  const name = (x: { nameHe: string; nameEn: string }) => (he ? x.nameHe : x.nameEn);
  const minutes = open ? Math.max(3, Math.round(open.excerpt.length / 60)) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Intro */}
      <section className="pt-8 pb-6">
        <nav aria-label={he ? "המסלול שלי" : "My track"} className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="font-bold text-brand">{he ? uni.nameHe : uni.nameEn}</span>
          <span className="text-muted">/</span>
          <span className="text-muted">{he ? (isGeneral ? "ביולוגיה" : "מדעי החיים") : "Life sciences"}</span>
          <span className="text-muted">/</span>
          <span className="text-muted">{he ? `${YEAR_HE[d.year]}, ${SEM_HE[term.semester]}` : `Year ${d.year}, semester ${term.semester}`}</span>
        </nav>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[clamp(30px,3.6vw,44px)] font-black leading-tight tracking-tight">{he ? "מה לומדים היום?" : "What are we studying today?"}</h1>
            <p className="mt-1 text-muted">
              {firstVisit
                ? (he ? "בחרו אוניברסיטה ושנה — והאתר יסדר את החומר לפי הסילבוס שלכם." : "Pick your university and year — the site follows your syllabus.")
                : (he ? "הקורסים שלך. מההסבר הראשון ועד לשאלת המבחן." : "Your courses. From the first explanation to the exam question.")}
            </p>
          </div>
          <TrackPicker lang={lang} uni={uni.slug} year={term.year} semester={term.semester} />
        </div>
      </section>

      {/* Resume */}
      {resume && (
        <Link href={resume.unit.href}
          className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-line bg-tint px-4 py-3 text-sm font-semibold text-brand hover:border-brand">
          <span className="flex flex-wrap gap-x-2.5 gap-y-1">
            <span className="font-normal text-muted">{he ? "להמשיך מאיפה שעצרת" : "Pick up where you left off"}</span>
            <span>{name(resume.course.course)} · {name(resume.unit)}</span>
          </span>
          <Arrow />
        </Link>
      )}

      {d.courses.length === 0 ? (
        <p className="mb-12 rounded-xl border border-dashed border-line p-6 text-muted">
          {he ? "עדיין אין קורסים למסלול הזה. " : "No courses for this track yet. "}
          <Link href={`/${lang}/courses`} className="font-semibold text-brand">{he ? "לכל הקורסים" : "All courses"}</Link>
        </p>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Course index */}
          <section aria-labelledby="my-courses">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 id="my-courses" className="text-lg font-bold">{he ? "הקורסים שלי" : "My courses"}</h2>
              <span className="text-xs text-muted">{he ? `${YEAR_HE[d.year]} · ${d.courses.length} קורסים` : `Year ${d.year} · ${d.courses.length} courses`}</span>
            </div>
            <ol className="overflow-hidden rounded-[18px] border border-line bg-surface">
              {d.courses.map((c, i) => {
                const active = c.course.slug === d.selected?.course.slug;
                const planned = planUnitCount(c.course.slug);
                const empty = (planned ?? c.units.length) === 0;
                return (
                  <li key={c.course.slug} className="border-b border-line last:border-b-0">
                    <Link href={`/${lang}?course=${c.course.slug}`} scroll={false} aria-current={active ? "true" : undefined}
                      className={`relative grid grid-cols-[26px_minmax(0,1fr)_30px] items-start gap-3 px-4 py-4 transition-colors ${active ? "bg-tint" : "hover:bg-surface-2"}`}>
                      {active && <span aria-hidden className="absolute inset-y-0 start-0 w-1 bg-brand" />}
                      <span className="pt-0.5 text-xs font-semibold text-muted"><bdi dir="ltr">{String(i + 1).padStart(2, "0")}</bdi></span>
                      <span className="min-w-0">
                        <strong className={`block text-[15px] leading-snug ${empty ? "text-muted" : ""}`}>{name(c.course)}</strong>
                        <small className="mt-1 block text-xs text-muted">
                          {empty
                            ? (he ? "החומר לקורס בכתיבה" : "Material being written")
                            : planned !== null
                              ? (he ? `${planned} יחידות` : `${planned} units`)
                            : !d.loggedIn
                              ? (he ? `${c.units.length} יחידות` : `${c.units.length} units`)
                              : c.read > 0
                                ? (he ? `${c.read} מתוך ${c.readings} יחידות נקראו` : `${c.read} of ${c.readings} units read`)
                                : (he ? "התחלה חדשה" : "Not started")}
                          {c.next && !empty && planned === null && <> · {name(c.next)}</>}
                        </small>
                      </span>
                      <FieldIcon topic={c.icon} size={28} className={empty ? "text-muted" : "text-brand"} />
                      <PendingHint />
                    </Link>
                  </li>
                );
              })}
            </ol>
            <p className="mx-1 mt-3 text-xs text-muted">
              {d.loggedIn
                ? (he ? "ההתקדמות מתייחסת לקריאה, ולא למדד שליטה בחומר." : "Progress counts reading, not mastery.")
                : (he ? "התחברו כדי לשמור התקדמות ולהמשיך מאיפה שעצרתם." : "Log in to track progress and resume.")}{" "}
              <Link href={`/${lang}/courses`} className="font-semibold text-brand">{he ? "כל המסלול" : "Full track"}</Link>
            </p>
          </section>

          {/* Open unit */}
          {open ? (
            <section aria-labelledby="open-unit" className="min-w-0">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-bold">{he ? "פתוח אצלך עכשיו" : "Open now"}</h2>
                <Link href={`/${lang}/courses/${open.course.course.slug}`} className="text-xs text-muted hover:text-brand">{name(open.course.course)}</Link>
              </div>
              <article className="overflow-hidden rounded-[18px] border border-line bg-surface">
                <div className="bg-hero px-6 py-6 text-hero-ink sm:px-7">
                  <p className="flex flex-wrap gap-3 text-xs text-hero-muted">
                    <span>{he ? `יחידה ${open.index} מתוך ${open.course.units.length}` : `Unit ${open.index} of ${open.course.units.length}`}</span>
                    {open.unit.kind === "subtopic" && <span className="border-s border-hero-muted/40 ps-3">{he ? `${minutes} דקות קריאה` : `${minutes} min read`}</span>}
                  </p>
                  <h3 id="open-unit" className="mt-3 text-[clamp(24px,3vw,34px)] font-black leading-tight tracking-tight">{name(open.unit)}</h3>
                  {open.excerpt && <p className="mt-3 max-w-[60ch] text-[15px] leading-8 text-hero-muted">{open.excerpt}</p>}
                </div>

                <div className={`grid ${open.figure ? "md:grid-cols-2" : ""}`}>
                  <div className="px-6 py-5 sm:px-7">
                    <p className="text-xs font-bold text-brand">{he ? "ביחידה הזו" : "In this unit"}</p>
                    <ul className="mt-2 space-y-1.5 text-sm leading-7 text-muted">
                      <li>{open.unit.kind === "subtopic" ? (he ? "קריאה מסודרת בעברית" : "A structured reading") : (he ? "אנימציה שלב אחר שלב" : "A step-by-step animation")}</li>
                      {open.questions > 0 && <li>{he ? `${open.questions} שאלות ברמת מבחן, עם הסבר לכל תשובה` : `${open.questions} exam-level questions with explanations`}</li>}
                      {open.figure?.own && <li>{he ? `אנימציה: ${open.figure.nameHe}` : `Animation: ${open.figure.nameEn}`}</li>}
                    </ul>
                    {open.terms.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {open.terms.map((t) => (
                          <span key={t.en} className="rounded-md border border-line px-2 py-1 text-xs">
                            {he ? <>{t.he} <bdi dir="ltr" className="text-muted">{t.en.split(" (")[0]}</bdi></> : t.en}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {open.figure && (
                    <figure className="m-0 flex min-w-0 flex-col justify-center border-t border-line bg-surface-2 px-4 py-4 md:border-s md:border-t-0">
                      <div className="overflow-hidden rounded-lg bg-white">
                        <SceneStill steps={open.figure.steps} step={open.figure.step} lang={lang as Locale} label={name(open.figure)} />
                      </div>
                      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                        <span>
                          {open.figure.own
                            ? (he ? `מתוך האנימציה: ${open.figure.nameHe}` : `From the animation: ${open.figure.nameEn}`)
                            : (he ? `אנימציה מהקורס: ${open.figure.nameHe}` : `Animation from the course: ${open.figure.nameEn}`)}
                        </span>
                        <Link href={`/${lang}/topics/${open.figure.topicSlug}/${open.figure.processSlug}`} className="font-semibold text-brand">{he ? "לאנימציה המלאה" : "Full animation"}</Link>
                      </figcaption>
                    </figure>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-4 sm:px-7">
                  <Link href={open.unit.href} className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-brand px-6 font-bold text-surface hover:bg-brand-hover">
                    {he ? "לפתיחת יחידת הלימוד" : "Open the unit"} <Arrow />
                  </Link>
                  <span className="text-xs text-muted">{he ? "קריאה בעברית · תרגול עם הסבר לכל אפשרות" : "Hebrew reading · practice with explanations"}</span>
                </div>
                {open.after && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3.5 text-sm sm:px-7">
                    <span className="text-muted">{he ? "בהמשך הקורס:" : "Next in the course:"} <strong className="text-ink">{name(open.after)}</strong></span>
                    <Link href={`/${lang}/topics/${open.unit.topicSlug}#practice-title`} className="font-bold text-brand">{he ? "לתרגול הנושא" : "Practice the topic"} <Arrow /></Link>
                  </div>
                )}
              </article>
            </section>
          ) : (
            d.selected && planUnitCount(d.selected.course.slug) ? (
              <section className="rounded-[18px] border border-line bg-surface p-8">
                <p className="text-muted">{he ? `לקורס יש ${planUnitCount(d.selected.course.slug)} יחידות לימוד, מסודרות לפי הסילבוס.` : `This course has ${planUnitCount(d.selected.course.slug)} units, ordered by the syllabus.`}</p>
                <Link href={`/${lang}/courses/${d.selected.course.slug}`} className="mt-4 inline-flex min-h-12 items-center gap-3 rounded-xl bg-brand px-6 font-bold text-surface hover:bg-brand-hover">
                  {he ? "לתוכנית הקורס" : "Open the course plan"} <Arrow />
                </Link>
              </section>
            ) : (
            <section className="rounded-[18px] border border-dashed border-line p-8 text-muted">
              {he ? "החומר לקורס הזה עוד בכתיבה. בינתיים אפשר לבחור קורס אחר מהרשימה." : "This course's material is still being written. Pick another course meanwhile."}
            </section>
            )
          )}
        </div>
      )}

      {/* Today */}
      <section aria-labelledby="today" className="mt-12 mb-14">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="today" className="text-lg font-bold">{he ? "להיום" : "For today"}</h2>
          <span className="text-xs text-muted">{he ? "15 דקות שמחזיקות את החומר בראש" : "15 minutes that keep it fresh"}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href={`/${lang}/review`} className="rounded-[18px] border border-line bg-surface p-5 hover:border-brand">
            <p className="text-xs font-bold text-brand">{he ? "חזרה מרווחת" : "Spaced review"}</p>
            <p className="mt-1 text-lg font-bold">
              {d.loggedIn && d.dueReviews > 0
                ? (he ? `${d.dueReviews} כרטיסיות מחכות` : `${d.dueReviews} cards due`)
                : (he ? `${FLASHCARD_COUNT} כרטיסיות מונחים` : `${FLASHCARD_COUNT} term cards`)}
            </p>
            <p className="mt-1 text-sm text-muted">{he ? "כל כרטיס חוזר בדיוק לפני שהייתם שוכחים אותו." : "Each card returns right before you'd forget it."}</p>
            <span className="mt-3 inline-block text-sm font-bold text-brand">{he ? "להתחיל חזרה" : "Start reviewing"} <Arrow /></span>
          </Link>
          {open && (
            <Link href={`/${lang}/topics/${open.unit.topicSlug}#practice-title`} className="rounded-[18px] border border-line bg-surface p-5 hover:border-brand">
              <p className="text-xs font-bold text-brand">{he ? "לבדוק שהבנת" : "Check yourself"}</p>
              <p className="mt-1 text-lg font-bold">{he ? `שאלות על ${open.unit.nameHe}` : `Questions on ${open.unit.nameEn}`}</p>
              <p className="mt-1 text-sm text-muted">{he ? "שאלות ברמת מבחן, עם הסבר למה כל תשובה נכונה או שגויה." : "Exam-level questions, each option explained."}</p>
              <span className="mt-3 inline-block text-sm font-bold text-brand">{he ? "לתרגול" : "Practice"} <Arrow /></span>
            </Link>
          )}
          {d.selected && (
            <Link href={`/${lang}/courses/${d.selected.course.slug}#exams-title`} className="rounded-[18px] border border-line bg-surface p-5 hover:border-brand">
              <p className="text-xs font-bold text-brand">{he ? "מבחני עבר" : "Past exams"}</p>
              <p className="mt-1 text-lg font-bold">{name(d.selected.course)}</p>
              <p className="mt-1 text-sm text-muted">
                {d.exams > 0
                  ? (he ? `${d.exams} מבחנים קודמים, עם פתרונות כשיש.` : `${d.exams} past exams, with solutions when available.`)
                  : (he ? "עוד אין מבחנים לקורס הזה — יתווספו בהמשך." : "No exams for this course yet.")}
              </p>
              <span className="mt-3 inline-block text-sm font-bold text-brand">{he ? "לדף הקורס" : "Course page"} <Arrow /></span>
            </Link>
          )}
        </div>
        <p className="mt-6 text-sm text-muted">
          {he ? "עוד באתר: " : "Also: "}
          <Link href={`/${lang}/topics`} className="font-semibold text-brand">{he ? "כל הנושאים" : "All topics"}</Link>
          {" · "}
          <Link href={`/${lang}/proteins`} className="font-semibold text-brand">{he ? "מאגר חלבונים" : "Protein database"}</Link>
          {" · "}
          <Link href={`/${lang}/research`} className="font-semibold text-brand">{he ? "מאמרים מתורגמים" : "Translated papers"}</Link>
        </p>
      </section>
    </div>
  );
}
