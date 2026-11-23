"use client";

import { memo, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type Props = { lang?: string; processName?: string; theme?: string };
type Point = [number, number];
const DURATION = 120;
const NORMAL = '#347f83', MUTANT = '#c36a55';
const clamp = (n:number) => Math.max(0,Math.min(1,n));
const smooth = (n:number) => { const v=clamp(n); return v*v*(3-2*v); };
const ramp = (t:number,a:number,b:number) => smooth((t-a)/(b-a));
const mix = (a:number,b:number,u:number) => a+(b-a)*u;
const lerp = (a:Point,b:Point,u:number):Point => [mix(a[0],b[0],u),mix(a[1],b[1],u)];
function isolate(s:string){return s.replace(/[\u2066\u2069]/g,'').replace(/[A-Za-z0-9][A-Za-z0-9,%.+−–/()-]*(?: [A-Za-z0-9][A-Za-z0-9,%.+−–/()-]*)*/g,r=>'\u2066'+r+'\u2069');}
const CHAPTERS = [
 {start:0,still:8,name:'הגנום שבתא האם',text:'בכל תא מאות עד אלפי עותקי mtDNA; בכל מיטוכונדריון כמה עותקים. באדם הגנום מעגלי: 16,569 זוגות בסיסים, 37 גנים — 13 לחלבוני זרחון חמצוני, 22 ל־tRNA ו־2 ל־rRNA. למיטוכונדריון גם ריבוזומים משלו.'},
 {start:16,still:24,name:'צוואר בקבוק',text:'ביצירת תאי הנבט רק מדגם קטן של הגנומים תורם לדור הבא. בציור עוברים מעט מיטוכונדריונים; זהו ייצוג של צוואר בקבוק גנטי, שמנגנונו מורכב יותר ממעבר פיזי דרך פתח. לאחר מכן מספר העותקים גדל מחדש.'},
 {start:34,still:43,name:'ביציות שונות',text:'אותה אם, שלוש ביציות: דגימה והתרבות יוצרות שיעורים מוטנטיים שונים. הטרופלזמיה היא תערובת של mtDNA תקין ומוטנטי; הומופלזמיה היא אוכלוסייה מסוג אחד. האחוזים המוצגים הם דוגמה, ולא תחזית לילדים במשפחה.'},
 {start:50,still:61,name:'הפריה אימהית',text:'הביצית תורמת כמעט את כל הציטופלזמה ומאגר גדול מאוד של מיטוכונדריונים, בסדר גודל של יותר מ־100,000 בביצית בשלה. מיטוכונדריוני הזרע שבחלקו האמצעי אינם ממשיכים לשושלת העובר: הם מסולקים או מפורקים. לכן mtDNA עובר כמעט תמיד מהאם. שלוש הביציות מייצגות הריונות נפרדים; הפריה מודגמת רק בביצית האמצעית.'},
 {start:68,still:78,name:'רקמות וסף',text:'בחלוקות התאים חלוקה אקראית של עותקים ושכפולם משנים את ההטרופלזמיה בין רקמות, דורות וגם לאורך החיים. מעל סף תלוי־מוטציה ותלוי־רקמה עלולה להיפגע הפקת האנרגיה. מוח, שריר ורשתית רגישים במיוחד; אין אחוז סף אחיד לכל המחלות.'},
 {start:86,still:94,name:'אותה משפחה',text:'כל הילדים מקבלים את מאגר mtDNA שלהם מהאם; רק הבנות מעבירות אותו הלאה. בדוגמה כל שלושת הילדים ירשו גם מוטציה, בחומרה שונה. אם הטרופלזמית אינה חייבת להעביר מוטציה או מחלה לכל ילד. אב עם מוטציה אינו מוריש את mtDNA שלו — גם לא לבנותיו; זאת בניגוד להורשה הקשורה ל־X.'},
 {start:102,still:113,name:'הרחבה: יבוא חלבונים',text:'מיטוכונדריון משכפל ומבטא את הגנום שלו ומתחלק בביקוע — עדות למוצא אנדוסימביוטי. הוא חצי־אוטונומי: רוב חלבוניו, יותר מ־1,000, מקודדים בגרעין ומתורגמים בציטוזול. מוצג מסלול אחד לחלבון המיועד למטריקס: דרך TOM בממברנה החיצונית ו־TIM23 בפנימית, בסיוע אנרגיה ושפרונים; לא כל החלבונים עוברים במסלול זה.'},
];
const chapterAt=(t:number)=>Math.max(0,CHAPTERS.findLastIndex(c=>t>=c.start));

function Label({x,y,children,size=15,strong=false,muted=false}:{x:number;y:number;children:ReactNode;size?:number;strong?:boolean;muted?:boolean}){
 return <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={strong?650:450} fill={muted?'var(--muted)':'var(--ink)'} direction="rtl" style={{unicodeBidi:'plaintext'}}>{typeof children==='string'?isolate(children):children}</text>;
}
const Mito = memo(function Mito({uid,scale=1,rings=4,mutants=2,paternal=false}:{uid:string;scale?:number;rings?:number;mutants?:number;paternal?:boolean}){
 return <g transform={`scale(${scale})`} data-bound="organelle">
  <path d="M -30 -12 C -20 -24 9 -22 28 -13 C 43 -5 37 13 22 18 C 3 24 -24 21 -35 10 C -43 2 -39 -4 -30 -12 Z" fill={`url(#${uid}-${paternal?'sperm':'mito'})`} stroke={paternal?'#786e9b':'#937043'} strokeWidth="1.4"/>
  <path d="M -28 -9 Q -20 -17 -14 -12 L -12 2 Q -9 8 -6 0 L -5 -13 Q 0 -17 5 -11 L 8 2 Q 10 9 13 2 L 15 -8 Q 22 -10 27 -4 Q 34 5 24 11 L 19 5 Q 15 0 13 10 L 11 15 Q 5 18 0 14 L -3 8 Q -6 3 -9 12 L -11 15 Q -26 14 -30 6 Q -35 0 -28 -9 Z" fill="var(--matrix)" stroke={paternal?'#8a80a8':'#a98a5a'} strokeWidth="1.1"/>
  <path d="M -30 -11 Q -11 -26 21 -15" fill="none" stroke="#fff5dc" strokeWidth="1.5" opacity=".8"/>
  {Array.from({length:rings},(_,j)=><g key={j} transform={`translate(${-22+j*44/Math.max(1,rings-1)} ${j%2?7:-3})`}><ellipse rx="4" ry="3" fill="none" stroke={paternal?'#786e9b':j<mutants?MUTANT:NORMAL} strokeWidth="1.6"/>{j<mutants&&!paternal&&<path d="M -1 -4 L 2 -1" stroke={MUTANT} strokeWidth="1.8"/>}</g>)}
 </g>;
});

const CSS = `
.mito-scene{--paper:#faf9f3;--ink:#263d48;--muted:#61757c;--border:#ccd8d4;--wash:#eef2eb;--cell:#e1ece4;--matrix:#f7efdc;--route:#7a9997;background:var(--paper);color:var(--ink);border:1px solid var(--border);border-radius:22px;overflow:hidden;font:15px/1.65 system-ui,-apple-system,Segoe UI,sans-serif;color-scheme:light;isolation:isolate}
.mito-scene[data-theme=dark]{--paper:#17252c;--ink:#e5eee9;--muted:#afc1c0;--border:#3e555b;--wash:#20363c;--cell:#334b49;--matrix:#d7ccad;--route:#9ab5b0;color-scheme:dark}
@media(prefers-color-scheme:dark){.mito-scene:not([data-theme=light]){--paper:#17252c;--ink:#e5eee9;--muted:#afc1c0;--border:#3e555b;--wash:#20363c;--cell:#334b49;--matrix:#d7ccad;--route:#9ab5b0;color-scheme:dark}}
.mito-scene *{box-sizing:border-box}.mito-scene header{padding:22px 25px 10px}.mito-scene h2{margin:4px 0;font-size:27px;line-height:1.25;font-weight:700;letter-spacing:-.6px}.mito-kicker{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px;letter-spacing:.3px}
.mito-scene nav{display:flex;flex-wrap:wrap;gap:6px;padding:10px 24px 16px}.mito-scene button{font:inherit;cursor:pointer;color:var(--ink);background:var(--wash);border:1px solid var(--border);border-radius:9px;padding:6px 11px;line-height:1.5}.mito-scene button:focus-visible,.mito-scene input:focus-visible{outline:3px solid #a88d52;outline-offset:3px}.mito-scene nav button{font-size:12px}.mito-scene nav button[aria-current=true]{background:#376f71;color:#fff;border-color:#376f71}.mito-scene svg{display:block;width:100%;height:auto;overflow:hidden}.mito-scene svg text{font-family:inherit}.mito-scene .leader{fill:none;stroke:var(--route);stroke-width:1.3;stroke-linecap:round}.mito-caption{padding:10px 25px 0;margin:0;min-height:102px;font-size:14px;line-height:1.75}.mito-caption strong{display:block;font-size:17px;margin-bottom:4px}.mito-phase{margin:8px 25px 12px;min-height:25px;font-size:13px;color:var(--muted)}.mito-controls{display:flex;align-items:center;gap:12px;padding:12px 25px;border-top:1px solid var(--border);direction:rtl}.mito-controls>input{min-width:40px;flex:1;accent-color:#4b8888;direction:ltr}.mito-controls output{direction:ltr;font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.mito-controls label{white-space:nowrap;font-size:12px}.mito-controls button{font-size:13px;min-width:86px}.mito-controls button:disabled{opacity:.6;cursor:default}.mito-legend{display:flex;flex-wrap:wrap;gap:8px 20px;padding:8px 25px;font-size:12px}.mito-legend span{display:flex;align-items:center;gap:7px}.mito-legend i{width:11px;height:11px;border:2px solid currentColor;border-radius:50%;display:inline-block}.mito-note{color:var(--muted);font-size:11px;padding:6px 25px 20px}.mito-diseases{padding:4px 25px;font-size:12px;color:var(--muted)}
@media(max-width:600px){.mito-scene{border-radius:15px}.mito-scene header{padding:18px 16px 8px}.mito-scene h2{font-size:25px}.mito-kicker{font-size:11px}.mito-scene nav{padding:8px 14px 12px;gap:5px}.mito-scene nav button{font-size:11px;padding:5px 8px}.mito-caption{padding:8px 16px 0;min-height:165px;font-size:13px}.mito-phase{margin:8px 16px;font-size:12px;min-height:40px}.mito-controls{padding:12px 14px;gap:8px;flex-wrap:wrap}.mito-controls>input{flex-basis:150px}.mito-controls output{font-size:11px}.mito-legend,.mito-diseases,.mito-note{padding-left:16px;padding-right:16px}}
`;

const Artwork = memo(function Artwork({mobile,uid}:{mobile:boolean;uid:string}){
 const dw=mobile?440:900, detailY=mobile?285:310,pedX=mobile?40:616,pedY=mobile?710:25;
 return <>
  <defs>
   <radialGradient id={`${uid}-cell`} cx=".32" cy=".24" r=".85"><stop stopColor="#f0f4e5"/><stop offset=".6" stopColor="#ccded1"/><stop offset="1" stopColor="#85a99c"/></radialGradient>
   <radialGradient id={`${uid}-nucleus`} cx=".3" cy=".3"><stop stopColor="#e1deea"/><stop offset="1" stopColor="#8c91ae"/></radialGradient>
   <linearGradient id={`${uid}-mito`} x2=".2" y2="1"><stop stopColor="#f6e4b9"/><stop offset=".45" stopColor="#ddc18b"/><stop offset="1" stopColor="#a78757"/></linearGradient>
   <linearGradient id={`${uid}-sperm`} x2=".2" y2="1"><stop stopColor="#e3e0f0"/><stop offset="1" stopColor="#9284b0"/></linearGradient>
   <linearGradient id={`${uid}-large`} x2=".15" y2="1"><stop stopColor="#f5e5c1"/><stop offset=".5" stopColor="#d3b47d"/><stop offset="1" stopColor="#aa8852"/></linearGradient>
   <radialGradient id={`${uid}-glow`}><stop stopColor={MUTANT} stopOpacity=".3"/><stop offset="1" stopColor={MUTANT} stopOpacity="0"/></radialGradient>
  </defs>
  <g transform={mobile?'translate(0 0) scale(.77)':'translate(0 0)'} data-overview="">
   <Label x={110} y={25} strong size={mobile?20:15}>תא האם</Label><Label x={355} y={25} strong size={mobile?20:15}>ביציות מאותה אם</Label>
   <ellipse cx="108" cy="151" rx="88" ry="95" fill={`url(#${uid}-cell)`} stroke="#799e90" strokeWidth="2"/>
   <path d="M 32 144 C 28 100 55 70 89 64" fill="none" stroke="#fffdf0" strokeWidth="3" opacity=".75"/>
   <ellipse cx="103" cy="147" rx="26" ry="30" fill={`url(#${uid}-nucleus)`} stroke="#858ba5" strokeWidth="1.5"/>
   <ellipse cx="96" cy="140" rx="9" ry="11" fill="#7d7b9b" opacity=".6"/>
   {Array.from({length:18},(_,i)=>{const a=i*Math.PI*2/18,r=56+10*Math.sin(i*2.1),x=108+r*Math.cos(a),y=151+(r+6)*Math.sin(a);return <g key={i} data-mother={i} transform={`translate(${x} ${y}) rotate(${i*71})`}><Mito uid={uid} scale={.3}/></g>})}
   <Label x={108} y={270} size={mobile?21:17}>{'50% מוטנטי'}</Label>
   <g data-bottleneck="" opacity="0"><path d="M 203 85 C 237 85 227 137 245 137 L 269 137 C 286 137 278 62 312 62 M 203 214 C 237 214 227 163 245 163 L 269 163 C 286 163 278 236 312 236" className="leader" strokeDasharray="4 5"/><path d="M 270 150 H 310" className="leader"/><Label x={251} y={285} size={mobile?20:16}>צוואר בקבוק</Label></g>
   {[.1,.5,.9].map((f,k)=><g key={k} data-egg={k} opacity="0">
    <ellipse cx="355" cy={70+k*80} rx="38" ry="35" fill={`url(#${uid}-cell)`} stroke="#799e90" strokeWidth="1.7"/>
    {Array.from({length:10},(_,j)=>{const a=j*Math.PI*2/10,x=355+25*Math.cos(a),y=70+k*80+22*Math.sin(a),mutants=Math.max(0,Math.min(3,Math.round(f*30)-j*3));return <g key={j} transform={`translate(${x} ${y}) rotate(${j*36})`}><Mito uid={uid} scale={.14} rings={3} mutants={mutants}/></g>})}
    <circle cx="355" cy={70+k*80} r="9" fill={`url(#${uid}-nucleus)`}/><Label x={414} y={76+k*80} size={mobile?21:17} strong>{`${Math.round(f*100)}%`}</Label>
   </g>)}
   {Array.from({length:9},(_,i)=><g key={i} data-sample={i} opacity="0"><Mito uid={uid} scale={.28} rings={10} mutants={[1,5,9][Math.floor(i/3)]}/></g>)}
   <g data-sperm="" opacity="0" data-bound="sperm"><path data-tail="" d="M 29 0 C 44 -18 60 18 80 0" fill="none" stroke="#8b80a8" strokeWidth="2.5"/><ellipse rx="12" ry="8" fill={`url(#${uid}-sperm)`} stroke="#786c99"/><path d="M 12 0 H 30" stroke="#a295bd" strokeWidth="9" strokeLinecap="round"/><g transform="translate(19 0)"><Mito uid={uid} scale={.12} paternal/></g><g transform="translate(27 0)"><Mito uid={uid} scale={.12} paternal/></g></g>
   {[0,1].map(i=><g key={i} data-paternal={i} opacity="0"><Mito uid={uid} scale={.19} paternal/><circle data-degrade={i} r="13" fill="none" stroke="#8a80a8" strokeDasharray="2 4"/></g>)}
   <g data-paternal-label="" opacity="0"><Label x={487} y={300} size={mobile?21:16}>של הזרע מפורקים</Label><path data-paternal-leader="" d="M 487 278 L 487 230 L 465 205" className="leader"/></g>
   {[0,1,2].map(k=><g key={k} data-offspring={k} opacity="0"><ellipse rx="28" ry="30" fill={`url(#${uid}-cell)`} stroke="#799e90" strokeWidth="1.6"/>{Array.from({length:10},(_,j)=><g key={j} transform={`translate(${19*Math.cos(j*Math.PI/5)} ${20*Math.sin(j*Math.PI/5)}) rotate(${j*36})`}><Mito uid={uid} scale={.14} rings={3} mutants={Math.max(0,Math.min(3,[3,15,27][k]-j*3))}/></g>)}<circle r="7" fill={`url(#${uid}-nucleus)`}/><ellipse data-symptom={k} rx="43" ry="46" fill={`url(#${uid}-glow)`} opacity="0"/></g>)}
   <g data-offspring-label="" opacity="0"><Label x={503} y={25} strong size={mobile?20:15}>{mobile?'צאצאים':'תאי צאצאים'}</Label></g>
   <circle data-anchor="" r="9" fill="none" stroke={NORMAL} strokeWidth="2"/><path data-zoom-leader="" className="leader" strokeDasharray="3 4"/>
  </g>
  <g transform={`translate(0 ${detailY})`}>
   <rect x="16" y="0" width={dw-32} height={mobile?395:300} rx="18" fill="var(--wash)" stroke="var(--border)"/>
   <Label x={mobile?220:250} y={29} strong size={mobile?17:18}>תקריב מעוגן · אותו מאגר גנטי</Label>
   <g transform={mobile?'translate(220 138) scale(.83)':'translate(265 142)'} data-detail-mito="">
    <path d="M -187 -58 C -144 -100 92 -102 167 -63 C 230 -30 222 47 163 72 C 80 110 -129 105 -187 60 C -233 25 -225 -20 -187 -58 Z" fill={`url(#${uid}-large)`} stroke="#957346" strokeWidth="2"/>
    <path d="M -181 -49 C -157 -74 -138 -77 -125 -66 L -121 -21 Q -115 -6 -107 -22 L -100 -74 Q -82 -84 -64 -72 L -58 -52 Q -52 -47 -44 -48 L -18 -48 Q -10 -47 -6 -55 L -2 -73 L 4 -30 Q 12 -9 19 -30 L 26 -74 Q 47 -81 63 -67 L 70 -27 Q 77 -11 84 -29 L 90 -66 Q 115 -73 140 -51 L 143 -22 Q 146 -5 158 -15 L 179 -31 Q 205 -5 186 24 L 164 11 Q 150 2 146 20 L 145 54 Q 130 66 109 67 L 104 36 Q 99 20 90 37 L 84 74 Q 65 81 47 73 L 42 40 Q 36 22 28 41 L 23 78 Q 3 84 -17 74 L -23 40 Q -30 23 -36 42 L -41 76 Q -60 82 -82 70 L -88 40 Q -95 23 -102 40 L -108 69 C -148 67 -184 48 -193 22 Q -208 -15 -181 -49 Z" fill="var(--matrix)" stroke="#a18350" strokeWidth="2"/>
    <path d="M -184 -57 C -133 -100 107 -94 165 -61" fill="none" stroke="#fff6df" strokeWidth="3" opacity=".75"/>
    {Array.from({length:20},(_,i)=>{const x=-156+(i%10)*34,y=i<10?-4:18;return <g key={i} data-genome={i} transform={`translate(${x} ${y})`}><ellipse rx="10" ry="6" fill="none" stroke={NORMAL} strokeWidth="2.7"/><path data-mutation={i} d="M -3 -8 L 1 -3 L 5 -7" fill="none" stroke={MUTANT} strokeWidth="2.7" opacity="0"/></g>})}
    {[[-151,37],[-126,-25],[-18,47],[56,50],[117,-12]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="3.5" fill="#877768"/><circle cx={x+4} cy={y+2} r="2.6" fill="#a99b84"/></g>)}
    <circle data-close-anchor="" cx="-156" cy="-4" r="15" fill="none" stroke="var(--ink)" strokeDasharray="2 3" strokeWidth="1"/>
    <g data-import="" opacity="0">
     <path d="M -42 -88 V -69 M -24 -89 V -70" stroke="#577c91" strokeWidth="13" strokeLinecap="round"/><path d="M -42 -88 V -69 M -24 -89 V -70" stroke="#bad2df" strokeWidth="5" strokeLinecap="round"/>
     <path d="M -42 -59 V -37 M -24 -59 V -37" stroke="#567f6e" strokeWidth="13" strokeLinecap="round"/><path d="M -42 -59 V -37 M -24 -59 V -37" stroke="#bed8c6" strokeWidth="5" strokeLinecap="round"/>
     <path data-chain="" d="M -33 -128 Q -46 -119 -33 -108 Q -20 -98 -33 -89" fill="none" stroke="#87699d" strokeWidth="4" strokeLinecap="round"/>
     <path data-fold="" d="M -33 37 Q -58 19 -59 43 Q -59 63 -38 54 Q -17 69 -10 50 Q -4 32 -23 30 Q -7 13 -28 12 Q -44 10 -33 37 Z" fill="#c1a8cd" stroke="#79608b" strokeWidth="2" opacity="0"/>
    </g>
   </g>
   <g data-ring-label=""><Label x={mobile?125:147} y={mobile?252:268} size={15}>עותקי mtDNA מעגליים</Label><path d={mobile?'M125 233 L125 208 L90 140':'M147 249 L147 218 L109 138'} className="leader"/></g>
   <g data-import-label="" opacity="0"><Label x={mobile?300:440} y={mobile?252:267} size={15}>יבוא דרך TOM ו־TIM23</Label><path d={mobile?'M300 233 L415 233 L415 49 L200 49 L200 73':'M440 248 L485 248 L485 46 L241 46 L241 64'} className="leader"/></g>
   <g transform={mobile?'translate(50 284)':'translate(560 92)'} data-gauge="">
    <Label x={mobile?170:135} y={mobile?3:-22} strong size={18}><tspan data-percent="">50%</tspan><tspan> מוטנטי</tspan></Label>
    <rect y={mobile?17:7} width={mobile?340:270} height="15" rx="7" fill={NORMAL}/><rect data-gauge-fill="" y={mobile?17:7} width={mobile?170:135} height="15" rx="7" fill={MUTANT}/>
    <path data-threshold="" d={mobile?'M238 12 V39':'M189 2 V30'} stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0"/>
    {!mobile&&<><Label x={135} y={61} size={16} strong><tspan data-detail-state="">הטרופלזמיה</tspan></Label><g data-gauge-notes=""><Label x={135} y={92} size={14} muted>צבע אדמדם + חריץ = מוטציה</Label><Label x={135} y={123} size={14} muted>הסף בסרט: 70% להמחשה בלבד</Label><Label x={135} y={154} size={14} muted>הסף בפועל תלוי במוטציה וברקמה</Label></g></>}
   </g>
   <g data-tissues="" opacity="0" transform={mobile?'translate(50 344)':'translate(555 188)'}>
    <Label x={mobile?170:140} y={0} size={mobile?15.5:14}>רקמות שונות באותו צאצא · דוגמה</Label>
    {['מוח · 90%','שריר · 60%','רשתית · 30%'].map((s,k)=><g key={s} transform={`translate(${(mobile?53:43)+k*(mobile?116:96)} 24)`}>
     {k===0?<path d="M -15 -1 Q -20 -16 -9 -16 Q -4 -25 3 -18 Q 16 -20 17 -9 Q 23 3 13 6 H -10 Q -20 6 -15 -1 M -4 -15 Q 2 -8 -4 0 M 8 -11 Q 0 -7 9 1" fill="#c6b7ce" stroke="#806b8c" strokeWidth="1.2"/>:k===1?<g>{[-7,0,7].map(y=><path key={y} d={`M -17 ${y} Q 0 ${y-4} 17 ${y}`} fill="none" stroke="#b77b68" strokeWidth="4"/>)}</g>:<g><path d="M -20 -3 Q 0 -23 20 -3 Q 0 15 -20 -3 Z" fill="#dce7e8" stroke="#729198"/><circle cy="-3" r="6" fill={NORMAL}/><circle cy="-3" r="2.7" fill="#293f49"/></g>}
     <Label x={0} y={25} size={mobile?15.5:13.5}>{s}</Label>
    </g>)}
   </g>
   {mobile&&<g data-mobile-state=""><Label x={220} y={373} size={15.5} muted><tspan data-mobile-state-text="">הטרופלזמיה · תערובת של עותקים</tspan></Label></g>}
  </g>
  <g transform={`translate(${pedX} ${pedY})`} data-pedigree="">
   <Label x={mobile?180:128} y={0} strong size={17}>אילן יוחסין · אותה משפחה</Label>
   <g transform={mobile?'translate(25 22)':'translate(0 22)'}>
    <path d="M75 22 H169 M122 22 V67 M32 67 H224 M32 67 V92 M122 67 V92 M224 67 V92" fill="none" stroke="var(--route)" strokeWidth="1.7" data-pedigree-line="0" pathLength="1"/>
    <rect x="52" y="10" width="24" height="24" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1.5"/><circle cx="181" cy="22" r="13" fill="color-mix(in srgb, #c36a55 50%, var(--paper))" stroke="var(--ink)" strokeWidth="1.5"/>
    <Label x={64} y={-1} size={mobile?15.5:13.5}>אב</Label><Label x={181} y={-1} size={mobile?15.5:13.5}>אם</Label>
    {[32,122,224].map((x,i)=><g key={i} data-pedigree-child={i} opacity="0">{i===0?<circle cx={x} cy="105" r="13" fill={`color-mix(in srgb, ${MUTANT} ${[10,50,90][i]}%, var(--paper))`} stroke="var(--ink)" strokeWidth="1.5"/>:<rect x={x-13} y="92" width="26" height="26" fill={`color-mix(in srgb, ${MUTANT} ${[10,50,90][i]}%, var(--paper))`} stroke="var(--ink)" strokeWidth="1.5"/>}<Label x={x} y={140} size={mobile?15.5:14}>{['בת · 10%','בן · 50%','בן · 90%'][i]}</Label></g>)}
    <g data-next-generation="" opacity="0">
     <path d="M32 119 V159 M14 159 H50 M14 159 V182 M50 159 V182 M224 119 V159 M206 159 H242 M206 159 V182 M242 159 V182" fill="none" stroke="var(--route)" strokeWidth="1.5"/>
     {[14,50,206,242].map((x,i)=><circle key={x} cx={x} cy="192" r="10" fill={i<2?'color-mix(in srgb, #c36a55 20%, var(--paper))':'var(--paper)'} stroke="var(--ink)" strokeWidth="1.4"/>) }
     <Label x={32} y={223} size={mobile?15.5:13.5}>מאגר הבת</Label><Label x={224} y={223} size={mobile?15.5:13.5}>מאגר אם אחרת</Label>
    </g>
   </g>
   <Label x={mobile?180:128} y={mobile?286:285} size={mobile?15.5:13.5} muted>עיגול: בת · ריבוע: בן · גוון: עומס מוטנטי</Label>
  </g>
 </>;
});

export default function MitoScene({lang='he',processName,theme}:Props){
 const uid='mito-'+useId().replace(/[^a-zA-Z0-9_-]/g,''),root=useRef<HTMLElement>(null),svg=useRef<SVGSVGElement>(null);
 const clock=useRef(0),playing=useRef(true),looping=useRef(true),seeker=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduce,setReduce]=useState(false),[mobile,setMobile]=useState(false);
 const chapter=chapterAt(time);
 useEffect(()=>{const mq=matchMedia('(max-width:600px)');const update=()=>setMobile(mq.matches);update();mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update)},[]);
 useEffect(()=>{
   if(!root.current||!svg.current)return;const host=root.current,art=svg.current;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,visible=true,docVisible=!document.hidden,uiTime=-1;
  const get=(s:string)=>art.querySelector<SVGElement>(s);
  const attrs=(s:string,values:Record<string,string|number>)=>{const e=get(s);if(e)for(const[k,v]of Object.entries(values))e.setAttribute(k,String(v));};
  const alpha=(s:string,a:number)=>attrs(s,{opacity:clamp(a)});
  const move=(s:string,p:Point,a=1,scale=1)=>attrs(s,{transform:`translate(${p[0]} ${p[1]}) scale(${scale})`,opacity:clamp(a)});
  const setText=(s:string,text:string)=>{const e=get(s);if(e)e.textContent=isolate(text)};
  function draw(t:number){
   clock.current=t;const c=chapterAt(t),b=ramp(t,16,21),eg=ramp(t,29,43),fert=ramp(t,51,61),offs=ramp(t,68,81),imp=ramp(t,102,107);
   alpha('[data-bottleneck]',b);
   for(let i=0;i<18;i++){const a=i*Math.PI*2/18,r=56+10*Math.sin(i*2.1);attrs(`[data-mother="${i}"]`,{transform:`translate(${108+r*Math.cos(a)+1.5*Math.sin(t*.6+i)} ${151+(r+6)*Math.sin(a)+1.2*Math.cos(t*.5+i)}) rotate(${i*71})`});}
   for(let k=0;k<3;k++)alpha(`[data-egg="${k}"]`,ramp(t,28+k*2,34+k*2));
   for(let i=0;i<9;i++){const k=Math.floor(i/3),j=i%3,u=ramp(t,18+j*2+k*.5,29+j*2+k*.5);let p=lerp([176,115+j*34],[251,144+j*6],ramp(u,0,.5));if(u>.5)p=lerp([251,144+j*6],[340+j*12,70+k*80],ramp(u,.5,1));move(`[data-sample="${i}"]`,p,ramp(t,17+i*.35,19+i*.35)*(1-ramp(t,32+k*2,35+k*2)),1);}
   // The same selected maternal organelle is followed through egg and offspring.
   let anchor:Point=lerp([164,151],[380,150],ramp(t,18,34));
   anchor=lerp(anchor,[380,70],ramp(t,34,39));anchor=lerp(anchor,[380,230],ramp(t,40,46));anchor=lerp(anchor,[380,150],ramp(t,50,54));
   anchor=lerp(anchor,[522,150],offs);anchor=lerp(anchor,[522,235],ramp(t,72,80));anchor=lerp(anchor,[522,150],ramp(t,100,105));
   move('[data-anchor]',anchor);
   attrs('[data-zoom-leader]',{d:`M${anchor[0]} ${anchor[1]-10} L${anchor[0]} 40 L15 40 L15 305 L110 305 L110 ${mobile?285/.77:310}`});
   alpha('[data-zoom-leader]',1-ramp(t,69,70)+ramp(t,81,82));
   const sp=lerp([480,235],[376,170],fert);move('[data-sperm]',sp,ramp(t,50,53)*(1-ramp(t,60,63)));attrs('[data-sperm]',{transform:`translate(${sp[0]} ${sp[1]}) rotate(30)`});
   attrs('[data-tail]',{d:`M29 0 C44 ${-15*Math.sin(t*4)} 60 ${15*Math.sin(t*4)} 80 0`});
   for(let i=0;i<2;i++){const u=ramp(t,60,66),p=lerp([393+i*7,180+i*4],[465+i*14,235+i*8],u);move(`[data-paternal="${i}"]`,p,ramp(t,59,61)*(1-ramp(t,65,68)),mix(1,.15,u));attrs(`[data-degrade="${i}"]`,{r:mix(12,25,u)});if(i===0)attrs('[data-paternal-leader]',{d:`M487 278 L487 260 L${p[0]} ${p[1]}`});}
   alpha('[data-paternal-label]',ramp(t,60,63)*(1-ramp(t,67,69)));
   for(let k=0;k<3;k++){move(`[data-offspring="${k}"]`,lerp([355,70+k*80],[503,65+k*85],offs),offs);alpha(`[data-symptom="${k}"]`,k===2?ramp(t,79,84):0);alpha(`[data-pedigree-child="${k}"]`,ramp(t,70+k*3,75+k*3));}
   alpha('[data-offspring-label]',offs);
   attrs('[data-pedigree-line="0"]',{strokeDasharray:'1',strokeDashoffset:1-ramp(t,52,76)});alpha('[data-next-generation]',ramp(t,87,98));
   // Percentage = the summed mutant fraction of the twenty displayed genomes.
   const fraction=t<34?.5:t<50?mix(.5,.1,ramp(t,34,39))+mix(0,.8,ramp(t,40,46)):t<68?mix(.9,.5,ramp(t,50,54)):t<86?mix(.5,.9,ramp(t,72,80)):mix(.9,.5,ramp(t,100,105));
   let total=0;for(let i=0;i<20;i++){const f=clamp(fraction*20-i);total+=f;const ring=get(`[data-genome="${i}"] ellipse`);if(ring)ring.setAttribute('stroke',`rgb(${Math.round(mix(52,195,f))} ${Math.round(mix(127,106,f))} ${Math.round(mix(131,85,f))})`);alpha(`[data-mutation="${i}"]`,f);}
   const pct=Math.round(total/20*100);setText('[data-percent]',`${pct}%`);attrs('[data-gauge-fill]',{width:(mobile?340:270)*total/20});alpha('[data-threshold]',ramp(t,69,74)*(1-imp));
   setText('[data-detail-state]',pct===0||pct===100?'הומופלזמיה':c===4&&pct>=70?'מעל הסף בדוגמה: פגיעה אפשרית':'הטרופלזמיה');
   const tissue=ramp(t,75,79)*(1-ramp(t,85,88)),notes=1-ramp(t,73,75)+ramp(t,88,90);alpha('[data-tissues]',tissue);alpha('[data-gauge-notes]',notes);alpha('[data-mobile-state]',notes);
   alpha('[data-import]',imp);alpha('[data-import-label]',imp);alpha('[data-ring-label]',1-imp);alpha('[data-close-anchor]',1-imp);
   // A precursor threads successively through both aligned pores; no membrane crossing elsewhere.
   const progress=ramp(t,106,116);const end=mix(-101,28,progress),start=Math.max(-103,end-60);
   attrs('[data-chain]',{d:`M -33 ${start} Q -42 ${mix(start,end,.25)} -33 ${mix(start,end,.5)} Q -24 ${mix(start,end,.75)} -33 ${end}`,opacity:1-ramp(t,115,118)});alpha('[data-fold]',ramp(t,115,119));
   const phases=['תקין ומוטנטי חיים יחד באותו תא','מעט עותקים נדגמים; השיעור עשוי להשתנות','שלוש ביציות: 10%, 50%, 90% — דוגמה בלבד','המאגר האימהי נשמר; מאגר הזרע מסולק','70% הוא סף להמחשה בלבד, ולא כלל רפואי','מאגר אימהי לכל ילד; תסמינים בעוצמות שונות','חלבון מהציטוזול נכנס דרך שתי ממברנות'];
   setText('[data-phase]',phases[c]);host.dataset.time=t.toFixed(3);host.dataset.chapter=String(c);host.dataset.mutant=String(pct);host.dataset.lang=lang;
   // Used by deterministic geometry verification, in the overview's coordinate system.
   host.dataset.anchor=anchor.join(',');host.dataset.eggProgress=eg.toFixed(3);
  }
  function sync(t:number){draw(Math.max(0,Math.min(DURATION,t)));setTime(clock.current);uiTime=clock.current;last=0;}
  seeker.current=sync;
  function tick(now:number){raf=0;if(!playing.current||media.matches||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min((now-last)/1000,.06);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(t-uiTime)>.1||!playing.current){setTime(t);uiTime=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick);}
  function resume(){last=0;if(!raf&&playing.current&&!media.matches&&visible&&docVisible)raf=requestAnimationFrame(tick);}
  function visibility(){docVisible=!document.hidden;if(!docVisible){cancelAnimationFrame(raf);raf=0;}resume();}
  function preference(){setReduce(media.matches);if(media.matches){cancelAnimationFrame(raf);raf=0;sync(CHAPTERS[chapterAt(clock.current)].still);}else resume();}
  const observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;}resume();},{threshold:.03});observer.observe(host);
  document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);host.addEventListener('mito-play',resume);preference();sync(clock.current);resume();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);host.removeEventListener('mito-play',resume);};
 },[mobile,uid,lang]);
 const toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)seeker.current(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('mito-play'));};
 return <section ref={root} className="mito-scene" data-theme={theme} dir="rtl" aria-label={processName||'תורשה מיטוכונדריאלית'}>
  <style>{CSS}</style><header><div className="mito-kicker"><span>מהאם, דרך הביצית, לדור הבא</span><span>{reduce?'תצוגה רגועה':'סרט רציף · 120 שניות'}</span></div><h2>{processName||'המורשת שבתוך התא'}</h2></header>
  <nav aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>seeker.current(reduce?c.still:c.start)}>{isolate(`${i+1} · ${c.name}`)}</button>)}</nav>
  <svg ref={svg} viewBox={`0 0 ${mobile?440:900} ${mobile?1035:625}`} role="img" aria-labelledby={`${uid}-title ${uid}-desc`}><title id={`${uid}-title`}>תורשה מיטוכונדריאלית בתנועה רציפה</title><desc id={`${uid}-desc`}>תא אם הטרופלזמי, דגימה בצוואר בקבוק, שלוש ביציות עם עומס מוטנטי שונה, סילוק מיטוכונדריוני הזרע ותאי צאצאים. תקריב מעוגן מראה עותקי גנום ומד עומס; אילן יוחסין מציג את אותה משפחה. בסוף הרחבה על יבוא חלבונים.</desc><Artwork mobile={mobile} uid={uid}/></svg>
  <p className="mito-caption" aria-live="polite" aria-atomic="true"><strong>{CHAPTERS[chapter].name}</strong>{isolate(CHAPTERS[chapter].text)}</p><p className="mito-phase" data-phase=""/>
  <div className="mito-controls"><button onClick={toggle} disabled={reduce} aria-label={running&&!reduce?'השהיה':'ניגון'}>{running&&!reduce?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>seeker.current(Number(e.target.value))}/><output>{Math.floor(time).toString().padStart(3,'0')} / {DURATION}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/> לולאה</label></div>
  <div className="mito-legend" aria-label="מקרא"><span><i style={{color:NORMAL}}/>{isolate('mtDNA תקין')}</span><span><i style={{color:MUTANT}}/>{isolate('mtDNA מוטנטי + חריץ')}</span><span><i style={{color:'#8b80a8'}}/>מיטוכונדריוני הזרע</span></div>
  <p className="mito-diseases">{isolate('דוגמאות למחלות: MELAS · MERRF · LHON (פגיעה בעצב הראייה). ב־LHON תיתכן גם הומופלזמיה עם חדירות חלקית; אחוז מוטנטי לבדו אינו קובע מחלה.')}</p>
  <div className="mito-note">איור מקורי וסכמטי, ללא קנה מידה. מספר האברונים, העותקים והקצב הוקטנו להמחשה. מד האחוזים מתאר את עותקי הגנום שבתקריב; האילן צבוע לפי עומס מוטנטי, ולא לפי אבחנה. השלוחות בדור השלישי מקצרות את בני הזוג; לכל צאצא יש אם משלו.</div>
 </section>;
}


