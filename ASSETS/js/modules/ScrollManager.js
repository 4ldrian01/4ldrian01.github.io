/**
 * Scroll Manager Module
 * Handles scroll-based interactions including sticky header and active nav
 */

export class ScrollManager {
    constructor() {
        this.header = document.querySelector('header');
        this.sections = null;
        this.navLinks = null;
        this.mobileNavLinks = null;
        this.lastScrollY = 0;
        this.ticking = false;
        this.sectionObserver = null;
        this.activeSection = '';
        this.isScrollingProgrammatically = false;
        this.scrollTimeout = null;

        // Bind handlers once to allow removal during cleanup
        this.boundHandleScroll = this.handleScroll.bind(this);
        this.boundHandleResize = this.handleResize.bind(this);
        this.boundHandleNavClick = this.handleNavClick.bind(this);
    }

    init() {
        // Cache DOM queries for performance
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavLinks = document.querySelectorAll('.mobile-menu__link');

        // Debounced resize handler
        this.debouncedResize = this.debounce(this.boundHandleResize, 150);

        // Set up scroll/resize listeners for sticky header only
        window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
        window.addEventListener('resize', this.debouncedResize, { passive: true });

        // Listen for hash changes (browser back/forward, manual URL change)
        window.addEventListener('hashchange', () => this.handleHashChange(), false);

        // Listen for page load to handle hash on refresh
        window.addEventListener('load', () => this.handleHashChange(), false);

        // Use IntersectionObserver for section-based nav highlighting
        this.createSectionObserver();
        this.bindNavClicks();

        // Check URL hash on page load and set active section accordingly
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            this.handleHashChange();
        });

        // Initial state
        this.updateStickyHeader();
        this.updateActiveNav();
    }

    handleScroll() {
        this.lastScrollY = window.scrollY;
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateStickyHeader();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    handleResize() {
        this.updateStickyHeader();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    updateStickyHeader() {
        // Handle sticky header
        if (this.header) {
            this.header.classList.toggle('sticky-header', this.lastScrollY > 100);
        }
    }

    createSectionObserver() {
        if (!this.sections || !this.sections.length || typeof IntersectionObserver === 'undefined') {
            return;
        }

        // Track which sections are currently intersecting
        let intersectingSections = new Map();

        this.sectionObserver = new IntersectionObserver((entries) => {
            // Skip observer updates during programmatic scrolling
            if (this.isScrollingProgrammatically) {
                return;
            }

            entries.forEach(entry => {
                const sectionId = entry.target.getAttribute('id');
                
                if (entry.isIntersecting) {
                    // Store the section with its intersection ratio
                    intersectingSections.set(sectionId, entry.intersectionRatio);
                } else {
                    // Remove from tracking when not intersecting
                    intersectingSections.delete(sectionId);
                }
            });

            // Find the section with highest intersection ratio
            if (intersectingSections.size > 0) {
                let maxRatio = 0;
                let mostVisibleSection = '';

                intersectingSections.forEach((ratio, sectionId) => {
                    if (ratio > maxRatio) {
                        maxRatio = ratio;
                        mostVisibleSection = sectionId;
                    }
                });

                if (mostVisibleSection && mostVisibleSection !== this.activeSection) {
                    this.activeSection = mostVisibleSection;
                    this.updateActiveNav();
                    
                    // Update URL hash without scrolling
                    if (window.history.replaceState) {
                        window.history.replaceState(null, null, `#${mostVisibleSection}`);
                    }
                }
            }
        }, {
            // Adjust root margin to account for header height
            // Center zone: when section is roughly in the middle third of viewport
            rootMargin: '-20% 0px -60% 0px',
            threshold: [0, 0.25, 0.5, 0.75]
        });

        this.sections.forEach(section => this.sectionObserver.observe(section));
    }

    updateActiveNav() {
        const currentSection = this.activeSection || (this.sections && this.sections.length ? this.sections[0].id : '');

        if (!currentSection) {
            return;
        }

        const targetHash = `#${currentSection}`;

        this.navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === targetHash;
            link.classList.toggle('active', isActive);
        });

        this.mobileNavLinks.forEach(link => {
            const isActive = link.getAttribute('href') === targetHash;
            link.classList.toggle('active', isActive);
        });
    }

    bindNavClicks() {
        // Include logo link for consistent scroll behavior
        const logoLink = document.querySelector('.logo[href="#home"]');
        
        const combinedLinks = [
            ...(this.navLinks || []),
            ...(this.mobileNavLinks || []),
            ...(logoLink ? [logoLink] : [])
        ];

        combinedLinks.forEach(link => {
            link.addEventListener('click', this.boundHandleNavClick);
        });
    }

    handleNavClick(event) {
        const href = event.currentTarget.getAttribute('href');
        if (!href || !href.startsWith('#')) {
            return;
        }

        // Prevent default anchor behavior to avoid jiggly scroll
        event.preventDefault();

        const sectionId = href.substring(1);
        const targetSection = document.getElementById(sectionId);
        
        if (!targetSection) {
            return;
        }

        // Update active section immediately
        this.activeSection = sectionId;
        this.updateActiveNav();
        
        // Disable observer during manual navigation
        this.isScrollingProgrammatically = true;
        
        // Clear any existing scroll timeout
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        // Perform smooth scroll with proper offset calculation
        const scrollToSection = () => {
            // Get header height dynamically for responsive design
            const headerOffset = this.header ? this.header.offsetHeight + 20 : 100;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: Math.max(0, offsetPosition),
                behavior: 'smooth'
            });
            
            // Update URL hash without triggering hashchange event
            if (window.history.replaceState) {
                window.history.replaceState(null, null, href);
            }
        };

        // Execute scroll immediately
        requestAnimationFrame(scrollToSection);
        
        // Re-enable observer after scroll animation completes
        this.scrollTimeout = setTimeout(() => {
            this.isScrollingProgrammatically = false;
        }, 1500);
    }

    /**
     * Handle hash changes from URL (page refresh, browser back/forward, manual edit)
     * Works consistently across all screen sizes (mobile, tablet, desktop)
     */
    handleHashChange() {
        const hash = window.location.hash;
        
        if (hash && hash.length > 1) {
            // Hash exists (e.g., #about)
            const sectionId = hash.substring(1);
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                // Set the active section immediately
                this.activeSection = sectionId;
                this.updateActiveNav();
                
                // Disable observer during programmatic scrolling
                this.isScrollingProgrammatically = true;
                
                // Clear any existing scroll timeout
                if (this.scrollTimeout) {
                    clearTimeout(this.scrollTimeout);
                }
                
                // Scroll to section with proper offset for all screen sizes
                // Use requestAnimationFrame for better timing and multiple delays for reliability
                const scrollToSection = () => {
                    // Get header height dynamically for responsive design
                    // Account for different header heights on mobile vs desktop
                    const headerOffset = this.header ? this.header.offsetHeight + 20 : 100;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: 'smooth'
                    });
                };

                // Execute scroll with multiple timing strategies for reliability
                // Immediate attempt
                requestAnimationFrame(scrollToSection);
                
                // Delayed attempt for page refresh scenarios
                setTimeout(scrollToSection, 100);
                
                // Final attempt to ensure it works on slower devices
                setTimeout(scrollToSection, 300);
                
                // Re-enable observer after scroll animation completes
                // Smooth scroll typically takes 500-1000ms, so wait 1500ms to be safe
                this.scrollTimeout = setTimeout(() => {
                    this.isScrollingProgrammatically = false;
                }, 1500);
            }
        } else {
            // No hash, default to first section (home)
            if (this.sections && this.sections.length > 0) {
                this.activeSection = this.sections[0].id;
                this.updateActiveNav();
            }
        }
    }

    cleanup() {
        window.removeEventListener('scroll', this.boundHandleScroll);
        window.removeEventListener('resize', this.boundHandleResize);
        window.removeEventListener('hashchange', this.handleHashChange);

        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }

        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }

        if (this.navLinks) {
            this.navLinks.forEach(link => link.removeEventListener('click', this.boundHandleNavClick));
        }

        if (this.mobileNavLinks) {
            this.mobileNavLinks.forEach(link => link.removeEventListener('click', this.boundHandleNavClick));
        }
    }
}
