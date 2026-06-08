import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { topicSlug } = await request.json();
  if (!topicSlug) return Response.json({ error: "topicSlug required" }, { status: 400 });

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: { subtopics: true },
  });
  if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });

  const subtopicsList = topic.subtopics.length > 0
    ? topic.subtopics.map((s) => `- "${s.nameEn}" (${s.nameHe}): ${s.contentEn.slice(0, 300)}`).join("\n")
    : "None";

  const prompt = `You are an expert university biology professor reviewing a biology topic on an educational platform.

Topic: "${topic.nameEn}" (${topic.nameHe})
Category: ${topic.category || "biology"}
Description: ${topic.descEn || "N/A"}

Current subtopics (${topic.subtopics.length} total):
${subtopicsList}

Review this topic carefully and provide structured JSON feedback on:
1. MISSING subtopics — important concepts for a university-level course that are not covered
2. CONCERNS — existing subtopics that may contain inaccuracies, misconceptions, or overly simplistic explanations
3. IMPROVEMENTS — existing subtopics that should be expanded or clarified

Score the topic overall from 1-10 for university-level completeness.

CRITICAL RULES for the missing subtopics:
- contentEn: Write 3-5 sentences explaining the concept directly as educational content. Do NOT write "students need to understand..." or "this subtopic covers...". Write as if you are a textbook explaining the concept itself.
- contentHe: Same as contentEn but in Hebrew.
- Both contentEn and contentHe are MANDATORY — never leave them empty.

Return ONLY valid JSON:
{
  "overall": "2-3 sentence overall assessment",
  "score": 7,
  "missing": [
    {
      "nameEn": "Topic Name",
      "nameHe": "שם בעברית",
      "reason": "Why this is essential for university students",
      "priority": "high",
      "contentEn": "Direct educational explanation of the concept in 3-5 sentences. Explain mechanisms, significance, and key facts as if writing a textbook. Never start with 'Students need to...'",
      "contentHe": "הסבר חינוכי ישיר של המושג ב-3-5 משפטים. הסבר מנגנונים, חשיבות ועובדות מרכזיות כאילו כותבים ספר לימוד. לעולם אל תתחיל ב'תלמידים צריכים...'"
    }
  ],
  "concerns": [
    {"subtopicName": "Existing subtopic nameEn", "concern": "Specific issue with this content", "suggestion": "How to fix or improve it"}
  ],
  "improvements": [
    {"subtopicName": "Existing subtopic nameEn", "improvement": "How to expand or deepen this content for university level"}
  ]
}

Priority levels: "high" (essential, core concept), "medium" (important but optional), "low" (nice to have)`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert biology professor. Provide honest, constructive feedback on biology educational content. Return only valid JSON.",
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
    console.error("[review-topic] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `AI review failed: ${msg}` }, { status: 500 });
  }
}
