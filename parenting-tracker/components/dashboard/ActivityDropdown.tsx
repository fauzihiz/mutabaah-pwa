'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    PRIMARY_STICKERS,
    getStickerOption,
    type StickerOption,
} from '@/lib/constants/stickers';

interface ActivityDropdownProps {
    /** Currently stored sticker code (0 = kosong / none). */
    value: number;
    /** Called with the new sticker code (0 = clear) when the user picks one. */
    onChange: (value: number) => void;
    /** When true (future dates) the cell ignores clicks. */
    disabled?: boolean;
}

/** Compact color swatches used inside grid cells. */
const SWATCH: Record<string, string> = {
    green: 'bg-green-500',
    gray: 'bg-slate-400',
    blue: 'bg-blue-500',
    orange: 'bg-orange-400',
    purple: 'bg-purple-500',
};

export function ActivityDropdown({ value, onChange, disabled = false }: ActivityDropdownProps) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const [panelPos, setPanelPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // Compute fixed-position coordinates from the trigger button's viewport rect.
    const computePosition = () => {
        const btn = triggerRef.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        const panelWidth = 224; // w-56
        const panelHeight = 320; // approximate max height
        let left = r.left + r.width / 2 - panelWidth / 2;
        let top = r.bottom + 8;

        // Clamp horizontally so panel stays inside viewport
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (left < 8) left = 8;
        if (left + panelWidth > vw - 8) left = vw - panelWidth - 8;
        // Flip above if not enough room below
        if (top + panelHeight > vh - 8) {
            top = Math.max(8, r.top - panelHeight - 8);
        }
        setPanelPos({ top, left });
    };

    // Open/close handler that computes position before showing
    const toggleOpen = () => {
        if (disabled) return;
        if (!open) computePosition();
        setOpen(o => !o);
    };

    // Recompute on scroll/resize while open
    useEffect(() => {
        if (!open) return;
        const recompute = () => computePosition();
        window.addEventListener('scroll', recompute, true);
        window.addEventListener('resize', recompute);
        return () => {
            window.removeEventListener('scroll', recompute, true);
            window.removeEventListener('resize', recompute);
        };
    }, [open]);

    // Close when clicking anywhere outside the dropdown
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as Node;
            if (
                panelRef.current && !panelRef.current.contains(target) &&
                triggerRef.current && !triggerRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, [open]);

    const current: StickerOption | undefined =
        value > 0 ? getStickerOption(value) : undefined;

    const renderStickerRow = (sticker: StickerOption) => {
        const selected = value === sticker.value;
        return (
            <button
                key={sticker.value}
                onClick={() => {
                    // Toggle off when the same sticker is clicked again
                    onChange(selected ? 0 : sticker.value);
                    setOpen(false);
                }}
                className={[
                    'w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-2',
                    selected ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                ].join(' ')}
            >
                <span
                    className={[
                        'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-base',
                        selected ? SWATCH[sticker.color] : 'bg-slate-200 dark:bg-slate-700',
                    ].join(' ')}
                >
                    {sticker.icon}
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">
                        {sticker.label}
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {sticker.description}
                    </span>
                </span>
                {selected && (
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-600 flex-shrink-0 mt-1"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </button>
        );
    };

    // SSR-safe portal target
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <>
            {/* Trigger cell */}
            <button
                ref={triggerRef}
                disabled={disabled}
                onClick={toggleOpen}
                className={[
                    'w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90 border',
                    current ? `${SWATCH[current.color]} text-white shadow-sm` : 'hover:border-green-400 dark:hover:border-green-500',
                    disabled ? 'cursor-not-allowed opacity-40' : '',
                    open ? 'ring-2 ring-green-400' : '',
                ].join(' ')}
                style={!current ? { borderColor: 'var(--border)', background: 'var(--bg-subtle)' } : undefined}
                title={current ? `${current.label} — ${current.description}` : 'Pilih stiker'}
            >
                {disabled ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                ) : current ? (
                    <span className="text-sm">{current.icon}</span>
                ) : (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                )}
            </button>

            {/* Dropdown panel — rendered via portal to escape overflow:hidden parents */}
            {open && !disabled && mounted && createPortal(
                <div
                    ref={panelRef}
                    className="fixed w-56 max-w-[70vw] bg-white dark:bg-slate-900 border rounded-2xl shadow-xl z-[9999] p-2 space-y-2"
                    style={{
                        borderColor: 'var(--border)',
                        top: panelPos.top,
                        left: panelPos.left,
                    }}
                >
                    <div className="space-y-1">
                        {PRIMARY_STICKERS.map(renderStickerRow)}
                    </div>

                    {value > 0 && (
                        <button
                            onClick={() => {
                                onChange(0);
                                setOpen(false);
                            }}
                            className="w-full text-center text-[10px] font-bold text-red-500 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Hapus stiker
                        </button>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}