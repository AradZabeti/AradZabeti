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
})();
