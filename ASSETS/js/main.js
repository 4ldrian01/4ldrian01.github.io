/**
 * ============================================================================
 * MAIN APPLICATION ENTRY POINT - main.js
 * ============================================================================
 * 
 * PURPOSE:
 * Initializes all modules and manages the portfolio application lifecycle.
 * This is the single entry point for the application, loaded as an ES module.
 * 
 * ARCHITECTURE:
 * The application uses a phased initialization approach:
 * 
 * Phase 1 (Critical): UI components needed immediately
 *   - ScrollManager: Sticky header and navigation highlighting
 *   - HamburgerMenu: Mobile navigation functionality
 *   - ThemeManager: Light/Dark theme handling
 *   - FormManager: Contact form validation
 * 
 * Phase 2 (Animations): Visual effects after initial paint
 *   - SectionAnimator: Scroll-triggered animations
 *   - TextAnimation: Hero typing effect
 *   - StatsAnimation: Counter animations
 * 
 * Phase 3 (Interactive): User interaction enhancements
 *   - PortfolioFilter: Project category filtering
 *   - ProjectModal: Project detail modals
 *   - CertificationNav: Certification carousel
 * 
 * MODULE DEPENDENCIES:
 * All modules are imported from ./modules/index.js (barrel export)
 * This provides cleaner imports and better encapsulation.
 * 
 * ============================================================================
 */

// ============================================================================
// MODULE IMPORTS
// ============================================================================

/**
 * Import all modules from the barrel export file
 * This provides cleaner, more maintainable imports
 */
import {
    ScrollManager,
    FormManager,
    StatsAnimation,
    TextAnimation,
    PortfolioFilter,
    CertificationNav,
    HamburgerMenu,
    SectionAnimator,
    ProjectModal,
    ThemeManager
} from './modules/index.js';

// NOTE: ImageLoader module was previously imported but is temporarily disabled
// due to observed performance bottlenecks during initial paint. If you still
// need those features, re-enable once the module is optimized or replace with
// native loading="lazy" usage.

// ============================================================================
// PORTFOLIO APPLICATION CLASS
// ============================================================================

/**
 * Main Portfolio Application Controller
 * 
 * Manages the initialization lifecycle of all modules and provides
 * a central cleanup mechanism for proper resource management.
 * 
 * @class PortfolioApp
 */
class PortfolioApp {
    /**
     * Creates a new PortfolioApp instance
     * Initializes empty modules container and initialization flag
     */
    constructor() {
        /** @type {Object.<string, Object>} Container for all initialized modules */
        this.modules = {};
        
        /** @type {boolean} Prevents double initialization */
        this.isInitialized = false;
    }

    /**
     * Main initialization method
     * Orchestrates the phased initialization of all modules
     * 
     * @returns {void}
     */
    init() {
        // Prevent double initialization
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Phase 1: Critical UI components (immediate - needed for initial render)
        this.initCriticalModules();

        // Phase 2 & 3: Animations and interactive components (deferred to after paint)
        requestAnimationFrame(() => {
            this.initAnimationModules();
            this.initInteractiveModules();
            this.updateCopyrightYear();
        });

        // Setup cleanup handler for page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    /**
     * PHASE 1: Initialize critical UI modules
     * These modules are needed immediately for core functionality
     * 
     * @private
     * @returns {void}
     */
    initCriticalModules() {
        // Scroll handling - sticky header and nav highlighting
        this.modules.scrollManager = new ScrollManager();
        this.modules.scrollManager.init();

        // Mobile hamburger menu
        this.modules.hamburgerMenu = new HamburgerMenu();
        this.modules.hamburgerMenu.init();

        // Theme Manager - handles light/dark mode
        this.modules.themeManager = new ThemeManager();
        this.modules.themeManager.init();

        // Contact form validation and submission
        this.modules.formManager = new FormManager();
        this.modules.formManager.init();
    }

    /**
     * PHASE 2: Initialize animation modules
     * Deferred to allow initial paint to complete first
     * 
     * @private
     * @returns {void}
     */
    initAnimationModules() {
        // Section scroll animations (unified animator replaces AOS)
        this.modules.sectionAnimator = new SectionAnimator();
        this.modules.sectionAnimator.init();

        // Hero text typing effect
        this.modules.textAnimation = new TextAnimation();
        this.modules.textAnimation.init();

        // Stats counter animation
        this.modules.statsAnimation = new StatsAnimation();
        this.modules.statsAnimation.init();
    }

    /**
     * PHASE 3: Initialize interactive modules
     * User interaction enhancements loaded after animations
     * 
     * @private
     * @returns {void}
     */
    initInteractiveModules() {
        // Portfolio project filtering
        this.modules.portfolioFilter = new PortfolioFilter();
        this.modules.portfolioFilter.init();

        // Project detail modal
        this.modules.projectModal = new ProjectModal();
        this.modules.projectModal.init();

        // Certification carousel navigation
        this.modules.certificationNav = new CertificationNav();
        this.modules.certificationNav.init();

        // Soft skills toggle functionality (inline, no separate module)
        this.initSoftSkillsToggle();
        
        // Image loading state detection for project cards
        this.initImageLoadingStates();
        
        // Profile picture overlay functionality
        this.initProfilePictureOverlay();
    }

    /**
     * Initializes image loading state detection for project cards
     * Adds 'loaded' class when images finish loading for CSS transitions
     * 
     * @private
     * @returns {void}
     */
    initImageLoadingStates() {
        const projectImages = document.querySelectorAll('.project-img');
        
        projectImages.forEach(img => {
            const container = img.closest('.project-img-container');
            
            // Check if image is already loaded (from cache)
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('loaded');
                if (container) container.classList.add('loaded');
            } else {
                // Add load event listener for async loading
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    if (container) container.classList.add('loaded');
                });
                
                // Handle error state - hide loading animation on error
                img.addEventListener('error', () => {
                    if (container) container.classList.add('loaded');
                });
            }
        });
    }

    /**
     * Initializes profile picture clickable overlay
     * Allows users to view enlarged profile picture similar to certificates
     * 
     * @private
     * @returns {void}
     */
    initProfilePictureOverlay() {
        const profileImage = document.querySelector('.about-image');
        if (!profileImage) return;

        // Create overlay structure
        const overlay = document.createElement('div');
        overlay.className = 'profile-overlay hidden';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Profile picture preview');

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'profile-overlay__img-wrapper';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'profile-overlay__close';
        closeBtn.setAttribute('aria-label', 'Close profile picture preview');
        closeBtn.innerHTML = '&times;';

        const overlayImg = document.createElement('img');
        overlayImg.className = 'profile-overlay__img';
        overlayImg.alt = 'Profile picture preview';

        imgWrapper.appendChild(overlayImg);
        overlay.appendChild(closeBtn);
        overlay.appendChild(imgWrapper);
        document.body.appendChild(overlay);

        const hideOverlay = () => {
            // Unlock scroll immediately for instant responsiveness
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            // Then trigger fade out animation
            requestAnimationFrame(() => {
                overlay.classList.add('hidden');
            });
        };

        const showOverlay = () => {
            overlayImg.src = profileImage.src;
            overlayImg.alt = profileImage.alt || 'Profile picture preview';
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        };

        // Make profile image clickable
        profileImage.style.cursor = 'zoom-in';
        profileImage.addEventListener('click', showOverlay);

        // Close overlay handlers
        closeBtn.addEventListener('click', hideOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) hideOverlay();
        });
        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('hidden') && e.key === 'Escape') hideOverlay();
        });
    }

    /**
     * Initializes the soft skills toggle button functionality
     * Handles expand/collapse behavior with responsive support
     * 
     * @private
     * @returns {void}
     */
    initSoftSkillsToggle() {
        const toggleBtn = document.querySelector('.soft-skills-toggle');
        const skillsList = document.querySelector('.soft-skills-list');
        
        if (!toggleBtn || !skillsList) return;

        // Cache child elements
        const toggleText = toggleBtn.querySelector('.toggle-text');
        const icon = toggleBtn.querySelector('i');

        /**
         * Helper function to set expanded state
         * @param {boolean} expanded - Whether list should be expanded
         */
        const setExpanded = (expanded) => {
            toggleBtn.setAttribute('aria-expanded', String(expanded));
            skillsList.classList.toggle('expanded', expanded);
            
            if (toggleText) {
                toggleText.textContent = expanded ? 'Show Less' : 'Show More';
            }
            
            if (icon) {
                icon.style.transform = expanded ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        };

        // Set initial state based on screen size
        if (window.matchMedia('(min-width: 1024px)').matches) {
            skillsList.classList.add('expanded'); // Always expanded on desktop
        } else {
            setExpanded(false); // Collapsed on mobile/tablet
        }

        // Toggle button click handler
        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            setExpanded(!isExpanded);
        });

        // Debounced resize handler
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.matchMedia('(min-width: 1024px)').matches) {
                    skillsList.classList.add('expanded');
                } else {
                    // Keep collapsed on mobile unless user has expanded
                    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                    if (!isExpanded) {
                        skillsList.classList.remove('expanded');
                    }
                }
            }, 150);
        };

        // Handle responsive behavior on resize
        window.addEventListener('resize', handleResize, { passive: true });
    }

    /**
     * Updates the copyright year in the footer
     * Automatically sets to current year for maintenance-free operation
     * 
     * @private
     * @returns {void}
     */
    updateCopyrightYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Cleanup method called before page unload
     * Properly disposes of all modules to prevent memory leaks
     * 
     * @private
     * @returns {void}
     */
    cleanup() {
        // Iterate through all modules and call their cleanup methods
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.cleanup === 'function') {
                module.cleanup();
            }
        });
    }
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

/**
 * Initialize the application when DOM is fully loaded
 * Creates and starts the PortfolioApp instance
 */
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.init();
});
