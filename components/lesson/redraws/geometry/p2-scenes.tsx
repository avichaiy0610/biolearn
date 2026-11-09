import type React from 'react';
import {He,La,IC,Callout,Flow} from './ub-zoo';
import {Membrane,Responsive,Defs} from './immune';
type PlateProps={id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string|string[]};
function Height(p:PlateProps,m=false){const rows=m?p.keys.length:Math.ceil(p.keys.length/2),n=Array.isArray(p.foot)?p.foot.length:1;return (m?282:360)+(rows-1)*(m?48:44)+20+40+(n-1)*24+17;}
function PlateScene({p,m=false}:{p:PlateProps;m?:boolean}){const w=m?360:640,h=Height(p,m),foot=Array.isArray(p.foot)?p.foot:[p.foot];return <>
  <Defs id={p.id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{p.title}</He><He x={w/2} y={56} size={m?15:16}>{p.subtitle}</He>
  <g data-scene="" transform={`translate(${m?4:48} ${m?67:76}) scale(${m?.55:.85})`}>{p.draw(p.id+(m?'-m':'-d'))}</g>
  {p.keys.map((lines,i)=>{const x=m?340:(i%2===0?610:298),y=(m?282:360)+(m?i:Math.floor(i/2))*(m?48:44);return <g key={i} data-legend={i+1}><circle cx={x} cy={y-5} r={11} fill="#ecf2f6"/><La x={x} y={y} size={15} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{t}</He>)}</g>;})}
  {foot.map((t,i)=><He key={i} x={w/2} y={h-17-(foot.length-1-i)*24} size={m?14:16} color={IC.muted}>{t}</He>)}
</>;}
export function Plate(p:PlateProps){return <div className="p2-plate"><style>{'.p2-plate .immune-wide{max-width:640px;margin:auto}'}</style><Responsive id={p.id} label={p.label} h={Height(p)} mh={Height(p,true)} wide={<PlateScene p={p}/>} mobile={<PlateScene p={p} m/>}/></div>;}

export function ProteinLevelsScene(id:string){return <>
  {[['ראשוני',550],['שניוני',395],['שלישוני',240],['רבעוני',85]].map(([s,x])=><He key={s} x={+x} y={22} size={26} bold>{s}</He>)}
  <path data-bio="peptide" d="M510 88L535 110L565 98L586 127L567 154L533 166L516 197L541 220L573 210" fill="none" stroke={IC.ink} strokeWidth={5}/>
  {[[510,88],[535,110],[565,98],[586,127],[567,154],[533,166],[516,197],[541,220],[573,210]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={10} fill={[IC.bluePale,IC.goldPale,'#d7e9de','#e1d2ed'][i%4]} stroke={IC.ink} strokeWidth={1.4}/>)}
  {[0,1,2,3].map(i=><g key={i}><path data-bio="helix" d={`M370 ${68+i*27}C440 ${48+i*27} 440 ${98+i*27} 370 ${97+i*27}`} fill="none" stroke={IC.red} strokeWidth={7}/><path d={`M374 ${69+i*27}L374 ${95+i*27}M410 ${70+i*27}L410 ${94+i*27}`} stroke={IC.muted} strokeWidth={1.2} strokeDasharray="3 3"/></g>)}
  {[0,1,2].map(i=><g key={i}><path data-bio="sheet" d={`M357 ${218+i*22}H422V${212+i*22}L437 ${223+i*22}L422 ${234+i*22}V${228+i*22}H357Z`} fill={IC.goldPale} stroke={IC.goldDark}/>{i<2&&[370,390,410].map(x=><path key={x} d={`M${x} ${230+i*22}v9`} stroke={IC.muted} strokeDasharray="2 2"/>)}</g>)}
  <path data-bio="fold" d="M205 108C167 65 256 45 275 85C301 130 223 124 213 155C188 201 281 238 278 190C274 157 311 172 288 225C267 268 179 244 181 206C183 172 237 152 205 108Z" fill="none" stroke={IC.purple} strokeWidth={9}/>
  <path data-bio="disulfide" d="M215 150L249 166" stroke={IC.gold} strokeWidth={6}/><La x={248} y={142} size={26} color={IC.goldDark}>{'\u2066S–S\u2069'}</La>
  {[[61,124,'α',true],[110,124,'β',false],[61,184,'β',false],[110,184,'α',true]].map(([x,y,s,g],i)=><g key={i}><path data-bio="subunit" d={`M${+x-19} ${+y-22}C${+x+20} ${+y-40} ${+x+35} ${+y+7} ${+x+13} ${+y+24}C${+x-12} ${+y+39} ${+x-38} ${+y+4} ${+x-19} ${+y-22}Z`} fill={`url(#${id}-${g?'green':'blue'})`} stroke={g?IC.green:IC.blue} strokeWidth={2}/><La x={+x} y={+y+6} size={26} bold>{'\u2066'+s+'\u2069'}</La></g>)}
  <Callout n={1} x={610} y={70} tx={565} ty={98} target="peptide"/>
  <Callout n={2} x={454} y={70} tx={416.764} ty={66.908} target="helix"/>
  <Callout n={3} x={465} y={265} tx={428} ty={267} target="sheet"/>
  <Callout n={4} x={310} y={66} tx={269} ty={78} target="fold"/>
  <Callout n={5} x={300} y={153} tx={249} ty={166} target="disulfide"/>
  <Callout n={6} x={26} y={77} tx={47} ty={108} target="subunit"/>
</>;}

function Enzyme({x,y,bio,off=false}:{x:number;y:number;bio:string;off?:boolean}){return <path data-bio={bio} d={`M${x-46} ${y-10}C${x-51} ${y-51} ${x-13} ${y-54} ${x-10} ${y-(off?36:29)}L${x+10} ${y-(off?22:29)}C${x+21} ${y-55} ${x+55} ${y-33} ${x+45} ${y-7}C${x+66} ${y+20} ${x+29} ${y+52} ${x+6} ${y+32}C${x-28} ${y+52} ${x-63} ${y+24} ${x-46} ${y-10}Z`} fill={off?'#dfe5ea':'#d9e9f1'} stroke={IC.blue} strokeWidth={2}/>;}
function Ligand({x,y,bio,red=false}:{x:number;y:number;bio:string;red?:boolean}){return <path data-bio={bio} d={`M${x-10} ${y-9}H${x+10}L${x+8} ${y+9}H${x-8}Z`} fill={red?'#f1c5c7':'#d4e8dc'} stroke={red?IC.red:IC.green} strokeWidth={2}/>;}
export function EnzymeRegulationScene(id:string){return <>
  <He x={480} y={18} size={26} bold>תחרותי</He><He x={160} y={18} size={26} bold>לא־תחרותי</He>
  <Enzyme x={480} y={93} bio="competitive-enzyme"/><Ligand x={480} y={56} bio="competitive-inhibitor" red/><Ligand x={554} y={70} bio="substrate"/>
  <Enzyme x={147} y={93} bio="noncompetitive-enzyme" off/><circle data-bio="remote-inhibitor" cx={194} cy={100} r={11} fill="#f1c5c7" stroke={IC.red} strokeWidth={2}/><Ligand x={147} y={46} bio="substrate"/>
  <He x={480} y={186} size={26} bold>אלוסטרי</He><He x={160} y={186} size={26} bold>משוב</He>
  <g transform="translate(550 260) scale(.7)"><Enzyme x={0} y={0} bio="active-state"/><circle data-bio="activator" cx={48} cy={5} r={12} fill="#c7e1d0" stroke={IC.green} strokeWidth={2}/></g>
  <g transform="translate(426 260) scale(.7)"><Enzyme x={0} y={0} bio="inactive-state" off/><circle data-bio="allosteric-inhibitor" cx={48} cy={5} r={12} fill="#f1c5c7" stroke={IC.red} strokeWidth={2}/></g>
  {['A','B','C','D'].map((s,i)=><g key={s}><circle data-bio={i===3?'end-product':undefined} cx={55+i*66} cy={269} r={16} fill={i===3?'#f1c5c7':'#ecf2f5'} stroke={i===3?IC.red:IC.muted}/><La x={55+i*66} y={275} size={26} bold>{'\u2066'+s+'\u2069'}</La></g>)}
  {[0,1,2].map(i=><g key={i}><Flow id={id} d={`M${73+i*66} 269H${102+i*66}`}/><La x={88+i*66} y={309} size={26}>{'\u2066E'+(i+1)+'\u2069'}</La></g>)}
  <path data-bio="feedback" d="M253 250V218H88V254M80 254H96" fill="none" stroke={IC.red} strokeWidth={2}/>
  <Callout n={1} x={428} y={42} tx={474} ty={53} target="competitive-inhibitor"/>
  <Callout n={2} x={603} y={70} tx={560} ty={70} target="substrate"/>
  <Callout n={3} x={247} y={112} tx={200} ty={103} target="remote-inhibitor"/>
  <Callout n={4} x={605} y={228} tx={585} ty={263} target="activator"/>
  <Callout n={5} x={493} y={297} tx={459.6} ty={267} target="allosteric-inhibitor"/>
  <Callout n={6} x={295} y={274} tx={263} ty={278} target="end-product"/>
</>;}

export function Mito({x,y,id,bio='mito'}:{x:number;y:number;id:string;bio?:string}){return <g><ellipse data-bio={bio} cx={x} cy={y} rx={26} ry={13} fill={`url(#${id}-gold)`} stroke={IC.goldDark} strokeWidth={2}/><path d={`M${x-19} ${y}l6 -7l6 14l6 -14l6 14l6 -7`} fill="none" stroke={IC.goldDark} strokeWidth={1.5}/></g>;}
export function Golgi({x,y,bio='golgi'}:{x:number;y:number;bio?:string}){return <g>{[0,1,2,3].map(i=><path key={i} data-bio={bio} d={`M${x-22+i*2} ${y+i*7}Q${x} ${y-13+i*7} ${x+22-i*2} ${y+i*7}`} fill="none" stroke={IC.gold} strokeWidth={4}/>)}</g>;}
function Nucleus({x,y,r=40,id}:{x:number;y:number;r?:number;id:string}){return <g><circle data-bio="nucleus" cx={x} cy={y} r={r} fill={`url(#${id}-purple)`} stroke={IC.purple} strokeWidth={2}/><circle data-bio="nuclear-envelope" cx={x} cy={y} r={r-5} fill="none" stroke={IC.purple} strokeWidth={2}/><circle data-bio="nucleolus" cx={x-9} cy={y-4} r={r*.25} fill={IC.purple}/><path d={`M${x+5} ${y+15}q15 -15 20 -2`} fill="none" stroke={IC.purple} strokeWidth={2}/></g>;}
function ER({x,y,smooth=false}:{x:number;y:number;smooth?:boolean}){return <g>{[0,1,2].map(i=><path key={i} data-bio={smooth?'smooth-er':'rough-er'} d={`M${x+i*11} ${y}q28 22 0 66`} fill="none" stroke={smooth?IC.green:IC.blue} strokeWidth={4}/>)}{!smooth&&[[12,12],[23,25],[23,43],[12,56]].map(([dx,dy],i)=><circle key={i} data-bio="ribosome" cx={x+dx} cy={y+dy} r={3} fill={IC.ink}/>)}</g>;}
export function ProkEukScene(id:string){return <>
  <He x={479} y={20} size={26} bold>פרוקריוטי</He><He x={166} y={20} size={26} bold>אאוקריוטי</He>
  <rect data-bio="capsule" x={368} y={95} width={218} height={134} rx={67} fill="#f9edd4" stroke={IC.gold} strokeWidth={2} strokeDasharray="5 3"/>
  <rect data-bio="wall" x={377} y={104} width={200} height={116} rx={58} fill="#dfcba2" stroke={IC.goldDark} strokeWidth={2}/>
  <rect data-bio="bacterial-membrane" x={386} y={113} width={182} height={98} rx={49} fill="#edf4f1" stroke={IC.green} strokeWidth={3}/>
  <path data-bio="nucleoid" d="M421 160C420 130 453 143 458 160C465 185 492 173 479 150C471 127 498 139 506 166C514 193 465 194 452 181C432 188 405 178 421 160Z" fill="none" stroke={IC.blue} strokeWidth={3}/>
  <ellipse data-bio="plasmid" cx={537} cy={179} rx={12} ry={9} fill="none" stroke={IC.purple} strokeWidth={3}/>
  {[[418,137],[453,127],[526,136],[550,154],[427,194]].map(([x,y])=><circle data-bio="bacterial-ribosome" key={x} cx={x} cy={y} r={4} fill={IC.ink}/>)}
  <path data-bio="flagellum" d="M586 162Q604 125 615 161T634 159" fill="none" stroke={IC.ink} strokeWidth={3}/>
  <path data-bio="euk-membrane" d="M41 146C18 83 115 46 191 71C283 51 322 128 290 196C277 260 179 273 99 240C54 235 27 195 41 146Z" fill="#edf4f1" stroke={IC.green} strokeWidth={3}/>
  <Nucleus x={128} y={154} id={id}/><ER x={175} y={116}/><Golgi x={240} y={95}/><Mito x={244} y={213} id={id}/>
  <La x={479} y={311} size={26}>{'\u20661–5 µm\u2069'}</La><La x={166} y={311} size={26}>{'\u206610–100 µm\u2069'}</La>
  <Callout n={1} x={370} y={59} tx={399} ty={107} target="capsule"/>
  <Callout n={2} x={449} y={67} tx={450} ty={108} target="wall"/>
  <Callout n={3} x={540} y={69} tx={540} ty={123} target="bacterial-membrane"/>
  <Callout n={4} x={361} y={261} tx={431.583} ty={182.678} target="nucleoid"/>
  <Callout n={5} x={534} y={260} tx={537} ty={188} target="plasmid"/>
  <Callout n={6} x={605} y={95} tx={526} ty={136} target="bacterial-ribosome"/>
  <Callout n={7} x={607} y={230} tx={615} ty={161} target="flagellum"/>
  <Callout n={8} x={57} y={86} tx={101} ty={126} target="nucleus"/>
  <Callout n={9} x={65} y={200} tx={119} ty={150} target="nucleolus"/>
  <Callout n={10} x={180} y={54} tx={186} ty={116} target="rough-er"/>
  <Callout n={11} x={299} y={60} tx={254} ty={91} target="golgi"/>
  <Callout n={12} x={288} y={274} tx={251} ty={221} target="mito"/>
</>;}

function Chloroplast({x,y,id}:{x:number;y:number;id:string}){return <g><ellipse data-bio="chloroplast" cx={x} cy={y} rx={28} ry={14} fill={`url(#${id}-green)`} stroke={IC.green} strokeWidth={2}/>{[-15,-1,13].map(dx=><g key={dx}>{[-5,0,5].map(dy=><path key={dy} d={`M${x+dx-4} ${y+dy}h8`} stroke={IC.green} strokeWidth={2}/>)}</g>)}</g>;}
export function AnimalPlantCellScene(id:string){return <>
  <He x={480} y={18} size={26} bold>תא של בעל חיים</He><He x={161} y={18} size={26} bold>תא צמחי</He>
  <path data-bio="animal-membrane" d="M354 140C336 80 422 48 486 68C555 41 612 100 598 165C624 219 544 273 478 248C418 266 343 232 354 140Z" fill="#edf4f1" stroke={IC.green} strokeWidth={3}/>
  <Nucleus x={450} y={153} r={38} id={id}/><ER x={503} y={118}/><g transform="translate(401 195) scale(.65)"><ER x={0} y={0} smooth/></g><Golgi x={467} y={80}/><Mito x={551} y={215} id={id}/><Mito x={389} y={139} id={id}/>
  <circle data-bio="lysosome" cx={572} cy={126} r={11} fill="#f1c5c7" stroke={IC.red} strokeWidth={2}/>
  <g data-bio="centrioles"><rect data-bio="centriole" x={393} y={83} width={10} height={25} rx={3} fill={IC.ink}/><rect data-bio="centriole" x={407} y={90} width={25} height={10} rx={3} fill={IC.ink}/></g>
  <rect data-bio="plant-wall" x={35} y={60} width={257} height={208} rx={14} fill="#e7d1a6" stroke={IC.goldDark} strokeWidth={3}/>
  <rect data-bio="plant-membrane" x={45} y={70} width={237} height={188} rx={10} fill="#edf4f1" stroke={IC.green} strokeWidth={2}/>
  <rect data-bio="vacuole" x={107} y={112} width={145} height={109} rx={26} fill="#d5eaf1" stroke={IC.blue} strokeWidth={2}/>
  <Nucleus x={77} y={166} r={24} id={id}/><Chloroplast x={90} y={92} id={id}/><Chloroplast x={245} y={240} id={id}/><Mito x={143} y={240} id={id}/><Golgi x={217} y={88}/>
  <path data-bio="plant-rough-er" d="M63 198q22 0 30 21M58 205q20 0 26 18" fill="none" stroke={IC.blue} strokeWidth={3}/><path data-bio="plant-smooth-er" d="M165 87q-15 -10 -30 0t-15 10" fill="none" stroke={IC.green} strokeWidth={3}/>
  {[155,195].map(y=><g key={y}><rect data-bio="plasmodesma" x={281} y={y} width={12} height={8} fill="#edf4f1" stroke={IC.green}/><path d={`M282 ${y+4}h10`} stroke={IC.blue}/></g>)}
  <Callout n={1} x={493} y={197} tx={476} ty={174} target="nucleus"/>
  <Callout n={2} x={394} y={190} tx={441} ty={149} target="nucleolus"/>
  <Callout n={3} x={575} y={185} tx={538.57} ty={151.449} target="rough-er"/>
  <Callout n={4} x={398} y={285} tx={415.3} ty={237.9} target="smooth-er"/>
  <Callout n={5} x={489} y={45} tx={478} ty={77} target="golgi"/>
  <Callout n={6} x={548} y={285} tx={551} ty={225} target="mito"/>
  <Callout n={7} x={611} y={91} tx={580} ty={120} target="lysosome"/>
  <Callout n={8} x={365} y={53} tx={398} ty={89} target="centriole"/>
  <Callout n={9} x={629} y={225} tx={592} ty={206} target="animal-membrane"/>
  <Callout n={10} x={21} y={41} tx={39} ty={78} target="plant-wall"/>
  <Callout n={11} x={93} y={43} tx={90} ty={86} target="chloroplast"/>
  <Callout n={12} x={177} y={293} tx={178} ty={216} target="vacuole"/>
  <Callout n={13} x={317} y={168} tx={289} ty={159} target="plasmodesma"/>
</>;}

export function TransportModesScene(id:string){return <>
  <He x={320} y={17} size={26}>מחוץ לתא</He><He x={320} y={305} size={26}>ציטופלזמה</He>
  <g transform="translate(0 143) scale(1 2)"><Membrane y={0}/></g>
  <path data-bio="simple" d="M570 100V219" fill="none" stroke={IC.ink} strokeWidth={3}/><path d="M565 210L570 220L575 210" fill="none" stroke={IC.ink} strokeWidth={2}/><La x={570} y={70} size={26}>{'\u2066O₂, CO₂\u2069'}</La>
  {[429,464].map(x=><rect key={x} data-bio="channel" x={x} y={123} width={13} height={63} rx={6} fill={`url(#${id}-blue)`} stroke={IC.blue} strokeWidth={2}/>)}
  <path data-bio="carrier" d="M310 129Q326 112 340 128L347 149L336 156L347 166Q339 196 313 183L304 158Z" fill={`url(#${id}-green)`} stroke={IC.green} strokeWidth={2}/>
  <path data-bio="pump" d="M185 124Q199 112 213 128L228 150L219 177Q203 200 185 181L173 154Z" fill={`url(#${id}-purple)`} stroke={IC.purple} strokeWidth={2}/>
  <path data-bio="symporter" d="M60 128Q86 108 108 128L115 172Q88 199 63 180L54 153Z" fill={`url(#${id}-blue)`} stroke={IC.blue} strokeWidth={2}/>
  <Flow id={id} d="M452 93V221" color={IC.blue}/><Flow id={id} d="M326 93V221" color={IC.green}/>
  <Flow id={id} d="M188 215V94" color={IC.red}/><Flow id={id} d="M212 94V215" color={IC.gold}/>
  <Flow id={id} d="M73 94V215" color={IC.red}/><Flow id={id} d="M97 94V215" color={IC.green}/>
  <He x={452} y={70} size={26}>יון</He><He x={326} y={70} size={26}>גלוקוז</He>
  <g data-pump-energy="">
    <path data-flow="" data-energy-link="" d="M250 226Q250 207 228 207Q210 207 202.5 189.5" fill="none" stroke={IC.ink} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/>
    <La x={210} y={253} size={26}>{'\u2066ATP → ADP + Pᵢ\u2069'}</La>
  </g>
  <Callout n={1} x={610} y={231} tx={570} ty={214} target="simple"/>
  <Callout n={2} x={485} y={245} tx={471} ty={179} target="channel"/>
  <Callout n={3} x={361} y={245} tx={341} ty={174} target="carrier"/>
  <Callout n={4} x={249} y={112} tx={219} ty={141} target="pump"/>
  <Callout n={5} x={27} y={245} tx={62} ty={176} target="symporter"/>
</>;}

function Ring({x,y,color=IC.gold,bio}:{x:number;y:number;color?:string;bio?:string}){return <path data-bio={bio} d={`M${x-8} ${y-6}L${x} ${y-11}L${x+10} ${y-5}L${x+8} ${y+6}L${x} ${y+10}L${x-10} ${y+5}Z`} fill="#fffaf0" stroke={color} strokeWidth={2}/>;}
export function PolysaccharidesScene(id:string){return <>
  <He x={533} y={22} size={26} bold>עמילוז</He><He x={320} y={22} size={26} bold>גליקוגן</He><He x={106} y={22} size={26} bold>תאית</He>
  <path data-bio="amylose" d="M472 90C600 50 607 125 478 125C458 125 460 145 482 150C600 110 607 185 478 185C458 185 460 205 482 210C600 170 607 245 478 245" fill="none" stroke={IC.blue} strokeWidth={5}/>
  {[[493,85],[534,83],[568,94],[550,119],[503,125],[493,145],[534,143],[568,154],[550,179],[503,185],[493,205],[534,203],[568,214],[550,239],[503,245]].map(([x,y],i)=><Ring key={i} x={x} y={y} color={IC.blue}/>)}
  <path data-bio="alpha14" d="M237 169H397" stroke={IC.gold} strokeWidth={4}/>
  {[247,275,303,331,359,387].map(x=><Ring key={x} x={x} y={169}/>)}
  <path data-bio="branch-link" d="M275 159L291 112M331 179L347 228" stroke={IC.gold} strokeWidth={4} fill="none"/>
  <path d="M291 112H385M347 228H403" stroke={IC.gold} strokeWidth={4} fill="none"/>
  {[[291,112],[319,112],[347,112],[375,112],[347,228],[375,228],[403,228]].map(([x,y],i)=><Ring key={i} x={x} y={y}/>)}
  {[[387,169],[375,112],[403,228]].map(([x,y],i)=><circle key={i} data-bio="nonreducing" cx={x} cy={y} r={6} fill={IC.green}/>)}
  {[115,167,219].map(y=><g key={y}><path data-bio="beta14" d={`M27 ${y}H190`} stroke={IC.purple} strokeWidth={3}/>{[36,64,92,120,148,176].map((x,i)=><g key={x} transform={`rotate(${i%2?180:0} ${x} ${y})`}><Ring x={x} y={y} color={IC.purple}/><path d={`M${x} ${y-11}v-6`} stroke={IC.purple}/></g>)}</g>)}
  {[36,64,92,120,148,176].map(x=><g key={x}><path data-bio="hydrogen" d={`M${x} 128V153M${x} 180V205`} stroke={IC.muted} strokeWidth={1.8} strokeDasharray="3 3"/></g>)}
  <Callout n={1} x={611} y={72} tx={570} ty={85} target="amylose"/>
  <Callout n={2} x={242} y={122} tx={266} ty={169} target="alpha14"/>
  <Callout n={3} x={303} y={65} tx={283} ty={135.5} target="branch-link"/>
  <Callout n={4} x={421} y={98} tx={375} ty={112} target="nonreducing"/>
  <Callout n={5} x={113} y={65} tx={112} ty={115} target="beta14"/>
  <Callout n={6} x={15} y={273} tx={36} ty={192} target="hydrogen"/>
</>;}
