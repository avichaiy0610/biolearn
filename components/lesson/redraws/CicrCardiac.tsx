import {Plate,IC,La} from './geometry/six';
import {Callout} from './geometry/next-six';
const label="צימוד עירור-התכווצות בשריר הלב: פוטנציאל הפעולה פותח תעלות Ca²⁺‎ מסוג L בצינורית T; ה-Ca²⁺‎ שנכנס פותח את RyR2 ב-SR, שמשחרר כמות גדולה של Ca²⁺‎ לטרופונין C. בהרפיה SERCA2 (שמעוכבת ע״י פוספולמבן) מחזירה Ca²⁺‎ ל-SR, ו-NCX מוציא Ca²⁺‎ החוצה בתמורה ל-Na⁺";

function Draw({id}:{id:string}){return <>
<path d="M25 48H170Q187 48 187 65V222Q187 260 214 260Q241 260 241 222V65Q241 48 260 48H615V334H25Z" fill="#edf5fa"/>
<path d="M25 41H170Q194 41 194 65V222Q194 252 214 252Q234 252 234 222V65Q234 41 260 41H615M25 53H170Q181 53 181 65V222Q181 267 214 267Q247 267 247 222V65Q247 53 260 53H615" fill="none" stroke={IC.blue} strokeWidth={3}/>
<path d="M318 104Q293 104 293 130V205Q293 222 318 222H536Q561 222 561 200V131Q561 104 536 104Z" fill="#d5e8ed" stroke={IC.green} strokeWidth={9}/>
<path d="M318 104Q293 104 293 130V205Q293 222 318 222H536Q561 222 561 200V131Q561 104 536 104Z" fill="none" stroke="#a4c8bd" strokeWidth={3}/>
<La x={442} y={152} size={30} color={IC.green} bold>SR</La>
{[232,244].map(x=><rect key={x} x={x} y={138} width={9} height={46} rx={4} fill={IC.red} stroke="#8b353d"/>)}
{[[285,141],[298,141],[285,168],[298,168]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx={9} ry={14} fill={IC.red} stroke="#8b353d"/>)}
{[[210,116],[264,156],[276,171],[320,245],[344,257],[367,245],[405,185]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={5} fill={IC.red}/>)}
<path d="M209 93V149H228M253 155H275M287 192Q285 238 340 263" stroke={IC.red} strokeWidth={2.5} fill="none" markerEnd={`url(#${id}-arrow)`}/>
<ellipse cx={457} cy={221} rx={17} ry={24} fill={IC.green} stroke="#376a56" strokeWidth={2}/><path d="M448 239Q432 218 450 204M464 202Q481 221 465 237" stroke="#c9e5d5" strokeWidth={3} fill="none"/>
<path d="M441 271Q415 251 435 227M480 212L479 183" fill="none" stroke={IC.green} strokeWidth={2.5} markerEnd={`url(#${id}-arrow)`}/>
<path d="M488 206V235" stroke={IC.purple} strokeWidth={5} strokeLinecap="round"/>
<path d="M487 238H470" stroke={IC.purple} strokeWidth={2}/>
<path d="M75 27Q65 45 75 63L92 63Q102 45 92 27Z" fill={IC.gold} stroke={IC.goldDark} strokeWidth={2}/>
<path d="M65 88V13M110 13V88" stroke={IC.goldDark} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/>
<path d="M514 28V63M530 28V63M514 28Q522 15 530 28" fill="none" stroke={IC.purple} strokeWidth={7}/>
<path d="M520 74Q516 90 492 100" fill="none" stroke={IC.purple} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/>
<circle cx={522} cy={11} r={7} fill={IC.purple}/>
{[0,1,2].map(i=><g key={i}><path d={`M302 ${291+i*11}H412`} stroke={IC.blueDark} strokeWidth={3}/>{[0,1,2,3,4,5,6].map(j=><circle key={j} cx={307+j*16} cy={291+i*11} r={3} fill={IC.blue}/>)}</g>)}
<circle cx={357} cy={285} r={7} fill={IC.red}/>
<Callout n={1} x={157} y={117} tx={237} ty={156} target="L-type-channel-in-T-tubule"/>
<Callout n={2} x={342} y={80} tx={300} ty={153} target="RyR2"/>
<Callout n={3} x={265} y={315} tx={357} ty={285} target="troponin-C-on-myofilament"/>
<Callout n={4} x={553} y={279} tx={459} ty={221} target="SERCA2"/>
<Callout n={5} x={589} y={190} tx={488} ty={218} target="phospholamban"/>
<Callout n={6} x={48} y={125} tx={82} ty={46} target="NCX"/>
<Callout n={7} x={593} y={84} tx={530} ty={42} target="beta1-receptor"/>
</>;}
export function CicrCardiac(){return <Plate id="cardiac-next" label={label} title="בלב: סידן משחרר סידן — CICR" subtitle="דיאדה: צינורית T סמוכה למאגר ה־SR" draw={id=><Draw id={id}/>} keys={[
['תעלת L — אדום; בצינורית T','פוטנציאל פעולה פותח; Ca²⁺‎ נכנס'],['RyR2 ב־SR מופעל בידי הסידן','אדום: שחרור Ca²⁺‎ בכמות גדולה'],['Ca²⁺‎ נקשר לטרופונין C','מפעיל את הסיבים → התכווצות'],['SERCA2 מחזירה Ca²⁺‎ ל־SR','ירוק: השאיבה בהרפיה'],['פוספולמבן מעכב את SERCA2','סגול: הווסת הסמוך למשאבה'],['NCX — מחליף בממברנת התא','זהוב: Ca²⁺‎ החוצה, ⁦3 Na⁺⁩ פנימה'],['⁦β1 → PKA⁩ מזרחן L ופוספולמבן','סגול: כוח מוגבר והרפיה מהירה']
]} foot={['בלב אין חיבור מכני מחייב בין L ל־RyR2; סכמטי','השוואה לשלד: DHPR–RyR1 מכני; בלי Ca²⁺‎ חיצוני']}/>;}
