import { NextRequest } from "next/server";

type ReactomeEntry = {
  stId: string;
  name: string;
  summation?: string;
  exactType?: string;
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return Response.json([]);

  const url =
    `https://reactome.org/ContentService/search/query?query=${encodeURIComponent(q)}` +
    `&types=Pathway&species=Homo%20sapiens&cluster=true&rows=6&start=0`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return Response.json([]);

    const data = await res.json();
    const entries: ReactomeEntry[] = data.results?.[0]?.entries ?? [];

    return Response.json(
      entries.slice(0, 6).map((r) => ({
        id: r.stId,
        name: r.name,
        summary: r.summation?.replace(/<[^>]+>/g, "").slice(0, 160) ?? null,
        url: `https://reactome.org/PathwayBrowser/#/${r.stId}`,
      }))
    );
  } catch {
    return Response.json([]);
  }
}
