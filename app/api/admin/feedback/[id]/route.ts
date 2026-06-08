import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await ctx.params;
  const { status } = await req.json() as { status: string };

  if (!["open", "resolved"].includes(status)) {
    return Response.json({ error: "status must be 'open' or 'resolved'" }, { status: 400 });
  }

  const item = await prisma.contentFeedback.update({
    where: { id },
    data: { status },
  });

  return Response.json({ item });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await ctx.params;
  await prisma.contentFeedback.delete({ where: { id } });
  return Response.json({ ok: true });
}
