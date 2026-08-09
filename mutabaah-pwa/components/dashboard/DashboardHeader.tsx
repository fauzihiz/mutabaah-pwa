'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Menu, Sparkles, Sun, Moon } from 'lucide-react';

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <div
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300"
        >
            <div className="flex items-center space-x-3">
                <button
                    onClick={onMenuClick}
                    style={{ color: 'var(--text-muted)' }}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-sm shadow-green-200">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }} className="text-[10px] font-medium leading-none mb-1">
                            Assalamualaikum,
                        </p>
                        <p style={{ color: 'var(--text-primary)' }} className="text-xs font-bold leading-none truncate max-w-[120px]">
                            Sahabat
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    className="p-2 rounded-xl border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-90"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </div>
    );
}
