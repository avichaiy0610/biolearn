/* Original drawings for Technion 134119. Source review, equations and limitations:
   visual-lab/gene-expression-data/learning-card.md. No experimental data. */
import type React from "react";
import { He, La, BLUE, ORANGE, GREEN, INK, MUTED } from "./biochemFigures";

const PURPLE = "#7c3aed", RED = "#b91c1c", TEAL = "#0f766e";
const PALE = { blue: "#dbeafe", green: "#dcfce7", orange: "#ffedd5", purple: "#ede9fe", red: "#fee2e2" };
const N = 20;
function Canvas({ h, label, children, mobile }: { h: number; label: string; children: React.ReactNode; mobile: string }) {
  return <div className="gx-data-figure" style={{width:"100%"}}>
    <style>{`.gx-data-figure svg{width:100%;height:auto;background:#fff}.gx-data-figure .gx-data-mobile{display:none}@media(max-width:640px){.gx-data-figure .gx-data-desktop{display:none}.gx-data-figure .gx-data-mobile{display:block}}`}</style>
    <svg viewBox={`0 0 720 ${h}`} className="gx-data-desktop" role="img" aria-label={label}><title>{label}</title>{children}</svg>
    <MobileFigure id={mobile} label={label} />
  </div>;
}
function H({ x, y, children, color = INK, bold = false, size = N }: { x: number; y: number; children: React.ReactNode; color?: string; bold?: boolean; size?: number }) {
  return <He x={x} y={y} size={size} color={color} bold={bold}>{children}</He>;
}
function L({ x, y, children, color = INK, bold = false, size = N, anchor = "middle" }: { x: number; y: number; children: React.ReactNode; color?: string; bold?: boolean; size?: number; anchor?: "start" | "middle" | "end" }) {
  return <La x={x} y={y} size={size} color={color} bold={bold} anchor={anchor}>{children}</La>;
}
function Stroke({ d, c = INK, w = 2, dash }: { d: string; c?: string; w?: number; dash?: string }) {
  return <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />;
}
function Arrow({ x, y, to, c = INK }: { x: number; y: number; to: number; c?: string }) {
  const s = to > x ? 1 : -1;
  return <g><Stroke d={`M${x} ${y} H${to}`} c={c} /><Stroke d={`M${to - s * 7} ${y - 5} L${to} ${y} L${to - s * 7} ${y + 5}`} c={c} /></g>;
}
function Exon({ x, y, w = 68, n, alt = false }: { x: number; y: number; w?: number; n: number; alt?: boolean }) {
  return <g><rect x={x} y={y - 13} width={w} height={26} rx={3} fill={alt ? PALE.orange : PALE.blue} stroke={alt ? ORANGE : BLUE} strokeWidth={2} />
    {n>0 && <L x={x + w / 2} y={y + 7} bold color={alt ? ORANGE : BLUE}>{n}</L>}</g>;
}
function Primer({ x, y, right = true, c = GREEN, w = 33 }: { x: number; y: number; right?: boolean; c?: string; w?: number }) {
  return <Arrow x={right ? x : x + w} y={y} to={right ? x + w : x} c={c} />;
}
function Nucleosome({ x, y, acetyl = false, dnaY }: { x: number; y: number; acetyl?: boolean; dnaY?: number }) {
  return <g>{dnaY!==undefined&&<Stroke d={`M${x-37} ${dnaY-4} Q${x-28} ${dnaY-12} ${x-24} ${y+3} M${x+24} ${y+3} Q${x+28} ${dnaY-12} ${x+37} ${dnaY-4}`} c={BLUE} w={1.6} />}<ellipse cx={x} cy={y} rx={22} ry={16} fill={acetyl ? PALE.orange : PALE.purple} stroke={acetyl ? ORANGE : PURPLE} strokeWidth={1.8} />
    <Stroke d={`M${x - 25} ${y + 2} C${x - 24} ${y - 22} ${x + 26} ${y - 19} ${x + 24} ${y + 2} S${x - 20} ${y + 18} ${x - 24} ${y + 2}`} c={BLUE} />
    {acetyl && <g><Stroke d={`M${x - 8} ${y - 15} l-7 -12 M${x + 7} ${y - 15} l8 -12`} c={ORANGE} /><circle cx={x - 16} cy={y - 29} r={4} fill={ORANGE} /><circle cx={x + 16} cy={y - 29} r={4} fill={ORANGE} /></g>}</g>;
}
function Polymerase({ x, y }: { x: number; y: number }) {
  return <g><path d={`M${x - 33} ${y + 9} C${x - 52} ${y - 22} ${x - 24} ${y - 54} ${x - 4} ${y - 42} C${x + 26} ${y - 61} ${x + 48} ${y - 24} ${x + 30} ${y + 8} Q${x + 3} ${y + 28} ${x - 33} ${y + 9}Z`} fill={PALE.green} stroke={GREEN} strokeWidth={2.5} />
    <path d={`M${x - 23} ${y - 30} Q${x - 6} ${y - 45} ${x + 13} ${y - 32}`} fill="none" stroke="white" strokeWidth={5} />
    <L x={x} y={y - 4} color={GREEN} bold>Pol II</L></g>;
}

export function KineticCoupling() {
  const lane = (y: number, slow: boolean) => {
    const p = slow ? 419 : 580;
    return <g>
      <H x={116} y={y - 81} bold color={slow ? PURPLE : ORANGE}>{slow ? "התארכות איטית" : "התארכות מהירה"}</H>
      <H x={531} y={y - 81} color={slow ? PURPLE : ORANGE}>{slow ? "כרומטין דחוס" : "TSA → אצטילציה"}</H>
      <Stroke d={`M38 ${y - 3} H681 M38 ${y + 3} H681`} c={BLUE} w={1.4} />
      <Exon x={68} y={y} n={1} /><Exon x={278} y={y} n={2} alt /><Exon x={565} y={y} n={slow?3:0} />
      {!slow && <L x={628} y={y+40} color={BLUE}>3</L>}
      {[102, 312, 600].filter(x => Math.abs(p - x) > 48).map(x => <Nucleosome key={x} x={x} y={y - 42} dnaY={y} acetyl={!slow} />)}
      <Polymerase x={p} y={y} />
      <Arrow x={p + 42} y={y - 38} to={Math.min(680, p + (slow ? 75 : 99))} c={GREEN} />
      {/* CTD leaves the trailing face of the enzyme; factors sit on it, not on DNA. */}
      <Stroke d={`M${p - 30} ${y - 26} C${p - 85} ${y - 71} ${p - 61} ${y + 13} ${p - 104} ${y - 32}`} c={GREEN} w={3} />
      {[0,1,2].map(i => <circle key={i} cx={p - 55 - i * 15} cy={y - 37 + (i % 2) * 12} r={6} fill={PURPLE} stroke="white" strokeWidth={1} />)}
      <L x={p - 55} y={y - 51} size={20} color={GREEN}>CTD</L>
      <Stroke d={`M${p - 10} ${y + 18} C${p - 25} ${y + 70} ${p - 75} ${y + 25} ${p - 92} ${y + 66} H65`} c={ORANGE} w={2.5} />
      <Exon x={75} y={y + 66} n={1} w={57} /><Exon x={220} y={y + 66} n={2} alt w={57} />
      {!slow && <Exon x={443} y={y + 66} n={3} w={57} />}
      {slow && <g><path d={`M165 ${y + 52} q-9 -18 8 -22 q9 -14 21 -5 q18 -7 23 10 q10 15 -8 20Z`} fill={PALE.purple} stroke={PURPLE} strokeWidth={2} />
        <circle cx={189} cy={y + 42} r={5} fill={PURPLE} /><H x={130} y={y + 113} color={PURPLE}>ספלייסוזום מתארגן</H></g>}
      <Stroke d={`M133 ${y + 61} Q${slow ? 175 : 283} ${y + 18} ${slow ? 220 : 443} ${y + 61}`} c={PURPLE} dash={slow ? undefined : "5 5"} />
      <H x={514} y={y + 111} bold color={slow ? PURPLE : ORANGE}>{slow ? "חלון ארוך → הכללה" : "חלון קצר → דילוג"}</H>
    </g>;
  };
  return <Canvas mobile="kinetic-coupling" h={700} label="צימוד קינטי: אותו גן בשתי מהירויות; CTD מגייס גורמי שחבור ומשך החלון משפיע על זיהוי אקסון חלופי.">
    <H x={360} y={31} bold size={26}>הזמן לזיהוי האקסון החלופי</H>
    <H x={298} y={66} color={ORANGE}>אתר 3′ חלש לפני אקסון 2</H>
    <H x={565} y={96} color={BLUE}>אתר 3′ חזק לפני אקסון 3</H>
    {lane(215, true)}{lane(475, false)}
    <circle cx={52} cy={624} r={6} fill={PURPLE} /><H x={197} y={631}>גורמי שחבור על הזנב</H>
    <H x={528} y={631}>המספרים מציינים אקסונים</H>
    <H x={360} y={673} color={MUTED}>מודל של זיהוי אתר חלש; השפעת ההאטה תלויה בגן ובגורמים</H>
  </Canvas>;
}

const gaussian = (x: number, mu: number, sd: number) => Math.exp(-0.5 * ((x - mu) / sd) ** 2);
const pointsPath = (points: [number, number][]) => points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");

export function EveStripe2() {
  const gx = (t: number) => 82 + t * 555;
  const curves = [
    { name: "Bicoid", c: BLUE, f: (t: number) => Math.exp(-3 * t) },
    { name: "Hunchback", c: GREEN, f: (t: number) => 0.79 / (1 + Math.exp((t - 0.48) * 18)) },
    { name: "Giant", c: RED, f: (t: number) => 0.84 * gaussian(t, 0.22, 0.06) + 0.7 * gaussian(t, 0.81, 0.065) },
    { name: "Krüppel", c: PURPLE, f: (t: number) => 0.93 * gaussian(t, 0.56, 0.065) },
  ];
  return <Canvas mobile="eve-stripe2" h={710} label="עובר סינציטיאלי, קדמה משמאל; מפלי גורמים מגבילים את פס eve 2. מגביר בן כ־500 זוגות בסיסים נושא אתרי מפעילים ומדכאים ומפעיל lacZ.">
    <H x={360} y={32} size={26} bold>פס אחד מתוך שילוב של ארבעה גורמים</H>
    <H x={82} y={76}>קדמי</H><H x={635} y={76}>אחורי</H>
    <path d="M79 155 C52 102 150 93 317 97 C527 80 641 104 659 149 C638 203 502 222 309 210 C159 220 71 198 79 155Z" fill="#fff7ed" stroke={ORANGE} strokeWidth={2.2} />
    {/* A thin stripe follows the curved egg contour. Nuclei share one cytoplasm. */}
    <path d="M278 98 Q291 151 281 211 L309 211 Q319 153 306 97Z" fill={BLUE} opacity={0.7} />
    {Array.from({ length: 30 }, (_, i) => {
      const a = i * Math.PI * 2 / 30;
      return <ellipse key={i} cx={367 + 262 * Math.cos(a)} cy={155 + 42 * Math.sin(a)} rx={5} ry={7} fill={PURPLE} opacity={0.65} />;
    })}
    <L x={294} y={245} color={BLUE} bold>eve · פס 2</L>
    <H x={523} y={245} color={MUTED}>גרעינים ללא מחיצות תא</H>
    <H x={186} y={280}>ריכוז יחסי</H><H x={593} y={280}>מיקום בעובר</H>
    <rect x={gx(0.345)} y={295} width={gx(0.415) - gx(0.345)} height={135} fill={PALE.blue} />
    <Stroke d="M82 295 V430 H638" c={MUTED} />
    {curves.map(c => <Stroke key={c.name} d={pointsPath(Array.from({ length: 121 }, (_, i) => { const t = i / 120; return [gx(t), 428 - c.f(t) * 123]; }))} c={c.c} w={3} />)}
    {curves.map((c, i) => <g key={c.name}><rect x={49 + i * 174} y={452} width={12} height={12} fill={c.c} /><L x={120 + i * 174} y={465} color={c.c} size={20}>{c.name}</L></g>)}
    <H x={200} y={498} color={GREEN}>כחול וירוק: מפעילים</H><H x={546} y={498} color={RED}>אדום וסגול: מדכאים</H>
    <H x={254} y={540} bold>מגביר פס 2 · כ־500 זוגות בסיסים</H>
    <Stroke d="M39 594 H676" c={INK} w={2.5} />
    {[{x:59,c:BLUE},{x:145,c:GREEN},{x:233,c:BLUE},{x:323,c:BLUE},{x:408,c:GREEN}].map((s,i) => <rect key={i} x={s.x} y={573} width={38} height={15} rx={3} fill={s.c} />)}
    {[{x:83,c:RED},{x:243,c:PURPLE},{x:370,c:RED}].map((s,i) => <rect key={i} x={s.x} y={596} width={38} height={15} rx={3} fill={s.c} />)}
    <Stroke d="M464 576 V555 H528" c={INK} /><Arrow x={509} y={555} to={532} />
    <rect x={542} y={578} width={126} height={32} rx={3} fill={PALE.blue} stroke={BLUE} strokeWidth={2} /><L x={604} y={601} bold color={BLUE}>lacZ</L>
    <H x={191} y={650}>חלק מהאתרים חופפים</H><H x={563} y={650}>פרומוטור וגן מדווח</H>
    <H x={360} y={691} color={MUTED}>מיקומי האתרים וצורות המפלים להמחשה; אינם מפה ניסויית</H>
  </Canvas>;
}

export function QpcrAmplification() {
  // A logistic saturation model is asymptotically A*2^cycle at low fluorescence.
  // F=A*2^c/(1+A*2^c); threshold=0.1; A=2^-Ct/9.
  // Tenfold A changes Ct by log2(10), exactly in this model.
  const threshold = 0.1, ct = [20, 20 + Math.log2(10), 20 + 2 * Math.log2(10)];
  const x = (c: number) => 82 + c * 14.6, y = (f: number) => 451 - f * 303;
  const colors = [BLUE, GREEN, ORANGE];
  return <Canvas mobile="qpcr-amplification" h={650} label="עקומות הגברה מחושבות לשלוש כמויות התחלה בהפרש פי עשרה. סף פלואורסצנציה אחיד נותן Ct במרווח log2(10), כ־3.32 מחזורים.">
    <H x={360} y={32} size={26} bold>יותר תבנית → חציית סף מוקדמת</H>
    <H x={268} y={80}>פלואורסצנציה · יחידות יחסיות</H>
    <H x={585} y={124} color={MUTED}>רוויה</H>
    <Stroke d="M82 136 V451 H666" />
    {[0,0.5,1].map(v => <g key={v}><Stroke d={`M75 ${y(v)} H82`} /><L x={60} y={y(v) + 7} anchor="end">{v.toFixed(1)}</L></g>)}
    {[0,10,20,30,40].map(v => <g key={v}><Stroke d={`M${x(v)} 451 V458`} /><L x={x(v)} y={486}>{v}</L></g>)}
    <Stroke d={`M82 ${y(threshold)} H667`} c={PURPLE} dash="7 5" />
    <H x={166} y={y(threshold) - 15} color={PURPLE}>סף אחיד</H>
    {ct.map((c, i) => {
      const a = 2 ** -c / 9;
      const f = (cycle: number) => { const v = a * 2 ** cycle; return v / (1 + v); };
      return <g key={c}><Stroke d={pointsPath(Array.from({ length: 241 }, (_, j) => [x(j / 6), y(f(j / 6))]))} c={colors[i]} w={3.2} />
        <Stroke d={`M${x(c)} ${y(threshold) + 7} V449`} c={colors[i]} dash="3 3" />
        <circle cx={x(c)} cy={y(threshold)} r={5} fill={colors[i]} />
        <L x={149+i*207} y={535} color={colors[i]} bold size={20}>{`Ct = ${c.toFixed(2)}`}</L>
      </g>;
    })}
    <H x={654} y={512}>מחזור</H>
    {["100×", "10×", "1×"].map((a,i) => <g key={a}><rect x={98+i*202} y={565} width={18} height={10} rx={3} fill={colors[i]} /><L x={167+i*202} y={580} color={colors[i]} bold>{a}</L></g>)}
    <H x={360} y={624}>כמויות התחלה יחסיות · הפרש של כ־3.32 מחזורים לכל פי 10</H>
  </Canvas>;
}

export function ExonPrimers() {
  const gene = (y: number) => <g><Stroke d={`M58 ${y} H515`} c={MUTED} /><Exon x={67} y={y} w={100} n={1} /><Exon x={282} y={y} w={100} n={2} alt /><Exon x={415} y={y} w={100} n={3} /></g>;
  return <Canvas mobile="exon-primers" h={710} label="פריימרים סביב שלושה אקסונים: זוגות בתוך כל אקסון, זוג אינטרוני, זוג מאגף ושני תוצרי ג׳ל, ופריימר חוצה צומת על cDNA משוחבר.">
    <H x={360} y={32} size={26} bold>המיקום קובע איזה RNA מודדים</H>
    <H x={337} y={78} color={ORANGE}>אקסון 2 חלופי</H>
    <L x={71} y={93} color={MUTED}>DNA</L>{gene(124)}
    <H x={224} y={151} color={MUTED}>אינטרון</H>
    <H x={274} y={198} color={GREEN}>זוג בכל אקסון: כמות יחסית של האקסון</H>
    {[76,290,423].map(x => <g key={x}><Primer x={x} y={222} w={28} /><Primer x={x+53} y={222} right={false} w={28} /></g>)}
    <Stroke d="M80 235 V246 H505 V235" c={GREEN} />
    <H x={269} y={286} color={PURPLE}>זוג אינטרוני: קדם־תעתיק או אינטרון שנשמר</H>
    <Primer x={188} y={309} c={PURPLE} w={28} /><Primer x={243} y={309} c={PURPLE} right={false} w={28} />
    <H x={280} y={354} color={BLUE}>זוג מאגף באקסונים 1 ו־3</H>
    <Primer x={83} y={380} c={BLUE} /><Primer x={465} y={380} c={BLUE} right={false} />
    <Stroke d="M118 380 H463" c={BLUE} dash="4 5" />
    <Arrow x={527} y={381} to={558} c={BLUE} />
    <rect x={574} y={305} width={110} height={183} rx={8} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={2} />
    <rect x={603} y={321} width={52} height={7} fill="#94a3b8" />
    <rect x={603} y={370} width={52} height={7} rx={2} fill={BLUE} />
    <rect x={603} y={437} width={52} height={7} rx={2} fill={ORANGE} />
    <H x={628} y={288} bold>ג׳ל</H>
    <H x={630} y={406} size={20} color={BLUE}>הכללה</H><H x={630} y={473} size={20} color={ORANGE}>דילוג</H>
    <H x={281} y={427}>ארוך: אקסונים 1–2–3</H><H x={281} y={462}>קצר: אקסונים 1–3</H>
    <H x={360} y={517} bold color={TEAL}>פריימר חוצה צומת — רק בתעתיק משוחבר</H>
    <L x={78} y={567} color={MUTED}>cDNA</L>
    <Exon x={149} y={560} n={1} w={153} /><Exon x={302} y={560} n={2} w={153} alt /><Exon x={455} y={560} n={3} w={130} />
    <Primer x={279} y={597} c={TEAL} w={49} /><Primer x={397} y={597} c={TEAL} right={false} />
    <Stroke d="M302 580 V587" c={TEAL} />
    <H x={357} y={638} color={TEAL}>קצה הפריימר משלים רצף משני צדי הצומת</H>
    <H x={360} y={688} color={MUTED}>זוגות חלופיים לניסויים נפרדים; נדרשות בקרות ללא RT</H>
  </Canvas>;
}

export function VolcanoPlot() {
  // Deterministic illustrative cloud, not a statistical test of simulated replicates.
  // For i=0..159: x=3.65*sin(2.399963*i)*sqrt((i+1)/160).
  // z=max(0.08, .2+.76*abs(x)+1.3*sin(1.71*i)); p=10^-z.
  const data = Array.from({ length: 160 }, (_, i) => {
    const fc = 3.65 * Math.sin(i * 2.399963) * Math.sqrt((i + 1) / 160);
    const z = Math.max(0.08, 0.2 + 0.76 * Math.abs(fc) + 1.3 * Math.sin(i * 1.71));
    return { fc, p: 10 ** -z };
  });
  const x = (v: number) => 368 + v * 73, y = (v: number) => 447 - v * 65;
  const pCut = -Math.log10(0.05);
  const examples = [{ fc: 2.7, z: 4.45, s: "A", c: RED }, { fc: 3.1, z: 0.55, s: "B", c: MUTED }, { fc: 0.18, z: 4.5, s: "C", c: PURPLE }];
  return <Canvas mobile="volcano-plot" h={705} label="Volcano plot מנתונים להמחשה. מובהקות ושינוי בגודל שניים הם תנאים נפרדים; שלוש נקודות דוגמה מדגישות זאת.">
    <H x={360} y={32} size={26} bold>גודל השינוי ומובהקות הם שני צירים</H>
    <L x={97} y={84} bold>−log₁₀ p</L>
    <H x={205} y={119} color={BLUE} bold>ירידה מובהקת</H><H x={558} y={119} color={RED} bold>עלייה מובהקת</H>
    <rect x={76} y={137} width={219} height={y(pCut) - 137} fill="#eff6ff" />
    <rect x={441} y={137} width={219} height={y(pCut) - 137} fill="#fff1f2" />
    <Stroke d="M76 132 V447 H660" />
    {[0,1,2,3,4].map(v => <g key={v}><Stroke d={`M69 ${y(v)} H76`} /><L x={56} y={y(v)+7}>{v}</L></g>)}
    {[-4,-2,0,2,4].map(v => <g key={v}><Stroke d={`M${x(v)} 447 V454`} /><L x={x(v)} y={480}>{v}</L></g>)}
    <Stroke d={`M${x(-1)} 137 V447 M${x(1)} 137 V447 M76 ${y(pCut)} H660`} c={MUTED} dash="5 5" w={1.5} />
    {data.map((v,i) => <circle key={i} cx={x(v.fc)} cy={y(-Math.log10(v.p))} r={3.4} fill={v.p < 0.05 && Math.abs(v.fc) > 1 ? v.fc > 0 ? RED : BLUE : "#94a3b8"} opacity={0.8} />)}
    {examples.map(v => <g key={v.s}><circle cx={x(v.fc)} cy={y(v.z)} r={6.5} fill="white" stroke={v.c} strokeWidth={2.8} /><L x={x(v.fc)+17} y={y(v.z)-11} color={v.c} bold>{v.s}</L></g>)}
    <L x={368} y={517} bold>log₂(FC) · B/A</L>
    <L x={360} y={554} color={MUTED}>|log₂FC| &gt; 1     ·     p &lt; 0.05</L>
    <H x={360} y={593} color={RED}>A — שינוי גדול וגם מובהק</H>
    <H x={360} y={630} color={MUTED}>B — שינוי גדול, ללא מובהקות</H>
    <H x={360} y={667} color={PURPLE}>C — מובהקות גבוהה, שינוי קטן</H>
    <H x={360} y={699} size={20} color={MUTED}>הספים להדגמה; בניתוח גנומי יש לתקן לריבוי בדיקות</H>
  </Canvas>;
}

export function TurnoverScatter() {
  // Equal 1-hour pulse at steady state, complete labeling and matched read scaling.
  // f_new=1-exp(-k*t), t=1 h, k=ln(2)/halfLife; new=total*f_new.
  const x = (v: number) => 88 + v * 0.54, y = (v: number) => 477 - v * 0.36;
  const data = Array.from({ length: 120 }, (_, i) => {
    const total = 30 + ((i * 173) % 950), halfLife = 0.22 + ((i * 37) % 140) / 7;
    return { total, fresh: total * (1 - Math.exp(-Math.LN2 / halfLife)) };
  });
  return <Canvas mobile="turnover-scatter" h={690} label="קריאות חדשות מול כלל הקריאות, מחושבות מסימון במשך שעה במצב יציב. שני גנים עם אותו סך קריאות שונים בשיעור ה-RNA החדש ובזמן מחצית החיים.">
    <H x={360} y={32} size={26} bold>אותה כמות כוללת, תחלופה שונה</H>
    <H x={181} y={82}>קריאות חדשות</H><L x={565} y={82} color={MUTED}>t = 1 h</L>
    <Stroke d="M88 111 V477 H650" />
    {[0,500,1000].map(v => <g key={v}><Stroke d={`M81 ${y(v)} H88 M${x(v)} 477 V484`} /><L x={65} y={y(v)+7} anchor="end">{v}</L><L x={x(v)} y={513}>{v}</L></g>)}
    <Stroke d={`M${x(0)} ${y(0)} L${x(1000)} ${y(1000)}`} c={MUTED} dash="6 5" />
    <L x={390} y={127} color={MUTED}>y = x</L><H x={391} y={156} color={MUTED}>גבול עליון</H>
    {data.map((d,i) => <circle key={i} cx={x(d.total)} cy={y(d.fresh)} r={3.3} fill={TEAL} opacity={0.55} />)}
    <Stroke d={`M${x(700)} ${y(0)} V${y(630)}`} c={ORANGE} dash="3 5" />
    <circle cx={x(700)} cy={y(630)} r={7} fill={RED} stroke="white" strokeWidth={2} />
    <circle cx={x(700)} cy={y(70)} r={7} fill={BLUE} stroke="white" strokeWidth={2} />
    <H x={553} y={230} color={RED} bold>90% חדש</H>
    <H x={558} y={412} color={BLUE} bold>10% חדש</H>
    <H x={406} y={555}>כלל הקריאות</H>
    <H x={360} y={599} color={RED}>ליד האלכסון: תחלופה מהירה · פחות יציב</H>
    <H x={360} y={634} color={BLUE}>ליד ציר X: תחלופה איטית · יציב יותר</H>
    <H x={360} y={676} color={MUTED}>הפרשנות מניחה מצב יציב ואותו משך ויעילות סימון</H>
  </Canvas>;
}

function Track({ y, f, c, x0 = 180, x1 = 680, h = 38 }: { y: number; f: (x: number) => number; c: string; x0?: number; x1?: number; h?: number }) {
  const pts: [number, number][] = Array.from({ length: 201 }, (_, i) => [x0+(x1-x0)*i/200, y - h * Math.max(0, f(i/200))]);
  return <g><path d={`${pointsPath(pts)} L${x1} ${y} L${x0} ${y}Z`} fill={c} opacity={0.8} /><Stroke d={`M${x0} ${y} H${x1}`} c="#cbd5e1" w={1} /></g>;
}

export function ChipSeqPeaks() {
  const stages = ["קיבוע", "קיטוע", "שיקוע", "שחרור", "ריצוף ומיפוי"];
  return <Canvas mobile="chip-seq-peaks" h={700} label="תהליך ChIP-seq ומסלולי input, שיא צר של גורם שעתוק, תחום רחב של סימן היסטוני ואזור דל נוקלאוזומים ליד TSS.">
    <H x={360} y={32} size={26} bold>מהחלבון הקשור אל האות בגנום</H>
    {stages.map((s,i) => {
      const x = 70+i*142;
      return <g key={s}><H x={x} y={79} bold>{s}</H>
        {i<4 && <Arrow x={x+46} y={137} to={x+91} c={MUTED} />}
        {i===0 && <g><Stroke d={`M${x-38} 145 H${x+38} M${x-38} 151 H${x+38}`} c={BLUE} /><path d={`M${x-22} 134 q-8 -21 13 -23 q15 -15 30 7 l-1 16Z`} fill={PALE.purple} stroke={PURPLE} strokeWidth={2} /><Stroke d={`M${x-8} 135 l12 9 m-12 0 l12 -9`} c={RED} /></g>}
        {i===1 && <g>{[-1,0,1].map(j=><Stroke key={j} d={`M${x-33} ${113+j*24} H${x+5+j*10}`} c={BLUE} w={3} />)}<circle cx={x-8} cy={103} r={10} fill={PURPLE} /></g>}
        {i===2 && <g><circle cx={x} cy={161} r={20} fill={PALE.orange} stroke={ORANGE} strokeWidth={2} /><Stroke d={`M${x} 143 V120 m0 4 l-16 -16 m16 16 l16 -16`} c={RED} w={4} /><circle cx={x-16} cy={102} r={9} fill={PURPLE} /><Stroke d={`M${x-38} 91 H${x+7}`} c={BLUE} w={3} /></g>}
        {i===3 && <g><Stroke d={`M${x-32} 135 H${x+34} M${x-32} 143 H${x+34}`} c={BLUE} /><H x={x} y={184} color={MUTED}>DNA נקי</H></g>}
        {i===4 && <g>{[0,1,2,3].map(j=><Stroke key={j} d={`M${x-39+j*7} ${108+j*15} h45`} c={BLUE} w={3} />)}</g>}
      </g>;
    })}
    <L x={354} y={214} color={RED}>נוגדן</L><H x={360} y={257} color={MUTED}>מסלולים מיושרים לאותו אזור בגנום</H>
    <L x={77} y={325}>input</L><Track y={333} c="#94a3b8" h={25} f={t=>0.2+0.12*Math.sin(t*30)**2} />
    <L x={75} y={395} color={PURPLE}>ChIP · TF</L><Track y={403} c={PURPLE} f={t=>0.04+0.95*gaussian(t,0.51,0.022)} />
    <L x={83} y={461} color={ORANGE}>H3K27me3</L><Track y={473} c={ORANGE} f={t=>0.05+0.8/(1+Math.exp(-(t-0.31)*45))/(1+Math.exp((t-0.87)*45))*(0.8+0.1*Math.sin(t*120))} />
    <H x={418} y={299} color={PURPLE}>שיא צר</H><H x={499} y={517} color={ORANGE}>תחום היסטוני רחב</H>
    <Stroke d="M181 598 H681" c={BLUE} />
    {[209,263,519,577,635].map(x=><Nucleosome key={x} x={x} y={589} />)}
    <Stroke d="M423 580 V554 H475" c={GREEN} /><Arrow x={453} y={554} to={478} c={GREEN} />
    <L x={423} y={548} color={GREEN}>TSS</L>
    <H x={360} y={643} color={TEAL}>אזור דל נוקלאוזומים לפני אתר תחילת השעתוק</H>
    <H x={360} y={685} color={MUTED}>התחום הרחב והשיא הצר הם דוגמאות חלופיות לאות ChIP</H>
  </Canvas>;
}

export function GenomeBrowserTracks() {
  // Illustrative liver tracks for browser-read. Coordinates are the lesson's,
  // not a real locus: gene K 100–130 kb on minus; enhancer centered at 150 kb.
  const x = (kb: number) => 187 + (kb - 95) * 8.6;
  const exon = (a: number, b: number) => (t: number) => { const kb=95+t*60; return kb>=a&&kb<=b ? 0.65+0.13*Math.sin(kb*23)**2 : 0; };
  const expr = (t: number) => exon(100,104)(t)+exon(112,115)(t)+exon(125,130)(t);
  const promoter = (t: number) => gaussian(95+t*60,129.2,1.15);
  const enhancer = (t: number) => gaussian(95+t*60,150,1.3);
  return <Canvas mobile="genome-browser-tracks" h={700} label="דפדפן גנומי להמחשת תאי כבד: גן K בגדיל השלילי מ־100 עד 130 אלף, TSS מימין, ומגביר ב־150 אלף במעלה הזרם. RNA-seq, סימני היסטונים, שימור ואי CpG.">
    <H x={360} y={32} size={26} bold>גן בגדיל השלילי: ההתחלה בצד ימין</H>
    <H x={360} y={72}>תאי כבד · הדוגמה בתרגיל</H>
    <L x={80} y={114} color={MUTED}>kb</L>
    <Stroke d={`M${x(95)} 124 H${x(155)}`} c={MUTED} />
    {[100,110,120,130,140,150].map(k=><g key={k}><Stroke d={`M${x(k)} 117 V130`} c={MUTED} /><L x={x(k)} y={108}>{k}</L></g>)}
    <rect x={x(148)} y={149} width={x(152)-x(148)} height={454} fill="#fff7ed" />
    <L x={81} y={179} bold>K (−)</L><Stroke d={`M${x(100)} 172 H${x(130)}`} c={BLUE} />
    {[106,109,118,121,123].map(k=><Arrow key={k} x={x(k)+5} y={172} to={x(k)-4} c={BLUE} />)}
    <rect x={x(100)} y={167} width={x(101.5)-x(100)} height={10} fill={BLUE} />
    <rect x={x(101.5)} y={160} width={x(104)-x(101.5)} height={24} fill={BLUE} />
    <rect x={x(112)} y={160} width={x(115)-x(112)} height={24} fill={BLUE} />
    <rect x={x(125)} y={160} width={x(128)-x(125)} height={24} fill={BLUE} />
    <rect x={x(128)} y={167} width={x(130)-x(128)} height={10} fill={BLUE} />
    <Stroke d={`M${x(130)} 197 V215 H${x(127)}`} c={GREEN} /><Arrow x={x(129)} y={215} to={x(126.5)} c={GREEN} />
    <L x={x(133)} y={220} color={GREEN} bold>TSS</L>
    {[
      {n:"RNA-seq",y:285,c:BLUE,f:expr},
      {n:"H3K4me3",y:351,c:PURPLE,f:promoter},
      {n:"H3K27ac",y:417,c:ORANGE,f:(t:number)=>0.85*promoter(t)+0.95*enhancer(t)},
      {n:"H3K4me1",y:483,c:TEAL,f:(t:number)=>0.1*promoter(t)+enhancer(t)},
      {n:"שימור",y:549,c:"#475569",f:(t:number)=>0.72*expr(t)+0.8*enhancer(t)},
    ].map(tr=><g key={tr.n}>{tr.n==="שימור"?<H x={83} y={tr.y-7}>{tr.n}</H>:<L x={83} y={tr.y-7} color={tr.c}>{tr.n}</L>}<Track y={tr.y} c={tr.c} f={tr.f} x0={x(95)} x1={x(155)} h={39} /></g>)}
    <L x={82} y={590} color={GREEN}>CpG</L><Stroke d={`M${x(95)} 590 H${x(155)}`} c="#cbd5e1" w={1} />
    <rect x={x(128)} y={582} width={x(131)-x(128)} height={16} rx={2} fill={GREEN} />
    <H x={316} y={636} color={GREEN}>פרומוטור פעיל</H><H x={602} y={636} color={ORANGE}>מגביר פעיל</H>
    <H x={360} y={681} color={MUTED}>מימין: במעלה הזרם · המגביר במרחק 20 אלף בסיסים מה־TSS</H>
  </Canvas>;
}

const PWM = [
  [0.94,0.02,0.02,0.02], [0.02,0.02,0.94,0.02], [0.04,0.08,0.83,0.05],
  [0.1,0.1,0.2,0.6], [0.05,0.86,0.05,0.04], [0.82,0.06,0.06,0.06],
  [0.4,0.2,0.2,0.2], [0.25,0.25,0.25,0.25],
] as const;
const BASE_PATHS = [
  "M0 100 L11 0 H21 L32 100 H22 L19 76 H12 L9 100Z M14 58 H18 L16 30Z",
  "M32 0 H0 V100 H32 V80 H11 V20 H32Z",
  "M32 0 H0 V100 H32 V47 H17 V66 H22 V80 H11 V20 H32Z",
  "M0 0 H32 V21 H21 V100 H11 V21 H0Z",
];
function LogoStack({ ps, x, y, bitHeight=97, width=32 }: {ps: readonly number[]; x:number; y:number; bitHeight?:number; width?:number}) {
  const info=2+ps.reduce((s,p)=>s+(p>0?p*Math.log2(p):0),0),colors=[GREEN,BLUE,ORANGE,RED];
  const sorted=ps.map((p,j)=>({p,j})).sort((a,b)=>a.p-b.p);
  return <g>{sorted.map(({p,j},i)=>{
    const height=p*info*bitHeight, top=y-sorted.slice(0,i+1).reduce((s,d)=>s+d.p*info*bitHeight,0);
    return height<0.05?null:<path key={j} d={BASE_PATHS[j]} transform={`translate(${x-width/2} ${top}) scale(${width/32} ${height/100})`} fill={colors[j]} fillRule="evenodd"><title>{`${["A","C","G","T"][j]}: p=${p}, ${(p*info).toFixed(3)} bits`}</title></path>;
  })}</g>;
}
export function MotifLogo() {
  // Shannon logo, uniform DNA background, without small-sample correction:
  // H=-sum(p*log2(p)), R=2-H, letter height=p*R bits.
  return <Canvas mobile="motif-logo" h={590} label="לוגו רצף מחושב ממטריצת הסתברויות: גובה הערימה הוא מידע בביטים וגובה כל אות הוא ההסתברות שלה כפול המידע. חזרה ישירה של שני חצאי אתר עם מרווח של שני בסיסים.">
    <H x={360} y={32} size={26} bold>מוטיב: אילו עמדות מחייבות ואילו גמישות?</H>
    <H x={234} y={83} bold>לוגו רצף מחושב</H><H x={565} y={83} bold>קולטן גרעיני כדימר</H>
    <L x={48} y={125}>bits</L>
    <Stroke d="M72 141 V350 H407" />
    {[0,1,2].map(v=><g key={v}><Stroke d={`M66 ${350-v*97} H72`} /><L x={48} y={357-v*97}>{v}</L></g>)}
    {PWM.map((ps,i)=><g key={i}><LogoStack ps={ps} x={90+i*41} y={350} /><L x={90+i*41} y={382}>{i+1}</L></g>)}
    <Stroke d="M90 398 V414 M377 398 V414" c={MUTED} />
    <H x={121} y={446} color={GREEN}>שמור</H><H x={355} y={446} color={MUTED}>גמיש</H>
    <path d="M455 196 Q455 155 481 156 Q511 153 511 196 L500 212 H467Z" fill={PALE.purple} stroke={PURPLE} strokeWidth={2} />
    <path d="M591 196 Q591 155 617 156 Q647 153 647 196 L636 212 H603Z" fill={PALE.purple} stroke={PURPLE} strokeWidth={2} />
    <Stroke d="M511 178 Q552 151 591 178" c={PURPLE} w={3} />
    <Stroke d="M436 250 H685 M436 257 H685" c={BLUE} />
    <L x={483} y={239} size={21} bold>AGGTCA</L><L x={552} y={239} color={MUTED} size={21}>nn</L><L x={620} y={239} size={21} bold>AGGTCA</L>
    <Arrow x={441} y={281} to={525} c={PURPLE} /><Arrow x={578} y={281} to={663} c={PURPLE} />
    <H x={483} y={320} color={PURPLE}>חצי אתר</H><H x={622} y={320} color={PURPLE}>חצי אתר</H>
    <Stroke d="M540 268 V342 H566 V268" c={MUTED} w={1.5} />
    <H x={558} y={381}>מרווח: 2 בסיסים</H>
    <L x={561} y={440} color={PURPLE} bold>DR2</L>
    <L x={360} y={505} color={MUTED}>R = 2 − H     ·     h(letter) = p × R</L>
    <H x={360} y={550} color={MUTED}>הצבע מזהה בסיס; הכיוון והמרווח בין חצאי האתר משפיעים על הקישור</H>
    <H x={360} y={582} color={MUTED}>המטריצה להמחשה; אינה מדידה של קולטן מסוים</H>
  </Canvas>;
}

/* Dedicated narrow layouts retain the biological relationships and computed data.
   They are displayed only below 641 CSS pixels; desktop remains one composition. */
function MobileFigure({id,label}:{id:string;label:string}) {
  let h=800,body:React.ReactNode;
  if(id==="kinetic-coupling") {
    h=910;
    const lane=(y:number,slow:boolean)=>{
      const p=slow?332:421;
      return <g><H x={240} y={y-111} bold size={24} color={slow?PURPLE:ORANGE}>{slow?"איטי · כרומטין דחוס":"מהיר · אצטילציה בעקבות TSA"}</H>
        <Stroke d={`M26 ${y-3} H454 M26 ${y+3} H454`} c={BLUE} w={1.4} />
        <Exon x={40} y={y} n={1} w={60} /><Exon x={191} y={y} n={2} alt w={60} /><Exon x={357} y={y} n={slow?3:0} w={60} />
        {!slow&&<L x={370} y={y+36} color={BLUE}>3</L>}
        {[70,221].map(x=><Nucleosome key={x} x={x} y={y-43} dnaY={y} acetyl={!slow} />)}
        <Polymerase x={p} y={y} />
        <Stroke d={`M${p-30} ${y-26} Q${p-66} ${y-69} ${p-95} ${y-20}`} c={GREEN} w={3} />
        <L x={p-72} y={y-66} color={GREEN}>CTD</L>
        {[0,1,2].map(i=><circle key={i} cx={p-49-i*14} cy={y-38+(i%2)*7} r={5} fill={PURPLE} />)}
        <Stroke d={`M${p-10} ${y+18} Q${p-20} ${y+75} ${p-67} ${y+65} H38`} c={ORANGE} w={2.5} />
        <Exon x={40} y={y+65} n={1} w={51} /><Exon x={193} y={y+65} n={2} alt w={51} />
        {!slow&&<Exon x={354} y={y+65} n={3} w={51} />}
        <Stroke d={`M92 ${y+61} Q${slow?143:220} ${y+14} ${slow?192:353} ${y+61}`} c={PURPLE} dash={slow?undefined:"5 5"} />
        {slow&&<path d={`M143 ${y+42} q-16 -18 0 -26 q15 -14 25 0 q16 12 1 27Z`} fill={PALE.purple} stroke={PURPLE} strokeWidth={2} />}
        <H x={240} y={y+115} color={slow?PURPLE:ORANGE} bold>{slow?"חלון ארוך → הכללת אקסון 2":"חלון קצר → דילוג על אקסון 2"}</H>
      </g>;
    };
    body=<><H x={240} y={33} bold size={24}>חלון הזדמנויות לשחבור</H>
      <H x={240} y={73} color={ORANGE}>לפני אקסון 2: אתר 3′ חלש</H>
      <H x={240} y={107} color={BLUE}>לפני אקסון 3: אתר 3′ חזק</H>
      {lane(258,true)}{lane(598,false)}
      <H x={240} y={784} color={PURPLE}>סגול: גורמי שחבור וספלייסוזום</H>
      <H x={240} y={820} color={GREEN}>CTD: משטח גיוס על Pol II</H>
      <H x={240} y={859} color={MUTED}>נוקלאוזומים עשויים להאט התארכות</H>
      <H x={240} y={894} color={MUTED}>כיוון ההשפעה תלוי בגן ובגורמים</H></>;
  } else if(id==="eve-stripe2") {
    h=890;const x=(t:number)=>50+380*t;
    const cs=[{n:"Bicoid",c:BLUE,f:(t:number)=>Math.exp(-3*t)}, {n:"Hunchback",c:GREEN,f:(t:number)=>0.79/(1+Math.exp((t-.48)*18))}, {n:"Giant",c:RED,f:(t:number)=>.84*gaussian(t,.22,.06)+.7*gaussian(t,.81,.065)}, {n:"Krüppel",c:PURPLE,f:(t:number)=>.93*gaussian(t,.56,.065)}];
    body=<><H x={240} y={33} bold size={24}>פס 2: שילוב מפעילים ומדכאים</H>
      <H x={61} y={86}>קדמי</H><H x={420} y={86}>אחורי</H>
      <path d="M40 153 C37 106 139 105 237 108 C350 98 431 118 441 152 C432 197 350 210 237 206 C129 213 40 193 40 153Z" fill="#fff7ed" stroke={ORANGE} strokeWidth={2} />
      <path d="M181 108 Q193 154 184 206 H204 Q213 154 201 108Z" fill={BLUE} opacity={.7} />
      {Array.from({length:26},(_,i)=>{const a=i*Math.PI*2/26;return <ellipse key={i} cx={241+182*Math.cos(a)} cy={157+36*Math.sin(a)} rx={4} ry={6} fill={PURPLE} opacity={.65} />;})}
      <L x={191} y={245} bold color={BLUE}>eve · פס 2</L><H x={240} y={283}>גרעינים בציטופלסמה משותפת</H>
      <H x={133} y={326}>ריכוז יחסי</H>
      <rect x={x(.345)} y={346} width={x(.415)-x(.345)} height={150} fill={PALE.blue} />
      <Stroke d="M50 344 V496 H431" c={MUTED} />
      {cs.map(c=><Stroke key={c.n} d={pointsPath(Array.from({length:121},(_,i)=>[x(i/120),494-c.f(i/120)*142]))} c={c.c} w={3} />)}
      <H x={240} y={533}>מיקום לאורך העובר</H>
      {cs.map((c,i)=><g key={c.n}><rect x={34+i%2*235} y={557+Math.floor(i/2)*40} width={12} height={12} fill={c.c} /><L x={132+i%2*235} y={572+Math.floor(i/2)*40} color={c.c}>{c.n}</L></g>)}
      <H x={240} y={658}>כחול וירוק: הפעלה · אדום וסגול: דיכוי</H>
      <H x={240} y={705} bold>מגביר פס 2 · כ־500 זוגות בסיסים</H>
      <Stroke d="M23 757 H453" />
      {[{x:39,c:BLUE},{x:103,c:GREEN},{x:167,c:BLUE},{x:229,c:GREEN}].map(s=><rect key={s.x} x={s.x} y={735} width={32} height={15} rx={3} fill={s.c} />)}
      {[{x:59,c:RED},{x:180,c:PURPLE}].map(s=><rect key={s.x} x={s.x} y={759} width={32} height={15} rx={3} fill={s.c} />)}
      <Stroke d="M285 738 V718 H328" /><Arrow x={308} y={718} to={333} />
      <rect x={346} y={741} width={102} height={32} fill={PALE.blue} stroke={BLUE} strokeWidth={2} /><L x={397} y={765} color={BLUE} bold>lacZ</L>
      <H x={240} y={815}>אתרים חופפים; פרומוטור וגן מדווח מימין</H>
      <H x={240} y={860} color={MUTED}>המפלים ומיקומי האתרים להמחשה</H></>;
  } else if(id==="qpcr-amplification") {
    h=740;const x=(c:number)=>67+c*9.5,y=(v:number)=>443-v*297,colors=[BLUE,GREEN,ORANGE];
    body=<><H x={240} y={33} size={24} bold>יותר תבנית → סף מוקדם</H><H x={240} y={80}>פלואורסצנציה · יחידות יחסיות</H>
      <Stroke d="M67 134 V443 H447" />
      {[0,.5,1].map(v=><g key={v}><Stroke d={`M61 ${y(v)} H67`} /><L x={44} y={y(v)+7}>{v.toFixed(1)}</L></g>)}
      {[0,10,20,30,40].map(v=><g key={v}><Stroke d={`M${x(v)} 443 V450`} /><L x={x(v)} y={478}>{v}</L></g>)}
      <Stroke d={`M67 ${y(.1)} H448`} c={PURPLE} dash="6 5" /><H x={118} y={y(.1)-15} color={PURPLE}>סף אחיד</H>
      {[20,20+Math.log2(10),20+2*Math.log2(10)].map((c,i)=>{
        const a=2**-c/9,f=(n:number)=>a*2**n/(1+a*2**n);
        return <g key={c}><Stroke d={pointsPath(Array.from({length:241},(_,j)=>[x(j/6),y(f(j/6))]))} c={colors[i]} w={3} /><circle cx={x(c)} cy={y(.1)} r={5} fill={colors[i]} /><Stroke d={`M${x(c)} ${y(.1)+7} V442`} c={colors[i]} dash="3 3" />
          <L x={240} y={563+i*43} color={colors[i]} bold>{["100×","10×","1×"][i]+"     Ct = "+c.toFixed(2)}</L></g>;
      })}<H x={381} y={515}>מחזור</H><H x={240} y={697}>פי 10 בכמות ההתחלה</H><H x={240} y={732}>הפרש של כ־3.32 מחזורים</H></>;
  } else if(id==="exon-primers") {
    h=930;
    body=<><H x={240} y={33} size={24} bold>המיקום קובע איזה RNA מודדים</H>
      <H x={240} y={79} color={ORANGE}>אקסון 2 חלופי</H><Stroke d="M27 137 H453" c={MUTED} />
      <Exon x={36} y={137} w={91} n={1} /><Exon x={226} y={137} w={91} n={2} alt /><Exon x={359} y={137} w={91} n={3} />
      <H x={176} y={164} color={MUTED}>אינטרון</H>
      <H x={240} y={210} color={GREEN}>זוג בכל אקסון: כמות האקסון</H>
      {[43,233,366].map(x=><g key={x}><Primer x={x} y={239} w={26} /><Primer x={x+39} y={239} right={false} w={26} /></g>)}
      <H x={240} y={292} color={PURPLE}>זוג אינטרוני: קדם־תעתיק</H><Primer x={147} y={323} c={PURPLE} w={25} /><Primer x={193} y={323} c={PURPLE} w={25} right={false} />
      <H x={240} y={376} color={BLUE}>זוג מאגף באקסונים 1 ו־3</H>
      <Primer x={50} y={407} c={BLUE} /><Primer x={394} y={407} c={BLUE} right={false} /><Stroke d="M87 407 H391" c={BLUE} dash="4 5" />
      <rect x={318} y={445} width={117} height={156} rx={6} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={2} />
      <rect x={346} y={458} width={58} height={6} fill="#94a3b8" /><rect x={346} y={495} width={58} height={7} fill={BLUE} /><rect x={346} y={563} width={58} height={7} fill={ORANGE} />
      <H x={153} y={503} color={BLUE}>ארוך: הכללת אקסון 2</H><H x={153} y={571} color={ORANGE}>קצר: דילוג על אקסון 2</H>
      <H x={240} y={649} bold color={TEAL}>פריימר חוצה צומת</H><L x={240} y={688} color={MUTED}>cDNA</L>
      <Exon x={59} y={730} w={126} n={1} /><Exon x={185} y={730} w={126} n={2} alt /><Exon x={311} y={730} w={106} n={3} />
      <Primer x={161} y={768} c={TEAL} w={50} /><Primer x={258} y={768} c={TEAL} right={false} />
      <H x={240} y={815} color={TEAL}>הצומת קיים רק אחרי שחבור</H><H x={240} y={863} color={MUTED}>תגובות נפרדות לכל זוג פריימרים</H><H x={240} y={907} color={MUTED}>בקרת no-RT שוללת DNA גנומי</H></>;
  } else if(id==="volcano-plot") {
    h=790;const x=(v:number)=>251+47*v,y=(v:number)=>449-62*v,cut=-Math.log10(.05);
    body=<><H x={240} y={33} size={24} bold>גודל השינוי מול מובהקות</H><L x={100} y={84}>−log₁₀ p</L>
      <H x={141} y={121} bold color={BLUE}>ירידה מובהקת</H><H x={362} y={121} bold color={RED}>עלייה מובהקת</H>
      <rect x={63} y={142} width={141} height={y(cut)-142} fill="#eff6ff" /><rect x={298} y={142} width={141} height={y(cut)-142} fill="#fff1f2" />
      <Stroke d="M63 140 V449 H439" />
      {[0,1,2,3,4].map(v=><g key={v}><Stroke d={`M57 ${y(v)} H63`} /><L x={42} y={y(v)+7}>{v}</L></g>)}
      {[-4,-2,0,2,4].map(v=><g key={v}><Stroke d={`M${x(v)} 449 V455`} /><L x={x(v)} y={484}>{v}</L></g>)}
      <Stroke d={`M204 142 V449 M298 142 V449 M63 ${y(cut)} H439`} c={MUTED} w={1.5} dash="5 5" />
      {Array.from({length:160},(_,i)=>{
        const fc=3.65*Math.sin(i*2.399963)*Math.sqrt((i+1)/160),z=Math.max(.08,.2+.76*Math.abs(fc)+1.3*Math.sin(i*1.71)),p=10**-z;
        return <circle key={i} cx={x(fc)} cy={y(-Math.log10(p))} r={2.7} fill={p<.05&&Math.abs(fc)>1?fc>0?RED:BLUE:"#94a3b8"} opacity={.8} />;
      })}
      {[{fc:2.7,z:4.45,s:"A",c:RED},{fc:3.1,z:.55,s:"B",c:MUTED},{fc:.18,z:4.5,s:"C",c:PURPLE}].map(d=><g key={d.s}><circle cx={x(d.fc)} cy={y(d.z)} r={6} fill="white" stroke={d.c} strokeWidth={2} /><L x={x(d.fc)+15} y={y(d.z)-11} color={d.c} bold>{d.s}</L></g>)}
      <L x={250} y={529} bold>log₂(FC) · B/A</L><L x={240} y={570} color={MUTED}>|log₂FC| &gt; 1   ·   p &lt; 0.05</L>
      <H x={240} y={618} color={RED}>A — שינוי גדול ומובהק</H><H x={240} y={656} color={MUTED}>B — שינוי גדול ללא מובהקות</H><H x={240} y={694} color={PURPLE}>C — שינוי קטן ומובהק</H>
      <H x={240} y={740} color={MUTED}>הספים להדגמה; בניתוח גנומי</H><H x={240} y={775} color={MUTED}>נדרש תיקון לריבוי בדיקות</H></>;
  } else if(id==="turnover-scatter") {
    h=800;const x=(v:number)=>72+.365*v,y=(v:number)=>453-.31*v;
    body=<><H x={240} y={33} size={24} bold>אותה כמות, תחלופה שונה</H><H x={156} y={84}>קריאות חדשות</H><L x={368} y={84} color={MUTED}>t = 1 h</L>
      <Stroke d="M72 130 V453 H442" />
      {[0,500,1000].map(v=><g key={v}><Stroke d={`M66 ${y(v)} H72 M${x(v)} 453 V459`} /><L x={57} y={y(v)+7} anchor="end">{v}</L><L x={x(v)} y={492}>{v}</L></g>)}
      <Stroke d={`M72 453 L${x(1000)} ${y(1000)}`} c={MUTED} dash="5 5" />
      <L x={227} y={135} color={MUTED}>y = x</L><H x={228} y={169} color={MUTED}>גבול עליון</H>
      {Array.from({length:120},(_,i)=>{const total=30+(i*173)%950,halfLife=.22+((i*37)%140)/7,fresh=total*(1-Math.exp(-Math.LN2/halfLife));return <circle key={i} cx={x(total)} cy={y(fresh)} r={2.7} fill={TEAL} opacity={.55} />;})}
      <Stroke d={`M${x(700)} ${y(70)} V${y(630)}`} c={ORANGE} dash="3 5" />
      <circle cx={x(700)} cy={y(630)} r={7} fill={RED} stroke="white" strokeWidth={2} /><circle cx={x(700)} cy={y(70)} r={7} fill={BLUE} stroke="white" strokeWidth={2} />
      <H x={385} y={247} color={RED} bold>90% חדש</H><H x={386} y={408} color={BLUE} bold>10% חדש</H>
      <H x={270} y={537}>כלל הקריאות</H><H x={240} y={587} color={RED}>ליד האלכסון: תחלופה מהירה</H><H x={240} y={623} color={RED}>RNA פחות יציב</H>
      <H x={240} y={666} color={BLUE}>ליד ציר X: תחלופה איטית</H><H x={240} y={702} color={BLUE}>RNA יציב יותר</H>
      <H x={240} y={749} color={MUTED}>בהנחת מצב יציב ומשך סימון זהה</H><H x={240} y={786} color={MUTED}>נדרשים גם יעילות סימון ונרמול דומים</H></>;
  } else if(id==="chip-seq-peaks") {
    h=925;
    body=<><H x={240} y={33} size={24} bold>מהחלבון אל האות בגנום</H>
      <H x={71} y={86}>קיבוע</H><H x={238} y={86}>קיטוע</H><H x={407} y={86}>שיקוע</H>
      {[71,238,407].map(x=><g key={x}><Stroke d={`M${x-34} 146 H${x+34}`} c={BLUE} /><circle cx={x} cy={130} r={12} fill={PURPLE} /></g>)}
      <Stroke d="M63 143 l12 -17 m-12 0 l12 17" c={RED} />
      <Arrow x={116} y={143} to={182} c={MUTED} /><Arrow x={283} y={143} to={350} c={MUTED} />
      <Stroke d="M407 152 V204 l-5 -7 m5 7 l5 -7" c={MUTED} />
      <circle cx={405} cy={180} r={13} fill={PALE.orange} stroke={ORANGE} strokeWidth={2} /><Stroke d="M405 167 V155 m0 3 l-12 -10 m12 10 l12 -10" c={RED} w={3} />
      <H x={405} y={242}>שחרור הקיבוע</H><L x={405} y={281} color={BLUE}>DNA</L>
      <Arrow x={335} y={280} to={278} c={MUTED} />
      <H x={156} y={242}>ריצוף ומיפוי</H>{[0,1,2].map(i=><Stroke key={i} d={`M118 ${265+i*13} h60`} c={BLUE} w={3} />)}
      <H x={240} y={344} color={MUTED}>אותו אזור בגנום · נוגדן בוחר את המטרה</H>
      <L x={77} y={416}>input</L><Track y={424} x0={161} x1={451} h={28} c="#94a3b8" f={t=>.2+.12*Math.sin(t*30)**2} />
      <L x={77} y={494} color={PURPLE}>ChIP · TF</L><Track y={504} x0={161} x1={451} c={PURPLE} f={t=>.04+.95*gaussian(t,.51,.022)} />
      <L x={77} y={576} color={ORANGE}>H3K27me3</L><Track y={586} x0={161} x1={451} c={ORANGE} f={t=>.05+.8/(1+Math.exp(-(t-.31)*45))/(1+Math.exp((t-.87)*45))*(.8+.1*Math.sin(t*120))} />
      <H x={240} y={635}>גורם שעתוק: שיא צר</H><H x={240} y={674}>סימן היסטוני: תחום רחב</H>
      <Stroke d="M39 777 H441" c={BLUE} />{[65,120,335,395].map(x=><Nucleosome key={x} x={x} y={767} />)}
      <L x={248} y={729} color={GREEN}>TSS</L><Stroke d="M248 760 V739 H296" c={GREEN} /><Arrow x={275} y={739} to={298} c={GREEN} />
      <H x={240} y={830} color={TEAL}>אזור דל נוקלאוזומים לפני תחילת השעתוק</H><H x={240} y={882} color={MUTED}>מבנה הפרומוטור הוא דוגמה נפרדת</H><H x={240} y={917} color={MUTED}>המסלולים כאן אינם מדידה ניסויית</H></>;
  } else if(id==="genome-browser-tracks") {
    h=940;const x=(kb:number)=>156+(kb-95)*5, p=(t:number)=>gaussian(95+t*60,129.2,1.15),e=(t:number)=>gaussian(95+t*60,150,1.3);
    const expr=(t:number)=>{const k=95+t*60;return [[100,104],[112,115],[125,130]].some(([a,b])=>k>=a&&k<=b)? .65+.13*Math.sin(k*23)**2:0;};
    body=<><H x={240} y={33} size={24} bold>גדיל שלילי: ההתחלה מימין</H><H x={240} y={76}>תאי כבד · הגן K</H><L x={71} y={121}>kb</L>
      <Stroke d="M156 143 H456" c={MUTED} />
      {[100,130,150].map(k=><g key={k}><L x={x(k)} y={122}>{k}</L><Stroke d={`M${x(k)} 136 V149`} c={MUTED} /></g>)}
      <rect x={x(148)} y={167} width={x(152)-x(148)} height={530} fill="#fff7ed" />
      <L x={73} y={193} bold>K (−)</L><Stroke d={`M${x(100)} 187 H${x(130)}`} c={BLUE} />
      {[106,109,118,121,123].map(k=><Arrow key={k} x={x(k)+4} y={187} to={x(k)-3} c={BLUE} />)}
      {[[100,101.5,10],[101.5,104,26],[112,115,26],[125,128,26],[128,130,10]].map(([a,b,hh])=><rect key={a} x={x(a)} y={187-hh/2} width={x(b)-x(a)} height={hh} fill={BLUE} />)}
      <L x={x(130)} y={234} color={GREEN} bold>TSS</L><Arrow x={x(130)} y={253} to={x(125)} c={GREEN} />
      {[{n:"RNA-seq",y:321,c:BLUE,f:expr},{n:"H3K4me3",y:405,c:PURPLE,f:p},{n:"H3K27ac",y:489,c:ORANGE,f:(t:number)=>.85*p(t)+.95*e(t)},{n:"H3K4me1",y:573,c:TEAL,f:(t:number)=>.1*p(t)+e(t)},{n:"שימור",y:657,c:"#475569",f:(t:number)=>.72*expr(t)+.8*e(t)}].map(tr=><g key={tr.n}>{tr.n==="שימור"?<H x={74} y={tr.y-8}>{tr.n}</H>:<L x={74} y={tr.y-8} color={tr.c}>{tr.n}</L>}<Track y={tr.y} x0={156} x1={456} h={40} c={tr.c} f={tr.f} /></g>)}
      <L x={74} y={712} color={GREEN}>CpG</L><Stroke d="M156 706 H456" c="#cbd5e1" w={1} /><rect x={x(128)} y={698} width={x(131)-x(128)} height={16} fill={GREEN} />
      <H x={240} y={768} color={GREEN}>פרומוטור פעיל סביב 130 אלף</H><H x={240} y={809} color={ORANGE}>מגביר פעיל סביב 150 אלף</H><H x={240} y={855}>המגביר במעלה הזרם: מימין לגן</H>
      <H x={240} y={900} color={MUTED}>מלבן עבה: מקודד · דק: UTR</H><H x={240} y={933} color={MUTED}>המסלולים מיושרים לאותו סרגל</H></>;
  } else {
    h=870;const x=(i:number)=>87+i*48;
    body=<><H x={240} y={33} size={24} bold>לוגו רצף מחושב</H><L x={51} y={96}>bits</L><Stroke d="M64 112 V321 H445" />
      {[0,1,2].map(v=><g key={v}><Stroke d={`M58 ${321-v*98} H64`} /><L x={39} y={328-v*98}>{v}</L></g>)}
      {PWM.map((ps,i)=><g key={i}><LogoStack ps={ps} x={x(i)} y={321} bitHeight={98} width={36} /><L x={x(i)} y={359}>{i+1}</L></g>)}
      <Stroke d="M87 376 V395 M423 376 V395" c={MUTED} /><H x={105} y={426} color={GREEN}>שמור</H><H x={406} y={426} color={MUTED}>גמיש</H>
      <L x={240} y={474} color={MUTED}>R = 2 − H · h(letter) = p × R</L>
      <H x={240} y={532} bold>קולטן גרעיני כדימר</H>
      <path d="M81 628 Q81 577 116 577 Q147 577 147 628 L132 642 H95Z M315 628 Q315 577 350 577 Q381 577 381 628 L366 642 H329Z" fill={PALE.purple} stroke={PURPLE} strokeWidth={2} />
      <Stroke d="M147 605 Q230 557 315 605" c={PURPLE} w={3} />
      <L x={115} y={683} bold size={24}>AGGTCA</L><L x={232} y={683} size={24} color={MUTED}>nn</L><L x={349} y={683} bold size={24}>AGGTCA</L>
      <Stroke d="M47 697 H419 M47 704 H419" c={BLUE} /><Arrow x={62} y={730} to={167} c={PURPLE} /><Arrow x={296} y={730} to={401} c={PURPLE} />
      <H x={115} y={770} color={PURPLE}>חצי אתר</H><H x={349} y={770} color={PURPLE}>חצי אתר</H>
      <H x={240} y={813}>DR2 · מרווח של 2 בסיסים</H><H x={240} y={858} color={MUTED}>המטריצה אינה מדידה של קולטן מסוים</H></>;
  }
  return <svg viewBox={`0 0 480 ${h}`} className="gx-data-mobile" role="img" aria-label={label}><title>{`${label} עיבוד לנייד.`}</title>{body}</svg>;
}

export const GENE_EXPRESSION_DATA_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "kinetic-coupling": { el: KineticCoupling, captionHe: "במודל המוצג, האטת Pol II מאריכה את חלון הזיהוי של אתר השחבור החלש ומעודדת הכללת אקסון 2; אצטילציה עשויה לקצר את החלון ולעודד דילוג. זנב CTD מגייס גורמי שחבור, ונוקלאוזומים עשויים לעכב התארכות; הכיוון תלוי בהקשר. סכמטי." },
  "eve-stripe2": { el: EveStripe2, captionHe: "המפעילים Bicoid ו־Hunchback מאפשרים ביטוי, והמדכאים Giant ו־Krüppel מגבילים את גבולות פס 2 בעובר שקדמתו משמאל. מגביר בן כ־500 זוגות בסיסים יכול להפעיל גן מדווח בפס הזה; צורות המפלים ומיקומי האתרים אינם מדידה או מפת רצף. סכמטי." },
  "qpcr-amplification": { el: QpcrAmplification, captionHe: "שלוש עקומות מחושבות לכמויות התחלה ביחס 100:10:1, באותו סף ובמודל של הכפלה מוקדמת ורוויה מאוחרת. דילול פי עשרה דוחה את חציית הסף בכ־3.32 מחזורים. נתונים להמחשה." },
  "exon-primers": { el: ExonPrimers, captionHe: "זוג מאגף מבחין באורך בין הכללה לדילוג, זוג בכל אקסון מודד את תרומתו, וזוג אינטרוני מזהה קדם־תעתיק או אינטרון שנשמר. פריימר חוצה צומת מוצג בנפרד על cDNA משוחבר; התכנונים מיועדים לתגובות נפרדות. סכמטי." },
  "volcano-plot": { el: VolcanoPlot, captionHe: "כל נקודה היא גן מדומה: המיקום האופקי הוא שינוי לוגריתמי בביטוי, והגובה הוא מינוס לוגריתם ערך ההסתברות. הצבעים דורשים גם גודל שינוי וגם סף מובהקות; הספים כאן אינם תחליף לתיקון לריבוי בדיקות. נתונים להמחשה." },
  "turnover-scatter": { el: TurnoverScatter, captionHe: "מספר הקריאות החדשות מחושב מתוך כלל הקריאות לפי פירוק מעריכי וסימון במשך שעה במצב יציב. שני גנים עם 700 קריאות כוללות ו־90% לעומת 10% קריאות חדשות ממחישים תחלופה שונה; הפרשנות מחייבת משך סימון ויעילות דומים. נתונים להמחשה." },
  "chip-seq-peaks": { el: ChipSeqPeaks, captionHe: "קיבוע, קיטוע ושיקוע בנוגדן קודמים לשחרור ה־DNA ולריצוף. השוואה ל־input מדגישה העשרה: שיא צר של גורם שעתוק לעומת תחום היסטוני רחב; למטה מוצג אזור דל נוקלאוזומים לפני תחילת השעתוק כדוגמת מבנה נפרדת. סכמטי." },
  "genome-browser-tracks": { el: GenomeBrowserTracks, captionHe: "תצוגת תאי הכבד בתרגיל: הגן K נמצא בגדיל השלילי בין 100 ל־130 אלף, ולכן אתר תחילת השעתוק מימין. מסלולי האצטילציה, סימון המגבירים והשימור מדגימים מגביר פעיל ב־150 אלף, במעלה הזרם; הגבהים והקואורדינטות אינם נתוני אתר גנומי אמיתי. סכמטי." },
  "motif-logo": { el: MotifLogo, captionHe: "לוגו מחושב ממטריצת הסתברויות: גובה הערימה הוא המידע בביטים, וגובה כל אות הוא ההסתברות שלה כפול המידע. לצדו חזרה ישירה של חצאי אתר עם מרווח שני בסיסים; זוהי דוגמת מבנה ולא זיהוי של קולטן מסוים. נתונים להמחשה." },
};
