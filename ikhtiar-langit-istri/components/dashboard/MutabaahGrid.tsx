'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { Clock, Frown, Heart } from 'lucide-react';
import { ACTIVITIES, CATEGORIES } from '@/lib/constants/activities';
import { db, ActivityLog, STATUS } from '@/lib/db';
import { useActivitySettings } from '@/hooks/useActivitySettings';
import dynamic from 'next/dynamic';

// Modal info (keutamaan/dalil/lafadz) di-load secara dinamis client-side,
// mengikuti pola modal lain agar teks Arab tidak ikut terproses saat SSR.
const ActivityInfoModal = dynamic(
    () => import('./ActivityInfoModal').then(m => m.ActivityInfoModal),
    { ssr: false }
);

interface MutabaahGridProps {
    currentDate: Date;
    logs: ActivityLog[];
    onToggle: (date: string, activityId: string) => void;
    /** Buka modal Script Doa Saya (dari CTA panduan di ActivityInfoModal) */
    onOpenDoaScripts?: () => void;
}

/** Build a YYYY-MM-DD string from local date components (timezone-safe). */
function toLocalDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const STATUS_LABEL: Record<number, string> = {
    [STATUS.EMPTY]: 'Belum dicatat',
    [STATUS.DONE]: 'Selesai',
    [STATUS.LATE]: 'Selesai telat',
    [STATUS.HAID]: 'Haid/berhalangan',
    [STATUS.SKIPPED]: 'Tidak mengerjakan',
};

function isTilawahActivity(activityId: string): boolean {
    return activityId === 'tilawah';
}

function TilawahPagePopover({
    position, activity, onSave, onClose, currentLog
}: {
    position: { x: number; y: number };
    activity: { id: string; name: string };
    currentLog: ActivityLog | undefined;
    onSave: (startPage: number, endPage: number) => void;
    onClose: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [startPage, setStartPage] = useState(currentLog?.startPage || '');
    const [endPage, setEndPage] = useState(currentLog?.endPage || '');
    const [error, setError] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleSave = () => {
        const start = Number(startPage);
        const end = Number(endPage);

        if (!startPage || isNaN(start)) {
            setError('Harap isi halaman mulai');
            return;
        }

        // Jika endPage kosong atau 0, otomatis diisi dengan angka yang sama dengan halaman start
        const finalEnd = (end === 0 || !endPage || isNaN(end)) ? start : end;

        if (start > finalEnd) {
            setError('Halaman selesai harus >= halaman mulai');
            return;
        }
        if (start < 1 || finalEnd > 604) {
            setError('Halaman harus antara 1-604');
            return;
        }

        setError('');
        onSave(start, finalEnd);
        onClose();
    };

    const handleClear = () => {
        onSave(0, 0); // Signal to clear
        onClose();
    };

    return (
        <div
            ref={ref}
            className="fixed z-[200] w-72 rounded-xl border shadow-xl overflow-hidden"
            style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border)',
                left: Math.min(position.x, (typeof window !== 'undefined' ? window.innerWidth : 9999) - 300),
                top: Math.min(position.y, (typeof window !== 'undefined' ? window.innerHeight : 9999) - 250),
            }}
        >
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{activity.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Masukkan halaman yang dibaca</p>
            </div>
            <div className="p-4 space-y-3">
                <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Halaman Mulai</label>
                    <input
                        type="number"
                        value={startPage}
                        onChange={(e) => setStartPage(e.target.value)}
                        min="1"
                        max="604"
                        className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        placeholder="1"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Halaman Selesai</label>
                    <input
                        type="number"
                        value={endPage}
                        onChange={(e) => setEndPage(e.target.value)}
                        min="1"
                        max="604"
                        className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        placeholder="604"
                    />
                </div>
                {error && (
                    <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded" style={{ borderColor: 'var(--border)' }}>
                        {error}
                    </div>
                )}
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors"
                        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    >
                        Simpan
                    </button>
                    {currentLog && (
                        <button
                            onClick={handleClear}
                            className="flex-1 px-3 py-2 text-sm font-semibold rounded-lg border transition-colors"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                        >
                            Hapus
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function MutabaahGrid({ currentDate, logs, onToggle, onOpenDoaScripts }: MutabaahGridProps) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    const { getActivityName } = useActivitySettings();

    // Pre-compute a lookup Map: "date:activityId" → status (0/1/2/3/4) — O(1) per cell instead of O(n)
    const logMap = useMemo(() => {
        const m = new Map<string, number>();
        for (const l of logs) {
            m.set(`${l.date}:${l.activityId}`, l.completed);
        }
        return m;
    }, [logs]);

    // Lookup Map objek log penuh (diperlukan utk data halaman tilawah: startPage/endPage)
    const logObjectMap = useMemo(() => {
        const m = new Map<string, ActivityLog>();
        for (const l of logs) {
            m.set(`${l.date}:${l.activityId}`, l);
        }
        return m;
    }, [logs]);

    // Target popover input halaman tilawah — null = tertutup
    const [tilawahPopover, setTilawahPopover] = useState<{
        position: { x: number; y: number };
        dateStr: string;
        activityId: string;
        currentLog: ActivityLog | undefined;
    } | null>(null);

    /** Simpan data halaman tilawah (startPage=0 & endPage=0 berarti hapus data) */
    const handleSaveTilawah = async (date: string, activityId: string, startPage: number, endPage: number) => {
        const existing = await db.logs.where({ date, activityId }).first();
        // Auto-fill endPage dengan startPage jika endPage kosong (0)
        const finalEndPage = (endPage === 0 || !endPage) ? startPage : endPage;

        if (startPage === 0 && finalEndPage === 0) {
            if (existing?.id != null) await db.logs.delete(existing.id);
        } else {
            await db.logs.put({
                id: existing?.id,
                date,
                activityId,
                completed: STATUS.DONE,
                synced: false,
                startPage,
                endPage: finalEndPage,
            });
        }
    };

    // Reactive "today" state — initialised to null so the server never bakes
    // a highlight into the SSR HTML (avoids React 19 hydration style mismatches).
    // Seeded to the real device date only after the first client render.
    const [today, setToday] = useState<Date | null>(null);
    const [todayStr, setTodayStr] = useState('');

    // Info modal target — null = closed
    const [infoTarget, setInfoTarget] = useState<{ kind: 'category' | 'activity'; id: string } | null>(null);

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
                            {/* Category label — clickable → info modal */}
                            <button
                                type="button"
                                onClick={() => setInfoTarget({ kind: 'category', id: category })}
                                className="h-9 px-3 flex items-center gap-1.5 border-b w-full text-left cursor-pointer transition-opacity hover:opacity-80"
                                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                                title={`Info ${category}`}
                                aria-label={`Informasi kategori ${category}`}
                            >
                                <svg
                                    className="flex-shrink-0"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4M12 8h.01" />
                                </svg>
                                <span
                                    className="text-[9px] font-black uppercase tracking-tighter truncate"
                                >
                                    {category}
                                </span>
                            </button>

                            {ACTIVITIES.filter(a => a.category === category).map(activity => {
                                const displayName = getActivityName(activity.id);

                                return (
                                    <button
                                        key={activity.id}
                                        type="button"
                                        onClick={() => setInfoTarget({ kind: 'activity', id: activity.id })}
                                        className="h-14 px-3 flex items-center border-b group relative w-full text-left cursor-pointer transition-opacity hover:opacity-80"
                                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                                        title={`Info ${displayName}`}
                                        aria-label={`Informasi ${displayName}`}
                                    >
                                        <span
                                            className="text-[11px] font-semibold leading-snug pr-2 min-w-0 flex-1 line-clamp-2"
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            {displayName}
                                        </span>
                                        <svg
                                            className="flex-shrink-0"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 16v-4M12 8h.01" />
                                        </svg>
                                    </button>
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
                                {/* Category spacer (mirrors left column height h-9) */}
                                <div
                                    className="h-9 flex border-b"
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
                                {ACTIVITIES.filter(a => a.category === category).map(activity => (
                                    <div
                                        key={activity.id}
                                        className="flex h-14 border-b"
                                        style={{ borderColor: 'var(--border)' }}
                                    >
                                        {days.map(day => {
                                            const dateStr = formatDate(day);
                                            const locked = isFuture(day);
                                            const status = logMap.get(`${dateStr}:${activity.id}`) ?? STATUS.EMPTY;
                                            const _today = isToday(day);
                                            const isTilawah = isTilawahActivity(activity.id);
                                            const currentLog = logObjectMap.get(`${dateStr}:${activity.id}`);

                                            // Hitung jumlah halaman terbaca untuk tilawah
                                            const pageDifference = isTilawah && currentLog?.startPage && currentLog?.endPage
                                                ? currentLog.endPage - currentLog.startPage + 1
                                                : null;

                                            return (
                                                <div
                                                    key={day}
                                                    className="w-10 flex-shrink-0 flex items-center justify-center border-r transition-colors"
                                                    style={{
                                                        borderColor: 'var(--border)',
                                                        background: _today ? 'var(--primary-light)' : 'transparent',
                                                    }}
                                                >
                                                    <button
                                                        disabled={locked}
                                                        onClick={(e) => {
                                                            if (locked) return;
                                                            if (isTilawah) {
                                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                                setTilawahPopover({
                                                                    position: { x: rect.left, y: rect.bottom + 4 },
                                                                    dateStr,
                                                                    activityId: activity.id,
                                                                    currentLog,
                                                                });
                                                            } else {
                                                                onToggle(dateStr, activity.id);
                                                            }
                                                        }}
                                                        title={locked ? 'Hari mendatang' : isTilawah ? (pageDifference !== null ? `${pageDifference} halaman dibaca` : 'Catat halaman') : STATUS_LABEL[status]}
                                                        aria-label={`${getActivityName(activity.id)} — ${locked ? 'Hari mendatang' : isTilawah ? (pageDifference !== null ? `${pageDifference} halaman dibaca` : 'Belum dicatat') : STATUS_LABEL[status]}`}
                                                        className={[
                                                            'w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90',
                                                            status === STATUS.DONE
                                                                ? 'bg-green-600 text-white shadow-sm shadow-green-300 dark:shadow-green-900/30'
                                                                : status === STATUS.LATE
                                                                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-300 dark:shadow-amber-900/30'
                                                                    : status === STATUS.HAID
                                                                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-300 dark:shadow-rose-900/30'
                                                                        : status === STATUS.SKIPPED
                                                                            ? 'bg-slate-500 text-white shadow-sm shadow-slate-300 dark:shadow-slate-900/30'
                                                                            : 'border hover:border-green-400 dark:hover:border-green-500',
                                                            locked ? 'cursor-not-allowed opacity-40' : '',
                                                        ].join(' ')}
                                                        style={status === STATUS.EMPTY ? { borderColor: 'var(--border)', background: 'var(--bg-subtle)' } : undefined}
                                                    >
                                                        {locked
                                                            ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                                            : pageDifference !== null
                                                                ? <span aria-hidden="true" style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 700 }}>{pageDifference}</span>
                                                                : status === STATUS.DONE
                                                                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                                    : status === STATUS.LATE
                                                                        ? <Clock size={12} strokeWidth={2.5} />
                                                                        : status === STATUS.HAID
                                                                            ? <Heart size={12} fill="currentColor" strokeWidth={0} />
                                                                            : status === STATUS.SKIPPED
                                                                                ? <Frown size={12} strokeWidth={2.5} />
                                                                                : null
                                                        }
                                                    </button>
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
            <ActivityInfoModal
                isOpen={infoTarget !== null}
                onClose={() => setInfoTarget(null)}
                target={infoTarget}
                onSelectActivity={id => setInfoTarget({ kind: 'activity', id })}
                onOpenDoaScripts={
                    onOpenDoaScripts
                        ? () => {
                              // Tutup info modal dulu — tidak pernah ada dua modal bertumpuk
                              setInfoTarget(null);
                              onOpenDoaScripts();
                          }
                        : undefined
                }
            />
            {tilawahPopover && (
                <TilawahPagePopover
                    position={tilawahPopover.position}
                    activity={{ id: tilawahPopover.activityId, name: getActivityName(tilawahPopover.activityId) }}
                    currentLog={tilawahPopover.currentLog}
                    onSave={(sp, ep) => handleSaveTilawah(tilawahPopover.dateStr, tilawahPopover.activityId, sp, ep)}
                    onClose={() => setTilawahPopover(null)}
                />
            )}
        </div>
    );
}
