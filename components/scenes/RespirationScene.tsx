"use client";

import React, { memo, useEffect, useId, useRef, useState } from "react";

type Point = [number, number];
type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
const TAU = Math.PI * 2;
export const DURATION = 112;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => { const u = clamp(v); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const mod = (n: number, d: number) => ((n % d) + d) % d;
const lerp = (a: Point, b: Point, u: number): Point => [mix(a[0], b[0], u), mix(a[1], b[1], u)];
const bez = (a: Point, b: Point, c: Point, d: Point, u: number): Point => {
  const v = 1 - u;
  return [v*v*v*a[0]+3*v*v*u*b[0]+3*v*u*u*c[0]+u*u*u*d[0], v*v*v*a[1]+3*v*v*u*b[1]+3*v*u*u*c[1]+u*u*u*d[1]];
};
const windowAt = (t: number, a: number, b: number, edge = 1) => ramp(t, a, a + edge) * (1 - ramp(t, b - edge, b));
/** Isolate complete chemical/Latin runs; keep all SVG geometry in biological order. */
export function isolateRuns(value: string) {
  return value.replace(/[\u2066\u2069]/g, "").replace(/[A-Za-z0-9½≈][A-Za-z0-9₀-₉ₒ⁺⁻ᵢ²³≈]*(?:[ +/→–−.-]+[A-Za-z0-9½][A-Za-z0-9₀-₉ₒ⁺⁻ᵢ²³]*)*/g, run => "\u2066" + run + "\u2069");
}

export const CHAPTERS = [
  { start: 0, still: 9, he: "גליקוליזה", en: "Glycolysis",
    textHe: "בציטוזול: גלוקוז (6C) מתפרק לשני פירובט (3C). מושקעים 2 ATP ומיוצרים 4 ATP ו־2 NADH: רווח נקי של 2 ATP ו־2 NADH. הגליקוליזה עצמה אינה דורשת חמצן; בנשימה אירובית הפירובט ממשיך למיטוכונדריון.",
    textEn: "In the cytosol, glucose (6C) splits into two pyruvates (3C). 2 ATP are invested; 4 ATP and 2 NADH are produced: net 2 ATP and 2 NADH. Glycolysis itself does not require oxygen; in aerobic respiration pyruvate continues into the mitochondrion." },
  { start: 16, still: 24, he: "חמצון פירובט", en: "Pyruvate oxidation",
    textHe: "שני הפירובט עוברים את הממברנה החיצונית ואת נשא הפירובט בממברנה הפנימית אל המטריצה. קומפלקס פירובט דהידרוגנאז משחרר CO₂, מחזר NAD⁺ ל־NADH ומחבר את שארית שני הפחמנים לקואנזים A. לכל גלוקוז: 2 אצטיל־CoA, ‏2 NADH ו־2 CO₂.",
    textEn: "Two pyruvates cross the outer membrane and the inner-membrane pyruvate carrier into the matrix. Pyruvate dehydrogenase releases CO₂, reduces NAD⁺ to NADH and joins the two-carbon residue to coenzyme A. Per glucose: 2 acetyl-CoA, 2 NADH and 2 CO₂." },
  { start: 30, still: 39, he: "מעגל קרבס", en: "Citric acid cycle",
    textHe: "במטריצה, אצטיל־CoA (2C) מצטרף לאוקסלואצטט (4C) ליצירת ציטרט (6C). שמונה תגובות מחדשות אוקסלואצטט. לכל סיבוב: 2 CO₂, ‏3 NADH, ‏1 FADH₂ ו־1 ATP או GTP בזרחון ברמת הסובסטרט. שני סיבובים לגלוקוז: 4 CO₂, ‏6 NADH, ‏2 FADH₂ ו־2 ATP/GTP. הפחמנים הנכנסים אינם בהכרח אלה היוצאים בסיבוב הראשון.",
    textEn: "In the matrix, acetyl-CoA (2C) joins oxaloacetate (4C) to form citrate (6C). Eight reactions regenerate oxaloacetate. Each turn yields 2 CO₂, 3 NADH, 1 FADH₂ and 1 ATP or GTP by substrate-level phosphorylation. Two turns per glucose yield 4 CO₂, 6 NADH, 2 FADH₂ and 2 ATP/GTP. Incoming carbons are not necessarily released in the first turn." },
  { start: 48, still: 60, he: "אלקטרונים", en: "Electron transport",
    textHe: "ה-NADH מוסר זוג אלקטרונים ל־I. הפלבין הקשור ב־II (מסומן FADH₂) מזין מסלול נוסף אל Q; ‏II אינו שואב H⁺. ‏Q נע בתוך הדו־שכבה וציטוכרום c בצד המרווח: I → Q → III → cyt c → IV. ב־IV חמצן הוא הקולט הסופי: ½ O₂ + 2 e⁻ + 2 H⁺ → H₂O. פרוטוני התגובה במטריצה נפרדים מהפרוטונים הנשׁאבים.",
    textEn: "NADH donates two electrons to I. Enzyme-bound flavin in II (labelled FADH₂) supplies a second route to Q; II does not pump H⁺. Q moves within the bilayer; cytochrome c moves on the intermembrane side: I → Q → III → cyt c → IV. Oxygen is the final acceptor at IV: ½ O₂ + 2 e⁻ + 2 H⁺ → H₂O. Matrix reaction protons are distinct from pumped protons." },
  { start: 70, still: 79, he: "מפל פרוטונים", en: "Proton gradient",
    textHe: "העברת האלקטרונים מניעה העברה של H⁺ מהמטריצה למרווח הבין־ממברנלי. לזוג אלקטרונים: I מעביר 4, ‏III מעביר 4 דרך מחזור Q, ו־IV שואב 2; ‏II מעביר 0. יחד: 10 H⁺ ל־NADH, או 6 במסלול המתחיל ב־II. מצטברים מפל ריכוזים והפרש מתח — הכוח המניע הפרוטוני.",
    textEn: "Electron transfer drives H⁺ from matrix to intermembrane space. Per electron pair: I transfers 4, III transfers 4 through the Q cycle, IV pumps 2; II transfers 0. Total: 10 H⁺ per NADH, or 6 through the II route. A concentration difference and a membrane potential build the proton-motive force." },
  { start: 86, still: 97, he: "סיבוב ו־ATP", en: "Rotation and ATP",
    textHe: "פרוטונים (H⁺) חוזרים למטריצה דרך Fₒ של ATP סינתאז ומסובבים את טבעת הרוטור ואת הציר; הסטטור וראש F₁ אינם מסתובבים. שינויי צורה בראש מצמדים ADP + Pᵢ ל־ATP: כימיאוסמוזה. כ־26–28 ATP בזרחון חמצוני, ובסך הכול כ־30–32 ATP לגלוקוז. הטווח תלוי בשאטלים של אלקטרוני NADH הציטוזולי ובעלויות הובלה; NADH עצמו אינו חוצה את הממברנה הפנימית.",
    textEn: "H⁺ returns to the matrix through ATP synthase Fₒ, turning the rotor ring and central shaft; the stator and F₁ head do not rotate. Head conformational changes couple ADP + Pᵢ to ATP: chemiosmosis. About 26–28 ATP by oxidative phosphorylation; about 30–32 ATP total per glucose. The range depends on cytosolic NADH electron shuttles and transport costs; NADH itself does not cross the inner membrane." },
] as const;
export const chapterAt = (t: number) => Math.max(0, CHAPTERS.findLastIndex(c => t >= c.start));
export function sceneState(t: number) {
  const reset = 1 - ramp(t, 104, 112);
  return { zoom: ramp(t, 26, 43) * reset, chain: ramp(t, 54, 58) * reset,
    gradient: ramp(t, 55, 84) * reset, synth: ramp(t, 86, 90) * reset,
    rotor: Math.max(0, t - 86) * 115 * ramp(t, 86, 90), reset };
}

function Label({ children, ...props }: React.SVGProps<SVGTextElement> & { children: string }) {
  return <text textAnchor="middle" {...props}>{isolateRuns(children)}</text>;
}
function Carbon({ count = 3 }: { count?: number }) {
  return <g data-part="carbon"><path d={`M 0 0 H ${(count - 1)*13}`} stroke="#548b75" strokeWidth="3" />{Array.from({length:count},(_,i)=><g key={i}><circle cx={i*13} r="6" fill="#688c78" stroke="#365f4d" strokeWidth="1.1"/><circle cx={i*13-1.5} cy="-2" r="1.8" fill="#dcece2"/></g>)}</g>;
}
function Molecule({ kind }: { kind: "CO₂" | "O₂" | "H₂O" }) {
  return <g data-part={kind}><path d={kind==="H₂O"?"M -7 5 L 0 -1 L 7 5":"M -8 0 H 8"} stroke="#548ba6" strokeWidth="2.5"/>{(kind==="O₂"?[-5,5]:[-8,0,8]).map((x,i)=><circle key={i} cx={x} cy={kind==="H₂O"&&i!==1?5:0} r={kind==="H₂O"&&i!==1?3:5} fill={kind==="CO₂"&&i===1?"#6e7f84":"#b8dceb"} stroke="#47799c" strokeWidth="1.1"/>)}</g>;
}
function Badge({ text, color = "#548b75" }: { text: string; color?: string }) {
  const width = text.length*9 + 16;
  return <g data-part="badge"><rect x={-width/2} y="-12" width={width} height="25" rx="7" fill="var(--badge)" stroke={color} strokeWidth="1.4"/><Label y="5" fontSize="16" fill="var(--ink)">{text}</Label></g>;
}
function Proton() { return <g data-part="proton"><circle r="6" fill="#c77c39" stroke="#fff3d7" strokeWidth="1"/><path d="M -2.5 0 H 2.5 M 0 -2.5 V 2.5" stroke="#fff" strokeWidth="1.3"/></g>; }
function CarrierToken({ oxidized = false }: { oxidized?: boolean }) {
  return <g data-part="nadh"><path d="M -11 -2 Q -12 -10 -3 -10 Q 7 -14 12 -5 Q 16 6 5 10 Q -7 15 -11 -2 Z" fill={oxidized?'#e5ece6':'#a6c7b1'} stroke="#46735b" strokeWidth="1.2"/>{!oxidized&&<><circle cx="-3" cy="-2" r="2.5" fill="#3c877d"/><circle cx="4" cy="2" r="2.5" fill="#3c877d"/></>}</g>;
}
function Nucleotide({ atp = false }: { atp?: boolean }) {
  return <g data-part="nucleotide"><path d="M -9 -5 L -3 -10 L 3 -5 L 1 3 L -6 4 Z" fill="#d9bd7d" stroke="#916a31" strokeWidth="1.1"/><path d="M 1 2 H 15" stroke="#916a31" strokeWidth="1.5"/>{[7,15,...(atp?[23]:[])].map(x=><circle key={x} cx={x} cy="2" r="3.6" fill="#edd498" stroke="#ac7837" strokeWidth=".8"/>)}</g>;
}

/** Original protein silhouettes: membrane helices, soluble lobes, binding cofactors. */
const Complex = memo(function Complex({ kind, id }: { kind: "I" | "II" | "III" | "IV"; id: string }) {
  const c = {I:["#d3e7dc","#548b75","#346451"],II:["#f3dfb9","#b08b4f","#805322"],III:["#d6e7f1","#6c97b3","#244b73"],IV:["#e4ddec","#9476a8","#665178"]}[kind];
  const shape = kind==="I" ? "M -38 104 C -49 94 -48 87 -31 86 L 23 86 Q 38 90 33 116 L 33 149 Q 39 166 51 175 C 71 192 64 216 46 221 Q 24 225 17 208 L 0 166 Q -7 153 -25 155 Q -48 153 -38 128 Z" : kind==="II" ? "M -20 108 Q -27 96 -13 93 Q 4 88 17 101 L 18 148 C 37 157 38 183 17 193 Q -4 204 -22 186 Q -38 170 -20 149 Z" : kind==="III" ? "M -27 91 C -46 82 -49 105 -39 129 L -36 159 Q -45 180 -22 191 Q -6 202 1 182 Q 10 199 28 189 Q 48 178 35 154 L 39 112 Q 44 83 27 86 Q 11 77 1 96 Q -11 79 -27 91 Z" : "M -28 95 Q -43 89 -40 113 L -36 154 C -48 171 -30 193 -11 184 Q 4 198 20 180 C 43 181 44 153 33 140 L 33 103 Q 34 83 18 91 Q 2 80 -8 99 Q -19 84 -28 95 Z";
  return <g data-complex={kind} data-bound="protein">
    <path d={shape} fill={`url(#${id}-${kind})`} stroke={c[2]} strokeWidth="1.7"/>
    {(kind==="II"?[-10,4]:[-27,-12,3,18]).map((x,i)=><g key={x}><path d={`M ${x} 99 C ${x-10} 117 ${x+10} 127 ${x} 148`} fill="none" stroke={c[1]} strokeWidth="6" strokeLinecap="round"/><path d={`M ${x-1} 99 C ${x-11} 117 ${x+9} 127 ${x-1} 148`} fill="none" stroke="#ffffff" strokeOpacity=".62" strokeWidth="1.7"/>{i%2===0&&<circle cx={x} cy={kind==="I"?175:165} r="3.4" fill="#b2945d" stroke={c[2]} strokeWidth=".8"/>}</g>)}
    {kind==="I"&&<><ellipse cx="37" cy="193" rx="17" ry="20" fill={c[0]} stroke={c[1]} strokeWidth="1.2"/><path d="M 28 179 Q 52 185 43 209" fill="none" stroke={c[1]} strokeWidth="4"/>{[0,1,2].map(i=><rect key={i} x={27-i*9} y={169-i*13} width="6" height="6" rx="1" fill="#b2945d" transform={`rotate(30 ${30-i*9} ${172-i*13})`}/>)}</>}
    {kind==="III"&&<path d="M -23 157 Q -5 170 -17 186 M 20 155 Q 4 170 18 185" fill="none" stroke={c[1]} strokeWidth="4"/>}
    {kind==="IV"&&<><ellipse cx="-10" cy="157" rx="10" ry="15" fill={c[0]} stroke={c[1]}/><circle cx="9" cy="147" r="5" fill="#bd825d" stroke={c[2]}/></>}
    <Label x="0" y="244" fontWeight="700" fontSize="18" fill="var(--ink)">{kind}</Label>
  </g>;
});

const Artwork = memo(function Artwork({ mobile, en, uid }: { mobile: boolean; en: boolean; uid: string }) {
  const width = mobile ? 460 : 900;
  const xs = mobile ? [53,132,223,308,402] : [90,245,430,615,795];
  const tr = (he:string,english:string)=>en?english:he;
  return <>
    <defs>
      {([['I','#ecf5ed','#9dc4ab'],['II','#fff5de','#d7b77a'],['III','#edf6fc','#9abed2'],['IV','#f4eff8','#b5a0c7']] as const).map(([k,a,b])=><linearGradient key={k} id={`${uid}-${k}`} x1="0" x2="1" y2=".4"><stop stopColor={a}/><stop offset=".55" stopColor={b}/><stop offset="1" stopColor={a}/></linearGradient>)}
      <linearGradient id={`${uid}-mito`} x2="0" y2="1"><stop stopColor="#f2dfbc"/><stop offset="1" stopColor="#c9ab79"/></linearGradient>
      <linearGradient id={`${uid}-rotor`}><stop stopColor="#986830"/><stop offset=".45" stopColor="#f5d99c"/><stop offset="1" stopColor="#a67536"/></linearGradient>
      <linearGradient id={`${uid}-head`} x2=".8" y2="1"><stop stopColor="#faeac5"/><stop offset="1" stopColor="#d4ad68"/></linearGradient>
    </defs>
    <g data-overview="" transform={mobile?"translate(0 0)":"translate(170 0) scale(1.25)"}>
      <Label x="310" y="27" fontSize="18" fontWeight="650" fill="var(--ink)">{tr('מיטוכונדריון','Mitochondrion')}</Label>
      <Label x="65" y="27" fontSize="16" fill="var(--muted)">{tr('ציטוזול','Cytosol')}</Label>
      <g data-bound="mitochondrion">
        <path d="M 220 48 C 280 37 387 37 428 65 C 469 94 475 179 437 212 C 395 247 260 238 213 223 C 174 211 144 179 146 139 C 147 95 176 57 220 48 Z" fill={`url(#${uid}-mito)`} stroke="#8b7149" strokeWidth="2"/>
        <path d="M 219 60 C 246 52 257 56 260 74 L 263 102 Q 266 113 272 102 L 276 68 Q 279 51 298 57 L 307 96 Q 313 112 319 97 L 326 62 Q 331 49 348 59 L 355 98 Q 360 112 367 98 L 375 66 Q 380 56 393 69 Q 402 84 397 111 L 395 132 Q 396 146 408 138 L 432 112 Q 444 109 447 132 Q 452 171 427 190 L 413 161 Q 406 150 400 166 L 398 201 Q 392 216 375 218 L 366 184 Q 361 171 354 186 L 348 219 Q 337 229 321 220 L 315 191 Q 309 176 303 193 L 298 218 Q 289 228 271 220 L 263 190 Q 258 178 251 194 L 246 213 C 208 213 164 186 161 145 C 158 105 186 70 219 60 Z" fill="var(--matrix)" stroke="#9b7e4f" strokeWidth="2.1"/>
        <path d="M 218 54 C 177 67 152 99 153 137 M 448 149 Q 449 188 424 207" fill="none" stroke="#fff8e9" strokeWidth="2.2" opacity=".8"/>
        <g data-carrier="" transform="translate(160 146)"><path d="M -8 -17 Q -15 -20 -14 -8 L -14 9 Q -13 18 -7 15 M 7 -17 Q 14 -20 14 -8 L 14 9 Q 13 18 7 15" fill="#d3e7dc" stroke="#346451" strokeWidth="2"/></g>
      </g>
      <g data-gly=""><path d="M 41 68 L 52 74 L 52 86 L 41 92 L 30 86 L 30 74 Z" fill="#dcece2" stroke="#548b75" strokeWidth="2"/>
        <Label x="42" y="55" fontSize="16" fill="var(--ink)">{tr('גלוקוז 6C','Glucose 6C')}</Label></g>
      <path d="M 43 101 C 43 119 70 123 92 139 L 143 146" fill="none" stroke="var(--route)" strokeWidth="1.5" strokeDasharray="4 5"/>
      <Label x="72" y="195" fontSize="16" fill="var(--ink)">{tr('פירובט × 2','2 pyruvate')}</Label>
      <Label x="70" y="219" fontSize="16" fill="var(--muted)">{'3C + 3C'}</Label>
      <g data-pdc="" transform="translate(222 144)"><path d="M -25 -15 Q -30 -32 -10 -32 Q 8 -40 14 -23 Q 35 -28 33 -8 Q 40 12 18 17 Q 7 31 -8 15 Q -28 21 -25 -15 Z" fill="#c6dbcf" stroke="#538269" strokeWidth="1.3"/>{[[-12,-14],[10,-12],[0,4]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx="10" ry="8" fill="#e7f1e9" stroke="#8aab96"/>)}</g>
      <Label x="218" y="101" fontSize="16" fill="var(--muted)">{'PDH'}</Label>
      <Label data-acetyl-label="" x="245" y="258" fontSize="16" fill="var(--ink)">{tr('אצטיל־CoA · 2C','Acetyl-CoA · 2C')}</Label>
      <path d="M 250 145 Q 271 124 295 130" stroke="var(--route)" fill="none" strokeWidth="1.6"/>
      <g data-krebs=""><circle cx="337" cy="154" r="42" fill="none" stroke="#d8c7a4" strokeWidth="12"/>
        <circle cx="337" cy="154" r="42" fill="none" stroke="#729580" strokeWidth="2"/>
        {Array.from({length:8},(_,i)=>{const a=-Math.PI/2+i*TAU/8;return <g key={i}><circle cx={337+42*Math.cos(a)} cy={154+42*Math.sin(a)} r="4" fill="#d7e7db" stroke="#548b75"/><path d={`M ${337+42*Math.cos(a+.3)} ${154+42*Math.sin(a+.3)} l -2 -6 l 7 2`} fill="none" stroke="#548b75" strokeWidth="1.6" transform={`rotate(${i*45} ${337+42*Math.cos(a+.3)} ${154+42*Math.sin(a+.3)})`}/></g>})}
        <Label x="337" y="151" fontSize="17" fill="var(--ink)" fontWeight="650">{tr('קרבס','Krebs')}</Label>
        <Label x="337" y="175" fontSize="16" fill="var(--muted)">{tr('תגובות: 8','8 reactions')}</Label>
      </g>
      <path data-matrix-leader="" d="M 428 231 V 176" fill="none" stroke="var(--muted)" strokeWidth="1"/>
      <Label x="428" y="251" fontSize="16" fill="var(--muted)">{tr('מטריצה','Matrix')}</Label>
      <rect data-anchor="" x="347" y="68" width="30" height="39" rx="8" fill="none" stroke="#47799c" strokeWidth="1.8" strokeDasharray="3 3"/>
      <g data-move="py0" opacity="0"><Carbon/></g><g data-move="py1" opacity="0"><Carbon/></g>
      <g data-move="acet0" opacity="0"><Carbon count={2}/></g><g data-move="acet1" opacity="0"><Carbon count={2}/></g>
      {Array.from({length:6},(_,i)=><g key={i} data-move={`co${i}`} opacity="0"><Molecule kind="CO₂"/></g>)}
      <g data-cycle-carbon="" opacity="0"><Carbon count={6}/></g>
      <g data-move="cycle-atp" opacity="0"><Badge text="ATP/GTP" color="#ac7837"/></g>
      <g data-over-callout=""><path data-over-leader="" d="M 166 258 L 166 244 L 160 146" fill="none" stroke="var(--muted)" strokeWidth="1.1"/><Label data-over-label="" x="166" y="288" fontSize="16" fill="var(--ink)">{tr('נשא פירובט','Pyruvate carrier')}</Label></g>
    </g>
    <path data-anchor-left="" fill="none" stroke="var(--border)" strokeWidth="1.4" strokeDasharray="5 5"/>
    <path data-anchor-right="" fill="none" stroke="var(--border)" strokeWidth="1.4" strokeDasharray="5 5"/>
    <g data-zoom="" opacity="0">
      <rect data-bound="zoom" x="0" y="-8" width={width} height="345" rx="18" fill="var(--panel)" stroke="var(--border)"/>
      <path d={`M 1 130 H ${width-1} V 319 Q ${width-1} 336 ${width-18} 336 H 18 Q 1 336 1 319 Z`} fill="var(--matrix)"/>
      <rect data-gradient="" x="1" y="43" width={width-2} height="62" fill="#c77c39" opacity="0"/>
      <Label x="110" y="54" fontSize="16" fill="var(--muted)">{tr('מרווח בין־ממברנלי','Intermembrane space')}</Label>
      <Label x="49" y="327" fontSize="16" fill="var(--muted)">{tr('מטריצה','Matrix')}</Label>
      <path d={`M 5 109 H ${width-5} V 148 H 5 Z`} fill="#e1d4b4"/>
      {Array.from({length:Math.floor(width/11)},(_,i)=>i*11+8).filter(x=>!xs.some((p,j)=>Math.abs(x-p)<(j===0?45:j===4?29:42))).map(x=><g key={x}>{[-1,1].map(side=><g key={side}><path d={`M ${x-2} ${129+side*22} l -1 ${-side*11} l 2 ${-side*8} M ${x+2} ${129+side*22} l 2 ${-side*12} l -2 ${-side*7}`} fill="none" stroke="#b3a17f" strokeWidth="1.4"/><circle cx={x} cy={129+side*22} r="4.3" fill="#e9d9b7" stroke="#b89c68" strokeWidth="1"/><circle cx={x-1.1} cy={128+side*22} r="1.3" fill="#fff9e9"/></g>)}</g>)}
      {(['I','II','III','IV'] as const).map((k,i)=><g key={k} transform={`translate(${xs[i]} 0)`}><Complex kind={k} id={uid}/></g>)}
      <g data-q="" transform={`translate(${(xs[1]+xs[2])/2} 128)`} data-bound="quinone"><path d="M -8 -5 L 0 -10 L 8 -5 L 8 5 L 0 10 L -8 5 Z" fill="#edcf83" stroke="#99732b" strokeWidth="1.4"/><path d="M 0 9 Q 9 18 17 11" fill="none" stroke="#ac8a46" strokeWidth="2"/></g>
      <Label x={(xs[1]+xs[2])/2} y="177" fontSize="16" fill="var(--ink)">{'Q'}</Label>
      <g data-cyt="" transform={`translate(${(xs[2]+xs[3])/2} 79)`} data-bound="cytochrome"><path d="M -15 -1 Q -17 -14 -4 -14 Q 10 -22 16 -7 Q 21 5 9 11 Q -8 20 -15 -1 Z" fill="#d3a9a5" stroke="#98615e" strokeWidth="1.3"/><path d="M -8 -4 Q 1 -10 8 2" fill="none" stroke="#f0d9d6" strokeWidth="3"/></g>
      <Label x={(xs[2]+xs[3])/2} y="218" fontSize="16" fill="var(--muted)">{'cyt c'}</Label>
      {[0,2,3].map((j,i)=><g key={j} data-pump={i}><path d={`M ${xs[j]-20} 204 V 67 l -4 7 m 4 -7 l 4 7`} stroke="#bc7638" fill="none" strokeWidth="1.3" strokeDasharray="3 4" opacity=".65"/><Label x={xs[j]} y="272" fontSize="16" fill="var(--muted)">{["4 H⁺","4 H⁺","2 H⁺"][i]}</Label></g>)}
      <Label x={xs[1]} y="272" fontSize="16" fill="var(--muted)">{'0 H⁺'}</Label>
      <g transform={`translate(${xs[1]} 174)`}><ellipse rx="8" ry="6" fill="#e6c673" stroke="#805322"/><Label x="0" y="42" fontSize="16" fill="var(--muted)">{'FADH₂'}</Label></g>
      <g data-atp-synthase="" transform={`translate(${xs[4]} 0)`} data-bound="synthase">
        <path d="M -25 104 Q -32 93 -24 87 L -12 91 L -10 153 L -25 155 Z" fill="#ead6aa" stroke="#956d35" strokeWidth="1.6"/>
        <path d="M -23 148 L -28 189 Q -32 219 -12 225" fill="none" stroke="#a77837" strokeWidth="6"/>
        <path d="M -21 149 L -26 189 Q -30 217 -11 221" fill="none" stroke="#f2dfb5" strokeWidth="2"/>
        <ellipse cx="6" cy="130" rx="21" ry="23" fill={`url(#${uid}-rotor)`} stroke="#956d35" strokeWidth="1.5"/>
        <g data-rotor="" transform="translate(6 130)">{Array.from({length:9},(_,i)=><path key={i} d="M 0 -19 Q 6 -14 8 -7" transform={`rotate(${i*40})`} fill="none" stroke={i===0?"#47799c":"#aa7e40"} strokeWidth={i===0?4:2}/>)}</g>
        <path d="M 6 153 V 196" stroke="#89622e" strokeWidth="6"/><path data-shaft="" d="M 3 156 Q 12 174 3 193" stroke="#f6d99d" fill="none" strokeWidth="3"/>
        <g data-head=""><path d="M -19 195 Q -27 209 -16 225 Q 1 240 23 226 Q 38 212 26 197 Q 9 178 -19 195 Z" fill={`url(#${uid}-head)`} stroke="#956d35" strokeWidth="1.6"/>{[-12,5,21].map((x,i)=><ellipse key={x} data-catalytic={i} cx={x} cy="208" rx="9" ry="14" fill="#f1d69e" stroke="#b38c4d" strokeWidth="1.2"/>)}</g>
        <Label x="1" y="262" fontSize="16" fontWeight="600" fill="var(--ink)">{'ATP'}</Label>
        <Label x="1" y="286" fontSize="16" fill="var(--muted)">{tr('סינתאז','synthase')}</Label>
      </g>
      <Label x={xs[0]+51} y="297" fontSize="16" fill="var(--muted)">{'NADH → NAD⁺'}</Label>
      <Label x={xs[3]} y="297" fontSize="16" fill="var(--muted)">{'O₂ → H₂O'}</Label>
      <Label x={width-89} y="321" fontSize="16" fill="var(--muted)">{'ADP + Pᵢ → ATP'}</Label>
      <g data-move="nadh" opacity="0"><CarrierToken/></g>
      <g data-move="nad" opacity="0"><CarrierToken oxidized/></g>
      {Array.from({length:8},(_,i)=><g key={i} data-move={`electron${i}`} opacity="0"><circle r="3.6" fill="#3c877d" stroke="#e4fff5" strokeWidth="1.2"/></g>)}
      {[0,1].map(i=><g key={i} data-move={`flavin-electron${i}`} opacity="0"><circle r="3.6" fill="#3c877d" stroke="#e4fff5" strokeWidth="1.2"/></g>)}
      {Array.from({length:10},(_,i)=><g key={i} data-move={`pump${i}`} opacity="0"><Proton/></g>)}
      {Array.from({length:30},(_,i)=><g key={i} data-move={`pool${i}`} opacity="0"><Proton/></g>)}
      {Array.from({length:4},(_,i)=><g key={i} data-move={`return${i}`} opacity="0"><Proton/></g>)}
      <g data-move="oxygen" opacity="0"><Molecule kind="O₂"/></g><g data-move="water" opacity="0"><Molecule kind="H₂O"/></g>
      <g data-move="adp" opacity="0"><Nucleotide/></g><g data-move="atp" opacity="0"><Nucleotide atp/></g>
      <g data-move="pi" opacity="0"><circle r="5" fill="#edd498" stroke="#ac7837" strokeWidth="1.2"/><circle r="1.5" fill="#ac7837"/></g>
      <g data-zoom-callout=""><path data-zoom-leader="" d="" fill="none" stroke="var(--muted)" strokeWidth="1.1"/><Label data-zoom-label="" x={width/2} y="23" fontSize="16" fill="var(--ink)">{tr('ממברנת הקריסטה · הגדלה','Crista membrane · enlarged')}</Label></g>
    </g>
    <g data-move="carrier0" opacity="0"><CarrierToken/></g><g data-move="carrier1" opacity="0"><CarrierToken/></g>
    <g data-move="flavin" opacity="0"><Badge text="FADH₂" color="#ac7837"/></g>
    <Label data-yield="" x={mobile?240:480} y={mobile?695:740} fontSize="17" fill="var(--ink)" opacity="0">{tr('כ־30–32 ATP לגלוקוז','About 30–32 ATP per glucose')}</Label>
  </>;
});

const CSS = `
.rc{--bg:#fafbf9;--ink:#25364a;--muted:#586b7d;--border:#cbd7d9;--matrix:#edf4ef;--panel:#edf5f8;--badge:#f7faf6;--route:#8b9e94;--button:#fff;background:var(--bg);color:var(--ink);border:1px solid var(--border);border-radius:20px;overflow:hidden;font:15px/1.55 system-ui,sans-serif;text-align:start;isolation:isolate}
.dark .rc,.rc[data-theme=dark]{--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--matrix:#203b35;--panel:#203845;--badge:#253945;--route:#91ab9d;--button:#253945}
@media(prefers-color-scheme:dark){.rc:not([data-theme=light]){--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--matrix:#203b35;--panel:#203845;--badge:#253945;--route:#91ab9d;--button:#253945}}
.rc *{box-sizing:border-box}.rc header{padding:20px 24px 12px}.rc-kicker{font-size:12px;color:var(--muted);letter-spacing:.06em}.rc h2{font-size:25px;line-height:1.3;margin:4px 0}.rc button{background:var(--button);color:var(--ink);border:1px solid var(--border);border-radius:9px;padding:8px 12px;font:inherit;cursor:pointer;min-height:42px}.rc button:focus-visible,.rc input:focus-visible{outline:3px solid #398bb3;outline-offset:3px}.rc button[aria-current=true]{background:#346451;color:white;border-color:#346451}.rc button:disabled{opacity:.6;cursor:default}.rc nav{display:flex;gap:6px;flex-wrap:wrap;padding:0 24px 12px}.rc nav button{font-size:13px;flex:1;white-space:nowrap}.rc svg.rc-movie{display:block;width:100%;height:auto;direction:ltr}.rc svg text{font-family:system-ui,sans-serif;unicode-bidi:plaintext}.rc-caption{margin:8px 24px;min-height:134px;font-size:15px;line-height:1.65}.rc-caption strong{display:block;font-size:17px;margin-bottom:4px}.rc-controls{display:flex;align-items:center;gap:10px;padding:0 24px 14px;flex-wrap:wrap}.rc input[type=range]{flex:1;min-width:80px;accent-color:#548b75;direction:ltr}.rc output{font-variant-numeric:tabular-nums;white-space:nowrap;font-size:12px;direction:ltr}.rc label{display:flex;gap:5px;align-items:center;font-size:13px}.rc-legend{border-top:1px solid var(--border);padding:12px 24px;display:flex;gap:10px 20px;flex-wrap:wrap;font-size:13px}.rc-legend span{display:inline-flex;gap:6px;align-items:center}.rc i{display:inline-block;width:11px;height:11px;border-radius:50%}.rc-note{font-size:11px;color:var(--muted);padding:0 24px 14px}.rc-reduced{font-size:13px;color:var(--muted);padding:0 24px 8px}
@media(max-width:600px){.rc header{padding:16px 14px 10px}.rc h2{font-size:21px}.rc nav{padding:0 14px 8px}.rc nav button{font-size:12px;padding:6px;flex-basis:28%}.rc-caption{margin:8px 14px;min-height:205px;font-size:14px}.rc-controls{padding:0 14px 12px}.rc-legend{padding:12px 14px;gap:10px 14px}.rc-note{padding:0 14px 14px}.rc-reduced{padding:0 14px 8px}}
`;

export default function RespirationScene({ lang = "he", processName, theme }: Props) {
  const en = lang === "en", tr = (he:string,english:string)=>en?english:he;
  const root = useRef<HTMLElement>(null), svg = useRef<SVGSVGElement>(null);
  const seek = useRef<(t:number)=>void>(()=>{}), clock = useRef(0), playing = useRef(true), looping = useRef(true), reduced = useRef(false);
  const [running,setRunning] = useState(true), [loop,setLoop] = useState(true), [time,setTime] = useState(0), [reduce,setReduce] = useState(false), [mobile,setMobile] = useState(false);
  const uid = "resp" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const chapter = chapterAt(time);
  useEffect(()=>{const media=matchMedia('(max-width:600px)');const update=()=>setMobile(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
  useEffect(()=>{
    const host=root.current!, movie=svg.current!;
    const q=(s:string)=>movie.querySelector(s)!;
    const movers=new Map<string,Element>();movie.querySelectorAll('[data-move]').forEach(e=>movers.set(e.getAttribute('data-move')!,e));
    const zoom=q('[data-zoom]'),gly=q('[data-gly]'),cycle=q('[data-cycle-carbon]'),gradient=q('[data-gradient]'),rotor=q('[data-rotor]'),shaft=q('[data-shaft]');
    const left=q('[data-anchor-left]'),right=q('[data-anchor-right]'),ol=q('[data-over-label]'),op=q('[data-over-leader]'),zl=q('[data-zoom-label]'),zp=q('[data-zoom-leader]');
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const xs=mobile?[53,132,223,308,402]:[90,245,430,615,795],w=mobile?460:900;
    const overview=(p:Point):Point=>mobile?p:[170+p[0]*1.25,p[1]*1.25];
    const zOrigin:Point=mobile?[10,335]:[30,380],anchor=overview([362,89]);
    let visible=true,docVisible=!document.hidden,raf=0,last=0,uiTime=-1;
    const move=(id:string,p:Point,a=1)=>{const e=movers.get(id)!;e.setAttribute('transform',`translate(${p[0].toFixed(3)} ${p[1].toFixed(3)})`);e.setAttribute('opacity',clamp(a).toFixed(4))};
    function draw(t:number){
      clock.current=t;const s=sceneState(t),reset=s.reset;
      const zscale=mix(.025,1,s.zoom),zo=lerp(anchor,zOrigin,s.zoom);
      const detailAlpha=ramp(s.zoom,.88,1);
      zoom.querySelectorAll('text,[data-zoom-leader]').forEach(e=>e.setAttribute('opacity',String(detailAlpha)));
      movie.setAttribute('viewBox',`0 0 ${mobile?480:960} ${mix(mobile?310:400,mobile?714:758,s.zoom)}`);
      zoom.setAttribute('transform',`translate(${zo[0]} ${zo[1]}) scale(${zscale})`);zoom.setAttribute('opacity',String(s.zoom));
      const top=overview([0,36])[1],edgeLeft=zo[0]+8*zscale,edgeRight=zo[0]+(w-8)*zscale;
      left.setAttribute('d',`M ${anchor[0]-7* (mobile?1:1.25)} ${overview([0,107])[1]} V ${top} H ${zOrigin[0]+8} V ${zo[1]} H ${edgeLeft}`);
      right.setAttribute('d',`M ${anchor[0]+7* (mobile?1:1.25)} ${overview([0,107])[1]} H ${zOrigin[0]+w-8} V ${zo[1]} H ${edgeRight}`);
      left.setAttribute('opacity',String(ramp(s.zoom,.86,1)));right.setAttribute('opacity',String(ramp(s.zoom,.86,1)));
      gly.setAttribute('opacity',String(1-ramp(t,1,9)+ramp(t,106,112)));
      q('[data-acetyl-label]').setAttribute('opacity',String(ramp(t,23,25)*(1-ramp(t,35,38))*reset));
      for(let i=0;i<2;i++){
        const split=ramp(t,2,9),entry=ramp(t,15+i*1.5,22+i*1.5),oxid=ramp(t,23+i*1.3,26+i*1.3);
        let p=lerp([29,80],[65+i*40,145+i*19],split);
        if(t>15+i*1.5)p=bez([65+i*40,145+i*19],[125,146+i*13],[164,146+i*8],[211,143+i*5],entry);
        move(`py${i}`,p,ramp(t,2,4)*(1-oxid)*reset);
        const ac=bez([211,143+i*5],[245,144],[277,110],[337,112],ramp(t,25+i*1.3,32+i*1.3));
        move(`acet${i}`,ac,oxid*(1-ramp(t,31+i*1.3,34+i*1.3))*reset);
      }
      for(let i=0;i<6;i++){
        const start=i<2?24+i*1.3:34+(i-2)*2.8,u=ramp(t,start,start+8);
        const origin:Point=i<2?[237,143+i*5]:[337+42*Math.cos((i-2)*1.1),154+42*Math.sin((i-2)*1.1)];
        move(`co${i}`,bez(origin,[origin[0]+18,origin[1]-35],[425,40],[447,23],u),windowAt(t,start,start+9)*reset);
      }
      const a=-Math.PI/2+TAU*2*ramp(t,31,47),carbonWidth=mix(16.5,9.9,ramp(t,34,40));
      cycle.setAttribute('transform',`translate(${337+42*Math.cos(a)-carbonWidth} ${154+42*Math.sin(a)}) scale(.5)`);
      cycle.setAttribute('opacity',String(windowAt(t,31,48)*reset));
      // Carbon loss is interpolated, not a swap of molecular drawings.
      const carbons=cycle.querySelectorAll('g[data-part=carbon]>g');carbons.forEach((e,i)=>e.setAttribute('opacity',String(i<4?1:1-ramp(t,i===5?34:38,i===5?36:40))));
      const bond=cycle.querySelector('path');if(bond)bond.setAttribute('d',`M 0 0 H ${mix(65,39,ramp(t,34,40))}`);
      move('cycle-atp',lerp([285,230],[285,252],ramp(t,40,45)),windowAt(t,39,48)*reset);
      for(let i=0;i<2;i++){
        const start=i===0?27:40,end=i===0?55:58,origin=overview(i===0?[229,163]:[368,175]);
        const dest:Point=[zOrigin[0]+xs[0]+42,zOrigin[1]+202];
        move(`carrier${i}`,bez(origin,[origin[0]-60,origin[1]+65],[dest[0]-30,dest[1]-55],dest,ramp(t,start,end)),windowAt(t,start,end+1,1.2)*reset);
      }
      // FAD stays enzyme-bound; the travelling badge is an accounting annotation only.
      move('flavin',overview([403,159]),windowAt(t,39,47)*reset);
      const n=mod(t-53,10),nv=ramp(t,53,56)*reset*(1-ramp(t,104,108));
      // Keep carrier traffic in the corridor beside I, above the reaction label.
      move('nadh',lerp([xs[0]+40,264],[xs[0]+37,204],ramp(n,0,3)),windowAt(n,0,3.8,.5)*nv);
      move('nad',lerp([xs[0]+37,204],[xs[0]+35,264],ramp(n,3,7)),windowAt(n,3,8,.6)*nv);
      const qx=(xs[1]+xs[2])/2,cyx=(xs[2]+xs[3])/2;
      q('[data-q]').setAttribute('transform',`translate(${qx+9*Math.sin(t*.7)*s.chain} 128)`);
      q('[data-cyt]').setAttribute('transform',`translate(${cyx+11*Math.sin(t*.6)*s.chain} 79)`);
      const points:Point[]=[[xs[0]+42,202],[xs[0]+14,151],[xs[0],128],[qx,128],[xs[2],128],[cyx,79],[xs[3],125],[xs[3]+8,180]];
      for(let i=0;i<8;i++){
        const u=mod((t-51)/10+i/8,1),leg=u*7,j=Math.min(6,Math.floor(leg));
        const p=lerp(points[j],points[j+1],ease(leg-j));
        // I-to-Q/Q-to-III transport passes behind II in this projection.
        const occlusion=j===2||j===3?ease((Math.abs(p[0]-xs[1])-24)/7):1;
        move(`electron${i}`,p,windowAt(u,0,1,.05)*s.chain*occlusion);
      }
      for(let i=0;i<2;i++){
        const u=mod((t-56)/6+i/2,1);
        move(`flavin-electron${i}`,bez([xs[1],174],[xs[1]+4,146],[qx-18,130],[qx,128],u),windowAt(u,0,1,.07)*s.chain);
      }
      // 4/4/2 visible pumping tracks per pair; Complex II has no pumping track.
      for(let i=0;i<10;i++){
        const j=i<4?0:i<8?2:3,k=i<4?i:i<8?i-4:i-8,group=i<8?4:2;
        const u=mod((t-54)/7+k/group,1);
        move(`pump${i}`,[xs[j]-20,mix(203,66,u)],windowAt(u,0,1,.1)*s.chain);
      }
      gradient.setAttribute('opacity',String(.16*s.gradient));
      for(let i=0;i<30;i++){
        const high=i<25,j=high?i:i-25,x=high?23+(i%12)*(w-48)/12:w*(.42+j*.055);
        const y=high?67+Math.floor(i/12)*14:310;
        move(`pool${i}`,[x+2.3*Math.sin(t*.6+i),y+1.7*Math.cos(t*.7+i)],high?ramp(s.gradient,(i%25)/30,(i%25)/30+.16):s.chain*.6);
      }
      const flow=s.synth;
      for(let i=0;i<4;i++){
        const u=mod((t-86)/5+i/4,1);
        const p=bez([xs[4]-14,66],[xs[4]-36,103],[xs[4]-8,142],[xs[4]+29,173],u);
        move(`return${i}`,p,windowAt(u,0,1,.08)*flow);
      }
      // The stationary head surrounds a rotating ring/shaft. A blue rotor mark exposes rotation.
      rotor.setAttribute('transform',`translate(6 130) rotate(${s.rotor})`);
      shaft.setAttribute('d',`M ${6+4*Math.sin(s.rotor*Math.PI/180)} 156 Q ${6-6*Math.sin(s.rotor*Math.PI/180)} 175 ${6+4*Math.sin(s.rotor*Math.PI/180)} 193`);
      movie.querySelectorAll('[data-catalytic]').forEach((e,i)=>e.setAttribute('rx',String(8+1.8*Math.sin(s.rotor*Math.PI/180+i*TAU/3)*flow)));
      const product=mod((t-86)/6,1);
      move('adp',bez([xs[4]-65,290],[xs[4]-60,260],[xs[4]-45,229],[xs[4]-13,212],ramp(product,0,.48)),windowAt(product,0,.52,.07)*flow);
      move('pi',lerp([xs[4]-60,230],[xs[4]-13,212],ramp(product,.1,.48)),windowAt(product,.1,.52,.06)*flow);
      move('atp',bez([xs[4]+16,212],[xs[4]+30,218],[xs[4]+30,235],[xs[4]+28,250],ramp(product,.45,1)),windowAt(product,.45,1,.07)*flow);
      const oxygen=mod((t-55)/8,1),ox=xs[3];
      move('oxygen',bez([ox+48,301],[ox+48,247],[ox+44,197],[ox+10,168],ramp(oxygen,0,.53)),windowAt(oxygen,0,.58,.08)*s.chain);
      move('water',bez([ox+10,168],[ox+46,194],[ox+50,247],[ox+48,302],ramp(oxygen,.5,1)),windowAt(oxygen,.5,1,.08)*s.chain);
      q('[data-yield]').setAttribute('opacity',String(ramp(t,91,95)*reset));
      q('[data-yield]').setAttribute('y',String(mix(mobile?310:400,mobile?714:758,s.zoom)-19));
      // Leaders have a dedicated margin, with endpoints on actual structure contours.
      const overTarget:Point=t<16?[92,139]:t<30?[160,146]:[337,196];
      const prevTarget:Point=t<30?[92,139]:[160,146];
      const boundary=t<16?0:t<30?16:30;
      const target=lerp(t<16?overTarget:lerp(prevTarget,overTarget,ramp(t,boundary,boundary+1.5)),[92,139],ramp(t,104,112));
      const entryLabelX=mix(70,166,ramp(t,16,17.5));
      const labelX=mix(mix(entryLabelX,337,ramp(t,30,32)),70,ramp(t,104,112));
      q('[data-over-callout]').setAttribute('opacity',String((1-windowAt(t,29.8,32.2,.2))*(1-windowAt(t,104,112,1))));
      ol.setAttribute('x',String(labelX));ol.textContent=isolateRuns(en?(t<16||t>108?'Glucose → pyruvate':t<30?'Pyruvate carrier':'2 turns per glucose'):(t<16||t>108?'גלוקוז → פירובט':t<30?'נשא פירובט':'סיבובים לגלוקוז: 2'));
      // The glycolysis leader stays entirely in the cytosol. The carrier leader
      // approaches from outside the organelle, rather than cutting across it.
      const side=ramp(t,16,17.5)*(1-ramp(t,30,32))*(1-ramp(t,104,112));
      const cycleLeader=ramp(t,30,32)*(1-ramp(t,104,112));
      const elbowX=mix(mix(120,140,side),337,cycleLeader);
      const elbowY=mix(mix(153,170,side),245,cycleLeader);
      op.setAttribute('d',`M ${labelX} 258 V 245 H ${elbowX} V ${elbowY} L ${target[0]} ${target[1]}`);
      const callout = t<70?trLocal('אלקטרונים אל החמצן','Electrons to oxygen'):t<86?trLocal('פרוטונים (H⁺) מצטברים בחוץ','H⁺ accumulates outside'):trLocal('פרוטונים (H⁺) חוזרים דרך Fₒ','H⁺ returns through Fₒ');
      const gradientPoint:Point=[23+11*(w-48)/12+2.3*Math.sin(t*.6+11),61+1.7*Math.cos(t*.7+11)];
      const za=lerp([xs[2]-27,91],gradientPoint,ramp(t,70,72));
      const [zx,zy]=lerp(za,[xs[4]-25,104],ramp(t,86,88));
      zl.textContent=isolateRuns(callout);zp.setAttribute('d',`M ${w/2} 29 V 36 H ${zx} V ${zy}`);
      zl.setAttribute('x',String(w/2));
      host.dataset.time=t.toFixed(3);host.dataset.chapter=String(chapterAt(t));
    }
    function trLocal(he:string,english:string){return en?english:he}
    function sync(t:number){draw(t);setTime(t);uiTime=t}
    seek.current=t=>{sync(Math.max(0,Math.min(DURATION,t)));last=0};
    function tick(now:number){raf=0;if(!playing.current||reduced.current||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min((now-last)/1000,.08);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(t-uiTime)>.12||!playing.current){setTime(t);uiTime=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)}
    function start(){if(!raf&&visible&&docVisible&&playing.current&&!reduced.current)raf=requestAnimationFrame(tick)}
    function stop(){cancelAnimationFrame(raf);raf=0;last=0}
    function onMotion(){reduced.current=media.matches;setReduce(media.matches);if(media.matches){stop();playing.current=false;setRunning(false);sync(CHAPTERS[chapterAt(clock.current)].still)}else start()}
    function onVisibility(){docVisible=!document.hidden;if(docVisible)start();else stop()}
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;host.dataset.offscreen=String(!visible);if(visible)start();else stop()},{threshold:.01});observer.observe(host);
    const wake=()=>{if(playing.current)start();else stop()};
    host.addEventListener('rc-toggle',wake);document.addEventListener('visibilitychange',onVisibility);media.addEventListener('change',onMotion);
    draw(clock.current);onMotion();start();
    return()=>{stop();observer.disconnect();host.removeEventListener('rc-toggle',wake);document.removeEventListener('visibilitychange',onVisibility);media.removeEventListener('change',onMotion)};
  },[mobile,en]);
  const jump=(t:number)=>seek.current(t);
  const toggle=()=>{if(clock.current>=DURATION)jump(0);playing.current=!playing.current;setRunning(playing.current);root.current?.dispatchEvent(new Event('rc-toggle'))};
  return <section ref={root} className="rc" data-theme={theme} data-time="0" dir={en?"ltr":"rtl"} aria-label={tr('נשימה תאית — סרט רציף','Cellular respiration — continuous movie')}>
    <style>{CSS}</style>
    <header><div className="rc-kicker">{tr('סרט רציף · מגלוקוז לכוח מניע','CONTINUOUS MOVIE · FROM GLUCOSE TO MOTIVE FORCE')}</div><h2>{processName||tr('נשימה תאית','Cellular respiration')}</h2></header>
    <nav aria-label={tr('פרקים בסרט','Movie chapters')}>{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduce?c.still:c.start)}>{isolateRuns(en?c.en:c.he)}</button>)}</nav>
    <svg ref={svg} className="rc-movie" viewBox={mobile?'0 0 480 714':'0 0 960 758'} role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
      <title id={`${uid}-title`}>{isolateRuns(tr('מגלוקוז ל־ATP במיטוכונדריון','From glucose to ATP in a mitochondrion'))}</title>
      <desc id={`${uid}-desc`}>{isolateRuns(tr('מיטוכונדריון קבוע עם הגדלת קריסטה מעוגנת: פחמנים, נשאי אלקטרונים, קומפלקסים I–IV, מפל פרוטונים ורוטור ATP סינתאז.','Fixed mitochondrion and anchored crista enlargement: carbons, electron carriers, complexes I–IV, proton gradient and ATP synthase rotor.'))}</desc>
      <Artwork mobile={mobile} en={en} uid={uid}/>
    </svg>
    <p className="rc-caption" aria-live="polite" aria-atomic="true"><strong>{isolateRuns(en?CHAPTERS[chapter].en:CHAPTERS[chapter].he)}</strong>{isolateRuns(en?CHAPTERS[chapter].textEn:CHAPTERS[chapter].textHe)}</p>
    {reduce&&<div className="rc-reduced">{tr('תנועה מופחתת: תמונת מפתח לכל פרק; אפשר לגרור לעיון בכל רגע.','Reduced motion: chapter keyframes; scrub to inspect each moment.')}</div>}
    <div className="rc-controls"><button onClick={toggle} disabled={reduce} aria-label={running?tr('השהיה','Pause'):tr('ניגון','Play')}>{running&&!reduce?tr('❚❚ השהיה','❚❚ Pause'):tr('▶ ניגון','▶ Play')}</button><input type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>jump(Number(e.target.value))} aria-label={tr('מיקום בסרט','Movie position')}/><output>{isolateRuns(`${Math.floor(time)} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>{tr('לולאה','Loop')}</label></div>
    <div className="rc-legend"><span><i style={{background:'#688c78'}}/>{isolateRuns(tr('פחמן','Carbon'))}</span><span><i style={{background:'#a6c7b1',borderRadius:'40% 60%'}}/>{isolateRuns('NADH')}</span><span><i style={{background:'#3c877d'}}/>{isolateRuns(tr('אלקטרונים','Electrons'))}</span><span><i style={{background:'#c77c39'}}/>{isolateRuns('H⁺')}</span><span><i style={{background:'#b8dceb'}}/>{isolateRuns('O₂ / H₂O / CO₂')}</span><span><i style={{background:'#d4ad68'}}/>{isolateRuns('ATP')}</span></div>
    <div className="rc-note">{tr('איור מקורי סכמטי, ללא קנה מידה או קצב מדוד. המספרים מתייחסים לגלוקוז אחד, למעט תפוקות פרוטונים לזוג אלקטרונים. נקודות נעות הן המחשה, לא ספירת מולקולות; התהליכים חופפים בתא.','Original schematic; not to scale or measured kinetics. Totals are per glucose, except proton yields per electron pair. Moving particles illustrate flow rather than count molecules; processes overlap in cells.')}</div>
  </section>;
}
