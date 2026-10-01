'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { ActivityLog, ActivityDef } from '@/lib/db';
import { useTrackerConfig } from '@/hooks/useTrackerConfig';
import { Plus, Trash, Edit2, Flag } from 'lucide-react';

interface MutabaahGridProps {
    currentDate: Date;
    logs: ActivityLog[];
    onToggle: (date: string, activityId: string) => void;
}

function toLocalDateStr(y: number, m: number, d: number) {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function MutabaahGrid({ currentDate, logs, onToggle }: MutabaahGridProps) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

    const {
        categories, activities,
        addCategory, editCategory, deleteCategory,
        addActivity, editActivity, deleteActivity
    } = useTrackerConfig();

    const logMap = useMemo(() => {
        const m = new Map<string, boolean>();
        for (const l of logs) {
            m.set(`${l.date}:${l.activityId}`, l.completed === 1);
        }
        return m;
    }, [logs]);

    const [today, setToday] = useState<Date | null>(null);
    const [todayStr, setTodayStr] = useState('');

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
        return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('focus', onVisible); };
    }, []);

    const isFuture = (day: number) => {
        if (!todayStr) return false;
        return toLocalDateStr(currentDate.getFullYear(), currentDate.getMonth(), day) > todayStr;
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

    // Auto-scroll to today
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !today || !todayStr) return;
        const isCurrentMonth = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();
        if (isCurrentMonth) {
            // LEFT_COL_WIDTH px for the sticky label column
            const LEFT = 192;
            const colWidth = 40;
            const target = Math.max(0, LEFT + (today.getDate() - 1) * colWidth - el.clientWidth * 0.5);
            el.scrollTo({ left: target, behavior: 'smooth' });
        } else {
            el.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [currentDate, todayStr]);

    const handleAddCategory = () => {
        const name = prompt('New Category Name:');
        if (name?.trim()) addCategory(name.trim());
    };
    const handleEditCategory = (id: string, current: string) => {
        const name = prompt('Edit Category Name:', current);
        if (name?.trim() && name !== current) editCategory(id, name.trim());
    };
    const handleDeleteCategory = (id: string) => {
        if (confirm('Delete this category and all its activities?')) deleteCategory(id);
    };
    const handleAddActivity = (catId: string) => {
        const name = prompt('New Activity Name:');
        if (name?.trim()) addActivity(catId, name.trim());
    };
    const handleEditActivity = (id: string, current: string) => {
        const name = prompt('Edit Activity Name:', current);
        if (name?.trim() && name !== current) editActivity(id, { name: name.trim() });
    };
    const handleDeleteActivity = (id: string) => {
        if (confirm('Delete this activity?')) deleteActivity(id);
    };
    // Cycle: none → high → medium → low → none
    const cycleActivityPriority = (activity: ActivityDef) => {
        const next =
            activity.priority === 'high' ? 'medium' :
            activity.priority === 'medium' ? 'low' :
            activity.priority === 'low' ? undefined :
            'high';
        editActivity(activity.id, { priority: next });
    };

    const LEFT_W = 192; // px — must match w-48

    return (
        <div
            className="flex-1 overflow-auto border-t scrollbar-hide"
            style={{ borderColor: 'var(--border)' }}
            ref={scrollRef}
        >
            {/* The whole grid is one scroll context. Left labels are sticky. */}
            <div style={{ minWidth: LEFT_W + days.length * 40 }}>

                {/* ── HEADER ROW ── */}
                <div
                    className="flex h-11 border-b sticky top-0 z-30"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                >
                    {/* sticky top-left corner with Add Category button */}
                    <div
                        className="flex-shrink-0 sticky left-0 z-30 flex items-center justify-between px-2 border-r"
                        style={{ width: LEFT_W, background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                    >
                        <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                            Activities
                        </span>
                        <button
                            onClick={handleAddCategory}
                            title="Add Category"
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Date columns */}
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
                                <span className="text-[9px] font-bold uppercase" style={{ color: _today ? 'var(--today-label)' : 'var(--text-muted)' }}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                                </span>
                                <span className="text-[11px] font-black" style={{ color: _today ? 'var(--today-label)' : 'var(--text-primary)' }}>
                                    {day}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ── BODY ── */}
                {categories.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-sm opacity-40">
                        No categories yet. Tap + to add one.
                    </div>
                )}

                {categories.map(category => {
                    const catActivities = activities.filter(a => a.categoryId === category.id);
                    return (
                        <div key={category.id}>
                            {/* ── Category header row ── */}
                            <div
                                className="flex h-7 border-b group"
                                style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}
                            >
                                {/* sticky label */}
                                <div
                                    className="flex-shrink-0 sticky left-0 z-20 flex items-center justify-between px-2 border-r"
                                    style={{ width: LEFT_W, background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                                >
                                    <span
                                        className="text-[10px] font-black uppercase tracking-tighter truncate"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {category.name}
                                    </span>
                                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                                        <button
                                            onClick={() => handleAddActivity(category.id)}
                                            title="Add Activity"
                                            className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <Plus size={11} />
                                        </button>
                                        <button
                                            onClick={() => handleEditCategory(category.id, category.name)}
                                            title="Edit Category"
                                            className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                            style={{ color: 'var(--text-muted)' }}
                                        >
                                            <Edit2 size={10} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category.id)}
                                            title="Delete Category"
                                            className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                        >
                                            <Trash size={10} />
                                        </button>
                                    </div>
                                </div>
                                {/* spacer cells */}
                                {days.map(day => (
                                    <div
                                        key={day}
                                        className="w-10 flex-shrink-0 border-r"
                                        style={{ borderColor: 'var(--border)' }}
                                    />
                                ))}
                            </div>

                            {/* ── Activity rows ── */}
                            {catActivities.length === 0 ? (
                                <div
                                    className="flex h-10 border-b"
                                    style={{ borderColor: 'var(--border)' }}
                                >
                                    <div
                                        className="flex-shrink-0 sticky left-0 z-20 flex items-center px-3 border-r"
                                        style={{ width: LEFT_W, background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                                    >
                                        <span className="text-[10px] opacity-40 italic">No activities — tap + above</span>
                                    </div>
                                    {days.map(day => (
                                        <div
                                            key={day}
                                            className="w-10 flex-shrink-0 border-r"
                                            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                catActivities.map(activity => (
                                    <div
                                        key={activity.id}
                                        className="flex h-12 border-b group"
                                        style={{ borderColor: 'var(--border)' }}
                                    >
                                        {/* sticky label */}
                                        <div
                                            className="flex-shrink-0 sticky left-0 z-20 flex items-center justify-between px-2 border-r"
                                            style={{
                                                width: LEFT_W,
                                                background:
                                                    activity.priority === 'high' ? 'var(--priority-high-bg)' :
                                                    activity.priority === 'medium' ? 'var(--priority-medium-bg)' :
                                                    activity.priority === 'low' ? 'var(--priority-low-bg)' :
                                                    'var(--bg-surface)',
                                                borderColor: 'var(--border)',
                                            }}
                                        >
                                            <span
                                                className="text-[11px] font-semibold leading-tight truncate"
                                                style={{ color: activity.priority ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                                            >
                                                {activity.name}
                                            </span>
                                            <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                                                <button
                                                    onClick={() => cycleActivityPriority(activity)}
                                                    title={`Priority: ${activity.priority ?? 'none'} — click to cycle`}
                                                    className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                                    style={{
                                                        color:
                                                            activity.priority === 'high' ? 'var(--error)' :
                                                            activity.priority === 'medium' ? 'var(--warning)' :
                                                            activity.priority === 'low' ? 'var(--success)' :
                                                            'var(--text-muted)',
                                                    }}
                                                >
                                                    <Flag size={10} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditActivity(activity.id, activity.name)}
                                                    className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                                                    style={{ color: 'var(--text-muted)' }}
                                                >
                                                    <Edit2 size={10} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteActivity(activity.id)}
                                                    className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                                                >
                                                    <Trash size={10} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* date toggle cells */}
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
                                                    <button
                                                        disabled={locked}
                                                        onClick={() => onToggle(dateStr, activity.id)}
                                                        className={[
                                                            'w-6 h-6 rounded-lg flex items-center justify-center transition-all active:scale-90',
                                                            completed
                                                                ? 'bg-green-600 text-white shadow-sm shadow-green-300 dark:shadow-green-900/30'
                                                                : 'border hover:border-green-400 dark:hover:border-green-500',
                                                            locked ? 'cursor-not-allowed opacity-40' : '',
                                                        ].join(' ')}
                                                        style={!completed ? { borderColor: 'var(--border)', background: 'var(--bg-subtle)' } : undefined}
                                                    >
                                                        {locked
                                                            ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                                            : completed
                                                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                                : null
                                                        }
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
