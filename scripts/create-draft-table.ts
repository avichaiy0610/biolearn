/**
 * Creates the ProcessDraft table (admin-panel animation drafts awaiting polish).
 * Safe to re-run.   npx tsx scripts/create-draft-table.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });

async function main() {
  await db.execute(`CREATE TABLE IF NOT EXISTS "ProcessDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "subtopicId" TEXT,
    "targetSlug" TEXT,
    "proposedSlug" TEXT NOT NULL,
    "nameHe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "feedback" TEXT,
    "steps" TEXT NOT NULL,
    "issues" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
  )`);
  const n = (await db.execute(`SELECT count(*) c FROM "ProcessDraft"`)).rows[0].c;
  console.log(`✅ ProcessDraft table ready — ${n} rows`);
}

main().catch((e) => { console.error(e); process.exit(1); });
