'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, History, LogOut, ChevronRight, BarChart3, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../providers/AuthProvider';

interface NavigationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenChangelog: () => void;
    onOpenStats: () => void;
    onOpenPlanner: () => void;
    onOpenHome: () => void;
    activeView: 'dashboard' | 'stats' | 'planner';
}

export function NavigationDrawer({ isOpen, onClose, onOpenChangelog, onOpenStats, onOpenPlanner, onOpenHome, activeView }: NavigationDrawerProps) {
    const { signOut } = useAuth();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[90]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute left-0 top-0 bottom-0 w-[280px] flex flex-col shadow-2xl"
                        style={{ background: 'var(--bg-surface)' }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                                    <Image src="/favicon.png" alt="Mutabaah" width={40} height={40} />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X size={20} style={{ color: 'var(--text-muted)' }} />
                                </button>
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                    Mutabaah
                                </h2>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                    v1.2.0 • FAUZI HIZ
                                </p>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <nav className="flex-1 p-4 space-y-2">
                            <button
                                onClick={onOpenHome}
                                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${activeView === 'dashboard'
                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                                    }`}
                                style={{ color: activeView === 'dashboard' ? undefined : 'var(--text-secondary)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Home size={18} className={activeView === 'dashboard' ? 'font-bold' : ''} />
                                    <span className={`text-sm ${activeView === 'dashboard' ? 'font-bold' : 'font-semibold'}`}>Beranda</span>
                                </div>
                                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeView === 'dashboard' ? '' : 'text-muted'}`} />
                            </button>

                            <button
                                onClick={onOpenStats}
                                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${activeView === 'stats'
                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                                    }`}
                                style={{ color: activeView === 'stats' ? undefined : 'var(--text-secondary)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <BarChart3 size={18} className={activeView === 'stats' ? 'font-bold' : ''} />
                                    <span className={`text-sm ${activeView === 'stats' ? 'font-bold' : 'font-semibold'}`}>Statistik</span>
                                </div>
                                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeView === 'stats' ? '' : 'text-muted'}`} />
                            </button>

                            <button
                                onClick={onOpenPlanner}
                                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${activeView === 'planner'
                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                                    }`}
                                style={{ color: activeView === 'planner' ? undefined : 'var(--text-secondary)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className={activeView === 'planner' ? 'font-bold' : ''} />
                                    <span className={`text-sm ${activeView === 'planner' ? 'font-bold' : 'font-semibold'}`}>Planner</span>
                                </div>
                                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeView === 'planner' ? '' : 'text-muted'}`} />
                            </button>

                            <button
                                onClick={() => {
                                    onClose();
                                    onOpenChangelog();
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <History size={18} />
                                    <span className="text-sm font-semibold">Changelog</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
                            </button>
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="text-sm font-bold">Keluar Akun</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
