import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { generateAnimationSteps } from "@/lib/generate-animation-steps";
import { saveDraft } from "@/lib/animation-draft";

export const maxDuration = 60;

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { slug } = await ctx.params;
  const { feedback } = (await request.json().catch(() => ({}))) as { feedback?: string };

  // Find the process with its topic
  const proc = await prisma.process.findFirst({
    where: { slug },
    include: { topic: true },
  });
  if (!proc) return Response.json({ error: "Process not found" }, { status: 404 });

  // Find the subtopic linked to this process for content
  const subtopic = await prisma.subtopic.findFirst({
    where: { relatedProcessSlug: slug },
  });

  const nameEn = proc.nameEn;
  const nameHe = proc.nameHe;
  const contentEn = subtopic?.contentEn ?? proc.descEn;

  // Generate new steps (surface real AI errors; tolerate truncated JSON)
  let raw: Awaited<ReturnType<typeof generateAnimationSteps>>;
  try {
    raw = await generateAnimationSteps(nameEn, nameHe, contentEn, feedback);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
  if (raw.steps.length === 0) {
    return Response.json(
      { error: "AI returned no usable steps (possibly truncated or rate-limited). Try again." },
      { status: 502 }
    );
  }

  // The live animation is NOT touched: the rebuild becomes a draft that replaces it
  // only after it is polished and checked (scripts/animation-drafts.ts publish).
  const draft = await saveDraft({
    topicId: proc.topicId, subtopicId: subtopic?.id ?? null, targetSlug: slug, proposedSlug: slug,
    nameHe, nameEn, feedback: feedback ?? null, raw,
  });

  return Response.json({ draftId: draft.id, draft: true, stepsCreated: raw.steps.length });
}
