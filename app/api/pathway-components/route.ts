import { groq, FAST_MODEL } from "@/lib/groq";

export const maxDuration = 20;

export async function POST(request: Request) {
  const { name, summary, lang } = await request.json();
  if (!name) return Response.json({ error: "Missing name" }, { status: 400 });

  const isHe = lang === "he";

  const prompt = isHe
    ? `אתה מומחה ביולוגיה. המסלול הביולוגי הוא: "${name}".
${summary ? `תיאור: ${summary}` : ""}

תן 4-5 מרכיבי מפתח במסלול זה (חלבונים, אנזימים, מולקולות או תהליכים).
לכל מרכיב: שם קצר + משפט אחד על תפקידו במסלול זה.
שמות חלבונים/גנים יישארו באנגלית (כמו HMG-CoA reductase, CYP7A1) אך ההסבר יהיה בעברית.

החזר JSON בלבד:
{"components":[{"name":"CYP7A1","role":"האנזים המגביל קצב בסינתזת חומצות מרה מכולסטרול"},...]}`
    : `You are a biology expert. The biological pathway is: "${name}".
${summary ? `Description: ${summary}` : ""}

List 4-5 key components in this pathway (proteins, enzymes, molecules, or sub-processes).
For each: short name + one sentence on its role in this specific pathway.

Return JSON only:
{"components":[{"name":"CYP7A1","role":"Rate-limiting enzyme that initiates bile acid synthesis from cholesterol"},...]}`  ;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Biology expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: FAST_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 600,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);
    const components = parsed.components ?? [];

    return Response.json({ components });
  } catch (err) {
    console.error("[pathway-components]", err);
    return Response.json({ components: [] });
  }
}
