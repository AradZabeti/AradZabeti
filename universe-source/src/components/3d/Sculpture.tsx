'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

type Pose={x:number;y:number};
export default function Sculpture({lowMotion,onReady,pose}:{lowMotion:boolean;onReady:()=>void;pose:Pose}){
 const host=useRef<HTMLDivElement>(null);
 const ready=useRef(onReady),orientation=useRef(pose),motion=useRef(lowMotion);
 ready.current=onReady;orientation.current=pose;motion.current=lowMotion;
 useEffect(()=>{
  const container=host.current;
  if(!container)return;
  const compact=window.innerWidth<=700||window.matchMedia('(pointer: coarse)').matches;
  let renderer:THREE.WebGLRenderer;
  try{
   const canvas=document.createElement('canvas');
   const context=canvas.getContext('webgl2',{alpha:true,antialias:!compact,powerPreference:'low-power'});
   if(!context){ready.current();return;}
   renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:!compact,powerPreference:'low-power'});
  }catch{ready.current();return;}

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(32,1,.1,50);
  camera.position.set(0,0,7.7);
  // Cap GPU allocation on small devices; geometry and render rate scale with the viewport.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,compact?1:1.4));
  renderer.setClearColor(0,0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.2;
  container.appendChild(renderer.domElement);

  let env:RoomEnvironment|null=null;
  let pmrem:THREE.PMREMGenerator|null=null;
  let target:THREE.WebGLRenderTarget|null=null;
  if(!compact){
   env=new RoomEnvironment();
   pmrem=new THREE.PMREMGenerator(renderer);
   target=pmrem.fromScene(env,.04);
   scene.environment=target.texture;
  }
  const group=new THREE.Group();scene.add(group);
  const geo=new THREE.TorusKnotGeometry(1.15,.37,compact?108:192,compact?14:26,2,3);
  const mat=new THREE.MeshPhysicalMaterial({
   color:0xb8c9e5,metalness:compact?.65:1,roughness:compact?.3:.16,
   clearcoat:compact?.35:.95,clearcoatRoughness:.16,envMapIntensity:1.5
  });
  group.add(new THREE.Mesh(geo,mat));
  group.rotation.set(.2,-.3,-.4);
  const purple=new THREE.PointLight(0x9b76ff,compact?32:45,15);purple.position.set(-3,2,3);scene.add(purple);
  const cyan=new THREE.PointLight(0x72e9f4,compact?24:32,15);cyan.position.set(3,-1,2);scene.add(cyan);
  const fill=new THREE.DirectionalLight(0xffffff,compact?3:4);fill.position.set(0,4,4);scene.add(fill);

  let frame=0,visible=true,last=0,time=0,mx=0,my=0,ax=0,ay=0,disposed=false,contextLost=false;
  const interval=1000/(compact?24:30);
  const resize=()=>{
   const box=container.getBoundingClientRect();
   if(box.width<2||box.height<2)return;
   renderer.setSize(box.width,box.height,false);
   camera.aspect=box.width/box.height;
   camera.updateProjectionMatrix();
  };
  resize();
  const ro=new ResizeObserver(resize);
  ro.observe(container);
  const pointer=(e:PointerEvent)=>{
   const rect=container.getBoundingClientRect();
   if(rect.width<1||rect.height<1)return;
   ax=THREE.MathUtils.clamp((e.clientX-rect.left)/rect.width*2-1,-1,1);
   ay=THREE.MathUtils.clamp((e.clientY-rect.top)/rect.height*2-1,-1,1);
  };
  if(!compact)window.addEventListener('pointermove',pointer,{passive:true});

  const draw=(now:number)=>{
   frame=0;
   if(disposed||contextLost||!visible||document.hidden)return;
   if(last&&now-last<interval&&!motion.current){frame=requestAnimationFrame(draw);return;}
   const dt=last?Math.min((now-last)/1000,.05):0;
   last=now;
   if(!motion.current)time+=dt;
   mx+=(ax-mx)*.04;my+=(ay-my)*.04;
   group.rotation.y=-.3+orientation.current.y+time*.12+(motion.current?0:mx*.1);
   group.rotation.x=.2+orientation.current.x+Math.sin(time*.23)*.15+(motion.current?0:my*.07);
   group.position.y=Math.sin(time*.65)*.07;
   group.rotation.z=-.4+(motion.current?0:Math.min(window.scrollY/Math.max(window.innerHeight,1),1)*.19);
   renderer.render(scene,camera);
   if(!motion.current)frame=requestAnimationFrame(draw);
  };
  const play=()=>{cancelAnimationFrame(frame);last=0;if(!disposed&&!contextLost&&visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  const io=new IntersectionObserver(([entry])=>{
   visible=entry.isIntersecting;
   if(visible)play();else cancelAnimationFrame(frame);
  });
  io.observe(container);
  const onVisibility=()=>{if(!document.hidden)play();else cancelAnimationFrame(frame);};
  document.addEventListener('visibilitychange',onVisibility);
  const onLost=(event:Event)=>{
   event.preventDefault();contextLost=true;visible=false;cancelAnimationFrame(frame);
   // Removing the canvas restores the accessible, interactive image fallback.
   renderer.domElement.remove();ready.current();
  };
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  window.addEventListener('az-sculpture-pose',play);
  play();ready.current();
  return()=>{
   disposed=true;cancelAnimationFrame(frame);
   window.removeEventListener('az-sculpture-pose',play);
   window.removeEventListener('pointermove',pointer);
   document.removeEventListener('visibilitychange',onVisibility);
   io.disconnect();ro.disconnect();
   renderer.domElement.removeEventListener('webglcontextlost',onLost);
   geo.dispose();mat.dispose();target?.dispose();pmrem?.dispose();env?.dispose();
   renderer.dispose();renderer.domElement.remove();
  };
 },[]);
 useEffect(()=>{window.dispatchEvent(new Event('az-sculpture-pose'));},[pose,lowMotion]);
 return <div className="sculpture-canvas" ref={host} aria-hidden="true"/>;
}
