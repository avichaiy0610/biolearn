import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  const topics = await prisma.topic.findMany({
    select: { slug: true, nameEn: true, nameHe: true },
    orderBy: { nameEn: "asc" },
  });
  const subtopics = await prisma.subtopic.findMany({
    where: { hidden: false },
    select: { slug: true, nameEn: true, nameHe: true, topicId: true, topic: { select: { slug: true } } },
  });

  return Response.json({
    topics: topics.map((t) => ({ type: "topic", slug: t.slug, nameEn: t.nameEn, nameHe: t.nameHe })),
    subtopics: subtopics.map((s) => ({
      type: "subtopic",
      slug: s.slug,
      topicSlug: s.topic.slug,
      nameEn: s.nameEn,
      nameHe: s.nameHe,
    })),
  });
}
