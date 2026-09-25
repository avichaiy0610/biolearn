import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { schedule, type Grade } from "@/lib/srs";
import { recordStudyDay } from "@/lib/study-day";
import { GLOSSARY, termId } from "@/content/glossary";

const VALID_IDS = new Set(Object.entries(GLOSSARY).flatMap(([topic, terms]) => terms.map((t) => termId(topic, t))));

async function userId() {
  const email = (await auth())?.user?.email;
  if (!email) return null;
  return (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id ?? null;
}

// GET → { states: { [cardId]: { ease, interval, reps, lapses, due(ms) } } }
export async function GET() {
  const uid = await userId();
  if (!uid) return Response.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.flashcardReview.findMany({ where: { userId: uid } });
  return Response.json({
    states: Object.fromEntries(rows.map((r) => [r.cardId, { ease: r.ease, interval: r.interval, reps: r.reps, lapses: r.lapses, due: r.due.getTime() }])),
  });
}

// POST { cardId, grade: 0|1|2|3 } → the new state (scheduled server-side)
export async function POST(req: Request) {
  const uid = await userId();
  if (!uid) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { cardId, grade } = await req.json().catch(() => ({}));
  if (typeof cardId !== "string" || !VALID_IDS.has(cardId) || ![0, 1, 2, 3].includes(grade)) {
    return Response.json({ error: "bad request" }, { status: 400 });
  }
  const prev = await prisma.flashcardReview.findUnique({ where: { userId_cardId: { userId: uid, cardId } } });
  const next = schedule(prev ?? undefined, grade as Grade);
  const data = { ease: next.ease, interval: next.interval, reps: next.reps, lapses: next.lapses, due: new Date(next.due) };
  await prisma.flashcardReview.upsert({
    where: { userId_cardId: { userId: uid, cardId } },
    create: { userId: uid, cardId, ...data },
    update: data,
  });
  await recordStudyDay(uid);
  return Response.json({ state: next });
}
