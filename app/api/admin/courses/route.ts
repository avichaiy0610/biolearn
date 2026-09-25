import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { getCourses, courseCatalog as catalog } from "@/lib/courses-db";
import type { CourseUnit } from "@/content/courses";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const [courses, cat] = await Promise.all([getCourses(), catalog()]);
  return Response.json({ courses, catalog: cat });
}

type IncomingCourse = {
  slug: string; nameHe: string; nameEn: string; year: number; semester: string;
  descHe: string; descEn: string; units: CourseUnit[];
};

// Saves the whole course structure at once (so moving a unit between two
// courses is a single atomic change).
export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const body = await req.json().catch(() => null);
  const list: IncomingCourse[] | null = Array.isArray(body?.courses) ? body.courses : null;
  if (!list) return Response.json({ error: "בקשה לא תקינה." }, { status: 400 });

  const cat = await catalog();
  const validUnit = new Set(cat.flatMap((t) => t.units.map((u) => (u.kind === "subtopic" ? `s:${u.topic}:${u.id}` : `p:${u.topic}:${u.slug}`))));
  const slugs = new Set<string>();
  for (const c of list) {
    const name = c?.nameHe?.trim() || c?.slug || "?";
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c?.slug ?? "")) return Response.json({ error: `מזהה קורס לא תקין: "${c?.slug}" (אותיות אנגליות קטנות, ספרות ומקפים).` }, { status: 400 });
    if (slugs.has(c.slug)) return Response.json({ error: `המזהה "${c.slug}" מופיע פעמיים.` }, { status: 400 });
    slugs.add(c.slug);
    if (!c.nameHe?.trim()) return Response.json({ error: `לקורס "${c.slug}" חסר שם בעברית.` }, { status: 400 });
    if (![1, 2, 3, 4].includes(c.year)) return Response.json({ error: `שנה לא תקינה בקורס "${name}".` }, { status: 400 });
    if (!["A", "B"].includes(c.semester)) return Response.json({ error: `סמסטר לא תקין בקורס "${name}".` }, { status: 400 });
    if (!Array.isArray(c.units)) return Response.json({ error: `יחידות לא תקינות בקורס "${name}".` }, { status: 400 });
    for (const u of c.units) {
      const key = u?.kind === "subtopic" ? `s:${u.topic}:${u.id}` : u?.kind === "process" ? `p:${u.topic}:${u.slug}` : "";
      if (!validUnit.has(key)) return Response.json({ error: `יחידה לא קיימת או מוסתרת בקורס "${name}". רעננו את הדף ונסו שוב.` }, { status: 400 });
    }
  }

  // Don't orphan past exams: a course with exams can't be deleted.
  const existing = await prisma.course.findMany({ select: { slug: true, nameHe: true } });
  const removed = existing.filter((e) => !slugs.has(e.slug));
  if (removed.length) {
    const withExams = await prisma.pastExam.groupBy({ by: ["courseSlug"], where: { courseSlug: { in: removed.map((r) => r.slug) } }, _count: true });
    if (withExams.length) {
      const names = removed.filter((r) => withExams.some((w) => w.courseSlug === r.slug)).map((r) => r.nameHe).join(", ");
      return Response.json({ error: `אי אפשר למחוק קורס שיש לו מבחני עבר (${names}). מחקו קודם את המבחנים.` }, { status: 409 });
    }
  }

  // Position = order within its year/semester, as sent by the client.
  const pos = new Map<string, number>();
  const ops = [
    ...removed.map((r) => prisma.course.delete({ where: { slug: r.slug } })),
    ...list.map((c) => {
      const k = `${c.year}${c.semester}`;
      const position = pos.get(k) ?? 0;
      pos.set(k, position + 1);
      const data = {
        nameHe: c.nameHe.trim(), nameEn: (c.nameEn ?? "").trim() || c.nameHe.trim(),
        year: c.year, semester: c.semester,
        descHe: (c.descHe ?? "").trim(), descEn: (c.descEn ?? "").trim(),
        units: JSON.stringify(c.units.map((u) => (u.kind === "subtopic" ? { kind: u.kind, topic: u.topic, id: u.id } : { kind: u.kind, topic: u.topic, slug: u.slug }))),
        position,
      };
      return prisma.course.upsert({ where: { slug: c.slug }, create: { slug: c.slug, ...data }, update: data });
    }),
  ];
  await prisma.$transaction(ops);
  return Response.json({ ok: true, courses: await getCourses() });
}
