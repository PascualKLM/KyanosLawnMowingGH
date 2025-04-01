document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in-element');
    
    if (fadeElements.length > 0) {
        window.addEventListener('scroll', checkFadeElements);
        checkFadeElements();
    }
    
    function checkFadeElements() {
        const triggerBottom = window.innerHeight * 0.8;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            } else {
                element.classList.remove('visible');
            }
        });
    }
    
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
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
    
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        initializeLightbox();
    }
});

function initializeSlider(sliderId, clipId, controlId, dividerId, beforeLabelId, afterLabelId) {
    const slider = document.getElementById(sliderId);
    const clipContainer = document.getElementById(clipId);
    const sliderControl = document.getElementById(controlId);
    const sliderDivider = document.getElementById(dividerId);
    const beforeLabel = document.getElementById(beforeLabelId);
    const afterLabel = document.getElementById(afterLabelId);
    
    if (!slider || !clipContainer || !sliderControl || !sliderDivider || !beforeLabel || !afterLabel) {
        return;
    }
    
    let isDragging = false;
    
    function startDragging(e) {
        e.preventDefault();
        isDragging = true;
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', endDragging);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', endDragging);
    }
    
    function endDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', endDragging);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', endDragging);
    }
    
    function handleMove(clientX) {
        if (isDragging) {
            updatePositionFromClientX(clientX);
        }
    }
    
    function handleTouchMove(e) {
        if (isDragging && e.touches.length > 0) {
            updatePositionFromClientX(e.touches[0].clientX);
            e.preventDefault();
        }
    }
    
    function handleSliderClick(e) {
        updatePositionFromClientX(e.clientX);
    }
    
    function updatePositionFromClientX(clientX) {
        const sliderRect = slider.getBoundingClientRect();
        const position = (clientX - sliderRect.left) / sliderRect.width;
        updatePosition(position);
    }
    
    function updatePosition(position) {
        position = Math.max(0, Math.min(position, 1));
        
        const percentage = position * 100;
        
        clipContainer.style.width = `${percentage}%`;
        sliderControl.style.left = `${percentage}%`;
        sliderDivider.style.left = `${percentage}%`;
        
        updateLabelPositions(percentage);
    }
    
    function updateLabelPositions(percentage) {
        if (percentage < 30) {
            beforeLabel.style.opacity = '0';
            beforeLabel.style.transform = 'translateX(-10px)';
        } else {
            beforeLabel.style.opacity = '1';
            beforeLabel.style.transform = 'translateX(0)';
        }
        
        if (percentage > 70) {
            afterLabel.style.opacity = '0';
            afterLabel.style.transform = 'translateX(10px)';
        } else {
            afterLabel.style.opacity = '1';
            afterLabel.style.transform = 'translateX(0)';
        }
    }
    
    sliderControl.addEventListener('mousedown', startDragging);
    sliderControl.addEventListener('touchstart', startDragging);
    slider.addEventListener('click', handleSliderClick);
    
    updatePosition(0.5);
}

function initializeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    function openLightbox(imgElement) {
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
        lightbox.style.display = 'none';
    }
    
    function showNextImage() {
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
