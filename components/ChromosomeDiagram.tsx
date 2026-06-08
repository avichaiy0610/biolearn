"use client";

import { motion } from "framer-motion";

interface ChromosomeDiagramProps {
  lang?: string;
  title?: string;
}

const LABELS = {
  en: {
    title: "Chromosome",
    telomere: "Telomere",
    centromere: "Centromere",
    pArm: "p arm (short)",
    qArm: "q arm (long)",
    chromatids: "Sister chromatids",
    chromatin: "Chromatin",
  },
  he: {
    title: "כרומוזום",
    telomere: "טלומר",
    centromere: "צנטרומר",
    pArm: "זרוע p (קצרה)",
    qArm: "זרוע q (ארוכה)",
    chromatids: "כרומטידות אחיות",
    chromatin: "כרומטין",
  },
};

// Chromosome geometry — submetacentric, 2 sister chromatids
const LCX = 120;  // left chromatid center x
const RCX = 143;  // right chromatid center x
const HW  = 17;   // half-width of each arm
const CHW = 9;    // half-width at centromere constriction
const CY  = 150;  // centromere y
const PT  = 50;   // p arm top (short arm)
const QB  = 254;  // q arm bottom (long arm)
const CCX = 132;  // chromosome center x = (LCX+RCX)/2 ≈ 131.5

// Leader line x-coordinates
const LX1 = RCX + HW + 4; // 164 — start of leader line (just right of right chromatid)
const LX2 = 208;           // end of leader line
const TX  = 215;           // label text start x

function makePath(cx: number): string {
  const L = cx - HW, R = cx + HW;
  const LC = cx - CHW, RC = cx + CHW;
  return [
    `M ${L} ${PT}`,
    `C ${L} ${PT - 12} ${R} ${PT - 12} ${R} ${PT}`,   // top cap
    `L ${R} ${CY - 16}`,
    `C ${R} ${CY - 7} ${RC} ${CY - 3} ${RC} ${CY}`,   // right taper → centromere
    `C ${RC} ${CY + 3} ${R} ${CY + 7} ${R} ${CY + 16}`, // right expand ← centromere
    `L ${R} ${QB}`,
    `C ${R} ${QB + 12} ${L} ${QB + 12} ${L} ${QB}`,   // bottom cap
    `L ${L} ${CY + 16}`,
    `C ${L} ${CY + 7} ${LC} ${CY + 3} ${LC} ${CY}`,   // left taper → centromere
    `C ${LC} ${CY - 3} ${L} ${CY - 7} ${L} ${CY - 16}`, // left expand ← centromere
    "Z",
  ].join(" ");
}

const anim = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.45, delay },
});

export default function ChromosomeDiagram({ lang = "en", title }: ChromosomeDiagramProps) {
  const L = LABELS[lang === "he" ? "he" : "en"];
  const isHe = lang === "he";

  // Bracket (left side — labels sister chromatids)
  const brX1 = LCX - HW - 5;  // 98 — bracket opening x
  const brX2 = LCX - HW - 13; // 90 — bracket spine x
  const brY1 = 82;
  const brY2 = 232;
  const brMid = (brY1 + brY2) / 2; // 157

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/80">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-70" />
        <span className="ms-3 text-xs font-mono text-zinc-400 select-none truncate">
          {title ?? L.title}
        </span>
      </div>

      <div className="p-4">
        <svg viewBox="0 0 400 295" className="w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Dot grid background */}
            <pattern id="cd-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#cbd5e1" opacity="0.4" />
            </pattern>

            {/* Chromatin gradient (purple-blue) */}
            <linearGradient id="cd-chromatin" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6d28d9" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            {/* Centromere gradient (pink-red) */}
            <radialGradient id="cd-centro" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="100%" stopColor="#e11d48" />
            </radialGradient>

            {/* Telomere gradient (teal) */}
            <radialGradient id="cd-telo" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="100%" stopColor="#0f766e" />
            </radialGradient>

            {/* Soft purple glow on chromatids */}
            <filter id="cd-glow" x="-20%" y="-8%" width="140%" height="116%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#7c3aed" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Background */}
          <rect width="400" height="295" fill="url(#cd-grid)" />

          {/* ── Chromatid bodies ── */}
          <motion.path {...anim(0.05)} d={makePath(LCX)}
            fill="url(#cd-chromatin)" filter="url(#cd-glow)" />
          <motion.path {...anim(0.12)} d={makePath(RCX)}
            fill="url(#cd-chromatin)" filter="url(#cd-glow)" />

          {/* Centromere — pink ellipse bridging the constriction */}
          <motion.ellipse {...anim(0.22)}
            cx={CCX} cy={CY} rx={23} ry={11}
            fill="url(#cd-centro)" stroke="#9f1239" strokeWidth={1} />

          {/* Telomeres — 4 caps */}
          <motion.ellipse {...anim(0.32)} cx={LCX} cy={PT} rx={HW + 1} ry={8} fill="url(#cd-telo)" stroke="#134e4a" strokeWidth={0.8} />
          <motion.ellipse {...anim(0.32)} cx={RCX} cy={PT} rx={HW + 1} ry={8} fill="url(#cd-telo)" stroke="#134e4a" strokeWidth={0.8} />
          <motion.ellipse {...anim(0.38)} cx={LCX} cy={QB} rx={HW + 1} ry={8} fill="url(#cd-telo)" stroke="#134e4a" strokeWidth={0.8} />
          <motion.ellipse {...anim(0.38)} cx={RCX} cy={QB} rx={HW + 1} ry={8} fill="url(#cd-telo)" stroke="#134e4a" strokeWidth={0.8} />

          {/* ── Sister-chromatids bracket (left side) ── */}
          <motion.path {...anim(0.55)}
            d={`M ${brX1} ${brY1} L ${brX2} ${brY1} L ${brX2} ${brY2} L ${brX1} ${brY2}`}
            fill="none" stroke="#94a3b8" strokeWidth={1} strokeLinecap="round" />
          <motion.text {...anim(0.6)}
            x={brX2 - 5} y={brMid}
            fontSize={9} fontFamily="system-ui, sans-serif" fontWeight="600"
            fill="#64748b" textAnchor="middle"
            transform={`rotate(-90, ${brX2 - 5}, ${brMid})`}
          >{L.chromatids}</motion.text>

          {/* ── Leader lines + labels (right side) ── */}

          {/* Telomere — top */}
          <motion.line {...anim(0.5)} x1={LX1} y1={PT} x2={LX2} y2={43}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,2" />
          <motion.text {...anim(0.55)} x={TX} y={47}
            fontSize={11} fontFamily="system-ui, sans-serif" fontWeight="700" fill="#0f766e"
            dominantBaseline="auto">{L.telomere}</motion.text>

          {/* p arm */}
          <motion.line {...anim(0.5)} x1={LX1} y1={100} x2={LX2} y2={100}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,2" />
          <motion.text {...anim(0.55)} x={TX} y={104}
            fontSize={11} fontFamily="system-ui, sans-serif" fontWeight="700" fill="#6d28d9">{L.pArm}</motion.text>

          {/* Centromere */}
          <motion.line {...anim(0.5)} x1={LX1} y1={CY} x2={LX2} y2={CY}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,2" />
          <motion.text {...anim(0.55)} x={TX} y={CY + 4}
            fontSize={11} fontFamily="system-ui, sans-serif" fontWeight="700" fill="#9f1239">{L.centromere}</motion.text>

          {/* q arm */}
          <motion.line {...anim(0.5)} x1={LX1} y1={202} x2={LX2} y2={202}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,2" />
          <motion.text {...anim(0.55)} x={TX} y={206}
            fontSize={11} fontFamily="system-ui, sans-serif" fontWeight="700" fill="#6d28d9">{isHe ? "זרוע q (ארוכה)" : "q arm (long)"}</motion.text>

          {/* Telomere — bottom */}
          <motion.line {...anim(0.5)} x1={LX1} y1={QB} x2={LX2} y2={264}
            stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,2" />
          <motion.text {...anim(0.55)} x={TX} y={268}
            fontSize={11} fontFamily="system-ui, sans-serif" fontWeight="700" fill="#0f766e">{L.telomere}</motion.text>

          {/* ── Color key (bottom-right) ── */}
          <motion.g {...anim(0.7)}>
            <rect x={226} y={278} width={166} height={13} rx={4}
              fill="white" fillOpacity={0.6} stroke="#e2e8f0" strokeWidth={0.5} />
            <circle cx={235} cy={285} r={4} fill="#8b5cf6" />
            <text x={243} y={288} fontSize={9} fontFamily="system-ui" fill="#64748b">{L.chromatin}</text>
            <circle cx={294} cy={285} r={4} fill="#e11d48" />
            <text x={302} y={288} fontSize={9} fontFamily="system-ui" fill="#64748b">{L.centromere}</text>
            <circle cx={358} cy={285} r={4} fill="#0f766e" />
            <text x={366} y={288} fontSize={9} fontFamily="system-ui" fill="#64748b">{L.telomere}</text>
          </motion.g>
        </svg>
      </div>
    </div>
  );
}
