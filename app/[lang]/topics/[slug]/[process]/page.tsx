export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProcessAnimation from "@/components/ProcessAnimation";
import fs from "fs";
import path from "path";

export default async function ProcessPage({
  params,
}: PageProps<"/[lang]/topics/[slug]/[process]">) {
  const { lang, slug, process: processSlug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const proc = await prisma.process.findFirst({
    where: { slug: processSlug, topic: { slug } },
    include: {
      steps: { orderBy: { order: "asc" } },
      topic: true,
    },
  });

  if (!proc) notFound();

  const processName = lang === "he" ? proc.nameHe : proc.nameEn;
  const topicName = lang === "he" ? proc.topic.nameHe : proc.topic.nameEn;

  // Check if a pre-generated MP4 video exists in public/videos/
  const videoFilePath = path.join(process.cwd(), "public", "videos", `${processSlug}.mp4`);
  const videoUrl = fs.existsSync(videoFilePath) ? `/videos/${processSlug}.mp4` : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        <Link href={`/${lang}/topics`} className="hover:text-emerald-600">
          {dict.topics.title}
        </Link>
        <span>/</span>
        <Link href={`/${lang}/topics/${slug}`} className="hover:text-emerald-600">
          {topicName}
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-50 font-medium">{processName}</span>
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        {processName}
      </h1>

      {/* ── Real MP4 video (shown when generated via admin 🎬 button) ── */}
      {videoUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl bg-black">
          <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-sm font-semibold">{processName}</span>
            <span className="text-xs text-zinc-500 ms-auto">
              {lang === "he" ? "סרטון תהליך" : "Process video"}
            </span>
          </div>
          <video
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full aspect-video"
            src={videoUrl}
          >
            {lang === "he" ? "הדפדפן שלך לא תומך בווידאו" : "Your browser does not support video."}
          </video>
        </div>
      )}

      {/* ── Interactive step diagram ─────────────────────────────────── */}
      <ProcessAnimation
        steps={proc.steps}
        lang={lang as Locale}
        dict={dict}
        processName={processName}
        topicSlug={slug}
        processSlug={processSlug}
      />
    </div>
  );
}
