// Legend swatch drawn in the same visual language as the scene.
export default function Swatch({ item }: { item: { color: string; swatch?: string } }) {
  const c = item.color;
  const box = "inline-block shrink-0";
  switch (item.swatch) {
    case "dot": return <span aria-hidden className={`${box} w-3 h-3 rounded-full`} style={{ background: c }} />;
    case "ring": return <span aria-hidden className={`${box} w-3 h-3 rounded-full border-2`} style={{ borderColor: c }} />;
    case "dash": return <span aria-hidden className={`${box} w-5 h-0 border-t-2 border-dashed`} style={{ borderColor: c }} />;
    case "arrow": return (
      <svg aria-hidden width="22" height="10" viewBox="0 0 22 10" className={box}>
        <line x1="0" y1="5" x2="14" y2="5" stroke={c} strokeWidth="3" />
        <polygon points="22,5 13,0 13,10" fill={c} />
      </svg>
    );
    default: return <span aria-hidden className={`${box} w-5 h-1.5 rounded-full`} style={{ background: c }} />;
  }
}
