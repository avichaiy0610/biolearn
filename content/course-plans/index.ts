import type { CoursePlan } from "./types";
import { technionGeneticsPlan } from "./technion-genetics";
import { tauGeneticsPlan } from "./tau-genetics";
import { technionBiochemIntroPlan } from "./technion-biochem-intro";
import { technionMetabolicPlan } from "./technion-metabolic";
import { technionMolecularPlan } from "./technion-molecular";
import { technionCellPlan } from "./technion-cell";

export const COURSE_PLANS: CoursePlan[] = [technionGeneticsPlan, tauGeneticsPlan, technionBiochemIntroPlan, technionMetabolicPlan, technionMolecularPlan, technionCellPlan];

export const planForCourse = (slug: string) => COURSE_PLANS.find((p) => p.courseSlug === slug);
