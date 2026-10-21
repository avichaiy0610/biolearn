import type { CourseScope, ScopeEntry } from "./types";
import { technionGeneticsScope } from "./technion-genetics";
import { tauGeneticsScope } from "./tau-genetics";
import { technionBiochemIntroScope } from "./technion-biochem-intro";
import { technionMetabolicScope } from "./technion-metabolic";
import { technionMolecularScope } from "./technion-molecular";
import { technionCellScope } from "./technion-cell";

export const COURSE_SCOPES: CourseScope[] = [technionGeneticsScope, tauGeneticsScope, technionBiochemIntroScope, technionMetabolicScope, technionMolecularScope, technionCellScope];

export const scopeForCourse = (courseSlug: string) => COURSE_SCOPES.find((s) => s.courseSlug === courseSlug);

/** Scope of one lesson section in a course; a section with no entry counts as not verified. */
export function sectionScope(courseSlug: string, lessonSlug: string, sectionId: string): ScopeEntry | null {
  const c = scopeForCourse(courseSlug);
  if (!c) return null; // course not audited yet — show nothing rather than a guess
  return c.sections[lessonSlug]?.[sectionId] ?? { level: "extension", evidence: "none", noteHe: "אין מסמך של הקורס שמכסה את הנושא הזה" };
}
