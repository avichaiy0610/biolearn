import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { NextRequest } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.1-8b-instant";

export async function POST(req: NextRequest) {
  const { subtopicId } = await req.json();
  if (!subtopicId) return Response.json({ error: "Missing subtopicId" }, { status: 400 });

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    select: { nameHe: true, contentHe: true, contentEn: true },
  });
  if (!subtopic) return Response.json({ error: "Not found" }, { status: 404 });

  const content = subtopic.contentHe || subtopic.contentEn || "";

  const prompt = `You are a biology tutor. Extract 10 key term-definition flashcard pairs from this content.

Subtopic: ${subtopic.nameHe}
Content: ${content}

Return a JSON array of objects with:
- term: the term or concept in Hebrew (short, 1-5 words)
- definition: clear definition in Hebrew (1-3 sentences)

Return ONLY the JSON array.`;

  try {
    const res = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1500,
    });

    const raw = res.choices[0].message.content ?? "[]";
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return Response.json({ error: "Parse error" }, { status: 500 });

    return Response.json(JSON.parse(match[0]));
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
