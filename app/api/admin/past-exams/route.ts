import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import { getCourse } from "@/lib/courses-db";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies over ~4.5 MB
const MOEDS = new Set(["א", "ב", "ג", "מיוחד"]);

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const exams = await prisma.pastExam.findMany({
    select: { id: true, courseSlug: true, year: true, moed: true, university: true, notes: true, fileName: true, fileSize: true, url: true, solutionUrl: true, createdAt: true },
    orderBy: [{ courseSlug: "asc" }, { year: "desc" }],
  });
  return Response.json({ exams });
}

// multipart/form-data: courseSlug, year, moed, university?, notes?, url?, solutionUrl?, file? (PDF), rights=on
export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });
  const form = await req.formData();
  const courseSlug = String(form.get("courseSlug") ?? "");
  const year = Number(form.get("year"));
  const moed = String(form.get("moed") ?? "");
  const url = String(form.get("url") ?? "").trim() || null;
  const solutionUrl = String(form.get("solutionUrl") ?? "").trim() || null;
  const file = form.get("file");

  if (!(await getCourse(courseSlug))) return Response.json({ error: "קורס לא מוכר." }, { status: 400 });
  if (!Number.isInteger(year) || year < 1990 || year > 2100) return Response.json({ error: "שנה לא תקינה." }, { status: 400 });
  if (!MOEDS.has(moed)) return Response.json({ error: "מועד לא תקין." }, { status: 400 });
  if (form.get("rights") !== "on") return Response.json({ error: "יש לאשר שיש זכות לפרסם את המבחן." }, { status: 400 });
  for (const u of [url, solutionUrl]) {
    if (u && !/^https:\/\//i.test(u)) return Response.json({ error: "קישורים חייבים להתחיל ב-https://" }, { status: 400 });
  }

  let fileData: string | null = null, fileName: string | null = null, fileSize: number | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) return Response.json({ error: "הקובץ גדול מ-4MB. אפשר להעלות אותו לשירות אחר ולצרף קישור." }, { status: 413 });
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.subarray(0, 5).toString() !== "%PDF-") return Response.json({ error: "הקובץ חייב להיות PDF." }, { status: 400 });
    fileData = buf.toString("base64");
    fileName = file.name.replace(/[^\w.\-א-ת ]/g, "_").slice(0, 120);
    fileSize = file.size;
  }
  if (!fileData && !url) return Response.json({ error: "יש לצרף קובץ PDF או קישור למבחן." }, { status: 400 });

  const exam = await prisma.pastExam.create({
    data: {
      courseSlug, year, moed, url, solutionUrl, fileData, fileName, fileSize,
      university: String(form.get("university") ?? "").trim().slice(0, 80) || null,
      notes: String(form.get("notes") ?? "").trim().slice(0, 300) || null,
    },
    select: { id: true },
  });
  return Response.json(exam, { status: 201 });
}
