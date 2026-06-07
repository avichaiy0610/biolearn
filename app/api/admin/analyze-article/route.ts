import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";
import { isAdmin } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { title, abstract, authors, journal, year } = await request.json();
  if (!abstract) return Response.json({ error: "Missing abstract" }, { status: 400 });

  // Fetch all topics + subtopics for mapping
  const topics = await prisma.topic.findMany({
    select: { slug: true, nameEn: true, nameHe: true },
  });
  const subtopics = await prisma.subtopic.findMany({
    select: { id: true, nameEn: true, nameHe: true, topicId: true },
    where: { hidden: false },
  });

  const topicList = topics.map((t) => `slug:"${t.slug}" | ${t.nameEn} (${t.nameHe})`).join("\n");
  const subtopicList = subtopics
    .map((s) => `id:"${s.id}" | ${s.nameEn} (${s.nameHe})`)
    .join("\n");

  const prompt = `You are a biology education expert. Analyze the following scientific article and return a JSON object.

Article title: ${title ?? "unknown"}
Authors: ${Array.isArray(authors) ? authors.join(", ") : (authors ?? "unknown")}
Journal: ${journal ?? "unknown"}, Year: ${year ?? "unknown"}

Abstract:
${abstract}

Available topics in the education platform:
${topicList}

Available subtopics:
${subtopicList}

Return ONLY valid JSON in this exact structure:
{
  "abstractHe": "תרגום מלא של ה-abstract לעברית ברורה ופשוטה",
  "keyFindings": [
    "ממצא מרכזי 1 בעברית — משפט אחד ברור",
    "ממצא מרכזי 2 בעברית",
    "ממצא מרכזי 3 בעברית"
  ],
  "topicSlugs": ["slug1", "slug2"],
  "subtopicIds": ["id1", "id2"]
}

Rules:
- abstractHe: natural Hebrew translation of the full abstract
- keyFindings: 3-5 most important findings/conclusions, each as one clear Hebrew sentence
- topicSlugs: only slugs from the provided topic list that are directly relevant
- subtopicIds: only IDs from the provided subtopic list that are directly relevant
- If nothing is relevant, return empty arrays`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a biology education expert. Return only valid JSON, no markdown.",
        },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);

    return Response.json({
      abstractHe: parsed.abstractHe ?? "",
      keyFindings: parsed.keyFindings ?? [],
      topicSlugs: parsed.topicSlugs ?? [],
      subtopicIds: parsed.subtopicIds ?? [],
    });
  } catch (err) {
    console.error("[analyze-article]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `AI analysis failed: ${msg}` }, { status: 500 });
  }
}
