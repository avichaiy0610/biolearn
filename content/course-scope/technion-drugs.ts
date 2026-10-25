import type { CourseScope, ScopeEntry } from "./types";

// Evidence: the official topic paragraph, not an inferred weekly syllabus.
// Methods and named molecular mechanisms are illustrative and marked likely.
const core = (topic: string): ScopeEntry => ({
  level: "core", evidence: "syllabus-named",
  noteHe: `תיאור הקורס מציין במפורש: ${topic}; כאן נלמד המסד המושגי של הנושא.`,
});
const likely = (topic: string): ScopeEntry => ({
  level: "likely", evidence: "syllabus-heading",
  noteHe: `דוגמה מייצגת במסגרת ${topic}; השיטה או המנגנון אינם מוזכרים בשמם בתיאור הציבורי.`,
});
export const technionDrugsScope: CourseScope = {
  courseSlug: "technion-drugs",
  checkedAt: "2026-10-25",
  defaultSource: { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136014" },
  sections: {
    "dg-principles": { goal: core("פיתוחים ביוטכנולוגיים"), binding: likely("פיענוח פעילות חלבונים"), function: core("פיענוח פעילות חלבונים"), controls: likely("פיענוח פעילות חלבונים"), hit: likely("חומרים בעלי פוטנציאל רפואי") },
    "dg-diversity": { natural: core("שונות מולקולרית במערכות ביולוגיות"), space: core("שונות מולקולרית וחיקויה במבחנה"), design: core("שונות מולקולרית וחיקויה במבחנה"), linkage: likely("ביולוגיה קומבינטורית"), representation: likely("שונות מולקולרית במבחנה") },
    "dg-display": { phage: likely("ביולוגיה קומבינטורית"), selection: core("ביולוגיה קומבינטורית כאמצעי לפיענוח פעילות חלבונים"), bias: likely("ביולוגיה קומבינטורית"), platforms: likely("ביולוגיה קומבינטורית"), validation: likely("פיענוח פעילות חלבונים") },
    "dg-evolution": { rational: core("הנדסת חלבונים"), cycle: core("חיקוי שונות במבחנה והנדסת חלבונים"), landscape: likely("הנדסת חלבונים"), mapping: core("פיענוח פעילות חלבונים"), tradeoffs: likely("שיפור חומרים בעלי פוטנציאל רפואי") },
    "dg-antibodies": { formats: likely("הנדסת חלבונים"), avidity: likely("הנדסת חלבונים"), humanization: likely("הנדסת חלבונים"), fc: likely("הנדסת חלבונים"), developability: likely("שיפור חומרים בעלי פוטנציאל רפואי") },
    "dg-combinatorial": { chemistry: core("כימיה קומבינטורית"), "split-pool": likely("כימיה קומבינטורית"), decoding: core("כימיה קומבינטורית כאמצעי לזיהוי חומרים"), del: likely("כימיה קומבינטורית"), validation: likely("זיהוי חומרים בעלי פוטנציאל רפואי") },
    "dg-translation": { uses: core("חומרים בעלי פוטנציאל רפואי ושיטות דיאגנוסטיקה"), diagnostic: likely("שיטות דיאגנוסטיקה"), metrics: likely("שיטות דיאגנוסטיקה"), therapy: likely("חומרים בעלי פוטנציאל רפואי"), evidence: core("יישומים רפואיים ודיאגנוסטיים") },
  },
};
