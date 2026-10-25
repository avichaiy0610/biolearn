// Narrated explainer videos (real motion + Hebrew voice-over), produced in the
// sibling project ../biolearn-video (Remotion) and served as static files.
// Keyed by process slug: played by the process page's "הפעל סרטון" button, on
// their own page (/[lang]/videos/<slug>), and via [[video:<slug>]] in lesson bodies.
export type ExplainerVideo = {
  slug: string;
  src: string;
  poster: string;
  seconds: number;
  titleHe: string;
  summaryHe: string;
  topic: string;        // topic slug of the process page
  lesson?: string;      // study unit that embeds it
  // ElevenLabs free plan requires crediting it next to the audio
  voiceCreditHe: string;
};

export const EXPLAINER_VIDEOS: Record<string, ExplainerVideo> = {
  pcr: {
    slug: "pcr",
    src: "/videos/explainers/pcr-he.mp4",
    poster: "/videos/explainers/pcr-he.jpg",
    seconds: 128,
    titleHe: "איך PCR משכפל רק את הקטע שבחרנו",
    summaryHe: "הפרדת גדילים, הצמדת פריימרים והארכה — ולמה מהמחזור השלישי מופיעות מולקולות באורך המטרה בדיוק, שמוכפלות עד כמיליארד עותקים.",
    topic: "molecular-biology",
    lesson: "mol-replication-fork",
    voiceCreditHe: "הקריינות נוצרה ב-ElevenLabs",
  },
};

export const videoPageHref = (lang: string, slug: string) => `/${lang}/videos/${slug}`;
