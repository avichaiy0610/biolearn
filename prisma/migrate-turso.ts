import "dotenv/config";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const migration1 = `
CREATE TABLE IF NOT EXISTS "Topic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "nameHe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descHe" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "Topic_slug_key" ON "Topic"("slug");

CREATE TABLE IF NOT EXISTS "Subtopic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameHe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "contentHe" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "relatedProcessSlug" TEXT,
    CONSTRAINT "Subtopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Process" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameHe" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "descHe" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    CONSTRAINT "Process_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProcessStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "processId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "titleHe" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descHe" TEXT NOT NULL,
    "descEn" TEXT NOT NULL,
    "svgData" TEXT NOT NULL,
    CONSTRAINT "ProcessStep_processId_fkey" FOREIGN KEY ("processId") REFERENCES "Process" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "UploadedMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "topicSlug" TEXT,
    "rawText" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "approved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checksum" TEXT NOT NULL,
    "finished_at" TEXT,
    "migration_name" TEXT NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TEXT,
    "started_at" TEXT NOT NULL DEFAULT (datetime('now')),
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);
`;

async function main() {
  console.log("🔧 Applying schema to Turso...");

  // Execute all statements
  const statements = migration1
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const sql of statements) {
    try {
      await client.execute(sql + ";");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log(`  ↷ Skipped (already exists)`);
      } else {
        console.error(`  ✗ Error: ${msg}`);
        console.error(`  SQL: ${sql.slice(0, 80)}...`);
      }
    }
  }

  // Verify
  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
  );
  console.log("✅ Tables in Turso DB:");
  tables.rows.forEach((r) => console.log(`  - ${r[0]}`));
}

main().catch(console.error).finally(() => client.close());
