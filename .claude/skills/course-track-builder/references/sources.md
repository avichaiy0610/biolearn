# Where each university publishes what (checked 2026-10-18; fetcher findings 2026-11-11)

## What the sync keeps for every course (since 2026-11-11)
`scripts/syllabus-fetch.ts` no longer keeps only a topic list. Per course it writes:
- the record (`content/syllabi/data.generated.ts`): topics, books, and — when the source has them —
  `sessions` (lesson by lesson), `teachers`, `semesterHe`, `assessmentHe` (grading lines), `examDates`,
  `outcomesHe`, `detail` (TAU), `hasUnparsedSchedule`, `warnings`;
- the **full extracted text** of the source: `content/syllabi/text/<slug>.txt` (read this before searching
  the web — it holds everything the university published, including what no parser understood);
- the raw download (PDF/HTML/JSON): `Project One/syllabuses/_fetched/<slug>/` (local only).
`content/syllabi/report.generated.md` lists every warning of the last full run. A record with
`hasUnparsedSchedule` has a weekly table in its PDF whose columns pdftotext interleaves → open the PDF
from `_fetched` with the Read tool and enter the table in `content/syllabi/manual.ts` (verbatim, in order;
the entry is bound to the PDF's sha256 and stops applying, with a warning, when the faculty replaces the
file). Seven Bar-Ilan courses were entered this way on 2026-11-11 (80150, 80202, 80204, 80206, 80214,
80242, 80377). Such an order is `official` / `official-past`.
A document that does not name the course is REJECTED (Haifa links a Medical Microbiology file under
"מבוא לנוירוביולוגיה מערכתית"). Parsers: `scripts/syllabus-parse.ts`, tests `npx tsx scripts/syllabus-parse.test.ts`.

Update this file whenever a source is found, moves, or stops working.

## Technion
- **Official topics:** students portal `students.technion.ac.il/local/technionsearch/course/<6-digit>`
  Has: faculty, "מקצועות ללא זיכוי נוסף" (content-overlap pairs), books. No weekly plan. Adapter: `technion-portal`.
  **The portal's semester block is stale:** its tabs stop at spring 2023/24 and a `/<YYYY0S>` suffix is
  ignored (same page for every code, checked 2026-11-11) — do not take lecturers or exam dates from it.
- **Current semester (lecturer, TAs, exam dates, is the course offered):** the SAP catalog as JSON, published by
  the Cheesefork project: `michael-maltsev.github.io/technion-sap-info-fetcher/last_semesters.json` and
  `courses_<year>_<200 winter|201 spring|202 summer>.json` (course key = 8 digits, 134020 → `01340020`).
  The sync reads the newest semester in which the course appears. Example: 134020 is taught in winter
  2026/27 by a different lecturer than in spring 2025/26 — a new lecturer means a new lecturer profile (step 2b).
  A course missing from the last three semesters gets a warning (not offered, or the code changed).
- **Catalog (programs, electives):** `ugportal.technion.ac.il/wp-content/uploads/2025/11/catalog2025-26.pdf`.
- **Moodle:** `moodle.technion.ac.il` → `moodle26` (תשפ"ז), `moodle25` (תשפ"ו), `moodle24` (תשפ"ה).
  Guest login works (`guest/guest`); course search by 8-digit code (e.g. 01340020). Biology courses
  are closed to guests (1 of 33 open) — guest view still shows lecturer + TA names. Web services
  and the mobile service are enabled; a personal token needs the user's own SSO login (never store it).
- **Faculty of Medicine** publishes full syllabus PDFs with a week-by-week lecture **and tutorial**
  table, lecturers and textbook chapters: `md.technion.ac.il/wp-content/uploads/<yyyy>/<mm>/סילבוס-...pdf`
  (e.g. 274165 גנטיקה כללית לרפואנים, תשפ"ג/תשפ"ד). The site blocks plain HTTP clients sometimes →
  browser fallback. Hebrew does not extract with pdftotext → read visually.
  274165 is a **different course** (medicine, other lecturers) — evidence for 134020, never its order.
- Biology faculty site lists courses but points to the portal for syllabi.

## Hebrew University (HUJI)
- **API:** `shnaton.huji.ac.il/api/syllabus?courseCode=X&year=Y`. Besides `courseContent` it returns the
  grading split (`grades`, `gradesOther` with weights), `teachers`, `courseCoordinator`, `learningOutcomes`,
  `additionalInfo` (pass conditions), attendance, reading — all kept by the sync. `updateDate` shows whether
  the syllabus was revised for the year it is served under (the 2027 record of 72155 was last edited in
  Feb 2026 → carried over; warned).
- **Full page:** `shnaton.huji.ac.il/course/<code>/syllabus/year/<Y>` (JS-rendered; old
  `index.php/NewSyl/<code>/1/<Y>/` redirects here). PDF: `index.php/NewSyl/<code>/1/<Y>/pdf/`.
  Some courses include a weekly table (e.g. 71091); 72155 יסודות הגנטיקה has topics only.

## Tel Aviv University (TAU)
- **Official:** IMS `www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=<8-digit>01&year=<autumn year>`
  — lecturers, topics paragraph (often more detailed than Technion's), no weekly plan seen.
- **The sync follows the detailed file automatically** when the page links one, and records
  `detail.state`: `file` (public — 3 of 8 courses in 2026-11: 0455-1514, 0455-1809, 0455-3066, all with a
  13-lesson table and grading), `students-only`, or `none`.
- **Detailed syllabus PDF ("לסילבוס המפורט"):** the syllabus page links
  `/Tal/Scans/Syllabus_Download.aspx?kurs=<8-digit>&syllabus=<file>.pdf`. Download it from
  **`www.ims.tau.ac.il`** (the same path on `www30.tau.ac.il` returns 404). For 0455-2526 the 2022-23
  file is a full lecture-by-lecture table with dates, lecturers, Griffiths 11th-ed. reading **and
  per-tutorial exercise numbers** ("every tirgul is on the previous lesson"). Recent years' pages
  did not link a file — try the page without `&year=` (www30 `yedion/syllabus.asp?course=<10-digit>`),
  which showed the latest uploaded one. `extract` lists these links under `links`.
- Old `www30.tau.ac.il/yedion/syllabus.asp` pages are windows-1255 (handled by `extract`).
- **Old faculty yedion (2017-18 … 2019-20):** `lifesci.tau.ac.il/yedion/<yyyy-yy>/course<8-digit>` —
  lecture + tutorial groups, lecturers, topics; newer years 404.

## Bar-Ilan (BIU)
- Faculty PDFs (`life-sciences.biu.ac.il/sites/life-sciences/files/shared/...`). Three shapes:
  lecture ranges ("הנושאים שילמדו בשיעורים 1-7") and "לא ילמדו השנה" (genetics); a one-column lesson table
  1…N (parsed: 80103 14 lessons, 80201 25 lessons, 80202); a table with extra columns (reading, dates,
  homework) that pdftotext interleaves (80150, 80214, 80377 … → `hasUnparsedSchedule`, read the PDF by eye).
  Most files state the grading split. The newest file per course is 1-3 years old (warned).

## Ben-Gurion (BGU)
- bgu4u catalog via Playwright (`!sc.AnnualCoursesAdv` → `goCourseDetails`). Topics only; some
  descriptions are decades old (shown on the site).

## Haifa
- Department course-list page → PDFs from 2021. Biochemistry A/B have a lesson table (parsed); the rest are
  topics. Some files are in English. The link "מבוא לנוירוביולוגיה מערכתית" serves a Medical Microbiology
  syllabus → rejected by the identity check; Haifa neurobiology has no public syllabus.

## Student material (lowest tier, verify everything)
- underwar.co.il (one old summary for 134020), Studocu, Scribd — almost nothing useful.
  Public student summaries are not a source for order.
- **Exception — uploaded official syllabi.** Students upload the course's own syllabus PDF to
  Scribd/Studocu. Search `site:scribd.com <course code>` and `site:scribd.com "<Hebrew name>" טכניון`.
  Found this way: 134058 Biology 1, winter 2024 (scribd.com/document/744244211). Scribd's text layer
  is font-encoded → screenshot `https://www.scribd.com/embeds/<id>/content?start_page=1&view_mode=scroll`
  (`.outer_page` elements) with Playwright and read the images. Verify identity (code, year,
  lecturers) as for any source; it is `official-past`, never `official`.

## Assessment and exams (step 2a)
- Grading split: HUJI shnaton, TAU detailed syllabus PDF and BIU faculty PDFs usually state it;
  the Technion portal never does — the staff's own syllabus file (faculty site, Scribd upload,
  older semester) does.
- Past exams: Scribd/Studocu uploads, Google Drive folders that students share publicly
  (`site:drive.google.com <code>`), lecturers' course pages. Exams are evidence of scope and
  format only — never copy questions to the site.
- Formula sheets and "material covered" lists (often scanned) are the best map of a quantitative
  course's examinable content — read them visually.

## Lecturer profile (step 2b)
- Lab websites (Technion: `<name>.net.technion.ac.il`, faculty staff pages), Google Scholar,
  PubMed (last ~5 years). Grant/ERC abstracts summarise the lab's focus in a paragraph.

## Canonical core (step 5a.5)
- Same-name courses with full syllabi: HUJI/TAU/BIU (above), MIT OpenCourseWare (lecture lists,
  problem sets, exams), other universities that publish full syllabi. Use for "what every course
  of this name teaches", never for order.

## Books
- TAU's genetics syllabus states Griffiths *Introduction to Genetic Analysis* 8th ed. "can be
  downloaded legally and for free" — find that official free source before asking for PDFs.

## Dead ends tried
- YouTube lecture playlists for "גנטיקה כללית": none found.
- Technion Moodle course search without login: hidden; with guest login: works.
- NCBI Bookshelf (free Griffiths 7th ed.): reCAPTCHA blocks automated access.
