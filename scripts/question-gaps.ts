/**
 * Recurring student questions that the lesson does not answer — the to-do list for adding material.
 * (Workflow: HANDOFF.md → "שאלות סטודנטים". Same grouping as /admin/student-questions.)
 *
 *   npx tsx scripts/question-gaps.ts                    # open gap/partial topics, most asked first
 *   npx tsx scripts/question-gaps.ts --all              # every topic, any coverage and status
 *   npx tsx scripts/question-gaps.ts --lesson <slug>    # one lesson
 *   npx tsx scripts/question-gaps.ts --min 3            # only topics asked at least 3 times
 *   npx tsx scripts/question-gaps.ts --out <file.md>    # write to a file instead of stdout
 *
 * Material is added from the course book by the usual review process (write → Codex check → Avichai approves),
 * then the topic is marked "added" in the admin page. Nothing here writes to the lessons.
 */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { questionGroups, needsMaterial } from "../lib/question-gaps";
import { lessonSections } from "../lib/lesson-chat";
import { lessonBySlug } from "../content/lessons";

const args = process.argv.slice(2);
const flag = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

async function main() {
  const all = args.includes("--all");
  const lesson = flag("--lesson");
  const min = Number(flag("--min") ?? 1);
  const groups = (await questionGroups()).filter((g) => (all || needsMaterial(g)) && (!lesson || g.lessonSlug === lesson) && g.count >= min);

  const lines = [`# שאלות סטודנטים — ${all ? "כל הנושאים" : "חסר ביחידה, פתוח"} (${groups.length})`, ""];
  for (const g of groups) {
    const l = lessonBySlug(g.lessonSlug);
    const titles = new Map(l ? lessonSections(l).map((s) => [s.id, s.title]) : []);
    lines.push(`## ${g.topicLabel} — ${g.count} שאלות`);
    lines.push(`- יחידה: ${g.lessonTitle} (\`${g.lessonSlug}\`) · ${g.courseName}`);
    lines.push(`- כיסוי: ${Object.entries(g.coverageCounts).map(([c, n]) => `${c} ${n}`).join(", ")} · סטטוס: ${g.status}${g.note ? ` · הערה: ${g.note}` : ""}`);
    if (g.sections.length) lines.push(`- סעיפים קרובים: ${g.sections.map((id) => `${titles.get(id) ?? id} (#${id})`).join(", ")}`);
    lines.push(`- נשאל לאחרונה: ${g.lastAsked.toISOString().slice(0, 10)}`);
    for (const q of g.samples) lines.push(`  > ${q.replace(/\s+/g, " ")}`);
    lines.push("");
  }
  const text = lines.join("\n");
  const out = flag("--out");
  if (out) {
    writeFileSync(out, text, "utf8");
    console.log(`wrote ${groups.length} topics → ${out}`);
  } else console.log(text);
}

main().then(() => process.exit(0), (e) => {
  console.error(e);
  process.exit(1);
});
