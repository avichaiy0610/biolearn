import {He,Flow,Callout} from './ub-zoo';
const blue='#27749a',purple='#8356a2',red='#ad3e50',green='#357a60',gold='#a37132';
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
 <Flow id={id} d="M560 108H625V190H395V230H391" color={blue}/>
 <Flow id={id} d="M155 119V190H279V209" color={red}/>
 <Flow id={id} d="M294 209V165H175V119" color={purple}/>
 <Flow id={id} d="M364 265H535V361" color={green}/><Flow id={id} d="M343 265V325H467V361" color={purple}/>
 <Flow id={id} d="M275 265V315H151V361" color={green}/><Flow id={id} d="M177 361V342H296V265" color={red}/>
 {[
 [320,72,'חומצות שומן',blue,0],
 [495,183,'חומצות שומן וגליצרול',blue,0],
 [217,183,'אלנין ולקטט',red,0],
 [238,158,'גופי קטון',purple,0],
 [467,257,'גלוקוז',green,0],
 [405,318,'גופי קטון',purple,0],
 [211,308,'גלוקוז',green,0],
 [237,335,'לקטט',red,0],
 ].map(([x,y,t,c,r],i)=><He key={i} x={+x} y={+y} size={id.endsWith('-m')?22:17} color={''+c} rotate={+r}>{t}</He>)}
 <Callout n={1} x={603} y={48} tx={558} ty={70} target="adipose"/>
 <Callout n={2} x={34} y={44} tx={75} ty={72} target="muscle"/>
 <Callout n={3} x={420} y={237} tx={389} ty={237} target="liver"/>
 <Callout n={4} x={600} y={346} tx={559} ty={372} target="brain"/>
 <Callout n={5} x={25} y={339} tx={57} ty={371} target="rbc"/>
 </>;}


const gray="#627587";
function SporeCell({x,y,stage,bio}:{x:number;y:number;stage:number;bio:string}){return <g>
 {stage!==5&&<rect data-bio={bio} x={x-53} y={y-35} width={106} height={70} rx={34} fill="#e9edf0" stroke={gray} strokeWidth={3}/>}
 {stage===1?<><path data-bio={bio} d={`M${x+15} ${y-32}v64`} stroke={blue} strokeWidth={3}/><path data-bio={bio} d={`M${x+17} ${y-29}a29 29 0 0 1 0 58Z`} fill="#d4e8d8" stroke={green} strokeWidth={2}/></>:stage<6?<>
 {stage>=3&&<ellipse data-bio={bio} cx={x+12} cy={y} rx={32} ry={28} fill="#ecdbb5" stroke={gold} strokeWidth={3}/>}
 <ellipse data-bio={bio} cx={x+12} cy={y} rx={stage>=3?27:25} ry={stage>=3?24:27} fill={stage>=3?'#f4ddc4':'#d6e9f2'} stroke={blue} strokeWidth={2}/>
 <ellipse data-bio={bio} cx={x+12} cy={y} rx={stage>=4?15:19} ry={stage>=4?13:20} fill="#c7e1cf" stroke={green} strokeWidth={2}/>
 </>:null}</g>;}
import {Responsive,Defs,Membrane} from './immune';
const stages=[['חלוקה א־סימטרית','תא אם גדול ופורספורה קטנה'],['בליעה','ממברנת תא האם עוטפת את הקטנה'],['בניית שכבות הגנה','קורטקס ומעטה סביב הפורספורה'],['הבשלה','הליבה מאבדת מים ורוכשת עמידות'],['שחרור','תא האם מתפרק; הספורה נשארת']];
function Formation({m=false}:{m?:boolean}){const w=m?360:640,id='formation-'+(m?'m':'d'),x=m?65:120;return <><Defs id={id}/><He x={w/2} y={30} size={m?22:25} bold>בניית אנדוספורה</He><He x={w/2} y={57} size={15}>מודל: ⁦B. subtilis⁩ · מלמעלה למטה</He>{stages.map(([title,text],i)=>{const y=118+i*101;return <g key={i} data-stage={i+1}><g transform={`translate(${x} ${y}) scale(${m?.78:1})`}><SporeCell x={0} y={0} stage={i+1} bio={'formation-'+i}/></g><He x={w-15} y={y-8} size={m?17:22} anchor="end" bold>{`${i+1}. ${title}`}</He><He x={w-15} y={y+18} size={m?13:17} anchor="end">{text}</He>{i<4&&<Flow id={id} d={`M${x} ${y+39}v22`} color={blue}/>}</g>})}<He x={w/2} y={592} size={m?14:17}>ספורולציה: כ־⁦8⁩ שעות במודל זה</He><He x={w/2} y={622} size={m?13:16}>אפור: תא אם · ירוק: פורספורה וליבה</He><He x={w/2} y={647} size={m?13:16}>כחול: ממברנה · כתום: קורטקס · זהוב: מעטה</He><He x={w/2} y={683} size={m?13:16}>בתנאים מתאימים הספורה נובטת ומתחלקת שוב</He><He x={w/2} y={709} size={m?13:16}>התזמון תלוי בתנאים; איור סכמטי</He></>}
export function LinearFormation(){return <Responsive id="linear-formation" label="בניית אנדוספורה: חמישה שלבים מלמעלה למטה במודל B. subtilis, כ־8 שעות" h={730} mh={730} wide={<Formation/>} mobile={<Formation m/>}/>}
function P({x,y}:{x:number;y:number}){return <g data-phosphate=""><circle cx={x} cy={y} r={9} fill="#f3e3b9" stroke={gold}/><He x={x} y={y+5} size={13} color={gold} bold>⁦P⁩</He></g>}
function ProteinNode({x,y,name}:{x:number;y:number;name:string}){return <g data-protein={name}><path d={`M${x-25} ${y-10}q-6-18 18-15q18-9 29 9q12 22-8 31q-30 13-39-7Z`} fill="#e0eee5" stroke={green} strokeWidth={2}/><He x={x} y={y+5} size={14}> {`⁦${name}⁩`} </He></g>}
function Channel({x,y,c=blue,name}:{x:number;y:number;c?:string;name?:string}){return <g data-channel={name||'symport'}>{[-1,1].map(s=><path key={s} d={`M${x+s*9} ${y-15}q${s*24} -10 ${s*23} 17v30q0 19 ${-s*23} 12Z`} fill={c===green?'#dcecdf':'#dcebf4'} stroke={c} strokeWidth={2}/>)}{name&&<He x={x+57} y={y-27} size={14}> {`⁦${name}⁩`} </He>}</g>}
function Transport({m=false}:{m?:boolean}){const w=m?360:640,id='transport-revision-'+(m?'m':'d'),dx=(w-340)/2;return <><Defs id={id}/><He x={w/2} y={30} size={m?22:25} bold>שלוש מערכות הובלה</He><He x={w/2} y={57} size={15}>מהחוץ אל הציטופלזמה · מקור האנרגיה בכל פאנל</He><g transform={`translate(${dx} 76)`}>
<g data-panel="symport"><rect x={0} y={0} width={340} height={290} rx={14} fill="#f7fafc" stroke="#c8d6df"/><He x={170} y={29} size={20} bold>סימפורט עם ⁦H⁺⁩</He><Membrane x={12} w={316} y={117}/><He x={53} y={100} size={14}>בחוץ</He><He x={59} y={175} size={14}>ציטופלזמה</He><Channel x={180} y={112}/><He x={159} y={72} size={16} color={gold}>⁦H⁺⁩</He><circle cx={199} cy={68} r={7} fill={blue}/><He x={255} y={73} size={15}>חומר מובל</He><Flow id={id} d="M163 81V192" color={gold}/><Flow id={id} d="M199 81V192" color={blue}/><He x={170} y={228} size={16} bold>מקור האנרגיה: מפל ⁦H⁺⁩</He><He x={170} y={259} size={15}>הפרוטון נכנס יחד עם החומר המובל</He></g>
<g data-panel="pts" transform="translate(0 310)"><rect width={340} height={435} rx={14} fill="#f8fbf8" stroke="#c8d6cf"/><He x={170} y={29} size={20} bold>מערכת ⁦PTS⁩ · העברה קבוצתית</He><Membrane x={12} w={316} y={118}/><He x={48} y={99} size={14}>בחוץ</He><He x={60} y={174} size={14}>ציטופלזמה</He><Channel x={246} y={112} c={green} name="EIIC"/><He x={245} y={72} size={16}>גלוקוז</He><Flow id={id} d="M246 81V197" color={green}/><P x={246} y={173}/><He x={246} y={224} size={16} color={green}>גלוקוז-6-פוספט</He>
<He x={42} y={265} size={16} color={gold}>⁦PEP⁩</He><Flow id={id} d="M42 276v39" color={red}/><He x={43} y={338} size={15}>פירובט</He>
{[['EI',108],['HPr',179],['EIIA',250]].map(([n,x])=><ProteinNode key={n} x={+x} y={270} name={''+n}/>)}<ProteinNode x={250} y={340} name="EIIB"/>
<Flow id={id} d="M64 264H80" color={gold}/><Flow id={id} d="M136 270H151" color={gold}/><Flow id={id} d="M207 270H222" color={gold}/><Flow id={id} d="M277 286Q300 304 276 328" color={gold}/><Flow id={id} d="M275 350H323V153H276" color={gold}/>
{[[75,247],[145,247],[216,247],[293,306],[310,192]].map(([x,y])=><P key={x} x={x} y={y}/>)}
<He x={170} y={385} size={16} bold>מקור האנרגיה: ⁦PEP⁩ (העברת קבוצת זרחן)</He><He x={170} y={414} size={14}>הזרחן עובר בין החלבונים אל הגלוקוז הנכנס</He></g>
<g data-panel="abc" transform="translate(0 765)"><rect width={340} height={395} rx={14} fill="#faf8fc" stroke="#d6cadf"/><He x={170} y={29} size={20} bold>מובל ⁦ABC⁩</He><Membrane x={12} w={316} y={144}/><He x={62} y={122} size={14}>פריפלזמה</He><He x={59} y={211} size={14}>ציטופלזמה</He><path data-binding-protein="" d="M147 77q-23-31 3-34l20 14l20-14q26 3 3 34Z" fill="#f1dfb9" stroke={gold} strokeWidth={2}/><circle cx={170} cy={63} r={6} fill={blue}/><He x={170} y={101} size={14}>חלבון קושר מביא חומר מובל</He><Channel x={170} y={140}/><Flow id={id} d="M170 108V210" color={blue}/>
{[134,206].map(x=><g key={x} data-nbd=""><rect x={x-25} y={192} width={50} height={34} rx={11} fill="#e8daef" stroke={purple} strokeWidth={2}/><He x={x} y={214} size={14}>⁦NBD⁩</He><Flow id={id} d={`M${x} 256V229`} color={purple}/><He x={x} y={277} size={15} color={purple}>⁦ATP⁩</He></g>)}
<He x={170} y={306} size={16} color={purple}>⁦ATP → ADP + Pi⁩</He><He x={170} y={337} size={16} bold>מקור האנרגיה: ⁦ATP⁩</He><He x={170} y={366} size={14}>קשירה ופירוק בשני ⁦NBD⁩ פותחים את המובל</He></g>
</g><He x={w/2} y={1274} size={m?13:16}>כחול: חומר מובל · זהוב: פרוטון או קבוצת זרחן ⁦P⁩</He><He x={w/2} y={1301} size={m?13:16}>ירוק: מערכת ⁦PTS⁩ · סגול: צימוד לפירוק ⁦ATP⁩</He><He x={w/2} y={1328} size={m?13:16}>מסלולים סכמטיים; החצים מראים כניסה או העברת זרחן</He></>}
export function ExplicitTransport(){return <Responsive id="explicit-transport" label="סימפורט מונע מפל H⁺; PTS מעביר זרחן מ־PEP דרך EI, HPr, EIIA, EIIB אל EIIC וגלוקוז; ABC מונע ATP עם חלבון קושר ושני NBD" h={1350} mh={1350} wide={<Transport/>} mobile={<Transport m/>}/>}
