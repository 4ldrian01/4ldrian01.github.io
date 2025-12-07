/**
 * AOS Manager Module
 * Handles Animate On Scroll library initialization and configuration
 */

export class AOSManager {
    init() {
        if (typeof AOS === 'undefined') return;

        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
            anchorPlacement: 'top-bottom',
            offset: 50,
            delay: 0,
            easing: 'ease-in-out-cubic',
            startEvent: 'DOMContentLoaded',
            disableMutationObserver: false,
            useClassNames: true,
            disable: 'mobile'
        });

        this.applyAnimations();
        this.setupRefresh();
    }

    applyAnimations() {
        // Ensure home section is always visible
        const homeSection = document.querySelector('#home');
        if (homeSection) {
            homeSection.style.opacity = '1';
            homeSection.style.visibility = 'visible';
            homeSection.style.transform = 'none';
            homeSection.style.pointerEvents = 'auto';
        }

        // Add animations to sections
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionId = section.id;
            if (sectionId === 'home' || sectionId === 'skills' || sectionId === 'certifications') {
                section.style.opacity = '1';
                section.style.visibility = 'visible';
                section.style.transform = 'none';
                section.style.pointerEvents = 'auto';
                return;
            }
            section.setAttribute('data-aos', 'fade-up');
            section.setAttribute('data-aos-duration', '1000');
            section.setAttribute('data-aos-delay', '100');
        });

        // Section headers
        document.querySelectorAll('.section-header').forEach(header => {
            header.setAttribute('data-aos', 'fade-down');
            header.setAttribute('data-aos-duration', '800');
            header.setAttribute('data-aos-delay', '200');
        });

        // Hero content
        document.querySelectorAll('.hero-content').forEach(content => {
            content.setAttribute('data-aos', 'fade-right');
            content.setAttribute('data-aos-duration', '1000');
        });

        // Profile frame
        document.querySelectorAll('.profile-frame').forEach(frame => {
            frame.setAttribute('data-aos', 'fade-left');
            frame.setAttribute('data-aos-duration', '1000');
        });

        // Cards
        document.querySelectorAll('.skill-card, .project-card, .cert-card').forEach(card => {
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-duration', '800');
            card.setAttribute('data-aos-delay', '200');
        });

        // Ensure skills and certifications remain visible
        this.ensureSectionsVisible();
    }

    ensureSectionsVisible() {
        document.querySelectorAll('#skills, #certifications').forEach(section => {
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.transform = 'none';
            section.style.pointerEvents = 'auto';
        });
    }

    setupRefresh() {
        // Refresh on load
        window.addEventListener('load', () => {
            setTimeout(() => {
                AOS.refresh();
                this.ensureSectionsVisible();
            }, 100);
        });

        // Refresh on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                AOS.refresh();
                this.ensureSectionsVisible();
            }, 250);
        });

        // Initial refresh
        setTimeout(() => {
            AOS.refresh();
            this.ensureSectionsVisible();
        }, 100);
    }
}
