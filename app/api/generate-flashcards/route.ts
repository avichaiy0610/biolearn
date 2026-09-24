import { prisma } from "@/lib/prisma";
import { aiCompleteJSON, aiErrorResponse } from "@/lib/groq";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { subtopicId } = await req.json().catch(() => ({}));
  if (!subtopicId) return Response.json({ error: "חסר מזהה תת-נושא.", code: "bad_request" }, { status: 400 });

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    select: { nameHe: true, contentHe: true, contentEn: true },
  });
  if (!subtopic) return Response.json({ error: "תת-הנושא לא נמצא.", code: "not_found" }, { status: 404 });

  const content = subtopic.contentHe || subtopic.contentEn || "";

  const prompt = `You are a biology tutor. Extract 10 key term-definition flashcard pairs from this content.

Subtopic: ${subtopic.nameHe}
Content: ${content}

Return a JSON object {"cards": [...]} where each card has:
- term: the term or concept in Hebrew (short, 1-5 words)
- definition: clear definition in Hebrew (1-3 sentences)

Return ONLY the JSON object.`;

  try {
    const cards = await aiCompleteJSON({
      label: "generate-flashcards",
      tier: "fast",
      json: true,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      maxTokens: 1500,
    }, (parsed) => {
      const arr = Array.isArray(parsed) ? parsed : (parsed as { cards?: unknown })?.cards;
      if (!Array.isArray(arr)) return null;
      const ok = arr.filter((c) => c && typeof c.term === "string" && typeof c.definition === "string");
      return ok.length ? ok : null;
    });
    return Response.json(cards);
  } catch (err) {
    return aiErrorResponse(err);
  }
}
