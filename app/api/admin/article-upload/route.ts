import { groq, QUALITY_MODEL } from "@/lib/groq";
import { isAdmin } from "@/lib/supabase/server";
import { extractText } from "unpdf";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ error: "No file uploaded" }, { status: 400 });

  let rawText = "";
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true });
      rawText = text.slice(0, 12000);
    } catch (err) {
      console.error("[article-upload] PDF parse error:", err);
      return Response.json({ error: "Failed to parse PDF" }, { status: 400 });
    }
  } else {
    rawText = (await file.text()).slice(0, 12000);
  }

  if (!rawText.trim()) return Response.json({ error: "File is empty" }, { status: 400 });

  const prompt = `You are a biology research assistant. Extract structured metadata from the following scientific article text.

Article text (first part):
${rawText}

Return ONLY valid JSON:
{
  "title": "exact article title",
  "authors": ["Last First", "Last First"],
  "journal": "journal name",
  "year": 2024,
  "abstract": "the full abstract text in English"
}

If a field cannot be found, use null for numbers and empty string/array for strings/arrays.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a scientific metadata extractor. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);

    return Response.json({
      title: parsed.title ?? file.name.replace(/\.pdf$/, ""),
      authors: parsed.authors ?? [],
      journal: parsed.journal ?? null,
      year: parsed.year ?? null,
      abstract: parsed.abstract ?? "",
      source: "upload",
    });
  } catch (err) {
    console.error("[article-upload]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `Extraction failed: ${msg}` }, { status: 500 });
  }
}
