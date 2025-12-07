/**
 * Hamburger Menu Module
 * Handles mobile navigation menu functionality with full keyboard accessibility
 */

export class HamburgerMenu {
    constructor() {
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.toggle = document.querySelector('.mobile-menu__toggle');
        this.closeBtn = document.querySelector('.mobile-menu__close');
        this.menuContainer = document.querySelector('.mobile-menu__container');
        this.menuLinks = document.querySelectorAll('.mobile-menu__link');
        this.currentFocusIndex = -1;
    }

    init() {
        if (!this.mobileMenu || !this.toggle || !this.menuContainer) {
            console.warn('Mobile menu elements not found');
            return;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Toggle button click - instant response
        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close button click - FIXED: direct event with stopPropagation
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMenu();
            });
        }

        // Close on outside click (click on overlay)
        this.mobileMenu.addEventListener('click', (e) => {
            // Only close if clicking directly on the overlay (not the container)
            if (e.target === this.mobileMenu) {
                this.closeMenu();
            }
        });

        // Keyboard navigation for mobile menu
        document.addEventListener('keydown', (e) => {
            if (!this.mobileMenu.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    e.preventDefault();
                    this.closeMenu();
                    this.toggle.focus(); // Return focus to toggle button
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.focusNextLink();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.focusPreviousLink();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.focusFirstLink();
                    break;
                case 'End':
                    e.preventDefault();
                    this.focusLastLink();
                    break;
                case 'Tab':
                    // Trap focus within menu
                    this.handleTabKey(e);
                    break;
            }
        });

        // Close on menu link click with immediate visual feedback
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't manipulate active class here - let ScrollManager handle it
                // Just close the menu after a brief delay for smooth transition
                setTimeout(() => {
                    this.closeMenu();
                }, 100);
            });
        });

        // Close on window resize (if switching to desktop)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1023 && this.mobileMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            }, 250);
        });
    }

    // Arrow key navigation helpers
    focusNextLink() {
        this.currentFocusIndex = (this.currentFocusIndex + 1) % this.menuLinks.length;
        this.menuLinks[this.currentFocusIndex].focus();
    }

    focusPreviousLink() {
        this.currentFocusIndex = this.currentFocusIndex <= 0 
            ? this.menuLinks.length - 1 
            : this.currentFocusIndex - 1;
        this.menuLinks[this.currentFocusIndex].focus();
    }

    focusFirstLink() {
        this.currentFocusIndex = 0;
        this.menuLinks[this.currentFocusIndex].focus();
    }

    focusLastLink() {
        this.currentFocusIndex = this.menuLinks.length - 1;
        this.menuLinks[this.currentFocusIndex].focus();
    }

    // Focus trap for Tab key
    handleTabKey(e) {
        const focusableElements = this.menuContainer.querySelectorAll(
            'button, a[href], [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab: go backwards
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab: go forwards
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    toggleMenu() {
        const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
        const nextState = !isExpanded;

        this.toggle.setAttribute('aria-expanded', String(nextState));
        this.mobileMenu.classList.toggle('active', nextState);
        
        // Body scroll lock for better UX
        if (nextState) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('menu-open');
            // Focus first menu link when opening
            this.currentFocusIndex = 0;
            setTimeout(() => {
                this.menuLinks[0]?.focus();
            }, 200); // Wait for animation
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');
            this.currentFocusIndex = -1;
        }
    }

    closeMenu() {
        if (!this.mobileMenu.classList.contains('active')) return;

        this.toggle.setAttribute('aria-expanded', 'false');
        this.mobileMenu.classList.remove('active');
        
        // Remove body scroll lock
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        this.currentFocusIndex = -1;
    }
}
