import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { EXAM_STATUSES, type ExamStatus } from "@/lib/past-exams";

// Approve or reject a student upload: { status: "approved" | "rejected" | "pending" }.
export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/past-exams/[id]">) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await ctx.params;
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!status || !EXAM_STATUSES.has(status as ExamStatus)) return Response.json({ error: "סטטוס לא תקין." }, { status: 400 });
  const exam = await prisma.pastExam
    .update({ where: { id }, data: { status, reviewedAt: status === "pending" ? null : new Date() }, select: { id: true, status: true } })
    .catch(() => null);
  if (!exam) return Response.json({ error: "המבחן לא נמצא." }, { status: 404 });
  return Response.json(exam);
}

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/past-exams/[id]">) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await ctx.params;
  await prisma.pastExam.delete({ where: { id } }).catch(() => null);
  return Response.json({ ok: true });
}
