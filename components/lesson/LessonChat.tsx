"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { streamAi, genericAiError } from "@/lib/ai-client";
import { isolatePrimes } from "@/lib/text";

type Message = { role: "user" | "assistant"; content: string };

// Chat at the end of a study unit. The tutor answers from the unit text (app/api/lesson-chat); questions are logged
// anonymously so recurring gaps can be added to the unit from the course book.
export default function LessonChat({ lessonSlug, lessonTitle }: { lessonSlug: string; lessonTitle: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll the message list itself (scrollIntoView would also move the page).
  useEffect(() => {
    const el = listRef.current;
    if (el && messages.length) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    const setLast = (content: string) =>
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content };
        return updated;
      });
    try {
      await streamAi("/api/lesson-chat", { messages: next, lang: "he", lessonSlug }, "he", setLast);
    } catch (err) {
      setLast(err instanceof Error ? err.message : genericAiError("he"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
      <div ref={listRef} className="flex max-h-[460px] min-h-[120px] flex-col gap-3 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 && (
          <p className="mt-3 text-center text-sm text-muted">משהו לא ברור ב{lessonTitle}? שאלו — התשובה מתבססת על היחידה.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[15px] leading-7 ${
                m.role === "user" ? "rounded-es-sm bg-brand text-white" : "rounded-ee-sm border border-line bg-surface-2 text-ink [&_ol]:ps-5 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:ps-5"
              }`}
            >
              {m.role === "user" ? (
                isolatePrimes(m.content)
              ) : m.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{isolatePrimes(m.content)}</ReactMarkdown>
              ) : (
                <span className="flex items-center gap-1 py-1" aria-label="חושב">
                  {[0, 1, 2].map((j) => <span key={j} className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${j * 0.15}s` }} />)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-line px-3 py-3 sm:px-4"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="lesson-chat-input" className="sr-only">שאלה על היחידה</label>
        <input
          id="lesson-chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="למשל: למה זה קורה דווקא בצד הזה?"
          disabled={loading}
          maxLength={1000}
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-2 text-[15px] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-60"
        />
        <button type="submit" disabled={loading || !input.trim()} className="shrink-0 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
          שליחה
        </button>
      </form>
      <p className="border-t border-line px-4 py-2 text-xs text-muted">
        השאלות נשמרות בלי שם, כדי לזהות מה חסר ביחידה ולהשלים אותו מספר הקורס. התשובות נכתבות ע&quot;י AI — כדאי לבדוק מול היחידה.
      </p>
    </div>
  );
}
