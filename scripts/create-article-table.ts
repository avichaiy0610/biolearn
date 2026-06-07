import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Article" (
      "id"          TEXT NOT NULL PRIMARY KEY,
      "pubmedId"    TEXT,
      "title"       TEXT NOT NULL,
      "authors"     TEXT NOT NULL,
      "journal"     TEXT,
      "year"        INTEGER,
      "abstract"    TEXT NOT NULL,
      "abstractHe"  TEXT,
      "keyFindings" TEXT,
      "topicSlugs"  TEXT,
      "subtopicIds" TEXT,
      "url"         TEXT,
      "source"      TEXT NOT NULL DEFAULT 'pubmed',
      "hidden"      INTEGER NOT NULL DEFAULT 1,
      "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("✅ Created Article table");

  try {
    await client.execute(`CREATE UNIQUE INDEX "Article_pubmedId_key" ON "Article"("pubmedId")`);
    console.log("✅ Created unique index on pubmedId");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("already exists")) {
      console.log("ℹ️  Index already exists");
    } else {
      throw err;
    }
  }
}

main().catch(console.error);
