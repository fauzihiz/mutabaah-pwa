import Dexie, { type Table } from 'dexie';
import { storage } from './storage';

export interface Child {
    id?: number;
    name: string;
}

export interface ActivityLog {
    id?: number;
    date: string; // YYYY-MM-DD
    activityId: string;
    stickerValue: number; // 0 = empty, 1-6 = primary, 7-10 = supporting
    synced: boolean; // Legacy field, kept for schema compatibility
    childId?: number; // Optional for backward compatibility
}

export interface ActivitySetting {
    activityId: string;
    customName: string;
}

export interface CustomActivity {
    id?: number;
    childId: number;
    name: string;
    category: string; // one of the 10 ActivityCategory values
}

export interface PlannerNote {
    id?: number;
    date: string; // YYYY-MM-DD
    content: string;
    synced: boolean;
}

export interface ActivityFlag {
    id?: number;
    activityId: string;
    flag: number; // 7-10 (supporting sticker value)
    childId: number;
}

export class ParentingTrackerDatabase extends Dexie {
    logs!: Table<ActivityLog>;
    activitySettings!: Table<ActivitySetting, string>;
    planner!: Table<PlannerNote>;
    children!: Table<Child>;
    customActivities!: Table<CustomActivity, number>;
    flags!: Table<ActivityFlag>;

    constructor() {
        super('ParentingTrackerDatabase');
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
        // Version 7: add customActivities table
        this.version(7).stores({
            customActivities: '++id, childId, [childId+category+name]',
        });
        // Version 8: replace `completed` with `stickerValue` (0 = empty, 1-10 = stickers)
        this.version(8).stores({
            logs: '++id, [date+activityId+childId], date, activityId, synced, stickerValue, childId',
        }).upgrade(tx => {
            return tx.table('logs').toCollection().modify(log => {
                // Migrate legacy `completed` flag to the new sticker code.
                // completed === 1 → "SUDAH BISA" (1); everything else → empty (0).
                if (log.stickerValue === undefined) {
                    log.stickerValue = log.completed === 1 ? 1 : 0;
                }
                delete log.completed;
            });
        });
        // Version 9: add flags table for supporting stickers (7-10)
        this.version(9).stores({
            flags: '++id, [activityId+flag+childId], activityId, flag, childId',
        }).upgrade(tx => {
            // Migrate old supporting sticker data (7-10) from logs to flags table
            return tx.table('logs').toCollection().modify(log => {
                if (log.stickerValue >= 7 && log.stickerValue <= 10) {
                    const flag = log.stickerValue;
                    tx.table('flags').add({
                        activityId: log.activityId,
                        flag,
                        childId: log.childId
                    });
                }
            });
        });
    }
}

export const db = new ParentingTrackerDatabase();

/**
 * Reset all locally stored data (IndexedDB tables + localStorage items).
 * After calling this, the page should be reloaded.
 */
export async function resetAllData(): Promise<void> {
    await db.logs.clear();
    await db.activitySettings.clear();
    await db.planner.clear();
    await db.children.clear();
    await db.customActivities.clear();
    await db.flags.clear();
    storage.remove('greeting');
}
