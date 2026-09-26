/**
 * Adds recent (2024–2026) PubMed review articles for every active topic to the
 * research page, analysed and translated to Hebrew with the same prompt as the
 * admin "analyze-article" route.
 *
 *   npx tsx scripts/add-recent-articles-2026-09.ts            # fetch, translate, insert (writes a backup first)
 *   npx tsx scripts/add-recent-articles-2026-09.ts --dry-run  # only list what would be added
 *   npx tsx scripts/add-recent-articles-2026-09.ts --rollback .backups/recent-articles-<ts>.json
 *
 * Without a working GROQ_API_KEY, export the picked papers, translate them
 * offline into the same JSON shape, then insert from that file:
 *   npx tsx scripts/add-recent-articles-2026-09.ts --export papers.json
 *   npx tsx scripts/add-recent-articles-2026-09.ts --translations translated.json
 */
import "dotenv/config";
import { createClient } from "@libsql/client";
import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { groq, QUALITY_MODEL } from "../lib/groq";

const db = createClient({ url: process.env.DATABASE_URL ?? "", authToken: process.env.DATABASE_AUTH_TOKEN });
const NOW = new Date().toISOString();
const cuid = () => "c" + randomBytes(12).toString("hex").slice(0, 24);
const NCBI = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const FILTER = ` AND review[pt] AND hasabstract AND english[la] AND 2024:2026[dp] NOT retracted publication[pt]`;

// Two queries per active topic, aligned with what the site teaches.
const QUERIES: Record<string, string[]> = {
  "molecular-biology": ["riboswitch[tiab] gene regulation", "transcription termination[tiab] RNA polymerase II"],
  "cell-biology": ["26S proteasome[tiab] structure mechanism", "spindle assembly checkpoint[tiab] mechanism"],
  biochemistry: ["mitochondrial cristae[tiab] oxidative phosphorylation", "Warburg effect[tiab] aerobic glycolysis"],
  genetics: ["mitochondrial DNA[tiab] heteroplasmy[tiab] inheritance", "polygenic risk score[tiab] complex traits"],
  microbiology: ["divisome[tiab] bacterial cell division", "bacteriophage[tiab] phage therapy"],
  physiology: ["cardiac excitation-contraction coupling[tiab]", "voltage-gated sodium channels[tiab] action potential"],
  immunology: ["T cell receptor[tiab] signaling activation", "Toll-like receptors[tiab] innate immunity"],
};

type Paper = { pubmedId: string; title: string; authors: string[]; journal: string; year: number | null; abstract: string };

const tag = (xml: string, t: string) => xml.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)<\\/${t}>`))?.[1].trim() ?? null;
const strip = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, c: string) => String.fromCodePoint(c[0] === "x" ? parseInt(c.slice(1), 16) : parseInt(c, 10))).replace(/\s+/g, " ").trim();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function search(q: string, n: number): Promise<string[]> {
  const url = `${NCBI}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(q + FILTER)}&retmax=${n}&retmode=json&sort=relevance`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`esearch ${res.status}`);
  return (await res.json()).esearchresult?.idlist ?? [];
}

async function fetchPapers(ids: string[]): Promise<Paper[]> {
  const res = await fetch(`${NCBI}/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`);
  if (!res.ok) throw new Error(`efetch ${res.status}`);
  const xml = await res.text();
  return xml.split("<PubmedArticle>").slice(1).map((b) => {
    const pubDate = tag(b, "PubDate") ?? "";
    const year = parseInt(tag(pubDate, "Year") ?? tag(pubDate, "MedlineDate") ?? "") || null;
    const abs = [...(tag(b, "Abstract") ?? "").matchAll(/<AbstractText([^>]*)>([\s\S]*?)<\/AbstractText>/g)]
      .map(([, attrs, txt]) => { const lbl = attrs.match(/Label="([^"]+)"/)?.[1]; return (lbl ? `${lbl}: ` : "") + strip(txt); }).join(" ");
    const authors = b.split("<Author ").slice(1).map((a) => [tag(a, "LastName"), tag(a, "ForeName") ?? tag(a, "Initials")].filter(Boolean).join(" ")).filter(Boolean).slice(0, 6);
    return { pubmedId: tag(b, "PMID") ?? "", title: strip(tag(b, "ArticleTitle") ?? ""), authors, journal: strip(tag(b, "Title") ?? ""), year, abstract: abs };
  }).filter((p) => p.pubmedId && p.title && p.abstract.length > 400 && (p.year ?? 0) >= 2024);
}

async function analyse(p: Paper, topicList: string, subtopicList: string) {
  const prompt = `You are a biology education expert. Analyze the following scientific article and return a JSON object.

Article title: ${p.title}
Authors: ${p.authors.join(", ")}
Journal: ${p.journal}, Year: ${p.year}

Abstract:
${p.abstract}

Available topics in the education platform:
${topicList}

Available subtopics:
${subtopicList}

Return ONLY valid JSON in this exact structure:
{
  "abstractHe": "תרגום מלא של ה-abstract לעברית ברורה ופשוטה",
  "keyFindings": ["ממצא מרכזי 1 בעברית — משפט אחד ברור", "ממצא מרכזי 2 בעברית", "ממצא מרכזי 3 בעברית"],
  "topicSlugs": ["slug1", "slug2"],
  "subtopicIds": ["id1", "id2"]
}

Rules:
- abstractHe: natural Hebrew translation of the full abstract
- keyFindings: 3-5 most important findings/conclusions, each as one clear Hebrew sentence
- topicSlugs: only slugs from the provided topic list that are directly relevant
- subtopicIds: only IDs from the provided subtopic list that are directly relevant
- If nothing is relevant, return empty arrays`;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const c = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a biology education expert. Return only valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
        model: QUALITY_MODEL,
        response_format: { type: "json_object" },
        max_tokens: 3000,
      });
      const j = JSON.parse(c.choices[0]?.message?.content ?? "{}");
      if (typeof j.abstractHe === "string" && j.abstractHe.length > 200 && Array.isArray(j.keyFindings) && j.keyFindings.length >= 3) return j;
    } catch (e) {
      console.warn(`  analyse retry ${attempt + 1}: ${(e as Error).message.slice(0, 120)}`);
    }
    await sleep(4000 * (attempt + 1));
  }
  throw new Error(`translation failed for PMID ${p.pubmedId}`);
}

type Translation = { pubmedId: string; abstractHe: string; keyFindings: string[]; topicSlugs: string[]; subtopicIds?: string[] };

async function apply(dryRun: boolean, exportFile?: string, translationsFile?: string) {
  const offline: Map<string, Translation> | null = translationsFile
    ? new Map((JSON.parse(fs.readFileSync(translationsFile, "utf8")) as Translation[]).map((t) => [t.pubmedId, t]))
    : null;
  const existing = new Set((await db.execute(`SELECT "pubmedId" FROM "Article" WHERE "pubmedId" IS NOT NULL`)).rows.map((r) => String(r.pubmedId)));
  const topics = (await db.execute(`SELECT "slug", "nameEn", "nameHe" FROM "Topic"`)).rows;
  const subs = (await db.execute(`SELECT "id", "nameEn", "nameHe" FROM "Subtopic" WHERE "hidden" = 0`)).rows;
  const topicList = topics.map((t) => `slug:"${t.slug}" | ${t.nameEn} (${t.nameHe})`).join("\n");
  const subtopicList = subs.map((s) => `id:"${s.id}" | ${s.nameEn} (${s.nameHe})`).join("\n");
  const validTopics = new Set(topics.map((t) => String(t.slug)));
  const validSubs = new Set(subs.map((s) => String(s.id)));

  const picked: { topic: string; paper: Paper }[] = [];
  for (const [topic, queries] of Object.entries(QUERIES)) {
    for (const q of queries) {
      const ids = (await search(q, 8)).filter((id) => !existing.has(id) && !picked.some((p) => p.paper.pubmedId === id));
      await sleep(400);
      const papers = ids.length ? await fetchPapers(ids) : [];
      await sleep(400);
      const paper = papers[0];
      if (!paper) { console.log(`  (nothing for "${q}")`); continue; }
      picked.push({ topic, paper });
      console.log(`${topic.padEnd(18)} ${paper.year} PMID ${paper.pubmedId}  ${paper.title.slice(0, 90)}`);
    }
  }
  if (exportFile) {
    fs.writeFileSync(exportFile, JSON.stringify(picked.map(({ topic, paper }) => ({ topic, ...paper })), null, 1));
    console.log(`exported ${picked.length} papers → ${exportFile}
subtopics:
${subtopicList}`);
    return;
  }
  if (dryRun) { console.log(`dry run — ${picked.length} articles would be added`); return; }
  if (offline) {
    const missing = picked.filter((p) => !offline.has(p.paper.pubmedId)).map((p) => p.paper.pubmedId);
    if (missing.length) throw new Error(`no translation for PMID ${missing.join(", ")}`);
  }

  const inserted: string[] = [];
  fs.mkdirSync(".backups", { recursive: true });
  const file = path.join(".backups", `recent-articles-${NOW.replace(/[:.]/g, "-")}.json`);
  const save = () => fs.writeFileSync(file, JSON.stringify({ inserted }, null, 1));
  save();
  console.log(`rollback file → ${file}`);
  // oldest first so the newest papers get the latest createdAt (the page lists newest first)
  picked.sort((a, b) => (a.paper.year ?? 0) - (b.paper.year ?? 0));
  for (const { topic, paper } of picked) {
    const a = offline ? offline.get(paper.pubmedId)! : await analyse(paper, topicList, subtopicList);
    const topicSlugs = [...new Set([topic, ...(a.topicSlugs as string[]).filter((s) => validTopics.has(s))])];
    const subtopicIds = ((a.subtopicIds ?? []) as string[]).filter((s) => validSubs.has(s));
    const id = cuid();
    await db.execute({
      sql: `INSERT INTO "Article" ("id","pubmedId","title","authors","journal","year","abstract","abstractHe","keyFindings","topicSlugs","subtopicIds","url","source","hidden","createdAt")
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'pubmed',0,?)`,
      args: [id, paper.pubmedId, paper.title, JSON.stringify(paper.authors), paper.journal || null, paper.year, paper.abstract, a.abstractHe,
        JSON.stringify(a.keyFindings.slice(0, 5)), JSON.stringify(topicSlugs), JSON.stringify(subtopicIds), `https://pubmed.ncbi.nlm.nih.gov/${paper.pubmedId}/`, new Date().toISOString()],
    });
    inserted.push(id);
    save();
    console.log(`  + ${paper.pubmedId} (${topicSlugs.join(", ")})`);
    if (!offline) await sleep(2500);
  }
  console.log(`added ${inserted.length} articles`);
}

async function rollback(file: string) {
  const { inserted } = JSON.parse(fs.readFileSync(file, "utf8")) as { inserted: string[] };
  for (const id of inserted) await db.execute({ sql: `DELETE FROM "Article" WHERE "id"=?`, args: [id] });
  console.log(`removed ${inserted.length} articles`);
}

const args = process.argv.slice(2);
const flag = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
(args[0] === "--rollback" ? rollback(args[1]) : apply(args.includes("--dry-run"), flag("--export"), flag("--translations"))).catch((e) => {
  console.error(e);
  process.exit(1);
});
