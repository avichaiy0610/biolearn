import { He, La, INK, MUTED } from "./biochemFigures";

const OUTER = "#0f766e", INNER = "#1d4ed8", LIPID = "#c2410c", CONTENT = "#7c3aed";

// Cross-sections: the two proximal (extracellular) leaflets join at the stalk;
// the distal leaflets remain separate until a water-filled pore opens.
function Membranes({ stage }: { stage: number }) {
  const inner = stage < 2
    ? ["M0 32 H108", "M0 78 H108"]
    : stage === 2
      ? ["M0 32 H30 Q44 32 44 55 Q44 78 30 78 H0", "M108 32 H78 Q64 32 64 55 Q64 78 78 78 H108"]
      : ["M0 32 H16 Q30 32 30 55 Q30 78 16 78 H0", "M108 32 H92 Q78 32 78 55 Q78 78 92 78 H108"];
  const outer = stage === 0
    ? ["M0 44 H108", "M0 66 H108"]
    : stage === 1
      ? ["M0 44 H34 Q48 44 48 55 Q48 66 34 66 H0", "M108 44 H74 Q60 44 60 55 Q60 66 74 66 H108"]
      : stage === 2
        ? ["M0 44 H24 Q32 44 32 55 Q32 66 24 66 H0", "M108 44 H84 Q76 44 76 55 Q76 66 84 66 H108"]
        : ["M0 44 H10 Q18 44 18 55 Q18 66 10 66 H0", "M108 44 H98 Q90 44 90 55 Q90 66 98 66 H108"];
  const membrane = stage === 0
    ? "M0 32 H108 V44 H0 Z M0 66 H108 V78 H0 Z"
    : stage === 1
      ? "M0 32 H108 V44 H74 Q60 44 60 55 Q60 66 74 66 H108 V78 H0 V66 H34 Q48 66 48 55 Q48 44 34 44 H0 Z"
      : stage === 2
        ? "M0 32 H30 Q44 32 44 55 Q44 78 30 78 H0 V66 H24 Q32 66 32 55 Q32 44 24 44 H0 Z M108 32 H78 Q64 32 64 55 Q64 78 78 78 H108 V66 H84 Q76 66 76 55 Q76 44 84 44 H108 Z"
        : "M0 32 H16 Q30 32 30 55 Q30 78 16 78 H0 V66 H10 Q18 66 18 55 Q18 44 10 44 H0 Z M108 32 H92 Q78 32 78 55 Q78 78 92 78 H108 V66 H98 Q90 66 90 55 Q90 44 98 44 H108 Z";
  return <g>
    <rect width={108} height={110} fill="#eff6ff" rx={6} />
    <path d={stage === 0 ? "M0 44 H108 V66 H0Z" : stage === 1 ? "M0 44 H34 Q48 44 48 55 Q48 66 34 66 H0Z M108 44 H74 Q60 44 60 55 Q60 66 74 66 H108Z" : stage === 2 ? "M0 44 H24 Q32 44 32 55 Q32 66 24 66 H0Z M108 44 H84 Q76 44 76 55 Q76 66 84 66 H108Z" : "M0 44 H10 Q18 44 18 55 Q18 66 10 66 H0Z M108 44 H98 Q90 44 90 55 Q90 66 98 66 H108Z"} fill="white" />
    <path d={membrane} fill="#fde7b0" />
    {[...Array(18)].map((_, i) => {
      const x = 3 + i * 6;
      if (stage > 0 && x > (stage === 3 ? 12 : 26) && x < (stage === 3 ? 96 : 82)) return null;
      return <path key={x} d={`M${x} 34 l-1 4 2 4 M${x} 68 l-1 4 2 4`} stroke="#a3874b" strokeWidth={0.8} fill="none" />;
    })}
    {[[inner, INNER], [outer, OUTER]].map(([paths, color]) => (paths as string[]).map((d, i) => <g key={`${color}-${i}`}>
      <path d={d} stroke={color as string} strokeWidth={1} fill="none" />
      <path d={d} stroke={color as string} strokeWidth={3.6} strokeDasharray="0.1 6" strokeLinecap="round" fill="none" />
    </g>))}
  </g>;
}

function ProbePair({ lipidMixed, contentMixed, initial = false }: { lipidMixed: boolean; contentMixed: boolean; initial?: boolean }) {
  return <g>
    {contentMixed && <path d="M3 13 C3 -3 38 -3 38 13 L52 13 C52 -3 87 -3 87 13 V31 C87 47 52 47 52 31 L38 31 C38 47 3 47 3 31Z" fill="#f8fafc" stroke={LIPID} strokeWidth={3.5} />}
    {[0, 1].map(i => <g key={i} transform={`translate(${i * 49} 0)`}>
      {!contentMixed && <path d="M3 13 C3 -3 38 -3 38 13 V31 C38 47 3 47 3 31Z" fill="#f8fafc" stroke={initial || !lipidMixed ? (i === 0 ? LIPID : "#94a3b8") : LIPID} strokeWidth={3.5} />}
      {(contentMixed || i === 1) && [[14, 14], [27, 22], [16, 31]].map(([x, y]) => <rect key={y} x={x - 2} y={y - 2} width={4} height={4} fill={CONTENT} />)}
    </g>)}
  </g>;
}

export function FusionStages() {
  const titles = ["הצמדה", "גבעול המי־פיוז'ן", "נקבובית איחוי", "הרחבה"];
  return <svg viewBox="0 0 480 650" className="w-full h-auto" role="img" aria-label="שלבי איחוי ממברנות, מימין לשמאל: הצמדה, גבעול המי־פיוז'ן עם מיזוג העלעלים החיצוניים בלבד, נקבובית והרחבתה. LPC חוסם לפני המי־פיוז'ן באופן הפיך; Myomaker נדרש להמי־פיוז'ן ו־Myomerger לנקבובית. בניסוי סכמטי ללא LPC: WT מערבב סמני שומן ותוכן, חסר Myomerger מערבב שומן בלבד, וחסר Myomaker אינו מערבב אף סמן.">
    <rect width={480} height={650} rx={10} fill="white" />
    <He x={240} y={25} size={18} bold>משתי ממברנות לרצף ציטופלזמי אחד</He>
    <He x={240} y={48} size={13} color={MUTED}>א · חתך בממברנות — סדר השלבים מימין לשמאל</He>
    {titles.map((title, i) => {
      const x = 362 - i * 117;
      return <g key={title}>
        <He x={x + 54} y={76} size={13} bold>{`${i + 1} · ${title}`}</He>
        <g transform={`translate(${x} 88)`}><Membranes stage={i} /></g>
        {i < 3 && <path d={`M${x - 2} 143 h-7 m4 -4 l-4 4 4 4`} fill="none" stroke={INK} strokeWidth={1.5} />}
      </g>;
    })}
    <path d="M357 136 V150" stroke="#b91c1c" strokeWidth={2.5} />
    <He x={416} y={211} size={12}>שתי דו־שכבות</He>
    <He x={299} y={211} size={12}>פנימיים נפרדים</He>
    <He x={182} y={211} size={12}>מעבר תוכן נפתח</He>
    <He x={65} y={211} size={12}>הנקבובית גדלה</He>
    <circle cx={463} cy={234} r={3} fill={OUTER} /><He x={374} y={238} size={12}>ירוק: עלעלים חיצוניים</He>
    <circle cx={237} cy={234} r={3} fill={INNER} /><He x={132} y={238} size={12}>כחול: עלעלים פנימיים</He>
    <He x={240} y={259} size={12} color={MUTED}>מעל ומתחת: ציטופלזמה · הלבן שביניהם: חוץ־תאי</He>
    <rect x={10} y={277} width={460} height={76} rx={8} fill="#f8fafc" />
    <La x={407} y={299} size={15} bold color="#b91c1c">LPC</La>
    <He x={217} y={299} size={13}>חוסם לפני גבעול; החסימה הפיכה בשטיפה</He>
    <La x={403} y={323} size={14} bold color={OUTER}>Myomaker</La>
    <He x={294} y={323} size={13}>{"נדרש להמי־פיוז'ן"}</He>
    <La x={185} y={323} size={14} bold color={INNER}>Myomerger</La>
    <He x={69} y={323} size={13}>נדרש לנקבובית</He>
    <He x={240} y={344} size={11} color={MUTED}>הפס האדום: חסימת LPC · שמות החלבונים: השלב שבו הם נדרשים</He>
    <He x={240} y={381} size={17} bold>ב · מה עובר בין התאים?</He>
    <g transform="translate(361 398)"><ProbePair lipidMixed={false} contentMixed={false} initial /></g>
    <He x={178} y={412} size={13}>בהתחלה: סמן שומן בתא אחד</He>
    <He x={178} y={434} size={13}>וסמן תוכן בתא האחר</He>
    <path d="M348 419 H311 m5 -4 l-5 4 5 4" fill="none" stroke={MUTED} strokeWidth={1.5} />
    <He x={240} y={464} size={12} color={MUTED}>תוצאה צפויה ללא LPC או לאחר שטיפתו · לא נתונים כמותיים</He>
    <La x={400} y={488} size={12} bold>Genotype</La>
    <He x={266} y={488} size={13} bold>סמנים בשני התאים</He>
    <He x={141} y={488} size={13} bold>שומן</He>
    <He x={59} y={488} size={13} bold>תוכן</He>
    {[
      { name: "WT", lipid: true, content: true },
      { name: "Myomerger-KO", lipid: true, content: false },
      { name: "Myomaker-KO", lipid: false, content: false },
    ].map(({ name, lipid, content }, i) => <g key={name}>
      <rect x={10} y={497 + i * 46} width={460} height={44} rx={6} fill={i % 2 === 0 ? "#f1f5f9" : "#fff7ed"} />
      <La x={398} y={524 + i * 46} size={13} bold>{name}</La>
      <g transform={`translate(231 ${499 + i * 46}) scale(.85)`}><ProbePair lipidMixed={lipid} contentMixed={content} /></g>
      <He x={141} y={524 + i * 46} size={13} color={lipid ? LIPID : MUTED}>{lipid ? "✓ עבר" : "− לא עבר"}</He>
      <He x={59} y={524 + i * 46} size={13} color={content ? CONTENT : MUTED}>{content ? "✓ עבר" : "− לא עבר"}</He>
    </g>)}
    <He x={240} y={642} size={12} color={MUTED}>כתום: סמן שומן · ריבועים סגולים: סמן תוכן · סכמטי, לא בקנה מידה</He>
  </svg>;
}
