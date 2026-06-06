import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/subtopics/[id]">) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const { nameHe, nameEn, contentHe, contentEn } = await request.json();

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
