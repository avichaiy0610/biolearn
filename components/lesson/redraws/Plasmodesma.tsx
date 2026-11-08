import {Plate,IC,He} from './geometry/six';
import {Callout} from './geometry/next-six';
const label="פלסמודסמה בחתך אורכי: ממברנת התא רציפה בין שני התאים דרך התעלה בדופן. במרכז עובר הדסמוטובול — צינור ER דחוס שמחבר את ה-ER של שני התאים. בין הדסמוטובול לממברנה נשאר שרוול ציטופלזמי צר שדרכו עוברות מולקולות קטנות. בצוואר התעלה יכול להצטבר קאלוז שסוגר אותה. משמאל למטה: חתך רוחב";

function Draw(){return <>
<rect x={25} y={30} width={590} height={280} rx={14} fill="#eff7f3"/>
<path d="M245 30H382V116H245ZM245 194H382V310H245Z" fill="#e2d4b6" stroke="#a18b61" strokeWidth={2}/>
{[43,66,89,220,245,270,295].map((y,i)=><path key={i} d={`M251 ${y}q31-12 60 0t63 0`} fill="none" stroke="#c4b18c" strokeWidth={2}/>)}
<path d="M237 30V102Q237 124 258 124H369Q390 124 390 102V30M237 310V208Q237 186 258 186H369Q390 186 390 208V310" stroke={IC.blue} strokeWidth={7} fill="none"/>
<path d="M237 30V102Q237 124 258 124H369Q390 124 390 102V30M237 310V208Q237 186 258 186H369Q390 186 390 208V310" stroke="#b8d3e5" strokeWidth={2} fill="none"/>
<path d="M50 95Q140 90 190 148H435Q480 90 570 95M50 215Q140 220 190 162H435Q480 220 570 215" stroke={IC.green} strokeWidth={7} fill="none"/>
<path d="M50 95Q140 90 190 148H435Q480 90 570 95M50 215Q140 220 190 162H435Q480 220 570 215" stroke="#b9d5c6" strokeWidth={2} fill="none"/>
<rect x={190} y={151} width={245} height={8} fill="#c4dbd0"/>
{[257,369].map(x=><g key={x}><ellipse cx={x} cy={113} rx={10} ry={7} fill={IC.gold} stroke={IC.goldDark}/><ellipse cx={x} cy={197} rx={10} ry={7} fill={IC.gold} stroke={IC.goldDark}/></g>)}
{[277,307,337].map(x=><circle key={x} cx={x} cy={137} r={4} fill={IC.red}/>)}
<path d="M275 175H348" fill="none" stroke={IC.red} strokeWidth={2}/>
<path d="M340 170L349 175L340 180" fill="none" stroke={IC.red} strokeWidth={2}/>
<g transform="translate(85 271)"><circle r={44} fill="#e2d4b6" stroke="#a18b61"/><circle r={31} fill="#eff7f3" stroke={IC.blue} strokeWidth={6}/><circle r={9} fill="#c4dbd0" stroke={IC.green} strokeWidth={6}/></g>
<He x={108} y={26} size={26}>תא A</He><He x={515} y={26} size={26}>תא B</He>
<Callout n={1} x={298} y={48} tx={305} ty={90} target="cell-wall"/>
<Callout n={2} x={165} y={61} tx={237} ty={92} target="continuous-plasma-membrane"/>
<Callout n={3} x={450} y={63} tx={413} ty={151} target="desmotubule-ER"/>
<Callout n={4} x={434} y={208} tx={331} ty={137} target="cytoplasmic-sleeve"/>
<Callout n={5} x={322} y={270} tx={369} ty={197} target="callose-neck"/>
<Callout n={6} x={157} y={278} tx={112} ty={289} target="cross-section-plasma-membrane"/>
</>;}
export function Plasmodesma(){return <Plate id="plasmodesma-next" label={label} title="פלסמודסמה — רציפות בין שני תאים" subtitle="חתך אורכי; חתך רוחב בפינה השמאלית התחתונה" draw={()=><Draw/>} keys={[
['דופן התא — בגוון חול','התעלה עוברת בתוך הדופן'],['ממברנת התא — כחול','דו־שכבה רציפה בין שני התאים'],['דסמוטובול — ER דחוס','ירוק: רציפות ל־ER של שני התאים'],['שרוול ציטופלזמי מסביב ל־ER','אדום: מולקולות עד כ־⁦1 kDa⁩'],['קאלוז בצוואר — זהוב','הצטברות יכולה לסגור את המעבר'],['חתך רוחב של אותה תעלה','שרוול בין הממברנה לדסמוטובול']
]} foot="סכמטי, לא בקנה מידה; המעטפות מוצגות בהגדלה"/>;}
