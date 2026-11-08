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
const SPORE = "ספורות בקטריאליות";
const EVO = "אבולוציה וסיסטמטיקה של מיקרואורגניזמים";
const IMM = "מושגי יסוד בתורת החיסון";
const CLIN = "מבוא למיקרוביולוגיה קלינית";

// Staff material found in the Drive (2026-11-08): the spring 2024 syllabus (Prof. Sima Yaron) and a 2025
// student summary of all 14 lectures. Lectures 11, 12 and 14 are the diversity tour (bacteria, archaea,
// eukaryotes), and NEITHER source has an immunology or a clinical-microbiology lecture.
const lect = (n: string, what: string): ScopeEntry => ({
  level: "core", evidence: "staff-material",
  noteHe: `סיכום ההרצאות 2025, הרצאה ${n} — ${what}`,
});
const dropped = (what: string): ScopeEntry => ({
  level: "extension", evidence: "none",
  noteHe: `${what} — מופיע בתיאור הקורס בפורטל, אך לא נמצא לו פרק הוראה עצמאי בסילבוס אביב 2024 ולא בסיכום ההרצאות 2025. לכן הסעיף מסומן כהרחבה; נושאים בודדים מתוך היחידה שכן מתועדים בחומר הקורס נשארים בליבה.`,
});

export const technionMicroViroScope: CourseScope = {
  courseSlug: "technion-micro-viro",
  checkedAt: "2026-11-08",
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
    "mv-endospores": {
      "what": named(SPORE),
      "structure": named(SPORE),
      "resistance": named(SPORE),
      "sporulation": named(SPORE),
      "germination": named(SPORE),
      "significance": heading(SPORE, "המשמעות במזון ובעיקור"),
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
    "mv-diversity": {
      why: lect("11", "מבוא לשונות המיקרוביאלית ולמגבלות המיון"),
      proteobacteria: lect("11", "פרוטאובקטריה ותת-הקבוצות אלפא עד אפסילון"),
      phototrophs: lect("11", "חיידקים פוטוטרופיים סגולים, גופרית ואל-גופרית"),
      chemolithotrophs: lect("11", "חיידקים מחנררים, מתאנוטרופים ומתילוטרופים"),
      vibrio: lect("11", "ויבריו, פוטובקטריום וביולומינסנציה"),
      "gram-positive": lect("11", "גראם-חיוביים דלי GC ועשירי GC"),
      cyanobacteria: lect("11", "ציאנובקטריה, קיבוע חנקן ופרוכלורוקוקוס"),
      archaea: lect("12", "הלופילים, מתאנוגנים והיפר-תרמופילים"),
      eukaryotes: lect("14", "מוצא המיטוכונדריה ושלושת גלי האנדוסימביוזה"),
      asgard: lect("12", "ארכאות אסגארד ומודל שני התחומים"),
    },
    "mv-immunology": {
      "barriers": dropped("מחסומים מולדים"),
      "cells": dropped("תאי מערכת החיסון"),
      "innate": dropped("חסינות מולדת"),
      "adaptive": dropped("חסינות נרכשת"),
      "antibodies": dropped("נוגדנים"),
      "mhc-t": dropped("MHC ותאי T"),
      "memory": dropped("זיכרון חיסוני"),
      "immunity-types": dropped("סוגי חיסונים (ואקצינות)"),
    },
    "mv-clinical": {
      "concepts": dropped("מושגי מארח-פתוגן"),
      "stages": dropped("שלבי ההדבקה"),
      "toxins": dropped("רעלנים"),
      "koch": lect("11", "הנחות קוך ומגבלותיהן — נלמדות בהרצאה, אף שאין פרק קליני נפרד"),
      "lab": dropped("אבחון מעבדתי"),
      "ast": dropped("בדיקת רגישות לאנטיביוטיקה"),
      "immuno-molecular": dropped("שיטות אימונולוגיות ומולקולריות"),
      "hai": dropped("זיהומים במוסדות רפואיים"),
      "epidemiology": dropped("אפידמיולוגיה"),
    },
  },
};
