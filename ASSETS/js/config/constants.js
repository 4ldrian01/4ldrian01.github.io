/**
 * ============================================================================
 * APPLICATION CONSTANTS - constants.js
 * ============================================================================
 * 
 * PURPOSE:
 * Centralized configuration and magic number management for the portfolio.
 * Extracting constants from individual modules improves:
 * 
 * 1. MAINTAINABILITY: Change values in one place, affects entire application
 * 2. CONSISTENCY: Ensures same values used across all modules
 * 3. DEBUGGABILITY: Easy to identify what values control behavior
 * 4. SCALABILITY: New configurations can be added without touching modules
 * 
 * REPLACES:
 * - Scattered magic numbers in various modules
 * - Inline timing values in animations
 * - Hardcoded breakpoints and thresholds
 * 
 * USAGE:
 * import { ANIMATION, BREAKPOINTS, SCROLL } from '../config/constants.js';
 * 
 * ============================================================================
 */

// ============================================================================
// BREAKPOINTS - Responsive Design Thresholds
// ============================================================================

/**
 * Responsive breakpoints matching CSS media queries
 * Keep in sync with CSS variables.css
 */
export const BREAKPOINTS = {
    /** Mobile devices (phones) */
    MOBILE: 480,
    /** Tablet devices */
    TABLET: 768,
    /** Desktop threshold - below this is considered mobile/tablet */
    DESKTOP: 1024,
    /** Large desktop screens */
    LARGE_DESKTOP: 1440,
    /** Extra large screens */
    XL_DESKTOP: 1920
};

// ============================================================================
// ANIMATION TIMING - Duration and Delay Values
// ============================================================================

/**
 * Animation timing constants in milliseconds
 * Centralizes all animation durations for consistency
 */
export const ANIMATION = {
    // General durations
    /** Very fast animations (tooltips, micro-interactions) */
    DURATION_FAST: 150,
    /** Standard animation duration */
    DURATION_NORMAL: 300,
    /** Medium duration for transitions */
    DURATION_MEDIUM: 400,
    /** Slower animations for emphasis */
    DURATION_SLOW: 500,
    /** Very slow for major transitions */
    DURATION_SLOWER: 600,
    
    // Specific animation durations
    /** Theme transition duration */
    THEME_TRANSITION: 400,
    /** Menu open/close animation */
    MENU_TRANSITION: 300,
    /** Modal fade in/out */
    MODAL_TRANSITION: 300,
    /** Card filter animation */
    FILTER_TRANSITION: 400,
    /** Section scroll animation */
    SECTION_ANIMATION: 500,
    /** Stats counter animation total duration */
    STATS_COUNTER: 2000,
    
    // Delays
    /** Stagger delay between items in a group */
    STAGGER_DELAY: 80,
    /** Short delay before animation starts */
    START_DELAY: 50,
    /** Debounce delay for resize events */
    RESIZE_DEBOUNCE: 150,
    /** Scroll animation re-enable delay */
    SCROLL_REENABLE: 1500
};

// ============================================================================
// SCROLL CONFIGURATION
// ============================================================================

/**
 * Scroll-related configuration values
 */
export const SCROLL = {
    /** Offset from top when scrolling to section (accounts for header) */
    SECTION_OFFSET: 20,
    /** Threshold for sticky header activation */
    STICKY_THRESHOLD: 100,
    /** IntersectionObserver threshold for section visibility */
    SECTION_VISIBILITY_THRESHOLD: 0.15,
    /** Root margin for section observer */
    OBSERVER_ROOT_MARGIN: '0px 0px -50px 0px',
    /** Threshold values for nav highlighting observer */
    NAV_OBSERVER_THRESHOLDS: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
};

// ============================================================================
// TYPING ANIMATION CONFIGURATION
// ============================================================================

/**
 * Text typing animation settings
 */
export const TYPING = {
    /** Milliseconds per character when typing */
    TYPING_SPEED: 100,
    /** Milliseconds per character when deleting */
    DELETING_SPEED: 50,
    /** Pause duration after typing complete word */
    PAUSE_DURATION: 1500,
    /** Random variance for natural typing feel */
    RANDOM_VARIANCE: 25
};

// ============================================================================
// SWIPE / TOUCH CONFIGURATION
// ============================================================================

/**
 * Touch and swipe gesture configuration
 */
export const TOUCH = {
    /** Minimum distance (px) to register as swipe */
    MIN_SWIPE_DISTANCE: 50,
    /** Threshold for vertical scroll detection */
    VERTICAL_THRESHOLD: 10
};

// ============================================================================
// PORTFOLIO FILTER CONFIGURATION
// ============================================================================

/**
 * Portfolio filtering settings
 */
export const PORTFOLIO = {
    /** Default number of visible projects before "View More" */
    VISIBLE_LIMIT: 6,
    /** Filter animation duration */
    ANIMATION_DURATION: 400,
    /** Debounce delay for filter button clicks */
    FILTER_DEBOUNCE: 150
};

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

/**
 * Z-index values for layering elements
 * Prevents z-index wars and keeps layering organized
 */
export const Z_INDEX = {
    /** Default content level */
    CONTENT: 1,
    /** Sticky header */
    HEADER: 100,
    /** Fixed theme toggle */
    THEME_TOGGLE: 99,
    /** Mobile menu overlay */
    MOBILE_MENU: 1000,
    /** Modal overlay */
    MODAL: 1100,
    /** Notifications (highest) */
    NOTIFICATION: 1200
};

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * Accessibility-related constants
 */
export const A11Y = {
    /** Focus outline width */
    FOCUS_OUTLINE_WIDTH: '2px',
    /** Focus outline offset */
    FOCUS_OUTLINE_OFFSET: '2px',
    /** Minimum touch target size (px) */
    MIN_TOUCH_TARGET: 44,
    /** Reduced motion preference media query */
    REDUCED_MOTION_QUERY: '(prefers-reduced-motion: reduce)'
};

// ============================================================================
// KEYBOARD CODES
// ============================================================================

/**
 * Keyboard key constants for event handling
 */
export const KEYS = {
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    SPACE: ' ',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End'
};

// ============================================================================
// CSS CLASS NAMES
// ============================================================================

/**
 * Commonly used CSS class names
 * Centralizing these prevents typos and makes refactoring easier
 */
export const CSS_CLASSES = {
    // States
    ACTIVE: 'active',
    VISIBLE: 'visible',
    HIDDEN: 'hidden',
    LOADING: 'loading',
    DISABLED: 'disabled',
    EXPANDED: 'expanded',
    
    // Animations
    ANIMATING: 'animating',
    TRANSITIONING: 'theme-transitioning',
    
    // Layout
    STICKY: 'sticky-header',
    MODAL_OPEN: 'modal-open',
    
    // Validation
    VALID: 'valid',
    INVALID: 'invalid',
    ERROR: 'error'
};

// ============================================================================
// DEFAULT EXPORT (all constants bundled)
// ============================================================================

/**
 * Default export bundles all constants for convenience
 * Use named exports for better tree-shaking
 */
export default {
    BREAKPOINTS,
    ANIMATION,
    SCROLL,
    TYPING,
    TOUCH,
    PORTFOLIO,
    Z_INDEX,
    A11Y,
    KEYS,
    CSS_CLASSES
};
