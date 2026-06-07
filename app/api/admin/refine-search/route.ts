import { groq, QUALITY_MODEL } from "@/lib/groq";
import { isAdmin } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { query, resultTitles } = await request.json();
  if (!query) return Response.json({ error: "Missing query" }, { status: 400 });

  const titlesText =
    resultTitles?.length > 0
      ? `תוצאות שנמצאו:\n${(resultTitles as string[]).slice(0, 5).join("\n")}`
      : "לא נמצאו תוצאות";

  const prompt = `אתה עוזר מחקר ביולוגי. המשתמש מחפש מאמרים ב-PubMed.

שאילתה נוכחית: "${query}"
${titlesText}

המשימה: הצע דרכים לשפר את החיפוש.

החזר JSON בלבד:
{
  "refinedQueries": [
    "שאילתה ספציפית יותר 1",
    "שאילתה ספציפית יותר 2",
    "שאילתה ספציפית יותר 3"
  ],
  "meshTerms": ["MeSH term 1", "MeSH term 2"],
  "tip": "טיפ קצר בעברית למציאת מאמרים טובים יותר בנושא זה"
}

הנחיות:
- refinedQueries: 3 שאילתות PubMed באנגלית — מדויקות יותר, עם מינוחים מדעיים נכונים
- meshTerms: 2-3 מונחי MeSH רלוונטיים (השתמש ב-[MeSH] בשאילתה)
- tip: משפט אחד בעברית עם עצה מעשית`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biomedical research assistant. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    return Response.json({
      refinedQueries: parsed.refinedQueries ?? [],
      meshTerms: parsed.meshTerms ?? [],
      tip: parsed.tip ?? "",
    });
  } catch (err) {
    console.error("[refine-search]", err);
    return Response.json({ refinedQueries: [], meshTerms: [], tip: "" });
  }
}
