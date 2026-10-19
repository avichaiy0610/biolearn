import type { CoursePlan } from "./types";
import { technionGeneticsPlan } from "./technion-genetics";
import { tauGeneticsPlan } from "./tau-genetics";
import { technionBiochemIntroPlan } from "./technion-biochem-intro";
import { technionMetabolicPlan } from "./technion-metabolic";

export const COURSE_PLANS: CoursePlan[] = [technionGeneticsPlan, tauGeneticsPlan, technionBiochemIntroPlan, technionMetabolicPlan];

export const planForCourse = (slug: string) => COURSE_PLANS.find((p) => p.courseSlug === slug);
