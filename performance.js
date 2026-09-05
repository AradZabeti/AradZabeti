(()=>{
  const idle=window.requestIdleCallback||((cb)=>setTimeout(cb,800));
  const lazy=()=>document.querySelectorAll('img:not([loading]),iframe:not([loading]),video:not([preload])').forEach(el=>{
    if(el.tagName==='IMG'||el.tagName==='IFRAME') el.loading='lazy';
    if(el.tagName==='VIDEO') el.preload='metadata';
  });
  const sections=[...document.querySelectorAll('main section')];
  sections.slice(2).forEach(s=>s.style.contentVisibility='auto');
  idle(lazy);
  if('PerformanceObserver' in window){
    try{new PerformanceObserver(l=>window.__aradLCP=l.getEntries().at(-1)?.startTime).observe({type:'largest-contentful-paint',buffered:true})}catch{}
    try{new PerformanceObserver(l=>window.__aradCLS=(window.__aradCLS||0)+l.getEntries().reduce((a,e)=>a+(e.hadRecentInput?0:e.value),0)).observe({type:'layout-shift',buffered:true})}catch{}
  }
  window.addEventListener('load',()=>idle(()=>document.documentElement.dataset.performance='ready'),{once:true});
})();
