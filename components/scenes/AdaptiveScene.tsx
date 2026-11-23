"use client";

import { memo, useEffect, useId, useRef, useState } from "react";

type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
type Point = [number, number];
export const DURATION = 132;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const ramp = (t: number, a: number, b: number) => { const u = clamp((t-a)/(b-a)); return u*u*(3-2*u); };
const windowAt = (t: number, a: number, b: number) => ramp(t,a,a+2)*(1-ramp(t,b-2,b));
const lerp = (a: Point, b: Point, u: number): Point => [mix(a[0],b[0],u),mix(a[1],b[1],u)];
export const isolate = (s: string) => s.replace(/[\u2066\u2069]/g, "").replace(/[A-Za-z0-9][A-Za-z0-9⁺⁻₀-₉]*(?:[ .+–−/=-]+[A-Za-z0-9][A-Za-z0-9⁺⁻₀-₉]*)*/g, r => "\u2066"+r+"\u2069");

export const CHAPTERS = [
 {start:0,still:9,he:"הגעה וזיהוי",en:"Arrival & recognition",text:"תא דנדריטי שבלע פתוגן מפרק את חלבוניו לפפטידים ונודד לבלוטת לימפה. הוא מציג פפטיד על MHC II באזור תאי T. תא T נאיבי בעל CD4 סורק את ההצגה: רק TCR מתאים מזהה את צירוף הפפטיד–MHC II, ו־CD4 תומך בקישור ובאיתות."},
 {start:14,still:23,he:"שני אותות",en:"Two signals",text:"אות ראשון: TCR מזהה פפטיד–MHC II, בסיוע CD4. אות שני: CD28 בתא T נקשר ל־B7 בתא הדנדריטי. זיהוי ללא גירוי משלים אינו מספיק להפעלה תקינה של תא T נאיבי. התקריב מעוגן לאותו מגע בבלוטה."},
 {start:28,still:40,he:"ברירה שבטית",en:"Clonal selection",text:"תא T המופעל מפריש IL-2, הפועל גם עליו ומעודד ריבוי. התא מתחלק ל־2, ל־4 ול־8: שבט בעל אותה ספציפיות TCR, ולא יצירת קולטן חדש בעקבות המפגש. צאצאים נעשים תאי עזר, כולל Tfh לעזרת תאי B; אחרים תומכים בתאי T ציטוטוקסיים או נעשים תאי זיכרון."},
 {start:47,still:56,he:"תא B לוכד אנטיגן",en:"B cell captures antigen",text:"תא B בזקיק קושר אנטיגן שלם באמצעות BCR — נוגדן הקשור לממברנה. האנטיגן נבלע, מתפרק, ופפטיד ממנו מוצג על MHC II. תא B ותא T יכולים לזהות אפיטופים שונים של אותו אנטיגן: תא T אינו מזהה את האנטיגן השלם."},
 {start:62,still:71,he:"עזרת תא T",en:"T-cell help",text:"בגבול אזור תאי T והזקיק, תא עזר מאותו שבט מזהה בתא B את הפפטיד–MHC II בעזרת TCR ו־CD4. CD40L בתא T נקשר ל־CD40 בתא B. ציטוקינים, ובהם IL-4 ובהקשר של Tfh גם IL-21, מסייעים לחלוקה ולהתמיינות. מרכז נבט בהמשך תומך בהבשלת זיקה ובהחלפת סוג הנוגדן."},
 {start:80,still:94,he:"פלזמה וזיכרון",en:"Plasma & memory",text:"תאי B מתרבים ומתמיינים לתאי פלזמה עשירים ברשתית תוך־תאית גבשושית, המפרישים אלפי נוגדנים בשנייה בעלי אותה ספציפיות אנטיגנית. תחילה IgM, ובהמשך עשויה להתרחש החלפת סוג, למשל ל־IgG; הבשלת זיקה יכולה לשפר את הקישור. נוגדנים מנטרלים נגיפים ורעלנים, מסמנים חיידקים לפאגוציטוזה ומפעילים משלים. נוצרים גם תאי זיכרון B ו־T ארוכי חיים."},
 {start:104,still:123,he:"תגובה חוזרת",en:"Recall response",text:"לאחר סילוק הזיהום נותרים תאי זיכרון, ולעיתים גם תאי פלזמה ארוכי חיים. בחשיפה חוזרת לאותו אנטיגן, התגובה מהירה וחזקה יותר, ובתגובה טיפוסית לאנטיגן חלבוני עשירה ב־IgG בעל זיקה גבוהה. זהו עקרון החיסון. הגרף סכמטי: הסמן עוקב אחרי הרמה לאורך זמן; ציר הזמן אינו משך הסרט."},
] as const;
export const chapterAt = (t: number) => Math.max(0,CHAPTERS.findLastIndex(c=>t>=c.start));

// Shared coordinates for the visible overview and its anchored close-up leaders.
export function stateAt(t: number) {
 const dc: Point = [mix(73,180,ramp(t,0,9)),140];
 const scan = ramp(t,5,14);
 const helper = ramp(t,45,64);
 const tc: Point = [mix(mix(400,278,scan),510,helper),mix(mix(100,140,scan),150,helper)];
 const bc: Point = [mix(653,594,ramp(t,56,64)),mix(111,150,ramp(t,56,64))];
 const site = lerp([229,140],[552,150],ramp(t,55,64));
 return {dc,tc,bc,site,synapse:windowAt(t,10,48),help:windowAt(t,62,84),clone:windowAt(t,28,49),bclone:ramp(t,80,94),graph:ramp(t,101,107),recall:ramp(t,105,131)};
}
const pulse = (d: number, lag: number, rise: number, fall: number, peak: number) => d<=lag?0:peak*(1-Math.exp(-(d-lag)/rise))**3*Math.exp(-Math.max(0,d-lag-rise*3)/fall);
export const igmLevel = (day: number) => pulse(day,3,1.5,5,18)+pulse(day-35,2,1.3,5,19);
export const iggLevel = (day: number) => pulse(day,7,2,12,23)+pulse(day-35,1,1.4,38,112);
export function antibodyLevel(day: number) {return igmLevel(day)+iggLevel(day)}

const CSS = `
.ac{--bg:#fafbf8;--ink:#263d48;--muted:#5b717b;--border:#cbd7d7;--panel:#f1f5f0;--button:#fff;background:var(--bg);color:var(--ink);border:1px solid var(--border);border-radius:22px;overflow:hidden;font:15px/1.65 system-ui,sans-serif;text-align:start;isolation:isolate}
.dark .ac,.ac[data-theme=dark]{--bg:#14252e;--ink:#e4edf0;--muted:#b0c6cc;--border:#415c64;--panel:#20383d;--button:#263d47}
@media(prefers-color-scheme:dark){.ac:not([data-theme=light]){--bg:#14252e;--ink:#e4edf0;--muted:#b0c6cc;--border:#415c64;--panel:#20383d;--button:#263d47}}
.ac *{box-sizing:border-box}.ac header{padding:23px 26px 12px}.ac h2{font-size:27px;line-height:1.3;margin:3px 0}.ac .kicker{font-size:12px;letter-spacing:.03em;color:var(--muted)}.ac nav{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;padding:0 24px 14px}.ac button{font:inherit;background:var(--button);color:var(--ink);border:1px solid var(--border);border-radius:10px;min-height:42px;padding:7px 10px;cursor:pointer}.ac nav button{font-size:12px;padding:6px}.ac button[aria-current=true]{background:#356958;color:#fff;border-color:#356958}.ac button:disabled{opacity:.6}.ac button:focus-visible,.ac input:focus-visible{outline:3px solid #4498b3;outline-offset:3px}.ac-movie{display:block;width:100%;height:auto}.ac svg text{fill:var(--ink);font:16px system-ui,sans-serif;text-anchor:middle;direction:rtl;unicode-bidi:plaintext}.ac svg .small{font-size:14px}.ac svg .heading{font-size:20px;font-weight:650}.ac svg .muted{fill:var(--muted)}.ac .panel{fill:var(--panel);stroke:var(--border);stroke-width:1.2}.ac .leader{fill:none;stroke:var(--muted);stroke-width:1.3;stroke-linejoin:round}.ac .caption{margin:8px 26px 12px;font-size:16px;min-height:138px}.ac .caption strong{display:block;margin-bottom:4px}.ac .controls{display:flex;align-items:center;gap:10px;padding:0 26px 15px}.ac input[type=range]{min-width:40px;flex:1;direction:ltr;accent-color:#578d75}.ac output{font-size:12px;white-space:nowrap;direction:ltr;font-variant-numeric:tabular-nums}.ac .controls label{display:flex;gap:5px;align-items:center;font-size:13px}.ac .legend{display:flex;flex-wrap:wrap;gap:8px 20px;border-top:1px solid var(--border);padding:12px 26px;font-size:13px}.ac .legend span{display:flex;align-items:center;gap:7px}.ac i{display:inline-block;width:11px;height:11px;border-radius:50%}.ac .note,.ac .reduced{font-size:12px;color:var(--muted);padding:0 26px 14px}.ac .reduced{color:var(--ink)}
@media(max-width:600px){.ac header{padding:17px 14px 12px}.ac h2{font-size:23px}.ac nav{grid-template-columns:repeat(4,minmax(0,1fr));padding:0 12px 10px}.ac nav button{font-size:11px}.ac .caption{margin:8px 15px 12px;font-size:15px;min-height:245px}.ac .controls{padding:0 14px 14px;flex-wrap:wrap}.ac .controls button{font-size:13px}.ac .legend{padding:12px 15px;font-size:12px;gap:7px 12px}.ac .note,.ac .reduced{padding:0 15px 13px}.ac svg .small{font-size:17px}}
`;

function Antigen(){return <g><path d="M-13 -7 Q-5 -18 3 -10 Q17 -15 15 -3 Q25 6 12 12 Q4 23 -4 13 Q-19 17 -16 4 Q-26 -3 -13 -7Z" fill="#cc745c" stroke="#8d4537" strokeWidth="1.7"/><path d="M-6 -7 Q4 -13 9 -4" fill="none" stroke="#f6c2a0" strokeWidth="3" strokeLinecap="round"/><rect x="4" y="1" width="11" height="5" rx="2" fill="#f6d071" stroke="#7e552d" strokeWidth="1"/></g>}
function Y({color="#477da0"}:{color?:string}){return <path d="M0 13 V0 L-9 -11 M0 0 L9 -11 M-2 11 V0 L-11 -9 M2 11 V0 L11 -9" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>}
function Cell({uid,kind="t",r=37}:{uid:string;kind?:"t"|"b"|"plasma"|"memory";r?:number}){
 const b=kind!=="t",plasma=kind==="plasma",memory=kind==="memory";
 return <g data-cell-kind={kind}>
  <ellipse cx="2" cy={r*.87} rx={r*.91} ry={r*.23} fill="#112b34" opacity=".12"/>
  <ellipse rx={r} ry={plasma?r*.83:r} fill={`url(#${uid}-${b?'gold':'blue'})`} stroke={b?'#8e7040':'#3f6f88'} strokeWidth="1.7"/>
  <ellipse cx={plasma?-r*.35:-r*.08} cy={r*.08} rx={r*(plasma?.36:.67)} ry={r*.64} fill={b?'#9d855c':'#527c96'} opacity=".8"/>
  <path d={`M${-r*.46} ${-r*.48} Q${-r*.08} ${-r*.8} ${r*.35} ${-r*.42}`} fill="none" stroke="#f8fffa" strokeWidth="3" opacity=".53" strokeLinecap="round"/>
  {plasma&&<g data-er="">{Array.from({length:9},(_,i)=><g key={i}><path d={`M${-r*.06} ${-r*.64+i*r*.15} Q${r*.49} ${-r*.79+i*r*.16} ${r*.76} ${-r*.42+i*r*.12}`} fill="none" stroke="#78624e" strokeWidth={r*.025} strokeLinecap="round"/>{[0,1,2,3,4].map(j=><circle key={j} cx={r*(.08+j*.13)} cy={r*(-.65+i*.145+j*j*.006)} r={r*.013} fill="#5c514a"/>)}</g>)}<path d={`M${r*.14} ${r*.43} q${r*.22} ${-r*.1} ${r*.45} 0 m${-r*.42} ${r*.06} q${r*.2} ${-r*.08} ${r*.4} 0`} stroke="#b18156" fill="none" strokeWidth={r*.045}/></g>}
  {!plasma&&[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return <g key={i} transform={`translate(${Math.cos(a)*r} ${Math.sin(a)*r}) rotate(${a*180/Math.PI+90}) scale(.4)`}>{b?<Y color="#8c6a39"/>:<path d="M-4 4 V-8 M4 4 V-8 M-4 -8 L-7 -11 M4 -8 L7 -11" stroke="#316c8d" fill="none" strokeWidth="3"/>}</g>})}
  {memory&&<circle r={r+5} fill="none" stroke="#8b9f71" strokeWidth="2" strokeDasharray="3 4"/>}
 </g>;
}
function Dendritic({uid}:{uid:string}){return <g><ellipse cy="38" rx="43" ry="11" fill="#132c3d" opacity=".12"/><path d="M-29 -15 Q-66 -58 -44 -53 L-12 -31 Q0 -44 11 -32 L50 -52 Q66 -54 34 -17 Q53 -4 32 13 L51 47 Q52 61 18 30 Q0 43 -16 28 L-51 53 Q-66 55 -32 14 Q-51 2 -29 -15Z" fill={`url(#${uid}-violet)`} stroke="#7a6990" strokeWidth="2"/><path d="M-16 -5 Q-5 -24 12 -10 Q24 6 4 16 Q-19 19 -16 -5Z" fill="#877598"/><path d="M-30 -25 Q-7 -33 13 -23" stroke="#f6edfa" strokeWidth="3" opacity=".6" fill="none"/><g transform="translate(-2 20) scale(.35)"><Antigen/></g><path d="M28 -5 h12 v-4 m-12 14 h12 v4" stroke="#78638e" strokeWidth="4" fill="none"/><rect x="39" y="-3" width="10" height="6" rx="2" fill="#f2c765"/></g>}

function Label({x,y,text,to,small=false}:{x:number;y:number;text:string;to?:Point;small?:boolean}){return <g data-label={text}>
 {to&&<path data-leader="" className="leader" d={to[1]<y-10?`M${x} ${y-23} H${to[0]} V${to[1]}`:`M${x} ${y+8} V${y+17} H${to[0]} V${to[1]}`}/>}
 <text x={x} y={y} className={small?'small':undefined}>{isolate(text)}</text>
 </g>}

// The clone is a binary lineage. Daughters start at their parent's center, grow,
// separate, then become parents themselves. Nothing is swapped on chapter changes.
const TREE = Array.from({length:15},(_,i)=>{
 const gen=Math.floor(Math.log2(i+1)),first=2**gen-1,k=i-first;
 return {gen,point:[(k-(2**gen-1)/2)*64,gen*45] as Point,parent:i?Math.floor((i-1)/2):0};
});
function Clone({uid,prefix,b=false}:{uid:string;prefix:string;b?:boolean}){return <g>{TREE.map((_,i)=><g key={i} data-clone={`${prefix}-${i}`}><Cell uid={uid} kind={b?'b':'t'} r={prefix==='detail'?48:24}/></g>)}</g>}

const Artwork = memo(function Artwork({uid,mobile}:{uid:string;mobile:boolean}){
 const w=mobile?480:960,overviewScale=mobile?.49:1,overviewY=mobile?66:60;
 const panelY=mobile?338:425,panelW=mobile?440:880;
 const pairX=mobile?220:440;
 const graphW=mobile?332:690;
 const moleculeScale=mobile?1.4:1.8;
 const curve=(fn:(day:number)=>number)=>Array.from({length:241},(_,i)=>`${i?'L':'M'}${(i/4/60*graphW).toFixed(2)} ${(-fn(i/4)*1.85).toFixed(2)}`).join(' ');
 return <>
 <defs>
  <radialGradient id={`${uid}-blue`} cx="30%" cy="23%" r="80%"><stop stopColor="#e4eff1"/><stop offset=".52" stopColor="#a4cbd9"/><stop offset="1" stopColor="#608da7"/></radialGradient>
  <radialGradient id={`${uid}-gold`} cx="28%" cy="20%" r="85%"><stop stopColor="#fbefd6"/><stop offset=".5" stopColor="#dbc28d"/><stop offset="1" stopColor="#ab8757"/></radialGradient>
  <radialGradient id={`${uid}-violet`} cx="30%" cy="20%" r="85%"><stop stopColor="#e9e2f0"/><stop offset=".55" stopColor="#c5b3d3"/><stop offset="1" stopColor="#9384ac"/></radialGradient>
  <linearGradient id={`${uid}-node`} x2="0" y2="1"><stop stopColor="#a0b49b" stopOpacity=".23"/><stop offset="1" stopColor="#93b9b0" stopOpacity=".07"/></linearGradient>
 </defs>
 <text x={w/2} y="26" className="heading">בלוטת לימפה · מרחב אחד, תגובה נבנית</text>
 <g transform={`translate(${mobile?24:40} ${overviewY}) scale(${overviewScale})`} data-overview="">
  <path d="M60 20 C196 -12 458 3 578 8 C734 -20 900 17 870 149 C855 255 780 309 635 306 C508 310 461 278 323 293 C149 314 20 239 26 136 C5 77 12 34 60 20Z" fill={`url(#${uid}-node)`} stroke="#94aa96" strokeWidth="2"/>
  <path d="M530 21 Q480 134 533 278" stroke="#a4b8a7" strokeDasharray="5 7" fill="none"/>
  <ellipse cx="650" cy="118" rx="133" ry="99" fill="#d6c99f" opacity=".13" stroke="#b69a68" strokeWidth="2"/>
  <path d="M27 83 Q65 87 89 112 M782 285 Q821 293 856 274" stroke="#83a99b" strokeWidth="11" fill="none" opacity=".4"/>
  {Array.from({length:22},(_,i)=><circle key={i} cx={90+(i*137)%710} cy={35+(i*47)%240} r={4+i%3} fill={i%2?'#96afa0':'#b7c9b9'} opacity=".18"/>)}
  <g data-move="dc"><g transform="scale(1.12)"><Dendritic uid={uid}/></g></g>
  <g data-move="tc"><Cell uid={uid} r={46}/><circle data-activation="" r="57" fill="none" stroke="#54978d" strokeWidth="2" opacity="0"/></g>
  <g data-move="bc"><circle data-b-active="" r="57" fill="#e5c476" fillOpacity=".14" stroke="#b8994e" strokeWidth="3"/><Cell uid={uid} kind="b" r={46}/><g transform="translate(-2 -40) scale(.75)"><Y color="#876834"/></g><g data-b-pmhc="" transform="translate(-39 0) rotate(180)" opacity="0"><path d="M0 -7 h11 v4 M0 7 h11 v-4" stroke="#826a44" strokeWidth="4"/><rect x="10" y="-3" width="8" height="6" rx="2" fill="#f2c765"/></g></g>
  <g data-move="native"><Antigen/></g>
  <g data-move="vesicle" opacity="0"><circle r="16" fill="#c1a579" stroke="#90734c" strokeWidth="1.5"/><g transform="scale(.5)"><Antigen/></g></g>
  <g data-move="peptide" opacity="0"><rect x="-7" y="-3" width="14" height="6" rx="2" fill="#f2c765" stroke="#84662d"/></g>
  <g transform="translate(278 115) scale(.75)"><Clone uid={uid} prefix="t"/></g>
  <g transform="translate(594 133) scale(.6)"><Clone uid={uid} prefix="b" b/></g>
  {Array.from({length:6},(_,i)=><circle key={i} data-il2-over={i} r="3" fill="#c88d50" opacity="0"/>)}
  <g data-move="plasma0" opacity="0"><Cell uid={uid} kind="plasma" r={37}/></g>
  <g data-move="plasma1" opacity="0"><Cell uid={uid} kind="plasma" r={34}/></g>
  <g data-move="memoryB" opacity="0"><Cell uid={uid} kind="memory" r={29}/></g>
  <g data-move="memoryT" opacity="0"><Cell uid={uid} r={22}/><circle r="28" fill="none" stroke="#8b9f71" strokeDasharray="3 4" strokeWidth="2"/></g>
  {Array.from({length:14},(_,i)=><g key={i} data-move={`ab${i}`} opacity="0"><Y/></g>)}
  <g data-focus=""><rect x="-18" y="-35" width="36" height="70" rx="9" fill="none" stroke="#5c948c" strokeWidth="2" strokeDasharray="4 3"/></g>
 </g>
 <g data-map-labels="">
  <text x={mobile?136:270} y={mobile?244:392}>{isolate('אזור תאי T · תא דנדריטי')}</text>
  <text x={mobile?349:722} y={mobile?273:392}>{isolate('זקיק · תאי B')}</text>
  <text x={w/2} y={mobile?307:417} className="small muted" data-map-phase="">אנטיגן מגיע מן הרקמה</text>
 </g>
 <path data-anchor="" className="leader" strokeDasharray="4 4"/>
 <g transform={`translate(${mobile?20:40} ${panelY})`}>
  <rect className="panel" width={panelW} height={mobile?560:480} rx="20"/>
  <text x={panelW/2} y="31" className="heading" data-detail-title="">תקריב מעוגן · המגע שמתחיל תגובה</text>
  <g data-synapse="" transform={`translate(${pairX} ${mobile?167:166})`}>
   <g transform={`scale(${moleculeScale})`}>
   <g data-apc-surface=""><path d={`M-110 -19 Q0 16 110 -19 V-45 H-110Z`} fill={`url(#${uid}-violet)`}/><path d="M-110 -19 Q0 16 110 -19" fill="none" stroke="#8b789e" strokeWidth="5"/><path data-b-surface="" d={`M-110 -19 Q0 16 110 -19 V-45 H-110Z`} fill={`url(#${uid}-gold)`} opacity="0"/></g>
   <g data-t-surface=""><path d="M-110 122 Q0 87 110 122 V149 H-110Z" fill={`url(#${uid}-blue)`}/><path d="M-110 122 Q0 87 110 122" fill="none" stroke="#4c8097" strokeWidth="5"/></g>
   <g data-pmhc=""><path d="M-2 1 V31 M10 1 V31 M-8 28 V42 H16 V28" fill="none" stroke="#8b709c" strokeWidth="7" strokeLinejoin="round"/><rect x="-7" y="37" width="23" height="6" rx="3" fill="#f2c765" stroke="#946b2b" strokeWidth="1.3"/></g>
   <g data-tcr=""><path d="M-3 104 V64 M10 104 V64 M-3 64 L-9 52 V45 M10 64 L16 52 V45" stroke="#347b9e" strokeWidth="6" fill="none" strokeLinecap="round"/></g>
   <path data-cd4="" d="M48 105 V59 L16 32" stroke="#5c9683" strokeWidth="6" fill="none" strokeLinecap="round"/>
   <g data-costim=""><path d="M-65 -1 V48 Q-57 57 -49 48 V-1" fill="#a5b49a" stroke="#70896b" strokeWidth="2"/><path d="M-62 107 V59 Q-56 46 -51 59 V107" fill="#7da7b8" stroke="#417b93" strokeWidth="2"/></g>
   <g data-cd40="" opacity="0"><path d="M-62 0 V48 Q-55 57 -48 48 V0" fill="#dcc18c" stroke="#957440" strokeWidth="2"/><path d="M-66 106 V58 Q-56 43 -45 58 V106" fill="#7da7b8" stroke="#417b93" strokeWidth="2"/></g>
   </g>
   <g data-labels-first="">
    <Label x={mobile?-168:-310} y={4*moleculeScale} text="MHC II" to={[-8*moleculeScale,25*moleculeScale]}/>
    <Label x={mobile?168:310} y={28*moleculeScale} text="פפטיד" to={[17*moleculeScale,40*moleculeScale]}/>
    <Label x={mobile?168:310} y={77*moleculeScale} text="CD4" to={[48*moleculeScale,82*moleculeScale]}/>
    <Label x={mobile?168:310} y={127*moleculeScale} text="TCR" to={[10*moleculeScale,89*moleculeScale]}/>
    <Label x={mobile?-168:-310} y={59*moleculeScale} text="B7" to={[-65*moleculeScale,30*moleculeScale]}/>
    <Label x={mobile?-168:-310} y={118*moleculeScale} text="CD28" to={[-62*moleculeScale,86*moleculeScale]}/>
   </g>
   <g data-labels-help="" opacity="0">
    <Label x={mobile?-168:-310} y={4*moleculeScale} text="MHC II" to={[-8*moleculeScale,25*moleculeScale]}/>
    <Label x={mobile?168:310} y={28*moleculeScale} text="פפטיד" to={[17*moleculeScale,40*moleculeScale]}/>
    <Label x={mobile?168:310} y={77*moleculeScale} text="CD4" to={[48*moleculeScale,82*moleculeScale]}/>
    <Label x={mobile?168:310} y={127*moleculeScale} text="TCR" to={[10*moleculeScale,89*moleculeScale]}/>
    <Label x={mobile?-168:-310} y={59*moleculeScale} text="CD40" to={[-62*moleculeScale,30*moleculeScale]}/>
    <Label x={mobile?-168:-310} y={118*moleculeScale} text="CD40L" to={[-62*moleculeScale,86*moleculeScale]}/>
   </g>
   <text y={-59*moleculeScale} data-apc-name="">תא דנדריטי</text><text data-t-name="" y={mobile?250:285}>{isolate('תא T · CD4')}</text>
   {Array.from({length:7},(_,i)=><circle key={i} data-cytokine={i} r="6" fill="#c88d50" opacity="0"/>)}
   <text y={mobile?294:308} data-cytokine-label="" className="small muted">{isolate('אות ראשון + גירוי משלים')}</text>
  </g>
  <g data-clone-detail="" opacity="0" transform={`translate(${panelW/2} ${mobile?221:195})`}>
   <g transform={`scale(${mobile?.62:1})`}><Clone uid={uid} prefix="detail"/></g>
   <text y={mobile?-136:-111} className="muted">{isolate('IL-2 · צאצאים עם אותה ספציפיות')}</text>
   <text y={mobile?255:240} data-clone-count="" className="heading">תא אחד</text>
   {Array.from({length:8},(_,i)=><circle key={i} data-il2-detail={i} r="6" fill="#c88d50" opacity="0"/>)}
  </g>
  <g data-capture-detail="" opacity="0" transform={`translate(${panelW/2} ${mobile?265:244})`}>
   <g transform="scale(1.6)"><Cell uid={uid} kind="b" r={68}/></g>
   <g transform="translate(0 -115) scale(1.8)"><Y color="#8c6a39"/></g>
   <g data-capture-antigen=""><Antigen/></g>
   <g data-capture-vesicle="" opacity="0"><circle r="22" fill="#bd9f71" stroke="#8f734a" strokeWidth="2"/><g transform="scale(.7)"><Antigen/></g></g>
   <g data-capture-peptide="" opacity="0"><rect x="-9" y="-4" width="18" height="8" rx="3" fill="#f2c765"/></g>
   <g transform="translate(108 0)"><path d="M0 -9 h14 v5 M0 9 h14 v-5" stroke="#8a744e" strokeWidth="5"/><rect data-capture-pmhc="" x="13" y="-3" width="10" height="6" fill="#f2c765" opacity="0"/></g>
   <Label x={mobile?-143:-244} y={-112} text="BCR" to={[-8,-122]}/>
   <Label x={mobile?143:244} y={30} text="MHC II" to={[122,0]}/>
   <text y="155" data-capture-caption="">אנטיגן שלם נקשר לקולטן</text>
  </g>
  <g data-fates="" opacity="0" transform={`translate(${panelW/2} 104)`}>
   <g data-fate-parent=""><Cell uid={uid} kind="b" r={55}/></g>
   <g data-fate-plasma=""><Cell uid={uid} kind="plasma" r={mobile?91:112}/><Label x={0} y={mobile?116:139} text="תא פלזמה" to={[0,mobile?78:95]}/></g>
   <g data-fate-memory=""><Cell uid={uid} kind="memory" r={mobile?48:64}/><Label x={0} y={mobile?81:99} text="תא זיכרון B" to={[0,mobile?54:70]}/></g>
   <g data-fate-memory-t=""><Cell uid={uid} r={mobile?37:43}/><Label x={0} y={mobile?68:76} text="תא זיכרון T" to={[0,mobile?42:48]}/></g>
   <text y="-38" className="muted">רשתית עשירה · ייצור והפרשת נוגדנים</text>
   <text y={mobile?424:352} className="small muted">{isolate('נוגדנים: תחילה IgM, ובהמשך גם IgG')}</text>
   {Array.from({length:30},(_,i)=><g data-move={`detail-ab${i}`} key={i}><Y/></g>)}
  </g>
  <g data-graph="" opacity="0" transform={`translate(${mobile?70:115} ${mobile?397:340})`}>
   <text x={graphW/2} y="-272" className="small muted">רמת נוגדנים · יחידות יחסיות</text>
   {[0,40,80,120].map(v=><g key={v}><path d={`M0 ${-v*1.85} H${graphW}`} stroke="#829a9f" strokeOpacity=".22"/><text x="-26" y={-v*1.85+5} className="small">{isolate(String(v))}</text></g>)}
   <path d={`M0 -240 V0 H${graphW+5}`} className="leader"/>
   <path data-igm-curve="" d={curve(igmLevel)} stroke="#bd8052" strokeWidth="3.5" fill="none"/>
   <path data-igg-curve="" d={curve(iggLevel)} stroke="#488d96" strokeWidth="4" fill="none"/>
   <text x={graphW*.15} y="-244" className="small" style={{fill:'#bd8052'}}>{isolate('IgM')}</text><text x={graphW*.37} y="-244" className="small" style={{fill:'#488d96'}}>{isolate('IgG')}</text>
   <path data-graph-trace="" stroke="#488d96" strokeWidth="3.6" fill="none"/>
   {[0,15,30,45,60].map(d=><text key={d} x={d/60*graphW} y="24" className="small">{isolate(String(d))}</text>)}
   <path d={`M${35/60*graphW} -239 V0`} stroke="#9c9f7a" strokeWidth="1.5" strokeDasharray="4 4"/>
   <text x={graphW*.24} y="-108" className="small">תגובה ראשונית</text>
   <text x={graphW*.78} y="-244" className="small">תגובה משנית</text>
   <path d={`M${graphW*.018} -9 V-55 H${graphW*.05}`} className="leader"/>
   <text x={graphW*.16} y="-75" className="small">זמן השהיה</text>
   <text x={graphW*.72} y="-209" className="small">שיא חוזר</text>
   <text x={graphW*.81} y="-169" className="small">מהירה וגבוהה יותר</text>
   <text x={graphW*.29} y="-44" className="small">שיא ראשון</text>
   <text x="0" y="53" className="small">חשיפה ראשונה</text>
   <text x={35/60*graphW} y="53" className="small">חשיפה חוזרת</text>
   <text x={graphW/2} y="89" className="small muted">ימים · אותו אנטיגן בשתי החשיפות</text>
   <g data-marker=""><path d="M0 0 V190" stroke="#b68943" strokeDasharray="3 4" opacity=".4"/><circle r="6.5" fill="#e2bc72" stroke="#815e2f" strokeWidth="2"/></g>
  </g>
 </g>
 </>;
});

export default function AdaptiveScene({lang="he",processName,theme}:Props){
 const root=useRef<HTMLElement>(null),svg=useRef<SVGSVGElement>(null),clock=useRef(0),playing=useRef(true),looping=useRef(true),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduce,setReduce]=useState(false),[mobile,setMobile]=useState(false);
 const uid=`adaptive-${useId().replace(/:/g,'')}`,chapter=chapterAt(time);
 useEffect(()=>{const mq=matchMedia('(max-width:600px)');const update=()=>setMobile(mq.matches);update();mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update)},[]);
 useEffect(()=>{
  if(!root.current||!svg.current)return;const host=root.current,movie=svg.current;
  const media=matchMedia('(prefers-reduced-motion:reduce)');let raf=0,last=0,uiTime=-1,visible=true,docVisible=!document.hidden;
  const q=(s:string)=>{const el=movie.querySelector<SVGElement>(s);if(!el)throw new Error(`Missing artwork ${s}`);return el};
  const opacity=(s:string,v:number)=>q(s).setAttribute('opacity',String(clamp(v)));
  const transform=(s:string,v:string)=>q(s).setAttribute('transform',v);
  const move=(id:string,p:Point,o=1,scale=1,rotate=0)=>{const sel=`[data-move="${id}"]`;transform(sel,`translate(${p[0]} ${p[1]}) rotate(${rotate}) scale(${scale})`);opacity(sel,o)};
  function clone(prefix:string,t:number,start:number,fadeEnd:number){
   TREE.forEach((n,i)=>{const birth=start+n.gen*5,death=birth+5;const u=n.gen?ramp(t,birth,birth+4):1;const point=(idx:number):Point=>{const item=TREE[idx],k=idx-(2**item.gen-1);return item.gen===0?[0,65]:item.gen===1?[(k-.5)*270,65]:item.gen===2?[(k-1.5)*180,65]:[(k%4-1.5)*180,Math.floor(k/4)*155-15]};const parent=prefix==='detail'?point(n.parent):TREE[n.parent].point,p=lerp(parent,prefix==='detail'?point(i):n.point,u);const o=(n.gen?ramp(t,birth,birth+.9):ramp(t,start-2,start))*(n.gen<3?1-ramp(t,death,death+1):1)*(1-ramp(t,fadeEnd-2,fadeEnd));transform(`[data-clone="${prefix}-${i}"]`,`translate(${p[0]} ${p[1]}) scale(${mix(.55,1,u)*(prefix==='detail'?mix(n.gen?1.3:2.1,1,ramp(t,28,44)):1)})`);opacity(`[data-clone="${prefix}-${i}"]`,o)});
  }
  function draw(t:number){
   clock.current=t;const s=stateAt(t),panelW=mobile?440:880,panelY=mobile?338:425;
   move('dc',s.dc);opacity('[data-b-active]',windowAt(t,47,84)*(.65+.25*Math.sin(t*2)));move('tc',s.tc,((1-ramp(t,28,30))+ramp(t,45,48))*(1-ramp(t,83,89)));move('bc',s.bc,1-ramp(t,80,83));
   const native=lerp([709,45],[653,65],ramp(t,47,51));move('native',native,windowAt(t,44,54));
   move('vesicle',lerp([653,76],[650,115],ramp(t,51,55)),windowAt(t,51,57));
   move('peptide',lerp([650,115],[607,124],ramp(t,55,60)),windowAt(t,55,61));
   opacity('[data-b-pmhc]',ramp(t,59,62));opacity('[data-activation]',Math.max(windowAt(t,19,46),windowAt(t,62,83))*(.65+.25*Math.sin(t*2)));
   clone('t',t,28,63);clone('b',t,80,100);clone('detail',t,28,49);
   move('plasma0',lerp([660,210],[782,106],ramp(t,88,96)),ramp(t,88,91));
   move('plasma1',lerp([670,220],[795,174],ramp(t,90,99)),ramp(t,90,93));
   move('memoryB',lerp([650,230],[713,258],ramp(t,88,99)),ramp(t,88,92));
   move('memoryT',lerp([408,240],[451,257],ramp(t,43,57)),ramp(t,43,47));
   for(let i=0;i<14;i++){const u=((t-92)/8+i/14)%1;const p:Point=[mix(797,852,u),mix(i%2?174:106,230+(i%3)*15,u)+9*Math.sin(u*Math.PI)];move(`ab${i}`,p,ramp(t,92,97)*ramp(u,0,.12)*(1-ramp(u,.86,1)),.62,u*80)}
   const detailPoint=lerp(s.site,[713,258],ramp(t,98,104));transform('[data-focus]',`translate(${detailPoint[0]} ${detailPoint[1]})`);
   const anchorVisible=(1-ramp(t,80,86))+ramp(t,101,107);opacity('[data-focus]',anchorVisible*.9);
   const source:Point=[(mobile?24:40)+detailPoint[0]*(mobile?.49:1),(mobile?66:60)+(detailPoint[1]+35)*(mobile?.49:1)];
   q('[data-anchor]').setAttribute('d',`M${source[0]} ${source[1]} L${mobile?10:20} ${mobile?222:366} V${panelY+20} H${mobile?20:40}`);opacity('[data-anchor]',anchorVisible);
   const first=1-ramp(t,27,30),help=windowAt(t,61,82),syn=Math.max(first,help);
   opacity('[data-synapse]',syn);opacity('[data-t-name]',ramp(t,18,20));opacity('[data-cytokine-label]',ramp(t,18,20));
   const gap=1-ramp(t,10,20);transform('[data-t-surface]',`translate(0 ${gap*25})`);transform('[data-tcr]',`translate(0 ${gap*25})`);transform('[data-cd4]',`translate(0 ${gap*25})`);transform('[data-costim]',`scale(1 ${1+gap*.12})`);
   opacity('[data-costim]',1-ramp(t,55,62));opacity('[data-cd40]',ramp(t,59,65));opacity('[data-b-surface]',ramp(t,55,62));
   opacity('[data-labels-first]',1-ramp(t,55,62));opacity('[data-labels-help]',ramp(t,59,65));
   q('[data-apc-name]').textContent=isolate(t<58?'תא דנדריטי':'תא B · מציג פפטיד');
   q('[data-cytokine-label]').textContent=isolate(t<58?'אות ראשון + גירוי משלים':'ציטוקינים · IL-4 / IL-21');
   movie.querySelectorAll<SVGCircleElement>('[data-cytokine]').forEach((e,i)=>{const u=(((t-64)/3+i/7)%1+1)%1;e.setAttribute('cx',String((78+19*Math.sin(u*Math.PI))*(mobile?1.4:1.8)));e.setAttribute('cy',String(mix(108,0,u)*(mobile?1.4:1.8)));e.setAttribute('opacity',String(help*ramp(u,0,.15)*(1-ramp(u,.8,1))))});
   opacity('[data-clone-detail]',windowAt(t,28,49));q('[data-clone-count]').textContent=isolate(`תאים בשבט: ${t<33?1:t<38?2:t<43?4:8}`);
   for(const which of ['over','detail'])movie.querySelectorAll<SVGCircleElement>(`[data-il2-${which}]`).forEach((e,i)=>{const u=((t-28)/4+i/8)%1,a=-Math.PI/2+u*Math.PI*2;const rr=which==='over'?58:mobile?120:175;const x=(which==='over'?278:0)+rr*Math.cos(a),y=(which==='over'?140:65)+rr*.7*Math.sin(a);e.setAttribute('cx',String(x));e.setAttribute('cy',String(y));e.setAttribute('opacity',String(windowAt(t,28,47)*ramp(u,0,.1)*(1-ramp(u,.8,1))))});
   opacity('[data-capture-detail]',windowAt(t,47,63));
   transform('[data-capture-antigen]',`translate(0 ${mix(-175,-139,ramp(t,47,51))})`);opacity('[data-capture-antigen]',1-ramp(t,51,53));
   transform('[data-capture-vesicle]',`translate(0 ${mix(-113,-4,ramp(t,51,56))})`);opacity('[data-capture-vesicle]',windowAt(t,51,58));
   transform('[data-capture-peptide]',`translate(${mix(0,123,ramp(t,56,60))} 0)`);opacity('[data-capture-peptide]',windowAt(t,56,62));opacity('[data-capture-pmhc]',ramp(t,59,61));
   q('[data-capture-caption]').textContent=t<52?'אנטיגן שלם נקשר לקולטן':t<57?'בליעה ופירוק לפפטידים':'הצגת פפטיד מאותו אנטיגן';
   opacity('[data-fates]',windowAt(t,80,105));
   transform('[data-fate-parent]',`translate(0 90)`);opacity('[data-fate-parent]',1-ramp(t,81,84));
   const fate=ramp(t,81,87),px=mobile?-70:-205,py=mobile?116:135,mx=mobile?119:216,my=mobile?282:145;
   transform('[data-fate-plasma]',`translate(${px} ${py}) scale(${mix(.7,1,fate)})`);transform('[data-fate-memory]',`translate(${mx} ${my}) scale(${mix(.7,1,fate)})`);
   transform('[data-fate-memory-t]',`translate(${mobile?-100:53} ${mobile?307:205})`);
   opacity('[data-fate-plasma]',ramp(t,83,86));opacity('[data-fate-memory]',ramp(t,84,87));opacity('[data-fate-memory-t]',ramp(t,87,91));
   for(let i=0;i<30;i++){const u=((t-84)/4+i/30)%1;const angle=(i%6/5-.5)*1.35,reach=mobile?175:240;move(`detail-ab${i}`,[px+(mobile?66:91)+u*reach*Math.cos(angle),py+Math.sin(angle)*(35+u*(mobile?90:120))],ramp(t,84,88)*ramp(u,0,.12)*(1-ramp(u,.87,1)),mobile?.68:.9,angle*30)}
   opacity('[data-graph]',s.graph);
   const day=s.recall*60,gw=mobile?332:690,yy=-iggLevel(day)*1.85;
   transform('[data-marker]',`translate(${day/60*gw} ${yy})`);
   q('[data-marker] path').setAttribute('d',`M0 0 V${-yy}`);
   const traceCount=Math.max(2,Math.ceil(day*4)+1);const trace=Array.from({length:traceCount},(_,i)=>{const d=day*i/(traceCount-1);return `${i?'L':'M'}${d/60*gw} ${-iggLevel(d)*1.85}`}).join(' ');q('[data-graph-trace]').setAttribute('d',trace);
   const ci=chapterAt(t);q('[data-detail-title]').textContent=isolate(ci<2?'תקריב מעוגן · שני אותות להפעלה':ci===2?'מתא מתאים אחד לשבט':ci===3?'אנטיגן שלם → פפטיד מוצג':ci===4?'תקריב מעוגן · עזרת תא T':ci===5?'שני מסלולים מאותו שבט':'זיכרון חיסוני · תגובה לאותו אנטיגן');
   q('[data-map-phase]').textContent=isolate(ci<2?'תא T סורק את ההצגה':ci===2?'ריבוי באזור תאי T':ci===3?'לכידה, בליעה והצגה בזקיק':ci===4?'תא עזר פוגש תא B בגבול הזקיק':ci===5?'תאי פלזמה מפרישים · תאי זיכרון נשארים':'הזיכרון בבלוטה מעוגן לגרף התגובה');
   host.dataset.time=t.toFixed(3);host.dataset.chapter=String(ci);host.dataset.cells=String(t<33?1:t<38?2:t<43?4:8);
   // The local panel dimensions stay fixed when chapters change; layout changes only on resize.
   host.dataset.panelWidth=String(panelW);
  }
  function sync(t:number){draw(t);setTime(t);uiTime=t}
  seek.current=t=>{sync(Math.max(0,Math.min(DURATION,t)));last=0};
  function stop(){cancelAnimationFrame(raf);raf=0;last=0}
  function tick(now:number){raf=0;if(!playing.current||media.matches||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min((now-last)/1000,.08);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(t-uiTime)>.15||!playing.current){setTime(t);uiTime=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)}
  function start(){if(!raf&&visible&&docVisible&&playing.current&&!media.matches)raf=requestAnimationFrame(tick)}
  function motion(){setReduce(media.matches);if(media.matches){stop();playing.current=false;setRunning(false);sync(CHAPTERS[chapterAt(clock.current)].still)}else start()}
  function visibility(){docVisible=!document.hidden;if(docVisible)start();else stop()}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;host.dataset.offscreen=String(!visible);if(visible)start();else stop()},{threshold:.01});observer.observe(host);
  const wake=()=>{if(playing.current)start();else stop()};host.addEventListener('ac-toggle',wake);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',motion);draw(clock.current);motion();start();
  return()=>{stop();observer.disconnect();host.removeEventListener('ac-toggle',wake);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',motion)};
 },[mobile]);
 const jump=(t:number)=>seek.current(t);
 const toggle=()=>{if(clock.current>=DURATION)jump(0);playing.current=!playing.current;setRunning(playing.current);root.current?.dispatchEvent(new Event('ac-toggle'))};
 return <section className="ac" ref={root} data-theme={theme} data-time="0" data-language={lang} dir="rtl" aria-label="חסינות נרכשת — סרט רציף">
  <style>{CSS}</style>
  <header><div className="kicker">סרט רציף · מזיהוי יחיד לזיכרון ארוך טווח</div><h2>{processName||'חסינות נרכשת'}</h2></header>
  <nav aria-label="פרקים בסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduce?c.still:c.start)}>{isolate(c.he)}</button>)}</nav>
  <svg ref={svg} className="ac-movie" viewBox={mobile?'0 0 480 920':'0 0 960 930'} role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
   <title id={`${uid}-title`}>חסינות נרכשת בבלוטת לימפה</title><desc id={`${uid}-desc`}>{isolate('תא דנדריטי מציג פפטיד–MHC II לתא T עם CD4. תקריב מציג TCR ו־CD28–B7. השבט גדל; תא B לוכד אנטיגן ומקבל עזרת תא T דרך CD40L–CD40 וציטוקינים. תאי פלזמה מפרישים נוגדנים ונוצרים תאי זיכרון; גרף מסכם תגובה ראשונית ומשנית.')}</desc>
   <Artwork uid={uid} mobile={mobile}/>
  </svg>
  <p className="caption" aria-live="polite" aria-atomic="true"><strong>{isolate(CHAPTERS[chapter].he)}</strong>{isolate(CHAPTERS[chapter].text)}</p>
  {reduce&&<div className="reduced">תנועה מופחתת: תמונת מפתח לכל פרק; הגרירה זמינה לעיון בכל רגע.</div>}
  <div className="controls"><button onClick={toggle} disabled={reduce} aria-label={running?'השהיה':'ניגון'}>{running&&!reduce?'❚❚ השהיה':'▶ ניגון'}</button><input type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>jump(Number(e.target.value))} aria-label="מיקום בסרט"/><output>{isolate(`${Math.floor(time)} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>לולאה</label></div>
  <div className="legend"><span><i style={{background:'#b09ac1'}}/>תא דנדריטי</span><span><i style={{background:'#88b4c8'}}/>{isolate('תא T')}</span><span><i style={{background:'#d2b174'}}/>{isolate('תא B / פלזמה')}</span><span><i style={{background:'#cc745c'}}/>אנטיגן</span><span><i style={{background:'#f2c765'}}/>פפטיד</span><span><i style={{background:'#477da0'}}/>נוגדן</span></div>
  <div className="note">איור מקורי סכמטי, ללא קנה מידה או קצב מדוד. ספירת התאים ממחישה שלושה דורות בלבד. הצורה הנפרשת היא יחידת נוגדן סכמטית; נוגדן מהסוג המוקדם יכול להיות רב־יחידתי. הגרף מתאר מגמה יחסית ולא מדידה. התהליכים חופפים לאורך ימים ושבועות.</div>
 </section>;
}
