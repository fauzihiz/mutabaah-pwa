'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, PlannerNote } from '@/lib/db';

export function useMonthlyPlanner(year: number, month: number) {
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const notes = useLiveQuery(
        () => db.planner.where('date').between(startDate, endDate, true, true).toArray(),
        [year, month]
    );

    const saveNote = async (date: string, content: string) => {
        const existing = await db.planner.where({ date }).first();

        if (existing) {
            if (content.trim() === '') {
                await db.planner.delete(existing.id!);
            } else {
                await db.planner.update(existing.id!, { content, synced: false });
            }
        } else if (content.trim() !== '') {
            await db.planner.add({
                date,
                content,
                synced: false,
            });
        }
    };

    return {
        notes: notes || [],
        saveNote,
    };
}
