import { isAdmin } from "@/lib/supabase/server";

export const maxDuration = 30;

const NCBI_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

interface PubMedArticle {
  pubmedId: string;
  title: string;
  authors: string[];
  journal: string;
  year: number | null;
  abstract: string;
  url: string;
}

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 20);

  if (!query) return Response.json({ error: "Missing query" }, { status: 400 });

  // Step 1: Search PubMed for IDs
  const searchUrl = `${NCBI_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${limit}&retmode=json&sort=relevance`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) return Response.json({ error: "PubMed search failed" }, { status: 502 });

  const searchData = await searchRes.json();
  const ids: string[] = searchData.esearchresult?.idlist ?? [];
  if (ids.length === 0) return Response.json({ articles: [] });

  // Step 2: Fetch details for those IDs
  const fetchUrl = `${NCBI_BASE}/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`;
  const fetchRes = await fetch(fetchUrl);
  if (!fetchRes.ok) return Response.json({ error: "PubMed fetch failed" }, { status: 502 });

  const xml = await fetchRes.text();
  const articles = parseArticlesFromXml(xml, ids);

  return Response.json({ articles });
}

function parseArticlesFromXml(xml: string, ids: string[]): PubMedArticle[] {
  const articles: PubMedArticle[] = [];

  // Split by article record
  const articleBlocks = xml.split("<PubmedArticle>").slice(1);

  for (let i = 0; i < articleBlocks.length; i++) {
    const block = articleBlocks[i];

    const pubmedId = ids[i] ?? extractTag(block, "PMID") ?? "";
    const title = extractTag(block, "ArticleTitle") ?? "";
    const abstractText = extractAbstract(block);
    const journal = extractTag(block, "Title") ?? extractTag(block, "ISOAbbreviation") ?? "";
    const year = parseInt(extractTag(block, "Year") ?? "") || null;

    // Extract authors
    const authorBlocks = block.split("<Author ").slice(1);
    const authors = authorBlocks
      .map((ab) => {
        const last = extractTag(ab, "LastName") ?? "";
        const fore = extractTag(ab, "ForeName") ?? extractTag(ab, "Initials") ?? "";
        return fore ? `${last} ${fore}` : last;
      })
      .filter(Boolean)
      .slice(0, 6);

    if (!title || !abstractText) continue;

    articles.push({
      pubmedId,
      title: stripTags(title),
      authors,
      journal: stripTags(journal),
      year,
      abstract: stripTags(abstractText),
      url: `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`,
    });
  }

  return articles;
}

function extractTag(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : null;
}

function extractAbstract(block: string): string {
  // Handle both simple <AbstractText> and structured abstracts with multiple sections
  const fullMatch = block.match(/<Abstract>([\s\S]*?)<\/Abstract>/);
  if (!fullMatch) return "";
  const abstractBlock = fullMatch[1];
  const texts = [...abstractBlock.matchAll(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)];
  if (texts.length === 0) return extractTag(abstractBlock, "AbstractText") ?? "";
  return texts.map((m) => m[1].trim()).join(" ");
}

function stripTags(str: string): string {
  return str.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").trim();
}
