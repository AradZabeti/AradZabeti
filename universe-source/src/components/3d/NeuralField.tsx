/** Decorative, deterministic SVG constellation: no canvas, timers or network requests. */
type Point = {x:number;y:number;ring:number;index:number};
const counts=[8,12,16] as const;
const radii=[116,181,254] as const;
const rings:Point[][]=counts.map((count,ring)=>
 Array.from({length:count},(_,index)=>{
  const theta=(Math.PI*2*index)/count+ring*.17;
  return {x:320+Math.cos(theta)*radii[ring],y:320+Math.sin(theta)*radii[ring]*.72,ring,index};
 })
);
const points=rings.flat();
const links=rings.flatMap((items,ring)=>items.flatMap((point,index)=>{
 const next=items[(index+1)%items.length];
 const bridge=ring<2?rings[ring+1][Math.floor(index*rings[ring+1].length/items.length)]:null;
 return [
  {a:point,b:next,bridge:false},
  ...(bridge?[{a:point,b:bridge,bridge:true}]:[])
 ];
}));
export default function NeuralField(){
 return <div className="neural-field" aria-hidden="true">
  <div className="neural-field-grid"/>
  <div className="neural-field-orbit neural-field-orbit-a"/>
  <div className="neural-field-orbit neural-field-orbit-b"/>
  <svg className="neural-field-map" viewBox="0 0 640 640" focusable="false">
   <defs>
    <linearGradient id="neural-trace" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#A78BFA"/><stop offset=".62" stopColor="#69D9FA"/><stop offset="1" stopColor="#60EED8"/></linearGradient>
    <radialGradient id="neural-core"><stop stopColor="#866DFA" stopOpacity=".22"/><stop offset="1" stopColor="#866DFA" stopOpacity="0"/></radialGradient>
   </defs>
   <circle cx="320" cy="320" r="242" fill="url(#neural-core)"/>
   {radii.map((radius,index)=><ellipse key={radius} cx="320" cy="320" rx={radius} ry={radius*.72} stroke="url(#neural-trace)" strokeOpacity={index===2?.15:.28} strokeWidth=".9" strokeDasharray={index===2?'3 12':undefined} fill="none"/>)}
   <g stroke="url(#neural-trace)" strokeWidth=".85" fill="none">
    {links.map((link,i)=><path key={i} d={`M${link.a.x.toFixed(1)} ${link.a.y.toFixed(1)}L${link.b.x.toFixed(1)} ${link.b.y.toFixed(1)}`} strokeOpacity={link.bridge?.14:.34}/>)}
   </g>
   <g fill="#9BE8F7">
    {points.map((point,i)=><circle key={i} cx={point.x} cy={point.y} r={point.ring===0?3.5:point.ring===1?2.8:2.1} opacity={point.ring===2?.55:.85}/>)}
   </g>
   <circle cx="320" cy="320" r="39" fill="#0C1630" fillOpacity=".7" stroke="#8A9CF5" strokeOpacity=".6"/>
   <circle cx="320" cy="320" r="21" fill="none" stroke="#84DBED" strokeOpacity=".65" strokeDasharray="2 7"/>
   <path d="M306 320H334M320 306V334" stroke="#C2EEFF" strokeOpacity=".75"/>
  </svg>
  <span className="neural-field-corner neural-field-corner-a"/>
  <span className="neural-field-corner neural-field-corner-b"/>
 </div>;
}
