import type React from 'react';
import {He,La} from '../helpers';
import {Responsive,Defs,IC} from './immune';
export {He,La,IC};
export {Callout} from './next-six';
type Props={id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string|string[]};
// Reserve a footer band after the final legend row, including every note line.
function plateHeight(p:Props,m=false){
 const count=Array.isArray(p.foot)?p.foot.length:1;
 const legendBottom=(m?282:438)+((m?p.keys.length:Math.ceil(p.keys.length/2))-1)*(m?48:54)+20;
 const original=m?280+p.keys.length*48+55:440+Math.ceil(p.keys.length/2)*50+40;
 return Math.max(original,legendBottom+40+(count-1)*24+17);
}
// Scene is module scoped: responsive renders never create a new component type.
function PlateScene({p,m=false}:{p:Props;m?:boolean}){
 const w=m?360:640,h=plateHeight(p),mh=plateHeight(p,true),foot=Array.isArray(p.foot)?p.foot:[p.foot];
 return <><Defs id={p.id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{p.title}</He><He x={w/2} y={56} size={m?15:16}>{p.subtitle}</He><g data-scene="" transform={`translate(${m?4:0} ${m?67:76}) scale(${m?.55:1})`}>{p.draw(p.id+(m?'-m':'-d'))}</g>{p.keys.map((lines,i)=>{const x=m?340:(i%2===0?610:298),y=(m?282:438)+(m?i:Math.floor(i/2))*(m?48:54);return <g key={i} data-legend={i+1}><circle cx={x} cy={y-5} r={11} fill="#ecf2f6"/><La x={x} y={y} size={15} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{t}</He>)}</g>;})}{foot.map((t,i)=><He key={i} x={w/2} y={(m?mh:h)-17-(foot.length-1-i)*24} size={m?14:16} color={IC.muted}>{t}</He>)}</>;
}
export function Plate(p:Props){return <Responsive id={p.id} label={p.label} h={plateHeight(p)} mh={plateHeight(p,true)} wide={<PlateScene p={p}/>} mobile={<PlateScene p={p} m/>}/>;}
export function Flow({d,id,color=IC.ink}:{d:string;id:string;color?:string}){return <path data-flow="" d={d} fill="none" stroke={color} strokeWidth={2} markerEnd={`url(#${id}-arrow)`}/>;}
export function Protein({x,y,fill=IC.goldPale,bio}:{x:number;y:number;fill?:string;bio?:string}){return <path data-bio={bio} d={`M${x-24} ${y-15}C${x-40} ${y-42} ${x+8} ${y-43} ${x+18} ${y-22}C${x+45} ${y-28} ${x+42} ${y+12} ${x+19} ${y+18}C${x+8} ${y+41} ${x-29} ${y+29} ${x-24} ${y+9}Q${x-43} ${y-3} ${x-24} ${y-15}Z`} fill={fill} stroke={IC.goldDark} strokeWidth={2}/>;}
export function Ub({x,y,bio}:{x:number;y:number;bio?:string}){return <path data-bio={bio} d={`M${x-9} ${y-7}L${x} ${y-11}L${x+10} ${y-5}L${x+7} ${y+7}L${x-3} ${y+10}L${x-11} ${y+2}Z`} fill={IC.red} stroke="#863640" strokeWidth={1.5}/>;}
