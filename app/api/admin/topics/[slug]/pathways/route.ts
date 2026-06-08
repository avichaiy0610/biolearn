import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";

// GET: fetch Reactome pathway search suggestions for this topic (or ?q=custom+query)
export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { slug } = await ctx.params;
  const topic = await prisma.topic.findUnique({ where: { slug }, select: { nameEn: true, reactomePathwayIds: true } });
  if (!topic) return Response.json({ error: "Not found" }, { status: 404 });

  const q = new URL(req.url).searchParams.get("q") ?? topic.nameEn;

  // Fetch search suggestions from Reactome
  const url =
    `https://reactome.org/ContentService/search/query?query=${encodeURIComponent(q)}` +
    `&types=Pathway&species=Homo%20sapiens&cluster=true&rows=10&start=0`;
  const pinned: string[] = topic.reactomePathwayIds ? JSON.parse(topic.reactomePathwayIds) : [];
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return Response.json({ suggestions: [], pinned, reactomeError: true });
    const data = await res.json();
    const stripHtml = (s: string) => s.replace(/<[^>]+>/g, "");
    const entries = data.results?.[0]?.entries ?? [];
    const suggestions = entries.slice(0, 10).map((r: { stId: string; name: string; summation?: string }) => ({
      stId: r.stId,
      name: stripHtml(r.name),
      summary: r.summation ? stripHtml(r.summation).slice(0, 200) : null,
    }));
    return Response.json({ suggestions, pinned });
  } catch {
    return Response.json({ suggestions: [], pinned, reactomeError: true });
  }
}

// PUT: save selected pathway IDs (null = auto-search, [] = show none, [ids] = show these)
export async function PUT(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  const { slug } = await ctx.params;
  const { pathwayIds } = await request.json() as { pathwayIds: string[] | null };

  const updated = await prisma.topic.update({
    where: { slug },
    data: { reactomePathwayIds: pathwayIds === null ? null : JSON.stringify(pathwayIds) },
  });

  return Response.json({ reactomePathwayIds: updated.reactomePathwayIds });
}
