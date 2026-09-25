/* Seed for the course track. The live structure is in the DB (Course table,
   edited in /admin/courses); this file seeds it via
   scripts/create-course-table.ts and is the fallback if the table is empty.

   Course-track view: the site's content organized as a generic Israeli B.Sc.
   biology program (year / semester / course). Course names and placement are
   the common ones across universities, not any single institution's catalog.
   Units reference existing content by id (subtopics) or slug (processes), so
   names come live from the DB and hidden content is skipped automatically. */

export type CourseUnit =
  | { kind: "subtopic"; topic: string; id: string }
  | { kind: "process"; topic: string; slug: string };

export type Course = {
  slug: string;
  nameHe: string;
  nameEn: string;
  year: 1 | 2 | 3 | 4;
  semester: "A" | "B";
  descHe: string;
  descEn: string;
  topics: string[]; // topic slugs whose guides / glossary / question bank apply
  units: CourseUnit[];
};

const sub = (topic: string, id: string): CourseUnit => ({ kind: "subtopic", topic, id });
const proc = (topic: string, slug: string): CourseUnit => ({ kind: "process", topic, slug });

export const COURSES: Course[] = [
  {
    slug: "cell-biology-a",
    nameHe: "ביולוגיה של התא א'",
    nameEn: "Cell Biology A",
    year: 1, semester: "A",
    descHe: "מבנה התא האאוקריוטי: אברונים, קרומים ותעבורה, שלד התא ומקור התא האאוקריוטי.",
    descEn: "The eukaryotic cell: organelles, membranes and transport, the cytoskeleton and eukaryotic origins.",
    topics: ["cell-biology"],
    units: [
      sub("cell-biology", "cmq0ts5q9000s8s4mbxqp22fl"), // organelles
      sub("cell-biology", "cmq0ts5q9000u8s4mhr69ttz9"), // membrane & transport
      sub("cell-biology", "cmq3j1poq000004leyncbwyr9"), // cytoskeleton
      sub("cell-biology", "cmq3j1ur7000404lemmc573ip"), // eukaryotic cell evolution
    ],
  },
  {
    slug: "cell-biology-b",
    nameHe: "ביולוגיה של התא ב'",
    nameEn: "Cell Biology B",
    year: 1, semester: "B",
    descHe: "מחזור התא ובקרתו, מיטוזה, תקשורת בין תאים, אפופטוזיס ופירוק חלבונים.",
    descEn: "The cell cycle and its control, mitosis, cell signaling, apoptosis and protein degradation.",
    topics: ["cell-biology"],
    units: [
      sub("cell-biology", "cmq0ts5q9000t8s4mm3v45c8j"), // cell cycle & mitosis
      proc("cell-biology", "mitosis"),
      sub("cell-biology", "cmq3ig4as000004l2d2aszt82"), // cell-cycle regulation
      sub("cell-biology", "cmq3j1qmr000104leo6jjpdsz"), // cell–cell signaling
      sub("cell-biology", "cmq3j1rbr000204lej9uwuq28"), // stress & apoptosis
      sub("cell-biology", "cmq6nl6eu000004jr4qri9jh2"), // UPS
      proc("cell-biology", "protein-degradation-and-ubiquitin-proteasome-system-animation-1780958699914"),
      sub("cell-biology", "cmq508lsi000304l5a0q3757b"), // protein QC
    ],
  },
  {
    slug: "genetics",
    nameHe: "גנטיקה",
    nameEn: "Genetics",
    year: 1, semester: "B",
    descHe: "תורשה מנדלית ולא-מנדלית, מיוזה, גנים הקשורים למין, מוטציות והחתמה גנומית.",
    descEn: "Mendelian and non-Mendelian inheritance, meiosis, sex linkage, mutations and genomic imprinting.",
    topics: ["genetics"],
    units: [
      sub("genetics", "cmq0ts4lp00018s4midich93z"), // Mendelian
      proc("genetics", "mendelian-genetics-animation-1780786392025"),
      sub("genetics", "cmq0ts4lp00028s4ma2ctk1k2"), // inheritance patterns
      proc("genetics", "meiosis"),
      sub("genetics", "cmq508fue000104l5g6ct27dj"), // incomplete & co-dominance
      sub("genetics", "cmq2y4wry000i04i9azzkiopo"), // non-Mendelian
      sub("genetics", "cmq508eeo000004l5m6pxii87"), // polygenic
      sub("genetics", "cmq508gzr000204l5716fu5z4"), // sex-linked
      sub("genetics", "cmq2y4zcn000j04i9dzzev2af"), // mitochondrial
      sub("genetics", "cmq2y4ufe000h04i9ruo77nn6"), // imprinting
      sub("genetics", "cmq0ts4lp00038s4mthsjzur8"), // mutations
    ],
  },
  {
    slug: "molecular-biology",
    nameHe: "ביולוגיה מולקולרית",
    nameEn: "Molecular Biology",
    year: 2, semester: "A",
    descHe: "מבנה ה-DNA, שכפול, שעתוק, תרגום, בקרת ביטוי גנים ושיטות כמו PCR.",
    descEn: "DNA structure, replication, transcription, translation, gene regulation and methods such as PCR.",
    topics: ["molecular-biology"],
    units: [
      sub("molecular-biology", "cmq0ts51u00098s4mtwy4vd4k"), // DNA structure
      proc("molecular-biology", "dna-replication"),
      sub("molecular-biology", "cmq0ts51u000a8s4ml2iihx29"), // central dogma
      proc("molecular-biology", "transcription"),
      proc("molecular-biology", "translation"),
      sub("molecular-biology", "cmq3elr4m000c04joltltpj6z"), // gene expression
      sub("molecular-biology", "cmq3elpug000604joulufrbkk"), // riboswitches
      sub("molecular-biology", "cmq0ts51u000b8s4md085rv0s"), // PCR
      proc("molecular-biology", "pcr"),
    ],
  },
  {
    slug: "biochemistry-a",
    nameHe: "ביוכימיה א'",
    nameEn: "Biochemistry A",
    year: 2, semester: "A",
    descHe: "מבנה ותפקוד של חלבונים, אנזימים וקינטיקה, ביואנרגטיקה, גליקוליזה ונשימה תאית.",
    descEn: "Protein structure and function, enzymes and kinetics, bioenergetics, glycolysis and respiration.",
    topics: ["biochemistry"],
    units: [
      sub("biochemistry", "cmq5cko5l000004ldy3umhmv0"), // proteins
      sub("biochemistry", "cmq0ts64y00128s4mpkala89o"), // enzymes
      sub("biochemistry", "cmq0ts64y00138s4mh91usjpm"), // ATP
      proc("biochemistry", "glycolysis"),
      proc("biochemistry", "cellular-respiration"),
      sub("cell-biology", "cmq3j1twn000304leyzpaw2t7"), // cellular metabolism
    ],
  },
  {
    slug: "biochemistry-b",
    nameHe: "ביוכימיה ב'",
    nameEn: "Biochemistry B",
    year: 2, semester: "B",
    descHe: "ליפידים וקרומים, חומצות גרעין, ובקרה ואינטגרציה של המטבוליזם.",
    descEn: "Lipids and membranes, nucleic acids, and regulation and integration of metabolism.",
    topics: ["biochemistry"],
    units: [
      sub("biochemistry", "cmq4zr0l2000204jsi5a0iyg2"), // lipids & membranes
      sub("biochemistry", "cmq4e1clo000004l27xv2ks2q"), // nucleic acids
      sub("biochemistry", "cmq4dps4u000204l2eqafip01"), // metabolic regulation
    ],
  },
  {
    slug: "microbiology",
    nameHe: "מיקרוביולוגיה",
    nameEn: "Microbiology",
    year: 2, semester: "B",
    descHe: "מבנה וגדילה של חיידקים, וירוסים ומחזורי חיים ויראליים, ומפגש הפתוגן עם מערכת החיסון.",
    descEn: "Bacterial structure and growth, viruses and viral life cycles, and host immunity to pathogens.",
    topics: ["microbiology"],
    units: [
      sub("microbiology", "cmq0ts6jb00198s4mv9gdcqzo"), // bacteria
      proc("microbiology", "bacteria-structure-animation-1780781194821"),
      sub("microbiology", "cmq0ts6jb001a8s4mer6pjk5p"), // viruses
      sub("microbiology", "cmq0ts6jb001b8s4miy0j9s78"), // immune system
    ],
  },
  {
    slug: "physiology",
    nameHe: "פיזיולוגיה של האדם",
    nameEn: "Human Physiology",
    year: 2, semester: "B",
    descHe: "העברת אותות בתאי עצב ופוטנציאל פעולה, ומערכת הלב וכלי הדם.",
    descEn: "Neuronal signaling and the action potential, and the cardiovascular system.",
    topics: ["physiology"],
    units: [
      sub("physiology", "cmq0ts6uc001d8s4m2v0hpxxj"), // action potential
      sub("physiology", "cmq0ts6uc001e8s4mm56w2k4t"), // cardiovascular
      proc("physiology", "cardiovascular-animation-1780821487918"),
    ],
  },
  {
    slug: "immunology",
    nameHe: "אימונולוגיה",
    nameEn: "Immunology",
    year: 3, semester: "A",
    descHe: "חסינות מולדת ונרכשת, זיהוי פתוגנים, לימפוציטים B ו-T ונוגדנים.",
    descEn: "Innate and adaptive immunity, pathogen recognition, B and T lymphocytes and antibodies.",
    topics: ["immunology", "microbiology"],
    units: [
      sub("immunology", "cmq3icr9l000104l5ijpw3sio"), // innate
      sub("immunology", "cmq3icr9l000204l50pd57zwb"), // adaptive
      sub("microbiology", "cmq0ts6jb001b8s4miy0j9s78"), // immune system overview
    ],
  },
];

export const courseBySlug = (slug: string) => COURSES.find((c) => c.slug === slug);

export const SEMESTER_LABEL = {
  he: { A: "סמסטר א'", B: "סמסטר ב'" },
  en: { A: "Semester A", B: "Semester B" },
} as const;

export const YEAR_LABEL = {
  he: { 1: "שנה א'", 2: "שנה ב'", 3: "שנה ג'", 4: "שנה ד'" },
  en: { 1: "Year 1", 2: "Year 2", 3: "Year 3", 4: "Year 4" },
} as const;
