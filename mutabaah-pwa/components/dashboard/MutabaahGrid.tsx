'use client';

import { useMemo, useState, useEffect, useRef, type MouseEvent as ReactMouseEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ACTIVITIES, CATEGORIES, Activity, ActivityCategory } from '@/lib/constants/activities';
import { ActivityLog, LogStatus } from '@/lib/db';
import { useActivitySettings } from '@/hooks/useActivitySettings';

interface MutabaahGridProps {
    currentDate: Date;
    logs: ActivityLog[];
    onSetStatus: (date: string, activityId: string, status: LogStatus | undefined) => void;
}

function toLocalDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getLogStatus(log: ActivityLog | undefined): LogStatus | undefined {
    if (!log) return undefined;
    if (log.status) return log.status;
    return log.completed === 1 ? 'done' : 'miss';
}

function getStatusSymbol(status: LogStatus): string {
    switch (status) {
        case 'done': return '✓';
        case 'late': return '⏳';
        case 'haid': return '♥';
        case 'miss': return '☹';
        default: return '';
    }
}

function getStatusBadgeBg(status: LogStatus): string {
    switch (status) {
        case 'done': return '#16a34a';
        case 'late': return '#f97316';
        case 'haid': return '#ec4899';
        case 'miss': return '#ef4444';
        default: return '#64748b';
    }
}

function getStatusName(status: LogStatus): string {
    switch (status) {
        case 'done': return 'Selesai';
        case 'late': return 'Terlambat';
        case 'haid': return 'Haid';
        case 'miss': return 'Tidak Dikerjakan';
        default: return '';
    }
}

function getAvailableStatuses(activity: Activity): LogStatus[] {
    if (activity.category === 'Sholat Tepat Waktu') {
        return ['done', 'late', 'haid', 'miss'];
    }
    return ['done', 'haid', 'miss'];
}

function StatusPopover({
    position, activity, onSelect, onClose, currentStatus
}: {
    position: { x: number; y: number };
    activity: Activity;
    currentStatus: LogStatus | undefined;
    onSelect: (status: LogStatus | undefined) => void;
    onClose: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const statuses = getAvailableStatuses(activity);

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

    return (
        <div
            ref={ref}
            className="fixed z-[200] w-44 rounded-xl border shadow-xl overflow-hidden"
            style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border)',
                left: Math.min(position.x, (typeof window !== 'undefined' ? window.innerWidth : 9999) - 190),
                top: Math.min(position.y, (typeof window !== 'undefined' ? window.innerHeight : 9999) - statuses.length * 38 - 56),
            }}
        >
            <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[11px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{activity.name}</p>
            </div>
            {statuses.map(status => (
                <button
                    key={status}
                    onClick={() => { onSelect(status); onClose(); }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <span className="text-sm w-6 h-6 flex items-center justify-center rounded-lg font-bold" style={{ background: getStatusBadgeBg(status), color: '#fff' }}>
                        {getStatusSymbol(status)}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{getStatusName(status)}</span>
                    {currentStatus === status && <span className="ml-auto text-xs" style={{ color: 'var(--primary)' }}>✓</span>}
                </button>
            ))}
            {currentStatus && (
                <div
                    className="px-3 py-2 border-t flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onSelect(undefined); onClose(); }}
                >
                    <span className="w-6 h-6 flex items-center justify-center rounded-lg font-bold text-xs" style={{ background: '#e2e8f0', color: '#64748b' }}>✕</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Kosongkan</span>
                </div>
            )}
        </div>
    );
}

function AmalanUnggulanModal({
    isOpen,
    onClose,
    selectedId,
    onSelect
}: {
    isOpen: boolean;
    onClose: () => void;
    selectedId: string | null;
    onSelect: (id: string) => void;
}) {
    if (!isOpen) return null;
    const amalanList = ACTIVITIES.filter(a => a.category === 'Amalan Unggulan');
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border shadow-2xl" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
                    <div>
                        <h2 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Amalan Unggulan</h2>
                        <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>Pilih Satu</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"><span style={{ color: 'var(--text-muted)' }}>✕</span></button>
                </div>
                <div className="px-6 py-4 space-y-3">
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Silahkan memilih satu amalan yang ingin dijaga secara istiqamah.</p>
                    <select
                        value={selectedId || ''}
                        onChange={(e) => { if (e.target.value) { onSelect(e.target.value); onClose(); } }}
                        className="w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    >
                        <option value="">-- Pilih Amalan --</option>
                        {amalanList.map(amalan => (
                            <option key={amalan.id} value={amalan.id}>{amalan.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export function MutabaahGrid({ currentDate, logs, onSetStatus }: MutabaahGridProps) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);
    const { getActivityName } = useActivitySettings();

    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [selectedAmalanUnggulan, setSelectedAmalanUnggulan] = useState<string | null>(null);
    const [today, setToday] = useState<Date | null>(null);
    const [todayStr, setTodayStr] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('selected_amalan_unggulan');
        if (saved) setSelectedAmalanUnggulan(saved);
    }, []);

    const handleSelectAmalan = (id: string) => {
        setSelectedAmalanUnggulan(id);
        localStorage.setItem('selected_amalan_unggulan', id);
    };

    const getActivitiesForCategory = (category: ActivityCategory): Activity[] => {
        if (category === 'Amalan Unggulan') {
            if (selectedAmalanUnggulan) {
                return ACTIVITIES.filter(a => a.category === 'Amalan Unggulan' && a.id === selectedAmalanUnggulan);
            }
            return [];
        }
        return ACTIVITIES.filter(a => a.category === category);
    };

    const logMap = useMemo(() => {
        const m = new Map<string, LogStatus | undefined>();
        for (const l of logs) m.set(`${l.date}:${l.activityId}`, getLogStatus(l));
        return m;
    }, [logs]);

    useEffect(() => {
        const sync = () => {
            const now = new Date();
            setToday(now);
            setTodayStr(toLocalDateStr(now.getFullYear(), now.getMonth(), now.getDate()));
        };
        sync();
        const id = setInterval(sync, 60_000);
        const onVisible = () => { if (document.visibilityState === 'visible') sync(); };
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

    const formatDate = (day: number) => toLocalDateStr(currentDate.getFullYear(), currentDate.getMonth(), day);

    const isToday = (day: number) =>
        !!today &&
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

    const isFuture = (day: number) => {
        if (!todayStr) return false;
        return formatDate(day) > todayStr;
    };

    const [statusPopover, setStatusPopover] = useState<{
        position: { x: number; y: number };
        dateStr: string;
        activity: Activity;
        currentStatus: LogStatus | undefined;
    } | null>(null);

    const gridScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = gridScrollRef.current;
        if (!el || !today || !todayStr) return;
        if (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()) {
            const target = Math.max(0, (today.getDate() - 1) * 40 - el.clientWidth * 0.4);
            el.scrollTo({ left: target, behavior: 'smooth' });
        } else {
            el.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [currentDate, todayStr]);

return (
        <div className="flex-1 flex overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="w-36 flex-shrink-0 border-r z-20" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                <div className="h-11 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }} />
                <div className="overflow-y-auto h-full scrollbar-hide pb-24">
                    {CATEGORIES.map(category => {
                        const activities = getActivitiesForCategory(category);
                        const isUnggulan = category === 'Amalan Unggulan';
                        const needsFocusPrompt = isUnggulan && !selectedAmalanUnggulan;
                        return (
                            <div key={category}>
                                <div className={`${needsFocusPrompt ? 'h-20 py-1 pl-3 pr-8' : isUnggulan ? 'h-12 py-1 px-3' : 'h-7 px-3'} flex items-center border-b relative`} style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)', borderLeftWidth: isUnggulan ? '4px' : '0', borderLeftColor: '#f59e0b' }}>
                                    <button
                                        onClick={() => isUnggulan && setCategoryModalOpen(true)}
                                        className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-left transition-colors ${isUnggulan ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 hover:text-green-600 dark:hover:text-green-400 truncate'}`}
                                        style={isUnggulan ? undefined : { color: 'var(--text-muted)' }}
                                    >
                                        {isUnggulan ? (
                                            <span className="whitespace-normal break-words leading-tight">
                                                {needsFocusPrompt ? 'Pilih Amalan Unggulan Yang Akan Difokuskan [Klik Untuk Pilih]' : 'Amalan Unggulan [Klik Untuk Pilih]'}
                                            </span>
                                        ) : category}
                                    </button>
                                </div>
                                {activities.map(activity => (
                                    <div
                                        key={activity.id}
                                        className="h-12 px-3 flex items-center border-b"
                                        style={{ background: isUnggulan ? '#fffbeb' : 'var(--bg-surface)', borderColor: 'var(--border)', borderLeftWidth: isUnggulan ? '4px' : '0', borderLeftColor: '#f59e0b' }}
                                    >
                                        <span className={`text-[11px] leading-tight pr-4 ${isUnggulan ? 'font-bold text-amber-800 dark:text-amber-300' : 'font-semibold'}`} style={{ color: !isUnggulan ? 'var(--text-secondary)' : undefined }}>
                                            {getActivityName(activity.id)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
<div ref={gridScrollRef} className="flex-1 overflow-x-auto overflow-y-hidden z-10">
                <div className="inline-block min-w-full">
                    <div className="flex h-11 border-b sticky top-0 z-20" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                        {days.map(day => {
                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const _today = isToday(day);
                            const weekend = date.getDay() === 0 || date.getDay() === 6;
                            return (
                                <div key={day} className="w-10 flex-shrink-0 flex flex-col items-center justify-center border-r" style={{ borderColor: 'var(--border)', background: _today ? 'var(--primary-light)' : weekend ? 'var(--bg-subtle)' : 'var(--bg-surface)' }}>
                                    <span className="text-[9px] font-bold uppercase" style={{ color: _today ? 'var(--primary)' : 'var(--text-muted)' }}>{date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}</span>
                                    <span className="text-[11px] font-black" style={{ color: _today ? 'var(--primary)' : 'var(--text-primary)' }}>{day}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="overflow-y-auto scrollbar-hide pb-24">
                        {CATEGORIES.map(category => {
                            const activities = getActivitiesForCategory(category);
                            const isUnggulan = category === 'Amalan Unggulan';
                            const needsFocusPrompt = isUnggulan && !selectedAmalanUnggulan;
                            return (
                                <div key={category}>
                                    <div className={`flex ${needsFocusPrompt ? 'h-20' : isUnggulan ? 'h-12' : 'h-7'} border-b`} style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}>
                                        {days.map(day => (
                                            <div key={day} className="w-10 flex-shrink-0 border-r" style={{ borderColor: 'var(--border)' }} />
                                        ))}
                                    </div>
                                    {activities.map(activity => (
                                        <div key={activity.id} className="flex h-12 border-b" style={{ borderColor: 'var(--border)' }}>
                                            {days.map(day => {
                                                const dateStr = formatDate(day);
                                                const status = logMap.get(`${dateStr}:${activity.id}`);
                                                const _today = isToday(day);
                                                return (
                                                    <div
                                                        key={day}
                                                        className={`w-10 flex-shrink-0 flex items-center justify-center border-r transition-colors group relative cursor-pointer ${isFuture(day) ? 'opacity-50' : ''}`}
                                                        style={{
                                                            borderColor: 'var(--border)',
                                                            background: _today ? 'var(--primary-light)' : 'transparent',
                                                        }}
                                                        onClick={(e) => {
                                                            if (isFuture(day)) return;
                                                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                            setStatusPopover({ position: { x: rect.left, y: rect.bottom + 4 }, dateStr, activity, currentStatus: status });
                                                        }}
                                                    >
                                                        {status ? (
                                                            <span aria-hidden="true" style={{ color: getStatusBadgeBg(status), fontSize: '12px', fontWeight: 700 }}>{getStatusSymbol(status)}</span>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <AmalanUnggulanModal
                isOpen={categoryModalOpen}
                onClose={() => setCategoryModalOpen(false)}
                selectedId={selectedAmalanUnggulan}
                onSelect={handleSelectAmalan}
            />
            {statusPopover && (
                <StatusPopover
                    position={statusPopover.position}
                    activity={statusPopover.activity}
                    currentStatus={statusPopover.currentStatus}
                    onSelect={(status) => onSetStatus(statusPopover.dateStr, statusPopover.activity.id, status)}
                    onClose={() => setStatusPopover(null)}
                />
            )}
        </div>
    );
}