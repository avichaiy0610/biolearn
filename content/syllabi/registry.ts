/* Our courses → official course codes, for scripts/syllabus-fetch.ts.
   Codes come from each university's catalog (sources in content/universities.ts).
   The fetcher checks the course name the source returns against ours and
   reports mismatches, so a stale code is caught rather than trusted.
   Ben-Gurion: the annual course catalog (bgu4u) — code "205.1.1611".
   Haifa: no course codes needed — the biology department's course-list page
   links a PDF syllabus per course; the "code" is the link's course name. */

export type SyllabusTarget = { courseSlug: string; university: "huji" | "tau" | "technion" | "biu" | "bgu" | "haifa"; code: string };

const t = (university: SyllabusTarget["university"], pairs: [string, string][]): SyllabusTarget[] =>
  pairs.map(([courseSlug, code]) => ({ courseSlug, university, code }));

export const SYLLABUS_TARGETS: SyllabusTarget[] = [
  // HUJI — 5-digit codes (catalog, track 4010)
  ...t("huji", [
    ["huji-organism", "72128"], ["huji-cell-intro", "72153"], ["huji-genetics-intro", "72155"],
    ["huji-ecology-intro", "72107"], ["huji-biochem-cell", "72121"], ["huji-plant-intro", "72334"],
    ["huji-physiology-intro", "72336"], ["huji-micro-intro", "72362"], ["huji-molecular", "72332"],
    ["huji-evolution-intro", "72368"], ["huji-cell-adv", "72373"], ["huji-developmental", "72320"],
    ["huji-biochem-adv", "72339"], ["huji-micro-adv", "72342"], ["huji-neuro-phys", "72343"],
    ["huji-genetics-adv", "72345"], ["huji-plant-adv", "72346"], ["huji-neuro", "72369"],
    ["huji-ecology-adv", "72604"], ["huji-immunology", "72665"], ["huji-bioinformatics", "94510"],
  ]),
  // Technion — 6-digit portal codes (catalog 2025/26 uses 8 digits: 01340020 → 134020)
  ...t("technion", [
    ["technion-biology-1", "134058"], ["technion-evolution", "134133"], ["technion-genetics", "134020"],
    ["technion-biochem-intro", "134019"], ["technion-zoology", "134111"], ["technion-metabolic", "134113"],
    ["technion-molecular", "134082"], ["technion-biostatistics", "134154"], ["technion-plant-physiology", "134040"],
    ["technion-cell", "134128"], ["technion-physiology", "134117"], ["technion-gene-expression", "134119"],
    ["technion-micro-viro", "134121"], ["technion-bioinformatics", "136158"], ["technion-developmental", "134069"],
    ["technion-endocrinology", "134155"], ["technion-immunology", "276413"], ["technion-neurobiology", "134157"],
    ["technion-ecology", "134153"], ["technion-virology", "134039"],
  ]),
  // Bar-Ilan — 5-digit codes (2026/27 timetable); syllabi are PDFs on the faculty site
  ...t("biu", [
    ["biu-general-a", "80101"], ["biu-general-b", "80102"], ["biu-cell", "80103"], ["biu-biostatistics", "80150"],
    ["biu-biochem-a", "80201"], ["biu-animal-physiology", "80206"], ["biu-ecology", "80207"], ["biu-genetics", "80208"],
    ["biu-biochem-b", "80202"], ["biu-microbiology", "80203"], ["biu-virology", "80204"], ["biu-immunology", "80210"],
    ["biu-systems-physiology", "80214"], ["biu-plant-physiology", "80223"], ["biu-molecular-a", "80242"],
    ["biu-molecular-b", "80377"], ["biu-cell-function", "80548"], ["biu-bioinformatics", "80513"],
  ]),
  // Ben-Gurion — department.degree.course (shnaton 2025/26 tables)
  ...t("bgu", [
    ["bgu-organisms", "205.1.1821"], ["bgu-cell", "205.1.9011"], ["bgu-plant-sciences", "205.1.1221"],
    ["bgu-microbiology", "205.1.1071"], ["bgu-genetics", "205.1.1611"], ["bgu-ecology", "205.1.3111"],
    ["bgu-molecular", "205.1.3491"], ["bgu-biochem-a", "205.1.9171"], ["bgu-plant-physiology", "205.1.1121"],
    ["bgu-animal-physiology", "205.1.9161"], ["bgu-biochem-b", "205.1.9181"], ["bgu-genetic-engineering", "205.1.9191"],
    ["bgu-evolution", "205.1.3171"], ["bgu-bioinformatics", "205.1.9531"],
  ]),
  // Haifa — course name as linked on the department's course list
  ...t("haifa", [
    ["haifa-cell-b", "ביולוגיה של התא ב"], ["haifa-ecology-evolution", "מבוא לאקולוגיה ואבולוציה"],
    ["haifa-biochem-a", "ביוכימיה א"], ["haifa-biochem-b", "ביוכימיה ב"], ["haifa-molecular", "ביולוגיה מולקולארית"],
    ["haifa-genetics", "גנטיקה כללית"], ["haifa-microbiology", "מיקרוביולוגיה כללית"], ["haifa-neurobiology", "מבוא לנוירוביולוגיה"],
  ]),
  // TAU — 8-digit codes (yedion); the IMS syllabus page takes code + group "01"
  ...t("tau", [
    ["tau-bio-intro-a", "04551512"], ["tau-bio-intro-b", "04551513"], ["tau-bio-intro-c", "04551514"],
    ["tau-genetics", "04552526"], ["tau-evolution", "04552536"], ["tau-ecology", "04551809"],
    ["tau-bioinformatics", "04553066"], ["tau-microbiology", "04552580"], ["tau-neurobiology", "04553237"],
  ]),
];
