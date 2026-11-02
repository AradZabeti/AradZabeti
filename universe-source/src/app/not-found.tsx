import {path} from '@/data/portfolio';
export default function NotFound(){return <main className="not-found"><span className="eyebrow">SIGNAL LOST / 404</span><h1>Outside<br/>the universe.</h1><p>This coordinate does not exist. Let’s find your way back.</p><a className="button primary" href={path('/')}>Return to orbit ↗</a></main>}
