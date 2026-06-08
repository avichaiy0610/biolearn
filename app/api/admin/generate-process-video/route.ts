import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/supabase/server";
import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import sharp from "sharp";

export const maxDuration = 120;

const FFMPEG =
  "C:/Users/avich/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe";

const W = 1280;
const H = 720;
const STEP_SECS = 6;   // seconds each step is visible
const XFADE_SECS = 1;  // crossfade overlap between steps

type SvgEl = {
  id: string;
  type: "circle" | "ellipse" | "rect" | "line" | "path" | "text";
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

function parseSvg(raw: string): { elements: SvgEl[]; highlight?: string[] } {
  try {
    const p = JSON.parse(raw);
    return { elements: Array.isArray(p?.elements) ? p.elements : [], highlight: p?.highlight };
  } catch {
    return { elements: [] };
  }
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* Build a full 1280×720 SVG frame for one step */
function buildSvg(
  elements: SvgEl[],
  highlight: string[] | undefined,
  titleHe: string,
  titleEn: string,
  stepNum: number,
  totalSteps: number,
  processName: string
): string {
  const sx = W / 400;  // 3.2
  const sy = H / 300;  // 2.4

  const elSvg = elements.map((el) => {
    const isH = !highlight || highlight.includes(el.id);
    const op = (el.opacity ?? 1) * (isH ? 1 : 0.2);
    const fill = el.color ?? (isH ? "#059669" : "#94a3b8");
    const stroke = el.stroke ?? (el.strokeWidth ? (isH ? fill : "#64748b") : "none");
    const sw = el.strokeWidth ?? (el.stroke ? 2 : 0);
    const filter = isH ? `filter="url(#glow)"` : `filter="url(#shadow)"`;

    switch (el.type) {
      case "circle":
        return `<circle ${filter} cx="${(el.cx ?? 0) * sx}" cy="${(el.cy ?? 0) * sy}" r="${(el.r ?? 10) * Math.min(sx, sy)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw * Math.min(sx, sy)}" opacity="${op}"/>`;
      case "ellipse":
        return `<ellipse ${filter} cx="${(el.cx ?? 0) * sx}" cy="${(el.cy ?? 0) * sy}" rx="${(el.rx ?? 20) * sx}" ry="${(el.ry ?? 15) * sy}" fill="${fill}" stroke="${stroke}" stroke-width="${sw * Math.min(sx, sy)}" opacity="${op}"/>`;
      case "rect":
        return `<rect ${filter} x="${(el.x ?? 0) * sx}" y="${(el.y ?? 0) * sy}" width="${(el.width ?? 40) * sx}" height="${(el.height ?? 30) * sy}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${sw * Math.min(sx, sy)}" opacity="${op}"/>`;
      case "line": {
        const x1 = (el.x1 ?? 0) * sx, y1 = (el.y1 ?? 0) * sy;
        const x2 = (el.x2 ?? 0) * sx, y2 = (el.y2 ?? 0) * sy;
        const ang = Math.atan2(y2 - y1, x2 - x1);
        const aLen = 14;
        const ax1 = x2 - aLen * Math.cos(ang - 0.4);
        const ay1 = y2 - aLen * Math.sin(ang - 0.4);
        const ax2 = x2 - aLen * Math.cos(ang + 0.4);
        const ay2 = y2 - aLen * Math.sin(ang + 0.4);
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${isH ? (el.stroke ?? "#059669") : "#64748b"}" stroke-width="${(el.strokeWidth ?? 2.5) * Math.min(sx, sy)}" stroke-linecap="round" opacity="${op}"/>
<polygon points="${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}" fill="${isH ? "#059669" : "#64748b"}" opacity="${op}"/>`;
      }
      case "path":
        return `<path d="${escapeXml(el.d ?? "")}" fill="none" stroke="${isH ? (el.stroke ?? "#059669") : "#64748b"}" stroke-width="${(el.strokeWidth ?? 2.5) * Math.min(sx, sy)}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}"/>`;
      case "text": {
        const fs2 = (el.fontSize ?? 11) * Math.min(sx, sy) * 1.1;
        const lbl = escapeXml(el.label ?? "");
        return `<text x="${(el.x ?? 0) * sx}" y="${(el.y ?? 0) * sy}" font-size="${fs2}" font-family="sans-serif" font-weight="600" text-anchor="middle" stroke="rgba(255,255,255,0.9)" stroke-width="3" stroke-linejoin="round" paint-order="stroke" fill="${el.textColor ?? (isH ? "#f1f5f9" : "#64748b")}" opacity="${el.opacity ?? 1}">${lbl}</text>`;
      }
      default: return "";
    }
  }).join("\n  ");

  // Title & step overlay (bottom area)
  const title = `${escapeXml(titleEn)}  ·  ${escapeXml(titleHe)}`;
  const progress = (stepNum / totalSteps) * W;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#00000040"/>
    </filter>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <pattern id="grid" x="0" y="0" width="${20 * sx}" height="${20 * sy}" patternUnits="userSpaceOnUse">
      <circle cx="${sx}" cy="${sy}" r="1.8" fill="#94a3b8" opacity="0.18"/>
    </pattern>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.80"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#18181b"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- Process name top bar -->
  <rect width="${W}" height="52" fill="#000000" opacity="0.5"/>
  <text x="24" y="34" font-size="20" font-family="sans-serif" font-weight="700" fill="#34d399">${escapeXml(processName)}</text>
  <text x="${W - 24}" y="34" font-size="18" font-family="sans-serif" fill="#a1a1aa" text-anchor="end">${stepNum} / ${totalSteps}</text>

  <!-- Biology elements -->
  ${elSvg}

  <!-- Bottom overlay -->
  <rect x="0" y="${H - 100}" width="${W}" height="100" fill="url(#bottomFade)"/>
  <text x="24" y="${H - 60}" font-size="28" font-family="sans-serif" font-weight="700" fill="#f8fafc">${title}</text>

  <!-- Progress bar -->
  <rect x="0" y="${H - 5}" width="${W}" height="5" fill="rgba(255,255,255,0.1)"/>
  <rect x="0" y="${H - 5}" width="${progress}" height="5" fill="#10b981"/>
</svg>`;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 403 });

  let processSlug = "";
  try {
    const body = await req.json();
    processSlug = body.processSlug ?? "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!processSlug) return Response.json({ error: "processSlug required" }, { status: 400 });

  const proc = await prisma.process.findFirst({
    where: { slug: processSlug },
    include: { steps: { orderBy: { order: "asc" } } },
  });
  if (!proc) return Response.json({ error: "Process not found" }, { status: 404 });

  if (!proc.steps.length) return Response.json({ error: "No steps found for this process" }, { status: 400 });

  const tmpDir = path.join(process.cwd(), ".tmp-video", processSlug);
  try {
    fs.mkdirSync(tmpDir, { recursive: true });
  } catch (e) {
    return Response.json({ error: `Cannot create temp dir: ${e}` }, { status: 500 });
  }

  const pngPaths: string[] = [];

  try {
    // ── 1. Render each step to PNG via sharp ─────────────────────────────
    for (let i = 0; i < proc.steps.length; i++) {
      const step = proc.steps[i];
      const { elements, highlight } = parseSvg(step.svgData);

      const svg = buildSvg(
        elements,
        highlight,
        step.titleHe,
        step.titleEn,
        i + 1,
        proc.steps.length,
        proc.nameEn
      );

      const pngPath = path.join(tmpDir, `step${String(i).padStart(3, "0")}.png`);
      await sharp(Buffer.from(svg, "utf8")).png().toFile(pngPath);
      pngPaths.push(pngPath);
    }

    // ── 2. Build FFmpeg filter_complex for xfade transitions ─────────────
    const outDir = path.join(process.cwd(), "public", "videos");
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${processSlug}.mp4`);

    const n = pngPaths.length;

    const inputArgs: string[] = [];
    for (const p of pngPaths) {
      inputArgs.push("-loop", "1", "-t", String(STEP_SECS), "-i", p);
    }

    let filterComplex = "";
    let lastLabel = "[v0]";

    if (n === 1) {
      filterComplex = `[0:v]scale=${W}:${H}[v0]`;
    } else {
      const scales = pngPaths.map((_, i) => `[${i}:v]scale=${W}:${H}[s${i}]`).join("; ");
      const xfades: string[] = [];
      for (let i = 0; i < n - 1; i++) {
        const inA = i === 0 ? `[s0]` : `[xf${i - 1}]`;
        const inB = `[s${i + 1}]`;
        const out = i === n - 2 ? `[vout]` : `[xf${i}]`;
        const offset = (i + 1) * (STEP_SECS - XFADE_SECS);
        xfades.push(`${inA}${inB}xfade=transition=fade:duration=${XFADE_SECS}:offset=${offset}${out}`);
      }
      filterComplex = [scales, ...xfades].join("; ");
      lastLabel = n > 1 ? "[vout]" : "[v0]";
    }

    const ffmpegArgs = [
      ...inputArgs,
      "-filter_complex", filterComplex,
      "-map", lastLabel,
      "-c:v", "libx264",
      "-preset", "fast",
      "-pix_fmt", "yuv420p",
      "-r", "30",
      "-y",
      outPath,
    ];

    const result = spawnSync(FFMPEG, ffmpegArgs, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });

    fs.rmSync(tmpDir, { recursive: true, force: true });

    if (result.status !== 0) {
      const details = result.stderr?.slice(-1000) ?? result.error?.message ?? "unknown error";
      console.error("[generate-video] FFmpeg failed:", details);
      return Response.json({ error: "FFmpeg failed", details }, { status: 500 });
    }

    const videoUrl = `/videos/${processSlug}.mp4`;
    return Response.json({ videoUrl, steps: n });

  } catch (err) {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[generate-video] error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
