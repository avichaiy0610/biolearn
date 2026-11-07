import {C,Bezier,Point} from './endocrine';
export function DnaDuplex({y,x=38,w=404}:{y:number;x?:number;w?:number}){const a=Array.from({length:180},(_,i)=>{const xx=x+w*i/179;return [xx,y+22*Math.sin((xx-x)*Math.PI*2/124)] as Point;}),b=Array.from({length:180},(_,i)=>{const xx=x+w*i/179;return [xx,y+22*Math.sin((xx-x)*Math.PI*2/124+2.2)] as Point;});return <g>
 {Array.from({length:Math.floor(w/8)},(_,i)=>{const xx=x+i*8,ya=y+22*Math.sin((xx-x)*Math.PI*2/124),yb=y+22*Math.sin((xx-x)*Math.PI*2/124+2.2);return <path key={i} d={`M${xx} ${ya} L${xx} ${yb}`} stroke="#aebfc9" strokeWidth={1.8}/>;})}
 {[a,b].map((ps,i)=><path key={i} d={ps.map(([xx,yy],j)=>`${j?'L':'M'}${xx} ${yy}`).join(' ')} fill="none" stroke={i?'#7195aa':'#a7becb'} strokeWidth={5} strokeLinecap="round"/>)}
 </g>;}
export function Chromatin({points}:{points:Point[]}){return <g><path d={points.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')} fill="none" stroke="#abc1ce" strokeWidth={7}/><path d={points.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ')} fill="none" stroke="#eaf1f5" strokeWidth={2}/></g>;}
export function LoopPoints({base=235,rise=130}:{base?:number;rise?:number}):Point[]{return [...Bezier([38,base],[94,base],[170,base],[199,base]),...Bezier([199,base],[199,base-rise*.35],[135,base-rise],[240,base-rise]),...Bezier([240,base-rise],[345,base-rise],[281,base-rise*.35],[281,base]),...Bezier([281,base],[310,base],[382,base],[442,base])];}
export const recognition=C.red;
