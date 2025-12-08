/**
 * ============================================================================
 * PROJECT MODAL MODULE - ProjectModal.js
 * ============================================================================
 * 
 * PURPOSE:
 * Handles the display of project details in a modal window.
 * Provides an accessible, responsive modal for viewing project information.
 * 
 * FEATURES:
 * - Lazy modal creation (only created when needed)
 * - Keyboard accessibility (ESC to close, focus trapping)
 * - Scroll lock when modal is open
 * - Responsive design for all screen sizes
 * 
 * DEPENDENCIES:
 * - ../data/projects.js - Project data source
 * 
 * USAGE:
 * const modal = new ProjectModal();
 * modal.init();
 * 
 * ============================================================================
 */

import { PROJECTS, getProjectById } from '../data/projects.js';

export class ProjectModal {
    constructor() {
        /** @type {HTMLElement|null} Modal container element */
        this.modal = null;
        
        /** @type {HTMLElement|null} Modal overlay element */
        this.overlay = null;
        
        /** @type {boolean} Tracks if modal is currently open */
        this.isOpen = false;
        
        /** @type {Object} Reference to project data from data module */
        this.projectData = PROJECTS;
        
        /** @type {number} Stores scroll position before modal opens */
        this.previousScrollY = 0;
    }

    /**
     * Initializes the modal module
     * Defers modal creation until needed for better initial load performance
     */
    init() {
        // Defer modal creation until needed to improve initial load performance
        this.setupEventListeners();
    }

    /**
     * Creates the modal HTML structure and appends to body
     */
    createModalStructure() {
        if (this.modal) return; // Already created

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'project-modal-overlay';
        this.overlay.id = 'projectModalOverlay';

        // Create modal
        this.overlay.innerHTML = `
            <div class="project-modal" id="projectModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                <button class="modal-close-btn" id="modalCloseBtn" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="modal-content-wrapper">
                    <div class="modal-header">
                        <span class="modal-category-badge" id="modalCategory">
                            <i class="fas fa-globe"></i>
                            <span>Web Development</span>
                        </span>
                        <img src="" alt="" class="modal-project-image" id="modalImage">
                    </div>
                    
                    <div class="modal-body">
                        <h2 class="modal-project-title" id="modalTitle">Project Title</h2>
                        
                        <div class="modal-project-meta">
                            <span><i class="far fa-calendar-alt"></i> <span id="modalDate">Date</span></span>
                            <span><i class="far fa-clock"></i> <span id="modalDuration">Duration</span></span>
                        </div>
                        
                        <div class="modal-divider"></div>
                        
                        <div class="modal-section">
                            <h3 class="modal-section-title"><i class="fas fa-info-circle"></i> Overview</h3>
                            <p class="modal-description" id="modalDescription">Description goes here...</p>
                        </div>
                        
                        <div class="modal-section">
                            <h3 class="modal-section-title"><i class="fas fa-tools"></i> Technologies Used</h3>
                            <div class="modal-technologies" id="modalTechnologies">
                                <!-- Tech tags will be inserted here -->
                            </div>
                        </div>
                        
                        <div class="modal-section">
                            <h3 class="modal-section-title"><i class="fas fa-star"></i> Key Features</h3>
                            <ul class="modal-features-list" id="modalFeatures">
                                <!-- Features will be inserted here -->
                            </ul>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <a href="#" class="modal-btn modal-btn-primary" id="modalLiveBtn" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                        <a href="#" class="modal-btn modal-btn-secondary" id="modalGithubBtn" target="_blank">
                            <i class="fab fa-github"></i> Source Code
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);
        this.modal = document.getElementById('projectModal');

        // Attach modal-specific listeners now that elements exist
        this.attachModalListeners();
    }

    /**
     * Sets up initial event listeners (links and global keys)
     */
    setupEventListeners() {
        // ESC key to close (global listener)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Project card "View more" buttons
        this.setupProjectLinks();
    }

    /**
     * Attaches listeners to modal elements after creation
     */
    attachModalListeners() {
        // Close button with debouncing to prevent double-clicks
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            let isClosing = false;
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (isClosing) return;
                isClosing = true;
                this.close();
                setTimeout(() => { isClosing = false; }, 300);
            });
        }

        // Click outside to close (debounced)
        let isClosingOverlay = false;
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay && !isClosingOverlay) {
                isClosingOverlay = true;
                this.close();
                setTimeout(() => { isClosingOverlay = false; }, 300);
            }
        });
    }

    /**
     * Sets up click handlers for all project card links
     */
    setupProjectLinks() {
        const projectLinks = document.querySelectorAll('.project-card .project-link');
        
        projectLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = link.getAttribute('data-project');
                if (projectId && this.projectData[projectId]) {
                    this.open(projectId);
                }
            });
        });
    }

    /**
     * Opens the modal with specific project data
     */
    open(projectId) {
        // Ensure modal structure exists
        this.createModalStructure();

        const project = this.projectData[projectId];
        if (!project) return;

        // Populate modal content
        this.populateModal(project);

        // Store current scroll position BEFORE any changes
        this.previousScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

        // Lock body scroll without position:fixed (prevents scroll jump)
        document.documentElement.classList.add('modal-open');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
        
        // Use requestAnimationFrame for smooth animation start
        requestAnimationFrame(() => {
            this.overlay.classList.add('active');
        });
        
        this.isOpen = true;

        // Focus trap for accessibility (delay slightly for animation)
        setTimeout(() => {
            this.modal?.focus();
        }, 50);
    }

    /**
     * Get scrollbar width to prevent layout shift
     */
    getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    /**
     * Populates the modal with project data
     */
    populateModal(project) {
        // Category badge
        const categoryBadge = document.getElementById('modalCategory');
        categoryBadge.innerHTML = `
            <i class="${project.categoryIcon}"></i>
            <span>${project.category}</span>
        `;

        // Image
        const image = document.getElementById('modalImage');
        image.src = project.image;
        image.alt = project.title;

        // Title
        document.getElementById('modalTitle').textContent = project.title;

        // Meta info
        document.getElementById('modalDate').textContent = project.date;
        document.getElementById('modalDuration').textContent = project.duration;

        // Description
        document.getElementById('modalDescription').textContent = project.longDescription;

        // Technologies
        const techContainer = document.getElementById('modalTechnologies');
        techContainer.innerHTML = project.technologies
            .map(tech => `<span class="modal-tech-tag">${tech}</span>`)
            .join('');

        // Features
        const featuresContainer = document.getElementById('modalFeatures');
        featuresContainer.innerHTML = project.features
            .map(feature => `<li>${feature}</li>`)
            .join('');

        // Buttons
        document.getElementById('modalLiveBtn').href = project.liveUrl;
        document.getElementById('modalGithubBtn').href = project.githubUrl;
    }

    /**
     * Closes the modal with optimized performance
     */
    close() {
        if (!this.isOpen) return;
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            this.overlay.classList.remove('active');
            
            // Wait for animation to complete before removing body classes
            setTimeout(() => {
                document.documentElement.classList.remove('modal-open');
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, 200); // Match CSS transition duration
        });
        
        this.isOpen = false;
    }

    /**
     * Cleanup method
     */
    cleanup() {
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.isOpen = false;
    }
}
