import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

// The admin's queue of narrated explainer videos (🎬 in the admin panel). Claude/Codex produce them
// locally (../biolearn-video) and work the queue with scripts/video-requests.ts.
export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const requests = await prisma.videoRequest.findMany({ select: { processSlug: true, status: true, note: true } });
  return Response.json({ requests });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const { processSlug, action, note } = await req.json().catch(() => ({}));
  if (typeof processSlug !== "string" || !(await prisma.process.findFirst({ where: { slug: processSlug }, select: { id: true } }))) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  if (action === "cancel") {
    await prisma.videoRequest.deleteMany({ where: { processSlug, status: "pending" } });
    return Response.json({ ok: true, status: null });
  }
  const noteText = typeof note === "string" ? note.slice(0, 1000) : null;
  const row = await prisma.videoRequest.upsert({
    where: { processSlug },
    create: { processSlug, note: noteText },
    update: { status: "pending", ...(noteText !== null ? { note: noteText } : {}) },
  });
  return Response.json({ ok: true, status: row.status });
}
