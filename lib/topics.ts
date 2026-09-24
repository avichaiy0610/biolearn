// Topics that are too thin to present as real learning units yet (depth over
// breadth). They are shown as "בקרוב" (not linked), excluded from counts and the
// sitemap, and their pages are noindex. Remove a slug once the topic has real
// subtopics + at least one reviewed animation.
export const COMING_SOON_SLUGS = new Set([
  "bioinformatics",
  "developmental-biology",
  "ecology",
  "evolutionary-biology",
  "neurobiology",
  "endocrinology",
  "plant-physiology",
]);

export function isComingSoon(topic: { slug: string; _count?: { processes: number; subtopics: number } }) {
  if (COMING_SOON_SLUGS.has(topic.slug)) return true;
  // Safety net for newly generated topics: one subtopic and no animation.
  return !!topic._count && topic._count.subtopics <= 1 && topic._count.processes === 0;
}
