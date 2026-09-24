"use client";

import { useState } from "react";

// A curated video of the same process, shown as a supplement to the animation.
// Click-to-load (youtube-nocookie) so no third-party iframe/cookies until asked.
export default function YouTubeSupplement({
  video,
  lang,
}: {
  video: { id: string; title: string; source: string };
  lang: string;
}) {
  const he = lang === "he";
  const [play, setPlay] = useState(false);

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          🎥 {he ? "להעמקה: סרטון תלת-ממדי של התהליך" : "Go deeper: a 3D video of this process"}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          <bdi dir="ltr">{video.title}</bdi> · {video.source} {he ? "(באנגלית)" : ""}
        </p>
      </div>
      <div className="relative w-full aspect-video bg-black">
        {play ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&cc_load_policy=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlay(true)}
            className="group absolute inset-0 w-full h-full"
            aria-label={he ? `נגן את הסרטון: ${video.title}` : `Play video: ${video.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-11 rounded-xl bg-red-600 group-hover:bg-red-500 flex items-center justify-center shadow-lg">
                <span className="ml-1 border-y-[9px] border-y-transparent border-l-[15px] border-l-white" />
              </span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
