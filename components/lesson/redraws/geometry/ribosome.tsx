import { La } from "../helpers";
export const LARGE='#87749c', SMALL='#467c9c', RNA='#7865a1', PEPTIDE='#b97b35';
export const EMPTY='#8a98a6', OLD='#9477b5', NEW='#408c78';
type State='empty'|'bare'|'aa'|'peptide';
type Transfer={E?:State;P?:State;A?:State;pColor?:string;aColor?:string;eColor?:string;post?:boolean;codons?:boolean;id:string;peptideCount?:number};
export function RiboDefs({id}:{id:string}){return <defs>
  <linearGradient id={`${id}-large`} x2="1" y2="1"><stop stopColor="#eee9f3"/><stop offset=".5" stopColor="#d5c9e1"/><stop offset="1" stopColor="#ab99bf"/></linearGradient>
  <linearGradient id={`${id}-small`} x2="1" y2="1"><stop stopColor="#e2f0f6"/><stop offset=".5" stopColor="#bdd8e6"/><stop offset="1" stopColor="#84b2c9"/></linearGradient>
</defs>}
function Trna({x,mirror,color,state}:{x:number;mirror:number;color:string;state:State}){
  if(state==='empty')return null;
  return <g transform={`translate(${x} 0) scale(${mirror} 1)`}>
    <path d="M-6 6 L-9 -26 Q-23 -32 -30 -45 L-45 -64 Q-47 -74 -37 -78 L-24 -71 L0 -47 L23 -80 L33 -74 L15 -36 L8 6 Q1 14 -6 6Z" fill={color} fillOpacity={.17} stroke={color} strokeWidth={1.8}/>
    <path d="M-1 2 L-2 -30 Q-22 -39 -28 -51 L-37 -68 M7 -42 L27 -75" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round"/>
    <path d="M-4 -13 H6 M-5 -21 H4 M14 -57 l8 6 M18 -64 l8 6" stroke={color} strokeWidth={1.4}/>
    <path d="M-7 6 Q1 16 8 6" stroke={color} fill="none" strokeWidth={3}/>
    {state==='aa'&&<><path d="M28 -77 V-87" stroke={PEPTIDE} strokeWidth={2}/><circle cx={28} cy={-92} r={6} fill="#eac58e" stroke={PEPTIDE} strokeWidth={1.3}/></>}
  </g>
}
export function RiboDrawing({id,E='empty',P='empty',A='empty',eColor=EMPTY,pColor=OLD,aColor=NEW,post=false,codons=false,peptideCount=3}:Transfer){
  const px=P==='peptide'?28:78-28;
  return <g>
    {/* An original cutaway silhouette, with a head, central protuberance and lateral lobes. */}
    <path d="M-132 -7 C-148 -25 -139 -49 -119 -52 C-133 -80 -109 -108 -83 -98 C-79 -127 -44 -133 -23 -113 C-4 -140 30 -130 40 -106 C68 -124 96 -105 96 -88 C127 -91 147 -66 133 -42 C155 -14 125 13 104 5 C84 24 62 10 43 7 L-33 9 C-54 21 -78 10 -91 4 C-112 20 -136 12 -132 -7Z" fill={`url(#${id}-large)`} stroke={LARGE} strokeWidth={2}/>
    <path d="M-111 -70 Q-85 -61 -89 -37 M-71 -99 Q-47 -83 -59 -62 M-15 -113 Q10 -96 3 -84 M62 -101 Q44 -81 61 -64 M109 -71 Q88 -55 101 -31" fill="none" stroke={LARGE} strokeWidth={1.5} opacity={.5}/>
    <path d="M-91 -16 Q-68 -42 -49 -19 M-101 -49 Q-92 -61 -78 -49 Q-62 -37 -78 -25 M77 -39 Q100 -51 115 -34" fill="none" stroke="#fff" strokeOpacity={.5} strokeWidth={3}/>
    {/* The highlighted passage is a cut through the large subunit, not a surface seam. */}
    <path d={`M${px} -77 C25 -95 4 -105 -26 -108 S-69 -114 -81 -132`} stroke={LARGE} strokeWidth={18} strokeOpacity={.27} fill="none"/>
    <path d={`M${px} -77 C25 -95 4 -105 -26 -108 S-69 -114 -81 -132`} stroke="#fff9eb" strokeWidth={12} fill="none"/>
    {/* A pale cutaway leaves tRNA visible in its intersubunit binding sites. */}
    <path d="M-104 7 L-108 -39 Q-98 -56 -83 -50 L-57 -27 L-46 -70 Q-16 -102 11 -76 L39 -52 L52 -78 Q78 -103 100 -72 L112 -20 L102 9Z" fill="#f8fafb" fillOpacity={.8}/>
    <path d="M-135 40 C-144 21 -124 8 -103 16 C-83 4 -53 16 -33 17 C-10 11 12 17 31 18 C47 -4 83 -3 96 17 C127 10 146 29 134 47 C151 70 120 83 101 72 C78 92 49 84 33 75 C9 86 -19 80 -35 73 C-57 88 -84 76 -96 68 C-118 79 -139 64 -135 40Z" fill={`url(#${id}-small)`} stroke={SMALL} strokeWidth={2}/>
    <path d="M-121 47 Q-94 35 -77 51 M-57 58 Q-32 41 -13 57 M15 60 Q40 47 61 62 M85 24 Q75 38 99 49" fill="none" stroke={SMALL} strokeWidth={1.3} opacity={.5}/>
    {/* mRNA crosses the decoding channel in the small subunit. */}
    <path d="M-184 37 C-154 39 -147 27 -124 27 H124 C146 27 151 40 184 37" stroke="#fff" strokeWidth={9} fill="none"/>
    <path d="M-184 37 C-154 39 -147 27 -124 27 H124 C146 27 151 40 184 37" stroke={RNA} strokeWidth={3.5} fill="none"/>
    {[-78,0,78].map((x,i)=><g key={x}>{[-8,0,8].map(dx=><g key={dx}><path d={`M${x+dx} 24 V17`} stroke={RNA} strokeWidth={2}/><path d={`M${x+dx} 11 V16`} stroke={i===0?eColor:i===1?pColor:aColor} strokeWidth={2}/></g>)}</g>)}
    <Trna x={-78} mirror={-1} color={eColor} state={E}/><Trna x={0} mirror={1} color={pColor} state={P}/><Trna x={78} mirror={-1} color={aColor} state={A}/>
    {(P==='peptide'||A==='peptide')&&<>
      <path d={`M${px} -77 C25 -95 4 -105 -26 -108 S-69 -114 -81 -132 C-83 -144 -100 -145 -102 -158`} stroke={PEPTIDE} strokeWidth={4.5} fill="none" strokeLinecap="round"/>
      {Array.from({length:peptideCount},(_,i)=><circle key={i} cx={-81-i*8} cy={-134-i*8} r={4.3} fill={i===peptideCount-1?'#f0d3a3':'#d6a565'} stroke={PEPTIDE} strokeWidth={1}/>)}
    </>}
    <La x={-183} y={63} size={16} bold color={RNA}>5′</La><La x={183} y={63} size={16} bold color={RNA}>3′</La>
    {[-78,0,78].map((x,i)=><g key={x}>
      {codons&&<La x={x} y={105} size={17} bold>{['GCU','UUC','AAA'][i]}</La>}
      <La x={x} y={codons?135:108} size={18} bold color={i===0?eColor:i===1?pColor:aColor}>{['E','P','A'][i]}</La>
    </g>)}
    {post&&<><path d="M94 96 H143" stroke={SMALL} strokeWidth={2}/><path d="M136 91 l8 5 -8 5" stroke={SMALL} strokeWidth={2} fill="none"/></>}
  </g>
}
