import {Pin} from './six';
export function Callout({n,x,y,tx,ty,target}:{n:number;x:number;y:number;tx:number;ty:number;target:string}){
 const a=Math.atan2(ty-y,tx-x),sx=x+16*Math.cos(a),sy=y+16*Math.sin(a);
 return <g data-callout={n} data-target={target} data-target-x={tx} data-target-y={ty}><path d={`M${sx} ${sy}L${tx} ${ty}`} fill="none" stroke="#60778a" strokeWidth={1.2}/><Pin x={x} y={y} n={n}/></g>;
}
