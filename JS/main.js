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
    
    const formElements = document.querySelectorAll('.contact-form');
    
    if (formElements.length > 0) {
        formElements.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                let valid = true;
                const requiredFields = form.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        valid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (valid) {
                    const submitButton = form.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.disabled = true;
                        submitButton.textContent = 'Sending...';
                    }
                    
                    const formData = new FormData(form);
                    const formMessage = form.querySelector('.form-message');
                    
                    if (formMessage) {
                        formMessage.textContent = 'Thank you! Your message has been sent successfully.';
                        formMessage.style.display = 'block';
                        formMessage.classList.add('success');
                    }
                    
                    form.reset();
                    
                    if (submitButton) {
                        setTimeout(() => {
                            submitButton.disabled = false;
                            submitButton.textContent = 'Send Message';
                        }, 3000);
                    }
                }
            });
        });
    }
    
    try {
        const mainSlider = document.getElementById('comparison-slider');
        if (mainSlider) {
            initializeSlider(
                'comparison-slider',
                'clip-container',
                'slider-control',
                'slider-divider',
                'before-label',
                'after-label'
            );
        }
        
        const slider1 = document.getElementById('comparison-slider-1');
        if (slider1) {
            initializeSlider(
                'comparison-slider-1', 
                'clip-container-1', 
                'slider-control-1', 
                'slider-divider-1', 
                'before-label-1', 
                'after-label-1'
            );
        }
        
        const slider2 = document.getElementById('comparison-slider-2');
        if (slider2) {
            initializeSlider(
                'comparison-slider-2', 
                'clip-container-2', 
                'slider-control-2', 
                'slider-divider-2', 
                'before-label-2', 
                'after-label-2'
            );
        }
        
        const slider3 = document.getElementById('comparison-slider-3');
        if (slider3) {
            initializeSlider(
                'comparison-slider-3', 
                'clip-container-3', 
                'slider-control-3', 
                'slider-divider-3', 
                'before-label-3', 
                'after-label-3'
            );
        }
    } catch (error) {
        console.error("Error initializing sliders:", error);
    }
    
    try {
        const lightbox = document.getElementById('image-lightbox');
        if (lightbox) {
            const lightboxImg = document.getElementById('lightbox-image');
            const lightboxCaption = document.getElementById('lightbox-caption');
            const lightboxClose = document.querySelector('.lightbox-close');
            const galleryImages = document.querySelectorAll('.gallery-item img');
            
            if (galleryImages.length > 0) {
                galleryImages.forEach(function(img) {
                    img.addEventListener('click', function() {
                        openLightbox(this);
                    });
                });
            }
            
            if (lightboxClose) {
                lightboxClose.addEventListener('click', function() {
                    closeLightbox();
                });
            }
            
            lightbox.addEventListener('click', function(event) {
                if (event.target === lightbox) {
                    closeLightbox();
                }
            });
            
            document.addEventListener('keydown', function(event) {
                if (lightbox.style.display === 'block') {
                    if (event.key === 'Escape') {
                        closeLightbox();
                    } else if (event.key === 'ArrowRight') {
                        showNextImage();
                    } else if (event.key === 'ArrowLeft') {
                        showPrevImage();
                    }
                }
            });
            
            let touchstartX = 0;
            let touchendX = 0;
            
            lightbox.addEventListener('touchstart', e => {
                touchstartX = e.changedTouches[0].screenX;
            });
            
            lightbox.addEventListener('touchend', e => {
                touchendX = e.changedTouches[0].screenX;
                
                if (touchendX < touchstartX - 50) {
                    showNextImage();
                }
                
                if (touchendX > touchstartX + 50) {
                    showPrevImage();
                }
            });
        }
    } catch (error) {
        console.error("Error initializing lightbox:", error);
    }
});

function initializeSlider(sliderId, clipId, controlId, dividerId, beforeLabelId, afterLabelId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const clipContainer = document.getElementById(clipId);
    const sliderControl = document.getElementById(controlId);
    const sliderDivider = document.getElementById(dividerId);
    const beforeLabel = document.getElementById(beforeLabelId);
    const afterLabel = document.getElementById(afterLabelId);
    
    if (!clipContainer || !sliderControl || !sliderDivider || !beforeLabel || !afterLabel) return;
    
    let isDragging = false;
    
    updatePosition(50);
    
    sliderControl.addEventListener('mousedown', function(e) {
        startDragging(e);
        e.preventDefault();
    });
    
    sliderControl.addEventListener('touchstart', function(e) {
        startDragging(e);
        e.preventDefault(); // Prevent default touch behavior
    }, { passive: false });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        handleMove(e.clientX);
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging || !e.touches[0]) return;
        handleMove(e.touches[0].clientX);
        e.preventDefault(); // Prevent scrolling when dragging
    }, { passive: false });
    
    document.addEventListener('mouseup', function() {
        endDragging();
    });
    
    document.addEventListener('touchend', function() {
        endDragging();
    });
    
    slider.addEventListener('click', function(e) {
        if (e.target === sliderControl) return;
        handleSliderClick(e);
    });
    
    function startDragging(e) {
        isDragging = true;
        slider.style.cursor = 'grabbing';
    }
    
    function endDragging() {
        isDragging = false;
        slider.style.cursor = 'col-resize';
    }
    
    function handleMove(clientX) {
        updatePositionFromClientX(clientX);
    }
    
    function handleSliderClick(e) {
        updatePositionFromClientX(e.clientX);
    }
    
    function updatePositionFromClientX(clientX) {
        const rect = slider.getBoundingClientRect();
        const position = (clientX - rect.left) / rect.width * 100;
        updatePosition(position);
    }
    
    function updatePosition(position) {
        position = Math.max(0, Math.min(100, position));
        
        clipContainer.style.width = position + '%';
        sliderControl.style.left = position + '%';
        sliderDivider.style.left = position + '%';
        
        updateLabelPositions(position);
    }
    
    function updateLabelPositions(position) {
        beforeLabel.style.fontSize = '18px';
        beforeLabel.style.padding = '8px 16px';
        beforeLabel.style.bottom = '15px';
        beforeLabel.style.transform = 'translateX(0)';
        beforeLabel.style.opacity = '1';
        
        afterLabel.style.fontSize = '18px';
        afterLabel.style.padding = '8px 16px';
        afterLabel.style.bottom = '15px';
        afterLabel.style.transform = 'translateX(0)';
        afterLabel.style.opacity = '1';
        
        const moveThreshold = 25;
        
        if (position < moveThreshold) {
            const disappearFactor = 1 - (position / moveThreshold);
            beforeLabel.style.transform = `translateX(-${disappearFactor * 200}%)`;
            beforeLabel.style.opacity = 1 - disappearFactor;
        } else if (position > 50) {
            const enhancement = (position - 50) / 50;
            if (enhancement > 0.2) {
                beforeLabel.style.fontSize = `${18 + (enhancement * 4)}px`;
                beforeLabel.style.padding = `${8 + (enhancement * 5)}px ${16 + (enhancement * 8)}px`;
                beforeLabel.style.bottom = `${15 + (enhancement * 5)}px`;
            }
        }
        
        if (position > (100 - moveThreshold)) {
            const disappearFactor = (position - (100 - moveThreshold)) / moveThreshold;
            afterLabel.style.transform = `translateX(${disappearFactor * 200}%)`;
            afterLabel.style.opacity = 1 - disappearFactor;
        } else if (position < 50) {
            const enhancement = (50 - position) / 50;
            if (enhancement > 0.2) {
                afterLabel.style.fontSize = `${18 + (enhancement * 4)}px`;
                afterLabel.style.padding = `${8 + (enhancement * 5)}px ${16 + (enhancement * 8)}px`;
                afterLabel.style.bottom = `${15 + (enhancement * 5)}px`;
            }
        }
    }
}

function openLightbox(imgElement) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (!lightbox || !lightboxImg || !lightboxCaption) return;
    
    lightbox.style.display = 'block';
    
    lightboxImg.src = imgElement.src;
    const galleryItem = imgElement.closest('.gallery-item');
    if (galleryItem) {
        const caption = galleryItem.querySelector('.gallery-caption');
        if (caption) {
            lightboxCaption.textContent = caption.textContent;
        } else {
            lightboxCaption.textContent = '';
        }
    } else {
        lightboxCaption.textContent = '';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;
    
    lightbox.style.display = 'none';
}

function showNextImage() {
    const lightboxImg = document.getElementById('lightbox-image');
    if (!lightboxImg) return;
    
    const galleryImages = document.querySelectorAll('.gallery-item img');
    if (galleryImages.length === 0) return;
    
    let currentIndex = -1;
    galleryImages.forEach((img, index) => {
        if (img.src === lightboxImg.src) {
            currentIndex = index;
        }
    });
    
    if (currentIndex >= 0) {
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        openLightbox(galleryImages[nextIndex]);
    }
}

function showPrevImage() {
    const lightboxImg = document.getElementById('lightbox-image');
    if (!lightboxImg) return;
    
    const galleryImages = document.querySelectorAll('.gallery-item img');
    if (galleryImages.length === 0) return;
    
    let currentIndex = -1;
    galleryImages.forEach((img, index) => {
        if (img.src === lightboxImg.src) {
            currentIndex = index;
        }
    });
    
    if (currentIndex >= 0) {
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(galleryImages[prevIndex]);
    }
}
