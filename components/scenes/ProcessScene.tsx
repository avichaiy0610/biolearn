"use client";

import { useEffect, useRef, type ComponentType } from "react";
import { watchSvgBidi } from "./svgBidiFix";
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
import MitoScene from "./MitoScene";
import GngScene from "./GngScene";
import UreaScene from "./UreaScene";
import LncDevScene from "./LncDevScene";
import LncConsScene from "./LncConsScene";
import ActionPotentialScene from "./ActionPotentialScene";
import SynapseScene from "./SynapseScene";
import HeartScene from "./HeartScene";
import MuscleScene from "./MuscleScene";
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
  "mito-inheritance": MitoScene,
  gluconeogenesis: GngScene,
  "urea-cycle": UreaScene,
  "lncrna-development": LncDevScene,
  "lncrna-conservation": LncConsScene,
  "action-potential": ActionPotentialScene,
  "synaptic-transmission": SynapseScene,
  cardiovascular: HeartScene,
  "muscle-contraction": MuscleScene,
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
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? watchSvgBidi(ref.current) : undefined), [sceneId, lang]);
  return Scene ? (
    <div ref={ref} style={{ display: "contents" }}>
      <Scene lang={lang} processName={processName} />
    </div>
  ) : null;
}
