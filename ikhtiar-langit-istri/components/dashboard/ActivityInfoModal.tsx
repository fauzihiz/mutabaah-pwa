'use client';

import React, { useEffect } from 'react';
import { ACTIVITIES, type ActivityCategory } from '@/lib/constants/activities';
import { ACTIVITY_INFO, CATEGORY_INFO, type ActivityInfo } from '@/lib/constants/activityInfo';
import { useActivitySettings } from '@/hooks/useActivitySettings';

export type InfoTarget = { kind: 'category' | 'activity'; id: string };

interface ActivityInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    target: InfoTarget | null;
    onSelectActivity?: (id: string) => void;
    /** Buka modal Script Doa Saya (dipanggil dari tombol CTA di segmen panduan) */
    onOpenDoaScripts?: () => void;
}

function SumberBadge({ sumber }: { sumber: string }) {
    return (
        <span
            className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--success-soft, #e6f4ec)', color: 'var(--success-text, #127c3f)' }}
        >
            {sumber}
        </span>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <h3
            className="text-xs font-black uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-muted)' }}
        >
            {children}
        </h3>
    );
}

export function ActivityInfoModal({ isOpen, onClose, target, onSelectActivity, onOpenDoaScripts }: ActivityInfoModalProps) {
    const { getActivityName } = useActivitySettings();

    // Escape to close + lock body scroll while open
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

    if (!isOpen || !target) return null;

    const isCategory = target.kind === 'category';
    const info: ActivityInfo | undefined = isCategory
        ? CATEGORY_INFO[target.id as ActivityCategory]
        : ACTIVITY_INFO[target.id];

    const title = isCategory ? target.id : getActivityName(target.id);
    const categoryOf = isCategory
        ? null
        : ACTIVITIES.find(a => a.id === target.id)?.category ?? null;
    const subtitle = isCategory ? 'Kategori' : categoryOf ? `Kategori: ${categoryOf}` : undefined;

    const hasContent =
        !!info &&
        (!!info.ringkasan ||
            !!info.keutamaan?.length ||
            !!info.dalil?.length ||
            !!info.lafadz?.length ||
            !!info.catatan ||
            !!info.panduan ||
            !!info.bacaan);

    const activities = isCategory ? ACTIVITIES.filter(a => a.category === target.id) : [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
            />

            {/* Card */}
            <div
                className="relative rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 p-5 pb-3">
                    <div className="min-w-0">
                        <h2
                            className="text-xl font-bold leading-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p
                                className="text-xs font-bold uppercase tracking-wider mt-0.5"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                {subtitle}
                            </p>
                        )}
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
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 pb-5 overflow-y-auto scrollbar-hide space-y-4">
                    {!hasContent && (
                        <p
                            className="text-sm py-6 text-center"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Belum ada bahan keutamaan untuk aktivitas ini.
                        </p>
                    )}

                    {info?.ringkasan && (
                        <p
                            className="text-sm leading-relaxed italic pl-3 border-l-2"
                            style={{ color: 'var(--text-secondary)', borderColor: 'var(--primary)' }}
                        >
                            {info.ringkasan}
                        </p>
                    )}

                    {info?.bacaan && (
                        <section>
                            <SectionLabel>Teks Bacaan</SectionLabel>
                            <div className="mb-3 space-y-1">
                                <p
                                    className="text-xs italic"
                                    style={{ color: 'var(--gold-text, #8a5a1b)' }}
                                >
                                    Baca perlahan dengan penuh penghayatan…
                                </p>
                                {info.instruksi && (
                                    <p
                                        className="text-xs leading-relaxed whitespace-pre-line"
                                        style={{ color: 'var(--gold-text, #8a5a1b)' }}
                                    >
                                        {info.instruksi}
                                    </p>
                                )}
                            </div>
                            <div
                                className="rounded-xl p-4 sm:p-5 space-y-4"
                                style={{
                                    background: 'var(--gold-soft, #f7ecd4)',
                                    border: '1px solid var(--gold, #C89838)',
                                    borderLeft: '3px solid var(--gold, #C89838)',
                                }}
                            >
                                {info.bacaan.split('\n\n').map((para, idx) => (
                                    <p
                                        key={idx}
                                        className="text-[15px] leading-[1.9] whitespace-pre-line"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        {para}
                                    </p>
                                ))}
                            </div>
                        </section>
                    )}

                    {info?.keutamaan && info.keutamaan.length > 0 && (
                        <section>
                            <SectionLabel>Keutamaan</SectionLabel>
                            <div className="space-y-2">
                                {info.keutamaan.map((p, i) => (
                                    <p
                                        key={i}
                                        className="text-sm leading-relaxed"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        {p}
                                    </p>
                                ))}
                            </div>
                        </section>
                    )}

                    {info?.dalil && info.dalil.length > 0 && (
                        <section>
                            <SectionLabel>Dalil</SectionLabel>
                            <div className="space-y-3">
                                {info.dalil.map((d, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg p-3 space-y-2"
                                        style={{
                                            background: 'var(--bg-subtle)',
                                            border: '1px solid var(--border)',
                                        }}
                                    >
                                        {d.arab && (
                                            <p
                                                dir="rtl"
                                                className="font-arabic text-[22px] leading-loose text-center whitespace-pre-line"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                {d.arab}
                                            </p>
                                        )}
                                        <p
                                            className="text-sm leading-relaxed italic"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {d.arti}
                                        </p>
                                        <SumberBadge sumber={d.sumber} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {info?.panduan && (
                        <section>
                            <SectionLabel>{info.panduan.judul}</SectionLabel>
                            <div
                                className="rounded-lg p-4 space-y-3"
                                style={{ background: 'var(--bg-surface)', border: '1px solid var(--gold)' }}
                            >
                                {info.panduan.komponen.map((k, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0"
                                                style={{
                                                    background: 'var(--gold-soft, #f7ecd4)',
                                                    color: 'var(--gold-text, #8a5a1b)',
                                                    border: '1px solid var(--gold)',
                                                }}
                                            >
                                                {i + 1}
                                            </span>
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                {k.judul}
                                            </p>
                                        </div>
                                        <p
                                            className="text-sm leading-relaxed"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {k.isi}
                                        </p>
                                        <p
                                            className="text-sm leading-relaxed italic pl-3 border-l-2"
                                            style={{ color: 'var(--text-secondary)', borderColor: 'var(--gold)' }}
                                        >
                                            <span
                                                className="font-bold not-italic"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                Contoh:{' '}
                                            </span>
                                            &quot;{k.contoh}&quot;
                                        </p>
                                    </div>
                                ))}
                                <p
                                    className="text-xs italic leading-relaxed text-center pt-2 border-t"
                                    style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
                                >
                                    {info.panduan.penutup}
                                </p>
                                {onOpenDoaScripts && (
                                    <button
                                        type="button"
                                        onClick={onOpenDoaScripts}
                                        className="w-full py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer"
                                        style={{ background: 'var(--gold, #C89838)', color: '#ffffff' }}
                                    >
                                        ✍️ Tulis Script Doa Saya
                                    </button>
                                )}
                            </div>
                        </section>
                    )}

                    {info?.lafadz && info.lafadz.length > 0 && (
                        <section>
                            <SectionLabel>Lafadz Bacaan</SectionLabel>
                            <div className="space-y-3">
                                {info.lafadz.map((l, i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg p-3 space-y-2"
                                        style={{
                                            background: 'var(--bg-subtle)',
                                            border: '1px solid var(--border)',
                                        }}
                                    >
                                        {l.judul && (
                                            <p
                                                className="text-sm font-semibold"
                                                style={{ color: 'var(--text-primary)' }}
                                            >
                                                {l.judul}
                                            </p>
                                        )}
                                        <p
                                            dir="rtl"
                                            className="font-arabic text-[22px] leading-loose text-center whitespace-pre-line"
                                            style={{ color: 'var(--text-primary)' }}
                                        >
                                            {l.arab}
                                        </p>
                                        {l.arti && (
                                            <p
                                                className="text-sm leading-relaxed"
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                {l.arti}
                                            </p>
                                        )}
                                        {l.sumber && <SumberBadge sumber={l.sumber} />}
                                        {l.catatan && (
                                            <p
                                                className="text-sm leading-relaxed"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                {l.catatan}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {info?.catatan && (
                        <div
                            className="rounded-lg p-3"
                            style={{
                                background: 'var(--bg-subtle)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            <p
                                className="text-sm leading-relaxed whitespace-pre-line"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                {info.catatan}
                            </p>
                        </div>
                    )}

                    {isCategory && activities.length > 0 && onSelectActivity && (
                        <section>
                            <SectionLabel>Aktivitas dalam kategori ini</SectionLabel>
                            <div className="flex flex-wrap gap-1.5">
                                {activities.map(a => (
                                    <button
                                        key={a.id}
                                        type="button"
                                        onClick={() => onSelectActivity(a.id)}
                                        className="text-xs font-medium px-2.5 py-1 rounded-full transition-opacity hover:opacity-70 cursor-pointer"
                                        style={{
                                            background: 'var(--bg-subtle)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--text-secondary)',
                                        }}
                                    >
                                        {getActivityName(a.id)}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Sumber: Penjelasan &amp; Keutamaan Aktivitas — Ikhtiar Langit Istri
                    </p>
                </div>
            </div>
        </div>
    );
}