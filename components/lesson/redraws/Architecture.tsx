import {Plate,Callout,Flow,He,La,IC,Capsid,faceTarget} from './geometry/viro';
const label="חזרתיות בקפסיד. משמאל: גן אחד מקודד תת-יחידה אחת, שממנה נבנים עשרות עד מאות עותקים. במרכז: סידור סלילי שבו האורך נקבע לפי אורך הגנום. מימין: קפסיד איקוסהדרלי, שבו 12 מחומשים יושבים בקודקודים ומספר המשושים גדל עם מספר הטריאנגולציה.";
function Draw(id:string){const p1=faceTarget(1,451,256,68,'t1'),p3=faceTarget(3,187,254,83,'pentamer'),h3=faceTarget(3,187,254,83,'hexamer');return <>
 <He x={524} y={12} size={26} bold>גן אחד, עותקים רבים</He>
 <rect data-bio="gene" x={470} y={31} width={108} height={18} rx={4} fill={IC.goldPale} stroke={IC.goldDark} strokeWidth={1.5}/>
 <Flow id={id} d="M523 55V75"/>
 {Array.from({length:24},(_,i)=><ellipse key={i} data-bio="copies" cx={478+(i%8)*13} cy={88+Math.floor(i/8)*15} rx={5} ry={6} fill={IC.bluePale} stroke={IC.blueDark} strokeWidth={1}/>)}
 <He x={266} y={12} size={26} bold>סידור סלילי</He>
 <path d="M153 60H353A12 27 0 0 1 353 114H153A12 27 0 0 1 153 60Z" fill="#e6f0e9" stroke="#9ebdaf" strokeWidth={1}/>
 {Array.from({length:80},(_,i)=>{const a=i*Math.PI/8,x=153+i*2.5,y=87+27*Math.sin(a);return <ellipse key={i} data-bio="helix" cx={x} cy={y} rx={6} ry={5} transform={`rotate(${20*Math.cos(a)} ${x} ${y})`} fill={Math.cos(a)>0?'#a7cebd':'#e0eee6'} stroke={IC.green} strokeWidth={1}/>;})}
 <path data-bio="genome" d={Array.from({length:161},(_,i)=>`${i?'L':'M'}${153+i*1.25} ${87+10*Math.sin(i*Math.PI/16)}`).join(' ')} fill="none" stroke={IC.goldDark} strokeWidth={3.5}/>
 <He x={451} y={163} size={26} bold>T = 1</He>
 <He x={187} y={163} size={26} bold>T = 3</He>
 <Capsid t={1} cx={451} cy={256} r={68}/><Capsid t={3} cx={187} cy={254} r={83}/>
 <Callout n={1} x={613} y={40} tx={578} ty={40} target="gene"/>
 <Callout n={2} x={613} y={119} tx={569} ty={118} target="copies"/>
 <Callout n={3} x={112} y={52} tx={151} ty={83} target="helix"/>
 <Callout n={4} x={387} y={87} tx={353} ty={87} target="genome"/>
 <Callout n={5} x={550} y={267} tx={p1[0]} ty={p1[1]} target="t1"/>
 <Callout n={6} x={76} y={203} tx={p3[0]} ty={p3[1]} target="pentamer"/>
 <Callout n={7} x={288} y={302} tx={h3[0]} ty={h3[1]} target="hexamer"/>
 </>;}
export function Architecture(){return <Plate id="viro-architecture" label={label} title="חזרתיות וסימטריה בקפסיד" subtitle="אותה תת־יחידה; שתי דרכי ארגון של המעטפת החלבונית" draw={Draw} keys={[
 ['גן תת־היחידה — זהוב','גן אחד מקודד חלבון מבני אחד'],['מאגר עותקים זהים — כחול בהיר','תרגום חוזר: עשרות עד מאות עותקים'],['סליל חלבוני — ירוק','תת־יחידות חוזרות סביב חומצת הגרעין'],['חומצת הגרעין — חום־זהוב','בסידור סלילי האורך נקבע לפי הגנום'],['T = 1: קפסיד סגור, 60 תת־יחידות','12 מחומשים בלבד — סגול'],['T = 3: מחומשים סגולים בקודקודים','מספר המחומשים נשאר 12'],['T = 3: גם משושים — כחול','180 תת־יחידות; יותר משושים עם T']
 ]} foot={['סכמטי; מוצג הצד הקרוב של מעטפת סגורה','מחומש/משושה הם צברי חלבונים, לא חלבון יחיד']}/>;}
