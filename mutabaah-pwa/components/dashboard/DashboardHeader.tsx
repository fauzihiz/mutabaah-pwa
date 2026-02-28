'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { LogOut, Menu, Sparkles, Sun, Moon } from 'lucide-react';

interface DashboardHeaderProps {
    userEmail: string | undefined;
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
    const { signOut } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    return (
        <div
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="border-b p-4 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300"
        >
            <div className="flex items-center space-x-3">
                <button
                    style={{ color: 'var(--text-muted)' }}
                    className="p-2 rounded-lg hover:opacity-70 transition-opacity"
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
                            {userEmail?.split('@')[0]}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    className="p-2 rounded-lg border hover:opacity-70 transition-opacity"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                {/* Logout */}
                <button
                    onClick={() => signOut()}
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border hover:opacity-70 transition-opacity text-xs font-medium"
                >
                    <LogOut size={14} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
