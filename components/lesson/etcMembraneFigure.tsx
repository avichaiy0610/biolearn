/* Owner-approved original illustration, previewed in the local visual lab (2026-10-25).
   Visual references: Lehninger 8e, figures 19-8 and 19-19. Never traced or copied.
   Shapes show topology, not atomic coordinates. Proton counts remain 4/4/2 per electron pair. */
import { He, La } from "./biochemFigures";

function BilayerLipids() {
  return Array.from({ length: 68 }, (_, i) => {
    const x = 43 + 20 * i;
    return (
      <g key={x}>
        <path d={`M${x-3} 308L${x-5} 329L${x-2} 346 M${x+3} 308L${x+6} 329L${x+3} 346`} fill="none" stroke="#d3b67b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${x-3} 412L${x-5} 391L${x-2} 374 M${x+3} 412L${x+6} 391L${x+3} 374`} fill="none" stroke="#d3b67b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={x} cy={303} rx={7} ry={7} fill="#e5cf99" stroke="#c3ab77" strokeWidth={2} />
        <ellipse cx={x} cy={417} rx={7} ry={7} fill="#e5cf99" stroke="#c3ab77" strokeWidth={2} />
      </g>
    );
  });
}

export default function EtcMembraneFigure() {
  return (
    <div>
      <p className="mb-2 text-sm text-slate-600">
        אפשר לגלול לרוחב כדי לקרוא את הפרטים, או{" "}
        <a href="/figures/etc-membrane.svg" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">לפתוח את האיור להגדלה</a>.
      </p>
      <div dir="ltr" className="overflow-x-auto rounded-lg" role="region" aria-label="איור שרשרת מעבר האלקטרונים, ניתן לגלילה לרוחב" tabIndex={0}>
        <div className="min-w-[960px]">
<svg aria-label="שרשרת מעבר האלקטרונים: קומפלקסים ונשאים בממברנה הפנימית של המיטוכונדריה" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full" direction="ltr" viewBox="0 0 1440 960" role="img" aria-labelledby="etc-title etc-desc" fontFamily="Arial,sans-serif">
<title id="etc-title">שרשרת מעבר האלקטרונים בממברנה הפנימית של המיטוכונדריה</title>
<desc id="etc-desc">אלקטרונים מ-NADH דרך I או מ-FADH2 דרך II, אל Q, III, ציטוכרום c ו-IV, עד חמצן ומים. 4, 4 ו-2 פרוטונים לזוג אלקטרונים ב-I, III ו-IV. חזרת פרוטונים דרך ATP סינתאז מניעה יצירת ATP. צורות החלבונים סכמטיות.</desc>
<defs>
<linearGradient id="etc-membrane" x2="0" y2="1"><stop stopColor="#f8e9c0"/><stop offset=".5" stopColor="#fff8df"/><stop offset="1" stopColor="#f8e9c0"/></linearGradient>
<linearGradient id="etc-blue"><stop stopColor="#bfdce9"/><stop offset=".55" stopColor="#e4f0f6"/><stop offset="1" stopColor="#84b4d0"/></linearGradient>
<linearGradient id="etc-slate"><stop stopColor="#aab9cb"/><stop offset=".5" stopColor="#e3e8ef"/><stop offset="1" stopColor="#99aabd"/></linearGradient>
<linearGradient id="etc-green"><stop stopColor="#8ac0aa"/><stop offset=".5" stopColor="#d9eee2"/><stop offset="1" stopColor="#6aa88c"/></linearGradient>
<marker id="etc-electron" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#25364a"/></marker>
<marker id="etc-proton" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#c76c23"/></marker>
<marker id="etc-product" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="3" markerHeight="3" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#376f56"/></marker>
</defs>
<rect width="1440" height="960" fill="#f8fafc"/>
<rect x="30" y="125" width="1380" height="625" rx="22" fill="white" stroke="#d8e4ec"/>
<path d="M52 125H1388Q1410 125 1410 147V300H30V147Q30 125 52 125Z" fill="#fdf4e7"/>
<path d="M30 420H1410V728Q1410 750 1388 750H52Q30 750 30 728Z" fill="#eef6fb"/>
<rect x="31" y="300" width="1378" height="120" fill="url(#etc-membrane)"/>

<He x={720} y={52} size={34} color="#25364a" bold>שרשרת מעבר האלקטרונים</He>
<He x={720} y={91} size={23} color="#60748a">הממברנה הפנימית של המיטוכונדריה</He>
<He x={730} y={167} size={25} color="#25364a" bold>מרווח בין־ממברנלי — ⁦H⁺⁩ רבים</He>
<He x={730} y={719} size={26} color="#25364a" bold>מטריקס</He>
<BilayerLipids />
<path d="M99 311 Q87 277 123 278 L303 278 Q333 281 333 315 L329 402 Q322 430 288 430 L232 429 L232 546 Q232 601 192 612 Q150 619 137 578 L137 434 L112 434 Q90 431 94 403Z" fill="url(#etc-blue)" stroke="#4a708e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
<ellipse cx="118" cy="351" rx="16" ry="57" fill="#b8d9e7" stroke="#8fb7ce" strokeWidth="2" opacity=".55"/>
<ellipse cx="153" cy="351" rx="16" ry="57" fill="#b8d9e7" stroke="#8fb7ce" strokeWidth="2" opacity=".55"/>
<ellipse cx="188" cy="351" rx="16" ry="57" fill="#b8d9e7" stroke="#8fb7ce" strokeWidth="2" opacity=".55"/>
<ellipse cx="223" cy="351" rx="16" ry="57" fill="#b8d9e7" stroke="#8fb7ce" strokeWidth="2" opacity=".55"/>
<ellipse cx="258" cy="351" rx="16" ry="57" fill="#b8d9e7" stroke="#8fb7ce" strokeWidth="2" opacity=".55"/>
<ellipse cx="293" cy="351" rx="16" ry="57" fill="#b8d9e7" stroke="#8fb7ce" strokeWidth="2" opacity=".55"/>
<ellipse cx="187" cy="495" rx="37" ry="48" fill="#cce3ee" stroke="#91b8cd" strokeWidth="2" />
<ellipse cx="187" cy="563" rx="35" ry="36" fill="#cce3ee" stroke="#91b8cd" strokeWidth="2" />
<path d="M404 315Q389 301 389 339L391 413Q396 431 417 429L417 454Q381 461 383 498Q382 545 432 554Q482 551 485 508Q489 466 458 453L458 427Q477 429 480 408L478 329Q476 308 456 315Z" fill="url(#etc-slate)" stroke="#728398" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
<ellipse cx="416" cy="493" rx="28" ry="33" fill="#cbd5e1" stroke="#8e9db0" strokeWidth="2" />
<ellipse cx="454" cy="515" rx="24" ry="25" fill="#dce3eb" stroke="#8e9db0" strokeWidth="2" />
<path d="M695 290Q675 263 699 247Q726 232 744 253Q773 233 793 258Q806 276 792 296L798 409Q818 440 790 471Q765 501 744 475Q714 496 691 470Q669 443 688 417Z" fill="url(#etc-blue)" stroke="#4a708e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
<ellipse cx="718" cy="364" rx="25" ry="81" fill="#c4e0ed" stroke="#91b8cd" strokeWidth="2" />
<ellipse cx="766" cy="365" rx="24" ry="83" fill="#b4d5e5" stroke="#91b8cd" strokeWidth="2" />
<path d="M959 300Q943 281 961 270Q987 250 1010 273Q1038 263 1053 291L1055 412Q1069 434 1053 466Q1033 493 1011 478Q978 500 957 474Q938 453 949 422Z" fill="url(#etc-blue)" stroke="#4a708e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
<ellipse cx="978" cy="370" rx="17" ry="83" fill="#cce3ee" stroke="#91b8cd" strokeWidth="2" />
<ellipse cx="1014" cy="371" rx="17" ry="88" fill="#b8d9e7" stroke="#91b8cd" strokeWidth="2" />
<ellipse cx="1042" cy="373" rx="12" ry="75" fill="#cce3ee" stroke="#91b8cd" strokeWidth="2" />
<path d="M1214 315Q1212 292 1240 288H1274Q1301 291 1300 317L1298 411Q1295 430 1274 432H1238Q1215 431 1214 410Z" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
<ellipse cx="1228" cy="361" rx="8" ry="61" fill="#b8dac7" stroke="#8db7a1" strokeWidth="2" />
<ellipse cx="1246" cy="361" rx="8" ry="61" fill="#b8dac7" stroke="#8db7a1" strokeWidth="2" />
<ellipse cx="1264" cy="361" rx="8" ry="61" fill="#b8dac7" stroke="#8db7a1" strokeWidth="2" />
<ellipse cx="1282" cy="361" rx="8" ry="61" fill="#b8dac7" stroke="#8db7a1" strokeWidth="2" />
<path d="M1245 430L1245 552L1266 552L1266 430Z" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
<path d="M1218 419Q1197 480 1200 570" fill="none" stroke="#4f8870" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
<ellipse cx="1290.0" cy="583.0" rx="33" ry="34" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2" />
<ellipse cx="1272.5" cy="607.2487113059643" rx="33" ry="34" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2" />
<ellipse cx="1237.5" cy="607.2487113059643" rx="33" ry="34" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2" />
<ellipse cx="1220.0" cy="583.0" rx="33" ry="34" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2" />
<ellipse cx="1237.5" cy="558.7512886940357" rx="33" ry="34" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2" />
<ellipse cx="1272.5" cy="558.7512886940357" rx="33" ry="34" fill="url(#etc-green)" stroke="#4f8870" strokeWidth="2" />
<ellipse cx="1255" cy="583" rx="17" ry="20" fill="#b8dac7" stroke="#4f8870" strokeWidth="2" />
<ellipse cx="581" cy="360" rx="25" ry="28" fill="#ffe4a4" stroke="#ae852d" strokeWidth="2" />
<path d="M840 219Q842 199 861 204Q883 192 893 214Q907 236 887 248Q865 263 848 246Q835 241 840 219Z" fill="#efc9c6" stroke="#b96c67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
<path d="M187 651V615" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<La x={187} y={680} size={24} color="#25364a" bold>NADH</La>
<path d="M435 614V557" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<La x={435} y={645} size={24} color="#25364a" bold>FADH₂</La>
<He x={435} y={673} size={19} color="#60748a">מסוקצינט</He>
<path d="M332 404C351 468 544 479 566 392" fill="none" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
<path d="M332 404C351 468 544 479 566 392" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<path d="M480 359H549" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<path d="M611 360H677" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<path d="M776 253Q805 223 831 226" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<path d="M902 226Q935 229 958 265" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<path d="M1004 500V592" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<La x={1004} y={632} size={24} color="#25364a" bold>O₂ → H₂O</La>
<La x={581} y={366} size={23} color="#25364a" bold>Q</La>
<La x={866} y={234} size={19} color="#25364a" bold>cyt c</La>
<path d="M113 510V206" fill="none" stroke="#c76c23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-proton)"/>
<La x={153} y={210} size={25} color="#b9601d" bold>4H⁺</La>
<path d="M720 510V206" fill="none" stroke="#c76c23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-proton)"/>
<La x={760} y={210} size={25} color="#b9601d" bold>4H⁺</La>
<path d="M1023 510V206" fill="none" stroke="#c76c23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-proton)"/>
<La x={1063} y={210} size={25} color="#b9601d" bold>2H⁺</La>
<path d="M1284 220V335Q1284 359 1256 360V466Q1256 482 1300 482" fill="none" stroke="#c76c23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-proton)"/>
<La x={1330} y={226} size={25} color="#b9601d" bold>H⁺</La>
<La x={270} y={538} size={30} color="#304d65" bold>I</La>
<La x={531} y={526} size={30} color="#304d65" bold>II</La>
<La x={750} y={546} size={30} color="#304d65" bold>III</La>
<La x={1100} y={552} size={30} color="#304d65" bold>IV</La>
<He x={1275} y={681} size={23} color="#376f56" bold>⁦ATP⁩ סינתאז</He>
<La x={1131} y={579} size={21} color="#376f56" bold>ADP + Pᵢ</La>
<path d="M1130 613Q1132 642 1165 642" fill="none" stroke="#376f56" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-product)"/>
<La x={1160} y={680} size={24} color="#376f56" bold>ATP</La>
<He x={720} y={793} size={23} color="#25364a" bold>העברת פרוטונים: 4, 4 ו־2 פרוטונים לזוג אלקטרונים בקומפלקסים ⁦I⁩, ⁦III⁩ ו־⁦IV⁩</He>
<He x={720} y={830} size={22} color="#25364a">קומפלקס ⁦II⁩ אינו שואב פרוטונים; חזרת פרוטונים דרך ⁦ATP⁩ סינתאז מניעה יצירת ⁦ATP⁩</He>
<path d="M232 880H302" fill="none" stroke="#25364a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-electron)"/>
<He x={407} y={888} size={21} color="#25364a">מעבר אלקטרונים</He>
<path d="M790 880H860" fill="none" stroke="#c76c23" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#etc-proton)"/>
<He x={978} y={888} size={21} color="#b9601d">מעבר פרוטונים</He>
<He x={720} y={936} size={18} color="#60748a">איור מקורי סכמטי • מבני החלבונים אינם שחזור אטומי • הגדלים והמרחקים אינם בקנה מידה</He>
</svg>
        </div>
      </div>
    </div>
  );
}
