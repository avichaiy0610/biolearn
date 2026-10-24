import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { GAP_STATUS, type GapStatus } from "@/lib/question-gaps";

// Sets what was done about a recurring question topic in a lesson (open / added / rejected / outside).
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { lessonSlug, topicLabel, status, note } = await req.json().catch(() => ({}));
  if (typeof lessonSlug !== "string" || typeof topicLabel !== "string" || !GAP_STATUS.includes(status as GapStatus)) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const noteText = typeof note === "string" ? note.slice(0, 500) : undefined;
  const row = await prisma.questionGap.upsert({
    where: { lessonSlug_topicLabel: { lessonSlug, topicLabel } },
    create: { lessonSlug, topicLabel, status, note: noteText ?? null },
    update: { status, ...(noteText !== undefined ? { note: noteText } : {}) },
    select: { status: true, note: true },
  });
  return Response.json(row);
}
