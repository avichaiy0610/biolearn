import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const subtopicId = searchParams.get("subtopicId");
  const topicSlug = searchParams.get("topicSlug");

  const where = subtopicId
    ? { subtopicId }
    : topicSlug
    ? { subtopic: { topicId: (await prisma.topic.findUnique({ where: { slug: topicSlug } }))?.id ?? "" } }
    : {};

  const questions = await prisma.question.findMany({
    where,
    include: { subtopic: { select: { nameHe: true, nameEn: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(questions);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { subtopicId, type, question, options, answer, explanation, difficulty, approved } =
    await request.json();

  if (!subtopicId || !type || !question || !answer)
    return Response.json({ error: "Missing required fields" }, { status: 400 });

  const created = await prisma.question.create({
    data: {
      id: crypto.randomUUID(),
      subtopicId,
      type,
      question,
      options: options ?? null,
      answer,
      explanation: explanation ?? "",
      difficulty: difficulty ?? "medium",
      approved: approved ?? false,
    },
    include: { subtopic: { select: { nameHe: true, nameEn: true, slug: true } } },
  });

  return Response.json(created, { status: 201 });
}
