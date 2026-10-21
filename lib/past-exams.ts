import { getCourse } from "@/lib/courses-db";

// Shared by the admin upload and the student upload (app/api/past-exams), so both check the same rules.
export const MAX_EXAM_BYTES = 4 * 1024 * 1024; // Vercel rejects request bodies over ~4.5 MB
const MOEDS = new Set(["א", "ב", "ג", "מיוחד"]);

export type ExamStatus = "pending" | "approved" | "rejected";
export const EXAM_STATUSES = new Set<ExamStatus>(["pending", "approved", "rejected"]);

type ExamFields = {
  courseSlug: string; year: number; moed: string; url: string | null; solutionUrl: string | null;
  fileData: string | null; fileName: string | null; fileSize: number | null;
  university: string | null; notes: string | null;
};

// multipart/form-data: courseSlug, year, moed, university?, notes?, url?, solutionUrl?, file? (PDF), rights=on
export async function parseExamForm(form: FormData): Promise<{ data: ExamFields } | { error: string; status: number }> {
  const courseSlug = String(form.get("courseSlug") ?? "");
  const year = Number(form.get("year"));
  const moed = String(form.get("moed") ?? "");
  const url = String(form.get("url") ?? "").trim() || null;
  const solutionUrl = String(form.get("solutionUrl") ?? "").trim() || null;
  const file = form.get("file");

  if (!(await getCourse(courseSlug))) return { error: "קורס לא מוכר.", status: 400 };
  if (!Number.isInteger(year) || year < 1990 || year > 2100) return { error: "שנה לא תקינה.", status: 400 };
  if (!MOEDS.has(moed)) return { error: "מועד לא תקין.", status: 400 };
  if (form.get("rights") !== "on") return { error: "יש לאשר שיש זכות לשתף את המבחן.", status: 400 };
  for (const u of [url, solutionUrl]) {
    if (u && !/^https:\/\//i.test(u)) return { error: "קישורים חייבים להתחיל ב-https://", status: 400 };
  }

  let fileData: string | null = null, fileName: string | null = null, fileSize: number | null = null;
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_EXAM_BYTES) return { error: "הקובץ גדול מ-4MB. אפשר להעלות אותו לשירות אחר ולצרף קישור.", status: 413 };
    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.subarray(0, 5).toString() !== "%PDF-") return { error: "הקובץ חייב להיות PDF.", status: 400 };
    fileData = buf.toString("base64");
    fileName = file.name.replace(/[^\w.\-א-ת ]/g, "_").slice(0, 120);
    fileSize = file.size;
  }
  if (!fileData && !url) return { error: "יש לצרף קובץ PDF או קישור למבחן.", status: 400 };

  return {
    data: {
      courseSlug, year, moed, url, solutionUrl, fileData, fileName, fileSize,
      university: String(form.get("university") ?? "").trim().slice(0, 80) || null,
      notes: String(form.get("notes") ?? "").trim().slice(0, 300) || null,
    },
  };
}
