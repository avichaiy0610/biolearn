import type { CoursePlan } from "./types";
import { technionGeneticsPlan } from "./technion-genetics";
import { tauGeneticsPlan } from "./tau-genetics";
import { technionBiochemIntroPlan } from "./technion-biochem-intro";
import { technionMetabolicPlan } from "./technion-metabolic";
import { technionMolecularPlan } from "./technion-molecular";
import { technionCellPlan } from "./technion-cell";
import { technionGeneExpressionPlan } from "./technion-gene-expression";
import { technionPhysiologyPlan } from "./technion-physiology";

export const COURSE_PLANS: CoursePlan[] = [technionGeneticsPlan, tauGeneticsPlan, technionBiochemIntroPlan, technionMetabolicPlan, technionMolecularPlan, technionCellPlan, technionGeneExpressionPlan, technionPhysiologyPlan];

export const planForCourse = (slug: string) => COURSE_PLANS.find((p) => p.courseSlug === slug);
