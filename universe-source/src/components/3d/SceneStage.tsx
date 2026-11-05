'use client';
import dynamic from 'next/dynamic';
import {useEffect,useRef,useState} from 'react';
import {Pause,Play,RotateCcw,MoveUpRight} from 'lucide-react';
import {path,type Lang} from '@/data/portfolio';
import NeuralField from './NeuralField';

// Do not load the WebGL bundle on low-motion, data-saver or offscreen visits.
const Sculpture=dynamic(()=>import('./Sculpture'),{ssr:false});
type Pose={x:number;y:number};
export default function SceneStage({lang,lowMotion,onReady}:{lang:Lang;lowMotion:boolean;onReady:()=>void}){
 const fa=lang==='fa';
 const [paused,setPaused]=useState(false),[pose,setPose]=useState<Pose>({x:0,y:0}),[dragging,setDragging]=useState(false),[render3D,setRender3D]=useState(false);
 const drag=useRef<{x:number;y:number;pose:Pose}|null>(null);
 const host=useRef<HTMLDivElement>(null);
 const reset=()=>setPose({x:0,y:0});
 useEffect(()=>{
  const connection=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection;
  if(lowMotion||window.matchMedia('(prefers-reduced-motion: reduce)').matches||connection?.saveData||!('WebGL2RenderingContext' in window)){
   setRender3D(false);return;
  }
  const element=host.current;
  if(!element)return;
  if(!('IntersectionObserver' in window)){setRender3D(true);return;}
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){setRender3D(true);observer.disconnect();}
  },{rootMargin:'180px'});
  observer.observe(element);
  return()=>observer.disconnect();
 },[lowMotion]);
 return <div className={`hero-art scene-stage ${paused||lowMotion?'scene-paused':''} ${dragging?'is-dragging':''}`} ref={host}>
  <div className="scene-halo"/><NeuralField/><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/>
  <div className="fallback-pose" style={{transform:`perspective(1000px) rotateX(${pose.x*18}deg) rotateY(${pose.y*22}deg)`}}>
   <img className="sculpture-fallback-image" src={path('/images/sculpture.webp')} width="1100" height="1100" alt="" fetchPriority="high" onLoad={onReady} onError={onReady}/>
  </div>
  {render3D&&<Sculpture lowMotion={lowMotion||paused} onReady={onReady} pose={pose}/>}
  <div className="sculpture-hit-area" tabIndex={0} role="group" aria-label={fa?'مجسمه تعاملی؛ برای چرخاندن بکشید یا از کلیدهای جهت استفاده کنید.':'Interactive sculpture. Drag or use arrow keys to rotate.'}
   onPointerDown={e=>{if(e.button!==0)return;drag.current={x:e.clientX,y:e.clientY,pose};setDragging(true);e.currentTarget.setPointerCapture(e.pointerId)}}
   onPointerMove={e=>{if(!drag.current)return;setPose({x:Math.max(-1.5,Math.min(1.5,drag.current.pose.x+(e.clientY-drag.current.y)/200)),y:drag.current.pose.y+(e.clientX-drag.current.x)/180})}}
   onPointerUp={()=>{drag.current=null;setDragging(false)}} onPointerCancel={()=>{drag.current=null;setDragging(false)}}
   onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home',' '].includes(e.key)){e.preventDefault();if(e.key==='Home')reset();else if(e.key===' ')setPaused(p=>!p);else setPose(p=>({x:Math.max(-1.5,Math.min(1.5,p.x+(e.key==='ArrowDown'?.2:e.key==='ArrowUp'?-.2:0))),y:p.y+(e.key==='ArrowRight'?.25:e.key==='ArrowLeft'?-.25:0)}))}}}/>
  <span className="art-coordinate">{fa?'شبکه هوشمند / آزمایش فرم':'INTELLIGENT SYSTEMS / FORM LAB'}</span><span className="art-plus a">+</span><span className="art-plus b">+</span>
  <div className="scene-side-label"><span>03</span><i/>{fa?'مدار کنجکاوی':'ORBITAL THINKING'}</div>
  <div className="scene-controls"><span><MoveUpRight size={13}/>{fa?'بکشید و کشف کنید':'DRAG TO DISCOVER'}</span><div>{!lowMotion&&<button className="icon-button" aria-label={paused?(fa?'ادامه حرکت':'Play sculpture motion'):(fa?'توقف حرکت':'Pause sculpture motion')} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>}<button className="icon-button" onClick={reset} aria-label={fa?'بازنشانی زاویه مجسمه':'Reset sculpture view'}><RotateCcw size={14}/></button></div></div>
 </div>;
}
