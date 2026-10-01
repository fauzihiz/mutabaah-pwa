import Dexie, { type Table } from 'dexie';

/** Kode status yang disimpan di `ActivityLog.completed`. */
export type LogStatus = 0 | 1 | 2 | 3;

export const STATUS = {
    /** Belum dikerjakan */
    EMPTY: 0,
    /** Selesai (tepat waktu) */
    DONE: 1,
    /** Selesai tapi tidak tepat waktu — hanya kategori Sholat Tepat Waktu */
    LATE: 2,
    /** Haid / berhalangan */
    HAID: 3,
} as const;

/** Status yang dihitung "selesai" untuk statistik (tepat waktu maupun telat). */
export function isDone(status: number): boolean {
    return status === STATUS.DONE || status === STATUS.LATE;
}

export interface ActivityLog {
    id?: number;
    date: string; // YYYY-MM-DD
    activityId: string;
    completed: LogStatus; // Lihat STATUS di atas (better for indexing)
    synced: boolean; // Legacy field, kept for schema compatibility
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

    constructor() {
        super('MutabaahDB');
        this.version(5).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed',
            activitySettings: 'activityId',
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
    await db.activitySettings.clear();
    await db.planner.clear();
    localStorage.removeItem('greetingName');
}
