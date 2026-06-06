import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { topicSlug, slug, nameHe, nameEn, contentHe, contentEn } = await request.json();

  if (!topicSlug || !nameHe || !nameEn || !contentHe || !contentEn) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
  if (!topic) return Response.json({ error: "Topic not found" }, { status: 404 });

  const finalSlug = slug || `${topicSlug}-${nameEn.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

  const subtopic = await prisma.subtopic.create({
    data: {
      topicId: topic.id,
      slug: finalSlug,
      nameHe,
      nameEn,
      contentHe,
      contentEn,
    },
  });

  return Response.json(subtopic, { status: 201 });
}
