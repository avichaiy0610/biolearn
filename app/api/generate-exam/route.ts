import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  const { topicSlug, difficulty = "medium", count = 10 } = await req.json();
  if (!topicSlug) return Response.json({ error: "Missing topicSlug" }, { status: 400 });

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: { subtopics: { where: { hidden: false } } },
  });
  if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });

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

Return ONLY a JSON array, no other text.`;

  try {
    const res = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 3500,
    });

    const raw = res.choices[0].message.content ?? "[]";
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return Response.json({ error: "AI did not return valid JSON" }, { status: 500 });

    return Response.json(JSON.parse(match[0]));
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
