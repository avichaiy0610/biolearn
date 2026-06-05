import { getModel } from "@/lib/google-ai";

export async function POST(request: Request) {
  const { query, lang, subtopicName, topicName } = await request.json();

  const prompt =
    lang === "he"
      ? `הסבר בפירוט על "${subtopicName}" בתחום "${topicName}" לסטודנט לתואר ראשון בביולוגיה.
כלול: הגדרה, מנגנון פעולה, חשיבות ביולוגית, ודוגמאות ספציפיות.
ענה בעברית מדעית ברורה. ${query ?? ""}`
      : `Explain in detail "${subtopicName}" in the field of "${topicName}" for a biology undergraduate student.
Include: definition, mechanism, biological significance, and specific examples.
Be accurate and use proper scientific terminology. ${query ?? ""}`;

  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    return Response.json({ content, citations: [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
