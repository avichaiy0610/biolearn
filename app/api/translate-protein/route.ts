import { groq, QUALITY_MODEL } from "@/lib/groq";

export async function POST(request: Request) {
  const { fn, locations, diseases, keywords, name, organism } = await request.json();

  // Truncate long function description to prevent token overflow
  const fnTruncated = fn ? String(fn).slice(0, 1000) : "";

  const prompt = `Translate the following biological protein data to Hebrew. Return ONLY valid JSON with the same structure.

Input:
{
  "name": ${JSON.stringify(name ?? "")},
  "organism": ${JSON.stringify(organism ?? "")},
  "fn": ${JSON.stringify(fnTruncated)},
  "locations": ${JSON.stringify(locations ?? [])},
  "diseases": ${JSON.stringify(diseases ?? [])},
  "keywords": ${JSON.stringify(keywords ?? [])}
}

Rules:
- Translate all string values to Hebrew
- Keep scientific/medical terms in both Hebrew and English: "מיטוכונדריה (Mitochondria)"
- Keep accession IDs, gene symbols, and numeric values as-is
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
    let translated: Record<string, unknown>;
    try {
      translated = JSON.parse(text);
    } catch {
      // If JSON is truncated, try to extract partial fields with regex
      console.error("[translate-protein] JSON parse failed, text:", text.slice(0, 200));
      return Response.json({ error: "Translation failed" }, { status: 500 });
    }

    // Validate that we got at least some translated content
    if (!translated || typeof translated !== "object" || Object.keys(translated).length === 0) {
      return Response.json({ error: "Empty translation response" }, { status: 500 });
    }

    return Response.json(translated);
  } catch (err) {
    console.error("[translate-protein] failed:", err);
    return Response.json({ error: "Translation failed" }, { status: 500 });
  }
}
