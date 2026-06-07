import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { subtopicId, lang = "he" } = await request.json();
  if (!subtopicId) return Response.json({ error: "subtopicId required" }, { status: 400 });

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { topic: true },
  });
  if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });

  const isHe = lang === "he";

  const prompt = isHe
    ? `אתה פרופסור לביולוגיה אוניברסיטאית. בדוק את תת-הנושא הבא עבור פלטפורמת לימוד.

נושא: "${subtopic.topic.nameEn}" (${subtopic.topic.nameHe})
תת-נושא: "${subtopic.nameEn}" (${subtopic.nameHe})

תוכן נוכחי (אנגלית):
${subtopic.contentEn}

הערך את תת-הנושא לפי:
1. דיוק מדעי — שגיאות, פישוטים מוגזמים, מידע מיושן
2. שלמות — מושגי מפתח חסרים לרמה אוניברסיטאית
3. עומק — מספיק לסטודנט שנה א'?
4. בהירות — הסברים מבלבלים או לא ברורים?

כתוב את כל התגובות בעברית. ציון מ-1 עד 10.

החזר JSON בלבד:
{
  "score": 7,
  "assessment": "הערכה קצרה של 2-3 משפטים בעברית",
  "issues": [
    {"type": "accuracy", "description": "תיאור הבעיה בעברית"},
    {"type": "completeness", "description": "מושג חסר"},
    {"type": "depth", "description": "צריך להעמיק"},
    {"type": "clarity", "description": "הסבר לא ברור"}
  ],
  "missingConcepts": ["מושג חסר 1", "מושג חסר 2"],
  "improvedContentEn": "Improved English content (5-7 sentences, university level, scientifically accurate)",
  "improvedContentHe": "תוכן עברית משופר (5-7 משפטים, רמה אוניברסיטאית, מדויק מדעית)"
}`
    : `You are a university biology professor. Review the following subtopic for an educational platform.

Topic: "${subtopic.topic.nameEn}" (${subtopic.topic.nameHe})
Subtopic: "${subtopic.nameEn}" (${subtopic.nameHe})

Current content (English):
${subtopic.contentEn}

Evaluate for:
1. Scientific accuracy — errors, oversimplifications, outdated info
2. Completeness — key concepts missing for university level
3. Depth — suitable for first-year undergrad?
4. Clarity — confusing or unclear explanations?

Score from 1-10. Write all feedback in English.

Return ONLY valid JSON:
{
  "score": 7,
  "assessment": "2-3 sentence assessment",
  "issues": [
    {"type": "accuracy", "description": "Specific inaccuracy"},
    {"type": "completeness", "description": "Missing concept"},
    {"type": "depth", "description": "Needs more depth"},
    {"type": "clarity", "description": "Unclear explanation"}
  ],
  "missingConcepts": ["Missing concept 1"],
  "improvedContentEn": "Improved English content (5-7 sentences, university level)",
  "improvedContentHe": "תוכן עברית משופר (8-12 משפטים, רמה אוניברסיטאית)"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: isHe
            ? "אתה פרופסור לביולוגיה. ספק ביקורת חינוכית כנה. החזר JSON תקין בלבד."
            : "You are a biology professor. Provide honest educational feedback. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    return Response.json(parsed);
  } catch (err) {
    console.error("[review-subtopic] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `AI review failed: ${msg}` }, { status: 500 });
  }
}
