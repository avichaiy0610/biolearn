import { prisma } from "@/lib/prisma";

export async function GET() {
  const suggestions = await prisma.contentSuggestion.findMany({
    where: { approved: false, rejected: false },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
  return Response.json(suggestions);
}

export async function POST(request: Request) {
  const { id, action } = await request.json();

  if (action === "reject") {
    await prisma.contentSuggestion.update({
      where: { id },
      data: { rejected: true },
    });
    return Response.json({ ok: true });
  }

  if (action === "approve") {
    const suggestion = await prisma.contentSuggestion.findUnique({ where: { id } });
    if (!suggestion) return Response.json({ error: "Not found" }, { status: 404 });

    // Find the topic
    const topic = suggestion.topicSlug
      ? await prisma.topic.findUnique({ where: { slug: suggestion.topicSlug } })
      : null;

    if (!topic) {
      return Response.json({ error: "Topic not found — assign to a topic first" }, { status: 400 });
    }

    // Check if a subtopic with the same name already exists in this topic
    const nameDupe = await prisma.subtopic.findFirst({
      where: {
        topicId: topic.id,
        OR: [
          { nameEn: { equals: suggestion.nameEn } },
          { nameHe: { equals: suggestion.nameHe } },
        ],
      },
    });
    if (nameDupe) {
      // Mark as approved without creating a duplicate
      await prisma.contentSuggestion.update({ where: { id }, data: { approved: true } });
      return Response.json({ ok: true, skipped: true, reason: "Subtopic already exists" });
    }

    // Check slug uniqueness
    const existing = await prisma.subtopic.findFirst({ where: { slug: suggestion.slug } });
    const finalSlug = existing ? `${suggestion.slug}-${Date.now()}` : suggestion.slug;

    await prisma.subtopic.create({
      data: {
        slug: finalSlug,
        topicId: topic.id,
        nameHe: suggestion.nameHe,
        nameEn: suggestion.nameEn,
        contentHe: suggestion.contentHe,
        contentEn: suggestion.contentEn,
      },
    });

    await prisma.contentSuggestion.update({
      where: { id },
      data: { approved: true },
    });

    return Response.json({ ok: true, slug: finalSlug });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
