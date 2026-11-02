import type {MetadataRoute} from 'next';
import {profile,projects} from '@/data/portfolio';
export const dynamic='force-static';
export default function sitemap():MetadataRoute.Sitemap{return [{url:profile.siteUrl+'/',priority:1},...(['en','fa'] as const).flatMap(lang=>[{url:`${profile.siteUrl}/${lang}/`,priority:.9},...projects.map(p=>({url:`${profile.siteUrl}/${lang}/projects/${p.slug}/`,priority:.7}))])]}
