import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { subtopicId, nameHe, nameEn, contentHe, contentEn } = await request.json();

  if (!subtopicId) {
    return Response.json({ error: "Missing subtopicId" }, { status: 400 });
  }

  const updated = await prisma.subtopic.update({
    where: { id: subtopicId },
    data: {
      ...(nameHe && { nameHe }),
      ...(nameEn && { nameEn }),
      ...(contentHe && { contentHe }),
      ...(contentEn && { contentEn }),
    },
  });

  return Response.json({ id: updated.id, slug: updated.slug });
}
