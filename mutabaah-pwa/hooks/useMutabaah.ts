'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, ActivityLog } from '@/lib/db';
import { ACTIVITIES } from '@/lib/constants/activities';
import { useState, useMemo } from 'react';

import { checkAndSyncAchievements } from '@/lib/achievements';

export function useMutabaahMonth(year: number, month: number, userId?: string) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

    const logs = useLiveQuery(
        () => db.logs.where('date').between(startDate, endDate, true, true).toArray(),
        [year, month]
    );

    const toggleActivity = async (date: string, activityId: string) => {
        const existing = await db.logs.where({ date, activityId }).first();

        if (existing) {
            await db.logs.update(existing.id!, { completed: existing.completed ? 0 : 1 });
        } else {
            await db.logs.add({
                date,
                activityId,
                completed: 1,
                synced: false,
            });
        }

        // After toggle, check achievements if we have a user
        if (userId) {
            const allLogs = await db.logs.toArray();
            await checkAndSyncAchievements(userId, allLogs);
        }
    };

    const statsForToday = useMemo(() => {
        const today = new Date().toLocaleDateString('en-CA');
        const todayLogs = logs?.filter(l => l.date === today && l.completed === 1) || [];
        return {
            completed: todayLogs.length,
            total: ACTIVITIES.length,
            percentage: Math.round((todayLogs.length / ACTIVITIES.length) * 100) || 0,
        };
    }, [logs]);

    return {
        logs,
        toggleActivity,
        statsForToday,
    };
}

export function useStreak() {
    const allLogs = useLiveQuery(() => db.logs.where('completed').equals(1).toArray());

    const streak = useMemo(() => {
        if (!allLogs || allLogs.length === 0) return 0;
        const distinctDates = Array.from(new Set(allLogs.map(l => l.date))).sort().reverse();

        const today = new Date().toLocaleDateString('en-CA');
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

        if (distinctDates[0] !== today && distinctDates[0] !== yesterday) return 0;

        let currentStreak = 0;
        let checkDate = distinctDates[0] === today ? today : yesterday;

        for (const date of distinctDates) {
            if (date === checkDate) {
                currentStreak++;
                const d = new Date(checkDate);
                d.setDate(d.getDate() - 1);
                checkDate = d.toLocaleDateString('en-CA');
            } else {
                break;
            }
        }
        return currentStreak;
    }, [allLogs]);

    return streak;
}
