import { prisma } from "@/lib/prisma";

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").slice(0, 50);
}

// Confirm: apply merge — delete or hide originals, create merged subtopic
export async function POST(request: Request) {
  const { subtopicIds, idsToDelete, idsToHide, merged } = await request.json();

  if (!Array.isArray(subtopicIds) || subtopicIds.length < 2 || !merged) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const first = await prisma.subtopic.findUnique({ where: { id: subtopicIds[0] }, include: { topic: true } });
  if (!first) return Response.json({ error: "Subtopic not found" }, { status: 404 });

  // Hide selected subtopics
  if (Array.isArray(idsToHide) && idsToHide.length > 0) {
    await prisma.subtopic.updateMany({ where: { id: { in: idsToHide } }, data: { hidden: true } });
  }

  // Delete selected subtopics
  if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
    await prisma.subtopic.deleteMany({ where: { id: { in: idsToDelete } } });
  }

  // Create the merged subtopic
  const created = await prisma.subtopic.create({
    data: {
      topicId: first.topicId,
      slug: merged.slug ?? slugify(merged.nameEn),
      nameHe: merged.nameHe,
      nameEn: merged.nameEn,
      contentHe: merged.contentHe,
      contentEn: merged.contentEn,
    },
  });

  return Response.json(created);
}
