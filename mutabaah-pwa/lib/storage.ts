// lib/storage.ts
// Namespace-based localStorage wrapper to prevent cross-app data conflicts

export const NS = 'ramadhan-tracker';
/** Legacy namespace used before the project was renamed to "Ramadhan Tracker". */
const LEGACY_NS = 'mutabaah';
/** One-time migration flag so legacy keys are only copied once per browser. */
const MIGRATION_FLAG = `${NS}.__migrated_from_legacy__`;

const key = (k: string) => `${NS}.${k}`;

/** Maps logical key names used by the app to their legacy (pre-namespacing) equivalents. */
const MIGRATION_MAP: Record<string, string> = {
    greeting: 'greetingName',
    theme: 'mutabaah-theme',
    // amalan_unggulan: 'selected_amalan_unggulan',
};

/**
 * One-time migration from the legacy namespace ('mutabaah.*') to the new
 * namespace ('ramadhan-tracker.*'). Runs lazily on the first storage access.
 * Old keys are copied then removed so users keep their existing preferences.
 */
function migrateLegacyNamespace(): void {
    if (typeof window === 'undefined') return;
    try {
        if (localStorage.getItem(MIGRATION_FLAG) !== null) return;

        const legacyPrefix = `${LEGACY_NS}.`;
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith(legacyPrefix)) continue;
            const suffix = k.slice(legacyPrefix.length);
            const newKey = key(suffix);
            // Only copy if the new slot is still empty, so we never overwrite fresh data.
            if (localStorage.getItem(newKey) === null) {
                const val = localStorage.getItem(k);
                if (val !== null) localStorage.setItem(newKey, val);
            }
            toRemove.push(k);
        }
        toRemove.forEach(k => localStorage.removeItem(k));
        localStorage.setItem(MIGRATION_FLAG, '1');
    } catch {
        // localStorage may be unavailable (private mode / quota). Ignore silently.
    }
}

/**
 * Storage helper with automatic migration from old key names to new namespaced keys.
 * On first access, if a key doesn't exist under the new name but does under the legacy
 * name, the value is migrated transparently.
 */
export const storage = {
    get: (k: string): string | null => {
        // Run the one-time cross-namespace migration before reading.
        migrateLegacyNamespace();

        // Try new namespaced key first
        const val = localStorage.getItem(key(k));

        // If not found, attempt one-time migration from legacy key
        if (val === null) {
            const legacyKey = MIGRATION_MAP[k];
            if (legacyKey) {
                const oldVal = localStorage.getItem(legacyKey);
                if (oldVal !== null) {
                    // Copy old value into the new namespaced slot
                    localStorage.setItem(key(k), oldVal);
                    // Remove the legacy key so future reads hit the new path directly
                    localStorage.removeItem(legacyKey);
                    return oldVal;
                }
            }
        }

        return val;
    },

    set: (k: string, v: string): void => {
        localStorage.setItem(key(k), v);
    },

    remove: (k: string): void => {
        localStorage.removeItem(key(k));
    },

    clear: (): void => {
        // Clear only namespaced keys belonging to THIS app, leave other apps untouched
        const prefix = `${NS}.`;
        const toRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(prefix)) {
                toRemove.push(k);
            }
        }
        toRemove.forEach(k => localStorage.removeItem(k));
    },
};