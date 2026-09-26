"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/dictionaries";
import { MIN_SVG_LABEL_SIZE } from "@/lib/svg-labels-he";
import {
  parseSvgData, allElementIds, elementAtStep, labelText, fontSizeOf, leaderStart, textAnchorFor,
  type SceneData,
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

/* ── Draw a single frame of the animation onto a canvas ─────────────────── */
// The scene is authored in a 400x300 viewBox; it is scaled uniformly and
// centred (no stretching) so shapes keep their proportions in the 16:9 video.
function drawFrame(
  ctx: CanvasRenderingContext2D,
  scenes: SceneData[],
  stepIndex: number,
  width: number,
  height: number,
  lang: string
) {
  const v2 = scenes.every((sc) => (sc.v ?? 1) >= 2);
  // v2 scenes keep clear of the title band at the bottom (OVERLAY_H)
  const availH = v2 ? height - OVERLAY_H : height;
  const k = Math.min(width / 400, availH / 300);
  const ox = (width - 400 * k) / 2, oy = (availH - 300 * k) / 2;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);

  // Background (v2 scenes are drawn for a light page, like the step view)
  ctx.fillStyle = v2 ? "#ffffff" : "#18181b";
  ctx.fillRect(0, 0, width, height);
  ctx.setTransform(k, 0, 0, k, ox, oy);

  // Dot grid
  ctx.fillStyle = v2 ? "rgba(148,163,184,0.35)" : "rgba(148,163,184,0.18)";
  for (let gx = 0; gx < 400; gx += 20) {
    for (let gy = 0; gy < 300; gy += 20) {
      ctx.beginPath();
      ctx.arc(gx, gy, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const { highlight } = scenes[stepIndex];

  for (const id of allElementIds(scenes)) {
    const el = elementAtStep(id, stepIndex, scenes);
    if (!el) continue;

    const isHighlighted = !highlight || highlight.length === 0 || highlight.includes(id);
    const baseOpacity = el.opacity ?? 1;
    const effectiveOpacity = isHighlighted || (v2 && el.type === "text") ? baseOpacity : baseOpacity * (v2 ? 0.4 : 0.25);
    if (effectiveOpacity <= 0) continue;

    ctx.globalAlpha = effectiveOpacity;
    const noFill = el.color === "none";
    const fill = el.color ?? (isHighlighted ? "#059669" : "#94a3b8");
    const strokeColor = el.stroke ?? (v2 ? "#334155" : isHighlighted ? (el.color ?? "#047857") : "#64748b");
    ctx.setLineDash(el.dash ? el.dash.split(/[\s,]+/).map(Number) : []);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Glow for highlighted elements (legacy look only)
    ctx.shadowBlur = !v2 && isHighlighted && el.type !== "text" ? 8 : 0;
    ctx.shadowColor = fill;

    const paint = (path: Path2D | null, defaultStrokeW: number) => {
      if (!noFill && (el.type !== "path" || el.color)) {
        ctx.globalAlpha = effectiveOpacity * (el.fillOpacity ?? 1);
        ctx.fillStyle = fill;
        if (path) ctx.fill(path); else ctx.fill();
        ctx.globalAlpha = effectiveOpacity;
      }
      const sw = el.strokeWidth ?? (el.stroke ? defaultStrokeW : 0);
      if (sw > 0 && (el.stroke || el.type === "path")) {
        ctx.strokeStyle = el.type === "path" && !el.stroke && !v2 ? (isHighlighted ? "#059669" : "#64748b") : strokeColor;
        ctx.lineWidth = sw;
        if (path) ctx.stroke(path); else ctx.stroke();
      }
    };

    switch (el.type) {
      case "circle":
        ctx.beginPath();
        ctx.arc(el.cx ?? 0, el.cy ?? 0, el.r ?? 10, 0, Math.PI * 2);
        paint(null, 2);
        break;
      case "ellipse":
        ctx.beginPath();
        ctx.ellipse(el.cx ?? 0, el.cy ?? 0, el.rx ?? 20, el.ry ?? 15, 0, 0, Math.PI * 2);
        paint(null, 2);
        break;
      case "rect":
        ctx.beginPath();
        ctx.roundRect(el.x ?? 0, el.y ?? 0, el.width ?? 40, el.height ?? 30, el.rx ?? 6);
        paint(null, 2);
        break;
      case "path": {
        if (!el.d) break;
        const path2d = new Path2D(el.d);
        const filled = !!el.color && !noFill;
        paint(path2d, filled ? 1.5 : 2);
        if (v2 && el.arrow) arrowAtPathEnd(ctx, el.d, el.stroke ?? "#334155");
        break;
      }
      case "line": {
        ctx.shadowBlur = 0;
        const x1 = el.x1 ?? 0, y1 = el.y1 ?? 0, x2 = el.x2 ?? 0, y2 = el.y2 ?? 0;
        const col = v2 ? (el.stroke ?? el.color ?? "#334155") : strokeColor;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = col;
        ctx.lineWidth = el.strokeWidth ?? 2.5;
        ctx.stroke();
        if (!v2 || el.arrow) arrowHead(ctx, x1, y1, x2, y2, col, v2 ? 12 : 5.5);
        break;
      }
      case "text": {
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
        const size = v2 ? fontSizeOf(el, true, MIN_SVG_LABEL_SIZE) : Math.max(MIN_SVG_LABEL_SIZE, el.fontSize ?? 11) * 1.1;
        const text = labelText(el, lang);
        const rtl = lang === "he" && !el.ltr;
        if (v2 && el.to) {
          const [sx, sy] = leaderStart(el, text, size);
          ctx.strokeStyle = "#0f172a";
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(el.to[0], el.to[1]);
          ctx.stroke();
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(el.to[0], el.to[1], 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.font = `${el.weight ?? 600} ${size}px system-ui, sans-serif`;
        ctx.direction = rtl ? "rtl" : "ltr";
        const anchor = v2 ? textAnchorFor(el, rtl) : "middle";
        ctx.textAlign = anchor === "middle" ? "center" : anchor;
        ctx.textBaseline = "alphabetic";
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = v2 ? 4 : 3;
        const x = el.x ?? 0, y = (el.y ?? 0) + (v2 ? 0 : size * 0.35);
        if (el.halo !== false) ctx.strokeText(text, x, y);
        ctx.fillStyle = el.textColor ?? (v2 ? "#1e293b" : isHighlighted ? "#f1f5f9" : "#64748b");
        ctx.fillText(text, x, y);
        break;
      }
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function arrowHead(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, size: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2 + Math.cos(angle) * size * 0.3, y2 + Math.sin(angle) * size * 0.3);
  ctx.lineTo(x2 - size * Math.cos(angle - 0.45), y2 - size * Math.sin(angle - 0.45));
  ctx.lineTo(x2 - size * Math.cos(angle + 0.45), y2 - size * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Arrowhead oriented along the last segment of an SVG path (uses its final two points).
function arrowAtPathEnd(ctx: CanvasRenderingContext2D, d: string, color: string) {
  const nums = d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi)?.map(Number) ?? [];
  if (nums.length < 4) return;
  const [x1, y1, x2, y2] = nums.slice(-4);
  arrowHead(ctx, x1, y1, x2, y2, color, 12);
}

/* ── Step title overlay ──────────────────────────────────────────────────── */
function drawOverlay(
  ctx: CanvasRenderingContext2D,
  title: string,
  stepNum: number,
  totalSteps: number,
  width: number,
  height: number,
  rtl: boolean
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
  const x = rtl ? width - 12 : 12;
  ctx.direction = "ltr";
  ctx.textAlign = rtl ? "right" : "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(`${stepNum + 1} / ${totalSteps}`, x, height - 36);

  // Title
  ctx.font = `600 ${Math.round(width * 0.035)}px system-ui, sans-serif`;
  ctx.fillStyle = "#f8fafc";
  ctx.direction = rtl ? "rtl" : "ltr";
  ctx.textAlign = rtl ? "right" : "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(title, x, height - 10);
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
const OVERLAY_H = 62;
const CANVAS_W = 720;
const CANVAS_H = 405;

export default function ProcessInlineVideo({
  steps, lang, processName, onExit,
}: {
  steps: Step[]; lang: Locale; processName: string; onExit: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const stepStartRef = useRef<number>(0); // set on mount by the currentStep effect

  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const scenes = useMemo(() => steps.map((st) => parseSvgData(st.svgData)), [steps]);
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
        drawFrame(ctx!, scenes, localStep, CANVAS_W, CANVAS_H, lang);
        const t = steps[localStep];
        const ttl = t ? (lang === "he" ? t.titleHe : t.titleEn) : "";
        drawOverlay(ctx!, ttl, localStep, steps.length, CANVAS_W, CANVAS_H, lang === "he");
        drawProgressBar(ctx!, progress, CANVAS_W, CANVAS_H);
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const elapsed = now - stepStartRef.current;
      const p = Math.min(elapsed / STEP_DURATION, 1);

      setProgress(p);

      drawFrame(ctx!, scenes, localStep, CANVAS_W, CANVAS_H, lang);
      const t = steps[localStep];
      const ttl = t ? (lang === "he" ? t.titleHe : t.titleEn) : "";
      drawOverlay(ctx!, ttl, localStep, steps.length, CANVAS_W, CANVAS_H, lang === "he");
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
  }, [steps, scenes, playing, lang]);

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
