// Hand-authored step animations for every SVG-step process (mitosis and DNA
// replication use the Lottie player instead). Written into ProcessStep rows by
// scripts/animations-fidelity-2026-09.ts; checked against Campbell Biology (12e)
// and Alberts, Molecular Biology of the Cell (7e).
import { NOTE, type El, type ProcessScene, type StepDef } from "./kit";
import { translation } from "./translation";
import { transcription } from "./transcription";
import { glycolysis } from "./glycolysis";
import { respiration } from "./respiration";
import { meiosis } from "./meiosis";
import { pcr } from "./pcr";
import { ups } from "./ups";
import { mendelian, nonMendelian } from "./genetics";
import { mitoInheritance } from "./mito-inheritance";
import { bacteria } from "./bacteria";
import { recognition, riboswitch } from "./rna-switches";
import { cardio } from "./cardio";

export const PROCESS_SCENES: ProcessScene[] = [translation, transcription, glycolysis, respiration, meiosis, pcr, ups, mendelian, nonMendelian,
  mitoInheritance, bacteria, recognition, riboswitch, cardio];

/** One element per id: a later definition replaces an earlier one but keeps its paint order. */
function mergeById(els: El[]): El[] {
  const at = new Map<string, number>();
  const out: El[] = [];
  for (const e of els) {
    const i = at.get(e.id);
    if (i === undefined) { at.set(e.id, out.length); out.push(e); } else out[i] = e;
  }
  return out;
}

export function stepSvgData(scene: ProcessScene, step: StepDef): string {
  return JSON.stringify({ v: 2, elements: mergeById(step.elements), highlight: step.highlight, legend: scene.legend, note: NOTE });
}
