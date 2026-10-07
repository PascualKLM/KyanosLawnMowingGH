document.addEventListener('DOMContentLoaded', function() {
    const scrollThreshold = 500;
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > scrollThreshold) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
        function checkFadeElements() {
            fadeElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100 && elementBottom > 0) {
                    element.classList.add('visible');
                }
            });
        }
        
        window.addEventListener('scroll', checkFadeElements);
        checkFadeElements();
    }
    
    const toggleButtons = document.querySelectorAll('[data-toggle]');
    
    if (toggleButtons.length > 0) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-toggle');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                    
                    this.setAttribute('aria-expanded', !expanded);
                    targetElement.style.display = expanded ? 'none' : 'block';
                    
                    if (!expanded) {
                        targetElement.style.maxHeight = targetElement.scrollHeight + 'px';
                    } else {
                        targetElement.style.maxHeight = null;
                    }
                }
            });
        });
    }
    
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            
            this.setAttribute('aria-expanded', !expanded);
            mobileMenu.style.display = expanded ? 'none' : 'block';
            
            if (expanded) {
                document.body.classList.remove('menu-open');
                mobileMenuToggle.innerHTML = '<span class="sr-only">Open menu</span>&#9776;';
            } else {
                document.body.classList.add('menu-open');
                mobileMenuToggle.innerHTML = '<span class="sr-only">Close menu</span>&times;';
            }
        });
    }
    
    // The contact form uses its native action/method and browser validation.
    // Do not prevent submission or show success before Formspree responds.

    document.querySelectorAll('.comparison-slider, .comparison-slider-fullwidth')
        .forEach(initializeSlider);

    initializeLightbox();
});

function initializeSlider(slider) {
    const control = slider.querySelector('.slider-control');
    const beforeLabel = slider.querySelector('.before-label');
    const afterLabel = slider.querySelector('.after-label');
    if (!control || !beforeLabel || !afterLabel) return;

    let position = 50;
    let activePointerId = null;

    function updatePosition(nextPosition) {
        position = Math.round(Math.max(0, Math.min(100, nextPosition)) * 10) / 10;
        // Both images stay full size; CSS clips the before layer without resizing it.
        slider.style.setProperty('--slider-position', position + '%');
        control.setAttribute('aria-valuenow', String(position));
        control.setAttribute('aria-valuetext',
            `${Math.round(position)}% before, ${100 - Math.round(position)}% after`);

        const beforeVisibility = Math.min(1, position / 25);
        const afterVisibility = Math.min(1, (100 - position) / 25);
        beforeLabel.style.opacity = String(beforeVisibility);
        beforeLabel.style.transform = `translateX(-${(1 - beforeVisibility) * 100}%)`;
        afterLabel.style.opacity = String(afterVisibility);
        afterLabel.style.transform = `translateX(${(1 - afterVisibility) * 100}%)`;
    }

    function updateFromPointer(event) {
        const rect = slider.getBoundingClientRect();
        if (rect.width > 0) updatePosition((event.clientX - rect.left) / rect.width * 100);
    }

    function finishDragging(event) {
        if (event.pointerId !== activePointerId) return;
        activePointerId = null;
        slider.classList.remove('is-dragging');
        if (slider.hasPointerCapture(event.pointerId)) {
            slider.releasePointerCapture(event.pointerId);
        }
    }

    slider.addEventListener('pointerdown', function(event) {
        if (!event.isPrimary || event.button !== 0) return;
        activePointerId = event.pointerId;
        slider.setPointerCapture(event.pointerId);
        slider.classList.add('is-dragging');
        control.focus({ preventScroll: true });
        updateFromPointer(event);
        if (event.pointerType === 'mouse') event.preventDefault();
    });

    slider.addEventListener('pointermove', function(event) {
        if (event.pointerId === activePointerId) updateFromPointer(event);
    });

    slider.addEventListener('pointerup', finishDragging);
    slider.addEventListener('pointercancel', finishDragging);
    slider.addEventListener('lostpointercapture', finishDragging);

    control.addEventListener('keydown', function(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const step = event.shiftKey ? 10 : 1;
        let nextPosition;
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowDown': nextPosition = position - step; break;
            case 'ArrowRight':
            case 'ArrowUp': nextPosition = position + step; break;
            case 'PageDown': nextPosition = position - 10; break;
            case 'PageUp': nextPosition = position + 10; break;
            case 'Home': nextPosition = 0; break;
            case 'End': nextPosition = 100; break;
            default: return;
        }
        event.preventDefault();
        updatePosition(nextPosition);
    });

    updatePosition(position);
}

function initializeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;

    const image = document.getElementById('lightbox-image');
    const caption = document.getElementById('lightbox-caption');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const previousButton = lightbox.querySelector('.lightbox-previous');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    if (!image || !caption || !closeButton || galleryItems.length === 0) return;

    let currentIndex = 0;
    let returnFocus = null;
    let touchStart = null;

    function showImage(index) {
        currentIndex = (index + galleryItems.length) % galleryItems.length;
        const item = galleryItems[currentIndex];
        const thumbnail = item.querySelector('img');
        const description = item.querySelector('.gallery-caption');
        if (!thumbnail) return;
        image.src = thumbnail.currentSrc || thumbnail.src;
        image.alt = thumbnail.alt;
        caption.textContent = description ? description.textContent : thumbnail.alt;
    }

    function openLightbox(index, trigger) {
        showImage(index);
        if (lightbox.open) return;
        returnFocus = trigger;
        // Native modal dialogs keep the background inert and contain keyboard focus.
        lightbox.showModal();
        document.body.classList.add('lightbox-open');
        closeButton.focus({ preventScroll: true });
    }

    galleryItems.forEach(function(item, index) {
        item.addEventListener('click', function() {
            openLightbox(index, item);
        });
    });

    closeButton.addEventListener('click', function() {
        lightbox.close();
    });

    if (previousButton) previousButton.addEventListener('click', function() {
        showImage(currentIndex - 1);
    });
    if (nextButton) nextButton.addEventListener('click', function() {
        showImage(currentIndex + 1);
    });

    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) lightbox.close();
    });

    lightbox.addEventListener('keydown', function(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            showImage(currentIndex + 1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showImage(currentIndex - 1);
        }
        // Escape is handled by the dialog's native cancel behavior.
    });

    lightbox.addEventListener('touchstart', function(event) {
        const touch = event.touches[0];
        touchStart = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(event) {
        const touch = event.changedTouches[0];
        if (!touchStart || !touch) return;
        const dx = touch.clientX - touchStart.x;
        const dy = touch.clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            showImage(currentIndex + (dx < 0 ? 1 : -1));
        }
    }, { passive: true });

    lightbox.addEventListener('touchcancel', function() {
        touchStart = null;
    }, { passive: true });

    lightbox.addEventListener('close', function() {
        document.body.classList.remove('lightbox-open');
        touchStart = null;
        if (returnFocus && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
    });
}
