// LOCAL-ONLY preview used while polishing animations (never served in production).
//   /he/dev-scenes/<process-slug>   → the polished scene from content/process-scenes
//   /he/dev-scenes/draft-<draftId>  → a raw ProcessDraft from the DB
// Every step is rendered at once (initialStep) so scripts/scene-shots.mjs can
// screenshot all of them at desktop and 390px widths.
import { notFound } from "next/navigation";
import ProcessAnimation from "@/components/ProcessAnimation";
import { PROCESS_SCENES, stepSvgData } from "@/content/process-scenes";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/dictionaries";
import type { StepLike } from "@/lib/animation-standards";

const dict = { process: { step: "שלב", of: "מתוך", explain: "הסבר", explaining: "...", previous: "הקודם", next: "הבא", playAnimation: "הפעל אנימציה", pauseAnimation: "עצור אנימציה" } };

export default async function DevScenePage({ params }: PageProps<"/[lang]/dev-scenes/[slug]">) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { lang, slug } = await params;

  let raw: StepLike[] = [];
  if (slug.startsWith("draft-")) {
    const d = await prisma.processDraft.findUnique({ where: { id: slug.slice(6) } });
    if (!d) notFound();
    raw = JSON.parse(d.steps) as StepLike[];
  } else {
    const scene = PROCESS_SCENES.find((s) => s.slug === slug);
    if (!scene) notFound();
    raw = scene.steps.map((st) => ({ ...st, svgData: stepSvgData(scene, st) }));
  }
  const steps = raw.map((s, i) => ({ id: String(i), order: i + 1, ...s }));
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 flex flex-col gap-16">
      {steps.map((_, i) => (
        <section key={i} data-step={i}>
          <ProcessAnimation steps={steps} lang={lang as Locale} dict={dict} processName={slug} initialStep={i} />
        </section>
      ))}
    </div>
  );
}
