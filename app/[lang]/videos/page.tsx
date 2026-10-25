import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { hasLocale } from "@/lib/dictionaries";
import { EXPLAINER_VIDEOS, videoPageHref } from "@/content/explainer-videos";

export const metadata: Metadata = { title: "סרטוני הסבר", description: "סרטוני הסבר מונפשים עם קריינות בעברית לתהליכים ביולוגיים." };

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default async function VideosPage({ params }: PageProps<"/[lang]/videos">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <div dir="rtl" className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-black">סרטוני הסבר</h1>
      <p className="mt-2 text-muted">תהליכים ביולוגיים בתנועה, עם קריינות וכתוביות בעברית.</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {Object.values(EXPLAINER_VIDEOS).map((v) => (
          <li key={v.slug}>
            <Link href={videoPageHref(lang, v.slug)} className="block overflow-hidden rounded-2xl border border-line bg-surface hover:border-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.poster} alt="" className="aspect-video w-full object-cover" />
              <span className="block p-4">
                <strong className="block">{v.titleHe}</strong>
                <span className="mt-1 block text-sm text-muted">{v.summaryHe}</span>
                <span className="mt-2 block text-xs text-muted" dir="ltr">{mmss(v.seconds)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
