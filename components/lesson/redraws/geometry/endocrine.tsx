import {La} from "../helpers";
export const C={blue:'#417d9d',teal:'#3d8d80',purple:'#86689d',gold:'#c39450',red:'#b75d69',ink:'#25364a',muted:'#617788'};
export type Point=[number,number];
export function Bezier(a:Point,b:Point,c:Point,d:Point):Point[]{return Array.from({length:41},(_,i)=>{const t=i/40,u=1-t;return [u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]];});}
export function CurvedBilayer({points}:{points:Point[]}){let distance=100;const samples:Point[]=[];points.forEach((p,i)=>{if(i)distance+=Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1]);if(distance>=10){samples.push(p);distance=0;}});return <g><path d={points.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')} fill="none" stroke="#f1e8cf" strokeWidth={34}/>{samples.map(([x,y],i)=>{const p=samples[Math.max(0,i-1)],n=samples[Math.min(samples.length-1,i+1)],a=Math.atan2(n[1]-p[1],n[0]-p[0])+Math.PI/2;return <g key={i} transform={`translate(${x} ${y}) rotate(${a*180/Math.PI})`}>{[-1,1].map(s=><g key={s}><path d={`M${s*14} -1.5 L${s*5} -3 L${s*1} -2 M${s*14} 2 L${s*6} 4 L${s*1} 3`} stroke="#b2a77a" strokeWidth={.8} fill="none"/><circle cx={s*17} cy={0} r={3.4} fill="#d2e2df" stroke="#738f94" strokeWidth={.7}/></g>)}</g>;})}</g>;}
export function EndoDefs({id}:{id:string}){return <defs>
 {Object.entries(C).map(([k,c])=><linearGradient key={k} id={`${id}-${k}`} x1="0" y1="0" x2="1" y2=".65"><stop stopColor="#f7fafb"/><stop offset=".38" stopColor={k==='gold'?'#eed5a2':k==='purple'?'#d7c6e7':k==='teal'?'#bcded1':k==='red'?'#edc0c3':'#bcd4e4'}/><stop offset="1" stopColor={c}/></linearGradient>)}
 {Object.entries(C).map(([k,c])=><marker key={k} id={`${id}-arrow-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill={c}/></marker>)}
 </defs>;}
export function Flow({d,id,color='blue',dash=false}:{d:string;id:string;color?:keyof typeof C;dash?:boolean}){return <path d={d} fill="none" stroke={C[color]} strokeWidth={2.1} strokeDasharray={dash?'5 4':undefined} markerEnd={`url(#${id}-arrow-${color})`} strokeLinecap="round"/>;}
export function Bilayer({x=26,y,w=428,gap=34}:{x?:number;y:number;w?:number;gap?:number}){const count=Math.floor(w/11);return <g><rect x={x} y={y} width={w} height={gap} fill="#f1e8cf"/>{Array.from({length:count},(_,i)=>{const xx=x+5+i*w/count;return <g key={i}><path d={`M${xx-1.5} ${y+4}l-2 8 2 7 M${xx+2} ${y+4}l2 9-2 6 M${xx-1.5} ${y+gap-4}l-2-8 2-7 M${xx+2} ${y+gap-4}l2-9-2-6`} fill="none" stroke="#b2a77a" strokeWidth={.8}/><circle cx={xx} cy={y} r={3.4} fill="#d2e2df" stroke="#738f94" strokeWidth={.7}/><circle cx={xx} cy={y+gap} r={3.4} fill="#d2e2df" stroke="#738f94" strokeWidth={.7}/></g>;})}</g>;}
export function Helix({x,y,h=76,color=C.purple,fill='#c4add8'}:{x:number;y:number;h?:number;color?:string;fill?:string}){return <g transform={`translate(${x} ${y}) scale(1 ${h/76})`}>
 <path d="M-4 0 C13 1 13 10-3 16 C-16 23-13 32 4 35 C17 40 14 50-3 55 C-15 61-12 71 5 76" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"/>
 <path d="M-4 0 C13 1 13 10-3 16 M-3 34 C17 40 14 50-3 55 M-4 72 L5 76" fill="none" stroke={fill} strokeWidth={7} strokeLinecap="round"/>
 </g>;}
export function Fold({x,y,k=1,id,color='teal'}:{x:number;y:number;k?:number;id:string;color?:keyof typeof C}){return <g transform={`translate(${x} ${y}) scale(${k})`}>
 <path d="M-36-5 C-49-30-23-48-8-32 C6-57 37-41 34-20 C59-13 53 14 33 17 C39 44 11 47 1 32 C-17 52-46 32-35 14 C-51 13-50-3-36-5Z" fill={`url(#${id}-${color})`} stroke={C[color]} strokeWidth={1.4}/>
 <path d="M-29-13 Q-11-30 0-13 T26-7 M-24 15 Q-9-2 6 11 T30 18 M-11 30 Q-5 19 10 24" fill="none" stroke={C[color]} strokeWidth={1.4} opacity={.55}/>
 </g>;}
export function Num({x,y,n,color=C.ink}:{x:number;y:number;n:number;color?:string}){return <g><circle cx={x} cy={y} r={12} fill={color}/><La x={x} y={y+5} size={16} color="#fff" bold>{n}</La></g>;}
export function Panel({y,h,children}:{y:number;h:number;children:React.ReactNode}){return <g transform={`translate(0 ${y})`}><rect x={12} y={0} width={456} height={h} rx={18} fill="#f4f7f8" stroke="#dce5e9"/>{children}</g>;}
