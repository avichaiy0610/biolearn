import { getModel, BIOLOGY_SYSTEM } from "@/lib/google-ai";

export async function POST(request: Request) {
  const { lang, processName, stepTitle, stepDesc } = await request.json();

  const userMessage =
    lang === "he"
      ? `אנחנו לומדים את התהליך "${processName}". השלב הנוכחי הוא "${stepTitle}": ${stepDesc}. הסבר את השלב הזה בעברית בצורה ברורה ופשוטה בשביל סטודנט לתואר ראשון.`
      : `We are studying "${processName}". The current step is "${stepTitle}": ${stepDesc}. Explain clearly and simply for an undergraduate biology student.`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const model = getModel();
        const chat = model.startChat({
          history: [{ role: "user", parts: [{ text: BIOLOGY_SYSTEM }] }],
        });
        const result = await chat.sendMessageStream(userMessage);

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(`data: ${text}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch {
        const msg = lang === "he" ? "שגיאה בטעינת ההסבר." : "Failed to load explanation.";
        controller.enqueue(encoder.encode(`data: ${msg}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
