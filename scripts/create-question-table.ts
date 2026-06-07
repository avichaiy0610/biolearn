import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Question" (
      "id"          TEXT NOT NULL PRIMARY KEY,
      "subtopicId"  TEXT NOT NULL,
      "type"        TEXT NOT NULL DEFAULT 'mcq',
      "question"    TEXT NOT NULL,
      "options"     TEXT,
      "answer"      TEXT NOT NULL,
      "explanation" TEXT NOT NULL,
      "difficulty"  TEXT NOT NULL DEFAULT 'medium',
      "approved"    INTEGER NOT NULL DEFAULT 0,
      "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE
    )
  `);
  console.log("✅ Created Question table");
}

main().catch(console.error);
