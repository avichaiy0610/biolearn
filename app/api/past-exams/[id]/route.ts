import { prisma } from "@/lib/prisma";
import { getUser, isAdmin } from "@/lib/supabase/server";

// Serves an uploaded past-exam PDF inline. Exams that are not approved yet are visible
// only to an admin (for review) and to the student who uploaded them.
export async function GET(_req: Request, ctx: RouteContext<"/api/past-exams/[id]">) {
  const { id } = await ctx.params;
  const exam = await prisma.pastExam.findUnique({ where: { id }, select: { fileData: true, fileName: true, status: true, uploaderId: true } });
  if (!exam?.fileData) return Response.json({ error: "הקובץ לא נמצא." }, { status: 404 });
  const approved = exam.status === "approved";
  if (!approved) {
    const user = await getUser();
    const allowed = (user?.id && user.id === exam.uploaderId) || (await isAdmin());
    if (!allowed) return Response.json({ error: "הקובץ לא נמצא." }, { status: 404 });
  }
  const name = encodeURIComponent(exam.fileName ?? "exam.pdf");
  return new Response(Buffer.from(exam.fileData, "base64"), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${name}`,
      "Cache-Control": approved ? "public, max-age=86400" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
