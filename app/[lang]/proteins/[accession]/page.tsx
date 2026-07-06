export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import ProteinDetailContent from "@/components/ProteinDetailContent";

type Protein = {
  accession: string;
  id?: string;
  name: string;
  gene: string | null;
  organism: string | null;
  length: number | null;
  fn: string | null;
  locations: string[];
  diseases: string[];
  keywords: string[];
};

type Structure = {
  confidence: number;
  category: string;
  afUrl: string;
};

type PdbStructure = {
  id: string;
  title: string;
  resolution: number | null;
  method: string;
  imageUrl: string;
  rscbUrl: string;
};

type Interaction = { name: string; score: number };
type Article = { pubmedId: string; title: string; year: number | null };

async function fetchPdbStructure(accession: string): Promise<PdbStructure | null> {
  try {
    const query = {
      query: {
        type: "terminal",
        service: "text",
        parameters: {
          operator: "exact_match",
          value: accession,
          attribute: "rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession",
        },
      },
      return_type: "entry",
      request_options: {
        paginate: { start: 0, rows: 1 },
        sort: [{ sort_by: "rcsb_entry_info.resolution_combined", direction: "asc" }],
      },
    };
    const searchRes = await fetch("https://search.rcsb.org/rcsbsearch/v2/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
      next: { revalidate: 86400 },
    });
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const pdbId: string | undefined = searchData.result_set?.[0]?.identifier;
    if (!pdbId) return null;

    const metaRes = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`, {
      next: { revalidate: 86400 },
    });
    if (!metaRes.ok) return null;
    const meta = await metaRes.json();

    return {
      id: pdbId,
      title: meta.struct?.title ?? pdbId,
      resolution: meta.rcsb_entry_info?.resolution_combined?.[0] ?? null,
      method: meta.rcsb_entry_info?.experimental_method ?? "",
      imageUrl: `https://cdn.rcsb.org/images/structures/${pdbId.toLowerCase()}_assembly-1.jpeg`,
      rscbUrl: `https://www.rcsb.org/structure/${pdbId}`,
    };
  } catch {
    return null;
  }
}

async function fetchAll(accession: string): Promise<{
  protein: Protein;
  structure: Structure | null;
  pdbStructure: PdbStructure | null;
  interactions: Interaction[];
  articles: Article[];
} | null> {
  const [uniRes, afRes] = await Promise.allSettled([
    fetch(`https://rest.uniprot.org/uniprotkb/${accession}?format=json`, { next: { revalidate: 3600 } }),
    fetch(`https://alphafold.ebi.ac.uk/api/prediction/${accession}`, { next: { revalidate: 86400 } }),
  ]);
  const pdbStructure = await fetchPdbStructure(accession);

  if (uniRes.status === "rejected" || !uniRes.value.ok) return null;
  const protein = parseUniProt(await uniRes.value.json());

  let structure: Structure | null = null;
  if (afRes.status === "fulfilled" && afRes.value.ok) {
    const af = await afRes.value.json();
    if (af[0]) structure = {
      confidence: Math.round(af[0].globalMetricValue * 10) / 10,
      category: af[0].confidenceCategory,
      afUrl: `https://alphafold.ebi.ac.uk/entry/${accession}`,
    };
  }

  let interactions: Interaction[] = [];
  if (protein.gene) {
    try {
      const strRes = await fetch(
        `https://string-db.org/api/json/interaction_partners?identifiers=${encodeURIComponent(protein.gene)}&species=9606&limit=10&caller_identity=biolearn.app`,
        { next: { revalidate: 3600 } }
      );
      if (strRes.ok) {
        const strData = await strRes.json();
        interactions = (strData as { preferredName_B: string; score: number }[])
          .filter((i) => i.preferredName_B !== protein.gene)
          .slice(0, 8)
          .map((i) => ({ name: i.preferredName_B, score: Math.round(i.score * 1000) / 10 }));
      }
    } catch { /* optional */ }
  }

  let articles: Article[] = [];
  try {
    const pmQ = protein.gene ?? protein.name;
    const pmSearch = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(pmQ)}[Title/Abstract]+AND+review[pt]&retmax=4&sort=relevance&retmode=json`,
      { next: { revalidate: 3600 } }
    );
    if (pmSearch.ok) {
      const pmData = await pmSearch.json();
      const ids: string[] = pmData.esearchresult?.idlist ?? [];
      if (ids.length > 0) {
        const pmFetch = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`,
          { next: { revalidate: 3600 } }
        );
        if (pmFetch.ok) {
          const xml = await pmFetch.text();
          articles = xml.split("<PubmedArticle>").slice(1).map((block, i) => {
            const t = block.match(/<ArticleTitle[^>]*>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
            const y = block.match(/<Year>(\d{4})<\/Year>/)?.[1];
            return { pubmedId: ids[i] ?? "", title: t, year: y ? parseInt(y) : null };
          }).filter((a) => a.title);
        }
      }
    }
  } catch { /* optional */ }

  return { protein, structure, pdbStructure, interactions, articles };
}

function stripCitations(text: string): string {
  return text
    .replace(/\s*\((?:PubMed:\d+(?:,\s*PubMed:\d+)*)\)/g, "")
    .replace(/\s*\(By similarity\)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseUniProt(d: any): Protein {
  const name =
    d.proteinDescription?.recommendedName?.fullName?.value ??
    d.proteinDescription?.submittedName?.[0]?.fullName?.value ??
    d.primaryAccession;
  const gene = d.genes?.[0]?.geneName?.value ?? null;
  const comments = d.comments ?? [];
  const rawFn = comments.find((c: { commentType: string }) => c.commentType === "FUNCTION")?.texts?.[0]?.value ?? null;
  const fn = rawFn ? stripCitations(rawFn) : null;
  const locations = comments
    .filter((c: { commentType: string }) => c.commentType === "SUBCELLULAR LOCATION")
    .flatMap((c: { subcellularLocations?: { location: { value: string } }[] }) =>
      c.subcellularLocations?.map((l) => l.location.value) ?? []
    ).slice(0, 5);
  const diseases = comments
    .filter((c: { commentType: string }) => c.commentType === "DISEASE")
    .map((c: { disease?: { diseaseId?: string } }) => c.disease?.diseaseId)
    .filter(Boolean) as string[];
  const keywords = (d.keywords ?? []).slice(0, 10).map((k: { name: string }) => k.name);

  return {
    accession: d.primaryAccession,
    id: d.uniProtkbId,
    name,
    gene,
    organism: d.organism?.scientificName ?? null,
    length: d.sequence?.length ?? null,
    fn,
    locations,
    diseases,
    keywords,
  };
}

export default async function ProteinPage({
  params,
}: {
  params: Promise<{ lang: string; accession: string }>;
}) {
  const { lang, accession } = await params;

  const data = await fetchAll(accession.toUpperCase());
  if (!data) notFound();

  return (
    <ProteinDetailContent
      lang={lang}
      protein={data.protein}
      structure={data.structure}
      pdbStructure={data.pdbStructure}
      interactions={data.interactions}
      articles={data.articles}
    />
  );
}
