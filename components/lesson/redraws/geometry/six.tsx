import type React from 'react';
import {He,La} from '../helpers';
import {Responsive,Defs,IC,Membrane} from './immune';
export {He,La,Defs,IC,Membrane};
export function Pin({x,y,n}:{x:number;y:number;n:number}){return <g><circle cx={x} cy={y} r={16} fill="white" stroke="#526b7d" strokeWidth={1.2}/><La x={x} y={y+8} size={26} bold>{n}</La></g>;}
export function Lead({d}:{d:string}){return <path d={d} fill="none" stroke="#60778a" strokeWidth={1.2}/>;}
export function Plate({id,label,title,subtitle,draw,keys,foot}:{id:string;label:string;title:string;subtitle:string;draw:(id:string)=>React.ReactNode;keys:string[][];foot:string|string[]}){
 const footLines=Array.isArray(foot)?foot:[foot];
 const h=440+Math.ceil(keys.length/2)*50+40,mh=280+keys.length*48+55;
 const scene=(m=false)=>{const w=m?360:640,s=m?.55:1,yy=m?67:76;return <><Defs id={id+(m?'-m':'-d')}/><He x={w/2} y={30} size={m?22:25} bold>{title}</He><He x={w/2} y={56} size={m?15:16}>{subtitle}</He><g transform={`translate(${m?4:0} ${yy}) scale(${s})`}>{draw(id+(m?'-m':'-d'))}</g>{keys.map((lines,i)=>{const x=m?340:(i%2===0?610:298),y=(m?282:438)+(m?i:Math.floor(i/2))*(m?48:54);return <g key={i}><circle cx={x} cy={y-5} r={11} fill="#ecf2f6"/><La x={x} y={y} size={15} bold>{i+1}</La>{lines.map((t,j)=><He key={j} x={x-22} y={y+j*20} size={m?15:16} anchor="end">{t}</He>)}</g>;})}{footLines.map((line,i)=><He key={i} x={w/2} y={(m?mh:h)-17-(footLines.length-1-i)*24} size={m?14:16} color={IC.muted}>{line}</He>)}</>;}
 return <Responsive id={id} label={label} h={h} mh={mh} wide={scene()} mobile={scene(true)}/>;
}
export function Receptor({x,y,id,purple=false}:{x:number;y:number;id:string;purple?:boolean}){const c=purple?IC.purple:IC.blue;return <g transform={`translate(${x} ${y})`}>{[-1,1].map(s=><g key={s} transform={`scale(${s} 1)`}><path d="M4-38C7-60 36-56 35-30L24-4Q19 14 29 36C34 51 14 56 7 43L3 12Z" fill={`url(#${id}-${purple?'purple':'blue'})`} stroke={c} strokeWidth={2}/><path d="M12-44Q28-46 26-31L17-8" fill="none" stroke="#ffffffa0" strokeWidth={3}/></g>)}</g>;}
export function Vesicle({x,y,r=30}:{x:number;y:number;r?:number}){return <g><circle cx={x} cy={y} r={r} fill="#fff7e7" stroke={IC.green} strokeWidth={7}/><circle cx={x} cy={y} r={r-5} fill="none" stroke="#c6dcd0" strokeWidth={1.5}/>{Array.from({length:24},(_,i)=>{const a=i*Math.PI/12;return <circle key={i} cx={x+r*Math.cos(a)} cy={y+r*Math.sin(a)} r={2} fill="#d7e9d9"/>;})}{[[-10,-8],[8,-12],[-3,7],[13,9],[-13,12]].map(([dx,dy],i)=><circle key={i} cx={x+dx*r/30} cy={y+dy*r/30} r={3.4} fill={IC.gold}/>)}</g>;}
