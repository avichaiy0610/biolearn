import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

function isSimilarName(a: string, b: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb || na.length < 3 || nb.length < 3) return false;
  return na === nb || (na.length > 4 && nb.length > 4 && (na.includes(nb) || nb.includes(na)));
}

export async function POST(request: Request) {
  const { topicSlug } = await request.json();
  if (!topicSlug) return Response.json({ error: "Missing topicSlug" }, { status: 400 });

  const topic = await prisma.topic.findUnique({
    where: { slug: topicSlug },
    include: {
      subtopics: { select: { id: true, slug: true, nameEn: true, nameHe: true } },
      processes: { select: { slug: true, nameEn: true, nameHe: true } },
    },
  });
  if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });

  const existingSubtopicSlugs = new Set(topic.subtopics.map((s) => s.slug));
  const existingProcessSlugs = new Set(topic.processes.map((p) => p.slug));

  const subtopicList = topic.subtopics.map((s) => `slug:"${s.slug}" | "${s.nameEn}" (${s.nameHe})`).join("\n") || "none";
  const processList = topic.processes.map((p) => `slug:"${p.slug}" | "${p.nameEn}" (${p.nameHe})`).join("\n") || "none";

  const prompt = `You are a biology curriculum expert helping build a comprehensive undergraduate biology education website.

Topic: "${topic.nameEn}" (${topic.nameHe})
Topic description: ${topic.descEn}

Current subtopics:
${subtopicList}

Current processes:
${processList}

Identify what is MISSING from this topic for a thorough undergraduate biology course. Be specific and practical.

IMPORTANT: Return ONLY raw JSON — no markdown, no code fences, no backticks. Start directly with {

{
  "subtopics": [
    {
      "nameEn": "...",
      "nameHe": "...",
      "slug": "unique-en-slug",
      "contentEn": "3-5 sentence explanation covering key concepts, mechanisms, and significance.",
      "contentHe": "הסבר של 3-5 משפטים הכולל מושגי מפתח, מנגנונים וחשיבות.",
      "reason": "Why this subtopic is essential for a complete understanding"
    }
  ],
  "processes": [
    {
      "nameEn": "...",
      "nameHe": "...",
      "slug": "unique-en-slug",
      "descEn": "2-3 sentence description of this biological process and why it deserves a step-by-step animation",
      "descHe": "תיאור של 2-3 משפטים",
      "reason": "Why visualizing this process helps students understand it"
    }
  ]
}

Return 3-5 subtopics and 1-3 processes. Only suggest what is genuinely missing — do not suggest anything that already exists in the lists above.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology curriculum expert with deep knowledge of undergraduate biology education. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 6000,
    });
    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);

    // Filter out already-existing slugs, then check for name similarity to decide update vs create
    const subtopics = (parsed.subtopics ?? [])
      .filter((s: { slug: string }) => !existingSubtopicSlugs.has(s.slug))
      .map((s: { nameEn: string; nameHe: string; slug: string; contentEn: string; contentHe: string; reason: string }) => {
        const matched = topic.subtopics.find(
          (sub) => isSimilarName(sub.nameEn, s.nameEn) || isSimilarName(sub.nameHe, s.nameHe)
        );
        return matched
          ? { ...s, action: "update" as const, matchedSubtopicId: matched.id }
          : { ...s, action: "create" as const };
      });

    const processes = (parsed.processes ?? []).filter(
      (p: { slug: string }) => !existingProcessSlugs.has(p.slug)
    );

    return Response.json({ subtopics, processes });
  } catch (err) {
    console.error("[suggest-content]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `AI request failed: ${msg}` }, { status: 500 });
  }
}
