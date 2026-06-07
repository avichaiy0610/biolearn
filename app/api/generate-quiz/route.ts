import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  const { subtopicId, type = "mixed", difficulty = "medium", count = 5 } = await req.json();
  if (!subtopicId) return Response.json({ error: "Missing subtopicId" }, { status: 400 });

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { topic: { select: { nameHe: true } } },
  });
  if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });

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

Return a JSON array of question objects. Each object must have:
- type: "mcq" | "tf" | "open"
- question: question text in Hebrew
- options: for mcq: array of exactly 4 answer strings in Hebrew; for tf and open: null
- answer: for mcq: the correct option string (must match one of the options exactly); for tf: "true" or "false"; for open: model answer string in Hebrew
- explanation: 1-2 sentence explanation in Hebrew
- difficulty: "${difficulty}"

Return ONLY the JSON array, nothing else.`;

  try {
    const res = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const raw = res.choices[0].message.content ?? "[]";
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return Response.json({ error: "AI did not return valid JSON" }, { status: 500 });

    const questions = JSON.parse(match[0]);
    return Response.json(questions);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
