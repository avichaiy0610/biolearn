import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

export async function GET() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(articles);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const {
    pubmedId, title, authors, journal, year, abstract,
    abstractHe, keyFindings, topicSlugs, subtopicIds, url, source,
  } = body;

  if (!title || !abstract) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check for duplicate pubmedId
  if (pubmedId) {
    const existing = await prisma.article.findUnique({ where: { pubmedId } });
    if (existing) {
      return Response.json({ error: "Article already exists" }, { status: 409 });
    }
  }

  const article = await prisma.article.create({
    data: {
      pubmedId: pubmedId ?? null,
      title,
      authors: JSON.stringify(authors ?? []),
      journal: journal ?? null,
      year: year ?? null,
      abstract,
      abstractHe: abstractHe ?? null,
      keyFindings: keyFindings ? JSON.stringify(keyFindings) : null,
      topicSlugs: topicSlugs ? JSON.stringify(topicSlugs) : null,
      subtopicIds: subtopicIds ? JSON.stringify(subtopicIds) : null,
      url: url ?? null,
      source: source ?? "pubmed",
      hidden: true,
    },
  });

  return Response.json(article, { status: 201 });
}
