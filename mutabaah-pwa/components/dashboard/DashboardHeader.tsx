'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Menu, Sun, Moon, Pencil } from 'lucide-react';
import Image from 'next/image';

const GREETING_KEY = 'greetingName';

function getStoredName(): string {
    if (typeof window === 'undefined') return 'Sahabat';
    return localStorage.getItem(GREETING_KEY) || 'Sahabat';
}

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { isDark, toggleTheme } = useTheme();
    const [name, setName] = useState('Sahabat');
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState('Sahabat');
    const inputRef = useRef<HTMLInputElement>(null);

    // Load from localStorage on mount
    useEffect(() => {
        setName(getStoredName());
    }, []);

    const startEditing = () => {
        setDraft(name);
        setIsEditing(true);
    };

    const commitEdit = () => {
        const trimmed = draft.trim();
        const final = trimmed.length > 0 ? trimmed : 'Sahabat';
        setName(final);
        localStorage.setItem(GREETING_KEY, final);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            commitEdit();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

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
                    <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shadow-green-200">
                        <Image src="/logo.png" alt="Mutabaah" width={32} height={32} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)' }} className="text-[10px] font-medium leading-none mb-1">
                            Assalamualaikum,
                        </p>
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onBlur={commitEdit}
                                onKeyDown={handleKeyDown}
                                maxLength={20}
                                style={{
                                    background: 'var(--bg-surface)',
                                    color: 'var(--text-primary)',
                                    borderColor: 'var(--border)',
                                }}
                                className="text-xs font-bold leading-none border-b-2 outline-none px-0 py-0 w-[120px]"
                            />
                        ) : (
                            <button
                                onClick={startEditing}
                                className="group flex items-center gap-1 max-w-[140px]"
                                title="Tap untuk mengganti nama"
                            >
                                <p style={{ color: 'var(--text-primary)' }} className="text-xs font-bold leading-none truncate">
                                    {name}
                                </p>
                                <Pencil size={10} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" style={{ color: 'var(--text-muted)' }} />
                            </button>
                        )}
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
