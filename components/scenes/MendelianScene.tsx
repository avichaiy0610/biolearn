"use client";

import React, { memo, useEffect, useId, useRef, useState } from "react";
type Point = [number, number];
type Props = { lang?: string; processName?: string; theme?: "light" | "dark" };
export const DURATION = 156;
const clamp = (x:number) => Math.max(0,Math.min(1,x));
const ease = (x:number) => {const u=clamp(x);return u*u*(3-2*u)};
const ramp = (t:number,a:number,b:number) => ease((t-a)/(b-a));
const mix = (a:number,b:number,u:number) => a+(b-a)*u;
const lerp = (a:Point,b:Point,u:number):Point => [mix(a[0],b[0],u),mix(a[1],b[1],u)];
export const isolateRuns = (s:string) => s.replace(/[\u2066\u2069]/g,"").replace(/[A-Za-z0-9½¼][A-Za-z0-9₁₂:½¼]*(?:[ ×+:/.→−-]+[A-Za-z0-9½¼][A-Za-z0-9₁₂:½¼]*)*/g,s=>"\u2066"+s+"\u2069");
export const CHAPTERS = [
 {start:0,still:7,he:"הורים ואללים",en:"Parents & alleles",textHe:"עוקבים אחר שני צמחי אפונה סגולים מדור F1: ‏Aa × Aa. בכל תא דיפלואידי שני אללים, אחד מכל הורה, באותו לוקוס על כרומוזומים הומולוגיים. בדומיננטיות מלאה AA ו־Aa סגולים; רק aa לבן. אותו פנוטיפ יכול להתאים לגנוטיפים שונים. דומיננטי אינו בהכרח נפוץ יותר או טוב יותר.",textEn:"Follow two purple F1 pea plants: Aa × Aa. A diploid cell has two alleles, one from each parent, at the same locus on homologous chromosomes. With complete dominance AA and Aa are purple; only aa is white. A phenotype can have different genotypes. Dominant does not mean more common or better."},
 {start:12,still:28,he:"היפרדות במיוזה",en:"Segregation",textHe:"לאחר שכפול DNA כל הומולוג מורכב משתי כרומטידות אחיות. במיוזה I נפרדים ההומולוגים A ו־a; האחיות נשארות יחד. במיוזה II נפרדות האחיות. כל תוצר הפלואידי מקבל אלל אחד: A או a ביחס 1:1. באפונה מיוזה יוצרת נבגים; הגמטות נוצרות בהמשך במיטוזה בגמטופיט. כאן מוצג המסלול בתמצית; בצד הנקבי רק מגספורה אחת לרוב שורדת.",textEn:"After DNA replication each homolog has two sister chromatids. Meiosis I separates A and a homologs, keeping sisters together; meiosis II separates sisters. Each haploid product gets one allele: A or a, 1:1. In peas meiosis makes spores; gametes subsequently form by mitosis in gametophytes. This is a condensed lineage; usually only one female megaspore survives."},
 {start:32,still:40,he:"גמטות והפריה",en:"Gametes & fertilization",textHe:"אותם סמלי גמטות נעים אל ריבוע פאנט. כל תא הוא אפשרות הפריה נפרדת: גמטה מהורה אחד מתאחדת עם גמטה מההורה השני, והדיפלואידיות מתחדשת. כל הורה תורם A או a בהסתברות ½. סמלי ארבע האפשרויות מייצגים אירועים נפרדים; אין חלוקה של גמטה יחידה לכמה הפריות.",textEn:"The same gamete symbols travel into the anchored Punnett square. Each cell is a separate possible fertilization: one gamete from each parent fuses, restoring diploidy. Each parent contributes A or a with probability ½. The four possibilities represent separate events; a single gamete is never divided among fertilizations."},
 {start:46,still:58,he:"צאצאי F2",en:"F2 offspring",textHe:"ארבע אפשרויות שוות הסתברות מצטברות: AA, ‏Aa, ‏Aa, ‏aa. יחס הגנוטיפים הצפוי הוא 1 AA : 2 Aa : 1 aa; יחס הפנוטיפים 3 סגול : 1 לבן — יחס F2 של מנדל. כל עמודה מוסיפה צאצא לדוגמה ולמונה. זהו יחס הסתברותי במדגם גדול, לא הבטחה שבכל ארבעה צאצאים יהיה אחד לבן.",textEn:"Four equally likely outcomes accumulate: AA, Aa, Aa, aa. Expected genotype ratio: 1 AA : 2 Aa : 1 aa; phenotype ratio: 3 purple : 1 white, Mendel’s F2 ratio. Each example offspring adds to the count. This is a large-sample probability ratio, not a guarantee of one white plant in every four offspring."},
 {start:64,still:79,he:"הכלאת מבחן",en:"Testcross",textHe:"דוגמה מסומנת: פרט סגול בעל גנוטיפ לא ידוע מוכלא עם aa. אם ההורה Aa, התוחלת היא 1 סגול : 1 לבן. אם הוא AA, כל הצאצאים צפויים להיות סגולים. צאצא לבן חושף הורה Aa; מדגם שכולו סגול רק תומך ב־AA ואינו מוכיח זאת במדגם סופי.",textEn:"Labelled example: cross an unknown purple plant with aa. If it is Aa, expect 1 purple : 1 white; if AA, expect all purple. A white offspring reveals Aa; an all-purple finite sample supports AA without proving it."},
 {start:84,still:99,he:"מיון בלתי תלוי",en:"Independent assortment",textHe:"דוגמה נפרדת: AaBb × AaBb. ‏A/a לצבע פרח (סגול/לבן), B/b לצבע תרמיל (ירוק/צהוב); הגנים בדגם על זוגות כרומוזומים שונים. שני תאים מדגימים שתי אוריינטציות שוות הסתברות במטאפאזה I: ‏AB מול ab, או Ab מול aB. בכל מיוזה מתקבלת אוריינטציה אחת בלבד. על פני מיוזות רבות נוצרים AB, ‏Ab, ‏aB, ‏ab ביחס 1:1:1:1. גנים תאחיזים סמוכים אינם מתמיינים כך; גם גנים רחוקים מאוד על אותו כרומוזום יכולים להתנהג כבלתי תלויים.",textEn:"Separate example: AaBb × AaBb. A/a controls purple/white flowers, B/b green/yellow pods; the model places the genes on different chromosome pairs. Two cells show equally likely metaphase-I orientations: AB versus ab, or Ab versus aB. One orientation occurs per meiosis. Across many meioses AB, Ab, aB, ab occur 1:1:1:1. Closely linked genes do not assort independently; very distant genes on one chromosome can behave as independent."},
 {start:112,still:140,he:"שתי תכונות יחד",en:"Two traits together",textHe:"ארבעת סוגי הגמטות מכל הורה נפגשים ב־16 אפשרויות שוות הסתברות. עם מיון בלתי תלוי ודומיננטיות מלאה בכל לוקוס, צאצאי F2 מצטברים ליחס צפוי 9 סגול ותרמיל ירוק : 3 סגול ותרמיל צהוב : 3 לבן ותרמיל ירוק : 1 לבן ותרמיל צהוב. זהו מכפלת שני יחסי 3:1; אין אפיסטזיס בדוגמה זו.",textEn:"Four gamete types from each parent meet in 16 equally likely combinations. With independent assortment and complete dominance at both loci, F2 accumulates in the expected ratio 9 purple/green pod : 3 purple/yellow pod : 3 white/green pod : 1 white/yellow pod. This is the product of two 3:1 ratios, without epistasis in this example."},
] as const;
export const chapterAt = (t:number) => Math.max(0,CHAPTERS.findLastIndex(c=>t>=c.start));
const TYPES = ["AB","Ab","aB","ab"];
const genePair=(a:string,b:string)=>a===b?a+b:(a===a.toUpperCase()?a+b:b+a);
export function offspringGenotype(i:number,dihybrid=false){if(!dihybrid)return ["AA","Aa","Aa","aa"][i];const a=TYPES[i%4],b=TYPES[Math.floor(i/4)];return genePair(a[0],b[0])+genePair(a[1],b[1])}
/** Persistent chromatid/gamete identity: 4 products per parent, sampled across sporogenesis. */
export function gameteState(t:number,index:number,mobile=false){
 const parent=Math.floor(index/4),j=index%4,homolog=j<2?0:1,sister=j%2;
 const w=mobile?400:960,cx=mobile?(parent?290:110):(parent?710:250),cy=mobile?270:255;
 let p:Point=[cx+(homolog?19:-19)+(sister?5:-5),cy];
 p[0]+= (homolog?1:-1)*42*ramp(t,15,21);p[1]+=(sister?1:-1)*33*ramp(t,23,28);
 const size=mobile?114:155,gx=w/2-size,gy=mobile?386:330;
 const cell=parent?[0,1,2,3][j]:[0,2,1,3][j],col=cell%2,row=Math.floor(cell/2),center:Point=[gx+size*(col+.5),gy+size*(row+.5)];
 const header:Point=parent?[gx-34,gy+size*(row+.5)+(col?9:-9)]:[gx+size*(col+.5)+(row?9:-9),gy-36];
 p=lerp(p,header,ramp(t,29,35));p=lerp(p,[center[0]+(parent?12:-12)*(1-ramp(t,41+cell,43+cell)),center[1]-5],ramp(t,36+cell,41+cell));
 return {point:p,allele:homolog?"a":"A",sisters:t<23,cell,alpha:(1-ramp(t,44+cell,47+cell)),shell:ramp(t,26,30),scale:mix(1,.62,ramp(t,29,35))};
}
function Label({children,...rest}:React.SVGProps<SVGTextElement>&{children:string}){return <text textAnchor="middle" {...rest}>{isolateRuns(children)}</text>}
function Plant({white=false,pod=false,yellow=false}:{white?:boolean;pod?:boolean;yellow?:boolean}){
 const color=white?"#f5f1e7":"#a58ac2",edge=white?"#819394":"#674a8b";
 return <g data-part="pea-plant"><path d="M0 48 C-5 20 9 -1 0 -36 M-1 23 C-33 26 -36 3 -11 9 C0 11 0 20 0 23 M3 9 C30 10 37 -12 17 -7 C6 -4 4 1 3 9 M-1 36 C19 35 25 18 30 22 C39 30 23 42 29 46" fill="none" stroke="#5d8a68" strokeWidth="3" strokeLinecap="round"/><path d="M-2 24 C-33 28 -36 2 -11 9 C-1 11 -1 19 -2 24 M3 9 C30 10 37 -12 17 -7 C6 -4 4 1 3 9" fill="#91b38a" stroke="#507d5b" strokeWidth="1.4"/><path d="M-4 -19 C-33 -25 -39 -48 -18 -55 C-5 -61 11 -62 27 -50 C43 -34 20 -20 -4 -19Z" fill={color} stroke={edge} strokeWidth="1.6"/><path d="M-5 -23 C-23 -39 -20 -49 -11 -49 C-2 -46 5 -37 6 -29 C22 -48 35 -34 23 -24 C17 -18 6 -14 -5 -23Z" fill={white?"#e4ebe3":"#c4aad9"} stroke={edge} strokeWidth="1.4"/><path d="M-9 -23 C-8 -5 10 -3 14 -22 C9 -17 0 -17 -9 -23Z" fill={white?"#d1ded9":"#80639f"} stroke={edge} strokeWidth="1.3"/><path d="M-4 -13 L-9 -8 L-3 -6 L2 -10 L7 -6 L9 -11" fill="#658a60" stroke="#507d5b"/>
 {pod&&<g transform="translate(18 23) rotate(-28)"><path d="M-4 -22 C-18 -6 -16 21 -2 31 C13 14 14 -11 -4 -22Z" fill={yellow?"#e5c66d":"#91b66f"} stroke={yellow?"#917438":"#507d46"} strokeWidth="1.3"/>{[-10,1,12].map(y=><ellipse key={y} cy={y} rx="5" ry="6" fill={yellow?"#f3d989":"#bad08e"} opacity=".75"/>)}<path d="M-4 -19 Q-8 7 -2 28" fill="none" stroke={yellow?"#b0964b":"#729c53"}/></g>}
 <path d="M-20 49 Q0 44 20 49" stroke="#a9b39a" strokeWidth="2" fill="none"/>
 </g>;
}
function Chromatid({allele,blue=false}:{allele:string;blue?:boolean}){return <g data-part="chromatid"><path d="M0 -25 C-7 -13 -4 -7 0 0 C4 8 6 15 0 26" stroke={blue?"#527d9c":"#a36d63"} strokeWidth="8" fill="none" strokeLinecap="round"/><path d="M-1 -23 C-4 -13 -2 -7 1 -2" stroke={blue?"#aec4d2":"#d7b0a2"} strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M-5 -12 H5" stroke="#ebcf85" strokeWidth="5"/><circle r="3" fill="#f3dec0" stroke="#6c7478" strokeWidth="1"/><Label x="0" y="-33" fontSize="26" fontWeight="750" fill="var(--ink)">{allele}</Label></g>}
const StaticArt=memo(function StaticArt({en,uid}:{en:boolean;uid:string}){return <>
 <defs><radialGradient id={`${uid}-cell`}><stop stopColor="#bcd3b4" stopOpacity=".24"/><stop offset="1" stopColor="#7ba697" stopOpacity=".06"/></radialGradient><radialGradient id={`${uid}-egg`}><stop stopColor="#e6ce8d" stopOpacity=".65"/><stop offset="1" stopColor="#c4ad75" stopOpacity=".12"/></radialGradient></defs>
 <g data-layer="mono">
 {[0,1].map(p=><g key={p}>
  <g data-move={`parent${p}`} data-bound={`parent${p}`}><Plant/><Label y="77" className="mc-name">{en?`F1 parent ${p+1} · Aa`:`הורה ${p+1} · F1 · Aa`}</Label></g>
  <g data-move={`cell${p}`} data-bound={`cell${p}`}><ellipse data-cell-shell={p} rx="90" ry="77" fill={`url(#${uid}-cell)`} stroke="var(--cell)" strokeWidth="1.7"/><path data-spindle={p} d="M0 -65 L-23 0 L0 65 L23 0Z" stroke="var(--cell)" fill="none" strokeWidth=".8" opacity=".5"/></g>
  <g data-move={`stageName${p}`}><Label className="mc-label">{en?"Haploid products":"תוצרים הפלואידיים"}</Label></g>
 </g>)}
 <g data-move="monoGrid" data-bound="monoGrid">
  <g data-grid-lines="">{[0,1,2].map(i=><React.Fragment key={i}><path d={`M${i*102} 0 V204 M0 ${i*102} H204`} stroke="var(--line)" strokeWidth="1.3"/></React.Fragment>)}</g>
  <g data-mono-headers="">{['A','a'].map((s,i)=><React.Fragment key={s}><Label x={(i+.5)*102} y="-20" className="mc-name">{s}</Label><Label x="-27" y={(i+.5)*102+5} className="mc-name">{s}</Label></React.Fragment>)}</g>
 </g>
 <g data-move="monoHeading"><Label className="mc-name">{en?"Aa × Aa · separate possible unions":"Aa × Aa · אפשרויות הפריה נפרדות"}</Label></g>
 {Array.from({length:8},(_,i)=><g key={i} data-move={`gamete${i}`} data-token={`mono-${i}`} data-bound={`gamete${i}`}><circle data-shell="" r="19" fill={`url(#${uid}-egg)`} stroke="#a28b57" strokeWidth="1.3"/><g data-chromatid=""><Chromatid allele={i%4<2?"A":"a"} blue={i%4<2}/></g></g>)}
 {Array.from({length:4},(_,i)=><g key={i} data-move={`offspring${i}`} data-bound={`offspring${i}`}><g data-growth=""><Plant white={i===3}/></g><Label y="72" className="mc-genotype">{offspringGenotype(i)}</Label></g>)}
 <g data-move="monoRatio"><Label className="mc-ratio" data-mono-count="">0 : 0</Label><Label y="29" className="mc-label">{en?"purple : white · expected 3:1":"סגול : לבן · תוחלת 3:1"}</Label><Label y="55" className="mc-label">1 AA : 2 Aa : 1 aa</Label></g>
 <g data-move="testTitle"><Label className="mc-name">{en?"TESTCROSS · unknown purple × aa":"הכלאת מבחן · סגול לא ידוע × aa"}</Label></g>
 {[0,1].map(row=><g key={row} data-move={`test${row}`} data-bound={`test${row}`}><Label y="0" className="mc-name">{row===0?"Aa × aa → 1 Aa : 1 aa":"AA × aa → 100% Aa"}</Label>{[0,1].map(i=><g key={i} data-test-child={`${row}-${i}`} transform={`translate(${i?55:-55} 90) scale(.72)`}><Plant white={row===0&&i===1}/></g>)}</g>)}
 {Array.from({length:8},(_,i)=>{const row=Math.floor(i/4),j=i%4;return <g key={i} data-move={`testGamete${i}`} data-bound={`testGamete${i}`}><circle r="13" fill={`url(#${uid}-egg)`} stroke="#a28b57"/><Label y="5" className="mc-small">{j>=2?'a':row===0&&j===1?'a':'A'}</Label></g>})}
 </g>
 <g data-layer="di">
 <g data-move="diTitle"><Label className="mc-name">{en?"EXAMPLE · AaBb × AaBb":"דוגמה נפרדת · AaBb × AaBb"}</Label><Label y="27" className="mc-label">{en?"A/a flower · B/b pod · unlinked":"A/a צבע פרח · B/b צבע תרמיל · ללא תאחיזה"}</Label></g>
 {[0,1].map(o=><g key={o}><g data-move={`diCell${o}`} data-bound={`diCell${o}`}><ellipse rx="88" ry="87" fill={`url(#${uid}-cell)`} stroke="var(--cell)" strokeWidth="1.5"/><path d="M0 -73 V73" stroke="var(--line)" strokeDasharray="4 5"/><Label y="114" className="mc-label">{o===0?"AB | ab":"Ab | aB"}</Label></g>{Array.from({length:8},(_,i)=><g key={i} data-move={`diChrom${o}-${i}`} data-bound={`diChrom${o}-${i}`}><Chromatid allele={i<4?(i<2?"A":"a"):(i<6?"B":"b")} blue={i%4<2}/></g>)}</g>)}
 <g data-move="diOrientation"><Label className="mc-label">{en?"Two cells · two equally likely orientations":"שני תאים · שתי אוריינטציות שוות הסתברות"}</Label></g>
 <g data-move="diGrid" data-bound="diGrid">{[0,1,2,3,4].map(i=><path key={i} d={`M${i*72} 0 V288 M0 ${i*72} H288`} stroke="var(--line)" strokeWidth="1.2"/>)}{TYPES.map((s,i)=><React.Fragment key={s}><Label x={(i+.5)*72} y="-20" className="mc-label">{s}</Label><Label x="-27" y={(i+.5)*72+5} className="mc-label">{s}</Label></React.Fragment>)}</g>
 {TYPES.map((s,i)=><g key={s} data-move={`diPool${i}`} data-bound={`diPool${i}`}><circle cy="-22" r="18" fill={`url(#${uid}-egg)`} stroke="#a28b57"/><circle cy="22" r="18" fill={`url(#${uid}-egg)`} stroke="#a28b57"/><Label y="64" className="mc-label">{s+' · ¼'}</Label></g>)}
 {Array.from({length:32},(_,i)=>{const n=i%16,s=TYPES[i<16?n%4:Math.floor(n/4)];return <g key={i} data-move={`diGamete${i}`} data-token={`di-${i}`} data-bound={`diGamete${i}`}><circle r="14" fill={`url(#${uid}-egg)`} stroke="#a28b57"/>{[0,1].map(j=><g key={j}><path d={`M${j?5:-5} -8 v16`} stroke={s[j]===s[j].toUpperCase()?'#527d9c':'#a36d63'} strokeWidth="4" strokeLinecap="round"/><path d={`M${j?3:-7} -3 h4`} stroke="#ebcf85" strokeWidth="2"/></g>)}<Label y="5" className="mc-small">{s}</Label></g>})}
 {Array.from({length:16},(_,i)=>{const g=offspringGenotype(i,true);return <g key={i} data-move={`diOffspring${i}`} data-bound={`diOffspring${i}`}><g data-growth=""><Plant white={!g.includes('A')} pod yellow={!g.includes('B')}/></g><Label y="94" style={{fontSize:34,fontWeight:600}}>{g}</Label></g>})}
 <g data-move="diRatio"><Label data-di-count="" className="mc-ratio">0 : 0 : 0 : 0</Label><Label y="30" className="mc-label">{en?"expected phenotype ratio · 9:3:3:1":"יחס פנוטיפים צפוי · 9:3:3:1"}</Label><Label y="55" className="mc-small">{en?"purple/green · purple/yellow · white/green · white/yellow":"סגול/ירוק · סגול/צהוב · לבן/ירוק · לבן/צהוב"}</Label></g>
 </g>
 <g data-move="callout"><Label y="0" className="mc-label" data-callout="">{en?"Same locus":"אותו לוקוס"}</Label><path data-leader="" d="M0 11 V26 L-20 46" fill="none" stroke="var(--muted)" strokeWidth="1.1"/><circle data-target="" cx="-20" cy="46" r="2.5" fill="var(--muted)"/></g>
 </>});

const CSS=`.mc{--paper:#f6f7f1;--ink:#293f43;--muted:#5e7475;--line:#b3c3b9;--cell:#7d9d91;--button:#eef2e9;--accent:#4c7f6c;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:19px;overflow:hidden;font:15px/1.7 system-ui,sans-serif;isolation:isolate}.mc[data-theme=dark]{--paper:#17292e;--ink:#e2eae0;--muted:#adc2bc;--line:#466361;--cell:#89a99b;--button:#233b3e;--accent:#a5c5ae}@media(prefers-color-scheme:dark){.mc:not([data-theme=light]){--paper:#17292e;--ink:#e2eae0;--muted:#adc2bc;--line:#466361;--cell:#89a99b;--button:#233b3e;--accent:#a5c5ae}}.mc *{box-sizing:border-box}.mc header{padding:22px 26px 10px}.mc h2{font-size:25px;line-height:1.35;margin:7px 0}.mc-kicker{display:flex;justify-content:space-between;gap:12px;font-size:12px;color:var(--muted);letter-spacing:.04em}.mc nav{display:flex;gap:6px;padding:4px 24px 12px;flex-wrap:wrap}.mc button{font:inherit;border:1px solid var(--line);border-radius:8px;color:var(--ink);background:var(--button);padding:6px 10px;cursor:pointer}.mc nav button{font-size:12px}.mc button[aria-current=true]{border-color:var(--accent);box-shadow:inset 0 -2px var(--accent)}.mc button:focus-visible,.mc input:focus-visible{outline:3px solid var(--accent);outline-offset:2px}.mc svg.mc-movie{width:100%;height:auto;display:block;direction:ltr;overflow:hidden}.mc svg text{font-family:system-ui,sans-serif;fill:var(--ink);direction:rtl;unicode-bidi:plaintext}.mc-label{font-size:16px;fill:var(--muted)!important}.mc-name{font-size:18px;font-weight:650}.mc-small{font-size:14px}.mc-genotype{font-size:19px;font-weight:750}.mc-ratio{font-size:26px;font-weight:750}.mc-caption{padding:14px 24px 8px;min-height:128px;margin:0;border-top:1px solid var(--line)}.mc-caption strong{display:block;color:var(--accent);margin-bottom:4px}.mc-phase{padding:0 24px;margin:0 0 12px;font-size:13px;color:var(--muted);min-height:23px}.mc-controls{padding:10px 24px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;direction:rtl}.mc-controls input[type=range]{flex:1;min-width:100px;accent-color:var(--accent);direction:ltr}.mc-controls output{font:12px ui-monospace,monospace;white-space:nowrap}.mc-controls label{font-size:12px;display:flex;align-items:center;gap:4px}.mc-legend{display:flex;gap:16px;flex-wrap:wrap;padding:10px 24px;font-size:12px;color:var(--muted)}.mc-legend i{display:inline-block;width:15px;height:5px;border-radius:3px;margin-inline-end:6px;vertical-align:middle}.mc-note{font-size:12px;color:var(--muted);padding:8px 24px 18px}.mc button:disabled{opacity:.5;cursor:default}@media(max-width:600px){.mc header{padding:16px 16px 8px}.mc h2{font-size:23px}.mc nav{padding:4px 14px 12px}.mc nav button{font-size:11px;padding:6px 8px}.mc-caption{padding:12px 16px;min-height:200px;font-size:14px}.mc-controls{padding:10px 14px;gap:9px}.mc-phase,.mc-legend,.mc-note{padding-inline:16px}.mc-controls button{font-size:13px}.mc-small{font-size:14px}.mc-label{font-size:16px}}`;

export default function MendelianScene({lang="he",processName,theme}:Props){
 const en=lang==="en",root=useRef<HTMLElement>(null),svg=useRef<SVGSVGElement>(null),clock=useRef(0),playing=useRef(true),looping=useRef(true),reduced=useRef(false),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduce,setReduce]=useState(false);const uid=useId().replace(/:/g,"");const chapter=chapterAt(time);
 useEffect(()=>{
 const host=root.current!,movie=svg.current!,nodes=new Map<string,SVGGElement>();movie.querySelectorAll<SVGGElement>('[data-move]').forEach(e=>nodes.set(e.dataset.move!,e));
 const q=<T extends Element=Element,>(s:string)=>movie.querySelector<T>(s)!;
 const mobile=matchMedia('(max-width:600px)'),media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,visible=true,docVisible=!document.hidden,ui=-1;
 const move=(id:string,p:Point,alpha=1,scale=1)=>{const n=nodes.get(id)!;n.setAttribute('transform',`translate(${p[0]} ${p[1]}) scale(${scale})`);n.setAttribute('opacity',String(clamp(alpha)))};
 const mono=q('[data-layer=mono]'),di=q('[data-layer=di]'),monoCount=q('[data-mono-count]'),diCount=q('[data-di-count]'),callout=q('[data-callout]'),leader=q<SVGPathElement>('[data-leader]'),target=q('[data-target]'),phase=host.querySelector('[data-phase]')!;
 function draw(time:number){
  clock.current=time;
  // The last ten seconds continuously retrace the lineage to the original parents.
  // This time remapping has zero velocity at both ends; there is no hidden reset.
  const t=time>146?mix(146,0,ramp(time,146,156)):time;
  const m=mobile.matches,w=m?400:960,reset=1;
  const monoHeight=mix(410,m?755:750,ramp(t,26,29));
  const diHeight=mix(mix(m?755:750,430,ramp(t,88,92)),m?835:840,ramp(t,101,106));
  const h=t<88?monoHeight:diHeight;
  // The original parents remain as a visible bridge while the labelled example grows in.
  movie.setAttribute('viewBox',`${m?0:120} 0 ${m?400:720} ${h}`);mono.setAttribute('opacity',String(1-ramp(t,86,90)));di.setAttribute('opacity',String(ramp(t,84,88)));
  const test=ramp(t,63,67)*reset,gridFade=ramp(t,29,34)*(1-test),size=m?114:155,gx=w/2-size,gy=m?386:330;
  for(let p=0;p<2;p++){
   const x=m?(p?290:110):(p?710:250),cy=m?270:255;
   move(`parent${p}`,[x,m?105:100],1-.48*test,1);nodes.get(`parent${p}`)!.querySelector('text')!.setAttribute('opacity',String((1-ramp(t,11,12)*(1-ramp(t,32,35)))*(1-ramp(t,82,84))));
   move(`cell${p}`,[x,cy],1-ramp(t,30,36));
   q(`[data-cell-shell="${p}"]`).setAttribute('rx',String(mix(67,90,ramp(t,14,22))));
   q(`[data-spindle="${p}"]`).setAttribute('d',`M-78 0 L${-20-42*ramp(t,15,21)} 0 M-78 0 L${-20-42*ramp(t,15,21)} 0 M78 0 L${20+42*ramp(t,15,21)} 0 M78 0 L${20+42*ramp(t,15,21)} 0`);
   q(`[data-spindle="${p}"]`).setAttribute('opacity',String(.5*(1-ramp(t,22,23))));
   move(`stageName${p}`,[x,cy+115],ramp(t,9,12)*(1-ramp(t,29,33)));
  }
  move('monoGrid',[gx,gy],gridFade,size/102);move('monoHeading',[w/2,gy-82],ramp(t,29,34)*(1-ramp(t,60,63)));
  q('[data-mono-headers]').setAttribute('opacity',String(ramp(t,43,45)));
  const counts=[0,0];
  for(let i=0;i<8;i++){const s=gameteState(t,i,m),node=nodes.get(`gamete${i}`)!;move(`gamete${i}`,s.point,s.alpha*(1-test),s.scale);node.querySelector('[data-shell]')!.setAttribute('opacity',String(s.shell));const labelAlpha=(i%2?ramp(t,26,27.5):1)*(1-ramp(t,28.5,29));node.querySelector('text')!.setAttribute('opacity',String(clamp(labelAlpha)));}
  for(let i=0;i<4;i++){
   const appear=ramp(t,46+i*2.6,48+i*2.6),x=gx+size*(i%2+.5),y=gy+size*(Math.floor(i/2)+.5);
   move(`offspring${i}`,[x,y],appear*(1-test)*(1-ramp(t,80,83)),m?.74:.96);nodes.get(`offspring${i}`)!.querySelector('[data-growth]')!.setAttribute('transform',`scale(${mix(.05,1,appear)})`);
   if(appear>.85)counts[i===3?1:0]++;
  }
  monoCount.textContent=isolateRuns(`${counts[0]} : ${counts[1]}`);move('monoRatio',[w/2,m?686:685],ramp(t,46,49)*(1-test));
  move('testTitle',[w/2,m?300:250],test*(1-ramp(t,80,83)));
  for(let i=0;i<2;i++){
   move(`test${i}`,[w/2,m?400+i*165:385+i*165],test*ramp(t,64+i*5,66+i*5)*(1-ramp(t,80,83)));
   for(let j=0;j<2;j++){const growth=ramp(t,70+i*5+j,72+i*5+j),node=q(`[data-test-child="${i}-${j}"]`);node.setAttribute('opacity',String(growth));node.setAttribute('transform',`translate(${j?55:-55} 90) scale(${.72*mix(.05,1,growth)})`)}
  }
  for(let i=0;i<8;i++){
   const row=Math.floor(i/4),j=i%4,which=j%2,maternal=j<2,begin=66+row*5+which;
   const a:Point=[w/2+(maternal?-120:120),(m?400+row*165:385+row*165)+35+which*30],b:Point=[w/2+(which?55:-55)+(maternal?-10:10)*(1-ramp(t,begin+2,begin+3)),(m?400+row*165:385+row*165)+90];
   move(`testGamete${i}`,lerp(a,b,ramp(t,begin,begin+2)),test*ramp(t,begin-.8,begin)*(1-ramp(t,begin+3,begin+4)));
   nodes.get(`testGamete${i}`)!.querySelector('text')!.setAttribute('opacity',String(1-ramp(t,begin+.7,begin+1.2)));
  }
  // The separate dihybrid example grows into the same stage; no SVG remounts.
  move('diTitle',[w/2,62]);
  const compact=ramp(t,106,113),cellY=m?228:225,cellX=[m?107:300,m?293:660],diSize=m?76:90,dx=w/2-2*diSize,dy=m?399:337;
  for(let o=0;o<2;o++){
   move(`diCell${o}`,[cellX[o],cellY],1-ramp(t,104,107),m?.88:1);
   for(let i=0;i<8;i++){
    const pair=i<4?0:1,j=i%4,hom=j<2?0:1,sister=j%2,side=(pair===1&&o===1?1-hom:hom)?1:-1;
    const sep=ramp(t,94,100),ii=ramp(t,101,105);
    let p:Point=[cellX[o]+side*(17+40*sep)+(sister?4:-4)*(1-ii),cellY+(pair?27:-27)+(sister?12:-12)*ii];
    const type=o===0?(side<0?0:3):(side<0?1:2),pool:Point=[w/2+(type-1.5)*(m?82:110)+(pair?5:-5),(m?270:220)+(sister?22:-22)];
    p=lerp(p,pool,ramp(t,105,110));
    move(`diChrom${o}-${i}`,p,1,mix(.56,.28,ramp(t,105,110)));nodes.get(`diChrom${o}-${i}`)!.querySelector('text')!.setAttribute('opacity',String((sister?ramp(t,104,104.7):1)*(1-ramp(t,105,106))));
   }
  }
  move('diOrientation',[w/2,m?365:353],1-ramp(t,104,106));
  for(let i=0;i<4;i++)move(`diPool${i}`,[w/2+(i-1.5)*(m?82:110),m?270:220],ramp(t,108,110));
  move('diGrid',[dx,dy],compact,diSize/72);
  const totals=[0,0,0,0];
  for(let i=0;i<32;i++){
   const parent=i<16?0:1,n=i%16,row=Math.floor(n/4),col=n%4,type=parent?row:col;
   const source:Point=[w/2+(type-1.5)*(m?82:110),(m?270:220)-22];
   const header:Point=parent?[dx-24,dy+(row+.5)*diSize]:[dx+(col+.5)*diSize,dy-25];
   const start=114+n*.95,travel=ramp(t,start,start+2),fuse=ramp(t,start+2,start+3.1),center:Point=[dx+(col+.5)*diSize+(parent?14:-14)*(1-fuse),dy+(row+.5)*diSize-3];
   let p=lerp(source,header,ramp(t,start-1.8,start));p=lerp(p,center,travel);
   // Multiple symbols are samples from many meioses, not copies of one gamete.
   const a=ramp(t,start-1.8,start-1)*(1-ramp(t,start+2.8,start+3.6));
   move(`diGamete${i}`,p,a,.78);nodes.get(`diGamete${i}`)!.querySelector('text')!.setAttribute('opacity','0');
  }
  for(let i=0;i<16;i++){
   const appear=ramp(t,117+i*.95,118.4+i*.95),g=offspringGenotype(i,true),category=!g.includes('A')?(!g.includes('B')?3:2):(!g.includes('B')?1:0);
   move(`diOffspring${i}`,[dx+(i%4+.5)*diSize,dy+(Math.floor(i/4)+.5)*diSize-(m?9:13)],appear, m?.45:.56);nodes.get(`diOffspring${i}`)!.querySelector('[data-growth]')!.setAttribute('transform',`translate(0 3) scale(${mix(.05,1,appear)})`);if(appear>.85)totals[category]++;
  }
  diCount.textContent=isolateRuns(totals.join(' : '));move('diRatio',[w/2,m?760:753],compact*ramp(t,116,119));
  // One leader at a time; its endpoint follows the exact locus or gamete.
  const ci=chapterAt(t);let cp:Point=[w/2,m?180:170],tp:Point=[(m?110:250)-24,(m?270:255)-12],label=en?'Same locus · A / a':'אותו לוקוס · A / a',ca=ramp(t,12,12.8)*(1-ramp(t,14,15));
  if(t>=15&&t<29){cp=[m?200:480,m?181:170];tp=gameteState(t,0,m).point;tp=[tp[0],tp[1]-12];label=en?(t<23?'I · homologs separate':'II · sisters separate'):(t<23?'I · הומולוגים נפרדים':'II · אחיות נפרדות');ca=ramp(t,15,16)*(1-ramp(t,23,24));}
  if(t>=32&&t<44){cp=[w/2,m?228:199];tp=gameteState(t,0,m).point;tp=[tp[0]+19*.62,tp[1]];label=en?'Same gamete → union':'אותה גמטה ← הפריה';ca=0;}
  if(t>=88&&t<105){cp=[w/2,134];tp=[cellX[0]-17-40*ramp(t,94,100)-4*(1-ramp(t,101,105)),cellY-27-12*ramp(t,101,105)-12*mix(.56,.28,ramp(t,105,110))];label=en?'Metaphase I → segregation':'מטאפאזה I ← היפרדות';ca=ramp(t,88,90)*(1-ramp(t,102,103));}
  move('callout',cp,ca*reset);callout.textContent=isolateRuns(label);leader.setAttribute('d',`M0 12 V20 H${tp[0]-cp[0]-24} V${tp[1]-cp[1]} H${tp[0]-cp[0]}`);target.setAttribute('cx',String(tp[0]-cp[0]));target.setAttribute('cy',String(tp[1]-cp[1]));
  phase.textContent=isolateRuns(en?(ci===1?(t<23?'Meiosis I · homologs move apart':'Meiosis II · sister chromatids separate'):ci===5?(t<94?'Two alternative metaphase-I arrangements':t<101?'Homologs segregate':'Four gamete classes across many meioses'):ci===6?'Offspring accumulate from separate possible unions':'One continuous lineage · probability model'):(ci===1?(t<23?'מיוזה I · ההומולוגים מתרחקים':'מיוזה II · הכרומטידות האחיות נפרדות'):ci===5?(t<94?'שתי אפשרויות סידור במטאפאזה I':t<101?'הומולוגים נפרדים':'ארבע מחלקות גמטות על פני מיוזות רבות'):ci===6?'הצאצאים מצטברים מאפשרויות הפריה נפרדות':'מסלול רציף · מודל הסתברותי'));
  host.dataset.time=time.toFixed(3);host.dataset.chapter=String(chapterAt(time));
 }
 function sync(t:number){draw(t);setTime(t);ui=t}
 seek.current=t=>{sync(Math.max(0,Math.min(DURATION,t)));last=0};
 function tick(now:number){raf=0;if(!playing.current||reduced.current||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min(.08,(now-last)/1000);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(ui-t)>.12||!playing.current){setTime(t);ui=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)}
 function resume(){last=0;if(!raf&&playing.current&&!reduced.current&&visible&&docVisible)raf=requestAnimationFrame(tick)}
 function preference(){reduced.current=media.matches;setReduce(media.matches);if(media.matches){cancelAnimationFrame(raf);raf=0;sync(CHAPTERS[chapterAt(clock.current)].still)}else resume()}
 function visibility(){docVisible=!document.hidden;if(!docVisible){cancelAnimationFrame(raf);raf=0}resume()}
 const resize=()=>draw(clock.current),observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0}resume()},{threshold:.05});observer.observe(host);
 host.addEventListener('mendel-play',resume);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);mobile.addEventListener('change',resize);preference();sync(clock.current);resume();
 return()=>{cancelAnimationFrame(raf);observer.disconnect();host.removeEventListener('mendel-play',resume);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);mobile.removeEventListener('change',resize)};
 },[en]);
 const jump=(t:number)=>seek.current(t),toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)jump(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('mendel-play'))};
 return <section ref={root} className="mc" dir={en?'ltr':'rtl'} data-theme={theme} aria-label={processName||(en?'Mendelian inheritance':'תורשה מנדלית')}>
  <style>{CSS}</style><header><div className="mc-kicker"><span>{en?'FROM ALLELES TO OFFSPRING':'מאללים לצאצאים'}</span><span>{reduce?(en?'Reduced-motion stills':'תמונות מפתח רגועות'):(en?'ONE CONTINUOUS MOVIE':'סרט אחד רציף')}</span></div><h2>{processName||(en?'The inheritance of a flower':'התורשה של פרח')}</h2></header>
  <nav aria-label={en?'Movie chapters':'פרקי הסרט'}>{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduce?c.still:c.start)}>{isolateRuns(`${i+1} · ${en?c.en:c.he}`)}</button>)}</nav>
  <svg ref={svg} className="mc-movie" viewBox="0 0 960 680" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}><title id={`${uid}-title`}>{en?'Mendelian inheritance in motion':'תורשה מנדלית בתנועה'}</title><desc id={`${uid}-desc`}>{en?'Two purple pea plants, homolog segregation, gamete union in an anchored Punnett square, phenotype ratios, testcross and a separate independent assortment example.':'שני צמחי אפונה סגולים, היפרדות הומולוגים, אותן גמטות בריבוע פאנט מעוגן, הפריה, צאצאים ויחסים; הכלאת מבחן ודוגמה נפרדת למיון בלתי תלוי.'}</desc><StaticArt en={en} uid={uid}/></svg>
  <p className="mc-caption" aria-live="polite" aria-atomic="true"><strong>{isolateRuns(en?CHAPTERS[chapter].en:CHAPTERS[chapter].he)}</strong>{isolateRuns(en?CHAPTERS[chapter].textEn:CHAPTERS[chapter].textHe)}</p><p className="mc-phase" data-phase=""/>
  <div className="mc-controls"><button onClick={toggle} disabled={reduce} aria-label={en?(running?'Pause':'Play'):(running?'השהיה':'ניגון')}>{running&&!reduce?(en?'❚❚ Pause':'❚❚ השהיה'):(en?'▶ Play':'▶ ניגון')}</button><input aria-label={en?'Movie position':'מיקום בסרט'} type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>jump(+e.target.value)}/><output>{isolateRuns(`${Math.floor(time).toString().padStart(3,'0')} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>{en?'Loop':'לולאה'}</label></div>
  <div className="mc-legend" aria-label={en?'Legend':'מקרא'}><span><i style={{background:'#527d9c'}}/>{en?'Homolog carrying A / B':isolateRuns('הומולוג נושא A / B')}</span><span><i style={{background:'#a36d63'}}/>{en?'Homolog carrying a / b':isolateRuns('הומולוג נושא a / b')}</span><span><i style={{background:'#ebcf85'}}/>{en?'Allele locus':'לוקוס האלל'}</span><span>{isolateRuns(en?'A/a: purple/white · B/b: green/yellow pod':'A/a: סגול/לבן · B/b: תרמיל ירוק/צהוב')}</span></div>
  <div className="mc-note">{en?'Original schematic art. Probabilities, not measured kinetics. Gamete symbols summarize spore → gametophyte → gamete development; each grid cell is a separate possible union.':'ציור מקורי וסכמטי. הסתברויות ולא קינטיקה מדודה. סמלי הגמטות מתמצתים התפתחות מנבג דרך גמטופיט לגמטה; כל תא בריבוע הוא אפשרות הפריה נפרדת.'}</div>
 </section>;
}
