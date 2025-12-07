/**
 * ============================================================================
 * MODULE INDEX - index.js
 * ============================================================================
 * 
 * PURPOSE:
 * Barrel export file that re-exports all modules from a single entry point.
 * This pattern provides:
 * 
 * 1. CLEANER IMPORTS: Import multiple modules from one path
 * 2. ENCAPSULATION: Hides internal module structure from consumers
 * 3. MAINTAINABILITY: Easy to add/remove/rename modules
 * 4. DISCOVERABILITY: Shows all available modules in one place
 * 
 * USAGE:
 * Instead of:
 *   import { ScrollManager } from './modules/ScrollManager.js';
 *   import { FormManager } from './modules/FormManager.js';
 * 
 * You can use:
 *   import { ScrollManager, FormManager } from './modules/index.js';
 * 
 * Or import all:
 *   import * as Modules from './modules/index.js';
 * 
 * ============================================================================
 */

// ============================================================================
// CORE MODULES - Essential functionality
// ============================================================================

/**
 * ScrollManager - Handles sticky header and active navigation highlighting
 * @see ScrollManager.js for implementation details
 */
export { ScrollManager } from './ScrollManager.js';

/**
 * ThemeManager - Light/Dark theme toggle functionality
 * @see ThemeManager.js for implementation details
 */
export { ThemeManager } from './ThemeManager.js';

/**
 * HamburgerMenu - Mobile navigation menu with accessibility support
 * @see HamburgerMenu.js for implementation details
 */
export { HamburgerMenu } from './HamburgerMenu.js';

// ============================================================================
// ANIMATION MODULES - Visual effects and transitions
// ============================================================================

/**
 * SectionAnimator - Scroll-triggered section animations
 * Replaces AOS library for better performance
 * @see SectionAnimator.js for implementation details
 */
export { SectionAnimator } from './SectionAnimator.js';

/**
 * TextAnimation - Hero section typing effect
 * @see TextAnimation.js for implementation details
 */
export { TextAnimation } from './TextAnimation.js';

/**
 * StatsAnimation - Animated counters for stats section
 * @see StatsAnimation.js for implementation details
 */
export { StatsAnimation } from './StatsAnimation.js';

// ============================================================================
// INTERACTIVE MODULES - User interaction handling
// ============================================================================

/**
 * FormManager - Contact form validation and submission
 * Integrates with Web3Forms for form handling
 * @see FormManager.js for implementation details
 */
export { FormManager } from './FormManager.js';

/**
 * PortfolioFilter - Project category filtering
 * @see PortfolioFilter.js for implementation details
 */
export { PortfolioFilter } from './PortfolioFilter.js';

/**
 * ProjectModal - Project detail modal display
 * @see ProjectModal.js for implementation details
 */
export { ProjectModal } from './ProjectModal.js';

/**
 * CertificationNav - Certification carousel navigation
 * @see CertificationNav.js for implementation details
 */
export { CertificationNav } from './CertificationNav.js';

// ============================================================================
// OPTIONAL/DISABLED MODULES
// ============================================================================

// NOTE: ImageLoader is currently disabled due to performance issues.
// Uncomment when optimized or replace with native loading="lazy".
// export { ImageLoader } from './ImageLoader.js';
