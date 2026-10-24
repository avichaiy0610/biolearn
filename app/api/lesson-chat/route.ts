import { after } from "next/server";
import { aiStream, aiErrorResponse, sseResponse } from "@/lib/groq";
import { lessonBySlug } from "@/content/lessons";
import { logLessonQuestion, tutorSystemPrompt } from "@/lib/lesson-chat";

// Chat inside a study unit: answers from the unit text, then (after the response) logs and classifies the question.
export const maxDuration = 60;

type Msg = { role: string; content: unknown };

export async function POST(request: Request) {
  const { messages, lang, lessonSlug } = await request.json().catch(() => ({}));
  const lesson = typeof lessonSlug === "string" ? lessonBySlug(lessonSlug) : undefined;
  if (!lesson) return Response.json({ error: lang === "en" ? "Unknown unit." : "היחידה לא נמצאה.", code: "bad_request" }, { status: 400 });
  const history = (Array.isArray(messages) ? (messages as Msg[]) : [])
    .filter((m): m is { role: "user" | "assistant"; content: string } => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (!history.length || history[history.length - 1].role !== "user") {
    return Response.json({ error: lang === "en" ? "Empty question." : "השאלה ריקה.", code: "bad_request" }, { status: 400 });
  }

  // The AI health check pings this route; its questions are not student questions.
  if (request.headers.get("x-health-probe") !== "1") after(() => logLessonQuestion(lesson, history).catch((e) => console.error("[lesson-chat] log failed:", e)));

  try {
    const completion = await aiStream({
      label: "lesson-chat",
      tier: "quality",
      maxTokens: 2000,
      messages: [{ role: "system", content: tutorSystemPrompt(lesson) }, ...history],
    });
    return sseResponse(completion, lang);
  } catch (err) {
    return aiErrorResponse(err, lang);
  }
}
