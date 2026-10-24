// Server side of the lesson chat: the lesson text the tutor answers from, and the after-the-answer step that logs
// the question with where it was asked and how the lesson covers it. Recurring uncovered topics surface in
// /admin/student-questions, and are added to the lesson from the course book by the usual review process — never
// written automatically.
import { prisma } from "@/lib/prisma";
import { aiCompleteJSON } from "@/lib/groq";
import { parseBody } from "@/content/lessons/parse";
import type { Lesson } from "@/content/lessons/types";

export const COVERAGE = ["covered", "partial", "gap", "outside", "followup"] as const;
export type Coverage = (typeof COVERAGE)[number];

// Whole sections only, in order, until the budget runs out (Hebrew costs ~1 token per 2–3 characters).
const CONTEXT_CHARS = 22000;

export function lessonSections(lesson: Lesson) {
  return parseBody(lesson.bodyHe).map((s) => ({
    id: s.id,
    title: s.title,
    text: s.segments.filter((g) => g.kind === "md").map((g) => (g as { text: string }).text).join("\n").trim(),
  }));
}

export function lessonContext(lesson: Lesson): string {
  const parts = [`# ${lesson.titleHe}`, lesson.leadHe];
  let used = parts.join("\n").length;
  for (const s of lessonSections(lesson)) {
    const block = `\n## ${s.title} {#${s.id}}\n${s.text}`;
    if (used + block.length > CONTEXT_CHARS) break;
    parts.push(block);
    used += block.length;
  }
  return parts.join("\n");
}

export function tutorSystemPrompt(lesson: Lesson): string {
  return `אתה מתרגל בקורס "${lesson.course.nameHe}" באתר BioLearn, ועוזר לסטודנט שקורא את היחידה "${lesson.titleHe}".
זה הטקסט של היחידה:
<unit>
${lessonContext(lesson)}
</unit>

כללים:
- ענה בעברית, בבהירות ובדיוק מדעי, ברמה של הקורס.
- התבסס קודם כול על היחידה, והשתמש במונחים שלה. אם התשובה נמצאת בסעיף מסוים — אמור באיזה.
- אם היחידה לא מכסה את מה שנשאל, אמור זאת במפורש במשפט הראשון ("זה לא מופיע ביחידה"), ואז ענה בקצרה מהידע הכללי.
- אם השאלה לא קשורה לביולוגיה, הפנה בעדינות חזרה לנושא.
- אל תמציא נתונים, שמות או מקורות.`;
}

type Msg = { role: string; content: string };
export type Classification = { coverage: Coverage; sectionId: string | null; topicLabel: string };

// Judges one question against the lesson. Earlier labels of this lesson are offered so the same concept, asked in
// different words, gets the same label (that is how questions are grouped).
export async function classifyQuestion(lesson: Lesson, messages: Msg[], existingLabels: string[]): Promise<Classification> {
  const sections = lessonSections(lesson);
  const users = messages.filter((m) => m.role === "user");
  const question = users[users.length - 1]?.content ?? "";
  const before = messages.slice(-5, -1).map((m) => `${m.role === "user" ? "סטודנט" : "מתרגל"}: ${m.content.slice(0, 400)}`).join("\n");
  const prompt = `יחידת לימוד: "${lesson.titleHe}" (קורס "${lesson.course.nameHe}").
סעיפי היחידה (מזהה — כותרת — תחילת הטקסט):
${sections.map((s) => `${s.id} — ${s.title} — ${s.text.replace(/\s+/g, " ").slice(0, 700)}`).join("\n")}

${before ? `השיחה עד עכשיו:\n${before}\n` : ""}השאלה החדשה של הסטודנט: "${question}"

תוויות קיימות ביחידה הזו: ${existingLabels.length ? existingLabels.map((l) => `"${l}"`).join(", ") : "אין עדיין"}

החזר JSON בלבד:
{"coverage": "...", "sectionId": "...", "topicLabel": "..."}
- coverage: "covered" — היחידה עונה על השאלה; "partial" — נוגעת בנושא אבל חסר מה שנשאל; "gap" — הנושא שייך ליחידה אבל לא מופיע בה; "outside" — לא קשור ליחידה או לקורס; "followup" — המשך שיחה בלי נושא חדש ("תפרט", "תודה").
- sectionId: מזהה הסעיף הקרוב ביותר, או null.
- topicLabel: הנושא המדעי של השאלה ב-2–5 מילים בעברית (למשל "החתמה גנומית"). אם אחת התוויות הקיימות מתארת את אותו מושג — החזר אותה בדיוק.`;
  return aiCompleteJSON(
    { label: "lesson-chat-classify", tier: "fast", json: true, maxTokens: 200, messages: [{ role: "system", content: "You classify student questions against a study unit. Return only valid JSON." }, { role: "user", content: prompt }] },
    (p) => {
      const o = p as Partial<Classification>;
      if (!o || !COVERAGE.includes(o.coverage as Coverage)) return null;
      const label = typeof o.topicLabel === "string" ? o.topicLabel.trim().slice(0, 60) : "";
      if (!label) return null;
      const sectionId = typeof o.sectionId === "string" && sections.some((s) => s.id === o.sectionId) ? o.sectionId : null;
      return { coverage: o.coverage as Coverage, sectionId, topicLabel: label };
    },
  );
}

// Logs the latest question of a lesson chat. Called after the answer has been sent; failures only cost the log.
export async function logLessonQuestion(lesson: Lesson, messages: Msg[]) {
  const users = messages.filter((m) => m.role === "user");
  const question = users[users.length - 1]?.content?.trim();
  if (!question) return;
  let c: Classification | null = null;
  try {
    const rows = await prisma.chatLog.findMany({
      where: { lessonSlug: lesson.slug, topicLabel: { not: null } },
      distinct: ["topicLabel"],
      select: { topicLabel: true },
      take: 60,
      orderBy: { createdAt: "desc" },
    });
    c = await classifyQuestion(lesson, messages, rows.map((r) => r.topicLabel!).filter(Boolean));
  } catch (err) {
    console.error("[lesson-chat] classification failed:", err instanceof Error ? err.message : err);
  }
  await prisma.chatLog.create({
    data: {
      source: "lesson",
      topicSlug: lesson.topic,
      topicName: lesson.titleHe,
      courseSlug: lesson.course.slug,
      lessonSlug: lesson.slug,
      question: question.slice(0, 2000),
      sectionId: c?.sectionId ?? null,
      coverage: c?.coverage ?? null,
      topicLabel: c?.topicLabel ?? null,
    },
  });
}
