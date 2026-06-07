import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if ("approved" in body) data.approved = body.approved;
  if ("question" in body) data.question = body.question;
  if ("answer" in body) data.answer = body.answer;
  if ("explanation" in body) data.explanation = body.explanation;
  if ("difficulty" in body) data.difficulty = body.difficulty;
  if ("options" in body) data.options = body.options ? JSON.stringify(body.options) : null;

  const question = await prisma.question.update({ where: { id }, data });
  return Response.json(question);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  return Response.json({ success: true });
}
