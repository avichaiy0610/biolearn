import { groq, QUALITY_MODEL } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { messages, lang, topicName, topicSlug, subtopics } = await request.json();

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

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          model: QUALITY_MODEL,
          stream: true,
          max_tokens: 4000,
        });

        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(`data: ${text}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch {
        const msg = lang === "he" ? "שגיאה. נסה שנית." : "Error. Please try again.";
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
