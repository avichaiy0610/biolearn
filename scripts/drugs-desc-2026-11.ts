/**
 * Technion 136014 — refresh the course description in the DB after the track was rebuilt
 * against the course's own 2025 syllabus (11 named topics). The previous description covered
 * only the engineering/libraries half of the course; the track now also covers Gleevec,
 * targeted antibodies, engineered T cells, cancer immunotherapy and personalized medicine.
 *
 *   npx tsx scripts/drugs-desc-2026-11.ts [--dry-run]
 *   npx tsx scripts/drugs-desc-2026-11.ts --rollback .backups/drugs-desc-<ts>.json
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const SLUG = "technion-drugs";
const DESC_HE =
  "מתגליות היסוד של התחום ועד תרופות של היום: מולקולה קטנה מול מולקולה ביולוגית, גליבק ונוגדנים מכווני מטרה, ספריות ענק ותצוגה, הנדסת חלבונים ואבולוציה במבחנה, תאי T מהונדסים, אימונותרפיה של סרטן, והגנום האנושי ברפואה מותאמת אישית.";
const DESC_EN =
  "From the discoveries that created the field to today's drugs: small molecules versus biologics, Gleevec and targeted antibodies, large libraries and display, protein engineering and in vitro evolution, engineered T cells, cancer immunotherapy and the human genome in personalized medicine.";

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
  const file = path.join(dir, `drugs-desc-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(row, null, 2), "utf8");
  await db.execute({ sql: `UPDATE Course SET "descHe"=?, "descEn"=? WHERE slug=?`, args: [DESC_HE, DESC_EN, SLUG] });
  console.log("updated; backup at", file);
}

main().catch((e) => { console.error(e); process.exit(1); });
