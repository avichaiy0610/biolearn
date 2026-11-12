#!/usr/bin/env python3
"""Find and check sources for a university course track (BioLearn).

Every command writes JSON (or Markdown) to --output and prints one status line.
Run from the biolearn repo root:  uv run .claude/skills/course-track-builder/scripts/course_sources.py <cmd> ...

Commands
  syllabus  — the synced official syllabus record for a course (content/syllabi/data.generated.ts)
  related   — parallel courses: Technion "no extra credit" pairs + same-name courses at other universities
  staff     — Technion Moodle guest scan: course pages per year, staff names, open/closed to guests
  discover  — probe known public URL patterns and emit web-search queries for the agent to run
  extract   — a page/PDF/DOCX from --url (browser fallback for bot walls, Wayback fallback for dead links) or
              --file; full text to <workdir>/source.txt, text quality, identity check, weekly-schedule candidates
  order     — validate a curated order file (sources, identity checks, confidence) → Markdown report
  coverage  — plan ↔ lessons check for a course: unresolved items, placeholders, drafts, empty topics
  local     — everything already on this machine for a course: official files (syllabuses/_manifest.json), the
              student drive by kind and year, scans that need a visual read. Run it BEFORE searching the web.
  ledger    — per course: do we hold the lesson order, grading split, current staff, recent exams, a fresh
              syllabus — and from where. The measure of completeness (content/syllabi/ledger.generated.md).
  scope     — is each lesson section part of the course? --suggest from the course's own documents
              (syllabus / reading / exams / staff material), --check validates content/course-scope/<course>.ts
"""
from __future__ import annotations

import argparse
import html
import http.cookiejar
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (BioLearn course-track-builder; +https://biolearn-neon.vercel.app)"
RATE_SECONDS = 1.0  # no documented limits for these university sites → 1 request/second per host
LOCK_DIR = Path(tempfile.gettempdir()) / "course-track-builder-locks"
REPO = Path.cwd()
TECHNION_MOODLE = {2027: "moodle26", 2026: "moodle25", 2025: "moodle24"}  # academic year (ends) → host


class RateLimitError(RuntimeError):
    pass


def _throttle(host: str) -> None:
    """Cross-process: at most one request per RATE_SECONDS per host (file timestamp + lock file)."""
    LOCK_DIR.mkdir(parents=True, exist_ok=True)
    stamp, lock = LOCK_DIR / f"{host}.last", LOCK_DIR / f"{host}.lock"
    for _ in range(200):
        try:
            fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            break
        except FileExistsError:
            if time.time() - lock.stat().st_mtime > 30:
                lock.unlink(missing_ok=True)
            time.sleep(0.05)
    else:
        raise RuntimeError(f"could not acquire rate lock for {host}")
    try:
        last = float(stamp.read_text()) if stamp.exists() else 0.0
        wait = RATE_SECONDS - (time.time() - last)
        if wait > 0:
            time.sleep(wait)
        stamp.write_text(str(time.time()))
    finally:
        os.close(fd)
        lock.unlink(missing_ok=True)


class Client:
    def __init__(self) -> None:
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))

    def get(self, url: str, data: dict | None = None, retries: int = 3) -> tuple[int, str, bytes]:
        host = urllib.parse.urlparse(url).netloc
        body = urllib.parse.urlencode(data).encode() if data is not None else None
        delay = 2.0
        for attempt in range(retries + 1):
            _throttle(host)
            req = urllib.request.Request(url, data=body, headers={"User-Agent": UA})
            try:
                with self.opener.open(req, timeout=60) as r:
                    return r.status, r.headers.get("content-type", ""), r.read()
            except urllib.error.HTTPError as e:
                text = e.read()[:400].decode("utf-8", "replace")
                if e.code == 429:
                    raise RateLimitError(f"429 from {url} (limit used: 1 req/{RATE_SECONDS}s): {text}")
                if e.code >= 500 and attempt < retries:
                    print(f"retry {attempt + 1} after {e.code} for {url}", file=sys.stderr)
                    time.sleep(delay)
                    delay *= 2
                    continue
                return e.code, e.headers.get("content-type", ""), text.encode()
            except urllib.error.URLError as e:
                if attempt < retries:
                    print(f"retry {attempt + 1} after {e.reason} for {url}", file=sys.stderr)
                    time.sleep(delay)
                    delay *= 2
                    continue
                return 0, "", str(e.reason).encode()
        return 0, "", b""


def text_of(raw: bytes) -> str:
    s = raw.decode("utf-8", "replace")
    s = re.sub(r"<(script|style)\b.*?</\1>", " ", s, flags=re.S | re.I)
    return " ".join(html.unescape(re.sub(r"<[^>]+>", "\n", s)).split())


def write(out: str, obj) -> None:
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    if isinstance(obj, str):
        Path(out).write_text(obj, encoding="utf-8")
    else:
        Path(out).write_text(json.dumps(obj, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Success! Written to: {out}")


def load_syllabi() -> dict:
    src = (REPO / "content/syllabi/data.generated.ts").read_text(encoding="utf-8")
    start = src.index("= {") + 2
    end = src.rindex("}") + 1
    return json.loads(src[start:end])


# ---------- shared checks ----------

def academic_year() -> int:
    """The academic year we are in, named by the year it ends (Nov 2026 → 2027)."""
    t = time.localtime()
    return t.tm_year + 1 if t.tm_mon >= 9 else t.tm_year


def text_quality(text: str) -> dict:
    """Did the text layer extract, and is the Hebrew in reading order? (same rule as scripts/syllabus-parse.ts)"""
    heb, lat = len(re.findall(r"[א-ת]", text)), len(re.findall(r"[A-Za-z]", text))
    words = re.findall(r"[א-ת]{2,}", text)
    finals_first = sum(1 for w in words if w[0] in "םןץףך")  # a final letter opens a word only in reversed text
    return {"chars": len(text), "hebrew": heb, "latin": lat, "empty": heb + lat < 200,
            "reversed": len(words) > 30 and finals_first / len(words) > 0.04}


def docx_text(path: Path) -> str:
    """Text of a .docx (paragraphs; table cells joined by ' | '), stdlib only."""
    import zipfile
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8", "replace")
    # A table row stays one line: cells joined by " | ", paragraphs inside a cell by " / ".
    xml = re.sub(r"<w:tc>.*?</w:tc>", lambda m: re.sub(r"</w:p>", " / ", m[0]) + " | ", xml, flags=re.S)
    xml = re.sub(r"</w:p>|<w:br[^>]*/>|</w:tr>", "\n", xml)
    xml = re.sub(r"<w:tab[^>]*/>", "\t", xml)
    lines = (re.sub(r"(?:\s*/\s*)+(?=\s*\||\s*$)", "", l).strip(" |") for l in html.unescape(re.sub(r"<[^>]+>", "", xml)).splitlines())
    return "\n".join(l for l in lines if l.strip(" |/"))


def wayback(client: "Client", url: str) -> dict | None:
    """Closest Internet Archive snapshot of a URL that no longer answers, or None."""
    st, _, raw = client.get("https://archive.org/wayback/available?" + urllib.parse.urlencode({"url": url}))
    if st != 200:
        return None
    try:
        snap = json.loads(raw).get("archived_snapshots", {}).get("closest")
    except Exception:
        return None
    return {"url": snap["url"].replace("http://", "https://", 1), "timestamp": snap["timestamp"]} if snap and snap.get("available") else None


HEB_YEARS = {"תשפז": 2027, "תשפו": 2026, "תשפה": 2025, "תשפד": 2024, "תשפג": 2023, "תשפב": 2022, "תשפא": 2021, "תשפ": 2020,
             "תשעט": 2019, "תשעח": 2018, "תשעז": 2017, "תשעו": 2016, "תשעה": 2015, "תשעד": 2014, "תשעג": 2013}


def path_year(p: str) -> int:
    """Newest year a file path names (2024, תשפ"ד …); 0 when it names none."""
    q = re.sub(r"[\"״_']", "", p)
    ys = [int(y) for y in re.findall(r"(?<!\d)(20[0-2]\d|199\d)(?!\d)", q)]
    ys += [v for k, v in HEB_YEARS.items() if k in q]
    return max(ys) if ys else 0


def identity_in_text(text: str, code: str | None, names: list[str]) -> dict:
    """Does a document itself name the course? code with optional separators/zero padding, or every significant word of a name."""
    t = re.sub(r"[‎‏‪-‮⁦-⁩]", "", text)
    digits = re.sub(r"\D", "", code or "")
    code_hit = False
    if len(digits) >= 5:
        core = digits.lstrip("0")
        pats = {"[-. ]?".join(core)}
        if len(core) == 6:  # Technion 134020 ↔ 01340020 / 2760413
            pats.add("[-. ]?".join(core[:3] + "0" + core[3:]))
        code_hit = any(re.search(r"(?<!\d)0?" + p + r"(?!\d)", t) for p in pats)
    generic = {"מבוא", "כללית", "כללי", "יסודות", "של", "קורס", "introduction", "general", "the", "and", "for", "to", "of"}
    low = re.sub(r"[\"'״׳()\-–]", "", t).lower()
    def sig(n: str) -> list[str]:
        ws = [re.sub(r"^[הולב](?=[א-ת]{4,})", "", w) for w in re.split(r"[\s,:/]+", re.sub(r"[\"'״׳()\-–]", "", n).lower())]
        return [w for w in ws if len(w) > 2 and w not in generic]
    name_hit = next((n for n in names if n and sig(n) and all(w in low for w in sig(n))), None)
    return {"code": code_hit, "name": name_hit, "ok": bool(code_hit or name_hit)}


# ---------- local material (the folders next to the repo) ----------
PROJECT = REPO.parent
LOCAL_SYL = PROJECT / "syllabuses"
DRIVE_IX = PROJECT / "biology drive" / "_text" / "index.json"
SCHEDULE_RE = re.compile(r"שבוע|שיעור \d|הרצאה \d|מפגש \d|Week|Lecture \d|L\d{1,2}:|\b\d{1,2}[./]\d{1,2}(?:[./]\d{2,4})?\b|\b\d{1,2}(?:st|nd|rd|th)\b")


def _local_syllabi(code: str) -> list[dict]:
    """Official files in Project One/syllabuses mapped to this course by the curated _manifest.json."""
    mf = LOCAL_SYL / "_manifest.json"
    if not mf.exists():
        return []
    out = []
    for row in json.loads(mf.read_text(encoding="utf-8")).get("files", []):
        if re.sub(r"\D", "", row.get("code") or "").lstrip("0") != re.sub(r"\D", "", code).lstrip("0"):
            continue
        txt_path = LOCAL_SYL / "_text" / (row["file"] + ".txt")
        text = txt_path.read_text(encoding="utf-8", errors="replace") if txt_path.exists() else ""
        out.append({**row, "path": str(LOCAL_SYL / row["file"]), "textFile": str(txt_path) if text else None,
                    "exists": (LOCAL_SYL / row["file"]).exists(), "chars": len(text),
                    "scheduleMarkers": len(SCHEDULE_RE.findall(text)),
                    "gradingLines": [l.strip() for l in text.splitlines() if re.search(r"\d{1,3}\s?%|%\s?\d{1,3}", l)][:12]})
    return out


def _unmapped_local() -> list[str]:
    mf = LOCAL_SYL / "_manifest.json"
    if not LOCAL_SYL.exists():
        return []
    known = {r["file"] for r in json.loads(mf.read_text(encoding="utf-8")).get("files", [])} if mf.exists() else set()
    return sorted(p.name for p in LOCAL_SYL.iterdir() if p.is_file() and not p.name.startswith("_") and p.name not in known)


_drive_cache: list | None = None


def _drive(code: str) -> dict:
    """The student Drive's extracted files for this course, by kind and year (Technion only; never copied to the site)."""
    global _drive_cache
    if _drive_cache is None:
        _drive_cache = json.loads(DRIVE_IX.read_text(encoding="utf-8")) if DRIVE_IX.exists() else []
    core = re.sub(r"\D", "", code).lstrip("0")
    rows = [r for r in _drive_cache if str(r.get("course", "")).lstrip("0") == core]
    by: dict = {}
    for r in rows:
        k = by.setdefault(r.get("cat", "other"), {"files": 0, "readable": 0, "needVisualRead": 0, "years": {}})
        k["files"] += 1
        if r.get("status") == "ok":
            k["readable"] += 1
        elif r.get("status") in ("unreadable", "no-text"):
            k["needVisualRead"] += 1
        y = path_year(r.get("path", ""))
        if y:
            k["years"][y] = k["years"].get(y, 0) + 1
    for k in by.values():
        k["newest"] = max(k["years"]) if k["years"] else None
        k["years"] = dict(sorted(k["years"].items(), reverse=True))
    return {"files": len(rows), "byKind": by,
            "unreadable": [r["path"] for r in rows if r.get("status") in ("unreadable", "no-text")][:40]}


def cmd_local(a) -> None:
    """Everything already on this machine for a course — read it BEFORE searching the web."""
    rec = load_syllabi().get(a.course, {})
    code = a.code or rec.get("code") or ""
    if not code:
        sys.exit("error: no code — pass --code or sync the course first")
    out = {"course": a.course, "code": code,
           "syncedTextFile": (rec.get("evidence") or {}).get("textFile"),
           "officialFiles": sorted(_local_syllabi(code), key=lambda r: -(r.get("year") or 0)),
           "drive": _drive(code), "unmappedFilesInSyllabuses": _unmapped_local(),
           "instructions": "Read the newest official file first (its textFile, or the file itself when the text is poor), then the "
                           "newest exams and homework in the drive. Files under needVisualRead are scans: open them with the Read tool. "
                           "Any unmappedFilesInSyllabuses must get a row in syllabuses/_manifest.json after reading them."}
    write(a.output, out)


def _ledger_row(slug: str, rec: dict) -> dict:
    code, uni = rec.get("code", ""), rec.get("university", "")
    local = _local_syllabi(code) if uni == "technion" else []
    drive = _drive(code) if uni == "technion" else {"files": 0, "byKind": {}, "unreadable": []}
    ay = academic_year()
    newest_local = max((f.get("year") or 0 for f in local), default=0)
    exams = drive["byKind"].get("exam", {})
    recent_exams = sum(n for y, n in (exams.get("years") or {}).items() if y >= ay - 4)
    order = "synced" if rec.get("level") == "lectures" else "local file" if any(f["scheduleMarkers"] >= 6 for f in local) else None
    grading = "synced" if rec.get("assessmentHe") else "local file" if any(f["gradingLines"] for f in local) else None
    staff = bool(rec.get("teachers"))
    fresh = (rec.get("year") or 0) >= ay - 1 or newest_local >= ay - 2
    have = {"lessonOrder": order, "grading": grading, "currentStaff": "synced" if staff else None,
            "recentExams": f"{recent_exams} since {ay - 4}" if recent_exams else None, "freshSyllabus": "yes" if fresh else None}
    return {"course": slug, "university": uni, "code": code, "nameHe": rec.get("nameHe"), "level": rec.get("level"),
            "syllabusYear": rec.get("year"), "newestLocalFile": newest_local or None, "localFiles": len(local),
            "driveFiles": drive["files"], "needVisualRead": len(drive["unreadable"]), "warnings": len(rec.get("warnings") or []),
            "have": have, "missing": [k for k, v in have.items() if not v],
            "score": f"{sum(1 for v in have.values() if v)}/{len(have)}"}


def cmd_ledger(a) -> None:
    """What we hold per course and what is still missing — the measure of 'how complete is this course'."""
    syl = load_syllabi()
    slugs = [a.course] if a.course else sorted(syl, key=lambda s: (syl[s]["university"], s))
    rows = [_ledger_row(s, syl[s]) for s in slugs if s in syl]
    if a.course and not rows:
        sys.exit(f"error: no synced syllabus for '{a.course}'")
    if a.output.endswith(".json"):
        write(a.output, rows)
        return
    he = {"lessonOrder": "סדר שיעורים", "grading": "הרכב ציון", "currentStaff": "סגל עדכני", "recentExams": "מבחנים עדכניים", "freshSyllabus": "סילבוס עדכני"}
    md = [f"# Evidence ledger — {time.strftime('%Y-%m-%d')}", "",
          "Generated by `course_sources.py ledger`. Five things are checked per course: lesson order, grading split, current staff, "
          "recent exams (last 4 years), a syllabus from this or last year. A cell says where the item comes from "
          "(`synced` = the university's public source in content/syllabi; `local file` = an official file in Project One/syllabuses; "
          "exams = the student drive, Technion only). Empty = we do not have it.", "",
          "| course | code | score | " + " | ".join(he.values()) + " | local files | drive files | scans to read | warnings |",
          "|---|---|---|" + "---|" * len(he) + "---|---|---|---|"]
    for r in rows:
        md.append(f"| {r['course']} | {r['code']} | {r['score']} | " + " | ".join(str(r["have"][k] or "") for k in he) +
                  f" | {r['localFiles'] or ''} | {r['driveFiles'] or ''} | {r['needVisualRead'] or ''} | {r['warnings'] or ''} |")
    by_uni: dict = {}
    for r in rows:
        u = by_uni.setdefault(r["university"], {"n": 0, **{k: 0 for k in he}})
        u["n"] += 1
        for k in he:
            u[k] += 1 if r["have"][k] else 0
    md += ["", "## By university (courses that have each item)", "", "| university | courses | " + " | ".join(he.values()) + " |",
           "|---|---|" + "---|" * len(he)]
    md += [f"| {u} | {v['n']} | " + " | ".join(str(v[k]) for k in he) + " |" for u, v in sorted(by_uni.items())]
    unmapped = _unmapped_local()
    if unmapped:
        md += ["", "## Files in Project One/syllabuses with no manifest row", *[f"- {f}" for f in unmapped]]
    write(a.output, "\n".join(md) + "\n")


# ---------- commands ----------

def cmd_syllabus(a) -> None:
    rec = load_syllabi().get(a.course)
    if not rec:
        sys.exit(f"error: no synced syllabus for '{a.course}'. Add it to content/syllabi/registry.ts and run "
                 f"`npx tsx scripts/syllabus-fetch.ts {a.university or ''}` first.")
    write(a.output, rec)


def _technion_portal(client: Client, code: str) -> dict:
    url = f"https://students.technion.ac.il/local/technionsearch/course/{code}"
    st, _, raw = client.get(url)
    t = text_of(raw)
    def between(a_: str, b_: list[str]) -> str:
        i = t.find(a_)
        if i < 0:
            return ""
        j = min([k for k in (t.find(x, i + len(a_)) for x in b_) if k > 0] or [i + 400])
        return t[i + len(a_): j].strip(" :")
    codes = lambda s: re.findall(r"(\d{6}) - ([^\d]+?)(?= \d{6} - |$)", s)
    return {
        "url": url, "status": st,
        "faculty": ((re.search(r"פקולטה: ([^|]+)", t) or [None, ""])[1] or "").strip() or None,
        "noExtraCredit": codes(between("מקצועות ללא זיכוי נוסף", ["מקצועות ללא זיכוי נוסף (מוכלים)", "ספרי המקצוע"])),
        "contained": codes(between("(מוכלים)", ["ספרי המקצוע", "מידע סמסטריאלי"])),
        "books": between("ספרי המקצוע", ["מידע סמסטריאלי", "מידע כללי"])[:400],
    }


def cmd_related(a) -> None:
    client = Client()
    out: dict = {"course": a.course, "university": a.university}
    if a.university == "technion":
        if not a.code:
            sys.exit("error: --code (6-digit portal code) is required for technion")
        me = _technion_portal(client, a.code)
        out["self"] = me
        out["parallel"] = []
        for code, name in me["noExtraCredit"] + me["contained"]:
            other = _technion_portal(client, code)
            out["parallel"].append({"code": code, "name": name.strip(), "faculty": other["faculty"], "url": other["url"],
                                    "sameFaculty": other["faculty"] == me["faculty"]})
    syl = load_syllabi()
    mine = syl.get(a.course, {})
    name = (mine.get("nameHe") or a.name or "").strip()
    norm = lambda txt: {re.sub(r"^[הו](?=[֐-׿]{3,})", "", w) for w in re.findall(r"[֐-׿]{3,}", txt)}
    words = norm(name) - {"מבוא", "כללית", "כללי", "יסודות"}
    out["otherUniversities"] = [
        {"course": k, "university": r["university"], "nameHe": r["nameHe"], "sourceUrl": r.get("sourceUrl"), "level": r.get("level")}
        for k, r in syl.items()
        if r["university"] != a.university and words and words <= norm(r["nameHe"])
    ]
    write(a.output, out)


def cmd_staff(a) -> None:
    if a.university != "technion":
        sys.exit("error: staff currently supports --university technion only (guest login). Add other Moodles in references/sources.md first.")
    years = [int(y) for y in a.years.split(",")]
    res = []
    for y in years:
        host = TECHNION_MOODLE.get(y)
        if not host:
            res.append({"year": y, "error": "unknown Moodle host for this year — update TECHNION_MOODLE"}); continue
        base = f"https://{host}.technion.ac.il"
        c = Client()
        _, _, raw = c.get(f"{base}/login/index.php")
        tok = re.search(rb'name="logintoken" value="([^"]+)"', raw)
        c.get(f"{base}/login/index.php", data={"username": "guest", "password": "guest", "logintoken": tok[1].decode() if tok else ""})
        _, _, raw = c.get(f"{base}/course/search.php?" + urllib.parse.urlencode({"search": a.code, "perpage": "all"}))
        ids = sorted(set(re.findall(rb"course/view\.php\?id=(\d+)", raw)), key=int)
        for cid in ids:
            st, _, page = c.get(f"{base}/course/view.php?id={cid.decode()}")
            t = text_of(page)
            title = (re.search(rb"<title>([^<]*)", page) or [b"", b""])[1].decode("utf-8", "replace")
            if a.code not in title:
                continue
            closed = "אורחים אינם יכולים לגשת" in t
            staff = re.findall(r"(מורה|מתרגל|מתרגלת|מרצה): ([^:]+?) (?=מורה:|מתרגל|מתרגלת|מרצה:|הפעלת|אורחים|$)", t)
            sections = [] if closed else re.findall(r'data-sectionname="([^"]+)"', page.decode("utf-8", "replace"))
            res.append({"year": y, "host": host, "id": int(cid), "title": html.unescape(title), "guestOpen": not closed,
                        "staff": [{"role": r, "name": n.strip()} for r, n in staff], "sections": sections[:40]})
    write(a.output, {"code": a.code, "results": res})


def cmd_discover(a) -> None:
    c = Client()
    probes = []
    pats: list[str] = []
    code, name = a.code or "", a.name or ""
    # Technion: no per-semester probes. The portal ignores a /YYYY0S suffix and always serves the same page
    # (its semester tabs stop at 2023/24, checked 2026-11-11); the current lecturer, TAs and exam dates are in
    # the synced record (`syllabus` → teachers / semesterHe / examDates, from the SAP catalog).
    ay = academic_year()  # years are counted back from today, never hard-coded
    if a.university == "tau":
        # The faculty yedion kept per-course pages for 2017-18 … 2019-20 only; newer years 404 (→ Wayback below).
        pats += [f"https://lifesci.tau.ac.il/yedion/{y}-{str(y + 1)[2:]}/course{code}" for y in range(2019, 2016, -1)]
        pats += [f"https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course={code}01&year={y}" for y in range(ay, ay - 5, -1)]
    if a.university == "huji":
        pats += [f"https://shnaton.huji.ac.il/index.php/NewSyl/{code}/1/{y}/pdf/" for y in range(ay, ay - 5, -1)]
    for u in pats:
        st, ct, raw = c.get(u)
        p = {"url": u, "status": st, "type": ct.split(";")[0], "bytes": len(raw),
             "weeklyHints": len(re.findall(r"שבוע|תרגיל \d|תרגול \d|הרצאה \d|Week", text_of(raw))) if st == 200 and "html" in ct else None}
        if st in (404, 410, 0):  # gone from the live site — the Internet Archive may still hold it
            snap = wayback(c, u)
            if snap:
                p["wayback"] = snap
        probes.append(p)
    domains = {"technion": ["technion.ac.il"], "tau": ["tau.ac.il"], "huji": ["huji.ac.il"], "biu": ["biu.ac.il"],
               "bgu": ["bgu.ac.il"], "haifa": ["haifa.ac.il"]}.get(a.university, ["ac.il"])
    queries = []
    for d in domains:
        queries += [f'site:{d} סילבוס "{name}" pdf', f'site:{d} "{code}" סילבוס', f'site:{d} "{name}" "תרגיל 1" OR "תרגול 1"',
                    f'site:{d} "{name}" שבוע הרצאה תרגול']
    queries += [f'"{name}" {code} הרצאות תרגולים לפי שבועות', f'"{name}" מבחן קודם {code}']
    # the same course under its English name and under codes it carried before (course numbers change: 134152 → 134157)
    if a.name_en:
        queries += [f'"{a.name_en}" {code} syllabus', f'"{a.name_en}" {domains[0]} syllabus OR schedule OR "lecture"']
    for old in (a.old_codes.split(",") if a.old_codes else []):
        queries += [f'"{old.strip()}" סילבוס OR syllabus', f'site:scribd.com OR site:studocu.com "{old.strip()}"']
    # pages that left the live web: lecturers' old course sites and retired Moodle servers are often archived
    queries += [f'site:web.archive.org "{code}" {domains[0]}', f'site:web.archive.org "{name}" סילבוס']
    # assessment: how the course is graded and what its exams ask (step 2a)
    queries += [f'"{name}" {code} "הרכב הציון" OR "מטלה מסכמת" OR "עבודה מסכמת" OR "פרויקט"',
                f'site:scribd.com "{code}" OR "{name}"', f'site:studocu.com "{code}" OR "{name}"',
                f'site:drive.google.com "{code}" OR "{name}" מבחן', f'"{code}" מבחן מועד א פתרון']
    if a.staff:
        queries += [f'"{s}" "{name}" אתר הקורס' for s in a.staff.split(",")]
        # lecturer profile: lab page, recent papers, the lecturer's own course pages (step 2b)
        queries += [q for s in a.staff.split(",") for q in (f'"{s}" lab research', f'"{s}" site:scholar.google.com OR site:pubmed.ncbi.nlm.nih.gov',
                                                             f'"{s}" course syllabus OR "exam" OR "lecture notes"')]
    # A ledger of the searches: fill `ran` / `hits` as you go, so "every query was run" is a fact in the file, not a memory.
    write(a.output, {"course": a.course, "probes": probes, "searchQueries": queries,
                     "searchLog": [{"query": q, "ran": False, "hits": [], "noteHe": ""} for q in queries],
                     "instructions": "First run `local` — material already on this machine comes before the web. Then run each searchQuery "
                                     "with WebSearch and record it in searchLog (ran, hits, note); for each candidate run `extract` with "
                                     "--code/--name so its identity is checked against the document itself. A probe with `wayback` is a page "
                                     "that left the live site: extract the snapshot URL. Record every source, even rejected ones, in the order "
                                     "file. Also fill the assessment and lecturer-profile notes (SKILL.md steps 2a-2b)."})


def _charset(ct: str, raw: bytes) -> str:
    m = re.search(r"charset=([\w-]+)", ct or "", re.I) or re.search(rb"charset=['\"]?([\w-]+)", raw[:3000], re.I)
    cs = (m[1].decode() if isinstance(m[1], bytes) else m[1]).lower() if m else "utf-8"
    return "cp1255" if cs in ("windows-1255", "iso-8859-8", "iso-8859-8-i") else cs


def _browser_fetch(url: str, dest: Path) -> bool:
    js = r"""
import { chromium } from "playwright";
const [url, out] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage();
await p.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
await p.waitForTimeout(3000);
const r = await p.request.get(url);
const fs = await import("fs"); fs.writeFileSync(out, await r.body());
console.log(r.headers()["content-type"] || "");
await b.close();
"""
    helper = REPO / ".ctb-fetch.mjs"
    helper.write_text(js, encoding="utf-8")
    try:
        r = subprocess.run(["node", str(helper), url, str(dest)], capture_output=True, text=True, timeout=180, shell=os.name == "nt")
        return dest.exists() and dest.stat().st_size > 0
    finally:
        helper.unlink(missing_ok=True)


def cmd_extract(a) -> None:
    """--url (web) or --file (a local PDF / DOCX / HTML / TXT). The whole text goes to <workdir>/source.txt."""
    if bool(a.url) == bool(a.file):
        sys.exit("error: give exactly one of --url or --file")
    work = Path(a.workdir); work.mkdir(parents=True, exist_ok=True)
    src = a.url or a.file
    st, ct, method, snapshot = 200, "", "file", None
    if a.file:
        raw = Path(a.file).read_bytes()
    else:
        c = Client()
        st, ct, raw = c.get(a.url)
        method = "http"
        if st in (404, 410, 0):  # gone from the live site → closest Internet Archive snapshot
            snapshot = wayback(c, a.url)
            if snapshot:
                print(f"{st} from the live site — using the archived copy of {snapshot['timestamp']}", file=sys.stderr)
                st, ct, raw = c.get(re.sub(r"/web/(\d+)/", r"/web/\1id_/", snapshot["url"]))  # id_ = the original bytes
                method = "wayback"
    is_pdf = raw[:5] == b"%PDF-"
    is_docx = raw[:2] == b"PK" and src.lower().split("?")[0].endswith(".docx")
    is_doc = raw[:8] == b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"
    if a.url and method == "http":
        blocked = (not is_pdf and a.url.lower().endswith(".pdf")) or b"BOT" in raw[:2000] or st in (403, 0)
        if blocked:
            print("blocked or not a PDF — retrying through a real browser", file=sys.stderr)
            tmp = work / "source.bin"
            if _browser_fetch(a.url, tmp):
                raw = tmp.read_bytes(); is_pdf = raw[:5] == b"%PDF-"; method = "browser"
            tmp.unlink(missing_ok=True)
    dest = work / ("source.pdf" if is_pdf else "source.docx" if is_docx else "source.doc" if is_doc else "source.html")
    dest.write_bytes(raw)
    txt_path = work / "source.txt"
    note = ""
    if is_pdf:
        subprocess.run(["pdftotext", "-layout", "-enc", "UTF-8", str(dest), str(txt_path)], capture_output=True)
        text = txt_path.read_text(encoding="utf-8", errors="replace") if txt_path.exists() else ""
    elif is_docx:
        text = docx_text(dest)
    elif is_doc:
        text = ""  # old binary Word: no stdlib reader
        note = "Old .doc file: open it in Word/LibreOffice and save as .docx or PDF, then extract that."
    elif a.file and Path(a.file).suffix.lower() in (".txt", ".md"):
        text = raw.decode("utf-8", "replace")
    else:
        text = text_of(raw.decode(_charset(ct, raw), "replace").encode("utf-8"))
    text = re.sub(r"[‎‏‪-‮⁦-⁩]", "", text)  # direction marks only confuse every later match
    txt_path.write_text(text, encoding="utf-8")
    q = text_quality(text)
    # A scan has no text; visual-order PDFs give reversed Hebrew. Language is not the test: an English syllabus reads fine.
    needs_visual = (is_pdf and (q["empty"] or q["reversed"])) or is_doc
    if is_pdf and q["empty"]:
        note = "No text layer (a scan) — open `file` with the Read tool; PDF pages are read visually."
    elif is_pdf and q["reversed"]:
        note = "The Hebrew extracted in reversed order — do not trust `text`; open `file` with the Read tool."
    multi_col = sum(1 for l in text.splitlines() if len(re.split(r"\s{3,}", l.strip())) >= 3)
    if is_pdf and multi_col >= 6 and not needs_visual:
        note = (note + " " if note else "") + (f"{multi_col} table rows have 3+ columns: pdftotext interleaves such rows — "
                                                "read the table itself from `file` with the Read tool, not from `text`.")
    identity = identity_in_text(text, a.code, [n for n in (a.name, a.name_en) if n]) if (a.code or a.name or a.name_en) else None
    if a.url and st in (404, 410, 0):
        note = f"Dead link ({st}) and no Internet Archive snapshot — nothing was extracted."
    if identity and not identity["ok"] and not needs_visual and len(text) > 200:
        note = (note + " " if note else "") + "IDENTITY: the document names neither the course code nor its name — do not use it for this course until a person confirms what it is."
    links = []
    if not is_pdf and not is_docx and not is_doc:
        page = raw.decode(_charset(ct, raw), "replace")
        for href, label in re.findall(r"<a[^>]+href=['\"]([^'\"]+)['\"][^>]*>(.*?)</a>", page, flags=re.S | re.I):
            lab = " ".join(html.unescape(re.sub(r"<[^>]+>", "", label)).split())
            if re.search(r"\.pdf|syllabus|סילבוס|Download|תרגול|תרגיל", href + " " + lab, re.I):
                links.append({"url": urllib.parse.urljoin(a.url or "", html.unescape(href)), "label": lab[:120]})
    rows = [l.strip() for l in text.splitlines() if re.search(r"\d{1,2}\.\d{1,2}(\.\d{2,4})?|שבוע|תרגיל|תרגול|הרצאה|Week|Lecture", l)]
    write(a.output, {
        "url": a.url, "sourceFile": a.file, "status": st, "method": method, "wayback": snapshot,
        "file": str(dest), "isPdf": is_pdf, "isDocx": is_docx, "textFile": str(txt_path), "chars": len(text),
        "quality": q, "needsVisualRead": needs_visual, "identity": identity, "note": note,
        "yearsNamed": sorted({int(y) for y in re.findall(r"(?<!\d)(20[12]\d)(?!\d)", text)} | {v for k, v in HEB_YEARS.items() if k in re.sub(r"[\"״']", "", text)}, reverse=True)[:6],
        "gradingLines": [l.strip() for l in text.splitlines() if re.search(r"\d{1,3}\s?%|%\s?\d{1,3}", l)][:20],
        "scheduleRowCandidates": rows[:200],
        "links": links[:60],
        "text": text[:20000],
        "truncated": len(text) > 20000,  # the whole text is always in textFile
    })


CONF_ORDER = ["official", "official-past", "students", "syllabus", "parallel", "consensus", "textbook", "suggested"]


def cmd_order(a) -> None:
    """Order file (JSON): {course, university, code, faculty, year,
       lectures:[{n,titleHe,topics:[..]}], tutorials:[...]|null,
       sources:[{url, kind, confidence, identity:{code, faculty, year}, usedFor:["lectures"|"tutorials"|"topics"], noteHe}]}"""
    d = json.loads(Path(a.input).read_text(encoding="utf-8"))
    problems, rows, bad = [], [], set()
    for s in d.get("sources", []):
        n_before = len(problems)
        idn = s.get("identity", {})
        same = idn.get("code") == d.get("code") and idn.get("faculty") == d.get("faculty")
        conf = s.get("confidence")
        if conf not in CONF_ORDER:
            problems.append(f"{s.get('url')}: unknown confidence '{conf}'")
        if conf in ("official", "official-past", "students") and not same:
            problems.append(f"{s.get('url')}: confidence '{conf}' but identity {idn} ≠ course {d.get('code')}/{d.get('faculty')} — "
                            f"a different course can only be 'parallel' or weaker")
        if conf == "official" and str(idn.get("year")) != str(d.get("year")):
            problems.append(f"{s.get('url')}: 'official' needs the current year ({d.get('year')}), got {idn.get('year')} — use 'official-past'")
        # The declared identity must be visible in the document itself, not only typed into this file.
        if conf in ("official", "official-past", "students"):
            tf = s.get("textFile")
            if not tf:
                if not s.get("identityConfirmedBy"):
                    problems.append(f"{s.get('url')}: confidence '{conf}' needs `textFile` (the source.txt that `extract` wrote, or "
                                    f"content/syllabi/text/<course>.txt) so the identity can be checked against the document — "
                                    f"or `identityConfirmedBy` with who read it and how")
            elif not Path(tf).exists():
                problems.append(f"{s.get('url')}: textFile not found: {tf}")
            else:
                doc = Path(tf).read_text(encoding="utf-8", errors="replace")
                chk = identity_in_text(doc, d.get("code"), [n for n in (d.get("nameHe"), d.get("nameEn")) if n])
                if not chk["ok"] and not s.get("identityConfirmedBy"):
                    problems.append(f"{s.get('url')}: the document names neither code {d.get('code')} nor the course name — a document that does not "
                                    f"identify itself needs `identityConfirmedBy` (e.g. 'file name + lecturer, read by Claude 2026-11-11')")
                y = str(idn.get("year") or "")
                if y and y not in doc and not any(k in re.sub(r"[\"״']", "", doc) for k, v in HEB_YEARS.items() if str(v) == y) and not s.get("identityConfirmedBy"):
                    problems.append(f"{s.get('url')}: the declared year {y} does not appear in the document — state where the year comes from in `identityConfirmedBy`")
        if len(problems) > n_before:
            bad.add(s.get("url"))
        rows.append(f"| {conf}{' ⚠' if s.get('url') in bad else ''} | {', '.join(s.get('usedFor', []))} | {idn.get('code')} / {idn.get('faculty')} / {idn.get('year')} | {s.get('url')} |")
    for view in ("lectures", "tutorials"):
        used = [s for s in d.get("sources", []) if view in s.get("usedFor", []) and s.get("url") not in bad]
        best = min((CONF_ORDER.index(s["confidence"]) for s in used if s.get("confidence") in CONF_ORDER), default=None)
        d[f"{view}Confidence"] = CONF_ORDER[best] if best is not None else None
    if d.get("tutorials") and not d.get("tutorialsConfidence"):
        problems.append("tutorials are listed but no source is marked usedFor 'tutorials' — set tutorials to null "
                        "(site shows 'practice for lecture n') or add the source")
    md = [f"# Order report — {d.get('course')} ({d.get('university')} {d.get('code')}, {d.get('year')})", "",
          f"- Lectures: **{d.get('lecturesConfidence') or 'no source'}**",
          f"- Tutorials: **{d.get('tutorialsConfidence') or 'no source → shown as practice per lecture'}**", "",
          "| confidence | used for | identity (code / faculty / year) | url |", "|---|---|---|---|", *rows, "",
          "## Problems", *(f"- {p}" for p in problems or ["none"])]
    write(a.output, "\n".join(md))
    if problems:
        sys.exit(1)


def cmd_coverage(a) -> None:
    ts = f"""
import {{ lessonBySlug }} from "./content/lessons";
import {{ parseBody }} from "./content/lessons/parse";
import {{ planForCourse }} from "./content/course-plans";
const plan: any = planForCourse({json.dumps(a.course)});
const out: any = {{ course: {json.dumps(a.course)}, found: !!plan, unresolved: [], placeholders: [], drafts: [], topicsWithoutUnit: [], lectureOrder: plan?.lectureOrder ?? null, tutorialOrder: plan?.tutorialOrder ?? null }};
if (plan) {{
  const drafts = new Set<string>();
  for (const [view, groups] of [["topics", plan.topics], ["lectures", plan.lectures], ["tutorials", plan.tutorials]] as any) for (const g of groups) {{
    if (view === "topics" && !g.items.some((i: any) => i.kind === "lesson")) out.topicsWithoutUnit.push(g.titleHe);
    for (const it of g.items) {{
      if (it.kind === "soon") out.placeholders.push(`${{view}}: ${{g.titleHe}} → ${{it.titleHe}}`);
      if (it.kind !== "lesson") continue;
      const l = lessonBySlug(it.slug);
      if (!l) {{ out.unresolved.push(`${{view}}: no lesson ${{it.slug}}`); continue; }}
      if (l.status === "draft") drafts.add(l.slug);
      if (it.section && !parseBody(l.bodyHe).some((s: any) => s.id === it.section)) out.unresolved.push(`${{view}}: ${{it.slug}}#${{it.section}}`);
      if (it.problem && !(l.workedProblems ?? []).some((w: any) => w.id === it.problem)) out.unresolved.push(`${{view}}: ${{it.slug}} problem ${{it.problem}}`);
    }}
  }}
  out.drafts = [...drafts];
}}
console.log(JSON.stringify(out));
"""
    helper = REPO / ".ctb-coverage.ts"
    helper.write_text(ts, encoding="utf-8")
    try:
        r = subprocess.run(["npx", "tsx", str(helper)], capture_output=True, text=True, timeout=300, shell=os.name == "nt", encoding="utf-8")
    finally:
        helper.unlink(missing_ok=True)
    if r.returncode != 0:
        sys.exit(f"error: coverage check failed:\n{r.stderr[-2000:]}")
    data = json.loads(r.stdout.strip().splitlines()[-1])
    write(a.output, data)
    if not data["found"] or data["unresolved"]:
        sys.exit(1)


# ---------- scope ----------
KW_FILE = Path(__file__).resolve().parent.parent / "references" / "section-keywords.json"
EVIDENCE_RANK = ["exam", "reading", "staff-material", "syllabus-named", "syllabus-heading", "none"]


def _norm(t: str) -> str:
    t = re.sub(r"[֑-ׇ]", "", t)              # niqqud
    t = t.replace("־", " ").replace("-", " ").replace("–", " ")
    return " " + re.sub(r"\s+", " ", t.lower()) + " "


def _hit(text: str, kw: str) -> bool:
    k = _norm(kw).strip()
    if re.search(r"[א-ת]", k):  # Hebrew: allow one-letter prefixes
        return re.search(r"(?:^|[\s\"'(;,.:])[הובלשמכ]{0,2}" + re.escape(k), text) is not None
    return re.search(r"(?<![a-z])" + re.escape(k) + r"(?:s|es)?(?![a-z])", text) is not None  # plural ok


def cmd_scope(a) -> None:
    if a.check:
        ts = f"""
import {{ scopeForCourse }} from "./content/course-scope";
import {{ LEVEL_FOR_EVIDENCE }} from "./content/course-scope/types";
import {{ planForCourse }} from "./content/course-plans";
import {{ lessonBySlug }} from "./content/lessons";
import {{ parseBody }} from "./content/lessons/parse";
const c: any = scopeForCourse({json.dumps(a.course)}); const plan: any = planForCourse({json.dumps(a.course)});
const out: any = {{ found: !!c, missing: [], wrongLevel: [], emptyNote: [], counts: {{}} }};
if (c && plan) {{
  const slugs = new Set<string>();
  for (const g of [...plan.topics, ...plan.lectures, ...plan.tutorials]) for (const it of g.items) if (it.kind === "lesson") slugs.add(it.slug);
  for (const slug of slugs) for (const s of parseBody(lessonBySlug(slug)!.bodyHe)) {{
    const e = c.sections[slug]?.[s.id];
    if (!e) {{ out.missing.push(`${{slug}}#${{s.id}}`); continue; }}
    if (LEVEL_FOR_EVIDENCE[e.evidence] !== e.level) out.wrongLevel.push(`${{slug}}#${{s.id}}: ${{e.evidence}} → must be ${{LEVEL_FOR_EVIDENCE[e.evidence]}}, is ${{e.level}}`);
    if (!e.noteHe?.trim()) out.emptyNote.push(`${{slug}}#${{s.id}}`);
    out.counts[e.level] = (out.counts[e.level] ?? 0) + 1;
  }}
}}
console.log(JSON.stringify(out));
"""
        helper = REPO / ".ctb-scope.ts"
        helper.write_text(ts, encoding="utf-8")
        try:
            r = subprocess.run(["npx", "tsx", str(helper)], capture_output=True, text=True, timeout=300, shell=os.name == "nt", encoding="utf-8")
        finally:
            helper.unlink(missing_ok=True)
        if r.returncode != 0:
            sys.exit(f"error: scope check failed:\n{r.stderr[-2000:]}")
        data = json.loads(r.stdout.strip().splitlines()[-1])
        write(a.output, data)
        if not data["found"] or data["missing"] or data["wrongLevel"] or data["emptyNote"]:
            sys.exit(1)
        return

    kw = json.loads(KW_FILE.read_text(encoding="utf-8"))
    rec = load_syllabi().get(a.course, {})
    docs: list[tuple[str, str, str]] = []  # (evidence kind, label, normalized text)
    if rec:
        docs.append(("syllabus-named", f"official syllabus ({rec.get('sourceUrl')})",
                     _norm((rec.get("contentHe") or "") + " " + " ".join(rec.get("topicsHe") or []))))
    for spec in a.evidence or []:
        kind, _, path = spec.partition("=")
        if kind not in ("exam", "reading", "staff-material", "syllabus-named"):
            sys.exit(f"error: evidence kind must be exam|reading|staff-material|syllabus-named, got '{kind}'")
        txt = Path(path).read_text(encoding="utf-8", errors="replace")
        if path.endswith(".json"):
            try:
                txt = json.loads(txt).get("text", txt)
            except Exception:
                pass
        docs.append((kind, path, _norm(txt)))
    if not docs:
        sys.exit("error: no documents — the course has no synced syllabus and no --evidence was given")
    rows, by_lesson = [], {}
    for lesson, secs in kw.items():
        if lesson.startswith("_"):
            continue
        head = secs.get("_heading")
        if head and any(_hit(t, w) for _, _, t in docs for w in (head.get("he") or []) + (head.get("en") or [])):
            by_lesson.setdefault(lesson, []).append("_heading")
        for sec, k in secs.items():
            if sec.startswith("_"):
                continue
            words = (k.get("he") or []) + (k.get("en") or [])
            hits = [(kind, label, w) for kind, label, text in docs for w in words if _hit(text, w)]
            best = min((EVIDENCE_RANK.index(h[0]) for h in hits), default=None)
            ev = EVIDENCE_RANK[best] if best is not None else None
            rows.append({"lesson": lesson, "section": sec, "evidence": ev, "matches": sorted({f"{h[0]}: {h[2]}" for h in hits})})
    for r_ in rows:  # no own hit: 'likely' only if a broader syllabus heading of this lesson (_heading) matched
        if r_["evidence"] is None:
            r_["evidence"] = "syllabus-heading" if by_lesson.get(r_["lesson"]) else "none"
    level = {"exam": "core", "reading": "core", "staff-material": "core", "syllabus-named": "core", "syllabus-heading": "likely", "none": "extension"}
    for r_ in rows:
        r_["level"] = level[r_["evidence"]]
    counts = {lv: sum(1 for r_ in rows if r_["level"] == lv) for lv in ("core", "likely", "extension")}
    write(a.output, {"course": a.course, "documents": [d[1] for d in docs], "counts": counts, "sections": rows,
                     "note": "Suggestions only: review each row (keyword hits can be false positives), then write content/course-scope/<course>.ts and run `scope --check`."})


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("syllabus"); s.add_argument("--course", required=True); s.add_argument("--university"); s.add_argument("--output", required=True)
    s = sub.add_parser("related"); s.add_argument("--course", required=True); s.add_argument("--university", required=True)
    s.add_argument("--code"); s.add_argument("--name"); s.add_argument("--output", required=True)
    s = sub.add_parser("staff"); s.add_argument("--university", required=True); s.add_argument("--code", required=True, help="Moodle code, e.g. 01340020")
    s.add_argument("--years", required=True, help="academic years (ending), e.g. 2027,2026"); s.add_argument("--output", required=True)
    s = sub.add_parser("discover"); s.add_argument("--course", required=True); s.add_argument("--university", required=True)
    s.add_argument("--code", required=True); s.add_argument("--name", required=True); s.add_argument("--staff", help="comma-separated names from `staff`")
    s.add_argument("--name-en", dest="name_en", help="English course name (adds English queries)")
    s.add_argument("--old-codes", dest="old_codes", help="comma-separated codes the course carried before")
    s.add_argument("--output", required=True)
    s = sub.add_parser("extract"); s.add_argument("--url"); s.add_argument("--file", help="a local PDF / DOCX / HTML / TXT instead of --url")
    s.add_argument("--code", help="course code — checked against the document text"); s.add_argument("--name"); s.add_argument("--name-en", dest="name_en")
    s.add_argument("--workdir", required=True); s.add_argument("--output", required=True)
    s = sub.add_parser("local"); s.add_argument("--course", required=True); s.add_argument("--code"); s.add_argument("--output", required=True)
    s = sub.add_parser("ledger"); s.add_argument("--course", help="one course; omit for all synced courses"); s.add_argument("--output", required=True, help=".md (table) or .json")
    s = sub.add_parser("order"); s.add_argument("--input", required=True); s.add_argument("--output", required=True)
    s = sub.add_parser("coverage"); s.add_argument("--course", required=True); s.add_argument("--output", required=True)
    s = sub.add_parser("scope"); s.add_argument("--course", required=True); s.add_argument("--output", required=True)
    g = s.add_mutually_exclusive_group(required=True); g.add_argument("--suggest", action="store_true"); g.add_argument("--check", action="store_true")
    s.add_argument("--evidence", nargs="*", help="kind=path, kind ∈ exam|reading|staff-material|syllabus-named (text or extract JSON)")
    a = p.parse_args()
    try:
        {"syllabus": cmd_syllabus, "related": cmd_related, "staff": cmd_staff, "discover": cmd_discover,
         "extract": cmd_extract, "order": cmd_order, "coverage": cmd_coverage, "scope": cmd_scope,
         "local": cmd_local, "ledger": cmd_ledger}[a.cmd](a)
    except RateLimitError as e:
        sys.exit(f"rate limited: {e}")


if __name__ == "__main__":
    main()
