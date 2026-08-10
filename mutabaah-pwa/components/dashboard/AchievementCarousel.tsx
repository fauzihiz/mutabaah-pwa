'use client';
import { BadgeStatus } from '@/hooks/useMonthlyAchievements';
type IC = (p:{className?:string})=>React.JSX.Element;
const I:{[k:string]:IC} = {
flame:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
trophy:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
target:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
star:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
moon:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
clock:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
crown:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>,
mosque:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4"/><line x1="12" y1="2" x2="12" y2="6"/><circle cx="12" cy="14" r="2"/></svg>,
book:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
'book-open':({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
heart:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
shield:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
zap:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
award:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
sunrise:({className:c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>,
lock:({className:c})=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={c}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};
interface Theme { ring:string; bg:string; border:string; icon:string; pill:string; glow:string; }
const T:{[k:string]:Theme} = {
orange:{ring:'stroke-orange-400',bg:'bg-orange-50',border:'border-orange-200',icon:'text-orange-500',pill:'bg-orange-100 text-orange-700',glow:'shadow-orange-200'},
blue:{ring:'stroke-blue-400',bg:'bg-blue-50',border:'border-blue-200',icon:'text-blue-500',pill:'bg-blue-100 text-blue-700',glow:'shadow-blue-200'},
yellow:{ring:'stroke-yellow-400',bg:'bg-yellow-50',border:'border-yellow-200',icon:'text-yellow-500',pill:'bg-yellow-100 text-yellow-700',glow:'shadow-yellow-200'},
green:{ring:'stroke-green-500',bg:'bg-green-50',border:'border-green-200',icon:'text-green-600',pill:'bg-green-100 text-green-700',glow:'shadow-green-200'},
pink:{ring:'stroke-pink-400',bg:'bg-pink-50',border:'border-pink-200',icon:'text-pink-500',pill:'bg-pink-100 text-pink-700',glow:'shadow-pink-200'},
purple:{ring:'stroke-purple-400',bg:'bg-purple-50',border:'border-purple-200',icon:'text-purple-500',pill:'bg-purple-100 text-purple-700',glow:'shadow-purple-200'},
cyan:{ring:'stroke-cyan-400',bg:'bg-cyan-50',border:'border-cyan-200',icon:'text-cyan-500',pill:'bg-cyan-100 text-cyan-700',glow:'shadow-cyan-200'},
};
const dT = T.green;
function Ring({ progress, earned, theme }: { progress: number; earned: boolean; theme: Theme }) {
    const r = 26, c = 2 * Math.PI * r, offset = c - (progress / 100) * c;
    return (<svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90"><circle cx="32" cy="32" r={r} fill="none" className="stroke-slate-100" strokeWidth="5" /><circle cx="32" cy="32" r={r} fill="none" className={(earned?theme.ring:'stroke-slate-200')+' transition-all duration-700 ease-out'} strokeWidth="5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={earned?0:offset} /></svg>);
}
function BadgeCard({ badge }: { badge: BadgeStatus }) {
    const { achievement: a, progress, current, earned } = badge;
    const Icon = I[a.icon_name] || I.star;
    const th = T[a.color_theme] || dT;
    return (
        <div className={'relative w-44 flex-shrink-0 p-4 rounded-2xl border transition-all duration-500 select-none active:scale-95 '+(earned?th.bg+' '+th.border+' shadow-md '+th.glow:'bg-slate-50 border-slate-100')}>
            <div className="relative w-16 h-16 mb-3">
                <Ring progress={progress} earned={earned} theme={th} />
                <div className="absolute inset-0 flex items-center justify-center">
                    {earned ? <Icon className={th.icon} /> : <I.lock className="text-slate-300" />}
                </div>
            </div>
            <p className={'text-xs font-black leading-tight mb-1 '+(earned?'text-slate-800':'text-slate-400')}>{a.title}</p>
            <p className="text-[9px] text-slate-400 leading-tight mb-3 line-clamp-2">{a.description}</p>
            <div className={'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold '+(earned?th.pill:'bg-slate-100 text-slate-400')}>
                {earned ? '\u2713 Unlocked' : current+' / '+a.threshold}
            </div>
        </div>
    );
}
interface AchievementCarouselProps { badges: BadgeStatus[]; isLoading: boolean; }
export function AchievementCarousel({ badges, isLoading }: AchievementCarouselProps) {
    const earnedCount = badges.filter(b => b.earned).length;
    return (
        <div className="px-6 space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-700">Pencapaian Bulan Ini</h2>
                {!isLoading && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{earnedCount}/{badges.length} Badge</span>}
            </div>
            {isLoading ? (
                <div className="flex space-x-3 overflow-hidden">{[1,2,3].map(i=><div key={i} className="w-44 h-40 flex-shrink-0 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
            ) : badges.length===0 ? (
                <div className="h-32 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-2xl">Belum ada achievement untuk bulan ini.</div>
            ) : (
                <div className="overflow-x-auto pb-2 -mx-0 scrollbar-hide">
                    <div className="flex space-x-3 min-w-max">
                        {badges.map(badge => <BadgeCard key={badge.achievement.id} badge={badge} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
