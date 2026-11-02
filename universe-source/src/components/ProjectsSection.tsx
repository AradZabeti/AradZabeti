'use client';
import {useState} from 'react';
import {ArrowUpRight,LayoutGrid,List} from 'lucide-react';
import {projects,path,type Lang} from '@/data/portfolio';
export default function ProjectsSection({lang,lowMotion}:{lang:Lang;lowMotion:boolean}){
 const fa=lang==='fa',t=(en:string,f:string)=>fa?f:en;
 const [filter,setFilter]=useState('all'),[view,setView]=useState<'grid'|'list'>('grid');
 const visible=projects.filter(p=>filter==='all'||p.category===filter);
 const tilt=(e:React.PointerEvent<HTMLElement>)=>{if(lowMotion||e.pointerType!=='mouse')return;const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;e.currentTarget.style.transform=`perspective(1400px) rotateY(${(x-.5)*3}deg) rotateX(${(.5-y)*3}deg)`};
 return <section className="section wrap projects-section work-v4" id="projects">
  <div className="section-label reveal"><span>03 / {t('SELECTED WORK','پروژه‌های منتخب')}</span><span>{t('IDEAS INTO INTERFACES','از ایده تا رابط کاربری')}</span></div>
  <div className="section-heading reveal"><h2>{t('Less ordinary.','فراتر از معمول.')}<br/><span className="accent-text">{t('More considered.','با دقت بیشتر.')}</span></h2><p>{t('A collection of public projects, private builds and ongoing experiments. Pick something that sparks your curiosity.','مجموعه‌ای از پروژه‌های عمومی، نسخه‌های خصوصی و آزمایش‌های در حال توسعه. از جایی شروع کن که کنجکاوی‌ات را برمی‌انگیزد.')}</p></div>
  <div className="work-toolbar"><div className="project-filters" role="group" aria-label={t('Filter projects','فیلتر پروژه‌ها')}>{[['all','All work','همه'],['web','Web','وب'],['app','Applications','اپلیکیشن'],['experiment','Experiments','آزمایش‌ها']].map(([key,en,f])=><button key={key} aria-pressed={filter===key} className={filter===key?'selected':''} onClick={()=>setFilter(key)}>{fa?f:en}<span>{key==='all'?projects.length:projects.filter(p=>p.category===key).length}</span></button>)}</div><div className="view-switch" role="group" aria-label={t('Project layout','چیدمان پروژه‌ها')}><button aria-label={t('Grid view','نمای تصویری')} aria-pressed={view==='grid'} onClick={()=>setView('grid')}><LayoutGrid size={15}/></button><button aria-label={t('List view','نمای فهرستی')} aria-pressed={view==='list'} onClick={()=>setView('list')}><List size={17}/></button></div></div>
  <span className="sr-only" role="status">{fa?`${visible.length} پروژه نمایش داده شد`:`Showing ${visible.length} projects`}</span>
  <div className={`projects-grid ${view==='list'?'work-list':'work-gallery'}`}>
   {visible.map(p=><article className={`project-card ${p.slug==='kooktools'&&filter==='all'?'featured-project':''}`} key={p.slug}>
    <a className={`project-visual visual-${p.slug}`} href={path(`/${lang}/projects/${p.slug}/`)} aria-label={`${t('Read project study','مطالعه پروژه')} ${p.name}`} onPointerMove={tilt} onPointerLeave={e=>{e.currentTarget.style.transform=''}}><div className="project-visual-top"><span>0{projects.indexOf(p)+1} / {t(p.category.toUpperCase(),p.category==='web'?'وب':p.category==='app'?'اپلیکیشن':'آزمایش')}</span><span>{p.status[lang]}</span></div><img src={path('/images/'+p.image)} alt={t(`${p.name} concept interface illustration`,`تصویر مفهومی رابط ${p.name}`)} width="1200" height="750" loading="lazy"/><span className="project-open"><ArrowUpRight size={28}/></span><span className="concept-label">{t('CONCEPT ARTWORK','تصویر مفهومی')}</span></a>
    <div className="project-text"><div className="project-info"><div><span className="project-kicker">{p.status[lang]}</span><h3><a href={path(`/${lang}/projects/${p.slug}/`)}>{p.name}</a></h3><p>{p.summary[lang]}</p></div><span>{p.year}</span></div><div className="project-meta"><div className="tags">{p.stack.map(s=><span key={s}>{s}</span>)}</div><a href={path(`/${lang}/projects/${p.slug}/`)} className="text-link">{t('Explore project','کاوش پروژه')}<ArrowUpRight size={16}/></a></div></div>
   </article>)}
  </div>
  <div className="work-endnote"><span>{t('A living collection. Always evolving.','مجموعه‌ای زنده؛ همیشه در حال تکامل.')}</span><a href="https://github.com/AradZabeti" target="_blank" rel="noreferrer">{t('Explore my GitHub','دیدن گیت‌هاب من')}<ArrowUpRight size={14}/></a></div>
 </section>
}
