import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { hasLocale } from "@/lib/dictionaries";
import { EXPLAINER_VIDEOS } from "@/content/explainer-videos";
import { lessonBySlug } from "@/content/lessons";
import ExplainerVideoCard from "@/components/ExplainerVideoCard";

export async function generateMetadata({ params }: PageProps<"/[lang]/videos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = EXPLAINER_VIDEOS[slug];
  if (!v) return {};
  return { title: v.titleHe, description: v.summaryHe, openGraph: { title: `${v.titleHe} | BioLearn`, description: v.summaryHe, images: [v.poster] } };
}

export default async function VideoPage({ params }: PageProps<"/[lang]/videos/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const v = EXPLAINER_VIDEOS[slug];
  if (!v) notFound();
  const lesson = v.lesson ? lessonBySlug(v.lesson) : undefined;

  return (
    <div dir="rtl" className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 text-sm text-muted">
        <Link href={`/${lang}/videos`} className="hover:text-brand">סרטוני הסבר</Link>
      </nav>
      <h1 className="text-2xl font-black leading-snug">{v.titleHe}</h1>
      <p className="mt-2 text-muted">{v.summaryHe}</p>
      <ExplainerVideoCard video={v} lang={lang} showPageLink={false} />
      <div className="flex flex-wrap gap-3">
        <Link href={`/${lang}/topics/${v.topic}/${v.slug}`} className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-bold hover:border-brand">
          לאנימציה שלב אחר שלב ←
        </Link>
        {lesson && (
          <Link href={`/${lang}/learn/${lesson.slug}`} className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-bold hover:border-brand">
            ליחידת הלימוד: {lesson.titleHe} ←
          </Link>
        )}
      </div>
    </div>
  );
}
