"use client";

import type { ComponentType } from "react";
import TranscriptionScene from "./TranscriptionScene";
import type { SceneId } from "./registry";

const SCENES: Record<SceneId, ComponentType<{ lang?: string; processName?: string }>> = {
  transcription: TranscriptionScene,
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
