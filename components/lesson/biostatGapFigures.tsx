/* Original, computed illustrations for Technion 134154. */
import type React from "react";
import { He, La, BLUE, ORANGE, GREEN, INK, MUTED, scale, curve } from "./biochemFigures";

const PURPLE = "#7c3aed";
const SE = 6 / Math.sqrt(16), MU0 = 50, MU1 = 54;
const LO = MU0 - 1.96 * SE, HI = MU0 + 1.96 * SE;
const pdf = (x: number, mu: number) => Math.exp(-0.5 * ((x - mu) / SE) ** 2) / (SE * Math.sqrt(2 * Math.PI));
function integral(mu: number, a: number, b: number) {
  const n = 2000, dx = (b - a) / n;
  let sum = pdf(a, mu) + pdf(b, mu);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * pdf(a + i * dx, mu);
  return sum * dx / 3;
}
const beta = integral(MU1, LO, HI), power = 1 - beta;
const halfAlpha = integral(MU0, MU0 - 12 * SE, LO);
const groups = { A: [12, 15, 9, 18, 21, 14], B: [8, 7, 11, 6, 10, 13] };
const ranked = Object.entries(groups).flatMap(([group, values]) => values.map(value => ({ group, value })))
  .sort((a, b) => a.value - b.value).map((v, i) => ({ ...v, rank: i + 1 }));
const rankSum = (group: string) => ranked.filter(v => v.group === group).reduce((sum, v) => sum + v.rank, 0);
const offset = groups.A.length * (groups.A.length + 1) / 2;
const maxW = groups.A.length * groups.B.length, W = rankSum("A") - offset;

function Canvas({ mobile, h, label, children }: { mobile: boolean; h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 ${mobile ? 360 : 720} ${h}`} role="img" aria-label={label} className="w-full h-auto" style={{ background: "white" }}>{children}</svg>;
}
function Responsive({ draw }: { draw: (mobile: boolean) => React.ReactElement }) {
  return <><div className="hidden sm:block">{draw(false)}</div><div className="sm:hidden">{draw(true)}</div></>;
}

function PowerPlot({ mobile }: { mobile: boolean }) {
  const width = mobile ? 360 : 720, mid = width / 2, base = 310;
  const s = scale(25, width - 25, base, 130, 44, 60, 0, 0.28);
  const f0 = (x: number) => pdf(x, MU0), f1 = (x: number) => pdf(x, MU1);
  const fill = (f: (x: number) => number, a: number, b: number) => `M${s.sx(a)} ${base} ` + curve(f, a, b, s, 200).replace(/^M/, "L") + ` L${s.sx(b)} ${base}Z`;
  const keyY = mobile ? 424 : 418;
  return <Canvas mobile={mobile} h={mobile ? 660 : 568} label="עוצמת מבחן Z דו־צדדי: שתי התפלגויות של ממוצע המדגם, תוחלות 50 ו־54 וטעות תקן 1.5. ספי דחייה 47.06 ו־52.94. כתום: שגיאה מסוג ראשון; סגול: בטא; ירוק: עוצמה.">
    <He x={mid} y={30} size={mobile ? 21 : 25} bold>הבדל אמיתי — האם נזהה אותו?</He>
    <La x={mid} y={63} size={18}>SE = 6 / √16 = 1.5    ·    α = 0.05</La>
    <La x={s.sx(MU0)} y={105} size={18} bold color={BLUE}>H₀: μ₀ = 50</La>
    <La x={s.sx(MU1) + (mobile ? 15 : 0)} y={mobile ? 132 : 105} size={18} bold color={GREEN}>H₁: μ₁ = 54</La>
    <path d={fill(f1, LO, HI)} fill="#ddd6fe" />
    <path d={fill(f1, 44, LO)} fill="#bbf7d0" />
    <path d={fill(f1, HI, 60)} fill="#bbf7d0" />
    <path d={fill(f0, 44, LO)} fill="#fdba74" />
    <path d={fill(f0, HI, 60)} fill="#fdba74" fillOpacity={0.85} />
    <path d={curve(f0, 44, 60, s, 300)} fill="none" stroke={BLUE} strokeWidth={2.8} />
    <path d={curve(f1, 44, 60, s, 300)} fill="none" stroke={GREEN} strokeWidth={2.8} />
    {[LO, HI].map(v => <path key={v} d={`M${s.sx(v)} 149 V${base}`} fill="none" stroke={ORANGE} strokeWidth={1.8} strokeDasharray="5 4" />)}
    <path d={`M25 ${base} H${width - 25}`} stroke={INK} strokeWidth={1.5} />
    {[LO, MU0, HI, MU1].map(v => <g key={v}>
      <path d={`M${s.sx(v)} ${base} v7`} stroke={INK} />
      <La x={s.sx(v)} y={v === MU0 || v === MU1 ? 361 : 339} size={16} color={v === LO || v === HI ? ORANGE : INK}>{v.toFixed(v === LO || v === HI ? 2 : 0)}</La>
    </g>)}
    <He x={mid} y={393} size={17}>ממוצע המדגם · ערכים קריטיים בכתום</He>
    <La x={width - 30} y={361} size={18}>x̄</La>
    {[{ c: ORANGE, text: `α/2 ≈ ${halfAlpha.toFixed(3)}`, note: "בכל זנב תחת השערת האפס" },
      { c: PURPLE, text: `β ≈ ${beta.toFixed(2)}`, note: "אי־דחייה כשקיים הבדל אמיתי" },
      { c: GREEN, text: `1 − β ≈ ${power.toFixed(2)}`, note: "עוצמה: דחייה כשקיים הבדל" }].map((key, i) => {
        const x = mobile ? mid : 126 + i * 234, y = keyY + (mobile ? i * 68 : 0);
        return <g key={key.c}><rect x={x - 108} y={y - 15} width={15} height={15} rx={3} fill={key.c} />
          <La x={x + 9} y={y} size={18} bold color={key.c}>{key.text}</La>
          <He x={x} y={y + 26} size={16}>{key.note}</He></g>;
      })}
    <He x={mid} y={mobile ? 628 : 493} size={16}>בטא: השטח הסגול בין שני הספים</He>
    <He x={mid} y={mobile ? 651 : 522} size={15} color={MUTED}>הזנב הירוק התחתון זניח בקנה המידה הזה</He>
    {!mobile && <He x={mid} y={551} size={16} color={MUTED}>השטחים הם הסתברויות; גובה העקומות הוא צפיפות</He>}
  </Canvas>;
}

function RankStrip({ mobile }: { mobile: boolean }) {
  const width = mobile ? 360 : 720, mid = width / 2, cols = mobile ? 6 : 12;
  const step = (width - 36) / cols, summaryY = mobile ? 393 : 267;
  const gaugeY = summaryY + (mobile ? 20 : 0);
  return <Canvas mobile={mobile} h={mobile ? 688 : 540} label="מיון משותף של 12 תצפיות. קבוצה A בכחול: סכום הדרגות 53; קבוצה B בכתום: סכום הדרגות 25. סטטיסטי W הוא 32 מתוך 36, לעומת תוחלת 18 תחת השערת האפס.">
    <He x={mid} y={31} size={mobile ? 21 : 25} bold>מהערכים אל סכום הדרגות</He>
    <He x={mid} y={64} size={17}>ממיינים יחד, מהקטן לגדול</He>
    <La x={mid - 68} y={96} size={18} bold color={BLUE}>A · n = 6</La>
    <La x={mid + 68} y={96} size={18} bold color={ORANGE}>B · n = 6</La>
    {ranked.map((v, i) => {
      const x = 18 + (i % cols + 0.5) * step, y = 130 + Math.floor(i / cols) * 133;
      const c = v.group === "A" ? BLUE : ORANGE;
      return <g key={v.value}>
        <rect x={x - step / 2 + 2} y={y} width={step - 4} height={92} rx={8} fill={v.group === "A" ? "#eff6ff" : "#fff7ed"} />
        <La x={x} y={y + 23} size={16} bold color={c}>{v.group}</La>
        <La x={x} y={y + 51} size={21} bold color={c}>{v.value}</La>
        <La x={x} y={y + 80} size={17}>{v.rank}</La>
      </g>;
    })}
    <He x={mid} y={mobile ? 380 : 246} size={16}>בכל תא: קבוצה · ערך · דרגה</He>
    <La x={mobile ? mid : 188} y={summaryY + 32} size={21} bold color={BLUE}>{`R_A = ${rankSum("A")}`}</La>
    <La x={mobile ? mid : 532} y={summaryY + (mobile ? 65 : 32)} size={21} bold color={ORANGE}>{`R_B = ${rankSum("B")}`}</La>
    <La x={mid} y={summaryY + (mobile ? 103 : 77)} size={mobile ? 23 : 27} bold>{`W = ${rankSum("A")} − ${offset} = ${W}`}</La>
    <He x={mid} y={summaryY + (mobile ? 136 : 110)} size={16}>מחסרים את סכום שש הדרגות הקטנות ביותר</He>
    <path d={`M40 ${gaugeY + 171} H${width - 40}`} stroke="#cbd5e1" strokeWidth={3} />
    <path d={`M${40 + (width - 80) * 0.5} ${gaugeY + 162} v18`} stroke={MUTED} strokeWidth={2} />
    <circle cx={40 + (width - 80) * W / maxW} cy={gaugeY + 171} r={6} fill={BLUE} />
    <La x={40} y={gaugeY + 200} size={17}>0</La>
    <La x={mid} y={gaugeY + 200} size={17}>{maxW / 2}</La>
    <La x={width - 40} y={gaugeY + 200} size={17}>{maxW}</La>
    <La x={40 + (width - 80) * W / maxW} y={gaugeY + 153} size={17} bold color={BLUE}>{`W = ${W}`}</La>
    <He x={mid} y={gaugeY + 232} size={16}>משמאל: מינימום · באמצע: תוחלת תחת האפס</He>
    <He x={mid} y={gaugeY + 256} size={16}>מימין: מקסימום · אין ערכים קשורים בדוגמה</He>
  </Canvas>;
}

export const BIOSTAT_GAP_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "bs-power-curves": {
    el: () => <Responsive draw={mobile => <PowerPlot mobile={mobile} />} />,
    captionHe: "עוצמת מבחן Z דו־צדדי ברמת 5%: ממוצעי האוכלוסיות 50 ו־54, וטעות התקן 1.5. ספי הדחייה הם 47.06 ו־52.94. כתום: שני זנבות α תחת H₀; סגול: β ≈ 0.24 תחת H₁; ירוק: העוצמה 1 − β ≈ 0.76. הזנב התחתון תחת H₁ זניח, אך נכלל בחישוב. נתונים להמחשה.",
  },
  "bs-rank-sum": {
    el: () => <Responsive draw={mobile => <RankStrip mobile={mobile} />} />,
    captionHe: "סכום דרגות לשתי קבוצות בלתי תלויות: כל 12 הערכים ממוינים יחד, והרווחים בתרשים מייצגים דרגות ולא מרחקים מספריים. סכומי הדרגות: R_A = 53, R_B = 25. הסטטיסטי של R הוא W = 53 − 21 = 32 (גם U של מאן–ויטני), לעומת תוחלת 18 תחת H₀ ומקסימום 36. נתונים להמחשה.",
  },
};
