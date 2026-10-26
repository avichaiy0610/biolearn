/* Original figures for Technion 136088. References, calculations and visual checks: visual-lab/human-genetics/learning-card.md. */
import type React from "react";
import { BLUE, GREEN, INK, MUTED, ORANGE, He as StandardHe, La } from "./biochemFigures";

function He(props: React.ComponentProps<typeof StandardHe>) {const children=typeof props.children==='string'?props.children.replace(/([A-Za-z][A-Za-z0-9_.′'⁻⁺₀-₉–−-]*)/g,'\u2066$1\u2069'):props.children;return <StandardHe {...props}>{children}</StandardHe>;}
const VLINE = "#cbd5e1", VPURPLE = "#7c3aed";
function VFig({h, label, children}: {h:number; label:string; children:React.ReactNode}) { return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}><title>{label}</title>{children}</svg>; }
function VRule({y}: {y:number}) {return <line x1={24} x2={456} y1={y} y2={y} stroke={VLINE}/>;}
function VBackbone({y,start,end,gaps,width=3}: {y:number;start:number;end:number;gaps:[number,number][];width?:number}) {
  const segments:[number,number][]=[]; let cursor=start;
  for(const [left,right] of [...gaps].sort((a,b)=>a[0]-b[0])) { if(left>cursor) segments.push([cursor,Math.min(left,end)]); cursor=Math.max(cursor,right); }
  if(cursor<end)segments.push([cursor,end]);
  return <g>{segments.filter(([a,b])=>b>a).map(([a,b],i)=><line key={i} x1={a} x2={b} y1={y} y2={y} stroke={VLINE} strokeWidth={width}/>)}</g>;
}
function VArrow({x1,y1,x2,y2,color=INK}: {x1:number;y1:number;x2:number;y2:number;color?:string}) {
  const a=Math.atan2(y2-y1,x2-x1), s=7;
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2}/><path d={`M${x2-s*Math.cos(a-.48)} ${y2-s*Math.sin(a-.48)}L${x2} ${y2}L${x2-s*Math.cos(a+.48)} ${y2-s*Math.sin(a+.48)}`} fill="none" stroke={color} strokeWidth={2}/></g>;
}
function VBox({x,y,w=54,h=28,fill=BLUE,label}: {x:number;y:number;w?:number;h?:number;fill?:string;label?:string}) {return <g><rect x={x} y={y} width={w} height={h} rx={4} fill={fill}/>{label&&<La x={x+w/2} y={y+h/2+5} color="white" size={15}>{label}</La>}</g>;}
function VDNA({y,seq,mut=-1}: {y:number;seq:string;mut?:number}) {return <g>{seq.split("").map((b,i)=><g key={i}><rect x={88+i*35} y={y-21} width={29} height={29} rx={4} fill={i===mut?ORANGE:"#eff6ff"} stroke={i===mut?ORANGE:VLINE}/><La x={102+i*35} y={y} size={16} color={i===mut?"white":BLUE}>{b}</La></g>)}</g>;}

function VClasses(){return <VFig h={770} label="סוגי וריאנטים וסקלת גודל: בסיס בודד, indel קצר, CNV והיפוך גדול והרחבת חזרות">
  <He x={240} y={28} bold size={17}>אותו גנום — כמה סוגים של שינוי</He>
  <He x={240} y={57} color={MUTED}>הסוג והגודל הם צירים שונים; הקבוצות חופפות</He>
  <He x={240} y={86} size={14}>סקלת גודל לוגריתמית: כל צעד גדול פי אלף</He>
  <line x1={70} x2={410} y1={112} y2={112} stroke={INK}/>{[70,240,410].map((x,i)=><g key={x}><line x1={x} x2={x} y1={106} y2={118} stroke={INK}/><La x={x} y={141} size={14}>{["1 bp","1 kb","1 Mb"][i]}</La></g>)}
  <He x={240} y={168} size={14} color={MUTED}>גודל ≠ חומרה; החזרות עשויות להשתייך לכמה גדלים</He>
  <g transform="translate(0 110)">
  <La x={240} y={88} bold>SNV · 1 bp</La><VDNA y={125} seq="ACGTACGT"/><VDNA y={164} seq="ACGTTCGT" mut={4}/>
  <VRule y={187}/><La x={240} y={215} bold>indel · 1–~50 bp</La>
  <La x={240} y={248}>ACTG — CTT — GAC</La><La x={240} y={279} color={ORANGE}>ACTG — — — GAC</La>
  <VRule y={298}/><La x={240} y={327} bold>CNV · kb–Mb</La>
  {[0,1].map(r=><g key={r}><VBackbone start={92} end={388} y={351+r*44} gaps={Array.from({length:r?4:3},(_,i)=>[107+i*68,161+i*68] as [number,number])}/>{(r?["A","B","B","C"]:["A","B","C"]).map((s,i)=><VBox key={i} x={107+i*68} y={337+r*44} label={s} fill={s==="B"?ORANGE:BLUE}/>)}</g>)}
  <VRule y={422}/><He x={240} y={450} bold>שינוי מבני — למשל היפוך מאוזן</He>
  <La x={240} y={482}>A→  B→  C→  D→</La><La x={240} y={512} color={VPURPLE}>A→  C←  B←  D→</La>
  <VRule y={532}/><He x={240} y={561} bold>הרחבת חזרות — אורך משתנה</He>
  <La x={240} y={594} color={GREEN}>(CAG)ₙ → (CAG)ₙ₊ₖ</La>
  <He x={240} y={629} color={MUTED} size={14}>סכמות ללא קנה מידה; גם CNV הוא שינוי מבני</He>
  </g></VFig>;}

function VDosage(){return <VFig h={800} label="מודלי מינון: ספי תפקוד באובדן רצסיבי ובאי ספיקה, הפרעת תת יחידה פגומה לדימר ולקולגן ורווח בתפקוד">
  <He x={240} y={29} bold size={17}>אותו אובדן של אלל — תוצאות שונות</He>
  {[{y:68,title:"אובדן תפקוד רצסיבי",en:"WT / null",note:"חצי כמות מספיקה לתפקוד",color:GREEN},{y:202,title:"אי־ספיקה במינון",en:"WT / null",note:"חצי כמות נמוכה מסף התפקוד",color:ORANGE}].map(p=><g key={p.y}>
    <He x={240} y={p.y} bold>{p.title}</He><La x={103} y={p.y+37}>{p.en}</La>
    <rect x={192} y={p.y+18} width={230} height={27} rx={4} fill="#e2e8f0"/><rect x={192} y={p.y+18} width={115} height={27} rx={4} fill={p.color}/>
    <line x1={p.y===68?275:354} x2={p.y===68?275:354} y1={p.y+11} y2={p.y+52} stroke={INK} strokeWidth={2}/>
    <La x={250} y={p.y+38} color="white">50%</La><He x={240} y={p.y+82} color={p.color}>{p.note}</He>
  </g>)}
  <He x={240} y={329} color={MUTED} size={14}>הקו השחור = סף תפקוד סכמטי, תלוי בגן וברקמה</He><VRule y={348}/>
  <He x={240} y={377} bold>שלילי־דומיננטי — הפגום משתלב ומפריע</He>
  <He x={240} y={406} color={MUTED} size={14}>כחול = תקין; כתום = פגום; הרכבה אקראית ושווה</He>
  {[[BLUE,BLUE],[BLUE,ORANGE],[ORANGE,BLUE],[ORANGE,ORANGE]].map((c,i)=><g key={i}>{c.map((col,j)=><circle key={j} cx={72+i*108+j*23} cy={447} r={16} fill={col} stroke="white" strokeWidth={2}/>)}</g>)}
  <La x={240} y={491} color={GREEN} bold>dimers: ½ × ½ = ¼ all-WT</La>
  <He x={240} y={526}>קולגן I: שתי שרשראות α1 ושרשרת α2</He>
  {[0,1,2].map(j=><path key={j} d={`M80 ${559+j*8} Q130 ${543+j*8} 180 ${559+j*8}T280 ${559+j*8}T400 ${559+j*8}`} fill="none" stroke={j===2?GREEN:BLUE} strokeWidth={4}/>)}
  <La x={240} y={612} color={GREEN} bold>COL1A1 WT/mut: ½ × ½ × 1 = ¼</La>
  <He x={240} y={641} color={MUTED} size={14}>החישוב אינו ⅛: שרשרת α2 נשארת תקינה</He><VRule y={661}/>
  <He x={240} y={692} bold>רווח בתפקוד — פעילות יתר או פעילות חדשה</He>
  <VBox x={64} y={713} w={99} label="WT"/><VArrow x1={175} y1={727} x2={225} y2={727}/><La x={267} y={733}>signal</La>
  <VBox x={64} y={755} w={99} label="GoF" fill={ORANGE}/>{[0,1,2].map(i=><VArrow key={i} x1={175} y1={760+i*7} x2={225} y2={760+i*7} color={ORANGE}/>)}<He x={344} y={775} color={ORANGE}>פעילות ללא בקרה</He>
  </VFig>;}

function VDmd(){const lens=[176,148,150,186,102,109,233]; return <VFig h={735} label="כלל מסגרת הקריאה ב-DMD: חסר 45–50 משבש מסגרת, חסר 45–47 שומר עליה ודילוג 51 משיב אותה ב-RNA">
  <La x={240} y={28} bold size={17}>DMD · exons 45–51</La><He x={240} y={56} color={MUTED}>מספר האקסון מעל התיבה; אורכו בבסיסים מתחתיה</He>
  <VBackbone start={33} end={447} y={100} gaps={lens.map((_,i)=>[34+i*61,76+i*61] as [number,number])}/>
  {lens.map((n,i)=><g key={n}><La x={55+i*61} y={83}>{45+i}</La><VBox x={34+i*61} y={90} w={42} h={26}/><La x={55+i*61} y={140} size={14}>{n}</La></g>)}
  {[{y:183,title:"חסר 45–50: מסגרת הקריאה משתבשת",sum:"176 + 148 + 150 + 186 + 102 + 109 = 871",formula:"871 = 3 × 290 + 1",note:"קודון סיום מוקדם → NMD → דושן צפוי",keep:[44,51,52],color:ORANGE},{y:332,title:"חסר 45–47: מסגרת הקריאה נשמרת",sum:"176 + 148 + 150 = 474",formula:"474 = 3 × 158",note:"חלבון קצר, פעיל חלקית → בקר צפוי",keep:[44,48,49,50,51,52],color:GREEN},{y:481,title:"חסר 45–50 + דילוג על אקסון 51",sum:"871 + 233 = 1,104",formula:"1,104 = 3 × 368",note:"מטרת הדילוג: להשיב מסגרת ב־RNA",keep:[44,52],color:GREEN}].map(p=><g key={p.y}>
    <VRule y={p.y-23}/><He x={240} y={p.y} bold>{p.title}</He>
    <VBackbone start={48} end={432} y={p.y+32} gaps={p.keep.map((_,i)=>{const x=50+i*(330/Math.max(1,p.keep.length-1));return [x,x+42] as [number,number];})}/>{p.keep.map((n,i)=><VBox key={n} x={50+i*(330/Math.max(1,p.keep.length-1))} y={p.y+19} w={42} h={26} label={String(n)} fill={p.color}/>)}
    <La x={240} y={p.y+73} size={15}>{p.sum}</La><La x={240} y={p.y+99} color={p.color} bold>{p.formula}</La><He x={240} y={p.y+116} size={14}>{p.note}</He>
  </g>)}
  <VRule y={632}/><He x={240} y={659} bold>דיסטרופין קצר יכול לשמר שני אזורי קישור</He>
  <La x={64} y={690} color={BLUE}>N</La><VBox x={79} y={675} w={76} h={22}/><path d="M155 686L198 678L226 694L255 678L283 694L313 686" fill="none" stroke={GREEN} strokeWidth={5}/><VBox x={313} y={675} w={76} h={22}/><La x={408} y={690} color={BLUE}>C</La>
  <He x={112} y={724} size={14}>קישור לאקטין</He><He x={357} y={724} size={14}>קישור לקומפלקס בממברנה</He>
  </VFig>;}

function VF8(){return <VFig h={640} label="היפוך F8: רקומבינציה בין int22h באינטרון 22 לעותק טלומרי הפוך משנה את כיוון אקסונים 1–22 ומפרידה אותם מאקסונים 23–26">
  <He x={240} y={28} bold size={17}>היפוך באינטרון 22 מפריד את חלקי F8</He>
  <He x={240} y={57} color={MUTED}>מסלול מייצג: רקומבינציה בין חזרות בכיוונים הפוכים</He>
  <He x={240} y={93} bold>לפני ההיפוך</He><La x={71} y={126}>23–26</La><La x={249} y={126}>1–22</La>
  <VBackbone start={30} end={450} y={154} gaps={[[35,103],[206,290]]} width={4}/><VBox x={35} y={140} w={68} label="F8"/><VBox x={206} y={140} w={84} label="F8"/>
  <VArrow x1={284} y1={133} x2={212} y2={133} color={BLUE}/>
  <VArrow x1={128} y1={154} x2={162} y2={154} color={ORANGE}/><VArrow x1={311} y1={154} x2={345} y2={154} color={ORANGE}/><VArrow x1={429} y1={154} x2={395} y2={154} color={ORANGE}/>
  <La x={145} y={190} size={14}>int22h-1</La><La x={327} y={190} size={14}>int22h-2</La><La x={413} y={216} size={14}>int22h-3</La>
  <He x={145} y={215} size={14}>בתוך אינטרון 22</He>
  <He x={240} y={256} bold>קיפול ורקומבינציה בתוך אותו X</He>
  <path d="M40 323H163C240 323 311 301 311 331C311 381 162 385 162 334H440" fill="none" stroke={VLINE} strokeWidth={5}/>
  <VArrow x1={142} y1={323} x2={177} y2={323} color={ORANGE}/><VArrow x1={142} y1={344} x2={177} y2={344} color={ORANGE}/>
  <path d="M152 316L168 350M168 316L152 350" stroke={VPURPLE} strokeWidth={2}/>
  <He x={339} y={402} size={14}>הקטע שבין החזרות מתהפך</He>
  <VRule y={422}/><He x={240} y={452} bold>אחרי ההיפוך: אין תעתיק רציף 1–26</He>
  <VBackbone start={30} end={450} y={491} gaps={[[35,103],[321,405]]} width={4}/><VBox x={35} y={477} w={68} label="23–26"/><VBox x={321} y={477} w={84} label="1–22" fill={VPURPLE}/>
  <VArrow x1={97} y1={467} x2={41} y2={467} color={BLUE}/><VArrow x1={326} y1={467} x2={400} y2={467} color={VPURPLE}/>
  <He x={240} y={540} color={ORANGE}>האקסונים קיימים, אך הסדר והכיוון נשברו</He>
  <He x={240} y={574} size={14}>במיוזה זכרית האזור אינו מזווג ל־Y</He>
  <He x={240} y={600} size={14}>ולכן קיפול תוך־כרומוזומלי מועדף</He>
  <He x={240} y={628} color={MUTED} size={14}>כיווני העותקים החיצוניים תלויים בפולימורפיזם; לא בקנה מידה</He>
  </VFig>;}

function V15q(){return <VFig h={750} label="החתמת 15q: גנים פעילים מהאב ו-UBE3A פעיל מהאם בתאי עצב, עם חסר, UPD, פגם החתמה ופגיעה ממוקדת כמנגנוני PWS ואנג'למן">
  <La x={240} y={28} bold size={17}>15q11–q13</La><He x={240} y={57} color={MUTED}>ביטוי הורי בתאי עצב — מפת אזור מפושטת</He>
  {[{y:104,parent:"עותק מהאב",c:BLUE,on:true},{y:235,parent:"עותק מהאם",c:VPURPLE,on:false}].map(p=><g key={p.y}>
    <He x={240} y={p.y} bold color={p.c}>{p.parent}</He><VBackbone start={28} end={452} y={p.y+51} gaps={[[55,175],[192,312],[335,419]]}/>
    {[30,442].map(x=><g key={x}><path d={`M${x} ${p.y+33}v35m5 -35v35m5 -35v35`} stroke={MUTED} strokeWidth={2}/></g>)}
    <VBox x={55} y={p.y+37} w={120} label="NDN / MAGEL2" fill={p.on?BLUE:MUTED}/><VBox x={192} y={p.y+37} w={120} label="SNRPN" fill={p.on?BLUE:MUTED}/><VBox x={335} y={p.y+37} w={84} label="UBE3A" fill={p.on?MUTED:VPURPLE}/>
    <La x={250} y={p.y+95} size={14}>SNORD116</La><He x={111} y={p.y+95} size={14}>{p.on?"פעילים":"מושתקים"}</He><He x={377} y={p.y+95} size={14}>{p.on?"מושתק":"פעיל"}</He>
    <circle cx={188} cy={p.y+24} r={6} fill={p.on?"white":INK} stroke={INK}/><La x={188} y={p.y+12} size={14}>ICR</La>
    {[0,1,2,3,4,5].map(i=><line key={i} x1={218+i*12} x2={218+i*12} y1={p.y+72} y2={p.y+79} stroke={p.on?BLUE:MUTED} strokeWidth={3}/>)}
  </g>)}
  <He x={240} y={365} size={14}>חזרות דומות בשולי האזור מאפשרות חסרים חוזרים</He>
  <He x={240} y={391} color={MUTED} size={14}>ICR: עיגול מלא = מתילציה; ריק = ללא מתילציה</He><VRule y={411}/>
  <He x={240} y={440} bold>ארבע דרכים לאבד את הביטוי הנדרש</He>
  <La x={295} y={475} color={BLUE} bold>PWS</La><La x={416} y={475} color={VPURPLE} bold>AS</La>
  {[{he:"חסר",p:"paternal",a:"maternal"},{he:"UPD",p:"2 maternal",a:"2 paternal"},{he:"פגם בהחתמה",p:"maternal-like",a:"paternal-like"},{he:"וריאנט ממוקד",p:"rare*",a:"UBE3A"}].map((r,i)=><g key={r.he}><rect x={24} y={490+i*49} width={432} height={43} rx={4} fill={i%2?"#f8fafc":"#eff6ff"}/><He x={129} y={517+i*49}>{r.he}</He><La x={295} y={517+i*49} size={14}>{r.p}</La><La x={416} y={517+i*49} size={14}>{r.a}</La></g>)}
  <He x={240} y={713} size={14} color={MUTED}>*למשל חסר זעיר ב־SNORD116: אינו מסלול גן יחיד שכיח</He>
  <He x={240} y={739} size={14}>בדיקת מתילציה מזהה את שלוש השורות הראשונות</He>
  </VFig>;}

function VIgf(){return <VFig h={735} label="בקרת גדילה ב-11p15: CTCF אימהי מבודד IGF2 מהאנהנסר, מתילציה אבהית מאפשרת את הפעלתו ו-ICR2 שולט ב-CDKN1C">
  <La x={240} y={28} bold size={17}>11p15 · ICR1: IGF2 / H19</La>
  {[{y:66,maternal:true,c:VPURPLE},{y:270,maternal:false,c:BLUE}].map(p=><g key={p.y}>
    <He x={240} y={p.y} bold color={p.c}>{p.maternal?"מהאם: ללא מתילציה, CTCF נקשר":"מהאב: ICR1 ממותל, CTCF לא נקשר"}</He>
    <VBackbone start={35} end={444} y={p.y+91} gaps={[[42,118],[176,222],[270,335],[392,422]]}/>
    <VBox x={42} y={p.y+77} w={76} label="IGF2" fill={p.maternal?MUTED:BLUE}/><VBox x={270} y={p.y+77} w={65} label="H19" fill={p.maternal?VPURPLE:MUTED}/>
    <rect x={176} y={p.y+77} width={46} height={28} rx={6} fill="#e2e8f0" stroke={INK}/><La x={199} y={p.y+126} size={14}>ICR1</La>
    <circle cx={407} cy={p.y+91} r={15} fill={GREEN}/><La x={407} y={p.y+97} color="white">E</La>
    {p.maternal?<><VBox x={171} y={p.y+37} w={56} h={25} fill={ORANGE} label="CTCF"/><line x1={199} x2={199} y1={p.y+62} y2={p.y+76} stroke={ORANGE} strokeWidth={3}/><path d={`M398 ${p.y+72}Q360 ${p.y+35} 307 ${p.y+72}`} stroke={GREEN} strokeWidth={2.5} fill="none"/><path d={`M395 ${p.y+60}Q290 ${p.y-7} 231 ${p.y+41}`} stroke={MUTED} strokeWidth={2} strokeDasharray="5 4" fill="none"/><path d={`M228 ${p.y+31}v23`} stroke={ORANGE} strokeWidth={4}/></>:<><path d={`M397 ${p.y+68}Q240 ${p.y+5} 81 ${p.y+69}`} stroke={GREEN} strokeWidth={3} fill="none"/>{[181,199,217].map(x=><circle key={x} cx={x} cy={p.y+65} r={5} fill={INK}/>)}<La x={240} y={p.y+18} size={14}>CH₃</La></>}
    <He x={80} y={p.y+155} color={p.maternal?MUTED:BLUE}>{p.maternal?"מושתק":"פעיל"}</He><He x={302} y={p.y+155} color={p.maternal?VPURPLE:MUTED}>{p.maternal?"פעיל":"מושתק"}</He>
    <He x={240} y={p.y+184} size={14} color={MUTED}>{p.maternal?"CTCF חוסם גישה של האנהנסר ל־IGF2":"האנהנסר מפעיל IGF2; H19 מושתק"}</He>
  </g>)}
  <VRule y={473}/><La x={240} y={503} bold>ICR2 · KCNQ1OT1 / CDKN1C</La>
  <He x={240} y={536}>אם: ICR2 ממותל; CDKN1C פעיל ומרסן גדילה</He>
  <He x={240} y={566}>אב: KCNQ1OT1 פעיל; CDKN1C מושתק</He><VRule y={586}/>
  <La x={240} y={616} bold color={ORANGE}>BWS</La><He x={240} y={644}>עלייה ב־IGF2 ו/או ירידה ב־CDKN1C → גדילת־יתר</He>
  <La x={240} y={677} bold color={VPURPLE}>SRS</La><He x={240} y={705}>איבוד מתילציה ב־ICR1 האבהי → פחות IGF2</He>
  <He x={240} y={730} size={14} color={MUTED}>E = אנהנסר; סכמה מקומית, לא כל הגנים או מנגנוני המחלה</He>
  </VFig>;}

function VRepeats(){return <VFig h={640} label="מיקומי חזרות: CGG ב-5′UTR של FMR1, CAG בקודון של HTT, GAA באינטרון FXN ו-CTG ב-3′UTR של DMPK, ומנגנוני הנזק שלהם">
  <He x={240} y={29} bold size={17}>מיקום החזרה משנה את מנגנון המחלה</He>
  <He x={240} y={59} color={MUTED}>מפת גן משותפת לסיווג בלבד — אלה ארבעה גנים שונים</He>
  <La x={58} y={100}>5′UTR</La><La x={160} y={100}>coding</La><He x={271} y={100}>אינטרון</He><La x={411} y={100}>3′UTR</La>
  <line x1={32} x2={448} y1={133} y2={133} stroke={VLINE} strokeWidth={3}/><VBox x={30} y={118} w={60} fill="#64748b"/><VBox x={90} y={118} w={105}/><path d="M195 133L249 111L305 133" stroke={MUTED} fill="none" strokeWidth={2}/><VBox x={305} y={118} w={69}/><VBox x={374} y={118} w={74} fill="#64748b"/>
  {[{x:55,y:205,g:"FMR1 · CGG",loc:"5′UTR",mechanism:"מוטציה מלאה: מתילציה והשתקה",c:VPURPLE},{x:148,y:315,g:"HTT · CAG",loc:"coding exon",mechanism:"פוליגלוטמין — חלבון רעיל",c:ORANGE},{x:250,y:425,g:"FXN · GAA",loc:"intron 1",mechanism:"כרומטין דחוס — פחות שעתוק",c:BLUE},{x:412,y:535,g:"DMPK · CTG",loc:"3′UTR",mechanism:"RNA עם CUG — לכידת MBNL",c:GREEN}].map(p=><g key={p.g}>
    <circle cx={p.x} cy={133} r={8} fill={p.c} stroke="white" strokeWidth={2}/>
    <rect x={24} y={p.y-28} width={432} height={94} rx={8} fill="white" stroke={VLINE}/><La x={240} y={p.y-3} bold color={p.c}>{p.g}</La><La x={240} y={p.y+23} size={14} color={MUTED}>{p.loc}</La><He x={240} y={p.y+51}>{p.mechanism}</He>
  </g>)}
  <He x={240} y={628} size={14} color={MUTED}>החזרות מסומנות כנקודות; אין קנה מידה או גן שמכיל את כולן</He>
  </VFig>;}

function VFmr(){return <VFig h={660} label="טווחי FMR1: תקין 5–44, ביניים 45–54, טרום מוטציה 55–200 ומוטציה מלאה מעל 200, סיכון הרחבה אימהי עולה ומנגנוני RNA לעומת השתקה">
  <La x={240} y={29} bold size={17}>FMR1 · CGG in 5′UTR</La>
  <He x={240} y={60} color={MUTED}>טווחים קליניים — רוחב התיבות אינו פרופורציונלי</He>
  {[{n:"5–44",t:"תקין",c:GREEN,note:"יציב בדרך כלל"},{n:"45–54",t:"ביניים",c:MUTED,note:"עשוי להשתנות"},{n:"55–200",t:"טרום־מוטציה",c:ORANGE,note:"ביטוי RNA מוגבר"},{n:">200",t:"מוטציה מלאה",c:VPURPLE,note:"לרוב מתילציה והשתקה"}].map((r,i)=><g key={r.n}>
    <rect x={24} y={83+i*75} width={432} height={65} rx={7} fill={r.c} fillOpacity={.08} stroke={r.c}/><La x={93} y={112+i*75} bold color={r.c} size={18}>{r.n}</La><He x={300} y={108+i*75} bold>{r.t}</He><He x={300} y={134+i*75} size={14}>{r.note}</He>
  </g>)}
  <VRule y={400}/><He x={240} y={431} bold>בהעברה אימהית של טרום־מוטציה</He>
  <He x={240} y={460}>ככל שמספר החזרות עולה, עולה סיכון ההרחבה למלאה</He>
  <VArrow x1={73} y1={499} x2={410} y2={499} color={ORANGE}/><La x={73} y={488} size={14}>55</La><La x={410} y={488} size={14}>200</La>
  <He x={240} y={529} size={14}>הפרעות AGG מפחיתות סיכון; אין כאן אחוז סיכון אישי</He>
  <VRule y={549}/><La x={135} y={581} bold color={ORANGE}>55–200</La><La x={362} y={581} bold color={VPURPLE}>&gt;200</La>
  <La x={135} y={610}>FXTAS / FXPOI</La><La x={362} y={610}>↓ FMRP · FXS</La>
  <He x={135} y={640} size={14}>רעילות RNA ומנגנונים נוספים</He><He x={362} y={640} size={14}>אובדן תפקוד</He>
  </VFig>;}

export const VARIANT_FIGURES: Record<string,{el:()=>React.ReactElement;captionHe:string}> = {
  "hg-variant-classes":{el:VClasses,captionHe:"סוגי וריאנטים: החלפת בסיס, indel, שינוי במספר עותקים, היפוך והרחבת חזרה. טווחי הגודל מקורבים; CNV הוא גם וריאנט מבני. התרשימים אינם בקנה מידה."},
  "hg-dosage-models":{el:VDosage,captionHe:"ספי תפקוד סכמטיים מבחינים בין אובדן רצסיבי לאי־ספיקה במינון. במודל שלילי־דומיננטי עם ביטוי שווה והרכבה אקראית, רבע מהדימרים תקינים; בקולגן I עם COL1A1 הטרוזיגוטי גם רבע, משום שרק שתי שרשראות α1 נמצאות בסיכון."},
  "hg-dmd-frame":{el:VDmd,captionHe:"חישובי המסגרת משתמשים בדיוק באורכי האקסונים שבתרגיל. דילוג 51 בחסר 45–50 משיב מסגרת ב־RNA, אך אינו מתקן DNA ואינו מבטיח תועלת קלינית. מפת החלבון והאקסונים סכמטית; כלל המסגרת כולל חריגים."},
  "hg-f8-inversion":{el:VF8,captionHe:"היפוך F8 נוצר ברקומבינציה בין int22h-1 באינטרון 22 לעותק חוץ־גני בכיוון הפוך. מוצג סידור מייצג עם int22h-3 טלומרי; פולימורפיזם באזור עשוי להחליף את מיקום וכיוון int22h-2 ו־int22h-3. הסכמה אינה בקנה מידה."},
  "hg-15q-imprinting":{el:V15q,captionHe:"מפת ביטוי מפושטת של 15q11–q13 בתאי עצב: גנים מהאב לעומת UBE3A מהאם. המיקום של SNORD116 ביחס ל־SNRPN מפושט. ארבע משפחות מנגנונים מוצגות; פגיעות ממוקדות ב־SNORD116 נדירות, בניגוד למסלול UBE3A המוכר באנג׳למן."},
  "hg-igf2-h19":{el:VIgf,captionHe:"מודל אנהנסר–מבודד מקומי ב־ICR1: CTCF אימהי חוסם הפעלת IGF2, ומתילציה אבהית מונעת את קישורו. ICR2 מוצג בנפרד כדי שלא לייחס את כל BWS ל־IGF2. זו סכמה של בקרת ביטוי, ללא קנה מידה וללא כל חריגי הרקמה."},
  "hg-repeat-locations":{el:VRepeats,captionHe:"ארבעה מיקומי חזרה ביחס למבנה גן: FMR1 ב־5′UTR, HTT באקסון מקודד, FXN באינטרון 1 ו־DMPK ב־3′UTR. המפה העליונה היא תבנית סיווג בלבד; אין גן אמיתי המכיל את ארבע החזרות האלה."},
  "hg-fmr1-ranges":{el:VFmr,captionHe:"טווחי FMR1 בדיוק לפי היחידה: 5–44, 45–54, 55–200 ומעל 200. ההרחבה למלאה קשורה בעיקר להעברה אימהית ותלויה גם בהפרעות AGG. הגרפיקה אינה מציגה סיכון מספרי. מוזאיקה ומתילציה חלקית יכולות לחרוג ממודל ההשתקה המלאה."},
};


const D_LINE = "#cbd5e1", D_PURPLE = "#7e22ce", D_TEAL = "#0f766e";
function DArrow({x1,y1,x2,y2,color=INK,dashed=false}:{x1:number;y1:number;x2:number;y2:number;color?:string;dashed?:boolean}) {
  const a=Math.atan2(y2-y1,x2-x1),l=7,w=3.5;
  return <g stroke={color} strokeWidth={1.7}><line x1={x1} y1={y1} x2={x2-l*Math.cos(a)} y2={y2-l*Math.sin(a)} strokeDasharray={dashed?"5 4":undefined}/><polygon stroke="none" fill={color} points={`${x2},${y2} ${x2-l*Math.cos(a)+w*Math.sin(a)},${y2-l*Math.sin(a)-w*Math.cos(a)} ${x2-l*Math.cos(a)-w*Math.sin(a)},${y2-l*Math.sin(a)+w*Math.cos(a)}`}/></g>;
}
function DCross({x,y}:{x:number;y:number}) {return <path d={`M${x-7} ${y-7}l14 14m-14 0l14 -14`} stroke={ORANGE} strokeWidth={3} strokeLinecap="round"/>;}
function DPanel({x=18,y,w=444,h,children}:{x?:number;y:number;w?:number;h:number;children:React.ReactNode}) {return <g><rect x={x} y={y} width={w} height={h} rx={14} fill="#f8fafc" stroke={D_LINE}/>{children}</g>;}
function DSvg({h,label,children}:{h:number;label:string;children:React.ReactNode}) {return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}>{children}</svg>;}
function DNormal(mu:number,x:number) {return Math.exp(-.5*(x-mu)**2)/Math.sqrt(2*Math.PI);}
function DNormalTail(mu:number,t=2) {let sum=0;const h=.001,n=12000;for(let i=0;i<=n;i++)sum+=(i===0||i===n?1:i%2?4:2)*DNormal(mu,t+i*h);return sum*h/3;}
function DNormalPath(mu:number,tail=false) {
  const lo=tail?2:-3.5, hi=4.5, x=(v:number)=>45+(v+3.5)*49.5,y=(v:number)=>260-440*DNormal(mu,v);
  let p=tail?`M${x(lo)} 260 L${x(lo)} ${y(lo)}`:"";
  for(let i=0;i<=200;i++){const v=lo+(hi-lo)*i/200;p+=`${i||tail?"L":"M"}${x(v).toFixed(2)} ${y(v).toFixed(2)}`;}
  return p+(tail?`L${x(hi)} 260 Z`:"");
}
function DLiability() {return <DSvg h={420} label="מודל נטייה וסף: התפלגות קרובי חולה מוזזת ימינה וסיכון המחלה גדל באותו סף">
  <He x={240} y={28} bold size={18}>אותו סף, התפלגות שונה</He>
  <line x1={30} x2={61} y1={56} y2={56} stroke={BLUE} strokeWidth={3}/><He x={129} y={61}>אוכלוסייה</He>
  <line x1={239} x2={270} y1={56} y2={56} stroke={D_PURPLE} strokeWidth={3}/><He x={355} y={61}>אחים של חולה</He>
  <path d={DNormalPath(0,true)} fill={BLUE} fillOpacity={.25}/><path d={DNormalPath(.8,true)} fill={D_PURPLE} fillOpacity={.25}/>
  <path d={DNormalPath(0)} stroke={BLUE} strokeWidth={3} fill="none"/><path d={DNormalPath(.8)} stroke={D_PURPLE} strokeWidth={3} fill="none"/>
  <path d="M45 85V260H447" fill="none" stroke={INK} strokeWidth={1.5}/><line x1={317.25} x2={317.25} y1={90} y2={260} stroke={ORANGE} strokeWidth={2} strokeDasharray="5 4"/>
  <He x={361} y={97} color={ORANGE} bold>סף קבוע</He><La x={317} y={284} color={ORANGE}>T = 2</La>
  <He x={240} y={314}>נטייה למחלה: גנים + סביבה</He><He x={29} y={174} size={14} rotate={-90}>צפיפות</He>
  <DPanel y={337} h={67}><He x={240} y={361} size={16}>השטח מעבר לסף = הסיכון במודל</He><La x={128} y={387} color={BLUE}>{(DNormalTail(0)*100).toFixed(2)}%</La><La x={350} y={387} color={D_PURPLE}>{(DNormalTail(.8)*100).toFixed(2)}%</La></DPanel>
</DSvg>;}

function DRng(seed:number) {let s=seed;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function DManhattanModel() {
  const rng=DRng(136088),peak=-Math.log10(3e-12);
  const local=Array.from({length:55},(_,i)=>{const pos=49.875+i*.25/54,r2=Math.exp(-Math.abs(pos-50)/.045);return {pos,r2,logp:1+(peak-1)*r2+(rng()-.5)*.3*(1-r2)};});
  const lead=local.reduce((a,b)=>a.logp>b.logp?a:b);
  const pts=Array.from({length:22*22},(_,i)=>{const c=Math.floor(i/22),j=i%22;let logp=-Math.log10(Math.max(rng(),1e-5));if(c===15&&j>13&&j<18)logp+=9-Math.abs(j-15)*2;return {pos:(j+.5)*181.5/22,logp,c};}).concat(local.map(p=>({...p,c:4})));
  return {local,lead,pts};
}
function DManhattan() {
  const {local,lead,pts}=DManhattanModel(), cutoff=-Math.log10(5e-8);
  const lx=55+(lead.pos-49.875)/.25*394,ly=535-lead.logp*13;
  return <DSvg h={655} label="מנהטן מדומה עם סף 5 כפול עשר בחזקת מינוס שמונה, ותקריב לוקוס צבוע לפי LD עם SNP מוביל">
    <He x={240} y={25} bold size={18}>מאות אותות — לוקוס אחד בתקריב</He><He x={240} y={51} size={14} color={MUTED}>נתונים מדומים; כל נקודה מייצגת וריאנט</He>
    {[0,4,8,12].map(v=><g key={v}><line x1={52} x2={451} y1={251-v*13} y2={251-v*13} stroke={D_LINE}/><La x={39} y={256-v*13} size={14}>{v}</La></g>)}
    <path d="M52 82V251H451" stroke={INK} fill="none"/>{pts.map((p,i)=><circle key={i} cx={52+(p.c+p.pos/181.5)*18.1} cy={251-p.logp*13} r={2} fill={p.c%2?MUTED:BLUE}/>)}
    <line x1={52} x2={451} y1={251-cutoff*13} y2={251-cutoff*13} stroke={ORANGE} strokeDasharray="5 4"/>
    <La x={344} y={143} color={ORANGE} size={14}>p = 5 × 10⁻⁸</La><La x={52} y={76} anchor="start" size={14}>−log₁₀(p)</La>
    {[1,5,10,15,20,22].map(c=><La key={c} x={52+(c-.5)*18.1} y={274} size={14}>{c}</La>)}<He x={252} y={298}>כרומוזום</He>
    <DArrow x1={143} y1={311} x2={143} y2={341} color={BLUE}/><He x={284} y={332} size={15}>תקריב באזור המוביל בכרומוזום 5</He>
    {[0,4,8,12].map(v=><g key={v}><line x1={55} x2={449} y1={535-v*13} y2={535-v*13} stroke={D_LINE}/><La x={39} y={540-v*13} size={14}>{v}</La></g>)}
    <path d="M55 365V535H449" fill="none" stroke={INK}/>{local.map((p,i)=><circle key={i} cx={55+(p.pos-49.875)/.25*394} cy={535-p.logp*13} r={3.3} fill={p.r2>.8?ORANGE:p.r2>.5?D_PURPLE:p.r2>.2?BLUE:MUTED}/>)}
    <path d={`M${lx} ${ly-6}l6 6-6 6-6-6z`} fill={INK}/><La x={342} y={365} size={14}>lead SNP</La>
    <La x={57} y={559} size={14}>49.875</La><La x={252} y={559} size={14}>50.000</La><La x={433} y={559} size={14}>50.125</La><He x={252} y={584} size={14}>מיקום גנומי (מיליוני בסיסים)</He>
    <La x={51} y={614} size={14}>r²:</La>{[[MUTED,"< 0.2"],[BLUE,"0.2–0.5"],[D_PURPLE,"0.5–0.8"],[ORANGE,"> 0.8"]].map(([c,t],i)=><g key={c}><circle cx={89+i*100} cy={609} r={4} fill={c}/><La x={127+i*100} y={614} size={14}>{t}</La></g>)}
    <He x={240} y={643} size={14}>LD גבוה אינו מוכיח שהווריאנט הוא הגורם</He>
  </DSvg>;
}

type DMtFeature={name:string;start:number;end:number;color:string;r?:number};
const D_PROTEINS:DMtFeature[]=[
  ["ND1",3307,4262,BLUE],["ND2",4470,5511,BLUE],["CO1",5904,7445,D_TEAL],["CO2",7586,8269,D_TEAL],["ATP8",8366,8572,D_PURPLE],["ATP6",8527,9207,D_PURPLE],["CO3",9207,9990,D_TEAL],["ND3",10059,10404,BLUE],["ND4L",10470,10766,BLUE],["ND4",10760,12137,BLUE],["ND5",12337,14148,BLUE],["ND6",14149,14673,BLUE],["CYB",14747,15887,ORANGE]
].map(([name,start,end,color])=>({name:name as string,start:start as number,end:end as number,color:color as string}));
const D_TRNAS=[[577,647],[1602,1670],[3230,3304],[4263,4331],[4329,4400],[4402,4469],[5512,5579],[5587,5655],[5657,5729],[5761,5826],[5826,5891],[7446,7514],[7518,7585],[8295,8364],[9991,10058],[10405,10469],[12138,12206],[12207,12265],[12266,12336],[14674,14742],[15888,15953],[15956,16023]];
const D_RRNAS=[[648,1601],[1671,3229]];
function DMtPoint(bp:number,r:number) {const a=bp/16569*Math.PI*2-Math.PI/2;return {x:240+r*Math.cos(a),y:204+r*Math.sin(a)};}
function DMtArc(start:number,end:number,r:number) {const a=DMtPoint(start,r),b=DMtPoint(end,r);return `M${a.x} ${a.y} A${r} ${r} 0 ${end-start>8284?1:0} 1 ${b.x} ${b.y}`;}
function DMtMap() {
  const variants=[{bp:3243,k:"A",label:"m.3243A>G · MT-TL1",d:"MELAS"},{bp:8344,k:"B",label:"m.8344A>G · MT-TK",d:"MERRF"},{bp:8993,k:"C",label:"m.8993T>G · MT-ATP6",d:"NARP / Leigh"},{bp:11778,k:"D",label:"m.11778G>A · MT-ND4",d:"LHON"}];
  return <DSvg h={790} label="מפת mtDNA בקנה מידה של בסיסים עם 13 גנים לחלבונים, 22 tRNA, שני rRNA וארבעה מיקומי וריאנטים">
    <He x={240} y={26} bold size={18}>גנום קטן, חלוקת עבודה ברורה</He>
    <circle cx={240} cy={204} r={128} fill="none" stroke={D_LINE} strokeWidth={16}/>
    {D_PROTEINS.map(g=><path key={g.name} d={DMtArc(g.start,g.end,g.name==="ATP8"||g.name==="ND4L"?111:128)} fill="none" stroke={g.color} strokeWidth={g.name==="ATP8"||g.name==="ND4L"?9:16}/>)}
    {D_TRNAS.map(([s,e])=><path key={s} d={DMtArc(s,e,147)} fill="none" stroke={GREEN} strokeWidth={9}/>)}
    {D_RRNAS.map(([s,e])=><path key={s} d={DMtArc(s,e,128)} fill="none" stroke="#b45309" strokeWidth={16}/>)}
    <He x={240} y={186} bold size={17}>מעגל דו־גדילי</He><La x={240} y={212} bold size={19}>16,569 bp</La><He x={240} y={238} size={16}>37 גנים</He>
    <La x={240} y={46} size={14}>1 / 16,569</La>
    {variants.map(({bp,k},i)=>{const p=DMtPoint(bp,165),a=DMtPoint(bp,140); const q=i===1?{x:p.x+35,y:p.y-4}:i===2?{x:p.x-22,y:p.y+5}:p;const dx=q.x-a.x,dy=q.y-a.y,len=Math.hypot(dx,dy),e={x:q.x-dx/len*14,y:q.y-dy/len*14};return <g key={k}><path d={`M${a.x} ${a.y}L${e.x} ${e.y}`} stroke={INK} fill="none"/><circle cx={q.x} cy={q.y} r={12} fill={INK}/><La x={q.x} y={q.y+5} color="white" size={14} bold>{k}</La></g>;})}
    <He x={240} y={402} size={14} color={MUTED}>המיקום והאורך לפי רצף הייחוס; החפיפות בשתי מסילות</He>
    <DPanel y={420} h={174}>
      <He x={240} y={446} bold size={16}>13 חלבונים לפי קומפלקס</He>
      <La x={240} y={474} color={BLUE}>I: ND1, ND2, ND3, ND4L, ND4, ND5, ND6</La>
      <La x={240} y={500} color={ORANGE}>III: CYB</La><La x={240} y={526} color={D_TEAL}>IV: CO1, CO2, CO3</La><La x={240} y={552} color={D_PURPLE}>V: ATP6, ATP8</La>
      <La x={119} y={578} color={GREEN}>22 tRNA</La><La x={329} y={578} color="#b45309">2 rRNA: 12S, 16S</La>
    </DPanel>
    {variants.map((v,i)=><g key={v.k}><circle cx={38} cy={620+i*35} r={11} fill={INK}/><La x={38} y={625+i*35} size={14} color="white">{v.k}</La><La x={215} y={625+i*35} size={14}>{v.label}</La><La x={410} y={625+i*35} size={14}>{v.d}</La></g>)}
    <He x={240} y={776} size={14}>קומפלקס II ורוב חלבוני המיטוכונדריה מקודדים בגרעין</He>
  </DSvg>;
}
function DMtDots({x,y,p,n=40,r=43}:{x:number;y:number;p:number;n?:number;r?:number}) {
  return <g><circle cx={x} cy={y} r={r} fill="#eff6ff" stroke={BLUE} strokeWidth={2}/>{Array.from({length:n},(_,i)=>{const a=i*2.399963,rr=Math.sqrt((i+.5)/n)*(r-8);return <circle key={i} cx={x+rr*Math.cos(a)} cy={y+rr*Math.sin(a)} r={n>20?3:4} fill={i<Math.round(n*p)?ORANGE:BLUE}/>;})}</g>;
}
function DBottleneck() {return <DSvg h={838} label="צוואר בקבוק מיטוכונדריאלי: אם עם 35 אחוז עותקים פגועים, דגימה קטנה בתאי המין, ביציות סכמטיות וילדים עם רמות שנמדדו ברקמות שונות">
  <He x={240} y={26} bold size={18}>אם אחת — רמות שונות בצאצאים</He>
  <DMtDots x={240} y={103} p={.35}/><He x={105} y={95} bold>האם: דם</He><La x={105} y={120}>35%</La>
  <DArrow x1={240} y1={152} x2={240} y2={191}/><He x={122} y={177} size={14}>דגימה מצומצמת</He>
  <He x={240} y={218} bold>תאי מין קדומים: צוואר בקבוק אפקטיבי</He>
  {[.1,.4,.9].map((p,i)=><g key={p}><DMtDots x={95+i*145} y={278} p={p} n={10} r={32}/><DArrow x1={95+i*145} y1={318} x2={95+i*145} y2={i===1?330:366}/></g>)}
  <He x={240} y={347} size={14} color={MUTED}>הגברה מחדש של עותקי ה־DNA</He><DArrow x1={240} y1={356} x2={240} y2={366}/>
  {[.1,.4,.9].map((p,i)=><g key={p}><DMtDots x={95+i*145} y={419} p={p}/><He x={95+i*145} y={487} bold>{["רמה נמוכה","רמה בינונית","רמה גבוהה"][i]}</He><He x={95+i*145} y={512} size={14}>ביצית להמחשה</He><DArrow x1={95+i*145} y1={528} x2={95+i*145} y2={555}/><La x={95+i*145} y={581} bold>{["8%","50%","96%"][i]}</La><He x={95+i*145} y={606} size={14}>{["בת: דם","הדגמה בלבד","בן: שריר"][i]}</He></g>)}
  <DPanel y={628} h={192}><He x={240} y={654} bold size={16}>האם הרמה עוברת את סף הרקמה?</He><He x={240} y={680} size={15}>8% בדם הבת; 96% בשריר הבן</He>
    <He x={240} y={706} size={14}>סף המחשה בלבד: 80% עותקים פגועים</He>
    <rect x={72} y={730} width={336} height={17} rx={5} fill="#dbeafe"/><rect x={340.8} y={730} width={67.2} height={17} fill="#ffedd5"/><line x1={340.8} x2={340.8} y1={723} y2={753} stroke={ORANGE} strokeWidth={2}/>
    {[8,50,96].map(p=><g key={p}><circle cx={72+3.36*p} cy={738} r={4} fill={p>80?ORANGE:BLUE}/><La x={72+3.36*p} y={775} size={14}>{p}%</La></g>)}
    <He x={240} y={804} size={14} color={MUTED}>הסף משתנה; דם אינו מייצג את כל רקמות הגוף</He></DPanel>
  <circle cx={41} cy={47} r={4} fill={BLUE}/><He x={86} y={52} size={14}>תקין</He><circle cx={131} cy={47} r={4} fill={ORANGE}/><He x={178} y={52} size={14}>פגוע</He>
</DSvg>;}

function DMetabolic() {return <DSvg h={610} label="חסימת אנזים בין A ל-B גורמת להצטברות A, לחסר בתוצר ולמסלול צדדי; דוגמת PAH בפנילקטונוריה">
  <He x={240} y={27} bold size={18}>חסימה אחת, שלוש תוצאות</He>
  <DPanel y={47} h={239}>
    <He x={240} y={75} bold>מודל כללי</He>
    {[[85,"A ↑",ORANGE],[260,"B ↓",BLUE],[402,"C ↓",BLUE]].map(([x,t,c])=><g key={t}><circle cx={x as number} cy={139} r={31} fill="white" stroke={c as string} strokeWidth={2}/><La x={x as number} y={145} color={c as string} bold size={19}>{t}</La></g>)}
    <DArrow x1={122} y1={139} x2={220} y2={139}/><DCross x={173} y={139}/><He x={173} y={108} size={14} color={ORANGE}>אנזים חסר</He><DArrow x1={299} y1={139} x2={361} y2={139} dashed/>
    <DArrow x1={85} y1={178} x2={85} y2={225} color={ORANGE}/><He x={226} y={213} size={15}>יותר זרימה למסלול צדדי</He><He x={240} y={258} size={15} color={ORANGE}>תוצר חלופי עלול להצטבר ולהזיק</He>
  </DPanel>
  <DPanel y={305} h={284}>
    <He x={240} y={335} bold size={17}>פנילקטונוריה: הכבד</He>
    <La x={240} y={364} color={BLUE}>PAH + BH₄ + O₂</La>
    <La x={93} y={411} bold size={19} color={ORANGE}>Phe ↑</La><La x={391} y={411} bold size={19} color={BLUE}>Tyr ↓</La>
    <DArrow x1={145} y1={405} x2={339} y2={405}/><DCross x={240} y={405}/>
    <He x={95} y={440} size={15}>פנילאלנין</He><He x={391} y={440} size={15}>טירוזין</He>
    <DArrow x1={95} y1={456} x2={95} y2={496} color={ORANGE}/><He x={263} y={480} size={15}>חלק מהמצע מנותב הצידה</He>
    <La x={240} y={523} color={ORANGE} bold>phenylpyruvate (a phenylketone)</La><He x={240} y={552} size={15}>פנילקטונים בשתן; פנילאלנין גבוה פוגע במוח</He>
    <He x={240} y={576} size={14} color={MUTED}>החצים מתארים מסלולים, לא קצבי תגובה מדודים</He>
  </DPanel>
</DSvg>;}

function DLysosome({x,y,kind}:{x:number;y:number;kind:"neuron"|"macro"}) {const neuron=kind==="neuron";return <g>
  {neuron?<path d={`M${x-48} ${y-23}l-25 -30m25 30l-36 10m45 39l-27 34m89-49l45-4m-45 4l35 26`} fill="none" stroke={BLUE} strokeWidth={4}/>:null}
  <path d={`M${x-49} ${y} Q${x-64} ${y-44} ${x-19} ${y-48} Q${x+19} ${y-67} ${x+49} ${y-24}Q${x+67} ${y+20} ${x+22} ${y+48}Q${x-25} ${y+68} ${x-49} ${y}Z`} fill={neuron?"#eff6ff":"#f0fdf4"} stroke={neuron?BLUE:GREEN} strokeWidth={2}/>
  <ellipse cx={x-18} cy={y-14} rx={14} ry={20} fill="#e2e8f0" stroke={MUTED}/><circle cx={x+20} cy={y+18} r={26} fill="#fff7ed" stroke={ORANGE} strokeWidth={2}/>
  {Array.from({length:13},(_,i)=><path key={i} d={`M${x+4+(i%4)*9} ${y+4+Math.floor(i/4)*9}l5 3-4 4`} fill="none" stroke={ORANGE} strokeWidth={2}/>)}
</g>;}
function DLysosomal() {return <DSvg h={975} label="אגירה בליזוזומים: GM2 בנוירון וגלוקוצרברוזיד במקרופאג; ERT בגושה דרך מנוז, מסלול כללי נפרד של קליטת M6P, ומגבלת מחסום הדם מוח">
  <He x={240} y={27} bold size={18}>המצע והתא קובעים את הפגיעה</He>
  <DPanel x={16} y={48} w={218} h={312}><He x={125} y={78} bold>טיי־זקס: נוירון</He><DLysosome x={125} y={160} kind="neuron"/><La x={125} y={254} bold color={ORANGE}>GM2 ↑</La><La x={125} y={285}>HEXA / Hex A ↓</La><He x={125} y={324} size={14}>אגירה בליזוזום</He></DPanel>
  <DPanel x={246} y={48} w={218} h={312}><He x={355} y={78} bold>גושה: מקרופאג</He><DLysosome x={355} y={160} kind="macro"/><He x={355} y={254} bold color={ORANGE} size={15}>גלוקוצרברוזיד ↑</He><La x={355} y={285}>GBA1 / GCase ↓</La><He x={355} y={324} size={14}>כבד, טחול, מח עצם</He></DPanel>
  <DPanel y={380} h={225}><He x={240} y={409} bold size={17}>אנזים חלופי בגושה: קליטה למקרופאג</He>
    <circle cx={65} cy={471} r={20} fill="#dcfce7" stroke={GREEN} strokeWidth={2}/><La x={65} y={477} size={14}>ERT</La>
    <DArrow x1={94} y1={471} x2={186} y2={471} color={GREEN}/><He x={139} y={444} size={14}>מנוז חשוף</He>
    <path d="M211 437V489Q211 507 230 507H270Q289 507 289 489V437" stroke={GREEN} strokeWidth={3} fill="none"/>
    <He x={250} y={538} size={14}>קולטן מנוז</He><DArrow x1={306} y1={471} x2={351} y2={471} color={GREEN}/><circle cx={400} cy={471} r={28} fill="#f0fdf4" stroke={GREEN} strokeWidth={2}/><He x={400} y={533} size={14}>ליזוזום</He>
    <He x={240} y={574} size={14} color={MUTED}>M6P: מסלול מיון וקליטה כללי של אנזימים ליזוזומליים</He>
  </DPanel>
  <DPanel y={625} h={222}>
    <He x={240} y={656} bold size={17}>מסלול כללי: קליטת אנזים המסומן ב־M6P</He>
    <circle cx={65} cy={717} r={20} fill="#dbeafe" stroke={BLUE} strokeWidth={2}/><La x={65} y={722} size={14}>E</La>
    <DArrow x1={94} y1={717} x2={151} y2={717} color={BLUE}/>
    <path d="M164 692V724Q164 738 183 738Q202 738 202 724V692" fill="none" stroke={BLUE} strokeWidth={3}/>
    <DArrow x1={213} y1={717} x2={260} y2={717} color={BLUE}/><circle cx={295} cy={717} r={23} fill="#eff6ff" stroke={BLUE} strokeWidth={2}/><circle cx={295} cy={717} r={5} fill={BLUE}/>
    <DArrow x1={329} y1={717} x2={374} y2={717} color={BLUE}/><circle cx={412} cy={717} r={25} fill="#eff6ff" stroke={BLUE} strokeWidth={2}/><circle cx={412} cy={717} r={6} fill={BLUE}/>
    <La x={65} y={772} size={14}>ERT–M6P</La><La x={183} y={772} size={14}>M6PR</La><He x={295} y={772} size={14}>אנדוזום</He><He x={412} y={772} size={14}>ליזוזום</He>
    <He x={240} y={817} size={14} color={MUTED}>מופרד ממיקוד האנזים למקרופאגים בגושה</He>
  </DPanel>
  <path d="M50 886H430M50 894H430" stroke={BLUE} strokeWidth={3}/><DCross x={240} y={890}/>
  <He x={240} y={875} size={15} bold>מחסום הדם־מוח</He><He x={240} y={931} size={15}>ERT תוך־ורידי אינו מגיע ביעילות לנוירונים במוח</He><He x={240} y={958} size={14} color={MUTED}>לכן שיפור באיברי הגוף אינו מעיד על תיקון הפגיעה העצבית</He>
</DSvg>;}

function DAlleles({x,y,state}:{x:number;y:number;state:string}) {return <g>{[0,1].map(i=><g key={i}><rect x={x+i*28} y={y} width={18} height={42} rx={6} fill={state[i]==="+"?"#dbeafe":"#ffedd5"} stroke={state[i]==="+"?BLUE:ORANGE} strokeWidth={2}/><La x={x+9+i*28} y={y+28} bold>{state[i]}</La></g>)}</g>;}
function DOncogene() {return <DSvg h={800} label="אונקוגן כרווח תפקוד בעותק אחד ומדכא גידול כאובדן שני עותקים; שתי מכות תורשתיות וספורדיות ודרכי LOH">
  <He x={240} y={27} bold size={18}>דוושת האצה ובלם — ברמת התא</He>
  <DPanel x={18} y={46} w={216} h={184}><He x={126} y={76} bold>אונקוגן: האצה</He><path d="M70 156L97 103H156L175 156Z" fill="#ffedd5" stroke={ORANGE} strokeWidth={3}/><path d="M102 146l12-24m9 24l12-24" stroke={ORANGE} strokeWidth={3}/><He x={126} y={193} size={15}>עותק פעיל־יתר אחד מספיק</He><He x={126} y={216} size={14}>רווח בתפקוד</He></DPanel>
  <DPanel x={246} y={46} w={216} h={184}><He x={354} y={76} bold>מדכא גידול: בלם</He><path d="M305 110H402V157H305Z" fill="#dbeafe" stroke={BLUE} strokeWidth={3}/><path d="M324 123v22m19-22v22m19-22v22m19-22v22" stroke={BLUE} strokeWidth={3}/><He x={354} y={193} size={15}>לרוב דרוש אובדן שני עותקים</He><He x={354} y={216} size={14}>מודל קלאסי: RB1</He></DPanel>
  <He x={240} y={268} bold size={17}>שתי מכות ב־RB1</He>
  <He x={240} y={298} bold>ספורדי: שתי מכות באותה שושלת תאים</He>
  <DAlleles x={63} y={320} state="++"/><DArrow x1={129} y1={341} x2={206} y2={341}/><DAlleles x={218} y={320} state="−+"/><DArrow x1={283} y1={341} x2={360} y2={341}/><DAlleles x={376} y={320} state="−−"/>
  <He x={169} y={393} size={14}>מכה 1</He><He x={324} y={393} size={14}>מכה 2</He>
  <He x={240} y={437} bold>תורשתי: מכה ראשונה כבר בכל תא</He>
  <DAlleles x={100} y={459} state="−+"/><DArrow x1={169} y1={480} x2={314} y2={480}/><DAlleles x={337} y={459} state="−−"/><He x={242} y={524} size={14}>מכה סומטית נוספת</He>
  <DPanel y={551} h={228}><He x={240} y={581} bold size={16}>LOH: אובדן האלל התקין באזור</He><La x={240} y={609} size={15}>+/− → −/∅  or  −/−</La>
    <He x={240} y={638} size={15}>חסר • אובדן כרומוזום ± שכפול הפגוע</He><He x={240} y={664} size={15}>רקומבינציה מיטוטית: LOH ללא שינוי במספר העותקים</He>
    <He x={240} y={703} size={14}>מוטציה נוספת או השתקת פרומוטור הן גם ״מכה״</He><He x={240} y={727} size={14} color={MUTED}>אך אינן בהכרח LOH בסמני האזור</He><He x={240} y={760} size={15}>נטייה משפחתית דומיננטית; אובדן תפקוד רצסיבי בתא</He>
  </DPanel>
</DSvg>;}
function DSynthetic() {return <DSvg h={718} label="קטלניות סינתטית בין עיכוב PARP לחסר BRCA: נזק תלוי שכפול מתוקן בתא עם רקומבינציה הומולוגית ואינו מתוקן בגידול חסר BRCA">
  <He x={240} y={27} bold size={18}>חסימת מסלול שני חושפת חולשת תיקון</He>
  <DPanel y={47} h={195}><La x={240} y={78} bold>PARP inhibitor</La><DArrow x1={240} y1={89} x2={240} y2={116}/><DCross x={240} y={125}/><La x={240} y={154} color={ORANGE}>PARP</La><He x={240} y={185} size={15}>נזק חד־גדילי ומלכוד PARP אינם נפתרים</He><He x={240} y={214} bold size={15}>בזמן שכפול: מזלג תקוע / שבר דו־גדילי</He></DPanel>
  <DArrow x1={175} y1={258} x2={126} y2={292}/><DArrow x1={305} y1={258} x2={354} y2={292}/>
  <DPanel x={18} y={307} w={216} h={258}><He x={126} y={338} bold>תא גוף של נשאית</He><La x={126} y={370} color={BLUE} bold>BRCA +/−</La><He x={126} y={405} size={15}>עותק תקין נשמר</He><DArrow x1={126} y1={421} x2={126} y2={455} color={GREEN}/><He x={126} y={482} size={15}>רקומבינציה הומולוגית</He><He x={126} y={511} bold color={GREEN}>תיקון → הישרדות יחסית</He><He x={126} y={543} size={14}>במודל של רגישות לטיפול</He></DPanel>
  <DPanel x={246} y={307} w={216} h={258}><He x={354} y={338} bold>תא גידול חסר BRCA</He><La x={354} y={370} color={ORANGE} bold>BRCA −/−</La><He x={354} y={405} size={15}>שני העותקים אינם פעילים</He><DArrow x1={354} y1={421} x2={354} y2={455} color={ORANGE}/><DCross x={354} y={440}/><He x={354} y={482} size={15}>אין תיקון הומולוגי יעיל</He><He x={354} y={511} bold color={ORANGE}>נזק מצטבר → מוות</He><He x={354} y={543} size={14}>הרגישות נובעת מהשילוב</He></DPanel>
  <DPanel y={587} h={112}><He x={240} y={615} bold size={16}>חסר BRCA + עיכוב PARP = קטלניות סינתטית</He><He x={240} y={644} size={15}>ללא מעכב: שני סוגי התאים יכולים לשרוד</He><He x={240} y={676} size={14} color={MUTED}>מודל מפושט; רעילות ועמידות אפשריות גם בטיפול בפועל</He></DPanel>
</DSvg>;}
function DPsych() {
  const rng=DRng(220112),common=Array.from({length:56},()=>({x:290+rng()*145,y:359-rng()*42})),rare=Array.from({length:14},()=>({x:72+rng()*125,y:180+rng()*58}));
  return <DSvg h={620} label="סכמה של ארכיטקטורה גנטית פסיכיאטרית: הרבה וריאנטים שכיחים בעלי השפעה קטנה לצד CNV ווריאנטים נדירים בעלי השפעה גדולה יותר">
    <He x={240} y={28} bold size={18}>רצף של שכיחויות והשפעות</He><He x={240} y={56} size={14} color={MUTED}>מפת מושגים; הנקודות אינן אומדנים ממחקר</He>
    <path d="M57 85V390H450" stroke={INK} fill="none" strokeWidth={1.8}/><He x={25} y={240} size={14} rotate={-90}>גודל השפעה על הסיכון</He>
    <He x={264} y={427} size={15}>שכיחות הווריאנט באוכלוסייה</He><He x={85} y={456} size={14}>נדיר</He><He x={418} y={456} size={14}>שכיח</He>
    <rect x={285} y={306} width={157} height={64} rx={23} fill="#dbeafe"/><rect x={67} y={176} width={139} height={69} rx={16} fill="#ffedd5"/>
    {common.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={3} fill={BLUE} fillOpacity={.8}/>)}{rare.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={4} fill={ORANGE}/>)}
    <He x={359} y={259} bold size={16}>רבים, השפעה קטנה</He><La x={359} y={283} size={14} color={BLUE}>common SNPs · GWAS</La>
    <He x={145} y={277} bold size={15}>נדירים יותר</He><He x={145} y={302} bold size={15}>השפעה גדולה יותר</He><La x={145} y={328} size={14} color={ORANGE}>CNVs / de novo LoF</La>
    <rect x={67} y={96} width={139} height={74} rx={9} fill="white" stroke={D_LINE} strokeDasharray="4 4"/>
    <He x={136} y={117} size={14} bold>מנדלי קלאסי</He><He x={136} y={140} size={13}>נדיר, חדירות גבוהה</He><He x={136} y={162} size={13}>מעט דוגמאות</He>
    <La x={142} y={258} size={14} bold>22q11.2 / 16p11.2</La>
    <rect x={289} y={97} width={150} height={107} rx={12} fill="white" stroke={D_LINE} strokeDasharray="5 4"/><He x={364} y={125} size={14}>שכיח וגם חזק?</He><He x={364} y={154} size={14}>מעט דוגמאות</He><He x={364} y={182} size={14} color={MUTED}>בהפרעות נפש שכיחות</He>
    <DPanel y={486} h={115}><He x={240} y={516} bold size={16}>השפעה גדולה יותר אינה גורל</He><He x={240} y={545} size={15}>חדירות חלקית: רוב נושאי CNV אינם מפתחים כל אבחנה</He><He x={240} y={574} size={15}>פליאוטרופיה: אותו וריאנט יכול להשפיע על כמה תכונות</He></DPanel>
  </DSvg>;
}

export const DISEASE_FIGURES:Record<string,{el:()=>React.ReactElement;captionHe:string}>={
  "hg-liability-threshold":{el:DLiability,captionHe:"מודל מחושב להמחשה: נטייה N(0,1) באוכלוסייה ו־N(0.8,1) באחים של חולה, עם סף משותף 2. השטחים מעבר לסף הם 2.28% ו־11.51%. אלה פרמטרי הדגמה, לא אומדני מחלה מסוימת."},
  "hg-manhattan-ld":{el:DManhattan,captionHe:"נתונים מדומים וניתנים לשחזור: מנהטן ל־22 כרומוזומים ותקריב לוקוס בכרומוזום 5. סף p=5×10⁻⁸ הוא ‎−log₁₀(p)=7.30. הצבע בתקריב מציין r² עם הווריאנט המוביל; LD אינו הוכחת סיבתיות."},
  "hg-mtdna-map":{el:DMtMap,captionHe:"מפת גנים מקורית לפי קואורדינטות rCRS, ‏NC_012920.1, באורך 16,569 בסיסים. חלבונים צבועים לפי קומפלקס; tRNA בירוק ו־rRNA בחום. ATP8 ו־ND4L הוסטו למסילה פנימית כדי להציג חפיפות. אותיות A–D מציינות וריאנטים מייצגים, לא את כל גורמי המחלה."},
  "hg-mito-bottleneck":{el:DBottleneck,captionHe:"צוואר בקבוק אפקטיבי ודגימה אקראית ממחישים שונות בהטרופלסמיה. בדוגמת היחידה: אם 35% בדם, בת 8% בדם ובן 96% בשריר — רקמות שונות שאינן בנות החלפה. 50% הוא דוגמה נוספת בלבד. הביציות ומדגם הנקודות סכמטיים; אחוזי הילדים אינם מדידות בביציות. סף 80% להמחשה בלבד, ללא תחזית למשפחה או סף מוכח לווריאנט מסוים."},
  "hg-metabolic-block":{el:DMetabolic,captionHe:"חסר בפעילות אנזים מפחית את המעבר ממצע לתוצר ועשוי להגביר מסלול צדדי. ב־PKU, ‏PAH משתמש ב־BH₄ ובחמצן להמרת פנילאלנין לטירוזין; פנילאלנין גבוה הוא גורם מרכזי לנזק המוחי. תגובות הצד והסטוכיומטריה פושטו."},
  "hg-lysosomal-storage":{el:DLysosomal,captionHe:"סכמה תאית: חסר Hex A בטיי־זקס מוביל לאגירת GM2 בנוירונים; חסר GCase בגושה גורם לאגירת גלוקוצרברוזיד, בעיקר במקרופאגים. אנזים חלופי לגושה נקלט באמצעות סוכרי מנוז חשופים; M6P הוא מנגנון מיון וקליטה ליזוזומלי כללי. חלבון הניתן לווריד אינו עובר ביעילות את מחסום הדם־מוח."},
  "hg-oncogene-tsg":{el:DOncogene,captionHe:"הדגם הקלאסי: רווח תפקוד אונקוגני יכול לפעול בעותק אחד; אובדן תפקוד RB1 דורש שתי מכות באותה שושלת תאים. LOH יכול להתרחש עם חסר עותק או בלי שינוי במספר העותקים. מודל שתי המכות אינו כלל מוחלט לכל גן מדכא גידול, ואינו מתאר לבדו את כל שלבי יצירת הסרטן."},
  "hg-synthetic-lethality":{el:DSynthetic,captionHe:"מודל מפושט של רגישות יחסית למעכבי PARP: נזק ומלכוד PARP מפריעים לשכפול; תא עם BRCA מתפקד יכול להפעיל רקומבינציה הומולוגית, וגידול עם חסר דו־אללי ב־BRCA רגיש יותר. הישרדות יחסית של תאי הגוף אינה הבטחה להיעדר רעילות; תיתכן עמידות בגידול."},
  "hg-psych-architecture":{el:DPsych,captionHe:"מפה מושגית, ללא קנה מידה מספרי: וריאנטים שכיחים רבים תורמים כל אחד מעט, ולצדם CNVs ווריאנטים נדירים בעלי השפעה גדולה יותר. 22q11.2 ו־16p11.2 הם דוגמאות לסיכון ולפליאוטרופיה, ולא גנים לאבחנה אחת. מיקום וספירת הנקודות אינם נתוני שכיחות או חדירות."},
};


const SXRED = '#b91c1c';
function SXsvg({ h, label, children }: { h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}>{children}</svg>;
}
function SXline({ x1, y1, x2, y2, color = MUTED, stop = false, dash = false }: { x1: number; y1: number; x2: number; y2: number; color?: string; stop?: boolean; dash?: boolean }) {
  const a = Math.atan2(y2-y1, x2-x1), s = 7;
  return <g stroke={color} strokeWidth={1.8} fill="none"><line {...{x1,y1,x2,y2}} strokeDasharray={dash?'5 4':undefined}/>{stop ? <line x1={x2+5*Math.sin(a)} y1={y2-5*Math.cos(a)} x2={x2-5*Math.sin(a)} y2={y2+5*Math.cos(a)}/> : <path d={`M${x2-s*Math.cos(a-.5)} ${y2-s*Math.sin(a-.5)}L${x2} ${y2}L${x2-s*Math.cos(a+.5)} ${y2-s*Math.sin(a+.5)}`}/>}</g>;
}
function SXpanel({ y, h, children }: { y: number; h: number; children: React.ReactNode }) {return <g><rect x={12} y={y} width={456} height={h} rx={14} fill="#f8fafc" stroke="#cbd5e1"/>{children}</g>;}
function SXbox({ x, y, w = 180, en, he, color = BLUE }: { x: number; y: number; w?: number; en?: string; he?: string; color?: string }) {return <g><rect x={x} y={y} width={w} height={56} rx={9} fill="white" stroke={color}/>{en&&<La x={x+w/2} y={y+(he?23:34)} size={16} bold color={color}>{en}</La>}{he&&<He x={x+w/2} y={y+(en?45:34)} size={15} color={color}>{he}</He>}</g>;}

function SXsexPathway() {
  return <SXsvg h={1268} label="רשת קביעת הגונדה: SRY ו-SF1 מפעילים SOX9, משוב חיובי מתחרה במסלול השחלה; אחר כך AMH, טסטוסטרון ו-DHT פועלים על איברי מטרה נפרדים">
    <He x={240} y={27} size={17} bold>קביעת הגונדה קודמת לפעולת ההורמונים</He>
    <SXpanel y={44} h={590}>
      <SXbox x={120} y={62} w={240} he="גונדה דו־פוטנציאלית" color={INK}/>
      <SXline x1={176} y1={118} x2={120} y2={153} color={BLUE}/><SXline x1={305} y1={118} x2={360} y2={153} color={GREEN}/>
      <SXbox x={30} y={160} en="SRY + SF1" he="הטיית תאי התמיכה לאשך"/>
      <SXbox x={270} y={160} en="WNT4 + RSPO1" he="קידום המסלול השחלתי" color={GREEN}/>
      <SXline x1={120} y1={216} x2={120} y2={254} color={BLUE}/><SXline x1={360} y1={216} x2={360} y2={254} color={GREEN}/>
      <SXbox x={30} y={262} en="SOX9"/>
      <SXbox x={270} y={262} en="β-catenin" color={GREEN}/>
      <SXline x1={210} y1={280} x2={270} y2={280} color={SXRED} stop/>
      <SXline x1={270} y1={302} x2={210} y2={302} color={SXRED} stop/>
      <He x={240} y={343} size={14} color={SXRED}>דיכוי הדדי בין התוכניות</He>
      <SXbox x={30} y={374} en="FGF9 + PGD₂" he="חיזוק פעילות וביטוי SOX9"/>
      <SXline x1={120} y1={318} x2={120} y2={365} color={BLUE}/>
      <path d="M30 402H21V289H30" stroke={BLUE} strokeWidth={1.8} fill="none"/><SXline x1={21} y1={289} x2={30} y2={289} color={BLUE}/>
      <SXbox x={270} y={374} en="FOXL2" he="זהות שחלתית ותחזוקתה" color={GREEN}/>
      <He x={360} y={457} size={14} color={GREEN}>פועל לצד מסלול β-קטנין</He>
      <path d="M450 290H459V516H450" fill="none" stroke={GREEN} strokeWidth={1.8}/><SXline x1={459} y1={516} x2={450} y2={516} color={GREEN}/>
      <SXline x1={360} y1={469} x2={360} y2={480} color={GREEN}/>
      <SXline x1={120} y1={430} x2={120} y2={478} color={BLUE}/>
      <SXbox x={30} y={488} he="תאי סרטולי באשך"/>
      <SXbox x={270} y={488} he="תאי גרנולוזה בשחלה" color={GREEN}/>
      <He x={240} y={576} size={14} color={MUTED}>רשת מפושטת; חלק מהראיות מקורן בעכבר</He>
      <He x={240} y={602} size={14} color={MUTED}>המסלולים מייצגים תוכניות, לא קשרי DNA ישירים</He>
    </SXpanel>
    <He x={240} y={668} size={17} bold>שלושה אותות — שלוש תוצאות</He>
    <SXpanel y={687} h={128}>
      <SXbox x={30} y={704} w={180} en="Sertoli → AMH" he="תאי סרטולי"/>
      <SXline x1={210} y1={732} x2={257} y2={732} color={BLUE}/>
      <He x={355} y={728} size={15} bold>נסיגת צינורות מילר</He><He x={355} y={755} size={15}>ללא רחם וחצוצרות</He>
      <He x={240} y={796} size={14} color={MUTED}>מסלול זה אינו תלוי בקולטן לאנדרוגנים</He>
    </SXpanel>
    <SXpanel y={833} h={160}>
      <SXbox x={30} y={852} w={180} en="Leydig → T" he="תאי ליידיג: טסטוסטרון"/>
      <SXline x1={210} y1={880} x2={257} y2={880} color={BLUE}/>
      <SXbox x={270} y={852} w={180} en="AR" he="קולטן לאנדרוגנים" color={ORANGE}/>
      <He x={240} y={944} size={15} bold>התפתחות צינורות וולף</He><He x={240} y={974} size={14}>אפידידימיס, צינור הזרע ושלפוחיות הזרע</He>
    </SXpanel>
    <SXpanel y={1011} h={188}>
      <La x={75} y={1050} size={16} bold>T</La><SXline x1={100} y1={1045} x2={192} y2={1045} color={BLUE}/><La x={238} y={1050} size={16} bold>DHT</La><SXline x1={274} y1={1045} x2={362} y2={1045} color={ORANGE}/><La x={402} y={1050} size={16} bold color={ORANGE}>AR</La>
      <He x={145} y={1083} size={14}>5α־רדוקטאז</He>
      <He x={240} y={1128} size={16} bold>התפתחות איברי מין חיצוניים זכריים</He><He x={240} y={1156} size={16} bold>והערמונית</He><He x={240} y={1182} size={14} color={MUTED}>המרת ההורמון מתרחשת ברקמות המטרה</He>
    </SXpanel>
    <SXline x1={36} y1={1230} x2={70} y2={1230}/><He x={126} y={1235} size={14}>הפעלה / תהליך</He><SXline x1={275} y1={1230} x2={309} y2={1230} color={SXRED} stop/><He x={356} y={1235} size={14}>דיכוי</He>
  </SXsvg>;
}

function SXcahPathway() {
  return <SXsvg h={1275} label="חסר 21 הידרוקסילאז חוסם שתי תגובות: פרוגסטרון ל-DOC ו-17OHP ל-11 דיאוקסיקורטיזול; קורטיזול נמוך, ACTH ואנדרוגנים גבוהים. המרה גנית וחסר באזור CYP21 מוצגים בנפרד">
    <He x={240} y={28} size={17} bold>חסר 21־הידרוקסילאז: שתי תגובות חסומות</He>
    <SXpanel y={45} h={580}>
      <He x={130} y={76} size={16} bold>מסלול מינרלוקורטיקואידי</He><He x={350} y={76} size={16} bold>מסלול גלוקוקורטיקואידי</He>
      <SXbox x={36} y={99} w={190} en="Progesterone" he="פרוגסטרון"/>
      <SXbox x={254} y={99} w={190} en="17-OHP ↑" he="17־הידרוקסיפרוגסטרון" color={ORANGE}/>
      {[131,349].map(x=><g key={x}><SXline x1={x} y1={155} x2={x} y2={234} color={MUTED}/><path d={`M${x-9} 182l18 18m0-18-18 18`} stroke={SXRED} strokeWidth={3}/></g>)}
      <La x={69} y={195} size={14} color={SXRED}>21-OH</La><La x={410} y={195} size={14} color={SXRED}>21-OH</La>
      <He x={240} y={222} size={14} color={SXRED}>האנזים המקודד בגן CYP21A2</He>
      <SXbox x={36} y={245} w={190} en="DOC" he="11־דיאוקסיקורטיקוסטרון" color={MUTED}/>
      <SXbox x={254} y={245} w={190} en="11-Deoxycortisol" he="11־דיאוקסיקורטיזול" color={MUTED}/>
      <SXline x1={131} y1={301} x2={131} y2={352} color={MUTED} dash/><SXline x1={349} y1={301} x2={349} y2={352} color={MUTED}/>
      <He x={240} y={337} size={14} color={MUTED}>תגובות נוספות</He>
      <SXbox x={36} y={364} w={190} en="Aldosterone ↓" he="בצורה מאבדת המלח" color={SXRED}/>
      <SXbox x={254} y={364} w={190} en="Cortisol ↓" he="חסר משוב שלילי" color={SXRED}/>
      <SXline x1={349} y1={420} x2={349} y2={460} color={ORANGE}/>
      <SXbox x={254} y={472} w={190} en="ACTH ↑" he="גירוי קליפת יותרת הכליה" color={ORANGE}/>
      <He x={133} y={468} size={15} color={SXRED}>סיכון לאובדן מלח</He><He x={133} y={495} size={15} color={SXRED}>בחסר אנזימטי חמור</He>
      <SXline x1={349} y1={532} x2={349} y2={548} color={ORANGE}/>
      <SXbox x={254} y={552} w={190} en="Androgens ↑" he="ייצור אנדרוגנים מוגבר" color={ORANGE}/>
      <path d="M444 127H458V580H449" fill="none" stroke={ORANGE} strokeWidth={1.8} strokeDasharray="5 4"/><SXline x1={449} y1={580} x2={444} y2={580} color={ORANGE}/>
      <He x={133} y={555} size={14}>ניתוב מצעים שהצטברו</He><He x={133} y={581} size={14} color={MUTED}>מסלולים מרובי שלבים</He><He x={133} y={607} size={14} color={MUTED}>לא רק דרך 17־OHP</He>
    </SXpanel>
    <SXpanel y={645} h={120}>
      <He x={240} y={675} size={16} bold>בצורה הקלאסית בעוברית 46,XX</He><He x={240} y={706} size={15}>אנדרוגנים אדרנליים עלולים לשנות איברי מין חיצוניים</He><He x={240} y={738} size={15} color={GREEN}>השחלות והרחם מתפתחים; אין מסלול AMH אשכי</He>
    </SXpanel>
    <SXpanel y={784} h={440}>
      <He x={240} y={815} size={17} bold>מדוע הפסאודוגן הוא מקור לווריאנטים?</He>
      <He x={240} y={844} size={14} color={MUTED}>אזור RCCX בכרומוזום 6 — תרשים חלקי, ללא קנה מידה</He>
      <path d="M165 899H179M300 899H315" stroke={MUTED} strokeWidth={3} fill="none"/>
      <SXbox x={30} y={871} w={135} en="CYP21A1P" he="פסאודוגן" color={ORANGE}/>
      <rect x={179} y={880} width={121} height={39} rx={5} fill="#e2e8f0"/>
      <He x={239} y={904} size={14}>גנים נוספים</He>
      <SXbox x={315} y={871} w={135} en="CYP21A2" he="גן פעיל" color={BLUE}/>
      <He x={240} y={955} size={14}>למשל TNXA, RP2 ו־C4B נמצאים ביניהם</He>
      <path d="M97 974V1006H382V974" fill="none" stroke={ORANGE} strokeWidth={1.8}/><SXline x1={382} y1={985} x2={382} y2={974} color={ORANGE}/>
      <He x={240} y={1038} size={15} bold color={ORANGE}>המרה גנית</He><He x={240} y={1066} size={14}>העברת רצף מהפסאודוגן עשויה לפגוע בגן הפעיל</He>
      <He x={240} y={1110} size={15} bold color={SXRED}>שחלוף לא שווה</He><He x={240} y={1139} size={14}>עשוי ליצור חסר וגן כלאיים</He><He x={240} y={1167} size={14}>חומרת הפגיעה תלויה בגבולות ובתוכן המקטע</He>
      <He x={240} y={1200} size={14} color={MUTED}>לא כל גן כלאיים הוא חסר פעילות לחלוטין</He>
    </SXpanel>
    <He x={240} y={1255} size={14} color={MUTED}>× תגובה חסומה · ↓ ירידה · ↑ עלייה · חצים מקווקווים: כמה שלבים</He>
  </SXsvg>;
}

export const SEX_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  'hg-sex-pathway': { el: SXsexPathway, captionHe: 'רשת מפושטת לקביעת הגונדה ומסלולי ההורמונים שבאים אחריה. חץ: הפעלה או תהליך; קצה שטוח: דיכוי. FGF9 ו־PGD₂ מחזקים את SOX9; מסלול השחלה פעיל בפני עצמו. חלק מהקשרים מבוססים גם על מחקר בעכבר; התרשים אינו מפה מלאה של קישור גורמי שעתוק.' },
  'hg-cah-pathway': { el: SXcahPathway, captionHe: 'CAH מחסר 21־הידרוקסילאז: חסימת שתי תגובות מפחיתה סינתזת קורטיזול, ובמחלה חמורה גם אלדוסטרון. התרשים מתאר בעיקר את הצורה הקלאסית; חומרת החסר משתנה. מסלולי האנדרוגנים ושלבי יצירת האלדוסטרון קוצרו. מפת RCCX חלקית ומדגישה שהגן והפסאודוגן מופרדים בגנים נוספים; תוצאת רקומבינציה תלויה במקטע שהוחלף.' },
};

const HGPURPLE = "#7c3aed", HGRED = "#b91c1c", HGTEAL = "#0f766e";
function HGsvg({h,label,children}:{h:number;label:string;children:React.ReactNode}) {return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}><title>{label}</title>{children}</svg>;}
function HGline({x1,y1,x2,y2,color=MUTED,dash=false,width=1.5}:{x1:number;y1:number;x2:number;y2:number;color?:string;dash?:boolean;width?:number}) {return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash?'4 4':undefined}/>;}
function HGarrow({x1,y1,x2,y2,color=MUTED}:{x1:number;y1:number;x2:number;y2:number;color?:string}) {const a=Math.atan2(y2-y1,x2-x1),s=6;return <g><HGline {...{x1,y1,x2,y2,color}}/><path d={`M${x2-s*Math.cos(a-.5)} ${y2-s*Math.sin(a-.5)}L${x2} ${y2}L${x2-s*Math.cos(a+.5)} ${y2-s*Math.sin(a+.5)}`} fill="none" stroke={color} strokeWidth={1.5}/></g>;}
function HGbox({x,y,w,h=50,en,he,color=BLUE}:{x:number;y:number;w:number;h?:number;en?:string;he?:string;color?:string}) {return <g><rect x={x} y={y} width={w} height={h} rx={8} fill={color} fillOpacity={.06} stroke={color}/>{en&&<La x={x+w/2} y={y+(he?21:h/2+5)} size={15} bold color={color}>{en}</La>}{he&&<He x={x+w/2} y={y+(en?41:h/2+5)} size={14} color={color}>{he}</He>}</g>;}
function HGchrom({x,y,prox,dist}:{x:number;y:number;prox:string;dist:string}) {return <g><rect x={x} y={y} width={12} height={32} rx={5} fill={prox}/><rect x={x} y={y+33} width={12} height={36} rx={5} fill={prox}/><circle cx={x+6} cy={y+33} r={4} fill="white" stroke={INK}/><rect x={x} y={y+70} width={12} height={27} rx={4} fill={dist}/></g>;}
function HGtranslocation(){
 const gamete=(x:number,y:number,pairs:[string,string][],title:string,sub:string,color:string)=><g><rect x={x} y={y} width={210} height={162} rx={12} fill={color} fillOpacity={.035} stroke={color}/><He x={x+105} y={y+23} size={16} bold color={color}>{title}</He>{pairs.map(([p,d],i)=><g key={i}><HGchrom x={x+67+i*62} y={y+36} prox={p==='A'?BLUE:ORANGE} dist={d==='a'?BLUE:ORANGE}/><La x={x+73+i*62} y={y+151} size={14}>{p+d}</La></g>)}<He x={x+105} y={y+187} size={14} color={color}>{sub}</He></g>;
 return <HGsvg h={1050} label="נשא טרנסלוקציה הדדית: ארבעה כרומוזומים מזדווגים בצלב פכיטן; הפרדה חלופית יוצרת גמטה תקינה או מאוזנת, adjacent-1 יוצרת חסר ועודף הדדיים">
 <He x={240} y={25} size={18} bold>כל החומר קיים — חלקו החליף כרומוזום</He>
 {[['A','a'],['B','b'],['A','b'],['B','a']].map(([p,d],i)=><g key={i}><HGchrom x={70+i*107} y={48} prox={p==='A'?BLUE:ORANGE} dist={d==='a'?BLUE:ORANGE}/><La x={76+i*107} y={166} size={15}>{p+d}</La></g>)}
 <He x={240} y={197} size={14}>כחול: כרומוזום A · כתום: כרומוזום B</He><He x={240} y={227} size={17} bold>פכיטן: הומולוגיה מסדרת צלב</He>
 <path d="M90 315H350" fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round"/>
 <path d="M250 265V407" fill="none" stroke={ORANGE} strokeWidth={8} strokeLinecap="round"/>
 <path d="M90 330H232" fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round"/><path d="M232 330V407" fill="none" stroke={ORANGE} strokeWidth={8} strokeLinecap="round"/>
 <path d="M265 265V300" fill="none" stroke={ORANGE} strokeWidth={8} strokeLinecap="round"/><path d="M265 300H350" fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round"/>
 <La x={56} y={327} size={15} color={BLUE}>A</La><La x={382} y={315} size={15} color={BLUE}>a</La><La x={258} y={248} size={15} color={ORANGE}>B</La><La x={240} y={432} size={15} color={ORANGE}>b</La>
 <He x={240} y={458} size={13} color={MUTED}>סכמת זיווג; כל קו מייצג כרומוזום משוכפל</He>
 {gamete(16,481,[['A','a'],['B','b']],'תקינה','חלופית: כל מקטע פעם אחת',GREEN)}{gamete(254,481,[['A','b'],['B','a']],'נשאית מאוזנת','חלופית: כל מקטע פעם אחת',GREEN)}
 <He x={240} y={709} size={16} bold color={HGRED}>הפרדה סמוכה: גמטות לא מאוזנות</He>
 {gamete(16,733,[['A','a'],['B','a']],'עודף a, חסר b','שני קטעי a, ללא b',HGRED)}{gamete(254,733,[['A','b'],['B','b']],'חסר a, עודף b','ללא a, שני קטעי b',HGRED)}
 <La x={240} y={962} size={16} color={HGRED}>Aa + Ba → 2a, 0b · Ab + Bb → 0a, 2b</La>
 <He x={240} y={997} size={14}>אחרי הפריה תקינה: טריזומיה ומונוזומיה חלקיות</He><He x={240} y={1027} size={13} color={MUTED}>אין כאן הסתברויות; קיימות גם הפרדות אחרות</He>
 </HGsvg>;}
function HGnahr(){
 const repeat=(x:number,y:number)=><path d={`M${x} ${y-10}h23l10 10-10 10h-23z`} fill={HGPURPLE}/>;
 const seg=(x:number,y:number,w:number)=> <rect x={x} y={y-6} width={w} height={12} rx={3} fill={BLUE}/>;
 return <HGsvg h={517} label="NAHR בין חזרות באותו כיוון שהתיישרו בהיסט יוצר חסר ושכפול הדדיים: 22q11.2 כשלושה Mb, 7q11.23 כאחד וחצי Mb">
 <He x={240} y={25} size={18} bold>אותו רצף — מיקום לא אללי</He><He x={240} y={53} size={14}>סגול: חזרות דלות עותקים באותו כיוון</He>
 <HGline x1={34} y1={99} x2={389} y2={99}/>{repeat(60,99)}{seg(99,99,146)}{repeat(251,99)}
 <HGline x1={94} y1={161} x2={449} y2={161}/>{repeat(251,161)}{seg(289,161,93)}{repeat(388,161)}
 <HGline x1={267} y1={115} x2={267} y2={145} color={HGPURPLE} dash/><He x={159} y={140} size={14} color={HGPURPLE}>יישור שגוי</He><HGarrow x1={240} y1={185} x2={240} y2={218}/>
 <He x={240} y={244} size={16} bold color={HGRED}>חסר: עותק אחד של החזרה, ללא המקטע</He><HGline x1={54} y1={272} x2={425} y2={272}/>{repeat(221,272)}
 <He x={240} y={315} size={16} bold color={BLUE}>שכפול הדדי: שתי יחידות רצופות</He><HGline x1={34} y1={344} x2={449} y2={344}/>{repeat(47,344)}{seg(86,344,124)}{repeat(216,344)}{seg(255,344,124)}{repeat(385,344)}
 <HGbox x={22} y={389} w={205} en="22q11.2 · ~3 Mb" he="חסר הכולל TBX1" color={HGTEAL}/><HGbox x={253} y={389} w={205} en="7q11.23 · ~1.5 Mb" he="ויליאמס · כולל ELN" color={HGTEAL}/>
 <He x={240} y={474} size={14}>כחול: האזור שבין החזרות; הקווים הם DNA</He><He x={240} y={501} size={13} color={MUTED}>סכמטי, לא בקנה מידה; מוצגות כרומטידות משתתפות</He>
 </HGsvg>;}
function HGpositional(){
 const hap=(y:number,left:number,right:number,lab:string)=><g><HGline x1={115} y1={y} x2={435} y2={y} color={MUTED} width={7}/><HGline x1={left} y1={y} x2={right} y2={y} color={BLUE} width={7}/><He x={63} y={y+5} size={14}>{lab}</He></g>;
 return <HGsvg h={790} label="שיבוט לפי מיקום: אילן משפחה ותאחיזה, רקומביננטים תוחמים אזור מועמד בין סמנים, חיפוש גנים ואימות וריאנטים במשפחות לא קשורות; נקודת שבר יכולה לקצר את הדרך">
 <He x={240} y={25} size={18} bold>מהתורשה במשפחה אל גן המחלה</He>
 <rect x={147} y={53} width={28} height={28} fill={BLUE} stroke={INK}/><circle cx={302} cy={67} r={14} fill="white" stroke={INK}/>
 <HGline x1={178} y1={67} x2={284} y2={67}/><path d="M231 67V107M146 107H318M146 107V128M231 107V128M318 107V128" fill="none" stroke={INK} strokeWidth={1.5}/>
 <circle cx={146} cy={146} r={14} fill={BLUE} stroke={INK}/><rect x={217} y={132} width={28} height={28} fill="white" stroke={INK}/><rect x={304} y={132} width={28} height={28} fill={BLUE} stroke={INK}/>
 <He x={240} y={192} size={14}>מלא = חולה · בדיקת סמנים ותאחיזה</He><La x={240} y={219} size={15} bold color={BLUE}>LOD ≥ 3 → odds ≥ 1,000:1</La>
 <HGarrow x1={240} y1={231} x2={240} y2={254}/><He x={240} y={281} size={16} bold>שחלופים משני הצדדים מצמצמים את האזור</He>
 {hap(313,115,435,'חולה 1')}{hap(352,210,435,'חולה 2')}{hap(391,115,350,'חולה 3')}
 <rect x={212} y={300} width={136} height={105} fill={BLUE} fillOpacity={.08}/><La x={210} y={435} size={14}>L</La><La x={350} y={435} size={14}>R</La><He x={280} y={435} size={13} color={BLUE}>האזור המשותף</He><HGarrow x1={280} y1={449} x2={280} y2={475}/>
 {['G1','G2','G3'].map((g,i)=><HGbox key={g} x={146+i*99} y={486} w={86} en={g} color={i===1?HGTEAL:MUTED}/>)}
 <HGbox x={18} y={475} w={112} h={73} he="נקודת שבר" en="Xp21" color={ORANGE}/><HGarrow x1={135} y1={518} x2={141} y2={518} color={ORANGE}/>
 <He x={240} y={582} size={15} bold>מועמד: וריאנטים שונים באותו גן</He><HGbox x={18} y={608} w={202} en="Family A · G2: v1" he="משפחה אחת" color={HGTEAL}/><HGbox x={260} y={608} w={202} en="Family B · G2: v2" he="משפחה בלתי קשורה" color={HGTEAL}/>
 <He x={240} y={702} size={14}>בודקים הפרדה, שכיחות וניסוי תפקודי</He><He x={240} y={736} size={13} color={MUTED}>אילן, סמנים ו־G1–G3 להמחשה; לא משפחה אמיתית</He><He x={240} y={765} size={13} color={MUTED}>המסלול הכרומוזומלי עשוי לדלג על מיפוי התאחיזה</He>
 </HGsvg>;}
function HGexome(){
 const steps=[['עשרות אלפים','כל הווריאנטים באקסום'],['אלפים','משני חלבון או שחבור'],['מאות','נדירים במאגרי אוכלוסייה'],['בודדים','מתאימים לדפוס ההורשה'],['גן משותף','במשפחות בלתי קשורות']];
 return <HGsvg h={819} label="משפך סינון אקסום: עשרות אלפים לאלפים משני חלבון או שחבור, מאות נדירים, בודדים לפי תורשה וגן משותף במשפחות. מיפוי הומוזיגוטיות מצמצם את האזור במשפחה רצסיבית">
 <He x={240} y={25} size={18} bold>פחות מועמדים — יותר ראיות</He>
 {steps.map(([n,s],i)=>{const y=51+i*91,w=430-i*52;return <g key={n}><path d={`M${240-w/2} ${y}H${240+w/2}L${240+w/2-17} ${y+62}H${240-w/2+17}Z`} fill={i===4?HGTEAL:BLUE} fillOpacity={.07+i*.025} stroke={i===4?HGTEAL:BLUE}/><He x={240} y={y+25} size={17} bold>{n}</He><He x={240} y={y+49} size={14}>{s}</He>{i<4&&<HGarrow x1={240} y1={y+66} x2={240} y2={y+83}/>}</g>;})}
 <He x={240} y={537} size={14}>חדש בטריו · הומוזיגוטי או שני וריאנטים ב־trans</He><He x={240} y={580} size={17} bold>חלון נוסף: מיפוי הומוזיגוטיות</He>
 {[0,1,2].map(i=><g key={i}><He x={58} y={621+i*39} size={14}>{i<2?`חולה ${i+1}`:'בריא'}</He><HGline x1={117} y1={616+i*39} x2={443} y2={616+i*39} color={MUTED} width={7}/><rect x={i<2?213:331} y={609+i*39} width={i<2?115:65} height={14} rx={3} fill={i<2?HGTEAL:ORANGE}/></g>)}
 <He x={240} y={746} size={14} color={HGTEAL}>ירוק: קטע הומוזיגוטי משותף לחולים</He><He x={240} y={783} size={13} color={MUTED}>הסדרים מהיחידה; רוחב המשפך אינו סולם כמותי</He><He x={240} y={807} size={13} color={MUTED}>קטע משותף תומך במועמד — אינו מוכיח פתוגניות</He>
 </HGsvg>;}
function HGresolution(){
 const sx=(n:number)=>43+Math.log10(n)/8*394,ticks=[1,1e2,1e4,1e6,1e8];
 const rows=[{en:'Karyotype',he:'מספר ומבנה כרומוזומים',n:1e7,color:BLUE},{en:'FISH',he:'אזור ידוע · גלאי ממוקד',n:1e6,color:HGPURPLE},{en:'CMA',he:'חסר או שכפול של קטע',n:1e5,color:HGTEAL},{en:'MLPA',he:'מינון אקסון בגלאים שנבחרו',n:1e2,color:ORANGE},{en:'Sanger / NGS',he:'רצף: שינוי בבסיס יחיד',n:1,color:GREEN}];
 return <HGsvg h={809} label="קני מידה מייצגים לבדיקות גנטיות על סולם לוגריתמי מבסיס לכרומוזום: קריוטיפ, FISH, CMA, MLPA וריצוף. נקודות הן דוגמאות ולא ספי רזולוציה; CMA מפספס שינוי מאוזן וריצוף רגיל חזרות ומתילציה">
 <He x={240} y={25} size={18} bold>איזה סוג שינוי מחפשים?</He><He x={240} y={54} size={14}>גודל שינוי DNA: מבסיס יחיד עד כרומוזום</He><HGline x1={43} y1={90} x2={437} y2={90}/>
 {ticks.map((n,i)=><g key={n}><HGline x1={sx(n)} y1={84} x2={sx(n)} y2={96}/><La x={sx(n)} y={120} size={14}>{['1 bp','100 bp','10 kb','1 Mb','100 Mb'][i]}</La></g>)}
 {rows.map((r,i)=>{const y=151+i*83;return <g key={r.en}><rect x={18} y={y} width={444} height={69} rx={8} fill={r.color} fillOpacity={.04}/><La x={240} y={y+23} size={17} bold color={r.color}>{r.en}</La><He x={240} y={y+49} size={14}>{r.he}</He><circle cx={sx(r.n)} cy={y+22} r={6} fill={r.color}/></g>;})}
 <He x={240} y={603} size={13} color={MUTED}>הנקודות מדגימות קנה מידה; אינן ספי גילוי</He><He x={240} y={631} size={13} color={MUTED}>הרזולוציה תלויה בכיסוי, בגלאים ובפרוטוקול</He>
 <HGbox x={20} y={655} w={440} h={52} en="CMA" he="שינוי מאוזן: אין שינוי בכמות → עלול להיעלם" color={HGRED}/><HGbox x={20} y={728} w={440} h={52} en="Standard short-read NGS" he="חזרות ומתילציה דורשות בדיקה מתאימה" color={HGRED}/>
 </HGsvg>;}
export const MAPPING_FIGURES:Record<string,{el:()=>React.ReactElement;captionHe:string}>={
 'hg-translocation-segregation':{el:HGtranslocation,captionHe:'קראו את צבעי המקטעים: לנשא כל מקטע פעם אחת. בצלב מזדווגים מקטעים הומולוגיים; בהפרדה חלופית מתקבלות גמטות תקינות או מאוזנות, ובהפרדה סמוכה חסר ועודף. מוצגות תוצאות מייצגות ללא הסתברויות; לא כל אופני ההפרדה מוצגים. הקווים בצלב מייצגים כרומוזומים משוכפלים ללא פירוט כרומטידות.'},
 'hg-nahr':{el:HGnahr,captionHe:'החזרות הסגולות דומות ברצף ובאותו כיוון, אבל אינן אללים באותו מיקום. זיווג בהיסט ושחלוף ביניהן נותנים חסר ושכפול הדדיים של האזור הכחול. הגדלים מהיחידה: כ־3 Mb ב־22q11.2 וכ־1.5 Mb ב־7q11.23; סכמטי ולא בקנה מידה.'},
 'hg-positional-cloning':{el:HGpositional,captionHe:'הקטעים הכחולים הם הפלוטיפ המחלה בדוגמה מומצאת; חולים רקומביננטים משני הצדדים תוחמים את אזור החיפוש בין L ל־R. ממנו עוברים לגנים מועמדים ולראיות ממשפחות בלתי קשורות. נקודת שבר כרומוזומלית כמו Xp21 עשויה לקצר את המיפוי, אך דורשת אימות של הגן והווריאנט.'},
 'hg-exome-filtering':{el:HGexome,captionHe:'שלבי הסינון משתמשים בסדרי הגודל שבטקסט בלבד; אין כאן ספירות מדגם מומצאות. בדיקת דפוס ההורשה וגן משותף במשפחות מצמצמות מועמדים. במיפוי הומוזיגוטיות מחפשים מקטעים משותפים לחולים ממשפחה רצסיבית; מקטע או וריאנט נדיר עדיין אינם הוכחה לפתוגניות.'},
 'hg-test-resolution':{el:HGresolution,captionHe:'הציר לוגריתמי, והנקודות הן קני מידה מייצגים לסוג הממצא בלבד, ולא רזולוציה מובטחת או טווח כיסוי. MLPA בודקת מינון בגלאים שנבחרו; ריצוף בודק בסיסים באזורים המכוסים. CMA אינה מזהה בדרך כלל סידור מאוזן; חזרות ומתילציה דורשות שיטה וניתוח מתאימים. יש לבחור בדיקה לפי סוג השינוי, לא לפי גודלו בלבד.'},
};

export const HUMAN_GENETICS_FIGURES: Record<string,{el:()=>React.ReactElement;captionHe:string}>={...VARIANT_FIGURES,...DISEASE_FIGURES,...SEX_FIGURES,...MAPPING_FIGURES};
