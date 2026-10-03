'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { Clock, Heart } from 'lucide-react';
import { ACTIVITIES, CATEGORIES } from '@/lib/constants/activities';
import { ActivityLog, STATUS } from '@/lib/db';
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
    [STATUS.EMPTY]: 'Belum dikerjakan',
    [STATUS.DONE]: 'Selesai',
    [STATUS.LATE]: 'Selesai telat',
    [STATUS.HAID]: 'Haid/berhalangan',
};

export function MutabaahGrid({ currentDate, logs, onToggle, onOpenDoaScripts }: MutabaahGridProps) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    const { getActivityName } = useActivitySettings();

    // Pre-compute a lookup Map: "date:activityId" → status (0/1/2/3) — O(1) per cell instead of O(n)
    const logMap = useMemo(() => {
        const m = new Map<string, number>();
        for (const l of logs) {
            m.set(`${l.date}:${l.activityId}`, l.completed);
        }
        return m;
    }, [logs]);

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
            <div ref={gridScrollRef} className="flex-1 overflow-x-auto overflow-y-hidden z-10">
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
                                                        onClick={() => onToggle(dateStr, activity.id)}
                                                        title={locked ? 'Hari mendatang' : STATUS_LABEL[status]}
                                                        aria-label={`${getActivityName(activity.id)} — ${locked ? 'Hari mendatang' : STATUS_LABEL[status]}`}
                                                        className={[
                                                            'w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90',
                                                            status === STATUS.DONE
                                                                ? 'bg-green-600 text-white shadow-sm shadow-green-300 dark:shadow-green-900/30'
                                                                : status === STATUS.LATE
                                                                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-300 dark:shadow-amber-900/30'
                                                                    : status === STATUS.HAID
                                                                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-300 dark:shadow-rose-900/30'
                                                                        : 'border hover:border-green-400 dark:hover:border-green-500',
                                                            locked ? 'cursor-not-allowed opacity-40' : '',
                                                        ].join(' ')}
                                                        style={status === STATUS.EMPTY ? { borderColor: 'var(--border)', background: 'var(--bg-subtle)' } : undefined}
                                                    >
                                                        {locked
                                                            ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                                            : status === STATUS.DONE
                                                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                                : status === STATUS.LATE
                                                                    ? <Clock size={12} strokeWidth={2.5} />
                                                                    : status === STATUS.HAID
                                                                        ? <Heart size={12} fill="currentColor" strokeWidth={0} />
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
        </div>
    );
}
