'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, ActivityLog } from '@/lib/db';
import { ACHIEVEMENTS, type Achievement } from '@/lib/achievements';
import { useMemo } from 'react';

// --- Helper: local date string YYYY-MM-DD ---
function toLocal(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// --- Max consecutive streak within a given set of dated logs ---
function maxStreak(logs: ActivityLog[]): number {
    const dates = Array.from(new Set(logs.filter(l => l.completed === 1).map(l => l.date))).sort();
    if (dates.length === 0) return 0;

    let best = 1, run = 1;
    for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        prev.setHours(12);
        prev.setDate(prev.getDate() + 1);
        if (toLocal(prev) === dates[i]) {
            run++;
            if (run > best) best = run;
        } else {
            run = 1;
        }
    }
    return best;
}

export interface BadgeStatus {
    achievement: Achievement;
    progress: number;   // 0–100 percentage toward threshold
    current: number;    // actual current count/streak
    earned: boolean;    // did they hit the threshold this month?
}

export function useMonthlyAchievements(year: number, month: number) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

    // 1. Reactive – auto-updates when IndexedDB changes
    const monthLogs = useLiveQuery(
        () => db.logs.where('date').between(startDate, endDate, true, true).toArray(),
        [year, month]
    );

    // 2. Compute badge status reactively using local definitions
    const badges = useMemo<BadgeStatus[]>(() => {
        if (!monthLogs || ACHIEVEMENTS.length === 0) return [];

        return ACHIEVEMENTS.map(rule => {
            let current = 0;

            if (rule.condition_type === 'min_streak') {
                current = maxStreak(monthLogs);
            } else if (rule.condition_type === 'activity_streak') {
                const sub = monthLogs.filter(l => l.activityId === rule.target_activity_id);
                current = maxStreak(sub);
            } else if (rule.condition_type === 'total_count') {
                current = monthLogs.filter(l => l.completed === 1).length;
            } else if (rule.condition_type === 'activity_count') {
                current = monthLogs.filter(l => l.activityId === rule.target_activity_id && l.completed === 1).length;
            }

            const earned = current >= rule.threshold;
            const progress = Math.min(100, Math.round((current / rule.threshold) * 100));

            return { achievement: rule, progress, current, earned };
        })
            // Earned first, then by progress descending
            .sort((a, b) => {
                if (a.earned !== b.earned) return b.earned ? 1 : -1;
                return b.progress - a.progress;
            });
    }, [monthLogs]);

    return { badges, isLoading: !monthLogs };
}
