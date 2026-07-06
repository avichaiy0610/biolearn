import { prisma } from "@/lib/prisma";

/**
 * Video storage abstraction.
 *
 * The rest of the app only calls saveProcessVideo / hasProcessVideo /
 * getProcessVideoBytes / videoUrlFor — it never knows where the bytes live.
 *
 * FREE backend (default, for the testing phase): "db" — stores the MP4 as
 * base64 in the Turso database (ProcessVideo table). No external service,
 * no extra credentials, works on Vercel.
 *
 * To move to a paid/CDN backend later (Vercel Blob, S3, Cloudflare R2, …):
 *   1. add a provider branch below (e.g. "blob") that uploads and returns a URL,
 *   2. set VIDEO_STORAGE_PROVIDER=blob in the environment.
 * Nothing else in the codebase needs to change.
 */
type Provider = "db" | "blob";
const PROVIDER: Provider = (process.env.VIDEO_STORAGE_PROVIDER as Provider) ?? "db";

/** Public URL the app uses to play a process video. */
export function videoUrlFor(slug: string): string {
  return `/api/process-video/${encodeURIComponent(slug)}`;
}

/** Persist an MP4 for a process. Returns the URL to play it. */
export async function saveProcessVideo(slug: string, mp4: Buffer): Promise<string> {
  switch (PROVIDER) {
    case "db": {
      const data = mp4.toString("base64");
      await prisma.processVideo.upsert({
        where: { slug },
        create: { slug, data },
        update: { data },
      });
      return videoUrlFor(slug);
    }
    // case "blob": // TODO(paid): upload to Vercel Blob / S3 and return its CDN URL
    default:
      throw new Error(`VIDEO_STORAGE_PROVIDER "${PROVIDER}" is not implemented yet`);
  }
}

/** Whether a stored video exists — defensive so a not-yet-migrated table never breaks a page. */
export async function hasProcessVideo(slug: string): Promise<boolean> {
  if (PROVIDER !== "db") return false;
  try {
    const row = await prisma.processVideo.findUnique({ where: { slug }, select: { slug: true } });
    return !!row;
  } catch {
    return false;
  }
}

/** Raw MP4 bytes for streaming, or null if none / table missing. */
export async function getProcessVideoBytes(slug: string): Promise<Buffer | null> {
  if (PROVIDER !== "db") return null;
  try {
    const row = await prisma.processVideo.findUnique({ where: { slug }, select: { data: true } });
    return row ? Buffer.from(row.data, "base64") : null;
  } catch {
    return null;
  }
}
