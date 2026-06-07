import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return Response.json({ topics: [], subtopics: [], articles: [] });

  const [topics, subtopics, articles] = await Promise.all([
    prisma.topic.findMany({
      where: {
        OR: [
          { nameHe: { contains: q } },
          { nameEn: { contains: q } },
          { descHe: { contains: q } },
          { descEn: { contains: q } },
        ],
      },
      select: { slug: true, nameHe: true, nameEn: true, descHe: true, descEn: true, icon: true },
      take: 5,
    }),

    prisma.subtopic.findMany({
      where: {
        hidden: false,
        OR: [
          { nameHe: { contains: q } },
          { nameEn: { contains: q } },
          { contentHe: { contains: q } },
          { contentEn: { contains: q } },
        ],
      },
      select: {
        id: true,
        nameHe: true,
        nameEn: true,
        contentHe: true,
        contentEn: true,
        topic: { select: { slug: true, nameHe: true, nameEn: true } },
      },
      take: 8,
    }),

    prisma.article.findMany({
      where: {
        hidden: false,
        OR: [
          { title: { contains: q } },
          { abstract: { contains: q } },
          { abstractHe: { contains: q } },
        ],
      },
      select: { id: true, title: true, abstractHe: true, abstract: true, year: true, journal: true },
      take: 5,
    }),
  ]);

  return Response.json({ topics, subtopics, articles });
}
