import { aiStream, aiErrorResponse, sseResponse, BIOLOGY_SYSTEM } from "@/lib/groq";

export async function POST(request: Request) {
  const { lang, processName, stepTitle, stepDesc } = await request.json().catch(() => ({}));
  if (!processName || !stepTitle) {
    return Response.json({ error: lang === "en" ? "Missing step details." : "חסרים פרטי השלב.", code: "bad_request" }, { status: 400 });
  }

  const userMessage =
    lang === "he"
      ? `אנחנו לומדים את התהליך "${processName}". השלב הנוכחי הוא "${stepTitle}": ${stepDesc ?? ""}. הסבר את השלב הזה בעברית בצורה ברורה ופשוטה בשביל סטודנט לתואר ראשון.`
      : `We are studying "${processName}". The current step is "${stepTitle}": ${stepDesc ?? ""}. Explain clearly and simply for an undergraduate biology student.`;

  try {
    const completion = await aiStream({
      label: "ai-explain",
      tier: "fast",
      maxTokens: 600,
      messages: [
        { role: "system", content: BIOLOGY_SYSTEM },
        { role: "user", content: userMessage },
      ],
    });
    return sseResponse(completion, lang);
  } catch (err) {
    return aiErrorResponse(err, lang);
  }
}
