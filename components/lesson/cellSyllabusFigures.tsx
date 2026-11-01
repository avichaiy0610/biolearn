/* Original textbook-informed drawings. See visual-lab/cell-2024-gaps/learning-card.md. */
import type React from "react";
import { He, La, BLUE, GREEN, INK, MUTED, ORANGE } from "./biochemFigures";

const PURPLE = "#7c3aed", RED = "#b91c1c", PALE = "#f1f5f9";
function Frame({ h, label, children }: { h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 420 ${h}`} role="img" aria-label={label} className="w-full h-auto">
    <rect width={420} height={h} rx={12} fill="white" />
    {children}
  </svg>;
}
function Edge({ d, c = INK, inhibit = false }: { d: string; c?: string; inhibit?: boolean }) {
  // Explicit terminal symbols avoid shared marker IDs when figures are rendered together.
  const nums = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number), x = nums.at(-2)!, y = nums.at(-1)!;
  const px = nums.at(-4)!, py = nums.at(-3)!, a = Math.atan2(y - py, x - px) * 180 / Math.PI;
  return <g><path d={d} stroke={c} strokeWidth={1.8} fill="none" />
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      {inhibit ? <path d="M0 -6 V6" stroke={c} strokeWidth={2.5} /> : <path d="M-7 -4 L0 0 L-7 4" stroke={c} strokeWidth={1.8} fill="none" />}
    </g></g>;
}
function Node({ x, y, w = 124, t, c = BLUE }: { x: number; y: number; w?: number; t: string; c?: string }) {
  return <g><rect x={x-w/2} y={y-17} width={w} height={34} rx={10} fill={PALE} stroke={c} strokeWidth={1.5} /><La x={x} y={y+5} size={15} bold color={c}>{t}</La></g>;
}
function Lipids({ y, x = 42, w = 336, gap = false }: { y: number; x?: number; w?: number; gap?: boolean }) {
  return <g>{Array.from({ length: Math.floor(w/12) }, (_, i) => x+i*12).filter(v=>!gap||v<x+w/2-18||v>x+w/2+18).map(v=><g key={v}>
    <path d={`M${v-2} ${y+4} v13 M${v+2} ${y+4} v13 M${v-2} ${y+32} v-13 M${v+2} ${y+32} v-13`} stroke="#94a3b8" strokeWidth={1.2} />
    <circle cx={v} cy={y} r={3.4} fill="#cbd5e1" /><circle cx={v} cy={y+36} r={3.4} fill="#cbd5e1" />
  </g>)}</g>;
}

export function ApoptosisPathways() {
  return <Frame h={1125} label="אפופטוזיס: Fas ו-DISC מפעילים קספאזה 8; עקה, BH3 ו-Bax/Bak גורמים ל-MOMP ולאפופטוזום המפעיל קספאזה 9. שני המסלולים מתכנסים לקספאזות 3 ו-7; Bid מחבר ביניהם ו-Smac מסיר עיכוב של XIAP.">
    <He x={210} y={27} size={19} bold>שני מסלולים, מפל ביצוע משותף</He>
    <He x={210} y={53} size={15} bold color={BLUE}>המסלול החיצוני: דוגמת Fas</He>
    <Lipids y={124} />
    {[158,190,222].map(x=><g key={x}>
      <path d={`M${x-10} 94 Q${x} 81 ${x+10} 94 L${x+7} 119 L${x+5} 165 L${x-5} 165 L${x-7} 119 Z`} fill="#ddd6fe" stroke={PURPLE} strokeWidth={1.5} />
      <rect x={x-7} y={171} width={14} height={17} rx={4} fill={ORANGE} />
      <path d={`M${x} 188 V204`} stroke={INK} strokeWidth={1.5} />
    </g>)}
    <path d="M140 78 Q190 59 240 78 L228 89 Q190 77 152 89 Z" fill="#fed7aa" stroke={ORANGE} strokeWidth={1.5} />
    <La x={292} y={84} size={15} bold color={ORANGE}>FasL</La>
    <La x={292} y={111} size={15} bold color={PURPLE}>Fas</La>
    <La x={292} y={187} size={15} bold color={ORANGE}>FADD</La>
    <He x={85} y={111} size={13} color={MUTED}>חוץ</He><He x={85} y={182} size={13} color={MUTED}>ציטוזול</He>
    <rect x={132} y={166} width={115} height={94} rx={14} fill="none" stroke={MUTED} strokeWidth={1.2} strokeDasharray="4 4" />
    <Node x={190} y={228} w={100} t="caspase-8" c={PURPLE} />
    <La x={294} y={239} size={15} bold>DISC</La>
    <Edge d="M140 241 L28 241 L28 947 L125 947 L125 970" c={PURPLE} />
    <Edge d="M190 247 L190 266 L125 266 L125 284" />
    <La x={125} y={306} size={15}>Bid</La><Edge d="M145 301 L217 301" /><La x={254} y={306} size={15} bold color={GREEN}>tBid</La>
    <He x={210} y={337} size={13} color={MUTED}>חיתוך Bid מחבר אל המיטוכונדריה</He>
    <Edge d="M282 301 L395 301 L395 525 L329 525" c={GREEN} />
    <He x={215} y={378} size={15} bold color={GREEN}>המסלול הפנימי: עקה בתא</He>
    <Node x={265} y={410} t="DNA / ER stress" c={GREEN} />
    <Edge d="M265 429 L265 448" c={GREEN} /><Node x={265} y={469} t="BH3-only" c={GREEN} />
    <Node x={105} y={469} w={90} t="Bcl-2" c={RED} />
    <Edge d="M201 469 L158 469" c={RED} inhibit />
    <Edge d="M265 488 L265 506" c={GREEN} /><Node x={265} y={525} t="Bax / Bak" c={GREEN} />
    <Edge d="M105 488 L105 525 L194 525" c={RED} inhibit />
    <Edge d="M265 544 L265 566" c={GREEN} />
    {/* MOMP is an opening in the outer membrane; cristae remain inside. */}
    <path d="M248 583 C185 558 94 576 82 619 C65 678 156 704 243 675 C278 664 288 627 273 599" fill="#f8fafc" stroke={MUTED} strokeWidth={2.5} />
    <path d="M235 600 C200 584 122 591 106 618 C92 641 119 664 145 655 Q156 651 148 625 Q147 612 164 614 L171 653 Q183 669 193 648 L191 618 Q202 606 212 617 L218 649 Q249 639 246 618" fill="none" stroke="#94a3b8" strokeWidth={3} />
    {[118,137,168,211].map((x,i)=><circle key={x} cx={x} cy={i%2?679:588} r={4} fill={ORANGE} />)}
    <path d="M247 581 l9 9 M268 593 l9 9" stroke={GREEN} strokeWidth={8} />
    <La x={333} y={579} size={15} bold color={GREEN}>MOMP</La>
    <He x={170} y={721} size={13} color={MUTED}>הממברנה החיצונית נעשית חדירה</He>
    <Edge d="M276 611 L333 611 L333 646" c={ORANGE} />
    <Node x={333} y={668} w={116} t="cytochrome c" c={ORANGE} />
    <Edge d="M333 687 L333 749 L286 749" />
    <La x={213} y={754} size={15} bold>Apaf1 + dATP</La>
    <Edge d="M213 766 L213 785" />
    <g transform="translate(213 825)">
      {Array.from({length:7},(_,i)=><g key={i} transform={`rotate(${i*360/7})`}><path d="M0 -8 L0 -31" stroke={PURPLE} strokeWidth={7} /><ellipse cx={0} cy={-37} rx={9} ry={12} fill="#ddd6fe" stroke={PURPLE} strokeWidth={1.4} /></g>)}
      <circle r={10} fill="#fef3c7" stroke={ORANGE} strokeWidth={1.5} />
    </g>
    <He x={322} y={821} size={14} bold>אפופטוזום</He><He x={322} y={843} size={13} color={MUTED}>שבע יחידות</He>
    <Edge d="M213 878 L213 893" /><Node x={213} y={914} t="caspase-9" c={PURPLE} />
    <Edge d="M213 933 L213 954" /><Node x={213} y={976} w={174} t="caspase-3 / 7" c={PURPLE} />
    {/* Smac leaves via the same outer-membrane opening. */}
    <Edge d="M273 602 L404 602 L404 858 L359 858 L359 865" c={GREEN} />
    <Node x={359} y={888} w={70} t="Smac" c={GREEN} />
    <Edge d="M359 907 L359 922" c={RED} inhibit /><Node x={359} y={945} w={70} t="XIAP" c={RED} />
    <Edge d="M359 964 L359 976 L308 976" c={RED} inhibit />
    <Edge d="M213 995 L213 1011" /><He x={210} y={1034} size={15} bold>חיתוך חלבוני מטרה</He>
    <La x={210} y={1059} size={15}>PARP · ICAD → CAD · lamins</La>
    <He x={210} y={1082} size={13}>עיכוב תיקון · חיתוך DNA · פירוק מעטפת</He>
    <He x={210} y={1110} size={12} color={MUTED}>חץ: הפעלה או מעבר; קו עצירה אדום: עיכוב</He>
  </Frame>;
}

function Cohesin({ x, y, protectedRing = false }: { x: number; y: number; protectedRing?: boolean }) {
  return <g>{protectedRing&&<ellipse cx={x} cy={y} rx={14} ry={28} fill="#ede9fe" />}
    <ellipse cx={x} cy={y} rx={9} ry={23} fill="none" stroke={GREEN} strokeWidth={3} />
    {protectedRing&&<path d={`M${x-15} ${y-29} Q${x} ${y-41} ${x+15} ${y-29}`} fill="none" stroke={PURPLE} strokeWidth={5} />}</g>;
}
function Dyad({ x, y, color, protect = true, arm = false }: { x: number; y: number; color: string; protect?: boolean; arm?: boolean }) {
  return <g><path d={`M${x-48} ${y-10} H${x+48} M${x-48} ${y+10} H${x+48}`} stroke={color} strokeWidth={8} strokeLinecap="round" />
    <Cohesin x={x} y={y} protectedRing={protect} />{arm&&<Cohesin x={x+34} y={y} />}
    <rect x={x-8} y={y-16} width={5} height={7} rx={2} fill={INK} /><rect x={x-8} y={y+9} width={5} height={7} rx={2} fill={INK} />
  </g>;
}
export function MeiosisCohesin() {
  return <Frame h={866} label="זוג הומולוגים עם כיאזמה. במיוזה I הקינטוכורים האחיות פונים לאותו קוטב, קוהזין הזרועות נחתך וקוהזין הצנטרומר מוגן בשוגושין. במיוזה II הגנת שוגושין מוסרת, הקוהזין הצנטרומרי נחתך והאחיות נפרדות.">
    <He x={210} y={28} size={19} bold>קוהזין משתחרר בשתי פעימות</He>
    <He x={210} y={59} size={16} bold>מטאפאזה I: זוג הומולוגים אחד</He>
    <circle cx={35} cy={151} r={7} fill={MUTED} /><circle cx={385} cy={151} r={7} fill={MUTED} />
    <path d="M42 151 L110 136 M42 151 L130 136 M378 151 L290 136 M378 151 L310 136" stroke="#94a3b8" strokeWidth={1.8} />
    <path d="M110 116 V240 M130 116 V160 C130 180 290 210 290 240" stroke={BLUE} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d="M310 116 V240 M290 116 V160 C290 180 130 210 130 240" stroke={ORANGE} strokeWidth={8} fill="none" strokeLinecap="round" />
    <g transform="translate(120 145) rotate(90)"><Cohesin x={0} y={0} protectedRing /></g>
    <g transform="translate(300 145) rotate(90)"><Cohesin x={0} y={0} protectedRing /></g>
    <g transform="translate(120 227) rotate(90)"><Cohesin x={0} y={0} /></g>
    <g transform="translate(300 227) rotate(90)"><Cohesin x={0} y={0} /></g>
    {[110,130,290,310].map(x=><rect key={x} x={x-4} y={132} width={8} height={6} fill={INK} />)}
    <He x={210} y={97} size={13} color={MUTED}>קינטוכורים אחיות: חיבור לאותו קוטב</He>
    <He x={210} y={259} size={14}>כיאזמה בין כרומטידות לא־אחיות</He>
    <Edge d="M210 243 L210 198" c={MUTED} />
    <He x={210} y={302} size={16} bold>אנאפאזה I: ההומולוגים נפרדים</He>
    <He x={210} y={327} size={14} color={RED}>ספרז חותך קוהזין בזרועות</He>
    <Dyad x={108} y={390} color={BLUE} /><Dyad x={312} y={390} color={ORANGE} />
    <Edge d="M82 355 L45 355" c={BLUE} /><Edge d="M338 355 L375 355" c={ORANGE} />
    <He x={210} y={444} size={14}>קוהזין צנטרומרי נשמר</He>
    <He x={210} y={468} size={14} color={PURPLE}>שוגושין מגייס PP2A ומגן עליו מחיתוך</He>
    <He x={210} y={514} size={16} bold>מיוזה II: האחיות נפרדות</He>
    <He x={210} y={539} size={14} color={RED}>ההגנה מוסרת; קוהזין צנטרומרי נחתך</He>
    {/* Both daughter cells are shown, each with one homolog; opposite attachment of sisters. */}
    {[108,312].map((x,i)=><g key={x}>
      <rect x={x-88} y={560} width={176} height={173} rx={55} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={1.5} />
      <circle cx={x} cy={577} r={5} fill={MUTED} /><circle cx={x} cy={715} r={5} fill={MUTED} />
      <path d={`M${x} 582 L${x} 602 M${x} 710 L${x} 690`} stroke={MUTED} strokeWidth={1.6} />
      <path d={`M${x-44} 607 H${x+44} M${x-44} 685 H${x+44}`} stroke={i?ORANGE:BLUE} strokeWidth={8} strokeLinecap="round" />
      <rect x={x-4} y={598} width={8} height={6} fill={INK} /><rect x={x-4} y={688} width={8} height={6} fill={INK} />
      <Edge d={`M${x+24} 638 L${x+24} 621`} c={i?ORANGE:BLUE} /><Edge d={`M${x+24} 654 L${x+24} 673`} c={i?ORANGE:BLUE} />
    </g>)}
    <He x={210} y={761} size={14}>אין שכפול DNA בין שתי החלוקות</He>
    <He x={210} y={791} size={13} color={MUTED}>כחול וכתום: שני הומולוגים; שחור: קינטוכור</He>
    <He x={210} y={814} size={13} color={GREEN}>טבעת ירוקה: קוהזין</He>
    <He x={210} y={837} size={13} color={PURPLE}>קשת סגולה: שוגושין–PP2A</He>
    <He x={210} y={859} size={12} color={MUTED}>סכמטי; צבעי ההומולוגים מציינים מוצא צנטרומרי</He>
  </Frame>;
}

const PROFILE_DATA = [
  { title: "ללא טיפול", parts: [60,25,15,0], color: BLUE },
  { title: "נוקודזול · 16 שעות", parts: [10,10,80,0], color: PURPLE },
  { title: "מעכב RhoA · 24 שעות", parts: [35,15,35,15], color: ORANGE },
];
function Histogram({ parts, color, phaseLabels }: { parts: number[]; color: string; phaseLabels: boolean }) {
  // Discrete equal-width bins. Each component is normalized independently: areas, not peak heights, encode the supplied percentages.
  const bins = Array.from({length:161},(_,i)=>1+i*8/160), g=(x:number,m:number,s:number)=>Math.exp(-0.5*((x-m)/s)**2);
  const weights=[bins.map(x=>g(x,2,.11)),bins.map(x=>x>2.2&&x<3.8?1:0),bins.map(x=>g(x,4,.15)),bins.map(x=>g(x,8,.18))];
  const sums=weights.map(w=>w.reduce((a,b)=>a+b,0));
  const values=bins.map((_,i)=>weights.reduce((a,w,j)=>a+parts[j]*w[i]/sums[j],0));
  const sx=(x:number)=>54+(x-1)*38, sy=(v:number)=>150-v*9;
  return <g>
    <He x={210} y={22} size={12} color={MUTED}>מספר תאים יחסי · צירים זהים בכל הטיפולים</He>
    <path d="M54 41 V150 H376" fill="none" stroke={INK} strokeWidth={1.5} />
    {bins.map((x,i)=><rect key={i} x={sx(x)} y={sy(values[i])} width={2.2} height={values[i]*9} fill={color} opacity={.75} />)}
    {[2,4,8].map(n=><g key={n}><path d={`M${sx(n)} 151 V157`} stroke={INK} strokeWidth={1.2} /><La x={sx(n)} y={175} size={14}>{n}C</La></g>)}
    {phaseLabels ? <><La x={sx(2)} y={193} size={12}>G1</La><La x={sx(3)} y={193} size={12}>S</La><La x={sx(4)} y={193} size={12}>G2/M</La></> : <He x={210} y={193} size={12} color={MUTED}>זיהוי שלב המחזור דורש סמן נוסף</He>}
    <He x={210} y={218} size={13}>תוכן DNA לתא</He>
  </g>;
}
export function FacsDnaProfile() {
  return <Frame h={1000} label="שלוש היסטוגרמות DNA בעלות צירים משותפים: ללא טיפול 60/25/15 אחוז ב-G1/S/G2-M; נוקודזול 10/10/80; מעכב RhoA 35/15/35 ועוד 15 אחוז ב-8C. תוכן DNA לבדו אינו מפריד בין G2 למיטוזה.">
    <He x={210} y={28} size={19} bold>תוכן DNA: היכן התאים מצטברים?</He>
    {PROFILE_DATA.map(({title,parts,color},i)=><g key={title} transform={`translate(0 ${48+i*285})`}>
      <He x={210} y={18} size={16} color={color} bold>{title}</He>
      <g transform="translate(0 30)"><Histogram parts={parts} color={color} phaseLabels={i===0} /></g>
      <La x={210} y={272} size={13} bold color={color}>{`2C: ${parts[0]}% · 2–4C: ${parts[1]}% · 4C: ${parts[2]}% · 8C: ${parts[3]}%`}</La>
    </g>)}
    <He x={210} y={933} size={14} bold>פסגת 4C לבדה אינה מבדילה בין G2 ל־M</He>
    <He x={210} y={958} size={13}>נדרש סמן נוסף, למשל היסטון H3 מזורחן</He>
    <He x={210} y={983} size={12} color={MUTED}>C: כמות DNA; n: מספר מערכות כרומוזומים</He>
  </Frame>;
}

function Antibody({ x,y,color=BLUE,tag=false,angle=0 }: { x:number;y:number;color?:string;tag?:boolean;angle?:number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M0 16 V0 L-10 -12 M0 0 L10 -12" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    {tag&&<><circle cx={-10} cy={-15} r={4.5} fill="#22c55e" /><circle cx={10} cy={-15} r={4.5} fill="#22c55e" /></>}
  </g>;
}
function MiniCell({ x,y,stage }: {x:number;y:number;stage:number}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-45 12 C-49 -20 -15 -37 14 -30 C49 -30 58 4 39 26 C21 40 -29 37 -45 12 Z" fill="#f8fafc" stroke={MUTED} strokeWidth={2} strokeDasharray={stage===1?"7 5":undefined} />
    <ellipse cx={-15} cy={7} rx={14} ry={17} fill={stage>=5?"#bfdbfe":"#e2e8f0"} stroke={stage>=5?BLUE:MUTED} strokeWidth={1.5} />
    <path d="M10 20 Q32 8 19 -14" stroke={stage===6?GREEN:ORANGE} strokeWidth={5} fill="none" />
    {stage===2&&[-28,0,30].map(a=><circle key={a} cx={a} cy={-21} r={4} fill="#e9d5ff" />)}
    {stage>=3&&<Antibody x={24} y={-2} angle={-60} />}
    {stage>=4&&<><Antibody x={30} y={-21} angle={-20} color={PURPLE} tag /><Antibody x={49} y={0} angle={80} color={PURPLE} tag /></>}
  </g>;
}
export function ImmunofluorescenceSteps() {
  const steps=[['קיבוע','שימור המבנה בפורמלדהיד'],['פרמאביליזציה','פתיחת גישה לאפיטופים פנימיים'],['חסימה','הפחתת קישור לא־ספציפי'],['נוגדן ראשוני','זיהוי חלבון המטרה'],['נוגדן משני מסומן','כמה נוגדנים משניים לכל ראשוני'],['צביעת DAPI','סימון DNA בגרעין'],['צילום','ערוץ חלבון וערוץ גרעין']];
  return <Frame h={1250} label="אימונופלואורסצנציה עקיפה: קיבוע, פרמאביליזציה, חסימה, נוגדן ראשוני, משני פלואורסצנטי שמגביר אות, DAPI וצילום. בהשוואת טופולוגיה חלבון N בחוץ C בפנים: ללא פרמאביליזציה רק N מזוהה; עם פרמאביליזציה שני הקצוות נגישים.">
    <He x={210} y={28} size={19} bold>מנוגדן לתמונה: צביעה עקיפה</He>
    {steps.map(([title,sub],i)=><g key={title} transform={`translate(0 ${55+i*112})`}>
      <circle cx={385} cy={20} r={13} fill={BLUE} /><La x={385} y={25} color="white" size={14} bold>{i+1}</La>
      <He x={235} y={23} size={16} bold>{title}</He><He x={235} y={49} size={13} color={MUTED}>{sub}</He>
      <MiniCell x={76} y={35} stage={i} />
      {i<6&&<Edge d="M235 69 L235 91" c={MUTED} />}
    </g>)}
    <He x={210} y={857} size={13}>שוטפים אחרי הדגרות הנוגדנים ולפני הצילום</He>
    <He x={210} y={895} size={16} bold>חלונית טופולוגיה: N בחוץ, C בפנים</He>
    {[false,true].map((permeable,i)=><g key={i} transform={`translate(${i*200} 920)`}>
      <He x={110} y={18} size={14} bold>{permeable?'עם פרמאביליזציה':'בלי פרמאביליזציה'}</He>
      <Lipids x={28} w={170} y={115} gap={permeable} />
      <path d="M110 75 V180" stroke={ORANGE} strokeWidth={9} strokeLinecap="round" />
      <La x={132} y={85} size={15} bold color={ORANGE}>N</La><La x={132} y={185} size={15} bold color={ORANGE}>C</La>
      <Antibody x={100} y={64} color={BLUE} tag />
      {permeable&&<Antibody x={97} y={194} color={PURPLE} angle={180} tag />}
      <He x={53} y={91} size={12} color={MUTED}>חוץ</He><He x={50} y={181} size={12} color={MUTED}>פנים</He>
      <La x={110} y={242} size={15} bold>{permeable?'N: +   C: +':'N: +   C: −'}</La>
    </g>)}
    <He x={210} y={1198} size={13}>בלי פתיחה: נוגדנים מגיעים רק לאפיטופים חיצוניים</He>
    <He x={210} y={1223} size={12} color={MUTED}>הנוגדנים בחלונית מסומנים ישירות לשם פשטות</He>
    <He x={210} y={1244} size={12} color={MUTED}>סכמטי, לא בקנה מידה; כתום: חלבון, ירוק: פלואורופור</He>
  </Frame>;
}

export const CELL_SYLLABUS_FIGURES: Record<string, {el:()=>React.ReactElement;captionHe:string}> = {
  "apoptosis-pathways": {el:ApoptosisPathways,captionHe:"מסלול Fas–FADD–DISC והמסלול המיטוכונדריאלי מתכנסים לקספאזות 3 ו־7. BH3-only מנטרלים Bcl-2 וחלקם מפעילים Bax/Bak ישירות; tBid מגביר את הקשר בין המסלולים. Smac יוצא דרך MOMP ומנטרל XIAP, נציג ממשפחת IAP שמעכב קספאזות 9, 3 ו־7. TNFR1 אינו מיוצג: קומפלקסי האיתות שלו שונים מ־Fas. למינים נחתכים בעיקר בידי קספאזה־6 במפל הביצוע. סכמטי, לא בקנה מידה."},
  "meiosis-cohesin": {el:MeiosisCohesin,captionHe:"זוג הומולוגים אחד וארבע כרומטידות: כיאזמה וקוהזין בזרועות מחזיקים את ההומולוגים עד אנאפאזה I. הקוהזין הצנטרומרי מוגן בידי שוגושין–PP2A ונשמר עד מיוזה II. שני תאי הבת מוצגים בחלוקה השנייה. מוצג חיבור מקומי אחד לכל קינטוכור, ללא כל סיבי הכישור; הצבע מציין מוצא צנטרומרי, ואינו ממפה מקטעים לאחר שחלוף. סכמטי."},
  "facs-dna-profile": {el:FacsDnaProfile,captionHe:"נתוני התרגיל facs-profiles: ללא טיפול 60/25/15; נוקודזול 10/10/80; מעכב RhoA ‏35/15/35/15 (האחרון ב־8C). אחוזים הם שטחי רכיבי ההתפלגות, לא גובה הפסגות. צורות הפסגות סכמטיות, בצירים משותפים; אינן מדידה ניסויית. נוקודזול פוגע בכישור; כשל ציטוקינזיס בעקבות עיכוב RhoA יכול להוביל לשכפול נוסף ול־8C. אחרי כשל כזה, 4C עשוי להיות גם תא דו־גרעיני שחזר ל־G1. נדרשים סינון צברי תאים וסמן מיטוטי להסקה."},
  "immunofluorescence-steps": {el:ImmunofluorescenceSteps,captionHe:"דוגמה לצביעה עקיפה בתאים שקובעו בפורמלדהיד: פרמאביליזציה, חסימה, ראשוני, שטיפה, משני מסומן, שטיפה, DAPI וצילום. כמה משניים יכולים להיקשר לראשוני ולהגביר את האות. בחלונית הטופולוגיה קצה N חוץ־תאי וקצה C ציטוזולי: רק לאחר פתיחת הממברנה שני הקצוות נגישים לנוגדנים. קיבוע במתנול עשוי גם לבצע פרמאביליזציה, ולכן נדרש קיבוע שמשמר ממברנה לביקורת ללא פרמאביליזציה. סכמטי."},
};
