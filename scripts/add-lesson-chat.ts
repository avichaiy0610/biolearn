// Lesson chat: ChatLog learns where a question was asked (course / lesson / section) and how the lesson covers it,
// and QuestionGap tracks what was done about each recurring topic. Additive and defaulted — safe to run before the
// code that uses it is deployed; existing rows become source "topic".
//   npx tsx scripts/add-lesson-chat.ts
import "dotenv/config";
import { createClient } from "@libsql/client";

const STATEMENTS = [
  `ALTER TABLE "ChatLog" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'topic'`,
  `ALTER TABLE "ChatLog" ADD COLUMN "courseSlug" TEXT`,
  `ALTER TABLE "ChatLog" ADD COLUMN "lessonSlug" TEXT`,
  `ALTER TABLE "ChatLog" ADD COLUMN "sectionId" TEXT`,
  `ALTER TABLE "ChatLog" ADD COLUMN "coverage" TEXT`,
  `ALTER TABLE "ChatLog" ADD COLUMN "topicLabel" TEXT`,
  `CREATE INDEX IF NOT EXISTS "ChatLog_lessonSlug_topicLabel_idx" ON "ChatLog"("lessonSlug", "topicLabel")`,
  `CREATE TABLE IF NOT EXISTS "QuestionGap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonSlug" TEXT NOT NULL,
    "topicLabel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "note" TEXT,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "QuestionGap_lessonSlug_topicLabel_key" ON "QuestionGap"("lessonSlug", "topicLabel")`,
];

async function main() {
  const client = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
  for (const sql of STATEMENTS) {
    try {
      await client.execute(sql);
      console.log("✅", sql.split("\n")[0]);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("duplicate column")) console.log("ℹ️  already exists:", sql.split("\n")[0]);
      else throw err;
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
