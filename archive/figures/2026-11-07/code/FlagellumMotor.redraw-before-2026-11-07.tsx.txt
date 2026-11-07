/* Textbook-level redraw by Codex (round 2, 2026-11-05); the previous version is archived in archive/figures/2026-11-05/. */
import { Svg, He, La } from "./helpers";
const INK='#25364a',GREEN='#287b68',BLUE='#397b9a',RED='#bd5958';
function Arrow({d,color=INK}:{d:string;color?:string}){return <path d={d} stroke={color} strokeWidth="2.3" fill="none" markerEnd={`url(#flag-${color===RED?'red':'ink'})`}/>}
function Bilayer({y}:{y:number}){return <g>{Array.from({length:36},(_,i)=>{const x=20+i*12.5;if(x>204&&x<278)return null;return <g key={i}><path d={`M${x-2} ${y+4}l-3 16m7-16l3 16M${x-2} ${y+42}l-3-16m7 16l3-16`} stroke="#bcb38a" strokeWidth="1.5"/><circle cx={x} cy={y} r="4.4" fill="#d7c58d" stroke="#ad9b65" strokeWidth=".7"/><circle cx={x} cy={y+46} r="4.4" fill="#d7c58d" stroke="#ad9b65" strokeWidth=".7"/></g>})}</g>}
function Ring({y,rx,depth,fill}:{y:number;rx:number;depth:number;fill:string}){return <g><path d={`M${240-rx} ${y}v${depth}a${rx} 14 0 0 0 ${rx*2} 0v-${depth}`} fill={fill} stroke={GREEN} strokeWidth="1.5"/><ellipse cx="240" cy={y+depth} rx={rx} ry="14" fill={fill} stroke={GREEN}/><ellipse cx="240" cy={y} rx={rx} ry="14" fill="#d4e7ce" stroke={GREEN} strokeWidth="1.4"/><ellipse cx="240" cy={y} rx="17" ry="7" fill="#648f80"/>{Array.from({length:9},(_,i)=>{const t=(i+1)*Math.PI/10;const x=240+rx*Math.cos(t);return <path key={i} d={`M${x} ${y+10*Math.sin(t)}v${depth}`} stroke={GREEN} strokeWidth="1" opacity=".4"/>})}</g>}
export function FlagellumMotor(){return <Svg w={480} h={1150} label="המנוע של השוטון בחיידק גראם-שלילי: הסיב מחובר דרך הקרס למוט, שעובר דרך טבעת L בממברנה החיצונית וטבעת P בפפטידוגליקן אל טבעת MS בממברנה הציטופלזמית ואל טבעת C בציטופלזמה. חלבוני Mot מסביב מהווים את הסטטור, וזרימת פרוטונים דרכם מסובבת את הרוטור">
<defs><linearGradient id="flag-rod"><stop stopColor="#b1d9b9"/><stop offset=".5" stopColor="#e2efcc"/><stop offset="1" stopColor="#77b59b"/></linearGradient><linearGradient id="flag-hook"><stop stopColor="#7dadb3"/><stop offset=".5" stopColor="#c9e5df"/><stop offset="1" stopColor="#6b9d9e"/></linearGradient><linearGradient id="flag-mot"><stop stopColor="#82b3cc"/><stop offset=".5" stopColor="#cae4ed"/><stop offset="1" stopColor="#6398b6"/></linearGradient>{[['ink',INK],['red',RED]].map(([id,c])=><marker id={`flag-${id}`} key={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={c}/></marker>)}</defs>
<He x={240} y={30} size={20} bold>מנוע השוטון החיידקי</He><He x={240} y={60} size={16} color="#586b7d">חתך בגוף הבסיס של חיידק גראם־שלילי</He>
<path d="M260 288Q252 230 300 213Q370 184 325 127Q302 103 349 87" fill="none" stroke="#357f68" strokeWidth="25"/>
{Array.from({length:29},(_,i)=>{const t=i/28;const y=88+t*137;const x=y<126?349-32*Math.sin((y-88)/38*Math.PI/2):325+20*Math.sin((y-126)/90*Math.PI);return <g key={i}><ellipse cx={x-6} cy={y} rx="5" ry="3.5" fill="#9dceb0" stroke={GREEN} strokeWidth=".6"/><ellipse cx={x+4} cy={y+2} rx="5" ry="3.5" fill="#74b395" stroke={GREEN} strokeWidth=".6"/></g>})}
<path d="M218 340L219 296Q215 259 243 241Q271 220 292 226L304 250Q279 246 264 266Q255 277 258 307L259 340Z" fill="url(#flag-hook)" stroke="#477e86" strokeWidth="1.7"/>
<path d="M231 322Q226 278 248 258Q264 245 283 242" stroke="#fff" strokeWidth="5" fill="none" opacity=".45"/>
<He x={122} y={137} size={17} color={GREEN}>הסיב (פלגלין)</He><path d="M190 132H278L310 124" fill="none" stroke="#82949d"/>
<He x={119} y={273} size={17} color={BLUE}>קרס</He><path d="M145 267H203L227 282" fill="none" stroke="#82949d"/>
<rect x="15" y="360" width="450" height="323" rx="15" fill="#f5f3e9"/><Bilayer y={365}/>
{Array.from({length:20},(_,i)=><g key={i}><path d={`M${20+i*23} 481l12 13-12 13m0-26v26`} fill="none" stroke="#d4ac65" strokeWidth="2"/><path d={`M${20+i*23} 494h23`} stroke="#c29b5c" strokeWidth="1.2"/></g>)}
<Bilayer y={637}/>
<path d="M220 330Q239 321 258 330L258 682Q240 697 220 682Z" fill="url(#flag-rod)" stroke={GREEN} strokeWidth="1.6"/><path d="M229 344V672" stroke="white" strokeWidth="4" opacity=".45"/>
<Ring y={382} rx={38} depth={23} fill="#9bc6a8"/><Ring y={490} rx={35} depth={23} fill="#a8cba4"/>
<path d="M143 573Q139 550 153 549Q171 552 170 576L180 630Q191 657 179 688Q170 704 156 689L151 645Z" fill="url(#flag-mot)" stroke={BLUE} strokeWidth="1.6"/>
<path d="M310 576Q308 550 324 549Q341 552 337 576L330 645Q340 676 324 691Q309 702 301 682Q291 658 304 630Z" fill="url(#flag-mot)" stroke={BLUE} strokeWidth="1.6"/>
<path d="M155 558L164 629M326 559L316 630" stroke="#d9edf2" strokeWidth="4" fill="none" opacity=".7"/>
<Ring y={653} rx={57} depth={25} fill="#87b99a"/>
<path d="M180 707Q240 682 300 707V747Q240 772 180 747Z" fill="#7dab94" stroke={GREEN} strokeWidth="1.5"/><ellipse cx="240" cy="707" rx="60" ry="17" fill="#afcdb4" stroke={GREEN}/><ellipse cx="240" cy="707" rx="34" ry="9" fill="#789f89"/>
{Array.from({length:12},(_,i)=>{const t=i*Math.PI/11;const x=240+59*Math.cos(t);return <path key={i} d={`M${x} ${707+16*Math.sin(t)}v37`} stroke="#477b63" strokeWidth="1.1" opacity=".55"/>})}
<He x={77} y={317} size={16}>ממברנה חיצונית:</He><He x={78} y={343} size={17} bold color={GREEN}>טבעת L</He><path d="M131 383H200" stroke="#82949d"/>
<He x={78} y={435} size={16}>פפטידוגליקן:</He><He x={78} y={463} size={17} bold color={GREEN}>טבעת P</He><path d="M130 502H203" stroke="#82949d"/>
<He x={378} y={607} size={16}>ממברנה</He><He x={378} y={630} size={16}>ציטופלזמית:</He><He x={388} y={716} size={17} bold color={GREEN}>טבעת MS</He><path d="M302 670H335" stroke="#82949d"/>
<He x={107} y={734} size={17} bold color={GREEN}>טבעת C</He><He x={107} y={758} size={16} color={GREEN}>(המתג)</He><path d="M150 732H178" stroke="#82949d"/>
<La x={326} y={530} size={17} bold color={BLUE}>Mot</La><La x={152} y={530} size={17} bold color={BLUE}>Mot</La>
<La x={105} y={573} size={18} bold color={RED}>H⁺</La><Arrow d="M117 586Q135 603 146 637Q157 665 143 707" color={RED}/><La x={137} y={794} size={18} bold color={RED}>H⁺</La>
<Arrow d="M214 791Q272 818 307 784"/><He x={293} y={838} size={16}>סיבוב הרוטור</He>
<rect x="16" y="867" width="448" height="175" rx="14" fill="#f3f6f8"/>
<He x={240} y={898} size={17} bold color={GREEN}>הרוטור: מוט, טבעות MS ו־C</He><He x={240} y={929} size={17} color={BLUE}>הסטטור: חלבוני Mot</He><He x={240} y={967} size={16}>זרימת פרוטונים דרך הסטטור</He><He x={240} y={993} size={16}>מסובבת את הרוטור</He><He x={240} y={1022} size={16} color="#586b7d">טבעות L ו־P הן מיסבים סביב המוט</He>
<He x={240} y={1080} size={16}>דו־שכבות: ראשים בהירים וזנבות פנימיים</He><He x={240} y={1108} size={16}>הסיב ארוך בהרבה מהחלק המוצג</He><He x={240} y={1136} size={16} color="#586b7d">סכמטי, לא בקנה מידה; מספר היחידות אינו מדיד</He>
</Svg>}
