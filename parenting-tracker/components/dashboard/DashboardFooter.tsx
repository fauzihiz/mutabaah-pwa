'use client';

import { ExternalLink } from 'lucide-react';

export function DashboardFooter() {
    return (
        <footer className="w-full py-6 border-t mt-auto" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="max-w-md mx-auto px-6 flex flex-col items-center space-y-2">
                <h3 className="text-sm font-black text-green-700 dark:text-green-400 tracking-tight">
                    Mutabaah Tracker
                </h3>
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                    v1.3.0 • Built for your spiritual journey
                </p>
                <div className="flex items-center space-x-1 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Crafted by</span>
                    <a
                        href="https://fauzihiz.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest flex items-center hover:text-green-700 dark:hover:text-green-300 transition-colors underline decoration-green-500/30 underline-offset-4"
                    >
                        FAUZI HIZ
                        <ExternalLink size={8} className="ml-0.5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
