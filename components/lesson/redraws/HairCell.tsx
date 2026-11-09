import {Plate,Callout,Flow,IC,He} from './geometry/ub-zoo';
const label="תא שערה: כשהצרור מתכופף לעבר השערה הארוכה (הקינוציליום), התא משחרר יותר מוליך ותדירות הפוטנציאלים בעצב עולה; כשהוא מתכופף לכיוון ההפוך — התדירות יורדת מתחת לקצב הבסיסי.";

function HairScene({x,tilt=0,spikes=5,title}:{x:number;tilt?:number;spikes?:number;title:string}){return <g transform={`translate(${x} 0)`}>
<He x={0} y={28} size={26} bold>{title}</He>
<path data-bio="hair-cell" d="M-39 135Q0 124 39 135L34 221Q27 250 0 250Q-30 245-35 221Z" fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/>
<g transform={`rotate(${tilt} 0 134)`}>
{[0,1,2,3,4].map(i=><g key={i}><path data-bio="stereocilia" d={`M${-28+i*12} 134V${101-i*10}`} stroke={IC.green} strokeWidth={7} strokeLinecap="round"/>{i<4&&<path data-bio="tip-link" d={`M${-26+i*12} ${103-i*10}L${-18+i*12} ${96-i*10}`} stroke={IC.goldDark} strokeWidth={2.5}/>}</g>)}
<path data-bio="kinocilium" d="M35 134V48" stroke={IC.ink} strokeWidth={5} strokeLinecap="round"/>
<circle data-bio="met-channel" cx={-26} cy={103} r={5} fill={IC.gold}/>
</g>
<ellipse cx={0} cy={190} rx={12} ry={16} fill="white" stroke={IC.green}/>
{Array.from({length:spikes===12?7:spikes===1?1:4},(_,i)=><circle data-bio="transmitter" key={i} cx={-19+(i%4)*12} cy={224+Math.floor(i/4)*12} r={3.5} fill={IC.red}/>)}
<path data-bio="afferent" d="M-38 246Q-40 275-8 273V292H8V273Q40 276 39 246L29 247Q28 261 0 260Q-28 260-28 246Z" fill="#ddcee6" stroke={IC.purple} strokeWidth={2}/>
<path d="M-67 324H67" stroke="#8b99a3"/>
{Array.from({length:spikes},(_,i)=><path data-bio="spike" key={i} d={`M${-62+(i+.5)*124/spikes} 324v-16`} stroke={IC.purple} strokeWidth={2}/>)}
</g>;}
function Draw(id:string){return <>
<HairScene x={523} title="מנוחה"/><HairScene x={315} title="לעבר הארוכה" tilt={9} spikes={12}/><HairScene x={108} title="בכיוון ההפוך" tilt={-9} spikes={1}/>
<Flow d="M283 48H335" id={id}/><Flow d="M135 48H85" id={id}/>
<Callout n={1} x={596} y={98} tx={558} ty={82} target="kinocilium"/>
<Callout n={2} x={440} y={133} tx={495} ty={122} target="stereocilia"/>
<Callout n={3} x={450} y={59} tx={501} ty={99.5} target="tip-link"/>
<Callout n={4} x={595} y={199} tx={542} ty={224} target="transmitter"/>
<Callout n={5} x={452} y={285} tx={495} ty={265} target="afferent"/>
<Callout n={6} x={398} y={305} tx={371.8333333333333} ty={318} target="spike"/>
<Callout n={7} x={43} y={282} tx={108} ty={318} target="spike"/>
<Callout n={8} x={599} y={149} tx={545} ty={149} target="hair-cell"/>
</>;}
export function HairCell(){return <Plate id="hair-cell-ub-zoo" label={label} title="תא שערה — מכפיפה לאות עצבי" subtitle="מנוחה מימין; אותו תא בשלושה מצבים סכמטיים" draw={Draw} keys={[
['קינוציליום — השלוחה הארוכה','כהה: מגדיר את כיוון הכפיפה המעורר'],['סטריאוציליה מדורגות באורכן','ירוק: צרור שלוחות בראש התא'],['קשרי קצה — tip-links','חום: קשרים; זהב: תעלה מכנית'],['מוליך עצבי בסינפסה הבסיסית','אדום: יותר מוליך בכפיפה מעוררת'],['עצב תחושתי המקבל את האות','סגול: קצה העצב וקצב הפוטנציאלים'],['כפיפה לעבר הארוכה — יותר פעילות','תדירות עולה מעל קצב הבסיס במנוחה'],['כפיפה הפוכה — פחות פעילות','תדירות יורדת מתחת לקצב הבסיס'],['תא השערה מתרגם כפיפה לאות','ירוק בהיר: תא; הפוטנציאלים בעצב']
]} foot={["מוצג תא שערה בעל קינוציליום","מספר הקוצים מסמן קצב יחסי בלבד"]}/>;}
