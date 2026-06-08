import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

function newId() { return randomBytes(12).toString("base64url"); }

export async function GET(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");   // "open" | "resolved" | null = all
  const topic  = searchParams.get("topic");

  const items = await prisma.contentFeedback.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(topic  ? { topicSlug: topic } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return Response.json({ items });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json() as {
    topicSlug: string;
    processSlug?: string;
    subtopicId?: string;
    targetType: string;
    comment: string;
  };

  if (!body.topicSlug || !body.targetType || !body.comment?.trim()) {
    return Response.json({ error: "topicSlug, targetType and comment are required" }, { status: 400 });
  }

  const item = await prisma.contentFeedback.create({
    data: {
      id: newId(),
      topicSlug:   body.topicSlug,
      processSlug: body.processSlug ?? null,
      subtopicId:  body.subtopicId  ?? null,
      targetType:  body.targetType,
      comment:     body.comment.trim(),
      status:      "open",
    },
  });

  return Response.json({ item }, { status: 201 });
}
