/* Line-drawn icon per field (topic slug) — the site's own subject marks,
   used instead of emoji. Inherits color from `currentColor`. */

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const soft = { fill: "currentColor", fillOpacity: 0.16 };

const ICONS: Record<string, React.ReactNode> = {
  "cell-biology": (
    <>
      <ellipse cx="16" cy="16" rx="13" ry="11" {...P} />
      <circle cx="18" cy="15" r="4.5" {...P} {...soft} />
      <path d="M8 19c2-2 4 0 6-1" {...P} />
      <circle cx="10" cy="12" r="1.3" fill="currentColor" />
    </>
  ),
  biochemistry: (
    <>
      <path d="M5 22c0-8 4-15 11-15s11 7 11 15h-7v-5h-8v5z" {...P} {...soft} />
      <rect x="12.5" y="18" width="7" height="8" rx="1.5" {...P} />
    </>
  ),
  genetics: (
    <>
      <path d="M10 3c0 7 12 7 12 13S10 22 10 29M22 3c0 7-12 7-12 13s12 6 12 13" {...P} />
      <path d="M12 7h8M12 25h8M14 11h4M14 21h4" {...P} strokeWidth={1.5} />
    </>
  ),
  "molecular-biology": (
    <>
      <path d="M4 12h24M4 20h24" {...P} />
      <path d="M8 12v8M13 12v8M18 12v8M23 12v8" {...P} strokeWidth={1.5} />
      <ellipse cx="22" cy="9" rx="6" ry="3.5" {...P} {...soft} />
    </>
  ),
  microbiology: (
    <>
      <rect x="4" y="10" width="19" height="11" rx="5.5" {...P} {...soft} />
      <path d="M23 15.5c3 0 2 4 5 4" {...P} />
      <circle cx="10" cy="15.5" r="1.4" fill="currentColor" />
      <circle cx="15" cy="14" r="1.1" fill="currentColor" />
    </>
  ),
  physiology: (
    <>
      <path d="M16 27S4 19.5 4 11.5A6 6 0 0 1 16 9a6 6 0 0 1 12 2.5C28 19.5 16 27 16 27z" {...P} {...soft} />
      <path d="M8 16h5l2-4 3 7 2-3h4" {...P} strokeWidth={1.5} />
    </>
  ),
  "plant-physiology": (
    <>
      <path d="M6 26C6 13 14 6 27 5c0 13-7 21-21 21z" {...P} {...soft} />
      <path d="M6 26 20 12M12 20h6M15 16v-5" {...P} strokeWidth={1.5} />
    </>
  ),
  immunology: (
    <>
      <path d="M16 28V17M16 17 8 7M16 17l8-10" {...P} />
      <path d="M5.5 9.5 9 5M27 9.5 23 5" {...P} />
      <circle cx="16" cy="17" r="2" {...P} {...soft} />
    </>
  ),
  neurobiology: (
    <>
      <circle cx="10" cy="14" r="4.5" {...P} {...soft} />
      <path d="M6 10 3 6M6 18l-3 4M10 9.5V4M14.5 14H24l4 4M24 14l4-4" {...P} />
    </>
  ),
  endocrinology: (
    <>
      <path d="M16 4c4 6 7 10 7 14a7 7 0 0 1-14 0c0-4 3-8 7-14z" {...P} {...soft} />
      <path d="M13 19a3 3 0 0 0 3 3" {...P} strokeWidth={1.5} />
    </>
  ),
  "evolutionary-biology": (
    <>
      <path d="M16 29V18M16 18l-7-7M16 18l6-9M9 11V4M9 11 4 8M22 9l4-4M22 9V4" {...P} />
      <circle cx="16" cy="18" r="1.6" fill="currentColor" />
    </>
  ),
  ecology: (
    <>
      <circle cx="9" cy="21" r="4" {...P} />
      <circle cx="23" cy="21" r="4" {...P} />
      <circle cx="16" cy="9" r="4" {...P} {...soft} />
      <path d="M13.5 12.5 11 17.5M18.5 12.5l2.5 5M13 21h6" {...P} strokeWidth={1.5} />
    </>
  ),
  "developmental-biology": (
    <>
      <circle cx="16" cy="16" r="12" {...P} />
      <circle cx="12" cy="13" r="4" {...P} {...soft} />
      <circle cx="20" cy="13" r="4" {...P} {...soft} />
      <circle cx="12" cy="21" r="4" {...P} {...soft} />
      <circle cx="20" cy="21" r="4" {...P} {...soft} />
    </>
  ),
  bioinformatics: (
    <>
      <path d="M4 9h6M12 9h4M18 9h10M4 16h3M9 16h9M20 16h8M4 23h10M16 23h5M23 23h5" {...P} />
      <path d="M12 6v20" {...P} strokeWidth={1.2} strokeDasharray="2 2" />
    </>
  ),
};

export default function FieldIcon({ topic, size = 28, className = "" }: { topic: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      {ICONS[topic] ?? ICONS["cell-biology"]}
    </svg>
  );
}
