import Dexie, { type Table } from 'dexie';
import { storage } from './storage';

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
    priority?: 'high' | 'medium' | 'low' | null;
}

export interface PlannerNote {
    id?: number;
    date: string; // YYYY-MM-DD
    content: string;
    synced: boolean;
}

/** Goal Planning — daftar goal pribadi bergaya S.M.A.R.T */
export interface GoalPlanning {
    id?: number;
    judul: string; // S — Specific: goal konkret (mis. "Dapatkan uang 1 juta dalam 1 minggu")
    terukur: string; // M — Measurable: angka/indikator keberhasilan
    usaha: string; // A — Achievable: langkah/ikhtiar konkret yang akan dilakukan
    motivasi: string; // R — Relevant: mengapa penting & untuk siapa
    tenggat: string; // T — Time-bound: YYYY-MM-DD
    done: boolean; // goal sudah tercapai (dicoret)
    doneAt?: number; // epoch ms saat ditandai tercapai
    createdAt: number; // epoch ms
    updatedAt: number; // epoch ms
}

/** Script doa pribadi yang ditulis & disimpan user (fitur Script Doa Saya). */
export interface DoaScript {
    id?: number;
    judul: string;
    isi: string;
    createdAt: number; // epoch ms
    updatedAt: number; // epoch ms
}

export class ActionPlannerDatabase extends Dexie {
    logs!: Table<ActivityLog>;
    categories!: Table<CategoryDef, string>;
    activities!: Table<ActivityDef, string>;
    planner!: Table<PlannerNote>;
    doaScripts!: Table<DoaScript, number>;
    goals!: Table<GoalPlanning, number>;

    constructor() {
        super('ActionPlannerDB');
        this.version(7).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed',
            categories: 'id, order',
            activities: 'id, categoryId, order',
            planner: '++id, date, synced',
        });
        this.version(8).stores({
            logs: '++id, [date+activityId], date, activityId, synced, completed',
            categories: 'id, order',
            activities: 'id, categoryId, order',
            planner: '++id, date, synced',
            doaScripts: '++id, updatedAt',
            goals: '++id, done, createdAt',
        });
    }
}

export const db = new ActionPlannerDatabase();

/** Reset all locally stored data (IndexedDB tables + localStorage items). */
/* After calling this, the page should be reloaded. */
export async function resetAllData(): Promise<void> {
    await db.logs.clear();
    await db.categories.clear();
    await db.activities.clear();
    await db.planner.clear();
    await db.doaScripts.clear();
    await db.goals.clear();
    storage.remove('greeting');
}
