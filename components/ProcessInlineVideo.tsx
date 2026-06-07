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
  const ids = new Set<string>();
  for (const step of steps) {
    for (const el of parseSvgData(step.svgData).elements) ids.add(el.id);
  }
  return [...ids];
}

function getElementForStep(id: string, stepIndex: number, steps: Step[]): SvgElement | null {
  const { elements } = parseSvgData(steps[stepIndex].svgData);
  const found = elements.find((e) => e.id === id);
  if (found) return found;
  for (let i = stepIndex - 1; i >= 0; i--) {
    const { elements: prev } = parseSvgData(steps[i].svgData);
    const prevEl = prev.find((e) => e.id === id);
    if (prevEl) return { ...prevEl, opacity: 0 };
  }
  return null;
}

/* ── Draw a single frame of the animation onto a canvas ─────────────────── */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  steps: Step[],
  stepIndex: number,
  width: number,
  height: number
) {
  const scaleX = width / 400;
  const scaleY = height / 300;
  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = "#18181b";
  ctx.fillRect(0, 0, width, height);

  // Dot grid
  ctx.fillStyle = "rgba(148,163,184,0.18)";
  for (let gx = 0; gx < 400; gx += 20) {
    for (let gy = 0; gy < 300; gy += 20) {
      ctx.beginPath();
      ctx.arc(gx * scaleX, gy * scaleY, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const allIds = getAllElementIds(steps);
  const { highlight } = parseSvgData(steps[stepIndex].svgData);

  for (const id of allIds) {
    const el = getElementForStep(id, stepIndex, steps);
    if (!el) continue;

    const isHighlighted = !highlight || highlight.includes(id);
    const baseOpacity = el.opacity ?? 1;
    const effectiveOpacity = isHighlighted ? baseOpacity : baseOpacity * 0.25;

    ctx.globalAlpha = effectiveOpacity;
    const fill = el.color ?? (isHighlighted ? "#059669" : "#94a3b8");
    const strokeColor = el.stroke ?? (isHighlighted ? (el.color ?? "#047857") : "#64748b");

    // Glow for highlighted elements
    if (isHighlighted && el.type !== "text") {
      ctx.shadowColor = fill;
      ctx.shadowBlur = 8;
    } else {
      ctx.shadowBlur = 0;
    }

    switch (el.type) {
      case "circle": {
        const cx = (el.cx ?? 0) * scaleX;
        const cy = (el.cy ?? 0) * scaleY;
        const r = (el.r ?? 10) * Math.min(scaleX, scaleY);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        if (el.stroke) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = (el.strokeWidth ?? 2) * Math.min(scaleX, scaleY);
          ctx.stroke();
        }
        break;
      }
      case "ellipse": {
        const cx = (el.cx ?? 0) * scaleX;
        const cy = (el.cy ?? 0) * scaleY;
        const rx = (el.rx ?? 20) * scaleX;
        const ry = (el.ry ?? 15) * scaleY;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        if (el.stroke) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = (el.strokeWidth ?? 2) * Math.min(scaleX, scaleY);
          ctx.stroke();
        }
        break;
      }
      case "rect": {
        const x = (el.x ?? 0) * scaleX;
        const y = (el.y ?? 0) * scaleY;
        const w = (el.width ?? 40) * scaleX;
        const h = (el.height ?? 30) * scaleY;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 6);
        ctx.fillStyle = fill;
        ctx.fill();
        if (el.stroke) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = (el.strokeWidth ?? 2) * Math.min(scaleX, scaleY);
          ctx.stroke();
        }
        break;
      }
      case "line": {
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo((el.x1 ?? 0) * scaleX, (el.y1 ?? 0) * scaleY);
        ctx.lineTo((el.x2 ?? 0) * scaleX, (el.y2 ?? 0) * scaleY);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = (el.strokeWidth ?? 2.5) * Math.min(scaleX, scaleY);
        ctx.lineCap = "round";
        ctx.stroke();
        // Arrowhead
        const angle = Math.atan2(
          ((el.y2 ?? 0) - (el.y1 ?? 0)) * scaleY,
          ((el.x2 ?? 0) - (el.x1 ?? 0)) * scaleX
        );
        const ax = (el.x2 ?? 0) * scaleX;
        const ay = (el.y2 ?? 0) * scaleY;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - 10 * Math.cos(angle - 0.4), ay - 10 * Math.sin(angle - 0.4));
        ctx.lineTo(ax - 10 * Math.cos(angle + 0.4), ay - 10 * Math.sin(angle + 0.4));
        ctx.closePath();
        ctx.fillStyle = strokeColor;
        ctx.fill();
        break;
      }
      case "text": {
        ctx.shadowBlur = 0;
        ctx.globalAlpha = el.opacity ?? 1;
        const fontSize = (el.fontSize ?? 11) * Math.min(scaleX, scaleY) * 1.1;
        ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // White outline for readability
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.strokeText(el.label ?? "", (el.x ?? 0) * scaleX, (el.y ?? 0) * scaleY);
        ctx.fillStyle = el.textColor ?? (isHighlighted ? "#f1f5f9" : "#64748b");
        ctx.fillText(el.label ?? "", (el.x ?? 0) * scaleX, (el.y ?? 0) * scaleY);
        break;
      }
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

/* ── Step title overlay ──────────────────────────────────────────────────── */
function drawOverlay(
  ctx: CanvasRenderingContext2D,
  title: string,
  stepNum: number,
  totalSteps: number,
  width: number,
  height: number
) {
  // Bottom gradient overlay
  const grad = ctx.createLinearGradient(0, height - 60, 0, height);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(1, "rgba(0,0,0,0.75)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, height - 60, width, 60);

  // Step indicator
  ctx.font = `bold ${Math.round(width * 0.028)}px system-ui, sans-serif`;
  ctx.fillStyle = "#34d399";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(`${stepNum + 1} / ${totalSteps}`, 12, height - 36);

  // Title
  ctx.font = `600 ${Math.round(width * 0.035)}px system-ui, sans-serif`;
  ctx.fillStyle = "#f8fafc";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(title, 12, height - 10);
}

/* ── Progress bar ────────────────────────────────────────────────────────── */
function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  progress: number,
  width: number,
  height: number
) {
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(0, height - 2, width, 2);
  ctx.fillStyle = "#10b981";
  ctx.fillRect(0, height - 2, width * progress, 2);
}

const STEP_DURATION = 6000;
const CANVAS_W = 720;
const CANVAS_H = 405;

export default function ProcessInlineVideo({
  steps, lang, processName, onExit,
}: {
  steps: Step[]; lang: Locale; processName: string; onExit: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const stepStartRef = useRef<number>(performance.now());

  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const step = steps[currentStep] ?? null;
  const title = step ? (lang === "he" ? step.titleHe : step.titleEn) : "";
  const desc = step ? (lang === "he" ? step.descHe : step.descEn) : "";

  const goToStep = useCallback((i: number) => {
    setCurrentStep(i);
    setProgress(0);
    stepStartRef.current = performance.now();
  }, []);

  // Main render loop
  useEffect(() => {
    if (steps.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localStep = currentStep;
    let localPlaying = playing;

    function render(now: number) {
      if (!localPlaying) {
        drawFrame(ctx!, steps, localStep, CANVAS_W, CANVAS_H);
        const t = steps[localStep];
        const ttl = t ? (lang === "he" ? t.titleHe : t.titleEn) : "";
        drawOverlay(ctx!, ttl, localStep, steps.length, CANVAS_W, CANVAS_H);
        drawProgressBar(ctx!, progress, CANVAS_W, CANVAS_H);
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsed = now - stepStartRef.current;
      const p = Math.min(elapsed / STEP_DURATION, 1);

      setProgress(p);

      drawFrame(ctx!, steps, localStep, CANVAS_W, CANVAS_H);
      const t = steps[localStep];
      const ttl = t ? (lang === "he" ? t.titleHe : t.titleEn) : "";
      drawOverlay(ctx!, ttl, localStep, steps.length, CANVAS_W, CANVAS_H);
      drawProgressBar(ctx!, p, CANVAS_W, CANVAS_H);

      if (p >= 1) {
        if (localStep < steps.length - 1) {
          localStep++;
          setCurrentStep(localStep);
          setProgress(0);
          stepStartRef.current = performance.now();
        } else {
          localPlaying = false;
          setPlaying(false);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    }

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, playing, lang]);

  // Sync local vars when step/playing changes from outside
  useEffect(() => {
    stepStartRef.current = performance.now();
  }, [currentStep]);

  /* ── Video recording ──────────────────────────────────────────────────── */
  function startRecording() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    chunksRef.current = [];
    const stream = canvas.captureStream(30);
    const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${processName.replace(/\s+/g, "-")}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setRecording(false);
      setRecordingDone(true);
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setRecording(true);
    setRecordingDone(false);
    // Restart animation from beginning
    goToStep(0);
    setPlaying(true);
    // Stop recording after all steps complete
    const totalDuration = steps.length * STEP_DURATION + 500;
    setTimeout(() => mr.stop(), totalDuration);
  }

  const isFinished = currentStep === steps.length - 1 && !playing && progress >= 1;

  if (steps.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-10 text-center text-zinc-400">
        <p>{lang === "he" ? "אין שלבי אנימציה" : "No animation steps"}</p>
        <button onClick={onExit} className="mt-4 px-4 py-2 rounded-xl border border-zinc-300 text-sm">
          {lang === "he" ? "חזור" : "Back"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Back button */}
      <button
        onClick={onExit}
        className="self-start flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
      >
        ← {lang === "he" ? "חזור לתרשים" : "Back to diagram"}
      </button>

      {/* Canvas — the actual video */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-xl border border-zinc-700">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full block"
          style={{ aspectRatio: "16/9" }}
        />

        {/* Recording badge */}
        {recording && (
          <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {lang === "he" ? "מקליט..." : "REC"}
          </div>
        )}
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">
              {currentStep + 1}
            </span>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{title}</h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed ms-7">{desc}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controls bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Prev */}
        <button
          onClick={() => goToStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-3 py-1.5 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 disabled:opacity-40 transition-colors"
        >
          {lang === "he" ? "◀ הקודם" : "◀ Prev"}
        </button>

        {/* Play / Pause / Restart */}
        <button
          onClick={() => {
            if (isFinished) { goToStep(0); setPlaying(true); }
            else setPlaying((p) => !p);
          }}
          className="px-5 py-2 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow"
        >
          {isFinished
            ? (lang === "he" ? "↺ שוב" : "↺ Replay")
            : playing
            ? (lang === "he" ? "⏸ השהה" : "⏸ Pause")
            : (lang === "he" ? "▶ נגן" : "▶ Play")}
        </button>

        {/* Next */}
        <button
          onClick={() => goToStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-3 py-1.5 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 disabled:opacity-40 transition-colors"
        >
          {lang === "he" ? "הבא ▶" : "Next ▶"}
        </button>

        {/* Step dots */}
        <div className="flex gap-1 ms-auto flex-wrap">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`rounded-full transition-all ${
                i === currentStep ? "w-5 h-2 bg-emerald-500"
                : i < currentStep ? "w-2 h-2 bg-emerald-300 dark:bg-emerald-700"
                : "w-2 h-2 bg-zinc-300 dark:bg-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Download video button */}
      <div className="flex items-center gap-3">
        <button
          onClick={startRecording}
          disabled={recording}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50 transition-colors"
        >
          {recording ? (
            <><span className="animate-spin">⏳</span> {lang === "he" ? "מקליט..." : "Recording..."}</>
          ) : (
            <><span>📥</span> {lang === "he" ? "הורד כסרטון (.webm)" : "Download as video (.webm)"}</>
          )}
        </button>
        {recordingDone && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400">
            ✓ {lang === "he" ? "הסרטון הורד!" : "Video downloaded!"}
          </span>
        )}
      </div>
    </div>
  );
}
