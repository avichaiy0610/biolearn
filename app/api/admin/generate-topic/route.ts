import { isAdmin } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const QUALITY_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { nameEn, nameHe, category, icon } = await req.json();
  if (!nameEn || !nameHe || !category)
    return Response.json({ error: "Missing fields" }, { status: 400 });

  const prompt = `You are a biology professor creating a structured course module for undergraduate students.

Topic: ${nameEn} (Hebrew: ${nameHe})
Category: ${category}

Generate a complete biology topic module with:
1. A clear English description (2-3 sentences)
2. A clear Hebrew description (same content)
3. 6-8 subtopics that cover this topic comprehensively for undergrad biology
4. For each subtopic: name (he + en) and detailed content (he + en, 3-4 sentences each)

Use this JSON format ONLY (no markdown):
{
  "descEn": "...",
  "descHe": "...",
  "subtopics": [
    {
      "nameEn": "...",
      "nameHe": "...",
      "contentEn": "...",
      "contentHe": "..."
    }
  ]
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: QUALITY_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    return Response.json({
      slug,
      nameEn,
      nameHe,
      descEn: result.descEn ?? "",
      descHe: result.descHe ?? "",
      category,
      icon: icon || "🔬",
      subtopics: (result.subtopics ?? []).map((s: { nameEn: string; nameHe: string; contentEn: string; contentHe: string }, i: number) => ({
        slug: `${slug}-${s.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
        nameEn: s.nameEn,
        nameHe: s.nameHe,
        contentEn: s.contentEn,
        contentHe: s.contentHe,
        order: i,
      })),
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
