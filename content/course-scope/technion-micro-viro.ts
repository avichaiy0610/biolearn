import type { CourseScope, ScopeEntry } from "./types";

// Technion 134121 "מיקרוביולוגיה ווירולוגיה". Evidence available (2026-10-22): the official topic list on the
// students portal (13 headings, no subtopics), Moodle closed to guests. With headings only, a section is "core" when a
// heading names it in its own words (history, prokaryotic structure, resistance, nutrient cycles, viruses/phages,
// gene transfer, systematics…) and "likely" when it only falls under a broader heading.

const named = (topic: string, what?: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: what ? `הסילבוס הרשמי: "${topic}" — ${what}` : `הסילבוס הרשמי: "${topic}"`,
});
const heading = (topic: string, what: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `נכלל בכותרת הסילבוס "${topic}", אבל ${what} לא מוזכר בשמו`,
});

// Official topics (verbatim, from the portal).
const HIST = "מיקרוביולוגיה באספקט היסטורי";
const METH = "חידושים ושיטות במאה העשרים ואחת";
const CELL = "תאים פרוקריוטים - מבנה ותפקוד";
const ENV = "השפעת גורמים כימופיסיקליים על גידול וקיום";
const RES = "מיקרואורגניזמים ופיתוח מנגנוני עמידות";
const META = "שונות מטבולית והשתלבות במחזור החומרים בטבע";
const ECO = "אקולוגיה מיקרוביאלית";
const VIR = "מבנה, תפקוד ומסלולי הדבקה של וירוסים ובקטריופאג'ים";
const HGT = "העברת חומר גנטי בחיידקים";
// "ספורות בקטריאליות" — no unit of its own yet; endospore killing is under ENV in mv-environment.
const EVO = "אבולוציה וסיסטמטיקה של מיקרואורגניזמים";
const IMM = "מושגי יסוד בתורת החיסון";
const CLIN = "מבוא למיקרוביולוגיה קלינית";

export const technionMicroViroScope: CourseScope = {
  courseSlug: "technion-micro-viro",
  checkedAt: "2026-10-22",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134121" },
  sections: {
    "mv-history": {
      "first-seen": named(HIST),
      "staining": heading(HIST, "צביעת גראם"),
      "spontaneous-generation": named(HIST),
      "germ-theory": named(HIST),
      "pure-culture": named(HIST),
      "environmental": named(HIST),
      "modern": named(HIST),
    },
    "mv-methods": {
      "plate-anomaly": named(METH),
      "16s": named(METH),
      "fish": named(METH),
      "metagenomics": named(METH),
      "activity": named(METH),
      "new-cultivation": named(METH),
      "microscopy": heading(METH, "מיקרוסקופיה"),
    },
    "mv-cell-envelope": {
      "size-shape": named(CELL),
      "membrane": named(CELL),
      "transport": named(CELL, "תפקוד"),
      "peptidoglycan": named(CELL),
      "gram-positive": named(CELL),
      "gram-negative": named(CELL),
      "unusual": heading(CELL, "מעטפות של ארכאונים ומיקופלזמה"),
    },
    "mv-surface-motility": {
      "capsule": named(CELL),
      "pili": named(CELL),
      "inclusions": named(CELL),
      "flagellum": named(CELL),
      "surface-motility": heading(CELL, "תנועה על משטחים"),
      "chemotaxis": heading(CELL, "כימוטקסיס"),
    },
    "mv-growth": {
      "media": heading(ENV, "מצעי גידול"),
      "division": named(CELL, "תפקוד"),
      "counting": heading(ENV, "ספירת תאים"),
      "exponential": named(ENV, "גידול"),
      "growth-curve": named(ENV, "גידול"),
      "chemostat": heading(ENV, "הכמוסטט"),
    },
    "mv-environment": {
      "temperature": named(ENV),
      "ph": named(ENV),
      "water": named(ENV),
      "oxygen": named(ENV),
      "control-terms": named(ENV, "קיום"),
      "physical-control": named(ENV),
      "chemical-control": named(ENV),
    },
    "mv-antibiotics": {
      "selective-toxicity": named(RES),
      "targets": named(RES),
      "mechanisms": named(RES),
      "spread": named(RES),
      "tolerance": heading(RES, "סבילות ותאים רדומים"),
      "countermeasures": heading(RES, "דרכים להתמודדות עם עמידות"),
    },
    "mv-metabolic-diversity": {
      "classes": named(META),
      "redox-tower": named(META),
      "fermentation": named(META),
      "respiration": named(META),
      "chemolithotrophy": named(META),
      "phototrophy": named(META),
    },
    "mv-nutrient-cycles": {
      "carbon": named(META),
      "nitrogen": named(META),
      "nitrogenase": heading(META, "מנגנון הניטרוגנאז"),
      "sulfur": named(META),
      "redox-zones": named(META),
      "human-impact": heading(META, "השפעת האדם"),
    },
    "mv-ecology": {
      "concepts": named(ECO),
      "biofilm": named(ECO),
      "quorum-sensing": heading(ECO, "חישת מניין"),
      "symbiosis": named(ECO),
      "microbiome": heading(ECO, "המיקרוביום של האדם"),
      "applied": heading(ECO, "יישומים"),
    },
    "mv-viruses": {
      "nature": named(VIR),
      "structure": named(VIR),
      "baltimore": heading(VIR, "סיווג בולטימור"),
      "cycle": named(VIR),
      "quantification": heading(VIR, "כימות וירוסים"),
      "examples": named(VIR),
      "infection-types": named(VIR),
      "antivirals": heading(VIR, "תרופות אנטי-ויראליות"),
      "subviral": heading(VIR, "ויראידים ופריונים"),
    },
    "mv-phages": {
      "structure": named(VIR),
      "lytic": named(VIR),
      "lysogeny": named(VIR),
      "lysogenic-conversion": named(VIR),
      "defenses": heading(VIR, "הגנות החיידק מפני פאג'ים"),
      "applications": heading(VIR, "יישומי פאג'ים"),
    },
    "mv-gene-transfer": {
      "mutants": heading(HGT, "מוטנטים וברירה"),
      "transformation": named(HGT),
      "transduction": named(HGT),
      "conjugation": named(HGT),
      "plasmids": named(HGT),
      "transposons": named(HGT),
      "hgt-significance": named(HGT),
    },
    "mv-evolution": {
      "early-earth": named(EVO),
      "oxygen": named(EVO),
      "three-domains": named(EVO),
      "endosymbiosis": named(EVO),
      "mechanisms": named(EVO),
      "hgt": named(EVO),
      "phylogeny": named(EVO),
      "systematics": named(EVO),
    },
    "mv-immunology": {
      "barriers": named(IMM),
      "cells": named(IMM),
      "innate": named(IMM),
      "adaptive": named(IMM),
      "antibodies": named(IMM),
      "mhc-t": named(IMM),
      "memory": named(IMM),
      "immunity-types": heading(IMM, "סוגי חיסונים (ואקצינות)"),
    },
    "mv-clinical": {
      "concepts": named(CLIN),
      "stages": named(CLIN),
      "toxins": heading(CLIN, "רעלנים"),
      "koch": named(CLIN),
      "lab": named(CLIN),
      "ast": named(CLIN),
      "immuno-molecular": named(CLIN),
      "hai": heading(CLIN, "זיהומים במוסדות רפואיים"),
      "epidemiology": heading(CLIN, "אפידמיולוגיה"),
    },
  },
};
