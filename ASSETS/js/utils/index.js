/**
 * ============================================================================
 * UTILITIES INDEX - index.js
 * ============================================================================
 * 
 * PURPOSE:
 * Barrel export file for all utility functions.
 * Provides a single import point for reusable utility functions.
 * 
 * USAGE:
 * import { debounce, throttle, isInViewport } from './utils/index.js';
 * 
 * ============================================================================
 */

// Re-export all utilities from helpers.js
export { debounce, throttle, isInViewport } from './helpers.js';

// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a unique ID
 * Useful for creating unique element IDs dynamically
 * 
 * @param {string} [prefix='id'] - Optional prefix for the ID
 * @returns {string} Unique identifier string
 * 
 * @example
 * const elementId = generateUniqueId('modal'); // 'modal-1a2b3c4d'
 */
export function generateUniqueId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Clamps a number between min and max values
 * 
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 * 
 * @example
 * clamp(150, 0, 100); // Returns 100
 * clamp(-5, 0, 100);  // Returns 0
 * clamp(50, 0, 100);  // Returns 50
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Checks if the user prefers reduced motion
 * Used for accessibility compliance
 * 
 * @returns {boolean} True if user prefers reduced motion
 * 
 * @example
 * if (prefersReducedMotion()) {
 *     // Skip animation
 * }
 */
export function prefersReducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/**
 * Checks if the current device is considered mobile
 * Based on viewport width matching CSS breakpoints
 * 
 * @param {number} [breakpoint=1024] - Width threshold for mobile
 * @returns {boolean} True if device width is below breakpoint
 * 
 * @example
 * if (isMobile()) {
 *     // Apply mobile-specific logic
 * }
 */
export function isMobile(breakpoint = 1024) {
    return window.innerWidth < breakpoint;
}

/**
 * Formats a number with locale-specific separators
 * 
 * @param {number} num - Number to format
 * @param {string} [locale='en-US'] - Locale for formatting
 * @returns {string} Formatted number string
 * 
 * @example
 * formatNumber(1000000); // '1,000,000'
 */
export function formatNumber(num, locale = 'en-US') {
    return num.toLocaleString(locale);
}

/**
 * Safely parses JSON with fallback
 * 
 * @param {string} jsonString - JSON string to parse
 * @param {*} [fallback=null] - Fallback value if parsing fails
 * @returns {*} Parsed object or fallback value
 * 
 * @example
 * const data = safeJSONParse(userInput, []);
 */
export function safeJSONParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.warn('JSON parse error:', e.message);
        return fallback;
    }
}

/**
 * Creates an easing function for animations
 * Available easing types: linear, easeInQuad, easeOutQuad, easeInOutQuad,
 * easeOutQuart, easeOutCubic
 * 
 * @param {string} type - Type of easing
 * @returns {function} Easing function that takes t (0-1) and returns eased value
 * 
 * @example
 * const ease = getEasing('easeOutQuart');
 * const easedValue = ease(0.5); // Returns eased progress
 */
export function getEasing(type = 'easeOutQuart') {
    const easings = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeOutQuart: t => 1 - Math.pow(1 - t, 4),
        easeOutCubic: t => 1 - Math.pow(1 - t, 3)
    };
    
    return easings[type] || easings.easeOutQuart;
}

/**
 * Waits for specified milliseconds (Promise-based)
 * Useful for async/await patterns
 * 
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>} Promise that resolves after delay
 * 
 * @example
 * async function animate() {
 *     await sleep(1000);
 *     // Continues after 1 second
 * }
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Escapes HTML special characters to prevent XSS
 * 
 * @param {string} str - String to escape
 * @returns {string} Escaped string safe for HTML insertion
 * 
 * @example
 * const safe = escapeHTML('<script>alert("xss")</script>');
 * // '&lt;script&gt;alert("xss")&lt;/script&gt;'
 */
export function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
