'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { CATEGORIES, type ActivityCategory } from '@/lib/constants/activities';
import { ActivityLog } from '@/lib/db';
import { ActivityDropdown } from './ActivityDropdown';
import { getSupportingStickers, getStickerOption } from '@/lib/constants/stickers';
import { storage } from '@/lib/storage';

interface MutabaahGridProps {
    currentDate: Date;
    logs: ActivityLog[];
    onToggle: (date: string, activityId: string, stickerValue: number) => void;
    childId: number;
    activities: { id: string; name: string; category: ActivityCategory }[];
    onAddActivity: (name: string, category: ActivityCategory) => Promise<string>;
    onRenameActivity: (activityId: string, newName: string) => Promise<void>;
    onDeleteActivity: (activityId: string) => Promise<void>;
}

/** Build a YYYY-MM-DD string from local date components (timezone-safe). */
function toLocalDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function MutabaahGrid({
    currentDate, logs, onToggle, childId,
    activities, onAddActivity, onRenameActivity, onDeleteActivity,
}: MutabaahGridProps) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    // Pre-compute a lookup Map: "date:activityId" → stickerValue — O(1) per cell instead of O(n)
    const logMap = useMemo(() => {
        const m = new Map<string, number>();
        for (const l of logs) {
            m.set(`${l.date}:${l.activityId}`, l.stickerValue ?? 0);
        }
        return m;
    }, [logs]);

    // Reactive "today" state — initialised to null so the server never bakes
    // a highlight into the SSR HTML (avoids React 19 hydration style mismatches).
    // Seeded to the real device date only after the first client render.
    const [today, setToday] = useState<Date | null>(null);
    const [todayStr, setTodayStr] = useState('');

    useEffect(() => {
        const sync = () => {
            const now = new Date();
            setToday(now);
            setTodayStr(toLocalDateStr(now.getFullYear(), now.getMonth(), now.getDate()));
        };

        sync(); // seed immediately on mount

        const id = setInterval(sync, 60_000);

        // Re-check when the tab becomes visible (handles overnight tab and
        // cross-midnight background transitions).
        const onVisible = () => {
            if (document.visibilityState === 'visible') sync();
        };
        document.addEventListener('visibilitychange', onVisible);
        window.addEventListener('focus', onVisible);
        window.addEventListener('pageshow', onVisible);

        return () => {
            clearInterval(id);
            document.removeEventListener('visibilitychange', onVisible);
            window.removeEventListener('focus', onVisible);
            window.removeEventListener('pageshow', onVisible);
        };
    }, []);

    const isFuture = (day: number) => {
        if (!todayStr) return false; // SSR / hydration — don't lock anything yet
        const dateStr = toLocalDateStr(currentDate.getFullYear(), currentDate.getMonth(), day);
        return dateStr > todayStr;
    };

    const formatDate = (day: number) => {
        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    // ── Supporting stickers state ──
    // activityId → array of flag values (7-10)
    const [activityFlags, setActivityFlags] = useState<Record<string, number[]>>({});

    // Persist flags to localStorage so they survive navigation
    useEffect(() => {
        try {
            const raw = storage.get(`flags:${childId}:${currentDate.getFullYear()}:${currentDate.getMonth()}`);
            if (raw) setActivityFlags(JSON.parse(raw));
        } catch { /* ignore */ }
    }, [childId, currentDate]);

    const toggleFlag = (activityId: string, flag: number) => {
        setActivityFlags(prev => {
            const arr = prev[activityId] ?? [];
            const next = arr.includes(flag) ? arr.filter(f => f !== flag) : [...arr, flag];
            const updated = { ...prev, [activityId]: next };
            try {
                storage.set(`flags:${childId}:${currentDate.getFullYear()}:${currentDate.getMonth()}`, JSON.stringify(updated));
            } catch { /* ignore */ }
            return updated;
        });
    };

    // ── Supporting stickers context menu state ──
    const [showSupportingMenu, setShowSupportingMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [targetActivity, setTargetActivity] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLElement>(null);

    const openSupportingMenu = (activityId: string, anchor: HTMLElement | null) => {
        if (anchor) rowRef.current = anchor;
        const rect = anchor?.getBoundingClientRect();
        if (!rect) return;
        const menuWidth = 224;
        const menuHeight = 320;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let left = rect.left + rect.width / 2 - menuWidth / 2;
        let top = rect.bottom + 8;
        if (left < 8) left = 8;
        if (left + menuWidth > vw - 8) left = Math.max(8, vw - menuWidth - 8);
        if (top + menuHeight > vh - 8) {
            top = Math.max(8, rect.top - menuHeight - 8);
        }
        setMenuPosition({ x: left, y: top });
        setTargetActivity(activityId);
        setShowSupportingMenu(true);
    };

    const handleLongPress = (e: React.MouseEvent, activityId: string, anchor: HTMLElement) => {
        e.preventDefault();
        openSupportingMenu(activityId, anchor);
    };

    // Close menu on outside click
    useEffect(() => {
        if (!showSupportingMenu) return;
        const onDown = (e: PointerEvent) => {
            if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
            setShowSupportingMenu(false);
        };
        document.addEventListener('pointerdown', onDown);
        return () => document.removeEventListener('pointerdown', onDown);
    }, [showSupportingMenu]);

    // Recompute menu position on scroll/resize to keep it anchored to the row
    useEffect(() => {
        if (!showSupportingMenu || !targetActivity) return;
        const el = rowRef.current;
        if (!el) return;
        const update = () => {
            const rect = el.getBoundingClientRect();
            if (!rect.width) return;
            const menuWidth = 224;
            const menuHeight = 320;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            let left = rect.left + rect.width / 2 - menuWidth / 2;
            let top = rect.bottom + 8;
            if (left < 8) left = 8;
            if (left + menuWidth > vw - 8) left = Math.max(8, vw - menuWidth - 8);
            if (top + menuHeight > vh - 8) top = Math.max(8, rect.top - menuHeight - 8);
            setMenuPosition({ x: left, y: top });
        };
        update();
        window.addEventListener('scroll', update, true);
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update, true);
            window.removeEventListener('resize', update);
        };
    }, [showSupportingMenu, targetActivity]);

    const isToday = (day: number) =>
        !!today &&
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

    // ── Auto-scroll to today's column on mount / month change ──
    const gridScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = gridScrollRef.current;
        if (!el || !today || !todayStr) return;

        // Only auto-scroll if the displayed month is the current month
        const isCurrentMonth =
            currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth();

        if (isCurrentMonth) {
            // Each column is w-10 = 40 px.  Scroll so today is ~40 % from the left.
            const colWidth = 40;
            const target = Math.max(0, (today.getDate() - 1) * colWidth - el.clientWidth * 0.4);
            el.scrollTo({ left: target, behavior: 'smooth' });
        } else {
            // For non-current months, scroll to the start
            el.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [currentDate, todayStr]); // re-run when month changes or todayStr updates

    // ── Desktop Drag-to-Scroll ──
    const isPanning = useRef(false);
    const panStartX = useRef(0);
    const panStartY = useRef(0);
    const panStartScrollLeft = useRef(0);
    const panStartScrollTop = useRef(0);
    const [isPanningActive, setIsPanningActive] = useState(false);

    const handlePanStart = (e: React.PointerEvent<HTMLDivElement>) => {
        // Only respond to primary button (left click / touch / pen)
        if (e.button !== 0) return;
        // Skip if starting on interactive elements (buttons, inputs, drag handles)
        const target = e.target as HTMLElement;
        if (target.closest('button, input, textarea, select, [draggable="true"], [data-drag-handle]')) return;

        isPanning.current = true;
        panStartX.current = e.clientX;
        panStartY.current = e.clientY;
        panStartScrollLeft.current = gridScrollRef.current?.scrollLeft ?? 0;
        panStartScrollTop.current = gridScrollRef.current?.scrollTop ?? 0;
        setIsPanningActive(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePanMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPanning.current || !gridScrollRef.current) return;
        const dx = e.clientX - panStartX.current;
        const dy = e.clientY - panStartY.current;
        // Scroll by delta amount (opposite direction of drag)
        gridScrollRef.current.scrollLeft = panStartScrollLeft.current - dx;
        gridScrollRef.current.scrollTop = panStartScrollTop.current - dy;
    };

    const handlePanEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isPanning.current) return;
        isPanning.current = false;
        setIsPanningActive(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    const handleRename = async (id: string, currentName: string) => {
        const newName = prompt(`Ganti nama aktivitas ini:`, currentName);
        if (newName === null) return; // user pressed Cancel
        await onRenameActivity(id, newName);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Hapus aktivitas "${name}"? Semua log terkait juga akan dihapus.`)) {
            await onDeleteActivity(id);
        }
    };

    const handleAddActivity = async (category: ActivityCategory) => {
        const name = prompt(`Masukkan nama aktivitas untuk kategori "${category}":`);
        if (!name || !name.trim()) return;
        await onAddActivity(name.trim(), category);
    };

    // Group activities by category
    const activitiesByCategory = useMemo(() => {
        const grouped: Record<string, typeof activities> = {};
        CATEGORIES.forEach(cat => {
            grouped[cat] = activities.filter(a => a.category === cat);
        });
        return grouped;
    }, [activities]);

    return (
        <div
            className="flex-1 flex overflow-hidden border-t"
            style={{ borderColor: 'var(--border)' }}
        >
            {/* ── LEFT: static activity names ── */}
            <div
                className="w-44 flex-shrink-0 border-r z-20"
                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
            >
                {/* empty top-left corner */}
                <div
                    className="h-11 border-b"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                />

                <div className="overflow-y-auto h-full scrollbar-hide pb-24">
                    {CATEGORIES.map(category => (
                        <div key={category}>
                            {/* Category label with add button */}
                            <div
                                className="h-7 px-3 flex items-center justify-between border-b group"
                                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                            >
                                <span
                                    className="text-[9px] font-black uppercase tracking-tighter break-words flex-1 mr-2 leading-tight"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {category}
                                </span>
                                <button
                                    onClick={() => handleAddActivity(category)}
                                    className="opacity-60 hover:opacity-100 transition-opacity text-xs font-bold px-1.5 py-0.5 rounded"
                                    style={{ color: 'var(--primary)' }}
                                    title="Tambah aktivitas"
                                >
                                    +
                                </button>
                            </div>

                            {activitiesByCategory[category].map(activity => {
                                return (
                                    <div
                                        key={activity.id}
                                        className="relative flex flex-col gap-1 border-b group"
                                        style={{ background: "var(--bg-surface)", borderColor: "var(--border)", cursor: "pointer" }}
                                        onPointerDown={(e) => {
                                            if (e.pointerType === "mouse") return;
                                            const anchor = e.currentTarget as HTMLElement;
                                            const timer = setTimeout(() => handleLongPress(e, activity.id, anchor), 500);
                                            (e.target as HTMLElement).dataset.longpressTimer = String(timer);
                                        }}
                                        onPointerUp={(e) => {
                                            const t = (e.target as HTMLElement).dataset.longpressTimer;
                                            if (t) { clearTimeout(Number(t)); delete (e.target as HTMLElement).dataset.longpressTimer; }
                                        }}
                                        onPointerLeave={(e) => {
                                            const t = (e.target as HTMLElement).dataset.longpressTimer;
                                            if (t) { clearTimeout(Number(t)); delete (e.target as HTMLElement).dataset.longpressTimer; }
                                        }}
                                        onClick={(e) => {
                                            if (targetActivity === activity.id) {
                                                setShowSupportingMenu(false);
                                                setTargetActivity(null);
                                            } else {
                                                openSupportingMenu(activity.id, e.currentTarget as HTMLElement);
                                            }
                                        }}
                                    >
                                        {/* Row 1: activity name + buttons */}
                                        <div className="min-h-12 px-3 py-2 flex items-start justify-between gap-1">
                                            <span
                                                className="text-[11px] font-semibold leading-snug break-words flex-1"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                {activity.name}
                                            </span>
                                            <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-0.5 flex-shrink-0"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => handleRename(activity.id, activity.name)}
                                                    className="text-xs px-1 py-0.5 rounded"
                                                    title="Ganti nama"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(activity.id, activity.name)}
                                                    className="text-xs px-1 py-0.5 rounded"
                                                    title="Hapus"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        {/* Row 2: supporting stickers, only rendered when any are selected */}
                                        {(() => {
                                            const flags = activityFlags[activity.id] ?? [];
                                            if (flags.length === 0) return null;
                                            return (
                                                <div className="flex items-center gap-0.5">
                                                    {flags.map(flag => {
                                                        const sticker = getStickerOption(flag);
                                                        if (!sticker) return null;
                                                        return (
                                                            <span
                                                                key={sticker.value}
                                                                className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700"
                                                                title={sticker.label + " — " + sticker.description}
                                                            >
                                                                {sticker.icon}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT: horizontal date grid ── */}
            <div
                ref={gridScrollRef}
                className={`flex-1 overflow-x-auto overflow-y-hidden z-10 select-none ${isPanningActive ? 'cursor-grabbing' : 'cursor-grab'}`}
                onPointerDown={handlePanStart}
                onPointerMove={handlePanMove}
                onPointerUp={handlePanEnd}
                onPointerCancel={handlePanEnd}
                onPointerLeave={handlePanEnd}
            >
                <div className="inline-block min-w-full">

                    {/* Date header */}
                    <div
                        className="flex h-11 border-b sticky top-0 z-20"
                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                    >
                        {days.map(day => {
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const _today = isToday(day);
                            const weekend = date.getDay() === 0 || date.getDay() === 6;

                            return (
                                <div
                                    key={day}
                                    className="w-10 flex-shrink-0 flex flex-col items-center justify-center border-r"
                                    style={{
                                        borderColor: 'var(--border)',
                                        background: _today ? 'var(--primary-light)' : weekend ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                                    }}
                                >
                                    <span
                                        className="text-[9px] font-bold uppercase"
                                        style={{ color: _today ? 'var(--primary)' : 'var(--text-muted)' }}
                                    >
                                        {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                                    </span>
                                    <span
                                        className="text-[11px] font-black"
                                        style={{ color: _today ? 'var(--primary)' : 'var(--text-primary)' }}
                                    >
                                        {day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid body */}
                    <div className="overflow-y-auto scrollbar-hide pb-24">
                        {CATEGORIES.map(category => (
                            <div key={category}>
                                {/* Category spacer */}
                                <div
                                    className="h-7 flex border-b"
                                    style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                                >
                                    {days.map(day => (
                                        <div
                                            key={day}
                                            className="w-10 flex-shrink-0 border-r"
                                            style={{ borderColor: 'var(--border)' }}
                                        />
                                    ))}
                                </div>

                                {/* Rows per activity */}
                                {activitiesByCategory[category].map(activity => (
                                    <div
                                        key={activity.id}
                                        className="flex min-h-12 border-b"
                                        style={{ borderColor: 'var(--border)' }}
                                    >
                                        {days.map(day => {
                                            const dateStr = formatDate(day);
                                            const locked = isFuture(day);
                                            const completed = logMap.get(`${dateStr}:${activity.id}`) ?? false;
                                            const _today = isToday(day);

                                            return (
                                                <div
                                                    key={day}
                                                    className="w-10 flex-shrink-0 flex items-center justify-center border-r transition-colors"
                                                    style={{
                                                        borderColor: 'var(--border)',
                                                        background: _today ? 'var(--primary-light)' : 'transparent',
                                                    }}
                                                >
                                                    <ActivityDropdown
                                                        value={logMap.get(`${dateStr}:${activity.id}`) ?? 0}
                                                        disabled={locked}
                                                        onChange={(newValue) => onToggle(dateStr, activity.id, newValue)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            {/* Supporting stickers popover */}
            {showSupportingMenu && targetActivity && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        left: menuPosition.x,
                        top: menuPosition.y,
                        zIndex: 9999,
                        pointerEvents: 'auto',
                        maxHeight: 'min(60vh, 320px)',
                        overflowY: 'auto',
                    }}
                    className="bg-white dark:bg-slate-900 border rounded-2xl shadow-xl p-2 space-y-2 w-56 max-w-[80vw]"
                >
                    <div className="space-y-1">
                        {getSupportingStickers().map(sticker => {
                            const isActive = (activityFlags[targetActivity] ?? []).includes(sticker.value);
                            return (
                                <button
                                    key={sticker.value}
                                    onClick={() => toggleFlag(targetActivity, sticker.value)}
                                    className={[
                                        'w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-2',
                                        isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                                    ].join(' ')}
                                >
                                    <span
                                        className={[
                                            'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-base',
                                            isActive ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700',
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
                                    {isActive && (
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-blue-600 flex-shrink-0 mt-1"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
