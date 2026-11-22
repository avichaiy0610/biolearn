import {He,IC,Callout,Flow} from './ub-zoo';
export {Plate} from './p2c-scenes';
const blue='#27749a',purple='#8356a2',red='#ad3e50',green='#357a60',gold='#a37132';
function Chrom({x,bio='active',c=blue}:{x:number;bio?:string;c?:string}){return <path data-bio={bio} d={`M${x-9} 92Q${x-20} 105 ${x-8} 136Q${x-17} 162 ${x-10} 186Q${x} 200 ${x+10} 186Q${x+17} 161 ${x+8} 136Q${x+20} 105 ${x+9} 92Z`} fill={c===blue?'#d5e7f0':c===purple?'#e5d8ee':'#f0d5db'} stroke={c} strokeWidth={3}/>;}
export function XInactivationStepsScene(id:string){return <>
 {[['ספירה ובחירה',548],['ציפוי מקומי',389],['השתקה',230],['שימור',70]].map(([t,x])=><He key={t} x={+x} y={30} size={25} bold>{t}</He>)}
 {[548,389,230,70].map(x=><Chrom key={x} x={x+22}/>)}<Chrom x={526} bio="choice"/>
 <Chrom x={367} c={purple} bio="xist"/>{[105,120,135,150,165,180].map(y=><path key={y} data-bio="xist" d={`M351 ${y}q16-12 32 0`} stroke={purple} strokeWidth={4} fill="none"/>)}
 <Chrom x={208} c={red} bio="silent"/>{[105,127,153,178].map(y=><circle data-bio="silent" key={y} cx={191} cy={y} r={5} fill={red}/>)}
 <ellipse data-bio="barr" cx={48} cy={145} rx={20} ry={34} fill="#34414d"/>
 {[504,345,186].map(x=><Flow key={x} id={id} d={`M${x} 226h-60`}/>)}
 <He x={548} y={276} size={25}>עותק אחד</He><He x={389} y={276} size={25}>פועל בציס</He>
 <He x={230} y={276} size={25}>השעתוק נעצר</He><He x={70} y={276} size={25}>נשמר בחלוקות</He>
 <Callout n={1} x={484} y={66} tx={521} ty={113} target="choice"/>
 <Callout n={2} x={326} y={66} tx={359} ty={108} target="xist"/>
 <Callout n={3} x={165} y={66} tx={204} ty={112} target="silent"/>
 <Callout n={4} x={18} y={79} tx={43} ty={123} target="barr"/>
 </>;}

function Hairpin({x,y,tail=false,bio}:{x:number;y:number;tail?:boolean;bio:string}){return <g><path data-bio={bio} d={`M${x} ${y}h43a11 11 0 1 1 0 22h-43${tail?'h-37':''}`} fill="none" stroke={purple} strokeWidth={4}/>{[8,16,24,32].map(v=><path key={v} d={`M${x+v} ${y+3}v16`} stroke="#bda6cd" strokeWidth={2}/>)}</g>;}
function Blob({x,y,bio,c=green}:{x:number;y:number;bio:string;c?:string}){return <path data-bio={bio} transform={`translate(${x} ${y}) scale(1.45 1.15)`} d="M-37-14Q-55-45-10-39Q42-56 46-5Q53 34 3 31Q-46 41-37-14Z" fill={c===green?'#d7eadd':c===red?'#f0d5db':'#e7dced'} stroke={c} strokeWidth={2.5}/>;}
export function MirnaPathwayScene(id:string){return <>
 <rect x={15} y={35} width={610} height={144} rx={18} fill="#f0eaf5" stroke={purple} strokeWidth={2}/>
 <He x={574} y={65} size={25} bold>גרעין</He>
 <path data-bio="gene" d="M490 104h83m-83 9h83" stroke={blue} strokeWidth={3}/><rect x={503} y={88} width={56} height={36} rx={4} fill="#d8e8ef" stroke={blue}/><He x={531} y={113} size={25}>גן</He>
 <Flow id={id} d="M480 108H419"/><Hairpin x={335} y={95} tail bio="primary"/>
 <He x={355} y={153} size={25}>⁦pri-miRNA⁩</He><Flow id={id} d="M291 108H209"/>
 <He x={249} y={80} size={25}>⁦Drosha⁩</He><Hairpin x={111} y={95} bio="precursor"/><He x={139} y={153} size={25}>⁦pre-miRNA⁩</He>
 <Flow id={id} d="M140 180V239" color={blue}/><He x={248} y={213} size={25}>⁦Exportin-5⁩</He>
 <Hairpin x={111} y={250} bio="export"/><Flow id={id} d="M180 260H257"/>
 <He x={214} y={245} size={25}>⁦Dicer⁩</He><path data-bio="duplex" d="M279 250h67m-67 14h67" stroke={purple} strokeWidth={4}/>
 <He x={315} y={311} size={25}>כ־⁦22⁩ נוקלאוטידים</He><Flow id={id} d="M363 258H412"/>
 <Blob x={480} y={260} bio="risc"/><He x={480} y={260} size={25} bold>⁦RISC⁩</He><He x={480} y={286} size={25}>⁦Ago⁩</He>
 <Flow id={id} d="M490 305V349" color={green}/>
 <path data-bio="target-rna" d="M49 398H581" stroke={purple} strokeWidth={4}/><circle cx={49} cy={398} r={7} fill={IC.ink}/>
 <rect data-bio="coding" x={111} y={379} width={175} height={38} rx={4} fill="#e9def0" stroke={purple} strokeWidth={2}/><He x={199} y={405} size={25} bold>אזור מקודד</He>
 <path data-bio="seed" d="M429 376h87m-79 4v14m12-14v14m12-14v14m12-14v14m12-14v14m12-14v14m12-14v14" stroke={green} strokeWidth={3}/>
 <He x={330} y={449} size={25}>עיכוב תרגום ודה־אדנילציה</He><He x={565} y={326} size={25}>ציטופלזמה</He>
 <Callout n={1} x={414} y={63} tx={370} ty={95} target="primary"/>
 <Callout n={2} x={66} y={64} tx={120} ty={95} target="precursor"/>
 <Callout n={3} x={54} y={220} tx={117} ty={250} target="export"/>
 <Callout n={4} x={378} y={215} tx={330} ty={250} target="duplex"/>
 <Callout n={5} x={590} y={220} tx={526} ty={245} target="risc"/>
 <Callout n={6} x={583} y={370} tx={509} ty={383} target="seed"/>
 </>;}

function Sensor({x,y,bio,c=green}:{x:number;y:number;bio:string;c?:string}){return <g><circle data-bio={bio} cx={x} cy={y} r={21} fill={c===green?'#d7eadd':'#f0d5db'} stroke={c} strokeWidth={3}/><path d={`M${x-8} ${y}l8-7 8 7-8 7Z`} fill={c}/></g>;}
export function PrrScene(id:string){return <>
 <rect x={18} y={82} width={595} height={337} rx={40} fill="#f8f4e9" stroke={gold} strokeWidth={3}/>
 {[450,539].map((x,i)=><g key={x}><path data-bio={i?'tlr5':'tlr4'} d={`M${x-13} 48v34h26V48m-13 34v30`} fill="none" stroke={i?green:blue} strokeWidth={7}/><He x={x} y={i?15:35} size={25}>{i?'פלגלין':'⁦LPS⁩'}</He></g>)}
 <ellipse cx={475} cy={207} rx={96} ry={50} fill="#ede2f2" stroke={purple} strokeWidth={3}/>
 {[425,475,525].map(x=><path key={x} data-bio="endotlr" d={`M${x-8} 213v-28h16v28m-8-28v-45`} fill="none" stroke={purple} strokeWidth={5}/>)}
 <He x={475} y={292} size={25}>אנדוזום</He><He x={475} y={321} size={25}>⁦RNA⁩ ו⁦DNA⁩</He>
 <Sensor x={300} y={154} bio="rig"/><Sensor x={300} y={256} bio="cgas"/>
 <Sensor x={92} y={154} bio="inflam" c={red}/>{[0,1,2,3,4,5].map(i=><circle key={i} cx={92+32*Math.cos(i*Math.PI/3)} cy={154+32*Math.sin(i*Math.PI/3)} r={5} fill={red}/>)}
 <He x={100} y={223} size={25}>⁦NLRP3⁩</He><He x={100} y={252} size={25}>⁦IL-1β⁩</He>
 <ellipse data-bio="nucleus" cx={210} cy={364} rx={92} ry={37} fill="#dceaf1" stroke={blue} strokeWidth={3}/><He x={210} y={373} size={25}>גרעין</He>
 <Flow id={id} d="M281 168L212 327"/><Flow id={id} d="M287 280L245 327"/><Flow id={id} d="M407 242L298 349"/>
 <He x={448} y={391} size={25}>ציטוזול</He>
 <Callout n={1} x={389} y={60} tx={437} ty={64} target="tlr4"/>
 <Callout n={2} x={600} y={49} tx={552} ty={63} target="tlr5"/>
 <Callout n={3} x={568} y={132} tx={533} ty={190} target="endotlr"/>
 <Callout n={4} x={355} y={118} tx={311} ty={146} target="rig"/>
 <Callout n={5} x={356} y={238} tx={311} ty={250} target="cgas"/>
 <Callout n={6} x={137} y={114} tx={102} ty={144} target="inflam"/>
 <Callout n={7} x={76} y={367} tx={140} ty={365} target="nucleus"/>
 </>;}

function BCell({x,y,bio='bcell',c=blue}:{x:number;y:number;bio?:string;c?:string}){return <g><circle data-bio={bio} cx={x} cy={y} r={16} fill={c===blue?'#d8e9f1':c===green?'#d7eadd':'#e9dcef'} stroke={c} strokeWidth={2}/><circle cx={x-3} cy={y+2} r={7} fill={c} opacity={.45}/></g>;}
export function GerminalCenterScene(id:string){return <>
 <path d="M325 68C485 37 584 137 575 252Q566 329 325 315Z" fill="#c8ddec" stroke={blue} strokeWidth={2}/>
 <path d="M325 68C172 35 88 123 103 249Q115 333 325 315Z" fill="#edf3f7" stroke={blue} strokeWidth={2}/>
 <He x={455} y={103} size={27} bold>אזור כהה</He><He x={221} y={103} size={27} bold>אזור בהיר</He>
 {[[420,147],[475,167],[529,196],[433,227],[493,264]].map(([x,y])=><BCell key={x} x={x} y={y} bio="division"/>)}
 <BCell x={277} y={177} bio="selected"/><BCell x={145} y={156} bio="tfh" c={green}/>
 <path data-bio="fdc" d="M211 168l12 30 24-10-12 24 21 17-31-1-7 31-13-27-29 11 12-26-22-19 32 2Z" fill="#ecd6b2" stroke={gold} strokeWidth={3}/>
 <circle cx={226} cy={189} r={5} fill={red}/><circle cx={239} cy={209} r={5} fill={red}/>
 <Flow id={id} d="M404 130Q350 98 305 147"/><Flow id={id} d="M282 250Q342 294 407 267"/>
 <Flow id={id} d="M127 245L68 304" color={purple}/><Flow id={id} d="M143 273L149 349" color={green}/><Flow id={id} d="M260 280L288 354" color={red}/>
 <BCell x={45} y={330} bio="plasma" c={purple}/><BCell x={149} y={375} bio="memory" c={green}/>
 <path data-bio="apoptosis" d="M290 374l-12-10m12 10 12-11m-12 11 8 12m-8-12-13 10" stroke={red} strokeWidth={6}/>
 <He x={460} y={364} size={25}>מוטציות וחלוקה</He><He x={472} y={401} size={25}>עוד סבב</He>
 <Callout n={1} x={584} y={131} tx={486} ty={163} target="division"/>
 <Callout n={2} x={205} y={294} tx={213} ty={239} target="fdc"/>
 <Callout n={3} x={93} y={109} tx={139} ty={148} target="tfh"/>
 <Callout n={4} x={299} y={229} tx={283} ty={189} target="selected"/>
 <Callout n={5} x={24} y={391} tx={41} ty={341} target="plasma"/>
 <Callout n={6} x={202} y={399} tx={160} ty={382} target="memory"/>
 <Callout n={7} x={340} y={398} tx={293} ty={378} target="apoptosis"/>
 </>;}

function ReceptorPair({y,bio,left,right,c}:{y:number;bio:string;left:string;right:string;c:string}){return <g>
 <rect data-bio={bio} x={306} y={y-17} width={42} height={34} rx={6} fill="#e5d9ee" stroke={c} strokeWidth={3}/>
 <rect data-bio={bio} x={373} y={y-17} width={42} height={34} rx={6} fill="#d6e7ef" stroke={c} strokeWidth={3}/><path d={`M348 ${y}h25`} stroke={c} strokeWidth={3}/>
 <He x={225} y={y+7} size={25}>{left}</He><He x={486} y={y+7} size={25}>{right}</He></g>;}
export function TwoSignalsScene(id:string){return <>
 <path d="M436 51L602 69L578 119L606 168L576 222L602 302L427 295L414 232L425 170L413 106Z" fill="#f1e2c7" stroke={gold} strokeWidth={3}/>
 <path d="M306 75C158 36 110 97 117 180Q107 303 305 286Z" fill="#dfedf4" stroke={blue} strokeWidth={3}/>
 <He x={521} y={30} size={25} bold>תא דנדריטי מופעל</He><He x={213} y={30} size={25} bold>תא ⁦T⁩ נאיבי</He>
 <ReceptorPair y={107} bio="antigen" left="⁦TCR⁩" right="פפטיד ו־⁦MHC⁩" c={green}/>
 <He x={362} y={43} size={25}>אות ראשון</He>
 <ReceptorPair y={193} bio="costim" left="⁦CD28⁩" right="⁦B7⁩" c={purple}/>
 <He x={361} y={156} size={25}>אות שני</He>
 {[[360,278],[378,260],[336,286]].map(([x,y])=><circle key={x} data-bio="cytokine" cx={x} cy={y} r={6} stroke={green} strokeWidth={3} fill="#d7eadd"/>)}
 <Flow id={id} d="M405 257H387" color={green}/><Flow id={id} d="M319 265H289" color={green}/>
 <He x={492} y={325} size={25}>אות שלישי</He>
 <rect data-bio="outcome" x={30} y={362} width={265} height={83} rx={12} fill="#e1eee5" stroke={green} strokeWidth={2}/>
 <He x={162} y={393} size={25}>ראשון ושני: התרבות</He><He x={162} y={425} size={25}>הפרשת ⁦IL-2⁩</He>
 <rect data-bio="anergy" x={330} y={362} width={270} height={83} rx={12} fill="#f4e3e5" stroke={red} strokeWidth={2}/>
 <He x={465} y={393} size={25}>ראשון בלבד: אנרגיה</He><He x={465} y={425} size={25}>ללא קו־גירוי</He>
 <Callout n={1} x={360} y={69} tx={391} ty={104} target="antigen"/>
 <Callout n={2} x={367} y={232} tx={394} ty={204} target="costim"/>
 <Callout n={3} x={270} y={321} tx={336} ty={286} target="cytokine"/>
 <Callout n={4} x={21} y={336} tx={58} ty={377} target="outcome"/>
 <Callout n={5} x={602} y={335} tx={576} ty={377} target="anergy"/>
 </>;}

function IgA({x,y,bio='iga'}:{x:number;y:number;bio?:string}){return <g><path data-bio={bio} d={`M${x-20} ${y-13}l12 13 12-13m-12 13v18h16v-18l12-13m-12 13-12-13`} fill="none" stroke={purple} strokeWidth={4}/><path d={`M${x-9} ${y+11}h17`} stroke={gold} strokeWidth={4}/></g>;}
export function MucosaScene(id:string){return <>
 <rect x={15} y={36} width={610} height={96} fill="#f8efd9"/>
 <He x={321} y={68} size={27} bold>חלל המעי</He>
 {[[521,76],[559,51],[385,105],[104,76],[68,104]].map(([x,y])=><ellipse data-bio="microbe" key={x} cx={x} cy={y} rx={13} ry={6} fill={green}/>)}
 {Array.from({length:12},(_,i)=>i).map(i=><rect key={i} x={19+i*50} y={132} width={46} height={102} rx={7} fill={i===10?'#d8e8f1':'#f3dfe6'} stroke={i===10?blue:'#b96984'} strokeWidth={2} data-bio={i===10?'mcell':undefined}/>)}
 <He x={542} y={194} size={25} bold>⁦M⁩</He>
 <Flow id={id} d="M548 108V162" color={green}/><Flow id={id} d="M548 209V263" color={green}/>
 <path data-bio="peyer" d="M420 349Q438 247 528 262Q598 266 610 349Z" fill="#dceaf1" stroke={blue} strokeWidth={3}/>
 <He x={522} y={309} size={25} bold>כתם פייר</He><He x={522} y={338} size={25}>החלפת מחלקה</He>
 <BCell x={321} y={340} bio="plasma" c={purple}/><He x={320} y={393} size={25}>תא פלזמה</He>
 <IgA x={222} y={305}/><Flow id={id} d="M293 334L254 315" color={purple}/>
 <path data-bio="pigr" d="M214 229v20h16v-20" fill="none" stroke={green} strokeWidth={5}/>
 <Flow id={id} d="M222 279V257" color={purple}/><Flow id={id} d="M222 222V147" color={green}/>
 <IgA x={222} y={100} bio="secreted"/>
 <He x={101} y={292} size={25}>רקמת הרירית</He><He x={104} y={324} size={25}>מתחת לאפיתל</He>
 <Callout n={1} x={605} y={108} tx={549} ty={153} target="mcell"/>
 <Callout n={2} x={390} y={270} tx={451} ty={284} target="peyer"/>
 <Callout n={3} x={367} y={300} tx={332} ty={330} target="plasma"/>
 <Callout n={4} x={168} y={353} tx={214} ty={308} target="iga"/>
 <Callout n={5} x={288} y={268} tx={230} ty={244} target="pigr"/>
 <Callout n={6} x={152} y={59} tx={206} ty={92} target="secreted"/>
 </>;}
