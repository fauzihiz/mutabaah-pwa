import Dexie, { type Table } from 'dexie';

export interface ActivityLog {
    id?: number;
    date: string; // YYYY-MM-DD
    activityId: string;
    completed: number; // 1 for true, 0 for false
    synced: boolean;
}

export interface CategoryDef {
    id: string;
    name: string;
    order: number;
}

export interface ActivityDef {
    id: string;
    categoryId: string;
    name: string;
    order: number;
}

export interface PlannerNote {
    id?: number;
    date: string; // YYYY-MM-DD
    content: string;
    synced: boolean;
}

export class MutabaahDatabase extends Dexie {
    logs!: Table<ActivityLog>;
    categories!: Table<CategoryDef, string>;
    activities!: Table<ActivityDef, string>;
    planner!: Table<PlannerNote>;

    constructor() {
        super('FullCustomTrackerDB');
        this.version(6).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed',
            categories: 'id, order',
            activities: 'id, categoryId, order',
            planner: '++id, date, synced',
        });
    }
}

export const db = new MutabaahDatabase();

/**
 * Reset all locally stored data (IndexedDB tables + localStorage items).
 * After calling this, the page should be reloaded.
 */
export async function resetAllData(): Promise<void> {
    await db.logs.clear();
    await db.categories.clear();
    await db.activities.clear();
    await db.planner.clear();
    localStorage.removeItem('greetingName');
}
