/**
 * Admin-panel animation drafts → polished, published animations.
 * (Workflow: CLAUDE.md → "Animation drafts workflow".)
 *
 *   npx tsx scripts/animation-drafts.ts list                    # pending drafts + automated findings
 *   npx tsx scripts/animation-drafts.ts show <draftId> [out]    # dump a draft (texts, elements, findings) to JSON
 *   npx tsx scripts/animation-drafts.ts check <slug>|--all      # check published animations against the standard
 *   npx tsx scripts/animation-drafts.ts publish <draftId>       # publish the POLISHED scene for this draft (backup first)
 *   npx tsx scripts/animation-drafts.ts discard <draftId>
 *   npx tsx scripts/animation-drafts.ts --rollback .backups/draft-publish-<ts>.json
 *
 * `publish` never publishes the raw AI draft: it requires a hand-polished scene in
 * content/process-scenes whose slug is the draft's target (rebuild) or proposed
 * slug (new animation), and refuses if the automated standard check has errors.
 */
import "dotenv/config";
import { createClient, type InStatement, type Row } from "@libsql/client";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { PROCESS_SCENES, stepSvgData } from "../content/process-scenes";
import { checkAnimation, formatFindings, hasErrors, type Finding, type StepLike } from "../lib/animation-standards";
import { LOTTIE_SCENES } from "../components/lottie/scenes";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const NOW = new Date().toISOString();
const cuid = () => "c" + randomBytes(12).toString("hex").slice(0, 24);

async function draft(id: string): Promise<Row> {
  const r = (await db.execute({ sql: `SELECT * FROM "ProcessDraft" WHERE "id"=?`, args: [id] })).rows[0];
  if (!r) throw new Error(`draft not found: ${id}`);
  return r;
}

async function list() {
  const rows = (await db.execute(`SELECT "id","nameHe","nameEn","targetSlug","proposedSlug","steps","issues","feedback","createdAt" FROM "ProcessDraft" WHERE "status"='pending' ORDER BY "createdAt"`)).rows;
  if (!rows.length) return console.log("no pending drafts");
  for (const r of rows) {
    const issues = JSON.parse(String(r.issues ?? "[]")) as Finding[];
    const steps = JSON.parse(String(r.steps)) as StepLike[];
    const slug = String(r.targetSlug ?? r.proposedSlug);
    const polished = PROCESS_SCENES.some((s) => s.slug === slug);
    console.log(`${r.id}  ${r.nameEn} / ${r.nameHe}`);
    console.log(`  ${r.targetSlug ? `rebuild of ${r.targetSlug}` : `new → ${r.proposedSlug}`} · ${steps.length} steps · raw draft: ${issues.filter((f) => f.level === "error").length} errors, ${issues.filter((f) => f.level === "warn").length} warnings · polished scene: ${polished ? "yes" : "not yet"}`);
    if (r.feedback) console.log(`  admin feedback: ${r.feedback}`);
  }
}

async function show(id: string, out?: string) {
  const r = await draft(id);
  const steps = (JSON.parse(String(r.steps)) as StepLike[]).map((s) => ({ ...s, svgData: JSON.parse(s.svgData) }));
  const dump = { ...r, steps, issues: JSON.parse(String(r.issues ?? "[]")) };
  const file = out ?? `.backups/draft-${id}.json`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(dump, null, 1));
  console.log(`draft → ${file}\n${formatFindings(dump.issues)}`);
}

async function check(target: string) {
  const procs = (await db.execute(target === "--all" ? `SELECT "id","slug" FROM "Process"` : { sql: `SELECT "id","slug" FROM "Process" WHERE "slug"=?`, args: [target] })).rows;
  for (const p of procs) {
    if (LOTTIE_SCENES[String(p.slug)]) { console.log(`✓ ${p.slug} (Lottie player — reviewed separately)`); continue; }
    const steps = (await db.execute({ sql: `SELECT "titleHe","titleEn","descHe","descEn","svgData" FROM "ProcessStep" WHERE "processId"=? ORDER BY "order"`, args: [p.id] })).rows as unknown as StepLike[];
    if (!steps.length) continue;
    const f = checkAnimation(steps);
    const errors = f.filter((x) => x.level === "error");
    console.log(`${errors.length ? "✗" : "✓"} ${p.slug}${errors.length ? `\n${formatFindings(errors)}` : ""}`);
  }
}

async function publish(id: string) {
  const d = await draft(id);
  if (d.status !== "pending") throw new Error(`draft is ${d.status}`);
  const slug = String(d.targetSlug ?? d.proposedSlug);
  const scene = PROCESS_SCENES.find((s) => s.slug === slug);
  if (!scene) throw new Error(`no polished scene for "${slug}" in content/process-scenes — polish the draft first`);
  const steps: StepLike[] = scene.steps.map((st) => ({ ...st, svgData: stepSvgData(scene, st) }));
  const findings = checkAnimation(steps);
  console.log(formatFindings(findings));
  if (hasErrors(findings)) throw new Error("standard check failed — fix the errors above before publishing");

  const existing = (await db.execute({ sql: `SELECT * FROM "Process" WHERE "slug"=?`, args: [slug] })).rows[0];
  const backup: Record<string, unknown> = { draftId: id, slug, createdProcess: !existing };
  const stmts: InStatement[] = [];
  let processId: string;
  if (existing) {
    processId = String(existing.id);
    backup.process = { ...existing };
    backup.steps = (await db.execute({ sql: `SELECT * FROM "ProcessStep" WHERE "processId"=?`, args: [processId] })).rows;
    stmts.push({ sql: `DELETE FROM "ProcessStep" WHERE "processId"=?`, args: [processId] });
    stmts.push({ sql: `UPDATE "Process" SET "updatedAt"=?, "reviewedAt"=? WHERE "id"=?`, args: [NOW, NOW, processId] });
  } else {
    processId = cuid();
    stmts.push({
      sql: `INSERT INTO "Process" ("id","topicId","slug","nameHe","nameEn","descHe","descEn","updatedAt","reviewedAt") VALUES (?,?,?,?,?,?,?,?,?)`,
      args: [processId, String(d.topicId), slug, String(d.nameHe), String(d.nameEn), `אנימציה: ${d.nameHe}`, `Animation: ${d.nameEn}`, NOW, NOW],
    });
    if (d.subtopicId) {
      backup.subtopic = (await db.execute({ sql: `SELECT "id","relatedProcessSlug" FROM "Subtopic" WHERE "id"=?`, args: [d.subtopicId] })).rows[0] ?? null;
      stmts.push({ sql: `UPDATE "Subtopic" SET "relatedProcessSlug"=? WHERE "id"=?`, args: [slug, String(d.subtopicId)] });
    }
  }
  steps.forEach((st, i) => stmts.push({
    sql: `INSERT INTO "ProcessStep" ("id","processId","order","titleHe","titleEn","descHe","descEn","svgData") VALUES (?,?,?,?,?,?,?,?)`,
    args: [cuid(), processId, i + 1, st.titleHe, st.titleEn, st.descHe, st.descEn, st.svgData],
  }));
  stmts.push({ sql: `UPDATE "ProcessDraft" SET "status"='published', "updatedAt"=? WHERE "id"=?`, args: [NOW, id] });

  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `draft-publish-${NOW.replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(file, JSON.stringify(backup, null, 1));
  console.log(`backup → ${file}`);
  await db.batch(stmts, "write");
  console.log(`published ${slug} (${steps.length} steps)`);
}

async function rollback(file: string) {
  const b = JSON.parse(fs.readFileSync(file, "utf8"));
  const stmts: InStatement[] = [];
  const proc = (await db.execute({ sql: `SELECT "id" FROM "Process" WHERE "slug"=?`, args: [b.slug] })).rows[0];
  if (proc) stmts.push({ sql: `DELETE FROM "ProcessStep" WHERE "processId"=?`, args: [proc.id] });
  if (b.createdProcess) {
    if (proc) stmts.push({ sql: `DELETE FROM "Process" WHERE "id"=?`, args: [proc.id] });
    if (b.subtopic) stmts.push({ sql: `UPDATE "Subtopic" SET "relatedProcessSlug"=? WHERE "id"=?`, args: [b.subtopic.relatedProcessSlug, b.subtopic.id] });
  } else {
    for (const s of b.steps) stmts.push({
      sql: `INSERT INTO "ProcessStep" ("id","processId","order","titleHe","titleEn","descHe","descEn","svgData") VALUES (?,?,?,?,?,?,?,?)`,
      args: [s.id, s.processId, s.order, s.titleHe, s.titleEn, s.descHe, s.descEn, s.svgData],
    });
    stmts.push({ sql: `UPDATE "Process" SET "updatedAt"=?, "reviewedAt"=? WHERE "id"=?`, args: [b.process.updatedAt, b.process.reviewedAt, b.process.id] });
  }
  stmts.push({ sql: `UPDATE "ProcessDraft" SET "status"='pending' WHERE "id"=?`, args: [b.draftId] });
  await db.batch(stmts, "write");
  console.log(`rolled back ${b.slug}`);
}

const [cmd, arg, arg2] = process.argv.slice(2);
const run: Record<string, () => Promise<void>> = {
  list,
  show: () => show(arg, arg2),
  check: () => check(arg ?? "--all"),
  publish: () => publish(arg),
  discard: async () => { await db.execute({ sql: `UPDATE "ProcessDraft" SET "status"='discarded', "updatedAt"=? WHERE "id"=?`, args: [NOW, arg] }); console.log("discarded"); },
  "--rollback": () => rollback(arg),
};
(run[cmd] ?? (async () => console.log("commands: list | show <id> [out] | check <slug>|--all | publish <id> | discard <id> | --rollback <file>")))().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
