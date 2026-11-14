'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, ActivityLog } from '@/lib/db';
import { ACTIVITIES } from '@/lib/constants/activities';
import { useState, useMemo, useEffect } from 'react';

export function useChildren() {
    const children = useLiveQuery(() => db.children.toArray());

    const addChild = async (name: string) => {
        return await db.children.add({ name });
    };

    const updateChild = async (id: number, name: string) => {
        return await db.children.update(id, { name });
    };

    const removeChild = async (id: number) => {
        // Option to delete child's logs as well could be here
        return await db.children.delete(id);
    };

    return { children, addChild, updateChild, removeChild };
}

/**
 * Hook for managing supporting stickers (7-10) per activity per child.
 * Returns a Map: activityId -> array of active flag values (e.g. [7, 10]).
 * toggleFlag adds/removes a flag for a given activity.
 */
export function useActivityFlags(childId: number) {
    const [flags, setFlags] = useState<Map<string, number[]>>(new Map());

    const flagsArray = useLiveQuery(() =>
        db.flags.where('childId').equals(childId).toArray(),
        [childId]
    );

    // Build the flags map whenever the live query result changes
    useEffect(() => {
        const map = new Map<string, number[]>();
        for (const f of flagsArray ?? []) {
            const existing = map.get(f.activityId) ?? [];
            if (!existing.includes(f.flag)) {
                existing.push(f.flag);
            }
            map.set(f.activityId, existing);
        }
        setFlags(map);
    }, [flagsArray, childId]);

    const toggleFlag = async (activityId: string, flag: number) => {
        const existingFlags = flags.get(activityId) ?? [];
        if (existingFlags.includes(flag)) {
            // Remove flag
            await db.flags.where({ activityId, flag, childId }).delete();
            setFlags(prev => {
                const next = new Map(prev);
                const updated = next.get(activityId)?.filter(f => f !== flag) ?? [];
                next.set(activityId, updated);
                return next;
            });
        } else {
            // Add flag
            await db.flags.add({ activityId, flag, childId });
            setFlags(prev => {
                const next = new Map(prev);
                const updated = [...(next.get(activityId) ?? []), flag];
                next.set(activityId, updated);
                return next;
            });
        }
    };

    return { flags, toggleFlag };
}

export function useMutabaahMonth(year: number, month: number, childId: number = 1) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

    const logs = useLiveQuery(
        () => db.logs.where('date').between(startDate, endDate, true, true)
                 .filter(log => log.childId === childId)
                 .toArray(),
        [year, month, childId]
    );

    const setSticker = async (date: string, activityId: string, stickerValue: number) => {
        const existing = await db.logs.where({ date, activityId, childId }).first();

        if (existing) {
            if (stickerValue === 0) {
                // Remove the log entry entirely when clearing
                await db.logs.delete(existing.id!);
            } else {
                await db.logs.update(existing.id!, { stickerValue });
            }
        } else {
            if (stickerValue > 0) {
                await db.logs.add({
                    date,
                    activityId,
                    stickerValue,
                    synced: false,
                    childId
                });
            }
        }
    };

    return {
        logs,
        setSticker
    };
}

export function useStreak(childId: number = 1) {
    const allLogs = useLiveQuery(() => db.logs.where('stickerValue').above(0).filter(log => log.childId === childId).toArray(), [childId]);

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
