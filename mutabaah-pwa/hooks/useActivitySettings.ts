'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ACTIVITIES } from '@/lib/constants/activities';

export function useActivitySettings() {
    const settings = useLiveQuery(() => db.activitySettings.toArray());

    const renameActivity = async (activityId: string, newName: string) => {
        const trimmed = newName.trim();
        if (!trimmed) {
            // Blank input → remove custom name so it reverts to the default
            await db.activitySettings.delete(activityId);
            return;
        }
        await db.activitySettings.put({ activityId, customName: trimmed });
    };

    const getActivityName = (activityId: string) => {
        const custom = settings?.find(s => s.activityId === activityId);
        if (custom) return custom.customName;

        const standard = ACTIVITIES.find(a => a.id === activityId);
        return standard?.name || activityId;
    };

    const isLoading = settings === undefined;

    return {
        renameActivity,
        getActivityName,
        isLoading
    };
}
