import { isAdmin } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const [
    userCount,
    topicCount,
    subtopicCount,
    articleCount,
    articlePublishedCount,
    questionCount,
    chatLogCount,
    topicChats,
    recentArticles,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.topic.count(),
    prisma.subtopic.count({ where: { hidden: false } }),
    prisma.article.count(),
    prisma.article.count({ where: { hidden: false } }),
    prisma.question.count({ where: { approved: true } }),
    prisma.chatLog.count(),
    prisma.chatLog.groupBy({
      by: ["topicName"],
      _count: { topicName: true },
      orderBy: { _count: { topicName: "desc" } },
      take: 8,
    }),
    prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, year: true, source: true, hidden: true, createdAt: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, email: true, name: true, createdAt: true },
    }),
  ]);

  return Response.json({
    counts: {
      users: userCount,
      topics: topicCount,
      subtopics: subtopicCount,
      articles: articleCount,
      articlesPublished: articlePublishedCount,
      questions: questionCount,
      chatLogs: chatLogCount,
    },
    topTopics: topicChats.map((t) => ({
      name: t.topicName,
      count: t._count.topicName,
    })),
    recentArticles,
    recentUsers,
  });
}
