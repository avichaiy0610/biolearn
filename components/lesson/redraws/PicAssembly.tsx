/* Textbook-level redraw by Codex (2026-11-02); the previous version is archived in archive/figures/2026-11-02/. */
import { Svg, He, La } from "./helpers";
const ink='var(--ink)', muted='var(--muted)';
function Numbered({x,y,n}:{x:number;y:number;n:number}){return <g><circle cx={x} cy={y-6} r={12} fill={ink}/><La x={x} y={y} size={16} color="var(--paper)" bold>{n}</La></g>;}
function TBP({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`}><path d="M-35 16C-47-19-26-39-5-24Q0-19 5-24C26-39 47-19 35 16L23 21Q14-7 0-3Q-14-7-23 21Z" fill="#e8b46c" stroke="#956328" strokeWidth={1.8}/><path d="M-28-8Q-20-24-9-17M28-8Q20-24 9-17" fill="none" stroke="#f5d39c" strokeWidth={4} strokeLinecap="round"/></g>;}
function Polymerase(){return <g>
{/* Two asymmetrical jaws leave a visible active-centre cleft around promoter DNA. */}
<path d="M244 490C212 472 220 422 247 407C249 380 286 372 302 391C331 370 360 391 358 415C388 428 385 453 366 466L330 454L308 478L288 466L271 488L275 500L278 535L296 518L310 519L327 536L350 517C369 523 379 544 357 562C366 581 347 601 316 591C308 603 277 614 262 590C232 582 226 544 241 529C225 515 228 498 244 490Z" fill="#8bbcd6" stroke="#3a7295" strokeWidth={2}/>

<path d="M251 411Q269 395 285 409M322 397Q345 395 348 418M244 568Q258 587 275 585" fill="none" stroke="#d4e7ef" strokeWidth={6} strokeLinecap="round"/>
<path d="M278 535L296 518L310 519L327 536" fill="none" stroke="#598ea9" strokeWidth={3}/>
</g>;}
export function PicAssembly(){return <Svg w={600} h={1110} label="קומפלקס הטרום-התחלה של RNA פולימראז II: TFIID (עם TBP) נקשר ראשון לתיבת TATA, אחריו TFIIA ו-TFIIB, הפולימראז עם TFIIF, TFIIE ובסוף TFIIH, שפותח את ה-DNA ומזרחן את ה-CTD">
<defs><marker id="pic-tip" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#ac7033"/></marker></defs>
<rect width={600} height={1110} fill="var(--paper)"/>
<He x={300} y={35} size={24} bold>הרכבת קומפלקס הטרום־התחלה</He>
<La x={300} y={63} size={19} color={muted}>RNA polymerase II · PIC</La>
<rect x={16} y={86} width={568} height={222} rx={14} fill="var(--panel)"/>
<He x={300} y={120} size={20} bold>זיהוי הפרומוטור וכיפוף ה-⁦DNA⁩</He>
{/* TAFs form an irregular scaffold; TBP contacts the bent minor groove. */}
<path d="M211 191Q195 176 209 159Q220 145 238 153Q250 132 269 149Q290 139 302 156Q326 151 334 169L318 198L299 203L286 180L254 175L238 201Z" fill="#c9bde0" stroke="#7f6b9d" strokeWidth={1.5}/>
<path d="M71 250H180Q200 250 223 227L246 210Q257 204 272 215L298 239Q310 250 335 250H530M71 262H180Q204 262 232 239L254 222Q259 219 264 224L288 248Q308 262 335 262H530" stroke="#4089b7" strokeWidth={3.3} fill="none"/>
<TBP x={260} y={202}/>
<La x={388} y={175} size={18} bold>TFIID</La><La x={390} y={199} size={16} color={muted}>TBP + TAFs</La>
<La x={164} y={183} size={18} bold>TBP</La><La x={260} y={289} size={18} bold>TATA</La>
<rect x={16} y={326} width={568} height={374} rx={14} fill="var(--panel)"/>
<He x={300} y={360} size={20} bold>הקומפלקס המלא: ⁦DNA⁩ בתוך המִבקע</He>
{/* The flexible CTD exits the polymerase and reaches a separate phosphorylation inset. */}
<path d="M275 396C270 372 292 374 305 384C327 402 342 380 357 391C371 400 385 388 397 396" fill="none" stroke="#659dbd" strokeWidth={3} strokeLinecap="round"/>
<La x={410} y={394} size={17} anchor="start" bold>CTD</La>
<Polymerase/>
{/* Upstream TAF scaffold and saddle TBP, A on upstream side, B toward polymerase. */}
<path d="M79 474C61 451 78 425 101 433C111 407 139 419 145 436C174 422 194 448 179 469L163 484L139 471L115 481Z" fill="#c9bde0" stroke="#7f6b9d" strokeWidth={1.5}/>
<path d="M60 503Q41 488 48 473Q59 459 76 469L89 493L81 510Z" fill="#a6bda7" stroke="#62846a" strokeWidth={1.5}/>
<path d="M174 479Q180 455 198 459L210 477L233 484L225 501L203 493L196 512L182 503Z" fill="#ce9a8c" stroke="#985c50" strokeWidth={1.5}/>
<TBP x={137} y={492}/>
{/* TFIIF follows the polymerase shoulder; TFIIE bridges to downstream TFIIH. */}
<path d="M351 435Q360 412 378 420Q397 425 392 442L376 449L375 469L358 474L347 459Z" fill="#b2a2c9" stroke="#7b6698" strokeWidth={1.5}/>
<path d="M363 466Q379 460 391 474Q413 472 431 480L448 493Q439 509 419 508Q400 507 389 496L370 487Q358 484 363 466Z" fill="#e0b29c" stroke="#a6745c" strokeWidth={1.5}/>
<path d="M429 462Q424 438 447 434Q463 419 478 438Q501 427 512 449Q537 451 531 473Q550 493 526 507Q540 520 521 532Q510 543 495 539Q482 554 463 543Q445 539 449 519L431 500Z" fill="#99c6b1" stroke="#4a8970" strokeWidth={1.8}/>
<path d="M450 463Q463 444 478 459L486 483L469 495L450 482Z" fill="#c1ddcd" stroke="#72a38c" strokeWidth={1.2}/><path d="M492 449Q516 443 518 465L511 485L492 479Z" fill="#b2d6c4" stroke="#72a38c" strokeWidth={1.2}/>
{/* The XPB-containing lower lobe engages downstream duplex DNA; TFIIE above bridges
    the polymerase shoulder and the left face of TFIIH rather than floating between them. */}
<path d="M460 507C470 493 491 498 497 512L510 523Q511 535 497 543L473 540Q460 535 460 520Z" fill="#c1ddcd" stroke="#72a38c" strokeWidth={1.2}/>
<La x={485} y={529} size={14} color="#25364a" bold>XPB</La>
{/* Promoter DNA bends at TBP and enters the polymerase cleft, continuing downstream. */}
<path d="M41 558H83L125 521Q137 510 148 523L181 548H247L277 510H325L354 539H559M41 569H83L127 534Q137 525 143 535L176 559H253L283 521H320L350 550H559" fill="none" stroke="#4089b7" strokeWidth={3.5}/>
<La x={99} y={407} size={17} bold>TFIID</La><La x={55} y={449} size={17} bold>A</La><La x={201} y={438} size={17} bold>B</La><La x={412} y={421} size={17} bold>F</La><La x={406} y={458} size={17} bold>E</La><La x={493} y={415} size={18} bold>TFIIH</La>
<La x={302} y={447} size={21} color="#25364a" bold>Pol II</La><La x={135} y={587} size={17} bold>TATA</La><La x={302} y={502} size={16} bold>+1</La>
<He x={300} y={636} size={18}>⁦TFIIH⁩ פותח את ה-⁦DNA⁩ ומזרחן את ה-⁦CTD⁩</He>
<He x={300} y={672} size={16} color={muted}>הצורות מראות מיקום ומגעים • אינן מבנה אטומי</He>
<rect x={16} y={718} width={568} height={139} rx={14} fill="var(--panel)"/>
<He x={300} y={750} size={20} bold>⁦CTD⁩: זרחון ⁦Ser5⁩</He>
<path d="M75 798C100 776 116 819 141 798S182 819 207 798S248 819 273 798" stroke="#659dbd" strokeWidth={4} fill="none"/>
{[118,190,262].map(x=><g key={x}><path d={`M${x} 784v9`} stroke="#ac7b2d" strokeWidth={1.5}/><circle cx={x} cy={775} r={9} fill="#edc66b" stroke="#ac7b2d" strokeWidth={1.4}/></g>)}
<La x={418} y={789} size={19} bold>TFIIH · CDK7</La>
<He x={418} y={824} size={16} color={muted}>קינאז מוסיף פוספט</He>
<La x={175} y={838} size={16} color={muted}>Ser5-P</La>
<rect x={16} y={875} width={568} height={189} rx={14} fill="var(--panel)"/>
<He x={300} y={907} size={19} bold>המספרים — סדר ההרכבה הקלאסי</He>
<Numbered x={45} y={944} n={1}/><La x={160} y={944} size={18}>TFIID (TBP)</La>
<Numbered x={45} y={981} n={2}/><La x={160} y={981} size={18}>TFIIA (A)</La>
<Numbered x={45} y={1018} n={3}/><La x={160} y={1018} size={18}>TFIIB (B)</La>
<Numbered x={315} y={944} n={4}/><La x={447} y={944} size={18}>Pol II + TFIIF (F)</La>
<Numbered x={315} y={981} n={5}/><La x={447} y={981} size={18}>TFIIE (E)</La>
<Numbered x={315} y={1018} n={6}/><La x={447} y={1018} size={18}>TFIIH</La>
<He x={300} y={1048} size={15} color={muted}>סדר ההרכבה הקלאסי במבחנה; בתא קיימים מסלולים נוספים</He>
<He x={300} y={1092} size={15} color={muted}>איור מקורי סכמטי • מבנים ומרחקים אינם בקנה מידה</He>
</Svg>;}




