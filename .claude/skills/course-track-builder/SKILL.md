---
name: course-track-builder
description: >-
  Build or audit a BioLearn course track for any Israeli university without insider access:
  official syllabus → lecture order → tutorials → full content coverage, every item with a
  verified source and a confidence level. Use when adding a university course to the site,
  when a course plan has guessed/"soon" parts, when someone asks where an order comes from,
  or when a student reports that the order at their university is different.
---

# Course Track Builder

## Overview
A course track on BioLearn = the official topics, a lecture order, tutorials, and units that
cover every topic. Avichai can verify the Technion from the inside; for every other
university nobody can. So the rule is: **find as much as possible yourself, prove what you
found belongs to this course, label everything by how sure we are, and never present a guess
as the course's real order.**

Read `references/sources.md` first — what each university publishes, where, and what failed.
Read `references/calibration-2026-11.md` too — what this skill missed on 29 Technion courses
when checked against the real exams, HW and syllabi, and why. Every step below marked
**(calibration)** exists because of a miss listed there.

## Dependencies
- `ask-codex` — independent review of every new unit (scientific accuracy, quiz keys) and a
  second opinion when a source's identity is unclear.
- `syllabus-sources` memory + `scripts/syllabus-fetch.ts` — the official syllabus sync this
  skill builds on (do not reimplement the university adapters).
- WebSearch / WebFetch (agent tools) — run the queries that `discover` emits.
- Read tool — PDFs whose Hebrew does not extract (`extract` flags `needsVisualRead`).

## Quick Start (from the biolearn repo root)
```bash
S=.claude/skills/course-track-builder/scripts/course_sources.py; O=<scratchpad>/ctb
uv run $S syllabus --course tau-genetics --output $O/syl.json
uv run $S related  --course tau-genetics --university tau --name "גנטיקה כללית" --output $O/rel.json
uv run $S discover --course tau-genetics --university tau --code 04552526 --name "גנטיקה כללית" --output $O/disc.json
#   → run every disc.json searchQueries with WebSearch; extract each promising hit:
uv run $S extract  --url "<hit>" --workdir $O/src1 --output $O/src1.json
#   → write $O/order.json (format below), then:
uv run $S order    --input $O/order.json --output $O/order-report.md
uv run $S coverage --course tau-genetics --output $O/cov.json
```

## Utility Scripts
`scripts/course_sources.py` (stdlib only; all output to `--output`; exit 1 on problems):

| command | what it does |
|---|---|
| `syllabus --course` | The synced official record (topics, books, level, source URL). Missing → add to `content/syllabi/registry.ts` and run `npx tsx scripts/syllabus-fetch.ts <uni>`. |
| `related --course --university [--code] [--name]` | Technion: reads the portal's **"מקצועות ללא זיכוי נוסף" / "(מוכלים)"** pairs and each pair's faculty (`sameFaculty`). All universities: same-name courses in the synced syllabi. |
| `staff --university technion --code 0134xxxx --years 2027,2026` | Moodle **guest login**: the course's pages per year, lecturer/TA names, guest open/closed, section names if open. |
| `discover --course --university --code --name [--staff "a,b"]` | Probes known public URL patterns (old TAU yedion, TAU IMS, HUJI NewSyl PDF, Technion per-semester portal) and emits site-scoped search queries. |
| `extract --url --workdir` | Downloads page/PDF (real-browser fallback for bot walls), extracts text, lists weekly-row candidates, flags `needsVisualRead` when Hebrew did not extract. |
| `order --input` | Validates the curated order file: confidence names, **identity checks** (a different course can never be official), tutorials without a source. Writes a Markdown report. |
| `coverage --course` | Plan ↔ lessons: unresolved sections/problems, "soon" placeholders, topics with no full unit, drafts. |
| `scope --course (--suggest [--evidence kind=path ...] \| --check)` | Is each lesson section part of the course? `--suggest` matches `references/section-keywords.json` against the course's own documents (synced syllabus + `exam`/`reading`/`staff-material` files) → core / likely / extension with the matched words. `--check` validates `content/course-scope/<course>.ts` (every plan section has an entry; level matches evidence). |

## Workflow

### 1. Official syllabus
Run `syllabus`. Note `level` (topics / lectures), the books, and the source URL. If the record
only lists topics, the rest of the workflow must find the order.

### 2. Discover — this is the main step, not an extra
Run `related`, `staff` (Technion), then `discover` with `--staff` (lecturer names add the
lecturer-profile queries). Then run **every** search query, plus your own
variations (course name in English, old course codes, lecturer names from `staff`). Look for:
the course's own syllabus PDF on faculty sites (incl. other faculties that teach a parallel
course — e.g. Technion medicine publishes week-by-week lecture+tutorial tables), older years,
lecturer/TA pages, public course sites, past exams. Extract each candidate, and **follow its
`links`** — official pages often link a detailed syllabus file ("לסילבוס המפורט") that holds the
real lecture and tutorial table (this is how TAU genetics was found).

### 2a. Assessment — how the course is graded and what its exams ask (mandatory) (calibration)
11 of 29 audited Technion courses had **no exam** (research proposal, paper critique, project,
poster); most of the rest examine experiment design or data reading, not recall. Units that only
train recall missed all of it. So, before writing:
1. Find the grading line: the syllabus PDF (HUJI/TAU/BIU usually state it), older semesters, the
   faculty's syllabus files, Scribd/Studocu uploads of the syllabus, the lecturer's course page.
   The Technion portal does not show grading — search for the staff's own syllabus file.
2. Find real exam questions: `discover` emits queries for Scribd, Studocu, public Google Drive
   folders and "מועד א" pages. Scans need a visual read. Note the *format*: time, aids (formula
   sheet? open book?), MC vs open, recurring question types (e.g. "a paper figure from the
   lecturer's field — fill in, predict, design").
3. Write an **assessment note** in the plan header: grading split, exam format, recurring
   question types, with sources — or "not found".
4. **Practice follows the assessment.** Project/proposal course → units end with "design the
   follow-up experiment / critique this figure" practice and a project-guide unit. Exam course
   → worked problems in the exam's own format (state table → Z → P in biophysics; RFLP × pedigree
   in genetics; data panels in gene expression). **Not found → default to mixed practice**
   (experiment design + data reading + calculation where the field is quantitative), never
   recall-only.

5. **Newest material first.** Courses change (topics, lecturers, assessment). Rank every source by
   year and read the newest year's material in full (syllabus, schedule, summaries, lecture
   files, tutorials, exams) before older material; older exams only add weight to topics the
   newest material still names. When fixing an existing course, refresh its gap list from its
   newest material first, then write.

### 2b. Lecturer profile (mandatory) (calibration)
Lecturers teach and examine their own field: muscle atrophy got 3 weeks in physiology
(lecturer's lab), cell fusion and myoblast fusion appeared in developmental-biology exams
(Podbilewicz lab), the last question of every virology exam was a paper from the lecturer's
field, single-molecule methods dominate biophysics (Kaplan). This is public:
1. From `staff` / the portal / the syllabus take every lecturer and guest lecturer.
2. Read each lab page and the last ~5 years of papers (titles + abstracts). Write a short
   **lecturer note**: research topics, model organisms, favourite methods.
3. A syllabus topic that matches the lecturer's field → raise it to core and give it depth
   (not a passing mention). A field topic the syllabus does not name → "likely", only with a
   second signal (old exam, guest-lecture title, course-page section).
4. Prepare at least one "paper from the lecturer's field" practice item per course (figure
   reading, predict the KO result, design the next experiment). Never copy the paper's figures.

### 3. Verify identity before using anything (strict)
For each source record: **course code, faculty, year, lecturer**. Same code + same faculty →
the course itself. A "no extra credit" pair or the same course at another university is a
**different course with different material** — it is evidence (`parallel` / `consensus`) and
must never set the order or the content scope of this course. Ask Avichai or Codex when the
identity is ambiguous; never assume.

### 4. Build the order with confidence levels
Write the order file and run `order` until it reports no problems. Confidence, strongest first:
`official` (this course, current year) · `official-past` · `students` (checked by students of
the course) · `syllabus` (the topic order of the course's own syllabus, when it has no weeks) · `parallel` · `consensus` · `textbook` · `suggested` (no source for the order at all: our learning order of the
official topics — say so in the note, keep the syllabus order in the topics view). Lectures take the strongest source marked
`usedFor: lectures`. **Tutorials:** only from a real source; with none, set `tutorialOrder:
null` — the site then shows each session as "תרגול על הרצאה n" with an explicit note. Never
invent a tutorial order.

Order file:
```json
{ "course": "tau-genetics", "university": "tau", "code": "04552526", "faculty": "מדעי החיים", "year": 2027,
  "lectures": [{ "n": 1, "titleHe": "...", "topics": ["..."] }], "tutorials": null,
  "sources": [{ "url": "...", "kind": "syllabus-pdf", "confidence": "official-past",
               "identity": { "code": "04552526", "faculty": "מדעי החיים", "year": 2020 },
               "usedFor": ["lectures"], "noteHe": "..." }] }
```

### 5. Coverage
**The syllabus sets the scope; the textbook does not.** A course textbook covers far more than
the course — never add a topic just because it is in the book (a whole book section ≠ course
material). Use the book only to detail and fact-check topics the syllabus names; when unsure
whether a subtopic is taught, ask Avichai or mark it as extension.
Expand every syllabus topic into subtopics from the course's own textbooks
(`Project One/textbooks` when the PDF is there; otherwise the publisher's table of contents),
cross-checked with the same course at other universities. Every subtopic needs real content.
Run `coverage`; zero unresolved, zero placeholders, zero topics without a unit before calling
a course done. Mark material beyond the syllabus as extension — hide, never delete.

### 5a. Decide the subtopics yourself — before writing a word (mandatory)
Avichai (2026-10-21): "you must know by yourself what is in the course". Two failures so far (134020, 134119)
came from filling each topics-only heading with the whole textbook chapter. Before writing units:
1. **Read the course name as the scope.** "בקרת הביטוי הגנטי" = *regulation* — a mechanism enters only as far as
   it regulates expression. Material that belongs to another course of the same faculty goes there (check the
   faculty's other syllabi: e.g. riboswitches/lncRNA → 134151 RNA, CRISPR → 134082 molecular).
2. **Consensus of equivalent courses.** Collect detailed syllabi of the same course elsewhere — prefer ones using
   the **same textbooks** (e.g. Haifa 223.3003 uses Lewin + Brown like 134119), plus the Technion medicine pair.
   A subtopic in most of them = core; in none = do not write it (archive it if already written).
3. **Completeness inside the scope comes from the course book's own lists.** When a topic is in scope, cover what
   the book's section/table lists (e.g. Brown Table 11.1 for DNA-binding motifs), not only the famous examples.
4. **Never exclude a topic the official text names (calibration).** A broad official heading
   ("therapeutic and diagnostic agents", "cell death", "population genetics") is filled with the
   field's canonical examples, not dropped. 136014 excluded CAR-T although the portal said
   "therapeutic agents" — the 2025 syllabus had engineered T cells, immunotherapy, Gleevec,
   Herceptin, Rituximab as named lectures. Excluding needs a document that shows it is not taught.
5. **Canonical core of the course type (calibration).** Intro courses have topics every course of
   that name teaches, even when a short portal paragraph omits them: Hardy–Weinberg in general
   genetics, recombinant DNA + PCR in Biology 1, speciation + kin selection in evolution, apoptosis
   in cell biology. Build the list from ≥3 detailed syllabi of same-name courses (other Israeli
   universities, MIT OCW and other open full syllabi); a topic in most of them is at least
   "likely" and gets a unit or a section.
6. **Methods are content (calibration).** Topic lists rarely name methods; exams test them.
   Go through `references/methods-checklist.md` for the course type and place every listed
   method in the unit where it is used (with what it shows and its limits).
7. **Faculty de-duplication (calibration).** Before writing a unit, check whether the topic is a
   full topic of another required course of the same faculty (photosynthesis → plant physiology,
   not metabolic pathways; operons → molecular biology, not gene-expression control; immunology →
   immunology, not microbiology). If so it becomes a refresher link, not a unit.
8. Write the subtopic list with its evidence into the plan header comment, then write units.
Removed material is never deleted: keep full copies under `content/lessons/_archive/<course>/` with a README.

### 5b. Scope of every section — from documents only
Nobody's word is evidence: not a student's, not Avichai's (his answers about 134020 are used only
to *calibrate* the rule), not student reports. Evidence, strongest first: past exams of the course,
its assigned reading (pages/sections), the staff's own material, the syllabus naming the topic
(or a topic the section is part of **by definition**), a broader syllabus heading. Levels:
**core** (any of the first four) · **likely** (heading only — `_heading` keywords) · **extension**
(nothing; e.g. textbook only). Run `scope --suggest`, review every row, write
`content/course-scope/<course>.ts`, run `scope --check`. The site shows the level and its evidence
under every section heading and in the plan.
**Honest limit (calibration, Technion 134020, 2026-10-18):** with only an 8-heading topic list the
rule cannot tell transposons/sex ratio/gametogenesis/position effect (not taught) from fragile X
(taught) — all come out "likely". Only detailed documents (reading, exams) separate them, so
finding those documents is the real work. Never *add* new content at "likely" just because the
textbook has it.

### 6. Write the plan and units
`content/course-plans/<course>.ts`: set `lectureOrder` / `tutorialOrder` (`OrderSource` with
confidence, Hebrew note and source links). Units follow the lesson format; each unit gets a
Codex review (`ask-codex`), a 390px render check, then Avichai's approval before publishing.

### 6a. Figures — no text on lines
Draw from the textbook figure as a visual reference only (never copy). A label goes beside or
above its line, arrow or curve — never on it. Before committing figures, run
`node scripts/figure-audit.mjs <out.json> <slug...>` (dev server on :3123) and look at every hit;
then screenshot the figures and check them by eye (the audit also flags labels inside segments,
which are fine).

### 7. Keep it fresh
Each semester: re-run `syllabus-fetch.ts`, `staff`, `discover` for changed lecturers or new
PDFs; a new lecturer means a new lecturer profile (2b). Course numbers change (134152 → 134157):
search the old and new code. Student reports ("הסדר אצלכם שונה?") arrive in /admin/feedback —
a verified report can raise a course to `students`.
**Students are the only source for what is never public** (exact lecture order, Technion grading,
recent exams): every exam a student uploads (`/admin/exams`) and every recurring lesson-chat gap
(`scripts/question-gaps.ts`) re-opens step 2a and the scope check for that course. Weigh recent
material (2022+) over old exams — a 2010 exam can describe an older version of the course.

## Rate Limiting
No documented limits for these university sites → **1 request per second per host**, enforced
across processes with a lock + timestamp file in the temp dir. 5xx/network errors retry with
exponential backoff (logged to stderr); HTTP 429 raises `RateLimitError` and stops. Technion
WordPress sites block bots — `extract` falls back to a real browser (Playwright).

## Common Mistakes
- Using a parallel course's order or content as if it were this course's (it is evidence only).
- Writing recall-only units without knowing how the course is graded (step 2a).
- Skipping the lecturer's research field — it is where exam questions and extra depth come from.
- Dropping a named official topic as "too clinical / catalogue" — fill it with canonical examples.
- A unit for a topic that is another faculty course's full topic (refresher link instead).
- Treating a topic list as complete when it names no methods (methods checklist).
- Inventing a tutorial order to fill the tab — use `tutorialOrder: null`.
- Treating a guest-closed Moodle as "no information": it still gives staff names → lecturer pages.
- Trusting pdftotext on Hebrew PDFs: when `needsVisualRead`, read the PDF pages visually.
- Copying text, figures or exercises from textbooks or staff material into the site.
- Storing any token or password in a file, HANDOFF or git.
