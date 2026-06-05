export const dynamic = "force-dynamic";

import { getDictionary, hasLocale, type Locale } from "@/lib/dictionaries";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SyllabusUploader from "@/components/SyllabusUploader";

export default async function UploadPage({
  params,
}: PageProps<"/[lang]/admin/upload">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const topics = await prisma.topic.findMany({
    select: { slug: true, nameHe: true, nameEn: true },
    orderBy: { nameEn: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        {dict.upload.title}
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">{dict.upload.description}</p>
      <SyllabusUploader lang={lang as Locale} topics={topics} dict={dict} />
    </div>
  );
}
