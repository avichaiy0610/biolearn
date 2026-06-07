import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getUserId(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  return user?.id ?? null;
}

// GET /api/progress?topicSlug=X  — returns visited subtopic IDs + best quiz scores
export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return Response.json({ visited: [], scores: {} });

  const topicSlug = req.nextUrl.searchParams.get("topicSlug");

  const [progress, quizResults] = await Promise.all([
    prisma.userProgress.findMany({
      where: {
        userId,
        ...(topicSlug ? { subtopic: { topic: { slug: topicSlug } } } : {}),
      },
      select: { subtopicId: true },
    }),
    prisma.quizResult.findMany({
      where: {
        userId,
        ...(topicSlug ? { subtopic: { topic: { slug: topicSlug } } } : {}),
      },
      select: { subtopicId: true, score: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const scores: Record<string, number> = {};
  for (const r of quizResults) {
    if (scores[r.subtopicId] === undefined || r.score > scores[r.subtopicId]) {
      scores[r.subtopicId] = r.score;
    }
  }

  return Response.json({
    visited: progress.map((p: { subtopicId: string }) => p.subtopicId),
    scores,
  });
}

// POST /api/progress — mark subtopic visited or save quiz result
export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return Response.json({ ok: false }, { status: 401 });

  const { action, subtopicId, score, total, correct, type } = await req.json();
  if (!subtopicId) return Response.json({ ok: false }, { status: 400 });

  if (action === "visit") {
    await prisma.userProgress.upsert({
      where: { userId_subtopicId: { userId, subtopicId } },
      create: { id: crypto.randomUUID(), userId, subtopicId, visited: true },
      update: { visited: true },
    });
    return Response.json({ ok: true });
  }

  if (action === "quiz") {
    if (score === undefined || total === undefined || correct === undefined)
      return Response.json({ ok: false }, { status: 400 });
    await prisma.quizResult.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        subtopicId,
        score,
        total,
        correct,
        type: type ?? "official",
      },
    });
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false, error: "Unknown action" }, { status: 400 });
}
