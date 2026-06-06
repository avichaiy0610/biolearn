import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/subtopics/[id]">) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = await request.json();

  // Move to another topic
  if (body.newTopicSlug) {
    const topic = await prisma.topic.findUnique({ where: { slug: body.newTopicSlug } });
    if (!topic) return Response.json({ error: "Target topic not found" }, { status: 404 });
    const subtopic = await prisma.subtopic.update({
      where: { id },
      data: { topicId: topic.id },
    });
    return Response.json(subtopic);
  }

  const { nameHe, nameEn, contentHe, contentEn } = body;
  const subtopic = await prisma.subtopic.update({
    where: { id },
    data: { nameHe, nameEn, contentHe, contentEn },
  });
  return Response.json(subtopic);
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/subtopics/[id]">) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await ctx.params;
  await prisma.subtopic.delete({ where: { id } });
  return Response.json({ success: true });
}
