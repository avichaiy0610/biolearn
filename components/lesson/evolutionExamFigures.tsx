/* Original schematic illustrations. Scientific conventions and source limitations:
   visual-lab/evolution-exam-gaps/learning-card.md. No textbook artwork is reproduced. */
import type React from "react";
import { He, La, BLUE, GREEN, ORANGE, INK, MUTED } from "./biochemFigures";
const PURPLE = "#7c3aed", RED = "#b91c1c", LINE = "#cbd5e1";
function Panel({ h, label, children }: { h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <rect width={480} height={h} fill="white" />{children}
  </svg>;
}
function Link({ x1, y1, x2, y2, color = MUTED }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
    <path d={`M${x2} ${y2}l${-8 * Math.cos(a - .4)} ${-8 * Math.sin(a - .4)}L${x2 - 8 * Math.cos(a + .4)} ${y2 - 8 * Math.sin(a + .4)}Z`} fill={color} /></g>;
}
function Genotype({ x, y, value, color = INK }: { x: number; y: number; value: string; color?: string }) {
  return <g><rect x={x - 61} y={y - 26} width={122} height={44} rx={12} fill="#f8fafc" stroke={LINE} />
    <La x={x - 9} y={y + 3} size={22} bold color={color}>{value}</La><La x={x + 44} y={y + 2} color={GREEN} size={21}>✓</La></g>;
}
export function DobzhanskyMuller() {
  return <Panel h={675} label="מודל דובז׳נסקי–מולר: אב קדמון aabb ושתי שושלות שכל שלביהן תקינים; רק בהיבריד AaBb נפגשים A ו-B ויוצרים אי־התאמה">
    <He x={240} y={28} bold size={19}>מחסום בהכלאה, בלי שלב מזיק בשושלות</He>
    <He x={240} y={63} size={16}>אוכלוסיית המקור</He><Genotype x={240} y={99} value="aabb" />
    <Link x1={210} y1={122} x2={128} y2={158} /><Link x1={270} y1={122} x2={352} y2={158} />
    <He x={123} y={185} bold color={BLUE}>שושלת 1</He><He x={357} y={185} bold color={ORANGE}>שושלת 2</He>
    <Genotype x={123} y={224} value="aabb" /><Genotype x={357} y={224} value="aabb" />
    <Link x1={123} y1={249} x2={123} y2={273} color={BLUE} /><Link x1={357} y1={249} x2={357} y2={273} color={ORANGE} />
    <Genotype x={123} y={309} value="Aabb" color={BLUE} /><Genotype x={357} y={309} value="aaBb" color={ORANGE} />
    <Link x1={123} y1={334} x2={123} y2={358} color={BLUE} /><Link x1={357} y1={334} x2={357} y2={358} color={ORANGE} />
    <Genotype x={123} y={394} value="AAbb" color={BLUE} /><Genotype x={357} y={394} value="aaBB" color={ORANGE} />
    <He x={240} y={655} size={16} color={GREEN}>✓ כל שלבי שתי השושלות בעלי כושר תקין</He>
    <Link x1={153} y1={416} x2={216} y2={477} color={BLUE} /><Link x1={327} y1={416} x2={264} y2={477} color={ORANGE} />
    <La x={240} y={513} size={26} bold>AaBb</La><He x={240} y={541} size={16}>היבריד: מפגש ראשון של שני האללים</He>
    <La x={155} y={580} size={24} bold color={BLUE}>A</La><La x={325} y={580} size={24} bold color={ORANGE}>B</La>
    <path d="M176 570 H304 M233 562 L247 578 M233 578 L247 562" stroke={RED} strokeWidth={3} fill="none" />
    <He x={240} y={616} size={17} bold color={RED}>אי־התאמה בין גנים → כושר היבריד נמוך</He>
  </Panel>;
}
function SetBar({ x, y, colors, w = 110 }: { x: number; y: number; colors: string[]; w?: number }) {
  return <g>{colors.map((c, i) => <rect key={i} x={x + i * w / colors.length} y={y} width={w / colors.length - 2} height={20} rx={3} fill={c} />)}</g>;
}
export function HaplodiploidRelatedness() {
  const mat1 = [ORANGE, ORANGE, PURPLE, PURPLE], mat2 = [ORANGE, PURPLE, ORANGE, PURPLE];
  return <Panel h={660} label="הפלודיפלואידיה: אחיות מלאות חולקות את כל המחצית האבהית ובממוצע חצי מהמחצית האמהית; r שווה שלושה רבעים, לעומת חצי לצאצא ורבע לאח">
    <He x={240} y={28} size={19} bold>שתי אחיות: חצי מהאב, חצי מהאם</He>
    <He x={240} y={58} size={15}>הנחות: אב יחיד · הורים ללא קרבת משפחה</He>
    <He x={121} y={101} bold color={BLUE}>אב הפלואידי</He><He x={356} y={101} bold color={ORANGE}>מלכה דיפלואידית</He>
    <SetBar x={66} y={120} colors={[BLUE, BLUE, BLUE, BLUE]} />
    <SetBar x={301} y={120} colors={[ORANGE, ORANGE, ORANGE, ORANGE]} /><SetBar x={301} y={150} colors={[PURPLE, PURPLE, PURPLE, PURPLE]} />
    <He x={121} y={182} size={15}>מערכת כרומוזומים אחת</He><He x={356} y={204} size={15}>שתי מערכות כרומוזומים</He>
    <Link x1={121} y1={214} x2={121} y2={243} color={BLUE} /><Link x1={356} y1={224} x2={356} y2={243} color={ORANGE} />
    <He x={240} y={275} size={16}>כל בת מקבלת מערכת אחת מכל הורה</He>
    <He x={121} y={312} bold>בת 1</He><He x={356} y={312} bold>בת 2</He>
    <SetBar x={66} y={330} colors={[BLUE, BLUE, BLUE, BLUE]} /><SetBar x={301} y={330} colors={[BLUE, BLUE, BLUE, BLUE]} />
    <SetBar x={66} y={362} colors={mat1} /><SetBar x={301} y={362} colors={mat2} />
    <He x={240} y={414} size={16} color={BLUE}>כחול: אותה מערכת אבהית בכל האחיות</He>
    <La x={240} y={443} size={18}>½ × 1 = ½</La>
    <He x={240} y={477} size={16} color={ORANGE}>מצד האם: בממוצע חצי מהמקטעים זהים במוצא</He>
    <La x={240} y={506} size={18}>½ × ½ = ¼</La>
    <rect x={86} y={525} width={308} height={43} rx={12} fill="#eff6ff" />
    <La x={240} y={554} size={23} bold color={BLUE}>r(sisters) = ½ + ¼ = ¾</La>
    <He x={240} y={598} size={16}>בת ← צאצא שלה: ½ · אחות ← אח: ¼</He>
    <He x={240} y={630} size={14} color={MUTED}>המקטעים להמחשה; השיתוף האימהי הוא ממוצע</He>
    <He x={240} y={651} size={14} color={MUTED}>קרבה גבוהה לבדה אינה מסבירה חברתיות</He>
  </Panel>;
}
export function RnaWorld() {
  return <Panel h={765} label="השערת עולם ה-RNA: רצף נושא מידע והעתקה בזיווג בסיסים, וקיפול לריבוזים קטליטי; כיום חלוקת עבודה בין DNA RNA וחלבון, עם ליבת RNA קטליטית בריבוזום">
    <He x={240} y={28} size={20} bold>עולם ה־RNA: שתי יכולות במולקולה אחת</He>
    <He x={240} y={57} size={15} color={MUTED}>השערה על שלב קדום — תרשים סכמטי</He>
    <rect x={20} y={80} width={440} height={162} rx={16} fill="#eff6ff" />
    <He x={240} y={110} bold color={BLUE}>מידע: רצף שאפשר להעתיק לפי זיווג בסיסים</He>
    <La x={65} y={151} size={15}>5′</La><La x={414} y={151} size={15}>3′</La>
    {[..."AUGCAU"].map((b, i) => <g key={i}><La x={115 + i * 50} y={151} size={20} color={BLUE} bold>{b}</La><line x1={115 + i * 50} y1={163} x2={115 + i * 50} y2={178} stroke={LINE} strokeWidth={2} /><La x={115 + i * 50} y={204} size={20} color={GREEN} bold>{"UACGUA"[i]}</La></g>)}
    <La x={65} y={204} size={15}>3′</La><La x={414} y={204} size={15}>5′</La>
    <He x={240} y={230} size={14}>כחול: תבנית · ירוק: גדיל משלים</He>
    <rect x={20} y={259} width={440} height={171} rx={16} fill="#f5f3ff" />
    <He x={240} y={290} bold color={PURPLE}>קטליזה: קיפול יוצר ריבוזים עם אתר פעיל</He>
    <path d="M65 365 C35 316 133 300 139 332 C149 369 81 390 128 404 C171 421 214 361 184 337 C159 317 208 306 227 329 C245 353 210 397 247 403" fill="none" stroke={PURPLE} strokeWidth={5} strokeLinecap="round" />
    <circle cx={186} cy={359} r={10} fill="#fef3c7" stroke={ORANGE} strokeWidth={2} />
    <path d="M270 345 L294 345 M270 358 L294 358" stroke={GREEN} strokeWidth={4} />
    <Link x1={307} y1={351} x2={340} y2={351} />
    <path d="M357 345 L367 345 M381 358 L392 358" stroke={GREEN} strokeWidth={4} />
    <He x={325} y={401} size={14}>מצע → תוצרים</He>
    <Link x1={240} y1={443} x2={240} y2={470} />
    <He x={240} y={500} size={17} bold>חלוקת העבודה העיקרית כיום</He>
    <La x={90} y={540} size={24} bold color={BLUE}>DNA</La><Link x1={130} y1={532} x2={190} y2={532} />
    <La x={240} y={540} size={24} bold color={PURPLE}>RNA</La><Link x1={280} y1={532} x2={340} y2={532} />
    <He x={390} y={540} size={21} bold color={GREEN}>חלבון</He>
    <He x={90} y={571} size={14}>שמירת מידע</He><He x={240} y={571} size={14}>תיווך ובקרה</He><He x={390} y={571} size={14}>רוב הקטליזה</He>
    <He x={240} y={610} size={16} bold color={PURPLE}>שריד אפשרי: ליבת ה־RNA של הריבוזום</He>
    <path d="M168 689 C141 648 180 631 214 643 C253 614 306 644 308 680Z M168 706 Q239 742 308 706 L300 695 H176Z" fill="#e2e8f0" stroke={MUTED} strokeWidth={2} />
    <path d="M197 678 C209 656 224 691 239 669 S267 659 280 681" fill="none" stroke={PURPLE} strokeWidth={5} />
    <circle cx={241} cy={674} r={5} fill={ORANGE} />
    <He x={240} y={748} size={15}>יצירת הקשר הפפטידי מזורזת בידי RNA</He>
  </Panel>;
}
export function UpgmaTree() {
  const matrix = [[0, 2, 6, 10], [2, 0, 6, 10], [6, 6, 0, 8], [10, 10, 8, 0]];
  const Y = (height: number) => 682 - height * 33;
  return <Panel h={760} label="UPGMA עבור מטריצת התרגיל: AB שתיים, AC ו-BC שש, AD ו-BD עשר, CD שמונה. שלושה איחודים בגבהים 1, 3 ו-14 חלקי 3; העץ הוא (((A,B),C),D)">
    <He x={240} y={28} size={20} bold>מהמטריצה לעץ — שלושה איחודים</He>
    <He x={240} y={57} size={15}>מרחק = אחוז הבדלים ברצף, כמו בתרגיל</He>
    {["A", "B", "C", "D"].map((name, i) => <g key={name}><La x={165 + i * 64} y={94} bold>{name}</La><La x={103} y={128 + i * 32} bold>{name}</La></g>)}
    {matrix.map((row, i) => row.map((n, j) => <g key={`${i}-${j}`}><rect x={138 + j * 64} y={105 + i * 32} width={54} height={28} rx={5} fill={i === j ? "#f1f5f9" : n === 2 ? "#dbeafe" : "#f8fafc"} /><La x={165 + j * 64} y={125 + i * 32} color={n === 2 ? BLUE : INK} bold={n === 2}>{i === j ? "–" : n}</La></g>))}
    <He x={240} y={273} size={17} bold color={BLUE}>1 · הזוג הקרוב ביותר: A ו־B</He>
    <La x={240} y={302} size={17}>d(A,B) = 2 → h(AB) = 1</La>
    <He x={240} y={343} size={17} bold color={GREEN}>2 · מצרפים את C לקבוצת AB</He>
    <La x={240} y={372} size={17}>d(AB,C) = (6 + 6)/2 = 6 → h = 3</La>
    <La x={240} y={399} size={15}>d(AB,D) = 10; d(C,D) = 8</La>
    <He x={240} y={440} size={17} bold color={ORANGE}>3 · מצרפים את D: ממוצע לפי שלושה מינים</He>
    <La x={240} y={469} size={17}>d(ABC,D) = (10 + 10 + 8)/3 = 28/3</La>
    <La x={240} y={497} size={17}>h(root) = (28/3)/2 = 14/3 ≈ 4.67</La>
    <path d={`M100 682 V${Y(1)} H190 V682 M145 ${Y(1)} V${Y(3)} H280 V682 M212.5 ${Y(3)} V${Y(14 / 3)} H390 V682`} fill="none" stroke={INK} strokeWidth={3} />
    <circle cx={145} cy={Y(1)} r={4} fill={BLUE} /><circle cx={212.5} cy={Y(3)} r={4} fill={GREEN} /><circle cx={301.25} cy={Y(14 / 3)} r={4} fill={ORANGE} />
    <La x={74} y={Y(1) + 5} size={16} color={BLUE}>1</La><La x={112} y={Y(3) + 5} size={16} color={GREEN}>3</La><La x={167} y={Y(14 / 3) + 5} size={16} color={ORANGE}>4.67</La>
    {[100, 190, 280, 390].map((x, i) => <La key={x} x={x} y={706} bold size={17}>{"ABCD"[i]}</La>)}
    <He x={240} y={733} size={14}>גובה צומת = חצי ממרחק האיחוד · שעון אחיד</He>
    <He x={240} y={754} size={13} color={MUTED}>העץ הוא קירוב; מטריצת הקלט אינה אולטרמטרית בדיוק</He>
  </Panel>;
}
function Embryo({ x, y, color, variant }: { x: number; y: number; color: string; variant: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${variant})`}>
    <path d="M-6 -29 C-31 -33 -39 -12 -27 0 C-18 9 -4 6 -6 20 C-8 35 -23 40 -29 29 C-29 50 10 42 16 20 C24 -4 11 -19 -6 -29Z" fill={color} fillOpacity={.15} stroke={color} strokeWidth={2.5} />
    <circle cx={-19} cy={-15} r={3} fill={color} />
    <path d="M-13 -1 l9 -4 M-10 6 l10 -4 M-7 13 l10 -4 M2 13 l8 4 M0 21 l8 4 M-3 29 l7 3" stroke={color} strokeWidth={1.8} />
  </g>;
}
export function EmbryoHourglass() {
  return <Panel h={685} label="מודל שעון החול בשלוש שושלות חולייתנים: דג, עוף ויונק. שלבים מוקדמים שונים, דמיון מרבי יחסי בתקופה הפילוטיפית, ושונות מאוחרת. צלליות מקוריות סכמטיות; רעיון הרקפיטולציה של הקל נדחה">
    <He x={240} y={29} size={21} bold>שעון החול ההתפתחותי</He>
    <He x={240} y={58} size={15}>רוחב שעון החול מייצג שונות בין שושלות</He>
    <path d="M38 88 C46 197 120 230 127 333 C123 431 49 468 38 567 H442 C431 468 357 431 353 333 C360 230 434 197 442 88Z" fill="#f1f5f9" stroke={LINE} strokeWidth={2} />
    <He x={130} y={115} bold color={BLUE}>דג</He><He x={240} y={115} bold color={GREEN}>עוף</He><He x={350} y={115} bold color={PURPLE}>יונק</He>
    <g fill="#dbeafe" stroke={BLUE} strokeWidth={2}><ellipse cx={130} cy={164} rx={32} ry={25} /><path d="M107 149 Q130 128 153 149 L153 157 H107Z" fill={BLUE} /></g>
    <g stroke={GREEN} strokeWidth={2}><ellipse cx={240} cy={168} rx={34} ry={13} fill="#dcfce7" /><ellipse cx={240} cy={153} rx={23} ry={6} fill={GREEN} /></g>
    <g fill="#ede9fe" stroke={PURPLE} strokeWidth={2}>{[[338, 150], [360, 150], [338, 172], [360, 172]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={12} />)}</g>
    <He x={240} y={215} size={17} bold>מוקדם: שונות גבוהה</He>
    <He x={240} y={241} size={15}>חלוקות וגסטרולציה</He>
    <Embryo x={171} y={330} color={BLUE} variant={-9} /><Embryo x={250} y={330} color={GREEN} variant={0} /><Embryo x={326} y={330} color={PURPLE} variant={10} />
    <He x={240} y={397} size={17} bold>אמצע: דמיון יחסי מרבי</He>
    <He x={240} y={424} size={15}>התקופה הפילוטיפית / פרינגולה</He>
    <g transform="translate(124 503)" stroke={BLUE} strokeWidth={2} fill="#dbeafe"><path d="M-34 0 Q-4 -29 25 -2 L43 -18 V18 L25 3 Q-3 28 -34 0Z" /><circle cx={-18} cy={-4} r={3} fill={BLUE} /></g>
    <g transform="translate(240 504)" stroke={GREEN} strokeWidth={2} fill="#dcfce7"><path d="M-25 11 Q-36 -16 -16 -19 Q-4 -37 9 -21 L24 -15 L12 -10 Q37 21 4 23 L-9 34 L-12 20Z" /><circle cx={3} cy={-22} r={2} fill={GREEN} /></g>
    <g transform="translate(354 508)" stroke={PURPLE} strokeWidth={2} fill="#ede9fe"><path d="M-31 5 Q-30 -21 -7 -16 Q5 -32 22 -13 L32 -4 L18 1 Q15 23 -7 20 L-18 29 L-21 14 Q-45 27 -44 8" /><circle cx={11} cy={-22} r={9} /><circle cx={22} cy={-11} r={2} fill={PURPLE} /></g>
    <He x={240} y={596} size={17} bold>מאוחר: התמיינות ושונות מחודשת</He>
    <He x={240} y={631} size={15} color={RED}>הרקפיטולציה של הקל נדחתה</He>
    <He x={240} y={657} size={14}>עובר אינו עובר דרך הצורות הבוגרות של אבותיו</He>
    <He x={240} y={679} size={13} color={MUTED}>שלבי מפתח סכמטיים; לא קנה מידה או זמן אחידים</He>
  </Panel>;
}
