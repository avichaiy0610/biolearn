/**
 * Adds the animations from the September 2026 textbook gap analysis to the
 * course track, and creates the Neurobiology and Endocrinology courses.
 * Appends only units that are missing (admin edits are kept) and never
 * overwrites an existing course.
 *
 *   npx tsx scripts/courses-gap-2026-09.ts            # apply (writes a backup first)
 *   npx tsx scripts/courses-gap-2026-09.ts --dry-run
 *   npx tsx scripts/courses-gap-2026-09.ts --rollback .backups/courses-gap-<ts>.json
 */
import "dotenv/config";
import { createClient, type InStatement } from "@libsql/client";
import fs from "fs";
import path from "path";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const NOW = new Date().toISOString();
type Unit = { kind: "process"; topic: string; slug: string } | { kind: "subtopic"; topic: string; id: string };
const proc = (topic: string, slug: string): Unit => ({ kind: "process", topic, slug });

const ADD: Record<string, Unit[]> = {
  "cell-biology-a": [proc("cell-biology", "membrane-transport"), proc("cell-biology", "secretory-pathway")],
  "cell-biology-b": [proc("cell-biology", "gpcr-camp-signaling"), proc("cell-biology", "apoptosis")],
  genetics: [proc("genetics", "genomic-imprinting")],
  "molecular-biology": [proc("molecular-biology", "lac-operon"), proc("molecular-biology", "dna-mismatch-repair")],
  "biochemistry-a": [proc("biochemistry", "enzyme-kinetics"), proc("biochemistry", "hemoglobin-oxygen-binding")],
  "biochemistry-b": [proc("biochemistry", "gluconeogenesis"), proc("biochemistry", "fatty-acid-beta-oxidation"), proc("biochemistry", "urea-cycle"), proc("biochemistry", "photosynthesis")],
  microbiology: [proc("microbiology", "viral-life-cycle")],
  physiology: [proc("physiology", "action-potential"), proc("physiology", "synaptic-transmission"), proc("physiology", "muscle-contraction"), proc("physiology", "nephron-urine-formation")],
  immunology: [proc("immunology", "innate-immunity"), proc("immunology", "adaptive-immunity")],
};

const NEW = [
  {
    slug: "neurobiology", nameHe: "נוירוביולוגיה", nameEn: "Neurobiology", year: 3, semester: "A", position: 9,
    descHe: "איך תאי עצב מייצרים ומעבירים אותות: פוטנציאל פעולה, העברה סינפטית והפעלת שריר.",
    descEn: "How neurons generate and pass on signals: the action potential, synaptic transmission and muscle activation.",
    units: [proc("physiology", "action-potential"), proc("physiology", "synaptic-transmission"), proc("physiology", "muscle-contraction")],
  },
  {
    slug: "endocrinology", nameHe: "אנדוקרינולוגיה", nameEn: "Endocrinology", year: 3, semester: "B", position: 10,
    descHe: "הורמונים ואיתות תוך-תאי: קולטנים מצומדי חלבון G, שליחים שניים ובקרת רמת הסוכר בדם.",
    descEn: "Hormones and intracellular signalling: G-protein-coupled receptors, second messengers and blood-glucose control.",
    units: [proc("cell-biology", "gpcr-camp-signaling"), proc("physiology", "blood-glucose-regulation")],
  },
];

const key = (u: Unit) => (u.kind === "process" ? `p:${u.slug}` : `s:${u.id}`);

async function apply(dryRun: boolean) {
  const procs = new Set((await db.execute(`SELECT slug FROM Process`)).rows.map((r) => String(r.slug)));
  const all = [...Object.values(ADD).flat(), ...NEW.flatMap((c) => c.units)];
  const missing = all.filter((u) => u.kind === "process" && !procs.has(u.slug));
  if (missing.length) throw new Error(`processes not found: ${missing.map(key).join(", ")}`);

  const rows = (await db.execute(`SELECT slug, units, "updatedAt" FROM Course`)).rows;
  const backup = { courses: rows.map((r) => ({ slug: r.slug, units: r.units, updatedAt: r.updatedAt })), created: [] as string[] };
  const stmts: InStatement[] = [];
  for (const r of rows) {
    const add = ADD[String(r.slug)];
    if (!add) continue;
    const units = JSON.parse(String(r.units)) as Unit[];
    const have = new Set(units.map(key));
    const extra = add.filter((u) => !have.has(key(u)));
    if (!extra.length) continue;
    console.log(`${r.slug}: + ${extra.map(key).join(", ")}`);
    stmts.push({ sql: `UPDATE Course SET units=?, "updatedAt"=? WHERE slug=?`, args: [JSON.stringify([...units, ...extra]), NOW, String(r.slug)] });
  }
  for (const c of NEW) {
    if (rows.some((r) => r.slug === c.slug)) { console.log(`${c.slug}: exists, left as is`); continue; }
    console.log(`new course ${c.slug}: ${c.units.map(key).join(", ")}`);
    backup.created.push(c.slug);
    stmts.push({
      sql: `INSERT INTO Course (slug, "nameHe", "nameEn", year, semester, "descHe", "descEn", units, position, "updatedAt") VALUES (?,?,?,?,?,?,?,?,?,?)`,
      args: [c.slug, c.nameHe, c.nameEn, c.year, c.semester, c.descHe, c.descEn, JSON.stringify(c.units), c.position, NOW],
    });
  }
  if (dryRun) { console.log(`dry run — ${stmts.length} statements`); return; }
  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `courses-gap-${NOW.replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(file, JSON.stringify(backup, null, 1));
  console.log(`backup → ${file}`);
  await db.batch(stmts, "write");
  console.log(`applied ${stmts.length} statements`);
}

async function rollback(file: string) {
  const b = JSON.parse(fs.readFileSync(file, "utf8"));
  const stmts: InStatement[] = [
    ...b.courses.map((c: { slug: string; units: string; updatedAt: string | null }) => ({ sql: `UPDATE Course SET units=?, "updatedAt"=? WHERE slug=?`, args: [c.units, c.updatedAt, c.slug] })),
    ...b.created.map((slug: string) => ({ sql: `DELETE FROM Course WHERE slug=?`, args: [slug] })),
  ];
  await db.batch(stmts, "write");
  console.log(`restored ${b.courses.length} courses, removed ${b.created.length}`);
}

const args = process.argv.slice(2);
(args[0] === "--rollback" ? rollback(args[1]) : apply(args.includes("--dry-run"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
