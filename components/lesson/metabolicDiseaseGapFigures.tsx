/* Original textbook-informed drawings. Sources and deliberate simplifications:
   visual-lab/metabolic-disease-gaps/learning-card.md. */
import type React from "react";
import { He, La, BLUE, ORANGE, GREEN, INK, MUTED } from "./biochemFigures";
const RED = "#b91c1c", PURPLE = "#7c3aed", TEAL = "#0f766e";
const P = { blue: "#eff6ff", green: "#f0fdf4", orange: "#fff7ed", purple: "#f5f3ff", red: "#fff1f2" };
type LabelProps = { x: number; y: number; children: React.ReactNode; c?: string; bold?: boolean; s?: number };
function H({ x, y, children, c = INK, bold, s = 20 }: LabelProps) { return <He x={x} y={y} size={s} color={c} bold={bold}>{children}</He>; }
function L({ x, y, children, c = INK, bold, s = 20 }: LabelProps) { return <La x={x} y={y} size={s} color={c} bold={bold}>{children}</La>; }
function S({ d, c = INK, w = 2, dash }: { d: string; c?: string; w?: number; dash?: string }) { return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />; }
function Arrow(p: { d: string; x: number; y: number; a?: number; c?: string; stop?: boolean }) { /* Arrowhead is translated independently of the shaft. */ return <g><S d={p.d} c={p.c} /><g transform={`translate(${p.x} ${p.y}) rotate(${p.a ?? 0})`}><S d={p.stop ? "M0 -9 V9" : "M-8 -5 L0 0 L-8 5"} c={p.c} /></g></g>; }
function Frame({ label, h, mh, draw }: { label: string; h: number; mh: number; draw: (m: boolean) => React.ReactNode }) { return <div className="md-gap-figure" style={{ width: "100%" }}><style>{`.md-gap-figure svg{display:block;width:100%;height:auto;background:white}.md-gap-figure .md-mobile{display:none}@media(max-width:640px){.md-gap-figure .md-desktop{display:none}.md-gap-figure .md-mobile{display:block}}`}</style>{[false, true].map(m => <svg key={String(m)} className={m ? "md-mobile" : "md-desktop"} viewBox={`0 0 ${m ? 480 : 720} ${m ? mh : h}`} role="img" aria-label={label}><title>{label}</title>{draw(m)}</svg>)}</div>; }
function Chip({ x, y, w = 160, c = BLUE, children, latin = false }: { x: number; y: number; w?: number; c?: string; children: React.ReactNode; latin?: boolean }) { return <g><rect x={x - w / 2} y={y - 24} width={w} height={40} rx={10} fill="white" stroke={c} strokeWidth={1.6} />{latin ? <L x={x} y={y + 3} c={c} bold>{children}</L> : <H x={x} y={y + 3} c={c} bold>{children}</H>}</g>; }
function Protein({ x, y, c = BLUE, kind = "channel", flip = false }: { x: number; y: number; c?: string; kind?: "channel" | "pump" | "carrier" | "barrel"; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(1 ${flip ? -1 : 1})`}>
    {kind === "channel" && <path d="M-17 -25 Q-32 -12 -19 0 Q-33 24 -10 28 L-7 -24 Z M17 -25 Q32 -12 19 0 Q33 24 10 28 L7 -24Z" fill={P.blue} stroke={c} strokeWidth={2} />}
    {kind === "pump" && <g><path d="M-17 -23 Q-25 -33 -29 -14 L-24 12 Q-40 33 -21 43 Q-1 52 13 34 Q37 37 34 15 Q32 2 18 8 L20 -20 Q13 -31 6 -19 L3 10 H-5 V-20Z" fill="#dcfce7" stroke={c} strokeWidth={2} /><S d="M-19 26 Q-9 15 2 26 M15 17 l10 3" c={c} w={1.2} /></g>}
    {kind === "carrier" && <g><path d="M-12 -29 Q-31 -24 -22 -5 L-17 6 Q-27 25 -10 30 L8 29 Q29 22 19 6 L23 -12 Q29 -30 10 -29Z" fill="#e0f2f1" stroke={c} strokeWidth={2} /><S d="M-9 -22 Q2 -13 -9 -2 Q-19 9 -7 22 M10 -22 Q-1 -11 10 0 Q20 12 8 22" c={c} w={1.2} /></g>}
    {kind === "barrel" && <g><path d="M-17 -25 Q0 -35 17 -25 L22 23 Q0 35 -22 23Z" fill={P.purple} stroke={c} strokeWidth={2} /><ellipse cy={-24} rx={16} ry={6} fill="white" stroke={c} strokeWidth={1.2} /><S d="M-15 -17 L-18 20 M-7 -17 L-8 26 M7 -17 L8 26 M15 -17 L18 20" c={c} w={1.3} /></g>}
  </g>;
}
function Bilayer({ x, y, w, gaps = [], c = TEAL }: { x: number; y: number; w: number; gaps?: number[]; c?: string }) { return <g><rect x={x} y={y - 12} width={w} height={24} fill="#e0f2f1" />{Array.from({ length: Math.floor(w / 12) }, (_, i) => x + 6 + i * 12).filter(z => gaps.every(g => Math.abs(z - g) > 25)).map(z => <g key={z}><S d={`M${z - 2} ${y - 8} v6 m4 -6 v6 M${z - 2} ${y + 8} v-6 m4 6 v-6`} c={c} w={1} /><circle cx={z} cy={y - 12} r={3.5} fill="#99d6d0" /><circle cx={z} cy={y + 12} r={3.5} fill="#99d6d0" /></g>)}</g>; }
function Ion({ x, y, c = BLUE }: { x: number; y: number; c?: string }) { return <circle cx={x} cy={y} r={4} fill={c} />; }

function PkuBlock() { return <Frame h={780} mh={1040} label="PKU: חסימת PAH, מסלול פנילקטונים, צורך בטירוזין ותחרות בנשא LAT1 במחסום דם–מוח" draw={m => {
  const w = m ? 480 : 720, phe = m ? 105 : 160, tyr = m ? 365 : 545, by = m ? 435 : 360, brain = m ? 735 : 520;
  return <g><H x={w / 2} y={33} s={26} bold>חסימה אחת, שתי השלכות</H>
    <path d={`M35 110 Q${w / 2} 66 ${w - 35} 110 V${by + 135} Q${w / 2} ${by + 165} 35 ${by + 135}Z`} fill={P.orange} />
    <H x={w / 2} y={95} c={ORANGE}>בכבד · המצע מצטבר והתוצר חסר</H>
    <Chip x={phe} y={168} w={m ? 150 : 200} c={RED}>פניל־אלנין</Chip><L x={phe} y={208} c={RED} bold>Phe ↑</L>
    <Chip x={tyr} y={168} w={m ? 140 : 190} c={GREEN}>טירוזין</Chip><L x={tyr} y={208} c={GREEN}>Tyr ↓</L>
    <Arrow d={`M${phe + (m ? 85 : 112)} 167 H${tyr - (m ? 81 : 108)}`} x={tyr - (m ? 81 : 108)} y={167} c={MUTED} />
    <L x={w / 2} y={134} bold>PAH · BH₄</L><S d={`M${w / 2 - 9} 153 l18 28 m-18 0 l18 -28`} c={RED} w={3} />
    <H x={w / 2} y={239} c={RED}>חסימה ב־PKU</H>
    <Arrow d={`M${tyr} ${m ? 270 : 247} V225`} x={tyr} y={225} a={-90} c={GREEN} /><H x={tyr} y={m ? 296 : 270} c={GREEN} bold>טירוזין מהמזון</H><H x={tyr} y={m ? 323 : 298} c={GREEN}>נעשה חיוני</H>
    <Arrow d={`M${phe} 221 V${by - 45}`} x={phe} y={by - 45} a={90} c={RED} /><H x={phe + (m ? 58 : 92)} y={by - 75} s={19} c={RED}>טרנסאמינציה</H>
    <H x={phe} y={by} bold c={RED}>פניל־פירובט</H>
    <Arrow d={`M${phe} ${by + 13} V${by + 41}`} x={phe} y={by + 41} a={90} c={RED} />
    <H x={phe} y={by + 70} s={19}>פניל־לקטט / פניל־אצטט</H><H x={phe} y={by + 112} c={RED} bold>הפרשה בשתן</H>
    <Arrow d={`M${tyr} ${m ? 338 : 315} V${by - 20}`} x={tyr} y={by - 20} a={90} c={GREEN} />
    <H x={tyr} y={by + 11} s={19}>דופמין וקטכולאמינים</H><H x={tyr} y={by + 43} s={19}>מלנין</H><H x={tyr} y={by + 91} s={19} c={MUTED}>תוצרים של טירוזין</H>
    <Arrow d={`M${phe - 30} 221 H${m ? 6 : 18} V${brain + 79} H${(m ? 113 : 175) - 50}`} x={(m ? 113 : 175) - 50} y={brain + 79} c={RED} />
    <g transform={`translate(0 ${brain})`}><H x={w / 2} y={21} bold>מחסום דם–מוח: נשא משותף</H>
      <H x={m ? 40 : 70} y={65}>דם</H><H x={w - 68} y={145}>מוח</H>
      <Bilayer x={35} y={100} w={w - 70} gaps={[w / 2]} /><Protein x={w / 2} y={100} c={PURPLE} />
      <L x={w / 2} y={61} c={PURPLE} bold>LAT1</L>
      <L x={m ? 113 : 175} y={85} c={RED} bold>Phe ↑↑</L><L x={m ? 113 : 175} y={55}>Tyr · Trp</L>
      <Arrow d={`M${w / 2} 68 V143`} x={w / 2} y={143} a={90} c={PURPLE} />
      <Arrow d={`M${m ? 166 : 235} 78 H${w / 2 - 34}`} x={w / 2 - 34} y={78} c={RED} />
      <H x={w / 2} y={185} s={m ? 19 : 20}>עודף פניל־אלנין מגביל כניסת חומצות אמינו</H>
      <H x={w / 2} y={218} s={m ? 19 : 20}>פחות טירוזין וטריפטופן זמינים למוח</H></g>
    <H x={w / 2} y={m ? 1020 : 766} s={19} c={MUTED}>החצים מתארים מסלולים; אינם מציינים קצב</H>
  </g>;
}} />; }

function UreaCycleBypass() { return <Frame h={815} mh={1165} label="מעגל האוריאה בשני מדורים, חסר ASL וסילוק חנקן באמצעות ארגינינוסוקצינט או מצמידי גליצין וגלוטמין" draw={m => {
  const w = m ? 480 : 720, right = m ? 356 : 505, left = m ? 110 : 165, cy = m ? 410 : 350, bottom = m ? 807 : 600;
  return <g><H x={w / 2} y={32} s={26} bold>מעגל האוריאה ודרכי סילוק החנקן</H>
    <path d={`M32 83 Q${w / 2} 62 ${w - 32} 83 V245 Q${w / 2} 276 32 245Z`} fill={P.blue} stroke={BLUE} strokeWidth={2} />
    <H x={w / 2} y={100} c={BLUE} bold>מטריקס המיטוכונדריה</H>
    <L x={left} y={139} c={BLUE}>NH₄⁺ + HCO₃⁻</L><Arrow d={`M${left} 153 V179`} x={left} y={179} a={90} c={BLUE} />
    <L x={left + (m ? 70 : 98)} y={172} c={BLUE}>CPS I</L><H x={left} y={211} s={19}>קרבמויל־פוספט</H>
    <Arrow d={`M${left + 83} 209 H${right - 70}`} x={right - 70} y={209} c={BLUE} /><L x={(left + right) / 2 + 25} y={191} c={BLUE}>OTC</L>
    <H x={right} y={211}>ציטרולין</H><H x={right} y={301}>ציטרולין</H><Arrow d={`M${right} 227 V274`} x={right} y={274} a={90} c={BLUE} />
    <H x={left} y={301}>אורניתין</H><Arrow d={`M${left} 276 V262 H${(left + right) / 2} V220`} x={(left + right) / 2} y={220} a={-90} c={BLUE} />
    <H x={w / 2} y={m ? 350 : 335} c={MUTED}>ציטוזול</H>
    <Arrow d={`M${right} 316 V${cy - 25}`} x={right} y={cy - 25} a={90} c={BLUE} /><L x={right + (m ? 58 : 68)} y={cy - 40} c={BLUE}>ASS</L>
    <H x={right} y={cy + 8} s={m ? 19 : 20}>ארגינינוסוקצינט</H>
    <H x={w / 2} y={cy - (m ? 31 : -55)} s={19} c={GREEN}>אספרטט · חנקן שני</H>
    <Arrow d={m ? `M240 ${cy - 15} H290` : `M365 ${cy + 19} H433`} x={m ? 290 : 433} y={cy + (m ? -15 : 19)} c={GREEN} />
    <Arrow d={`M${right - 23} ${cy + 27} Q${right - 50} ${cy + 106} ${left + 50} ${cy + 106}`} x={left + 50} y={cy + 106} a={180} c={MUTED} />
    <L x={w / 2} y={cy + 80} c={RED} bold>ASL</L><S d={`M${w / 2 - 8} ${cy + 96} l16 18 m-16 0 l16 -18`} c={RED} w={3} /><L x={w / 2} y={cy + 148} s={19}>+ fumarate</L>
    <H x={left} y={cy + 111}>ארגינין</H>
    <Arrow d={`M${left} ${cy + 85} V328`} x={left} y={328} a={-90} c={GREEN} /><L x={left + 52} y={cy + 40} s={19} c={GREEN}>arginase</L>
    <H x={left - 48} y={cy + 5} s={19} c={GREEN}>אוריאה</H><Arrow d={`M${left - 5} ${cy + 37} H${left - 48} V${cy + 17}`} x={left - 48} y={cy + 17} a={-90} c={GREEN} />
    <H x={left} y={cy + 170} c={GREEN}>ארגינין תזונתי</H><Arrow d={`M${left} ${cy + 145} V${cy + 130}`} x={left} y={cy + 130} a={-90} c={GREEN} />
    <Arrow d={`M${right + (m ? 0 : 114)} ${cy + (m ? 31 : 5)} V${cy + 165}`} x={right + (m ? 0 : 114)} y={cy + 165} a={90} c={RED} />
    <H x={m ? right : right + 60} y={cy + 196} c={RED} s={19} bold>לשתן בחסר ASL</H>
    <H x={w / 2} y={cy + (m ? 237 : 222)} s={19}>שני חנקנים עודפים: מקרבמויל־פוספט ומאספרטט</H>
    <g transform={`translate(0 ${bottom})`}><rect x={22} y={-15} width={w - 44} height={m ? 314 : 185} rx={18} fill={P.purple} />
      <H x={w / 2} y={15} c={PURPLE} bold>בחסר CPS I / OTC: מסלולים מחוץ למעגל</H>
      {[0, 1].map(i => { if (!m) { const xx = i ? 530 : 183; return <g key={i}>
        <H x={xx} y={55} s={19}>{i ? "פניל־אצטט + גלוטמין" : "בנזואט + גליצין"}</H>
        <Arrow d={`M${xx} 68 V87`} x={xx} y={87} a={90} c={PURPLE} />
        <H x={xx} y={i ? 112 : 125} s={19} c={PURPLE}>{i ? "פניל־אצטיל־" : "היפוראט"}</H>
        {i === 1 && <H x={xx} y={137} s={19} c={PURPLE}>גלוטמין</H>}
        <H x={xx} y={170} s={19} c={PURPLE}>{i ? "לשתן · 2 אטומי חנקן" : "לשתן · אטום חנקן אחד"}</H>
      </g>; } const yy = 67 + i * 128; return <g key={i}>
        <H x={m ? 137 : 165} y={yy} s={19}>{i ? "פניל־אצטט + גלוטמין" : "בנזואט + גליצין"}</H>
        <Arrow d={`M${m ? 243 : 291} ${yy - 6} H${m ? 276 : 367}`} x={m ? 276 : 367} y={yy - 6} c={PURPLE} />
        <H x={m ? 353 : 520} y={yy} s={19} c={PURPLE}>{i ? "פניל־אצטיל־" : "היפוראט"}</H>
        {i === 1 && <H x={m ? 353 : 520} y={yy + 25} s={19} c={PURPLE}>גלוטמין</H>}
        <H x={m ? 240 : 520} y={yy + (m ? 61 : i ? 51 : 28)} s={19} c={PURPLE}>{i ? "לשתן · 2 אטומי חנקן" : "לשתן · אטום חנקן אחד"}</H>
      </g>; })}</g>
    <H x={w / 2} y={m ? 1145 : 803} s={19} c={MUTED}>מסלולים חלופיים; החסימות אינן מתרחשות יחד</H>
  </g>;
}} />; }

function CreatineShuttle() { return <Frame h={700} mh={1140} label="יחידת אנרגיה בתא לב: ATP synthase ו־ANT בממברנה הפנימית, MtCK במרווח, VDAC וטובולין בחיצונית ושאטל PCr אל CK בציטוזול" draw={m => {
  const w = m ? 480 : 720, ox = m ? 10 : 20, oy = 112, cx = m ? 240 : 530, cy = m ? 720 : 235;
  return <g><H x={w / 2} y={32} s={26} bold>אנרגיה מגיעה לעבודה דרך קריאטין</H>
    <H x={w / 2} y={67} c={MUTED}>יחידה מקומית בקרדיומיוציט</H>
    <g transform={`translate(${ox} ${oy})`}>
      <path d="M50 35 C-5 75 0 350 55 389 Q165 425 342 381 V46 Q172 0 50 35Z" fill={P.blue} stroke={BLUE} strokeWidth={2.6} />
      <path d="M62 77 C30 100 31 311 63 344 H123 V278 H145 V344 H206 V279 H229 V344 H245 V83 H218 V140 H197 V83 H136 V142 H114 V83Z" fill="#dbeafe" stroke={TEAL} strokeWidth={2} />
      <H x={137} y={47} c={BLUE}>מיטוכונדריה</H><H x={122} y={245} s={19} c={TEAL}>מטריקס</H>
      <Protein x={246} y={161} c={TEAL} kind="carrier" /><L x={166} y={166} bold c={TEAL}>ANT</L>
      <g transform="translate(74 158)"><path d="M-11 -12 H11 V13 H-11Z" fill="#99d6d0" stroke={TEAL} strokeWidth={2} /><S d="M0 13 V30" c={TEAL} w={3} /><ellipse cy={41} rx={25} ry={15} fill="white" stroke={TEAL} strokeWidth={2} /></g>
      <L x={117} y={376} s={19} c={TEAL}>ATP synthase</L><S d="M82 218 V350" c={TEAL} />
      <L x={157} y={115} c={ORANGE} bold>ATP</L><Arrow d="M183 148 H263" x={263} y={148} c={ORANGE} />
      <L x={157} y={211} c={BLUE}>ADP</L><Arrow d="M263 179 H187" x={187} y={179} a={180} c={BLUE} />
      <path d="M260 189 q20 -24 42 0 l7 29 -28 16 -28 -16Z" fill="#ffedd5" stroke={ORANGE} strokeWidth={2} /><L x={282} y={270} c={ORANGE} bold>MtCK</L>
      <Arrow d="M269 148 Q286 150 286 170" x={286} y={170} a={90} c={ORANGE} /><Arrow d="M263 220 Q235 227 238 200" x={238} y={200} a={-90} c={BLUE} />
      <Arrow d="M309 225 H318 V301 H304" x={304} y={301} a={180} c={ORANGE} />
      <Arrow d="M282 325 H251 V235 H264" x={264} y={235} c={BLUE} />
      <Protein x={342} y={308} c={PURPLE} kind="barrel" /><L x={m ? 397 : 284} y={m ? 266 : 364} c={PURPLE} bold>VDAC</L>
      <circle cx={326} cy={353} r={10} fill="#ddd6fe" stroke={PURPLE} /><circle cx={344} cy={353} r={10} fill="#c4b5fd" stroke={PURPLE} />
      <H x={m ? 381 : 350} y={418} s={19} c={PURPLE}>טובולין</H><H x={221} y={447} s={19}>מגביל מעבר ADP דרך VDAC</H>
      <H x={170} y={481} s={19} c={MUTED}>MtCK במרווח הבין־ממברנלי</H>
    </g>
    <g transform={`translate(${cx} ${cy})`}>
      <H x={0} y={-93} bold c={GREEN}>ליד צרכני האנרגיה</H>
      <L x={0} y={-48} c={ORANGE} bold>PCr + ADP</L>
      <Arrow d="M0 -32 V-7" x={0} y={-7} a={90} c={ORANGE} /><Chip x={0} y={24} w={100} c={ORANGE} latin>CK</Chip>
      <L x={0} y={87} c={GREEN} bold>Cr + ATP</L><Arrow d="M0 44 V62" x={0} y={62} a={90} c={GREEN} />
      <Arrow d="M0 102 V131" x={0} y={131} a={90} c={GREEN} />
      <H x={0} y={159}>מיוזין · התכווצות</H><H x={0} y={196}>SERCA · אגירת סידן</H>
      <Arrow d="M106 159 H153 V-48 H92" x={92} y={-48} a={180} c={BLUE} /><L x={118} y={10} s={19} c={BLUE}>ADP</L>
      <S d="M-119 216 Q-135 258 -119 307 H119 Q135 258 119 216" c={GREEN} w={3} />
      <g transform="translate(-111 230)"><rect width={222} height={66} rx={13} fill={P.orange} stroke={ORANGE} strokeWidth={2} />{[16, 52, 88, 124, 160, 196].map(x => <S key={x} d={`M${x} 6 V60`} c={ORANGE} w={1.4} />)}<S d="M10 23 H212 M10 43 H212" c={RED} w={3} /></g>
      <H x={0} y={327} s={19} c={ORANGE}>מיופיבריל · ATP נצרך מקומית</H>
    </g>
    {m ? <g><L x={370} y={639} c={ORANGE} bold>PCr ↓</L><Arrow d="M292 413 H451 V672 H318" x={318} y={672} a={180} c={ORANGE} /><L x={365} y={765} c={BLUE}>Cr ↑</L><Arrow d="M300 807 H430 V437 H292" x={292} y={437} a={180} c={BLUE} /></g> : <g><L x={420} y={290} c={ORANGE} bold>PCr</L><Arrow d="M302 413 H397 V191 H463" x={463} y={191} c={ORANGE} /><L x={385} y={480} c={BLUE} bold>Cr</L><Arrow d="M476 327 H440 V437 H302" x={302} y={437} a={180} c={BLUE} /></g>}
    <L x={w / 2} y={m ? 1092 : 650} s={20}>MtCK: ATP + Cr → ADP + PCr</L>
    <H x={w / 2} y={m ? 1123 : 687} s={19} c={MUTED}>צימוד מקומי; הממדים והקפלים סכמטיים</H>
  </g>;
}} />; }

function CalciumFluxes() { return <Frame h={835} mh={1120} label="שטפי סידן דרך ממברנת התא, ER/SR ומיטוכונדריה, חיישן קלמודולין ומסלול PLC–IP3–DAG" draw={m => {
  const w = m ? 480 : 720, er = m ? 638 : 480, erW = m ? 405 : 453, mitoX = m ? 308 : 600, mitoY = m ? 902 : 602;
  return <g><H x={w / 2} y={32} s={26} bold>אות סידן: כניסה, חישה ופינוי</H><L x={w / 2} y={69} c={BLUE}>Ca²⁺: ~1–2 mM</L><H x={w / 2} y={99} c={BLUE}>מחוץ לתא</H>
    <path d={`M27 157 V${m ? 1076 : 685} Q${w / 2} ${m ? 1110 : 710} ${w - 27} ${m ? 1076 : 685} V157Z`} fill="#f8fafc" />
    <Bilayer x={27} y={161} w={w - 54} gaps={m ? [92, 240, 385] : [112, 350, 585]} />
    {[m ? 92 : 112, m ? 240 : 350, m ? 385 : 585].map((x, i) => <g key={x}><Protein x={x} y={161} c={i ? GREEN : BLUE} kind={i === 1 ? "pump" : i === 2 ? "carrier" : "channel"} />{i ? <L x={x} y={125} s={19} bold c={GREEN}>{i === 1 ? "PMCA" : "NCX"}</L> : <H x={x} y={125} s={19} bold c={BLUE}>תעלת סידן</H>}<Arrow d={`M${x} ${i ? 207 : 133} V${i ? 130 : 207}`} x={x} y={i ? 130 : 207} a={i ? -90 : 90} c={i ? GREEN : BLUE} /></g>)}
    <L x={m ? 240 : 350} y={242} s={19} c={GREEN}>ATP</L><L x={m ? 385 : 585} y={242} s={19} c={GREEN}>3 Na⁺ ↓ / Ca²⁺ ↑</L>
    <H x={m ? 118 : 174} y={270} bold>ציטוזול במנוחה</H><L x={m ? 118 : 174} y={300} c={BLUE} bold>Ca²⁺ ~100 nM</L>
    <g transform={`translate(65 ${m ? 370 : 356})`}><L x={0} y={0} c={PURPLE}>PIP₂</L><L x={106} y={30} c={PURPLE} bold>PLC</L><Arrow d="M41 -7 H136" x={136} y={-7} c={PURPLE} />
      <L x={211} y={-39} c={PURPLE}>DAG</L><L x={200} y={51} c={PURPLE}>IP₃</L>
      <Arrow d="M141 -9 Q163 -37 178 -43" x={178} y={-43} a={-20} c={PURPLE} /><Arrow d="M141 0 Q163 25 178 28" x={178} y={28} a={10} c={PURPLE} />
      <L x={m ? 331 : 515} y={-39} c={PURPLE} bold>PKC</L><Arrow d={`M243 -45 H${m ? 298 : 480}`} x={m ? 298 : 480} y={-45} c={PURPLE} />
      <L x={m ? 331 : 515} y={-7} s={19}>+ Ca²⁺</L>
    </g>
    <Arrow d={m ? `M249 435 H40 V${er - 13} H91` : `M247 414 H159 V${er - 73} H83 V${er - 13} H91`} x={91} y={er - 13} c={PURPLE} />
    <g transform={`translate(38 ${er})`}><path d={`M0 0 Q${erW / 2} -27 ${erW} 0 V105 Q${erW / 2} 128 0 105Z`} fill="#e0f2f1" stroke={TEAL} strokeWidth={2} />
      <Bilayer x={8} y={0} w={erW - 16} gaps={[80, 205, 330]} /><H x={erW / 2} y={60} c={TEAL} bold>מאגר ER / SR</H><L x={erW / 2} y={94} c={TEAL}>Ca²⁺ ~1–2 mM*</L>
      {[80, 205, 330].map((x, i) => <g key={x}><Protein x={x} y={0} c={i === 2 ? GREEN : BLUE} kind={i === 2 ? "pump" : "channel"} flip={i === 2} /><L x={x} y={i === 2 ? -58 : -47} bold c={i === 2 ? GREEN : BLUE}>{["IP₃R", "RyR", "SERCA"][i]}</L><Arrow d={`M${x} ${i === 2 ? -31 : 28} V${i === 2 ? 29 : -31}`} x={x} y={i === 2 ? 29 : -31} a={i === 2 ? 90 : -90} c={i === 2 ? GREEN : BLUE} /></g>)}
      <L x={330} y={155} s={19} c={GREEN}>2 Ca²⁺ / ATP</L>
    </g>
    <g transform={`translate(${m ? 113 : 147} ${m ? 867 : 650})`}><path d="M-42 0 Q-43 -36 -14 -22 L10 -13 Q36 -35 43 -5 Q49 22 20 27 L-13 14 Q-42 32 -42 0Z" fill={P.purple} stroke={PURPLE} strokeWidth={2} />{[[-26, -13], [-29, 13], [27, -13], [28, 14]].map(([x, y]) => <Ion key={`${x}-${y}`} x={x} y={y} />)}<L x={0} y={58} s={19} c={PURPLE}>Calmodulin</L><H x={0} y={87} s={19}>חיישן סידן</H></g>
    <g transform={`translate(${mitoX} ${mitoY})`}><path d="M-75 -36 C-124 -29 -111 64 -62 67 L51 61 C100 42 90 -28 47 -36Z" fill={P.orange} stroke={ORANGE} strokeWidth={2} /><path d="M-67 -21 Q-100 -10 -82 39 H-53 V13 H-32 V43 H3 V13 H24 V40 H46 Q70 17 43 -20Z" fill="#ffedd5" stroke={ORANGE} strokeWidth={1.8} />
      <Protein x={-71} y={4} c={ORANGE} /><L x={0} y={-62} s={19} c={ORANGE}>MCU</L><Arrow d="M-105 5 H-38" x={-38} y={5} c={ORANGE} /><H x={0} y={102} s={19}>קליטה למיטוכונדריה</H>
    </g>
    <H x={w / 2} y={m ? 495 : 783} s={19} c={PURPLE}>DAG נשאר בממברנה; IP₃ נע בציטוזול</H><H x={w / 2} y={m ? 1040 : 818} s={19} c={MUTED}>*ריכוז המאגר משתנה; מצויר כאן כקירוב מהשיעור</H>
    {m && <H x={w / 2} y={1082} s={19} c={MUTED}>כחול: כניסה לציטוזול · ירוק: פינוי ממנו</H>}
  </g>;
}} />; }

function Bone({ x, y }: { x: number; y: number }) { return <g transform={`translate(${x} ${y})`}><path d="M-51 -20 C-77 -43 -91 -8 -68 5 C-88 27 -56 46 -42 20 H42 C56 46 88 27 68 5 C91 -8 77 -43 51 -20 Q0 -6 -51 -20Z" fill="#fef3c7" stroke={ORANGE} strokeWidth={2} /><S d="M-36 3 H36" c={ORANGE} w={1.3} /></g>; }
function Kidney({ x, y }: { x: number; y: number }) { return <g transform={`translate(${x} ${y})`}><path d="M-6 -39 C-72 -51 -74 49 -13 43 Q20 40 15 20 Q-15 11 6 -8 Q31 -22 -6 -39Z" fill="#fee2e2" stroke={RED} strokeWidth={2} /><path d="M-10 -24 C-44 -27 -48 31 -15 27" fill="none" stroke="#fca5a5" strokeWidth={7} /><S d="M9 9 H37 V48" c={ORANGE} w={3} /></g>; }
function CalciumHomeostasis() { return <Frame h={760} mh={1160} label="סידן בדם במרכז: משוב ליותרת התריס, PTH לעצם ולכליה, הפעלת ויטמין D וספיגה במעי, וקלציטונין מתאי C" draw={m => {
  const w = m ? 480 : 720, centerY = m ? 445 : 323, boneX = m ? 104 : 120, kidX = m ? 357 : 585, orgY = m ? 641 : 452, vitY = m ? 870 : 625;
  return <g><H x={w / 2} y={32} s={26} bold>סידן בדם: העצם, הכליה והמעי</H>
    <g transform={`translate(${m ? 120 : 174} 138)`}><path d="M-9 -37 H9 V36 H-9Z M-12 -19 C-53 -56 -72 -13 -48 25 Q-22 55 -12 10Z M12 -19 C53 -56 72 -13 48 25 Q22 55 12 10Z" fill="#fecdd3" stroke={RED} strokeWidth={2} />{[[-31,-12],[-31,21],[31,-12],[31,21]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r={5} fill={PURPLE} />)}<H x={0} y={75} s={19} c={PURPLE}>יותרת התריס</H><L x={0} y={108} c={PURPLE} bold>PTH ↑</L></g>
    <H x={m ? 355 : 561} y={104} s={19} c={RED}>תאי C בתריס</H><H x={m ? 355 : 561} y={139} c={RED} bold>קלציטונין</H><H x={m ? 355 : 561} y={174} s={19} c={RED}>בעקבות סידן גבוה</H>
    <Arrow d={`M${w / 2 - 50} ${centerY - 51} V264 H${m ? 120 : 174} V258`} x={m ? 120 : 174} y={258} a={-90} c={PURPLE} />
    <H x={w / 2 + 27} y={centerY - (m ? 78 : 102)} s={19} c={PURPLE}>סידן נמוך</H>
    <Arrow d={`M${m ? 355 : 561} 188 V${centerY} H${w / 2 + 107}`} x={w / 2 + 107} y={centerY} a={180} c={RED} stop />
    <rect x={w / 2 - 104} y={centerY - 49} width={208} height={98} rx={46} fill={P.blue} stroke={BLUE} strokeWidth={2.5} /><H x={w / 2} y={centerY - 9} c={BLUE} bold>סידן בדם</H><L x={w / 2} y={centerY + 28} c={BLUE} bold>Ca²⁺</L>
    <Arrow d={`M${m ? 110 : 166} 257 H33 V${orgY - 10} H${boneX - 85}`} x={boneX - 85} y={orgY - 10} c={PURPLE} />
    <Arrow d={`M${m ? 155 : 211} 247 H${w - 31} V${orgY - 74} H${kidX}`} x={kidX} y={orgY - 74} a={180} c={PURPLE} />
    <Bone x={boneX} y={orgY} /><H x={boneX} y={orgY + 71} c={ORANGE} bold>ספיגת עצם ↑</H><H x={boneX} y={orgY + 103} s={19}>שחרור סידן</H>
    <Kidney x={kidX} y={orgY} /><H x={kidX} y={orgY + 71} c={RED} bold>ספיגה חוזרת ↑</H><H x={kidX} y={orgY + 103} s={19}>פחות סידן בשתן</H>
    <Arrow d={`M${boneX + 34} ${orgY - 40} L${w / 2 - 65} ${centerY + 58}`} x={w / 2 - 65} y={centerY + 58} a={-60} c={BLUE} />
    <Arrow d={`M${kidX - 48} ${orgY - 40} L${w / 2 + 65} ${centerY + 58}`} x={w / 2 + 65} y={centerY + 58} a={-120} c={BLUE} />
    <g transform={`translate(${w / 2} ${m ? 790 : 505})`}><path d="M-47 -14 C-63 -29 -62 28 -43 27 H41 Q59 25 48 10 H-29 Q-41 5 -25 -2 H39 Q60 -9 41 -22 H-21" fill="none" stroke="#fb923c" strokeWidth={13} strokeLinecap="round" /><H x={0} y={61} s={19}>ספיגה במעי ↑</H></g>
    <Arrow d={`M${w / 2} ${m ? 753 : 475} V${centerY + 59}`} x={w / 2} y={centerY + 59} a={-90} c={BLUE} />
    <g transform={`translate(0 ${vitY})`}><rect x={19} y={-7} width={w - 38} height={m ? 225 : 106} rx={16} fill={P.green} />
      <H x={m ? 105 : 112} y={25} s={19}>עור · UVB</H><L x={m ? 105 : 112} y={58} s={19}>7-DHC → D₃</L>
      <Arrow d={`M${m ? 192 : 208} 44 H${m ? 264 : 257}`} x={m ? 264 : 257} y={44} c={GREEN} />
      <H x={m ? 350 : 340} y={25} s={19}>כבד</H><L x={m ? 350 : 340} y={58} s={19}>25(OH)D</L>
      <Arrow d={m ? "M350 78 V101 H260" : "M420 44 H462"} x={m ? 260 : 462} y={m ? 101 : 44} a={m ? 180 : 0} c={GREEN} />
      <H x={m ? 178 : 568} y={m ? 130 : 25} s={19} c={GREEN}>כליה · 1α־הידרוקסילציה</H><L x={m ? 178 : 568} y={m ? 168 : 58} s={20} bold c={GREEN}>1,25(OH)₂D</L>
      <H x={m ? 240 : 360} y={m ? 207 : 92} s={19} c={GREEN}>PTH מגביר הפעלה בכליה → ספיגה במעי</H>
    </g>
    <Arrow d={m ? `M265 ${vitY + 169} H454 V790 H303` : `M568 ${vitY + 69} H440 V505 H420`} x={m ? 303 : 420} y={m ? 790 : 505} a={180} c={GREEN} />
    <H x={w / 2} y={m ? 1135 : 747} s={19} c={MUTED}>לקלציטונין תפקיד מוגבל באדם הבוגר</H>
  </g>;
}} />; }

function Myoblast({ x, y, c = PURPLE }: { x: number; y: number; c?: string }) { return <g transform={`translate(${x} ${y})`}><path d="M-31 0 Q-13 -25 6 -15 Q28 -10 35 1 Q15 17 -3 14 Q-25 19 -31 0Z" fill={P.purple} stroke={c} strokeWidth={2} /><ellipse cx={0} cy={0} rx={10} ry={6} fill={c} /></g>; }
function Fiber({ x, y, w = 280, newNuclei = false, allNew = false }: { x: number; y: number; w?: number; newNuclei?: boolean; allNew?: boolean }) { return <g transform={`translate(${x} ${y})`}><path d={`M0 0 Q${w / 2} -14 ${w} 0 V91 Q${w / 2} 103 0 91Z`} fill="#ffedd5" stroke={ORANGE} strokeWidth={2} /><ellipse cy={45} rx={22} ry={46} fill="#fed7aa" stroke={ORANGE} strokeWidth={2} />{[12, 30, 48, 66, 82].map(yy => <S key={yy} d={`M24 ${yy} H${w - 8}`} c="#fdba74" w={2} />)}{Array.from({ length: Math.floor(w / 31) }, (_, i) => <S key={i} d={`M${30 + i * 31} 9 V83`} c={ORANGE} w={1} />)}{[57, w - 27].map(xx => <ellipse key={xx} cx={xx} cy={9} rx={12} ry={6} fill={allNew ? PURPLE : BLUE} />)}{newNuclei && <ellipse cx={w / 2} cy={12} rx={13} ry={7} fill={PURPLE} />}</g>; }
function SatelliteCells() { return <Frame h={715} mh={1110} label="תא לוויין Pax7 חיובי בין הסרקולמה ללמינה הבזלית, הפעלה והתרבות, איחוי לסיב קיים או סיבים חדשים והתחדשות עצמית" draw={m => {
  const w = m ? 480 : 720, actX = m ? 170 : 448, actY = m ? 400 : 150, fY = m ? 720 : 451;
  return <g><H x={w / 2} y={32} s={26} bold>תאי לוויין: מאגר גרעינים לשריר</H>
    <g transform="translate(68 154)"><path d="M-27 -47 Q92 -69 222 -47 V113 Q96 134 -27 113Z" fill={P.green} stroke={GREEN} strokeWidth={2} /><Fiber x={0} y={0} w={209} /><Myoblast x={105} y={-29} /><L x={105} y={-74} c={PURPLE} bold>Pax7⁺</L>
      <H x={m ? 316 : 100} y={m ? 9 : 164} s={19} c={GREEN}>למינה בזלית</H><S d={m ? "M250 1 H229 V-45" : "M100 140 V126"} c={GREEN} />
      <H x={m ? 316 : 100} y={m ? 56 : 197} s={19} c={ORANGE}>סרקולמה</H><S d={m ? "M251 50 H216" : "M213 55 H240 V190 H171"} c={ORANGE} />
      <H x={m ? 316 : 100} y={m ? 102 : 230} s={19} c={PURPLE}>תא לוויין רדום</H>
    </g>
    <g transform={`translate(${actX} ${actY})`}><H x={m ? 45 : 67} y={-41} bold>פגיעה / עומס</H><Myoblast x={0} y={0} /><Myoblast x={83} y={0} /><H x={45} y={56} c={PURPLE} bold>הפעלה והתרבות</H><L x={45} y={91} c={PURPLE}>Pax7 · MyoD</L>
      <Arrow d="M45 107 V136" x={45} y={136} a={90} c={PURPLE} />
      <Myoblast x={-14} y={171} /><Myoblast x={63} y={171} /><Myoblast x={132} y={171} /><H x={50} y={221} c={PURPLE}>מיובלסטים</H>
    </g>
    <Arrow d={m ? "M172 137 H30 V400 H131" : "M297 125 H394"} x={m ? 131 : 394} y={m ? 400 : 125} c={PURPLE} />
    <Arrow d={m ? "M302 400 H450 V80 H276" : "M563 156 H670 V76 H231 V106"} x={m ? 276 : 231} y={m ? 80 : 106} a={m ? 180 : 90} c={GREEN} />
    <H x={m ? 363 : 615} y={m ? 310 : 270} s={19} c={GREEN}>חזרה לרדמה</H><H x={m ? 363 : 615} y={m ? 340 : 296} s={19} c={GREEN}>התחדשות עצמית</H>
    <Arrow d={m ? "M188 635 Q115 663 115 690" : "M449 387 Q160 399 160 425"} x={m ? 115 : 160} y={m ? 690 : 425} a={90} c={PURPLE} />
    <Arrow d={m ? "M291 635 Q359 658 359 690" : "M546 387 V425"} x={m ? 359 : 546} y={m ? 690 : 425} a={90} c={PURPLE} />
    <Fiber x={m ? 43 : 65} y={fY} w={m ? 172 : 262} newNuclei /><Fiber x={m ? 297 : 464} y={fY + 20} w={m ? 130 : 182} newNuclei allNew />
    <H x={m ? 126 : 196} y={fY + 139} bold c={ORANGE}>איחוי לסיב קיים</H><H x={m ? 126 : 196} y={fY + 171} s={19}>הוספת גרעינים</H>
    <H x={m ? 361 : 557} y={fY + 139} bold c={PURPLE}>סיבים חדשים</H><H x={m ? 361 : 557} y={fY + 171} s={19}>אחרי פגיעה קשה</H>
    <Ion x={m ? 49 : 83} y={m ? 976 : 665} c={BLUE} /><H x={m ? 162 : 210} y={m ? 983 : 672} s={19}>גרעין קיים בסיב</H><Ion x={m ? 49 : 379} y={m ? 1017 : 665} c={PURPLE} /><H x={m ? 210 : 528} y={m ? 1024 : 672} s={19}>תא לוויין או גרעין שהוסיף</H>
    <H x={w / 2} y={m ? 1084 : 706} s={19} c={MUTED}>מבט אורך וחתך בקצה הסיב; לא לפי קנה מידה</H>
  </g>;
}} />; }

export const METABOLIC_DISEASE_GAP_FIGURES: Record<string, { el: () => React.ReactElement; captionHe: string }> = {
  "pku-block": { el: PkuBlock, captionHe: "ב־PKU חסימת PAH מגבילה יצירת טירוזין, פניל־אלנין מצטבר ותוצרים חלופיים מופרשים בשתן. טירוזין נעשה חיוני במזון, ועודף פניל־אלנין מתחרה על כניסה למוח דרך נשא משותף. סכמטי." },
  "urea-cycle-bypass": { el: UreaCycleBypass, captionHe: "המעגל מחולק בין המיטוכונדריה לציטוזול; בחסר ASL ארגינין מאפשר סילוק שני חנקנים עודפים בארגינינוסוקצינט. בנזואט ופניל־אצטט מסלקים חנקן באמצעות גליצין וגלוטמין במסלולים נפרדים. סכמטי." },
  "creatine-shuttle": { el: CreatineShuttle, captionHe: "הצימוד בין ANT ל־MtCK מעביר אנרגיה מ־ATP לקריאטין־פוספט במרווח הבין־ממברנלי. קריאטין־פוספט נע אל צרכני האנרגיה, ו־CK מקומי מחדש ATP למיוזין ול־SERCA; קריאטין חוזר למיטוכונדריה. סכמטי." },
  "calcium-fluxes": { el: CalciumFluxes, captionHe: "פתיחת תעלות בממברנה ובמאגר מעלה סידן בציטוזול; משאבות, מחלף וקליטה מיטוכונדריאלית מפנים אותו. קלמודולין חש את האות, ובמסלול PLC נוצרים IP₃ ו־DAG; קליטת סידן למיטוכונדריה מוצגת עם השמטת מעברו בממברנה החיצונית. סכמטי." },
  "calcium-homeostasis": { el: CalciumHomeostasis, captionHe: "סידן נמוך מגביר PTH, שמעלה שחרור סידן מעצם, ספיגה חוזרת בכליה והפעלת ויטמין D לספיגה במעי. קלציטונין עשוי להוריד סידן, אך תפקידו בהומאוסטזיס באדם הבוגר מוגבל. סכמטי." },
  "satellite-cells": { el: SatelliteCells, captionHe: "תא לוויין נמצא בין הסרקולמה ללמינה הבזלית; לאחר הפעלה צאצאיו מתרבים ומתאחים עם סיבים קיימים או יוצרים סיבים חדשים אחרי פגיעה קשה. חלקם חוזרים לרדמה ומחדשים את המאגר. סכמטי." },
};
