import {Plate,Callout,Flow,IC} from './geometry/ub-zoo';
const label="זרימת האוויר בציפור: בשאיפה הראשונה האוויר עובר בברונכוס לשקי האוויר האחוריים; בנשיפה — מהם לריאה; בשאיפה השנייה — מהריאה לשקי האוויר הקדמיים; ובנשיפה השנייה — החוצה. בריאה האוויר זורם תמיד באותו כיוון.";

function Draw(id:string){return <>
<path data-bio="bronchus" d="M85 30V249Q85 280 125 280H522" fill="none" stroke="#8b99a3" strokeWidth={21} strokeLinecap="round"/>
<path data-bio="bronchus" d="M85 30V249Q85 280 125 280H522" fill="none" stroke="#e4e9ed" strokeWidth={15} strokeLinecap="round"/>
<path d="M179 269V200M517 268V184M181 139V96Q181 74 134 74H96" fill="none" stroke="#8b99a3" strokeWidth={16}/><path d="M179 269V200M517 268V184M181 139V96Q181 74 134 74H96" fill="none" stroke="#e4e9ed" strokeWidth={11}/>
<path data-bio="anterior-sac" d="M155 113Q123 99 127 143Q109 159 127 193Q139 217 176 218Q217 218 226 184Q237 158 221 139Q212 110 188 116Z" fill="#dbe8f4" stroke={IC.blue} strokeWidth={2}/>
<path data-bio="posterior-sac" d="M493 110Q462 92 450 130Q431 161 446 193Q447 218 480 230Q528 244 557 213Q581 194 562 162Q574 122 547 117Q516 92 493 110Z" fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/>
<path data-bio="lung" d="M287 116Q310 90 349 103Q397 93 413 130L405 221Q355 244 291 221Z" fill="#f1d4d6" stroke={IC.red} strokeWidth={2}/>
{[137,161,185,209].map(y=><g key={y}><path data-bio="parabronchi" d={`M220 ${y}H447`} fill="none" stroke={IC.red} strokeWidth={10}/><path d={`M220 ${y}H447`} fill="none" stroke="#fff6f6" strokeWidth={6}/><Flow d={`M392 ${y}H309`} id={id} color={IC.blue}/></g>)}
<Flow d="M79 40V249Q79 280 127 280H516V240" id={id} color={IC.blue}/>
<Flow d="M179 116V84Q179 74 151 74H91V18" id={id} color={IC.blue}/>
<Callout n={1} x={597} y={271} tx={536} ty={214} target="posterior-sac"/>
<Callout n={2} x={433} y={60} tx={427} ty={137} target="parabronchi"/>
<Callout n={3} x={235} y={70} tx={192} ty={125} target="anterior-sac"/>
<Callout n={4} x={36} y={47} tx={75} ty={47} target="bronchus"/>
<Callout n={5} x={356} y={322} tx={357} ty={290} target="bronchus"/>
<Callout n={6} x={261} y={99} tx={291} ty={126} target="lung"/>
</>;}
export function BirdLung(){return <Plate id="bird-lung-ub-zoo" label={label} title="ריאת העוף — מנה אחת, שני מחזורים" subtitle="אחוריים מימין, קדמיים משמאל; כחול: כיוון זרימת אוויר" draw={Draw} keys={[
['שאיפה ראשונה — לשקים האחוריים','ירוק בהיר: מאגר האוויר האחורי'],['נשיפה ראשונה — מהאחוריים לריאה','צינורות אדומים: פרברונכים בריאה'],['שאיפה שנייה — לשקים הקדמיים','כחול בהיר: מאגר האוויר הקדמי'],['נשיפה שנייה — החוצה דרך הקנה','כיוון היציאה שונה מכיוון הכניסה'],['ברונכוס ראשי — מעקף אל האחוריים','אפור: קנה, ברונכוס וענפים מחברים'],['ריאה — זרימה חד־כיוונית','ורוד: רקמת הריאה סביב הפרברונכים']
]} foot={['שקי האוויר מוצגים כקבוצות; בפועל יש כמה זוגות','החצים עוקבים אחרי מנה אחת במשך ארבעה שלבים']}/>;}
