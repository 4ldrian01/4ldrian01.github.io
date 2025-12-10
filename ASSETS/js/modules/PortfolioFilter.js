/**
 * Portfolio Filter Module
 * Handles project filtering by category
 */

import { debounce } from '../utils/helpers.js';

export class PortfolioFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.project-categories .category-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.viewMoreBtn = document.getElementById('viewMoreBtn');
        this.activeFilter = 'all';
        this.isAnimating = false;
        this.animationDuration = 400;
        this.animateFrame = null;
        this.debouncedPerformFilter = debounce(this.performFilter.bind(this), 150);
        
        this.visibleLimit = 7;
        this.isExpanded = false;
    }

    init() {
        if (!this.filterButtons.length || !this.projectCards.length) return;
        
        this.setupEventListeners();
        this.setupInitialState();
    }

    setupEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // We allow clicking even if animating to ensure responsiveness, 
                // but the debounce handles rapid fires.
                
                const clickedButton = e.currentTarget;
                const filterValue = clickedButton.getAttribute('data-filter');

                if (filterValue === this.activeFilter && filterValue !== 'all') return;

                this.activeFilter = filterValue;
                this.isExpanded = false; // Reset expansion on filter change
                this.updateActiveButton(clickedButton);
                this.debouncedPerformFilter(filterValue);
            }, { passive: true });
        });

        if (this.viewMoreBtn) {
            this.viewMoreBtn.addEventListener('click', () => {
                this.isExpanded = true;
                this.performFilter(this.activeFilter);
            });
        }
    }

    setupInitialState() {
        this.projectCards.forEach(card => {
            card.style.transform = 'translate3d(0, 0, 0)';
            card.style.opacity = '1';
            card.style.transition = `opacity ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), 
                                   transform ${this.animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            card.style.backfaceVisibility = 'hidden';
        });

        const allButton = document.querySelector('.project-categories .category-btn[data-filter="all"]');
        if (allButton) {
            this.updateActiveButton(allButton);
        }
        
        // Initial check to set button state
        this.performFilter('all');
    }

    /**
     * Temporarily add will-change during animation for better performance
     * Remove after animation completes to free up resources
     */
    optimizeAnimation(cards, enable = true) {
        cards.forEach(card => {
            card.style.willChange = enable ? 'transform, opacity' : 'auto';
        });
    }

    updateActiveButton(clickedButton) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
            btn.style.pointerEvents = 'none';
        });

        if (clickedButton) {
            clickedButton.classList.add('active');
            clickedButton.setAttribute('aria-pressed', 'true');
        }

        setTimeout(() => {
            this.filterButtons.forEach(btn => {
                btn.style.pointerEvents = 'auto';
            });
        }, this.animationDuration);
    }

    performFilter(filterValue) {
        if (this.animateFrame) {
            cancelAnimationFrame(this.animateFrame);
        }

        this.isAnimating = true;

        this.animateFrame = requestAnimationFrame(() => {
            const matchingCards = [];
            const nonMatchingCards = [];

            // 1. Identify matching and non-matching
            this.projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isMatch = filterValue === 'all' || category === filterValue;
                if (isMatch) {
                    matchingCards.push(card);
                } else {
                    nonMatchingCards.push(card);
                }
            });

            // 2. Determine which matching cards to show based on limit
            const cardsToShow = [];
            const cardsToHide = [...nonMatchingCards];

            if (this.isExpanded) {
                cardsToShow.push(...matchingCards);
            } else {
                cardsToShow.push(...matchingCards.slice(0, this.visibleLimit));
                cardsToHide.push(...matchingCards.slice(this.visibleLimit));
            }

            // 3. Apply animations
            cardsToShow.forEach(card => {
                // If card is currently hidden (display: none) or invisible, prepare it for entry animation
                const isHidden = getComputedStyle(card).display === 'none' || card.style.opacity === '0';
                
                if (isHidden) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translate3d(0, 20px, 0)';
                    
                    // Trigger reflow
                    void card.offsetWidth;
                }

                card.style.opacity = '1';
                card.style.transform = 'translate3d(0, 0, 0)';
                card.style.pointerEvents = 'auto';
            });

            cardsToHide.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translate3d(0, 20px, 0)';
                card.style.pointerEvents = 'none';
            });

            // 4. Handle View More Button Visibility
            if (this.viewMoreBtn) {
                if (matchingCards.length > this.visibleLimit && !this.isExpanded) {
                    this.viewMoreBtn.style.display = 'inline-flex';
                } else {
                    this.viewMoreBtn.style.display = 'none';
                }
            }

            // Cleanup hidden cards after animation
            setTimeout(() => {
                cardsToHide.forEach(card => {
                    card.style.display = 'none';
                });
                this.isAnimating = false;
            }, this.animationDuration);
        });
    }

    cleanup() {
        if (this.animateFrame) {
            cancelAnimationFrame(this.animateFrame);
        }
    }
}
