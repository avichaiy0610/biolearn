/**
 * Pure parsers and checks for scripts/syllabus-fetch.ts (no network, no file system),
 * so they can be tested on saved fixtures: `npx tsx scripts/syllabus-parse.test.ts`.
 *
 * Rule of this module: never drop source text silently. A parser either returns the whole
 * thing it was asked for, or says it could not (null / `seen: true`) so the caller records a warning.
 */

export const BIDI = /[‎‏‪-‮⁦-⁩]/g;
// Some sources serve the Hebrew gershayim (דנ״א) as "?" — restore it between Hebrew letters.
export const clean = (s: string) => s.replace(BIDI, "").replace(/([֐-׿])\?([֐-׿])/g, "$1״$2").replace(/\s+/g, " ").trim();
export const stripTags = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#0?39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
export const htmlLines = (html: string) => stripTags(html).split("\n").map(clean).filter(Boolean);
export const splitTopics = (s: string) => s.split(/[;؛]|\.\s+(?=[֐-׿A-Z])/).map(clean).map((x) => x.replace(/\.$/, "")).filter((x) => x.length > 2);
export const norm = (s: string) => clean(s).replace(/["'״׳()\-–]/g, "").replace(/\s+/g, " ");

export type Session = { lectures: string; topicsHe: string[] };
export type Teacher = { role: string; name: string };

// ── Text quality: did the PDF text layer extract at all, and is the Hebrew in reading order? ──
export function textQuality(text: string) {
  const heb = (text.match(/[א-ת]/g) ?? []).length;
  const lat = (text.match(/[A-Za-z]/g) ?? []).length;
  const words = text.match(/[א-ת]{2,}/g) ?? [];
  // Final letters (ם ן ץ ף ך) open a word only when the text is stored in visual (reversed) order.
  const finalsFirst = words.filter((w) => /^[םןץףך]/.test(w)).length;
  return { chars: text.length, heb, lat, reversed: words.length > 30 && finalsFirst / words.length > 0.04, empty: heb + lat < 200 };
}

// ── Identity: does this document belong to the course we asked for? ──
const GENERIC = new Set(["מבוא", "כללית", "כללי", "יסודות", "של", "קורס", "introduction", "general", "intro", "fundamentals", "basic", "basics",
  "principles", "course", "the", "and", "for", "to", "of"]);
export const sigWords = (name: string) =>
  norm(name).toLowerCase().split(/[\s,:/]+/).map((w) => w.replace(/^[הולב](?=[א-ת]{4,})/, "")).filter((w) => w.length > 2 && !GENERIC.has(w));
export function identityOk(text: string, id: { code?: string; names: string[] }) {
  const t = norm(text).toLowerCase();
  if (id.code && /^\d{4,}$/.test(id.code) && new RegExp(`(?<!\\d)${id.code.split("").join("[-. ]?")}(?!\\d)`).test(text.replace(BIDI, ""))) return true;
  return id.names.some((n) => { const w = sigWords(n); return w.length > 0 && w.every((x) => t.includes(x)); });
}

// ── Lesson-by-lesson tables: "1  General introduction" … "14  Protein targeting" ──
const PREFIX = "(?:שבוע|שיעור|מפגש|הרצאה|Week|Lecture|Lesson|Session)";
const PURE = new RegExp(`^${PREFIX}?\\s*(?:מס'?\\s*)?(\\d{1,2})[.):]?$`, "i");
// "10 שעתוק" and also "10שעתוק." (pdftotext glues RTL cells) — but not "18.6", "2026" or "90%".
const LEAD = new RegExp(`^${PREFIX}?\\s*(\\d{1,2})(?![\\d%])(?:[.):\\-–](?!\\d))?\\s*([^\\d\\s.,%)(].*)$`, "i");
const TRAIL = new RegExp(`^(\\S.*?)\\s+${PREFIX}?\\s*(\\d{1,2})$`, "i");
// A section heading, with or without its letter ("ג. חובות הקורס:").
const STOP = /^(?:[א-ת]s?[.)]s*)?(?:ספרות|ביבליוגרפיה|מטלות|דרישות|הרכב הציון|חובות|ציון סופי|משקל בציון|Bibliography|Reading|Final exam|Final composition|Requirements|Grading|Textbooks?)/i;

function numbered(cells: string[]): { n: number; text: string } | null {
  if (cells.length === 1) {
    if (/^\d+$/.test(cells[0])) return null; // a page number
    const p = PURE.exec(cells[0]);
    if (p) return { n: +p[1], text: "" };
    const l = LEAD.exec(cells[0]);
    if (l) return { n: +l[1], text: l[2] };
    const t = TRAIL.exec(cells[0]);
    return t ? { n: +t[2], text: t[1] } : null;
  }
  const i = cells.findIndex((c) => PURE.test(c));
  if (i < 0) return null;
  return { n: +PURE.exec(cells[i])![1], text: cells.filter((_, k) => k !== i).join(" ") };
}

/** Finds runs numbered 1,2,3… (≥6 rows) in pdftotext -layout lines (spacing kept).
 *  - sessions: a lesson table — the run sits under a heading that says lesson/week/lecture (or its rows do),
 *    has one text column, no missing rows, and no continuation we failed to follow. One doubtful lesson
 *    table anywhere in the document → null (a partial or interleaved table is worse than none).
 *  - seen: a lesson table exists (parsed or not) — when sessions is null it must be read by eye.
 *  - list: the longest clean numbered run that is NOT a lesson table (a topic list, or a reading list —
 *    the heading tells which), with the heading lines above it. Never presented as lessons. */
const LESSON_WORD = new RegExp(PREFIX, "i");
// The column heading of a lesson table — not any sentence that mentions lessons ("נוכחות בשיעורים חובה").
const LESSON_HEAD = /נושא ה?שיעור|מס'?\s*ה?שיעור|נושא ה?הרצאה|מס'?\s*ה?הרצאה|נושא ה?מפגש|מס'?\s*ה?מפגש|(?:^|[\s·])שבוע(?:[\s·]|$)|Lesson\s*#|Lecture\s*#|Week\s*#|Topic of the (?:lesson|lecture)|Lecture topic|(?:^|[\s·])Week(?:[\s·]|$)/i;
export function numberedSessions(rawLines: string[]): { sessions: Session[] | null; seen: boolean; list: { heading: string; items: string[] } | null } {
  const rows = rawLines.map((l) => l.replace(BIDI, "").trim()).filter(Boolean).map((l) => l.split(/\s{3,}/).map((c) => c.trim()).filter(Boolean));
  let best: Session[] | null = null, broken = false, list: { heading: string; items: string[] } | null = null;
  for (let i = 0; i < rows.length; i++) {
    if (numbered(rows[i])?.n !== 1) continue;
    const out: { n: number; t: string[] }[] = [];
    let expect = 1, pending: string[] = [], gap = 0, multi = false, prefixed = 0;
    for (let j = i; j < rows.length; j++) {
      const r = numbered(rows[j]);
      if (r && r.n === expect) {
        // Lines between two rows: a wrapped topic of the previous row, or — after a row that ended its
        // sentence — a section title that opens the next row ("חלבונים – מבנה ותפקוד" before lesson 13).
        const heading = out.length > 0 && /[.:]$/.test(out[out.length - 1].t.at(-1) ?? "");
        if (out.length && !heading) out[out.length - 1].t.push(...pending);
        if (rows[j].length > 2) multi = true;
        if (LESSON_WORD.test(rows[j].join(" ").replace(r.text, ""))) prefixed++;
        out.push({ n: expect++, t: [...(heading ? pending : []), ...(r.text ? [r.text] : [])] });
        pending = []; gap = 0;
        continue;
      }
      if (rows[j].length === 1 && /^\d+$/.test(rows[j][0])) continue; // page number
      if (STOP.test(rows[j].join(" ")) || ++gap > 6) break;
      if (rows[j].length > 1) multi = true;
      pending.push(rows[j].join(" "));
    }
    if (out.length < 6) continue;
    const heading = rows.slice(Math.max(0, i - 6), i).map((r) => r.join(" ")).join(" · ");
    const lesson = prefixed >= 3 || LESSON_HEAD.test(heading);
    // The run stopped, but the next number shows up further down: the table continues in a form we did not follow.
    const more = rows.slice(i + 1).some((r) => numbered(r)?.n === expect);
    const clean_ = !more && !multi && out.filter((s) => !s.t.length).length <= 1;
    if (lesson && !clean_) broken = true;
    else if (lesson) { if (!best || out.length > best.length) best = out.map((s) => ({ lectures: String(s.n), topicsHe: s.t.map(clean) })); }
    else if (clean_ && (!list || out.length > list.items.length)) list = { heading: clean(heading), items: out.map((s) => clean(s.t.join(" "))) };
  }
  return { sessions: broken ? null : best, seen: broken || best !== null, list };
}

/** Does the document hold a lesson/week table at all? Numbered markers, or the table's own heading. */
export const hasScheduleMarkers = (text: string) => {
  const t = text.replace(BIDI, "");
  return (t.match(new RegExp(`${PREFIX}\\s*(?:מס'?\\s*)?\\d{1,2}`, "gi")) ?? []).length >= 4
    || /נושא השיעור|מס'\s*השיעור|תכנית הוראה מפורטת|לוח (?:ה?הרצאות|ה?שיעורים)|נושא ההרצאה|Course schedule|Lecture schedule|Weekly schedule/i.test(t);
};

/** Grading lines, verbatim: every line that states a percentage. */
export function assessmentLines(lines: string[]) {
  const out = lines.filter((l) => /\d{1,3}\s?%|%\s?\d{1,3}/.test(l) && l.length < 240);
  return out.length ? [...new Set(out)].slice(0, 20) : undefined;
}

const NOISE = /^\d+$|Mount Carmel|הר הכרמל|Website:|E-mail:|^החוג ל|^הפקולטה ל|^Department of|^Faculty of|^Sciences$/;
const TOPICS_HEAD = /נושאי (?:הקורס|השיעורים|הלימוד)|תוכן הקורס|תכנית הקורס|תוכנית הקורס|פירוט הנושאים|^Subjects:?$|^Topics:?$|Course (?:content|outline|topics)/i;
/** The topic part of a syllabus document: from the topics heading to the next section — no line cap. */
export function topicSection(lines: string[]): { lines: string[]; found: boolean } {
  const body = lines.filter((l) => !NOISE.test(l));
  const start = body.findIndex((l) => TOPICS_HEAD.test(l));
  const rest = start >= 0 ? body.slice(start + 1) : body;
  // The topics end at the next section — or where the lesson table begins (its rows are not topic lines).
  const stop = rest.findIndex((l, i) => i > 0 && (STOP.test(l) || /מהלך השיעורים|תכנית הוראה מפורטת|נושא השיעור/.test(l)));
  const out = stop > 0 ? rest.slice(0, stop) : rest;
  // No topics heading: what we return is only the opening of the document (the caller warns) — not all of it as "topics".
  return { lines: start >= 0 ? out : out.slice(0, 40), found: start >= 0 };
}

// Bibliography of a PDF syllabus: the lines after a "ספרות / ביבליוגרפיה / Bibliography" heading.
export function pdfBooks(lines: string[]): string[] | undefined {
  const h = lines.findIndex((l) => l.length < 80 && /(?:^|\s|:)(?:ספרות|ביבליוגרפיה|ספרי (?:לימוד|הקורס)|רשימת קריאה|Bibliography|Reading (?:list|material)|Textbooks?)(?:\s|:|$)/i.test(l));
  if (h < 0) return undefined;
  const out: string[] = [];
  for (const l of lines.slice(h + 1, h + 30)) {
    // Next section, or the page footer (Haifa letterhead), or the Bar-Ilan template appendix.
    if (/מטלות|דרישות|הרכב הציון|ציון|הערכ|נוכחות|שעות קבלה|מבנה הקורס|לוח זמנים|מטרות|תוצרי|הרחבה, הצעות|Mount Carmel|הר הכרמל|E-mail|Faculty|החוג ל|הפקולטה|tests:|reports:|exam:/.test(l)) break;
    // Library shelf marks ("שמור סוציולוגיה …") and headings like "ספר הקורס:".
    if (/^\d+$/.test(l) || l.length < 6 || /שמור |בספרי[יה]ת|^ספר(?:י)? הקורס:?$/.test(l)) continue;
    out.push(l.replace(/^[\d.\-•*)]+\s*/, ""));
  }
  return out.length ? out : undefined;
}

// ── HUJI syllabus API (v2) ──
type L10n = { he?: string | null; en?: string | null } | null | undefined;
const he = (v: unknown) => clean(((v as L10n) ?? {})?.he ?? "");
const heLines = (v: unknown) => (((v as L10n) ?? {})?.he ?? "").split(/\r?\n/).map(clean).filter(Boolean);
export function parseHuji(data: Record<string, unknown>) {
  const grades = (Array.isArray(data.grades) ? data.grades : []) as { name?: L10n; groupName?: L10n; weight?: number }[];
  const other = (Array.isArray(data.gradesOther) ? data.gradesOther : []) as { type?: string; weight?: number; description?: string | null }[];
  const assessment = [
    ...grades.map((g) => `${he(g.name) || he(g.groupName)}${he(g.groupName) && he(g.groupName) !== he(g.name) ? ` (${he(g.groupName)})` : ""} — ${g.weight ?? "?"}%`),
    ...other.map((g) => `${clean(g.type ?? "אחר")}${g.description ? ` (${clean(g.description)})` : ""} — ${g.weight ?? "?"}%`),
    ...heLines(data.evaluation), ...heLines(data.additionalInfo),
    ...heLines(data.attendanceRequirements).map((l) => `נוכחות: ${l}`),
  ];
  const coordinator = he(data.courseCoordinator);
  const teachers: Teacher[] = heLines(data.teachers).map((name) => ({ role: name === coordinator ? "רכז/ת הקורס" : "סגל", name }));
  if (coordinator && !teachers.some((t) => t.name === coordinator)) teachers.unshift({ role: "רכז/ת הקורס", name: coordinator });
  const reading = (k: string) => { const v = (data[k] as L10n) ?? {}; return clean(v?.en ?? v?.he ?? ""); };
  const books = [reading("requiredReading"), reading("additionalReading")].filter(Boolean);
  // Lecturers write the list with ";" or one topic per line — keep the line breaks and split on both.
  const content = heLines(data.courseContent).join("\n");
  const topics = heLines(data.courseContent).flatMap(splitTopics);
  return {
    nameHe: he(data.courseName), contentHe: content, topicsHe: topics,
    semesterHe: he(data.periodName) || undefined, teachers: teachers.length ? teachers : undefined,
    assessmentHe: assessment.length ? assessment : undefined,
    outcomesHe: he(data.learningOutcomes) || undefined, descriptionHe: he(data.courseDescription) || undefined,
    books: books.length ? books : undefined,
    updated: typeof data.updateDate === "string" ? data.updateDate : undefined,
  };
}

// ── TAU IMS syllabus page (public part) ──
export function parseTau(html: string) {
  const lines = htmlLines(html).filter((l) => l !== "-->");
  const after = (label: string) => { const i = lines.indexOf(label); return i >= 0 ? lines[i + 1] ?? "" : ""; };
  const name = after("שם הקורס");
  const start = lines.findIndex((l) => l.startsWith("תוכן הקורס"));
  if (!name || start < 0) return null;
  const end = lines.findIndex((l, i) => i > start && /סילבוס המפורט|^מטלות הקורס|^דרישות קדם/.test(l));
  const content = clean(lines.slice(start + 1, end > 0 ? end : lines.length).join(" "));
  const list = /בין השאר[:,]?\s*([\s\S]+)/.exec(content)?.[1] ?? content;
  const teachers: Teacher[] = [];
  lines.forEach((l, i) => { if (/^(?:מרצה|מתרגל|מתרגלת|מדריך|מדריכה)$/.test(l) && lines[i + 1] && !teachers.some((t) => t.name === lines[i + 1])) teachers.push({ role: l, name: lines[i + 1] }); });
  const a = lines.findIndex((l) => /^מטלות הקורס/.test(l));
  const aEnd = lines.findIndex((l, i) => i > a && /^דרישות קדם/.test(l));
  const assessment = a >= 0 ? lines.slice(a + 1, aEnd > a ? aEnd : a + 12) : [];
  const link = /href=["']([^"']*Syllabus_Download[^"']*)["']/i.exec(html)?.[1]?.replace(/&amp;/g, "&");
  const detail: { state: "file" | "students-only" | "none"; url?: string } = link
    // "&dt=<now>" is a cache-buster the page adds on every load — drop it so the record is stable.
    ? { state: "file", url: new URL(link, "https://www.ims.tau.ac.il/Tal/Syllabus/").href.replace("www30.tau.ac.il", "www.ims.tau.ac.il").replace(/[?&]dt=\d+/, "") }
    : { state: /לתלמידי הקורס בלבד/.test(html) ? "students-only" : "none" };
  return {
    nameHe: name, contentHe: content,
    // Inline bullets: " - " and "•" (which IMS sometimes serves as "?").
    topicsHe: splitTopics(list.replace(/\s+[-•?]\s+/g, "; ")),
    semesterHe: after("סמסטר") || undefined, teachers: teachers.length ? teachers : undefined,
    assessmentHe: assessment.length ? assessment : undefined, detail, lines,
  };
}

// ── Technion students portal course page ──
// The portal lists every library record of the course books: the same book several times (editions, a short
// "Title - Author" line, a long catalog line "Title / authors… - Author"). Keep one line per title.
export function technionBooks(lines: string[]): string[] | undefined {
  const byTitle = new Map<string, { title: string; author: string }>();
  for (const l of lines) {
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

export function parseTechnionPortal(html: string) {
  const title = clean(stripTags(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? ""));
  const name = clean(title.replace(/^.*?\d+\s*-\s*/, "").replace(/\|.*$/, ""));
  const text = htmlLines(html);
  const i = text.indexOf("מידע כללי");
  if (i < 0) return null;
  const desc = clean(text.slice(i + 1, text.findIndex((l, k) => k > i && /^פקולטה:/.test(l))).join(" "));
  const topics = /נושאי\s?הקורס:?\s*([\s\S]+?)(?:\.\s*הערה|$)/.exec(desc)?.[1] ?? desc;
  const b = text.indexOf("ספרי המקצוע");
  const e = text.findIndex((l, k) => k > b && /^מידע סמסטריאלי/.test(l));
  const books = b >= 0 ? technionBooks(text.slice(b + 1, e > b ? e : text.length)) : undefined;
  // "תאחיזה, שחלוף ושיטות…" is one topic: a one-word item belongs with the next one.
  const parts = topics.split(/,\s*|\.\s+/).map(clean).filter(Boolean);
  const merged: string[] = [];
  for (let k = 0; k < parts.length; k++) {
    if (!parts[k].includes(" ") && k + 1 < parts.length) { merged.push(`${parts[k]}, ${parts[k + 1]}`); k++; }
    else merged.push(parts[k]);
  }
  // The semester tabs (newest first). The portal ignores a /YYYY0S URL suffix and always serves these.
  const semesters = [...html.matchAll(/id="s_(\d{6})-tab"[^>]*>\s*([^<]+?)\s*</g)].map((m) => ({ code: m[1], labelHe: clean(stripTags(m[2])) }));
  return { nameHe: name, contentHe: desc, topicsHe: merged.map((x) => x.replace(/\.$/, "")), books, portalSemesters: semesters, lines: text };
}

// ── Technion SAP catalog, per semester (public mirror published by the Cheesefork project) ──
export type SapCourse = { general: Record<string, string>; schedule?: Record<string, string | number>[] };
export const sapCode = (portalCode: string) => `0${portalCode.slice(0, 3)}0${portalCode.slice(3)}`; // 134020 → 01340020
export const sapSemesterHe = (year: number, semester: number) =>
  `${{ 200: "חורף", 201: "אביב", 202: "קיץ" }[semester] ?? `סמסטר ${semester}`} ${year}/${String(year + 1).slice(2)}`;
export function parseSap(c: SapCourse) {
  const teachers: Teacher[] = [];
  const add = (role: string, raw: unknown) => {
    for (const name of String(raw ?? "").split(/\n|,\s*/).map(clean).filter(Boolean))
      if (!teachers.some((t) => t.name === name && t.role === role)) teachers.push({ role, name });
  };
  add("אחראי/ת", c.general["אחראים"]);
  for (const s of c.schedule ?? []) add(String(s["סוג"] ?? "סגל"), s["מרצה/מתרגל"]);
  const exams = ["מועד א", "מועד ב"].filter((k) => c.general[k]).map((k) => `${k}: ${c.general[k]}`);
  return { teachers, examDates: exams.length ? exams : undefined, syllabus: clean(c.general["סילבוס"] ?? ""), nameHe: clean(c.general["שם מקצוע"] ?? "") };
}
/** Same official text? The SAP copy drops line-break spaces ("נושאיהקורס"), so compare without whitespace/punctuation. */
export const sameText = (a: string, b: string) => {
  const k = (s: string) => clean(s).replace(/[\s.,:;'"״׳\-–]/g, "");
  return k(a) === k(b);
};
