import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/past-exams/[id]">) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await ctx.params;
  await prisma.pastExam.delete({ where: { id } }).catch(() => null);
  return Response.json({ ok: true });
}
