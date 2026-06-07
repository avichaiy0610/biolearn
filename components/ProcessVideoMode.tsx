"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/dictionaries";

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
  cx?: number; cy?: number; r?: number;
  rx?: number; ry?: number;
  x?: number; y?: number; width?: number; height?: number;
  x1?: number; y1?: number; x2?: number; y2?: number;
  d?: string;
  label?: string;
  color?: string;
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

// Get all unique element IDs across all steps (for unified canvas)
function getAllElementIds(steps: Step[]): string[] {
  const ids = new Set<string>();
  for (const step of steps) {
    const { elements } = parseSvgData(step.svgData);
    for (const el of elements) ids.add(el.id);
  }
  return [...ids];
}

// Get element state for a specific step (or last known state, or invisible)
function getElementForStep(
  id: string,
  stepIndex: number,
  steps: Step[]
): SvgElement | null {
  // Find this element in current step
  const { elements } = parseSvgData(steps[stepIndex].svgData);
  const found = elements.find((e) => e.id === id);
  if (found) return found;

  // Not in this step — find the last step it appeared in
  for (let i = stepIndex - 1; i >= 0; i--) {
    const { elements: prev } = parseSvgData(steps[i].svgData);
    const prevEl = prev.find((e) => e.id === id);
    if (prevEl) return { ...prevEl, opacity: 0 };
  }
  return null;
}

function AnimatedElement({
  id, stepIndex, steps, isHighlighted,
}: {
  id: string; stepIndex: number; steps: Step[]; isHighlighted: boolean;
}) {
  const el = getElementForStep(id, stepIndex, steps);
  if (!el) return null;

  const baseOpacity = el.opacity ?? 1;
  const effectiveOpacity = isHighlighted ? baseOpacity : baseOpacity * 0.35;
  const fill = el.color ?? (isHighlighted ? "#059669" : "#94a3b8");
  const strokeColor = isHighlighted ? (el.color ?? "#059669") : "#94a3b8";

  const transition = { duration: 1.2, ease: [0.4, 0, 0.2, 1] } as const;

  switch (el.type) {
    case "circle":
      return (
        <motion.circle
          key={id}
          cx={el.cx} cy={el.cy} r={el.r}
          fill={fill}
          animate={{ opacity: effectiveOpacity, cx: el.cx, cy: el.cy, r: el.r, fill }}
          transition={transition}
        />
      );
    case "ellipse":
      return (
        <motion.ellipse
          key={id}
          cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry}
          fill={fill}
          animate={{ opacity: effectiveOpacity, cx: el.cx, cy: el.cy, rx: el.rx, ry: el.ry, fill }}
          transition={transition}
        />
      );
    case "rect":
      return (
        <motion.rect
          key={id}
          x={el.x} y={el.y} width={el.width} height={el.height} rx={4}
          fill={fill}
          animate={{ opacity: effectiveOpacity, x: el.x, y: el.y, width: el.width, height: el.height, fill }}
          transition={transition}
        />
      );
    case "line":
      return (
        <motion.line
          key={id}
          x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2}
          stroke={strokeColor} strokeWidth={2}
          animate={{ opacity: effectiveOpacity, x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2, stroke: strokeColor }}
          transition={transition}
        />
      );
    case "path":
      return (
        <motion.path
          key={id}
          d={el.d ?? ""} fill="none"
          stroke={strokeColor} strokeWidth={2}
          animate={{ opacity: effectiveOpacity, stroke: strokeColor }}
          transition={transition}
        />
      );
    case "text":
      return (
        <motion.text
          key={id}
          x={el.x} y={el.y}
          fill={el.textColor ?? (isHighlighted ? "#065f46" : "#9ca3af")}
          fontSize={el.fontSize ?? 11} textAnchor="middle"
          animate={{ opacity: effectiveOpacity, x: el.x, y: el.y }}
          transition={transition}
        >
          {el.label}
        </motion.text>
      );
    default:
      return null;
  }
}

const STEP_DURATION = 7000;

export default function ProcessVideoMode({
  steps, lang, processName, onExit,
}: {
  steps: Step[]; lang: Locale; processName: string; onExit: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());

  const step = steps[currentStep] ?? null;
  const title = step ? (lang === "he" ? step.titleHe : step.titleEn) : "";
  const desc = step ? (lang === "he" ? step.descHe : step.descEn) : "";

  const { highlight } = step ? parseSvgData(step.svgData) : { highlight: undefined };
  const allElementIds = getAllElementIds(steps);

  const startTypewriter = useCallback((text: string) => {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayedText("");
    if (!text) return;
    let i = 0;
    const speed = Math.max(12, Math.floor(4000 / text.length));
    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length && typewriterRef.current) clearInterval(typewriterRef.current);
    }, speed);
  }, []);

  useEffect(() => {
    if (!desc) return;
    startTypewriter(desc);
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [currentStep, desc, startTypewriter]);

  useEffect(() => {
    if (!playing || steps.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    startTimeRef.current = Date.now() - progress * STEP_DURATION;
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / STEP_DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        setCurrentStep((c) => {
          if (c < steps.length - 1) return c + 1;
          setPlaying(false);
          return c;
        });
      }
    }, 50);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, steps.length, progress]);

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔬</div>
          <p className="text-zinc-400 mb-6">{lang === "he" ? "אין שלבי אנימציה" : "No animation steps"}</p>
          <button onClick={onExit} className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white">
            {lang === "he" ? "חזור" : "Go back"}
          </button>
        </div>
      </div>
    );
  }

  function goToStep(i: number) {
    setCurrentStep(i);
    setProgress(0);
    startTimeRef.current = Date.now();
  }

  const isFinished = currentStep === steps.length - 1 && !playing && progress >= 1;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold text-sm">{processName}</span>
          <span className="text-zinc-500 text-sm">
            {lang === "he" ? "שלב" : "Step"} {currentStep + 1}/{steps.length}
          </span>
        </div>
        <button onClick={onExit}
          className="text-zinc-400 hover:text-white text-sm px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors">
          {lang === "he" ? "✕ יציאה" : "✕ Exit"}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SVG Canvas — unified, elements animate in place */}
        <div className="md:flex-1 flex items-center justify-center p-4 bg-zinc-900">
          <div className="w-full max-w-lg">
            <svg viewBox="0 0 400 300" className="w-full rounded-xl bg-zinc-800 p-2"
              xmlns="http://www.w3.org/2000/svg">
              {allElementIds.map((id) => {
                const isHighlighted = !highlight || highlight.includes(id);
                return (
                  <AnimatedElement
                    key={id}
                    id={id}
                    stepIndex={currentStep}
                    steps={steps}
                    isHighlighted={isHighlighted}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Description panel */}
        <div className="md:w-80 flex flex-col p-5 border-t md:border-t-0 md:border-s border-zinc-800">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex-1">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                {lang === "he" ? "שלב" : "Step"} {currentStep + 1}
              </p>
              <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed min-h-[80px]">
                {displayedText}
                <span className="inline-block w-0.5 h-4 bg-emerald-400 ms-0.5 animate-pulse align-middle" />
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step dots */}
          <div className="flex gap-1.5 justify-center my-3 flex-wrap">
            {steps.map((_, i) => (
              <button key={i} onClick={() => goToStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentStep
                  ? "bg-emerald-400 scale-125"
                  : i < currentStep ? "bg-emerald-700" : "bg-zinc-600"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 py-3 border-t border-zinc-800">
        <div className="h-1 w-full rounded-full bg-zinc-700 mb-3 overflow-hidden">
          <motion.div className="h-full bg-emerald-500 rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.05, ease: "linear" }} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button onClick={() => goToStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded-lg text-sm border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 transition-colors">
            {lang === "he" ? "◀ הקודם" : "◀ Prev"}
          </button>

          <button onClick={() => {
            if (isFinished) { goToStep(0); setPlaying(true); }
            else setPlaying((p) => !p);
          }}
            className="px-6 py-2 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
            {isFinished
              ? (lang === "he" ? "↺ חזור להתחלה" : "↺ Restart")
              : playing ? (lang === "he" ? "⏸ השהה" : "⏸ Pause")
              : (lang === "he" ? "▶ המשך" : "▶ Play")}
          </button>

          <button onClick={() => goToStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 rounded-lg text-sm border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 disabled:opacity-40 transition-colors">
            {lang === "he" ? "הבא ▶" : "Next ▶"}
          </button>
        </div>
      </div>
    </div>
  );
}
