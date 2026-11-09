"use client";

import React, { memo, useEffect, useId, useRef, useState } from "react";
type Pt = [number, number];
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the scene's element records carry heterogeneous SVG props
type El = {id:string;type:string;[key:string]:any};

// Preserved pilot art, inlined so this component can be copied on its own.
const {carrier, channel, oxygen, glucose, ion, membrane, isolateRuns, P} = (() => {
// Local, self-contained primitives used by the preserved membrane artwork.
const circle=(id:string,cx:number,cy:number,r:number,color:string,o:Partial<El>={}):El=>({id,type:'circle',cx,cy,r,color,...o});
const ellipse=(id:string,cx:number,cy:number,rx:number,ry:number,color:string,o:Partial<El>={}):El=>({id,type:'ellipse',cx,cy,rx,ry,color,...o});
const line=(id:string,x1:number,y1:number,x2:number,y2:number,stroke:string,strokeWidth=2,o:Partial<El>={}):El=>({id,type:'line',x1,y1,x2,y2,stroke,strokeWidth,...o});
const path=(id:string,d:string,o:Partial<El>={}):El=>({id,type:'path',d,...o});
const text=(id:string,x:number,y:number,label:string,labelHe:string,o:Partial<El>={}):El=>({id,type:'text',x,y,label,labelHe,...o});
function ring(x:number,y:number,r:number,n:number){return Array.from({length:n},(_,i)=>{const a=(-90+i*360/n)*Math.PI/180;return `${i?'L':'M'} ${x+r*Math.cos(a)} ${y+r*Math.sin(a)}`}).join(' ')+' Z';}

// Original cutaway geometry. Only plain kit elements: copy beside kit.ts to integrate.

const P = {
  ink: "#25364a", muted: "#586b7d", lipid: "#c4a56c", tail: "#b9a680",
  blue: "#47799c", blueDark: "#244b73", bluePale: "#d6e7f1",
  green: "#548b75", greenDark: "#346451", greenPale: "#d3e7dc",
  gold: "#ac7837", goldDark: "#805322", goldPale: "#f3dfb9",
  oxygen: "#398bb3", sodium: "#c77c39", potassium: "#87649c", sugar: "#51896d", red: "#b44d53",
};
const CY = 150;
const POCKETS: Pt[] = [[184, 140], [200, 158], [216, 176]];
// Diagonal sockets avoid the eye/eye/mouth arrangement, including when empty.
const PUMP_NA: Pt[] = [[184, 140], [200, 158], [216, 176]];
const PUMP_K: Pt[] = [[184, 140], [216, 176]];
const GLUCOSE: Pt = [216, 176];

/** Isolate complete Latin/number runs, including stoichiometry, in all Hebrew copy. */
function isolateRuns(value: string): string {
  return value.replace(/[\u200e\u2066\u2069]/g, '').replace(
    /[A-Za-z0-9][A-Za-z0-9⁺⁻₂ᵢ]*(?:[.:/–−-][A-Za-z0-9⁺⁻₂ᵢ]+)*(?: +[A-Za-z0-9][A-Za-z0-9⁺⁻₂ᵢ]*(?:[.:/–−-][A-Za-z0-9⁺⁻₂ᵢ]+)*)*/g,
    // The site's renderer re-isolates ions. Nest each ion so that pass cannot
    // consume the closing PDI belonging to a complete run such as "2 Na⁺".
    run => '\u2066' + run.replace(/([A-Za-z][A-Za-z0-9₀-₉²³]*[⁺⁻](?:\/[A-Za-z][A-Za-z0-9₀-₉²³]*[⁺⁻])*)/g,
      ion => '\u2066' + ion + '\u2069') + '\u2069',
  );
}

function caption(id: string, x: number, y: number, he: string, en = he, extra: Partial<El> = {}): El {
  const isolated=isolateRuns(he);
  return text(id, x, y, en, isolated, {fontSize:16.5, weight:600, textColor:P.ink, halo:false, ...extra});
}

/** Each leaflet has one polar head and TWO independently drawn hydrocarbon tails per lipid. */
function membrane(gap = false): El[] {
  const out: El[] = [];
  for (let i=0; i<32; i++) {
    const x=14+i*12;
    if (gap && x>130 && x<270) continue;
    for (const side of [-1,1]) {
      const y=CY+side*25, end=CY+side*3, id=`lipid_${i}_${side===-1?'out':'in'}`;
      out.push(path(id+'_tails', `M ${x-2} ${y-side*3} L ${x-3} ${y-side*11} L ${x-1} ${end} M ${x+2} ${y-side*3} L ${x+4} ${y-side*12} L ${x+2} ${end}`, {stroke:P.tail,strokeWidth:1.5}));
      out.push(circle(id+'_head',x,y,4.7,'#e7d6b4',{stroke:P.lipid,strokeWidth:1.1}));
      out.push(circle(id+'_shine',x-1.2,y-1.2,1.6,'#fff9ea'));
    }
  }
  return out;
}


/** Atom pair; the connecting bond is drawn before its two opaque atoms. */
function oxygen(id:string,x:number,y:number):El[]{return [line(id+'_bond',x-4,y,x+4,y,P.oxygen,3),circle(id+'_a',x-4,y,4.7,'#b7dbe9',{stroke:P.oxygen,strokeWidth:1.2}),circle(id+'_b',x+4,y,4.7,'#b7dbe9',{stroke:P.oxygen,strokeWidth:1.2})];}

/** Charge is readable even on the phone; chemical identity comes from the stable legend. */
function ion(id:string,x:number,y:number,kind:'na'|'k'):El[]{
  const c=kind==='na'?P.sodium:P.potassium;
  return [circle(id+'_body',x,y,10,c,{stroke:'#ffffff',strokeWidth:1.3}),caption(id+'_charge',x,y+5.5,'+','+',{ltr:true,textColor:'#fff',weight:500})];
}
function glucose(id:string,x:number,y:number):El[]{return [path(id,ring(x,y,10.5,6),{color:'#e1efe6',stroke:P.sugar,strokeWidth:1.8}),path(id+'_rim',`M ${x-5} ${y-6} L ${x+3} ${y-6}`,{stroke:'#fff',strokeWidth:1.4})];}

/** Stable paired half-protein paths, with a blind vestibule and a closed opposite gate.
 * The command topology remains identical across inward/outward states for path tweening.
 * Neither carrier ever has an uninterrupted transmembrane pore.
 */
function carrier(id:'pump'|'sglt',state:'in'|'out',phosphorylated=false):El[]{
  const c=id==='pump'?P.green:P.gold, dark=id==='pump'?P.greenDark:P.goldDark;
  const pale=id==='pump'?P.greenPale:P.goldPale;
  // Closed halves overlap more than the opposite opening: the sum of gaps is
  // negative throughout linear interpolation, so both gates cannot open together.
  const top=state==='out'?27:-29, bottom=state==='in'?27:-29;
  const out:El[]=[];
  for(const s of [-1,1]){
    const X=(dx:number)=>200+s*dx;
    // Protein contour includes a recessed binding chamber at mid-membrane.
    out.push(path(`${id}_lobe_${s}`,`M ${X(top)} 99 C ${X(45)} 80 ${X(74)} 95 ${X(70)} 124 C ${X(76)} 151 ${X(69)} 174 ${X(64)} 193 C ${X(59)} 211 ${X(39)} 212 ${X(bottom)} 201 C ${X(bottom-2)} 185 ${X(36)} 179 ${X(34)} 164 C ${X(34)} 151 ${X(33)} 143 ${X(31)} 132 C ${X(28)} 119 ${X(top-1)} 115 ${X(top)} 99 Z`,{color:pale}));
    // Separate contour segments avoid drawing hidden seams through a sealed gate.
    out.push(path(`${id}_outline_${s}`,`M ${X(36)} 94 C ${X(58)} 87 ${X(74)} 95 ${X(70)} 124 C ${X(76)} 151 ${X(69)} 174 ${X(64)} 193 C ${X(59)} 211 ${X(39)} 212 ${X(35)} 205`,{stroke:dark,strokeWidth:1.8}));
    out.push(path(`${id}_vestibule_${s}`,`M ${X(31)} 132 C ${X(33)} 143 ${X(34)} 151 ${X(34)} 164`,{stroke:dark,strokeWidth:1.8}));
    // Helix ribbons and highlight surfaces give structure without unsupported SVG gradients.
    out.push(path(`${id}_helix_${s}`,`M ${X(53)} 108 C ${X(38)} 127 ${X(63)} 143 ${X(50)} 166 C ${X(42)} 181 ${X(53)} 187 ${X(44)} 198`,{stroke:c,strokeWidth:8}));
    out.push(path(`${id}_helix_light_${s}`,`M ${X(51)} 106 C ${X(36)} 125 ${X(61)} 141 ${X(48)} 164 C ${X(40)} 179 ${X(51)} 185 ${X(42)} 196`,{stroke:'#f8fcf8',strokeWidth:2.5}));
    out.push(path(`${id}_outer_${s}`,`M ${X(62)} 111 C ${X(69)} 137 ${X(61)} 161 ${X(59)} 181`,{stroke:c,strokeWidth:2}));
  }
  const slots=id==='pump'?(state==='in'?PUMP_NA:PUMP_K):[POCKETS[0],POCKETS[1],GLUCOSE];
  slots.forEach(([x,y],i)=>{
    if(id==='pump'||i<2){
      // Filled recessed sockets with a closed circular rim, never smile-shaped arcs.
      out.push(circle(`${id}_pocket_${i}`,x,y,12,'#f7fbf9',{stroke:dark,strokeWidth:1.8}));
      out.push(path(`${id}_socket_depth_${i}`,`M ${x-8} ${y-5} Q ${x} ${y-12} ${x+8} ${y-5}`,{stroke:'#97b7a5',strokeWidth:2}));
    }else out.push(path(`${id}_pocket_${i}`,ring(x,y,13,6),{color:'#fffbf2',stroke:dark,strokeWidth:1.7}));
  });
  if(id==='pump'){
    // Cytoplasmic nucleotide/phosphorylation/actuator domains; not an extra membrane protein.
    out.push(ellipse('pump_domain_N',151,215,23,13,'#b9d6c5',{stroke:dark,strokeWidth:1.6}),
      ellipse('pump_domain_P',189,221,20,12,'#e2eee6',{stroke:dark,strokeWidth:1.6}),
      ellipse('pump_domain_A',237,212,21,13,'#b9d6c5',{stroke:dark,strokeWidth:1.6}));
    if(phosphorylated)out.push(circle('pump_phosphate',189,220,11,'#f3d590',{stroke:P.goldDark,strokeWidth:1.4}),caption('pump_P',189,226,'P','P',{ltr:true,textColor:P.goldDark,weight:700}));
  }
  return out;
}

function channel():El[]{
  const out:El[]=[];
  for(const s of [-1,1]){
    const X=(dx:number)=>200+s*dx;
    out.push(path(`channel_half_${s}`,`M ${X(11)} 98 C ${X(21)} 85 ${X(38)} 88 ${X(42)} 101 C ${X(61)} 88 ${X(74)} 102 ${X(68)} 130 L ${X(60)} 188 C ${X(50)} 210 ${X(30)} 212 ${X(25)} 194 L ${X(13)} 177 C ${X(7)} 160 ${X(10)} 146 ${X(10)} 129 Z`,{color:P.bluePale,stroke:P.blueDark,strokeWidth:1.8}));
    out.push(path(`channel_helix_${s}`,`M ${X(53)} 105 C ${X(39)} 128 ${X(61)} 149 ${X(46)} 174 L ${X(37)} 195`,{stroke:P.blue,strokeWidth:9}));
    out.push(path(`channel_helix_light_${s}`,`M ${X(51)} 104 C ${X(37)} 127 ${X(59)} 148 ${X(44)} 173 L ${X(35)} 194`,{stroke:'#f3fbff',strokeWidth:3}));
    out.push(path(`channel_pore_loop_${s}`,`M ${X(31)} 101 Q ${X(42)} 116 ${X(14)} 124 L ${X(14)} 150 Q ${X(8)} 172 ${X(25)} 185`,{stroke:P.blueDark,strokeWidth:3}));
    [125,136,147].forEach((y,i)=>out.push(line(`filter_ligand_${s}_${i}`,X(16),y,X(10),y,P.muted,1.5),circle(`filter_oxygen_${s}_${i}`,X(9),y,2.8,P.red)));
  }
  return out;
}


return {carrier, channel, oxygen, glucose, ion, membrane, isolateRuns, P};
})();

// One clock, in seconds. No step renderer, timers, CSS animations or keyed scene swaps.
export const DURATION = 96;
const TAU=Math.PI*2;
export const CHAPTERS = [
  {start:0, center:140, name:"דיפוזיה", text:"מולקולות קטנות נעות באקראי; התנועה נטו היא במורד מפל הריכוז."},
  {start:10, center:385, name:"תעלת אשלגן", text:"יוני K⁺ עוברים בטור יחיד. מעטפת המים מתחלפת בקשרי מסנן הבררנות וחוזרת בצד השני."},
  {start:20, center:640, name:"משאבת נתרן–אשלגן", text:"בכל מחזור: 3 Na⁺ החוצה, 2 K⁺ פנימה. ATP מזרחן את המשאבה ומניע גישה מתחלפת."},
  {start:44, center:895, name:"סימפורט", text:"ב־SGLT1 נקשרים יחד 2 Na⁺ וגלוקוז אחד. הגישה מתחלפת ורק אז המטען משתחרר פנימה."},
  {start:60, center:770, name:"המפל מחבר ביניהם", text:"המשאבה שומרת על מעט Na⁺ בפנים. חזרתו דרך SGLT1 מספקת אנרגיה לצבירת גלוקוז, ללא ATP ישיר בנשא."},
];
export const chapterAt=(t:number)=>CHAPTERS.findLastIndex(c=>t>=c.start);
const mod=(x:number,n:number)=>(x%n+n)%n;
const ease=(x:number)=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const ramp=(p:number,a:number,b:number)=>ease((p-a)/(b-a));
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
type Point=[number,number];
const lerp=(a:Point,b:Point,u:number):Point=>[mix(a[0],b[0],u),mix(a[1],b[1],u)];
function bez(a:Point,b:Point,c:Point,d:Point,u:number):Point {const v=1-u;return [v*v*v*a[0]+3*v*v*u*b[0]+3*v*u*u*c[0]+u*u*u*d[0],v*v*v*a[1]+3*v*v*u*b[1]+3*v*u*u*c[1]+u*u*u*d[1]]}
const POCKETS:Point[]=[[-16,140],[0,158],[16,176]];
export function pumpState(t:number){const p=mod(t-20,24);return {p,out:ramp(p,6,9)*(1-ramp(p,16,19)),phosphate:ramp(p,5,6)*(1-ramp(p,15,16))}}
export function symportState(t:number){const p=mod(t-44,16);return {p,out:1-ramp(p,4,7)+ramp(p,10,13)}}
const IN=carrier('pump','in'), OUT=carrier('pump','out');
const SIN=carrier('sglt','in'), SOUT=carrier('sglt','out');
function paths(a:El[],b:El[]){return a.filter(e=>e.type==='path'&&e.id.includes('lobe')).map(e=>{
 const d=String(e.d), dest=String(b.find(o=>o.id===e.id)!.d);
 const from=d.match(/-?\d+(?:\.\d+)?/g)!.map(Number),to=dest.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
 return {id:e.id,d,from,to};
})}
const MORPHS=[...paths(IN,OUT),...paths(SIN,SOUT)];
function Shape({e}:{e:El}) {
 const style={fill:e.color||'none',stroke:e.stroke||'none',strokeWidth:e.strokeWidth||0,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 const p={"data-art":e.id,style};
 if(e.type==='path')return <path {...p} d={e.d}/>;
 if(e.type==='circle')return <circle {...p} cx={e.cx} cy={e.cy} r={e.r}/>;
 if(e.type==='ellipse')return <ellipse {...p} cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry}/>;
 if(e.type==='line')return <line {...p} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}/>;
 if(e.type==='text')return <text data-art={e.id} x={e.x} y={e.y} textAnchor="middle" fontSize={e.fontSize||16.5} fontWeight={e.weight||500} fill={e.textColor||P.ink}>{e.labelHe}</text>;
 return null;
}
const Art=memo(function Art({elements}:{elements:El[]}){return <>{elements.map(e=><Shape key={e.id} e={e}/>)}</>});
const CHANNEL=channel();
// Binding pockets remain recessed, stable objects during continuous gate movement.
// Retain the exact original head/two-tail geometry, translated per lipid.
const LIPID=membrane().filter(e=>e.id.startsWith('lipid_0_'));
const LIPIDS=Array.from({length:89},(_,i)=>8+i*12).filter(x=>![385,640,895].some(c=>Math.abs(x-c)<76));
const LABELS=["דיפוזיה פשוטה","תעלת K⁺","משאבת Na⁺/K⁺","SGLT1"];
const targets:Point[]=[[272,125],[394,125],[624,128],[879,128],[895,98]];
const callouts=["ראשים קוטביים","מסנן בררנות","כיסי הקישור","קישור מצומד","מפל Na⁺ פנימה"];
const sceneCSS=`
.tc{--bg:#fafbf9;--ink:#25364a;--muted:#586b7d;--border:#cbd7d9;--outside:#edf5f8;--inside:#edf4ef;--button:#fff;background:var(--bg);color:var(--ink);border:1px solid var(--border);border-radius:20px;overflow:hidden;font:15px/1.55 system-ui,sans-serif;text-align:start;isolation:isolate}
.dark .tc,.tc[data-theme=dark]{--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--outside:#203845;--inside:#203b35;--button:#253945}
@media(prefers-color-scheme:dark){.tc:not([data-theme=light]){--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--outside:#203845;--inside:#203b35;--button:#253945}}
.tc *{box-sizing:border-box}.tc header{padding:20px 24px 12px}.tc .tc-kicker{font-size:12px;letter-spacing:.06em;color:var(--muted)}.tc h2{font-size:25px;line-height:1.3;margin:4px 0}.tc .tc-top{display:flex;justify-content:space-between;gap:10px;align-items:center}.tc button{background:var(--button);color:var(--ink);border:1px solid var(--border);border-radius:9px;padding:8px 12px;font:inherit;cursor:pointer;min-height:42px}.tc button:focus-visible,.tc input:focus-visible{outline:3px solid #398bb3;outline-offset:3px}.tc button[aria-current=true]{background:#346451;color:white;border-color:#346451}.tc button:disabled{opacity:.6;cursor:default}.tc .tc-chapters{display:flex;gap:6px;flex-wrap:wrap;padding:0 24px 12px}.tc-chapters button{font-size:13px;flex:1;white-space:nowrap}.tc .tc-stage{position:relative}.tc svg.tc-movie{display:block;width:100%;height:auto;aspect-ratio:1060/360}.tc .tc-compartment{padding:0 24px;color:var(--muted);font-size:13px}.tc .tc-compartment:last-child{padding-top:3px}.tc svg text{font-family:system-ui,sans-serif}.tc .tc-caption{margin:14px 24px 0;min-height:76px;font-size:16px;line-height:1.6}.tc .tc-caption strong{display:block}.tc .tc-phase{color:var(--muted);font-size:13px;min-height:24px;margin:0 24px 12px}.tc .tc-controls{display:flex;align-items:center;gap:10px;padding:0 24px 12px}.tc input[type=range]{flex:1;min-width:30px;accent-color:#548b75;direction:ltr}.tc output{font-variant-numeric:tabular-nums;white-space:nowrap;font-size:12px;direction:ltr}.tc label{display:flex;gap:5px;align-items:center;font-size:13px}.tc .tc-legend{border-top:1px solid var(--border);padding:12px 24px;display:flex;gap:10px 20px;flex-wrap:wrap;font-size:13px}.tc .tc-legend span{display:inline-flex;align-items:center;gap:5px}.tc i{display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--dot)}.tc .tc-note{font-size:11px;color:var(--muted);padding:0 24px 14px}.tc .tc-leader{fill:none;stroke:var(--muted);stroke-width:1.3}.tc .tc-label{fill:var(--ink);font-size:18px}.tc .tc-name{fill:var(--muted);font-size:18px}
@media(max-width:600px){.tc header{padding:16px 14px 12px}.tc h2{font-size:21px}.tc .tc-chapters{padding:0 14px 10px}.tc .tc-chapters button{font-size:12px;padding:6px}.tc svg.tc-movie{aspect-ratio:330/330}.tc .tc-caption{margin:12px 14px 0;min-height:128px;font-size:15px}.tc .tc-phase{margin:0 14px 10px;min-height:42px}.tc .tc-controls{padding:0 14px 12px;flex-wrap:wrap}.tc .tc-legend{padding:12px 14px;gap:10px 14px}.tc .tc-note{padding:0 14px 14px}.tc .tc-compartment{padding:0 14px}.tc .tc-label,.tc .tc-name{font-size:16px}}
`;

export default function TransportScene({processName,theme}:{lang?:string;processName?:string;theme?:"light"|"dark"}){
 const root=useRef<HTMLElement>(null),svg=useRef<SVGSVGElement>(null);
 const seek=useRef<(t:number)=>void>(()=>{}),clock=useRef(0),playing=useRef(true),looping=useRef(true),reduced=useRef(false);
 const [running,setRunning]=useState(true),[loop,setLoop]=useState(true),[time,setTime]=useState(0),[reduce,setReduce]=useState(false);
 const uid=useId().replace(/:/g,'');
 const chapter=Math.max(0,chapterAt(time));
 useEffect(()=>{
  const host=root.current!,movie=svg.current!;
  const q=(s:string)=>movie.querySelector(s)!;
  const transforms=new Map<string,Element>();movie.querySelectorAll('[data-move]').forEach(e=>transforms.set(e.getAttribute('data-move')!,e));
  const morphs=MORPHS.map(m=>({...m,node:q(`[data-art="${m.id}"]`)}));
  const shells=Array.from({length:5},(_,i)=>q(`[data-water="${i}"]`));
  const halo=q('[data-focus]'),camera=q('[data-camera]'),lead=q('[data-leader]'),label=q('[data-callout]'),phase=host.querySelector('[data-phase]')!;
  const media=matchMedia('(prefers-reduced-motion: reduce)'),narrow=matchMedia('(max-width:600px)');
  const proteinGroups=Array.from(movie.querySelectorAll('[data-protein]'));
  let proteinAlpha=[1,1,1];
  let visible=true,docVisible=!document.hidden,raf=0,last=0,uiTime=-1;
  const move=(id:string,point:Point,alpha=1)=>{const node=transforms.get(id)!;const visibility=id.startsWith('channel')?proteinAlpha[0]:/^(pump|atp|adp|phosphate)/.test(id)?proteinAlpha[1]:/^sglt/.test(id)?proteinAlpha[2]:1;node.setAttribute('transform',`translate(${point[0].toFixed(3)} ${point[1].toFixed(3)})`);node.setAttribute('opacity',Math.max(0,Math.min(1,alpha*visibility)).toFixed(3))};
  function draw(t:number){
   clock.current=t;const ci=Math.max(0,chapterAt(t)),ch=CHAPTERS[ci],ps=pumpState(t),ss=symportState(t);
   let center=ch.center;
   if(ci>0)center=mix(CHAPTERS[ci-1].center,center,ramp(t,ch.start,ch.start+2));
   // Smoothly return to the first view before the loop seam.
   if(t>92)center=mix(center,CHAPTERS[0].center,ramp(t,92,96));
   const chapterWidth=ci===0?300:ci===4?460:330;
   let mobileWidth=ci===1?mix(300,330,ramp(t,10,12)):ci===4?mix(330,460,ramp(t,60,62)):chapterWidth;
   if(t>92)mobileWidth=mix(mobileWidth,300,ramp(t,92,96));
   if(!narrow.matches)mobileWidth=1060;
   const left=narrow.matches?Math.max(0,Math.min(1060-mobileWidth,center-mobileWidth/2)):0;
   movie.setAttribute('viewBox',`${left} 0 ${mobileWidth} 360`);
   // Fade a whole protein (and its cargo/name) before its silhouette reaches
   // the camera edge. Bounds include strokes; no layout reads during playback.
   proteinAlpha=[385,640,895].map(x=>narrow.matches?ease(Math.min(x-77-left,left+mobileWidth-x-77)/18):1);
   for(const group of proteinGroups)group.setAttribute('opacity',String(proteinAlpha[+group.getAttribute('data-protein')!]));
   for(const m of morphs){let i=0;const u=m.id.startsWith('pump')?ps.out:ss.out;m.node.setAttribute('d',m.d.replace(/-?\d+(?:\.\d+)?/g,()=>mix(m.from[i],m.to[i++],u).toFixed(3)))}
   // Brownian-like lateral oscillation plus net drift: O2 down, CO2 up.
   for(let i=0;i<16;i++){
    const co=i>=10,j=co?i-10:i,u=mod(t/(co?16:12)+j/(co?6:10),1);
    const x=65+(j%5)*34+6*Math.sin(t*TAU*26/96+i)+3*Math.sin(t*TAU*47/96+i*2);
    const reverse=co?j===5:j>=8;
    const downward=co?reverse:!reverse;
    move(`gas${i}`,[x,downward?mix(65,265,u):mix(265,65,u)],ramp(u,0,.06)*(1-ramp(u,.94,1)));
   }
   for(let i=0;i<20;i++){
    const co=i>=12,j=co?i-12:i,high=co?j<6:j<10;
    move(`gasPool${i}`,[54+(j%5)*34+3*Math.sin(t*TAU*12/96+i),(co?(high?230+Math.floor(j/5)*26:30):(high?82+Math.floor(j/5)*24:290))+3*Math.cos(t*TAU*15/96+i)]);
   }
   // Single-file K+ conduction, inside -> outside in this electrochemical example.
   for(let i=0;i<5;i++){
    const u=mod(t/8+i/5,1),y=mix(270,58,u),filter=ramp(y,110,119)*(1-ramp(y,151,166));
    move(`channel${i}`,[385+7*Math.sin(t*TAU*15/96+i)*(1-filter)*(Math.abs(y-140)>42?1:0),y],ramp(u,0,.05)*(1-ramp(u,.95,1)));
    shells[i].setAttribute('opacity',(1-filter).toFixed(3));
    shells[i].setAttribute('transform',`scale(${1+.45*filter})`);
   }
   const p=ps.p;
   for(let i=0;i<3;i++){
    const pocket:Point=[640+POCKETS[i][0],POCKETS[i][1]];
    let pos=bez([590+i*45,280],[590+i*45,250],[624+i*16,206+i*10],pocket,ramp(p,.3+i*.35,2.7+i*.15));
    if(p>9)pos=bez(pocket,[624+i*16,90+i*10],[620+i*35,55],[620+i*35,25],ramp(p,9+i*.2,12+i*.2));
    move(`pumpNa${i}`,pos,ramp(p,0,.3)*(1-ramp(p,12,13)));
   }
   for(let i=0;i<2;i++){
    const pocket:Point=[640+POCKETS[i*2][0],POCKETS[i*2][1]];
    let pos=bez([600+i*80,60],[600+i*80,75],[624+i*32,106+i*22],pocket,ramp(p,12+i*.3,14.7+i*.3));
    if(p>19)pos=bez(pocket,[624+i*32,212+i*10],[600+i*80,255],[600+i*80,283],ramp(p,19+i*.25,21.7+i*.25));
    move(`pumpK${i}`,pos,ramp(p,11.8,12.2)*(1-ramp(p,22,23)));
   }
   move('atp',lerp([550,281],[591,215],ramp(p,3,5)),ramp(p,2.7,3.1)*(1-ramp(p,5.5,6)));
   move('adp',lerp([591,215],[537,278],ramp(p,6,9)),ramp(p,6,6.25)*(1-ramp(p,9,10)));
   const phosph=p<6?lerp([609,215],[629,221],ramp(p,5,6)):lerp([629,221],[705,267],ramp(p,15,17));
   move('phosphate',phosph,ramp(p,5,5.3)*(1-ramp(p,17,18)));
   const s=ss.p;
   for(let i=0;i<3;i++){
    const pocket:Point=[895+POCKETS[i][0],POCKETS[i][1]];
    let pos=bez([850+i*45,62],[850+i*45,85+i*10],[879+i*16,112+i*18],pocket,ramp(s,.6,3.5));
    if(s>7)pos=bez(pocket,[879+i*16,210+i*8],[850+i*45,245],[850+i*45,278],ramp(s,7.4,10));
    move(`sglt${i}`,pos,ramp(s,0,.5)*(1-ramp(s,10,10.6)));
   }
   // Persistent Na+ reservoir: many outside, few inside. Not a numeric concentration scale.
   for(let i=0;i<16;i++)move(`reservoir${i}`,[766+(i%8)*34+4*Math.sin(t*TAU*11/96+i),i<14?35+Math.floor(i/8)*25+3*Math.cos(t*TAU*15/96+i):260+4*Math.cos(t*TAU*15/96+i)]);
   for(let i=0;i<5;i++)move(`sugarPool${i}`,[i===4?989:826+i*46+3*Math.sin(t*TAU*9/96+i),i===4?82+3*Math.cos(t*TAU*12/96):298+3*Math.cos(t*TAU*12/96+i)]);
   // Lateral drift in the common extracellular reservoir links pump output to cotransport.
   for(let i=0;i<4;i++){const u=mod((t-60)/8+i/4,1);move(`bridge${i}`,bez([680,45],[730,6],[820,6],[855,49],u),ramp(u,0,.1)*(1-ramp(u,.9,1))*.65)}
   camera.setAttribute('data-center',center.toFixed(2));
   halo.setAttribute('cx',String(center));halo.setAttribute('rx',String(ci===4?mix(240,95,ramp(t,92,96)):95));
   // Gas centers stay at x <= 210, with molecular extents below 224.
   // This entire leader stays at x >= 235 and ends on a real lipid head.
   const target=targets[ci],lx=ci===0?235:ci===4?820:ch.center+35;
   const annotationAlpha=narrow.matches?ease(Math.min(lx-58-left,left+mobileWidth-lx-58,target[0]-left-2,left+mobileWidth-target[0]-2)/6):1;
   label.setAttribute('opacity',String(annotationAlpha));lead.setAttribute('opacity',String(annotationAlpha));
   label.setAttribute('x',String(lx));label.textContent=isolateRuns(callouts[ci]);
   lead.setAttribute('d',`M ${lx} 68 L ${lx} 82 L ${target[0]} ${target[1]}`);
   phase.textContent=isolateRuns(ci===2?(p<3?'נקשרים שלושה יוני Na⁺':p<5?'ATP מתקרב לתחום הקישור':p<6?'הפוספט מועבר למשאבה':p<9?'שינוי צורה: גישה החוצה':p<12?'שלושת יוני Na⁺ משתחררים החוצה':p<15?'נקשרים שני יוני K⁺':p<16?'הפוספט משתחרר':p<19?'שינוי צורה: גישה פנימה':'שני יוני K⁺ משתחררים לציטוזול'):ci===3?(s<4?'שני Na⁺ וגלוקוז אחד נקשרים יחד':s<7?'שינוי צורה דרך מצב אטום':s<10?'המטען המצומד משתחרר בפנים':'הנשא הריק חוזר לפנות החוצה'):ci===4?'ATP במשאבה ← מפל נתרן ← כניסת גלוקוז':'התנועה ממשיכה גם בין הפרקים');
   host.dataset.time=t.toFixed(3);host.dataset.chapter=String(ci);
  }
  function sync(t:number){draw(t);setTime(t);uiTime=t}
  seek.current=(t)=>{sync(Math.max(0,Math.min(DURATION,t)));last=0};
  function tick(now:number){raf=0;if(!playing.current||reduced.current||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min((now-last)/1000,.08);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(t-uiTime)>.12||!playing.current){setTime(t);uiTime=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)}
  function resume(){last=0;if(!raf&&playing.current&&!reduced.current&&visible&&docVisible)raf=requestAnimationFrame(tick)}
  function visibility(){docVisible=!document.hidden;if(!docVisible&&raf){cancelAnimationFrame(raf);raf=0}resume()}
  function preference(){reduced.current=media.matches;setReduce(media.matches);if(media.matches){if(raf)cancelAnimationFrame(raf);raf=0;sync(CHAPTERS[Math.max(0,chapterAt(clock.current))].start+2)}else resume()}
  function resize(){draw(clock.current)}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible&&raf){cancelAnimationFrame(raf);raf=0}resume()},{threshold:.05});observer.observe(host);
  const onPlay=()=>resume();host.addEventListener('transport-play',onPlay);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);narrow.addEventListener('change',resize);
  preference();sync(clock.current);resume();
  return ()=>{cancelAnimationFrame(raf);observer.disconnect();host.removeEventListener('transport-play',onPlay);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);narrow.removeEventListener('change',resize)};
 },[]);
 const jump=(t:number)=>seek.current(t);
 const toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)jump(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('transport-play'))};
 return <section ref={root} className="tc" dir="rtl" data-theme={theme} aria-label={processName||"מעבר חומרים דרך הממברנה"}>
  <style>{sceneCSS}</style>
  <header><div className="tc-top"><span className="tc-kicker">תנועה, בררנות ואנרגיה</span><span className="tc-kicker">{reduce?'תצוגה רגועה':'סרט רציף · מחזור שלם'}</span></div><h2>{processName||"חיים משני צדי הממברנה"}</h2></header>
  <nav className="tc-chapters" aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(c.start+(reduce?2:0))}>{isolateRuns(`${i+1} · ${c.name}`)}</button>)}</nav>
  <div className="tc-compartment">מחוץ לתא</div>
  <div className="tc-stage"><svg ref={svg} className="tc-movie" viewBox="0 0 1060 360" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
   <title id={`${uid}-title`}>מעבר חומרים דרך ממברנה בתנועה רציפה</title><desc id={`${uid}-desc`}>ממברנה אחת ובה דיפוזיה, תעלת אשלגן, משאבת נתרן אשלגן וסימפורטר. המשאבה והנשא משנים צורה דרך מצב סגור. אפשר לעצור ולעבור לפרק.</desc>
   <defs><radialGradient id={`${uid}-focus`}><stop stopColor="#75ac95" stopOpacity=".15"/><stop offset="1" stopColor="#75ac95" stopOpacity="0"/></radialGradient></defs>
   <g data-camera=""><rect x="0" y="18" width="1060" height="107" rx="18" fill="var(--outside)"/><rect x="0" y="176" width="1060" height="151" rx="18" fill="var(--inside)"/>
    <ellipse data-focus="" cx="140" cy="160" rx="95" ry="150" fill={`url(#${uid}-focus)`}/>
    {LIPIDS.map(x=><g key={x} transform={`translate(${x-14} 0)`}><Art elements={LIPID}/></g>)}
    <g data-protein="0" transform="translate(185 0)"><Art elements={CHANNEL}/></g>
    <g data-protein="1" transform="translate(440 0)"><Art elements={IN}/></g>
    <g data-protein="2" transform="translate(695 0)"><Art elements={SOUT}/></g>
    {Array.from({length:16},(_,i)=><g key={`g${i}`} data-move={`gas${i}`} opacity="0">{i<10?<Art elements={oxygen(`gas_${i}`,0,0)}/>:<><path d="M -9 0 H 9" stroke={P.oxygen} strokeWidth="2"/>{[-9,0,9].map((x,j)=><circle key={x} cx={x} r={j===1?4:4.7} fill={j===1?'#647581':'#b7dbe9'} stroke={P.oxygen} strokeWidth="1.2"/>)}</>}</g>)}
    {Array.from({length:20},(_,i)=><g key={`gp${i}`} data-move={`gasPool${i}`} opacity="0">{i<12?<Art elements={oxygen(`pool_${i}`,0,0)}/>:<><path d="M -9 0 H 9" stroke={P.oxygen} strokeWidth="2"/>{[-9,0,9].map((x,j)=><circle key={x} cx={x} r={j===1?4:4.7} fill={j===1?'#647581':'#b7dbe9'} stroke={P.oxygen} strokeWidth="1.2"/>)}</>}</g>)}
    {Array.from({length:5},(_,i)=><g key={`c${i}`} data-move={`channel${i}`} opacity="0"><g data-water={i}>{Array.from({length:6},(_,j)=><circle key={j} cx={17*Math.cos(j*Math.PI/3)} cy={17*Math.sin(j*Math.PI/3)} r="3" fill="#abd3e5" stroke="#6babc9" strokeWidth=".7"/>)}</g><Art elements={ion(`channel_k${i}`,0,0,'k')}/></g>)}
    {[...Array.from({length:3},(_,i)=>({id:`pumpNa${i}`,kind:'na' as const})),...Array.from({length:2},(_,i)=>({id:`pumpK${i}`,kind:'k' as const})),...Array.from({length:2},(_,i)=>({id:`sglt${i}`,kind:'na' as const}))].map(a=><g key={a.id} data-move={a.id} opacity="0"><Art elements={ion(a.id,0,0,a.kind)}/></g>)}
    <g data-move="sglt2" opacity="0"><Art elements={glucose('cargo',0,0)}/></g>
    {['atp','adp'].map(id=><g key={id} data-move={id} opacity="0"><rect x="-22" y="-11" width="44" height="22" rx="5" fill={id==='atp'?'#f3d590':'#dbe4de'} stroke="#805322"/><text x="0" y="5" fill="#65481f" fontSize="14" textAnchor="middle">{isolateRuns(id.toUpperCase())}</text></g>)}
    <g data-move="phosphate" opacity="0"><circle r="10" fill="#f3d590" stroke="#805322"/><text y="5" fontSize="14" fill="#65481f" textAnchor="middle">{isolateRuns('P')}</text></g>
    {Array.from({length:16},(_,i)=><g key={`r${i}`} data-move={`reservoir${i}`} opacity="0"><circle r="5" fill={P.sodium} opacity=".65"/></g>)}
    {Array.from({length:5},(_,i)=><g key={`sp${i}`} data-move={`sugarPool${i}`} opacity="0"><Art elements={glucose(`sugar_pool${i}`,0,0)}/></g>)}
    {Array.from({length:4},(_,i)=><g key={`b${i}`} data-move={`bridge${i}`} opacity="0"><circle r="5" fill={P.sodium}/></g>)}
    <path data-leader="" className="tc-leader" d="M235 68 L235 82 L272 125"/><text data-callout="" className="tc-label" x="235" y="57" textAnchor="middle">ראשים קוטביים</text>
    {[140,385,640,895].map((x,i)=><text key={x} data-protein={i?i-1:undefined} x={x} y="345" textAnchor="middle" className="tc-name">{isolateRuns(LABELS[i])}</text>)}
   </g>
  </svg></div><div className="tc-compartment">ציטוזול</div>
  <p className="tc-caption" aria-live="polite" aria-atomic="true"><strong>{isolateRuns(CHAPTERS[chapter].name)}</strong>{isolateRuns(CHAPTERS[chapter].text)}</p>
  <p className="tc-phase" data-phase=""/>
  <div className="tc-controls"><button onClick={toggle} disabled={reduce} aria-label={running?'השהיה':'ניגון'}>{running&&!reduce?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step="0.01" value={time} onChange={e=>jump(Number(e.target.value))}/><output>{Math.floor(time).toString().padStart(2,'0')} / {DURATION}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>לולאה</label></div>
  <div className="tc-legend" aria-label="מקרא"><span><i style={{background:P.oxygen}}/>{'\u2066O₂ / CO₂\u2069'}</span><span><i style={{background:P.sodium}}/>{isolateRuns('Na⁺')}</span><span><i style={{background:P.potassium}}/>{isolateRuns('K⁺')}</span><span><i style={{background:P.sugar,borderRadius:2,transform:'rotate(30deg)'}}/>גלוקוז</span><span><i style={{background:'#abd3e5'}}/>מעטפת מים</span><span>{'\u2066ATP → ADP + Pᵢ\u2069'}</span></div>
  <div className="tc-note">איור סכמטי, ללא קנה מידה או קינטיקה מדודה. מוצגת יציאת אשלגן במורד מפל אלקטרוכימי מתאים. זהו תא כללי, ללא מיפוי קוטביות של אפיתל.</div>
 </section>;
}
