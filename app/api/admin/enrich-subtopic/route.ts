import { isAdmin } from "@/lib/supabase/server";
import { NextRequest } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const QUALITY_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { subtopicId, subtopicNameEn, subtopicNameHe, topicNameEn, contentEn, contentHe } =
    await req.json();

  if (!subtopicNameEn || !topicNameEn)
    return Response.json({ error: "Missing required fields" }, { status: 400 });

  // Fetch PubMed articles and Reactome pathways in parallel
  const [pmData, reactomeData] = await Promise.allSettled([
    fetchPubMedSummaries(subtopicNameEn),
    fetchReactomePathways(subtopicNameEn),
  ]);

  const articles = pmData.status === "fulfilled" ? pmData.value : [];
  const pathways = reactomeData.status === "fulfilled" ? reactomeData.value : [];

  // Build scientific context
  const articleContext = articles
    .map((a, i) => `[${i + 1}] ${a.title} (${a.year ?? "?"}): ${a.abstract.slice(0, 300)}`)
    .join("\n\n");

  const pathwayContext = pathways
    .map((p: { name: string; id: string }) => `• ${p.name} (${p.id})`)
    .join("\n");

  const prompt = `You are a biology professor enriching educational content with scientific accuracy.

Topic: ${topicNameEn}
Subtopic: ${subtopicNameEn}

Current content (English):
${contentEn ?? "(empty)"}

Current content (Hebrew):
${contentHe ?? "(empty)"}

Recent PubMed articles about this subtopic:
${articleContext || "(none found)"}

Related Reactome pathways:
${pathwayContext || "(none found)"}

Your task: Write ENRICHED educational content that:
1. Incorporates key findings from the scientific literature
2. References relevant biological pathways where appropriate
3. Is clear and accurate for undergraduate biology students
4. Expands on mechanisms, clinical relevance, and recent discoveries

Respond ONLY with valid JSON (no markdown):
{
  "contentEn": "enriched English content (2-4 paragraphs, plain text)",
  "contentHe": "enriched Hebrew content (same level of detail, plain text, in Hebrew)",
  "highlights": ["key scientific insight 1", "key insight 2", "key insight 3"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: QUALITY_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return Response.json({
      subtopicId,
      contentEn: result.contentEn ?? "",
      contentHe: result.contentHe ?? "",
      highlights: result.highlights ?? [],
      sources: {
        articles: articles.map((a) => ({ title: a.title, year: a.year, url: a.url })),
        pathways: pathways.map((p: { name: string; id: string; url: string }) => ({ name: p.name, id: p.id, url: p.url })),
      },
    });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

async function fetchPubMedSummaries(query: string) {
  try {
    const search = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}[Title/Abstract]+AND+review[pt]&retmax=3&sort=relevance&retmode=json`,
      { next: { revalidate: 3600 } }
    );
    if (!search.ok) return [];
    const { esearchresult } = await search.json();
    const ids: string[] = esearchresult?.idlist ?? [];
    if (!ids.length) return [];

    const fetch2 = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`,
      { next: { revalidate: 3600 } }
    );
    if (!fetch2.ok) return [];
    const summary = await fetch2.json();

    return ids.map((id) => {
      const doc = summary.result?.[id];
      return {
        id,
        title: doc?.title ?? "",
        year: doc?.pubdate ? parseInt(doc.pubdate) : null,
        abstract: doc?.title ?? "", // summary doesn't include abstract; use title as fallback
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      };
    }).filter((a) => a.title);
  } catch { return []; }
}

async function fetchReactomePathways(query: string) {
  try {
    const res = await fetch(
      `https://reactome.org/ContentService/search/query?query=${encodeURIComponent(query)}&types=Pathway&species=Homo%20sapiens&cluster=true&rows=4&start=0`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results?.[0]?.entries ?? []).slice(0, 4).map(
      (r: { stId: string; name: string }) => ({
        id: r.stId,
        name: r.name,
        url: `https://reactome.org/PathwayBrowser/#/${r.stId}`,
      })
    );
  } catch { return []; }
}
