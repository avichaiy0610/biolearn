import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: { nameEn: "asc" },
    include: { _count: { select: { subtopics: true, processes: true } } },
  });
  return Response.json(topics);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug, nameHe, nameEn, descHe, descEn, category, icon } = await request.json();

  if (!slug || !nameHe || !nameEn || !descHe || !descEn || !category || !icon) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.topic.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: "Slug already exists" }, { status: 400 });
  }

  const topic = await prisma.topic.create({
    data: { slug, nameHe, nameEn, descHe, descEn, category, icon },
  });

  return Response.json(topic, { status: 201 });
}
