import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

// Preview: AI generates merged subtopic content
export async function POST(request: Request) {
  const { subtopicIds } = await request.json();
  if (!Array.isArray(subtopicIds) || subtopicIds.length < 2) {
    return Response.json({ error: "Select at least 2 subtopics to merge" }, { status: 400 });
  }

  const subtopics = await prisma.subtopic.findMany({
    where: { id: { in: subtopicIds } },
    include: { topic: true },
  });
  if (subtopics.length < 2) return Response.json({ error: "Subtopics not found" }, { status: 404 });

  const topicName = subtopics[0].topic.nameEn;
  const list = subtopics
    .map((s) => `- "${s.nameEn}" (${s.nameHe}): ${s.contentEn}`)
    .join("\n");

  const prompt = `You are a biology curriculum expert. Merge these subtopics into one comprehensive subtopic for an undergraduate biology course.

Topic: "${topicName}"
Subtopics to merge:
${list}

Create a unified subtopic that covers all the material coherently. Do not just concatenate — synthesize into a cohesive whole.

Return JSON only:
{
  "nameEn": "Merged name in English",
  "nameHe": "שם מאוחד בעברית",
  "slug": "unique-merged-slug-en",
  "contentEn": "5-7 sentence comprehensive explanation in English",
  "contentHe": "הסבר מקיף של 5-7 משפטים בעברית"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology curriculum expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
    });
    const text = completion.choices[0]?.message?.content ?? "{}";
    const merged = JSON.parse(text);
    return Response.json({ merged, subtopics: subtopics.map((s) => ({ id: s.id, nameHe: s.nameHe, nameEn: s.nameEn })) });
  } catch (err) {
    console.error("[merge preview]", err);
    return Response.json({ error: "AI request failed" }, { status: 500 });
  }
}
