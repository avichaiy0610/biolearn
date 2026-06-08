import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const url = process.env.DATABASE_URL_MIGRATE ?? process.env.DATABASE_URL ?? "";
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  const client = createClient({ url, authToken });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS ContentFeedback (
      id          TEXT     PRIMARY KEY NOT NULL,
      topicSlug   TEXT     NOT NULL,
      processSlug TEXT,
      subtopicId  TEXT,
      targetType  TEXT     NOT NULL,
      comment     TEXT     NOT NULL,
      status      TEXT     NOT NULL DEFAULT 'open',
      createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✓ ContentFeedback table created (or already exists)");
  client.close();
}

main().catch(console.error);
