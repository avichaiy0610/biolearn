// Reading progress in study units (the home "open now" card, "pick up where you left off", read marks in the course
// plan). Additive — safe to run before the code that uses it is deployed.
//   npx tsx scripts/add-lesson-progress.ts
import "dotenv/config";
import { createClient } from "@libsql/client";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "LessonProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonSlug" TEXT NOT NULL,
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "LessonProgress_userId_lessonSlug_key" ON "LessonProgress"("userId", "lessonSlug")`,
  `CREATE INDEX IF NOT EXISTS "LessonProgress_userId_updatedAt_idx" ON "LessonProgress"("userId", "updatedAt")`,
];

async function main() {
  const client = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
  for (const sql of STATEMENTS) {
    await client.execute(sql);
    console.log("✅", sql.split("\n")[0]);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
