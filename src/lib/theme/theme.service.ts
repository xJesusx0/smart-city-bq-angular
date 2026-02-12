import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

/**
 * Theme Service for managing dark/light mode
 * Equivalent to mode-watcher from Svelte
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly THEME_KEY = 'theme-preference';

    /**
     * Current theme
     */
    readonly theme = signal<Theme>(this.getInitialTheme());

    constructor() {
        // Apply theme changes to document
        effect(() => {
            const currentTheme = this.theme();
            this.applyTheme(currentTheme);
        });
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme(): void {
        this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
    }

    /**
     * Set specific theme
     */
    setTheme(newTheme: Theme): void {
        this.theme.set(newTheme);
    }

    /**
     * Get initial theme from localStorage or system preference
     */
    private getInitialTheme(): Theme {
        if (typeof window === 'undefined') return 'light';

        const stored = localStorage.getItem(this.THEME_KEY) as Theme | null;
        if (stored) return stored;

        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    /**
     * Apply theme to document and save to localStorage
     */
    private applyTheme(newTheme: Theme): void {
        if (typeof document === 'undefined') return;

        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem(this.THEME_KEY, newTheme);
    }
}
