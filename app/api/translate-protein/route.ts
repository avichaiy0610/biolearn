import { groq, QUALITY_MODEL } from "@/lib/groq";

export async function POST(request: Request) {
  const { fn, locations, diseases, keywords, name, organism } = await request.json();

  const truncatedFn = (fn ?? "").length > 1200 ? (fn as string).slice(0, 1200) + "…" : (fn ?? "");

  const prompt = `You are a Hebrew science communicator for high school students. Process the following protein data and return ONLY valid JSON.

Input:
{
  "name": ${JSON.stringify(name ?? "")},
  "organism": ${JSON.stringify(organism ?? "")},
  "fn": ${JSON.stringify(truncatedFn)},
  "locations": ${JSON.stringify(locations ?? [])},
  "diseases": ${JSON.stringify(diseases ?? [])},
  "keywords": ${JSON.stringify(keywords ?? [])}
}

Rules:
- "name": translate to Hebrew
- "organism": translate to Hebrew
- "fn": rewrite as a clear, fluent 2-3 sentence Hebrew summary of the protein's main role. Do NOT list every detail — explain what it does and why it matters. Keep scientific terms in both Hebrew and English in parentheses.
- "locations": translate each location to Hebrew, keep English in parentheses
- "diseases": translate disease names to Hebrew, keep English in parentheses
- "keywords": translate to Hebrew
- Return only JSON, no extra text`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a scientific Hebrew translator specializing in molecular biology. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const translated = JSON.parse(text);
    return Response.json(translated);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[translate-protein] failed:", detail);
    return Response.json({ error: detail }, { status: 500 });
  }
}
