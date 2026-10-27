/* Original illustrations, computed from the course's own Python examples.
   Provenance and reproduction: visual-lab/computational/learning-card.md. */
import type React from "react";
import { BLUE, ORANGE, INK, MUTED, LINE, He as StandardHe, La } from "./biochemFigures";
import data from "./computationalFigureData.json";

const TEAL = "#0f766e", PURPLE = "#7c3aed", RED = "#b91c1c";
const COLORS = [BLUE, ORANGE, TEAL, PURPLE];
type Pt = [number, number];
const indices = (n: number) => Array.from({ length: n }, (_, i) => i);
const points = (a: number[][]): Pt[] => a.map(p => [p[0], p[1]]);
const path = (p: Pt[]) => p.map(([x,y],i) => `${i ? "L" : "M"}${x.toFixed(3)} ${y.toFixed(3)}`).join(" ");
const sample = (f: (x:number)=>number, a:number, b:number, n=200): Pt[] => indices(n+1).map(i => { const x=a+(b-a)*i/n; return [x,f(x)]; });
function He(p: React.ComponentProps<typeof StandardHe>) {
  const children = typeof p.children === "string" ? p.children.replace(/[A-Za-z0-9α-ωΑ-ΩΔΣβ½][A-Za-z0-9_α-ωΑ-ΩΔΣβ½²³⁺⁻′·−/().,=+*^ \t%:<>→↔-]*/g, m => "\u2066"+m.trimEnd()+"\u2069"+m.slice(m.trimEnd().length)) : p.children;
  return <StandardHe {...p}>{children}</StandardHe>;
}
function Fig({h,label,children}:{h:number;label:string;children:React.ReactNode}) {
  return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}><title>{label}</title>{children}</svg>;
}
function Note({y,children,color=MUTED}:{y:number;children:string;color?:string}) {
  return /[\u0590-\u05ff]/.test(children) ? <He x={240} y={y} size={19} color={color}>{children}</He> : <La x={240} y={y} size={19} color={color}>{children}</La>;
}
function Panel({y,h,title,color=BLUE,children}:{y:number;h:number;title:string;color?:string;children:React.ReactNode}) {
  return <g transform={`translate(0 ${y})`}><rect x={10} width={460} height={h} rx={13} fill="#f8fafc" stroke={LINE}/><He x={240} y={32} size={21} bold color={color}>{title}</He>{children}</g>;
}
function Arrow({x1,y1,x2,y2,color=INK,dash=false}:{x1:number;y1:number;x2:number;y2:number;color?:string;dash?:boolean}) {
  const a=Math.atan2(y2-y1,x2-x1),c=Math.cos(a),s=Math.sin(a);
  return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} strokeDasharray={dash?"5 4":undefined}/><path d={`M${x2-9*c+4*s} ${y2-9*s-4*c} L${x2} ${y2} L${x2-9*c-4*s} ${y2-9*s+4*c}`} fill="none" stroke={color} strokeWidth={2}/></g>;
}
type Series = {p:Pt[];color:string;dash?:boolean;dots?:boolean;centers?:boolean;connect?:boolean};
type ChartProps = {y?:number;xmin:number;xmax:number;ymin?:number;ymax:number;xt:number[];yt:number[];xlabel:string;ylabel:string;series:Series[];logx?:boolean;logy?:boolean;vlines?:number[];hlines?:number[]};
function Chart({y=0,xmin,xmax,ymin=0,ymax,xt,yt,xlabel,ylabel,series,logx=false,logy=false,vlines=[],hlines=[]}:ChartProps) {
  const tx=(x:number)=>logx?Math.log10(x):x,ty=(v:number)=>logy?Math.log10(v):v;
  const sx=(x:number)=>82+354*(tx(x)-tx(xmin))/(tx(xmax)-tx(xmin));
  const sy=(v:number)=>252-192*(ty(v)-ty(ymin))/(ty(ymax)-ty(ymin));
  return <g transform={`translate(0 ${y})`}><La x={259} y={28} size={20}>{ylabel}</La>
    {vlines.map(x=><line key={x} x1={sx(x)} x2={sx(x)} y1={60} y2={252} stroke={LINE} strokeDasharray="4 5"/>)}
    {hlines.map(v=><line key={v} x1={82} x2={436} y1={sy(v)} y2={sy(v)} stroke={LINE} strokeDasharray="4 5"/>)}
    <path d="M82 54 V252 H442" fill="none" stroke={INK} strokeWidth={1.5}/>
    {xt.map(v=><g key={v}><line x1={sx(v)} x2={sx(v)} y1={252} y2={258} stroke={INK}/><La x={sx(v)} y={282} size={17}>{Math.abs(v)>=100000?v.toExponential(0):v}</La></g>)}
    {yt.map(v=><g key={v}><line x1={76} x2={82} y1={sy(v)} y2={sy(v)} stroke={INK}/><La x={69} y={sy(v)+6} size={17} anchor="end">{Math.abs(v)>=100000?v.toExponential(0):v}</La></g>)}
    {series.map((s,i)=><g key={i}>{s.p.length>1&&!s.centers&&s.connect!==false&&<path d={path(s.p.map(([x,v])=>[sx(x),sy(v)]))} fill="none" stroke={s.color} strokeWidth={2.5} strokeDasharray={s.dash?"7 5":undefined}/>} {s.p.map(([x,v],j)=>s.centers?<rect key={j} x={sx(x)-7} y={sy(v)-7} width={14} height={14} fill="white" stroke={s.color} strokeWidth={3}/>:s.dots?<circle key={j} cx={sx(x)} cy={sy(v)} r={5} fill={s.color} stroke="white" strokeWidth={1}/>:null)}</g>)}
    <La x={259} y={315} size={20}>{xlabel}</La></g>;
}
function Table({rows,x=25,y,w=430,rh=43,highlight}:{rows:(string|number)[][];x?:number;y:number;w?:number;rh?:number;highlight?:[number,number]}) {
  const cw=w/rows[0].length;
  return <g>{rows.map((r,i)=>r.map((v,j)=><g key={`${i}-${j}`}><rect x={x+j*cw} y={y+i*rh} width={cw} height={rh} fill={highlight?.[0]===i&&highlight[1]===j?"#ffedd5":i===0?"#e2e8f0":"white"} stroke={LINE}/><La x={x+(j+.5)*cw} y={y+(i+.63)*rh} size={18} bold={i===0} color={highlight?.[0]===i&&highlight[1]===j?ORANGE:INK}>{v}</La></g>))}</g>;
}
function Grid({a,x=100,y,size=280,mode="numbers",select}:{a:number[][];x?:number;y:number;size?:number;mode?:"numbers"|"grey"|"mask";select?:Pt}) {
  const cw=size/a[0].length,ch=size/a.length;
  return <g>{a.map((row,r)=>row.map((v,c)=><g key={`${r}-${c}`}><rect x={x+c*cw} y={y+r*ch} width={cw} height={ch} fill={mode==="mask"?(v?TEAL:"#f1f5f9"):mode==="grey"?`rgb(${v},${v},${v})`:select?.[0]===r&&select[1]===c?"#ffedd5":"white"} stroke={mode==="grey"?"#475569":LINE}/>{mode!=="grey"&&<La x={x+(c+.5)*cw} y={y+(r+.63)*ch} size={a.length===5?20:19} bold={select?.[0]===r&&select[1]===c} color={mode==="mask"&&v?"white":INK}>{v}</La>}</g>))}</g>;
}
function Raster({href,x,y,w=200}:{href:string;x:number;y:number;w?:number}) {return <image href={href} x={x} y={y} width={w} height={w} style={{imageRendering:"pixelated"}}/>;}

function ProblemToProgram() {
  const steps=[['שאלה ביולוגית','כמה אתרי EcoRI ברצף?'],['קלט ופלט מוגדרים','קלט: רצף ואתר · פלט: מספר'],['אלגוריתם במילים','סריקה, השוואה, הגדלת מונה'],['תוכנית','אותם צעדים בשפת Python'],['בדיקה על מקרה ידוע','שני מופעים · במיקומים 1 ו־7']];
  return <Fig h={790} label="מהשאלה הביולוגית לספירת GAATTC ובדיקה קטנה">{steps.map(([title,desc],i)=><g key={title}><Panel y={10+i*140} h={112} title={`${i+1}. ${title}`} color={i===4?TEAL:BLUE}>{i===3?<><La x={240} y={70} size={19}>{'if seq[i:i+6] == "GAATTC":'}</La><La x={240} y={101} size={19}>count += 1</La></>:<Note y={72}>{desc}</Note>}</Panel>{i<4&&<Arrow x1={240} y1={126+i*140} x2={240} y2={146+i*140}/>}</g>)}<La x={240} y={743} size={21}>AGAATTCGAATTCA</La><La x={240} y={777} size={19}>GAATTC → 2</La></Fig>;
}
function Representations() {
  return <Fig h={1000} label="ייצוגים ביולוגיים: מחרוזת, רשימה, מילון, טבלה, גרף ומטריצה">
    <Panel y={8} h={126} title="רצף ← מחרוזת"><La x={240} y={78} size={23}>&quot;AGAATTCGAATTCA&quot;</La><Note y={109}>חיפוש אתר חיתוך</Note></Panel>
    <Panel y={148} h={126} title="מדידות ביטוי ← רשימה"><La x={240} y={78} size={23}>[12.1, 8.4, 15.0, 9.9]</La><Note y={109}>גישה לפי מיקום במדידה</Note></Panel>
    <Panel y={288} h={126} title="קודון לחומצת אמינו ← מילון"><La x={240} y={78} size={23}>{'{"GCC": "A"}'}</La><Note y={109}>חיפוש לפי מפתח: אלנין</Note></Panel>
    <Panel y={428} h={160} title="דגימות ומשתנים ← טבלה"><Table y={52} rows={[["sample","expression"],["0","12.1"],["1","8.4"]]} rh={30}/></Panel>
    <Panel y={602} h={166} title="אינטראקציות חלבונים ← גרף">{[100,240,380].map((x,i)=><g key={x}>{i<2&&<line x1={x+28} x2={x+112} y1={91} y2={91} stroke={BLUE} strokeWidth={2}/>}<circle cx={x} cy={91} r={26} fill="#dbeafe" stroke={BLUE}/><La x={x} y={98} size={22}>{['A','B','C'][i]}</La></g>)}<Note y={145}>דוגמה סכמטית לקשרים</Note></Panel>
    <Panel y={782} h={200} title="עוצמות פיקסלים ← מטריצה"><Table y={52} rows={[[10,12,11],[11,80,85],[10,82,90]]} x={110} w={260} rh={34}/><Note y={180}>קטע מתוך מטריצת התמונה בקורס</Note></Panel>
  </Fig>;
}
function GrowthRates() {
  const ns=[10,100,1000,4000,1000000], funcs=[(n:number)=>Math.log2(n),(n:number)=>n,(n:number)=>n*Math.log2(n),(n:number)=>n*n];
  return <Fig h={910} label="ספירות פעולות מחושבות כפונקציה של גודל הקלט בסולם לוגריתמי"><Note y={28}>פונקציות צמיחה · יחידות פעולה מנורמלות</Note><Chart y={40} xmin={10} xmax={1e6} ymin={1} ymax={1e12} logx logy vlines={[4000]} xt={[10,4000,1e6]} yt={[1,1e4,1e8,1e12]} xlabel="n (log scale)" ylabel="operations (log scale)" series={funcs.map((f,i)=>({p:sample(z=>f(10**z),1,6).map(([z,v])=>[10**z,v]),color:COLORS[i],dash:i%2===1}))}/>
    {['log₂(n)','n','n log₂(n)','n²'].map((s,i)=><La key={s} x={90+(i%2)*240} y={400+Math.floor(i/2)*38} size={21} color={COLORS[i]}>{s}</La>)}
    <Table y={488} rows={[["n","log₂ n","n","n²"],...ns.map(n=>[n,Math.log2(n).toFixed(1),n>=100000?n.toExponential(0):n,n*n>=1000000000?(n*n).toExponential(0):n*n])]} rh={40}/>
    <Note y={767} color={PURPLE}>דוגמת היחידה: 4,000 גנים</Note><La x={240} y={803} size={22}>n(n−1)/2 = 7,998,000</La><Note y={843}>זוגות שונים ללא סדר וללא השוואה עצמית</Note><La x={240} y={880} size={21}>n² = 16,000,000</La></Fig>;
}
function ListVsDict() {
  const expression=[12.1,8.4,15,9.9,11.2];
  return <Fig h={680} label="רשימה ניגשת לפי אינדקס, מילון לפי מפתח קודון"><Panel y={10} h={270} title="רשימה · המיקום הוא הכתובת"><La x={240} y={79} size={21}>expression.append(11.2)</La><Table y={109} rows={[[0,1,2,3,4],expression]} rh={45}/><La x={240} y={239} size={21}>expression[0] → 12.1</La></Panel><Panel y={302} h={290} title="מילון · המפתח הוא הכתובת" color={TEAL}><Table y={60} rows={[["key","value"],["ATG","M"],["GCG","A"],["TAA","*"],["TGG","W"]]} rh={35}/><La x={240} y={266} size={21}>codon_to_aa[&quot;GCG&quot;] → &quot;A&quot;</La></Panel><La x={240} y={631} size={20}>&quot;TTT&quot; in codon_to_aa → False</La><Note y={669}>אינדקס הרשימה מתחיל ב־0 ומסתיים ב־n−1</Note></Fig>;
}
const dfRows = data.df.map(r=>r.map(v=>v===null?"NaN":v));
function Dataframe() {
  return <Fig h={770} label="DataFrame המקורי ו-dropna: הסרת השורה עם ערך חסר"><Note y={28}>עמודות: שם גן ושתי מדידות ביטוי</Note><Table y={64} rows={[["index","gene","control","treatment"],...dfRows]} highlight={[5,2]}/><Note y={357}>כל שורה היא גן · אינדקס משמאל</Note><La x={240} y={398} size={23}>clean = df.dropna()</La><Arrow x1={240} y1={416} x2={240} y2={445} color={TEAL}/><Table y={464} rows={[["index","gene","control","treatment"],...dfRows.slice(0,4)]}/><Note y={719} color={ORANGE}>dnaK הוסר בגלל control חסר</Note><La x={240} y={757} size={21}>shape: (5, 3) → (4, 3)</La></Fig>;
}
function Histogram() {
  const {counts,edges}=data.histogram,sx=(v:number)=>82+354*(v-edges[0])/(edges[30]-edges[0]),sy=(v:number)=>252-192*v/55;
  return <Fig h={520} label="היסטוגרמה מחושבת ל-500 אורכי תאים מדומים, זרע 0 ו-30 תאים"><Chart xmin={edges[0]} xmax={edges[30]} ymax={55} xt={[1.5,2,2.5]} yt={[0,25,50]} xlabel="cell length (μm)" ylabel="number of cells" series={[]}/>{counts.map((v,i)=><rect key={i} x={sx(edges[i])} y={sy(v)} width={sx(edges[i+1])-sx(edges[i])-.6} height={252-sy(v)} fill={BLUE}/>)}<La x={240} y={365} size={20}>default_rng(0) · normal(2.0, 0.2, 500)</La><La x={240} y={405} size={21}>bins = 30 | Σ counts = 500</La><Note y={451}>הדמיה של אורכי תאים · לא נתוני ניסוי</Note><Note y={490}>גבולות התאים נגזרים מהמינימום והמקסימום</Note></Fig>;
}
function BinarySearch() {
  const a=[120,3300,5400,47000,98000],steps=[[0,2,4],[3,3,4]];
  return <Fig h={580} label="חיפוש בינארי מוצא 47000 בשתי בדיקות, באינדקס 3"><La x={240} y={30} size={22}>target = 47000</La>{steps.map(([lo,mid,hi],s)=><Panel key={s} y={58+s*230} h={210} title={`צעד ${s+1} · השוואה לאמצע`}><Table y={57} rows={[indices(5),a]} rh={40} highlight={[1,mid]}/><La x={240} y={170} size={21}>{`lo=${lo} · mid=${mid} · hi=${hi}`}</La><Note y={197} color={s?TEAL:BLUE}>{s?'נמצא: מחזירים אינדקס 3':'5400 קטן מהיעד ← lo = 3'}</Note></Panel>)}<Note y={560}>המיון נעשה לפני החיפוש; המספור מתחיל ב־0</Note></Fig>;
}
function SlidingWindow() {
  const s="GATATATGCATATACTT",kseq=data.kmerSequence;
  return <Fig h={860} label="חלונות חופפים: חיפוש ATAT וספירת מילים באורך ארבע"><Note y={28}>חלון באורך 4 · זז בסיס אחד בכל צעד</Note><La x={240} y={68} size={22}>{s}</La>{[1,3,9].map((start,i)=><g key={start}><La x={90} y={125+i*52} size={20}>{`i = ${start}`}</La><La x={260} y={125+i*52} size={22} color={BLUE}>{`${s.slice(0,start)}[${s.slice(start,start+4)}]${s.slice(start+4)}`}</La></g>)}<La x={240} y={303} size={21}>find_all → [1, 3, 9]</La><Note y={341} color={ORANGE}>count מחזיר 2: הוא מדלג על חפיפות</Note><Panel y={377} h={460} title="ספירת כל המילים באורך 4"><La x={240} y={82} size={19}>{kseq.slice(0,15)}</La><La x={240} y={114} size={19}>{kseq.slice(15)}</La><La x={240} y={158} size={21}>{`${kseq.length} − 4 + 1 = ${kseq.length-3} windows`}</La><Table y={190} rows={[["word","positions","count"],...['CATG','GCAT'].map(w=>[w,indices(kseq.length-3).filter(i=>kseq.slice(i,i+4)===w).join(", "),data.kmers[w as keyof typeof data.kmers]])]} rh={48}/><Note y={375}>כל חלון מוסיף 1 למונה של המילה שלו</Note><Note y={415}>שתי המילים השכיחות מופיעות 3 פעמים</Note></Panel></Fig>;
}
function GCSkew() {
  return <Fig h={825} label="סכום G פחות C ברצף היחידה ומינימום במיקומים 11 ו-24"><Chart xmin={0} xmax={data.skew.length-1} ymin={-3} ymax={8} xt={[0,11,24,40,60]} yt={[-3,0,4,8]} xlabel="position (prefix length)" ylabel="cumulative (#G − #C)" series={[{p:data.skew.map((v,i)=>[i,v]),color:BLUE},{p:[11,24].map(i=>[i,data.skew[i]]),color:ORANGE,dots:true,connect:false}]} vlines={[11,24]}/><Note y={358} color={ORANGE}>שני מינימים: אחרי 11 ואחרי 24 בסיסים</Note><La x={240} y={399} size={17}>{data.skewSequence.slice(0,30)}</La><La x={240} y={430} size={17}>{data.skewSequence.slice(30)}</La><Panel y={463} h={335} title="כרומוזום מעגלי · סכמה ביולוגית" color={TEAL}><circle cx={240} cy={174} r={82} fill="none" stroke={BLUE} strokeWidth={5}/><La x={240} y={72} size={21} bold>ori</La><La x={240} y={291} size={21} bold>ter</La><Arrow x1={196} y1={100} x2={163} y2={137} color={TEAL}/><Arrow x1={284} y1={100} x2={317} y2={137} color={TEAL}/><Note y={321}>מינימום skew הוא מועמד למקור; דורש אימות</Note></Panel></Fig>;
}
function DPTable() {
  const x="GAT",y="GT",F=indices(4).map(()=>Array<number>(3).fill(0));
  for(let i=0;i<=3;i++)F[i][0]=-i;
  for(let j=0;j<=2;j++)F[0][j]=-j;
  for(let i=1;i<=3;i++)for(let j=1;j<=2;j++)F[i][j]=Math.max(F[i-1][j-1]+(x[i-1]===y[j-1]?1:-1),F[i-1][j]-1,F[i][j-1]-1);
  const cell=76,ox=145,oy=135,trace:Pt[]=[[3,2],[2,1],[1,1],[0,0]];
  return <Fig h={690} label="טבלת תכנון דינמי מלאה ליישור GAT מול GT, ניקוד סופי 1"><La x={240} y={30} size={21}>match +1 · mismatch −1 · gap −1</La><La x={315} y={77} size={21}>GT → columns</La>{['∅','G','T'].map((v,j)=><La key={j} x={ox+(j+.5)*cell} y={116} size={24} color={BLUE}>{v}</La>)}{['∅','G','A','T'].map((v,i)=><La key={i} x={108} y={oy+(i+.6)*cell} size={24} color={TEAL}>{v}</La>)}{F.map((r,i)=>r.map((v,j)=><g key={`${i}-${j}`}><rect x={ox+j*cell} y={oy+i*cell} width={cell} height={cell} fill={trace.some(([r,c])=>r===i&&c===j)?"#dbeafe":"white"} stroke={LINE}/><La x={ox+(j+.5)*cell} y={oy+(i+.64)*cell} size={24} bold>{v}</La></g>))}{trace.slice(0,-1).map(([i,j],k)=>{const [r,c]=trace[k+1],x1=ox+(j+.5)*cell,y1=oy+(i+.5)*cell,x2=ox+(c+.5)*cell,y2=oy+(r+.5)*cell,a=Math.atan2(y2-y1,x2-x1);return <Arrow key={k} x1={x1+22*Math.cos(a)} y1={y1+22*Math.sin(a)} x2={x2-22*Math.cos(a)} y2={y2-22*Math.sin(a)} color={ORANGE}/>;})}<Note y={482}>חצים כתומים: שחזור מהסוף להתחלה</Note><La x={240} y={528} size={28}>G A T</La><La x={240} y={568} size={28}>G − T</La><La x={240} y={614} size={22}>+1 −1 +1 = 1</La><Note y={658}>שומרים תת־בעיות; אין צורך למנות את כל היישורים</Note></Fig>;
}
type Graph = Record<string,string[]>;
function Network({graph,pos,y=0,colors={},directed=false}:{graph:Graph;pos:Record<string,Pt>;y?:number;colors?:Record<string,string>;directed?:boolean}) {
  return <g transform={`translate(0 ${y})`}>{Object.entries(graph).flatMap(([a,nb])=>nb.filter(b=>directed||a<b).map(b=>{const [x1,y1]=pos[a],[x2,y2]=pos[b],d=Math.hypot(x2-x1,y2-y1),dx=(x2-x1)/d,dy=(y2-y1)/d;return directed?<Arrow key={`${a}-${b}`} x1={x1+27*dx} y1={y1+27*dy} x2={x2-29*dx} y2={y2-29*dy} color={MUTED}/>:<line key={`${a}-${b}`} x1={x1+27*dx} y1={y1+27*dy} x2={x2-27*dx} y2={y2-27*dy} stroke={MUTED} strokeWidth={2}/>;}))}{Object.keys(graph).map(n=><g key={n}><circle cx={pos[n][0]} cy={pos[n][1]} r={26} fill="white" stroke={colors[n]??BLUE} strokeWidth={2.5}/><La x={pos[n][0]} y={pos[n][1]+7} size={n==='HUB'?17:22} bold color={colors[n]??BLUE}>{n}</La></g>)}</g>;
}
function GraphTypes() {
  const graph={A:['B','C'],B:['A'],C:['A']},directed={A:['B','C'],B:['C'],C:[]},pos:Record<string,Pt>={A:[110,105],B:[365,105],C:[240,215]};
  return <Fig h={925} label="קשתות ברשת חלבונים, רשת בקרה וקונקטום — דוגמאות סכמטיות">{['אינטראקציות חלבון–חלבון','בקרת שעתוק','קונקטום · סינפסות כימיות'].map((title,i)=><Panel key={title} y={8+i*305} h={286} title={title} color={COLORS[i]}><Network graph={i?directed:graph} pos={pos} directed={i>0}/><Note y={266}>{i===0?'אין חץ: הקשר סימטרי':i===1?'חץ: מווסת → גן מטרה':'חץ: נוירון קדם־סינפטי → נוירון בתר־סינפטי'}</Note></Panel>)}</Fig>;
}
function BFSLayers() {
  const pos:Record<string,Pt>={A:[70,170],B:[180,115],C:[180,235],D:[300,115],E:[410,115],F:[180,430],G:[300,430]};
  const colors=Object.fromEntries(Object.keys(pos).map(n=>[n,n in data.bfs?COLORS[data.bfs[n as keyof typeof data.bfs]]:MUTED]));
  return <Fig h={715} label="BFS מ-A בגרף היחידה: מרחקים 0,1,2,3 ורכיב נפרד F–G"><Note y={29}>כל הקשתות מהקוד · צבע מציין מרחק מ־A</Note>{[0,1,2,3].map((v,i)=><g key={v}><La x={[70,180,300,410][i]} y={76} size={21} color={COLORS[i]}>{Math.abs(v)>=100000?v.toExponential(0):v}</La></g>)}<Network graph={data.ppi} pos={pos} colors={colors}/><Note y={307}>התור מתקדם שכבה אחר שכבה</Note><La x={240} y={346} size={20}>[A] → [B,C] → [D] → [E]</La><Note y={391}>רכיב נפרד · לא נגיש מ־A</Note><Table y={510} rows={[["node","A","B","C","D","E"],["distance",0,1,1,2,3]]} rh={48}/><Note y={650}>F ו־G אינם בפלט החיפוש מ־A</Note><La x={240} y={693} size={21}>BFS: O(V + E)</La></Fig>;
}
function DegreeDistribution() {
  const degrees=Object.values(data.net).map(a=>a.length),count=indices(6).map(k=>degrees.filter(d=>d===k).length);
  return <Fig h={775} label="התפלגות דרגות מחושבת לרשת של שמונה צמתים והמחשת זנב ארוך"><Note y={28}>רשת הדוגמה · 8 צמתים</Note><Chart y={35} xmin={.5} xmax={5.5} ymax={4.5} xt={[1,2,3,4,5]} yt={[0,2,4]} xlabel="degree k" ylabel="number of nodes" series={[]}/>{count.map((v,k)=>v?<rect key={k} x={82+354*(k-.5)/5-20} y={287-192*v/4.5} width={40} height={192*v/4.5} fill={BLUE}/>:null)}<La x={240} y={394} size={22}>[(1, 3), (2, 4), (5, 1)]</La><Panel y={430} h={320} title="זנב ארוך · סכמה איכותית" color={ORANGE}><path d="M70 73 V225 H425" fill="none" stroke={INK} strokeWidth={1.5}/><path d="M85 85 C110 120 110 180 170 198 S320 218 415 219" fill="none" stroke={ORANGE} strokeWidth={3}/><He x={250} y={87} size={19}>מעט רכזות עם הרבה שותפים</He><He x={250} y={263} size={19}>רוב הצמתים עם מעט שותפים</He><Note y={301} color={ORANGE}>רכזות ≠ הוכחה לרשת חסרת קנה מידה</Note></Panel></Fig>;
}
function Centrality() {
  const pos:Record<string,Pt>={HUB:[190,210],A:[90,100],B:[280,100],C:[65,250],E:[190,335],D:[330,210],F:[400,335],G:[325,440]};
  return <Fig h={775} label="רשת היחידה בדיוק, מרכזיות קרבה של HUB,D,G ו-D כגשר"><Note y={29}>8 צמתים · כל הקשתות של net</Note><Network graph={data.net} pos={pos} colors={{HUB:BLUE,D:ORANGE,G:TEAL}}/><Note y={501} color={ORANGE}>D מחבר בין הרכזת לבין F ו־G</Note><Table y={535} rows={[["node","degree","closeness"],...['HUB','D','G'].map(n=>[n,data.net[n as keyof typeof data.net].length,data.closeness[n as keyof typeof data.closeness].toFixed(2)])]} rh={41}/><Note y={735}>קרבה = הופכי המרחק הממוצע לשאר הצמתים</Note><Note y={766}>מרכזיות מבנית היא השערה לבדיקה ביולוגית</Note></Fig>;
}

function Scaling() {
  return <Fig h={955} label="שלושת הגנים לפני ואחרי ציון z: אותה צורה מתקרבת לאחר נרמול"><Note y={29}>אותם גנים · שלושה תנאים</Note><Chart y={40} xmin={1} xmax={3} ymax={65} xt={[1,2,3]} yt={[0,20,40,60]} xlabel="condition" ylabel="expression (raw)" series={data.genes.map((a,i)=>({p:a.map((v,j)=>[j+1,v]),color:COLORS[i],dots:true}))}/><La x={240} y={393} size={22}>d(g1,g2) = 67.3 | d(g1,g3) = 5.7</La><Chart y={422} xmin={1} xmax={3} ymin={-1.5} ymax={1.5} xt={[1,2,3]} yt={[-1,0,1]} xlabel="condition" ylabel="z = (x − mean) / SD" series={data.zgenes.map((a,i)=>({p:a.map((v,j)=>[j+1,v]),color:COLORS[i],dots:i!==1,dash:i===1}))}/><La x={240} y={783} size={22}>d(z1,z2) = 0.0 | d(z1,z3) = 3.46</La>{['g1','g2','g3'].map((v,i)=><La key={v} x={110+i*130} y={830} size={22} bold color={COLORS[i]}>{v}</La>)}<Note y={875}>אחרי נרמול g1 ו־g2 חופפים בדיוק</Note><Note y={920}>סטיית תקן מחושבת עם חלוקה ב־3, כמו בקוד</Note></Fig>;
}
function KMeansSteps() {
  const stages=[data.kmeans[0],data.kmeans[0],{centers:data.kmeans[1].centers,labels:data.kmeans[0].labels},data.kmeans[data.kmeans.length-1]],titles=['1. אתחול · שני מרכזים קרובים','2. שיוך למרכז הקרוב','3. עדכון · ממוצע חברי הקבוצה','4. חזרה עד התכנסות'];
  return <Fig h={1650} label="k-means על שש נקודות היחידה, משני המרכזים הראשונים להתכנסות">{stages.map((s,i)=><g key={i}><He x={240} y={28+i*385} size={21} bold>{titles[i]}</He><Chart y={42+i*385} xmin={0} xmax={10} ymax={11} xt={[0,5,10]} yt={[0,5,10]} xlabel="x" ylabel="y" series={[...data.points.map((p,j)=>({p:[p as Pt],color:i===0?MUTED:COLORS[s.labels[j]],dots:true})),...s.centers.map((p,j)=>({p:[p as Pt],color:COLORS[j],centers:true}))]}/></g>)}<La x={240} y={1584} size={20}>centers: (1.5, 1.33), (8.5, 8.67)</La><Note y={1625}>עיגול: נקודה · ריבוע חלול: מרכז קבוצה</Note></Fig>;
}
function ImageMatrix() {
  return <Fig h={930} label="תמונת 5 על 5 המקורית כמטריצת ערכים וכגווני אפור; הפיקסל 82"><Note y={29}>מוצא בפינה שמאלית עליונה · שורה לפני עמודה</Note><La x={240} y={71} size={22}>column →</La>{indices(5).map(i=><g key={i}><La x={128+i*56} y={111} size={20} color={BLUE}>{i}</La><La x={71} y={155+i*56} size={20} color={TEAL}>{i}</La></g>)}<Grid a={data.image} y={120} select={[2,1]}/><La x={240} y={446} size={24} color={ORANGE}>img[2, 1] = 82</La><Note y={486}>אותה מטריצה · עוצמה קבועה: 0–255</Note><Grid a={data.image} y={515} mode="grey"/><rect x={156} y={627} width={56} height={56} fill="none" stroke="#fbbf24" strokeWidth={3}/><rect x={100} y={825} width={280} height={18} fill="url(#cb-grey)"/><defs><linearGradient id="cb-grey"><stop stopColor="black"/><stop offset="1" stopColor="white"/></linearGradient></defs><La x={100} y={878} size={19}>0</La><La x={380} y={878} size={19}>255</La><Note y={919}>הערכים אינם מתוחים למקסימום התמונה</Note></Fig>;
}
function Otsu() {
  const sx=(v:number)=>82+354*v/100, sy=(v:number)=>252-192*v/10;
  return <Fig h={865} label="היסטוגרמת 25 הפיקסלים, סף אוטסו 12 ומסכה עם 5 פיקסלים"><Chart xmin={0} xmax={100} ymax={10} xt={[0,25,50,75,100]} yt={[0,5,10]} xlabel="pixel intensity" ylabel="number of pixels" series={[]} />{data.imageCounts.map((v,i)=>v?<rect key={i} x={sx(i)} y={sy(v)} width={3.1} height={252-sy(v)} fill={i>data.otsu?TEAL:BLUE}/>:null)}<line x1={sx(data.otsu)} x2={sx(data.otsu)} y1={54} y2={252} stroke={ORANGE} strokeWidth={2} strokeDasharray="5 5"/><La x={240} y={360} size={23} color={ORANGE}>threshold_otsu(img) = 12</La><Note y={402}>אין פיקסלים בעמק שבין 12 ל־78</Note><La x={240} y={446} size={22}>mask = img &gt; 12</La><Grid a={data.image.map(r=>r.map(v=>Number(v>data.otsu)))} y={475} mode="mask"/><La x={240} y={802} size={23}>mask.sum() = 5</La><Note y={844}>אוטסו בוחר את קצה הרקע כאן, לא את אמצע העמק</Note></Fig>;
}
function UnevenIllumination() {
  const d=data.illumination,rows=[{a:d.raw,b:d.globalMask,title:'1. תמונת המקור ← סף גלובלי',left:'raw · 0–150',right:'global Otsu mask',note:'62 עצמים · 51% מהשטח · כשל',color:ORANGE},{a:d.trend,b:d.flat,title:'2. הערכת רקע והחסרה',left:'trend · σ = 20',right:'flat = smooth − trend',note:'smooth: σ = 1 · אותו רעש, אותם 5 תאים',color:BLUE},{a:d.flat,b:d.flatMask,title:'3. אחרי תיקון התאורה',left:'flat (display rescaled)',right:'Otsu mask → 5 cells',note:'מעלים סחיפת רקע ואז מפעילים סף',color:TEAL}];
  return <Fig h={1140} label="תמונת 100 על 100 מחושבת: כשל סף גלובלי עם 62 עצמים, תיקון ל-5">{rows.map((r,i)=><Panel key={i} y={8+i*365} h={345} title={r.title} color={r.color}><Raster href={r.a} x={30} y={58}/><Raster href={r.b} x={250} y={58}/><La x={130} y={289} size={17}>{r.left}</La><La x={350} y={289} size={17}>{r.right}</La><Note y={326} color={r.color}>{r.note}</Note></Panel>)}<La x={240} y={1127} size={18}>default_rng(0) · noise SD = 3 · radius &lt; 8 px</La></Fig>;
}
function Convolution() {
  return <Fig h={920} label="פיקסל חם בתוך חלון 3 על 3: קונבולוציית ממוצע 20 לעומת חציון 10"><Note y={29}>חלון 3×3 מעל פיקסל חם</Note><Grid a={data.spot} x={120} y={62} size={240} select={[1,1]}/><Panel y={335} h={242} title="גרעין ממוצע · קונבולוציה"><Table x={105} w={270} y={56} rh={34} rows={indices(3).map(()=>['1/9','1/9','1/9'])}/><La x={240} y={199} size={23} color={BLUE}>(8 × 10 + 100) / 9 = 20</La><Note y={229}>הגרעין נע; כאן מוצג החלון המרכזי</Note></Panel><Panel y={594} h={180} title="חציון · פעולה לא ליניארית" color={TEAL}><La x={240} y={86} size={19}>10, 10, 10, 10, [10], 10, 10, 10, 100</La><La x={240} y={133} size={24} color={TEAL}>median = 10</La><Note y={164}>אינו קונבולוציה עם גרעין קבוע</Note></Panel><La x={240} y={822} size={22}>mean3[1,1] = 20 | med3[1,1] = 10</La><Note y={866}>החציון מסיר גם נקודה אמיתית בגודל פיקסל</Note><Note y={903}>קצוות התמונה בקוד: mode=&quot;nearest&quot;</Note></Fig>;
}
function Labeling() {
  const d=data.segmentation;
  return <Fig h={735} label="מסכת היחידה ותיוג שלושה רכיבים, בשטחים 109,9,372 פיקסלים"><Note y={29}>מסכה בינארית ← רכיבים מחוברים</Note><Raster href={d.mask} x={30} y={62}/><Raster href={d.labels} x={250} y={62}/><La x={130} y={299} size={22}>mask</La><La x={350} y={299} size={22}>label(mask)</La><Table y={344} rows={[["label","area (px)"],[1,d.areas[0]],[2,d.areas[1]],[3,d.areas[2]]]} rh={48}/><He x={240} y={581} size={20} color={BLUE}>1 · תא יחיד</He><He x={240} y={619} size={20} color={ORANGE}>2 · פירור · 9 פיקסלים</He><He x={240} y={657} size={20} color={TEAL}>3 · זוג תאים נוגעים נספר כרכיב אחד</He><Note y={708}>תיוג אינו מבטיח אובייקט ביולוגי אחד לכל מספר</Note></Fig>;
}
function Watershed() {
  const d=data.segmentation;
  return <Fig h={840} label="התמרת המרחק והזרעים מחושבים ממסכת היחידה; שני תאים נפרדים בשטח 186 כל אחד"><Panel y={8} h={350} title="1. מרחק לקצה ← שיאים כזרעים"><Raster href={d.distance} x={100} y={61} w={280}/>{d.peaks.map(([r,c],i)=><circle key={i} cx={100+(c+.5)*280/60} cy={61+(r+.5)*280/60} r={4} fill="#fbbf24"/> )}</Panel><Note y={386}>צהוב: peak_local_max · min_distance = 5</Note><Panel y={417} h={335} title="2. watershed על מינוס המרחק" color={TEAL}><Raster href={d.watershed} x={120} y={54} w={240}/><Note y={320}>372 פיקסלים חולקו ל־186 + 186</Note></Panel><Note y={793}>ארבעה אזורים: תא יחיד, פירור ושני תאים מופרדים</Note><Note y={829}>מסנן גודל לפירור הוא שלב נפרד</Note></Fig>;
}
function TrackingCase({y,lost=false}:{y:number;lost?:boolean}) {
  const curr=lost?data.tracking.lost:data.tracking.curr,prev=[[10,10],[30,12],[50,40]],sx=(v:number)=>85+6*v,sy=(v:number)=>65+6*v;
  return <Panel y={y} h={455} title={lost?'2. קפיצה גדולה מדי · מסלול נקטע':'1. קישור לשכן הקרוב'} color={lost?ORANGE:BLUE}>{prev.map(([x,v],i)=>{const [cx,cy]=curr[i],col=COLORS[i];return <g key={i}><circle cx={sx(x)} cy={sy(v)} r={48} fill="none" stroke={LINE} strokeDasharray="4 5"/><circle cx={sx(x)} cy={sy(v)} r={8} fill="white" stroke={col} strokeWidth={2}/>{(!lost||i!==1)&&<Arrow x1={sx(x)} y1={sy(v)+12} x2={sx(cx)} y2={sy(cy)+12} color={col}/>}<rect x={sx(cx)-5} y={sy(cy)-5} width={10} height={10} fill={col}/><La x={sx(x)} y={sy(v)-61} size={19} color={col}>{`id ${i+1}`}</La></g>;})}<La x={240} y={371} size={18}>{lost?'{1: 0, 3: 2}':'{1: 0, 2: 1, 3: 2}'}</La><Note y={408}>{lost?'ל־id 2 אין זיהוי במרחק קטן מ־8':'עיגול פתוח: frame0 · ריבוע: frame1'}</Note><Note y={440}>רדיוס הקפיצה המרבי: 8 פיקסלים</Note></Panel>;
}
function Tracking() {
  return <Fig h={1295} label="קישורי מעקב מדויקים בשני מקרי היחידה וסכמת החלפת זהויות"><TrackingCase y={8}/><TrackingCase y={480} lost/><Panel y={954} h={321} title="3. החלפת זהויות · סכמה" color={RED}><La x={110} y={78} size={20}>frame t</La><La x={370} y={78} size={20}>frame t+1</La><Arrow x1={145} y1={124} x2={335} y2={213} color={BLUE}/><Arrow x1={145} y1={213} x2={335} y2={124} color={ORANGE}/>{[[110,124,BLUE],[110,213,ORANGE],[370,124,ORANGE],[370,213,BLUE]].map(([x,y,c],i)=><circle key={i} cx={Number(x)} cy={Number(y)} r={15} fill={String(c)}/>)}<Note y={270}>המסלולים האמיתיים חוצים; קישור קצר עלול לטעות</Note><Note y={304}>צבע: זהות אמיתית · אין כאן נתוני ניסוי</Note></Panel></Fig>;
}
const exact=(t:number,beta=10)=>beta/.5*(1-Math.exp(-.5*t));
function euler(dt:number,end:number):Pt[] {let x=0;const a:Pt[]=[[0,0]];for(let i=0;i<Math.round(end/dt);i++){x+=dt*(10-.5*x);a.push([(i+1)*dt,x]);}return a;}
function ProductionDegradation() {
  const half=Math.log(2)/.5;
  return <Fig h={665} label="ייצור ופירוק מחושבים: הכפלת בטא מכפילה את מצב שיווי המשקל בלי לשנות את זמן המחצית"><Chart xmin={0} xmax={10} ymax={44} xt={[0,2,4,6,8,10]} yt={[0,10,20,30,40]} xlabel="t (min)" ylabel="x (nM)" hlines={[20,40]} vlines={[half]} series={[{p:sample(t=>exact(t),0,10),color:BLUE},{p:sample(t=>exact(t,20),0,10),color:ORANGE},{p:[[half,10]],color:BLUE,dots:true},{p:[[half,20]],color:ORANGE,dots:true}]}/><La x={240} y={365} size={22} color={BLUE}>β = 10 → x* = 20 nM</La><La x={240} y={409} size={22} color={ORANGE}>2β = 20 → x* = 40 nM</La><La x={240} y={453} size={22}>α = 0.5 min⁻¹</La><La x={240} y={500} size={24}>t½ = ln(2)/α = 1.39 min</La><Note y={545}>בשתי העקומות: חצי מהיעד באותו זמן</Note><La x={240} y={591} size={22}>x(t) = (β/α)(1 − exp(−αt))</La><Note y={638}>x(0) = 0 · ריכוזים רציפים במודל</Note></Fig>;
}
function EulerSteps() {
  return <Fig h={1130} label="אוילר מול הפתרון המדויק; צעד קטן מתכנס וצעד גדול יוצר אי-יציבות"><Chart xmin={0} xmax={4} ymax={22} xt={[0,1,2,3,4]} yt={[0,10,20]} xlabel="t (min)" ylabel="x (nM)" series={[{p:sample(t=>exact(t),0,4),color:INK},...[2,1,.1].map((dt,i)=>({p:euler(dt,4),color:COLORS[i],dots:dt>=1,dash:true}))]}/><La x={240} y={360} size={20}>exact (black): x(4) = 17.293</La>{[2,1,.1].map((dt,i)=><La key={dt} x={240} y={402+i*38} size={21} color={COLORS[i]}>{`Δt = ${dt}: x(4) = ${euler(dt,4).at(-1)![1].toFixed(dt===.1?2:2)}`}</La>)}<He x={240} y={537} size={21} bold color={RED}>חלונית אי־יציבות · אותה משוואה</He><Chart y={557} xmin={0} xmax={20} ymin={-90} ymax={100} xt={[0,5,10,15,20]} yt={[-80,0,40,80]} xlabel="t (min)" ylabel="x (nM)" hlines={[20]} series={[{p:sample(t=>exact(t),0,20),color:INK},...[4,5].map((dt,i)=>({p:euler(dt,20),color:[PURPLE,RED][i],dots:true,dash:i===1}))]}/><La x={240} y={920} size={21} color={PURPLE}>Δt = 4: 0, 40, 0, 40, 0, 40</La><La x={240} y={960} size={20} color={RED}>Δt = 5: 0, 50, −25, 87.5, −81.25</La><Note y={1005}>תנודות וריכוז שלילי הם שגיאת החישוב</Note><La x={240} y={1050} size={23}>stability: Δt &lt; 2/α = 4 min</La><Note y={1098}>קטן יותר אינו מספיק: בודקים התכנסות</Note></Fig>;
}
function FeedbackLoop() {
  return <Fig h={880} label="X מדכא את הפרומוטור של עצמו; עקומות דיכוי היל עבור n שווה 1 או 4"><Panel y={8} h={295} title="משוב שלילי עצמי"><path d="M65 170 H310" fill="none" stroke={BLUE} strokeWidth={6}/><rect x={105} y={154} width={42} height={31} fill="#dbeafe" stroke={BLUE}/><path d="M178 150 H275 L295 170 L275 190 H178Z" fill="#99f6e4" stroke={TEAL}/><La x={235} y={178} size={22}>X</La><He x={126} y={232} size={20}>פרומוטור</He><Arrow x1={320} y1={170} x2={381} y2={170} color={TEAL}/><path d="M368 153 Q380 127 406 151 Q430 164 407 187 Q385 201 368 177Z" fill="#ccfbf1" stroke={TEAL} strokeWidth={2}/><La x={394} y={237} size={20}>protein X</La><path d="M392 127 V81 H126 V139 M113 139 H139" fill="none" stroke={ORANGE} strokeWidth={2.5}/><He x={260} y={66} size={19} color={ORANGE}>דיכוי עצמי</He><Note y={276}>סכמה · ללא קנה מידה מולקולרי</Note></Panel><Chart y={329} xmin={0} xmax={3} ymax={1.05} xt={[0,1,2,3]} yt={[0,.5,1]} xlabel="x / K" ylabel="production / β" vlines={[1]} hlines={[.5]} series={[1,4].map((n,i)=>({p:sample(x=>1/(1+x**n),0,3),color:COLORS[i],dash:i===1}))}/><La x={240} y={694} size={22} color={BLUE}>n = 1 · gradual</La><La x={240} y={735} size={22} color={ORANGE}>n = 4 · steeper</La><La x={240} y={779} size={22}>production = β / (1 + (x/K)ⁿ)</La><Note y={826}>ב־x = K: קצב הייצור הוא חצי מהמרבי</Note><Note y={864}>העקומה מציגה קצב ייצור; פירוק αx נפרד</Note></Fig>;
}
function NARvsSimple() {
  const d=data.feedback,p=(a:number[])=>a.map((v,i)=>[i*.01,v] as Pt);
  return <Fig h={1100} label="משוב שלילי מול בקרה פשוטה לאותו מצב יציב 1.787, זמן מחצית 0.052 מול 0.693"><Chart xmin={0} xmax={3} ymax={2} xt={[0,1,2,3]} yt={[0,1,2]} xlabel="t (model time units)" ylabel="x" hlines={[d.xstar,d.xstar/2]} series={[{p:p(d.nar),color:BLUE},{p:p(d.simple),color:ORANGE}]}/><La x={240} y={360} size={22}>α = K = 1 · n = 4 · β_NAR = 20</La><La x={240} y={404} size={23}>same x* = {d.xstar.toFixed(3)}</La><He x={240} y={453} size={21} bold>הגדלת תחילת התגובה</He><Chart y={475} xmin={0} xmax={.8} ymax={1.25} xt={[0,.2,.4,.6,.8]} yt={[0,.5,1]} xlabel="t (model time units)" ylabel="x / x*" hlines={[.5,1]} vlines={[d.halfNar,d.halfSimple]} series={[{p:p(d.nar).filter(([t])=>t<=.8).map(([t,v])=>[t,v/d.xstar]),color:BLUE},{p:p(d.simple).filter(([t])=>t<=.8).map(([t,v])=>[t,v/d.xstar]),color:ORANGE}]}/><La x={240} y={844} size={22} color={BLUE}>NAR: t½ = {d.halfNar.toFixed(3)}</La><La x={240} y={885} size={22} color={ORANGE}>simple: t½ = {d.halfSimple.toFixed(3)}</La><Note y={934}>אותו יעד · תגובה מהירה בערך פי 13</Note><La x={240} y={979} size={21}>Euler Δt = 0.001</La><Note y={1024}>בקרה פשוטה: β = αx* ≈ 1.787</Note><Note y={1066}>הערכים חושבו באותה שיטת אוילר שבקוד</Note></Fig>;
}
function Pipeline() {
  const stages=[['שאלה','האם המוטנט זז מהר יותר?'],['ייצוג','טבלת מעקב: תולעת, פריים, מהירות'],['אלגוריתם','סף, תיוג, מעקב וסיכום'],['סיכום לפי יחידת הניתוח','ממוצע לכל תולעת: 10 מספרים'],['תיקוף','בדיקה ידנית ומודל אפס מתאים']];
  return <Fig h={815} label="צינור הניתוח מהשאלה על מהירות מוטנט לנתוני תולעות ולתיקוף">{stages.map(([t,d],i)=><g key={t}><Panel y={8+i*148} h={119} title={`${i+1}. ${t}`} color={COLORS[i%4]}><Note y={79}>{d}</Note></Panel>{i<4&&<Arrow x1={240} y1={131+i*148} x2={240} y2={151+i*148}/>}</g>)}<Note y={786}>פריימים רבים מאותה תולעת אינם חזרות עצמאיות</Note></Fig>;
}
function RandomWalk() {
  const walks=data.walks.map(points),all=walks.flat(),extent=Math.max(...all.flatMap(([x,y])=>[Math.abs(x),Math.abs(y)])),scale=170/extent;
  return <Fig h={1050} label="שלוש הליכות אקראיות מאותו seed ו-MSD של 500 הליכות, בהשוואה לישר התאורטי"><Panel y={8} h={470} title="שלוש מתוך 500 הליכות · 100 צעדים">{walks.map((w,i)=><g key={i}><path d={path(w.map(([x,y])=>[240+x*scale,245-y*scale]))} fill="none" stroke={COLORS[i]} strokeWidth={2}/><circle cx={240+w[100][0]*scale} cy={245-w[100][1]*scale} r={5} fill={COLORS[i]}/></g>)}<circle cx={240} cy={245} r={5} fill={INK}/><La x={240} y={444} size={19}>unit steps · default_rng(0) · equal x/y scale</La></Panel><Chart y={496} xmin={0} xmax={100} ymax={110} xt={[0,10,50,100]} yt={[0,50,100]} xlabel="steps t" ylabel="MSD (step length²)" series={[{p:[[0,0],[100,100]],color:ORANGE,dash:true},{p:[[0,0],...data.msd.map((v,i)=>[i+1,v] as Pt)],color:BLUE},{p:[10,50,100].map(t=>[t,data.msd[t-1]]),color:BLUE,dots:true,connect:false}]}/><La x={240} y={857} size={22}>t = 10, 50, 100</La><La x={240} y={898} size={22} color={BLUE}>MSD = 10.0, 49.3, 102.4</La><Note y={943} color={ORANGE}>מקווקו: התוחלת התאורטית · MSD = t</Note><Note y={983}>שיפוע תאורטי 1; המדגם מתנודד סביב הישר</Note><Note y={1024}>צעד יחידה · כיוונים אחידים ועצמאיים</Note></Fig>;
}

export const COMPUTATIONAL_FIGURES: Record<string,{el:()=>React.JSX.Element;captionHe:string}> = {
  'cb-problem-to-program': {el:ProblemToProgram,captionHe:'השאלה על EcoRI מתורגמת לקלט, פלט ואלגוריתם. הרצף הקטן מהיחידה מכיל שני אתרי GAATTC המתחילים באינדקסים 1 ו־7.'},
  'cb-representations': {el:Representations,captionHe:'דוגמאות קטנות לייצוגים שביחידה; מדידות הביטוי והמטריצה נלקחו מדוגמאות הקוד בהמשך הקורס. הגרף סכמטי וממחיש קשרים, ללא נתוני ניסוי.'},
  'cb-growth-rates': {el:GrowthRates,captionHe:'פונקציות צמיחה מחושבות עם מקדם 1 ולוג בבסיס 2; אינן מדידת זמן ריצה. טבלת n² מציגה את פונקציית הצמיחה. דוגמת היחידה סופרת זוגות גנים שונים ללא סדר ולכן נותנת 7,998,000, בקירוב 8 מיליון.'},
  'cb-list-vs-dict': {el:ListVsDict,captionHe:'רשימת הביטוי והמילון לאחר פעולות ההוספה שבקוד. כותרת הרשימה היא אינדקס 0–4; מילון מחפש מפתח כגון GCG ומחזיר A.'},
  'cb-dataframe': {el:Dataframe,captionHe:'כל חמש השורות ושלוש העמודות בדיוק כמו df ביחידה. NaN הוא ערך חסר ולא אפס. dropna מסיר את dnaK ומשאיר את האינדקסים המקוריים 0–3.'},
  'cb-histogram': {el:Histogram,captionHe:'היסטוגרמה מחושבת מ־500 אורכים מדומים: NumPy default_rng(0), ממוצע 2 וסטיית תקן 0.2 μm. אותם 30 תאים ואותם גבולות כמו plt.hist(lengths, bins=30).'},
  'cb-binary-search': {el:BinarySearch,captionHe:'שתי בדיקות לפי הקוד בדיוק: mid=2 נותן 5400 ולכן lo=3; mid=3 נותן 47000. מחזירים 3, האינדקס ברשימה הממוינת.'},
  'cb-sliding-window': {el:SlidingWindow,captionHe:'שתי דוגמאות היחידה נשמרות בנפרד: ATAT מופיע ב־1,3,9 ברצף הראשון; ברצף ספירת המילים CATG ו־GCAT מופיעות שלוש פעמים כל אחת. החלונות חופפים ואורכם 4.'},
  'cb-gc-skew': {el:GCSkew,captionHe:'פרופיל מצטבר מחושב לרצף היחידה: G מוסיף 1, C מחסיר 1, A/T אינם משנים. שני המינימים הם 11 ו־24. המעגל הוא סכמה נפרדת של ori ו־ter, ללא מיפוי מיקומי הרצף הקצר לכרומוזום.'},
  'cb-dp-table': {el:DPTable,captionHe:'טבלה מחושבת עבור GAT מול GT עם התאמה +1, אי־התאמה ורווח −1. המסלול הכתום משחזר GAT מול G-T ונותן ציון סופי 1.'},
  'cb-graph-types': {el:GraphTypes,captionHe:'שלוש דוגמאות מושגיות לפי סוגי הרשתות בטקסט. ברשת PPI הקשת סימטרית; בבקרה ובסינפסות כימיות הכיוון מפורש. אין כאן מפה ניסויית של קונקטום מסוים.'},
  'cb-bfs-layers': {el:BFSLayers,captionHe:'רשת ppi מהקוד עם כל שבעת הצמתים וכל הקשתות. BFS מ־A מחזיר A:0, B:1, C:1, D:2, E:3. לרכיב F–G אין מסלול מ־A.'},
  'cb-degree-distribution': {el:DegreeDistribution,captionHe:'העמודות מחושבות מרשת net עם שמונה צמתים. הסכמה התחתונה מתארת זנב ארוך בלבד; היא אינה התאמה לחוק חזקה. נוכחות רכזת אינה הוכחת scale-free.'},
  'cb-centrality': {el:Centrality,captionHe:'כל קשתות net מהיחידה. מרכזיות הקרבה מחושבת ב־BFS: HUB=0.70, D≈0.58, G≈0.32. D בעל דרגה 2 ומחבר את הרכזת למסלול F–G.'},
  'cb-scaling': {el:Scaling,captionHe:'אותם g1=[2,4,6], g2=[20,40,60], g3=[6,4,2]. ציון z מחושב לכל גן בנפרד עם סטיית התקן של הקוד. g1 ו־g2 חופפים אחרי הנרמול, והמרחקים הם 0 ו־3.46.'},
  'cb-kmeans-steps': {el:KMeansSteps,captionHe:'שש הנקודות והאתחול [pts[0],pts[1]] בדיוק מהקוד. הריבועים הם מרכזים והעיגולים נקודות; שלבי שיוך ועדכון חושבו, עד מרכזים (1.5,1.3333) ו־(8.5,8.6667). הצירים אינם תכונות ביולוגיות שהוגדרו בניסוי.'},
  'cb-image-matrix': {el:ImageMatrix,captionHe:'מטריצת img המקורית, ללא שינוי ערכים. למטה אותה תמונה במיפוי קבוע 0–255; גם הפיקסלים הבהירים נשארים אפורים כי המקסימום הוא 90. סימון כתום/צהוב מדגיש שורה 2 ועמודה 1.'},
  'cb-otsu': {el:Otsu,captionHe:'היסטוגרמה מדויקת של 25 ערכי img. אוטסו בוחר 12; התנאי img>12 מחזיר חמישה פיקסלים. בדוגמה הבדידה כמה ספים בעמק נותנים אותו פיצול; הקוד מחזיר את קצה קבוצת הרקע.'},
  'cb-uneven-illumination': {el:UnevenIllumination,captionHe:'חישוב מלא עם זרע 0 וכל פרמטרי היחידה: רקע 20+0.8x, חמישה דיסקים ברדיוס קטן מ־8, תוספת עוצמה 40 ורעש SD=3. Otsu גלובלי יוצר 62 רכיבים; החסרת trend עם σ=20 מ־smooth עם σ=1 ואז Otsu נותנת 5. המקור והרקע מוצגים באותו סולם 0–150; flat נמתח לתצוגה בלבד.'},
  'cb-convolution': {el:Convolution,captionHe:'חלון spot המקורי: שמונה ערכי 10 וערך מרכזי 100. גרעין ממוצע 3×3 נותן 20 במרכז, וחציון נותן 10. חציון אינו קונבולוציה. קווי הרשת רק מסמנים גבולות פיקסלים.'},
  'cb-labeling': {el:Labeling,captionHe:'מסכת 60×60 ו־label(mask) מחושבות בדיוק מהדיסקים ביחידה. שלושת הרכיבים בסריקת התמונה: תא יחיד 109, פירור 9, זוג נוגע 372 פיקסלים. הצבעים מציינים תווית ולא סוג תא.'},
  'cb-watershed': {el:Watershed,captionHe:'distance_transform_edt, שיאים עם min_distance=5 ו־watershed(-dist) מחושבים מאותה מסכה. ארבעת האזורים כוללים את הפירור; הזוג הנוגע חולק ל־186+186. צבעי האזורים הם תוויות watershed חדשות.'},
  'cb-tracking': {el:Tracking,captionHe:'שני מקרי track עם אותם קואורדינטות, max_jump=8 ואותם קישורים מהקוד. מעגל מקווקו מראה את טווח החיפוש; צירי x ו־y נשמרים באותו קנה מידה. החלונית האחרונה סכמטית ומציגה סכנת החלפת זהויות.'},
  'cb-production-degradation': {el:ProductionDegradation,captionHe:'הפתרון המדויק מחושב עבור β=10 ו־α=0.5, ולשם השוואה גם β=20. מצבים יציבים 20 ו־40 nM, ובשניהם t½=ln(2)/0.5≈1.39 דקות.'},
  'cb-euler-steps': {el:EulerSteps,captionHe:'המודל β=10, α=0.5 מחושב באוילר עם Δt=2,1,0.1 עד 4 דקות, מול הפתרון המדויק. החלונית התחתונה ממשיכה עד 20 דקות עם צעדי 4 ו־5; התנודות והערכים השליליים הם אי־יציבות נומרית, לא תכונה של המודל.'},
  'cb-feedback-loop': {el:FeedbackLoop,captionHe:'סכמה מקורית: תוצר X מעכב את הפרומוטור של עצמו. הגרף מחושב כפונקציה של x/K, בקצב מנורמל ל־β, עבור n=1 ו־4; שתי העקומות עוברות ב־(1,0.5).'},
  'cb-nar-vs-simple': {el:NARvsSimple,captionHe:'אותו קוד אוילר Δt=0.001 ופרמטרי היחידה: α=K=1, n=4, β=20 במשוב. הבקרה הפשוטה משתמשת ב־β=αx* כדי לשמור אותו יעד x*=1.787. זמני חצי מהיעד: 0.052 במשוב מול 0.693 בפשוטה.'},
  'cb-pipeline': {el:Pipeline,captionHe:'שרשרת הניתוח מהיחידה, עם דוגמת המוטנט ותולעי C. elegans. מסכמים מהירות לכל בעל חיים לפני השוואה; מספר הפריימים אינו מספר החזרות הבלתי תלויות.'},
  'cb-random-walk': {el:RandomWalk,captionHe:'שלוש ההליכות הראשונות ו־MSD מכל 500 ההליכות בקוד המקורי, default_rng(0), מאה צעדים באורך 1. הערכים בצעדים 10,50,100 הם 10.0,49.3,102.4. הקו הכתום הוא התוחלת התאורטית MSD=t עם שיפוע 1; הקו הכחול הוא המדגם המחושב.'},
};
