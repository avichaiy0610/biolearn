import type React from 'react';
import {He,La,IC,Callout,Flow} from './ub-zoo';
import {Responsive,Defs} from './immune';
type Props={id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string[];sceneH?:number};
function layout(p:Props,m=false){const legend=(m?67:76)+(p.sceneH||330)*(m?.55:.85)+32,rows=m?p.keys.length:Math.ceil(p.keys.length/2);return {legend,h:legend+(rows-1)*(m?48:44)+20+40+(p.foot.length-1)*24+17};}
function PlateScene({p,m=false}:{p:Props;m?:boolean}){const w=m?360:640,l=layout(p,m);return <><Defs id={p.id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{p.title}</He><He x={w/2} y={56} size={m?15:16}>{p.subtitle}</He><g data-scene="" transform={`translate(${m?4:48} ${m?67:76}) scale(${m?.55:.85})`}>{p.draw(p.id+(m?'-m':'-d'))}</g>{p.keys.map((lines,i)=>{const x=m?340:i%2===0?610:298,y=l.legend+(m?i:Math.floor(i/2))*(m?48:44);return <g key={i} data-legend={i+1}><circle cx={x} cy={y-5} r={11} fill="#ecf2f6"/><La x={x} y={y} size={15} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{t}</He>)}</g>})}{p.foot.map((s,i)=><He key={i} x={w/2} y={l.h-17-(p.foot.length-1-i)*24} size={m?14:16} color={IC.muted}>{s}</He>)}</>;}
export function Plate(p:Props){return <div className="p2c-plate"><style>{'.p2c-plate .immune-wide{max-width:640px;margin:auto}'}</style><Responsive id={p.id} label={p.label} h={layout(p).h} mh={layout(p,true).h} wide={<PlateScene p={p}/>} mobile={<PlateScene p={p} m/>}/></div>;}

function Membrane({x=25,y=110,w=590}:{x?:number;y?:number;w?:number}){return <g><rect x={x} y={y} width={w} height={20} rx={5} fill="#eee3ce"/>{Array.from({length:Math.floor(w/10)},(_,i)=><g key={i}><path d={`M${x+5+i*10} ${y+4}v12`} stroke="#b99f72" strokeWidth={2}/><circle cx={x+5+i*10} cy={y} r={3} fill="#b99f72"/><circle cx={x+5+i*10} cy={y+20} r={3} fill="#b99f72"/></g>)}</g>;}
function Ligand({x,y}:{x:number;y:number}){return <path data-bio="ligand" d={`M${x} ${y-13}l17 26h-34Z`} fill={IC.gold} stroke={IC.goldDark} strokeWidth={2}/>;}
function Receptor({x,y=110,active=false,bio='receptor'}:{x:number;y?:number;active?:boolean;bio?:string}){return <g><rect data-bio={bio} x={x-10} y={y-58} width={20} height={58} rx={8} fill="#dfd3e9" stroke={IC.purple} strokeWidth={2}/><path d={`M${x} ${y}v25`} stroke={IC.purple} strokeWidth={5}/><rect data-bio={active?'kinase-active':'kinase-idle'} x={x-15} y={y+24} width={30} height={54} rx={9} fill={active?'#d5e7db':IC.bluePale} stroke={active?IC.green:IC.blueDark} strokeWidth={2}/></g>;}
function Phosphate({x,y}:{x:number;y:number}){return <circle data-bio="phosphate" cx={x} cy={y} r={8} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>;}
function SevenPass({x,y}:{x:number;y:number}){return <g>{Array.from({length:7},(_,i)=><g key={i}><rect data-bio="seven-pass" x={x+i*10} y={y-8} width={8} height={36} rx={4} fill="#dfd3e9" stroke={IC.purple} strokeWidth={1.4}/>{i<6&&<path d={`M${x+i*10+4} ${y+(i%2?-8:28)}q5 ${i%2?-10:10} 10 0`} fill="none" stroke={IC.purple} strokeWidth={2}/>}</g>)}</g>;}

export function JunctionsEpitheliumScene(){return <>
 <He x={315} y={24} size={26} bold>הצד האפיקלי</He>
 {[123,328].map(x=><g key={x}><rect x={x} y={52} width={190} height={280} rx={18} fill="#ecf4f8" stroke={IC.blue} strokeWidth={3}/>{[0,1,2,3,4,5].map(i=><rect key={i} x={x+18+i*27} y={38} width={10} height={24} rx={5} fill="#ecf4f8" stroke={IC.blue} strokeWidth={2}/>)}</g>)}
 <rect data-bio="basal-lamina" x={113} y={346} width={415} height={14} rx={4} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>
 {[71,81,91].map(y=><rect data-bio="tight" key={y} x={309} y={y} width={23} height={5} rx={2} fill={IC.ink}/>)}
 {[120,130,140].map(y=><path data-bio="adherens" key={y} d={`M306 ${y}H335`} stroke={IC.purple} strokeWidth={4}/>)}
 <path data-bio="actin" d="M152 130H304M337 130H489" stroke={IC.red} strokeWidth={7}/>
 {[302,333].map(x=><rect data-bio="desmosome" key={x} x={x} y={179} width={7} height={32} rx={2} fill={IC.ink}/>)}
 {[185,195,205].map(y=><path key={y} d={`M309 ${y}H333`} stroke={IC.purple} strokeWidth={3}/>)}
 {[-1,1].map(s=>[-22,0,22].map(d=><path data-bio="intermediate" key={s+'-'+d} d={`M${s<0?302:340} 195Q${320+s*80} ${195+d} ${320+s*150} ${195+d*1.5}`} fill="none" stroke={IC.green} strokeWidth={4}/>))}
 {[250,263,276].map(y=><rect data-bio="gap" key={y} x={306} y={y} width={29} height={8} rx={3} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>)}
 <rect data-bio="hemi" x={414} y={322} width={44} height={8} rx={2} fill={IC.ink}/><path data-bio="integrin" d="M423 330v16m13-16v16m13-16v16" stroke={IC.purple} strokeWidth={4}/>
 <path d="M422 322q-32-16-36-39m50 39v-43m11 43q28-15 29-39" fill="none" stroke={IC.green} strokeWidth={4}/>
 <Callout n={1} x={388} y={82} tx={324} ty={83} target="tight"/>
 <Callout n={2} x={250} y={104} tx={271} ty={130} target="actin"/>
 <Callout n={3} x={376} y={155} tx={337} ty={187} target="desmosome"/>
 <Callout n={4} x={387} y={265} tx={331} ty={267} target="gap"/>
 <Callout n={5} x={550} y={312} tx={450} ty={326} target="hemi"/>
 <Callout n={6} x={551} y={370} tx={499} ty={353} target="basal-lamina"/>
 </>;}

export function EcmOverviewScene(){return <>
 <ellipse data-bio="fibroblast" cx={336} cy={293} rx={212} ry={60} fill="#ecf4f8" stroke={IC.blueDark} strokeWidth={3}/><ellipse cx={332} cy={298} rx={39} ry={21} fill={IC.bluePale}/>
 {[73,86,99].map(y=><path data-bio="collagen" key={y} d={`M55 ${y}Q282 ${y-24} 578 ${y-8}`} fill="none" stroke={IC.gold} strokeWidth={8} strokeDasharray="16 4"/>)}
 {[0,1].map(j=><path data-bio="elastin" key={j} d={Array.from({length:92},(_,i)=>(i?'L':'M')+(56+i*2.2)+' '+(170+j*20+12*Math.sin(i/5+j))).join('')} fill="none" stroke={IC.green} strokeWidth={4}/>)}
 {[96,137,179,220].map(x=><path key={x} d={`M${x} ${170+12*Math.sin((x-56)/11)}L${x} ${190+12*Math.sin((x-56)/11+1)}`} stroke={IC.green} strokeWidth={2}/>)}
 <path data-bio="hyaluronan" d="M368 182H571" stroke={IC.purple} strokeWidth={5}/>
 {[385,423,461,499,537].map(x=><g key={x}><path data-bio="proteoglycan" d={`M${x} 141V220`} stroke={IC.blue} strokeWidth={4}/>{[146,159,172,195,208].map(y=><path key={y} d={`M${x-12} ${y-4}l24 8`} stroke={IC.purple} strokeWidth={2}/>)}</g>)}
 <path data-bio="fibronectin" d="M289 90Q304 151 309 213" fill="none" stroke={IC.blueDark} strokeWidth={5} strokeDasharray="9 3"/>
 <path data-bio="integrin" d="M307 241v-20l-10-12m10 12l12-12m-4 32v-17" fill="none" stroke={IC.purple} strokeWidth={5}/>
 <Callout n={1} x={55} y={25} tx={55} ty={73} target="collagen"/>
 <Callout n={2} x={42} y={216} tx={67} ty={180.1} target="elastin"/>
 <Callout n={3} x={597} y={146} tx={539} ty={158} target="proteoglycan"/>
 <Callout n={4} x={594} y={231} tx={569} ty={182} target="hyaluronan"/>
 <Callout n={5} x={278} y={194} tx={303} ty={169} target="fibronectin"/>
 <Callout n={6} x={345} y={191} tx={315} ty={230} target="integrin"/>
 <Callout n={7} x={574} y={322} tx={524} ty={318} target="fibroblast"/>
 </>;}

export function ReceptorClassesScene(id:string){return <>
 <He x={525} y={30} size={26} bold>קולטן־תעלה</He><He x={317} y={30} size={26} bold>מצומד חלבון ג׳י</He><He x={105} y={30} size={26} bold>מצומד אנזים</He>
 <Membrane/>
 {[499,535].map(x=><rect data-bio="channel" key={x} x={x} y={85} width={20} height={73} rx={7} fill="#dfd3e9" stroke={IC.purple} strokeWidth={2}/>)}<Ligand x={501} y={62}/>
 {[81,114,149,190].map(y=><circle data-bio="ion" key={y} cx={527} cy={y} r={5} fill={IC.blue}/>)}<Flow id={id} d="M527 205V244" color={IC.blueDark}/>
 <SevenPass x={284} y={110}/><Ligand x={316} y={67}/>
 <ellipse data-bio="g-alpha" cx={294} cy={174} rx={21} ry={15} fill="#d5e7db" stroke={IC.green} strokeWidth={2}/><ellipse data-bio="g-beta" cx={332} cy={174} rx={15} ry={12} fill={IC.bluePale} stroke={IC.blueDark} strokeWidth={2}/><circle data-bio="g-gamma" cx={355} cy={169} r={7} fill={IC.blueDark}/>
 <Receptor x={82}/><Receptor x={127}/><Ligand x={105} y={54}/><Phosphate x={58} y={174}/><Phosphate x={151} y={174}/>
 <Flow id={id} d="M89 153Q104 140 121 153"/><Flow id={id} d="M120 176Q104 190 88 176"/>
 <Callout n={1} x={592} y={77} tx={548} ty={100} target="channel"/>
 <Callout n={2} x={391} y={80} tx={346} ty={107} target="seven-pass"/>
 <Callout n={3} x={377} y={230} tx={339} ty={180} target="g-beta"/>
 <Callout n={4} x={181} y={241} tx={138} ty={174} target="kinase-idle"/>
 </>;}

export function PlcPathwayScene(id:string){return <>
 <Membrane y={78}/><SevenPass x={55} y={78}/><Ligand x={86} y={37}/>
 <ellipse data-bio="gq" cx={152} cy={147} rx={27} ry={18} fill="#d5e7db" stroke={IC.green} strokeWidth={2}/>
 <ellipse data-bio="plc" cx={257} cy={146} rx={32} ry={22} fill={IC.bluePale} stroke={IC.blueDark} strokeWidth={2}/>
 <path data-bio="pip2" d="M305 78l-7-20m7 20l8-20M305 80v23" stroke={IC.purple} strokeWidth={5}/><circle cx={305} cy={109} r={8} fill="#dfd3e9" stroke={IC.purple} strokeWidth={2}/>
 <path data-bio="dag" d="M445 80l-8-22m8 22l8-22" stroke={IC.goldDark} strokeWidth={6}/>
 <circle data-bio="ip3" cx={337} cy={200} r={15} fill="#dfd3e9" stroke={IC.purple} strokeWidth={3}/>
 <rect data-bio="er" x={220} y={302} width={236} height={69} rx={23} fill="#e9f1f8" stroke={IC.blueDark} strokeWidth={3}/>
 {[327,344].map(x=><rect data-bio="er-channel" key={x} x={x} y={291} width={9} height={26} rx={3} fill="#dfd3e9" stroke={IC.purple} strokeWidth={2}/>)}
 {[[271,333],[300,349],[374,339],[410,325],[376,272],[398,244],[423,268]].map(([x,y])=><circle data-bio="calcium" key={x} cx={x} cy={y} r={7} fill={IC.red}/>)}
 <ellipse data-bio="pkc" cx={520} cy={165} rx={31} ry={24} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={3}/>
 <path data-bio="calmodulin" d="M532 286c-34-21-40 35-13 31q12-14 25 0c29 4 25-52-12-31Z" fill="#efd5d8" stroke={IC.red} strokeWidth={3}/>
 <Flow id={id} d="M105 119L127 139" color={IC.green}/><Flow id={id} d="M183 147H218"/><Flow id={id} d="M280 126L295 114"/>
 <Flow id={id} d="M325 90H416"/><Flow id={id} d="M315 126L331 177"/>
 <Flow id={id} d="M337 223V282" color={IC.purple}/><Flow id={id} d="M365 303L374 286" color={IC.red}/>
 <Flow id={id} d="M449 103Q452 140 484 152" color={IC.goldDark}/>
 <Flow id={id} d="M433 242L493 190" color={IC.red}/><Flow id={id} d="M440 270L497 289" color={IC.red}/>
 <Callout n={1} x={37} y={33} tx={62} ty={79} target="seven-pass"/>
 <Callout n={2} x={142} y={217} tx={151} ty={158} target="gq"/>
 <Callout n={3} x={213} y={209} tx={245} ty={159} target="plc"/>
 <Callout n={4} x={342} y={34} tx={308} ty={67} target="pip2"/>
 <Callout n={5} x={482} y={34} tx={449} ty={68} target="dag"/>
 <Callout n={6} x={393} y={191} tx={350} ty={199} target="ip3"/>
 <Callout n={7} x={278} y={269} tx={331} ty={301} target="er-channel"/>
 <Callout n={8} x={485} y={351} tx={411} ty={325} target="calcium"/>
 <Callout n={9} x={583} y={182} tx={542} ty={174} target="pkc"/>
 <Callout n={10} x={588} y={325} tx={546} ty={300} target="calmodulin"/>
 </>;}

export function RtkActivationScene(id:string){return <>
 <He x={478} y={28} size={26} bold>ללא ליגנד</He><He x={164} y={28} size={26} bold>קשירת ליגנד</He>
 <Membrane/>
 <Receptor x={432}/><Receptor x={532}/><Receptor x={141} active/><Receptor x={186} active/>
 <ellipse data-bio="bridging-ligand" cx={163} cy={47} rx={32} ry={12} fill={IC.gold} stroke={IC.goldDark} strokeWidth={2}/>
 {[117,210].map(x=>[151,175].map(y=><Phosphate key={x+'-'+y} x={x} y={y}/>))}
 <Flow id={id} d="M156 149Q164 137 173 149"/><Flow id={id} d="M171 176Q162 188 154 176"/>
 <path data-bio="sh2" d="M237 160h34q15 0 15 17t-15 17h-34q-10-4-11-17q1-13 11-17Z" fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/><path d="M218 175h9" stroke={IC.goldDark} strokeWidth={3}/>
 <Flow id={id} d="M368 216H304"/>
 <Callout n={1} x={596} y={218} tx={541} ty={173} target="kinase-idle"/>
 <Callout n={2} x={63} y={46} tx={139} ty={47} target="bridging-ligand"/>
 <Callout n={3} x={69} y={231} tx={135} ty={175} target="kinase-active"/>
 <Callout n={4} x={209} y={240} tx={210} ty={181} target="phosphate"/>
 <Callout n={5} x={296} y={246} tx={269} ty={170} target="sh2"/>
 </>;}

export function MorphogenesisMechanicsScene(id:string){return <>
 <He x={481} y={27} size={26} bold>כיווץ אפיקלי</He><He x={160} y={27} size={26} bold>שילוב תאים</He>
 {[0,1,2,3,4].map(i=><g key={i}><rect x={505+i*17} y={73} width={17} height={46} fill="#d5e7db" stroke={IC.green} strokeWidth={1.5}/><path d={`M${505+i*17} 73h17`} stroke={IC.red} strokeWidth={5}/></g>)}
 {[0,1,2,3,4].map(i=>{const a=(25+i*26)*Math.PI/180,b=(51+i*26)*Math.PI/180,point=(r:number,t:number)=>(407+r*Math.cos(t))+','+(57+r*Math.sin(t));return <g key={i}><path data-bio="apical-wedge" d={`M${point(27,a)}L${point(68,a)}A68 68 0 0 1 ${point(68,b)}L${point(27,b)}A27 27 0 0 0 ${point(27,a)}Z`} fill="#d5e7db" stroke={IC.green} strokeWidth={2}/><path d={`M${point(27,a)}A27 27 0 0 1 ${point(27,b)}`} fill="none" stroke={IC.red} strokeWidth={4}/></g>})}
 <Flow id={id} d="M492 95H469"/>
 {[0,1,2,3].map(c=>[0,1].map(r=><rect key={c+'-'+r} x={213+c*18} y={77+r*18} width={18} height={18} fill="#dfd3e9" stroke={IC.purple} strokeWidth={1.5}/>))}
 {[0,1].map(c=>[0,1,2,3].map(r=><rect data-bio="intercalated" key={c+'-'+r} x={66+c*18} y={57+r*18} width={18} height={18} fill="#dfd3e9" stroke={IC.purple} strokeWidth={1.5}/>))}<Flow id={id} d="M196 96H119"/>
 <He x={478} y={232} size={26} bold>מעבר למזנכימה</He><He x={160} y={232} size={26} bold>היצמדות סלקטיבית</He>
 {[0,1,2,4,5,6].map(i=><rect key={i} x={396+i*25} y={264} width={25} height={38} fill="#d5e7db" stroke={IC.green} strokeWidth={2}/>)}
 <path data-bio="migrating" d="M473 329l13-5l12 7l9-4l-3 12l8 13l-16-1l-10 13l-6-12l-13-2l10-10Z" fill="#d5e7db" stroke={IC.green} strokeWidth={2}/><Flow id={id} d="M484 307V319"/>
 {[[219,278],[243,279],[265,281],[225,302],[250,302],[274,306],[237,326],[265,331]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={10} fill={i%2?IC.bluePale:IC.goldPale} stroke={i%2?IC.blueDark:IC.goldDark} strokeWidth={2}/>)}
 {[0,1,2,3,4,5,6,7].map(i=><circle data-bio="sorted-outer" key={i} cx={79+35*Math.cos(i*Math.PI/4)} cy={302+35*Math.sin(i*Math.PI/4)} r={10} fill={IC.bluePale} stroke={IC.blueDark} strokeWidth={2}/>)}
 {[[72,294],[87,296],[80,309]].map(([x,y])=><circle data-bio="sorted-inner" key={x} cx={x} cy={y} r={8} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>)}<Flow id={id} d="M203 305H132"/>
 <Callout n={1} x={365} y={159} tx={392} ty={100} target="apical-wedge"/>
 <Callout n={2} x={41} y={167} tx={73} ty={118} target="intercalated"/>
 <Callout n={3} x={569} y={361} tx={493} ty={339} target="migrating"/>
 <Callout n={4} x={36} y={375} tx={79} ty={337} target="sorted-outer"/>
 </>;}
