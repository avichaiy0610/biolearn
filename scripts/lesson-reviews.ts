/**
 * What Avichai decided about the study units (admin/lessons and the panel on each unit page) — the to-do list for
 * Claude/Codex. The units live in git; this reads the decisions and comments from the DB.
 *
 *   npx tsx scripts/lesson-reviews.ts                         # approved-but-unpublished units + every open comment
 *   npx tsx scripts/lesson-reviews.ts --course <slug>         # one course
 *   npx tsx scripts/lesson-reviews.ts --all                   # also closed comments
 *   npx tsx scripts/lesson-reviews.ts --resolve <id> --reply "what was changed"   # close a comment after fixing it
 *
 * Approved → set `status: "published"` in the unit file (and the plan/subtopic links), commit, push.
 * Comment → fix the file, then --resolve with a one-line reply (shown to Avichai under the comment).
 */
import "dotenv/config";
import { prisma } from "../lib/prisma";
import { LESSONS, lessonBySlug } from "../content/lessons";
import { parseBody } from "../content/lessons/parse";

const args = process.argv.slice(2);
const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

const EXTRA: Record<string, string> = { lead: "פתיח", objectives: "מטרות היחידה", experiment: "איך אנחנו יודעים", traps: "מלכודות במבחן", terms: "מונחים", worked: "תרגילים פתורים", practice: "תרגול", sources: "מקורות" };

async function main() {
  const resolve = flag("--resolve");
  if (resolve) {
    const reply = flag("--reply");
    const c = await prisma.lessonComment.update({ where: { id: resolve }, data: { status: "done", resolvedAt: new Date(), ...(reply ? { reply } : {}) } });
    console.log(`closed ${c.id} (${c.lessonSlug})${reply ? ` — ${reply}` : ""}`);
    return;
  }
  const course = flag("--course");
  const all = args.includes("--all");
  const inCourse = (slug: string) => !course || lessonBySlug(slug)?.course.slug === course;

  const reviews = (await prisma.lessonReview.findMany()).filter((r) => inCourse(r.lessonSlug));
  const comments = (await prisma.lessonComment.findMany({ where: all ? {} : { status: "open" }, orderBy: { createdAt: "asc" } })).filter((c) => inCourse(c.lessonSlug));

  const approved = reviews.filter((r) => r.decision === "approved" && lessonBySlug(r.lessonSlug)?.status === "draft");
  const changes = reviews.filter((r) => r.decision === "changes");
  console.log(`# Lesson reviews${course ? ` — ${course}` : ""} (${LESSONS.length} units on the site)\n`);

  console.log(`## Approved, still draft in the file (${approved.length}) — publish these`);
  for (const r of approved) console.log(`- ${r.lessonSlug}  (${lessonBySlug(r.lessonSlug)?.course.slug})${r.note ? ` — ${r.note}` : ""}`);

  console.log(`\n## Marked "needs changes" (${changes.length})`);
  for (const r of changes) console.log(`- ${r.lessonSlug}${r.note ? ` — ${r.note}` : ""}`);

  console.log(`\n## ${all ? "Comments" : "Open comments"} (${comments.length})`);
  for (const c of comments) {
    const l = lessonBySlug(c.lessonSlug);
    const section = c.sectionId ? (parseBody(l?.bodyHe ?? "").find((s) => s.id === c.sectionId)?.title ?? EXTRA[c.sectionId] ?? c.sectionId) : "כל היחידה";
    console.log(`\n### ${c.id}  [${c.status}]  ${c.lessonSlug} → ${section}${c.sectionId ? ` (#${c.sectionId})` : ""}  · ${c.createdAt.toISOString().slice(0, 10)}`);
    console.log(c.body);
    if (c.reply) console.log(`↳ reply: ${c.reply}`);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
