/**
 * Pulls the CURRENT official syllabus of every course in content/syllabi/registry.ts
 * from the university's public source and writes content/syllabi/data.generated.ts.
 * Run it at the start of each semester; the report lists new/changed/failed/rejected courses
 * and, under each course, the warnings a person must look at. Course plans
 * (content/course-plans) are then reviewed against what changed.
 *
 *   npx tsx scripts/syllabus-fetch.ts                 # all universities
 *   npx tsx scripts/syllabus-fetch.ts huji technion   # some universities
 *   npx tsx scripts/syllabus-fetch.ts biu-cell        # some courses (by our slug)
 *
 * Sources: HUJI syllabus API · TAU IMS syllabus page (+ the detailed syllabus file when public) ·
 * Technion students portal + the SAP catalog of the current semester · Bar-Ilan faculty PDF syllabi ·
 * Ben-Gurion annual course catalog (headless browser) · Haifa biology department PDF syllabi.
 * Needs `pdftotext` on PATH and Playwright's Chromium.
 *
 * Nothing is dropped silently:
 *  - the full extracted text of every source goes to content/syllabi/text/<slug>.txt (in git, with its
 *    sha256 in the record); raw downloads go to ../syllabuses/_fetched/<slug>/ (local, not in git);
 *  - a document that is not this course (name/code not in it) is REJECTED and its record removed;
 *  - an unreadable PDF (scan, reversed Hebrew) or an empty result FAILS and keeps the previous record;
 *  - everything else that needs a human eye is a warning (content/syllabi/report.generated.md).
 * Parsers live in scripts/syllabus-parse.ts and are tested by scripts/syllabus-parse.test.ts.
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { execFileSync } from "child_process";
import { createHash } from "crypto";
import { chromium, type Browser } from "playwright";
import fs from "fs";
import os from "os";
import path from "path";
import { SYLLABUS_TARGETS, type SyllabusTarget } from "../content/syllabi/registry";
import { MANUAL_SYLLABI } from "../content/syllabi/manual";
import type { SyllabusRecord } from "../content/syllabi/types";
import {
  BIDI, assessmentLines, clean, hasScheduleMarkers, identityOk, norm, numberedSessions, parseHuji, parseSap,
  parseTau, parseTechnionPortal, pdfBooks, sameText, sapCode, sapSemesterHe, sigWords, splitTopics, textQuality, topicSection,
  type SapCourse, type Session,
} from "./syllabus-parse";

const OUT = path.join("content", "syllabi", "data.generated.ts");
const REPORT = path.join("content", "syllabi", "report.generated.md");
const TEXT_DIR = path.join("content", "syllabi", "text");
const RAW_DIR = process.env.SYLLABUS_RAW_DIR ?? path.resolve("..", "syllabuses", "_fetched");
const TODAY = new Date();
const NOW = TODAY.toISOString().slice(0, 10);
/** The academic year we are in, named by the year it ends (Nov 2026 → 2027). */
const AY = TODAY.getMonth() >= 8 ? TODAY.getFullYear() + 1 : TODAY.getFullYear();
const UA = { "User-Agent": "Mozilla/5.0 (BioLearn syllabus sync; contact via biolearn-neon.vercel.app)" };

async function get(url: string) {
  const res = await fetch(url, { headers: UA, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

// Staff e-mail addresses are on the public pages, but there is no reason to copy them into the repo.
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;

/** What one adapter collected: the record, plus the proof (full text, raw files) and its own warnings. */
class Evidence {
  private parts: string[] = [];
  private files: { name: string; data: Buffer | string }[] = [];
  warnings: string[] = [];
  isPdf = false;
  /** The documents' own text, without our labels (a label holds the link name, which must not satisfy the identity check). */
  body = "";
  text(label: string, body: string) {
    const b = body.replace(BIDI, "").replace(EMAIL, "[email]").replace(/[ \t]+$/gm, "").trim();
    this.body += `${b}\n`;
    this.parts.push(`===== ${label} =====\n${b}\n`);
  }
  raw(name: string, data: Buffer | string) { this.files.push({ name, data }); }
  get fullText() { return this.parts.join("\n"); }
  /** First 16 hex digits of the sha256 of the downloaded PDF — the key a manual read is bound to. */
  get pdfSha16() {
    const f = this.files.find((x) => /\.pdf$/i.test(x.name) && Buffer.isBuffer(x.data));
    return f ? createHash("sha256").update(f.data).digest("hex").slice(0, 16) : null;
  }
  commit(slug: string): NonNullable<SyllabusRecord["evidence"]> {
    fs.mkdirSync(TEXT_DIR, { recursive: true });
    const textFile = path.join(TEXT_DIR, `${slug}.txt`).replace(/\\/g, "/");
    fs.writeFileSync(textFile, this.fullText, "utf8");
    const dir = path.join(RAW_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of this.files) fs.writeFileSync(path.join(dir, f.name), f.data);
    return { textFile, sha256: createHash("sha256").update(this.fullText).digest("hex"), rawFiles: this.files.length ? this.files.map((f) => f.name) : undefined };
  }
}

function pdfText(buf: Buffer, tag: string) {
  const tmp = path.join(os.tmpdir(), `syllabus-${tag.replace(/[^\w-]/g, "_")}.pdf`);
  fs.writeFileSync(tmp, buf);
  const raw = execFileSync("pdftotext", ["-layout", "-enc", "UTF-8", tmp, "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const rawLines = raw.split("\n").map((l) => l.replace(BIDI, "").replace(/\f/g, ""));
  return { raw, rawLines, lines: rawLines.map(clean).filter(Boolean) };
}

/** Lesson table of a PDF: parsed sessions, or a flag that a schedule exists but must be read by eye. */
function schedule(rawLines: string[], raw: string): { sessions?: Session[]; unparsed: boolean; topicList?: string[] } {
  const n = numberedSessions(rawLines);
  // A numbered list under a "syllabus / topics" heading is the topic list (not lessons, and not a reading list).
  const topicList = n.list && /סילבוס|נושאי|נושאים|תוכן|תכנית|תוכנית|Syllabus|Topics|Subjects|Content|Outline/i.test(n.list.heading)
    && !/ביבליוגרפ|מאמרים|קריאה|Reading|References|Bibliograph/i.test(n.list.heading.split(" · ").at(-1) ?? "") ? n.list.items : undefined;
  if (n.sessions) return { sessions: n.sessions, unparsed: false, topicList };
  return { unparsed: n.seen || hasScheduleMarkers(raw), topicList };
}

// ── HUJI: JSON API ─────────────────────────────────────────────────────────
async function huji(t: SyllabusTarget, ev: Evidence): Promise<SyllabusRecord> {
  let data: Record<string, unknown> | null = null, used = AY; // HUJI year = the spring year
  for (const y of [AY, AY - 1]) {
    const res = await get(`https://shnaton.huji.ac.il/api/syllabus?courseCode=${t.code}&year=${y}`).catch(() => null);
    const j = res ? ((await res.json().catch(() => null)) as Record<string, unknown> | null) : null;
    if (j && (j.courseContent as { he?: string })?.he) { data = j; used = y; break; }
  }
  if (!data) throw new Error("no syllabus in the last two years");
  const { fetchedAt: _f, ...stable } = data; // the API stamps every response
  void _f;
  ev.text(`HUJI syllabus API · course ${t.code} · year ${used}`, JSON.stringify(stable, null, 1));
  ev.raw(`huji-${t.code}-${used}.json`, JSON.stringify(stable, null, 1));
  const p = parseHuji(data);
  if (used !== AY) ev.warnings.push(`אין סילבוס לשנת ${AY}; נלקח הסילבוס של ${used}`);
  // A syllabus that was last edited before its own academic year began was carried over, not revised.
  if (p.updated && p.updated.slice(0, 10) < `${used - 1}-08-01`) ev.warnings.push(`עודכן לאחרונה ב-${p.updated.slice(0, 10)}, לפני תחילת שנת ${used} — ייתכן שגולגל משנה קודמת בלי עדכון`);
  return {
    courseSlug: t.courseSlug, university: "huji", code: t.code, nameHe: p.nameHe, year: used,
    updatedHe: p.updated, fetchedAt: NOW, source: "huji-api",
    sourceUrl: `https://shnaton.huji.ac.il/course/${t.code}/syllabus/year/${used}`,
    level: "topics", contentHe: p.contentHe, topicsHe: p.topicsHe, books: p.books,
    semesterHe: p.semesterHe, teachers: p.teachers, assessmentHe: p.assessmentHe, outcomesHe: p.outcomesHe, descriptionHe: p.descriptionHe,
  };
}

// ── TAU: IMS syllabus page (public part) + the detailed syllabus file when the page links one ──
async function tau(t: SyllabusTarget, ev: Evidence): Promise<SyllabusRecord> {
  const year = AY - 1; // TAU year = the autumn year
  for (const y of [year + 1, year, year - 1]) {
    const url = `https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=${t.code}01&year=${y}`;
    const html = await (await get(url)).text().catch(() => "");
    const p = parseTau(html);
    if (!p) continue;
    ev.text(`TAU IMS syllabus page · ${t.code} · year ${y}`, p.lines.join("\n"));
    ev.raw(`tau-${t.code}-${y}.html`, html);
    const rec: SyllabusRecord = {
      courseSlug: t.courseSlug, university: "tau", code: t.code, nameHe: p.nameHe, year: y, fetchedAt: NOW, source: "tau-ims",
      sourceUrl: url, level: "topics", contentHe: p.contentHe, topicsHe: p.topicsHe,
      semesterHe: p.semesterHe, teachers: p.teachers, assessmentHe: p.assessmentHe, detail: p.detail,
    };
    if (y < year) ev.warnings.push(`אין דף סילבוס לשנה הנוכחית; נלקח הדף של ${y}`);
    if (p.detail.state === "file" && p.detail.url) {
      try {
        const buf = Buffer.from(await (await get(p.detail.url)).arrayBuffer());
        if (buf.subarray(0, 5).toString() !== "%PDF-") throw new Error("not a PDF");
        const pdf = pdfText(buf, `tau-${t.code}`);
        ev.raw(`tau-${t.code}-${y}-detailed.pdf`, buf);
        ev.text(`TAU detailed syllabus file · ${p.detail.url}`, pdf.raw);
        const q = textQuality(pdf.raw);
        if (q.empty || q.reversed) ev.warnings.push("הסילבוס המפורט הוא סריקה או שהעברית בו הפוכה — לקרוא את הקובץ בעין");
        else {
          const s = schedule(pdf.rawLines, pdf.raw);
          if (s.sessions) {
            rec.sessions = s.sessions; rec.level = "lectures";
            // The public page of such a course is often one general paragraph; the lesson table is the topic list.
            if (rec.topicsHe.length < 3) rec.topicsHe = s.sessions.flatMap((x) => x.topicsHe);
          }
          rec.hasUnparsedSchedule = s.unparsed || undefined;
          rec.assessmentHe = [...(rec.assessmentHe ?? []), ...(assessmentLines(pdf.lines) ?? [])];
          rec.books = pdfBooks(pdf.lines);
        }
      } catch (e) { ev.warnings.push(`יש קישור לסילבוס מפורט אך ההורדה נכשלה (${e instanceof Error ? e.message : e})`); }
    } else if (p.detail.state === "students-only") ev.warnings.push("הסילבוס המפורט (לוח הרצאות, ספרים, מטלות) פתוח לתלמידי הקורס בלבד — לא ציבורי");
    return rec;
  }
  throw new Error("no public syllabus for this or last year");
}

// ── Technion: students portal (topics, books) + SAP catalog of the latest semester (who teaches now) ──
const SAP_BASE = "https://michael-maltsev.github.io/technion-sap-info-fetcher/";
let sap: Promise<{ year: number; semester: number; courses: Map<string, SapCourse> }[]> | null = null;
const sapSemesters = () => (sap ??= (async () => {
  const list = (await (await get(`${SAP_BASE}last_semesters.json`)).json()) as { year: number; semester: number; start: string }[];
  const out = [];
  for (const s of list.sort((a, b) => b.start.localeCompare(a.start))) {
    const courses = (await (await get(`${SAP_BASE}courses_${s.year}_${s.semester}.json`)).json()) as SapCourse[];
    out.push({ year: s.year, semester: s.semester, courses: new Map(courses.map((c) => [c.general["מספר מקצוע"], c])) });
  }
  return out;
})());

async function technion(t: SyllabusTarget, ev: Evidence): Promise<SyllabusRecord> {
  const url = `https://students.technion.ac.il/local/technionsearch/course/${t.code}`;
  const html = await (await get(url)).text();
  const p = parseTechnionPortal(html);
  if (!p) throw new Error("no course description");
  ev.text(`Technion students portal · ${t.code}`, p.lines.join("\n"));
  ev.raw(`technion-${t.code}-portal.html`, html);
  const rec: SyllabusRecord = {
    courseSlug: t.courseSlug, university: "technion", code: t.code, nameHe: p.nameHe, fetchedAt: NOW, source: "technion-portal",
    sourceUrl: url, level: "topics", contentHe: p.contentHe, topicsHe: p.topicsHe, books: p.books,
  };
  // The portal's own semester tabs stopped at 2023/24, so lecturers and exam dates come from the SAP catalog.
  try {
    const hit = (await sapSemesters()).map((s) => ({ s, c: s.courses.get(sapCode(t.code)) })).find((x) => x.c);
    if (!hit?.c) ev.warnings.push("הקורס לא מופיע בקטלוג של שלושת הסמסטרים האחרונים — ייתכן שאינו ניתן השנה או שהקוד השתנה");
    else {
      const c = parseSap(hit.c);
      ev.text(`Technion SAP catalog · ${sapSemesterHe(hit.s.year, hit.s.semester)} · ${sapCode(t.code)}`, JSON.stringify(hit.c, null, 1));
      ev.raw(`technion-${t.code}-sap-${hit.s.year}-${hit.s.semester}.json`, JSON.stringify(hit.c, null, 1));
      rec.semesterHe = sapSemesterHe(hit.s.year, hit.s.semester);
      rec.year = hit.s.year + 1;
      rec.teachers = c.teachers.length ? c.teachers : undefined;
      rec.examDates = c.examDates;
      rec.extraSource = { nameHe: "קטלוג המקצועות של הטכניון (SAP), דרך Cheesefork", url: SAP_BASE };
      if (c.syllabus && !sameText(c.syllabus, p.contentHe)) ev.warnings.push("תיאור הקורס בקטלוג הסמסטר שונה מהתיאור בפורטל — להשוות בקובץ הטקסט");
      if (rec.year < AY) ev.warnings.push(`הסמסטר האחרון שבו הקורס מופיע בקטלוג: ${rec.semesterHe}`);
    }
  } catch (e) { ev.warnings.push(`קטלוג הסמסטר (SAP) לא נטען — אין מרצים עדכניים (${e instanceof Error ? e.message : e})`); }
  ev.warnings.push("הפורטל נותן רק רשימת נושאים; הרכב הציון ולוח ההרצאות נמצאים במודל הסגור");
  return rec;
}

// ── Bar-Ilan: faculty PDF syllabi (lecture ranges or a lesson table when the PDF has them) ──
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
async function biu(t: SyllabusTarget, ev: Evidence): Promise<SyllabusRecord> {
  const code = t.code; // 80208 → matches "80208", "80-208", or "208-30" in the file name
  const pat = new RegExp(`${code.slice(0, 2)}-?${code.slice(2)}|(?:^|[^0-9])${code.slice(2)}-30`);
  const links = (await biuIndex()).filter((u) => pat.test(decodeURIComponent(u)));
  if (!links.length) throw new Error("no PDF syllabus on the faculty page");
  // Newest first: "Sylabi25" > "Sylabi24-25" > "Sylabi24" > undated folders.
  const pick = links.sort((a, b) => (/Sylabi(\d+)/.exec(b)?.[1] ?? "0").localeCompare(/Sylabi(\d+)/.exec(a)?.[1] ?? "0"))[0];
  const buf = Buffer.from(await (await get(pick)).arrayBuffer());
  const pdf = pdfText(buf, `biu-${code}`);
  ev.isPdf = true;
  ev.raw(`biu-${code}.pdf`, buf);
  ev.text(`Bar-Ilan faculty syllabus PDF · ${decodeURIComponent(pick)}`, pdf.raw);
  // The faculty template ends with an appendix of writing tips for lecturers — not course content.
  const cut = (ls: string[]) => { const i = ls.findIndex((l) => /הרחבה, הצעות ורעיונות/.test(l)); return i > 0 ? ls.slice(0, i) : ls; };
  const lines = cut(pdf.lines), rawLines = cut(pdf.rawLines);

  let sessions: Session[] = [];
  const notTaught: string[] = [];
  let cur: string[] | null = null;
  for (const l of lines) {
    // A section heading such as "הנושאים שילמדו בשיעורים (1-7 גלית)" — not any line that mentions lessons.
    const h = l.length < 70 && /(?:שילמדו|שיילמדו|נלמדים|הנלמדים) בשיעורים/.test(l) && /(\d+)\s*-\s*(\d+)/.exec(l);
    if (h) { cur = []; sessions.push({ lectures: `${Math.min(+h[1], +h[2])}–${Math.max(+h[1], +h[2])}`, topicsHe: cur }); continue; }
    if (/לא ילמדו השנה/.test(l)) { cur = notTaught; continue; }
    if (/צומצמו|צמצום/.test(l)) { cur = null; continue; }
    if (cur && l.length > 2 && !/^\d+$/.test(l)) cur.push(l.replace(/^[\d.\-:]+\s*/, ""));
  }
  let unparsed = false;
  if (!sessions.length) { const s = schedule(rawLines, rawLines.join("\n")); sessions = s.sessions ?? []; unparsed = s.unparsed; }
  const section = topicSection(lines);
  if (!sessions.length && !section.found) ev.warnings.push("לא נמצאה כותרת נושאים במסמך — הנושאים המוצגים הם פתיחת המסמך; לקרוא את קובץ הטקסט");
  const year = /Sylabi(\d{2})/.exec(pick)?.[1];
  if (!year) ev.warnings.push("שנת הסילבוס לא ידועה (תיקייה בלי שנה באתר הפקולטה)");
  else if (2000 + +year < AY - 1) ev.warnings.push(`הסילבוס החדש ביותר באתר הפקולטה הוא משנת ${2000 + +year}`);
  const content = sessions.length ? sessions.map((s) => `${/–/.test(s.lectures) ? "שיעורים" : "שיעור"} ${s.lectures}: ${s.topicsHe.join("; ")}`).join("\n") : section.lines.join("\n");
  return {
    courseSlug: t.courseSlug, university: "biu", code, nameHe: nameFromFile(pick), year: year ? 2000 + Number(year) : undefined,
    fetchedAt: NOW, source: "biu-pdf", sourceUrl: pick, level: sessions.length ? "lectures" : "topics",
    contentHe: content, topicsHe: sessions.length ? sessions.flatMap((s) => s.topicsHe) : section.lines.filter((l) => l.length > 3),
    sessions: sessions.length ? sessions : undefined, notTaughtHe: notTaught.length ? notTaught : undefined,
    books: pdfBooks(lines), assessmentHe: assessmentLines(lines), hasUnparsedSchedule: unparsed || undefined,
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
async function bgu(t: SyllabusTarget, ev: Evidence): Promise<SyllabusRecord> {
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
      // The result list sometimes renders after the navigation event — wait for it, or a slow page
      // looks like "not in this year's catalog" and the previous year is taken by mistake.
      await p.waitForSelector('a[href*="goCourseDetails"]', { timeout: 10000 }).catch(() => null);
      call = await p.$$eval("a", (as) => as.map((a) => a.getAttribute("href") ?? "").find((h) => h.includes("goCourseDetails")));
      if (call) { year = y; break; }
    }
    if (!call) throw new Error("course not in the catalog this year or last");
    // The details form targets another frame by default — keep it in this page.
    await p.evaluate(() => { for (const f of Array.from(document.forms)) f.target = "_self"; });
    await Promise.all([p.waitForNavigation({ timeout: 60000 }).catch(() => null), p.evaluate(call.replace(/^javascript:/, ""))]);
    await p.waitForTimeout(1500);
    const body = await p.evaluate(() => document.body.innerText);
    ev.text(`Ben-Gurion annual course catalog · ${t.code} · year ${year}`, body);
    ev.raw(`bgu-${t.code}-${year}.txt`, body);
    const f = labelled(body);
    // The block before ":תקציר" also holds the semester/campus lines and the "course details" link text.
    const content = clean((f["תקציר"] ?? "").replace(/^[\s\S]*\(שעות, בחינות, סילבוס ועוד\)/, ""));
    if (!content) throw new Error("no course description");
    if (year !== current) ev.warnings.push(`הקורס לא בשנתון של ${current}; נלקח השנתון של ${year}`);
    const upd = Number(f["עדכון אחרון בשנת"]);
    if (upd && upd < AY - 5) ev.warnings.push(`תיאור הקורס בשנתון עודכן לאחרונה ב-${upd}`);
    ev.warnings.push("השנתון נותן רק תקציר; סילבוס מפורט (לוח הרצאות, הרכב ציון) אינו ציבורי");
    return {
      courseSlug: t.courseSlug, university: "bgu", code: t.code, nameHe: f["שם קורס"] ?? "", year,
      updatedHe: f["עדכון אחרון בשנת"] ? `תיאור הקורס עודכן לאחרונה ב-${f["עדכון אחרון בשנת"]}` : undefined,
      fetchedAt: NOW, source: "bgu-catalog", sourceUrl: "https://bgu4u.bgu.ac.il/html/annual/", level: "topics",
      contentHe: content, topicsHe: splitTopics(content.replace(/:\s*/g, ";")),
      books: f["ביבליוגרפיה"] ? [f["ביבליוגרפיה"].replace(/^ספרות מומלצת:\s*/, "")] : undefined,
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
async function haifa(t: SyllabusTarget, ev: Evidence): Promise<SyllabusRecord> {
  const key = norm(t.code);
  const link = (await haifaIndex()).find((l) => norm(l.name).replace(/[’`]/g, "").startsWith(key));
  if (!link) throw new Error("no PDF on the department course list");
  const buf = Buffer.from(await (await get(link.url)).arrayBuffer());
  const pdf = pdfText(buf, `haifa-${t.courseSlug}`);
  ev.isPdf = true;
  ev.raw(`${t.courseSlug}.pdf`, buf);
  ev.text(`Haifa biology department syllabus PDF · link "${link.name}" · ${decodeURIComponent(link.url)}`, pdf.raw);
  const unglue = (l: string) => l.replace(/([A-Za-z])([֐-׿])/g, "$1 $2").replace(/([֐-׿])([A-Za-z])/g, "$1 $2");
  const lines = pdf.lines.map(unglue);
  const s = schedule(pdf.rawLines, pdf.raw);
  const section = topicSection(lines);
  if (!s.sessions && !s.topicList && !section.found) ev.warnings.push("לא נמצאה כותרת נושאים במסמך — הנושאים המוצגים הם פתיחת המסמך; לקרוא את קובץ הטקסט");
  const topicLines = !s.sessions && s.topicList ? s.topicList : section.lines;
  // A running paragraph ("נושא, נושא, נושא…") rather than one topic per line.
  const paragraph = topicLines.filter((l) => (l.match(/,/g) ?? []).length >= 2).length >= topicLines.length / 2;
  const topics = s.sessions ? s.sessions.flatMap((x) => x.topicsHe)
    : s.topicList ? s.topicList
    : paragraph ? topicLines.join(" ").split(/\s*,\s*|\.\s+/).map(clean).filter((x) => x.length > 2)
    : topicLines.map((l) => l.replace(/^[\d.\-•*]+\s*/, "")).filter((l) => l.length > 3);
  const uploaded = /uploads\/(\d{4})\/(\d{2})\//.exec(link.url);
  if (uploaded && +uploaded[1] < AY - 3) ev.warnings.push(`הסילבוס הועלה לאתר החוג ב-${uploaded[1]} ולא הוחלף מאז`);
  return {
    courseSlug: t.courseSlug, university: "haifa", code: t.code, nameHe: link.name, fetchedAt: NOW, source: "haifa-pdf",
    sourceUrl: link.url, updatedHe: uploaded ? `הסילבוס הועלה לאתר ב-${uploaded[2]}/${uploaded[1]}` : undefined,
    level: s.sessions ? "lectures" : "topics",
    contentHe: s.sessions ? s.sessions.map((x) => `שיעור ${x.lectures}: ${x.topicsHe.join("; ")}`).join("\n") : topicLines.join("\n"),
    topicsHe: topics, sessions: s.sessions, books: pdfBooks(lines), assessmentHe: assessmentLines(lines),
    hasUnparsedSchedule: s.unparsed || undefined,
  };
}

const ADAPTERS = { huji, tau, technion, biu, bgu, haifa } as const;

/** Checks that apply to every source. `reject` = this is not our course; `fatal` = unusable, keep the previous record. */
function validate(rec: SyllabusRecord, t: SyllabusTarget, ours: { he: string; en: string } | undefined, ev: Evidence) {
  const names = [rec.nameHe, ours?.he ?? "", ours?.en ?? "", /^\d/.test(t.code) ? "" : t.code].filter(Boolean);
  if (ev.isPdf) {
    const q = textQuality(ev.body);
    if (q.empty) return { fatal: "the PDF has no text layer (a scan) — read it by eye" };
    if (q.reversed) return { fatal: "the PDF's Hebrew extracted in reversed order — read it by eye" };
    // PDFs are found by file name or link text, so the document itself must name the course.
    if (!identityOk(ev.body, { code: /^\d+$/.test(t.code) ? t.code : undefined, names: [ours?.he ?? "", ours?.en ?? "", /^\d/.test(t.code) ? "" : t.code].filter(Boolean) }))
      return { reject: `the document does not name this course (looked for ${JSON.stringify(names)}) — the site links a different file` };
  }
  if (rec.contentHe.length < 60) return { fatal: `content is only ${rec.contentHe.length} characters` };
  const w = ev.warnings;
  const our = ours?.he ?? "";
  if (rec.nameHe && our && !sigWords(our).some((x) => norm(rec.nameHe).includes(x)) && !sigWords(rec.nameHe).some((x) => norm(our).includes(x)))
    w.unshift(`שם הקורס במקור "${rec.nameHe}" שונה משלנו "${our}" — ייתכן שהקוד התיישן`);
  if (rec.topicsHe.length < 3) w.push(`רק ${rec.topicsHe.length} נושאים חולצו`);
  if (rec.hasUnparsedSchedule) w.push("במסמך יש טבלת שבועות/שיעורים שלא פוענחה אוטומטית (עמודות מעורבבות) — לקרוא את ה-PDF בעין ולהזין את הסדר");
  if (!rec.assessmentHe?.length && rec.university !== "technion" && rec.university !== "bgu") w.push("המקור לא מציין הרכב ציון");
  if (!rec.books?.length) w.push("המקור לא מציין ספרים");
  return {};
}

/** A lesson table that a person read from this exact PDF (content/syllabi/manual.ts) replaces what the text layer gave. */
function applyManual(rec: SyllabusRecord, ev: Evidence) {
  const m = MANUAL_SYLLABI[rec.courseSlug];
  if (!m) return;
  if (ev.pdfSha16 !== m.pdfSha16) {
    ev.warnings.push(`ה-PDF באתר הוחלף מאז הקריאה הידנית (${m.readAt}) — הטבלה הידנית לא הוחלה; לקרוא את הקובץ החדש ולעדכן content/syllabi/manual.ts`);
    return;
  }
  const label = m.sessionLabelHe ?? "שיעור";
  rec.sessions = m.sessions;
  rec.sessionLabelHe = m.sessionLabelHe;
  rec.level = "lectures";
  rec.topicsHe = m.sessions.flatMap((s) => s.topicsHe);
  rec.contentHe = m.sessions.map((s) => `${s.partHe ? `${s.partHe}\n` : ""}${label} ${s.lectures}: ${s.topicsHe.join("; ")}`).join("\n");
  rec.assessmentHe = m.assessmentHe ?? rec.assessmentHe;
  rec.hasUnparsedSchedule = undefined;
  rec.manual = { readAt: m.readAt, noteHe: m.noteHe };
  ev.warnings = ev.warnings.filter((w) => !/לא נמצאה כותרת נושאים/.test(w));
}

const fingerprint = (r?: SyllabusRecord) => r && JSON.stringify([r.contentHe, r.sessions, r.assessmentHe, r.teachers, r.semesterHe, r.books, r.year]);

async function main() {
  const args = process.argv.slice(2);
  const slugs = new Set(SYLLABUS_TARGETS.map((x) => x.courseSlug));
  const targets = SYLLABUS_TARGETS.filter((x) => !args.length || args.includes(x.university) || args.includes(x.courseSlug));
  const unknown = args.filter((a) => !(a in ADAPTERS) && !slugs.has(a));
  if (unknown.length) throw new Error(`unknown university or course: ${unknown.join(", ")}`);

  // Our course names, to catch stale codes and wrong documents.
  const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
  const ours = new Map((await db.execute(`SELECT slug, "nameHe", "nameEn" FROM Course`)).rows.map((r) => [String(r.slug), { he: String(r.nameHe), en: String(r.nameEn) }]));

  const prev: Record<string, SyllabusRecord> = fs.existsSync(OUT)
    ? JSON.parse(/= (\{[\s\S]*\});\s*$/.exec(fs.readFileSync(OUT, "utf8"))?.[1] ?? "{}")
    : {};
  const next: Record<string, SyllabusRecord> = { ...prev };
  const report: string[] = [];

  for (const t of targets) {
    const head = (status: string, level = "") => `${status.padEnd(8)} ${t.university.padEnd(9)} ${t.code.padEnd(9)} ${level.padEnd(8)} ${t.courseSlug}`;
    try {
      const ev = new Evidence();
      const rec = await ADAPTERS[t.university](t, ev);
      applyManual(rec, ev);
      const v = validate(rec, t, ours.get(t.courseSlug), ev);
      if (v.reject) {
        delete next[t.courseSlug];
        fs.rmSync(path.join(TEXT_DIR, `${t.courseSlug}.txt`), { force: true });
        report.push(`${head("REJECTED")}   (${v.reject})${prev[t.courseSlug] ? " — previous record removed" : ""}`);
      } else if (v.fatal) throw new Error(v.fatal);
      else {
        rec.evidence = ev.commit(t.courseSlug);
        rec.warnings = ev.warnings.length ? ev.warnings : undefined;
        // JSON round-trip drops undefined fields (an unchanged record stays byte-identical in git) and redacts e-mails.
        const stored: SyllabusRecord = JSON.parse(JSON.stringify(rec, (_k, v) => (typeof v === "string" ? v.replace(EMAIL, "[email]") : v)));
        const old = prev[t.courseSlug];
        const status = !old ? "NEW" : fingerprint(old) !== fingerprint(stored) ? "CHANGED" : "same";
        next[t.courseSlug] = stored;
        report.push(head(status, rec.level), ...ev.warnings.map((x) => `           ⚠ ${x}`));
      }
    } catch (e) {
      report.push(`${head("FAILED")}   (${e instanceof Error ? e.message : e})${prev[t.courseSlug] ? " — kept previous" : ""}`);
    }
    await new Promise((r) => setTimeout(r, 400)); // be polite to university servers
  }

  await browser?.close();
  const body = JSON.stringify(Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b))), null, 1);
  fs.writeFileSync(OUT, `// Generated by scripts/syllabus-fetch.ts — do not edit by hand.\nimport type { SyllabusRecord } from "./types";\n\nexport const SYLLABI: Record<string, SyllabusRecord> = ${body};\n`);
  const count = (s: string) => report.filter((l) => l.startsWith(s)).length;
  const summary = `${targets.length} targets: ${count("NEW")} new, ${count("CHANGED")} changed, ${count("same")} same, ${count("FAILED")} failed, ${count("REJECTED")} rejected, ${report.filter((l) => l.includes("⚠")).length} warnings`;
  if (!args.length) fs.writeFileSync(REPORT, `# Syllabus sync report — ${NOW}\n\n${summary}\n\n\`\`\`\n${report.join("\n")}\n\`\`\`\n`);
  console.log(report.join("\n"));
  console.log(`\n${summary}\n${Object.keys(next).length} syllabi → ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
