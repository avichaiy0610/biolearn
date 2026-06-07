import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { groq, QUALITY_MODEL } from "@/lib/groq";

export const maxDuration = 60;

async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string
): Promise<object[]> {
  const prompt = `You are generating a smooth continuous SVG animation for a biology education website.
Animate the process: "${nameEn}" (${nameHe})

Content: ${contentEn.slice(0, 600)}

CRITICAL RULE: You MUST use the SAME element IDs across ALL steps. Elements will smoothly animate (move, resize, recolor) between steps — this creates a real video-like animation.

To make elements appear: set opacity 0 in early steps, then 1 later.
To make elements disappear: fade opacity from 1 to 0.
Elements should MOVE (change cx/cy/x/y) to show the biological process happening.
Elements should RESIZE (change r/rx/ry/width/height) to show growth/division.
Elements should RECOLOR to show state changes.

viewBox: 0 0 400 300
Types: circle(cx,cy,r), ellipse(cx,cy,rx,ry), rect(x,y,width,height), line(x1,y1,x2,y2), text(x,y,label,fontSize 10-13,textColor), path(d)
All elements need: id, type, color(hex), opacity(0-1)
Colors: "#3b82f6","#22c55e","#f59e0b","#ec4899","#7c3aed","#06b6d4","#ef4444","#10b981","#f97316"

Create 5-6 steps showing the process evolving continuously. Use 6-12 elements with meaningful movement between steps.

Return ONLY valid JSON:
{"steps":[
  {"titleHe":"שלב 1","titleEn":"Phase 1","descHe":"תיאור עברי","descEn":"Description","elements":[
    {"id":"cell","type":"ellipse","cx":200,"cy":150,"rx":60,"ry":45,"color":"#3b82f6","opacity":1},
    {"id":"nucleus","type":"circle","cx":200,"cy":150,"r":20,"color":"#1d4ed8","opacity":1},
    {"id":"lbl_cell","type":"text","x":200,"y":215,"label":"Cell","textColor":"#1e40af","fontSize":11,"opacity":1}
  ],"highlight":["cell","nucleus"]},
  {"titleHe":"שלב 2","titleEn":"Phase 2","descHe":"...","descEn":"...","elements":[
    {"id":"cell","type":"ellipse","cx":200,"cy":150,"rx":75,"ry":55,"color":"#7c3aed","opacity":1},
    {"id":"nucleus","type":"circle","cx":200,"cy":150,"r":28,"color":"#6d28d9","opacity":1},
    {"id":"lbl_cell","type":"text","x":200,"y":225,"label":"Growing Cell","textColor":"#5b21b6","fontSize":11,"opacity":1}
  ],"highlight":["nucleus"]}
]}`;

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
