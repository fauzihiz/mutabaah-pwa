const fs = require('fs');
const b = 'c:/Users/fauzi/Documents/github/mutabaah-pwa/mutabaah-pwa';

const p3 = `interface Theme { ring:string; bg:string; border:string; icon:string; pill:string; glow:string; }
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
`;

const p4 = `function BadgeCard({ badge }: { badge: BadgeStatus }) {
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
                {earned ? '\\u2713 Unlocked' : current+' / '+a.threshold}
            </div>
        </div>
    );
}
`;

const p5 = `interface AchievementCarouselProps { badges: BadgeStatus[]; isLoading: boolean; }
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
`;

// Read existing file (has p1+p2), append p3+p4+p5
const existing = fs.readFileSync(b+'/components/dashboard/AchievementCarousel.tsx', 'utf8');
fs.writeFileSync(b+'/components/dashboard/AchievementCarousel.tsx', existing + p3 + p4 + p5);
console.log('AchievementCarousel complete');
