import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { subtopicId } = await request.json();
  if (!subtopicId) return Response.json({ error: "subtopicId required" }, { status: 400 });

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { topic: true },
  });
  if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });

  const prompt = `You are an expert university biology professor reviewing a specific biology subtopic for an educational platform.

Topic: "${subtopic.topic.nameEn}" (${subtopic.topic.nameHe})
Subtopic: "${subtopic.nameEn}" (${subtopic.nameHe})

Current content (English):
${subtopic.contentEn}

Review this subtopic for university-level educational quality. Evaluate:
1. Scientific accuracy — any errors, oversimplifications, or outdated information?
2. Completeness — what key concepts or mechanisms are missing?
3. Depth — is the explanation suitable for undergraduate level?
4. Clarity — are there confusing or poorly explained sections?

Score from 1-10 (10 = excellent university-level content).

Return ONLY valid JSON:
{
  "score": 7,
  "assessment": "2-3 sentence honest evaluation of the current content",
  "issues": [
    {"type": "accuracy", "description": "Specific inaccuracy or error found"},
    {"type": "completeness", "description": "Missing concept that should be covered"},
    {"type": "depth", "description": "Area that needs more depth"},
    {"type": "clarity", "description": "Confusing or unclear explanation"}
  ],
  "missingConcepts": ["Key concept 1 that should be added", "Key concept 2"],
  "improvedContentEn": "A suggested improved version of the English content (8-12 sentences, university level)",
  "improvedContentHe": "גרסה משופרת של התוכן בעברית (8-12 משפטים, רמה אוניברסיטאית)"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert biology professor providing honest educational feedback. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    return Response.json(parsed);
  } catch (err) {
    console.error("[review-subtopic] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `AI review failed: ${msg}` }, { status: 500 });
  }
}
