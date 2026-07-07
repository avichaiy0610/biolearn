"use client";

import { motion } from "framer-motion";

/* Hand-crafted, continuously-animated transcription scene (RNA Polymerase).
   Unlike the LLM step animations, this is a fixed high-quality scene that RUNS
   by itself: the DNA feeds through a stationary polymerase and the mRNA strand
   streams out — a real motion clip, not auto-advancing slides. */

const P = 64;   // helix wavelength
const A = 16;   // helix amplitude
const CY = 150; // DNA centre line
const X0 = -64, X1 = 544, STEP = 8;

function strandPath(sign: number): string {
  let d = "";
  for (let x = X0; x <= X1; x += STEP) {
    const y = CY + sign * A * Math.sin((2 * Math.PI * x) / P);
    d += `${x === X0 ? "M" : "L"} ${x} ${y.toFixed(1)} `;
  }
  return d;
}

const RUNGS = (() => {
  const arr: { x: number; y1: number; y2: number }[] = [];
  for (let x = X0; x <= X1; x += 16) {
    const s = A * Math.sin((2 * Math.PI * x) / P);
    arr.push({ x, y1: CY + s, y2: CY - s });
  }
  return arr;
})();

export default function TranscriptionScene({
  lang = "he",
  processName,
}: {
  lang?: string;
  processName?: string;
}) {
  const he = lang !== "en";

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
      {/* Canvas header strip */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/80">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-70" />
        <span className="ms-3 text-xs font-mono text-zinc-400 select-none">
          {processName ?? (he ? "שעתוק" : "Transcription")}
        </span>
        <span className="ms-auto inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {he ? "רץ" : "live"}
        </span>
      </div>

      <div className="p-4 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/60">
        <svg viewBox="0 0 480 300" className="w-full h-72 md:h-96" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="polGrad" cx="42%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="70%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* ── DNA double helix, scrolling right→left through the enzyme ── */}
          <motion.g
            animate={{ x: [0, -P] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          >
            {RUNGS.map((r, i) => (
              <line key={i} x1={r.x} y1={r.y1} x2={r.x} y2={r.y2}
                stroke="#cbd5e1" strokeWidth={2} opacity={0.7} />
            ))}
            <path d={strandPath(1)} fill="none" stroke="#f472b6" strokeWidth={4} strokeLinecap="round" />
            <path d={strandPath(-1)} fill="none" stroke="#60a5fa" strokeWidth={4} strokeLinecap="round" />
          </motion.g>

          {/* strand labels (static, on the incoming side) */}
          <g fontFamily="system-ui, sans-serif" fontWeight={600} fontSize={12}
             paintOrder="stroke" stroke="#ffffff" strokeWidth={3} strokeLinejoin="round">
            <text x={470} y={112} textAnchor="end" fill="#be185d">{he ? "גדיל מקודד" : "Coding strand"}</text>
            <text x={470} y={200} textAnchor="end" fill="#2563eb">{he ? "גדיל תבנית" : "Template strand"}</text>
          </g>

          {/* ── RNA Polymerase (stationary, gentle breathing) ── */}
          <motion.g
            animate={{ scale: [1, 1.025, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            filter="url(#soft)"
          >
            <ellipse cx={240} cy={150} rx={104} ry={82} fill="url(#polGrad)" stroke="#475569" strokeWidth={2.5} />
            <text x={240} y={150} textAnchor="middle" fontFamily="system-ui, sans-serif"
              fontSize={18} fontWeight={700} fill="#1e3a8a"
              paintOrder="stroke" stroke="#ffffff" strokeWidth={3.5} strokeLinejoin="round">
              {he ? "RNA פולימראז" : "RNA Polymerase"}
            </text>
          </motion.g>

          {/* active-site spark where mRNA is synthesised */}
          <motion.circle cx={234} cy={206} fill="#fde047"
            animate={{ opacity: [0.35, 1, 0.35], r: [6, 9, 6] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />

          {/* ── mRNA transcript streaming out of the bottom ── */}
          <path d="M 234 206 Q 188 250 120 290" fill="none" stroke="#10b981" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.circle key={i} r={4.5} fill="#059669"
              animate={{ cx: [234, 188, 120], cy: [206, 250, 290], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.52, ease: "linear" }} />
          ))}
          <text x={112} y={292} textAnchor="end" fontFamily="system-ui, sans-serif"
            fontSize={12} fontWeight={700} fill="#047857"
            paintOrder="stroke" stroke="#ffffff" strokeWidth={3} strokeLinejoin="round">
            {he ? "תעתיק mRNA" : "mRNA transcript"}
          </text>

          {/* direction arrow along the DNA */}
          <g opacity={0.8}>
            <line x1={300} y1={228} x2={360} y2={228} stroke="#0f766e" strokeWidth={2} />
            <path d="M 360 228 l -7 -4 l 0 8 Z" fill="#0f766e" />
            <text x={330} y={222} textAnchor="middle" fontSize={10} fontWeight={600} fill="#0f766e">5′→3′</text>
          </g>
        </svg>

        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed text-center">
          {he
            ? "RNA פולימראז נע לאורך ה-DNA, מפריד את הגדילים, ומסנתז גדיל mRNA משלים מהגדיל התבניתי."
            : "RNA polymerase moves along the DNA, separates the strands, and synthesises a complementary mRNA strand from the template."}
        </p>
      </div>
    </div>
  );
}
