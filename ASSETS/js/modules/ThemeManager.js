export class ThemeManager {
    constructor() {
        this.themeToggles = []; // Array to hold multiple toggle buttons
        this.body = document.body;

        // Determine persisted preference if available
        this.persistedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;

        // Respect inline configuration first, then persisted preference, otherwise use device-specific defaults
        const inlineTheme = document.documentElement.getAttribute('data-theme');
        this.theme = inlineTheme || this.persistedTheme || this.getDefaultTheme();
    }

    init() {
        // Get all toggle buttons (mobile + desktop)
        this.themeToggles = document.querySelectorAll('.theme-toggle');

        // Apply theme (updates toggle button state to match)
        this.applyTheme(this.theme, { skipPersist: true, skipTransition: true });

        // Event listeners for all toggle buttons
        this.themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
    }

    applyTheme(theme, { skipPersist = false, skipTransition = false } = {}) {
        const root = document.documentElement;
        
        // Add transition class for smooth theme change (unless initial load)
        if (!skipTransition) {
            root.classList.add('theme-transitioning');
            
            // Remove transition class after animation completes
            setTimeout(() => {
                root.classList.remove('theme-transitioning');
            }, 400);
        }
        
        root.setAttribute('data-theme', theme);

        if (!skipPersist && typeof window !== 'undefined') {
            localStorage.setItem('theme', theme);
        }
        
        // Update all toggle buttons
        this.themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (theme === 'light') {
                toggle.classList.remove('active');
                if (icon) icon.className = 'fas fa-moon';
            } else {
                toggle.classList.add('active');
                if (icon) icon.className = 'fas fa-sun';
            }
        });
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'light' ? '#f0eee9' : '#000000');
        }
    }

    getDefaultTheme() {
        if (typeof window === 'undefined') {
            return 'dark';
        }

        // Treat devices <= 1023px width as tablet/mobile
        const prefersMobileLayout = window.matchMedia('(max-width: 1023px)').matches;
        return prefersMobileLayout ? 'light' : 'dark';
    }
}
