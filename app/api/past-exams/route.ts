import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import { parseExamForm } from "@/lib/past-exams";

const DAILY_LIMIT = 5; // uploads per user per 24 hours

// A signed-in student shares a past exam. It waits ("pending") until an admin approves it
// in /admin/exams; only approved exams appear on the course page.
export async function POST(req: Request) {
  const user = await getUser();
  if (!user?.id || !user.email) return Response.json({ error: "צריך להתחבר כדי להעלות מבחן." }, { status: 401 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent = await prisma.pastExam.count({ where: { uploaderId: user.id, createdAt: { gte: since } } });
  if (recent >= DAILY_LIMIT) return Response.json({ error: "הגעת למגבלת ההעלאות היומית. אפשר לנסות שוב מחר." }, { status: 429 });

  const parsed = await parseExamForm(await req.formData());
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: parsed.status });

  const exam = await prisma.pastExam.create({
    data: { ...parsed.data, status: "pending", uploaderId: user.id, uploaderEmail: user.email },
    select: { id: true },
  });
  return Response.json(exam, { status: 201 });
}
