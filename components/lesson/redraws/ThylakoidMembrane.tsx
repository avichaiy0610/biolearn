/* Textbook-level redraw by Codex (round 2, 2026-11-05); the previous version is archived in archive/figures/2026-11-05/. */
import { Svg, He, La } from "./helpers";
const INK='#25364a',GREEN='#25816a',BLUE='#3378a4',RED='#bf5558',GOLD='#b18a36';
function Lipids({y}:{y:number}){return <g>{Array.from({length:37},(_,i)=>{const x=18+i*12;return <g key={i}><path d={`M${x-2} ${y+5}l-2 18m7-18l2 18M${x-2} ${y+55}l-2-18m7 18l2-18`} stroke="#b8ac7c" strokeWidth="1.5"/><circle cx={x} cy={y} r="4.5" fill="#e1c67d" stroke="#b59e60" strokeWidth=".7"/><circle cx={x} cy={y+60} r="4.5" fill="#e1c67d" stroke="#b59e60" strokeWidth=".7"/></g>})}</g>}
function A({d,color=INK}:{d:string;color?:string}){return <path d={d} fill="none" stroke={color} strokeWidth="2.2" markerEnd={`url(#thy-${color===RED?'red':color===GREEN?'green':'ink'})`}/>}
function GlowComplex({x,y,type}:{x:number;y:number;type:'psii'|'b6f'|'psi'}){const c=type==='psii'?'#b77942':type==='b6f'?'#7d63a4':'#4c8c7d';return <g transform={`translate(${x} ${y})`}>
{type==='psii'?<><path d="M-45-23Q-49-51-30-51Q-17-65-5-50Q9-63 25-51Q46-48 45-21L43 40Q31 57 17 47Q2 62-15 49Q-39 57-43 37Z" fill="url(#thy-psii)" stroke={c} strokeWidth="1.7"/>{[-23,8,29].map((dx,i)=><path key={i} d={`M${dx} -34q-9 26 0 63`} fill="none" stroke="#ad7045" strokeWidth="6" opacity=".45"/>)}<path d="M-28 43Q-32 66-11 69Q8 71 12 54Q6 41-8 45Z" fill="#e4cba5" stroke={c}/><circle cx="-12" cy="57" r="4" fill="#9689ae"/><circle cx="-2" cy="59" r="4" fill="#9689ae"/></>:
type==='b6f'?<><path d="M-35-42Q-28-59-9-46Q0-54 9-46Q31-59 35-38L39 28Q31 49 12 40Q1 57-12 40Q-33 50-39 28Z" fill="url(#thy-b6f)" stroke={c} strokeWidth="1.7"/><path d="M-17-30q-12 26-1 55M15-30q12 26 1 55" fill="none" stroke="#71558d" strokeWidth="8" opacity=".35"/><ellipse cx="-14" cy="-6" rx="7" ry="4" fill="#c57a66"/><ellipse cx="15" cy="12" rx="7" ry="4" fill="#c57a66"/></>:
<><path d="M-48-5Q-57-27-38-39Q-28-61-10-48Q3-64 17-45Q37-48 39-28Q60-20 49 2L45 37Q32 52 16 41Q2 58-13 42Q-36 54-44 33Z" fill="url(#thy-psi)" stroke={c} strokeWidth="1.7"/>{[-29,-9,13,32].map((dx,i)=><path key={i} d={`M${dx} -25q-9 24 0 50`} fill="none" stroke="#2f766a" strokeWidth="5" opacity=".35"/>)}<path d="M-6-45Q-12-63 3-65Q22-63 18-45" fill="#a9cbb9" stroke={c}/></>}
<path d="M-26-31Q-8-43 8-33" stroke="white" strokeWidth="4" opacity=".45" fill="none"/>
</g>}
export function ThylakoidMembrane(){return <Svg w={480} h={1170} label="ממברנת התילקואיד: מערכת II מפרקת מים בצד הלומן ומעבירה אלקטרונים לפלסטוקינון; ציטוכרום b6f מעביר אותם לפלסטוציאנין בלומן ומשחרר פרוטונים ללומן; מערכת I מעבירה אותם לפרדוקסין בסטרומה, ו-FNR מחזר NADP+. הפרוטונים שהצטברו בלומן חוזרים לסטרומה דרך ATP סינתאז ומניעים ייצור ATP">
<defs>{[['psii','#f2d5b1','#d59a69'],['b6f','#d7c9eb','#a58bc3'],['psi','#c8dfc7','#80b3a1'],['atp','#bfe0d8','#65a797']].map(([id,a,b])=><linearGradient key={id} id={`thy-${id}`} x2="1" y2=".6"><stop stopColor={a}/><stop offset="1" stopColor={b}/></linearGradient>)}{[['ink',INK],['red',RED],['green',GREEN]].map(([id,c])=><marker key={id} id={`thy-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={c}/></marker>)}</defs>
<He x={240} y={30} size={20} bold>אור, אלקטרונים ומפל פרוטונים</He><He x={240} y={59} size={16} color="#586b7d">א. מסלול האלקטרון בממברנת התילקואיד</He>
<rect x="12" y="85" width="456" height="171" rx="14" fill="#eff8f1"/><rect x="12" y="316" width="456" height="182" rx="14" fill="#fbf1ef"/>
<He x={125} y={111} size={16} bold color={GREEN}>סטרומה (pH ≈ 8)</He><He x={120} y={472} size={16} bold color={RED}>לומן (pH ≈ 5–6)</He>
<Lipids y={255}/><GlowComplex x={82} y={284} type="psii"/><GlowComplex x={235} y={284} type="b6f"/><GlowComplex x={382} y={284} type="psi"/>
<La x={82} y={225} size={17} bold>PSII</La><La x={235} y={225} size={17} bold>b₆f</La><La x={410} y={365} size={17} bold>PSI</La>
{[82,382].map(x=><g key={x}><path d={`M${x-24} 161l12 15-9 4 14 22`} stroke={GOLD} strokeWidth="2.7" fill="none"/><He x={x} y={147} size={16} color={GOLD}>אור</He></g>)}
<ellipse cx="156" cy="285" rx="18" ry="12" fill="#f4dfaa" stroke={GOLD}/><La x={156} y={345} size={16} color={GOLD}>PQ</La><A d="M128 283H135"/><A d="M176 283H193"/>
<path d="M305 377q-17-12-18 6q-4 15 13 17q17 4 22-10q3-13-17-13Z" fill="#c4dbe9" stroke={BLUE}/><La x={304} y={426} size={16} color={BLUE}>PC</La><A d="M256 329Q266 372 284 384"/><A d="M324 384Q347 377 370 335"/>
<path d="M415 199q-12-16-23-6q-8 15 7 21q17 6 16-15Z" fill="#d3dadf" stroke="#63798b"/><La x={440} y={208} size={16}>Fd</La><A d="M390 231L397 217"/><A d="M400 187V172H450V139"/><La x={360} y={132} size={16} bold color={GREEN}>NADP⁺ → NADPH</La>
<La x={104} y={398} size={16} bold color={BLUE}>2H₂O → O₂ + 4H⁺</La><A d="M82 374V358" color={BLUE}/>
<A d="M245 186Q278 208 278 255V351" color={RED}/><La x={258} y={176} size={16} bold color={RED}>H⁺</La><La x={243} y={407} size={16} bold color={RED}>H⁺</La>
<He x={240} y={530} size={16}>החיצים השחורים — מסלול האלקטרון</He><He x={240} y={558} size={16}>האדומים — פרוטונים</He>
<He x={240} y={609} size={18} bold>ב. המפל מניע ייצור ATP</He>
<rect x="12" y="631" width="456" height="215" rx="14" fill="#eff8f1"/><rect x="12" y="906" width="456" height="143" rx="14" fill="#fbf1ef"/>
<He x={110} y={659} size={16} color={GREEN}>סטרומה (pH ≈ 8)</He><He x={115} y={1025} size={16} color={RED}>לומן (pH ≈ 5–6)</He><Lipids y={845}/>
<path d="M208 842Q198 825 208 807L269 807Q284 824 273 844L278 899Q261 917 209 901Z" fill="url(#thy-atp)" stroke={GREEN} strokeWidth="1.7"/>
{Array.from({length:7},(_,i)=><path key={i} d={`M${213+i*8} 848q-4 26 0 49`} stroke="#438c7a" strokeWidth="2.5" fill="none" opacity=".65"/>)}
<path d="M234 811V753M248 809V753" stroke="#578c77" strokeWidth="8"/><path d="M273 856Q307 825 294 757" stroke="#7eaa91" strokeWidth="9" fill="none"/>
{[[213,728],[242,708],[271,728],[267,755],[236,769],[210,754]].map(([cx,cy],i)=><ellipse key={i} cx={cx} cy={cy} rx="25" ry="31" fill={`url(#thy-atp)`} stroke={GREEN} strokeWidth="1.4"/>)}
<path d="M201 723Q211 703 221 707" fill="none" stroke="#fff" strokeWidth="4" opacity=".6"/>
<La x={363} y={722} size={18} bold color={GREEN}>ATP</La><He x={363} y={748} size={17} bold color={GREEN}>סינתאז</He><La x={328} y={671} size={16} color={GREEN}>ADP + Pi → ATP</La>
<A d="M330 963H260V867Q260 817 286 792L310 780" color={RED}/><La x={342} y={965} size={17} bold color={RED}>H⁺</La><La x={337} y={790} size={17} bold color={RED}>H⁺</La>
<He x={240} y={1082} size={16}>הפרוטונים חוזרים מהלומן אל הסטרומה</He><He x={240} y={1112} size={16}>פאנלים של אותה ממברנה; המרחקים אינם ממשיים</He><He x={240} y={1140} size={16} color="#586b7d">סכמטי, לא בקנה מידה; אין כאן ספירת תת־יחידות</He>
</Svg>}
