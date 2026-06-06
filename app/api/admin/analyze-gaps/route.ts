import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export async function POST() {
  // Get all chat questions grouped by topic
  const logs = await prisma.chatLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  if (logs.length === 0) {
    return Response.json({ created: 0, message: "No chat logs yet" });
  }

  // Group questions by topic and count frequency
  const byTopic = new Map<string, { topicName: string; topicSlug: string | null; questions: string[] }>();
  for (const log of logs) {
    const key = log.topicSlug ?? log.topicName;
    if (!byTopic.has(key)) {
      byTopic.set(key, { topicName: log.topicName, topicSlug: log.topicSlug, questions: [] });
    }
    byTopic.get(key)!.questions.push(log.question);
  }

  let totalCreated = 0;

  for (const [, { topicName, topicSlug, questions }] of byTopic) {
    // Get existing subtopics for this topic
    const existingSubtopics = topicSlug
      ? await prisma.subtopic.findMany({
          where: { topic: { slug: topicSlug } },
          select: { nameEn: true, nameHe: true },
        })
      : [];

    const existingNames = existingSubtopics.length > 0
      ? existingSubtopics.map((s) => `"${s.nameEn}" (${s.nameHe})`).join(", ")
      : "none yet";

    // Count question frequency
    const questionFreq = new Map<string, number>();
    for (const q of questions) {
      const normalized = q.toLowerCase().trim();
      questionFreq.set(normalized, (questionFreq.get(normalized) ?? 0) + 1);
    }
    const topQuestions = [...questionFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([q, count]) => `(asked ${count}x) ${q}`)
      .join("\n");

    const prompt = `You are analyzing a biology education website to identify content gaps.

Topic: "${topicName}"
Existing subtopics: ${existingNames || "none yet"}

Most frequently asked questions by students (last 200 sessions):
${topQuestions}

Based on these questions, identify 2-4 subtopics that are MISSING from the existing content and would be most valuable to add. Prioritize by how frequently students asked about them.

Return JSON only:
{"suggestions":[{"nameEn":"...","nameHe":"...","slug":"unique-en-slug","contentEn":"3-5 sentence explanation","contentHe":"הסבר של 3-5 משפטים","reason":"Why this is needed (mention question frequency)","priority":1}]}

priority: 3=critical (asked many times), 2=important, 1=nice to have
Return empty array if existing content already covers everything well.`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a biology curriculum analyst. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        model: QUALITY_MODEL,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(text);
      const suggestions = parsed.suggestions ?? [];

      for (const s of suggestions) {
        // Skip if already suggested
        const exists = await prisma.contentSuggestion.findFirst({
          where: { slug: s.slug, topicSlug: topicSlug ?? undefined },
        });
        if (exists) continue;

        await prisma.contentSuggestion.create({
          data: {
            topicSlug: topicSlug ?? null,
            topicName,
            nameEn: String(s.nameEn ?? ""),
            nameHe: String(s.nameHe ?? ""),
            contentEn: String(s.contentEn ?? ""),
            contentHe: String(s.contentHe ?? ""),
            slug: String(s.slug ?? ""),
            reason: String(s.reason ?? ""),
            priority: Number(s.priority ?? 1),
          },
        });
        totalCreated++;
      }
    } catch {
      // Skip this topic on error
    }
  }

  return Response.json({ created: totalCreated });
}
