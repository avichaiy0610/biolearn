import "server-only";
import { prisma } from "@/lib/prisma";
import { isComingSoon } from "@/lib/topics";
import { computeStreaks, israelDay } from "@/lib/study-day";
import { GLOSSARY, termId } from "@/content/glossary";

export type TopicCoverage = { slug: string; nameHe: string; nameEn: string; icon: string; visited: number; total: number; pct: number };
export type WeakSubtopic = { id: string; topicSlug: string; nameHe: string; nameEn: string; avg: number; attempts: number };
export type WeakTerm = { cardId: string; topicSlug: string; he: string; en: string; lapses: number };

const WEAK_THRESHOLD = 70; // % — average of the last 3 quiz results on a subtopic

export async function progressSummary(userId: string) {
  const [topics, visits, quizzes, days, reviews] = await Promise.all([
    prisma.topic.findMany({
      select: {
        slug: true, nameHe: true, nameEn: true, icon: true,
        subtopics: { where: { hidden: false }, select: { id: true } },
        _count: { select: { processes: true, subtopics: { where: { hidden: false } } } },
      },
      orderBy: { nameEn: "asc" },
    }),
    prisma.userProgress.findMany({ where: { userId, visited: true }, select: { subtopicId: true } }),
    prisma.quizResult.findMany({
      where: { userId },
      select: { subtopicId: true, score: true, total: true, createdAt: true, subtopic: { select: { nameHe: true, nameEn: true, hidden: true, topic: { select: { slug: true } } } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.studyDay.findMany({ where: { userId }, select: { day: true } }),
    prisma.flashcardReview.findMany({ where: { userId }, select: { cardId: true, lapses: true, due: true } }),
  ]);

  // Coverage: share of visible subtopics read, for every active topic.
  const visited = new Set(visits.map((v) => v.subtopicId));
  const coverage: TopicCoverage[] = topics
    .filter((t) => !isComingSoon(t))
    .map((t) => {
      const total = t.subtopics.length;
      const v = t.subtopics.filter((s) => visited.has(s.id)).length;
      return { slug: t.slug, nameHe: t.nameHe, nameEn: t.nameEn, icon: t.icon, visited: v, total, pct: total ? Math.round((v / total) * 100) : 0 };
    })
    .sort((a, b) => b.pct - a.pct || a.nameEn.localeCompare(b.nameEn));
  const totalSubs = coverage.reduce((n, t) => n + t.total, 0);
  const totalVisited = coverage.reduce((n, t) => n + t.visited, 0);

  // Weak spots from quizzes: average of the 3 most recent results per subtopic.
  const bySub = new Map<string, typeof quizzes>();
  for (const q of quizzes) {
    if (q.subtopic.hidden) continue;
    const list = bySub.get(q.subtopicId) ?? [];
    if (list.length < 3) list.push(q);
    bySub.set(q.subtopicId, list);
  }
  const weakSubtopics: WeakSubtopic[] = [...bySub.entries()]
    .map(([id, list]) => ({
      id,
      topicSlug: list[0].subtopic.topic.slug,
      nameHe: list[0].subtopic.nameHe,
      nameEn: list[0].subtopic.nameEn,
      avg: Math.round(list.reduce((n, q) => n + q.score, 0) / list.length),
      attempts: list.length,
      answered: list.reduce((n, q) => n + q.total, 0),
    }))
    .filter((s) => s.avg < WEAK_THRESHOLD && s.answered >= 2) // one lucky/unlucky question isn't a signal
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 6)
    .map((s) => ({ id: s.id, topicSlug: s.topicSlug, nameHe: s.nameHe, nameEn: s.nameEn, avg: s.avg, attempts: s.attempts }));

  // Weak spots from spaced repetition: terms forgotten at least twice.
  const termsById = new Map(
    Object.entries(GLOSSARY).flatMap(([topic, terms]) => terms.map((t) => [termId(topic, t), { topic, t }] as const)),
  );
  const weakTerms: WeakTerm[] = reviews
    .filter((r) => r.lapses >= 2 && termsById.has(r.cardId))
    .sort((a, b) => b.lapses - a.lapses)
    .slice(0, 8)
    .map((r) => {
      const { topic, t } = termsById.get(r.cardId)!;
      return { cardId: r.cardId, topicSlug: topic, he: t.he, en: t.en, lapses: r.lapses };
    });

  const now = new Date();
  const dueReviews = reviews.filter((r) => r.due <= now).length;

  // Streak + last 14 days (Israel time).
  const dayList = days.map((d) => d.day);
  const streak = computeStreaks(dayList);
  const active = new Set(dayList);
  const today = israelDay();
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(new Date(`${today}T12:00:00Z`).getTime() - (13 - i) * 86400000).toISOString().slice(0, 10);
    return { day: d, active: active.has(d) };
  });

  return { coverage, totalSubs, totalVisited, weakSubtopics, weakTerms, dueReviews, streak, last14, studiedToday: active.has(today) };
}
