import type { CoursePlan } from "./types";
import { technionGeneticsPlan } from "./technion-genetics";
import { tauGeneticsPlan } from "./tau-genetics";
import { technionBiochemIntroPlan } from "./technion-biochem-intro";
import { technionMetabolicPlan } from "./technion-metabolic";
import { technionMolecularPlan } from "./technion-molecular";
import { technionCellPlan } from "./technion-cell";
import { technionGeneExpressionPlan } from "./technion-gene-expression";
import { technionPhysiologyPlan } from "./technion-physiology";
import { technionMicroViroPlan } from "./technion-micro-viro";
import { technionPlantPhysiologyPlan } from "./technion-plant-physiology";
import { technionBiology1Plan } from "./technion-biology-1";
import { technionEvolutionPlan } from "./technion-evolution";
import { technionZoologyPlan } from "./technion-zoology";
import { technionEndocrinologyPlan } from "./technion-endocrinology";

export const COURSE_PLANS: CoursePlan[] = [technionGeneticsPlan, tauGeneticsPlan, technionBiochemIntroPlan, technionMetabolicPlan, technionMolecularPlan, technionCellPlan, technionGeneExpressionPlan, technionPhysiologyPlan, technionMicroViroPlan, technionPlantPhysiologyPlan, technionBiology1Plan, technionEvolutionPlan, technionZoologyPlan, technionEndocrinologyPlan];

export const planForCourse = (slug: string) => COURSE_PLANS.find((p) => p.courseSlug === slug);

// Number of study units (lessons) a course plan links to, or null without a plan. Plans without lessons count
// their DB readings and animations. The course cards use this instead of the DB unit list, which predates the plans.
export const planUnitCount = (slug: string): number | null => {
  const p = planForCourse(slug);
  if (!p) return null;
  const items = p.topics.flatMap((t) => t.items);
  const lessons = new Set(items.flatMap((i) => (i.kind === "lesson" ? [i.slug] : [])));
  if (lessons.size) return lessons.size;
  return new Set(items.flatMap((i) => (i.kind === "subtopic" ? [`s:${i.id}`] : i.kind === "process" ? [`p:${i.slug}`] : []))).size;
};
