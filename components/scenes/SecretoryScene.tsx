"use client";

import { useEffect, useId, useRef, useState } from "react";

type Point = [number, number];
type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
export const DURATION = 126;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => { const u = clamp(v); return u*u*(3-2*u); };
const ramp = (t: number, a: number, b: number) => ease((t-a)/(b-a));
const mix = (a: number, b: number, u: number) => a+(b-a)*u;
const lerp = (a: Point, b: Point, u: number): Point => [mix(a[0],b[0],u),mix(a[1],b[1],u)];
const windowAt = (t: number,a: number,b: number) => ramp(t,a,a+1)*(1-ramp(t,b-1,b));
export const isolateRuns = (s: string) => s.replace(/[\u2066\u2069]/g,"").replace(/[A-Za-z0-9][A-Za-z0-9²⁺₀-₉–-]*(?:[ /→]+[A-Za-z0-9][A-Za-z0-9²⁺₀-₉-]*)*/g,s=>"\u2066"+s+"\u2069");

export const CHAPTERS = [
 {start:0,still:7,he:"רצף האות",en:"Signal sequence",text:"התרגום מתחיל בציטוזול על גבי mRNA. רצף אות הידרופובי בקצה N יוצא מהריבוזום; SRP נקשר לאות ולריבוזום ומעכב זמנית את ההתארכות.",english:"Translation starts on cytosolic mRNA. An N-terminal hydrophobic signal emerges from the ribosome; SRP binds the signal and ribosome, temporarily pausing elongation."},
 {start:12,still:21,he:"עגינה וכניסה",en:"Docking and entry",text:"החלקיק SRP מביא את הריבוזום לקולטן SRP בממברנת ה־ER. הריבוזום מועבר ל־Sec61, הידרוליזת GTP מאפשרת שחרור SRP, והתרגום מתחדש. השרשרת עוברת בתעלה המימית אל הלומן; פפטיד האות נחתך בידי signal peptidase.",english:"SRP docks at its ER receptor. The ribosome transfers to Sec61; GTP hydrolysis permits SRP release and translation resumes. The chain enters the lumen through an aqueous channel; signal peptidase cleaves the signal peptide."},
 {start:30,still:39,he:"קיפול ובקרה",en:"Folding and quality control",text:"בלומן, BiP ושפרונים נוספים מסייעים לקיפול, ונוצרים קשרי S–S. אוליגוסכריד מועבר לאספרגין: N-גליקוזילציה מתחילה כבר בזמן הטרנסלוקציה. רק מטען מקופל יוצא. חלבון פגום נשמר ב־ER; ב־ERAD הוא מוחזר לציטוזול ומפורק בפרוטאזום — החריג שאינו מסלול המטען התקין המצויר.",english:"In the lumen, BiP and other chaperones assist folding and S–S bonds form. An oligosaccharide is transferred to asparagine: N-glycosylation begins during translocation. Folded cargo exits; defective protein is retained and may undergo ERAD, retrotranslocation and proteasomal degradation. That exception is not the tracked cargo."},
 {start:44,still:50,he:"הנצת COPII",en:"COPII budding",text:"באתר יציאה מה־ER, Sar1-GTP מגייס את Sec23/24 ואת כלוב Sec13/31 של COPII בצד הציטוזולי. המטען נשאר בלומן דרך קולטן מטען. הצוואר נצבט, המעטפת מוסרת, ונשא ההובלה נע אל אזור ה־cis דרך מדור ביניים ERGIC.",english:"At an ER exit site, Sar1-GTP recruits Sec23/24 and the Sec13/31 COPII cage on the cytosolic face. A cargo receptor concentrates luminal cargo. The neck closes; the coat is shed and the carrier travels via the ERGIC to cis-Golgi."},
 {start:58,still:65,he:"כניסה ל־cis",en:"Entry into cis-Golgi",text:"לאחר הסרת המעטפת, זיהוי ועגינה ואיחוי בתיווך SNARE מחברים את לומן הנשא ללומן ה־cis. אירוע צדדי: COPI מחזיר רכיבי ER וחלבונים תושבים, למשל דרך קולטן KDEL; זהו מסלול חזרה, לא מסלול המטען להפרשה.",english:"After uncoating, recognition, tethering and SNARE-mediated fusion join the carrier lumen to cis-Golgi. A side event shows COPI returning ER components and resident proteins, for example via the KDEL receptor, separately from forward secretory cargo."},
 {start:70,still:82,he:"הבשלה בגולג׳י",en:"Golgi maturation",text:"אותו מטען נשאר בלומן: הציסטרנה מבשילה מ־cis דרך medial ל־trans. מנוז מוסר וסוכרים נוספים מתווספים בידי אנזימים במדורים השונים. COPI מחזיר אנזימים לאחור. זהו מודל הבשלת הציסטרנות; בגולג׳י קיימים גם מנגנוני הובלה נוספים.",english:"The same cargo remains luminal as its cisterna matures from cis through medial to trans. Mannose is trimmed and additional sugars are added by compartment-specific enzymes. COPI recycles enzymes backward. This depicts cisternal maturation; additional Golgi transport mechanisms also exist."},
 {start:90,still:99,he:"מיון ב־TGN",en:"Sorting at the TGN",text:"ברשת ה־trans-Golgi ממיינים מטענים להפרשה, לממברנת התא או לאנדוזומים וליזוזומים. המטען המסומן ממשיך במסלול הפרשה קבועה. שלפוחית ננצת ונישאת בעזרת חלבון מנוע לאורך מיקרוטובול אל ממברנת התא.",english:"The trans-Golgi network sorts cargo for secretion, the plasma membrane, or endosomes and lysosomes. The marked cargo takes the constitutive secretion route. A vesicle buds and a motor carries it along a microtubule toward the plasma membrane."},
 {start:106,still:116,he:"אקסוציטוזה",en:"Exocytosis",text:"חלבוני SNARE מצמידים ומאחים את ממברנת השלפוחית עם ממברנת התא. נפתח נקב איחוי והמטען משתחרר החוצה: הצד הלומינלי נעשה צד חוץ־תאי. כאן מוצגת הפרשה קבועה; בהפרשה מווסתת, למשל בתאי β בלבלב, גרנולות ממתינות לאות כגון עליית Ca²⁺.",english:"SNAREs bring the vesicle and plasma membranes together and drive fusion. A fusion pore opens and cargo is released: the luminal face becomes extracellular. This is constitutive secretion; regulated granules, for example in pancreatic β cells, wait for a signal such as increased Ca²⁺."},
] as const;
export const chapterAt = (t: number) => Math.max(0,CHAPTERS.findLastIndex(c=>t>=c.start));

// A single cargo identity; its unfolded coordinates morph into its folded ribbon.
export function cargoAt(t: number): Point {
 if(t<30)return [240,mix(218,278,ramp(t,20,30))];
 if(t<44)return [mix(240,330,ramp(t,39,44)),278];
 if(t<52)return [mix(330,416,ramp(t,47,49)),278];
 if(t<61)return lerp([416,278],[510,245],ramp(t,52,61));
 if(t<63)return lerp([510,245],[560,245],ramp(t,61,63));
 if(t<70)return [mix(560,655,ramp(t,63,69)),245];
 if(t<90)return [655,mix(245,385,ramp(t,70,90))];
 if(t<98)return [mix(655,826,ramp(t,90,97)),385];
 if(t<108)return lerp([826,385],[1074,305],ramp(t,98,108));
 return [mix(1074,1170,ramp(t,112,121)),305];
}

const css = `
.sc{--bg:#fafbf9;--ink:#25364a;--muted:#586b7d;--border:#cbd7d9;--button:#fff;--cyto:#edf4ef;--lumen:#e4f0f6;--outside:#edf5f8;background:var(--bg);color:var(--ink);border:1px solid var(--border);border-radius:20px;overflow:hidden;font:15px/1.55 system-ui,sans-serif;text-align:start;isolation:isolate}
.dark .sc,.sc[data-theme=dark]{--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--button:#253945;--cyto:#203b35;--lumen:#263f51;--outside:#203845}
@media(prefers-color-scheme:dark){.sc:not([data-theme=light]){--bg:#15232d;--ink:#e5edf1;--muted:#b4c6cf;--border:#425765;--button:#253945;--cyto:#203b35;--lumen:#263f51;--outside:#203845}}
.sc *{box-sizing:border-box}.sc header{padding:20px 24px 12px}.sc h2{font-size:25px;line-height:1.3;margin:4px 0}.sc .sc-top{display:flex;justify-content:space-between;gap:10px;font-size:12px;color:var(--muted)}.sc button{background:var(--button);color:var(--ink);border:1px solid var(--border);border-radius:9px;padding:8px 12px;font:inherit;cursor:pointer;min-height:42px}.sc button:focus-visible,.sc input:focus-visible{outline:3px solid #398bb3;outline-offset:3px}.sc button[aria-current=true]{background:#346451;color:white;border-color:#346451}.sc button:disabled{opacity:.6}.sc nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;padding:0 24px 12px}.sc nav button{font-size:12px;flex:1;white-space:nowrap}.sc svg{display:block}.sc .sc-movie{width:100%;height:auto;aspect-ratio:900/740}.sc .world text,.sc .world .leader{display:none}.sc .sc-movie .annotation{font-size:18px}.sc .sc-movie .panel-title{font-size:18px;font-weight:600}.sc .sc-movie .map-label{font-size:16px}.sc .annotation-bg{fill:var(--bg);stroke:var(--border);stroke-width:1}.sc .zoom-frame{fill:none;stroke:#398bb3;stroke-width:2;stroke-dasharray:6 4}.sc svg text{font:17px system-ui,sans-serif;fill:var(--ink)}.sc .sc-caption{margin:12px 24px 0;min-height:125px;font-size:16px}.sc .sc-caption strong{display:block}.sc .sc-phase{color:var(--muted);font-size:13px;min-height:26px;margin:5px 24px 12px}.sc .sc-controls{display:flex;align-items:center;gap:10px;padding:0 24px 12px}.sc input[type=range]{flex:1;min-width:40px;accent-color:#548b75;direction:ltr}.sc output{font-variant-numeric:tabular-nums;white-space:nowrap;font-size:12px;direction:ltr}.sc label{display:flex;gap:5px;align-items:center;font-size:13px}.sc .sc-legend{border-top:1px solid var(--border);padding:12px 24px;display:flex;gap:10px 20px;flex-wrap:wrap;font-size:13px}.sc .sc-legend span{display:inline-flex;align-items:center;gap:6px}.sc i{width:12px;height:12px;border-radius:50%;display:inline-block}.sc .sc-note{font-size:11px;color:var(--muted);padding:0 24px 14px}.sc .leader{fill:none;stroke:var(--muted);stroke-width:1.4}.sc .membrane{fill:var(--lumen);stroke:#91adba;stroke-width:9;stroke-linejoin:round;stroke-linecap:round}.sc .rim{fill:none;stroke:#47799c;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}.sc .sc-compartment{font-size:13px;color:var(--muted);padding:0 24px}
@media(max-width:600px){.sc header{padding:16px 14px 12px}.sc h2{font-size:21px}.sc nav{padding:0 14px 10px}.sc nav{grid-template-columns:repeat(3,minmax(0,1fr))}.sc nav button{padding:6px;font-size:12px;white-space:normal}.sc .sc-movie{aspect-ratio:390/790}.sc .sc-movie .annotation{font-size:15px}.sc .sc-movie .panel-title{font-size:16px}.sc .sc-movie .map-label{font-size:14px}.sc .sc-caption{margin:12px 14px 0;min-height:190px;font-size:15px}.sc .sc-phase{margin:5px 14px 10px;min-height:42px}.sc .sc-controls{padding:0 14px 12px;flex-wrap:wrap}.sc .sc-legend{padding:12px 14px;gap:10px 14px}.sc .sc-note{padding:0 14px 14px}.sc .sc-compartment{padding:0 14px}}
`;

function Ribosome(){return <>
 <path d="M-43 -17 C-54 -42 -23 -61 -6 -49 C9 -67 43 -47 44 -24 C59 -11 38 12 18 8 C8 16 -8 10 -17 12 C-34 16 -48 4 -43 -17Z" fill="#b7d2bf" stroke="#346451" strokeWidth="2"/>
 <path d="M-35 22 C-43 7 -16 5 0 10 C15 2 43 11 35 25 C27 37 -22 39 -35 22Z" fill="#8eb8a1" stroke="#346451" strokeWidth="2"/>
 <path d="M-29 -22 Q-17 -42 -3 -25 M9 -40 Q32 -35 29 -17 M-25 -7 Q-9 -17 -6 1 M13 -13 Q27 -6 19 3" fill="none" stroke="#6f9d82" strokeWidth="5" strokeLinecap="round"/>
 <path d="M-68 15 Q-45 5 -26 17 T16 17 T62 12" fill="none" stroke="#47799c" strokeWidth="3"/>
 {[-54,-42,-30,-18,-6,6,18,30,42,54].map((x,i)=><path key={x} d={`M${x} 15 l2 ${i%2?-6:6}`} stroke="#47799c" strokeWidth="2"/>)}
 </>}

function Glycan(){return <g data-glycan="" transform="scale(.6)">
 <path d="M0 -15 V-25 L-12 -36 M0 -25 L12 -36 M-12 -36 L-21 -47 M-12 -36 L-5 -49 M12 -36 L7 -49 M12 -36 L23 -46" fill="none" stroke="#7c9a72" strokeWidth="2.5"/>
 {[[-1,-23],[-12,-36],[12,-36],[-21,-47],[-5,-49],[7,-49],[23,-46]].map(([x,y],i)=><circle key={i} data-sugar={i} cx={x} cy={y} r="4.2" fill={i<1?'#6b91b5':'#79a06c'} stroke="#385b42" strokeWidth="1"/>)}
 {[-21,-5,7,23].map((x,i)=><g key={i} data-terminal={i} opacity="0"><path d={`M${x} -47 v-9`} stroke="#a98653" strokeWidth="2"/><path d={`M${x-4} -60 l4 -4 4 4 -4 4Z`} fill="#d7a253" stroke="#805322"/><circle cx={x} cy="-70" r="3" fill="#b86b80"/></g>)}
 </g>}

function VesicleLipids(){return <g>{Array.from({length:24},(_,i)=>{const a=i*Math.PI/12,c=Math.cos(a),s=Math.sin(a);return <g key={i}><path d={`M${32*c} ${32*s} L${39*c} ${39*s}`} stroke="#8da8b4" strokeWidth="1.3"/><circle cx={32*c} cy={32*s} r="1.6" fill="#d1e1e9"/><circle cx={40*c} cy={40*s} r="1.6" fill="#d1e1e9"/></g>})}</g>}

function CisternLipids(){return <g>{Array.from({length:29},(_,i)=>{const x=557+i*7.2,h=30+2*Math.sin(i*Math.PI/28);return [-1,1].map(side=><g key={`${i}-${side}`}><path d={`M${x-1} ${side*(h-4)} l0 ${side*8} M${x+1} ${side*(h-4)} l0 ${side*8}`} stroke="#8da8b4" strokeWidth=".7"/><circle cx={x} cy={side*(h-4)} r="1.5" fill="#d1e1e9"/><circle cx={x} cy={side*(h+4)} r="1.5" fill="#d1e1e9"/></g>)})}</g>}

export default function SecretoryScene({lang="he",processName,theme}: Props){
 const en=lang==="en",root=useRef<HTMLElement>(null),svg=useRef<SVGSVGElement>(null),clock=useRef(0),playing=useRef(true),looping=useRef(true),reduced=useRef(false),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduce,setReduce]=useState(false);
 const uid=useId().replace(/:/g,""),chapter=chapterAt(time),tr=(he:string,english:string)=>isolateRuns(en?english:he);
 useEffect(()=>{
  const host=root.current!,movie=svg.current!,nodes=new Map<string,Element>();
  movie.querySelectorAll('[data-id]').forEach(e=>nodes.set(e.getAttribute('data-id')!,e));
  const node=(id:string)=>nodes.get(id)!;
  const attr=(id:string,key:string,value:number|string)=>node(id).setAttribute(key,String(value));
  const opacity=(id:string,v:number)=>attr(id,'opacity',clamp(v));
  const move=(id:string,p:Point)=>attr(id,'transform',`translate(${p[0]} ${p[1]})`);
  const media=matchMedia('(prefers-reduced-motion: reduce)'),narrow=matchMedia('(max-width:600px)');
  const groups=Array.from(movie.querySelectorAll<SVGGElement>('[data-bounds]'));
  const sugars=Array.from(movie.querySelectorAll('[data-sugar]')),terminals=Array.from(movie.querySelectorAll('[data-terminal]')),coatSegments=Array.from(movie.querySelectorAll('[data-coat]'));
  const original=movie.querySelector('.world')!,map=original.cloneNode(true) as SVGGElement;
  map.removeAttribute('id');
  const originalDynamic=Array.from(original.querySelectorAll('[data-id],[data-sugar],[data-terminal],[data-coat]'));
  const mapDynamic=Array.from(map.querySelectorAll('[data-id],[data-sugar],[data-terminal],[data-coat]'));
  map.querySelectorAll('[data-id]').forEach(e=>e.removeAttribute('data-id'));
  node('overview').prepend(map);
  let raf=0,last=0,visible=true,ui=-1;
  const frame=(t:number)=>{
   clock.current=t;const ci=chapterAt(t),p=cargoAt(t),y=mix(245,385,ramp(t,70,90));
   const mobile=narrow.matches,screenW=mobile?390:900,detailY=mobile?236:236;
   const panelW=screenW-32,panelH=mobile?520:480;
   // One continuous camera; the overview always retains the entire route.
   let focus:Point=lerp([210,150],[260,210],ramp(t,12,30));
   focus=lerp(focus,[260,245],ramp(t,30,38));
   focus=lerp(focus,[420,278],ramp(t,40,52));
   focus=lerp(focus,[600,260],ramp(t,54,69));
   focus=lerp(focus,[655,385],ramp(t,70,90));
   focus=lerp(focus,[850,370],ramp(t,91,99));
   focus=lerp(focus,[1090,305],ramp(t,99,112));
   const worldW=mobile?270:420,worldH=panelH*worldW/panelW;
   const left=focus[0]-worldW/2,top=focus[1]-worldH/2,scale=panelW/worldW;
   movie.setAttribute('viewBox',`0 0 ${screenW} ${mobile?790:740}`);
   attr('detail','x',16);attr('detail','y',detailY);attr('detail','width',panelW);attr('detail','height',panelH);
   attr('detail','viewBox',`${left} ${top} ${worldW} ${worldH}`);
   const mapScale=mobile?(screenW-40)/1220:.34,mapY=mobile?60:30,mapX=(screenW-1220*mapScale)/2;
   attr('overview','transform',`translate(${mapX} ${mapY}) scale(${mapScale})`);
   attr('anchor','x',left);attr('anchor','y',top);attr('anchor','width',worldW);attr('anchor','height',worldH);
   attr('anchor','stroke-width',2/mapScale);
   const anchorX=mapX+(left+worldW/2)*mapScale,anchorY=mapY+(top+worldH)*mapScale;
   attr('zoom-link','d',`M${anchorX} ${anchorY} V${detailY-36} H${screenW/2} V${detailY-10}`);
   attr('detail-border','x',16);attr('detail-border','y',detailY);attr('detail-border','width',panelW);attr('detail-border','height',panelH);
   groups.forEach(g=>g.setAttribute('opacity','1'));
   // Shared ribosome, mRNA and signal peptide dock without replacing artwork.
   const rib=lerp([160,114],[240,164],ramp(t,12,19));move('ribosome',rib);opacity('ribosome',1-ramp(t,32,35));
   attr('nascent','d',`M${rib[0]} ${rib[1]+31} q-9 ${6*ramp(t,1,5)} 0 ${12*ramp(t,1,5)}`);opacity('nascent',ramp(t,1,3)*(1-ramp(t,19,20)));
   move('srp',lerp([rib[0]+35,rib[1]+44],[326,126],ramp(t,20,24)));opacity('srp',windowAt(t,5,25));
   move('signal',t<20?[rib[0],rib[1]+40]:lerp([240,211],[290,235],ramp(t,25,30)));opacity('signal',ramp(t,1,4)*(1-ramp(t,29,33)));
   opacity('pause',windowAt(t,7,18));opacity('peptidase',windowAt(t,21,31));opacity('bip',windowAt(t,29,41));
   const open=ramp(t,19,21)*(1-ramp(t,32,35));attr('sec-left','transform',`translate(${-4*open} 0)`);attr('sec-right','transform',`translate(${4*open} 0)`);
   const fold=ramp(t,30,38),length=mix(0,1,ramp(t,19,31));
   const points=Array.from({length:65},(_,i)=>{const u=i/64,a=u*Math.PI*5.8;const unfolded:Point=[240+Math.sin(u*18+t*.4)*5*length,mix(205,p[1]+24,u*length)];const folded:Point=[p[0]+Math.sin(a)*(18+7*Math.sin(u*8)),p[1]+Math.cos(a)*16+u*8];return lerp(unfolded,folded,fold)});
   const d=points.map(([x,yy],i)=>`${i?'L':'M'}${x.toFixed(2)} ${yy.toFixed(2)}`).join(' ');attr('chain','d',d);attr('chain-shine','d',d);opacity('cargo',ramp(t,19,20));
   move('cargo-marker',lerp([rib[0],rib[1]+36],lerp(points[0],[p[0]+5,p[1]+5],fold),ramp(t,19,20)));opacity('cargo-marker',ramp(t,2,4));
   move('glycan',lerp(lerp([282,268],[240,268],ramp(t,27,29)),[p[0],p[1]+17],fold));opacity('glycan',ramp(t,27,29));
   opacity('disulfide',fold);move('disulfide',p);
   sugars.forEach((s,i)=>s.setAttribute('opacity',String(i>3?1-ramp(t,72+i*.5,77+i*.5):1)));
   terminals.forEach((s,i)=>s.setAttribute('opacity',String(ramp(t,79+i*1.8,82+i*1.8))));
   // An ER cisterna has one uninterrupted lumen; the neck narrows to zero.
   const bud=ramp(t,45,48),neck=36*(1-ramp(t,49,52)),cx=mix(380,416,bud),r=36*bud;
   let er='M55 205 Q35 205 35 225 V330 Q35 350 55 350 H360 Q380 350 380 330 V225 Q380 205 360 205Z';
   if(t>=45&&t<52){const ix=cx-Math.sqrt(Math.max(0,r*r-Math.min(neck,r)*Math.min(neck,r)));er=`M55 205 Q35 205 35 225 V330 Q35 350 55 350 H360 Q380 350 380 330 V${278+neck} Q${ix} ${278+neck} ${ix} ${278+Math.min(neck,r)} A${Math.max(.01,r)} ${Math.max(.01,r)} 0 1 0 ${ix} ${278-Math.min(neck,r)} Q${ix} ${278-neck} 380 ${278-neck} V225 Q380 205 360 205Z`}
   attr('er','d',er);attr('er-rim','d',er);
   const carrier:Point=t<63?lerp([416,278],[510,245],ramp(t,52,61)):[510,245];move('carrier',carrier);opacity('carrier',t>=52?1-ramp(t,61,64):0);
   // Cargo enters the fused lumen through the widening pore; it never crosses a bilayer.
   const merge=48*ramp(t,60,63)*(1-ramp(t,64,69));
   const cis=`M550 ${y-30} C${520-merge} ${y-30} ${511-merge} ${y-11} ${527-merge} ${y+5} C${511-merge} ${y+27} 535 ${y+30} 558 ${y+30} C620 ${y+32} 702 ${y+32} 766 ${y+30} C801 ${y+30} 810 ${y+16} 792 ${y+2} C815 ${y-24} 791 ${y-30} 763 ${y-30} C690 ${y-32} 618 ${y-32} 550 ${y-30}Z`;
   attr('maturing','d',cis);attr('maturing-rim','d',cis);
   move('maturing-lipids',[0,y]);
   opacity('active-cis',1);
   // Background cisternae recycle around the same maturation route, never carry our marker.
   [0,1].forEach(i=>{const progress=140*ramp(t,70,90),raw=(i===0?315:385)+progress,yy=raw>420?raw-210:raw;attr(`stack${i}`,'transform',`translate(0 ${yy})`);opacity(`stack${i}`,ease(Math.min(yy-210,420-yy)/18))});
   const coat=windowAt(t,46,58);move('copii',t<52?[cx,278]:carrier);opacity('copii',coat);attr('copii','transform',`translate(${t<52?cx:carrier[0]} ${t<52?278:carrier[1]}) scale(${mix(.75,1,bud)})`);
   coatSegments.forEach((segment,i)=>segment.setAttribute('opacity',String(ramp(t,46+i*.12,46.8+i*.12)*(1-ramp(t,55+i*.05,57+i*.05)))));
   move('receptor',t<52?[Math.max(370,cx-30),278]:[carrier[0]-30,carrier[1]]);opacity('receptor',windowAt(t,43,62));
   // COPI carries a resident return marker, visually distinct from the blue cargo marker.
   const ret=ramp(t,65,75),returnX=mix(530,385,ret);move('copi',[returnX,mix(392,337,ret)-65*Math.sin(ret*Math.PI)]);opacity('copi',windowAt(t,64,76));
   const sec:Point= t<98?[mix(772,826,ramp(t,92,97)),385] : lerp([826,385],[1074,305],ramp(t,98,108));
   move('secretory',sec);opacity('secretory',ramp(t,92,95)*(1-ramp(t,110,111)));
   // TGN neck remains luminal until fission, then retracts after sealing.
   const tn=20*(1-ramp(t,96,98));attr('tgn-neck','d',`M775 ${385-tn} Q800 ${385-tn} ${sec[0]-30} ${385-tn} L${sec[0]-30} ${385+tn} Q800 ${385+tn} 775 ${385+tn}Z`);opacity('tgn-neck',windowAt(t,92,98));
   opacity('motor',windowAt(t,98,106));move('motor',[sec[0],sec[1]+47]);
   opacity('snares',windowAt(t,106,113));
   // Omega fusion profile opens to the exterior, then flattens into the plasma membrane.
   const f=ramp(t,110,114),flat=ramp(t,117,123),s=1-flat,ap=36*f*s,cxFusion=1110-36*s,leftFusion=1110-72*s,topFusion=305-36*s,bottomFusion=305+36*s;
   const pm=t<110?'M1110 120 V440':`M1110 120 V${305-ap} C1110 ${305-ap-20*(1-f)*s} ${cxFusion+20*s} ${topFusion} ${cxFusion} ${topFusion} C${cxFusion-20*s} ${topFusion} ${leftFusion} ${305-20*s} ${leftFusion} 305 C${leftFusion} ${305+20*s} ${cxFusion-20*s} ${bottomFusion} ${cxFusion} ${bottomFusion} C${cxFusion+20*s} ${bottomFusion} 1110 ${305+ap+20*(1-f)*s} 1110 ${305+ap} V440`;
   attr('plasma','d',pm);attr('plasma-rim','d',pm);
   attr('outside','d',pm+' H1220 V120Z');
   opacity('fusion-ring',windowAt(t,110,118));
   // Labels live in screen space, so mobile text never shrinks with the world.
   type Annotation={he:string;en:string;target:Point;offset:Point};
   const labels:Annotation[][]=[
    [{he:'ריבוזום',en:'Ribosome',target:[rib[0],rib[1]-44],offset:[0,-30]},
     {he:'חלקיק SRP',en:'SRP particle',target:[rib[0]+57,rib[1]+40],offset:[66,30]},
     {he:'רצף אות',en:'Signal peptide',target:[rib[0]-3,rib[1]+52],offset:[-65,25]}],
    [{he:'ריבוזום',en:'Ribosome',target:[rib[0],rib[1]-44],offset:[0,-30]},
     {he:'קולטן SRP',en:'SRP receptor',target:[312,175],offset:[48,-30]},
     {he:'תעלת Sec61',en:'Sec61 channel',target:[224,216],offset:[-70,26]},
     {he:'פפטידאז האות',en:'Signal peptidase',target:[265,226],offset:[54,50]}],
    [{he:'שפרון BiP',en:'BiP chaperone',target:[294,280],offset:[66,0]},
     {he:'חלבון מקופל',en:'Folded cargo',target:[p[0]-20,p[1]+10],offset:[-64,42]},
     {he:'גליקן',en:'Glycan',target:[p[0],p[1]-15],offset:[0,-42]}],
    [{he:'מעטפת COPII',en:'COPII coat',target:[(t<52?cx:carrier[0])+28,(t<52?278:carrier[1])-36],offset:[25,-40]},
     {he:'קולטן מטען',en:'Cargo receptor',target:[(t<52?Math.max(370,cx-30):carrier[0]-30),t<52?278:carrier[1]],offset:[-60,-45]},
     {he:'חלבון מטען',en:'Cargo protein',target:[p[0],p[1]+20],offset:[20,42]}],
    [{he:'לומן הציסטרנה',en:'Cisterna lumen',target:[p[0],p[1]+20],offset:[0,48]},
     {he:'צד הכניסה cis',en:'cis entry face',target:[535,y-28],offset:[0,-40]}],
    [{he:'גליקן משתנה',en:'Edited glycan',target:[p[0],p[1]-25],offset:[0,-45]},
     {he:'אותו מטען',en:'Same cargo',target:[p[0]+15,p[1]+18],offset:[65,35]}],
    [{he:'שלפוחית הפרשה',en:'Secretory vesicle',target:[sec[0],sec[1]-36],offset:[0,-40]},
     {he:'חלבון מנוע',en:'Motor protein',target:[sec[0]+10,sec[1]+54],offset:[55,32]}],
    [{he:'ממברנת התא',en:'Plasma membrane',target:[1110,225],offset:[-65,-25]},
     {he:t<114?'איחוי בעזרת SNARE':'מטען בחוץ',en:t<114?'SNARE fusion':'Released cargo',target:t<114?[1095,284]:[p[0],p[1]+18],offset:t<114?[-70,25]:[0,42]}]
   ];
   for(let i=0;i<4;i++){
    const a=labels[ci][i],show=!!a&&!(ci===0&&i===1&&(t<5||t>24))&&!(ci===1&&i===3&&(t<21||t>31))&&!(ci===1&&i===0&&t>=30);opacity(`annotation${i}`,show?1:0);if(!a)continue;
    const tx=16+(a.target[0]-left)*scale,ty=detailY+(a.target[1]-top)*scale;
    const text=isolateRuns(en?a.en:a.he),font=mobile?15:18,bw=Math.max(74,text.replace(/[\\u2066\\u2069]/g,'').length*font*.62+18);
    const lx=Math.max(20+bw/2,Math.min(screenW-20-bw/2,tx+a.offset[0])),ly=Math.max(detailY+24,Math.min(detailY+panelH-22,ty+a.offset[1]));
    attr(`label${i}`,'x',lx);attr(`label${i}`,'y',ly+5);node(`label${i}`).textContent=text;
    attr(`label-bg${i}`,'x',lx-bw/2);attr(`label-bg${i}`,'y',ly-14);attr(`label-bg${i}`,'width',bw);
    const dx=tx-lx,dy=ty-ly,edge=Math.min(Math.abs(dx)>1?(bw/2+3)/Math.abs(dx):10,Math.abs(dy)>1?17/Math.abs(dy):10);
    attr(i===0?'leader':`leader${i}`,'d',`M${lx+dx*Math.min(1,edge)} ${ly+dy*Math.min(1,edge)} L${tx} ${ty}`);
   }
   originalDynamic.forEach((e,i)=>{for(const a of Array.from(e.attributes)){if(a.name!=='data-id')mapDynamic[i].setAttribute(a.name,a.value)}});
   movie.querySelectorAll('.panel-title').forEach(e=>{e.setAttribute('x',String(en?24:screenW-24));e.setAttribute('text-anchor','start');e.setAttribute('direction',en?'ltr':'rtl')});
   host.dataset.time=t.toFixed(3);host.dataset.chapter=String(ci);host.dataset.center=String(focus[0]);
  };
  const sync=(t:number)=>{frame(t);setTime(t);ui=t};
  seek.current=(t)=>{sync(Math.max(0,Math.min(DURATION,t)));last=0};
  const tick=(now:number)=>{raf=0;if(!playing.current||reduced.current||!visible||document.hidden){last=0;return}if(last){let t=clock.current+Math.min((now-last)/1000,.08);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}frame(t);if(Math.abs(t-ui)>.12||!playing.current){setTime(t);ui=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)};
  const resume=()=>{last=0;if(!raf&&playing.current&&!reduced.current&&visible&&!document.hidden)raf=requestAnimationFrame(tick)};
  const suspend=()=>{cancelAnimationFrame(raf);raf=0;last=0};
  const preference=()=>{reduced.current=media.matches;setReduce(media.matches);suspend();if(media.matches)sync(CHAPTERS[chapterAt(clock.current)].still);else resume()};
  const resize=()=>frame(clock.current),visibility=()=>{if(document.hidden)suspend();else resume()};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)suspend();else resume()},{threshold:.05});observer.observe(host);
  host.addEventListener('secretory-play',resume);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);narrow.addEventListener('change',resize);
  sync(clock.current);preference();resume();
  return()=>{map.remove();suspend();observer.disconnect();host.removeEventListener('secretory-play',resume);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);narrow.removeEventListener('change',resize)};
 },[en]);
 const jump=(t:number)=>seek.current(t),toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)jump(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('secretory-play'))};
 return <section ref={root} className="sc" dir={en?'ltr':'rtl'} data-theme={theme} aria-label={processName||tr('מסלול ההפרשה','Secretory pathway')}>
  <style>{css}</style><header><div className="sc-top"><span>{tr('מחלבון נולד למטען מופרש','From synthesis to secretion')}</span><span>{reduce?tr('תצוגה רגועה','Reduced motion'):tr('סרט רציף · אותו מטען','Continuous movie · one cargo')}</span></div><h2>{processName||tr('מסע בלומן','A journey through the lumen')}</h2></header>
  <nav aria-label={tr('פרקי הסרט','Movie chapters')}>{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduce?c.still:c.start)}>{tr(`${c.he} · ${i+1}`,`${i+1} · ${c.en}`)}</button>)}</nav>
  <div className="sc-compartment">{tr('ציטוזול סביב האברונים · כחול בהיר: לומן / חוץ־תאי','Cytosol surrounds organelles · pale blue: lumen / extracellular')}</div>
  <svg className="sc-movie" ref={svg} viewBox="0 0 900 740" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
   <title id={`${uid}-title`}>{tr('מסלול ההפרשה הרציף','Continuous secretory pathway')}</title><desc id={`${uid}-desc`}>{tr('מטען זהוב עם סמן כחול וסוכר מסתנתז ונכנס ל־ER, מתקפל, מובל לגולג׳י ומופרש. הממברנות עוטפות אותו לאורך המסלול.','A gold cargo with a blue marker and glycan enters the ER during synthesis, folds, travels through Golgi and is secreted. Membranes enclose it throughout transport.')}</desc>
   <g data-id="overview"><rect data-id="anchor" className="zoom-frame"/></g>
   <path data-id="zoom-link" className="zoom-frame"/>
   <text x="24" y="24" className="panel-title">{tr('התא · מסלול המטען','Cell · cargo route')}</text>
   <text x="24" y="214" className="panel-title">{tr('מבט מקרוב','Active site · magnified')}</text>
   <rect data-id="detail-border" rx="14" fill="var(--cyto)" stroke="var(--border)"/>
   <svg data-id="detail" preserveAspectRatio="xMidYMid meet" overflow="hidden">
   <g id={`${uid}-world`} className="world">
   
   <rect x="0" y="90" width="1220" height="360" rx="18" fill="var(--cyto)"/>
   <g data-bounds="30,390"><path data-id="er" className="membrane"/><path data-id="er-rim" className="rim"/>
    {Array.from({length:39},(_,i)=>{const x=58+i*7.8;return [205,350].map(yy=><g key={`${i}-${yy}`}><path d={`M${x-1} ${yy-3} v6 m2 -6 v6`} stroke="#8da8b4" strokeWidth=".7"/><circle cx={x} cy={yy-4} r="1.5" fill="#d1e1e9"/><circle cx={x} cy={yy+4} r="1.5" fill="#d1e1e9"/></g>)})}
    <g opacity=".65">{[62,92,122,332,360].map(x=><g key={x} transform={`translate(${x} 190) scale(.3)`}><Ribosome/></g>)}</g>
    <text x="155" y="332" textAnchor="middle">{tr('לומן ER','ER lumen')}</text>
    <g data-id="sec-left"><path d="M223 191 Q211 205 224 220 L237 220 V191Z" fill="#9fbed3" stroke="#244b73" strokeWidth="2"/><path d="M226 193 V216" stroke="#47799c" strokeWidth="4"/></g><g data-id="sec-right"><path d="M243 191 V220 H256 Q267 204 255 191Z" fill="#9fbed3" stroke="#244b73" strokeWidth="2"/><path d="M253 194 V216" stroke="#47799c" strokeWidth="4"/></g>
    <path d="M296 210 V182 Q313 168 321 182 L310 191 V210" fill="#b1a0c1" stroke="#765689" strokeWidth="2"/>
    <text x="185" y="245" textAnchor="middle" style={{fontSize:14}}>{isolateRuns("Sec61")}</text><path d="M208 239 L223 218" className="leader"/>
    <g data-id="ribosome"><Ribosome/></g>
    <g data-id="signal"><path d="M0 -5 q-10 2 0 7 t0 7 t0 7" fill="none" stroke="#c46d51" strokeWidth="6" strokeLinecap="round"/></g>
    <g data-id="srp"><path d="M-15 -10 Q-21 12 -6 15 L26 0 Q43 -9 32 -18 Q21 -27 12 -11Z" fill="#c69c73" stroke="#805322" strokeWidth="2"/><path d="M-6 8 L24 -9" stroke="#f0d6b1" strokeWidth="3"/><text x="-40" y="25" textAnchor="middle">{isolateRuns("SRP")}</text></g>
    <g data-id="pause"><path d="M115 98 v16 m8 -16 v16" stroke="#805322" strokeWidth="4"/></g>
    <g data-id="peptidase"><path d="M264 218 l-12 14 m17 -2 l-16 -10" stroke="#b44d53" strokeWidth="3"/><circle cx="265" cy="217" r="4" fill="none" stroke="#b44d53" strokeWidth="2"/></g>
    <g data-id="bip"><path d="M263 272 C290 254 303 278 290 298 C279 307 263 298 263 288 L275 286Z" fill="#b6a3cb" stroke="#765689" strokeWidth="2"/><path d="M282 273 Q293 282 283 294" fill="none" stroke="#e7def1" strokeWidth="3"/></g>
   </g>
   <g data-bounds="510,875">
    {[0,1].map(i=><g key={i} data-id={`stack${i}`}><path className="membrane" d="M550 -30 C520 -35 511 -11 527 5 C511 27 535 35 558 30 C620 22 702 22 766 30 C801 35 810 16 792 2 C815 -24 791 -35 763 -30 C690 -23 618 -23 550 -30Z"/><path className="rim" d="M550 -30 C520 -35 511 -11 527 5 C511 27 535 35 558 30 C620 22 702 22 766 30 C801 35 810 16 792 2 C815 -24 791 -35 763 -30 C690 -23 618 -23 550 -30Z"/></g>)}
    <g data-id="active-cis"><path data-id="maturing" className="membrane"/><path data-id="maturing-rim" className="rim"/><g data-id="maturing-lipids"><CisternLipids/></g></g>
    <text x="835" y="250" textAnchor="middle">{isolateRuns("cis")}</text><text x="835" y="320" textAnchor="middle">{isolateRuns("medial")}</text><text x="835" y="390" textAnchor="middle">{isolateRuns("trans")}</text>
    <text x="655" y="465" textAnchor="middle">{tr('גולג׳י · הבשלת ציסטרנה','Golgi · cisternal maturation')}</text>
   </g>
   <g data-id="carrier"><circle r="36" className="membrane"/><circle r="36" className="rim"/><VesicleLipids/></g>
   <path data-id="tgn-neck" fill="var(--lumen)" stroke="#47799c" strokeWidth="2"/>
   <g data-id="secretory"><circle r="36" className="membrane"/><circle r="36" className="rim"/><VesicleLipids/></g>
   <g data-id="receptor"><path d="M0 -12 V12 M0 0 h10 q12 -12 18 0 q-6 12 -18 0" fill="none" stroke="#765689" strokeWidth="3"/></g>
   <g data-id="copii">{Array.from({length:14},(_,i)=>{const a=i*Math.PI/7,b=(i+1)*Math.PI/7;return <path key={i} data-coat={i} d={`M${45*Math.cos(a)} ${45*Math.sin(a)} L${49*Math.cos((a+b)/2)} ${49*Math.sin((a+b)/2)} L${45*Math.cos(b)} ${45*Math.sin(b)}`} fill="none" stroke="#ac7837" strokeWidth="3"/>})}</g>
   <g data-id="copi"><circle r="20" className="membrane"/><circle r="26" fill="none" stroke="#87649c" strokeWidth="4" strokeDasharray="7 4"/><path d="M-7 0 h14 m-8 -5 l-5 5 5 5" stroke="#87649c" strokeWidth="3" fill="none"/></g>
   <g data-bounds="840,1090"><path d="M846 460 L1090 370 M846 467 L1090 377" stroke="#7b9389" strokeWidth="3"/>{Array.from({length:30},(_,i)=><path key={i} d={`M${846+i*8} ${460-i*2.95} l2 7`} stroke="#a2b8ad" strokeWidth="3"/>)}<text x="975" y="480" textAnchor="middle">{tr('מיקרוטובול','Microtubule')}</text></g>
   <g data-id="motor"><path d="M0 -16 v16 l-9 11 m9 -11 l10 6" fill="none" stroke="#805322" strokeWidth="4"/><ellipse cx="-9" cy="12" rx="5" ry="3" fill="#ac7837"/><ellipse cx="10" cy="7" rx="5" ry="3" fill="#ac7837"/></g>
   <path data-id="outside" fill="var(--outside)"/><path data-id="plasma" className="membrane" style={{fill:'none'}}/><path data-id="plasma-rim" className="rim"/>
   <g data-bounds="1005,1205"><text x="1110" y="465" textAnchor="middle">{tr('ממברנת התא','Plasma membrane')}</text><text x="1160" y="160" textAnchor="middle">{tr('בחוץ','Outside')}</text></g>
   <g data-id="snares"><path d="M1104 280 q-12 10 -18 5 M1104 292 q-12 -10 -18 -5" fill="none" stroke="#b44d53" strokeWidth="4"/><path d="M1090 284 h17" stroke="#87649c" strokeWidth="3"/></g>
   <g data-id="fusion-ring"><path d="M1104 277 l12 0 M1104 333 l12 0" stroke="#b44d53" strokeWidth="3"/></g>
   <path data-id="nascent" fill="none" stroke="#e1b66d" strokeWidth="6" strokeLinecap="round"/>
   <g data-id="cargo"><path data-id="chain" fill="none" stroke="#805322" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/><path data-id="chain-shine" fill="none" stroke="#e1b66d" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/></g>
   <g data-id="cargo-marker"><circle r="5.5" fill="#398bb3" stroke="#fff9ea" strokeWidth="1.5"/></g>
   <g data-id="disulfide"><path d="M-12 -2 L12 3 M-12 2 L12 7" stroke="#b44d53" strokeWidth="1.5"/></g>
   <g data-id="glycan"><Glycan/></g>
   </g></svg>
   {Array.from({length:4},(_,i)=><g key={i} data-id={`annotation${i}`}>
    <path data-id={i===0?'leader':`leader${i}`} className="leader"/>
    <rect data-id={`label-bg${i}`} className="annotation-bg" height="28" rx="7"/>
    <text data-id={`label${i}`} data-label="" className="annotation" textAnchor="middle" direction={en?'ltr':'rtl'}/>
   </g>)}
  </svg>
  <p className="sc-caption" aria-live="polite" aria-atomic="true"><strong>{tr(CHAPTERS[chapter].he,CHAPTERS[chapter].en)}</strong>{tr(CHAPTERS[chapter].text,CHAPTERS[chapter].english)}</p>
  <p className="sc-phase">{tr('עקבו אחרי הסמן הכחול: זהו אותו חלבון מופרש לאורך כל המסע.','Follow the blue marker: the same secretory protein throughout its journey.')}</p>
  <div className="sc-controls"><button onClick={toggle} disabled={reduce} aria-label={tr(running?'השהיה':'ניגון',running?'Pause':'Play')}>{running&&!reduce?tr('❚❚ השהיה','❚❚ Pause'):tr('▶ ניגון','▶ Play')}</button><input aria-label={tr('מיקום בסרט','Movie position')} type="range" min="0" max={DURATION} step="0.01" value={time} onChange={e=>jump(Number(e.target.value))}/><output>{isolateRuns(`${Math.floor(time).toString().padStart(3,'0')} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>{tr('לולאה','Loop')}</label></div>
  <div className="sc-legend" aria-label={tr('מקרא','Legend')}>{[['#e1b66d','חלבון מטען','Cargo protein'],['#398bb3','סמן זהות','Identity marker'],['#79a06c','מנוז','Mannose'],['#6b91b5','ליבת גליקן','Glycan core'],['#d7a253','סוכר נוסף','Added sugar'],['#b86b80','סוכר קצה','Terminal sugar'],['#b44d53','קשרי S–S וחלבוני SNARE','S–S bonds / SNARE'],['#ac7837','מעטפת COPII / מנוע','COPII / motor'],['#87649c','מעטפת COPI / קולטן / BiP','COPI / receptor / BiP'],['#c46d51','פפטיד אות','Signal peptide']].map(([color,he,english])=><span key={he}><i style={{background:color}}/>{tr(he,english)}</span>)}</div>
  <div className="sc-note">{tr('סכמטי — ללא קנה מידה או קינטיקה מדודה. מבנה הגליקן מפושט; מדור ERGIC מקוצר. הצבע הכחול מציין שקילות טופולוגית: האברונים הנפרדים אינם צינור פתוח אחד. המטען התקין נשאר בלומן לאחר כניסתו ל־ER ועד שחרורו החוצה.','Schematic — not to scale or measured kinetics. Glycan geometry is simplified; ERGIC is condensed. Blue denotes topological equivalence: separate organelles are not one open tube. After ER entry, normal cargo stays luminal until released outside.')}</div>
 </section>;
}
