import { aiComplete, aiErrorResponse, BIOLOGY_SYSTEM } from "@/lib/groq";

export async function POST(request: Request) {
  const { query, lang, subtopicName, topicName } = await request.json().catch(() => ({}));
  if (!subtopicName) {
    return Response.json({ error: lang === "en" ? "Missing subtopic." : "חסר שם תת-נושא.", code: "bad_request" }, { status: 400 });
  }

  const prompt =
    lang === "he"
      ? `הסבר בפירוט על "${subtopicName}" בתחום "${topicName}" לסטודנט לתואר ראשון בביולוגיה.
כלול: הגדרה, מנגנון פעולה, חשיבות ביולוגית, ודוגמאות ספציפיות.
ענה בעברית מדעית ברורה. ${query ?? ""}`
      : `Explain in detail "${subtopicName}" in the field of "${topicName}" for a biology undergraduate student.
Include: definition, mechanism, biological significance, and specific examples.
Be accurate and use proper scientific terminology. ${query ?? ""}`;

  try {
    const content = await aiComplete({
      label: "research",
      tier: "quality",
      maxTokens: 2500,
      messages: [
        { role: "system", content: BIOLOGY_SYSTEM },
        { role: "user", content: prompt },
      ],
    });
    return Response.json({ content, citations: [] });
  } catch (err) {
    return aiErrorResponse(err, lang);
  }
}
