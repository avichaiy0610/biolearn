/* Original textbook-informed schematics. Colors identify roles, not molecular structures. */
import type { ReactNode } from "react";
import { He, La } from "./biochemFigures";

const C = { ink: "#183044", muted: "#526579", blue: "#21649b", teal: "#087e83", orange: "#b85c16", purple: "#7854a6", red: "#ad3244", line: "#d6e2e9" };
function Frame({ h, label, children }: { h: number; label: string; children: ReactNode }) {
  return <svg viewBox={`0 0 400 ${h}`} className="w-full h-auto" role="img" aria-label={label}><rect width={400} height={h} rx={14} fill="#fff" />{children}</svg>;
}
function Panel({ y, h, children }: { y: number; h: number; children: ReactNode }) {
  return <g><rect x={8} y={y} width={384} height={h} rx={12} fill="#f6f9fb" stroke={C.line} />{children}</g>;
}
function H({ x = 200, y, children, color = C.ink, size = 16, bold = false }: { x?: number; y: number; children: ReactNode; color?: string; size?: number; bold?: boolean }) {
  return <He x={x} y={y} size={size} color={color} bold={bold}>{children}</He>;
}
function L({ x, y, children, color = C.ink, size = 15 }: { x: number; y: number; children: ReactNode; color?: string; size?: number }) {
  return <La x={x} y={y} size={size} color={color}>{children}</La>;
}
function Arrow({ x1, y1, x2, y2, color = C.muted }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const a = Math.atan2(y2-y1,x2-x1), r=7;
  return <g><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={color} strokeWidth={2} fill="none" /><path d={`M${x2-r*Math.cos(a-.5)} ${y2-r*Math.sin(a-.5)}L${x2} ${y2}L${x2-r*Math.cos(a+.5)} ${y2-r*Math.sin(a+.5)}`} stroke={color} strokeWidth={2} fill="none" /></g>;
}
function Protein({ x, y, color = C.purple }: { x: number; y: number; color?: string }) {
  return <path d={`M${x-12} ${y-3}q-4-12 9-11q9-8 14 3q12 2 6 12q-1 10-13 8q-13 7-16-5z`} fill={color} opacity={.9} />;
}
function Bases({ x, y, n = 12, color = C.blue }: { x: number; y: number; n?: number; color?: string }) {
  return <g>{Array.from({length:n},(_,i)=><line key={i} x1={x+i*12} x2={x+i*12} y1={y} y2={y+12} stroke={color} strokeOpacity={.4} strokeWidth={2}/>)}</g>;
}

export function GeneClasses() {
  return <Frame h={760} label="שלוש קבוצות גנים במודל הרפס: מיידית מוקדמת, מוקדמת ומאוחרת. חלבוני IE מאפשרים ביטוי E, ושכפול DNA מאפשר ביטוי מאוחר מלא. בדיקות עיכוב מודדות תעתיקים.">
    <H y={28} bold size={20}>שלוש קבוצות — מפל תלות</H>
    <H y={53} size={14} color={C.muted}>מודל קנוני של הרפס · אין כאן שעון אחיד</H>
    <Panel y={70} h={132}>
      <L x={54} y={100} color={C.purple}>IE / α</L><H x={248} y={100} bold color={C.purple}>מיידית־מוקדמת</H>
      <H y={128}>ללא חלבון נגיפי חדש</H>
      <H y={151} size={14}>מכונת התא ± חלבון שהגיע בוויריון</H>
      <Protein x={76} y={178} /><H x={238} y={183} size={14}>תוצר: חלבוני בקרה נגיפיים</H>
    </Panel>
    <Arrow x1={55} y1={210} x2={55} y2={240} color={C.purple}/><H x={224} y={230} size={14} color={C.purple}>חלבוני IE מפעילים את הקבוצה הבאה</H>
    <Panel y={249} h={127}>
      <L x={54} y={279} color={C.teal}>E / β</L><H x={248} y={279} bold color={C.teal}>מוקדמת</H>
      <H y={307}>דורשת חלבוני IE</H><Protein x={76} y={345} color={C.teal}/>
      <H x={241} y={336} size={14}>תוצר: אנזימי שכפול</H><H x={241} y={357} size={14}>למשל פולימראז והליקאז</H>
    </Panel>
    <Arrow x1={55} y1={384} x2={55} y2={414} color={C.teal}/><H x={224} y={404} size={14} color={C.teal}>אנזימי E מאפשרים שכפול של הגנום</H>
    <Panel y={423} h={115}>
      <L x={54} y={453} color={C.orange}>L / γ</L><H x={248} y={453} bold color={C.orange}>מאוחרת</H>
      <H y={482}>ביטוי מלא תלוי בשכפול DNA</H><H y={511} size={14}>תוצר: חלבוני מבנה — קפסיד ומעטפת</H>
    </Panel>
    <H y={568} bold>שתי בדיקות של תלות</H>
    <H x={78} y={597} size={14}>מעכב</H><L x={211} y={597}>IE</L><L x={275} y={597}>E</L><L x={339} y={597}>L</L>
    <rect x={12} y={610} width={376} height={46} rx={8} fill="#ede7f5"/>
    <H x={88} y={630} size={13}>סינתזת חלבון</H><H x={88} y={647} size={12}>(מתחילת ההדבקה)</H>
    <L x={211} y={639} color={C.teal}>+</L><L x={275} y={639} color={C.red}>−</L><L x={339} y={639} color={C.red}>−</L>
    <rect x={12} y={663} width={376} height={43} rx={8} fill="#e4f1f1"/>
    <H x={88} y={690} size={13}>שכפול DNA</H><L x={211} y={690} color={C.teal}>+</L><L x={275} y={690} color={C.teal}>+</L><L x={339} y={690} color={C.red}>−</L>
    <H y={730} size={13}>מדידה: תעתיקים · + מופיעים · − אינם מופיעים</H>
    <H y={750} size={12} color={C.muted}>בקרה: המעכב אינו פוגע ישירות בשעתוק · סכמטי</H>
  </Frame>;
}

export function PrimerTypes() {
  return <Frame h={1120} label="שלוש התחלות: RNA מפרימאז, חלבון שנקשר לנוקלאוטיד הראשון, וקצה DNA מקופל בפרבו וירוס. באדנו וירוס הגדיל המוסט מצופה DBP; זיווג ה-ITR משחזר מוצא לסבב נוסף עם pTP חדש, ואינו התחלה עצמית.">
    <H y={28} bold size={20}>איך מתחילים שרשרת חדשה?</H>
    <H y={52} size={14} color={C.muted}>שלושה מקורות ל־OH שממנו תתחיל ההארכה</H>
    <Panel y={68} h={187}>
      <H y={95} bold color={C.orange}>א · פריימר RNA מפרימאז</H>
      <H y={119} size={14}>פרימאז יוצר RNA; הפולימראז מאריך ממנו</H>
      <L x={34} y={158}>5′</L><path d="M58 155H131" stroke={C.orange} strokeWidth={5}/><path d="M131 155H286" stroke={C.teal} strokeWidth={5}/>
      <Bases x={61} y={160} n={19}/><path d="M58 180H307" stroke={C.blue} strokeWidth={4}/><L x={337} y={184}>5′</L><L x={34} y={184}>3′</L>
      <L x={94} y={145} color={C.orange}>RNA</L><L x={213} y={145} color={C.teal}>DNA</L><L x={330} y={153} color={C.teal}>3′-OH</L>
      <Arrow x1={160} y1={201} x2={275} y2={201} color={C.teal}/><H x={88} y={207} size={13}>הארכה</H>
      <H y={237} size={14}>ה־RNA מוסר ומוחלף ב־DNA</H>
    </Panel>
    <Panel y={268} h={209}>
      <H y={295} bold color={C.purple}>ב · פריימר חלבוני</H>
      <H y={320} size={14}>OH של חומצת אמינו קושר נוקלאוטיד ראשון</H>
      <Protein x={62} y={352}/><L x={123} y={355} color={C.purple}>O</L><path d="M78 351H110M134 351H158" stroke={C.purple} strokeWidth={2}/><rect x={159} y={340} width={23} height={23} rx={5} fill="#cfe8e6" stroke={C.teal}/><L x={170} y={356} size={13}>N</L>
      <path d="M184 352H275" stroke={C.teal} strokeWidth={4}/><L x={326} y={356} color={C.teal}>3′-OH</L>
      <H x={94} y={387} size={13}>קשר קוולנטי בקצה 5′</H><Arrow x1={242} y1={380} x2={333} y2={380} color={C.teal}/>
      <H y={414} size={14}>אדנו־וירוס: pTP מתחיל; TP נשאר לאחר הבשלה</H>
      <H y={439} size={14}>פיקורנה־וירוס: VPg מתחיל סינתזת RNA</H>
      <H y={463} size={12} color={C.muted}>אחרי הקישור הראשון, ה־3′-OH של הנוקלאוטיד מוארך</H>
    </Panel>
    <Panel y={490} h={205}>
      <H y={517} bold color={C.blue}>ג · התחלה עצמית מקצה מקופל</H>
      <H y={542} size={14}>פרבו־וירוס: ITR יוצר סיכת ראש</H>
      <path d="M330 572H92C47 572 47 610 92 610H167" stroke={C.blue} strokeWidth={4} fill="none"/>
      <Bases x={94} y={580} n={6}/><path d="M170 610H281" stroke={C.teal} strokeWidth={4}/><L x={355} y={576}>5′</L><L x={324} y={614} color={C.teal}>3′-OH</L>
      <H x={105} y={637} size={13}>קצה 3′ של הגנום</H><Arrow x1={219} y1={635} x2={280} y2={635} color={C.teal}/>
      <H y={664} size={14}>הקצה המקופל הוא הפריימר — אין חלבון מתחיל</H>
      <H y={685} size={12} color={C.muted}>כחול: תבנית / DNA קיים · ירוק: שרשרת חדשה</H>
    </Panel>
    <H y={726} bold>אדנו־וירוס · הסטת גדיל</H>
    <H y={751} size={14}>1 · סבב ראשון מתחיל ב־pTP</H>
    <Protein x={47} y={804}/><L x={47} y={782} size={13} color={C.purple}>pTP</L>
    <path d="M65 804H225" stroke={C.teal} strokeWidth={4}/><path d="M65 824H347" stroke={C.blue} strokeWidth={4}/><Bases x={70} y={809} n={13}/>
    <path d="M65 774Q145 758 225 794H347" stroke={C.blue} strokeWidth={3} fill="none"/>
    {[85,112,139,166,193].map((x,i)=><circle key={x} cx={x} cy={768+i*i*.8} r={5} fill={C.orange}/>)}
    <Arrow x1={244} y1={852} x2={324} y2={852} color={C.teal}/><H x={115} y={859} size={13}>סינתזה רציפה</H>
    <H y={885} size={14}>כתום: DBP מייצב את הגדיל שאינו תבנית</H>
    <H y={916} size={14}>2 · ה־ITR של הגדיל המוסט מזדווגים</H>
    {/* A panhandle joins two distant termini; it is not a 3′ self-primer. */}
    <path d="M106 955H190C302 955 302 1025 220 1025C190 1025 210 979 190 979H106" stroke={C.blue} strokeWidth={3} fill="none"/>
    <Bases x={111} y={961} n={6}/><Bases x={111} y={941} n={5} color={C.teal}/>
    <Protein x={83} y={936}/><path d="M98 936H163" stroke={C.teal} strokeWidth={4}/>
    <L x={66} y={958} size={12}>3′</L><L x={66} y={983} size={12}>5′</L><H x={145} y={1007} size={12} color={C.teal}>pTP חדש</H>
    <H x={330} y={971} size={13}>מוצא</H><H x={330} y={991} size={13}>משוחזר</H>
    <H y={1045} size={14}>המוצא מאפשר סבב שני עם pTP חדש</H>
    <H y={1070} size={13} bold color={C.purple}>זה אינו הפריימר העצמי של פרבו־וירוס</H>
    <H y={1101} size={12} color={C.muted}>סכמטי, לא בקנה מידה · הושמטו פולימראז ופרטי החלקה</H>
  </Frame>;
}

function Head({ cx, cy, r, tall = 0, fine = false }: { cx: number; cy: number; r: number; tall?: number; fine?: boolean }) {
  // Orthographic projection of a regular icosahedron (12 vertices, 20 faces).
  // Prolate illustration separates the two fivefold caps along the long axis.
  const a=r/Math.sqrt(5), b=2*a;
  const v=[[0,-r-tall/2,0], ...Array.from({length:5},(_,i)=>{const t=i*2*Math.PI/5+.25; return [b*Math.cos(t),-a-tall/2,b*Math.sin(t)];}), ...Array.from({length:5},(_,i)=>{const t=(i+.5)*2*Math.PI/5+.25; return [b*Math.cos(t),a+tall/2,b*Math.sin(t)];}),[0,r+tall/2,0]];
  const faces:number[][]=[];
  for(let i=0;i<5;i++){const j=(i+1)%5;faces.push([0,1+i,1+j],[1+i,6+i,1+j],[1+j,6+i,6+j],[11,6+j,6+i]);}
  const midpoint=(a:number[],b:number[])=>a.map((n,i)=>(n+b[i])/2);
  return <g>{faces.filter(f=>f.reduce((s,i)=>s+v[i][2],0)>0).sort((f,g)=>f.reduce((s,i)=>s+v[i][2],0)-g.reduce((s,i)=>s+v[i][2],0)).map((f,i)=>{
    const p=f.map(j=>[cx+v[j][0],cy+v[j][1]]),m=p.map((n,j)=>midpoint(n,p[(j+1)%3]));
    return <g key={i}><polygon points={p.map(n=>n.join(',')).join(' ')} fill={i%2?'#e8e0f2':'#ddd0ed'} stroke={C.purple} strokeWidth={1}/>{fine&&<polygon points={m.map(n=>n.join(',')).join(' ')} fill="none" stroke={C.purple} strokeWidth={.7}/>}</g>;
  })}</g>;
}
export function TailedPhage() {
  return <Frame h={865} label="פאג סכמטי בעל ראש איקוסהדרלי וזנב סלילי; טבעת פורטל מחברת ביניהם וסיבים מזהים קולטנים. הפורטל הוא שער אריזה בהרכבה ושער יציאה בהדבקה. הגדלת T מוסיפה יחידות בכל הפאות; הארכה לצורת prolate מוסיפה אזור אמצעי.">
    <H y={28} bold size={20}>פאג׳ בעל זנב · שתי סימטריות</H>
    <H y={52} size={14} color={C.muted}>דגם משולב סכמטי; אינו מין פאג׳ מסוים</H>
    <Head cx={190} cy={156} r={73}/>
    <path d="M171 119q45 4 18 16t-6 22t5 22t-20 19M200 120q-41 11-12 23t-4 25t14 27" fill="none" stroke={C.blue} strokeWidth={2}/>
    <H x={323} y={115} bold size={15} color={C.purple}>ראש</H><H x={323} y={138} size={14}>איקוסהדרלי</H><path d="M268 151H286" stroke={C.purple}/>
    <L x={54} y={174} color={C.blue}>dsDNA</L><path d="M92 170H126" stroke={C.blue}/>
    <ellipse cx={190} cy={231} rx={20} ry={7} fill="#f3d6b9" stroke={C.orange} strokeWidth={2}/><ellipse cx={190} cy={231} rx={8} ry={3} fill="#fff" stroke={C.orange}/>
    <H x={319} y={229} bold size={15} color={C.orange}>פורטל</H><path d="M212 231H278" stroke={C.orange}/>
    <rect x={177} y={244} width={26} height={108} rx={4} fill="#daeeec" stroke={C.teal} strokeWidth={1.5}/>
    {Array.from({length:10},(_,i)=><path key={i} d={`M176 ${251+i*10}q14 9 28 0`} stroke={C.teal} strokeWidth={2} fill="none"/>)}
    <H x={315} y={280} bold size={15} color={C.teal}>זנב סלילי</H><path d="M207 293H281" stroke={C.teal}/>
    <H x={66} y={296} size={14}>תעלת DNA</H><path d="M114 300H170" stroke={C.blue}/>
    <path d="M173 354H207L217 364H163Z" fill={C.teal}/>
    <path d="M174 361L129 334L92 379M181 365L147 391L132 419M204 361L254 334L293 379M198 365L234 391L250 419" fill="none" stroke={C.teal} strokeWidth={3} strokeLinejoin="round"/>
    {[92,132,250,293].map((x)=><circle key={x} cx={x} cy={x===132||x===250?419:379} r={4} fill={C.orange}/>)}
    <H x={330} y={383} size={14} bold>סיבי זנב</H>
    <H y={447} size={14}>הסיבים מזהים קולטנים על פני החיידק</H>
    <Panel y={466} h={129}>
      <H y={493} bold color={C.orange}>אותו פורטל — שני תפקידים</H>
      <H y={523} size={15}>בהרכבה: שער כניסת DNA לאריזה</H>
      <H y={552} size={15}>בהדבקה: תעלת יציאה אל הזנב</H>
      <H y={578} size={14}>וגם נקודת החיבור של הזנב לראש</H>
    </Panel>
    <H y={624} bold>שתי דרכים להגדיל את הראש</H>
    <Head cx={53} cy={685} r={23}/><Head cx={144} cy={685} r={35} fine/>
    <Arrow x1={82} y1={685} x2={104} y2={685} color={C.purple}/>
    <H x={290} y={667} bold size={15}>העלאת T</H><H x={290} y={691} size={14}>יותר יחידות בכל פאה</H><L x={290} y={717} size={14}>N = 60 × T</L>
    <Head cx={53} cy={777} r={23}/><Head cx={144} cy={777} r={23} tall={33}/><Arrow x1={82} y1={777} x2={112} y2={777} color={C.purple}/>
    <H x={290} y={758} bold size={15}>ראש מוארך</H><L x={290} y={781} size={14}>prolate</L><H x={290} y={805} size={14}>הוספת אזור בין הכיפות</H>
    <H y={840} size={12} color={C.muted}>60 × T: מעטפת איקוסהדרלית אידאלית · חריגים קיימים</H>
    <H y={858} size={12} color={C.muted}>הקווים מסמנים פאות; אינם ספירת תת־יחידות · לא בקנה מידה</H>
  </Frame>;
}
