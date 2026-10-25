import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { lessonBySlug } from "@/content/lessons";
import { DECISIONS, type Decision } from "@/lib/lesson-review";

// Records the admin's decision on one or more units (a whole course at once: several slugs).
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { slugs, decision, note } = await req.json().catch(() => ({}));
  const list: unknown[] = Array.isArray(slugs) ? slugs : [];
  if (!list.length || list.length > 100 || !list.every((s) => typeof s === "string" && lessonBySlug(s)) || !DECISIONS.includes(decision as Decision)) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const noteText = typeof note === "string" ? note.slice(0, 1000) : undefined;
  await prisma.$transaction(
    (list as string[]).map((lessonSlug) =>
      prisma.lessonReview.upsert({
        where: { lessonSlug },
        create: { lessonSlug, decision, note: noteText ?? null },
        update: { decision, ...(noteText !== undefined ? { note: noteText } : {}) },
      }),
    ),
  );
  return Response.json({ ok: true, decision });
}
