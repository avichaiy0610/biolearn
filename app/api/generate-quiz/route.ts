import { prisma } from "@/lib/prisma";
import { aiCompleteJSON, aiErrorResponse } from "@/lib/groq";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { subtopicId, type = "mixed", difficulty = "medium", count = 5 } = await req.json().catch(() => ({}));
  if (!subtopicId) return Response.json({ error: "חסר מזהה תת-נושא.", code: "bad_request" }, { status: 400 });

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { topic: { select: { nameHe: true } } },
  });
  if (!subtopic) return Response.json({ error: "תת-הנושא לא נמצא.", code: "not_found" }, { status: 404 });

  const content = subtopic.contentHe || subtopic.contentEn || "";

  const typeGuide =
    type === "mcq" ? `Generate ${count} multiple-choice questions (type: "mcq"), each with 4 answer options.`
    : type === "tf" ? `Generate ${count} true/false questions (type: "tf").`
    : type === "open" ? `Generate ${count} open-ended questions (type: "open"). Provide a model answer in the "answer" field.`
    : `Generate ${count} questions: mix of MCQ and true/false types. Use type "mcq" or "tf" accordingly.`;

  const prompt = `You are a biology teacher creating practice questions in Hebrew.

Topic: ${subtopic.topic.nameHe}
Subtopic: ${subtopic.nameHe}
Content:
${content}

${typeGuide}
Difficulty level: ${difficulty}

Return a JSON object {"questions": [...]}. Each question object must have:
- type: "mcq" | "tf" | "open"
- question: question text in Hebrew
- options: for mcq: array of exactly 4 answer strings in Hebrew; for tf and open: null
- answer: for mcq: the correct option string (must match one of the options exactly); for tf: "true" or "false"; for open: model answer string in Hebrew
- explanation: 1-2 sentence explanation in Hebrew
- difficulty: "${difficulty}"

Return ONLY the JSON object, nothing else.`;

  try {
    const questions = await aiCompleteJSON({
      label: "generate-quiz",
      tier: "quality",
      json: true,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 3000,
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
