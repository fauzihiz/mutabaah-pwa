'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, type DoaScript } from '@/lib/db';

/**
 * Hook Script Doa Saya — model single-script (maksimal 1 script tersimpan).
 * `script` = script terbaru (satu-satunya); simpan baru berarti mengganti yang lama.
 */
export function useDoaScripts() {
    // Maksimal satu script — ambil yang terbaru diubah (orderBy updatedAt desc)
    const scripts = useLiveQuery(
        () => db.doaScripts.orderBy('updatedAt').reverse().toArray(),
        []
    );
    const script: DoaScript | undefined = scripts?.[0];

    const saveScript = async (data: { judul: string; isi: string }, id?: number) => {
        const now = Date.now();
        if (id !== undefined) {
            const existing = await db.doaScripts.get(id);
            await db.doaScripts.put({
                id,
                judul: data.judul,
                isi: data.isi,
                createdAt: existing?.createdAt ?? now,
                updatedAt: now,
            });
            return id;
        }
        // Single-script: bersihkan record lama (termasuk sisa data testing), lalu simpan satu script
        await db.doaScripts.clear();
        return db.doaScripts.put({
            judul: data.judul,
            isi: data.isi,
            createdAt: now,
            updatedAt: now,
        });
    };

    const deleteScript = async (id: number) => {
        await db.doaScripts.delete(id);
    };

    const isLoading = scripts === undefined;

    return { script, saveScript, deleteScript, isLoading };
}