'use client';

import { ExternalLink } from 'lucide-react';

export function DashboardFooter() {
    return (
        <footer className="w-full bg-white py-6 border-t border-slate-100 mt-auto">
            <div className="max-w-md mx-auto px-6 flex flex-col items-center space-y-2">
                <h3 className="text-sm font-black text-green-700 tracking-tight">
                    Mutabaah Tracker
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                    V1.0 • Built with 💚 for your spiritual journey
                </p>
                <div className="flex items-center space-x-1 pt-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Crafted by</span>
                    <a
                        href="https://fauzihiz.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-green-600 font-black uppercase tracking-widest flex items-center hover:text-green-700 transition-colors underline decoration-green-500/30 underline-offset-4"
                    >
                        Fauzi Hiz
                        <ExternalLink size={8} className="ml-0.5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
