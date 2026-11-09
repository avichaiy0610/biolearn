import {IC} from './immune';
export {Plate,Callout,Flow,He,La,IC} from './ub-zoo';
type V=[number,number,number];
const add=(a:V,b:V):V=>a.map((v,i)=>v+b[i]) as V;
const mul=(a:V,s:number):V=>a.map(v=>v*s) as V;
const dot=(a:V,b:V)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=(a:V)=>mul(a,1/Math.hypot(...a));
const phi=(1+Math.sqrt(5))/2;
const vertices:V[]=[];
for(const a of [-1,1])for(const b of [-phi,phi])vertices.push([0,a,b],[a,b,0],[b,0,a]);
const adjacent=(a:number,b:number)=>Math.abs(Math.hypot(...add(vertices[a],mul(vertices[b],-1)))-2)<.001;
const faces:number[][]=[];
for(let a=0;a<12;a++)for(let b=a+1;b<12;b++)for(let c=b+1;c<12;c++)if(adjacent(a,b)&&adjacent(b,c)&&adjacent(c,a))faces.push([a,b,c]);
const mean=(ps:V[])=>mul(ps.reduce(add,[0,0,0]),1/ps.length);
function order(ps:V[],normal:V){const center=mean(ps),u=unit(add(ps[0],mul(center,-1))),v=unit(cross(normal,u));return ps.sort((a,b)=>Math.atan2(dot(add(a,mul(center,-1)),v),dot(add(a,mul(center,-1)),u))-Math.atan2(dot(add(b,mul(center,-1)),v),dot(add(b,mul(center,-1)),u)));}
function rotate(p:V):V{const a=.35,b=.28,x=p[0]*Math.cos(a)+p[2]*Math.sin(a),z=-p[0]*Math.sin(a)+p[2]*Math.cos(a);return [x,p[1]*Math.cos(b)-z*Math.sin(b),p[1]*Math.sin(b)+z*Math.cos(b)];}
// T=1: dual icosahedron (12 pentamers). T=3: truncated icosahedron
// (12 pentamers + 20 hexamers). Back faces are hidden, never counted as absent.
export function capsidFaces(t:1|3,cx:number,cy:number,r:number){
 const polygons=vertices.map((p,i)=>({kind:'pentamer',normal:p,ps:order(t===1?faces.filter(f=>f.includes(i)).map(f=>mean(f.map(j=>vertices[j]))):vertices.flatMap((q,j)=>adjacent(i,j)?[mul(add(mul(p,2),q),1/3)]:[]),p)}));
 if(t===3)for(const f of faces){const p=f.map(i=>vertices[i]);polygons.push({kind:'hexamer',normal:mean(p),ps:order(p.flatMap((a,i)=>[mul(add(mul(a,2),p[(i+1)%3]),1/3),mul(add(a,mul(p[(i+1)%3],2)),1/3)]),mean(p))});}
 const scale=r/Math.max(...polygons.flatMap(f=>f.ps.map(p=>Math.hypot(...p))));
 return polygons.map(f=>({...f,normal:rotate(f.normal),points:f.ps.map(rotate).map(p=>[cx+scale*p[0],cy-scale*p[1]] as [number,number])})).filter(f=>f.normal[2]>0).sort((a,b)=>a.normal[2]-b.normal[2]);
}
export function Capsid({t,cx,cy,r}:{t:1|3;cx:number;cy:number;r:number}){return <g>{capsidFaces(t,cx,cy,r).map((f,i)=>{const center=f.points.reduce((s,p)=>[s[0]+p[0]/f.points.length,s[1]+p[1]/f.points.length],[0,0]);return <g key={i}><polygon data-bio={t===1?'t1':f.kind} points={f.points.map(p=>p.join(',')).join(' ')} fill={f.kind==='pentamer'?'#c5a9d6':'#a9cde5'} stroke={f.kind==='pentamer'?'#705080':IC.blueDark} strokeWidth={1.5}/>{f.points.map((p,j)=><path key={j} d={`M${center}L${(p[0]+f.points[(j+1)%f.points.length][0])/2} ${(p[1]+f.points[(j+1)%f.points.length][1])/2}`} fill="none" stroke="#ffffffb0" strokeWidth={.8}/>)}</g>;})}</g>;}
export function faceTarget(t:1|3,cx:number,cy:number,r:number,kind:string){const f=capsidFaces(t,cx,cy,r).filter(f=>t===1||f.kind===kind).sort((a,b)=>b.normal[2]-a.normal[2])[0];return f.points.reduce((s,p)=>[s[0]+p[0]/f.points.length,s[1]+p[1]/f.points.length],[0,0]);}
