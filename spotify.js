(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .spotify-live{margin-top:14px;border:1px solid #242832;border-radius:18px;background:linear-gradient(145deg,#0d1017,#090b10);padding:18px;box-shadow:0 20px 70px #0005}
    .spotify-live-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
    .spotify-live-title{font:600 22px 'Space Grotesk';letter-spacing:-.04em}
    .spotify-live-badge{color:#1ed760;font:600 8px 'DM Mono';letter-spacing:.12em}
    .spotify-live img{display:block;width:100%;height:auto;border-radius:13px;border:1px solid #202630;background:#0d1117}
    .spotify-live-meta{display:flex;justify-content:space-between;gap:10px;margin-top:9px;color:#697384;font:500 8px 'DM Mono'}
    .spotify-live a{color:#aeb6c4}.spotify-live a:hover{color:#fff}
  `;
  document.head.appendChild(style);

  const section=document.createElement('section');
  section.className='spotify-live';
  section.id='spotify-live';
  section.innerHTML=`<div class="spotify-live-head"><div><div class="kicker">LIVE MUSIC</div><div class="spotify-live-title">Spotify Now Playing</div></div><div class="spotify-live-badge">● LIVE FEED</div></div><img id="spotifyLiveImage" src="assets/spotify.svg?t=${Date.now()}" alt="Spotify Now Playing status"><div class="spotify-live-meta"><span>Updates automatically</span><a href="https://open.spotify.com" target="_blank" rel="noopener">Open Spotify ↗</a></div>`;

  const anchor=document.querySelector('.nowgrid')||document.querySelector('#now')||document.querySelector('.footer');
  if(anchor?.parentNode){anchor.parentNode.insertBefore(section,anchor.nextSibling)}else{document.body.appendChild(section)}

  const refresh=()=>{const img=document.querySelector('#spotifyLiveImage');if(img)img.src=`assets/spotify.svg?t=${Date.now()}`};
  setInterval(refresh,60000);
})();
