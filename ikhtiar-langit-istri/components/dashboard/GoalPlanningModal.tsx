'use client';

import React, { useEffect, useState } from 'react';
import { useGoals } from '@/hooks/useGoals';
import type { GoalPlanning } from '@/lib/db';

interface GoalPlanningModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/** Badge huruf S.M.A.R.T untuk setiap field editor. */
function SmartBadge({ letter }: { letter: 'S' | 'M' | 'A' | 'R' | 'T' }) {
    return (
        <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0"
            style={{
                background: 'var(--gold-soft, #f7ecd4)',
                color: 'var(--gold-text, #8a5a1b)',
                border: '1px solid var(--gold, #C89838)',
            }}
        >
            {letter}
        </span>
    );
}

function formatDateLong(ts: number) {
    return new Date(ts).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatDateShort(iso: string) {
    // iso = YYYY-MM-DD — parse sebagai tengah hari lokal agar tidak meleset zona waktu
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

/** Badge sisa hari dari tenggat: "Hari ini", "5 hari lagi", "Telat 2 hari". */
function DeadlineBadge({ tenggat, done }: { tenggat: string; done: boolean }) {
    if (!tenggat) return null;
    if (done) {
        return (
            <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
            >
                Target {formatDateShort(tenggat)}
            </span>
        );
    }
    const [y, m, d] = tenggat.split('-').map(Number);
    if (!y || !m || !d) return null;
    const today = new Date();
    const target = new Date(y, m - 1, d);
    const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);

    let label: string;
    let color: string;
    let background: string;
    if (diffDays === 0) {
        label = '⏰ Hari ini';
        color = '#8a5a1b';
        background = 'var(--gold-soft, #f7ecd4)';
    } else if (diffDays < 0) {
        label = `Telat ${Math.abs(diffDays)} hari`;
        color = '#dc2626';
        background = 'rgba(220, 38, 38, 0.08)';
    } else if (diffDays <= 3) {
        label = `${diffDays} hari lagi`;
        color = '#8a5a1b';
        background = 'var(--gold-soft, #f7ecd4)';
    } else {
        label = `${diffDays} hari lagi`;
        color = 'var(--text-muted)';
        background = 'var(--bg-subtle)';
    }
    return (
        <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap"
            style={{ color, background }}
        >
            {label}
        </span>
    );
}

/** Baris detail SMART pada kartu yang sedang dibuka. */
function DetailRow({ label, value }: { label: string; value: string }) {
    if (!value.trim()) return null;
    return (
        <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--gold-text, #8a5a1b)' }}>
                {label}
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                {value}
            </p>
        </div>
    );
}

/**
 * Modal Goal Planning — daftar goal pribadi bergaya S.M.A.R.T.
 * Mode 'list': baca kembali goal untuk penyemangat, ketuk lingkaran untuk
 * mencoret goal yang sudah tercapai, expand kartu untuk lihat detail SMART.
 * Mode 'editor': menulis/menyunting goal dengan field berbadge S/M/A/R/T.
 */
export function GoalPlanningModal({ isOpen, onClose }: GoalPlanningModalProps) {
    const { goals, activeCount, doneCount, saveGoal, deleteGoal, toggleDone } = useGoals();

    const [mode, setMode] = useState<'list' | 'editor'>('list');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Form editor (field S.M.A.R.T)
    const [judul, setJudul] = useState('');
    const [terukur, setTerukur] = useState('');
    const [usaha, setUsaha] = useState('');
    const [motivasi, setMotivasi] = useState('');
    const [tenggat, setTenggat] = useState('');

    // Escape to close + lock body scroll (pola DoaScriptModal / ActivityInfoModal)
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

    const openEditor = (goal?: GoalPlanning) => {
        if (goal) {
            setEditingId(goal.id ?? null);
            setJudul(goal.judul);
            setTerukur(goal.terukur);
            setUsaha(goal.usaha);
            setMotivasi(goal.motivasi);
            setTenggat(goal.tenggat);
        } else {
            setEditingId(null);
            setJudul('');
            setTerukur('');
            setUsaha('');
            setMotivasi('');
            setTenggat('');
        }
        setMode('editor');
    };

    const handleSave = async () => {
        const trimmedJudul = judul.trim();
        if (!trimmedJudul) return; // judul wajib — tombol juga sudah disabled
        await saveGoal(
            {
                judul: trimmedJudul,
                terukur: terukur.trim(),
                usaha: usaha.trim(),
                motivasi: motivasi.trim(),
                tenggat: tenggat.trim(),
            },
            editingId ?? undefined
        );
        setMode('list');
        setEditingId(null);
    };

    const handleDelete = async (goal: GoalPlanning) => {
        if (goal.id === undefined) return;
        if (window.confirm(`Hapus goal "${goal.judul}"? Tindakan ini tidak dapat dibatalkan.`)) {
            await deleteGoal(goal.id);
            if (expandedId === goal.id) setExpandedId(null);
        }
    };

    const handleToggleDone = async (goal: GoalPlanning) => {
        if (goal.id === undefined) return;
        await toggleDone(goal.id, !goal.done);
    };

    const inputStyle: React.CSSProperties = {
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border)',
    };

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
                            {mode === 'editor'
                                ? editingId !== null
                                    ? 'Edit Goal'
                                    : 'Tambah Goal'
                                : 'Goal Planning Saya'}
                        </h2>
                        <p
                            className="text-xs font-bold uppercase tracking-wider mt-0.5"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {mode === 'editor'
                                ? 'Metode S.M.A.R.T'
                                : `${activeCount} berjalan${doneCount > 0 ? ` • ${doneCount} tercapai` : ''} • Tersimpan di perangkat ini`}
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

                {mode === 'editor' ? (
                    /* ── Editor: form S.M.A.R.T ── */
                    <div className="px-5 pb-5 overflow-y-auto scrollbar-hide space-y-3">
                        <p
                            className="text-xs leading-relaxed italic"
                            style={{ color: 'var(--gold-text, #8a5a1b)' }}
                        >
                            Tulis goal yang konkret &amp; terukur — bukan &quot;dapat uang banyak cepat&quot;,
                            tapi &quot;Dapatkan uang 1 juta dalam 1 minggu&quot;.
                        </p>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <SmartBadge letter="S" />
                                <label htmlFor="goal-judul" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Goal — apa yang ingin dicapai? <span style={{ color: '#dc2626' }}>*</span>
                                </label>
                            </div>
                            <input
                                id="goal-judul"
                                type="text"
                                value={judul}
                                onChange={e => setJudul(e.target.value)}
                                placeholder="Mis. Dapatkan uang 1 juta dalam 1 minggu"
                                maxLength={120}
                                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                                style={inputStyle}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <SmartBadge letter="M" />
                                <label htmlFor="goal-terukur" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Terukur — berapa banyak / indikator keberhasilannya?
                                </label>
                            </div>
                            <input
                                id="goal-terukur"
                                type="text"
                                value={terukur}
                                onChange={e => setTerukur(e.target.value)}
                                placeholder="Mis. Rp1.000.000 tunai"
                                maxLength={120}
                                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                                style={inputStyle}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <SmartBadge letter="A" />
                                <label htmlFor="goal-usaha" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Usaha nyata — langkah konkret apa yang akan dilakukan?
                                </label>
                            </div>
                            <textarea
                                id="goal-usaha"
                                value={usaha}
                                onChange={e => setUsaha(e.target.value)}
                                placeholder={'Mis. Buka jasa katering, target 3 pesanan per hari\nPromosi harian ke 10 grup WA tetangga'}
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-lg border text-sm leading-relaxed outline-none resize-none"
                                style={inputStyle}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <SmartBadge letter="R" />
                                <label htmlFor="goal-motivasi" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Motivasi — mengapa penting &amp; untuk siapa?
                                </label>
                            </div>
                            <textarea
                                id="goal-motivasi"
                                value={motivasi}
                                onChange={e => setMotivasi(e.target.value)}
                                placeholder="Mis. Untuk menutup biaya sekolah anak dan modal usaha suami"
                                rows={2}
                                className="w-full px-3 py-2.5 rounded-lg border text-sm leading-relaxed outline-none resize-none"
                                style={inputStyle}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <SmartBadge letter="T" />
                                <label htmlFor="goal-tenggat" className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Batas waktu — kapan harus tercapai?
                                </label>
                            </div>
                            <input
                                id="goal-tenggat"
                                type="date"
                                value={tenggat}
                                onChange={e => setTenggat(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                                style={inputStyle}
                            />
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('list');
                                    setEditingId(null);
                                }}
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold border transition-opacity hover:opacity-80 cursor-pointer"
                                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!judul.trim()}
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: 'var(--gold, #C89838)', color: '#ffffff' }}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── List: baca goal untuk penyemangat ── */
                    <div className="px-5 pb-5 overflow-y-auto scrollbar-hide space-y-3">
                        <p className="text-xs leading-relaxed italic" style={{ color: 'var(--gold-text, #8a5a1b)' }}>
                            Baca kembali goal-mu setiap hari sebagai penyemangat. Ketuk lingkaran di kiri
                            goal untuk mencoret yang sudah tercapai ✅
                        </p>

                        <button
                            type="button"
                            onClick={() => openEditor()}
                            className="w-full py-2.5 rounded-lg text-sm font-bold border-2 border-dashed transition-opacity hover:opacity-80 cursor-pointer"
                            style={{ borderColor: 'var(--gold, #C89838)', color: 'var(--gold-text, #8a5a1b)' }}
                        >
                            + Tambah Goal
                        </button>

                        {goals.length === 0 ? (
                            /* ── Empty state ── */
                            <div className="py-8 text-center space-y-3">
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    Belum ada goal. Tulis goal pertamamu yang konkret &amp; terukur, yuk 🎯
                                </p>
                                <button
                                    type="button"
                                    onClick={() => openEditor()}
                                    className="px-5 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer"
                                    style={{ background: 'var(--gold, #C89838)', color: '#ffffff' }}
                                >
                                    ✍️ Tulis Goal Pertama
                                </button>
                            </div>
                        ) : (
                            /* ── Daftar goal ── */
                            <div className="space-y-2">
                                {goals.map(goal => {
                                    const isExpanded = expandedId === goal.id;
                                    return (
                                        <div
                                            key={goal.id}
                                            className="rounded-xl overflow-hidden"
                                            style={{
                                                border: `1px solid ${goal.done ? 'var(--border)' : 'var(--gold, #C89838)'}`,
                                                background: goal.done ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                                            }}
                                        >
                                            <div className="flex items-start gap-3 p-3">
                                                {/* Lingkaran checkbox — klik untuk coret / batalkan coretan */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleDone(goal)}
                                                    className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                                                    aria-label={goal.done ? 'Kembalikan ke goal berjalan' : 'Tandai tercapai (coret)'}
                                                    title={goal.done ? 'Kembalikan ke goal berjalan' : 'Tandai tercapai'}
                                                    style={{
                                                        border: `2px solid ${goal.done ? 'var(--gold, #C89838)' : 'var(--border)'}`,
                                                        background: goal.done ? 'var(--gold, #C89838)' : 'transparent',
                                                    }}
                                                >
                                                    {goal.done && (
                                                        <svg
                                                            width="12"
                                                            height="12"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="#ffffff"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    )}
                                                </button>

                                                {/* Konten — klik untuk expand/collapse detail */}
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedId(isExpanded ? null : goal.id ?? null)}
                                                    className="min-w-0 flex-1 text-left cursor-pointer space-y-1"
                                                >
                                                    <p
                                                        className="text-sm font-bold leading-snug"
                                                        style={{
                                                            color: goal.done ? 'var(--text-muted)' : 'var(--text-primary)',
                                                            textDecoration: goal.done ? 'line-through' : 'none',
                                                        }}
                                                    >
                                                        {goal.judul}
                                                    </p>
                                                    <div className="flex items-center flex-wrap gap-1.5">
                                                        <DeadlineBadge tenggat={goal.tenggat} done={goal.done} />
                                                        {goal.terukur.trim() && !goal.done && (
                                                            <span
                                                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                                                                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
                                                            >
                                                                📏 {goal.terukur}
                                                            </span>
                                                        )}
                                                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                                            {isExpanded ? '▲ sembunyikan' : '▼ lihat detail'}
                                                        </span>
                                                    </div>
                                                </button>
                                            </div>
                                            {/* Detail SMART (expand) */}
                                            {isExpanded && (
                                                <div className="px-3 pb-3 pt-0 space-y-2.5">
                                                    <div
                                                        className="rounded-lg p-3 space-y-2.5"
                                                        style={{
                                                            background: goal.done ? 'var(--bg-surface)' : 'var(--gold-soft, #f7ecd4)',
                                                            border: '1px solid var(--border)',
                                                        }}
                                                    >
                                                        <DetailRow label="M — Terukur" value={goal.terukur} />
                                                        <DetailRow label="A — Usaha Nyata" value={goal.usaha} />
                                                        <DetailRow label="R — Motivasi" value={goal.motivasi} />
                                                        <DetailRow label="T — Batas Waktu" value={goal.tenggat ? formatDateShort(goal.tenggat) : ''} />
                                                        {goal.done && goal.doneAt && (
                                                            <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                                                                ✅ Tercapai {formatDateLong(goal.doneAt)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditor(goal)}
                                                            className="flex-1 py-2 rounded-lg text-xs font-bold border transition-opacity hover:opacity-80 cursor-pointer"
                                                            style={{ borderColor: 'var(--gold, #C89838)', color: 'var(--gold-text, #8a5a1b)' }}
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(goal)}
                                                            className="flex-1 py-2 rounded-lg text-xs font-bold border transition-opacity hover:opacity-80 cursor-pointer"
                                                            style={{ borderColor: '#dc2626', color: '#dc2626' }}
                                                        >
                                                            🗑️ Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {goals.length > 0 && (
                            <p className="text-[10px] text-center pt-1" style={{ color: 'var(--text-muted)' }}>
                                Goal tercapai otomatis turun ke bawah daftar sebagai rekam jejak 🎉
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
