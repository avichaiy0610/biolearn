/* Original conceptual figures for Technion 136158. Model assumptions, textbook references,
   computed-data checks and browser captures: visual-lab/bioinformatics/. No experimental data. */
import type React from "react";
import { BLUE, GREEN, INK, MUTED, ORANGE, He, La } from "./biochemFigures";
const PURPLE = "#7c3aed", RED = "#b91c1c", TEAL = "#0f766e";

function BFsvg({ h, label, children }: { h: number; label: string; children: React.ReactNode }) {
  return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}>
    <title>{label}</title>{children}
  </svg>;
}
type BFsegment = { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; dash?: string | boolean };
function BFline({ x1, y1, x2, y2, color = MUTED, width = 1.5, dash }: BFsegment) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash === true ? "4 4" : dash || undefined} />;
}
function BFarrow({ x1, y1, x2, y2, color = MUTED, width = 1.5, dash }: BFsegment) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
  return <g><BFline {...{ x1, y1, x2, y2, color, width, dash }} /><path d={`M${x2 - s * Math.cos(a - 0.45)} ${y2 - s * Math.sin(a - 0.45)}L${x2} ${y2}L${x2 - s * Math.cos(a + 0.45)} ${y2 - s * Math.sin(a + 0.45)}`} fill="none" stroke={color} strokeWidth={width} /></g>;
}
function BFbox({ x, y, w, h = 40, title, sub, color = BLUE }: { x: number; y: number; w: number; h?: number; title: string; sub?: string; color?: string }) {
  return <g><rect x={x} y={y} width={w} height={h} rx={8} fill={color} fillOpacity={0.06} stroke={color} strokeWidth={1.3} />
    <He x={x + w / 2} y={y + (sub ? h / 2 - 4 : h / 2 + 5)} size={14} bold color={color}>{title}</He>
    {sub && <La x={x + w / 2} y={y + h / 2 + 16} size={12} color={INK}>{sub}</La>}
  </g>;
}
function BFrng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function BFnormal(r: () => number) { return Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); }
function BFpath(p: number[][]) { return p.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(3)} ${y.toFixed(3)}`).join(" "); }


function ALCard({x,y,w=136,h=54,en,he,color=BLUE}:{x:number;y:number;w?:number;h?:number;en:string;he:string;color?:string}) { return <g><rect x={x} y={y} width={w} height={h} rx={8} fill={color} fillOpacity={0.07} stroke={color}/><La x={x+w/2} y={y+22} size={15} bold color={color}>{en}</La><He x={x+w/2} y={y+42} size={12}>{he}</He></g>; }
function ALDbLandscape() { return <BFsvg h={455} label="מפת המאגרים: ארכיון INSDC, רשומות מעובדות ומאגרי נתונים נוספים">
  <He x={240} y={23} size={17} bold>ארכיון רצפי נוקלאוטידים</He><La x={240} y={46} size={14}>INSDC · daily exchange</La>
  <ALCard x={14} y={64} en="GenBank" he="ארה״ב · NCBI"/><ALCard x={172} y={64} en="ENA" he="אירופה · EMBL-EBI"/><ALCard x={330} y={64} en="DDBJ" he="יפן"/>
  <BFarrow x1={152} y1={84} x2={168} y2={84}/><BFarrow x1={168} y1={102} x2={152} y2={102}/><BFarrow x1={310} y1={84} x2={326} y2={84}/><BFarrow x1={326} y1={102} x2={310} y2={102}/>
  <BFarrow x1={240} y1={122} x2={240} y2={151}/><He x={240} y={176} size={14} bold>עיבוד, תרגום וביאור</He>
  <BFarrow x1={118} y1={187} x2={83} y2={207}/><BFarrow x1={240} y1={187} x2={240} y2={207}/><BFarrow x1={362} y1={187} x2={397} y2={207}/>
  <ALCard x={14} y={214} en="RefSeq" he="רצפי ייחוס · בקרה חלקית" color={BLUE}/><ALCard x={172} y={214} en="Swiss-Prot" he="בדיקה ידנית" color={GREEN}/><ALCard x={330} y={214} en="TrEMBL" he="ביאור אוטומטי" color={ORANGE}/>
  <La x={319} y={292} size={13}>UniProtKB</La><BFline x1={184} y1={280} x2={454} y2={280} color={MUTED}/>
  <He x={240} y={327} size={15} bold>נתונים משלימים וקישורים</He>
  <ALCard x={14} y={345} w={105} en="SRA" he="קריאות גולמיות" color={TEAL}/><ALCard x={130} y={345} w={105} en="Gene" he="דף מרכז לגן" color={TEAL}/><ALCard x={246} y={345} w={116} en="Ensembl/UCSC" he="דפדפני גנום" color={TEAL}/><ALCard x={373} y={345} w={93} en="PDB" he="מבנים" color={TEAL}/>
  <He x={240} y={433} size={13} color={MUTED}>הארכיון שומר הגשות; הביאור מתעד את מקור הידע</He>
</BFsvg>; }
function ALAssembly() { const bases=['A','C','G','T','A','C']; return <BFsvg h={430} label="אותו לוקוס מקבל קואורדינטות שונות בהרכבות שונות; דוגמת מספור BED">
  <He x={240} y={25} size={16} bold>אותו רצף, מספור אחר</He>
  <La x={94} y={62} size={15} color={BLUE}>GRCh37</La><La x={94} y={153} size={15} color={ORANGE}>GRCh38</La>
  {[0,1].map(j=><g key={j}><BFline x1={40} y1={j*91+89} x2={440} y2={j*91+89} color={MUTED}/><rect x={194} y={j*91+77} width={102} height={24} rx={3} fill={j?ORANGE:BLUE}/><La x={245} y={j*91+122} size={14}>{j?'chr11:1020–1039':'chr11:1000–1019'}</La></g>)}
  <BFarrow x1={315} y1={102} x2={315} y2={164} color={TEAL}/><La x={375} y={140} size={13} color={TEAL}>liftover</La>
  <He x={240} y={240} size={13} color={MUTED}>קואורדינטות להמחשה בלבד; ההעברה אינה תמיד אפשרית</He>
  <He x={240} y={279} size={15} bold>אותם שלושה בסיסים בשני פורמטים</He>
  {bases.map((b,i)=><g key={i}><rect x={115+i*42} y={295} width={39} height={29} fill={i>=1&&i<=3?'#dbeafe':'#f1f5f9'}/><La x={134+i*42} y={316} size={17}>{b}</La><La x={134+i*42} y={345} size={13}>{i+1}</La></g>)}
  <La x={240} y={374} size={14}>1-based, inclusive: 2–4 = CGT</La><La x={240} y={400} size={14}>BED, 0-based, half-open: [1, 4)</La>
</BFsvg>; }
function ALGlobalLocal() { const row=(y:number,local:boolean)=><g><rect x={55} y={y} width={370} height={20} rx={3} fill="#e2e8f0"/><rect x={55} y={y+64} width={370} height={20} rx={3} fill="#ffedd5"/><rect x={155} y={y} width={130} height={20} rx={3} fill={BLUE}/><rect x={155} y={y+64} width={130} height={20} rx={3} fill={BLUE}/>{(local?[174,204,234,264]:[69,99,129,174,204,234,264,309,339,369,399]).map(x=><line key={x} x1={x} y1={y+23} x2={x} y2={y+61} stroke={x>=155&&x<=285?BLUE:MUTED} strokeDasharray={x>=155&&x<=285?undefined:'3 4'} strokeWidth={1.3}/>)}<He x={240} y={y+112} size={13}>{local?'רק התחום השמור משתתף בעימוד':'גם הקצוות הלא קשורים נאלצים להשתתף'}</He></g>; return <BFsvg h={370} label="גלובלי מעמד מקצה לקצה; מקומי מאתר תחום משותף בשני חלבונים">
 <He x={240} y={25} size={17} bold>גלובלי: מקצה לקצה</He>{row(46,false)}<He x={240} y={198} size={17} bold>מקומי: התחום המשותף</He>{row(218,true)}<rect x={104} y={352} width={15} height={10} fill={BLUE}/><He x={265} y={362} size={12} color={BLUE}>כחול = תחום הומולוגי משותף; אורך סכמטי</He>
 </BFsvg>; }
function ALDp() {
 const a='GATC',b='GAC'; const f=Array.from({length:4},()=>Array(5).fill(0) as number[]), dirs=Array.from({length:4},()=>Array(5).fill('') as string[]);
 for(let j=1;j<=4;j++){f[0][j]=-2*j;dirs[0][j]='←';} for(let i=1;i<=3;i++){f[i][0]=-2*i;dirs[i][0]='↑';}
 for(let i=1;i<=3;i++)for(let j=1;j<=4;j++){const d=f[i-1][j-1]+(a[j-1]===b[i-1]?1:-1),u=f[i-1][j]-2,l=f[i][j-1]-2;f[i][j]=Math.max(d,u,l);dirs[i][j]=f[i][j]===d?'↖':f[i][j]===u?'↑':'←';}
 let i=3,j=4; const trace=new Set<string>(['0,0']); while(i||j){trace.add(`${i},${j}`);const d=dirs[i][j];if(d==='↖'){i--;j--;}else if(d==='↑')i--;else j--;}
 return <BFsvg h={402} label="מטריצת עימוד גלובלי מחושבת: GATC מול GAC; ציון סופי 1">
 <La x={240} y={25} size={16} bold>GATC × GAC</La><La x={240} y={51} size={13}>match +1 · mismatch −1 · gap −2</La>
 {['–',...a].map((c,k)=><La key={k} x={115+k*66} y={83} size={17} bold>{c}</La>)}{['–',...b].map((c,k)=><La key={k} x={52} y={118+k*49} size={17} bold>{c}</La>)}
 {f.flatMap((row,i)=>row.map((v,j)=><g key={`${i},${j}`}><rect x={82+j*66} y={94+i*49} width={64} height={47} rx={3} fill={trace.has(`${i},${j}`)?'#dbeafe':'#f8fafc'} stroke={trace.has(`${i},${j}`)?BLUE:'#cbd5e1'}/><La x={106+j*66} y={124+i*49} size={18} bold={trace.has(`${i},${j}`)} color={trace.has(`${i},${j}`)?BLUE:INK}>{v}</La>{dirs[i][j]&&<La x={133+j*66} y={113+i*49} size={13} color={MUTED}>{dirs[i][j]}</La>}</g>))}
 <He x={240} y={310} size={13} color={BLUE}>בתאים הכחולים: חוזרים מהפינה לפי החצים</He>
 <La x={240} y={340} size={21} bold>G A T C</La><La x={240} y={368} size={21} bold>G A − C</La><La x={240} y={394} size={14}>1 + 1 − 2 + 1 = 1</La>
 </BFsvg>;
}
// All dots below are exact two-symbol window matches. Reversed windows are
// separately tested for the schematic inversion panel (a symbolic sequence).
function ALDotPlot(){
 const seq='ACDEFGHIKLMNPQRS', repeated='ACDEFGHIKACDEFGHIK'; const panels=[{title:'זהים',a:seq,b:seq,rev:false},{title:'הכנסה: האלכסון זז',a:seq,b:seq.slice(0,8)+'TVWY'+seq.slice(8),rev:false},{title:'חזרות: אלכסונים מקבילים',a:repeated,b:repeated,rev:false},{title:'היפוך: אלכסון הפוך',a:seq,b:seq.slice(0,5)+seq.slice(5,12).split('').reverse().join('')+seq.slice(12),rev:true}];
 return <BFsvg h={564} label="ארבעה dot plots מחושבים מחלונות של שני סמלים: זהות, indel, חזרות והיפוך">
 {panels.map((p,k)=>{const x=40+(k%2)*240,y=43+Math.floor(k/2)*268,w=160; const dots:React.ReactNode[]=[];for(let i=0;i<p.a.length-1;i++)for(let j=0;j<p.b.length-1;j++){const aw=p.a.slice(i,i+2),bw=p.b.slice(j,j+2),direct=aw===bw,reverse=p.rev&&aw===bw.split('').reverse().join('');if(direct||reverse)dots.push(<circle key={`${i}-${j}`} cx={x+w*i/(p.a.length-2)} cy={y+w*j/(p.b.length-2)} r={2.5} fill={reverse?ORANGE:BLUE}/>);}return <g key={k}><He x={x+80} y={y-18} size={13} bold>{p.title}</He><BFline x1={x-8} y1={y-7} x2={x-8} y2={y+w+8}/><BFline x1={x-8} y1={y-7} x2={x+w+8} y2={y-7}/>{dots}<La x={x+w/2} y={y+w+30} size={12}>sequence X →</La><La x={x+w/2} y={y+w+49} size={11} color={MUTED}>{`X: ${p.a.length} · Y: ${p.b.length}`}</La></g>;})}
 <He x={240} y={554} size={12} color={MUTED}>חלון של 2 סמלים; ציר Y גדל כלפי מטה; כתום = התאמה הפוכה</He>
 </BFsvg>;
}
function ALBlastSteps(){const steps=[['שאילתת חלבון','MKTWVK'],['מילים חופפות','MKT · KTW · TWV · WVK'],['שכנים של מילות השאילתה','KTW → KSW · RTW'],['סריקת המאגר מול טבלת המילים: פגיעות','lookup table → scan database'],['הרחבה לשני הכיוונים','← HSP →'],['ציון וסיכום סטטיסטי','bit score · E-value']];return <BFsvg h={555} label="שלבי BLAST: מילות השאילתה ושכנותיהן, טבלת חיפוש, סריקת המאגר למציאת פגיעות, הרחבה וסטטיסטיקה">{steps.map(([he,en],k)=><g key={en}><La x={45} y={43+k*86} size={20} bold color={BLUE}>{k+1}</La><ALCard x={85} y={15+k*86} w={330} h={58} en={en} he={he} color={k===4?GREEN:BLUE}/>{k<5&&<BFarrow x1={250} y1={76+k*86} x2={250} y2={96+k*86}/>}</g>)}<He x={240} y={549} size={12} color={MUTED}>טבלת מילות השאילתה ושכנותיהן; סריקה למציאת פגיעות</He></BFsvg>;}
function ALBlastOutput(){const bits=Math.log2(500*1e9/1e-30).toFixed(1),shortE=(500*1e9*2**-45).toPrecision(2);return <BFsvg h={453} label="פלט BLAST סכמטי: זהות של 100 אחוז על 4 אחוזי כיסוי מול הומולוג רחוק בכיסוי מלא">
 <He x={240} y={25} size={16} bold>אותה שאילתה: 500 חומצות אמינו</He>
 <La x={61} y={62} size={12} bold>Hit</La><La x={155} y={62} size={12} bold>bit score</La><La x={250} y={62} size={12} bold>E-value</La><La x={345} y={62} size={12} bold>query cover</La><La x={435} y={62} size={12} bold>identity</La>
 <rect x={18} y={78} width={444} height={43} rx={5} fill="#dcfce7"/><rect x={18} y={134} width={444} height={43} rx={5} fill="#ffedd5"/>
 {[[100,'long',bits,'1e−30','100%','28%'],[157,'short','45',shortE,'4%','100%']].map(([y,...v])=><g key={y}>{v.map((s,k)=><La key={k} x={[61,155,250,345,435][k]} y={Number(y)+5} size={14} color={y===100?GREEN:ORANGE}>{s}</La>)}</g>)}
 <He x={240} y={206} size={13}>זהות מחושבת רק בתוך החלק המעומד</He>
 <La x={60} y={246} size={13}>Query</La><rect x={115} y={231} width={330} height={16} fill="#e2e8f0"/><La x={118} y={269} size={12}>1</La><La x={444} y={269} size={12}>500</La>
 <La x={60} y={301} size={13} color={GREEN}>long</La><rect x={115} y={287} width={330} height={16} fill={GREEN}/>
 <La x={60} y={342} size={13} color={ORANGE}>short</La><rect x={247} y={328} width={13.2} height={16} fill={ORANGE}/><La x={328} y={343} size={12} color={ORANGE}>20 / 500 = 4%</La>
 <La x={240} y={386} size={15}>Query   M K T W V K A</La><La x={240} y={411} size={15}>Sbjct   M R T W I K A</La>
 <He x={240} y={442} size={12} color={MUTED}>מקטע עימוד להמחשה; הטבלה אינה צילום מסך או תוצאת חיפוש אמיתית</He>
 </BFsvg>;}
function ALProgressive(){const seq=['ACGT','ACG','ATGT'];const dist=(a:string,b:string)=>{const d=Array.from({length:a.length+1},(_,i)=>Array.from({length:b.length+1},(_,j)=>i===0?j:j===0?i:0));for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+Number(a[i-1]!==b[j-1]));return d[a.length][b.length];};return <BFsvg h={440} label="עימוד פרוגרסיבי: מרחקים זוגיים, עץ מנחה, עימוד הזוג הקרוב והוספת רצף">
 <He x={240} y={25} size={16} bold>1 · מרחקים זוגיים</He><La x={240} y={53} size={14}>A: ACGT · B: ACG · C: ATGT</La>
 <La x={240} y={79} size={14}>{`d(A,B)=${dist(seq[0],seq[1])} · d(A,C)=${dist(seq[0],seq[2])} · d(B,C)=${dist(seq[1],seq[2])}`}</La>
 <He x={240} y={115} size={15} bold>2 · עץ מנחה: מתחילים מזוג קרוב</He><BFline x1={145} y1={146} x2={205} y2={146}/><BFline x1={145} y1={146} x2={145} y2={189}/><BFline x1={145} y1={189} x2={280} y2={189}/><BFline x1={205} y1={134} x2={205} y2={158}/><BFline x1={205} y1={134} x2={280} y2={134}/><BFline x1={205} y1={158} x2={280} y2={158}/><La x={310} y={139} size={14}>A</La><La x={310} y={163} size={14}>B</La><La x={310} y={194} size={14}>C</La>
 <He x={240} y={226} size={13} color={MUTED}>כאן יש תיקו במרחק; נבחר הזוג A–B</He>
 <He x={130} y={265} size={14} bold>3 · מעמדים זוג</He><He x={350} y={265} size={14} bold>4 · מוסיפים רצף</He>
 {[[300,"A","ACGT"],[330,"B","ACG−"]].map(([y,n,s])=><g key={n}><La x={63} y={Number(y)} size={17} bold>{n}</La>{String(s).split("").map((c,i)=><La key={i} x={104+i*29} y={Number(y)} size={19}>{c}</La>)}</g>)}<BFarrow x1={221} y1={312} x2={252} y2={312}/>
 <rect x={391} y={278} width={22} height={91} fill="#ffedd5"/>
 {[[300,"A","ACGT"],[330,"B","ACG−"],[360,"C","ATGT"]].map(([y,n,s])=><g key={n}><La x={272} y={Number(y)} size={17} bold>{n}</La>{String(s).split("").map((c,i)=><La key={i} x={315+i*29} y={Number(y)} size={19}>{c}</La>)}</g>)}
 <He x={240} y={402} size={15} bold color={ORANGE}>פער שנקבע — נשאר</He><He x={240} y={429} size={12} color={MUTED}>בגישה הבסיסית; שיפור חוזר בכלים מודרניים יכול לתקן טעויות</He>
 </BFsvg>;}
function ALLogo(){const glyphs=['M0 20L7 0H13L20 20H15L13 14H7L5 20Z M8 10H12L10 4Z','M20 3L17 6C14 2 6 3 5 8C3 14 6 17 11 17C14 17 16 16 18 14L20 17C17 19 14 20 10 20C3 20 0 16 0 10C0 4 4 0 10 0C14 0 18 1 20 3Z','M20 3L17 6C14 2 6 3 5 8C3 14 6 17 11 17C13 17 15 16 16 15V12H11V8H20V17C17 19 14 20 10 20C3 20 0 16 0 10C0 4 4 0 10 0C14 0 18 1 20 3Z','M0 0H20V5H12V20H8V5H0Z'];const counts=[[8,0,0,0],[0,4,4,0],[2,2,2,2]],colors=[GREEN,BLUE,ORANGE,RED];const data=counts.map(c=>{const ps=c.map(n=>n/8),H=-ps.reduce((s,p)=>s+(p?p*Math.log2(p):0),0);return{ps,ic:2-H};});return <BFsvg h={383} label="לוגו מחושב משמונה רצפים: A בגובה 2 ביטים, C ו-G בגובה כולל ביט אחד, עמדה 3 ריקה">
 <He x={240} y={25} size={16} bold>גובה הערימה = תוכן המידע</He><La x={41} y={58} size={13}>bits</La><BFline x1={65} y1={78} x2={65} y2={245}/><BFline x1={65} y1={245} x2={444} y2={245}/>{[0,1,2].map(v=><La key={v} x={45} y={249-v*80} size={14}>{v}</La>)}
 {data.map((d,i)=>{let base=245;return <g key={i}>{d.ps.map((p,k)=>{const h=p*d.ic*80;if(!h)return null;const y=base;base-=h;return <path key={k} d={glyphs[k]} fill={colors[k]} fillRule="evenodd" transform={`translate(${113+i*125} ${y-h}) scale(2.2 ${h/20})`} />;})}<La x={135+i*125} y={274} size={16} bold>{i+1}</La><La x={135+i*125} y={299} size={14}>{`${d.ic} bits`}</La></g>;})}
 <La x={240} y={332} size={14}>1: A=8 · 2: C=4,G=4 · 3: A=C=G=T=2</La><La x={240} y={359} size={15}>IC = 2 − H ; H = −Σ p log₂(p)</La><He x={240} y={380} size={11} color={MUTED}>רקע אחיד; ללא תיקון למדגם קטן; גובה כל אות = תדירות × מידע</He>
 </BFsvg>;}
function ALTree(){const edges:number[][]=[[36,225,76,225],[76,80,76,330],[76,80,150,80],[76,330,150,330],[150,55,150,105],[150,55,285,55],[150,105,225,105],[225,90,225,125],[225,90,285,90],[225,125,285,125],[150,290,150,370],[150,290,285,290],[150,370,225,370],[225,350,225,390],[225,350,285,350],[225,390,285,390],[36,225,36,430],[36,430,285,430]];return <BFsvg h={541} label="עץ גנים משורש לגלובינים: שכפול α/β, התמיינות אדם עכבר ועוף, bootstrap וקבוצת חוץ">
 <He x={240} y={24} size={16} bold>עץ גנים: השכפול קדם להתפצלות המינים</He>
 {edges.map(([x1,y1,x2,y2],i)=><BFline key={i} x1={x1} y1={y1} x2={x2} y2={y2} color={x1>=150?MUTED:INK}/>)}
 <rect x={70} y={219} width={12} height={12} fill={ORANGE}/><La x={119} y={207} size={13} color={ORANGE}>100%</La><He x={166} y={243} size={13} color={ORANGE} bold>א׳ · שכפול</He>
 {[[150,80],[225,105],[150,330],[225,370]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={5} fill={GREEN}/>)}
 <La x={250} y={78} size={12} color={RED}>48%</La><La x={197} y={340} size={12} color={GREEN}>96%</La>
 {[[55,'עוף'],[90,'אדם'],[125,'עכבר'],[290,'עוף'],[350,'אדם'],[390,'עכבר']].map(([y,t])=><g key={y}><La x={320} y={Number(y)+5} size={16}>{Number(y)<200?'α':'β'}</La><He x={390} y={Number(y)+5} size={15}>{t}</He></g>)}
 <He x={376} y={435} size={13}>גלובין רחוק · קבוצת חוץ</He><circle cx={36} cy={225} r={4} fill={INK}/><He x={37} y={191} size={12}>שורש</He><BFline x1={36} y1={198} x2={36} y2={217} color={MUTED}/>
 <rect x={36} y={480} width={11} height={11} fill={ORANGE}/><He x={138} y={490} size={12}>שכפול גן</He><circle cx={252} cy={486} r={5} fill={GREEN}/><He x={356} y={490} size={12}>התפצלות מינים</He>
 <He x={240} y={520} size={13} bold>סיבוב ענפים סביב צומת אינו משנה את הקרבה</He><He x={240} y={539} size={11} color={MUTED}>טופולוגיה סכמטית; אורכי הענפים וערכי התמיכה הנוספים להמחשה</He>
 </BFsvg>;}
const ALIGNMENT_FIGURES = {
 'bi-db-landscape':{el:ALDbLandscape,captionHe:'שלושת ארכיוני INSDC מחליפים הגשות מדי יום. הבדילו בין רצפי הייחוס של RefSeq, בדיקה ידנית ב־Swiss-Prot וביאור אוטומטי ב־TrEMBL; בתחתית מופיעים מאגרים משלימים ולא שלבי עיבוד נוספים.'},
 'bi-assembly-coordinates':{el:ALAssembly,captionHe:'המלבן מייצג אותו לוקוס בשתי הרכבות, בקואורדינטות סכמטיות בלבד: 1000–1019 לעומת 1020–1039. בתחתית, שלושת הבסיסים CGT הם 2–4 בספירה מ־1 עם סוף כלול, או [1,4) ב־BED: מתחילים מ־0 והסוף אינו כלול.'},
 'bi-global-local':{el:ALGlobalLocal,captionHe:'התחום הכחול משותף לשני החלבונים; שאר האזורים שונים. עימוד גלובלי כופה עימוד גם על הקצוות, ואילו עימוד מקומי מתמקד בתחום. הקווים מחוץ לתחום מסמנים השתתפות בעימוד, ולא זהות בין חומצות אמינו.'},
 'bi-dp-matrix':{el:ALDp,captionHe:'מטריצת התרגיל מחושבת עבור GATC בעמודות מול GAC בשורות: התאמה +1, אי־התאמה −1 ופער −2. עקבו מהתא הימני התחתון אחורה בתאים הכחולים: GATC מול GA−C, ציון 1. השוליים השליליים שייכים לעימוד גלובלי.'},
 'bi-dot-plot':{el:ALDotPlot,captionHe:'כל נקודה חושבה מהתאמה של חלון באורך שני סמלים ברצפים סכמטיים. קראו משמאל לימין ומלמעלה למטה: רצפים זהים, הכנסה של ארבעה סמלים, חזרה על מקטע, והיפוך מקטע. בכתום נבדקו חלונות בכיוון הפוך; ברצף DNA יש לבדוק גם משלים הפוך.'},
 'bi-blast-steps':{el:ALBlastSteps,captionHe:'מפרקים את השאילתה למילים חופפות באורך 3 ומוסיפים שכנים של מילות השאילתה בעלי ציון מתאים. בונים מהן טבלת חיפוש וסורקים את רצפי המאגר כדי למצוא פגיעות, ואז מרחיבים לשני הכיוונים ל־HSP. רק לאחר ההרחבה מסכמים בציון ביטים וב־E-value. הסכמה מקורית ואינה צילום של כלי.'},
 'bi-blast-output':{el:ALBlastOutput,captionHe:'הטבלה מדגימה את הדוגמה בטקסט: להיט ארוך עם 28% זהות וכיסוי מלא יכול להיות הומולוג רחוק משכנע, בעוד 100% זהות על 20 מתוך 500 חומצות אמינו מכסים רק 4%. הסתכלו גם על הכיסוי ועל ה־E-value. ציוני הביטים והפלט סכמטיים.'},
 'bi-progressive-msa':{el:ALProgressive,captionHe:'המרחקים חושבו כמספר העריכות המינימלי ברצפים המוצגים. בדוגמה A–B ו־A–C קרובים באותה מידה; לאחר שבוחרים A–B, מעמדים אותם ומוסיפים את C. הפער של B נשמר בשלב הבא: זו מגבלת השיטה הפרוגרסיבית הבסיסית.'},
 'bi-logo':{el:ALLogo,captionHe:'אותן ספירות שבתרגיל: בעמדה 1 שמונה A נותנות 2 ביטים; בעמדה 2 ארבע C וארבע G נותנות ביט אחד, חצי ביט לכל אות; בעמדה 3 שתי הופעות לכל בסיס נותנות 0 ביטים, ולכן אין ערימת אותיות. החישוב מניח רקע אחיד וללא תיקון למדגם קטן.'},
 'bi-tree-reading':{el:ALTree,captionHe:'הריבוע הכתום הוא צומת א׳: שכפול קדום שמפריד בין α ל־β בתמיכה של 100%. העיגולים הירוקים מייצגים התפצלות מינים; בתוך כל קבוצה העוף מתפצל ראשון. תמיכת 48% בקבוצת α אדם–עכבר חלשה. קבוצת החוץ קובעת את השורש; סיבוב צומת אינו משנה מי חולק אב קדמון קרוב יותר.'},
};









﻿// Seeded observations and actual numerical analysis; no experimental data.
const EXmean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const EXsd = (a: number[]) => { const m = EXmean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const EXdot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
const EXq = (a: number[], p: number) => { const i = (a.length - 1) * p, k = Math.floor(i); return a[k] + (a[Math.min(k + 1, a.length - 1)] - a[k]) * (i - k); };
function EXaxis({ x0, x1, y, ticks, label }: { x0: number; x1: number; y: number; ticks: [number, string][]; label?: string }) {
  return <g><BFline x1={x0} y1={y} x2={x1} y2={y} />{ticks.map(([x, s]) => <g key={s}><BFline x1={x} y1={y} x2={x} y2={y + 5} /><La x={x} y={y + 22} size={12}>{s}</La></g>)}{label && <La x={(x0 + x1) / 2} y={y + 45} size={14}>{label}</La>}</g>;
}
function EXrPlots() {
  const r = BFrng(1361581), logs = Array.from({ length: 240 }, () => 4 + 1.1 * BFnormal(r)).concat([7.5, 8, 8.5]).sort((a, b) => a - b), raw = logs.map(x => 2 ** x);
  const hist = (values: number[], lo: number, hi: number, bins: number, y: number, title: string, ticks: number[]) => {
    const counts = Array.from({ length: bins }, () => 0);
    values.forEach(v => counts[Math.max(0, Math.min(bins - 1, Math.floor((v - lo) / (hi - lo) * bins)))]++);
    const max = Math.max(...counts), width = 370 / bins;
    return <g><He x={240} y={y} size={16} bold>{title}</He><He x={85} y={y + 24} size={12}>מספר גנים</He>{[0, max].map(n => <La key={n} x={44} y={y + 140 - n / max * 90 + 4} size={11}>{n}</La>)}{counts.map((n, i) => <rect key={i} x={62 + i * width} y={y + 140 - n / max * 90} width={width - 1} height={n / max * 90} fill={BLUE} opacity={.8} />)}<EXaxis x0={62} x1={432} y={y + 140} ticks={ticks.map(v => [62 + (v - lo) / (hi - lo) * 370, String(v)])} /></g>;
  };
  const q1 = EXq(logs, .25), med = EXq(logs, .5), q3 = EXq(logs, .75), iqr = q3 - q1, low = logs.find(x => x >= q1 - 1.5 * iqr)!, high = [...logs].reverse().find(x => x <= q3 + 1.5 * iqr)!, out = logs.filter(x => x < low || x > high), sx = (x: number) => 62 + x / 10 * 370;
  return <BFsvg h={685} label="אותם 243 ערכי ביטוי: היסטוגרמת ביטוי מוטה, היסטוגרמת log2 וקופסה עם רבעונים ושפמים מחושבים">
    {hist(raw, 0, 384, 24, 25, "ביטוי גנים: זנב ימני ארוך", [0, 128, 256, 384])}
    {hist(logs, 0, 10, 20, 230, "אותם גנים לאחר המרת לוג", [0, 2, 4, 6, 8, 10])}<La x={247} y={425} size={14}>log₂(expression)</La>
    <He x={240} y={462} size={16} bold>קופסה של אותם ערכי לוג</He>
    <BFline x1={sx(low)} y1={535} x2={sx(high)} y2={535} /><BFline x1={sx(low)} y1={518} x2={sx(low)} y2={552} /><BFline x1={sx(high)} y1={518} x2={sx(high)} y2={552} />
    <rect x={sx(q1)} y={513} width={sx(q3) - sx(q1)} height={44} fill="#dbeafe" stroke={BLUE} strokeWidth={1.5} /><BFline x1={sx(med)} y1={513} x2={sx(med)} y2={557} color={ORANGE} />
    {out.map((x, i) => <circle key={i} cx={sx(x)} cy={535} r={3.5} fill={RED} />)}
    <He x={sx(med)} y={493} size={13}>חציון</He><La x={sx(q1) - 13} y={581} size={12}>Q1</La><La x={sx(q3) + 13} y={581} size={12}>Q3</La><He x={sx(low)} y={604} size={13}>שפם</He><He x={sx(med)+30} y={604} size={12}>טווח בין־רבעוני</He><He x={385} y={493} size={13} color={RED}>חריגים</He>
    <EXaxis x0={62} x1={432} y={622} ticks={[0, 2, 4, 6, 8, 10].map(v => [sx(v), String(v)])} label="log₂(expression)" />
  </BFsvg>;
}
function EXfastq() {
  const seq = "GATTTGGGGTTCA", qual = "IIHHGGFFEE???", q = [...qual].map(c => c.charCodeAt(0) - 33);
  const r = BFrng(1361582), quality = Array.from({ length: 150 }, (_, i) => EXmean(Array.from({ length: 80 }, () => Math.max(2, Math.min(41, 40 - 20 * (i / 149) ** 2 + BFnormal(r))))));
  const sx = (i: number) => 62 + i / 149 * 370, sy = (v: number) => 452 - v / 45 * 170;
  return <BFsvg h={570} label="רשומת FASTQ סינתטית עם 13 בסיסים ו־13 תווי איכות, ופענוח Phred; מתחתיה דעיכת איכות ממוצעת מחושבת ל־150 מחזורים">
    <He x={240} y={25} size={16} bold>ארבע שורות לקריאה אחת</He>
    {["@read1/1", seq, "+", qual].map((s, i) => <g key={i}><rect x={25} y={42 + i * 36} width={270} height={30} rx={4} fill={i === 3 ? "#fff7ed" : "#f1f5f9"} /><La x={40} y={63 + i * 36} anchor="start" size={16}>{s}</La><He x={382} y={63 + i * 36} size={14}>{["מזהה", "רצף", "מפריד", "איכות לכל בסיס"][i]}</He></g>)}
    <La x={240} y={217} size={14}>I: ASCII 73 − 33 = Q40</La><La x={240} y={242} size={13}>Q = −10 log₁₀(Perror) · Q40 → 0.01%</La>
    <He x={240} y={275} size={15} bold>איכות ממוצעת לאורך קריאה — סימולציה</He>
    {[10, 20, 30, 40].map(v => <g key={v}><La x={42} y={sy(v) + 4} size={12}>{v}</La><BFline x1={58} y1={sy(v)} x2={62} y2={sy(v)} /></g>)}
    <BFline x1={62} y1={282} x2={62} y2={452} /><path d={BFpath(quality.map((v, i) => [sx(i), sy(v)]))} stroke={BLUE} strokeWidth={2.5} fill="none" />
    <EXaxis x0={62} x1={432} y={452} ticks={[1, 50, 100, 150].map(v => [sx(v - 1), String(v)])} /><La x={40} y={283} size={13}>Q</La><He x={247} y={505} size={14}>מיקום הבסיס בקריאה</He>
    <He x={240} y={540} size={12} color={MUTED}>תצוגת איכות בסיסים; אינה מדד לאמינות המיפוי</He><La x={240} y={561} size={11}>record: {seq.length} bases / {q.length} quality symbols</La>
  </BFsvg>;
}
function EXbrowser() {
  const sx = (p: number) => 60 + (p - 1000) / 500 * 370, variant = 1270;
  const reads = Array.from({ length: 10 }, (_, i) => ({ start: 1110 + (i * 17) % 70, end: 1310 + (i * 29) % 100, alt: i % 2 === 0 }));
  const cov = Array.from({ length: 100 }, (_, i) => reads.filter(r => r.start <= 1000 + i * 5 && r.end >= 1000 + i * 5).length);
  return <BFsvg h={555} label="דפדפן גנום סכמטי מקורי: קואורדינטות משותפות, תעתיק בכיוון החיובי, UTR דק ו־CDS עבה, עשר קריאות עם חמישה אללים חלופיים, כיסוי ווריאנט הטרוזיגוטי">
    <He x={240} y={24} size={16} bold>כל המסלולים באותן קואורדינטות</He><La x={240} y={48} size={13}>chrToy · 1-based · schematic</La>
    <EXaxis x0={60} x1={430} y={65} ticks={[1000, 1250, 1500].map(v => [sx(v), v.toLocaleString("en-US")])} />
    <He x={240} y={115} size={14}>תעתיק: שעתוק בכיוון החצים</He><BFline x1={sx(1040)} y1={143} x2={sx(1460)} y2={143} color={BLUE} />
    {[1150, 1200, 1350, 1390].map(v => <path key={v} d={`M${sx(v) - 4} 139 l5 4 l-5 4`} fill="none" stroke={BLUE} strokeWidth={1.5} />)}
    <rect x={sx(1040)} y={138} width={sx(1070) - sx(1040)} height={10} fill={BLUE} /><rect x={sx(1070)} y={131} width={sx(1120) - sx(1070)} height={24} fill={BLUE} /><rect x={sx(1240)} y={131} width={sx(1300) - sx(1240)} height={24} fill={BLUE} /><rect x={sx(1420)} y={131} width={sx(1440) - sx(1420)} height={24} fill={BLUE} /><rect x={sx(1440)} y={138} width={sx(1460) - sx(1440)} height={10} fill={BLUE} />
    <La x={sx(1055)} y={181} size={12}>UTR</La><La x={sx(1270)} y={181} size={12}>CDS</La><La x={sx(1450)} y={181} size={12}>UTR</La>
    <He x={240} y={214} size={14}>קריאות: חמישה אללים מכל סוג בעמדה המסומנת</He>
    {reads.map((r, i) => <g key={i}><rect x={sx(r.start)} y={230 + i * 13} width={sx(r.end) - sx(r.start)} height={8} fill="#cbd5e1" /><rect x={sx(variant) - 2.5} y={230 + i * 13} width={5} height={8} fill={r.alt ? ORANGE : BLUE} /></g>)}
    <La x={390} y={266} size={12} color={BLUE}>A: 5</La><La x={390} y={292} size={12} color={ORANGE}>G: 5</La><He x={240} y={389} size={14}>עומק הכיסוי מחושב מהקריאות</He>
    {cov.map((n, i) => <rect key={i} x={sx(1000 + 5 * i)} y={442 - n * 3.5} width={3.7} height={n * 3.5} fill={TEAL} />)}
    <BFline x1={60} y1={442} x2={430} y2={442} /><La x={42} y={411} size={12}>10</La><La x={42} y={445} size={12}>0</La>
    <He x={240} y={476} size={14}>מסלול וריאנטים</He><path d={`M${sx(variant)} 488 l-7 12 h14 Z`} fill={ORANGE} />
    <La x={240} y={524} size={13}>1,270 · A&gt;G · GT 0/1 · AD 5,5</La><He x={240} y={548} size={12} color={MUTED}>דוגמה סינתטית; עומק קטן להמחשת התצוגה</He>
  </BFsvg>;
}
function EXrnaseqWorkflow() {
  const counts = [50, 200, 40].map((base, g) => Array.from({ length: 6 }, (_, s) => Math.round(base * (s < 3 ? 1 : [1, 4, .25][g]) * [1, .9, 1.1, .95, 1.05, 1][s])));
  return <BFsvg h={710} label="מהפקת RNA לספרייה, קריאות ומיפוי, דרך טבלת ספירות גנים על דגימות ומטא־דאטה, עד DESeq2 ותוצאות עם log2FC ו־padj">
    <BFbox x={145} y={15} w={190} h={47} title="RNA מהדגימה" sub="RNA" /><BFarrow x1={240} y1={65} x2={240} y2={82} />
    <BFbox x={115} y={88} w={250} h={55} title="הכנת ספרייה וריצוף" sub="poly-A / rRNA depletion → cDNA" /><BFarrow x1={240} y1={146} x2={240} y2={164} />
    <BFbox x={145} y={170} w={190} h={44} title="קריאות" sub="FASTQ" /><BFarrow x1={240} y1={217} x2={240} y2={235} />
    <BFbox x={85} y={241} w={310} h={55} title="מיפוי וכימות" sub="STAR / HISAT2 · Salmon / kallisto" /><BFarrow x1={240} y1={299} x2={240} y2={317} />
    <He x={240} y={342} size={15} bold>ספירות גולמיות: גנים × דגימות</He>
    {["C1", "C2", "C3", "T1", "T2", "T3"].map((s, i) => <La key={s} x={115 + i * 51} y={371} size={13}>{s}</La>)}
    {counts.map((row, g) => <g key={g}><La x={51} y={401 + g * 29} size={13}>{`g${g + 1}`}</La>{row.map((v, s) => <g key={s}><rect x={90 + s * 51} y={382 + g * 29} width={49} height={27} fill={s < 3 ? "#dbeafe" : "#ffedd5"} /><La x={115 + s * 51} y={401 + g * 29} size={13}>{v}</La></g>)}</g>)}
    <He x={240} y={500} size={14}>מטא־דאטה באותו סדר דגימות</He><La x={240} y={524} size={13}>condition: C C C T T T · batch: 1 1 2 1 1 2</La><BFarrow x1={240} y1={535} x2={240} y2={553} />
    <BFbox x={100} y={559} w={280} h={56} title="נרמול, שונות ומבחן לכל גן" sub="DESeq2 · ~ batch + condition" color={PURPLE} /><BFarrow x1={240} y1={618} x2={240} y2={636} />
    <BFbox x={95} y={642} w={290} h={53} title="תוצאות: גודל שינוי וראיות" sub="log₂FC · pvalue · padj" color={GREEN} />
  </BFsvg>;
}
// Abramowitz–Stegun approximation to the two-sided standard-normal tail.
function EXnormalP(z: number) { const x = Math.abs(z), t = 1 / (1 + .2316419 * x); return Math.max(1e-14, Math.min(1, 2 * Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI) * t * (.319381530 + t * (-.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))))); }
function EXvolcanoData() {
  const r = BFrng(1361583), genes = Array.from({ length: 420 }, (_, i) => { const se = .13 + .65 * r(), effect = i < 95 ? (i % 2 ? 1 : -1) * (1.1 + 1.9 * r()) : 0, fc = effect + se * BFnormal(r); return { fc, p: EXnormalP(fc / se), padj: 1 }; });
  const order = genes.map((g, i) => ({ p: g.p, i })).sort((a, b) => a.p - b.p); let last = 1;
  for (let k = order.length - 1; k >= 0; k--) { last = Math.min(last, order[k].p * genes.length / (k + 1)); genes[order[k].i].padj = last; }
  return genes;
}
function EXvolcano() {
  const genes = EXvolcanoData(), sx = (x: number) => 65 + (x + 4.5) / 9 * 350, sy = (y: number) => 350 - y / 14 * 250, threshold = -Math.log10(.05);
  return <BFsvg h={505} label="Volcano מחושב מ־420 גנים בסימולציה עם seed קבוע: ערכי p ממבחן נורמלי, תיקון BH, ספי padj קטן מ־0.05 וערך מוחלט של log2FC גדול מ־1">
    <He x={240} y={24} size={16} bold>שינוי גדול וגם מובהק — למעלה ובצדדים</He><He x={115} y={57} size={13} color={BLUE}>ירידה מובהקת</He><He x={355} y={57} size={13} color={ORANGE}>עלייה מובהקת</He><La x={240} y={84} size={13}>−log₁₀(padj)</La>
    {[0, 5, 10, 14].map(v => <La key={v} x={45} y={sy(v) + 4} size={12}>{v}</La>)}<BFline x1={65} y1={100} x2={65} y2={350} />
    {[-1, 1].map(v => <path key={v} d={`M${sx(v)} 100 V350`} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />)}<path d={`M65 ${sy(threshold)} H415`} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
    {genes.map((g, i) => <circle key={i} cx={sx(g.fc)} cy={sy(-Math.log10(g.padj))} r={2.7} opacity={.75} fill={g.padj < .05 && Math.abs(g.fc) > 1 ? g.fc > 0 ? ORANGE : BLUE : MUTED} />)}
    <EXaxis x0={65} x1={415} y={350} ticks={[-4, -1, 0, 1, 4].map(v => [sx(v), String(v)])} label="log₂FC (treated / control)" />
    <He x={115} y={420} size={13}>ירידה בלי די ראיות</He><He x={355} y={420} size={13}>עלייה בלי די ראיות</He><La x={240} y={451} size={13}>padj &lt; 0.05 · |log₂FC| &gt; 1</La><He x={240} y={481} size={12} color={MUTED}>אפור: לא עובר את שני הספים; הסימולציה אינה פלט DESeq2</He>
  </BFsvg>;
}
// Jacobi eigendecomposition of the actual centered sample Gram matrix.
function EXeigen(a: number[][]) {
  const n = a.length, m = a.map(row => [...row]), v: number[][] = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
  for (let iteration = 0; iteration < 3000; iteration++) {
    let p = 0, q = 1, largest = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.abs(m[i][j]) > largest) { p = i; q = j; largest = Math.abs(m[i][j]); }
    if (largest < 1e-10) break;
    const phi = .5 * Math.atan2(2 * m[p][q], m[q][q] - m[p][p]), c = Math.cos(phi), s = Math.sin(phi), app = m[p][p], aqq = m[q][q], apq = m[p][q];
    for (let k = 0; k < n; k++) if (k !== p && k !== q) { const kp = m[k][p], kq = m[k][q]; m[k][p] = m[p][k] = c * kp - s * kq; m[k][q] = m[q][k] = s * kp + c * kq; }
    m[p][p] = c * c * app - 2 * c * s * apq + s * s * aqq; m[q][q] = s * s * app + 2 * c * s * apq + c * c * aqq; m[p][q] = m[q][p] = 0;
    for (let k = 0; k < n; k++) { const kp = v[k][p], kq = v[k][q]; v[k][p] = c * kp - s * kq; v[k][q] = s * kp + c * kq; }
  }
  return m.map((row, k) => ({ value: row[k], vector: v.map(rowV => rowV[k]) })).sort((a, b) => b.value - a.value);
}
function EXpcaData() {
  const r = BFrng(1361584), n = 12, basis: number[][] = [], batch = Array.from({ length: n }, (_, i) => i < 6 ? -1 : 1), treatment = Array.from({ length: n }, (_, i) => i % 6 < 3 ? -1 : 1);
  // Factors, a deliberately atypical control (sample 0), and seeded residuals.
  const candidates = [batch.map((b, i) => b + .25 * BFnormal(r) - (i === 0 ? 1.5 : 0)), treatment.map((t, i) => t + .25 * BFnormal(r) - (i === 0 ? 1.6 : 0)), ...Array.from({ length: 9 }, () => Array.from({ length: n }, () => BFnormal(r)))];
  candidates.forEach(column => { let u = column.map(x => x - EXmean(column)); basis.forEach(b => { const projection = EXdot(u, b); u = u.map((x, i) => x - projection * b[i]); }); const norm = Math.sqrt(EXdot(u, u)); basis.push(u.map(x => x / norm)); });
  const spectrum = [.52, .18, .10, .07, .04, .03, .02, .015, .01, .01, .005];
  // Actual 12-sample x 11-feature matrix; exact prescribed 52%/18% variance spectrum.
  const matrix = Array.from({ length: n }, (_, i) => spectrum.map((lambda, j) => basis[j][i] * Math.sqrt(100 * lambda)));
  const eigen = EXeigen(matrix.map(a => matrix.map(b => EXdot(a, b)))), total = eigen.reduce((s, e) => s + Math.max(0, e.value), 0);
  const scores = eigen.slice(0, 2).map((e, j) => { const sign = EXdot(e.vector, j === 0 ? batch : treatment) < 0 ? -1 : 1; return e.vector.map(x => sign * x * Math.sqrt(e.value)); });
  return { matrix, eigen, points: matrix.map((_, i) => ({ x: scores[0][i], y: scores[1][i], batch: i < 6 ? 1 : 2, treated: i % 6 >= 3, outlier: i === 0 })), percent: eigen.slice(0, 2).map(e => Math.round(e.value / total * 100)) };
}
function EXpca() {
  const data = EXpcaData(), sx = (v: number) => 245 + v * 37, sy = (v: number) => 225 - v * 44;
  return <BFsvg h={490} label="PCA מחושב ל־12 דגימות: PC1 מסביר 52% ומפריד אצווה; PC2 מסביר 18% ומפריד טיפול. בכל אצווה שלוש דגימות טיפול ושלוש ביקורת, וביקורת חריגה אחת">
    <He x={240} y={25} size={16} bold>האצווה היא מקור השונות הגדול ביותר</He><La x={240} y={57} size={14}>{`PC2 (${data.percent[1]}%) · treatment`}</La>
    <BFline x1={55} y1={360} x2={430} y2={360} /><BFline x1={55} y1={85} x2={55} y2={360} />
    {[-4, -2, 0, 2, 4].map(x => <La key={x} x={sx(x)} y={382} size={12}>{x}</La>)}{[-2, 0, 2].map(y => <La key={y} x={37} y={sy(y) + 4} size={12}>{y}</La>)}
    {data.points.map((p, i) => <g key={i}>{p.treated ? <path d={`M${sx(p.x)} ${sy(p.y) - 6} l-6 11 h12 Z`} fill={p.batch === 1 ? BLUE : ORANGE} /> : <circle cx={sx(p.x)} cy={sy(p.y)} r={5.5} fill={p.batch === 1 ? BLUE : ORANGE} />}{p.outlier && <circle cx={sx(p.x)} cy={sy(p.y)} r={11} fill="none" stroke={RED} strokeWidth={1.5} />}</g>)}
    <La x={240} y={408} size={14}>{`PC1 (${data.percent[0]}%) · batch`}</La>
    <circle cx={75} cy={435} r={5} fill={BLUE} /><He x={135} y={440} size={13}>אצווה 1</He><circle cx={242} cy={435} r={5} fill={ORANGE} /><He x={310} y={440} size={13}>אצווה 2</He>
    <He x={240} y={465} size={13}>עיגול: ביקורת · משולש: טיפול · טבעת: חריגה לבדיקה</He>
  </BFsvg>;
}
type EXcluster = { members: number[]; height: number; left?: EXcluster; right?: EXcluster };
function EXclusterRows(rows: number[][]): EXcluster {
  const distance = (a: number[], b: number[]) => Math.sqrt(a.reduce((s, x, j) => s + (x - b[j]) ** 2, 0));
  const groups: EXcluster[] = rows.map((_, i) => ({ members: [i], height: 0 }));
  while (groups.length > 1) {
    let best = Infinity, ai = 0, bi = 1;
    for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) { const d = EXmean(groups[i].members.flatMap(a => groups[j].members.map(b => distance(rows[a], rows[b])))); if (d < best) { best = d; ai = i; bi = j; } }
    const left = groups[ai], right = groups[bi]; groups.splice(bi, 1); groups.splice(ai, 1); groups.push({ members: [...left.members, ...right.members], height: best, left, right });
  }
  return groups[0];
}
function EXheatmapData() {
  const r = BFrng(1361585), matrix = Array.from({ length: 8 }, (_, g) => Array.from({ length: 6 }, (_, s) => 5 + g * .25 + ((g < 4) === (s < 3) ? 2 : -2) + .25 * BFnormal(r))), z = matrix.map(row => { const m = EXmean(row), sd = EXsd(row); return row.map(x => (x - m) / sd); });
  return { z, rows: EXclusterRows(z), cols: EXclusterRows(z[0].map((_, j) => z.map(row => row[j]))) };
}
function EXheatmap() {
  const { z, rows, cols } = EXheatmapData(), left = 135, top = 145, cw = 43, ch = 32, rowPos = new Map(rows.members.map((v, i) => [v, top + i * ch + ch / 2])), colPos = new Map(cols.members.map((v, i) => [v, left + i * cw + cw / 2]));
  const rowD: React.ReactNode[] = [], colD: React.ReactNode[] = [];
  const drawTree = (node: EXcluster, vertical: boolean): [number, number] => { if (!node.left || !node.right) return vertical ? [colPos.get(node.members[0])!, top - 8] : [left - 8, rowPos.get(node.members[0])!]; const a = drawTree(node.left, vertical), b = drawTree(node.right, vertical), pos = vertical ? top - 8 - node.height / cols.height * 66 : left - 8 - node.height / rows.height * 85; const path = vertical ? `M${a[0]} ${a[1]} V${pos} H${b[0]} V${b[1]}` : `M${a[0]} ${a[1]} H${pos} V${b[1]} H${b[0]}`; (vertical ? colD : rowD).push(<path key={node.members.join("-")} d={path} stroke={INK} strokeWidth={1.5} fill="none" />); return vertical ? [(a[0] + b[0]) / 2, pos] : [pos, (a[1] + b[1]) / 2]; };
  drawTree(rows, false); drawTree(cols, true);
  const color = (v: number) => { const t = Math.min(1, Math.abs(v) / 1.5), target = v < 0 ? [29, 78, 216] : [194, 65, 12]; return `rgb(${target.map(c => Math.round(255 + (c - 255) * t)).join(",")})`; };
  return <BFsvg h={525} label="מפת חום מחושבת מ־8 גנים ו־6 דגימות, תקנון z לכל שורה וקיבוץ היררכי average-linkage אוקלידי של גנים ודגימות; שני אשכולות ברורים">
    <He x={240} y={25} size={16} bold>צבע יחסי לכל גן; סדר מחושב לפי הקיבוץ</He><He x={270} y={57} size={13}>קיבוץ דגימות</He>
    {rowD}{colD}
    {rows.members.map((g, i) => <g key={g}>{cols.members.map((s, j) => <rect key={s} x={left + j * cw} y={top + i * ch} width={cw - 1} height={ch - 1} fill={color(z[g][s])} />)}<La x={420} y={top + i * ch + 21} size={13}>{`g${g + 1}`}</La></g>)}
    {cols.members.map((s, j) => <La key={s} x={left + j * cw + cw / 2} y={top + 8 * ch + 23} size={12}>{`S${s + 1}`}</La>)}<He x={76} y={top + 8 * ch + 23} size={12}>גנים</He>
    {Array.from({ length: 61 }, (_, i) => <rect key={i} x={110 + i * 4} y={455} width={4} height={15} fill={color(-1.5 + i * .05)} />)}
    <La x={110} y={490} size={12}>−1.5</La><La x={230} y={490} size={12}>0</La><La x={350} y={490} size={12}>+1.5</La><La x={405} y={468} size={13}>row z</La><He x={240} y={517} size={12} color={MUTED}>כחול: מתחת לממוצע הגן · כתום: מעל לממוצע הגן</He>
  </BFsvg>;
}
const EXPRESSION_FIGURES: Record<string, { el: () => React.JSX.Element; captionHe: string }> = {
  "bi-r-plots": { el: EXrPlots, captionHe: "אותם 243 ערכי ביטוי סינתטיים בשלוש תצוגות. למעלה ניכר הזנב הימני; המרת log2 מקרבת את המרכז לסימטריה אך אינה מעלימה חריגים. בקופסה: Q1–Q3 הם הטווח הבין־רבעוני, הקו הכתום הוא החציון, והשפמים מגיעים לערכים הקיצוניים שעדיין בתוך 1.5 טווחים בין־רבעוניים; נקודות מעבר להם מסומנות באדום." },
  "bi-fastq-quality": { el: EXfastq, captionHe: "רשומת FASTQ סינתטית וקצרה: מספר תווי האיכות שווה למספר הבסיסים. I מפוענח ל־Q40, כלומר הסתברות שגיאה של 0.01%. הגרף שמתחת הוא סימולציה נפרדת של 80 קריאות בנות 150 בסיסים; שימו לב לירידה באיכות לקראת קצה הקריאה." },
  "bi-browser-tracks": { el: EXbrowser, captionHe: "דפדפן גנום סכמטי מקורי, ללא צילום כלי. שימו לב שכל המסלולים מיושרים לאותו סרגל: UTR דק ו־CDS עבה, חצים באינטרונים בכיוון השעתוק, קריאות וכיסוי מחושב. בעמדה 1,270 חמש קריאות עם A בכחול וחמש עם G בכתום — יחס שמתאים להטרוזיגוט בדוגמה הסינתטית; עשר קריאות אינן הבטחה לגנוטיפ נכון." },
  "bi-rnaseq-workflow": { el: EXrnaseqWorkflow, captionHe: "עקבו אחר הנתונים מ־RNA ועד לתוצאות. טבלת הספירות מכילה גנים בשורות ושש דגימות בעמודות, שלוש ביקורת C ושלוש טיפול T; המטא־דאטה נשמר באותו סדר. הספירות הגולמיות והמטא־דאטה נכנסים יחד ל־DESeq2, שמנרמל, מעריך שונות ובודק כל גן לפני תיקון ההשוואות המרובות." },
  "bi-volcano": { el: EXvolcano, captionHe: "420 גנים בסימולציה ניתנת לשחזור: הציר האופקי הוא log2FC והאנכי הוא −log10(padj), לאחר תיקון BH. הקווים מסמנים padj=0.05 ושינוי של פי שניים. רק גנים שעוברים את שני הספים צבועים: ירידה בכחול ועלייה בכתום. במרכז ייתכן שינוי מובהק אך קטן; למטה אין די ראיות גם כאשר השינוי המשוער גדול. זו דוגמה מחושבת, לא פלט DESeq2." },
  "bi-pca": { el: EXpca, captionHe: "PCA מחושב של 12 דגימות סינתטיות, בהתאם לתרגיל: PC1 מסביר 52% מהשונות ומפריד בין האצוות (כחול וכתום); PC2 מסביר 18% ומפריד בין טיפול במשולש וביקורת בעיגול בתוך כל אצווה. בכל אצווה שלוש דגימות מכל מצב. דגימת ביקורת חריגה מוקפת באדום — בודקים את סיבתה לפני הסרה. האחוזים מתקבלים מפירוק הנתונים." },
  "bi-heatmap-dendrogram": { el: EXheatmap, captionHe: "שמונה גנים ושש דגימות מסימולציה קבועה. כל שורה תוקננה ל־z-score: כחול נמוך מממוצע הגן וכתום גבוה ממנו. שתי הדנדרוגרמות חושבו מהנתונים במרחק אוקלידי ובקישור ממוצע, וסדר השורות והעמודות נקבע לפיהן. שימו לב לשני גושי הצבע ההפוכים; גבוה יותר בעץ מציין חיבור במרחק גדול יותר." },
};



// Original structural/network schematics. All plotted values are computed from the toy models below.
const STconfidence = (v: number) => v > 90 ? "#0053d6" : v >= 70 ? "#65cbf3" : v >= 50 ? "#ffdb13" : "#ff7d45";
function STplddt() {
  const values = Array.from({ length: 600 }, (_, i) => {
    const p = i + 1, wave = (Math.sin(p * .19) + 1) / 2;
    return p <= 60 ? 25 + 15 * wave : p <= 280 ? 88 + 7 * wave : p <= 330 ? 45 + 15 * wave : 85 + 7 * wave;
  });
  const sx = (p: number) => 48 + (p - 1) / 599 * 390, sy = (v: number) => 182 - v * 1.24;
  return <BFsvg h={650} label="ביטחון מקומי בחלבון בן 600 שיירים מול חוסר ודאות בסידור היחסי של שני תחומים">
    <He x={240} y={24} size={16} bold>ביטחון מקומי לאורך הרצף</He>
    {[[0, 50], [50, 70], [70, 90], [90, 100]].map(([a, b]) => <rect key={a} x={48} y={sy(b)} width={390} height={sy(a) - sy(b)} fill={STconfidence((a + b) / 2)} opacity={.16} />)}
    {[0, 50, 70, 90, 100].map(v => <La key={v} x={37} y={sy(v) + 4} size={11} anchor="end">{v}</La>)}
    <La x={46} y={43} size={13} anchor="start">pLDDT</La>
    {values.slice(1).map((v, i) => <line key={i} x1={sx(i + 1)} y1={sy(values[i])} x2={sx(i + 2)} y2={sy(v)} stroke={STconfidence(v)} strokeWidth={2.5} />)}
    <BFline x1={48} y1={182} x2={438} y2={182} />
    {[1, 60, 280, 330, 600].map(p => <La key={p} x={sx(p)} y={201} size={10}>{p}</La>)}
    <He x={240} y={222} size={13}>מספר השייר</He>
    {[[1, 60, "זנב"], [61, 280, "קינאז"], [281, 330, "מקשר"], [331, 600, "תחום שני"]].map(([a, b, name]) => <g key={String(a)}>
      <rect x={sx(Number(a))} y={235} width={Math.max(4, sx(Number(b)) - sx(Number(a)))} height={8} fill={Number(a) === 61 || Number(a) === 331 ? BLUE : ORANGE} />
      <He x={(sx(Number(a)) + sx(Number(b))) / 2} y={263} size={11}>{name}</He>
    </g>)}
    {[{ v: 95, t: ">90" }, { v: 80, t: "70–90" }, { v: 60, t: "50–70" }, { v: 30, t: "<50" }].map(({ v, t }, i) => <g key={v}><rect x={52 + i * 100} y={281} width={15} height={10} fill={STconfidence(v)} /><La x={75 + i * 100} y={291} size={12} anchor="start">{t}</La></g>)}
    <He x={240} y={322} size={16} bold>שגיאה במיקום היחסי של תחומים</He>
    <La x={57} y={347} size={12} anchor="start">PAE (Å)</La>
    {Array.from({ length: 30 }, (_, i) => Array.from({ length: 30 }, (_, j) => {
      const a = i * 20 + 10, b = j * 20 + 10;
      const d = (p: number) => p >= 61 && p <= 280 ? 1 : p >= 331 ? 2 : 0;
      const e = d(a) !== 0 && d(a) === d(b) ? 2 : 25;
      return <rect key={`${i}-${j}`} x={112 + j * 8} y={366 + i * 8} width={8.1} height={8.1} fill={e === 2 ? "#16713d" : "#e7f3ce"} />;
    }))}
    {[1, 280, 600].map(p => <g key={p}><La x={112 + (p - 1) / 599 * 240} y={359} size={11}>{p}</La><La x={101} y={371 + (p - 1) / 599 * 240} anchor="end" size={11}>{p}</La></g>)}
    <He x={240} y={631} size={13}>ירוק כהה: כ־2 Å בתוך תחום; בהיר: כ־25 Å ביניהם</He>
  </BFsvg>;
}

function STrmsdData() {
  // Planar 3D coordinates (z=0), with a 30-degree domain hinge. The Procrustes rotation below
  // is the exact least-squares rigid fit for these coplanar point sets, including translation.
  const a = Array.from({ length: 28 }, (_, i) => [i * .8, 1.2 * Math.sin(i * .8), 0]);
  const h = a[13], phi = Math.PI / 6;
  const b = a.map((p, i) => i <= 13 ? [...p] : [h[0] + (p[0] - h[0]) * Math.cos(phi) - (p[1] - h[1]) * Math.sin(phi), h[1] + (p[0] - h[0]) * Math.sin(phi) + (p[1] - h[1]) * Math.cos(phi), 0]);
  const center = (ps: number[][]) => [0, 1, 2].map(k => ps.reduce((s, p) => s + p[k], 0) / ps.length);
  const ca = center(a), cb = center(b), ac = a.map(p => p.map((v, k) => v - ca[k])), bc = b.map(p => p.map((v, k) => v - cb[k]));
  const theta = Math.atan2(bc.reduce((s, p, i) => s + p[0] * ac[i][1] - p[1] * ac[i][0], 0), bc.reduce((s, p, i) => s + p[0] * ac[i][0] + p[1] * ac[i][1], 0));
  const fit = bc.map(p => [p[0] * Math.cos(theta) - p[1] * Math.sin(theta) + ca[0], p[0] * Math.sin(theta) + p[1] * Math.cos(theta) + ca[1], 0]);
  const deviations = fit.map((p, i) => Math.hypot(...p.map((v, k) => v - a[i][k])));
  const rmsd = Math.sqrt(deviations.reduce((s, d) => s + d * d, 0) / deviations.length);
  return { a, fit, deviations, rmsd };
}
function STrmsd() {
  const { a, fit, deviations, rmsd } = STrmsdData(), project = (p: number[]) => [56 + p[0] * 16, 134 - p[1] * 16];
  return <BFsvg h={430} label="שני שלדי חלבון חופפים אחרי התאמה מיטבית; שינוי זווית בציר בין תחומים מגדיל את RMSD">
    <He x={240} y={25} size={16} bold>אותם תחומים, זווית שונה בציר</He>
    <path d={BFpath(a.map(project))} fill="none" stroke={BLUE} strokeWidth={3} />
    <path d={BFpath(fit.map(project))} fill="none" stroke={ORANGE} strokeWidth={3} />
    {a.filter((_, i) => i % 3 === 0).map((p, k) => { const i = k * 3, q = project(p), r = project(fit[i]); return <BFline key={i} x1={q[0]} y1={q[1]} x2={r[0]} y2={r[1]} color="#94a3b8" dash="3 3" />; })}
    <He x={240} y={199} size={13}>כחול: מבנה ייחוס; כתום: אחרי חפיפה מיטבית</He>
    <La x={240} y={224} size={14}>RMSD = √[(1/N) Σᵢ ‖rᵢ − r′ᵢ‖²]</La>
    <La x={240} y={249} size={13}>{`N = 28; RMSD = ${rmsd.toFixed(2)} Å`}</La>
    <He x={240} y={278} size={14} bold>הסטייה משתנה לאורך השרשרת</He>
    <BFline x1={52} y1={370} x2={435} y2={370} /><BFline x1={52} y1={296} x2={52} y2={370} />
    <path d={BFpath(deviations.map((d, i) => [52 + i / 27 * 383, 370 - d * 35]))} fill="none" stroke={PURPLE} strokeWidth={2.2} />
    {[0, 1, 2].map(d => <La key={d} x={39} y={374 - d * 35} size={11}>{d}</La>)}
    {[1, 14, 28].map(i => <La key={i} x={52 + (i - 1) / 27 * 383} y={389} size={11}>{i}</La>)}
    <La x={55} y={295} anchor="start" size={12}>Å</La><He x={240} y={416} size={13}>מספר השייר; הציר בין שיירים 14–15</He>
  </BFsvg>;
}

// One connected 42-nucleotide backbone; the dot-bracket string is generated from precisely
// the same pair list as the cross-stem bonds, so the drawing and notation cannot drift apart.
const STnodes = [[205,390],[205,370],[205,350],[190,330],[190,310],[205,290],[190,270],[205,250],[185,225],[155,205],[125,180],[125,160],[125,140],[115,120],[125,100],[145,100],[160,120],[155,140],[155,160],[155,180],[190,195],[220,190],[250,195],[285,180],[285,160],[285,140],[275,120],[285,100],[305,100],[320,120],[315,140],[315,160],[315,180],[280,215],[255,230],[235,250],[235,290],[250,310],[250,330],[235,350],[235,370],[235,390]];
const STpairs = [[1,40],[2,39],[5,36],[7,35],[10,19],[11,18],[12,17],[23,32],[24,31],[25,30]];
function STbracket(n: number, pairs: number[][]) { const s = Array(n).fill("."); pairs.forEach(([a, b]) => { s[a] = "("; s[b] = ")"; }); return s.join(""); }
function STrnaElements() {
  const notation = STbracket(STnodes.length, STpairs);
  return <BFsvg h={675} label="שרשרת RNA אחת עם גבעולים, לולאות סיכה, בליטה, לולאה פנימית ומרובת ענפים; פסאודו קשר בתיבה נפרדת">
    <He x={240} y={25} size={16} bold>שרשרת אחת, כמה סוגי לולאות</He>
    <He x={220} y={65} size={14} color={GREEN}>לולאות סיכה בקצות הגבעולים</He>
    <path d={BFpath(STnodes)} fill="none" stroke={BLUE} strokeWidth={2} />
    {STpairs.map(([a, b]) => <BFline key={a} x1={STnodes[a][0] + 6} y1={STnodes[a][1]} x2={STnodes[b][0] - 6} y2={STnodes[b][1]} color="#94a3b8" />)}
    {STnodes.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4.5} fill={STpairs.some(p => p.includes(i)) ? BLUE : GREEN} />)}
    <He x={382} y={204} size={13}>מרובת ענפים</He><BFline x1={338} y1={209} x2={278} y2={200} color={MUTED} />
    <He x={78} y={269} size={14}>בליטה</He><BFline x1={111} y1={270} x2={180} y2={270} color={MUTED} />
    <He x={358} y={324} size={14}>לולאה פנימית</He><BFline x1={296} y1={320} x2={260} y2={320} color={MUTED} />
    <He x={112} y={365} size={14}>גבעול</He><BFline x1={144} y1={362} x2={195} y2={362} color={MUTED} />
    <La x={190} y={413} size={13}>5′</La><La x={249} y={413} size={13}>3′</La>
    <La x={240} y={443} size={10.5}>{notation}</La>
    <He x={240} y={469} size={13}>נקודה: בסיס חופשי; זוג סוגריים: זוג בסיסים</He>
    <rect x={34} y={489} width={412} height={163} rx={12} fill="#f8fafc" />
    <He x={240} y={515} size={14} bold>פסאודו־קשר: זוגות מצטלבים בסדר הרצף</He>
    <BFline x1={66} y1={586} x2={414} y2={586} color={BLUE} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={82 + i * 28} cy={586} r={4} fill={BLUE} />)}
    {[[0,7],[1,6]].map(([a,b]) => <path key={a} d={`M${82+a*28} 580 Q${82+(a+b)*14} ${525+a*10} ${82+b*28} 580`} fill="none" stroke={PURPLE} strokeWidth={1.6} />)}
    {[[4,11],[5,10]].map(([a,b]) => <path key={a} d={`M${82+a*28} 580 Q${82+(a+b)*14} ${525+(a-4)*10} ${82+b*28} 580`} fill="none" stroke={ORANGE} strokeWidth={1.6} />)}
    <La x={240} y={624} size={15}>((..[[))..]]</La>
    <He x={240} y={644} size={12}>נדרש סוג סוגריים נוסף</He>
  </BFsvg>;
}

function STensembleData() {
  // A concrete 40-nt sequence compatible with every G-C/C-G pair in all three folded states.
  const sequence = "GCGCUUCGGCGCAA" + "GC".repeat(11) + "AAAA";
  const common = [[0,11],[1,10],[2,9],[3,8]];
  const hairpin = (s: number) => Array.from({ length: 4 }, (_, k) => [s+k,s+13-k]);
  const states = [{ e: -10, pairs: [...common,...hairpin(14)] }, { e: -9.7, pairs: [...common,...hairpin(18)] }, { e: -9.6, pairs: [...common,...hairpin(22)] }, { e: -5, pairs: [] as number[][] }];
  const rt = .0019872041 * 310.15, weights = states.map(s => Math.exp(-(s.e+10)/rt)), z = weights.reduce((s,v) => s+v,0);
  const probabilities = new Map<string,{a:number;b:number;p:number}>();
  states.forEach((s,k) => s.pairs.forEach(([a,b]) => { const key=`${a}-${b}`, old=probabilities.get(key); probabilities.set(key,{a,b,p:(old?.p ?? 0)+weights[k]/z}); }));
  return { sequence, states, probabilities: [...probabilities.values()], fractions: weights.map(w=>w/z), rt };
}
function STarcStructure({ pairs, y, color }: {pairs:number[][];y:number;color:string}) {
  const sx=(i:number)=>46+i/39*388;
  return <g><BFline x1={46} y1={y} x2={434} y2={y} color="#cbd5e1" />
    {pairs.map(([a,b])=><path key={a} d={`M${sx(a)} ${y-4} Q${(sx(a)+sx(b))/2} ${y-4-(b-a)*5.5} ${sx(b)} ${y-4}`} fill="none" stroke={a<4?GREEN:color} strokeWidth={1.8} />)}
    {[1,12,15,28,40].map(p=><La key={p} x={sx(p-1)} y={y+19} size={10}>{p}</La>)}
  </g>;
}
function STensemble() {
  const {sequence,states,probabilities,fractions}=STensembleData();
  const sx=(i:number)=>88+i/39*290, sy=(i:number)=>684-i/39*290;
  return <BFsvg h={765} label="מבנים חלופיים כמעט שווי אנרגיה; הסתברויות זיווג מחושבות במודל בולצמן בן ארבעה מצבים">
    <He x={240} y={25} size={16} bold>אנרגיה דומה, זיווגים חלופיים</He>
    <La x={240} y={51} size={13}>MFE: ΔG = −10.0 kcal/mol</La>
    <STarcStructure pairs={states[0].pairs} y={114} color={BLUE} />
    <La x={240} y={159} size={10.5}>{STbracket(sequence.length,states[0].pairs)}</La>
    <La x={240} y={195} size={13}>Alternative: ΔG = −9.7 kcal/mol</La>
    <STarcStructure pairs={states[1].pairs} y={258} color={ORANGE} />
    <La x={240} y={303} size={10.5}>{STbracket(sequence.length,states[1].pairs)}</La>
    <He x={240} y={336} size={13}>הגבעול הירוק משותף; הכחול והכתום חלופיים</He>
    <He x={240} y={364} size={14} bold>שטח הנקודה מייצג הסתברות לזיווג</He>
    <BFline x1={88} y1={684} x2={378} y2={684} /><BFline x1={88} y1={394} x2={88} y2={684} />
    <path d="M88 684 L378 394" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 4" fill="none" />
    {probabilities.map(({a,b,p})=><circle key={`${a}-${b}`} cx={sx(a)} cy={sy(b)} r={Math.sqrt(p)*4.8} fill={a<4?GREEN:BLUE} opacity={.85} />)}
    <circle cx={420} cy={448} r={4.8} fill={BLUE} /><La x={420} y={471} size={11}>P = 1</La>
    <circle cx={420} cy={502} r={2.4} fill={BLUE} /><La x={420} y={525} size={11}>P = 0.25</La>
    {[1,12,28,40].map(p=><g key={p}><La x={sx(p-1)} y={704} size={11}>{p}</La><La x={76} y={sy(p-1)+4} anchor="end" size={11}>{p}</La></g>)}
    <La x={239} y={731} size={11}>P(s) ∝ exp(−ΔG/RT); T = 310.15 K</La>
    <He x={240} y={753} size={11}>{`מודל צעצוע: 4 מצבים; שכיחות MFE כ־${(fractions[0]*100).toFixed(0)}%`}</He>
  </BFsvg>;
}

function STcovariation() {
  const rows=[['מין א','G','C','G–C'],['מין ב','A','U','A–U'],['מין ג','C','G','C–G'],['מין ד','U','A','U–A'],['מין ה','G','U','G·U']];
  return <BFsvg h={400} label="חמש דוגמאות ממינים שונים: שינויים בעמדות 12 ו־48 משמרים זיווג כולל זוג נדנוד">
    <He x={240} y={26} size={16} bold>הבסיסים משתנים; הזיווג נשמר</He>
    <La x={173} y={63} size={14} bold>12</La><La x={287} y={63} size={14} bold>48</La>
    {rows.map(([name,a,b,pair],i)=><g key={name}>
      <He x={73} y={104+i*43} size={14}>{name}</He>
      <rect x={152} y={82+i*43} width={42} height={30} rx={5} fill="#dbeafe" /><rect x={266} y={82+i*43} width={42} height={30} rx={5} fill="#ffedd5" />
      <La x={173} y={104+i*43} size={18} bold color={BLUE}>{a}</La><La x={287} y={104+i*43} size={18} bold color={ORANGE}>{b}</La>
      <La x={230} y={104+i*43} size={13} color={MUTED}>…</La><La x={374} y={104+i*43} size={15} color={i===4?PURPLE:GREEN}>{pair}</La>
    </g>)}
    <He x={240} y={328} size={14}>שינויים מפצים תומכים בזוג 12–48</He>
    <He x={240} y={356} size={13} color={PURPLE}>בשורה האחרונה: זוג נדנוד מותר</He>
    <He x={240} y={383} size={12} color={MUTED}>חמש דוגמאות סכמטיות מתוך עימוד רב־מיני</He>
  </BFsvg>;
}

function STedge({a,b,directed=false,color=MUTED}:{a:number[];b:number[];directed?:boolean;color?:string}) {
  const d=Math.hypot(b[0]-a[0],b[1]-a[1]), ux=(b[0]-a[0])/d, uy=(b[1]-a[1])/d;
  return directed ? <BFarrow x1={a[0]+ux*26} y1={a[1]+uy*26} x2={b[0]-ux*28} y2={b[1]-uy*28} color={color} /> : <BFline x1={a[0]+ux*26} y1={a[1]+uy*26} x2={b[0]-ux*26} y2={b[1]-uy*26} color={color} />;
}
function STnetworkBasics() {
  const nodes: Record<string,number[]>={A:[100,95],B:[230,70],C:[230,185],D:[100,210],E:[100,310],F:[230,310]};
  const edges=[['A','B'],['A','C'],['A','D'],['B','C'],['C','D'],['D','E'],['E','F']];
  const degrees=Object.fromEntries(Object.keys(nodes).map(n=>[n,edges.filter(e=>e.includes(n)).length]));
  const reg:Record<string,number[]>={X:[345,395],Y:[160,465],Z:[345,515]};
  return <BFsvg h={600} label="גרף שש החלבונים מהתרגיל עם שבע קשתות ודרגות מחושבות; בהמשך רשת בקרה עם חצים">
    <He x={240} y={25} size={16} bold>רשת לא מכוונת: סופרים קשתות</He>
    {edges.map(([a,b])=><STedge key={a+b} a={nodes[a]} b={nodes[b]} />)}
    {Object.entries(nodes).map(([n,[x,y]])=><g key={n}><circle cx={x} cy={y} r={26} fill={n==='D'?'#ffedd5':'#dbeafe'} stroke={n==='D'?ORANGE:BLUE} strokeWidth={1.5} /><La x={x} y={y-2} size={17} bold>{n}</La><La x={x} y={y+15} size={11}>{`k=${degrees[n]}`}</La></g>)}
    <He x={365} y={119} size={13}>דרגה = מספר קשתות</He>
    <La x={365} y={149} size={12}>A = C = D = 3</La>
    <He x={365} y={179} size={13}>שלוש רכזות שוות</He>
    <He x={365} y={240} size={13} color={ORANGE}>הסרת D מנתקת</He><He x={365} y={263} size={13} color={ORANGE}>את E ו־F משאר הרשת</He>
    <He x={240} y={365} size={16} bold>רשת בקרה: לכיוון יש משמעות</He>
    <STedge a={reg.X} b={reg.Y} directed color={GREEN} /><STedge a={reg.X} b={reg.Z} directed color={GREEN} /><STedge a={reg.Y} b={reg.Z} directed color={GREEN} />
    {Object.entries(reg).map(([n,[x,y]])=><g key={n}><circle cx={x} cy={y} r={25} fill="#dcfce7" stroke={GREEN} strokeWidth={1.4} /><La x={x} y={y+5} size={17} bold>{n}</La></g>)}
    <La x={105} y={402} size={12}>out(X)=2; in(X)=0</La>
    <La x={129} y={549} size={12}>in(Z)=2; out(Z)=0</La>
    <He x={240} y={582} size={13}>ראש החץ מצביע על הגן המבוקר</He>
  </BFsvg>;
}

function STnetworkModules() {
  const nodes:Record<string,number[]>={H:[118,144],A:[60,85],B:[178,85],C:[61,205],D:[179,205],Q:[240,144],J:[363,144],E:[305,85],F:[421,85],G:[305,205],I:[421,205]};
  const edges=[['H','A'],['H','B'],['H','C'],['H','D'],['A','B'],['C','D'],['A','C'],['B','D'],['H','Q'],['Q','J'],['J','E'],['J','F'],['J','G'],['J','I'],['E','F'],['G','I'],['E','G'],['F','I']];
  const reg:Record<string,number[]>={X:[110,400],Y:[365,400],Z:[240,510]};
  return <BFsvg h={615} label="שני מודולים צפופים מחוברים בצוואר בקבוק בעל שתי קשתות; מוטיב הזנה קדימה קוהרנטי עם שער AND">
    <He x={240} y={26} size={16} bold>רכזת וצוואר בקבוק הם תפקידים שונים</He>
    <rect x={25} y={53} width={188} height={188} rx={25} fill="#eff6ff" /><rect x={272} y={53} width={180} height={188} rx={25} fill="#f0fdf4" />
    {edges.map(([a,b])=><STedge key={a+b} a={nodes[a]} b={nodes[b]} />)}
    {Object.entries(nodes).map(([n,[x,y]])=><g key={n}><circle cx={x} cy={y} r={n==='H'||n==='Q'?23:17} fill={n==='Q'?'#ffedd5':x<240?'#dbeafe':'#dcfce7'} stroke={n==='Q'?ORANGE:x<240?BLUE:GREEN} strokeWidth={1.4} /><La x={x} y={y+5} size={14} bold>{n}</La></g>)}
    <He x={111} y={268} size={13}>מודול א</He><He x={365} y={268} size={13}>מודול ב</He>
    <La x={240} y={296} size={12}>H: degree 5; Q: degree 2</La>
    <He x={240} y={321} size={13} color={ORANGE}>Q מחבר בין המודולים; H רכזת בתוך מודול</He>
    <He x={240} y={351} size={14} bold>מוטיב הזנה קדימה קוהרנטי</He>
    <STedge a={reg.X} b={reg.Y} directed color={GREEN} /><STedge a={reg.X} b={reg.Z} directed color={GREEN} /><STedge a={reg.Y} b={reg.Z} directed color={GREEN} />
    {Object.entries(reg).map(([n,[x,y]])=><g key={n}><circle cx={x} cy={y} r={24} fill="#dcfce7" stroke={GREEN} strokeWidth={1.5} /><La x={x} y={y+5} size={18} bold>{n}</La></g>)}
    <La x={240} y={550} size={15} bold>AND: Z = X ∧ Y</La>
    <He x={240} y={577} size={13}>נדרשים שני המפעילים כדי להפעיל את Z</He>
    <He x={240} y={600} size={13}>אות קצר של X: ל־Y אין די זמן להצטבר</He>
  </BFsvg>;
}

const STRUCTURE_FIGURES: Record<string,{el:()=>React.ReactElement;captionHe:string}>={
  'bi-plddt-pae':{el:STplddt,captionHe:'דוגמת 600 השיירים מהתרגיל: עקבו אחרי הזנב והמקשר בעלי הביטחון הנמוך, מול שני התחומים האמינים. ב־PAE שני הריבועים הכהים מציינים שגיאה של כ־2 Å בתוך התחומים; כ־25 Å ביניהם מונעים הסקת ממשק. ערכי העקומה הם הדמיה מחושבת בתוך הטווחים הנתונים.'},
  'bi-rmsd':{el:STrmsd,captionHe:'מודל צעצוע מחושב של 28 שיירים ושינוי זווית של 30° בציר: שני שלדים חופפים בהתאמת ריבועים פחותים. הקווים המקווקווים מחברים אטומים מקבילים; למטה רואים שהסטייה אינה אחידה. RMSD הוא שורש ממוצע ריבועי המרחקים, ביחידות Å.'},
  'bi-rna-elements':{el:STrnaElements,captionHe:'עקבו לאורך השרשרת הכחולה היחידה: הקווים האפורים הם זוגות בסיסים, והנקודות הירוקות בסיסים חופשיים. בליטה נמצאת בצד אחד; לולאה פנימית בשניהם; במרכז העליון נפגשים שלושה גבעולים. כתיב הסוגריים נוצר מאותם זוגות שבציור. בתיבה: פסאודו־קשר דורש גם סוגריים מרובעים. סכמטי, לא בקנה מידה.'},
  'bi-rna-mfe-ensemble':{el:STensemble,captionHe:'מודל צעצוע של RNA בן 40 בסיסים: שני המבנים העליונים נבדלים ב־0.3 kcal/mol בלבד. הדוט־פלוט מחושב מבולצמן עבור ארבעה מצבים באנרגיות −10, −9.7, −9.6 ו־−5 kcal/mol, ב־310.15 K. שטח הנקודה הוא ההסתברות: הגבעול הירוק כמעט תמיד נוכח, ובאזור השני ההסתברות מתחלקת בין חלופות. זהו מודל הוראה מוגבל, לא פלט RNAfold ולא נתוני התרגיל בן 120 הבסיסים.'},
  'bi-covariation':{el:STcovariation,captionHe:'חמש דוגמאות סכמטיות התואמות לשאלה rna-5: בעמדות 12 ו־48 נראים G–C, A–U, C–G, U–A ו־G·U. החלפת הבסיסים משמרת את הזיווג ותומכת במבנה; זוג הנדנוד בשורה האחרונה מותר גם הוא.'},
  'bi-network-basics':{el:STnetworkBasics,captionHe:'זהו בדיוק גרף שבע הקשתות מהתרגיל. הדרגות מחושבות מהקשתות: A=C=D=3, B=E=2 ו־F=1. שימו לב ש־D מחבר את הזרוע E–F לשאר הגרף. בדוגמה המכוונת שמתחת, ראש החץ מראה מי מבקר את מי; דרגת כניסה שונה מדרגת יציאה.'},
  'bi-network-modules':{el:STnetworkModules,captionHe:'שתי קהילות צפופות מחוברות דרך Q: יש לו רק שתי קשתות, אבל הסרתו מנתקת ביניהן. H הוא רכזת עם חמש קשתות. למטה מוצג מוטיב X→Y, X→Z, Y→Z: בשער AND נדרשים גם X וגם Y, ולכן אות קצר של X עשוי לא להספיק להפעלת Z. רשת סכמטית להמחשה.'},
};


// GO is_a edges point from the specific term to a broader parent. Intervening
// ancestors not needed for this teaching view are omitted; never propagate regulates.
function ENgo() {
  const term = (x: number, y: number, w: number, he: string, la: string, gene = true) => <g>
    <rect x={x} y={y} width={w} height={62} rx={8} fill="#f0fdfa" stroke={TEAL} strokeWidth={1.3} />
    <He x={x+w/2} y={y+24} size={14} bold>{he}</He>
    <La x={x+w/2} y={y+44} size={12} color={MUTED}>{la}</La>
    {gene && <g><circle cx={x+w-14} cy={y+13} r={6} fill={TEAL} /></g>}
  </g>;
  return <BFsvg h={460} label="גרף GO מפושט: לתיקון DNA שני הורים, תגובה לנזק ב-DNA ומטבוליזם של DNA. ביאור גן לתיקון שבר דו-גדילי מתפשט כלפי מעלה בשני המסלולים.">
    <He x={240} y={25} size={17} bold>מונח אחד יכול להשתייך לשני מסלולים</He>
    <La x={240} y={49} size={13} color={MUTED}>GO · Biological process (BP)</La>
    {term(18,85,212,"מטבוליזם של DNA","GO:0006259")}
    {term(250,85,212,"תגובה לנזק ב-DNA","GO:0006974")}
    <BFarrow x1={204} y1={221} x2={130} y2={150} color={TEAL} />
    <BFarrow x1={276} y1={221} x2={350} y2={150} color={TEAL} />
    <La x={113} y={185} size={13} color={TEAL}>is_a</La>
    <La x={367} y={185} size={13} color={TEAL}>is_a</La>
    {term(140,225,200,"תיקון DNA","GO:0006281")}
    <BFarrow x1={240} y1={350} x2={240} y2={291} color={TEAL} />
    <La x={280} y={327} size={13} color={TEAL}>is_a</La>
    {term(105,354,270,"תיקון שבר דו-גדילי","GO:0006302 · gene G")}
    <circle cx={34} cy={439} r={6} fill={TEAL}/>
    <He x={253} y={444} size={13}>ביאור הגן נשמר בכל ההורים המסומנים</He>
  </BFsvg>;
}
function ENlogChoose(n: number, k: number) {
  let s=0; for(let j=1;j<=Math.min(k,n-k);j++) s+=Math.log(n-j+1)-Math.log(j); return s;
}
// Complete support (0..100) is summed, although the visible axis ends at 15.
const ENpmf = Array.from({length:101},(_,k)=>Math.exp(ENlogChoose(100,k)+ENlogChoose(9900,200-k)-ENlogChoose(10000,200)));
const ENtail = ENpmf.slice(12).reduce((a,b)=>a+b,0);
function ENhypergeom() {
  const sx=(k:number)=>62+25*k, sy=(p:number)=>510-560*p;
  return <BFsvg h={610} label="העשרה היפרגאומטרית: מתוך רקע של 10000 גנים, 100 מבוארים לתיקון DNA, 200 ברשימה ו-12 בחיתוך. ההתפלגות מחושבת מדגימה ללא החזרה: צפויים 2 ונצפו 12.">
    <He x={240} y={25} size={17} bold>12 גני תיקון ברשימה; במקרה צפויים 2</He>
    <rect x={22} y={48} width={436} height={209} rx={8} fill="#f8fafc" stroke={MUTED} strokeWidth={1.2}/>
    <He x={240} y={73} size={14}>רקע: 10,000 גנים שנבדקו</He>
    <ellipse cx={192} cy={161} rx={102} ry={58} fill={BLUE} fillOpacity={0.08} stroke={BLUE} strokeWidth={1.4}/>
    <ellipse cx={290} cy={161} rx={102} ry={58} fill={ORANGE} fillOpacity={0.08} stroke={ORANGE} strokeWidth={1.4}/>
    <La x={144} y={165} size={19} bold color={BLUE}>88</La>
    <La x={241} y={165} size={19} bold color={TEAL}>12</La>
    <La x={338} y={165} size={19} bold color={ORANGE}>188</La>
    <He x={130} y={99} size={13} color={BLUE}>תיקון: 100</He>
    <He x={354} y={99} size={13} color={ORANGE}>רשימה: 200</He>
    <He x={240} y={242} size={13} color={MUTED}>מחוץ לשתיהן: 9,712</He>
    <La x={240} y={286} size={14}>X ~ Hypergeom(N=10,000, K=100, n=200)</La>
    <La x={62} y={317} anchor="start" size={13}>P(X = k)</La>
    {[0,.1,.2,.3].map(p=><g key={p}><La x={46} y={sy(p)+4} size={12} anchor="end">{p.toFixed(1)}</La><BFline x1={54} y1={sy(p)} x2={59} y2={sy(p)} /></g>)}
    {ENpmf.slice(0,16).map((p,k)=><rect key={k} x={sx(k)-8} y={sy(p)} width={16} height={Math.max(.05,510-sy(p))} fill={k>=12?ORANGE:BLUE} fillOpacity={.75}/>)}
    <BFline x1={54} y1={510} x2={452} y2={510} color={INK}/>
    <BFline x1={54} y1={330} x2={54} y2={510} color={INK}/>
    {[0,2,4,6,8,10,12,14].map(k=><g key={k}><BFline x1={sx(k)} y1={511} x2={sx(k)} y2={516}/><La x={sx(k)} y={533} size={12}>{k}</La></g>)}
    <BFline x1={sx(2)} y1={353} x2={sx(2)} y2={510} color={TEAL} dash="4 4"/>
    <He x={145} y={341} size={13} color={TEAL}>ציפייה: 2</He>
    <BFline x1={sx(12)} y1={353} x2={sx(12)} y2={510} color={ORANGE} dash="4 4"/>
    <He x={367} y={341} size={13} color={ORANGE}>נצפו: 12</He>
    <He x={240} y={557} size={13}>מספר גני התיקון ברשימה</He>
    <La x={240} y={584} size={14} bold>{`P(X ≥ 12) = ${ENtail.toExponential(2)} · enrichment = 12/2 = 6`}</La>
  </BFsvg>;
}
function ENproject() {
  const steps=[
    ["שאלה מוגבלת","השוואה, אוכלוסייה ותוצאה מדידה"],
    ["נתונים ומטא-דאטה","מקור, חזרות ואצוות"],
    ["תכנית לפני ניתוח","בקרות, רקע וספים"],
    ["קוד ניתן לשחזור","גרסאות, פרמטרים וזרע קבוע"],
    ["אימות","נתונים עצמאיים ושיטה נוספת"],
    ["הצגת התוצאה","גודל השפעה, אי-ודאות ומגבלות"],
  ];
  return <BFsvg h={665} label="פרויקט ביואינפורמטי: שאלה, נתונים ומטא-דאטה, תכנון, קוד, אימות והצגה. בלבול נבדק בבחירת הנתונים; שינוי ספים בעקבות תוצאות עלול להיות p-hacking. משוב מהאימות חוזר לתכנון עם תיעוד.">
    <He x={240} y={25} size={17} bold>מהשאלה אל ראיות שאפשר לשחזר</He>
    {steps.map(([title,sub],i)=>{const y=53+i*94;return <g key={title}>
      <rect x={92} y={y} width={296} height={64} rx={9} fill={i===4?"#f0fdfa":"#eff6ff"} stroke={i===4?TEAL:BLUE} strokeWidth={1.3}/>
      <La x={69} y={y+26} size={18} bold color={BLUE}>{i+1}</La>
      <He x={240} y={y+25} size={16} bold>{title}</He>
      <He x={240} y={y+48} size={13} color={MUTED}>{sub}</He>
      {i<5&&<BFarrow x1={240} y1={y+67} x2={240} y2={y+88}/>}
    </g>;})}
    <path d="M392 461H444V273H392" fill="none" stroke={TEAL} strokeWidth={1.5}/>
    <BFarrow x1={414} y1={273} x2={392} y2={273} color={TEAL}/>
    <He x={417} y={351} size={12} color={TEAL}>משוב</He>
    <He x={417} y={372} size={12} color={TEAL}>מתועד</He>
    <He x={240} y={638} size={13} color={RED}>בדיקת בלבול: בשלב 2 · סכנת שינוי ספים: בין 3–5</He>
  </BFsvg>;
}
const ENRICHMENT_FIGURES = {
  "bi-go-dag": {el:ENgo,captionHe:"עקבו אחר החצים מהמונח הספציפי אל הוריו: גן שמבואר לתיקון שבר דו-גדילי נכלל גם בתיקון DNA ובשני מסלולי ההורים. הנקודות הירוקות מסמנות את התפשטות הביאור. קטע מפושט מ־GO, קשרי is_a בלבד; אין להסיק כך דרך כל סוג קשר."},
  "bi-hypergeometric": {el:ENhypergeom,captionHe:"השטחים בחלק העליון סכמטיים ואינם ביחס לגודל הקבוצות; המספרים מדויקים: 100 גני תיקון, 200 ברשימה, 12 בחיתוך. העמודות חושבו מהתפלגות היפרגאומטרית ללא החזרה. הקווים מסמנים ציפייה של 2 לעומת 12 שנצפו — העשרה פי 6; הזנב הכתום זעיר בסולם ההסתברות הליניארי."},
  "bi-project-workflow": {el:ENproject,captionHe:"קראו מלמעלה למטה. בודקים בלבול כבר עם המטא-דאטה, וקובעים בקרות, רקע וספים לפני הצפייה בתוצאות. המשוב מהאימות יכול להוביל לתכנית מתועדת חדשה; החלפת כלים או ספים עד שמתקבלת מובהקות היא p-hacking, ויש לדווח על ניתוח חקרני ככזה."},
};


export const BIOINFO_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  ...ALIGNMENT_FIGURES,
  ...EXPRESSION_FIGURES,
  ...STRUCTURE_FIGURES,
  ...ENRICHMENT_FIGURES,
};
