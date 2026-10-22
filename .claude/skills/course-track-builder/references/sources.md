# Where each university publishes what (checked 2026-10-18)

Update this file whenever a source is found, moves, or stops working.

## Technion
- **Official topics:** students portal `students.technion.ac.il/local/technionsearch/course/<6-digit>`
  (+ `/<YYYY0S>` for a past semester). Has: faculty, lecturer, TA names, "מקצועות ללא זיכוי נוסף"
  (content-overlap pairs), books. No weekly plan. Adapter: `technion-portal`.
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
- **API:** `shnaton.huji.ac.il/api/syllabus?courseCode=X&year=Y` (many fields often null).
- **Full page:** `shnaton.huji.ac.il/course/<code>/syllabus/year/<Y>` (JS-rendered; old
  `index.php/NewSyl/<code>/1/<Y>/` redirects here). PDF: `index.php/NewSyl/<code>/1/<Y>/pdf/`.
  Some courses include a weekly table (e.g. 71091); 72155 יסודות הגנטיקה has topics only.

## Tel Aviv University (TAU)
- **Official:** IMS `www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course=<8-digit>01&year=<autumn year>`
  — lecturers, topics paragraph (often more detailed than Technion's), no weekly plan seen.
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
- Faculty PDFs (`life-sciences.biu.ac.il/sites/life-sciences/files/shared/...`) — several have
  lecture ranges ("שיעורים 1-7") and "לא ילמדו השנה". 7 more synced records show weekly markers
  not yet parsed into lectures.

## Ben-Gurion (BGU)
- bgu4u catalog via Playwright (`!sc.AnnualCoursesAdv` → `goCourseDetails`). Topics only; some
  descriptions are decades old (shown on the site).

## Haifa
- Department course-list page → PDFs from 2021. Topics only.

## Student material (lowest tier, verify everything)
- underwar.co.il (one old summary for 134020), Studocu, Scribd — almost nothing useful.
  Public student summaries are not a source for order.
- **Exception — uploaded official syllabi.** Students upload the course's own syllabus PDF to
  Scribd/Studocu. Search `site:scribd.com <course code>` and `site:scribd.com "<Hebrew name>" טכניון`.
  Found this way: 134058 Biology 1, winter 2024 (scribd.com/document/744244211). Scribd's text layer
  is font-encoded → screenshot `https://www.scribd.com/embeds/<id>/content?start_page=1&view_mode=scroll`
  (`.outer_page` elements) with Playwright and read the images. Verify identity (code, year,
  lecturers) as for any source; it is `official-past`, never `official`.

## Books
- TAU's genetics syllabus states Griffiths *Introduction to Genetic Analysis* 8th ed. "can be
  downloaded legally and for free" — find that official free source before asking for PDFs.

## Dead ends tried
- YouTube lecture playlists for "גנטיקה כללית": none found.
- Technion Moodle course search without login: hidden; with guest login: works.
- NCBI Bookshelf (free Griffiths 7th ed.): reCAPTCHA blocks automated access.
