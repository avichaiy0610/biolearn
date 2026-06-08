"use client";

import { motion } from "framer-motion";

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

function SvgDefs() {
  return (
    <defs>
      <filter id="sd-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#00000022" />
      </filter>
      <marker id="sd-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#059669" opacity="0.85" />
      </marker>
      <pattern id="sd-dotgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.8" fill="#cbd5e1" opacity="0.4" />
      </pattern>
      <radialGradient id="sd-cellGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#fef9ee" />
        <stop offset="100%" stopColor="#fde68a" stopOpacity="0.3" />
      </radialGradient>
      <radialGradient id="sd-nucleusGrad" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.25" />
      </radialGradient>
    </defs>
  );
}

function SvgEl({ el, i }: { el: SvgElement; i: number }) {
  const fill = el.color ?? "#94a3b8";
  const strokeColor = el.stroke ?? (el.color ? el.color : "none");
  const strokeW = el.strokeWidth ?? (el.stroke ? 1.5 : 0);
  const opacity = el.opacity ?? 1;
  const delay = i * 0.04;

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity },
    transition: { duration: 0.4, delay },
  };

  switch (el.type) {
    case "circle":
      return (
        <motion.circle
          {...fadeIn}
          cx={el.cx} cy={el.cy} r={el.r}
          fill={fill} stroke={strokeColor} strokeWidth={strokeW}
          filter="url(#sd-shadow)"
        />
      );
    case "ellipse":
      return (
        <motion.ellipse
          {...fadeIn}
          cx={el.cx} cy={el.cy} rx={el.rx} ry={el.ry}
          fill={fill} stroke={strokeColor} strokeWidth={strokeW}
          filter="url(#sd-shadow)"
        />
      );
    case "rect":
      return (
        <motion.rect
          {...fadeIn}
          x={el.x} y={el.y} width={el.width} height={el.height}
          rx={el.rx ?? 6}
          fill={fill} stroke={strokeColor} strokeWidth={strokeW}
          filter="url(#sd-shadow)"
        />
      );
    case "line":
      return (
        <motion.line
          {...fadeIn}
          x1={el.x1} y1={el.y1} x2={el.x2} y2={el.y2}
          stroke={el.stroke ?? "#059669"} strokeWidth={el.strokeWidth ?? 2.5}
          strokeLinecap="round"
          markerEnd="url(#sd-arrow)"
        />
      );
    case "path":
      return (
        <motion.path
          {...fadeIn}
          d={el.d ?? ""}
          fill="none"
          stroke={el.stroke ?? "#059669"} strokeWidth={el.strokeWidth ?? 2.5}
          strokeLinecap="round" strokeLinejoin="round"
          markerEnd="url(#sd-arrow)"
        />
      );
    case "text":
      return (
        <motion.text
          {...fadeIn}
          x={el.x} y={el.y}
          fontSize={el.fontSize ?? 11}
          fontFamily="system-ui, sans-serif"
          fontWeight="600"
          textAnchor="middle"
          fill={el.textColor ?? "#1e293b"}
          paintOrder="stroke"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={3}
          strokeLinejoin="round"
        >
          {el.label}
        </motion.text>
      );
    default:
      return null;
  }
}

export default function StaticSVGDiagram({
  elements,
  title,
}: {
  elements: SvgElement[];
  title?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/80">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 opacity-70" />
        {title && (
          <span className="ms-3 text-xs font-mono text-zinc-400 select-none truncate">{title}</span>
        )}
      </div>

      <div className="p-4">
        <svg
          viewBox="0 0 400 300"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <SvgDefs />
          <rect width="400" height="300" fill="url(#sd-dotgrid)" />
          {elements.map((el, i) => (
            <SvgEl key={el.id} el={el} i={i} />
          ))}
        </svg>
      </div>
    </div>
  );
}
