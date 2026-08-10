const fs = require('fs');
const b = 'c:/Users/fauzi/Documents/github/mutabaah-pwa/mutabaah-pwa';

fs.writeFileSync(b+'/components/dashboard/StatsView.tsx', `'use client';
import { CategoryStat } from '@/hooks/useMonthlyStats';
interface StatsViewProps { stats: { categoryStats: CategoryStat[]; overallPercentage: number; totalCompleted: number; totalTarget: number; } | null; }
const BC = ['bg-green-500','bg-blue-500','bg-yellow-500','bg-red-500','bg-purple-500','bg-pink-500','bg-cyan-500'];
export function StatsView({ stats }: StatsViewProps) {
    if (!stats) return null;
    return (
        <div className="flex-1 flex flex-col p-6 space-y-8 pb-32 animate-[fadeIn_0.3s_ease-out]">
            <div className="p-6 rounded-3xl border text-center space-y-4" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Total Kedisiplinan</p>
                <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90"><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200 dark:text-slate-700" /><circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4-(364.4*stats.overallPercentage)/100} strokeLinecap="round" className="text-green-500 transition-all duration-1000 ease-out" /></svg>
                    <div className="absolute flex flex-col items-center"><span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{stats.overallPercentage}%</span></div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-left"><p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Selesai</p><p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{stats.totalCompleted}</p></div>
                    <div className="text-right"><p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Target</p><p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{stats.totalTarget}</p></div>
                </div>
            </div>
            {stats.categoryStats.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Per Kategori</h3>
                    {stats.categoryStats.map((cat, i) => (
                        <div key={cat.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{cat.name}</span>
                                <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>{cat.completed}/{cat.total} ({cat.percentage}%)</span>
                            </div>
                            <div className="h-3 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                                <div className={'h-full rounded-full transition-all duration-700 ease-out '+BC[i%BC.length]} style={{ width: Math.min(cat.percentage,100)+'%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
`);
console.log('StatsView fixed');
