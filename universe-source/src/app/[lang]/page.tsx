import Portfolio from '@/components/Portfolio';
import {profile, type Lang} from '@/data/portfolio';
export function generateStaticParams(){return [{lang:'fa'},{lang:'en'}]}
export async function generateMetadata({params}:{params:Promise<{lang:Lang}>}){const {lang}=await params;return {title:lang==='fa'?'آراد ضابطی — توسعه‌دهنده خلاق':'Arad Zabeti — Creative Developer',description:profile.intro[lang],alternates:{canonical:profile.siteUrl+'/'+lang+'/',languages:{en:profile.siteUrl+'/en/',fa:profile.siteUrl+'/fa/'}},openGraph:{locale:lang==='fa'?'fa_IR':'en_US',title:profile.name[lang],description:profile.intro[lang]}}}
export default async function Page({params}:{params:Promise<{lang:Lang}>}){const {lang}=await params;return <Portfolio lang={lang}/>}
