import type React from 'react';
import {He,La,IC,Callout,Flow} from './ub-zoo';
import {Responsive,Defs} from './immune';
type Props={id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string[];sceneH?:number};
function layout(p:Props,m=false){const legend=(m?67:76)+(p.sceneH||330)*(m?.55:.85)+32,rows=m?p.keys.length:Math.ceil(p.keys.length/2);return {legend,h:legend+(rows-1)*(m?48:44)+20+40+(p.foot.length-1)*24+17};}
function PlateScene({p,m=false}:{p:Props;m?:boolean}){const w=m?360:640,l=layout(p,m);return <><Defs id={p.id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{p.title}</He><He x={w/2} y={56} size={m?15:16}>{p.subtitle}</He><g data-scene="" transform={`translate(${m?4:48} ${m?67:76}) scale(${m?.55:.85})`}>{p.draw(p.id+(m?'-m':'-d'))}</g>{p.keys.map((lines,i)=>{const x=m?340:i%2===0?610:298,y=l.legend+(m?i:Math.floor(i/2))*(m?48:44);return <g key={i} data-legend={i+1}><circle cx={x} cy={y-5} r={11} fill="#ecf2f6"/><La x={x} y={y} size={15} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{t}</He>)}</g>})}{p.foot.map((s,i)=><He key={i} x={w/2} y={l.h-17-(p.foot.length-1-i)*24} size={m?14:16} color={IC.muted}>{s}</He>)}</>;}
export function Plate(p:Props){return <div className="p2b-plate"><style>{'.p2b-plate .immune-wide{max-width:640px;margin:auto}'}</style><Responsive id={p.id} label={p.label} h={layout(p).h} mh={layout(p,true).h} wide={<PlateScene p={p}/>} mobile={<PlateScene p={p} m/>}/></div>;}
function Rail({x,y}:{x:number;y:number}){return <g>{[0,1].map(r=>Array.from({length:9},(_,i)=><circle key={r+'-'+i} data-bio="tubulin" cx={x+i*24} cy={y+r*13} r={9} fill={r?'#bfdccc':'#d9eadf'} stroke={IC.green} strokeWidth={1.5}/>))}</g>;}
function Head({x,y,orange=false,bio}:{x:number;y:number;orange?:boolean;bio:string}){return <ellipse data-bio={bio} cx={x} cy={y} rx={19} ry={15} fill={orange?IC.goldPale:IC.bluePale} stroke={orange?IC.goldDark:IC.blueDark} strokeWidth={2}/>;}
export function MechanochemicalCycleScene(id:string){return <>
 {[0,1,2,3].map(i=>{const x=i%2===0?366:46,y=i<2?96:273,blue=i<2?x+48:x+144,orange=x+96;return <g key={i}><Rail x={x} y={y}/><Head x={blue} y={y-24} bio={'state-'+(i+1)}/><Head x={orange} y={y-(i===3?56:24)} orange bio="orange-head"/><path data-bio="linker" d={`M${blue} ${y-39}Q${x+95} ${y-(i===0?63:83)} ${orange} ${y-(i===3?71:39)}M${x+95} ${y-63}V${y-90}`} fill="none" stroke={IC.purple} strokeWidth={5}/><La x={x+94} y={y+53} size={26}>{i===3?'\u2066ADP + Pᵢ\u2069':'\u2066ATP\u2069'}</La></g>})}
 <Flow id={id} d="M338 80H298"/><Flow id={id} d="M130 158V192H445V216"/><Flow id={id} d="M338 258H298"/><Flow id={id} d="M32 240H10V14H460V28"/>
 <Callout n={1} x={612} y={41} tx={422} ty={72} target="state-1"/><Callout n={2} x={275} y={43} tx={103} ty={72} target="state-2"/>
 <Callout n={3} x={610} y={214} tx={516} ty={249} target="state-3"/><Callout n={4} x={275} y={211} tx={203} ty={249} target="state-4"/>
 <Callout n={5} x={364} y={82} tx={414} ty={80} target="state-1"/><Callout n={6} x={539} y={146} tx={470} ty={80} target="orange-head"/>
 <Callout n={7} x={383} y={40} tx={461} ty={33} target="linker"/><Callout n={8} x={598} y={305} tx={558} ty={286} target="tubulin"/>
 </>;}
function Fork({x,y,active=false}:{x:number;y:number;active?:boolean}){return <g><path d={`M${x-105} ${y-11}H${x+34}L${x+118} ${y-57}M${x-105} ${y+11}H${x+34}L${x+118} ${y+57}`} fill="none" stroke={IC.green} strokeWidth={4}/>{Array.from({length:8},(_,i)=><path key={i} d={`M${x-100+i*16} ${y-10}v20`} stroke={IC.gold} strokeWidth={2}/>)}<path data-bio={active?'active':'passive'} d={`M${x-3} ${y-38}Q${x+51} ${y-52} ${x+53} ${y-8}L${x+25} ${y+34}L${x-9} ${y+25}Z`} fill={active?IC.goldPale:IC.bluePale} stroke={active?IC.goldDark:IC.blueDark} strokeWidth={2}/>{active&&<path d={`M${x+40} ${y-4}L${x+70} ${y-14}L${x+58} ${y+7}Z`} fill={IC.gold}/>}</g>;}
export function HelicasesScene(id:string){const px=(x:number)=>90+x/12*490,py=(y:number)=>530-y;return <>
 <He x={470} y={25} size={26} bold>פסיבית</He><He x={153} y={25} size={26} bold>פעילה</He><Fork x={442} y={106}/><Fork x={125} y={106} active/>
 <He x={470} y={192} size={26}>{'\u2066ATP\u2069 → תנועה;'}</He><He x={470} y={224} size={26}>מחכה לפתיחה ספונטנית</He><He x={153} y={192} size={26}>{'\u2066ATP\u2069 → תנועה'}</He><He x={153} y={224} size={26}>ופתיחה אקטיבית</He>
 <Callout n={1} x={607} y={51} tx={473} ty={80} target="passive"/><Callout n={2} x={291} y={51} tx={156} ty={80} target="active"/>
 {[0,100,200].map(y=><g key={y}><path d={`M90 ${py(y)}H580`} stroke="#dde5ea" strokeWidth={1}/><La x={74} y={py(y)+8} size={26} anchor="end">{y}</La></g>)}
 <path d="M90 303V530H588" fill="none" stroke={IC.ink} strokeWidth={2}/>{[2,6,10].map(x=><La key={x} x={px(x)} y={565} size={26}>{x}</La>)}
 <He x={335} y={606} size={26}>{'כוח על המזלג \u2066(pN)\u2069'}</He><text x={22} y={426} fontSize={26} textAnchor="middle" direction="rtl" fill={IC.ink} transform="rotate(-90 22 426)">{'קצב פתיחה \u2066(bp/s)\u2069'}</text>
 <path data-bio="ssdna" d="M90 330H580" fill="none" stroke={IC.muted} strokeWidth={2.5} strokeDasharray="8 6"/>
 {[[20,60,180],[170,180,190]].map((ys,j)=><g key={j}><path d={ys.map((y,i)=>(i?'L':'M')+px([2,6,10][i])+' '+py(y)).join('')} fill="none" stroke={j?IC.goldDark:IC.blueDark} strokeWidth={3}/>{ys.map((y,i)=><circle data-bio={j?'series-y':'series-x'} key={i} cx={px([2,6,10][i])} cy={py(y)} r={6} fill={j?IC.gold:IC.blue}/>)}</g>)}
 <Callout n={3} x={123} y={469} tx={px(2)} ty={py(20)} target="series-x"/><Callout n={4} x={607} y={375} tx={px(10)} ty={py(190)} target="series-y"/><Callout n={5} x={608} y={277} tx={570} ty={330} target="ssdna"/>
 </>;}
function Glyco({x,y,glucose=0,folded=false,bio}:{x:number;y:number;glucose?:number;folded?:boolean;bio:string}){return <g><path data-bio={bio} d={folded?`M${x-19} ${y}C${x-35} ${y-34} ${x+30} ${y-30} ${x+22} ${y}C${x+40} ${y+37} ${x-30} ${y+35} ${x-19} ${y}Z`:`M${x-30} ${y+15}q-20 -35 8 -33t20 36t25 -20t18 22`} fill={folded?'#d8eadd':'none'} stroke={IC.green} strokeWidth={5}/><path d={`M${x} ${y-18}v-29m0 8l-15 -10m15 3l15 -10`} fill="none" stroke={IC.blue} strokeWidth={3}/>{[0,1,2].map(i=><circle key={i} cx={x-15+i*15} cy={y-51} r={5} fill={IC.bluePale} stroke={IC.blue}/>)}{Array.from({length:glucose},(_,i)=><circle data-bio="glucose" key={i} cx={x+15} cy={y-64-i*12} r={5} fill={IC.gold} stroke={IC.goldDark}/>)}</g>;}
export function CalnexinCycleScene(id:string){return <>
 <Glyco x={552} y={119} glucose={3} bio="new-protein"/><Glyco x={320} y={119} glucose={1} bio="bound-protein"/>
 <path data-bio="calnexin" d="M286 39V64Q267 95 287 115Q300 130 316 108" fill="none" stroke={IC.purple} strokeWidth={10}/>
 <Glyco x={320} y={278} bio="unbound"/><Glyco x={552} y={278} folded bio="folded"/><Glyco x={91} y={278} glucose={1} bio="uggt"/>
 <path data-bio="erad" d="M57 82l17 11m10 -25l16 8m-9 21l21 10m-42 8l16 11" stroke={IC.red} strokeWidth={6}/>
 <Flow id={id} d="M505 116H368"/><Flow id={id} d="M325 161V210"/><Flow id={id} d="M369 281H501"/><Flow id={id} d="M268 281H143"/>
 <Flow id={id} d="M90 205V158H240V118H268"/><Flow id={id} d="M51 246H23V92H47" color={IC.red}/>
 <Callout n={1} x={611} y={36} tx={575.216} ty={116.648} target="new-protein"/><Callout n={2} x={371} y={38} tx={286} ty={64} target="calnexin"/>
 <Callout n={3} x={386} y={211} tx={345.071} ty={272.665} target="unbound"/><Callout n={4} x={610} y={220} tx={570} ty={269} target="folded"/>
 <Callout n={5} x={147} y={204} tx={119.973} ty={266.714} target="uggt"/><Callout n={6} x={145} y={49} tx={100} ty={76} target="erad"/>
 </>;}
export function GolgiSortingScene(id:string){return <>
 <path data-bio="er" d="M567 77q40 12 0 24t0 24t0 24t0 24t0 24t0 24" fill="none" stroke={IC.blue} strokeWidth={10}/>{[82,107,132,157,182,207].map(y=><circle key={y} cx={600} cy={y} r={4} fill={IC.ink}/>)}
 {[0,1,2,3].map(i=><path key={i} data-bio={i===0?'cis':i===3?'trans':'medial'} d={`M${434-i*31} 69Q${452-i*31} 148 ${434-i*31} 229L${420-i*31} 229Q${438-i*31} 148 ${420-i*31} 69Z`} fill={i<2?IC.bluePale:'#e1d5eb'} stroke={i<2?IC.blue:IC.purple} strokeWidth={2}/>)}
 <path data-bio="tgn" d="M299 70q25 40 0 78q25 40 0 80" fill="none" stroke={IC.gold} strokeWidth={8}/>
 <circle data-bio="copii" cx={502} cy={102} r={12} fill="#d6e9dd" stroke={IC.green} strokeWidth={3}/><circle data-bio="copi" cx={502} cy={208} r={12} fill="#dce4eb" stroke={IC.muted} strokeWidth={3}/>
 <Flow id={id} d="M551 102H520"/><Flow id={id} d="M484 102H456"/><Flow id={id} d="M455 208H483"/><Flow id={id} d="M520 208H550"/>
 <Flow id={id} d="M418 40H314"/>
 <ellipse data-bio="endosome" cx={194} cy={82} rx={23} ry={18} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/><path data-bio="m6p-receptor" d="M205 70v-18m-9 -3l9 7l9 -7" stroke={IC.purple} fill="none" strokeWidth={4}/>
 <circle data-bio="lysosome" cx={77} cy={82} r={25} fill="#f0ced0" stroke={IC.red} strokeWidth={2}/>{[[-9,-6],[9,3],[-3,11]].map(([x,y],i)=><circle key={i} cx={77+x} cy={82+y} r={4} fill={IC.red}/>)}
 <circle data-bio="regulated" cx={112} cy={176} r={22} fill="#dfd0e9" stroke={IC.purple} strokeWidth={2}/>{[[-7,-6],[7,4],[-5,8]].map(([x,y],i)=><circle key={i} cx={112+x} cy={176+y} r={4} fill={IC.purple}/>)}
 <path data-bio="plasma" d="M62 252H188M62 263H188" stroke={IC.green} strokeWidth={4}/><circle cx={124} cy={234} r={12} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>
 <Flow id={id} d="M281 82H222"/><Flow id={id} d="M163 82H109"/><Flow id={id} d="M282 173H143"/><Flow id={id} d="M281 222H148"/>
 <La x={573} y={287} size={26}>{'\u2066ER\u2069'}</La><La x={428} y={287} size={26}>{'\u2066cis\u2069'}</La><La x={302} y={287} size={26}>{'\u2066TGN\u2069'}</La>
 <Callout n={1} x={616} y={43} tx={575} ty={80} target="er"/><Callout n={2} x={509} y={44} tx={502} ty={94} target="copii"/><Callout n={3} x={532} y={266} tx={507} ty={214} target="copi"/>
 <Callout n={4} x={393} y={321} tx={426} ty={219} target="cis"/><Callout n={5} x={241} y={256} tx={303} ty={226} target="tgn"/>
 <Callout n={6} x={241} y={25} tx={205} ty={57} target="m6p-receptor"/><Callout n={7} x={32} y={25} tx={65} ty={65} target="lysosome"/><Callout n={8} x={41} y={176} tx={95} ty={176} target="regulated"/><Callout n={9} x={51} y={315} tx={84} ty={263} target="plasma"/>
 </>;}
function Importin({x,y,bio}:{x:number;y:number;bio:string}){return <path data-bio={bio} d={`M${x+8} ${y-17}C${x-31} ${y-35} ${x-37} ${y+29} ${x+9} ${y+19}L${x+5} ${y+7}Q${x-14} ${y+14} ${x-12} ${y-6}Q${x-9} ${y-15} ${x+5} ${y-6}Z`} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>;}
function Ran({x,y,gtp=false,bio}:{x:number;y:number;gtp?:boolean;bio:string}){return <g><circle data-bio={bio} cx={x} cy={y} r={15} fill={gtp?'#cde7d6':'#d6e2ee'} stroke={gtp?IC.green:IC.blue} strokeWidth={2}/><rect x={x+7} y={y-7} width={15} height={14} rx={2} fill={gtp?IC.green:IC.blue}/></g>;}
export function RanCycleScene(id:string){return <>
 <He x={477} y={24} size={26} bold>ציטוזול</He><He x={158} y={24} size={26} bold>גרעין</He>
 {[43,137,231].map(y=><g key={y}><rect data-bio="envelope" x={308} y={y} width={18} height={34} rx={3} fill="#e2e7eb" stroke={IC.muted} strokeWidth={2}/></g>)}
 <Importin x={492} y={101} bio="importin"/><path data-bio="cargo" d="M488 91h13v15h-13Z" fill={IC.purple}/><Importin x={190} y={101} bio="nuclear-importin"/><path data-bio="released-cargo" d="M131 70h16v16h-16Z" fill={IC.purple}/><Ran x={207} y={112} gtp bio="gtp"/>
 <Importin x={189} y={192} bio="return-importin"/><Ran x={207} y={200} gtp bio="return-gtp"/><Importin x={491} y={192} bio="free-importin"/><Ran x={530} y={207} bio="gdp"/>
 <path data-bio="gap" d="M567 177l18 -7l14 13l-9 18l-19 -3Z" fill="#e6d8ee" stroke={IC.purple} strokeWidth={2}/>
 <Ran x={492} y={292} bio="return-gdp"/><ellipse data-bio="ntf2" cx={469} cy={292} rx={12} ry={18} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>
 <path data-bio="chromatin" d="M48 279q15 -24 30 0t30 0t30 0" fill="none" stroke={IC.purple} strokeWidth={4}/><path data-bio="gef" d="M98 245l23 -7l15 13l-13 19l-23 -4Z" fill="#e1d5eb" stroke={IC.purple} strokeWidth={2}/><Ran x={194} y={292} gtp bio="regenerated-gtp"/>
 <Flow id={id} d="M451 101H232"/><Flow id={id} d="M238 192H449"/><Flow id={id} d="M449 292H232"/><Flow id={id} d="M151 280H137V145H163"/>
 <Callout n={1} x={570} y={63} tx={481} ty={88} target="importin"/><Callout n={2} x={74} y={48} tx={138} ty={77} target="released-cargo"/>
 <Callout n={3} x={268} y={144} tx={213} ty={192} target="return-gtp"/><Callout n={4} x={610} y={228} tx={584} ty={184} target="gap"/>
 <Callout n={5} x={572} y={317} tx={478} ty={292} target="ntf2"/><Callout n={6} x={57} y={215} tx={111} ty={250} target="gef"/>
 </>;}
export function CytoskeletonTypesScene(){return <>
 <He x={514} y={23} size={26} bold>אקטין</He><He x={315} y={23} size={26} bold>מיקרוטובול</He><He x={114} y={23} size={26} bold>סיב ביניים</He>
 {Array.from({length:15},(_,i)=><g key={i}>{[0,1].map(j=><circle key={j} data-bio="actin" cx={514+9*Math.sin(i*.8+j*Math.PI)} cy={66+i*12+j*6} r={9} fill={j?'#f3d5d6':'#de9c9f'} stroke={IC.red} strokeWidth={1.4}/>)}</g>)}
 <path data-bio="mt-wall" d="M281 67H349V238Q315 259 281 238Z" fill="#d9eadd" stroke={IC.green} strokeWidth={2}/>
 {Array.from({length:5},(_,c)=>Array.from({length:12},(_,r)=><rect data-bio="tubulin-dimer" key={c+'-'+r} x={283+c*13} y={73+r*14} width={12} height={13} rx={4} fill={r%2?'#8cb6a0':'#c8dfd0'} stroke={IC.green} strokeWidth={1}/>))}
 <ellipse data-bio="hollow" cx={315} cy={67} rx={34} ry={13} fill="#f6faf7" stroke={IC.green} strokeWidth={4}/><ellipse cx={315} cy={67} rx={21} ry={6} fill="#fff" stroke={IC.green}/>
 {[0,1,2,3,4].map(i=><path key={i} data-bio="intermediate" d={Array.from({length:44},(_,j)=>(j?'L':'M')+(110+9*Math.sin(j*.48+i*1.2))+' '+(65+j*4.3)).join(' ')} fill="none" stroke={[IC.blueDark,IC.blue,'#7aa3bd',IC.blueDark,IC.blue][i]} strokeWidth={4}/>)}
 {[514,315].map(x=><g key={x}><La x={x+50} y={70} size={26} bold>−</La><La x={x+50} y={247} size={26} bold>+</La></g>)}
 <La x={514} y={300} size={26}>{'\u2066~7 nm · ATP\u2069'}</La><La x={315} y={300} size={26}>{'\u206625 nm · GTP\u2069'}</La><La x={114} y={300} size={26}>{'\u2066~10 nm\u2069'}</La>
 <Callout n={1} x={609} y={119} tx={521} ty={125} target="actin"/><Callout n={2} x={420} y={202} tx={344} ty={205} target="tubulin-dimer"/><Callout n={3} x={410} y={110} tx={335} ty={67} target="hollow"/><Callout n={4} x={41} y={155} tx={110} ty={155} target="intermediate"/>
 </>;}
