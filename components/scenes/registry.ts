/* Registry of hand-crafted, high-quality animated scenes.
   A process that matches here renders its bespoke scene instead of the
   LLM-generated step animation. Add a matcher + a component per process. */

export type SceneId = "transcription";

const MATCHERS: { id: SceneId; re: RegExp }[] = [
  { id: "transcription", re: /transcription|שעתוק/i },
];

export function findSceneId(nameEn: string, nameHe: string): SceneId | null {
  return MATCHERS.find((m) => m.re.test(nameEn) || m.re.test(nameHe))?.id ?? null;
}
