import {He,La} from './helpers';
import {IC,Defs,Flow,Membrane,Mhc,Peptide,Responsive} from './geometry/immune';
const label='שני מסלולי ההצגה: במסלול MHC I חלבון בציטוזול מפורק בפרוטאזום, הפפטידים עוברים ב-TAP ל-ER, נטענים על MHC I ומוצגים לתאי T CD8. במסלול MHC II חלבון נבלע מבחוץ ומפורק באנדוזום; MHC II מגיע מה-ER עם השרשרת הנלווית (CLIP), ו-HLA-DM מחליף את CLIP בפפטיד; המולקולה מוצגת לתאי T CD4.';
function Fold({x,y}:{x:number;y:number}){return <path d={`M${x-17} ${y}c-13-22 31-24 20-5s-31 15-11 24s30-17 14-19s-27 20-7 22`} fill="none" stroke={IC.red} strokeWidth={3} strokeLinecap="round"/>;}
function Lane({ii=false,id}:{ii?:boolean;id:string}){return <>
 <path d={ii?'M35 50 Q100 90 165 50':'M65 50 Q130 90 195 50'} fill="#eee6f2" stroke={IC.purple} strokeWidth={2}/><La x={ii?100:130} y={38} size={18} bold color={IC.purple}>{ii?'T CD4':'T CD8'}</La>
 <path d={ii?'M94 70v38m12-38v38':'M124 70v38m12-38v38'} fill="none" stroke={IC.purple} strokeWidth={3}/><Mhc x={ii?100:130} y={130} ii={ii} id={id}/><La x={ii?100:130} y={176} size={18} bold color={ii?IC.green:IC.blue}>{ii?'MHC II':'MHC I'}</La>
 {ii?<>
  <Fold x={251} y={83}/><He x={247} y={40} size={15} color={IC.red}>חלבון מבחוץ</He>
  <Flow d="M251 106 V170" id={id}/>
  <path d="M209 204 C211 178 283 172 290 202 C299 236 278 250 245 248 C215 249 198 230 209 204Z" fill={`url(#${id}-purple)`} stroke={IC.purple} strokeWidth={2}/><Peptide x={230} y={211}/><Peptide x={264} y={226}/><He x={255} y={278} size={15}>אנדוזום</He><He x={255} y={301} size={15}>פירוק</He>
  <Flow d="M212 234 L185 259" id={id}/>
  <path d="M58 286 C44 237 182 235 204 277 C220 321 202 367 133 367 C70 370 49 338 58 286Z" fill="#e5eee2" stroke={IC.green} strokeWidth={2}/><Mhc x={85} y={351} ii id={id}/><Peptide x={161} y={258}/><Peptide x={169} y={342} color={IC.gold}/><La x={153} y={286} size={16} color={IC.green}>MIIC</La><La x={145} y={309} size={15}>HLA-DM</La>
  <Flow d="M96 242 V190" color={IC.green} id={id}/>
  <Flow d="M106 418 V383" color={IC.green} id={id}/><g transform="translate(108 436) rotate(180)"><Mhc x={0} y={0} ii clip id={id}/><path d="M0-24 Q-14-35-3-43 T5-53" fill="none" stroke={IC.gold} strokeWidth={3}/></g>
  <La x={215} y={445} size={15} color={IC.goldDark}>Ii → CLIP</La><He x={215} y={470} size={15}>שרשרת נלווית</He>
  <La x={200} y={399} size={14} color={IC.green}>CLIP → peptide</La>
 </>:<>
  <path d="M91 252 C110 233 171 235 188 252 M89 263 C111 246 174 248 192 263 M96 275 C118 259 170 261 184 275" stroke={IC.gold} strokeWidth={7} fill="none" strokeLinecap="round"/>
  <La x={140} y={310} size={16}>Golgi</La><Flow d="M136 231 V190" id={id} color={IC.blue}/>
  <Flow d="M217 413 C238 354 237 291 203 270" id={id} color={IC.blue}/><g transform="translate(219 436) rotate(180)"><Mhc x={0} y={0} id={id}/></g>
  <La x={180} y={340} size={15} color={IC.blue}>MHC I</La><He x={165} y={364} size={14}>העמסת פפטיד</He>
  <Fold x={57} y={346}/><He x={61} y={318} size={15} color={IC.red}>חלבון בציטוזול</He><Flow d="M59 375 V394" id={id}/>
  <g transform="translate(63 425) rotate(-10)"><path d="M-23-19 Q0-30 24-19 V18 Q0 30-23 18Z" fill={`url(#${id}-gold)`} stroke={IC.gold} strokeWidth={1.5}/>{[-17,-6,5,16].map(x=><path key={x} d={`M${x} -21 Q${x-8} 0 ${x} 22`} stroke={IC.gold} fill="none" strokeWidth={2}/>)}</g>
  <He x={60} y={477} size={15}>פרוטאזום</He><Flow d="M94 425 H128" id={id}/><Peptide x={110} y={408}/>
  <g><path d="M131 418 Q122 434 134 453 L140 453 L140 420Z M152 418 Q161 434 149 453 L143 453 L143 420Z" fill={IC.green} stroke={IC.green} strokeWidth={1}/><Flow d="M142 407 V463" id={id}/></g><La x={182} y={500} size={15} color={IC.green}>TAP</La>
 </>}
 </>;}
function Scene({m=false}:{m?:boolean}){const id=m?'ap-m':'ap-d',w=m?360:640;return <><Defs id={id}/><He x={w/2} y={29} size={m?21:24} bold>עיבוד והצגת אנטיגן</He><He x={w/2} y={55} size={m?15:16}>מקור הפפטיד קובע את מסלול ההעמסה</He>
 {m?<>
  <rect x={12} y={205} width={336} height={428} rx={25} fill="#faf6ed"/><Membrane x={12} y={205} w={336}/><rect x={145} y={501} width={195} height={98} rx={24} fill="#edf3f7" stroke={IC.blue} strokeWidth={2}/><rect x={145} y={507} width={195} height={86} rx={20} fill="none" stroke="#b5cbd9" strokeWidth={1}/><La x={300} y={580} size={16}>ER</La><g transform="translate(15 81)"><Lane id={id}/></g>
  <He x={180} y={655} size={15} color={IC.blue}>מסלול I: חלבון פנימי לתא T CD8</He>
  <rect x={12} y={818} width={336} height={428} rx={25} fill="#faf6ed"/><Membrane x={12} y={818} w={336}/><rect x={26} y={1114} width={309} height={98} rx={24} fill="#edf3f7" stroke={IC.blue} strokeWidth={2}/><rect x={26} y={1120} width={309} height={86} rx={20} fill="none" stroke="#b5cbd9" strokeWidth={1}/><La x={295} y={1194} size={16}>ER</La><g transform="translate(15 694)"><Lane ii id={id}/></g>
  <He x={180} y={1275} size={15} color={IC.green}>מסלול II: חלבון נבלע לתא T CD4</He><He x={180} y={1304} size={14} color={IC.muted}>אדום: חלבון ופפטיד · זהב: Ii או CLIP</He><He x={180} y={1331} size={14} color={IC.muted}>מסלולים עיקריים; סכמטי, לא בקנה מידה</He>
 </>:<>
  <path d="M15 203 H625 V579 Q625 610 595 610 H45 Q15 610 15 579Z" fill="#faf6ed"/><Membrane y={203}/><rect x={151} y={499} width={440} height={100} rx={29} fill="#edf3f7" stroke={IC.blue} strokeWidth={2}/><rect x={156} y={505} width={430} height={88} rx={25} fill="none" stroke="#b5cbd9" strokeWidth={1}/><La x={321} y={581} size={17}>ER</La><g transform="translate(15 79)"><Lane id={id}/></g><g transform="translate(325 79)"><Lane ii id={id}/></g>
  <He x={175} y={638} size={16} color={IC.blue}>I: חלבון פנימי לתא T CD8</He><He x={470} y={638} size={16} color={IC.green}>II: חלבון נבלע לתא T CD4</He>
  <He x={320} y={667} size={14} color={IC.muted}>אדום: חלבון ופפטיד · זהב: Ii או CLIP · סכמטי, לא בקנה מידה</He>
 </>}
 </>;}
export function AntigenProcessing(){return <Responsive id="ap" label={label} h={680} mh={1350} wide={<Scene/>} mobile={<Scene m/>}/>;}
