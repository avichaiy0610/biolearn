#!/usr/bin/env python3
"""Find and check sources for a university course track (BioLearn).

Every command writes JSON (or Markdown) to --output and prints one status line.
Run from the biolearn repo root:  uv run .claude/skills/course-track-builder/scripts/course_sources.py <cmd> ...

Commands
  syllabus  — the synced official syllabus record for a course (content/syllabi/data.generated.ts)
  related   — parallel courses: Technion "no extra credit" pairs + same-name courses at other universities
  staff     — Technion Moodle guest scan: course pages per year, staff names, open/closed to guests
  discover  — probe known public URL patterns and emit web-search queries for the agent to run
  extract   — download a page/PDF (browser fallback for bot walls), text + weekly-schedule candidates
  order     — validate a curated order file (sources, identity checks, confidence) → Markdown report
  coverage  — plan ↔ lessons check for a course: unresolved items, placeholders, drafts, empty topics
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
    if a.university == "technion":
        pats += [f"https://students.technion.ac.il/local/technionsearch/course/{code}/{y}0{s}" for y in range(2026, 2021, -1) for s in (1, 2)]
    if a.university == "tau":
        pats += [f"https://lifesci.tau.ac.il/yedion/{y}-{str(y + 1)[2:]}/course{code}" for y in range(2025, 2016, -1)]
        pats += [f"https://www.ims.tau.ac.il/Tal/Syllabus/Syllabus_L.aspx?course={code}01&year={y}" for y in range(2026, 2022, -1)]
    if a.university == "huji":
        pats += [f"https://shnaton.huji.ac.il/index.php/NewSyl/{code}/1/{y}/pdf/" for y in range(2027, 2022, -1)]
    for u in pats:
        st, ct, raw = c.get(u)
        probes.append({"url": u, "status": st, "type": ct.split(";")[0], "bytes": len(raw),
                       "weeklyHints": len(re.findall(r"שבוע|תרגיל \d|תרגול \d|הרצאה \d|Week", text_of(raw))) if st == 200 and "html" in ct else None})
    domains = {"technion": ["technion.ac.il"], "tau": ["tau.ac.il"], "huji": ["huji.ac.il"], "biu": ["biu.ac.il"],
               "bgu": ["bgu.ac.il"], "haifa": ["haifa.ac.il"]}.get(a.university, ["ac.il"])
    queries = []
    for d in domains:
        queries += [f'site:{d} סילבוס "{name}" pdf', f'site:{d} "{code}" סילבוס', f'site:{d} "{name}" "תרגיל 1" OR "תרגול 1"',
                    f'site:{d} "{name}" שבוע הרצאה תרגול']
    queries += [f'"{name}" {code} הרצאות תרגולים לפי שבועות', f'"{name}" מבחן קודם {code}']
    if a.staff:
        queries += [f'"{s}" "{name}" אתר הקורס' for s in a.staff.split(",")]
    write(a.output, {"course": a.course, "probes": probes, "searchQueries": queries,
                     "instructions": "Run each searchQuery with WebSearch; for each candidate run `extract`, then verify identity "
                                     "(faculty, code, year) before using it. Record every source, even rejected ones, in the order file."})


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
    work = Path(a.workdir); work.mkdir(parents=True, exist_ok=True)
    c = Client()
    st, ct, raw = c.get(a.url)
    is_pdf = raw[:5] == b"%PDF-"
    blocked = (not is_pdf and a.url.lower().endswith(".pdf")) or b"BOT" in raw[:2000] or st in (403, 0)
    dest = work / ("source.pdf" if a.url.lower().endswith(".pdf") or is_pdf else "source.html")
    method = "http"
    if blocked:
        print("blocked or not a PDF — retrying through a real browser", file=sys.stderr)
        if _browser_fetch(a.url, dest):
            raw = dest.read_bytes(); is_pdf = raw[:5] == b"%PDF-"; method = "browser"
    dest.write_bytes(raw)
    if is_pdf:
        txt_path = work / "source.txt"
        subprocess.run(["pdftotext", "-layout", str(dest), str(txt_path)], capture_output=True)
        text = txt_path.read_text(encoding="utf-8", errors="replace") if txt_path.exists() else ""
    else:
        text = text_of(raw.decode(_charset(ct, raw), "replace").encode("utf-8"))
    links = []
    if not is_pdf:
        page = raw.decode(_charset(ct, raw), "replace")
        for href, label in re.findall(r"<a[^>]+href=['\"]([^'\"]+)['\"][^>]*>(.*?)</a>", page, flags=re.S | re.I):
            lab = " ".join(html.unescape(re.sub(r"<[^>]+>", "", label)).split())
            if re.search(r"\.pdf|syllabus|סילבוס|Download|תרגול|תרגיל", href + " " + lab, re.I):
                links.append({"url": urllib.parse.urljoin(a.url, html.unescape(href)), "label": lab[:120]})
    hebrew = len(re.findall(r"[֐-׿]", text))
    rows = [l.strip() for l in text.splitlines() if re.search(r"\d{1,2}\.\d{1,2}(\.\d{2,4})?|שבוע|תרגיל|תרגול|הרצאה|Week|Lecture", l)]
    write(a.output, {
        "url": a.url, "status": st, "method": method, "file": str(dest), "isPdf": is_pdf, "chars": len(text),
        "hebrewChars": hebrew,
        "needsVisualRead": is_pdf and hebrew < 50,
        "note": "Hebrew did not extract — open `file` with the Read tool (PDF pages are read visually)." if is_pdf and hebrew < 50 else "",
        "scheduleRowCandidates": rows[:120],
        "links": links[:60],
        "text": text[:20000],
    })


CONF_ORDER = ["official", "official-past", "students", "parallel", "consensus", "textbook"]


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
    s.add_argument("--output", required=True)
    s = sub.add_parser("extract"); s.add_argument("--url", required=True); s.add_argument("--workdir", required=True); s.add_argument("--output", required=True)
    s = sub.add_parser("order"); s.add_argument("--input", required=True); s.add_argument("--output", required=True)
    s = sub.add_parser("coverage"); s.add_argument("--course", required=True); s.add_argument("--output", required=True)
    s = sub.add_parser("scope"); s.add_argument("--course", required=True); s.add_argument("--output", required=True)
    g = s.add_mutually_exclusive_group(required=True); g.add_argument("--suggest", action="store_true"); g.add_argument("--check", action="store_true")
    s.add_argument("--evidence", nargs="*", help="kind=path, kind ∈ exam|reading|staff-material|syllabus-named (text or extract JSON)")
    a = p.parse_args()
    try:
        {"syllabus": cmd_syllabus, "related": cmd_related, "staff": cmd_staff, "discover": cmd_discover,
         "extract": cmd_extract, "order": cmd_order, "coverage": cmd_coverage, "scope": cmd_scope}[a.cmd](a)
    except RateLimitError as e:
        sys.exit(f"rate limited: {e}")


if __name__ == "__main__":
    main()
