import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/topics/[slug]">) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await ctx.params;
  const { nameHe, nameEn, descHe, descEn, category, icon } = await request.json();

  const topic = await prisma.topic.update({
    where: { slug },
    data: { nameHe, nameEn, descHe, descEn, category, icon },
  });

  return Response.json(topic);
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/admin/topics/[slug]">) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await ctx.params;
  await prisma.topic.delete({ where: { slug } });
  return Response.json({ success: true });
}
