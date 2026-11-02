import {projects,profile,path,type Lang} from '@/data/portfolio';
import {ArrowUpRight,ArrowLeft} from 'lucide-react';
export function generateStaticParams(){return ['en','fa'].flatMap(lang=>projects.map(p=>({lang,slug:p.slug})))}
export async function generateMetadata({params}:{params:Promise<{lang:Lang;slug:string}>}){
 const {lang,slug}=await params;const p=projects.find(p=>p.slug===slug)!;
 return {title:`${p.name} — ${profile.name[lang]}`,description:p.summary[lang],alternates:{canonical:`${profile.siteUrl}/${lang}/projects/${slug}/`,languages:{en:`${profile.siteUrl}/en/projects/${slug}/`,fa:`${profile.siteUrl}/fa/projects/${slug}/`}},openGraph:{title:`${p.name} — ${profile.name[lang]}`,description:p.summary[lang],locale:lang==='fa'?'fa_IR':'en_US'}}
}
export default async function Page({params}:{params:Promise<{lang:Lang;slug:string}>}){
 const {lang,slug}=await params;const p=projects.find(p=>p.slug===slug)!;const fa=lang==='fa',t=(en:string,f:string)=>fa?f:en;
 const next=projects[(projects.indexOf(p)+1)%projects.length];
 const sections=[['challenge',t('The challenge','چالش')],['solution',t('The approach','رویکرد')],['architecture',t('Architecture','ساختار')],['result',t('Status & outcome','وضعیت و نتیجه')]] as const;
 return <main className="case-page wrap" lang={lang} dir={fa?'rtl':'ltr'}>
  <nav className="case-nav" aria-label={t('Project navigation','ناوبری پروژه')}><a className="backlink" href={path(`/${lang}/#projects`)}><ArrowLeft size={16}/>{t('Back to selected work','بازگشت به پروژه‌ها')}</a><a href={path(`/${lang}/`)} className="case-nav-brand">ARAD ZABETI / AZ</a><a className="language" hrefLang={fa?'en':'fa'} href={path(`/${fa?'en':'fa'}/projects/${slug}/`)}>{fa?'EN':'FA'}</a></nav>
  <div className="case-hero"><div><div className="eyebrow">{t('PROJECT NOTES','درباره پروژه')} / 0{projects.indexOf(p)+1}</div><h1>{p.name}</h1><p className="case-lead">{p.summary[lang]}</p></div><dl className="case-facts"><div><dt>{t('STATUS','وضعیت')}</dt><dd>{p.status[lang]}</dd></div><div><dt>{t('CATEGORY','دسته‌بندی')}</dt><dd>{t(p.category.toUpperCase(),p.category==='web'?'تجربه وب':p.category==='app'?'اپلیکیشن':'آزمایش')}</dd></div><div><dt>{t('YEAR','سال')}</dt><dd>{p.year}</dd></div><div><dt>{t('TECHNOLOGIES','فناوری‌ها')}</dt><dd>{p.stack.join(' / ')}</dd></div></dl></div>
  <img className="case-image" src={path('/images/'+p.image)} alt={t(`Concept interface illustration for ${p.name}`,`تصویر مفهومی رابط ${p.name}`)} width="1200" height="750" fetchPriority="high"/><small className="muted">{t('Concept artwork — an illustration of the project direction, not a product screenshot.','تصویر مفهومی از مسیر طراحی پروژه؛ اسکرین‌شات محصول نیست.')}</small>
  <div className="case-body"><aside className="case-index"><span className="eyebrow">{t('IN THIS PROJECT','در این پروژه')}</span>{sections.map(([key,label],i)=><a key={key} href={`#${key}`}><span>0{i+1}</span>{label}</a>)}</aside><div className="case-content">{sections.map(([key,label],i)=><section key={key} id={key}><span className="case-section-number">0{i+1} / {t('PROJECT NOTES','یادداشت پروژه')}</span><h2>{label}</h2><p>{p[key][lang]}</p></section>)}</div></div>
  <div className="case-links"><div className="actions">{p.live&&<a className="button primary" href={p.live} target="_blank" rel="noreferrer">{t('Visit project','بازکردن پروژه')}<ArrowUpRight size={18}/></a>}{p.github&&<a className="button" href={p.github} target="_blank" rel="noreferrer">{t('Explore the source','دیدن سورس')}<ArrowUpRight size={18}/></a>}<a className="text-link" href={path(`/${lang}/#contact`)}>{t('Talk about a similar idea','گفتگو درباره یک ایده مشابه')}<ArrowUpRight size={16}/></a></div></div>
  <a className="next-project" href={path(`/${lang}/projects/${next.slug}/`)}><div><span className="eyebrow">{t('KEEP EXPLORING / NEXT PROJECT','کشف بیشتر / پروژه بعدی')}</span><h2>{next.name}</h2></div><ArrowUpRight/></a>
  <footer className="case-footer"><span>© {new Date().getFullYear()} {profile.name[lang]}</span><a href={path(`/${lang}/`)}>{t('Back to the universe','بازگشت به جهان من')}<ArrowUpRight size={13}/></a></footer>
 </main>
}
