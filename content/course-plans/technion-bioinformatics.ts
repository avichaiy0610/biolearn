import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { biDatabases } from "../lessons/technion-bioinformatics/bi-databases";
import { biRBasics } from "../lessons/technion-bioinformatics/bi-r-basics";
import { biPairwise } from "../lessons/technion-bioinformatics/bi-pairwise";
import { biBlast } from "../lessons/technion-bioinformatics/bi-blast";
import { biMsa } from "../lessons/technion-bioinformatics/bi-msa";
import { biSequencing } from "../lessons/technion-bioinformatics/bi-sequencing";
import { biRnaseq } from "../lessons/technion-bioinformatics/bi-rnaseq";
import { biStatsExploration } from "../lessons/technion-bioinformatics/bi-stats-exploration";
import { biEnrichment } from "../lessons/technion-bioinformatics/bi-enrichment";
import { biProteinStructure } from "../lessons/technion-bioinformatics/bi-protein-structure";
import { biRnaStructure } from "../lessons/technion-bioinformatics/bi-rna-structure";
import { biNetworks } from "../lessons/technion-bioinformatics/bi-networks";
import { biProject } from "../lessons/technion-bioinformatics/bi-project";

// Technion 01360158 "שיטות בביואינפורמטיקה למדעי החיים" (Biology faculty, 2.5 points: 2h lecture + 1h tutorial;
// required, year 3) — the same course as the old code 134158 ("no extra credit" pair, same faculty). Built with the
// course-track-builder skill, no insider input. Lecturer: Prof. Yael Mandel-Gutfreund (2025–2027; with Dor Shalev in
// 2027); TA Hiba Hasanin. Prerequisite 134082 molecular biology, concurrent 134119. Evidence: the CURRENT portal
// paragraph and its six learning outcomes only — no books listed, Moodle closed to guests, no detailed syllabus found
// (searched 2026-10-26). Parallel evidence (NOT this course): CS 236523 Intro to Bioinformatics (which the lecturer
// taught earlier: BLAST, PAM/BLOSUM, E-values, PSI-BLAST, secondary-structure prediction) and TAU 0455.3066 (R).
// Scope (step 5a), reviewed by Codex before writing (2026-10-26): 13 compact units, a TOOLS course for biologists —
// interpretation over algorithms (one small DP matrix only), one programmatic route per task, phylogeny only as
// "reading a tree" inside the MSA unit, variants merged into the sequencing unit, a project/reproducibility unit added
// (portal outcomes 5–6). RNA-seq, statistics/exploration, enrichment and RNA structure are PROVISIONAL: plausible
// applications of the portal text, not confirmed weekly topics.
export const BIOINFORMATICS_LESSONS: Lesson[] = [biDatabases, biRBasics, biPairwise, biBlast, biMsa, biSequencing, biRnaseq,
  biStatsExploration, biEnrichment, biProteinStructure, biRnaStructure, biNetworks, biProject];

const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson): PlanItem[] => (l.workedProblems ?? []).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/136158" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = BIOINFORMATICS_LESSONS.map((l) => ({
  titleHe: l.titleHe, items: sec(l), practice: probs(l),
}));

export const technionBioinformaticsPlan: CoursePlan = {
  courseSlug: "technion-bioinformatics",
  lectureOrder: {
    confidence: "suggested",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור, ולא נמצא סילבוס מפורט). הסדר כאן הוא סדר לימוד מוצע של הנושאים שבתיאור הקורס: מאגרים ו-R, ניתוח רצפים, נתוני ריצוף וניתוח סטטיסטי, חיזוי מבנה, רשתות, ופרויקט. ארבע יחידות (RNA-seq, סטטיסטיקה, העשרה, מבנה RNA) הן יישומים סבירים של התיאור — לא נושאים שאושרו.",
    links: [PORTAL],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי תיאור הקורס בפורטל הטכניון (2.5 נקודות זכות: 2 שעות הרצאה ושעת תרגול). בפורטל לא רשומים ספרים; הפירוט לפי הספרות המקצועית של כל כלי. התרגולים מוצגים כ\"תרגול על הרצאה n\".",
  topics: [
    { titleHe: "כלים מרכזיים בביואינפורמטיקה; גישה למאגרים של נתוני ענק בביולוגיה וברפואה", items: [...sec(biDatabases), ...sec(biSequencing, "clinical")] },
    { titleHe: "שימוש בשפת התכנות R לשאלות ביואינפורמטיות", items: sec(biRBasics) },
    { titleHe: "ייצוג ואחזור רצפי חומצות גרעין וחלבונים", items: [...sec(biDatabases, "formats", "programmatic"), ...sec(biPairwise), ...sec(biBlast), ...sec(biMsa)] },
    { titleHe: "רצפים מנתוני ריצוף", items: [...sec(biSequencing, "technologies", "fastq", "mapping", "coverage", "vcf", "browser"), ...sec(biRnaseq)] },
    { titleHe: "ניתוח תוצאות בכלים סטטיסטיים מתאימים", items: [...sec(biStatsExploration), ...sec(biEnrichment)] },
    { titleHe: "ניבוי מבני של מולקולות ביולוגיות", items: [...sec(biProteinStructure), ...sec(biRnaStructure)] },
    { titleHe: "ניתוח רשתות ביולוגיות", items: sec(biNetworks) },
    { titleHe: "תכנון וביצוע פרויקט בביואינפורמטיקה והצגתו", items: sec(biProject) },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
