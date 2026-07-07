"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Hand-crafted, continuously-animated transcription scene (RNA Polymerase).
   The DNA visibly OPENS into a transcription bubble in the middle; a small,
   semi-transparent polymerase sits over it so you can see the strands separate.
   Base-pair beads flow through (and split at the bubble) and mRNA streams out. */

const CY = 150;
const bump = (x: number) => Math.exp(-Math.pow((x - 230) / 68, 2)); // 0..1, open in the middle
const sep = (x: number) => 8 + 30 * bump(x); // strand separation: 8 closed → 38 open
const wig = (x: number) => 5 * Math.sin(x / 9) * (1 - bump(x)); // helical twist only where closed
const yTop = (x: number) => CY - sep(x) / 2 + wig(x);
const yBot = (x: number) => CY + sep(x) / 2 - wig(x);

function strandPath(fn: (x: number) => number): string {
  let d = "";
  for (let x = -24; x <= 504; x += 6) d += `${x === -24 ? "M" : "L"} ${x} ${fn(x).toFixed(1)} `;
  return d;
}
const TOP_PATH = strandPath(yTop);
const BOT_PATH = strandPath(yBot);

// base-pair rungs only where the DNA is closed (double-stranded)
const RUNGS = (() => {
  const a: { x: number; y1: number; y2: number }[] = [];
  for (let x = -24; x <= 504; x += 13) if (sep(x) < 13) a.push({ x, y1: yTop(x), y2: yBot(x) });
  return a;
})();

// keyframe samples for beads gliding right→left along each strand
const CX: number[] = [];
for (let x = 500; x >= -20; x -= 24) CX.push(x);
const CY_TOP = CX.map(yTop);
const CY_BOT = CX.map(yBot);
const BEAD_DUR = 4.6;

const CAPTIONS: { he: string; en: string }[] = [
  { he: "1 · RNA פולימראז נקשר ל-DNA ופותח בועת שעתוק", en: "1 · RNA polymerase binds the DNA and opens a transcription bubble" },
  { he: "2 · הפולימראז עצמו מפריד את הגדילים — בשעתוק אין צורך בהליקאז נפרד", en: "2 · The polymerase itself separates the strands — no separate helicase in transcription" },
  { he: "3 · הגדיל התבניתי נקרא 3′→5′ ונוקלאוטידים משלימים נוספים ל-mRNA", en: "3 · The template strand is read 3′→5′ and complementary nucleotides join the mRNA" },
  { he: "4 · ה-mRNA משתחרר, והגדילים נסגרים מחדש מאחורי הפולימראז", en: "4 · The mRNA is released and the strands rewind behind the polymerase" },
];

export default function TranscriptionScene({
  lang = "he",
  processName,
}: {
  lang?: string;
  processName?: string;
}) {
  const he = lang !== "en";
  const [ci, setCi] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCi((c) => (c + 1) % CAPTIONS.length), 3600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
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
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="70%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#60a5fa" />
            </radialGradient>
          </defs>

          {/* base-pair rungs (closed dsDNA only) */}
          {RUNGS.map((r, i) => (
            <line key={i} x1={r.x} y1={r.y1} x2={r.x} y2={r.y2} stroke="#cbd5e1" strokeWidth={2} opacity={0.7} />
          ))}

          {/* the two strands: tight on the sides, OPEN into a bubble in the middle */}
          <path d={TOP_PATH} fill="none" stroke="#f472b6" strokeWidth={4} strokeLinecap="round" />
          <path d={BOT_PATH} fill="none" stroke="#60a5fa" strokeWidth={4} strokeLinecap="round" />

          {/* base-pair beads gliding through — they split apart at the bubble */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.circle key={`t${i}`} r={3.5} fill="#ec4899"
              animate={{ cx: CX, cy: CY_TOP }}
              transition={{ duration: BEAD_DUR, repeat: Infinity, ease: "linear", delay: (i * BEAD_DUR) / 5 }} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.circle key={`b${i}`} r={3.5} fill="#3b82f6"
              animate={{ cx: CX, cy: CY_BOT }}
              transition={{ duration: BEAD_DUR, repeat: Infinity, ease: "linear", delay: (i * BEAD_DUR) / 5 }} />
          ))}

          {/* unwind / rewind fork markers */}
          <text x={318} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f766e"
            paintOrder="stroke" stroke="#ffffff" strokeWidth={3} strokeLinejoin="round">↺</text>
          <text x={142} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f766e"
            paintOrder="stroke" stroke="#ffffff" strokeWidth={3} strokeLinejoin="round">↻</text>

          {/* small, semi-transparent RNA polymerase over the bubble */}
          <motion.g
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <ellipse cx={230} cy={150} rx={70} ry={58} fill="url(#polGrad)" fillOpacity={0.8} stroke="#2563eb" strokeWidth={2.5} />
            <text x={230} y={126} textAnchor="middle" fontFamily="system-ui, sans-serif"
              fontSize={13} fontWeight={700} fill="#1e3a8a"
              paintOrder="stroke" stroke="#ffffff" strokeWidth={3} strokeLinejoin="round">
              {he ? "RNA פולימראז" : "RNA Pol"}
            </text>
          </motion.g>

          {/* active-site spark + mRNA transcript streaming out */}
          <motion.circle cx={214} cy={172} fill="#fde047"
            animate={{ opacity: [0.35, 1, 0.35], r: [5, 8, 5] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
          <path d="M 214 172 Q 180 232 120 288" fill="none" stroke="#10b981" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.circle key={`m${i}`} r={4.5} fill="#059669"
              animate={{ cx: [214, 180, 120], cy: [172, 232, 288], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.52, ease: "linear" }} />
          ))}
        </svg>

        {/* Legend (HTML — RTL-safe) */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "#f472b6" }} />{he ? "גדיל מקודד" : "Coding strand"}</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "#60a5fa" }} />{he ? "גדיל תבנית" : "Template strand"}</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />{he ? "תעתיק mRNA" : "mRNA transcript"}</span>
        </div>

        {/* Rotating explanation */}
        <div className="mt-3 min-h-[2.75rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p key={ci} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35 }}
              className="text-sm text-zinc-700 dark:text-zinc-300 text-center leading-relaxed px-2">
              {he ? CAPTIONS[ci].he : CAPTIONS[ci].en}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-1.5 mt-1">
          {CAPTIONS.map((_, i) => (
            <button key={i} onClick={() => setCi(i)} aria-label={`explanation ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === ci ? "w-5 bg-emerald-500" : "w-1.5 bg-zinc-300 dark:bg-zinc-600"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
