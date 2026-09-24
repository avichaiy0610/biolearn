import { prisma } from "@/lib/prisma";
import { MODEL_CHAINS } from "@/lib/groq";

// Pings every user-facing AI endpoint with a tiny real request and reports which
// ones fail. Polled by .github/workflows/ai-health.yml, which opens an issue on
// failure. Each run costs a few thousand tokens, so it is guarded by
// HEALTHCHECK_SECRET when that env var is set.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

type Check = { endpoint: string; ok: boolean; status: number; ms: number; detail?: string };

async function readStream(res: Response) {
  const text = await res.text();
  if (text.includes("event: error")) throw new Error("stream error event");
  if (!text.includes("data: [DONE]")) throw new Error("stream did not complete");
  return text.length;
}

export async function GET(request: Request) {
  const secret = process.env.HEALTHCHECK_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const origin = new URL(request.url).origin;
  const sub = await prisma.subtopic.findFirst({
    where: { hidden: false, topic: { slug: "cell-biology" } },
    select: { id: true, topic: { select: { slug: true } } },
  });

  const cases: { endpoint: string; body: unknown; stream?: boolean }[] = [
    { endpoint: "ai-explain", stream: true, body: { lang: "he", processName: "מיטוזה", stepTitle: "מטאפאזה", stepDesc: "הכרומוזומים מסתדרים במישור המשווני" } },
    { endpoint: "chat", stream: true, body: { lang: "he", topicName: "ביולוגיה של התא", messages: [{ role: "user", content: "מהו ריבוזום? משפט אחד." }] } },
    { endpoint: "generate-flashcards", body: { subtopicId: sub?.id } },
    { endpoint: "generate-quiz", body: { subtopicId: sub?.id, type: "tf", count: 2 } },
    { endpoint: "generate-exam", body: { topicSlug: sub?.topic.slug ?? "cell-biology", count: 2 } },
    { endpoint: "research", body: { lang: "he", subtopicName: "ריבוזום", topicName: "ביולוגיה של התא", query: "ענה בשני משפטים." } },
    { endpoint: "translate-protein", body: { name: "Insulin", organism: "Homo sapiens", fn: "Insulin decreases blood glucose concentration.", locations: ["Secreted"], diseases: [], keywords: ["Hormone"] } },
  ];

  const checks: Check[] = await Promise.all(
    cases.map(async ({ endpoint, body, stream }) => {
      const t0 = Date.now();
      try {
        const res = await fetch(`${origin}/api/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { endpoint, ok: false, status: res.status, ms: Date.now() - t0, detail: err.code ?? "http_error" };
        }
        if (stream) await readStream(res);
        else await res.json();
        return { endpoint, ok: true, status: res.status, ms: Date.now() - t0 };
      } catch (e) {
        return { endpoint, ok: false, status: 0, ms: Date.now() - t0, detail: e instanceof Error ? e.message : String(e) };
      }
    }),
  );

  const ok = checks.every((c) => c.ok);
  return Response.json(
    { ok, checkedAt: new Date().toISOString(), models: MODEL_CHAINS, checks },
    { status: ok ? 200 : 503 },
  );
}
