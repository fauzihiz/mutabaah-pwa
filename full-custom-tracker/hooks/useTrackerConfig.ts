'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

function generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback for non-secure contexts (HTTP dev)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (typeof crypto !== 'undefined' && crypto.getRandomValues)
            ? (crypto.getRandomValues(new Uint8Array(1))[0] & 15)
            : Math.floor(Math.random() * 16);
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function useTrackerConfig() {
    const categories = useLiveQuery(() => db.categories.orderBy('order').toArray()) || [];
    const activities = useLiveQuery(() => db.activities.orderBy('order').toArray()) || [];

    const addCategory = async (name: string) => {
        const id = generateId();
        const order = categories.length;
        await db.categories.add({ id, name, order });
    };

    const editCategory = async (id: string, name: string) => {
        await db.categories.update(id, { name });
    };

    const deleteCategory = async (id: string) => {
        await db.categories.delete(id);
        const relatedActivities = activities.filter(a => a.categoryId === id);
        for (const a of relatedActivities) {
            await db.activities.delete(a.id);
        }
    };

    const addActivity = async (categoryId: string, name: string) => {
        const id = generateId();
        const catsActivities = activities.filter(a => a.categoryId === categoryId);
        const order = catsActivities.length;
        await db.activities.add({ id, categoryId, name, order });
    };

    const editActivity = async (id: string, name: string) => {
        await db.activities.update(id, { name });
    };

    const deleteActivity = async (id: string) => {
        await db.activities.delete(id);
    };

    return {
        categories,
        activities,
        addCategory,
        editCategory,
        deleteCategory,
        addActivity,
        editActivity,
        deleteActivity,
    };
}
