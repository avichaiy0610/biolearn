import {He,La,IC,Callout,Flow} from './ub-zoo';
export {Plate} from './p2c-scenes';

function Stump({x,top=160}:{x:number;top?:number}){return <g><path d={`M${x-25} ${top}L${x-29} 320Q${x} 333 ${x+29} 320L${x+25} ${top}Z`} fill="#f3dce0" stroke={IC.red} strokeWidth={2}/><path d={`M${x-7} ${top+8}L${x-9} 315Q${x} 322 ${x+9} 315L${x+7} ${top+8}Z`} fill="#e5ebed" stroke="#91a3ae" strokeWidth={1.5}/>{[-18,18].map(a=><path key={a} d={`M${x+a} ${top+10}L${x+a} 309`} stroke="#d6a9b1" strokeWidth={3}/>)}</g>;}
export function BlastemaScene(id:string){return <>
 <He x={551} y={28} size={26} bold>קטיעה</He><He x={399} y={28} size={26} bold>סגירת הפצע</He><He x={244} y={28} size={26} bold>בלסטמה</He><He x={80} y={28} size={26} bold>התחדשות</He>
 <Stump x={551}/><path data-bio="cut" d="M517 153H585" stroke={IC.red} strokeWidth={3} strokeDasharray="7 4"/>
 <Stump x={399}/><path data-bio="wound" d="M373 160Q399 138 425 160" fill="none" stroke={IC.green} strokeWidth={9} strokeLinecap="round"/>
 <Stump x={244}/><path data-bio="blastema" d="M219 160Q211 107 244 101Q278 108 269 160Z" fill="#f4ceaa" stroke={IC.goldDark} strokeWidth={2}/>
 {[[234,119],[251,125],[227,142],[248,147],[262,143]].map(([x,y])=><ellipse key={x} cx={x} cy={y} rx={3} ry={5} fill="#bf854b"/>)}
 <path data-bio="aec" d="M217 157Q207 101 244 95Q282 100 271 157" fill="none" stroke={IC.green} strokeWidth={9} strokeLinecap="round"/>
 <path data-bio="nerve" d="M258 311V188Q258 167 248 151M258 200L268 182" fill="none" stroke={IC.goldDark} strokeWidth={4}/>
 <Stump x={80}/><path data-bio="regenerate" d="M55 160L53 117L39 87Q35 78 42 76Q47 75 53 84L66 103L62 67Q61 58 68 58Q75 59 75 69L80 99L88 61Q90 53 97 56Q103 58 100 69L94 104L111 78Q117 70 123 75Q127 80 121 88L107 119L105 160Z" fill="#f4ceaa" stroke={IC.goldDark} strokeWidth={2.5}/>
 <path d="M80 155V115M65 119L58 104M93 116L104 101" fill="none" stroke="#bf854b" strokeWidth={2}/>
 <Flow id={id} d="M509 251H447"/><Flow id={id} d="M355 251H292"/><Flow id={id} d="M199 251H126"/>
 <Callout n={1} x={608} y={112} tx={574} ty={153} target="cut"/>
 <Callout n={2} x={445} y={101} tx={410} ty={149} target="wound"/>
 <Callout n={3} x={296} y={68} tx={254} ty={98} target="aec"/>
 <Callout n={4} x={182} y={120} tx={227} ty={128} target="blastema"/>
 <Callout n={5} x={302} y={305} tx={258} ty={276} target="nerve"/>
 <Callout n={6} x={24} y={179} tx={65} ty={144} target="regenerate"/>
 </>;}

function Steroid({x,y}:{x:number;y:number}){return <path data-bio="hormone" d={`M${x-8} ${y-9}h11l7 9l-7 10h-11l-7-10Z`} fill="#d6e8dd" stroke={IC.green} strokeWidth={2}/>;}
function Receptor({x,y,bio='receptor'}:{x:number;y:number;bio?:string}){return <path data-bio={bio} d={`M${x-18} ${y-15}Q${x-35} ${y} ${x-16} ${y+17}L${x+8} ${y+17}Q${x+26} ${y+9} ${x+15} ${y-9}L${x+4} ${y-4}L${x-4} ${y-15}Z`} fill="#f4ceaa" stroke={IC.goldDark} strokeWidth={2.5}/>;}
export function NuclearReceptorScene(id:string){return <>
 <ellipse cx={319} cy={206} rx={293} ry={155} fill="#f7f5ed" stroke={IC.goldDark} strokeWidth={3}/>
 <ellipse cx={221} cy={191} rx={158} ry={107} fill="#eee6f3" stroke={IC.purple} strokeWidth={4}/>
 <He x={199} y={116} size={26} bold>גרעין</He><He x={500} y={289} size={26}>ציטופלזמה</He>
 <Steroid x={550} y={24}/><Flow id={id} d="M547 42L525 107" color={IC.green}/>
 <Receptor x={492} y={147}/><Steroid x={491} y={137}/>
 <ellipse data-bio="hsp" cx={493} cy={181} rx={30} ry={11} fill="#dbe3e8" stroke={IC.muted} strokeWidth={2}/>
 <Flow id={id} d="M459 148H405"/>
 <Receptor x={321} y={166} bio="dimer"/><Receptor x={278} y={166} bio="dimer"/><Steroid x={321} y={154}/><Steroid x={278} y={154}/>
 <path d="M278 184V214M321 184V214" stroke={IC.goldDark} strokeWidth={4}/>
 <path d="M95 214H350M95 223H350" stroke={IC.blueDark} strokeWidth={2.5}/>
 <rect data-bio="hre" x={259} y={211} width={84} height={15} rx={3} fill={IC.red}/>
 <ellipse data-bio="coactivator" cx={247} cy={143} rx={22} ry={15} fill="#c5dbea" stroke={IC.blueDark} strokeWidth={2}/>
 <Flow id={id} d="M248 246H176" color={IC.purple}/>
 <path data-bio="rna" d="M152 245q-10-13-20 0t-20 0t-20 0" fill="none" stroke={IC.purple} strokeWidth={4}/>
 <Flow id={id} d="M120 269Q134 322 211 327" color={IC.purple}/>
 <ellipse data-bio="ribosome" cx={254} cy={328} rx={25} ry={17} fill="#dbe3e8" stroke={IC.muted} strokeWidth={2}/>
 <path data-bio="protein" d="M278 331q10-13 20 0t20 0t20 0t20 0" fill="none" stroke={IC.blueDark} strokeWidth={5}/>
 <Callout n={1} x={605} y={27} tx={555} ty={24} target="hormone"/>
 <Callout n={2} x={581} y={166} tx={508} ty={155} target="receptor"/>
 <Callout n={3} x={560} y={228} tx={505} ty={186} target="hsp"/>
 <Callout n={4} x={352} y={195} tx={335} ty={170} target="dimer"/>
 <Callout n={5} x={296} y={259} tx={322} ty={220} target="hre"/>
 <Callout n={6} x={202} y={169} tx={233} ty={148} target="coactivator"/>
 <Callout n={7} x={172} y={269} tx={132} ty={245} target="rna"/>
 <Callout n={8} x={350} y={287} tx={338} ty={331} target="protein"/>
 </>;}

function Bone({x1,y1,x2,y2,w,c,bio}:{x1:number;y1:number;x2:number;y2:number;w:number;c:string;bio:string}){const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),a=Math.atan2(dy,dx)*180/Math.PI;return <g transform={`translate(${x1} ${y1}) rotate(${a})`}><path data-bio={bio} d={`M0 ${-w*.65}Q${len*.15} ${-w} ${len*.23} ${-w*.4}L${len*.78} ${-w*.4}Q${len*.93} ${-w} ${len} ${-w*.65}Q${len+w*.7} 0 ${len} ${w*.65}Q${len*.9} ${w} ${len*.78} ${w*.4}L${len*.23} ${w*.4}Q${len*.1} ${w} 0 ${w*.65}Q${-w*.7} 0 0 ${-w*.65}Z`} fill={c} stroke="#fff" strokeWidth={1}/></g>;}
function Limb({x,h,a,d,spread,kind}:{x:number;h:number;a:number;d:number;spread:number;kind:string}){const elbow=65+h,wrist=elbow+a+10,ys=wrist+21;return <g>
 {kind==='whale'&&<path d={`M${x-24} 68Q${x-57} 182 ${x-7} ${ys+d+29}Q${x+60} 229 ${x+29} 102Z`} fill="#eef2f4" stroke="#bfccd2" strokeWidth={1.5}/>}
 {kind==='bat'&&<path d={`M${x-10} ${wrist}L${x-70} ${ys+40}L${x-49} ${ys+97}L${x} ${ys+118}L${x+51} ${ys+92}L${x+79} ${ys+36}L${x+13} ${wrist}Z`} fill="#eef2f4" stroke="#bfccd2" strokeWidth={1.5}/>}
 <Bone x1={x} y1={58} x2={x-8} y2={elbow} w={11} c="#bc8148" bio="humerus"/>
 <Bone x1={x-13} y1={elbow+9} x2={x-15} y2={wrist} w={6} c={IC.blue} bio="forearm"/><Bone x1={x+1} y1={elbow+6} x2={x+1} y2={wrist} w={6} c={IC.blue} bio="forearm"/>
 {[-12,0,12].map((v,i)=><ellipse data-bio="carpals" key={v} cx={x+v-7} cy={wrist+10+(i%2)*5} rx={6} ry={5} fill={IC.green}/>)}
 {[-2,-1,0,1,2].map((v,i)=>{const ex=x+v*spread/2,ey=ys+d-Math.abs(v)*(kind==='bat'?20:4),sx=x-7+v*4;return <g key={v}><Bone x1={sx} y1={ys} x2={ex} y2={ey} w={kind==='whale'?5:3.6} c={IC.purple} bio="digits"/>{[.45,.75].map(t=><circle key={t} cx={sx+(ex-sx)*t} cy={ys+(ey-ys)*t} r={2.4} fill="#fff"/>)}</g>;})}
 </g>;}
export function LimbHomologyScene(){return <>
 <Limb x={543} h={68} a={71} d={61} spread={25} kind="human"/><Limb x={376} h={41} a={71} d={112} spread={72} kind="bat"/>
 <Limb x={212} h={30} a={35} d={105} spread={21} kind="whale"/><Limb x={66} h={74} a={72} d={31} spread={19} kind="cat"/>
 {[[543,'אדם','אחיזה'],[376,'עטלף','תעופה'],[212,'לווייתן','שחייה'],[66,'חתול','הליכה']].map(([x,n,f])=><g key={n}><He x={+x} y={350} size={27} bold>{n}</He><He x={+x} y={380} size={26}>{f}</He></g>)}
 <Callout n={1} x={602} y={86} tx={538} ty={99} target="humerus"/>
 <Callout n={2} x={601} y={172} tx={544} ty={169} target="forearm"/>
 <Callout n={3} x={600} y={235} tx={548} ty={224} target="carpals"/>
 <Callout n={4} x={604} y={308} tx={568} ty={288} target="digits"/>
 </>;}

function Mito({x,y}:{x:number;y:number}){return <g><ellipse data-bio="mito" cx={x} cy={y} rx={20} ry={11} fill="#efd5d8" stroke={IC.red} strokeWidth={2}/><path d={`M${x-13} ${y}q4-9 8 0t8 0t8 0`} fill="none" stroke={IC.red} strokeWidth={1.5}/></g>;}
function Plastid({x,y,rings=2}:{x:number;y:number;rings?:number}){return <g>{Array.from({length:rings},(_,i)=><ellipse data-bio={rings===2?'primary-plastid':'secondary-plastid'} key={i} cx={x} cy={y} rx={rings===2?31-i*4:40-i*7} ry={rings===2?23-i*3:29-i*5} fill={i===rings-1?'#d6e8dd':'none'} stroke={IC.green} strokeWidth={1.5}/>)}{[-9,4,15].map(v=><path key={v} d={`M${x-8} ${y+v/2}h16m-16 3h16`} stroke={IC.green} strokeWidth={1.7}/>)}</g>;}
export function EndosymbiosisScene(id:string){return <>
 <He x={555} y={28} size={26} bold>מאכסן ארכאי</He><He x={395} y={28} size={26} bold>אאוקריוט</He><He x={235} y={28} size={26} bold>אצה</He><He x={75} y={28} size={26} bold>בליעת אצה</He>
 {[555,395,235,75].map((x,i)=><g key={x}><ellipse cx={x} cy={190} rx={62} ry={83} fill={i?'#f7f5ed':'#e8f1f6'} stroke={i?IC.goldDark:IC.blueDark} strokeWidth={2.5}/>{i>0&&<circle cx={x-21} cy={211} r={17} fill="#dfd3e9" stroke={IC.purple} strokeWidth={2}/>}</g>)}
 <ellipse data-bio="alpha" cx={564} cy={180} rx={23} ry={12} fill="#efd5d8" stroke={IC.red} strokeWidth={2}/><path d="M551 180q6-7 12 0t12 0" fill="none" stroke={IC.red} strokeWidth={1.3}/>
 <Mito x={408} y={230}/><Mito x={410} y={170}/><Mito x={252} y={241}/><Mito x={90} y={244}/>
 <ellipse data-bio="cyano" cx={408} cy={81} rx={24} ry={12} fill="#d6e8dd" stroke={IC.green} strokeWidth={2}/><path d="M394 78h28m-28 6h28" stroke={IC.green} strokeWidth={2}/><Flow id={id} d="M408 99V132" color={IC.green}/>
 <Plastid x={247} y={166}/><Plastid x={88} y={165} rings={4}/><circle data-bio="nucleomorph" cx={117} cy={165} r={2.5} fill={IC.purple}/>
 <Flow id={id} d="M486 190H465"/><Flow id={id} d="M326 190H305"/><Flow id={id} d="M166 190H145"/>
 <He x={400} y={300} size={26}>ראשונית</He><He x={234} y={300} size={26}>ראשונית</He><He x={75} y={300} size={26}>משנית</He>
 <Callout n={1} x={610} y={102} tx={577} ty={177} target="alpha"/>
 <Callout n={2} x={457} y={253} tx={423} ty={232} target="mito"/>
 <Callout n={3} x={460} y={64} tx={424} ty={81} target="cyano"/>
 <Callout n={4} x={286} y={91} tx={263} ty={153} target="primary-plastid"/>
 <Callout n={5} x={39} y={88} tx={88} ty={136} target="secondary-plastid"/>
 <Callout n={6} x={166} y={122} tx={117} ty={165} target="nucleomorph"/>
 </>;}

function Mark({x,y,c,ac=false,bio}:{x:number;y:number;c:string;ac?:boolean;bio:string}){return <g><path d={`M${x} 153V${y}`} stroke={c} strokeWidth={3}/>{ac?<rect data-bio={bio} x={x-8} y={y-8} width={16} height={16} rx={3} fill={c}/>:<circle data-bio={bio} cx={x} cy={y} r={11} fill={c}/>}</g>;}
export function HistoneMarksScene(){return <>
 <ellipse cx={74} cy={153} rx={47} ry={37} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2.5}/><path d="M37 137Q74 113 113 137M32 154Q74 130 119 154M36 172Q74 148 113 172" fill="none" stroke={IC.blueDark} strokeWidth={3}/>
 <path d="M120 153H551" stroke={IC.ink} strokeWidth={4}/><He x={562} y={121} size={26} bold>קצה אמיני</He><He x={80} y={224} size={26}>נוקלאוזום</He>
 <He x={326} y={37} size={27} bold>{'זנב ההיסטון \u2066H3\u2069'}</He>
 <Mark x={482} y={204} c={IC.green} bio="k4"/><Mark x={386} y={204} c={IC.red} bio="k9"/><Mark x={290} y={204} c={IC.red} bio="k27"/><Mark x={194} y={204} c={IC.green} bio="k36"/>
 {[434,338,242].map(x=><Mark key={x} x={x} y={110} c={IC.blueDark} ac bio="acetyl"/>)}
 <g data-mark-actors="">
  <path d="M12 286H628" fill="none" stroke="#b8c5ce" strokeWidth={1.5}/>
  <He x={320} y={318} size={27} bold>מי פועל על הסימנים</He>
  {[12,222,432].map(x=><rect key={x} x={x} y={335} width={196} height={104} rx={10} fill="#f4f7f9" stroke="#b8c5ce" strokeWidth={1.5}/>)}
  <He x={530} y={365} size={26} bold>כותבים</He><He x={530} y={397} size={25}>אצטילטרנספראזות</He><He x={530} y={427} size={25}>ומתילטרנספראזות</He>
  <He x={320} y={365} size={26} bold>קוראים</He><He x={320} y={397} size={25}>ברומודומיין</He><He x={320} y={427} size={25}>וכרומודומיין</He>
  <He x={110} y={365} size={26} bold>מוחקים</He><He x={110} y={397} size={25}>דה־אצטילאזות</He><He x={110} y={427} size={25}>ודה־מתילאזות</He>
 </g>
 <Callout n={1} x={482} y={254} tx={482} ty={213} target="k4"/>
 <Callout n={2} x={386} y={254} tx={386} ty={213} target="k9"/>
 <Callout n={3} x={290} y={254} tx={290} ty={213} target="k27"/>
 <Callout n={4} x={194} y={254} tx={194} ty={213} target="k36"/>
 <Callout n={5} x={399} y={69} tx={431} ty={105} target="acetyl"/>
 </>;}

function Nucleosome({x,y,marked=false}:{x:number;y:number;marked?:boolean}){return <g><circle data-bio={marked?'marked':'unmarked'} cx={x} cy={y} r={13} fill={marked?'#efd5d8':IC.goldPale} stroke={marked?IC.red:IC.goldDark} strokeWidth={2}/><path d={`M${x-11} ${y-5}q11-7 22 0m-22 9q11-7 22 0`} fill="none" stroke={IC.blueDark} strokeWidth={2}/>{marked&&<><path d={`M${x} ${y-13}v-16`} stroke={IC.red} strokeWidth={2}/><circle data-bio="k9mark" cx={x} cy={y-32} r={5} fill={IC.red}/><path data-bio="hp1" d={`M${x-13} ${y-42}q13-13 26 0v6h-26Z`} fill="#d4c1e0" stroke={IC.purple} strokeWidth={1.5}/></>}</g>;}
function SpreadRow({y,boundary,id}:{y:number;boundary:boolean;id:string}){return <g data-spread-row={boundary?'boundary':'pev'} transform={`translate(0 ${y})`}>
 <He x={320} y={27} size={27} bold>{boundary?'עם גבול':'ללא גבול (\u2066PEV\u2069)'}</He>
 <path data-fiber="" d="M30 117H610M30 123H610" fill="none" stroke="#a2b7c5" strokeWidth={2}/>
 <rect data-bio={boundary?'active-gene':'silent-gene'} x={40} y={98} width={150} height={44} rx={5} fill={boundary?'#d6e8dd':'#e1e5e7'} stroke={boundary?IC.green:IC.muted} strokeWidth={2}/>
 <La x={115} y={128} size={24} bold color={boundary?IC.green:IC.muted}>white</La>
 <rect data-bio="nucleation" x={558} y={66} width={44} height={81} rx={8} fill="none" stroke={IC.red} strokeWidth={2} strokeDasharray="5 4"/>
 {[580,530,480,430,380,330,280,230].map((a,i)=><Nucleosome key={a} x={a} y={120} marked={!boundary||i<5}/>)}
 {boundary&&<rect data-bio="barrier" x={351} y={72} width={7} height={92} rx={3} fill={IC.ink}/>}
 <ellipse data-bio="writer" cx={480} cy={52} rx={23} ry={14} fill="#c5dbea" stroke={IC.blueDark} strokeWidth={2}/>
 <Flow id={id} d={boundary?'M580 165H360':'M580 165H205'} color={IC.red}/>
 <He x={112} y={194} size={26} bold color={boundary?IC.green:IC.muted}>{boundary?'פעיל':'מושתק'}</He>
 {boundary&&<>
  <Callout n={1} x={618} y={38} tx={596} ty={66} target="nucleation"/>
  <Callout n={2} x={518} y={22} tx={491} ty={48} target="writer"/>
  <Callout n={3} x={411} y={51} tx={430} ty={77} target="hp1"/>
  <Callout n={4} x={312} y={55} tx={354} ty={83} target="barrier"/>
  <Callout n={5} x={18} y={71} tx={42} ty={104} target="active-gene"/>
 </>}
 {!boundary&&<>
  <Callout n={6} x={260} y={54} tx={230} ty={88} target="k9mark"/>
  <Callout n={7} x={18} y={71} tx={42} ty={104} target="silent-gene"/>
 </>}
 </g>;}
export function HeterochromatinSpreadingScene(id:string){return <><SpreadRow y={0} boundary id={id}/><SpreadRow y={215} boundary={false} id={id}/></>;}

