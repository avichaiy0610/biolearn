"use client";

import { memo, useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type Props = { lang?: string; processName?: string; theme?: string };
const DURATION=104;
const SPECIES=['אדם','עכבר','כלב','תרנגולת'];
const LNC='#328b79',CODING='#527fa5',PROM='#b28c47';
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{const u=clamp(x);return u*u*(3-2*u)};
const ramp=(t:number,a:number,b:number)=>smooth((t-a)/(b-a));
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
const isolate=(s:string)=>s.replace(/[\u2066\u2069]/g,'').replace(/[A-Za-z0-9][A-Za-z0-9′'().,/–−+%-]*(?: [A-Za-z0-9][A-Za-z0-9′'().,/–−+%-]*)*/g,r=>'\u2066'+r+'\u2069');
const CHAPTERS=[
 {start:0,still:11,name:'אותו לוקוס',text:'משווים אזור מקביל בגנום של אדם, עכבר, כלב ותרנגולת. תיבות הן אקסונים, הקווים המחברים הם אינטרונים והחצים מציינים כיוון שעתוק. המבנה כאן סכמטי: לא מוצג גן מסוים או יישור מדוד.'},
 {start:14,still:25,name:'עמודות שמורות',text:'phastCons מעריך לכל בסיס את ההסתברות להשתייך לאזור שמור ביישור גנומים ממינים רבים. עמודה מוארת מקשרת בדיוק את אותו מקום במסלולי המינים ובמסלול השימור. שימור לאורך מיליוני שנות אבולוציה מרמז על אילוץ תפקודי.'},
 {start:32,still:42,name:'פחות, אך לא אקראי',text:'אקסונים של lncRNA שמורים פחות מאקסונים של גנים מקודדי חלבון, אך יותר מאזורים אקראיים בין גנים. שימור חלש יחסית אינו זהה להיעדר תפקוד. הגבהים וההתאמות בציור סכמטיים; ההשוואה היא בין קבוצות, ולא מדידה של הלוקוס המאויר.'},
 {start:50,still:60,name:'פרומוטור ומיקום',text:'גם פרומוטורים של lncRNA שמורים. רבים מהתעתיקים בעלי התפקוד המגביר נמצאים כמה קילו־בסיסים מהגן המקודד, לעתים באותו כיוון; הקרבה מאפשרת פעולה ב־cis. בסכמה נשמר סדר השכנים בין המינים: שימור ההקשר הגנומי ושימור הרצף הם שאלות נפרדות.'},
 {start:68,still:80,name:'חלופות גדילים',text:'אלה חלופות גנומיות במקביל, לא שלבים בזמן: באותו כיוון, על הגדיל הנגדי עם חפיפה חלקית לגן או לפרומוטור, או בכיוונים מתבדרים מפרומוטור דו־כיווני. מרחק, כיוון וחפיפה מסייעים לחזות על איזה גן lncRNA עשוי לפעול; אינם מוכיחים את היעד.'},
 {start:88,still:99,name:'מה אפשר להסיק',text:'שימור הרצף מרמז על אילוץ תפקודי; השוואת הפרומוטור וההקשר הגנומי מוסיפה מידע כשהאקסונים פחות שמורים. שילוב הרצף, המרחק וכיוון השעתוק מסייע להבין תפקוד ולבחור גן מטרה לבדיקה — וניסוי עדיין נדרש כדי לאמת את ההשערה.'},
];
const chapterAt=(t:number)=>Math.max(0,CHAPTERS.reduce((n,c,i)=>t>=c.start?i:n,0));
const EXONS:[[number,number],[number,number]]=[[.17,.235],[.29,.36]];
const CODONS:[[number,number],[number,number],[number,number]]=[[.60,.69],[.77,.855],[.91,.975]];
function kind(u:number){return u>=.095&&u<=.145?'promoter':EXONS.some(([a,b])=>u>=a&&u<=b)?'lnc':CODONS.some(([a,b])=>u>=a&&u<=b)?'coding':'random'}
function score(u:number){const k=kind(u);return k==='coding'?.84+.1*Math.sin(u*85)**2:k==='promoter'?.65+.1*Math.sin(u*100)**2:k==='lnc'?.32+.17*Math.sin(u*120)**2:.045+.065*Math.sin(u*50)**2}
function matches(r:number,i:number){const k=kind((i+.5)/42);return r===0?true:k==='coding'?(i+r)%13!==0:k==='promoter'?(i+r)%6!==0:k==='lnc'?(i+r*3)%4===0:(i+r)%9===0}
function frame(t:number){
 const coding=ramp(t,14,28),lnc=ramp(t,32,47),prom=ramp(t,50,64);
 const focus=mix(mix(.64,.205,ramp(t,30,35)),.12,ramp(t,48,53));
 const scan=t<28?mix(.60,.975,coding):t<35?mix(.975,.17,ramp(t,28,35)):t<47?mix(.17,.36,ramp(t,35,47)):t<54?mix(.36,.095,ramp(t,47,54)):t<64?mix(.095,.145,ramp(t,54,64)):mix(.145,.64,ramp(t,88,99));
 return {coding,lnc,prom,focus,scan,alignment:ramp(t,12,18),alternatives:ramp(t,68,74),summary:ramp(t,88,97)};
}
function Label({x,y,children,size=15,strong=false,muted=false}:{x:number;y:number;children:ReactNode;size?:number;strong?:boolean;muted?:boolean}){
 return <text data-label="" x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={strong?650:450} fill={muted?'var(--muted)':'var(--ink)'} direction="rtl" style={{unicodeBidi:'plaintext'}}>{typeof children==='string'?isolate(children):children}</text>;
}
function Arrow({x1,x2,y,color}:{x1:number;x2:number;y:number;color:string}){const s=x2>x1?1:-1;return <path d={`M ${x1} ${y} H ${x2} m ${-s*5} -4 l ${s*5} 4 l ${-s*5} 4`} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>}
const CSS=`
.lc{--paper:#faf9f3;--ink:#293f49;--muted:#63777b;--border:#cbd8d4;--wash:#edf2ed;--track:#7c9297;--base:#e0e8df;--route:#879d97;background:var(--paper);color:var(--ink);border:1px solid var(--border);border-radius:22px;overflow:hidden;font:15px/1.65 system-ui,-apple-system,Segoe UI,sans-serif;isolation:isolate;color-scheme:light}
.lc[data-theme=dark]{--paper:#17272e;--ink:#e4eee8;--muted:#afc3c1;--border:#40595d;--wash:#20373d;--track:#9ab5b8;--base:#3a5354;--route:#8aa9a3;color-scheme:dark}
@media(prefers-color-scheme:dark){.lc:not([data-theme=light]){--paper:#17272e;--ink:#e4eee8;--muted:#afc3c1;--border:#40595d;--wash:#20373d;--track:#9ab5b8;--base:#3a5354;--route:#8aa9a3;color-scheme:dark}}
.lc *{box-sizing:border-box}.lc header{padding:22px 25px 8px}.lc h2{font-size:27px;line-height:1.3;letter-spacing:-.5px;margin:6px 0}.lc .kicker{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:12px}.lc nav{display:flex;flex-wrap:wrap;gap:6px;padding:10px 25px 15px}.lc button{font:inherit;color:var(--ink);background:var(--wash);border:1px solid var(--border);border-radius:9px;padding:6px 11px;cursor:pointer;line-height:1.5}.lc nav button{font-size:12px}.lc nav button[aria-current=true]{background:#376e70;color:white;border-color:#376e70}.lc button:focus-visible,.lc input:focus-visible{outline:3px solid #c29c50;outline-offset:3px}.lc svg.movie{display:block;width:100%;height:auto;overflow:hidden}.lc svg text{font-family:inherit}.lc .leader,.lc .anchor{fill:none;stroke:var(--route);stroke-width:1.3;stroke-linecap:round}.lc .anchor{stroke-dasharray:4 4}.lc .caption{padding:12px 25px 0;margin:0;min-height:132px;font-size:14px;line-height:1.8}.lc .caption strong{display:block;font-size:17px;margin-bottom:4px}.lc .phase{padding:0 25px;font-size:12px;color:var(--muted);min-height:23px}.lc .controls{display:flex;gap:11px;align-items:center;flex-wrap:wrap;padding:12px 25px;border-top:1px solid var(--border)}.lc .controls>input{direction:ltr;accent-color:#43877e;flex:1;min-width:65px}.lc .controls button{min-width:86px;font-size:13px}.lc .controls button:disabled{opacity:.6;cursor:default}.lc output{font-size:12px;white-space:nowrap;direction:ltr;font-variant-numeric:tabular-nums}.lc .controls label{font-size:12px;white-space:nowrap}.lc .legend{display:flex;flex-wrap:wrap;gap:6px 19px;padding:7px 25px;font-size:12px}.lc .legend span{display:flex;gap:7px;align-items:center}.lc .legend i{width:11px;height:11px;border-radius:3px;display:inline-block}.lc .note{font-size:11px;color:var(--muted);padding:7px 25px 20px}
@media(max-width:600px){.lc{border-radius:15px}.lc header{padding:17px 16px 5px}.lc h2{font-size:25px}.lc .kicker{font-size:11px}.lc nav{padding:9px 14px 13px;gap:5px}.lc nav button{font-size:11px;padding:5px 8px}.lc .caption{padding:10px 16px 0;min-height:213px;font-size:13px}.lc .phase{padding:0 16px;min-height:42px}.lc .controls{padding:12px 14px;gap:8px}.lc .controls>input{flex-basis:155px}.lc .legend,.lc .note{padding-left:16px;padding-right:16px}}
`;
const Defs=memo(function Defs({uid}:{uid:string}){return <defs>
 <radialGradient id={uid+'-cell'} cx=".3" cy=".25" r=".85"><stop stopColor="#eff4df"/><stop offset=".6" stopColor="#c7dbca"/><stop offset="1" stopColor="#829f92"/></radialGradient>
 <radialGradient id={uid+'-nucleus'} cx=".3" cy=".25" r=".85"><stop stopColor="#ded9e9"/><stop offset=".6" stopColor="#b6a9cb"/><stop offset="1" stopColor="#7e799b"/></radialGradient>
 {[[LNC,'lnc','#c2e5d4'],[CODING,'coding','#c6dbed'],[PROM,'promoter','#f4e0aa'],['#8b77a5','histone','#e8dcf1']].map(([c,id,light])=><linearGradient key={id} id={uid+'-'+id} x1="0" y1="0" x2=".15" y2="1"><stop stopColor={light}/><stop offset=".38" stopColor={c}/><stop offset="1" stopColor={c}/></linearGradient>)}
 </defs>});

const Overview=memo(function Overview({uid,mobile}:{uid:string;mobile:boolean}){
 const fx=mobile?172:332,fy=mobile?104:93,span=mobile?204:500;
 return <g data-id="overview">
 <Label x={mobile?109:119} y={25} strong size={16}>מהכרומטין אל הלוקוס</Label>
 <g transform={`translate(${mobile?78:115} 99)`} data-bound="cell"><ellipse rx="57" ry="53" fill={`url(#${uid}-cell)`} stroke="#809e8c" strokeWidth="1.7"/><path d="M -49 -14 Q -39 -47 -7 -46" fill="none" stroke="#faffeb" strokeWidth="2.4" opacity=".75"/><ellipse rx="31" ry="34" fill={`url(#${uid}-nucleus)`} stroke="#817f9b" strokeWidth="1.4"/>
 <path d="M -19 -13 Q 3 -32 19 -14 T -15 3 T 15 20 M -21 -2 Q 9 -13 22 4 T -11 22" stroke="#745d91" strokeWidth="3" fill="none" opacity=".7"/>
 <circle cx="15" cy="4" r="9" fill="none" stroke={LNC} strokeWidth="2" data-cell-focus=""/></g>
 <path d={`M ${mobile?102:139} 103 Q ${mobile?137:238} 62 ${fx} ${fy}`} className="anchor" data-leader=""/>
 <path d={`M ${fx} ${fy} C ${fx+span*.18} ${fy-24} ${fx+span*.3} ${fy+26} ${fx+span*.45} ${fy} S ${fx+span*.76} ${fy-20} ${fx+span} ${fy}`} stroke="#8b79a1" strokeWidth="8" fill="none"/>
 <path d={`M ${fx} ${fy-2} C ${fx+span*.18} ${fy-26} ${fx+span*.3} ${fy+24} ${fx+span*.45} ${fy-2} S ${fx+span*.76} ${fy-22} ${fx+span} ${fy-2}`} stroke="#dbd1e6" strokeWidth="2" fill="none"/>
 {[.08,.23,.43,.65,.87].map((u,i)=><g key={u} transform={`translate(${fx+span*u} ${fy+Math.sin(u*8)*7}) rotate(${i%2?15:-12})`} data-bound="histone"><ellipse rx={mobile?12:18} ry="12" fill={`url(#${uid}-histone)`} stroke="#807190" strokeWidth="1.2"/><path d="M -11 -4 Q 0 -11 11 -3 M -11 4 Q 0 11 11 4" fill="none" stroke="#dce0c9" strokeWidth="2"/></g>)}
 <rect data-id="overview-locus" x={fx+span*.32} y={fy-22} width={span*.36} height="43" rx="7" fill="none" stroke={LNC} strokeWidth="2"/>
 <Label x={fx+span*.52} y={fy+43} size={16}>אותו אזור בכרומוזום</Label>
 <path d={`M ${fx+span*.49} ${fy+21} V ${fy+23}`} className="leader" data-leader=""/>
 </g>;
});

const Alternatives=memo(function Alternatives({uid,mobile,y}:{uid:string;mobile:boolean;y:number}){
 const w=mobile?360:268,h=mobile?108:143;
 return <g transform={`translate(20 ${y})`} data-id="alternatives" opacity=".25">
 <Label x={mobile?180:430} y={0} size={17} strong>סידורי גדילים · חלופות, לא זמן</Label>
 {[0,1,2].map(i=>{const x=mobile?0:i*288,yy=mobile?22+i*123:24;return <g key={i} transform={`translate(${x} ${yy})`} data-bound="alternative">
 <rect width={w} height={h} rx="13" fill="var(--wash)" stroke="var(--border)"/>
 <Label x={w/2} y={24} size={16} strong>{['באותו כיוון','גדיל נגדי · חפיפה','מתבדרים · פרומוטור משותף'][i]}</Label>
 <path d={`M 18 55 H ${w-18} M 18 63 H ${w-18}`} stroke="var(--track)" strokeWidth="1.7"/>
 <rect x={w*.57} y="46" width={w*.31} height="13" rx="3" fill={`url(#${uid}-coding)`}/>
 <rect x={i===1?w*.47:w*.16} y={i===1?64:46} width={i===1?w*.23:w*.22} height="13" rx="3" fill={`url(#${uid}-lnc)`}/>
 <Arrow x1={w*.59} x2={w*.85} y={39} color={CODING}/>
 <Arrow x1={w*(i===1?.69:i===2?.38:.17)} x2={w*(i===1?.47:i===2?.16:.37)} y={i===1?85:39} color={LNC}/>
 {i===2&&<><rect x={w*.43} y="47" width={w*.08} height="15" rx="3" fill={`url(#${uid}-promoter)`}/><path d={`M ${w*.47} 43 V 32 M ${w*.47} 32 H ${w*.38} M ${w*.47} 32 H ${w*.57}`} fill="none" stroke={PROM} strokeWidth="2"/></>}
 <Label x={w/2} y={mobile?101:127} size={14} muted>{['כמה קילו־בסיסים · פעולה ב־cis','חפיפה לגן או לפרומוטור','שני כיווני שעתוק מאותו אזור'][i]}</Label>
 </g>})}
 </g>;
});

const Stage=memo(function Stage({uid,mobile}:{uid:string;mobile:boolean}){
 const W=mobile?400:900,left=mobile?85:130,span=mobile?286:728,top=mobile?244:221,row=58;
 const X=(u:number)=>left+span*u,plot=top+259,detailY=mobile?672:617,detailX=mobile?20:350,detailW=mobile?360:530;
 const comparisonY=mobile?973:624,altY=mobile?1226:921,H=mobile?1693:1167;
 return <svg className="movie" viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={uid+'-title '+uid+'-desc'}>
 <title id={uid+'-title'}>{isolate('שימור lncRNA והקשר גנומי — לוקוס השוואתי רציף')}</title><desc id={uid+'-desc'}>ארבעה מינים מיושרים לאותו אזור. עמודה סורקת ותקריב מחובר מדגישים אקסון מקודד, אקסון לא מקודד ופרומוטור. מסלול שימור מתחת לאותן קואורדינטות; שלוש חלופות גדילים מוצגות במקביל.</desc>
 <Defs uid={uid}/><Overview uid={uid} mobile={mobile}/>
 <path d={mobile?'M 312 104 H 385 Q 394 104 394 113 V 196 H 200':'M 672 93 H 869 Q 876 93 876 100 V 173 H 490'} className="anchor" data-leader=""/>
 <Label x={W/2} y={top-54} size={17} strong>לוקוס השוואתי אחד · יישור סכמטי</Label>
 <Label x={X(.255)} y={top-27} size={16} strong>lncRNA</Label><Label x={X(.79)} y={top-27} size={16} strong>גן מקודד חלבון</Label>
 <g data-id="column-background" opacity="0"><rect data-id="focus-band" y={top-14} width={span*.08} height={row*3+46} rx="4" fill={PROM} opacity=".09"/></g>
 {SPECIES.map((name,r)=><g key={name} data-id={`track-${r}`} opacity={r===0?1:0}>
 <Label x={mobile?40:62} y={top+r*row+5} size={16} strong>{name}</Label>
 <g data-id={`assembly-${r}`}>
 <path d={`M ${left} ${top+r*row} H ${left+span} M ${left} ${top+r*row+6} H ${left+span}`} stroke="var(--track)" strokeWidth="1.4" fill="none"/>
 <path d={`M ${X(.14)} ${top+r*row-1} H ${X(.36)}`} stroke={LNC} strokeWidth="2"/>
 <path d={`M ${X(.58)} ${top+r*row-1} H ${X(.975)}`} stroke={CODING} strokeWidth="2"/>
 <rect x={X(.095)} y={top+r*row-12} width={span*.05} height="17" rx="3" fill={`url(#${uid}-promoter)`} stroke={PROM} strokeWidth=".6"/>
 {EXONS.map(([a,b],j)=><rect key={'l'+j} x={X(a)} y={top+r*row-12} width={(b-a)*span} height="17" rx="3" fill={`url(#${uid}-lnc)`} stroke={LNC} strokeWidth=".6"/>)}
 {CODONS.map(([a,b],j)=><rect key={'c'+j} x={X(a)} y={top+r*row-12} width={(b-a)*span} height="17" rx="3" fill={`url(#${uid}-coding)`} stroke={CODING} strokeWidth=".6"/>)}
 <Arrow x1={X(.16)} x2={X(.35)} y={top+r*row-20} color={LNC}/><Arrow x1={X(.60)} x2={X(.96)} y={top+r*row-20} color={CODING}/>
 <g data-id={`alignment-${r}`} opacity="0">{Array.from({length:42},(_,i)=>{const k=kind((i+.5)/42),match=matches(r,i);return <rect key={i} data-col={i} data-match={match} x={X(i/42)} y={top+r*row+13} width={span/42-1.3} height="8" rx="1.3" fill={match?k==='coding'?CODING:k==='promoter'?PROM:LNC:'var(--base)'} opacity={r===0?.55:.85}/>})}</g>
 </g></g>)}
 <g data-id="synteny" opacity="0"><path d={`M ${X(.36)} ${top+row*3+43} V ${top+row*3+49} H ${X(.60)} V ${top+row*3+43}`} className="leader"/><Label x={X(.48)} y={top+row*3+72} size={15}>כמה קילו־בסיסים</Label></g>
 <g data-id="anatomy-labels" opacity="0"><Label x={mobile?65:62} y={plot-40} size={14}>פרומוטור</Label><path d={`M ${mobile?103:105} ${plot-44} H ${X(.12)} V ${top+row*3-4}`} className="leader" data-leader=""/><Label x={X(.265)} y={plot-40} size={14}>אינטרון</Label><path d={`M ${X(.265)} ${plot-58} V ${top+row*3+1}`} className="leader" data-leader=""/><Label x={X(.82)} y={plot-40} size={14}>אקסון</Label><path d={`M ${X(.82)} ${plot-58} V ${top+row*3+4}`} className="leader" data-leader=""/></g>
 <Label x={mobile?237:480} y={plot+13} size={15} strong>שימור · phastCons · סכמטי</Label>
 <g data-id="conservation" opacity=".18">
 <path d={`M ${left} ${plot+88} H ${left+span} M ${left} ${plot+25} V ${plot+88}`} stroke="var(--border)" strokeWidth="1.3"/>
 <Label x={left-19} y={plot+35} size={14} muted>1</Label><Label x={left-19} y={plot+92} size={14} muted>0</Label>
 {Array.from({length:84},(_,i)=>{const u=(i+.5)/84,h=score(u)*59;return <rect key={i} data-id={`cons-${i}`} data-score={score(u)} x={X(i/84)} y={plot+88-h} width={span/84-.8} height={h} rx="1" fill={kind(u)==='coding'?CODING:kind(u)==='promoter'?PROM:LNC}/>})}
 <Label x={mobile?235:490} y={plot+114} size={14} muted>אותן קואורדינטות גנומיות · ללא קנה מידה</Label>
 </g>
 <g data-id="scanner" opacity="0"><path data-id="scan-line" d="" stroke={PROM} strokeWidth="1.7" strokeDasharray="3 4"/><circle data-id="focus" data-focus="" r="6" fill="var(--paper)" stroke={PROM} strokeWidth="2"/></g>
 <path data-id="detail-anchor" data-anchor="" className="anchor"/>
 <g transform={`translate(${detailX} ${detailY})`}>
 <rect data-bound="detail-panel" width={detailW} height="279" rx="18" fill="var(--wash)" stroke="var(--border)"/>
 <Label x={detailW/2} y={29} size={17} strong>תקריב מעוגן · אותה עמודת יישור</Label>
 <Label x={detailW/2} y={55} size={15} muted>תיבות תואמות = בסיס משותף · סכמטי</Label>
 {SPECIES.map((sp,r)=><Label key={sp} x={37} y={88+r*33} size={15}>{sp}</Label>)}
 <svg x="76" y="67" width={detailW-96} height="132" preserveAspectRatio="none" viewBox="0 0 300 132" data-id="zoom-window" overflow="hidden">
 {SPECIES.map((sp,r)=><g key={sp}>{Array.from({length:42},(_,j)=>{const k=kind((j+.5)/42),color=k==='coding'?CODING:k==='promoter'?PROM:LNC;return <g key={j}><rect data-zoom-col={`${r}-${j}`} x={j*30+2} y={3+r*33} width="26" height="25" rx="4" fill={matches(r,j)?color:'var(--base)'}/><path d={`M ${j*30+5} ${8+r*33} h 20`} stroke="#fff" opacity=".25" strokeWidth="1.5"/></g>})}</g>)}
 <rect data-id="detail-column" x="126" y="0" width="28" height="131" rx="4" fill="none" stroke={PROM} strokeWidth="2"/>
 </svg>
 <g data-id="detail-label"><Label x={detailW/2} y={228} size={17} strong>אקסון מקודד · שימור גבוה</Label></g>
 <Label x={detailW/2} y={255} size={14} muted>התקריב מחובר לסמן על הלוקוס שמעליו</Label>
 </g>
 <g transform={`translate(20 ${comparisonY})`} data-bound="comparison">
 <Label x={mobile?180:145} y={13} size={16} strong>השוואת קבוצות · גבהים סכמטיים</Label>
 {[['מקודד',CODING,.92],['פרומוטור',PROM,.69],['lncRNA',LNC,.42],['אקראי','#87959b',.10]].map(([name,color,h],i)=><g key={name}>
 <Label x={mobile?51:49} y={46+i*42} size={15}>{name}</Label><rect x="100" y={31+i*42} width={mobile?250:180} height="20" rx="5" fill="var(--base)"/>
 <rect data-id={`bar-${i}`} x="100" y={31+i*42} width="1" height="20" rx="5" fill={String(color)} data-target={Number(h)*(mobile?250:180)}/>
 </g>)}
 <Label x={mobile?180:145} y={220} size={14} muted>השוואה בין קבוצות, לא מדידה של אתר זה</Label>
 </g>
 <Alternatives uid={uid} mobile={mobile} y={altY}/>
 <g data-id="summary" opacity="0"><Label x={W/2} y={mobile?1644:1126} size={17} strong>רצף + פרומוטור + מיקום = רמז לתפקוד</Label><Label x={W/2} y={mobile?1671:1152} size={14} muted>הקשר גנומי מציע גן מטרה · ניסוי נדרש לאימות</Label></g>
 </svg>;
});

function paint(root:HTMLElement,t:number,mobile:boolean){
 const f=frame(t),els=new Map<string,SVGElement>();root.querySelectorAll<SVGElement>('[data-id]').forEach(n=>els.set(n.dataset.id!,n));
 const set=(id:string,k:string,v:number|string)=>els.get(id)?.setAttribute(k,String(v));
 const op=(id:string,v:number)=>set(id,'opacity',v);
 const left=mobile?85:130,span=mobile?286:728,top=mobile?244:221,plot=top+259,detailX=mobile?20:350,detailY=mobile?672:617;
 for(let r=0;r<4;r++){const u=ramp(t,r*2.4,r*2.4+3);op(`track-${r}`,r===0?.45+.55*u:u);set(`assembly-${r}`,'transform',`translate(${left*(1-u)} 0) scale(${u} 1)`);op(`alignment-${r}`,f.alignment)}
 op('conservation',.18+.82*f.alignment);op('column-background',f.alignment);set('focus-band','x',left+(f.focus-.04)*span);
 op('scanner',f.alignment);const x=left+f.scan*span,y=top+17;set('scan-line','d',`M ${x} ${top-15} V ${plot+88}`);set('focus','cx',x);set('focus','cy',y);
 set('detail-anchor','d',mobile?`M ${detailX+350} ${detailY} Q 394 ${detailY-29} 394 ${plot+125} V ${top+29} H ${x} V ${y}`:`M ${detailX+510} ${detailY} Q 882 ${detailY-35} 882 ${plot+117} V ${top+29} H ${x} V ${y}`);
 // A moving window onto the SAME 42 columns, not a separately invented alignment.
 const start=Math.max(0,Math.min(32,f.scan*42-5));
 set('zoom-window','viewBox',`${start*30} 0 300 132`);set('detail-column','x',f.scan*42*30-14);
 const label=els.get('detail-label')?.querySelector('text');
 const k=kind(f.scan),title=k==='coding'?'אקסון מקודד · שימור גבוה':k==='lnc'?'אקסון lncRNA · שימור חלש יותר':k==='promoter'?'פרומוטור · שימור של אזור בקרה':'בין האקסונים · אותו יישור';
 if(label)label.textContent=isolate(title);
 [1,f.prom,f.lnc,1].forEach((v,i)=>{const u=i===0?f.coding:i===3?f.alignment:v;set(`bar-${i}`,'width',Number(els.get(`bar-${i}`)?.dataset.target)*(.04+.96*u))});
 op('synteny',ramp(t,50,58));op('anatomy-labels',ramp(t,6,12));op('alternatives',.25+.75*f.alternatives);op('summary',f.summary);
 root.dataset.time=t.toFixed(3);root.dataset.chapter=String(chapterAt(t));root.dataset.scan=String(f.scan);
}

export default function LncConsScene({lang='he',processName,theme}:Props){
 const root=useRef<HTMLElement>(null),uid='lc'+useId().replace(/[^a-zA-Z0-9]/g,''),[mobile,setMobile]=useState(false),[time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduced,setReduced]=useState(false);
 const clock=useRef(0),playing=useRef(true),looping=useRef(true),visible=useRef(true),reduce=useRef(false),lastUI=useRef(0);
 const chapter=chapterAt(time);
 useEffect(()=>{const el=root.current;if(!el)return;const media=matchMedia('(prefers-reduced-motion: reduce)'),sync=()=>{reduce.current=media.matches;setReduced(media.matches);if(media.matches){playing.current=false;setRunning(false);clock.current=CHAPTERS[chapterAt(clock.current)].still;setTime(clock.current)}};sync();media.addEventListener('change',sync);const resize=new ResizeObserver(e=>setMobile(e[0].contentRect.width<600));resize.observe(el);const observer=new IntersectionObserver(e=>{visible.current=e[0].isIntersecting},{threshold:.01});observer.observe(el);return()=>{media.removeEventListener('change',sync);resize.disconnect();observer.disconnect()}},[]);
 useEffect(()=>{const el=root.current;if(!el)return;let raf=0,previous=0;const tick=(now:number)=>{const dt=previous?Math.min((now-previous)/1000,.1):0;previous=now;if(playing.current&&!reduce.current&&visible.current&&!document.hidden){clock.current+=dt;if(clock.current>=DURATION){if(looping.current)clock.current%=DURATION;else{clock.current=DURATION;playing.current=false;setRunning(false)}}paint(el,clock.current,mobile);if(now-lastUI.current>80){setTime(clock.current);lastUI.current=now}}raf=requestAnimationFrame(tick)};paint(el,clock.current,mobile);raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[mobile]);
 useEffect(()=>{if(root.current)paint(root.current,clock.current,mobile)},[time,mobile]);
 const seek=(t:number)=>{clock.current=t;setTime(t);if(root.current)paint(root.current,t,mobile)};
 const toggle=()=>{if(clock.current>=DURATION)seek(0);playing.current=!playing.current;setRunning(playing.current)};
 return <section ref={root} className="lc" data-theme={theme} data-lang={lang} dir="rtl" aria-label={isolate('סרט רציף: שימור lncRNA והקשר גנומי')}>
 <style>{CSS}</style><header><div className="kicker"><span>רצף · פרומוטור · שכנות גנומית</span><span>{reduced?'תמונות מפתח · תנועה מופחתת':'סרט רציף · לוקוס אחד'}</span></div><h2>{isolate(processName||'lncRNA — שימור והקשר גנומי')}</h2></header>
 <nav aria-label="פרקי הסרט">{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>seek(reduced?c.still:c.start)}>{c.name}</button>)}</nav>
 <Stage uid={uid} mobile={mobile}/>
 <p className="caption" aria-live="polite" aria-atomic="true"><strong>{CHAPTERS[chapter].name}</strong>{isolate(CHAPTERS[chapter].text)}</p>
 <p className="phase">המסלולים נשארים במקום. הסמן והתקריב חוקרים חלקים שונים של אותו לוקוס.</p>
 <div className="controls"><button disabled={reduced} aria-label={running&&!reduced?'השהיה':'ניגון'} onClick={toggle}>{running&&!reduced?'❚❚ השהיה':'▶ ניגון'}</button><input aria-label="מיקום בסרט" type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>seek(Number(e.target.value))}/><output>{isolate(`${Math.floor(time).toString().padStart(3,'0')} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{looping.current=e.target.checked;setLoop(e.target.checked)}}/>לולאה</label></div>
 <div className="legend">{[[LNC,'אקסוני lncRNA'],[CODING,'אקסונים מקודדי חלבון'],[PROM,'פרומוטור / סמן יישור'],['#a08ab5','נוקלאוזומים']].map(([color,name])=><span key={name}><i style={{background:color}}/>{isolate(name)}</span>)}</div>
 <div className="note">{isolate('איור מקורי וסכמטי; ללא רצפים, ציוני שימור או מרחקים מדודים. אין כאן טענה שכל lncRNA קיים בכל ארבעת המינים. מקור: Ørom ועמיתיו, Cell 2010; phastCons: Siepel ועמיתיו, 2005. חלופת הפרומוטור הדו־כיווני והמחשת סדר השכנים נוספו לפי מפרט הביקורת.')}</div>
 </section>;
}
