import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "ChatLog" (
      "id"        TEXT NOT NULL PRIMARY KEY,
      "topicSlug" TEXT,
      "topicName" TEXT NOT NULL,
      "question"  TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "ContentSuggestion" (
      "id"        TEXT NOT NULL PRIMARY KEY,
      "topicSlug" TEXT,
      "topicName" TEXT NOT NULL,
      "nameHe"    TEXT NOT NULL,
      "nameEn"    TEXT NOT NULL,
      "contentHe" TEXT NOT NULL,
      "contentEn" TEXT NOT NULL,
      "slug"      TEXT NOT NULL,
      "reason"    TEXT NOT NULL,
      "priority"  INTEGER NOT NULL DEFAULT 0,
      "approved"  INTEGER NOT NULL DEFAULT 0,
      "rejected"  INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ ChatLog and ContentSuggestion tables created (or already exist)");
  await client.close();
}

main().catch(console.error);
