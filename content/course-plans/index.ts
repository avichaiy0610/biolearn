import type { CoursePlan } from "./types";
import { technionGeneticsPlan } from "./technion-genetics";

export const COURSE_PLANS: CoursePlan[] = [technionGeneticsPlan];

export const planForCourse = (slug: string) => COURSE_PLANS.find((p) => p.courseSlug === slug);
