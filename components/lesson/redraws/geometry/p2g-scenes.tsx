import {He,Callout,Flow} from './ub-zoo';
export {Plate} from './p2c-scenes';
const blue='#27749a',purple='#8356a2',red='#ad3e50',green='#357a60',gold='#a37132',gray='#627587';
function Box({x,y,w=126,h=55,label,bio,c=blue}:{x:number;y:number;w?:number;h?:number;label:string;bio:string;c?:string}){return <g><rect data-bio={bio} x={x-w/2} y={y-h/2} width={w} height={h} rx={12} fill={c===gold?'#f3e4cc':c===green?'#e0eee5':c===purple?'#eae0f1':c===red?'#f5e1e5':'#e1edf4'} stroke={c} strokeWidth={2.5}/><He x={x} y={y+8} size={25} bold>{label}</He></g>;}
function FastingTissues(){return <>
 <ellipse data-bio="adipose" cx={514} cy={90} rx={63} ry={30} fill="#e4eff6" stroke={blue} strokeWidth={2.5}/>
 <ellipse cx={514} cy={90} rx={46} ry={24} fill="#f4dfaa" stroke={gold} strokeWidth={1.5}/><ellipse cx={565} cy={89} rx={5} ry={10} fill={blue}/>
 <He x={545} y={157} size={25} bold>רקמת שומן</He>
 <path data-bio="muscle" d="M73 63H171Q189 65 187 90Q189 117 171 117H73Q60 112 61 90Q60 68 73 63Z" fill="#f1dce0" stroke={red} strokeWidth={2.5}/>
 {[73,84,95,106,117,128,139,150,161,172].map(x=><path key={x} d={`M${x} 68v44`} stroke="#c4808d" strokeWidth={1.5}/>)}
 <path d="M67 79H181M65 100H182" stroke={red} strokeWidth={1.5}/><He x={124} y={149} size={25} bold>שריר</He>
 <path data-bio="liver" d="M249 236Q243 210 273 205Q315 196 344 207Q379 208 393 230L393 245Q373 269 337 266L313 253Q278 275 252 251Z" fill="#e8c5a4" stroke={gold} strokeWidth={2.5}/>
 <path d="M338 209Q332 232 313 253M252 240Q284 234 313 240" fill="none" stroke={gold} strokeWidth={2}/><He x={320} y={297} size={25} bold>כבד</He>
 <path data-bio="brain" d="M452 395Q444 379 457 371Q454 358 474 359Q482 348 499 356Q513 345 528 356Q548 349 558 365Q579 366 577 386Q587 403 568 411Q553 425 532 416Q516 428 501 418Q482 426 469 413Q452 414 452 395Z" fill="#e9dff0" stroke={purple} strokeWidth={2.5}/>
 <path d="M513 357Q502 372 513 386T513 416M474 367Q491 368 483 381T473 401M542 363Q529 376 544 385T552 409M457 388Q471 381 479 390M522 396Q533 388 541 398M493 405Q500 396 489 391" fill="none" stroke={purple} strokeWidth={2}/>
 <He x={514} y={451} size={25} bold>מוח</He>
 <ellipse data-bio="rbc" cx={123} cy={390} rx={90} ry={31} fill="#e6a0ac" stroke={red} strokeWidth={2.5}/><ellipse cx={123} cy={388} rx={48} ry={16} fill="#f4cdd4" stroke="#c56a7b" strokeWidth={2}/>
 <He x={123} y={451} size={25} bold>כדורית אדומה</He>
 </>;}
export function FedFastedScene(id:string){return <>
 <FastingTissues/>
 <Flow id={id} d="M450 80H189" color={blue}/>
 <Flow id={id} d="M485 119L362 209" color={blue}/>
 <Flow id={id} d="M155 119L279 209" color={red}/>
 <Flow id={id} d="M294 209L175 119" color={purple}/>
 <Flow id={id} d="M364 265L490 361" color={green}/><Flow id={id} d="M343 265L467 361" color={purple}/>
 <Flow id={id} d="M275 265L151 361" color={green}/><Flow id={id} d="M177 361L296 265" color={red}/>
 <He x={320} y={48} size={25}>חומצות שומן</He>
 <He x={510} y={203} size={25}>חומצות שומן</He><He x={510} y={231} size={25}>וגליצרול</He>
 <He x={110} y={203} size={25}>אלנין ולקטט</He><He x={109} y={260} size={25}>גופי קטון</He>
 <He x={504} y={300} size={25}>גלוקוז</He><He x={370} y={375} size={25}>גופי קטון</He>
 <He x={124} y={302} size={25}>גלוקוז</He><He x={242} y={357} size={25}>לקטט</He>
 <Callout n={1} x={603} y={48} tx={558} ty={70} target="adipose"/>
 <Callout n={2} x={34} y={44} tx={75} ty={72} target="muscle"/>
 <Callout n={3} x={420} y={237} tx={389} ty={237} target="liver"/>
 <Callout n={4} x={600} y={346} tx={559} ty={372} target="brain"/>
 <Callout n={5} x={25} y={339} tx={57} ty={371} target="rbc"/>
 </>;}

export function LipoproteinsScene(id:string){return <>
 <Box x={555} y={76} w={100} label="מעי" bio="gut"/>
 <Box x={323} y={76} w={202} label="כילומיקרונים" bio="chylomicrons" c={gold}/>
 <Box x={73} y={76} w={108} label="רקמות" bio="tissue-diet"/>
 <Flow id={id} d="M503 76H427"/><Flow id={id} d="M220 76H130" color={gold}/>
 <He x={175} y={38} size={25}>⁦LPL⁩</He><He x={318} y={135} size={25}>שומנים מהמזון → חומצות שומן</He>
 <Box x={555} y={233} w={100} label="כבד" bio="liver" c={gold}/>
 <Box x={423} y={233} w={86} label="⁦VLDL⁩" bio="vldl"/>
 <Box x={300} y={233} w={73} label="⁦IDL⁩" bio="idl"/>
 <Box x={180} y={233} w={80} label="⁦LDL⁩" bio="ldl" c={red}/>
 <Box x={56} y={233} w={100} label="רקמות" bio="tissue"/>
 <Flow id={id} d="M503 233H469"/><Flow id={id} d="M378 233H340"/><Flow id={id} d="M261 233H223"/><Flow id={id} d="M138 233H109" color={red}/>
 <Flow id={id} d="M180 262V301H555V262" color={red}/>
 <He x={379} y={337} size={25}>קליטה בקולטן ⁦LDL⁩</He>
 <Box x={300} y={410} w={90} label="⁦HDL⁩" bio="hdl" c={green}/>
 <Flow id={id} d="M56 263V410H252" color={green}/><Flow id={id} d="M347 410H598V263" color={green}/>
 <Callout n={1} x={462} y={29} tx={410} ty={58} target="chylomicrons"/>
 <Callout n={2} x={448} y={283} tx={428} ty={259} target="vldl"/>
 <Callout n={3} x={240} y={183} tx={280} ty={214} target="idl"/>
 <Callout n={4} x={145} y={151} tx={170} ty={207} target="ldl"/>
 <Callout n={5} x={365} y={457} tx={329} ty={431} target="hdl"/>
 </>;}

export function EndospereStructureScene(){return <>
 {[[240,155,'#edf0f2',gray,'exo'],[216,135,'#eee0bf',gold,'coat'],[190,113,'#d6eaf5',blue,'outer'],[161,91,'#f5dfc6','#b76d31','cortex'],[128,68,'#b8d4e5',blue,'inner'],[103,49,'#deeddf',green,'core']].map(([rx,ry,fill,stroke,bio])=><ellipse key={bio} data-bio={bio} cx={320} cy={205} rx={+rx} ry={+ry} fill={''+fill} stroke={''+stroke} strokeWidth={3} strokeDasharray={bio==='exo'?'8 6':undefined}/>)}
 <path data-bio="dna" d="M274 205q23-27 46 0t46 0m-92 11q23-27 46 0t46 0" stroke={green} fill="none" strokeWidth={3}/>
 <Callout n={1} x={320} y={408} tx={320} ty={239} target="core"/>
 <Callout n={2} x={544} y={351} tx={420} ty={245} target="inner"/>
 <Callout n={3} x={611} y={210} tx={465} ty={210} target="cortex"/>
 <Callout n={4} x={535} y={51} tx={472} ty={141} target="outer"/>
 <Callout n={5} x={177} y={37} tx={229} ty={85} target="coat"/>
 <Callout n={6} x={28} y={210} tx={81} ty={210} target="exo"/>
 </>;}

function SporeCell({x,y,stage,bio}:{x:number;y:number;stage:number;bio:string}){return <g>
 {stage!==5&&<rect data-bio={bio} x={x-53} y={y-35} width={106} height={70} rx={34} fill="#e9edf0" stroke={gray} strokeWidth={3}/>}
 {stage===1?<><path data-bio={bio} d={`M${x+15} ${y-32}v64`} stroke={blue} strokeWidth={3}/><path data-bio={bio} d={`M${x+17} ${y-29}a29 29 0 0 1 0 58Z`} fill="#d4e8d8" stroke={green} strokeWidth={2}/></>:stage<6?<>
 {stage>=3&&<ellipse data-bio={bio} cx={x+12} cy={y} rx={32} ry={28} fill="#ecdbb5" stroke={gold} strokeWidth={3}/>}
 <ellipse data-bio={bio} cx={x+12} cy={y} rx={stage>=3?27:25} ry={stage>=3?24:27} fill={stage>=3?'#f4ddc4':'#d6e9f2'} stroke={blue} strokeWidth={2}/>
 <ellipse data-bio={bio} cx={x+12} cy={y} rx={stage>=4?15:19} ry={stage>=4?13:20} fill="#c7e1cf" stroke={green} strokeWidth={2}/>
 </>:null}</g>;}
export function SporulationCycleScene(id:string){return <>
 <SporeCell x={520} y={90} stage={1} bio="septum"/><SporeCell x={316} y={62} stage={2} bio="engulf"/><SporeCell x={103} y={100} stage={3} bio="layers"/>
 <SporeCell x={103} y={300} stage={4} bio="mature"/><SporeCell x={316} y={342} stage={5} bio="release"/><SporeCell x={530} y={298} stage={6} bio="vegetative"/>
 <Flow id={id} d="M465 80L373 67"/><Flow id={id} d="M260 69L161 90"/><Flow id={id} d="M103 139V258"/>
 <Flow id={id} d="M160 310L288 335"/><Flow id={id} d="M363 335L472 310" color={green}/><Flow id={id} d="M530 260V130" color={green}/>
 <He x={319} y={184} size={27} bold>בניית אנדוספורה</He><He x={319} y={218} size={25}>כ־⁦8⁩ שעות במודל זה</He>
 <Callout n={1} x={600} y={32} tx={550} ty={68} target="septum"/>
 <Callout n={2} x={316} y={9} tx={316} ty={28} target="engulf"/>
 <Callout n={3} x={24} y={45} tx={70} ty={77} target="layers"/>
 <Callout n={4} x={24} y={359} tx={70} ty={322} target="mature"/>
 <Callout n={5} x={315} y={417} tx={324} ty={368} target="release"/>
 <Callout n={6} x={612} y={346} tx={571} ty={317} target="vegetative"/>
 </>;}

export function TransportSystemsScene(id:string){return <>
 <He x={520} y={29} size={25} bold>הובלה פשוטה</He><He x={320} y={29} size={25} bold>העברה קבוצתית</He><He x={102} y={29} size={25} bold>מובל ⁦ABC⁩</He>
 <rect x={12} y={151} width={616} height={32} rx={7} fill="#e9dfc9" stroke={gold} strokeWidth={2}/>
 {Array.from({length:60},(_,i)=><path key={i} d={`M${21+i*10} 155v24`} stroke="#c8b896" strokeWidth={2}/>)}
 <He x={580} y={133} size={25}>בחוץ</He><He x={540} y={236} size={25}>ציטופלזמה</He>
 {[520,320,102].map((x,i)=><rect key={x} data-bio={['symport','pts','abc'][i]} x={x-30} y={139} width={60} height={60} rx={13} fill={i===1?'#dfede2':'#dae9f2'} stroke={i===1?green:blue} strokeWidth={3}/>)}
 <circle cx={503} cy={88} r={8} fill={gold}/><circle cx={535} cy={88} r={8} fill={blue}/><He x={504} y={67} size={25}>⁦H⁺⁩</He><He x={570} y={90} size={25}>חומר</He>
 <Flow id={id} d="M503 100V216" color={gold}/><Flow id={id} d="M535 100V216" color={blue}/>
 <He x={320} y={90} size={25}>גלוקוז</He><Flow id={id} d="M320 104V227" color={green}/><He x={320} y={262} size={25}>גלוקוז-6-פוספט</He>
 <He x={244} y={319} size={25}>⁦PEP⁩</He><Flow id={id} d="M276 311H310" color={red}/><He x={356} y={319} size={25}>פירובט</He><Flow id={id} d="M404 291V240L345 190" color={red}/>
 <ellipse data-bio="binding" cx={102} cy={88} rx={31} ry={22} fill="#efe1bd" stroke={gold} strokeWidth={3}/><circle cx={102} cy={88} r={7} fill={blue}/>
 <Flow id={id} d="M102 112V235" color={blue}/>
 <rect data-bio="atpase" x={68} y={200} width={24} height={26} rx={6} fill="#eadced" stroke={purple} strokeWidth={2}/>
 <rect data-bio="atpase" x={112} y={200} width={24} height={26} rx={6} fill="#eadced" stroke={purple} strokeWidth={2}/>
 <He x={105} y={282} size={25}>⁦ATP → ADP⁩</He><Flow id={id} d="M80 251V226" color={purple}/>
 <Callout n={1} x={609} y={209} tx={548} ty={180} target="symport"/>
 <Callout n={2} x={398} y={209} tx={347} ty={179} target="pts"/>
 <Callout n={3} x={31} y={54} tx={78} ty={74} target="binding"/>
 <Callout n={4} x={25} y={230} tx={71} ty={213} target="atpase"/>
 </>;}

export function AntibioticTargetsScene(){return <>
 <rect data-bio="wall" x={101} y={48} width={440} height={306} rx={110} fill="#eddbbc" stroke={gold} strokeWidth={5}/>
 <rect data-bio="membrane" x={115} y={62} width={412} height={278} rx={98} fill="#fbfaf6" stroke={gray} strokeWidth={4}/>
 <path data-bio="dna" d="M254 180Q282 145 309 180T363 180T415 180m-161 13q28-35 55 0t54 0t52 0" fill="none" stroke={purple} strokeWidth={3}/>
 <ellipse data-bio="gyrase" cx={316} cy={174} rx={19} ry={23} fill="#e5d9ef" stroke={purple} strokeWidth={3}/>
 <He x={320} y={245} size={25}>⁦DNA⁩</He>
 <rect data-bio="rnap" x={397} y={99} width={94} height={46} rx={18} fill="#daeaf3" stroke={blue} strokeWidth={3}/><He x={444} y={130} size={25}>⁦RNAP⁩</He>
 <ellipse data-bio="50s" cx={215} cy={257} rx={42} ry={25} fill="#d2e4d5" stroke={green} strokeWidth={3}/><He x={215} y={265} size={25}>⁦50S⁩</He>
 <ellipse data-bio="30s" cx={215} cy={300} rx={34} ry={17} fill="#e7f1e9" stroke={green} strokeWidth={3}/><He x={215} y={308} size={25}>⁦30S⁩</He>
 <rect data-bio="folate" x={357} y={257} width={113} height={62} rx={12} fill="#f5e1e5" stroke={red} strokeWidth={2.5}/><He x={414} y={282} size={25}>בניית</He><He x={414} y={308} size={25}>פולאט</He>
 <Callout n={1} x={145} y={13} tx={178} ty={53} target="wall"/>
 <Callout n={2} x={44} y={172} tx={116} ty={176} target="membrane"/>
 <Callout n={3} x={128} y={391} tx={195} ty={313} target="30s"/>
 <Callout n={4} x={137} y={230} tx={176} ty={248} target="50s"/>
 <Callout n={5} x={315} y={103} tx={316} ty={152} target="gyrase"/>
 <Callout n={6} x={575} y={90} tx={484} ty={111} target="rnap"/>
 <Callout n={7} x={570} y={302} tx={469} ty={289} target="folate"/>
 </>;}
