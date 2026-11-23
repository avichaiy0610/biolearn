import type React from 'react';
import {He,La,Callout,Flow} from './ub-zoo';
import {Responsive} from './immune';
const blue='#346f91',green='#337a69',gold='#a27335',purple='#7b5b98',red='#ad4e5b',gray='#627588';
type PlateProps={id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string[];sceneH?:number};
function Defs({id}:{id:string}){return <defs><marker id={id+'-arrow'} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M1 1L9 5L1 9Z" fill="context-stroke"/></marker></defs>;}
const legendColors:Record<string,string[]>={microgliastates:[purple,purple,gold],gcamp:[green,green,purple,green],optogenetics:[blue,gold],saltatoryconduction:[gold,red,blue],sarcomere:[gray,red,blue],glomerularstarling:[red,gray,blue,red]};
function layout(p:PlateProps,m=false){const legend=(m?67:76)+(p.sceneH||330)*(m?.55:.85)+32,rows=m?p.keys.length:Math.ceil(p.keys.length/2);return {legend,h:legend+(rows-1)*(m?48:44)+20+40+(p.foot.length-1)*24+17};}
// Keep textbook pressure indices below the baseline within the existing LTR isolate.
function pressureText(t:string){return t.split(/(P_GC|P_BS|π_GC)/g).map((part,i)=>/^(P|π)_(GC|BS)$/.test(part)?<tspan key={i}>{part[0]}<tspan baselineShift="sub" fontSize="70%">{part.slice(2)}</tspan></tspan>:part);}
function PlateScene({p,m=false}:{p:PlateProps;m?:boolean}){const w=m?360:640,l=layout(p,m),colors=legendColors[p.id.slice(4)];return <><Defs id={p.id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{p.title}</He><He x={w/2} y={56} size={m?15:16}>{p.subtitle}</He><g data-scene="" transform={`translate(${m?4:48} ${m?67:76}) scale(${m?.55:.85})`}>{p.draw(p.id+(m?'-m':'-d'))}</g>{p.keys.map((lines,i)=>{const x=m?340:i%2===0?610:298,y=l.legend+(m?i:Math.floor(i/2))*(m?48:44),c=colors[i];return <g key={i} data-legend={i+1}><circle cx={x} cy={y-5} r={11} fill={c+'18'} stroke={c} strokeWidth={1.2}/><La x={x} y={y} size={15} color={c} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{pressureText(t)}</He>)}</g>})}{p.foot.map((s,i)=><He key={i} x={w/2} y={l.h-17-(p.foot.length-1-i)*24} size={m?14:16} color="#586b7d">{s}</He>)}</>;}
export function Plate(p:PlateProps){return <div className="p2k-plate"><style>{'.p2k-plate .immune-wide{max-width:640px;margin:auto}'}</style><Responsive id={p.id} label={p.label} h={layout(p).h} mh={layout(p,true).h} wide={<PlateScene p={p}/>} mobile={<PlateScene p={p} m/>}/></div>;}
function L({x,y,t,c=blue,size=25}:{x:number;y:number;t:string;c?:string;size?:number}){return <La x={x} y={y} size={size} color={c} bold>{pressureText('\u2066'+t+'\u2069')}</La>;}
function Surfaces({id}:{id:string}){return <defs>{[['blue','#eff8fb','#8db8cd',blue],['green','#eef9f3','#8fc0ad',green],['gold','#fff5de','#d5b373',gold],['purple','#f7effb','#c2acd2',purple],['red','#fff0ef','#dca1aa',red],['gray','#f4f7f9','#b3c2cc',gray]].map(([n,a,b,c])=><radialGradient key={n} id={id+'-'+n} cx=".28" cy=".22" r=".95"><stop stopColor={a}/><stop offset=".6" stopColor={b}/><stop offset="1" stopColor={c}/></radialGradient>)}<linearGradient id={id+'-membrane'} x2="0" y2="1"><stop stopColor="#e6cc99"/><stop offset=".25" stopColor="#fff3d7"/><stop offset=".7" stopColor="#e8dcc4"/><stop offset="1" stopColor="#bfa16f"/></linearGradient></defs>;}
function Membrane({x=25,y,w=590,id}:{x?:number;y:number;w?:number;id:string}){return <g><rect x={x} y={y} width={w} height={40} rx={8} fill={`url(#${id}-membrane)`}/>{Array.from({length:Math.floor(w/12)},(_,i)=><g key={i}><path d={`M${x+6+i*12} ${y+5}l-2 11m2-11l3 11m-3 7l-2 11m2-11l3 11`} stroke="#b6a17f" strokeWidth={1.4}/><circle cx={x+6+i*12} cy={y+3} r={4} fill="#efdbb1" stroke="#af8c51" strokeWidth={1}/><circle cx={x+6+i*12} cy={y+37} r={4} fill="#efdbb1" stroke="#af8c51" strokeWidth={1}/></g>)}</g>;}
function Protein({x,y,rx=45,ry=28,id,c='blue',bio,t}:{x:number;y:number;rx?:number;ry?:number;id:string;c?:string;bio:string;t?:string}){return <g><path data-bio={bio} d={`M${x-rx} ${y}C${x-rx-6} ${y-ry*.8} ${x-rx*.5} ${y-ry*1.2} ${x-rx*.1} ${y-ry}C${x+rx*.3} ${y-ry*1.35} ${x+rx*.95} ${y-ry*.8} ${x+rx} ${y}C${x+rx*1.12} ${y+ry*.8} ${x+rx*.15} ${y+ry*1.25} ${x-rx*.2} ${y+ry}C${x-rx*.8} ${y+ry*1.2} ${x-rx*1.12} ${y+ry*.5} ${x-rx} ${y}Z`} fill={`url(#${id+'-'+c})`} stroke={c==='purple'?purple:c==='green'?green:c==='gold'?gold:blue} strokeWidth={2}/><path d={`M${x-rx*.65} ${y-ry*.57}q${rx*.3} ${-ry*.37} ${rx*.65} ${-ry*.1}`} fill="none" stroke="#fff" strokeOpacity={.65} strokeWidth={3} strokeLinecap="round"/>{t&&<L x={x} y={y+9} t={t} c={c==='purple'?purple:c==='green'?green:c==='gold'?gold:blue}/>}</g>;}
function Myelin({x,y,w=62,id,bio='myelin'}:{x:number;y:number;w?:number;id:string;bio?:string}){return <g><rect data-bio={bio} x={x} y={y-18} width={w} height={36} rx={15} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={2}/>{[-10,-3,4,11].map(d=><path key={d} d={`M${x+11} ${y+d}h${w-22}`} stroke={d<0?'#fff1cb':'#b59159'} strokeWidth={1.5} opacity={.8}/>)}<ellipse cx={x+w-6} cy={y} rx={6} ry={15} fill="none" stroke={gold} strokeWidth={1.5}/></g>;}

export function MicrogliaStatesScene(id:string){return <><Surfaces id={id}/>
 <He x={478} y={28} size={28} bold>מצב סורק</He><He x={162} y={28} size={28} bold>תגובה לפגיעה</He>
 <path data-bio="ramified" d="M474 171Q431 149 404 114L379 101M431 145L404 158M479 171Q494 124 490 81L504 61M490 106L470 85M485 184L537 139L554 110M533 144L559 145M487 192L549 221L573 247M550 224L576 218M474 198L473 246L492 276M473 243L451 271M464 190L418 222L397 256M423 219L395 220" fill="none" stroke={purple} strokeWidth={8} strokeLinecap="round"/>
 <path d="M474 171Q431 149 404 114M479 171Q494 124 490 81M485 184L537 139M487 192L549 221M474 198L473 246M464 190L418 222" fill="none" stroke="#c9b9dc" strokeWidth={3} strokeLinecap="round"/>
 <Protein x={477} y={183} id={id} c="purple" bio="ramified" rx={25} ry={19}/><ellipse cx={477} cy={183} rx={10} ry={8} fill="#8a69a4"/>
 <Flow d="M359 185H290" id={id} color={red}/><He x={320} y={115} size={25} color={red}>פגיעה</He><L x={320} y={148} t="ATP" c={red}/>
 <He x={320} y={324} size={25}>אותות מתאים פגועים,</He><He x={320} y={355} size={25}>חלבונים מצטברים או פתוגנים</He>
 <path data-bio="amoeboid" d="M119 135C137 111 163 131 181 118Q209 113 210 145Q236 157 217 180Q230 212 199 219Q179 243 155 218Q119 232 110 206Q80 193 100 170Q90 145 119 135Z" fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={2.2}/>
 <path d="M115 159Q138 128 158 142" fill="none" stroke="#eee3f7" strokeWidth={5} strokeLinecap="round"/>
 <ellipse cx={162} cy={174} rx={21} ry={17} fill="#b193c5" stroke={purple} strokeWidth={1.5}/><circle cx={201} cy={186} r={10} fill={`url(#${id}-red)`} stroke={red} strokeWidth={1.5}/>
 {[[72,120],[56,148],[68,177]].map(([x,y],i)=><circle data-bio="cytokines" key={i} cx={x} cy={y} r={5} fill={gold} stroke="#785021" strokeWidth={1}/>)}
 <He x={320} y={412} size={25}>התא מתכנס, נודד ובולע</He><He x={320} y={446} size={25}>ומפריש ציטוקינים: ⁦IL-1β, TNF⁩</He>
 <Callout n={1} x={599} y={85} tx={546} ty={127} target="ramified"/>
 <Callout n={2} x={247} y={256} tx={207} ty={216} target="amoeboid"/>
 <Callout n={3} x={43} y={74} tx={72} ty={120} target="cytokines"/>
 </>;}

const spikes=[1,3.5,3.8,4.1,7];
function calcium(t:number){return spikes.reduce((v,t0)=>v+(t>=t0?.35*Math.exp(-(t-t0)/.9):0),0);}
export function GcampScene(id:string){const curve=Array.from({length:1001},(_,i)=>{const t=i/100;return `${i?'L':'M'}${72+t*49} ${450-calcium(t)*135}`;}).join(' ');return <><Surfaces id={id}/>
 <He x={482} y={28} size={27} bold>ללא סידן — עמום</He><He x={158} y={28} size={27} bold>קישור סידן — זוהר</He>
 <Protein x={482} y={112} id={id} c="green" rx={64} ry={42} bio="dim" t="GCaMP"/>
 <ellipse cx={158} cy={112} rx={79} ry={57} fill="#dcf6cb" opacity={.6}/><Protein x={158} y={112} id={id} c="green" rx={64} ry={42} bio="bright" t="GCaMP"/>
 {[[119,82],[177,78],[193,131]].map(([x,y],i)=><circle key={i} data-bio="calcium" cx={x} cy={y} r={7} fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={1.5}/>)}
 <Flow d="M385 112H262" id={id} color={purple}/><L x={322} y={84} t="Ca²⁺‎" c={purple}/>
 <He x={320} y={208} size={25}>פוטנציאל פעולה: כניסת ⁦Ca²⁺‎⁩</He><He x={320} y={240} size={25}>קישור ושינוי מבנה מגבירים את הזוהר</He>
 <He x={320} y={291} size={27} bold>אירועים קרובים מצטברים באות</He>
 <path d="M72 322V450H574" fill="none" stroke={gray} strokeWidth={1.5}/><He x={76} y={316} size={25} anchor="start">זוהר</He>
 <path data-bio="trace" d={curve} fill="none" stroke={green} strokeWidth={3.5}/>
 {[0,5,10].map(t=><L key={t} x={72+t*49} y={484} t={String(t)} c={gray} size={25}/>)}
 {spikes.map(t=><path key={t} data-bio="spikes" d={`M${72+t*49} 497v18`} stroke={purple} strokeWidth={3}/>)}
 <He x={320} y={548} size={25}>זמן (שניות)</He>
 <Callout n={1} x={591} y={176} tx={533} ty={135} target="dim"/>
 <Callout n={2} x={57} y={179} tx={110} ty={135} target="bright"/>
 <Callout n={3} x={599} y={509} tx={415} ty={508} target="spikes"/>
 <Callout n={4} x={594} y={350} tx={72+4.1*49} ty={450-calcium(4.1)*135} target="trace"/>
 </>;}

export function OptogeneticsScene(id:string){return <><Surfaces id={id}/>
 <He x={477} y={29} size={28} bold>הפעלה באור כחול</He><He x={162} y={29} size={28} bold>השתקה באור צהוב</He>
 <Membrane x={348} y={154} w={261} id={id}/><Membrane x={31} y={154} w={261} id={id}/>
 {[{x:478,c:'blue',t:'ChR2',bio:'chr2'},{x:162,c:'gold',t:'NpHR',bio:'nphr'}].map(({x,c,t,bio})=><g key={bio}><rect data-bio={bio} x={x-43} y={132} width={86} height={87} rx={24} fill={`url(#${id+'-'+c})`} stroke={c==='blue'?blue:gold} strokeWidth={2}/><L x={x} y={174} t={t} c={c==='blue'?blue:gold} size={27}/><path d={`M${x-22} 190v20m44-20v20`} stroke={c==='blue'?blue:gold} strokeWidth={3}/></g>)}
 <Flow d="M397 69Q410 92 457 140" id={id} color={blue}/><Flow d="M80 69Q95 92 141 140" id={id} color={gold}/>
 <Flow d="M478 85V125" id={id} color={blue}/><Flow d="M478 190V257" id={id} color={blue}/><L x={530} y={117} t="Na⁺" c={blue} size={25}/>
 <Flow d="M162 85V125" id={id} color={gold}/><Flow d="M162 190V257" id={id} color={gold}/><L x={214} y={117} t="Cl⁻" c={gold} size={25}/>
 <He x={477} y={298} size={25} color={blue}>כניסת יונים דרך תעלה</He><He x={162} y={298} size={25} color={gold}>משאבת יונים מונעת באור</He>
 <path d="M359 375H415L428 333L442 394L452 375H602" fill="none" stroke={blue} strokeWidth={3}/><path d="M43 360H104Q121 361 129 385H286" fill="none" stroke={gold} strokeWidth={3}/>
 <He x={477} y={437} size={25} color={blue}>ירי בדיוק של אלפיות שנייה</He><He x={162} y={437} size={25} color={gold}>היפרפולריזציה — שקט</He>
 <He x={320} y={500} size={25}>ביטוי בסוג תאים מסוים בעזרת ⁦Cre⁩</He><He x={320} y={533} size={25}>ונגיף הנושא מקטע ⁦DIO⁩</He>
 <Callout n={1} x={376} y={241} tx={437} ty={194} target="chr2"/>
 <Callout n={2} x={58} y={241} tx={121} ty={194} target="nphr"/>
 </>;}

export function SaltatoryConductionScene(id:string){const nodes=[75,215,355,495];return <><Surfaces id={id}/>
 <He x={320} y={29} size={28} bold>אקסון ממוילן — הולכה קופצנית</He>
 <path data-bio="axon" d="M35 163H608" stroke={blue} strokeWidth={16} strokeLinecap="round"/><path d="M35 159H608" stroke="#b2d3df" strokeWidth={5}/>
 {[89,229,369,509].map((x,i)=><Myelin key={x} x={x} y={163} w={i===3?95:110} id={id}/>)}
 {nodes.map(x=><g key={x}>{[-6,0,6].map(dx=><circle data-bio="node" key={dx} cx={x+dx} cy={163} r={3} fill={red}/>)}</g>)}
 {nodes.slice(0,3).map(x=><Flow key={x} d={`M${x} 125Q${x+68} 65 ${x+140} 125`} id={id} color={red}/>)}
 <He x={320} y={249} size={25}>תעלות ⁦Na⁺⁩ מרוכזות בצמתי רנווייה</He><He x={320} y={281} size={25}>פוטנציאל הפעולה מתחדש רק בצמתים</He>
 <He x={320} y={352} size={28} bold>אקסון חשוף — הולכה רציפה</He>
 <path data-bio="unmyelinated" d="M35 421H608" stroke={blue} strokeWidth={16} strokeLinecap="round"/><path d="M35 417H608" stroke="#b2d3df" strokeWidth={5}/>
 {Array.from({length:21},(_,i)=><circle key={i} cx={47+i*27} cy={421} r={3} fill={red}/>)}
 <Flow d="M75 472H269" id={id} color={red}/><He x={320} y={526} size={25}>התחדשות בכל נקודה — התקדמות איטית</He>
 <Callout n={1} x={289} y={205} tx={289} ty={180} target="myelin"/>
 <Callout n={2} x={41} y={215} tx={75} ty={163} target="node"/>
 <Callout n={3} x={572} y={476} tx={572} ty={421} target="unmyelinated"/>
 </>;}

function SarcomereRow({y,half,id,contracted=false}:{y:number;half:number;id:string;contracted?:boolean}){const l=320-half,r=320+half;return <g>
 <rect x={208} y={y-43} width={224} height={86} rx={5} fill="#e7f0f6" opacity={.6}/>
 {[l,r].map(x=><g key={x}><path data-bio="zdisc" d={`M${x} ${y-46}v92`} stroke={gray} strokeWidth={7}/>{[-34,-17,0,17,34].map(d=><path key={d} d={`M${x-6} ${y+d-6}l12 12`} stroke="#b8c4cc" strokeWidth={2}/>)}</g>)}
 {[-27,-9,9,27].map((dy,i)=><g key={i}>{[l,r-133].map((x,j)=><g key={j}>{Array.from({length:20},(_,k)=><circle key={k} data-bio="actin" cx={x+k*7} cy={y+dy+2*Math.sin(k*Math.PI/2)} r={3.3} fill={`url(#${id}-red)`} stroke={red} strokeWidth={.9}/>)}</g>)}</g>)}
 {[-18,0,18].map(d=><g key={d}><rect data-bio="myosin" x={208} y={y+d-4} width={224} height={8} rx={4} fill={`url(#${id}-blue)`} stroke={blue} strokeWidth={1.4}/><path d={`M214 ${y+d-2}H426`} stroke="#d5eaf3" strokeWidth={1.3} opacity={.8}/>{[224,248,272,368,392,416].map(x=><path key={x} d={`M${x} ${y+d}l${x<320?-7:7} -6`} stroke={blue} strokeWidth={2}/>)}</g>)}
 <He x={320} y={y-104} size={27} bold>{contracted?'מכווץ':'רפוי'}</He>
 <path d={`M208 ${y+69}H432`} stroke={blue} strokeWidth={1.5}/><He x={320} y={y+102} size={25} color={blue}>פס ⁦A⁩ {contracted?'ללא שינוי':''}</He>
 {!contracted&&<><path d={`M${l} ${y-59}H208M${l+133} ${y-59}H${r-133}`} stroke={gray} strokeWidth={1.2}/><He x={(l+208)/2} y={y-69} size={25}>פס ⁦I⁩</He><He x={320} y={y-69} size={25}>אזור ⁦H⁩</He></>}
 </g>;}
export function SarcomereScene(id:string){return <><Surfaces id={id}/>
 <SarcomereRow y={124} half={196} id={id}/><SarcomereRow y={399} half={147} id={id} contracted/>
 <He x={320} y={555} size={25}>פס ⁦I⁩ ואזור ⁦H⁩ מתקצרים</He>
 <Callout n={1} x={70} y={87} tx={124} ty={83} target="zdisc"/>
 <Callout n={2} x={78} y={179} tx={149} ty={151} target="actin"/>
 <Callout n={3} x={568} y={169} tx={423} ty={142} target="myosin"/>
 </>;}

export function GlomerularStarlingScene(id:string){return <><Surfaces id={id}/>
 <He x={320} y={28} size={27} bold>שלושה לחצים קובעים את הסינון</He>
 <defs><linearGradient id={id+'-blood'} x2="0" y2="1"><stop stopColor="#f5c2c2"/><stop offset=".5" stopColor="#c9747e"/><stop offset="1" stopColor="#944652"/></linearGradient></defs>
 <path data-bio="bowman" d="M75 205Q115 409 320 414Q525 409 565 205" fill="#f6f0df" stroke={gold} strokeWidth={2}/>
 <path data-bio="capillary" d="M43 139H142Q320 27 498 139H600V178H498Q320 90 142 178H43Z" fill={`url(#${id}-blood)`} stroke={red} strokeWidth={2}/>
 <path d="M51 151H139Q320 43 500 151H588" fill="none" stroke="#ffe1de" strokeWidth={3} opacity={.65}/>
 <He x={102} y={95} size={25} color={red}>עורקיק מוביל</He><He x={535} y={95} size={25} color={red}>עורקיק מוציא</He>
 <Flow d="M63 164H118" id={id} color={red}/><Flow d="M523 164H581" id={id} color={red}/>
 <path data-bio="hydrostatic" data-flow="" d="M317 130V260" fill="none" stroke={red} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/><L x={399} y={222} t="P_GC ≈ 55" c={red} size={25}/>
 <path data-bio="bowman-pressure" data-flow="" d="M471 315V198" fill="none" stroke={gray} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/><L x={392} y={335} t="P_BS ≈ 15" c={gray} size={25}/>
 <path data-bio="oncotic" data-flow="" d="M171 315V198" fill="none" stroke={blue} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/><L x={235} y={280} t="π_GC" c={blue} size={25}/><L x={235} y={313} t="25 → 35" c={blue} size={25}/>
 <He x={320} y={370} size={25}>הסנן בקופסית באומן</He>
 <He x={320} y={464} size={25}>בתחילת הנימים: <tspan direction="ltr" style={{unicodeBidi:'isolate'}}>⁦55 − 15 − 25 ≈ 15⁩</tspan></He><He x={320} y={498} size={25}>בסוף הנימים: <tspan direction="ltr" style={{unicodeBidi:'isolate'}}>⁦55 − 15 − 35 ≈ 5⁩</tspan> מ״מ כספית</He>
 <He x={320} y={546} size={25}>חלבוני הפלזמה מתרכזים — הנטו יורד</He>
 <Callout n={1} x={384} y={280} tx={317} ty={259} target="hydrostatic"/>
 <Callout n={2} x={572} y={350} tx={471} ty={315} target="bowman-pressure"/>
 <Callout n={3} x={48} y={350} tx={171} ty={315} target="oncotic"/>
 <Callout n={4} x={287} y={67} tx={253} ty={102} target="capillary"/>
 </>;}

