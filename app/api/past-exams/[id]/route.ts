import { prisma } from "@/lib/prisma";

// Serves an uploaded past-exam PDF inline.
export async function GET(_req: Request, ctx: RouteContext<"/api/past-exams/[id]">) {
  const { id } = await ctx.params;
  const exam = await prisma.pastExam.findUnique({ where: { id }, select: { fileData: true, fileName: true } });
  if (!exam?.fileData) return Response.json({ error: "הקובץ לא נמצא." }, { status: 404 });
  const name = encodeURIComponent(exam.fileName ?? "exam.pdf");
  return new Response(Buffer.from(exam.fileData, "base64"), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename*=UTF-8''${name}`,
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
