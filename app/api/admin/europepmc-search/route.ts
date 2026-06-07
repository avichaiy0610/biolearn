import { isAdmin } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const q = req.nextUrl.searchParams.get("q")?.trim();
  const source = req.nextUrl.searchParams.get("source") ?? "europepmc"; // europepmc | openalex
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "10"), 20);

  if (!q) return Response.json({ error: "Missing query" }, { status: 400 });

  if (source === "openalex") {
    const url =
      `https://api.openalex.org/works?search=${encodeURIComponent(q)}` +
      `&per_page=${limit}&filter=has_abstract:true` +
      `&select=id,title,authorships,publication_year,primary_location,abstract_inverted_index,doi` +
      `&mailto=avichaiy0610@outlook.com`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return Response.json({ error: "OpenAlex failed" }, { status: 502 });

    const data = await res.json();
    const articles = (data.results ?? []).map((w: OpenAlexWork) => ({
      source: "openalex",
      id: w.id,
      title: w.title ?? "",
      authors: (w.authorships ?? []).slice(0, 4).map((a) => a.author?.display_name ?? ""),
      journal: w.primary_location?.source?.display_name ?? null,
      year: w.publication_year ?? null,
      abstract: reconstructAbstract(w.abstract_inverted_index),
      url: w.doi ? `https://doi.org/${w.doi}` : w.id,
    })).filter((a: { abstract: string }) => a.abstract.length > 50);

    return Response.json({ articles, source: "openalex" });
  }

  // EuropePMC
  const url =
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(q)}` +
    `&format=json&pageSize=${limit}&resulttype=core&sort=CITED&cursorMark=*`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return Response.json({ error: "EuropePMC failed" }, { status: 502 });

  const data = await res.json();
  const articles = (data.resultList?.result ?? []).map((r: EuropePMCResult) => ({
    source: "europepmc",
    id: r.id ?? r.pmid,
    pubmedId: r.pmid ?? null,
    title: r.title ?? "",
    authors: (r.authorList?.author ?? []).slice(0, 4).map((a) => `${a.lastName ?? ""} ${a.initials ?? ""}`.trim()),
    journal: r.journalTitle ?? null,
    year: r.pubYear ? parseInt(r.pubYear) : null,
    abstract: r.abstractText ?? "",
    url: r.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/` : `https://europepmc.org/article/${r.source}/${r.id}`,
    citationCount: r.citedByCount ?? null,
  })).filter((a: { abstract: string }) => a.abstract.length > 50);

  return Response.json({ articles, source: "europepmc" });
}

type EuropePMCResult = {
  id?: string;
  pmid?: string;
  source?: string;
  title?: string;
  authorList?: { author?: { lastName?: string; initials?: string }[] };
  journalTitle?: string;
  pubYear?: string;
  abstractText?: string;
  citedByCount?: number;
};

type OpenAlexWork = {
  id: string;
  title?: string;
  authorships?: { author?: { display_name?: string } }[];
  publication_year?: number;
  primary_location?: { source?: { display_name?: string } };
  abstract_inverted_index?: Record<string, number[]>;
  doi?: string;
};

function reconstructAbstract(index: Record<string, number[]> | undefined): string {
  if (!index) return "";
  const words: string[] = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.filter(Boolean).join(" ");
}
