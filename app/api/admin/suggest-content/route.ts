import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export async function POST(request: Request) {
  const { topicSlug } = await request.json();
  if (!topicSlug) return Response.json({ error: "Missing topicSlug" }, { status: 400 });

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: {
      subtopics: { select: { nameEn: true, nameHe: true } },
      processes: { select: { nameEn: true, nameHe: true } },
    },
  });
  if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });

  const subtopicList = topic.subtopics.map((s) => `"${s.nameEn}" (${s.nameHe})`).join(", ") || "none";
  const processList  = topic.processes.map((p) => `"${p.nameEn}" (${p.nameHe})`).join(", ") || "none";

  const prompt = `You are a biology curriculum expert helping build an undergraduate biology education website.

Topic: "${topic.nameEn}" (${topic.nameHe})
Topic description: ${topic.descEn}

Current subtopics: ${subtopicList}
Current processes: ${processList}

Suggest what is MISSING from this topic for a comprehensive undergraduate biology course. Be specific and practical.

Return JSON only:
{
  "subtopics": [
    { "nameEn": "...", "nameHe": "...", "slug": "unique-en-slug", "contentEn": "3-5 sentence explanation", "contentHe": "הסבר של 3-5 משפטים", "reason": "Why this subtopic is essential" }
  ],
  "processes": [
    { "nameEn": "...", "nameHe": "...", "slug": "unique-en-slug", "descEn": "1-2 sentence description", "descHe": "תיאור של 1-2 משפטים", "reason": "Why this process is important" }
  ]
}

Return 2-4 subtopics and 1-3 processes. Only suggest what is genuinely missing — don't repeat what already exists.`;

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
    const parsed = JSON.parse(text);
    return Response.json({ subtopics: parsed.subtopics ?? [], processes: parsed.processes ?? [] });
  } catch (err) {
    console.error("[suggest-content]", err);
    return Response.json({ error: "AI request failed" }, { status: 500 });
  }
}
