/* Textbook-level redraw by Codex (2026-11-02); the previous version is archived in archive/figures/2026-11-02/. */
import { Svg, He, La } from "./helpers";
const ink='var(--ink)', muted='var(--muted)', blue='#4089b7', goldDark='#8b5b1b';
function Duplex({y,x1=50,x2=550}:{y:number;x1?:number;x2?:number}) { return <g>{Array.from({length:Math.floor((x2-x1)/12)},(_,i)=><path key={i} d={`M${x1+8+i*12} ${y-5}v10`} stroke="#85b6d3" strokeWidth={1.3}/>)}<path d={`M${x1} ${y-6}H${x2}M${x1} ${y+6}H${x2}`} fill="none" stroke={blue} strokeWidth={3.5} strokeLinecap="round"/></g>; }
function Orc({x,y}:{x:number;y:number}) { return <g transform={`translate(${x} ${y})`} stroke="#6f6396" strokeWidth={1.5}>
<path d="M-47 6C-61-9-48-32-30-27C-22-46 2-42 6-29C25-43 44-27 37-10C56-3 48 20 30 19C19 38-3 30-8 21C-27 35-44 27-41 14Z" fill="#c4b9de"/>
<path d="M-43-8C-42-25-25-28-17-18L-11 0L-28 5Z" fill="#ddd6ed"/><path d="M-15-23C-4-37 14-26 13-13L5 0L-8-1Z" fill="#d8cfea"/><path d="M16-16C36-28 41-7 31 2L15 5L8-1Z" fill="#b0a0cd"/>
<path d="M-24 8Q-4-9 19 8" strokeWidth={6} stroke="#8875b1" fill="none"/>
</g>; }
/** Side-on barrel: three visible lobes represent six MCM subunits; the pore is axial. */
function Mcm({x,y,flip=false,active=false}:{x:number;y:number;flip?:boolean;active?:boolean}) { return <g transform={`translate(${x} ${y}) scale(${flip?-1:1} 1)`}>
<path d="M-26-32Q-22-44 6-39L26-28V28L6 39Q-22 44-26 32Z" fill="#b57e30" stroke={goldDark} strokeWidth={1.5}/>
{[-25,0,25].map((v,i)=><path key={v} d={`M-27 ${v-9}Q-7 ${v-18} 21 ${v-10}Q31 ${v} 21 ${v+10}Q-7 ${v+18}-27 ${v+9}Q-36 ${v}-27 ${v-9}Z`} fill={i===1?'#efcf8c':'#e5bd70'} stroke={goldDark} strokeWidth={1.4}/>)}
<ellipse cx={23} cy={0} rx={8} ry={30} fill="#f4dfb3" stroke={goldDark} strokeWidth={1.4}/><ellipse cx={23} cy={0} rx={4} ry={9} fill="var(--panel)" stroke={goldDark} strokeWidth={1}/>
{active&&<><path d="M-26-23Q-43-37-44-17Q-46-3-28 1L-18-8Z" fill="#a89ac8" stroke="#6f6396" strokeWidth={1.5}/><path d="M-23 11Q-44 5-43 25Q-32 39-20 29L-10 20Z" fill="#84bca3" stroke="#397d63" strokeWidth={1.5}/></>}
</g>; }
export function OriginLicensing(){return <Svg w={600} h={934} label="רישוי וירי של מקורות באאוקריוטים: ב-G1 (CDK נמוך) ORC, Cdc6 ו-Cdt1 טוענים שתי טבעות MCM לא פעילות; ב-S (CDK ו-DDK גבוהים) נוצר ההליקאז הפעיל CMG ושני מזלגות יוצאים; כל עוד CDK גבוה אין טעינה חדשה">
<defs><marker id="ol-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={ink}/></marker></defs>
<rect width={600} height={934} fill="var(--paper)"/>
<He x={300} y={34} size={24} bold>רישוי וירי של מקורות</He>
<He x={300} y={61} size={17} color={muted}>שתי פעולות נפרדות במחזור התא</He>
<rect x={16} y={82} width={568} height={306} rx={14} fill="var(--panel)"/>
<He x={300} y={114} size={21} bold>⁦G1⁩ — ⁦CDK⁩ נמוך: רישוי</He>
<Duplex y={201}/><Orc x={156} y={187}/>
<path d="M212 166Q201 143 221 139Q236 132 244 146L237 169Z" fill="#a8c8b2" stroke="#4f8063" strokeWidth={1.5}/>
<path d="M264 176Q252 154 268 143Q285 141 290 158L284 178Z" fill="#e8b7a5" stroke="#a56a53" strokeWidth={1.5}/>
<La x={154} y={137} size={18} bold>ORC</La><La x={224} y={132} size={17}>Cdc6</La><La x={281} y={132} size={17}>Cdt1</La>
<path d="M302 171Q325 149 352 164" fill="none" stroke={ink} strokeWidth={2} markerEnd="url(#ol-tip)"/>
<Mcm x={393} y={201}/><Mcm x={454} y={201} flip/>
{/* Duplex traverses the axial pores of the inactive double hexamer. */}
<path d="M364 195H483M364 207H483" fill="none" stroke={blue} strokeWidth={3.5}/>
<La x={423} y={264} size={20} bold color={ink}>MCM ×2</La>
<He x={300} y={301} size={20} bold>מורשה, לא פעיל</He>
<He x={300} y={330} size={17} color={muted}>שתי טבעות זו מול זו סביב ⁦DNA⁩ דו־גדילי</He>
<He x={300} y={357} size={16} color={muted}>הגדילים עדיין סגורים</He>
<rect x={16} y={405} width={568} height={296} rx={14} fill="var(--panel)"/>
<He x={300} y={439} size={21} bold>⁦S⁩ — ⁦CDK⁩ ו-⁦DDK⁩ גבוהים: ירי</He>
{[50,433].map((start)=><g key={start}>{Array.from({length:9},(_,i)=><path key={i} d={`M${start+8+i*12} 541v10`} stroke="#85b6d3" strokeWidth={1.3}/>)}</g>)}
<g transform="translate(190 530) rotate(-25)"><Mcm x={0} y={0} active flip/></g>
<g transform="translate(410 562) rotate(-25)"><Mcm x={0} y={0} active/></g>
{/* Each parental strand is drawn exactly once. One threads the left CMG, the other the right;
    the complementary strand branches outside each helicase at the fork. */}
<path d="M50 540H167L214 518C269 479 373 476 405 495Q426 508 433 540H550M50 552H167C175 604 279 621 340 602L433 552H550" stroke={blue} strokeWidth={3.5} fill="none" strokeLinejoin="round"/><path d="M213 474H147" stroke={ink} strokeWidth={2.5} markerEnd="url(#ol-tip)"/><path d="M389 625H455" stroke={ink} strokeWidth={2.5} markerEnd="url(#ol-tip)"/>
<La x={111} y={502} size={18} bold color={ink}>CMG</La><La x={492} y={610} size={18} bold color={ink}>CMG</La>
<He x={300} y={652} size={18}>⁦Cdc45⁩ ו-⁦GINS⁩ מצטרפים ל-⁦MCM⁩</He>
<He x={300} y={679} size={16} color={muted}>הליקאז פעיל על גדיל יחיד • שני מזלגות יוצאים</He>
<rect x={16} y={718} width={568} height={147} rx={14} fill="var(--panel)"/>
<He x={300} y={752} size={20} bold>מ-⁦S⁩ עד סוף המיטוזה: אין רישוי חדש</He>
<He x={300} y={787} size={17}>⁦Cdc6⁩ מפורק · ⁦Cdt1⁩ מעוכב בידי ג׳מינין</He>
<He x={300} y={816} size={17}>⁦ORC⁩ מזורחן</He>
<He x={300} y={844} size={15} color={muted}>מנגנוני הבקרה תלויים באורגניזם</He>
<La x={98} y={892} size={17} color={ink}>DNA</La><La x={242} y={892} size={17} color={ink}>MCM</La><La x={420} y={892} size={17}>CMG = Cdc45–MCM–GINS</La>
<He x={300} y={922} size={15} color={muted}>איור מקורי סכמטי • מבנים ומרחקים אינם בקנה מידה</He>
</Svg>;}




