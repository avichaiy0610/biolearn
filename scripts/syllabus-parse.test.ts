/**
 * Regression tests for the syllabus parsers, on real pages saved on 2026-11-11.
 *   npx tsx scripts/syllabus-parse.test.ts
 * When a university changes its page layout these fail loudly instead of the sync writing wrong data.
 * To refresh a fixture, save the new page/pdftotext output over the file in scripts/__fixtures__/syllabi.
 */
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import {
  assessmentLines, clean, hasScheduleMarkers, identityOk, numberedSessions, parseHuji, parseSap, parseTau, parseTechnionPortal,
  pdfBooks, sameText, sapCode, textQuality, topicSection, BIDI,
} from "./syllabus-parse";

const fx = (name: string) => fs.readFileSync(path.join(__dirname, "__fixtures__", "syllabi", name), "utf8");
const raw = (name: string) => fx(name).split("\n").map((l) => l.replace(BIDI, "").replace(/\f/g, ""));
const lines = (name: string) => raw(name).map(clean).filter(Boolean);
let n = 0;
const test = (name: string, fn: () => void) => { fn(); n++; console.log(`ok  ${name}`); };

test("Bar-Ilan: a one-column lesson table is parsed lesson by lesson, complete", () => {
  const { sessions } = numberedSessions(raw("biu-80103-lesson-table.txt"));
  assert.equal(sessions?.length, 14);
  assert.deepEqual(sessions![0], { lectures: "1", topicsHe: ["General introduction"] });
  assert.deepEqual(sessions![4].topicsHe, ["The cytoskeleton – structures and function + motor proteins"]);
  assert.deepEqual(sessions![13], { lectures: "14", topicsHe: ["Intracellular protein targeting"] });
});

test("Bar-Ilan: grading lines, books and identity come out of the same document", () => {
  const l = lines("biu-80103-lesson-table.txt");
  assert.ok(assessmentLines(l)?.some((x) => x.includes("90%")));
  assert.ok(pdfBooks(l)?.[0].includes("Molecular Biology of the Cell"));
  assert.ok(identityOk(fx("biu-80103-lesson-table.txt"), { code: "80103", names: [] }));
});

test("Bar-Ilan: a multi-column weekly table is NOT parsed (columns interleave) but is reported", () => {
  const r = numberedSessions(raw("biu-80150-multicolumn-table.txt"));
  assert.equal(r.sessions, null);
  assert.ok(r.seen || hasScheduleMarkers(fx("biu-80150-multicolumn-table.txt")));
  assert.ok(assessmentLines(lines("biu-80150-multicolumn-table.txt"))?.some((x) => x.includes("85%")));
});

test("Bar-Ilan: row numbers glued to the text (10שעתוק) do not cut the table at lesson 9", () => {
  const { sessions } = numberedSessions(raw("biu-80201-glued-numbers.txt"));
  assert.equal(sessions?.length, 25);
  assert.deepEqual(sessions![9].topicsHe, ["שעתוק."]);
  assert.ok(sessions![12].topicsHe[0].startsWith("חלבונים") && sessions![12].topicsHe.at(-1) === "תרמודינמיקה של קיפול חלבונים.");
  assert.deepEqual(sessions![11].topicsHe, ["תרגום."]);
  assert.deepEqual(sessions![24].topicsHe, ["אלוסטריות."]);
});

test("Bar-Ilan: a table with reading columns beside the topics is reported, never half-parsed", () => {
  const r = numberedSessions(raw("biu-80214-reading-columns.txt"));
  assert.equal(r.sessions, null);
  assert.ok(r.seen || hasScheduleMarkers(fx("biu-80214-reading-columns.txt")));
});

test("Bar-Ilan: a numbered reading list is never taken for the lesson table", () => {
  const r = numberedSessions(raw("biu-80202-reading-list.txt"));
  assert.equal(r.sessions, null);
  assert.ok(r.list?.items[0].startsWith("The energetic brain") && /מאמרים/.test(r.list.heading));
  assert.ok(hasScheduleMarkers(fx("biu-80202-reading-list.txt"))); // the real table is multi-column → flagged
});

test("Haifa: a numbered list under 'סילבוס כללי' is a topic list, not lessons", () => {
  const r = numberedSessions(raw("haifa-biochem-a-topic-list.txt"));
  assert.equal(r.sessions, null);
  assert.equal(r.list?.items.length, 11);
  assert.ok(/סילבוס כללי/.test(r.list!.heading) && r.list!.items[1].startsWith("Hemoglobin"));
});

test("TAU: the public detailed syllabus file gives the 13 lessons in order", () => {
  const r = numberedSessions(raw("tau-04551809-detailed.txt"));
  assert.equal(r.sessions?.length, 13);
  assert.deepEqual(r.sessions![1].topicsHe, ["הביוספרה"]);
  assert.deepEqual(r.sessions![12].topicsHe, ["אקולוגיה של שינויים גלובליים"]);
});

test("Haifa: the file linked as 'מבוא לנוירוביולוגיה' is a Medical Microbiology syllabus → identity fails", () => {
  const doc = fx("haifa-wrong-document.txt");
  assert.equal(identityOk(doc, { names: ["מבוא לנוירוביולוגיה", "Introduction to Neurobiology"] }), false);
  assert.equal(identityOk(fx("haifa-microbiology.txt"), { names: ["מיקרוביולוגיה כללית", "General Microbiology"] }), true);
});

test("Haifa: the topic section runs to the end of the topics, with no line cap", () => {
  const s = topicSection(lines("haifa-wrong-document.txt"));
  assert.ok(s.found);
  assert.ok(s.lines.some((l) => l.startsWith("Respiratory tract infections")));
  assert.ok(!s.lines.some((l) => /Mount Carmel/.test(l)));
});

test("text quality: real text passes; a scan and reversed Hebrew are caught", () => {
  assert.deepEqual([textQuality(fx("biu-80150-multicolumn-table.txt")).empty, textQuality(fx("biu-80150-multicolumn-table.txt")).reversed], [false, false]);
  assert.ok(textQuality("  \n 3 \n").empty);
  const reversed = Array(40).fill("םיאת ןונגנמ הקיטנג םינג ךרד").join(" ");
  assert.ok(textQuality(reversed).reversed);
});

test("HUJI: grading, staff, outcomes and reading are kept, not only the topic list", () => {
  const p = parseHuji(JSON.parse(fx("huji-72155.json")));
  assert.equal(p.nameHe, "יסודות הגנטיקה");
  assert.ok(p.topicsHe.length >= 10 && p.topicsHe[0] === "חוקי מנדל");
  assert.ok(p.assessmentHe?.some((x) => /מבחן.*75%/.test(x)) && p.assessmentHe?.some((x) => /מעבדה — 20%/.test(x)));
  assert.ok(p.teachers?.some((t) => t.role === "רכז/ת הקורס" && t.name.includes("אמיר עדן")));
  assert.ok(p.teachers!.length >= 10);
  assert.ok(p.outcomesHe?.includes("עצי משפחה"));
  assert.ok(p.books?.[0].includes("Genetic Analysis"));
  assert.equal(p.updated, "2026-02-15T19:18:00");
  assert.equal(p.semesterHe, "סמסטר ב");
});

test("TAU: lecturers, semester, assignments and the state of the detailed syllabus", () => {
  const p = parseTau(fx("tau-04552526.html"))!;
  assert.equal(p.nameHe, "גנטיקה כללית");
  assert.equal(p.teachers?.length, 3);
  assert.equal(p.semesterHe, "א' תשפ\"ז");
  assert.ok(p.assessmentHe?.includes("בחינה סופית"));
  assert.equal(p.detail.state, "students-only");
  assert.ok(p.contentHe.includes("אבולוציה של גנים וגנומים") && !p.contentHe.includes("מטלות הקורס"));
  assert.ok(p.topicsHe.length >= 15);
});

test("Technion portal: topics, de-duplicated books, and the semester tabs it really serves", () => {
  const p = parseTechnionPortal(fx("technion-134020-portal.html"))!;
  assert.equal(p.nameHe, "גנטיקה כללית");
  assert.ok(p.topicsHe.includes("ניתוח שושלות"));
  assert.ok(p.books!.length >= 4 && p.books!.length <= 8);
  assert.equal(p.portalSemesters[0].code, "202302"); // the portal's tabs stop at spring 2023/24
});

test("Technion SAP: the current lecturer and exam dates; same official text as the portal", () => {
  assert.equal(sapCode("134020"), "01340020");
  assert.equal(sapCode("066418"), "00660418");
  const c = JSON.parse(fx("technion-134020-sap.json"));
  const s = parseSap(c);
  assert.ok(s.teachers.some((t) => t.role === "הרצאה" && t.name.includes("בן-עוז")));
  assert.ok(s.teachers.some((t) => t.role === "תרגול"));
  assert.equal(s.examDates?.length, 2);
  assert.ok(sameText(s.syllabus, parseTechnionPortal(fx("technion-134020-portal.html"))!.contentHe));
});

console.log(`\n${n} tests passed`);
