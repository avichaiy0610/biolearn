import type { CoursePlan, PlanItem, PlanSession } from "./types";
import type { Lesson } from "../lessons/types";
import { molNucleicAcids } from "../lessons/technion-molecular/mol-nucleic-acids";
import { molChromatin } from "../lessons/technion-molecular/mol-chromatin";
import { molReplicationFork } from "../lessons/technion-molecular/mol-replication-fork";
import { molReplicationOrigins } from "../lessons/technion-molecular/mol-replication-origins";
import { molRepair } from "../lessons/technion-molecular/mol-repair";
import { molRecombination } from "../lessons/technion-molecular/mol-recombination";
import { molTranscriptionProk } from "../lessons/technion-molecular/mol-transcription-prok";
import { molTranscriptionEuk } from "../lessons/technion-molecular/mol-transcription-euk";
import { molRnaProcessing } from "../lessons/technion-molecular/mol-rna-processing";
import { molGeneticCode } from "../lessons/technion-molecular/mol-genetic-code";
import { molRibosomeInitiation } from "../lessons/technion-molecular/mol-ribosome-initiation";
import { molTranslationElongation } from "../lessons/technion-molecular/mol-translation-elongation";

// Technion 01340082 "ביולוגיה מולקולרית" — built with the course-track-builder skill, no insider input.
// Topics: the CURRENT syllabus on the Technion students portal (topics only, no weeks), in its own order.
// Lecture order: no public schedule (Moodle is closed to guests; lecturer: Prof. Yoav Arava) — the syllabus
// order, which follows the central dogma and the course textbook (Lewin's Genes XII). The Faculty of
// Medicine's parallel course (274243, "no extra credit" pair) publishes a weekly table in the same order —
// evidence only, not this course's schedule.
// Tutorials: no source — "practice for lecture n", built from each unit's worked problems.

const M = "molecular-biology";
const proc = (slug: string): PlanItem => ({ kind: "process", topic: M, slug });
const sec = (l: Lesson, ...ids: string[]): PlanItem[] => (ids.length ? ids.map((section) => ({ kind: "lesson" as const, slug: l.slug, section })) : [{ kind: "lesson", slug: l.slug }]);
const probs = (l: Lesson, ...ids: string[]): PlanItem[] =>
  (l.workedProblems ?? []).filter((w) => !ids.length || ids.includes(w.id)).map((w) => ({ kind: "lesson" as const, slug: l.slug, problem: w.id }));

const PORTAL = { labelHe: "הסילבוס בפורטל הטכניון", url: "https://students.technion.ac.il/local/technionsearch/course/134082" };
const MED = { labelHe: "הקורס המקביל ברפואה (274243) — ראיה בלבד", url: "https://md.technion.ac.il/wp-content/uploads/2024/05/סיליבוס-מנגנוני-בקרה-מולקולרית-274243-חורף-תשפד-12-שבועות.pdf" };

const LECTURES: { titleHe: string; items: PlanItem[]; practice: PlanItem[] }[] = [
  { titleHe: "חומצות גרעין: אבני הבניין והסליל הכפול", items: sec(molNucleicAcids, "nucleotides", "polynucleotide", "double-helix", "forms"), practice: probs(molNucleicAcids, "chargaff", "complement") },
  { titleHe: "דנטורציה והכלאה, פיתול-על ו-RNA", items: sec(molNucleicAcids, "melting", "supercoiling", "rna"), practice: probs(molNucleicAcids, "linking-number") },
  { titleHe: "אריזת ה-DNA: הנוקלאוזום ורמות הכרומטין", items: sec(molChromatin, "packaging", "nucleosome", "levels"), practice: probs(molChromatin) },
  { titleHe: "אאוכרומטין והטרוכרומטין, צנטרומר וטלומרים", items: sec(molChromatin, "euchromatin", "centromere-telomere", "assembly"), practice: [] },
  { titleHe: "שכפול: חצי-שמרני, DNA פולימראז ומזלג השכפול", items: [...sec(molReplicationFork, "semiconservative", "polymerase", "fork", "enzymes"), proc("dna-replication")], practice: probs(molReplicationFork, "meselson-stahl", "mutant-fork") },
  { titleHe: "הרפליזום, דיוק השכפול, שכפול באאוקריוטים ו-PCR", items: [...sec(molReplicationFork, "replisome", "fidelity", "eukaryotes", "pcr"), proc("pcr")], practice: probs(molReplicationFork, "replication-time", "pcr-cycles") },
  { titleHe: "התחלה וסיום של שכפול; קצות הכרומוזום וטלומראז", items: sec(molReplicationOrigins), practice: probs(molReplicationOrigins) },
  { titleHe: "תיקון DNA", items: [...sec(molRepair), proc("dna-mismatch-repair")], practice: probs(molRepair) },
  { titleHe: "רקומבינציה הומולוגית וספציפית לאתר", items: sec(molRecombination), practice: probs(molRecombination) },
  { titleHe: "שעתוק בחיידקים: RNA פולימראז, פרומוטור וסיום", items: [...sec(molTranscriptionProk), proc("transcription")], practice: probs(molTranscriptionProk) },
  { titleHe: "שעתוק באאוקריוטים: פרומוטור, גורמי שעתוק ומגבירים", items: sec(molTranscriptionEuk), practice: probs(molTranscriptionEuk) },
  { titleHe: "עיבוד ושחבור RNA", items: sec(molRnaProcessing), practice: probs(molRnaProcessing) },
  { titleHe: "הקוד הגנטי ו-tRNA", items: sec(molGeneticCode), practice: probs(molGeneticCode) },
  { titleHe: "הריבוזום ושלבי התרגום: התחלה, הארכה וסיום", items: [...sec(molRibosomeInitiation), ...sec(molTranslationElongation), proc("translation")], practice: [...probs(molRibosomeInitiation), ...probs(molTranslationElongation)] },
];

export const technionMolecularPlan: CoursePlan = {
  courseSlug: "technion-molecular",
  lectureOrder: {
    confidence: "textbook",
    noteHe: "אין לוח הרצאות ציבורי לקורס (אתר הקורס במודל סגור). הסדר כאן הוא סדר הנושאים בסילבוס הרשמי — לפי \"הדוגמה המרכזית\": DNA, שכפול ותיקון, שעתוק ועיבוד, תרגום — והוא גם סדר הפרקים בספר הקורס (Lewin's Genes). גם הקורס המקביל בפקולטה לרפואה (274243) מסודר כך, אבל זה קורס אחר — ראיה בלבד. החלוקה לשבועות בפועל עשויה להיות שונה.",
    links: [PORTAL, MED],
  },
  tutorialOrder: null,
  schedule: "suggested",
  scheduleNoteHe: "הנושאים לפי הסילבוס העדכני של הקורס בפורטל הטכניון (הוא מפרט נושאים, לא שבועות). הפירוט לתת-נושאים לפי ספר הקורס (Lewin's Genes XII), ונבדק מול Alberts.",
  topics: [
    { titleHe: "חומצות גרעין: אבני הבניין", items: sec(molNucleicAcids, "nucleotides", "polynucleotide") },
    { titleHe: "מבנה הדנ\"א", items: sec(molNucleicAcids, "double-helix", "forms", "melting", "supercoiling", "rna") },
    { titleHe: "מבנה הכרומטין בתאים אאוקריוטיים ואריזת הדנ\"א", items: sec(molChromatin) },
    { titleHe: "שכפול דנ\"א", items: [...sec(molReplicationFork), ...sec(molReplicationOrigins), proc("dna-replication"), proc("pcr")] },
    { titleHe: "תיקון ורקומבינציה — מנגנונים ואנזימים", items: [...sec(molRepair), ...sec(molRecombination), proc("dna-mismatch-repair")] },
    { titleHe: "תעתוק — מנגנון ואלמנטים בציס ובטרנס (פרומוטור, רנ\"א פולימרז)", items: [...sec(molTranscriptionProk), ...sec(molTranscriptionEuk), proc("transcription")] },
    { titleHe: "עיבוד ושחבור רנ\"א", items: sec(molRnaProcessing) },
    { titleHe: "תרגום — הקוד הגנטי", items: sec(molGeneticCode, "triplet", "cracking", "wobble", "exceptions") },
    { titleHe: "מבנה הריבוזום", items: sec(molRibosomeInitiation, "structure") },
    { titleHe: "tRNA", items: sec(molGeneticCode, "trna", "synthetases", "fidelity") },
    { titleHe: "שלבי התרגום — התחלה, הארכת החלבון וסיום", items: [...sec(molRibosomeInitiation, "overview", "initiator", "initiation-bacteria", "initiation-eukaryotes", "eif2-control", "polysomes"), ...sec(molTranslationElongation), proc("translation")] },
  ],
  lectures: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.items })),
  tutorials: LECTURES.map((l, i): PlanSession => ({ n: i + 1, titleHe: l.titleHe, items: l.practice })).filter((t) => t.items.length > 0),
};
