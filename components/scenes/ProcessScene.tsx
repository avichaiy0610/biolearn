"use client";

import type { ComponentType } from "react";
import TranscriptionScene from "./TranscriptionScene";
import TransportScene from "./TransportScene";
import RespirationScene from "./RespirationScene";
import MendelianScene from "./MendelianScene";
import NonMendelianScene from "./NonMendelianScene";
import SecretoryScene from "./SecretoryScene";
import PhotosynthesisScene from "./PhotosynthesisScene";
import HemoglobinScene from "./HemoglobinScene";
import GlucoseScene from "./GlucoseScene";
import BacteriaScene from "./BacteriaScene";
import AdaptiveScene from "./AdaptiveScene";
import type { SceneId } from "./registry";

const SCENES: Record<SceneId, ComponentType<{ lang?: string; processName?: string }>> = {
  transcription: TranscriptionScene,
  "membrane-transport": TransportScene,
  "cellular-respiration": RespirationScene,
  "mendelian-genetics": MendelianScene,
  "non-mendelian": NonMendelianScene,
  "secretory-pathway": SecretoryScene,
  photosynthesis: PhotosynthesisScene,
  hemoglobin: HemoglobinScene,
  "blood-glucose": GlucoseScene,
  bacteria: BacteriaScene,
  "adaptive-immunity": AdaptiveScene,
};

export default function ProcessScene({
  sceneId,
  lang,
  processName,
}: {
  sceneId: SceneId;
  lang?: string;
  processName?: string;
}) {
  const Scene = SCENES[sceneId];
  return Scene ? <Scene lang={lang} processName={processName} /> : null;
}
