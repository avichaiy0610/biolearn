import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { generateAnimationSteps } from "@/lib/generate-animation-steps";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 50);
}

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const {
    subtopicId,
    topicSlug: directTopicSlug,
    nameHe: directNameHe,
    nameEn: directNameEn,
    contentEn: directContentEn,
  } = body;

  let nameHe: string, nameEn: string, contentEn: string, topicId: string;
  let subtopicToLink: string | null = null;
  let processSlugBase: string;

  if (subtopicId) {
    const subtopic = await prisma.subtopic.findUnique({
      where: { id: subtopicId },
      include: { topic: true },
    });
    if (!subtopic) return Response.json({ error: "Subtopic not found" }, { status: 404 });
    nameHe = subtopic.nameHe;
    nameEn = subtopic.nameEn;
    contentEn = subtopic.contentEn;
    topicId = subtopic.topicId;
    subtopicToLink = subtopicId;
    processSlugBase = subtopic.slug;
  } else if (directTopicSlug && directNameEn) {
    const topic = await prisma.topic.findUnique({ where: { slug: directTopicSlug } });
    if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });
    nameHe = directNameHe ?? directNameEn;
    nameEn = directNameEn;
    contentEn = directContentEn ?? "";
    topicId = topic.id;
    processSlugBase = slugify(nameEn);
  } else {
    return Response.json({ error: "subtopicId or (topicSlug + nameEn) required" }, { status: 400 });
  }

  let steps: object[];
  try {
    steps = await generateAnimationSteps(nameEn, nameHe, contentEn);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }

  if (steps.length === 0) {
    return Response.json(
      { error: "AI returned no usable steps (possibly truncated or rate-limited). Try again." },
      { status: 502 }
    );
  }

  const processSlug = `${processSlugBase}-animation-${Date.now()}`;

  const process = await prisma.process.create({
    data: {
      topicId,
      slug: processSlug,
      nameHe,
      nameEn,
      descHe: `אנימציה: ${nameHe}`,
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

  if (subtopicToLink) {
    await prisma.subtopic.update({
      where: { id: subtopicToLink },
      data: { relatedProcessSlug: processSlug },
    });
  }

  return Response.json({ processSlug: process.slug, stepsCreated: steps.length });
}
