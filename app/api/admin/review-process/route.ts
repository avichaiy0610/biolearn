import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, REVIEW_MODEL } from "@/lib/groq";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { processSlug } = await request.json();
  if (!processSlug) return Response.json({ error: "processSlug required" }, { status: 400 });

  const process = await prisma.process.findFirst({
    where: { slug: processSlug },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!process) return Response.json({ error: "Process not found" }, { status: 404 });

  const stepsText = process.steps
    .map((s) => `Step ${s.order}: "${s.titleEn}" — ${s.descEn}`)
    .join("\n");

  const prompt = `You are an expert university biology professor reviewing a biology animation/process for an educational platform.

Process: "${process.nameEn}" (${process.nameHe})
Description: ${process.descEn}
Number of steps: ${process.steps.length}

Animation steps:
${stepsText || "No steps yet"}

Review this animated process for:
1. Biological accuracy — are the steps scientifically correct?
2. Sequence logic — are the steps in the right biological order?
3. Completeness — are any critical steps missing?
4. Step quality — are descriptions clear and informative?
5. Educational value — does the animation effectively teach the concept?

Score from 1-10.

Return ONLY valid JSON:
{
  "score": 7,
  "assessment": "2-3 sentence evaluation of the animation sequence",
  "issues": [
    {"step": 2, "type": "accuracy|sequence|clarity|missing", "description": "Specific issue with this step"}
  ],
  "missingSteps": ["Description of a step that should be added between step X and Y"],
  "suggestions": ["Specific suggestion to improve the animation sequence or descriptions"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert biology professor reviewing educational animations. Return only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      model: REVIEW_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}");
    return Response.json(parsed);
  } catch (err) {
    console.error("[review-process] error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json({ error: `AI review failed: ${msg}` }, { status: 500 });
  }
}
