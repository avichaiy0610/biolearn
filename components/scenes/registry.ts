/* Registry of hand-crafted, high-quality animated scenes.
   A process that matches here renders its bespoke scene instead of the
   LLM-generated step animation. Add a matcher + a component per process. */

export type SceneId = "transcription" | "membrane-transport" | "cellular-respiration" | "mendelian-genetics" | "non-mendelian" | "secretory-pathway" | "photosynthesis" | "hemoglobin" | "blood-glucose" | "bacteria" | "adaptive-immunity" | "mito-inheritance" | "gluconeogenesis" | "urea-cycle" | "lncrna-development";

const MATCHERS: { id: SceneId; re: RegExp }[] = [
  { id: "transcription", re: /transcription|שעתוק/i },
  { id: "lncrna-development", re: /lncRNA Role in Development|תפקיד lncRNA בהתפתחות/i },
  { id: "urea-cycle", re: /urea cycle|מעגל השתנן/i },
  { id: "gluconeogenesis", re: /gluconeogenesis|גלוקונאוגנזה/i },
  { id: "mito-inheritance", re: /mitochondrial inheritance|תורשה מיטוכונדריאלית/i },
  { id: "adaptive-immunity", re: /adaptive immunity|חיסוניות נרכשת|חסינות נרכשת/i },
  { id: "bacteria", re: /bacterial structure|מבנה וגדילת חיידקים/i },
  { id: "blood-glucose", re: /blood glucose|ויסות רמת הסוכר בדם|בקרת גלוקוז/i },
  { id: "hemoglobin", re: /hemoglobin|המוגלובין/i },
  { id: "photosynthesis", re: /photosynthesis|פוטוסינתזה/i },
  { id: "secretory-pathway", re: /secretory pathway|מסלול ההפרשה/i },
  { id: "non-mendelian", re: /non-?mendelian inheritance|תורשה לא[ -]?מנדלית/i },
  { id: "mendelian-genetics", re: /^\s*(mendelian genetics|גנטיקה מנדלית)\s*$/i },
  { id: "cellular-respiration", re: /cellular respiration|נשימה תאית/i },
  { id: "membrane-transport", re: /membrane transport|transport across (the )?membrane|מעבר חומרים דרך הממברנה/i },
];

export function findSceneId(nameEn: string, nameHe: string): SceneId | null {
  return MATCHERS.find((m) => m.re.test(nameEn) || m.re.test(nameHe))?.id ?? null;
}
