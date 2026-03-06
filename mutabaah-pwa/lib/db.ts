import Dexie, { type Table } from 'dexie';

export interface ActivityLog {
    id?: number;
    date: string; // YYYY-MM-DD
    activityId: string;
    completed: number; // 1 for true, 0 for false (better for indexing)
    synced: boolean; // For future Supabase sync
}

export interface ActivitySetting {
    activityId: string;
    customName: string;
}

export class MutabaahDatabase extends Dexie {
    logs!: Table<ActivityLog>;
    activitySettings!: Table<ActivitySetting, string>;

    constructor() {
        super('MutabaahDB');
        this.version(4).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed',
            activitySettings: 'activityId',
        });
    }
}

export const db = new MutabaahDatabase();
