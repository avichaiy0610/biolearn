import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

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
