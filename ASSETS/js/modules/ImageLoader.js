/**
 * Image Loader Module
 * Handles lazy loading of images with intersection observer
 */

export class ImageLoader {
    constructor() {
        this.images = document.querySelectorAll('img[loading="lazy"]');
    }

    init() {
        if (!this.images.length) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        this.images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                imageObserver.observe(img);
            }
        });
    }
}
