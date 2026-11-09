import {Plate,Callout,Flow,Protein,Ub,IC,He,La} from './geometry/ub-zoo';
const label="מחזור הפירוק בחמישה שלבים: קישור השרשרת לקולטן — שלב הפיך; היתפסות של אזור לא מקופל בטבעת ה-ATPases, שהיא נקודת ההחלטה; הסרת השרשרת בידי Rpn11 ומחזור היוביקוויטין; פרישה והשחלה בעזרת ATP; ופירוק לפפטידים. מתחת: מצע מסומן שאין לו אזור לא מקופל נקשר ומשתחרר בלי להתפרק.";

function Draw(id:string){return <>
<path data-bio="cap" d="M284 76Q250 42 267 16Q299-1 314 25Q339 9 358 32Q388 31 393 61L370 100L290 101Z" fill="#c5dbea" stroke={IC.blue} strokeWidth={2}/>
<path data-bio="receptor" d="M255 42Q243 20 222 31L226 49Q237 47 241 59Z" fill="#ddcee6" stroke={IC.purple} strokeWidth={2}/>
<Protein x={147} y={50} bio="tagged-substrate"/><path d="M171 44Q188 28 205 42" fill="none" stroke={IC.red} strokeWidth={2}/><Ub x={205} y={42}/><Ub x={224} y={31}/><Ub x={242} y={25}/>
<path data-bio="tail" d="M147 75Q150 99 172 88T212 97Q239 125 275 107L332 96" fill="none" stroke={IC.gold} strokeWidth={4}/>
<ellipse data-bio="atpase" cx={329} cy={110} rx={66} ry={24} fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/>
{[280,300,322,344,365,380].map((x,i)=><ellipse key={x} cx={x} cy={i===0||i===5?109:119} rx={10} ry={13} fill="#9fbfb1" stroke={IC.green}/>)}
<ellipse cx={330} cy={110} rx={12} ry={10} fill="white" stroke={IC.green}/>
<path data-bio="rpn11" d="M346 62Q354 45 369 58L367 80Q352 85 343 74Z" fill={IC.purple} stroke="#624674" strokeWidth={2}/>
<Ub x={302} y={10} bio="recycled-ub"/><Ub x={282} y={24}/><Flow d="M347 53Q328 27 318 20" id={id} color={IC.red}/>
<path data-bio="core" d="M273 145Q329 161 386 145L386 276Q331 295 273 276Z" fill="#f0d6a8" stroke={IC.gold} strokeWidth={2}/>
{[146,178,211,244,276].map(y=><path key={y} d={`M274 ${y}Q330 ${y+17} 385 ${y}`} fill="none" stroke={IC.gold} strokeWidth={2}/>)}
<path d="M314 156L314 275Q330 282 346 275L346 156" fill="#fff8e8"/>
<path data-bio="thread" d="M332 99Q319 137 332 163T328 204T333 243" fill="none" stroke={IC.goldDark} strokeWidth={4}/>
{[190,219].map(y=><g key={y}><path d={`M305 ${y}l10 5-10 6Z M354 ${y}l-10 5 10 6Z`} fill={IC.red}/></g>)}
<path data-bio="peptide" d="M308 307l9 6 8-4m15 2 10 8 9-3m-45 12 9 7 9-3" fill="none" stroke={IC.goldDark} strokeWidth={4}/>
<La x={448} y={157} size={26}>ATP</La><Flow d="M421 157L396 138" id={id}/>
<Protein x={125} y={180} bio="folded-substrate"/><Ub x={116} y={137}/><Ub x={136} y={143}/>
<Flow d="M166 166Q197 159 220 176" id={id}/><Flow d="M229 192Q200 213 170 195" id={id}/>
<He x={140} y={256} size={26}>ללא זנב: משתחרר</He>
<Callout n={1} x={194} y={111} tx={233} ty={41} target="receptor"/>
<Callout n={2} x={232} y={148} tx={280} ty={119} target="atpase"/>
<Callout n={3} x={417} y={92} tx={358} ty={66} target="rpn11"/>
<Callout n={4} x={427} y={244} tx={333} ty={241} target="thread"/>
<Callout n={5} x={397} y={328} tx={350} ty={319} target="peptide"/>
<Callout n={6} x={69} y={101} tx={155} ty={91} target="tail"/>
<Callout n={7} x={47} y={175} tx={104} ty={175} target="folded-substrate"/>
<Callout n={8} x={474} y={292} tx={383} ty={263} target="core"/>
</>;}
export function ProteasomeCycle(){return <Plate id="proteasome-cycle-ub-zoo" label={label} title="מחזור הפירוק — מהקישור לפפטידים" subtitle="שני תנאים: אות יוביקוויטין ואזור התחלה לא מקופל" draw={Draw} keys={[
['קישור השרשרת לקולטן — הפיך','סגול בהיר: קולטן בכיפת הפרוטאזום'],['היתפסות בטבעת ה־ATPases','ירוק: תפיסת הזנב, נקודת ההחלטה'],['Rpn11 מסיר שרשרת ו־Ub ממוחזר','סגול כהה: האנזים; אדום: Ub'],['פרישה והשחלה בעזרת ATP','חום: מצע מושחל דרך נקב המנוע'],['שלב חמישי — פירוק לפפטידים','חום: מקטעים קצרים היוצאים מהליבה'],['אזור התחלה לא מקופל — זנב','זהב: נדרש לתפיסה ולהמשך הפירוק'],['מצע מקופל לגמרי אינו מתפרק','נקשר ומשתחרר; DUBs מסירים Ub'],['ליבה קטליטית של הפרוטאזום','זהב בהיר: הליבה; אדום: אתרי פירוק']
]} foot="סכמטי; למעלה מצע עם זנב, משמאל מסלול שחרור ללא פירוק"/>;}
