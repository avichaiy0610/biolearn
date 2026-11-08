import {Plate,IC,La,He} from './geometry/six';
import {Callout} from './geometry/next-six';
const label="השוואה: אינטרון מקבוצה II משחבר את עצמו — 2′-OH של אדנוזין בנקודת ההסתעפות (בתחום D6) תוקף, ותחום D5 קושר שני יוני Mg²⁺‎ באתר הפעיל. בספלייסוזום — אותה כימיה: snRNA U2 ו-U6 יוצרים את האתר הפעיל עם שני יוני Mg²⁺‎, ו-U6 דומה במבנה ל-D5. בשניהם האינטרון יוצא כלסו.";

function Fold({x,id,splice=false}:{x:number;id:string;splice?:boolean}){const c=splice?IC.purple:IC.gold;return <g transform={`translate(${x} 0)`}>
{splice&&<path d="M-94 106Q-122 124-103 180Q-132 224-83 244Q-42 273 24 241Q93 262 106 207Q129 168 98 132Q119 89 80 80" fill="#f4f0f6" stroke="#c5b8ce" strokeWidth={12}/>}
<path d="M-85 222Q-105 201-83 181L-53 173L-80 153Q-104 134-87 117Q-71 108-62 125L-43 158L-31 130L-39 88Q-43 66-28 65Q-11 63-15 85L-20 134L0 153L19 125L18 83Q15 65 30 64Q46 65 40 83L37 134L21 166L62 158Q79 155 80 141L78 113Q74 93 88 91Q103 91 101 111L100 148Q100 178 75 181L27 188L-5 207L-46 202L-72 220" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round"/>
{[-30,-24,-18,-12,-6].map((y,i)=><path key={i} d={`M-34 ${116+y}H-20M23 ${117+y}H37M82 ${144+y}H97`} stroke={c} strokeWidth={1.5}/>)}
<path d="M-49 254Q-10 247 10 222Q23 205 46 211Q66 216 73 237" fill="none" stroke={IC.blue} strokeWidth={3}/>
<circle cx={17} cy={218} r={6} fill={IC.blue}/>
<path d="M16 213Q7 199-7 192" stroke={IC.red} fill="none" strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/>
<circle cx={-7} cy={184} r={7} fill={IC.green}/><circle cx={7} cy={192} r={7} fill={IC.green}/>
<path d="M-58 255L-35 251M73 237L87 242" stroke={IC.red} strokeWidth={6}/>
<La x={30} y={58} size={26} color={c} bold>{splice?'U6':'D5'}</La>
<La x={113} y={250} size={26} color={IC.blue} bold>{splice?'U2':'D6'}</La>
</g>;}
function Draw({id}:{id:string}){return <>
<He x={473} y={18} size={26} bold>קבוצה II</He><He x={167} y={18} size={26} bold>ספלייסוזום</He>
<Fold x={475} id={id}/><Fold x={166} id={id} splice/>
<Callout n={1} x={601} y={98} tx={505} ty={111} target="D5-catalytic-stem"/>
<Callout n={2} x={588} y={301} tx={492} ty={218} target="D6-branchpoint-adenosine"/>
<Callout n={3} x={65} y={51} tx={196} ty={111} target="U6-catalytic-stem"/>
<Callout n={4} x={49} y={288} tx={183} ty={218} target="U2-paired-branchpoint"/>
<Callout n={5} x={323} y={155} tx={468} ty={184} target="two-magnesium-ions-groupII"/>
<path d="M307 155L173 192" fill="none" stroke="#60778a" strokeWidth={1.2} data-target="two-magnesium-ions-spliceosome"/>
<Callout n={6} x={32} y={180} tx={83} ty={244} target="protein-scaffold"/>
<path d="M369 309Q340 294 308 309Q323 327 345 318L369 309L390 323" fill="none" stroke={IC.gold} strokeWidth={3}/>
<path d="M268 315H207" fill="none" stroke={IC.red} strokeWidth={5}/>
<Callout n={7} x={430} y={285} tx={345} ty={318} target="released-intron-lariat"/>
<path d="M310 277V291M305 286L310 292L315 286" fill="none" stroke={IC.ink} strokeWidth={2}/>
</>;}
export function GroupIISpliceosome(){return <Plate id="splice-next" label={label} title="קבוצה II והספלייסוזום" subtitle="קיפולי RNA מקבילים — אתר פעיל וכימיה דומים" draw={id=><Draw id={id}/>} keys={[
['D5 בקבוצה II — זהוב','תחום RNA הקושר את יוני המתכת'],['D6 והאדנוזין להסתעפות','כחול: ⁦2′-OH⁩ של A תוקף'],['U6 בספלייסוזום — סגול','דומה במבנה לתחום D5'],['U2 מזווג עם נקודת ההסתעפות','כחול: מציג את A לתגובה'],['שני יוני Mg²⁺‎ בכל אתר פעיל','ירוק: זוג היונים בכל אחד מהקיפולים'],['פיגום חלבוני בספלייסוזום','אפור־סגול: מעל 100 חלבונים, Prp8'],['בשניהם: שתי תגובות ושחרור לסו','למטה בזהוב: לסו; אדום: אקסונים מחוברים']
]} foot="קיפולים סכמטיים; דמיון תפקודי אינו זהות ברצף"/>;}
