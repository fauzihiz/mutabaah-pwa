'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    toggleTheme: () => { },
    isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('mutabaah-theme') as Theme | null;
        const preferred = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(preferred);
        setMounted(true);
    }, []);

    // Apply class to <html> whenever theme changes — batched with rAF to avoid forced reflow
    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        requestAnimationFrame(() => {
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        });
        localStorage.setItem('mutabaah-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
