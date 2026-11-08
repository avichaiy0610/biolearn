import { He, La, Svg } from "./helpers";

const C = {capture:"#216b88",detect:"#8d477f",hormone:"#c4652a",enzyme:"#487b46",product:"#e1a329",muted:"#586b7d"};
function Antibody({x,y,color=C.capture,flip=false,small=false}:{x:number;y:number;color?:string;flip?:boolean;small?:boolean}) {
  return <g transform={`translate(${x} ${y}) rotate(${flip?180:0}) scale(${small?.75:1})`}>
    <path d="M-5 0 L-5-23 Q-27-33-25-49 L-17-51 Q-18-37 0-30 Q18-37 17-51 L25-49 Q27-33 5-23 L5 0Z" fill={color} stroke={color} strokeWidth={1.2}/>
    <path d="M-2-2 V-24 M-20-48 Q-20-37-7-31 M20-48 Q20-37 7-31" fill="none" stroke="white" strokeWidth={1.5} opacity={.65}/>
  </g>;
}
function Hormone({x,y,large=false}:{x:number;y:number;large?:boolean}) {
  return <g transform={`translate(${x} ${y}) scale(${large?1.3:1})`}><path d="M-10-5 Q-8-13-1-9 Q6-15 11-7 Q16-2 10 4 Q12 11 3 11 Q-2 16-8 8 Q-16 5-10-5Z" fill="#edb184" stroke={C.hormone} strokeWidth={1.6}/><path d="M-6-4 Q-2-9 3-5 M0 6 Q4 9 8 4" fill="none" stroke="#fff3e3" strokeWidth={2}/></g>;
}
function Enzyme({x,y}:{x:number;y:number}) {return <g><path d={`M${x-12} ${y-6} Q${x-5} ${y-20} ${x+9} ${y-12} Q${x+21} ${y-2} ${x+9} ${y+10} Q${x-3} ${y+17} ${x-12} ${y+6} L${x-7} ${y}Z`} fill="#a9c99b" stroke={C.enzyme} strokeWidth={1.5}/><path d={`M${x-3} ${y-7} Q${x+5} ${y-12} ${x+9} ${y-4}`} stroke="white" strokeWidth={2} fill="none"/></g>;}
function Product({x,y}:{x:number;y:number}){return <g>{[[22,-4],[30,10],[18,23]].map(([dx,dy],i)=><circle key={i} cx={x+dx} cy={y+dy} r={3.2} fill={C.product}/>)}</g>;}
function Format({sandwich=false}:{sandwich?:boolean}) {
 const color=sandwich?C.capture:C.hormone;
 return <g>
   <He x={174} y={30} size={22} bold color={color}>{sandwich?"סנדוויץ׳":"תחרותית"}</He>
   <La x={174} y={56} size={16}>{sandwich?"Sandwich ELISA":"Competitive ELISA"}</La>
   <He x={174} y={85} size={16}>{sandwich?"שני אתרים שונים על אותו הורמון":"דגימה ומתחרה: אותם אתרי קישור"}</He>
   <He x={174} y={114} size={15} color={C.muted}>לאחר קישור ושטיפה</He>
   <path d="M22 161 V307 Q22 335 50 335 H298 Q326 335 326 307 V161 L318 161 V306 Q318 326 298 326 H50 Q30 326 30 306 V161Z" fill="#d9e4eb" stroke="#8ca3b3" strokeWidth={1.3}/>
   <path d="M31 292 H317 V306 Q317 325 297 325 H51 Q31 325 31 306Z" fill="#f1f6f8"/>
   {sandwich ? <>
     {[97,251].map(x=><g key={x}><Antibody x={x} y={324}/><Hormone x={x-21} y={265} large/><Antibody x={x-43} y={203} color={C.detect} flip/><path d={`M${x-43} 203 V188`} stroke={C.enzyme} strokeWidth={2}/><Enzyme x={x-43} y={174}/><Product x={x-43} y={174}/></g>)}
     <He x={174} y={144} size={15} color={C.detect}>נוגדן גילוי מסומן באנזים</He>
     <path d="M64 150 L54 156 M259 150 L213 156" fill="none" stroke={C.detect} strokeWidth={1.1}/>
     <He x={174} y={282} size={15} color={C.hormone}>הורמון</He>
     <path d="M143 276 L99 267 M204 276 L212 269" stroke={C.hormone} strokeWidth={1.1} fill="none"/>
   </> : <>
     {[88,177,266].map((x,i)=><g key={x}><Antibody x={x+15} y={324} color="#9aaebb" small/><Antibody x={x} y={283}/><Hormone x={x-21} y={224}/>{i===0&&<><path d={`M${x-17} 213 L${x-9} 191`} stroke={C.enzyme} strokeWidth={2}/><Enzyme x={x-5} y={179}/><Product x={x-5} y={179}/></>}</g>)}
     <He x={96} y={144} size={15} color={C.enzyme}>מתחרה עם אנזים</He>
     <path d="M90 150 L83 160" stroke={C.enzyme} strokeWidth={1.1}/>
     <He x={239} y={177} size={15} color={C.hormone}>הורמון מהדגימה</He>
     <path d="M218 185 L164 213 M250 185 L246 211" stroke={C.hormone} strokeWidth={1.1} fill="none"/>
     <He x={174} y={365} size={15} color={C.capture}>נוגדן ראשוני קושר הורמון</He>
     <path d="M51 353 L45 291 L65 267" stroke={C.capture} strokeWidth={1.1} fill="none"/>
   </>}
   {sandwich ? <><He x={174} y={365} size={15} color={C.capture}>נוגדן לכידה קבוע בבארית</He><path d="M46 352 L44 310 L72 293" stroke={C.capture} strokeWidth={1.1} fill="none"/></> : <He x={174} y={392} size={15} color={C.muted}>נוגדן שניוני מעגן אותו לבארית</He>}
   <He x={174} y={sandwich?392:420} size={15} color={C.muted}>{sandwich?"הורמון חלבוני: מקום לשני נוגדנים":"למשל סטרואיד: אתר זמין לנוגדן אחד"}</He>
   <He x={174} y={470} size={17} bold color={color}>{sandwich?"יותר הורמון ← יותר אות":"יותר הורמון ← פחות אות"}</He>
   <He x={174} y={499} size={15}>אות צבע (בליעה)</He>
   <path d="M66 518 V637 H300" stroke="#667a8b" strokeWidth={1.6} fill="none"/>
   <path d={sandwich?"M76 626 C132 626 137 550 192 539 Q240 531 294 531":"M76 531 C132 531 137 607 192 619 Q240 627 294 627"} fill="none" stroke={color} strokeWidth={3.5}/>
   <He x={40} y={531} size={15}>גבוה</He><He x={40} y={638} size={15}>נמוך</He>
   <He x={77} y={659} size={15}>נמוך</He><He x={286} y={659} size={15}>גבוה</He>
   <He x={183} y={684} size={16}>ריכוז ההורמון בדגימה</He>
 </g>;
}
function Legend(){return <g>
 <Hormone x={55} y={26}/><He x={141} y={32} size={15}>הורמון נמדד</He>
 <Enzyme x={252} y={26}/><He x={309} y={32} size={15}>אנזים</He>
 <circle cx={391} cy={26} r={6} fill="#fff" stroke="#8193a2" strokeWidth={1.3}/><He x={455} y={32} size={15}>סובסטרט</He>
 <path d="M511 26 H553 l-7-5 m7 5-7 5" fill="none" stroke="#667a8b" strokeWidth={1.4}/>
 <circle cx={581} cy={26} r={7} fill={C.product}/><He x={651} y={32} size={15}>תוצר צבע</He>
 <He x={360} y={62} size={15} color={C.enzyme}>מוסיפים סובסטרט אחרי השטיפה; יותר אנזים קשור יוצר יותר צבע</He>
 <He x={360} y={88} size={15} color={C.muted}>איור ועקומות סכמטיים; ללא קנה מידה או ערכי כיול כמותיים</He>
 </g>}
export function ElisaFormats(){return <>
 <div className="elisa-desktop"><Svg w={720} h={860} label="השוואת ELISA: בתחרותית הורמון הדגימה מתחרה בהורמון מסומן על נוגדן ראשוני המעוגן באמצעות נוגדן שניוני; יותר הורמון נותן פחות צבע. בסנדוויץ׳ ההורמון נקשר לנוגדן לכידה ולנוגדן גילוי הנושא אנזים; יותר הורמון נותן יותר צבע."><He x={360} y={29} size={23} bold>אותו צבע — כיווני קריאה הפוכים</He><g transform="translate(7 49)"><Format/></g><g transform="translate(365 49)"><Format sandwich/></g><g transform="translate(0 753)"><Legend/></g></Svg></div>
 <div className="elisa-mobile">{[false,true].map(s=><Svg key={String(s)} w={348} h={725} label={s?"ELISA סנדוויץ׳: יותר הורמון, יותר אות":"ELISA תחרותית: יותר הורמון, פחות אות"}><Format sandwich={s}/></Svg>)}<Svg w={348} h={218} label="מקרא: הורמון כתום, אנזים ירוק, סובסטרט ותוצר צבע"><Hormone x={35} y={20}/><He x={114} y={26} size={16}>הורמון נמדד</He><Enzyme x={220} y={20}/><He x={282} y={26} size={16}>אנזים</He><circle cx={35} cy={65} r={6} fill="white" stroke="#8193a2"/><He x={105} y={71} size={16}>סובסטרט</He><path d="M166 65 H197 l-7-5 m7 5-7 5" fill="none" stroke="#667a8b"/><circle cx={220} cy={65} r={7} fill={C.product}/><He x={282} y={71} size={16}>תוצר צבע</He><He x={174} y={110} size={16}>מוסיפים סובסטרט אחרי השטיפה</He><He x={174} y={140} size={16} color={C.enzyme}>יותר אנזים קשור יוצר יותר צבע</He><He x={174} y={177} size={15} color={C.muted}>איור ועקומות סכמטיים; ללא קנה מידה</He><He x={174} y={202} size={15} color={C.muted}>או ערכי כיול כמותיים</He></Svg></div>
 <style>{`.elisa-desktop{display:block}.elisa-mobile{display:none}@media(max-width:540px){.elisa-desktop{display:none}.elisa-mobile{display:block}}`}</style>
 </>;}
