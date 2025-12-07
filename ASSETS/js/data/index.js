/**
 * ============================================================================
 * DATA INDEX - index.js
 * ============================================================================
 * 
 * PURPOSE:
 * Barrel export file for all data modules.
 * Centralizes access to all portfolio content data.
 * 
 * USAGE:
 * import { PROJECTS, getProjectById } from './data/index.js';
 * 
 * ============================================================================
 */

// Project data and helper functions
export {
    PROJECTS,
    getProjectById,
    getAllProjects,
    getProjectsByCategory,
    getProjectCategories,
    getProjectCount
} from './projects.js';
