import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { generateAnimationSteps } from "@/lib/generate-animation-steps";

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
    include: {
      topic: true,
      steps: { select: { id: true } },
    },
  });
  if (!proc) return Response.json({ error: "Process not found" }, { status: 404 });

  // Find the subtopic linked to this process for content
  const subtopic = await prisma.subtopic.findFirst({
    where: { relatedProcessSlug: slug },
  });

  const nameEn = proc.nameEn;
  const nameHe = proc.nameHe;
  const contentEn = subtopic?.contentEn ?? proc.descEn;

  // Generate new steps
  const steps = await generateAnimationSteps(nameEn, nameHe, contentEn, feedback);
  if (steps.length === 0) {
    return Response.json({ error: "AI failed to generate animation steps" }, { status: 500 });
  }

  // The libSQL (Turso) adapter does NOT reliably support createMany, so mirror
  // the working generate-animation route and use a nested `create` instead.
  try {
    await prisma.processStep.deleteMany({ where: { processId: proc.id } });
    await prisma.process.update({
      where: { id: proc.id },
      data: {
        steps: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: steps.map((s: any, i: number) => ({
            order: i + 1,
            titleHe: String(s.titleHe ?? ""),
            titleEn: String(s.titleEn ?? ""),
            descHe: String(s.descHe ?? ""),
            descEn: String(s.descEn ?? ""),
            svgData: JSON.stringify({ elements: s.elements ?? [], highlight: s.highlight ?? [] }),
          })),
        },
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[regenerate] DB write failed:", msg);
    return Response.json({ error: `Failed to save animation: ${msg}` }, { status: 500 });
  }

  return Response.json({ stepsCreated: steps.length });
}
