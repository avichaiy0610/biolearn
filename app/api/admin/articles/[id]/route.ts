import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if ("hidden" in body) data.hidden = body.hidden;
  if ("abstractHe" in body) data.abstractHe = body.abstractHe;
  if ("keyFindings" in body) data.keyFindings = JSON.stringify(body.keyFindings);
  if ("topicSlugs" in body) data.topicSlugs = JSON.stringify(body.topicSlugs);
  if ("subtopicIds" in body) data.subtopicIds = JSON.stringify(body.subtopicIds);

  const article = await prisma.article.update({ where: { id }, data });
  return Response.json(article);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return Response.json({ success: true });
}
