/**
 * Text Animation Module
 * Typing effect for the hero section changing text
 * 
 * Features:
 * - Accessible: Respects prefers-reduced-motion, includes aria-live
 * - Performant: Pauses when tab is backgrounded, proper lifecycle control
 * - UX Optimized: Reserves width to prevent layout shifts on desktop/laptop (1440px/1024px)
 * - Configurable: Accepts options or data attributes for texts and timing
 * - Robust: Validates inputs, avoids negative indices, proper cleanup
 */

export class TextAnimation {
    /**
     * @param {Object} options - Configuration options
     * @param {string} [options.selector='.changing-text'] - CSS selector for the target element
     * @param {string[]} [options.texts] - Array of texts to cycle through (overrides data-texts attribute)
     * @param {number} [options.typingSpeed=100] - Milliseconds per character when typing
     * @param {number} [options.deletingSpeed=50] - Milliseconds per character when deleting
     * @param {number} [options.pauseDuration=1500] - Milliseconds to pause after typing complete word
     * @param {number} [options.randomVariance=25] - Random variance (+/-) for natural typing feel
     * @param {boolean} [options.loop=true] - Whether to loop through texts indefinitely
     */
    constructor(options = {}) {
        // Configuration
        this.selector = options.selector || '.changing-text';
        this.el = document.querySelector(this.selector);

        // Load texts from options, data attribute, or use defaults
        // Use full, clear labels for desktop clarity
        const dataTexts = this.el?.getAttribute('data-texts');
        const defaultTexts = ['Network Engineer', 'Developer', 'System Administrator'];
        
        if (options.texts && Array.isArray(options.texts) && options.texts.length > 0) {
            this.texts = options.texts;
        } else if (dataTexts) {
            try {
                const parsed = JSON.parse(dataTexts);
                this.texts = Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultTexts;
            } catch (e) {
                console.warn('TextAnimation: Invalid JSON in data-texts attribute. Using defaults.');
                this.texts = defaultTexts;
            }
        } else {
            this.texts = defaultTexts;
        }

        // Validate texts array (guard for empty or non-array)
        if (!Array.isArray(this.texts) || this.texts.length === 0) {
            console.warn('TextAnimation: "texts" must be a non-empty array. Using fallback.');
            this.texts = ['Developer'];
        }

        // Timing configuration
        this.typingSpeed = options.typingSpeed ?? 100;
        this.deletingSpeed = options.deletingSpeed ?? 50;
        this.pauseDuration = options.pauseDuration ?? 1500;
        this.randomVariance = options.randomVariance ?? 25;
        this.loop = options.loop ?? true;

        // Animation state - always keep charIndex >= 0 (fix off-by-one bug)
        this.currentIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        // Lifecycle control (fix timer leak)
        this._timeoutId = null;
        this._isRunning = false;

        // Measurement helpers for precise cursor positioning
        this._measureSpan = null;
        this._textWidthCache = new Map();

        // Check for reduced motion preference (accessibility)
        this.prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

        // Bind handlers for proper cleanup
        this._onVisibilityChange = this._onVisibilityChange.bind(this);
        this._onReducedMotionChange = this._onReducedMotionChange.bind(this);
        
        // Store media query for cleanup
        this._reducedMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    }

    /**
     * Initialize the text animation
     */
    init() {
        if (!this.el) {
            console.warn(`TextAnimation: Element "${this.selector}" not found.`);
            return;
        }

        // Accessibility: Add aria attributes for screen readers
        this.el.setAttribute('aria-live', 'polite');
        this.el.setAttribute('aria-atomic', 'true');
        this.el.setAttribute('role', 'status');

        // Add styling class for cursor effect
        this.el.classList.add('typing-cursor');
        
        // Add class to prevent layout shift (CSS handles width reservation)
        this.el.classList.add('typing-text-reserved');

        // Reserve width to prevent layout shifts on 1440px/1024px desktop views
        this._reserveWidth();

        // If user prefers reduced motion, show static text and exit
        if (this.prefersReducedMotion) {
            this.el.textContent = this.texts[this.currentIndex];
            this.el.classList.remove('typing-cursor'); // Remove blinking cursor
            this.el.classList.add('typing-reduced-motion');
            return;
        }

        // Start animation
        this.start();

        // Pause when tab is hidden (performance optimization)
        document.addEventListener('visibilitychange', this._onVisibilityChange);

        // Listen for reduced motion preference changes
        this._reducedMotionQuery?.addEventListener?.('change', this._onReducedMotionChange);
    }

    /**
     * Start the typing animation
     */
    start() {
        if (this._isRunning || this.prefersReducedMotion) return;
        this._isRunning = true;
        this._tick();
    }

    /**
     * Stop the typing animation
     */
    stop() {
        this._isRunning = false;
        if (this._timeoutId !== null) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }

    /**
     * Destroy the animation and clean up all resources
     */
    destroy() {
        this.stop();
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this._onVisibilityChange);
        this._reducedMotionQuery?.removeEventListener?.('change', this._onReducedMotionChange);

        // Clean up element attributes and classes
        if (this.el) {
            this.el.classList.remove('typing-cursor', 'typing-text-reserved', 'typing-reduced-motion');
            this.el.removeAttribute('aria-live');
            this.el.removeAttribute('aria-atomic');
            this.el.removeAttribute('role');
            this.el.style.minWidth = '';
        }

        if (this._measureSpan?.parentNode) {
            this._measureSpan.parentNode.removeChild(this._measureSpan);
        }
        this._measureSpan = null;
        this._textWidthCache.clear();
    }

    /**
     * Handle visibility change - pause when tab is hidden
     * @private
     */
    _onVisibilityChange() {
        if (document.hidden) {
            this.stop();
        } else if (!this.prefersReducedMotion) {
            this.start();
        }
    }

    /**
     * Handle reduced motion preference change
     * @private
     */
    _onReducedMotionChange(event) {
        this.prefersReducedMotion = event.matches;
        
        if (this.prefersReducedMotion) {
            this.stop();
            if (this.el) {
                this.el.textContent = this.texts[this.currentIndex];
                this.el.classList.remove('typing-cursor');
                this.el.classList.add('typing-reduced-motion');
            }
        } else {
            if (this.el) {
                this.el.classList.add('typing-cursor');
                this.el.classList.remove('typing-reduced-motion');
            }
            this.start();
        }
    }

    /**
     * Main animation tick - handles typing and deleting
     * @private
     */
    _tick() {
        if (!this._isRunning || !this.el) return;

        const currentText = String(this.texts[this.currentIndex] || '');

        // Update charIndex - always keep >= 0 (fixed off-by-one bug)
        if (!this.isDeleting) {
            // Typing: increment charIndex up to text length
            this.charIndex = Math.min(this.charIndex + 1, currentText.length);
        } else {
            // Deleting: decrement charIndex down to 0
            this.charIndex = Math.max(this.charIndex - 1, 0);
        }

        // Update displayed text
        this.el.textContent = currentText.substring(0, this.charIndex);

        // Calculate delay with random variance for natural typing feel
        let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        const variance = Math.round((Math.random() * 2 - 1) * this.randomVariance);
        delay = Math.max(10, delay + variance);

        // State transitions
        if (!this.isDeleting && this.charIndex === currentText.length) {
            // Finished typing complete word - pause then start deleting
            delay = this.pauseDuration;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            // Finished deleting - move to next word
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;

            // If not looping and we've cycled through all texts, stop
            if (!this.loop && this.currentIndex === 0) {
                this.stop();
                return;
            }

            // Short pause before typing next word
            delay = 300;
        }

        // Schedule next tick
        this._timeoutId = setTimeout(() => this._tick(), delay);
    }

    /**
     * Measure and reserve width for the widest text to prevent layout shifts
     * Critical for desktop views (1440px/1024px) where layout shift is very visible
     * @private
     */
    _reserveWidth() {
        if (!this.el) return;

        // Create an off-screen span to measure text widths
        // Find the widest text
        let maxWidth = 0;
        for (const text of this.texts) {
            const width = this._measureTextWidth(text);
            if (width > maxWidth) maxWidth = width;
        }

        // Apply minimum width with small buffer for cursor
        const cursorBuffer = 8; // Space for the blinking cursor
        this.el.style.minWidth = `${Math.ceil(maxWidth + cursorBuffer)}px`;
    }

    /**
     * Ensure there is a hidden span available for text measurement
     * @private
     */
    _ensureMeasureSpan() {
        if (this._measureSpan) return this._measureSpan;

        const span = document.createElement('span');
        span.style.cssText = `
            position: absolute;
            visibility: hidden;
            white-space: nowrap;
            pointer-events: none;
            inset: 0;
        `;

        const computed = window.getComputedStyle(this.el);
        span.style.font = computed.font;
        span.style.fontSize = computed.fontSize;
        span.style.fontFamily = computed.fontFamily;
        span.style.fontWeight = computed.fontWeight;
        span.style.letterSpacing = computed.letterSpacing;
        span.style.textTransform = computed.textTransform;
        span.style.lineHeight = computed.lineHeight;

        document.body.appendChild(span);
        this._measureSpan = span;
        return span;
    }

    /**
     * Measure text width using off-screen span (cached per string)
     * @param {string} text
     * @returns {number}
     * @private
     */
    _measureTextWidth(text) {
        if (!this.el) return 0;
        const cached = this._textWidthCache.get(text);
        if (cached !== undefined) return cached;

        const span = this._ensureMeasureSpan();
        span.textContent = text;
        const width = span.getBoundingClientRect().width;
        this._textWidthCache.set(text, width);
        return width;
    }

    /**
     * Get current animation state (useful for debugging)
     * @returns {Object} Current state
     */
    getState() {
        return {
            isRunning: this._isRunning,
            currentText: this.texts[this.currentIndex],
            currentIndex: this.currentIndex,
            charIndex: this.charIndex,
            isDeleting: this.isDeleting,
            prefersReducedMotion: this.prefersReducedMotion
        };
    }
}
