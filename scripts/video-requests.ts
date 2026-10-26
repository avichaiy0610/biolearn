/**
 * The admin's queue of narrated explainer videos (🎬 on a process in the admin panel) — the to-do list for
 * Claude/Codex. A video is made in ../biolearn-video (script → voice → Codex draws → render), copied to
 * public/videos/explainers/ and listed in content/explainer-videos.ts; then mark the request done.
 *
 *   npx tsx scripts/video-requests.ts                       # open requests (pending / in-progress)
 *   npx tsx scripts/video-requests.ts --all                 # every request
 *   npx tsx scripts/video-requests.ts --set <slug> <pending|in-progress|done|declined> [--note "…"]
 */
import "dotenv/config";
import { prisma } from "../lib/prisma";
import { EXPLAINER_VIDEOS } from "../content/explainer-videos";

const args = process.argv.slice(2);
const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const STATUSES = ["pending", "in-progress", "done", "declined"];

async function main() {
  const slug = flag("--set");
  if (slug) {
    const status = args[args.indexOf("--set") + 2];
    if (!STATUSES.includes(status)) throw new Error(`status must be one of ${STATUSES.join(", ")}`);
    const note = flag("--note");
    await prisma.videoRequest.upsert({ where: { processSlug: slug }, create: { processSlug: slug, status, note }, update: { status, ...(note ? { note } : {}) } });
    console.log(`${slug} → ${status}`);
    return;
  }
  const rows = await prisma.videoRequest.findMany({
    where: args.includes("--all") ? {} : { status: { in: ["pending", "in-progress"] } },
    orderBy: { createdAt: "asc" },
  });
  const procs = await prisma.process.findMany({ where: { slug: { in: rows.map((r) => r.processSlug) } }, select: { slug: true, nameHe: true, topic: { select: { slug: true } } } });
  console.log(`# Video requests (${rows.length})\n`);
  for (const r of rows) {
    const p = procs.find((x) => x.slug === r.processSlug);
    const has = EXPLAINER_VIDEOS[r.processSlug] ? " · already has a video" : "";
    console.log(`- ${r.processSlug} [${r.status}] ${p ? `${p.nameHe} (topics/${p.topic.slug})` : "(process not found)"}${has}`);
    if (r.note) console.log(`    note: ${r.note}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
