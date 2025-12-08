/**
 * Section Animator Module
 * Handles all scroll-based animations using IntersectionObserver
 * Replaces AOS library for better performance
 * Respects user's reduced motion preference
 */

export class SectionAnimator {
    constructor() {
        this.animatedElements = new Map();
        this.observer = null;
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        // Listen for changes to reduced motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
        });
        
        // Create a single observer for all animations
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        // Setup animations with a slight delay to ensure DOM is ready
        requestAnimationFrame(() => {
            this.setupAnimations();
            document.body.classList.add('loaded');
        });
    }

    setupAnimations() {
        // If user prefers reduced motion, skip all animations
        if (this.prefersReducedMotion) {
            this.showAllElementsImmediately();
            return;
        }
        
        // Define animation configurations with snappier durations
        // Reduce durations on mobile for better performance
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const durationMultiplier = isMobile ? 0.7 : 1;
        const staggerMultiplier = isMobile ? 0.5 : 1;
        
        const animationConfig = [
            { selector: 'section[id]:not(#home)', animation: 'fade-up', duration: 400 * durationMultiplier, delay: 0 },
            { selector: '.section-header', animation: 'fade-down', duration: 350 * durationMultiplier, delay: 30 },
            { selector: '.skill-card', animation: 'fade-up', duration: 350 * durationMultiplier, delay: 30, stagger: 60 * staggerMultiplier },
            { selector: '.project-card', animation: 'fade-up', duration: 350 * durationMultiplier, delay: 30, stagger: 60 * staggerMultiplier },
            { selector: '.cert-card', animation: 'fade-up', duration: 350 * durationMultiplier, delay: 30, stagger: 60 * staggerMultiplier },
            { selector: '.stat-item', animation: 'fade-up', duration: 300 * durationMultiplier, delay: 0, stagger: 50 * staggerMultiplier },
            { selector: '.about-content', animation: 'fade-up', duration: 400 * durationMultiplier, delay: 30 },
            { selector: '.contact-wrapper', animation: 'fade-up', duration: 400 * durationMultiplier, delay: 30 }
        ];

        animationConfig.forEach(config => {
            const elements = document.querySelectorAll(config.selector);
            elements.forEach((el, index) => {
                // Skip hero section - should always be visible
                if (el.id === 'home') {
                    return;
                }

                const delay = config.stagger ? config.delay + (index * config.stagger) : config.delay;
                this.prepareElement(el, config.animation, config.duration, delay);
                this.observer.observe(el);
            });
        });
    }
    
    showAllElementsImmediately() {
        // For users who prefer reduced motion, show all elements without animation
        const selectors = [
            'section[id]',
            '.section-header',
            '.skill-card',
            '.project-card',
            '.cert-card',
            '.stat-item',
            '.about-content',
            '.contact-wrapper'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.visibility = 'visible';
            });
        });
    }

    prepareElement(element, animation, duration, delay) {
        // Store animation config
        this.animatedElements.set(element, { animation, duration, delay, animated: false });

        // Set initial hidden state based on animation type
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
        element.style.transitionDelay = `${delay}ms`;

        // Use smaller transform values for snappier feel
        // Even smaller on mobile for better performance
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const distance = isMobile ? 15 : 20;
        
        switch (animation) {
            case 'fade-up':
                element.style.transform = `translateY(${distance}px)`;
                break;
            case 'fade-down':
                element.style.transform = `translateY(-${distance}px)`;
                break;
            case 'fade-left':
                element.style.transform = `translateX(${distance}px)`;
                break;
            case 'fade-right':
                element.style.transform = `translateX(-${distance}px)`;
                break;
            default:
                element.style.transform = `translateY(${distance - 5}px)`;
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const config = this.animatedElements.get(entry.target);
                if (config && !config.animated) {
                    this.animateIn(entry.target);
                    config.animated = true;
                    this.observer.unobserve(entry.target);
                }
            }
        });
    }

    animateIn(element) {
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
        });
    }

    makeVisible(element) {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.transform = 'none';
        element.style.pointerEvents = 'auto';
    }

    // Public method to refresh animations (useful after dynamic content changes)
    refresh() {
        this.animatedElements.forEach((config, element) => {
            if (!config.animated) {
                this.observer.observe(element);
            }
        });
    }

    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animatedElements.clear();
    }
}
