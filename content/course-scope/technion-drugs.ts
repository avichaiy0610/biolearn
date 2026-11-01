import type { CourseScope, ScopeEntry } from "./types";

// Evidence: the course's own 2025 syllabus, which lists eleven named topics plus a descriptive
// paragraph (syllabuses/_text/Syllabus Novel Biologicals 2025 HEB.docx.txt). A section is "core" when
// the syllabus names its topic, and "likely" when only the broader paragraph covers it.
// There is no exam for this course (take-home paper), so there is no exam evidence to draw on.
const core = (topic: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: `הסילבוס 2025 מציין במפורש: ${topic}; כאן נלמד המסד המושגי של הנושא.`,
});
const likely = (topic: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `דוגמה מייצגת במסגרת ${topic}; השיטה, המנגנון או הדוגמה אינם מוזכרים בשמם בסילבוס.`,
});
export const technionDrugsScope: CourseScope = {
  courseSlug: "technion-drugs",
  checkedAt: "2026-11-01",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136014" },
  sections: {
    "dg-foundations": { definition: core("הרקע המדעי לפיתוח תרופות ביולוגיות"), discoveries: core("תגליות שהובילו להתפתחות התחום"), comparison: core("מולקולה כימית קטנה לעומת מולקולות ביולוגיות"), biosimilar: likely("מולקולה כימית קטנה לעומת מולקולות ביולוגיות"), choosing: core("מולקולה כימית קטנה לעומת מולקולות ביולוגיות") },
    "dg-principles": { goal: core("יישום המדע הבסיסי לפיתוחים ביוטכנולוגיים"), binding: likely("פיענוח פעילות חלבונים"), function: core("פיענוח פעילות חלבונים"), controls: likely("פיענוח פעילות חלבונים"), hit: likely("זיהוי חומרים בעלי פוטנציאל רפואי") },
    "dg-gleevec": { philadelphia: core("גליבק כדוגמה לפיתוח מולקולה כימית קטנה מכוונת מטרה"), discovery: core("גליבק כדוגמה לפיתוח מולקולה כימית קטנה מכוונת מטרה"), binding: core("גליבק כדוגמה לפיתוח מולקולה כימית קטנה מכוונת מטרה"), clinical: core("גליבק כדוגמה לפיתוח מולקולה כימית קטנה מכוונת מטרה"), resistance: likely("גליבק כדוגמה לפיתוח מולקולה מכוונת מטרה"), lessons: core("גליבק כדוגמה לפיתוח מולקולה כימית קטנה מכוונת מטרה") },
    "dg-targeted-antibodies": { principles: core("נוגדנים כדוגמה למולקולות ביולוגיות מכוונות מטרה"), herceptin: core("נוגדנים מכווני מטרה — דוגמת הרצפטין"), adc: likely("נוגדנים כמולקולות ביולוגיות מכוונות מטרה"), rituximab: core("נוגדנים מכווני מטרה — דוגמת ריטוקסימאב"), beyond: likely("תרופות ביולוגיות במחלות מדבקות, דלקתיות ואוטואימוניות"), summary: core("נוגדנים כדוגמה למולקולות ביולוגיות מכוונות מטרה") },
    "dg-diversity": { natural: core("שונות מולקולרית במערכות ביולוגיות"), space: core("הדרך לחיקוי השונות במבחנה"), design: core("בניית רפרטוארים גדולים במבחנה"), linkage: likely("ביולוגיה קומבינטורית"), representation: likely("בניית רפרטוארים גדולים במבחנה") },
    "dg-display": { phage: likely("בניית רפרטוארים גדולים במבחנה לבידוד מולקולות ביולוגיות"), selection: core("בניית רפרטוארים גדולים במבחנה לבידוד מולקולות ביולוגיות"), bias: likely("ביולוגיה קומבינטורית"), platforms: likely("ביולוגיה קומבינטורית"), validation: likely("פיענוח פעילות חלבונים") },
    "dg-antibodies": { formats: core("הנדסת חלבונים"), avidity: likely("הנדסת חלבונים"), humanization: likely("הנדסת חלבונים"), fc: likely("הנדסת חלבונים"), developability: likely("שיפורם של חומרים בעלי פוטנציאל רפואי") },
    "dg-evolution": { rational: core("הנדסת חלבונים"), cycle: core("אבולוציה מולקולרית במבחנה לשיפור והנדסת חלבונים"), landscape: likely("אבולוציה מולקולרית במבחנה"), mapping: core("פיענוח פעילות חלבונים"), tradeoffs: likely("שיפורם של חומרים בעלי פוטנציאל רפואי") },
    "dg-combinatorial": { chemistry: likely("ביולוגיה וכימיה קומבינטורית"), "split-pool": likely("כימיה קומבינטורית"), decoding: likely("כימיה קומבינטורית כאמצעי לזיהוי חומרים"), del: likely("כימיה קומבינטורית"), validation: likely("זיהוי חומרים בעלי פוטנציאל רפואי") },
    "dg-engineered-t-cells": { "why-cells": core("הנדסה תאית ומניפולציות תאיות"), "tcr-recognition": core("הנדסה תאית ומניפולציות תאיות"), history: core("ההיסטוריה והמהפכה בשימוש תאי T מהונדסים"), generations: core("ההיסטוריה והמהפכה בשימוש תאי T מהונדסים"), manufacturing: likely("הנדסה תאית ומניפולציות תאיות"), clinical: likely("המהפכה בשימוש תאי T מהונדסים"), toxicity: likely("המהפכה בשימוש תאי T מהונדסים"), solid: likely("המהפכה בשימוש תאי T מהונדסים"), comparison: core("הנדסה תאית ומניפולציות תאיות") },
    "dg-immunotherapy": { modulation: core("אימונותרפיה של סרטן כמקרה מייצג של פעילות מולקולות ביולוגיות: אימונומודולציה"), checkpoints: core("אימונומודולציה ונוגדנים מודולטוריים"), clinic: core("ההתקדמות בתרופות ביולוגיות לאונקולוגיה"), biomarkers: likely("אימונותרפיה של סרטן"), iraes: likely("אימונותרפיה של סרטן"), engagers: likely("גישות המאפשרות מניפולציה והנדוס של מערכת החיסון"), cytokines: likely("אימונומודולציה"), tgn1412: likely("פיתוח נוגדנים מודולטוריים"), summary: core("פעילות מולקולות ביולוגיות: אימונומודולציה") },
    "dg-personalized": { genome: core("הגנום האנושי ומהפכת הרפואה המותאמת אישית"), pcsk9: likely("הגנום האנושי לפיתוח תרופות ביולוגיות חדשניות"), "tumor-genome": core("מהפכת הרפואה המותאמת אישית"), pharmacogenomics: likely("הרפואה המותאמת אישית"), bespoke: core("הגנום האנושי לפיתוח תרופות ביולוגיות חדשניות"), limits: likely("הרפואה המותאמת אישית"), summary: core("הגנום האנושי ומהפכת הרפואה המותאמת אישית") },
    "dg-translation": { uses: core("מעבר טכנולוגיה מהמעבדה למיטת החולה"), diagnostic: core("שיטות דיאגנוסטיקה חדשניות"), metrics: likely("שיטות דיאגנוסטיקה חדשניות"), therapy: likely("פיתוח תרופות חדשות"), evidence: core("מעבר טכנולוגיה מהמעבדה למיטת החולה") },
  },
};
