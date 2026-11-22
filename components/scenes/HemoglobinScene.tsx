"use client";
import React, { useEffect, useId, useRef, useState } from "react";

type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
export const DURATION = 120;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const ramp = (t: number, a: number, b: number) => { const u = clamp((t-a)/(b-a)); return u*u*(3-2*u); };
export const isolate = (s: string) => s.replace(/[\u2066\u2069]/g, "").replace(/[A-Za-zαβ0-9][A-Za-zαβ0-9₀-₉²³⁺⁻]*(?:[ /,→.-]+[A-Za-zαβ0-9][A-Za-zαβ0-9₀-₉²³⁺⁻]*)*%?/g, s => "\u2066"+s+"\u2069");
export const CHAPTERS = [
 {start:0,still:8,he:"מבנה",en:"Structure",text:"אותו Hb נע בתוך תא דם אדום. שתי תת־יחידות α ושתי β יוצרות טטרמר; בכל אחת heme ובמרכזו Fe²⁺ הקושר O₂ אחד. עד ארבע מולקולות לחלבון. ללא O₂ מועדף T state, בעל זיקה נמוכה.",english:"The same Hb travels inside a red blood cell. Two α and two β subunits each carry a heme with Fe²⁺, binding one O₂: four per tetramer. Deoxygenated Hb favors the low-affinity T state."},
 {start:12,still:24,he:"קישור ראשון",en:"First binding",text:"הקישור הראשון קשה יחסית: O₂ מגיע ל־Fe²⁺ ב־heme. הברזל נע אל מישור הטבעת ומושך את His המקורב ואת הסליל המחובר אליו. התקריב התחתון מציג מהצד את אותו אתר קישור; זו תנועה מבנית, לא חמצון קבוע של הברזל.",english:"The first O₂ binds with relatively low affinity. Fe²⁺ moves into the heme plane, pulling proximal His and its helix. The side view below follows this same binding site. This is a structural shift, not permanent iron oxidation."},
 {start:27,still:35,he:"שיתופיות",en:"Cooperativity",text:"השינוי באתר הראשון מועבר לממשקי תת־היחידות. הטטרמר משנה צורה בהדרגה מ־T state ל־R state; החלל המרכזי מצטמצם והזיקה עולה. מולקולות O₂ הבאות נקשרות בקלות רבה יותר. זמני ההגעה בסרט מדגימים שיתופיות ואינם מדידת קצב.",english:"The first site communicates with subunit interfaces. The tetramer gradually shifts from T state to R state; its central cavity narrows and affinity rises. Subsequent O₂ binds more readily. Arrival times illustrate cooperativity, not measured kinetics."},
 {start:40,still:49,he:"טעינה בריאות",en:"Lung loading",text:"בריאות, pO₂ של כ־100 mmHg מאפשר רוויה של כ־98%. העקומה הסיגמואידית מתארת אוכלוסיית Hb; הסמן נע עליה ברציפות. Mb הוא חלבון אגירה בעל עקומה היפרבולית וזיקה גבוהה יותר. P50 הוא הלחץ ברוויה של 50%: כ־26 ל־Hb וכ־2 ל־Mb.",english:"At lung pO₂ ≈100 mmHg, Hb is ≈98% saturated. The live marker tracks the sigmoid ensemble curve. Mb is an oxygen-storage protein with a hyperbolic curve and higher affinity. P50 is the pressure at 50% saturation: ≈26 for Hb and ≈2 for Mb."},
 {start:56,still:66,he:"אל הרקמה",en:"Tissue delivery",text:"התא ממשיך לרקמות: pO₂ יורד, תחילה לכ־40 mmHg ובהמשך לכ־20 ברקמה פעילה. שיווי המשקל נע לכיוון שחרור O₂. החלבון נשאר באותו תקריב, והסמן יורד לאורך אותה עקומה. מספר המולקולות בטטרמר הבודד אינו אחוז הרוויה באוכלוסייה.",english:"The cell moves toward tissues: pO₂ falls first to ≈40 mmHg and then ≈20 in active tissue. Equilibrium favors O₂ release. The same protein and curve remain in view. A single tetramer's molecule count is not the ensemble saturation percentage."},
 {start:72,still:91,he:"שחרור מוגבר",en:"Enhanced release",text:"ברקמה פעילה, H⁺ ו־CO₂ מייצבים T state: אפקט Bohr. H⁺ מפרטן שיירים; CO₂ יוצר carbamate בקצות האמיניים, הרחק מ־heme. בנפרד, 2,3-BPG נקשר בין שתי תת־יחידות β בחלל המורחב. העקומה זזה ימינה; באותו pO₂ משתחרר יותר O₂. גם עליית טמפרטורה מפחיתה זיקה.",english:"H⁺ and CO₂ stabilize T state: the Bohr effect. H⁺ protonates residues; CO₂ forms carbamate at amino termini, away from heme. Separately, 2,3-BPG binds between the β subunits in the expanded cavity. The curve shifts right: more O₂ is released at the same pO₂. Higher temperature also lowers affinity."},
 {start:98,still:115,he:"חזרה לריאות",en:"Return to lung",text:"בדרך חזרה לריאות, CO₂ ו־H⁺ משתחררים עם שינוי התנאים. עליית pO₂ מעודדת קישור O₂, מעבר ל־R state ויציאת 2,3-BPG מהחלל המצטמצם. אותו חלבון נטען מחדש. התנועה מעגלית; מצבי T ו־R הם אוכלוסיות בשיווי משקל, והסרט מציג מסלול מולקולרי מפושט.",english:"Back in the lungs, CO₂ and H⁺ dissociate as conditions change. Rising pO₂ favors O₂ binding, R state and 2,3-BPG release from the narrowing cavity. The same protein reloads. T and R are equilibrium populations; this is a simplified molecular trajectory."},
] as const;
export const chapterAt = (t: number) => Math.max(0, CHAPTERS.findLastIndex(c => t >= c.start));
export function stateAt(t: number) {
 const unload = ramp(t,62,94), back = ramp(t,99,117);
 const r = ramp(t,25,42)*(1-ramp(t,65,90)) + back;
 const shift = ramp(t,72,88)*(1-ramp(t,100,113));
 const p = mix(mix(mix(0,100,ramp(t,12,43)),40,ramp(t,56,70)),20,ramp(t,72,92));
 const pressure = mix(p,100,back), p50 = mix(26,38,shift);
 const saturation = (x:number,k:number,n=2.8) => x**n/(x**n+k**n);
 const bound = [ramp(t,16,26)*(1-ramp(t,87,94)),ramp(t,29,33)*(1-ramp(t,79,85)),ramp(t,34,37)*(1-ramp(t,71,77)),ramp(t,38,41)*(1-ramp(t,63,69))].map((v,i)=>Math.max(v,ramp(t,102+i*3,106+i*3)));
 return {r:clamp(r),shift,p:pressure,p50,s:saturation(pressure,p50),bound,unload,back};
}
const curve = (p50:number,n=2.8) => Array.from({length:121},(_,p)=>`${p?'L':'M'} ${55+p*2.6} ${330-240*(p**n/(p**n+p50**n))}`).join(' ');
const css = `
.hc{--bg:#fafbf9;--ink:#25364a;--muted:#586b7d;--line:#cbd7d9;--panel:#f0f5f4;--button:#fff;--vessel:#ecd4d1;--alpha:#cc8e82;--beta:#86acbc;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:20px;overflow:hidden;font:15px/1.65 system-ui,sans-serif;isolation:isolate;text-align:start}
.dark .hc,.hc[data-theme=dark]{--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--line:#425765;--panel:#1c303a;--button:#253945;--vessel:#573e44;--alpha:#bc827a;--beta:#739aaf}
@media(prefers-color-scheme:dark){.hc:not([data-theme=light]){--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--line:#425765;--panel:#1c303a;--button:#253945;--vessel:#573e44;--alpha:#bc827a;--beta:#739aaf}}
.hc *{box-sizing:border-box}.hc header{padding:20px 24px 12px}.hc h2{margin:3px 0;font-size:25px;line-height:1.3}.hc .eyebrow{font-size:12px;color:var(--muted);display:flex;justify-content:space-between}.hc button{font:inherit;color:var(--ink);background:var(--button);border:1px solid var(--line);border-radius:9px;min-height:42px;padding:7px 12px;cursor:pointer}.hc button:focus-visible,.hc input:focus-visible{outline:3px solid #398bb3;outline-offset:3px}.hc nav{display:flex;gap:6px;padding:0 24px 12px;flex-wrap:wrap}.hc nav button{font-size:12px;flex:1;white-space:nowrap}.hc button[aria-current=true]{background:#346451;border-color:#346451;color:white}.hc .overview{width:100%;height:180px}.hc .panels{display:grid;grid-template-columns:1.07fr 1fr;direction:ltr;gap:14px;margin:0 16px}.hc .panel{background:var(--panel);border:1px solid var(--line);border-radius:15px;overflow:hidden;min-width:0}.hc svg{display:block;width:100%;overflow:visible}.hc .protein{aspect-ratio:440/510}.hc .chart{aspect-ratio:410/510}.hc svg text{font:16px system-ui,sans-serif;fill:var(--ink);text-anchor:middle;direction:ltr;unicode-bidi:plaintext}.hc svg .small{font-size:16px}.hc svg .title{font-size:18px;font-weight:600}.hc .leader{stroke:var(--muted);stroke-width:1.3;fill:none}.hc .callout{fill:var(--bg);stroke:var(--line)}.hc .caption{margin:14px 24px 0;min-height:130px;font-size:16px}.hc .caption strong{display:block}.hc .controls{display:flex;align-items:center;gap:10px;padding:12px 24px;flex-wrap:wrap}.hc input[type=range]{direction:ltr;flex:1;min-width:60px;accent-color:#548b75}.hc output{font-size:12px;font-variant-numeric:tabular-nums;direction:ltr}.hc label{font-size:13px;display:flex;align-items:center;gap:5px}.hc .legend{border-top:1px solid var(--line);padding:12px 24px;display:flex;gap:10px 20px;flex-wrap:wrap;font-size:13px}.hc .legend i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-inline-end:5px}.hc .note{font-size:12px;color:var(--muted);margin:0;padding:0 24px 16px}.hc [data-dynamic]{will-change:transform}
@media(max-width:600px){.hc header{padding:16px 14px 12px}.hc h2{font-size:21px}.hc nav{padding:0 14px 10px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.hc nav button{white-space:normal;padding:6px}.hc .panels{grid-template-columns:1fr;gap:12px;margin:0 10px}.hc .caption{margin:12px 14px 0;min-height:205px;font-size:15px}.hc .controls{padding:12px 14px}.hc .legend{padding:12px 14px}.hc .note{padding:0 14px 14px}}
`;
function Oxygen(){return <g><path d="M-5 0H5" stroke="#398bb3" strokeWidth="4"/><circle cx="-5" r="5.5" fill="#b7dbe9" stroke="#24789c" strokeWidth="1.5"/><circle cx="5" r="5.5" fill="#b7dbe9" stroke="#24789c" strokeWidth="1.5"/></g>}
function Heme(){return <g><path d="M-20 -10L-10 -18H10L20 -10V10L10 18H-10L-20 10Z" fill="#d2aa68" stroke="#805322" strokeWidth="2"/><path d="M-15 -7L-6 -11L0 -5L6 -11L15 -7L10 0L15 7L6 11L0 5L-6 11L-15 7L-10 0Z" fill="none" stroke="#805322" strokeWidth="1.3"/><path d="M-8 -7L8 7M8 -7L-8 7" stroke="#805322"/><circle r="5" fill="#ffe3a1" stroke="#805322" strokeWidth="1.2"/></g>}
const SUBS = [{name:"α₁",x:146,y:145,beta:false,rot:-16},{name:"β₁",x:291,y:146,beta:true,rot:16},{name:"α₂",x:291,y:277,beta:false,rot:164},{name:"β₂",x:146,y:278,beta:true,rot:196}];
function Subunit({i}:{i:number}){const sub=SUBS[i];return <g data-id={`sub${i}`} data-part="subunit"><path d="M-61 -24C-73 -51 -44 -72 -17 -60C1 -79 34 -62 38 -44C70 -50 79 -13 58 4C77 32 40 64 18 49C-1 73 -42 57 -44 37C-72 36 -80 2 -61 -24Z" fill={sub.beta?'var(--beta)':'var(--alpha)'} stroke={sub.beta?'#3d6b83':'#90554d'} strokeWidth="2"/>
 <path d="M-48 -28C-29 -59 -12 -19 7 -46S47 -33 43 -15M-45 1C-25 -27 -13 18 6 -9S45 2 42 19M-26 34C-8 13 9 47 28 27" fill="none" stroke={sub.beta?'#c4dfe8':'#f5c5b7'} strokeWidth="9" strokeLinecap="round"/>
 <path d="M-48 -28C-29 -59 -12 -19 7 -46S47 -33 43 -15M-45 1C-25 -27 -13 18 6 -9S45 2 42 19M-26 34C-8 13 9 47 28 27" fill="none" stroke={sub.beta?'#4c7c95':'#a66258'} strokeWidth="1.5"/>
 <g transform="translate(0 4)"><Heme/></g><text data-id={`sub-label${i}`} y="-67" style={{fontWeight:700}}>{isolate(sub.name)}</text><g data-id={`oxygen${i}`} data-part="oxygen"><Oxygen/></g><path data-id={`bond${i}`} d="M0 4V-13" stroke="#398bb3" strokeWidth="2" strokeDasharray="3 2"/>
 </g>}

export default function HemoglobinScene({lang="he",processName,theme}:Props){
 const en=lang==="en",tr=(he:string,eng:string)=>isolate(en?eng:he);
 const host=useRef<HTMLElement>(null),clock=useRef(0),play=useRef(true),loopRef=useRef(true),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduced,setReduced]=useState(false);
 const uid=useId().replace(/:/g,""),chapter=chapterAt(time);
 useEffect(()=>{
  const root=host.current!,nodes=new Map<string,Element>();root.querySelectorAll('[data-id]').forEach(n=>nodes.set(n.getAttribute('data-id')!,n));
  const attr=(id:string,key:string,v:string|number)=>nodes.get(id)!.setAttribute(key,String(v));
  const text=(id:string,s:string)=>{nodes.get(id)!.textContent=isolate(s)};
  const media=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:600px)');
  let raf=0,last=0,visible=true,ui=-1;
  const frame=(t:number)=>{
   clock.current=t;root.dataset.time=t.toFixed(3);const s=stateAt(t),small=mobile.matches;
   const width=small?390:900;attr('overview','viewBox',`0 0 ${width} 180`);
   attr('vessel','d',`M35 93C${width*.32} 66 ${width*.6} 117 ${width-35} 93`);
   const journey=ramp(t,53,76)*(1-ramp(t,98,120));const cellX=mix(83,width-83,journey),cellY=93+Math.sin(journey*Math.PI*2)*6;
   attr('cell','transform',`translate(${cellX} ${cellY}) rotate(${Math.sin(journey*Math.PI*2)*7})`);
   attr('anchor','d',`M${cellX} ${cellY+23}L${width*(small?.5:.25)} 174`);
   attr('lung','transform',`translate(67 42)`);attr('tissue','transform',`translate(${width-67} 42)`);
   attr('map-lung','x',67);attr('map-tissue','x',width-67);
   text('map-info',`${en?'Same cell ·':'אותו תא ·'} pO₂ ${s.p.toFixed(0)} mmHg`);attr('map-info','x',width/2);
   attr('map-lung','y',150);attr('map-tissue','y',150);
   for(let i=0;i<4;i++){
    const sub=SUBS[i],side=sub.x<220?-1:1,up=sub.y<210?-1:1;
    // Continuous rigid-body rearrangement plus local heme/helix deformation.
    const x=sub.x-side*s.r*19,y=sub.y-up*s.r*8,rot=sub.rot+(i<2?1:-1)*s.r*8;
    attr(`sub${i}`,'transform',`translate(${x} ${y}) rotate(${rot})`);
    attr(`sub-label${i}`,'transform',`rotate(${-rot} 0 -67)`);
    const b=s.bound[i],angle=-rot*Math.PI/180,dx=side*48,dy=up*48;
    const localX=dx*Math.cos(angle)-dy*Math.sin(angle),localY=dx*Math.sin(angle)+dy*Math.cos(angle);
    const drift=(1-b)*Math.sin(t*.8+i)*3;
    attr(`oxygen${i}`,'transform',`translate(${mix(localX,0,b)+drift} ${mix(localY,-18,b)}) rotate(${-rot})`);
    attr(`bond${i}`,'opacity',b);
   }
   attr('state-r','opacity',s.r);attr('state-t','opacity',1-s.r);
   attr('cavity','rx',mix(34,14,s.r));attr('cavity','ry',mix(49,39,s.r));
   const eff=ramp(t,70,84)*(1-ramp(t,100,110));
   attr('proton','transform',`translate(${mix(35,78,eff)} ${mix(140,126,eff)})`);attr('proton','opacity',eff);
   attr('co2','transform',`translate(${mix(394,351,eff)} ${mix(230,270,eff)})`);attr('co2','opacity',eff);
   const bpg=ramp(t,81,91)*(1-ramp(t,103,114));
   const bpgY=mix(300,210,bpg),bpgOpacity=ramp(t,75,80)*(1-ramp(t,113,118));
   attr('bpg','transform',`translate(${mix(219,220,bpg)} ${bpgY})`);attr('bpg','opacity',bpgOpacity);
   attr('bpg-callout','opacity',bpgOpacity);attr('bpg-leader','d',`M220 321V${bpgY+15}`);
   attr('bpg-contacts','opacity',bpg);
   const first=s.bound[0],feY=mix(450,435,first);attr('fe','transform',`translate(218 ${feY})`);
   attr('his','d',`M218 ${feY+7}L218 ${feY+22}L209 ${feY+29}L213 ${feY+39}L224 ${feY+39}L228 ${feY+29}L218 ${feY+22}`);
   attr('helix','transform',`translate(0 ${-15*first})`);
   attr('detail-oxygen','transform',`translate(218 ${mix(391,416,first)})`);attr('detail-oxygen','opacity',ramp(t,13,17));
   attr('detail-bond','d',`M218 ${feY-7}V423`);attr('detail-bond','opacity',first);
   const a=(-16+s.r*8)*Math.PI/180;
   attr('heme-leader','d',`M68 74L68 96L${mix(146,165,s.r)-4*Math.sin(a)} ${mix(145,153,s.r)+4*Math.cos(a)}`);
   attr('fe-leader','d',`M323 472L264 472L226 ${feY}`);
   attr('active-curve','d',curve(s.p50));
   const px=55+s.p*2.6,py=330-s.s*240;
   attr('marker','transform',`translate(${px} ${py})`);attr('guide','d',`M55 ${py}H${px}V330`);
   const halfway=55+s.p50*2.6;attr('p50-guide','d',`M55 210H${halfway}V330`);attr('p50-dot','cx',halfway);
   const leadX=55+48*2.6,leadY=330-240*(48**2.8/(48**2.8+s.p50**2.8));
   attr('curve-leader','d',`M261 60L261 66L${leadX} ${leadY}`);
   text('curve-title',en?(s.shift>.4?'Right shift · lower affinity':'Cooperative binding'):(s.shift>.4?'הסטה ימינה · ירידה בזיקה':'קישור שיתופי'));
   text('readout',`pO₂ ${s.p.toFixed(0)} mmHg · ${en?'saturation':'רוויה'} ${(100*s.s).toFixed(0)}%`);
   text('p50-readout',`P50 ≈ ${s.p50.toFixed(0)} mmHg`);
   attr('reference-curve','opacity',mix(.18,.6,s.shift));
   attr('curve-shift-arrow','opacity',s.shift);
   text('occupancy',`${en?'Bound O₂:':'קשורות O₂:'} ${s.bound.filter(b=>b>.96).length} / 4`);
   if(Math.abs(t-ui)>.12||t===0||t===DURATION){ui=t;setTime(t)}
  };
  seek.current=(t)=>{last=0;ui=-1;frame(Math.max(0,Math.min(DURATION,t)))};
  const reducedChange=()=>{setReduced(media.matches);if(media.matches){play.current=false;setRunning(false);seek.current(CHAPTERS[chapterAt(clock.current)].still)}};
  reducedChange();frame(clock.current);
  // After the first explanatory loading, repeat the physiological circuit from
  // the fully loaded lung at 53 s. Its geometry exactly matches the endpoint.
  const tick=(now:number)=>{if(play.current&&visible&&!document.hidden&&!media.matches){const delta=last?Math.min((now-last)/1000,.08):0;let t=clock.current+delta;if(t>=DURATION){if(loopRef.current)t=53+(t-DURATION);else{t=DURATION;play.current=false;setRunning(false)}}frame(t)}last=now;raf=requestAnimationFrame(tick)};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0},{threshold:.05});observer.observe(root);
  const visibility=()=>{last=0},resize=()=>frame(clock.current);
  document.addEventListener('visibilitychange',visibility);media.addEventListener('change',reducedChange);mobile.addEventListener('change',resize);raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',reducedChange);mobile.removeEventListener('change',resize)};
 },[en]);
 const jump=(t:number)=>seek.current(t);
 return <section className="hc" ref={host} dir={en?'ltr':'rtl'} data-theme={theme} aria-label={tr('קישור ושחרור O₂ ב־Hb','Hb oxygen binding and release')}>
 <style>{css}</style><header><div className="eyebrow"><span>{tr('מסע מולקולרי · סרט רציף','Molecular journey · continuous movie')}</span><span>{tr('תקריב מעוגן','Anchored close-up')}</span></div><h2>{processName?isolate(processName):tr('Hb · קישור O₂ ושחרורו','Hb · binding and releasing O₂')}</h2></header>
 <nav aria-label={tr('פרקי הסרט','Movie chapters')}>{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduced?c.still:c.start)}>{tr(c.he,c.en)}</button>)}</nav>
 <svg data-id="overview" className="overview" viewBox="0 0 900 180" role="img" aria-label={tr('תא דם אדום נע בין ריאה לרקמה','Red blood cell travels between lung and tissue')}>
 <defs><radialGradient id={`${uid}-cell`}><stop stopColor="#f2b7aa"/><stop offset=".5" stopColor="#b24e54"/><stop offset=".85" stopColor="#d47a73"/><stop offset="1" stopColor="#863d46"/></radialGradient></defs>
 <path data-id="vessel" d="M35 93H865" stroke="var(--vessel)" strokeWidth="56" fill="none" strokeLinecap="round"/><path data-id="anchor" className="leader" strokeDasharray="4 3"/>
 <g data-id="lung" transform="translate(67 42)"><path d="M0 -19V-2M0 -3L-8 4M0 -3L8 4" stroke="#548b75" strokeWidth="4" fill="none"/>{[-1,1].map(side=><path key={side} d={`M${side*4} -4C${side*15} -22 ${side*36} 9 ${side*27} 22C${side*14} 31 ${side*6} 20 ${side*4} 12Z`} fill="#c2dcd0" stroke="#548b75" strokeWidth="1.5"/>)}</g>
 <g data-id="tissue" transform="translate(833 42)">{[[-17,0],[12,-5],[0,18]].map(([x,y],i)=><g key={i}><path d={`M${x-14} ${y-8}Q${x} ${y-21} ${x+16} ${y-7}L${x+13} ${y+10}Q${x} ${y+20} ${x-14} ${y+7}Z`} fill="#d1dccc" stroke="#7d9875" strokeWidth="1.5"/><ellipse cx={x} cy={y} rx="5" ry="3" fill="#8aab87"/></g>)}</g>
 <g data-id="cell" data-part="cell"><ellipse rx="34" ry="21" fill={`url(#${uid}-cell)`} stroke="#9d4c50" strokeWidth="2"/><ellipse rx="17" ry="9" fill="none" stroke="#963f48" strokeWidth="1.5"/><rect x="-12" y="-13" width="24" height="26" rx="5" fill="none" stroke="#e5f1f6" strokeDasharray="3 2"/></g>
 <text data-id="map-lung" x="67" y="150">{tr('ריאה · טעינה','Lung · load')}</text><text data-id="map-tissue" x="833" y="150">{tr('רקמה · פריקה','Tissue · unload')}</text><text data-id="map-info" x="450" y="24" className="small"/>
 </svg>
 <div className="panels"><div className="panel"><svg className="protein" viewBox="0 0 440 510" role="img" aria-label={tr('טטרמר עם ארבע קבוצות heme ותקריב Fe²⁺','Tetramer with four hemes and Fe²⁺ close-up')}>
 <text x="220" y="28" className="title">{tr('אותו Hb · שתי α ושתי β','Same Hb · two α and two β')}</text>
 <ellipse data-id="cavity" cx="220" cy="210" rx="34" ry="49" fill="var(--bg)" stroke="var(--line)" strokeDasharray="4 3"/>
 {[0,1,2,3].map(i=><Subunit key={i} i={i}/>)}
 <path data-id="bpg-contacts" d="M232 204L254 178M206 219L186 251" stroke="#9972b3" strokeWidth="2" strokeDasharray="3 2"/>
 <g data-id="bpg" data-part="bpg"><path d="M-14 -6L0 0L14 7M-14 -6L-18 -16M14 7L20 17" stroke="#9562ac" strokeWidth="3"/><circle cx="-14" cy="-6" r="6" fill="#c8aad9" stroke="#78508e"/><circle cx="14" cy="7" r="6" fill="#c8aad9" stroke="#78508e"/></g>
 <g data-id="bpg-callout" opacity="0"><path data-id="bpg-leader" className="leader"/><rect x="167" y="321" width="106" height="24" rx="7" className="callout"/><text x="220" y="338" className="small">{isolate('2,3-BPG')}</text></g>
 <g data-id="proton"><circle r="15" fill="var(--bg)" stroke="#9562ac"/><text y="5" className="small">{isolate('H⁺')}</text></g><g data-id="co2"><rect x="-25" y="-14" width="50" height="28" rx="12" fill="var(--bg)" stroke="#9562ac"/><text y="5" className="small">{isolate('CO₂')}</text></g>
 <g data-id="state-t"><rect x="123" y="352" width="90" height="30" rx="15" className="callout"/><text x="168" y="373">{isolate('T state')}</text></g><text x="220" y="373">↔</text><g data-id="state-r" opacity="0"><rect x="227" y="352" width="90" height="30" rx="15" fill="#d3e7dc" stroke="#548b75"/><text x="272" y="373" style={{fill:'#25364a'}}>{isolate('R state')}</text></g>
 <path data-id="heme-leader" className="leader"/><rect x="10" y="47" width="116" height="27" rx="8" className="callout"/><text x="68" y="66" className="small">{isolate('heme / Fe²⁺')}</text><text data-id="occupancy" x="335" y="53" className="small"/>
 <path d="M34 388H406" stroke="var(--line)"/><text x="95" y="410" className="small">{tr('אותו אתר · מבט צד','Same site · side view')}</text>
 <path d="M161 435H273L255 442H143Z" fill="#d2aa68" stroke="#805322" strokeWidth="2"/><path d="M129 435H285" stroke="#ab8d5e" strokeDasharray="3 3"/>
 <path data-id="helix" d="M171 490Q192 479 209 490T246 490" fill="none" stroke="#a66258" strokeWidth="10"/>
 <path data-id="his" fill="none" stroke="#9562ac" strokeWidth="2"/>
 <path data-id="detail-bond" stroke="#398bb3" strokeWidth="2" strokeDasharray="3 2"/><g data-id="fe"><circle r="8" fill="#ffe3a1" stroke="#805322" strokeWidth="2"/></g><g data-id="detail-oxygen"><Oxygen/></g>
 <path data-id="fe-leader" className="leader"/><text x="351" y="476" className="small">{isolate('Fe²⁺')}</text><text x="88" y="468" className="small">{isolate('heme')}</text><path d="M113 463L151 440" className="leader"/><text x="351" y="500" className="small">{isolate('His · F helix')}</text><path d="M296 495H252" className="leader"/>
 </svg></div>
 <div className="panel"><svg className="chart" viewBox="0 0 410 510" role="img" aria-label={tr('עקומות רוויה של Hb ו־Mb עם סמן חי','Hb and Mb saturation curves with a live marker')}>
 <text data-id="curve-title" x="205" y="28" className="title"/><text data-id="curve-label" x="261" y="55" className="small">{isolate('Hb')}</text><path data-id="curve-leader" className="leader"/>
 {[0,25,50,75,100].map(v=><g key={v}><path d={`M55 ${330-v*2.4}H367`} stroke="var(--line)" strokeDasharray="3 4"/><text x="31" y={335-v*2.4} className="small">{v}</text></g>)}
 <path d="M55 81V330H375" stroke="var(--muted)" strokeWidth="1.5" fill="none"/><text x="68" y="67" className="small">{tr('רוויה (%)','Saturation (%)')}</text>
 {[0,20,40,60,80,100,120].map(p=><g key={p}><path d={`M${55+p*2.6} 330v6`} stroke="var(--muted)"/><text x={55+p*2.6} y="354" className="small">{p}</text></g>)}
 <text x="215" y="380">{isolate('pO₂ (mmHg)')}</text>
 {[40,100].map((p,i)=><g key={p}><path d={`M${55+p*2.6} 90V330`} stroke="var(--muted)" strokeDasharray="3 6" opacity=".5"/><text x={55+p*2.6} y="402" className="small">{tr(i?'ריאה':'רקמה',i?'Lung':'Tissue')}</text></g>)}
 <path d={curve(2,1)} fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="5 5" opacity=".5"/><text x="90" y="105" className="small">{isolate('Mb')}</text>
 <path data-id="reference-curve" d={curve(26)} fill="none" stroke="#b44d53" strokeWidth="2" strokeDasharray="5 4" opacity=".18"/>
 <path data-id="active-curve" d={curve(26)} fill="none" stroke="#b44d53" strokeWidth="3.5"/>
 <path data-id="curve-shift-arrow" d="M123 225H150l-7 -5m7 5l-7 5" fill="none" stroke="#9562ac" strokeWidth="2"/>
 <path data-id="p50-guide" className="leader" strokeDasharray="3 4"/><circle data-id="p50-dot" cy="210" r="4" fill="#9562ac"/>
 <path data-id="guide" stroke="#398bb3" strokeDasharray="4 4" fill="none" strokeWidth="1.5"/><g data-id="marker"><circle r="9" fill="var(--bg)" stroke="#398bb3" strokeWidth="3"/><circle r="3.5" fill="#398bb3"/></g>
 <rect x="30" y="420" width="350" height="72" rx="12" className="callout"/><text data-id="readout" x="205" y="447"/><text data-id="p50-readout" x="205" y="476"/>
 </svg></div></div>
 <p className="caption" aria-live={running?'off':'polite'}><strong>{tr(CHAPTERS[chapter].he,CHAPTERS[chapter].en)}</strong>{tr(CHAPTERS[chapter].text,CHAPTERS[chapter].english)}</p>
 <div className="controls"><button disabled={reduced} onClick={()=>{play.current=!play.current;setRunning(play.current)}}>{tr(running?'השהיה':'ניגון',running?'Pause':'Play')}</button><input type="range" min="0" max={DURATION} step=".1" value={time} aria-label={tr('מיקום בסרט','Movie position')} onChange={e=>jump(+e.target.value)}/><output>{Math.floor(time)} / {DURATION}</output><label><input type="checkbox" checked={loop} onChange={e=>{loopRef.current=e.target.checked;setLoop(e.target.checked)}}/>{tr('לולאה','Loop')}</label></div>
 <div className="legend">{[['#cc8e82','α · תת־יחידות','α subunits'],['#86acbc','β · תת־יחידות','β subunits'],['#d2aa68','heme / Fe²⁺','heme / Fe²⁺'],['#398bb3','O₂ · קישור הפיך','O₂ · reversible binding'],['#9562ac','H⁺ / CO₂ / 2,3-BPG','H⁺ / CO₂ / 2,3-BPG']].map(([color,he,eng])=><span key={he}><i style={{background:color}}/>{tr(he,eng)}</span>)}</div>
 <p className="note">{reduced?tr('תנועה מופחתת: תמונה יציבה לכל פרק; אפשר לגרור את ציר הזמן.','Reduced motion: chapter stills; timeline remains available.'):tr('האיור והזמנים סכמטיים; הסמן מתאר אוכלוסייה, הטטרמר מדגים מולקולה אחת.','Schematic geometry and timing; marker shows an ensemble, tetramer shows one molecule.')} {tr('מודל Hill: Hb עם P50 ≈ 26 ו־Mb ≈ 2 mmHg. ההסטה ל־38 היא המחשה, לא ערך קבוע לחומציות מסוימת. מקורות: Lehninger 8e §5.1; Berg/Stryer 10e §3.2–3.3; Campbell §42.7.','Hill illustration: Hb P50 ≈26 and Mb ≈2 mmHg. Shift to 38 is illustrative, not a fixed value at a given pH. Sources: Lehninger 8e §5.1; Berg/Stryer 10e §3.2–3.3; Campbell §42.7.')}</p>
 </section>;
}
