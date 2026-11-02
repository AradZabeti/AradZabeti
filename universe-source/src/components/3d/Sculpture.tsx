'use client';
import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export default function Sculpture({lowMotion,onReady,pose}:{lowMotion:boolean;onReady:()=>void;pose:{x:number;y:number}}){
 const host=useRef<HTMLDivElement>(null); const ready=useRef(onReady),orientation=useRef(pose),motion=useRef(lowMotion);ready.current=onReady;orientation.current=pose;motion.current=lowMotion;
 useEffect(()=>{
  const container=host.current;if(!container)return;
  let renderer:THREE.WebGLRenderer;
  try { const canvas=document.createElement('canvas');const context=canvas.getContext('webgl2',{alpha:true,antialias:window.innerWidth>700,powerPreference:'low-power'});if(!context){ready.current();return;}renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:window.innerWidth>700,powerPreference:'low-power'});}catch{ready.current();return;}
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,50);camera.position.set(0,0,7.7);
  renderer.setPixelRatio(Math.min(devicePixelRatio,window.innerWidth<700?1.1:1.6));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;container.appendChild(renderer.domElement);
  const env=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),target=pmrem.fromScene(env,.04);scene.environment=target.texture;
  const group=new THREE.Group();scene.add(group);
  const geo=new THREE.TorusKnotGeometry(1.15,.37,window.innerWidth<700?160:260,window.innerWidth<700?20:36,2,3);
  const mat=new THREE.MeshPhysicalMaterial({color:0xb8c1df,metalness:1,roughness:.13,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.65});
  const knot=new THREE.Mesh(geo,mat);group.add(knot);group.rotation.set(.2,-.3,-.4);
  const point1=new THREE.PointLight(0x916bff,45,15);point1.position.set(-3,2,3);scene.add(point1);
  const point2=new THREE.PointLight(0x66ddf5,32,15);point2.position.set(3,-1,2);scene.add(point2);
  const area=new THREE.DirectionalLight(0xffffff,4);area.position.set(0,4,4);scene.add(area);
  let frame=0,visible=true,last=0,time=0,mx=0,my=0,ax=0,ay=0,disposed=false;
  const resize=()=>{const b=container.getBoundingClientRect();renderer.setSize(b.width,b.height);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();};resize();
  const ro=new ResizeObserver(resize);ro.observe(container);
  const move=(e:PointerEvent)=>{const b=container.getBoundingClientRect();ax=Math.max(-1,Math.min(1,(e.clientX-b.left)/b.width*2-1));ay=Math.max(-1,Math.min(1,(e.clientY-b.top)/b.height*2-1));};
  window.addEventListener('pointermove',move,{passive:true});
  const draw=(now:number)=>{frame=0;if(disposed||!visible||document.hidden)return;if(now-last<32&&!motion.current){frame=requestAnimationFrame(draw);return;}if(!motion.current)time+=Math.min((now-last)/1000,.05);last=now;mx+=(ax-mx)*.04;my+=(ay-my)*.04;
   group.rotation.y=-.3+orientation.current.y+time*.12+(motion.current?0:mx*.12);group.rotation.x=.2+orientation.current.x+Math.sin(time*.23)*.15+(motion.current?0:my*.08);group.position.y=Math.sin(time*.65)*.07;group.rotation.z=-.4+(motion.current?0:Math.min(scrollY/innerHeight,1)*.24);renderer.render(scene,camera);if(!motion.current)frame=requestAnimationFrame(draw);
  };
  const play=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);};
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)play();else cancelAnimationFrame(frame);});io.observe(container);document.addEventListener('visibilitychange',play);
  const lost=(e:Event)=>{e.preventDefault();visible=false;cancelAnimationFrame(frame);renderer.domElement.remove();};renderer.domElement.addEventListener('webglcontextlost',lost);
  const redraw=()=>{play()};window.addEventListener('az-sculpture-pose',redraw);play();ready.current();
  return()=>{disposed=true;window.removeEventListener('az-sculpture-pose',redraw);cancelAnimationFrame(frame);ro.disconnect();io.disconnect();window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',play);renderer.domElement.removeEventListener('webglcontextlost',lost);geo.dispose();mat.dispose();target.dispose();pmrem.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 useEffect(()=>{window.dispatchEvent(new Event('az-sculpture-pose'))},[pose,lowMotion]);
 return <div className="sculpture-canvas" ref={host} aria-hidden="true"/>;
}
