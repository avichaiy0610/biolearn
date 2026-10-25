// Narrated explainer videos (real motion + Hebrew voice-over), produced in the
// sibling project ../biolearn-video (Remotion) and served as static files.
// Keyed by process slug; shown on the process page and via [[video:<slug>]] in lesson bodies.
export type ExplainerVideo = {
  src: string;
  poster: string;
  seconds: number;
  titleHe: string;
  // ElevenLabs free plan requires crediting it next to the audio
  voiceCreditHe: string;
};

export const EXPLAINER_VIDEOS: Record<string, ExplainerVideo> = {
  pcr: {
    src: "/videos/explainers/pcr-he.mp4",
    poster: "/videos/explainers/pcr-he.jpg",
    seconds: 128,
    titleHe: "איך PCR משכפל רק את הקטע שבחרנו",
    voiceCreditHe: "הקריינות נוצרה ב-ElevenLabs",
  },
};
