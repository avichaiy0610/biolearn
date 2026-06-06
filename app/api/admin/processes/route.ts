import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { topicSlug, slug, nameHe, nameEn, descHe, descEn, steps } = await request.json();

  if (!topicSlug || !nameHe || !nameEn || !descHe || !descEn) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });

  const finalSlug = slug || `${topicSlug}-${nameEn.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

  const process = await prisma.process.create({
    data: {
      topicId: topic.id,
      slug: finalSlug,
      nameHe,
      nameEn,
      descHe,
      descEn,
      steps: {
        create: (steps ?? []).map((s: { titleHe: string; titleEn: string; descHe: string; descEn: string }, i: number) => ({
          order: i + 1,
          titleHe: s.titleHe,
          titleEn: s.titleEn,
          descHe: s.descHe,
          descEn: s.descEn,
          svgData: JSON.stringify({ elements: [], highlight: [] }),
        })),
      },
    },
    include: { steps: true },
  });

  return Response.json(process, { status: 201 });
}
