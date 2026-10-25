// Admin review of study units (admin/lessons and the panel on each unit page): one decision row per unit and
// comments per section. Additive — safe to run before the code that uses it is deployed.
//   npx tsx scripts/add-lesson-review.ts
import "dotenv/config";
import { createClient } from "@libsql/client";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "LessonReview" (
    "lessonSlug" TEXT NOT NULL PRIMARY KEY,
    "decision" TEXT NOT NULL DEFAULT 'pending',
    "note" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS "LessonComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonSlug" TEXT NOT NULL,
    "sectionId" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "reply" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" DATETIME
  )`,
  `CREATE INDEX IF NOT EXISTS "LessonComment_lessonSlug_status_idx" ON "LessonComment"("lessonSlug", "status")`,
];

async function main() {
  const client = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
  for (const sql of STATEMENTS) {
    await client.execute(sql);
    console.log("✅", sql.split("\n")[0]);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
