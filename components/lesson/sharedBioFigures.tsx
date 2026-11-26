/* Original textbook-informed drawings. Sources, equations and verification are in
   visual-lab/shared-gaps-b/. No textbook artwork is embedded in this component. */
import type React from "react";
import { BLUE, GREEN, INK, MUTED, ORANGE } from "./biochemFigures";

const TEAL = "#0f766e", PURPLE = "#7c3aed", RED = "#b91c1c", GOLD = "#a16207";
const PAPER = "#fbfcfe";
type Tx = { x:number; y:number; children:string|number; size?:number; color?:string; bold?:boolean; anchor?:"start"|"middle"|"end" };
// RLM + LRM, not bidi isolates: Safari ignores isolates in SVG text.
function bidi(s:string) { return "\u200f"+s.replace(/[\u200e\u200f\u2066-\u2069]/g, "").replace(/[A-Za-z][A-Za-z0-9₀-₉²³⁺⁻*]*(?:[ /+−=×().-]*[A-Za-z0-9₀-₉²³⁺⁻*]+)*/g, m=>"\u200e"+m+"\u200e"); }
function He({x,y,children,size=17,color=INK,bold,anchor="middle"}:Tx) { return <text x={x} y={y} fontSize={size} textAnchor={anchor} direction="rtl" fill={color} fontWeight={bold?700:400} style={{fontFamily:"var(--font-hebrew), Arial, sans-serif"}}>{bidi(String(children))}</text>; }
function La({x,y,children,size=17,color=INK,bold,anchor="middle"}:Tx) { return <text x={x} y={y} fontSize={size} textAnchor={anchor} direction="ltr" fill={color} fontWeight={bold?700:400} style={{fontFamily:"Arial, sans-serif"}}>{"\u200e"+children+"\u200e"}</text>; }
function Stroke({d,color=INK,width=2,dash=false}:{d:string;color?:string;width?:number;dash?:boolean}) {return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash?"6 6":undefined}/>;}
function Arrow({d,x,y,a=0,color=INK,width=2.5}:{d:string;x:number;y:number;a?:number;color?:string;width?:number}) {return <g><Stroke d={d} color={color} width={width}/><path d="M-9 -4 L0 0 L-9 4Z" transform={`translate(${x} ${y}) rotate(${a})`} fill={color}/></g>;}
function Defs({id}:{id:string}) {return <defs>{[["green","#f0f9db","#a7c889"],["blue","#eff8ff","#9dc7df"],["pink","#ffece6","#db9c90"],["gold","#fff6dc","#d8b97c"],["purple","#f5eeff","#bca3db"],["red","#fee2e2","#dc8484"]].map(([name,a,b])=><linearGradient key={name} id={`${id}-${name}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={a}/><stop offset=".5" stopColor={a}/><stop offset="1" stopColor={b}/></linearGradient>)}</defs>;}
function Svg({id,w=760,h,title,children}:{id:string;w?:number;h:number;title:string;children:React.ReactNode}) {return <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title} style={{display:"block",width:"100%",height:"auto",background:PAPER,borderRadius:12}}><title>{title}</title><Defs id={id}/>{children}</svg>;}
const css = `.sbg{color:${INK};width:100%;min-width:0;background:${PAPER};border-radius:12px}.sbg .sbg-mobile{display:none}.sbg-legend{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 18px;padding:10px 14px 16px;margin:0;list-style:none;font:14px/1.65 Arial,sans-serif;direction:rtl;color:${INK}}.sbg-legend b{display:inline-flex;justify-content:center;align-items:center;width:22px;height:22px;border-radius:50%;background:#e2e8f0;margin-inline-end:5px;color:${INK}}@media(max-width:600px){.sbg .sbg-desktop{display:none}.sbg .sbg-mobile{display:block}}`;
function Responsive({draw}:{draw:(mobile:boolean)=>React.ReactNode}) {return <div className="sbg"><style>{css}</style><div className="sbg-desktop">{draw(false)}</div><div className="sbg-mobile">{draw(true)}</div></div>;}
type Label={text:string;x:number;y:number;to?:[number,number];route?:[number,number][];lines?:string[];color?:string};
function Labels({labels,mobile}:{labels:Label[];mobile:boolean}) {return <>{labels.map(l=>l.to&&<Stroke key={l.text} d={`M${l.x} ${l.to[1]<l.y?l.y-(mobile?29:22):l.y+(mobile?13:9)+(mobile?0:((l.lines?.length??1)-1)*23)} ${(l.route??[]).map(([x,y])=>`L${x} ${y}`).join(" ")} L${l.to[0]} ${l.to[1]}`} color={MUTED} width={1.2}/>)}{labels.map((l,i)=><g key={l.text}>{mobile?<g><circle cx={l.x} cy={l.y-8} r={18} fill={PAPER} stroke={l.color??MUTED} strokeWidth={1.5}/><La x={l.x} y={l.y+2} size={28} bold color={l.color}>{i+1}</La></g>:(l.lines??[l.text]).map((t,j)=><He key={t} x={l.x} y={l.y+j*23} color={l.color} bold>{t}</He>)}</g>)}</>;}
function Anatomy({id,h,title,labels,draw}:{id:string;h:number;title:string;labels:Label[];draw:(mobile:boolean)=>React.ReactNode}) {return <Responsive draw={mobile=><><Svg id={id+(mobile?"m":"d")} h={h} title={title}>{draw(mobile)}<Labels labels={labels} mobile={mobile}/></Svg>{mobile&&<ol className="sbg-legend">{labels.map((l,i)=><li key={l.text}><b>{i+1}</b>{l.text}</li>)}</ol>}</>}/>;}
function Heading({w,title,sub}:{w:number;title:string;sub?:string}) {return <><He x={w/2} y={31} size={23} bold>{title}</He>{sub&&<He x={w/2} y={60} size={16} color={MUTED}>{sub}</He>}</>;}
type Plot = {x:number;y:number;w:number;h:number;xmax:number;ymax:number;xmin?:number;ymin?:number};
function coords(p:Plot) {return {x:(v:number)=>p.x+(v-(p.xmin??0))/(p.xmax-(p.xmin??0))*p.w,y:(v:number)=>p.y+p.h-(v-(p.ymin??0))/(p.ymax-(p.ymin??0))*p.h};}
function line(points:number[][],p:Plot) {const s=coords(p);return points.map(([x,y],i)=>`${i?"L":"M"}${s.x(x).toFixed(2)} ${s.y(y).toFixed(2)}`).join(" ");}
function Axis({p,xt,yt,xlabel,ylabel}:{p:Plot;xt:number[];yt:number[];xlabel:string;ylabel:string}) {const s=coords(p);return <g><He x={p.x+p.w/2} y={p.y-18} size={17} color={MUTED}>{ylabel}</He>{yt.map(v=><g key={v}><Stroke d={`M${p.x} ${s.y(v)} H${p.x+p.w}`} color="#e2e8f0" width={1}/><La x={p.x-15} y={s.y(v)+6} anchor="end" size={16}>{v}</La></g>)}<Stroke d={`M${p.x} ${p.y} V${p.y+p.h} H${p.x+p.w}`} color={MUTED} width={1.6}/>{xt.map(v=><g key={v}><Stroke d={`M${s.x(v)} ${p.y+p.h} v6`} color={MUTED} width={1}/><La x={s.x(v)} y={p.y+p.h+26} size={16}>{v}</La></g>)}<He x={p.x+p.w/2} y={p.y+p.h+55} size={17}>{xlabel}</He></g>;}
function rng(seed:number) {let n=seed;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}

function Bateman() {return <Responsive draw={mobile=>{const w=mobile?420:760,p={x:60,y:118,w:w-91,h:270,xmax:5.35,ymax:100},s=coords(p),rand=rng(1948);const male=(x:number)=>17*x, female=(x:number)=>x<1?28*x:28+1.25*(x-1);return <Svg id={`bat${mobile}`} w={w} h={495} title="מדרגי בייטמן: הצלחת רבייה ומספר בני זוג"><Heading w={w} title="התועלת מהזדווגות נוספת"/><He x={w/2} y={63} color={MUTED} size={16}>נקודות וקווים מחושבים להמחשה</He><Axis p={p} xt={[0,1,2,3,4,5]} yt={[0,20,40,60,80,100]} xlabel="מספר בני זוג" ylabel="מספר צאצאים"/>{[BLUE,ORANGE].map((c,j)=><g key={c}>{Array.from({length:36},(_,i)=>{const m=i%6,x=m+(rand()-.5)*.24,y=m===0?0:Math.max(0,(j?female:male)(m)+(rand()-.5)*(j?9:19));return <circle key={i} cx={s.x(Math.max(0,x))} cy={s.y(y)} r={3.6} fill={c} fillOpacity={.65}/>;})}<Stroke d={line(Array.from({length:101},(_,i)=>{const x=i/20;return [x,(j?female:male)(x)];}),p)} color={c} width={3}/></g>)}<He x={w/2-65} y={477} color={BLUE} bold>זכרים</He><He x={w/2+65} y={477} color={ORANGE} bold>נקבות</He></Svg>;}}/>;}

const F2=[1,6,15,20,15,6,1];
function NilssonEhle() {return <Responsive draw={mobile=>{const w=mobile?420:760,p={x:59,y:142,w:w-87,h:245,xmin:-.65,xmax:6.65,ymax:24},s=coords(p);const colors=["#ffffff","#fee2e2","#fca5a5","#ef7777","#cf4444","#a82424","#6f1515"];const smooth=Array.from({length:241},(_,i)=>{const x=-.6+i*7.2/240;return [x,F2.reduce((a,n,k)=>a+n*Math.exp(-.5*((x-k)/.56)**2)/(.56*Math.sqrt(2*Math.PI)),0)];});return <Svg id={`f2${mobile}`} w={w} h={505} title="התפלגות אללים אדיטיביים בדור F2"><Heading w={w} title="משבע מחלקות לרצף"/><La x={w/2} y={65} size={19}>AaBbCc × AaBbCc → F2</La><He x={w/2} y={94} size={16} color={MUTED}>עמודות: מספר מתוך 64 · קו: סביבה מטשטשת</He><Axis p={p} xt={[0,1,2,3,4,5,6]} yt={[0,5,10,15,20]} xlabel={'מספר אללי "+"'} ylabel="שכיחות מתוך 64"/>{F2.map((n,k)=><g key={k}><rect x={s.x(k)-p.w/7.3*.37} y={s.y(n)} width={p.w/7.3*.74} height={s.y(0)-s.y(n)} fill={colors[k]} stroke="#993434" strokeWidth={1.2}/><La x={s.x(k)} y={s.y(n)-24} size={16} bold>{n}</La></g>)}<Stroke d={line(smooth,p)} color={PURPLE} width={2.8}/><La x={w/2} y={477} color={RED} size={18}>1 : 6 : 15 : 20 : 15 : 6 : 1</La></Svg>;}}/>;}

function regressionData() {const r=rng(1909),n=70,x=Array.from({length:n},(_,i)=>-2.6+5.2*i/(n-1)),e=x.map(()=>r()+r()+r()-1.5),mean=e.reduce((a,b)=>a+b,0)/n;const slope=x.reduce((a,v,i)=>a+v*(e[i]-mean),0)/x.reduce((a,v)=>a+v*v,0);return x.map((v,i)=>[v,.6*v+1.1*(e[i]-mean-slope*v)]);}
function Midparent() {return <Responsive draw={mobile=>{const w=mobile?420:760,p={x:63,y:130,w:w-95,h:270,xmin:-3,xmax:3,ymin:-3,ymax:3},s=coords(p);return <Svg id={`reg${mobile}`} w={w} h={535} title="רגרסיית ממוצע הצאצאים על ממוצע ההורים"><Heading w={w} title="דמיון בין דורות"/><La x={w/2} y={64} color={TEAL} size={21} bold>h² = 0.60</La><Axis p={p} xt={[-3,-2,-1,0,1,2,3]} yt={[-3,-2,-1,0,1,2,3]} xlabel="ממוצע ההורים · סטייה מהממוצע" ylabel="ממוצע הצאצאים · סטייה מהממוצע"/><Stroke d={line([[-2.8,-2.8],[2.8,2.8]],p)} color="#94a3b8" dash/><Stroke d={line([[-2.8,0],[2.8,0]],p)} color="#94a3b8" dash/>{regressionData().map(([x,y],i)=><circle key={i} cx={s.x(x)} cy={s.y(y)} r={3.7} fill={TEAL} fillOpacity={.58}/>)}<Stroke d={line([[-2.9,-1.74],[2.9,1.74]],p)} color={TEAL} width={3}/><He x={w/2} y={487} size={16} color={MUTED}>מקווקו: שיפוע 1 ושיפוע 0</He><He x={w/2} y={514} size={16} color={TEAL}>הקו הצבעוני: שיפוע הרגרסיה</He></Svg>;}}/>;}

function RootUptake() {
 const labels:Label[]=[{text:"שערת שורש ואפידרמיס",x:125,y:62,to:[148,192]},{text:"קליפה",x:320,y:62,to:[306,190]},{text:"אנדודרמיס",x:475,y:62,to:[475,180]},{text:"פריציקל",x:615,y:62,to:[582,175]},{text:"עצה",x:702,y:350,to:[678,260]},{text:"אפופלסט: דרך הדפנות",x:143,y:355,to:[298,237],color:ORANGE},{text:"סימפלסט: פלזמודסמטות",x:235,y:409,to:[326,258],color:TEAL},{text:"רצועת קספרי · ליגנין",x:583,y:369,to:[474,232],color:RED},{text:"חציית ממברנה בררנית",x:552,y:409,to:[438,247],route:[[450,370]],color:BLUE}];
 return <Anatomy id="root" h={620} title="מסלולי קליטת יונים בחתך מגזר של שורש" labels={labels} draw={mobile=>{const id="root"+(mobile?"m":"d");return <>
 <path d="M44 132 L635 113 Q707 191 716 293 L113 329Z" fill="#f7efe1"/>
 {[0,1,2].map(row=><g key={row}>{[150,238,326,423,535].map((x,i)=>{const y=140+row*54-i*4,cw=i===3?89:78;return <g key={x}>
 <path d={`M${x+7} ${y} l${cw-14} -4 q8 -1 9 7 l5 30 q1 8 -7 9 l-${cw-14} 6 q-7 1 -8 -7 l-5 -32 q-1 -8 6 -9Z`} fill={`url(#${id}-${i===3?"gold":"green"})`} stroke="#a9ac85" strokeWidth={3}/>
 <path d={`M${x+12} ${y+7} l${cw-23} -4 q5 0 6 6 l4 23 q1 4 -4 5 l-${cw-22} 5 q-5 1 -6 -4 l-4 -24 q-1 -6 4 -7Z`} fill="#f2f8e9" stroke="#7fa577" strokeWidth={1.1}/>
 {row===0&&<path d={`M${x+22} ${y+13} q20 -8 ${cw-34} -4 l4 16 q-15 10 -${cw-33} 5Z`} fill={`url(#${id}-blue)`} stroke="#b2cfda" strokeWidth={.9}/>}
 <ellipse cx={x+cw-11} cy={y+30} rx={4.5} ry={5.5} fill={`url(#${id}-purple)`} stroke="#a28db8" strokeWidth={.7}/>
 </g>;})}</g>)}
 <path d="M151 214 C106 213 106 177 55 186 C23 191 26 214 58 206 C102 196 101 235 152 237" fill={`url(#${id}-green)`} stroke="#8ba473" strokeWidth={3}/>
 <path d="M155 222 C111 221 106 193 61 196" fill="none" stroke="#719567" strokeWidth={1}/>
 {[178,232,286].map(y=><path key={y} d={`M462 ${y-4} l20 -2 l2 9 l-20 2Z`} fill={RED}/>)}
 {[238,326,423,535].map((x,i)=><g key={x}>{[208,262].map(y=><g key={y}><path d={`M${x-5} ${y-i*4} h20 m-20 5 h20`} stroke={TEAL} strokeWidth={2}/></g>)}</g>)}
 <path d="M627 152 Q686 156 688 194 L708 282 Q674 304 642 287Z" fill={`url(#${id}-blue)`} stroke="#6694b0" strokeWidth={3}/>
 {[169,193,219,245,270].map(y=><path key={y} d={`M${631+(y-169)*.15} ${y} q28 15 61 0`} fill="none" stroke="#8db7ce" strokeWidth={3}/>) }
 <Arrow d="M59 218 Q104 230 150 244 L238 240 L326 236 L423 232 L457 230" x={457} y={230} a={-4} color={ORANGE}/><Stroke d="M458 222 l9 15 m-10 1 l11 -17" color={RED} width={3}/>
 <Arrow d="M94 200 Q128 208 166 222 L210 265 L238 264 L326 260 L423 256 L508 252 L578 246 L651 238" x={651} y={238} a={-6} color={TEAL}/>
 <Arrow d="M423 232 C430 238 430 253 447 255" x={447} y={255} a={7} color={BLUE}/>
 <rect x={40} y={456} width={680} height={144} rx={15} fill="#eef5fa"/>
 <He x={380} y={mobile?490:485} size={mobile?29:19} bold>מפל פרוטונים מניע קליטת יונים</He>
 <path d="M75 527 H685 M75 547 H685" stroke="#d3bc8a" strokeWidth={5}/>
 <path d="M217 520 Q230 507 246 520 L246 551 Q231 566 217 551Z" fill={`url(#${id}-purple)`} stroke={PURPLE} strokeWidth={1.5}/>
 <path d="M493 520 Q509 510 524 520 L524 551 Q509 562 493 551Z" fill={`url(#${id}-blue)`} stroke={BLUE} strokeWidth={1.5}/>
 <Arrow d="M231 571 V503" x={231} y={503} a={-90} color={PURPLE}/><Arrow d="M508 502 V572" x={508} y={572} a={90} color={BLUE}/>
 <La x={125} y={583} size={mobile?28:17} color={PURPLE}>H⁺-ATPase</La><La x={357} y={580} size={mobile?28:17}>ATP → ADP + Pi</La><La x={597} y={582} size={mobile?28:17} color={BLUE}>H⁺ + NO₃⁻</La>
 </>;}}/>;
}

function PressureFlow() {
 const labels:Label[]=[{text:"מקור · עלה בוגר",x:109,y:44,to:[110,102],color:GREEN},{text:"שיפה · צינור מנופה",x:342,y:44,to:[365,105],color:TEAL},{text:"עצה",x:562,y:44,to:[562,100],color:BLUE},{text:"טעינת סוכרוז",x:112,y:237,to:[220,174],color:ORANGE},{text:"תא לוואי",x:263,y:311,to:[282,229]},{text:"מים נכנסים · לחץ גבוה",x:669,y:231,to:[471,139],lines:["מים נכנסים","לחץ גבוה"],color:BLUE},{text:"זרימה המונית",x:130,y:372,to:[350,345],color:TEAL},{text:"פריקה לבור",x:135,y:514,to:[220,445],color:ORANGE},{text:"מים יוצאים · לחץ נמוך",x:570,y:514,to:[475,445],color:BLUE}];
 return <Anatomy id="pressure" h={620} title="מודל זרימת הלחץ ממקור לבור ומעגל המים בעצה" labels={labels} draw={mobile=>{const id="pressure"+(mobile?"m":"d");return <>
 <path d="M70 153 Q49 81 169 89 Q193 145 98 169Z" fill={`url(#${id}-green)`} stroke={GREEN} strokeWidth={2}/><Stroke d="M73 159 Q124 126 160 103 M113 135 l-17 -24 M135 121 l24 10" color="#79a56b" width={1.2}/>
 <path d="M80 423 C73 404 147 402 165 429 C188 468 145 487 113 474 C84 463 73 451 80 423Z" fill={`url(#${id}-gold)`} stroke={GOLD} strokeWidth={2}/>
 <rect x={330} y={94} width={86} height={392} rx={20} fill={`url(#${id}-green)`} stroke={TEAL} strokeWidth={3}/>
 {[251,362].map(y=><g key={y}><path d={`M331 ${y} h84`} stroke={TEAL} strokeWidth={7}/>{[341,356,371,386,401].map(x=><circle key={x} cx={x} cy={y} r={3.4} fill={PAPER}/>)}</g>)}
 <rect x={263} y={129} width={52} height={119} rx={18} fill={`url(#${id}-purple)`} stroke="#a489bc" strokeWidth={2}/><ellipse cx={288} cy={207} rx={12} ry={18} fill="#ba99d5"/>
 <rect x={532} y={91} width={62} height={397} rx={7} fill={`url(#${id}-blue)`} stroke="#6a9ebc" strokeWidth={2.5}/>{Array.from({length:13},(_,i)=><Stroke key={i} d={`M534 ${112+i*28} q28 12 58 0`} color="#9bbfd2" width={2}/>) }
 <Arrow d="M178 154 H253" x={253} y={154} color={ORANGE}/><Arrow d="M302 164 H354" x={354} y={164} color={ORANGE}/>
 <Arrow d="M416 441 H464" x={464} y={441} color={ORANGE}/><Arrow d="M317 449 H178" x={178} y={449} a={180} color={ORANGE}/>
 <Arrow d="M526 139 Q472 114 424 139" x={424} y={139} a={155} color={BLUE} width={3}/><Arrow d="M424 467 Q476 490 525 467" x={525} y={467} a={-25} color={BLUE} width={3}/>
 <Arrow d="M564 411 V204" x={564} y={204} a={-90} color={BLUE} width={4}/><Arrow d="M373 273 V339" x={373} y={339} a={90} color={TEAL} width={5}/>
 {Array.from({length:24},(_,i)=><circle key={i} cx={343+(i%4)*18} cy={111+Math.floor(i/4)*20} r={3.5} fill={ORANGE} fillOpacity={.8}/>)}{Array.from({length:7},(_,i)=><circle key={i} cx={345+(i%3)*24} cy={394+Math.floor(i/3)*29} r={3.5} fill={ORANGE}/>)}
 <rect x={42} y={549} width={676} height={55} rx={12} fill="#f1f5f9"/><He x={380} y={584} size={mobile?28:18} bold>הפרש הלחצים דוחף מים וסוכר יחד</He>
 </>;}}/>;
}

function Alternation() {return <Responsive draw={mobile=>{const w=mobile?440:760,h=mobile?765:638,id="alt"+(mobile?"m":"d");const cy=mobile?263:239,cx=w/2,rx=mobile?145:256,ry=135;
 const node=(angle:number)=>[cx+rx*Math.cos(angle*Math.PI/180),cy+ry*Math.sin(angle*Math.PI/180)];
 const ns=[{a:-150,t:"גמטופיט",p:"n",c:TEAL},{a:-90,t:"גמטות",p:"n",c:TEAL},{a:-30,t:"זיגוטה",p:"2n",c:ORANGE},{a:30,t:"ספורופיט",p:"2n",c:ORANGE},{a:90,t:"נבגייה",p:"2n",c:ORANGE},{a:150,t:"נבגים",p:"n",c:TEAL}];
 return <Svg id={id} w={w} h={h} title="חילוף דורות והשתנות הדור הדומיננטי בצמחים"><Heading w={w} title="שני דורות רב־תאיים"/>
 <path d={`M${cx} ${cy-ry-28} A${rx+28} ${ry+28} 0 0 0 ${cx} ${cy+ry+28}`} fill="none" stroke="#d1eee7" strokeWidth={40}/><path d={`M${cx} ${cy-ry-28} A${rx+28} ${ry+28} 0 0 1 ${cx} ${cy+ry+28}`} fill="none" stroke="#fbe4d2" strokeWidth={40}/>
 {ns.map((n,i)=>{const [x,y]=node(n.a),[nx,ny]=node(ns[(i+1)%6].a),dx=nx-x,dy=ny-y,dist=Math.hypot(dx,dy);return <g key={n.t}><Arrow d={`M${x+dx/dist*38} ${y+dy/dist*34} L${nx-dx/dist*43} ${ny-dy/dist*33}`} x={nx-dx/dist*43} y={ny-dy/dist*33} a={Math.atan2(dy,dx)*180/Math.PI} color={n.c}/><ellipse cx={x} cy={y} rx={mobile?42:64} ry={32} fill={`url(#${id}-${n.c===TEAL?"green":"gold"})`} stroke={n.c} strokeWidth={1.5}/><He x={x} y={y-3} size={mobile?16:18} bold>{n.t}</He><La x={x} y={y+20} size={18} color={n.c} bold>{n.p}</La></g>;})}
 <He x={cx} y={cy-18} size={19} color={TEAL} bold>מיטוזה: גמטות</He><He x={cx} y={cy+11} size={19} color={ORANGE} bold>מיוזה: נבגים</He><He x={cx} y={cy+44} size={16} color={MUTED}>מיטוזה: גדילת שני הדורות</He>
 <He x={cx+rx*.58} y={cy-ry+15} size={17} color={ORANGE} bold>הפריה</He><He x={cx-rx*.55} y={cy+ry+1} size={17} color={TEAL} bold>מיוזה</He>
 <g transform={`translate(${mobile?8:28} ${mobile?479:438})`}><He x={(w-(mobile?16:56))/2} y={-10} size={18} bold>איזה דור דומיננטי?</He>{["טחב","שרך","צמח זרע"].map((t,i)=>{const col=(w-(mobile?16:56))/3,x=i*col;return <g key={t}><rect x={x+4} y={5} width={col-8} height={mobile?220:170} rx={10} fill="#f0f4f5"/><He x={x+col/2} y={28} size={17} bold>{t}</He>
 <g transform={`translate(${x+col/2} 52)`}>
 {i===0?<><Stroke d="M-8 42 V12 Q-7 -6 3 -9" color={ORANGE} width={2}/><ellipse cx={5} cy={-9} rx={9} ry={5} fill={`url(#${id}-gold)`} stroke={ORANGE}/>{[-18,-7,5,16].map((v,j)=><g key={v}><Stroke d={`M${v} 44 l${j%2?4:-4} -29`} color={TEAL}/><path d={`M${v} 35 q-18 -4 -7 -15 q15 2 7 15 M${v} 27 q18 -5 8 -13 q-14 3 -8 13`} fill="#7ead85" stroke={TEAL} strokeWidth={.7}/></g>)}</>:i===1?<><path d="M-30 38 q-11 -20 0 -14 q12 -8 17 4 q-6 12 -17 10Z" fill="#8bbf9d" stroke={TEAL}/><Stroke d="M8 43 Q-6 17 17 -7" color={ORANGE} width={2}/>{[0,1,2,3,4].map(j=><g key={j}><path d={`M${6+j*1.5} ${32-j*7} q-27 -2 -20 -11 q14 -1 20 11 M${6+j*1.5} ${32-j*7} q25 -3 20 -14 q-13 1 -20 14`} fill="#dfab79" stroke={ORANGE} strokeWidth={.7}/></g>)}</>:<><Stroke d="M0 44 V-7 M0 20 l-24 -14 M0 29 l26 -13" color={ORANGE} width={2}/>{[[-23,4],[22,15],[-8,-3],[9,7]].map(([v,z])=><path key={v} d={`M${v} ${z+8} q-15 -18 5 -16 q10 12 -5 16Z`} fill="#dfab79" stroke={ORANGE} strokeWidth={.8}/>)}<circle cx={-24} cy={1} r={3} fill={TEAL}/><circle cx={28} cy={13} r={3} fill={TEAL}/></>}
 </g>
 <rect x={x+17} y={110} width={col-34} height={14} rx={7} fill="#e2e8f0"/><rect x={x+17} y={110} width={(col-34)*[.82,.22,.04][i]} height={14} rx={7} fill={TEAL}/><rect x={x+17} y={135} width={(col-34)*[.18,.78,.96][i]} height={14} rx={7} fill={ORANGE}/>{mobile&&<><La x={x+col/2} y={179} color={TEAL}>n</La><La x={x+col/2} y={207} color={ORANGE}>2n</La></>}</g>;})}</g>
 {!mobile&&<><La x={29} y={560} size={16} color={TEAL}>n</La><La x={29} y={586} size={16} color={ORANGE}>2n</La></>}
 <He x={cx} y={h-13} size={16} color={MUTED}>גודל יחסי רעיוני; לא מדידה של ביומסה</He>
 </Svg>;}}/>;}

function DoubleFertilization() {
 const labels:Label[]=[{text:"צלקת",x:81,y:55,to:[167,106]},{text:"עמוד עלי",x:80,y:210,to:[177,205]},{text:"שחלה",x:78,y:384,to:[111,343]},{text:"ביצית",x:269,y:435,to:[234,335]},{text:"צינור אבקה",x:312,y:63,to:[194,155],color:ORANGE},{text:"תאים אנטיפודיים",x:570,y:54,to:[554,129]},{text:"תא מרכזי",x:693,y:207,to:[593,237]},{text:"שני גרעינים קוטביים",x:571,y:442,to:[562,244],color:PURPLE},{text:"שתי סינרגידות",x:355,y:288,to:[477,333]},{text:"תא ביצה",x:695,y:352,to:[558,331]},{text:"שני תאי זרע",x:350,y:114,to:[490,301],color:RED}];
 return <Anatomy id="fert" h={590} title="הפריה כפולה: מעלי השחלה לשק העובר ושני תוצרי ההפריה" labels={labels} draw={mobile=>{const id="fert"+(mobile?"m":"d");return <>
 <path d="M152 110 Q131 70 166 78 Q176 60 188 80 Q220 76 201 111 L194 254 Q280 284 272 352 Q262 403 181 407 Q111 400 109 349 Q101 291 169 252 L169 110Z" fill={`url(#${id}-green)`} stroke={GREEN} strokeWidth={2.5}/>
 <path d="M177 118 V268 Q125 311 132 350 Q137 382 180 385 Q244 386 248 347 Q253 298 184 268 V118Z" fill="#f5fbec" stroke="#97b98e" strokeWidth={1.2}/>
 {[149,213].map(x=><ellipse key={x} cx={x} cy={336} rx={17} ry={30} fill={`url(#${id}-gold)`} stroke={GOLD} strokeWidth={1.3}/>)}
 <circle cx={182} cy={90} r={10} fill="#e5a25c" stroke={ORANGE}/><path d="M182 96 C201 142 176 208 182 270 Q236 291 216 325" fill="none" stroke={ORANGE} strokeWidth={4}/>
 <Stroke d="M249 318 L432 127 M250 356 L432 388" color="#b1bbc7" dash width={1.1}/>
 <path d="M529 91 C452 94 432 160 438 249 C440 318 449 382 501 405 Q563 421 612 392 Q665 354 647 219 Q636 99 570 91Z" fill={`url(#${id}-gold)`} stroke="#b69a6b" strokeWidth={2.5}/>
 <path d="M534 114 C478 110 463 176 463 245 C463 306 470 367 512 384 Q561 400 599 371 Q631 333 622 226 Q617 127 571 114Z" fill="#fffbee" stroke="#c9b68b" strokeWidth={1.5}/>
 {[519,550,581].map(x=><g key={x}><ellipse cx={x} cy={143} rx={13} ry={21} fill={`url(#${id}-green)`} stroke="#86a175" strokeWidth={1.2}/><circle cx={x} cy={143} r={5} fill="#759468"/></g>)}
 <ellipse cx={550} cy={244} rx={57} ry={64} fill="#f8efdb"/>{[532,566].map(x=><circle key={x} cx={x} cy={244} r={13} fill={`url(#${id}-purple)`} stroke={PURPLE} strokeWidth={1.4}/>)}
 {[496,600].map(x=><g key={x}><path d={`M${x} 366 q-25 -31 -11 -59 q13 -22 24 0 q13 33 -13 59Z`} fill={`url(#${id}-green)`} stroke={GREEN} strokeWidth={1.4}/><circle cx={x} cy={330} r={6} fill="#759468"/></g>)}
 <ellipse cx={549} cy={336} rx={25} ry={33} fill={`url(#${id}-pink)`} stroke={ORANGE} strokeWidth={1.4}/><circle cx={549} cy={337} r={9} fill={ORANGE} fillOpacity={.7}/>
 <path d="M432 396 C465 386 462 348 482 320 Q492 310 495 300" fill="none" stroke={ORANGE} strokeWidth={7}/>
 <ellipse cx={495} cy={290} rx={6} ry={10} fill={RED}/><ellipse cx={510} cy={300} rx={6} ry={10} fill={RED}/>
 <Arrow d="M501 286 Q507 258 519 251" x={519} y={251} a={-35} color={RED}/><Arrow d="M516 307 L534 323" x={534} y={323} a={42} color={RED}/>
 <rect x={34} y={479} width={692} height={93} rx={12} fill="#f1f5f9"/><He x={380} y={508} size={mobile?28:19} color={ORANGE} bold>זרע + ביצה ← זיגוטה 2n</He><He x={380} y={550} size={mobile?28:19} color={PURPLE} bold>זרע + שני גרעינים קוטביים ← אנדוספרם 3n</He>
 </>;}}/>;
}

function Mollusc() {
 const labels:Label[]=[{text:"קונכייה",x:379,y:45,to:[388,130]},{text:"מעטפת",x:548,y:68,to:[558,173]},{text:"גוש קרביים",x:251,y:80,to:[319,205]},{text:"לב בפריקרדיום",x:470,y:97,to:[452,179],color:RED},{text:"ראש · עין ומחוש",x:90,y:151,to:[153,292]},{text:"חלל המעטפת",x:666,y:168,to:[619,269]},{text:"זימים · קטנידיום",x:658,y:384,to:[587,282],color:BLUE},{text:"פי הטבעת",x:688,y:419,to:[629,301],route:[[727,390],[727,310]]},{text:"פתח נפרידיום",x:481,y:389,to:[568,256],color:PURPLE},{text:"רגל שרירית",x:332,y:417,to:[357,341]},{text:"ראדולה בחלל הפה",x:124,y:402,to:[187,310],color:ORANGE}];
 return <Anatomy id="moll" h={650} title="תוכנית גוף כללית של רכיכה: חתך אורך והגדלת הראדולה" labels={labels} draw={mobile=>{const id="moll"+(mobile?"m":"d");return <>
 <path d="M150 318 C166 234 203 134 332 119 C485 91 600 164 644 287 L672 319 Q441 293 150 318Z" fill={`url(#${id}-gold)`} stroke="#aa8d61" strokeWidth={3}/>
 {[0,1,2,3,4,5,6,7].map(i=><path key={i} d={`M${181+i*57} ${291-i%2*12} Q${229+i*34} ${115+i*5} ${345+i*35} ${132+i*9}`} fill="none" stroke="#e6d1aa" strokeWidth={2}/>) }
 <path d="M146 324 Q191 239 226 194 Q360 122 504 182 Q570 210 618 286 L652 324Z" fill={`url(#${id}-pink)`} stroke="#ba9181" strokeWidth={2}/>
 <path d="M108 324 Q89 274 137 274 Q170 274 188 304 L614 306 Q640 313 661 342 Q432 378 184 352 L111 350Z" fill={`url(#${id}-green)`} stroke="#7b9c74" strokeWidth={2.5}/>
 <path d="M126 332 Q324 315 629 330 Q640 339 642 344 Q382 369 136 346Z" fill="#b8cfa4"/>{Array.from({length:17},(_,i)=><Stroke key={i} d={`M${161+i*27} 331 l-8 18`} color="#92b083" width={1}/>) }
 <path d="M127 280 Q114 230 100 226 Q91 226 100 237 L120 291 M148 281 Q159 240 176 237 Q185 240 169 249 L157 293" fill={`url(#${id}-green)`} stroke="#7b9c74" strokeWidth={3}/><circle cx={137} cy={287} r={4.6} fill={INK}/>
 <path d="M507 222 Q581 217 626 280 L642 313 L530 303Z" fill="#edf7fc" stroke="#8aadc0" strokeWidth={1.4}/>
 <path d="M178 311 Q181 286 225 287 Q250 232 286 218 Q328 196 352 229 Q375 258 401 225 Q419 203 435 227 L450 278 Q500 306 631 300" fill="none" stroke="#9b854f" strokeWidth={11}/><path d="M178 311 Q181 286 225 287 Q250 232 286 218 Q328 196 352 229 Q375 258 401 225 Q419 203 435 227 L450 278 Q500 306 631 300" fill="none" stroke="#fff0b8" strokeWidth={6}/>
 <path d="M244 235 Q225 196 275 187 Q317 177 332 202 Q317 245 276 253Z" fill={`url(#${id}-green)`} stroke="#819b60" strokeWidth={1.6}/>
 <ellipse cx={440} cy={179} rx={46} ry={23} fill="#f2f9fa" stroke="#789fa8" strokeWidth={1.5}/><path d="M411 179 Q417 156 436 173 Q453 154 468 174 Q461 189 437 190Z" fill={`url(#${id}-red)`} stroke={RED} strokeWidth={1.3}/>
 <path d="M478 182 Q505 178 516 200 Q492 218 526 228 Q547 234 569 255" fill="none" stroke={PURPLE} strokeWidth={6}/>
 <Stroke d="M557 241 L616 289" color={BLUE} width={3}/>{Array.from({length:11},(_,i)=><g key={i}><path d={`M${559+i*5} ${242+i*4} q-23 -5 -24 9 q13 10 24 -9Z M${559+i*5} ${242+i*4} q1 -22 12 -16 q7 10 -12 16Z`} fill={`url(#${id}-blue)`} stroke="#7aacc2" strokeWidth={1}/></g>)}
 <ellipse cx={187} cy={311} rx={18} ry={8} fill="#e1a36d" stroke={ORANGE}/><Stroke d="M173 305 l5 -5 l5 5 l5 -5 l5 5 l5 -5" color={ORANGE}/>
 <rect x={36} y={461} width={688} height={168} rx={14} fill="#f0f5f7"/>
 <He x={380} y={492} size={mobile?29:20} bold>הראדולה נעה על האודונטופור</He>
 <path d="M250 577 Q307 506 391 537 Q417 549 421 580Z" fill={`url(#${id}-gold)`} stroke="#bca16d" strokeWidth={2}/>
 <path d="M214 591 Q299 505 395 532 Q451 551 480 589" fill="none" stroke={ORANGE} strokeWidth={9}/>{Array.from({length:13},(_,i)=>{const x=231+i*18,y=574-37*Math.sin(i/12*Math.PI);return <path key={i} d={`M${x} ${y} l2 -17 l10 11Z`} fill="#f2cb91" stroke={ORANGE} strokeWidth={1}/>;})}
 <Arrow d="M268 610 H429" x={429} y={610} color={ORANGE}/><He x={115} y={567} size={mobile?28:17} color={ORANGE}>שיני כיטין</He><He x={593} y={568} size={mobile?28:17} color={GOLD}>אודונטופור</He>
 </>;}}/>;
}

function Torsion() {return <Responsive draw={mobile=>{const w=mobile?440:760,h=mobile?820:525,id="torsion"+(mobile?"m":"d");return <Svg id={id} w={w} h={h} title="לפני ואחרי פיתול של 180 מעלות: חלל מעטפת, מעי ועצבים"><Heading w={w} title="פיתול של גוש הקרביים"/>{[false,true].map((after,i)=>{const tx=mobile?28:26+i*384,ty=mobile?100+i*334:102;return <g key={i} transform={`translate(${tx} ${ty})`}><He x={168} y={0} size={21} bold>{after?"אחרי הפיתול":"לפני הפיתול"}</He>
 <path d="M64 224 Q22 131 70 69 Q157 20 267 97 Q291 136 276 211Z" fill={`url(#${id}-gold)`} stroke="#b69d72" strokeWidth={2.5}/>
 <path d="M40 220 Q26 194 42 175 Q64 165 81 188 L274 211 Q313 222 317 244 Q158 263 35 243Z" fill={`url(#${id}-blue)`} stroke="#629bb6" strokeWidth={2}/>
 <path d="M46 183 L29 154 M69 182 L85 151" fill="none" stroke="#629bb6" strokeWidth={4}/><circle cx={48} cy={188} r={3.5} fill={INK}/>
 <path d={after?"M69 158 Q47 112 86 97 L113 173 L71 184Z":"M240 138 Q275 137 284 183 L276 210 L239 191Z"} fill="#c8e8ed" stroke={BLUE} strokeWidth={1.5}/>
 <path d={after?"M66 203 Q165 211 211 154 Q228 88 166 97 Q121 101 116 150 L88 161":"M64 201 Q114 124 172 137 Q214 151 258 181"} fill="none" stroke="#729c71" strokeWidth={13}/>
 <Stroke d={after?"M67 218 C121 205 203 215 216 180 S160 147 124 203 S85 230 73 220":"M73 216 Q147 192 239 197 M73 227 Q161 215 239 207"} color={PURPLE} width={3}/>
 <He x={174} y={after?47:282} size={16} color={BLUE}>{after?"חלל המעטפת ופי הטבעת מעל הראש":"חלל המעטפת ופי הטבעת מאחור"}</He>
 <Stroke d={after?"M111 54 L84 112":"M246 261 L271 195"} color={MUTED} width={1.2}/>
 </g>;})}
 {!mobile&&<><Arrow d="M332 82 Q381 46 429 82" x={429} y={82} a={35} color={ORANGE}/><La x={380} y={60} size={19} color={ORANGE} bold>180°</La></>}
 <He x={w/2} y={h-62} size={17} color={PURPLE} bold>סגול: מיתרי עצבים · מצטלבים אחרי הפיתול</He><He x={w/2} y={h-33} size={17} color={GREEN}>ירוק: המעי · מתכופף לצורת U</He><He x={w/2} y={h-8} size={16} color={MUTED}>פיתול התפתחותי שונה מליפוף הקונכייה</He>
 </Svg>;}}/>;}

// Essential, non-substitutable resources: A=(R1*=2,R2*=4), B=(4,2).
// At E=(4,4), consumption A=(1,3), B=(3,1): each consumes relatively
// more of its own limiting resource. Supply boundaries extend opposite these vectors.
function supplyGeometry() {
 const ax=2,ay=4,bx=4,by=2,max=10,ca=[1,3],cb=[3,1],E=[bx,ay];
 const upper=[E[0]+(max-E[1])*ca[0]/ca[1],max],lower=[max,E[1]+(max-E[0])*cb[1]/cb[0]];
 return {E,upper,lower,regions:[
 {c:"#eef0f3",v:[[0,0],[max,0],[max,by],[bx,by],E,[ax,ay],[ax,max],[0,max]]},
 {c:"#e2ecfc",v:[[ax,ay],E,upper,[ax,max]]},
 {c:"#d5eee3",v:[E,lower,[max,max],upper]},
 {c:"#fbe7d8",v:[[bx,by],[max,by],lower,E]},
 ]};
}
function Zngi() {return <Responsive draw={mobile=>{const w=mobile?440:760,p={x:59,y:135,w:w-94,h:mobile?340:310,xmax:10,ymax:10},s=coords(p),{E,upper,lower,regions}=supplyGeometry();const poly=(v:number[][])=>v.map(([x,y])=>`${s.x(x)},${s.y(y)}`).join(" ");return <Svg id={`zngi${mobile}`} w={w} h={mobile?710:665} title="שני משאבים חיוניים: ZNGI, וקטורי צריכה ותחומי אספקה"><Heading w={w} title="קיום יחדיו תלוי גם באספקה"/><He x={w/2} y={65} color={MUTED} size={16}>צבע הרקע: התוצאה לפי נקודת האספקה</He><Axis p={p} xt={[0,2,4,6,8,10]} yt={[0,2,4,6,8,10]} xlabel="משאב R₁" ylabel="משאב R₂"/>
 {regions.map(r=><polygon key={r.c} points={poly(r.v)} fill={r.c}/>)}
 <Stroke d={line([[2,10],[2,4],[10,4]],p)} color={BLUE} width={3}/><Stroke d={line([[4,10],[4,2],[10,2]],p)} color={ORANGE} width={3}/>
 {[upper,lower].map((v,i)=><Stroke key={i} d={line([E,v],p)} color={TEAL} dash width={1.5}/>)}
 <Arrow d={line([E,[3.4,2.2]],p)} x={s.x(3.4)} y={s.y(2.2)} a={Math.atan2(1.8*p.h,-.6*p.w)*180/Math.PI} color={BLUE} width={3}/><Arrow d={line([E,[2.2,3.4]],p)} x={s.x(2.2)} y={s.y(3.4)} a={Math.atan2(.6*p.h,-1.8*p.w)*180/Math.PI} color={ORANGE} width={3}/>
 <circle cx={s.x(4)} cy={s.y(4)} r={5} fill={TEAL} stroke={PAPER} strokeWidth={2}/>
 <La x={s.x(4)-18} y={s.y(4)-19} color={TEAL} bold>E</La>
 <He x={s.x(2.9)} y={s.y(8.5)} size={mobile?16:18} color={BLUE} bold>A מנצח</He><He x={s.x(7.6)} y={s.y(7.5)} size={mobile?16:18} color={TEAL} bold>קיום יחדיו</He><He x={s.x(8)} y={s.y(3)} size={mobile?16:18} color={ORANGE} bold>B מנצח</He>
 <He x={s.x(1.75)} y={s.y(1.25)} size={mobile?16:17} color={MUTED}>אף מין לא שורד</He>
 <He x={w/2} y={p.y+p.h+97} size={17} color={BLUE}>כחול: ZNGI של A</He><He x={w/2} y={p.y+p.h+124} size={17} color={ORANGE}>כתום: ZNGI של B</He><He x={w/2} y={p.y+p.h+151} size={16}>חצים: צריכה · מקווקו: גבולות תחום הקיום</He><He x={w/2} y={p.y+p.h+177} size={16} color={MUTED}>E: משאבים בשיווי משקל משותף</He><La x={w/2} y={p.y+p.h+205} size={16}>R*: A = (2, 4) · B = (4, 2)</La>
 </Svg>;}}/>;}

function sirData() {let S=.999,I=.001,R=0;const dt=.02,out:number[][]=[];const f=([s,i]:number[])=>[-3*s*i,3*s*i-i,i];for(let k=0;k<=1800;k++){if(k%5===0)out.push([k*dt,S,I,R]);const v=[S,I,R],a=f(v),b=f(v.map((x,j)=>x+dt*a[j]/2)),c=f(v.map((x,j)=>x+dt*b[j]/2)),d=f(v.map((x,j)=>x+dt*c[j]));[S,I,R]=v.map((x,j)=>x+dt*(a[j]+2*b[j]+2*c[j]+d[j])/6);}return out;}
function Sir() {return <Responsive draw={mobile=>{const w=mobile?440:760,h=mobile?1040:555,data=sirData(),p={x:mobile?58:49,y:127,w:mobile?347:311,h:mobile?235:250,xmax:20,ymax:1},q={x:mobile?58:440,y:mobile?650:127,w:mobile?347:282,h:mobile?235:250,xmin:1,xmax:20,ymax:1},s=coords(q);return <Svg id={`sir${mobile}`} w={w} h={h} title="מודל SIR וסף חסינות העדר כפונקציה של R₀"><Heading w={w} title="התפרצות וסף חסינות"/>
 <He x={p.x+p.w/2} y={81} size={19} bold>מהלך התפרצות · R₀ ≈ 3</He><Axis p={p} xt={[0,5,10,15,20]} yt={[0,.5,1]} xlabel="זמן · יחידות משך הדבקה" ylabel="חלק באוכלוסייה"/>{[BLUE,RED,TEAL].map((c,j)=><Stroke key={c} d={line(data.filter(r=>r[0]<=20).map(r=>[r[0],r[j+1]]),p)} color={c} width={2.8}/>)}
 <He x={p.x+p.w/2} y={p.y+p.h+94} size={17} color={BLUE}>S · רגישים</He><He x={p.x+p.w/2} y={p.y+p.h+120} size={17} color={RED}>I · נגועים</He><He x={p.x+p.w/2} y={p.y+p.h+146} size={17} color={TEAL}>R · מחלימים וחסינים</He>
 <He x={q.x+q.w/2} y={q.y-46} size={19} bold>סף תאורטי לחלק החסין</He><Axis p={q} xt={[1,5,10,15,20]} yt={[0,.5,1]} xlabel="מספר רבייה בסיסי R₀" ylabel="חלק חסין p"/><Stroke d={line(Array.from({length:191},(_,i)=>{const r=1+i/10;return [r,1-1/r];}),q)} color={PURPLE} width={3}/><circle cx={s.x(3)} cy={s.y(2/3)} r={5} fill={PURPLE}/><La x={q.x+q.w/2} y={q.y+q.h+94} size={20} color={PURPLE}>p = 1 − 1/R₀</La><He x={q.x+q.w/2} y={q.y+q.h+122} size={16} color={MUTED}>R₀ = 3: הסף הוא כשני שלישים</He>
 </Svg>;}}/>;}

export const SHARED_BIO_FIGURES: Record<string,{el:()=>React.ReactElement;captionHe:string}> = {
 "sh-bateman":{el:Bateman,captionHe:"מספר הצאצאים עולה בחדות עם מספר בנות הזוג בזכרים, וכמעט אינו עולה לאחר ההזדווגות הראשונה בנקבות בדגם המוצג. הנקודות מחושבות בהשראת ההיגיון של Bateman משנת 1948, ואינן נתוניו או כלל לכל המינים. נתונים להמחשה."},
 "sh-nilsson-ehle":{el:NilssonEhle,captionHe:"במודל של שלושה לוקוסים בלתי תלויים בעלי תרומה אדיטיבית שווה, מספר אללי הצבע בדור F2 מתפלג ביחס 1:6:15:20:15:6:1 מתוך 64. הקו הסגול מחושב כתערובת של התפלגויות סביבתיות סביב שבע המחלקות. נתונים להמחשה."},
 "sh-midparent-regression":{el:Midparent,captionHe:"שיפוע הרגרסיה המחושב הוא 0.60; בהנחות המתוארות ביחידה הוא אומד את h². הקווים המקווקווים מציגים שיפוע 1 ושיפוע 0, והפיזור נוצר מזרע אקראי קבוע. נתונים להמחשה."},
 "sh-root-uptake":{el:RootUptake,captionHe:"במגזר חתך של שורש, המסלול האפופלסטי נחסם ברצועת קספרי העשירה בליגנין, ואילו המסלול הסימפלסטי עובר דרך פלזמודסמטות. המסלול שנשאר בדפנות נדרש לחצות ממברנה לפני הכניסה לגליל המרכזי; בתקריב נראית משאבת H⁺-ATPase המניעה קליטת יונים בעזרת מפל הפרוטונים. סכמטי."},
 "sh-pressure-flow":{el:PressureFlow,captionHe:"טעינת סוכרוז במקור וכניסת מים מהעצה מעלות את הטורגור בשיפה; פריקה בבור ויציאת מים מורידות אותו. הפרש הלחצים מניע זרימה המונית של התמיסה, וחלק מהמים חוזר בעצה; תא הלוואי מוצג לצד רכיב הצינור. סכמטי."},
 "sh-alternation-generations":{el:Alternation,captionHe:"הגמטופיט הפלואידי מייצר גמטות במיטוזה, והספורופיט הדיפלואידי מייצר נבגים במיוזה בנבגייה. רצועת ההשוואה מייצגת דומיננטיות יחסית של שני הדורות בטחב, בשרך ובצמח זרע, ולא יחסי גודל מדודים. סכמטי."},
 "sh-double-fertilization":{el:DoubleFertilization,captionHe:"צינור האבקה מגיע לשק העובר דרך הביצית ומוסר שני תאי זרע: אחד מתאחה עם תא הביצה ליצירת זיגוטה 2n, והשני עם שני הגרעינים הקוטביים ליצירת גרעין האנדוספרם 3n. מוצג הדגם השכיח של שק עובר בעל שבעה תאים ושמונה גרעינים, לפני ההפריה. סכמטי."},
 "sh-mollusc-body-plan":{el:Mollusc,captionHe:"חתך אורך ברכיכה כללית מציג ראש, רגל שרירית, גוש קרביים, מעטפת וקונכייה; הזים ופתחי ההפרשה והמעי פונים לחלל המעטפת. הראדולה מוגדלת להדגמת סרט השיניים הנע על האודונטופור; זהו דגם השוואתי ולא שחזור של אב קדמון מוכח. סכמטי."},
 "sh-torsion":{el:Torsion,captionHe:"בפיתול התפתחותי של 180° גוש הקרביים והמעטפת מסתובבים ביחס לראש־רגל, כך שחלל המעטפת ופי הטבעת עוברים לפנים ומעל הראש. המעי מתכופף לצורת U ומיתרי העצבים הקרביים מצטלבים; התהליך שונה מליפוף הקונכייה. סכמטי."},
 "sh-rstar-zngi":{el:Zngi,captionHe:"עקומות ZNGI מחושבות לשני משאבים חיוניים; כל מין מסתדר עם ריכוז נמוך יותר של משאב אחר. הרקע מציג תוצאות לפי נקודת האספקה עבור וקטורי הצריכה שנבחרו, המאפשרים קיום יחדיו יציב בתחום הביניים. נתונים להמחשה."},
 "sh-sir":{el:Sir,captionHe:"עקומות S/I/R חושבו במודל של אוכלוסייה סגורה וערבוב אקראי, עם חסינות מתמשכת ו־R₀ ≈ 3; ההתפרצות דועכת בעוד חלק מהאוכלוסייה נותר רגיש. לצדן מחושב סף חסינות העדר p = 1 − 1/R₀; כדי לדכא התפשטות נדרש חלק חסין מעל הסף. נתונים להמחשה."},
};
