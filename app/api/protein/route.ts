import { NextRequest } from "next/server";

type UniProtResult = {
  primaryAccession: string;
  uniProtkbId?: string;
  proteinDescription?: {
    recommendedName?: { fullName?: { value: string } };
    submittedName?: { fullName?: { value: string } }[];
  };
  genes?: { geneName?: { value: string } }[];
  organism?: { scientificName: string };
  sequence?: { length: number };
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return Response.json([]);

  const url =
    `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(q)}` +
    `+AND+reviewed:true+AND+organism_id:9606` +
    `&format=json&size=8&fields=accession,id,protein_name,gene_names,organism_name,sequence`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json([]);
    const data = await res.json();
    if (!data.results) return Response.json([]);

    return Response.json(
      data.results.map((r: UniProtResult) => ({
        accession: r.primaryAccession,
        name:
          r.proteinDescription?.recommendedName?.fullName?.value ??
          r.proteinDescription?.submittedName?.[0]?.fullName?.value ??
          r.primaryAccession,
        gene: r.genes?.[0]?.geneName?.value ?? null,
        organism: r.organism?.scientificName ?? null,
        length: r.sequence?.length ?? null,
        id: r.uniProtkbId ?? null,
      }))
    );
  } catch {
    return Response.json([]);
  }
}
