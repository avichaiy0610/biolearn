import {Plate,Callout,Flow,He,La,IC} from './geometry/viro';
const label="אריזת גנום לתוך מעטפת מוכנה. פרוקפסיד ריק נבנה סביב פיגום, שער יושב בקודקוד אחד, ומנוע שצורך ATP מכניס את ה-DNA פנימה. ככל שנכנס יותר DNA הלחץ בתוך הראש עולה.";
function Head({x,mode,id}:{x:number;mode:number;id:string}){return <g>
 <defs><clipPath id={`${id}-head-${mode}`}><path d={`M${x} 39L${x+52} 65L${x+66} 118L${x+36} 158H${x-36}L${x-66} 118L${x-52} 65Z`}/></clipPath></defs>
 <path data-bio={mode===0?'procapsid':'head'} d={`M${x} 39L${x+52} 65L${x+66} 118L${x+36} 158H${x-36}L${x-66} 118L${x-52} 65Z`} fill={mode===0?'#edf2f6':mode===1?'#fff0d5':'#f5d9b3'} stroke={IC.blueDark} strokeWidth={3}/>
 <path d={`M${x} 39L${x-28} 72L${x-52} 65M${x-28} 72L${x-66} 118M${x-28} 72H${x+28}L${x+52} 65M${x+28} 72L${x+66} 118M${x-66} 118L${x-30} 140H${x+30}L${x+66} 118M${x-30} 140L${x-36} 158M${x+30} 140L${x+36} 158`} fill="none" stroke="#91a8b9" strokeWidth={1.3}/>
 {mode===0?<ellipse data-bio="scaffold" cx={x} cy={105} rx={34} ry={32} fill="#d9ece2" fillOpacity={.6} stroke={IC.green} strokeWidth={2.5} strokeDasharray="6 4"/>:<g clipPath={`url(#${id}-head-${mode})`}>{Array.from({length:mode===1?4:11},(_,i)=><ellipse key={i} data-bio="packed-dna" cx={x} cy={mode===1?87+i*13:65+i*8} rx={mode===1?30+i*3:25+22*Math.sin(i*Math.PI/10)} ry={9} fill="none" stroke={IC.goldDark} strokeWidth={2.2}/>)}</g>}
 <path d={`M${x-16} 157V177Q${x} 190 ${x+16} 177V157`} fill="#d8c5e6" stroke="#705080" strokeWidth={2}/>
 <ellipse data-bio="portal" cx={x} cy={160} rx={19} ry={8} fill="#b299c4" stroke="#705080" strokeWidth={2}/><ellipse cx={x} cy={160} rx={7} ry={3} fill="white"/>
 </g>;}
function Draw(id:string){return <>
 <He x={522} y={16} size={26} bold>1 · פרוקפסיד ריק</He><He x={320} y={16} size={26} bold>2 · אריזה ב־ATP</He><He x={118} y={16} size={26} bold>3 · ראש מלא</He>
 <Head x={522} mode={0} id={id}/><Head x={320} mode={1} id={id}/><Head x={118} mode={2} id={id}/>
 <Flow id={id} d="M449 103H395"/><Flow id={id} d="M247 103H193"/>
 <path data-bio="outside-dna" d="M315 307Q331 300 315 291T315 275T315 259T315 243V172" fill="none" stroke={IC.goldDark} strokeWidth={3}/>
 <path data-bio="outside-dna" d="M325 307Q309 300 325 291T325 275T325 259T325 243V172" fill="none" stroke={IC.gold} strokeWidth={2.5}/>
 {[247,255,263,271,279,287,295,303].map(y=><path key={y} d={`M316 ${y}H324`} stroke={IC.gold} strokeWidth={1.3}/>)}
 <ellipse cx={320} cy={204} rx={36} ry={18} fill="#f2d0d4" stroke={IC.red} strokeWidth={2}/>
 {Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return <ellipse key={i} data-bio="motor" cx={320+28*Math.cos(a)} cy={204+11*Math.sin(a)} rx={9} ry={8} fill={i<3?'#d98f99':'#b44d53'} stroke="#813942" strokeWidth={1.2}/>;})}
 <ellipse cx={320} cy={204} rx={7} ry={5} fill="white"/>
 <Flow id={id} d="M367 291V235" color={IC.red}/>
 <Callout n={1} x={610} y={79} tx={574} ty={65} target="procapsid"/>
 <Callout n={2} x={607} y={142} tx={552} ty={120} target="scaffold"/>
 <Callout n={3} x={422} y={192} tx={338} ty={160} target="portal"/>
 <Callout n={4} x={258} y={226} tx={292} ty={204} target="motor"/>
 <Callout n={5} x={267} y={302} tx={315} ty={307} target="outside-dna"/>
 <Callout n={6} x={42} y={60} tx={94} ty={65} target="packed-dna"/>
 <Callout n={7} x={43} y={191} tx={82} ty={158} target="head"/>
 </>;}
export function PackagingMotor(){return <Plate id="viro-packaging" label={label} title="אריזת DNA לתוך ראש מוכן" subtitle="פרוקפסיד, שער ומנוע ATPase; התקדמות מימין לשמאל" draw={Draw} keys={[
 ['פרוקפסיד — מעטפת חלבונית מוכנה','תכולה בהירה: לפני הכנסת הגנום'],['פיגום פנימי — ירוק מקווקו','הראש הריק נבנה סביב הפיגום'],['שער טבעתי — סגול','פורטל בקודקוד אחד של הקפסיד'],['מנוע ATPase — טבעת אדומה','ATP → ADP + Pi; הכוח מכניס DNA'],['DNA שטרם נארז — חום־זהוב','החץ שלצדו מציין כניסה אל הראש'],['DNA שנארז — ליפופים חומים','מילוי הראש הולך ומתקדם'],['ראש מלא — רקע כתום','הלחץ בפנים עולה עם כניסת DNA']
 ]} foot={['בחירת המטען: זיהוי אות האריזה','עצירת האריזה: רצף מסוים או קיבולת הראש']}/>;}
