import "server-only";
import { cookies } from "next/headers";
import { GENERAL_UNIVERSITY, UNIVERSITY_COOKIE, universityBySlug, type University } from "@/content/universities";

// The university whose course track the visitor follows: an explicit ?uni=
// (shareable links) wins, then the cookie set by the picker, then the general track.
export async function selectedUniversity(param?: string | string[]): Promise<University> {
  const fromParam = universityBySlug(Array.isArray(param) ? param[0] : param);
  if (fromParam) return fromParam;
  const fromCookie = universityBySlug((await cookies()).get(UNIVERSITY_COOKIE)?.value);
  return fromCookie ?? universityBySlug(GENERAL_UNIVERSITY)!;
}
