/**
 * Creates the tables for past exams, spaced repetition and study streaks.
 * Idempotent: safe to run more than once.
 *   npx tsx scripts/create-backlog-tables.ts
 */
import "dotenv/config";
import { createClient } from "@libsql/client";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });

const statements = [
  `CREATE TABLE IF NOT EXISTS "PastExam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseSlug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "moed" TEXT NOT NULL,
    "university" TEXT,
    "notes" TEXT,
    "fileName" TEXT,
    "fileData" TEXT,
    "fileSize" INTEGER,
    "url" TEXT,
    "solutionUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS "PastExam_courseSlug_idx" ON "PastExam"("courseSlug")`,
  `CREATE TABLE IF NOT EXISTS "FlashcardReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "ease" REAL NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "reps" INTEGER NOT NULL DEFAULT 0,
    "lapses" INTEGER NOT NULL DEFAULT 0,
    "due" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FlashcardReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "FlashcardReview_userId_cardId_key" ON "FlashcardReview"("userId", "cardId")`,
  `CREATE INDEX IF NOT EXISTS "FlashcardReview_userId_due_idx" ON "FlashcardReview"("userId", "due")`,
  `CREATE TABLE IF NOT EXISTS "StudyDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "actions" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "StudyDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "StudyDay_userId_day_key" ON "StudyDay"("userId", "day")`,
];

async function main() {
  for (const sql of statements) await db.execute(sql);
  const tables = (await db.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name IN ('PastExam','FlashcardReview','StudyDay')`)).rows.map((r) => r.name);
  console.log("✅ tables present:", tables.join(", "));
}

main().catch((e) => { console.error(e); process.exit(1); });
