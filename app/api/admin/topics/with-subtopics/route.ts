import { prisma } from "@/lib/prisma";

type SubtopicInput = { slug: string; nameEn: string; nameHe: string; contentEn: string; contentHe: string };

export async function POST(request: Request) {
  const { slug, nameEn, nameHe, descEn, descHe, category, icon, subtopics } = await request.json();

  if (!slug || !nameEn || !nameHe || !descEn || !descHe || !category) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.topic.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: "Topic slug already exists" }, { status: 409 });
  }

  const topic = await prisma.$transaction(async (tx) => {
    const newTopic = await tx.topic.create({
      data: { slug, nameEn, nameHe, descEn, descHe, category, icon: icon || "🔬" },
    });

    if (Array.isArray(subtopics) && subtopics.length > 0) {
      await tx.subtopic.createMany({
        data: (subtopics as SubtopicInput[]).map((s) => ({
          slug: s.slug || `${slug}-${s.nameEn.toLowerCase().replace(/\s+/g, "-")}`,
          topicId: newTopic.id,
          nameEn: s.nameEn,
          nameHe: s.nameHe,
          contentEn: s.contentEn,
          contentHe: s.contentHe,
        })),
      });
    }

    return newTopic;
  });

  return Response.json({ id: topic.id, slug: topic.slug }, { status: 201 });
}
