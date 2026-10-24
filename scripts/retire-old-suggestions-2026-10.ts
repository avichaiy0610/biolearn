// One-off (2026-10-24): the old "analyze gaps" feature is replaced by the lesson chat's question log
// (/admin/student-questions). Backs up and deletes its ContentSuggestion rows, and the AI health check's own
// questions that were logged as if students asked them. The ContentSuggestion table stays.
//   npx tsx scripts/retire-old-suggestions-2026-10.ts            # dry run
//   npx tsx scripts/retire-old-suggestions-2026-10.ts --apply
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@libsql/client";

const PROBE = "מהו ריבוזום%";

async function main() {
  const db = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN });
  const suggestions = (await db.execute(`SELECT * FROM "ContentSuggestion"`)).rows;
  const probes = (await db.execute({ sql: `SELECT * FROM "ChatLog" WHERE "question" LIKE ?`, args: [PROBE] })).rows;
  console.log(`ContentSuggestion: ${suggestions.length} · health-probe ChatLog rows: ${probes.length}`);
  if (!process.argv.includes("--apply")) return console.log("dry run — pass --apply");
  mkdirSync(".backups", { recursive: true });
  const file = `.backups/retire-old-suggestions-${Date.now()}.json`;
  writeFileSync(file, JSON.stringify({ suggestions, probes }, null, 1), "utf8");
  console.log(`backup → ${file}`);
  await db.batch([`DELETE FROM "ContentSuggestion"`, { sql: `DELETE FROM "ChatLog" WHERE "question" LIKE ?`, args: [PROBE] }], "write");
  console.log("deleted");
}

main();
