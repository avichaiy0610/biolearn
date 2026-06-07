import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";
import { isAdmin } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const topics = await prisma.topic.findMany({
    select: { nameEn: true, nameHe: true, slug: true },
  });

  if (topics.length === 0) return Response.json({ suggestions: [] });

  const topicList = topics
    .map((t) => `- "${t.nameEn}" (${t.nameHe})`)
    .join("\n");

  const prompt = `אתה מומחה חיפוש בביולוגיה. לפלטפורמת לימוד ביולוגיה יש את הנושאים הבאים:

${topicList}

המשימה: עבור כל נושא, הצע שתי שאילתות PubMed:
1. לחיפוש מאמרים חדשים (2-3 שנים אחרונות)
2. לחיפוש מאמרי עוגן מובילים בתחום (מאמרי סקירה או עם השפעה גבוהה)

החזר JSON בלבד:
{
  "suggestions": [
    {
      "topicSlug": "topic-slug",
      "topicNameHe": "שם הנושא",
      "newQuery": "PubMed query for recent articles",
      "topQuery": "PubMed query for top/review articles"
    }
  ]
}

כללים:
- newQuery: שאילתה ספציפית לתוצאות חדשות — הוסף [Title/Abstract] ומונחי MeSH
- topQuery: הוסף "review[pt]" או "systematic review" לקבלת סקירות איכותיות
- כתוב עבור כל הנושאים ברשימה
- שאילתות באנגלית בלבד`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biomedical research expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");

    // Attach topicSlug from our topics list since AI might get it wrong
    const suggestions = (parsed.suggestions ?? []).map(
      (s: { topicSlug: string; topicNameHe: string; newQuery: string; topQuery: string }) => {
        const matched = topics.find(
          (t) => t.slug === s.topicSlug || t.nameHe === s.topicNameHe
        );
        return { ...s, topicSlug: matched?.slug ?? s.topicSlug };
      }
    );

    return Response.json({ suggestions });
  } catch (err) {
    console.error("[suggest-articles]", err);
    return Response.json({ suggestions: [] });
  }
}
