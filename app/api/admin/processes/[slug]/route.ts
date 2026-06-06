import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/processes/[slug]">) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await ctx.params;
  const { newTopicSlug } = await request.json();

  const topic = await prisma.topic.findUnique({ where: { slug: newTopicSlug } });
  if (!topic) return Response.json({ error: "Target topic not found" }, { status: 404 });

  const process = await prisma.process.findFirst({ where: { slug } });
  if (!process) return Response.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.process.update({
    where: { id: process.id },
    data: { topicId: topic.id },
  });
  return Response.json(updated);
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/processes/[slug]">) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await ctx.params;
  const process = await prisma.process.findFirst({ where: { slug } });
  if (!process) return Response.json({ error: "Not found" }, { status: 404 });

  await prisma.process.delete({ where: { id: process.id } });
  return Response.json({ success: true });
}
