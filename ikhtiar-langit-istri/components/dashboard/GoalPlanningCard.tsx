'use client';

import React from 'react';
import { useGoals } from '@/hooks/useGoals';

interface GoalPlanningCardProps {
    onOpen: () => void;
}

/**
 * Tombol akses cepat "Goal Planning Saya" di beranda (di bawah grid),
 * menggantikan sementara kartu Script Doa yang sedang disembunyikan.
 * Menampilkan ringkasan jumlah goal berjalan & tercapai.
 */
export function GoalPlanningCard({ onOpen }: GoalPlanningCardProps) {
    const { activeCount, doneCount } = useGoals();

    const hasGoal = activeCount + doneCount > 0;

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
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                    </svg>
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        Goal Planning Saya
                    </span>
                    <span
                        className="block text-[10px] mt-0.5 line-clamp-1"
                        style={{ color: 'var(--text-muted)' }}
                    >
                        {hasGoal
                            ? `${activeCount} goal berjalan${doneCount > 0 ? ` • ${doneCount} tercapai` : ''} — klik untuk baca & coret yang tercapai`
                            : 'Belum ada goal — tulis yang konkret & terukur, yuk 🎯'}
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