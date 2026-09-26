"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/dictionaries";
import AIExplainPanel from "./AIExplainPanel";
import AnimationControls from "./AnimationControls";
import ProcessInlineVideo from "./ProcessInlineVideo";
import FeedbackButton from "./FeedbackButton";
import { MIN_SVG_LABEL_SIZE } from "@/lib/svg-labels-he";
import Swatch from "./LegendSwatch";
import { isolatePrimes } from "@/lib/text";
import {
  parseSvgData, allElementIds as collectIds, elementAtStep, labelText, fontSizeOf, leaderStart, textAnchorFor,
  type SceneData, type SvgElement,
} from "@/lib/svg-scene";

type Step = {
  id: string;
  order: number;
  titleHe: string;
  titleEn: string;
  descHe: string;
  descEn: string;
  svgData: string;
};

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
  id, stepIndex, scenes, isHighlighted, lang, v2, instant,
}: {
  id: string; stepIndex: number; scenes: SceneData[]; isHighlighted: boolean; lang: string; v2: boolean; instant: boolean;
}) {
  const el = elementAtStep(id, stepIndex, scenes);
  if (!el) return null;

  const baseOpacity = el.opacity ?? 1;
  // v2 labels stay fully legible; shapes outside the step's focus are dimmed
  const effectiveOpacity = isHighlighted || (v2 && el.type === "text") ? baseOpacity : baseOpacity * (v2 ? 0.4 : 0.55);

  // Use element's own color; fall back to palette based on highlight state
  const fill = el.color ?? (isHighlighted ? "#059669" : "#94a3b8");
  const strokeColor = el.stroke ?? (isHighlighted ? (el.color ?? "#047857") : "#64748b");
  const strokeW = el.strokeWidth ?? (el.stroke ? 2 : 0);

  // Enhanced filter: glow on highlighted, subtle shadow otherwise
  const filterRef = v2 ? "url(#shadow)" : isHighlighted ? "url(#glow)" : "url(#shadow)";

  // reduced motion: jump to the step's pose instead of tweening
  const t = instant ? { duration: 0 } : { duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  // ── Composite shape: 26S proteasome (classic banded barrel + 19S cap) ──────
  // The model only emits a placeholder rect id="proteasome"; we draw the real
  // structure here (same idea as makeChromosomePath for chromosomes).
  if (!v2 && /^proteasome/i.test(el.id)) {
    const x = el.x ?? 270, y = el.y ?? 70, w = el.width ?? 74, h = el.height ?? 150;
    const capH = h * 0.28;
    const by = y + capH;          // barrel top
    const bh = h - capH;          // barrel height
    const barrel = el.color ?? "#5eead4";
    const cap = "#c4b5fd";
    const capPath = `M ${r(x + w * 0.08)} ${r(by)} L ${r(x + w * 0.3)} ${r(y)} L ${r(x + w * 0.7)} ${r(y)} L ${r(x + w * 0.92)} ${r(by)} Z`;
    const rings = [0.25, 0.5, 0.75].map((f) => r(by + bh * f));
    return (
      <motion.g key={id} filter={filterRef} initial={{ opacity: 0 }} animate={{ opacity: effectiveOpacity }} transition={t}>
        {/* 19S regulatory cap (lid) */}
        <path d={capPath} fill={cap} stroke="#7c3aed" strokeWidth={2} strokeLinejoin="round" />
        {/* 20S core barrel */}
        <rect x={r(x)} y={r(by)} width={r(w)} height={r(bh)} rx={7} fill={barrel} stroke="#0f766e" strokeWidth={2} />
        {/* four stacked rings (α7 β7 β7 α7) */}
        {rings.map((ry, i) => (
          <line key={i} x1={r(x + 2)} y1={ry} x2={r(x + w - 2)} y2={ry} stroke="#0f766e" strokeWidth={1.5} opacity={0.65} />
        ))}
        {/* substrate entry gate at the top of the core */}
        <rect x={r(x + w * 0.4)} y={r(by - 3)} width={r(w * 0.2)} height={6} rx={2} fill="#0f766e" />
      </motion.g>
    );
  }

  switch (el.type) {
    case "circle":
      return (
        <motion.circle
          key={id}
          filter={filterRef}
          strokeDasharray={el.dash}
          initial={{ cx: el.cx, cy: el.cy, r: el.r, opacity: 0 }}
          animate={{
            cx: el.cx, cy: el.cy, r: el.r,
            fill: el.color === "none" ? "rgba(0,0,0,0)" : fill,
            fillOpacity: el.fillOpacity ?? 1,
            stroke: strokeColor, strokeWidth: strokeW,
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    case "ellipse": {
      if (!v2 && isLegacyChromosome(el)) {
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
          strokeDasharray={el.dash}
          initial={{ cx: el.cx, cy: el.cy, rx: el.rx, ry: el.ry, opacity: 0 }}
          animate={{
            cx: el.cx, cy: el.cy, rx: el.rx, ry: el.ry,
            fill: el.color === "none" ? "rgba(0,0,0,0)" : fill, fillOpacity: el.fillOpacity ?? 1,
            stroke: strokeColor, strokeWidth: strokeW,
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
          strokeDasharray={el.dash}
          initial={{ x: el.x, y: el.y, width: el.width, height: el.height, opacity: 0 }}
          animate={{
            x: el.x, y: el.y, width: el.width, height: el.height,
            fill: el.color === "none" ? "rgba(0,0,0,0)" : fill, fillOpacity: el.fillOpacity ?? 1,
            stroke: strokeColor, strokeWidth: strokeW,
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    case "line":
      return (
        <motion.line
          key={id}
          markerEnd={v2 ? (el.arrow ? "url(#arrowV2)" : undefined) : "url(#arrowhead)"}
          strokeLinecap="round"
          strokeDasharray={el.dash}
          initial={{ x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2, opacity: 0 }}
          animate={{
            x1: el.x1, y1: el.y1, x2: el.x2, y2: el.y2,
            stroke: v2 ? (el.stroke ?? el.color ?? "#334155") : isHighlighted ? (el.stroke ?? "#059669") : "#64748b",
            strokeWidth: el.strokeWidth ?? 2.5,
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    case "path": {
      // Filled path (Golgi, vesicle buds, etc.) vs stroke-only (DNA, mRNA, cristae)
      const isFilled = !!el.color && el.color !== "none";
      const pathStroke = v2
        ? (el.stroke ?? (isFilled ? "rgba(0,0,0,0)" : "#334155"))
        : isHighlighted ? (el.stroke ?? (isFilled ? fill : "#059669")) : "#64748b";
      return (
        <motion.path
          key={id}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={el.dash}
          markerEnd={v2 && el.arrow ? "url(#arrowV2)" : undefined}
          filter={isFilled ? filterRef : undefined}
          initial={{ d: el.d ?? "", opacity: 0 }}
          animate={{
            d: el.d ?? "",
            fill: isFilled ? fill : "rgba(0,0,0,0)",
            fillOpacity: el.fillOpacity ?? 1,
            stroke: pathStroke,
            strokeWidth: el.strokeWidth ?? (isFilled ? 1.5 : 2),
            opacity: effectiveOpacity,
          }}
          transition={t}
        />
      );
    }
    case "text": {
      const size = v2 ? fontSizeOf(el, true, MIN_SVG_LABEL_SIZE) : Math.max(MIN_SVG_LABEL_SIZE, el.fontSize ?? 11);
      const rtl = lang === "he" && !el.ltr;
      const full = labelText(el, lang);
      const short = v2 && (lang === "he" ? el.shortHe : el.short) ? labelText(el, lang, true) : null;
      const color = el.textColor ?? (isHighlighted || v2 ? "#1e293b" : "#64748b");
      const common = {
        fontSize: size,
        direction: rtl ? "rtl" : "ltr",
        fontFamily: "system-ui, sans-serif",
        fontWeight: el.weight ?? 600,
        textAnchor: v2 ? textAnchorFor(el, rtl) : "middle",
        paintOrder: "stroke",
        strokeLinejoin: "round",
        stroke: el.halo === false ? "none" : "rgba(255,255,255,0.95)",
        strokeWidth: v2 ? 4 : 3.5,
        initial: { x: el.x, y: el.y, opacity: 0 },
        animate: { x: el.x, y: el.y, fill: color, opacity: effectiveOpacity },
        transition: t,
      } as const;
      const leaderFor = (txt: string) => {
        if (!v2 || !el.to) return null;
        const [sx, sy] = leaderStart(el, txt, size);
        return { x1: sx, y1: sy, x2: el.to[0], y2: el.to[1] };
      };
      const leaders = [
        { l: leaderFor(full), cls: short ? "max-sm:hidden" : undefined },
        ...(short ? [{ l: leaderFor(short), cls: "sm:hidden" }] : []),
      ];
      return (
        <g key={id}>
          {leaders.map(({ l, cls }, i) => l && (
            <g key={i} className={cls}>
              <motion.line initial={{ ...l, opacity: 0 }} animate={{ ...l, opacity: effectiveOpacity * 0.85 }} transition={t}
                stroke="#0f172a" strokeWidth={1.3} strokeLinecap="round" />
              <motion.circle initial={{ cx: l.x2, cy: l.y2, opacity: 0 }} animate={{ cx: l.x2, cy: l.y2, opacity: effectiveOpacity }} transition={t}
                r={2.6} fill="#0f172a" stroke="#fff" strokeWidth={1} />
            </g>
          ))}
          <motion.text {...common} className={short ? "max-sm:hidden" : undefined}>{full}</motion.text>
          {short && <motion.text {...common} className="sm:hidden">{short}</motion.text>}
        </g>
      );
    }
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

      {/* Arrowhead for v2 scenes: takes the line's own colour */}
      <marker id="arrowV2" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto" markerUnits="userSpaceOnUse">
        <path d="M0,0.5 L12,6 L0,11.5 z" fill="context-stroke" />
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

const AUTOPLAY_MS = 4500;

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function ProcessAnimation({
  steps, lang, dict, processName, topicSlug, processSlug, initialStep = 0,
}: {
  steps: Step[];
  lang: Locale;
  dict: { process: { step: string; of: string; explain: string; explaining: string; previous: string; next: string; playAnimation: string; pauseAnimation: string } };
  processName: string;
  topicSlug?: string;
  processSlug?: string;
  initialStep?: number;
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [videoMode, setVideoMode] = useState(false);

  const step = steps[currentStep] ?? null;
  const title = step ? (lang === "he" ? step.titleHe : step.titleEn) : "";
  const desc = step ? (lang === "he" ? step.descHe : step.descEn) : "";
  const scenes = useMemo(() => steps.map((s) => parseSvgData(s.svgData)), [steps]);
  const highlight = scenes[currentStep]?.highlight;
  const v2 = scenes.length > 0 && scenes.every((s) => (s.v ?? 1) >= 2);
  const legend = scenes[currentStep]?.legend ?? scenes[0]?.legend;
  const note = scenes[currentStep]?.note ?? scenes[0]?.note;

  const allElementIds = useMemo(() => collectIds(scenes), [scenes]);

  const goNext = useCallback(() => setCurrentStep((i) => Math.min(i + 1, steps.length - 1)), [steps.length]);
  const goPrev = useCallback(() => setCurrentStep((i) => Math.max(i - 1, 0)), []);

  // Autoplay: advance one step every AUTOPLAY_MS until the last step; manual
  // navigation keeps working and the button pauses. Reduced motion → no tweening.
  const reduceMotion = useReducedMotion();
  const [playRequested, setPlayRequested] = useState(false);
  const playing = playRequested && currentStep < steps.length - 1; // stops by itself on the last step
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setCurrentStep((i) => Math.min(i + 1, steps.length - 1)), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [playing, currentStep, steps.length]);
  const togglePlay = useCallback(() => {
    if (playing) { setPlayRequested(false); return; }
    if (currentStep >= steps.length - 1) setCurrentStep(0); // replay from the start
    setPlayRequested(true);
  }, [playing, currentStep, steps.length]);

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
        <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          aria-pressed={playing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/60 text-emerald-700 dark:text-emerald-300 text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
        >
          <span aria-hidden>{playing ? "⏸" : "▶"}</span>
          {playing ? dict.process.pauseAnimation : dict.process.playAnimation}
        </button>
        <button
          onClick={() => setVideoMode(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-700 dark:from-zinc-700 dark:to-zinc-600 text-white text-sm font-medium hover:from-zinc-700 hover:to-zinc-600 dark:hover:from-zinc-600 dark:hover:to-zinc-500 shadow transition-all"
        >
          <span>▶</span>
          {lang === "he" ? "הפעל סרטון" : "Play Video"}
        </button>
        </div>
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

        <div className={v2 ? "p-1 sm:p-4" : "p-4"}>
          {hasElements ? (
            <svg
              viewBox="0 0 400 300"
              className={v2 ? "w-full h-auto aspect-[4/3] md:h-80 md:aspect-auto" : "w-full h-64 md:h-80"}
              role="img"
              aria-label={title}
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
                    scenes={scenes}
                    isHighlighted={isHighlighted}
                    lang={lang}
                    v2={v2}
                    instant={!!reduceMotion}
                  />
                );
              })}
              {/* Auto-centromere overlays for chromosome-shaped ellipses */}
              {!v2 && allElementIds
                .filter((id) => !id.endsWith("_c") && !id.endsWith("_b") && !NON_CHROM_IDS.test(id))
                .map((id) => {
                  const el = elementAtStep(id, currentStep, scenes);
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
          {(legend || note) && (
            <div className="px-3 pb-2 pt-1 sm:px-0 sm:pb-0">
              {legend && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-700 dark:text-zinc-300" aria-label={lang === "he" ? "מקרא" : "Legend"}>
                  {legend.map((l) => (
                    <li key={l.he} className="inline-flex items-center gap-1.5">
                      <Swatch item={l} />
                      {lang === "he" ? isolatePrimes(l.he) : l.en}
                    </li>
                  ))}
                </ul>
              )}
              {note && <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">{lang === "he" ? note.he : note.en}</p>}
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
