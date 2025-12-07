/**
 * ============================================================================
 * PROJECT DATA - projects.js
 * ============================================================================
 * 
 * PURPOSE:
 * This file contains all project data for the portfolio. By separating data
 * from the ProjectModal component, we achieve:
 * 
 * 1. MAINTAINABILITY: Easy to update project information without touching
 *    the modal component logic.
 * 
 * 2. SCALABILITY: New projects can be added by simply adding new objects
 *    to the PROJECTS constant.
 * 
 * 3. DEBUGGABILITY: Data issues are isolated from UI logic issues.
 * 
 * 4. REUSABILITY: Project data can be imported by other components
 *    (e.g., search functionality, project cards, etc.)
 * 
 * REPLACES:
 * - The getProjectsData() method from ProjectModal.js
 * 
 * USAGE:
 * import { PROJECTS, getProjectById, getAllProjects } from '../data/projects.js';
 * 
 * ============================================================================
 */

/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier matching data-project attribute in HTML
 * @property {string} title - Display title of the project
 * @property {string} category - Project category (e.g., 'Web Development', 'Networking')
 * @property {string} categoryIcon - Font Awesome icon class for the category
 * @property {string} image - Path to project thumbnail image
 * @property {string} date - Completion date (e.g., 'November 2025')
 * @property {string} duration - Time spent on project (e.g., '3 weeks')
 * @property {string} description - Short description for project cards
 * @property {string} longDescription - Extended description for modal view
 * @property {string[]} technologies - Array of technology/tool names used
 * @property {string[]} features - Array of key features/highlights
 * @property {string} liveUrl - URL to live demo (use '#' if not available)
 * @property {string} githubUrl - URL to GitHub repository (use '#' if not available)
 */

/**
 * Master projects data store
 * Each project has a unique ID that corresponds to the data-project attribute
 * on project card links in the HTML
 * 
 * @type {Object.<string, Project>}
 */
export const PROJECTS = {
    // =========================================================================
    // WEB DEVELOPMENT PROJECTS
    // =========================================================================
    
    'personal-portfolio': {
        id: 'personal-portfolio',
        title: 'Personal Portfolio Website',
        category: 'Web Development',
        categoryIcon: 'fas fa-globe',
        image: 'images/PERSONAL-PORTFOLIO-IMG.JPG',
        date: 'November 2025',
        duration: '3 weeks',
        description: 'A comprehensive responsive personal portfolio system showcasing my information details, skills, and projects.',
        longDescription: 'This portfolio website serves as a digital resume and showcase of my work as an aspiring IT professional. It features a clean, modern design with smooth animations, responsive layout, and optimized performance. The site demonstrates my proficiency in front-end development and UI/UX design principles.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'ES6 Modules'],
        features: [
            'Fully responsive design for all devices',
            'Smooth scroll animations and transitions',
            'Dynamic portfolio filtering system',
            'Interactive contact form with validation',
            'Optimized performance with lazy loading',
            'Modular CSS and JavaScript architecture'
        ],
        liveUrl: '#',
        githubUrl: '#'
    },

    'student-management': {
        id: 'student-management',
        title: 'Student Management System',
        category: 'Web Development',
        categoryIcon: 'fas fa-globe',
        image: 'images/student-management.jpg',
        date: 'October 2025',
        duration: '4 weeks',
        description: 'A web-based system for managing student records, grades, and academic information with admin dashboard.',
        longDescription: 'A comprehensive student management system designed to streamline academic administration. The system allows administrators to manage student records, track grades, generate reports, and monitor academic progress efficiently.',
        technologies: ['HTML', 'CSS', 'PHP', 'MySQL', 'Bootstrap'],
        features: [
            'Student registration and profile management',
            'Grade tracking and GPA calculation',
            'Admin dashboard with analytics',
            'Report generation and export',
            'User authentication and role-based access',
            'Search and filter functionality'
        ],
        liveUrl: '#',
        githubUrl: '#'
    },

    'ecommerce-platform': {
        id: 'ecommerce-platform',
        title: 'E-commerce Platform',
        category: 'Web Development',
        categoryIcon: 'fas fa-globe',
        image: 'images/ecommerce.jpg',
        date: 'June 2025',
        duration: '5 weeks',
        description: 'A responsive e-commerce website with product management and shopping cart functionality.',
        longDescription: 'A full-featured e-commerce platform that allows users to browse products, add items to cart, and complete purchases. The admin panel enables product management, order tracking, and inventory control.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
        features: [
            'Product catalog with categories',
            'Shopping cart functionality',
            'User authentication and profiles',
            'Order management system',
            'Admin dashboard for inventory',
            'Responsive design for mobile shopping'
        ],
        liveUrl: '#',
        githubUrl: '#'
    },

    // =========================================================================
    // NETWORKING PROJECTS
    // =========================================================================

    'campus-network': {
        id: 'campus-network',
        title: 'Campus Network Design',
        category: 'Networking',
        categoryIcon: 'fas fa-network-wired',
        image: 'images/network-design.jpg',
        date: 'September 2025',
        duration: '6 weeks',
        description: 'A comprehensive network design project for campus-wide connectivity with security implementation.',
        longDescription: 'This project involved designing a complete network infrastructure for a campus environment, including LAN/WAN design, security protocols, and implementation using Cisco equipment. The design ensures reliable connectivity, scalability, and robust security measures.',
        technologies: ['Cisco Packet Tracer', 'Network Design', 'VLAN', 'Security Protocols'],
        features: [
            'Hierarchical network topology design',
            'VLAN segmentation for departments',
            'Firewall and security implementation',
            'Wireless network integration',
            'Network documentation and diagrams',
            'Scalability planning for future expansion'
        ],
        liveUrl: '#',
        githubUrl: '#'
    },

    // =========================================================================
    // PYTHON PROJECTS
    // =========================================================================

    'file-automation': {
        id: 'file-automation',
        title: 'File Management Automation',
        category: 'Python',
        categoryIcon: 'fab fa-python',
        image: 'images/python-project.jpg',
        date: 'August 2025',
        duration: '2 weeks',
        description: 'Python automation script for efficient file organization and management with GUI interface.',
        longDescription: 'An automation tool built with Python that helps organize and manage files efficiently. The application features a user-friendly GUI built with Tkinter, allowing users to sort, rename, and organize files based on various criteria automatically.',
        technologies: ['Python', 'Tkinter', 'OS Module', 'Shutil'],
        features: [
            'Automatic file sorting by type/date/size',
            'Batch file renaming capabilities',
            'Duplicate file detection and removal',
            'User-friendly graphical interface',
            'Custom sorting rules configuration',
            'Undo functionality for safety'
        ],
        liveUrl: '#',
        githubUrl: '#'
    },

    // =========================================================================
    // C++ PROJECTS
    // =========================================================================

    'library-system': {
        id: 'library-system',
        title: 'Library Management System',
        category: 'C++',
        categoryIcon: 'fas fa-code',
        image: 'images/cpp-project.jpg',
        date: 'July 2025',
        duration: '3 weeks',
        description: 'Console-based library management system with book tracking and member management features.',
        longDescription: 'A console-based application developed in C++ that manages library operations. The system handles book inventory, member registration, borrowing/returning books, and generates reports. It demonstrates strong OOP principles and file handling capabilities.',
        technologies: ['C++', 'OOP', 'File I/O', 'Data Structures'],
        features: [
            'Book inventory management (CRUD operations)',
            'Member registration and management',
            'Book borrowing and return system',
            'Fine calculation for overdue books',
            'Search functionality by title/author/ISBN',
            'Persistent data storage using files'
        ],
        liveUrl: '#',
        githubUrl: '#'
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Retrieves a project by its unique ID
 * 
 * @param {string} projectId - The unique project identifier
 * @returns {Project|null} The project object or null if not found
 * 
 * @example
 * const project = getProjectById('personal-portfolio');
 * if (project) {
 *     console.log(project.title); // 'Personal Portfolio Website'
 * }
 */
export function getProjectById(projectId) {
    return PROJECTS[projectId] || null;
}

/**
 * Returns all projects as an array
 * Useful for iterating, filtering, or mapping operations
 * 
 * @returns {Project[]} Array of all project objects
 * 
 * @example
 * const allProjects = getAllProjects();
 * const webProjects = allProjects.filter(p => p.category === 'Web Development');
 */
export function getAllProjects() {
    return Object.values(PROJECTS);
}

/**
 * Returns all projects filtered by category
 * 
 * @param {string} category - Category name to filter by
 * @returns {Project[]} Array of projects in the specified category
 * 
 * @example
 * const pythonProjects = getProjectsByCategory('Python');
 */
export function getProjectsByCategory(category) {
    return getAllProjects().filter(project => project.category === category);
}

/**
 * Returns a list of all unique project categories
 * 
 * @returns {string[]} Array of unique category names
 * 
 * @example
 * const categories = getProjectCategories();
 * // ['Web Development', 'Networking', 'Python', 'C++']
 */
export function getProjectCategories() {
    const categories = new Set(getAllProjects().map(project => project.category));
    return Array.from(categories);
}

/**
 * Returns the total count of projects
 * 
 * @returns {number} Total number of projects
 */
export function getProjectCount() {
    return Object.keys(PROJECTS).length;
}
