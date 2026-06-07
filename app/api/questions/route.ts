import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subtopicId = searchParams.get("subtopicId");
  if (!subtopicId) return Response.json({ error: "Missing subtopicId" }, { status: 400 });

  const questions = await prisma.question.findMany({
    where: { subtopicId, approved: true },
    select: {
      id: true, type: true, question: true,
      options: true, answer: true, explanation: true, difficulty: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(questions);
}
