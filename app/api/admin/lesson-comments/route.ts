import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { lessonBySlug } from "@/content/lessons";
import { parseBody } from "@/content/lessons/parse";

// Admin comments on a unit, optionally tied to one section. POST adds, PATCH reopens/closes or deletes.
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { lessonSlug, sectionId, body } = await req.json().catch(() => ({}));
  const lesson = typeof lessonSlug === "string" ? lessonBySlug(lessonSlug) : undefined;
  const text = typeof body === "string" ? body.trim().slice(0, 4000) : "";
  const section = typeof sectionId === "string" && sectionId ? sectionId : null;
  if (!lesson || !text || (section && !parseBody(lesson.bodyHe).some((s) => s.id === section) && !EXTRA_SECTIONS.includes(section))) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const c = await prisma.lessonComment.create({ data: { lessonSlug: lesson.slug, sectionId: section, body: text } });
  return Response.json({ id: c.id, sectionId: c.sectionId, body: c.body, status: c.status, reply: c.reply, createdAt: c.createdAt.toISOString() });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { id, status, remove } = await req.json().catch(() => ({}));
  if (typeof id !== "string") return Response.json({ error: "bad request" }, { status: 400 });
  if (remove === true) {
    await prisma.lessonComment.delete({ where: { id } });
    return Response.json({ ok: true, removed: true });
  }
  if (status !== "open" && status !== "done") return Response.json({ error: "bad request" }, { status: 400 });
  await prisma.lessonComment.update({ where: { id }, data: { status, resolvedAt: status === "done" ? new Date() : null } });
  return Response.json({ ok: true, status });
}

// Parts of the unit page outside the body sections that a comment can point at.
const EXTRA_SECTIONS = ["lead", "objectives", "experiment", "traps", "terms", "worked", "practice", "sources"];
