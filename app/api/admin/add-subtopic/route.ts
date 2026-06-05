import { prisma } from "@/lib/prisma";
import { getModel } from "@/lib/google-ai";

const ANIMATION_SCHEMA = {
  type: "object",
  properties: {
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          titleHe: { type: "string" },
          titleEn: { type: "string" },
          descHe: { type: "string" },
          descEn: { type: "string" },
          elements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                type: { type: "string" },
                cx: { type: "number" }, cy: { type: "number" }, r: { type: "number" },
                x: { type: "number" }, y: { type: "number" },
                width: { type: "number" }, height: { type: "number" },
                x1: { type: "number" }, y1: { type: "number" },
                x2: { type: "number" }, y2: { type: "number" },
                rx: { type: "number" }, ry: { type: "number" },
                d: { type: "string" }, label: { type: "string" },
                color: { type: "string" }, textColor: { type: "string" },
                fontSize: { type: "number" },
              },
              required: ["id", "type"],
            },
          },
          highlight: { type: "array", items: { type: "string" } },
        },
        required: ["titleHe", "titleEn", "descHe", "descEn", "elements", "highlight"],
      },
    },
  },
  required: ["steps"],
};

async function generateAnimationSteps(
  nameEn: string,
  nameHe: string,
  contentEn: string
): Promise<object[]> {
  const model = getModel(true);

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

Return ONLY valid JSON matching the schema. No markdown fences.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: ANIMATION_SCHEMA as never,
      },
    });
    const parsed = JSON.parse(result.response.text());
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

  // Generate animation steps via Gemini
  const steps = await generateAnimationSteps(nameEn, nameHe ?? nameEn, contentEn ?? "");

  // Create subtopic + linked process in one transaction
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
