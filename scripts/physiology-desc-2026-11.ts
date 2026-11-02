/**
 * Technion 134117 — refresh the course description in the DB after the track was rebuilt against
 * the course's OWN syllabus (Prof. Shenhav Cohen), which divides 13 weeks into seven sessions.
 * The previous description was built from the portal topic list and omitted two blocks that the
 * syllabus devotes five weeks to: human anatomy, and muscle homeostasis/atrophy. The track now
 * also covers quantitative diffusion and the blood pathology taught in the tutorials.
 *
 *   npx tsx scripts/physiology-desc-2026-11.ts [--dry-run]
 *   npx tsx scripts/physiology-desc-2026-11.ts --rollback .backups/physiology-desc-<ts>.json
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const SLUG = "technion-physiology";
const DESC_HE =
  "פיזיולוגיה אנושית מהממברנה ועד המערכת: הובלה, דיפוזיה ואוסמוזה בחישוב, אנטומיה של גוף האדם לביולוגים, מערכת הדם וקרישתה לצד פתולוגיה של הדם, הכליה ובקרת נפח ולחץ, מערכת העצבים והסינפסה, ושריר השלד — ממנגנון ההתכווצות ועד אטרופיה והיפרטרופיה.";
const DESC_EN =
  "Human physiology from the membrane to the system: transport, quantitative diffusion and osmosis, human anatomy for cell biologists, blood and clotting alongside blood pathology, the kidney and the control of volume and pressure, the nervous system and the synapse, and skeletal muscle — from the contraction mechanism to atrophy and hypertrophy.";

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === "--rollback") {
    const b = JSON.parse(fs.readFileSync(args[1], "utf8")) as { slug: string; descHe: string; descEn: string };
    await db.execute({ sql: `UPDATE Course SET "descHe"=?, "descEn"=? WHERE slug=?`, args: [b.descHe, b.descEn, b.slug] });
    console.log("rolled back", b.slug);
    return;
  }
  const cur = await db.execute({ sql: `SELECT slug, "descHe", "descEn" FROM Course WHERE slug=?`, args: [SLUG] });
  if (!cur.rows.length) throw new Error(`course ${SLUG} not found`);
  const row = cur.rows[0] as unknown as { slug: string; descHe: string; descEn: string };
  console.log("current He:", row.descHe);
  console.log("current En:", row.descEn);
  console.log("new He:", DESC_HE);
  console.log("new En:", DESC_EN);
  if (args.includes("--dry-run")) return;
  const dir = path.join(process.cwd(), ".backups");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `physiology-desc-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify({ slug: row.slug, descHe: row.descHe, descEn: row.descEn }, null, 2), "utf8");
  await db.execute({ sql: `UPDATE Course SET "descHe"=?, "descEn"=? WHERE slug=?`, args: [DESC_HE, DESC_EN, SLUG] });
  console.log("updated; backup at", file);
}

main().catch((e) => { console.error(e); process.exit(1); });
