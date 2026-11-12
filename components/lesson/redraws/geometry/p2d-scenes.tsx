import {He,La,IC,Callout,Flow} from './ub-zoo';
export {Plate} from './p2c-scenes';

function Disc({x,y,c,f,bio}:{x:number;y:number;c:string;f:string;bio:string}){return <g><ellipse data-bio={bio} cx={x} cy={y} rx={15} ry={11} fill={f} stroke={c} strokeWidth={2.5}/><path d={`M${x-8} ${y+1}q8-9 16 0`} fill="none" stroke={c} strokeWidth={1}/></g>;}
export function ImaginalDiscsScene(id:string){return <>
 <He x={472} y={28} size={26} bold>זחל</He><He x={150} y={28} size={26} bold>בוגר</He>
 <path d="M470 57C426 55 411 102 414 154L418 258Q426 307 470 323Q516 309 525 258L529 154C532 105 513 58 470 57Z" fill="#fff3df" stroke={IC.goldDark} strokeWidth={2.5}/>
 {[103,134,165,196,227,258,287].map(y=><path key={y} d={`M${y>270?433:420} ${y}Q470 ${y+12} ${y>270?508:523} ${y}`} fill="none" stroke="#d9c5a3" strokeWidth={1.2}/>)}
 <Disc x={453} y={95} c={IC.red} f="#efd5d8" bio="eye-disc"/>
 <Disc x={449} y={155} c={IC.blueDark} f={IC.bluePale} bio="wing-disc"/>
 <Disc x={489} y={174} c={IC.purple} f="#dfd3e9" bio="haltere-disc"/>
 {[198,232,266].map(y=><Disc key={y} x={449} y={y} c={IC.green} f="#d5e7db" bio="leg-disc"/>)}
 <Disc x={481} y={293} c={IC.goldDark} f={IC.goldPale} bio="genital-disc"/>
 <path d="M142 145Q73 132 54 183Q67 214 131 207L155 189Z" fill="#e8edf0" stroke={IC.muted} strokeWidth={2.5}/>
 {[76,95,114].map(x=><path key={x} d={`M${x} 149q-9 27 0 55`} fill="none" stroke="#b5c3ca" strokeWidth={1.3}/>)}
 <ellipse cx={164} cy={162} rx={36} ry={45} fill="#eef2f3" stroke={IC.muted} strokeWidth={2.5}/>
 <path d="M155 144C93 117 80 65 111 62Q169 64 190 139Z" fill={IC.bluePale} stroke={IC.blueDark} strokeWidth={2.5}/>
 <path d="M158 135Q128 92 112 75M158 135Q147 93 128 78" fill="none" stroke={IC.blueDark} strokeWidth={1}/>
 <circle cx={200} cy={113} r={26} fill="#efd5d8" stroke={IC.red} strokeWidth={2.5}/><ellipse cx={210} cy={113} rx={10} ry={15} fill={IC.red}/>
 <path d="M205 89l8-15m-16 15l-2-18" stroke={IC.red} strokeWidth={3}/>
 <path d="M137 182l-24 44l-44 23m92-45l-4 47l-39 34m61-86l24 42l36 17" fill="none" stroke={IC.green} strokeWidth={5} strokeLinecap="round"/>
 <path d="M139 163l-16 8" stroke={IC.purple} strokeWidth={3}/><circle cx={119} cy={174} r={7} fill="#dfd3e9" stroke={IC.purple} strokeWidth={2}/>
 <ellipse cx={57} cy={184} rx={9} ry={11} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>
 <Flow id={id} d="M370 180H276"/><He x={323} y={150} size={26}>גלגול</He>
 <Callout n={1} x={392} y={75} tx={443} ty={92} target="eye-disc"/>
 <Callout n={2} x={382} y={126} tx={439} ty={151} target="wing-disc"/>
 <Callout n={3} x={574} y={158} tx={500} ty={172} target="haltere-disc"/>
 <Callout n={4} x={383} y={250} tx={439} ty={263} target="leg-disc"/>
 <Callout n={5} x={570} y={310} tx={493} ty={296} target="genital-disc"/>
 </>;}

function PhotoCell({x,y,n,c,f,bio}:{x:number;y:number;n:number;c:string;f:string;bio:string}){return <g><circle data-bio={bio} cx={x} cy={y} r={20} fill={f} stroke={c} strokeWidth={2.5}/><La x={x} y={y+8} size={25} bold color={c}>{`\u2066R${n}\u2069`}</La></g>;}
export function EyeOmmatidiumScene(id:string){return <>
 <He x={473} y={28} size={26} bold>דיסקת העין</He><He x={148} y={28} size={26} bold>אומטידיום</He>
 <ellipse cx={476} cy={186} rx={104} ry={104} fill="#fff3df" stroke={IC.goldDark} strokeWidth={2.5}/>
 <path data-bio="furrow" d="M469 84Q449 185 469 287" fill="none" stroke="#98a9b3" strokeWidth={13}/>
 {[0,1,2,3,4].map(i=>[0,1,2,3,4,5].map(j=>{const x=486+i*17,y=126+j*22+(i%2?11:0);return ((x-476)/96)**2+((y-186)/96)**2<.85?<circle key={i+'-'+j} data-bio="ommatidia" cx={x} cy={y} r={6} fill="#efd5d8" stroke={IC.red} strokeWidth={1.2}/>:null;}))}
 <Flow id={id} d="M509 59H436"/><He x={402} y={325} size={26}>קדמי</He><He x={549} y={325} size={26}>אחורי</He>
 <PhotoCell x={150} y={190} n={8} c={IC.red} f="#efd5d8" bio="r8"/>
 <PhotoCell x={120} y={147} n={2} c="#a65a2e" f="#fae0c9" bio="r25"/><PhotoCell x={120} y={233} n={5} c="#a65a2e" f="#fae0c9" bio="r25"/>
 <PhotoCell x={78} y={122} n={3} c={IC.goldDark} f={IC.goldPale} bio="r34"/><PhotoCell x={78} y={258} n={4} c={IC.goldDark} f={IC.goldPale} bio="r34"/>
 <PhotoCell x={192} y={146} n={1} c={IC.green} f="#d5e7db" bio="r16"/><PhotoCell x={192} y={234} n={6} c={IC.green} f="#d5e7db" bio="r16"/>
 <PhotoCell x={207} y={190} n={7} c={IC.blueDark} f={IC.bluePale} bio="r7"/>
 <Callout n={1} x={384} y={83} tx={464} ty={119} target="furrow"/>
 <Callout n={2} x={604} y={238} tx={554} ty={214} target="ommatidia"/>
 <Callout n={3} x={156} y={305} tx={151} ty={208} target="r8"/>
 <Callout n={4} x={124} y={72} tx={120} ty={129} target="r25"/>
 <Callout n={5} x={29} y={87} tx={61} ty={111} target="r34"/>
 <Callout n={6} x={230} y={83} tx={200} ty={130} target="r16"/>
 <Callout n={7} x={286} y={197} tx={226} ty={191} target="r7"/>
 </>;}

export function WormGonadScene(){return <>
 <He x={320} y={28} size={26} bold>צד גבי</He>
 <path d="M44 92Q115 60 320 62Q527 60 596 92Q614 168 591 268Q323 299 48 268Q25 175 44 92Z" fill="#faf9f4" stroke="#b5c3ca" strokeWidth={1.5}/>
 <path d="M237 119H117Q74 119 74 171Q74 220 122 220H290M403 119H523Q566 119 566 171Q566 220 518 220H350" fill="none" stroke="#bca7cc" strokeWidth={37} strokeLinecap="round"/>
 <path data-bio="meiotic" d="M175 119H117Q74 119 74 171Q74 220 122 220H290M465 119H523Q566 119 566 171Q566 220 518 220H350" fill="none" stroke="#ece4f1" strokeWidth={31} strokeLinecap="round"/>
 <path data-bio="stem" d="M175 119H226M465 119H414" stroke={IC.green} strokeWidth={31}/>
 {[186,204,220,420,436,453].map(x=><g key={x}><circle cx={x} cy={114} r={3} fill="#fff"/><circle cx={x-5} cy={126} r={3} fill="#fff"/></g>)}
 {[112,132,152].map(x=><circle key={x} cx={x} cy={119} r={4} fill={IC.purple}/>)}
 {[116,145,178,215,255].map((x,i)=><g key={x}><circle data-bio="oocyte" cx={x} cy={220} r={8+i*1.7} fill="#fae0c9" stroke="#a65a2e" strokeWidth={2}/><circle cx={x+1} cy={219} r={3} fill="#a65a2e"/><circle data-bio="oocyte" cx={640-x} cy={220} r={8+i*1.7} fill="#fae0c9" stroke="#a65a2e" strokeWidth={2}/><circle cx={639-x} cy={219} r={3} fill="#a65a2e"/></g>)}
 {[239,401].map(x=><path data-bio="dtc" key={x} d={`M${x-12} 106l10-4l9 7l7 1l-4 8l2 10l-12 3l-12-8l-7-1l4-8Z`} fill="#efd5d8" stroke={IC.red} strokeWidth={2}/>)}
 <ellipse data-bio="uterus" cx={320} cy={222} rx={24} ry={20} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2.5}/>
 <path data-bio="vulva" d="M309 248L320 268L331 248" fill="none" stroke={IC.ink} strokeWidth={3}/>
 <He x={320} y={330} size={26} bold>צד בטני</He>
 <Callout n={1} x={294} y={90} tx={248} ty={112} target="dtc"/>
 <Callout n={2} x={193} y={84} tx={193} ty={108} target="stem"/>
 <Callout n={3} x={124} y={170} tx={76} ty={167} target="meiotic"/>
 <Callout n={4} x={189} y={175} tx={208} ty={228} target="oocyte"/>
 <Callout n={5} x={372} y={184} tx={338} ty={211} target="uterus"/>
 <Callout n={6} x={370} y={258} tx={325} ty={259} target="vulva"/>
 </>;}

function ChickDisc({x}:{x:number}){return <g><ellipse cx={x} cy={167} rx={78} ry={112} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/><ellipse cx={x} cy={167} rx={56} ry={88} fill="#fffdfa" stroke="#c6b58d" strokeWidth={1.3}/></g>;}
export function ChickStreakScene(id:string){return <>
 <He x={520} y={28} size={26} bold>לפני הפס</He><He x={320} y={28} size={26} bold>התארכות</He><He x={120} y={28} size={26} bold>פס מלא</He>
 <ChickDisc x={520}/><ChickDisc x={320}/><ChickDisc x={120}/>
 <path data-bio="margin" d="M479 236Q520 270 561 236L559 253Q521 278 481 253Z" fill="#e0a36f" stroke="#a65a2e" strokeWidth={1.5}/>
 <rect data-bio="early-streak" x={315} y={180} width={10} height={77} rx={5} fill={IC.red}/>
 <Flow id={id} d="M273 237Q279 210 307 193"/><Flow id={id} d="M367 237Q361 210 333 193"/>
 <Flow id={id} d="M320 167V137" color={IC.red}/>
 <rect data-bio="streak" x={115} y={125} width={10} height={132} rx={5} fill={IC.red}/><circle data-bio="hensen" cx={120} cy={121} r={12} fill="#dfd3e9" stroke={IC.purple} strokeWidth={2.5}/>
 <Callout n={1} x={585} y={302} tx={549} ty={253} target="margin"/>
 <Callout n={2} x={375} y={283} tx={323} ty={249} target="early-streak"/>
 <Callout n={3} x={50} y={298} tx={117} ty={248} target="streak"/>
 <Callout n={4} x={214} y={95} tx={128} ty={114} target="hensen"/>
 </>;}

function Blastomere({x,y,r=16,fill='#eef2f3',bio='blastomere'}:{x:number;y:number;r?:number;fill?:string;bio?:string}){return <g><circle data-bio={bio} cx={x} cy={y} r={r} fill={fill} stroke={IC.blueDark} strokeWidth={1.6}/><circle cx={x-2} cy={y-2} r={r/4} fill="#bccfd8"/></g>;}
export function MouseBlastocystScene(id:string){return <>
 <He x={557} y={28} size={26} bold>שמונה תאים</He><He x={406} y={28} size={26} bold>דחיסה</He><He x={248} y={28} size={26} bold>בלסטוציסט</He><He x={80} y={28} size={26} bold>כוס העובר</He>
 {[[-18,-15],[14,-15],[-18,17],[14,17],[-6,-35],[25,-34],[-5,-3],[27,-1]].map(([x,y],i)=><Blastomere key={i} x={553+x} y={151+y} r={16} fill={i<4?'#eef2f3':'#e1e9ec'}/>)}
 <circle data-bio="outer" cx={405} cy={148} r={44} fill={IC.bluePale} stroke={IC.blueDark} strokeWidth={3}/>
 {[0,1,2,3,4,5,6,7,8,9].map(i=>{const a=i*Math.PI/5;return <path key={i} d={`M${405+31*Math.cos(a)} ${148+31*Math.sin(a)}L${405+44*Math.cos(a)} ${148+44*Math.sin(a)}`} stroke={IC.blueDark} strokeWidth={1.2}/>;})}
 {[[-12,-10],[12,-9],[0,14]].map(([x,y])=><Blastomere key={x} x={405+x} y={148+y} r={12} fill="#d5e7db" bio="inner"/>)}
 <circle data-bio="cavity" cx={246} cy={148} r={47} fill="#fff"/>
 <circle data-bio="trophectoderm" cx={246} cy={148} r={47} fill="none" stroke={IC.blueDark} strokeWidth={10}/>
 {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=i*Math.PI/6;return <path key={i} d={`M${246+42*Math.cos(a)} ${148+42*Math.sin(a)}L${246+52*Math.cos(a)} ${148+52*Math.sin(a)}`} stroke="#9cbacb" strokeWidth={1.1}/>;})}
 {[[-13,-24],[10,-24],[0,-7]].map(([x,y])=><Blastomere key={x} x={246+x} y={148+y} r={13} fill="#d5e7db" bio="icm"/>)}
 <path data-bio="endoderm" d="M40 87V177Q40 220 79 220Q119 220 119 177V87L110 87V176Q110 208 79 208Q50 208 50 176V87Z" fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={2}/>
 <path data-bio="epiblast" d="M54 99V174Q54 202 79 202Q105 202 105 174V99L92 99V174Q92 185 79 185Q67 185 67 174V99Z" fill="#d5e7db" stroke={IC.green} strokeWidth={2}/>
 <path data-bio="ave" d="M40 164v23q1 10 8 18l9-6q-7-8-7-16v-19Z" fill={IC.red}/><rect data-bio="posterior-streak" x={109} y={155} width={9} height={33} rx={3} fill="#a65a2e"/>
 <Flow id={id} d="M509 149H472"/><Flow id={id} d="M354 149H308"/><Flow id={id} d="M189 149H135"/>
 <Callout n={1} x={601} y={90} tx={579} ty={110} target="blastomere"/>
 <Callout n={2} x={435} y={70} tx={426} ty={118} target="outer"/>
 <Callout n={3} x={392} y={228} tx={403} ty={169} target="inner"/>
 <Callout n={4} x={250} y={61} tx={250} ty={100} target="trophectoderm"/>
 <Callout n={5} x={316} y={87} tx={261} ty={120} target="icm"/>
 <Callout n={6} x={279} y={234} tx={263} ty={174} target="cavity"/>
 <Callout n={7} x={78} y={267} tx={80} ty={195} target="epiblast"/>
 <Callout n={8} x={22} y={62} tx={44} ty={95} target="endoderm"/>
 <Callout n={9} x={22} y={245} tx={46} ty={186} target="ave"/>
 <Callout n={10} x={151} y={245} tx={115} ty={181} target="posterior-streak"/>
 </>;}

export function NodalFlowScene(id:string){return <>
 <He x={464} y={28} size={26} bold>זרימה בקשר</He><He x={150} y={28} size={26} bold>ביטוי בצד שמאל</He>
 <path d="M345 125V203Q345 230 372 230H569Q597 230 597 203V125" fill="#eef4f6" stroke={IC.blueDark} strokeWidth={2.5}/>
 <path data-flow="" data-bio="left-flow" d="M577 88H362" fill="none" stroke={IC.blueDark} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/>
 {[379,422,465,508,551].map(x=><g key={x}><path data-bio="cilium" d={`M${x} 224Q${x+3} 196 ${x+15} 173`} fill="none" stroke={IC.purple} strokeWidth={5}/><ellipse data-bio="rotation" cx={x+15} cy={170} rx={12} ry={5} fill="none" stroke={IC.purple} strokeWidth={2}/></g>)}
 <He x={367} y={313} size={26}>שמאל</He><He x={575} y={313} size={26}>ימין</He>
 <ellipse cx={150} cy={173} rx={85} ry={112} fill="#fff3df" stroke={IC.goldDark} strokeWidth={2}/>
 <rect data-bio="lefty" x={145} y={75} width={10} height={198} rx={5} fill="#dfd3e9" stroke={IC.purple} strokeWidth={1.5}/>
 <ellipse data-bio="left-expression" cx={109} cy={180} rx={16} ry={63} fill="#efd5d8" stroke={IC.red} strokeWidth={2}/>
 <path data-bio="heart" d="M104 88c-13-9-23 9-9 17l12 7l11-14c7-14-7-21-14-10Z" fill={IC.red}/>
 <He x={89} y={328} size={26}>שמאל</He><He x={214} y={328} size={26}>ימין</He>
 <Callout n={1} x={570} y={46} tx={510} ty={88} target="left-flow"/>
 <Callout n={2} x={329} y={271} tx={383} ty={211} target="cilium"/>
 <Callout n={3} x={624} y={151} tx={578} ty={170} target="rotation"/>
 <Callout n={4} x={28} y={236} tx={102} ty={215} target="left-expression"/>
 <Callout n={5} x={263} y={81} tx={150} ty={91} target="lefty"/>
 </>;}
