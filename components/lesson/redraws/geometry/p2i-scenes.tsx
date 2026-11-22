import {He,La,Callout,Flow} from './ub-zoo';
export {Plate} from './p2c-scenes';
const blue='#316f91',green='#367b64',gold='#a47435',purple='#815a9b',red='#ac4b55',gray='#647788';
function L({x,y,t,c=blue,size=25}:{x:number;y:number;t:string;c?:string;size?:number}){return <La x={x} y={y} size={size} color={c} bold>{'\u2066'+t+'\u2069'}</La>;}
function SurfaceDefs({id}:{id:string}){return <defs>{[['blue','#e4f1f5','#77a9c1'],['green','#e4f1e9','#7dab96'],['gold','#fff0d2','#c79b59'],['purple','#f0e7f5','#b19ac7'],['red','#fae5e5','#d19399']].map(([n,a,b])=><radialGradient id={id+'-surface-'+n} key={n} cx=".28" cy=".22" r=".95"><stop stopColor={a}/><stop offset=".6" stopColor={b}/><stop offset="1" stopColor={n==='blue'?blue:n==='green'?green:n==='gold'?gold:n==='purple'?purple:red}/></radialGradient>)}</defs>;}
function Protein({x,y,rx=70,ry=38,id,c='blue',bio,t}:{x:number;y:number;rx?:number;ry?:number;id:string;c?:string;bio:string;t?:string}){return <g>
 <path data-bio={bio} d={`M${x-rx} ${y}C${x-rx-10} ${y-ry*.75} ${x-rx*.6} ${y-ry*1.3} ${x-rx*.2} ${y-ry}C${x+rx*.3} ${y-ry*1.5} ${x+rx*.9} ${y-ry*.85} ${x+rx} ${y-ry*.1}C${x+rx*1.12} ${y+ry*.65} ${x+rx*.3} ${y+ry*1.2} ${x} ${y+ry}C${x-rx*.65} ${y+ry*1.3} ${x-rx*1.1} ${y+ry*.65} ${x-rx} ${y}Z`} fill={`url(#${id}-surface-${c})`} stroke={c==='gold'?gold:c==='purple'?purple:c==='green'?green:blue} strokeWidth={2}/>
 {ry>=35&&<path d={`M${x-rx*.6} ${y-ry*.7}q${rx*.2} ${-ry*.25} ${rx*.4} ${-ry*.13}t${rx*.44} ${-ry*.02}`} stroke="#fff" strokeOpacity={.55} strokeWidth={3} strokeLinecap="round" fill="none"/>}
 {ry>=35&&bio!=='editing'&&<><path d={`M${x-rx*.61} ${y+ry*.62}q${rx*.23} ${ry*.4} ${rx*.48} ${ry*.1}t${rx*.54} ${-ry*.05}`} stroke={c==='gold'?gold:c==='purple'?purple:c==='green'?green:blue} strokeOpacity={.45} strokeWidth={2} fill="none" strokeLinecap="round"/><path d={`M${x-rx*.58} ${y+ry*.55}q${rx*.21} ${ry*.36} ${rx*.43} ${ry*.1}t${rx*.51} ${-ry*.04}`} stroke="#fff" strokeOpacity={.45} strokeWidth={3} fill="none" strokeLinecap="round"/></>}
 {t&&<L x={x} y={y+9} t={t} c={c==='gold'?gold:c==='purple'?purple:blue}/>}
 </g>;}
function Duplex({x,y,w,bio='dna'}:{x:number;y:number;w:number;bio?:string}){return <g>
 {Array.from({length:Math.floor(w/13)},(_,i)=><path key={i} d={`M${x+7+i*13} ${y-6}v12`} stroke={i%2?'#c9aa80':'#afc5ca'} strokeWidth={3}/>)}
 <path data-bio={bio} d={`M${x} ${y-8}H${x+w}`} stroke={blue} strokeWidth={5} strokeLinecap="round"/>
 <path d={`M${x} ${y+8}H${x+w}`} stroke={green} strokeWidth={5} strokeLinecap="round"/>
 <path d={`M${x} ${y-9}H${x+w}`} stroke="#a8d7e3" strokeWidth={1}/>
 </g>;}
function Box({x,y,w,t,id,c='blue',bio}:{x:number;y:number;w:number;t:string;id:string;c?:string;bio:string}){return <g><rect data-bio={bio} x={x} y={y} width={w} height={42} rx={9} fill={`url(#${id}-surface-${c})`} stroke={c==='green'?green:c==='gold'?gold:c==='purple'?purple:blue} strokeWidth={2}/><L x={x+w/2} y={y+30} t={t} c={c==='green'?green:c==='gold'?gold:c==='purple'?purple:blue}/></g>;}
function Sequence({x,y,s,c=blue,bio,id}:{x:number;y:number;s:string;c?:string;bio:string;id:string}){return <g>{s.split('').map((b,i)=><g key={i}><rect data-bio={bio} x={x+i*28} y={y-23} width={26} height={33} rx={5} fill={`url(#${id}-surface-${c===gold?'gold':c===purple?'purple':'blue'})`} stroke={c} strokeWidth={1.2}/><L x={x+i*28+13} y={y+2} t={b} c={c} size={25}/></g>)}</g>;}

export function TelomeraseScene(id:string){return <><SurfaceDefs id={id}/>
 <He x={320} y={27} size={27} bold>הארכת קצה הכרומוזום</He>
 <path data-bio="tert" d="M205 144C169 108 209 58 266 74C318 35 395 54 414 91C499 57 575 91 572 160C606 206 568 246 502 234C469 274 391 269 364 237L355 207H233C206 198 193 170 205 144Z" fill={`url(#${id}-surface-purple)`} stroke={purple} strokeWidth={2.5}/>
 <path d="M224 102q30-25 57-8m24-14q43-18 73 10m55 9q49-19 88 8M413 238q49 8 72-12" fill="none" stroke="#f5eef9" strokeWidth={6} strokeLinecap="round"/>
 <L x={426} y={113} t="TERT" c={purple}/>
 <Sequence x={76} y={158} s="TTAGGGTTAG" bio="parent" id={id}/>
 <Sequence x={356} y={158} s="GGTTAG" c={gold} bio="extension" id={id}/>
 <L x={39} y={160} t="5′…"/><L x={554} y={122} t="3′" c={gold}/>
 <Sequence x={76} y={209} s="AATC" bio="short-strand" id={id}/>
 <L x={39} y={211} t="3′…"/><L x={180} y={258} t="5′"/>
 <Sequence x={216} y={209} s="CAAUCCCAAUC" c={purple} bio="terc" id={id}/>
 {[0,1,2,3,5,6,7,8,9,10,11,12,13,14,15].map(i=><path key={i} d={`M${89+i*28} 170v14`} stroke={i<4?blue:purple} strokeWidth={1.5} strokeDasharray="2 3"/>)}
 <L x={230} y={258} t="3′" c={purple}/><L x={551} y={211} t="5′" c={purple}/>
 <He x={320} y={313} size={25} color={purple}>תבנית ⁦TERC⁩ · זיווג אנטי־מקביל</He>
 <He x={320} y={350} size={25}>המקווקווים מציינים זיווג בסיסים</He>
 <He x={320} y={394} size={25}>זיווג, הארכה ואז תזוזה קדימה</He>
 <He x={320} y={431} size={25}>השלמת הגדיל השני: ⁦Pol α–primase⁩</He>
 <Callout n={1} x={48} y={100} tx={75.4} ty={145.015} target="parent"/>
 <Callout n={2} x={581} y={61} tx={549.192} ty={100.148} target="tert"/>
 <Callout n={3} x={600} y={171} tx={522.599} ty={155.123} target="extension"/>
 <Callout n={4} x={595} y={270} tx={509.023} ty={219.6} target="terc"/>
 <Callout n={5} x={116} y={262} tx={116} ty={219.6} target="short-strand"/>
 </>;}

export function BacterialPromoterScene(id:string){return <><SurfaceDefs id={id}/>
 <He x={320} y={27} size={27} bold>זיהוי הפרומוטור בידי ⁦σ70⁩</He>
 <Protein x={310} y={118} rx={142} ry={47} id={id} bio="core"/>
 <He x={310} y={132} size={27} bold>אנזים הליבה</He>
 <path data-bio="sigma" d="M176 173Q181 149 206 162Q251 182 318 161Q346 153 351 176L350 195Q257 217 176 195Z" fill={`url(#${id}-surface-gold)`} stroke={gold} strokeWidth={2}/>
 <L x={264} y={190} t="σ70" c={gold}/>
 <path d="M195 202V241M336 201V241" stroke={gold} strokeWidth={4}/>
 <Duplex x={37} y={261} w={566}/>
 <Box x={48} y={240} w={78} t="UP" c="purple" id={id} bio="up"/>
 <Box x={152} y={240} w={129} t="TTGACA" id={id} bio="minus35"/>
 <Box x={315} y={240} w={129} t="TATAAT" id={id} bio="minus10"/>
 <path data-bio="start" d="M496 239V207H561" stroke={green} strokeWidth={3} fill="none"/>
 <path d="M561 207l-10-6v12Z" fill={green}/>
 <L x={216} y={325} t="−35"/><L x={379} y={325} t="−10"/><L x={496} y={325} t="+1" c={green}/>
 <He x={87} y={325} size={25} color={purple}>בחלקם</He>
 <path data-bio="spacing" d="M281 350v9h34v-9" stroke={gray} strokeWidth={2} fill="none"/>
 <He x={320} y={402} size={25}>מרווח: ⁦16–18⁩ זוגות בסיסים</He>
 <He x={320} y={439} size={25}>האופטימום: ⁦17⁩ · רצפי קונצנזוס</He>
 <Callout n={1} x={103} y={97} tx={166.025} ty={112.528} target="core"/>
 <Callout n={2} x={420} y={185} tx={351.628} ty={183.074} target="sigma"/>
 <Callout n={3} x={152} y={353} tx={164.817} ty={282.999} target="minus35"/>
 <Callout n={4} x={433} y={353} tx={433} ty={282.999} target="minus10"/>
 <Callout n={5} x={598} y={176} tx={552.322} ty={205.5} target="start"/>
 </>;}

export function TerminatorsScene(id:string){return <><SurfaceDefs id={id}/>
 <He x={320} y={26} size={27} bold>סיום עצמי</He>
 <Duplex x={43} y={177} w={552}/>
 <Protein x={500} y={157} rx={69} ry={39} id={id} bio="polymerase"/>
 <path data-bio="hairpin" d="M77 144H267V88C247 28 328 28 309 88V144H341" fill="none" stroke={purple} strokeWidth={6} strokeLinecap="round"/>
 {[90,105,120,135].map(y=><path key={y} d={`M270 ${y}h36`} stroke={purple} strokeWidth={2} strokeDasharray="3 3"/>)}
 <L x={178} y={106} t="G–C" c={purple} size={25}/>
 <L x={45} y={149} t="5′" c={purple}/><L x={381} y={115} t="UUUUUU" c={purple}/>
 <path d="M341 144H431" stroke={purple} strokeWidth={5}/>
 <He x={320} y={231} size={25}>הכלאה חלשה: ⁦rU:dA⁩ · ה־⁦RNA⁩ משתחרר</He>
 <He x={320} y={290} size={27} bold>סיום תלוי־⁦Rho⁩</He>
 <Duplex x={43} y={430} w={552}/>
 <Protein x={510} y={410} rx={69} ry={39} id={id} bio="paused"/>
 <He x={510} y={352} size={25}>מושהה</He>
 <path data-bio="rna" d="M76 398H447" stroke={purple} strokeWidth={5}/><L x={45} y={404} t="5′" c={purple}/>
 <path data-bio="rut" d="M99 398H178" stroke={gold} strokeWidth={10}/>
 <L x={136} y={367} t="rut" c={gold}/>
 <Protein x={285} y={398} rx={47} ry={34} id={id} c="gold" bio="rho" t="Rho"/>
 <Flow id={id} d="M347 369H426" color={gold}/><L x={385} y={345} t="5′ → 3′" c={gold}/>
 <He x={320} y={513} size={25}>תנועת ⁦Rho⁩: פירוק ⁦ATP → ADP + Pᵢ⁩</He>
 <He x={320} y={552} size={25}>הליקאז שמפריד את התעתיק מהקומפלקס</He>
 <Callout n={1} x={210} y={55} tx={264.001} ty={89.106} target="hairpin"/>
 <Callout n={2} x={594} y={112} tx={565.507} ty={141.412} target="polymerase"/>
 <Callout n={3} x={93} y={466} tx={114.895} ty={402.999} target="rut"/>
 <Callout n={4} x={285} y={463} tx={285} ty={433.1} target="rho"/>
 <Callout n={5} x={600} y={463} tx={562.438} ty={438.541} target="paused"/>
 </>;}

export function EnhancerLoopScene(id:string){return <><SurfaceDefs id={id}/>
 <He x={320} y={27} size={27} bold>מגע מרחוק באמצעות לולאת ⁦DNA⁩</He>
 <path data-bio="loop" d="M34 345H142C150 312 36 99 170 84C298 69 260 263 301 345H601" stroke={blue} strokeWidth={7} fill="none"/>
 <path d="M34 351H142C150 318 44 106 170 92C289 79 253 270 301 351H601" stroke={green} strokeWidth={3} fill="none"/>
 <path d="M93 141l11 6m-17 21l11 3m-12 24h12m64-108l2 8m28-9l-2 8m28 7l-6 7m30 91l-10 3m15 25l-10 3m18 24l-11 4M336 345v7m20-7v7m20-7v7m20-7v7m20-7v7m20-7v7m20-7v7m20-7v7m20-7v7m20-7v7m20-7v7m20-7v7" stroke="#b7c7c5" strokeWidth={2}/>
 <Box x={132} y={70} w={96} t="" c="red" id={id} bio="enhancer"/>
 <He x={180} y={100} size={25} bold color={red}>מגביר</He>
 <Protein x={202} y={145} rx={53} ry={27} c="gold" id={id} bio="activator"/>
 <He x={202} y={155} size={25} bold>מפעיל</He>
 <Protein x={332} y={222} rx={104} ry={54} c="purple" id={id} bio="mediator" t="mediator"/>
 <Protein x={468} y={299} rx={74} ry={40} id={id} bio="polii" t="Pol II"/>
 <Protein x={350} y={310} rx={40} ry={23} c="green" id={id} bio="gtf"/>
 <Box x={319} y={337} w={74} t="TATA" c="gold" id={id} bio="tata"/>
 <He x={470} y={414} size={25}>גורמי שעתוק כלליים</He>
 <He x={320} y={463} size={25}>המגביר עשוי להיות רחוק עשרות אלפי ז״ב</He>
 <He x={320} y={501} size={25}>גיוס מכונת השעתוק וגם שינויי כרומטין</He>
 <Callout n={1} x={77} y={70} tx={131.001} ty={90.618} target="enhancer"/>
 <Callout n={2} x={290} y={126} tx={256} ty={142.15} target="activator"/>
 <Callout n={3} x={487} y={190} tx={436.859} ty={215.935} target="mediator"/>
 <Callout n={4} x={592} y={276} tx={543.099} ty={295.211} target="polii"/>
 <Callout n={5} x={280} y={403} tx={318} ty={359.153} target="tata"/>
 </>;}

export function AminoacylationScene(id:string){return <><SurfaceDefs id={id}/>
 <He x={320} y={27} size={27} bold>טעינה בידי האנזים ⁦aaRS⁩</He>
 <Box x={344} y={77} w={240} t="aa + ATP" id={id} bio="substrates"/>
 <Flow id={id} d="M329 98H282" color={blue}/>
 <Box x={37} y={77} w={230} t="aa–AMP + PPᵢ" id={id} bio="activated"/>
 <He x={464} y={157} size={25}>חומצת אמינו ושפעול</He>
 <He x={155} y={157} size={25}>תוצר ביניים משופעל</He>
 <He x={320} y={202} size={25}>הידרוליזה מניעה קדימה: ⁦PPᵢ → 2 Pᵢ⁩</He>
 <Box x={344} y={252} w={240} t="aa–AMP + tRNA" c="green" id={id} bio="transfer-input"/>
 <Flow id={id} d="M329 273H282" color={green}/>
 <Box x={37} y={252} w={230} t="aa–tRNA + AMP" c="green" id={id} bio="charged"/>
 <He x={320} y={334} size={25}>העברה לקצה ⁦3′⁩ של ⁦tRNA⁩ ושחרור ⁦AMP⁩</He>
 <Protein x={460} y={427} rx={95} ry={55} c="gold" id={id} bio="editing"/>
 <He x={460} y={463} size={25} bold>אתר עריכה</He>
 <path data-bio="trna" d="M414 410h-29v-31q-21-18-36 0v30h-26q-20-15-25 3q-3 16 25 18h26v27q-13 25 5 28q18 3 18-28v-27h42" fill="none" stroke={blue} strokeWidth={5} strokeLinecap="round"/>
 <circle data-bio="wrong-aa" cx={414} cy={410} r={9} fill={`url(#${id}-surface-red)`} stroke={red} strokeWidth={2}/>
 <He x={152} y={412} size={25}>טעינה שגויה:</He>
 <He x={152} y={450} size={25}>פירוק בהידרוליזה</He>
 <He x={320} y={539} size={25}>מחיר: שני קשרים עתירי אנרגיה</He>
 <Callout n={1} x={611} y={51} tx={573.5} ty={76} target="substrates"/>
 <Callout n={2} x={23} y={51} tx={46.077} ty={76} target="activated"/>
 <Callout n={3} x={612} y={235} tx={585} ty={263.929} target="transfer-input"/>
 <Callout n={4} x={22} y={226} tx={48.923} ty={251} target="charged"/>
 <Callout n={5} x={581} y={463} tx={552.719} ty={445.913} target="editing"/>
 </>;}

export function InitiationCompareScene(id:string){return <><SurfaceDefs id={id}/>
 <He x={320} y={27} size={27} bold>בחיידקים: התאמת רצפים</He>
 <Protein x={320} y={137} rx={183} ry={57} id={id} bio="30s"/>
 <L x={475} y={143} t="30S"/>
 <path d="M39 172H603" stroke={purple} strokeWidth={5}/><L x={42} y={145} t="5′" c={purple}/>
 <Box x={150} y={151} w={139} t="AGGAGG" c="purple" id={id} bio="sd"/>
 <Box x={371} y={151} w={79} t="AUG" c="green" id={id} bio="bact-aug"/>
 <L x={219} y={235} t="UCCUCC"/><L x={118} y={235} t="3′"/><L x={310} y={235} t="5′"/><He x={468} y={238} size={25}>קצה ⁦16S rRNA⁩</He>
 <path d="M177 196v7m17-7v7m17-7v7m17-7v7m17-7v7m17-7v7" stroke={blue} strokeWidth={2}/>
 <path data-bio="initiator" d="M411 148V96h-16V79h33v17h-17" stroke={green} strokeWidth={7} fill="none"/>
 <circle cx={411} cy={68} r={11} fill={`url(#${id}-surface-gold)`} stroke={gold}/><L x={448} y={67} t="fMet" c={gold}/>
 <Protein x={335} y={115} rx={31} ry={20} c="gold" id={id} bio="if2" t="IF2"/>
 <He x={320} y={281} size={25}>בין ⁦SD⁩ ל־⁦AUG⁩: כ־⁦10⁩ נוקלאוטידים</He>
 <He x={320} y={342} size={27} bold>באאוקריוטים: קישור לכובע וסריקה</He>
 <path data-bio="bridge" d="M114 445Q99 354 318 363Q547 365 551 434" fill="none" stroke={gray} strokeWidth={3} strokeDasharray="6 5"/>
 <He x={313} y={395} size={25}>מעגל: ⁦eIF4G + PABP⁩</He>
 <path d="M69 476H588" stroke={purple} strokeWidth={5}/>
 <circle data-bio="cap" cx={56} cy={476} r={22} fill={`url(#${id}-surface-gold)`} stroke={gold} strokeWidth={2}/>
 <L x={56} y={525} t="m⁷G" c={gold}/>
 <Protein x={121} y={440} rx={47} ry={27} c="gold" id={id} bio="eif4f"/>
 <L x={121} y={446} t="eIF4F" c={gold} size={25}/>
 <Protein x={266} y={455} rx={57} ry={28} id={id} bio="43s" t="43S"/>
 <Protein x={551} y={449} rx={30} ry={23} c="purple" id={id} bio="pabp"/>
 <L x={547} y={527} t="AAAA…" c={purple}/>
 <Flow id={id} d="M336 455H393" color={blue}/><He x={369} y={437} size={25} color={blue}>סריקה</He>
 <Box x={405} y={455} w={79} t="AUG" c="green" id={id} bio="euk-aug"/>
 <L x={405} y={566} t="gccRccAUGG" c={green}/>
 <He x={320} y={608} size={25}>הקשר ⁦Kozak⁩ · סריקה מן הקצה ⁦5′⁩</He>
 <Callout n={1} x={74} y={218} tx={149.001} ty={179.75} target="sd"/>
 <Callout n={2} x={528} y={81} tx={494.366} ty={116.556} target="30s"/>
 <Callout n={3} x={175} y={529} tx={153.066} ty={462.284} target="eif4f"/>
 <Callout n={4} x={266} y={525} tx={266} ty={484.049} target="43s"/>
 <Callout n={5} x={601} y={406} tx={577.163} ty={433.809} target="pabp"/>
 </>;}
