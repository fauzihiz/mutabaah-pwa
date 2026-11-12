'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { ActivityCategory } from '@/lib/constants/activities';

/** ID prefix used in logs to avoid clashes with any legacy static activity IDs. */
const CUSTOM_ID_PREFIX = 'custom-';

/**
 * Hook providing CRUD operations for user-defined activities belonging to a
 * specific child tab. All results are scoped to `childId` via a live query,
 * so switching tabs automatically shows only that tab's activities.
 */
export function useCustomActivities(childId: number) {
    // Return an array typed with a non-optional id: useLiveQuery equips each row
    // with its auto-generated primary key from Dexie.
    const customActivities = useLiveQuery(
        () => db.customActivities.where({ childId }).toArray(),
        [childId]
    );

    /**
     * Add a new activity for this child.
     * @returns the generated `activityId` string used by logs
     */
    const addActivity = async (name: string, category: ActivityCategory): Promise<string> => {
        const trimmed = name.trim();
        if (!trimmed) throw new Error('Activity name cannot be empty');

        const rowId = await db.customActivities.add({
            childId,
            name: trimmed,
            category,
        });

        return `${CUSTOM_ID_PREFIX}${rowId}`;
    };

    /** Rename a custom activity. Validates ownership by childId. */
    const renameActivity = async (activityId: string, newName: string): Promise<void> => {
        const trimmed = newName.trim();
        if (!trimmed) return; // ignore blank names

        const rowId = parseRowId(activityId);
        if (rowId === null) return;

        // Only update when the row belongs to the active child
        const row = await db.customActivities.get(rowId);
        if (!row || row.childId !== childId) return;

        await db.customActivities.update(rowId, { name: trimmed });
    };

    /** Delete an activity and its associated logs across all dates. */
    const deleteActivity = async (activityId: string): Promise<void> => {
        const rowId = parseRowId(activityId);
        if (rowId === null) return;

        const row = await db.customActivities.get(rowId);
        if (!row || row.childId !== childId) return;

        await db.transaction('rw', db.customActivities, db.logs, async () => {
            await db.customActivities.delete(rowId);
            await db.logs.where({ activityId }).delete();
        });
    };

    /** Convert the DB rows into the Activity shape expected by the grid/stats. */
    const activities: {
        id: string;
        name: string;
        category: ActivityCategory;
    }[] = (customActivities ?? []).map(row => ({
        id: `${CUSTOM_ID_PREFIX}${row.id}`,
        name: row.name,
        category: row.category as ActivityCategory,
    }));

    return {
        activities,
        isLoading: customActivities === undefined,
        addActivity,
        renameActivity,
        deleteActivity,
    };
}

function parseRowId(activityId: string): number | null {
    if (!activityId.startsWith(CUSTOM_ID_PREFIX)) return null;
    const suffix = activityId.slice(CUSTOM_ID_PREFIX.length);
    const n = Number(suffix);
    return Number.isInteger(n) && n > 0 ? n : null;
}
