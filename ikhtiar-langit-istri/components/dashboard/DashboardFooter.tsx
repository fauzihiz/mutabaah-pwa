'use client';

export function DashboardFooter() {
    return (
        <footer className="w-full py-6 border-t mt-auto" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="max-w-md mx-auto px-6 flex flex-col items-center space-y-2">
                <h3 className="text-sm font-black text-green-700 dark:text-green-400 tracking-tight">
                    Ikhtiar Langit Istri
                </h3>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    v1.0.0 • Built for helping you reaching your goals
                </p>
                <div className="flex items-center space-x-1 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Crafted by</span>
                    <span className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest">LISNA LINDASARI</span>
                </div>
            </div>
        </footer>
    );
}
