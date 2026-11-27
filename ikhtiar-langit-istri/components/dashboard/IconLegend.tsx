'use client';

import React from 'react';
import { Clock, Frown, Heart } from 'lucide-react';

const IconLegendItem: React.FC<{
    color: string;
    icon: React.ReactNode;
    label: string;
}> = ({ color, icon, label }) => (
    <div className="flex flex-col items-center justify-start gap-1.5 flex-1 min-w-0">
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: color, color: '#fff' }}
        >
            {icon}
        </div>
        <span
            className="text-[10px] font-bold leading-tight text-center"
            style={{ color: 'var(--gold-text)' }}
        >
            {label}
        </span>
    </div>
);

/** Garis pemisah vertikal antar item legenda. */
function Separator() {
    return <div className="w-px self-stretch my-0.5" style={{ background: 'var(--gold)' }} />;
}

/**
 * Legend penjelasan tiap emote/status di grid mutabaah.
 * Ditempatkan di bagian bawah halaman, tepat di atas footer.
 */
export function IconLegend() {
    const doneColor = '#22C55E'; // green-500
    const lateColor = '#F59E0B'; // amber-500
    const skippedColor = '#64748B'; // slate-500
    const haidColor = '#F43F5E'; // rose-500

    return (
        <section className="w-full px-4 pt-2 pb-4">
            <div className="relative">
                {/* Label hijau "Keterangan Icon" melayang di tepi atas kotak */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                        className="inline-flex items-center px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wide shadow-sm"
                        style={{ background: 'var(--primary)', color: '#fff' }}
                    >
                        Keterangan Icon
                    </span>
                </div>

                {/* Kotak legenda */}
                <div
                    className="rounded-2xl border px-3 pt-5 pb-3 flex items-stretch justify-between gap-1"
                    style={{
                        background: 'var(--gold-soft)',
                        borderColor: 'var(--gold)',
                    }}
                >
                    <IconLegendItem
                        color={doneColor}
                        icon={
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        }
                        label="Selesai"
                    />
                    <Separator />
                    <IconLegendItem
                        color={lateColor}
                        icon={<Clock size={16} strokeWidth={2.5} aria-hidden="true" />}
                        label="Terlambat"
                    />
                    <Separator />
                    <IconLegendItem
                        color={skippedColor}
                        icon={<Frown size={16} strokeWidth={2.5} aria-hidden="true" />}
                        label="Tidak Dikerjakan"
                    />
                    <Separator />
                    <IconLegendItem
                        color={haidColor}
                        icon={<Heart size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />}
                        label="Haid"
                    />
                </div>
            </div>
        </section>
    );
}
