/* Textbook-level redraw by Codex (2026-11-02); the previous version is archived in archive/figures/2026-11-02/. */
import { Svg, He, La } from "./helpers";

// Original topology illustration. Color identifies the same RNA region in both views;
// spline geometry is schematic, not an atomic model or a nucleotide count.
export function TrnaStructure() {
 const blue='#5584a2',teal='#388f91',orange='#c78151',gold='#b89d46',purple='#9276ac';
 const tube=(d:string,c:string,w=7)=><g><path d={d} fill="none" stroke={c} strokeWidth={w+2} strokeLinecap="round" strokeLinejoin="round"/><path d={d} fill="none" stroke="#ffffff" strokeOpacity={.36} strokeWidth={w/3} strokeLinecap="round" transform="translate(-1 -1)"/></g>;
 const vp=(x:number,y:number,n:number)=>Array.from({length:n},(_,i)=><line key={i} x1={x} y1={y+i*12} x2={x+32} y2={y+i*12} stroke="#8b9aa6" strokeWidth={1.4}/>);
 const hp=(x:number,y:number,n:number)=>Array.from({length:n},(_,i)=><line key={i} x1={x+i*12} y1={y} x2={x+i*12} y2={y+36} stroke="#8b9aa6" strokeWidth={1.4}/>);
 const label='מבנה התלתן של tRNA: זרוע הקבלה עם קצה CCA שאליו מחוברת חומצת האמינו, זרוע D, זרוע TψC, לולאה משתנה, וזרוע האנטיקודון שבלולאה שלה שלושת בסיסי האנטיקודון';
 // A paired helical tube in projection, used only in the tertiary-structure panel.
 const helix=(x:number,y:number,length:number,vertical:boolean,c:string)=>{
  const pt=(t:number,side:number)=>{const wave=12*Math.sin(t*Math.PI*4+side*Math.PI);return vertical?[x+wave,y+length*t]:[x+length*t,y+wave];};
  const strand=(side:number)=>Array.from({length:81},(_,i)=>{const [a,b]=pt(i/80,side);return `${i?'L':'M'}${a.toFixed(2)} ${b.toFixed(2)}`;}).join(' ');
  return <g>{Array.from({length:15},(_,i)=>{const [a,b]=pt((i+.5)/15,0),[e,f]=pt((i+.5)/15,1);return <line key={i} x1={a} y1={b} x2={e} y2={f} stroke={c} strokeOpacity={.55} strokeWidth={2}/>;})}{tube(strand(0),c,6)}{tube(strand(1),c,6)}</g>;
 };
 return <Svg w={520} h={1100} label={label}>
  <defs><radialGradient id="trna-aa"><stop stopColor="#e0f0dd"/><stop offset=".65" stopColor="#8eb990"/><stop offset="1" stopColor="#54805c"/></radialGradient></defs>
  <rect x={8} y={8} width={504} height={1084} rx={16} fill="var(--paper, #fff)"/>
  <He x={260} y={40} size={22} bold>מבנה ה־⁦tRNA⁩</He>
  <He x={260} y={67} size={15} color="var(--muted, #64748b)">אותה מולקולה — שתי דרכי ייצוג</He>
  <rect x={20} y={84} width={480} height={528} rx={14} fill="var(--panel, #f4f7fa)"/>
  <He x={260} y={113} size={18} bold>א · מבנה שניוני — תלתן</He>
  <g transform="translate(0 78)">
   {vp(234,167,6)}{hp(178,228,3)}{hp(286,228,4)}{vp(234,310,5)}
   {tube('M234 156 L234 218 Q234 228 220 228 L172 228',blue)}
   {tube('M172 228 C150 228 155 242 132 242 C88 242 88 284 132 284 C155 284 153 264 172 264 L212 264 Q234 264 234 294',orange)}
   {tube('M234 294 L234 360 C209 374 210 407 232 418',teal)}
   {tube('M264 418 C289 407 291 374 266 360 L266 294',teal)}
   {tube('M266 294 Q283 328 305 310 Q323 288 291 280 Q276 275 266 264',purple)}
   {tube('M266 264 L328 264 C347 264 347 284 372 284 C415 284 415 242 372 242 C347 242 347 228 328 228 L280 228 Q266 228 266 218',gold)}
   {tube('M266 218 L266 156 L266 105',blue)}
   {tube('M266 105 L292 89','#6f936b',2)}
   <circle cx={301} cy={83} r={15} fill="url(#trna-aa)" stroke="#4f7857" strokeWidth={1.4}/>
   <La x={301} y={87} size={11} bold color="#25364a">aa</La>
   <He x={382} y={119} size={15} color="var(--ink, #25364a)">חומצת אמינו</He>
   <La x={233} y={143} size={14} bold>5′</La>
   <La x={263} y={63} size={14} bold>3′</La>
   {['C','C','A'].map((c,i)=><g key={i}><circle cx={266} cy={143-i*19} r={9} fill="var(--paper, #fff)"/><La x={266} y={148-i*19} size={14} bold color="var(--ink, #25364a)">{c}</La></g>)}
   <He x={361} y={190} size={15}>זרוע הקבלה</He>
   <He x={113} y={319} size={15} color="var(--ink, #25364a)">זרוע ⁦D⁩</He>
   <La x={379} y={319} size={15} bold color="var(--ink, #25364a)">TψC</La>
   <He x={373} y={361} size={14} color="var(--ink, #25364a)">לולאה משתנה</He>
   {['G','A','A'].map((c,i)=><g key={i}><circle cx={232+i*16} cy={418+(i===1?5:0)} r={9} fill="var(--paper, #fff)" stroke={teal} strokeWidth={1.2}/><La x={232+i*16} y={423+(i===1?5:0)} size={12} bold>{c}</La></g>)}
   <He x={260} y={466} size={16} bold color="var(--ink, #25364a)">אנטיקודון</He>
   <La x={260} y={490} size={14}>5′–GAA–3′</La>
  </g>
  <g transform="translate(0 46)">
  <rect x={20} y={582} width={480} height={365} rx={14} fill="var(--panel, #f4f7fa)"/>
  <He x={260} y={613} size={18} bold>ב · מבנה שלישוני — צורת ⁦L⁩</He>
  <He x={260} y={641} size={14} color="var(--muted, #64748b)">קיפול מרחבי, לא שלב נוסף בתרגום</He>
  {helix(231,719,53,true,orange)}
  {helix(231,772,102,true,teal)}
  {helix(244,709,64,false,gold)}
  {helix(308,709,103,false,blue)}
  {tube('M219 719 C185 695 197 663 226 670 C253 676 246 701 256 720',orange,6)}
  {tube('M244 697 C250 671 282 657 302 676 C314 692 292 707 274 721',gold,6)}
  {tube('M243 764 C278 751 278 785 248 793',purple,6)}
  {tube('M231 874 C209 888 211 909 230 914 C251 916 254 891 231 874',teal,6)}
  {tube('M411 709 Q435 713 440 687',blue,5)}
  <circle cx={445} cy={674} r={14} fill="url(#trna-aa)" stroke="#4f7857" strokeWidth={1.4}/>
  <La x={445} y={679} size={11} bold color="#25364a">aa</La>
  <La x={439} y={741} size={13} bold color="var(--ink, #25364a)">CCA · 3′</La>
  <He x={130} y={888} size={15} color="var(--ink, #25364a)">אנטיקודון</He>
  <He x={115} y={705} size={14} color="var(--ink, #25364a)">זרוע ⁦D⁩</He>
  <La x={320} y={672} size={14} color="var(--ink, #25364a)">TψC</La>
  <He x={260} y={975} size={14}>קווים דקים בין הגדילים = זיווג בסיסים</He>
  <He x={260} y={1000} size={14}>הצבעים מזהים את אותן הזרועות בשני המבנים</He>
  <He x={260} y={1028} size={12} color="var(--muted, #64748b)">איור מקורי וסכמטי · אינו בקנה מידה או מודל אטומי</He>
  </g>
 </Svg>;
}
