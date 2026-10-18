/**
 * TAU "מבוא לביולוגיה א'/ב'/ג'" were first mapped by guess (typical intro
 * content). The official 2026 syllabi (scripts/syllabus-fetch.ts) show:
 *   A — chemistry of life, cell structure, energy, signaling, cell cycle,
 *       Mendelian genetics, replication/transcription/translation
 *   B — evolution, biodiversity (prokaryotes, animals) and the plant world
 *   C — animal physiology, neurobiology, the immune system and ecology
 * This rewrites their units and descriptions accordingly (backup first).
 *
 *   npx tsx scripts/tau-intro-fix-2026-10.ts [--dry-run]
 *   npx tsx scripts/tau-intro-fix-2026-10.ts --rollback .backups/tau-intro-<ts>.json
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

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--rollback") {
    const b = JSON.parse(fs.readFileSync(args[1], "utf8")) as { slug: string; units: string; descHe: string; descEn: string; updatedAt: string | null }[];
    for (const r of b) await db.execute({ sql: `UPDATE Course SET units=?, "descHe"=?, "descEn"=?, "updatedAt"=? WHERE slug=?`, args: [r.units, r.descHe, r.descEn, r.updatedAt, r.slug] });
    console.log(`restored ${b.length} courses`);
    return;
  }
  const courses = (await db.execute(`SELECT slug, units, "descHe", "descEn", "updatedAt" FROM Course`)).rows;
  const subs = (await db.execute(`SELECT s.id, s."nameEn", t.slug AS topic FROM Subtopic s JOIN Topic t ON t.id = s."topicId" WHERE s.hidden = 0`)).rows;
  const procs = (await db.execute(`SELECT p.slug, t.slug AS topic FROM Process p JOIN Topic t ON t.id = p."topicId"`)).rows;
  const G = (slug: string): Unit[] => JSON.parse(String(courses.find((c) => c.slug === slug)!.units));
  const T = (topic: string): Unit[] => [
    ...subs.filter((s) => s.topic === topic).map((s) => ({ kind: "subtopic" as const, topic, id: String(s.id) })),
    ...procs.filter((p) => p.topic === topic).map((p) => ({ kind: "process" as const, topic, slug: String(p.slug) })),
  ];
  const S = (topic: string, nameEn: string): Unit => {
    const s = subs.find((x) => x.topic === topic && x.nameEn === nameEn);
    if (!s) throw new Error(`subtopic not found: ${nameEn}`);
    return { kind: "subtopic", topic, id: String(s.id) };
  };
  const P = (topic: string, slug: string): Unit => ({ kind: "process", topic, slug });

  const plan: Record<string, { units: Unit[]; descHe: string; descEn: string }> = {
    "tau-bio-intro-a": {
      units: dedupe([...G("cell-biology-a"), S("cell-biology", "The Cell Cycle and Mitosis"), P("cell-biology", "mitosis"), S("cell-biology", "Cell-Cell Interactions and Signaling"),
        S("genetics", "Mendelian Genetics"), S("molecular-biology", "DNA Structure"), S("molecular-biology", "Central Dogma"),
        P("molecular-biology", "dna-replication"), P("molecular-biology", "transcription"), P("molecular-biology", "translation")]),
      descHe: "הבסיס המולקולרי והתאי: מאקרומולקולות, מבנה התא, המרת אנרגיה, תקשורת תוך-תאית, מחזור התא, גנטיקה מנדלית, שכפול, שעתוק ותרגום.",
      descEn: "The molecular and cellular basis: macromolecules, cell structure, energy conversion, signaling, the cell cycle, Mendelian genetics, replication, transcription and translation.",
    },
    "tau-bio-intro-b": {
      units: dedupe([...T("evolutionary-biology"), ...T("microbiology").filter((u) => u.kind === "subtopic"), ...T("plant-physiology"), P("biochemistry", "photosynthesis")]),
      descHe: "תיאוריית האבולוציה, המגוון הביולוגי — פרוקריוטים, בעלי חיים וצמחים — ועולם הצומח.",
      descEn: "Evolutionary theory, biodiversity — prokaryotes, animals and plants — and the plant world.",
    },
    "tau-bio-intro-c": {
      units: dedupe([...G("physiology"), ...G("neurobiology"), ...G("immunology"), ...T("ecology")]),
      descHe: "פיזיולוגיה של בעלי חיים, נוירוביולוגיה, מערכת החיסון ומבוא לאקולוגיה.",
      descEn: "Animal physiology, neurobiology, the immune system and an introduction to ecology.",
    },
  };

  const backup = courses.filter((c) => String(c.slug) in plan).map((c) => ({ slug: c.slug, units: c.units, descHe: c.descHe, descEn: c.descEn, updatedAt: c.updatedAt }));
  for (const [slug, p] of Object.entries(plan)) console.log(`${slug}: ${JSON.parse(String(courses.find((c) => c.slug === slug)!.units)).length} → ${p.units.length} units`);
  if (args.includes("--dry-run")) return;
  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `tau-intro-${NOW.replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(file, JSON.stringify(backup, null, 1));
  for (const [slug, p] of Object.entries(plan)) {
    await db.execute({ sql: `UPDATE Course SET units=?, "descHe"=?, "descEn"=?, "updatedAt"=? WHERE slug=?`, args: [JSON.stringify(p.units), p.descHe, p.descEn, NOW, slug] });
  }
  console.log(`backup → ${file}; updated ${Object.keys(plan).length} courses`);
}
main().catch((e) => { console.error(e); process.exit(1); });
