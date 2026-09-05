const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const palette=$('#palette'),terminal=$('#terminal'),input=$('#paletteInput'),tInput=$('#terminalInput'),out=$('#terminalOutput');
const commands=[
 ['About','Jump to About section','about'],['Skills','Jump to Toolkit','skills'],['Projects','Explore interactive projects','projects'],['Interactive Lab','Open experiments','lab'],['Contact','Jump to contact','contact'],['Terminal','Open developer terminal','terminal'],['GitHub','Open GitHub profile','github'],['KookTools','Open live music toolkit','kook']
];
function openPalette(){palette.classList.add('open');input.value='';renderCommands();setTimeout(()=>input.focus(),20)}
function closePalette(){palette.classList.remove('open')}
function renderCommands(){const q=input.value.toLowerCase().trim();const list=commands.filter(c=>(c[0]+' '+c[1]).toLowerCase().includes(q));$('#commandList').innerHTML=list.map((c,i)=>`<div class="cmd ${i===0?'selected':''}" data-cmd="${c[2]}"><b>${c[0]}</b><span>${c[1]}</span></div>`).join('')||'<div class="cmd"><span>No commands found</span></div>';selected=0;$$('.cmd').forEach(x=>x.onclick=()=>runCommand(x.dataset.cmd))}
function runCommand(cmd){closePalette();if(cmd==='terminal'){openTerminal();return}if(cmd==='github'){window.open('https://github.com/AradZabeti','_blank');return}if(cmd==='kook'){window.open('https://kooktools.netlify.app','_blank');return}document.getElementById(cmd)?.scrollIntoView({behavior:'smooth',block:'start'})}
$('#paletteBtn').onclick=openPalette;$('#labPalette').onclick=openPalette;$('#terminalOpen').onclick=openTerminal;$$('[data-terminal]').forEach(x=>x.onclick=openTerminal);input.oninput=renderCommands;
function openTerminal(){terminal.classList.add('open');setTimeout(()=>tInput.focus(),30)}function closeTerminal(){terminal.classList.remove('open')}
$('#terminalClose').onclick=closeTerminal;
function print(html){const d=document.createElement('div');d.innerHTML=html;out.appendChild(d);out.scrollTop=out.scrollHeight}
function help(){print('<div class="accent">Available commands:</div><div><b>help</b> — show commands</div><div><b>about</b> — who is Arad?</div><div><b>skills</b> — tech stack</div><div><b>projects</b> — selected work</div><div><b>music</b> — trumpet + music technology</div><div><b>stack</b> — engineering stack</div><div><b>status</b> — current portfolio systems</div><div><b>lab</b> — interactive lab</div><div><b>clear</b> — clear terminal</div><div><b>open github</b> — GitHub profile</div><div><b>open kook</b> — KookTools</div><div><b>palette</b> — Command Palette</div><div><b>whoami</b> — current developer</div>')}
function safeCommand(raw){return raw.replaceAll('<','&lt;').replaceAll('>','&gt;')}
$('#terminalForm').onsubmit=e=>{e.preventDefault();const raw=tInput.value.trim(),cmd=raw.toLowerCase();if(!raw)return;print(`<div><span class="green">arad@portfolio:~$</span> ${safeCommand(raw)}</div>`);tInput.value='';if(cmd==='help')help();else if(cmd==='clear')out.innerHTML='';else if(cmd==='whoami')print('<span class="purple">Arad Zabeti</span> — developer / builder / music-tech explorer.');else if(cmd==='about')print('Developer focused on <span class="accent">software, AI, automation and music technology</span>.');else if(cmd==='skills'||cmd==='stack')print('<span class="accent">Engineering:</span> Python · FastAPI · JavaScript · PostgreSQL · Redis · Docker · n8n · AI Agents · Git · Linux');else if(cmd==='projects')print('<span class="purple">Featured:</span> KookTools · Arad Music OS · Telegram systems · Interactive Portfolio');else if(cmd==='music')print('<span class="accent">Music corner:</span> 🎺 Trumpet · Arban · Music Technology · KookTools · Arad Music OS');else if(cmd==='status')print('<span class="green">SYSTEMS ONLINE</span><br>Portfolio · GitHub Pages · GitHub Actions · Snake · Spotify workflow');else if(cmd==='lab'){closeTerminal();$('#lab').scrollIntoView({behavior:'smooth'});return}else if(cmd==='palette'){openPalette();return}else if(cmd==='open github'){window.open('https://github.com/AradZabeti','_blank')}else if(cmd==='open kook'){window.open('https://kooktools.netlify.app','_blank')}else print(`<span class="dim">command not found:</span> ${safeCommand(cmd)}. Type <b>help</b>.`)};
function closeModals(){closePalette();closeTerminal()}document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette()}if(e.key==='Escape')closeModals()});
let selected=0;input.addEventListener('keydown',e=>{const items=$$('.cmd');if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!items.length)return;selected=(selected+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach((x,i)=>x.classList.toggle('selected',i===selected))}if(e.key==='Enter'&&items[selected])items[selected].click()});
$$('.project[data-demo]').forEach(x=>x.onclick=e=>{if(e.target.closest('.project-action')){openTerminal();setTimeout(()=>{tInput.value='demo music';$('#terminalForm').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}))},80)}});
const hue=$('#hue'),orb=$('#colorOrb'),value=$('#colorValue');function updateColor(){const h=hue.value;orb.style.background=`hsl(${h} 80% 70%)`;orb.style.boxShadow=`0 0 70px hsla(${h} 80% 65% /.25)`;value.textContent='#'+h.toString().padStart(3,'0')};hue.oninput=updateColor;
addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--mx',`${e.clientX}px`);document.documentElement.style.setProperty('--my',`${e.clientY}px`)},{passive:true});
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max?(scrollY/max)*100:0)+'%'},{passive:true});
const sections=$$('main section[id]'),nav=$$('.navlinks a');addEventListener('scroll',()=>{let id='';sections.forEach(s=>{if(scrollY>=s.offsetTop-180)id=s.id});nav.forEach(a=>a.classList.toggle('active',a.hash==='#'+id))},{passive:true});

/* Portfolio 2.0 — sharper positioning, richer hero and project metadata. */
(()=>{
 const style=document.createElement('style');
 style.textContent=`
 .hero-copy .hero-role{display:block;margin-top:16px;color:#c5cbd6;font:500 11px 'DM Mono';letter-spacing:.08em;text-transform:uppercase}
 .hero-copy .hero-blurb{max-width:620px}
 .hero-copy .hero-metrics{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
 .hero-copy .hero-metric{padding:8px 10px;border:1px solid #252934;background:#0c0e14;border-radius:9px;color:#7f8999;font:500 9px 'DM Mono'}
 .hero-copy .hero-metric strong{color:#e6e9ef;font-weight:500}
 .hero-art .orb{position:relative}
 .hero-art .orb-label{position:absolute;inset:auto 0 -54px;text-align:center;color:#667081;font:500 9px 'DM Mono';letter-spacing:.16em;text-transform:uppercase}
 .project .project-stack{display:flex;flex-wrap:wrap;gap:6px;margin-top:17px}
 .project .project-stack span{padding:5px 7px;border:1px solid #272c36;border-radius:6px;color:#727c8c;font:500 8px 'DM Mono'}
 .project .project-status{color:#4ade80!important}
 @media(max-width:800px){.hero-copy .hero-metrics{margin-top:18px}.hero-art .orb-label{display:none}}
 
 .lab2-shell{display:grid;grid-template-columns:1.2fr .8fr;gap:12px;margin-top:22px}
 .lab2-card{border:1px solid #242832;background:#0b0d12;border-radius:14px;padding:18px;min-height:230px;position:relative;overflow:hidden}
 .lab2-card h3{margin:0 0 7px;font:600 12px 'Space Grotesk';color:#e9edf4}
 .lab2-card p{margin:0;color:#747e8e;font:500 9px 'DM Mono';line-height:1.7}
 .lab2-kicker{color:#687386;font:500 8px 'DM Mono';letter-spacing:.14em;text-transform:uppercase;margin-bottom:9px}
 .lab2-controls{display:flex;flex-wrap:wrap;gap:8px;margin-top:15px;align-items:center}
 .lab2-btn,.lab2-select{border:1px solid #2a303b;background:#10131a;color:#dfe4ec;border-radius:8px;padding:8px 10px;font:500 9px 'DM Mono';cursor:pointer}
 .lab2-btn:hover{border-color:#596273;transform:translateY(-1px)}
 .lab2-btn.active{border-color:#e4e8ef;box-shadow:0 0 0 1px #e4e8ef inset}
 .lab2-range{width:150px;accent-color:#d9dee7}
 .lab2-bpm{font:600 18px 'DM Mono';color:#f0f2f6;min-width:62px}
 .lab2-beats{display:flex;gap:7px;margin-top:18px;align-items:end;height:56px}
 .lab2-beat{width:13px;height:13px;border-radius:50%;background:#252b35;border:1px solid #3a424f;transition:.12s}
 .lab2-beat.on{background:#e7ebf2;box-shadow:0 0 20px rgba(235,240,248,.45);transform:scale(1.35)}
 .lab2-note{font:600 27px 'Space Grotesk';color:#f1f3f7;margin-top:18px}
 .lab2-sub{font:500 8px 'DM Mono';color:#626c7b;margin-top:3px}
 .flow{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:25px}
 .flow-node{padding:10px 9px;border:1px solid #29303a;border-radius:9px;background:#0e1117;color:#b9c0cb;font:600 8px 'DM Mono';transition:.2s}
 .flow-node.live{border-color:#eef1f6;color:#fff;box-shadow:0 0 22px rgba(255,255,255,.12);transform:translateY(-2px)}
 .flow-arrow{color:#4e5868;font:700 11px 'DM Mono'}
 .flow-status{margin-top:20px;color:#697384;font:500 9px 'DM Mono';min-height:18px}
 .arch{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:20px}
 .arch-node{padding:12px 8px;border:1px solid #252b35;border-radius:9px;background:#0e1117;text-align:center;color:#9aa3b1;font:600 8px 'DM Mono';cursor:pointer;transition:.2s}
 .arch-node:hover,.arch-node.active{border-color:#e6eaf0;color:#fff;transform:translateY(-2px)}
 .arch-detail{margin-top:13px;padding:10px;border-left:2px solid #4a5361;color:#717b8b;font:500 8px 'DM Mono';line-height:1.6;min-height:38px}
 @media(max-width:800px){.lab2-shell{grid-template-columns:1fr}.arch{grid-template-columns:repeat(2,1fr)}}
 `;
 document.head.appendChild(style);
 const hero=document.querySelector('.hero-copy');
 if(hero){
   const h1=hero.querySelector('h1');
   if(h1) h1.innerHTML='<span class="grad">ARAD</span><br>ZABETI';
   let role=hero.querySelector('.hero-role');
   if(!role){role=document.createElement('span');role.className='hero-role';h1?.insertAdjacentElement('afterend',role)}
   role.textContent='Developer · AI & Automation Builder · Music Technology · 🎺 Trumpet';
   const p=hero.querySelector('p');
   if(p){p.classList.add('hero-blurb');p.textContent='I build software, AI-powered automation and music technology — turning ideas into fast, useful and interactive systems.'}
   let metrics=hero.querySelector('.hero-metrics');
   if(!metrics){metrics=document.createElement('div');metrics.className='hero-metrics';hero.appendChild(metrics)}
   metrics.innerHTML='<span class="hero-metric"><strong>AI</strong> automation</span><span class="hero-metric"><strong>Music</strong> technology</span><span class="hero-metric"><strong>Python</strong> · JS · APIs</span><span class="hero-metric"><strong>Building</strong> in public</span>';
 }
 const orb=document.querySelector('.orb');
 if(orb&&!orb.querySelector('.orb-label')){const label=document.createElement('span');label.className='orb-label';label.textContent='software × ai × music';orb.appendChild(label)}
 const cards=[...document.querySelectorAll('.project')];
 const meta=[
  ['KookTools',['Web Audio','JavaScript','Music Tech'],'LIVE'],
  ['Arad Music OS',['Python','AI','Practice Systems'],'BUILDING'],
  ['AI & Automation',['Agents','n8n','APIs'],'LAB'],
  ['Telegram Systems',['Bots','FastAPI','Automation'],'BUILDING']
 ];
 cards.forEach((card,i)=>{const title=card.querySelector('h3')?.textContent?.trim()||'';const m=meta.find(x=>title.toLowerCase().includes(x[0].split(' ')[0].toLowerCase()))||meta[i];if(!m)return;const head=card.querySelector('.project-head');if(head){const s=head.querySelector('span');if(s){s.textContent=m[2];s.classList.toggle('project-status',m[2]==='LIVE')}}let stack=card.querySelector('.project-stack');if(!stack){stack=document.createElement('div');stack.className='project-stack';const p=card.querySelector('p');p?.insertAdjacentElement('afterend',stack)}stack.innerHTML=m[1].map(x=>`<span>${x}</span>`).join('')});

 /* Interactive Lab 2.0: generated entirely in JS so the existing static HTML remains intact. */
 const lab=document.querySelector('#lab');
 if(lab&&!document.querySelector('#lab2')){
   const wrap=document.createElement('div');wrap.id='lab2';wrap.className='lab2-shell';
   wrap.innerHTML=`
    <article class="lab2-card">
      <div class="lab2-kicker">01 · Music Lab</div><h3>Pulse Engine</h3><p>A browser-native metronome and pitch playground. Audio starts only after interaction.</p>
      <div class="lab2-controls"><button class="lab2-btn" id="lab2Play">START</button><span class="lab2-bpm" id="lab2Bpm">96</span><span class="lab2-sub">BPM</span><input class="lab2-range" id="lab2Range" type="range" min="40" max="220" value="96" aria-label="Tempo"></div>
      <div class="lab2-beats" id="lab2Beats">${Array.from({length:8},(_,i)=>`<span class="lab2-beat" data-beat="${i}"></span>`).join('')}</div>
      <div class="lab2-note" id="lab2Note">C4</div><div class="lab2-sub">Trumpet practice pulse · 261.63 Hz</div>
      <div class="lab2-controls"><select class="lab2-select" id="lab2Wave"><option value="sine">Sine</option><option value="triangle">Triangle</option><option value="square">Square</option><option value="sawtooth">Saw</option></select><button class="lab2-btn" data-note="C4">C4</button><button class="lab2-btn" data-note="G4">G4</button><button class="lab2-btn" data-note="Bb4">Bb4</button><button class="lab2-btn" data-note="C5">C5</button></div>
    </article>
    <article class="lab2-card">
      <div class="lab2-kicker">02 · AI Workflow</div><h3>Agent Pipeline</h3><p>Watch a request travel through a simplified AI automation architecture.</p>
      <div class="flow" id="lab2Flow"><span class="flow-node">INPUT</span><span class="flow-arrow">→</span><span class="flow-node">PROMPT</span><span class="flow-arrow">→</span><span class="flow-node">MODEL</span><span class="flow-arrow">→</span><span class="flow-node">TOOL</span><span class="flow-arrow">→</span><span class="flow-node">OUTPUT</span></div>
      <div class="lab2-controls"><button class="lab2-btn" id="lab2Run">RUN WORKFLOW</button><button class="lab2-btn" id="lab2Reset">RESET</button></div><div class="flow-status" id="lab2Status">READY · waiting for input</div>
    </article>
    <article class="lab2-card" style="grid-column:1/-1;min-height:210px">
      <div class="lab2-kicker">03 · System Architecture</div><h3>Click the stack</h3><p>Explore how the pieces of a production-style system connect.</p>
      <div class="arch" id="lab2Arch"><button class="arch-node active" data-detail="Browser UI — interaction, visuals and Web Audio.">FRONTEND</button><button class="arch-node" data-detail="API layer — routes requests and coordinates services.">API</button><button class="arch-node" data-detail="AI layer — agents, prompts and model orchestration.">AI</button><button class="arch-node" data-detail="Redis — fast state, queues and caching.">REDIS</button><button class="arch-node" data-detail="PostgreSQL — durable application data.">POSTGRES</button><button class="arch-node" data-detail="Worker — background jobs and automation.">WORKER</button></div>
      <div class="arch-detail" id="lab2Detail">Browser UI — interaction, visuals and Web Audio.</div>
    </article>`;
   lab.appendChild(wrap);

   let audioCtx=null, timer=null, beat=0, bpm=96;
   const frequencies={C4:261.63,G4:392,Bb4:466.16,C5:523.25};
   const ensureAudio=async()=>{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')await audioCtx.resume()};
   const tone=(freq,duration=.07)=>{if(!audioCtx)return;const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type=$('#lab2Wave').value;osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.12,audioCtx.currentTime+.005);gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+duration);osc.connect(gain).connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration+.01)};
   const pulse=()=>{document.querySelectorAll('.lab2-beat').forEach((x,i)=>x.classList.toggle('on',i===beat));tone(beat===0?880:660,.055);beat=(beat+1)%8};
   const restart=()=>{clearInterval(timer);timer=null;beat=0;document.querySelectorAll('.lab2-beat').forEach(x=>x.classList.remove('on'))};
   $('#lab2Range').oninput=e=>{bpm=+e.target.value;$('#lab2Bpm').textContent=bpm;if(timer){clearInterval(timer);timer=setInterval(pulse,60000/bpm)}};
   $('#lab2Play').onclick=async()=>{await ensureAudio();if(timer){restart();$('#lab2Play').textContent='START';return}pulse();timer=setInterval(pulse,60000/bpm);$('#lab2Play').textContent='STOP'};
   $$('[data-note]').forEach(b=>b.onclick=async()=>{await ensureAudio();const n=b.dataset.note;$('#lab2Note').textContent=n;tone(frequencies[n],.18)});
   const nodes=[...document.querySelectorAll('#lab2Flow .flow-node')];
   $('#lab2Run').onclick=()=>{let i=0;$('#lab2Status').textContent='RUNNING · processing pipeline';nodes.forEach(n=>n.classList.remove('live'));const step=()=>{nodes.forEach(n=>n.classList.remove('live'));if(i<nodes.length){nodes[i].classList.add('live');i++;setTimeout(step,430)}else $('#lab2Status').textContent='COMPLETE · output generated successfully'};step()};
   $('#lab2Reset').onclick=()=>{nodes.forEach(n=>n.classList.remove('live'));$('#lab2Status').textContent='READY · waiting for input'};
   $$('#lab2Arch .arch-node').forEach(n=>n.onclick=()=>{$$('#lab2Arch .arch-node').forEach(x=>x.classList.remove('active'));n.classList.add('active');$('#lab2Detail').textContent=n.dataset.detail});
 }
})();
