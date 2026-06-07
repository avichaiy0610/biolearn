export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";

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

type Interaction = { name: string; score: number };
type Article = { pubmedId: string; title: string; year: number | null };

async function fetchAll(accession: string): Promise<{
  protein: Protein;
  structure: Structure | null;
  interactions: Interaction[];
  articles: Article[];
} | null> {
  const [uniRes, afRes] = await Promise.allSettled([
    fetch(`https://rest.uniprot.org/uniprotkb/${accession}?format=json`, { next: { revalidate: 3600 } }),
    fetch(`https://alphafold.ebi.ac.uk/api/prediction/${accession}`, { next: { revalidate: 86400 } }),
  ]);

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

  return { protein, structure, interactions, articles };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseUniProt(d: any): Protein {
  const name =
    d.proteinDescription?.recommendedName?.fullName?.value ??
    d.proteinDescription?.submittedName?.[0]?.fullName?.value ??
    d.primaryAccession;
  const gene = d.genes?.[0]?.geneName?.value ?? null;
  const comments = d.comments ?? [];
  const fn = comments.find((c: { commentType: string }) => c.commentType === "FUNCTION")?.texts?.[0]?.value ?? null;
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

const CONFIDENCE_STYLE: Record<string, string> = {
  VERY_HIGH: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  HIGH: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  LOW: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
  VERY_LOW: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const CONFIDENCE_LABEL_HE: Record<string, string> = {
  VERY_HIGH: "ביטחון גבוה מאוד",
  HIGH: "ביטחון גבוה",
  LOW: "ביטחון נמוך",
  VERY_LOW: "ביטחון נמוך מאוד",
};

export default async function ProteinPage({
  params,
}: {
  params: Promise<{ lang: string; accession: string }>;
}) {
  const { lang, accession } = await params;
  const isHe = lang === "he";

  const data = await fetchAll(accession.toUpperCase());
  if (!data) notFound();

  const { protein, structure, interactions, articles } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10" dir={isHe ? "rtl" : "ltr"}>
      {/* Back */}
      <Link
        href={`/${lang}/proteins`}
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
      >
        {isHe ? "← חזור לחיפוש" : "← Back to search"}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-4xl mt-1">🧬</span>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-1">
              {protein.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {protein.gene && (
                <span className="font-mono text-sm px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {protein.gene}
                </span>
              )}
              <span className="font-mono text-sm text-zinc-400">{protein.accession}</span>
              {protein.organism && <span className="text-sm text-zinc-400 italic">{protein.organism}</span>}
              {protein.length && <span className="text-sm text-zinc-400">{protein.length} aa</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <a
            href={`https://www.uniprot.org/uniprotkb/${protein.accession}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
          >
            UniProt ↗
          </a>
          {structure && (
            <a
              href={structure.afUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-400 hover:text-blue-700 transition-colors"
            >
              AlphaFold ↗
            </a>
          )}
          {protein.gene && (
            <a
              href={`https://www.ncbi.nlm.nih.gov/gene/?term=${protein.gene}[sym]+AND+human[org]`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 transition-colors"
            >
              NCBI Gene ↗
            </a>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Function */}
        {protein.fn && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "📋 פונקציה" : "📋 Function"}
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{protein.fn}</p>
          </section>
        )}

        {/* AlphaFold Structure */}
        {structure && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "🔬 מבנה חלבון (AlphaFold)" : "🔬 Protein Structure (AlphaFold)"}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${CONFIDENCE_STYLE[structure.category] ?? "bg-zinc-100 dark:bg-zinc-700 text-zinc-500"}`}>
                    {isHe ? (CONFIDENCE_LABEL_HE[structure.category] ?? structure.category) : structure.category.replace("_", " ")}
                  </span>
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{structure.confidence}</span>
                  <span className="text-sm text-zinc-400">/ 100 pLDDT</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-700">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      structure.confidence >= 90 ? "bg-blue-500"
                      : structure.confidence >= 70 ? "bg-green-500"
                      : structure.confidence >= 50 ? "bg-yellow-400"
                      : "bg-red-400"
                    }`}
                    style={{ width: `${structure.confidence}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-400 mt-1.5">
                  {isHe
                    ? "ציון pLDDT — מדד לביטחון בחיזוי מבנה החלבון. מעל 90 = מבנה מהימן מאוד"
                    : "pLDDT score — confidence in predicted structure. Above 90 = very reliable"}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Subcellular Location */}
        {protein.locations.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "📍 מיקום תת-תאי" : "📍 Subcellular Location"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {protein.locations.map((loc) => (
                <span key={loc} className="text-sm px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  {loc}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Interactions (STRING) */}
        {interactions.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-1">
              {isHe ? "🔗 אינטראקציות חלבון (STRING)" : "🔗 Protein Interactions (STRING)"}
            </h2>
            <p className="text-xs text-zinc-400 mb-3">
              {isHe ? "חלבונים שמתקשרים עם " : "Proteins that interact with "}{protein.gene ?? protein.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {interactions.map((i) => (
                <a
                  key={i.name}
                  href={`https://string-db.org/network/${i.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:border-emerald-400 transition-colors"
                >
                  <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">{i.name}</span>
                  <span className={`text-xs ${i.score >= 90 ? "text-green-600 dark:text-green-400" : i.score >= 70 ? "text-yellow-600 dark:text-yellow-400" : "text-zinc-400"}`}>
                    {i.score}%
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Keywords */}
        {protein.keywords.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "🏷️ מילות מפתח" : "🏷️ Keywords"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {protein.keywords.map((kw) => (
                <span key={kw} className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                  {kw}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Diseases */}
        {protein.diseases.length > 0 && (
          <section className="rounded-2xl border border-red-100 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-5">
            <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">
              {isHe ? "🏥 מחלות קשורות" : "🏥 Associated Diseases"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {protein.diseases.map((d) => (
                <span key={d} className="text-xs px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                  {d}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* PubMed Reviews */}
        {articles.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
              {isHe ? "📄 מאמרי סקירה (PubMed)" : "📄 Review Articles (PubMed)"}
            </h2>
            <div className="space-y-2">
              {articles.map((a) => (
                <a
                  key={a.pubmedId}
                  href={`https://pubmed.ncbi.nlm.nih.gov/${a.pubmedId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group"
                >
                  <div className="flex-1">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 line-clamp-2">
                      {a.title}
                    </p>
                    {a.year && <p className="text-xs text-zinc-400 mt-0.5">{a.year}</p>}
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-600 text-xs mt-0.5 shrink-0">↗</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
