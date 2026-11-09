import {Plate,Callout,Flow,IC,He} from './geometry/ub-zoo';
const label="ספוג פשוט בחתך: מים נכנסים דרך נקבוביות בדופן לחלל המרכזי, שמרופד בתאי צווארון עם שוטונים, ויוצאים דרך האוסקולום למעלה. משמאל — תא צווארון מוגדל.";

function Collar({x,y,s=1,flip=false,bio=false}:{x:number;y:number;s?:number;flip?:boolean;bio?:boolean}){return <g transform={`translate(${x} ${y}) scale(${flip?-s:s} ${s})`}>
<path data-bio={bio?'choanocyte':undefined} d="M-13 15Q-18-2 0-8Q19-2 14 15Q5 33-13 15Z" fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/><ellipse cx={1} cy={14} rx={5} ry={6} fill="white" stroke={IC.green}/>
<path data-bio={bio?'collar':undefined} d="M-9-4L-16-47M9-4L16-47M-6-5L-10-46M6-5L10-46M-3-5L-4-46M3-5L4-46" fill="none" stroke={IC.green} strokeWidth={2}/>
<path data-bio={bio?'flagellum':undefined} d="M0-5Q-9-22 0-40T0-76" fill="none" stroke={IC.green} strokeWidth={3}/></g>;}
function Draw(id:string){return <>
<path data-bio="wall" d="M270 50Q250 92 252 183Q240 272 290 304Q340 328 397 302Q438 264 426 182Q425 90 409 50L388 50Q403 117 395 196Q406 268 375 277Q339 294 305 276Q273 261 283 190Q280 115 291 50Z" fill="#f0d6a8" stroke={IC.gold} strokeWidth={2}/>
{[105,165,225].map(y=><g key={y}><path data-bio="ostium" d={`M250 ${y-7}H284V${y+7}H250Z`} fill="#eaf4fb" stroke={IC.blue}/><path d={`M395 ${y-7}H430V${y+7}H395Z`} fill="#eaf4fb" stroke={IC.blue}/><Flow d={`M213 ${y}H279`} id={id} color={IC.blue}/><Flow d={`M473 ${y}H400`} id={id} color={IC.blue}/></g>)}
<path data-bio="spongocoel" d="M305 80Q288 193 306 264Q343 285 375 264Q394 189 374 80Z" fill="#f3f9fc"/>
{[83,133,193,253].map(y=><g key={y}><g transform={`translate(292 ${y}) rotate(90)`}><Collar x={0} y={0} s={.36}/></g><g transform={`translate(387 ${y}) rotate(-90)`}><Collar x={0} y={0} s={.36}/></g></g>)}
<Collar x={328} y={281} s={.36}/><Collar x={355} y={281} s={.36}/>
<path data-bio="osculum" d="M291 50Q339 66 388 50" fill="none" stroke={IC.gold} strokeWidth={4}/><Flow d="M339 243V15" id={id} color={IC.blue}/>
<Collar x={111} y={224} s={1.45} bio/>
<He x={110} y={302} size={26}>תא צווארון מוגדל</He>
<Callout n={1} x={233} y={37} tx={291} ty={50} target="osculum"/>
<Callout n={2} x={213} y={137} tx={261} ty={108} target="ostium"/>
<Callout n={3} x={477} y={303} tx={370} ty={246} target="spongocoel"/>
<Callout n={4} x={213} y={295} tx={280} ty={278} target="wall"/>
<Callout n={5} x={38} y={249} tx={100} ty={245} target="choanocyte"/>
<Callout n={6} x={42} y={164} tx={91} ty={175} target="collar"/>
<Callout n={7} x={165} y={93} tx={111} ty={114} target="flagellum"/>
</>;}
export function Sponge(){return <Plate id="sponge-ub-zoo" label={label} title="ספוג אסקונואידי — חתך וזרימת מים" subtitle="החלל המרכזי מרופד בתאי צווארון; הגדלה משמאל" draw={Draw} keys={[
['אוסקולום — פתח יציאת המים','החץ הכחול פונה מהחלל החוצה'],['אוסטיה — נקבוביות בדופן','כחול: מים נכנסים דרך הנקבוביות'],['החלל המרכזי — ספונגוצל','תאי צווארון מרפדים את החלל'],['דופן הגוף מקיפה את החלל','זהב: רקמה, נקטעת בנקבוביות'],['תא צווארון — קואנוציט','ירוק בהיר: גוף התא והגרעין'],['צווארון המקיף את השוטון','ירוק: שלוחות דקות לסינון מזון'],['שוטון תא הצווארון','ירוק כהה: תנועתו מניעה מים']
]} foot={['ספוג פשוט בלבד; ארגון אסקונואידי','בספוגים אחרים מערכת התעלות עשויה להיות מורכבת יותר']}/>;}
