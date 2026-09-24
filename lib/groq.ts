import Groq from "groq-sdk";
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from "groq-sdk/resources/chat/completions";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY ?? "",
});

// Groq moved llama-3.1-8b-instant / llama-3.3-70b-versatile to enterprise-only on
// 2026-08-16 (https://console.groq.com/docs/deprecations). Replacements below.
// Each tier is a fallback chain: if the primary model 404s / is decommissioned /
// is rate-limited / 5xx's, the next one is tried. Override with env vars
// (comma-separated) without a redeploy of code.
function chain(envVar: string, defaults: string[]) {
  const fromEnv = process.env[envVar]?.split(",").map((s) => s.trim()).filter(Boolean);
  return fromEnv?.length ? fromEnv : defaults;
}

export const MODEL_CHAINS = {
  quality: chain("GROQ_QUALITY_MODELS", ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]),
  fast: chain("GROQ_FAST_MODELS", ["openai/gpt-oss-20b", "openai/gpt-oss-120b"]),
} as const;

export type ModelTier = keyof typeof MODEL_CHAINS;

// Kept for the admin routes that call groq directly.
export const QUALITY_MODEL = MODEL_CHAINS.quality[0];
export const FAST_MODEL = MODEL_CHAINS.fast[0];
export const REVIEW_MODEL = MODEL_CHAINS.fast[0];

export const BIOLOGY_SYSTEM = `You are a biology tutor specializing in undergraduate-level biology.
When explaining biological processes, be clear and concise.
Use simple language a first-year biology student can understand.
Focus on key molecular interactions and why each step matters.
Keep explanations to 3-4 sentences.
Respond in the same language as the question (Hebrew or English).`;

// Reasoning models spend completion tokens on hidden reasoning, so keep effort low
// and never surface the reasoning text to users.
function reasoningParams(model: string): Record<string, unknown> {
  if (model.startsWith("openai/gpt-oss")) return { reasoning_effort: "low", include_reasoning: false };
  if (model.startsWith("qwen/")) return { reasoning_effort: "none", reasoning_format: "hidden" };
  return {};
}

// Admin routes call groq.chat.completions.create directly with a legacy `max_tokens`
// budget. Inject the reasoning params (and reasoning headroom) for them too.
{
  const completions = groq.chat.completions as unknown as { create: (p: Record<string, unknown>, o?: unknown) => unknown };
  const rawCreate = completions.create.bind(completions);
  completions.create = (params, opts) => {
    const p = { ...reasoningParams(String(params.model)), ...params };
    if (typeof p.max_tokens === "number") {
      p.max_completion_tokens = (p.max_tokens as number) + 1024;
      delete p.max_tokens;
    }
    return rawCreate(p, opts);
  };
}

export class AIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: "rate_limited" | "unavailable" | "bad_output" | "misconfigured",
  ) {
    super(message);
  }
}

function statusOf(err: unknown): number | undefined {
  return typeof err === "object" && err && "status" in err ? Number((err as { status: unknown }).status) : undefined;
}

// Worth trying the next model in the chain?
function isRetryable(err: unknown) {
  const status = statusOf(err);
  if (status === undefined) return true; // network / timeout
  return status === 404 || status === 400 || status === 429 || status >= 500;
}

function toAIError(err: unknown): AIError {
  if (err instanceof AIError) return err;
  const status = statusOf(err);
  if (status === 401 || status === 403) return new AIError(String(err), 503, "misconfigured");
  if (status === 429) return new AIError(String(err), 429, "rate_limited");
  return new AIError(String(err), 503, "unavailable");
}

type CompleteOpts = {
  tier: ModelTier;
  messages: ChatCompletionMessageParam[];
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
};

async function withFallback<T>(tier: ModelTier, label: string, run: (model: string) => Promise<T>) {
  let lastErr: unknown;
  for (const model of MODEL_CHAINS[tier]) {
    try {
      return await run(model);
    } catch (err) {
      lastErr = err;
      console.error(`[ai:${label}] model ${model} failed (${statusOf(err) ?? "network"}):`, err instanceof Error ? err.message : err);
      if (!isRetryable(err)) break;
    }
  }
  throw toAIError(lastErr);
}

function baseParams(model: string, o: CompleteOpts) {
  return {
    model,
    messages: o.messages,
    temperature: o.temperature,
    // headroom for hidden reasoning tokens
    max_completion_tokens: (o.maxTokens ?? 2000) + 1024,
    ...(o.json ? { response_format: { type: "json_object" as const } } : {}),
    ...reasoningParams(model),
  };
}

export async function aiComplete(o: CompleteOpts & { label: string }): Promise<string> {
  return withFallback(o.tier, o.label, async (model) => {
    const res = await groq.chat.completions.create(baseParams(model, o) as ChatCompletionCreateParamsNonStreaming);
    const text = res.choices[0]?.message?.content?.trim() ?? "";
    if (!text) throw new AIError(`empty completion from ${model}`, 502, "bad_output");
    return text;
  });
}

// Parses a JSON value out of a completion; retries the chain once on bad output.
export async function aiCompleteJSON<T>(o: CompleteOpts & { label: string }, pick: (parsed: unknown) => T | null): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const raw = await aiComplete(o);
    try {
      const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
      const value = pick(parsed);
      if (value !== null) return value;
    } catch {
      const arr = raw.match(/\[[\s\S]*\]/);
      if (arr) {
        try {
          const value = pick(JSON.parse(arr[0]));
          if (value !== null) return value;
        } catch { /* fall through to retry */ }
      }
    }
    console.error(`[ai:${o.label}] unparseable output (attempt ${attempt + 1}):`, raw.slice(0, 300));
  }
  throw new AIError("AI returned invalid JSON", 502, "bad_output");
}

// Starts a streaming completion. Resolves only once a model accepted the request,
// so HTTP errors surface as a real status code instead of text inside a 200 stream.
export async function aiStream(o: CompleteOpts & { label: string }) {
  return withFallback(o.tier, o.label, (model) =>
    groq.chat.completions.create({ ...baseParams(model, o), stream: true } as Parameters<typeof groq.chat.completions.create>[0] & { stream: true }),
  );
}

const FRIENDLY = {
  he: {
    rate_limited: "יש כרגע עומס על שירות ה-AI. נסו שוב בעוד דקה.",
    unavailable: "שירות ה-AI אינו זמין כרגע. נסו שוב בעוד כמה דקות.",
    bad_output: "ה-AI החזיר תשובה לא תקינה. נסו שוב.",
    misconfigured: "שירות ה-AI אינו זמין כרגע. הצוות קיבל התראה.",
  },
  en: {
    rate_limited: "The AI service is busy right now. Please try again in a minute.",
    unavailable: "The AI service is temporarily unavailable. Please try again in a few minutes.",
    bad_output: "The AI returned an invalid answer. Please try again.",
    misconfigured: "The AI service is temporarily unavailable. The team has been notified.",
  },
};

export function aiErrorResponse(err: unknown, lang: string | undefined = "he") {
  const e = toAIError(err);
  const l = lang === "en" ? "en" : "he";
  return Response.json({ error: FRIENDLY[l][e.code], code: e.code }, { status: e.status });
}

// SSE body: each chunk is `data: <JSON string>`; failures mid-stream send `event: error`.
export function sseResponse(completion: AsyncIterable<{ choices: { delta?: { content?: string | null } }[] }>, lang = "he") {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify(text)}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("[ai:stream] interrupted:", err);
        const msg = FRIENDLY[lang === "en" ? "en" : "he"].unavailable;
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify(msg)}\n\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache" },
  });
}
