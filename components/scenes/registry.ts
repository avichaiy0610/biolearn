/* Registry of hand-crafted, high-quality animated scenes.
   A process that matches here renders its bespoke scene instead of the
   LLM-generated step animation. Add a matcher + a component per process. */

export type SceneId = "transcription" | "membrane-transport";

const MATCHERS: { id: SceneId; re: RegExp }[] = [
  { id: "transcription", re: /transcription|שעתוק/i },
  { id: "membrane-transport", re: /membrane transport|transport across (the )?membrane|מעבר חומרים דרך הממברנה/i },
];

export function findSceneId(nameEn: string, nameHe: string): SceneId | null {
  return MATCHERS.find((m) => m.re.test(nameEn) || m.re.test(nameHe))?.id ?? null;
}
