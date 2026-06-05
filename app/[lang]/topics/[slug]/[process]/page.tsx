import { notFound } from "next/navigation";
import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProcessAnimation from "@/components/ProcessAnimation";

export default async function ProcessPage({
  params,
}: PageProps<"/[lang]/topics/[slug]/[process]">) {
  const { lang, slug, process: processSlug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const process = await prisma.process.findFirst({
    where: { slug: processSlug, topic: { slug } },
    include: {
      steps: { orderBy: { order: "asc" } },
      topic: true,
    },
  });

  if (!process) notFound();

  const processName = lang === "he" ? process.nameHe : process.nameEn;
  const topicName = lang === "he" ? process.topic.nameHe : process.topic.nameEn;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        <Link href={`/${lang}/topics`} className="hover:text-emerald-600">
          {dict.topics.title}
        </Link>
        <span>/</span>
        <Link
          href={`/${lang}/topics/${slug}`}
          className="hover:text-emerald-600"
        >
          {topicName}
        </Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-zinc-50 font-medium">
          {processName}
        </span>
      </nav>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
        {processName}
      </h1>

      <ProcessAnimation
        steps={process.steps}
        lang={lang as Locale}
        dict={dict}
        processName={processName}
      />
    </div>
  );
}
