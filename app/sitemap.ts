import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { isComingSoon } from "@/lib/topics";
import { getCourses } from "@/lib/courses-db";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();
  const staticPaths = ["", "/topics", "/courses", ...courses.map((c) => `/courses/${c.slug}`), "/proteins", "/research"];
  const topics = await prisma.topic
    .findMany({
      select: {
        slug: true,
        processes: { select: { slug: true } },
        _count: { select: { processes: true, subtopics: { where: { hidden: false } } } },
      },
    })
    .catch(() => []);

  const paths = [
    ...staticPaths,
    ...topics
      .filter((t) => !isComingSoon(t))
      .flatMap((t) => [`/topics/${t.slug}`, ...t.processes.map((p) => `/topics/${t.slug}/${p.slug}`)]),
  ];

  return paths.map((p) => ({
    url: `${SITE_URL}/he${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
    alternates: { languages: { he: `${SITE_URL}/he${p}`, en: `${SITE_URL}/en${p}` } },
  }));
}
