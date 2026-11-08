import {Plate,IC,La} from './geometry/six';
import {Callout} from './geometry/next-six';
const label="הריבוזום: תת-היחידה הגדולה (למעלה) ותת-היחידה הקטנה (למטה) על ה-mRNA. שני tRNA באתרים P ו-A; הקשר הפפטידי נוצר במרכז הפפטידיל-טרנספראז, שהליבה הקטליטית שלו בנויה מ-rRNA. השרשרת החדשה יוצאת דרך מנהרה בתת-היחידה הגדולה.";

function Draw({id}:{id:string}){return <>
<path d="M138 87Q125 55 160 48Q173 17 209 34Q235 5 271 29Q314 8 341 37Q379 20 399 53Q441 48 451 82Q481 93 470 125Q493 160 464 187Q464 220 423 222L170 222Q126 224 123 193Q91 180 108 151Q90 115 138 87Z" fill={`url(#${id}-blue)`} stroke={IC.blue} strokeWidth={2.5}/>
{Array.from({length:12},(_,i)=>{const x=142+(i%4)*77,y=65+Math.floor(i/4)*49;return <path key={i} d={`M${x} ${y}q-16-13-23 4t23 19t33-6t-11-21q-17-4-9 15`} fill="none" stroke={IC.blue} opacity={.65} strokeWidth={2}/>;})}
<path d="M158 245Q137 267 165 290Q189 321 235 303Q270 319 301 303Q335 320 365 303Q411 307 432 284Q454 255 420 245Q284 225 158 245Z" fill={`url(#${id}-green)`} stroke={IC.green} strokeWidth={2.5}/>
{[185,237,355,399].map((x,i)=><path key={i} d={`M${x} 267q15-19 27 0t-14 20`} stroke={IC.green} strokeWidth={2} fill="none"/>)}
<path d="M65 293Q149 285 196 285H396Q446 286 504 294" stroke={IC.gold} strokeWidth={7} fill="none" strokeLinecap="round"/>
<path d="M261 144Q255 117 266 99Q273 75 260 49V22" fill="none" stroke="#edf5fa" strokeWidth={23}/>
<path d="M253 144Q249 117 258 97Q266 74 252 48M270 143Q265 117 274 98Q281 73 268 48" fill="none" stroke={IC.blueDark} strokeWidth={1.5}/>
<path d="M263 138Q261 112 265 94Q274 71 259 49Q249 26 270 9" fill="none" stroke={IC.ink} strokeWidth={3} strokeDasharray="3 3"/>
{[[267,IC.purple],[340,IC.green]].map(([x,c],i)=><g key={i} transform={`translate(${x} 0)`}><path d="M-7 280V237Q-28 220-20 204Q-3 192 5 207L10 187Q3 171-8 164L-23 161" fill="none" stroke={c as string} strokeWidth={8} strokeLinecap="round"/><path d="M-2 277V237Q-20 219-14 210Q-1 203 10 217L18 185Q8 165-7 159L-22 156" fill="none" stroke={c as string} strokeWidth={3}/><path d="M-14 280H0" stroke={c as string} strokeWidth={4}/></g>)}
<ellipse cx={283} cy={159} rx={48} ry={23} fill="#fcecec" stroke={IC.red} strokeWidth={2}/>
{[0,1,2,3,4].map(i=><path key={i} d={`M${247+i*13} 150q-7 9 3 14t5-11`} stroke={IC.red} strokeWidth={2} fill="none"/>)}
<circle cx={283} cy={156} r={5} fill={IC.red}/>
<La x={240} y={333} size={26} color={IC.purple} bold>P</La><La x={340} y={333} size={26} color={IC.green} bold>A</La>
<Callout n={1} x={535} y={91} tx={434} ty={94} target="large-subunit-23S-rRNA"/>
<Callout n={2} x={522} y={246} tx={412} ty={267} target="small-subunit"/>
<Callout n={3} x={86} y={327} tx={132} ty={288} target="mRNA"/>
<Callout n={4} x={164} y={333} tx={260} ty={249} target="P-site-tRNA"/>
<Callout n={5} x={427} y={335} tx={333} ty={249} target="A-site-tRNA"/>
<Callout n={6} x={550} y={170} tx={283} ty={156} target="rRNA-peptidyl-transferase-center"/>
<Callout n={7} x={170} y={10} tx={252} ty={48} target="peptide-exit-tunnel"/>
</>;}
export function RibosomePtc(){return <Plate id="ribosome-ptc-next" label={label} title="הריבוזום — ריבוזים" subtitle="מרכז פפטידיל־טרנספראז ומנהרת יציאת השרשרת" draw={id=><Draw id={id}/>} keys={[
['תת־יחידה גדולה — כחול','23S rRNA בליבה הקטליטית'],['תת־יחידה קטנה — ירוק בהיר','ממקמת את ה־mRNA וה־tRNA'],['mRNA — זהוב','עובר בממשק עם תת־היחידה הקטנה'],['tRNA באתר P — סגול','נושא את השרשרת לפני ההעברה'],['tRNA באתר A — ירוק כהה','מקבל את השרשרת בעת יצירת הקשר'],['PTC — מרכז קטליטי באדום','סביבו רק rRNA, לפי מבני 2000'],['מנהרת יציאה בתת־יחידה גדולה','שחור: השרשרת החדשה יוצאת']
]} foot="מבט חתך חיידקי סכמטי; לא מבנה אטומי ולא בקנה מידה"/>;}
