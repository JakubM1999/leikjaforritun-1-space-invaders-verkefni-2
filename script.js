document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicator = document.querySelector('.slide-indicator');
    
    // Create and append the static overlay
    const staticOverlay = document.createElement('div');
    staticOverlay.classList.add('tv-static');
    document.body.appendChild(staticOverlay);

    let currentSlide = 0;
    const totalSlides = slides.length;
    let isTransitioning = false;

    function updateSlide() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update indicator (e.g., 01 / 08)
        if (indicator) {
            const current = String(currentSlide + 1).padStart(2, '0');
            const total = String(totalSlides).padStart(2, '0');
            indicator.textContent = `${current} / ${total}`;
        }

        // Disable buttons at ends
        if (prevBtn) prevBtn.disabled = (currentSlide === 0);
        if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides - 1);
    }

    function triggerTransition(callback) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Start Static & Distortion
        staticOverlay.classList.add('active');
        document.body.classList.add('distort-active');

        // Wait for the "static" to fully obscure the screen (approx 150ms)
        setTimeout(() => {
            callback(); // Change the actual slide content here
        }, 150);

        // End transition after animation is done (300ms total)
        setTimeout(() => {
            staticOverlay.classList.remove('active');
            document.body.classList.remove('distort-active');
            isTransitioning = false;
        }, 300);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            triggerTransition(() => {
                currentSlide++;
                updateSlide();
            });
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            triggerTransition(() => {
                currentSlide--;
                updateSlide();
            });
        }
    }

    // Event Listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        
        if (e.code === 'ArrowRight' || e.code === 'Space') {
            nextSlide();
        } else if (e.code === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Initial Display
    updateSlide();

    // --- CAROUSEL LOGIC (Multi-Instance) ---
    const carousels = document.querySelectorAll('.carousel-wrapper');

    carousels.forEach(carousel => {
        const cItems = carousel.querySelectorAll('.carousel-item');
        const cToggles = carousel.querySelectorAll('.carousel-toggle');
        let cIndex = 0;

        function updateCarousel() {
            if (cItems.length === 0) return;

            // Update Items
            cItems.forEach((item, index) => {
                const vid = item.querySelector('video');
                if (index === cIndex) {
                    item.classList.add('active');
                    if(vid) vid.play();
                } else {
                    item.classList.remove('active');
                    if(vid) vid.pause();
                }
            });

            // Update Toggles
            cToggles.forEach((btn, index) => {
                if (index === cIndex) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Attach listeners to toggles
        cToggles.forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                if (idx !== null) {
                    cIndex = parseInt(idx);
                    updateCarousel();
                }
            });
        });

        // Init this carousel
        if (cItems.length > 0) {
            updateCarousel();
        }
    });
});
