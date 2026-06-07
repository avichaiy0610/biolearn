import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";
import { isAdmin } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { subtopicId } = await request.json();
  if (!subtopicId) return Response.json({ error: "Missing subtopicId" }, { status: 400 });

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { topic: { select: { nameEn: true, nameHe: true } } },
  });
  if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });

  const content = subtopic.contentHe || subtopic.contentEn;

  const prompt = `אתה מומחה ביולוגיה שיוצר שאלות תרגול לסטודנטים לביולוגיה בתואר ראשון.

נושא: ${subtopic.topic.nameHe} (${subtopic.topic.nameEn})
תת-נושא: ${subtopic.nameHe} (${subtopic.nameEn})

תוכן:
${content}

צור 6 שאלות תרגול מגוונות בעברית — 4 אמריקאיות (mcq) ו-2 נכון/לא-נכון (tf).

החזר JSON בלבד:
{
  "questions": [
    {
      "type": "mcq",
      "question": "שאלה בעברית?",
      "options": ["אפשרות א", "אפשרות ב", "אפשרות ג", "אפשרות ד"],
      "answer": "אפשרות א",
      "explanation": "הסבר קצר למה זו התשובה הנכונה",
      "difficulty": "easy"
    },
    {
      "type": "tf",
      "question": "טענה לבדיקה — נכון או לא נכון?",
      "options": null,
      "answer": "true",
      "explanation": "הסבר מדוע הטענה נכונה/שגויה",
      "difficulty": "medium"
    }
  ]
}

כללים:
- שאלות בעברית, ברורות ומדויקות
- כל שאלת mcq תכיל בדיוק 4 אפשרויות, רק אחת נכונה
- answer עבור mcq = הטקסט המדויק של האפשרות הנכונה
- answer עבור tf = "true" או "false"
- difficulty: "easy" / "medium" / "hard"
- explanation: 1-2 משפטים שמסבירים את התשובה הנכונה
- שאלות מגוונות — לא רק הגדרות, גם הבנה, יישום, השוואה`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology education expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    const rawQuestions = parsed.questions ?? [];

    // Save all generated questions as pending approval
    const created = await Promise.all(
      rawQuestions.map((q: {
        type: string; question: string; options: string[] | null;
        answer: string; explanation: string; difficulty: string;
      }) =>
        prisma.question.create({
          data: {
            subtopicId,
            type: q.type ?? "mcq",
            question: q.question,
            options: q.options ? JSON.stringify(q.options) : null,
            answer: q.answer,
            explanation: q.explanation,
            difficulty: q.difficulty ?? "medium",
            approved: false,
          },
        })
      )
    );

    return Response.json({ count: created.length, questions: created });
  } catch (err) {
    console.error("[generate-questions]", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `AI generation failed: ${msg}` }, { status: 500 });
  }
}
