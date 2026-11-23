"use client";
import React, { useEffect, useId, useRef, useState } from "react";

type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
type Point = [number, number];
export const DURATION = 140;
const clamp = (v:number) => Math.max(0,Math.min(1,v));
const mix = (a:number,b:number,u:number) => a+(b-a)*u;
const ramp = (t:number,a:number,b:number) => {const u=clamp((t-a)/(b-a));return u*u*(3-2*u)};
const lerp = (a:Point,b:Point,u:number):Point => [mix(a[0],b[0],u),mix(a[1],b[1],u)];
const win = (t:number,a:number,b:number) => ramp(t,a,a+1)*(1-ramp(t,b-1,b));
export const isolate = (s:string) => s.replace(/[\u2066\u2069]/g,"").replace(/-?\d[\d,]*-(?=[\u0590-\u05ff])|[A-Za-z0-9][A-Za-z0-9₂₃₆⁺⁻ᵢ,.-]*(?:[ /+→−]+[A-Za-z0-9][A-Za-z0-9₂₃₆⁺⁻ᵢ,.-]*)*/g,s=>"\u2066"+s+"\u2069");
export const CHAPTERS = [
 {start:0,still:8,name:"מקורות הפחמן",text:"בצום הכבד, וגם הכליה, מייצרים גלוקוז ממקורות שאינם פחמימות. לקטט ואלנין מספקים פירובט; גליצרול נכנס בהמשך דרך דיהידרוקסיאצטון פוספט (DHAP). שלושה צעדים בלתי הפיכים בגליקוליזה דורשים שלושה מעקפים: במקום hexokinase/glucokinase, במקום PFK-1 ובמקום pyruvate kinase. שבע התגובות האחרות משותפות והפיכות."},
 {start:12,still:24,name:"הוספת פחמן · PC",text:"שני פירובט, שלושה פחמנים בכל אחד, נכנסים למטריצה. האנזים PC (pyruvate carboxylase) משתמש בביוטין וב־ATP כדי לקבע פחמן מביקרבונט (HCO₃⁻, מאגר CO₂) וליצור אוקסלואצטט בעל ארבעה פחמנים. המטבוליט acetyl-CoA מפעיל את האנזים. לשני פירובט נצרכים כאן 2 ATP; הפחמן הזמני יסולק שוב בהמשך."},
 {start:28,still:43,name:"מסלול א׳ · מלאט",text:"אוקסלואצטט אינו חוצה את הממברנה הפנימית. הוא מחוזר למלאט תוך צריכת NADH במטריצה; המלאט מיוצא ומחומצן בציטוזול לאוקסלואצטט, תוך יצירת NADH. כך מועברים שקולי חיזור, לא NADH החוצה דרך הממברנה. האנזים PEPCK הציטוזולי צורך GTP ומשחרר CO₂ ליצירת PEP. מסלול זה מתאים למקור פירובט או אלנין. אספרטט יכול לשמש חלופת העברה של שלד הפחמן, ללא העברת שקולי החיזור של מלאט."},
 {start:50,still:63,name:"מסלול ב׳ · מלקטט",text:"חלופה לאותו מעקף, ולא סיבוב נוסף בחשבון האנרגיה: חמצון לקטט לפירובט כבר יוצר NADH בציטוזול. אחרי PC, האנזים PEPCK המיטוכונדריאלי צורך GTP, משחרר CO₂ ויוצר PEP שיוצא לציטוזול. לכן אין הכרח לייצא מלאט לצורך אספקת NADH. שני איזואנזימי PEPCK מקודדים בגנים גרעיניים נפרדים; בחירת המסלול תלויה במקור ובמצב התא."},
 {start:68,still:80,name:"התגובות ההפיכות",text:"שני PEP עולים דרך 2-פוספוגליצרט, 3-פוספוגליצרט, 1,3-ביספוספוגליצרט וגליצראלדהיד-3-פוספט. כאן נצרכים עוד 2 ATP ו־2 NADH. שלישייה אחת הופכת ל־DHAP, ושתי השלישיות מתאחדות לפרוקטוז-1,6-ביספוספט בעל שישה פחמנים. יחד עם האיזומריזציה בהמשך, אלה שבע תגובות הגליקוליזה ההפיכות המשותפות."},
 {start:88,still:96,name:"הסרת זרחה · FBPase-1",text:"האנזים FBPase-1 מבצע הידרוליזה של הזרחה בפחמן 1 בפרוקטוז-1,6-ביספוספט. נוצר פרוקטוז-6-פוספט ומשתחרר פוספט חופשי; אין יצירת ATP. זהו המעקף ל־PFK-1. איזומריזציה הפיכה יוצרת גלוקוז-6-פוספט, שנע אל ה־⁦ER⁩."},
 {start:102,still:113,name:"גלוקוז מן ה־⁦ER⁩",text:"גלוקוז-6-פוספט נכנס לחלל ה־⁦ER⁩. האנזים G6Pase הוא חלבון ממברנה שאתרו הקטליטי פונה לחלל: הוא מסיר בהידרוליזה את הזרחה האחרונה. גלוקוז ופוספט חוזרים לציטוזול; גלוקוז יוצא לדם דרך GLUT2 בממברנת התא. בשריר אין G6Pase, ולכן הוא אינו מספק גלוקוז חופשי לדם בדרך הזאת."},
 {start:120,still:132,name:"מחיר ובקרה הדדית",text:"משני פירובט לגלוקוז אחד: 4 ATP + 2 GTP + 2 NADH; שישה קשרי פוספט עתירי אנרגיה, לעומת רווח נקי של 2 ATP בגליקוליזה. המטבוליטים F-2,6-BP ו־AMP מפעילים PFK-1 ומעכבים FBPase-1. בכבד glucagon מוריד F-2,6-BP ומעדיף גלוקונאוגנזה; אינסולין פועל בכיוון ההפוך. המטבוליט acetyl-CoA מפעיל PC. הבקרה ההדדית מצמצמת מעגל סרק. העלות תלויה במקור: לקטט כבר מספק NADH, וגליצרול נכנס בהמשך."}
];
export const chapterAt = (t:number) => CHAPTERS.reduce((n,c,i)=>t>=c.start?i:n,0);
const routeA:Point[]=[[110,194],[119,174],[149,174],[178,155],[208,150],[222,123],[240,94],[275,70],[329,76],[386,73]];
const routeB:Point[]=[[110,194],[119,174],[149,174],[181,182],[220,139],[222,123],[240,94],[275,70],[329,76],[386,73]];
const along = (pts:Point[],u:number):Point => {const p=clamp(u)*(pts.length-1),i=Math.min(pts.length-2,Math.floor(p));return lerp(pts[i],pts[i+1],p-i)};

// These are the actual atom IDs drawn below, not formula-only counters.
export function moleculeStates(t:number) {
 if(t>=87)return [{name:t<95?'F-1,6-BP':t<99?'F6P':t<112?'G6P':'glucose',carbonIds:[0,1,2,3,4,5]}];
 const name=t<18?'pyruvate':t<28?'oxaloacetate':t<37?'malate':t<48?'oxaloacetate':t<53?'PEP':t<55?'pyruvate':t<62?'oxaloacetate':t<70?'PEP':t<73?'2-PG':t<76?'3-PG':t<79?'1,3-BPG':'G3P';
 const four=t>=23&&t<46||t>=57&&t<61;
 return [0,1].map(i=>({name:t>=81&&i===0?'DHAP':name,carbonIds:[i*3,i*3+1,i*3+2,...(four?[6+i]:[])]}));
}

/** Pure timeline: persistent carbon identities, including two temporary carbons. */
export function frame(t:number) {
 const ci=chapterAt(t),b=t>=50&&t<68;
 let center:Point=[150,207];
 if(t<12)center=lerp([76,207],[150,207],ramp(t,0,11));
 if(t>=28&&t<50)center=lerp([150,207],[258,207],ramp(t,33,40));
 if(b)center=lerp(lerp([258,207],[150,207],ramp(t,50,53)),[258,207],ramp(t,63,67));
 if(t>=68)center=lerp([258,207],[220,207],ramp(t,68,71));
 if(t>=102)center=lerp([220,207],[354,207],ramp(t,103,108));
 if(t>=114)center=lerp([354,207],[90,207],ramp(t,114,119));
 const join=ramp(t,81,87),ring=ramp(t,98,102);
 const carbons:Point[]=Array.from({length:6},(_,i)=>{
  const j=i%3,side=i<3?-1:1;
  const chain:Point=[center[0]+(j-1)*27,center[1]+side*31+(j%2? -9:5)];
  const merged:Point=[center[0]+(i-2.5)*25,center[1]+(i%2?-9:9)];
  // Glucose ring: five carbon atoms plus oxygen; C6 is exocyclic.
  const ringPts:Point[]=[[36,0],[18,31],[-18,31],[-36,0],[-18,-31],[-28,-60]];
  return lerp(lerp(chain,merged,join),[center[0]+ringPts[i][0],center[1]+ringPts[i][1]],ring);
 });
 const added=b?ramp(t,54,57)*(1-ramp(t,60,62)):ramp(t,18,23)*(1-ramp(t,45,48));
 const extra:Point[]=[0,1].map(i=>{
  const c=carbons[i*3+2],start:Point=[c[0]+44,c[1]-50],bound:Point=[c[0]+27,c[1]-14];
  let p=lerp(start,bound,b?ramp(t,54,57):ramp(t,18+i*2,21+i*2));
  if(t>=(b?60:45))p=lerp(bound,[c[0]+46,c[1]-57],b?ramp(t,60,63):ramp(t,45,49));return p;
 });
 const phosphate=t<81?(b?1-ramp(t,50,53)+ramp(t,60,62):ramp(t,45,48)):1;
 const p1=phosphate*(1-ramp(t,91,95)),p6=phosphate*(1-ramp(t,109,112));
 const atp=2*ramp(t,19,25)+2*ramp(t,73,77),gtp=2*ramp(t,45,49),nadh=2*ramp(t,77,81);
 const membraneX=t<50?mix(310,188,ramp(t,31,35))+232*ramp(t,47,50):mix(420,310,ramp(t,50,54))-122*ramp(t,63,68);
 const map=t<50?along(routeA,t<12?.1*ramp(t,0,12):.1+.5*ramp(t,12,50)):t<68?lerp(along(routeA,.6),along(routeB,.1+.5*ramp(t,53,68)),ramp(t,50,53)):along(routeA,.6+.4*ramp(t,68,120));
 return {ci,center,carbons,extra,added,join,ring,p1,p6,atp,gtp,nadh,membraneX,er:ramp(t,101,104)*(1-ramp(t,119,122)),map,moleculeStates:moleculeStates(t)};
}

function Label({x,y,children,...rest}:{x:number;y:number;children:React.ReactNode}&React.SVGProps<SVGTextElement>){return <text x={x} y={y} textAnchor="middle" {...rest}>{typeof children==="string"?isolate(children):children}</text>}
function Enzyme({uid}:{uid:string}){return <g data-enzyme="" data-bound="enzyme"><path d="M-95 -18C-112 -49 -83 -79 -53 -68C-42 -94 -6 -83 5 -65C37 -90 77 -70 73 -43C105 -40 113 -10 94 9C112 37 77 64 53 51C35 82 -1 76 -14 56C-42 78 -78 60 -76 37C-110 40 -119 5 -95 -18Z" fill={`url(#${uid}-enzyme)`} stroke="#537e83" strokeWidth="2"/><path d="M-83 -26C-62 -54 -46 -24 -30 -47S4 -45 16 -41M-65 36C-36 9 -27 49 -6 27S26 47 42 31M34 -47C58 -63 83 -31 63 -14" stroke="#d4e9df" strokeWidth="7" strokeLinecap="round" fill="none" opacity=".7"/><path d="M-45 -13Q0 -52 42 -14Q33 17 0 13Q-28 25 -45 -13Z" fill="#365d66" stroke="#91bab0" strokeWidth="3"/><path d="M-36 -13Q0 -35 31 -13" stroke="#1e424e" strokeWidth="3" fill="none"/></g>}
function MapArt({uid}:{uid:string}){return <>
 <defs><radialGradient id={`${uid}-cell`} cx="35%" cy="25%" r="85%"><stop stopColor="var(--cell-hi)"/><stop offset="1" stopColor="var(--cell)"/></radialGradient><radialGradient id={`${uid}-mito`} cx="30%" cy="25%"><stop stopColor="#f3c39b"/><stop offset=".65" stopColor="#c78e60"/><stop offset="1" stopColor="#81563f"/></radialGradient><linearGradient id={`${uid}-er`} x2="0" y2="1"><stop stopColor="#eed7dd"/><stop offset=".5" stopColor="#b67e98"/><stop offset="1" stopColor="#68465f"/></linearGradient></defs>
 <path data-bound="cell" d="M56 51C93 20 151 43 194 37C257 14 352 24 379 60C410 97 399 157 376 194C342 238 264 229 221 242C153 254 72 237 49 204C15 161 17 83 56 51Z" fill={`url(#${uid}-cell)`} stroke="#6d9e94" strokeWidth="3"/>
 <path d="M59 55C103 28 158 51 199 45C264 23 352 35 373 66" fill="none" stroke="#e2f2e5" strokeWidth="3" opacity=".6"/>
 <ellipse cx="112" cy="94" rx="42" ry="34" fill="var(--nucleus)" stroke="var(--line)"/><ellipse cx="103" cy="86" rx="20" ry="17" fill="var(--cell)" opacity=".6"/>
 <g data-bound="mitochondrion" transform="translate(130 180) rotate(-12)"><path d="M-66 -24C-52 -54 29 -52 61 -20C88 9 45 46 -3 39C-44 42 -81 8 -66 -24Z" fill={`url(#${uid}-mito)`} stroke="#805b47" strokeWidth="2"/><path d="M-55 -20C-34 -37 -29 -28 -38 -12S-25 9 -15 -12S7 -24 0 -5S17 16 24 -4S46 -13 44 3S29 29 8 27C-19 29 -52 18 -55 -2Z" fill="#efd4ae" stroke="#97674a" strokeWidth="2"/><path d="M-45 -23Q-30 -26 -41 -9M-8 -21Q8 -25 -2 -3M31 -13Q45 -19 40 2" fill="none" stroke="#fff1d5" strokeWidth="2"/></g>
 <g data-bound="ER" transform="translate(317 82)">{[-18,0,18].map((y,i)=><g key={y}><path d={`M-44 ${y-8}Q-12 ${y-20} 14 ${y-5}T53 ${y-7}L51 ${y+5}Q28 ${y+16} 5 ${y+5}T-45 ${y+5}Z`} fill={`url(#${uid}-er)`} stroke="#926a80" strokeWidth="1.3"/><path d={`M-38 ${y-4}Q-8 ${y-13} 14 ${y}T46 ${y-1}`} stroke="#f5e3e9" strokeWidth="2" fill="none" opacity={1-i*.1}/></g>)}</g>
 <path d="M54 202Q76 209 108 194L145 174Q174 143 221 124L241 94L275 70L329 76L389 73" fill="none" stroke="var(--route)" strokeWidth="2" strokeDasharray="3 5"/>
 <path d="M148 180Q188 205 220 139" fill="none" stroke="var(--route)" strokeWidth="1.5" strokeDasharray="3 5"/>
 <path d="M66 134Q133 136 220 123" fill="none" stroke="var(--route)" strokeWidth="1.5" strokeDasharray="3 5"/>
 <Label x={110} y={152}>מיטוכונדריה</Label><Label x={321} y={45}>⁦ER⁩</Label><Label x={286} y={209}>ציטוזול</Label><Label x={75} y={28}>תא כבד</Label>
 <g data-map-cargo="" data-bound="map-cargo">{[-8,0,8].map(x=><circle key={x} cx={x} cy={x===0?-3:2} r="3" fill="#659c83" stroke="#e4f3de" strokeWidth=".8"/>)}</g>
 <rect data-focus="" x="88" y="168" width="42" height="34" rx="11" fill="none" stroke="#418e86" strokeWidth="2"/>
 <path data-anchor="" d="M109 204L109 253L220 263" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeDasharray="4 4"/>
 <circle data-site="" r="4" fill="#418e86"/>
 </>}

const CSS=`
.gn{--bg:#fafbf8;--ink:#253d4b;--muted:#586c76;--line:#cbd9d6;--panel:#f0f5f1;--cell:#c3ddd0;--cell-hi:#ecf5e9;--nucleus:#cbd4df;--route:#759f8d;--matrix:#f0dfcb;--button:#fff;--carbon:#397d69;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:22px;font:15px/1.6 system-ui,sans-serif;isolation:isolate;overflow:hidden;text-align:start}
.dark .gn,.gn[data-theme=dark]{--bg:#15252d;--ink:#e2edf0;--muted:#b2c8cc;--line:#405961;--panel:#1c3339;--cell:#284e47;--cell-hi:#3c6257;--nucleus:#354957;--route:#80ad98;--matrix:#483c32;--button:#243e46;--carbon:#92cab0}
@media(prefers-color-scheme:dark){.gn:not([data-theme=light]){--bg:#15252d;--ink:#e2edf0;--muted:#b2c8cc;--line:#405961;--panel:#1c3339;--cell:#284e47;--cell-hi:#3c6257;--nucleus:#354957;--route:#80ad98;--matrix:#483c32;--button:#243e46;--carbon:#92cab0}}
.gn *{box-sizing:border-box}.gn header{padding:20px 24px 12px}.gn h2{font-size:27px;margin:4px 0}.gn .kicker{color:var(--muted);font-size:12px;letter-spacing:.06em}.gn button{font:inherit;background:var(--button);color:var(--ink);border:1px solid var(--line);border-radius:9px;min-height:42px;padding:7px 11px;cursor:pointer}.gn button:focus-visible,.gn input:focus-visible{outline:3px solid #3d9aab;outline-offset:2px}.gn nav{display:flex;flex-wrap:wrap;gap:6px;padding:0 22px 14px}.gn nav button{flex:1 0 20%;font-size:12px}.gn button[aria-current=true]{background:#366f60;color:#fff;border-color:#366f60}.gn .stage{display:grid;grid-template-columns:1fr 1fr;direction:ltr;gap:14px;margin:0 16px;align-items:center}.gn .map-wrap{position:relative}.gn svg{display:block;width:100%;overflow:hidden}.gn svg text{fill:var(--ink);font:16px system-ui,sans-serif;direction:rtl;unicode-bidi:plaintext}.gn .map text{font-size:16px;font-weight:600}.gn .zoom{background:var(--panel);border:1px solid var(--line);border-radius:17px}.gn .zoom .heading{font-size:18px;font-weight:650}.gn .zoom .small{font-size:15px}.gn .zoom .metabolite{font-size:17px;font-weight:650}.gn .map-note{direction:rtl;font-size:12px;color:var(--muted);text-align:center;margin:2px 8px}.gn .energy{display:flex;direction:rtl;align-items:center;justify-content:center;gap:12px;padding:12px;margin:14px 16px 0;border:1px solid var(--line);border-radius:12px;background:var(--panel);flex-wrap:wrap}.gn .energy span{direction:ltr;unicode-bidi:isolate;font-weight:650;font-variant-numeric:tabular-nums}.gn .energy small{font-size:12px}.gn .caption{margin:14px 24px 0;min-height:165px}.gn .caption strong{display:block;font-size:17px;margin-bottom:4px}.gn .phase{margin:5px 24px;font-size:13px;color:var(--muted);min-height:24px}.gn .controls{display:flex;gap:10px;align-items:center;padding:12px 24px;flex-wrap:wrap}.gn input[type=range]{direction:ltr;flex:1;min-width:70px;accent-color:#448a75}.gn output{font-size:12px;direction:ltr;font-variant-numeric:tabular-nums}.gn .controls label{display:flex;align-items:center;gap:5px;font-size:13px}.gn .legend{border-top:1px solid var(--line);padding:12px 24px;display:flex;gap:14px;font-size:12px;flex-wrap:wrap}.gn .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--carbon);margin-inline-end:5px}.gn .note{font-size:12px;color:var(--muted);padding:0 24px 17px;margin:0}
@media(max-width:600px){.gn header{padding:16px 14px 10px}.gn h2{font-size:23px}.gn nav{padding:0 12px 10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.gn nav button{font-size:12px;padding:5px}.gn .stage{grid-template-columns:1fr;gap:8px;margin:0 10px}.gn .map{max-height:none}.gn .map-note{margin-top:0}.gn .caption{margin:12px 14px 0;min-height:245px;font-size:14px}.gn .energy{margin:12px 10px 0;gap:8px;font-size:14px}.gn .phase{margin:6px 14px;min-height:42px}.gn .controls{padding:10px 14px}.gn .legend{padding:12px 14px}.gn .note{padding:0 14px 16px}}
`;

export default function GngScene({lang="he",processName,theme}:Props){
 const root=useRef<HTMLElement>(null),clock=useRef(0),playing=useRef(true),looping=useRef(true),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduced,setReduced]=useState(false);
 const uid="gng"+useId().replace(/[^a-zA-Z0-9_-]/g,""),chapter=chapterAt(time);
 useEffect(()=>{
  const host=root.current!,nodes=new Map<string,Element>();host.querySelectorAll('[data-id]').forEach(e=>nodes.set(e.getAttribute('data-id')!,e));
  const el=(id:string)=>nodes.get(id)!,attr=(id:string,k:string,v:string|number)=>el(id).setAttribute(k,String(v));
  const text=(id:string,s:string)=>{el(id).textContent=isolate(s)};
  const move=(id:string,p:Point,opacity=1)=>{attr(id,'transform',`translate(${p[0]} ${p[1]})`);attr(id,'opacity',opacity)};
  const media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,visible=true,docVisible=!document.hidden,ui=-1;
  function draw(t:number){
   clock.current=t;const f=frame(t),b=t>=50&&t<68;
   const heading=["מקורות שאינם פחמימות","מטריצה · קיבוע פחמן","מלאט · מעבר לציטוזול","חלופה · PEPCK במטריצה","ציטוזול · שתי שלישיות מתאחדות","ציטוזול · הידרוליזה","חלל ה־⁦ER⁩ · שחרור גלוקוז","בקרה הדדית בכבד"][f.ci];
   text('heading',heading);text('enzyme-label',f.ci===0?'לקטט · אלנין · גליצרול':f.ci===1?'PC':f.ci===2?(t<41?'malate dehydrogenase':'אנזים PEPCK ציטוזולי'):f.ci===3?(t<58?'PC':'אנזים PEPCK מיטוכונדריאלי'):f.ci===4?'שבע תגובות הפיכות משותפות':f.ci===5?'FBPase-1':f.ci===6?'G6Pase':'בקרה: FBPase-1 מול PFK-1');
   const enzyme=host.querySelector('[data-enzyme]')!,es=1-.35*f.er;enzyme.setAttribute('transform',`translate(${220+100*f.er} 202) scale(${es+.018*Math.sin(t*1.8)} ${es-.012*Math.sin(t*1.8)})`);enzyme.setAttribute('opacity',String((.12+.54*ramp(t,10,14)-.42*ramp(t,67,71)+.42*ramp(t,85,89))*(1-ramp(t,119,122))));
   attr('enzyme-leader','d',`M220 77L${220+100*f.er} ${119+28*f.er}`);attr('enzyme-callout','opacity',1-ramp(t,119,122));attr('enzyme-target','cx',220+100*f.er);attr('enzyme-target','cy',119+28*f.er);
   attr('matrix','x',0);attr('matrix','width',f.membraneX);attr('matrix','opacity',(1-f.er)*(1-ramp(t,68,71))*.9);
   attr('membrane','transform',`translate(${f.membraneX} 0)`);attr('membrane','opacity',(1-f.er)*(1-ramp(t,68,71)));
   attr('er','opacity',f.er);attr('regulation','opacity',ramp(t,119,123));
   const molecularOpacity=1-ramp(t,119,122);
   attr('molecules','opacity',molecularOpacity);
   f.carbons.forEach((p,i)=>{attr(`c${i}`,'cx',p[0]);attr(`c${i}`,'cy',p[1]);move(`carbon-number${i}`,[p[0],p[1]+3],f.join);});
   for(let i=0;i<5;i++){attr(`bond${i}`,'d',`M${f.carbons[i].join(' ')}L${f.carbons[i+1].join(' ')}`);attr(`bond${i}`,'opacity',i===2?f.join:1);}
   const c4=f.carbons[4],c0=f.carbons[0],oxygen:Point=[f.center[0]+18,f.center[1]-31];
   attr('ring-bond','d',`M${c4.join(' ')}L${oxygen.join(' ')}L${c0.join(' ')}`);attr('ring-bond','opacity',f.ring);move('oxygen',oxygen,f.ring);
   f.extra.forEach((p,i)=>{const a=f.carbons[i*3+2];move(`extra${i}`,p,f.added);attr(`extra-bond${i}`,'d',`M${a.join(' ')}L${p.join(' ')}`);attr(`extra-bond${i}`,'opacity',f.added*(b?1-ramp(t,60,61):1-ramp(t,45,46)));});
   // PEP is phosphorylated at C2; the mutase moves phosphate to a terminal
   // carbon before triose formation. Keep these groups attached to the skeleton.
   const phosphateShift=ramp(t,72,74),a1=lerp(f.carbons[1],f.carbons[0],phosphateShift),a6=lerp(f.carbons[4],f.carbons[5],phosphateShift);
   const p1:Point=[a1[0]-24,a1[1]-19],p6:Point=[a6[0]+24,a6[1]-19];
   move('p1',lerp(p1,[105,128],ramp(t,91,96)),t<96?Math.max(f.p1,win(t,91,96)):0);
   move('p6',lerp(p6,[416,128],ramp(t,109,114)),t<114?Math.max(f.p6,win(t,109,114)):0);
   attr('p1-bond','d',`M${p1.join(' ')}L${a1.join(' ')}`);attr('p1-bond','opacity',f.p1);
   attr('p6-bond','d',`M${p6.join(' ')}L${a6.join(' ')}`);attr('p6-bond','opacity',f.p6);
   [0,1].forEach(i=>{const carbon=f.carbons[i===0?2:3],bound:Point=[carbon[0]+(i===0?24:-24),carbon[1]+19],released:Point=[bound[0]+(i===0?70:-40),bound[1]+(i===0?-45:25)],p=lerp(bound,released,ramp(t,78,81));move(`q${i}`,p,win(t,75,82));attr(`q-bond${i}`,'d',`M${bound.join(' ')}L${carbon.join(' ')}`);attr(`q-bond${i}`,'opacity',win(t,75,79));const c=f.carbons[i*3+1],d=f.carbons[i*3+2];attr(`double${i}`,'d',`M${c[0]} ${c[1]+5}L${d[0]} ${d[1]+5}`);attr(`double${i}`,'opacity',f.p1*(1-ramp(t,68,72)))});
   text('metabolite',t<12?'שלדים של שלושה פחמנים':t<19?'שני פירובט':t<28?'שני אוקסלואצטט':t<34?'אוקסלואצטט ← מלאט':t<41?'מלאט ← אוקסלואצטט':t<46?'אוקסלואצטט בציטוזול':t<50?'שני PEP':t<55?'לקטט ← פירובט':t<60?'אוקסלואצטט במטריצה':t<68?'השלד PEP יוצא לציטוזול':t<70?'שני PEP':t<73?'שני 2-פוספוגליצרט':t<76?'שני 3-פוספוגליצרט':t<79?'שני 1,3-ביספוספוגליצרט':t<83?'גליצראלדהיד-3-פוספט ו־DHAP':t<95?'פרוקטוז-1,6-ביספוספט':t<99?'פרוקטוז-6-פוספט':t<112?'גלוקוז-6-פוספט':t<120?'גלוקוז':'גלוקונאוגנזה ↑ · גליקוליזה ↓');
   text('reaction',t<12?'גליצרול נכנס בהמשך דרך DHAP':t<28?'2 ATP → 2 ADP + 2 Pᵢ':t<34?'במטריצה: NADH → NAD⁺':t<41?'בציטוזול: NAD⁺ → NADH':t<50?'צריכת 2 GTP · פליטת 2 CO₂':t<58?'לקטט יוצר NADH בציטוזול':t<68?'צריכת GTP → GDP · פליטת CO₂':t<77?'2 ATP → 2 ADP':t<82?'2 NADH → 2 NAD⁺':t<88?'3 פחמנים + 3 פחמנים = 6':t<99?'כניסת H₂O · שחרור Pᵢ':t<110?'הסוכר המזורחן נכנס לחלל':t<114?'כניסת H₂O · שחרור Pᵢ':'גלוקוז חופשי אל הציטוזול ואל הדם');
   attr('metabolite','opacity',1-ramp(t,119,122));attr('reaction','opacity',1-ramp(t,119,122));
   const co2on=win(t,14,25)+win(t,44,50)+win(t,53,63);
   move('co2',t<28?lerp([320,105],[219,157],ramp(t,15,21)):lerp([299,178],[339,106],ramp(t,b?60:45,b?63:49)),Math.min(1,co2on));
   text('co2-text',t<28||b&&t<58?'HCO₃⁻':'CO₂');
   move('redox',t<36?[106,290]:[321,290],win(t,28,35)+win(t,37,43));
   text('redox-text',t<35?'NADH':'NADH');
   attr('redox-arrow','opacity',win(t,29,43));
   text('comp-left',t<28?'מטריצה':t<50?'מטריצה':'מטריצה');text('comp-right','ציטוזול');
   attr('comp-left','opacity',(1-f.er)*(1-ramp(t,68,71)));attr('comp-right','opacity',(1-f.er)*(1-ramp(t,68,71)));
   const map=host.querySelector('[data-map-cargo]')!,focus=host.querySelector('[data-focus]')!,site=host.querySelector('[data-site]')!,anchor=host.querySelector('[data-anchor]')!;
   map.setAttribute('transform',`translate(${f.map.join(' ')})`);focus.setAttribute('x',String(f.map[0]-21));focus.setAttribute('y',String(f.map[1]-17));site.setAttribute('cx',String(f.map[0]));site.setAttribute('cy',String(f.map[1]));anchor.setAttribute('d',`M${f.map[0]} ${f.map[1]+17}L225 ${f.map[1]+17}L225 253L220 263`);
   // Incoming molecules and the bypassed glycerol route stay in the same cell map.
   [0,1,2].forEach(i=>{const u=(t/(i===2?17:13)+i*.31)%1,pts:Point[]=i===2?[[27,139],[65,134],[221,123]]:[[22,215+i*6],[64,207],[110,194]];const p=along(pts,u);move(`input${i}`,p,win(t,0,18)*(1-ramp(u,.9,1)));});
   const value=(v:number)=>Number(v.toFixed(1)).toString();text('atp',`${value(f.atp)} ATP`);text('gtp',`${value(f.gtp)} GTP`);text('nadh',`${value(f.nadh)} NADH`);
   text('phase',f.ci===3?'מסלול חלופי מוצג מחדש; אין חיוב אנרגיה כפול':f.ci===2?'שקולי החיזור מועברים באמצעות מלאט':f.ci===7?'עלות הייחוס: שני פירובט לגלוקוז אחד':'המסגרת במפה מעגנת את התקריב לאתר הפעיל');
   host.dataset.time=t.toFixed(3);host.dataset.chapter=String(f.ci);
  }
  function sync(t:number){draw(t);setTime(t);ui=t;last=0}
  seek.current=(t)=>sync(Math.max(0,Math.min(DURATION,t)));
  function tick(now:number){raf=0;if(!playing.current||media.matches||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min((now-last)/1000,.08);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(t-ui)>.12||!playing.current){setTime(t);ui=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)}
  function resume(){last=0;if(!raf&&playing.current&&!media.matches&&visible&&docVisible)raf=requestAnimationFrame(tick)}
  function visibility(){docVisible=!document.hidden;if(!docVisible){cancelAnimationFrame(raf);raf=0}resume()}
  function preference(){setReduced(media.matches);if(media.matches){cancelAnimationFrame(raf);raf=0;sync(CHAPTERS[chapterAt(clock.current)].still)}else resume()}
  const observer=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0}resume()},{threshold:.05});observer.observe(host);
  host.addEventListener('gng-play',resume);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);preference();draw(clock.current);resume();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();host.removeEventListener('gng-play',resume);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference)};
 },[]);
 const jump=(t:number)=>seek.current(t),toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)jump(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('gng-play'))};
 return <section className="gn" dir="rtl" lang={lang} data-theme={theme} ref={root} aria-label={processName||"גלוקונאוגנזה"}>
  <style>{CSS}</style><header><div className="kicker">כבד בצום · מסע הפחמן</div><h2>{processName||"בונים גלוקוז מחדש"}</h2><div className="kicker">{reduced?'תנועה מופחתת · תמונה מייצגת לכל פרק':'סרט רציף · מיטוכונדריה, ציטוזול ו־⁦ER⁩'}</div></header>
  <nav aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduced?c.still:c.start)}>{isolate(`${i+1} · ${c.name}`)}</button>)}</nav>
  <div className="stage"><div className="map-wrap"><svg className="map" viewBox="0 0 440 270" role="img" aria-label="מפת תא כבד קבועה עם מסגרת המעקב"><MapArt uid={uid}/>{[0,1,2].map(i=><g data-id={`input${i}`} data-bound={`input${i}`} key={i}>{[-7,0,7].map(x=><circle key={x} cx={x} cy={x===0?-3:1} r="3" fill={i===2?'#c79358':'#5d94a6'}/>)}</g>)}</svg><p className="map-note">מפה קבועה · המסגרת מציינת את האתר המוגדל</p></div>
  <svg className="zoom" viewBox="0 0 440 400" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
   <title id={`${uid}-title`}>תקריב רציף של בניית גלוקוז</title><desc id={`${uid}-desc`}>כל עיגול הוא פחמן. שני שלדי שלושה פחמנים מקבלים ומשחררים פחמן זמני, ואחר כך מתאחדים לשלד שישה פחמנים. הזרחות מסומנות בזהב.</desc>
   <defs><radialGradient id={`${uid}-enzyme`} cx="30%" cy="20%" r="85%"><stop stopColor="#c4ddd1"/><stop offset=".55" stopColor="#8db6a6"/><stop offset="1" stopColor="#456e79"/></radialGradient><radialGradient id={`${uid}-carbon`} cx="30%" cy="25%"><stop stopColor="#d8efc9"/><stop offset=".45" stopColor="#76aa8a"/><stop offset="1" stopColor="#2d675b"/></radialGradient></defs>
   <rect data-id="matrix" x="0" y="93" width="310" height="224" fill="var(--matrix)"/>
   <g data-id="membrane" transform="translate(310 0)"><path d="M-9 92Q-18 136 -8 176T-9 256T-9 317" stroke="#9f7958" strokeWidth="17" fill="none"/><path d="M-9 92Q-18 136 -8 176T-9 256T-9 317" stroke="#f0d6af" strokeWidth="9" fill="none"/>{Array.from({length:20},(_,i)=><g key={i}><circle cx="-16" cy={96+i*11} r="2.4" fill="#ddb985"/><circle cx="-2" cy={96+i*11} r="2.4" fill="#ddb985"/></g>)}<path d="M-20 190Q-8 179 3 190L3 224Q-7 235 -20 224Z" fill="#bd9270" stroke="#805d49" strokeWidth="1.4"/><path d="M-9 192V223" stroke="#f4e9cb" strokeWidth="5"/></g>
   <g data-id="er" opacity="0"><rect x="300" y="93" width="139" height="224" fill="var(--matrix)"/><path d="M300 93Q287 151 300 205T300 317" fill="none" stroke="#996a85" strokeWidth="19"/><path d="M300 93Q287 151 300 205T300 317" fill="none" stroke="#e2b9ca" strokeWidth="10"/>{[164,260].map(y=><g key={y}><rect x="278" y={y-12} width="40" height="24" rx="9" fill="#bca883" stroke="#796b57"/><path d={`M281 ${y}H315`} stroke="#f0e7d4" strokeWidth="5"/></g>)}<Label x={80} y={297} className="small">ציטוזול</Label><Label x={369} y={297} className="small">חלל ה־⁦ER⁩</Label></g>
   <Enzyme uid={uid}/>
   <Label data-id="heading" className="heading" x={220} y={29}>מקורות שאינם פחמימות</Label><Label data-id="enzyme-label" x={220} y={65}>לקטט · אלנין · גליצרול</Label><g data-id="enzyme-callout"><path data-id="enzyme-leader" data-leader="enzyme" d="M220 77L220 119" fill="none" stroke="var(--muted)" strokeWidth="1.1"/><circle data-id="enzyme-target" cx="220" cy="119" r="2.6" fill="var(--muted)"/></g>
   <Label data-id="comp-left" x={68} y={94} className="small">מטריצה</Label><Label data-id="comp-right" x={363} y={94} className="small">ציטוזול</Label>
   <g data-id="molecules" data-bound="molecules">{Array.from({length:5},(_,i)=><path data-id={`bond${i}`} key={`b${i}`} stroke="var(--carbon)" strokeWidth="3" fill="none"/>)}<path data-id="ring-bond" stroke="var(--carbon)" strokeWidth="3" fill="none"/>
    {Array.from({length:6},(_,i)=><circle data-id={`c${i}`} data-carbon={i} key={i} r="8" fill={`url(#${uid}-carbon)`} stroke="#346959" strokeWidth="1.2"/>)}
    {Array.from({length:6},(_,i)=><Label data-id={`carbon-number${i}`} key={`n${i}`} x={0} y={0} opacity="0" style={{fontSize:9,fill:'#fff',fontWeight:700,pointerEvents:'none'}}>{String(i+1)}</Label>)}
    <g data-id="oxygen"><circle r="7" fill="#dfaaa2" stroke="#9e625e"/><Label x={0} y={4} style={{fontSize:10,fill:'#513b3c'}}>O</Label></g>
    {[0,1].map(i=><React.Fragment key={i}><path data-id={`extra-bond${i}`} stroke="#c19354" strokeWidth="2.5"/><g data-id={`extra${i}`}><circle r="8" fill="#e3c081" stroke="#926c37" strokeWidth="1.3"/><circle cx="-2" cy="-2" r="2.5" fill="#fff0c4"/></g></React.Fragment>)}
    {['p1','p6'].map(id=><React.Fragment key={id}><path data-id={`${id}-bond`} stroke="#b78a3c" strokeWidth="1.7"/><g data-id={id} data-bound={id}><circle r="11" fill="#e4c37e" stroke="#9c7633"/><Label x={0} y={5} style={{fill:'#654d24',fontSize:14}}>P</Label></g></React.Fragment>)}
    {[0,1].map(i=><React.Fragment key={i}><path data-id={`double${i}`} stroke="var(--carbon)" strokeWidth="1.5"/><path data-id={`q-bond${i}`} stroke="#b78a3c" strokeWidth="1.7"/><g data-id={`q${i}`} data-bound={`q${i}`} opacity="0"><circle r="10" fill="#e4c37e" stroke="#9c7633"/><Label x={0} y={5} style={{fill:'#654d24',fontSize:14}}>P</Label></g></React.Fragment>)}
   </g>
   <g data-id="co2" data-bound="cofactor"><rect x="-36" y="-12" width="72" height="24" rx="12" fill="var(--bg)" stroke="var(--line)"/><Label data-id="co2-text" x={0} y={5} className="small">HCO₃⁻</Label></g>
   <path data-id="redox-arrow" d="M123 290H296l-7 -4m7 4l-7 4" fill="none" stroke="#498c9b" strokeWidth="1.7"/>
   <g data-id="redox" data-bound="redox"><rect x="-35" y="-12" width="70" height="24" rx="8" fill="var(--bg)" stroke="#6498a1"/><Label data-id="redox-text" x={0} y={5} className="small">NADH</Label></g>
   <Label data-id="metabolite" className="metabolite" x={220} y={345}>שלדים של שלושה פחמנים</Label><Label data-id="reaction" x={220} y={375} className="small">גליצרול נכנס בהמשך דרך DHAP</Label>
   <g data-id="regulation" opacity="0"><rect x="16" y="91" width="408" height="294" rx="13" fill="var(--panel)"/>
    <Label x={220} y={123}>גלוקגון מוריד F-2,6-BP</Label><Label x={220} y={150} className="small">אינסולין פועל בכיוון ההפוך</Label>
    <Label x={220} y={187}>בקרה: F-2,6-BP וגם AMP</Label><path d="M203 200L131 219M237 200L309 219M121 216L129 226M311 220l-9 -1m9 1l-4 -8" stroke="var(--muted)" strokeWidth="1.4" fill="none"/>
    <Label x={108} y={250}>עיכוב FBPase-1</Label><Label x={326} y={250}>הפעלת PFK-1</Label>
    <Label x={220} y={289}>המטבוליט acetyl-CoA מפעיל PC</Label><Label x={220} y={324} className="small">בצום: העדפת בניית גלוקוז בכבד</Label><Label x={220} y={356} className="small">בקרה הדדית מצמצמת מעגל סרק</Label>
   </g>
  </svg></div>
  <div className="energy" aria-label="עלות מצטברת משני פירובט לגלוקוז אחד"><small>עלות מצטברת לגלוקוז משני פירובט</small><span data-id="atp">{isolate('0 ATP')}</span><span data-id="gtp">{isolate('0 GTP')}</span><span data-id="nadh">{isolate('0 NADH')}</span></div>
  <p className="caption" aria-live="polite" aria-atomic="true"><strong>{isolate(CHAPTERS[chapter].name)}</strong>{isolate(CHAPTERS[chapter].text)}</p><p className="phase" data-id="phase"/>
  <div className="controls"><button onClick={toggle} disabled={reduced} aria-label={running?'השהיה':'ניגון'}>{running&&!reduced?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step="0.01" value={time} onChange={e=>jump(Number(e.target.value))}/><output>{Math.floor(time)} / {DURATION}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>לולאה</label></div>
  <div className="legend"><span><i className="dot"/>פחמן בשלד</span><span><i className="dot" style={{background:'#dfbd7a'}}/>{isolate('פחמן זמני / זרחה המסומנת P')}</span><span>{isolate('חמצן בטבעת מסומן O')}</span></div><p className="note">איור מקורי וסכמטי, ללא קנה מידה או קינטיקה מדודה. שני המסלולים הם חלופות. המקורות: ⁦Lehninger 8e⁩ פרק ⁦14⁩; ⁦Berg/Stryer 10e⁩ פרק ⁦16⁩.</p>
 </section>;
}

