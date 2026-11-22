import {He,La,Callout,Flow} from './ub-zoo';
export {Plate} from './p2c-scenes';
const blue='#27749a',green='#357a60',gold='#a37132',purple='#8356a2',red='#ad3e50',gray='#627587';
function L({x,y,t,c=blue,size=25}:{x:number;y:number;t:string;c?:string;size?:number}){return <La x={x} y={y} size={size} color={c} bold>{'\u2066'+t+'\u2069'}</La>;}
function Rod({x,y,w=24,h=12,bio='cell'}:{x:number;y:number;w?:number;h?:number;bio?:string}){return <g><rect data-bio={bio} x={x-w/2} y={y-h/2} width={w} height={h} rx={h/2} fill="#bfd8e6" stroke={blue} strokeWidth={2}/><path d={`M${x-w*.25} ${y-h*.2}h${w*.45}`} stroke="#eef7fb" strokeWidth={2}/></g>;}
export function BiofilmStagesScene(id:string){return <>
 <rect data-bio="surface" x={25} y={216} width={590} height={16} rx={3} fill="#d9e0e5" stroke={gray} strokeWidth={2}/>
 <He x={320} y={268} size={25}>משטח משותף · התקדמות מימין לשמאל</He>
 {[530,410,290,170].map(x=><Flow key={x} id={id} d={`M${x} 52h-38`} color={gray}/>)}
 <Rod x={564} y={177} w={34} h={16} bio="reversible"/>
 <path d="M580 177q18-20 29-4" fill="none" stroke={blue} strokeWidth={2}/>
 <Rod x={433} y={207} w={32} h={16} bio="irreversible"/><Rod x={461} y={207} w={24} h={14} bio="irreversible"/>
 <path data-bio="microcolony" d="M287 215Q290 171 318 171Q349 174 352 215Z" fill="#f2e1bd" stroke={gold} strokeWidth={2}/>
 {[[-18,202],[8,202],[-2,186]].map(([dx,y],i)=><Rod key={i} x={320+dx} y={y} w={20} h={10}/>)}
 <path data-bio="mature" d="M145 216Q146 113 174 117Q191 109 192 171L206 171Q205 108 224 101Q250 97 255 216Z" fill="#f2e1bd" stroke={gold} strokeWidth={2}/>
 <path data-bio="channel" d="M191 124Q200 145 199 188" stroke="#fff" strokeWidth={8} fill="none"/>
 {[[-34,194],[-32,161],[-23,133],[25,131],[32,164],[39,198]].map(([dx,y],i)=><Rod key={i} x={200+dx} y={y} w={18} h={10}/>)}
 <path data-bio="dispersal" d="M34 216Q39 152 65 162Q91 155 102 216Z" fill="#f2e1bd" stroke={gold} strokeWidth={2}/>
 <Rod x={53} y={197} w={19} h={10}/><Rod x={81} y={204} w={20} h={10}/>
 <Rod x={51} y={107} w={25} h={12} bio="swimmer"/><Rod x={96} y={126} w={23} h={12} bio="swimmer"/>
 <path d="M39 107q-17-16-25-6M107 125q16-18 22-5" fill="none" stroke={blue} strokeWidth={2}/>
 <Flow id={id} d="M66 157L57 128" color={blue}/>
 <Callout n={1} x={565} y={116} tx={564} ty={169} target="reversible"/>
 <Callout n={2} x={442} y={145} tx={433} ty={199} target="irreversible"/>
 <Callout n={3} x={320} y={120} tx={319} ty={171} target="microcolony"/>
 <Callout n={4} x={267} y={91} tx={224} ty={101} target="mature"/>
 <Callout n={5} x={126} y={76} tx={101} ty={121} target="swimmer"/>
 </>;}

function MatingCell({x,y,t,bio}:{x:number;y:number;t:string;bio:string}){return <g><rect data-bio={bio} x={x-64} y={y-33} width={128} height={66} rx={32} fill="#edf3f6" stroke={blue} strokeWidth={2.5}/><L x={x} y={y+64} t={t}/></g>;}
function Gene({x,y,t}:{x:number;y:number;t:string}){return <g><rect data-bio={'gene-'+t} x={x-14} y={y-13} width={28} height={26} rx={4} fill="#eae0f1" stroke={purple} strokeWidth={1.5}/><L x={x} y={y+8} t={t} c={purple}/></g>;}
export function ConjugationHfrScene(id:string){return <>
 <He x={320} y={26} size={26} bold>העברת פלסמיד חופשי</He>
 <MatingCell x={486} y={91} t="F⁺" bio="f-donor"/><MatingCell x={187} y={91} t="F⁻" bio="f-recipient"/>
 <path data-bio="bridge" d="M251 85H422" stroke={gray} strokeWidth={7}/>
 <Flow id={id} d="M409 104H265" color={gold}/>
 <circle data-bio="free-f" cx={486} cy={91} r={18} fill="#f5e8cc" stroke={gold} strokeWidth={3}/>
 <He x={327} y={149} size={25} color={gold}>עותק של ⁦F plasmid⁩</He>
 <He x={320} y={189} size={25} bold>בסיום: שני תאים ⁦F⁺⁩</He>
 <He x={320} y={243} size={26} bold>העברה מכרומוזום של ⁦Hfr⁩</He>
 <MatingCell x={486} y={310} t="Hfr" bio="hfr-donor"/><MatingCell x={187} y={310} t="F⁻" bio="hfr-recipient"/>
 <ellipse data-bio="chromosome" cx={486} cy={310} rx={43} ry={20} fill="none" stroke={purple} strokeWidth={3}/>
 <path data-bio="integrated-f" d="M444 303Q440 310 444 317" fill="none" stroke={gold} strokeWidth={8}/>
 <L x={501} y={274} t="oriT" c={gold}/>
 <path data-bio="bridge" d="M251 301H422" stroke={gray} strokeWidth={7}/>
 <Flow id={id} d="M419 331H158" color={purple}/>
 {['a','b','c','d'].map((t,i)=><Gene key={t} t={t} x={183+i*62} y={330}/>)}
 <He x={320} y={416} size={25}>סדר כניסה: ⁦a → b → c → d⁩</He>
 <He x={320} y={452} size={25}>מיפוי: זמן כניסת הגן בדקות</He>
 <Callout n={1} x={573} y={49} tx={500} ty={80} target="free-f"/>
 <Callout n={2} x={360} y={60} tx={345} ty={85} target="bridge"/>
 <Callout n={3} x={582} y={335} tx={523} ty={321} target="chromosome"/>
 <Callout n={4} x={401} y={265} tx={443} ty={305} target="integrated-f"/>
 <Callout n={5} x={103} y={380} tx={155} ty={336} target="hfr-recipient"/>
 </>;}

export function NucleotideStructureScene(){return <>
 <polygon data-bio="sugar" points="305,101 370,152 344,235 258,235 236,152" fill="#e3edf3" stroke={blue} strokeWidth={3}/>
 <path d="M236 152L199 93L144 65M370 152H439M258 235L239 288M344 235L361 288" fill="none" stroke={gray} strokeWidth={2.5}/>
 <circle data-bio="phosphate" cx={119} cy={53} r={31} fill="#f2e1bd" stroke={gold} strokeWidth={2.5}/><L x={119} y={61} t="P" c={gold}/>
 <circle cx={305} cy={101} r={16} fill="#fff" stroke={blue} strokeWidth={2}/><L x={305} y={109} t="O"/>
 <rect data-bio="base" x={439} y={126} width={153} height={53} rx={12} fill="#dcebf4" stroke={blue} strokeWidth={2.5}/><He x={516} y={161} size={28} bold>בסיס</He>
 <L x={391} y={185} t="1′" c={gray}/><L x={376} y={242} t="2′" c={gray}/><L x={231} y={242} t="3′" c={gray}/><L x={216} y={185} t="4′" c={gray}/><L x={201} y={75} t="5′" c={gray}/>
 <He x={305} y={195} size={25}>סוכר</He>
 <He x={492} y={220} size={25}>קשר ⁦N⁩-גליקוזידי</He>
 <rect data-bio="three-oh" x={190} y={288} width={97} height={39} rx={8} fill="#e5eee8" stroke={green} strokeWidth={2}/><L x={239} y={316} t="3′-OH" c={green}/>
 <rect data-bio="two-substituent" x={326} y={288} width={225} height={77} rx={8} fill="#eee5f3" stroke={purple} strokeWidth={2}/><He x={439} y={316} size={25}>ב־⁦DNA⁩: ⁦H⁩</He><He x={439} y={347} size={25}>ב־⁦RNA⁩: ⁦OH⁩</He>
 <He x={494} y={36} size={25}>פורינים: ⁦A · G⁩</He><He x={494} y={70} size={25}>שתי טבעות</He>
 <He x={137} y={387} size={25}>פירימידינים: ⁦C · T · U⁩</He><He x={137} y={421} size={25}>טבעת אחת</He>
 <Callout n={1} x={48} y={53} tx={88} ty={53} target="phosphate"/>
 <Callout n={2} x={184} y={199} tx={245} ty={184} target="sugar"/>
 <Callout n={3} x={611} y={96} tx={581} ty={130} target="base"/>
 <Callout n={4} x={168} y={320} tx={190} ty={309} target="three-oh"/>
 <Callout n={5} x={581} y={328} tx={551} ty={328} target="two-substituent"/>
 </>;}

const pairs=[['A','T'],['G','C'],['C','G'],['T','A'],['G','C'],['A','T']];
const baseFill:Record<string,string>={A:'#f1ddb7',T:'#d9eaf4',G:'#d8e9df',C:'#eadcf0'};
function HelixStrand({phase,c,bio}:{phase:number;c:string;bio:string}){const d=Array.from({length:151},(_,i)=>{const y=67+i*2;return (i?'L':'M')+(450+57*Math.sin((y-67)*Math.PI/95+phase)).toFixed(2)+' '+y;}).join('');return <path data-bio={bio} d={d} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round"/>;}
export function DoubleHelixScene(id:string){return <>
 <He x={462} y={25} size={26} bold>סליל ימני</He><He x={147} y={25} size={26} bold>גדילים פרושים</He>
 {Array.from({length:31},(_,i)=>{const y=67+i*10,a=(y-67)*Math.PI/95;return <path key={i} d={`M${450+57*Math.sin(a)} ${y}H${450+57*Math.sin(a+2.2)}`} fill="none" stroke="#c6cbd2" strokeWidth={3}/>;})}
 <HelixStrand phase={0} c={blue} bio="helix-blue"/><HelixStrand phase={2.2} c={green} bio="helix-green"/>
 <path data-bio="major-groove" d="M538 129h8v104h-8" fill="none" stroke={purple} strokeWidth={2.5}/>
 <path data-bio="minor-groove" d="M538 236h8v50h-8" fill="none" stroke={gold} strokeWidth={2.5}/>
 <He x={451} y={416} size={25}>כ־⁦10.5⁩ זוגות לסיבוב</He><He x={451} y={450} size={25}>קוטר כ־⁦2⁩ ננומטר</He>
 <path data-bio="backbone-blue" d="M59 78V462" stroke={blue} strokeWidth={6}/><path data-bio="backbone-green" d="M234 78V462" stroke={green} strokeWidth={6}/>
 <L x={59} y={61} t="5′"/><L x={59} y={502} t="3′"/><L x={234} y={61} t="3′" c={green}/><L x={234} y={502} t="5′" c={green}/>
 <Flow id={id} d="M29 172v97" color={blue}/><Flow id={id} d="M266 269v-97" color={green}/>
 {pairs.map(([l,r],i)=>{const y=[100,200,260,320,380,440][i],leftPurine=l==='A'||l==='G',lx=61,lw=leftPurine?77:52,rx=leftPurine?178:153,rw=leftPurine?54:79;return <g key={i}>
 <rect data-bio={i===0?'pair-at':i===1?'pair-gc':'base-pair'} x={lx} y={y-17} width={lw} height={34} rx={5} fill={baseFill[l]} stroke={gray}/><rect x={rx} y={y-17} width={rw} height={34} rx={5} fill={baseFill[r]} stroke={gray}/>
 <L x={lx+lw/2} y={y+9} t={l} c={gray}/><L x={rx+rw/2} y={y+9} t={r} c={gray}/>
 {(i===0||i===3||i===5?[-5,5]:[-9,0,9]).map(d=><path data-bio={i===0?'at-bonds':i===1?'gc-bonds':'h-bond'} key={d} d={`M${lx+lw+1} ${y+d}H${rx-1}`} stroke={gray} strokeWidth={1.6} strokeDasharray="4 3"/>)}
 </g>;})}
 <He x={147} y={544} size={25}>פורין מול פירימידין</He>
 <Callout n={1} x={331} y={70} tx={393} ty={210} target="helix-blue"/>
 <Callout n={2} x={604} y={180} tx={546} ty={180} target="major-groove"/>
 <Callout n={3} x={604} y={262} tx={546} ty={262} target="minor-groove"/>
 <Callout n={4} x={329} y={363} tx={234} ty={357} target="backbone-green"/>
 <Callout n={5} x={148} y={57} tx={155} ty={95} target="at-bonds"/>
 <Callout n={6} x={147} y={154} tx={148} ty={191} target="gc-bonds"/>
 </>;}

function Bead({x,y,bio='beads'}:{x:number;y:number;bio?:string}){return <g><ellipse data-bio={bio} cx={x} cy={y} rx={13} ry={17} fill="#f0d8ae" stroke={gold} strokeWidth={2}/><path d={`M${x-14} ${y-6}q14-11 28 0m-28 12q14-11 28 0`} fill="none" stroke={blue} strokeWidth={2.5}/></g>;}
export function ChromatinLevelsScene(id:string){return <>
 {[0,1].map(j=><path data-bio="duplex" key={j} d={Array.from({length:103},(_,i)=>(i?'L':'M')+(65+i*2.2)+' '+(43+9*Math.sin(i/7+j*2.2))).join('')} fill="none" stroke={j?green:blue} strokeWidth={3}/>)}
 <path d="M65 126H290" stroke={blue} strokeWidth={2.5}/>{[80,113,146,179,212,245,278].map(x=><Bead key={x} x={x} y={126}/>)}
 <rect data-bio="fiber-envelope" x={62} y={183} width={232} height={63} rx={30} fill="#f7f0e2" stroke={gray} strokeWidth={2} strokeDasharray="6 5"/>
 {[80,100,120,140,160,180,200,220,240,260,280].map((x,i)=><Bead key={x} x={x} y={214+(i%2?9:-9)} bio="fiber"/>)}
 <path d="M63 307H289" stroke={gray} strokeWidth={3}/>{[84,126,168,210,252].map((x,i)=><path data-bio="loops" key={x} d={`M${x-14} 307C${x-35} ${307+(i%2?65:-65)} ${x+35} ${307+(i%2?65:-65)} ${x+14} 307`} fill="none" stroke={blue} strokeWidth={3}/>)}
 <path data-bio="chromatid-one" d="M68 389Q136 381 175 412Q207 386 286 389L286 406Q219 406 178 426Q136 404 68 406Z" fill="#cbdfea" stroke={blue} strokeWidth={2.5}/>
 <path data-bio="chromatid-two" d="M68 444Q136 450 175 430Q207 450 286 444L286 427Q219 427 178 417Q136 430 68 427Z" fill="#d5e7db" stroke={green} strokeWidth={2.5}/>
 <circle data-bio="centromere" cx={177} cy={423} r={7} fill={gold}/>
 {[65,145,235,328].map((y,i)=><Flow key={i} id={id} d={`M338 ${y}V${[95,178,270,380][i]}`} color={gray}/>)}
 <He x={485} y={39} size={26} bold>סליל כפול</He><He x={485} y={72} size={25}>קוטר ⁦2⁩ ננומטר</He>
 <He x={485} y={118} size={26} bold>סיב ⁦10⁩ ננומטר</He><He x={485} y={151} size={25}>נוקלאוזומים על חוט</He>
 <He x={485} y={203} size={26} bold>סיב ⁦30⁩ ננומטר</He><He x={485} y={236} size={25}>במבחנה; בתא — במחלוקת</He>
 <He x={485} y={296} size={26} bold>לולאות ותחומים</He><L x={485} y={332} t="cohesin / condensin" c={gray}/>
 <He x={485} y={407} size={26} bold>כרומוזום מיטוטי</He><He x={485} y={443} size={25}>שתי כרומטידות אחיות</He>
 <Callout n={1} x={24} y={43} tx={65} ty={43} target="duplex"/>
 <Callout n={2} x={24} y={126} tx={67} ty={126} target="beads"/>
 <Callout n={3} x={24} y={214} tx={62} ty={214} target="fiber-envelope"/>
 <Callout n={4} x={24} y={284} tx={66.864} ty={275.8} target="loops"/>
 <Callout n={5} x={24} y={414} tx={68} ty={400} target="chromatid-one"/>
 </>;}

function OriginRepeat({x,y,bio,c}:{x:number;y:number;t:string;bio:string;c:string}){return <rect data-bio={bio} x={x-22} y={y-17} width={44} height={34} rx={5} fill={c===red?'#f5e1e5':'#dcebf4'} stroke={c} strokeWidth={2}/>;}
function Helicase({x,y}:{x:number;y:number}){return <g><ellipse data-bio="dnab" cx={x} cy={y} rx={19} ry={27} fill="#f0dbb5" stroke={gold} strokeWidth={3}/><ellipse cx={x} cy={y} rx={7} ry={13} fill="#fff" stroke={gold}/></g>;}
export function OricInitiationScene(id:string){return <>
 <He x={320} y={27} size={25} bold>המקור המינימלי ב־⁦E. coli⁩</He>
 <path d="M65 69H583M65 81H583" stroke={blue} strokeWidth={2} fill="none"/>
 {[100,151,202].map(x=><OriginRepeat key={x} x={x} y={75} t="13" bio="at-repeat" c={red}/>)}
 {[321,393,465,537].map(x=><OriginRepeat key={x} x={x} y={75} t="9" bio="dnaa-site" c={blue}/>)}
 <He x={149} y={135} size={25} color={red}>שלושה רצפי ⁦13 bp⁩</He><He x={149} y={166} size={25} color={red}>עשירים ב־⁦A–T⁩</He>
 <He x={441} y={135} size={25} color={blue}>ארבעה רצפי ⁦9 bp⁩</He><He x={441} y={166} size={25} color={blue}>אתרי קישור ⁦DnaA⁩</He>
 <path data-bio="open-at" d="M65 220H91Q150 167 209 220H583M65 232H91Q150 284 209 232H583" fill="none" stroke={blue} strokeWidth={3}/>
 {[310,344,378,412,446,480,514,548].map((x,i)=><ellipse data-bio="dnaa" key={x} cx={x} cy={i%2?219:234} rx={17} ry={19} fill="#e9dff0" stroke={purple} strokeWidth={2}/>)}
 <He x={430} y={285} size={25} color={purple}>מולקולות רבות של ⁦DnaA–ATP⁩</He>
 <He x={320} y={328} size={25}>קישור ⁦ATP⁩ מאפשר פתיחה של אזור ⁦13⁩</He>
 <path data-bio="bubble" d="M65 398H154Q320 296 486 398H583M65 410H154Q320 512 486 410H583" fill="none" stroke={blue} strokeWidth={3}/>
 <Helicase x={185} y={387}/><Helicase x={455} y={422}/>
 <Flow id={id} d="M152 366H98" color={gold}/><Flow id={id} d="M488 451H542" color={gold}/>
 <He x={320} y={389} size={25} color={gold}>טעינה בעזרת ⁦DnaC⁩</He>
 <He x={280} y={503} size={25} color={gold}>שני ⁦DnaB⁩ — אחד לכל מזלג</He>
 <Callout n={1} x={40} y={39} tx={84} ty={59} target="at-repeat"/>
 <Callout n={2} x={609} y={39} tx={553} ty={59} target="dnaa-site"/>
 <Callout n={3} x={599} y={262} tx={548} ty={234} target="dnaa"/>
 <Callout n={4} x={56} y={289} tx={150} ty={258} target="open-at"/>
 <Callout n={5} x={548} y={497} tx={458} ty={447} target="dnab"/>
 </>;}
