// lib/storage.ts
// Namespace-based localStorage wrapper to prevent cross-app data conflicts

export const NS = 'ikhtiar';

const key = (k: string) => `${NS}.${k}`;

/** Maps logical key names used by the app to their legacy (pre-namespacing) equivalents. */
const MIGRATION_MAP: Record<string, string> = {
    greeting: 'greetingName',
    theme: 'ikhtiar-langit-theme',
};

/**
 * Storage helper with automatic migration from old key names to new namespaced keys.
 * On first access, if a key doesn't exist under the new name but does under the legacy
 * name, the value is migrated transparently.
 */
export const storage = {
    get: (k: string): string | null => {
        // Try new namespaced key first
        let val = localStorage.getItem(key(k));

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