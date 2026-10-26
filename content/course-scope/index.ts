import type { CourseScope, ScopeEntry } from "./types";
import { technionGeneticsScope } from "./technion-genetics";
import { tauGeneticsScope } from "./tau-genetics";
import { technionBiochemIntroScope } from "./technion-biochem-intro";
import { technionMetabolicScope } from "./technion-metabolic";
import { technionMolecularScope } from "./technion-molecular";
import { technionCellScope } from "./technion-cell";
import { technionGeneExpressionScope } from "./technion-gene-expression";
import { technionPhysiologyScope } from "./technion-physiology";
import { technionMicroViroScope } from "./technion-micro-viro";
import { technionPlantPhysiologyScope } from "./technion-plant-physiology";
import { technionBiology1Scope } from "./technion-biology-1";
import { technionEvolutionScope } from "./technion-evolution";
import { technionZoologyScope } from "./technion-zoology";
import { technionEndocrinologyScope } from "./technion-endocrinology";
import { technionImmunologyScope } from "./technion-immunology";
import { technionDevelopmentalScope } from "./technion-developmental";
import { technionEcologyScope } from "./technion-ecology";
import { technionNeurobiologyScope } from "./technion-neurobiology";
import { technionRnaScope } from "./technion-rna";
import { technionUbiquitinScope } from "./technion-ubiquitin";
import { technionDrugsScope } from "./technion-drugs";
import { technionBiostatisticsScope } from "./technion-biostatistics";
import { technionVirologyScope } from "./technion-virology";
import { technionBioinformaticsScope } from "./technion-bioinformatics";

export const COURSE_SCOPES: CourseScope[] = [technionGeneticsScope, tauGeneticsScope, technionBiochemIntroScope, technionMetabolicScope, technionMolecularScope, technionCellScope, technionGeneExpressionScope, technionPhysiologyScope, technionMicroViroScope, technionPlantPhysiologyScope, technionBiology1Scope, technionEvolutionScope, technionZoologyScope, technionEndocrinologyScope, technionImmunologyScope, technionDevelopmentalScope, technionEcologyScope, technionNeurobiologyScope, technionRnaScope, technionUbiquitinScope, technionDrugsScope, technionBiostatisticsScope, technionVirologyScope, technionBioinformaticsScope];

export const scopeForCourse = (courseSlug: string) => COURSE_SCOPES.find((s) => s.courseSlug === courseSlug);

/** Scope of one lesson section in a course; a section with no entry counts as not verified. */
export function sectionScope(courseSlug: string, lessonSlug: string, sectionId: string): ScopeEntry | null {
  const c = scopeForCourse(courseSlug);
  if (!c) return null; // course not audited yet — show nothing rather than a guess
  return c.sections[lessonSlug]?.[sectionId] ?? { level: "extension", evidence: "none", noteHe: "אין מסמך של הקורס שמכסה את הנושא הזה" };
}
