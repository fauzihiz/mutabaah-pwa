'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, ActivityLog } from '@/lib/db';
import { ACTIVITIES } from '@/lib/constants/activities';
import { useState, useMemo } from 'react';

export function useMutabaah(selectedDate: string) {
    const logs = useLiveQuery(
        () => db.logs.where('date').equals(selectedDate).toArray(),
        [selectedDate]
    );

    const toggleActivity = async (activityId: string) => {
        const existing = await db.logs.where({ date: selectedDate, activityId }).first();

        if (existing) {
            await db.logs.update(existing.id!, { completed: existing.completed ? 0 : 1 });
        } else {
            await db.logs.add({
                date: selectedDate,
                activityId,
                completed: 1,
                synced: false,
            });
        }
    };

    const stats = useMemo(() => {
        if (!logs) return { completed: 0, total: ACTIVITIES.length, percentage: 0 };
        const completedCount = logs.filter(l => l.completed).length;
        return {
            completed: completedCount,
            total: ACTIVITIES.length,
            percentage: Math.round((completedCount / ACTIVITIES.length) * 100) || 0,
        };
    }, [logs]);

    return {
        logs,
        toggleActivity,
        stats,
    };
}

export function useStreak() {
    const allLogs = useLiveQuery(() => db.logs.where('completed').equals(1).toArray());

    const streak = useMemo(() => {
        if (!allLogs || allLogs.length === 0) return 0;

        // Group by date
        const distinctDates = Array.from(new Set(allLogs.map(l => l.date))).sort().reverse();

        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // If no logs for today or yesterday, streak is 0
        if (distinctDates[0] !== today && distinctDates[0] !== yesterday) return 0;

        let checkDate = distinctDates[0] === today ? today : yesterday;

        for (let i = 0; i < distinctDates.length; i++) {
            const dateStr = distinctDates[i];
            if (dateStr === checkDate) {
                currentStreak++;
                // Set checkDate to the day before
                const prevDate = new Date(new Date(checkDate).getTime() - 86400000).toISOString().split('T')[0];
                checkDate = prevDate;
            } else {
                break;
            }
        }

        return currentStreak;
    }, [allLogs]);

    return streak;
}
