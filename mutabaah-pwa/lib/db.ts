import Dexie, { type Table } from 'dexie';

export interface ActivityLog {
    id?: number;
    date: string; // YYYY-MM-DD
    activityId: string;
    completed: number; // 1 for true, 0 for false (better for indexing)
    synced: boolean; // For future Supabase sync
}

export class MutabaahDatabase extends Dexie {
    logs!: Table<ActivityLog>;

    constructor() {
        super('MutabaahDB');
        this.version(3).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed',
        });
    }
}

export const db = new MutabaahDatabase();
