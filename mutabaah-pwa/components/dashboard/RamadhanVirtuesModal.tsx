'use client';

import React, { useEffect } from 'react';
import { RAMADHAN_VIRTUES } from '@/lib/constants/ramadhanVirtues';

interface RamadhanVirtuesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Modal "Keutamaan Ramadhan" — daftar keutamaan bulan Ramadan yang disarikan
 * dari artikel Rumaysho "Keutamaan Bulan Ramadhan" (Ustadz Muhammad Abduh
 * Tuasikal, MSc) beserta dalil Al-Qur'an dan hadits shahih (Bukhari–Muslim).
 * Dipacu sebagai penyemangat agar pengguna memanfaatkan momentum Ramadan.
 */
export function RamadhanVirtuesModal({ isOpen, onClose }: RamadhanVirtuesModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            />

            {/* Card */}
            <div
                className="relative rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 p-5 pb-3">
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                            Keutamaan Ramadhan
                        </h2>
                        <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            Bahan bakar semangat ibadahmu 🌙
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-md transition-opacity hover:opacity-70 cursor-pointer"
                        aria-label="Tutup"
                        title="Tutup"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 pb-5 overflow-y-auto scrollbar-hide space-y-3">
                    <p className="text-sm leading-relaxed italic" style={{ color: 'var(--gold-text, #8a5a1b)' }}>
                        &ldquo;Bulan Ramadan adalah (bulan) yang di dalamnya diturunkan Al-Qur'an, sebagai petunjuk bagi
                        manusia dan penjelasan-penjelasan mengenai petunjuk itu serta pembeda (antara yang benar dan yang
                        batil).&rdquo; — QS. Al-Baqarah: 185
                    </p>

                    {RAMADHAN_VIRTUES.map((virtue, index) => (
                        <div
                            key={virtue.title}
                            className="rounded-xl p-3 space-y-1.5"
                            style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
                        >
                            <div className="flex items-start gap-2">
                                <span
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                                    style={{ background: 'var(--gold, #C89838)', color: '#ffffff' }}
                                >
                                    {index + 1}
                                </span>
                                <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                                    {virtue.title}
                                </p>
                            </div>
                            <p className="text-xs leading-relaxed pl-8" style={{ color: 'var(--text-secondary)' }}>
                                {virtue.body}
                            </p>
                            <p className="text-[10px] font-semibold pl-8" style={{ color: 'var(--gold-text, #8a5a1b)' }}>
                                {virtue.source}
                            </p>
                        </div>
                    ))}

                    {/* @@MARKER_CLOSING@@ */}
                </div>
            </div>
        </div>
    );
}
