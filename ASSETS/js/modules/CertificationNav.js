/**
 * Certification Navigation Module
 * Handles navigation between certification rows with swipe support
 */

export class CertificationNav {
    constructor() {
        this.prevBtn = document.getElementById('prevCert');
        this.nextBtn = document.getElementById('nextCert');
        this.rowsContainer = document.querySelector('.cert-rows');
        this.certContainer = document.querySelector('.certifications-container');
        this.allRows = this.rowsContainer ? Array.from(this.rowsContainer.children) : [];
        this.currentRow = 1;
        this.totalRows = this.allRows.length > 0 ? Math.max(1, this.allRows.length) : 0;
        this.isAnimating = false;
        this.cards = [];
        this.currentCardIndex = 0;
        this.mode = 'row';
        this.dotsContainer = null;

        // Swipe support
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.minSwipeDistance = 50;
        this.touchStartY = 0;
        this.announcementEl = null;
        this.didCreateAnnouncer = false;

        this.boundNavigatePrev = () => this.navigate('prev');
        this.boundNavigateNext = () => this.navigate('next');
        this.boundHandleResize = () => this.handleResize();
        this.boundHandleTouchStart = (e) => this.handleTouchStart(e);
        this.boundHandleTouchMove = (e) => this.handleTouchMove(e);
        this.boundHandleTouchEnd = (e) => this.handleTouchEnd(e);
    }

    init() {
        if (!this.prevBtn || !this.nextBtn) return;
        this.setupMode();
        this.announcementEl = document.getElementById('certification-announcer');
        if (!this.announcementEl) {
            this.announcementEl = document.createElement('div');
            this.announcementEl.id = 'certification-announcer';
            this.announcementEl.setAttribute('aria-live', 'polite');
            this.announcementEl.setAttribute('role', 'status');
            Object.assign(this.announcementEl.style, {
                position: 'absolute',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                clip: 'rect(1px, 1px, 1px, 1px)',
                clipPath: 'inset(50%)',
                whiteSpace: 'nowrap'
            });
            document.body.appendChild(this.announcementEl);
            this.didCreateAnnouncer = true;
        }
        this.prevBtn.addEventListener('click', this.boundNavigatePrev);
        this.nextBtn.addEventListener('click', this.boundNavigateNext);
        window.addEventListener('resize', this.boundHandleResize);
        
        // Add swipe support for mobile/tablet
        if (this.rowsContainer) {
            this.rowsContainer.addEventListener('touchstart', this.boundHandleTouchStart, { passive: true });
            this.rowsContainer.addEventListener('touchmove', this.boundHandleTouchMove, { passive: true });
            this.rowsContainer.addEventListener('touchend', this.boundHandleTouchEnd, { passive: true });
        }

        // Allow clicking a certificate to open the image inline overlay
        this.enableImageOverlay();

        this.announcePosition();
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }

    handleTouchMove(e) {
        if (!e.changedTouches || !e.changedTouches.length) return;
        const touch = e.changedTouches[0];
        const deltaX = Math.abs(touch.screenX - this.touchStartX);
        const deltaY = Math.abs(touch.screenY - this.touchStartY);

        if (deltaY > deltaX + 10) {
            // User is scrolling vertically; cancel swipe detection
            this.touchStartX = 0;
            this.touchEndX = 0;
        }
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        if (this.touchStartX === 0 && this.touchEndX === 0) return;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) < this.minSwipeDistance) return;
        
        if (swipeDistance > 0) {
            // Swiped right - go to previous
            this.navigate('prev');
        } else {
            // Swiped left - go to next
            this.navigate('next');
        }

        this.announcePosition();
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    createDotIndicators() {
        // Remove existing dots if any
        const existingDots = document.querySelector('.cert-dots');
        if (existingDots) existingDots.remove();

        const totalItems = this.mode === 'single' ? this.cards.length : this.totalRows;
        if (totalItems <= 1 || !this.certContainer) return;

        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'cert-dots';
        this.dotsContainer.setAttribute('role', 'tablist');
        this.dotsContainer.setAttribute('aria-label', 'Certificate navigation');

        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('button');
            dot.className = 'cert-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to ${this.mode === 'single' ? 'certificate' : 'page'} ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            
            if (i === (this.mode === 'single' ? this.currentCardIndex : this.currentRow - 1)) {
                dot.classList.add('active');
            }

            dot.addEventListener('click', () => this.goToIndex(i));
            this.dotsContainer.appendChild(dot);
        }

        this.certContainer.appendChild(this.dotsContainer);
    }

    goToIndex(index) {
        if (this.mode === 'single') {
            if (index === this.currentCardIndex || index < 0 || index >= this.cards.length) return;
            
            this.cards[this.currentCardIndex].classList.remove('active-card');
            this.cards[index].classList.add('active-card');
            this.currentCardIndex = index;
            this.syncRowWithActiveCard();
        } else {
            if (index === this.currentRow - 1 || index < 0 || index >= this.totalRows) return;

            const currentIdx = this.currentRow - 1;
            const currentRowEl = this.allRows[currentIdx];
            const nextRowEl = this.allRows[index];

            if (!currentRowEl || !nextRowEl) return;

            this.isAnimating = true;

            currentRowEl.classList.remove('active');
            currentRowEl.classList.add(index > currentIdx ? 'prev' : 'next');

            nextRowEl.classList.remove('prev', 'next');
            nextRowEl.classList.add('active');

            this.currentRow = index + 1;

            setTimeout(() => {
                this.isAnimating = false;
            }, 400);
        }
        
        this.updateButtons();
        this.updateDots();
    }

    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.cert-dot');
        const activeIndex = this.mode === 'single' ? this.currentCardIndex : this.currentRow - 1;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
            dot.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
        });

        this.announcePosition();
    }

    navigate(direction) {
        if (this.mode === 'single') {
            this.navigateCard(direction);
            return;
        }

        if (this.isAnimating || this.totalRows <= 1) return;

        const currentIdx = this.currentRow - 1;
        let nextIdx;

        if (direction === 'next') {
            if (this.currentRow >= this.totalRows) return;
            nextIdx = currentIdx + 1;
        } else {
            if (this.currentRow <= 1) return;
            nextIdx = currentIdx - 1;
        }

        const currentRowEl = this.allRows[currentIdx];
        const nextRowEl = this.allRows[nextIdx];

        if (!currentRowEl || !nextRowEl) return;

        this.isAnimating = true;

        currentRowEl.classList.remove('active');
        currentRowEl.classList.add(direction === 'next' ? 'prev' : 'next');

        nextRowEl.classList.remove('prev', 'next');
        nextRowEl.classList.add('active');

        this.currentRow = nextIdx + 1;
        this.updateButtons();
        this.updateDots();

        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }

    navigateCard(direction) {
        if (this.cards.length <= 1) return;

        let nextIdx = this.currentCardIndex + (direction === 'next' ? 1 : -1);
        if (nextIdx < 0 || nextIdx >= this.cards.length) return;

        this.cards[this.currentCardIndex].classList.remove('active-card');
        this.cards[nextIdx].classList.add('active-card');

        this.currentCardIndex = nextIdx;
        this.syncRowWithActiveCard();
        this.updateButtons();
        this.updateDots();
    }

    setupMode() {
        this.allRows = this.rowsContainer ? Array.from(this.rowsContainer.children) : [];
        this.totalRows = this.allRows.length > 0 ? Math.max(1, this.allRows.length) : 0;

        // Mobile-only single-card carousel (tablets use row mode)
        const desiredMode = window.innerWidth <= 767 ? 'single' : 'row';
        this.mode = desiredMode;

        if (this.mode === 'single') {
            this.setupSingleMode();
        } else {
            this.setupRowMode();
        }

        this.createDotIndicators();
        this.updateButtons();
        this.announcePosition();
    }

    setupRowMode() {
        this.isAnimating = false;
        this.cards.forEach(card => card.classList.remove('active-card'));
        this.cards = [];

        if (!this.rowsContainer || this.allRows.length === 0) {
            return;
        }

        if (this.currentRow > this.totalRows) {
            this.currentRow = this.totalRows;
        }

        this.allRows.forEach((row, index) => {
            row.classList.remove('active', 'prev', 'next');
            if (index === (this.currentRow - 1)) {
                row.classList.add('active');
            } else if (index > (this.currentRow - 1)) {
                row.classList.add('next');
            } else {
                row.classList.add('prev');
            }
        });
    }

    setupSingleMode() {
        // Count all visible base cards (CSS hides desktop-only-card and lt-only-card on mobile)
        this.cards = Array.from(document.querySelectorAll('.cert-card:not(.desktop-only-card):not(.lt-only-card)'));
        if (this.cards.length === 0) return;

        if (this.currentCardIndex < 0 || this.currentCardIndex >= this.cards.length) {
            this.currentCardIndex = 0;
        }

        this.cards.forEach((card, index) => {
            card.classList.toggle('active-card', index === this.currentCardIndex);
        });

        this.syncRowWithActiveCard();
    }

    syncRowWithActiveCard() {
        if (!this.cards.length || !this.allRows.length) return;
        const activeCard = this.cards[this.currentCardIndex];
        if (!activeCard) return;

        const parentRow = activeCard.closest('.cert-row');
        if (!parentRow) return;

        this.allRows.forEach(row => row.classList.remove('active', 'prev', 'next'));
        parentRow.classList.add('active');
    }

    handleResize() {
        const newMode = window.innerWidth <= 767 ? 'single' : 'row';
        if (newMode === this.mode) return;
        if (newMode === 'row') {
            this.currentRow = Math.max(1, Math.min(this.currentRow, this.totalRows));
        }
        if (newMode === 'single') {
            this.currentCardIndex = Math.max(0, Math.min(this.currentCardIndex, this.cards.length - 1));
        }
        this.mode = newMode;
        this.setupMode();
    }

    updateButtons() {
        if (this.mode === 'single') {
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentCardIndex <= 0;
                this.prevBtn.setAttribute('aria-disabled', this.currentCardIndex <= 0 ? 'true' : 'false');
            }
            if (this.nextBtn) {
                const isDisabled = this.cards.length === 0 || this.currentCardIndex >= this.cards.length - 1;
                this.nextBtn.disabled = isDisabled;
                this.nextBtn.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
            }
            return;
        }

        if (this.prevBtn) {
            const isDisabled = this.totalRows <= 1 || this.currentRow <= 1;
            this.prevBtn.disabled = isDisabled;
            this.prevBtn.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
        }
        if (this.nextBtn) {
            const isDisabled = this.totalRows <= 1 || this.currentRow >= this.totalRows;
            this.nextBtn.disabled = isDisabled;
            this.nextBtn.setAttribute('aria-disabled', isDisabled ? 'true' : 'false');
        }
    }

    enableImageOverlay() {
        const images = document.querySelectorAll('.cert-card .cert-image');
        if (!images.length) return;

        // Create a single reusable overlay
        const overlay = document.createElement('div');
        overlay.className = 'cert-overlay hidden';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Certificate preview');

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'cert-overlay__img-wrapper';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'cert-overlay__close';
        closeBtn.setAttribute('aria-label', 'Close certificate preview');
        closeBtn.innerHTML = '&times;';

        const overlayImg = document.createElement('img');
        overlayImg.className = 'cert-overlay__img';
        overlayImg.alt = 'Certificate preview';

        imgWrapper.appendChild(overlayImg);
        overlay.appendChild(closeBtn);
        overlay.appendChild(imgWrapper);
        document.body.appendChild(overlay);

        const hideOverlay = () => {
            // Unlock scroll immediately for instant responsiveness
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            // Then trigger fade out animation
            requestAnimationFrame(() => {
                overlay.classList.add('hidden');
            });
        };

        const showOverlay = (src, altText) => {
            overlayImg.src = src;
            overlayImg.alt = altText || 'Certificate preview';
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        };

        closeBtn.addEventListener('click', hideOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) hideOverlay();
        });
        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('hidden') && e.key === 'Escape') hideOverlay();
        });

        images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                if (!src) return;
                showOverlay(src, img.getAttribute('alt'));
            });
        });
    }

    cleanup() {
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.boundNavigatePrev);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.boundNavigateNext);
        }
        if (this.rowsContainer) {
            this.rowsContainer.removeEventListener('touchstart', this.boundHandleTouchStart);
            this.rowsContainer.removeEventListener('touchmove', this.boundHandleTouchMove);
            this.rowsContainer.removeEventListener('touchend', this.boundHandleTouchEnd);
        }
        window.removeEventListener('resize', this.boundHandleResize);
        
        // Remove dot indicators
        if (this.dotsContainer) {
            this.dotsContainer.remove();
        }

        if (this.didCreateAnnouncer && this.announcementEl) {
            this.announcementEl.remove();
        }
        this.announcementEl = null;
    }

    announcePosition() {
        if (!this.announcementEl) return;

        const total = this.mode === 'single' ? this.cards.length : this.totalRows;
        if (total <= 0) return;

        const index = this.mode === 'single' ? this.currentCardIndex + 1 : this.currentRow;
        this.announcementEl.textContent = `Showing ${index} of ${total} certifications`;
    }
}
