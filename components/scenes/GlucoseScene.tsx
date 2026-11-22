"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
type Point = [number, number];
export const DURATION = 156;
// Keep the approved first 132 seconds; stretch the final 12 seconds to 20,
// then hold the settled scene for four seconds before restarting the loop.
const sceneTime = (t: number) => t <= 132 ? t : 132 + Math.min(t - 132, 20) * .6;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const u=clamp(x); return u*u*(3-2*u); };
const ramp = (t: number,a: number,b: number) => ease((t-a)/(b-a));
const mix = (a: number,b: number,u: number) => a+(b-a)*u;
const mod = (x: number,n: number) => ((x%n)+n)%n;
const win = (t: number,a: number,b: number) => ramp(t,a,a+2)*(1-ramp(t,b-2,b));
export const isolateRuns = (s: string) => s.replace(/[\u2066\u2069]/g,"").replace(/[A-Za-z0-9][A-Za-z0-9₀-₉²⁺⁻–.-]*(?:[ /→]+[A-Za-z0-9][A-Za-z0-9₀-₉²⁺⁻–.-]*)*/g,s=>"\u2066"+s+"\u2069");

export const CHAPTERS = [
 {start:0,still:8,name:"אחרי ארוחה",text:"גלוקוז נספג מהמעי לדם. ריכוזו עולה, ותאי β באיי לנגרהנס שבלבלב מגיבים לעלייה. כלי הדם מחבר בין החישה בלבלב לבין איברי המטרה."},
 {start:12,still:28,name:"הפרשת insulin",text:"במודל הספר, גלוקוז נכנס לתאי β דרך GLUT2. חילוף החומרים מעלה ATP/ADP; תעלות K-ATP נסגרות, יציאת K⁺ פוחתת והממברנה עוברת דה־פולריזציה. תעלות Ca²⁺ תלויות מתח נפתחות; כניסת הסידן גורמת לאיחוי גרנולות ולהפרשת insulin לדם."},
 {start:38,still:52,name:"גיוס GLUT4",text:"insulin נישא בדם ונקשר לקולטן טירוזין־קינאז בשריר וברקמת שומן. איתות דרך IRS, PI3K ו־Akt מגייס שלפוחיות הנושאות GLUT4. הן מתאחות עם ממברנת התא; הנשא משולב בה וגלוקוז נכנס בדיפוזיה מזורזת."},
 {start:66,still:73,name:"אגירה ומשוב",text:"insulin מעודד בניית גליקוגן בכבד ובשריר ובניית שומן בכבד וברקמת שומן, ומעכב ייצור גלוקוז בכבד. בכבד GLUT2 קיים בממברנה, ללא גיוס GLUT4. כשהגלוקוז בדם חוזר לתחום התקין, הגירוי לתאי β פוחת והפרשת insulin יורדת: משוב שלילי."},
 {start:82,still:94,name:"בצום: glucagon",text:"בין ארוחות, ניצול הגלוקוז מוריד את ריכוזו בדם. הפרשת insulin פוחתת ותאי α באיי לנגרהנס מפרישים glucagon. ההורמון נישא בדם ופועל בעיקר על הכבד; השריר אינו מקור ישיר של גלוקוז לדם."},
 {start:104,still:119,name:"ייצור ושחרור",text:"בכבד glucagon נקשר לקולטן מצומד חלבון G. דרך cAMP ו־PKA הוא מעודד פירוק גליקוגן וגלוקונאוגנזה — יצירת גלוקוז חדש מלקטט, גליצרול וחומצות אמינו מתאימות. הכבד משחרר גלוקוז דרך GLUT2. אלה תהליכים במקביל, בקצבי זמן שונים."},
 {start:132,still:152,name:"חזרה לאיזון",text:"הגלוקוז חוזר לתחום התקין והגירוי להפרשת glucagon נחלש. שני מסלולי המשוב השלילי מאזנים אספקה ושימוש. בסוכרת סוג 1 הרס תאי β גורם לחסר חמור ב־insulin; בסוג 2 קיימת עמידות ל־insulin ולעיתים גם ירידה בהפרשתו."},
] as const;
export const chapterAt = (t: number) => Math.max(0,CHAPTERS.findLastIndex(c=>t>=c.start));
// Illustrative concentrations, not measured kinetics. Continuous with equal loop endpoints.
export function glucoseAt(elapsed: number) { const t=sceneTime(elapsed); return 90+58*ramp(t,2,18)-58*ramp(t,42,79)-27*ramp(t,83,101)+27*ramp(t,109,138); }
const C={blue:"#47799c",blueDark:"#244b73",red:"#b85a61",gold:"#b18a4c",green:"#548b75",purple:"#8c719f"};

function Sugar(){return <g><path d="M-5 -8 H5 L10 0 L5 8 H-5 L-10 0Z" fill="#efdbb5" stroke="#9c743a" strokeWidth="1.5"/><path d="M-3 -5 H3" stroke="#fff6db" strokeWidth="1.3"/></g>}
function Hormone({kind="insulin"}:{kind?:"insulin"|"glucagon"}){return kind==="insulin"?<g stroke={C.blueDark} strokeWidth="1"><path d="M-7 -2 Q-2 -8 2 -2 T9 -2 M-6 4 Q0 -1 6 4" fill="none" stroke={C.blue} strokeWidth="3"/><path d="M-2 -2 V2 M4 -1 V3" stroke="#c6a45d"/></g>:<path d="M-8 2 Q-4 -9 0 0 T8 -2" stroke={C.red} strokeWidth="4" fill="none" strokeLinecap="round"/>}
function Mito({x=0,y=0}:{x?:number;y?:number}){return <g transform={`translate(${x} ${y}) rotate(-25)`}><path d="M-22 -8 C-13 -22 17 -19 24 -5 C32 11 8 19 -11 13 C-24 9 -28 0 -22 -8Z" fill="#d6b7a4" stroke="#9e7461" strokeWidth="1.4"/><path d="M-16 0 Q-7 -11 -7 -2 T3 1 T11 -3 T19 1" fill="none" stroke="#9e7461" strokeWidth="2"/></g>}
function Nucleus(){return <g transform="translate(8 30)"><ellipse rx="41" ry="33" fill="#c7d7df" stroke="#688a9e" strokeWidth="2"/><ellipse rx="36" ry="28" fill="none" stroke="#93afbd"/><circle cx="8" cy="6" r="9" fill="#88a7bb"/><path d="M-25 -5 Q-12 -23 -3 -7 T24 -4 M-26 12 Q-12 1 -4 15" fill="none" stroke="#9bb7c6" strokeWidth="2"/></g>}
function CellBody({liver=false}:{liver?:boolean}){return <g data-part="cell"><path d={liver?"M-144 -80 L-72 -122 L64 -122 L146 -53 L136 82 L53 122 L-83 110 L-147 34Z":"M-144 -53 C-143 -104 -76 -129 -12 -123 C54 -133 132 -109 144 -49 C161 10 142 91 78 111 C17 134 -78 126 -123 87 C-152 57 -157 -5 -144 -53Z"} fill="var(--cyto)" stroke="#93a994" strokeWidth="8" strokeLinejoin="round"/><path d={liver?"M-144 -80 L-72 -122 L64 -122 L146 -53 L136 82 L53 122 L-83 110 L-147 34Z":"M-144 -53 C-143 -104 -76 -129 -12 -123 C54 -133 132 -109 144 -49 C161 10 142 91 78 111 C17 134 -78 126 -123 87 C-152 57 -157 -5 -144 -53Z"} fill="none" stroke="#e2d4b3" strokeWidth="3" strokeLinejoin="round"/>
 {Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return <g key={i} transform={`translate(${146*Math.cos(a)} ${121*Math.sin(a)}) rotate(${i*15})`}><path d="M-2 -2 H3 M-2 2 H3" stroke="#a39778" strokeWidth="1"/><circle cx="-4" r="2" fill="#d6c599"/><circle cx="5" r="2" fill="#d6c599"/></g>})}<Nucleus/><Mito x={-65} y={38}/><Mito x={67} y={63}/></g>}
function Transporter(){return <g><path d="M-13 -20 Q-25 -22 -20 -3 L-16 18 Q-13 24 -5 19 L-5 3 Q-12 -4 -13 -20Z M13 -20 Q25 -22 20 -3 L16 18 Q13 24 5 19 L5 3 Q12 -4 13 -20Z" fill="#a8c9b7" stroke="#346451" strokeWidth="1.6"/><path d="M-15 -13 L-10 11 M15 -13 L10 11" stroke="#548b75" strokeWidth="4"/><path d="M-16 -13 L-11 10 M14 -13 L9 10" stroke="#e3f0e8" strokeWidth="1"/></g>}
function Receptor({gpcr=false}:{gpcr?:boolean}){return gpcr?<g>{Array.from({length:7},(_,i)=><path key={i} d={`M${-17+i*5} -16 q-5 8 0 16 t0 16`} stroke={i%2?"#cb9192":C.red} strokeWidth="4" fill="none"/>)}<path d="M-17 -16 Q-3 -34 12 -19" fill="none" stroke={C.red} strokeWidth="3"/></g>:<g><path d="M-25 -22 Q-26 -42 -9 -38 L-6 -22 L-6 24 Q-15 36 -23 25 M25 -22 Q26 -42 9 -38 L6 -22 L6 24 Q15 36 23 25" fill="none" stroke={C.blueDark} strokeWidth="7" strokeLinecap="round"/><path d="M-23 -23 Q-23 -35 -13 -33 M23 -23 Q23 -35 13 -33 M-6 0 V17 M6 0 V17" fill="none" stroke="#88acc5" strokeWidth="2"/><path d="M-5 -23 H5" stroke="#c3ab69" strokeWidth="2"/></g>}
function Glycogen(){return <g><path d="M-37 8 H35 M-22 8 L-35 -10 H-9 M-4 8 L8 -10 H33 M16 8 L29 26 H39" fill="none" stroke="#9c743a" strokeWidth="2.5"/>{[[-37,8],[-24,8],[-11,8],[2,8],[15,8],[28,8],[-35,-10],[-22,-10],[-9,-10],[8,-10],[21,-10],[34,-10],[29,26],[42,26]].map(([x,y],i)=><g key={i} data-gly={i} transform={`translate(${x} ${y}) scale(.53)`}><Sugar/></g>)}</g>}

const css=`
.gc{--bg:#fafbf9;--ink:#25364a;--muted:#586b7d;--border:#cbd7d9;--button:#fff;--cyto:#eaf2e9;--vessel:#f6e6e4;--panel:#f0f5f3;color:var(--ink);background:var(--bg);border:1px solid var(--border);border-radius:20px;overflow:hidden;font:15px/1.6 system-ui,sans-serif;text-align:start;isolation:isolate}
.dark .gc,.gc[data-theme=dark]{--bg:#15232d;--ink:#e5edf1;--muted:#b6c6ce;--border:#425765;--button:#253945;--cyto:#253d37;--vessel:#442e37;--panel:#1c303a}
@media(prefers-color-scheme:dark){.gc:not([data-theme=light]){--bg:#15232d;--ink:#e5edf1;--muted:#b6c6ce;--border:#425765;--button:#253945;--cyto:#253d37;--vessel:#442e37;--panel:#1c303a}}
.gc *{box-sizing:border-box}.gc header{padding:20px 24px 10px}.gc h2{font-size:27px;line-height:1.3;margin:6px 0}.gc .eyebrow{display:flex;justify-content:space-between;color:var(--muted);font-size:12px;gap:8px}.gc button{color:var(--ink);background:var(--button);border:1px solid var(--border);border-radius:9px;padding:8px 11px;min-height:42px;font:inherit;cursor:pointer}.gc button:focus-visible,.gc input:focus-visible{outline:3px solid #398bb3;outline-offset:3px}.gc button[aria-current=true]{background:#346451;color:#fff;border-color:#346451}.gc button:disabled{opacity:.6}.gc nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;padding:0 24px 12px}.gc nav button{font-size:12px}.gc .overview-row{display:grid;grid-template-columns:1.35fr 1fr;direction:ltr;align-items:center;padding:0 18px;gap:10px}.gc svg{display:block;width:100%;height:auto;overflow:hidden}.gc svg text{font:14px system-ui,sans-serif;fill:var(--ink);text-anchor:middle;direction:rtl;unicode-bidi:plaintext}.gc .map{aspect-ratio:380/220}.gc .chart{aspect-ratio:360/220}.gc .chart .value{font-size:25px;font-weight:600}.gc .chart .small{font-size:12px}.gc .chart .tick{font-size:11px}.gc .detail{max-width:700px;margin:auto;aspect-ratio:380/470}.gc .detail-wrap{position:relative;border-top:1px solid var(--border);background:radial-gradient(ellipse at center,var(--panel),var(--bg) 72%);max-height:760px}.gc .detail text{font-size:14px}.gc .detail .detail-title{font-size:17px;font-weight:600}.gc .leader{stroke:var(--muted);stroke-width:1.1;fill:none;stroke-linecap:round;stroke-linejoin:round}.gc .detail .inside-label{font-size:11px}.gc .caption{margin:12px 24px 8px;min-height:112px}.gc .caption strong{display:block;font-size:17px}.gc .phase{color:var(--muted);min-height:25px;margin:0 24px 12px;font-size:13px}.gc .controls{display:flex;align-items:center;gap:10px;padding:0 24px 14px}.gc input[type=range]{flex:1;min-width:50px;direction:ltr;accent-color:#548b75}.gc output{font-size:12px;direction:ltr;font-variant-numeric:tabular-nums;white-space:nowrap}.gc label{display:flex;gap:5px;align-items:center;font-size:13px}.gc .legend{display:flex;flex-wrap:wrap;gap:8px 20px;padding:12px 24px;border-top:1px solid var(--border);font-size:13px}.gc .legend span{display:flex;gap:6px;align-items:center}.gc i{display:inline-block;width:12px;height:12px;border-radius:50%}.gc .note{color:var(--muted);font-size:11px;padding:0 24px 14px}.gc .note p{margin:5px 0}.gc .anchor{fill:none;stroke:#6e9fb4;stroke-width:1.4;stroke-dasharray:4 4}
@media(min-width:601px){.gc .detail{width:480px}.gc .detail-wrap{display:flex;justify-content:center}.gc .detail-wrap:before,.gc .detail-wrap:after{content:'';flex:1;background:linear-gradient(90deg,transparent,var(--panel));opacity:.3}.gc .detail-wrap:after{transform:scaleX(-1)}}
@media(max-width:600px){.gc header{padding:16px 14px 10px}.gc h2{font-size:22px}.gc nav{padding:0 14px 10px;grid-template-columns:repeat(3,minmax(0,1fr))}.gc nav button{padding:6px;font-size:11px}.gc .overview-row{grid-template-columns:1fr;padding:0 5px;gap:0}.gc .map{width:100%}.gc .chart{width:100%;aspect-ratio:360/190;max-height:210px}.gc .caption{margin:12px 14px 8px;min-height:200px;font-size:15px}.gc .phase{margin:0 14px 12px;min-height:42px}.gc .controls{padding:0 14px 12px;flex-wrap:wrap}.gc .legend{padding:12px 14px}.gc .note{padding:0 14px 14px}.gc .detail{width:100%}}
`;

const detailLabels = [
 ["כניסת גלוקוז","GLUT2","סגירת תעלה","K-ATP","כניסת סידן","Ca²⁺","הפרשת הורמון","insulin"],
 ["קולטן טירוזין־קינאז","insulin","שלפוחית מתאחה","GLUT4","מסלול איתות","IRS → PI3K → Akt","קליטת גלוקוז","GLUT4"],
 ["קולטן מצומד חלבון G","glucagon","שחרור גלוקוז","GLUT2","שליח שני וקינאז","cAMP → PKA","מאגר גליקוגן","פירוק ובנייה"],
 ["תא α","באי לנגרהנס","גרנולות הפרשה","glucagon","פחות insulin","בין ארוחות","הורמון לדם","glucagon"],
] as const;

function Labels({kind}:{kind:number}){
 const targets:Point[][]=[[[90,115],[280,172],[73,294],[328,293]],[[90,115],[290,146],[90,257],[290,194]],[[90,115],[290,196],[90,257],[272,280]],[[90,128],[278,195],[90,287],[330,280]]];
 return <g data-label-set="">{[0,1,2,3].map(i=>{const x=i%2?286:94,y=i<2?50:420,[tx,ty]=targets[kind][i];const d=kind===0&&i===1?`M286 72 V100 H345 V183 H280 V172`:`M${x} ${i<2?y+22:y-20} V${i<2?100:398} L${tx} ${ty}`;return <g key={i} data-label={i}><path className="leader" data-target={`${tx},${ty}`} d={d}/><circle cx={tx} cy={ty} r="2.5" fill="var(--muted)"/><text data-liver-label={kind===2?i*2:undefined} x={x} y={y}>{isolateRuns(detailLabels[kind][i*2])}</text><text data-liver-label={kind===2?i*2+1:undefined} x={x} y={y+18}>{isolateRuns(detailLabels[kind][i*2+1])}</text></g>})}</g>
}

export default function GlucoseScene({lang="he",processName,theme}:Props){
 const root=useRef<HTMLElement>(null),clock=useRef(0),playing=useRef(true),looping=useRef(true),reduced=useRef(false),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduce,setReduce]=useState(false);
 const uid=useId().replace(/:/g,"");
 const chapter=chapterAt(time);
 useEffect(()=>{
  const host=root.current!,nodes=new Map<string,Element>();host.querySelectorAll('[data-id]').forEach(n=>nodes.set(n.getAttribute('data-id')!,n));
  const attr=(id:string,key:string,value:string|number)=>nodes.get(id)!.setAttribute(key,String(value));
  const opacity=(id:string,u:number)=>attr(id,'opacity',clamp(u));
  const move=(id:string,x:number,y:number,s=1)=>attr(id,'transform',`translate(${x} ${y}) scale(${s})`);
  const text=(id:string,s:string)=>{nodes.get(id)!.textContent=isolateRuns(s)};
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const annotations=new Map(['beta','target','liver','alpha'].map(id=>[id,Array.from(nodes.get(id)!.querySelectorAll('.detail-title,[data-label-set]'))]));
  const liverLabels=Array.from(host.querySelectorAll('[data-liver-label]'));
  let raf=0,last=0,visible=true,docVisible=!document.hidden,ui=-1;
  function draw(elapsed:number){
   const t=sceneTime(elapsed);
   clock.current=elapsed;const g=glucoseAt(elapsed),ins=win(t,28,84),gluc=win(t,91,140),uptake=win(t,51,80),storage=ramp(t,66,78)*(1-ramp(t,113,130));
   const returnToOverview=ramp(t,138,144);
   const beta=1-ramp(t,35,40)+returnToOverview,target=ramp(t,35,40)*(1-ramp(t,63,68)),liver=(ramp(t,63,68)*(1-ramp(t,80,85))+ramp(t,101,106))*(1-returnToOverview),alpha=ramp(t,80,85)*(1-ramp(t,101,106));
   for(const [id,u] of [['beta',beta],['target',target],['liver',liver],['alpha',alpha]] as const){opacity(id,u);attr(id,'transform',`translate(190 235) scale(${mix(.82,1,u)}) translate(-190 -235)`);annotations.get(id)!.forEach(n=>n.setAttribute('opacity',String(ramp(u,.55,.95))))}
   const focusX=mix(mix(mix(74,274,ramp(t,35,40)),185,ramp(t,63,68))*(1-ramp(t,80,85))+mix(74,185,ramp(t,101,106))*ramp(t,80,85),74,returnToOverview);
   const focusY=mix(mix(mix(60,160,ramp(t,35,40)),58,ramp(t,63,68))*(1-ramp(t,80,85))+mix(60,58,ramp(t,101,106))*ramp(t,80,85),60,returnToOverview);
   attr('focus','cx',focusX);attr('focus','cy',focusY);attr('anchor','d',`M${focusX+31} ${focusY} H365 V218 H190`);
   for(let i=0;i<23;i++){
    const u=mod(t/14+i/23,1),x=18+344*u,y=114+6*Math.sin(i*2.4+t*.7);
    move(`blood${i}`,x,y,.43);opacity(`blood${i}`,clamp((g-55)/80-i*.016));
   }
   for(let i=0;i<8;i++){
    const u=mod((t-25)/12+i/8,1);move(`ins${i}`,74+275*u,112+5*Math.sin(u*6.28+i),.6);opacity(`ins${i}`,ins);
    const v=mod((t-94)/9+i/8,1);move(`gluc${i}`,74+113*v,117+3*Math.sin(v*6.28+i),.65);opacity(`gluc${i}`,gluc);
   }
   for(let i=0;i<5;i++){
    const u=mod(t/5+i/5,1);move(`meal${i}`,38+12*u,148-31*u,.5);opacity(`meal${i}`,win(t,1,18)*(1-ramp(u,.8,1)));
    const v=mod((t-51)/6+i/5,1);move(`uptake${i}`,274+11*v,112+37*v,.5);opacity(`uptake${i}`,uptake);
    const w=mod((t-110)/7+i/5,1);move(`output${i}`,185,76+36*w,.5);opacity(`output${i}`,gluc*ramp(t,109,115));
   }
   text('glucose-value',`${Math.round(g)} mg/dL`);const gx=42+282*elapsed/DURATION,gy=166-(g-50)*.92;
   attr('trace','d',Array.from({length:Math.floor(elapsed*2)+1},(_,i)=>{const s=Math.min(elapsed,i/2);return `${i?'L':'M'}${42+282*s/DURATION} ${166-(glucoseAt(s)-50)*.92}`}).join(' '));
   attr('chart-dot','cx',gx);attr('chart-dot','cy',gy);attr('cursor','x1',gx);attr('cursor','x2',gx);
   // Beta-cell sensor. ATP rises before channel closure; calcium entry precedes release.
   const atp=ramp(t,13,19)*(1-ramp(t,76,82)),closed=ramp(t,19,22)*(1-ramp(t,76,82)),ca=ramp(t,22,25)*(1-ramp(t,76,82));
   attr('k-gate','d',`M-10 ${mix(-8,0,closed)} L10 ${mix(8,0,closed)}`);
   attr('ca-gate','d',`M-9 ${-8*ca} L9 ${8*ca}`);opacity('depolarization',closed*.9);text('atp-text',atp>.5?'ATP/ADP ↑':'ATP/ADP');
   for(let i=0;i<4;i++){
    let u=mod((t-12)/4+i/4,1);move(`beta-sugar${i}`,90,96+70*u,.65);opacity(`beta-sugar${i}`,win(t,10,33)*(1-ramp(u,.85,1)));
    u=mod((t-22)/3+i/4,1);move(`calcium${i}`,90,318-81*u,.65);opacity(`calcium${i}`,ca);
    u=mod(t/3+i/4,1);move(`potassium${i}`,270+55*u,160,.65);opacity(`potassium${i}`,(1-closed)*(1-ramp(u,.8,1))*ramp(beta,.9,1));
    const v=mod(Math.max(0,t-26)/8+i/4,1),f=ramp(v,.08,.65)*ramp(t,26,28);move(`granule${i}`,mix(246,330,f),mix(265+i*11,293,f));opacity(`granule${i}`,1-ramp(v,.72,.84));
    move(`release${i}`,mix(326,354,ramp(v,.68,1)),mix(293,320-i*8,ramp(v,.68,1)),.65);opacity(`release${i}`,ramp(t,26,28)*win(v,.66,1)*ins);
   }
   opacity('beta-pore',ramp(t,26,28)*(.5+.5*Math.sin(t*2)));
   // One vesicle moves up, opens and flattens into the plasma membrane.
   const bind=ramp(t,39,43),signal=ramp(t,43,47),fuse=ramp(t,47,53),unfuse=ramp(t,78,83);
   move('bound-insulin',90,mix(73,92,bind),.9);opacity('bound-insulin',target);
   opacity('signal',signal);move('glut-vesicle',290,mix(263,146,fuse));opacity('glut-vesicle',1-ramp(t,52,54));
   attr('fusion-neck','d',`M270 125 C${mix(266,270,fuse)} ${mix(234,125,fuse)} ${mix(314,310,fuse)} ${mix(234,125,fuse)} 310 125`);opacity('fusion-neck',win(t,48,55));
   move('membrane-glut',290,146);opacity('membrane-glut',ramp(t,51,54)*(1-unfuse));
   for(let i=0;i<4;i++){const u=mod((t-54)/4+i/4,1);move(`target-sugar${i}`,290,104+112*u,.75);opacity(`target-sugar${i}`,ramp(t,54,56)*(1-ramp(t,78,82))*(1-ramp(u,.85,1)))}
   // Hepatic GLUT2 stays on the membrane in both directions; glycogen grows then shrinks.
   const liverOut=ramp(t,108,113),stored=mix(.18,1,storage);move('glycogen',270,280,stored);
   opacity('liver-ins',1-liverOut);opacity('liver-gluc',liverOut);opacity('camp',liverOut);opacity('synthesis',1-liverOut);opacity('neo',liverOut);opacity('anabolism',1-liverOut);
   text('liver-title',t<90?'תא כבד · אגירה':'תא כבד · אספקת גלוקוז');
   const liverCopy=t<90?['קולטן טירוזין־קינאז','insulin','מעבר גלוקוז','GLUT2','אגירה ובקרה','פחות ייצור גלוקוז','מאגר גליקוגן','בנייה לאחר ארוחה']:detailLabels[2];
   liverLabels.forEach((n,i)=>{n.textContent=isolateRuns(liverCopy[i])});
   for(let i=0;i<6;i++){
    const u=mod((t-67)/6+i/6,1),x=mix(290,266,u),y=mix(95,270,u);
    move(`liver-sugar${i}`,mix(x,mix(265,290,u),liverOut),mix(y,mix(276,94,u),liverOut),.65);
    opacity(`liver-sugar${i}`,liver*(1-ramp(u,.88,1)));
    const v=mod((t-109)/8+i/6,1);move(`new-sugar${i}`,mix(143,290,v),mix(300,198,v),.6);opacity(`new-sugar${i}`,liverOut*(1-ramp(v,.85,1)));
   }
   for(let i=0;i<4;i++){
    const u=mod(Math.max(0,t-91)/7+i/4,1),f=ramp(u,.1,.7)*ramp(t,91,93);move(`alpha-granule${i}`,mix(255,327,f),mix(196+i*15,280,f));opacity(`alpha-granule${i}`,1-ramp(u,.7,.85));
    move(`alpha-release${i}`,mix(325,353,ramp(u,.7,1)),280+i*5,.7);opacity(`alpha-release${i}`,gluc*win(u,.69,1));
   }
   const phase=t<12?'מהמעי לדם · עלייה בריכוז':t<19?'חילוף חומרים · יחס ATP/ADP עולה':t<22?'סגירת K-ATP · פחות יציאת אשלגן':t<26?'דה־פולריזציה · פתיחת תעלות Ca²⁺':t<38?'איחוי גרנולות · insulin מגיע לדם':t<47?'insulin נקשר · אות מועבר בתוך התא':t<54?'שלפוחית GLUT4 נעה ומתאחה':t<66?'GLUT4 בממברנה · גלוקוז נכנס':t<82?'אגירה · פחות גירוי להפרשת insulin':t<104?'צום · תאי α מפרישים glucagon':t<113?'קולטן בכבד · cAMP מפעיל PKA':t<132?'פירוק גליקוגן וייצור חדש · יציאה דרך GLUT2':'משוב שלילי · ירידה בהפרשת glucagon';
   text('phase',phase);host.dataset.time=elapsed.toFixed(3);host.dataset.chapter=String(chapterAt(elapsed));
  }
  function sync(t:number){draw(t);setTime(t);ui=t}
  seek.current=t=>{sync(Math.max(0,Math.min(DURATION,t)));last=0};
  function tick(now:number){raf=0;if(!playing.current||reduced.current||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min((now-last)/1000,.08);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(t-ui)>.15||!playing.current){setTime(t);ui=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)}
  function resume(){last=0;if(!raf&&playing.current&&!reduced.current&&visible&&docVisible)raf=requestAnimationFrame(tick)}
  function visibility(){docVisible=!document.hidden;if(!docVisible){cancelAnimationFrame(raf);raf=0}resume()}
  function preference(){reduced.current=media.matches;setReduce(media.matches);if(media.matches){cancelAnimationFrame(raf);raf=0;sync(CHAPTERS[chapterAt(clock.current)].still)}else resume()}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0}resume()},{threshold:.03});observer.observe(host);
  host.addEventListener('glucose-play',resume);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);
  sync(0);preference();resume();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();host.removeEventListener('glucose-play',resume);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference)};
 },[]);
 const jump=(t:number)=>seek.current(t);
 const toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)jump(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('glucose-play'))};
 return <section className="gc" ref={root} dir="rtl" data-theme={theme} data-lang={lang} aria-label={processName||"בקרת גלוקוז בדם"}>
  <style>{css}</style>
  <header><div className="eyebrow"><span>מהארוחה ועד הצום</span><span>{reduce?'תצוגה רגועה':'סרט רציף · שני מעגלי משוב'}</span></div><h2>{processName||"גלוקוז בדם: לשמור על האיזון"}</h2></header>
  <nav aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduce?c.still:c.start)}>{isolateRuns(`${i+1} · ${c.name}`)}</button>)}</nav>
  <div className="overview-row">
   <svg className="map" viewBox="0 0 380 220" role="img" aria-labelledby={`${uid}-map-title`}><title id={`${uid}-map-title`}>לבלב, כבד, שריר ורקמת שומן לאורך כלי דם קבוע</title>
    <defs><linearGradient id={`${uid}-liver`} x2=".7" y2="1"><stop stopColor="#c88d75"/><stop offset="1" stopColor="#9c615b"/></linearGradient></defs>
    <path data-part="vessel" d="M17 101 H363 V128 H17Z" fill="var(--vessel)" stroke="#be8286" strokeWidth="2"/><path d="M18 105 H362 M18 124 H362" stroke="#d3a3a2" fill="none"/>
    {[62,119,221,327].map(x=><path key={x} d={`M${x} 116 h12 l-4 -3 m4 3 l-4 3`} fill="none" stroke="#b9767b" strokeWidth="1"/>)}
    <g data-part="pancreas"><path d="M30 69 C24 51 45 42 58 49 C74 37 93 47 111 41 C133 35 123 52 108 58 C97 77 84 71 68 79 C53 88 39 80 30 69Z" fill="#ddbd80" stroke="#a3844d" strokeWidth="1.4"/>{Array.from({length:10},(_,i)=><ellipse key={i} cx={39+i*7} cy={61+6*Math.sin(i*2)} rx="7" ry="5" fill="none" stroke="#c4a168" strokeWidth="1"/>)}<ellipse cx="74" cy="60" rx="19" ry="15" fill="#e6e8d9" stroke="#97a58b"/>{[[64,56],[75,52],[83,61],[73,66]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4.5" fill={C.blue} stroke="#e5edf1"/>)}<circle cx="59" cy="66" r="4" fill={C.red}/><circle cx="86" cy="52" r="4" fill={C.red}/><path d="M75 77 V101" stroke="#be8286" strokeWidth="4"/><text x="74" y="22">לבלב · איי לנגרהנס</text><text x="74" y="94" style={{fontSize:12}}>תאי β / תאי α</text></g>
    <g data-part="liver-organ"><path d="M146 52 C145 33 171 30 192 35 C209 32 233 34 239 45 C236 57 216 63 201 61 C186 81 161 84 151 76Z" fill={`url(#${uid}-liver)`} stroke="#8e5952" strokeWidth="1.4"/><path d="M194 36 Q188 49 201 61 M158 47 Q168 40 184 42" fill="none" stroke="#d4a58a" strokeWidth="2"/><path d="M185 78 V101" stroke="#be8286" strokeWidth="4"/><text x="193" y="22">כבד</text></g>
    <g data-part="muscle"><path d="M248 155 C265 142 304 143 321 155 L321 172 C302 183 267 181 248 172Z" fill="#caa1a0" stroke="#9a7070" strokeWidth="1.3"/>{[254,262,270,278,286,294,302,310,318].map(x=><path key={x} d={`M${x} 154 v19`} stroke="#a97f80"/>)}<path d="M274 128 V147" stroke="#be8286" strokeWidth="4"/><text x="287" y="201">שריר שלד</text></g>
    <g data-part="adipose">{[[153,163],[174,153],[193,165],[174,178]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="14" fill="#e8d5a5" stroke="#ab955d"/><circle cx={x-2} cy={y-2} r="10" fill="#f2e7c7"/><circle cx={x+10} cy={y+2} r="2.5" fill="#8a8590"/></g>)}<path d="M174 128 V141" stroke="#be8286" strokeWidth="4"/><text x="174" y="212">רקמת שומן</text></g>
    <g data-part="gut"><path d="M31 147 Q52 133 62 149 T91 150 M31 160 Q52 146 62 162 T91 163" stroke="#c5aa84" strokeWidth="5" fill="none"/><text x="58" y="191">מעי · ארוחה</text></g>
    {Array.from({length:23},(_,i)=><g key={i} data-id={`blood${i}`}><Sugar/></g>)}
    {Array.from({length:8},(_,i)=><g key={i}><g data-id={`ins${i}`}><Hormone/></g><g data-id={`gluc${i}`}><Hormone kind="glucagon"/></g></g>)}
    {Array.from({length:5},(_,i)=><g key={i}>{['meal','uptake','output'].map(id=><g key={id} data-id={`${id}${i}`}><Sugar/></g>)}</g>)}
    <ellipse data-id="focus" cx="74" cy="60" rx="31" ry="28" fill="none" stroke="#6e9fb4" strokeWidth="1.4" strokeDasharray="4 3"/><path className="anchor" data-id="anchor" d="M74 88 Q74 205 190 216"/>
   </svg>
   <svg className="chart" viewBox="0 0 360 220" role="img" aria-labelledby={`${uid}-chart-title`}><title id={`${uid}-chart-title`}>ריכוז גלוקוז בדם לאורך אותו ציר זמן</title><text x="185" y="20">גלוקוז בדם · ציר זמן משותף</text><text data-id="glucose-value" className="value" x="185" y="52">{isolateRuns('90 mg/dL')}</text>
    <rect x="42" y="110.8" width="282" height="36.8" fill="#87ac89" opacity=".17"/><path d="M42 129.2 H324" stroke="#6c9b7b" strokeDasharray="4 4"/>
    {[60,90,120,150].map(v=><g key={v}><path d={`M42 ${166-(v-50)*.92} H324`} stroke="var(--border)" strokeWidth=".6"/><text className="tick" x="23" y={170-(v-50)*.92}>{v}</text></g>)}
    <path d="M42 67 V167 H324" fill="none" stroke="var(--muted)" strokeWidth="1"/><path data-id="trace" d="M42 129.2" fill="none" stroke="#6c9b7b" strokeWidth="3"/><path data-id="cursor" d="" x1="42" x2="42" y1="65" y2="169" stroke={C.gold} strokeDasharray="2 3"/><circle data-id="chart-dot" cx="42" cy="129" r="4" fill={C.gold} stroke="var(--bg)" strokeWidth="1"/>
    <text x="75" y="185" className="small">ארוחה</text><text x="224" y="185" className="small">צום</text><text x="184" y="209" className="small">{isolateRuns('טווח הספר: 70–110 mg/dL · ייחוס: 90')}</text>
   </svg>
  </div>
  <div className="detail-wrap"><svg className="detail" viewBox="0 0 380 470" role="img" aria-labelledby={`${uid}-detail-title`}><title id={`${uid}-detail-title`}>תקריב מעוגן של חישה, הפרשה ותגובת תאי המטרה</title><path d="M190 0 V8" className="anchor"/>
   <g data-id="beta" opacity="1"><text className="detail-title" x="190" y="30">תא β · מהגלוקוז להפרשה</text>
    <g transform="translate(190 235)"><CellBody/><g transform="translate(-100 -120)"><Transporter/></g><g transform="translate(100 -75) rotate(55)"><Transporter/><path data-id="k-gate" d="M-10 -8 L10 8" stroke="#815d8c" strokeWidth="4"/></g><g transform="translate(-100 55) rotate(-65)"><Transporter/><path data-id="ca-gate" d="M-9 0 L9 0" stroke="#b18a4c" strokeWidth="4"/></g>
     <Mito x={-70} y={-40}/><text data-id="atp-text" x="-36" y="-8" className="inside-label">{isolateRuns('ATP/ADP')}</text><path d="M-76 -81 Q-78 -58 -65 -47 M-50 -36 L-27 -20 L48 -60" fill="none" stroke={C.gold} strokeWidth="1.7" strokeDasharray="3 3"/>
     <path data-id="depolarization" d="M-130 -70 C-115 -115 65 -142 127 -71" fill="none" stroke="#d8ab63" strokeWidth="5"/>
     <path d="M39 29 Q63 9 86 28 M41 36 Q66 18 90 35 M45 43 Q69 28 91 43" fill="none" stroke="#a8bba7" strokeWidth="4"/>
    </g>
    {Array.from({length:4},(_,i)=><g key={i}><g data-id={`beta-sugar${i}`}><Sugar/></g><g data-id={`potassium${i}`}><circle r="7" fill={C.purple}/><text y="3.5" style={{fontSize:10,fill:'#fff'}}>+</text></g><g data-id={`calcium${i}`}><circle r="7" fill="#c99c54"/><text y="3.5" style={{fontSize:10,fill:'#fff'}}>+</text></g><g data-id={`granule${i}`}><circle r="14" fill="var(--bg)" stroke="#86a7ba" strokeWidth="2"/><g transform="scale(.8)"><Hormone/></g><circle cx="-6" cy="7" r="2" fill={C.blue}/></g><g data-id={`release${i}`}><Hormone/></g></g>)}
    <path data-id="beta-pore" d="M328 283 Q342 293 328 303" fill="none" stroke={C.blue} strokeWidth="2"/>
    <Labels kind={0}/>
   </g>
   <g data-id="target" opacity="0"><text className="detail-title" x="190" y="30">שריר ורקמת שומן · פתיחת הגישה</text>
    <g transform="translate(190 235)"><CellBody/><g transform="translate(-100 -120)"><Receptor/></g><path d="M-100 -85 Q-113 -43 -100 -8 L-61 -8 M-60 -8 Q70 -49 100 -62" stroke={C.blue} fill="none" strokeWidth="2" strokeDasharray="3 4" data-id="signal"/><g transform="translate(-100 22)"><circle r="13" fill="#b6cddd" stroke={C.blue}/><path d="M-6 0 H6 M0 -6 V6" stroke={C.blueDark}/></g></g>
    <g data-id="bound-insulin"><Hormone/></g><g data-id="glut-vesicle"><circle r="28" fill="var(--bg)" stroke="#91ad9b" strokeWidth="3"/><g transform="translate(0 -21) scale(.55)"><Transporter/></g><g transform="translate(20 6) rotate(100) scale(.55)"><Transporter/></g><g transform="translate(-17 15) rotate(-125) scale(.55)"><Transporter/></g></g>
    <path data-id="fusion-neck" d="" stroke="#91ad9b" strokeWidth="4" fill="none"/><g data-id="membrane-glut"><Transporter/></g>
    {Array.from({length:4},(_,i)=><g key={i} data-id={`target-sugar${i}`}><Sugar/></g>)}<Labels kind={1}/>
   </g>
   <g data-id="liver" opacity="0"><text data-id="liver-title" className="detail-title" x="190" y="30">תא כבד · אגירה</text>
    <g transform="translate(190 235)"><CellBody liver/><g transform="translate(-100 -120)"><g data-id="liver-ins"><Receptor/><g transform="translate(0 -29) scale(.8)"><Hormone/></g></g><g data-id="liver-gluc"><Receptor gpcr/><g transform="translate(0 -29) scale(.8)"><Hormone kind="glucagon"/></g></g></g><g transform="translate(100 -39) rotate(75)"><Transporter/></g><g data-id="camp"><path d="M-100 -85 V-36 L-100 22 L38 45" fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="3 4"/>{[-73,-56,-39].map((y,i)=><circle key={y} cx={-100+i*8} cy={y} r="3" fill={C.red}/>)}</g><path data-id="synthesis" d="M98 -12 Q119 20 86 39" fill="none" stroke={C.gold} strokeWidth="2"/></g>
    <g data-id="glycogen"><Glycogen/></g><g data-id="anabolism"><circle cx="90" cy="257" r="11" fill="#b6d0ba" stroke="#548b75"/><path d="M84 257 H96" stroke="#346451" strokeWidth="2.5"/></g><g data-id="neo"><path d="M138 301 Q163 324 193 304" fill="none" stroke={C.green} strokeWidth="2"/>{[0,1,2].map(i=><path key={i} d={`M${134+i*12} 303 l4 -7 4 7Z`} fill="#91ad9b"/>)}<text className="inside-label" x="183" y="336">ייצור גלוקוז חדש</text></g>
    {Array.from({length:6},(_,i)=><g key={i}><g data-id={`liver-sugar${i}`}><Sugar/></g><g data-id={`new-sugar${i}`}><Sugar/></g></g>)}<Labels kind={2}/>
   </g>
   <g data-id="alpha" opacity="0"><text className="detail-title" x="190" y="30">תא α · תגובה לירידה בגלוקוז</text><g transform="translate(190 235)"><CellBody/><path d="M-108 -106 Q-60 -124 -30 -119" stroke={C.red} fill="none" strokeWidth="4"/><path d="M-100 52 Q-96 76 -74 87" stroke={C.blue} fill="none" strokeWidth="3" strokeDasharray="4 4"/><path d="M-100 70 l-5 -8 12 1" fill="none" stroke={C.blue}/><text className="inside-label" x="-80" y="-57">גלוקוז בדם ↓</text></g>
    <g transform="translate(278 195)"><circle r="13" fill="var(--bg)" stroke="#ba8586" strokeWidth="2"/><Hormone kind="glucagon"/></g>{Array.from({length:4},(_,i)=><g key={i}><g data-id={`alpha-granule${i}`}><circle r="13" fill="var(--bg)" stroke="#ba8586" strokeWidth="2"/><Hormone kind="glucagon"/></g><g data-id={`alpha-release${i}`}><Hormone kind="glucagon"/></g></g>)}<Labels kind={3}/>
   </g>
  </svg></div>
  <p className="caption" aria-live="polite" aria-atomic="true"><strong>{isolateRuns(CHAPTERS[chapter].name)}</strong>{isolateRuns(CHAPTERS[chapter].text)}</p>
  <p className="phase" data-id="phase"/>
  <div className="controls"><button onClick={toggle} disabled={reduce} aria-label={running&&!reduce?'השהיה':'ניגון'}>{running&&!reduce?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step="0.01" value={time} onChange={e=>jump(Number(e.target.value))}/><output>{Math.floor(time).toString().padStart(3,'0')} / {DURATION}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>לולאה</label></div>
  <div className="legend"><span><i style={{background:'#c5a165',borderRadius:2}}/>גלוקוז</span><span><i style={{background:C.blue}}/>{isolateRuns('insulin · תאי β')}</span><span><i style={{background:C.red}}/>{isolateRuns('glucagon · תאי α')}</span><span><i style={{background:'#8cae93'}}/>תחום תקין לפי הספר</span></div>
  <div className="note"><p>{isolateRuns('איור סכמטי מקורי; זמן וקצב מואצים, והגרף להמחשה. Campbell 11e, איור 41.22: טווח 70–110 mg/dL (כ־3.9–6.1 מילימולר), בקירוב 4–6 מילימולר. הקו המקווקו הוא ערך ייחוס להמחשה, לא סף אבחנתי.')}</p><p>{isolateRuns('חישת הגלוקוז בתא β מוצגת לפי מודל GLUT2 בספרי הקורס; אין להסיק שזה הנשא היחיד בכל מין או בכל תא. בכבד GLUT2 דו־כיווני; בשריר וברקמת שומן GLUT4 מגויס בתגובה ל־insulin. מבנה האי ותאי המטרה סכמטיים.')}</p></div>
 </section>;
}
