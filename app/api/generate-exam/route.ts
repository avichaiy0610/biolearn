import { prisma } from "@/lib/prisma";
import { aiCompleteJSON, aiErrorResponse } from "@/lib/groq";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { topicSlug, difficulty = "medium", count = 10 } = await req.json().catch(() => ({}));
  if (!topicSlug) return Response.json({ error: "חסר מזהה נושא.", code: "bad_request" }, { status: 400 });

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: { subtopics: { where: { hidden: false } } },
  });
  if (!topic) return Response.json({ error: "הנושא לא נמצא.", code: "not_found" }, { status: 404 });

  const subtopicsContent = topic.subtopics
    .map((s) => `### ${s.nameHe}\n${s.contentHe || s.contentEn || ""}`)
    .join("\n\n");

  const prompt = `You are a biology professor creating an exam in Hebrew.

Topic: ${topic.nameHe}
Subtopics covered:
${subtopicsContent}

Generate ${count} exam questions that together cover the full breadth of the topic above.
Use a mix of multiple-choice (type: "mcq") and true/false (type: "tf") questions.
Difficulty: ${difficulty}

Each question must have:
- type: "mcq" | "tf"
- question: question text in Hebrew
- options: for mcq: array of 4 strings; for tf: null
- answer: for mcq: the correct option string; for tf: "true" or "false"
- explanation: 1-2 sentence explanation in Hebrew
- difficulty: "${difficulty}"

Return ONLY a JSON object {"questions": [...]}, no other text.`;

  try {
    const questions = await aiCompleteJSON({
      label: "generate-exam",
      tier: "quality",
      json: true,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      maxTokens: 4500,
    }, (parsed) => {
      const arr = Array.isArray(parsed) ? parsed : (parsed as { questions?: unknown })?.questions;
      if (!Array.isArray(arr) || arr.length === 0) return null;
      const ok = arr.filter((q) => q && typeof q.question === "string" && typeof q.answer === "string"
        && (q.type !== "mcq" || (Array.isArray(q.options) && q.options.includes(q.answer))));
      return ok.length ? ok : null;
    });
    return Response.json(questions);
  } catch (err) {
    return aiErrorResponse(err);
  }
}
