'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type ActivityDef } from '@/lib/db';

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

    const editActivity = async (
        id: string,
        patch: Partial<Pick<ActivityDef, 'name' | 'priority'>>
    ) => {
        await db.activities.update(id, patch);
    };

    const deleteActivity = async (id: string) => {
        await db.activities.delete(id);
    };

    // ── Drag-and-drop reorder functions ──
    const reorderCategories = async (fromId: string, toId: string, position: 'before' | 'after') => {
        const cats = await db.categories.orderBy('order').toArray();
        const fromIndex = cats.findIndex(c => c.id === fromId);
        const toIndex = cats.findIndex(c => c.id === toId);

        if (fromIndex < 0 || toIndex < 0 || fromId === toId) return;

        const newCats = [...cats];
        const [moved] = newCats.splice(fromIndex, 1);
        const newToIndex = newCats.findIndex(c => c.id === toId);
        const insertAt = position === 'before' ? newToIndex : newToIndex + 1;
        newCats.splice(insertAt, 0, moved);

        for (let i = 0; i < newCats.length; i++) {
            await db.categories.update(newCats[i].id, { order: i });
        }
    };

    const reorderActivities = async (fromId: string, toId: string, position: 'before' | 'after', categoryId: string) => {
        const categoryActivities = await db.activities.where('categoryId').equals(categoryId).sortBy('order');
        const fromIndex = categoryActivities.findIndex((a: ActivityDef) => a.id === fromId);
        const toIndex = categoryActivities.findIndex((a: ActivityDef) => a.id === toId);

        if (fromIndex < 0 || toIndex < 0 || fromId === toId) return;

        const newActs = [...categoryActivities];
        const [moved] = newActs.splice(fromIndex, 1);
        const newToIndex = newActs.findIndex(a => a.id === toId);
        const insertAt = position === 'before' ? newToIndex : newToIndex + 1;
        newActs.splice(insertAt, 0, moved);

        for (let i = 0; i < newActs.length; i++) {
            await db.activities.update(newActs[i].id, { order: i });
        }
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
        reorderCategories,
        reorderActivities
    };
}
