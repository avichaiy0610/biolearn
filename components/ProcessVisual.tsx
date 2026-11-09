"use client";

import { type ComponentProps } from "react";
import type ProcessAnimation from "./ProcessAnimation";
import ProcessScene from "./scenes/ProcessScene";
import type { SceneId } from "./scenes/registry";

type Props = ComponentProps<typeof ProcessAnimation> & { sceneId: SceneId };

/* A process with a hand-crafted continuous scene shows only that scene.
   The old step-by-step slideshow is no longer offered there (Avichai, 9.11:
   an animation is continuous motion, not pictures that switch). The scene has
   its own chapters and scrub bar for going stage by stage. */
export default function ProcessVisual({ sceneId, ...anim }: Props) {
  return <ProcessScene sceneId={sceneId} lang={anim.lang} processName={anim.processName} />;
}
