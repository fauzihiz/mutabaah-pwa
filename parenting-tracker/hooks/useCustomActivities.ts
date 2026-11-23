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

    /**
     * Reorder activities within a category based on drag-and-drop interactions.
     * @param fromId - The ID of the activity being moved (with custom- prefix)
     * @param toId - The ID of the activity where the user wants to drop
     * @param position - 'before' or 'after' indicating the target position relative to toId
     * @param categoryId - The category ID where the reordering happens
     */
    const reorderActivities = async (fromId: string, toId: string, position: 'before' | 'after', categoryId: string) => {
        const fromRowId = parseRowId(fromId);
        const toRowId = parseRowId(toId);
        if (fromRowId === null || toRowId === null || fromRowId === toRowId) return;

        const fromRow = await db.customActivities.get(fromRowId);
        const toRow = await db.customActivities.get(toRowId);
        if (!fromRow || !toRow || fromRow.childId !== childId || toRow.childId !== childId) return;
        if (fromRow.category !== categoryId || toRow.category !== categoryId) return;

        const rows = await db.customActivities.where('childId').equals(childId).toArray();
        const categoryRows = rows
            .filter(r => r.category === categoryId)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || (a.id ?? 0) - (b.id ?? 0));
        const orderedIds = categoryRows.map(r => r.id!).filter(id => id !== fromRowId);
        const targetIndex = orderedIds.indexOf(toRowId);
        if (targetIndex < 0) return;
        const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
        orderedIds.splice(insertIndex, 0, fromRowId);

        await db.transaction('rw', db.customActivities, async () => {
            for (let i = 0; i < orderedIds.length; i++) {
                await db.customActivities.update(orderedIds[i], { order: i });
            }
        });
    };

    /** Convert the DB rows into the Activity shape expected by the grid/stats. */
    const activities: {
        id: string;
        name: string;
        category: ActivityCategory;
        order: number;
    }[] = (customActivities ?? []).map(row => ({
        id: `${CUSTOM_ID_PREFIX}${row.id}`,
        name: row.name,
        category: row.category as ActivityCategory,
        order: row.order ?? 0,
    })).sort((a, b) => a.order - b.order);

    return {
        activities,
        isLoading: customActivities === undefined,
        addActivity,
        renameActivity,
        deleteActivity,
        reorderActivities,
    };
}

function parseRowId(activityId: string): number | null {
    if (!activityId.startsWith(CUSTOM_ID_PREFIX)) return null;
    const suffix = activityId.slice(CUSTOM_ID_PREFIX.length);
    const n = Number(suffix);
    return Number.isInteger(n) && n > 0 ? n : null;
}
