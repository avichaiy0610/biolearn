import {Plate,IC,La,He} from './geometry/six';
import {Callout} from './geometry/next-six';
const label="נוירולציה בחתך: (1) לוחית עצבית באקטודרם מעל מיתר הגב; (2) הקפלים העצביים מתרוממים; (3) הקפלים נסגרים לצינור עצבי מתחת לעור, ותאי הציצה העצבית (כתום) נודדים מהשוליים.";

function Draw(){return <>
{[520,320,120].map((x,i)=><g key={x}><La x={x} y={26} size={26} bold>{i+1}</La><He x={x} y={60} size={25}>{['לוחית','קיפול','סגירה'][i]}</He></g>)}
<path d="M430 147H610V174H430Z" fill="#e0e5e9" stroke="#8797a2"/>
<rect x={477} y={130} width={86} height={44} rx={4} fill="#b5d5e8" stroke={IC.blue} strokeWidth={2}/>
{Array.from({length:7},(_,i)=><g key={i}><path d={`M${480+i*12} 132V172`} stroke={IC.blue}/><ellipse cx={486+i*12} cy={157} rx={3} ry={7} fill={IC.blue}/></g>)}
<path d="M230 176H258Q270 173 275 136Q278 100 293 111Q305 126 306 153Q320 186 334 153Q335 126 347 111Q362 100 365 136Q370 173 382 176H410V192H378Q353 190 349 162Q320 216 291 162Q287 190 262 192H230Z" fill="#e0e5e9" stroke="#8797a2" strokeWidth={1.5}/>
<path d="M278 131Q282 110 293 116Q304 134 304 156Q320 190 336 156Q336 134 347 116Q358 110 362 131L351 158Q320 222 289 158Z" fill="#b5d5e8" stroke={IC.blue} strokeWidth={2}/>
{[[286,133,295,151],[295,151,304,170],[304,170,313,183],[327,183,336,170],[336,170,345,151],[345,151,354,133]].map(([x,y,a,b],i)=><g key={i}><path d={`M${x} ${y}L${a} ${b}`} stroke={IC.blue}/><circle cx={(x+a)/2} cy={(y+b)/2} r={3} fill={IC.blue}/></g>)}
<path d="M30 108H210V127H30Z" fill="#e0e5e9" stroke="#8797a2"/>
{Array.from({length:12},(_,i)=><path key={i} d={`M${35+i*15} 108V127`} stroke="#a9b5bf"/>)}
<ellipse cx={120} cy={190} rx={42} ry={49} fill="#b5d5e8" stroke={IC.blue} strokeWidth={2}/>
{Array.from({length:14},(_,i)=>{const a=i*Math.PI/7;return <g key={i}><path d={`M${120+18*Math.cos(a)} ${190+25*Math.sin(a)}L${120+41*Math.cos(a)} ${190+48*Math.sin(a)}`} stroke={IC.blue}/><ellipse cx={120+30*Math.cos(a)} cy={190+37*Math.sin(a)} rx={3} ry={4} fill={IC.blue}/></g>;})}
<ellipse cx={120} cy={190} rx={17} ry={25} fill="white" stroke={IC.blue}/>
{[120,320,520].map(x=><g key={x}><ellipse cx={x} cy={266} rx={16} ry={12} fill={IC.purple} stroke="#624674"/><path d={`M${x-10} 263q10-7 20 0`} fill="none" stroke="#d3bedf"/></g>)}
{[[86,139],[153,139],[63,163],[181,163]].map(([x,y],i)=><ellipse key={i} cx={x} cy={y} rx={6} ry={5} fill={IC.gold}/>)}
<path d="M84 145L65 158M156 145L176 158" stroke={IC.gold} strokeWidth={2} fill="none"/>
<Callout n={1} x={592} y={227} tx={540} ty={153} target="neural-plate"/>
<Callout n={2} x={440} y={294} tx={505} ty={266} target="notochord"/>
<Callout n={3} x={396} y={92} tx={350} ty={123} target="neural-fold"/>
<Callout n={4} x={37} y={239} tx={87} ty={213} target="neural-tube-wall"/>
<Callout n={5} x={200} y={85} tx={184} ty={116} target="surface-ectoderm"/>
<Callout n={6} x={42} y={137} tx={63} ty={163} target="migrating-neural-crest"/>
</>;}
export function NeuralTube(){return <Plate id="neurulation-next" label={label} title="נוירולציה — מלוחית לצינור" subtitle="חתכים עוקבים; סדר השלבים מימין לשמאל" draw={()=><Draw/>} keys={[
['לוחית עצבית באקטודרם','כחול: אפיתל עצבי ותאיו'],['מיתר הגב מתחת ללוחית','סגול: מיתר הגב בכל שלב'],['הקפלים העצביים מתרוממים','הכיפוף מקרב את שני השוליים'],['צינור עצבי סגור וחלל מרכזי','נפרד מהאקטודרם שמעליו'],['אקטודרם פני השטח — עור','אפור: שכבה רציפה אחרי הסגירה'],['תאי הציצה העצבית נודדים','כתום: תאים משולי הלוחית']
]} foot="סכמטי; השלבים אינם תמונות של אותו חתך בזמן אמת"/>;}
