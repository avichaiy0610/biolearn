import {Plate,Callout,Flow,IC,He} from './geometry/ub-zoo';
const label="תא צורב לפני הירי ואחריו. לפני: כמוסה (נמטוציסט) עם חוט מגולגל ומכסה, וקנידוציל רגיש על פני התא. אחרי גירוי: המכסה נפתח והחוט מתהפך החוצה, עם קוצים בבסיסו; הכמוסה נשארת ריקה.";

function StingingCell({x,shot=false}:{x:number;shot?:boolean}){return <g transform={`translate(${x} 0)`}>
<path d="M-39 126Q-65 150-51 222Q-35 287 8 278Q61 265 58 189Q58 139 31 120Z" fill="#c5dbea" stroke={IC.blue} strokeWidth={2}/>
<ellipse data-bio={shot?'empty-capsule':'capsule'} cx={0} cy={190} rx={31} ry={56} fill={shot?'#fff':'#fff0d5'} stroke={IC.gold} strokeWidth={3}/>
<ellipse data-bio="nucleus" cx={15} cy={258} rx={12} ry={10} fill="#ddcee6" stroke={IC.purple} strokeWidth={2}/>
{!shot?<><path data-bio="coiled-tubule" d="M0 139V151Q-24 156 0 164Q24 172 0 180Q-24 188 0 196Q24 204 0 212Q-24 220 0 228" fill="none" stroke={IC.gold} strokeWidth={6}/><path d="M0 139V151Q-24 156 0 164Q24 172 0 180Q-24 188 0 196Q24 204 0 212Q-24 220 0 228" fill="none" stroke="#fff0d5" strokeWidth={2}/><path data-bio="lid" d="M-20 138Q0 130 20 138" fill="none" stroke={IC.gold} strokeWidth={5}/><path data-bio="cnidocil" d="M34 126Q45 106 43 82" fill="none" stroke={IC.ink} strokeWidth={4}/></>:<><path data-bio="open-lid" d="M-20 137L-36 108" fill="none" stroke={IC.gold} strokeWidth={5}/><path data-bio="everted-tubule" d="M-8 135V92Q-5 70-35 65Q-79 59-100 24L-108 12L-114 17Q-94 70-40 76Q-15 80-17 95V137Z" fill="#f0d6a8" stroke={IC.gold} strokeWidth={2}/>{[99,112,125].map(y=><path data-bio="barbs" key={y} d={`M-17 ${y}l-13 10 13-3M-8 ${y}l13 10-13-3`} fill={IC.red} stroke={IC.red}/>)}</>}
</g>;}
function Draw(id:string){return <>
<He x={463} y={31} size={28} bold>לפני הירי</He><He x={181} y={31} size={28} bold>אחרי הירי</He>
<StingingCell x={463}/><StingingCell x={181} shot/>
<Flow d="M384 207H264" id={id}/><He x={324} y={173} size={26}>גירוי</He>
<Callout n={1} x={565} y={82} tx={506} ty={82} target="cnidocil"/>
<Callout n={2} x={397} y={101} tx={453} ty={135} target="lid"/>
<Callout n={3} x={564} y={188} tx={490} ty={188} target="capsule"/>
<Callout n={4} x={396} y={265} tx={463} ty={212} target="coiled-tubule"/>
<Callout n={5} x={548} y={302} tx={478} ty={258} target="nucleus"/>
<Callout n={6} x={47} y={104} tx={109} ty={67} target="everted-tubule"/>
<Callout n={7} x={258} y={113} tx={180} ty={119} target="barbs"/>
<Callout n={8} x={85} y={249} tx={161} ty={215} target="empty-capsule"/>
</>;}
export function Cnidocyte(){return <Plate id="cnidocyte-ub-zoo" label={label} title="תא צורב — צינור נגלל ומתהפך החוצה" subtitle="לפני מימין, אחרי משמאל; מגע או אות כימי מפעילים ירי" draw={Draw} keys={[
['קנידוציל רגיש על פני התא','כהה: שלוחת החישה שמפעילה ירי'],['מכסה הכמוסה — נפתח בירי','זהב: מכסה סגור מימין, פתוח משמאל'],['נמטוציסט — כמוסה בתוך התא','זהב: דופן הכמוסה; כחול: התא'],['צינור חלול מגולגל בכמוסה','זהב: דופן; הפס הבהיר הוא החלל'],['גרעין התא הצורב','סגול: גרעין, נשאר בגוף התא'],['הצינור מתהפך החוצה בבת אחת','אותה דופן עוברת היפוך, לא נשלפת'],['קוצים בבסיס הצינור שנורה','אדום: קוצים הפונים לאחור'],['כמוסה ריקה אחרי הירי','כל נמטוציסט משמש פעם אחת בלבד']
]} foot="סכמטי; שני מצבים של תא צורב, ללא קנה מידה או מדידת זמן"/>;}
