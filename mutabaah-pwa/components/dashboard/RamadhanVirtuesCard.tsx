'use client';

import React from 'react';

interface RamadhanVirtuesCardProps {
    onOpen: () => void;
}

/** Tombol akses cepat "Keutamaan Ramadhan" di beranda — menginspirasi pengguna untuk memanfaatkan momentum Ramadan. */
export function RamadhanVirtuesCard({ onOpen }: RamadhanVirtuesCardProps) {
    return (
        <div className="px-4 pb-4">
            <button
                type="button"
                onClick={onOpen}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-opacity hover:opacity-90 active:scale-[0.99]"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--gold, #C89838)' }}
            >
                <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'var(--gold-soft, #f7ecd4)' }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: 'var(--gold-text, #8a5a1b)' }}
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Keutamaan Ramadhan
                    </span>
                    <span
                        className="block text-[10px] mt-0.5 line-clamp-1"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        Baca keutamaan bulan Ramadan untuk semangat ibadah 🌙
                    </span>
                </span>
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>
        </div>
    );
}