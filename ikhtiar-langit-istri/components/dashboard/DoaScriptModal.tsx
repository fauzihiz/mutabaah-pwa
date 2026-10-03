'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDoaScripts } from '@/hooks/useDoaScripts';

interface DoaScriptModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** 'read' = baca (default), 'edit' = langsung menulis (dipanggil dari panduan) */
    openMode: 'read' | 'edit';
}

/** Skeleton 3 Komponen — sinkron dengan panduan di CATEGORY_INFO['Curhat Berulang']. */
const TEMPLATE = `Keinginan:
 (tuliskan keinginan Anda yang paling ingin terwujud)

Alasan & Motivasi:
 (apa yang ingin Anda capai dan untuk siapa)

Doa:
 (rasakan seolah keinginan sudah terwujud, lalu gabungkan ketiga komponen menjadi satu kalimat doa yang utuh, ucapkan dengan penuh penghayatan)`;

function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Modal Script Doa Saya — model single-script (maksimal 1 script).
 * Mode 'read': tampilan baca khusus (kartu emas, teks nyaman dibaca) + aksi Edit/Hapus.
 * Mode 'editor': menulis/menyunting script.
 */
export function DoaScriptModal({ isOpen, onClose, openMode }: DoaScriptModalProps) {
    const { script, saveScript, deleteScript } = useDoaScripts();

    const [mode, setMode] = useState<'read' | 'editor'>('read');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [judul, setJudul] = useState('');
    const [isi, setIsi] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sinkronkan mode dari prop setiap kali modal dibuka.
    // Mode 'edit' dengan script yang sudah ada = langsung sunting script itu
    // (tidak pernah membuat script kedua — model single-script).
    useEffect(() => {
        if (!isOpen) return;
        if (openMode === 'edit') {
            if (script) {
                setEditingId(script.id ?? null);
                setJudul(script.judul);
                setIsi(script.isi);
            } else {
                setEditingId(null);
                setJudul('');
                setIsi('');
            }
            setMode('editor');
        } else {
            setMode('read');
        }
        // `script` sengaja tidak di-deps: efek hanya berjalan saat modal dibuka.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, openMode]);

    // Escape to close + lock body scroll (pola ActivityInfoModal)
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

    // Auto-grow textarea di mode editor
    useEffect(() => {
        const el = textareaRef.current;
        if (!el || mode !== 'editor') return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [mode, isi]);

    if (!isOpen) return null;

    const openEditor = () => {
        if (script) {
            setEditingId(script.id ?? null);
            setJudul(script.judul);
            setIsi(script.isi);
        } else {
            setEditingId(null);
            setJudul('');
            setIsi('');
        }
        setMode('editor');
    };

    const handleSave = async () => {
        const trimmedJudul = judul.trim();
        const trimmedIsi = isi.trim();
        if (!trimmedIsi) return; // tidak ada isi — tombol juga sudah disabled
        await saveScript(
            { judul: trimmedJudul || 'Script Doa', isi: trimmedIsi },
            editingId ?? undefined
        );
        setMode('read');
        setEditingId(null);
    };

    const handleDelete = async () => {
        if (!script || script.id === undefined) return;
        if (window.confirm('Hapus script doa ini? Tindakan ini tidak dapat dibatalkan.')) {
            await deleteScript(script.id);
            // LiveQuery otomatis update → body jatuh ke empty state
        }
    };

    const applyTemplate = () => {
        if (isi.trim() && !window.confirm('Ganti isi yang sudah ada dengan template panduan?')) return;
        setIsi(TEMPLATE);
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
                        <h2
                            className="text-xl font-bold leading-tight"
                            style={{ color: 'var(--text-primary)' }}
                        >
                            {mode === 'editor'
                                ? editingId !== null
                                    ? 'Edit Script Doa'
                                    : 'Tulis Script Doa'
                                : 'Script Doa Saya'}
                        </h2>
                        <p
                            className="text-xs font-bold uppercase tracking-wider mt-0.5"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            Tersimpan di perangkat ini
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
                {mode === 'editor' ? (
                    /* ── Editor ── */
                    <div className="px-5 pb-5 overflow-y-auto scrollbar-hide space-y-3">
                        <input
                            type="text"
                            value={judul}
                            onChange={e => setJudul(e.target.value)}
                            placeholder="Judul script (mis. Doa Keberlimpahan Rezeki)"
                            maxLength={80}
                            className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                            style={{
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border)',
                            }}
                        />
                        <textarea
                            ref={textareaRef}
                            value={isi}
                            onChange={e => setIsi(e.target.value)}
                            placeholder="Tuliskan script doa Anda di sini…"
                            className="w-full px-3 py-2.5 rounded-lg border text-sm leading-loose outline-none resize-none"
                            style={{
                                background: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                borderColor: 'var(--border)',
                                minHeight: '160px',
                            }}
                        />
                        <button
                            type="button"
                            onClick={applyTemplate}
                            className="w-full py-2 rounded-lg text-xs font-bold border transition-opacity hover:opacity-80 cursor-pointer"
                            style={{ borderColor: 'var(--gold, #C89838)', color: 'var(--gold-text, #8a5a1b)' }}
                        >
                            Gunakan template panduan 3 Komponen
                        </button>
                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    // Batal: kembali ke baca jika script ada, jika tidak tutup modal
                                    if (script) {
                                        setMode('read');
                                    } else {
                                        onClose();
                                    }
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
                                disabled={!isi.trim()}
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: 'var(--gold, #C89838)', color: '#ffffff' }}
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                ) : script ? (
                    /* ── Read view: tampilan baca khusus ── */
                    <div className="px-5 pb-5 overflow-y-auto scrollbar-hide space-y-4">
                        <div>
                            <p
                                className="text-lg font-bold leading-tight"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {script.judul}
                            </p>
                            <p
                                className="text-[10px] mt-1 font-medium"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Diubah {formatDate(script.updatedAt)}
                            </p>
                        </div>
                        {/* Kartu baca emas — nyaman dibaca */}
                        <div
                            className="rounded-xl p-4 sm:p-5 space-y-4"
                            style={{
                                background: 'var(--gold-soft, #f7ecd4)',
                                border: '1px solid var(--gold, #C89838)',
                                borderLeft: '3px solid var(--gold, #C89838)',
                            }}
                        >
                            <p
                                className="text-xs italic"
                                style={{ color: 'var(--gold-text, #8a5a1b)' }}
                            >
                                Baca perlahan dengan penuh penghayatan…
                            </p>
                            {script.isi.split('\n\n').map((para, idx) => (
                                <p
                                    key={idx}
                                    className="text-[15px] leading-[1.9] whitespace-pre-line"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    {para}
                                </p>
                            ))}
                        </div>
                        {/* Aksi */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={openEditor}
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer"
                                style={{ background: 'var(--gold, #C89838)', color: '#ffffff' }}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-lg text-sm font-bold border transition-opacity hover:opacity-80 active:scale-[0.98] cursor-pointer"
                                style={{ borderColor: '#dc2626', color: '#dc2626' }}
                            >
                                🗑️ Hapus
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Empty state ── */
                    <div className="px-5 pb-5 overflow-y-auto scrollbar-hide">
                        <div className="py-8 text-center space-y-3">
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                Belum ada script doa. Mulai tulis berdasarkan panduan 3 Komponen di bawah.
                            </p>
                            <button
                                type="button"
                                onClick={openEditor}
                                className="w-full py-2.5 rounded-lg text-sm font-bold transition-opacity hover:opacity-90 active:scale-[0.98] cursor-pointer"
                                style={{ background: 'var(--gold, #C89838)', color: '#ffffff' }}
                            >
                                ✍️ Tulis Script Pertama
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


