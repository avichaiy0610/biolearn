import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { lessonBySlug } from "@/content/lessons";
import { recordStudyDay } from "@/lib/study-day";

// Reading progress in a study unit. POST { lessonSlug, action: "open" | "read" }:
// "open" when the unit page is opened, "read" when the reader reaches the end of the unit body.
// Guests get 401 and nothing is stored.
export async function POST(req: NextRequest) {
  const email = (await auth().catch(() => null))?.user?.email;
  if (!email) return Response.json({ ok: false }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return Response.json({ ok: false }, { status: 401 });

  const { lessonSlug, action } = await req.json().catch(() => ({}));
  if (typeof lessonSlug !== "string" || !lessonBySlug(lessonSlug) || (action !== "open" && action !== "read")) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const now = new Date();
  const where = { userId_lessonSlug: { userId: user.id, lessonSlug } };
  if (action === "open") {
    await prisma.lessonProgress.upsert({ where, create: { userId: user.id, lessonSlug }, update: { updatedAt: now } });
  } else {
    // Keep the first time the unit was read through; reading it again only refreshes "last seen".
    const row = await prisma.lessonProgress.upsert({ where, create: { userId: user.id, lessonSlug, readAt: now }, update: { updatedAt: now } });
    if (!row.readAt) await prisma.lessonProgress.update({ where, data: { readAt: now } });
    await recordStudyDay(user.id);
  }
  return Response.json({ ok: true });
}
