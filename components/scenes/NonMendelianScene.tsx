"use client";
import React, {memo, useEffect, useId, useRef, useState} from 'react';

type Props={lang?:string;processName?:string;theme?:'light'|'dark'};
type Point=[number,number];
export const DURATION=138;
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ramp=(t:number,a:number,b:number)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u)};
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
const lerp=(a:Point,b:Point,u:number):Point=>[mix(a[0],b[0],u),mix(a[1],b[1],u)];
export const isolateRuns=(s:string)=>s.replace(/[\u2066\u2069]/g,'').replace(/[A-Za-z0-9¼½][A-Za-z0-9ᴬᴮᴿᵂ₁₂₃:¼½]*(?:[ ×+:/.−-]+[A-Za-z0-9¼½][A-Za-z0-9ᴬᴮᴿᵂ₁₂₃:¼½]*)*/g,s=>'\u2066'+s+'\u2069');
export const CHAPTERS=[
 {start:0,still:6,he:'אותם חוקי מנדל',en:'Same Mendelian laws',heText:'חוקי ההיפרדות והמיון הבלתי תלוי עדיין תקפים (בגנים בלתי תאחיזים). האללים מגיעים לגמטות כרגיל; הקשר בין גנוטיפ לפנוטיפ משתנה. שלוש הדוגמאות נשארות במקומן לאורך הסרט.',enText:'Segregation and independent assortment still apply (for unlinked genes). Alleles reach gametes as usual; the genotype–phenotype relationship changes. Three distinct examples remain in fixed places throughout.'},
 {start:8,still:22,he:'אדום × לבן → ורוד',en:'Red × white → pink',heText:'בלוע־ארי: CᴿCᴿ אדום × CᵂCᵂ לבן נותנים F1 ורוד, CᴿCᵂ. עותק אחד של Cᴿ מייצר פחות פיגמנט. שתי גמטות הוריות מתאחדות; הצמח הוורוד גדל כצאצא נפרד, בלי לשנות את זהות ההורים.',enText:'Snapdragons: red CᴿCᴿ × white CᵂCᵂ produce pink F1, CᴿCᵂ. One Cᴿ copy makes less pigment. Parental gametes unite; a separate pink offspring grows while the parents retain their identity.'},
 {start:26,still:47,he:'F2 · יחס 1:2:1',en:'F2 · 1:2:1',heText:'שני צמחי F1 ורודים מוכלאים: CᴿCᵂ × CᴿCᵂ. מכל הורה Cᴿ או Cᵂ בהסתברות ½. הגמטות ממלאות ארבע אפשרויות שוות הסתברות; היחס הצפוי הוא 1 אדום : 2 ורוד : 1 לבן, גם בגנוטיפים וגם בפנוטיפים. האללים לא התערבבו: אדום ולבן חוזרים ב־F2.',enText:'Cross two pink F1 plants, CᴿCᵂ × CᴿCᵂ. Each parent supplies Cᴿ or Cᵂ with probability ½. Four equally likely unions give 1 red : 2 pink : 1 white, for both genotype and phenotype. Alleles have not blended: red and white reappear in F2.'},
 {start:50,still:65,he:'AB · שני אנטיגנים',en:'AB · both antigens',heText:'בקו־דומיננטיות שני האללים מתבטאים במלואם. אנזימים המקודדים על ידי Iᴬ ו־Iᴮ מוסיפים סוכרים שונים לפני תאי דם אדומים. ב־IᴬIᴮ מופיעים יחד אנטיגנים A ו־B: סוג AB. ‏i רצסיבי לשניהם, ו־ii הוא O (ללא אנטיגני A/B). שלושה אללים באוכלוסייה, שניים לפרט: אללים מרובים. גם MN היא דוגמת קו־דומיננטיות.',enText:'In codominance both alleles are fully expressed. Enzymes encoded by Iᴬ and Iᴮ add distinct sugars to red-cell surfaces. IᴬIᴮ displays both A and B antigens: type AB. i is recessive to both; ii is O (no A/B antigens). Three population alleles, two per person: multiple alleles. MN is another codominant system.'},
 {start:68,still:86,he:'ABO · ארבעה סוגי דם',en:'ABO · four blood types',heText:'הכלאה לדוגמה: Iᴬi × Iᴮi. מכל הורה שני סוגי גמטות ביחס 1:1. ארבע אפשרויות: IᴬIᴮ → AB, ‏Iᴬi → A, ‏Iᴮi → B, ‏ii → O; לכל סוג הסתברות ¼. תאי הדם ממחישים פנוטיפ בלבד: תאי דם אדומים בוגרים באדם אינם מכילים גרעין ואינם יוצרים גמטות.',enText:'Example cross: Iᴬi × Iᴮi. Each parent supplies two gamete classes, 1:1. IᴬIᴮ → AB, Iᴬi → A, Iᴮi → B, ii → O: each has probability ¼. Blood cells show phenotype only: mature human red cells have no nucleus and do not make gametes.'},
 {start:90,still:106,he:'כמה לוקוסים מצטברים',en:'Several additive loci',heText:'בדגם לימודי של שלושה לוקוסים בלתי תאחיזים: AaBbCc × AaBbCc. כל אלל גדול מוסיף מנת פיגמנט שווה, ללא דומיננטיות או אפיסטזיס בדגם. הלוקוסים תורמים בזה אחר זה לצבע. תכונות אמיתיות כמו גובה וגוון עור מערבות גנים רבים והשפעת סביבה.',enText:'A teaching model with three unlinked loci: AaBbCc × AaBbCc. Each uppercase allele adds an equal pigment dose, with no dominance or epistasis in this model. Loci contribute in sequence. Real traits such as height and skin tone involve many genes and environmental effects.'},
 {start:108,still:125,he:'התפלגות דמוית פעמון',en:'A bell-shaped distribution',heText:'במודל התלת־גני יש 7 מחלקות, 0–6 אללים תורמי פיגמנט, ביחס 1:6:15:20:15:6:1 (מתוך 64 אפשרויות). העמודות נבנות אחת אחת. זהו עדיין מודל בדיד; ריבוי גנים והשפעת הסביבה יכולים ליצור התפלגות רציפה ודמוית פעמון. היחסים הם תוחלת, לא הבטחה למשפחה קטנה. סוף הלולאה הוא חזרה גרפית לאחור, לא תהליך ביולוגי הפיך.',enText:'The three-locus model has 7 classes, 0–6 pigment-contributing alleles, in a 1:6:15:20:15:6:1 ratio (64 possibilities). Bars grow sequentially. This model is discrete; many genes plus environment can yield a continuous, bell-shaped distribution. Ratios are expectations, not guarantees for small families. The loop ending graphically retraces events; biology is not reversed.'}
] as const;
export const chapterAt=(t:number)=>Math.max(0,CHAPTERS.findLastIndex(c=>t>=c.start));
export const POLY_COUNTS=[1,6,15,20,15,6,1];
const FLOWER_GENES=['CᴿCᴿ','CᴿCᵂ','CᴿCᵂ','CᵂCᵂ'];
const BLOOD_GENES=['IᴬIᴮ','Iᴮi','Iᴬi','ii'];
const BLOOD_TYPES=['AB','B','A','O'];
function Label({children,...props}:React.SVGProps<SVGTextElement>&{children:string}){return <text textAnchor="middle" {...props}>{isolateRuns(children)}</text>}

/** Original snapdragon raceme; the stem, leaves and muted shading match the Mendelian film. */
function Flower({tone='pink',small=false}:{tone?:'red'|'pink'|'white';small?:boolean}){
 const c=tone==='red'?'#bd4f5c':tone==='pink'?'#e7a2b4':'#eff1e5',edge=tone==='red'?'#813b4b':tone==='pink'?'#a66681':'#8a9b92';
 return <g data-part="flower" transform={small?'scale(.64)':'scale(1)'}><path d="M0 44 Q-5 0 0 -42" fill="none" stroke="#608566" strokeWidth="3" strokeLinecap="round"/><path d="M-1 26 C-30 30 -36 9 -14 13 Q-3 15 -1 26 M0 13 C26 19 37 -3 16 1 Q4 4 0 13" fill="#91b38a" stroke="#507d5b" strokeWidth="1.3"/>{[[-10,-17,1],[10,-34,-1],[-5,-50,1]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s} 1)`}><path d="M0 12 C-15 5 -23 -7 -14 -17 C-9 -24 -2 -20 3 -13 C8 -28 20 -23 22 -13 C27 -1 11 8 0 12Z" fill={c} stroke={edge} strokeWidth="1.4"/><path d="M-14 -8 Q-1 -1 14 -11 Q24 0 5 8 Q-5 10 -14 -8Z" fill={c} stroke={edge} strokeWidth="1.2"/><path d="M-7 -6 Q2 -1 9 -5" fill="none" stroke={tone==='white'?'#d2cf94':'#f4cfbf'} strokeWidth="3"/><path d="M-15 -14 Q-13 -20 -7 -16" fill="none" stroke="#fff" strokeOpacity=".38" strokeWidth="2"/><path d="M-1 11 L-8 14 L-3 7 L4 11 L8 7 L8 13" fill="#658a60" stroke="#507d5b" strokeWidth="1"/></g>)}<path d="M-21 46 Q0 41 22 46" stroke="#a9b39a" strokeWidth="1.5" fill="none"/></g>
}
function Chromosome({blue=false}:{blue?:boolean}){return <g data-part="chromosome"><path d="M0 -12 C-5 -5 -3 -3 0 0 S4 8 0 13" stroke={blue?'#527d9c':'#a36d63'} strokeWidth="5" fill="none" strokeLinecap="round"/><path d="M-4 -5 H4" stroke="#ebcf85" strokeWidth="3"/><circle r="1.9" fill="#eee0b5"/></g>}
/** Antigens are distinct shapes as well as colors. They never become flower petals. */
function BloodCell({type,uid,animated=false}:{type:string;uid:string;animated?:boolean}){return <g data-part="blood-cell"><ellipse rx="28" ry="22" fill={`url(#${uid}-rbc)`} stroke="#973f50" strokeWidth="1.5"/><ellipse rx="14" ry="10" fill="none" stroke="#a95663" strokeWidth="2" opacity=".7"/><path d="M-20 -10 Q-8 -23 10 -14" fill="none" stroke="#f5b2aa" strokeWidth="2" opacity=".65"/>{Array.from({length:10},(_,i)=>{const a=i*Math.PI/5,x=Math.cos(a)*29,y=Math.sin(a)*23,isA=type==='A'||(type==='AB'&&i%2===0),show=type==='AB'||type==='A'||type==='B';return show?<g key={i} data-antigen={animated?(isA?'A':'B'):undefined} transform={`translate(${x} ${y}) rotate(${i*36})`}><path d="M-5 0 H1" stroke={isA?'#5b907d':'#728fb9'} strokeWidth="2"/>{isA?<path d="M0 0 L6 -5 L10 2 L3 5Z" fill="#9bbf99" stroke="#426c56"/>:<circle cx="5" r="4" fill="#a1bddd" stroke="#4f6f9c"/>}</g>:null})}</g>}
function Grid({blood=false}:{blood?:boolean}){const headers=blood?['Iᴬ','i','Iᴮ','i']:['Cᴿ','Cᵂ','Cᴿ','Cᵂ'];return <g data-part="grid">{[0,1,2].map(i=><path key={i} d={`M${i*95} 0 V190 M0 ${i*95} H190`} stroke="var(--line)" strokeWidth="1.25"/>)}{headers.map((s,i)=><Label key={i} x={i<2?47.5+(i%2)*95:-24} y={i<2?-14:52+(i%2)*95} className="nm-gene">{s}</Label>)}</g>}
const Art=memo(function Art({en,uid}:{en:boolean;uid:string}){return <>
 <defs><radialGradient id={`${uid}-rbc`}><stop stopColor="#c96d78"/><stop offset=".48" stopColor="#d78688"/><stop offset=".75" stopColor="#b95263"/><stop offset="1" stopColor="#de9394"/></radialGradient></defs>
 {[0,1,2].map(p=><g key={p} data-panel={p}><rect x="1" y="1" width="308" height="638" rx="17" fill="var(--panel)" stroke="var(--line)"/><Label x="155" y="32" className="nm-title">{en?['Incomplete dominance','Codominance · ABO','Polygenic inheritance'][p]:['דומיננטיות חלקית','קו־דומיננטיות · ABO','תורשה פוליגנית'][p]}</Label><Label x="155" y="55" className="nm-muted">{en?['One locus · intermediate','One locus · both expressed','Several loci · additive'][p]:['לוקוס אחד · פנוטיפ ביניים','לוקוס אחד · ביטוי של שניהם','כמה לוקוסים · תרומה מצטברת'][p]}</Label></g>)}
 <g data-panel-art="0">
 {[0,1].map(p=><g key={p} data-move={`original${p}`}><g transform="scale(.9)"><Flower tone={p?'white':'red'}/></g><Label y="69" className="nm-gene">{p?'CᵂCᵂ':'CᴿCᴿ'}</Label><g transform="translate(-9 89)"><Chromosome blue={!p}/></g><g transform="translate(9 89)"><Chromosome blue={!p}/></g></g>)}
 <Label x="155" y="128" className="nm-cross">×</Label>
 {[0,1].map(p=><g key={p} data-move={`f1-${p}`}><g transform="scale(.80)"><Flower tone="pink" small/></g><Label y="45" className="nm-gene">{'F1 · CᴿCᵂ'}</Label><g transform="translate(-8 64)"><Chromosome blue/></g><g transform="translate(8 64)"><Chromosome/></g></g>)}
 <g data-move="f1-cross"><Label className="nm-cross">×</Label></g>
 <g data-move="flowerGrid"><Grid/></g>
 {[0,1,2,3].map(i=><g key={i} data-move={`flowerChild${i}`}><g transform="scale(.70)"><Flower tone={i===0?'red':i===3?'white':'pink'} small/></g><Label y="44" className="nm-gene">{FLOWER_GENES[i]}</Label></g>)}
 <g data-move="flowerRatio"><Label data-flower-count="" className="nm-ratio">0 : 0 : 0</Label><Label y="24" className="nm-muted">{en?'red : pink : white':'אדום : ורוד : לבן'}</Label></g>
 {[0,1].map(p=><g key={p} data-move={`pGamete${p}`}><circle r="13" fill="var(--egg)" stroke="#a28b57"/><Chromosome blue={!p}/></g>)}
 {Array.from({length:8},(_,i)=><g key={i} data-move={`fGamete${i}`} data-token={`f-${i}`}><circle r="12" fill="var(--egg)" stroke="#a28b57"/><Chromosome blue={(i<4?i%2:Math.floor((i%4)/2))===0}/></g>)}
 <g data-move="flowerLeader"><Label className="nm-muted">{en?'Separate alleles':'אללים נפרדים'}</Label><path data-leader="flower" d="M0 8 H-62 V-10" stroke="var(--muted)" fill="none"/><circle cx="-62" cy="-10" r="2" fill="var(--muted)"/></g>
 </g>
 <g data-panel-art="1">
 {[0,1].map(p=><g key={p} data-move={`bloodParent${p}`}><BloodCell type={p?'B':'A'} uid={uid} animated/><Label y="55" className="nm-gene">{p?'Iᴮi · B':'Iᴬi · A'}</Label></g>)}
 <Label x="155" y="124" className="nm-cross">×</Label>
 <g data-move="abDemo"><BloodCell type="AB" uid={uid} animated/><Label y="52" className="nm-gene">{'IᴬIᴮ · AB'}</Label></g>
 <g data-move="antigenLegend"><path d="M-66 0 l6 -5 4 7 -7 3Z" fill="#9bbf99" stroke="#426c56"/><Label x="-42" y="5" className="nm-gene">A</Label><circle cx="40" r="4" fill="#a1bddd" stroke="#4f6f9c"/><Label x="61" y="5" className="nm-gene">B</Label></g>
 <g data-move="bloodLeader"><Label className="nm-muted">{en?'Surface sugars · both':'סוכרי מעטפת · שניהם'}</Label><path data-leader="blood" d="M0 10 V16 H27.5 V33.5" fill="none" stroke="var(--muted)"/><circle cx="27.5" cy="33.5" r="2" fill="var(--muted)"/></g>
 <g data-move="bloodGrid"><Grid blood/></g>
 {[0,1,2,3].map(i=><g key={i} data-move={`bloodChild${i}`}><g transform="scale(.76)"><BloodCell type={BLOOD_TYPES[i]} uid={uid}/></g><Label y="42" className="nm-gene">{BLOOD_GENES[i]}</Label><Label y="-34" className="nm-gene">{BLOOD_TYPES[i]}</Label></g>)}
 {Array.from({length:8},(_,i)=><g key={i} data-move={`bGamete${i}`} data-token={`b-${i}`}><circle r="12" fill="var(--egg)" stroke="#a28b57"/><Chromosome blue={(i<4?i%2:Math.floor((i%4)/2))===0}/></g>)}
 <g data-move="bloodRatio"><Label className="nm-ratio">{'AB : A : B : O'}</Label><Label y="25" className="nm-muted">{en?'¼ each · expected':'¼ לכל סוג · תוחלת'}</Label></g>
 </g>
 <g data-panel-art="2">
 <g data-move="polyParents"><Label className="nm-gene">{'AaBbCc × AaBbCc'}</Label><Label y="25" className="nm-muted">{en?'3 unlinked loci · equal doses':'3 לוקוסים בלתי תאחיזים · מנות שוות'}</Label></g>
 {[0,1,2].map(l=><g key={l} data-move={`locus${l}`}><g transform="translate(-9 0)"><Chromosome blue/></g><g transform="translate(9 0)"><Chromosome/></g><Label y="34" className="nm-gene">{['Aa','Bb','Cc'][l]}</Label></g>)}
 <g data-move="pigmentWell"><circle r="39" fill="var(--egg)" stroke="var(--line)"/><circle data-pigment-wash="" r="34" fill="#b5687d" opacity="0"/>{Array.from({length:27},(_,i)=><circle key={i} data-pigment-dot={i} cx={Math.cos(i*2.4)*Math.sqrt(i+1)*5} cy={Math.sin(i*2.4)*Math.sqrt(i+1)*5} r="2.6" fill="#9d4c68"/>)}<Label y="65" className="nm-muted">{en?'Pigment accumulates':'הפיגמנט מצטבר'}</Label></g>
 {[0,1,2].map(l=><g key={l} data-move={`dose${l}`}><path d="M-5 -5 Q0 -14 5 -5 L8 7 Q0 13 -8 7Z" fill="#bb7289" stroke="#884a65"/></g>)}
 <g data-move="polyLeader"><Label className="nm-muted">{en?'Each adds a dose':'כל אחד מוסיף מנה'}</Label><path data-leader="poly" d="M0 10 V21 H-39 V61" fill="none" stroke="var(--muted)"/><circle cx="-39" cy="61" r="2" fill="var(--muted)"/></g>
 <g data-move="histogram"><path d="M0 0 H252 M0 0 V-145" stroke="var(--line)" fill="none"/>{POLY_COUNTS.map((n,i)=><g key={i} transform={`translate(${i*36+5} 0)`}><rect data-bar={i} x="0" y="0" width="26" height="0" rx="3" fill={['#e6d4c6','#d6b5ab','#c69596','#b67885','#a25c75','#8b4565','#713653'][i]} stroke="var(--muted)" strokeWidth=".7"/><Label data-bar-count={i} x="13" y="-8" className="nm-gene">{String(n)}</Label><Label x="13" y="23" className="nm-gene">{String(i)}</Label></g>)}<path data-bell="" d="M5 -8 C40 -8 58 -50 80 -84 S110 -141 126 -141 S150 -115 172 -84 S213 -8 247 -8" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 4"/><Label x="126" y="48" className="nm-muted">{en?'0–6 contributing alleles':'0–6 אללים תורמי פיגמנט'}</Label></g>
 <g data-move="polyRatio"><Label className="nm-gene">{'1 : 6 : 15 : 20 : 15 : 6 : 1'}</Label><Label y="26" className="nm-muted">{en?'7 discrete classes · 64 possibilities':'7 מחלקות בדידות · 64 אפשרויות'}</Label><Label y="53" className="nm-muted">{en?'Many genes + environment → continuous':'ריבוי גנים + סביבה ← רציפות'}</Label></g>
 </g>
 </>});

const CSS=`.nm{--paper:#f6f7f1;--panel:#f2f4ec;--ink:#293f43;--muted:#5e7475;--line:#b3c3b9;--egg:#eee3bf;--button:#eef2e9;--accent:#4c7f6c;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:19px;overflow:hidden;font:15px/1.7 system-ui,sans-serif;isolation:isolate}.nm[data-theme=dark]{--paper:#17292e;--panel:#1c3034;--ink:#e2eae0;--muted:#adc2bc;--line:#466361;--egg:#5c5944;--button:#233b3e;--accent:#a5c5ae}@media(prefers-color-scheme:dark){.nm:not([data-theme=light]){--paper:#17292e;--panel:#1c3034;--ink:#e2eae0;--muted:#adc2bc;--line:#466361;--egg:#5c5944;--button:#233b3e;--accent:#a5c5ae}}.nm *{box-sizing:border-box}.nm header{padding:22px 24px 10px}.nm h2{font-size:25px;margin:7px 0;line-height:1.35}.nm-kicker{display:flex;justify-content:space-between;gap:12px;font-size:12px;color:var(--muted)}.nm nav{display:flex;gap:6px;padding:4px 24px 12px;flex-wrap:wrap}.nm button{font:inherit;border:1px solid var(--line);border-radius:8px;background:var(--button);color:var(--ink);padding:6px 10px;cursor:pointer}.nm nav button{font-size:12px}.nm button[aria-current=true]{border-color:var(--accent);box-shadow:inset 0 -2px var(--accent)}.nm button:focus-visible,.nm input:focus-visible{outline:3px solid var(--accent);outline-offset:2px}.nm button:disabled{opacity:.5;cursor:default}.nm-movie{width:100%;height:auto;display:block;direction:ltr}.nm text{fill:var(--ink);font-family:system-ui,sans-serif;direction:rtl;unicode-bidi:plaintext}.nm-title{font-size:18px;font-weight:700}.nm-muted{font-size:14px;fill:var(--muted)!important}.nm-gene{font-size:14px;font-weight:650}.nm-cross{font-size:22px;fill:var(--muted)!important}.nm-ratio{font-size:23px;font-weight:750}.nm-caption{padding:14px 24px 8px;min-height:146px;margin:0;border-top:1px solid var(--line)}.nm-caption strong{display:block;color:var(--accent)}.nm-controls{padding:10px 24px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;direction:rtl}.nm-controls input[type=range]{flex:1;min-width:100px;direction:ltr;accent-color:var(--accent)}.nm-controls output{font:12px ui-monospace,monospace;white-space:nowrap}.nm-controls label{font-size:12px;display:flex;align-items:center;gap:4px}.nm-note{padding:8px 24px 18px;color:var(--muted);font-size:12px}.nm-legend{padding:6px 24px;color:var(--muted);font-size:12px}@media(max-width:600px){.nm header{padding:16px 16px 8px}.nm h2{font-size:23px}.nm nav{padding:4px 14px 12px}.nm nav button{font-size:11px;padding:6px 8px}.nm-caption{padding:12px 16px;min-height:245px;font-size:14px}.nm-controls{padding:10px 14px;gap:9px}.nm-note,.nm-legend{padding-inline:16px}.nm-muted{font-size:14px}}`;

export default function NonMendelianScene({lang='he',processName,theme}:Props){
 const en=lang==='en',root=useRef<HTMLElement>(null),svg=useRef<SVGSVGElement>(null),clock=useRef(0),playing=useRef(true),looping=useRef(true),reduced=useRef(false),seek=useRef<(t:number)=>void>(()=>{});
 const [time,setTime]=useState(0),[running,setRunning]=useState(true),[loop,setLoop]=useState(true),[reduce,setReduce]=useState(false),uid=useId().replace(/:/g,'');
 const chapter=chapterAt(time);
 useEffect(()=>{
  const host=root.current!,movie=svg.current!,nodes=new Map<string,SVGGElement>();movie.querySelectorAll<SVGGElement>('[data-move]').forEach(e=>nodes.set(e.dataset.move!,e));
  const q=<T extends Element=Element,>(s:string)=>movie.querySelector<T>(s)!;
  const panels=[0,1,2].map(i=>q<SVGGElement>(`[data-panel="${i}"]`)),art=[0,1,2].map(i=>q<SVGGElement>(`[data-panel-art="${i}"]`));
  const mobile=matchMedia('(max-width:600px)'),media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,visible=true,docVisible=!document.hidden,ui=-1;
  const move=(id:string,p:Point,a=1,s=1)=>{const n=nodes.get(id)!;n.setAttribute('transform',`translate(${p[0]} ${p[1]}) scale(${s})`);n.setAttribute('opacity',String(clamp(a)))};
  function draw(raw:number){
   clock.current=raw;
   // A visible eased retrace closes the loop; no opaque wipe or hidden reset.
   const t=raw>128?mix(128,0,ramp(raw,128,DURATION)):raw;
   const m=mobile.matches;movie.setAttribute('viewBox',m?'0 0 350 1986':'0 0 960 665');
   for(let i=0;i<3;i++){
    const x=m?20:640-i*315,y=m?8+i*656:12,transform=`translate(${x} ${y})`;
    panels[i].setAttribute('transform',transform);art[i].setAttribute('transform',transform);
    const focus=i===0?1-.24*ramp(t,48,52):i===1?.76+.24*ramp(t,48,52)-.24*ramp(t,88,92):.76+.24*ramp(t,88,92);
    // Inactive examples stay legible; only their motion is activated in sequence.
    art[i].setAttribute('opacity',String(focus));panels[i].setAttribute('opacity',String(.78+.22*focus));
   }
   const f1=ramp(t,17,22),grid=ramp(t,26,29);
   for(let p=0;p<2;p++){
    move(`original${p}`,[p?237:73,129]);
    move(`f1-${p}`,[p?225:85,268],f1*(p?ramp(t,23,25):1));
    const u=ramp(t,9,17);move(`pGamete${p}`,lerp([p?237:73,218],[85+(p?6:-6)*(1-ramp(t,16,18)),258],u),ramp(t,8,9)*(1-ramp(t,18,20)),.8);
   }
   move('f1-cross',[155,266],ramp(t,24,26));move('flowerGrid',[69,378],grid);
   const flowerCount=[0,0,0];
   for(let i=0;i<4;i++){
    const x=116.5+(i%2)*95,y=425.5+Math.floor(i/2)*95,appear=ramp(t,33+i*3,35+i*3);
    move(`flowerChild${i}`,[x,y-1],appear,mix(.05,1,appear));if(appear>.85)flowerCount[i===0?0:i===3?2:1]++;
    for(let p=0;p<2;p++){
     const start=28+i*3,j=p*4+i,source:Point=[p?225:85,332],header:Point=p?[45,y]:[x,354],u=ramp(t,start+1,start+4);
     const pos=lerp(lerp(source,header,ramp(t,start-1,start+1)),[x+(p?7:-7)*(1-ramp(t,start+3,start+4)),y-9],u);
     move(`fGamete${j}`,pos,ramp(t,start-1,start)*(1-ramp(t,start+4,start+6)),.67);
    }
   }
   q('[data-flower-count]').textContent=isolateRuns(flowerCount.join(' : '));move('flowerRatio',[155,597],ramp(t,34,36));
   move('flowerLeader',[155,337],ramp(t,26,27)*(1-ramp(t,28,29)));
   for(let p=0;p<2;p++)move(`bloodParent${p}`,[p?237:73,123]);
   move('abDemo',[155,259]);move('antigenLegend',[155,330]);
   const antigen=ramp(t,52,62);movie.querySelectorAll<SVGGElement>('[data-antigen]').forEach(e=>e.setAttribute('opacity',String(ramp(antigen, e.dataset.antigen==='B'?.35:0,e.dataset.antigen==='B'?1:.65))));
   move('bloodLeader',[155,209],ramp(t,51,53)*(1-ramp(t,63,65)));
   move('bloodGrid',[69,378],ramp(t,68,71));
   for(let i=0;i<4;i++){
    const x=116.5+i%2*95,y=425.5+Math.floor(i/2)*95,appear=ramp(t,74+i*3,76+i*3);
    move(`bloodChild${i}`,[x,y-1],appear,mix(.05,1,appear));
    for(let p=0;p<2;p++){
     const start=69+i*3,source:Point=[p?237:73,192],header:Point=p?[45,y]:[x,354];
     move(`bGamete${p*4+i}`,lerp(lerp(source,header,ramp(t,start-1,start+1)),[x+(p?7:-7)*(1-ramp(t,start+3,start+4)),y],ramp(t,start+1,start+4)),ramp(t,start-1,start)*(1-ramp(t,start+4,start+6)),.67);
    }
   }
   move('bloodRatio',[155,598],ramp(t,84,87));
   move('polyParents',[155,105]);
   for(let l=0;l<3;l++){
    const start=92+l*4;move(`locus${l}`,[65+l*90,165]);
    move(`dose${l}`,lerp([65+l*90,211],[155,278],ramp(t,start,start+4)),ramp(t,start-1,start)*(1-ramp(t,start+4,start+5)));
   }
   move('pigmentWell',[155,279]);const doses=[0,1,2].map(l=>ramp(t,95+l*4,97+l*4)),pigment=doses.reduce((a,b)=>a+b,0)/3;
   q('[data-pigment-wash]').setAttribute('opacity',String(.55*pigment));movie.querySelectorAll('[data-pigment-dot]').forEach((e,i)=>e.setAttribute('opacity',String(doses[Math.floor(i/9)])));
   move('polyLeader',[155,218],ramp(t,91,92)*(1-ramp(t,93,94)));
   move('histogram',[29,510]);for(let i=0;i<7;i++){
    const u=ramp(t,109+i*1.8,112+i*1.8),h=POLY_COUNTS[i]*6.4*u,bar=q(`[data-bar="${i}"]`),label=q(`[data-bar-count="${i}"]`);
    bar.setAttribute('y',String(-h));bar.setAttribute('height',String(h));label.setAttribute('y',String(-h-9));label.setAttribute('opacity',String(u));
   }
   q('[data-bell]').setAttribute('opacity',String(.7*ramp(t,122,126)));move('polyRatio',[155,578],ramp(t,122,125));
   host.dataset.time=raw.toFixed(3);host.dataset.chapter=String(chapterAt(raw));
  }
  function sync(t:number){draw(t);setTime(t);ui=t}
  seek.current=t=>{sync(Math.max(0,Math.min(DURATION,t)));last=0};
  function tick(now:number){raf=0;if(!playing.current||reduced.current||!visible||!docVisible){last=0;return}if(last){let t=clock.current+Math.min(.08,(now-last)/1000);if(t>=DURATION){if(looping.current)t%=DURATION;else{t=DURATION;playing.current=false;setRunning(false)}}draw(t);if(Math.abs(ui-t)>.12||!playing.current){setTime(t);ui=t}}last=now;if(playing.current)raf=requestAnimationFrame(tick)}
  function resume(){last=0;if(!raf&&playing.current&&!reduced.current&&visible&&docVisible)raf=requestAnimationFrame(tick)}
  function preference(){reduced.current=media.matches;setReduce(media.matches);if(media.matches){cancelAnimationFrame(raf);raf=0;sync(CHAPTERS[chapterAt(clock.current)].still)}else resume()}
  function visibility(){docVisible=!document.hidden;if(!docVisible){cancelAnimationFrame(raf);raf=0}resume()}
  const resize=()=>draw(clock.current),observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0}resume()},{threshold:0});observer.observe(host);
  host.addEventListener('nonmendel-play',resume);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',preference);mobile.addEventListener('change',resize);sync(clock.current);preference();resume();
  return()=>{cancelAnimationFrame(raf);observer.disconnect();host.removeEventListener('nonmendel-play',resume);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',preference);mobile.removeEventListener('change',resize)};
 },[en]);
 const jump=(t:number)=>seek.current(t),toggle=()=>{playing.current=!playing.current;if(playing.current&&clock.current>=DURATION)jump(0);setRunning(playing.current);root.current?.dispatchEvent(new Event('nonmendel-play'))};
 return <section ref={root} className="nm" dir={en?'ltr':'rtl'} data-theme={theme} aria-label={processName||(en?'Non-Mendelian inheritance':'תורשה לא־מנדלית')}>
 <style>{CSS}</style><header><div className="nm-kicker"><span>{en?'FROM ALLELES TO PHENOTYPES':'מאללים לפנוטיפים'}</span><span>{reduce?(en?'Reduced-motion stills':'תמונות מפתח רגועות'):(en?'ONE CONTINUOUS MOVIE':'סרט אחד רציף')}</span></div><h2>{processName||(en?'Same alleles, more possibilities':'אותם אללים, יותר אפשרויות')}</h2></header>
 <nav aria-label={en?'Movie chapters':'פרקי הסרט'}>{CHAPTERS.map((c,i)=><button key={c.start} aria-current={chapter===i} onClick={()=>jump(reduce?c.still:c.start)}>{isolateRuns(`${i+1} · ${en?c.en:c.he}`)}</button>)}</nav>
 <svg ref={svg} className="nm-movie" viewBox="0 0 960 665" role="img" aria-labelledby={`${uid}-title ${uid}-desc`}><title id={`${uid}-title`}>{en?'Non-Mendelian inheritance in continuous motion':'תורשה לא־מנדלית בתנועה רציפה'}</title><desc id={`${uid}-desc`}>{en?'Three persistent examples: snapdragon parents, pink F1 and F2 Punnett grid; distinct blood cells with A and B surface antigens and an ABO cross; three additive loci, pigment doses and seven offspring-frequency bars.':'שלוש דוגמאות קבועות: לוע־ארי אדום ולבן, צאצאי F1 ורודים וריבוע F2; תאי דם נפרדים עם אנטיגני A ו־B והכלאת ABO; שלושה לוקוסים מצטברים, מנות פיגמנט ושבע עמודות שכיחות צאצאים.'}</desc><Art en={en} uid={uid}/></svg>
 <p className="nm-caption" aria-live="polite" aria-atomic="true"><strong>{isolateRuns(en?CHAPTERS[chapter].en:CHAPTERS[chapter].he)}</strong>{isolateRuns(en?CHAPTERS[chapter].enText:CHAPTERS[chapter].heText)}</p>
 <div className="nm-controls"><button onClick={toggle} disabled={reduce} aria-label={en?(running?'Pause':'Play'):(running?'השהיה':'ניגון')}>{running&&!reduce?(en?'❚❚ Pause':'❚❚ השהיה'):(en?'▶ Play':'▶ ניגון')}</button><input aria-label={en?'Movie position':'מיקום בסרט'} type="range" min="0" max={DURATION} step=".01" value={time} onChange={e=>jump(+e.target.value)}/><output>{isolateRuns(`${Math.floor(time).toString().padStart(3,'0')} / ${DURATION}`)}</output><label><input type="checkbox" checked={loop} onChange={e=>{setLoop(e.target.checked);looping.current=e.target.checked}}/>{en?'Loop':'לולאה'}</label></div>
 <div className="nm-legend">{isolateRuns(en?'◆ A antigen · ● B antigen · gold band: locus · pale circles: gamete samples':'◆ אנטיגן A · ● אנטיגן B · פס זהוב: לוקוס · עיגולים בהירים: דגימות גמטות')}</div>
 <div className="nm-note">{en?'Original schematic art. Each grid cell is a separate possible union; expected ratios, not a measured sample. Chromosomes denote alleles in parental germ lines, not in red cells. Plant gametes develop through spores and gametophytes. Loop retrace is graphical only.':'איור מקורי וסכמטי. כל תא בריבוע הוא אפשרות הפריה נפרדת; יחסים צפויים ולא מדגם מדוד. הכרומוזומים מסמנים אללים בשושלת הנבט ההורית, לא בתאי הדם. בצמח גמטות מתפתחות דרך נבגים וגמטופיטים. החזרה בלולאה גרפית בלבד.'}</div>
 </section>;
}


