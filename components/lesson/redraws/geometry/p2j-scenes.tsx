import type React from 'react';
import {He,La,Callout,Flow} from './ub-zoo';
import {Responsive} from './immune';
const blue='#346f91',green='#337a69',gold='#a27335',purple='#7b5b98',red='#ad4e5b',gray='#627588';
type PlateProps={id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string[];sceneH?:number};
function Defs({id}:{id:string}){return <defs><marker id={id+'-arrow'} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M1 1L9 5L1 9Z" fill="context-stroke"/></marker></defs>;}
const legendColors:Record<string,string[]>={termination:[red,red,gold,gold,blue],neuronparts:[blue,blue,red,blue,gold,blue,green],gliatypes:[green,gold,gold,purple],receptortypes:[blue,purple,gold,green],cortexmigration:[blue,green,gold,red],appprocessing:[gray,green,red,purple,red]};
function layout(p:PlateProps,m=false){const legend=(m?67:76)+(p.sceneH||330)*(m?.55:.85)+32,rows=m?p.keys.length:Math.ceil(p.keys.length/2);return {legend,h:legend+(rows-1)*(m?48:44)+20+40+(p.foot.length-1)*24+17};}
function PlateScene({p,m=false}:{p:PlateProps;m?:boolean}){const w=m?360:640,l=layout(p,m),colors=legendColors[p.id.slice(4)];return <><Defs id={p.id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{p.title}</He><He x={w/2} y={56} size={m?15:16}>{p.subtitle}</He><g data-scene="" transform={`translate(${m?4:48} ${m?67:76}) scale(${m?.55:.85})`}>{p.draw(p.id+(m?'-m':'-d'))}</g>{p.keys.map((lines,i)=>{const x=m?340:i%2===0?610:298,y=l.legend+(m?i:Math.floor(i/2))*(m?48:44),c=colors[i];return <g key={i} data-legend={i+1}><circle cx={x} cy={y-5} r={11} fill={c+'18'} stroke={c} strokeWidth={1.2}/><La x={x} y={y} size={15} color={c} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{t}</He>)}</g>})}{p.foot.map((s,i)=><He key={i} x={w/2} y={l.h-17-(p.foot.length-1-i)*24} size={m?14:16} color="#586b7d">{s}</He>)}</>;}
export function Plate(p:PlateProps){return <div className="p2j-plate"><style>{'.p2j-plate .immune-wide{max-width:640px;margin:auto}'}</style><Responsive id={p.id} label={p.label} h={layout(p).h} mh={layout(p,true).h} wide={<PlateScene p={p}/>} mobile={<PlateScene p={p} m/>}/></div>;}
function L({x,y,t,c=blue,size=25}:{x:number;y:number;t:string;c?:string;size?:number}){return <La x={x} y={y} size={size} color={c} bold>{'\u2066'+t+'\u2069'}</La>;}
function Surfaces({id}:{id:string}){return <defs>{[['blue','#eff8fb','#8db8cd',blue],['green','#eef9f3','#8fc0ad',green],['gold','#fff5de','#d5b373',gold],['purple','#f7effb','#c2acd2',purple],['red','#fff0ef','#dca1aa',red],['gray','#f4f7f9','#b3c2cc',gray]].map(([n,a,b,c])=><radialGradient key={n} id={id+'-'+n} cx=".28" cy=".22" r=".95"><stop stopColor={a}/><stop offset=".6" stopColor={b}/><stop offset="1" stopColor={c}/></radialGradient>)}<linearGradient id={id+'-membrane'} x2="0" y2="1"><stop stopColor="#e6cc99"/><stop offset=".25" stopColor="#fff3d7"/><stop offset=".7" stopColor="#e8dcc4"/><stop offset="1" stopColor="#bfa16f"/></linearGradient></defs>;}
function Membrane({x=25,y,w=590,id}:{x?:number;y:number;w?:number;id:string}){return <g><rect x={x} y={y} width={w} height={40} rx={8} fill={`url(#${id}-membrane)`}/>{Array.from({length:Math.floor(w/12)},(_,i)=><g key={i}><path d={`M${x+6+i*12} ${y+5}l-2 11m2-11l3 11m-3 7l-2 11m2-11l3 11`} stroke="#b6a17f" strokeWidth={1.4}/><circle cx={x+6+i*12} cy={y+3} r={4} fill="#efdbb1" stroke="#af8c51" strokeWidth={1}/><circle cx={x+6+i*12} cy={y+37} r={4} fill="#efdbb1" stroke="#af8c51" strokeWidth={1}/></g>)}</g>;}
function Protein({x,y,rx=45,ry=28,id,c='blue',bio,t}:{x:number;y:number;rx?:number;ry?:number;id:string;c?:string;bio:string;t?:string}){return <g><path data-bio={bio} d={`M${x-rx} ${y}C${x-rx-6} ${y-ry*.8} ${x-rx*.5} ${y-ry*1.2} ${x-rx*.1} ${y-ry}C${x+rx*.3} ${y-ry*1.35} ${x+rx*.95} ${y-ry*.8} ${x+rx} ${y}C${x+rx*1.12} ${y+ry*.8} ${x+rx*.15} ${y+ry*1.25} ${x-rx*.2} ${y+ry}C${x-rx*.8} ${y+ry*1.2} ${x-rx*1.12} ${y+ry*.5} ${x-rx} ${y}Z`} fill={`url(#${id+'-'+c})`} stroke={c==='purple'?purple:c==='green'?green:c==='gold'?gold:blue} strokeWidth={2}/><path d={`M${x-rx*.65} ${y-ry*.57}q${rx*.3} ${-ry*.37} ${rx*.65} ${-ry*.1}`} fill="none" stroke="#fff" strokeOpacity={.65} strokeWidth={3} strokeLinecap="round"/>{t&&<L x={x} y={y+9} t={t} c={c==='purple'?purple:c==='green'?green:c==='gold'?gold:blue}/>}</g>;}
function Myelin({x,y,w=62,id,bio='myelin'}:{x:number;y:number;w?:number;id:string;bio?:string}){return <g><rect data-bio={bio} x={x} y={y-18} width={w} height={36} rx={15} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={2}/>{[-10,-3,4,11].map(d=><path key={d} d={`M${x+11} ${y+d}h${w-22}`} stroke={d<0?'#fff1cb':'#b59159'} strokeWidth={1.5} opacity={.8}/>)}<ellipse cx={x+w-6} cy={y} rx={6} ry={15} fill="none" stroke={gold} strokeWidth={1.5}/></g>;}
function Ribo({x,y,id,release=false}:{x:number;y:number;id:string;release?:boolean}){return <g>
 <path data-bio={release?'large-free':'ribosome'} d={`M${x-85} ${y}C${x-103} ${y-68} ${x-50} ${y-105} ${x-8} ${y-88}C${x+35} ${y-119} ${x+98} ${y-71} ${x+84} ${y}Z`} fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={2}/>
 <path d={`M${x-66} ${y-57}q22-34 51-19m20-1q33-16 55 20`} fill="none" stroke="#f6edf9" strokeWidth={4} strokeLinecap="round"/>
 <path data-bio={release?'small-free':'small'} d={`M${x-83} ${y+(release?56:20)}q83 37 166 0v22q-83 38-166 0Z`} fill={`url(#${id}-blue)`} stroke={blue} strokeWidth={2}/>
 {!release&&<><path data-bio="trna" d={`M${x-14} ${y+14}v-57m0 30h-14m14-11h13`} stroke={green} strokeWidth={7} strokeLinecap="round"/><L x={x-14} y={y+84} t="P" c={green}/><L x={x+43} y={y+84} t="A" c={red}/><rect data-bio="stop" x={x+13} y={y+21} width={65} height={34} rx={5} fill="#fbe7e9" stroke={red} strokeWidth={1.5}/><L x={x+46} y={y+47} t="UAA" c={red}/><path d={`M${x-90} ${y+25}h100m69 0h18`} stroke={blue} strokeWidth={4}/></>}
 </g>;}

export function TerminationScene(id:string){return <><Surfaces id={id}/>
 <He x={475} y={27} size={27} bold>זיהוי קודון העצירה</He><He x={167} y={27} size={27} bold>שחרור השרשרת</He>
 <Ribo x={475} y={166} id={id}/>
 <path data-bio="rf" d="M490 172v-49q-6-25 27-25q33 0 31 25v49Z" fill={`url(#${id}-red)`} stroke={red} strokeWidth={2}/>
 <L x={519} y={143} t="GGQ" c={red} size={25}/>
 <path data-bio="peptide" d="M461 121q-28-12-36-41" fill="none" stroke={gold} strokeWidth={8}/>{[0,1,2,3].map(i=><circle key={i} cx={425+i*9} cy={80+i*12} r={7} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={1.5}/>)}
 <Flow d="M366 151H291" id={id} color={green}/><He x={328} y={118} size={25} color={green}>מים</He>
 <Ribo x={167} y={166} id={id} release/>
 {[0,1,2,3].map(i=><circle data-bio="released" key={i} cx={123+i*20} cy={65-10*Math.sin(i)} r={9} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={1.5}/>)}
 <He x={320} y={321} size={25}>מים מנתקים את השרשרת מה־⁦tRNA⁩</He>
 <He x={320} y={360} size={25}>לאחר השחרור: פינוי גורמים ומיחזור</He>
 <Protein x={475} y={424} rx={67} ry={29} bio="rf3" id={id} c="gold" t="RF3"/>
 <Flow d="M377 425H288" id={id} color={blue}/>
 <Protein x={168} y={424} rx={103} ry={29} bio="recycling" id={id} c="blue" t="RRF + EF-G"/>
 <He x={320} y={497} size={25}>היחידות נפרדות ומשתתפות בתרגום נוסף</He>
 <Callout n={1} x={599} y={235} tx={553} ty={203} target="stop"/>
 <Callout n={2} x={595} y={105} tx={548} ty={120} target="rf"/>
 <Callout n={3} x={57} y={64} tx={114} ty={65} target="released"/>
 <Callout n={4} x={568} y={470} tx={522} ty={447} target="rf3"/>
 <Callout n={5} x={46} y={471} tx={90} ty={443} target="recycling"/>
 </>;}

export function NeuronPartsScene(id:string){return <><Surfaces id={id}/>
 <He x={320} y={27} size={27} bold>מקליטת מידע להעברה בסינפסה</He>
 <path data-bio="dendrites" d="M143 176Q101 137 75 100L52 74M91 124L45 125M134 177L65 188L35 213M120 201L83 254L58 274M146 156L155 93L141 61M156 108L186 83" fill="none" stroke={blue} strokeWidth={12} strokeLinecap="round"/>
 <path d="M143 176Q101 137 75 100M134 177L65 188M120 201L83 254M146 156L155 93" fill="none" stroke="#a3cbda" strokeWidth={5} strokeLinecap="round"/>
 {[[63,88,-6,-11],[48,126,-5,-13],[47,204,-12,-2],[89,247,12,2],[153,96,-12,-4]].map(([x,y,dx,dy],i)=><g key={i}><path d={`M${x} ${y}l${dx} ${dy}`} stroke={blue} strokeWidth={3}/><circle cx={x+dx} cy={y+dy} r={4} fill={`url(#${id}-blue)`} stroke={blue} strokeWidth={1}/></g>)}
 <path data-bio="soma" d="M118 161Q131 131 159 145L181 170Q205 190 177 215Q145 236 117 213Q97 196 118 161Z" fill={`url(#${id}-blue)`} stroke={blue} strokeWidth={2.5}/>
 <circle data-bio="nucleus" cx={148} cy={183} r={20} fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={1.8}/><circle cx={143} cy={177} r={5} fill="#eee3f4"/>
 <path data-bio="hillock" d="M182 177Q199 183 219 184V196Q199 197 181 206Z" fill={`url(#${id}-red)`} stroke={red} strokeWidth={2}/>
 <path data-bio="axon" d="M219 190H526" stroke={blue} strokeWidth={10} strokeLinecap="round"/>
 <path data-bio="initial" d="M219 190H250" stroke={red} strokeWidth={10}/>
 {[260,328,396,464].map(x=><Myelin key={x} x={x} y={190} w={52} id={id}/>)}
 <path data-bio="node" d="M380 190H396" stroke={blue} strokeWidth={10}/>
 <path d="M526 190Q549 153 567 127M526 190H578M526 190Q549 230 566 254" stroke={blue} strokeWidth={7} fill="none" strokeLinecap="round"/>
 {[[576,117],[589,190],[576,265]].map(([x,y])=><g key={y}><ellipse data-bio="terminal" cx={x} cy={y} rx={19} ry={17} fill={`url(#${id}-green)`} stroke={green} strokeWidth={2}/>{[[-6,-4],[6,-2],[0,7]].map(([dx,dy],i)=><circle key={i} cx={x+dx} cy={y+dy} r={3.5} fill="#e8f8ee" stroke={green} strokeWidth={1}/>)}</g>)}
 <Flow d="M219 324H529" id={id} color={blue}/><He x={366} y={366} size={25}>כיוון העברת המידע</He>
 <Callout n={1} x={38} y={42} tx={68} ty={91} target="dendrites"/>
 <Callout n={2} x={193} y={124} tx={162} ty={155} target="soma"/>
 <Callout n={3} x={199} y={261} tx={229} ty={190} target="initial"/>
 <Callout n={4} x={310} y={261} tx={320} ty={190} target="axon"/>
 <Callout n={5} x={357} y={116} tx={357} ty={172} target="myelin"/>
 <Callout n={6} x={422} y={263} tx={389} ty={190} target="node"/>
 <Callout n={7} x={609} y={314} tx={587} ty={278} target="terminal"/>
 </>;}

export function GliaTypesScene(id:string){return <><Surfaces id={id}/>
 <He x={477} y={27} size={27} bold color={green}>אסטרוציט</He><He x={162} y={27} size={27} bold color={gold}>אוליגודנדרוציט</He>
 <path d="M480 113L437 78L416 72M480 113L514 72L537 60M480 113L526 135L565 135M480 113L442 154L429 191M480 113L491 166L521 182" stroke={green} strokeWidth={9} fill="none" strokeLinecap="round"/>
 <path d="M480 113L437 78M480 113L491 166" stroke="#bee1cf" strokeWidth={3} fill="none"/>
 <Protein x={480} y={113} rx={28} ry={25} id={id} c="green" bio="astro"/><circle cx={480} cy={113} r={8} fill={green}/>
 <rect data-bio="vessel" x={389} y={190} width={85} height={22} rx={10} fill={`url(#${id}-red)`} stroke={red} strokeWidth={2}/><path d="M411 194h43" stroke="#fce6e7" strokeWidth={3}/>
 <path d="M521 182q27 9 31-9" stroke={green} strokeWidth={8} fill="none" strokeLinecap="round"/>
 <ellipse data-bio="synapse" cx={542} cy={160} rx={16} ry={12} fill={`url(#${id}-blue)`} stroke={blue} strokeWidth={2}/><path d="M524 183h36" stroke={blue} strokeWidth={5} strokeLinecap="round"/>
 <He x={432} y={248} size={25} color={red}>כלי דם</He><He x={551} y={225} size={25} color={blue}>סינפסה</He>
 <Protein x={160} y={88} rx={27} ry={23} id={id} c="gold" bio="oligo"/><circle cx={160} cy={88} r={7} fill={gold}/>
 <path d="M148 109L103 145M160 113V176M173 107L222 207" stroke={gold} strokeWidth={4} fill="none"/>
 {[145,176,207].map((y,i)=><g key={y}><path d={`M36 ${y}H286`} stroke={blue} strokeWidth={5}/><Myelin x={75+i*57} y={y} w={56} id={id}/></g>)}
 <He x={162} y={250} size={25}>תא אחד · כמה אקסונים</He>
 <He x={477} y={306} size={27} bold color={red}>תא שוואן</He><He x={162} y={306} size={27} bold color={purple}>מיקרוגליה</He>
 <path d="M368 386H589" stroke={blue} strokeWidth={7}/><Myelin x={419} y={386} w={118} id={id} bio="schwann"/>
 <ellipse cx={474} cy={359} rx={15} ry={9} fill={`url(#${id}-red)`} stroke={red} strokeWidth={1.7}/>
 <He x={477} y={457} size={25}>תא אחד · מקטע אחד</He>
 <path d="M158 385L121 358L88 349M122 359L111 335M158 385L204 353L229 345M203 354L210 329M158 385L115 407L90 433M116 407L85 402M158 385L203 412L230 431M205 412L233 403" stroke={purple} strokeWidth={4} fill="none" strokeLinecap="round"/>
 <Protein x={158} y={385} rx={24} ry={18} id={id} c="purple" bio="micro"/><circle cx={158} cy={385} r={6} fill={purple}/>
 <He x={162} y={478} size={25}>תא חיסון · שלוחות סורקות</He>
 <Callout n={1} x={590} y={84} tx={508} ty={111} target="astro"/>
 <Callout n={2} x={53} y={70} tx={133} ty={86} target="oligo"/>
 <Callout n={3} x={580} y={360} tx={537} ty={382} target="schwann"/>
 <Callout n={4} x={57} y={383} tx={133} ty={383} target="micro"/>
 </>;}

export function ReceptorTypesScene(id:string){return <><Surfaces id={id}/>
 <He x={482} y={27} size={27} bold color={blue}>יונוטרופי</He><He x={161} y={27} size={27} bold color={purple}>מטבוטרופי</He>
 <He x={320} y={76} size={25}>קישור מוליך עצבי בצד החוץ־תאי</He>
 <Membrane y={152} id={id}/>
 {[450,488].map(x=><path data-bio="ionotropic" key={x} d={`M${x} 124q12-17 24 0v87q-12 12-24 0Z`} fill={`url(#${id}-blue)`} stroke={blue} strokeWidth={2}/>)}
 <circle data-bio="ligand" cx={449} cy={114} r={9} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={2}/>
 <Flow d="M482 99V244" id={id} color={blue}/><L x={535} y={114} t="Na⁺" c={blue}/>
 <He x={483} y={302} size={25} color={blue}>הקולטן עצמו הוא תעלה</He><He x={483} y={340} size={25}>תגובה באלפיות שנייה</He>
 {Array.from({length:7},(_,i)=><g key={i}><rect data-bio="gpcr" x={58+i*14} y={133} width={11} height={75} rx={5} fill={`url(#${id}-purple)`} stroke={purple} strokeWidth={1.5}/>{i<6&&<path d={`M${63+i*14} ${i%2?133:208}q7 ${i%2?-13:13} 14 0`} stroke={purple} strokeWidth={2} fill="none"/>}</g>)}
 <circle cx={68} cy={119} r={9} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={2}/>
 <Protein x={156} y={257} rx={41} ry={23} id={id} c="gold" bio="gprotein" t="G"/>
 <Flow d="M107 225Q107 252 113 253" id={id} color={purple}/>
 {[261,296].map(x=><rect data-bio="effector-channel" key={x} x={x} y={130} width={23} height={80} rx={9} fill={`url(#${id}-green)`} stroke={green} strokeWidth={2}/>)}
 <Flow d="M208 253Q238 250 258 224" id={id} color={gold}/>
 <He x={162} y={340} size={25}>תעלה אחרת או שליח שני</He><He x={162} y={381} size={25}>תגובה איטית וממושכת</He>
 <Callout n={1} x={587} y={223} tx={512} ty={202} target="ionotropic"/>
 <Callout n={2} x={35} y={265} tx={58} ty={190} target="gpcr"/>
 <Callout n={3} x={156} y={300} tx={156} ty={281} target="gprotein"/>
 <Callout n={4} x={358} y={124} tx={319} ty={151} target="effector-channel"/>
 </>;}

export function CortexMigrationScene(id:string){return <><Surfaces id={id}/>
 <He x={320} y={27} size={27} bold>גלי לידה ונדידה — מבפנים החוצה</He>
 <rect x={125} y={65} width={365} height={38} rx={7} fill="#f5e1e8"/>
 <Protein x={350} y={81} rx={25} ry={11} id={id} c="red" bio="cajal"/>
 <L x={223} y={91} t="Reelin" c={red}/>
 {[[128,'2/3'],[196,'4'],[264,'5'],[332,'6']].map(([v,t],i)=><g key={t}><rect x={125} y={Number(v)-18} width={365} height={50} rx={6} fill={i<2?'#f4eee2':'#edf3f6'}/><He x={550} y={Number(v)+13} size={25}>שכבה ⁦{t}⁩</He></g>)}
 <rect data-bio="ventricular" x={125} y={397} width={365} height={53} rx={7} fill="#daeaf3" stroke="#a6c4d5" strokeWidth={1.5}/>
 {[177,252,327,402].map((x,i)=><g key={x}><path data-bio="radial" d={`M${x} 420Q${x-8} 260 ${x} 103`} stroke={green} strokeWidth={5} fill="none"/><path d={`M${x} 106l-9-11m9 11l10-11`} stroke={green} strokeWidth={2}/><ellipse cx={x} cy={423} rx={12} ry={17} fill={`url(#${id}-green)`} stroke={green} strokeWidth={2}/>
 <path data-bio="migrating" d={`M${x+6} ${326-i*63}q16-17 4-38q-7-15-5-29q-12 21-12 35q-15 25 13 32Z`} fill={`url(#${id}-gold)`} stroke={gold} strokeWidth={2}/><ellipse cx={x+5} cy={308-i*63} rx={5} ry={9} fill={gold}/></g>)}
 <Flow d="M83 342V142" id={id} color={gold}/>
 <He x={320} y={492} size={25}>אזור חדרי: תאי גזע וגלייה רדיאלית</He>
 <He x={320} y={533} size={25}>מוקדם: שכבות ⁦6, 5⁩ · מאוחר: ⁦4, 2/3⁩</He>
 <He x={320} y={574} size={25}>גל מאוחר עובר את הנוירונים שנולדו לפניו</He>
 <He x={550} y={92} size={25}>שכבה ⁦1⁩</He>
 <Callout n={1} x={573} y={426} tx={490} ty={426} target="ventricular"/>
 <Callout n={2} x={461} y={367} tx={399.6} ty={360} target="radial"/>
 <Callout n={3} x={44} y={363} tx={183} ty={319} target="migrating"/>
 <Callout n={4} x={434} y={80} tx={375} ty={81} target="cajal"/>
 </>;}

function AppStem({x,id}:{x:number;id:string}){return <g><rect data-bio="app" x={x-16} y={166} width={32} height={162} rx={13} fill={`url(#${id}-gray)`} stroke={gray} strokeWidth={2}/><rect data-bio="app" x={x-40} y={108} width={80} height={71} rx={20} fill={`url(#${id}-gray)`} stroke={gray} strokeWidth={2}/><rect data-bio="ab-domain" x={x-16} y={182} width={32} height={83} rx={3} fill={`url(#${id}-red)`} stroke={red} strokeWidth={2}/><L x={x} y={151} t="APP" c={gray}/></g>;}
export function AppProcessingScene(id:string){return <><Surfaces id={id}/>
 <He x={479} y={27} size={27} bold color={green}>לא־עמילואידוגני</He><He x={165} y={27} size={27} bold color={red}>עמילואידוגני</He>
 <He x={320} y={72} size={25}>החלק העליון חוץ־תאי</He>
 <Membrane x={25} y={225} w={280} id={id}/><Membrane x={335} y={225} w={280} id={id}/>
 <AppStem x={165} id={id}/><AppStem x={479} id={id}/>
 <path data-bio="alpha-cut" d="M454 207h50" stroke="white" strokeWidth={8}/><path data-bio="alpha-cut" d="M450 207h58" stroke={green} strokeWidth={3} strokeDasharray="5 4"/>
 <path data-bio="beta-cut" d="M140 179h50" stroke="white" strokeWidth={8}/><path data-bio="beta-cut" d="M136 179h58" stroke={red} strokeWidth={3} strokeDasharray="5 4"/>
 <path data-bio="gamma-cut" d="M140 263h50" stroke="white" strokeWidth={8}/><path data-bio="gamma-cut" d="M136 263h58" stroke={purple} strokeWidth={3} strokeDasharray="5 4"/>
 <Flow d="M130 203Q74 204 75 150" id={id} color={red}/>
 <path data-bio="ab-released" d="M54 124q17-14 34 0q-17 13-34 0" stroke={red} strokeWidth={8} fill="none" strokeLinecap="round"/>
 <He x={479} y={370} size={25} color={green}>חיתוך בתוך קטע ⁦Aβ⁩</He>
 <L x={479} y={409} t="α-secretase" c={green}/><He x={479} y={454} size={25} color={green}>לא נוצר ⁦Aβ⁩ שלם</He>
 <L x={165} y={370} t="β-secretase" c={red}/><L x={165} y={408} t="BACE1" c={red}/><He x={165} y={449} size={25}>ואחריו</He><L x={165} y={488} t="γ-secretase" c={purple}/><L x={165} y={526} t="presenilin" c={purple}/>
 <He x={320} y={580} size={25}>תוצר משוחרר: ⁦Aβ40⁩ או ⁦Aβ42⁩</He>
 <Callout n={1} x={576} y={118} tx={495} ty={120} target="app"/>
 <Callout n={2} x={573} y={190} tx={505} ty={207} target="alpha-cut"/>
 <Callout n={3} x={246} y={139} tx={192} ty={179} target="beta-cut"/>
 <Callout n={4} x={245} y={312} tx={191} ty={263} target="gamma-cut"/>
 <Callout n={5} x={32} y={79} tx={60} ty={120} target="ab-released"/>
 </>;}
