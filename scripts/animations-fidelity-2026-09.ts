/**
 * Step-animation fidelity pass — September 2026.
 *
 *   npx tsx scripts/animations-fidelity-2026-09.ts            # apply (writes a backup first)
 *   npx tsx scripts/animations-fidelity-2026-09.ts --dry-run  # print the plan only
 *   npx tsx scripts/animations-fidelity-2026-09.ts --rollback .backups/animations-fidelity-<ts>.json
 *
 * Rewrites every SVG-step process (all except mitosis and DNA replication, which
 * use the Lottie player) from content/process-scenes: step titles and texts
 * checked against Campbell Biology (12e) and Alberts (7e), and hand-drawn v2
 * scenes. Step counts are unchanged; rows are updated in place by `order`.
 */
import "dotenv/config";
import { createClient, type InStatement } from "@libsql/client";
import fs from "fs";
import path from "path";
import { PROCESS_SCENES, stepSvgData } from "../content/process-scenes";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const NOW = new Date().toISOString();
const COLS = ["titleHe", "titleEn", "descHe", "descEn", "svgData"] as const;

async function apply(dryRun: boolean) {
  const before: { steps: Record<string, unknown>[]; processes: Record<string, unknown>[] } = { steps: [], processes: [] };
  const stmts: InStatement[] = [];
  for (const scene of PROCESS_SCENES) {
    const proc = (await db.execute({ sql: `SELECT "id", "updatedAt", "reviewedAt" FROM "Process" WHERE "slug"=?`, args: [scene.slug] })).rows[0];
    if (!proc) throw new Error(`process not found: ${scene.slug}`);
    const rows = (await db.execute({ sql: `SELECT "id", "order", ${COLS.map((c) => `"${c}"`).join(", ")} FROM "ProcessStep" WHERE "processId"=? ORDER BY "order"`, args: [proc.id] })).rows;
    if (rows.length !== scene.steps.length) throw new Error(`${scene.slug}: DB has ${rows.length} steps, scene has ${scene.steps.length}`);
    before.processes.push({ ...proc });
    scene.steps.forEach((st, i) => {
      const row = rows[i];
      before.steps.push({ ...row });
      stmts.push({
        sql: `UPDATE "ProcessStep" SET "titleHe"=?, "titleEn"=?, "descHe"=?, "descEn"=?, "svgData"=? WHERE "id"=?`,
        args: [st.titleHe, st.titleEn, st.descHe, st.descEn, stepSvgData(scene, st), row.id as string],
      });
      if (row.titleHe !== st.titleHe) console.log(`  ${scene.slug.slice(0, 32)} #${row.order}: "${row.titleHe}" → "${st.titleHe}"`);
    });
    stmts.push({ sql: `UPDATE "Process" SET "updatedAt"=?, "reviewedAt"=? WHERE "id"=?`, args: [NOW, NOW, proc.id as string] });
    console.log(`${scene.slug}: ${rows.length} steps`);
  }
  if (dryRun) { console.log(`dry run — ${stmts.length} statements not executed`); return; }
  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `animations-fidelity-${NOW.replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(file, JSON.stringify(before, null, 1));
  console.log(`backup → ${file}`);
  await db.batch(stmts, "write");
  console.log(`applied ${stmts.length} statements`);
}

async function rollback(file: string) {
  const { steps, processes } = JSON.parse(fs.readFileSync(file, "utf8"));
  const stmts: InStatement[] = [
    ...steps.map((r: Record<string, string>) => ({ sql: `UPDATE "ProcessStep" SET "titleHe"=?, "titleEn"=?, "descHe"=?, "descEn"=?, "svgData"=? WHERE "id"=?`, args: [r.titleHe, r.titleEn, r.descHe, r.descEn, r.svgData, r.id] })),
    ...processes.map((p: Record<string, string | null>) => ({ sql: `UPDATE "Process" SET "updatedAt"=?, "reviewedAt"=? WHERE "id"=?`, args: [p.updatedAt, p.reviewedAt, p.id] })),
  ];
  await db.batch(stmts, "write");
  console.log(`restored ${steps.length} steps from ${file}`);
}

const args = process.argv.slice(2);
(args[0] === "--rollback" ? rollback(args[1]) : apply(args.includes("--dry-run"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
