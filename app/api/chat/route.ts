import { aiStream, aiErrorResponse, sseResponse } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { messages, lang, topicName, topicSlug, subtopics } = await request.json().catch(() => ({}));
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: lang === "en" ? "Empty question." : "השאלה ריקה.", code: "bad_request" }, { status: 400 });
  }

  // Log the latest user question (fire-and-forget, don't block the response)
  const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user");
  if (lastUserMsg?.content) {
    prisma.chatLog.create({
      data: { topicSlug: topicSlug ?? null, topicName, question: lastUserMsg.content },
    }).catch(() => {});
  }

  const subtopicContext = subtopics?.length
    ? subtopics
        .map((s: { name: string; content: string }) => `- ${s.name}: ${s.content}`)
        .join("\n")
    : "";

  const systemPrompt =
    lang === "he"
      ? `אתה מדריך ביולוגיה מומחה המסייע לסטודנטים לתואר ראשון.
אתה כרגע עוזר בנושא: "${topicName}".
${subtopicContext ? `\nתוכן הנושא:\n${subtopicContext}\n` : ""}
ענה תמיד בעברית, בצורה ברורה, מפורטת ומדויקת מדעית.
כלול הסברים מנגנוניים, דוגמאות ספציפיות, וקשרים לנושאים אחרים בביולוגיה כשרלוונטי.
אם שאלה לא קשורה לביולוגיה, הפנה בעדינות בחזרה לנושא.`
      : `You are an expert biology tutor helping undergraduate students.
You are currently assisting with the topic: "${topicName}".
${subtopicContext ? `\nTopic content:\n${subtopicContext}\n` : ""}
Always answer in English, clearly and scientifically accurately.
Provide detailed, mechanistic explanations with specific examples and connections to broader biology where relevant.
If a question is unrelated to biology, gently redirect back to the topic.`;

  try {
    const completion = await aiStream({
      label: "chat",
      tier: "quality",
      maxTokens: 3000,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
          .filter((m: { role: string; content: unknown }) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .slice(-20),
      ],
    });
    return sseResponse(completion, lang);
  } catch (err) {
    return aiErrorResponse(err, lang);
  }
}
