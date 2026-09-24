// Client-side helpers for the AI endpoints (see lib/groq.ts for the server side).

const GENERIC = {
  he: "שירות ה-AI אינו זמין כרגע. נסו שוב בעוד כמה דקות.",
  en: "The AI service is temporarily unavailable. Please try again in a few minutes.",
};

export function genericAiError(lang: string) {
  return lang === "en" ? GENERIC.en : GENERIC.he;
}

// The server always sends a user-friendly `error` string; never show anything else.
export async function aiErrorFrom(res: Response, lang: string) {
  try {
    const body = await res.json();
    if (typeof body?.error === "string" && body.code) return body.error as string;
  } catch { /* not JSON */ }
  return genericAiError(lang);
}

export async function postAiJSON<T>(url: string, payload: unknown, lang: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(genericAiError(lang));
  }
  if (!res.ok) throw new Error(await aiErrorFrom(res, lang));
  return res.json() as Promise<T>;
}

// POSTs to a streaming AI endpoint and calls onText with the accumulated text.
// Throws an Error with a friendly message on failure.
export async function streamAi(url: string, payload: unknown, lang: string, onText: (full: string) => void) {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(genericAiError(lang));
  }
  if (!res.ok || !res.body) throw new Error(await aiErrorFrom(res, lang));

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const evt of events) {
      const isError = evt.startsWith("event: error");
      const dataLine = evt.split("\n").find((l) => l.startsWith("data: "));
      if (!dataLine) continue;
      const data = dataLine.slice(6);
      if (data === "[DONE]") return full;
      let text: string;
      try { text = JSON.parse(data); } catch { continue; }
      if (isError) throw new Error(text);
      full += text;
      onText(full);
    }
  }
  return full;
}
