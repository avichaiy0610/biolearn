import {Plate,IC} from './geometry/six';
import {Callout} from './geometry/next-six';
const label="קונוס הגדילה בקצה אקסון צומח: פילופודיה חשות את הסביבה. מצד אחד מפל של אות מושך (נטרין, ירוק) — האקטין מתארך שם; מהצד השני אות דוחה (Slit, אדום) — האקטין מתפרק. הקונוס פונה לכיוון המשיכה.";

function Draw({id}:{id:string}){return <>
<defs><linearGradient id={id+'-cue'}><stop stopColor="#f2c8cb"/><stop offset=".5" stopColor="white"/><stop offset="1" stopColor="#c9e7d4"/></linearGradient></defs>
<rect x={30} y={18} width={580} height={305} rx={22} fill={`url(#${id}-cue)`}/>
{[0,1,2,3,4].map(i=><g key={i}><circle cx={65+i*23} cy={70+i%2*30} r={7-i*.7} fill={IC.red}/><circle cx={570-i*23} cy={65+i%2*25} r={7-i*.7} fill={IC.green}/></g>)}
<path d="M291 337L285 263Q250 251 239 215L197 190Q190 183 208 185L249 193Q257 167 248 142L230 97Q229 88 237 99L272 143Q291 145 304 137L314 78Q317 65 320 81L326 129Q345 137 361 120L403 64Q411 55 406 70L381 137Q393 147 411 142L464 112Q478 107 467 120L425 160Q433 172 456 174L505 172Q516 174 503 180L447 195Q435 207 421 221L449 255Q455 265 445 259L407 240Q365 264 345 267L344 337Z" fill="#e1edf3" stroke={IC.blue} strokeWidth={2.5}/>
{[0,1,2,3].map(i=><path key={i} d={`M${302+i*9} 335Q${296+i*8} 284 ${310+i*9} 247Q${322+i*7} 214 ${347+i*9} 181`} fill="none" stroke={IC.gold} strokeWidth={3}/>)}
{[[318,230,400,73],[333,232,457,121],[349,228,491,179],[295,232,320,92],[284,217,240,112],[377,214,439,252]].map(([x,y,a,b],i)=><g key={i}><path d={`M${x} ${y}Q${(x+a)/2+8} ${(y+b)/2+8} ${a} ${b}`} fill="none" stroke={IC.blue} strokeWidth={2}/><path d={`M${x+6} ${y+4}Q${(x+a)/2+13} ${(y+b)/2+12} ${a+3} ${b+3}`} fill="none" stroke={IC.blue} strokeWidth={1}/></g>)}
{[[255,193],[268,187],[277,202]].map(([x,y],i)=><path key={i} d={`M${x} ${y}l6-5`} stroke={IC.blue} strokeWidth={2}/>)}
<path d="M410 285Q479 278 516 227" fill="none" stroke={IC.green} strokeWidth={3} markerEnd={`url(#${id}-arrow)`}/>
<Callout n={1} x={493} y={40} tx={547} ty={95} target="netrin-gradient"/>
<Callout n={2} x={112} y={142} tx={111} ty={70} target="slit-gradient"/>
<Callout n={3} x={387} y={24} tx={400} ty={73} target="filopodium"/>
<Callout n={4} x={560} y={160} tx={439} ty={191} target="lamellipodium"/>
<Callout n={5} x={207} y={279} tx={277} ty={202} target="actin-remodelling"/>
<Callout n={6} x={375} y={312} tx={320} ty={335} target="axon-microtubule"/>
</>;}
export function GrowthCone(){return <Plate id="growth-next" label={label} title="קונוס הגדילה — כיוון מתוך הסביבה" subtitle="קצה אקסון צומח, עם שלד תאי ובליטות חישה" draw={id=><Draw id={id}/>} keys={[
['נטרין — אות מושך','ירוק: המפל וכיוון הפנייה'],['Slit — אות דוחה','אדום: המפל בצד הנגדי'],['פילופודיה חשות את הסביבה','בליטות דקות עם סיבי אקטין'],['למליפודיה — יריעה רחבה','הקרום מחבר בין הבליטות'],['אקטין בקונוס הגדילה — כחול','מתארך במשיכה ומתפרק בדחייה'],['האקסון נמשך אל הקונוס','זהוב: מיקרוטובולים בציר המרכזי']
]} foot="המפלים והשלד סכמטיים; הקונוס פונה אל המשיכה"/>;}
