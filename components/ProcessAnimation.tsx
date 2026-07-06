"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/dictionaries";
import AIExplainPanel from "./AIExplainPanel";
import AnimationControls from "./AnimationControls";
import ProcessInlineVideo from "./ProcessInlineVideo";
import FeedbackButton from "./FeedbackButton";

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

/* ─── Chromosome path builder (anatomically accurate shape) ────────────── */
function r(n: number) { return Math.round(n * 10) / 10; }

function makeChromosomePath(cx: number, cy: number, rx: number, ry: number): string {
  const L = r(cx - rx), R = r(cx + rx);
  const constrict = r(rx * 0.55);
  const LC = r(cx - constrict), RC = r(cx + constrict);
  const top = r(cy - ry), bot = r(cy + ry);
  const taper = r(ry * 0.17);
  const cap = r(rx * 0.75);
  return [
    `M ${L} ${top}`,
    `C ${L} ${r(top - cap)} ${R} ${r(top - cap)} ${R} ${top}`,
    `L ${R} ${r(cy - taper)}`,
    `C ${R} ${r(cy - taper * 0.4)} ${RC} ${r(cy - taper * 0.15)} ${RC} ${cy}`,
    `C ${RC} ${r(cy + taper * 0.15)} ${R} ${r(cy + taper * 0.4)} ${R} ${r(cy + taper)}`,
    `L ${R} ${bot}`,
    `C ${R} ${r(bot + cap)} ${L} ${r(bot + cap)} ${L} ${bot}`,
    `L ${L} ${r(cy + taper)}`,
    `C ${L} ${r(cy + taper * 0.4)} ${LC} ${r(cy + taper * 0.15)} ${LC} ${cy}`,
    `C ${LC} ${r(cy - taper * 0.15)} ${L} ${r(cy - taper * 0.4)} ${L} ${r(cy - taper)}`,
    "Z",
  ].join(" ");
}

// IDs that should never be reshaped as chromosomes — organelles, molecules, labels
const NON_CHROM_IDS = /^(cell|nuc|nucleus|membrane|cytoplasm|organelle|lbl|text|label|spindle|protein|enzyme|rna|dna|atp|mito|golgi|rib|vesicle|trna|polypep|mrna|vacuole|chloro|lyso|er_|perox)/i;

function isLegacyChromosome(el: SvgElement): boolean {
  return (
    el.type === "ellipse" &&
    !el.id.endsWith("_c") &&
    !el.id.endsWith("_b") &&
    !NON_CHROM_IDS.test(el.id) &&
    (el.ry ?? 0) > (el.rx ?? 0) * 1.5 &&   // moderately elongated — catches all chromosome shapes
    el.cx !== undefined && el.cy !== undefined
  );
}

/* ─── Professional SVG element renderer ─────────────────────────────────── */
function AnimatedSvgElement({
  id, stepIndex, steps, isHighlighted,
}: {
  id: string; stepIndex: number; steps: Step[]; isHighlighted: boolean;
}) {
  const el = getElementAtStep(id, stepIndex, steps);
  if (!el) return null;

  const baseOpacity = el.opacity ?? 1;
  const effectiveOpacity = isHighlighted ? baseOpacity : baseOpacity * 0.55;

  // Use element's own color; fall back to palette based on highlight state
  const fill = el.color ?? (isHighlighted ? "#059669" : "#94a3b8");
  const strokeColor = el.stroke ?? (isHighlighted ? (el.color ?? "#047857") : "#64748b");
  const strokeW = el.strokeWidth ?? (el.stroke ? 2 : 0);

  // Enhanced filter: glow on highlighted, subtle shadow otherwise
  const filterRef = isHighlighted ? "url(#glow)" : "url(#shadow)";

  const t = { duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  switch (el.type) {
    case "circle":
      return (
        <motion.circle
          key={id}
          filter={filterRef}
          initial={{ cx: el.cx, cy: el.cy, r: el.r, opacity: 0 }}
          animate={{
            cx: el.cx, cy: el.cy, r: el.r,
            fill: el.color ? `${fill}` : fill,
            stroke: strokeColor, strokeWidth: strokeW,
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    case "ellipse": {
      if (isLegacyChromosome(el)) {
        const cx = el.cx!, cy = el.cy!;
        const rx = el.rx ?? 6, ry = el.ry ?? 20;
        // Two sister chromatids side by side (like ChromosomeDiagram)
        // Cap width at 15% of ry so chromatids stay elongated even for wide ellipses
        const cw     = Math.min(rx * 0.45, ry * 0.15);
        const offset = cw;  // chromatids just touch at center (matches ChromosomeDiagram)
        const dL = makeChromosomePath(cx - offset, cy, cw, ry);
        const dR = makeChromosomePath(cx + offset, cy, cw, ry);
        // Telomere caps at the 4 arm tips
        const tRx = cw + 1.5;
        const tRy = Math.max(4, Math.min(9, ry * 0.12));
        const tips: [number, number][] = [
          [cx - offset, cy - ry], [cx - offset, cy + ry],
          [cx + offset, cy - ry], [cx + offset, cy + ry],
        ];
        return (
          <g filter={filterRef}>
            <motion.path key={`${id}-L`}
              initial={{ d: dL, opacity: 0 }}
              animate={{ d: dL, fill, opacity: effectiveOpacity }}
              transition={t} />
            <motion.path key={`${id}-R`}
              initial={{ d: dR, opacity: 0 }}
              animate={{ d: dR, fill, opacity: effectiveOpacity * 0.8 }}
              transition={t} />
            {tips.map(([tcx, tcy], i) => (
              <motion.ellipse key={`${id}-tl${i}`}
                initial={{ cx: tcx, cy: tcy, rx: tRx, ry: tRy, opacity: 0 }}
                animate={{ cx: tcx, cy: tcy, rx: tRx, ry: tRy, fill: "#0f766e", opacity: effectiveOpacity }}
                transition={t} />
            ))}
          </g>
        );
      }
      return (
        <motion.ellipse
          key={id}
          filter={filterRef}
          initial={{ cx: el.cx, cy: el.cy, rx: el.rx, ry: el.ry, opacity: 0 }}
          animate={{
            cx: el.cx, cy: el.cy, rx: el.rx, ry: el.ry,
            fill, stroke: strokeColor, strokeWidth: strokeW,
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    }
    case "rect":
      return (
        <motion.rect
          key={id}
          rx={el.rx ?? 6}
          filter={filterRef}
          initial={{ x: el.x, y: el.y, width: el.width, height: el.height, opacity: 0 }}
          animate={{
            x: el.x, y: el.y, width: el.width, height: el.height,
            fill, stroke: strokeColor, strokeWidth: strokeW,
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    case "line":
      return (
        <motion.line
          key={id}
          markerEnd="url(#arrowhead)"
          strokeLinecap="round"
          initial={{ x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2, opacity: 0 }}
          animate={{
            x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2,
            stroke: isHighlighted ? (el.stroke ?? "#059669") : "#64748b",
            strokeWidth: el.strokeWidth ?? 2.5,
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    case "path": {
      // Filled path (Golgi, vesicle buds, etc.) vs stroke-only (DNA, mRNA, cristae)
      const isFilled = !!el.color;
      return (
        <motion.path
          key={id}
          d={el.d ?? ""}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={isFilled ? filterRef : undefined}
          initial={{ opacity: 0 }}
          animate={{
            fill: isFilled ? fill : "none",
            stroke: isHighlighted ? (el.stroke ?? (isFilled ? fill : "#059669")) : "#64748b",
            strokeWidth: el.strokeWidth ?? (isFilled ? 1.5 : 2),
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    }
    case "text":
      return (
        <motion.text
          key={id}
          fontSize={el.fontSize ?? 11}
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
          textAnchor="middle"
          paintOrder="stroke"
          strokeLinejoin="round"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth={3.5}
          initial={{ x: el.x, y: el.y, opacity: 0 }}
          animate={{
            x: el.x, y: el.y,
            fill: el.textColor ?? (isHighlighted ? "#1e293b" : "#64748b"),
            opacity: effectiveOpacity,
          }}
          transition={t}
        >
          {el.label}
        </motion.text>
      );
    default:
      return null;
  }
}

/* ─── SVG defs: gradients, shadows, arrowheads, grid ───────────────────── */
function SvgDefs() {
  return (
    <defs>
      {/* Drop shadow for non-highlighted elements */}
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00000033" />
      </filter>

      {/* Glow filter for highlighted elements */}
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Arrowhead marker */}
      <marker
        id="arrowhead"
        markerWidth="8" markerHeight="6"
        refX="7" refY="3"
        orient="auto"
      >
        <polygon points="0 0, 8 3, 0 6" fill="#059669" opacity="0.85" />
      </marker>

      {/* Subtle dot-grid background pattern */}
      <pattern id="dotgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="#cbd5e1" opacity="0.5" />
      </pattern>

      {/* Cell membrane gradient */}
      <radialGradient id="cellGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#fef9ee" />
        <stop offset="100%" stopColor="#fde68a" stopOpacity="0.3" />
      </radialGradient>

      {/* Nucleus gradient */}
      <radialGradient id="nucleusGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.25" />
      </radialGradient>

      {/* Emerald gradient for proteins */}
      <radialGradient id="proteinGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
      </radialGradient>

      {/* Blue gradient for DNA/RNA */}
      <radialGradient id="dnaGrad" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#bfdbfe" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
      </radialGradient>
    </defs>
  );
}

/* ─── Step progress indicator dots ─────────────────────────────────────── */
function StepDots({ total, current, onGo }: { total: number; current: number; onGo: (i: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 justify-center py-1">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-5 h-2.5 bg-emerald-500"
              : i < current
              ? "w-2.5 h-2.5 bg-emerald-300 dark:bg-emerald-700"
              : "w-2.5 h-2.5 bg-zinc-300 dark:bg-zinc-600"
          }`}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ProcessAnimation({
  steps, lang, dict, processName, topicSlug, processSlug,
}: {
  steps: Step[];
  lang: Locale;
  dict: { process: { step: string; of: string; explain: string; explaining: string; previous: string; next: string; playAnimation: string; pauseAnimation: string } };
  processName: string;
  topicSlug?: string;
  processSlug?: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoMode, setVideoMode] = useState(false);

  const step = steps[currentStep] ?? null;
  const title = step ? (lang === "he" ? step.titleHe : step.titleEn) : "";
  const desc = step ? (lang === "he" ? step.descHe : step.descEn) : "";
  const { highlight } = step ? parseSvgData(step.svgData) : { highlight: undefined };

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
    return <ProcessInlineVideo steps={steps} lang={lang} processName={processName} onExit={() => setVideoMode(false)} />;
  }

  const hasElements = allElementIds.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <StepDots total={steps.length} current={currentStep} onGo={setCurrentStep} />
        <button
          onClick={() => setVideoMode(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-700 dark:from-zinc-700 dark:to-zinc-600 text-white text-sm font-medium hover:from-zinc-700 hover:to-zinc-600 dark:hover:from-zinc-600 dark:hover:to-zinc-500 shadow transition-all"
        >
          <span>▶</span>
          {lang === "he" ? "הפעל סרטון" : "Play Video"}
        </button>
      </div>

      {/* Professional SVG canvas */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
        {/* Canvas header strip */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/80">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-70" />
          <span className="ms-3 text-xs font-mono text-zinc-400 select-none">{processName}</span>
          <span className="ms-auto" />
        </div>

        <div className="p-4">
          {hasElements ? (
            <svg
              viewBox="0 0 400 300"
              className="w-full h-64 md:h-80"
              xmlns="http://www.w3.org/2000/svg"
            >
              <SvgDefs />
              {/* Dot-grid background */}
              <rect width="400" height="300" fill="url(#dotgrid)" />
              {/* Animated elements */}
              {allElementIds.map((id) => {
                const isHighlighted = !highlight || highlight.length === 0 || highlight.includes(id);
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
              {/* Auto-centromere overlays for chromosome-shaped ellipses */}
              {allElementIds
                .filter((id) => !id.endsWith("_c") && !id.endsWith("_b") && !NON_CHROM_IDS.test(id))
                .map((id) => {
                  const el = getElementAtStep(id, currentStep, steps);
                  if (!el || !isLegacyChromosome(el)) return null;
                  const baseOpacity = el.opacity ?? 1;
                  const isHighlighted = !highlight || highlight.length === 0 || highlight.includes(id);
                  const effectiveOpacity = isHighlighted ? baseOpacity : baseOpacity * 0.55;
                  // Centromere width matches the rendered chromatids (same cw formula as above)
                  const _cw = Math.min((el.rx ?? 5) * 0.45, (el.ry ?? 20) * 0.15);
                  const centRx = Math.round(_cw * 1.6);  // spans both chromatids at constriction
                  const centRy = Math.max(3, Math.round((el.ry ?? 20) * 0.15));
                  const t = { duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };
                  return (
                    <motion.ellipse
                      key={`${id}-ac`}
                      initial={{ cx: el.cx, cy: el.cy, rx: centRx, ry: centRy, opacity: 0 }}
                      animate={{ cx: el.cx, cy: el.cy, rx: centRx, ry: centRy, fill: "#9f1239", opacity: effectiveOpacity }}
                      transition={t}
                    />
                  );
                })}
            </svg>
          ) : (
            <div className="w-full h-64 md:h-80 flex items-center justify-center">
              <div className="text-6xl opacity-20">🔬</div>
            </div>
          )}
        </div>
      </div>

      {/* Step info card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 shadow-sm"
        >
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  {currentStep + 1}
                </span>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  {dict.process.step} {currentStep + 1} {dict.process.of} {steps.length}
                </p>
              </div>
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
