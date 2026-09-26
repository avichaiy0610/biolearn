import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { generateAnimationSteps } from "@/lib/generate-animation-steps";
import { saveDraft } from "@/lib/animation-draft";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
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

  // The animation becomes a DRAFT (polished + checked before publishing); a
  // generation failure must not block adding the subtopic itself.
  const raw = await generateAnimationSteps(nameEn, nameHe ?? nameEn, contentEn ?? "").catch((e) => {
    console.error("[add-subtopic] animation generation failed:", e);
    return { steps: [], legend: [] };
  });

  const subtopic = await prisma.subtopic.create({
    data: {
      slug: finalSlug,
      topicId: topic.id,
      nameHe: nameHe ?? nameEn,
      nameEn,
      contentHe: contentHe ?? contentEn,
      contentEn,
      hidden: true, // AI draft — published only after textbook review
    },
  });

  const draft = raw.steps.length
    ? await saveDraft({ topicId: topic.id, subtopicId: subtopic.id, proposedSlug: processSlug, nameHe: nameHe ?? nameEn, nameEn, raw })
    : null;

  return Response.json({
    id: subtopic.id,
    slug: subtopic.slug,
    animationCreated: draft !== null,
    draftId: draft?.id ?? null,
  });
}
