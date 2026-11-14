#!/usr/bin/env python3
"""Find and fetch PUBLIC student drives (exams, homework, summaries) for a university — no user account.

Students of most Israeli faculties keep a shared Google Drive of past exams and summaries, and student
unions publish the links on open pages ("hubs"). This script finds those links by itself, checks which
folders are open to anyone with the link, downloads them next to the repo and indexes them, so the
course-track-builder skill has exam and homework evidence for universities other than the Technion.

Run from the biolearn repo root:  uv run .claude/skills/course-track-builder/scripts/drive_sources.py <cmd> ...

Commands
  discover — crawl the known hubs (references/drive-hubs.json), collect Google Drive links with their
             labels, probe which are public, merge into Project One/drives/_registry.json, and emit
             web-search queries for hubs and drives not yet known
  probe    — check one folder: public / needs login / not found / blocked by this network
  fetch    — download a public folder recursively into Project One/drives/<university>/<folder-id>/
  index    — extract text of everything fetched and write Project One/drives/_text/index.json
             (same row shape as `biology drive/_text/index.json`, read by `course_sources.py ledger`)

Limits, on purpose
  - Only folders shared with "anyone with the link". A folder that asks for a login is recorded as
    `login` and left alone — no accounts, no tokens, no workarounds.
  - If the local network blocks Google Drive (a filtering proxy answers instead of Google), every
    command stops with `blocked-by-network`. That is a setting of the machine's owner; this script does
    not route around it.
  - The material is evidence of scope and exam format for writing our own units. It is never copied to
    the site and never committed to git (Project One/drives is outside the repo).
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import ssl
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from course_sources import Client, RateLimitError, academic_year, docx_text, load_syllabi, path_year, text_quality, write  # noqa: E402

REPO = Path.cwd()
DRIVES = REPO.parent / "drives"
REGISTRY = DRIVES / "_registry.json"
HUBS = Path(__file__).resolve().parent.parent / "references" / "drive-hubs.json"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
BIO = re.compile(r"מדעי החיים|מדעי המוח|נוירו|ביולוגי|ביו[- ]?רפוא|ביוטכנולוגי|ביוכימי|מדעי הטבע|life.?sci|biolog|biomed|biotech", re.I)
FOLDER_RE = re.compile(r"drive\.google\.com/(?:drive/(?:u/\d+/)?folders/|open\?id=|folderview\?id=|embeddedfolderview\?id=)([A-Za-z0-9_-]{10,})")
FILE_RE = re.compile(r"(?:drive|docs)\.google\.com/(?:file/d/|document/d/|spreadsheets/d/|presentation/d/|uc\?(?:export=download&)?id=)([A-Za-z0-9_-]{10,})")


class NetworkBlocked(RuntimeError):
    pass


def _get(url: str, binary: bool = False, timeout: int = 60):
    """GET that tells a filtering proxy apart from Google. Returns (status, final_url, body)."""
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "he,en;q=0.8"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
            return r.status, r.geturl(), body if binary else body.decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, url, b"" if binary else ""
    except (ssl.SSLCertVerificationError, urllib.error.URLError) as e:
        reason = str(getattr(e, "reason", e))
        if "CERTIFICATE" in reason.upper() or "certificate" in reason or "blockpage" in reason:
            raise NetworkBlocked(f"this network answers for {urllib.parse.urlparse(url).netloc} with a filtering proxy's certificate ({reason[:140]})")
        raise


def _registry() -> dict:
    return json.loads(REGISTRY.read_text(encoding="utf-8")) if REGISTRY.exists() else {"drives": []}


def _save_registry(reg: dict) -> None:
    DRIVES.mkdir(parents=True, exist_ok=True)
    REGISTRY.write_text(json.dumps(reg, ensure_ascii=False, indent=1), encoding="utf-8")


def list_folder(folder_id: str) -> dict:
    """One level of a folder through the public embedded view (no API key, no login)."""
    st, final, page = _get(f"https://drive.google.com/embeddedfolderview?id={folder_id}#list")
    if "accounts.google.com" in final or "ServiceLogin" in page[:4000]:
        return {"status": "login", "title": None, "entries": []}
    if st in (401, 403):  # Google answers 401/403 for a folder shared only with named accounts
        return {"status": "login", "title": None, "entries": []}
    if st == 404:
        return {"status": "not-found", "title": None, "entries": []}
    if st != 200:
        return {"status": f"http-{st}", "title": None, "entries": []}
    title = html.unescape((re.search(r"<title>([^<]*)</title>", page) or [None, ""])[1]).strip()
    entries = []
    for m in re.finditer(r'<div class="flip-entry" id="entry-([A-Za-z0-9_-]+)".*?</a>', page, flags=re.S):
        block = m[0]
        href = html.unescape((re.search(r'href="([^"]+)"', block) or [None, ""])[1])
        name = html.unescape(re.sub(r"<[^>]+>", "", (re.search(r'class="flip-entry-title">(.*?)</div>', block, flags=re.S) or [None, ""])[1])).strip()
        kind = "folder" if "/folders/" in href else "gdoc" if "docs.google.com" in href else "file"
        entries.append({"id": m[1], "name": name, "kind": kind, "href": href})
    return {"status": "public", "title": title, "entries": entries}


def cmd_probe(a) -> None:
    fid = (FOLDER_RE.search(a.url) or [None, a.url])[1]
    try:
        r = list_folder(fid)
    except NetworkBlocked as e:
        r = {"status": "blocked-by-network", "error": str(e), "entries": []}
    write(a.output, {"id": fid, **{k: v for k, v in r.items() if k != "entries"}, "items": len(r["entries"]),
                     "sample": [e["name"] for e in r["entries"][:25]]})


def _anchor_links(page: str) -> list[dict]:
    """Drive links of a hub page with the text of their own link (the label the students gave the drive)."""
    out, seen = [], set()
    for m in re.finditer(r"<a\b[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", page, flags=re.S | re.I):
        href = html.unescape(m[1])
        f = FOLDER_RE.search(href) or FILE_RE.search(href)
        if not f or f[1] in seen:
            continue
        seen.add(f[1])
        label = " ".join(html.unescape(re.sub(r"<[^>]+>", " ", m[2])).split())
        # the heading the link sits under (hubs group drives by faculty)
        before = html.unescape(re.sub(r"<[^>]+>", " ", page[max(0, m.start() - 1500):m.start()]))
        heads = re.findall(r"[֐-׿][֐-׿ \"'׳״\-–]{3,60}", before)
        out.append({"id": f[1], "kind": "folder" if FOLDER_RE.search(href) else "file", "url": href, "label": label,
                    "context": " ¦ ".join(h.strip() for h in heads[-3:])})
    for f in FOLDER_RE.finditer(page):  # links that are plain text (Telegram posts, JSON blobs)
        if f[1] not in seen:
            seen.add(f[1])
            out.append({"id": f[1], "kind": "folder", "url": "https://" + f[0], "label": "", "context": ""})
    return out


def cmd_discover(a) -> None:
    hubs = json.loads(HUBS.read_text(encoding="utf-8"))["hubs"]
    reg = _registry()
    known = {d["id"]: d for d in reg["drives"]}
    today = time.strftime("%Y-%m-%d")
    report, blocked = [], None
    for hub in hubs:
        if a.university and hub["university"] not in (a.university, "any"):
            continue
        try:
            st, _, page = _get(hub["url"])
        except Exception as e:  # a hub that is down is reported, the rest go on
            report.append({"hub": hub["url"], "error": str(e)[:200]})
            continue
        links = _anchor_links(page) if st == 200 else []
        # A drive is "biology" by its own label; the heading above it counts only when the link has no label.
        is_bio = lambda l: bool(BIO.search(l["label"] or l["context"]))
        relevant = [l for l in links if is_bio(l)]
        report.append({"hub": hub["url"], "university": hub["university"], "status": st, "driveLinks": len(links), "biology": len(relevant),
                       "noteHe": hub.get("noteHe")})
        for l in links:
            bio = is_bio(l)
            is_doc = "/document/d/" in l["url"]  # a Google Doc on a hub is usually a list of drives — read below
            if not bio and not a.all and not is_doc:
                continue
            d = known.setdefault(l["id"], {"id": l["id"], "firstSeen": today})
            d.update({"kind": l["kind"], "url": l["url"], "label": l["label"], "context": l["context"], "university": hub["university"],
                      "foundOn": hub["url"], "biology": bio, "lastSeen": today})
    # Link documents: unions often publish one Google Doc per department ("מדעי החיים") that lists the
    # department's drives, one "label  URL" per line, sometimes pointing to a further document. Read them
    # (two levels deep) and add what they list. A link's label is the text on its own line.
    for depth in (1, 2):
        docs = [d for d in known.values() if "/document/d/" in d.get("url", "") and d.get("expanded") != today and not blocked]
        for d in docs:
            try:
                st, final, txt = _get(f"https://docs.google.com/document/d/{d['id']}/export?format=txt")
            except NetworkBlocked as e:
                blocked = str(e)
                break
            d["expanded"] = today
            if st != 200 or "accounts.google.com" in final:
                d["access"] = "login" if st in (401, 403) or "accounts.google.com" in final else f"http-{st}"
                continue
            lines = [l.strip("﻿ \t\r") for l in txt.splitlines() if l.strip("﻿ \t\r")]
            d.update({"access": "public", "title": lines[0][:80] if lines else "", "kind": "link-doc"})
            d["biology"] = bool(BIO.search(d["title"] + " " + d.get("label", "")))
            prev = ""
            for line in lines:
                urls = re.findall(r"https?://\S+", line)
                label = re.sub(r"https?://\S+", "", line).strip(" :-–\t") or prev
                prev = label if not urls else prev
                for u in urls:
                    f = FOLDER_RE.search(u) or FILE_RE.search(u)
                    if f:
                        if f[1] == d["id"]:
                            continue
                        n = known.setdefault(f[1], {"id": f[1], "firstSeen": today})
                        n.update({"kind": "folder" if FOLDER_RE.search(u) else "file", "url": u, "label": label, "context": d["title"],
                                  "university": d["university"], "foundOn": f"https://docs.google.com/document/d/{d['id']}",
                                  "biology": bool(BIO.search(label + " " + d["title"])), "lastSeen": today})
                    elif re.search(r"box\.com|dropbox\.com|1drv\.ms|onedrive|sharepoint\.com|mega\.nz", u):
                        # other clouds: recorded so a person or a later version can open them; not fetched
                        d.setdefault("otherLinks", [])
                        if not any(o["url"] == u for o in d["otherLinks"]):
                            d["otherLinks"].append({"label": label, "url": u})
            time.sleep(1)
    if not a.all:  # link documents were kept only to be read; drop what turned out not to be biology
        for k in [k for k, d in known.items() if not d.get("biology")]:
            del known[k]
    for d in known.values():  # probe access for folders not yet settled
        if d.get("kind") != "folder" or (d.get("access") in ("public", "login", "not-found") and d.get("probed") == today):
            continue
        if blocked:
            d["access"] = "blocked-by-network"
            continue
        try:
            r = list_folder(d["id"])
            d.update({"access": r["status"], "title": r.get("title"), "items": len(r["entries"]), "probed": today})
            time.sleep(1)
        except NetworkBlocked as e:
            blocked = str(e)
            d["access"] = "blocked-by-network"
    reg["drives"] = sorted(known.values(), key=lambda d: (d.get("university", ""), d.get("label", "")))
    reg["updated"] = today
    _save_registry(reg)
    uni = a.university or "<university>"
    names = {"tau": "תל אביב", "huji": "העברית", "biu": "בר אילן", "bgu": "בן גוריון", "haifa": "חיפה", "technion": "טכניון"}
    he = names.get(a.university or "", "<שם האוניברסיטה>")
    queries = [f'"drive.google.com/drive/folders" מדעי החיים {he} מבחנים', f'דרייב מדעי החיים {he} סיכומים מבחני עבר',
               f'אגודת הסטודנטים {he} מאגר סיכומים דרייבים חוגיים', f'site:linktr.ee OR site:linktree.com מדעי החיים {he} דרייב',
               f'site:t.me דרייב ביולוגיה {he} מבחנים סיכומים', f'"{he}" ביולוגיה "מאגר מבחנים" OR "בנק מבחנים" סטודנטים',
               f'site:studocu.com {he} ביולוגיה מבחן', f'site:scribd.com {he} ביולוגיה מבחן מועד א']
    write(a.output, {"university": uni, "hubs": report, "blockedByNetwork": blocked,
                     "registry": str(REGISTRY), "drives": [d for d in reg["drives"] if not a.university or d.get("university") == a.university],
                     "searchQueries": queries,
                     "instructions": "Run every searchQuery with WebSearch. A result page that lists drives is a new hub: add it to "
                                     "references/drive-hubs.json and run discover again. A single folder link: `probe` it, and if public add it "
                                     "to the registry by running `fetch --url`. Then `fetch` every public biology folder and run `index`. "
                                     "`login` folders are closed to us — leave them. `blocked-by-network` means this machine's network "
                                     "filters Google Drive: stop and tell the user; do not try another route."})
    if blocked:
        sys.exit(f"blocked-by-network: {blocked}")


def _download(file_id: str, kind: str, dest: Path, max_mb: float) -> dict:
    if kind == "gdoc":  # native Google file: export as PDF
        url = f"https://docs.google.com/uc?export=download&id={file_id}"
    else:
        url = f"https://drive.google.com/uc?export=download&id={file_id}"
    st, final, body = _get(url, binary=True, timeout=180)
    if st == 200 and body[:15].lstrip().lower().startswith(b"<!doctype html") and b"confirm" in body[:20000]:
        # the "can't scan for viruses" page of a large file: follow its own confirm form
        page = body.decode("utf-8", "replace")
        action = html.unescape((re.search(r'<form[^>]+action="([^"]+)"', page) or [None, ""])[1])
        params = dict(re.findall(r'<input type="hidden" name="([^"]+)" value="([^"]*)"', page))
        if action:
            st, final, body = _get(action + "?" + urllib.parse.urlencode(params), binary=True, timeout=600)
    if st != 200:
        return {"status": f"http-{st}"}
    if len(body) > max_mb * 1024 * 1024:
        return {"status": "too-large", "bytes": len(body)}
    if body[:15].lstrip().lower().startswith(b"<!doctype html") and b"accounts.google.com" in body[:8000]:
        return {"status": "login"}
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(body)
    return {"status": "ok", "bytes": len(body), "sha256": hashlib.sha256(body).hexdigest()[:16]}


def cmd_fetch(a) -> None:
    fid = (FOLDER_RE.search(a.url) or [None, a.url])[1]
    reg = _registry()
    entry = next((d for d in reg["drives"] if d["id"] == fid), None)
    uni = a.university or (entry or {}).get("university") or "unknown"
    root = DRIVES / uni / fid
    manifest_path = root / "_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"folder": fid, "files": {}}
    safe = lambda s: re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", s).strip(" .")[:120] or "_"
    stats = {"folders": 0, "downloaded": 0, "kept": 0, "skipped": 0, "failed": 0, "bytes": 0}
    queue = [(fid, Path("."))]
    try:
        # --resume: no new listing. The first run's manifest already names every file of the drive (those over
        # the limit are `skipped-limit` with their ids), so pick from it by path — exams first, then the rest.
        if a.resume:
            pat = re.compile(a.match, re.I) if a.match else None
            for key, old in list(manifest["files"].items()):
                if old.get("status") != "skipped-limit" or not old.get("id") or (pat and not pat.search(key)):
                    continue
                if stats["downloaded"] >= a.max_files or stats["bytes"] > a.max_total_mb * 1024 * 1024:
                    stats["skipped"] += 1
                    continue
                pth = Path(key)
                res = _download(old["id"], "gdoc" if not pth.suffix or old.get("kind") == "gdoc" else "file", root / pth, a.max_file_mb)
                manifest["files"][key] = {"id": old["id"], **res}
                stats["downloaded" if res["status"] == "ok" else "failed"] += 1
                stats["bytes"] += res.get("bytes", 0) if res["status"] == "ok" else 0
                time.sleep(1)
            queue = []
        # --subpath "שנה ג/ביולוגיה/גנטיקה": a big faculty drive holds thousands of files of other
        # courses; walk down to the named folders by name and fetch only those (the first run's manifest
        # lists every path, so the folders to ask for can be read from it).
        if a.subpath:
            title = list_folder(fid)
            if title["status"] != "public":
                sys.exit(f"error: folder is not public ({title['status']}) — nothing fetched")
            manifest["title"] = title["title"]
            queue = []
            for sp in a.subpath:
                cur, level = fid, title
                for name in [x for x in sp.replace("\\", "/").split("/") if x]:
                    nxt = next((e for e in level["entries"] if e["kind"] == "folder" and (e["name"].strip() == name.strip() or safe(e["name"]) == name.strip())), None)
                    if not nxt:
                        sys.exit(f"error: no folder '{name}' under '{sp}' — names there: {[e['name'] for e in level['entries'] if e['kind'] == 'folder'][:40]}")
                    cur = nxt["id"]
                    time.sleep(1)
                    level = list_folder(cur)
                queue.append((cur, Path(*[safe(x) for x in sp.replace("\\", "/").split("/") if x])))
        while queue:
            cur, rel = queue.pop(0)
            r = list_folder(cur)
            if r["status"] != "public":
                if cur == fid:
                    sys.exit(f"error: folder is not public ({r['status']}) — nothing fetched")
                manifest["files"][rel.as_posix()] = {"status": r["status"], "kind": "folder"}
                continue
            if cur == fid:
                manifest["title"] = r["title"]
            print(f"  {rel.as_posix()}  ({len(r['entries'])} items)", file=sys.stderr)
            stats["folders"] += 1
            for e in r["entries"]:
                p = rel / safe(e["name"])
                if e["kind"] == "folder":
                    queue.append((e["id"], p))
                    continue
                key = p.as_posix()
                if e["kind"] == "gdoc" and not p.suffix:
                    p = p.with_suffix(".pdf"); key = p.as_posix()
                old = manifest["files"].get(key)
                if old and old.get("status") == "ok" and (root / p).exists():
                    stats["kept"] += 1
                    continue
                if stats["downloaded"] >= a.max_files or stats["bytes"] > a.max_total_mb * 1024 * 1024:
                    stats["skipped"] += 1
                    manifest["files"][key] = {"id": e["id"], "status": "skipped-limit", "kind": e["kind"]}
                    continue
                if not re.search(r"\.(pdf|docx?|pptx?|xlsx?|txt|png|jpe?g|rtf)$", p.name, re.I) and e["kind"] != "gdoc":
                    stats["skipped"] += 1
                    manifest["files"][key] = {"id": e["id"], "status": "skipped-type"}
                    continue
                res = _download(e["id"], e["kind"], root / p, a.max_file_mb)
                manifest["files"][key] = {"id": e["id"], **res}
                stats["downloaded" if res["status"] == "ok" else "failed"] += 1
                stats["bytes"] += res.get("bytes", 0) if res["status"] == "ok" else 0
                time.sleep(1)  # one file a second: polite, and below Google's anonymous throttling
            time.sleep(1)
    except NetworkBlocked as e:
        sys.exit(f"blocked-by-network: {e}")
    finally:
        root.mkdir(parents=True, exist_ok=True)
        manifest.update({"fetchedAt": time.strftime("%Y-%m-%d"), "stats": stats, "university": uni})
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    reg = _registry()  # read again: a long fetch must not overwrite what `discover` wrote meanwhile
    entry = next((d for d in reg["drives"] if d["id"] == fid), None)
    if entry is None:
        reg["drives"].append({"id": fid, "kind": "folder", "url": a.url, "university": uni, "label": manifest.get("title", ""), "access": "public",
                              "foundOn": a.found_on or "manual", "firstSeen": time.strftime("%Y-%m-%d"), "biology": True})
    for d in reg["drives"]:
        if d["id"] == fid:
            d.update({"fetched": time.strftime("%Y-%m-%d"), "dir": str(root), "stats": stats})
    _save_registry(reg)
    write(a.output, {"folder": fid, "dir": str(root), "title": manifest.get("title"), "stats": stats,
                     "note": "skipped-limit files remain: run fetch again with higher --max-files / --max-total-mb" if stats["skipped"] else ""})


CATS = [("exam", r"מבח|בחינ|מועד|בוחן|בחנים|exam|quiz|midterm|final"), ("hw", r"תרגיל|עבוד[הת] בית|ש\"?ב|homework|hw|assignment|ex\d"),
        ("tutorial", r"תרגול|tutorial|recitation"), ("lecture", r"הרצא|מצג|שקפ|lecture|slides|ppt"),
        ("summary", r"סיכו|summary|notes"), ("syllabus", r"סילבוס|syllabus|תכנית הקורס")]


ALIASES = Path(__file__).resolve().parent.parent / "references" / "drive-aliases.json"
_alias_cache: dict | None = None


def _course_of(path: str, uni: str, syl: dict) -> tuple[str | None, str | None]:
    """Which of our courses a file belongs to. A folder on its path must BE the course: its name equals the
    synced course name or a curated alias (references/drive-aliases.json), or carries the course code.
    A name that merely contains the course name is not enough — "מעבדה- פיזיולוגיה של מערכות" is the lab,
    "מולקולרית הזדקנות" an elective. The deepest matching folder wins."""
    global _alias_cache
    if _alias_cache is None:
        _alias_cache = json.loads(ALIASES.read_text(encoding="utf-8")).get("aliases", {}) if ALIASES.exists() else {}
    norm = lambda t: re.sub(r"\s+", " ", re.sub(r"\(\s*\d{4,}\s*\)|[\"'״׳`’\-–.,:]", " ", t)).strip()
    mine = {k: r for k, r in syl.items() if r["university"] == uni}
    names: dict[str, str] = {}
    for slug, r in mine.items():
        for n in [r.get("nameHe", "")] + _alias_cache.get(slug, []):
            if len(norm(n)) >= 4:
                names.setdefault(norm(n), slug)
    parts = path.replace("\\", "/").split("/")[:-1]
    for part in reversed(parts):
        if norm(part) in names:
            slug = names[norm(part)]
            return mine[slug].get("code"), slug
        m = re.search(r"\((\d{5,})\)", part)
        if m:
            for slug, r in mine.items():
                code = re.sub(r"\D", "", r.get("code", ""))
                if len(code) >= 5 and code.lstrip("0") == m[1].lstrip("0"):
                    return r.get("code"), slug
    return None, None


def cmd_index(a) -> None:
    syl = load_syllabi()
    rows = []
    text_root = DRIVES / "_text"
    for mf in DRIVES.glob("*/*/_manifest.json"):
        root, uni = mf.parent, mf.parent.parent.name
        for f in root.rglob("*"):
            if not f.is_file() or f.name == "_manifest.json":
                continue
            rel = f.relative_to(root).as_posix()
            ext = f.suffix.lower()
            # named by a hash of the path: student folder trees are deep and Windows stops at 260 characters
            txt_path = text_root / uni / root.name / (hashlib.sha1(rel.encode("utf-8")).hexdigest()[:20] + ".txt")
            text, status = "", "skipped"
            if ext == ".pdf":
                txt_path.parent.mkdir(parents=True, exist_ok=True)
                if not txt_path.exists() or txt_path.stat().st_mtime < f.stat().st_mtime:
                    subprocess.run(["pdftotext", "-layout", "-enc", "UTF-8", str(f), str(txt_path)], capture_output=True)
                text = txt_path.read_text(encoding="utf-8", errors="replace") if txt_path.exists() else ""
            elif ext == ".docx":
                try:
                    text = docx_text(f)
                except Exception:
                    text = ""
                txt_path.parent.mkdir(parents=True, exist_ok=True)
                txt_path.write_text(text, encoding="utf-8")
            elif ext == ".txt":
                text = f.read_text(encoding="utf-8", errors="replace")
            if ext in (".pdf", ".docx", ".txt"):
                q = text_quality(text)
                status = "no-text" if q["empty"] else "unreadable" if q["reversed"] else "ok"
            code, slug = _course_of(rel, uni, syl)
            cat = next((c for c, pat in CATS if re.search(pat, rel, re.I)), "other")
            rows.append({"university": uni, "drive": root.name, "course": code, "slug": slug, "path": rel, "ext": ext, "size": f.stat().st_size,
                         "cat": cat, "year": path_year(rel) or None, "chars": len(text), "status": status,
                         "txt": txt_path.relative_to(text_root).as_posix() if text else None})
    text_root.mkdir(parents=True, exist_ok=True)
    (text_root / "index.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
    by: dict = {}
    for r in rows:
        k = by.setdefault(r["university"], {"files": 0, "mapped": 0, "exams": 0, "needVisualRead": 0, "unmappedTop": {}})
        k["files"] += 1
        k["mapped"] += 1 if r["slug"] else 0
        k["exams"] += 1 if r["cat"] == "exam" else 0
        k["needVisualRead"] += 1 if r["status"] in ("no-text", "unreadable") else 0
        if not r["slug"]:
            top = r["path"].split("/")[0]
            k["unmappedTop"][top] = k["unmappedTop"].get(top, 0) + 1
    write(a.output, {"index": str(text_root / "index.json"), "files": len(rows), "byUniversity": by,
                     "academicYear": academic_year(),
                     "instructions": "unmappedTop lists top-level folders whose files matched none of our courses: read the names — a course under "
                                     "another name needs a row in content/syllabi/registry.ts (or an alias), a course we do not teach is left "
                                     "unmapped. Files under needVisualRead are scans: open them with the Read tool."})


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("discover"); s.add_argument("--university", help="tau | huji | biu | bgu | haifa | technion")
    s.add_argument("--all", action="store_true", help="keep non-biology drives too"); s.add_argument("--output", required=True)
    s = sub.add_parser("probe"); s.add_argument("--url", required=True, help="folder URL or id"); s.add_argument("--output", required=True)
    s = sub.add_parser("fetch"); s.add_argument("--url", required=True, help="folder URL or id"); s.add_argument("--university")
    s.add_argument("--resume", action="store_true", help="download files the manifest lists as skipped-limit, without listing the drive again")
    s.add_argument("--match", help="with --resume: only paths matching this regex (e.g. 'מבח|בחינ|מועד|שחזור|סילבוס')")
    s.add_argument("--subpath", action="append", help="fetch only this folder path inside the drive (repeatable), e.g. 'שנה ג/ביולוגיה/גנטיקה'")
    s.add_argument("--found-on", dest="found_on"); s.add_argument("--max-files", type=int, default=400)
    s.add_argument("--max-file-mb", type=float, default=40); s.add_argument("--max-total-mb", type=float, default=1500)
    s.add_argument("--output", required=True)
    s = sub.add_parser("index"); s.add_argument("--output", required=True)
    a = p.parse_args()
    try:
        {"discover": cmd_discover, "probe": cmd_probe, "fetch": cmd_fetch, "index": cmd_index}[a.cmd](a)
    except RateLimitError as e:
        sys.exit(f"rate limited: {e}")
    except NetworkBlocked as e:
        sys.exit(f"blocked-by-network: {e}")


if __name__ == "__main__":
    main()
