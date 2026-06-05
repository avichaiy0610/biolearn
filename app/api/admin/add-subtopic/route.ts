import { prisma } from "@/lib/prisma";
import { groq, QUALITY_MODEL } from "@/lib/groq";

async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string
): Promise<object[]> {
  const prompt = `You are generating SVG animation data for a biology education website.
Create 3-4 animation steps that visually explain the concept: "${nameEn}" (${nameHe})

Content: ${contentEn.slice(0, 500)}

Rules for SVG elements (viewBox is 0 0 400 300):
- Use "circle" for molecules/cells: provide cx, cy, r, color (hex)
- Use "rect" for structures/membranes: provide x, y, width, height, color
- Use "text" for labels: provide x, y, label, textColor, fontSize (9-14)
- Use "line" for connections: provide x1, y1, x2, y2, color
- Use "ellipse" for oval shapes: provide cx, cy, rx, ry, color
- Use "path" for complex shapes: provide d (SVG path string), color
- Colors: use hex codes like "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#7c3aed"
- Each step should highlight 2-4 key elements in the "highlight" array (their ids)
- Non-highlighted elements appear dimmed automatically
- Keep elements simple and well-spaced within the 400x300 viewBox

Return ONLY valid JSON in this exact format:
{"steps":[{"titleHe":"...","titleEn":"...","descHe":"...","descEn":"...","elements":[{"id":"e1","type":"circle","cx":200,"cy":150,"r":20,"color":"#3b82f6"}],"highlight":["e1"]}]}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a biology visualization expert. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      model: QUALITY_MODEL,
      response_format: { type: "json_object" },
    });
    const responseText = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(responseText);
    return parsed.steps ?? [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const { slug, nameHe, nameEn, contentHe, contentEn, topicSlug } =
    await request.json();

  if (!topicSlug || !slug || !nameEn) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });

  const existing = await prisma.subtopic.findFirst({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;
  const processSlug = `${finalSlug}-animation`;

  const steps = await generateAnimationSteps(nameEn, nameHe ?? nameEn, contentEn ?? "");

  const [subtopic, process] = await prisma.$transaction(async (tx) => {
    const sub = await tx.subtopic.create({
      data: {
        slug: finalSlug,
        topicId: topic.id,
        nameHe: nameHe ?? nameEn,
        nameEn,
        contentHe: contentHe ?? contentEn,
        contentEn,
        relatedProcessSlug: steps.length > 0 ? processSlug : null,
      },
    });

    if (steps.length === 0) return [sub, null] as const;

    const proc = await tx.process.create({
      data: {
        slug: processSlug,
        topicId: topic.id,
        nameHe: nameHe ?? nameEn,
        nameEn,
        descHe: `אנימציה: ${nameHe ?? nameEn}`,
        descEn: `Animation: ${nameEn}`,
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

    return [sub, proc] as const;
  });

  return Response.json({
    id: subtopic.id,
    slug: subtopic.slug,
    animationCreated: process !== null,
    processSlug: process?.slug ?? null,
  });
}
