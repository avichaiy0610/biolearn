/**
 * Pulls the CURRENT official syllabus of every course in content/syllabi/registry.ts
 * from the university's public source and writes content/syllabi/data.generated.ts.
 * Run it at the start of each semester; the report lists new/changed/failed courses
 * and course-name mismatches (a sign of a stale code). Course plans
 * (content/course-plans) are then reviewed against what changed.
 *
 *   npx tsx scripts/syllabus-fetch.ts                 # all universities
 *   npx tsx scripts/syllabus-fetch.ts huji technion   # some
 *
 * Sources: HUJI syllabus API · TAU IMS syllabus page · Technion students portal ·
 * Bar-Ilan faculty PDF syllabi · Ben-Gurion annual course catalog (headless browser) ·
 * Haifa biology department PDF syllabi. Needs `pdftotext` on PATH and Playwright's Chromium.
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { execFileSync } from "child_process";
import { chromium, type Browser } from "playwright";
import fs from "fs";
import os from "os";
import path from "path";
import { SYLLABUS_TARGETS, type SyllabusTarget } from "../content/syllabi/registry";
import type { SyllabusRecord } from "../content/syllabi/types";

const OUT = path.join("content", "syllabi", "data.generated.ts");
const NOW = new Date().toISOString().slice(0, 10);
const UA = { "User-Agent": "Mozilla/5.0 (BioLearn syllabus sync; contact via biolearn-neon.vercel.app)" };

const BIDI = /[‎‏‪-‮⁦-⁩]/g;
// Some sources serve the Hebrew gershayim (דנ״א) as "?" — restore it between Hebrew letters.
const clean = (s: string) => s.replace(BIDI, "").replace(/([֐-׿])\?([֐-׿])/g, "$1״$2").replace(/\s+/g, " ").trim();
const stripTags = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
const splitTopics = (s: string) => s.split(/[;؛]|\.\s+(?=[֐-׿A-Z])/).map(clean).map((x) => x.replace(/\.$/, "")).filter((x) => x.length > 2);
const norm = (s: string) => clean(s).replace(/["'״׳()\-–]/g, "").replace(/\s+/g, " ");

async function get(url: string) {
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

// ── HUJI: JSON API ─────────────────────────────────────────────────────────
async function huji(t: SyllabusTarget): Promise<SyllabusRecord> {
  const year = new Date().getMonth() >= 8 ? new Date().getFullYear() + 1 : new Date().getFullYear(); // HUJI year = the spring year
  let data: Record<string, unknown> | null = null, used = year;
  for (const y of [year, year - 1]) {
    const res = await get(`https://shnaton.huji.ac.il/api/syllabus?courseCode=${t.code}&year=${y}`).catch(() => null);
    const j = res ? ((await res.json().catch(() => null)) as Record<string, unknown> | null) : null;
    if (j && (j.courseContent as { he?: string })?.he) { data = j; used = y; break; }
  }
  if (!data) throw new Error("no syllabus in the last two years");
  const he = (k: string) => clean(((data![k] as { he?: string }) ?? {}).he ?? "");
  const updKey = Object.keys(data).find((k) => /update/i.test(k) && typeof data![k] === "string");
  const bookKey = Object.keys(data).find((k) => /book|biblio|reading|literature/i.test(k));
  const books = bookKey ? clean(((data[bookKey] as { he?: string; en?: string }) ?? {}).en ?? ((data[bookKey] as { he?: string }) ?? {}).he ?? "") : "";
  const content = he("courseContent");
  return {
    courseSlug: t.courseSlug, university: "huji", code: t.code, nameHe: he("courseName"), year: used,
    updatedHe: updKey ? String(data[updKey]) : undefined, fetchedAt: NOW, source: "huji-api",
    sourceUrl: `https://shnaton.huji.ac.il/course/${t.code}/syllabus/year/${used}`,
    level: "topics", contentHe: content, topicsHe: splitTopics(content), books: books ? [books] : undefined,
  };
}

// ── TAU: IMS syllabus page (public part: name + topics) ───────────────────
async function tau(t: SyllabusTarget): Promise<SyllabusRecord> {
  const year = new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1; // TAU year = the autumn year
  for (const y of [year + 1, year, year - 1]) {
    const url = `https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=${t.code}01&year=${y}`;
    const html = await (await get(url)).text().catch(() => "");
    const lines = stripTags(html).split("\n").map(clean).filter(Boolean);
    const at = (label: string) => lines.indexOf(label);
    const name = at("שם הקורס") >= 0 ? lines[at("שם הקורס") + 1] : "";
    const start = lines.findIndex((l) => l.startsWith("תוכן הקורס"));
    if (!name || start < 0) continue;
    const end = lines.findIndex((l, i) => i > start && /הסילבוס המפורט|מטלות הקורס|דרישות קדם/.test(l));
    const content = clean(lines.slice(start + 1, end > 0 ? end : start + 6).join(" "));
    const list = /בין השאר[:,]?\s*([\s\S]+)/.exec(content)?.[1] ?? content;
    return {
      courseSlug: t.courseSlug, university: "tau", code: t.code, nameHe: name, year: y, fetchedAt: NOW, source: "tau-ims",
      // Inline bullets: " - " and "•" (which IMS sometimes serves as "?").
      sourceUrl: url, level: "topics", contentHe: content, topicsHe: splitTopics(list.replace(/\s+[-•?]\s+/g, "; ")),
    };
  }
  throw new Error("no public syllabus for this or last year");
}

// ── Technion: students portal course page ─────────────────────────────────
// The portal lists every library record of the course books: the same book several times (editions, a short
// "Title - Author" line, a long catalog line "Title / authors… - Author"). Keep one line per title.
function technionBooks(lines: string[]): string[] | undefined {
  const byTitle = new Map<string, { title: string; author: string }>();
  for (const raw of lines) {
    const l = raw.replace(/&#0?39;/g, "'").replace(/&amp;/g, "&");
    const dash = l.lastIndexOf(" - ");
    const author = dash > 0 ? l.slice(dash + 3).replace(/[.,]+$/, "").trim() : "";
    const title = (dash > 0 ? l.slice(0, dash) : l).split(" / ")[0].replace(/[\s.:,]+$/, "").trim();
    if (!title || title.length > 140) continue;
    const key = title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    const prev = byTitle.get(key);
    if (!prev || (!prev.author && author)) byTitle.set(key, { title: prev?.title ?? title, author: author || prev?.author || "" });
  }
  const out = [...byTitle.values()].map((x) => (x.author ? `${x.title} - ${x.author}` : x.title));
  return out.length ? out : undefined;
}

// Bibliography of a PDF syllabus: the lines after a "ספרות / ביבליוגרפיה / Bibliography" heading.
function pdfBooks(lines: string[]): string[] | undefined {
  const h = lines.findIndex((l) => l.length < 60 && /(?:^|\s|:)(?:ספרות|ביבליוגרפיה|ספרי (?:לימוד|הקורס)|רשימת קריאה|Bibliography|Reading list|Textbooks?)(?:\s|:|$)/i.test(l));
  if (h < 0) return undefined;
  const out: string[] = [];
  for (const l of lines.slice(h + 1, h + 20)) {
    // Next section, or the page footer (Haifa letterhead).
    if (/מטלות|דרישות|הרכב הציון|ציון|הערכ|נוכחות|שעות קבלה|מבנה הקורס|לוח זמנים|מטרות|תוצרי|Mount Carmel|הר הכרמל|E-mail|Faculty|החוג ל|הפקולטה/.test(l)) break;
    // Library shelf marks ("שמור סוציולוגיה …") and headings like "ספר הקורס:".
    if (/^\d+$/.test(l) || l.length < 6 || /שמור |בספרי[יה]ת|^ספר(?:י)? הקורס:?$/.test(l)) continue;
    out.push(l.replace(/^[\d.\-•*)]+\s*/, ""));
  }
  return out.length ? out.slice(0, 12) : undefined;
}

async function technion(t: SyllabusTarget): Promise<SyllabusRecord> {
  const url = `https://students.technion.ac.il/local/technionsearch/course/${t.code}`;
  const html = await (await get(url)).text();
  const title = clean(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "");
  const name = clean(title.replace(/^.*?\d+\s*-\s*/, "").replace(/\|.*$/, ""));
  const text = stripTags(html).split("\n").map(clean).filter(Boolean);
  const i = text.indexOf("מידע כללי");
  if (i < 0) throw new Error("no course description");
  const desc = clean(text.slice(i + 1, text.findIndex((l, k) => k > i && /^פקולטה:/.test(l))).join(" "));
  const topics = /נושאי הקורס:?\s*([\s\S]+?)(?:\.\s*הערה|$)/.exec(desc)?.[1] ?? desc;
  const b = text.indexOf("ספרי המקצוע");
  const e = text.findIndex((l, k) => k > b && /^מידע סמסטריאלי/.test(l));
  const books = b >= 0 ? technionBooks(text.slice(b + 1, e > b ? e : b + 40)) : undefined;
  // "תאחיזה, שחלוף ושיטות…" is one topic: a one-word item belongs with the next one.
  const parts = topics.split(/,\s*|\.\s+/).map(clean).filter(Boolean);
  const merged: string[] = [];
  for (let k = 0; k < parts.length; k++) {
    if (!parts[k].includes(" ") && k + 1 < parts.length) { merged.push(`${parts[k]}, ${parts[k + 1]}`); k++; }
    else merged.push(parts[k]);
  }
  return {
    courseSlug: t.courseSlug, university: "technion", code: t.code, nameHe: name, fetchedAt: NOW, source: "technion-portal",
    sourceUrl: url, level: "topics", contentHe: desc, topicsHe: merged.map((x) => x.replace(/\.$/, "")), books,
  };
}

// ── Bar-Ilan: faculty PDF syllabi (lecture ranges when the PDF has them) ──
let biuLinks: string[] | null = null;
// "…/Sylabi24/80-208-30-גנטיקה-תשפד.pdf" → "גנטיקה" (the PDF's first line is often a date).
const nameFromFile = (url: string) =>
  clean(decodeURIComponent(url.split("/").pop() ?? "").replace(/\.pdf$/i, "").replace(/[\d.()_]+/g, " ").replace(/-/g, " ")
    .replace(/סילבוס|סיליבוס|עדכני|גרסה חדשה|תשפ\S*|קורס/g, " "));
async function biuIndex() {
  if (biuLinks) return biuLinks;
  // The faculty's syllabus pages (general + four-year medicine track).
  const pages = ["https://life-sciences.biu.ac.il/node/10299", "https://life-sciences.biu.ac.il/node/10308"];
  const htmls = await Promise.all(pages.map((u) => get(u).then((r) => r.text()).catch(() => "")));
  biuLinks = [...new Set(htmls.flatMap((h) => [...h.matchAll(/href="([^"]+\.pdf)"/gi)].map((m) => new URL(m[1], "https://life-sciences.biu.ac.il").href)))];
  return biuLinks;
}
async function biu(t: SyllabusTarget): Promise<SyllabusRecord> {
  const code = t.code; // 80208 → matches "80208", "80-208", or "208-30" in the file name
  const pat = new RegExp(`${code.slice(0, 2)}-?${code.slice(2)}|(?:^|[^0-9])${code.slice(2)}-30`);
  const links = (await biuIndex()).filter((u) => pat.test(decodeURIComponent(u)));
  if (!links.length) throw new Error("no PDF syllabus on the faculty page");
  // Newest first: "Sylabi25" > "Sylabi24-25" > "Sylabi24" > undated folders.
  const pick = links.sort((a, b) => (/Sylabi(\d+)/.exec(b)?.[1] ?? "0").localeCompare(/Sylabi(\d+)/.exec(a)?.[1] ?? "0"))[0];
  const tmp = path.join(os.tmpdir(), `biu-${code}.pdf`);
  fs.writeFileSync(tmp, Buffer.from(await (await get(pick)).arrayBuffer()));
  const raw = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", tmp, "-"], { encoding: "utf8" });
  const lines = raw.split("\n").map(clean).filter(Boolean);

  const sessions: { lectures: string; topicsHe: string[] }[] = [];
  const notTaught: string[] = [];
  let cur: string[] | null = null;
  for (const l of lines) {
    const h = /שיעורים/.test(l) && /(\d+)\s*-\s*(\d+)/.exec(l);
    if (h) { cur = []; sessions.push({ lectures: `${Math.min(+h[1], +h[2])}–${Math.max(+h[1], +h[2])}`, topicsHe: cur }); continue; }
    if (/לא ילמדו השנה/.test(l)) { cur = notTaught; continue; }
    if (/צומצמו|צמצום/.test(l)) { cur = null; continue; }
    if (cur && l.length > 2 && !/^\d+$/.test(l)) cur.push(l.replace(/^[\d.\-:]+\s*/, ""));
  }
  const year = /Sylabi(\d{2})/.exec(pick)?.[1];
  const content = sessions.length ? sessions.map((s) => `שיעורים ${s.lectures}: ${s.topicsHe.join("; ")}`).join("\n") : lines.slice(0, 40).join(" ");
  return {
    courseSlug: t.courseSlug, university: "biu", code, nameHe: nameFromFile(pick), year: year ? 2000 + Number(year) : undefined,
    fetchedAt: NOW, source: "biu-pdf", sourceUrl: pick, level: sessions.length ? "lectures" : "topics",
    contentHe: content, topicsHe: sessions.length ? sessions.flatMap((s) => s.topicsHe) : splitTopics(content),
    sessions: sessions.length ? sessions : undefined, notTaughtHe: notTaught.length ? notTaught : undefined,
    books: pdfBooks(lines),
  };
}

// ── Shared headless browser (BGU's catalog is a 2006 frame app; Haifa renders links with JS) ──
let browser: Browser | null = null;
const page = async () => (browser ??= await chromium.launch()).newPage();

// Text of a page laid out as "value \n :label" (BGU details table, RTL).
function labelled(text: string) {
  const out: Record<string, string> = {};
  let buf: string[] = [];
  for (const raw of text.split("\n")) {
    const l = clean(raw);
    const m = /^:(.+)$/.exec(l);
    if (m) { out[m[1].trim()] = clean(buf.join(" ")); buf = []; }
    else if (l) buf.push(l);
  }
  return out;
}

// ── Ben-Gurion: annual course catalog (bgu4u) ─────────────────────────────
async function bgu(t: SyllabusTarget): Promise<SyllabusRecord> {
  const [dept, degree, course] = t.code.split(".");
  const p = await page();
  try {
    await p.goto("https://bgu4u.bgu.ac.il/pls/scwp/!sc.AnnualCoursesAdv", { waitUntil: "networkidle", timeout: 90000 });
    const current = Number(await p.$eval("select[name=on_year] option[selected]", (o) => (o as HTMLOptionElement).value));
    let call: string | undefined;
    let year = current;
    for (const y of [current, current - 1]) {
      if (y !== current) await p.goto("https://bgu4u.bgu.ac.il/pls/scwp/!sc.AnnualCoursesAdv", { waitUntil: "networkidle", timeout: 90000 });
      await p.fill("#on_course_department", dept);
      await p.fill("#on_course_degree_level", degree);
      await p.fill("#on_course", course);
      await p.selectOption("select[name=on_year]", String(y));
      await p.evaluate(() => { for (const f of Array.from(document.forms)) f.target = "_self"; });
      await Promise.all([
        p.waitForNavigation({ timeout: 60000 }).catch(() => null),
        p.evaluate("mainValidation3('searchForm', '!sc.AnnualCoursesAdv', CHECK_INPUT_COUNT)"),
      ]);
      call = await p.$$eval("a", (as) => as.map((a) => a.getAttribute("href") ?? "").find((h) => h.includes("goCourseDetails")));
      if (call) { year = y; break; }
    }
    if (!call) throw new Error("course not in the catalog this year or last");
    // The details form targets another frame by default — keep it in this page.
    await p.evaluate(() => { for (const f of Array.from(document.forms)) f.target = "_self"; });
    await Promise.all([p.waitForNavigation({ timeout: 60000 }).catch(() => null), p.evaluate(call.replace(/^javascript:/, ""))]);
    await p.waitForTimeout(1500);
    const f = labelled(await p.evaluate(() => document.body.innerText));
    // The block before ":תקציר" also holds the semester/campus lines and the "course details" link text.
    const content = clean((f["תקציר"] ?? "").replace(/^[\s\S]*\(שעות, בחינות, סילבוס ועוד\)/, ""));
    if (!content) throw new Error("no course description");
    return {
      courseSlug: t.courseSlug, university: "bgu", code: t.code, nameHe: f["שם קורס"] ?? "", year,
      updatedHe: f["עדכון אחרון בשנת"] ? `תיאור הקורס עודכן לאחרונה ב-${f["עדכון אחרון בשנת"]}` : undefined,
      fetchedAt: NOW, source: "bgu-catalog", sourceUrl: "https://bgu4u.bgu.ac.il/html/annual/", level: "topics",
      contentHe: content, topicsHe: splitTopics(content.replace(/:\s*/g, ";")),
      books: f["ביבליוגרפיה"] ? [f["ביבליוגרפיה"].replace(/^ספרות מומלצת:\s*/, "").slice(0, 300)] : undefined,
    };
  } finally { await p.close(); }
}

// ── Haifa: biology department course list → PDF syllabus per course ──────
let haifaLinks: { name: string; url: string }[] | null = null;
async function haifaIndex() {
  if (haifaLinks) return haifaLinks;
  const p = await page();
  try {
    await p.goto("https://sciences.haifa.ac.il/units/school-of-life-sciences/biology-department/%d7%a8%d7%a9%d7%99%d7%9e%d7%aa-%d7%a7%d7%95%d7%a8%d7%a1%d7%99%d7%9d-%d7%93%d7%95-%d7%97%d7%95%d7%92%d7%99-%d7%91%d7%99%d7%95%d7%9c%d7%95%d7%92%d7%99%d7%94/",
      { waitUntil: "networkidle", timeout: 90000 });
    haifaLinks = await p.$$eval("a", (as) => as.map((a) => ({ name: (a.textContent ?? "").trim(), url: (a as HTMLAnchorElement).href })).filter((x) => /\.pdf$/i.test(x.url) && /biology\.haifa/.test(x.url)));
  } finally { await p.close(); }
  return haifaLinks;
}
async function haifa(t: SyllabusTarget): Promise<SyllabusRecord> {
  const key = norm(t.code);
  const link = (await haifaIndex()).find((l) => norm(l.name).replace(/[’`]/g, "").startsWith(key));
  if (!link) throw new Error("no PDF on the department course list");
  const tmp = path.join(os.tmpdir(), `haifa-${t.courseSlug}.pdf`);
  fs.writeFileSync(tmp, Buffer.from(await (await get(link.url)).arrayBuffer()));
  const lines = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", tmp, "-"], { encoding: "utf8" }).split("\n").map(clean).filter(Boolean);
  // Topics usually follow a "נושאי הקורס / תוכן הקורס / תכנית" heading; else keep the start of the document.
  const start = lines.findIndex((l) => /נושאי (?:הקורס|השיעורים)|תוכן הקורס|תכנית הקורס|תוכנית הקורס|פירוט/.test(l));
  const unglue = (l: string) => l.replace(/([A-Za-z])([֐-׿])/g, "$1 $2").replace(/([֐-׿])([A-Za-z])/g, "$1 $2");
  const body = (start >= 0 ? lines.slice(start + 1, start + 45) : lines.slice(0, 45)).filter((l) => !/^\d+$/.test(l)).map(unglue);
  const stop = body.findIndex((l) => /ספרות|ביבליוגרפיה|מטלות|דרישות|הרכב הציון/.test(l));
  const topicLines = stop > 0 ? body.slice(0, stop) : body;
  // A running paragraph ("נושא, נושא, נושא…") rather than one topic per line.
  const paragraph = topicLines.filter((l) => (l.match(/,/g) ?? []).length >= 2).length >= topicLines.length / 2;
  const topics = paragraph
    ? topicLines.join(" ").split(/\s*,\s*|\.\s+/).map(clean).filter((x) => x.length > 2)
    : topicLines.map((l) => l.replace(/^[\d.\-•*]+\s*/, "")).filter((l) => l.length > 3);
  const uploaded = /uploads\/(\d{4})\/(\d{2})\//.exec(link.url);
  return {
    courseSlug: t.courseSlug, university: "haifa", code: t.code, nameHe: link.name, fetchedAt: NOW, source: "haifa-pdf",
    sourceUrl: link.url, updatedHe: uploaded ? `הסילבוס הועלה לאתר ב-${uploaded[2]}/${uploaded[1]}` : undefined,
    level: "topics", contentHe: topicLines.join("\n"), topicsHe: topics.slice(0, 30), books: pdfBooks(lines),
  };
}

const ADAPTERS = { huji, tau, technion, biu, bgu, haifa } as const;

async function main() {
  const only = process.argv.slice(2);
  const targets = SYLLABUS_TARGETS.filter((x) => !only.length || only.includes(x.university));

  // Our course names, to catch stale codes.
  const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
  const ours = new Map((await db.execute(`SELECT slug, "nameHe" FROM Course`)).rows.map((r) => [String(r.slug), String(r.nameHe)]));

  const prev: Record<string, SyllabusRecord> = fs.existsSync(OUT)
    ? JSON.parse(/= (\{[\s\S]*\});\s*$/.exec(fs.readFileSync(OUT, "utf8"))?.[1] ?? "{}")
    : {};
  const next: Record<string, SyllabusRecord> = { ...prev };
  const report: string[] = [];

  for (const t of targets) {
    try {
      const rec = await ADAPTERS[t.university](t);
      const our = ours.get(t.courseSlug) ?? "";
      const nameOk = !rec.nameHe || !our || norm(rec.nameHe).includes(norm(our).split(" ")[0]) || norm(our).includes(norm(rec.nameHe).split(" ")[0]);
      const old = prev[t.courseSlug];
      const status = !old ? "NEW" : old.contentHe !== rec.contentHe ? "CHANGED" : "same";
      next[t.courseSlug] = rec;
      report.push(`${status.padEnd(8)} ${t.university.padEnd(9)} ${t.code.padEnd(9)} ${rec.level.padEnd(8)} ${t.courseSlug}${nameOk ? "" : `   ⚠ name: source "${rec.nameHe}" vs ours "${our}"`}`);
    } catch (e) {
      report.push(`FAILED   ${t.university.padEnd(9)} ${t.code.padEnd(9)} ${"".padEnd(8)} ${t.courseSlug}   (${e instanceof Error ? e.message : e})${prev[t.courseSlug] ? " — kept previous" : ""}`);
    }
    await new Promise((r) => setTimeout(r, 400)); // be polite to university servers
  }

  await browser?.close();
  const body = JSON.stringify(Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b))), null, 1);
  fs.writeFileSync(OUT, `// Generated by scripts/syllabus-fetch.ts — do not edit by hand.\nimport type { SyllabusRecord } from "./types";\n\nexport const SYLLABI: Record<string, SyllabusRecord> = ${body};\n`);
  console.log(report.join("\n"));
  console.log(`\n${Object.keys(next).length} syllabi → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
