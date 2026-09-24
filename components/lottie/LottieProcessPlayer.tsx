"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationItem, LottiePlayer } from "lottie-web";
import type { Locale } from "@/lib/dictionaries";
import AIExplainPanel from "../AIExplainPanel";
import FeedbackButton from "../FeedbackButton";
import YouTubeSupplement from "./YouTubeSupplement";
import type { LottieScene, SceneLabel } from "./scenes";

type Step = { id: string; order: number; titleHe: string; titleEn: string; descHe: string; descEn: string };

const SCALE = 1.6;          // canvas backing pixels per composition unit (800×480 → 1280×768)
const DWELL_MS = 2600;      // pause on each step during auto-play
const MIN_LABEL_CSS_PX = 13; // labels never render smaller than this on screen

export default function LottieProcessPlayer({
  scene, steps, lang, processName, topicSlug, processSlug, dict,
}: {
  scene: LottieScene;
  steps: Step[];
  lang: Locale;
  processName: string;
  topicSlug?: string;
  processSlug?: string;
  dict: { process: { step: string; of: string; explain: string; explaining: string; previous: string; next: string } };
}) {
  const he = lang === "he";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const stepRef = useRef(0);
  const autoRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordingRef = useRef(false);
  const labelFontRef = useRef(22);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);

  const total = scene.labels.length;
  const W = scene.width, H = scene.height, F = scene.frameCount;
  const cur = steps[step];
  const title = cur ? (he ? cur.titleHe : cur.titleEn) : "";
  const desc = cur ? (he ? cur.descHe : cur.descEn) : "";

  /* ── overlay (labels) drawn after every Lottie frame ───────────────── */
  const drawOverlay = useCallback((frame: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const s = stepRef.current;
    ctx.save();
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    const font = recordingRef.current ? 22 : labelFontRef.current;
    const family = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";

    // strand-end labels etc.
    ctx.font = `700 ${Math.round(font * 0.9)}px ${family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#334155";
    ctx.direction = "ltr"; // strand ends like 5' / 3'
    for (const l of scene.fixed ?? []) ctx.fillText(he ? l.he : l.en, l.x, l.y);

    // step labels appear halfway through the step's motion
    const local = frame - s * F;
    if (local >= F * 0.33) {
      const alpha = Math.min(1, (local - F * 0.33) / (F * 0.2));
      for (const l of scene.labels[s] ?? []) drawLabel(ctx, l, he, font, family, alpha, W, H);
    }

    // step chip (also ends up in the exported video)
    const chip = `${s + 1}/${total} · ${title}`;
    ctx.globalAlpha = 1;
    ctx.font = `600 ${Math.round(font * 0.8)}px ${family}`;
    ctx.direction = he ? "rtl" : "ltr";
    const w = ctx.measureText(chip).width + 20;
    const x = he ? W - 10 - w : 10;
    roundRect(ctx, x, 10, w, font * 1.3, 8);
    ctx.fillStyle = "rgba(5,150,105,0.92)";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(chip, x + w / 2, 10 + font * 0.66);
    ctx.restore();
  }, [F, H, W, he, scene, title, total]);

  const segmentDoneRef = useRef<() => void>(() => {});
  const stopRecordingRef = useRef<(() => void) | null>(null);
  const drawRef = useRef(drawOverlay);
  useEffect(() => { drawRef.current = drawOverlay; });

  /* ── load lottie + animation data ───────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [mod, data] = await Promise.all([
          import("lottie-web/build/player/lottie_canvas") as unknown as Promise<{ default: LottiePlayer }>,
          fetch(scene.file).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }),
        ]);
        const canvas = canvasRef.current;
        if (cancelled || !canvas) return;
        const ctx = canvas.getContext("2d")!;
        const anim = mod.default.loadAnimation({
          renderer: "canvas",
          loop: false,
          autoplay: false,
          animationData: data,
          rendererSettings: { context: ctx, clearCanvas: true, preserveAspectRatio: "xMidYMid meet", runExpressions: false },
        } as unknown as Parameters<LottiePlayer["loadAnimation"]>[0]);
        // With sub-frame rendering, lottie-web's canvas renderer keeps a stale
        // opacity on layers that fade out during a played segment (the nucleus
        // stayed visible after prometaphase). Whole frames at the comp's 30 fps avoid it.
        anim.setSubframe(false);
        anim.addEventListener("DOMLoaded", () => {
          anim.resize(W * SCALE, H * SCALE);
          setReady(true);
        });
        // currentFrame is relative to the active segment; overlay needs the absolute frame
        anim.addEventListener("drawnFrame", () => drawRef.current(anim.currentFrame + anim.firstFrame));
        anim.addEventListener("complete", () => segmentDoneRef.current());
        animRef.current = anim;
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      animRef.current?.destroy();
      animRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.file]);

  /* ── label size: at least MIN_LABEL_CSS_PX on screen ────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const cssW = canvas.getBoundingClientRect().width || W;
      labelFontRef.current = Math.max(22, Math.round((MIN_LABEL_CSS_PX * W) / cssW));
      const anim = animRef.current;
      if (anim && !anim.isPaused) return;
      if (anim) anim.goToAndStop(anim.currentFrame, true);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [W, ready]);

  /* ── step playback ──────────────────────────────────────────────────── */
  const reduceMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const playStep = useCallback((i: number) => {
    const anim = animRef.current;
    if (!anim) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    stepRef.current = i;
    setStep(i);
    if (reduceMotion && !recordingRef.current) {
      anim.resetSegments(true);
      anim.goToAndStop(i * F + F - 1, true);
      segmentDoneRef.current();
      return;
    }
    anim.playSegments([i * F, i * F + F - 1], true);
  }, [F, reduceMotion]);

  // Called when a step's segment finishes: during auto-play, advance after a pause.
  useEffect(() => {
    segmentDoneRef.current = () => {
      if (!autoRef.current) return;
      const next = stepRef.current + 1;
      if (next >= total) {
        autoRef.current = false;
        setAuto(false);
        if (recordingRef.current) stopRecordingRef.current?.();
        return;
      }
      timerRef.current = setTimeout(() => playStep(next), recordingRef.current ? 1500 : DWELL_MS);
    };
  });

  // Play the first step once loaded
  useEffect(() => { if (ready) playStep(0); }, [ready, playStep]);

  const go = (i: number) => { autoRef.current = false; setAuto(false); playStep(Math.max(0, Math.min(total - 1, i))); };
  const toggleAuto = () => {
    const on = !autoRef.current;
    autoRef.current = on;
    setAuto(on);
    if (on) playStep(stepRef.current >= total - 1 ? 0 : stepRef.current + 1);
    else if (timerRef.current) clearTimeout(timerRef.current);
  };

  /* ── .webm export: record the canvas while auto-playing all steps ──── */
  function startRecording() {
    const canvas = canvasRef.current;
    if (!canvas || recordingRef.current) return;
    setRecordError(null);
    if (typeof MediaRecorder === "undefined" || !canvas.captureStream) {
      setRecordError(he ? "הדפדפן לא תומך בהקלטת וידאו." : "This browser can't record video.");
      return;
    }
    const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(canvas.captureStream(30), mime ? { mimeType: mime } : undefined);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      const url = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${processName.replace(/\s+/g, "-")}.webm`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      recordingRef.current = false;
      setRecording(false);
    };
    stopRecordingRef.current = () => setTimeout(() => rec.state !== "inactive" && rec.stop(), 1200);
    recordingRef.current = true;
    setRecording(true);
    rec.start();
    autoRef.current = true;
    setAuto(true);
    playStep(0);
  }

  if (failed) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-8 text-center text-sm text-zinc-500">
        {he ? "לא הצלחנו לטעון את האנימציה. נסו לרענן את הדף." : "Couldn't load the animation. Please refresh the page."}
      </div>
    );
  }

  const btn = "px-3 py-2 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white overflow-hidden shadow-sm relative">
        <canvas
          ref={canvasRef}
          width={W * SCALE}
          height={H * SCALE}
          className="block w-full h-auto"
          style={{ aspectRatio: `${W} / ${H}` }}
          role="img"
          aria-label={`${processName} — ${title}`}
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
            {he ? "טוען אנימציה…" : "Loading animation…"}
          </div>
        )}
        {recording && (
          <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> {he ? "מקליט…" : "REC"}
          </div>
        )}
      </div>

      {scene.legend && (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400 -mt-1">
          {scene.legend.map((l) => (
            <li key={l.color} className="inline-flex items-center gap-1.5">
              <span className="inline-block w-4 h-1.5 rounded-full" style={{ background: l.color }} />
              {he ? l.he : l.en}
            </li>
          ))}
        </ul>
      )}

      {/* step text */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-5 shadow-sm" aria-live="polite">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            {step + 1}
          </span>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {dict.process.step} {step + 1} {dict.process.of} {total}
          </p>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{desc}</p>
      </div>

      {/* controls */}
      <div className="flex flex-col gap-3">
        <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <div className="flex justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`${dict.process.step} ${i + 1}`}
              aria-current={i === step ? "step" : undefined}
              className={`h-3 rounded-full transition-all ${i === step ? "w-6 bg-emerald-500" : i < step ? "w-3 bg-emerald-300 dark:bg-emerald-700" : "w-3 bg-zinc-300 dark:bg-zinc-600"}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button onClick={() => go(step - 1)} disabled={step === 0 || recording} className={btn}>{dict.process.previous}</button>
          <button
            onClick={toggleAuto}
            disabled={!ready || recording}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white disabled:opacity-50 transition-colors"
          >
            {auto ? (he ? "⏸ עצור" : "⏸ Pause") : (he ? "▶ הפעלה אוטומטית" : "▶ Auto-play")}
          </button>
          <button onClick={() => go(step + 1)} disabled={step === total - 1 || recording} className="px-4 py-2 rounded-lg font-medium text-sm bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {dict.process.next}
          </button>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={startRecording}
            disabled={!ready || recording}
            className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400 disabled:opacity-50 transition-colors"
          >
            📥 {recording ? (he ? "מקליט את כל השלבים…" : "Recording all steps…") : (he ? "הורד כסרטון (.webm)" : "Download as video (.webm)")}
          </button>
          {recordError && <span className="text-xs text-red-600">{recordError}</span>}
          {topicSlug && processSlug && (
            <FeedbackButton topicSlug={topicSlug} processSlug={processSlug} targetType="animation" lang={lang} />
          )}
        </div>
      </div>

      <AIExplainPanel lang={lang} processName={processName} stepTitle={title} stepDesc={desc} dict={dict.process} />

      <YouTubeSupplement video={scene.video} lang={lang} />
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawLabel(ctx: CanvasRenderingContext2D, l: SceneLabel, he: boolean, font: number, family: string, alpha: number, W: number, H: number) {
  const text = he ? l.he : l.en;
  ctx.globalAlpha = alpha;
  ctx.font = `600 ${font}px ${family}`;
  ctx.direction = he ? "rtl" : "ltr";
  const padX = font * 0.55, h = font * 1.5;
  const w = ctx.measureText(text).width + padX * 2;
  // keep the pill on the canvas
  const cx = Math.min(W - w / 2 - 4, Math.max(w / 2 + 4, l.x));
  const cy = Math.min(H - h / 2 - 4, Math.max(h / 2 + 4, l.y));

  if (l.to) {
    const [tx, ty] = l.to;
    const ey = ty > cy ? cy + h / 2 : cy - h / 2;
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(Math.min(cx + w / 2 - 6, Math.max(cx - w / 2 + 6, tx)), ey);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(tx, ty, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  roundRect(ctx, cx - w / 2, cy - h / 2, w, h, h / 2);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();
  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cx, cy + 1);
}
