"use client";

import { memo, useEffect, useId, useRef, useState } from "react";

type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
type Point = [number, number];
const TAU = Math.PI * 2;
export const DURATION = 144;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;
const ramp = (t: number, a: number, b: number) => { const u = clamp((t-a)/(b-a)); return u*u*(3-2*u); };
const win = (t: number, a: number, b: number) => ramp(t,a,a+2)*(1-ramp(t,b-2,b));
export const isolate = (s: string) => s.replace(/[\u2066\u2069]/g, "").replace(/[A-Za-z0-9][A-Za-z0-9₀-₉ⁿ⁺⁻]*(?:[ .+×=−–/-]+[A-Za-z0-9][A-Za-z0-9₀-₉ⁿ⁺⁻]*)*/g, r => "\u2066"+r+"\u2069");
export const CHAPTERS = [
 {start:0,still:8,he:"תא אחד בתנועה",en:"One living cell",text:"חיידק E. coli סכמטי: פרוקריוט ללא גרעין וללא אברונים עטופי ממברנה מהסוג האאוקריוטי. הכרומוזום המעגלי נמצא בנוקלאואיד; פלסמידים הם מולקולות DNA קטנות נוספות. ריבוזומי 70S מייצרים חלבונים (לעומת 80S בציטוזול האאוקריוטי). השוטון מסתובב ומניע את התא; פילי מסייעים בהיצמדות, וסוגים מסוימים בהעברת DNA. קופסית עשויה לעטוף את התא — היא אינה קיימת בכל חיידק."},
 {start:14,still:22,he:"הגדלה · המעטפת",en:"Envelope close-up",text:"ההגדלה מעוגנת באותו תא: ממברנה פנימית בררנית, דופן פפטידוגליקן דקה בפריפלזמה, וממברנה חיצונית. LPS נמצא בעלעל החיצוני של הממברנה החיצונית; החלק lipid A הוא המרכיב האנדוטוקסיני. הקופסית המוצגת היא מעטפת אפשרית נוספת, מחוץ לדופן."},
 {start:30,still:38,he:"הרחבה · Gram",en:"Gram comparison",text:"השוואה נפרדת: ב־Gram חיובי פפטידוגליקן עבה וחומצות טייכואיות; המבנה שומר את צבע הקריסטל־סגול. ב־Gram שלילי פפטידוגליקן דק בפריפלזמה וממברנה חיצונית עם LPS; אחרי צביעת הנגד התאים ורודים. פפטידוגליקן חסר בתאי אדם. פניצילין מעכב יצירת קשרי רוחב בפפטידוגליקן וכך פוגע בדופן של חיידקים גדלים."},
 {start:46,still:55,he:"שכפול והפרדה",en:"Replication and segregation",text:"חוזרים לאותו חיידק: השכפול מתחיל ב־oriC ומתקדם בשני כיוונים על הכרומוזום המעגלי. שני עותקי הכרומוזום נפרדים בהדרגה אל שני חצאי התא, בזמן שהתא מתארך. הסמן הכחול שומר על זהות קוטב התא המקורי; נקודות הזהב מסמנות את מוצאי השכפול."},
 {start:64,still:75,he:"מיקום טבעת FtsZ",en:"Positioning FtsZ",text:"תנודות מערכת MinCDE יוצרות בממוצע עיכוב חזק יותר בקוטבי התא ומאפשרות התארגנות FtsZ באמצע. גם הנוקלאואידים מעכבים חלוקה מעל הכרומוזום. לאחר הפרדתם, טבעת FtsZ מתארגנת בצד הציטופלזמי של הממברנה ומגייסת את מערכת החלוקה."},
 {start:80,still:89,he:"מחיצה ושתי בנות",en:"Septum and daughters",text:"טבעת FtsZ ומערכת החלוקה מכוונות בנייה של ממברנה ודופן חדשות במרכז; הטבעת מתכווצת, המחיצה נסגרת ושתי הבנות נפרדות. כל בת מקבלת עותק כרומוזום — זהות גנטית בקירוב, בהיעדר מוטציות. E. coli יכול להכפיל אוכלוסייה בכ־20 דקות במצע עשיר ובתנאים מיטביים; זה אינו משך השכפול המוצג. בגידול מהיר מחזורי שכפול עשויים לחפוף."},
 {start:102,still:107,he:"גידול · השהיה",en:"Growth · lag",text:"הרחבה: בתרבית סגורה התאים מסתגלים למצע, מייצרים אנזימים ומרכיבים תאיים, וכמעט אינם מתחלקים. כאן עוקבים אחר תא יחיד וצאצאיו: כל תא מצויר הוא תא אחד במודל. הציר האנכי לוגריתמי; הנקודה מציגה את מגמת הגידול הרציפה, והספירה מתעדכנת בתום כל חלוקה."},
 {start:111,still:118,he:"גידול · מעריכי",en:"Growth · exponential",text:"בשלב המעריכי זמן הדור קבוע בתנאים נתונים: N=N₀×2ⁿ. מספר התאים החיים גדל מעריכית, ולכן מתקבל קו עולה ישר בציר לוגריתמי. התאים מתארכים, יוצרים מחיצה ונפרדים: 1, 2, 4, 8, 16, 32 ו־64 תאים. הנקודה נעה על מגמת הגידול, והספירה מציינת דורות שלמים. זהו מודל המחשה, ואינו מדידה של תרבית."},
 {start:123,still:127,he:"גידול · נייח",en:"Growth · stationary",text:"חומרי ההזנה מתדלדלים ופסולת מצטברת. במודל הפשוט קצב יצירת התאים שווה לקצב מותם, ולכן מספר התאים החיים נשאר בקירוב קבוע. הסמנים הקטנים מראים מזון שמתמעט ופסולת שמצטברת. גובה העקומה הקבוע אינו אומר שכל פעילות התא נעצרה."},
 {start:133,still:140,he:"גידול · מוות",en:"Growth · death",text:"קצב המוות עולה על קצב יצירת התאים, ומספר התאים החיים יורד. העקומה והספירה מציגות תאים חיים; התאים דוהים לשרידים חלשים, כי תא מת אינו חייב להיעלם פיזית מן התרבית. זהו מודל סכמטי של תרבית סגורה — לא תחזית ולא מדידה."},
];
const chapterAt = (t: number) => Math.max(0,CHAPTERS.findLastIndex(c=>t>=c.start));
const coil = (a: number): Point => [61*Math.sin(a)+14*Math.sin(5*a),-25*Math.cos(a)+9*Math.sin(4*a)];
const DNA = Array.from({length:161},(_,i)=>{const p=coil(i/160*TAU);return `${i?'L':'M'}${p[0]} ${p[1]}`;}).join(' ')+'Z';
const body = (half: number, pinch: number) => {
 const p=pinch*57;
 return `M${-half+60} -60 H-55 C-25 -60 -24 ${-60+p} 0 ${-60+p} C24 ${-60+p} 25 -60 55 -60 H${half-60} A60 60 0 0 1 ${half-60} 60 H55 C25 60 24 ${60-p} 0 ${60-p} C-24 ${60-p} -25 60 -55 60 H${-half+60} A60 60 0 0 1 ${-half+60} -60Z`;
};

const CellArt = memo(function CellArt({uid}:{uid:string}) {
 return <g data-id="cell">
  <path data-id="capsule" fill="none" stroke="#91adba" strokeWidth="18" strokeDasharray="2 5" opacity=".4"/>
  <path data-id="body" fill={`url(#${uid}-cyto)`} stroke="#47799c" strokeWidth="10"/>
  <path data-id="pg" fill="none" stroke="#548b75" strokeWidth="3"/>
  <path data-id="inner" fill="none" stroke="#c4a56c" strokeWidth="3"/>
  <path data-id="shine" fill="none" stroke="#f3fff9" strokeWidth="2" opacity=".5"/>
  <g data-id="pili" stroke="#7b94a5" strokeWidth="2.5" strokeLinecap="round">{[-115,-70,-20,35,90,125].map((x,i)=><g key={x}><path d={`M${x} -61 l${i%2?8:-8} -23`}/><path d={`M${x} 61 l${i%2?-7:7} 22`}/></g>)}</g>
  <path data-id="flag" fill="none" stroke="#6b8c99" strokeWidth="4" strokeLinecap="round"/>
  <g data-id="ribs">{Array.from({length:30},(_,i)=>{const x=-128+(i*47%256),y=(i%2?-1:1)*(35+i%4*2);return <g key={i} data-rib={i} transform={`translate(${x} ${y})`}><ellipse rx="4.6" ry="3.2" fill="#647e91"/><ellipse cx="1" cy="-2.5" rx="3.1" ry="2" fill="#b4c6cf"/></g>;})}</g>
  <g data-id="min" fill="#b86b80">{Array.from({length:20},(_,i)=><circle key={i} data-min={i} r="3.5"/>)}</g>
  <path data-id="dna1" d={DNA} fill="none" stroke="#47799c" strokeWidth="4" strokeLinecap="round"/>
  <path data-id="dna2" d={DNA} fill="none" stroke="#47799c" strokeWidth="4" pathLength="1" strokeLinecap="round"/>
  <circle data-id="ori1" r="5" fill="#e0ad57" stroke="#805322" strokeWidth="1"/>
  <circle data-id="ori2" r="5" fill="#e0ad57" stroke="#805322" strokeWidth="1"/>
  {[0,1].map(i=><circle key={i} data-id={`fork${i}`} r="4" fill="#f7d99e" stroke="#805322"/>)}
  {[0,1].map(i=><g key={i} data-id={`plasmid${i}`}><ellipse rx="12" ry="9" fill="none" stroke="#87649c" strokeWidth="2.5"/><path d="M-6 -5 Q1 -9 7 -4" fill="none" stroke="#c0a6cf" strokeWidth="1.5"/></g>)}
  <g data-id="ring"><ellipse data-id="ring-back" fill="none" stroke="#805322" strokeWidth="4" strokeDasharray="4 3"/>{Array.from({length:32},(_,i)=><circle key={i} data-ring={i} r="3.4" fill="#d7a253" stroke="#fff2cb" strokeWidth=".8"/>)}</g>
  <path data-id="septum" fill="none" stroke="#548b75" strokeWidth="8" strokeLinecap="round"/>
  <g data-id="identity"><circle r="8" fill="#398bb3" stroke="#fff9ea" strokeWidth="2"/><circle cx="-2" cy="-2" r="2" fill="#eaf7fb"/></g>
  <g data-id="daughterL"><rect x="-125" y="-60" width="250" height="120" rx="60" fill={`url(#${uid}-cyto)`} stroke="#47799c" strokeWidth="8"/><rect x="-119" y="-54" width="238" height="108" rx="54" fill="none" stroke="#548b75" strokeWidth="3"/><rect x="-114" y="-49" width="228" height="98" rx="49" fill="none" stroke="#c4a56c" strokeWidth="2"/></g>
  <g data-id="daughterR"><rect x="-125" y="-60" width="250" height="120" rx="60" fill={`url(#${uid}-cyto)`} stroke="#47799c" strokeWidth="8"/><rect x="-119" y="-54" width="238" height="108" rx="54" fill="none" stroke="#548b75" strokeWidth="3"/><rect x="-114" y="-49" width="228" height="98" rx="49" fill="none" stroke="#c4a56c" strokeWidth="2"/></g>
 </g>;
});

function Bilayer({y,width}:{y:number;width:number}){
 return <g>{Array.from({length:Math.floor(width/10)},(_,i)=>{const x=6+i*10;return <g key={i}>{[-1,1].map(s=><g key={s}><path d={`M${x-2} ${y+s*9} l-1 ${-s*7} M${x+2} ${y+s*9} l1 ${-s*7}`} stroke="#b9a680" strokeWidth="1.5"/><circle cx={x} cy={y+s*12} r="3.5" fill="#e7d6b4" stroke="#a88e60" strokeWidth=".8"/></g>)}</g>;})}</g>;
}
function Envelope({positive,width}:{positive:boolean;width:number}){
 return <g>
  <rect x="0" y="68" width={width} height="156" rx="12" fill="var(--inside)"/>
  <rect x="0" y={positive?82:119} width={width} height={positive?68:17} rx="3" fill="#b5d0b8" opacity=".8"/>
  {Array.from({length:positive?8:2},(_,i)=><path key={i} d={`M0 ${positive?86+i*8:123+i*8} H${width}`} stroke="#548b75" strokeWidth="2"/>)}
  {Array.from({length:Math.floor(width/15)},(_,i)=><path key={i} d={`M${8+i*15} ${positive?82:119} v${positive?68:17}`} stroke="#548b75" strokeWidth="1.3"/>)}
  <Bilayer y={184} width={width}/>
  {positive?<g stroke="#87649c" strokeWidth="3" fill="none">{Array.from({length:Math.floor(width/38)},(_,i)=><path key={i} d={`M${20+i*38} 153 q-6 -16 0 -28 t0 -28 t0 -28`}/>)}</g>:<><Bilayer y={77} width={width}/><g stroke="#b86b80" fill="none" strokeWidth="2">{Array.from({length:Math.floor(width/22)},(_,i)=><path key={i} d={`M${12+i*22} 65 v-17 l-3 -4 l6 -5 l-6 -5 l3 -6`}/>)}</g><g fill="#6b91a2" stroke="#355c72"><path d={`M${width*.33} 59 q-10 18 0 36 h13 q10 -18 0 -36z`}/><path d={`M${width*.7} 59 q-10 18 0 36 h13 q10 -18 0 -36z`}/></g></>}
 </g>;
}

const css=`
.bc{--bg:#fafbf9;--ink:#25364a;--muted:#586b7d;--border:#cbd7d9;--button:#fff;--inside:#edf4ef;--panel:#f0f5f4;background:var(--bg);color:var(--ink);border:1px solid var(--border);border-radius:20px;overflow:hidden;font:15px/1.55 system-ui,sans-serif;text-align:start;isolation:isolate}
.dark .bc,.bc[data-theme=dark]{--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--button:#253945;--inside:#203b35;--panel:#1d3039}
@media(prefers-color-scheme:dark){.bc:not([data-theme=light]){--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--button:#253945;--inside:#203b35;--panel:#1d3039}}
.bc *{box-sizing:border-box}.bc header{padding:20px 24px 12px}.bc h2{font-size:25px;line-height:1.3;margin:4px 0}.bc .bc-top{display:flex;justify-content:space-between;gap:10px;font-size:12px;color:var(--muted)}.bc button{background:var(--button);color:var(--ink);border:1px solid var(--border);border-radius:9px;padding:8px 10px;font:inherit;cursor:pointer;min-height:42px}.bc button:focus-visible,.bc input:focus-visible{outline:3px solid #398bb3;outline-offset:3px}.bc button[aria-current=true]{background:#346451;color:white;border-color:#346451}.bc button:disabled{opacity:.6}.bc nav{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:0 24px 8px}.bc nav button{font-size:12px}.bc svg.bc-movie{display:block;width:100%;height:auto;aspect-ratio:900/660}.bc svg text{font:17px system-ui,sans-serif;fill:var(--ink)}.bc .annotation-bg{fill:var(--bg);stroke:var(--border)}.bc .leader{fill:none;stroke:var(--muted);stroke-width:1.3}.bc .panel{fill:var(--panel);stroke:var(--border)}.bc .bc-caption{margin:6px 24px 0;min-height:145px;font-size:16px}.bc .bc-caption strong{display:block;margin-bottom:4px}.bc .bc-phase{color:var(--muted);font-size:13px;min-height:22px;margin:8px 24px 12px}.bc .bc-controls{display:flex;align-items:center;gap:10px;padding:0 24px 12px}.bc input[type=range]{flex:1;min-width:40px;accent-color:#548b75;direction:ltr}.bc output{font-variant-numeric:tabular-nums;white-space:nowrap;font-size:12px;direction:ltr}.bc label{display:flex;gap:5px;align-items:center;font-size:13px}.bc .bc-legend{border-top:1px solid var(--border);padding:12px 24px;display:flex;gap:8px 18px;flex-wrap:wrap;font-size:13px}.bc .bc-legend span{display:inline-flex;align-items:center;gap:6px}.bc i{width:11px;height:11px;border-radius:50%;display:inline-block}.bc .bc-note{font-size:11px;color:var(--muted);padding:0 24px 14px}
@media(max-width:600px){.bc header{padding:16px 14px 10px}.bc h2{font-size:22px}.bc nav{padding:0 12px 8px;grid-template-columns:repeat(2,minmax(0,1fr))}.bc nav button{font-size:12px;padding:6px}.bc svg.bc-movie{aspect-ratio:440/760}.bc .bc-caption{margin:6px 14px;min-height:205px;font-size:14px}.bc .bc-phase{margin:8px 14px}.bc .bc-controls{padding:0 14px 12px;gap:6px;flex-wrap:wrap}.bc .bc-controls button{font-size:13px}.bc output{font-size:11px}.bc .bc-legend{padding:12px 14px;font-size:12px}.bc .bc-note{padding:0 14px 14px}}
`;

export default function BacteriaScene({lang="he",processName,theme}:Props){
 const root=useRef<HTMLElement>(null),svg=useRef<SVGSVGElement>(null),uid=useId().replace(/:/g,"");
 const [time,setTime]=useState(0),[chapter,setChapter]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduce,setReduce]=useState(false),[phone,setPhone]=useState(false);
 const clock=useRef(0),playing=useRef(true),looping=useRef(true),reduced=useRef(false),seek=useRef<(t:number)=>void>(()=>{});
 const en=lang==="en";
 useEffect(()=>{
  const host=root.current,element=svg.current;if(!host||!element)return;const s=element;
  const media=matchMedia('(prefers-reduced-motion: reduce)'),narrow=matchMedia('(max-width:600px)');
  const nodes=new Map<string,SVGElement>();s.querySelectorAll<SVGElement>('[data-id]').forEach(e=>nodes.set(e.dataset.id!,e));
  const at=(id:string,k:string,v:string|number)=>nodes.get(id)?.setAttribute(k,String(v));
  const op=(id:string,v:number)=>at(id,'opacity',clamp(v));
  const tr=(id:string,x:number,y:number,scale=1)=>at(id,'transform',`translate(${x} ${y}) scale(${scale})`);
  const txt=(id:string,value:string)=>{const e=nodes.get(id);if(e)e.textContent=isolate(value)};
  const ribs=Array.from(s.querySelectorAll<SVGElement>('[data-rib]')),mins=Array.from(s.querySelectorAll<SVGElement>('[data-min]')),ring=Array.from(s.querySelectorAll<SVGElement>('[data-ring]')),population=Array.from(s.querySelectorAll<SVGElement>('[data-pop]'));
  function label(i:number,value:string,x:number,y:number,target:Point|undefined,opacity=1){
   op(`ann${i}`,opacity);txt(`label${i}`,value);at(`label${i}`,'x',x);at(`label${i}`,'y',y+5);
   const e=nodes.get(`label${i}`) as SVGTextElement|undefined,w=Math.min(narrow.matches?410:850,(e?.getComputedTextLength()||value.length*9)+20);
   at(`bg${i}`,'x',x-w/2);at(`bg${i}`,'y',y-15);at(`bg${i}`,'width',w);
   at(`leader${i}`,'d',target?`M${x} ${y+(target[1]>y?15:-15)} L${x} ${mix(y,target[1],.4)} L${target[0]} ${target[1]}`:'');
  }
  function draw(t:number){
   const mobile=narrow.matches,W=mobile?440:900,H=mobile?760:660;
   s.setAttribute('viewBox',`0 0 ${W} ${H}`);host!.dataset.time=t.toFixed(3);
   const zoom=ramp(t,12,18),growth=ramp(t,98,104),cx=mobile?192:420,cy=mix(mobile?225:258,151,zoom),scale=(mobile?.61:1)*(1-.18*growth);
   const swim=(1-ramp(t,8,13))*Math.sin(t*.65)*12;
   tr('cell',cx+swim,cy,scale);
   const elong=ramp(t,46,69),sep=ramp(t,94,99),pinch=ramp(t,81,95),half=mix(150,250,elong);
   const d=body(half,pinch);['capsule','body','pg','inner','shine'].forEach(id=>at(id,'d',d));
   at('pg','transform','scale(.985 .93)');at('inner','transform','scale(.97 .84)');at('shine','transform','scale(.97 .77)');
   const split=ramp(t,94.8,95.6);['body','pg','inner','shine','capsule'].forEach(id=>op(id,(1-split)*(id==='capsule'?.4:1)));
   tr('daughterL',-125-sep*17,0);tr('daughterR',125+sep*17,0);op('daughterL',split);op('daughterR',split);
   // Daughter contours sit behind inherited cytoplasmic contents, never over them.
   const cell=nodes.get('cell'),daughterL=nodes.get('daughterL'),daughterR=nodes.get('daughterR');
   if(cell&&daughterL&&daughterR){cell.insertBefore(daughterL,cell.firstChild);cell.insertBefore(daughterR,cell.firstChild)}
   const segregate=ramp(t,52,65),offset=mix(0,123,segregate)+sep*17;
   tr('dna1',-offset,0);tr('dna2',offset,0);op('dna2',ramp(t,47,48));
   const replication=ramp(t,47,59);at('dna2','stroke-dasharray',`${replication} 1`);
   tr('ori1',-offset,-25);tr('ori2',offset,-25);op('ori1',1);op('ori2',ramp(t,48,50));
   [0,1].forEach(i=>{const p=coil((i?1:-1)*replication*Math.PI);tr(`fork${i}`,p[0],p[1]);op(`fork${i}`,win(t,47,60))});
   tr('plasmid0',mix(98,half-62,elong)+sep*17,17);tr('plasmid1',-mix(98,half-62,elong)-sep*17,17);op('plasmid1',ramp(t,49,58));
   ribs.forEach((e,i)=>{const x=(-128+(i*47%256))*mix(1,1.6,elong);e.setAttribute('transform',`translate(${x+Math.sign(x)*sep*17} ${(i%2?-1:1)*(35+i%4*2)+Math.sin(t*1.1+i)*1.4})`)});
   tr('identity',-half+28-sep*17,-20);
   at('pili','transform',`scale(${mix(1,1.55,elong)} 1)`);op('pili',1-ramp(t,91,95));
   const flagX=half+5+sep*17;
   at('flag','d',Array.from({length:49},(_,i)=>{const u=i/48;return `${i?'L':'M'}${flagX+u*103} ${Math.sin(u*TAU*2.3-t*4)*12*Math.sin(u*Math.PI/2)}`}).join(' '));op('flag',1-.6*growth);
   const minOn=win(t,63,82),pole=Math.sin(t*1.8)*.5+.5;
   mins.forEach((e,i)=>{const side=i<10?-1:1,angle=(i%10)/9*Math.PI; e.setAttribute('cx',String(side*(half-39+15*Math.sin(angle))));e.setAttribute('cy',String(-40+8*(i%10)));e.setAttribute('opacity',String(minOn*(.12+.88*(side<0?pole:1-pole))))});
   const ringOn=ramp(t,69,75)*(1-ramp(t,94,98)),radius=mix(48,2,pinch);
   op('ring',ringOn);at('ring-back','rx',Math.max(1,radius*.22));at('ring-back','ry',radius);
   ring.forEach((e,i)=>{const a=i/32*TAU+t*.5;e.setAttribute('cx',String(Math.cos(a)*radius*.22));e.setAttribute('cy',String(Math.sin(a)*radius))});
   const sept=ramp(t,82,95),neck=60-57*pinch;at('septum','d',`M0 ${-neck} V${-neck*(1-sept)} M0 ${neck} V${neck*(1-sept)}`);op('septum',win(t,81,98));
   // A connected inset grows from a bounded patch on the very same envelope.
   const panelY=mobile?326:282,panelH=mobile?367:360,ext=win(t,12,46);
   op('envelopes',ext);at('panel','x',20);at('panel','y',panelY);at('panel','width',W-40);at('panel','height',panelH);
   const compare=ramp(t,30,35),ew=mix(mobile?302:590,mobile?166:337,compare),nx=mix((W-ew)/2,mobile?242:495,compare),px=mobile?32:65,ey=panelY+60;
   at('negative-svg','width',ew);at('negative-svg','viewBox',`0 0 ${ew} 230`);at('negative-svg','x',nx);at('negative-svg','y',ey);
   // Geometry is continuously scaled into each panel, so no membrane is sliced.
   at('negative-art','transform',`scale(${ew/(mobile?302:590)} ${ew/(mobile?302:590)*.7})`);at('positive-svg','width',mobile?166:337);at('positive-svg','x',px);at('positive-svg','y',ey);op('positive-svg',compare);
   tr('positive-art',0,0,(mobile?166:337)/(mobile?302:590));
   [128,184,77,155].forEach((y,i)=>{tr(`neg-mark${i}`,nx+ew-9,ey+y*ew/(mobile?302:590)*.7);op(`neg-mark${i}`,i>1?1-compare:1)});
   [110,184].forEach((y,i)=>{tr(`pos-mark${i}`,px+(mobile?166:337)-9,ey+y*(mobile?166:337)/(mobile?302:590));op(`pos-mark${i}`,compare)});
   txt('envelope-title',compare>.5?'הרחבה · השוואת מעטפות':'הגדלה מעוגנת · מעטפת התא');at('envelope-title','x',W/2);at('envelope-title','y',panelY+29);
   const sx=cx+swim+30*scale,sy=cy-58*scale;
   at('anchor','x',sx-15);at('anchor','y',sy-7);at('anchor','width',30);at('anchor','height',14);op('anchor',ext);
   at('zoom-link','d',`M${sx-15} ${sy+7} L${nx+18} ${panelY} M${sx+15} ${sy+7} L${nx+ew-18} ${panelY}`);op('zoom-link',ext*.65);
   // A second anchored enlargement follows the chromosome, then the division plane.
   const detail=win(t,46,102);op('detail',detail);at('detail-panel','x',20);at('detail-panel','y',panelY);at('detail-panel','width',W-40);at('detail-panel','height',panelH);
   const dx=W/2,dy=panelY+(mobile?188:163),ds=mobile?1.28:2.1;
   tr('detail-dna',dx,dy,ds);op('detail-dna',1-ramp(t,64,69));
   tr('big-dna1',-offset*.52,0);tr('big-dna2',offset*.52,0);at('big-dna2','stroke-dasharray',`${replication} 1`);op('big-dna2',ramp(t,47,48));
   tr('big-ori1',-offset*.52,-25);tr('big-ori2',offset*.52,-25);op('big-ori2',ramp(t,48,50));
   [0,1].forEach(i=>{const p=coil((i?1:-1)*replication*Math.PI);tr(`big-fork${i}`,p[0],p[1]);op(`big-fork${i}`,win(t,47,60))});
   const division=ramp(t,64,69);op('division-art',division);tr('division-art',dx,dy,mobile?.91:1.35);
   const r=mix(88,4,pinch);at('detail-top','d',`M-165 -92 H-65 Q-25 -92 0 ${-r} Q25 -92 65 -92 H165`);at('detail-bottom','d',`M-165 92 H-65 Q-25 92 0 ${r} Q25 92 65 92 H165`);
   at('big-ring','rx',Math.max(1,r*.24));at('big-ring','ry',r);op('big-ring',ringOn);
   at('big-septum','d',`M0 ${-r} V${-r*(1-sept)} M0 ${r} V${r*(1-sept)}`);op('big-septum',ramp(t,81,83)*(1-sep));
   ['left','right'].forEach((side,i)=>{tr(`min-${side}`,i?126:-126,0);op(`min-${side}`,minOn*(.12+.88*(i?1-pole:pole)))});
   txt('detail-title',t<65?'הגדלה · שכפול דו־כיווני':t<80?'הגדלה · מרכז התא':'הגדלה · בניית המחיצה');at('detail-title','x',W/2);at('detail-title','y',panelY+29);
   at('detail-link','d',`M${cx-15} ${cy+50*scale} L${W*.3} ${panelY} M${cx+15} ${cy+50*scale} L${W*.7} ${panelY}`);op('detail-link',detail*.5);
   // The culture inherits the cell's membrane layers, chromosome and ribosomes.
   // Binary partitions preserve each mother's position as her daughters separate.
   if(growth===0)nodes.get('cell')?.removeAttribute('opacity');else op('cell',1-growth);
   op('growth',growth);at('growth','display',growth===0?'none':'inline');
   const cultureBottom=mobile?386:348,chartTop=cultureBottom+18;
   at('culture-panel','x',20);at('culture-panel','y',77);at('culture-panel','width',W-40);at('culture-panel','height',cultureBottom-77);
   at('growth-panel','x',20);at('growth-panel','y',chartTop);at('growth-panel','width',W-40);at('growth-panel','height',H-chartTop-18);
   at('vessel','x',38);at('vessel','y',143);at('vessel','width',W-76);at('vessel','height',cultureBottom-208);
   const generation=clamp((t-111)/12)*6,whole=Math.min(6,Math.floor(generation)),u=generation-whole;
   const divided=u>=.55,level=Math.min(6,whole+(divided?1:0)),total=2**level;
   const live=t<133?total:Math.max(4,Math.round(64*2**(-(t-133)*4/11)));
   host!.dataset.liveCount=String(live);host!.dataset.generation=String(level);
   const position=(index:number,depth:number):Point=>{
    let x=W/2,y=(143+cultureBottom-70)/2,dx=(W-100)/2,dy=(cultureBottom-218)/2;
    for(let bit=depth-1,step=0;bit>=0;bit--,step++){
     const side=(index>>bit&1)?1:-1;
     if(mobile?step%2===0:[0,2,3,5].includes(step)){dx/=2;x+=side*dx}else{dy/=2;y+=side*dy}
    }
    return [x+(depth>3?Math.sin(index*7)*2:0),y+(depth>3?Math.cos(index*5)*.7:0)];
   };
   population.forEach((e,i)=>{
    const visible=i<total,[tx,ty]=position(i,level),[px,py]=position(Math.floor(i/2),Math.max(0,level-1));
    const move=divided?ramp(u,.55,1):1;
    const pinch=whole<6&&!divided?ramp(u,.18,.55):0;
    const columns=2**(mobile?Math.ceil(level/2):[0,1,1,2,3,3,4][level]);
    const size=Math.min((mobile?.48:.63)*Math.pow(mobile?.84:.82,whole+(divided?ramp(u,.55,1):0)),(W-100)/columns/(276+56*pinch)*.94,(cultureBottom-218)/(total/columns)/148*.92);
    e.setAttribute('transform',`translate(${mix(px,tx,move)} ${mix(py,ty,move)}) rotate(${level>3?Math.sin(i*3)*3:0}) scale(${size})`);
    // Deterministic scattered deaths fade to faint physical remnants.
    const rank=(i*37)%64,alpha=t<133?1:mix(.08,1,clamp(live-rank));
    const fade=t<133?1:mix(.08,1,clamp(64*2**(-(t-133)*4/11)-rank));
    e.setAttribute('opacity',String(visible?fade:0));e.setAttribute('data-alive',String(visible&&alpha>.5));
    e.querySelectorAll('[data-pop-contour]').forEach(p=>p.setAttribute('d',body(125+28*pinch,.94*pinch)));
    e.querySelector('[data-pop-dna]')?.setAttribute('transform',`translate(${-55*pinch} 0) scale(.8)`);
    const copy=e.querySelector('[data-pop-copy]');copy?.setAttribute('opacity',String(pinch));copy?.setAttribute('transform',`translate(${55*pinch} 0) scale(.8)`);
   });
   at('growth-title','x',W/2);at('growth-title','y',103);
   at('count','x',W/2);at('count','y',130);txt('count',`${live} תאים חיים${t<133?` · דור ${level}`:''}`);
   at('lineage','x',W/2);at('lineage','y',cultureBottom-12);
   txt('lineage',t<123?'1 → 2 → 4 → 8 → 16 → 32 → 64':t<133?'יצירת תאים ≈ מות תאים':'תאים דוהים · שרידים נותרים בתרבית');
   const depleted=ramp(t,120,133);
   tr('resources',W/2-120,cultureBottom-46);op('resources',ramp(t,120,124));
   txt('nutrient-label','מזון');txt('waste-label','פסולת');
   at('nutrient-bar','width',64*(1-.9*depleted));at('waste-bar','width',64*depleted);
   const gx=mobile?65:100,gy=H-65,gw=W-gx-(mobile?38:65),gh=gy-chartTop-72;
   const logN=(tt:number)=>tt<111?0:tt<123?(tt-111)/2:tt<133?6:6-(tt-133)*4/11;
   const point=(z:number):Point=>[gx+(z-102)/42*gw,gy-logN(z)/6*gh];
   const path=(end:number)=>{const pts:Point[]=[];for(let z=102;z<end;z+=.15)pts.push(point(z));pts.push(point(end));return pts.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')};
   const tt=Math.max(102,t),dot=point(tt);
   at('curve-guide','d',path(144));at('curve','d',path(tt));tr('curve-dot',dot[0],dot[1]);
   at('axis','d',`M${gx} ${gy-gh-10} V${gy} H${gx+gw+10}`);
   [0,1,2].forEach(i=>{at(`grid${i}`,'d',`M${gx} ${gy-i*gh/2} H${gx+gw}`);at(`tick${i}`,'x',gx-12);at(`tick${i}`,'y',gy-i*gh/2+5)});
   at('y-title','x',W/2);at('y-title','y',chartTop+28);at('x-title','x',W-75);at('x-title','y',gy+39);
   ['השהיה','מעריכי','נייח','מוות'].forEach((v,i)=>{
    const phaseTime=[106.5,117,128,139][i],p=point(phaseTime);
    at(`phase${i}`,'x',p[0]);at(`phase${i}`,'y',p[1]+(i===1?25:-16));txt(`phase${i}`,v);
   });
   for(let i=0;i<10;i++)op(`ann${i}`,0);
   const cp=(x:number,y:number):Point=>[cx+swim+x*scale,cy+y*scale];
   const intro=1-ramp(t,12,16);
   label(0,'נוקלאואיד · ללא קרום גרעין',W/2,mobile?95:93,cp(-10,-8),intro);
   label(1,'ריבוזומים 70S',mobile?104:170,mobile?340:375,cp(-110,40),intro);
   label(2,'פלסמיד',mobile?292:625,mobile?342:375,cp(98,17),intro);
   label(3,'שוטון מסתובב',mobile?337:745,mobile?155:160,cp(half+60,0),intro);
   label(4,'פילי',mobile?86:205,mobile?142:155,cp(-115,-77),intro);
   label(5,'קופסית אפשרית',mobile?235:450,mobile?407:444,cp(80,68),intro);
   label(6,'דופן התא וממברנה',mobile?100:205,mobile?467:505,cp(-120,55),intro);
   if(mobile&&intro>0){const p=cp(-120,55);at('leader6','d',`M100 452 H20 V${p[1]+25} L${p[0]} ${p[1]}`)}
   if(ext>.001){
    const eyScale=ew/(mobile?302:590),pScale=(mobile?166:337)/(mobile?302:590);
    label(0,'LPS',nx+ew*.72,ey-5,[nx+ew*.72,ey+21*eyScale],ext);
    label(1,compare>.5?'Gram שלילי':'③ ממברנה חיצונית',nx+ew/2,panelY+panelH-126,undefined,ext);
    label(2,'① פפטידוגליקן דק',nx+ew/2,panelY+panelH-88,undefined,ext);
    label(3,'② ממברנה פנימית',nx+ew/2,panelY+panelH-50,undefined,ext);
    label(4,'Gram חיובי',px+(mobile?83:168.5),panelY+panelH-126,undefined,ext*compare);
    label(5,'חומצות טייכואיות',px+(mobile?83:168.5),ey-5,[px+20*pScale,ey+72*pScale],ext*compare);
    label(6,'① פפטידוגליקן עבה',px+(mobile?83:168.5),panelY+panelH-88,undefined,ext*compare);
    label(7,'② ממברנה פנימית',px+(mobile?83:168.5),panelY+panelH-50,undefined,ext*compare);
    label(8,'④ פריפלזמה',nx+ew/2,panelY+panelH-12,undefined,ext*(1-compare));
   }
   if(detail>.001){
    label(0,'אותו תא · קוטב מסומן',mobile?150:230,50,cp(-half+28-sep*17,-20),detail);
    if(t<66){label(1,'oriC · מוצא השכפול',W/2,panelY+65,[dx-offset*.52*ds,dy-25*ds],detail);label(2,'שני עותקי הכרומוזום',W/2,panelY+panelH-36,[dx+offset*.52*ds,dy+20*ds],detail)}
    else {label(1,t<80?'MinCDE · עיכוב בקוטבים':'מחיצה חדשה',W/2,panelY+65,t<80?[dx-126*(mobile?.91:1.35),dy]:[dx,dy-50*(1-sept)],detail);label(2,t<80?'FtsZ · טבעת במרכז':'FtsZ · מערכת החלוקה',W/2,panelY+panelH-35,[dx+15,dy+radius*(mobile?1.7:2.5)],detail);}
    label(3,'שתי בנות · עותק לכל בת',W/2,85,undefined,win(t,96,102));
   }
   if(growth>.01)label(0,'הרחבה · תרבית סגורה',W/2,55,undefined,growth);
  }
  let raf=0,visible=true,previous=0,lastUI=0;
  function sync(t:number){clock.current=Math.max(0,Math.min(DURATION,t));draw(clock.current);setTime(clock.current);setChapter(chapterAt(clock.current))}
  seek.current=t=>sync(t);
  function frame(now:number){raf=0;if(!playing.current||reduced.current||!visible||document.hidden)return;const dt=Math.min(.08,(now-previous)/1000);previous=now;let t=clock.current+dt;if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}clock.current=t;draw(t);if(now-lastUI>120){setTime(t);setChapter(chapterAt(t));lastUI=now}resume()}
  function resume(){if(!raf&&playing.current&&!reduced.current&&visible&&!document.hidden){previous=performance.now();raf=requestAnimationFrame(frame)}}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0}
  function visibility(){if(document.hidden)stop();else resume()}
  function preference(){reduced.current=media.matches;setReduce(media.matches);if(media.matches){stop();sync(CHAPTERS[chapterAt(clock.current)].still)}else resume()}
  function resize(){setPhone(narrow.matches);draw(clock.current)}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop();else resume()},{threshold:.05});observer.observe(host);
  host.addEventListener('bacteria-play',resume);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);narrow.addEventListener('change',resize);
  resize();preference();sync(clock.current);resume();
  return()=>{stop();observer.disconnect();host.removeEventListener('bacteria-play',resume);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);narrow.removeEventListener('change',resize)};
 },[phone]);
 const jump=(t:number)=>seek.current(t),toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)jump(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('bacteria-play'))};
 const ew=phone?302:590;
 return <section ref={root} className="bc" dir="rtl" data-theme={theme} aria-label={processName||"מבנה וגידול חיידקים"}>
  <style>{css}</style>
  <header><div className="bc-top"><span>מתא אחד לאוכלוסייה</span><span>{reduce?'תצוגה רגועה · תמונה לכל פרק':'סרט רציף · מבנה, חלוקה וגידול'}</span></div><h2>{processName||"חיידק אחד, חיים שלמים"}</h2></header>
  <nav aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduce?c.still:c.start)}>{isolate(`${i+1} · ${en?c.en:c.he}`)}</button>)}</nav>
  <svg ref={svg} className="bc-movie" viewBox="0 0 900 660" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
   <title id={`${uid}-title`}>מבנה חיידק, חלוקה בינארית וגידול אוכלוסייה</title><desc id={`${uid}-desc`}>אותו חיידק עם קוטב כחול נשמר לאורך הסרט. הגדלה מעוגנת של המעטפת, השוואת Gram, שכפול כרומוזום, מיקום FtsZ, בניית מחיצה ועקומת גידול לוגריתמית.</desc>
   <defs><linearGradient id={`${uid}-cyto`} x2="0" y2="1"><stop stopColor="#eff7ef"/><stop offset=".45" stopColor="#d3e7dc"/><stop offset="1" stopColor="#9cbfaf"/></linearGradient></defs>
   <CellArt uid={uid}/>
   <path data-id="zoom-link" className="leader"/><rect data-id="anchor" rx="3" fill="none" stroke="#398bb3" strokeWidth="2"/>
   <g data-id="envelopes" opacity="0"><rect data-id="panel" className="panel" rx="18"/><text data-id="envelope-title" textAnchor="middle"/>
    <svg data-id="positive-svg" height="230" overflow="visible"><g data-id="positive-art"><Envelope positive width={ew}/></g></svg>
    <svg data-id="negative-svg" height="230" overflow="visible"><g data-id="negative-art"><Envelope positive={false} width={ew}/></g></svg>
    {['neg','pos'].flatMap(kind=>Array.from({length:kind==='neg'?4:2},(_,i)=><g key={`${kind}${i}`} data-id={`${kind}-mark${i}`}><circle r="9" fill="var(--bg)" stroke="#548b75"/><text textAnchor="middle" y="5" style={{fontSize:14}}>{i+1}</text></g>))}
   </g>
   <path data-id="detail-link" className="leader"/>
   <g data-id="detail" opacity="0"><rect data-id="detail-panel" className="panel" rx="18"/><text data-id="detail-title" textAnchor="middle"/>
    <g data-id="detail-dna"><path data-id="big-dna1" d={DNA} fill="none" stroke="#47799c" strokeWidth="3"/><path data-id="big-dna2" d={DNA} fill="none" stroke="#47799c" strokeWidth="3" pathLength="1"/><circle data-id="big-ori1" r="4" fill="#e0ad57"/><circle data-id="big-ori2" r="4" fill="#e0ad57"/>{[0,1].map(i=><circle key={i} data-id={`big-fork${i}`} r="3" fill="#f7d99e" stroke="#805322"/>)}</g>
    <g data-id="division-art"><path data-id="detail-top" fill="none" stroke="#548b75" strokeWidth="10"/><path data-id="detail-bottom" fill="none" stroke="#548b75" strokeWidth="10"/><ellipse data-id="big-ring" fill="none" stroke="#d7a253" strokeWidth="5" strokeDasharray="5 3"/><path data-id="big-septum" stroke="#548b75" strokeWidth="14" fill="none"/>{['left','right'].map(side=><g key={side} data-id={`min-${side}`}>{Array.from({length:10},(_,i)=><circle key={i} cx={Math.sin(i)*15} cy={-65+i*14} r="4" fill="#b86b80"/>)}</g>)}</g>
   </g>
   <g data-id="growth" opacity="0">
    <rect data-id="culture-panel" className="panel" rx="18"/>
    <text data-id="growth-title" textAnchor="middle">מתא יחיד לאוכלוסייה · תרבית סגורה</text>
    <text data-id="count" textAnchor="middle" style={{fontSize:18,fontWeight:650}}/>
    <rect data-id="vessel" rx="24" fill="var(--inside)" stroke="var(--border)" strokeWidth="2"/>
    {Array.from({length:64},(_,i)=><g key={i} data-pop={i}>
     <path data-pop-contour="" fill={`url(#${uid}-cyto)`} stroke="#47799c" strokeWidth="9"/>
     <path data-pop-contour="" transform="scale(.98 .91)" fill="none" stroke="#548b75" strokeWidth="3"/>
     <path data-pop-contour="" transform="scale(.96 .81)" fill="none" stroke="#c4a56c" strokeWidth="3"/>
     <path data-pop-dna="" d={DNA} fill="none" stroke="#47799c" strokeWidth="4"/>
     <path data-pop-copy="" d={DNA} fill="none" stroke="#47799c" strokeWidth="4"/>
     {Array.from({length:12},(_,j)=><ellipse key={j} cx={-90+(j*37%180)} cy={(j%2?1:-1)*(30+j%3*3)} rx="4.5" ry="3" fill="#647e91"/>)}
     <ellipse cx="76" cy="13" rx="12" ry="9" fill="none" stroke="#87649c" strokeWidth="3"/>
     {i===0&&<circle cx="-99" cy="-20" r="8" fill="#398bb3" stroke="#fff9ea" strokeWidth="2"/>}
    </g>)}
    <text data-id="lineage" textAnchor="middle" direction="ltr" style={{fontSize:14}}/>
    <g data-id="resources">
     <text data-id="nutrient-label" x="0" y="12" textAnchor="middle" style={{fontSize:12}}/>
     <rect x="23" y="2" width="64" height="10" rx="4" fill="var(--border)"/><rect data-id="nutrient-bar" x="23" y="2" height="10" rx="4" fill="#548b75"/>
     <text data-id="waste-label" x="130" y="12" textAnchor="middle" style={{fontSize:12}}/>
     <rect x="155" y="2" width="64" height="10" rx="4" fill="var(--border)"/><rect data-id="waste-bar" x="155" y="2" height="10" rx="4" fill="#b86b80"/>
    </g>
    <rect data-id="growth-panel" className="panel" rx="18"/>
    {[0,1,2].map(i=><g key={i}><path data-id={`grid${i}`} stroke="var(--border)" strokeDasharray="3 5"/><text data-id={`tick${i}`} textAnchor="end" direction="ltr">{['1','8','64'][i]}</text></g>)}
    <path data-id="axis" fill="none" stroke="var(--muted)" strokeWidth="1.5"/>
    <path data-id="curve-guide" fill="none" stroke="var(--border)" strokeWidth="4"/>
    <path data-id="curve" fill="none" stroke="#548b75" strokeWidth="4"/>
    <g data-id="curve-dot"><circle r="10" fill="#d7a253" opacity=".2"/><circle r="5" fill="#d7a253" stroke="#805322"/></g>
    <text data-id="y-title" textAnchor="middle" direction="rtl">תאים חיים · סולם לוגריתמי</text><text data-id="x-title" textAnchor="middle">זמן יחסי</text>{Array.from({length:4},(_,i)=><text key={i} data-id={`phase${i}`} textAnchor="middle" style={{fontSize:14,paintOrder:'stroke',stroke:'var(--panel)',strokeWidth:6,strokeLinejoin:'round'}}/>)}
   </g>
   {Array.from({length:10},(_,i)=><g key={i} data-id={`ann${i}`}><path data-id={`leader${i}`} className="leader"/><rect data-id={`bg${i}`} className="annotation-bg" height="30" rx="7"/><text data-id={`label${i}`} data-label="" textAnchor="middle" direction="rtl"/></g>)}
  </svg>
  <p className="bc-caption" aria-live="polite" aria-atomic="true"><strong>{isolate(en?CHAPTERS[chapter].en:CHAPTERS[chapter].he)}</strong>{isolate(CHAPTERS[chapter].text)}</p>
  <p className="bc-phase">{isolate('עקבו אחרי הקוטב הכחול · שמות מבנים בצבעים קבועים · הגדלות ללא קנה מידה')}</p>
  <div className="bc-controls"><button onClick={toggle} disabled={reduce} aria-label={running?'השהיה':'ניגון'}>{running&&!reduce?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>jump(Number(e.target.value))}/><output>{isolate(`${Math.floor(time).toString().padStart(3,'0')} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>לולאה</label></div>
  <div className="bc-legend">{[['#47799c','כרומוזום וממברנה חיצונית'],['#548b75','פפטידוגליקן'],['#c4a56c','ממברנה פנימית'],['#87649c','פלסמיד / חומצות טייכואיות'],['#b86b80','LPS / MinCDE'],['#d7a253','oriC / FtsZ'],['#398bb3','קוטב התא המקורי']].map(([color,label])=><span key={label}><i style={{background:color}}/>{isolate(label)}</span>)}</div>
  <div className="bc-note">{isolate('איור מקורי סכמטי לפי Brock, מהדורה 16: פרקים 2, 4, 8. לא בקנה מידה, לא קינטיקה מדודה. הקופסית והפלסמיד מדגימים מבנים אפשריים. השכפול מוצג כמחזור פשוט; כ־20 דקות הוא זמן דור מיטבי ואינו משך שכפול הכרומוזום. '+(chapter>=6?'עקומת הגידול מציגה ספירת תאים במודל המחשה.':'עקומת הגידול ביחידות יחסיות.'))}</div>
 </section>;
}
