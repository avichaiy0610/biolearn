/* Textbook-level redraw by Codex (2026-11-02); the previous version is archived in archive/figures/2026-11-02/. */
import {Svg, He, La} from "./helpers";

// Original molecular drawing. Ideal peptide geometry: phi −57°, psi −47°;
// reference conventions are recorded in notes-HBondPatterns.md.
const INK='var(--ink, #26384a)', MUTED='var(--muted, #64748b)';
const PAPER='var(--paper, #f8fafc)', PANEL='var(--panel, #ffffff)';
const ORANGE='#db8a35';
type Atom={id:string;el:string;r:number;p:number[]};
const helix: {atoms:Atom[];bonds:string[][]} = {"atoms":[{"id":"1N","el":"N","r":1,"p":[186.32,132.74,-1.524]},{"id":"1CA","el":"C","r":1,"p":[202.31,144.88,-1.259]},{"id":"1C","el":"C","r":1,"p":[197.5,159.59,-0.209]},{"id":"1O","el":"O","r":1,"p":[201.41,176.22,-0.362]},{"id":"2N","el":"N","r":2,"p":[188.84,153.42,0.882]},{"id":"2CA","el":"C","r":2,"p":[183.47,166.04,1.962]},{"id":"2C","el":"C","r":2,"p":[170.83,181.7,1.452]},{"id":"2O","el":"O","r":2,"p":[173.52,198.18,1.752]},{"id":"2H","el":"H","r":2,"p":[185.9,139.64,0.964]},{"id":"3N","el":"N","r":3,"p":[156.75,176.53,0.666]},{"id":"3CA","el":"C","r":3,"p":[143.65,190.12,0.112]},{"id":"3C","el":"C","r":3,"p":[153.84,205.07,-0.697]},{"id":"3O","el":"O","r":3,"p":[150.47,221.85,-0.557]},{"id":"3H","el":"H","r":3,"p":[155.08,162.82,0.447]},{"id":"4N","el":"N","r":4,"p":[166.56,198.95,-1.562]},{"id":"4CA","el":"C","r":4,"p":[177.29,211.79,-2.397]},{"id":"4C","el":"C","r":4,"p":[187.89,226.02,-1.549]},{"id":"4O","el":"O","r":4,"p":[187.72,242.84,-1.81]},{"id":"4H","el":"H","r":4,"p":[168.86,185.04,-1.644]},{"id":"5N","el":"N","r":5,"p":[197.32,219.2,-0.512]},{"id":"5CA","el":"C","r":5,"p":[208.03,231.31,0.378]},{"id":"5C","el":"C","r":5,"p":[195.67,246.48,0.987]},{"id":"5O","el":"O","r":5,"p":[200.52,263.0,1.016]},{"id":"5H","el":"H","r":5,"p":[197.06,205.28,-0.336]},{"id":"6N","el":"N","r":6,"p":[179.37,240.85,1.485]},{"id":"6CA","el":"C","r":6,"p":[166.25,253.94,2.096]},{"id":"6C","el":"C","r":6,"p":[160.95,269.54,1.125]},{"id":"6O","el":"O","r":6,"p":[160.97,286.1,1.461]},{"id":"6H","el":"H","r":6,"p":[175.98,227.13,1.439]},{"id":"7N","el":"N","r":7,"p":[156.31,264.2,-0.104]},{"id":"7CA","el":"C","r":7,"p":[150.96,277.71,-1.128]},{"id":"7C","el":"C","r":7,"p":[166.32,292.22,-1.346]},{"id":"7O","el":"O","r":7,"p":[162.89,309.08,-1.4]},{"id":"7H","el":"H","r":7,"p":[156.49,250.44,-0.335]},{"id":"8N","el":"N","r":8,"p":[183.62,285.62,-1.475]},{"id":"8CA","el":"C","r":8,"p":[199.57,298.0,-1.687]},{"id":"8C","el":"C","r":8,"p":[201.16,312.45,-0.57]},{"id":"8O","el":"O","r":8,"p":[203.68,329.16,-0.804]},{"id":"8H","el":"H","r":8,"p":[185.77,271.66,-1.424]},{"id":"9N","el":"N","r":9,"p":[199.66,305.95,0.67]},{"id":"9CA","el":"C","r":9,"p":[200.92,318.29,1.828]},{"id":"9C","el":"C","r":9,"p":[186.32,333.83,1.759]},{"id":"9O","el":"O","r":9,"p":[190.36,350.3,1.973]},{"id":"9H","el":"H","r":9,"p":[197.6,292.11,0.815]},{"id":"10N","el":"N","r":10,"p":[169.0,328.58,1.453]},{"id":"10CA","el":"C","r":10,"p":[153.73,342.06,1.355]},{"id":"10C","el":"C","r":10,"p":[158.17,357.31,0.336]},{"id":"10O","el":"O","r":10,"p":[155.76,374.0,0.584]},{"id":"10H","el":"H","r":10,"p":[166.33,314.89,1.286]},{"id":"11N","el":"N","r":11,"p":[164.78,351.54,-0.836]},{"id":"11CA","el":"C","r":11,"p":[169.58,364.69,-1.897]},{"id":"11C","el":"C","r":11,"p":[184.01,378.94,-1.421]},{"id":"11O","el":"O","r":11,"p":[182.19,395.81,-1.632]},{"id":"11H","el":"H","r":11,"p":[166.53,337.69,-0.996]},{"id":"12N","el":"N","r":12,"p":[198.68,372.1,-0.765]},{"id":"12CA","el":"C","r":12,"p":[213.48,384.21,-0.256]},{"id":"12C","el":"C","r":12,"p":[205.63,399.08,0.683]},{"id":"12O","el":"O","r":12,"p":[210.05,415.67,0.588]},{"id":"12H","el":"H","r":12,"p":[199.59,358.14,-0.615]},{"id":"13N","el":"N","r":13,"p":[193.73,393.1,1.612]},{"id":"13CA","el":"C","r":13,"p":[185.22,405.88,2.572]},{"id":"13C","el":"C","r":13,"p":[174.62,421.55,1.866]},{"id":"13O","el":"O","r":13,"p":[176.43,438.06,2.192]},{"id":"13H","el":"H","r":13,"p":[190.51,379.35,1.653]},{"id":"14N","el":"N","r":14,"p":[163.31,416.36,0.878]},{"id":"14CA","el":"C","r":14,"p":[152.37,429.96,0.122]},{"id":"14C","el":"C","r":14,"p":[164.95,444.76,-0.513]},{"id":"14O","el":"O","r":14,"p":[161.36,461.57,-0.439]},{"id":"14H","el":"H","r":14,"p":[162.26,402.65,0.645]}],"bonds":[["1N","1CA"],["1CA","1C"],["1C","1O"],["1C","2N"],["2N","2CA"],["2CA","2C"],["2C","2O"],["2N","2H"],["2C","3N"],["3N","3CA"],["3CA","3C"],["3C","3O"],["3N","3H"],["3C","4N"],["4N","4CA"],["4CA","4C"],["4C","4O"],["4N","4H"],["4C","5N"],["5N","5CA"],["5CA","5C"],["5C","5O"],["5N","5H"],["5C","6N"],["6N","6CA"],["6CA","6C"],["6C","6O"],["6N","6H"],["6C","7N"],["7N","7CA"],["7CA","7C"],["7C","7O"],["7N","7H"],["7C","8N"],["8N","8CA"],["8CA","8C"],["8C","8O"],["8N","8H"],["8C","9N"],["9N","9CA"],["9CA","9C"],["9C","9O"],["9N","9H"],["9C","10N"],["10N","10CA"],["10CA","10C"],["10C","10O"],["10N","10H"],["10C","11N"],["11N","11CA"],["11CA","11C"],["11C","11O"],["11N","11H"],["11C","12N"],["12N","12CA"],["12CA","12C"],["12C","12O"],["12N","12H"],["12C","13N"],["13N","13CA"],["13CA","13C"],["13C","13O"],["13N","13H"],["13C","14N"],["14N","14CA"],["14CA","14C"],["14C","14O"],["14N","14H"]]};
const palette:Record<string,string>={C:'#778b9a',N:'#3698c1',O:'#dc746e',H:'#eff0df'};
const radius:Record<string,number>={C:5,N:5.7,O:6,H:3.7};
function Ball({x,y,el,r}:{x:number;y:number;el:string;r?:number}){
 return <g><circle cx={x} cy={y} r={r??radius[el]} fill={`url(#hbp-${el})`} stroke={el==='H'?'#84949c':'#4a6677'} strokeWidth={.75}/><circle cx={x-1.5} cy={y-1.7} r={1.1} fill="white" opacity={.45}/></g>;
}
function Stick({x1,y1,x2,y2}:{x1:number;y1:number;x2:number;y2:number}){
 return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#577080" strokeWidth={4.5} strokeLinecap="round"/><line x1={x1} y1={y1-.5} x2={x2} y2={y2-.5} stroke="#b1c2ca" strokeWidth={2.2} strokeLinecap="round"/></g>;
}
function Carbonyl({x1,y1,x2,y2}:{x1:number;y1:number;x2:number;y2:number}){
 const length=Math.hypot(x2-x1,y2-y1),ox=-(y2-y1)/length*2.2,oy=(x2-x1)/length*2.2;
 return <g>{[-1,1].map(s=><line key={s} x1={x1+s*ox} y1={y1+s*oy} x2={x2+s*ox} y2={y2+s*oy} stroke="#8ca1ae" strokeWidth={1.8} strokeLinecap="round"/>)}</g>;
}
function AlphaHelix(){
 const byId=Object.fromEntries(helix.atoms.map(a=>[a.id,a]));
 return <g>
  {/* Hydrogen bonds join carbonyl O_i to H of N_(i+4), parallel to the helix axis. */}
  {Array.from({length:10},(_,i)=>{const a=byId[`${i+1}O`].p,b=byId[`${i+5}H`].p;return <line key={`hb${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={ORANGE} strokeWidth={i===3?3:1.9} strokeDasharray="4 4" opacity={i===3?1:.75}/>})}
  {helix.bonds.map(([a,b])=>{const p=byId[a].p,q=byId[b].p;return b.endsWith('O')?<Carbonyl key={a+b} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]}/>:<Stick key={a+b} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]}/>})}
  {[...helix.atoms].sort((a,b)=>a.p[2]-b.p[2]).map(a=><Ball key={a.id} x={a.p[0]} y={a.p[1]} el={a.el}/>)}
 </g>;
}
function BetaSheet(){
 const top=Array.from({length:4},(_,i)=>{const x=70+78*i,s=i%2===0?-1:1;return {x,s};});
 return <g>
  {/* Alternating facets show the pleat; the sticks remain the molecular backbone. */}
  {[745,895].map((y,row)=><g key={y}>
   {top.map(({x,s},i)=><path key={x} d={`M${x-7} ${y-13} L${x+24} ${y+(row===0?s:-s)*20-13} L${x+58} ${y-13} L${x+58} ${y+13} L${x+24} ${y+(row===0?s:-s)*20+13} L${x-7} ${y+13}Z`} fill={row===0?'url(#hbp-sheetA)':'url(#hbp-sheetB)'} opacity={i%2===0?.38:.21}/>)}
  </g>)}
  {top.map(({x,s})=>{
    // s=-1: upper N-H (774) donates to lower C=O (860), both at x.
    // s=+1: upper C=O (780) accepts from lower N-H (866), both at x+50.
    // Draw center-to-center behind the spheres so each end visibly reaches its atom.
    const bondX=s<0?x:x+50;
    const upperY=s<0?745-s*29:745+s*35;
    const lowerY=s<0?895+s*35:895-s*29;
    return <line key={x} x1={bondX} y1={upperY} x2={bondX} y2={lowerY} stroke={ORANGE} strokeWidth={2.5} strokeDasharray="5 5"/>;
  })}
  {top.map(({x,s},i)=><g key={x}>
    {/* Upper strand: N–CA–C, read left to right. */}
    <Stick x1={x} y1={745} x2={x+24} y2={745+s*20}/><Stick x1={x+24} y1={745+s*20} x2={x+50} y2={745}/>
    {i<3&&<Stick x1={x+50} y1={745} x2={x+78} y2={745}/>}
    <Stick x1={x} y1={745} x2={x} y2={745-s*29}/>
    <Carbonyl x1={x+50} y1={745} x2={x+50} y2={745+s*35}/>
    {/* Lower strand: C–CA–N from left to right, hence N→C right to left. */}
    <Stick x1={x} y1={895} x2={x+24} y2={895-s*20}/><Stick x1={x+24} y1={895-s*20} x2={x+50} y2={895}/>
    {i<3&&<Stick x1={x+50} y1={895} x2={x+78} y2={895}/>}
    <Carbonyl x1={x} y1={895} x2={x} y2={895+s*35}/>
    <Stick x1={x+50} y1={895} x2={x+50} y2={895-s*29}/>
    <Ball x={x} y={745} el="N"/><Ball x={x+24} y={745+s*20} el="C"/><Ball x={x+50} y={745} el="C"/>
    <Ball x={x} y={745-s*29} el="H"/><Ball x={x+50} y={745+s*35} el="O"/>
    <Ball x={x} y={895} el="C"/><Ball x={x+24} y={895-s*20} el="C"/><Ball x={x+50} y={895} el="N"/>
    <Ball x={x} y={895+s*35} el="O"/><Ball x={x+50} y={895-s*29} el="H"/>
  </g>)}
 </g>;
}
export function HBondPatterns(){
 return <Svg w={520} h={1150} label="דפוסי קשרי מימן: בסליל אלפא בין שייר i לשייר i+4 באותה שרשרת; במשטח בטא בין שני גדילים סמוכים">
 <defs>
  {Object.entries(palette).map(([el,c])=><radialGradient key={el} id={`hbp-${el}`} cx="30%" cy="25%" r="80%"><stop stopColor="#ffffff" stopOpacity={.95}/><stop offset=".35" stopColor={c}/><stop offset="1" stopColor={c}/></radialGradient>)}
  <linearGradient id="hbp-sheetA" x2="0" y2="1"><stop stopColor="#b9d9e8"/><stop offset="1" stopColor="#5894b5"/></linearGradient>
  <linearGradient id="hbp-sheetB" x2="0" y2="1"><stop stopColor="#c0decf"/><stop offset="1" stopColor="#6b9f89"/></linearGradient>
  <marker id="hbp-dir" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill={INK}/></marker>
 </defs>
 <rect width={520} height={1150} fill={PAPER}/>
 <rect x={12} y={12} width={496} height={562} rx={18} fill={PANEL}/>
 <He x={260} y={46} size={21} bold>סליל ⁦α⁩ — בתוך השרשרת:</He>
 <He x={260} y={76} size={19}>⁦CO⁩ של ⁦i⁩ ↔ ⁦NH⁩ של ⁦i+4⁩</He>
 <He x={180} y={111} size={17} color={MUTED}>שלד מלופף</He>
 <AlphaHelix/>
 <path d="M198 133H253 M114 445H154" fill="none" stroke={MUTED} strokeWidth={1.2}/><La x={270} y={140} size={18} bold>N</La><La x={100} y={452} size={18} bold>C</La>
 <He x={380} y={184} size={18} bold>אותה שרשרת</He>
 <He x={380} y={213} size={17} color={MUTED}>קשר בין קבוצות השלד</He>
 <La x={380} y={259} size={19} bold>C=O(i)</La>
 <La x={380} y={302} size={20} color={ORANGE}>O ··· H—N</La>
 <La x={380} y={345} size={19} bold>H—N(i+4)</La>
 <He x={380} y={391} size={17} color={MUTED}>כמעט לאורך ציר הסליל</He>
 <He x={260} y={507} size={17}>דוגמאות למספור השיירים באותה שרשרת</He>
 <La x={260} y={535} size={16}>1–5 · 2–6 · 3–7 · 4–8 · 5–9 · 6–10 · 7–11</La>
 <He x={260} y={559} size={15} color={MUTED}>מספור יחסי; כל זוג מופרד בארבעה שיירים</He>
 <rect x={12} y={588} width={496} height={440} rx={18} fill={PANEL}/>
 <He x={260} y={625} size={21} bold>משטח ⁦β⁩ — בין גדילים סמוכים</He>
 <He x={260} y={655} size={19} bold>(אנטי-מקבילי)</He>
 <He x={260} y={676} size={17} color={MUTED}>שלד מקופל בקפלים; כיווני השרשרת הפוכים</He>
 <path d="M105 694H360" fill="none" stroke={INK} strokeWidth={2} markerEnd="url(#hbp-dir)"/>
 <La x={70} y={700} size={18} bold>N</La><La x={402} y={700} size={18} bold>C</La>
 <BetaSheet/>
 <path d="M360 950H105" fill="none" stroke={INK} strokeWidth={2} markerEnd="url(#hbp-dir)"/>
 <La x={70} y={956} size={18} bold>C</La><La x={402} y={956} size={18} bold>N</La>
 <He x={260} y={999} size={17}>קשרי המימן מחברים בין קבוצות שלד בגדילים</He>
 <He x={260} y={1061} size={17} color={MUTED}>מקווקו כתום = קשר מימן בין קבוצות השלד (סכמטי)</He>
 {['C','N','O','H'].map((el,i)=><g key={el}><Ball x={95+i*106} y={1094} el={el} r={6}/><La x={118+i*106} y={1100} size={16}>{el}</La></g>)}
 <He x={260} y={1132} size={15} color={MUTED}>ייצוג מולקולרי סכמטי; שרשראות הצד הושמטו</He>
 </Svg>;
}
