/* Shared frame for the textbook-level redraws (Codex, 2026-11-02). Lesson figures sit on a white card in both
   themes, so the light palette is pinned on the <svg> itself instead of inheriting the page's --ink/--muted. */
import type React from "react";
import { isolatePrimes } from "@/lib/text";

// Text helpers as in the prototypes (Arial for both scripts): the redraws were laid out and collision-checked in
// Arial, and the site's Hebrew face is wider, so it would make neighbouring labels touch.
type TxProps = { x: number; y: number; children: React.ReactNode; size?: number; anchor?: "start" | "middle" | "end"; color?: string; bold?: boolean; rotate?: number };
const FONT = { fontFamily: "Arial, sans-serif" };
export function He({ x, y, children, size = 15, anchor = "middle", color = "var(--ink)", bold, rotate }: TxProps) {
  const a = anchor === "start" ? "end" : anchor === "end" ? "start" : "middle";
  if (typeof children === "string") children = isolatePrimes(children);
  return (
    <text x={x} y={y} fontSize={size} textAnchor={a} direction="rtl" fill={color} fontWeight={bold ? 700 : 400} style={FONT}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}>{children}</text>
  );
}
export function La({ x, y, children, size = 15, anchor = "middle", color = "var(--ink)", bold }: TxProps) {
  return <text x={x} y={y} fontSize={size} textAnchor={anchor} direction="ltr" fill={color} fontWeight={bold ? 700 : 400} style={FONT}>{children}</text>;
}

const PALETTE = { "--paper": "#ffffff", "--panel": "#f3f6f8", "--ink": "#25364a", "--muted": "#586b7d" } as React.CSSProperties;

export function Svg({ w = 480, h, label, children }: { w?: number; h: number; label: string; children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label={label} style={PALETTE}>
      {children}
    </svg>
  );
}
