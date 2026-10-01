'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, ActivityLog, isDone, STATUS, type LogStatus } from '@/lib/db';
import { ACTIVITIES } from '@/lib/constants/activities';
import { useState, useMemo } from 'react';

const isSholatTepatWaktu = (activityId: string) =>
    ACTIVITIES.find(a => a.id === activityId)?.category === 'Sholat Tepat Waktu';

// Siklus status per tap: Sholat Tepat Waktu → kosong→check→jam→heart;
// kategori lain → kosong→check→heart (tanpa jam).
const SHOLAT_CYCLE: LogStatus[] = [STATUS.EMPTY, STATUS.DONE, STATUS.LATE, STATUS.HAID];
const DEFAULT_CYCLE: LogStatus[] = [STATUS.EMPTY, STATUS.DONE, STATUS.HAID];

export function useMutabaahMonth(year: number, month: number) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

    const logs = useLiveQuery(
        () => db.logs.where('date').between(startDate, endDate, true, true).toArray(),
        [year, month]
    );

    const toggleActivity = async (date: string, activityId: string) => {
        const existing = await db.logs.where({ date, activityId }).first();

        const cycle = isSholatTepatWaktu(activityId) ? SHOLAT_CYCLE : DEFAULT_CYCLE;
        const current: LogStatus = existing ? existing.completed : STATUS.EMPTY;
        const idx = cycle.indexOf(current);
        // Status tak dikenal diperlakukan sebagai kosong → tap berikutnya = selesai
        const next = cycle[idx === -1 ? 1 : (idx + 1) % cycle.length];

        if (existing) {
            await db.logs.update(existing.id!, { completed: next });
        } else {
            await db.logs.add({
                date,
                activityId,
                completed: next,
                synced: false,
            });
        }
    };

    const statsForToday = useMemo(() => {
        const today = new Date().toLocaleDateString('en-CA');
        const todayLogs = logs?.filter(l => l.date === today && isDone(l.completed)) || [];
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
    const allLogs = useLiveQuery(() => db.logs.where('completed').between(STATUS.DONE, STATUS.LATE, true, true).toArray());

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
