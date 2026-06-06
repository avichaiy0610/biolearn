"use client";

import { useState, useCallback } from "react";
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
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  r?: number;
  rx?: number;
  ry?: number;
  width?: number;
  height?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  d?: string;
  label?: string;
  color?: string;
  textColor?: string;
  fontSize?: number;
  active?: boolean;
  opacity?: number;
};

type SvgData = {
  elements: SvgElement[];
  highlight?: string[];
};

function parseSvgData(raw: string): SvgData {
  try {
    const parsed = JSON.parse(raw);
    return { elements: Array.isArray(parsed?.elements) ? parsed.elements : [], highlight: parsed?.highlight };
  } catch {
    return { elements: [] };
  }
}

function renderElement(el: SvgElement, isHighlighted: boolean) {
  const fill = isHighlighted
    ? el.color ?? "#059669"
    : (el.color ?? "#94a3b8") + "80";
  const opacity = el.opacity ?? 1;

  switch (el.type) {
    case "circle":
      return (
        <motion.circle
          key={el.id}
          cx={el.cx ?? 0}
          cy={el.cy ?? 0}
          r={el.r ?? 10}
          fill={fill}
          opacity={opacity}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: isHighlighted ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        />
      );
    case "ellipse":
      return (
        <motion.ellipse
          key={el.id}
          cx={el.cx ?? 0}
          cy={el.cy ?? 0}
          rx={el.rx ?? 20}
          ry={el.ry ?? 10}
          fill={fill}
          opacity={opacity}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: isHighlighted ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        />
      );
    case "rect":
      return (
        <motion.rect
          key={el.id}
          x={el.x ?? 0}
          y={el.y ?? 0}
          width={el.width ?? 40}
          height={el.height ?? 20}
          rx={4}
          fill={fill}
          opacity={opacity}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: isHighlighted ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        />
      );
    case "line":
      return (
        <motion.line
          key={el.id}
          x1={el.x1 ?? 0}
          y1={el.y1 ?? 0}
          x2={el.x2 ?? 50}
          y2={el.y2 ?? 0}
          stroke={isHighlighted ? el.color ?? "#059669" : "#94a3b8"}
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: isHighlighted ? 1 : 0.4 }}
          transition={{ duration: 0.6 }}
        />
      );
    case "path":
      return (
        <motion.path
          key={el.id}
          d={el.d ?? ""}
          fill="none"
          stroke={isHighlighted ? el.color ?? "#059669" : "#94a3b8"}
          strokeWidth={2}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: isHighlighted ? 1 : 0.4 }}
          transition={{ duration: 0.7 }}
        />
      );
    case "text":
      return (
        <motion.text
          key={el.id}
          x={el.x ?? 0}
          y={el.y ?? 0}
          fill={el.textColor ?? (isHighlighted ? "#065f46" : "#6b7280")}
          fontSize={el.fontSize ?? 12}
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHighlighted ? 1 : 0.5 }}
          transition={{ duration: 0.3 }}
        >
          {el.label}
        </motion.text>
      );
    default:
      return null;
  }
}

export default function ProcessAnimation({
  steps,
  lang,
  dict,
  processName,
}: {
  steps: Step[];
  lang: Locale;
  dict: { process: { step: string; of: string; explain: string; explaining: string; previous: string; next: string; playAnimation: string; pauseAnimation: string } };
  processName: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoMode, setVideoMode] = useState(false);

  // All hooks before any conditional returns
  const step = steps[currentStep] ?? null;
  const title = step ? (lang === "he" ? step.titleHe : step.titleEn) : "";
  const desc = step ? (lang === "he" ? step.descHe : step.descEn) : "";
  const svgData = step ? parseSvgData(step.svgData) : { elements: [] as SvgElement[], highlight: undefined };

  const goNext = useCallback(() => {
    setCurrentStep((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const goPrev = useCallback(() => {
    setCurrentStep((i) => Math.max(i - 1, 0));
  }, []);

  if (steps.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-10 text-center text-zinc-400 dark:text-zinc-500">
        <div className="text-4xl mb-3">🔬</div>
        <p className="text-sm">{lang === "he" ? "אין שלבי אנימציה עבור תהליך זה" : "No animation steps for this process"}</p>
      </div>
    );
  }

  if (videoMode) {
    return (
      <ProcessVideoMode
        steps={steps}
        lang={lang}
        processName={processName}
        onExit={() => setVideoMode(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Video mode launch button */}
      <button
        onClick={() => setVideoMode(true)}
        className="flex items-center gap-2 self-end px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
      >
        <span>📽️</span>
        {lang === "he" ? "צפה כסרטון" : "Watch as Video"}
      </button>

      {/* SVG Canvas */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            {svgData.elements.length > 0 ? (
              <svg
                viewBox="0 0 400 300"
                className="w-full h-64 md:h-80"
                xmlns="http://www.w3.org/2000/svg"
              >
                {svgData.elements.map((el) => {
                  const isHighlighted =
                    !svgData.highlight ||
                    svgData.highlight.includes(el.id);
                  return renderElement(el, isHighlighted);
                })}
              </svg>
            ) : (
              <div className="w-full h-64 md:h-80 flex items-center justify-center">
                <div className="text-6xl opacity-30">🔬</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
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
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {desc}
              </p>
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
