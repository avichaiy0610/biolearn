import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string
): Promise<object[]> {
  const prompt = `You are generating SVG animation data for a biology education website.
Create 4-5 animation steps that visually explain the concept: "${nameEn}" (${nameHe})

Content: ${contentEn.slice(0, 600)}

Rules (viewBox is 0 0 400 300):
- "circle": cx, cy, r, color (hex)
- "rect": x, y, width, height, color
- "ellipse": cx, cy, rx, ry, color
- "text": x, y, label, textColor, fontSize (10-14)
- "line": x1, y1, x2, y2, color
- "path": d (SVG path string), color
- Use rich, varied hex colors: "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#7c3aed", "#06b6d4", "#ef4444"
- Each step: 5-10 elements spread across the canvas, with 2-4 highlighted in the "highlight" array
- Non-highlighted elements appear dimmed
- Include text labels for key elements
- Design each step to visually show a distinct phase or component of the biological process
- Make it visually informative with proper biological layout

Return ONLY valid JSON:
{"steps":[{"titleHe":"...","titleEn":"...","descHe":"...","descEn":"...","elements":[{"id":"e1","type":"circle","cx":200,"cy":150,"r":25,"color":"#3b82f6"},{"id":"e2","type":"text","x":200,"y":185,"label":"Cell","textColor":"#1d4ed8","fontSize":11}],"highlight":["e1","e2"]}]}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology visualization expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });
    const responseText = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(responseText);
    const steps =
      parsed.steps ??
      parsed.animation?.steps ??
      parsed.animationSteps ??
      parsed.data?.steps ??
      [];
    return Array.isArray(steps) ? steps : [];
  } catch (err) {
    console.error("[generate-animation] failed:", err);
    return [];
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { subtopicId } = await request.json();
  if (!subtopicId) {
    return Response.json({ error: "subtopicId required" }, { status: 400 });
  }

  const subtopic = await prisma.subtopic.findUnique({
    where: { id: subtopicId },
    include: { topic: true },
  });
  if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });

  const steps = await generateAnimationSteps(
    subtopic.nameEn,
    subtopic.nameHe,
    subtopic.contentEn
  );

  if (steps.length === 0) {
    return Response.json({ error: "AI failed to generate animation steps" }, { status: 500 });
  }

  const processSlug = `${subtopic.slug}-animation-${Date.now()}`;

  const process = await prisma.process.create({
    data: {
      topicId: subtopic.topicId,
      slug: processSlug,
      nameHe: subtopic.nameHe,
      nameEn: subtopic.nameEn,
      descHe: `אנימציה: ${subtopic.nameHe}`,
      descEn: `Animation: ${subtopic.nameEn}`,
      steps: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        create: steps.map((s: any, i: number) => ({
          order: i + 1,
          titleHe: String(s.titleHe ?? ""),
          titleEn: String(s.titleEn ?? ""),
          descHe: String(s.descHe ?? ""),
          descEn: String(s.descEn ?? ""),
          svgData: JSON.stringify({
            elements: s.elements ?? [],
            highlight: s.highlight ?? [],
          }),
        })),
      },
    },
  });

  await prisma.subtopic.update({
    where: { id: subtopicId },
    data: { relatedProcessSlug: processSlug },
  });

  return Response.json({ processSlug: process.slug, stepsCreated: steps.length });
}
