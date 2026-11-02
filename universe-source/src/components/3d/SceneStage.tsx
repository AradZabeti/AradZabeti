'use client';
import dynamic from 'next/dynamic';
import {useRef,useState} from 'react';
import {Pause,Play,RotateCcw,MoveUpRight} from 'lucide-react';
import {path,type Lang} from '@/data/portfolio';
const Sculpture=dynamic(()=>import('./Sculpture'),{ssr:false});
export default function SceneStage({lang,lowMotion,onReady}:{lang:Lang;lowMotion:boolean;onReady:()=>void}){
 const fa=lang==='fa';
 const [paused,setPaused]=useState(false),[pose,setPose]=useState({x:0,y:0}),[dragging,setDragging]=useState(false);
 const drag=useRef<{x:number;y:number;pose:{x:number;y:number}}|null>(null);
 const reset=()=>setPose({x:0,y:0});
 return <div className={`hero-art scene-stage ${paused||lowMotion?'scene-paused':''} ${dragging?'is-dragging':''}`}>
  <div className="scene-halo"/><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/>
  <div className="fallback-pose" style={{transform:`perspective(1000px) rotateX(${pose.x*18}deg) rotateY(${pose.y*22}deg)`}}><img className="sculpture-fallback-image" src={path('/images/sculpture.webp')} width="1100" height="1100" alt="" fetchPriority="high" onLoad={onReady} onError={onReady}/></div>
  <Sculpture lowMotion={lowMotion||paused} onReady={onReady} pose={pose}/>
  <div className="sculpture-hit-area" tabIndex={0} role="group" aria-label={fa?'مجسمه تعاملی؛ با کشیدن یا کلیدهای جهت بچرخانید.':'Interactive sculpture. Drag or use arrow keys to rotate.'}
   onPointerDown={e=>{if(e.button!==0)return;drag.current={x:e.clientX,y:e.clientY,pose};setDragging(true);e.currentTarget.setPointerCapture(e.pointerId)}}
   onPointerMove={e=>{if(!drag.current)return;setPose({x:Math.max(-1.5,Math.min(1.5,drag.current.pose.x+(e.clientY-drag.current.y)/200)),y:drag.current.pose.y+(e.clientX-drag.current.x)/180})}}
   onPointerUp={()=>{drag.current=null;setDragging(false)}} onPointerCancel={()=>{drag.current=null;setDragging(false)}}
   onKeyDown={e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home',' '].includes(e.key)){e.preventDefault();if(e.key==='Home')reset();else if(e.key===' ')setPaused(p=>!p);else setPose(p=>({x:Math.max(-1.5,Math.min(1.5,p.x+(e.key==='ArrowDown'?.2:e.key==='ArrowUp'?-.2:0))),y:p.y+(e.key==='ArrowRight'?.25:e.key==='ArrowLeft'?-.25:0)}))}}}/>
  <span className="art-coordinate">FORM STUDY — NO. 004 / CONTINUOUS CURIOSITY</span><span className="art-plus a">+</span><span className="art-plus b">+</span>
  <div className="scene-side-label"><span>01</span><i/>{fa?'فرمِ کنجکاوی':'THE SHAPE OF CURIOSITY'}</div>
  <div className="scene-controls"><span><MoveUpRight size={13}/>{fa?'بکشید و کشف کنید':'DRAG TO DISCOVER'}</span><div>{!lowMotion&&<button className="icon-button" aria-label={paused?(fa?'ادامه حرکت':'Play sculpture motion'):(fa?'توقف حرکت':'Pause sculpture motion')} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={14}/>:<Pause size={14}/>}</button>}<button className="icon-button" onClick={reset} aria-label={fa?'بازنشانی زاویه مجسمه':'Reset sculpture view'}><RotateCcw size={14}/></button></div></div>
 </div>
}
