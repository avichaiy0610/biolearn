import { getProcessVideoBytes } from "@/lib/video-storage";

// Streams a stored process MP4 (backend chosen in lib/video-storage.ts).
export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const bytes = await getProcessVideoBytes(slug);
  if (!bytes) return new Response("Video not found", { status: 404 });

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
