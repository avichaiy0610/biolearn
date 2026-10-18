/**
 * Technion biology, general track — electives from the 2025/26 catalog
 * (ugportal catalog2025-26.pdf, faculty of biology pages). The track already
 * has six of the seven "list A" courses (choose 4 of 7); this adds the missing
 * one (molecular biophysics) and the "list B" electives that have biology
 * content on the site (labs, research projects and Eilat courses are left out).
 * Each list-A course's description notes the 4-of-7 rule.
 *
 *   npx tsx scripts/technion-electives-2026-10.ts [--dry-run]
 *   npx tsx scripts/technion-electives-2026-10.ts --rollback .backups/technion-electives-<ts>.json
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

type Unit = { kind: "process"; topic: string; slug: string } | { kind: "subtopic"; topic: string; id: string };
const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const NOW = new Date().toISOString();
const key = (u: Unit) => (u.kind === "process" ? `p:${u.slug}` : `s:${u.id}`);
const dedupe = (us: Unit[]) => us.filter((u, i) => us.findIndex((x) => key(x) === key(u)) === i);
const LIST_A = " (רשימה א' של המגמה הכללית: בוחרים 4 מתוך 7.)";
const LIST_A_EN = " (General track list A: choose 4 of 7.)";

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--rollback") {
    const b = JSON.parse(fs.readFileSync(args[1], "utf8")) as { created: string[]; descs: { slug: string; descHe: string; descEn: string }[] };
    for (const slug of b.created) await db.execute({ sql: `DELETE FROM Course WHERE slug=?`, args: [slug] });
    for (const d of b.descs) await db.execute({ sql: `UPDATE Course SET "descHe"=?, "descEn"=? WHERE slug=?`, args: [d.descHe, d.descEn, d.slug] });
    console.log(`removed ${b.created.length}, restored ${b.descs.length} descriptions`);
    return;
  }
  const courses = (await db.execute(`SELECT slug, units, "descHe", "descEn", year, semester, university FROM Course`)).rows;
  const subs = (await db.execute(`SELECT s.id, s."nameEn", t.slug AS topic FROM Subtopic s JOIN Topic t ON t.id = s."topicId" WHERE s.hidden = 0`)).rows;
  const procs = (await db.execute(`SELECT p.slug, t.slug AS topic FROM Process p JOIN Topic t ON t.id = p."topicId"`)).rows;
  const G = (slug: string): Unit[] => JSON.parse(String(courses.find((c) => c.slug === slug)!.units));
  const T = (topic: string): Unit[] => [
    ...subs.filter((s) => s.topic === topic).map((s) => ({ kind: "subtopic" as const, topic, id: String(s.id) })),
    ...procs.filter((p) => p.topic === topic && !String(p.slug).includes("lncrna")).map((p) => ({ kind: "process" as const, topic, slug: String(p.slug) })),
  ];
  const S = (topic: string, nameEn: string): Unit => {
    const s = subs.find((x) => x.topic === topic && x.nameEn === nameEn);
    if (!s) throw new Error(`subtopic not found: ${nameEn}`);
    return { kind: "subtopic", topic, id: String(s.id) };
  };
  const P = (topic: string, slug: string): Unit => {
    if (!procs.some((p) => p.topic === topic && p.slug === slug)) throw new Error(`process not found: ${slug}`);
    return { kind: "process", topic, slug };
  };
  const PL = (topic: string, prefix: string): Unit => {
    const p = procs.find((x) => x.topic === topic && String(x.slug).startsWith(prefix));
    if (!p) throw new Error(`process not found: ${prefix}*`);
    return { kind: "process", topic, slug: String(p.slug) };
  };

  type C = { slug: string; nameHe: string; nameEn: string; semester: "A" | "B"; kind: "choice" | "elective"; units: Unit[]; descHe: string; descEn: string };
  const NEW: C[] = [
    { slug: "technion-biophysics", nameHe: "ביופיזיקה מולקולרית", nameEn: "Molecular Biophysics", semester: "A", kind: "choice",
      units: [S("biochemistry", "Protein Structure and Function"), P("biochemistry", "enzyme-kinetics"), P("biochemistry", "hemoglobin-oxygen-binding"), PL("molecular-biology", "molecular-recognition"), P("cell-biology", "membrane-transport")],
      descHe: "מבנה ודינמיקה של מקרומולקולות, קישור ליגנדים, קינטיקה ותעבורה דרך ממברנות." + LIST_A, descEn: "Structure and dynamics of macromolecules, ligand binding, kinetics and membrane transport." + LIST_A_EN },
    { slug: "technion-ubiquitin", nameHe: "יוביקוויטין ומיחזור חלבונים", nameEn: "Ubiquitin and Protein Recycling", semester: "A", kind: "elective",
      units: [S("cell-biology", "The Ubiquitin–Proteasome System"), PL("cell-biology", "protein-degradation"), S("cell-biology", "Protein Quality Control: Proteasome vs. Lysosome")],
      descHe: "מערכת יוביקוויטין-פרוטאזום, בקרת איכות של חלבונים ופירוק בליזוזום.", descEn: "The ubiquitin–proteasome system, protein quality control and lysosomal degradation." },
    { slug: "technion-computational", nameHe: "ביולוגיה חישובית", nameEn: "Computational Biology", semester: "A", kind: "elective",
      units: T("bioinformatics"), descHe: "שיטות חישוביות לניתוח רצפים ומערכות ביולוגיות.", descEn: "Computational methods for sequences and biological systems." },
    { slug: "technion-metabolic-disease", nameHe: "מטבוליזם ומחלות באדם", nameEn: "Metabolism and Human Disease", semester: "A", kind: "elective",
      units: dedupe([...G("technion-metabolic"), P("physiology", "blood-glucose-regulation")]), descHe: "מסלולים מטבוליים, בקרתם ומחלות שנובעות מפגיעה בהם.", descEn: "Metabolic pathways, their regulation and the diseases that follow their failure." },
    { slug: "technion-human-genetics", nameHe: "גנטיקה מולקולרית של האדם", nameEn: "Human Molecular Genetics", semester: "A", kind: "elective",
      units: [S("genetics", "Inheritance Patterns"), S("genetics", "Genetic Mutations"), S("genetics", "Genomic Imprinting"), P("genetics", "genomic-imprinting"), S("genetics", "Mitochondrial Inheritance")],
      descHe: "תורשה במשפחות, מוטציות, החתמה גנומית ותורשה מיטוכונדריאלית באדם.", descEn: "Inheritance in families, mutations, genomic imprinting and mitochondrial inheritance in humans." },
    { slug: "technion-pathogens", nameHe: "מיקרוביולוגיה של פתוגנים", nameEn: "Microbiology of Pathogens", semester: "A", kind: "elective",
      units: dedupe([...G("technion-micro-viro"), ...G("immunology").slice(0, 3)]), descHe: "חיידקים ונגיפים גורמי מחלה, ומפגש הפתוגן עם מערכת החיסון.", descEn: "Disease-causing bacteria and viruses, and the pathogen's encounter with the immune system." },
    { slug: "technion-cancer", nameHe: "הביולוגיה של מחלת הסרטן", nameEn: "The Biology of Cancer", semester: "B", kind: "elective",
      units: [S("cell-biology", "Cell Cycle Regulation"), S("cell-biology", "Cellular Stress Response and Apoptosis"), P("cell-biology", "apoptosis"), S("cell-biology", "Cell-Cell Interactions and Signaling"), P("cell-biology", "gpcr-camp-signaling")],
      descHe: "בקרת מחזור התא, אפופטוזיס ואיתות — ומה משתבש בהם בסרטן.", descEn: "Cell-cycle control, apoptosis and signaling — and what goes wrong in cancer." },
    { slug: "technion-stem-cells", nameHe: "תאי גזע", nameEn: "Stem Cells", semester: "B", kind: "elective",
      units: [...T("developmental-biology"), S("cell-biology", "Cell Cycle Regulation")], descHe: "תאי גזע עובריים ובוגרים, התמיינות ושיקום רקמות.", descEn: "Embryonic and adult stem cells, differentiation and tissue repair." },
    { slug: "technion-rna", nameHe: "העולם המודרני של הרנ\"א", nameEn: "The Modern RNA World", semester: "B", kind: "elective",
      units: [P("molecular-biology", "transcription"), P("molecular-biology", "translation"), S("molecular-biology", "Riboswitches"), PL("molecular-biology", "riboswitches"), S("molecular-biology", "Gene Expression")],
      descHe: "תפקידי הרנ\"א בתא: שעתוק, תרגום, ריבוסוויצ'ים ובקרת ביטוי גנים.", descEn: "RNA's roles in the cell: transcription, translation, riboswitches and gene regulation." },
    { slug: "technion-systems", nameHe: "ביולוגיה מערכתית", nameEn: "Systems Biology", semester: "B", kind: "elective",
      units: [P("molecular-biology", "lac-operon"), S("molecular-biology", "Gene Expression"), P("physiology", "blood-glucose-regulation"), S("biochemistry", "Metabolic Regulation and Homeostasis")],
      descHe: "רשתות בקרה, משוב והומאוסטזיס — מהאופרון ועד בקרת הסוכר בדם.", descEn: "Regulatory networks, feedback and homeostasis — from the operon to blood-glucose control." },
    { slug: "technion-drugs", nameHe: "פיתוח תרופות ביולוגיות מודרניות", nameEn: "Modern Biological Drug Development", semester: "B", kind: "elective",
      units: [P("cell-biology", "gpcr-camp-signaling"), P("biochemistry", "enzyme-kinetics"), PL("molecular-biology", "molecular-recognition"), S("immunology", "Adaptive Immunity")],
      descHe: "מטרות לתרופות: קולטנים, אנזימים, זיהוי מולקולרי ונוגדנים.", descEn: "Drug targets: receptors, enzymes, molecular recognition and antibodies." },
  ];

  const listA = ["technion-developmental", "technion-endocrinology", "technion-immunology", "technion-neurobiology", "technion-ecology", "technion-virology"];
  const exists = new Set(courses.map((c) => String(c.slug)));
  const pos = new Map<string, number>();
  for (const c of courses.filter((x) => x.university === "technion")) pos.set(`${c.year}${c.semester}`, (pos.get(`${c.year}${c.semester}`) ?? 0) + 1);
  const created: string[] = [];
  const descs = courses.filter((c) => listA.includes(String(c.slug)) && !String(c.descHe).includes("רשימה א'")).map((c) => ({ slug: String(c.slug), descHe: String(c.descHe), descEn: String(c.descEn) }));
  for (const c of NEW) console.log(`${exists.has(c.slug) ? "exists " : "+ "}${c.slug} (3${c.semester}, ${c.kind}, ${c.units.length} units)`);
  console.log(`list-A descriptions to annotate: ${descs.length}`);
  if (args.includes("--dry-run")) return;

  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `technion-electives-${NOW.replace(/[:.]/g, "-")}.json`);
  for (const c of NEW) {
    if (exists.has(c.slug)) continue;
    const k = `3${c.semester}`, position = pos.get(k) ?? 0;
    pos.set(k, position + 1);
    await db.execute({
      sql: `INSERT INTO Course (slug, "nameHe", "nameEn", year, semester, "descHe", "descEn", units, position, university, kind, "updatedAt") VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [c.slug, c.nameHe, c.nameEn, 3, c.semester, c.descHe, c.descEn, JSON.stringify(dedupe(c.units)), position, "technion", c.kind, NOW],
    });
    created.push(c.slug);
  }
  for (const d of descs) {
    await db.execute({ sql: `UPDATE Course SET "descHe"=?, "descEn"=?, "updatedAt"=? WHERE slug=?`, args: [d.descHe + LIST_A, d.descEn + LIST_A_EN, NOW, d.slug] });
  }
  fs.writeFileSync(file, JSON.stringify({ created, descs }, null, 1));
  console.log(`backup → ${file}; created ${created.length}, annotated ${descs.length}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
