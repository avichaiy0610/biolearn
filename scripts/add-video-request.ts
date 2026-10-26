// Queue of narrated explainer videos the admin asked for (🎬 on a process in the admin panel). The videos are
// produced locally in ../biolearn-video and shipped as static files; this table only holds the requests.
// Additive — safe to run before the code that uses it is deployed.
//   npx tsx scripts/add-video-request.ts
import "dotenv/config";
import { createClient } from "@libsql/client";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS "VideoRequest" (
    "processSlug" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

async function main() {
  const client = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
  for (const sql of STATEMENTS) {
    await client.execute(sql);
    console.log("✅", sql.split("\n")[0]);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
