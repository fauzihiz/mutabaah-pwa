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

/**
 * Goal Planning — daftar goal pribadi bergaya S.M.A.R.T (fitur Goal Planning).
 * `judul` = Specific, `terukur` = Measurable, `usaha` = Achievable,
 * `motivasi` = Relevant, `tenggat` = Time-bound (YYYY-MM-DD).
 */
export interface GoalPlanning {
    id?: number;
    judul: string; // S — Specific: goal konkret
    terukur: string; // M — Measurable: angka/indikator keberhasilan
    usaha: string; // A — Achievable: langkah/ikhtiar konkret yang akan dilakukan
    motivasi: string; // R — Relevant: mengapa penting & untuk siapa
    tenggat: string; // T — Time-bound: YYYY-MM-DD
    done: boolean; // goal sudah tercapai (dicoret)
    doneAt?: number; // epoch ms saat ditandai tercapai
    createdAt: number; // epoch ms
    updatedAt: number; // epoch ms
}

export class RamadhanTrackerDatabase extends Dexie {
    logs!: Table<ActivityLog>;
    activitySettings!: Table<ActivitySetting, string>;
    planner!: Table<PlannerNote>;
    goals!: Table<GoalPlanning, number>;

    constructor() {
        super('RamadhanTrackerDB');
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
        // v8: tambah tabel goals (Goal Planning) — penambahan tabel saja, upgrade path aman
        this.version(8).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed, status, startPage, endPage',
            activitySettings: 'activityId',
            planner: '++id, date, synced',
            goals: '++id, done, createdAt',
        });
    }
}

export const db = new RamadhanTrackerDatabase();

/**
 * One-time migration from the legacy IndexedDB database ('MutabaahDB')
 * to the new database name ('RamadhanTrackerDB'). This runs automatically
 * on app startup and copies all tables from the old DB to the new one.
 * After successful migration, the legacy database is deleted.
 */
export async function migrateLegacyDb(): Promise<void> {
    if (typeof indexedDB === 'undefined') return;

    const LEGACY_DB_NAME = 'MutabaahDB';
    const FLAG_KEY = 'ramadhan-tracker.db.migrated';
    const canStore = typeof localStorage !== 'undefined';

    try {
        // Skip if this browser already completed the migration.
        if (canStore && localStorage.getItem(FLAG_KEY) === '1') return;

        // Skip if the new database already contains data (fresh installs or
        // subsequent visits after a successful copy).
        const existingCount = await db.logs.count();
        if (existingCount > 0) {
            if (canStore) localStorage.setItem(FLAG_KEY, '1');
            return;
        }

        // Detect the legacy DB. `indexedDB.databases()` isn't supported in every
        // browser, so fall back to optimistically opening it (an empty DB is
        // created and immediately removed if it never existed).
        let legacyExists = true;
        const idbAny = indexedDB as IDBFactory & {
            databases?: () => Promise<Array<{ name?: string }>>;
        };
        if (typeof idbAny.databases === 'function') {
            const dbs = await idbAny.databases();
            legacyExists = dbs.some(d => d.name === LEGACY_DB_NAME);
        }

        if (!legacyExists) {
            if (canStore) localStorage.setItem(FLAG_KEY, '1');
            return;
        }

        const legacy = new Dexie(LEGACY_DB_NAME);
        legacy.version(7).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed, status, startPage, endPage',
            activitySettings: 'activityId',
            planner: '++id, date, synced',
        });
        await legacy.open();

        const legacyLogs = await legacy.table('logs').toArray();
        const legacySettings = await legacy.table('activitySettings').toArray();
        const legacyPlanner = await legacy.table('planner').toArray();

        if (legacyLogs.length) await db.logs.bulkPut(legacyLogs);
        if (legacySettings.length) await db.activitySettings.bulkPut(legacySettings);
        if (legacyPlanner.length) await db.planner.bulkPut(legacyPlanner);

        legacy.close();
        await Dexie.delete(LEGACY_DB_NAME).catch(() => { });

        if (canStore) localStorage.setItem(FLAG_KEY, '1');
        console.log('[DB Migration] Migrated data from MutabaahDB to RamadhanTrackerDB');
    } catch (err) {
        console.warn('[DB Migration] Failed to migrate legacy database:', err);
    }
}

/**
 * Reset all locally stored data (IndexedDB tables + localStorage items).
 * After calling this, the page should be reloaded.
 */
export async function resetAllData(): Promise<void> {
    await db.logs.clear();
    await db.activitySettings.clear();
    await db.planner.clear();
    await db.goals.clear();
    storage.remove('greeting');
}
