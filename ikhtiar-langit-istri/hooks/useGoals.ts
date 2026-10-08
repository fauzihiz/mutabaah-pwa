'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type GoalPlanning } from '@/lib/db';

export type GoalInput = Pick<GoalPlanning, 'judul' | 'terukur' | 'usaha' | 'motivasi' | 'tenggat'>;

/**
 * Hook Goal Planning — daftar multi-goal bergaya S.M.A.R.T.
 * Urutan: goal berjalan (tenggat terdekat dulu) di atas,
 * goal tercapai (doneAt terbaru) di bawah sebagai rekam jejak.
 */
export function useGoals() {
    const goals = useLiveQuery(
        () => db.goals.orderBy('createdAt').toArray(),
        []
    );

    const saveGoal = async (data: GoalInput, id?: number) => {
        const now = Date.now();
        if (id !== undefined) {
            const existing = await db.goals.get(id);
            await db.goals.put({
                id,
                judul: data.judul,
                terukur: data.terukur,
                usaha: data.usaha,
                motivasi: data.motivasi,
                tenggat: data.tenggat,
                done: existing?.done ?? false,
                doneAt: existing?.doneAt,
                createdAt: existing?.createdAt ?? now,
                updatedAt: now,
            });
            return id;
        }
        return db.goals.put({
            judul: data.judul,
            terukur: data.terukur,
            usaha: data.usaha,
            motivasi: data.motivasi,
            tenggat: data.tenggat,
            done: false,
            createdAt: now,
            updatedAt: now,
        });
    };

    const deleteGoal = async (id: number) => {
        await db.goals.delete(id);
    };

    /** Tandai tercapai (coret) — klik lagi untuk mengembalikan goal ke aktif. */
    const toggleDone = async (id: number, done: boolean) => {
        const now = Date.now();
        // modify() dipakai agar doneAt bisa benar-benar dihapus (undefined) saat di-uncheck
        await db.goals.modify(id, {
            done,
            doneAt: done ? now : undefined,
            updatedAt: now,
        });
    };

    // Pisahkan & urutkan: berjalan (tenggat terdekat) di atas, tercapai (terbaru) di bawah
    const sorted: GoalPlanning[] = [...(goals ?? [])].sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.done) return (b.doneAt ?? 0) - (a.doneAt ?? 0);
        // Goal tanpa tenggat diletakkan paling bawah di antara goal berjalan
        if (!a.tenggat && !b.tenggat) return b.createdAt - a.createdAt;
        if (!a.tenggat) return 1;
        if (!b.tenggat) return -1;
        return a.tenggat.localeCompare(b.tenggat);
    });

    const activeCount = sorted.filter(g => !g.done).length;
    const doneCount = sorted.length - activeCount;

    const isLoading = goals === undefined;

    return { goals: sorted, activeCount, doneCount, saveGoal, deleteGoal, toggleDone, isLoading };
}