import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { parseExamForm } from "@/lib/past-exams";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const exams = await prisma.pastExam.findMany({
    select: { id: true, courseSlug: true, year: true, moed: true, university: true, notes: true, fileName: true, fileSize: true, url: true, solutionUrl: true, createdAt: true, status: true, uploaderEmail: true },
    orderBy: [{ courseSlug: "asc" }, { year: "desc" }],
  });
  return Response.json({ exams });
}

// Admin uploads are published right away (status "approved").
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const parsed = await parseExamForm(await req.formData());
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: parsed.status });
  const exam = await prisma.pastExam.create({ data: { ...parsed.data, status: "approved", reviewedAt: new Date() }, select: { id: true } });
  return Response.json(exam, { status: 201 });
}
