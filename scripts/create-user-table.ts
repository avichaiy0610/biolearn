import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id"             TEXT NOT NULL PRIMARY KEY,
      "email"          TEXT NOT NULL UNIQUE,
      "hashedPassword" TEXT NOT NULL,
      "name"           TEXT,
      "createdAt"      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ User table created (or already exists)");
  await client.close();
}

main().catch(console.error);
