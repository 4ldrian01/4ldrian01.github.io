/**
 * ============================================================================
 * CONFIG INDEX - index.js
 * ============================================================================
 * 
 * PURPOSE:
 * Barrel export file for all configuration modules.
 * Provides a single import point for all application configuration.
 * 
 * USAGE:
 * import { FORM_CONFIG, SECURITY_PATTERNS, ANIMATION } from './config/index.js';
 * 
 * ============================================================================
 */

// Form configuration and security patterns
export { FORM_CONFIG, SECURITY_PATTERNS } from './form-config.js';

// Application-wide constants
export {
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
} from './constants.js';

// Default export with all configs bundled
import { FORM_CONFIG, SECURITY_PATTERNS } from './form-config.js';
import CONSTANTS from './constants.js';

export default {
    FORM_CONFIG,
    SECURITY_PATTERNS,
    ...CONSTANTS
};
