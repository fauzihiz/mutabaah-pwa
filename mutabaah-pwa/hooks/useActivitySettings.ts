'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { ACTIVITIES } from '@/lib/constants/activities';

export function useActivitySettings() {
    const settings = useLiveQuery(() => db.activitySettings.toArray());

    const renameActivity = async (activityId: string, newName: string) => {
        if (!newName.trim()) return;
        await db.activitySettings.put({ activityId, customName: newName.trim() });
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
