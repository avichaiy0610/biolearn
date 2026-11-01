import type React from "react";
import { He, La, BLUE, ORANGE, INK, MUTED } from "./biochemFigures";
const TEAL = "#0f766e", PURPLE = "#7c3aed", LINE = "#cbd5e1";
const points = (n: number, f: (t: number) => [number, number]) => Array.from({length:n+1},(_,i)=>f(i/n));
const path = (p: [number,number][]) => p.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(3)} ${y.toFixed(3)}`).join(' ');
function Figure({h,label,children}:{h:number;label:string;children:React.ReactNode}) { return <svg viewBox={`0 0 480 ${h}`} className="w-full h-auto" role="img" aria-label={label}><title>{label}</title><rect width={480} height={h} fill="white"/>{children}</svg>; }
function Panel({y,h,title,children}:{y:number;h:number;title:string;children:React.ReactNode}) { return <g transform={`translate(0 ${y})`}><rect x={8} y={0} width={464} height={h} rx={14} fill="#f8fafc" stroke={LINE}/><He x={240} y={32} size={21} bold>{title}</He>{children}</g>; }
function Leader({d,color=MUTED,dash=false}:{d:string;color?:string;dash?:boolean}) { return <path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeDasharray={dash?'5 4':undefined}/>; }
const arc = (r:number) => path(points(80,t=>{const a=(-145+110*t)*Math.PI/180;return [190+r*Math.cos(a),335+r*Math.sin(a)];}));
export function BeamBending() { return <Figure h={850} label="כיפוף קורה: סיבים נמתחים ונדחסים, ציר נייטרלי, רדיוס, חתך ומומנט גאומטרי">
 <Panel y={8} h={395} title="כיפוף: אותו חומר, אורכי סיבים שונים">
  <path d={arc(150)} fill="none" stroke="#e2e8f0" strokeWidth={50}/>
  <path d={arc(175)} fill="none" stroke={ORANGE} strokeWidth={4}/><path d={arc(125)} fill="none" stroke={TEAL} strokeWidth={4}/><path d={arc(150)} fill="none" stroke={INK} strokeWidth={2} strokeDasharray="7 5"/>
  {[-140,-110,-80,-50].map(a=>{const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);return <line key={a} x1={190+125*c} y1={335+125*s} x2={190+175*c} y2={335+175*s} stroke={LINE} strokeWidth={1.5}/>;})}
  <He x={240} y={67} size={19} color={ORANGE}>חיצוני: מתיחה</He><Leader d="M240 78 L240 162" color={ORANGE}/>
  <He x={382} y={191} size={18}>ציר נייטרלי</He><Leader d="M336 202 L290 223" dash/>
  <He x={240} y={281} size={19} color={TEAL}>פנימי: דחיסה</He><Leader d="M240 260 L240 229" color={TEAL}/>
  <Leader d="M190 335 L115 205"/><circle cx={190} cy={335} r={3} fill={INK}/><La x={128} y={285} size={21}>R</La>
  <La x={240} y={373} size={22}>ε(z) = z/R</La>
 </Panel>
 <Panel y={419} h={222} title="חתך ניצב לקורה: סוכמים את כל הסיבים">
  <circle cx={124} cy={132} r={65} fill="#e0e7ff" stroke={BLUE} strokeWidth={2}/>
  <line x1={48} x2={201} y1={132} y2={132} stroke={INK} strokeWidth={1.5} strokeDasharray="5 4"/>
  <rect x={76} y={91} width={96} height={8} fill={ORANGE}/><Leader d="M124 129 V102"/><La x={141} y={119} size={19}>z</La>
  <Leader d="M177 95 H213" color={ORANGE}/><La x={236} y={102} size={20} color={ORANGE}>dA</La>
  <La x={334} y={148} size={24}>I = ∫ z² dA</La><He x={324} y={184} size={17}>רחוק מהציר: תרומה גדולה</He>
 </Panel>
 <Panel y={657} h={185} title="צורת החתך קובעת את קשיחות הכיפוף">
  <circle cx={67} cy={91} r={25} fill="#dbeafe" stroke={BLUE} strokeWidth={2}/><circle cx={300} cy={91} r={29} fill="#ccfbf1" stroke={TEAL} strokeWidth={2}/><circle cx={300} cy={91} r={17} fill="#f8fafc" stroke={TEAL} strokeWidth={2}/>
  <La x={168} y={97} size={19}>I = πr⁴/4</La><La x={386} y={97} size={15}>I = π(rₒ⁴ − rᵢ⁴)/4</La>
  <He x={67} y={141} size={18}>מלא</He><He x={300} y={141} size={18}>חלול</He><La x={240} y={171} size={19}>E_bend = EIL/(2R²)</La>
 </Panel>
 </Figure>; }
export const bendingPerLength = (lp=50,r=4.5) => lp/(2*r*r);
export const unwrapEnergy = (length:number,adhesion=1.5) => (adhesion-bendingPerLength())*length;
export const channelOpen = (tension:number,area=10) => 1/(1+Math.exp(5-tension*area));
function Wrap({front}:{front:boolean}) { return <>{Array.from({length:160},(_,i)=>{const a=i/160*4*Math.PI,b=(i+1)/160*4*Math.PI;if((Math.sin((a+b)/2)>=0)!==front)return null;const f=(t:number):[number,number]=>[240+99*Math.cos(t),130+20*Math.sin(t)+t*6];const [x,y]=f(a);return <g key={i}><path d={path([f(a),f(b)])} fill="none" stroke={BLUE} strokeWidth={3} strokeLinecap="round"/><path d={path([f(a),f(b)].map(([xx,yy])=>[xx,yy+6]))} fill="none" stroke={TEAL} strokeWidth={3} strokeLinecap="round"/>{i%4===0&&<line x1={x} x2={x} y1={y} y2={y+6} stroke={BLUE} strokeWidth={1.5}/>}</g>;})}</>; }
export function NucleosomeEnergy() { const cost=bendingPerLength();return <Figure h={1010} label="נוקלאוזום: DNA סביב ליבת היסטונים, מחיר כיפוף מול היצמדות ואנרגיית פתיחה מחושבת">
 <Panel y={8} h={337} title="נוקלאוזום: כיפוף מול היצמדות">
  <La x={240} y={69} size={20}>R ≈ 4.5 nm</La><Wrap front={false}/>
  <path d="M148 131 V211 C148 243 332 243 332 211 V131" fill="#ddd6fe" stroke={PURPLE} strokeWidth={2}/><ellipse cx={240} cy={131} rx={92} ry={23} fill="#ede9fe" stroke={PURPLE} strokeWidth={2}/>
  {[190,240,290].map(x=><Leader key={x} d={`M${x} 159 V211`} color="#a78bfa"/>)}
  <Wrap front/><Leader d="M240 131 H339" dash/><Leader d="M240 80 V100"/>
  <La x={63} y={165} size={20} color={BLUE}>DNA</La><Leader d="M89 171 L135 180" color={BLUE}/>
  <He x={240} y={273} size={19} color={PURPLE}>ליבת היסטונים</He>
  <He x={240} y={304} size={18}>מצויר: שני ליפופים במודל הספר</He>
  <He x={240} y={329} size={18}>במבנה האמיתי: כ־1.7 ליפופים</He>
 </Panel>
 <Panel y={361} h={245} title="מאזן לכל ננומטר של DNA">
  <La x={240} y={66} size={19}>ℓp = 50 nm · energy / length (kBT/nm)</La>
  <He x={118} y={102} size={18} color={ORANGE}>מחיר כיפוף</He><He x={118} y={150} size={18} color={TEAL}>רווח מהיצמדות</He>
  <rect x={220} y={81} width={cost*110} height={25} rx={4} fill={ORANGE}/><La x={395} y={101} size={19}>{cost.toFixed(2)}</La>
  <rect x={220} y={129} width={1.5*110} height={25} rx={4} fill={TEAL}/><La x={414} y={149} size={19}>1.50</La>
  <La x={240} y={193} size={20}>g_bend = ℓp kBT/(2R²)</La>
  <He x={240} y={226} size={18}>ההיצמדות בדוגמה חזקה מהכיפוף: הכריכה מועדפת</He>
 </Panel>
 <Panel y={622} h={380} title="פתיחת הקצה: מחיר נטו עולה עם האורך">
  <La x={257} y={65} size={20}>ΔG / kBT</La><path d="M74 88 V278 H437" fill="none" stroke={INK} strokeWidth={1.5}/>
  {[0,1,2,3,4,5].map(v=><g key={v}><line x1={68} x2={74} y1={278-v*34} y2={278-v*34} stroke={INK}/><La x={53} y={284-v*34} size={17}>{v}</La></g>)}
  {[0,5,10,15,20].map(v=><g key={v}><line x1={74+v*18} x2={74+v*18} y1={278} y2={284} stroke={INK}/><La x={74+v*18} y={308} size={17}>{v}</La></g>)}
  <path d={path(points(100,t=>[74+360*t,278-unwrapEnergy(20*t)*34]))} fill="none" stroke={PURPLE} strokeWidth={3}/>
  <circle cx={254} cy={278-unwrapEnergy(10)*34} r={5} fill={PURPLE}/><La x={330} y={226} size={18}>10 nm → 2.65 kBT</La>
  <La x={255} y={338} size={19}>ΔL (nm)</La><La x={240} y={368} size={18}>ΔG = (γ_ad − g_bend) ΔL</La>
 </Panel>
 </Figure>; }
function MembraneChannel({x,open}:{x:number;open:boolean}) {const w=open?55:34;return <g transform={`translate(${x} 0)`}>
 {[-1,1].map(side=><g key={side}>{Array.from({length:9},(_,i)=>{const xx=side*(w+13+i*6);if(Math.abs(xx)>98)return null;return <g key={i}><circle cx={xx} cy={114} r={3} fill={TEAL}/><circle cx={xx} cy={161} r={3} fill={TEAL}/><path d={`M${xx} 119 v16 m0 5 v16`} stroke={TEAL} strokeWidth={1.5}/></g>;})}</g>)}
 {[-1,1].map(s=><path key={s} d={`M${s*(open?18:2)} 105 L${s*(open?32:7)} 171 L${s*w} 171 L${s*(w-8)} 105 Z`} fill="#ddd6fe" stroke={PURPLE} strokeWidth={2}/>)}
 <Leader d={`M${-w} 199 H${w}`} color={PURPLE}/><La x={0} y={226} size={18}>{open?'A_open':'A_closed'}</La>
 </g>; }
export function ChannelTension() {const sx=(t:number)=>74+t*225,sy=(p:number)=>302-p*200;return <Figure h={851} label="תעלה רגישה למתח: שני מצבים ועקומות הסתברות מחושבות לתעלה המקורית ולמוטנט">
 <Panel y={8} h={289} title="מתח בממברנה מעדיף שטח פתוח גדול">
  <He x={125} y={72} size={20}>סגורה</He><He x={355} y={72} size={20}>פתוחה</He><MembraneChannel x={125} open={false}/><MembraneChannel x={355} open/>
  <La x={240} y={270} size={20}>ΔA = A_open − A_closed &gt; 0</La>
 </Panel>
 <Panel y={313} h={530} title="מודל שני מצבים: אותה עלות בסיסית">
  <La x={240} y={68} size={22}>p_open = 1/[1 + exp(ΔG/kBT)]</La>
  <La x={240} y={102} size={19}>ΔG = 5 kBT − τΔA</La>
  <g transform="translate(0 31)"><La x={45} y={89} size={16}>p_open</La><path d="M74 94 V302 H438" fill="none" stroke={INK} strokeWidth={1.5}/>
  {[0,.5,1].map(v=><g key={v}><line x1={68} x2={74} y1={sy(v)} y2={sy(v)} stroke={INK}/><La x={52} y={sy(v)+6} size={17}>{v}</La></g>)}
  {[0,.5,1,1.5].map(v=><g key={v}><line x1={sx(v)} x2={sx(v)} y1={302} y2={309} stroke={INK}/><La x={sx(v)} y={334} size={17}>{v}</La></g>)}
  {[10,5].map((area,i)=><g key={area}><path d={path(points(200,t=>[sx(t*1.6),sy(channelOpen(t*1.6,area))]))} fill="none" stroke={i?ORANGE:BLUE} strokeWidth={3} strokeDasharray={i?'8 5':undefined}/><circle cx={sx(5/area)} cy={sy(.5)} r={5} fill="white" stroke={i?ORANGE:BLUE} strokeWidth={2}/></g>)}
  <La x={258} y={369} size={20}>τ (kBT/nm²)</La></g>
  <La x={240} y={450} size={19} color={BLUE}>ΔA = 10 nm² · τ½ = 0.5 kBT/nm²</La>
  <La x={240} y={480} size={19} color={ORANGE}>ΔA = 5 nm² · τ½ = 1 kBT/nm²</La>
  <He x={240} y={513} size={18}>המוטנט: עקומה מקווקוות, מוסתת ופחות חדה</He>
 </Panel>
 </Figure>; }
