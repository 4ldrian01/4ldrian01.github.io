/**
 * Stats Animation Module
 * Animates stat numbers when they come into view with easing
 */

export class StatsAnimation {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
    }

    init() {
        if (!this.stats.length) return;

        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.showFinalValues();
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateStats();
                    this.hasAnimated = true;
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // Easing function for smooth deceleration
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    animateStats() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target')) || 0;
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.easeOutQuart(progress);
                const current = Math.floor(easedProgress * target);

                stat.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(updateNumber);
        });
    }

    showFinalValues() {
        this.stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target')) || 0;
            stat.textContent = target.toLocaleString();
        });
        this.hasAnimated = true;
    }
}
