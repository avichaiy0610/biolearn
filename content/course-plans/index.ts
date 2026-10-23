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

export const COURSE_PLANS: CoursePlan[] = [technionGeneticsPlan, tauGeneticsPlan, technionBiochemIntroPlan, technionMetabolicPlan, technionMolecularPlan, technionCellPlan, technionGeneExpressionPlan, technionPhysiologyPlan, technionMicroViroPlan, technionPlantPhysiologyPlan, technionBiology1Plan, technionEvolutionPlan, technionZoologyPlan];

export const planForCourse = (slug: string) => COURSE_PLANS.find((p) => p.courseSlug === slug);
