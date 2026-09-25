/**
 * Creates the Course table and seeds it from content/courses.ts (only courses
 * that don't exist yet — safe to re-run, never overwrites admin edits).
 *   npx tsx scripts/create-course-table.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { COURSES } from "../content/courses";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });

async function main() {
  await db.execute(`CREATE TABLE IF NOT EXISTS "Course" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "nameHe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,
    "descHe" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "units" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME
  )`);
  let inserted = 0;
  for (const [i, c] of COURSES.entries()) {
    const r = await db.execute({
      sql: `INSERT OR IGNORE INTO "Course" ("slug","nameHe","nameEn","year","semester","descHe","descEn","units","position","updatedAt") VALUES (?,?,?,?,?,?,?,?,?,?)`,
      args: [c.slug, c.nameHe, c.nameEn, c.year, c.semester, c.descHe, c.descEn, JSON.stringify(c.units), i, new Date().toISOString()],
    });
    inserted += r.rowsAffected;
  }
  const total = (await db.execute(`SELECT count(*) c FROM "Course"`)).rows[0].c;
  console.log(`✅ Course table ready — inserted ${inserted}, total ${total}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
