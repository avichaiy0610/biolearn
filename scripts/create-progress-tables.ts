import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "UserProgress" (
      "id"         TEXT NOT NULL PRIMARY KEY,
      "userId"     TEXT NOT NULL,
      "subtopicId" TEXT NOT NULL,
      "visited"    INTEGER NOT NULL DEFAULT 1,
      "updatedAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("userId", "subtopicId"),
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE
    )
  `);
  console.log("✅ UserProgress table created");

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "QuizResult" (
      "id"         TEXT NOT NULL PRIMARY KEY,
      "userId"     TEXT NOT NULL,
      "subtopicId" TEXT NOT NULL,
      "score"      INTEGER NOT NULL,
      "total"      INTEGER NOT NULL,
      "correct"    INTEGER NOT NULL,
      "type"       TEXT NOT NULL DEFAULT 'official',
      "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
      FOREIGN KEY ("subtopicId") REFERENCES "Subtopic"("id") ON DELETE CASCADE
    )
  `);
  console.log("✅ QuizResult table created");

  console.log("🎉 Done");
}

main().catch(console.error);
