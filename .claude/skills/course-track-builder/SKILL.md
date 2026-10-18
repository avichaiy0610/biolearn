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

## Workflow

### 1. Official syllabus
Run `syllabus`. Note `level` (topics / lectures), the books, and the source URL. If the record
only lists topics, the rest of the workflow must find the order.

### 2. Discover — this is the main step, not an extra
Run `related`, `staff` (Technion), `discover`. Then run **every** search query, plus your own
variations (course name in English, old course codes, lecturer names from `staff`). Look for:
the course's own syllabus PDF on faculty sites (incl. other faculties that teach a parallel
course — e.g. Technion medicine publishes week-by-week lecture+tutorial tables), older years,
lecturer/TA pages, public course sites, past exams. Extract each candidate, and **follow its
`links`** — official pages often link a detailed syllabus file ("לסילבוס המפורט") that holds the
real lecture and tutorial table (this is how TAU genetics was found).

### 3. Verify identity before using anything (strict)
For each source record: **course code, faculty, year, lecturer**. Same code + same faculty →
the course itself. A "no extra credit" pair or the same course at another university is a
**different course with different material** — it is evidence (`parallel` / `consensus`) and
must never set the order or the content scope of this course. Ask Avichai or Codex when the
identity is ambiguous; never assume.

### 4. Build the order with confidence levels
Write the order file and run `order` until it reports no problems. Confidence, strongest first:
`official` (this course, current year) · `official-past` · `students` (checked by students of
the course) · `parallel` · `consensus` · `textbook`. Lectures take the strongest source marked
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

### 6. Write the plan and units
`content/course-plans/<course>.ts`: set `lectureOrder` / `tutorialOrder` (`OrderSource` with
confidence, Hebrew note and source links). Units follow the lesson format; each unit gets a
Codex review (`ask-codex`), a 390px render check, then Avichai's approval before publishing.

### 7. Keep it fresh
Each semester: re-run `syllabus-fetch.ts`, `staff`, `discover` for changed lecturers or new
PDFs. Student reports ("הסדר אצלכם שונה?") arrive in /admin/feedback — a verified report can
raise a course to `students`.

## Rate Limiting
No documented limits for these university sites → **1 request per second per host**, enforced
across processes with a lock + timestamp file in the temp dir. 5xx/network errors retry with
exponential backoff (logged to stderr); HTTP 429 raises `RateLimitError` and stops. Technion
WordPress sites block bots — `extract` falls back to a real browser (Playwright).

## Common Mistakes
- Using a parallel course's order or content as if it were this course's (it is evidence only).
- Inventing a tutorial order to fill the tab — use `tutorialOrder: null`.
- Treating a guest-closed Moodle as "no information": it still gives staff names → lecturer pages.
- Trusting pdftotext on Hebrew PDFs: when `needsVisualRead`, read the PDF pages visually.
- Copying text, figures or exercises from textbooks or staff material into the site.
- Storing any token or password in a file, HANDOFF or git.
