import "server-only";
import { cookies } from "next/headers";
import { GENERAL_UNIVERSITY, TERM_COOKIE, UNIVERSITY_COOKIE, universityBySlug, type University } from "@/content/universities";

// The university whose course track the visitor follows: an explicit ?uni=
// (shareable links) wins, then the cookie set by the picker, then the general track.
export async function selectedUniversity(param?: string | string[]): Promise<University> {
  const fromParam = universityBySlug(Array.isArray(param) ? param[0] : param);
  if (fromParam) return fromParam;
  const fromCookie = universityBySlug((await cookies()).get(UNIVERSITY_COOKIE)?.value);
  return fromCookie ?? universityBySlug(GENERAL_UNIVERSITY)!;
}

export type Term = { year: 1 | 2 | 3 | 4; semester: "A" | "B"; chosen: boolean };

// The year/semester the student is in. Without a saved choice: year 1, and the
// semester by the Israeli academic calendar (A ≈ Oct–Feb, B ≈ Mar–Sep).
export async function selectedTerm(): Promise<Term> {
  const raw = (await cookies()).get(TERM_COOKIE)?.value ?? "";
  const m = /^([1-4])([AB])$/.exec(raw);
  if (m) return { year: Number(m[1]) as Term["year"], semester: m[2] as Term["semester"], chosen: true };
  const month = new Date().getMonth() + 1;
  return { year: 1, semester: month >= 3 && month <= 9 ? "B" : "A", chosen: false };
}
