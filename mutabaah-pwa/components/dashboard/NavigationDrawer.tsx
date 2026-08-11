'use client';
import React from 'react';
import Image from 'next/image';
import { resetAllData } from '@/lib/db';
interface NavigationDrawerProps { isOpen: boolean; onClose: () => void; onOpenChangelog: () => void; onOpenStats: () => void; onOpenHome: () => void; activeView: 'dashboard' | 'stats'; }
export function NavigationDrawer({ isOpen, onClose, onOpenChangelog, onOpenStats, onOpenHome, activeView }: NavigationDrawerProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[90]">
            <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />
            <div className="absolute left-0 top-0 bottom-0 w-[280px] flex flex-col shadow-2xl animate-[slideInLeft_0.3s_cubic-bezier(0.32,0.72,0,1)]" style={{ background: 'var(--bg-surface)' }}>
                <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg"><Image src="/logo.png" alt="Mutabaah" width={40} height={40} /></div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                    <div><h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Mutabaah</h2><p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>v1.3.0 • FAUZI HIZ</p></div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={onOpenHome} className={'w-full flex items-center justify-between p-3 rounded-2xl transition-all group '+(activeView==='dashboard'?'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400':'hover:bg-slate-50 dark:hover:bg-slate-900/50')} style={{color:activeView==='dashboard'?undefined:'var(--text-secondary)'}}>
                        <div className="flex items-center gap-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg><span className={'text-sm '+(activeView==='dashboard'?'font-bold':'font-semibold')}>Beranda</span></div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <button onClick={onOpenStats} className={'w-full flex items-center justify-between p-3 rounded-2xl transition-all group '+(activeView==='stats'?'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400':'hover:bg-slate-50 dark:hover:bg-slate-900/50')} style={{color:activeView==='stats'?undefined:'var(--text-secondary)'}}>
                        <div className="flex items-center gap-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg><span className={'text-sm '+(activeView==='stats'?'font-bold':'font-semibold')}>Statistik</span></div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <button onClick={()=>{onClose();onOpenChangelog();}} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group" style={{color:'var(--text-secondary)'}}>
                        <div className="flex items-center gap-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span className="text-sm font-semibold">Changelog</span></div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                        <button
                            onClick={async () => {
                                if (window.confirm('Semua data akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan. Lanjutkan?')) {
                                    await resetAllData();
                                    window.location.reload();
                                }
                            }}
                            className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                            style={{ color: '#ef4444' }}
                        >
                            <div className="flex items-center gap-3">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                                <span className="text-sm font-semibold">Reset Semua Data</span>
                            </div>
                        </button>
                    </div>
                </nav>
                <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}><p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>v1.3.0 — Data disimpan lokal di perangkat ini</p></div>
            </div>
        </div>
    );
}
