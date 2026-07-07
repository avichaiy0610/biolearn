"use client";

import { useState, type ComponentProps } from "react";
import ProcessAnimation from "./ProcessAnimation";
import ProcessScene from "./scenes/ProcessScene";
import type { SceneId } from "./scenes/registry";

type Props = ComponentProps<typeof ProcessAnimation> & { sceneId: SceneId };

/* Lets the viewer switch between the continuous hand-crafted scene and the
   step-by-step animation (for anyone who wants to go stage by stage). */
export default function ProcessVisual({ sceneId, ...anim }: Props) {
  const [mode, setMode] = useState<"scene" | "steps">("scene");
  const he = anim.lang === "he";

  const tab = (active: boolean) =>
    `px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-emerald-600 text-white shadow"
        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
    }`;

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex self-start rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 p-1 gap-1">
        <button className={tab(mode === "scene")} onClick={() => setMode("scene")}>
          {he ? "אנימציה רציפה" : "Continuous"}
        </button>
        <button className={tab(mode === "steps")} onClick={() => setMode("steps")}>
          {he ? "שלב-אחר-שלב" : "Step-by-step"}
        </button>
      </div>

      {mode === "scene" ? (
        <ProcessScene sceneId={sceneId} lang={anim.lang} processName={anim.processName} />
      ) : (
        <ProcessAnimation {...anim} />
      )}
    </div>
  );
}
