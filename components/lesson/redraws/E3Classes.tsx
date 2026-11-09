import {Plate,Callout,Flow,Protein,Ub,IC,La} from './geometry/ub-zoo';
const label="שלוש משפחות E3. ב-RING היוביקוויטין עובר ישירות מה-E2 למצע וה-E3 משמש פיגום. ב-HECT היוביקוויטין עובר קודם לציסטאין של ה-E3 ורק ממנו למצע. ב-RBR תחום RING1 קושר את E2 אבל היוביקוויטין עובר דרך ציסטאין בתחום RING2 — שילוב של שתי הדרכים.";

function E2({x,y}:{x:number;y:number}){return <g><path data-bio="e2" d={`M${x-29} ${y+6}Q${x-43} ${y-20} ${x-17} ${y-26}Q${x+5} ${y-38} ${x+23} ${y-20}L${x+15} ${y-3}Q${x-4} ${y-15} ${x-9} ${y+13}Z`} fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/><La x={x-7} y={y-7} size={26}>E2</La><Ub x={x+28} y={y-28}/><path d={`M${x+16} ${y-19}L${x+21} ${y-23}`} stroke={IC.red} strokeWidth={2}/></g>;}
function Draw(id:string){return <>
{[[520,'RING'],[316,'HECT'],[108,'RBR']].map(([x,t])=><La key={t} x={x as number} y={28} size={28} bold>{t}</La>)}
<E2 x={480} y={98}/><E2 x={279} y={98}/><E2 x={69} y={98}/>
<path data-bio="ring" d="M466 125Q452 107 466 96L483 107L494 119Q522 115 531 140L563 159L551 181Q532 160 518 164Q487 169 480 142Z" fill="#f0d6a8" stroke={IC.gold} strokeWidth={2}/>
<Protein x={554} y={218} bio="substrate"/>
<Flow d="M521 75Q593 99 566 179" id={id} color={IC.red}/><Ub x={565} y={178} bio="ub"/>
<path d="M563 188L559 193" stroke={IC.red} strokeWidth={2}/>
<path data-bio="hect" d="M257 128Q246 101 273 109Q291 114 294 145Q324 128 343 143Q356 155 342 177Q319 194 303 171Q281 175 272 153Z" fill="#ddcee6" stroke={IC.purple} strokeWidth={2}/>
<circle data-bio="hect-cys" cx={337} cy={151} r={6} fill={IC.purple}/><Ub x={343} y={120}/><path d="M339 130L338 145" stroke={IC.red} strokeWidth={2}/>
<Protein x={342} y={241}/><Ub x={343} y={202}/><path d="M343 212L342 216" stroke={IC.red} strokeWidth={2}/><Flow d="M321 73Q351 79 347 102" id={id} color={IC.red}/><Flow d="M365 134Q396 176 353 194" id={id} color={IC.red}/>
<path data-bio="rbr-ring1" d="M43 129Q29 103 48 100L64 115Q90 102 95 126Q92 148 68 145Z" fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/>
<path d="M84 143Q112 163 129 144" fill="none" stroke={IC.green} strokeWidth={4}/><ellipse data-bio="ibr" cx={113} cy={161} rx={17} ry={14} fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/>
<path data-bio="rbr-ring2" d="M130 140Q119 120 139 116Q161 110 171 131Q179 149 161 164Q142 174 134 155Z" fill="#c4dbd0" stroke={IC.green} strokeWidth={2}/>
<circle data-bio="rbr-cys" cx={155} cy={135} r={6} fill={IC.purple}/><Ub x={155} y={103}/><path d="M155 114V129" stroke={IC.red} strokeWidth={2}/>
<Protein x={143} y={241}/><Ub x={143} y={202}/><path d="M143 212V216" stroke={IC.red} strokeWidth={2}/><Flow d="M104 65Q129 62 145 82" id={id} color={IC.red}/><Flow d="M179 111Q207 165 154 194" id={id} color={IC.red}/>
<Callout n={1} x={428} y={67} tx={455} ty={82} target="e2"/>
<Callout n={2} x={432} y={166} tx={487} ty={143} target="ring"/>
<Callout n={3} x={609} y={221} tx={576} ty={218} target="substrate"/>
<Callout n={4} x={255} y={207} tx={318} ty={170} target="hect"/>
<Callout n={5} x={389} y={99} tx={337} ty={151} target="hect-cys"/>
<Callout n={6} x={26} y={210} tx={58} ty={134} target="rbr-ring1"/>
<Callout n={7} x={201} y={78} tx={155} ty={135} target="rbr-cys"/>
<Callout n={8} x={607} y={184} tx={570} ty={184} target="ub"/>
</>;}
export function E3Classes(){return <Plate id="e3-ub-zoo" label={label} title="שלוש משפחות E3 — מסלול היוביקוויטין" subtitle="RING מימין; החצים האדומים מתארים העברת Ub" draw={Draw} keys={[
['E2 קושר יוביקוויטין להעברה','ירוק בהיר: האנזים המצומד'],['RING — פיגום, ללא ביניים קוולנטי','זהב: מקרב E2 למצע; מעבר ישיר'],['מצע החלבון מקבל את Ub','בז׳: המצע בכל שלוש המשפחות'],['HECT — שני שלבים קטליטיים','סגול בהיר: שתי אונות ה־E3'],['ציסטאין קטליטי של HECT','סגול כהה: Ub עובר דרך ה־E3'],['RBR — תחום RING1 קושר E2','ירוק: RING1, תחום IBR ו־RING2'],['ציסטאין ב־RING2 של RBR','מנגנון משולב; ביניים כמו ב־HECT'],['יוביקוויטין — Ub, מסומן באדום','מ־E2 למצע, ישירות או דרך ה־E3']
]} foot="סכמטי; הדומיינים אינם מודל אטומי או מבנים בקנה מידה"/>;}
