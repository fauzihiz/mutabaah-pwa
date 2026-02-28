'use client';

import { ACTIVITIES, CATEGORIES } from '@/lib/constants/activities';
import { ActivityLog } from '@/lib/db';
import { Check, Lock } from 'lucide-react';

interface MutabaahGridProps {
    currentDate: Date;
    logs: ActivityLog[];
    onToggle: (date: string, activityId: string) => void;
}

export function MutabaahGrid({ currentDate, logs, onToggle }: MutabaahGridProps) {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const today = new Date();

    const isFuture = (day: number) => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        d.setHours(23, 59, 59);
        return d > today;
    };

    const formatDate = (day: number) => {
        const y = currentDate.getFullYear();
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const isToday = (day: number) =>
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

    return (
        <div
            className="flex-1 flex overflow-hidden border-t"
            style={{ borderColor: 'var(--border)' }}
        >
            {/* ── LEFT: static activity names ── */}
            <div
                className="w-36 flex-shrink-0 border-r z-20"
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
                            {/* Category label */}
                            <div
                                className="h-7 px-3 flex items-center border-b"
                                style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
                            >
                                <span
                                    className="text-[9px] font-black uppercase tracking-tighter truncate"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    {category}
                                </span>
                            </div>

                            {ACTIVITIES.filter(a => a.category === category).map(activity => (
                                <div
                                    key={activity.id}
                                    className="h-10 px-3 flex items-center border-b"
                                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                                >
                                    <span
                                        className="text-[11px] font-semibold truncate leading-tight"
                                        style={{ color: 'var(--text-secondary)' }}
                                    >
                                        {activity.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── RIGHT: horizontal date grid ── */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden z-10">
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
                                {ACTIVITIES.filter(a => a.category === category).map(activity => (
                                    <div
                                        key={activity.id}
                                        className="flex h-10 border-b"
                                        style={{ borderColor: 'var(--border)' }}
                                    >
                                        {days.map(day => {
                                            const dateStr = formatDate(day);
                                            const locked = isFuture(day);
                                            const completed = logs.find(l => l.date === dateStr && l.activityId === activity.id)?.completed === 1;
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
                                                            completed ? 'bg-green-600 text-white shadow-sm shadow-green-300' : 'border hover:border-green-400',
                                                            locked ? 'cursor-not-allowed opacity-40' : '',
                                                        ].join(' ')}
                                                        style={!completed ? { borderColor: 'var(--border)', background: 'var(--bg-subtle)' } : undefined}
                                                    >
                                                        {locked
                                                            ? <Lock size={9} style={{ color: 'var(--text-muted)' }} />
                                                            : completed
                                                                ? <Check size={13} />
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
        </div>
    );
}
