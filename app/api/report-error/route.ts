import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// Public "דווח על טעות" endpoint. Reports land in ContentFeedback, which admins
// already triage at /admin/feedback. Light abuse protection: size limits, a
// honeypot field and a per-IP rate limit (per server instance).
const recent = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { topicSlug, processSlug, subtopicId, comment, website } = body as Record<string, unknown>;

  if (website) return Response.json({ ok: true }); // honeypot: bots fill every field
  if (typeof topicSlug !== "string" || !topicSlug || typeof comment !== "string" || comment.trim().length < 5) {
    return Response.json({ error: "נא לתאר את הטעות (לפחות 5 תווים)." }, { status: 400 });
  }
  if (comment.length > 1500) {
    return Response.json({ error: "התיאור ארוך מדי (עד 1500 תווים)." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_PER_WINDOW) {
    return Response.json({ error: "שלחת כמה דיווחים ברצף. נסו שוב בעוד כמה דקות." }, { status: 429 });
  }
  recent.set(ip, [...hits, now]);

  const topic = await prisma.topic.findUnique({ where: { slug: topicSlug }, select: { id: true } });
  if (!topic) return Response.json({ error: "הנושא לא נמצא." }, { status: 404 });

  await prisma.contentFeedback.create({
    data: {
      id: randomBytes(12).toString("base64url"),
      topicSlug,
      processSlug: typeof processSlug === "string" ? processSlug : null,
      subtopicId: typeof subtopicId === "string" ? subtopicId : null,
      targetType: typeof processSlug === "string" ? "animation" : "description",
      comment: `[דיווח משתמש] ${comment.trim()}`,
      status: "open",
    },
  });
  return Response.json({ ok: true }, { status: 201 });
}
