"use client";
import React, {useEffect, useId, useRef, useState} from 'react';

type Props={lang?:string;processName?:string;theme?:'light'|'dark'};
type Point=[number,number];
type Atom={id:string;element:'C'|'N'|'O'|'P';p:Point};
type Bond={a:string;b:string;order?:number};
type Species={name:string;atoms:Atom[]};
export const DURATION=126;
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
const ramp=(t:number,a:number,b:number)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u)};
const lerp=(a:Point,b:Point,u:number):Point=>[mix(a[0],b[0],u),mix(a[1],b[1],u)];
export const isolate=(s:string)=>s.replace(/[\u2066\u2069]/g,'').replace(/[A-Za-z0-9][A-Za-z0-9₀-₉⁺⁻.,-]*(?:[ /→+]+[A-Za-z0-9][A-Za-z0-9₀-₉⁺⁻.,-]*)*/g,s=>'\u2066'+s+'\u2069');
export const CHAPTERS=[
 {start:0,still:19,name:'קיבוע החנקן · CPS I',enzyme:'CPS I',site:'מטריצה · התחלת המסלול',text:'פירוק חומצות אמינו מספק אמוניה, הרעילה במיוחד למוח. במטריצה של תא הכבד, האנזים CPS I משתמש ב־NH₄⁺ וב־HCO₃⁻ ליצירת קרבמויל-פוספט: נצרכים 2 ATP ונוצרים 2 ADP ופוספט חופשי. האנזים פעיל רק עם המפעיל האלוסטרי N-acetylglutamate, שנוצר בידי NAGS מגלוטמט ומ־acetyl-CoA; ארגינין מפעיל את NAGS. החנקן הכחול יישמר עד לשתנן.',reaction:'מצעים: NH₄⁺ + HCO₃⁻ + 2 ATP',detail:'תוצרים נלווים: 2 ADP + פוספט חופשי'},
 {start:23,still:43,name:'ציטרולין וייצוא · OTC',enzyme:'OTC',site:'מטריצה ← נשא ← ציטוזול',text:'האנזים OTC מעביר את קבוצת הקרבמויל מקרבמויל-פוספט לחנקן הצדדי של אורניתין. נוצר ציטרולין ומשתחרר פוספט. ציטרולין יוצא דרך נשא אורניתין/ציטרולין בממברנה הפנימית, בתמורה לכניסת אורניתין. שני חנקני האורניתין נשארים באפור; החנקן הכחול הוא הראשון משני החנקנים של השתנן. הממברנה החיצונית חדירה למטבוליטים קטנים דרך נקבוביות.',reaction:'מצעים: אורניתין + קרבמויל-פוספט',detail:'פוספט משתחרר · אין צריכת ATP נוספת'},
 {start:49,still:67,name:'החנקן השני · ASS',enzyme:'ASS',site:'ציטוזול · חיבור אספרטט',text:'האנזים ASS מחבר ציטרולין לאספרטט ונוצר ארגינינוסוקצינט. החנקן הסגול מגיע מאספרטט ונשמר לצד הכחול. כאן ATP מתפרק ל־AMP ול־PPi; הידרוליזת PPi לשני פוספטים דוחפת את התגובה. המחיר שקול לשני קשרי פוספט עתירי אנרגיה, ולכן העלות הישירה המצטברת היא 3 מולקולות ATP, אך 4 קשרים, לשתנן אחד.',reaction:'מצעים: ציטרולין + אספרטט',detail:'ATP → AMP + PPi · ואז PPi → 2 פוספטים'},
 {start:73,still:91,name:'פיצול ומעקף · ASL',enzyme:'ASL',site:'ציטוזול · פלט שלד הפחמן',text:'האנזים ASL מפצל ארגינינוסוקצינט לארגינין ולפומרט. החנקן של אספרטט נשאר בארגינין; ארבעת פחמניו יוצאים בפומרט. במעקף אספרטט–ארגינינוסוקצינט, פומרט הופך למלאט ולאוקסלואצטט; טרנסאמינציה עם גלוטמט מחדשת אספרטט. קיימים איזואנזימים ציטוזוליים; מלאט יכול גם להיכנס דרך נשא למיטוכונדריה ולמעגל קרבס. פומרט אינו חוצה ישירות את הממברנה הפנימית.',reaction:'מצע: ארגינינוסוקצינט',detail:'ללא הוצאה ישירה נוספת של ATP'},
 {start:99,still:118,name:'שתנן וחזרה · arginase',enzyme:'arginase',site:'ציטוזול ← שתנן לדם',text:'האנזים arginase מבצע הידרוליזה של ארגינין, תוך צריכת מים: נוצרים שתנן ואורניתין. שני החנקנים הצבועים יוצאים יחד בשתנן מסיס ופחות רעיל מאמוניה, דרך הדם לכליות ולשתן. אורניתין חוזר למטריצה דרך אותו סוג נשא, לסבב הבא. פגם באחד מאנזימי המעגל עלול לגרום להצטברות אמוניה בדם. העלות הישירה: 4 קשרים עתירי אנרגיה לשתנן אחד; חיבור המסלול למטבוליזם של מלאט יכול להשיב חלק מהעלות.',reaction:'מצעים: ארגינין + מים',detail:'שני חנקנים יוצאים · שני חנקני האורניתין ממוחזרים'}
] as const;
export const chapterAt=(t:number)=>CHAPTERS.reduce((n,c,i)=>t>=c.start?i:n,0);

// Explicit heavy-atom graphs. Hydrogen/protonation and resonance are omitted.
const atom=(id:string,element:Atom['element'],x:number,y:number):Atom=>({id,element,p:[x,y]});
const orn:Atom[]=[atom('o1','C',65,300),atom('o2','C',103,278),atom('o3','C',142,300),atom('o4','C',181,278),atom('o5','C',220,300),atom('oa','N',103,236),atom('od','N',259,278),atom('oo1','O',33,278),atom('oo2','O',65,343)];
const cp:Atom[]=[atom('c','C',295,256),atom('n1','N',336,278),atom('co','O',295,213),atom('po','O',336,234),atom('p','P',378,213),atom('p1','O',378,172),atom('p2','O',418,213),atom('p3','O',378,254)];
const asp:Atom[]=[atom('a1','C',347,362),atom('a2','C',382,338),atom('a3','C',416,363),atom('a4','C',444,338),atom('n2','N',340,310),atom('ao1','O',309,345),atom('ao2','O',347,402),atom('ao3','O',444,296),atom('ao4','O',459,377)];
export const ATOMS:Atom[]=[...orn,...cp,...asp,atom('wo','O',423,150),atom('bo','O',198,226)];
const atomsById=Object.fromEntries(ATOMS.map(a=>[a.id,a]));
const ornB:Bond[]=[{a:'o1',b:'o2'},{a:'o2',b:'o3'},{a:'o3',b:'o4'},{a:'o4',b:'o5'},{a:'o2',b:'oa'},{a:'o5',b:'od'},{a:'o1',b:'oo1',order:2},{a:'o1',b:'oo2'}];
const cpB:Bond[]=[{a:'c',b:'n1'},{a:'c',b:'co',order:2},{a:'c',b:'po'},{a:'po',b:'p'},{a:'p',b:'p1'},{a:'p',b:'p2'},{a:'p',b:'p3'}];
const aspB:Bond[]=[{a:'a1',b:'a2'},{a:'a2',b:'a3'},{a:'a3',b:'a4'},{a:'a2',b:'n2'},{a:'a1',b:'ao1',order:2},{a:'a1',b:'ao2'},{a:'a4',b:'ao3',order:2},{a:'a4',b:'ao4'}];
export const BONDS=[...ornB,...cpB,...aspB,{a:'od',b:'c'},{a:'c',b:'n2'},{a:'c',b:'wo'},{a:'c',b:'bo'}] satisfies Bond[];
const ids=(a:Atom[])=>a.map(x=>x.id);
const species=(name:string,keys:string[]):Species=>({name,atoms:keys.map(k=>atomsById[k])});
export function speciesAt(t:number):Species[]{
 const scaffold=ids(orn),carbamoyl=['c','n1','co'],aspartate=ids(asp),fumarate=aspartate.filter(x=>x!=='n2');
 if(t<13)return [species('ornithine',scaffold),species('ammonium',['n1']),species('bicarbonate',['c','co','po','bo'])];
 if(t<34)return [species('ornithine',scaffold),species('carbamoylPhosphate',ids(cp))];
 if(t<60)return [species('citrulline',[...scaffold,...carbamoyl]),...(t>=49?[species('aspartate',aspartate)]:[])];
 if(t<81)return [species('argininosuccinate',[...scaffold,'c','n1',...aspartate])];
 if(t<109)return [species('arginine',[...scaffold,'c','n1','n2']),species('fumarate',fumarate)];
 return [species('urea',['c','n1','n2','wo']),species('ornithine',scaffold),species('fumarate',fumarate)];
}

const mapSites:Point[]=[[120,118],[174,170],[350,139],[371,275],[250,328]];
/** Pure clock: every atom retains its identity through bonding and transport. */
export function frame(t:number){
 const ci=chapterAt(t),cps=ramp(t,6,13),otc=ramp(t,29,35),ass=ramp(t,55,62),asl=ramp(t,78,84),arg=ramp(t,104,111),out=ramp(t,113,122),transportBlend=ramp(t,35,38)*(1-ramp(t,46,49));
 const atoms:Record<string,{p:Point;opacity:number}>={};
 for(const a of ATOMS){let p:Point=[...a.p],opacity=1;
  if(a.id.startsWith('o')){p=lerp([p[0]-6,p[1]-35],p,ramp(t,23,28));p=lerp(p,[p[0]-17,p[1]+20],arg);}
  if(a.id==='n1')p=lerp(lerp([138,204],[330,40],cps),lerp([330,40],p,cps),cps);
  if(a.id==='c'||a.id==='co')p=lerp([236,a.id==='c'?204:164],p,cps);
  if(['p','p1','p2','p3'].includes(a.id)){opacity=ramp(t,3,8)*(1-ramp(t,34,36));p=lerp([a.p[0]-80,a.p[1]-55],a.p,cps);p=lerp(p,[p[0]+20,p[1]-55],otc);}
  if(a.id==='po'){p=lerp([274,226],a.p,cps);p=lerp(p,[p[0]+20,p[1]-55],otc);opacity=1-ramp(t,34,36);}
  if(a.id==='bo'){p=lerp(a.p,[205,171],cps);opacity=1-ramp(t,13,17);}
  if(a.id==='co'){p=lerp(p,[422,182],ass);opacity=1-ramp(t,64,68);}
  if(a.id.startsWith('a')||a.id==='n2'){
   p=lerp([a.p[0]+4,a.p[1]-4],a.p,ramp(t,49,55));opacity=ramp(t,47,51);
   if(a.id==='n2'){p=lerp(p,[337,310],ass);p=lerp(p,[295,304],asl);}
   else {p=lerp(p,[a.p[0]-70,a.p[1]-32],asl);opacity*=1-ramp(t,85,89);}
  }
  if(a.id==='wo'){p=lerp([419,173],[295,215],arg);opacity=ramp(t,100,103);}
  // Product urea separates from the recycled ornithine scaffold.
  if(['c','n1','n2','wo'].includes(a.id)){
   const urea:Record<string,Point>={c:[321,230],n1:[357,251],n2:[285,251],wo:[321,188]};p=lerp(p,urea[a.id],arg);p=lerp(p,[p[0]+25,p[1]-60],out);
  }
  if(ids(orn).includes(a.id)||['c','n1','co'].includes(a.id))p=lerp(p,[mix(114,363,ramp(t,38,45))+(p[0]-185)*.5,246+(p[1]-278)*.5],transportBlend);
  atoms[a.id]={p,opacity};
 }
 const bondOpacity=(b:Bond)=>{
  if(b.a==='od'&&b.b==='c')return otc*(1-arg);
  if(b.a==='c'&&b.b==='n2')return ass;
  if(b.a==='c'&&b.b==='wo')return arg;
  if(b.a==='a2'&&b.b==='n2')return 1-asl;
  if(b.a==='c'&&b.b==='co')return 1-ass;
  if(b.a==='c'&&b.b==='po')return 1-otc;
  if(b.a==='c'&&b.b==='bo')return 1-cps;
  if(b.a==='c'&&b.b==='n1')return cps;
  return 1;
 };
 const focus=mapSites.reduce((p,site,i)=>i===0?p:lerp(p,site,ramp(t,CHAPTERS[i].start-3,CHAPTERS[i].start+3)),mapSites[0]);
 let cargo=lerp([94,88],[128,151],ramp(t,7,22));
 cargo=lerp(cargo,[174,170],ramp(t,28,35));cargo=lerp(cargo,[255,170],ramp(t,38,44));cargo=lerp(cargo,[350,139],ramp(t,44,53));cargo=lerp(cargo,[371,275],ramp(t,66,78));cargo=lerp(cargo,[250,328],ramp(t,93,106));
 const returnCargo=lerp([250,328],[150,328],ramp(t,111,121));
 return {ci,atoms,bondOpacity,focus,cargo,returnCargo,energy:2*cps+2*ass,atp:2*cps+ass,cps,otc,ass,asl,arg,out,transportBlend};
}

function Label({x,y,children,...rest}:{x:number;y:number;children?:React.ReactNode}&React.SVGProps<SVGTextElement>){return <text x={x} y={y} textAnchor="middle" {...rest}>{typeof children==='string'?isolate(children):children}</text>}
// Route the overview-to-detail leader around actual label boxes, including RTL
// and responsive font metrics. A small grid avoids label crossings while moving.
function anchorRoute(focus:Point,boxes:DOMRect[]):string {
 const step=6,w=81,h=72,total=w*h,blocked=new Uint8Array(total),previous=new Int32Array(total).fill(-2),queue=new Int32Array(total),seed=new Map<number,Point>();
 const inside=(x:number,y:number)=>boxes.some(r=>x>r.x-3&&x<r.x+r.width+3&&y>r.y-3&&y<r.y+r.height+3);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)blocked[y*w+x]=x===0||x===w-1||y===0||inside(x*step,y*step)?1:0;
 const ports:Point[]=[[focus[0]-20,focus[1]],[focus[0]+20,focus[1]],[focus[0],focus[1]-19],[focus[0],focus[1]+19]];let head=0,tail=0;
 for(const p of ports){const x=Math.round(p[0]/step),y=Math.round(p[1]/step),i=y*w+x;if(x<1||x>=w-1||y<1||y>=h||blocked[i]||inside(p[0],p[1])||inside((p[0]+x*step)/2,(p[1]+y*step)/2))continue;previous[i]=-1;seed.set(i,p);queue[tail++]=i;}
 const target=70*w+75;
 while(head<tail&&previous[target]===-2){const i=queue[head++];for(const next of [i-1,i+1,i-w,i+w]){if(next<0||next>=total||blocked[next]||previous[next]!==-2)continue;previous[next]=i;queue[tail++]=next;}}
 if(previous[target]===-2)return `M${focus[0]} ${focus[1]+19}V423H450`;
 const points:Point[]=[];let i=target;while(previous[i]!==-1){points.push([i%w*step,Math.floor(i/w)*step]);i=previous[i];}points.push([i%w*step,Math.floor(i/w)*step]);points.push(seed.get(i)!);points.reverse();points.push([450,423]);
 return points.map((p,j)=>`${j?'L':'M'}${p[0]} ${p[1]}`).join('');
}
function Carrier({x,y,small=false}:{x:number;y:number;small?:boolean}){return <g data-bound="carrier" transform={`translate(${x} ${y}) scale(${small?.65:1})`}><path d="M-23 -38C-44 -35 -35 -11 -29 0C-35 15 -41 35 -21 39L-9 27L-13 5L-5 -16Z" fill="#537f97" stroke="#345669" strokeWidth="2"/><path d="M23 -38C44 -35 35 -11 29 0C35 15 41 35 21 39L9 27L13 5L5 -16Z" fill="#91b4c0" stroke="#345669" strokeWidth="2"/><path d="M-22 -28Q-29 -10 -18 0M23 7Q34 28 22 30" stroke="#c9e1df" strokeWidth="4" strokeLinecap="round" fill="none"/><path d="M-4 -36V-12M4 12V36" stroke="#def2ed" strokeWidth="2"/></g>}
function Enzyme({uid}:{uid:string}){return <g data-bound="enzyme"><path d="M-125 -10C-146 -38 -119 -81 -90 -73C-92 -104 -51 -111 -33 -90C-14 -116 29 -102 37 -82C65 -110 110 -89 107 -57C148 -49 144 -11 125 7C147 42 110 75 83 62C70 98 24 99 8 77C-15 108 -62 89 -65 68C-106 87 -134 48 -117 23Z" fill={`url(#${uid}-enzyme)`} stroke="#638e83" strokeWidth="2"/><path d="M-108 -29Q-89 -66 -67 -40T-26 -63M35 -64Q77 -83 90 -44M-97 31Q-70 18 -57 44T-18 48M33 59Q58 79 77 47" stroke="#dcebe1" strokeWidth="7" opacity=".45" fill="none" strokeLinecap="round"/><path d="M-74 -5Q-40 -59 -7 -29T51 -14Q56 17 25 24T-35 18Q-55 29 -74 -5" fill="#30594f" stroke="#a3c5b3" strokeWidth="3"/></g>}

function MapArt({uid}:{uid:string}){return <>
 <defs><radialGradient id={`${uid}-cell`} cx=".3" cy=".2" r=".9"><stop stopColor="var(--cell-hi)"/><stop offset="1" stopColor="var(--cell)"/></radialGradient><linearGradient id={`${uid}-mito`} x2="1" y2=".6"><stop stopColor="#f3d1a5"/><stop offset=".55" stopColor="#c39469"/><stop offset="1" stopColor="#876044"/></linearGradient><radialGradient id={`${uid}-matrix`}><stop stopColor="var(--matrix-hi)"/><stop offset="1" stopColor="var(--matrix)"/></radialGradient></defs>
 <path data-bound="cell" d="M55 46C111 14 163 37 220 26C293 13 422 31 444 76C469 126 444 173 455 223C474 295 442 371 386 385C304 408 239 382 188 392C100 404 39 366 27 306C17 239 34 211 24 156C11 106 21 70 55 46Z" fill={`url(#${uid}-cell)`} stroke="#6f9f95" strokeWidth="3"/>
 <path d="M51 57Q122 23 180 40M294 33Q411 31 438 82" stroke="#e6f4df" strokeWidth="3" fill="none" opacity=".7"/>
 <path data-bound="mitochondrion" d="M66 75C102 44 184 64 213 103L223 307C210 365 123 376 76 348C32 323 45 262 47 220C43 163 32 107 66 75Z" fill={`url(#${uid}-mito)`} stroke="#896146" strokeWidth="2.5"/>
 <path d="M77 87C107 66 174 76 196 111L196 303C192 335 151 352 101 339C58 328 62 276 66 236C64 186 48 113 77 87Z" fill={`url(#${uid}-matrix)`} stroke="#a2714d" strokeWidth="3"/>
 {[106,221,268].map((y,i)=><path key={y} d={`M67 ${y}Q93 ${y-14} ${93+i*5} ${y+4}T70 ${y+28}`} fill="none" stroke="#c2976a" strokeWidth="8" strokeLinecap="round"/>)}
 <path d="M195 204Q170 193 173 221T195 237M193 278Q165 265 169 296T192 311" fill="none" stroke="#ba895c" strokeWidth="8" strokeLinecap="round"/>
 <Label x={121} y={49} className="map-title">מיטוכונדריה</Label><Label x={327} y={59} className="map-title">ציטוזול</Label><Label x={120} y={91}>מטריצה</Label>
 <g fill="none" stroke="var(--route)" strokeWidth="2.5" markerEnd={`url(#${uid}-arrow)`}>
  <path d="M128 128Q146 138 164 158"/><path d="M181 170H260Q302 166 326 148"/><path d="M367 158Q413 202 381 251"/><path d="M357 291Q324 322 276 328"/><path d="M223 328H150Q112 302 128 240"/><path d="M128 235Q135 201 157 185"/>
 </g>
 <g fill="var(--bg)" stroke="var(--line)">{[[120,118],[174,170],[350,139],[371,275],[250,328]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="13"/><Label x={x} y={y+5} className="step-number">{String(i+1)}</Label></g>)}</g>
 <Label x={114} y={147} className="tiny">קרבמויל-פוספט</Label><Label x={276} y={197}>ציטרולין</Label><Label x={352} y={111} className="tiny">ארגינינוסוקצינט</Label><Label x={356} y={313}>ארגינין</Label><Label x={157} y={357}>אורניתין</Label>
 <Carrier x={211} y={170} small/><Carrier x={211} y={328} small/>
 <path data-leader="" d="M263 224L246 224L229 194" fill="none" stroke="var(--muted)" strokeWidth="1.2"/><Label x={335} y={244} className="tiny">נשא אורניתין/ציטרולין</Label>
 <path d="M253 342Q308 372 415 366" fill="none" stroke="#b58a44" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`}/><Label x={357} y={387} className="tiny">שתנן לדם ולכליות</Label>
 <rect data-focus="" x="100" y="99" width="40" height="38" rx="11" fill="none" stroke="#2b8e93" strokeWidth="2"/><path data-anchor="" fill="none" stroke="var(--muted)" strokeWidth="1.2" strokeDasharray="4 4"/>
 <g data-id="map-cargo" data-bound="map-cargo"><circle r="6" fill="#3c9cc0" stroke="#eefaff" strokeWidth="2"/><circle data-id="map-n2" cx="10" r="5" fill="#b18ad8" stroke="#f4effe" opacity="0"/></g>
 <g data-id="map-return" data-bound="return-cargo" opacity="0"><circle cx="-4" r="4" fill="#83918a"/><circle cx="5" r="4" fill="#83918a"/></g>
 </>}

const CSS=`
.ur{--bg:#fbfcf8;--panel:#edf4ee;--ink:#263e48;--muted:#5c7178;--line:#c9dad4;--button:#fff;--cell:#bfdace;--cell-hi:#edf5e5;--matrix:#dfc5a0;--matrix-hi:#fff0d2;--route:#6c9b85;--carbon:#51806c;--oxygen:#ad6860;--n:#829389;--n1:#218db4;--n2:#9465c2;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:22px;overflow:hidden;font:15px/1.65 system-ui,sans-serif;text-align:start;isolation:isolate}
.dark .ur,.ur[data-theme=dark]{--bg:#14252c;--panel:#1c3438;--ink:#e5efed;--muted:#b6cccb;--line:#425f62;--button:#263e44;--cell:#2c5249;--cell-hi:#456b58;--matrix:#6a5038;--matrix-hi:#937854;--route:#93bd9f;--carbon:#a0c7ad;--oxygen:#e3a29a;--n:#a4b5ab;--n1:#60c4e8;--n2:#c69ae9}
@media(prefers-color-scheme:dark){.ur:not([data-theme=light]){--bg:#14252c;--panel:#1c3438;--ink:#e5efed;--muted:#b6cccb;--line:#425f62;--button:#263e44;--cell:#2c5249;--cell-hi:#456b58;--matrix:#6a5038;--matrix-hi:#937854;--route:#93bd9f;--carbon:#a0c7ad;--oxygen:#e3a29a;--n:#a4b5ab;--n1:#60c4e8;--n2:#c69ae9}}
.ur *{box-sizing:border-box}.ur header{padding:20px 24px 12px}.ur h2{font-size:28px;margin:0}.ur .kicker{font-size:12px;color:var(--muted);letter-spacing:.04em}.ur button{font:inherit;min-height:42px;background:var(--button);color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:7px 10px;cursor:pointer}.ur button:focus-visible,.ur input:focus-visible{outline:3px solid #419fa8;outline-offset:3px}.ur nav{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;padding:0 18px 14px}.ur nav button{font-size:12px}.ur button[aria-current=true]{background:#356e5d;color:#fff;border-color:#356e5d}.ur .stage{display:grid;grid-template-columns:1fr 1fr;direction:ltr;gap:12px;padding:0 14px;align-items:start}.ur svg{display:block;width:100%;height:auto;overflow:hidden}.ur svg text{font:16px system-ui,sans-serif;fill:var(--ink);direction:rtl;unicode-bidi:plaintext}.ur .map-title{font-size:18px;font-weight:650}.ur svg .tiny{font-size:14px}.ur .step-number{font-size:15px;font-weight:700}.ur .map-note{direction:rtl;text-align:center;margin:2px 0;font-size:12px;color:var(--muted)}.ur .zoom{border:1px solid var(--line);border-radius:17px;background:var(--panel)}.ur svg .heading{font-size:18px;font-weight:650}.ur svg .atom-letter{font-size:13px;fill:var(--bg);font-weight:700;direction:ltr}.ur svg .metabolite{font-size:18px;font-weight:650}.ur .energy{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;border:1px solid var(--line);background:var(--panel);border-radius:12px;margin:12px 14px 0;padding:10px 14px}.ur .energy b{font-variant-numeric:tabular-nums;font-size:21px}.ur .energy small{color:var(--muted);font-size:12px}.ur .energy i{display:inline-block;width:11px;height:20px;border:1px solid #809d80;background:#abc8a7;border-radius:4px;margin:0 2px}.ur .caption{margin:14px 24px 0;min-height:173px}.ur .caption strong{display:block;font-size:18px}.ur .phase{margin:4px 24px 8px;min-height:26px;color:var(--muted);font-size:13px}.ur .controls{display:flex;align-items:center;gap:10px;padding:8px 24px 14px;flex-wrap:wrap}.ur input[type=range]{direction:ltr;flex:1;min-width:60px;accent-color:#488a72}.ur output{direction:ltr;white-space:nowrap;font-size:12px;font-variant-numeric:tabular-nums}.ur .controls label{display:flex;align-items:center;gap:5px;font-size:13px}.ur .legend{border-top:1px solid var(--line);padding:12px 24px;display:flex;flex-wrap:wrap;gap:8px 18px;font-size:12px}.ur .legend i{display:inline-block;width:11px;height:11px;border-radius:50%;margin-inline-end:5px}.ur .note{font-size:11px;color:var(--muted);padding:0 24px 16px;margin:0}
@media(max-width:600px){.ur .map text,.ur .zoom .tiny{font-size:17px}.ur .map .map-title{font-size:19px}.ur header{padding:14px}.ur h2{font-size:24px}.ur nav{grid-template-columns:repeat(2,minmax(0,1fr));padding:0 12px 10px}.ur nav button:last-child{grid-column:1/-1}.ur .stage{grid-template-columns:1fr;gap:8px;padding:0 9px}.ur .caption{margin:12px 14px 0;min-height:270px;font-size:14px}.ur .caption strong{font-size:17px}.ur .energy{margin:10px 9px 0;gap:6px 10px;font-size:13px}.ur .controls{padding:8px 14px 12px}.ur .phase{margin:5px 14px;min-height:43px}.ur .legend{padding:12px 14px}.ur .note{padding:0 14px 14px}}
`;

export default function UreaScene({lang='he',processName,theme}:Props){
 const root=useRef<HTMLElement>(null),clock=useRef(0),playing=useRef(true),looping=useRef(true),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduced,setReduced]=useState(false);
 const uid='urea'+useId().replace(/[^A-Za-z0-9_-]/g,''),chapter=chapterAt(time);
 useEffect(()=>{
  const host=root.current!,nodes=new Map<string,Element>();host.querySelectorAll('[data-id]').forEach(e=>nodes.set(e.getAttribute('data-id')!,e));
  const attr=(id:string,k:string,v:string|number)=>nodes.get(id)!.setAttribute(k,String(v));
  const text=(id:string,s:string)=>{nodes.get(id)!.textContent=isolate(s)};
  const move=(id:string,p:Point,opacity=1)=>{attr(id,'transform',`translate(${p[0]} ${p[1]})`);attr(id,'opacity',opacity)};
  const media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,visible=true,docVisible=!document.hidden,lastUi=-1;
  function draw(t:number){
   clock.current=t;const f=frame(t),ch=CHAPTERS[f.ci];host.dataset.time=t.toFixed(3);host.dataset.chapter=String(f.ci);
   text('heading',ch.site);text('enzyme-label',ch.enzyme);text('reaction',ch.reaction);text('detail',ch.detail);
   const names=['קרבמויל-פוספט','ציטרולין','ארגינינוסוקצינט','ארגינין + פומרט','שתנן + אורניתין'];
   text('metabolite',f.ci===0&&t<13?'אמוניה + ביקרבונט':f.ci===1&&t<34?'אורניתין + קרבמויל-פוספט':f.ci===2&&t<60?'ציטרולין + אספרטט':f.ci===4&&t<109?'ארגינין + מים':names[f.ci]);
   for(const a of ATOMS){const v=f.atoms[a.id];move('atom-'+a.id,v.p,v.opacity);if(ids(orn).includes(a.id)||['c','n1','co'].includes(a.id))attr('atom-'+a.id,'transform',`translate(${v.p[0]} ${v.p[1]}) scale(${mix(1,.5,f.transportBlend)})`);}
   BONDS.forEach((b,i)=>{const a=f.atoms[b.a],v=f.atoms[b.b],dx=v.p[0]-a.p[0],dy=v.p[1]-a.p[1],len=Math.hypot(dx,dy)||1;const double=b.order===2?1:b.a==='c'&&b.b==='n1'?f.ass*(1-f.arg):b.a==='c'&&b.b==='wo'?f.arg:b.a==='a2'&&b.b==='a3'?f.asl:0,ox=-dy/len*2.6*double,oy=dx/len*2.6*double;attr('bond-'+i,'d',`M${a.p[0]+ox} ${a.p[1]+oy}L${v.p[0]+ox} ${v.p[1]+oy}M${a.p[0]-ox} ${a.p[1]-oy}L${v.p[0]-ox} ${v.p[1]-oy}`);attr('bond-'+i,'opacity',Math.min(a.opacity,v.opacity)*f.bondOpacity(b));});
   attr('enzyme','transform',`translate(252 263) scale(${1+.012*Math.sin(t*1.8)} ${1-.01*Math.sin(t*1.8)})`);
   attr('enzyme','opacity',.3*(1-ramp(t,36,39))+ .3*ramp(t,46,49));
   attr('cps-reg','opacity',1-ramp(t,21,24));attr('transport','opacity',ramp(t,35,38)*(1-ramp(t,46,49)));
   attr('molecular','opacity',1-ramp(t,85,89)*(1-ramp(t,96,99)));
   const travel=ramp(t,38,45);move('transport-orn',[mix(363,114,travel),316]);host.querySelectorAll('[data-id="transport"] text').forEach(e=>e.setAttribute('opacity',String(ramp(t,38,39)*(1-ramp(t,45,46)))));
   attr('gate','transform',`translate(240 265) scale(${1+.09*Math.sin(travel*Math.PI)})`);
   attr('shunt','opacity',ramp(t,85,89)*(1-ramp(t,96,100)));host.querySelectorAll('[data-id="shunt"] text').forEach(e=>e.setAttribute('opacity',String(ramp(t,89,90)*(1-ramp(t,95,96)))));
   const st=ramp(t,86,96),pts:Point[]=[[392,179],[354,268],[252,331],[132,268],[173,178]],seg=Math.min(3,Math.floor(st*4));move('shunt-dot',lerp(pts[seg],pts[seg+1],st*4-seg));
   text('phase',t<23?'הפעלת CPS I · קיבוע החנקן הראשון':t<36?'קבוצת הקרבמויל נקשרת לאורניתין':t<49?'החלפה בנשא · ציטרולין החוצה, אורניתין פנימה':t<73?'חנקן מאספרטט מצטרף · שני קשרים נוספים':t<86?'שלד אספרטט יוצא; החנקן נשאר':t<99?'מעקף אספרטט–ארגינינוסוקצינט מחבר למעגל קרבס':t<112?'מים מפרידים שתנן ואורניתין': 'שתנן יוצא לדם · אורניתין חוזר דרך הנשא');
   text('energy',`${Math.round(f.energy)} / 4`);text('atp',`${Math.round(f.atp)} ATP`);for(let i=0;i<4;i++)attr('energy-'+i,'opacity',.16+.84*clamp(f.energy-i));
   const focus=host.querySelector('[data-focus]')!,anchor=host.querySelector('[data-anchor]')!;focus.setAttribute('x',String(f.focus[0]-20));focus.setAttribute('y',String(f.focus[1]-19));anchor.setAttribute('d',anchorRoute(f.focus,[...host.querySelectorAll<SVGTextElement>('.map text')].map(e=>e.getBBox())));
   move('map-cargo',f.cargo,1-f.out);attr('map-n2','opacity',f.ass);move('map-return',f.returnCargo,ramp(t,110,113));move('map-urea',lerp([250,328],[433,367],f.out),ramp(t,109,112));
   if(Math.abs(t-lastUi)>.12||t===0||t===DURATION){setTime(t);lastUi=t;}
  }
  function tick(now:number){if(last&&playing.current&&!media.matches&&visible&&docVisible){let next=clock.current+Math.min(.05,(now-last)/1000);if(next>=DURATION){if(looping.current)next%=DURATION;else {next=DURATION;playing.current=false;setRunning(false);}}draw(next);}last=now;raf=requestAnimationFrame(tick);}
  const motion=()=>{setReduced(media.matches);if(media.matches){playing.current=false;setRunning(false);draw(CHAPTERS[chapterAt(clock.current)].still);}last=0;};
  const visibility=()=>{docVisible=!document.hidden;last=0;};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;host.dataset.offscreen=String(!visible);last=0;});observer.observe(host);
  seek.current=t=>{draw(Math.max(0,Math.min(DURATION,t)));setTime(clock.current);last=0;};
  draw(0);motion();media.addEventListener('change',motion);document.addEventListener('visibilitychange',visibility);raf=requestAnimationFrame(tick);
  return ()=>{cancelAnimationFrame(raf);observer.disconnect();media.removeEventListener('change',motion);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 function jump(t:number){seek.current(t)}
 function toggle(){if(reduced)return;if(clock.current>=DURATION)jump(0);playing.current=!playing.current;setRunning(playing.current)}
 return <section ref={root} className="ur" dir="rtl" data-theme={theme} data-lang={lang} aria-label={processName||'מעגל השתנן — סרט רציף'}>
  <style>{CSS}</style><header><div className="kicker">תא כבד · שני חנקנים, מסלול אחד</div><h2>{processName||'מעגל השתנן'}</h2></header>
  <nav aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduced?c.still:c.start)}>{isolate(c.name)}</button>)}</nav>
  <div className="stage"><div><svg className="map" viewBox="0 0 480 434" role="img" aria-label="מפת תא כבד: טבעת המעגל חוצה את הממברנה הפנימית באמצעות נשא"><defs><marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="var(--route)"/></marker></defs><MapArt uid={uid}/><g data-id="map-urea" data-bound="urea-cargo" opacity="0"><circle cx="-5" r="5" fill="var(--n1)"/><circle cx="5" r="5" fill="var(--n2)"/></g></svg><p className="map-note">המסגרת עוקבת אחרי אתר התגובה שבתקריב</p></div>
  <svg className="zoom" viewBox="0 0 480 486" role="img" aria-label="תקריב מולקולרי רציף של התגובה הפעילה"><defs><radialGradient id={`${uid}-enzyme`} cx=".3" cy=".2"><stop stopColor="#d1e2bd"/><stop offset=".55" stopColor="#8eb49a"/><stop offset="1" stopColor="#537e74"/></radialGradient></defs>
   <Label x={240} y={32} className="heading" data-id="heading">מטריצה · התחלת המסלול</Label>
   <rect x="153" y="45" width="174" height="36" rx="17" fill="var(--bg)" stroke="var(--line)"/>
   <Label x={240} y={69} data-id="enzyme-label">CPS I</Label><path data-leader="" d="M150 64H20V180H148" stroke="var(--muted)" strokeWidth="1.3" fill="none"/><circle cx="148" cy="180" r="3" fill="var(--muted)"/>
   <g data-id="enzyme" transform="translate(252 263)" opacity=".3"><Enzyme uid={uid}/></g>
   <g data-id="cps-reg"><rect x="34" y="91" width="240" height="35" rx="12" fill="var(--bg)" stroke="#8fa879"/><Label x={154} y={114} className="tiny">מפעיל: N-acetylglutamate</Label><path d="M154 128V144L176 156" stroke="#7a9b64" strokeWidth="1.5" fill="none"/><Label x={133} y={164} className="tiny">בקרה דרך NAGS</Label></g>
   <g data-id="transport" opacity="0"><rect x="32" y="175" width="416" height="204" rx="15" fill="var(--panel)" stroke="var(--line)"/><rect x="36" y="180" width="199" height="194" rx="12" fill="var(--matrix)" opacity=".5"/><Label x={123} y={202}>מטריצה</Label><Label x={361} y={202}>ציטוזול</Label>
    {[221,258].map(x=><g key={x}>{Array.from({length:12},(_,i)=><g key={i}><path d={`M${x} ${215+i*13}h${x===221?13:-13}`} stroke="#bba779" strokeWidth="2"/><circle cx={x} cy={215+i*13} r="3.6" fill="#ddc891" stroke="#9b8c68" strokeWidth=".8"/></g>)}</g>)}
    <g data-id="gate"><Carrier x={0} y={0}/></g>
    <path d="M73 246H400M400 316H73" stroke="var(--route)" strokeWidth="2" strokeDasharray="4 5"/>
    <g data-id="transport-orn" data-bound="transport-cargo"><path d="M-24 0L-12 -8L0 0L12 -8L24 0" stroke="var(--carbon)" strokeWidth="2.5" fill="none"/><circle cx="26" cy="1" r="4" fill="var(--n)"/></g>
    <Label x={358} y={275}>ציטרולין יוצא</Label><Label x={119} y={350}>אורניתין נכנס</Label>
   </g>
   <g data-id="molecular">
    {BONDS.map((_,i)=><path key={i} data-id={'bond-'+i} data-bond={i} fill="none" stroke="var(--carbon)" strokeWidth="2.2" strokeLinecap="round"/>)}
    {ATOMS.map(a=><g key={a.id} data-id={'atom-'+a.id} data-atom={a.id} data-element={a.element} data-bound="atom" transform={`translate(${a.p[0]} ${a.p[1]})`}><circle r={a.element==='C'?5:11} fill={a.id==='n1'?'var(--n1)':a.id==='n2'?'var(--n2)':a.element==='N'?'var(--n)':a.element==='O'?'var(--oxygen)':a.element==='P'?'#b79856':'var(--carbon)'} stroke="var(--bg)" strokeWidth="1.5"/>{a.element!=='C'&&<Label x={0} y={4.5} className="atom-letter">{a.element}</Label>}</g>)}
   </g>
   <g data-id="shunt" opacity="0"><rect x="23" y="174" width="434" height="222" rx="15" fill="var(--panel)" stroke="var(--line)"/>
    <Label x={240} y={200} className="heading">מעקף אספרטט–ארגינינוסוקצינט</Label>
    <path d="M391 230Q400 280 327 301M290 320Q218 349 162 303M133 279Q115 230 173 229" stroke="var(--route)" strokeWidth="2.5" fill="none"/>
    <Label x={377} y={227}>פומרט</Label><Label x={343} y={291}>מלאט</Label><Label x={223} y={349}>אוקסלואצטט</Label><Label x={100} y={284}>אספרטט</Label><Label x={189} y={232}>ל־ASS</Label>
    <ellipse cx="232" cy="275" rx="83" ry="44" fill={`url(#${uid}-matrix)`} stroke="#a78665" strokeWidth="3"/><path d="M162 264Q178 250 176 267T164 289M304 258Q284 253 290 267T307 287" stroke="#b99b70" strokeWidth="5" fill="none"/>
    <path d="M221 251A17 17 0 1 1 219 280" stroke="var(--route)" strokeWidth="2.5" fill="none"/><path d="M215 274L220 281L226 276" stroke="var(--route)" strokeWidth="2" fill="none"/>
    <g transform="translate(315 275) scale(.3)"><Carrier x={0} y={0}/></g><Label x={241} y={304} className="tiny">מעגל קרבס</Label>
    <Label x={239} y={380} className="tiny">חנקן חדש לאספרטט מגיע מגלוטמט</Label><circle data-id="shunt-dot" r="5" fill="#c5a15d"/>
   </g>
   <Label x={240} y={430} data-id="metabolite" className="metabolite">אמוניה + ביקרבונט</Label><Label x={240} y={455} data-id="reaction" className="tiny"/><Label x={240} y={478} data-id="detail" className="tiny"/>
  </svg></div>
  <div className="energy" aria-label="עלות ישירה מצטברת לשתנן אחד"><small>קשרי פוספט עתירי אנרגיה</small><b data-id="energy">{isolate('0 / 4')}</b><span>{[0,1,2,3].map(i=><i key={i} data-id={'energy-'+i} style={{opacity:.16}}/>)}</span><span data-id="atp">{isolate('0 ATP')}</span><small>לשתנן אחד</small></div>
  <p className="caption" aria-live="polite" aria-atomic="true"><strong>{isolate(CHAPTERS[chapter].name)}</strong>{isolate(CHAPTERS[chapter].text)}</p><p className="phase" data-id="phase"/>
  <div className="controls"><button onClick={toggle} disabled={reduced} aria-label={running?'השהיה':'ניגון'}>{running&&!reduced?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step="0.01" value={time} onChange={e=>jump(Number(e.target.value))}/><output>{isolate(`${Math.floor(time)} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>לולאה</label>{reduced&&<small>תנועה מופחתת · תמונות מפתח לפי פרק</small>}</div>
  <div className="legend"><span><i style={{background:'var(--n1)'}}/>{isolate('חנקן מ־NH₄⁺')}</span><span><i style={{background:'var(--n2)'}}/>חנקן מאספרטט</span><span><i style={{background:'var(--n)'}}/>חנקני האורניתין</span><span><i style={{background:'var(--carbon)'}}/>פחמן בשלד</span></div>
  <p className="note">{isolate('איור מקורי וסכמטי; אטומי מימן ומצבי יינון הושמטו. תנועות אינן קינטיקה מדודה. חילוף הנשאים מוצג בשני רגעים של אותו מעגל. מקורות: Lehninger 8e פרק 18; Berg/Stryer 10e פרק 23.')}</p>
 </section>;
}
