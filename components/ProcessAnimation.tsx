"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/dictionaries";
import AIExplainPanel from "./AIExplainPanel";
import AnimationControls from "./AnimationControls";
import ProcessVideoMode from "./ProcessVideoMode";

type Step = {
  id: string;
  order: number;
  titleHe: string;
  titleEn: string;
  descHe: string;
  descEn: string;
  svgData: string;
};

type SvgElement = {
  id: string;
  type: "circle" | "rect" | "path" | "text" | "line" | "ellipse";
  x?: number; y?: number;
  cx?: number; cy?: number;
  r?: number; rx?: number; ry?: number;
  width?: number; height?: number;
  x1?: number; y1?: number; x2?: number; y2?: number;
  d?: string;
  label?: string;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
  textColor?: string;
  fontSize?: number;
  opacity?: number;
};

function parseSvgData(raw: string): { elements: SvgElement[]; highlight?: string[] } {
  try {
    const parsed = JSON.parse(raw);
    return { elements: Array.isArray(parsed?.elements) ? parsed.elements : [], highlight: parsed?.highlight };
  } catch {
    return { elements: [] };
  }
}

// Collect unique element IDs in the order they first appear across all steps
function getAllElementIds(steps: Step[]): string[] {
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const step of steps) {
    for (const el of parseSvgData(step.svgData).elements) {
      if (!seen.has(el.id)) { seen.add(el.id); ids.push(el.id); }
    }
  }
  return ids;
}

// Get element state for a specific step (or last-known-before fade to opacity 0)
function getElementAtStep(id: string, stepIndex: number, steps: Step[]): SvgElement | null {
  const { elements } = parseSvgData(steps[stepIndex].svgData);
  const found = elements.find((e) => e.id === id);
  if (found) return found;
  for (let i = stepIndex - 1; i >= 0; i--) {
    const prev = parseSvgData(steps[i].svgData).elements.find((e) => e.id === id);
    if (prev) return { ...prev, opacity: 0 };
  }
  return null;
}

// Renders a single SVG element that smoothly animates between step positions
function AnimatedSvgElement({
  id, stepIndex, steps, isHighlighted,
}: {
  id: string; stepIndex: number; steps: Step[]; isHighlighted: boolean;
}) {
  const el = getElementAtStep(id, stepIndex, steps);
  if (!el) return null;

  const baseOpacity = el.opacity ?? 1;
  const effectiveOpacity = isHighlighted ? baseOpacity : baseOpacity * 0.3;
  const fill = el.color ?? (isHighlighted ? "#059669" : "#94a3b8");
  const strokeColor = isHighlighted ? (el.color ?? "#059669") : "#94a3b8";
  const t = { duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  switch (el.type) {
    case "circle":
      return (
        <motion.circle
          key={id}
          initial={{ cx: el.cx, cy: el.cy, r: el.r, opacity: 0 }}
          animate={{ cx: el.cx, cy: el.cy, r: el.r, fill, stroke: el.stroke ?? "none", strokeWidth: el.strokeWidth ?? (el.stroke ? 2 : 0), opacity: effectiveOpacity }}
          transition={t}
        />
      );
    case "ellipse":
      return (
        <motion.ellipse
          key={id}
          initial={{ cx: el.cx, cy: el.cy, rx: el.rx, ry: el.ry, opacity: 0 }}
          animate={{ cx: el.cx, cy: el.cy, rx: el.rx, ry: el.ry, fill, stroke: el.stroke ?? "none", strokeWidth: el.strokeWidth ?? (el.stroke ? 2 : 0), opacity: effectiveOpacity }}
          transition={t}
        />
      );
    case "rect":
      return (
        <motion.rect
          key={id}
          initial={{ x: el.x, y: el.y, width: el.width, height: el.height, opacity: 0 }}
          animate={{ x: el.x, y: el.y, width: el.width, height: el.height, fill, stroke: el.stroke ?? "none", strokeWidth: el.strokeWidth ?? (el.stroke ? 2 : 0), opacity: effectiveOpacity }}
          transition={t}
        />
      );
    case "line":
      return (
        <motion.line
          key={id}
          strokeWidth={2.5}
          initial={{ x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2, opacity: 0 }}
          animate={{ x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2, stroke: strokeColor, opacity: effectiveOpacity }}
          transition={t}
        />
      );
    case "path":
      return (
        <motion.path
          key={id}
          d={el.d ?? ""}
          fill="none"
          strokeWidth={2.5}
          initial={{ opacity: 0 }}
          animate={{ stroke: strokeColor, opacity: effectiveOpacity }}
          transition={t}
        />
      );
    case "text":
      return (
        <motion.text
          key={id}
          fontSize={el.fontSize ?? 11}
          textAnchor="middle"
          initial={{ x: el.x, y: el.y, opacity: 0 }}
          animate={{ x: el.x, y: el.y, fill: el.textColor ?? (isHighlighted ? "#065f46" : "#9ca3af"), opacity: effectiveOpacity }}
          transition={t}
        >
          {el.label}
        </motion.text>
      );
    default:
      return null;
  }
}

export default function ProcessAnimation({
  steps, lang, dict, processName,
}: {
  steps: Step[];
  lang: Locale;
  dict: { process: { step: string; of: string; explain: string; explaining: string; previous: string; next: string; playAnimation: string; pauseAnimation: string } };
  processName: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoMode, setVideoMode] = useState(false);

  const step = steps[currentStep] ?? null;
  const title = step ? (lang === "he" ? step.titleHe : step.titleEn) : "";
  const desc = step ? (lang === "he" ? step.descHe : step.descEn) : "";
  const { highlight } = step ? parseSvgData(step.svgData) : { highlight: undefined };

  // Stable list of all element IDs across all steps — never remount SVG elements
  const allElementIds = useMemo(() => getAllElementIds(steps), [steps]);

  const goNext = useCallback(() => setCurrentStep((i) => Math.min(i + 1, steps.length - 1)), [steps.length]);
  const goPrev = useCallback(() => setCurrentStep((i) => Math.max(i - 1, 0)), []);

  if (steps.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-10 text-center text-zinc-400 dark:text-zinc-500">
        <div className="text-4xl mb-3">🔬</div>
        <p className="text-sm">{lang === "he" ? "אין שלבי אנימציה עבור תהליך זה" : "No animation steps for this process"}</p>
      </div>
    );
  }

  if (videoMode) {
    return <ProcessVideoMode steps={steps} lang={lang} processName={processName} onExit={() => setVideoMode(false)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Video mode button */}
      <button
        onClick={() => setVideoMode(true)}
        className="flex items-center gap-2 self-end px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
      >
        <span>📽️</span>
        {lang === "he" ? "צפה כסרטון" : "Watch as Video"}
      </button>

      {/* Unified SVG canvas — elements stay mounted and animate their positions */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
        <div className="p-4">
          {allElementIds.length > 0 ? (
            <svg viewBox="0 0 400 300" className="w-full h-64 md:h-80" xmlns="http://www.w3.org/2000/svg">
              {allElementIds.map((id) => {
                const isHighlighted = !highlight || highlight.includes(id);
                return (
                  <AnimatedSvgElement
                    key={id}
                    id={id}
                    stepIndex={currentStep}
                    steps={steps}
                    isHighlighted={isHighlighted}
                  />
                );
              })}
            </svg>
          ) : (
            <div className="w-full h-64 md:h-80 flex items-center justify-center">
              <div className="text-6xl opacity-30">🔬</div>
            </div>
          )}
        </div>
      </div>

      {/* Step info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wide">
                {dict.process.step} {currentStep + 1} {dict.process.of} {steps.length}
              </p>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <AnimationControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrev={goPrev}
        onNext={goNext}
        dict={dict.process}
      />

      {/* AI Explain */}
      <AIExplainPanel
        lang={lang}
        processName={processName}
        stepTitle={title}
        stepDesc={desc}
        dict={dict.process}
      />
    </div>
  );
}
