// Recurring student questions per lesson, grouped by the classifier's topic label (lib/lesson-chat.ts).
// Used by /admin/student-questions and by scripts/question-gaps.ts (the to-do list for adding material).
import { prisma } from "@/lib/prisma";
import { lessonBySlug } from "@/content/lessons";
import type { Coverage } from "@/lib/lesson-chat";

export const GAP_STATUS = ["open", "added", "rejected", "outside"] as const;
export type GapStatus = (typeof GAP_STATUS)[number];

export type QuestionGroup = {
  lessonSlug: string;
  lessonTitle: string;
  courseSlug: string | null;
  courseName: string;
  topicLabel: string;
  count: number;
  coverage: Coverage | "unknown"; // the most frequent judgement in the group
  coverageCounts: Partial<Record<Coverage | "unknown", number>>;
  sections: string[];
  samples: string[];
  lastAsked: Date;
  status: GapStatus;
  note: string | null;
};

const UNLABELED = "לא סווג";

export async function questionGroups(opts: { since?: Date; limit?: number } = {}): Promise<QuestionGroup[]> {
  const [logs, gaps] = await Promise.all([
    prisma.chatLog.findMany({
      where: { source: "lesson", lessonSlug: { not: null }, ...(opts.since ? { createdAt: { gte: opts.since } } : {}) },
      orderBy: { createdAt: "desc" },
      take: opts.limit ?? 5000,
      select: { lessonSlug: true, courseSlug: true, topicLabel: true, coverage: true, sectionId: true, question: true, createdAt: true },
    }),
    prisma.questionGap.findMany(),
  ]);
  const statusOf = new Map(gaps.map((g) => [`${g.lessonSlug}\u0000${g.topicLabel}`, g]));
  const groups = new Map<string, QuestionGroup>();
  for (const l of logs) {
    if (l.coverage === "followup") continue;
    const label = l.topicLabel ?? UNLABELED;
    const key = `${l.lessonSlug}\u0000${label}`;
    let g = groups.get(key);
    if (!g) {
      const lesson = lessonBySlug(l.lessonSlug!);
      const gap = statusOf.get(key);
      g = {
        lessonSlug: l.lessonSlug!,
        lessonTitle: lesson?.titleHe ?? l.lessonSlug!,
        courseSlug: l.courseSlug,
        courseName: lesson?.course.nameHe ?? l.courseSlug ?? "",
        topicLabel: label,
        count: 0,
        coverage: "unknown",
        coverageCounts: {},
        sections: [],
        samples: [],
        lastAsked: l.createdAt,
        status: (gap?.status as GapStatus) ?? "open",
        note: gap?.note ?? null,
      };
      groups.set(key, g);
    }
    g.count++;
    const c = (l.coverage as Coverage | null) ?? "unknown";
    g.coverageCounts[c] = (g.coverageCounts[c] ?? 0) + 1;
    if (l.sectionId && !g.sections.includes(l.sectionId)) g.sections.push(l.sectionId);
    const q = l.question.trim();
    if (g.samples.length < 6 && !g.samples.includes(q)) g.samples.push(q);
  }
  for (const g of groups.values()) {
    g.coverage = (Object.entries(g.coverageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as QuestionGroup["coverage"]) ?? "unknown";
  }
  return [...groups.values()].sort((a, b) => b.count - a.count || +b.lastAsked - +a.lastAsked);
}

// A group needs material when the lesson doesn't (fully) answer it and nobody has dealt with it yet.
export const needsMaterial = (g: QuestionGroup) => g.status === "open" && (g.coverage === "gap" || g.coverage === "partial");
