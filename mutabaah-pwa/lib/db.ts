import Dexie, { type Table } from 'dexie';
import { storage } from './storage';

export type LogStatus = 'done' | 'haid' | 'miss' | 'late';

export interface ActivityLog {
    id?: number;
    date: string; // YYYY-MM-DD
    activityId: string;
    completed: number; // 1 for true, 0 for false (better for indexing)
    status?: LogStatus; // Extended status for 4-state toggle
    synced: boolean; // Legacy field, kept for schema compatibility
    startPage?: number; // Halaman mulai untuk tilawah
    endPage?: number; // Halaman selesai untuk tilawah
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
        this.version(6).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed, status',
            activitySettings: 'activityId',
            planner: '++id, date, synced',
        }).upgrade(async tx => {
            // Migrasi data lama (belum punya field status) ke status baru.
            // completed === 1 → 'done', completed === 0 → dihapus (kosong = belum ada data).
            await tx.table('logs').toCollection().modify(log => {
                if (!log.status) {
                    log.status = log.completed === 1 ? 'done' : 'miss';
                }
            });
        });
        this.version(7).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed, status, startPage, endPage',
            activitySettings: 'activityId',
            planner: '++id, date, synced',
        }).upgrade(async tx => {
            // Tidak ada migrasi data yang diperlukan untuk field startPage dan endPage.
            // Data lama akan memiliki undefined untuk kedua field ini.
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
    storage.remove('greeting');
}
