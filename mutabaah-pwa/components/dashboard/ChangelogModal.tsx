'use client';

import React from 'react';
import { X, Sparkles, Bug, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangelogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CHANGELOG = [
    {
        version: 'v1.2.0',
        date: 'Maret 2026',
        items: [
            { type: 'feature', icon: Sparkles, text: 'Aktivitas Mandiri (Custom Slots) yang bisa di-rename langsung di aplikasi.' },
            { type: 'feature', icon: Sparkles, text: 'Navigasi: Menu Hamburger dan riwayat pembaruan (Changelog).' },
            { type: 'feature', icon: Zap, text: 'Ikon edit aktivitas kustom kini selalu terlihat di mobile.' },
            { type: 'fix', icon: Bug, text: 'Perbaikan bug: Tanggal hari ini tidak lagi terkunci.' },
            { type: 'fix', icon: Bug, text: 'Readability: Teks aktivitas panjang kini otomatis melipat (wrap).' },
        ]
    },
    {
        version: 'v1.1.0',
        date: 'Februari 2026',
        items: [
            { type: 'feature', icon: Sparkles, text: 'Mode Gelap (Dark Mode) dengan deteksi otomatis.' },
            { type: 'feature', icon: Sparkles, text: 'Sistem Badge baru yang dinamis per bulan.' },
            { type: 'removed', icon: Zap, text: 'Removed login — app is now fully open, no account needed.' },
            { type: 'feature', icon: Sparkles, text: 'Branding: Ikon aplikasi dan Favicon baru.' },
        ]
    }
];

export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl"
                        style={{
                            background: 'var(--bg-surface)',
                            borderColor: 'var(--border)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
                            <div>
                                <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                                    Changelog
                                </h2>
                                <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>
                                    Pembaruan Aplikasi
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X size={20} style={{ color: 'var(--text-muted)' }} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide">
                            {CHANGELOG.map((release) => (
                                <div key={release.version} className="space-y-4">
                                    <div className="flex items-baseline justify-between">
                                        <h3 className="text-md font-bold text-green-600 dark:text-green-500">
                                            {release.version}
                                        </h3>
                                        <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                            {release.date}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        {release.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${item.type === 'feature' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                                    }`}>
                                                    <item.icon size={12} />
                                                </div>
                                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                                    {item.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4 text-center" style={{ borderColor: 'var(--border)' }}>
                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                Mutabaah Tracker v1.2.0 • {' '}
                                <a
                                    href="https://fauzihiz.github.io/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 dark:text-green-500 font-bold hover:underline"
                                >
                                    FAUZI HIZ
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
