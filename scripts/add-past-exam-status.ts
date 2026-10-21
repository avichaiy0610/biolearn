// Adds moderation columns to PastExam (student uploads wait for admin approval).
// Additive and defaulted — safe to run before the code that uses them is deployed:
// existing rows become "approved", and the old code ignores the new columns.
//   npx tsx scripts/add-past-exam-status.ts
import "dotenv/config";
import { createClient } from "@libsql/client";

const STATEMENTS = [
  `ALTER TABLE "PastExam" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'approved'`,
  `ALTER TABLE "PastExam" ADD COLUMN "uploaderId" TEXT`,
  `ALTER TABLE "PastExam" ADD COLUMN "uploaderEmail" TEXT`,
  `ALTER TABLE "PastExam" ADD COLUMN "reviewedAt" DATETIME`,
  `CREATE INDEX IF NOT EXISTS "PastExam_status_idx" ON "PastExam"("status")`,
];

async function main() {
  const client = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
  for (const sql of STATEMENTS) {
    try {
      await client.execute(sql);
      console.log("✅", sql);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("duplicate column")) console.log("ℹ️  already exists:", sql);
      else throw err;
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
