import type React from 'react';
import {He,La,Callout,Flow} from './ub-zoo';
import {Responsive} from './immune';
const blue='#346f91',green='#337a69',gold='#a27335',purple='#7b5b98',red='#ad4e5b',gray='#627588';
type PlateProps={id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string[];sceneH?:number};
function Defs({id}:{id:string}){return <defs><marker id={id+'-arrow'} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M1 1L9 5L1 9Z" fill="context-stroke"/></marker></defs>;}
const legendColors:Record<string,string[]>={nephronsegments:[blue,gold,green,purple,blue],diureticsites:[blue,gold,green,purple,purple],countercurrent:[blue,green,purple],guardcellopening:[green,gold,purple,blue],acidgrowth:[gray,green,purple,red],shootmeristem:[gold,purple,green,blue,green]};
function stride(p:PlateProps,m=false){return Math.max(m?48:44,Math.max(...p.keys.map(l=>l.length))*20+8);}
function layout(p:PlateProps,m=false){const legend=(m?67:76)+(p.sceneH||330)*(m?.55:.85)+32,rows=m?p.keys.length:Math.ceil(p.keys.length/2);return {legend,h:legend+(rows-1)*stride(p,m)+(Math.max(...p.keys.map(l=>l.length))-1)*20+40+(p.foot.length-1)*24+17};}
// Keep textbook pressure indices below the baseline within the existing LTR isolate.
function pressureText(t:string){return t.split(/(P_GC|P_BS|π_GC)/g).map((part,i)=>/^(P|π)_(GC|BS)$/.test(part)?<tspan key={i}>{part[0]}<tspan baselineShift="sub" fontSize="70%">{part.slice(2)}</tspan></tspan>:part);}
function PlateScene({p,m=false}:{p:PlateProps;m?:boolean}){const w=m?360:640,l=layout(p,m),colors=legendColors[p.id.slice(4)];return <><Defs id={p.id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{p.title}</He><He x={w/2} y={56} size={m?15:16}>{p.subtitle}</He><g data-scene="" transform={`translate(${m?4:48} ${m?67:76}) scale(${m?.55:.85})`}>{p.draw(p.id+(m?'-m':'-d'))}</g>{p.keys.map((lines,i)=>{const x=m?340:i%2===0?610:298,y=l.legend+(m?i:Math.floor(i/2))*stride(p,m),c=colors[i];return <g key={i} data-legend={i+1}><circle cx={x} cy={y-5} r={11} fill={c+'18'} stroke={c} strokeWidth={1.2}/><La x={x} y={y} size={15} color={c} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{pressureText(t)}</He>)}</g>})}{p.foot.map((s,i)=><He key={i} x={w/2} y={l.h-17-(p.foot.length-1-i)*24} size={m?14:16} color="#586b7d">{s}</He>)}</>;}
export function Plate(p:PlateProps){return <div className="p2l-plate"><style>{'.p2l-plate .immune-wide{max-width:640px;margin:auto}'}</style><Responsive id={p.id} label={p.label} h={layout(p).h} mh={layout(p,true).h} wide={<PlateScene p={p}/>} mobile={<PlateScene p={p} m/>}/></div>;}
function L({x,y,t,c=blue,size=25}:{x:number;y:number;t:string;c?:string;size?:number}){return <La x={x} y={y} size={size} color={c} bold>{pressureText('\u2066'+t+'\u2069')}</La>;}
function Surfaces({id}:{id:string}){return <defs>{[['blue','#eff8fb','#8db8cd',blue],['green','#eef9f3','#8fc0ad',green],['gold','#fff5de','#d5b373',gold],['purple','#f7effb','#c2acd2',purple],['red','#fff0ef','#dca1aa',red],['gray','#f4f7f9','#b3c2cc',gray]].map(([n,a,b,c])=><radialGradient key={n} id={id+'-'+n} cx=".28" cy=".22" r=".95"><stop stopColor={a}/><stop offset=".6" stopColor={b}/><stop offset="1" stopColor={c}/></radialGradient>)}<linearGradient id={id+'-membrane'} x2="0" y2="1"><stop stopColor="#e6cc99"/><stop offset=".25" stopColor="#fff3d7"/><stop offset=".7" stopColor="#e8dcc4"/><stop offset="1" stopColor="#bfa16f"/></linearGradient></defs>;}
function Membrane({x=25,y,w=590,id}:{x?:number;y:number;w?:number;id:string}){return <g><rect x={x} y={y} width={w} height={40} rx={8} fill={`url(#${id}-membrane)`}/>{Array.from({length:Math.floor(w/12)},(_,i)=><g key={i}><path d={`M${x+6+i*12} ${y+5}l-2 11m2-11l3 11m-3 7l-2 11m2-11l3 11`} stroke="#b6a17f" strokeWidth={1.4}/><circle cx={x+6+i*12} cy={y+3} r={4} fill="#efdbb1" stroke="#af8c51" strokeWidth={1}/><circle cx={x+6+i*12} cy={y+37} r={4} fill="#efdbb1" stroke="#af8c51" strokeWidth={1}/></g>)}</g>;}
function Protein({x,y,rx=45,ry=28,id,c='blue',bio,t}:{x:number;y:number;rx?:number;ry?:number;id:string;c?:string;bio:string;t?:string}){return <g><path data-bio={bio} d={`M${x-rx} ${y}C${x-rx-6} ${y-ry*.8} ${x-rx*.5} ${y-ry*1.2} ${x-rx*.1} ${y-ry}C${x+rx*.3} ${y-ry*1.35} ${x+rx*.95} ${y-ry*.8} ${x+rx} ${y}C${x+rx*1.12} ${y+ry*.8} ${x+rx*.15} ${y+ry*1.25} ${x-rx*.2} ${y+ry}C${x-rx*.8} ${y+ry*1.2} ${x-rx*1.12} ${y+ry*.5} ${x-rx} ${y}Z`} fill={`url(#${id+'-'+c})`} stroke={c==='purple'?purple:c==='green'?green:c==='gold'?gold:blue} strokeWidth={2}/><path d={`M${x-rx*.65} ${y-ry*.57}q${rx*.3} ${-ry*.37} ${rx*.65} ${-ry*.1}`} fill="none" stroke="#fff" strokeOpacity={.65} strokeWidth={3} strokeLinecap="round"/>{t&&<L x={x} y={y+9} t={t} c={c==='purple'?purple:c==='green'?green:c==='gold'?gold:blue}/>}</g>;}


// The connected nephron is shared by anatomy and pharmacology, with distinct segment surfaces.
function Tube({d,c,id,bio}:{d:string;c:string;id:string;bio:string}){const ink=c==='blue'?blue:c==='gold'?gold:c==='purple'?purple:green;return <g><path data-bio={bio} d={d} fill="none" stroke={ink} strokeWidth={25} strokeLinecap="round" strokeLinejoin="round"/><path d={d} fill="none" stroke={`url(#${id}-${c})`} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round"/><path d={d} fill="none" stroke="#fff" strokeOpacity={.6} strokeWidth={5} strokeLinecap="round"/></g>;}
function Nephron({id}:{id:string}){return <><Surfaces id={id}/><rect x={28} y={224} width={582} height={238} rx={24} fill="#f8f1e6"/><path d="M30 224H610" stroke="#c5b69c" strokeWidth={1.2} strokeDasharray="5 6"/><He x={560} y={211} size={25} color={gray}>קליפה</He><He x={560} y={257} size={25} color={gold}>ליבה</He>
 <ellipse data-bio="glomerulus" cx={566} cy={91} rx={36} ry={30} fill={`url(#${id}-red)`} stroke={red} strokeWidth={2}/><path d="M548 86q13-20 27 0t-23 11q-8 17 22 9" stroke={red} fill="none" strokeWidth={4}/>
 <Tube d="M531 103C503 100 503 153 479 153S467 104 445 116S462 179 425 180" c="blue" id={id} bio="proximal"/>
 <Tube d="M425 180V397Q425 438 353 438Q280 438 280 397" c="blue" id={id} bio="descending"/>
 <Tube d="M280 397V177Q280 139 247 134" c="gold" id={id} bio="ascending"/>
 <Tube d="M247 134C214 135 232 93 201 94S215 155 174 144S148 113 116 128" c="green" id={id} bio="distal"/>
 <Tube d="M116 128Q85 125 85 160V446" c="purple" id={id} bio="collecting"/>
 <Flow d="M425 256v43" id={id} color={blue}/><Flow d="M280 304v-43" id={id} color={gold}/><Flow d="M85 286v44" id={id} color={purple}/>
 <He x={353} y={251} size={25}>לולאת</He><He x={353} y={283} size={25}>הנלה</He><He x={353} y={384} size={25} color={blue}>מים יוצאים</He>
 </>;}
export function NephronSegmentsScene(id:string){return <><Nephron id={id}/><He x={460} y={35} size={27} bold color={blue}>מקורבת: כ־⁦67%⁩</He><He x={190} y={35} size={27} bold color={green}>מרוחקת: כ־⁦5%⁩</He><Callout n={1} x={553} y={174} tx={497.61691037161114} ty={158.28317190642272} target="proximal"/><Callout n={2} x={216} y={340} tx={267.6000000000006} ty={340} target="ascending"/><Callout n={3} x={137} y={74} tx={178.0108361238844} ty={98.12401721025273} target="distal"/><Callout n={4} x={155} y={434} tx={97.39999999999918} ty={434} target="collecting"/><Callout n={5} x={489} y={339} tx={437.3999999999994} ty={339} target="descending"/></>;}
export function DiureticSitesScene(id:string){return <><Nephron id={id}/><He x={460} y={35} size={27} bold color={blue}>האבובית המקורבת</He><He x={190} y={35} size={27} bold color={green}>האבובית המרוחקת</He><Callout n={1} x={553} y={174} tx={497.61691037161114} ty={158.28317190642272} target="proximal"/><Callout n={2} x={216} y={340} tx={267.6000000000006} ty={340} target="ascending"/><Callout n={3} x={137} y={74} tx={178.0108361238844} ty={98.12401721025273} target="distal"/><Callout n={4} x={155} y={378} tx={97.39999999999918} ty={378} target="collecting"/><Callout n={5} x={155} y={434} tx={97.39999999999918} ty={434} target="collecting"/></>;}

export function CountercurrentScene(id:string){return <><Surfaces id={id}/>
 <He x={580} y={27} size={25} color={gold}>נוזל בין־תאי</He><L x={580} y={60} t="mOsm/kg" c={gold} size={25}/>
 <He x={360} y={27} size={26} bold color={blue}>יורד</He><He x={210} y={27} size={26} bold color={green}>עולה</He><He x={65} y={27} size={26} bold color={purple}>מאספת</He>
 {[300,600,900,1200].map((v,i)=><g key={v}><rect x={25} y={86+i*85} width={585} height={85} fill={['#fff9ee','#f8edd6','#edd9ad','#dfbf88'][i]} opacity={.7}/><L x={575} y={136+i*85} t={String(v)} c={gold}/></g>)}
 <Tube d="M365 90V391Q365 430 290 430Q215 430 215 391" c="blue" id={id} bio="descending"/><Tube d="M215 391V90" c="green" id={id} bio="ascending"/><Tube d="M65 90V424" c="purple" id={id} bio="collecting"/>
 <L x={402} y={83} t="300" c={blue}/><L x={255} y={83} t="≈100" c={green}/><L x={290} y={479} t="1200" c={blue}/><L x={65} y={479} t="≈1200" c={purple}/>
 {[146,231,316].map(y=><g key={y}><Flow d={`M380 ${y}h58`} id={id} color={blue}/><L x={425} y={y-16} t="H₂O" c={blue}/><Flow d={`M200 ${y}h-48`} id={id} color={green}/><L x={167} y={y-16} t="NaCl" c={green}/><Flow d={`M80 ${y+19}h42`} id={id} color={purple}/><L x={111} y={y+3} t="H₂O" c={purple}/></g>)}
 <Flow d="M365 182v26" id={id} color={blue}/><Flow d="M215 207v-26" id={id} color={green}/><Flow d="M65 184v25" id={id} color={purple}/>
 <Callout n={1} x={474} y={378} tx={377.3999999999977} ty={378} target="descending"/><Callout n={2} x={275} y={332} tx={227.40755838711917} ty={355.0030231101253} target="ascending"/><Callout n={3} x={116} y={390} tx={77.4199999999999} ty={390} target="collecting"/>
 <He x={320} y={528} size={25}>העולה אטום למים; בנוכחות ⁦ADH⁩</He><He x={320} y={560} size={25}>מים יוצאים מהמאספת והשתן מתרכז</He>
 </>;}

function guardOuterOffset(dy:number){let lo=0,hi=1;for(let i=0;i<32;i++){const t=(lo+hi)/2,v=1-t,y=-88*v*v*v-243*v*v*t+243*v*t*t+88*t*t*t;if(y<dy)lo=t;else hi=t;}const t=(lo+hi)/2;return 288*t*(1-t);}
function GuardPair({x,y,open,id}:{x:number;y:number;open:boolean;id:string}){const b=open?28:0;return <g>{[-1,1].map(side=><g key={side}><path data-bio={open?'guard-open':'guard-closed'} d={`M${x} ${y-88}C${x+side*96} ${y-81} ${x+side*96} ${y+81} ${x} ${y+88}C${x+side*b} ${y+48} ${x+side*b} ${y-48} ${x} ${y-88}Z`} fill={`url(#${id}-green)`} stroke={green} strokeWidth={2.2}/>{[-.7,-.35,0,.35,.7].map((t,i)=><path key={i} data-bio={open?'radial':'closed-radial'} d={`M${x+side*(b*(1-t*t)*.8+4)} ${y+t*78}L${x+side*guardOuterOffset(t*87)} ${y+t*87}`} fill="none" stroke={gold} strokeWidth={2.3}/>)}<path data-bio={open?'inner-wall':'closed-wall'} d={`M${x} ${y-88}C${x+side*b} ${y-47} ${x+side*b} ${y+47} ${x} ${y+88}`} fill="none" stroke={gold} strokeWidth={6}/><ellipse cx={x+side*49} cy={y+16} rx={12} ry={21} fill="#add0b2" stroke={green} strokeWidth={1.2}/></g>)}</g>;}
export function GuardCellOpeningScene(id:string){return <><Surfaces id={id}/>
 <He x={480} y={25} size={28} bold>פיונית סגורה</He><He x={160} y={25} size={28} bold>פיונית פתוחה</He><GuardPair x={480} y={137} open={false} id={id}/><GuardPair x={160} y={137} open id={id}/><Flow d="M356 137H285" id={id} color={green}/>
 <Callout n={1} x={45} y={78} tx={92.39009147112638} ty={106.59723474734318} target="radial"/><Callout n={2} x={60} y={240} tx={156.80698083639578} ty={225.47895745217738} target="inner-wall"/>
 <He x={320} y={267} size={25}>אור כחול מפעיל ⁦phototropin⁩ ואת המשאבה</He>
 <rect x={93} y={355} width={454} height={174} rx={28} fill={`url(#${id}-green)`} stroke={green} strokeWidth={2}/><Membrane x={93} y={344} w={454} id={id}/>
 <ellipse data-bio="vacuole" cx={285} cy={475} rx={110} ry={34} fill={`url(#${id}-blue)`} stroke={blue} strokeWidth={2}/><He x={285} y={483} size={25} color={blue}>ואקואולה</He>
 <rect data-bio="pump" x={428} y={333} width={49} height={59} rx={15} fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={2}/><Flow d="M452 340V293" id={id} color={purple}/><L x={498} y={314} t="H⁺" c={purple}/>
 <rect data-bio="k-channel" x={166} y={337} width={32} height={49} rx={10} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={2}/><Flow d="M182 300V333" id={id} color={gold}/><L x={140} y={318} t="K⁺" c={gold}/><Flow d="M269 300V339" id={id} color={green}/><L x={305} y={318} t="Cl⁻" c={green}/><Flow d="M365 300V339" id={id} color={blue}/><He x={390} y={322} size={25} color={blue}>מים</He>
 <L x={285} y={415} t="ATP → ADP + Pᵢ" c={purple} size={25}/><L x={466} y={438} t="H⁺-ATPase" c={purple} size={25}/>
 <Callout n={3} x={588} y={305} tx={476.1490304807901} ty={340.63393746202905} target="pump"/><Callout n={4} x={137} y={475} tx={174.39285158983006} ty={477.83279409904543} target="vacuole"/>
 <He x={320} y={580} size={25}>יציאת ⁦H⁺⁩: היפרפולריזציה וכניסת ⁦K⁺⁩</He><He x={320} y={614} size={25}>מלאט מעמילן; פוטנציאל המומסים יורד</He><He x={320} y={648} size={25}>מים נכנסים; הטורגור עולה והתאים מתכופפים</He>
 </>;}

export function AcidGrowthScene(id:string){return <><Surfaces id={id}/>
 <He x={320} y={26} size={27} bold>החלקת מיקרופיברילים ומתיחת הדופן</He><Flow d="M320 58H572" id={id} color={gray}/><Flow d="M302 58H48" id={id} color={gray}/>
 <rect x={28} y={90} width={584} height={231} rx={20} fill="#f4eada"/>
 {[125,187,249].map(y=><g key={y}><rect data-bio="cellulose" x={48} y={y-9} width={544} height={18} rx={9} fill={`url(#${id}-gray)`} stroke={gray} strokeWidth={1.6}/>{Array.from({length:31},(_,i)=><path key={i} d={`M${58+i*17} ${y-6}l7 12`} stroke="#8e9da7" strokeWidth={.8} opacity={.7}/>)}</g>)}
 {[[127,125],[268,125],[460,125],[180,187],[348,187],[520,187]].map(([x,y],i)=><path key={i} data-bio="xyloglucan" d={`M${x} ${y+10}C${x+20} ${y+24} ${x-18} ${y+36} ${x+4} ${y+51}`} fill="none" stroke={green} strokeWidth={4}/>)}
 {[[127,158],[348,220],[460,158]].map(([x,y],i)=><Protein key={i} x={x} y={y} rx={18} ry={12} id={id} c="purple" bio="expansin"/>)}
 {[90,195,305,415,535].map(x=><L key={x} x={x} y={301} t="H⁺" c={red}/>)}
 <Membrane x={28} y={341} w={584} id={id}/><rect data-bio="pump" x={284} y={333} width={72} height={57} rx={15} fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={2}/><Flow d="M320 341V311" id={id} color={red}/>
 <L x={150} y={420} t="auxin" c={gold}/><Flow d="M208 413L279 382" id={id} color={gold}/><L x={347} y={447} t="H⁺-ATPase" c={purple}/><L x={347} y={482} t="ATP → ADP + Pᵢ" c={purple}/>
 <Flow d="M568 462V395" id={id} color={blue}/><He x={547} y={497} size={25} color={blue}>לחץ טורגור</He><He x={124} y={478} size={25}>ציטופלזמה</He>
 <He x={320} y={541} size={25}>החמצת הדופן: ⁦pH 4.5–5⁩ מפעיל ⁦expansin⁩</He><He x={320} y={573} size={25}>קשרי המימן נחלשים; הדופן נמתחת בטורגור</He>
 <Callout n={1} x={24} y={64} tx={51.087850971288844} ty={117.30189980612352} target="cellulose"/><Callout n={2} x={611} y={202} tx={522.0969737661957} ty={234.03908175798307} target="xyloglucan"/><Callout n={3} x={242} y={220} tx={328.94000000000193} ty={220} target="expansin"/><Callout n={4} x={390} y={404} tx={355.2540445692232} ty={382.1596895174562} target="pump"/>
 </>;}

export function ShootMeristemScene(id:string){return <><Surfaces id={id}/>
 <He x={320} y={25} size={27} bold>חתך אורכי בקצה הנבט</He>
 <path data-bio="meristem" d="M89 398V207C89 44 551 44 551 207V398Z" fill={`url(#${id}-green)`} stroke={green} strokeWidth={2.2}/>
 <path data-bio="layers" d="M103 208C103 62 537 62 537 208M119 210C119 83 521 83 521 210" fill="none" stroke={blue} strokeWidth={2}/>
 {[363].map(y=><path key={y} d={`M110 ${y}H220M465 ${y}H530`} fill="none" stroke="#88b49c" strokeWidth={1} opacity={.65}/>)}
 {[146,191,236,506].map(x=><path key={x} d={`M${x} 330Q${x-12} 360 ${x} 396`} fill="none" stroke="#88b49c" strokeWidth={1} opacity={.65}/>)}
 <path data-bio="primordium" d="M104 267C42 267 26 180 55 177Q105 180 119 238Z" fill={`url(#${id}-green)`} stroke={green} strokeWidth={2}/><path data-bio="primordium" d="M536 267C598 267 614 180 585 177Q535 180 521 238Z" fill={`url(#${id}-green)`} stroke={green} strokeWidth={2}/>
 <ellipse data-bio="stem-zone" cx={320} cy={143} rx={91} ry={43} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={2}/><He x={320} y={135} size={25} color={gold} bold>תאי גזע</He><L x={320} y={166} t="CLV3" c={gold}/>
 <rect data-bio="organizer" x={244} y={235} width={152} height={70} rx={27} fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={2}/><He x={320} y={259} size={25} bold color={purple}>מרכז הארגון</He><L x={320} y={291} t="WUS" c={purple}/>
 <rect data-bio="rib-zone" x={244} y={330} width={152} height={66} rx={14} fill={`url(#${id}-green)`} stroke={green} strokeWidth={1.7}/><He x={320} y={368} size={25} color={green}>אזור הצלע</He>
 <He x={158} y={312} size={25} color={green}>היקף</He><He x={482} y={312} size={25} color={green}>היקף</He>
 <Flow d="M356 233V187" id={id} color={purple}/><L x={398} y={211} t="WUS" c={purple}/><path data-flow="" d="M264 185Q205 208 243 258" fill="none" stroke={red} strokeWidth={2}/><path d="M232 261L251 246" stroke={red} strokeWidth={3}/><rect x={125} y={221} width={80} height={37} rx={11} fill="#f9e5e7" stroke={red} strokeWidth={1.5}/><L x={165} y={248} t="CLV1" c={red}/>
 <Callout n={1} x={450} y={185} tx={407.61535754005405} ty={156.74357677963238} target="stem-zone"/><Callout n={2} x={444} y={271} tx={396.8999999999996} ty={271} target="organizer"/><Callout n={3} x={444} y={337} tx={396.7473741907246} ty={354.3581242559505} target="rib-zone"/><Callout n={4} x={170} y={185} tx={177.7014019240866} ty={141.36441799189993} target="layers"/><Callout n={5} x={589} y={325} tx={572.8695667465902} ty={255.3843487845647} target="primordium"/>
 <He x={320} y={453} size={25}>החלבון ⁦WUS⁩ נע מעלה ומפעיל ביטוי ⁦CLV3⁩</He><He x={320} y={487} size={25}>האות ⁦CLV3⁩ נקשר לקולטן ⁦CLV1⁩</He><He x={320} y={521} size={25}>ומדכא ⁦WUS⁩: משוב המייצב את תאי הגזע</He>
 </>;}
