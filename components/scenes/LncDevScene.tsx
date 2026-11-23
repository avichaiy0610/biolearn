"use client";

import { memo, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type Props = { lang?: string; processName?: string; theme?: string };
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>{const x=clamp(v);return x*x*(3-2*x)};
const ramp=(t:number,a:number,b:number)=>ease((t-a)/(b-a));
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
export const DURATION=144;
export const CHAPTERS=[
 {start:0,still:8,name:'א · שעתוק וגיוס',text:'ליד SCL (TAL1) נמצא גן ל־lncRNA. התעתיק מגייס שותפים חלבוניים, ובהם Mediator ומשני כרומטין. ההיסטונים עוברים אצטילציה והנוקלאוזומים מתרווחים; כך הפרומוטור נעשה נגיש ל־RNA פולימראז II ולגורמי שעתוק.'},
 {start:20,still:39,name:'א · ביטוי והתמיינות',text:'ביטוי SCL עולה. גורם השעתוק מכוון תאי גזע של הדם להתמיין, בין היתר לכדוריות אדומות ולמגה־קריוציטים שמהם נוצרות טסיות. שתי הסתעפויות השושלת מוצגות יחד; התקריב נשאר מעוגן בגרעין תא המקור.'},
 {start:49,still:58,name:'א · השתקה',text:'השתקת ה־lncRNA הסמוך מורידה את ביטוי SCL. המד יורד בתא המקור; התאים שכבר התמיינו אינם חוזרים לתאי גזע. זוהי המחשה של תוצאת ניסוי ההשתקה, ולא היפוך של ההתמיינות.'},
 {start:64,still:84,name:'ב · הגן הסמוך',text:'בדוגמה השנייה, lncRNA הסמוך ל־Snai1 מגביר את ביטויו. התקריב מציג את אותו עיקרון של גיוס שותפים וכרומטין פתוח. בינתיים יריעת האפיתל מחוברת בצמתי E-cadherin ושומרת על קוטביות בין הצד הפונה לחלל לצד הבסיסי.'},
 {start:90,still:109,name:'ב · אובדן חיבורים',text:'Snai1 מקודד את גורם השעתוק Snail, המדכא את E-cadherin. ירידת חלבון החיבורים מלווה בפירוק הצמתים ובאובדן הקוטביות. רק לאחר מכן התא ניתק מהיריעה ומשנה צורה.'},
 {start:114,still:124,name:'ב · נדידה',text:'התא הופך לתא מזנכימלי נודד: מעבר מאפיתל למזנכימה (EMT), תהליך חיוני בהתפתחות העובר. עקבו אחרי התא המסומן: זהו אותו תא שהיה מחובר ליריעה, ואותו גרעין שאליו מחובר התקריב.'},
 {start:128,still:141,name:'ב · ההקשר הסרטני',text:'בגידולים התוכנית עלולה לפעול שלא כהלכה: אובדן E-cadherin מאפשר לתאי סרטן לחדור דרך הקרום הבסיסי, להיכנס לכלי הדם ולהתפשט ליצירת גרורות. ויסות שגוי של lncRNAs המפעילים גנים כמו Snai1 הוא אחד הגורמים שנחקרים. הכניסה לכלי הדם כאן שייכת להקשר הסרטני.'},
];
export const chapterAt=(t:number)=>Math.max(0,CHAPTERS.reduce((a,c,i)=>t>=c.start?i:a,0));
export function frame(t:number){
 const txA=ramp(t,2,9),recruitA=ramp(t,8,16),openA=ramp(t,12,21),silence=ramp(t,50,59);
 const txB=ramp(t,67,76),recruitB=ramp(t,74,83),openB=ramp(t,78,88),expressionB=ramp(t,86,96),loss=ramp(t,99,111),move=ramp(t,113,126),invasion=ramp(t,129,141);
 return {txA,recruitA,openA,silence,expressionA:(.12+.8*ramp(t,19,28))*(1-.83*silence),blood:ramp(t,29,45),txB,recruitB,openB,expressionB:.1+.84*expressionB,ecad:1-.88*ramp(t,96,106),loss,polarity:1-ramp(t,104,113),move,invasion,cellX:205+68*move+25*invasion,cellY:100+80*move+200*invasion,cellShape:ramp(t,109,121),tumor:ramp(t,128,131)};
}
function isolate(s:string){return s.replace(/[\u2066\u2069]/g,'').replace(/[A-Za-z0-9][A-Za-z0-9/().−+–-]*(?: [A-Za-z0-9(][A-Za-z0-9/().−+–-]*)*/g,v=>'\u2066'+v+'\u2069')}
function Label({x,y,children,size=15,muted=false,strong=false}:{x:number;y:number;children:ReactNode;size?:number;muted?:boolean;strong?:boolean}){
 return <text data-label="" x={x} y={y} textAnchor="middle" direction="rtl" fontSize={Math.max(15,size)} fontWeight={strong?650:450} fill={muted?'var(--muted)':'var(--ink)'} style={{unicodeBidi:'plaintext'}}>{typeof children==='string'?isolate(children):children}</text>;
}
const CSS=`
.ld{--paper:#faf9f3;--ink:#253c47;--muted:#63777d;--border:#d0dbd5;--wash:#eef2eb;--line:#8fa5a3;--nuc:#9e98b7;background:var(--paper);color:var(--ink);border:1px solid var(--border);border-radius:22px;overflow:hidden;font:15px/1.7 system-ui,-apple-system,Segoe UI,sans-serif;isolation:isolate;color-scheme:light}
.ld[data-theme=dark]{--paper:#17262e;--ink:#e7eee8;--muted:#b2c4c3;--border:#40575c;--wash:#22383e;--line:#9eb8b7;--nuc:#b9afca;color-scheme:dark}
@media(prefers-color-scheme:dark){.ld:not([data-theme=light]){--paper:#17262e;--ink:#e7eee8;--muted:#b2c4c3;--border:#40575c;--wash:#22383e;--line:#9eb8b7;--nuc:#b9afca;color-scheme:dark}}
.ld *{box-sizing:border-box}.ld header{padding:22px 24px 8px}.ld h2{font-size:28px;line-height:1.25;margin:5px 0;letter-spacing:-.5px}.ld .kicker{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px}.ld nav{display:flex;flex-wrap:wrap;gap:6px;padding:12px 24px}.ld button{font:inherit;background:var(--wash);border:1px solid var(--border);border-radius:9px;color:var(--ink);padding:6px 11px;cursor:pointer}.ld nav button{font-size:12px}.ld nav button[aria-current=true]{background:#376e71;color:white;border-color:#376e71}.ld button:focus-visible,.ld input:focus-visible{outline:3px solid #bf9856;outline-offset:3px}.ld .stage{margin:8px 18px 16px;border:1px solid var(--border);border-radius:16px;overflow:hidden}.ld .stage[data-active=true]{border-color:#648c87}.ld .stage h3{margin:0;padding:10px 16px;border-bottom:1px solid var(--border);font-size:16px;font-weight:650;display:flex;justify-content:space-between;gap:10px}.ld .stage h3 small{font-size:11px;font-weight:450;color:var(--muted)}.ld svg.movie{display:block;width:100%;height:auto;overflow:hidden}.ld svg text{font-family:inherit}.ld .leader{fill:none;stroke:var(--line);stroke-width:1.3;stroke-linecap:round}.ld .anchor{fill:none;stroke:#458b87;stroke-width:1.5;stroke-dasharray:4 4}.ld .caption{padding:2px 24px 0;min-height:118px;font-size:14px;margin:0}.ld .caption strong{display:block;font-size:17px;margin-bottom:4px}.ld .phase{margin:8px 24px 14px;font-size:12px;color:var(--muted)}.ld .controls{display:flex;align-items:center;gap:12px;padding:12px 24px;border-top:1px solid var(--border)}.ld .controls>input{flex:1;min-width:60px;direction:ltr;accent-color:#448582}.ld output{font-size:12px;direction:ltr;white-space:nowrap;font-variant-numeric:tabular-nums}.ld .controls label{font-size:12px;white-space:nowrap}.ld .controls button{min-width:85px;font-size:13px}.ld button:disabled{opacity:.6;cursor:default}.ld .legend{display:flex;gap:8px 18px;flex-wrap:wrap;padding:8px 24px;font-size:12px}.ld .legend span{display:flex;align-items:center;gap:6px}.ld .legend i{width:11px;height:11px;border-radius:50%;display:inline-block}.ld .note{padding:6px 24px 18px;font-size:11px;color:var(--muted)}
@media(max-width:600px){.ld{border-radius:15px}.ld header{padding:18px 14px 8px}.ld h2{font-size:25px}.ld .kicker{font-size:10px}.ld nav{padding:8px 12px;gap:5px}.ld nav button{font-size:11px;padding:5px 7px}.ld .stage{margin:8px 9px 12px}.ld .stage h3{padding:9px 11px;font-size:14px}.ld .stage h3 small{font-size:10px}.ld .caption{padding:4px 15px 0;min-height:195px;font-size:13px}.ld .phase{margin:8px 15px 12px}.ld .controls{padding:12px;gap:8px;flex-wrap:wrap}.ld .controls>input{flex-basis:145px}.ld .legend,.ld .note{padding-left:15px;padding-right:15px}}
`;
const Defs=memo(function Defs({uid}:{uid:string}){return <defs>
 <radialGradient id={`${uid}-cell`} cx=".3" cy=".22" r=".9"><stop stopColor="#f1f1dd"/><stop offset=".56" stopColor="#c9ded1"/><stop offset="1" stopColor="#80a797"/></radialGradient>
 <radialGradient id={`${uid}-nuc`} cx=".32" cy=".25"><stop stopColor="#ddd8e9"/><stop offset="1" stopColor="#8c85ac"/></radialGradient>
 <radialGradient id={`${uid}-rbc`} cx=".35" cy=".3"><stop stopColor="#e49b89"/><stop offset=".4" stopColor="#b44f50"/><stop offset=".66" stopColor="#efb1a0"/><stop offset="1" stopColor="#a64750"/></radialGradient>
 <linearGradient id={`${uid}-epi`} x2=".15" y2="1"><stop stopColor="#f7e7c6"/><stop offset=".5" stopColor="#d9bc8d"/><stop offset="1" stopColor="#ac865e"/></linearGradient>
 <linearGradient id={`${uid}-histone`} x2=".3" y2="1"><stop stopColor="#d5c5e2"/><stop offset=".5" stopColor="#aa90bd"/><stop offset="1" stopColor="#78608e"/></linearGradient>
 <linearGradient id={`${uid}-partner`} x2=".1" y2="1"><stop stopColor="#f1d69c"/><stop offset="1" stopColor="#b08b48"/></linearGradient>
 <linearGradient id={`${uid}-vessel`} x2="0" y2="1"><stop stopColor="#ae5e68"/><stop offset=".2" stopColor="#f5d4c9"/><stop offset=".72" stopColor="#eab3a9"/><stop offset="1" stopColor="#9a5b65"/></linearGradient>
 </defs>});
const Nucleus=memo(function Nucleus({uid,r=22}:{uid:string;r?:number}){return <g><ellipse rx={r} ry={r*.86} fill={`url(#${uid}-nuc)`} stroke="#82799c" strokeWidth="1.3"/><path d={`M ${-r*.65} -2 q 5 ${-r*.8} 14 0 t 13 0 M ${-r*.6} 8 q 7 -10 12 0 t 9 0`} fill="none" stroke="#7e739a" strokeWidth="1.3" opacity=".5"/><circle cx="-5" cy="-4" r={r*.22} fill="#7c7296" opacity=".7"/></g>});
const Locus=memo(function Locus({id,uid}:{id:'a'|'b';uid:string}){const gene=id==='a'?'SCL (TAL1)':'Snai1';return <g data-locus={id}>
 <rect x="10" y="15" width="380" height="290" rx="15" fill="var(--wash)" stroke="var(--border)"/>
 <Label x={200} y={42} strong>תקריב מעוגן · כרומטין</Label>
 <path data-id={`${id}-fibre`} fill="none" stroke="#7c8893" strokeWidth="5"/>
 <path data-id={`${id}-fibre-shine`} fill="none" stroke="#dae3dc" strokeWidth="1.7"/>
 {[0,1,2,3,4].map(i=><g key={i} data-id={`${id}-histone-${i}`} data-bound="nucleosome"><ellipse rx="16" ry="14" fill={`url(#${uid}-histone)`} stroke="#7c668e" strokeWidth="1.4"/><path d="M -15 -5 Q 0 6 15 -5 M -15 2 Q 0 13 15 2" fill="none" stroke="#e6e1eb" strokeWidth="2.2"/><path d="M -8 -11 Q -14 -23 -8 -28 M 7 12 Q 18 18 15 24" fill="none" stroke="#9a80af" strokeWidth="1.7"/><g data-id={`${id}-ac-${i}`} opacity="0"><circle cx="-8" cy="-28" r="3.5" fill="#448f82"/><circle cx="15" cy="24" r="3.5" fill="#448f82"/></g></g>)}
 <path d="M 45 183 H 104" stroke="#368c7b" strokeWidth="8" strokeLinecap="round"/><path d="M 247 183 H 353" stroke="#4b7ea2" strokeWidth="8" strokeLinecap="round"/>
 <Label x={75} y={215} size={14}>גן lncRNA</Label><Label x={302} y={215} strong size={15}>{gene}</Label>
 <g data-id={`${id}-lnc-pol`} transform="translate(90 181)" opacity="0" data-bound="lnc-polymerase"><path d="M -18 -4 Q -24 -20 -7 -22 Q 13 -29 23 -8 L 18 12 Q 2 24 -17 11 Z" fill="#a6c6d2" stroke="#4e7d92" strokeWidth="1.4"/><path d="M -10 0 Q 2 -13 15 0" fill="none" stroke="#edf7f5" strokeWidth="3"/></g>
 <g data-id={`${id}-transcript`} opacity="0" data-bound="transcript"><path data-id={`${id}-rna`} fill="none" stroke="#328c7a" strokeWidth="3.2" strokeLinecap="round"/><circle cx="59" cy="117" r="4" fill="#328c7a"/></g>
 <Label x={73} y={83} size={14}>lncRNA</Label><path d="M 73 89 V 106" className="leader" data-leader=""/>
 <g data-id={`${id}-partner`} data-bound="partner"><path d="M -24 0 Q -31 -15 -15 -21 L 2 -16 Q 20 -29 27 -10 L 21 8 Q 25 23 5 22 L -13 15 Q -26 18 -24 0 Z" fill={`url(#${uid}-partner)`} stroke="#9b7a41" strokeWidth="1.4"/><path d="M -15 -10 Q 0 -17 14 -8" fill="none" stroke="#fff1c7" strokeWidth="2"/></g>
 <Label x={190} y={79} size={14}>Mediator ושותפים</Label><path data-id={`${id}-partner-leader`} className="leader" data-leader=""/>
 <g data-id={`${id}-pol`} opacity="0" data-bound="polymerase"><path d="M -18 -4 Q -24 -20 -7 -22 Q 13 -29 23 -8 L 18 12 Q 2 24 -17 11 Z" fill="#a6c6d2" stroke="#4e7d92" strokeWidth="1.4"/><path d="M -10 0 Q 2 -13 15 0" fill="none" stroke="#edf7f5" strokeWidth="3"/></g>
 <Label x={318} y={83} size={14}>RNA פולימראז II</Label><path data-id={`${id}-pol-leader`} className="leader" data-leader=""/>
 <g data-id={`${id}-mrna`} opacity="0"><path d="M 312 145 q 12 -14 19 0 t 19 0 t 19 0" fill="none" stroke="#577da8" strokeWidth="2.7"/></g>
 <circle cx="39" cy="247" r="3.5" fill="#448f82"/><Label x={151} y={252} size={13}>אצטילציה · ריווח נוקלאוזומים</Label>
 <Label x={200} y={282} size={14} strong>{`ביטוי ${gene}`}</Label>
 <rect x="35" y="290" width="330" height="7" rx="3.5" fill="var(--border)"/><rect data-id={`${id}-meter`} x="35" y="290" width="40" height="7" rx="3.5" fill="#4b7ea2"/>
 </g>});
const Blood=memo(function Blood({uid}:{uid:string}){return <g>
 <path d="M 112 171 Q 163 143 220 104 M 112 178 Q 168 219 224 250" className="leader" strokeDasharray="4 5"/>
 <ellipse cx="89" cy="175" rx="48" ry="51" fill={`url(#${uid}-cell)`} stroke="#769c8e" strokeWidth="1.7" data-bound="stem-cell"/><path d="M 48 167 Q 48 135 77 131" fill="none" stroke="#ffffec" strokeWidth="2.6" opacity=".8"/>
 <g transform="translate(86 173)"><Nucleus uid={uid} r={26}/></g><circle cx="87" cy="173" r="8" fill="none" stroke="#3b8d85" strokeWidth="1.5" data-focus="a"/>
 <Label x={90} y={251} strong>תא גזע של הדם</Label>
 {[0,1].map(i=><g key={i} data-id={`a-daughter-${i}`} data-bound={i?'megakaryocyte':'red-cell'}>
 <ellipse data-id={`a-cell-${i}`} rx="12" ry="13" fill={`url(#${uid}-cell)`} stroke={i?'#8b769e':'#9e5c60'} strokeWidth="1.5"/>
 <g data-id={`a-nucleus-${i}`}><Nucleus uid={uid} r={15}/></g>
 <ellipse data-id={`a-dimple-${i}`} rx="13" ry="6" fill="#f2b8a5" opacity="0"/>
 {i===1&&<g data-id="a-lobed" opacity="0"><path d="M -18 -5 Q -26 -22 -10 -23 Q 4 -26 8 -12 Q 25 -19 24 0 Q 20 13 6 8 Q 0 22 -13 11 Q -26 10 -18 -5Z" fill={`url(#${uid}-nuc)`} stroke="#817294" strokeWidth="1.5"/>{Array.from({length:15},(_,j)=><circle key={j} cx={34*Math.cos(j*2.4)} cy={30*Math.sin(j*2.4)} r="2" fill="#9282aa" opacity=".65"/>)}</g>}
 </g>)}
 <g data-id="a-lineage-labels" opacity="0"><Label x={278} y={51} strong>כדורית אדומה</Label><Label x={274} y={326} strong>מגה־קריוציט</Label><path data-id="a-red-leader" className="leader" data-leader=""/><path data-id="a-mega-leader" className="leader" data-leader=""/></g>
 {Array.from({length:6},(_,i)=><g key={i} data-id={`a-platelet-${i}`} opacity="0" data-bound="platelet"><ellipse rx="5" ry="3.8" fill="#b39bc9" stroke="#847099" strokeWidth="1"/><circle r="1.2" fill="#78668e"/></g>)}
 <g data-id="a-platelet-label" opacity="0"><Label x={351} y={210} size={14}>טסיות</Label><path d="M 351 217 L 336 234" className="leader" data-leader=""/></g>
 <g data-id="a-silence" opacity="0"><rect x="24" y="16" width="183" height="30" rx="8" fill="var(--paper)" stroke="var(--border)"/><Label x={116} y={37} size={13}>השתקת התעתיק · הביטוי יורד</Label></g>
 </g>});
const Epithelium=memo(function Epithelium({uid}:{uid:string}){return <g>
 <Label x={200} y={23} strong>יריעת תאי אפיתל</Label>
 {[0,1,3,4].map(i=><g key={i} transform={`translate(${55+i*75} 100)`} data-bound="epithelial-cell"><path d="M -33 -45 Q 0 -52 33 -45 L 35 43 Q 0 50 -35 43Z" fill={`url(#${uid}-epi)`} stroke="#a08461" strokeWidth="1.4"/><path d="M -29 -41 Q 0 -46 29 -41" fill="none" stroke="#619b9b" strokeWidth="5"/><g transform="translate(0 9)"><Nucleus uid={uid} r={17}/></g><path d="M -25 -33 L -25 27" stroke="#f7eed8" strokeWidth="2" opacity=".75"/></g>)}
 {[0,1,2,3].map(i=><g key={i} data-id={`b-junction-${i}`} transform={`translate(${92.5+i*75} 91)`} data-bound="junction">{[0,1,2].map(j=><g key={j} transform={`translate(0 ${j*13-13})`}><path d="M -5 -3 L 0 0 L 5 -3 M -5 3 L 0 0 L 5 3" fill="none" stroke="#a96251" strokeWidth="2.6"/><circle r="2" fill="#d4946f"/></g>)}</g>)}
 <g data-id="b-polarity-label" opacity="1"><Label x={69} y={48} size={13}>צד הפונה לחלל</Label><Label x={323} y={173} size={13}>צד בסיסי</Label></g>
 <path data-id="b-basement" d="M 18 152 H 392" fill="none" stroke="#8f9e8b" strokeWidth="7"/><path data-id="b-basement-rim" d="M 18 150 H 392" fill="none" stroke="#cad3bc" strokeWidth="2"/>
 <Label x={83} y={199} size={14}>קרום בסיסי</Label><path d="M 83 183 V 157" className="leader" data-leader=""/>
 <Label x={84} y={239} size={14}>צמתי E-cadherin</Label><path d="M 24 229 H 15 V 90 H 85" className="leader" data-leader=""/>
 <Label x={85} y={273} size={13}>חלבון החיבורים</Label><rect x="24" y="282" width="122" height="7" rx="3.5" fill="var(--border)"/><rect data-id="b-ecad-meter" x="24" y="282" width="122" height="7" rx="3.5" fill="#b4785d"/>
 <g data-id="b-snail" opacity="0"><Label x={125} y={315} size={14} strong>Snail מדכא E-cadherin</Label></g>
 <g data-id="b-migration" opacity="0"><path d="M 306 215 Q 331 210 343 222 M 336 216 L 344 222 L 336 226" fill="none" stroke="#46858b" strokeWidth="1.6"/><Label x={324} y={249} size={14}>נדידה</Label></g>
 <g data-id="b-cancer" opacity=".45"><rect x="22" y="348" width="365" height="65" rx="31" fill={`url(#${uid}-vessel)`} stroke="#a76c70" strokeWidth="1.8" data-bound="vessel"/><path d="M 43 356 H 365 M 43 405 H 365" stroke="#f8dacf" strokeWidth="1.5" opacity=".6"/>{[60,130,200,350].map(x=><ellipse key={x} cx={x} cy="382" rx="12" ry="7" fill={`url(#${uid}-rbc)`} transform={`rotate(-12 ${x} 382)`}/>)}<Label x={103} y={341} size={13}>הרחבה: חדירה בגידול</Label><Label x={110} y={441} size={14}>כלי דם · מסלול להתפשטות</Label><path d="M 110 422 V 412" className="leader" data-leader=""/></g>
 <g data-id="b-moving-cell" data-bound="moving-cell"><path data-id="b-cell-shape" fill={`url(#${uid}-epi)`} stroke="#a08461" strokeWidth="1.6"/><path data-id="b-apical" d="M -29 -41 Q 0 -46 29 -41" fill="none" stroke="#619b9b" strokeWidth="5"/><g data-id="b-polarity"><path d="M 19 -25 V 25 M 15 -20 L 19 -26 L 23 -20" fill="none" stroke="#477a7e" strokeWidth="1.7"/></g><g transform="translate(0 9)"><Nucleus uid={uid} r={18}/></g><circle cx="0" cy="9" r="7" fill="none" stroke="#3b8d85" strokeWidth="1.5" data-focus="b"/><circle cx="-17" cy="-23" r="3.2" fill="#337f82" stroke="#e6fff4" strokeWidth="1.2"/></g>
 </g>});
const Stage=memo(function Stage({id,uid,mobile}:{id:'a'|'b';uid:string;mobile:boolean}){
 const cellY=mobile?340:16,cellX=mobile?0:420,height=mobile?(id==='a'?700:805):(id==='a'?370:480);
 return <svg className="movie" data-stage={id} viewBox={`0 0 ${mobile?400:840} ${height}`} role="img" aria-labelledby={`${uid}-${id}-title ${uid}-${id}-desc`}>
 <title id={`${uid}-${id}-title`}>{id==='a'?'א · יצירת דם':'ב · מעבר מאפיתל לתא נודד'}</title><desc id={`${uid}-${id}-desc`}>{isolate(id==='a'?'התעתיק הסמוך ל־SCL מגייס שותפים. כרומטין נפתח, ביטוי עולה ותאי שושלת הדם מתמיינים.':'התעתיק הסמוך ל־Snai1 מגביר ביטוי. Snail מדכא E-cadherin, הצמתים והקוטביות אובדים והתא המסומן נודד.')}</desc>
 <Defs uid={uid}/><Locus id={id} uid={uid}/>
 <path data-id={`${id}-anchor-link`} className="anchor" data-anchor=""/>
 <g transform={`translate(${cellX} ${cellY})`} data-cell-stage={id}>{id==='a'?<Blood uid={uid}/>:<Epithelium uid={uid}/>}</g>
 <Label x={200} y={327} size={12} muted>{id==='a'?'א · אותו אתר בתא המקור':'ב · אותו אתר בתא המסומן'}</Label>
 </svg>;
});
function paint(root:HTMLElement,t:number,mobile:boolean){
 const f=frame(t),nodes=root.querySelectorAll<SVGElement>('[data-id]'),lookup=new Map<string,SVGElement>();nodes.forEach(n=>lookup.set(n.dataset.id!,n));
 const set=(id:string,a:string,v:string|number)=>lookup.get(id)?.setAttribute(a,String(v));
 const opacity=(id:string,v:number)=>set(id,'opacity',v);
 const trans=(id:string,x:number,y:number,extra='')=>set(id,'transform',`translate(${x} ${y}) ${extra}`);
 for(const id of ['a','b'] as const){const a=id==='a',tx=a?f.txA:f.txB,rec=a?f.recruitA:f.recruitB,open=a?f.openA:f.openB;
  const points=Array.from({length:5},(_,i)=>[mix(147+i*26,45+i*74,open),mix(168+(i%2)*12,165,open)]);
  const d='M 28 175 '+points.map(([x,y])=>`Q ${x-22} ${y-8} ${x} ${y}`).join(' ')+` Q 365 172 376 177`;
  set(`${id}-fibre`,'d',d);set(`${id}-fibre-shine`,'d',d);
  points.forEach(([x,y],i)=>{trans(`${id}-histone-${i}`,x,y);opacity(`${id}-ac-${i}`,open)});
  opacity(`${id}-transcript`,tx*(a?1-.9*f.silence:1));const rna=Array.from({length:27},(_,i)=>{const u=i/26;return `${i?'L':'M'} ${59+u*94*tx} ${117+Math.sin(u*Math.PI*5+t*.8)*7*tx}`}).join(' ');set(`${id}-rna`,'d',rna);
  trans(`${id}-partner`,mix(196,174,rec),mix(110,125,rec));set(`${id}-partner-leader`,'d',`M 196 87 V 93 L ${mix(196,174,rec)} ${mix(110,125,rec)-24}`);
  trans(`${id}-pol`,283,151);opacity(`${id}-pol`,open);set(`${id}-pol-leader`,'d','M 318 90 V 108 L 290 127');opacity(`${id}-lnc-pol`,tx*(1-rec));
  opacity(`${id}-mrna`,a?f.expressionA-.1:f.expressionB-.1);set(`${id}-meter`,'width',330*(a?f.expressionA:f.expressionB));
 }
 for(const i of [0,1]){const u=f.blood,x=mix(107,i?266:278,u),y=mix(175,i?248:106,u),r=i?mix(9,45,u):mix(9,32,u);trans(`a-daughter-${i}`,x,y);opacity(`a-daughter-${i}`,ramp(t,28,33));set(`a-nucleus-${i}`,'transform',`scale(${mix(.3,1,u)})`);set(`a-cell-${i}`,'rx',r);set(`a-cell-${i}`,'ry',r*(i?1:.66+.34*(1-u)));set(`a-cell-${i}`,'fill',i?`url(#${root.dataset.uid}-cell)`:`url(#${root.dataset.uid}-rbc)`);opacity(`a-nucleus-${i}`,1-ramp(t,36,44));opacity(`a-dimple-${i}`,i?0:ramp(t,36,45));}opacity('a-lobed',ramp(t,35,43));
 opacity('a-lineage-labels',ramp(t,34,42));const arx=mix(107,278,f.blood),ary=mix(175,106,f.blood)-(mix(9,32,f.blood)*(.66+.34*(1-f.blood)));set('a-red-leader','d',`M 278 58 L ${arx} ${ary}`);set('a-mega-leader','d',`M 274 307 L ${mix(107,266,f.blood)} ${mix(175,248,f.blood)+mix(9,45,f.blood)}`);opacity('a-platelet-label',ramp(t,44,49));
 for(let i=0;i<6;i++){const u=ramp(t,41+i*.7,48+i*.7);trans(`a-platelet-${i}`,mix(299,336+(i%2)*28,u),mix(248,238+Math.floor(i/2)*18,u),`rotate(${i*29})`);opacity(`a-platelet-${i}`,u)}opacity('a-silence',f.silence);
 const x=f.cellX,y=f.cellY,s=f.cellShape;
 trans('b-moving-cell',x,y,`rotate(${12*s-18*f.invasion})`);
 const corners=[[-33,-45],[-12,-50],[33,-45],[35,-10],[35,43],[0,49],[-35,43],[-35,-10]],spindle=[[-55,9],[-13,-24],[26,-13],[56,-18],[31,16],[0,25],[-28,18],[-47,15]];
 const pts=corners.map((p,i)=>[mix(p[0],spindle[i][0],s),mix(p[1],spindle[i][1],s)]);set('b-cell-shape','d',`M ${pts[0].join(' ')} `+pts.slice(1).map(p=>`L ${p.join(' ')}`).join(' ')+' Z');
 opacity('b-apical',f.polarity);opacity('b-polarity',f.polarity);opacity('b-polarity-label',f.polarity);
 for(let i=0;i<4;i++)opacity(`b-junction-${i}`,i===1||i===2?1-f.loss:1);
 set('b-ecad-meter','width',122*f.ecad);opacity('b-snail',ramp(t,94,100));opacity('b-migration',f.move*(1-f.invasion));opacity('b-cancer',.45+.55*f.tumor);
 const gap=ramp(t,113,119);const bm=`M 18 152 H ${mix(392,165,gap)} M ${mix(392,330,gap)} 152 H 392`;set('b-basement','d',bm);set('b-basement-rim','d',bm);
 const cx=mobile?0:420,cy=mobile?340:16;
 set('a-anchor-link','d',mobile?'M 10 280 Q 3 315 5 355 V 460 L 87 513':'M 390 255 Q 417 255 445 213 L 507 189');
 const nx=cx+x-9*Math.sin((12*s-18*f.invasion)*Math.PI/180),ny=cy+y+9*Math.cos((12*s-18*f.invasion)*Math.PI/180);
 set('b-anchor-link','d',mobile?`M 390 265 Q 398 330 396 355 V ${ny} H ${nx}`:`M 390 56 Q 410 8 440 8 H 830 V ${ny} H ${nx}`);
 root.dataset.time=t.toFixed(3);root.dataset.chapter=String(chapterAt(t));
}
export default function LncDevScene({lang='he',processName,theme}:Props){
 const root=useRef<HTMLElement>(null),uid='ld'+useId().replace(/[^a-zA-Z0-9]/g,''),[mobile,setMobile]=useState(false),[time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduced,setReduced]=useState(false);
 const clock=useRef(0),playing=useRef(true),looping=useRef(true),visible=useRef(true),reduce=useRef(false),lastUI=useRef(0);
 const chapter=chapterAt(time);
 useEffect(()=>{const el=root.current;if(!el)return;const media=matchMedia('(prefers-reduced-motion: reduce)'),sync=()=>{reduce.current=media.matches;setReduced(media.matches);if(media.matches){playing.current=false;setRunning(false);clock.current=CHAPTERS[chapterAt(clock.current)].still;setTime(clock.current)}};sync();media.addEventListener('change',sync);const resize=new ResizeObserver(e=>setMobile(e[0].contentRect.width<600));resize.observe(el);const observer=new IntersectionObserver(e=>{visible.current=e[0].isIntersecting},{threshold:.01});observer.observe(el);return()=>{media.removeEventListener('change',sync);resize.disconnect();observer.disconnect()}},[]);
 useEffect(()=>{const el=root.current;if(!el)return;let raf=0,previous=0;const tick=(now:number)=>{const dt=previous?Math.min((now-previous)/1000,.1):0;previous=now;if(playing.current&&!reduce.current&&visible.current&&!document.hidden){clock.current+=dt;if(clock.current>=DURATION){if(looping.current)clock.current%=DURATION;else{clock.current=DURATION;playing.current=false;setRunning(false)}}paint(el,clock.current,mobile);if(now-lastUI.current>80){setTime(clock.current);lastUI.current=now}}raf=requestAnimationFrame(tick)};paint(el,clock.current,mobile);raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[mobile]);
 const seek=(t:number)=>{clock.current=t;setTime(t);if(root.current)paint(root.current,t,mobile)};
 const toggle=()=>{if(clock.current>=DURATION)seek(0);playing.current=!playing.current;setRunning(playing.current)};
 return <section ref={root} className="ld" data-theme={theme} data-uid={uid} data-lang={lang} dir="rtl" aria-label="סרט רציף: RNA ארוך לא־מקודד בהתפתחות">
 <style>{CSS}</style><header><div className="kicker"><span>מהאתר בכרומטין לזהות התא</span><span>{reduced?'תמונות מפתח · תנועה מופחתת':'סרט רציף · שתי דוגמאות'}</span></div><h2>{isolate(processName||'lncRNA בהתפתחות')}</h2></header>
 <nav aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>seek(reduced?c.still:c.start)}>{c.name}</button>)}</nav>
 <div className="stage" data-active={chapter<3}><h3><span>{isolate('א · יצירת דם — SCL (TAL1)')}</span><small>אתר ← ביטוי ← שושלת</small></h3><Stage id="a" uid={uid} mobile={mobile}/></div>
 <div className="stage" data-active={chapter>=3}><h3><span>{isolate('ב · מאפיתל לנדידה — Snai1')}</span><small>אתר ← ביטוי ← צורת תא</small></h3><Stage id="b" uid={uid+'b'} mobile={mobile}/></div>
 <p className="caption" aria-live="polite" aria-atomic="true"><strong>{CHAPTERS[chapter].name}</strong>{isolate(CHAPTERS[chapter].text)}</p><p className="phase">הטבעת הירוקה מסמנת את אתר העיגון. התקריב נשאר מחובר לאותו גרעין לאורך הדוגמה.</p>
 <div className="controls"><button disabled={reduced} aria-label={running&&!reduced?'השהיה':'ניגון'} onClick={toggle}>{running&&!reduced?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>seek(Number(e.target.value))}/><output>{isolate(`${Math.floor(time).toString().padStart(3,'0')} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{looping.current=e.target.checked;setLoop(e.target.checked)}}/>לולאה</label></div>
 <div className="legend">{[['#328c7a','lncRNA'],['#a58dbb','נוקלאוזומים'],['#448f82','אצטילציה'],['#c6a35f','שותפים חלבוניים'],['#4b7ea2','גן המטרה ותעתיקיו'],['#b4785d','צמתי E-cadherin']].map(([color,name])=><span key={name}><i style={{background:color}}/>{isolate(name)}</span>)}</div>
 <div className="note">{isolate('איור מקורי וסכמטי; מדדי הביטוי יחסיים, ללא יחידות או קינטיקה מדודה. גיוס שותפים וכרומטין פתוח הם המחשת המנגנון הכללי מהסצנה המקורית, ולא מיפוי מולקולרי מלא של כל אתר. מקור הדוגמאות: Ørom ועמיתיו, Cell 2010. ההקשר הסרטני מסומן בנפרד מהנדידה בעובר.')}</div>
 </section>;
}
