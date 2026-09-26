import Dexie, { type Table } from 'dexie';

export interface Child {
    id?: number;
    name: string;
}

export interface ActivityLog {
    id?: number;
    date: string; // YYYY-MM-DD
    activityId: string;
    completed: number; // 1 for true, 0 for false (better for indexing)
    synced: boolean; // Legacy field, kept for schema compatibility
    childId?: number; // Optional for backward compatibility
}

export interface ActivitySetting {
    activityId: string;
    customName: string;
}

export interface PlannerNote {
    id?: number;
    date: string; // YYYY-MM-DD
    content: string;
    synced: boolean;
}

export class MutabaahDatabase extends Dexie {
    logs!: Table<ActivityLog>;
    activitySettings!: Table<ActivitySetting, string>;
    planner!: Table<PlannerNote>;
    children!: Table<Child>;

    constructor() {
        super('MutabaahDB');
        // Keep version 5 for old schema, upgrade to 6 for children
        this.version(5).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed',
            activitySettings: 'activityId',
            planner: '++id, date, synced',
        });
        this.version(6).stores({
            logs: '++id, [date+activityId+childId], date, activityId, synced, completed, childId',
            activitySettings: 'activityId',
            planner: '++id, date, synced',
            children: '++id, name',
        }).upgrade(tx => {
            return tx.table('logs').toCollection().modify(log => {
                if (log.childId === undefined) {
                    log.childId = 1; // Default to first child for existing records
                }
            });
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
    await db.activitySettings.clear();
    await db.planner.clear();
    await db.children.clear();
    localStorage.removeItem('greetingName');
}
